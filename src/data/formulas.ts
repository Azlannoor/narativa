export interface CaptionFormula {
  id: string;
  name: string;
  acronym: string;
  category: string;
  psychology: string;
  steps: string[];
  example: string;
  skeletonTemplate: string;
}

export const SEED_FORMULAS: CaptionFormula[] = [
  {
    id: "FORM-01",
    name: "AIDA",
    acronym: "Attention · Interest · Desire · Action",
    category: "Klasik & Konversi",
    psychology: "Memandu pembaca dari rasa penasaran awal menuju keputusan tindakan melalui tahapan emosional bertahap.",
    steps: [
      "Attention: Hook tajam menghentikan scroll pembaca.",
      "Interest: Fakta menarik atau data yang relevan dengan masalah mereka.",
      "Desire: Gambaran keuntungan nyata setelah solusi diterapkan.",
      "Action: Instruksi tegas apa yang harus dilakukan sekarang.",
    ],
    example:
      "Berhenti menulis CSS manual yang berantakan! 🛑\n\nDalam survei terbaru, developer menghabiskan 40% waktu hanya untuk debugging CSS konflik antar komponen.\n\nBayangkan jika seluruh token warna, tipografi, dan radius kamu terpusat otomatis dalam satu variabel yang rapi dan konsisten.\n\nKlik link di bio untuk mengunduh Design System Starter Kit kami hari ini!",
    skeletonTemplate:
      "[HOOK PERHATIAN TAJAM]\n\n[FAKTA / MASALAH YANG MEMBANGKITKAN MINAT]\n\n[GAMBARAN HASIL IDEAL & KEUNTUNGAN YANG DIINGINKAN]\n\n[AJAKAN BERTINDAK / CTA JELAS]",
  },
  {
    id: "FORM-02",
    name: "PAS",
    acronym: "Problem · Agitate · Solution",
    category: "Masalah & Solusi",
    psychology: "Mengeksplorasi rasa sakit (pain point) audiens secara mendalam sebelum menyajikan obat penawarnya.",
    steps: [
      "Problem: Identifikasi masalah spesifik yang dihadapi audiens.",
      "Agitate: Perjelas konsekuensi buruk jika masalah dibiarkan berlarut-larut.",
      "Solution: Hadirkan solusi konkret yang menyelesaikan masalah secara tuntas.",
    ],
    example:
      "Tampilan web kamu terasa generik dan mirip ribuan template gratis lainnya?\n\nLebih parahnya lagi, calon klien B2B langsung menutup tab karena mengira brand kamu tidak profesional. Kamu kehilangan puluhan juta rupiah potensi transaksi hanya karena UI yang kurang matang.\n\nInilah kenapa kami merilis Aether UI: framework desain dark mode premium dengan standar tipografi ketat untuk mengangkat kredibilitas produkmu.",
    skeletonTemplate:
      "[SEBUTKAN MASALAH SPESIFIK AUDIENS]\n\n[PERJELAS DAMPAK BURUK JIKA MASALAH DIBIARKAN / AGITASI]\n\n[SAJIKAN SOLUSI ANDALAN SECARA KONKRET]",
  },
  {
    id: "FORM-03",
    name: "BAB",
    acronym: "Before · After · Bridge",
    category: "Storytelling & Brand",
    psychology: "Menciptakan kontras ekstrem antara kondisi frustrasi saat ini dan masa depan cerah, lalu menjadi jembatannya.",
    steps: [
      "Before: Kondisi awal yang penuh hambatan.",
      "After: Visi kehidupan atau hasil setelah transformasi tercapai.",
      "Bridge: Metode, produk, atau langkah kerja yang menghubungkan keduanya.",
    ],
    example:
      "Dulu setiap kali sprint frontend dimulai, tim kami berdebat berjam-jam hanya soal padding tombol dan saturasi warna.\n\nSekarang, halaman baru selesai dirilis dalam 2 hari dengan estetika konsisten 100% dan zero dead clicks.\n\nJembatan perubahannya? Kami membakukan Single-Elevation Depth dan rounded-2xl geometry ke dalam design token.",
    skeletonTemplate:
      "[KONDISI AWAL PENUH FRUSTRASI / BEFORE]\n\n[KONDISI MASA DEPAN YANG CERAH / AFTER]\n\n[METODE / JALAN YANG MENGHUBUNGKAN KEDUANYA / BRIDGE]",
  },
  {
    id: "FORM-04",
    name: "4P",
    acronym: "Picture · Promise · Prove · Push",
    category: "Klasik & Konversi",
    psychology: "Membangun imajinasi visual, memberikan janji berani, membuktikannya dengan data, lalu mendorong tindakan.",
    steps: [
      "Picture: Lukiskan gambaran situasi ideal di benak pembaca.",
      "Promise: Berikan janji manfaat terukur.",
      "Prove: Bukti nyata berupa angka, testimoni, atau studi kasus.",
      "Push: Dorong pembaca untuk segera bertindak.",
    ],
    example:
      "Bayangkan membuka dasbor aplikasimu dan melihat navigasi berpindah dalam sekejap tanpa kedipan.\n\nKami berjanji latensi navigasi client-side aplikasimu bisa turun ke bawah 15ms.\n\nBuktinya? Lebih dari 12 project benchmark kami membuktikannya tanpa menambah resource server.\n\nSimpan postingan ini dan mulai terapkan arsitektur layout hari ini!",
    skeletonTemplate:
      "[GAMBARKAN SITUASI IMPIAN AUDIENS / PICTURE]\n\n[BERIKAN JANJI MANFAAT TERUKUR / PROMISE]\n\n[SAJIKAN BUKTI NYATA / PROVE]\n\n[DORONGAN TINDAKAN / PUSH]",
  },
  {
    id: "FORM-05",
    name: "Storytelling Hero's Journey",
    acronym: "Status Quo · Rintangan · Pencerahan · Hasil",
    category: "Storytelling & Brand",
    psychology: "Otak manusia terprogram menyukai narasi perjuangan tokoh utama yang berhasil melewati krisis.",
    steps: [
      "Status Quo: Keadaan normal sebelum masalah muncul.",
      "Rintangan: Titik kritis kegagalan yang hampir membuat menyerah.",
      "Pencerahan: Wawasan berharga yang mengubah perspektif.",
      "Hasil: Pelajaran yang bisa langsung dipetik pembaca.",
    ],
    example:
      "Tiga tahun lalu, klien besar membatalkan kontrak proyek bernilai ratusan juta karena performa web kami lemot.\n\nKami sempat menyalahkan framework dan server. Tapi saat mengaudit ulang DOM, kami menemukan ratusan pill container yang tidak perlu merusak rendering tree.\n\nDari situ kami belajar: keindahan arsitektur lahir dari disiplin eliminasi elemen yang tidak fungsional.",
    skeletonTemplate:
      "[STATUS QUO & LATAR BELAKANG AWAL]\n\n[KRISIS / RINTANGAN BESAR YANG DIHADAPI]\n\n[MOMENTUM PENCERAHAN & PERUBAHAN POLA PIKIR]\n\n[HASIL AKHIR & PESAN MORAL BAGI PEMBACA]",
  },
  {
    id: "FORM-06",
    name: "The Teardown",
    acronym: "Hook · Analisis Cacat · Solusi Alternatif · Catatan Kunci",
    category: "Edukasi & Otoritas",
    psychology: "Menunjukkan otoritas analitis dengan membedah kesalahan teknis secara objektif dan elegan.",
    steps: [
      "Hook: Soroti praktik umum yang keliru.",
      "Analisis Cacat: Jelaskan secara teknis mengapa hal itu buruk.",
      "Solusi Alternatif: Tunjukkan pola desain yang lebih unggul.",
      "Catatan Kunci: Prinsip yang harus diingat selamanya.",
    ],
    example:
      "Banyak yang mengira menambahkan banyak border dan shadow bikin UI kelihatan 'modern'. Faktanya itu justru AI slop.\n\nKetika setiap elemen punya shadow dan border tebal, mata pengguna lelah karena kehilangan hierarki visual.\n\nGantilah dengan whitespace margin 2rem dan hairline border putih 8%. Hasilnya jauh lebih bersih.",
    skeletonTemplate:
      "[BEDAH PRAKTIK UMUM YANG KELIRU]\n\n[PENJELASAN TEKNIS MENGAPA HAL INI MERUGIKAN]\n\n[ALTERNATIF STRUKTUR YANG LEBIH BAIK]\n\n[RANGKUMAN PRINSIP EMAS]",
  },
  {
    id: "FORM-08",
    name: "The Playbook",
    acronym: "Tujuan · Sistem Tahap Demi Tahap · Jebakan · Ringkasan",
    category: "Edukasi & Otoritas",
    psychology: "Audiens menyukai petunjuk teknis yang dapat langsung dieksekusi langkah demi langkah tanpa basa-basi.",
    steps: [
      "Tujuan: Target konkret yang ingin dicapai.",
      "Sistem: Langkah 1, 2, 3 yang teruji.",
      "Jebakan: Hal yang harus dihindari selama proses.",
      "Ringkasan: CTA untuk menyimpan panduan.",
    ],
    example:
      "Playbook 3 Langkah Migrasi ke Tailwind CSS v4:\n\n1. Bersihkan file postcss usang dan ganti dengan @import 'tailwindcss'.\n2. Definisikan token warna dalam direktif @theme.\n3. Ganti arbitrary values dengan variabel modular.\n\nJebakan: Jangan campur format HSL tanpa nilai alpha yang jelas.\n\nBookmark playbook ini sebelum kamu mulai migrasi!",
    skeletonTemplate:
      "[TARGET CONTOH: PLAYBOOK X]\n\n[LANGKAH 1, 2, 3 SISTEMATIS]\n\n[JEBAKAN / PITFALL YANG WAJIB DIHINDARI]\n\n[CTA SIMPAN / BAGIKAN PANDUAN]",
  },
  {
    id: "FORM-09",
    name: "ACCA",
    acronym: "Awareness · Comprehension · Conviction · Action",
    category: "Klasik & Konversi",
    psychology: "Mendidik pemahaman nalar terlebih dahulu sebelum menanamkan keyakinan dan meminta komitmen.",
    steps: [
      "Awareness: Sadarkan audiens akan realitas baru.",
      "Comprehension: Buat mereka memahami sebab-akibatnya.",
      "Conviction: Tanamkan keyakinan bahwa solusi ini adalah pilihan tepat.",
      "Action: Arahan langkah selanjutnya.",
    ],
    example:
      "Tahukah kamu bahwa aturan WCAG AA kini menjadi standar wajib bagi website publik di seluruh dunia?\n\nKontras warna minimal 4.5:1 bukan sekadar preferensi desain, tapi memastikan aksesibilitas bagi jutaan orang.\n\nDengan sistem token kami, rasio kontras sudah tervalidasi 7.4:1 secara otomatis di semua state gelap.\n\nPelajari dokumentasi lengkapnya via tautan di bio.",
    skeletonTemplate:
      "[BANGUN KESADARAN / AWARENESS]\n\n[BERIKAN PEMAHAMAN LOGIS / COMPREHENSION]\n\n[TANCAPKAN KEYAKINAN / CONVICTION]\n\n[ARAHKAN AKSI KONKRET / ACTION]",
  },
];
