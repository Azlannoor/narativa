export interface IdeaItem {
  id: string;
  title: string;
  pillar: "edukasi" | "inspirasi" | "promosi" | "bts_personal";
  formats: ("instagram_reels" | "tiktok" | "facebook_reels" | "facebook_post")[];
  targetAudience: string;
  technicalNote: string;
  isFavorite?: boolean;
}

export interface HookItem {
  id: string;
  category: "kesalahan_fatal" | "kontroversial" | "studi_kasus";
  template: string;
  variables: string[];
  interruptNote: string;
  exampleFilled: string;
  defaultTopic?: string;
  isFavorite?: boolean;
}

export interface CtaItem {
  id: string;
  goal: "save_bookmark" | "dm_lead_gen" | "engagement_share";
  salesStyle: "hard_selling" | "soft_selling" | "storyteller";
  text: string;
  keyword?: string;
  isFavorite?: boolean;
}

export interface FormulaStep {
  key: string;
  label: string;
  guide: string;
  example: string;
}

export interface FormulaItem {
  code: "aida" | "4p" | "acca" | "pas" | "teardown" | "playbook" | "bab" | "heros_journey";
  name: string;
  objective: string;
  steps: FormulaStep[];
}

export interface BrollAssetItem {
  id: string;
  category: "desk_setup" | "coding_terminal" | "creative_flow";
  title: string;
  description: string;
  aspectRatio: string;
  bunnyVideoId: string;
  thumbnailUrl: string;
  durationSec: number;
  isFavorite?: boolean;
}

export interface ScriptItem {
  id: string;
  title: string;
  platform: "instagram_reels" | "tiktok" | "facebook_reels" | "facebook_post";
  pillar: "edukasi" | "inspirasi" | "promosi" | "bts_personal";
  salesStyle: "hard_selling" | "soft_selling" | "storyteller";
  status: "draft" | "final" | "arsip";
  estimatedDurationSec: number;
  wordCount: number;
  hookText: string;
  ctaText: string;
  sectionsCount: number;
  updatedAt: string;
}

// 1. DATA DUMMY IDE (ideas.txt / largeIdeas.txt)
export const DUMMY_IDEAS: IdeaItem[] = [
  {
    id: "idea-1",
    title: "5 Kesalahan Fatal Saat Menyimpan Password di Browser",
    pillar: "edukasi",
    formats: ["instagram_reels", "tiktok", "facebook_reels"],
    targetAudience: "Pengguna internet awam & pekerja remote yang sering login di banyak situs",
    technicalNote: "Tunjukkan contoh pengaturan browser di layar, sertakan langkah perbaikan 30 detik.",
    isFavorite: true,
  },
  {
    id: "idea-2",
    title: "Seharian Ngoding Tanpa Kopi, Apa yang Terjadi?",
    pillar: "bts_personal",
    formats: ["tiktok", "instagram_reels"],
    targetAudience: "Developer pemula dan profesional IT di kota besar",
    technicalNote: "Gunakan pengambilan gambar timelapse meja kerja dan grafik fokus jam kerja.",
    isFavorite: true,
  },
  {
    id: "idea-3",
    title: "Cara Menemukan Ide Konten yang Tidak Pernah Habis Pakai Google Sheet",
    pillar: "edukasi",
    formats: ["instagram_reels", "facebook_post", "tiktok"],
    targetAudience: "Solo creator dan social media specialist pemula",
    technicalNote: "Screen recording formula matriks 4x4 pilar konten di spreadsheet.",
    isFavorite: false,
  },
  {
    id: "idea-4",
    title: "Dari Gaji UMR Menjadi Web Developer Mandiri: 3 Pola yang Saya Ubah",
    pillar: "inspirasi",
    formats: ["instagram_reels", "tiktok", "facebook_post"],
    targetAudience: "Pencari kerja dan switch-career profesional",
    technicalNote: "Cerita naratif bertempo tenang dengan B-roll setup malam hari.",
    isFavorite: true,
  },
  {
    id: "idea-5",
    title: "Flash Sale Template Notion Creator Studio: Hemat 15 Jam Riset per Minggu",
    pillar: "promosi",
    formats: ["tiktok", "instagram_reels"],
    targetAudience: "Kreator konten yang kewalahan mengelola jadwal produksi",
    technicalNote: "Tunjukkan antarmuka sistematis Notion dan kupon diskon batas waktu 24 jam.",
    isFavorite: false,
  },
  {
    id: "idea-6",
    title: "Setup Meja Kerja Minimalis untuk Mencegah Sakit Pinggang Seharian",
    pillar: "bts_personal",
    formats: ["instagram_reels", "tiktok"],
    targetAudience: "Pekerja WFH dan programmer",
    technicalNote: "Sorot tinggi monitor ergonomis dan pengaturan lampu monitor light bar.",
    isFavorite: false,
  },
  {
    id: "idea-7",
    title: "Kenapa Jangan Pernah Pakai Framework Baru Sebelum Paham Dasar Bahasa",
    pillar: "edukasi",
    formats: ["tiktok", "facebook_post", "facebook_reels"],
    targetAudience: "Mahasiswa ilmu komputer dan self-taught coder",
    technicalNote: "Bandingkan debugging vanilla vs abstraksi framework di layar terminal.",
    isFavorite: false,
  },
  {
    id: "idea-8",
    title: "Koleksi 100 Hook Siap Pakai untuk Ningkatin Retensi Video 200%",
    pillar: "promosi",
    formats: ["instagram_reels", "tiktok", "facebook_reels"],
    targetAudience: "Affiliate marketer & video creator TikTok Shop",
    technicalNote: "Buka preview PDF cheatsheet dengan zoom transisi dinamis.",
    isFavorite: true,
  },
];

