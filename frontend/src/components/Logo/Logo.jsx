import { Link } from "react-router-dom";

export default function Logo({ subtitle, className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <img
        src="/kisara-logo.png"
        alt=""
        className="w-10 h-10 object-contain"
        onError={(e) => {
          e.currentTarget.style.display = "none"; // sembunyikan jika file logo belum ada
        }}
      />
      <div>
        <p className="text-2xl font-serif font-bold text-kisara leading-none">KiSara.id</p>
        {subtitle && (
          <p className="mt-1 text-[10px] font-bold tracking-widest text-gray-500 uppercase">{subtitle}</p>
        )}
      </div>
    </Link>
  );
}