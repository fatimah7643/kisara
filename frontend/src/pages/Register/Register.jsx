
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password ||
      !confirmPassword
    ) {
      setMessage("Semua kolom wajib diisi.");
      setMessageType("error");
      return;
    }

    if (password.length < 8) {
      setMessage("Kata sandi harus terdiri dari minimal 8 karakter.");
      setMessageType("error");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Konfirmasi kata sandi belum cocok.");
      setMessageType("error");
      return;
    }

    setMessage(
      "Validasi berhasil! Pendaftaran belum diproses karena autentikasi belum terhubung."
    );
    setMessageType("success");
  }

  return (
    <main className="auth-page register-page">
      <section className="auth-card register-card">
        <Link to="/" className="auth-logo">
          KiSara<span>.id</span>
        </Link>

        <p className="auth-eyebrow">MULAI PERJALANANMU</p>
        <h1>Buat Akun</h1>
        <p className="auth-description">
          Bergabunglah dan temukan cerita penuh makna dari Nusantara.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="register-name">Nama Lengkap</label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="register-password">Kata Sandi</label>
          <input
            id="register-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />

          <label htmlFor="register-confirm-password">
            Konfirmasi Kata Sandi
          </label>
          <div className="auth-password-field">
            <input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Ulangi kata sandi"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
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
            <p
              className={`auth-message register-message ${messageType}`}
              role="status"
            >
              {message}
            </p>
          )}

          <button type="submit" className="auth-submit">
            Buat Akun
          </button>
        </form>

        <p className="auth-switch">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </p>

        <Link to="/catalog" className="auth-back">
          ← Jelajahi cerita tanpa mendaftar
        </Link>
      </section>
    </main>
  );
}

export default Register;
