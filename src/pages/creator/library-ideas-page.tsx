import React, { useState, useMemo } from "react";
import { useNavigation } from "@/src/context/navigation-context";
import {
  Button,
  Card,
  Badge,
  Input,
} from "@/src/components/ui";
import {
  Lightbulb,
  Search,
  Bookmark,
  ArrowRight,
  Filter,
  Users,
  Wrench,
  Sparkles,
} from "lucide-react";
import { DUMMY_IDEAS, type IdeaItem } from "@/src/data/dummy-seed";
import { useFavorites } from "@/src/context/favorites-context";
import { toast } from "@/src/components/ui/sonner";

export function LibraryIdeasPage() {
  const { navigate } = useNavigation();
  const { isFavorite, toggleFavorite: triggerToggleFavorite } = useFavorites();
  const [ideas, setIdeas] = useState<IdeaItem[]>(DUMMY_IDEAS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillar, setSelectedPillar] = useState<string>("all");
  const [selectedFormat, setSelectedFormat] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data katalog ide dari endpoint /api/library
  React.useEffect(() => {
    let isMounted = true;
    async function loadIdeas() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/library?type=ideas");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) {
              setIdeas(json.data);
            }
          }
        }
      } catch (err) {
        console.warn("Menggunakan data seed ide lokal:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadIdeas();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleFavorite = (idea: IdeaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToggleFavorite(idea.id, "idea", idea.title);
  };

  const handleUseIdea = (idea: IdeaItem) => {
    // Navigate to wizard with selected idea state
    toast.success(`Ide "${idea.title.slice(0, 30)}..." dipilih untuk Wizard.`);
    navigate(`/skrip/baru?ideaId=${idea.id}&pillar=${idea.pillar}`);
  };

  const filteredIdeas = useMemo(() => {
    return ideas
      .filter((item) => {
        const matchesSearch =
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.technicalNote.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesPillar =
          selectedPillar === "all" || item.pillar === selectedPillar;

        const matchesFormat =
          selectedFormat === "all" ||
          item.formats.includes(selectedFormat as any);

        return matchesSearch && matchesPillar && matchesFormat;
      })
      .sort((a, b) => {
        // Ide favorit selalu muncul di atas sesuai Bab 6 PRD
        if (a.isFavorite && !b.isFavorite) return -1;
        if (!a.isFavorite && b.isFavorite) return 1;
        return 0;
      });
  }, [ideas, searchQuery, selectedPillar, selectedFormat]);

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="edukasi">Modul Perpustakaan 01</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
              {filteredIdeas.length} Ide Ditemukan
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Library Ide Konten
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)] max-w-2xl">
            Katalog topik teruji berdasarkan 4 pilar utama. Pilih salah satu ide untuk langsung
            membuka Wizard perakitan skrip 5 langkah.
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

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
            <Input
              type="text"
              placeholder="Cari ide, kata kunci, catatan teknis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Pillar Filter Select Buttons */}
          <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-[hsl(225,12%,50%)] font-semibold uppercase font-mono shrink-0">
              Pilar:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { label: "Semua", val: "all" },
                { label: "Edukasi", val: "edukasi" },
                { label: "Inspirasi", val: "inspirasi" },
                { label: "Promosi", val: "promosi" },
                { label: "BTS/Personal", val: "bts_personal" },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setSelectedPillar(p.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedPillar === p.val
                      ? "bg-[hsl(262,83%,68%)] text-white shadow-sm"
                      : "bg-[hsl(230,22%,10%)] text-[hsl(225,12%,65%)] hover:text-white border border-[hsl(230,15%,22%)]/60"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Format Platform Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[hsl(225,12%,50%)] font-semibold uppercase font-mono shrink-0">
            Platform:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { label: "Semua Format", val: "all" },
              { label: "Instagram Reels", val: "instagram_reels" },
              { label: "TikTok", val: "tiktok" },
              { label: "Facebook Reels", val: "facebook_reels" },
              { label: "Facebook Post", val: "facebook_post" },
            ].map((f) => (
              <button
                key={f.val}
                type="button"
                onClick={() => setSelectedFormat(f.val)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedFormat === f.val
                    ? "bg-[hsl(190,90%,55%)]/20 text-[hsl(190,90%,55%)] border border-[hsl(190,90%,55%)]/40 font-semibold"
                    : "bg-[hsl(230,22%,8%)] text-[hsl(225,12%,60%)] hover:text-white border border-[hsl(230,15%,20%)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Idea Cards */}
      {filteredIdeas.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <Lightbulb className="h-10 w-10 text-[hsl(225,12%,40%)] mx-auto" />
          <h3 className="font-heading text-lg font-semibold text-white">
            Tidak ada ide yang cocok dengan filter
          </h3>
          <p className="text-xs text-[hsl(225,12%,60%)] max-w-sm mx-auto">
            Coba ubah kata kunci pencarian Anda atau pilih pilar konten lainnya.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setSelectedPillar("all");
              setSelectedFormat("all");
            }}
          >
            Reset Semua Filter
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.map((idea) => {
            const pillarVariant =
              idea.pillar === "edukasi"
                ? "edukasi"
                : idea.pillar === "inspirasi"
                ? "inspirasi"
                : idea.pillar === "promosi"
                ? "promosi"
                : "bts";

            return (
              <Card
                key={idea.id}
                interactive
                className="p-6 flex flex-col justify-between space-y-4 relative group"
                onClick={() => handleUseIdea(idea)}
              >
                {/* Top card row */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={pillarVariant} className="capitalize">
                      {idea.pillar.replace("_", " ")}
                    </Badge>
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(idea, e)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isFavorite(idea.id, "idea")
                          ? "text-[hsl(38,92%,60%)] bg-[hsl(38,92%,60%)]/15"
                          : "text-[hsl(225,12%,40%)] hover:text-white hover:bg-[hsl(230,20%,16%)]"
                      }`}
                      title={isFavorite(idea.id, "idea") ? "Hapus favorit" : "Simpan favorit"}
                    >
                      <Bookmark className={`h-4 w-4 ${isFavorite(idea.id, "idea") ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading text-lg font-bold text-white group-hover:text-[hsl(262,83%,68%)] transition-colors leading-snug">
                    {idea.title}
                  </h3>

                  {/* Target Audience */}
                  <div className="space-y-1 pt-1 text-xs text-[hsl(225,12%,65%)]">
                    <div className="flex items-start gap-1.5">
                      <Users className="h-3.5 w-3.5 text-[hsl(190,90%,55%)] shrink-0 mt-0.5" />
                      <span>{idea.targetAudience}</span>
                    </div>
                  </div>

                  {/* Technical Note */}
                  <div className="p-3 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)] text-xs text-[hsl(220,20%,90%)] space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-[hsl(225,12%,50%)]">
                      <Wrench className="h-3 w-3" />
                      <span>Catatan Teknis Rekaman:</span>
                    </div>
                    <p className="leading-relaxed text-[hsl(225,12%,70%)]">
                      {idea.technicalNote}
                    </p>
                  </div>
                </div>

                {/* Bottom Row: Formats and Action */}
                <div className="pt-3 border-t border-[hsl(230,15%,22%)]/60 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {idea.formats.map((fmt) => (
                      <span
                        key={fmt}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[hsl(230,22%,12%)] text-[hsl(225,12%,60%)]"
                      >
                        {fmt === "instagram_reels"
                          ? "Reels"
                          : fmt === "tiktok"
                          ? "TikTok"
                          : fmt === "facebook_reels"
                          ? "FB Reels"
                          : "FB Post"}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseIdea(idea);
                    }}
                    className="gap-1.5 text-xs text-[hsl(262,83%,75%)] hover:bg-[hsl(262,83%,68%)]/20"
                  >
                    <span>Pakai Ide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
