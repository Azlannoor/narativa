import React from "react";
import { useNavigation } from "@/src/context/navigation-context";
import {
  Button,
  Card,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/src/components/ui";
import {
  Plus,
  ArrowRight,
  Lightbulb,
  Flame,
  MousePointerClick,
  Layers,
  Video,
  FileText,
  Clock,
  Sparkles,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { useScripts } from "@/src/context/scripts-context";
import { toast } from "@/src/components/ui/sonner";

export function DashboardPage() {
  const { navigate, user } = useNavigation();
  const { scripts, dailyQuota } = useScripts();

  const totalScripts = scripts.length;
  const finalScripts = scripts.filter((s) => s.status === "final").length;
  const draftScripts = scripts.filter((s) => s.status === "draft").length;
  const avgDuration =
    totalScripts > 0
      ? Math.round(
          scripts.reduce((acc, s) => acc + (s.estimatedDurationSec || 30), 0) /
            totalScripts
        )
      : 0;

  return (
    <div className="space-y-10 animate-in fade-in-0 duration-200">
      {/* 1. Welcoming Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[hsl(230,15%,22%)]/80 bg-gradient-to-r from-[hsl(230,22%,12%)] via-[hsl(230,22%,9%)] to-[hsl(262,83%,68%)]/15 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="inspirasi">Ruang Kerja Kreator</Badge>
              <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
                Batas Harian: {dailyQuota.used}/{dailyQuota.limit} Skrip Digunakan
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
              Halo, {user.displayName || "Rina Setyowati"} 👋
            </h1>
            <p className="text-sm text-[hsl(225,12%,65%)] leading-relaxed">
              Siap memproduksi skrip baru hari ini? Pilih ide pilar atau langsung pakai formula
              AIDA untuk merakit naskah siap rekam dalam kurang dari 10 menit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={() => navigate("/library/hook")}
              className="gap-2"
            >
              <Flame className="h-4 w-4 text-[hsl(0,75%,62%)]" />
              <span>Cari Hook</span>
            </Button>
            <Button
              variant="default"
              size="default"
              onClick={() => navigate("/skrip/baru")}
              className="gap-2 font-semibold shadow-[0_0_24px_rgba(157,98,247,0.4)]"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Skrip Baru</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Ringkasan Metrik Singkat Terhubung ke Database */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 space-y-1">
          <span className="text-xs text-[hsl(225,12%,60%)] font-medium">Total Skrip Saya</span>
          <div className="font-heading text-2xl font-bold text-white">{totalScripts} Skrip</div>
          <span className="text-[11px] text-[hsl(152,60%,55%)] flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> {finalScripts} siap rekam (Final)
          </span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs text-[hsl(225,12%,60%)] font-medium">Draf Dalam Proses</span>
          <div className="font-heading text-2xl font-bold text-[hsl(190,90%,55%)]">{draftScripts} Draf</div>
          <span className="text-[11px] text-[hsl(225,12%,50%)]">Siap disunting di editor</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs text-[hsl(225,12%,60%)] font-medium">Rata-rata Durasi</span>
          <div className="font-heading text-2xl font-bold text-[hsl(262,83%,68%)]">{avgDuration} Detik</div>
          <span className="text-[11px] text-[hsl(225,12%,50%)] font-mono">Format Reels & TikTok (2.5 kata/s)</span>
        </Card>

        <Card className="p-5 space-y-1">
          <span className="text-xs text-[hsl(225,12%,60%)] font-medium">Sisa Kuota Harian</span>
          <div className="font-heading text-2xl font-bold text-[hsl(38,92%,60%)]">{dailyQuota.remaining} / {dailyQuota.limit}</div>
          <span className="text-[11px] text-[hsl(225,12%,50%)]">Reset pukul 00:00 WIB</span>
        </Card>
      </div>

      {/* 3. Shortcut Seluruh 5 Library */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-white">
              Shortcut Modul Perpustakaan
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Eksplor komponen modular untuk dimasukkan ke dalam skrip Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card
            interactive
            onClick={() => navigate("/library/ide")}
            className="p-5 space-y-3 border-l-4 border-l-[hsl(190,90%,55%)]"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-[hsl(190,90%,55%)]/15 flex items-center justify-center text-[hsl(190,90%,55%)]">
                <Lightbulb className="h-4 w-4" />
              </div>
              <Badge variant="edukasi">8 Ide</Badge>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white text-base">Library Ide</h3>
              <p className="text-xs text-[hsl(225,12%,65%)] mt-1">
                Filter pilar & format platform
              </p>
            </div>
          </Card>

          <Card
            interactive
            onClick={() => navigate("/library/hook")}
            className="p-5 space-y-3 border-l-4 border-l-[hsl(0,75%,62%)]"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-[hsl(0,75%,62%)]/15 flex items-center justify-center text-[hsl(0,75%,62%)]">
                <Flame className="h-4 w-4" />
              </div>
              <Badge variant="kesalahan">6 Hook</Badge>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white text-base">Library Hook</h3>
              <p className="text-xs text-[hsl(225,12%,65%)] mt-1">
                Interupsi 1–3 detik berdaya pikat
              </p>
            </div>
          </Card>

          <Card
            interactive
            onClick={() => navigate("/library/cta")}
            className="p-5 space-y-3 border-l-4 border-l-[hsl(38,92%,60%)]"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-[hsl(38,92%,60%)]/15 flex items-center justify-center text-[hsl(38,92%,60%)]">
                <MousePointerClick className="h-4 w-4" />
              </div>
              <Badge variant="promosi">7 CTA</Badge>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white text-base">Library CTA</h3>
              <p className="text-xs text-[hsl(225,12%,65%)] mt-1">
                Save, DM lead gen, & engagement
              </p>
            </div>
          </Card>

          <Card
            interactive
            onClick={() => navigate("/library/formula")}
            className="p-5 space-y-3 border-l-4 border-l-[hsl(262,83%,68%)]"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-[hsl(262,83%,68%)]/15 flex items-center justify-center text-[hsl(262,83%,68%)]">
                <Layers className="h-4 w-4" />
              </div>
              <Badge variant="inspirasi">8 Formula</Badge>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white text-base">Formula Naskah</h3>
              <p className="text-xs text-[hsl(225,12%,65%)] mt-1">
                AIDA, PAS, BAB, Hero's Journey
              </p>
            </div>
          </Card>

          <Card
            interactive
            onClick={() => navigate("/library/broll")}
            className="p-5 space-y-3 border-l-4 border-l-[hsl(165,75%,45%)]"
          >
            <div className="flex items-center justify-between">
              <div className="h-9 w-9 rounded-xl bg-[hsl(165,75%,45%)]/15 flex items-center justify-center text-[hsl(165,75%,45%)]">
                <Video className="h-4 w-4" />
              </div>
              <Badge variant="bts">6 B-roll</Badge>
            </div>
            <div>
              <h3 className="font-heading font-semibold text-white text-base">B-roll 9:16</h3>
              <p className="text-xs text-[hsl(225,12%,65%)] mt-1">
                Rekaman latar faceless Bunny
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* 4. Daftar Skrip Terbaru */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-bold text-white">
              Skrip Terbaru Milik Anda
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Draf dan naskah final yang siap direkam atau disunting.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/skrip")}
            className="text-xs gap-1"
          >
            <span>Lihat Semua Skrip</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Skrip</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Pilar</TableHead>
                <TableHead>Gaya Jualan</TableHead>
                <TableHead>Durasi Estimasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scripts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-sm text-[hsl(225,12%,60%)]">
                    Belum ada skrip yang dibuat. Klik tombol <strong>Buat Skrip Baru</strong> untuk mulai merakit naskah Anda!
                  </TableCell>
                </TableRow>
              ) : (
                scripts.slice(0, 5).map((script) => (
                  <TableRow key={script.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-sm">
                        {script.title}
                      </span>
                      <span className="text-xs text-[hsl(225,12%,50%)] font-mono">
                        Diperbarui: {script.updatedAt}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize text-xs">
                      {script.platform.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        script.pillar === "edukasi"
                          ? "edukasi"
                          : script.pillar === "inspirasi"
                          ? "inspirasi"
                          : script.pillar === "promosi"
                          ? "promosi"
                          : "bts"
                      }
                      className="capitalize text-xs"
                    >
                      {script.pillar.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs text-[hsl(225,12%,65%)] capitalize font-mono">
                      {script.salesStyle.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-[hsl(190,90%,55%)]">
                      ~{script.estimatedDurationSec} detik ({script.wordCount} kata)
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={script.status === "final" ? "final" : "draft"}
                      className="text-xs capitalize"
                    >
                      {script.status === "final" ? "Siap Rekam" : "Draf"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/skrip/${script.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/skrip/${script.id}/pratinjau`)}
                      >
                        Pratinjau
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
