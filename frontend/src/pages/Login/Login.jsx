import { Link } from 'react-router-dom';

export default function Login() {
  return (
    <div className="min-h-screen flex">
      {/* KIRI - Banner (Sembunyi di layar kecil) */}
      <div className="hidden lg:flex w-5/12 bg-[#A34321] text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Opsional: Tambahkan background pattern di sini */}
        <div className="relative z-10">
          <div className="text-sm font-semibold tracking-widest text-[#F3D2A4] mb-12">
            ● PUSTAKA CERITA DIGITAL NUSANTARA
          </div>
          
          <div className="bg-[#8A3619] p-8 rounded-lg mb-8">
            <span className="text-xs font-bold bg-[#B55530] px-2 py-1 rounded text-white mb-4 inline-block">
              HIKMAH LELUHUR
            </span>
            <h2 className="text-3xl font-serif leading-snug italic mb-4">
              "Setiap helai kisah leluhur menyimpan kebijaksanaan yang melintasi masa."
            </h2>
            <p className="text-sm text-[#F3D2A4]">— KiSara.id Dokumen Kolektif</p>
          </div>

          <div className="flex gap-4">
            <div className="bg-[#8A3619] p-6 rounded-lg flex-1">
              <h3 className="text-3xl font-serif font-bold mb-1">45rb+</h3>
              <p className="text-sm text-[#F3D2A4]">Pembaca Budaya Terhubung</p>
            </div>
            <div className="bg-[#8A3619] p-6 rounded-lg flex-1">
              <h3 className="text-3xl font-serif font-bold mb-1">1.2rb</h3>
              <p className="text-sm text-[#F3D2A4]">Legenda & Cerita Rakyat</p>
            </div>
          </div>
        </div>
      </div>

      {/* KANAN - Form Login */}
      <div className="w-full lg:w-7/12 bg-[#FCFAF6] flex flex-col justify-center p-8 sm:p-16 lg:px-32">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <img src="/kisara-logo.png" alt="KiSara Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-[#A34321]">KiSara.id</h1>
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Gerbang Masuk Kebudayaan</p>
            </div>
          </div>

          <h2 className="text-4xl font-serif text-gray-900 mb-4">Selamat Datang Kembali di KiSara</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Lanjutkan petualangan membaca atau mengelola karya Anda di ruang sastra Nusantara.
          </p>

          <div className="flex gap-2 mb-6">
            <button className="flex-1 py-3 text-sm font-semibold text-[#A34321] border border-[#A34321] rounded bg-[#FCFAF6]">Sebagai Pembaca</button>
            <button className="flex-1 py-3 text-sm font-medium text-gray-500 bg-gray-100 rounded">Sebagai Kreator / Editor</button>
          </div>

          <button className="w-full py-3 mb-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50">
            Lanjutkan dengan Google
          </button>
          <button className="w-full py-3 mb-8 text-sm font-medium text-[#1E3A8A] bg-[#E0E7FF] rounded flex items-center justify-center gap-2 hover:bg-[#C7D2FE]">
            Lanjutkan dengan Akun Belajar.id
          </button>

          <div className="flex items-center gap-4 mb-6">
            <hr className="flex-1 border-gray-300" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Atau Masuk Dengan Email</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <form>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email atau Nama Pengguna</label>
              <input type="email" placeholder="@ nama@nusantara.id" className="w-full px-4 py-3 rounded bg-[#F4F1EA] border-none focus:ring-2 focus:ring-[#A34321] outline-none" />
            </div>
            
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Kata Sandi</label>
                <a href="#" className="text-xs font-bold text-[#A34321]">Lupa Kata Sandi?</a>
              </div>
              <input type="password" placeholder="••••••••••••" className="w-full px-4 py-3 rounded bg-[#F4F1EA] border-none focus:ring-2 focus:ring-[#A34321] outline-none" />
            </div>

            <div className="flex items-center justify-between mb-8">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" className="rounded text-[#A34321] focus:ring-[#A34321]" />
                Ingat saya di peramban ini
              </label>
            </div>

            <button type="submit" className="w-full py-4 text-white bg-[#A34321] hover:bg-[#8A3619] rounded font-semibold text-lg transition-colors flex justify-center items-center gap-2">
              Masuk ke Platform →
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Belum memiliki akun KiSara? <Link to="/register" className="font-bold text-[#A34321]">Daftar Sekarang Gratis</Link>
          </p>
        </div>
      </div>
    </div>
  );
}