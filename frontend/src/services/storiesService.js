// Lapisan data cerita. Sekarang membaca dari stories.json (data tiruan).
// Nanti, isi fungsi-fungsi ini diganti fetch() ke backend — halaman tidak perlu diubah.
import stories from "../data/stories.json";
import { getCatalogMeta } from "./catalogApi";

const WORDS_PER_MINUTE = 200;
const PAGE_SIZE = 9;

const countWords = (text) => (text.match(/\S+/g) || []).length;
const minutesFor = (words) => Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
const normalize = (text) => text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function makeExcerpt(content, max = 90) {
  const text = content.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

function summarize(story) {
  const chapterCount = story.chapters.length;
  const freeCount = story.chapters.filter((c) => !c.is_locked).length;
  const words = story.chapters.reduce((total, c) => total + countWords(c.content), 0);
  return {
    slug: story.slug,
    title: story.title,
    origin: story.origin,
    category: story.category,
    synopsis: story.synopsis,
    cover_url: story.cover_url,
    chapterCount,
    freeCount,
    premiumCount: chapterCount - freeCount,
    readMinutes: minutesFor(words),
  };
}

const summaries = stories.map(summarize);
const searchIndex = new Map(
  stories.map((s) => [s.slug, normalize(`${s.title} ${s.origin} ${s.category} ${s.synopsis}`)])
);

// Daerah, kategori, dan statistik kini dari database (dimuat di main.jsx).
export const getRegions = () => getCatalogMeta().regions;
export const getTopRegions = (limit = 5) => getCatalogMeta().topRegions.slice(0, limit);
export const getCategories = () => getCatalogMeta().categories;
export const getStats = () => getCatalogMeta().stats;

const SORTERS = {
  chapters: (a, b) => b.chapterCount - a.chapterCount || a.title.localeCompare(b.title, "id"),
  title: (a, b) => a.title.localeCompare(b.title, "id"),
  short: (a, b) => a.readMinutes - b.readMinutes || a.title.localeCompare(b.title, "id"),
};

// Daftar cerita dengan pencarian, filter, urutan, dan halaman.
// categoryCounts dihitung dari hasil pencarian + daerah (sebelum filter kategori).
export function getStories({ q = "", region = "", category = "", sort = "chapters", page = 1, pageSize = PAGE_SIZE } = {}) {
  const needle = normalize(q.trim());
  const base = summaries.filter(
    (s) => (!region || s.origin === region) && (!needle || searchIndex.get(s.slug).includes(needle))
  );

  const categoryCounts = {};
  for (const s of base) categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;

  const filtered = base.filter((s) => !category || s.category === category).sort(SORTERS[sort] ?? SORTERS.chapters);
  const total = filtered.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, Number(page) || 1), pageCount);

  return {
    items: filtered.slice((current - 1) * pageSize, current * pageSize),
    total,
    baseTotal: base.length,
    page: current,
    pageCount,
    categoryCounts,
  };
}

// Detail cerita + daftar bab. ISI bab sengaja tidak ikut (seperti backend nanti):
// isi hanya diberikan oleh getChapter() setelah akses dicek (Step 3).
export function getStory(slug) {
  const story = stories.find((s) => s.slug === slug);
  if (!story) return null;
  return {
    ...summaries.find((s) => s.slug === slug),
    chapters: story.chapters.map((c) => ({
      chapter_number: c.chapter_number,
      title: `Bab ${c.chapter_number}`,
      excerpt: makeExcerpt(c.content),
      is_locked: c.is_locked,
      point_price: c.point_price,
      readMinutes: minutesFor(countWords(c.content)),
    })),
  };
}

// Cerita lain: utamakan daerah yang sama, lalu kategori yang sama.
export function getRelated(slug, limit = 3) {
  const current = summaries.find((s) => s.slug === slug);
  if (!current) return [];
  const others = summaries.filter((s) => s.slug !== slug);
  const sameRegion = others.filter((s) => s.origin === current.origin);
  const sameCategory = others.filter((s) => s.origin !== current.origin && s.category === current.category);
  return [...sameRegion, ...sameCategory].slice(0, limit);
}

//metadata satu bab (Tanpa Isi) + info bab sebelum dan sesudahnya. ISI bab sengaja tidak ikut (seperti backend nanti):
export function getChapter(slug, number) {
  const story = stories.find((s) => s.slug === slug);
  const index = story ? story.chapters.findIndex((c) => c.chapter_number === number) : -1;
  if (index === -1) return null;

  const c = story.chapters[index];
  const brief = (ch) =>
    ch && { number: ch.chapter_number, is_locked: ch.is_locked, point_price: ch.point_price };

  return {
    story: { slug, title: story.title, origin: story.origin, category: story.category },
    chapter_number: c.chapter_number,
    title: `Bab ${c.chapter_number}`,
    is_locked: c.is_locked,
    point_price: c.point_price,
    readMinutes: minutesFor(countWords(c.content)),
    total: story.chapters.length,
    prev: brief(story.chapters[index - 1]) ?? null,
    next: brief(story.chapters[index + 1]) ?? null,
  };
}

//isi bab yang dipisah dari metadata. endpoint ini digunakan untuk mengecek akses
export function getChapterContent(slug, number) {
  const story = stories.find((s) => s.slug === slug);
  return story?.chapters.find((c) => c.chapter_number === number)?.content ?? "";
}
