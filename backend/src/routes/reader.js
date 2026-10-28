import { Router } from "express";
import { findChapter, getCatalog, userCanRead } from "../lib/catalog.js";
import { HttpError, check } from "../lib/errors.js";
import { supabase } from "../lib/supabase.js";
import { optionalAuth, requireAuth } from "../middleware/auth.js";

const router = Router();

async function locate(slug, rawNumber) {
  const number = Number.parseInt(rawNumber, 10);
  const found = Number.isInteger(number) && number > 0 ? findChapter(await getCatalog(), slug, number) : null;
  if (!found) throw new HttpError(404, "Bab tidak ditemukan.");
  return { ...found, number };
}

const brief = (c) =>
  c ? { number: c.chapter_number, is_locked: c.is_locked, point_price: c.point_price } : null;

// Metadata bab. Isi bab ("content") HANYA ada bila bab gratis atau sudah dibuka pembaca ini.
router.get("/stories/:slug/chapters/:number", optionalAuth, async (req, res) => {
  const { entry, index, meta, chapterId } = await locate(req.params.slug, req.params.number);
  const canRead = await userCanRead(req.user?.id, chapterId, meta.is_locked);

  let content = null;
  if (canRead) {
    const row = check(await supabase.from("chapters").select("content").eq("id", chapterId).maybeSingle());
    content = row?.content ?? "";
  }

  res.json({
    story: {
      slug: entry.summary.slug,
      title: entry.summary.title,
      origin: entry.summary.origin,
      category: entry.summary.category,
    },
    chapter_number: meta.chapter_number,
    title: meta.title,
    is_locked: meta.is_locked,
    point_price: meta.point_price,
    readMinutes: meta.readMinutes,
    total: entry.chapters.length,
    prev: brief(entry.chapters[index - 1]),
    next: brief(entry.chapters[index + 1]),
    canRead,
    content,
  });
});

// Buka bab premium dengan koin (atomik di database; tidak menarik koin dua kali).
router.post("/stories/:slug/chapters/:number/unlock", requireAuth, async (req, res) => {
  const { chapterId } = await locate(req.params.slug, req.params.number);
  const result = check(
    await supabase.rpc("unlock_chapter", { p_user: req.user.id, p_chapter: chapterId })
  );
  res.json(result);
});

// Tandai bab selesai: simpan progres + reward koin (sekali per bab).
router.post("/stories/:slug/chapters/:number/complete", requireAuth, async (req, res) => {
  const { chapterId } = await locate(req.params.slug, req.params.number);
  const result = check(
    await supabase.rpc("complete_chapter", { p_user: req.user.id, p_chapter: chapterId })
  );
  res.json(result);
});

// Catat bab terakhir yang dibuka (untuk "Lanjutkan Membaca").
router.post("/me/progress", requireAuth, async (req, res) => {
  const { entry, meta, chapterId, number } = await locate(req.body?.slug, req.body?.chapter);
  if (!(await userCanRead(req.user.id, chapterId, meta.is_locked))) {
    throw new HttpError(403, "Bab ini belum dibuka.");
  }
  check(
    await supabase.from("reading_progress").upsert(
      {
        user_id: req.user.id,
        story_id: entry.id,
        last_chapter: number,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,story_id" }
    )
  );
  res.json({ ok: true });
});

export default router;