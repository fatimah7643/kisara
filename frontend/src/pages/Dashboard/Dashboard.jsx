import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRegions, getStory } from "../../services/storiesService";
import { DAILY_CHECKIN_REWARD, dailyCheckIn, dateKey, toggleBookmark } from "../../services/userService";
import StoryCard from "../../components/StoryCard/StoryCard";
import CoverArt from "../../components/CoverArt/CoverArt";

const TABS = [
  { id: "bookmark", label: "Bookmark" },
  { id: "reading", label: "Sedang Dibaca" },
  { id: "history", label: "Riwayat Bacaan" },
  { id: "points", label: "Riwayat Poin" },
];

const ROLE_LABEL = { reader: "Pembaca", creator: "Kreator", admin: "Admin" };

const TX_LABEL = {
  welcome_bonus: "Bonus pendaftaran",
  daily_checkin: "Check-in harian",
  reading_reward: "Reward membaca",
  unlock_chapter: "Buka bab premium",
  topup: "Top-up koin",
};

const regions = getRegions();

const formatDate = (iso) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Catatan transaksi menyimpan slug cerita setelah " · " — tampilkan judulnya.
function txNote(note) {
  const [text, slug] = (note ?? "").split(" · ");
  const title = slug ? getStory(slug)?.title : null;
  return title ? `${text} · ${title}` : text;
}