// 2. DATA DUMMY HOOK (hooks.txt / largeHooks.txt)
export const DUMMY_HOOKS: HookItem[] = [
  {
    id: "hook-1",
    category: "kesalahan_fatal",
    template: "Kamu masih {{kebiasaan}}? Ini alasan akun kamu bisa diretas dalam 5 menit.",
    variables: ["kebiasaan"],
    defaultTopic: "pakai password yang sama di semua browser",
    interruptNote: "Gerakan zoom in cepat ke layar HP + suara jeda statis.",
    exampleFilled: "Kamu masih pakai password yang sama di semua browser? Ini alasan akun kamu bisa diretas dalam 5 menit.",
    isFavorite: true,
  },
  {
    id: "hook-2",
    category: "kontroversial",
    template: "Belajar {{topik}} tanpa {{metode}} itu buang waktu. Setuju atau tidak?",
    variables: ["topik", "metode"],
    defaultTopic: "coding,bootcamp mahal",
    interruptNote: "Tatapan diam tanpa ekspresi ke kamera selama 1.5 detik sebelum bicara.",
    exampleFilled: "Belajar coding tanpa bootcamp mahal itu buang waktu. Setuju atau tidak?",
    isFavorite: true,
  },
  {
    id: "hook-3",
    category: "studi_kasus",
    template: "Klien kami naikkan omzet {{angka}}% hanya dengan mengubah satu baris di {{area}}.",
    variables: ["angka", "area"],
    defaultTopic: "340,halaman checkout",
    interruptNote: "Tampilkan grafik analitik melonjak tajam dalam 1 detik awal.",
    exampleFilled: "Klien kami naikkan omzet 340% hanya dengan mengubah satu baris di halaman checkout.",
    isFavorite: false,
  },
  {
    id: "hook-4",
    category: "kesalahan_fatal",
    template: "Stop lakukan {{tindakan}} ini kalau kamu tidak mau {{konsekuensi_buruk}}!",
    variables: ["tindakan", "konsekuensi_buruk"],
    defaultTopic: "posting video tanpa hook,view video kamu mentok di 200 penonton",
    interruptNote: "Tangan mengetuk layar kamera dengan teks tebal peringatan merah.",
    exampleFilled: "Stop lakukan posting video tanpa hook kalau kamu tidak mau view video kamu mentok di 200 penonton!",
    isFavorite: false,
  },
  {
    id: "hook-5",
    category: "kontroversial",
    template: "Kebanyakan tips {{bidang}} yang beredar di TikTok sebenarnya menyesatkan.",
    variables: ["bidang"],
    defaultTopic: "produktivitas kerja",
    interruptNote: "Tunjukkan tumpukan buku motivasi lalu geser ke samping dengan cepat.",
    exampleFilled: "Kebanyakan tips produktivitas kerja yang beredar di TikTok sebenarnya menyesatkan.",
    isFavorite: true,
  },
  {
    id: "hook-6",
    category: "studi_kasus",
    template: "Bagaimana kreator ini dapat {{pencapaian}} hanya dalam waktu {{durasi}} tanpa iklan berbayar.",
    variables: ["pencapaian", "durasi"],
    defaultTopic: "10.000 followers pertama,21 hari",
    interruptNote: "Tangkapan layar dashboard analitik followers dengan angka disorot warna kuning.",
    exampleFilled: "Bagaimana kreator ini dapat 10.000 followers pertama hanya dalam waktu 21 hari tanpa iklan berbayar.",
    isFavorite: false,
  },
];

