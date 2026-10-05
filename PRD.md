# PRD — KiSara.id

> **Product Requirements Document**
>
> Platform SaaS untuk membaca, menemukan, dan mengembangkan cerita Nusantara.

---

## 1. Informasi Produk

| Item | Detail |
|---|---|
| Nama Produk | **KiSara.id** |
| Jenis | Web-based SaaS |
| Target | Pembaca dan creator cerita Nusantara |
| Status | UTS / MVP |
| Repository | GitHub Public |
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| Payment | Midtrans Sandbox |
| External API | Google Books API |

---

# 2. Product Overview

**KiSara.id** adalah platform SaaS berbasis web yang menyediakan koleksi cerita Nusantara dalam format digital berseri/chapter.

Pengguna dapat menemukan dan membaca cerita, menyimpan bookmark dan riwayat membaca, memperoleh poin melalui aktivitas tertentu, serta menggunakan poin untuk membuka chapter premium.

KiSara.id juga menyediakan ruang bagi pengguna untuk menjadi **Creator** dan mengirimkan karya mereka. Karya yang dikirim akan melalui proses moderasi oleh Admin/Editor sebelum dipublikasikan.

Platform memiliki model monetisasi melalui **top-up poin**. Pengguna dapat memperoleh poin secara gratis melalui aktivitas di platform atau membeli paket poin melalui payment gateway dalam lingkungan **sandbox**. Poin dapat digunakan untuk membuka chapter premium.

Google Books API digunakan sebagai sumber metadata/referensi dan discovery, bukan sebagai sumber otomatis untuk mengambil dan menyalin full-text buku.

---

# 3. Problem Statement

Cerita Nusantara memiliki nilai budaya yang penting, tetapi akses terhadap cerita dalam format digital yang terorganisasi dan menarik masih dapat ditingkatkan.

Di sisi lain, platform membaca digital umumnya lebih berfokus pada konten populer dan belum secara khusus mengangkat cerita Nusantara dengan pendekatan:

- katalog berdasarkan daerah dan kategori;
- format cerita berseri/chapter;
- sistem reward;
- premium content;
- kontribusi creator;
- moderasi konten;
- serta model monetisasi digital.

KiSara.id dirancang untuk menggabungkan aspek membaca, pelestarian cerita, kontribusi komunitas, dan model SaaS dalam satu platform.

---

# 4. Product Goals

## 4.1 Tujuan Utama

1. Menyediakan platform digital untuk membaca cerita Nusantara.
2. Mempermudah pengguna menemukan cerita berdasarkan judul, kategori, dan daerah asal.
3. Meningkatkan engagement melalui sistem poin dan reward.
4. Menyediakan chapter premium sebagai bagian dari model monetisasi.
5. Menyediakan mekanisme top-up poin melalui payment gateway sandbox.
6. Memberikan kesempatan kepada creator untuk mengirimkan karya.
7. Menyediakan sistem moderasi untuk menjaga kualitas konten.
8. Membuat prototype SaaS yang dapat digunakan sebagai proyek UTS.

## 4.2 Success Criteria MVP

MVP dianggap berhasil apabila:

- pengguna dapat melakukan register/login;
- pengguna dapat menemukan dan membaca cerita;
- cerita memiliki chapter free dan premium;
- pengguna dapat memperoleh dan menggunakan poin;
- pengguna dapat melakukan top-up melalui simulasi payment gateway;
- transaksi tercatat dengan benar;
- creator dapat mengirim karya;
- admin dapat melakukan moderasi;
- admin dapat mengelola cerita dan chapter;
- data pengguna dan aktivitas tersimpan di database.

---

# 5. Target Users & Roles

## 5.1 Guest

Pengunjung yang belum login.

### Hak akses

- Melihat landing page.
- Melihat katalog.
- Mencari cerita.
- Memfilter cerita.
- Melihat detail cerita.
- Membaca konten yang tersedia untuk guest/free access.

### Tidak dapat

- Mendapatkan reward personal.
- Menyimpan bookmark.
- Menyimpan reading history.
- Melakukan top-up.
- Membuka chapter premium.
- Mengirim karya.

---

