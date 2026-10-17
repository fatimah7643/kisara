import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          KiSara<span>.id</span>
        </Link>

        <div
          id="kisara-navigation"
          className={`navbar-menu ${menuOpen ? "menu-open" : ""}`}
        >
          <Link to="/" className="navbar-link" onClick={closeMenu}>
            Beranda
          </Link>

          <Link to="/catalog" className="navbar-link" onClick={closeMenu}>
            Katalog
          </Link>

          <a href="/#wilayah" className="navbar-link" onClick={closeMenu}>
            Jelajahi Wilayah
          </a>

          {user ? (
            <Link to="/dashboard" className="navbar-mobile-login" onClick={closeMenu}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" className="navbar-mobile-login" onClick={closeMenu}>
              Login
            </Link>
          )}
        </div>

        {user ? (
          <Link to="/dashboard" className="navbar-login">
            Dashboard
          </Link>
        ) : (
          <Link to="/login" className="navbar-login">
            Login
          </Link>
        )}

        <button
          type="button"
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          aria-controls="kisara-navigation"
        >
          <span>{menuOpen ? "✕" : "☰"}</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
