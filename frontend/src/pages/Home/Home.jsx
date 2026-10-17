import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FCFAF6] font-sans text-gray-800">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
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

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6 text-sm font-bold text-gray-600">
            <Link to="/catalog" className="hover:text-[#A34321]">Kategori Cerita ▾</Link>
            <Link to="/dashboard" className="hover:text-[#A34321]">Ruang Baca</Link>
          </div>
          <div className="flex items-center gap-3 border-l border-gray-300 pl-6">
            <Link to="/login" className="text-sm font-bold text-gray-700 hover:text-[#A34321]">Masuk</Link>
            <Link to="/register" className="bg-[#A34321] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#8A3619] shadow-sm">
              Mulai Menjelajah
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24 flex flex-col lg:flex-row items-center gap-16">
        <div className="w-full lg:w-1/2">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-[#F4F1EA] text-[#A34321] text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-[#E8E3D5]">Pustaka Cerita Digital Nusantara</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-serif font-bold text-gray-900 leading-[1.1] mb-6">
            Menghidupkan Kembali <span className="text-[#A34321] italic">Hikayat & Legenda</span> Nusantara di Era Digital.
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-xl">
            Sastra lisan dan tradisi yang hampir pudar kini ditarik keluar dari ambang kepunahan ke dalam pengalaman membaca interaktif. Terbuka bagi generasi masa depan, apresiasi poin terverifikasi untuk para kreator lokal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register" className="bg-[#A34321] text-white px-8 py-4 rounded-lg font-bold text-center hover:bg-[#8A3619] shadow-lg shadow-[#A34321]/20">
              Mulai Baca (Daftar Gratis)
            </Link>
            <Link to="/catalog" className="bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-lg font-bold text-center hover:border-gray-300 flex justify-center items-center gap-2">
              🧭 Jelajahi Peta Cerita
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-1/2 relative">
          {/* Featured Hero Card */}
          <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 relative z-10">
            <div className="w-full h-64 bg-gray-300 rounded-xl mb-6 relative overflow-hidden">
               {/* Ganti dengan image asli nanti */}
               <div className="absolute inset-0 bg-orange-900/20"></div>
               <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                 <span>⭐ 4.9 (1.2k)</span>
               </div>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#A34321] bg-[#F4F1EA] px-2 py-1 rounded">SEDANG POPULER</span>
              <span className="text-xs text-gray-500 font-medium">Jawa Tengah</span>
            </div>
            <h3 className="text-2xl font-serif font-bold mb-2">Kisah Roro Jonggrang & Misteri Seribu Candi</h3>
            <p className="text-sm text-gray-500 mb-6">Ambisi menaklukkan seribu arca dan kecerdikan sang putri yang berujung keabadian...</p>
            <button className="w-full bg-[#A34321] text-white py-3 rounded-lg font-bold text-sm">Baca Bab 1 Sekarang →</button>
          </div>
          {/* Background decoration */}
          <div className="absolute -top-6 -right-6 w-full h-full bg-[#F4F1EA] rounded-2xl -z-10 border border-[#E8E3D5]"></div>
        </div>
      </header>

      {/* STATS SECTION */}
      <section className="border-y border-[#E8E3D5] bg-[#F9F7F1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-[#E8E3D5]">
          <div className="pl-0 md:pl-8">
            <h4 className="text-4xl font-serif font-bold text-[#A34321] mb-1">1,240<span className="text-2xl">+</span></h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Hikayat & Legenda</p>
          </div>
          <div className="pl-8">
            <h4 className="text-4xl font-serif font-bold text-gray-900 mb-1">38 <span className="text-base font-sans font-normal text-gray-500">Provinsi</span></h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Peta Persebaran</p>
          </div>
          <div className="pl-8">
            <h4 className="text-4xl font-serif font-bold text-[#A34321] mb-1">52.8k</h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Pembaca Aktif</p>
          </div>
          <div className="pl-8">
            <h4 className="text-4xl font-serif font-bold text-gray-900 mb-1">860<span className="text-2xl">+</span></h4>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Kreator & Penulis Lokal</p>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-16 mb-16">
          <div className="w-full lg:w-1/3">
            <p className="text-[#A34321] text-[10px] font-bold uppercase tracking-widest mb-3">Nilai Tambah KiSara</p>
            <h2 className="text-4xl font-serif font-bold text-gray-900 leading-tight mb-4">Teknologi Modern untuk Melindungi Warisan Tutur Nusantara</h2>
            <p className="text-gray-600 leading-relaxed text-sm">Kami memadukan pengarsipan tradisi lisan dengan fitur literasi pada kelas dunia, tepat di genggaman Anda.</p>
          </div>
          
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-[#F4F1EA] text-[#A34321] rounded-lg flex items-center justify-center text-xl mb-6">📚</div>
              <h3 className="font-serif text-xl font-bold mb-3">Koleksi Cerita Berseri (Free & Premium Chapter)</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Nikmati cerita gratis dari berbagai daerah atau dukung langsung penulis lokal dengan membuka bab premium (berbayar dengan koin).</p>
            </div>
            {/* Feature 2 */}
            <div className="bg-[#F9F7F1] p-8 rounded-2xl border border-[#E8E3D5] shadow-sm">
              <div className="w-10 h-10 bg-white text-[#A34321] rounded-lg flex items-center justify-center text-xl mb-6 border border-gray-200">🎖️</div>
              <h3 className="font-serif text-xl font-bold mb-3">Gamifikasi & Poin Kebudayaan</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Tingkatkan level pembaca Anda, kumpulkan lencana langka dari tiap provinsi, dan dapatkan hadiah koin untuk membaca lebih banyak cerita.</p>
            </div>
            {/* Feature 3 */}
            <div className="bg-[#F9F7F1] p-8 rounded-2xl border border-[#E8E3D5] shadow-sm">
              <div className="w-10 h-10 bg-white text-[#A34321] rounded-lg flex items-center justify-center text-xl mb-6 border border-gray-200">✍️</div>
              <h3 className="font-serif text-xl font-bold mb-3">Ruang Kreator Terkurasi & Sah</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Platform bagi penulis lokal untuk menerbitkan ulang sastra lisan. Mendapatkan bagi hasil dari tiap pembukaan bab berbayar.</p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-10 h-10 bg-[#F4F1EA] text-[#A34321] rounded-lg flex items-center justify-center text-xl mb-6">🪙</div>
              <h3 className="font-serif text-xl font-bold mb-3">Top Up Koin Transparan & Terverifikasi</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Isi ulang koin dengan mudah menggunakan e-wallet nasional (GoPay, OVO, QRIS) untuk menelusuri arsip premium tanpa batas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MAP / EXPLORE SECTION */}
      <section className="bg-[#F4F1EA] py-24 border-y border-[#E8E3D5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <p className="text-[#A34321] text-[10px] font-bold uppercase tracking-widest mb-3">Katalog Daerah Populer</p>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Peta Hikayat Nusantara</h2>
              <p className="text-gray-600 text-sm">Pilih pulau dan telusuri cerita rakyat yang mengakar pada lereng gunung, pesisir, dan hutan adat kepulauan Indonesia.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              <button className="bg-[#A34321] text-white px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap">Semua Wilayah</button>
              <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 whitespace-nowrap">Jawa</button>
              <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 whitespace-nowrap">Sumatera</button>
              <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 whitespace-nowrap">Kalimantan</button>
              <button className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-50 whitespace-nowrap">Bali & Nusa</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Story Card 1 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/20 group-hover:scale-105 transition-transform duration-500"></div>
                <span className="absolute top-3 left-3 text-[10px] font-bold bg-white text-gray-800 px-2 py-1 rounded">Sumatera Utara</span>
                <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded">⭐ 4.9</span>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold text-[#A34321] uppercase mb-1">Mitos Danau & Kutukan</p>
                <h3 className="font-serif font-bold text-lg mb-2 leading-tight">Legenda Danau Toba & Putri Ikan Mas</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">Oleh: Toba Sastra</span>
                  <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded">Gratis</span>
                </div>
              </div>
            </div>

            {/* Story Card 2 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-900/20 group-hover:scale-105 transition-transform duration-500"></div>
                <span className="absolute top-3 left-3 text-[10px] font-bold bg-white text-gray-800 px-2 py-1 rounded">Jawa Barat</span>
                <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded">⭐ 4.8</span>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold text-[#A34321] uppercase mb-1">Legenda Penciptaan</p>
                <h3 className="font-serif font-bold text-lg mb-2 leading-tight">Sangkuriang & Tangkuban Perahu</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">Oleh: Sunda Wiwitan</span>
                  <span className="text-[10px] font-bold bg-[#F4F1EA] text-[#A34321] border border-[#A34321] px-2 py-1 rounded">🪙 20 Koin</span>
                </div>
              </div>
            </div>

            {/* Story Card 3 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-yellow-900/20 group-hover:scale-105 transition-transform duration-500"></div>
                <span className="absolute top-3 left-3 text-[10px] font-bold bg-white text-gray-800 px-2 py-1 rounded">Bali</span>
                <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded">⭐ 5.0</span>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold text-[#A34321] uppercase mb-1">Kisah Cinta & Tragedi</p>
                <h3 className="font-serif font-bold text-lg mb-2 leading-tight">Jayaprana & Layonsari: Tragedi Cinta</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">Oleh: Bali Lontar</span>
                  <span className="text-[10px] font-bold bg-[#F4F1EA] text-[#A34321] border border-[#A34321] px-2 py-1 rounded">🪙 35 Koin</span>
                </div>
              </div>
            </div>

            {/* Story Card 4 */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
              <div className="h-48 bg-gray-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-900/20 group-hover:scale-105 transition-transform duration-500"></div>
                <span className="absolute top-3 left-3 text-[10px] font-bold bg-white text-gray-800 px-2 py-1 rounded">Kalimantan Timur</span>
                <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-black/60 text-white px-2 py-1 rounded">⭐ 4.7</span>
              </div>
              <div className="p-5">
                <p className="text-[10px] font-bold text-[#A34321] uppercase mb-1">Mitos Hewan Mitologi</p>
                <h3 className="font-serif font-bold text-lg mb-2 leading-tight">Asal Usul Pesut Mahakam</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">Oleh: Dayak Story</span>
                  <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded">Gratis</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/catalog" className="inline-block bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-full font-bold text-sm hover:bg-gray-50 shadow-sm">
              Eksplorasi Seluruh Koleksi Daerah →
            </Link>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="bg-[#A34321] rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-2xl"></div>
          
          <div className="w-full lg:w-3/5 relative z-10 text-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold bg-[#8A3619] px-3 py-1 rounded text-[#F3D2A4]">🎉 KAMPANYE LITERASI NUSANTARA</span>
            </div>
            <h2 className="text-4xl font-serif font-bold mb-4">Baca Hari Ini, Dapatkan +50 Koin & Lencana Budaya!</h2>
            <p className="text-[#F3D2A4] mb-8 leading-relaxed">
              Daftar hari ini, verifikasi email Anda, dan dapatkan modal 50 Koin KiSara untuk mengumpulkan seri cerita eksklusif dan lencana pelestari budaya daerah.
            </p>
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-[#8A3619] flex items-center justify-center text-xs border border-[#F3D2A4]">1</div>
              <div className="w-8 h-8 rounded-full bg-[#8A3619] flex items-center justify-center text-xs border border-[#F3D2A4]">2</div>
              <div className="w-8 h-8 rounded-full bg-[#8A3619] flex items-center justify-center text-xs border border-[#F3D2A4]">3</div>
              <span className="text-xs text-[#F3D2A4] ml-2">+45rb Pembaca telah bergabung</span>
            </div>
          </div>

          <div className="w-full lg:w-2/5 bg-white p-6 rounded-2xl relative z-10">
            <h3 className="font-bold text-gray-900 mb-1">Daftar Akun Cepat</h3>
            <p className="text-xs text-gray-500 mb-4">Mulai baca dalam waktu kurang dari semenit.</p>
            <div className="flex mb-4">
              <input type="email" placeholder="Masukkan alamat email Anda..." className="w-full bg-[#F4F1EA] px-4 py-3 rounded-l-lg outline-none text-sm" />
              <button className="bg-[#A34321] text-white px-6 py-3 rounded-r-lg font-bold text-sm">Daftar</button>
            </div>
            <p className="text-[10px] text-gray-400 text-center">Dengan mendaftar, Anda menyetujui Syarat & Ketentuan KiSara.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white border-y border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-[#A34321] text-[10px] font-bold uppercase tracking-widest mb-3">Suara Komunitas</p>
            <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">Dari Pelosok Desa Hingga Layar Ponsel Generasi Muda</h2>
            <p className="text-gray-600 text-sm">Apa kata para pembaca, guru, dan pengarsip lokal yang telah bergabung di ekosistem KiSara.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#F9F7F1] p-8 rounded-2xl border border-[#E8E3D5]">
              <div className="text-[#A34321] text-lg mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-700 italic mb-6 leading-relaxed">"Sangat membantu tugas seni budaya dan sejarah lokal! Desain aplikasinya rapi dan seru karena bisa ngumpulin lencana tiap habis baca hikayat dari provinsi berbeda."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">MW</div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Mahadewi W.</p>
                  <p className="text-[10px] text-gray-500">Mahasiswi Sastra Nusantara</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#F9F7F1] p-8 rounded-2xl border border-[#E8E3D5]">
              <div className="text-[#A34321] text-lg mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-700 italic mb-6 leading-relaxed">"Sebagai penulis daerah, sistem koin premium di sini sangat adil. Tulisan tentang mitologi desa saya kini dibaca ribuan orang dan saya mendapatkan royalti yang jelas."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">RP</div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Rustam Purnomo</p>
                  <p className="text-[10px] text-gray-500">Penulis & Pengarsip Lokal</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F9F7F1] p-8 rounded-2xl border border-[#E8E3D5]">
              <div className="text-[#A34321] text-lg mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-sm text-gray-700 italic mb-6 leading-relaxed">"Anak saya jadi lebih tertarik membaca cerita Sangkuriang dibanding main game terus. Fitur gamifikasi pembacaannya sangat jenius untuk anak-anak zaman sekarang."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">IB</div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Ibu Budiwati</p>
                  <p className="text-[10px] text-gray-500">Guru SD & Orang Tua</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#F4F1EA] py-24 text-center px-4">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl mx-auto mb-6 shadow-sm border border-gray-200">📖</div>
        <h2 className="text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-6">Jadilah Bagian dari<br />Kebangkitan Cerita Nusantara<br />Hari Ini</h2>
        <p className="text-gray-600 mb-10 max-w-lg mx-auto">Daftar gratis untuk mulai membaca, atau jadilah kreator untuk mempublikasikan arsip lisan dari daerah Anda.</p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="bg-[#A34321] text-white px-8 py-4 rounded-lg font-bold shadow-lg hover:bg-[#8A3619]">Buat Akun KiSara Gratis →</Link>
          <Link to="/login" className="bg-white border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-bold hover:bg-gray-50">Masuk ke Akun</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white pt-16 pb-8 px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/kisara-logo.png" alt="KiSara Logo" className="w-8 h-8 bg-gray-200 rounded-full" />
              <span className="text-xl font-serif font-bold text-[#A34321]">KiSara.id</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6 pr-10">
              Gerbang digitalisasi literasi nusantara. Menggabungkan tradisi lisan, hikayat tulisan kuno, dan folklor daerah dalam lanskap membaca era modern.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Jelajahi Pustaka</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/catalog" className="hover:text-[#A34321]">Katalog Seluruh Cerita</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Cerita Terpopuler</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Cerita Pilihan Kurator</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Koleksi Cerita Gratis</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Area Kreator</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-[#A34321]">Menulis di KiSara</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Panduan & Standar Etik</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Sistem Bagi Hasil (Koin)</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Komunitas Penulis</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">Tentang KiSara</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-[#A34321]">Visi & Misi Pelestarian</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Hubungi Kami</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Syarat & Ketentuan</Link></li>
              <li><Link to="/" className="hover:text-[#A34321]">Kebijakan Privasi</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">© 2026 KiSara.id. Hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Dibuat dengan ❤️ untuk budaya Indonesia.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}