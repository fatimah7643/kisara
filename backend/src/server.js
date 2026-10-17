import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi di backend/.env");
  process.exit(1);
}

// Service role key: HANYA di backend, jangan pernah dikirim ke frontend.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.use(cors({ origin: FRONTEND_URL.split(",") }));
app.use(express.json());

// Buang karakter yang merusak sintaks filter PostgREST (, ( ) % *)
function sanitizeSearch(value = "") {
  return String(value).replace(/[,()%*\\]/g, " ").trim().slice(0, 80);
}

app.get("/", (req, res) => {
  res.json({ message: "KiSara.id API is running successfully" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "KiSara backend is healthy" });
});

// GET /api/stories?search=danau&region=Kalimantan
app.get("/api/stories", async (req, res) => {
  try {
    const search = sanitizeSearch(req.query.search);
    const region = sanitizeSearch(req.query.region);

    let query = supabase
      .from("stories")
      .select("id, slug, title, synopsis, origin, region, cover_url, chapters(count)")
      .eq("status", "published")
      .order("title", { ascending: true });

    if (search) {
      query = query.or(`title.ilike.%${search}%,synopsis.ilike.%${search}%,origin.ilike.%${search}%`);
    }
    if (region) {
      query = query.eq("region", region);
    }

    const { data, error } = await query;
    if (error) throw error;

    const stories = data.map(({ chapters, ...s }) => ({
      ...s,
      chapter_count: chapters?.[0]?.count ?? 0,
    }));

    res.json({ total: stories.length, data: stories });
  } catch (err) {
    console.error("[GET /api/stories]", err);
    res.status(500).json({ error: "Gagal memuat data cerita." });
  }
});

// GET /api/regions  -> [{ region: "Kalimantan", total: 16 }, ...]
app.get("/api/regions", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("stories")
      .select("region")
      .eq("status", "published");
    if (error) throw error;

    const counts = {};
    for (const { region } of data) counts[region] = (counts[region] || 0) + 1;

    const regions = Object.entries(counts)
      .map(([region, total]) => ({ region, total }))
      .sort((a, b) => a.region.localeCompare(b.region));

    res.json({ data: regions });
  } catch (err) {
    console.error("[GET /api/regions]", err);
    res.status(500).json({ error: "Gagal memuat wilayah." });
  }
});

// GET /api/stories/:slug  -> detail + DAFTAR chapter (tanpa isi chapter)
app.get("/api/stories/:slug", async (req, res) => {
  try {
    const { data: story, error } = await supabase
      .from("stories")
      .select("id, slug, title, synopsis, origin, region, cover_url")
      .eq("slug", req.params.slug)
      .eq("status", "published")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({ error: "Cerita tidak ditemukan." });
      }
      throw error;
    }

    // Sengaja TIDAK memilih kolom `content` supaya chapter premium tidak bocor.
    const { data: chapters, error: chapError } = await supabase
      .from("chapters")
      .select("id, chapter_number, title, is_premium, point_cost")
      .eq("story_id", story.id)
      .order("chapter_number", { ascending: true });
    if (chapError) throw chapError;

    res.json({ ...story, chapters });
  } catch (err) {
    console.error("[GET /api/stories/:slug]", err);
    res.status(500).json({ error: "Gagal memuat cerita." });
  }
});

app.listen(PORT, () => {
  console.log(`KiSara API running at http://localhost:${PORT}`);
});