
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!email.trim() || !password) {
      setMessage("Email dan kata sandi wajib diisi.");
      return;
    }

    setMessage(
      "Form valid. Autentikasi belum terhubung ke backend."
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="auth-logo">
          KiSara<span>.id</span>
        </Link>

        <p className="auth-eyebrow">SELAMAT DATANG KEMBALI</p>
        <h1>Masuk ke KiSara</h1>
        <p className="auth-description">
          Lanjutkan perjalananmu menjelajahi cerita Nusantara.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="login-password">Kata Sandi</label>
          <div className="auth-password-field">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={
                showPassword
                  ? "Sembunyikan kata sandi"
                  : "Tampilkan kata sandi"
              }
            >
              {showPassword ? "Sembunyikan" : "Lihat"}
            </button>
          </div>

          {message && (
            <p className="auth-message" role="status">
              {message}
            </p>
          )}

          <button type="submit" className="auth-submit">
            Masuk
          </button>
        </form>

        <p className="auth-switch">
          Belum punya akun? <Link to="/register">Daftar sekarang</Link>
        </p>

        <Link to="/catalog" className="auth-back">
          ← Jelajahi cerita tanpa masuk
        </Link>
      </section>
    </main>
  );
}

export default Login;
