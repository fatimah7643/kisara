import { Router } from "express";
import { PAGE_SIZE } from "../config.js";
import { getCatalog } from "../lib/catalog.js";
import { HttpError } from "../lib/errors.js";
import { normalize } from "../lib/text.js";

const router = Router();

const cmp = (a, b) => a.localeCompare(b, "id");
const SORTERS = {
  chapters: (a, b) => b.chapterCount - a.chapterCount || cmp(a.title, b.title),
  title: (a, b) => cmp(a.title, b.title),
  short: (a, b) => a.readMinutes - b.readMinutes || cmp(a.title, b.title),
};
const text = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

// Data untuk navbar, beranda, dan filter katalog.
router.get("/catalog/meta", async (req, res) => {
  const { entries } = await getCatalog();
  const summaries = entries.map((e) => e.summary);

  const regions = [...new Set(summaries.map((s) => s.origin))]
    .filter((origin) => origin !== "Nusantara")
    .sort(cmp);

  const counts = new Map();
  for (const s of summaries) {
    if (s.origin !== "Nusantara") counts.set(s.origin, (counts.get(s.origin) || 0) + 1);
  }
  const topRegions = [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || cmp(a.name, b.name))
    .slice(0, 5);

  const categories = [...new Set(summaries.map((s) => s.category))].sort(cmp);

  res.json({
    regions,
    topRegions,
    categories,
    stats: {
      stories: summaries.length,
      chapters: summaries.reduce((t, s) => t + s.chapterCount, 0),
      freeChapters: summaries.reduce((t, s) => t + s.freeCount, 0),
      regions: regions.length,
    },
  });
});

router.get("/stories", async (req, res) => {
  const q = text(req.query.q ?? req.query.search, 80);
  const region = text(req.query.region, 80);
  const category = text(req.query.category, 40);
  const sort = SORTERS[req.query.sort] ? req.query.sort : "chapters";
  const pageSize = Math.min(50, Math.max(1, Number.parseInt(req.query.pageSize, 10) || PAGE_SIZE));

  const needle = normalize(q);
  const { entries } = await getCatalog();
  const base = entries.filter(
    (e) => (!region || e.summary.origin === region) && (!needle || e.search.includes(needle))
  );

  const categoryCounts = {};
  for (const e of base) {
    categoryCounts[e.summary.category] = (categoryCounts[e.summary.category] || 0) + 1;
  }

  const filtered = base
    .filter((e) => !category || e.summary.category === category)
    .map((e) => e.summary)
    .sort(SORTERS[sort]);

  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, Number.parseInt(req.query.page, 10) || 1), pageCount);

  res.json({
    items: filtered.slice((page - 1) * pageSize, page * pageSize),
    total,
    baseTotal: base.length,
    page,
    pageCount,
    categoryCounts,
  });
});

// Detail cerita + daftar bab (tanpa isi bab) + cerita terkait.
router.get("/stories/:slug", async (req, res) => {
  const { entries, bySlug } = await getCatalog();
  const entry = bySlug.get(req.params.slug);
  if (!entry) throw new HttpError(404, "Cerita tidak ditemukan.");

  const current = entry.summary;
  const others = entries.map((e) => e.summary).filter((s) => s.slug !== current.slug);
  const sameRegion = others.filter((s) => s.origin === current.origin);
  const sameCategory = others.filter((s) => s.origin !== current.origin && s.category === current.category);

  res.json({
    ...current,
    chapters: entry.chapters,
    related: [...sameRegion, ...sameCategory].slice(0, 3),
  });
});

export default router;