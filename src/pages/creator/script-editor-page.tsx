import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useNavigation } from "@/src/context/navigation-context";
import { useScripts, type FullScript } from "@/src/context/scripts-context";
import {
  Button,
  Card,
  Badge,
  Input,
  Textarea,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui";
import {
  Save,
  ArrowLeft,
  Eye,
  CheckCircle2,
  Clock,
  Video,
  Flame,
  MousePointerClick,
  Plus,
  Trash2,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Film,
  Sparkles,
  Download,
  Copy,
  Check,
  MoreVertical,
  FileText,
} from "lucide-react";
import { DUMMY_BROLLS } from "@/src/data/dummy-seed";
import { calculateDuration } from "@/src/lib/script-assembler";
import { sanitizePlainText } from "@/src/lib/security";
import { toast } from "@/src/components/ui/sonner";
import {
  BUNNY_STREAM_CDN_HOSTNAME,
  getBunnyThumbnailUrl,
  getBunnyStreamPlayerConfig,
  type BunnyPlayerConfig,
} from "@/src/lib/bunny";

export function ScriptEditorPage({ scriptId }: { scriptId: string }) {
  const { navigate } = useNavigation();
  const { getScript, updateScript, duplicateScript, deleteScript, markScriptFinal } = useScripts();

  const script = getScript(scriptId);

  // State initialized with current script
  const [title, setTitle] = useState(script?.title || "");
  const [hookText, setHookText] = useState(script?.hookText || "");
  const [interruptNote, setInterruptNote] = useState(script?.interruptNote || "");
  const [ctaText, setCtaText] = useState(script?.ctaText || "");
  const [status, setStatus] = useState<"draft" | "final" | "arsip">(script?.status || "draft");

  // Sinkronisasi data jika script dimuat asynchronously dari database
  useEffect(() => {
    if (script) {
      setTitle(script.title);
      setHookText(script.hookText);
      setInterruptNote(script.interruptNote);
      setCtaText(script.ctaText);
      setStatus(script.status);
      if (script.sections && script.sections.length > 0) {
        setSections(script.sections);
      }
    }
  }, [script?.id]);

  const [sections, setSections] = useState(script?.sections || []);

  // Active section highlighted in 9:16 preview
  const [previewActiveSectionIdx, setPreviewActiveSectionIdx] = useState(0);

  // Bunny Stream Signed URL Player State untuk 9:16 Preview
  const [previewMode, setPreviewMode] = useState<"video" | "teleprompter">("video");
  const [signedBrollConfig, setSignedBrollConfig] = useState<BunnyPlayerConfig | null>(null);
  const [isBrollLoading, setIsBrollLoading] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Ambil signed URL dari server untuk B-roll bagian yang sedang aktif
  useEffect(() => {
    const currentBrollId = sections[previewActiveSectionIdx]?.brollIds[0] || "broll-1";
    const dummyMatch = DUMMY_BROLLS.find(
      (b) => b.id === currentBrollId || b.bunnyVideoId === currentBrollId
    );
    const resolvedBunnyId = dummyMatch ? dummyMatch.bunnyVideoId : currentBrollId;

    let isCancelled = false;
    async function fetchSignedBroll() {
      setIsBrollLoading(true);
      try {
        const res = await fetch(`/api/broll?videoId=${encodeURIComponent(resolvedBunnyId)}`);
        if (res.ok) {
          const json = await res.json();
          if (!isCancelled && json.success && json.data) {
            setSignedBrollConfig(json.data);
            setIsBrollLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Server action fallback untuk signed URL:", err);
      }
      if (!isCancelled) {
        setSignedBrollConfig(getBunnyStreamPlayerConfig(resolvedBunnyId));
        setIsBrollLoading(false);
      }
    }

    fetchSignedBroll();
    return () => {
      isCancelled = true;
    };
  }, [previewActiveSectionIdx, sections]);

  // Auto-save debounced simulation
  const [saveIndicator, setSaveIndicator] = useState<string>("Semua perubahan tersimpan");

  const handleUpdateSection = (index: number, content: string) => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const estimatedSec = Math.round(words / 2.5);

    setSections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], content, estimatedSec };
      return next;
    });

    setSaveIndicator("Menyimpan perubahan...");
    setTimeout(() => {
      setSaveIndicator("Semua perubahan tersimpan otomatis");
    }, 400);
  };

  const handleAddSection = () => {
    const newIdx = sections.length + 1;
    setSections((prev) => [
      ...prev,
      {
        id: `sec-${Date.now()}`,
        key: `step_${newIdx}`,
        label: `Langkah Tambahan ${newIdx}`,
        content: "Tambahkan penjelasan atau tips praktis di sini...",
        brollIds: ["broll-1"],
        estimatedSec: 6,
      },
    ]);
    toast.info("Bagian baru ditambahkan.");
  };

  const handleDeleteSection = (index: number) => {
    if (sections.length <= 1) {
      toast.error("Skrip minimal harus memiliki satu bagian naskah.");
      return;
    }
    setSections((prev) => prev.filter((_, idx) => idx !== index));
    toast.info("Bagian naskah dihapus.");
  };

  // Total word and duration count via script-assembler
  const allText = [hookText, ...sections.map((s) => s.content), ctaText].join(" ");
  const totalCharacters = allText.length;
  const { wordCount: totalWords, durationSec: totalEstimatedSec } = calculateDuration(allText);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Helper formatting for plain text and markdown export
  const generatePlainText = () => {
    const cleanTitle = sanitizePlainText(title);
    const cleanHook = sanitizePlainText(hookText);
    const cleanInterrupt = sanitizePlainText(interruptNote || "");
    const cleanCta = sanitizePlainText(ctaText);

    return `========================================
JUDUL: ${cleanTitle}
PLATFORM: ${script?.platform || "instagram_reels"}
PILAR: ${script?.pillar || "edukasi"}
STATUS: ${status.toUpperCase()}
DURASI: ~${totalEstimatedSec} DETIK (${totalWords} KATA)
========================================

[HOOK PEMBUKA (0–3 Detik)]:
"${cleanHook}"
Petunjuk Visual: ${cleanInterrupt}

[TUBUH NASKAH]:
${sections
  .map(
    (s, idx) => `
Langkah ${idx + 1} (${sanitizePlainText(s.label)}):
"${sanitizePlainText(s.content)}"
[Arahan B-roll: ${s.brollIds.join(", ") || "Visual Setup"}]
(Estimasi: ~${s.estimatedSec}s)`
  )
  .join("\n")}

[CALL TO ACTION (CTA)]:
"${cleanCta}"

========================================
Dibuat di Narativa Studio — https://narativa.id`;
  };

  const generateMarkdown = () => {
    const cleanTitle = sanitizePlainText(title);
    const cleanHook = sanitizePlainText(hookText);
    const cleanInterrupt = sanitizePlainText(interruptNote || "");
    const cleanCta = sanitizePlainText(ctaText);

    return `# ${cleanTitle}

> **Platform:** ${script?.platform || "instagram_reels"} | **Pilar:** ${script?.pillar || "edukasi"} | **Status:** ${status}
> **Durasi:** ~${totalEstimatedSec}s (${totalWords} kata)

---

## ⚡ Hook Interupsi (0–3 Detik)
> **"${cleanHook}"**

*Petunjuk Visual:* ${cleanInterrupt}

---

## 📝 Tubuh Naskah

${sections
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
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-") || "skrip"}.txt`;
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
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, "-") || "skrip"}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File .md (Markdown) berhasil diunduh!");
  };

  const handleDuplicate = async () => {
    setIsProcessing(true);
    try {
      const newId = await duplicateScript(scriptId);
      toast.success("Skrip berhasil diduplikasi sebagai salinan baru!");
      navigate(`/skrip/${newId}`);
    } catch {
      toast.error("Gagal menduplikasi skrip.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsProcessing(true);
    try {
      await deleteScript(scriptId);
      toast.success("Skrip berhasil dihapus secara permanen.");
      setShowDeleteModal(false);
      navigate("/skrip");
    } catch {
      toast.error("Gagal menghapus skrip.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async (newStatus?: "draft" | "final") => {
    const targetStatus = newStatus || status;
    setStatus(targetStatus);
    setSaveIndicator("Menyimpan ke database...");
    try {
      await updateScript(scriptId, {
        title,
        hookText,
        interruptNote,
        ctaText,
        sections,
        status: targetStatus,
        estimatedDurationSec: totalEstimatedSec,
        wordCount: totalWords,
      });
      setSaveIndicator("Semua perubahan tersimpan di database");
      if (targetStatus === "final") {
        toast.success("Skrip ditandai FINAL (Siap Rekam)!");
      } else {
        toast.success("Draf skrip berhasil disimpan.");
      }
    } catch (err) {
      setSaveIndicator("Gagal menyimpan perubahan");
      toast.error("Gagal memperbarui skrip.");
    }
  };

  const handleMarkFinal = async () => {
    await markScriptFinal(scriptId);
    setStatus("final");
    toast.success("Skrip berhasil ditandai FINAL (Siap Rekam)!");
  };

  if (!script) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <div className="h-12 w-12 rounded-full bg-[hsl(262,83%,68%)]/15 text-[hsl(262,83%,68%)] flex items-center justify-center mx-auto">
          <FileText className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Skrip Tidak Ditemukan</h2>
        <p className="text-sm text-[hsl(225,12%,65%)]">
          Skrip yang Anda buka tidak ditemukan atau belum pernah dibuat. Silakan buat naskah baru melalui wizard 5 langkah.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/skrip")}>
            Lihat Daftar Skrip
          </Button>
          <Button variant="default" size="sm" onClick={() => navigate("/skrip/baru")}>
            Buat Skrip Baru
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-in fade-in-0 duration-200">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/skrip")}
            className="text-xs gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Daftar</span>
          </Button>

          <span className="text-xs font-mono text-[hsl(152,60%,55%)] flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{saveIndicator}</span>
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave("draft")}
            className="gap-1.5 text-xs"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Simpan Draf</span>
          </Button>

          <Button
            variant={status === "final" ? "secondary" : "outline"}
            size="sm"
            onClick={handleMarkFinal}
            className={`gap-1.5 text-xs ${
              status === "final" ? "border-[hsl(152,60%,40%)] text-[hsl(152,60%,55%)]" : ""
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>{status === "final" ? "Sudah Final" : "Tandai Final"}</span>
          </Button>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                <span>Ekspor</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Format Ekspor</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleDownloadTxt}>
                <FileText className="mr-2 h-3.5 w-3.5" />
                <span>Unduh File .txt</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadMd}>
                <FileText className="mr-2 h-3.5 w-3.5" />
                <span>Unduh File .md</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleCopyAll}>
                <Copy className="mr-2 h-3.5 w-3.5" />
                <span>Salin Semua Teks</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Options (Duplicate, Delete) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Tindakan Skrip</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => !isProcessing && handleDuplicate()}
                className={isProcessing ? "opacity-50 pointer-events-none" : ""}
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                <span>Duplikasi Skrip</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                destructive
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="mr-2 h-3.5 w-3.5" />
                <span>Hapus Skrip</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              handleSave("final");
              navigate(`/skrip/${scriptId}/pratinjau`);
            }}
            className="gap-1.5 font-semibold text-xs shadow-[0_0_20px_-4px_rgba(157,98,247,0.4)]"
          >
            <Eye className="h-4 w-4" />
            <span>Mode Teleprompter</span>
          </Button>
        </div>
      </div>

      {/* Two-Column Editor Layout (Bab 4: Panel Kiri Edit, Panel Kanan 9:16 Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Script Form Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Title & Metadata Card */}
          <Card className="p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Badge variant={status === "final" ? "final" : "draft"}>
                  {status === "final" ? "Siap Rekam (Final)" : "Draf"}
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  {script?.platform.replace("_", " ") || "Instagram Reels (9:16)"}
                </Badge>
                <Badge variant="edukasi" className="font-mono text-xs">
                  {script?.pillar || "Edukasi"}
                </Badge>
              </div>

              <span className="text-xs font-mono text-[hsl(190,90%,55%)]">
                {title.length}/160 karakter
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[hsl(220,20%,90%)] font-mono uppercase">
                Judul Naskah:
              </label>
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-heading text-lg font-bold text-white"
                maxLength={160}
              />
            </div>
          </Card>

          {/* Hook Editor Box */}
          <Card className="p-6 space-y-4 border-l-4 border-l-[hsl(0,75%,62%)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="kesalahan">Hook Pembuka (0–3 Detik)</Badge>
                <span className="text-xs font-mono text-[hsl(225,12%,50%)]">Batas 120 Karakter</span>
              </div>
              <span
                className={`text-xs font-mono font-semibold ${
                  hookText.length > 120
                    ? "text-[hsl(0,75%,62%)]"
                    : "text-[hsl(152,60%,50%)]"
                }`}
              >
                {hookText.length}/120 karakter
              </span>
            </div>

            <Textarea
              rows={2}
              value={hookText}
              onChange={(e) => setHookText(e.target.value)}
              className="font-mono text-sm leading-relaxed"
              placeholder="Tulis kalimat hook..."
            />

            <div className="flex items-center gap-2 text-xs text-[hsl(225,12%,65%)] bg-[hsl(230,22%,8%)] p-2.5 rounded-xl border border-[hsl(230,15%,20%)]">
              <Flame className="h-4 w-4 text-[hsl(0,75%,62%)] shrink-0" />
              <div className="w-full">
                <span className="font-semibold text-white">Arahan Interupsi: </span>
                <input
                  type="text"
                  value={interruptNote}
                  onChange={(e) => setInterruptNote(e.target.value)}
                  className="bg-transparent text-xs text-white border-b border-[hsl(230,15%,24%)] focus:outline-none w-3/4 ml-1"
                />
              </div>
            </div>
          </Card>

          {/* Section Step Editors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-white uppercase font-mono tracking-wider">
                Tubuh Naskah ({sections.length} Bagian)
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSection}
                className="gap-1.5 text-xs"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Tambah Bagian</span>
              </Button>
            </div>

            {sections.map((sec, idx) => (
              <Card
                key={sec.id}
                className={`p-5 space-y-3 transition-colors ${
                  previewActiveSectionIdx === idx
                    ? "border-[hsl(262,83%,68%)]/60 bg-[hsl(230,22%,11%)]"
                    : ""
                }`}
                onClick={() => setPreviewActiveSectionIdx(idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <Input
                      type="text"
                      value={sec.label}
                      onChange={(e) => {
                        const newLabel = e.target.value;
                        setSections((prev) => {
                          const next = [...prev];
                          next[idx] = { ...next[idx], label: newLabel };
                          return next;
                        });
                      }}
                      className="h-8 max-w-[200px] text-xs font-bold text-white font-heading bg-transparent border-transparent hover:border-[hsl(230,15%,22%)]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[hsl(190,90%,55%)]">
                      ~{sec.estimatedSec}s ({sec.content.split(" ").length} kata)
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection(idx);
                      }}
                      className="text-[hsl(225,12%,40%)] hover:text-[hsl(0,75%,62%)] transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <Textarea
                  rows={3}
                  value={sec.content}
                  onChange={(e) => handleUpdateSection(idx, e.target.value)}
                  maxLength={600}
                  className="text-sm leading-relaxed"
                />

                {/* B-roll Picker for this section */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-[hsl(230,15%,20%)]/60">
                  <div className="flex items-center gap-2">
                    <Video className="h-3.5 w-3.5 text-[hsl(165,75%,45%)]" />
                    <span className="text-[hsl(225,12%,50%)] font-mono">B-roll Ditugaskan:</span>
                  </div>
                  <select
                    value={sec.brollIds[0] || "broll-1"}
                    onChange={(e) => {
                      const newBroll = e.target.value;
                      setSections((prev) => {
                        const next = [...prev];
                        next[idx] = { ...next[idx], brollIds: [newBroll] };
                        return next;
                      });
                    }}
                    className="h-7 text-xs bg-[hsl(230,22%,8%)] text-white border border-[hsl(230,15%,22%)] rounded-lg px-2 outline-none"
                  >
                    {DUMMY_BROLLS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.durationSec}s)
                      </option>
                    ))}
                  </select>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Box */}
          <Card className="p-6 space-y-4 border-l-4 border-l-[hsl(38,92%,60%)]">
            <div className="flex items-center justify-between">
              <Badge variant="promosi">Call to Action (CTA)</Badge>
              <span className="text-xs font-mono text-[hsl(225,12%,50%)]">
                {ctaText.length}/240 karakter
              </span>
            </div>

            <Textarea
              rows={2}
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              maxLength={240}
              className="text-sm"
              placeholder="Tulis kalimat ajakan bertindak..."
            />
          </Card>

          {/* Caption Limit Warnings (Bab 6: 2.200 karakter Instagram/TikTok) */}
          <div className="p-4 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,22%)] flex items-center justify-between text-xs">
            <span className="text-[hsl(225,12%,65%)] font-mono">
              Total Panjang Naskah: <strong className="text-white">{totalCharacters}</strong> / 2.200 karakter batas caption
            </span>
            {totalCharacters > 2200 ? (
              <span className="text-[hsl(0,75%,62%)] font-semibold flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" /> Melebihi batas caption!
              </span>
            ) : (
              <span className="text-[hsl(152,60%,55%)] flex items-center gap-1 font-mono">
                <CheckCircle2 className="h-3.5 w-3.5" /> Aman untuk Reels & TikTok
              </span>
            )}
          </div>
        </div>

        {/* Right Column: 9:16 Smartphone Teleprompter Preview (4 cols) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-heading font-bold text-white flex items-center gap-1.5">
              <Film className="h-3.5 w-3.5 text-[hsl(262,83%,68%)]" />
              <span>Pratinjau Ritme 9:16</span>
            </span>
            <div className="flex items-center gap-1 bg-[hsl(230,22%,10%)] p-0.5 rounded-lg border border-[hsl(230,15%,22%)]">
              <button
                type="button"
                onClick={() => setPreviewMode("video")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  previewMode === "video"
                    ? "bg-[hsl(262,83%,68%)] text-white"
                    : "text-[hsl(225,12%,60%)] hover:text-white"
                }`}
              >
                B-roll Video
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("teleprompter")}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors cursor-pointer ${
                  previewMode === "teleprompter"
                    ? "bg-[hsl(262,83%,68%)] text-white"
                    : "text-[hsl(225,12%,60%)] hover:text-white"
                }`}
              >
                Teleprompter
              </button>
            </div>
          </div>

          <div className="rounded-3xl border-2 border-[hsl(230,15%,24%)] bg-[hsl(230,25%,4%)] p-3 shadow-2xl shadow-[hsl(262,83%,68%)]/15">
            {/* Phone Speaker Notch */}
            <div className="flex justify-center mb-3">
              <div className="h-3 w-20 rounded-full bg-[hsl(230,20%,12%)]" />
            </div>

            {/* 9:16 Aspect Screen */}
            <div className="aspect-[9/16] rounded-2xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)] p-4 flex flex-col justify-between relative overflow-hidden group">
              {/* Background Video / Thumbnail Player */}
              {previewMode === "video" && (
                <>
                  {/* Poster / Thumbnail via next/image from Bunny Stream CDN */}
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={
                        signedBrollConfig?.thumbnailUrl ||
                        getBunnyThumbnailUrl(
                          sections[previewActiveSectionIdx]?.brollIds[0] || "broll-bunny-001"
                        )
                      }
                      fallbackSrc="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=720&q=80"
                      alt={sections[previewActiveSectionIdx]?.label || "B-roll Visual"}
                      fill
                      className="object-cover opacity-75"
                    />
                  </div>

                  {/* HTML5 Video with Signed URL from Server */}
                  {signedBrollConfig?.signedUrl && (
                    <video
                      ref={previewVideoRef}
                      src={signedBrollConfig.signedUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 h-full w-full object-cover z-0"
                    />
                  )}

                  {/* Gradient Vignette Overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/70 pointer-events-none z-1" />
                </>
              )}

              {previewMode === "teleprompter" && (
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(230,25%,6%)] via-[hsl(230,22%,10%)] to-[hsl(230,25%,6%)] pointer-events-none z-0" />
              )}

              {/* Top Status */}
              <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-[hsl(225,12%,70%)]">
                <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 text-[hsl(152,60%,55%)]">
                  <span className="h-2 w-2 rounded-full bg-[hsl(152,60%,55%)] animate-pulse" />
                  Bunny Stream 9:16
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/10 font-mono text-[hsl(190,90%,55%)]">
                  ~{sections[previewActiveSectionIdx]?.estimatedSec || 6}s
                </span>
              </div>

              {/* Center Play/Pause Overlay for Video Mode */}
              {previewMode === "video" && (
                <div className="relative z-10 flex justify-center my-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (previewVideoRef.current) {
                        if (previewVideoRef.current.paused) {
                          previewVideoRef.current.play();
                          setIsVideoPlaying(true);
                        } else {
                          previewVideoRef.current.pause();
                          setIsVideoPlaying(false);
                        }
                      } else {
                        setIsVideoPlaying((p) => !p);
                      }
                    }}
                    className="h-11 w-11 rounded-full bg-black/60 hover:bg-[hsl(262,83%,68%)] text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all opacity-80 group-hover:opacity-100 cursor-pointer shadow-lg"
                  >
                    {isVideoPlaying ? (
                      <Pause className="h-5 w-5 fill-current" />
                    ) : (
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    )}
                  </button>
                </div>
              )}

              {/* Teleprompter Subtitle Overlay */}
              <div className="relative z-10 space-y-2 text-center px-1 mb-2">
                <Badge variant="edukasi" className="text-[9px] uppercase font-mono py-0 px-2 bg-black/60 border border-white/20">
                  {sections[previewActiveSectionIdx]?.label || "Hook Pembuka"}
                </Badge>
                <p className="font-heading text-sm sm:text-base font-bold text-white leading-snug drop-shadow-md bg-black/40 backdrop-blur-sm p-2 rounded-xl border border-white/10">
                  "{sections[previewActiveSectionIdx]?.content || hookText}"
                </p>
                <div className="text-[10px] font-mono text-[hsl(165,75%,50%)] flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  <span>B-roll: {sections[previewActiveSectionIdx]?.brollIds[0] || "broll-bunny-001"}</span>
                </div>
              </div>

              {/* Bottom Scrubber */}
              <div className="relative z-10 pt-2 border-t border-white/15 text-xs flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setPreviewActiveSectionIdx((p) => (p > 0 ? p - 1 : sections.length - 1))
                  }
                  className="px-2 py-1 rounded bg-black/60 text-[10px] font-mono hover:text-white border border-white/10 cursor-pointer"
                >
                  ◀ Prev
                </button>
                <span className="text-[10px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded border border-white/10">
                  {previewActiveSectionIdx + 1}/{sections.length}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setPreviewActiveSectionIdx((p) => (p + 1) % sections.length)
                  }
                  className="px-2 py-1 rounded bg-black/60 text-[10px] font-mono hover:text-white border border-white/10 cursor-pointer"
                >
                  Next ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="h-10 w-10 rounded-full bg-[hsl(0,75%,62%)]/15 text-[hsl(0,75%,62%)] flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg">Konfirmasi Hapus Skrip</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus skrip <strong>"{title}"</strong>?
                Tindakan ini permanen dan akan menghapus naskah dari database.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={isProcessing}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isProcessing}
              >
                {isProcessing ? "Menghapus..." : "Ya, Hapus Permanen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
