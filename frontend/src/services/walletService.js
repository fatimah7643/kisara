// Paket top-up & pesanan pembayaran — sementara di localStorage per user id.
// Nanti diganti: createOrder → backend membuat transaksi PENDING + token Midtrans Snap,
// settleOrder → dihapus (status diubah oleh webhook Midtrans, bukan oleh frontend).
import { addPoints } from "./userService";

const STORAGE_KEY = "kisara:orders";
const ORDER_TTL_MS = 24 * 60 * 60 * 1000; // pesanan kedaluwarsa setelah 24 jam

export const CHAPTER_PRICE = 50; // harga bab premium di data saat ini (untuk perkiraan jumlah bab)

export const PACKAGES = [
  { id: "basic", name: "Basic", points: 1000, price: 10000 },
  { id: "standard", name: "Standard", points: 5000, price: 45000, popular: true },
  { id: "premium", name: "Premium", points: 10000, price: 80000 },
];

export const ORDER_STATUS_LABEL = {
  PENDING: "Menunggu",
  SUCCESS: "Berhasil",
  FAILED: "Gagal",
  EXPIRED: "Kedaluwarsa",
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

function makeId() {
  return `ORD-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
}

// Membaca pesanan user; pesanan PENDING yang lewat batas waktu otomatis jadi EXPIRED.
function load(userId) {
  const db = readAll();
  const now = Date.now();
  let changed = false;
  const list = (db[userId] ?? []).map((o) => {
    if (o.status === "PENDING" && new Date(o.expiresAt).getTime() < now) {
      changed = true;
      return { ...o, status: "EXPIRED" };
    }
    return o;
  });
  if (changed) {
    db[userId] = list;
    writeAll(db);
  }
  return list;
}

export function listOrders(userId) {
  return load(userId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrder(userId, orderId) {
  return load(userId).find((o) => o.id === orderId) ?? null;
}

export function createOrder(userId, packageId) {
  const pkg = PACKAGES.find((p) => p.id === packageId);
  if (!pkg) throw new Error("Paket tidak ditemukan.");

  const now = new Date();
  const order = {
    id: makeId(),
    packageId: pkg.id,
    packageName: pkg.name,
    points: pkg.points,
    price: pkg.price,
    status: "PENDING",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + ORDER_TTL_MS).toISOString(),
    paidAt: null,
  };

  const db = readAll();
  db[userId] = [...(db[userId] ?? []), order];
  writeAll(db);
  return order;
}

// SIMULASI hasil pembayaran (pengganti webhook Midtrans). Hanya PENDING yang bisa diubah,
// jadi koin tidak mungkin ditambahkan dua kali untuk pesanan yang sama.
export function settleOrder(userId, orderId, outcome) {
  if (!["SUCCESS", "FAILED", "EXPIRED"].includes(outcome)) throw new Error("Hasil tidak valid.");

  const order = getOrder(userId, orderId);
  if (!order) throw new Error("Pesanan tidak ditemukan.");
  if (order.status !== "PENDING") return order;

  const updated = {
    ...order,
    status: outcome,
    paidAt: outcome === "SUCCESS" ? new Date().toISOString() : null,
  };
  const db = readAll();
  db[userId] = (db[userId] ?? []).map((o) => (o.id === orderId ? updated : o));
  writeAll(db);

  if (outcome === "SUCCESS") {
    addPoints(userId, order.points, "topup", `Top-up paket ${order.packageName}`);
  }
  return updated;
}