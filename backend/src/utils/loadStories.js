import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_ROOT = join(__dirname, '..', '..', '..', 'kisara-data');
const DATA_DIR = join(DATA_ROOT, 'hasil_json');
const META_FILE = join(DATA_ROOT, 'story_meta.json');

// Chapter terkunci = premium, harganya (poin) diatur di sini
export const PREMIUM_POINT_COST = 50;

export function loadStories() {
  // story_meta.json berisi judul rapi, provinsi (origin), wilayah (region), sinopsis
  const meta = existsSync(META_FILE)
    ? JSON.parse(readFileSync(META_FILE, 'utf-8'))
    : {};

  const files = readdirSync(DATA_DIR).filter(
    (f) => f.endsWith('.json') && f !== '_laporan.json'
  );

  const stories = [];

  for (const file of files) {
    try {
      const raw = readFileSync(join(DATA_DIR, file), 'utf-8');
      const data = JSON.parse(raw);
      const slug = file.replace('.json', '');
      const m = meta[slug] || {};

      stories.push({
        slug,
        title: m.title || data.title || slug,
        synopsis: m.synopsis || data.synopsis || '',
        origin: m.origin || data.origin || 'Nusantara',
        region: m.region || 'Nusantara',
        chapters: Array.isArray(data.chapters) ? data.chapters : [],
      });
    } catch (err) {
      console.warn(`[loadStories] skip corrupt file: ${file} — ${err.message}`);
    }
  }

  return stories;
}