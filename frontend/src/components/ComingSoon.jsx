import { Link } from "react-router-dom";

// Penanda sementara untuk halaman yang belum dikerjakan.
export default function ComingSoon({ title, step }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-kisara">Segera hadir</p>
      <h1 className="mb-4 font-serif text-4xl font-bold text-gray-900">{title}</h1>
      <p className="mb-8 text-gray-600">Halaman ini dikerjakan di Step {step}.</p>
      <Link to="/catalog" className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark">
        Kembali ke Katalog
      </Link>
    </div>
  );
}