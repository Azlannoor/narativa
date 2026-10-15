import React, { useEffect } from "react";
import { useNavigation } from "@/src/context/navigation-context";

export interface RouteMetadataConfig {
  title: string;
  description: string;
  ogType?: "website" | "article";
  robots: "index, follow" | "noindex, nofollow";
  keywords?: string[];
  canonicalPath?: string;
}

const SITE_NAME = "Narativa";
const DEFAULT_OG_IMAGE = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=80";

/**
 * Pemetaan metadata SEO dinamis berdasarkan rute
 * Sesuai Dokumen PRD Bab 1, 3, dan Task 3.2:
 * - Halaman publik: index, follow, OG Card, Twitter Card, Schema.org
 * - Area kreator privat: noindex, nofollow
 */
export function getMetadataForRoute(pathname: string): RouteMetadataConfig {
  // 1. Rute Publik Terbuka (index, follow)
  if (pathname === "/" || pathname === "") {
    return {
      title: "Narativa — Studio Penyusun Skrip Konten Pendek Reels, TikTok & Facebook",
      description:
        "Rakit skrip video Reels, TikTok, dan Facebook dalam hitungan menit dengan perpustakaan ide, hook pembuka, formula konversi, dan B-roll faceless 9:16.",
      ogType: "website",
      robots: "index, follow",
      keywords: ["skrip konten", "reels", "tiktok", "b-roll faceless", "hook generator", "copywriting video"],
      canonicalPath: "/",
    };
  }

  if (pathname === "/fitur") {
    return {
      title: "Fitur Studio — Narativa Studio Penyusun Skrip",
      description:
        "Jelajahi fitur lengkap Narativa: 5-step Script Wizard, formula AIDA & PAS, library hook interupsi, dan hosting Bunny Stream 9:16.",
      ogType: "website",
      robots: "index, follow",
      keywords: ["fitur narativa", "teleprompter", "generator naskah video", "formula copywriting"],
      canonicalPath: "/fitur",
    };
  }

  if (pathname === "/harga") {
    return {
      title: "Paket & Harga — Narativa Kreator Studio",
      description:
        "Pilihan langganan transparan untuk kreator solo, agensi, dan tim konten pendek. Mulai gratis hari ini tanpa kartu kredit.",
      ogType: "website",
      robots: "index, follow",
      keywords: ["harga narativa", "langganan kreator", "alat video reels murah"],
      canonicalPath: "/harga",
    };
  }

  if (pathname === "/kebijakan-privasi") {
    return {
      title: "Kebijakan Privasi — Narativa",
      description:
        "Pelajari bagaimana Narativa mengamankan data pengguna, naskah skrip, dan privasi akun Anda sesuai standar perlindungan data global.",
      ogType: "website",
      robots: "index, follow",
      canonicalPath: "/kebijakan-privasi",
    };
  }

  if (pathname === "/syarat-ketentuan") {
    return {
      title: "Syarat & Ketentuan Layanan — Narativa",
      description:
        "Ketentuan penggunaan platform studio penyusun skrip Narativa, hak kepemilikan naskah, dan kebijakan kuota pembuatan skrip.",
      ogType: "website",
      robots: "index, follow",
      canonicalPath: "/syarat-ketentuan",
    };
  }

  // 2. Rute Autentikasi (noindex, nofollow)
  if (pathname === "/masuk") {
    return {
      title: "Masuk ke Narativa Studio",
      description: "Masuk ke akun kreator Anda untuk mengakses naskah skrip dan library.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/daftar") {
    return {
      title: "Daftar Akun Baru — Narativa",
      description: "Buat akun Narativa baru dan mulai merakit skrip video berdaya pikat tinggi.",
      robots: "noindex, nofollow",
    };
  }

  // 3. Rute Privat Area Kreator (Wajib robots: noindex, nofollow sesuai Task 3.2)
  if (pathname === "/dashboard") {
    return {
      title: "Dasbor Utama | Narativa Studio",
      description: "Dasbor kreator dengan ringkasan naskah terbaru dan kuota harian.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/library/ide") {
    return {
      title: "Library Ide Konten | Narativa Studio",
      description: "Koleksi pilar konten Edukasi, Inspirasi, Promosi, dan BTS.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/library/hook") {
    return {
      title: "Library Hook Interupsi 1–3 Detik | Narativa Studio",
      description: "Template hook pembuka pencegah scroll untuk Reels dan TikTok.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/library/cta") {
    return {
      title: "Library Call to Action (CTA) | Narativa Studio",
      description: "Ajakan bertindak berkonversi tinggi untuk direct message dan penjualan.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/library/formula") {
    return {
      title: "Library Formula Penulisan Naskah | Narativa Studio",
      description: "8 kerangka copywriting teruji: AIDA, PAS, 4P, Hero's Journey, dll.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/library/broll") {
    return {
      title: "Library B-roll Faceless 9:16 | Narativa Studio",
      description: "Klip visual latar siap pakai di-hosting pada Bunny Stream CDN.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/skrip") {
    return {
      title: "Daftar Skrip Saya | Narativa Studio",
      description: "Koleksi seluruh skrip draf dan final yang telah Anda buat.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/skrip/baru") {
    return {
      title: "Wizard Perakitan Skrip 5 Langkah | Narativa Studio",
      description: "Buat skrip terstruktur dari pemilihan platform, audiens, gaya, hingga CTA.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname.endsWith("/pratinjau")) {
    return {
      title: "Mode Teleprompter Siap Rekam | Narativa Studio",
      description: "Pratinjau naskah teleprompter berkecepatan ritme 2,5 kata per detik.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname.startsWith("/skrip/")) {
    return {
      title: "Editor Skrip & Pratinjau 9:16 | Narativa Studio",
      description: "Edit naskah, ubah variabel hook pembuka, dan pantau durasi video.",
      robots: "noindex, nofollow",
    };
  }

  if (pathname === "/pengaturan") {
    return {
      title: "Pengaturan Profil Kreator | Narativa Studio",
      description: "Kelola akun, profil kreator, dan preferensi studio.",
      robots: "noindex, nofollow",
    };
  }

  // Fallback default
  return {
    title: "Narativa — Studio Penyusun Skrip Konten Pendek",
    description: "Platform streaming video naratif dan edukasi modern dengan tampilan dark mode sleek.",
    robots: "noindex, nofollow",
  };
}

/**
 * Komponen Manager Metadata Dinamis yang menyuntikkan tag ke document.head
 */
export function PageMetadata() {
  const { currentPath } = useNavigation();

  useEffect(() => {
    const meta = getMetadataForRoute(currentPath);
    const origin = typeof window !== "undefined" ? window.location.origin : "https://narativa.id";
    const canonicalUrl = meta.canonicalPath ? `${origin}${meta.canonicalPath}` : `${origin}${currentPath}`;

    // 1. Update Title Dokumen
    document.title = meta.title;

    // Helper untuk update/create meta tag
    const setMetaTag = (attribute: "name" | "property", key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Meta Description & Keywords
    setMetaTag("name", "description", meta.description);
    if (meta.keywords && meta.keywords.length > 0) {
      setMetaTag("name", "keywords", meta.keywords.join(", "));
    }

    // 3. Robots Meta Tag (Task 3.2: noindex pada area kreator, index pada publik)
    setMetaTag("name", "robots", meta.robots);
    setMetaTag("name", "googlebot", meta.robots);

    // 4. OpenGraph Social Cards
    setMetaTag("property", "og:title", meta.title);
    setMetaTag("property", "og:description", meta.description);
    setMetaTag("property", "og:type", meta.ogType || "website");
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:site_name", SITE_NAME);
    setMetaTag("property", "og:image", DEFAULT_OG_IMAGE);
    setMetaTag("property", "og:locale", "id_ID");

    // 5. Twitter / X Cards
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", meta.title);
    setMetaTag("name", "twitter:description", meta.description);
    setMetaTag("name", "twitter:image", DEFAULT_OG_IMAGE);
    setMetaTag("name", "twitter:site", "@narativa_id");

    // 6. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 7. Schema.org JSON-LD (Halaman publik)
    const existingSchema = document.getElementById("narativa-schema-ld");
    if (existingSchema) {
      existingSchema.remove();
    }

    if (meta.robots === "index, follow") {
      const scriptLd = document.createElement("script");
      scriptLd.id = "narativa-schema-ld";
      scriptLd.type = "application/ld+json";
      scriptLd.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Narativa",
        url: origin,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All",
        description: meta.description,
        inLanguage: "id-ID",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IDR",
          description: "Mulai gratis hingga 20 skrip per hari",
        },
        featureList: [
          "Wizard Pembuat Skrip 5 Langkah",
          "Katalog Hook Interupsi 1-3 Detik",
          "Formula Copywriting AIDA, PAS, Storyteller",
          "Koleksi B-roll Faceless 9:16 Bunny Stream",
          "Kalkulasi Ritme Durasi 2.5 Kata/Detik",
          "Mode Teleprompter Siap Rekam",
        ],
      });
      document.head.appendChild(scriptLd);
    }
  }, [currentPath]);

  return null;
}
