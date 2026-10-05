# Frontend PRD — KiSara.id

> Product Requirements Document khusus frontend dan UI/UX KiSara.id.

---

## 1. Frontend Design Direction

### Recommended Style

KiSara.id menggunakan pendekatan:

> **Organic Editorial UI + Swiss Design + SaaS Dashboard**

Bukan mengambil satu style UI secara mentah, tetapi menggabungkan beberapa karakter yang sesuai dengan produk.

### Komposisi style

| Style | Penggunaan | Prioritas |
|---|---|---|
| Organic Design | Identitas cerita Nusantara, bentuk lembut, nuansa natural | ★★★★★ |
| Swiss Design | Grid, whitespace, typography, hierarchy | ★★★★★ |
| Minimalism | Menjaga interface tetap bersih dan fokus membaca | ★★★★★ |
| SaaS Dashboard UI | Dashboard user, creator, admin, wallet | ★★★★☆ |
| Flat Design | Button, card, icon, status | ★★★★☆ |
| Bento UI | Section homepage dan dashboard tertentu | ★★★☆☆ |

### Style yang tidak menjadi arah utama

- Cyberpunk
- Aurora UI
- Glassmorphism berlebihan
- Gradient UI berlebihan
- 3D UI
- Futuristic AI UI
- Terminal/Hacker UI
- Memphis/Y2K yang terlalu dekoratif
- Neobrutalism yang terlalu keras

Alasannya: KiSara merupakan platform cerita dan budaya, sehingga interface harus terasa **hangat, nyaman dibaca, modern, tetapi tetap memiliki karakter Nusantara**.

---

# 2. Visual Reference

Referensi yang diberikan tim memiliki karakter:

- background cream/off-white;
- kombinasi warna teal, navy, dan orange;
- rounded component;
- icon sederhana;
- card dan button yang jelas;
- progress indicator;
- tab;
- dropdown;
- rating;
- dashboard-like component;
- penggunaan whitespace;
- flat UI tanpa efek 3D berlebihan.

Karakter tersebut cocok untuk KiSara, tetapi perlu disesuaikan.

### Yang dipertahankan

- cream/off-white background;
- teal sebagai warna utama;
- orange sebagai accent;
- navy/dark teal untuk teks;
- rounded card;
- flat illustration/icon;
- progress indicator;
- clean spacing.

### Yang diubah

Referensi tidak digunakan secara literal.

KiSara lebih menekankan:

> **Editorial + Storytelling + Cultural**

sehingga halaman membaca harus lebih tenang daripada dashboard.

---

# 3. Visual Identity

## 3.1 Color Direction

Palet awal:

| Role | Warna | Penggunaan |
|---|---|---|
| Background | Warm Off-White | Background utama |
| Primary | Deep Teal | Navbar, CTA, primary button |
| Secondary | Muted Teal | Secondary element |
| Accent | Burnt Orange | Reward, CTA tertentu, highlight |
| Highlight | Soft Mustard | Badge/reward |
| Text | Dark Navy | Heading dan body text |
| Muted | Warm Gray | Metadata dan secondary text |
| Surface | Cream/White | Card |

Contoh warna awal:

```text
Background   #F7F3E8
Primary      #126B6B
Dark         #123047
Accent       #E87525
Mustard      #D9A62E
Surface      #FFFDF7
Muted        #77736A
```

> Warna ini merupakan starting point dan dapat disesuaikan saat UI implementation.

---

# 4. Typography

Typography harus nyaman untuk membaca cerita panjang.

### Heading

Gunakan font display/serif dengan karakter editorial atau humanist.

Contoh:

- Playfair Display
- Lora
- DM Serif Display

### Body

Gunakan sans-serif yang mudah dibaca.

Contoh:

- Inter
- Plus Jakarta Sans
- Manrope

### Rekomendasi

```text
Heading → Lora / DM Serif Display
Body    → Plus Jakarta Sans
UI      → Plus Jakarta Sans
```

Jangan menggunakan terlalu banyak font.

Maksimal:

> **2 font family**

---

# 5. Design Principles

## 5.1 Story First

Konten cerita adalah fokus utama.

UI tidak boleh lebih mencolok daripada cover dan isi cerita.

## 5.2 Comfortable Reading

Reader harus nyaman membaca dalam waktu lama.

