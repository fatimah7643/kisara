import { Router } from "express";
import { getCatalog } from "../lib/catalog.js";
import { HttpError, check } from "../lib/errors.js";
import { supabase } from "../lib/supabase.js";
import { jakartaDate } from "../lib/text.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Profil lengkap: bentuknya sama dengan objek profil yang dipakai frontend sekarang.
router.get("/me", requireAuth, async (req, res) => {
  const uid = req.user.id;

  const [profile, tx, bookmarks, unlocks, done, prog, catalog] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, email, name, role, region_interest, points, streak, last_check_in")
      .eq("id", uid)
      .maybeSingle(),
    supabase
      .from("point_transactions")
      .select("id, type, amount, note, story_id, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
      .limit(100),
    supabase.from("bookmarks").select("story_id").eq("user_id", uid).order("created_at", { ascending: false }),
    supabase.from("chapter_unlocks").select("chapter_id").eq("user_id", uid),
    supabase.from("chapter_completions").select("chapter_id").eq("user_id", uid),
    supabase.from("reading_progress").select("story_id, last_chapter, updated_at").eq("user_id", uid),
    getCatalog(),
  ]);

  const p = check(profile);
  if (!p) throw new HttpError(404, "Profil tidak ditemukan.");
  const { storyIndex, chapterIndex } = catalog;

  const unlocked = {};
  for (const { chapter_id } of check(unlocks)) {
    const ref = chapterIndex.get(chapter_id);
    if (ref) (unlocked[ref.slug] ??= []).push(ref.number);
  }

  const progress = {};
  for (const row of check(prog)) {
    const slug = storyIndex.get(row.story_id);
    if (slug) progress[slug] = { lastChapter: row.last_chapter, completed: [], updatedAt: row.updated_at };
  }
  for (const { chapter_id } of check(done)) {
    const ref = chapterIndex.get(chapter_id);
    if (!ref) continue;
    progress[ref.slug] ??= { lastChapter: null, completed: [], updatedAt: "" };
    progress[ref.slug].completed.push(ref.number);
  }
  for (const entry of Object.values(progress)) entry.completed.sort((a, b) => a - b);

  res.json({
    id: p.id,
    email: p.email ?? req.user.email,
    name: p.name,
    role: p.role,
    regionInterest: p.region_interest ?? "",
    points: p.points,
    streak: p.streak,
    lastCheckIn: p.last_check_in,
    serverDate: jakartaDate(),
    transactions: check(tx).map((t) => {
      const slug = t.story_id ? storyIndex.get(t.story_id) : null;
      return {
        id: t.id,
        type: t.type,
        amount: t.amount,
        note: slug ? `${t.note} · ${slug}` : t.note,
        createdAt: t.created_at,
      };
    }),
    bookmarks: check(bookmarks)
      .map((b) => storyIndex.get(b.story_id))
      .filter(Boolean),
    unlocked,
    progress,
  });
});

router.post("/me/bookmarks/:slug/toggle", requireAuth, async (req, res) => {
  const { bySlug } = await getCatalog();
  const entry = bySlug.get(req.params.slug);
  if (!entry) throw new HttpError(404, "Cerita tidak ditemukan.");

  const existing = check(
    await supabase
      .from("bookmarks")
      .select("story_id")
      .eq("user_id", req.user.id)
      .eq("story_id", entry.id)
      .maybeSingle()
  );

  if (existing) {
    check(await supabase.from("bookmarks").delete().eq("user_id", req.user.id).eq("story_id", entry.id));
  } else {
    check(await supabase.from("bookmarks").insert({ user_id: req.user.id, story_id: entry.id }));
  }
  res.json({ bookmarked: !existing });
});

router.post("/me/check-in", requireAuth, async (req, res) => {
  res.json(check(await supabase.rpc("daily_check_in", { p_user: req.user.id })));
});

export default router;