function Empty({ text, to, cta }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
      <p className="mb-4 text-gray-600">{text}</p>
      {to && (
        <Link to={to} className="rounded-lg bg-kisara px-5 py-2.5 text-sm font-bold text-white hover:bg-kisara-dark">
          {cta}
        </Link>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { profile } = useAuth();
  if (!profile) return null;
  return <DashboardView profile={profile} />;
}

function DashboardView({ profile }) {
  const { user, refreshProfile } = useAuth();
  const [tab, setTab] = useState("bookmark");
  const [region, setRegion] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const today = dateKey();
  const checkedIn = profile.lastCheckIn === today;
  // Streak putus jika kemarin dan hari ini sama-sama belum check-in.
  const streakAlive = checkedIn || profile.lastCheckIn === dateKey(-1);
  const streak = streakAlive ? profile.streak : 0;

  const data = useMemo(() => {
    const bookmarks = (profile.bookmarks ?? []).map((slug) => getStory(slug)).filter(Boolean);

    const entries = Object.entries(profile.progress ?? {})
      .map(([slug, p]) => {
        const story = getStory(slug);
        if (!story) return null;
        const completed = p.completed ?? [];
        const total = story.chapters.length;
        const nextRow = story.chapters.find((c) => !completed.includes(c.chapter_number));
        return {
          slug,
          story,
          lastChapter: p.lastChapter,
          completedCount: completed.length,
          total,
          percent: total ? Math.round((completed.length / total) * 100) : 0,
          done: total > 0 && completed.length >= total,
          nextChapter: (nextRow ?? story.chapters[0]).chapter_number,
          updatedAt: p.updatedAt ?? "",
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

    return {
      bookmarks,
      entries,
      inProgress: entries.filter((e) => !e.done),
      finished: entries.filter((e) => e.done).length,
      chaptersRead: entries.reduce((t, e) => t + e.completedCount, 0),
      premiumOpened: Object.values(profile.unlocked ?? {}).reduce((t, list) => t + list.length, 0),
    };
  }, [profile]);

  const byRegion = (origin) => !region || origin === region;
  const bookmarks = data.bookmarks.filter((s) => byRegion(s.origin));
  const inProgress = data.inProgress.filter((e) => byRegion(e.story.origin));
  const history = data.entries.filter((e) => byRegion(e.story.origin));
  const resume = data.inProgress[0];

  function handleCheckIn() {
    setError("");
    try {
      const result = dailyCheckIn(user.id);
      refreshProfile();
      setNotice(
        result.rewarded
          ? `Check-in berhasil! +${result.reward} Koin · streak ${result.streak} hari 🔥`
          : "Kamu sudah check-in hari ini."
      );
    } catch (err) {
      setError(err.message);
    }
  }

  function handleBookmark(slug) {
    toggleBookmark(user.id, slug);
    refreshProfile();
  }

  const stats = [
    { label: "Hikayat Selesai", value: data.finished, hint: "Semua bab sudah ditamatkan" },
    { label: "Bab Selesai", value: data.chaptersRead, hint: "Total bab yang kamu selesaikan" },
    { label: "Saldo Koin", value: profile.points, hint: "+ Top-Up Koin", to: "/topup" },
    { label: "Bab Premium Terbuka", value: data.premiumOpened, hint: "Akses permanen" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Header */}
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-3 inline-block rounded bg-sand px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-kisara">
            Ruang Baca Pribadi · {ROLE_LABEL[profile.role] ?? "Pembaca"}
          </span>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Selamat datang kembali, {profile.name}!</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/topup"
            className="rounded-lg border border-kisara bg-sand px-4 py-2.5 text-sm font-bold text-kisara hover:bg-white"
          >
            🪙 {profile.points} Koin +
          </Link>
          {profile.role === "creator" && (
            <Link to="/creator" className="rounded-lg bg-kisara px-4 py-2.5 text-sm font-bold text-white hover:bg-kisara-dark">
              ✍️ Tulis Cerita
            </Link>
          )}
        </div>
      </header>

      {/* Lanjutkan membaca + check-in */}
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        <section aria-label="Lanjutkan membaca" className="rounded-xl border border-line bg-white p-4 shadow-sm">
          {resume ? (
            <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-center">
              <CoverArt story={resume.story} className="h-32 w-full shrink-0 rounded-lg sm:w-32" />
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-xs font-bold uppercase tracking-wider text-kisara">Sedang Dibaca</p>
                <h2 className="mb-1 font-serif text-xl font-bold text-gray-900">
                  <Link to={`/story/${resume.slug}`} className="hover:text-kisara">
                    {resume.story.title}
                  </Link>
                </h2>
                <p className="mb-3 text-sm text-gray-500">
                  {resume.story.origin} · terakhir di Bab {resume.lastChapter}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-kisara" style={{ width: `${resume.percent}%` }} />
                  </div>
                  <span className="text-xs font-bold text-gray-600">
                    {resume.completedCount}/{resume.total} bab ({resume.percent}%)
                  </span>
                </div>
              </div>
              <Link
                to={`/story/${resume.slug}/read/${resume.nextChapter}`}
                className="whitespace-nowrap rounded-lg bg-kisara px-5 py-3 text-center text-sm font-bold text-white hover:bg-kisara-dark"
              >
                Lanjutkan Bab {resume.nextChapter} →
              </Link>
            </div>
          ) : (
            <div className="px-2 py-6 text-center">
              <p className="mb-4 text-gray-600">Kamu belum punya bacaan yang sedang berjalan.</p>
              <Link to="/catalog" className="rounded-lg bg-kisara px-5 py-2.5 text-sm font-bold text-white hover:bg-kisara-dark">
                Jelajahi Kisah
              </Link>
            </div>
          )}
        </section>

        <section aria-label="Check-in harian" className="rounded-xl border border-line bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">Check-in Harian</p>
          <p className="mb-4 font-serif text-3xl font-bold text-gray-900">
            🔥 {streak} <span className="font-sans text-sm font-normal text-gray-500">hari beruntun</span>
          </p>
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={checkedIn}
            className="w-full rounded-lg bg-kisara px-4 py-3 text-sm font-bold text-white hover:bg-kisara-dark disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {checkedIn ? "✓ Sudah check-in hari ini" : `Check-in (+${DAILY_CHECKIN_REWARD} Koin)`}
          </button>
          {notice && (
            <p role="status" className="mt-3 text-sm font-semibold text-green-700">
              {notice}
            </p>
          )}
          {error && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {error}
            </p>
          )}
        </section>
      </div>

      {/* Statistik */}
      <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => {
          const body = (
            <>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">{s.label}</p>
              <p className="font-serif text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-1 text-xs text-gray-500">{s.hint}</p>
            </>
          );
          const cls = "rounded-xl border border-line bg-white p-5 shadow-sm";
          return s.to ? (
            <Link key={s.label} to={s.to} className={`${cls} hover:border-kisara`}>
              {body}
            </Link>
          ) : (
            <div key={s.label} className={cls}>
              {body}
            </div>
          );
        })}
      </div>

      {/* Tab */}
      <div className="mb-6 flex items-center justify-between gap-4 border-b border-line">
        <div role="tablist" aria-label="Pustaka saya" className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-bold ${
                tab === t.id ? "bg-kisara text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {t.label}
              {t.id === "bookmark" && ` (${data.bookmarks.length})`}
              {t.id === "reading" && ` (${data.inProgress.length})`}
            </button>
          ))}
        </div>

        {tab !== "points" && (
          <select
            aria-label="Filter daerah"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="hidden h-9 shrink-0 rounded-md border border-line bg-white px-3 text-sm font-semibold text-gray-700 md:block"
          >
            <option value="">Semua Daerah</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        )}
      </div>

      {tab === "bookmark" &&
        (bookmarks.length === 0 ? (
          <Empty
            text={
              data.bookmarks.length === 0
                ? "Belum ada cerita yang disimpan. Tekan ikon bookmark di katalog untuk menyimpannya."
                : "Tidak ada bookmark dari daerah ini."
            }
            to="/catalog"
            cta="Jelajahi Katalog"
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((story) => (
              <StoryCard key={story.slug} story={story} bookmarked onToggleBookmark={handleBookmark} />
            ))}
          </div>
        ))}

      {tab === "reading" &&
        (inProgress.length === 0 ? (
          <Empty text="Tidak ada cerita yang sedang dibaca." to="/catalog" cta="Mulai Membaca" />
        ) : (
          <ul className="space-y-3">
            {inProgress.map((e) => (
              <li key={e.slug} className="flex flex-wrap items-center gap-4 rounded-xl border border-line bg-white p-4 shadow-sm">
                <CoverArt story={e.story} className="h-16 w-16 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1">
                  <Link to={`/story/${e.slug}`} className="font-serif font-bold text-gray-900 hover:text-kisara">
                    {e.story.title}
                  </Link>
                  <p className="mb-2 text-xs text-gray-500">
                    {e.story.origin} · {e.completedCount}/{e.total} bab selesai
                  </p>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full bg-kisara" style={{ width: `${e.percent}%` }} />
                  </div>
                </div>
                <Link
                  to={`/story/${e.slug}/read/${e.nextChapter}`}
                  className="rounded-lg bg-kisara px-4 py-2 text-xs font-bold text-white hover:bg-kisara-dark"
                >
                  Lanjutkan Bab {e.nextChapter}
                </Link>
              </li>
            ))}
          </ul>
        ))}

      {tab === "history" &&
        (history.length === 0 ? (
          <Empty text="Riwayat bacaan masih kosong." to="/catalog" cta="Mulai Membaca" />
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-white shadow-sm">
            {history.map((e) => (
              <li key={e.slug} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div className="min-w-0">
                  <Link to={`/story/${e.slug}`} className="font-serif font-bold text-gray-900 hover:text-kisara">
                    {e.story.title}
                  </Link>
                  <p className="text-xs text-gray-500">
                    Bab terakhir: {e.lastChapter ?? "-"} · {e.percent}% selesai
                    {e.updatedAt && ` · ${formatDate(e.updatedAt)}`}
                  </p>
                </div>
                <Link
                  to={`/story/${e.slug}/read/${e.lastChapter ?? 1}`}
                  className="text-sm font-bold text-kisara hover:underline"
                >
                  {e.done ? "Baca Ulang" : "Lanjutkan"} →
                </Link>
              </li>
            ))}
          </ul>
        ))}

      {tab === "points" &&
        ((profile.transactions ?? []).length === 0 ? (
          <Empty text="Belum ada transaksi poin." />
        ) : (
          <ul className="divide-y divide-line rounded-xl border border-line bg-white shadow-sm">
            {profile.transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">{TX_LABEL[t.type] ?? t.type}</p>
                  <p className="truncate text-xs text-gray-500">
                    {txNote(t.note)} · {formatDate(t.createdAt)}
                  </p>
                </div>
                <span className={`shrink-0 font-bold ${t.amount >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {t.amount >= 0 ? "+" : ""}
                  {t.amount} Koin
                </span>
              </li>
            ))}
          </ul>
        ))}
    </div>
  );
}