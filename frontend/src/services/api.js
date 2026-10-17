const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export async function fetchStories(search = "", region = "") {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (region) params.append("region", region);

    const res = await fetch(`${API_BASE}/stories?${params.toString()}`);
    if (!res.ok) throw new Error("Gagal mengambil data dari server");
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("[fetchStories]", err);
    return [];
  }
}

export async function fetchRegions() {
  try {
    const res = await fetch(`${API_BASE}/regions`);
    if (!res.ok) throw new Error("Gagal mengambil data wilayah");
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error("[fetchRegions]", err);
    return [];
  }
}

export async function fetchStoryBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE}/stories/${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error("Cerita tidak ditemukan");
    return await res.json();
  } catch (err) {
    console.error("[fetchStoryBySlug]", err);
    return null;
  }
}
