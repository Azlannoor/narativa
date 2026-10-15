# Product Requirements Document (PRD) - Narativa

## 1. Ringkasan & Tujuan Aplikasi
- **Nama Aplikasi**: Narativa
- **Penjelasan Singkat**: Studio penyusun skrip konten pendek untuk kreator. Kreator memilih ide, hook, formula penulisan, dan CTA dari perpustakaan siap pakai, lalu merakitnya menjadi skrip Reels, TikTok, dan Facebook yang siap direkam.
- **Masalah yang Diselesaikan**:
  - Kreator kehabisan ide dan bingung memulai video tanpa struktur.
  - Hook lemah membuat penonton men-scroll dalam 1–3 detik pertama.
  - CTA tidak jelas sehingga tanpa tindak lanjut.
  - Skrip ditulis ulang dari nol, memakan waktu dan tidak konsisten.
- **Pengguna**: Kreator Konten (Reels, TikTok, Facebook).

## 2. Batasan Pembuatan Sistem (Versi Awal MVP)
- **Yang Dikerjakan**:
  - Registrasi & login username & password (Clerk).
  - Dashboard Kreator dengan prioritas modul Library Ide, Hook, CTA.
  - Library Ide (Edukasi, Inspirasi, Promosi, BTS/Personal) & filter platform.
  - Library Hook (Kesalahan Fatal, Kontroversial, Studi Kasus) + pengisian variabel topik.
  - Library CTA (Save & Bookmark, DM Lead Gen, Engagement/Share Viral) & gaya jualan.
  - Library Formula (AIDA, 4P, ACCA, PAS, The Teardown, The Playbook, BAB, Hero's Journey).
  - Library B-roll faceless 9:16 (Desk Setup, Coding & Terminal, Creative Flow) pemutar Bunny Stream.
  - Wizard pembuatan skrip 5 langkah (Instagram Reels, TikTok, Facebook Reels, Facebook Post).
  - Pilihan gaya jualan: Hard Selling, Soft Selling, Storyteller.
  - Editor skrip, daftar skrip, duplikasi, hapus, ekspor .txt dan .md.
  - Penyimpanan favorit library.
- **Yang Tidak Dikerjakan (MVP)**:
  - Generasi teks AI generatif (MVP memakai template assembly modular).
  - Pembuatan/pengeditan video in-app.
  - Auto-scheduling / auto-posting.
  - Payment gateway / langganan berbayar.
  - Kolaborasi tim / multi-workspace.

## 3. Daftar Halaman & Routing
- **Public**:
  - `/` (Beranda)
  - `/masuk` (Masuk)
  - `/daftar` (Daftar)
  - `/kebijakan-privasi` (Kebijakan Privasi)
  - `/syarat-ketentuan` (Syarat & Ketentuan)
- **Kreator Konten**:
  - `/dashboard` (Dasbor Utama)
  - `/library/ide` (Library Ide)
  - `/library/hook` (Library Hook)
  - `/library/cta` (Library CTA)
  - `/library/formula` (Library Formula)
  - `/library/broll` (Library B-roll)
  - `/skrip` (Daftar Skrip)
  - `/skrip/baru` (Wizard Skrip 5 Langkah)
  - `/skrip/[id]` (Editor Skrip)
  - `/skrip/[id]/pratinjau` (Pratinjau Teleprompter Skrip)
  - `/pengaturan` (Pengaturan Profil)

## 4. Pedoman UI/UX & Design System
- Modern & Sleek Dark Mode (studio kreatif malam hari).
- Tokens:
  - Background utama: `hsl(230, 25%, 6%)` (`#0b0d14`)
  - Surface/Card: `hsl(230, 22%, 10%)` (`#141724`)
  - Elevated Popover/Dialog: `hsl(230, 20%, 13%)` (`#1b1f30`)
  - Border: `hsl(230, 15%, 22%, 0.6)`
  - Text Primary: `hsl(220, 20%, 95%)`
  - Text Secondary: `hsl(225, 12%, 65%)`
  - Primary: `hsl(262, 83%, 68%)` (violet lembut)
  - Accent: `hsl(190, 90%, 55%)` (cyan)
  - Kategori pilar badge: Edukasi (cyan), Inspirasi (violet), Promosi (amber), BTS/Personal (hijau tosca).
  - Hook kategori badge: Kesalahan Fatal (merah), Kontroversial (amber), Studi Kasus (biru).
- Tipografi: Plus Jakarta Sans (Headings), Inter (Body), JetBrains Mono (Hook, durasi, variabel).
- Komponen: rounded-2xl untuk card, rounded-xl untuk tombol/input, preview 9:16 untuk video & teleprompter.

## 5. Hak Akses Pengguna
- Public vs Kreator Konten. Data skrip privat per pengguna.

## 6. Alur Kerja Fitur Utama
- Wizard 5 Langkah: Platform & Pilar -> Ide & Audiens -> Gaya Jualan & Formula -> Hook & Isi Bagian -> CTA, B-roll & Tinjauan.
- Estimasi durasi skrip: 2.5 kata per detik.
- Ekspor clipboard, .txt, dan .md.

## 10. Skema Database
- Enum: `platform`, `pillar`, `hook_category`, `formula_code`, `sales_style`, `cta_goal`, `broll_category`, `script_status`, `favorite_type`.
- Tabel: `users`, `ideas`, `hooks`, `formulas`, `sales_styles`, `ctas`, `broll_assets`, `scripts`, `library_favorites`.

## 11. Work Breakdown Structure (Fase 1: Task 1.1 - 1.5)
- Task 1.1: Foundations & Design System
- Task 1.2: Layouts & Persistent Navigation
- Task 1.3: Public Pages
- Task 1.4: Dashboard & Library Pages
- Task 1.5: Wizard, Skrip, & Pengaturan Pages
