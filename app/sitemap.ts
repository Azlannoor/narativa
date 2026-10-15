/**
 * Next.js App Router Metadata Route: app/sitemap.ts
 * Menghasilkan sitemap.xml otomatis untuk pengindeksan mesin pencari pada rute publik.
 * Sesuai Dokumen PRD Task 3.2.
 */

export interface SitemapItem {
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}

export type Sitemap = SitemapItem[];

export default function sitemap(): Sitemap {
  const baseUrl =
    (typeof process !== "undefined" && process.env?.APP_URL) ||
    "https://narativa.id";

  const currentDate = new Date();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/fitur`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/harga`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kebijakan-privasi`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/syarat-ketentuan`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
