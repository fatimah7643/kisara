import { Link } from "react-router-dom";
import "./StoryCard.css";

function StoryCard({ title, region, category, description }) {
  return (
    <article className="story-card">
      <div className="story-card-cover">
        <span className="story-card-category">{category}</span>

        <div className="story-card-cover-title">
          {title}
        </div>
      </div>

      <div className="story-card-content">
        <p className="story-card-region">{region}</p>

        <h3>{title}</h3>

        <p className="story-card-description">
          {description}
        </p>

        <Link to="/catalog" className="story-card-link">
          Baca Cerita →
        </Link>
      </div>
    </article>
  );
}

export default StoryCard;