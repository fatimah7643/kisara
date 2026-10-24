import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCategories, getRegions } from "../../services/storiesService";
import {
  EDITABLE,
  STATUS_META,
  emptyStory,
  getCreatorStory,
  newChapter,
  saveCreatorStory,
  submitCreatorStory,
} from "../../services/creatorService";

const categories = getCategories();
const origins = [...getRegions(), "Nusantara"];
const countWords = (text) => (text.match(/\S+/g) || []).length;

const inputCls =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-kisara disabled:bg-sand disabled:text-gray-500";
const labelCls = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600";

export default function CreatorEditor() {
  const { id } = useParams();
  const { user } = useAuth();
  const initial = useMemo(() => (id ? getCreatorStory(user.id, id) : emptyStory()), [id, user.id]);

  if (!initial) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="mb-3 font-serif text-3xl font-bold text-gray-900">Karya tidak ditemukan</h1>
        <p className="mb-8 text-gray-600">Karya ini tidak ada atau bukan milik akunmu.</p>
        <Link to="/creator" className="rounded-lg bg-kisara px-6 py-3 text-sm font-bold text-white hover:bg-kisara-dark">
          Kembali ke Ruang Kreator
        </Link>
      </div>
    );
  }

  // key: editor dibuat ulang saat pindah dari "baru" ke karya yang sudah tersimpan.
  return <EditorForm key={id ?? "new"} initial={initial} />;
}

