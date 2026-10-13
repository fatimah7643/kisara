
import { Link, useParams } from "react-router-dom";
import "./StoryDetail.css";

function StoryDetail() {
  const { id } = useParams();

  return (
    <main className="story-detail-page">
      <div className="story-detail-container">
        <nav className="story-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Beranda</Link>
          <span>/</span>
          <Link to="/catalog">Katalog</Link>
          <span>/</span>
          <span>Detail Cerita</span>
        </nav>

        <section className="story-not-found">
          <span aria-hidden="true">📖</span>
          <h1>Detail Cerita Belum Tersedia</h1>

          <p>
            {id
              ? "Informasi cerita belum tersedia untuk ditampilkan."
              : "Pilih cerita dari katalog setelah koleksi tersedia."}
          </p>

          <Link to="/catalog" className="story-back-link">
            ← Kembali ke Katalog
          </Link>
        </section>
      </div>
    </main>
  );
}

export default StoryDetail;
