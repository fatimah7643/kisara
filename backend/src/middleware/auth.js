import { supabase } from "../lib/supabase.js";
import { HttpError, check } from "../lib/errors.js";

async function userFromRequest(req) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return error || !data?.user ? null : data.user;
}

// Login opsional: pengunjung tanpa token tetap bisa lewat (req.user = null).
export async function optionalAuth(req, res, next) {
  try {
    req.user = await userFromRequest(req);
  } catch {
    req.user = null;
  }
  next();
}

export async function requireAuth(req, res, next) {
  const user = await userFromRequest(req);
  if (!user) throw new HttpError(401, "Silakan masuk terlebih dahulu.");
  req.user = user;
  next();
}

// Role dibaca dari database (bukan dari token), jadi tidak bisa dipalsukan.
export function requireRole(...roles) {
  return async (req, res, next) => {
    const profile = check(
      await supabase.from("profiles").select("role").eq("id", req.user.id).maybeSingle()
    );
    if (!profile || !roles.includes(profile.role)) throw new HttpError(403, "Akses ditolak.");
    next();
  };
}