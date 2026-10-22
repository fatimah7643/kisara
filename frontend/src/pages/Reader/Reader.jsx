import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getChapter, getChapterContent } from "../../services/storiesService";
import { READING_REWARD, completeChapter, saveLastRead, unlockChapter } from "../../services/userService";

const FONT_CLASSES = ["text-base", "text-lg", "text-xl"];
const FONT_KEY = "kisara:reader-font";

function loadFontStep() {
  try {
    const raw = localStorage.getItem(FONT_KEY);
    if (raw === null) return 1;
    const value = Number(raw);
    return value >= 0 && value < FONT_CLASSES.length ? value : 1;
  } catch {
    return 1;
  }
}

export default function Reader() {
  const { slug, chapter } = useParams();
  // key membuat state (pesan reward/error) otomatis reset setiap pindah bab.
  return <ReaderView key={`${slug}/${chapter}`} slug={slug} number={Number(chapter)} />;
}

function ReaderView({ slug, number }) {
  const { user, profile, refreshProfile } = useAuth();
  const location = useLocation();
  const [fontStep, setFontStep] = useState(loadFontStep);
  const [error, setError] = useState("");
  const [reward, setReward] = useState(0);

  const meta = useMemo(() => getChapter(slug, number), [slug, number]);
  const isOpen = Boolean(meta) && (!meta.is_locked || (profile?.unlocked?.[slug] ?? []).includes(number));
  const isDone = (profile?.progress?.[slug]?.completed ?? []).includes(number);
  const paragraphs = useMemo(
    () => (isOpen ? getChapterContent(slug, number).split(/\n+/).filter(Boolean) : []),
    [isOpen, slug, number]
  );
  const userId = user?.id;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Catat bab terakhir yang dibuka (hanya untuk user login dan bab yang sudah terbuka).
  useEffect(() => {
    if (!userId || !isOpen) return;
    saveLastRead(userId, slug, number);
    refreshProfile();
  }, [userId, isOpen, slug, number, refreshProfile]);

  function changeFont(delta) {
    const next = Math.min(FONT_CLASSES.length - 1, Math.max(0, fontStep + delta));
    setFontStep(next);
    try {
      localStorage.setItem(FONT_KEY, String(next));
    } catch {
      // abaikan jika penyimpanan diblokir
    }
  }

  function handleUnlock() {
    setError("");
    try {
      unlockChapter(userId, slug, number, meta.point_price);
      refreshProfile();
    } catch (err) {
      setError(err.message);
    }
  }

  function handleComplete() {
    setError("");
    try {
      const result = completeChapter(userId, slug, number);
      refreshProfile();
      if (result.rewarded) setReward(READING_REWARD);
    } catch (err) {
      setError(err.message);
    }
  }

  if (!meta) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-3 font-serif text-3xl font-bold text-gray-900">Bab tidak ditemukan</h1>
        <p className="mb-8 text-gray-600">Bab yang kamu cari tidak ada atau sudah dipindahkan.</p>
        <Link
          to={`/story/${slug}`}
          className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
        >
          Kembali ke Cerita
        </Link>
      </div>
    );
  }

  const storyPath = `/story/${slug}`;
  const readPath = (n) => `${storyPath}/read/${n}`;
  const price = meta.point_price;
  const balance = profile?.points ?? 0;

  return (
    <div>
      {/* Bar atas Reader */}
      <div className="sticky top-16 z-30 border-b border-line bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5">
          <Link to={storyPath} className="min-w-0 truncate text-sm font-semibold text-gray-700 hover:text-kisara">
            ← {meta.story.title}
          </Link>
          <p className="hidden shrink-0 text-xs font-bold uppercase tracking-wider text-gray-500 sm:block">
            Bab {meta.chapter_number} dari {meta.total}
          </p>
          <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Ukuran huruf">
            <button
              type="button"
              onClick={() => changeFont(-1)}
              disabled={fontStep === 0}
              aria-label="Perkecil huruf"
              className="h-8 w-8 rounded-md border border-line bg-white text-xs font-bold disabled:opacity-40"
            >
              A−
            </button>
            <button
              type="button"
              onClick={() => changeFont(1)}
              disabled={fontStep === FONT_CLASSES.length - 1}
              aria-label="Perbesar huruf"
              className="h-8 w-8 rounded-md border border-line bg-white text-sm font-bold disabled:opacity-40"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {!isOpen ? (
        /* Gerbang bab premium */
        <section className="mx-auto max-w-xl px-4 py-16 text-center">
          <div className="mb-4 text-4xl" aria-hidden="true">🔒</div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-kisara">Bab Premium</p>
          <h1 className="mb-3 font-serif text-3xl font-bold text-gray-900">
            {meta.story.title} · {meta.title}
          </h1>
          <p className="mb-8 text-gray-600">
            Buka bab ini sekali dengan <strong>{price} Koin</strong>. Setelah dibuka, bab tetap bisa kamu baca
            kapan saja.
          </p>

          {error && (
            <p role="alert" className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          {!user ? (
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
              >
                Masuk untuk Membuka
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-line bg-white px-6 py-3 text-sm font-bold text-gray-800 hover:border-kisara"
              >
                Daftar (Gratis 50 Koin)
              </Link>
            </div>
          ) : balance >= price ? (
            <div>
              <button
                type="button"
                onClick={handleUnlock}
                className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
              >
                Buka dengan {price} Koin
              </button>
              <p className="mt-3 text-sm text-gray-500">
                Saldo kamu {balance} Koin → sisa {balance - price} Koin
              </p>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm text-gray-700">
                Saldo kamu <strong>{balance} Koin</strong>, kurang <strong>{price - balance} Koin</strong> lagi.
              </p>
              <Link
                to="/topup"
                className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
              >
                Top-Up Koin
              </Link>
            </div>
          )}

          <p className="mt-8 text-sm">
            <Link to={storyPath} className="font-semibold text-gray-600 hover:text-kisara">
              ← Kembali ke daftar bab
            </Link>
          </p>
        </section>
      ) : (
        /* Tampilan membaca */
        <article className="mx-auto max-w-2xl px-4 py-10">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-kisara">
            {meta.story.origin} · {meta.readMinutes} menit baca
          </p>
          <h1 className="mb-8 font-serif text-3xl font-bold text-gray-900">{meta.title}</h1>

          <div className={`font-serif leading-8 text-gray-800 ${FONT_CLASSES[fontStep]}`}>
            {paragraphs.map((text, i) => (
              <p key={i} className="mb-5">
                {text}
              </p>
            ))}
          </div>

          <footer className="mt-12 border-t border-line pt-8">
            {error && (
              <p role="alert" className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mb-8 text-center">
              {!user ? (
                <p className="text-sm text-gray-600">
                  <Link to="/login" state={{ from: location.pathname }} className="font-bold text-kisara">
                    Masuk
                  </Link>{" "}
                  untuk menyimpan progres dan dapat +{READING_REWARD} Koin tiap bab selesai.
                </p>
              ) : reward > 0 ? (
                <p role="status" className="font-semibold text-green-700">
                  🎉 +{reward} Koin untuk bab yang kamu selesaikan!
                </p>
              ) : isDone ? (
                <p className="text-sm font-semibold text-green-700">✓ Bab ini sudah kamu selesaikan</p>
              ) : (
                <button
                  type="button"
                  onClick={handleComplete}
                  className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
                >
                  Tandai Selesai (+{READING_REWARD} Koin)
                </button>
              )}
            </div>

            <nav aria-label="Navigasi bab" className="flex items-center justify-between gap-3">
              {meta.prev ? (
                <Link
                  to={readPath(meta.prev.number)}
                  className="rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:border-kisara"
                >
                  ← Bab {meta.prev.number}
                </Link>
              ) : (
                <span />
              )}

              {meta.next ? (
                <Link
                  to={readPath(meta.next.number)}
                  className="rounded-lg bg-kisara px-4 py-2.5 text-sm font-bold text-white hover:bg-kisara-dark"
                >
                  Bab {meta.next.number}
                  {meta.next.is_locked ? ` 🔒 ${meta.next.point_price} Koin` : ""} →
                </Link>
              ) : (
                <Link
                  to={storyPath}
                  className="rounded-lg bg-kisara px-4 py-2.5 text-sm font-bold text-white hover:bg-kisara-dark"
                >
                  Selesai · Kembali ke Cerita
                </Link>
              )}
            </nav>
          </footer>
        </article>
      )}
    </div>
  );
}