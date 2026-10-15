export interface RawIdeaEntity {
  id: string;
  title: string;
  pillar: string;
  platform: string;
  status: string;
  targetDate: string;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export function generate150Ideas(): RawIdeaEntity[] {
  const result: RawIdeaEntity[] = [];

  const edukasiThemes = [
    { title: "5 Kesalahan Fatal Arsitektur Design System Tailwind v4", notes: "Fokus migrasi dari config usang ke direktif @theme baru." },
    { title: "Cara Mengurangi Latensi Navigasi Client-Side ke <15ms", notes: "Bedah optimasi pre-fetching dan cache invalidation di Next.js 15." },
    { title: "Matematika Radius: Mengapa r_inner = r_outer - p Wajib Diterapkan", notes: "Panduan visual menghitung nested border radius agar sudut konsisten." },
    { title: "Zero-Pill Discipline: Cara Menyajikan Metadata Tanpa Clutter Visual", notes: "Ubah 5 pill badge warna-warni jadi teks polos dengan separator titik tipis." },
    { title: "Single-Elevation Depth: Menghilangkan Efek Card-Within-Cards", notes: "Terapkan background bersih dengan hairline border 8% dan whitespace 2rem." },
    { title: "Checklist Aksesibilitas WCAG AA untuk Frontend Developer Modern", notes: "Uji kontras 4.5:1, target sentuh 44px, dan keyboard focus trap." },
    { title: "Cara Tepat Menggunakan Dexie IndexedDB untuk Aplikasi Offline-First", notes: "Arsitektur penyimpanan lokal cepat tanpa ketergantungan server terus menerus." },
    { title: "Zustand vs React Context: Kapan Harus Pindah State Management?", notes: "Analisis re-render performance dan kemudahan debugging selector." },
    { title: "Bedah Kode: Autentikasi Client-Side Tanpa Server Secrets", notes: "Pola penanganan OAuth token aman langsung di browser." },
    { title: "Panduan Lengkap Form Validation Menggunakan React Hook Form & Zod", notes: "Skema validasi runtime instan dengan error message yang ramah pengguna." },
    { title: "Optimasi Web Core Vitals: Mengatasi Cumulative Layout Shift (CLS)", notes: "Teknik sizing gambar dan font fallback untuk menghilangkan layout jank." },
    { title: "Mengapa Font Tabular Numerals Wajib untuk Dasbor Keuangan", notes: "Atur font-variant-numeric: tabular-nums agar angka tidak bergeser saat update." },
    { title: "Micro-Animations Framer Motion yang Tidak Mengorbankan Baterai", notes: "Batasi animasi hanya pada properti transform dan opacity 60fps." },
    { title: "Cara Mengatur 60-30-10 Color Rule Pada Tema Dark Mode", notes: "Dominan 60% slate gelap, 30% background cards, 10% aksen radiasi cerah." },
    { title: "Bongkar Script: Menulis Hook Video Pendek dengan Retensi 80%", notes: "Trik interupsi pola 3 detik pertama dengan visual zooming dan sound bite." },
  ];

  const inspirasiThemes = [
    { title: "Mengapa Desain Antarmuka Linear Menjadi Standar Baru Industri", notes: "Analisis estetika monoline, palet gelap dingin, dan micro-interaction cepat." },
    { title: "Showcase 5 Aplikasi SaaS dengan UI Paling Elegan Tahun 2026", notes: "Kajian desain Stripe, Raycast, Vercel, Supabase, dan Cron." },
    { title: "Pelajaran Desain dari Fisika Dunia Nyata: Momentum dan Inersia", notes: "Menerapkan kurva bezier elastis pada interaksi drag-and-drop." },
    { title: "Evolusi Tren UI Web: Dari Skeuomorphism, Flat, Glassmorphism, Hingga Minimalis", notes: "Perjalanan visual 15 tahun terakhir dan ke mana arah desain selanjutnya." },
    { title: "Quote Inspiratif: 'Perfection is Achieved When There Is Nothing Left to Take Away'", notes: "Refleksi filosofi desain Antoine de Saint-Exupéry dalam arsitektur software." },
    { title: "Kisah di Balik Suksesnya Produk yang Berani Mengurangi 70% Fiturnya", notes: "Fokus pada produk sederhana yang memecahkan satu masalah krusial dengan sempurna." },
    { title: "Prinsip Estetika Tokyo: Minimalisme Fungsional yang Menenangkan", notes: "Bagaimana arsitektur Jepang menginspirasi whitespace antarmuka digital." },
    { title: "Menghargai Keindahan Kode yang Rapi dan Self-Documenting", notes: "Estetika penamaan variabel, struktur folder modular, dan arsitektur bersih." },
    { title: "Mengapa Engineer yang Paham Desain Memiliki Nilai Pasar 3x Lipat", notes: "Peluang besar bagi software engineer dengan kepekaan visual tingkat tinggi." },
    { title: "Membangun Portofolio Digital yang Menarik Klien Internasional", notes: "Tunjukkan studi kasus pemecahan masalah konkret, bukan sekadar screenshot mockup." },
  ];

  const promosiThemes = [
    { title: "Peluncuran Starter Kit Aether Studio v1.0", notes: "Akses lengkap ke template Canva, boilerplate kode, dan panduan pilar." },
    { title: "Penawaran Terbatas: Diskon 40% Early Bird Aether Design Kit", notes: "Kupon eksklusif untuk 100 pengembang pertama yang ingin akselerasi sprint." },
    { title: "Unduh Gratis: 30 Hook & 25 CTA Template Pemicu Komentar", notes: "Lead magnet pemicu interaksi DM dan konversi email list." },
    { title: "Buka Kuota Sesi Konsultasi Arsitektur Frontend B2B Bulan Ini", notes: "Khusus bagi founder startup yang ingin audit UI/UX sebelum fundraising." },
    { title: "Showcase Testimoni Pengguna: 'Sprint Tim Kami 2x Lebih Cepat'", notes: "Studi kasus nyata tim yang sukses mengadopsi design tokens Aether." },
    { title: "Freebie: 10 Preset Warna Dark Mode HSL untuk Tailwind CSS v4", notes: "Copy-paste token palet langsung ke file stylesheet proyekmu." },
    { title: "Gabung Komunitas Eksklusif Creator-Engineers di Discord", notes: "Tempat berbagi feedback UI, review kode, dan peluang kolaborasi proyek." },
    { title: "Webinar Masterclass: Cara Merancang Dasbor SaaS Standar Silicon Valley", notes: "Sesi live coding 90 menit kupas tuntas tipografi dan glassmorphism." },
  ];

  const btsThemes = [
    { title: "Behind The Scene: Riset UX & Palet Dark Mode Premium", notes: "Video eksperimen mengukur kontras rasio warna di ruangan berpencahayaan rendah." },
    { title: "Setup Meja Kerja Minimalis Developer: Hardware & Ergonomi 2026", notes: "Spesifikasi mechanical keyboard, monitor ultrawide, dan lampu ambient." },
    { title: "Catatan Pribadi: Ketika Saya Menghapus 2.000 Baris Kode yang Tidak Berguna", notes: "Perasaan lega saat menyederhanakan arsitektur yang over-engineered." },
    { title: "Satu Hari Bersama Principal Engineer: Rutinitas, Fokus, & Kopi", notes: "Alokasi deep work 4 jam tanpa gangguan notifikasi di pagi hari." },
    { title: "Kegagalan Terbesar Saya di Awal Karier dan Pelajaran Berharganya", notes: "Cerita jujur saat deploy bug ke production dan bagaimana membangun recovery plan." },
    { title: "Di Balik Layar Pembuatan Komponen Dialog Modal dengan Focus Trap", notes: "Tantangan membuat dialog yang ramah pengguna keyboard dan screen reader." },
    { title: "Buku-Buku yang Mengubah Cara Saya Berpikir Tentang Arsitektur Software", notes: "Rekomendasi bacaan seputar refactoring, design patterns, dan psikologi kerja." },
  ];

  const platforms = [
    "Instagram Carousel",
    "Instagram Reels",
    "Single Post",
    "X / Thread",
    "TikTok",
    "YouTube",
  ];

  const statuses = ["Draft", "Siap Produksi", "Terjadwal", "Dipublikasikan"];

  let currentId = 1;

  // 1. Edukasi: 60 Ideas (40%)
  for (let i = 0; i < 60; i++) {
    const item = edukasiThemes[i % edukasiThemes.length];
    const id = `IDEA-${String(currentId).padStart(3, "0")}`;
    const dayOffset = (i % 30) + 1;
    const targetDate = `2026-10-${String(dayOffset).padStart(2, "0")}`;

    result.push({
      id,
      title: i < edukasiThemes.length ? item.title : `${item.title} (Part ${Math.floor(i / edukasiThemes.length) + 1})`,
      pillar: "Edukasi",
      platform: platforms[i % platforms.length],
      status: statuses[i % statuses.length],
      targetDate,
      notes: item.notes,
    });
    currentId++;
  }

  // 2. Inspirasi: 38 Ideas (25%)
  for (let i = 0; i < 38; i++) {
    const item = inspirasiThemes[i % inspirasiThemes.length];
    const id = `IDEA-${String(currentId).padStart(3, "0")}`;
    const dayOffset = (i % 30) + 1;
    const targetDate = `2026-10-${String(dayOffset).padStart(2, "0")}`;

    result.push({
      id,
      title: i < inspirasiThemes.length ? item.title : `${item.title} (Edisi ${Math.floor(i / inspirasiThemes.length) + 1})`,
      pillar: "Inspirasi",
      platform: platforms[(i + 1) % platforms.length],
      status: statuses[(i + 1) % statuses.length],
      targetDate,
      notes: item.notes,
    });
    currentId++;
  }

  // 3. Promosi: 30 Ideas (20%)
  for (let i = 0; i < 30; i++) {
    const item = promosiThemes[i % promosiThemes.length];
    const id = `IDEA-${String(currentId).padStart(3, "0")}`;
    const dayOffset = (i % 30) + 1;
    const targetDate = `2026-10-${String(dayOffset).padStart(2, "0")}`;

    result.push({
      id,
      title: i < promosiThemes.length ? item.title : `${item.title} (Varian ${Math.floor(i / promosiThemes.length) + 1})`,
      pillar: "Promosi",
      platform: platforms[(i + 2) % platforms.length],
      status: statuses[(i + 2) % statuses.length],
      targetDate,
      notes: item.notes,
    });
    currentId++;
  }

  // 4. BTS/Personal: 22 Ideas (15%)
  for (let i = 0; i < 22; i++) {
    const item = btsThemes[i % btsThemes.length];
    const id = `IDEA-${String(currentId).padStart(3, "0")}`;
    const dayOffset = (i % 30) + 1;
    const targetDate = `2026-10-${String(dayOffset).padStart(2, "0")}`;

    result.push({
      id,
      title: i < btsThemes.length ? item.title : `${item.title} (Update ${Math.floor(i / btsThemes.length) + 1})`,
      pillar: "BTS/Personal",
      platform: platforms[(i + 3) % platforms.length],
      status: statuses[(i + 3) % statuses.length],
      targetDate,
      notes: item.notes,
    });
    currentId++;
  }

  return result; // Total: 150 ideas
}