## 5.2 Reader

Pengguna yang sudah memiliki akun.

### Hak akses

- Register/login/logout.
- Membaca cerita.
- Melihat chapter.
- Bookmark.
- Reading history.
- Daily check-in.
- Mendapatkan reward.
- Menggunakan poin.
- Membuka chapter premium.
- Melakukan top-up.
- Melihat riwayat transaksi.
- Mengelola profil.

---

## 5.3 Creator

Creator adalah Reader yang memiliki kemampuan tambahan untuk mengirim karya.

### Hak akses

- Membuat draft.
- Menambahkan informasi cerita.
- Menambahkan chapter.
- Mengirim karya untuk moderasi.
- Melihat status submission.
- Memperbaiki karya yang ditolak.
- Melihat karya yang sudah diterbitkan.

### Status karya

```text
DRAFT → PENDING → APPROVED
              ↘
               REJECTED → EDIT → PENDING
```

---

## 5.4 Admin / Editor

Admin bertanggung jawab terhadap pengelolaan platform dan moderasi konten.

### Hak akses

- Dashboard admin.
- Mengelola pengguna.
- Mengelola cerita.
- Mengelola chapter.
- Mengelola kategori.
- Mengelola daerah.
- Memoderasi karya creator.
- Melihat transaksi.
- Melihat statistik platform.

---

# 6. Core Features

## 6.1 Authentication

- Register.
- Login.
- Logout.
- Session management.
- Role-based access.
- Profile management.

Authentication menggunakan **Supabase Auth**.

---

## 6.2 Story Catalog

Pengguna dapat:

- melihat daftar cerita;
- mencari cerita;
- memfilter berdasarkan kategori;
- memfilter berdasarkan daerah;
- melihat detail cerita;
- melihat jumlah chapter;
- melihat status free/premium.

---

## 6.3 Story & Chapter

Setiap story memiliki:

- judul;
- cover;
- sinopsis;
- kategori;
- daerah asal;
- creator/sumber;
- status publikasi;
- daftar chapter.

Setiap chapter memiliki:

- nomor chapter;
- judul;
- isi;
- status free/premium;
- harga poin;
- status publikasi.

---

## 6.4 Reader

Fitur reader:

- membuka chapter;
- navigasi chapter sebelumnya/berikutnya;
- menyimpan reading history;
- melanjutkan bacaan;
- memperoleh reward setelah menyelesaikan chapter;
- unlock chapter premium.

---

## 6.5 Bookmark

Reader dapat menyimpan cerita ke bookmark dan menghapusnya kembali.

---

## 6.6 Reading History

Sistem mencatat:

- cerita yang dibaca;
- chapter terakhir;
- waktu terakhir membaca;
- progress pembacaan jika diterapkan.

---

## 6.7 Point System

Poin merupakan mata uang virtual dalam platform.

Contoh sumber poin:

- daily check-in;
- menyelesaikan chapter;
- mission/reward tertentu.

Poin dapat digunakan untuk:

- unlock chapter premium.

Semua perubahan saldo harus tercatat dalam **point transaction history**.

---

## 6.8 Daily Check-in

Flow:

```text
User login
    ↓
Check-in
    ↓
Apakah sudah check-in hari ini?
    ├── Ya → Tidak ada reward
    └── Tidak
          ↓
     Cek check-in kemarin
          ├── Ya → streak + 1
          └── Tidak → streak = 1
          ↓
       Tambahkan poin
          ↓
       Simpan transaksi
```

Jika pengguna melewatkan hari berikutnya, streak kembali ke awal.

---

## 6.9 Premium Chapter

Chapter dapat memiliki dua tipe:

```text
FREE
PREMIUM
```

Premium chapter hanya dapat dibaca apabila:

1. pengguna sudah memiliki akses/unlock; atau
2. pengguna memiliki poin yang cukup dan melakukan unlock.

---

## 6.10 Top-Up

Pengguna dapat memilih paket poin.

Contoh paket:

| Paket | Poin | Harga |
|---|---:|---:|
| Basic | 1.000 | Rp10.000 |
| Standard | 5.000 | Rp45.000 |
| Premium | 10.000 | Rp80.000 |

