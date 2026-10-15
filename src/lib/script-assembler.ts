/**
 * Mesin Perakitan Skrip (Script Assembler Engine)
 * Sesuai Dokumen PRD Bab 6:
 * - Mengisi variabel hook pembuka (format {{topik}} atau [topik])
 * - Membangun bagian formula sesuai gaya jualan (Hard Selling, Soft Selling, Storyteller)
 * - Menghitung estimasi durasi dengan rasio 2,5 kata per detik
 * - Menyalin teks CTA ke kolom cta_text
 * - Mengompilasi naskah utuh untuk mode teleprompter, ekspor teks, dan markdown
 */

import { sanitizePlainText } from "./security";

export type PlatformType =
  | "instagram_reels"
  | "tiktok"
  | "facebook_reels"
  | "facebook_post";

export type PillarType = "edukasi" | "inspirasi" | "promosi" | "bts_personal";

export type SalesStyleType = "hard_selling" | "soft_selling" | "storyteller";

export type FormulaCodeType =
  | "aida"
  | "4p"
  | "acca"
  | "pas"
  | "teardown"
  | "playbook"
  | "bab"
  | "heros_journey";

export interface ScriptSectionInput {
  id?: string;
  key: string;
  label: string;
  content: string;
  brollIds?: string[];
}

export interface ScriptSectionOutput {
  id: string;
  key: string;
  label: string;
  content: string;
  brollIds: string[];
  wordCount: number;
  estimatedSec: number;
  timeRangeLabel?: string;
}

export interface AssembleScriptInput {
  title: string;
  platform: PlatformType;
  pillar: PillarType;
  salesStyle: SalesStyleType;
  formulaCode: FormulaCodeType;
  hookTemplate: string;
  hookVariables?: Record<string, string>;
  interruptNote?: string;
  targetAudience?: string;
  keyMessage?: string;
  ctaText: string;
  ctaKeyword?: string;
  sectionContents?: Record<string, string>;
  sectionBrolls?: Record<string, string[]>;
  customSections?: ScriptSectionInput[];
  status?: "draft" | "final" | "arsip";
}

export interface AssembledScript {
  title: string;
  platform: PlatformType;
  pillar: PillarType;
  salesStyle: SalesStyleType;
  formulaCode: FormulaCodeType;
  status: "draft" | "final" | "arsip";
  targetAudience: string;
  keyMessage: string;
  hookText: string;
  interruptNote: string;
  ctaText: string;
  ctaKeyword?: string;
  sections: ScriptSectionOutput[];
  wordCount: number;
  estimatedDurationSec: number;
  fullPlainText: string;
  markdownContent: string;
}

/** Rasio durasi standar: 2.5 kata per detik (PRD Bab 6 & Bab 10) */
export const WORDS_PER_SECOND = 2.5;

/**
 * Menghitung jumlah kata dan estimasi durasi dalam detik.
 */
export function calculateDuration(
  text: string,
  wordsPerSecond: number = WORDS_PER_SECOND
): { wordCount: number; durationSec: number } {
  if (!text || typeof text !== "string") {
    return { wordCount: 0, durationSec: 0 };
  }
  const clean = text.trim();
  if (clean.length === 0) {
    return { wordCount: 0, durationSec: 0 };
  }
  const words = clean.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const durationSec = Math.max(1, Math.round(wordCount / wordsPerSecond));
  return { wordCount, durationSec };
}

/**
 * Mengisi variabel hook template.
 * Mendukung format {{nama_variabel}} maupun [nama_variabel].
 */
export function interpolateVariables(
  template: string,
  variables: Record<string, string> = {}
): string {
  if (!template) return "";
  let resolved = template;

  for (const [key, rawValue] of Object.entries(variables)) {
    const rawStr = rawValue !== undefined && rawValue !== null ? String(rawValue).trim() : "";
    const cleanValue = sanitizePlainText(rawStr);
    if (cleanValue) {
      // Ganti {{key}}
      resolved = resolved.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, "gi"), cleanValue);
      // Ganti [key]
      resolved = resolved.replace(new RegExp(`\\[\\s*${key}\\s*\\]`, "gi"), cleanValue);
    }
  }

  // Jika masih ada placeholder yang belum diisi, bersihkan tanda kurung agar tetap terbaca rapi
  return resolved;
}

