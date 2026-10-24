import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRegions } from "../../services/storiesService";
import Logo from "../Logo/Logo";

const regions = getRegions();

const navLinkClass = ({ isActive }) =>
  `rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
    isActive ? "bg-kisara text-white" : "text-gray-700 hover:text-kisara"
  }`;

const ROLE_LABEL = { reader: "Pembaca", creator: "Kreator", admin: "Admin" };

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const [query, setQuery] = useState("");

  // Menu dibuka untuk satu halaman saja, jadi pindah halaman otomatis menutupnya.
  const [mobileMenu, setMobileMenu] = useState({ open: false, path: "" });
  const [profileMenu, setProfileMenu] = useState({ open: false, path: "" });
  const mobileOpen = mobileMenu.open && mobileMenu.path === location.pathname;
  const profileOpen = profileMenu.open && profileMenu.path === location.pathname;

  // Ctrl/Cmd + K memfokuskan kolom pencarian.
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Klik di luar menu profil menutupnya.
  useEffect(() => {
    if (!profileOpen) return undefined;
    const onMouseDown = (e) => {
      if (!profileRef.current?.contains(e.target)) setProfileMenu({ open: false, path: "" });
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [profileOpen]);

  function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
    setQuery("");
  }

  function handleRegion(e) {
    if (e.target.value) navigate(`/catalog?region=${encodeURIComponent(e.target.value)}`);
  }

  async function handleSignOut() {
    navigate("/");
    await signOut();
  }

  const renderSearch = (inputRef) => (
    <form
      role="search"
      onSubmit={handleSearch}
      className="flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2"
    >
      <span aria-hidden="true" className="text-gray-400">🔍</span>
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Cari cerita"
        placeholder="Cari cerita rakyat…"
        className="min-w-0 flex-1 bg-transparent text-sm outline-none"
      />
      {inputRef && (
        <kbd className="hidden rounded border border-line px-1.5 text-[10px] text-gray-400 xl:block">Ctrl K</kbd>
      )}
    </form>
  );

  const initial = (profile?.name || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:px-8">
        <Logo size="sm" />

        <select
          aria-label="Wilayah Nusantara"
          value=""
          onChange={handleRegion}
          className="ml-4 hidden h-9 rounded-md border border-line bg-white px-3 text-sm text-gray-700 lg:block"
        >
          <option value="">Wilayah Nusantara</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <nav aria-label="Menu utama" className="hidden items-center gap-1 lg:flex">
          <NavLink to="/catalog" className={navLinkClass}>Jelajah Kisah</NavLink>
          <NavLink to="/dashboard" className={navLinkClass}>Pustaka Saya</NavLink>
        </nav>

        <div className="ml-auto hidden w-64 lg:block">{renderSearch(searchRef)}</div>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {user ? (
            <>
              <Link
                to="/topup"
                aria-label="Saldo koin, buka top-up"
                className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-sm font-semibold text-gray-800 hover:border-kisara"
              >
                <span aria-hidden="true">🪙</span>
                {profile?.points ?? 0} Koin
              </Link>

              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  aria-label="Menu akun"
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileMenu({ open: !profileOpen, path: location.pathname })}
                  className="grid h-9 w-9 place-items-center rounded-full bg-kisara text-sm font-bold text-white"
                >
                  {initial}
                </button>
                {profileOpen && (
                  <div role="menu" className="absolute right-0 mt-2 w-56 rounded-lg border border-line bg-white p-2 shadow-lg">
                    <div className="px-3 py-2">
                      <p className="truncate text-sm font-bold text-gray-900">{profile?.name}</p>
                      <p className="text-xs text-gray-500">{ROLE_LABEL[profile?.role] ?? "Pembaca"}</p>
                    </div>
                    <Link role="menuitem" to="/dashboard" className="block rounded px-3 py-2 text-sm hover:bg-sand">
                      Pustaka Saya
                    </Link>

                    {profile?.role === "creator" && (
                      <Link role="menuitem" to="/creator" className="block rounded px-3 py-2 text-sm hover:bg-sand">
                        Ruang Kreator
                      </Link>
                    )}
                    
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="block w-full rounded px-3 py-2 text-left text-sm font-semibold text-kisara hover:bg-sand"
                    >
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-2 text-sm font-bold text-gray-700 hover:text-kisara">
                Masuk
              </Link>
              <Link to="/register" className="rounded-lg bg-kisara px-4 py-2 text-sm font-bold text-white hover:bg-kisara-dark">
                Daftar
              </Link>
            </>
          )}

          <button
            type="button"
            aria-label="Buka menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileMenu({ open: !mobileOpen, path: location.pathname })}
            className="grid h-9 w-9 place-items-center rounded-md border border-line bg-white text-lg lg:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="space-y-3 border-t border-line bg-cream px-4 pb-4 pt-3 lg:hidden">
          {renderSearch(null)}
          <nav aria-label="Menu seluler" className="flex flex-col gap-1">
            <NavLink to="/catalog" className={navLinkClass}>Jelajah Kisah</NavLink>
            <NavLink to="/dashboard" className={navLinkClass}>Pustaka Saya</NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}