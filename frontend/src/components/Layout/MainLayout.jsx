import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";

// Kerangka halaman publik: Navbar di atas, Footer di bawah.
export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cream text-gray-800">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}