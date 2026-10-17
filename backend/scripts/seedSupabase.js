/**
 * Supabase Seeder — insert stories from kisara-data/hasil_json/ into `stories` table.
 *
 * Usage:
 *   1. Copy .env.example to backend/.env and fill SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 *   2. Create `stories` table in Supabase (SQL below)
 *   3. Run:  node backend/scripts/seedSupabase.js
 *
 * Required table (run in Supabase SQL Editor):
 *
 *   CREATE TABLE IF NOT EXISTS stories (
 *     id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     slug        TEXT UNIQUE NOT NULL,
 *     title       TEXT NOT NULL,
 *     synopsis    TEXT DEFAULT '',
 *     origin      TEXT DEFAULT '',
 *     chapters    JSONB DEFAULT '[]',
 *     created_at  TIMESTAMPTZ DEFAULT now()
 *   );
 */


import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { loadStories, PREMIUM_POINT_COST } from '../src/utils/loadStories.js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi di backend/.env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function seed() {
  const stories = loadStories();
  console.log(`Ditemukan ${stories.length} cerita. Mulai seeding...`);

  let okStories = 0;
  let okChapters = 0;

  for (const s of stories) {
    const { data: story, error: storyError } = await supabase
      .from('stories')
      .upsert(
        {
          slug: s.slug,
          title: s.title,
          synopsis: s.synopsis,
          origin: s.origin,
          region: s.region,
          status: 'published',
        },
        { onConflict: 'slug' }
      )
      .select('id')
      .single();

    if (storyError) {
      console.error(`✗ story ${s.slug}: ${storyError.message}`);
      continue;
    }
    okStories++;

    const rows = s.chapters.map((c) => ({
      story_id: story.id,
      chapter_number: c.chapter_number,
      title: c.title,
      content: c.content,
      is_premium: Boolean(c.is_locked),
      point_cost: c.is_locked ? PREMIUM_POINT_COST : 0,
    }));

    if (rows.length === 0) continue;

    const { error: chapError } = await supabase
      .from('chapters')
      .upsert(rows, { onConflict: 'story_id,chapter_number' });

    if (chapError) {
      console.error(`✗ chapters ${s.slug}: ${chapError.message}`);
    } else {
      okChapters += rows.length;
    }
  }

  console.log(`Selesai: ${okStories} cerita, ${okChapters} chapter.`);
}

seed();