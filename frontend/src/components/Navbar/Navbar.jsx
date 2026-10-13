import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          KiSara.id
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="navbar-link">
            Beranda
          </Link>

          <Link to="/catalog" className="navbar-link">
            Katalog
          </Link>

          
          <a href="/#wilayah" className="navbar-link">
            Jelajahi Wilayah
          </a>
        </div>

        <Link to="/login" className="navbar-login">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;