import { Link } from "react-router-dom";
import CoverArt from "../CoverArt/CoverArt";
import BookmarkIcon from "../BookmarkIcon";

// Tombol bookmark hanya tampil jika onToggleBookmark diberikan.
export default function StoryCard({ story, bookmarked = false, onToggleBookmark }) {
  const allFree = story.premiumCount === 0;

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-sm transition-shadow hover:shadow-md">
      <CoverArt story={story} className="h-36">
        <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {story.origin}
        </span>
        {onToggleBookmark && (
          <button
            type="button"
            onClick={() => onToggleBookmark(story.slug)}
            aria-pressed={bookmarked}
            aria-label={bookmarked ? `Hapus ${story.title} dari Pustaka` : `Simpan ${story.title} ke Pustaka`}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg bg-black/40 text-white hover:bg-black/60"
          >
            <BookmarkIcon filled={bookmarked} />
          </button>
        )}
        <span className="absolute bottom-3 left-4 text-[10px] font-bold uppercase tracking-wider text-white/80">
          {story.category}
        </span>
      </CoverArt>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-2 line-clamp-2 font-serif text-lg font-bold leading-snug text-gray-900">
          <Link to={`/story/${story.slug}`} className="hover:text-kisara">
            {story.title}
          </Link>
        </h3>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-gray-500">{story.synopsis}</p>

        <p className="mb-4 mt-auto text-xs text-gray-500">
          {story.chapterCount} Bab ({story.freeCount} Gratis{allFree ? "" : `, ${story.premiumCount} Premium`}) ·{" "}
          {story.readMinutes} mnt baca
        </p>

        <div className="flex items-center justify-between gap-3">
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {allFree ? "Seluruh Bab Gratis" : "Bab Awal Gratis"}
          </span>
          <Link
            to={`/story/${story.slug}`}
            className="rounded-lg bg-kisara px-4 py-2 text-xs font-bold text-white hover:bg-kisara-dark"
          >
            Buka Hikayat →
          </Link>
        </div>
      </div>
    </article>
  );
}