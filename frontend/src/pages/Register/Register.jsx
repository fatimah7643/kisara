import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRegions, getStats } from "../../services/storiesService";
import { authErrorMessage } from "../../utils/authErrors";
import Logo from "../../components/Logo/Logo";

const stats = getStats();
const regions = getRegions();

const ROLES = [
  {
    value: "reader",
    title: "Pembaca Cerita",
    desc: "Membaca cerita, mengumpulkan poin, dan membuka chapter premium.",
  },
  {
    value: "creator",
    title: "Penulis / Kreator",
    desc: "Menulis cerita dan mengirimkannya untuk ditinjau editor.",
  },
];

const BENEFITS = [
  { icon: "🌍", title: `Peta Digital ${stats.regions} Daerah`, desc: "Jelajahi cerita rakyat dari berbagai daerah di Nusantara." },
  { icon: "🔖", title: "Bookmark & Riwayat Baca", desc: "Simpan cerita favorit dan lanjutkan dari bab terakhir." },
  { icon: "✍️", title: "Panggung Kreator", desc: "Tulis cerita dari daerahmu dan kirim untuk ditinjau editor." },
];

const inputClass =
  "w-full px-4 py-3 rounded bg-white border border-gray-300 outline-none focus:ring-2 focus:ring-kisara";

export default function Register() {
  const { signUp } = useAuth();
  const [form, setForm] = useState({
    role: "reader",
    name: "",
    email: "",
    password: "",
    confirm: "",
    region: "",
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  function validate() {
    if (form.name.trim().length < 2) return "Nama lengkap minimal 2 karakter.";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) return "Format email tidak valid.";
    if (form.password.length < 8) return "Kata sandi minimal 8 karakter.";
    if (form.password !== form.confirm) return "Konfirmasi kata sandi tidak sama.";
    if (!form.agree) return "Kamu perlu menyetujui ketentuan layanan.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");

    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }

    setSubmitting(true);
    const { data, error: authError } = await signUp({
      email: form.email.trim(),
      password: form.password,
      name: form.name.trim(),
      role: form.role,
      regionInterest: form.region,
    });
    setSubmitting(false);

    if (authError) {
      setError(authErrorMessage(authError));
      return;
    }

    // Jika verifikasi email aktif di Supabase, belum ada sesi sampai email dikonfirmasi.
    // Jika tidak, GuestRoute otomatis mengarahkan ke dashboard.
    if (!data.session) {
      setInfo("Akun dibuat. Cek email kamu untuk verifikasi, lalu masuk.");
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4 lg:p-10">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-10">
        {/* KIRI - Benefit */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          <div className="bg-kisara text-white p-10 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-kisara-soft bg-kisara-dark px-3 py-1 rounded">
                HADIAH SAMBUTAN
              </span>
              <span className="text-xs border border-kisara-soft text-kisara-soft px-3 py-1 rounded-full">
                +50 Poin Koin
              </span>
            </div>
            <h2 className="text-4xl font-serif leading-tight mb-4">
              Gerbang Menuju Ribuan Tutur Leluhur Nusantara
            </h2>
            <p className="text-sm text-kisara-soft leading-relaxed mb-6">
              Daftarkan diri Anda hari ini dan dapatkan bonus 50 Poin Koin KiSara untuk membuka bab cerita
              premium.
            </p>
            <p className="text-xs font-semibold">
              {stats.stories} cerita rakyat · {stats.chapters} bab siap dibaca
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">
              Keuntungan Menjadi Bagian KiSara.id
            </h3>
            <ul className="space-y-6">
              {BENEFITS.map((b) => (
                <li key={b.title} className="flex gap-4">
                  <div className="bg-sand p-3 rounded-lg h-fit">{b.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-800">{b.title}</h4>
                    <p className="text-sm text-gray-500">{b.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* KANAN - Form */}
        <div className="w-full lg:w-7/12 bg-white p-8 lg:p-12 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <Logo subtitle="Perpustakaan Kisah Nusantara" />
            <div className="text-right">
              <p className="text-xs text-gray-500">Langkah 1 dari 1</p>
              <p className="text-xs font-bold text-kisara">Pendaftaran Cepat</p>
            </div>
          </div>

          <h1 className="text-3xl font-serif text-gray-900 mb-2">Mulai Menjelajah Kisah Nusantara</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Buat akun KiSara dalam 1 menit, gratis. Bonus 50 poin langsung masuk ke akunmu.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <p role="alert" className="mb-5 rounded bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            {info && (
              <p role="status" className="mb-5 rounded bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
                {info}
              </p>
            )}

            <fieldset className="mb-6">
              <legend className="block text-sm font-bold text-gray-700 mb-3">
                Peran Anda di Ekosistem KiSara *
              </legend>
              <div className="flex flex-col sm:flex-row gap-4">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className="flex-1 cursor-pointer rounded-lg border-2 border-gray-100 p-4 hover:border-gray-300 has-[:checked]:border-kisara has-[:checked]:bg-cream"
                  >
                    <span className="flex items-center gap-2 mb-2">
                      <input
                        type="radio"
                        name="role"
                        value={r.value}
                        checked={form.role === r.value}
                        onChange={() => update("role", r.value)}
                        className="accent-kisara"
                      />
                      <span className="font-bold text-gray-800">{r.title}</span>
                    </span>
                    <span className="block text-xs text-gray-500">{r.desc}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="space-y-5 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Contoh: Siti Danum Harum"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Alamat Email Aktif *
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="nama@alamatdomain.id"
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                    Buat Kata Sandi *
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="Min. 8 karakter"
                    className={inputClass}
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="confirm" className="block text-sm font-bold text-gray-700 mb-2">
                    Konfirmasi Kata Sandi *
                  </label>
                  <input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={(e) => update("confirm", e.target.value)}
                    placeholder="Ulangi kata sandi"
                    className={inputClass}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="text-xs font-bold text-kisara"
              >
                {showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              </button>

              <div>
                <label htmlFor="region" className="block text-sm font-bold text-gray-700 mb-2">
                  Daerah Asal atau Minat Tradisi Utama{" "}
                  <span className="font-normal text-gray-400">(opsional)</span>
                </label>
                <select
                  id="region"
                  value={form.region}
                  onChange={(e) => update("region", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Lintas Seluruh Nusantara (Eksplorasi Umum)</option>
                  {regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label className="flex items-start gap-3 mb-8">
              <input
                type="checkbox"
                checked={form.agree}
                onChange={(e) => update("agree", e.target.checked)}
                className="mt-1 accent-kisara"
              />
              <span className="text-sm text-gray-600 leading-tight">
                Saya menyetujui <span className="font-bold text-kisara">Ketentuan Layanan</span>,{" "}
                <span className="font-bold text-kisara">Kebijakan Privasi</span>, dan berjanji menjunjung
                tinggi Kode Etik Pelestarian Budaya KiSara.id.
              </span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-white bg-kisara hover:bg-kisara-dark disabled:opacity-60 rounded font-semibold text-lg transition-colors"
            >
              {submitting ? "Memproses…" : "Buat Akun KiSara & Klaim 50 Poin →"}
            </button>

            <p className="mt-6 text-center text-sm text-gray-600">
              Sudah memiliki akun penjelajah?{" "}
              <Link to="/login" className="font-bold text-kisara">
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}