- line-height lega;
- ukuran font cukup besar;
- lebar content dibatasi;
- kontras teks jelas;
- minim distraksi.

## 5.3 Warm & Cultural

Nuansa Nusantara ditampilkan secara halus melalui:

- warna;
- ilustrasi;
- motif sederhana;
- bentuk organik;
- micro-decoration.

Jangan membuat seluruh halaman penuh ornamen tradisional.

## 5.4 Modern SaaS

Walaupun membawa tema cerita Nusantara, platform tetap terasa seperti produk SaaS modern.

---

# 6. Layout System

## Desktop

Max content width:

```text
1200px – 1280px
```

Grid:

```text
12-column grid
```

Spacing system menggunakan kelipatan konsisten:

```text
4
8
12
16
24
32
48
64
```

## Mobile

Gunakan:

```text
1-column layout
```

Navigation berubah menjadi:

```text
Logo
Search
Menu/Profile
```

Dashboard sidebar berubah menjadi mobile navigation/bottom navigation bila diperlukan.

---

# 7. Global Components

Komponen reusable:

```text
components/
├── Navbar
├── Footer
├── Button
├── Input
├── SearchBar
├── Select
├── Modal
├── Toast
├── Badge
├── Avatar
├── StoryCard
├── ChapterCard
├── StoryCover
├── Rating
├── ProgressBar
├── PointBadge
├── CoinBalance
├── EmptyState
├── LoadingState
└── ErrorState
```

---

# 8. Navbar

## Guest

```text
┌─────────────────────────────────────────────────────┐
│ KiSara.id    Beranda   Katalog   Tentang   [Login] │
└─────────────────────────────────────────────────────┘
```

## Logged-in User

```text
┌────────────────────────────────────────────────────────────┐
│ KiSara.id   Beranda  Katalog  Library    🪙 1.250  Avatar │
└────────────────────────────────────────────────────────────┘
```

Navbar menggunakan background solid, bukan glassmorphism berat.

---

# 9. Landing Page

Tujuan:

> memperkenalkan KiSara dan mengarahkan user untuk mulai membaca.

## Struktur

```text
Navbar
   ↓
Hero
   ↓
Featured Stories
   ↓
Explore by Region
   ↓
How KiSara Works
   ↓
Reward / Point Section
   ↓
Creator Section
   ↓
CTA
   ↓
Footer
```

## Hero

```text
┌────────────────────────────────────────────────────┐
│                                                    │
│  KISAH NUSANTARA,                                  │
│  DALAM SATU PLATFORM                               │
│                                                    │
│  Jelajahi cerita dari berbagai daerah              │
│  Indonesia dan temukan kisah baru setiap hari.     │
│                                                    │
│  [ Mulai Membaca ]                                 │
│                                                    │
│                         ┌───────────────┐           │
│                         │ Story Cover   │           │
│                         │ Illustration  │           │
│                         └───────────────┘           │
│                                                    │
└────────────────────────────────────────────────────┘
```

Hero tidak perlu terlalu ramai.

---

# 10. Catalog Page

## Layout

```text
┌────────────────────────────────────────────────────┐
│ Jelajahi Cerita                                    │
│                                                    │
│ [ 🔍 Cari cerita... ]                              │
│                                                    │
│ [Semua] [Kalimantan] [Jawa] [Sumatra] [Sulawesi] │
│                                                    │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │ COVER  │ │ COVER  │ │ COVER  │ │ COVER  │       │
│ │        │ │        │ │        │ │        │       │
│ │ Judul  │ │ Judul  │ │ Judul  │ │ Judul  │       │
│ │ Region │ │ Region │ │ Region │ │ Region │       │
│ └────────┘ └────────┘ └────────┘ └────────┘       │
└────────────────────────────────────────────────────┘
```

### Story Card

Informasi:

- cover;
- title;
- region;
- category;
- rating jika tersedia;
- jumlah chapter;
- Free/Premium badge.

Card tidak menggunakan shadow berat.

---

# 11. Story Detail Page

Struktur:

