import { Link } from 'react-router-dom';

export default function Register() {
  return (
    <div className="min-h-screen bg-[#FCFAF6] flex items-center justify-center p-4 lg:p-10">
      <div className="max-w-6xl w-full bg-[#FCFAF6] flex flex-col lg:flex-row gap-10">
        
        {/* KIRI - Benefit Box */}
        <div className="w-full lg:w-5/12 flex flex-col gap-6">
          <div className="bg-[#A34321] text-white p-10 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-[#F3D2A4] bg-[#8A3619] px-3 py-1 rounded">HADIAH SAMBUTAN</span>
              <span className="text-xs border border-[#F3D2A4] text-[#F3D2A4] px-3 py-1 rounded-full">+50 Poin Koin</span>
            </div>
            <h2 className="text-4xl font-serif leading-tight mb-4">Gerbang Menuju Ribuan Tutur Leluhur Nusantara</h2>
            <p className="text-sm text-[#F3D2A4] leading-relaxed mb-6">
              Daftarkan diri Anda hari ini dan dapatkan bonus 50 Poin Koin KiSara untuk membuka bab cerita hikayat eksklusif, arsip mitologi pesisir, serta naskah tutur lisan yang telah terdigitalisasi.
            </p>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-[#A34321]"></div>
                <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-[#A34321]"></div>
                <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-[#A34321]"></div>
              </div>
              <span>Terhubung dengan 14.200+ pelestari cerita</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200">
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-6">Keuntungan Menjadi Bagian KiSara.id</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="bg-[#F4F1EA] p-3 rounded-lg text-[#A34321]">🌍</div>
                <div>
                  <h4 className="font-bold text-gray-800">Peta Digital 38 Provinsi</h4>
                  <p className="text-sm text-gray-500">Jelajahi folklore lintas pulau dari legenda maritim...</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="bg-[#F4F1EA] p-3 rounded-lg text-[#A34321]">🔖</div>
                <div>
                  <h4 className="font-bold text-gray-800">Sinkronisasi & Glosarium Pribadi</h4>
                  <p className="text-sm text-gray-500">Simpan posisi baca, bookmark bab penting...</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* KANAN - Form Pendaftaran */}
        <div className="w-full lg:w-7/12 bg-white p-8 lg:p-12 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <img src="/kisara-logo.png" alt="KiSara Logo" className="w-10 h-10" />
              <div>
                <h1 className="text-xl font-serif font-bold text-[#A34321]">KiSara.id</h1>
                <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">Perpustakaan Kisah Nusantara</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Langkah 1 dari 1</p>
              <p className="text-xs font-bold text-[#A34321]">Pendaftaran Cepat</p>
            </div>
          </div>

          <h2 className="text-3xl font-serif text-gray-900 mb-2">Mulai Menjelajah Kisah Nusantara</h2>
          <p className="text-gray-500 mb-8 text-sm">Buat akun KiSara dalam 1 menit, gratis selamanya. Dapatkan akses penuh ke perbendaharaan cerita adat.</p>

          <form>
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-3">Peran Anda di Ekosistem KiSara *</label>
              <div className="flex gap-4">
                <label className="flex-1 border-2 border-[#A34321] rounded-lg p-4 cursor-pointer bg-[#FCFAF6]">
                  <div className="flex items-center gap-2 mb-2">
                    <input type="radio" name="role" defaultChecked className="text-[#A34321]" />
                    <span className="font-bold text-gray-800">Pembaca Cerita</span>
                  </div>
                  <p className="text-xs text-gray-500">Menikmati bacaan, audio cerita, dan mengoleksi lencana daerah.</p>
                </label>
                <label className="flex-1 border-2 border-gray-100 rounded-lg p-4 cursor-pointer hover:border-gray-300 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <input type="radio" name="role" className="text-[#A34321]" />
                    <span className="font-bold text-gray-800">Penulis / Kreator</span>
                  </div>
                  <p className="text-xs text-gray-500">Mengarsipkan tradisi lisan, menulis ulang hikayat, dan kurasi bab.</p>
                </label>
              </div>
            </div>

            {/* Input fields */}
            <div className="space-y-5 mb-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Lengkap *</label>
                <input type="text" placeholder="Contoh: Siti Danum Harum" className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:ring-2 focus:ring-[#A34321] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Alamat Email Aktif *</label>
                <input type="email" placeholder="nama@alamatdomain.id" className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:ring-2 focus:ring-[#A34321] outline-none" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Buat Kata Sandi *</label>
                  <input type="password" placeholder="Min. 8 karakter" className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:ring-2 focus:ring-[#A34321] outline-none" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Konfirmasi Kata Sandi *</label>
                  <input type="password" placeholder="Ulangi kata sandi" className="w-full px-4 py-3 rounded bg-white border border-gray-300 focus:ring-2 focus:ring-[#A34321] outline-none" />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 mb-8">
              <input type="checkbox" className="mt-1 rounded text-[#A34321]" />
              <span className="text-sm text-gray-600 leading-tight">
                Saya menyetujui <a href="#" className="font-bold text-[#A34321]">Ketentuan Layanan</a>, <a href="#" className="font-bold text-[#A34321]">Kebijakan Privasi</a>, dan berjanji menjunjung tinggi Kode Etik Pelestarian Budaya KiSara.id.
              </span>
            </label>

            <button type="submit" className="w-full py-4 text-white bg-[#A34321] hover:bg-[#8A3619] rounded font-semibold text-lg transition-colors flex justify-center items-center gap-2">
              Buat Akun KiSara & Klaim 50 Poin →
            </button>
            
            <p className="mt-6 text-center text-sm text-gray-600">
              Sudah memiliki akun penjelajah? <Link to="/login" className="font-bold text-[#A34321]">Masuk di sini ⇥</Link>
            </p>
          </form>

        </div>
      </div>
    </div>
  );
}