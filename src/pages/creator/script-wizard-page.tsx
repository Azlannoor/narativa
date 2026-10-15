import React, { useState, useEffect } from "react";
import { useNavigation } from "@/src/context/navigation-context";
import { useScripts, type FullScript } from "@/src/context/scripts-context";
import {
  Button,
  Card,
  Badge,
  Input,
  Textarea,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Flame,
  MousePointerClick,
  Video,
  AlertTriangle,
  Lightbulb,
  Save,
  HelpCircle,
} from "lucide-react";
import {
  DUMMY_IDEAS,
  DUMMY_HOOKS,
  DUMMY_CTAS,
  DUMMY_FORMULAS,
  DUMMY_BROLLS,
  type IdeaItem,
  type HookItem,
  type CtaItem,
  type FormulaItem,
} from "@/src/data/dummy-seed";
import {
  assembleScript,
  calculateDuration,
  interpolateVariables,
} from "@/src/lib/script-assembler";
import { toast } from "@/src/components/ui/sonner";

export function ScriptWizardPage() {
  const { navigate } = useNavigation();
  const { addScript } = useScripts();

  // Wizard Step (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Platform & Pilar
  const [platform, setPlatform] = useState<"instagram_reels" | "tiktok" | "facebook_reels" | "facebook_post">("instagram_reels");
  const [pillar, setPillar] = useState<"edukasi" | "inspirasi" | "promosi" | "bts_personal">("edukasi");

  // Step 2: Ide & Audiens (Bersih/Kosong)
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [keyMessage, setKeyMessage] = useState("");

  // Step 3: Gaya Jualan & Formula
  const [salesStyle, setSalesStyle] = useState<"hard_selling" | "soft_selling" | "storyteller">("soft_selling");
  const [selectedFormulaCode, setSelectedFormulaCode] = useState<string>("aida");

  // Step 4: Hook & Bagian Skrip
  const [selectedHookId, setSelectedHookId] = useState<string>("");
  const [hookTopicVariable, setHookTopicVariable] = useState("");
  const [hookText, setHookText] = useState("");
  const [interruptNote, setInterruptNote] = useState("");

  // Sections dynamic map per formula step
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({});

  // Step 5: CTA & B-roll
  const [selectedCtaId, setSelectedCtaId] = useState<string>("");
  const [ctaText, setCtaText] = useState("");
  const [sectionBrolls, setSectionBrolls] = useState<Record<string, string[]>>({});

  // Status simpan otomatis lokal
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>("Tersimpan otomatis");

  // Load / Restore draf tersimpan dari localStorage jika ada
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedDraftJson = localStorage.getItem("narativa_wizard_active_draft");
        if (savedDraftJson) {
          const draft = JSON.parse(savedDraftJson);
          if (draft && draft.customTitle) {
            setCustomTitle(draft.customTitle);
            if (draft.platform) setPlatform(draft.platform);
            if (draft.pillar) setPillar(draft.pillar);
            if (draft.targetAudience) setTargetAudience(draft.targetAudience);
            if (draft.keyMessage) setKeyMessage(draft.keyMessage);
            if (draft.salesStyle) setSalesStyle(draft.salesStyle);
            if (draft.selectedFormulaCode) setSelectedFormulaCode(draft.selectedFormulaCode);
            if (draft.hookText) setHookText(draft.hookText);
            if (draft.interruptNote) setInterruptNote(draft.interruptNote);
            if (draft.ctaText) setCtaText(draft.ctaText);
            if (draft.sectionContents) setSectionContents(draft.sectionContents);
            if (draft.sectionBrolls) setSectionBrolls(draft.sectionBrolls);
            setAutoSaveStatus("Draf lokal dipulihkan");
          }
        }
      } catch (err) {
        console.warn("Gagal memulihkan draf lokal wizard:", err);
      }
    }
  }, []);

  // Simpan draf otomatis ke localStorage setiap kali ada perubahan data (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = setTimeout(() => {
      try {
        const draftData = {
          platform,
          pillar,
          customTitle,
          targetAudience,
          keyMessage,
          salesStyle,
          selectedFormulaCode,
          selectedHookId,
          hookTopicVariable,
          hookText,
          interruptNote,
          sectionContents,
          selectedCtaId,
          ctaText,
          sectionBrolls,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("narativa_wizard_active_draft", JSON.stringify(draftData));
        setAutoSaveStatus("Tersimpan otomatis di browser");
      } catch (err) {
        // quota exceeded
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [
    platform,
    pillar,
    customTitle,
    targetAudience,
    keyMessage,
    salesStyle,
    selectedFormulaCode,
    selectedHookId,
    hookTopicVariable,
    hookText,
    interruptNote,
    sectionContents,
    selectedCtaId,
    ctaText,
    sectionBrolls,
  ]);

  // Check URL query parameters if coming from a library page
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlIdeaId = params.get("ideaId");
      if (urlIdeaId) {
        const found = DUMMY_IDEAS.find((i) => i.id === urlIdeaId);
        if (found) {
          setSelectedIdeaId(found.id);
          setCustomTitle(found.title);
          setPillar(found.pillar);
          setTargetAudience(found.targetAudience);
          setKeyMessage(found.technicalNote);
          setCurrentStep(2);
        }
      }
      const urlHookText = params.get("hookText");
      if (urlHookText) {
        setHookText(decodeURIComponent(urlHookText));
        setCurrentStep(4);
      }
      const urlCtaText = params.get("ctaText");
      if (urlCtaText) {
        setCtaText(decodeURIComponent(urlCtaText));
        setCurrentStep(5);
      }
      const urlFormulaCode = params.get("formulaCode");
      if (urlFormulaCode) {
        setSelectedFormulaCode(urlFormulaCode as any);
        setCurrentStep(3);
      }
    }
  }, []);

  // Sync default formula based on Sales Style (Bab 6: Sistem menyarankan formula yang sesuai)
  useEffect(() => {
    if (salesStyle === "soft_selling") {
      setSelectedFormulaCode("aida");
    } else if (salesStyle === "hard_selling") {
      setSelectedFormulaCode("pas");
    } else if (salesStyle === "storyteller") {
      setSelectedFormulaCode("heros_journey");
    }
  }, [salesStyle]);

  // Selected formula object
  const activeFormula =
    DUMMY_FORMULAS.find((f) => f.code === selectedFormulaCode) || DUMMY_FORMULAS[0];

  // Hitung total kata dan durasi via script-assembler engine (2.5 kata per detik)
  const allText = [
    hookText,
    ...Object.values(sectionContents),
    ctaText,
  ].join(" ");
  const { wordCount: totalWordCount, durationSec: totalDurationSec } = calculateDuration(allText);

  // Validation per step
  const handleNext = () => {
    if (currentStep === 1) {
      if (!platform || !pillar) {
        toast.error("Harap pilih platform dan pilar konten.");
        return;
      }
    } else if (currentStep === 2) {
      if (!customTitle.trim()) {
        toast.error("Judul ide skrip wajib diisi.");
        return;
      }
      if (!targetAudience.trim()) {
        toast.error("Target audiens wajib diisi.");
        return;
      }
    } else if (currentStep === 3) {
      if (!salesStyle || !selectedFormulaCode) {
        toast.error("Harap tentukan gaya jualan dan formula.");
        return;
      }
    } else if (currentStep === 4) {
      if (!hookText.trim()) {
        toast.error("Hook pembuka wajib diisi.");
        return;
      }
      if (hookText.length > 120 && platform !== "facebook_post") {
        toast.warning("Hook melebihi 120 karakter untuk Reels/TikTok. Disarankan diringkas.");
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    toast.info(`Langkah ${currentStep + 1} aktif.`);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveScript = async (status: "draft" | "final") => {
    setIsSaving(true);
    try {
      // 1. Jalankan Mesin Perakitan Skrip (Script Assembler Engine)
      const assembled = assembleScript({
        title: customTitle,
        platform,
        pillar,
        salesStyle,
        formulaCode: selectedFormulaCode as any,
        hookTemplate: hookText,
        interruptNote,
        targetAudience,
        keyMessage,
        ctaText,
        sectionContents,
        sectionBrolls,
        status,
      });

      // 2. Simpan skrip ke database melalui Server Action createScript via ScriptsContext
      const newScriptId = await addScript({
        title: assembled.title,
        platform: assembled.platform,
        pillar: assembled.pillar,
        salesStyle: assembled.salesStyle,
        status: assembled.status,
        targetAudience: assembled.targetAudience,
        keyMessage: assembled.keyMessage,
        hookText: assembled.hookText,
        interruptNote: assembled.interruptNote,
        ctaText: assembled.ctaText,
        ctaKeyword: assembled.ctaKeyword,
        sections: assembled.sections.map((s) => ({
          id: s.id,
          key: s.key,
          label: s.label,
          content: s.content,
          brollIds: s.brollIds,
          estimatedSec: s.estimatedSec,
          wordCount: s.wordCount,
          timeRangeLabel: s.timeRangeLabel,
        })),
        estimatedDurationSec: assembled.estimatedDurationSec,
        wordCount: assembled.wordCount,
      });

      // Bersihkan draft aktif lokal setelah berhasil disimpan
      if (typeof window !== "undefined") {
        localStorage.removeItem("narativa_wizard_active_draft");
      }

      if (status === "final") {
        toast.success("Skrip berhasil dirakit dan ditandai FINAL! Membuka teleprompter siap rekam.");
        navigate(`/skrip/${newScriptId}/pratinjau`);
      } else {
        toast.success("Draf skrip berhasil disimpan ke database!");
        navigate(`/skrip/${newScriptId}`);
      }
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan skrip.");
    } finally {
      setIsSaving(false);
    }
  };

  const stepLabels = [
    "Platform & Pilar",
    "Ide & Audiens",
    "Gaya & Formula",
    "Hook & Bagian",
    "CTA & Tinjauan",
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in-0 duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="inspirasi">Wizard 5 Langkah</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
              Estimasi Total: ~{totalDurationSec} Detik ({totalWordCount} kata)
            </span>
            <span className="text-xs font-mono text-[hsl(152,60%,55%)] flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>{autoSaveStatus}</span>
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Studio Perakitan Skrip Konten
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)]">
            Rakit skrip berdaya konversi tinggi secara modular tanpa menulis dari nol.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          disabled={isSaving}
          onClick={() => handleSaveScript("draft")}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Menyimpan..." : "Simpan Draf Cepat"}</span>
        </Button>
      </div>

      {/* 5-Step Visual Progress Bar */}
      <div className="p-4 rounded-2xl bg-[hsl(230,22%,10%)] border border-[hsl(230,15%,22%)]/80">
        <div className="grid grid-cols-5 gap-2">
          {stepLabels.map((lbl, idx) => {
            const stepNum = idx + 1;
            const isCompleted = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            return (
              <div
                key={stepNum}
                onClick={() => isCompleted && setCurrentStep(stepNum)}
                className={`flex flex-col items-center sm:items-start p-2 rounded-xl transition-all ${
                  isCompleted ? "cursor-pointer hover:bg-[hsl(230,20%,14%)]" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold font-mono transition-colors ${
                      isCompleted
                        ? "bg-[hsl(152,60%,50%)] text-white"
                        : isCurrent
                        ? "bg-[hsl(262,83%,68%)] text-white shadow-[0_0_12px_rgba(157,98,247,0.5)]"
                        : "bg-[hsl(230,20%,14%)] text-[hsl(225,12%,50%)]"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                  </div>
                  <span
                    className={`text-xs font-semibold hidden md:inline truncate ${
                      isCurrent
                        ? "text-white"
                        : isCompleted
                        ? "text-[hsl(220,20%,85%)]"
                        : "text-[hsl(225,12%,50%)]"
                    }`}
                  >
                    {lbl}
                  </span>
                </div>
                <div
                  className={`h-1 w-full rounded-full transition-colors ${
                    isCompleted
                      ? "bg-[hsl(152,60%,50%)]"
                      : isCurrent
                      ? "bg-[hsl(262,83%,68%)]"
                      : "bg-[hsl(230,15%,20%)]"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Platform & Pilar */}
      {currentStep === 1 && (
        <Card className="p-6 sm:p-8 space-y-8 animate-in fade-in-0 duration-200">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] text-xs font-mono font-bold flex items-center justify-center">1</span>
              Tentukan Platform Tujuan & Pilar Konten
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Platform menentukan rasio visual (9:16 vs teks dokumen) dan batas karakter.
            </p>
          </div>

          {/* Platform Choice Cards */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[hsl(220,20%,90%)] uppercase tracking-wider font-mono">
              Pilih Platform:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: "instagram_reels",
                  name: "Instagram Reels",
                  desc: "Rasio vertikal 9:16, maks. 2.200 karakter caption",
                  badge: "9:16 Video",
                },
                {
                  id: "tiktok",
                  name: "TikTok",
                  desc: "Rasio vertikal 9:16, algoritma ritmis 3 detik awal",
                  badge: "9:16 Video",
                },
                {
                  id: "facebook_reels",
                  name: "Facebook Reels",
                  desc: "Rasio vertikal 9:16, jangkauan luas multi-generasi",
                  badge: "9:16 Video",
                },
                {
                  id: "facebook_post",
                  name: "Facebook Post",
                  desc: "Format status teks panjang (copywriting dokumen)",
                  badge: "Teks / Post",
                },
              ].map((p) => {
                const isSelected = platform === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPlatform(p.id as any)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "border-[hsl(262,83%,68%)] bg-[hsl(262,83%,68%)]/15 shadow-[0_0_20px_-4px_rgba(157,98,247,0.3)]"
                        : "border-[hsl(230,15%,22%)]/80 bg-[hsl(230,22%,8%)] hover:bg-[hsl(230,20%,12%)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-sm font-bold text-white">
                        {p.name}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {p.badge}
                      </Badge>
                    </div>
                    <p className="text-xs text-[hsl(225,12%,65%)] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Pillar Choice Cards */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[hsl(220,20%,90%)] uppercase tracking-wider font-mono">
              Pilih Pilar Konten:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: "edukasi",
                  label: "Edukasi",
                  desc: "Tips praktis, tutorial, cara menghindari kesalahan fatal",
                  variant: "edukasi",
                },
                {
                  id: "inspirasi",
                  label: "Inspirasi",
                  desc: "Kisah transformasi, mindset, dan perjalanan pahlawan",
                  variant: "inspirasi",
                },
                {
                  id: "promosi",
                  label: "Promosi",
                  desc: "Penawaran produk, flash sale voucher, atau lead gen",
                  variant: "promosi",
                },
                {
                  id: "bts_personal",
                  label: "BTS / Personal",
                  desc: "Keseharian kerja, setup meja, eksperimen nyata kreator",
                  variant: "bts",
                },
              ].map((pil) => {
                const isSelected = pillar === pil.id;
                return (
                  <div
                    key={pil.id}
                    onClick={() => setPillar(pil.id as any)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? "border-[hsl(190,90%,55%)] bg-[hsl(190,90%,55%)]/15 shadow-[0_0_20px_-4px_rgba(38,222,255,0.3)]"
                        : "border-[hsl(230,15%,22%)]/80 bg-[hsl(230,22%,8%)] hover:bg-[hsl(230,20%,12%)]"
                    }`}
                  >
                    <Badge variant={pil.variant as any} className="capitalize text-xs">
                      {pil.label}
                    </Badge>
                    <p className="text-xs text-[hsl(225,12%,65%)] leading-relaxed">
                      {pil.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* STEP 2: Ide & Audiens */}
      {currentStep === 2 && (
        <Card className="p-6 sm:p-8 space-y-6 animate-in fade-in-0 duration-200">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] text-xs font-mono font-bold flex items-center justify-center">2</span>
              Pilih Ide dari Library atau Tulis Ide Sendiri
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Tentukan target persona penonton serta pesan inti yang ingin disampaikan.
            </p>
          </div>

          {/* Quick Select from Library Ideas */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[hsl(220,20%,90%)] font-mono">
              Ambil Cepat dari Library Ide ({pillar.toUpperCase()}):
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto p-1">
              {DUMMY_IDEAS.filter((i) => i.pillar === pillar || pillar === "edukasi").map((i) => (
                <div
                  key={i.id}
                  onClick={() => {
                    setSelectedIdeaId(i.id);
                    setCustomTitle(i.title);
                    setTargetAudience(i.targetAudience);
                    setKeyMessage(i.technicalNote);
                    toast.success("Ide terpilih!");
                  }}
                  className={`p-3 rounded-xl border text-xs cursor-pointer transition-colors space-y-1 ${
                    selectedIdeaId === i.id
                      ? "border-[hsl(262,83%,68%)] bg-[hsl(262,83%,68%)]/15 text-white"
                      : "border-[hsl(230,15%,22%)] bg-[hsl(230,22%,8%)] text-[hsl(225,12%,70%)] hover:bg-[hsl(230,20%,12%)]"
                  }`}
                >
                  <p className="font-semibold text-white truncate">{i.title}</p>
                  <p className="text-[11px] text-[hsl(225,12%,50%)] truncate">{i.targetAudience}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Editable Title Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[hsl(220,20%,90%)]">
                Judul Skrip Konten
              </label>
              <span className="text-xs font-mono text-[hsl(225,12%,50%)]">
                {customTitle.length}/160 karakter
              </span>
            </div>
            <Input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Masukkan judul skrip..."
              maxLength={160}
              required
            />
          </div>

          {/* Target Audience */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[hsl(220,20%,90%)]">
              Target Audiens yang Dituju
            </label>
            <Input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Contoh: Solo developer pemula dan mahasiswa IT di kota besar"
              maxLength={200}
              required
            />
          </div>

          {/* Key Message */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[hsl(220,20%,90%)]">
              Pesan Inti atau Catatan Teknis Rekaman
            </label>
            <Textarea
              rows={3}
              value={keyMessage}
              onChange={(e) => setKeyMessage(e.target.value)}
              placeholder="Tunjukkan contoh kode terminal merah, sertakan langkah perbaikan 30 detik..."
            />
          </div>
        </Card>
      )}

      {/* STEP 3: Gaya Jualan & Formula */}
      {currentStep === 3 && (
        <Card className="p-6 sm:p-8 space-y-6 animate-in fade-in-0 duration-200">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] text-xs font-mono font-bold flex items-center justify-center">3</span>
              Pilih Gaya Jualan & Formula Penulisan
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Gaya jualan menentukan struktur alur default dan nada bicara CTA akhir.
            </p>
          </div>

          {/* 3 Gaya Jualan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "soft_selling",
                name: "Soft Selling",
                tone: "Santai Tanpa Paksaan",
                desc: "Hook Pain Point $\rightarrow$ Masalah $\rightarrow$ Nilai Edukasi $\rightarrow$ Soft CTA",
                badge: "edukasi",
                recommended: "AIDA / 4P",
              },
              {
                id: "hard_selling",
                name: "Hard Selling",
                tone: "Tegas & Mendesak",
                desc: "Visual Produk $\rightarrow$ Headline $\rightarrow$ Urgensi Promo $\rightarrow$ CTA Tegas",
                badge: "promosi",
                recommended: "PAS / Direct",
              },
              {
                id: "storyteller",
                name: "Storyteller",
                tone: "Empati & Reflektif",
                desc: "Karakter $\rightarrow$ Konteks $\rightarrow$ Konflik $\rightarrow$ Klimaks $\rightarrow$ Kesimpulan",
                badge: "inspirasi",
                recommended: "Hero's Journey",
              },
            ].map((s) => {
              const isSelected = salesStyle === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSalesStyle(s.id as any)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? "border-[hsl(262,83%,68%)] bg-[hsl(262,83%,68%)]/15 shadow-[0_0_24px_-4px_rgba(157,98,247,0.35)]"
                      : "border-[hsl(230,15%,22%)] bg-[hsl(230,22%,8%)] hover:bg-[hsl(230,20%,12%)]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={s.badge as any}>{s.name}</Badge>
                    <span className="text-[10px] font-mono text-[hsl(190,90%,55%)]">
                      Saran: {s.recommended}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-base">
                    {s.tone}
                  </h3>
                  <p className="text-xs text-[hsl(225,12%,65%)] leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Formula Selection Grid */}
          <div className="space-y-3 pt-4 border-t border-[hsl(230,15%,22%)]/60">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-white font-mono uppercase">
                Pilih Kerangka Formula (8 Opsi):
              </label>
              <span className="text-xs text-[hsl(225,12%,50%)]">
                Formula aktif: {activeFormula.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {DUMMY_FORMULAS.map((f) => {
                const isSelected = selectedFormulaCode === f.code;
                return (
                  <button
                    key={f.code}
                    type="button"
                    onClick={() => setSelectedFormulaCode(f.code)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[hsl(190,90%,55%)] bg-[hsl(190,90%,55%)]/15 text-white"
                        : "border-[hsl(230,15%,22%)]/60 bg-[hsl(230,22%,8%)] text-[hsl(225,12%,70%)] hover:bg-[hsl(230,20%,12%)]"
                    }`}
                  >
                    <div className="font-mono text-xs font-bold text-[hsl(190,90%,55%)]">
                      {f.code.toUpperCase()}
                    </div>
                    <div className="text-xs font-semibold text-white mt-1 truncate">
                      {f.name.split(" ")[0]}
                    </div>
                    <div className="text-[10px] text-[hsl(225,12%,50%)] font-mono">
                      {f.steps.length} langkah
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: Hook & Bagian Skrip */}
      {currentStep === 4 && (
        <Card className="p-6 sm:p-8 space-y-6 animate-in fade-in-0 duration-200">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] text-xs font-mono font-bold flex items-center justify-center">4</span>
              Pasang Hook Pembuka & Isi Tubuh Skrip ({activeFormula.name.split(" ")[0]})
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Isi kalimat interupsi pola 1–3 detik, lalu jabarkan poin naskah per tahapan formula.
            </p>
          </div>

          {/* Hook Selector Box */}
          <div className="p-5 rounded-2xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,22%)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2 font-mono">
                <Flame className="h-4 w-4 text-[hsl(0,75%,62%)]" />
                HOOK PEMBUKA (0–3 DETIK PERTAMA)
              </span>
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
              className="font-mono text-sm"
              placeholder="Tulis kalimat hook pembuka..."
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[hsl(225,12%,50%)]">
                  Topik/Kebiasaan Variabel ({"{{topik}}"}):
                </label>
                <Input
                  type="text"
                  value={hookTopicVariable}
                  onChange={(e) => {
                    const val = e.target.value;
                    setHookTopicVariable(val);
                    const selectedHook = DUMMY_HOOKS.find((h) => h.id === selectedHookId);
                    const template = selectedHook ? selectedHook.template : "Kamu masih {{topik}}? Ini alasan akun kamu bisa diretas dalam 5 menit.";
                    setHookText(interpolateVariables(template, { topik: val, kebiasaan: val, masalah: val }));
                  }}
                  placeholder="masukkan topik..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[hsl(225,12%,50%)]">
                  Catatan Gerakan Interupsi:
                </label>
                <Input
                  type="text"
                  value={interruptNote}
                  onChange={(e) => setInterruptNote(e.target.value)}
                  placeholder="Zoom in cepat / tatapan diam..."
                />
              </div>
            </div>
          </div>

          {/* Dynamic Formula Steps Inputs */}
          <div className="space-y-4 pt-2">
            <h3 className="font-heading text-sm font-bold text-white uppercase font-mono tracking-wider">
              Tahapan Tubuh Skrip ({activeFormula.steps.length} Bagian):
            </h3>

            {activeFormula.steps.map((step, idx) => {
              const currentContent = sectionContents[step.key] || step.example;
              const wordCount = currentContent.trim().split(/\s+/).filter(Boolean).length;
              const sec = Math.round(wordCount / 2.5);

              return (
                <div
                  key={step.key}
                  className="p-4 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)] space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-5 w-5 rounded-md bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-white font-heading">
                        {step.label}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-[hsl(190,90%,55%)]">
                      ~{sec} detik ({wordCount} kata · maks. 600 char)
                    </span>
                  </div>

                  <p className="text-xs text-[hsl(225,12%,60%)]">
                    Panduan: {step.guide}
                  </p>

                  <Textarea
                    rows={3}
                    value={currentContent}
                    onChange={(e) =>
                      setSectionContents((prev) => ({
                        ...prev,
                        [step.key]: e.target.value,
                      }))
                    }
                    maxLength={600}
                    placeholder={`Isi naskah untuk ${step.label}...`}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* STEP 5: CTA, B-roll & Tinjauan */}
      {currentStep === 5 && (
        <Card className="p-6 sm:p-8 space-y-8 animate-in fade-in-0 duration-200">
          <div className="space-y-1">
            <h2 className="font-heading text-xl font-bold text-white flex items-center gap-2">
              <span className="h-6 w-6 rounded-md bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] text-xs font-mono font-bold flex items-center justify-center">5</span>
              Tentukan CTA, Selaraskan B-roll & Tinjau Skrip
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Pilih ajakan bertindak dan tugaskan rekaman visual 9:16 per bagian sebelum menyimpan.
            </p>
          </div>

          {/* CTA Selector */}
          <div className="p-5 rounded-2xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,22%)] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-2 font-mono">
                <MousePointerClick className="h-4 w-4 text-[hsl(38,92%,60%)]" />
                CALL TO ACTION (CTA AKHIR)
              </span>
              <span className="text-xs font-mono text-[hsl(225,12%,50%)]">
                {ctaText.length}/240 karakter
              </span>
            </div>

            <Textarea
              rows={2}
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="Tulis kalimat ajakan bertindak..."
              maxLength={240}
              required
            />

            {/* Quick CTAs from Library */}
            <div className="flex flex-wrap gap-2 pt-1">
              {DUMMY_CTAS.slice(0, 3).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCtaText(c.text)}
                  className="px-2.5 py-1 rounded-lg text-xs bg-[hsl(230,20%,14%)] text-[hsl(225,12%,70%)] hover:text-white border border-[hsl(230,15%,22%)] cursor-pointer truncate max-w-xs"
                >
                  "{c.text.slice(0, 35)}..."
                </button>
              ))}
            </div>
          </div>

          {/* B-roll Assignment per Section (if not Facebook Post) */}
          {platform !== "facebook_post" && (
            <div className="space-y-4">
              <h3 className="font-heading text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Video className="h-4 w-4 text-[hsl(165,75%,45%)]" />
                Penugasan Klip B-roll 9:16 Faceless per Bagian
              </h3>

              <div className="space-y-3">
                {activeFormula.steps.map((step) => {
                  const assignedBrollId = sectionBrolls[step.key]?.[0] || "broll-1";
                  return (
                    <div
                      key={step.key}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)]"
                    >
                      <div className="space-y-0.5">
                        <span className="font-heading text-xs font-bold text-white">
                          {step.label}
                        </span>
                        <p className="text-[11px] text-[hsl(225,12%,55%)] truncate max-w-md">
                          "{sectionContents[step.key] || step.example}"
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-[hsl(225,12%,50%)] font-mono">B-roll:</span>
                        <select
                          value={assignedBrollId}
                          onChange={(e) =>
                            setSectionBrolls((prev) => ({
                              ...prev,
                              [step.key]: [e.target.value],
                            }))
                          }
                          className="h-8 rounded-lg bg-[hsl(230,20%,14%)] text-xs text-white border border-[hsl(230,15%,22%)] px-2.5 outline-none"
                        >
                          {DUMMY_BROLLS.map((b) => (
                            <option key={b.id} value={b.id}>
                              {b.title} ({b.durationSec}s)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Full Summary Box */}
          <div className="p-6 rounded-2xl bg-[hsl(230,22%,6%)] border border-[hsl(262,83%,68%)]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-[hsl(230,15%,22%)]/60 pb-3">
              <span className="font-heading font-bold text-white text-base">
                Ringkasan Naskah Siap Simpan
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="edukasi">{platform.replace("_", " ")}</Badge>
                <Badge variant="inspirasi">{pillar.replace("_", " ")}</Badge>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-white font-semibold text-sm">
                "{customTitle}"
              </p>
              <div className="flex items-center gap-4 text-[hsl(225,12%,60%)] font-mono">
                <span>Total Kata: {totalWordCount}</span>
                <span>·</span>
                <span className="text-[hsl(190,90%,55%)]">
                  Estimasi Durasi: ~{totalDurationSec} Detik
                </span>
                <span>·</span>
                <span>Gaya: {salesStyle.replace("_", " ")}</span>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation Buttons (Kembali & Lanjut / Simpan) */}
      <div className="flex items-center justify-between pt-4 border-t border-[hsl(230,15%,22%)]/60">
        <Button
          variant="outline"
          size="default"
          onClick={() => {
            if (currentStep === 1) {
              navigate("/dashboard");
            } else {
              setCurrentStep((prev) => Math.max(prev - 1, 1));
            }
          }}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{currentStep === 1 ? "Batal ke Dasbor" : "Kembali"}</span>
        </Button>

        <div className="flex items-center gap-3">
          {currentStep < 5 ? (
            <Button
              variant="default"
              size="default"
              onClick={handleNext}
              className="gap-2 font-semibold"
            >
              <span>Lanjut Langkah {currentStep + 1}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="default"
                onClick={() => handleSaveScript("draft")}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                <span>Simpan Draf</span>
              </Button>
              <Button
                variant="default"
                size="default"
                onClick={() => handleSaveScript("final")}
                className="gap-2 font-semibold shadow-[0_0_24px_rgba(157,98,247,0.5)]"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Tandai Final & Siap Rekam</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
