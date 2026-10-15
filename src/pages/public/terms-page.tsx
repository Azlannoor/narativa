import React from "react";
import { useNavigation } from "@/src/context/navigation-context";
import { Button, Card, Badge } from "@/src/components/ui";
import { FileText, CheckCircle2, AlertTriangle, Scale, ArrowLeft } from "lucide-react";

export function TermsPage() {
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
            <Badge variant="inspirasi">Ketentuan Layanan</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,50%)]">
              Terakhir diperbarui: 10 Oktober 2026
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Syarat & Ketentuan Penggunaan Narativa
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)] leading-relaxed">
            Perjanjian penggunaan layanan antara Narativa ("Kami") dan Pengguna ("Kreator Konten").
          </p>
        </div>
      </div>

      {/* Main Terms Articles */}
      <div className="space-y-8 text-sm leading-relaxed text-[hsl(220,20%,90%)]">
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
            <Scale className="h-5 w-5 text-[hsl(262,83%,68%)]" />
            1. Penerimaan Syarat & Ketentuan
          </h2>
          <p className="text-[hsl(225,12%,70%)]">
            Dengan mendaftar, mengakses, atau menggunakan platform Narativa, Anda menyatakan setuju
            untuk terikat pada seluruh syarat dan ketentuan yang diatur di dalam dokumen ini. Jika Anda
            tidak menyetujui salah satu ketentuan, Anda dipersilakan untuk tidak menggunakan platform ini.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[hsl(152,60%,50%)]" />
            2. Lisensi Penggunaan Perpustakaan (Library)
          </h2>
          <div className="space-y-2 text-[hsl(225,12%,70%)]">
            <p>
              Kami memberikan lisensi non-eksklusif dan bebas royalti kepada setiap kreator terdaftar
              untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                Memakai seluruh ide, template hook, formula naskah, dan teks CTA untuk kebutuhan
                produksi video komersial maupun non-komersial di platform Instagram, TikTok, Facebook,
                dan kanal media sosial lainnya.
              </li>
              <li>
                Menggandakan, mengedit, dan mengekspor skrip yang dirakit di Narativa ke format teks
                maupun dokumen Markdown tanpa batasan atribusi wajib ke Narativa.
              </li>
              <li>
                Memutar dan menyelaraskan referensi aset rekaman B-roll 9:16 untuk kebutuhan panduan
                pengambilan gambar (take video).
              </li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[hsl(38,92%,60%)]" />
            3. Batasan Penggunaan Wajar (Fair Usage)
          </h2>
          <p className="text-[hsl(225,12%,70%)]">
            Untuk menjaga kestabilan infrastruktur sistem bagi seluruh komunitas kreator, sistem kami
            menerapkan batas pembuatan naskah wajar maksimal <strong>30 skrip per hari per pengguna</strong>.
            Percobaan pembuatan skrip secara massal menggunakan automasi bot atau scraping yang
            membebani server dapat mengakibatkan penangguhan akun secara otomatis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-[hsl(0,75%,62%)]" />
            4. Tanggung Jawab Isi Konten & Larangan
          </h2>
          <div className="space-y-2 text-[hsl(225,12%,70%)]">
            <p>Kreator bertanggung jawab penuh atas video final yang dipublikasikan ke publik. Dilarang keras merakit konten yang memuat:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Penipuan finansial, skema piramida, atau investasi ilegal.</li>
              <li>Ujaran kebencian, pelecehan, diskriminasi SARA, atau konten bermuatan pornografi.</li>
              <li>Penyebaran informasi palsu (hoaks) yang dapat membahayakan keselamatan umum.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl font-semibold text-white">
            5. Perubahan Layanan
          </h2>
          <p className="text-[hsl(225,12%,70%)]">
            Narativa berhak memperbarui fitur, menambah template modul library, atau menyesuaikan
            aturan teknis sesuai kebutuhan operasional. Setiap perubahan signifikan akan kami
            umumkan melalui pengumuman antarmuka dasbor.
          </p>
        </section>
      </div>

      <div className="pt-6 border-t border-[hsl(230,15%,22%)]/60 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </Button>
        <Button variant="default" size="sm" onClick={() => navigate("/daftar")}>
          Setuju & Buat Akun
        </Button>
      </div>
    </div>
  );
}
