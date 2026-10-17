import { Link } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FCFAF6] font-sans text-gray-800 pb-20">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/kisara-logo.png" alt="KiSara" className="w-8 h-8 bg-gray-200 rounded-full" />
            <div>
              <h1 className="text-xl font-serif font-bold text-[#A34321] leading-none">KiSara.id</h1>
              <p className="text-[9px] font-bold tracking-widest text-gray-500 uppercase">Cerita Nusantara</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center bg-[#F4F1EA] px-4 py-2 rounded-full w-80">
            <span className="text-gray-400 mr-2">🔍</span>
            <input type="text" placeholder="Cari hikayat, legenda..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center bg-[#F4F1EA] px-4 py-1.5 rounded-full text-sm font-semibold text-[#A34321]">
            <span className="text-yellow-500 mr-1">🪙</span> +350 KOIN
          </div>
          <button className="text-gray-500 hover:text-gray-700">🔔</button>
          <button className="bg-[#A34321] text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-[#8A3619]">Mulai Baca Gratis</button>
          <div className="flex items-center gap-2 border-l border-gray-300 pl-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
               {/* Placeholder foto profil */}
              <div className="w-full h-full bg-gray-400"></div>
            </div>
            <div className="hidden lg:block text-xs">
              <p className="font-bold text-gray-800">Raden Ayu...</p>
              <p className="text-gray-500">PEMBACA</p>
            </div>
          </div>
        </div>
      </nav>

      {/* KONTEN UTAMA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* HEADER PROFIL & SEDANG DIBACA */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-[#F4F1EA] text-[#A34321] text-xs font-bold px-2 py-1 rounded">RUANG BACA PRIBADI</span>
              <span className="text-xs text-gray-500 font-medium">🗺️ Penjelajah Hikayat Tk. 3</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-1">Selamat datang kembali, Raden Ayu Siti!</h2>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Sesi baca aktif • Terakhir dibaca 2 jam yang lalu
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm">
              <span className="text-orange-500 text-lg">🔥</span>
              <div>
                <p className="text-xs font-bold text-gray-800">5 Hari Beruntun</p>
                <p className="text-[10px] text-gray-500">Target harian 20 mnt</p>
              </div>
            </div>
            <button className="bg-[#F4F1EA] text-[#A34321] border border-[#A34321] px-4 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2">
               🪙 350 Koin ➕
            </button>
            <button className="bg-[#A34321] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#8A3619]">
              ✍️ Tulis Cerita
            </button>
          </div>
        </div>

        {/* KARTU "SEDANG DIBACA" (Hero Card) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-6 items-center shadow-sm mb-8">
          <div className="w-full md:w-32 h-32 bg-gray-300 rounded-lg overflow-hidden flex-shrink-0 relative">
             <div className="absolute inset-0 bg-blue-900/20"></div>
             <span className="absolute bottom-2 left-2 text-[10px] text-white font-bold bg-black/50 px-2 py-0.5 rounded">Sumatera</span>
          </div>
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-2 text-xs font-bold">
              <span className="text-red-500 uppercase tracking-wider">Sedang Dibaca</span>
              <span className="text-gray-400">🕒 14 Menit tersisa</span>
              <span className="text-gray-400">• Disimpan di Bab 4: Rahasia Sang Putri</span>
            </div>
            <h3 className="text-xl font-serif font-bold mb-1">Legenda Danau Toba & Putri Ikan Mas</h3>
            <p className="text-sm text-gray-500 mb-4 line-clamp-1">Kutukan janji terlarang di tanah Batak dan kelahiran samudra air tawar raksasa yang mengubah takdir...</p>
            
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#A34321] w-[68%] h-full"></div>
              </div>
              <span className="text-xs font-bold text-gray-600">68% (Bab 4 / 6)</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">🔖</button>
            <button className="bg-[#A34321] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#8A3619] whitespace-nowrap">
              Lanjutkan Bab 4 →
            </button>
          </div>
        </div>

        {/* STATISTIK 4 KOLOM */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Hikayat Selesai</p>
              <h4 className="text-3xl font-serif font-bold text-gray-900">18</h4>
              <p className="text-xs text-green-600 font-medium mt-1">📈 +3 bulan ini</p>
            </div>
            <span className="text-[#A34321] bg-[#F4F1EA] p-2 rounded-lg">📖</span>
          </div>
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Saldo Koin Kirana</p>
              <h4 className="text-3xl font-serif font-bold text-[#A34321]">350 <span className="text-sm font-sans text-gray-500">Koin</span></h4>
              <p className="text-xs text-gray-500 mt-1">+ Beli Poin Sandbox</p>
            </div>
            <span className="text-yellow-600 bg-yellow-50 p-2 rounded-lg">🪙</span>
          </div>
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Bab Premium Terbuka</p>
              <h4 className="text-3xl font-serif font-bold text-gray-900">7</h4>
              <p className="text-xs text-gray-500 mt-1">Akses permanen lontar</p>
            </div>
            <span className="text-blue-600 bg-blue-50 p-2 rounded-lg">🔓</span>
          </div>
          <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-1">Lencana Adat</p>
              <h4 className="text-3xl font-serif font-bold text-gray-900">4 / 12</h4>
              <p className="text-xs text-gray-500 mt-1">Tingkat Penjaga Budaya</p>
            </div>
            <span className="text-orange-600 bg-orange-50 p-2 rounded-lg">🎖️</span>
          </div>
        </div>

        {/* LENCANA */}
        <div className="bg-[#F4F1EA] rounded-xl p-5 mb-10 flex flex-col md:flex-row items-center justify-between border border-[#E8E3D5]">
          <div className="flex items-start gap-4 mb-4 md:mb-0">
            <div className="bg-white p-2 rounded-lg shadow-sm text-2xl border border-gray-200">🎖️</div>
            <div>
              <h4 className="font-bold text-gray-900">Koleksi Lencana Adat Nusantara Anda</h4>
              <p className="text-xs text-gray-600">Selesaikan cerita rakyat dari tiap kepulauan untuk menyematkan gelar kehormatan.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="bg-white border border-[#A34321] text-[#A34321] px-3 py-1.5 rounded-full flex items-center gap-1">🔴 Sahabat Toba</span>
            <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1">🟢 Penjaga Bromo</span>
            <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1">🔵 Candi Prambanan</span>
            <span className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1">🟤 Mahkota Sriwijaya</span>
          </div>
        </div>

        {/* TABS & BUKU FAVORIT */}
        <div className="flex justify-between items-center border-b border-gray-200 mb-6">
          <div className="flex gap-6 overflow-x-auto text-sm font-bold">
            <button className="text-[#A34321] border-b-2 border-[#A34321] pb-3 bg-[#A34321] text-white rounded-t-lg px-4">Bookmark Saya (6)</button>
            <button className="text-gray-500 pb-3 hover:text-gray-800">Sedang Dibaca (2)</button>
            <button className="text-gray-500 pb-3 hover:text-gray-800">Riwayat Bacaan</button>
            <button className="text-gray-500 pb-3 hover:text-gray-800">Misi Harian & Hadiah</button>
          </div>
          <select className="hidden md:block bg-transparent text-sm font-bold text-gray-600 outline-none pb-3">
            <option>Semua Daerah</option>
            <option>Jawa</option>
            <option>Sumatera</option>
          </select>
        </div>

        {/* GRID BUKU BOOKMARK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Card 1 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-300 relative">
              <span className="absolute top-3 left-3 text-[10px] font-bold bg-white text-gray-800 px-2 py-1 rounded">⚫ Jawa Tengah</span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/80 px-2 py-1 rounded">Gratis</span>
            </div>
            <div className="p-5">
              <div className="flex text-xs font-bold text-gray-500 mb-2 gap-2">
                <span className="text-orange-500">⭐ 4.9 (1.2k)</span>
                <span>• 5 Bab Lengkap</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-2 leading-tight">Kisah Seribu Candi Roro Jonggrang</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">Ambisi Bandung Bondowoso menaklukkan seribu arca dan kecerdikan sang putri yang berujung keabadian...</p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">Tersimpan 3 hari lalu</span>
                <button className="text-sm font-bold text-[#A34321]">Mulai Baca</button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-300 relative">
              <span className="absolute top-3 left-3 text-[10px] font-bold bg-white text-gray-800 px-2 py-1 rounded">🟡 Bali Dewata</span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#A34321] text-white px-2 py-1 rounded">🪙 50 Koin</span>
            </div>
            <div className="p-5">
              <div className="flex text-xs font-bold text-gray-500 mb-2 gap-2">
                <span className="text-orange-500">⭐ 5.0 (890)</span>
                <span>• 5 Bab Premium</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-2 leading-tight">Barong & Rangda: Harmoni Kebaikan Semesta</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">Kosmologi Calonarang dan pertempuran magis abadi menjaga keseimbangan dharma dan adharma di pulau...</p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Bab 1 Terbuka</span>
                <button className="text-sm font-bold text-[#A34321]">Buka Bab 2</button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-300 relative">
              <span className="absolute top-3 left-3 text-[10px] font-bold bg-white text-gray-800 px-2 py-1 rounded">🟢 Kalimantan</span>
              <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/80 px-2 py-1 rounded">Gratis</span>
            </div>
            <div className="p-5">
              <div className="flex text-xs font-bold text-gray-500 mb-2 gap-2">
                <span className="text-orange-500">⭐ 4.8 (640)</span>
                <span>• 4 Bab Lengkap</span>
              </div>
              <h3 className="font-serif font-bold text-lg mb-2 leading-tight">Hikayat Burung Enggang & Pohon Hayat</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">Legenda sakral suku Dayak Kenyah tentang kesetiaan pelindung hutan rimba Mahakam dan pohon...</p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">Tersimpan minggu lalu</span>
                <button className="text-sm font-bold text-[#A34321]">Mulai Baca</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E8E3D5] rounded-xl p-3 text-center mb-16">
          <p className="text-sm text-[#A34321] font-medium flex items-center justify-center gap-2">
            🔖 Masih ada 3 cerita lain dalam arsip simpanan Anda. <button className="font-bold underline ml-2">Tampilkan Semua Bookmark Arsip →</button>
          </p>
        </div>

      </main>
    </div>
  );
}