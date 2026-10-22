import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStats, getStories, getTopRegions } from "../../services/storiesService";
import CoverArt from "../../components/CoverArt/CoverArt";
import StoryCard from "../../components/StoryCard/StoryCard";

const stats = getStats();
const topRegions = getTopRegions(5);
const featured = getStories({ sort: "chapters", pageSize: 1 }).items[0];

const FEATURES = [
  {
    icon: "📚",
    title: "Koleksi Cerita Berseri (Gratis & Premium)",
    text: "Baca bab awal setiap cerita secara gratis, lalu buka bab berikutnya dengan koin yang kamu kumpulkan atau isi ulang.",
  },
  {
    icon: "🎁",
    title: "Poin Harian & Hadiah Membaca",
    text: "Check-in setiap hari dan selesaikan bab untuk mengumpulkan koin tambahan. Akun baru langsung mendapat 50 koin.",
  },
  {
    icon: "✍️",
    title: "Ruang Kreator",
    text: "Penulis lokal dapat mengirim cerita dari daerahnya. Admin meninjau karya sebelum diterbitkan ke katalog.",
  },
  {
    icon: "🪙",
    title: "Top-Up Koin Simulasi",
    text: "Isi ulang koin lewat gerbang pembayaran Midtrans Sandbox. Semua transaksi tercatat di riwayat koinmu.",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [region, setRegion] = useState("");
  const cards = useMemo(() => getStories({ region, sort: "chapters", pageSize: 4 }).items, [region]);

  return (
    <div>
      {/* HERO */}
      <section aria-label="Pengantar" className="mx-auto flex max-w-7xl flex-col items-center gap-16 px-6 py-16 lg:flex-row lg:px-8 lg:py-24">
        <div className="w-full lg:w-1/2">
          <span className="mb-6 inline-block rounded border border-line bg-sand px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-kisara">
            Pustaka Cerita Digital Nusantara
          </span>
          <h1 className="mb-6 font-serif text-5xl font-bold leading-[1.1] text-gray-900 lg:text-6xl">
            Menghidupkan Kembali <span className="italic text-kisara">Hikayat & Legenda</span> Nusantara di Era Digital.
          </h1>
          <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-600">
            Sastra lisan dan tradisi yang hampir pudar kini hadir dalam pengalaman membaca interaktif. Terbuka bagi
            generasi masa depan, dengan apresiasi poin untuk para kreator lokal.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="rounded-lg bg-kisara px-8 py-4 text-center font-bold text-white shadow-lg shadow-kisara/20 hover:bg-kisara-dark"
            >
              {user ? "Buka Pustaka Saya" : "Mulai Baca (Daftar Gratis)"}
            </Link>
            <Link
              to="/catalog"
              className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-8 py-4 text-center font-bold text-gray-700 hover:border-gray-300"
            >
              🧭 Jelajahi Katalog
            </Link>
          </div>
        </div>

        <div className="relative w-full lg:w-1/2">
          <div className="relative z-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
            <CoverArt story={featured} className="mb-6 h-64 rounded-xl" />
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded bg-sand px-2 py-1 text-xs font-bold text-kisara">PILIHAN</span>
              <span className="text-xs font-medium text-gray-500">{featured.origin}</span>
            </div>
            <h3 className="mb-2 font-serif text-2xl font-bold">{featured.title}</h3>
            <p className="mb-6 line-clamp-2 text-sm text-gray-500">{featured.synopsis}</p>
            <Link
              to={`/story/${featured.slug}`}
              className="block w-full rounded-lg bg-kisara py-3 text-center text-sm font-bold text-white hover:bg-kisara-dark"
            >
              Lihat Hikayat →
            </Link>
          </div>
          <div className="absolute -right-6 -top-6 -z-10 h-full w-full rounded-2xl border border-line bg-sand" />
        </div>
      </section>

      {/* STATISTIK (dihitung dari data) */}
      <section className="border-y border-line bg-[#F9F7F1]">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 md:grid-cols-4 lg:px-8">
          {[
            { value: stats.stories, label: "Hikayat & Legenda" },
            { value: stats.regions, label: "Daerah Asal" },
            { value: stats.chapters, label: "Bab Siap Dibaca" },
            { value: stats.freeChapters, label: "Bab Gratis" },
          ].map((s) => (
            <div key={s.label}>
              <dd className="mb-1 font-serif text-4xl font-bold text-kisara">{s.value}</dd>
              <dt className="text-xs font-bold uppercase tracking-wider text-gray-500">{s.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* FITUR */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="flex flex-col gap-16 lg:flex-row">
          <div className="w-full lg:w-1/3">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-kisara">Nilai Tambah KiSara</p>
            <h2 className="mb-4 font-serif text-4xl font-bold leading-tight text-gray-900">
              Teknologi Modern untuk Melindungi Warisan Tutur Nusantara
            </h2>
            <p className="text-sm leading-relaxed text-gray-600">
              Pengarsipan tradisi lisan dipadukan dengan fitur literasi yang nyaman dipakai.
            </p>
          </div>
          <div className="grid w-full gap-6 md:grid-cols-2 lg:w-2/3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-white p-8 shadow-sm">
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-sand text-xl">{f.icon}</div>
                <h3 className="mb-3 font-serif text-xl font-bold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PETA HIKAYAT */}
      <section className="border-y border-line bg-sand py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-2xl">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-kisara">Katalog Daerah Populer</p>
              <h2 className="mb-4 font-serif text-4xl font-bold text-gray-900">Peta Hikayat Nusantara</h2>
              <p className="text-sm text-gray-600">Pilih daerah dan telusuri cerita rakyat yang mengakar di sana.</p>
            </div>
            <div className="flex w-full gap-2 overflow-x-auto pb-2 md:w-auto">
              {[{ name: "", label: "Semua Wilayah" }, ...topRegions.map((r) => ({ name: r.name, label: r.name }))].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  aria-pressed={region === r.name}
                  onClick={() => setRegion(r.name)}
                  className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold ${
                    region === r.name ? "bg-kisara text-white" : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to={region ? `/catalog?region=${encodeURIComponent(region)}` : "/catalog"}
              className="inline-block rounded-full border border-gray-300 bg-white px-8 py-4 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Eksplorasi Seluruh Koleksi →
            </Link>
          </div>
        </div>
      </section>

      {/* AJAKAN DAFTAR (hanya untuk tamu) */}
      {!user && (
        <>
          <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-10 rounded-3xl bg-kisara p-10 text-white shadow-xl lg:flex-row lg:p-16">
              <div className="w-full lg:w-3/5">
                <span className="mb-4 inline-block rounded bg-kisara-dark px-3 py-1 text-xs font-bold text-kisara-soft">
                  🎉 BONUS PENDAFTARAN
                </span>
                <h2 className="mb-4 font-serif text-4xl font-bold">Daftar Hari Ini, Dapatkan +50 Koin!</h2>
                <p className="leading-relaxed text-kisara-soft">
                  Buat akun gratis dan langsung terima 50 Koin KiSara, cukup untuk membuka satu bab premium pertamamu.
                </p>
              </div>
              <div className="w-full rounded-2xl bg-white p-6 text-gray-900 lg:w-2/5">
                <h3 className="mb-1 font-bold">Daftar Akun Cepat</h3>
                <p className="mb-4 text-xs text-gray-500">Mulai baca dalam waktu kurang dari semenit.</p>
                <Link to="/register" className="block rounded-lg bg-kisara py-3 text-center text-sm font-bold text-white hover:bg-kisara-dark">
                  Buat Akun KiSara Gratis →
                </Link>
              </div>
            </div>
          </section>

          <section className="bg-sand px-4 py-24 text-center">
            <h2 className="mb-6 font-serif text-4xl font-bold text-gray-900 lg:text-5xl">
              Jadilah Bagian dari<br />Kebangkitan Cerita Nusantara
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-gray-600">
              Daftar gratis untuk mulai membaca, atau jadilah kreator untuk menerbitkan cerita dari daerahmu.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register" className="rounded-lg bg-kisara px-8 py-4 font-bold text-white shadow-lg hover:bg-kisara-dark">
                Buat Akun KiSara Gratis →
              </Link>
              <Link to="/login" className="rounded-lg border border-gray-300 bg-white px-8 py-4 font-bold text-gray-700 hover:bg-gray-50">
                Masuk ke Akun
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}