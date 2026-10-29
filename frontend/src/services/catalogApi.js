import { api } from "./api";

const EMPTY_META = {
  regions: [],
  topRegions: [],
  categories: [],
  stats: { stories: 0, chapters: 0, freeChapters: 0, regions: 0 },
};

let meta = null;
let pending = null;

// Daerah, kategori, dan statistik dimuat sekali saat aplikasi dibuka (lihat main.jsx).
export function loadCatalogMeta() {
  if (meta) return Promise.resolve(meta);
  pending ??= api
    .get("/catalog/meta")
    .then((data) => {
      meta = data;
      return data;
    })
    .finally(() => {
      pending = null;
    });
  return pending;
}

export const getCatalogMeta = () => meta ?? EMPTY_META;

function toQuery(params) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== "" && value != null) qs.set(key, String(value));
  }
  const text = qs.toString();
  return text ? `?${text}` : "";
}

// { q, region, category, sort, page, pageSize } → { items, total, baseTotal, page, pageCount, categoryCounts }
export const fetchStories = (params = {}) => api.get(`/stories${toQuery(params)}`);

// Detail cerita + daftar bab + related (cerita terkait).
export const fetchStory = (slug) => api.get(`/stories/${encodeURIComponent(slug)}`);