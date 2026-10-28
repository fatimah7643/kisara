import { createClient } from "@supabase/supabase-js";
import { config } from "../config.js";

// Klien service_role: melewati RLS. HANYA dipakai di backend, jangan pernah dikirim ke browser.
export const supabase = createClient(config.supabaseUrl, config.serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});