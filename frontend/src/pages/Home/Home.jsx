
import { Link } from "react-router-dom";

import StoryCard from "../../components/StoryCard/StoryCard";

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
    </main>
  );
}

export default Home;
