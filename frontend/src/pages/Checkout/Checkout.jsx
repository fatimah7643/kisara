import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createOrder, getOrder, settleOrder } from "../../services/walletService";
import { formatDateTime, formatNumber, formatRupiah } from "../../utils/format";

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4 py-2 text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-right font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

export default function Checkout() {
  const { orderId } = useParams();
  // key membuat state reset otomatis saat pindah ke pesanan lain (mis. "Coba Lagi").
  return <CheckoutView key={orderId} orderId={orderId} />;
}

function CheckoutView({ orderId }) {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(() => getOrder(user.id, orderId));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleCheckStatus() {
    const fresh = getOrder(user.id, orderId);
    setOrder(fresh);
    setMessage(fresh?.status === "PENDING" ? "Pembayaran belum diterima. Coba cek lagi sebentar lagi." : "");
  }

  // SIMULASI Midtrans Sandbox — hapus bersama panel simulasi saat backend tersambung.
  function handleSimulate(outcome) {
    setError("");
    setMessage("");
    try {
      setOrder(settleOrder(user.id, orderId, outcome));
      refreshProfile();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleRetry() {
    setError("");
    try {
      const next = createOrder(user.id, order.packageId);
      navigate(`/checkout/${next.id}`);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-3 font-serif text-3xl font-bold text-gray-900">Pesanan tidak ditemukan</h1>
        <p className="mb-8 text-gray-600">Pesanan ini tidak ada atau bukan milik akunmu.</p>
        <Link to="/topup" className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark">
          Kembali ke Top-Up
        </Link>
      </div>
    );
  }

  const summary = (
    <dl className="divide-y divide-line rounded-xl border border-line bg-white px-5 py-2">
      <Row label="Nomor pesanan" value={order.id} />
      <Row label="Paket" value={`${order.packageName} · ${formatNumber(order.points)} Koin`} />
      <Row label="Total bayar" value={formatRupiah(order.price)} />
      <Row label="Dibuat" value={formatDateTime(order.createdAt)} />
      {order.status === "PENDING" && <Row label="Berlaku sampai" value={formatDateTime(order.expiresAt)} />}
      {order.status === "SUCCESS" && <Row label="Dibayar" value={formatDateTime(order.paidAt)} />}
    </dl>
  );

  const errorBox = error && (
    <p role="alert" className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </p>
  );

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      {order.status === "PENDING" && (
        <>
          <div className="mb-6 text-center">
            <div className="mb-3 text-4xl" aria-hidden="true">⏳</div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-amber-700">Menunggu Pembayaran</p>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Selesaikan Pembayaran</h1>
          </div>
          {summary}
          {errorBox}
          {message && (
            <p role="status" className="mt-5 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {message}
            </p>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleCheckStatus}
              className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-bold text-gray-800 hover:border-kisara"
            >
              Cek Status
            </button>
            <Link to="/topup" className="rounded-lg px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-kisara">
              Ganti Paket
            </Link>
          </div>

          <section className="mt-8 rounded-xl border border-dashed border-kisara/50 bg-kisara-soft/20 p-5">
            <h2 className="mb-1 font-sans text-sm font-bold text-gray-900">Simulasi Pembayaran (Midtrans Sandbox)</h2>
            <p className="mb-4 text-xs text-gray-600">
              Panel sementara untuk mencoba semua hasil pembayaran. Saat backend tersambung, bagian ini diganti popup
              Midtrans Snap.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSimulate("SUCCESS")}
                className="rounded-lg bg-green-600 px-4 py-2 text-xs font-bold text-white hover:bg-green-700"
              >
                Simulasikan Berhasil
              </button>
              <button
                type="button"
                onClick={() => handleSimulate("FAILED")}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Simulasikan Gagal
              </button>
              <button
                type="button"
                onClick={() => handleSimulate("EXPIRED")}
                className="rounded-lg bg-gray-600 px-4 py-2 text-xs font-bold text-white hover:bg-gray-700"
              >
                Simulasikan Kedaluwarsa
              </button>
            </div>
          </section>
        </>
      )}

      {order.status === "SUCCESS" && (
        <>
          <div className="mb-6 text-center">
            <div className="mb-3 text-4xl" aria-hidden="true">🎉</div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-green-700">Pembayaran Berhasil</p>
            <h1 className="mb-2 font-serif text-3xl font-bold text-gray-900">+{formatNumber(order.points)} Koin</h1>
            <p className="text-gray-600">
              Saldo kamu sekarang <strong>{formatNumber(profile?.points ?? 0)} Koin</strong>.
            </p>
          </div>
          {summary}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/catalog" className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark">
              Lanjut Membaca
            </Link>
            <Link
              to="/dashboard"
              className="rounded-lg border border-line bg-white px-6 py-3 text-sm font-bold text-gray-800 hover:border-kisara"
            >
              Ke Dashboard
            </Link>
          </div>
        </>
      )}

      {(order.status === "FAILED" || order.status === "EXPIRED") && (
        <>
          <div className="mb-6 text-center">
            <div className="mb-3 text-4xl" aria-hidden="true">{order.status === "FAILED" ? "⚠️" : "⌛"}</div>
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-red-700">
              {order.status === "FAILED" ? "Pembayaran Gagal" : "Pesanan Kedaluwarsa"}
            </p>
            <h1 className="mb-2 font-serif text-3xl font-bold text-gray-900">Koin belum bertambah</h1>
            <p className="text-gray-600">Tidak ada dana yang terpotong untuk pesanan ini. Kamu bisa mencoba lagi.</p>
          </div>
          {summary}
          {errorBox && <div className="mt-5">{errorBox}</div>}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
            >
              Coba Lagi
            </button>
            <Link
              to="/topup"
              className="rounded-lg border border-line bg-white px-6 py-3 text-sm font-bold text-gray-800 hover:border-kisara"
            >
              Pilih Paket Lain
            </Link>
          </div>
        </>
      )}
    </div>
  );
}