import dotenv from "dotenv";

dotenv.config();

for (const key of ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"]) {
  if (!process.env[key]) {
    console.error(`${key} belum diisi di backend/.env`);
    process.exit(1);
  }
}

export const config = {
  port: Number(process.env.PORT) || 5000,
  frontendUrls: (process.env.FRONTEND_URL || "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
  supabaseUrl: process.env.SUPABASE_URL,
  serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  allowSimulation: process.env.ALLOW_SIMULATION === "true",
};

export const PAGE_SIZE = 9;
export const WORDS_PER_MINUTE = 200;
export const ORDER_TTL_MS = 24 * 60 * 60 * 1000;

export const CATEGORIES = ["Cerita Rakyat", "Legenda"];

// Harga paket ditentukan di server, tidak pernah dari kiriman browser.
export const PACKAGES = [
  { id: "basic", name: "Basic", points: 1000, price: 10000 },
  { id: "standard", name: "Standard", points: 5000, price: 45000, popular: true },
  { id: "premium", name: "Premium", points: 10000, price: 80000 },
];