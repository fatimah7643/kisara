import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getStats } from "../../services/storiesService";
import { authErrorMessage } from "../../utils/authErrors";
import Logo from "../../components/Logo/Logo";

const stats = getStats();

export default function Login() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signIn(email.trim(), password);
    setSubmitting(false);

    // Jika berhasil, GuestRoute otomatis mengarahkan ke halaman tujuan.
    if (authError) setError(authErrorMessage(authError));
  }

  return (
    <div className="min-h-screen flex">
      {/* KIRI - Banner (disembunyikan di layar kecil) */}
      <div className="hidden lg:flex w-5/12 bg-kisara text-white p-12 flex-col justify-between">
        <div className="text-sm font-semibold tracking-widest text-kisara-soft">
          ● PUSTAKA CERITA DIGITAL NUSANTARA
        </div>

        <div>
          <div className="bg-kisara-dark p-8 rounded-lg mb-6">
            <span className="text-xs font-bold bg-kisara-light px-2 py-1 rounded text-white mb-4 inline-block">
              HIKMAH LELUHUR
            </span>
            <p className="text-3xl font-serif leading-snug italic mb-4">
              “Setiap helai kisah leluhur menyimpan kebijaksanaan yang melintasi masa.”
            </p>
            <p className="text-sm text-kisara-soft">— KiSara.id Dokumen Kolektif</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-kisara-dark p-6 rounded-lg flex-1">
              <p className="text-3xl font-serif font-bold mb-1">{stats.stories}</p>
              <p className="text-sm text-kisara-soft">Cerita Rakyat</p>
            </div>
            <div className="bg-kisara-dark p-6 rounded-lg flex-1">
              <p className="text-3xl font-serif font-bold mb-1">{stats.chapters}</p>
              <p className="text-sm text-kisara-soft">Bab Siap Dibaca</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-kisara-soft">Dari {stats.regions} daerah di Nusantara</p>
      </div>

      {/* KANAN - Form Login */}
      <div className="w-full lg:w-7/12 bg-cream flex flex-col justify-center p-8 sm:p-16 lg:px-32">
        <div className="max-w-md w-full mx-auto">
          <Logo subtitle="Gerbang Masuk Kebudayaan" className="mb-10" />

          <h1 className="text-4xl font-serif text-gray-900 mb-4">Selamat Datang Kembali di KiSara</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Lanjutkan petualangan membaca atau mengelola karya Anda di ruang sastra Nusantara.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {error && (
              <p role="alert" className="mb-5 rounded bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@nusantara.id"
                className="w-full px-4 py-3 rounded bg-sand outline-none focus:ring-2 focus:ring-kisara"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pr-20 rounded bg-sand outline-none focus:ring-2 focus:ring-kisara"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-kisara"
                >
                  {showPassword ? "Sembunyikan" : "Lihat"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 text-white bg-kisara hover:bg-kisara-dark disabled:opacity-60 rounded font-semibold text-lg transition-colors"
            >
              {submitting ? "Memproses…" : "Masuk ke Platform →"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Belum memiliki akun KiSara?{" "}
            <Link to="/register" className="font-bold text-kisara">
              Daftar Sekarang Gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}