// 3. DATA DUMMY CTA (ctas.txt / largeCtas.txt)
export const DUMMY_CTAS: CtaItem[] = [
  {
    id: "cta-1",
    goal: "save_bookmark",
    salesStyle: "soft_selling",
    text: "Simpan dulu postingan ini, kamu pasti butuh saat praktik setup project baru nanti.",
    isFavorite: true,
  },
  {
    id: "cta-2",
    goal: "dm_lead_gen",
    salesStyle: "soft_selling",
    text: "Komen atau DM kata kunci TEMPLATE untuk dapat boilerplate proyek Next.js-nya gratis.",
    keyword: "TEMPLATE",
    isFavorite: true,
  },
  {
    id: "cta-3",
    goal: "dm_lead_gen",
    salesStyle: "hard_selling",
    text: "Ketik kata kunci DISKON di komentar sekarang untuk klaim voucher potongan 50%.",
    keyword: "DISKON",
    isFavorite: false,
  },
  {
    id: "cta-4",
    goal: "engagement_share",
    salesStyle: "soft_selling",
    text: "Tim kamu lebih suka Tailwind atau CSS biasa? Adu argumen di kolom komentar, lalu bagikan ke grup tim!",
    isFavorite: true,
  },
  {
    id: "cta-5",
    goal: "save_bookmark",
    salesStyle: "hard_selling",
    text: "Bookmark sekarang juga sebelum promo pendaftaran ditutup malam ini!",
    isFavorite: false,
  },
  {
    id: "cta-6",
    goal: "engagement_share",
    salesStyle: "storyteller",
    text: "Pernah berada di posisi yang sama saat mulai merintis? Ceritakan pengalaman kamu di komentar.",
    isFavorite: true,
  },
  {
    id: "cta-7",
    goal: "save_bookmark",
    salesStyle: "storyteller",
    text: "Simpan cerita ini sebagai pengingat saat kamu merasa lelah menghadapi proses belajar.",
    isFavorite: false,
  },
];

