import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import { getTopRegions } from "../../services/storiesService";

const topRegions = getTopRegions(5);

export default function Footer() {
  return (
    <footer className="border-t border-line bg-sand">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo size="sm" className="mb-4" />
          <p className="max-w-xs text-sm leading-relaxed text-gray-600">
            Pustaka digital cerita rakyat Nusantara: baca, kumpulkan poin, dan dukung kreator cerita daerah.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-kisara">Jelajahi Wilayah</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            {topRegions.map((r) => (
              <li key={r.name}>
                <Link to={`/catalog?region=${encodeURIComponent(r.name)}`} className="hover:text-kisara">
                  {r.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-kisara">Fitur</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/catalog" className="hover:text-kisara">Katalog Cerita</Link></li>
            <li><Link to="/dashboard" className="hover:text-kisara">Pustaka Saya</Link></li>
            <li><Link to="/topup" className="hover:text-kisara">Top-Up Koin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-kisara">Tentang</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li>Pedoman Etika Cerita</li>
            <li>Kebijakan Privasi</li>
            <li>Kontak</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-gray-500 lg:px-8">
          © {new Date().getFullYear()} KiSara.id. Cerita rakyat Nusantara untuk dibaca dan dilestarikan.
        </p>
      </div>
    </footer>
  );
}