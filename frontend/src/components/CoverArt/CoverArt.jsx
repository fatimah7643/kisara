// Sampul cerita buatan (gradien + motif) karena data belum punya gambar.
// Warna ditentukan daerah asal, motif ditentukan cerita — selalu sama untuk cerita yang sama.
const PALETTES = [
  { from: "#6B1E12", to: "#2B0C07", accent: "#E8B86A" },
  { from: "#0F4A38", to: "#062219", accent: "#7AD3A0" },
  { from: "#1F2F6B", to: "#0A1233", accent: "#9DBBFF" },
  { from: "#0E5266", to: "#062B37", accent: "#7FD6E8" },
  { from: "#5A3C14", to: "#291A08", accent: "#E8C078" },
  { from: "#5B2150", to: "#260D22", accent: "#E6A9DB" },
];

const PATTERNS = [
  (c) => (
    <g fill="none" stroke={c} strokeWidth="1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${30 + i * 60} 100 l30 -45 l30 45 l-30 45 z`} />
      ))}
      <path d="M0 170 H300" />
    </g>
  ),
  (c) => (
    <g fill="none" stroke={c} strokeWidth="1.5">
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M0 ${70 + i * 28} q37.5 -24 75 0 t75 0 t75 0 t75 0`} />
      ))}
    </g>
  ),
  (c) => (
    <g fill="none" stroke={c} strokeWidth="1.5">
      <path d="M0 150 l37 -80 l37 80 l37 -80 l37 80 l37 -80 l37 80 l37 -80 l37 80" />
      <path d="M0 170 H300" />
    </g>
  ),
  (c) => (
    <g fill="none" stroke={c} strokeWidth="1.5">
      {[20, 40, 60, 80].map((r) => (
        <circle key={r} cx="210" cy="90" r={r} />
      ))}
    </g>
  ),
  (c) => (
    <g stroke={c} strokeWidth="1.5">
      {Array.from({ length: 14 }, (_, i) => (
        <path key={i} d={`M${i * 30 - 60} 200 L${i * 30 + 60} 0`} />
      ))}
    </g>
  ),
];

function hash(text) {
  let h = 0;
  for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

export default function CoverArt({ story, className = "", children }) {
  const palette = PALETTES[hash(story.origin) % PALETTES.length];
  const pattern = PATTERNS[hash(story.slug) % PATTERNS.length](palette.accent);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}
    >
      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 300 200"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {pattern}
      </svg>
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
      {children}
    </div>
  );
}