// 4. DATA DUMMY FORMULA (formulas.txt)
export const DUMMY_FORMULAS: FormulaItem[] = [
  {
    code: "aida",
    name: "AIDA (Attention, Interest, Desire, Action)",
    objective: "Untuk konten berorientasi edukasi mendalam menuju konversi dan retensi tinggi.",
    steps: [
      {
        key: "attention",
        label: "Attention (0–3 detik)",
        guide: "Tarik atensi penuh penonton dengan hook tajam atau masalah mendesak.",
        example: "Kamu masih simpan password penting langsung di autocomplete browser?",
      },
      {
        key: "interest",
        label: "Interest (4–15 detik)",
        guide: "Kembangkan rasa ingin tahu dengan membedah akar masalah secara mengejutkan.",
        example: "Banyak ekstensi mencurigakan yang diam-diam mengekstrak data kredensial tanpa izin.",
      },
      {
        key: "desire",
        label: "Desire (16–35 detik)",
        guide: "Tunjukkan transformasi solusi atau betapa mudahnya cara menyelesaikan masalah.",
        example: "Dengan mengaktifkan Master Password atau password manager opensource, data kamu aman 100%.",
      },
      {
        key: "action",
        label: "Action (36–45 detik)",
        guide: "Instruksikan satu tindakan jelas tanpa ambiguitas (CTA spesifik).",
        example: "Simpan video ini sekarang agar kamu ingat langkah proteksinya saat setup laptop!",
      },
    ],
  },
  {
    code: "pas",
    name: "PAS (Problem, Agitate, Solution)",
    objective: "Untuk pembahasan masalah teknis spesifik, studi kasus tajam, dan membangun otoritas.",
    steps: [
      {
        key: "problem",
        label: "Problem (Masalah)",
        guide: "Sebutkan pain-point spesifik yang paling sering dialami audiens sasaran.",
        example: "Sudah belajar coding berbulan-bulan tapi tetap macet saat disuruh buat proyek mandiri?",
      },
      {
        key: "agitate",
        label: "Agitate (Pertegas Dampak)",
        guide: "Jelaskan konsekuensi buruk jika masalah ini terus diabaikan (buang waktu, stres, tertinggal).",
        example: "Kalau kamu terjebak di tutorial hell terus, kamu tidak akan pernah siap menghadapi tes teknis kerja.",
      },
      {
        key: "solution",
        label: "Solution (Solusi & Aksi)",
        guide: "Berikan satu framework langkah nyata yang membongkar kebuntuan tersebut.",
        example: "Mulai teknik build-in-public: buat 1 fitur kecil setiap hari tanpa menonton video panduan.",
      },
    ],
  },
  {
    code: "bab",
    name: "BAB (Before, After, Bridge)",
    objective: "Untuk narasi transformasi, refleksi personal, dan studi kasus sebelum-sesudah.",
    steps: [
      {
        key: "before",
        label: "Before (Kondisi Awal)",
        guide: "Gambarkan situasi sulit, frustrasi, atau keterbatasan sebelum menemukan formula baru.",
        example: "Tahun lalu saya butuh 4 jam hanya untuk merangkai satu skrip video Reels yang kaku.",
      },
      {
        key: "after",
        label: "After (Kondisi Ideal)",
        guide: "Tunjukkan pencapaian nyata saat ini yang membuat proses jauh lebih efisien.",
        example: "Sekarang 3 video siap rekam bisa saya selesaikan dalam waktu kurang dari 30 menit.",
      },
      {
        key: "bridge",
        label: "Bridge (Jembatan Solusi)",
        guide: "Ungkap metode rahasia atau sistem modular yang menjadi jembatan transformasi.",
        example: "Kuncinya ada di 5 modul template: ide pilar, hook interupsi, dan panduan B-roll.",
      },
    ],
  },
  {
    code: "heros_journey",
    name: "Hero's Journey (Perjalanan Pahlawan)",
    objective: "Untuk konten storytelling mendalam, personal branding, dan membangun keterikatan emosional.",
    steps: [
      {
        key: "character",
        label: "1. Karakter & Status Quo",
        guide: "Perkenalkan latar belakang yang membumi dan dapat dirasakan oleh audiens.",
        example: "Saya memulai karier dari nol tanpa latar belakang IT di kamar kos sempit.",
      },
      {
        key: "conflict",
        label: "2. Konflik & Rintangan",
        guide: "Ceritakan titik kegagalan terbesar yang hampir membuat Anda menyerah.",
        example: "Dua proyek pertama saya ditolak klien dan tabungan saya menipis hingga batas kritis.",
      },
      {
        key: "climax",
        label: "3. Titik Balik (Klimaks)",
        guide: "Momen pencerahan di mana Anda mengubah strategi atau menemukan mentor.",
        example: "Saat saya berhenti mengejar kesempurnaan dan mulai merilis karya nyata setiap minggu.",
      },
      {
        key: "resolution",
        label: "4. Kesimpulan & Nilai",
        guide: "Pelajaran berharga yang dapat dipetik oleh siapa pun yang sedang berjuang.",
        example: "Konsistensi kecil yang tidak terlihat selalu mengalahkan bakat yang tidak diasah.",
      },
    ],
  },
  {
    code: "4p",
    name: "4P (Picture, Promise, Prove, Push)",
    objective: "Untuk penawaran edukasi berorientasi bukti sosial dan dorongan tindakan.",
    steps: [
      {
        key: "picture",
        label: "Picture (Gambaran)",
        guide: "Ajak audiens membayangkan kondisi ideal jika pekerjaan mereka selesai otomatis.",
        example: "Bayangkan kamu bisa punya bank konten 30 hari tanpa pusing mikir ide tiap malam.",
      },
      {
        key: "promise",
        label: "Promise (Janji Nilai)",
        guide: "Janjikan solusi konkret yang realistis.",
        example: "Dengan sistem batch scripting 5 langkah ini, kamu hanya butuh 1 sesi weekend.",
      },
      {
        key: "prove",
        label: "Prove (Bukti)",
        guide: "Sajikan data atau contoh nyata yang sudah terbukti.",
        example: "Lebih dari 40 kreator telah menerapkan metode ini dan menaikkan konsistensi posting 3x.",
      },
      {
        key: "push",
        label: "Push (Dorongan)",
        guide: "Berikan dorongan penutup untuk segera bertindak.",
        example: "Cek link panduannya di bio dan terapkan di sesi rekaman kamu besok!",
      },
    ],
  },
  {
    code: "acca",
    name: "ACCA (Awareness, Comprehension, Conviction, Action)",
    objective: "Untuk materi edukasi teknis bertingkat yang membutuhkan pemahaman mendalam.",
    steps: [
      {
        key: "awareness",
        label: "Awareness (Sadar Masalah)",
        guide: "Tunjukkan bahwa ada celah yang sering diabaikan.",
        example: "Sadarkah kamu kalau 80% audiens keluar di 3 detik pertama bukan karena isi videomu buruk?",
      },
      {
        key: "comprehension",
        label: "Comprehension (Paham Sebab)",
        guide: "Jelaskan alasan ilmiah atau psikologis di balik fenomena tersebut.",
        example: "Otak manusia membutuhkan pattern interrupt visual agar menghentikan scroll refleks.",
      },
      {
        key: "conviction",
        label: "Conviction (Yakin Perlu Solusi)",
        guide: "Tanamkan keyakinan bahwa solusi ini mutlak diperlukan.",
        example: "Tanpa hook pembuka yang terencana, konten terbaikmu tidak akan pernah sempat didengar.",
      },
      {
        key: "action",
        label: "Action (Langkah Konkret)",
        guide: "Arahkan pada aksi sederhana.",
        example: "Gunakan 3 template hook kesalahan fatal ini untuk video kamu selanjutnya.",
      },
    ],
  },
  {
    code: "teardown",
    name: "The Teardown (Bedah Kasus Teknis)",
    objective: "Menganalisis sistem atau konten orang lain untuk membuktikan keahlian teknis Anda.",
    steps: [
      {
        key: "hook_teardown",
        label: "1. Subjek yang Dibedah",
        guide: "Sebutkan studi kasus atau brand populer yang akan dibongkar.",
        example: "Mari kita bedah kenapa video edukasi kreator ini bisa konsisten dapat 500k views.",
      },
      {
        key: "anatomy",
        label: "2. Anatomi & Komponen",
        guide: "Bongkar per bagian apa saja elemen yang membuatnya bekerja.",
        example: "Perhatikan transisi 2 detik pertama: dia memotong jeda nafas dan memasang teks tebal warna kuning.",
      },
      {
        key: "takeaway",
        label: "3. Pola yang Bisa Ditiru",
        guide: "Berikan formula siap pakai yang bisa ditiru oleh audiens.",
        example: "Formula ini disebut 3-second pacing. Terapkan pada video kamu dengan membuang intro basa-basi.",
      },
    ],
  },
  {
    code: "playbook",
    name: "The Playbook (Panduan Langkah demi Langkah)",
    objective: "Memberikan SOP atau checklist aksi yang bernilai retensi simpan sangat tinggi.",
    steps: [
      {
        key: "goal",
        label: "1. Target Akhir Playbook",
        guide: "Sebutkan tujuan akhir yang akan dicapai secara spesifik.",
        example: "Playbook lengkap setup git workflow untuk tim solo developer.",
      },
      {
        key: "step_by_step",
        label: "2. Langkah 1 sampai 3",
        guide: "Rincikan langkah secara padat dan berurutan.",
        example: "Langkah 1: buat protected branch di GitHub. Langkah 2: pasang linter husky. Langkah 3: aktifkan CI action.",
      },
      {
        key: "summary",
        label: "3. Catatan Penerapan",
        guide: "Berikan tips penting untuk menghindari kegagalan implementasi.",
        example: "Jangan pernah bypass rules walau sedang memperbaiki hotfix mendesak.",
      },
    ],
  },
];

