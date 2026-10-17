
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchStoryBySlug } from "../../services/api";
import "./StoryDetail.css";

function StoryDetail() {
  const { slug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoryBySlug(slug).then((data) => {
      setStory(data);
      setLoading(false);
    });
  }, [slug]);

  return (
    <main className="story-detail-page">
      <div className="story-detail-container">
        <nav className="story-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Beranda</Link>
          <span>/</span>
          <Link to="/catalog">Katalog</Link>
          <span>/</span>
          <span>{story?.title || "Detail Cerita"}</span>
        </nav>

        {loading ? (
          <section className="story-not-found">
            <span aria-hidden="true">📖</span>
            <h1>Memuat cerita...</h1>
          </section>
        ) : !story ? (
          <section className="story-not-found">
            <span aria-hidden="true">📖</span>
            <h1>Cerita Tidak Ditemukan</h1>
            <p>Informasi cerita tidak tersedia.</p>
            <Link to="/catalog" className="story-back-link">
              ← Kembali ke Katalog
            </Link>
          </section>
        ) : (
          <section className="story-detail-content">
            <span aria-hidden="true">📖</span>
            <p className="story-detail-region">{story.origin || "Nusantara"}</p>
            <h1>{story.title}</h1>
            <p>{story.synopsis || "Kisah legenda menarik dari Nusantara."}</p>

            <h2>Daftar Chapter</h2>
            {story.chapters?.length ? (
              <ol>
                {story.chapters.map((chapter) => (
                  <li key={chapter.chapter_number}>
                    <strong>{chapter.title}</strong>
                    {chapter.is_locked && <span> 🔒 Premium</span>}
                  </li>
                ))}
              </ol>
            ) : (
              <p>Chapter belum tersedia.</p>
            )}

            <Link to="/catalog" className="story-back-link">
              ← Kembali ke Katalog
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}

export default StoryDetail;
