import React from "react";
import { useNavigation } from "@/src/context/navigation-context";
import { Button } from "@/src/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, FileCode, Video, Heart } from "lucide-react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { currentPath, navigate, user } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(230,25%,6%)] text-[hsl(220,20%,95%)] selection:bg-[hsl(262,83%,68%)]/30 selection:text-white font-sans">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[hsl(262,83%,68%)]/15 via-[hsl(190,90%,55%)]/15 to-[hsl(262,83%,68%)]/15 border-b border-[hsl(230,15%,22%)]/40 py-2 text-center text-xs text-[hsl(220,20%,90%)]">
        <span>
          ⚡ Studio Penyusun Skrip Modular untuk Kreator Reels, TikTok & Facebook
        </span>
      </div>

      {/* Persistent Public Header */}
      <header className="sticky top-0 z-40 w-full border-b border-[hsl(230,15%,22%)]/60 bg-[hsl(230,25%,6%)]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[hsl(262,83%,68%)] to-[hsl(190,90%,55%)] flex items-center justify-center shadow-[0_0_18px_-2px_hsla(262,83%,68%,0.5)] transition-transform duration-200 group-hover:scale-105">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl tracking-tight text-white group-hover:text-[hsl(262,83%,68%)] transition-colors">
                Narativa
              </span>
              <span className="text-[10px] text-[hsl(225,12%,55%)] -mt-1 font-mono">
                Creator Script Studio
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[hsl(225,12%,65%)]">
            <button
              type="button"
              onClick={() => navigate("/")}
              className={`transition-colors hover:text-white ${
                currentPath === "/" ? "text-[hsl(262,83%,68%)] font-semibold" : ""
              }`}
            >
              Beranda
            </button>
            <a
              href="#fitur"
              className="transition-colors hover:text-white"
            >
              Fitur Studio
            </a>
            <a
              href="#gaya-jualan"
              className="transition-colors hover:text-white"
            >
              3 Gaya Jualan
            </a>
            <a
              href="#contoh"
              className="transition-colors hover:text-white"
            >
              Contoh Skrip
            </a>
          </nav>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            {user.isLoggedIn ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <span>Buka Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/masuk")}
                >
                  Masuk
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate("/daftar")}
                >
                  Daftar Sekarang
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <main className="flex-1">{children}</main>

      {/* Persistent Public Footer */}
      <footer className="border-t border-[hsl(230,15%,22%)]/60 bg-[hsl(230,22%,8%)] mt-20">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand column */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[hsl(262,83%,68%)] to-[hsl(190,90%,55%)] flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-heading font-bold text-lg text-white">
                  Narativa
                </span>
              </div>
              <p className="text-sm text-[hsl(225,12%,65%)] max-w-sm leading-relaxed">
                Studio penyusun skrip konten pendek untuk kreator. Pilih ide, hook,
                formula penulisan, dan CTA siap pakai, lalu rakit menjadi skrip
                Reels, TikTok, dan Facebook yang siap direkam.
              </p>
              <div className="flex items-center gap-2 text-xs text-[hsl(225,12%,50%)] font-mono">
                <span>Versi MVP 1.0</span>
                <span>·</span>
                <span>Neon PostgreSQL</span>
                <span>·</span>
                <span>Bunny Stream CDN</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[hsl(220,20%,90%)] uppercase tracking-wider">
                Modul Perpustakaan
              </h4>
              <ul className="space-y-2 text-sm text-[hsl(225,12%,65%)]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/library/ide")}
                    className="hover:text-white transition-colors"
                  >
                    Library Ide Konten
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/library/hook")}
                    className="hover:text-white transition-colors"
                  >
                    Library Hook Interupsi
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/library/cta")}
                    className="hover:text-white transition-colors"
                  >
                    Library Call-to-Action
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/library/formula")}
                    className="hover:text-white transition-colors"
                  >
                    Kerangka Formula Penulisan
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/library/broll")}
                    className="hover:text-white transition-colors"
                  >
                    Galeri B-roll 9:16
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-[hsl(220,20%,90%)] uppercase tracking-wider">
                Bantuan & Hukum
              </h4>
              <ul className="space-y-2 text-sm text-[hsl(225,12%,65%)]">
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/kebijakan-privasi")}
                    className="hover:text-white transition-colors"
                  >
                    Kebijakan Privasi
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigate("/syarat-ketentuan")}
                    className="hover:text-white transition-colors"
                  >
                    Syarat & Ketentuan
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[hsl(230,15%,22%)]/40 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[hsl(225,12%,50%)] gap-4">
            <p>© {new Date().getFullYear()} Narativa. Hak cipta dilindungi.</p>
            <p className="flex items-center gap-1.5">
              Dibuat dengan dedikasi untuk kreator Indonesia
              <Heart className="h-3 w-3 text-[hsl(262,83%,68%)] fill-[hsl(262,83%,68%)]" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