> Nilai di atas merupakan contoh dan dapat diubah berdasarkan keputusan tim.

---

## 6.11 Payment Gateway

Pembayaran menggunakan **Midtrans Sandbox** untuk simulasi.

Flow:

```text
Pilih Paket
    ↓
Checkout
    ↓
Create Transaction
    ↓
Midtrans Sandbox
    ↓
Simulasi Pembayaran
    ↓
Payment Status
    ↓
SUCCESS?
 ├── Tidak → FAILED / EXPIRED
 └── Ya
       ↓
Update Transaction
       ↓
Tambah Poin
```

Tidak ada uang asli yang diproses pada MVP UTS.

---

## 6.12 Creator Submission

Creator dapat:

1. Membuat draft.
2. Mengisi informasi cerita.
3. Menambahkan chapter.
4. Submit karya.
5. Menunggu review.
6. Melihat hasil moderasi.

Admin dapat:

- approve;
- reject;
- memberikan alasan penolakan.

---

## 6.13 Admin Content Management

Admin dapat melakukan CRUD terhadap:

- story;
- chapter;
- kategori;
- daerah;
- data creator.

---

## 6.14 Google Books API

Google Books API digunakan untuk:

- mencari metadata buku;
- mencari referensi cerita;
- memperoleh informasi judul;
- penulis;
- penerbit;
- tahun terbit;
- kategori;
- ISBN;
- thumbnail;
- link Google Books.

Google Books API **tidak digunakan untuk menyalin full-text buku secara otomatis**.

Konten yang ditampilkan sebagai konten KiSara harus memiliki dasar penggunaan yang sesuai, misalnya public domain, izin/lisensi, atau konten yang dibuat/ditulis sendiri oleh platform atau creator.

---

# 7. Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Sistem dapat melakukan registrasi pengguna. |
| FR-02 | Sistem dapat melakukan login dan logout. |
| FR-03 | Sistem dapat mengelola session pengguna. |
| FR-04 | Sistem dapat membedakan hak akses berdasarkan role. |
| FR-05 | Sistem dapat menampilkan katalog cerita. |
| FR-06 | Sistem dapat mencari cerita. |
| FR-07 | Sistem dapat memfilter cerita berdasarkan kategori/daerah. |
| FR-08 | Sistem dapat menampilkan detail cerita. |
| FR-09 | Sistem dapat membagi cerita menjadi beberapa chapter. |
| FR-10 | Sistem dapat menentukan chapter free/premium. |
| FR-11 | Sistem dapat memberikan poin kepada pengguna. |
| FR-12 | Sistem dapat menjalankan daily check-in. |
| FR-13 | Sistem dapat menyimpan riwayat poin. |
| FR-14 | Sistem dapat menggunakan poin untuk unlock chapter. |
| FR-15 | Sistem dapat menyimpan reading history. |
| FR-16 | Sistem dapat menyimpan bookmark. |
| FR-17 | Sistem dapat menyediakan paket top-up. |
| FR-18 | Sistem dapat membuat transaksi pembayaran. |
| FR-19 | Sistem dapat terhubung dengan Midtrans Sandbox. |
| FR-20 | Sistem dapat memperbarui status transaksi. |
| FR-21 | Sistem dapat menambahkan poin setelah pembayaran berhasil. |
| FR-22 | Creator dapat membuat draft karya. |
| FR-23 | Creator dapat submit karya. |
| FR-24 | Creator dapat melihat status submission. |
| FR-25 | Admin dapat memoderasi karya. |
| FR-26 | Admin dapat CRUD story. |
| FR-27 | Admin dapat CRUD chapter. |
| FR-28 | Admin dapat mengelola kategori dan daerah. |
| FR-29 | Admin dapat melihat transaksi. |
| FR-30 | Sistem dapat mengambil metadata melalui Google Books API. |

---

# 8. Non-Functional Requirements

## 8.1 Performance

- Halaman harus memiliki waktu respons yang wajar.
- API tidak melakukan request berulang yang tidak diperlukan.
- Gambar harus dioptimalkan.
- Query database harus dibuat efisien.

## 8.2 Security

