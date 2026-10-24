import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CoverArt from "../../components/CoverArt/CoverArt";
import {
  EDITABLE,
  STATUS_META,
  deleteCreatorStory,
  listCreatorStories,
  reviewCreatorStory,
} from "../../services/creatorService";
import { formatDateTime } from "../../utils/format";

const FILTERS = [
  { id: "ALL", label: "Semua" },
  { id: "DRAFT", label: "Draft" },
  { id: "PENDING", label: "Menunggu" },
  { id: "APPROVED", label: "Disetujui" },
  { id: "REJECTED", label: "Ditolak" },
];

export default function CreatorDashboard() {
  const { user, profile } = useAuth();
  const location = useLocation();
  const [stories, setStories] = useState(() => listCreatorStories(user.id));
  const [filter, setFilter] = useState("ALL");
  const [notice, setNotice] = useState(location.state?.notice ?? "");
  const [error, setError] = useState("");

  const refresh = () => setStories(listCreatorStories(user.id));
  const count = (status) => stories.filter((s) => s.status === status).length;
  const visible = filter === "ALL" ? stories : stories.filter((s) => s.status === filter);
  const totalChapters = stories.reduce((t, s) => t + s.chapters.length, 0);

  function handleDelete(story) {
    if (!window.confirm(`Hapus "${story.title || "Tanpa judul"}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setError("");
    try {
      deleteCreatorStory(user.id, story.id);
      refresh();
      setNotice("Karya dihapus.");
    } catch (err) {
      setError(err.message);
    }
  }

  // SIMULASI keputusan admin — hapus saat halaman moderasi admin sudah ada.
  function handleReview(story, decision) {
    let reason = "";
    if (decision === "reject") {
      const input = window.prompt("Alasan penolakan (simulasi admin):", "Sinopsis dan isi bab perlu diperbaiki.");
      if (input === null) return;
      reason = input.trim() || "Karya belum memenuhi pedoman.";
    }
    setError("");
    try {
      reviewCreatorStory(user.id, story.id, decision, reason);
      refresh();
      setNotice(decision === "approve" ? "Karya disetujui (simulasi)." : "Karya ditolak (simulasi).");
    } catch (err) {
      setError(err.message);
    }
  }

  const stats = [
    { label: "Total Karya", value: stories.length },
    { label: "Total Bab", value: totalChapters },
    { label: "Menunggu Review", value: count("PENDING") },
    { label: "Disetujui", value: count("APPROVED") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 lg:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-kisara">Ruang Kreator</p>
          <h1 className="font-serif text-3xl font-bold text-gray-900">Halo, {profile?.name}!</h1>
          <p className="mt-1 text-gray-600">Tulis, kirim untuk review, dan pantau status karyamu di sini.</p>
        </div>
        <Link
          to="/creator/stories/new"
          className="rounded-lg bg-kisara px-5 py-3 text-sm font-bold text-white hover:bg-kisara-dark"
        >
          ✍️ Tulis Cerita Baru
        </Link>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-white p-5 shadow-sm">
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-gray-500">{s.label}</p>
            <p className="font-serif text-3xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {notice && (
        <p role="status" className="mb-5 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="mb-5 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div role="tablist" aria-label="Filter status" className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`whitespace-nowrap rounded-t-lg px-4 py-3 text-sm font-bold ${
              filter === f.id ? "bg-kisara text-white" : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {f.label}
            {f.id !== "ALL" && ` (${count(f.id)})`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-white px-6 py-12 text-center">
          <p className="mb-4 text-gray-600">
            {stories.length === 0 ? "Kamu belum punya karya. Mulai tulis ceritamu yang pertama!" : "Tidak ada karya dengan status ini."}
          </p>
          {stories.length === 0 && (
            <Link
              to="/creator/stories/new"
              className="rounded-lg bg-kisara px-5 py-2.5 text-sm font-bold text-white hover:bg-kisara-dark"
            >
              Tulis Cerita Baru
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {visible.map((s) => {
            const meta = STATUS_META[s.status];
            const editable = EDITABLE.includes(s.status);
            return (
              <li key={s.id} className="rounded-xl border border-line bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-4">
                  <CoverArt story={{ origin: s.origin || "Nusantara", slug: s.id }} className="h-20 w-20 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-xs font-bold ${meta.style}`}>{meta.label}</span>
                      <span className="text-xs text-gray-500">
                        {s.chapters.length} bab · diperbarui {formatDateTime(s.updatedAt)}
                      </span>
                    </div>
                    <h2 className="truncate font-serif text-lg font-bold text-gray-900">{s.title || "Tanpa judul"}</h2>
                    <p className="text-xs text-gray-500">
                      {[s.origin, s.category].filter(Boolean).join(" · ") || "Daerah & kategori belum diisi"}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Link
                      to={`/creator/stories/${s.id}/edit`}
                      className="rounded-lg bg-sand px-4 py-2 text-xs font-bold text-gray-800 hover:bg-line"
                    >
                      {editable ? "Edit" : "Lihat"}
                    </Link>
                    {editable && (
                      <button
                        type="button"
                        onClick={() => handleDelete(s)}
                        className="rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </div>

                {s.status === "REJECTED" && (
                  <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    <p className="mb-0.5 font-bold">Alasan penolakan</p>
                    <p>{s.rejectionReason || "Tidak ada keterangan."}</p>
                    <p className="mt-1 text-xs text-red-700">Perbaiki karyamu lalu kirim ulang untuk review.</p>
                  </div>
                )}

                {s.status === "PENDING" && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-kisara/50 bg-kisara-soft/20 px-4 py-3">
                    <p className="mr-auto text-xs text-gray-600">Simulasi moderasi admin (sementara):</p>
                    <button
                      type="button"
                      onClick={() => handleReview(s, "approve")}
                      className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-green-700"
                    >
                      Setujui
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReview(s, "reject")}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
                    >
                      Tolak
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}