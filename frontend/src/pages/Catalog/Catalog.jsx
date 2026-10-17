
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StoryCard from "../../components/StoryCard/StoryCard";
import { fetchStories } from "../../services/api";
import "./Catalog.css";

function Catalog() {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchStories(search)
      .then((data) => {
        setStories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [search]);

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul cerita rakyat..."
            aria-label="Pencarian cerita"
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

        {loading ? (
          <div className="catalog-empty">
            <h3>Memuat data cerita...</h3>
          </div>
        ) : stories.length === 0 ? (
          <div className="catalog-empty">
            <span aria-hidden="true">📚</span>
            <h3>Belum Ada Cerita</h3>
            <p>
              Tidak ditemukan cerita yang sesuai dengan pencarianmu.
            </p>

            <Link to="/" className="catalog-empty-link">
              Kembali ke Beranda
            </Link>
          </div>
        ) : (
          <div className="catalog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", marginTop: "24px" }}>
            {stories.map((story) => (
              <StoryCard
                key={story.slug}
                slug={story.slug}
                title={story.title}
                origin={story.origin}
                synopsis={story.synopsis}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Catalog;