// 5. DATA DUMMY B-ROLL 9:16 (largeBroll.txt / Bunny Stream)
export const DUMMY_BROLLS: BrollAssetItem[] = [
  {
    id: "broll-1",
    category: "desk_setup",
    title: "Mengetik di Keyboard Mekanikal RGB Ungu",
    description: "Tangan mengetik cepat di keyboard kustom, lampu ambience ungu lembut, latar meja kayu rapi.",
    aspectRatio: "9:16",
    bunnyVideoId: "broll-bunny-001",
    thumbnailUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=720&q=80",
    durationSec: 6,
    isFavorite: true,
  },
  {
    id: "broll-2",
    category: "coding_terminal",
    title: "Terminal Mac Berjalan Scanning Skrip",
    description: "Layar terminal hitam dengan baris kode hijau dan teks build melesat cepat, sudut pandang dekat.",
    aspectRatio: "9:16",
    bunnyVideoId: "broll-bunny-002",
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=720&q=80",
    durationSec: 8,
    isFavorite: true,
  },
  {
    id: "broll-3",
    category: "creative_flow",
    title: "Membuat Catatan di iPad dengan Stylus",
    description: "Tangan menggambar diagram alur konten dan mind map di tablet dengan gerakan lincah.",
    aspectRatio: "9:16",
    bunnyVideoId: "broll-bunny-003",
    thumbnailUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=720&q=80",
    durationSec: 5,
    isFavorite: false,
  },
  {
    id: "broll-4",
    category: "desk_setup",
    title: "Menyeduh Kopi Panas Sebelum Sesi Ngoding",
    description: "Uap kopi mengepul dari cangkir keramik hitam di samping laptop tipis dan buku catatan.",
    aspectRatio: "9:16",
    bunnyVideoId: "broll-bunny-004",
    thumbnailUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=720&q=80",
    durationSec: 4,
    isFavorite: false,
  },
  {
    id: "broll-5",
    category: "coding_terminal",
    title: "Scrolling Kode di Visual Studio Code Gelap",
    description: "Guliran cepat baris fungsi TypeScript dengan syntax highlighting warna-warni modern.",
    aspectRatio: "9:16",
    bunnyVideoId: "broll-bunny-005",
    thumbnailUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=720&q=80",
    durationSec: 7,
    isFavorite: true,
  },
  {
    id: "broll-6",
    category: "creative_flow",
    title: "Menempel Sticky Notes di Papan Ide Kaca",
    description: "Tangan menempelkan memo warna oranye dan hijau di kaca, menyusun roadmap video seminggu.",
    aspectRatio: "9:16",
    bunnyVideoId: "broll-bunny-006",
    thumbnailUrl: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=720&q=80",
    durationSec: 6,
    isFavorite: false,
  },
];

// 6. DATA SKRIP TERBARU UNTUK DASHBOARD KREATOR (Bersih/Kosong)
export const DUMMY_RECENT_SCRIPTS: ScriptItem[] = [];
