// Data pengguna (profil, poin, riwayat poin, bookmark, bab terbuka, progres baca)
// — sementara disimpan di localStorage per user id. Nanti diganti tabel Supabase lewat backend.
//
// Bentuk data tambahan (diisi bertahap di Step berikutnya):
//   bookmarks: ["slug-cerita", ...]
//   unlocked:  { "slug-cerita": [6, 7] }                      // bab premium yang sudah dibuka
//   progress:  { "slug-cerita": { lastChapter, completed: [1, 2] } }
const STORAGE_KEY = "kisara:users";
const WELCOME_BONUS = 50;
const ALLOWED_ROLES = ["reader", "creator"]; // "admin" hanya boleh diatur dari database

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

function makeId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Profil lama (dari Step 1) belum punya field baru, jadi selalu dilengkapi saat dibaca.
function normalize(profile) {
  return { bookmarks: [], unlocked: {}, progress: {}, ...profile };
}

export function getProfile(userId) {
  const profile = readAll()[userId];
  return profile ? normalize(profile) : null;
}

// Mengubah saldo lewat satu pintu supaya selalu tercatat di riwayat poin
// dan saldo tidak pernah negatif.
export function addPoints(userId, amount, type, note = "") {
  const db = readAll();
  const profile = db[userId];
  if (!profile) throw new Error("Profil tidak ditemukan.");
  if (profile.points + amount < 0) throw new Error("Saldo poin tidak cukup.");

  profile.points += amount;
  profile.transactions.unshift({
    id: makeId(),
    type,
    amount,
    note,
    createdAt: new Date().toISOString(),
  });
  writeAll(db);
  return normalize(profile);
}

// Dipanggil setiap kali ada sesi login. Akun baru otomatis dapat bonus 50 poin (sekali saja).
export function ensureProfile(user) {
  const db = readAll();
  if (!db[user.id]) {
    const meta = user.user_metadata ?? {};
    db[user.id] = {
      id: user.id,
      email: user.email,
      name: meta.full_name || (user.email ?? "pengguna").split("@")[0],
      role: ALLOWED_ROLES.includes(meta.role) ? meta.role : "reader",
      regionInterest: meta.region_interest || "",
      points: 0,
      streak: 0,
      lastCheckIn: null,
      transactions: [],
      createdAt: new Date().toISOString(),
    };
    writeAll(db);
    return addPoints(user.id, WELCOME_BONUS, "welcome_bonus", "Bonus pendaftaran");
  }
  return normalize(db[user.id]);
}

// Menyimpan / menghapus cerita dari Pustaka. Mengembalikan profil terbaru.
export function toggleBookmark(userId, slug) {
  const db = readAll();
  if (!db[userId]) throw new Error("Profil tidak ditemukan.");
  const profile = normalize(db[userId]);
  profile.bookmarks = profile.bookmarks.includes(slug)
    ? profile.bookmarks.filter((s) => s !== slug)
    : [...profile.bookmarks, slug];
  db[userId] = profile;
  writeAll(db);
  return profile;
}

export const READING_REWARD = 5;

function patchProgress(userId, slug, update) {
  const db = readAll();
  if (!db[userId]) throw new Error("Profil tidak ditemukan.");
  const profile = normalize(db[userId]);
  const current = profile.progress[slug] ?? { lastChapter: null, completed: [] };
  profile.progress = {
    ...profile.progress,
    [slug]: { ...current, ...update(current), updatedAt: new Date().toISOString() },
  };
  db[userId] = profile;
  writeAll(db);
  return profile;
}

// Mencatat bab terakhir yang dibuka (untuk "Lanjutkan Membaca" & riwayat).
export function saveLastRead(userId, slug, chapterNumber) {
  return patchProgress(userId, slug, () => ({ lastChapter: chapterNumber }));
}

// Membuka bab premium dengan poin. Tidak menarik poin dua kali untuk bab yang sama.
export function unlockChapter(userId, slug, chapterNumber, price) {
  const current = getProfile(userId);
  if (!current) throw new Error("Profil tidak ditemukan.");
  if ((current.unlocked[slug] ?? []).includes(chapterNumber)) return current;

  // addPoints melempar error "Saldo poin tidak cukup." kalau saldo kurang.
  addPoints(userId, -price, "unlock_chapter", `Buka bab ${chapterNumber} · ${slug}`);

  const db = readAll();
  const profile = normalize(db[userId]);
  profile.unlocked = {
    ...profile.unlocked,
    [slug]: [...(profile.unlocked[slug] ?? []), chapterNumber],
  };
  db[userId] = profile;
  writeAll(db);
  return profile;
}

// Menandai bab selesai. Reward hanya diberikan sekali per bab.
export function completeChapter(userId, slug, chapterNumber) {
  const before = getProfile(userId);
  if (!before) throw new Error("Profil tidak ditemukan.");
  if ((before.progress[slug]?.completed ?? []).includes(chapterNumber)) {
    return { profile: before, rewarded: false };
  }

  addPoints(userId, READING_REWARD, "reading_reward", `Selesai membaca bab ${chapterNumber} · ${slug}`);
  const profile = patchProgress(userId, slug, (cur) => ({
    lastChapter: chapterNumber,
    completed: [...cur.completed, chapterNumber],
  }));
  return { profile, rewarded: true };
}

export const DAILY_CHECKIN_REWARD = 10;

// Kunci tanggal lokal "YYYY-MM-DD". offsetDays = -1 berarti kemarin.
export function dateKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Check-in harian: sekali per hari. Kemarin check-in → streak +1, selain itu streak = 1.
export function dailyCheckIn(userId) {
  const profile = getProfile(userId);
  if (!profile) throw new Error("Profil tidak ditemukan.");

  const today = dateKey();
  if (profile.lastCheckIn === today) return { profile, rewarded: false };

  const streak = profile.lastCheckIn === dateKey(-1) ? profile.streak + 1 : 1;
  addPoints(userId, DAILY_CHECKIN_REWARD, "daily_checkin", `Check-in hari ke-${streak}`);

  const db = readAll();
  const updated = normalize(db[userId]);
  updated.streak = streak;
  updated.lastCheckIn = today;
  db[userId] = updated;
  writeAll(db);

  return { profile: updated, rewarded: true, streak, reward: DAILY_CHECKIN_REWARD };
}