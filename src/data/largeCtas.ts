export interface RawCtaEntity {
  id: string;
  text: string;
  objective: string;
  recommendedFormat?: string;
  intentLevel?: string;
  description?: string;
}

const CTA_TEMPLATES = [
  // 1. Engagement (Comments / Discussions / Opinions)
  {
    objective: "Engagement",
    intentLevel: "Sedang",
    recommendedFormat: "Single Post / Thread",
    texts: [
      "Menurutmu, metode mana yang paling relevan untuk timmu: Opsi A atau Opsi B? Tulis di komentar!",
      "Bagikan opini jujurmu: apakah kamu tim Tailwind CSS v4 atau CSS Modules? Mengapa?",
      "Ketik angka '1' jika kamu setuju, atau ketik '2' jika kamu punya pendekatan arsitektur berbeda.",
      "Coba terapkan trik ini hari ini, lalu ceritakan hasil benchmark-nya di kolom komentar!",
      "Apa tantangan terbesar yang sedang kamu hadapi saat merapikan UI aplikasimu? Tulis di bawah!",
      "Setuju atau tidak dengan aturan Zero-Pill Discipline? Tulis sudut pandangmu sekarang.",
      "Komentari kata 'SETUJU' jika kamu juga merasa hierarki tipografi lebih penting dari sekadar warna.",
      "Pernahkah kamu mengalami bug serupa saat setup database? Ceritakan pengalamanmu di bawah.",
      "Dari 3 formula di atas, mana yang paling ingin kamu terapkan pada sprint minggu depan?",
      "Tulis pendapatmu: apakah layout cards-within-cards masih relevan di tahun 2026?",
    ],
    description: "Memancing debat berbobot, jajak pendapat biner, dan diskusi komunitas yang sehat.",
  },
  // 2. Save & Bookmark (Utility / Cheat Sheet / High Retention)
  {
    objective: "Save & Bookmark",
    intentLevel: "Tinggi",
    recommendedFormat: "Infografis / Carousel",
    texts: [
      "Simpan (Bookmark) postingan ini sekarang agar kamu tidak bingung saat butuh implementasi nanti.",
      "Screenshot slide ringkasan ini dan simpan di folder referensi desain kamu!",
      "Simpan pedoman ini sebagai panduan cepat saat melakukan Code Review sprint frontend.",
      "Tekan tombol Bookmark di pojok kanan bawah agar materi berharga ini mudah kamu temukan lagi.",
      "Simpan cheat sheet rumus token CSS ini untuk menghindari regresi visual saat refactoring.",
      "Jangan sampai lupa! Simpan panduan langkah demi langkah ini sebelum kamu memulai proyek baru.",
      "Tekan simpan sekarang agar panduan aksesibilitas WCAG AA ini siap pakai saat audit tim.",
      "Simpan panduan ini agar kamu punya argumen kuat saat diskusi design review dengan desainer.",
      "Bookmark rangkuman formula ini sekarang: kamu akan sangat membutuhkannya minggu depan.",
      "Simpan sekarang juga! 5 Menit membaca ini akan menghemat 20 jam kerja tim kamu tiap bulan.",
    ],
    description: "Mendorong tombol simpan/bookmark yang memberikan skor tertinggi pada algoritma rekomendasi.",
  },
  // 3. DM Lead Gen (Inbound Marketing / Freebie / Keyword Trigger)
  {
    objective: "DM Lead Gen",
    intentLevel: "Tinggi",
    recommendedFormat: "Carousel / Reels",
    texts: [
      "Tulis 'TEMPLAT' di kolom komentar, dan saya akan kirimkan file boilerplate langsung ke DM kamu!",
      "Ketik 'TOKEN' di komentar, nanti bot otomatis akan mengirimkan link Google Drive aset ke inbox.",
      "Kirim pesan DM dengan kata 'AUDIT' untuk mendapatkan evaluasi UI/UX aplikasi kamu secara gratis.",
      "DM saya kata 'PANDUAN' untuk menerima link file PDF checklist lengkap tanpa biaya.",
      "Ketik 'PROMPT' di komentar, saya bagikan 12 mega prompt AI untuk riset strategi konten harian.",
      "Ketik 'BOILERPLATE' di bawah dan cek inbox kamu dalam 1 menit ke depan untuk link GitHub.",
      "Tertarik mencoba starter kit ini? Kirim DM 'COBA' sekarang untuk mendapatkan link akses privat.",
      "Ketik 'KONSULTASI' jika tim kamu butuh pendampingan arsitektur design system bulan ini.",
      "DM saya dengan kata 'SLIDE' untuk mendapatkan file mentah template Canva siap pakai.",
      "Ketik 'CHECKLIST' di bawah, saya kirimkan daftar verifikasi sebelum production langsung ke DM.",
    ],
    description: "Memicu alur otomasi pesan masuk (DM lead generation) untuk konversi audiens menjadi prospek.",
  },
  // 4. Klik Link (Traffic Outbound / Bio Link / Newsletter)
  {
    objective: "Klik Link",
    intentLevel: "Tinggi",
    recommendedFormat: "Bio / Stories / X Post",
    texts: [
      "Klik tautan di bio untuk membaca dokumentasi arsitektur lengkap dan unduh aset starter kit.",
      "Dapatkan akses gratis ke 30+ komponen UI premium melalui link di bio profil kami.",
      "Gabung dengan 5.000+ developer lainnya di newsletter mingguan kami melalui tautan di profil.",
      "Kunjungi repositori terbuka kami di GitHub melalui tautan bio dan berikan Star jika bermanfaat!",
      "Ingin mempercepat workflow pengembanganmu? Pelajari studi kasus lengkapnya via link di bio.",
      "Klik link bio untuk mengunduh e-book strategi alokasi 4 pilar konten 100% hari ini.",
      "Jadwalkan sesi audit teknis 30 menit bersama Tech Lead kami melalui link kalender di bio.",
      "Baca artikel teardown versi panjang di blog kami melalui link yang tertera di bio.",
      "Daftar sesi webinar live kupas tuntas Tailwind v4 dan Next.js 15 gratis via link bio.",
      "Akses simulator kalkulator alokasi pilar interaktif melalui tautan di profil sekarang.",
    ],
    description: "Mengarahkan traffic qualified ke landing page eksternal, bio link, repositori, atau newsletter.",
  },
  // 5. Share Viral (Network Effect / Word-of-Mouth / Team Sharing)
  {
    objective: "Share Viral",
    intentLevel: "Kasual",
    recommendedFormat: "Reels / Meme / Insight",
    texts: [
      "Kirim postingan ini ke rekan kerjamu yang sering mengeluh soal arsitektur frontend!",
      "Tag 1 temanmu yang wajib tahu trik ini sebelum mulai sprint berikutnya!",
      "Share ke Instagram Stories kamu jika prinsip desain ini juga kamu setujui!",
      "Kirim postingan ini ke channel Slack atau Discord tim engineering kamu untuk bahan diskusi!",
      "Bagikan tips ini ke rekan satu tim agar tidak ada lagi yang menulis styling berantakan.",
      "Tag rekan satu divisi yang paling sering begadang memperbaiki bug CSS menjelang rilis!",
      "Share ke grup komunitas developer kamu agar semakin banyak yang terbantu dengan metode ini.",
      "Kirimkan ke sahabatmu yang sedang merintis personal branding di bidang teknologi!",
      "Bagikan ke tim produk kamu untuk menyamakan persepsi soal standar kebersihan UI.",
      "Repost postingan ini ke feed profilmu jika kamu bangga menjadi engineer yang peduli detail!",
    ],
    description: "Memanfaatkan efek jaringan (social sharing) untuk memperluas jangkauan organik akun.",
  },
];

