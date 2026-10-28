import { randomBytes } from "node:crypto";
import { Router } from "express";
import { CATEGORIES, config } from "../config.js";
import { getCatalog, invalidateCatalog } from "../lib/catalog.js";
import { HttpError, check } from "../lib/errors.js";
import { supabase } from "../lib/supabase.js";
import { slugify } from "../lib/text.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireRole("creator"));

const STATUS_OUT = { draft: "DRAFT", pending: "PENDING", published: "APPROVED", rejected: "REJECTED" };
const EDITABLE = ["draft", "rejected"];
const COLUMNS =
  "id, slug, title, synopsis, category, origin, status, reject_reason, created_at, updated_at, submitted_at, reviewed_at";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const str = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");

function storyOut(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    synopsis: row.synopsis ?? "",
    category: row.category ?? "",
    origin: row.origin ?? "",
    status: STATUS_OUT[row.status] ?? "DRAFT",
    rejectionReason: row.reject_reason ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? row.created_at,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at,
  };
}

async function ownStory(id, userId) {
  if (!UUID.test(id)) throw new HttpError(404, "Karya tidak ditemukan.");
  const row = check(
    await supabase.from("stories").select(COLUMNS).eq("id", id).eq("creator_id", userId).maybeSingle()
  );
  if (!row) throw new HttpError(404, "Karya tidak ditemukan.");
  return row;
}

async function chaptersOf(storyId) {
  const rows = check(
    await supabase
      .from("chapters")
      .select("id, chapter_number, title, content, is_premium, point_cost")
      .eq("story_id", storyId)
      .order("chapter_number")
  );
  return rows.map((c) => ({
    id: c.id,
    number: c.chapter_number,
    title: c.title === `Bab ${c.chapter_number}` ? "" : c.title,
    content: c.content,
    isPremium: c.is_premium,
    price: c.point_cost > 0 ? c.point_cost : 50,
  }));
}

async function fullStory(id, userId) {
  const row = await ownStory(id, userId);
  return { ...storyOut(row), chapters: await chaptersOf(row.id) };
}

// Membersihkan & memeriksa isi kiriman creator.
async function parseStory(body = {}) {
  const { entries } = await getCatalog();
  const categories = new Set([...CATEGORIES, ...entries.map((e) => e.summary.category)]);
  const origins = new Set(["Nusantara", ...entries.map((e) => e.summary.origin)]);

  const data = {
    title: str(body.title, 120),
    synopsis: str(body.synopsis, 600),
    category: str(body.category, 40),
    origin: str(body.origin, 80),
  };
  if (data.category && !categories.has(data.category)) throw new HttpError(400, "Kategori tidak valid.");
  if (data.origin && !origins.has(data.origin)) throw new HttpError(400, "Daerah asal tidak valid.");
  if (data.title.length < 3) throw new HttpError(400, "Judul minimal 3 karakter.");

  const list = Array.isArray(body.chapters) ? body.chapters : [];
  if (list.length > 200) throw new HttpError(400, "Maksimal 200 bab per cerita.");

  data.chapters = list.map((c, i) => {
    const content = typeof c?.content === "string" ? c.content : "";
    if (content.length > 100000) {
      throw new HttpError(400, `Bab ${i + 1}: isi terlalu panjang (maks 100.000 karakter).`);
    }
    return {
      title: str(c?.title, 100),
      content,
      isPremium: Boolean(c?.isPremium),
      price: Math.min(100000, Math.max(0, Math.floor(Number(c?.price)) || 0)),
    };
  });
  return data;
}

function validateForSubmit(story) {
  const problems = [];
  if (story.title.trim().length < 3) problems.push("Judul minimal 3 karakter.");
  if (story.synopsis.trim().length < 30) problems.push("Sinopsis minimal 30 karakter.");
  if (!story.category) problems.push("Pilih kategori.");
  if (!story.origin) problems.push("Pilih daerah asal.");
  if (story.chapters.length === 0) problems.push("Tambahkan minimal 1 bab.");
  story.chapters.forEach((c, i) => {
    if (c.content.trim().length < 100) problems.push(`Bab ${i + 1}: isi minimal 100 karakter.`);
    if (c.isPremium && !(c.price >= 1)) problems.push(`Bab ${i + 1}: harga premium minimal 1 koin.`);
  });
  return problems;
}

// Simpan bab: upsert per nomor, lalu hapus nomor yang berlebih (tidak pernah ada saat tanpa data).
async function saveChapters(storyId, chapters) {
  if (chapters.length > 0) {
    const rows = chapters.map((c, i) => ({
      story_id: storyId,
      chapter_number: i + 1,
      title: c.title || `Bab ${i + 1}`,
      content: c.content,
      is_premium: c.isPremium,
      point_cost: c.isPremium ? c.price : 0,
    }));
    check(await supabase.from("chapters").upsert(rows, { onConflict: "story_id,chapter_number" }));
  }
  check(await supabase.from("chapters").delete().eq("story_id", storyId).gt("chapter_number", chapters.length));
}