```text
← Kembali

┌───────────────┬─────────────────────────────────┐
│               │ Judul Cerita                    │
│     COVER     │                                 │
│               │ Kalimantan Selatan              │
│               │ Cerita Rakyat                   │
│               │                                 │
│               │ [ ♡ Bookmark ] [ Mulai Baca ] │
└───────────────┴─────────────────────────────────┘

SINOPSIS
───────────────────────────────────────────────────
Deskripsi cerita...

CHAPTER
───────────────────────────────────────────────────

✓ Chapter 1     GRATIS
✓ Chapter 2     GRATIS
🔒 Chapter 3    500 poin
🔒 Chapter 4    500 poin
```

---

# 12. Reader Page

Reader adalah halaman paling penting secara UX.

### Prinsip

- fokus pada teks;
- tidak banyak tombol;
- background lembut;
- lebar teks terbatas;
- typography nyaman;
- chapter navigation jelas.

```text
┌──────────────────────────────────────────────────┐
│ ← Story Title                     🪙 1.250       │
├──────────────────────────────────────────────────┤
│                                                  │
│                 JUDUL CHAPTER                    │
│                                                  │
│  Isi cerita dimulai di sini.                    │
│                                                  │
│  Paragraf cerita dibuat dengan line-height       │
│  yang cukup agar nyaman dibaca.                 │
│                                                  │
│  ..............................................  │
│                                                  │
│                  [ Chapter 3 ]                   │
│                                                  │
│             [ ← ]       [ → ]                   │
└──────────────────────────────────────────────────┘
```

### Reading Settings

Opsional:

- font size;
- line height;
- reading width;
- light/dim mode.

---

# 13. Dashboard Reader

Style:

> **SaaS Dashboard UI + editorial card**

```text
┌──────────────────────────────────────────────────────┐
│ Sidebar           │ Dashboard                        │
│                   │                                  │
│ Dashboard         │ Halo, User! 👋                   │
│ Library           │                                  │
│ Bookmark          │ ┌────────┐ ┌────────┐           │
│ History           │ │ 1.250  │ │ 🔥 5   │           │
│ Wallet            │ │ Poin   │ │ Streak │           │
│ Profile           │ └────────┘ └────────┘           │
│                   │                                  │
│                   │ Lanjutkan Membaca               │
│                   │ [ Story Card ]                   │
│                   │                                  │
│                   │ [ + Top Up Poin ]                │
└──────────────────────────────────────────────────────┘
```

Dashboard boleh menggunakan **Bento UI secara terbatas** untuk statistik.

---

# 14. Wallet / Top-Up Page

Halaman ini harus terasa seperti SaaS/payment dashboard.

```text
┌────────────────────────────────────────────────────┐
│ Wallet                                             │
├────────────────────────────────────────────────────┤
│                                                    │
│ Saldo Poin                                         │
│                                                    │
│             🪙 1.250                               │
│                                                    │
│ [ + Top Up ]                                       │
│                                                    │
├────────────────────────────────────────────────────┤
│ Pilih Paket                                        │
│                                                    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│ │ 1.000   │ │ 5.000   │ │ 10.000  │              │
│ │ Poin    │ │ Poin    │ │ Poin    │              │
│ │ Rp10K    │ │ Rp45K   │ │ Rp80K   │              │
│ │ [Beli]  │ │ [Beli]  │ │ [Beli]  │              │
│ └─────────┘ └─────────┘ └─────────┘              │
│                                                    │
│ Riwayat Transaksi                                  │
└────────────────────────────────────────────────────┘
```

---

# 15. Checkout Page

```text
┌────────────────────────────────────────────────────┐
│ Checkout                                           │
├─────────────────────────┬──────────────────────────┤
│ Paket 5.000 Poin        │ Ringkasan                │
│                         │                          │
│ Rp45.000                │ Poin: 5.000              │
│                         │ Total: Rp45.000          │
│                         │                          │
│                         │ [ Bayar Sekarang ]       │
└─────────────────────────┴──────────────────────────┘
```

Setelah button ditekan:

```text
KiSara
   ↓
Midtrans Sandbox
   ↓
Payment
   ↓
Success / Failed
```

---

# 16. Creator Dashboard

Menggunakan style SaaS Dashboard.

