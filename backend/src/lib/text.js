import { WORDS_PER_MINUTE } from "../config.js";

export const countWords = (text = "") => (text.match(/\S+/g) || []).length;
export const minutesFor = (words) => Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

export const normalize = (text = "") =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function makeExcerpt(content = "", max = 90) {
  const text = content.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

// Judul bab bawaan seed ("Chapter 1") ditampilkan sebagai "Bab 1".
export function chapterTitle(title, number) {
  const t = (title ?? "").trim();
  return !t || /^(chapter|bab)\s*\d+$/i.test(t) ? `Bab ${number}` : t;
}

export function slugify(text) {
  const base = normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base || "cerita";
}

// Tanggal hari ini (YYYY-MM-DD) di zona waktu Asia/Jakarta, sama dengan perhitungan check-in di database.
export const jakartaDate = () =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" }).format(new Date());