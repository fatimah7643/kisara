import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCategories, getRegions, getStats } from "../../services/storiesService";
import { fetchStories } from "../../services/catalogApi";
import { useAsync } from "../../hooks/useAsync";
import { toggleBookmark } from "../../services/userService";
import StoryCard from "../../components/StoryCard/StoryCard";

const regions = getRegions();
const categories = getCategories();
const stats = getStats();
const EMPTY_RESULT = { items: [], total: 0, baseTotal: 0, page: 1, pageCount: 1, categoryCounts: {} };

const SORT_OPTIONS = [
  { value: "chapters", label: "Paling lengkap (bab terbanyak)" },
  { value: "title", label: "Judul A–Z" },
  { value: "short", label: "Bacaan tersingkat" },
];

// 1 … 4 5 6 … 24
function pageList(current, last) {
  const wanted = [...new Set([1, last, current - 1, current, current + 1])]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b);
  const out = [];
  wanted.forEach((p, i) => {
    if (i > 0 && p - wanted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

// Dipasang ulang (key) setiap q di URL berubah, jadi isi kolom selalu ikut URL.
function SearchBox({ initial, onSearch }) {
  const [text, setText] = useState(initial);
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(text.trim());
      }}
      className="flex flex-1 items-center gap-3 rounded-xl border border-line bg-white px-4 py-2 shadow-sm"
    >
      <span aria-hidden="true" className="text-gray-400">🔍</span>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="Cari di katalog"
        placeholder="Cari judul, daerah, atau kata dalam sinopsis…"
        className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
      />
      <button type="submit" className="rounded-lg bg-kisara px-5 py-2.5 text-sm font-bold text-white hover:bg-kisara-dark">
        Telusuri
      </button>
    </form>
  );
}

export default function Catalog() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [params, setParams] = useSearchParams();

  const q = params.get("q") ?? "";
  const region = params.get("region") ?? "";
  const category = params.get("category") ?? "";
  const sort = params.get("sort") ?? "chapters";
  const page = Number(params.get("page")) || 1;

  const { data: result, error } = useAsync(
    () => fetchStories({ q, region, category, sort, page }),
    [q, region, category, sort, page],
    { keepPrevious: true }
  );
  const data = result ?? EMPTY_RESULT;

  // Mengubah filter selalu kembali ke halaman 1, kecuali yang diubah memang halaman.
  function setParam(updates) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!("page" in updates)) next.delete("page");
    setParams(next);
  }

  function goToPage(p) {
    setParam({ page: p > 1 ? String(p) : "" });
    window.scrollTo({ top: 0 });
  }

  function handleBookmark(slug) {
    if (!user) {
      navigate("/login", { state: { from: location.pathname + location.search } });
      return;
    }
    toggleBookmark(user.id, slug);
    refreshProfile();
  }

  const hasFilters = Boolean(q || region || category);
  const tabs = [
    { value: "", label: "Semua", count: data.baseTotal },
    ...categories.map((c) => ({ value: c, label: c, count: data.categoryCounts[c] ?? 0 })),
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-kisara">● Arsip tutur lisan & naskah kuno</p>
      <h1 className="mb-3 font-serif text-4xl font-bold text-gray-900 lg:text-5xl">Katalog Jelajah Cerita Nusantara</h1>
      <p className="mb-8 max-w-2xl text-gray-600">
        Telusuri {stats.stories} cerita rakyat dan legenda dari {stats.regions} daerah di Nusantara.
      </p>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row">
        <SearchBox key={q} initial={q} onSearch={(text) => setParam({ q: text })} />
        <select
          aria-label="Filter wilayah"
          value={region}
          onChange={(e) => setParam({ region: e.target.value })}
          className="rounded-xl border border-line bg-white px-4 py-3 text-sm shadow-sm lg:w-64"
        >
          <option value="">Semua {stats.regions} Wilayah</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div role="tablist" aria-label="Kategori" className="mb-5 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = category === t.value;
          return (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setParam({ category: t.value })}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                active ? "bg-kisara text-white" : "border border-line bg-white text-gray-700 hover:border-kisara"
              }`}
            >
              {t.label} ({t.count})
            </button>
          );
        })}
      </div>

      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-gray-500">Wilayah:</span>
        {[{ value: "", label: "Semua Daerah" }, ...regions.map((r) => ({ value: r, label: r }))].map((r) => (
          <button
            key={r.label}
            type="button"
            aria-pressed={region === r.value}
            onClick={() => setParam({ region: r.value })}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold ${
              region === r.value ? "bg-sand text-kisara ring-1 ring-kisara" : "bg-white text-gray-600 ring-1 ring-line hover:ring-kisara"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="font-serif text-lg text-gray-900">
          Menampilkan <span className="font-bold text-kisara">{data.total}</span> Hikayat
        </p>
        <label className="flex items-center gap-2 text-xs text-gray-500">
          Urutkan:
          <select
            value={sort}
            onChange={(e) => setParam({ sort: e.target.value === "chapters" ? "" : e.target.value })}
            className="rounded-md border border-line bg-white px-3 py-1.5 text-xs font-semibold text-gray-800"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-6 py-16 text-center text-red-700">
          {error.message}
        </p>
      ) : !result ? (
        <p role="status" className="rounded-xl border border-line bg-white px-6 py-16 text-center text-gray-600">
          Memuat cerita…
        </p>
      ) : data.total === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="mb-2 font-serif text-2xl text-gray-900">Belum ada hikayat yang cocok</p>
          <p className="mb-6 text-sm text-gray-500">Coba kata kunci lain atau hapus filter yang sedang aktif.</p>
          {hasFilters && (
            <button
              type="button"
              onClick={() => setParams(new URLSearchParams())}
              className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
            >
              Atur ulang pencarian
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((story) => (
            <StoryCard
              key={story.slug}
              story={story}
              bookmarked={Boolean(profile?.bookmarks?.includes(story.slug))}
              onToggleBookmark={handleBookmark}
            />
          ))}
        </div>
      )}

      {data.pageCount > 1 && (
        <nav aria-label="Halaman" className="mt-10 flex items-center justify-center gap-1">
          <button
            type="button"
            disabled={data.page === 1}
            onClick={() => goToPage(data.page - 1)}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 enabled:hover:bg-sand disabled:opacity-40"
          >
            ‹ Sebelumnya
          </button>
          {pageList(data.page, data.pageCount).map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-2 text-gray-400">…</span>
            ) : (
              <button
                key={p}
                type="button"
                aria-current={p === data.page ? "page" : undefined}
                onClick={() => goToPage(p)}
                className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                  p === data.page ? "bg-kisara text-white" : "text-gray-700 hover:bg-sand"
                }`}
              >
                {p}
              </button>
            )
          )}
          <button
            type="button"
            disabled={data.page === data.pageCount}
            onClick={() => goToPage(data.page + 1)}
            className="rounded-lg px-3 py-2 text-sm text-gray-600 enabled:hover:bg-sand disabled:opacity-40"
          >
            Berikutnya ›
          </button>
        </nav>
      )}
    </div>
  );
}