function EditorForm({ initial }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initial);
  const [active, setActive] = useState(0);
  const [notice, setNotice] = useState(location.state?.notice ?? "");
  const [problems, setProblems] = useState([]);

  const readOnly = !EDITABLE.includes(form.status);
  const chapter = form.chapters[active] ?? form.chapters[0];
  const meta = STATUS_META[form.status];

  const firstPremium = form.chapters.findIndex((c) => c.isPremium);
  const orderWarning = firstPremium !== -1 && form.chapters.slice(firstPremium).some((c) => !c.isPremium);

  function setField(name, value) {
    setForm((f) => ({ ...f, [name]: value }));
    setNotice("");
  }

  function setChapter(patch) {
    setForm((f) => ({ ...f, chapters: f.chapters.map((c, i) => (i === active ? { ...c, ...patch } : c)) }));
    setNotice("");
  }

  function addChapter() {
    setForm((f) => ({ ...f, chapters: [...f.chapters, newChapter(f.chapters.length + 1)] }));
    setActive(form.chapters.length);
  }

  function removeChapter() {
    if (form.chapters.length <= 1) return;
    if (!window.confirm(`Hapus Bab ${active + 1}?`)) return;
    setForm((f) => ({
      ...f,
      chapters: f.chapters.filter((_, i) => i !== active).map((c, i) => ({ ...c, number: i + 1 })),
    }));
    setActive(Math.max(0, active - 1));
  }

  function moveChapter(dir) {
    const target = active + dir;
    if (target < 0 || target >= form.chapters.length) return;
    setForm((f) => {
      const list = [...f.chapters];
      [list[active], list[target]] = [list[target], list[active]];
      return { ...f, chapters: list.map((c, i) => ({ ...c, number: i + 1 })) };
    });
    setActive(target);
  }

  function handleSave() {
    setProblems([]);
    if (form.title.trim().length < 3) {
      setProblems(["Isi judul minimal 3 karakter sebelum menyimpan draft."]);
      return;
    }
    try {
      const saved = saveCreatorStory(user.id, form);
      if (!form.id) {
        navigate(`/creator/stories/${saved.id}/edit`, { replace: true, state: { notice: "Draft tersimpan ✓" } });
        return;
      }
      setForm(saved);
      setNotice("Draft tersimpan ✓");
    } catch (err) {
      setProblems([err.message]);
    }
  }

  function handleSubmit() {
    setProblems([]);
    if (form.title.trim().length < 3) {
      setProblems(["Judul minimal 3 karakter."]);
      return;
    }
    if (!window.confirm("Kirim karya ini untuk direview? Setelah dikirim, karya tidak bisa diubah sampai ada keputusan.")) {
      return;
    }
    try {
      const saved = saveCreatorStory(user.id, form);
      setForm(saved);
      submitCreatorStory(user.id, saved.id);
      navigate("/creator", { state: { notice: "Karya dikirim untuk review. Pantau statusnya di sini." } });
    } catch (err) {
      setProblems(err.problems ?? [err.message]);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pt-8 lg:px-8">
      <Link to="/creator" className="text-sm font-semibold text-gray-600 hover:text-kisara">
        ← Ruang Kreator
      </Link>
      <div className="mb-6 mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-serif text-3xl font-bold text-gray-900">{form.id ? "Edit Cerita" : "Cerita Baru"}</h1>
        <span className={`rounded px-2 py-1 text-xs font-bold ${meta.style}`}>{meta.label}</span>
      </div>

      {form.status === "REJECTED" && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="mb-0.5 font-bold">Karyamu ditolak</p>
          <p>{form.rejectionReason || "Tidak ada keterangan."}</p>
          <p className="mt-1 text-xs">Perbaiki lalu kirim ulang untuk review.</p>
        </div>
      )}
      {form.status === "PENDING" && (
        <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Karya ini sedang direview admin, jadi sementara tidak bisa diubah.
        </p>
      )}
      {form.status === "APPROVED" && (
        <p className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Karya ini sudah disetujui dan tidak bisa diubah.
        </p>
      )}
      {notice && (
        <p role="status" className="mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {notice}
        </p>
      )}
      {problems.length > 0 && (
        <div role="alert" className="mb-6 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="mb-1 font-bold">Perlu diperbaiki:</p>
          <ul className="list-inside list-disc">
            {problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Informasi cerita */}
      <fieldset disabled={readOnly} className="mb-8 min-w-0 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <legend className="px-2 font-serif text-lg font-bold text-gray-900">Informasi Cerita</legend>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="title" className={labelCls}>Judul</label>
            <input
              id="title"
              value={form.title}
              maxLength={120}
              onChange={(e) => setField("title", e.target.value)}
              className={inputCls}
              placeholder="Mis. Legenda Danau Toba"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="synopsis" className={labelCls}>Sinopsis</label>
            <textarea
              id="synopsis"
              rows={4}
              value={form.synopsis}
              maxLength={600}
              onChange={(e) => setField("synopsis", e.target.value)}
              className={inputCls}
              placeholder="Ringkasan singkat ceritamu (minimal 30 karakter)"
            />
            <p className="mt-1 text-right text-xs text-gray-400">{form.synopsis.length}/600</p>
          </div>
          <div>
            <label htmlFor="category" className={labelCls}>Kategori</label>
            <select id="category" value={form.category} onChange={(e) => setField("category", e.target.value)} className={inputCls}>
              <option value="">Pilih kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="origin" className={labelCls}>Daerah Asal</label>
            <select id="origin" value={form.origin} onChange={(e) => setField("origin", e.target.value)} className={inputCls}>
              <option value="">Pilih daerah</option>
              {origins.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Sampul dibuat otomatis dari daerah dan judul, seperti di katalog. Unggah sampul sendiri menyusul saat backend
          tersambung.
        </p>
      </fieldset>

      {/* Bab */}
      <section aria-labelledby="judul-bab" className="mb-8">
        <h2 id="judul-bab" className="mb-4 font-serif text-xl font-bold text-gray-900">Bab</h2>
        {orderWarning && (
          <p className="mb-4 rounded border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
            Ada bab gratis setelah bab premium. Sebaiknya bab gratis berada di depan supaya pembaca bisa mencoba dulu.
          </p>
        )}

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div>
            <ul className="mb-3 space-y-2">
              {form.chapters.map((c, i) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-current={i === active}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-left text-sm ${
                      i === active ? "border-kisara bg-kisara-soft/30 font-bold" : "border-line bg-white hover:border-kisara"
                    }`}
                  >
                    <span className="min-w-0 truncate">
                      Bab {i + 1}
                      {c.title && <span className="font-normal text-gray-500"> · {c.title}</span>}
                    </span>
                    <span
                      className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        c.isPremium ? "bg-amber-50 text-amber-700" : "bg-green-50 text-green-700"
                      }`}
                    >
                      {c.isPremium ? "Premium" : "Gratis"}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {!readOnly && (
              <button
                type="button"
                onClick={addChapter}
                className="w-full rounded-lg border border-dashed border-kisara px-3 py-2.5 text-sm font-bold text-kisara hover:bg-kisara-soft/20"
              >
                + Tambah Bab
              </button>
            )}
          </div>

          <fieldset disabled={readOnly} className="min-w-0 rounded-2xl border border-line bg-white p-6 shadow-sm">
            <legend className="px-2 font-serif text-lg font-bold text-gray-900">Bab {active + 1}</legend>
            <div className="grid gap-5">
              <div>
                <label htmlFor="ch-title" className={labelCls}>Judul Bab (opsional)</label>
                <input
                  id="ch-title"
                  value={chapter.title}
                  maxLength={100}
                  onChange={(e) => setChapter({ title: e.target.value })}
                  className={inputCls}
                  placeholder={`Bab ${active + 1}`}
                />
              </div>

              <div>
                <span className={labelCls}>Akses</span>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="access"
                      checked={!chapter.isPremium}
                      onChange={() => setChapter({ isPremium: false })}
                      className="accent-kisara"
                    />
                    Gratis
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="access"
                      checked={chapter.isPremium}
                      onChange={() => setChapter({ isPremium: true })}
                      className="accent-kisara"
                    />
                    Premium
                  </label>
                  {chapter.isPremium && (
                    <label className="flex items-center gap-2 text-sm">
                      Harga
                      <input
                        type="number"
                        min="1"
                        value={chapter.price}
                        onChange={(e) => setChapter({ price: e.target.value })}
                        className={`${inputCls} w-24`}
                      />
                      Koin
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="ch-content" className={labelCls}>Isi Bab</label>
                <textarea
                  id="ch-content"
                  rows={16}
                  value={chapter.content}
                  onChange={(e) => setChapter({ content: e.target.value })}
                  className={`${inputCls} font-serif leading-7`}
                  placeholder="Tulis isi bab di sini. Pisahkan paragraf dengan baris kosong (minimal 100 karakter)."
                />
                <p className="mt-1 text-right text-xs text-gray-400">{countWords(chapter.content)} kata</p>
              </div>

              {!readOnly && (
                <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
                  <button
                    type="button"
                    onClick={() => moveChapter(-1)}
                    disabled={active === 0}
                    className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-kisara disabled:opacity-40"
                  >
                    ↑ Naikkan
                  </button>
                  <button
                    type="button"
                    onClick={() => moveChapter(1)}
                    disabled={active === form.chapters.length - 1}
                    className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-bold text-gray-700 hover:border-kisara disabled:opacity-40"
                  >
                    ↓ Turunkan
                  </button>
                  <button
                    type="button"
                    onClick={removeChapter}
                    disabled={form.chapters.length <= 1}
                    className="ml-auto rounded-lg px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 disabled:opacity-40"
                  >
                    Hapus Bab Ini
                  </button>
                </div>
              )}
            </div>
          </fieldset>
        </div>
      </section>

      {!readOnly && (
        <div className="sticky bottom-0 -mx-4 flex flex-wrap justify-end gap-3 border-t border-line bg-cream/95 px-4 py-3 backdrop-blur lg:-mx-8 lg:px-8">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-lg border border-line bg-white px-5 py-2.5 text-sm font-bold text-gray-800 hover:border-kisara"
          >
            Simpan Draft
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-kisara px-5 py-2.5 text-sm font-bold text-white hover:bg-kisara-dark"
          >
            Kirim untuk Review
          </button>
        </div>
      )}
    </div>
  );
}