/**
 * Ekstrak nama variabel yang terdapat di dalam template.
 * Contoh: "Kamu masih {{masalah}}?" -> ["masalah"]
 */
export function extractTemplateVariables(template: string): string[] {
  if (!template) return [];
  const matches = new Set<string>();

  // Cari {{variable}}
  const mustacheRegex = /\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g;
  let match;
  while ((match = mustacheRegex.exec(template)) !== null) {
    if (match[1]) matches.add(match[1]);
  }

  // Cari [variable]
  const bracketRegex = /\[\s*([a-zA-Z0-9_-]+)\s*\]/g;
  while ((match = bracketRegex.exec(template)) !== null) {
    if (match[1]) matches.add(match[1]);
  }

  return Array.from(matches);
}

/**
 * Kerangka default formula jika kueri database tidak menyediakan struktur langkah.
 */
export const DEFAULT_FORMULA_STEPS: Record<
  FormulaCodeType,
  { key: string; label: string; defaultContent: string }[]
> = {
  aida: [
    {
      key: "attention",
      label: "Attention (Pancingan Awal)",
      defaultContent: "Kamu masih simpan password penting langsung di autocomplete browser tanpa enkripsi dua arah?",
    },
    {
      key: "interest",
      label: "Interest (Eksplorasi Masalah)",
      defaultContent: "Banyak malware tipe info-stealer bisa mengekstrak seluruh cache kredensial hanya lewat satu ekstensi mencurigakan yang kamu install tanpa sadar.",
    },
    {
      key: "desire",
      label: "Desire (Pemicu Minat Solusi)",
      defaultContent: "Solusi termudah: aktifkan Master Password di browser kamu sekarang atau pindahkan semua akun utama ke password manager opensource terenkripsi.",
    },
    {
      key: "action",
      label: "Action (Dorongan Bertindak)",
      defaultContent: "Simpan dulu postingan ini sekarang, kamu pasti butuh checklist-nya saat setup laptop baru nanti!",
    },
  ],
  pas: [
    {
      key: "problem",
      label: "Problem (Masalah Utama)",
      defaultContent: "Tiap kali login ke dashboard akun kerja, kamu harus reset password karena selalu lupa kombinasi karakter?",
    },
    {
      key: "agitate",
      label: "Agitate (Mempertegas Dampak)",
      defaultContent: "Lebih parahnya lagi, kalau kamu pakai satu password sama untuk email pribadi dan rekening bank, sekali bocor, semuanya amblas.",
    },
    {
      key: "solution",
      label: "Solution (Penawaran Solusi)",
      defaultContent: "Terapkan aturan frase unik 3 kata acak mulai hari ini. Lebih gampang diingat otak dan butuh 400 tahun untuk di-crack brute force.",
    },
  ],
  "4p": [
    {
      key: "picture",
      label: "Picture (Gambaran Situasi)",
      defaultContent: "Bayangkan kamu bangun pagi dan mendapati akun bisnismu logout sendiri dengan notifikasi aktivitas mencurigakan dari Rusia.",
    },
    {
      key: "promise",
      label: "Promise (Janji Solusi)",
      defaultContent: "Dalam 60 detik ke depan, saya tunjukkan cara mengunci akunmu dengan autentikasi 2 faktor perangkat keras.",
    },
    {
      key: "proof",
      label: "Proof (Bukti Teruji)",
      defaultContent: "Berdasarkan laporan Google Security 2024, verifikasi kunci fisik memblokir 100% serangan phishing otomatis.",
    },
    {
      key: "push",
      label: "Push (Dorongan Kuat)",
      defaultContent: "Aktifkan sekarang sebelum kamu jadi korban serangan berikutnya.",
    },
  ],
  acca: [
    {
      key: "awareness",
      label: "Awareness (Penyadaran)",
      defaultContent: "Banyak kreator tidak sadar kalau password email utama mereka sudah tersebar di database kebocoran publik.",
    },
    {
      key: "comprehension",
      label: "Comprehension (Pemahaman Mendalam)",
      defaultContent: "Saat satu layanan ecommerce bocor, peretas langsung mencocokkan kredensial tersebut ke akun sosial media dan domain hosting.",
    },
    {
      key: "conviction",
      label: "Conviction (Keyakinan)",
      defaultContent: "Dengan menggunakan passkey berbasis biometrik, kamu tidak butuh password lagi dan akunmu 10x lebih kebal.",
    },
    {
      key: "action",
      label: "Action (Tindakan)",
      defaultContent: "Cek apakah emailmu pernah bocor via situs HaveIBeenPwned sekarang juga.",
    },
  ],
  bab: [
    {
      key: "before",
      label: "Before (Kondisi Sebelum)",
      defaultContent: "Dulu saya selalu pakai tanggal lahir dan nama hewan peliharaan buat semua akun penting karena malas menghafal.",
    },
    {
      key: "after",
      label: "After (Kondisi Sesudah)",
      defaultContent: "Sekarang, semua kredensial teracak otomatis 24 karakter dengan enkripsi zero-knowledge di brankas digital.",
    },
    {
      key: "bridge",
      label: "Bridge (Jembatan Perubahan)",
      defaultContent: "Kuncinya cuma satu: saya install aplikasi pengelola sandi di HP dan biarkan ekstensi mengisinya otomatis.",
    },
  ],
  heros_journey: [
    {
      key: "ordinary_world",
      label: "1. Kondisi Awal (Dunia Biasa)",
      defaultContent: "Tiga bulan lalu, saya santai saja memakai koneksi WiFi umum di coffee shop tanpa perlindungan VPN apa pun.",
    },
    {
      key: "call_to_adventure",
      label: "2. Titik Krisis (Tantangan)",
      defaultContent: "Tiba-tiba kartu kredit saya terdebit transaksi mencurigakan senilai jutaan rupiah dari negara lain saat saya sedang ngopi.",
    },
    {
      key: "transformation",
      label: "3. Titik Balik (Pelajaran)",
      defaultContent: "Sejak hari itu, saya belajar bagaimana teknik packet sniffing bekerja di jaringan publik dan wajib menyalakan DNS terenkripsi.",
    },
    {
      key: "return_with_elixir",
      label: "4. Resolusi (Oleh-oleh Ilmu)",
      defaultContent: "Jangan tunggu saldo rekeningmu ludes baru peduli keamanan digital. Pasang enkripsi di perangkatmu sekarang.",
    },
  ],
  teardown: [
    {
      key: "myth",
      label: "1. Mitos Populer",
      defaultContent: "Katanya mengganti huruf 'a' dengan '@' atau 'o' dengan '0' bikin password kita aman dari hacker?",
    },
    {
      key: "reality",
      label: "2. Realita Teknis",
      defaultContent: "Faktanya, kamus brute force modern sudah memasukkan permutasi simbol Leetspeak dalam sepersekian milidetik pertama.",
    },
    {
      key: "takeaway",
      label: "3. Solusi Teruji",
      defaultContent: "Yang menentukan kekuatan sandi adalah panjang entropi kalimat, bukan sekadar simbol pengganti.",
    },
  ],
  playbook: [
    {
      key: "step_1",
      label: "Langkah 1 (Audit)",
      defaultContent: "Buka browser Chrome atau Safari, masuk ke tab Sandi dan cek daftar peringatan kebocoran.",
    },
    {
      key: "step_2",
      label: "Langkah 2 (Penggantian)",
      defaultContent: "Ganti semua akun perbankan dan email utama ke sistem Passkey biometrik sidik jari.",
    },
    {
      key: "step_3",
      label: "Langkah 3 (Kunci Cadangan)",
      defaultContent: "Cetak atau simpan kode pemulihan darurat di tempat fisik yang aman di rumah.",
    },
  ],
};

