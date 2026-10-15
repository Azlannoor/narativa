import React from "react";
import "@/src/index.css";
import { Toaster } from "@/src/components/ui/sonner";

export interface RootMetadata {
  title: {
    default: string;
    template: string;
  };
  description: string;
  metadataBase: URL;
  openGraph: {
    title: string;
    description: string;
    siteName: string;
    locale: string;
    type: string;
  };
  robots: {
    index: boolean;
    follow: boolean;
  };
}

export const metadata: RootMetadata = {
  title: {
    default: "Narativa — Studio Penyusun Skrip Konten Pendek",
    template: "%s | Narativa",
  },
  description:
    "Rakit skrip Reels, TikTok, dan Facebook dengan perpustakaan ide, hook pembuka, formula penulisan, CTA, dan B-roll 9:16 siap rekam.",
  metadataBase: new URL("https://narativa.id"),
  openGraph: {
    title: "Narativa — Studio Penyusun Skrip Konten Pendek",
    description:
      "Rakit skrip Reels, TikTok, dan Facebook dalam hitungan menit.",
    siteName: "Narativa",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[hsl(230,25%,6%)] text-[hsl(220,20%,95%)] antialiased selection:bg-[hsl(262,83%,68%)]/30 selection:text-white font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
