import React, { useState } from "react";
import { useNavigation } from "@/src/context/navigation-context";
import {
  Button,
  Card,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui";
import {
  Sparkles,
  ArrowRight,
  Flame,
  CheckCircle2,
  Copy,
  Video,
  Clock,
  Layers,
  ShieldCheck,
  Zap,
  Bookmark,
  Share2,
  MessageSquare,
  FileText,
  Play,
  TrendingUp,
  Cpu,
} from "lucide-react";
import { toast } from "@/src/components/ui/sonner";

export function HomePage() {
  const { navigate } = useNavigation();
  const [activeTab, setActiveTab] = useState<string>("soft");
  const [copied, setCopied] = useState(false);

  const sampleScript = {
    title: "5 Kesalahan Fatal Saat Menyimpan Password di Browser",
    platform: "Instagram Reels (9:16)",
    pillar: "Edukasi",
    salesStyle: "Soft Selling",
    hook: "Kamu masih pakai satu password yang sama di semua browser? Ini alasan akun kamu bisa diretas dalam 5 menit.",
    interruptNote: "Gerakan zoom in cepat ke layar laptop + teks tebal warna merah kontras.",
    duration: "42 detik (105 kata · rasio 2.5 kata/detik)",
    sections: [
      {
        label: "Attention (Hook)",
        text: "Kamu masih simpan password penting langsung di autocomplete browser tanpa enkripsi dua arah?",
        broll: "Tangan mengetik cepat di keyboard mechanical RGB ungu (durasi 4 detik)",
      },
      {
        label: "Interest (Masalah Nyata)",
        text: "Banyak malware tipe info-stealer bisa mengekstrak seluruh cache kredensial hanya lewat satu ekstensi mencurigakan yang kamu install tanpa sadar.",
        broll: "Layar monitor menampilkan kode terminal merah scanning ports (durasi 6 detik)",
      },
      {
        label: "Desire (Solusi Praktis)",
        text: "Solusi termudah: aktifkan Master Password di browser kamu sekarang atau pindahkan semua akun utama ke password manager opensource terenkripsi.",
        broll: "Tampilan desktop setup minimalis dengan pencahayaan lampu studio hangat (durasi 5 detik)",
      },
      {
        label: "Action (CTA)",
        text: "Simpan dulu postingan ini sekarang, kamu pasti butuh checklist-nya saat setup laptop baru nanti!",
        broll: "Ikon bookmark beranimasi halus di layar (durasi 3 detik)",
      },
    ],
    cta: "Simpan postingan ini sekarang, kamu pasti butuh checklist-nya saat setup laptop baru nanti!",
  };

  const handleCopyScript = () => {
    const fullText = `[JUDUL]: ${sampleScript.title}
[PLATFORM]: ${sampleScript.platform}
[PILAR]: ${sampleScript.pillar}

[HOOK (0-3 detik)]:
"${sampleScript.hook}"
Catatan Interupsi: ${sampleScript.interruptNote}

[STRUKTUR NASKAH]:
1. Attention:
${sampleScript.sections[0].text}
(B-roll: ${sampleScript.sections[0].broll})

2. Interest:
${sampleScript.sections[1].text}
(B-roll: ${sampleScript.sections[1].broll})

3. Desire:
${sampleScript.sections[2].text}
(B-roll: ${sampleScript.sections[2].broll})

4. Action (CTA):
${sampleScript.sections[3].text}

[ESTIMASI DURASI]: ${sampleScript.duration}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Contoh skrip berhasil disalin ke clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 px-6">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[hsl(262,83%,68%)]/12 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-[hsl(190,90%,55%)]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[hsl(262,83%,68%)]/15 border border-[hsl(262,83%,68%)]/30 text-xs font-semibold text-[hsl(262,83%,75%)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Studio Skrip Modular untuk Kreator Video Pendek</span>
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Rakit Skrip Reels & TikTok Siap Rekam dalam{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(262,83%,68%)] via-white to-[hsl(190,90%,55%)]">
              Kurang dari 10 Menit
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[hsl(225,12%,65%)] max-w-3xl mx-auto leading-relaxed">
            Stop kehabisan ide atau menulis ulang dari nol. Pilih hook pembuka berdaya
            pikat, pasang formula penulisan teruji, selaraskan rekaman latar B-roll 9:16,
            dan tentukan CTA konversi yang mendorong audiens bertindak.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="gap-2.5 text-base px-8 font-semibold shadow-[0_0_28px_rgba(157,98,247,0.45)]"
            >
              <span>Mulai Susun Skrip Gratis</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/library/hook")}
              className="text-base px-6 gap-2"
            >
              <Flame className="h-4 w-4 text-[hsl(0,75%,62%)]" />
              <span>Eksplor Library Hook</span>
            </Button>
          </div>

          {/* Social Proof / Stats Ticker */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-[hsl(230,15%,22%)]/60">
            <div>
              <div className="font-heading text-2xl font-bold text-white">&lt; 10 Menit</div>
              <div className="text-xs text-[hsl(225,12%,60%)]">Satu Skrip Rampung</div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-[hsl(190,90%,55%)]">8 Formula</div>
              <div className="text-xs text-[hsl(225,12%,60%)]">AIDA, PAS, BAB, dll.</div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-[hsl(262,83%,68%)]">1–3 Detik</div>
              <div className="text-xs text-[hsl(225,12%,60%)]">Interupsi Pola Hook</div>
            </div>
            <div>
              <div className="font-heading text-2xl font-bold text-[hsl(152,60%,50%)]">100% Faceless</div>
              <div className="text-xs text-[hsl(225,12%,60%)]">Siap B-roll 9:16</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FITUR STUDIO MODULAR */}
      <section id="fitur" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="edukasi">Arsitektur Modular</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            5 Langkah Alur Terstruktur Tanpa Tebak-tebakan
          </h2>
          <p className="text-sm text-[hsl(225,12%,65%)]">
            Setiap video pendek berkinerja tinggi tersusun dari komponen terukur yang
            dapat Anda pasang lepas seperti lego.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="p-5 space-y-3 relative group hover:border-[hsl(190,90%,55%)]/40 transition-colors">
            <div className="font-mono text-xs text-[hsl(190,90%,55%)] font-bold">LANGKAH 01</div>
            <h3 className="font-heading font-semibold text-white text-base">Ide & Audiens</h3>
            <p className="text-xs text-[hsl(225,12%,65%)] leading-relaxed">
              Tentukan pilar konten (Edukasi, Inspirasi, Promosi, BTS) dan target persona penonton.
            </p>
          </Card>

          <Card className="p-5 space-y-3 relative group hover:border-[hsl(0,75%,62%)]/40 transition-colors">
            <div className="font-mono text-xs text-[hsl(0,75%,62%)] font-bold">LANGKAH 02</div>
            <h3 className="font-heading font-semibold text-white text-base">Hook Pembuka</h3>
            <p className="text-xs text-[hsl(225,12%,65%)] leading-relaxed">
              Terapkan interupsi pola 1–3 detik pertama (Kesalahan Fatal, Kontroversial, atau Studi Kasus).
            </p>
          </Card>

          <Card className="p-5 space-y-3 relative group hover:border-[hsl(262,83%,68%)]/40 transition-colors">
            <div className="font-mono text-xs text-[hsl(262,83%,68%)] font-bold">LANGKAH 03</div>
            <h3 className="font-heading font-semibold text-white text-base">Formula Naskah</h3>
            <p className="text-xs text-[hsl(225,12%,65%)] leading-relaxed">
              Kembangkan struktur tubuh skrip memakai kerangka AIDA, PAS, The Playbook, atau Hero's Journey.
            </p>
          </Card>

          <Card className="p-5 space-y-3 relative group hover:border-[hsl(165,75%,45%)]/40 transition-colors">
            <div className="font-mono text-xs text-[hsl(165,75%,45%)] font-bold">LANGKAH 04</div>
            <h3 className="font-heading font-semibold text-white text-base">B-roll 9:16</h3>
            <p className="text-xs text-[hsl(225,12%,65%)] leading-relaxed">
              Petakan panduan visual rekaman latar faceless sesuai ritme tempo narasi tiap bagian.
            </p>
          </Card>

          <Card className="p-5 space-y-3 relative group hover:border-[hsl(38,92%,60%)]/40 transition-colors">
            <div className="font-mono text-xs text-[hsl(38,92%,60%)] font-bold">LANGKAH 05</div>
            <h3 className="font-heading font-semibold text-white text-base">CTA Berdaya Dorong</h3>
            <p className="text-xs text-[hsl(225,12%,65%)] leading-relaxed">
              Pasang ajakan spesifik: Save Bookmark, DM Lead Gen berkode khusus, atau adu opini viral.
            </p>
          </Card>
        </div>
      </section>

      {/* 3. TIGA GAYA JUALAN (Bab 4 & Bab 6) */}
      <section id="gaya-jualan" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="inspirasi">Pondasi Bisnis Konten</Badge>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
            3 Gaya Jualan yang Menentukan Alur & Nada Skrip
          </h2>
          <p className="text-sm text-[hsl(225,12%,65%)]">
            Narativa secara otomatis menyesuaikan alur tahapan formula dan gaya CTA
            berdasarkan pilihan gaya jualan Anda.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="h-12 p-1.5 bg-[hsl(230,22%,10%)] border border-[hsl(230,15%,22%)]">
              <TabsTrigger value="soft" className="px-6 py-2 text-sm">
                Soft Selling (Edukasi & Nilai)
              </TabsTrigger>
              <TabsTrigger value="hard" className="px-6 py-2 text-sm">
                Hard Selling (Tegas & Konversi)
              </TabsTrigger>
              <TabsTrigger value="story" className="px-6 py-2 text-sm">
                Storyteller (Empati & Narasi)
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="soft">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2">
                  <Badge variant="edukasi">Cocok untuk Ahli & Edukator</Badge>
                  <span className="text-xs text-[hsl(225,12%,50%)] font-mono">Format AIDA / 4P</span>
                </div>
                <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white">
                  Membangun Kredibilitas Tanpa Terkesan Memaksa
                </h3>
                <p className="text-sm text-[hsl(225,12%,65%)] leading-relaxed">
                  Menempatkan masalah penonton di depan, memberikan tips bernilai tinggi
                  yang langsung bisa dipraktikkan, lalu menutup dengan CTA lembut tanpa
                  paksaan beli.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-[hsl(220,20%,90%)]">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(190,90%,55%)] shrink-0 mt-0.5" />
                    <span><strong>Alur Baku:</strong> Hook Pain Point $\rightarrow$ Eksplorasi Masalah $\rightarrow$ Nilai Edukasi $\rightarrow$ Bukti Sosial $\rightarrow$ Soft CTA.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[hsl(220,20%,90%)]">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(190,90%,55%)] shrink-0 mt-0.5" />
                    <span><strong>Gaya CTA:</strong> Santai dan sukarela: <em>"Link lengkap ada di bio kalau butuh, boleh dicek kapan saja."</em></span>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-[hsl(230,22%,8%)] border-[hsl(230,15%,22%)] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[hsl(225,12%,55%)]">
                  <span>Pratinjau Pola Soft Selling</span>
                  <Badge variant="edukasi">Edu-Reels</Badge>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(190,90%,55%)]">
                    <span className="text-[hsl(190,90%,55%)] font-bold">HOOK:</span> "Banyak developer pemula buang waktu berjam-jam cari tutorial yang sebenarnya sudah usang..."
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(262,83%,68%)]">
                    <span className="text-[hsl(262,83%,68%)] font-bold">NILAI:</span> "Gunakan 3 dokumentasi resmi ini. Semuanya gratis dan langsung ada panduan interaktif."
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(152,60%,50%)]">
                    <span className="text-[hsl(152,60%,50%)] font-bold">CTA:</span> "Simpan dulu postingan ini, kamu pasti butuh saat setup project baru nanti."
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="hard">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2">
                  <Badge variant="promosi">Cocok untuk Flash Sale & Produk</Badge>
                  <span className="text-xs text-[hsl(225,12%,50%)] font-mono">Format PAS / Direct</span>
                </div>
                <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white">
                  Tegas, Mendesak, & Berorientasi Konversi Langsung
                </h3>
                <p className="text-sm text-[hsl(225,12%,65%)] leading-relaxed">
                  Menampilkan fisik produk atau benefit utama di 2 detik pertama, memaparkan
                  alasan kenapa harus beli sekarang, dan langsung mengarahkan ke keranjang belanja.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-[hsl(220,20%,90%)]">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(38,92%,60%)] shrink-0 mt-0.5" />
                    <span><strong>Alur Baku:</strong> Visual Produk $\rightarrow$ Headline Pancingan $\rightarrow$ Penjelasan Singkat $\rightarrow$ Urgensi Promo $\rightarrow$ CTA Tegas.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[hsl(220,20%,90%)]">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(38,92%,60%)] shrink-0 mt-0.5" />
                    <span><strong>Gaya CTA:</strong> Desakan jelas: <em>"Klik tombol keranjang kuning sekarang sebelum promo diskon habis malam ini!"</em></span>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-[hsl(230,22%,8%)] border-[hsl(230,15%,22%)] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[hsl(225,12%,55%)]">
                  <span>Pratinjau Pola Hard Selling</span>
                  <Badge variant="promosi">TikTok Shop</Badge>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(38,92%,60%)]">
                    <span className="text-[hsl(38,92%,60%)] font-bold">HOOK:</span> "Jangan beli mechanical keyboard ini kalau kamu belum siap produktivitas ngetik kamu naik 2x lipat!"
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(0,75%,62%)]">
                    <span className="text-[hsl(0,75%,62%)] font-bold">URGENSI:</span> "Stok batch impor ini cuma tersisa 15 unit dengan diskon voucher 40%."
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(38,92%,60%)]">
                    <span className="text-[hsl(38,92%,60%)] font-bold">CTA:</span> "Klik tombol keranjang kuning di kiri bawah sekarang sebelum kehabisan!"
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="story">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2">
                  <Badge variant="inspirasi">Cocok untuk Personal Branding</Badge>
                  <span className="text-xs text-[hsl(225,12%,50%)] font-mono">Format Hero's Journey</span>
                </div>
                <h3 className="font-heading text-2xl lg:text-3xl font-bold text-white">
                  Kisah Transformasi Personal yang Menggugah Emosi
                </h3>
                <p className="text-sm text-[hsl(225,12%,65%)] leading-relaxed">
                  Menuturkan perjalanan dari titik terendah (kegagalan/kesulitan), konflik
                  utama yang dihadapi, hingga momen eureka penemuan solusi dan pesan moral.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3 text-sm text-[hsl(220,20%,90%)]">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(262,83%,68%)] shrink-0 mt-0.5" />
                    <span><strong>Alur Baku:</strong> Karakter $\rightarrow$ Konteks (What-Why) $\rightarrow$ Konflik (Hero vs Villain) $\rightarrow$ Klimaks $\rightarrow$ Kesimpulan.</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-[hsl(220,20%,90%)]">
                    <CheckCircle2 className="h-5 w-5 text-[hsl(262,83%,68%)] shrink-0 mt-0.5" />
                    <span><strong>Gaya CTA:</strong> Diskusi hangat: <em>"Pernah berada di posisi yang sama saat mulai merintis? Ceritakan di kolom komentar."</em></span>
                  </div>
                </div>
              </div>

              <Card className="p-6 bg-[hsl(230,22%,8%)] border-[hsl(230,15%,22%)] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[hsl(225,12%,55%)]">
                  <span>Pratinjau Pola Storyteller</span>
                  <Badge variant="inspirasi">Narasi Personal</Badge>
                </div>
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(262,83%,68%)]">
                    <span className="text-[hsl(262,83%,68%)] font-bold">HOOK:</span> "Tiga tahun lalu tabungan saya tersisa Rp 200 ribu, dan saya hampir berhenti ngoding selamanya..."
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(190,90%,55%)]">
                    <span className="text-[hsl(190,90%,55%)] font-bold">KLIMAKS:</span> "Satu email penolakan ke-57 justru membuka mata saya soal cara bangun portfolio yang benar."
                  </div>
                  <div className="p-3 rounded-lg bg-[hsl(230,22%,12%)] border-l-2 border-[hsl(262,83%,68%)]">
                    <span className="text-[hsl(262,83%,68%)] font-bold">CTA:</span> "Pernah di posisi yang sama saat merintis? Ceritakan pengalaman kamu di bawah."
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* 4. CONTOH SKRIP NYATA (Interactive Teleprompter Preview) */}
      <section id="contoh" className="max-w-7xl mx-auto px-6 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="edukasi">Pratinjau Studio Siap Rekam</Badge>
            <h2 className="font-heading text-3xl font-bold text-white">
              Contoh Skrip Lengkap Berstandar Produksi
            </h2>
            <p className="text-sm text-[hsl(225,12%,65%)] max-w-xl">
              Lihat bagaimana ide, hook interupsi, struktur AIDA, dan arahan visual B-roll 9:16 dirangkai utuh tanpa placeholder.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyScript}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              <span>{copied ? "Tersalin!" : "Salin Skrip Ini"}</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-1.5"
            >
              <span>Buka di Wizard</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Script breakdown list (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="p-6 border-[hsl(230,15%,22%)] space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[hsl(230,15%,22%)]/60 pb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    {sampleScript.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[hsl(225,12%,60%)] font-mono">
                    <span>{sampleScript.platform}</span>
                    <span>·</span>
                    <span>{sampleScript.pillar}</span>
                    <span>·</span>
                    <span>{sampleScript.salesStyle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,22%)] text-xs font-mono text-[hsl(190,90%,55%)]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>~42 Detik</span>
                </div>
              </div>

              {/* Hook Banner */}
              <div className="p-4 rounded-xl bg-[hsl(0,75%,62%)]/10 border border-[hsl(0,75%,62%)]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="kesalahan">Hook Interupsi (0–3 Detik)</Badge>
                  <span className="text-xs font-mono text-[hsl(0,75%,68%)]">Batas 120 Karakter</span>
                </div>
                <p className="font-mono text-sm text-white font-semibold">
                  "{sampleScript.hook}"
                </p>
                <p className="text-xs text-[hsl(225,12%,65%)] flex items-center gap-1.5 pt-1">
                  <Flame className="h-3.5 w-3.5 text-[hsl(0,75%,62%)]" />
                  <span>Arahan Visual: {sampleScript.interruptNote}</span>
                </p>
              </div>

              {/* Script Sections */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-[hsl(220,20%,90%)] uppercase tracking-wider font-mono">
                  Tubuh Skrip (Formula AIDA)
                </h4>

                {sampleScript.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,22%)]/60 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-xs font-bold text-[hsl(262,83%,68%)]">
                        Langkah {idx + 1}: {section.label}
                      </span>
                      <span className="text-[11px] font-mono text-[hsl(225,12%,50%)]">
                        {section.text.split(" ").length} kata
                      </span>
                    </div>
                    <p className="text-sm text-[hsl(220,20%,95%)] leading-relaxed">
                      "{section.text}"
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-xs text-[hsl(165,75%,50%)] bg-[hsl(165,75%,45%)]/10 px-3 py-1.5 rounded-lg border border-[hsl(165,75%,45%)]/20">
                      <Video className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono">Arahan B-roll: {section.broll}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Box */}
              <div className="p-4 rounded-xl bg-[hsl(38,92%,60%)]/10 border border-[hsl(38,92%,60%)]/30 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="promosi">Call to Action (Save & Bookmark)</Badge>
                  <Bookmark className="h-4 w-4 text-[hsl(38,92%,60%)]" />
                </div>
                <p className="text-sm text-white font-medium">
                  "{sampleScript.cta}"
                </p>
              </div>
            </Card>
          </div>

          {/* 9:16 Teleprompter Device Preview (4 cols) */}
          <div className="lg:col-span-4 sticky top-24">
            <div className="rounded-3xl border-2 border-[hsl(230,15%,24%)] bg-[hsl(230,25%,4%)] p-3 shadow-2xl shadow-[hsl(262,83%,68%)]/15">
              {/* Phone Speaker & Notch */}
              <div className="flex justify-center mb-3">
                <div className="h-3.5 w-24 rounded-full bg-[hsl(230,20%,12%)]" />
              </div>

              {/* 9:16 Teleprompter Screen */}
              <div className="aspect-[9/16] rounded-2xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)] p-5 flex flex-col justify-between overflow-hidden relative">
                {/* Background video overlay mockup */}
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(230,25%,6%)] via-[hsl(230,25%,6%)]/80 to-[hsl(230,25%,6%)]/40 pointer-events-none" />

                {/* Top header stats */}
                <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[hsl(225,12%,65%)]">
                  <span className="flex items-center gap-1 text-[hsl(0,75%,62%)]">
                    <span className="h-2 w-2 rounded-full bg-[hsl(0,75%,62%)] animate-pulse" />
                    REC 00:24
                  </span>
                  <span>9:16 · Reels</span>
                </div>

                {/* Teleprompter Running Text */}
                <div className="relative z-10 space-y-4 my-auto text-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[hsl(190,90%,55%)] bg-[hsl(190,90%,55%)]/15 px-2.5 py-1 rounded-full">
                    Bagian 2: Interest
                  </span>
                  <p className="font-heading text-base font-bold text-white leading-snug drop-shadow-md">
                    "Banyak malware tipe info-stealer bisa mengekstrak seluruh cache kredensial..."
                  </p>
                  <p className="font-mono text-xs text-[hsl(225,12%,70%)]">
                    (B-roll: Layar monitor scanning merah)
                  </p>
                </div>

                {/* Bottom Controls */}
                <div className="relative z-10 flex items-center justify-between pt-4 border-t border-[hsl(230,15%,22%)]/60 text-xs">
                  <div className="flex items-center gap-1.5 text-white font-mono">
                    <Clock className="h-3.5 w-3.5 text-[hsl(262,83%,68%)]" />
                    <span>2.5 kata/dtk</span>
                  </div>
                  <Badge variant="final" className="text-[10px]">Siap Rekam</Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA SECTION (Daftar Sekarang) */}
      <section className="max-w-5xl mx-auto px-6">
        <div className="rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-[hsl(230,22%,12%)] to-[hsl(230,22%,8%)] border border-[hsl(262,83%,68%)]/40 text-center space-y-6 shadow-[0_0_50px_-10px_rgba(157,98,247,0.3)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(262,83%,68%)]/15 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[hsl(190,90%,55%)]/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
              Siap Produksi Video Pendek Berdaya Konversi?
            </h2>
            <p className="text-sm sm:text-base text-[hsl(225,12%,65%)] max-w-xl mx-auto">
              Masuk ke studio sekarang tanpa kartu kredit. Gunakan template hook,
              formula penulisan, dan library CTA siap pakai gratis.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/daftar")}
              className="px-8 font-semibold shadow-[0_0_24px_rgba(157,98,247,0.5)]"
            >
              Daftar Akun Kreator Gratis
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate("/masuk")}
            >
              Sudah Punya Akun? Masuk
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