```text
┌────────────────────────────────────────────────────┐
│ Creator Dashboard                                  │
├────────────────────────────────────────────────────┤
│                                                    │
│ Karya Saya                     [ + Buat Karya ]   │
│                                                    │
│ ┌───────────────────────────────────────────────┐  │
│ │ Judul Karya          Status       Chapter     │  │
│ │ Legenda Martapura    PUBLISHED       5        │  │
│ │ Kisah Banua          PENDING         3        │  │
│ │ Cerita Baru          DRAFT           1        │  │
│ └───────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

---

# 17. Creator Story Editor

Form:

```text
┌──────────────────────────────────────────────┐
│ Buat Karya                                   │
├──────────────────────────────────────────────┤
│ Cover                                        │
│ [ Upload Cover ]                             │
│                                              │
│ Judul                                        │
│ [____________________________]                │
│                                              │
│ Daerah Asal                                  │
│ [ Pilih Daerah ▼ ]                           │
│                                              │
│ Kategori                                     │
│ [ Pilih Kategori ▼ ]                         │
│                                              │
│ Sinopsis                                     │
│ [____________________________]                │
│ [____________________________]                │
│                                              │
│ Chapters                                     │
│ [ + Tambah Chapter ]                         │
│                                              │
│ [ Simpan Draft ] [ Submit untuk Review ]     │
└──────────────────────────────────────────────┘
```

---

# 18. Admin Dashboard

Admin UI lebih data-oriented.

```text
┌────────────────────────────────────────────────────┐
│ Admin Dashboard                                    │
├────────────────────────────────────────────────────┤
│                                                    │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │
│ │ Users  │ │ Stories│ │Creators│ │Pending │       │
│ │ 1,250  │ │ 240    │ │ 85     │ │ 12     │       │
│ └────────┘ └────────┘ └────────┘ └────────┘       │
│                                                    │
│ Recent Submission                                  │
│ ┌──────────────────────────────────────────────┐   │
│ │ Story              Creator       Status      │   │
│ │ Kisah Banua        User01        Pending     │   │
│ │ Legenda Sungai     User02        Pending     │   │
│ └──────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────┘
```

---

# 19. Admin Moderation

```text
┌────────────────────────────────────────────────────┐
│ Review Submission                                  │
├────────────────────────────────────────────────────┤
│ Judul: Kisah Banua                                 │
│ Creator: User01                                    │
│                                                    │
│ Sinopsis                                            │
│ .................................................. │
│                                                    │
│ Preview Chapter                                    │
│ .................................................. │
│                                                    │
│ Alasan / Catatan                                   │
│ [______________________________________________]   │
│                                                    │
│ [ Reject ]                         [ Approve ]     │
└────────────────────────────────────────────────────┘
```

---

# 20. Component States

Setiap komponen harus memiliki state.

### Button

```text
Default
Hover
Active
Disabled
Loading
```

### Input

```text
Default
Focus
Filled
Error
Disabled
```

### Story Card

```text
Default
Hover
Bookmarked
Locked
```

### Chapter

```text
Free
Premium Locked
Unlocked
Reading
Completed
```

---

# 21. Feedback & Status

Gunakan status yang mudah dikenali:

```text
SUCCESS
WARNING
ERROR
INFO
PENDING
LOCKED
```

Contoh:

```text
✓ Pembayaran berhasil
⏳ Menunggu pembayaran
⚠ Saldo poin tidak cukup
🔒 Chapter premium
```

Jangan mengandalkan warna saja; sertakan icon/label.

---

# 22. Responsive Design

## Desktop

- max-width sekitar 1200–1280px;
- grid 3–5 story cards;
- dashboard menggunakan sidebar;
- reader menggunakan content width terbatas.

## Tablet

- grid 2–3 cards;
- sidebar dapat diperkecil;
- navigation tetap accessible.

## Mobile

- satu kolom;
- story card dapat horizontal atau 2-column grid;
- sidebar menjadi mobile menu;
- button utama mudah dijangkau;
- reader menggunakan padding kecil;
- font dan line-height tetap nyaman.

---

# 23. Accessibility

Target minimal:

- kontras teks yang cukup;
- focus state jelas;
- tombol memiliki label;
- alt text untuk gambar;
- keyboard navigation pada komponen utama;
- tidak menggunakan warna sebagai satu-satunya indikator;
- ukuran clickable area nyaman pada mobile.

---

# 24. Frontend Folder Structure

```text
frontend/
└── src/
    ├── assets/
    │   ├── images/
    │   ├── icons/
    │   └── fonts/
    │
    ├── components/
    │   ├── Navbar/
    │   ├── Footer/
    │   ├── Button/
    │   ├── StoryCard/
    │   ├── ChapterCard/
    │   ├── SearchBar/
    │   ├── Modal/
    │   ├── Toast/
    │   └── ...
    │
    ├── layouts/
    │   ├── MainLayout/
    │   ├── ReaderLayout/
    │   ├── DashboardLayout/
    │   └── AdminLayout/
    │
    ├── pages/
    │   ├── Home/
    │   ├── Catalog/
    │   ├── StoryDetail/
    │   ├── Reader/
    │   ├── Login/
    │   ├── Register/
    │   ├── Dashboard/
    │   ├── Library/
    │   ├── Bookmark/
    │   ├── History/
    │   ├── Wallet/
    │   ├── Checkout/
    │   ├── Creator/
    │   └── Admin/
    │
    ├── services/
    │   ├── api.js
    │   ├── supabase.js
    │   └── googleBooks.js
    │
    ├── utils/
    │   ├── formatCurrency.js
    │   ├── formatDate.js
    │   └── constants.js
    │
    ├── App.jsx
    └── main.jsx
