import { Link } from "react-router-dom";
import StoryCard from "../../components/StoryCard/StoryCard";
import heroImage from "../../assets/kisara-hero.png";
import "./Home.css";

function Home() {
  return (
    <main className="home">
      {/* =========================
          HERO
      ========================= */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">CERITA NUSANTARA</p>

          <h1>
            Kisah Nusantara,
            <br />
            Dalam Satu Platform
          </h1>

          <p className="hero-description">
            Jelajahi cerita dari berbagai daerah Indonesia dan temukan kisah
            baru setiap hari.
          </p>

          <Link to="/catalog" className="hero-button">
            Mulai Membaca
          </Link>
        </div>

        {/* Visual cover yang sudah ada */}
        <div className="hero-visual">
            <img
              src={heroImage}
              alt="Ilustrasi lanskap Nusantara"
              className="hero-image"
            />
          <div className="hero-cover">
            <span>KiSara.id</span>

            <strong>
              Kisah
              <br />
              Nusantara
            </strong>
          </div>
        </div>
      </section>

      {/* =========================
          FEATURED STORIES
      ========================= */}
      <section className="featured-stories">
        <div className="section-heading">
          <div>
            <p className="section-label">CERITA PILIHAN</p>
            <h2>Jelajahi Kisah Nusantara</h2>
          </div>

          <Link to="/catalog" className="section-link">
            Lihat Semua →
          </Link>
        </div>

        <div className="story-grid">
          <StoryCard
            title="Legenda Danau Toba"
            region="Sumatera Utara"
            category="Legenda"
            description="Kisah rakyat tentang asal-usul Danau Toba dan pesan tentang menepati janji."
          />

          <StoryCard
            title="Malin Kundang"
            region="Sumatera Barat"
            category="Cerita Rakyat"
            description="Kisah seorang anak yang mendapatkan pelajaran berharga tentang berbakti kepada orang tua."
          />

          <StoryCard
            title="Timun Mas"
            region="Jawa Tengah"
            category="Dongeng"
            description="Petualangan Timun Mas dalam menghadapi raksasa yang mengejarnya."
          />

          <StoryCard
            title="Batu Menangis"
            region="Kalimantan Barat"
            category="Legenda"
            description="Cerita tentang seorang anak yang mendapatkan akibat dari sikapnya terhadap ibunya."
          />
        </div>
      </section>

      {/* =========================
          EXPLORE BY REGION
      ========================= */}
      <section className="explore-region" id="wilayah">
        <div className="region-heading">
          <div>
            <p className="section-label">JELAJAHI NUSANTARA</p>

            <h2>Jelajahi Cerita dari Setiap Daerah</h2>

            <p className="region-description">
              Temukan kekayaan cerita, tradisi, dan budaya dari berbagai
              wilayah Indonesia.
            </p>
          </div>
        </div>

        {/* 
          Area ini disiapkan untuk integrasi data wilayah.
          Data wilayah dan kartu akan ditambahkan setelah API tersedia.
        */}
        <div className="region-content">
          <p className="region-placeholder">
            Konten wilayah akan tersedia setelah data terhubung.
          </p>
        </div>
      </section>
      
      
      {/* ABOUT KISARA */}
      <section className="about-kisara" id="tentang">
        <div className="about-content">
          <p className="section-label">TENTANG KISARA</p>

          <h2>
            Setiap Cerita
            <br />
            Punya Makna.
          </h2>

          <p className="about-description">
            KiSara adalah ruang digital untuk mengenal, menjelajahi,
            dan melestarikan kekayaan cerita Nusantara. Setiap cerita
            menyimpan nilai budaya, kebijaksanaan, dan pesan yang
            layak diwariskan kepada generasi berikutnya.
          </p>

          <Link to="/catalog" className="about-button">
            Jelajahi Cerita
          </Link>
        </div>

        <div className="about-values">
          <article className="about-value-card">
            <span className="about-value-number">01</span>
            <h3>Warisan Budaya</h3>
            <p>
              Mengenal cerita rakyat sebagai bagian dari identitas
              dan kekayaan budaya Indonesia.
            </p>
          </article>

          <article className="about-value-card">
            <span className="about-value-number">02</span>
            <h3>Jelajah Nusantara</h3>
            <p>
              Menemukan beragam kisah dari berbagai daerah
              Indonesia dalam satu platform.
            </p>
          </article>

          <article className="about-value-card">
            <span className="about-value-number">03</span>
            <h3>Cerita untuk Generasi</h3>
            <p>
              Menjaga cerita Nusantara agar tetap dikenal
              dan dinikmati oleh generasi mendatang.
            </p>
          </article>
        </div>
      </section>
      
      
      {/* FOOTER KISARA */}
      <footer className="kisara-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              KiSara<span>.id</span>
            </Link>

            <p className="footer-description">
              Menjelajahi cerita, merawat budaya, dan mewariskan
              kekayaan kisah Nusantara kepada generasi mendatang.
            </p>
          </div>

          <div className="footer-navigation">
            <h3>Navigasi</h3>
            <Link to="/">Beranda</Link>
            <Link to="/catalog">Katalog Cerita</Link>
            <a href="#wilayah">Jelajahi Wilayah</a>
            <a href="#tentang">Tentang KiSara</a>
          </div>

          <div className="footer-contact">
            <h3>Jelajahi KiSara</h3>
            <p>
              Temukan cerita rakyat, legenda, dan kekayaan budaya
              dari berbagai penjuru Indonesia.
            </p>
            <Link to="/catalog" className="footer-cta">
              Mulai Membaca <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} KiSara.id</p>
          <p>Merawat cerita, menjaga warisan Nusantara.</p>
        </div>
      </footer>
      
    </main>
  );
}

export default Home;
