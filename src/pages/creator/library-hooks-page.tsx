import React, { useState } from "react";
import { useNavigation } from "@/src/context/navigation-context";
import {
  Button,
  Card,
  Badge,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui";
import {
  Flame,
  Search,
  Copy,
  ArrowRight,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { DUMMY_HOOKS, type HookItem } from "@/src/data/dummy-seed";
import { useFavorites } from "@/src/context/favorites-context";
import { interpolateVariables } from "@/src/lib/script-assembler";
import { toast } from "@/src/components/ui/sonner";

export function LibraryHooksPage() {
  const { navigate } = useNavigation();
  const { isFavorite, toggleFavorite: triggerToggleFavorite } = useFavorites();
  const [hooks, setHooks] = useState<HookItem[]>(DUMMY_HOOKS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data hooks dari endpoint /api/library
  React.useEffect(() => {
    let isMounted = true;
    async function loadHooks() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/library?type=hooks");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) {
              setHooks(json.data);
            }
          }
        }
      } catch (err) {
        console.warn("Menggunakan data seed hook lokal:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadHooks();
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal State untuk mengisi variabel template hook
  const [activeHook, setActiveHook] = useState<HookItem | null>(null);
  const [variableInputs, setVariableInputs] = useState<Record<string, string>>({});

  const handleToggleFavorite = (hook: HookItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToggleFavorite(hook.id, "hook", hook.template);
  };

  const openCustomizeModal = (hook: HookItem) => {
    setActiveHook(hook);
    // Pre-fill with default values
    const initialVars: Record<string, string> = {};
    const defaultParts = (hook.defaultTopic || "").split(",");
    hook.variables.forEach((v, idx) => {
      initialVars[v] = defaultParts[idx]?.trim() || "";
    });
    setVariableInputs(initialVars);
  };

  // Generate resolved hook text
  const getRenderedHookText = (hook: HookItem, vars: Record<string, string>) => {
    let result = hook.template;
    hook.variables.forEach((v) => {
      const val = vars[v]?.trim();
      result = result.replace(new RegExp(`{{${v}}}`, "g"), val && val.length > 0 ? val : `[${v}]`);
    });
    return result;
  };

  const currentFilledText = activeHook
    ? getRenderedHookText(activeHook, variableInputs)
    : "";

  const handleCopyHook = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast.success("Hook berhasil disalin ke clipboard!");
  };

  const handleApplyToScript = (hook: HookItem) => {
    const finalText = getRenderedHookText(hook, variableInputs);
    toast.success("Hook diterapkan ke Wizard Pembuatan Skrip!");
    navigate(`/skrip/baru?hookId=${hook.id}&hookText=${encodeURIComponent(finalText)}`);
  };

  const filteredHooks = hooks.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.template.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.interruptNote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="kesalahan">Modul Perpustakaan 02</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
              {filteredHooks.length} Pola Hook Tersedia
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Library Hook Interupsi (1–3 Detik)
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)] max-w-2xl">
            Pola kalimat pembuka berdaya pikat tinggi untuk menghentikan guliran (*stop the scroll*).
            Isi variabel topik, pratinjau hasilnya, dan pasang langsung ke skrip Anda.
          </p>
        </div>

        <Button
          variant="default"
          size="default"
          onClick={() => navigate("/skrip/baru")}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Buat Skrip Baru</span>
        </Button>
      </div>

      {/* Filter and Category Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { label: "Semua Kategori", val: "all" },
            { label: "Kesalahan Fatal", val: "kesalahan_fatal" },
            { label: "Kontroversial", val: "kontroversial" },
            { label: "Studi Kasus", val: "studi_kasus" },
          ].map((cat) => (
            <button
              key={cat.val}
              type="button"
              onClick={() => setSelectedCategory(cat.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.val
                  ? "bg-[hsl(262,83%,68%)] text-white shadow-sm"
                  : "bg-[hsl(230,22%,10%)] text-[hsl(225,12%,65%)] hover:text-white border border-[hsl(230,15%,22%)]/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
          <Input
            type="text"
            placeholder="Cari pola hook..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Hook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHooks.map((hook) => {
          const isKesalahan = hook.category === "kesalahan_fatal";
          const isKontroversi = hook.category === "kontroversial";

          const categoryVariant = isKesalahan
            ? "kesalahan"
            : isKontroversi
            ? "kontroversial"
            : "studiKasus";

          const borderCategoryColor = isKesalahan
            ? "border-[hsl(0,75%,62%)]"
            : isKontroversi
            ? "border-[hsl(38,92%,60%)]"
            : "border-[hsl(215,85%,60%)]";

          return (
            <Card
              key={hook.id}
              interactive
              className="p-6 space-y-4 flex flex-col justify-between"
              onClick={() => openCustomizeModal(hook)}
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={categoryVariant} className="capitalize">
                      {hook.category.replace("_", " ")}
                    </Badge>
                    <span className="text-xs font-mono text-[hsl(225,12%,50%)] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      1–3 Detik
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(hook, e)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isFavorite(hook.id, "hook")
                        ? "text-[hsl(38,92%,60%)] bg-[hsl(38,92%,60%)]/15"
                        : "text-[hsl(225,12%,40%)] hover:text-white"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isFavorite(hook.id, "hook") ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* JetBrains Mono Hook Box with Category Left Border (Bab 4) */}
                <div className={`p-4 rounded-xl bg-[hsl(230,22%,8%)] border-l-4 ${borderCategoryColor} border-t border-r border-b border-[hsl(230,15%,20%)] space-y-2`}>
                  <p className="font-mono text-sm text-[hsl(220,20%,95%)] leading-relaxed font-medium">
                    "{hook.template}"
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hook.variables.map((v) => (
                      <span
                        key={v}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[hsl(230,20%,16%)] text-[hsl(190,90%,55%)] border border-[hsl(230,15%,22%)]"
                      >
                        {`{{${v}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interrupt Note */}
                <div className="flex items-start gap-2 text-xs text-[hsl(225,12%,65%)] bg-[hsl(230,22%,10%)] p-2.5 rounded-lg border border-[hsl(230,15%,22%)]/40">
                  <AlertTriangle className="h-4 w-4 text-[hsl(38,92%,60%)] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white">Petunjuk Visual Interupsi: </span>
                    <span>{hook.interruptNote}</span>
                  </div>
                </div>

                {/* Real Filled Example Preview */}
                <div className="text-xs text-[hsl(225,12%,55%)] space-y-1">
                  <span className="font-semibold uppercase font-mono text-[10px]">Contoh Praktik:</span>
                  <p className="italic text-[hsl(225,12%,70%)]">
                    "{hook.exampleFilled}"
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[hsl(230,15%,22%)]/60 flex items-center justify-between gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyHook(hook.exampleFilled);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Contoh</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCustomizeModal(hook);
                  }}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Isi Topik & Pakai</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal Customize Hook Variables */}
      {activeHook && (
        <Dialog open={!!activeHook} onOpenChange={(open) => !open && setActiveHook(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge variant={activeHook.category === "kesalahan_fatal" ? "kesalahan" : activeHook.category === "kontroversial" ? "kontroversial" : "studiKasus"}>
                  {activeHook.category.replace("_", " ")}
                </Badge>
                <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
                  Maks. 120 Karakter
                </span>
              </div>
              <DialogTitle className="text-xl">Isi Variabel Template Hook</DialogTitle>
              <DialogDescription>
                Masukkan topik spesifik Anda. Hook yang dipersonalisasi akan otomatis memperbarui pratinjau di bawah.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {/* Form Input Variables */}
              <div className="space-y-3">
                {activeHook.variables.map((v) => (
                  <div key={v} className="space-y-1">
                    <label className="text-xs font-semibold text-white capitalize font-mono">
                      Variabel {`{{${v}}}`}:
                    </label>
                    <Input
                      type="text"
                      placeholder={`Contoh isi untuk ${v}...`}
                      value={variableInputs[v] || ""}
                      onChange={(e) =>
                        setVariableInputs((prev) => ({
                          ...prev,
                          [v]: e.target.value,
                        }))
                      }
                      autoFocus={activeHook.variables[0] === v}
                    />
                  </div>
                ))}
              </div>

              {/* Live Preview Box */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[hsl(190,90%,55%)] font-mono uppercase">
                    Hasil Pratinjau Hook:
                  </span>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      currentFilledText.length > 120
                        ? "text-[hsl(0,75%,62%)]"
                        : "text-[hsl(152,60%,50%)]"
                    }`}
                  >
                    {currentFilledText.length}/120 karakter
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,22%)] font-mono text-sm text-white leading-relaxed">
                  "{currentFilledText}"
                </div>
                {currentFilledText.length > 120 && (
                  <p className="text-xs text-[hsl(0,75%,62%)]">
                    ⚠️ Hook melebihi batas rekomendasi 120 karakter untuk Reels/TikTok. Disarankan diringkas agar mudah dibaca di 3 detik awal.
                  </p>
                )}
              </div>

              {/* Interrupt Guide */}
              <div className="p-3 rounded-xl bg-[hsl(230,22%,10%)] border border-[hsl(230,15%,22%)]/60 text-xs text-[hsl(225,12%,70%)] flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-[hsl(38,92%,60%)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Panduan Interupsi Pola: </span>
                  {activeHook.interruptNote}
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => handleCopyHook(currentFilledText)}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                <span>Salin Teks Saja</span>
              </Button>
              <Button
                variant="default"
                onClick={() => handleApplyToScript(activeHook)}
                className="gap-2"
              >
                <span>Terapkan ke Skrip Baru</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
