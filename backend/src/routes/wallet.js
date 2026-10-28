import { randomBytes } from "node:crypto";
import { Router } from "express";
import { ORDER_TTL_MS, PACKAGES, config } from "../config.js";
import { HttpError, check } from "../lib/errors.js";
import { supabase } from "../lib/supabase.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const COLUMNS = "id, package_id, package_name, points, price, status, created_at, expires_at, paid_at";

const mapOrder = (o) => ({
  id: o.id,
  packageId: o.package_id,
  packageName: o.package_name,
  points: o.points,
  price: o.price,
  status: o.status,
  createdAt: o.created_at,
  expiresAt: o.expires_at,
  paidAt: o.paid_at,
});

// Pesanan PENDING yang lewat batas waktu dijadikan EXPIRED.
async function expireStale(rows) {
  const now = Date.now();
  for (const row of rows) {
    if (row.status === "PENDING" && new Date(row.expires_at).getTime() < now) {
      check(await supabase.rpc("settle_order", { p_order: row.id, p_status: "EXPIRED" }));
      row.status = "EXPIRED";
    }
  }
  return rows;
}

async function findOrder(id, userId) {
  const row = check(
    await supabase.from("payment_orders").select(COLUMNS).eq("id", id).eq("user_id", userId).maybeSingle()
  );
  if (!row) throw new HttpError(404, "Pesanan tidak ditemukan.");
  const [fresh] = await expireStale([row]);
  return fresh;
}

router.get("/wallet/packages", (req, res) => {
  res.json({ data: PACKAGES });
});

router.get("/orders", requireAuth, async (req, res) => {
  const rows = check(
    await supabase
      .from("payment_orders")
      .select(COLUMNS)
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false })
      .limit(100)
  );
  res.json({ data: (await expireStale(rows)).map(mapOrder) });
});

router.post("/orders", requireAuth, async (req, res) => {
  const pkg = PACKAGES.find((p) => p.id === req.body?.packageId);
  if (!pkg) throw new HttpError(400, "Paket tidak ditemukan.");

  const now = new Date();
  const row = check(
    await supabase
      .from("payment_orders")
      .insert({
        id: `ORD-${Date.now().toString(36).toUpperCase()}${randomBytes(2).toString("hex").toUpperCase()}`,
        user_id: req.user.id,
        package_id: pkg.id,
        package_name: pkg.name,
        points: pkg.points,
        price: pkg.price,
        status: "PENDING",
        expires_at: new Date(now.getTime() + ORDER_TTL_MS).toISOString(),
      })
      .select(COLUMNS)
      .single()
  );
  res.status(201).json(mapOrder(row));
});

router.get("/orders/:id", requireAuth, async (req, res) => {
  res.json(mapOrder(await findOrder(req.params.id, req.user.id)));
});

// SIMULASI pembayaran — hanya aktif bila ALLOW_SIMULATION=true. Dihapus saat Midtrans tersambung.
router.post("/orders/:id/simulate", requireAuth, async (req, res) => {
  if (!config.allowSimulation) throw new HttpError(404, "Endpoint tidak ditemukan.");
  const outcome = req.body?.outcome;
  if (!["SUCCESS", "FAILED", "EXPIRED"].includes(outcome)) throw new HttpError(400, "Hasil tidak valid.");

  const order = await findOrder(req.params.id, req.user.id);
  check(await supabase.rpc("settle_order", { p_order: order.id, p_status: outcome }));
  res.json(mapOrder(await findOrder(order.id, req.user.id)));
});

export default router;