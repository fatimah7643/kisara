import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { CHAPTER_PRICE, ORDER_STATUS_LABEL, PACKAGES, createOrder, listOrders } from "../../services/walletService";
import { formatDateTime, formatNumber, formatRupiah } from "../../utils/format";

const STATUS_STYLE = {
  PENDING: "bg-amber-50 text-amber-700",
  SUCCESS: "bg-green-50 text-green-700",
  FAILED: "bg-red-50 text-red-700",
  EXPIRED: "bg-gray-100 text-gray-600",
};

export default function TopUp() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [orders] = useState(() => listOrders(user.id));
  const [error, setError] = useState("");
  const base = PACKAGES[0];

  function handleBuy(packageId) {
    setError("");
    try {
      const order = createOrder(user.id, packageId);
      navigate(`/checkout/${order.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-kisara">Dompet Koin</p>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Top-Up Koin</h1>
          <p className="mt-1 text-gray-600">Koin dipakai untuk membuka bab premium. Sekali dibuka, bab bisa dibaca selamanya.</p>
        </div>
        <div className="rounded-xl border border-line bg-white px-5 py-3 text-right shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Saldo Kamu</p>
          <p className="font-serif text-2xl font-bold text-gray-900">🪙 {formatNumber(profile?.points ?? 0)} Koin</p>
        </div>
      </header>

      {error && (
        <p role="alert" className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <section aria-label="Pilih paket" className="mb-12 grid gap-6 pt-3 md:grid-cols-3">
        {PACKAGES.map((p) => {
          const saving = Math.round((1 - p.price / p.points / (base.price / base.points)) * 100);
          return (
            <article
              key={p.id}
              className={`relative flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                p.popular ? "border-kisara ring-2 ring-kisara/20" : "border-line"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-6 rounded-full bg-kisara px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Paling Laris
                </span>
              )}
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-kisara">{p.name}</p>
              <p className="font-serif text-4xl font-bold text-gray-900">🪙 {formatNumber(p.points)}</p>
              <p className="mb-4 text-sm text-gray-500">
                Koin · ±{Math.floor(p.points / CHAPTER_PRICE)} bab premium
              </p>
              <p className="mb-1 text-2xl font-bold text-gray-900">{formatRupiah(p.price)}</p>
              <p className="mb-6 h-5 text-xs font-semibold text-green-700">{saving > 0 ? `Hemat ${saving}%` : ""}</p>
              <button
                type="button"
                onClick={() => handleBuy(p.id)}
                className="mt-auto rounded-lg bg-kisara px-5 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
              >
                Beli Paket {p.name}
              </button>
            </article>
          );
        })}
      </section>

      <section aria-labelledby="riwayat-topup">
        <h2 id="riwayat-topup" className="mb-4 font-serif text-2xl font-bold text-gray-900">
          Riwayat Top-Up
        </h2>
        {orders.length === 0 ? (
          <div className="rounded-xl border border-dashed border-line bg-white px-6 py-10 text-center text-gray-600">
            Belum ada transaksi top-up.
          </div>
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-white shadow-sm">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    Paket {o.packageName} · {formatNumber(o.points)} Koin
                  </p>
                  <p className="text-xs text-gray-500">
                    {o.id} · {formatDateTime(o.createdAt)} · {formatRupiah(o.price)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`rounded px-2 py-1 text-xs font-bold ${STATUS_STYLE[o.status]}`}>
                    {ORDER_STATUS_LABEL[o.status]}
                  </span>
                  <Link to={`/checkout/${o.id}`} className="text-sm font-bold text-kisara hover:underline">
                    {o.status === "PENDING" ? "Lanjutkan Bayar" : "Detail"}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}