
import { Link } from "react-router-dom";
import "./Catalog.css";

function Catalog() {
  return (
    <main className="catalog-page">
      <section className="catalog-hero">
        <span className="catalog-eyebrow">
          PERPUSTAKAAN CERITA NUSANTARA
        </span>

        <h1>Temukan Cerita Favoritmu</h1>

        <p>
          Jelajahi kisah rakyat Indonesia, kenali warisan budaya,
          dan temukan makna di balik setiap cerita.
        </p>

        <label className="catalog-search">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            placeholder="Pencarian tersedia setelah data cerita terhubung"
            aria-label="Pencarian cerita"
            disabled
          />
        </label>
      </section>

      <section className="catalog-content">
        <div className="catalog-heading">
          <div>
            <span className="catalog-section-label">
              JELAJAHI KOLEKSI
            </span>
            <h2>Katalog Cerita</h2>
          </div>
        </div>

        <div className="catalog-empty">
          <span aria-hidden="true">📚</span>
          <h3>Belum Ada Cerita</h3>
          <p>
            Koleksi cerita akan ditampilkan di sini setelah data
            cerita yang sebenarnya tersedia.
          </p>

          <Link to="/" className="catalog-empty-link">
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Catalog;
