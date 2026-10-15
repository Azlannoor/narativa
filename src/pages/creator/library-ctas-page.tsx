import React, { useState } from "react";
import { useNavigation } from "@/src/context/navigation-context";
import {
  Button,
  Card,
  Badge,
  Input,
} from "@/src/components/ui";
import {
  MousePointerClick,
  Bookmark,
  Share2,
  MessageSquare,
  Search,
  Copy,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { DUMMY_CTAS, type CtaItem } from "@/src/data/dummy-seed";
import { useFavorites } from "@/src/context/favorites-context";
import { toast } from "@/src/components/ui/sonner";

export function LibraryCtasPage() {
  const { navigate } = useNavigation();
  const { isFavorite, toggleFavorite: triggerToggleFavorite } = useFavorites();
  const [ctas, setCtas] = useState<CtaItem[]>(DUMMY_CTAS);
  const [selectedGoal, setSelectedGoal] = useState<string>("all");
  const [selectedStyle, setSelectedStyle] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data katalog CTA dari endpoint /api/library
  React.useEffect(() => {
    let isMounted = true;
    async function loadCtas() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/library?type=ctas");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) {
              setCtas(json.data);
            }
          }
        }
      } catch (err) {
        console.warn("Menggunakan data seed CTA lokal:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCtas();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFavorite = (cta: CtaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToggleFavorite(cta.id, "cta", cta.text);
  };

  const handleCopyCta = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Kalimat CTA berhasil disalin ke clipboard!");
  };

  const handleUseCta = (cta: CtaItem) => {
    toast.success("CTA dipilih untuk Wizard!");
    navigate(`/skrip/baru?ctaId=${cta.id}&ctaText=${encodeURIComponent(cta.text)}`);
  };

  const filteredCtas = ctas.filter((item) => {
    const matchesGoal = selectedGoal === "all" || item.goal === selectedGoal;
    const matchesStyle =
      selectedStyle === "all" || item.salesStyle === selectedStyle;
    const matchesSearch =
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.keyword && item.keyword.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesGoal && matchesStyle && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="promosi">Modul Perpustakaan 03</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
              {filteredCtas.length} Kalimat CTA Tersedia
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Library Call to Action (CTA)
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)] max-w-2xl">
            Tentukan tujuan konversi penutup: simpan naskah, otomasi DM kata kunci, atau ajakan
            komentar viral dengan gaya nada yang selaras.
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

      {/* Filter Matrix */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
            <Input
              type="text"
              placeholder="Cari teks CTA, kata kunci DM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Goal Filter Buttons */}
          <div className="md:col-span-7 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-[hsl(225,12%,50%)] font-semibold uppercase font-mono shrink-0">
              Tujuan:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { label: "Semua", val: "all" },
                { label: "Save & Bookmark", val: "save_bookmark" },
                { label: "DM Lead Gen", val: "dm_lead_gen" },
                { label: "Engagement / Viral", val: "engagement_share" },
              ].map((g) => (
                <button
                  key={g.val}
                  type="button"
                  onClick={() => setSelectedGoal(g.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedGoal === g.val
                      ? "bg-[hsl(262,83%,68%)] text-white shadow-sm"
                      : "bg-[hsl(230,22%,10%)] text-[hsl(225,12%,65%)] hover:text-white border border-[hsl(230,15%,22%)]/60"
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Style Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[hsl(225,12%,50%)] font-semibold uppercase font-mono shrink-0">
            Gaya Jualan:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { label: "Semua Gaya", val: "all" },
              { label: "Soft Selling", val: "soft_selling" },
              { label: "Hard Selling", val: "hard_selling" },
              { label: "Storyteller", val: "storyteller" },
            ].map((s) => (
              <button
                key={s.val}
                type="button"
                onClick={() => setSelectedStyle(s.val)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedStyle === s.val
                    ? "bg-[hsl(190,90%,55%)]/20 text-[hsl(190,90%,55%)] border border-[hsl(190,90%,55%)]/40 font-semibold"
                    : "bg-[hsl(230,22%,8%)] text-[hsl(225,12%,60%)] hover:text-white border border-[hsl(230,15%,20%)]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCtas.map((cta) => {
          const isSave = cta.goal === "save_bookmark";
          const isDm = cta.goal === "dm_lead_gen";

          const goalLabel = isSave
            ? "Save & Bookmark"
            : isDm
            ? "DM Lead Gen"
            : "Engagement / Viral";

          const goalIcon = isSave ? (
            <Bookmark className="h-3.5 w-3.5" />
          ) : isDm ? (
            <MessageSquare className="h-3.5 w-3.5" />
          ) : (
            <Share2 className="h-3.5 w-3.5" />
          );

          // Peringatan kecocokan gaya jualan (Bab 6)
          const isContrast =
            (cta.salesStyle === "hard_selling" && cta.goal === "engagement_share") ||
            (cta.salesStyle === "storyteller" && cta.goal === "dm_lead_gen");

          return (
            <Card
              key={cta.id}
              interactive
              className="p-6 flex flex-col justify-between space-y-4"
              onClick={() => handleUseCta(cta)}
            >
              <div className="space-y-4">
                {/* Header row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="flex items-center gap-1 text-xs">
                      {goalIcon}
                      <span>{goalLabel}</span>
                    </Badge>
                    <Badge
                      variant={
                        cta.salesStyle === "soft_selling"
                          ? "edukasi"
                          : cta.salesStyle === "hard_selling"
                          ? "promosi"
                          : "inspirasi"
                      }
                      className="text-[10px] capitalize"
                    >
                      {cta.salesStyle.replace("_", " ")}
                    </Badge>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(cta, e)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isFavorite(cta.id, "cta")
                        ? "text-[hsl(38,92%,60%)] bg-[hsl(38,92%,60%)]/15"
                        : "text-[hsl(225,12%,40%)] hover:text-white"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isFavorite(cta.id, "cta") ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* CTA Main Text */}
                <div className="p-4 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)] space-y-2">
                  <p className="text-sm text-white font-medium leading-relaxed">
                    "{cta.text}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[hsl(225,12%,50%)] pt-1">
                    <span>{cta.text.length}/240 karakter</span>
                    {cta.keyword && (
                      <span className="text-[hsl(190,90%,55%)] bg-[hsl(190,90%,55%)]/15 px-2 py-0.5 rounded font-bold">
                        KATA KUNCI: {cta.keyword}
                      </span>
                    )}
                  </div>
                </div>

                {/* Warning if combination is contrasting */}
                {isContrast && (
                  <div className="p-2.5 rounded-lg bg-[hsl(38,92%,60%)]/10 border border-[hsl(38,92%,60%)]/20 text-xs text-[hsl(38,92%,70%)] flex items-start gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <span>
                      Catatan: Kombinasi gaya ini membutuhkan transisi narasi yang hati-hati agar tidak terkesan bertabrakan nada bicaranya.
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[hsl(230,15%,22%)]/60 flex items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyCta(cta.text);
                  }}
                  className="gap-1.5 text-xs"
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin Teks</span>
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseCta(cta);
                  }}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <span>Pakai CTA Ini</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