- Authentication menggunakan Supabase Auth.
- Password tidak disimpan secara manual oleh aplikasi.
- Role dan authorization harus diperiksa pada sisi server.
- Secret/API key disimpan menggunakan environment variable.
- Data sensitif tidak dikirim ke client.
- Validasi input diterapkan pada endpoint.

## 8.3 Usability

- Responsive pada desktop dan mobile.
- Navigasi mudah dipahami.
- Status free/premium mudah dibedakan.
- Saldo poin mudah dilihat.
- Proses membaca tidak membingungkan.

## 8.4 Reliability

- Transaksi harus tercatat.
- Saldo poin tidak boleh menjadi negatif.
- Unlock chapter harus tetap tersedia setelah refresh.
- Reward tidak boleh diberikan berulang untuk aktivitas yang sama.
- Status pembayaran harus konsisten dengan data transaksi.

## 8.5 Maintainability

- Frontend dan backend dipisahkan.
- Struktur folder konsisten.
- API terdokumentasi.
- Source code dikelola melalui GitHub.
- Environment configuration dipisahkan dari source code.

---

# 9. User Flow

## 9.1 Guest

```text
Landing
 ↓
Catalog
 ↓
Search / Filter
 ↓
Story Detail
 ↓
Free Content
 ↓
Register / Login
```

## 9.2 Reader

```text
Login
 ↓
Home / Catalog
 ↓
Story Detail
 ↓
Chapter
 ↓
Reading History
 ↓
Reward
 ↓
Next Chapter
```

## 9.3 Premium

```text
Open Chapter
 ↓
Premium?
 ↓
Check Unlock
 ↓
Check Point Balance
 ↓
Sufficient?
 ├── Yes → Deduct Point → Unlock
 └── No → Top-Up → Payment → Add Point → Unlock
```

## 9.4 Creator

```text
Reader
 ↓
Creator Access
 ↓
Creator Dashboard
 ↓
Create Story
 ↓
Add Chapters
 ↓
Save Draft
 ↓
Submit
 ↓
Admin Review
 ├── Approved → Published
 └── Rejected → Edit → Resubmit
```

---

# 10. Low-Fidelity Wireframe

## 10.1 Landing Page

```text
┌──────────────────────────────────────────────┐
│ KiSara.id   Beranda  Katalog  Tentang  Login │
├──────────────────────────────────────────────┤
│                                              │
│          Jelajahi Kisah Nusantara            │
│                                              │
│   Temukan cerita dari berbagai daerah        │
│                                              │
│             [ Mulai Membaca ]                │
│                                              │
├──────────────────────────────────────────────┤
│ Cerita Populer                               │
│                                              │
│ [Cover] [Cover] [Cover] [Cover]              │
│ Judul   Judul   Judul   Judul                │
└──────────────────────────────────────────────┘
```

## 10.2 Catalog

```text
┌──────────────────────────────────────────────┐
│ KiSara.id                 Search   Profile    │
├──────────────────────────────────────────────┤
│ [ Cari cerita... ]                           │
│                                              │
│ [Semua] [Kalimantan] [Jawa] [Sumatra] [...]  │
│                                              │
│ ┌────────┐ ┌────────┐ ┌────────┐             │
│ │ COVER  │ │ COVER  │ │ COVER  │             │
│ │ Judul  │ │ Judul  │ │ Judul  │             │
│ │ ★ 4.8  │ │ ★ 4.7  │ │ ★ 4.9  │             │
│ └────────┘ └────────┘ └────────┘             │
└──────────────────────────────────────────────┘
```

## 10.3 Story Detail

```text
┌──────────────────────────────────────────────┐
│ ← Kembali                                    │
├───────────────┬──────────────────────────────┤
│     COVER     │ Judul Cerita                 │
│               │ Daerah                       │
│               │ Kategori                     │
│               │ [ ♡ Bookmark ]               │
│               │                              │
│               │ Sinopsis...                  │
├───────────────┴──────────────────────────────┤
│ Chapters                                     │
│ ✓ Chapter 1 — Awal Kisah                     │
│ ✓ Chapter 2 — Pertemuan                      │
│ 🔒 Chapter 3 — Rahasia                       │
└──────────────────────────────────────────────┘
```

