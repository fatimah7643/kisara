export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

// Pesan dari RAISE EXCEPTION di fungsi database → HTTP.
const DB_ERRORS = {
  CHAPTER_NOT_FOUND: [404, "Bab tidak ditemukan."],
  PROFILE_NOT_FOUND: [404, "Profil tidak ditemukan."],
  INSUFFICIENT_POINTS: [402, "Saldo poin tidak cukup."],
  CHAPTER_LOCKED: [403, "Bab ini belum dibuka."],
  ORDER_NOT_FOUND: [404, "Pesanan tidak ditemukan."],
  INVALID_STATUS: [400, "Status tidak valid."],
};

// Membuka hasil query Supabase: mengembalikan data, atau melempar HttpError bila ada error.
export function check({ data, error }) {
  if (error) {
    const known = DB_ERRORS[error.message];
    if (known) throw new HttpError(known[0], known[1]);
    console.error("[supabase]", error);
    throw new HttpError(500, "Terjadi kesalahan pada server.");
  }
  return data;
}

export function errorHandler(err, req, res, _next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...err.extra });
  }
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Format JSON tidak valid." });
  }
  if (err?.type === "entity.too.large") {
    return res.status(413).json({ error: "Data terlalu besar." });
  }
  console.error("[unhandled]", err);
  res.status(500).json({ error: "Terjadi kesalahan pada server." });
}