```

---

# 25. Recommended Frontend Page Map

```text
PUBLIC
├── /
├── /catalog
├── /story/:id
├── /login
└── /register

READER
├── /dashboard
├── /library
├── /bookmarks
├── /history
├── /wallet
├── /checkout
└── /reader/:storyId/:chapterId

CREATOR
├── /creator
├── /creator/stories
├── /creator/stories/new
└── /creator/stories/:id/edit

ADMIN
├── /admin
├── /admin/users
├── /admin/stories
├── /admin/chapters
├── /admin/categories
├── /admin/submissions
└── /admin/transactions
```

---

# 26. Frontend UX Priorities

Prioritas pengerjaan UI:

### P0 — Core

1. Navbar
2. Landing page
3. Catalog
4. Story detail
5. Reader
6. Login/Register
7. User dashboard
8. Wallet/Top-up
9. Checkout
10. Admin dashboard

### P1 — Important

11. Creator dashboard
12. Creator editor
13. Moderation page
14. Bookmark
15. Reading history

### P2 — Enhancement

16. Reading settings
17. Mission
18. Rating
19. Recommendation
20. Animation/micro-interaction

---

# 27. UX Rules

1. Jangan membuat UI terlalu ramai.
2. Konten cerita harus menjadi fokus utama.
3. Gunakan whitespace.
4. Maksimal dua font family.
5. Gunakan accent orange secara terbatas.
6. Jangan menggunakan gradient sebagai dekorasi utama.
7. Hindari glassmorphism berat.
8. Gunakan icon secara konsisten.
9. Jangan menggunakan terlalu banyak rounded card dalam satu layar.
10. Setiap halaman harus memiliki satu primary CTA yang jelas.
11. Reader harus memiliki distraksi seminimal mungkin.
12. Dashboard boleh lebih padat daripada halaman reader.
13. Mobile harus dipikirkan sejak awal, bukan sekadar hasil resize desktop.

---

# 28. Design Personality

KiSara.id harus terasa:

- **Hangat**
- **Modern**
- **Editorial**
- **Natural**
- **Cultural**
- **Friendly**
- **Clean**
- **Trustworthy**

Bukan:

- terlalu formal;
- terlalu korporat;
- terlalu childish;
- terlalu tradisional;
- terlalu futuristik;
- terlalu ramai.

---

# 29. Final UI Direction

### Recommended final direction

> **"Modern Nusantara Editorial SaaS"**

Visualnya mengambil:

**Organic Design**
→ memberikan rasa natural dan budaya.

**Swiss Design**
→ memberikan struktur, grid, whitespace, dan typography yang rapi.

**Minimalism**
→ menjaga pengalaman membaca.

**SaaS Dashboard**
→ digunakan untuk dashboard user, creator, admin, wallet, dan transaksi.

**Flat Design**
→ digunakan untuk button, badge, icon, dan status.

Referensi visual yang diberikan cocok dijadikan **inspirasi component system dan color relationship**, tetapi KiSara tidak perlu meniru layoutnya secara langsung.

### One-line design brief

> **KiSara.id should feel like a modern digital reading platform rooted in Indonesian culture: warm like a storybook, clean like a modern SaaS, and comfortable enough to read for a long time.**
