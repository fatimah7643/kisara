import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/colors.css";
import { loadCatalogMeta } from "./services/catalogApi";
import Splash from "./components/Splash";

const root = createRoot(document.getElementById("root"));

async function start() {
  root.render(<Splash />);
  try {
    await loadCatalogMeta();
    // App diimpor SETELAH data dasar siap, karena beberapa halaman membacanya saat dimuat.
    const { default: App } = await import("./App.jsx");
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (err) {
    console.error("[startup]", err);
    root.render(<Splash error={err.message || "Terjadi kesalahan."} onRetry={start} />);
  }
}

start();