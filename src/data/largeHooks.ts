export interface RawHookEntity {
  id: string;
  template: string;
  category: string;
  placeholders: string[];
  example: string;
  engagementScore: number;
}

const HOOK_ARCHETYPES = [
  // 1. Kesalahan Fatal
  {
    category: "Kesalahan Fatal",
    templates: [
      "[Angka] Kesalahan fatal saat [Aktivitas] yang membuat [Masalah].",
      "Jangan pernah [Aktivitas] sebelum kamu membaca [Objek] ini!",
      "3 Tanda peringatan merah bahwa [Sistem] kamu sudah di ambang kehancuran.",
      "Gaji [Jumlah] tidak akan ada artinya kalau kamu masih [Kesalahan].",
      "Kesalahan nomor 1 yang dilakukan pemula saat [Aktivitas]:",
      "[Angka] Kebiasaan buruk [Profesi] yang merusak [Hasil].",
      "Stop melakukan [Aktivitas] seperti ini jika kamu tidak ingin [Konsekuensi Buruk].",
    ],
    placeholders: ["[Angka]", "[Aktivitas]", "[Masalah]", "[Objek]", "[Sistem]", "[Jumlah]", "[Kesalahan]", "[Profesi]", "[Hasil]", "[Konsekuensi Buruk]"],
    examples: [
      "5 Kesalahan fatal saat setup Tailwind v4 yang membuat bundle membengkak.",
      "Jangan pernah deploy skema database production sebelum kamu membaca checklist ini!",
      "3 Tanda peringatan merah bahwa arsitektur CSS kamu sudah di ambang kehancuran.",
      "Senior engineer tidak akan respect kalau codebase kamu masih minim type safety.",
      "Kesalahan nomor 1 yang dilakukan pemula saat belajar Next.js 15: over-fetching data.",
      "7 Kebiasaan buruk developer yang merusak latensi aplikasi mobile.",
      "Stop menulis inline style seperti ini jika kamu tidak ingin performa render drop.",
    ],
  },
  // 2. Kontroversial & Unpopular Opinion
  {
    category: "Kontroversial",
    templates: [
      "Hentikan [Aktivitas Umum]. Ini cara [Hasil Impian] dalam [Waktu].",
      "Mayoritas [Profesi/Audiens] salah paham soal [Topik]. Ini faktanya:",
      "Kenapa [Alat Populer] bukan solusi untuk [Tujuan]? Ini alternatifnya:",
      "Unpopular opinion: [Metode Populer] sebenarnya memperlambat tim kamu.",
      "Kenapa desainer berpengalaman menolak menggunakan [Elemen Desain]?",
      "Alasan mengejutkan kenapa [Kelemahan] justru jadi kunci [Kesuksesan].",
      "Banyak yang mengira [Pilihan A] lebih baik dari [Pilihan B]. Mereka salah besar.",
    ],
    placeholders: ["[Aktivitas Umum]", "[Hasil Impian]", "[Waktu]", "[Profesi/Audiens]", "[Topik]", "[Alat Populer]", "[Tujuan]", "[Metode Populer]", "[Elemen Desain]", "[Kelemahan]", "[Kesuksesan]", "[Pilihan A]", "[Pilihan B]"],
    examples: [
      "Hentikan menulis CSS manual. Ini cara merakit design system dalam 3 hari.",
      "Mayoritas Frontend Engineer salah paham soal Server Actions di Next.js 15.",
      "Kenapa sekadar copy-paste UI kit bukan solusi untuk branding otentik?",
      "Unpopular opinion: Microservices untuk startup tahap awal adalah buang waktu.",
      "Kenapa desainer berpengalaman menolak badge warna-warni berlebihan di tabel?",
      "Alasan mengejutkan kenapa zero-pill discipline justru jadi kunci tampilan web berkelas.",
      "Banyak yang mengira dark mode murni #000000 ramah mata. Faktanya itu bikin cepat lelah.",
    ],
  },
  // 3. Studi Kasus & Angka Riil
  {
    category: "Studi Kasus",
    templates: [
      "Bagaimana kami mengubah [Kondisi Awal] menjadi [Hasil Luar Biasa] tanpa [Hambatan].",
      "Bongkar kode: Bagaimana [Produk Terkenal] merancang [Fitur Utama].",
      "Framework [Nama Framework] ini menghemat [Waktu] waktu kerja tim saya.",
      "Hal paling krusial yang dipelajari tim kami setelah menangani [Skala Data].",
      "Eksperimen 30 hari: Kami menghapus [Fitur] dan inilah dampaknya:",
      "Satu aturan sederhana yang menyelamatkan proyek kami dari [Bencana].",
      "Bedah arsitektur: Cara [Brand] memproses [Volume] dalam hitungan milidetik.",
    ],
    placeholders: ["[Kondisi Awal]", "[Hasil Luar Biasa]", "[Hambatan]", "[Produk Terkenal]", "[Fitur Utama]", "[Nama Framework]", "[Waktu]", "[Skala Data]", "[Fitur]", "[Bencana]", "[Brand]", "[Volume]"],
    examples: [
      "Bagaimana kami mengubah latensi navigasi jadi <15ms tanpa menambah server mahal.",
      "Bongkar kode: Bagaimana Stripe merancang sistem checkout tanpa error.",
      "Framework component tokens ini menghemat 20 jam kerja tim tiap sprint.",
      "Hal paling krusial yang dipelajari tim kami setelah menangani 1 juta request harian.",
      "Eksperimen 30 hari: Kami menghapus animasi layout berat dan inilah kenaikan konversinya.",
      "Satu aturan sederhana yang menyelamatkan proyek kami dari regresi layout CSS.",
      "Bedah arsitektur: Cara Linear memproses perubahan state dalam 12 milidetik.",
    ],
  },
  // 4. Daftar & Tips Praktis
  {
    category: "Daftar & Tips",
    templates: [
      "[Angka] Toolkit rahasia yang saya pakai untuk [Mencapai Hasil] setiap hari.",
      "Rumus 1 baris untuk [Masalah Sulit] yang jarang dibocorkan senior:",
      "Trik psikologi visual di balik desain [Brand Besar] yang bisa kamu tiru gratis.",
      "Jika kamu hanya punya [Waktu] sehari, lakukan [Aktivitas] ini untuk [Hasil].",
      "Panduan lengkap [Topik] dari nol sampai paham dalam [Jumlah Slide] slide.",
      "Simpan ini sekarang! Cheat sheet lengkap untuk menguasai [Topik Teknis].",
      "[Angka] Resource gratis berkualitas tinggi untuk belajar [Keahlian].",
    ],
    placeholders: ["[Angka]", "[Mencapai Hasil]", "[Masalah Sulit]", "[Brand Besar]", "[Waktu]", "[Aktivitas]", "[Hasil]", "[Topik]", "[Jumlah Slide]", "[Topik Teknis]", "[Keahlian]"],
    examples: [
      "7 Toolkit rahasia yang saya pakai untuk mendesain UI berstandar Silicon Valley.",
      "Rumus 1 baris untuk handling token dark mode yang jarang dibocorkan senior.",
      "Trik psikologi visual di balik desain Apple yang bisa kamu tiru gratis.",
      "Jika kamu hanya punya 15 menit sehari, lakukan audit WCAG AA ini untuk UX sempurna.",
      "Panduan lengkap Tailwind v4 @theme dari nol sampai paham dalam 6 slide.",
      "Simpan ini sekarang! Cheat sheet lengkap untuk menguasai Glassmorphism & Radius Math.",
      "5 Resource gratis berkualitas tinggi untuk belajar arsitektur distributed systems.",
    ],
  },
  // 5. Pertanyaan Provokatif
  {
    category: "Pertanyaan",
    templates: [
      "Kenapa [Metode Populer] sudah usang di tahun 2026? Simak alasannya:",
      "Apakah kamu masih melakukan [Kebiasaan Buruk]? Ini risikonya bagi [Subjek].",
      "Tes mandiri: Apakah [Produk/Skill] kamu sudah siap untuk tahun 2026?",
      "Pernahkah kamu merasa [Perasaan Buruk] saat [Aktivitas Kerja]?",
      "Kenapa produk dengan fitur lebih sedikit justru bisa [Hasil Lebih Baik]?",
      "Berapa jam waktu tim kamu terbuang tiap minggu hanya untuk [Masalah Operasional]?",
      "Apakah kamu tahu perbedaan mendasar antara [Konsep A] dan [Konsep B]?",
    ],
    placeholders: ["[Metode Populer]", "[Kebiasaan Buruk]", "[Subjek]", "[Produk/Skill]", "[Perasaan Buruk]", "[Aktivitas Kerja]", "[Hasil Lebih Baik]", "[Masalah Operasional]", "[Konsep A]", "[Konsep B]"],
    examples: [
      "Kenapa layout card-within-cards sudah usang di tahun 2026? Simak alasannya:",
      "Apakah kamu masih menggunakan inline styles? Ini risikonya bagi performa render.",
      "Tes mandiri: Apakah arsitektur frontend web kamu sudah siap untuk tahun 2026?",
      "Pernahkah kamu merasa buntu saat merapikan CSS warisan 3 tahun lalu?",
      "Kenapa produk dengan fitur lebih sedikit justru bisa mendapatkan adopsi pengguna 3x lipat?",
      "Berapa jam waktu tim kamu terbuang tiap minggu hanya untuk debugging CSS konflik?",
      "Apakah kamu tahu perbedaan mendasar antara CSS variable dan preprocessor mixin?",
    ],
  },
  // 6. Transformasi & Cerita
  {
    category: "Transformasi",
    templates: [
      "Dari [Titik Terendah] ke [Pencapaian Besar]: [Angka] pelajaran mahal yang saya dapatkan.",
      "90% [Target Audiens] menyerah di [Tahap]. Begini cara melewatinya:",
      "Transformasi [Nama Proyek]: Dari tampilan kuno ke standar Silicon Valley.",
      "Bagaimana cara seorang [Profesi] berpikir ketika melihat [Tantangan].",
      "Dulu saya selalu bingung [Tantangan Awal], sampai saya menemukan [Kunci Solusi].",
      "Perjalanan 6 bulan membangun [Produk] dari nol tanpa suntikan modal luar.",
      "Bagaimana mengubah kritik pedas pengguna menjadi [Kemenangan Produk].",
    ],
    placeholders: ["[Titik Terendah]", "[Pencapaian Besar]", "[Angka]", "[Target Audiens]", "[Tahap]", "[Nama Proyek]", "[Profesi]", "[Tantangan]", "[Tantangan Awal]", "[Kunci Solusi]", "[Produk]", "[Kemenangan Produk]"],
    examples: [
      "Dari nol pemahaman state management ke 100k active users: 5 pelajaran mahal.",
      "90% junior developer menyerah di konsep arsitektur monorepo. Ini cara melewatinya.",
      "Transformasi Dasbor SaaS: Dari tampilan kuno ke standar Silicon Valley.",
      "Bagaimana cara seorang Principal Engineer berpikir saat merancang scalable design tokens.",
      "Dulu saya selalu bingung mengatasi border radius bertumpuk, sampai saya menemukan matematika radius.",
      "Perjalanan 6 bulan membangun micro-SaaS dari nol tanpa modal investor.",
      "Bagaimana mengubah komplain latency 2 detik menjadi performa sub-15ms.",
    ],
  },
  // 7. Urgensi & Peringatan
  {
    category: "Urgensi & Peringatan",
    templates: [
      "Sebelum kamu merilis [Fitur/Produk], pastikan sudah lolos [Daftar Uji] ini!",
      "Jangan lakukan [Tindakan Umum] ini sebelum terlambat bagi [Subjek].",
      "Waktu terus berjalan: [Angka] hal yang wajib kamu benahi di [Sistem] sekarang juga.",
      "Peringatan untuk semua [Profesi]: Tren [Teknologi Baru] akan mengubah caramu bekerja.",
      "Jika aplikasimu belum menerapkan [Standar], bersiaplah kehilangan [Aset Berharga].",
      "Ini alasan kenapa kamu harus segera menghapus [Ketergantungan Usang] dari proyekmu.",
    ],
    placeholders: ["[Fitur/Produk]", "[Daftar Uji]", "[Tindakan Umum]", "[Subjek]", "[Angka]", "[Sistem]", "[Profesi]", "[Teknologi Baru]", "[Standar]", "[Aset Berharga]", "[Ketergantungan Usang]"],
    examples: [
      "Sebelum kamu merilis produk ke publik, pastikan sudah lolos audit aksesibilitas ini!",
      "Jangan abaikan warning memori bocor ini sebelum server production kamu crash.",
      "Waktu terus berjalan: 4 hal yang wajib kamu benahi di database schema sekarang juga.",
      "Peringatan untuk semua frontend dev: AI-assisted coding akan mengubah ekspektasi kecepatan rilis.",
      "Jika aplikasimu belum menerapkan responsif mobile <44px target sentuh, kamu kehilangan konversi.",
      "Ini alasan kenapa kamu harus segera menghapus pustaka styling usang dari package.json.",
    ],
  },
  // 8. Storytelling & Refleksi
  {
    category: "Storytelling",
    templates: [
      "Tiga tahun lalu, sebuah [Kesalahan Kritis] hampir membuat karier saya berakhir.",
      "Momen 'Aha!' yang mengubah cara tim kami memandang [Konsep Desain].",
      "Sebuah percakapan singkat dengan [Sosok Mentor] yang membakar semangat saya.",
      "Apa yang tidak pernah diceritakan orang saat merintis [Karier/Proyek].",
      "Pelajaran paling menyakitkan yang saya dapatkan dari [Kegagalan Lalu].",
      "Di balik layar sebuah rilis: Mengapa kami memutuskan menunda peluncuran demi [Prinsip].",
    ],
    placeholders: ["[Kesalahan Kritis]", "[Konsep Desain]", "[Sosok Mentor]", "[Karier/Proyek]", "[Kegagalan Lalu]", "[Prinsip]"],
    examples: [
      "Tiga tahun lalu, salah konfigurasi branch repository hampir menghapus data penting tim.",
      "Momen 'Aha!' yang mengubah cara tim kami memandang Single-Elevation Depth.",
      "Sebuah percakapan singkat dengan Staff Engineer Google yang membuka mata saya.",
      "Apa yang tidak pernah diceritakan orang saat pertama kali memimpin tim engineering.",
      "Pelajaran paling menyakitkan yang saya dapatkan saat mengabaikan masukan user testing.",
      "Di balik layar rilis v1.0: Mengapa kami menunda peluncuran demi kesempurnaan aksesibilitas.",
    ],
  },
];

