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
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { DUMMY_FORMULAS, type FormulaItem } from "@/src/data/dummy-seed";
import { toast } from "@/src/components/ui/sonner";

export function LibraryFormulasPage() {
  const { navigate } = useNavigation();
  const [formulas, setFormulas] = useState<FormulaItem[]>(DUMMY_FORMULAS);
  const [selectedCode, setSelectedCode] = useState<string>("aida");

  // Ambil data katalog formula dari endpoint /api/library
  React.useEffect(() => {
    let isMounted = true;
    async function loadFormulas() {
      try {
        const res = await fetch("/api/library?type=formulas");
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            if (isMounted) {
              setFormulas(json.data);
            }
          }
        }
      } catch (err) {
        console.warn("Menggunakan data seed formula lokal:", err);
      }
    }
    loadFormulas();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeFormula =
    formulas.find((f) => f.code === selectedCode) || formulas[0] || DUMMY_FORMULAS[0];

  const handleUseFormula = (formula: FormulaItem) => {
    toast.success(`Formula ${formula.name.split(" ")[0]} dipilih untuk Wizard.`);
    navigate(`/skrip/baru?formulaCode=${formula.code}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="inspirasi">Modul Perpustakaan 04</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
              8 Kerangka Penulisan Teruji
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Library Formula Penulisan (Kerangka Tubuh Skrip)
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)] max-w-2xl">
            Struktur logis yang memandu naskah Anda dari rasa penasaran awal menuju kejelasan solusi
            dan konversi akhir.
          </p>
        </div>

        <Button
          variant="default"
          size="default"
          onClick={() => handleUseFormula(activeFormula)}
          className="gap-2"
        >
          <Sparkles className="h-4 w-4" />
          <span>Gunakan Formula Ini</span>
        </Button>
      </div>

      {/* Formula Selector Tabs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
          <span className="text-[hsl(225,12%,50%)] font-semibold uppercase font-mono shrink-0">
            Pilih Formula:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {DUMMY_FORMULAS.map((formula) => {
              const isSelected = selectedCode === formula.code;
              return (
                <button
                  key={formula.code}
                  type="button"
                  onClick={() => setSelectedCode(formula.code)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-colors cursor-pointer text-xs ${
                    isSelected
                      ? "bg-[hsl(262,83%,68%)] text-white shadow-sm font-semibold"
                      : "bg-[hsl(230,22%,10%)] text-[hsl(225,12%,65%)] hover:text-white border border-[hsl(230,15%,22%)]/60"
                  }`}
                >
                  {formula.name.split(" ")[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Formula Deep Dive View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Formula Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <Card className="p-6 space-y-4 border-[hsl(262,83%,68%)]/30">
            <div className="flex items-center justify-between">
              <Badge variant="inspirasi" className="font-mono text-xs">
                KODE: {activeFormula.code.toUpperCase()}
              </Badge>
              <span className="text-xs font-mono text-[hsl(190,90%,55%)]">
                {activeFormula.steps.length} Tahapan
              </span>
            </div>

            <h2 className="font-heading text-xl font-bold text-white">
              {activeFormula.name}
            </h2>

            <div className="p-3.5 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,22%)] space-y-1.5">
              <span className="text-[11px] font-mono text-[hsl(225,12%,50%)] font-semibold uppercase">
                Objektif Utama:
              </span>
              <p className="text-xs text-[hsl(220,20%,90%)] leading-relaxed">
                {activeFormula.objective}
              </p>
            </div>

            <div className="space-y-2 pt-2 text-xs text-[hsl(225,12%,65%)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[hsl(152,60%,50%)]" />
                <span>Ritme durasi rata-rata 30–60 detik</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[hsl(152,60%,50%)]" />
                <span>Maks. 600 karakter per bagian</span>
              </div>
            </div>

            <Button
              variant="default"
              size="default"
              onClick={() => handleUseFormula(activeFormula)}
              className="w-full gap-2 mt-4 font-semibold"
            >
              <span>Pakai di Wizard Skrip</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>

          {/* Quick Formula Mapping Guide */}
          <Card className="p-5 space-y-3 bg-[hsl(230,22%,8%)] border-[hsl(230,15%,20%)] text-xs">
            <h4 className="font-semibold text-white flex items-center gap-1.5 font-mono">
              <BookOpen className="h-3.5 w-3.5 text-[hsl(190,90%,55%)]" />
              Rekomendasi Pemetaan:
            </h4>
            <div className="space-y-2 text-[hsl(225,12%,65%)]">
              <p>
                <strong>AIDA / 4P / ACCA:</strong> Untuk konten edukasi mendalam menuju konversi.
              </p>
              <p>
                <strong>PAS / Teardown / Playbook:</strong> Untuk studi kasus masalah teknis.
              </p>
              <p>
                <strong>BAB / Hero's Journey:</strong> Untuk narasi transformasi personal.
              </p>
            </div>
          </Card>
        </div>

        {/* Right Column: Step by Step Guide (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-heading text-lg font-bold text-white">
              Rincian Tahapan & Contoh Naskah
            </h3>
            <span className="text-xs text-[hsl(225,12%,50%)] font-mono">
              Estimasi 2.5 kata/detik
            </span>
          </div>

          <div className="space-y-4">
            {activeFormula.steps.map((step, idx) => (
              <Card
                key={step.key}
                className="p-5 space-y-3 border-l-4 border-l-[hsl(262,83%,68%)]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-6 rounded-full bg-[hsl(262,83%,68%)]/20 text-[hsl(262,83%,75%)] text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="font-heading text-base font-bold text-white">
                      {step.label}
                    </h4>
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {step.key}
                  </Badge>
                </div>

                {/* Panduan */}
                <div className="text-xs text-[hsl(225,12%,70%)] leading-relaxed pl-8">
                  <span className="text-white font-medium">Panduan Penulisan: </span>
                  {step.guide}
                </div>

                {/* Contoh Kalimat */}
                <div className="ml-8 p-3.5 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)] space-y-1">
                  <span className="text-[10px] font-mono text-[hsl(190,90%,55%)] font-semibold uppercase">
                    Contoh Penerapan Nyata:
                  </span>
                  <p className="text-xs font-mono text-white leading-relaxed italic">
                    "{step.example}"
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