## 10.4 Reader

```text
┌──────────────────────────────────────────────┐
│ ← Chapter 3                    850 poin 🪙    │
├──────────────────────────────────────────────┤
│                 JUDUL CHAPTER                │
│                                              │
│ Isi cerita...                                │
│                                              │
│ Isi cerita...                                │
│                                              │
│              [ ← ] [ → ]                     │
└──────────────────────────────────────────────┘
```

## 10.5 User Dashboard

```text
┌──────────────────────────────────────────────┐
│ KiSara.id                          Profile    │
├──────────────┬───────────────────────────────┤
│ Dashboard    │ Halo, User!                   │
│ Library      │                               │
│ Bookmark     │ 🪙 1.250 Poin                 │
│ History      │ 🔥 5 Day Streak               │
│ Top Up       │                               │
│              │ Lanjutkan Membaca             │
│              │ [ Story Card ]                │
│              │                               │
│              │ [ + Top Up Poin ]             │
└──────────────┴───────────────────────────────┘
```

---

# 11. System Architecture

```text
                         USER
                           │
                           ↓
                    React + Vite
                           │
              ┌────────────┴────────────┐
              ↓                         ↓
        Supabase Auth              Express API
              │                         │
              │                   ┌─────┴─────┐
              │                   ↓           ↓
              │              Supabase     Google Books
              │              PostgreSQL       API
              │                   │
              └──────────┬────────┘
                         │
                         ↓
                    KiSara Data

React → Express → Midtrans Sandbox
                       │
                       ↓
                Payment Status
                       │
                       ↓
                  Supabase DB
```

---

# 12. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Styling | CSS / Tailwind CSS |
| Backend | Node.js |
| API Framework | Express.js |
| Database | Supabase PostgreSQL |
| Authentication | Supabase Auth |
| File Storage | Supabase Storage |
| External API | Google Books API |
| Payment Gateway | Midtrans Sandbox |
| Version Control | Git + GitHub |
| Deployment | Vercel + Railway/Render |

### Explicitly excluded

- Prisma
- Payment gateway production/real-money transaction pada MVP
- Native mobile application

---

# 13. Algorithms

## 13.1 Daily Check-in

```text
START
 ↓
User login
 ↓
Ambil last_check_in
 ↓
Sudah check-in hari ini?
 ├── YES → END
 └── NO
      ↓
 Check-in kemarin?
 ├── YES → streak + 1
 └── NO → streak = 1
      ↓
 Tambahkan reward
      ↓
 Simpan check-in
      ↓
 Simpan point transaction
 ↓
END
```

## 13.2 Unlock Chapter

```text
START
 ↓
User memilih chapter
 ↓
Chapter FREE?
 ├── YES → Buka
 └── NO
      ↓
Sudah unlocked?
 ├── YES → Buka
 └── NO
      ↓
Cek saldo poin
      ↓
Saldo >= harga?
 ├── NO → Top-up
 └── YES
      ↓
Kurangi poin
      ↓
Catat transaksi
      ↓
Buat unlock record
      ↓
Buka chapter
 ↓
END
```

## 13.3 Top-Up

```text
START
 ↓
Pilih paket
 ↓
Buat transaction = PENDING
 ↓
Checkout Midtrans Sandbox
 ↓
Payment status
 ↓
SUCCESS?
 ├── NO → FAILED / EXPIRED
 └── YES
      ↓
Update transaction = SUCCESS
      ↓
Tambahkan poin
      ↓
Simpan point transaction
 ↓
END
```

## 13.4 Creator Moderation

```text
Submit
 ↓
PENDING
 ↓
Admin Review
 ├── APPROVE → PUBLISHED
 └── REJECT → REJECTED
                  ↓
               Edit
                  ↓
               Resubmit
```

## 13.5 Reading Reward

```text
START
 ↓
User membaca chapter
 ↓
Chapter selesai?
 ├── NO → END
 └── YES
      ↓
Sudah pernah mendapat reward?
 ├── YES → END
 └── NO
      ↓
Tambahkan reward
      ↓
Simpan reading history
      ↓
Simpan point transaction
 ↓
END
```

