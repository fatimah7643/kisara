import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchStory } from "../../services/catalogApi";
import { useAsync } from "../../hooks/useAsync";
import { toggleBookmark } from "../../services/userService";
import CoverArt from "../../components/CoverArt/CoverArt";
import BookmarkIcon from "../../components/BookmarkIcon";

const STATUS_STYLE = {
  free: "bg-green-50 text-green-700",
  unlocked: "bg-blue-50 text-blue-700",
  locked: "bg-amber-50 text-amber-700",
};

export default function StoryDetail() {
  const { slug } = useParams();
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: story, error, loading } = useAsync(() => fetchStory(slug), [slug]);

  if (loading && !story) {
    return <div className="mx-auto max-w-2xl px-4 py-24 text-center text-gray-500">Memuat cerita…</div>;
  }

  if (!story) {
    const notFound = error?.status === 404;
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-3 font-serif text-3xl font-bold text-gray-900">
          {notFound ? "Cerita tidak ditemukan" : "Gagal memuat cerita"}
        </h1>
        <p className="mb-8 text-gray-600">
          {notFound ? "Cerita yang kamu cari tidak ada atau sudah dipindahkan." : error?.message}
        </p>
        <Link to="/catalog" className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const related = story.related;

  const unlocked = new Set(profile?.unlocked?.[slug] ?? []);
  const completed = new Set(profile?.progress?.[slug]?.completed ?? []);
  const bookmarked = Boolean(profile?.bookmarks?.includes(slug));
  const readerPath = (n) => `/story/${slug}/read/${n}`;

  const rows = story.chapters.map((c) => {
    const open = !c.is_locked || unlocked.has(c.chapter_number);
    return {
      ...c,
      open,
      done: completed.has(c.chapter_number),
      status: !c.is_locked ? "free" : open ? "unlocked" : "locked",
    };
  });

  const total = rows.length;
  const allDone = total > 0 && completed.size >= total;
  const next = rows.find((r) => !r.done) ?? rows[0];
  const ctaRow = allDone ? rows[0] : next;
  const percent = total ? Math.round((completed.size / total) * 100) : 0;

  const ctaBase = completed.size === 0 ? "Mulai Baca Bab 1" : allDone ? "Baca Ulang dari Bab 1" : `Lanjutkan Bab ${next.chapter_number}`;
  const ctaSuffix = ctaRow.status === "free" ? " (Gratis)" : ctaRow.status === "locked" ? ` (${ctaRow.point_price} Koin)` : "";

  // Bab premium yang belum dibuka: tamu diarahkan login, pengguna masuk ke Reader (halaman buka bab).
  const targetFor = (row) => (row.open || user ? readerPath(row.chapter_number) : "/login");

  function handleBookmark() {
    if (!user) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    toggleBookmark(user.id, slug);
    refreshProfile();
  }

  const sameRegion = related.length > 0 && related.every((r) => r.origin === story.origin);
  const premiumPrice = story.chapters.find((c) => c.is_locked)?.point_price;

  return (
    <div>
      {!user && (
        <div className="border-b border-line bg-kisara-soft/30">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm lg:px-8">
            <p className="text-gray-700">
              Kamu menjelajah sebagai <strong>Pembaca Tamu</strong>. Masuk atau daftar untuk menyimpan progres dan
              klaim <strong>50 Koin</strong> gratis.
            </p>
            <div className="flex gap-2">
              <Link to="/login" state={{ from: location.pathname }} className="px-3 py-1.5 font-bold text-kisara">
                Masuk Sekarang
              </Link>
              <Link to="/register" className="rounded-md bg-kisara px-4 py-1.5 font-bold text-white hover:bg-kisara-dark">
                Daftar Akun Baru
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <nav aria-label="Jejak halaman" className="mb-6 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <Link to="/" className="hover:text-kisara">Beranda</Link> ›{" "}
          <Link to={`/catalog?region=${encodeURIComponent(story.origin)}`} className="hover:text-kisara">
            Jelajah {story.origin}
          </Link>{" "}
          › <span className="text-kisara">{story.title}</span>
        </nav>

        <section className="mb-10 grid gap-8 rounded-2xl border border-line bg-white p-6 shadow-sm md:grid-cols-[240px_1fr] lg:p-8">
          <CoverArt story={story} className="aspect-[3/4] w-full max-w-[240px] rounded-xl shadow-md">
            <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              {story.origin}
            </span>
            <span className="absolute bottom-4 left-4 text-[10px] font-bold uppercase tracking-wider text-white/80">
              {story.category}
            </span>
          </CoverArt>

          <div>
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-kisara">
              {story.category} · {story.readMinutes} menit baca
            </p>
            <h1 className="mb-6 font-serif text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">{story.title}</h1>

            <dl className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <div className="rounded-lg bg-sand p-3">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Total struktur</dt>
                <dd className="font-serif text-lg font-bold text-gray-900">{story.chapterCount} Bab</dd>
              </div>
              <div className="rounded-lg bg-sand p-3">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Akses awal</dt>
                <dd className="font-serif text-lg font-bold text-green-700">{story.freeCount} Bab Terbuka</dd>
              </div>
              <div className="rounded-lg bg-sand p-3">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Bab premium</dt>
                <dd className="font-serif text-lg font-bold text-amber-700">
                  {story.premiumCount === 0 ? "Tidak ada" : `${story.premiumCount} Bab (${premiumPrice} Koin)`}
                </dd>
              </div>
              <div className="rounded-lg bg-sand p-3">
                <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Progres</dt>
                <dd className="font-serif text-lg font-bold text-gray-900">
                  {completed.size === 0 ? "Belum dimulai" : `${completed.size}/${total} bab (${percent}%)`}
                </dd>
              </div>
            </dl>

            <p className="mb-6 leading-relaxed text-gray-700">{story.synopsis}</p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={targetFor(ctaRow)}
                state={{ from: readerPath(ctaRow.chapter_number) }}
                className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
              >
                {ctaBase}{ctaSuffix} →
              </Link>
              <button
                type="button"
                onClick={handleBookmark}
                aria-pressed={bookmarked}
                className="flex items-center gap-2 rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-gray-800 hover:border-kisara"
              >
                <BookmarkIcon filled={bookmarked} />
                {bookmarked ? "Tersimpan di Pustaka" : "Simpan ke Pustaka"}
              </button>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <section aria-labelledby="daftar-bab">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 id="daftar-bab" className="font-serif text-2xl font-bold text-gray-900">Daftar Bab</h2>
                <p className="text-sm text-gray-500">Bab 1–{story.freeCount} gratis, sisanya dibuka dengan koin.</p>
              </div>
              <span className="rounded bg-kisara-soft/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-kisara">
                {total} bagian
              </span>
            </div>

            <ul className="space-y-3">
              {rows.map((row) => {
                const isNext = !allDone && row.chapter_number === next.chapter_number;
                let label;
                if (!row.open) label = user ? `Buka Bab — ${row.point_price} Koin` : "Masuk untuk Membuka";
                else if (row.done) label = "Baca Ulang";
                else if (isNext) label = "Baca Sekarang";
                else label = "Baca";
                const primary = row.open && isNext;

                return (
                  <li
                    key={row.chapter_number}
                    className={`flex items-center gap-4 rounded-xl border p-4 ${
                      row.status === "locked" ? "border-line bg-sand/60" : "border-line bg-white"
                    } ${isNext ? "ring-2 ring-kisara/30" : ""}`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sand font-serif font-bold text-gray-500">
                      {String(row.chapter_number).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className={`rounded px-2 py-0.5 font-semibold ${STATUS_STYLE[row.status]}`}>
                          {row.status === "free" ? "Gratis" : row.status === "unlocked" ? "Telah Dibuka" : `🔒 ${row.point_price} Koin`}
                        </span>
                        <span>{row.readMinutes} mnt bacaan</span>
                      </div>
                      <h3 className="font-serif text-lg font-bold text-gray-900">{row.title}</h3>
                      <p className="truncate text-sm text-gray-500">{row.excerpt}</p>
                    </div>
                    <Link
                      to={targetFor(row)}
                      state={{ from: readerPath(row.chapter_number) }}
                      className={`shrink-0 rounded-lg px-4 py-2 text-xs font-bold ${
                        primary ? "bg-kisara text-white hover:bg-kisara-dark" : "bg-sand text-gray-800 hover:bg-line"
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>

          {related.length > 0 && (
            <aside className="h-fit rounded-xl border border-line bg-white p-5 shadow-sm">
              <h2 className="mb-4 font-serif text-lg font-bold text-gray-900">
                {sameRegion ? `Cerita Lain dari ${story.origin}` : "Cerita Serupa"}
              </h2>
              <ul className="space-y-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/story/${r.slug}`} className="block rounded-lg p-2 hover:bg-sand">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-kisara">{r.origin}</p>
                      <p className="font-serif font-bold text-gray-900">{r.title}</p>
                      <p className="text-xs text-gray-500">{r.chapterCount} bab · {r.readMinutes} mnt baca</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}