export function generate700Hooks(): RawHookEntity[] {
  const result: RawHookEntity[] = [];
  let currentId = 1;

  const flattened: {
    category: string;
    template: string;
    placeholders: string[];
    example: string;
  }[] = [];

  HOOK_ARCHETYPES.forEach((arch) => {
    arch.templates.forEach((tmpl, i) => {
      flattened.push({
        category: arch.category,
        template: tmpl,
        placeholders: arch.placeholders.slice(0, 3),
        example: arch.examples[i % arch.examples.length],
      });
    });
  });

  const domains = [
    "Next.js 15 & React 19",
    "Tailwind CSS v4",
    "Design System & Tokens",
    "Micro-Animations Framer",
    "Accessibility WCAG AA",
    "Database IndexedDB Dexie",
    "Zustand State Management",
    "Performance Optimization",
    "Clean Architecture",
    "Copywriting & Psychology",
    "SaaS Pricing Strategy",
    "Developer Productivity",
    "Personal Branding Engineer",
    "Client Communication",
  ];

  while (result.length < 700) {
    const arch = flattened[result.length % flattened.length];
    const domain = domains[Math.floor(result.length / flattened.length) % domains.length];
    const score = 85 + (result.length % 15);

    const idNumber = String(currentId).padStart(3, "0");
    const id = `HK-${idNumber}`;

    let exampleText = arch.example;
    if (result.length >= flattened.length) {
      exampleText = `${arch.example} [Fokus: ${domain}]`;
    }

    result.push({
      id,
      template: arch.template,
      category: arch.category,
      placeholders: arch.placeholders,
      example: exampleText,
      engagementScore: score,
    });

    currentId++;
  }

  return result; // Exactly 700 hooks
}
