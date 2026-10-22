// Mengubah pesan error Supabase (bahasa Inggris) menjadi pesan yang ramah pengguna.
export function authErrorMessage(error) {
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("invalid login credentials")) return "Email atau kata sandi salah.";
  if (msg.includes("email not confirmed")) return "Email belum diverifikasi. Cek kotak masuk emailmu.";
  if (msg.includes("already registered") || msg.includes("already been registered")) {
    return "Email ini sudah terdaftar. Silakan masuk.";
  }
  if (msg.includes("rate limit") || msg.includes("too many")) {
    return "Terlalu banyak percobaan. Coba lagi beberapa menit lagi.";
  }
  if (msg.includes("password")) return "Kata sandi tidak memenuhi syarat (minimal 8 karakter).";
  if (msg.includes("failed to fetch") || msg.includes("network")) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internetmu.";
  }
  return "Terjadi kesalahan. Silakan coba lagi.";
}