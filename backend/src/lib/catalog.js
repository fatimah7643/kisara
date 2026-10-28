import { supabase } from "./supabase.js";
import { check } from "./errors.js";
import { chapterTitle, countWords, makeExcerpt, minutesFor, normalize } from "./text.js";

const TTL_MS = 30_000;
const CHUNK = 40;

let cache = null;
let loading = null;

async function fetchAllRows(build) {
  const rows = [];
  const size = 500;
  for (let from = 0; ; from += size) {
    const data = check(await build().range(from, from + size - 1));
    rows.push(...data);
    if (data.length < size) break;
  }
  return rows;
}

async function load() {
  const stories = await fetchAllRows(() =>
    supabase
      .from("stories")
      .select("id, slug, title, synopsis, origin, category, cover_url")
      .eq("status", "published")
      .order("id")
  );

  const chapters = [];
  for (let i = 0; i < stories.length; i += CHUNK) {
    const ids = stories.slice(i, i + CHUNK).map((s) => s.id);
    chapters.push(
      ...(await fetchAllRows(() =>
        supabase
          .from("chapters")
          .select("id, story_id, chapter_number, title, content, is_premium, point_cost")
          .in("story_id", ids)
          .order("id")
      ))
    );
  }

  const byStory = new Map();
  for (const c of chapters) {
    if (!byStory.has(c.story_id)) byStory.set(c.story_id, []);
    byStory.get(c.story_id).push(c);
  }

  const entries = stories.map((s) => {
    const list = (byStory.get(s.id) ?? []).sort((a, b) => a.chapter_number - b.chapter_number);
    const freeCount = list.filter((c) => !c.is_premium).length;
    const words = list.reduce((total, c) => total + countWords(c.content), 0);

    return {
      id: s.id,
      summary: {
        slug: s.slug,
        title: s.title,
        origin: s.origin,
        category: s.category,
        synopsis: s.synopsis ?? "",
        cover_url: s.cover_url,
        chapterCount: list.length,
        freeCount,
        premiumCount: list.length - freeCount,
        readMinutes: minutesFor(words),
      },
      chapters: list.map((c) => ({
        chapter_number: c.chapter_number,
        title: chapterTitle(c.title, c.chapter_number),
        excerpt: makeExcerpt(c.content),
        is_locked: c.is_premium,
        point_price: c.point_cost,
        readMinutes: minutesFor(countWords(c.content)),
      })),
      chapterIds: new Map(list.map((c) => [c.chapter_number, c.id])),
      search: normalize(`${s.title} ${s.origin} ${s.category} ${s.synopsis ?? ""}`),
    };
  });

  const bySlug = new Map(entries.map((e) => [e.summary.slug, e]));
  const storyIndex = new Map(entries.map((e) => [e.id, e.summary.slug]));
  const chapterIndex = new Map();
  for (const e of entries) {
    for (const [number, id] of e.chapterIds) chapterIndex.set(id, { slug: e.summary.slug, number });
  }

  return { at: Date.now(), entries, bySlug, storyIndex, chapterIndex };
}

export async function getCatalog() {
  if (cache && Date.now() - cache.at < TTL_MS) return cache;
  if (!loading) {
    loading = load()
      .then((data) => {
        cache = data;
        return data;
      })
      .finally(() => {
        loading = null;
      });
  }
  try {
    return await loading;
  } catch (err) {
    if (cache) return cache; // gagal memuat ulang → pakai data lama
    throw err;
  }
}

export function invalidateCatalog() {
  cache = null;
}

export function findChapter(catalog, slug, number) {
  const entry = catalog.bySlug.get(slug);
  if (!entry) return null;
  const index = entry.chapters.findIndex((c) => c.chapter_number === number);
  if (index === -1) return null;
  return { entry, index, meta: entry.chapters[index], chapterId: entry.chapterIds.get(number) };
}

// Boleh membaca? Bab gratis: siapa saja. Bab premium: hanya yang sudah membukanya.
export async function userCanRead(userId, chapterId, isLocked) {
  if (!isLocked) return true;
  if (!userId) return false;
  const row = check(
    await supabase
      .from("chapter_unlocks")
      .select("chapter_id")
      .eq("user_id", userId)
      .eq("chapter_id", chapterId)
      .maybeSingle()
  );
  return Boolean(row);
}