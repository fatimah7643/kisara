import { Link } from "react-router-dom";
import "./StoryCard.css";

function StoryCard({ slug, title, origin, region, synopsis, chapterCount }) {
  return (
    <article className="story-card">
      <div className="story-card-cover">
        <span className="story-card-category">{region || "Nusantara"}</span>

        <div className="story-card-cover-title">{title}</div>
      </div>

      <div className="story-card-content">
        <p className="story-card-region">
          {origin || "Indonesia"}
          {chapterCount ? ` · ${chapterCount} chapter` : ""}
        </p>

        <h3>{title}</h3>

        <p className="story-card-description">
          {synopsis || "Kisah legenda menarik dari Nusantara."}
        </p>

        <Link to={`/story/${slug}`} className="story-card-link">
          Baca Cerita →
        </Link>
      </div>
    </article>
  );
}

export default StoryCard;
