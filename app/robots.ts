/**
 * Next.js App Router Metadata Route: app/robots.ts
 * Menentukan kebijakan crawler robots.txt.
 * Mengizinkan halaman publik dan memblokir area privat kreator (noindex).
 * Sesuai Dokumen PRD Task 3.2.
 */

export interface RobotsRule {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  rules: RobotsRule | RobotsRule[];
  sitemap?: string | string[];
  host?: string;
}

export default function robots(): RobotsConfig {
  const baseUrl =
    (typeof process !== "undefined" && process.env?.APP_URL) ||
    "https://narativa.id";

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/fitur",
          "/harga",
          "/kebijakan-privasi",
          "/syarat-ketentuan",
        ],
        disallow: [
          "/dashboard",
          "/dashboard/",
          "/library",
          "/library/",
          "/skrip",
          "/skrip/",
          "/pengaturan",
          "/pengaturan/",
          "/masuk",
          "/daftar",
          "/api/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
