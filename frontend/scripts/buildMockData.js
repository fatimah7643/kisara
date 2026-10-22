/**
 * Membuat src/data/stories.json dari kisara-data/hasil_json.
 * Jalankan dari folder frontend:  npm run mock
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.resolve(__dirname, "../../kisara-data/hasil_json");
const OUT_FILE = path.resolve(__dirname, "../src/data/stories.json");

const CHAPTER_PRICE = 50; // poin per chapter premium (sama dengan bonus pendaftaran)

const REGIONS = [
  "Kalimantan Selatan", "Kalimantan Tengah", "Kalimantan Timur", "Kalimantan Barat",
  "Jawa Timur", "Jawa Barat", "Jawa Tengah", "Sumatera Selatan", "Sumatera Utara",
  "Aceh", "Bengkulu", "Jambi", "Papua", "Bali",
];

// Judul yang tidak menyebut daerah — sudah dicocokkan dengan isi ceritanya.
const ORIGIN_OVERRIDE = {
  "la-bauto": "Nusa Tenggara Timur",
  "bete-dou": "Nusa Tenggara Timur",
  "putri-kemarau": "Sumatera Selatan",
  "legenda-naga-lipan": "Kalimantan Timur",
  "cerita-rakyat-maling-kundang": "Sumatera Barat",
  "cerita-rakyat-roro-jonggrang": "Jawa Tengah",
  "cerita-rakyat-keong-mas": "Jawa Timur",
  "cerita-rakyat-jawa-aji-saka": "Jawa Tengah",
  "cerita-rakyat-sunda-ciung-wanara": "Jawa Barat",
  "legenda-asal-usul-banyuwangi": "Jawa Timur",
  "asal-usul-danau-toba": "Sumatera Utara",
  "asal-mula-putri-tujuh": "Riau",
  "asal-usul-keturunan-bulungan": "Kalimantan Utara",
  "asal-usul-gerhana-matahari-dan-bulan": "Nusantara",
  "asmat-suku-titisan-dewa-di-bumi-papua": "Papua",
  "kebaikan-si-pahit-lidah": "Sumatera Selatan",
  "legenda-bukit-siguntang": "Sumatera Selatan",
  "legenda-kebo-iwa-dan-asal-usul-gunung-batur": "Bali",
  "legenda-mandin-tangkaramin": "Kalimantan Selatan",
  "legenda-sangkuriang-dan-tangkuban-perahu": "Jawa Barat",
  "kisah-lutung-kasarung-dalam-mencari-cinta-sejati": "Jawa Barat",
  "sepasang-naga-dan-terbentuknya-telaga-sarangan": "Jawa Timur",
};

const TITLE_OVERRIDE = {
  "cerita-rakyat-bengkuluputri-gading-cempaka": "Putri Gading Cempaka",
  "cerita-rakyat-maling-kundang": "Malin Kundang",
  "cerita-rakyat-papua": "Cerita Rakyat Papua",
};

const SMALL_WORDS = new Set(["dan", "dalam", "di", "dari", "yang", "ke", "si"]);

const titleCase = (s) =>
  s.toLowerCase().split(/\s+/)
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");

const capitalizeFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function detectOrigin(slug, rawTitle) {
  if (ORIGIN_OVERRIDE[slug]) return ORIGIN_OVERRIDE[slug];
  const lower = rawTitle.toLowerCase();
  return REGIONS.find((r) => lower.includes(r.toLowerCase())) || "Nusantara";
}

function cleanTitle(slug, rawTitle, origin) {
  if (TITLE_OVERRIDE[slug]) return TITLE_OVERRIDE[slug];
  let t = titleCase(rawTitle).replace(/^(Cerita Rakyat|Legenda)\s+/i, "");
  for (const prefix of [origin, "Sunda", "Jawa", ...REGIONS]) {
    const re = new RegExp(`^${prefix}\\s+`, "i");
    if (re.test(t)) { t = t.replace(re, ""); break; }
  }
  return t ? capitalizeFirst(t) : titleCase(rawTitle);
}

function makeSynopsis(firstChapter) {
  const text = (firstChapter?.content || "").replace(/\s+/g, " ").trim();
  if (text.length <= 220) return text;
  return text.slice(0, 220).replace(/\s+\S*$/, "") + "…";
}

const files = readdirSync(SRC_DIR).filter((f) => f.endsWith(".json") && f !== "_laporan.json");

const stories = files.map((file) => {
  const slug = file.replace(/\.json$/, "");
  const raw = JSON.parse(readFileSync(path.join(SRC_DIR, file), "utf8"));
  const origin = detectOrigin(slug, raw.title);
  const chapters = (raw.chapters || [])
    .slice()
    .sort((a, b) => a.chapter_number - b.chapter_number)
    .map((c) => ({
      chapter_number: c.chapter_number,
      title: c.title,
      content: c.content,
      is_locked: Boolean(c.is_locked),
      point_price: c.is_locked ? CHAPTER_PRICE : 0,
    }));

  return {
    slug,
    title: cleanTitle(slug, raw.title, origin),
    origin,
    category: /^legenda/i.test(raw.title) ? "Legenda" : "Cerita Rakyat",
    synopsis: raw.synopsis || makeSynopsis(chapters[0]),
    cover_url: null,
    chapters,
  };
}).sort((a, b) => a.title.localeCompare(b.title, "id"));

mkdirSync(path.dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(stories));

const totalCh = stories.reduce((n, s) => n + s.chapters.length, 0);
const locked = stories.reduce((n, s) => n + s.chapters.filter((c) => c.is_locked).length, 0);
console.log(`OK: ${stories.length} cerita, ${totalCh} chapter (${locked} premium) -> ${path.relative(process.cwd(), OUT_FILE)}`);