router.get("/stories", async (req, res) => {
  const rows = check(
    await supabase
      .from("stories")
      .select(COLUMNS)
      .eq("creator_id", req.user.id)
      .order("updated_at", { ascending: false })
  );

  const counts = new Map();
  if (rows.length > 0) {
    const chapters = check(
      await supabase.from("chapters").select("story_id").in("story_id", rows.map((r) => r.id))
    );
    for (const c of chapters) counts.set(c.story_id, (counts.get(c.story_id) || 0) + 1);
  }

  res.json({ data: rows.map((r) => ({ ...storyOut(r), chapterCount: counts.get(r.id) ?? 0 })) });
});

router.get("/stories/:id", async (req, res) => {
  res.json(await fullStory(req.params.id, req.user.id));
});

router.post("/stories", async (req, res) => {
  const data = await parseStory(req.body);
  const slug = `${slugify(data.title)}-${randomBytes(3).toString("hex")}`;

  const row = check(
    await supabase
      .from("stories")
      .insert({
        slug,
        title: data.title,
        synopsis: data.synopsis,
        category: data.category,
        origin: data.origin,
        status: "draft",
        creator_id: req.user.id,
        updated_at: new Date().toISOString(),
      })
      .select("id")
      .single()
  );
  await saveChapters(row.id, data.chapters);
  res.status(201).json(await fullStory(row.id, req.user.id));
});

router.put("/stories/:id", async (req, res) => {
  const story = await ownStory(req.params.id, req.user.id);
  if (!EDITABLE.includes(story.status)) {
    throw new HttpError(409, "Karya yang sedang direview atau sudah terbit tidak bisa diubah.");
  }
  const data = await parseStory(req.body);

  const updated = check(
    await supabase
      .from("stories")
      .update({
        title: data.title,
        synopsis: data.synopsis,
        category: data.category,
        origin: data.origin,
        updated_at: new Date().toISOString(),
      })
      .eq("id", story.id)
      .in("status", EDITABLE)
      .select("id")
      .maybeSingle()
  );
  if (!updated) throw new HttpError(409, "Status karya sudah berubah. Muat ulang halaman.");

  await saveChapters(story.id, data.chapters);
  res.json(await fullStory(story.id, req.user.id));
});

router.post("/stories/:id/submit", async (req, res) => {
  const row = await ownStory(req.params.id, req.user.id);
  if (!EDITABLE.includes(row.status)) throw new HttpError(409, "Karya ini sudah dikirim.");

  const problems = validateForSubmit({ ...storyOut(row), chapters: await chaptersOf(row.id) });
  if (problems.length > 0) throw new HttpError(422, "Karya belum lengkap.", { problems });

  const now = new Date().toISOString();
  const updated = check(
    await supabase
      .from("stories")
      .update({ status: "pending", reject_reason: null, submitted_at: now, updated_at: now })
      .eq("id", row.id)
      .in("status", EDITABLE)
      .select("id")
      .maybeSingle()
  );
  if (!updated) throw new HttpError(409, "Status karya sudah berubah. Muat ulang halaman.");

  res.json(await fullStory(row.id, req.user.id));
});

router.delete("/stories/:id", async (req, res) => {
  const row = await ownStory(req.params.id, req.user.id);
  if (!EDITABLE.includes(row.status)) {
    throw new HttpError(409, "Karya yang sedang direview atau sudah terbit tidak bisa dihapus.");
  }
  check(await supabase.from("chapters").delete().eq("story_id", row.id));
  check(await supabase.from("stories").delete().eq("id", row.id).in("status", EDITABLE));
  res.json({ ok: true });
});

// SIMULASI keputusan admin — hanya aktif bila ALLOW_SIMULATION=true. Dihapus saat halaman admin jadi.
router.post("/stories/:id/simulate-review", async (req, res) => {
  if (!config.allowSimulation) throw new HttpError(404, "Endpoint tidak ditemukan.");
  const row = await ownStory(req.params.id, req.user.id);
  if (row.status !== "pending") {
    throw new HttpError(409, "Hanya karya berstatus Menunggu Review yang bisa diproses.");
  }

  const approve = req.body?.decision === "approve";
  const now = new Date().toISOString();
  check(
    await supabase
      .from("stories")
      .update({
        status: approve ? "published" : "rejected",
        reject_reason: approve ? null : str(req.body?.reason, 300) || "Karya belum memenuhi pedoman.",
        reviewed_at: now,
        updated_at: now,
      })
      .eq("id", row.id)
      .eq("status", "pending")
  );
  if (approve) invalidateCatalog();
  res.json(await fullStory(row.id, req.user.id));
});

export default router;