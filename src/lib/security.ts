/**
 * Security & XSS Sanitization Utilities
 * Sesuai Dokumen PRD Task 3.2:
 * - Memastikan seluruh teks skrip dirender sebagai teks biasa murni (Plain Text)
 * - Mencegah XSS (Cross-Site Scripting) pada pembuatan, ekspor, dan rendering teleprompter
 * - Sanitasi input string sebelum persistensi dan ekspor clipboard
 */

/**
 * Mengonversi karakter spesial HTML menjadi entitas aman
 */
export function escapeHtml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Membersihkan tag HTML, tag script, iframe, dan pseudo-protokol dari teks skrip
 * Menjamin bahwa teks skrip murni merupakan teks biasa tanpa eksekusi kode.
 */
export function sanitizePlainText(input: string): string {
  if (!input) return "";

  let cleaned = input;

  // 1. Hapus tag <script>...</script> beserta isinya
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");

  // 2. Hapus tag <iframe>, <object>, <embed>, <applet>
  cleaned = cleaned.replace(/<(iframe|object|embed|applet)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, "");

  // 3. Hapus semua tag HTML yang tersisa (misal <img onerror=...>, <a href=...>)
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  // 4. Hapus string event handlers mencurigakan (javascript:, onclick=, onload=)
  cleaned = cleaned.replace(/javascript:/gi, "");
  cleaned = cleaned.replace(/data:\s*text\/html/gi, "");

  return cleaned.trim();
}

/**
 * Sanitasi objek skrip lengkap sebelum disimpan atau diekspor
 */
export function sanitizeScriptData<T extends {
  title?: string;
  hookText?: string | null;
  ctaText?: string | null;
  interruptNote?: string | null;
  targetAudience?: string | null;
  keyMessage?: string | null;
  sections?: Array<{ id: string; key: string; label: string; content: string; brollIds: string[]; estimatedSec: number }>;
}>(script: T): T {
  return {
    ...script,
    title: script.title ? sanitizePlainText(script.title) : script.title,
    hookText: script.hookText ? sanitizePlainText(script.hookText) : script.hookText,
    ctaText: script.ctaText ? sanitizePlainText(script.ctaText) : script.ctaText,
    interruptNote: script.interruptNote ? sanitizePlainText(script.interruptNote) : script.interruptNote,
    targetAudience: script.targetAudience ? sanitizePlainText(script.targetAudience) : script.targetAudience,
    keyMessage: script.keyMessage ? sanitizePlainText(script.keyMessage) : script.keyMessage,
    sections: script.sections
      ? script.sections.map((sec) => ({
          ...sec,
          label: sanitizePlainText(sec.label),
          content: sanitizePlainText(sec.content),
        }))
      : script.sections,
  };
}
