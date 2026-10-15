import React from "react";
import { useNavigation } from "@/src/context/navigation-context";
import { Button, Card, Badge } from "@/src/components/ui";
import { ShieldCheck, Lock, EyeOff, Server, ArrowLeft } from "lucide-react";

export function PrivacyPage() {
  const { navigate } = useNavigation();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <div className="space-y-4 border-b border-[hsl(230,15%,22%)]/60 pb-8">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-xs text-[hsl(225,12%,65%)] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Beranda</span>
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="edukasi">Dokumen Legal</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,50%)]">
              Terakhir diperbarui: 10 Oktober 2026
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Kebijakan Privasi Narativa
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)] leading-relaxed">
            Komitmen kami untuk melindungi privasi, integritas naskah konten, dan data akun setiap kreator.
          </p>
        </div>
      </div>

      {/* Main Privacy Articles */}
      <div className="space-y-8 text-sm leading-relaxed text-[hsl(220,20%,90%)]">
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-[hsl(190,90%,55%)]" />
            1. Prinsip Utama: Naskah Anda 100% Milik Anda
          </h2>
          <p className="text-[hsl(225,12%,70%)]">
            Narativa tidak pernah mengklaim hak kepemilikan atas skrip, ide, atau hook yang Anda
            susun di dalam platform kami. Seluruh teks naskah disimpan secara privat dan hanya dapat
            diakses oleh akun Anda sendiri. Kami <strong>tidak pernah menjual data konten</strong> atau
            memanfaatkannya untuk melatih model kecerdasan buatan pihak ketiga.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
            <Lock className="h-5 w-5 text-[hsl(262,83%,68%)]" />
            2. Data yang Kami Kumpulkan & Pengelolaan Keamanan
          </h2>
          <div className="space-y-2 text-[hsl(225,12%,70%)]">
            <p>Data yang kami proses mencakup:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Informasi Akun:</strong> Username dan Nama Tampilan yang digunakan untuk
                mengidentifikasi akun kreator Anda di sistem kami.
              </li>
              <li>
                <strong>Kredensial Autentikasi:</strong> Password Anda diproses dan diamankan
                menggunakan protokol enkripsi industri oleh penyedia identitas Clerk. Password
                asli Anda tidak pernah disimpan dalam database kami dalam format teks biasa (plain text).
              </li>
              <li>
                <strong>Data Konten Skrip:</strong> Draf dan naskah final yang Anda buat tersimpan
                secara terisolasi di database terenkripsi Neon PostgreSQL dengan pembatasan hak akses
                berdasarkan ID pengguna.
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
            <EyeOff className="h-5 w-5 text-[hsl(0,75%,62%)]" />
            3. Kerahasiaan Media B-roll & Signed URL
          </h2>
          <p className="text-[hsl(225,12%,70%)]">
            Pemutaran klip video B-roll 9:16 dilindungi oleh Bunny Stream Signed URL dengan masa
            berlaku singkat (TTL 1 jam). Akses video dienkripsi secara berkala sehingga rekaman aset
            internal tidak dapat diunduh bebas atau di-scrape oleh perayap pihak luar.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
            <Server className="h-5 w-5 text-[hsl(152,60%,50%)]" />
            4. Hak Penghapusan Akun Secara Permanen
          </h2>
          <p className="text-[hsl(225,12%,70%)]">
            Anda berhak penuh untuk menghapus akun Anda kapan saja melalui menu{" "}
            <code className="text-xs bg-[hsl(230,22%,12%)] px-1.5 py-0.5 rounded font-mono text-[hsl(190,90%,55%)]">
              /pengaturan
            </code>
            . Ketika akun dihapus, seluruh riwayat skrip, preferensi favorit, dan rekaman profil
            akan dihapus secara permanen dari server database tanpa menyisakan cadangan tertinggal.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white">
            5. Kontak & Pengaduan Privasi
          </h2>
          <p className="text-[hsl(225,12%,70%)]">
            Jika Anda memiliki pertanyaan mengenai perlindungan privasi data di platform Narativa,
            silakan hubungi tim keamanan kami melalui email{" "}
            <a href="mailto:privasi@narativa.id" className="text-[hsl(190,90%,55%)] hover:underline">
              privasi@narativa.id
            </a>
            .
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-[hsl(230,15%,22%)]/60 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </Button>
        <Button variant="default" size="sm" onClick={() => navigate("/daftar")}>
          Mulai Buat Akun
        </Button>
      </div>
    </div>
  );
}