/**
 * Menyesuaikan penekanan bagian berdasarkan gaya jualan (Hard Selling, Soft Selling, Storyteller)
 */
export function adaptToneForSalesStyle(
  label: string,
  content: string,
  salesStyle: SalesStyleType
): { adaptedLabel: string; adaptedContent: string } {
  let adaptedLabel = label;
  let adaptedContent = content;

  if (salesStyle === "hard_selling") {
    adaptedLabel = `[Tegas & Mendesak] ${label}`;
  } else if (salesStyle === "soft_selling") {
    adaptedLabel = `[Nilai Edukasi] ${label}`;
  } else if (salesStyle === "storyteller") {
    adaptedLabel = `[Alur Narasi] ${label}`;
  }

  return { adaptedLabel, adaptedContent };
}

/**
 * Mesin utama perakitan skrip (Script Assembler Engine).
 * Mengintegrasikan seluruh komponen menjadi objek skrip siap simpan ke Drizzle.
 */
export function assembleScript(input: AssembleScriptInput): AssembledScript {
  // 1. Ekstrak & selesaikan Hook Text
  const resolvedHookText = interpolateVariables(
    input.hookTemplate || "",
    input.hookVariables || {}
  );

  const interruptNote =
    input.interruptNote ||
    "Interupsi visual 1-3 detik, teks layar tebal dan tajam dengan suara sound effect jeda.";

  // 2. Bangun Bagian-Bagian Formula (Formula Sections)
  const formulaKey = input.formulaCode || "aida";
  const defaultSteps = DEFAULT_FORMULA_STEPS[formulaKey] || DEFAULT_FORMULA_STEPS.aida;

  let currentElapsedSec = 0;
  const hookDuration = calculateDuration(resolvedHookText).durationSec;
  currentElapsedSec += Math.max(3, hookDuration);

  const sections: ScriptSectionOutput[] = [];

  if (input.customSections && input.customSections.length > 0) {
    for (let i = 0; i < input.customSections.length; i++) {
      const cs = input.customSections[i];
      const cleanContent = sanitizePlainText(cs.content);
      const { wordCount, durationSec } = calculateDuration(cleanContent);
      const startSec = currentElapsedSec;
      const endSec = startSec + durationSec;
      currentElapsedSec = endSec;

      sections.push({
        id: cs.id || `sec-${i + 1}-${cs.key}`,
        key: cs.key,
        label: sanitizePlainText(cs.label),
        content: cleanContent,
        brollIds: cs.brollIds || [],
        wordCount,
        estimatedSec: durationSec,
        timeRangeLabel: `${startSec}–${endSec} detik`,
      });
    }
  } else {
    for (let i = 0; i < defaultSteps.length; i++) {
      const step = defaultSteps[i];
      const customContent = input.sectionContents?.[step.key];
      const rawContent = customContent !== undefined && customContent.trim().length > 0
        ? customContent.trim()
        : step.defaultContent;
      const cleanContent = sanitizePlainText(rawContent);

      const { wordCount, durationSec } = calculateDuration(cleanContent);
      const startSec = currentElapsedSec;
      const endSec = startSec + durationSec;
      currentElapsedSec = endSec;

      const assignedBrolls = input.sectionBrolls?.[step.key] || [];

      sections.push({
        id: `sec-${i + 1}-${step.key}`,
        key: step.key,
        label: sanitizePlainText(step.label),
        content: cleanContent,
        brollIds: assignedBrolls,
        wordCount,
        estimatedSec: durationSec,
        timeRangeLabel: `${startSec}–${endSec} detik`,
      });
    }
  }

  // 3. Salin CTA Text
  const ctaText = input.ctaText ? sanitizePlainText(input.ctaText.trim()) : "";
  const { wordCount: ctaWords, durationSec: ctaSec } = calculateDuration(ctaText);
  currentElapsedSec += ctaSec;

  // 4. Hitung Total Durasi & Jumlah Kata
  const totalHookWords = calculateDuration(resolvedHookText).wordCount;
  const totalSectionsWords = sections.reduce((acc, s) => acc + s.wordCount, 0);
  const totalWordCount = totalHookWords + totalSectionsWords + ctaWords;
  const estimatedDurationSec = Math.max(5, Math.round(totalWordCount / WORDS_PER_SECOND));

  // 5. Rakit Teks Polos & Markdown untuk Ekspor
  const plainTextParts: string[] = [];
  plainTextParts.push(`JUDUL: ${input.title}`);
  plainTextParts.push(`PLATFORM: ${input.platform.toUpperCase()} | PILAR: ${input.pillar.toUpperCase()}`);
  plainTextParts.push(`GAYA JUALAN: ${input.salesStyle.toUpperCase()} | FORMULA: ${input.formulaCode.toUpperCase()}`);
  plainTextParts.push(`ESTIMASI DURASI: ~${estimatedDurationSec} Detik (${totalWordCount} Kata)\n`);
  plainTextParts.push(`[HOOK 0-3 DETIK] (Catatan: ${interruptNote})`);
  plainTextParts.push(resolvedHookText);
  plainTextParts.push("");

  sections.forEach((sec) => {
    plainTextParts.push(`[${sec.label.toUpperCase()}] (${sec.timeRangeLabel || `${sec.estimatedSec}s`})`);
    if (sec.brollIds.length > 0) {
      plainTextParts.push(`(B-roll: ${sec.brollIds.join(", ")})`);
    }
    plainTextParts.push(sec.content);
    plainTextParts.push("");
  });

  if (ctaText) {
    plainTextParts.push(`[CALL TO ACTION (CTA)]`);
    if (input.ctaKeyword) {
      plainTextParts.push(`(Keyword DM: ${input.ctaKeyword})`);
    }
    plainTextParts.push(ctaText);
  }

  const fullPlainText = plainTextParts.join("\n");

  // Format Markdown
  const mdParts: string[] = [];
  mdParts.push(`# ${input.title}\n`);
  mdParts.push(`- **Platform:** \`${input.platform}\``);
  mdParts.push(`- **Pilar Konten:** \`${input.pillar}\``);
  mdParts.push(`- **Gaya Jualan:** \`${input.salesStyle}\``);
  mdParts.push(`- **Formula:** \`${input.formulaCode.toUpperCase()}\``);
  mdParts.push(`- **Estimasi Durasi:** **~${estimatedDurationSec} detik** (${totalWordCount} kata)\n`);
  mdParts.push(`---\n`);
  mdParts.push(`### 🎯 Hook Pembuka (0–3 Detik)`);
  mdParts.push(`> 🎬 **Interupsi Visual:** *${interruptNote}*\n`);
  mdParts.push(`"${resolvedHookText}"\n`);
  mdParts.push(`---\n`);
  mdParts.push(`### 📝 Bagian Tubuh Skrip\n`);

  sections.forEach((sec, idx) => {
    mdParts.push(`#### ${idx + 1}. ${sec.label} (${sec.timeRangeLabel || `${sec.estimatedSec} detik`})`);
    if (sec.brollIds.length > 0) {
      mdParts.push(`- 🎥 *B-roll Terkait:* \`${sec.brollIds.join(", ")}\``);
    }
    mdParts.push(`\n${sec.content}\n`);
  });

  if (ctaText) {
    mdParts.push(`---\n`);
    mdParts.push(`### 📣 Call to Action (CTA)\n`);
    if (input.ctaKeyword) {
      mdParts.push(`> 🔑 **Kata Kunci Pemicu:** \`${input.ctaKeyword}\`\n`);
    }
    mdParts.push(`"${ctaText}"\n`);
  }

  const markdownContent = mdParts.join("\n");

  return {
    title: input.title,
    platform: input.platform,
    pillar: input.pillar,
    salesStyle: input.salesStyle,
    formulaCode: input.formulaCode,
    status: input.status || "draft",
    targetAudience: input.targetAudience || "",
    keyMessage: input.keyMessage || "",
    hookText: resolvedHookText,
    interruptNote,
    ctaText,
    ctaKeyword: input.ctaKeyword,
    sections,
    wordCount: totalWordCount,
    estimatedDurationSec,
    fullPlainText,
    markdownContent,
  };
}