---

# 14. External Resources

## Google Books API

Digunakan untuk:

- metadata buku;
- discovery;
- referensi judul;
- penulis;
- penerbit;
- tahun terbit;
- kategori;
- ISBN;
- thumbnail;
- link sumber.

Google Books tidak menjadi sumber otomatis untuk menyalin full-text buku.

## Midtrans Sandbox

Digunakan untuk mensimulasikan:

- checkout;
- payment;
- payment status;
- transaksi berhasil;
- transaksi gagal/expired.

Tidak ada uang asli yang diproses pada MVP UTS.

---

# 15. Data & Resource Requirements

## Data Internal

- users
- profiles
- stories
- chapters
- categories
- regions
- bookmarks
- reading history
- point transactions
- chapter unlocks
- top-up packages
- payment transactions
- creator submissions

## Data External

- Google Books metadata
- referensi cerita
- sumber budaya/referensi cerita Nusantara

## Human Resources

| Person | Role |
|---|---|
| Maria Peronika | Product & Data Lead |
| Fatimah | Fullstack / Technical Lead |
| Risna Ariyasari Harahap | UI/UX & Creative Frontend |

---

# 16. MVP Scope

## Must Have

- Authentication
- Role management
- Story catalog
- Search/filter
- Story detail
- Chapter reader
- Free/premium chapter
- Point system
- Daily check-in
- Chapter unlock
- Reading history
- Bookmark
- Top-up
- Midtrans Sandbox
- Transaction history
- Creator submission
- Admin moderation
- Admin CRUD story/chapter
- Supabase database

## Should Have

- Reading missions
- Creator statistics
- Google Books API integration
- Rating/review
- Better recommendation system

## Future / Out of Scope MVP

- Real payment gateway production
- Subscription
- Follow creator
- Real-time notification
- Comment system
- AI recommendation
- AI-generated stories
- Audiobook
- Native Android/iOS application

---

# 17. Project Constraints

1. Project dikembangkan untuk kebutuhan UTS.
2. Payment menggunakan sandbox/simulasi.
3. Konten buku eksternal tidak boleh disalin tanpa hak penggunaan yang sesuai.
4. Fitur AI dan mobile application tidak menjadi bagian MVP.
5. Scope harus disesuaikan dengan kapasitas tim tiga orang.
6. Source code dikelola melalui GitHub public repository.

---

# 18. Definition of Done — MVP

Sebuah fitur dianggap selesai apabila:

- fitur dapat digunakan sesuai requirement;
- data tersimpan dengan benar;
- error utama sudah ditangani;
- role/authorization sesuai;
- tidak merusak fitur yang sudah ada;
- sudah diuji secara lokal;
- code sudah di-commit ke branch fitur;
- Pull Request telah direview sebelum merge ke `main`.

---

# 19. Development Workflow

```text
main
 │
 ├── feature/auth
 ├── feature/story
 ├── feature/point-system
 ├── feature/payment
 ├── feature/creator
 └── feature/admin
```

Workflow:

```text
Pull main
   ↓
Create feature branch
   ↓
Develop
   ↓
Test
   ↓
Commit
   ↓
Push
   ↓
Pull Request
   ↓
Review
   ↓
Merge → main
```

---

# 20. Product Summary

**KiSara.id** bukan sekadar website katalog cerita.

KiSara.id merupakan **platform SaaS cerita Nusantara** yang menggabungkan:

> **Reading + Community + Reward + Premium Content + Monetization**

Pengguna dapat membaca dan menemukan cerita, memperoleh reward, membuka chapter premium menggunakan poin, melakukan top-up melalui payment gateway sandbox, serta berkontribusi sebagai creator.

Admin berperan sebagai pengelola dan moderator sehingga konten komunitas tetap melalui proses kurasi sebelum dipublikasikan.

Dengan pendekatan tersebut, KiSara.id memiliki komponen utama sebuah SaaS:

- authentication;
- user management;
- persistent user data;
- content management;
- community-generated content;
- monetization;
- payment flow;
- transaction management;
- external API integration;
- admin dashboard;
- role-based access.