export function generate170Ctas(): RawCtaEntity[] {
  const result: RawCtaEntity[] = [];
  let currentId = 1;

  const flattened: {
    text: string;
    objective: string;
    intentLevel: string;
    recommendedFormat: string;
    description: string;
  }[] = [];

  CTA_TEMPLATES.forEach((group) => {
    group.texts.forEach((txt) => {
      flattened.push({
        text: txt,
        objective: group.objective,
        intentLevel: group.intentLevel,
        recommendedFormat: group.recommendedFormat,
        description: group.description,
      });
    });
  });

  while (result.length < 170) {
    const item = flattened[result.length % flattened.length];
    const idNumber = String(currentId).padStart(3, "0");
    const id = `CTA-${idNumber}`;

    let adjustedText = item.text;
    if (result.length >= flattened.length) {
      const cycle = Math.floor(result.length / flattened.length);
      const variations = [
        "(Edisi Khusus)",
        "(Wajib Coba)",
        "(Tips Praktis)",
        "(Rekomendasi)",
      ];
      adjustedText = `${item.text} ${variations[cycle % variations.length]}`;
    }

    result.push({
      id,
      text: adjustedText,
      objective: item.objective,
      recommendedFormat: item.recommendedFormat,
      intentLevel: item.intentLevel,
      description: item.description,
    });

    currentId++;
  }

  return result; // Exactly 170 CTAs
}
