import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@/src/context/navigation-context";
import { useScripts, type FullScript } from "@/src/context/scripts-context";
import {
  Button,
  Card,
  Badge,
} from "@/src/components/ui";
import {
  ArrowLeft,
  Copy,
  Download,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Video,
  Flame,
  MousePointerClick,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { toast } from "@/src/components/ui/sonner";
import { sanitizePlainText } from "@/src/lib/security";

export function ScriptPreviewPage({ scriptId }: { scriptId: string }) {
  const { navigate } = useNavigation();
  const { getScript } = useScripts();

  const script = getScript(scriptId);

  // Teleprompter Auto-scroll control
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(2); // 1 to 4
  const teleprompterRef = useRef<HTMLDivElement>(null);

  // Auto-scrolling loop
  useEffect(() => {
    let animationFrameId: number;
    const scrollStep = () => {
      if (isPlaying && teleprompterRef.current) {
        teleprompterRef.current.scrollTop += scrollSpeed * 0.8;
      }
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(scrollStep);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, scrollSpeed]);

  const handleResetScroll = () => {
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0;
    }
    setIsPlaying(false);
  };

  // Compile full text and markdown formats for download
  const generatePlainText = () => {
    if (!script) return "";
    const cleanTitle = sanitizePlainText(script.title);
    const cleanHook = sanitizePlainText(script.hookText);
    const cleanInterrupt = sanitizePlainText(script.interruptNote || "");
    const cleanCta = sanitizePlainText(script.ctaText);
    const cleanTarget = sanitizePlainText(script.targetAudience || "");

    return `========================================
NARATIVA SCRIPT STUDIO — SIAP REKAM
========================================
Judul: ${cleanTitle}
Platform: ${script.platform.toUpperCase()}
Pilar: ${script.pillar.toUpperCase()}
Gaya Jualan: ${script.salesStyle.toUpperCase()}
Estimasi Durasi: ~${script.estimatedDurationSec} Detik (${script.wordCount} Kata)
Target Audiens: ${cleanTarget}

----------------------------------------
[HOOK PEMBUKA (0–3 Detik)]:
"${cleanHook}"
Petunjuk Visual: ${cleanInterrupt}
----------------------------------------

[TUBUH NASKAH]:
${script.sections
  .map(
    (s, idx) => `
Langkah ${idx + 1} (${sanitizePlainText(s.label)}):
"${sanitizePlainText(s.content)}"
[Arahan B-roll 9:16: ${s.brollIds.join(", ") || "Visual Setup"}]
(Estimasi: ~${s.estimatedSec}s)`
  )
  .join("\n")}

----------------------------------------
[CALL TO ACTION (CTA)]:
"${cleanCta}"
----------------------------------------
Dibuat di Narativa Studio — https://narativa.id`;
  };

  const generateMarkdown = () => {
    if (!script) return "";
    const cleanTitle = sanitizePlainText(script.title);
    const cleanHook = sanitizePlainText(script.hookText);
    const cleanInterrupt = sanitizePlainText(script.interruptNote || "");
    const cleanCta = sanitizePlainText(script.ctaText);

    return `# ${cleanTitle}

> **Platform:** ${script.platform} | **Pilar:** ${script.pillar} | **Gaya:** ${script.salesStyle}
> **Durasi:** ~${script.estimatedDurationSec}s (${script.wordCount} kata)

---

## ⚡ Hook Interupsi (0–3 Detik)
> **"${cleanHook}"**

*Petunjuk Visual:* ${cleanInterrupt}

---

## 📝 Tubuh Naskah

${script.sections
  .map(
    (s, idx) => `### ${idx + 1}. ${sanitizePlainText(s.label)}
${sanitizePlainText(s.content)}

*🎬 B-roll Rekaman:* \`${s.brollIds.join(", ") || "Default B-roll"}\` (~${s.estimatedSec} detik)
`
  )
  .join("\n")}

---

## 🎯 Call to Action (CTA)
> **"${cleanCta}"**

---
*Dibuat dengan Narativa Studio (MVP 1.0)*`;
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generatePlainText());
    toast.success("Naskah lengkap berhasil disalin ke clipboard!");
  };

  const handleDownloadTxt = () => {
    const text = generatePlainText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${script?.title.toLowerCase().replace(/[^a-z0-9]/g, "-") || "skrip"}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File .txt berhasil diunduh!");
  };

  const handleDownloadMd = () => {
    const text = generateMarkdown();
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${script?.title.toLowerCase().replace(/[^a-z0-9]/g, "-") || "skrip"}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File .md (Markdown) berhasil diunduh!");
  };

  if (!script) {
    return (
      <div className="p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Skrip Tidak Ditemukan</h2>
        <Button onClick={() => navigate("/skrip")}>Kembali ke Daftar Skrip</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in-0 duration-200">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="final">Mode Teleprompter Siap Rekam</Badge>
            <span className="text-xs font-mono text-[hsl(190,90%,55%)]">
              ~{script.estimatedDurationSec} Detik · {script.wordCount} Kata
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            {script.title}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/skrip/${scriptId}`)}
            className="text-xs gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Edit Naskah</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyAll}
            className="text-xs gap-1.5"
          >
            <Copy className="h-4 w-4" />
            <span>Salin Semua</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTxt}
            className="text-xs gap-1.5"
          >
            <Download className="h-4 w-4" />
            <span>Unduh .txt</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={handleDownloadMd}
            className="text-xs gap-1.5 font-semibold"
          >
            <Download className="h-4 w-4" />
            <span>Unduh .md</span>
          </Button>
        </div>
      </div>

      {/* Teleprompter Auto-Scroll Controller Toolbar */}
      <Card className="p-4 bg-[hsl(230,22%,8%)] border-[hsl(230,15%,22%)] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant={isPlaying ? "destructive" : "default"}
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="gap-2 font-semibold"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isPlaying ? "Jeda Gulir (Pause)" : "Mulai Auto-Scroll"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetScroll}
            className="gap-1.5 text-xs text-[hsl(225,12%,65%)]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Ulang dari Awal</span>
          </Button>
        </div>

        {/* Speed Controller */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-[hsl(225,12%,60%)] font-mono">Kecepatan Baca:</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => setScrollSpeed(spd)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  scrollSpeed === spd
                    ? "bg-[hsl(262,83%,68%)] text-white font-bold"
                    : "bg-[hsl(230,20%,14%)] text-[hsl(225,12%,60%)] hover:text-white"
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Teleprompter Display Screen (High Legibility & Contrast) */}
      <div
        ref={teleprompterRef}
        className="max-h-[600px] overflow-y-auto rounded-3xl border-2 border-[hsl(230,15%,24%)] bg-[hsl(230,25%,4%)] p-8 sm:p-14 space-y-12 shadow-2xl relative scroll-smooth"
      >
        {/* Prompter Header Cue */}
        <div className="text-center space-y-2 pb-6 border-b border-[hsl(230,15%,20%)]">
          <span className="text-xs font-mono uppercase tracking-widest text-[hsl(190,90%,55%)]">
            ● KAMERA AKTIF · TATAP LENSA ATAS
          </span>
          <h2 className="font-heading text-2xl font-bold text-white">
            {script.title}
          </h2>
        </div>

        {/* 1. Hook Section Cue */}
        <div className="space-y-3 p-6 rounded-2xl bg-[hsl(0,75%,62%)]/10 border border-[hsl(0,75%,62%)]/30">
          <div className="flex items-center justify-between text-xs font-mono text-[hsl(0,75%,68%)]">
            <span className="flex items-center gap-1.5 font-bold uppercase">
              <Flame className="h-4 w-4" /> 00:00 – 00:03 · HOOK INTERUPSI
            </span>
            <span>1–3 DETIK</span>
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-white leading-relaxed">
            "{script.hookText}"
          </p>
          <div className="text-xs text-[hsl(225,12%,70%)] pt-1 flex items-center gap-2">
            <Video className="h-3.5 w-3.5 text-[hsl(0,75%,62%)]" />
            <span>Petunjuk Interupsi: {script.interruptNote}</span>
          </div>
        </div>

        {/* 2. Formula Body Sections */}
        <div className="space-y-10">
          {script.sections.map((sec, idx) => (
            <div
              key={sec.id}
              className="space-y-4 p-6 rounded-2xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)]"
            >
              <div className="flex items-center justify-between text-xs font-mono text-[hsl(262,83%,75%)]">
                <span className="font-bold uppercase">
                  BAGIAN {idx + 1}: {sec.label}
                </span>
                <span className="text-[hsl(190,90%,55%)]">
                  ~{sec.estimatedSec} DETIK REKAMAN
                </span>
              </div>

              <p className="font-sans text-xl sm:text-2xl font-medium text-white leading-relaxed">
                "{sec.content}"
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-[hsl(165,75%,50%)] font-mono">
                <Video className="h-3.5 w-3.5" />
                <span>B-roll Pendukung: {sec.brollIds.join(", ") || "Faceless Desk"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Final CTA Cue */}
        <div className="space-y-3 p-6 rounded-2xl bg-[hsl(38,92%,60%)]/10 border border-[hsl(38,92%,60%)]/30">
          <div className="flex items-center justify-between text-xs font-mono text-[hsl(38,92%,65%)] font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <MousePointerClick className="h-4 w-4" /> PENUTUP · CALL TO ACTION
            </span>
            <span>KONVERSI AKHIR</span>
          </div>
          <p className="font-sans text-2xl sm:text-3xl font-bold text-white leading-relaxed">
            "{script.ctaText}"
          </p>
        </div>

        {/* Prompter Finish Cue */}
        <div className="text-center pt-8 pb-4 border-t border-[hsl(230,15%,20%)] text-xs text-[hsl(225,12%,50%)] font-mono">
          ✓ AKHIR NASKAH · CUT & CEK HASIL TAKE
        </div>
      </div>
    </div>
  );
}
