// Karya creator (draft → review → terbit) — sementara di localStorage per user id.
// Nanti diganti tabel Supabase lewat backend. Alur status mengikuti PRD:
//   DRAFT → PENDING → APPROVED,   REJECTED → (edit) → PENDING
const STORAGE_KEY = "kisara:creator-stories";

export const EDITABLE = ["DRAFT", "REJECTED"];

export const STATUS_META = {
  DRAFT: { label: "Draft", style: "bg-gray-100 text-gray-700" },
  PENDING: { label: "Menunggu Review", style: "bg-amber-50 text-amber-700" },
  APPROVED: { label: "Disetujui", style: "bg-green-50 text-green-700" },
  REJECTED: { label: "Ditolak", style: "bg-red-50 text-red-700" },
};

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeAll(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    // penyimpanan penuh / diblokir browser — abaikan
  }
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export function newChapter(number = 1) {
  return { id: makeId("ch"), number, title: "", content: "", isPremium: false, price: 50 };
}

export function emptyStory() {
  return {
    id: null,
    title: "",
    synopsis: "",
    category: "",
    origin: "",
    status: "DRAFT",
    rejectionReason: "",
    chapters: [newChapter(1)],
  };
}

export function listCreatorStories(userId) {
  return (readAll()[userId] ?? []).slice().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getCreatorStory(userId, id) {
  return (readAll()[userId] ?? []).find((s) => s.id === id) ?? null;
}

// Menyimpan (membuat baru jika story.id kosong). Status & alasan penolakan dijaga dari data lama.
export function saveCreatorStory(userId, story) {
  const db = readAll();
  const list = db[userId] ?? [];
  const now = new Date().toISOString();
  const existing = story.id ? list.find((s) => s.id === story.id) : null;

  if (existing && !EDITABLE.includes(existing.status)) {
    throw new Error("Karya yang sedang direview atau sudah terbit tidak bisa diubah.");
  }

  const content = {
    title: story.title.trim(),
    synopsis: story.synopsis.trim(),
    category: story.category,
    origin: story.origin,
    chapters: story.chapters.map((c, i) => ({
      id: c.id,
      number: i + 1,
      title: c.title.trim(),
      content: c.content,
      isPremium: Boolean(c.isPremium),
      price: Number(c.price) || 0,
    })),
  };

  const saved = existing
    ? { ...existing, ...content, updatedAt: now }
    : { id: makeId("st"), ...content, status: "DRAFT", rejectionReason: "", createdAt: now, updatedAt: now };

  db[userId] = existing ? list.map((s) => (s.id === saved.id ? saved : s)) : [...list, saved];
  writeAll(db);
  return saved;
}

export function validateForSubmit(story) {
  const problems = [];
  if (story.title.trim().length < 3) problems.push("Judul minimal 3 karakter.");
  if (story.synopsis.trim().length < 30) problems.push("Sinopsis minimal 30 karakter.");
  if (!story.category) problems.push("Pilih kategori.");
  if (!story.origin) problems.push("Pilih daerah asal.");
  if (story.chapters.length === 0) problems.push("Tambahkan minimal 1 bab.");
  story.chapters.forEach((c, i) => {
    if (c.content.trim().length < 100) problems.push(`Bab ${i + 1}: isi minimal 100 karakter.`);
    if (c.isPremium && !(Number(c.price) >= 1)) problems.push(`Bab ${i + 1}: harga premium minimal 1 koin.`);
  });
  return problems;
}

// Mengirim karya (yang sudah tersimpan) untuk direview. Error membawa err.problems bila belum lengkap.
export function submitCreatorStory(userId, id) {
  const db = readAll();
  const list = db[userId] ?? [];
  const story = list.find((s) => s.id === id);
  if (!story) throw new Error("Karya tidak ditemukan.");
  if (!EDITABLE.includes(story.status)) throw new Error("Karya ini sudah dikirim.");

  const problems = validateForSubmit(story);
  if (problems.length > 0) {
    const err = new Error("Karya belum lengkap.");
    err.problems = problems;
    throw err;
  }

  const now = new Date().toISOString();
  db[userId] = list.map((s) =>
    s.id === id ? { ...s, status: "PENDING", rejectionReason: "", submittedAt: now, updatedAt: now } : s
  );
  writeAll(db);
}

export function deleteCreatorStory(userId, id) {
  const db = readAll();
  const list = db[userId] ?? [];
  const story = list.find((s) => s.id === id);
  if (!story) return;
  if (!EDITABLE.includes(story.status)) {
    throw new Error("Karya yang sedang direview atau sudah terbit tidak bisa dihapus.");
  }
  db[userId] = list.filter((s) => s.id !== id);
  writeAll(db);
}

// SIMULASI keputusan admin (sementara, sampai halaman moderasi admin dibuat).
export function reviewCreatorStory(userId, id, decision, reason = "") {
  const db = readAll();
  const list = db[userId] ?? [];
  const story = list.find((s) => s.id === id);
  if (!story || story.status !== "PENDING") {
    throw new Error("Hanya karya berstatus Menunggu Review yang bisa diproses.");
  }
  const approved = decision === "approve";
  const now = new Date().toISOString();
  db[userId] = list.map((s) =>
    s.id === id
      ? { ...s, status: approved ? "APPROVED" : "REJECTED", rejectionReason: approved ? "" : reason, reviewedAt: now, updatedAt: now }
      : s
  );
  writeAll(db);
}