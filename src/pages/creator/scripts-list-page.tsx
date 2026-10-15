import React, { useState } from "react";
import { useNavigation } from "@/src/context/navigation-context";
import { useScripts, type FullScript } from "@/src/context/scripts-context";
import {
  Button,
  Card,
  Badge,
  Input,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/src/components/ui";
import {
  FileText,
  Plus,
  Search,
  MoreVertical,
  Copy,
  Trash2,
  Edit3,
  Eye,
  Clock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/src/components/ui/sonner";

export function ScriptsListPage() {
  const { navigate } = useNavigation();
  const { scripts, deleteScript, duplicateScript, clearAllScripts } = useScripts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");

  // Modal dialog states
  const [scriptToDelete, setScriptToDelete] = useState<FullScript | null>(null);
  const [scriptToDuplicate, setScriptToDuplicate] = useState<FullScript | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);

  const filteredScripts = scripts.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || s.status === selectedStatus;
    const matchesPlatform = selectedPlatform === "all" || s.platform === selectedPlatform;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const confirmDelete = async () => {
    if (!scriptToDelete) return;
    setIsProcessing(true);
    try {
      await deleteScript(scriptToDelete.id);
      toast.success(`Skrip "${scriptToDelete.title}" berhasil dihapus secara permanen.`);
      setScriptToDelete(null);
    } catch (err) {
      toast.error("Gagal menghapus skrip.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmClearAll = async () => {
    setIsProcessing(true);
    try {
      await clearAllScripts();
      setShowClearAllModal(false);
    } catch {
      toast.error("Gagal membersihkan skrip.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmDuplicate = async () => {
    if (!scriptToDuplicate) return;
    setIsProcessing(true);
    try {
      await duplicateScript(scriptToDuplicate.id);
      toast.success(`Skrip "${scriptToDuplicate.title}" berhasil diduplikasi sebagai salinan!`);
      setScriptToDuplicate(null);
    } catch (err) {
      toast.error("Gagal menduplikasi skrip.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="edukasi">Koleksi Kreator</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
              {filteredScripts.length} Naskah Terdaftar
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Daftar Skrip Saya
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)]">
            Seluruh naskah video pendek Reels, TikTok, dan Facebook yang telah Anda rakit.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {scripts.length > 0 && (
            <Button
              variant="outline"
              size="default"
              onClick={() => setShowClearAllModal(true)}
              className="gap-2 text-[hsl(0,75%,65%)] border-[hsl(0,75%,62%)]/30 hover:bg-[hsl(0,75%,62%)]/10"
            >
              <Trash2 className="h-4 w-4" />
              <span>Bersihkan Semua Skrip</span>
            </Button>
          )}
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

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
            <Input
              type="text"
              placeholder="Cari berdasarkan judul skrip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="md:col-span-6 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs text-[hsl(225,12%,50%)] font-semibold uppercase font-mono shrink-0">
              Status:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {[
                { label: "Semua", val: "all" },
                { label: "Final (Siap)", val: "final" },
                { label: "Draf", val: "draft" },
                { label: "Arsip", val: "arsip" },
              ].map((st) => (
                <button
                  key={st.val}
                  type="button"
                  onClick={() => setSelectedStatus(st.val)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    selectedStatus === st.val
                      ? "bg-[hsl(262,83%,68%)] text-white shadow-sm font-semibold"
                      : "bg-[hsl(230,22%,10%)] text-[hsl(225,12%,65%)] hover:text-white border border-[hsl(230,15%,22%)]/60"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Sub-filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[hsl(225,12%,50%)] font-semibold uppercase font-mono shrink-0">
            Platform:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { label: "Semua Platform", val: "all" },
              { label: "Instagram Reels", val: "instagram_reels" },
              { label: "TikTok", val: "tiktok" },
              { label: "Facebook Reels", val: "facebook_reels" },
              { label: "Facebook Post", val: "facebook_post" },
            ].map((pl) => (
              <button
                key={pl.val}
                type="button"
                onClick={() => setSelectedPlatform(pl.val)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedPlatform === pl.val
                    ? "bg-[hsl(190,90%,55%)]/20 text-[hsl(190,90%,55%)] border border-[hsl(190,90%,55%)]/40 font-semibold"
                    : "bg-[hsl(230,22%,8%)] text-[hsl(225,12%,60%)] hover:text-white border border-[hsl(230,15%,20%)]"
                }`}
              >
                {pl.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scripts Table */}
      {filteredScripts.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <FileText className="h-10 w-10 text-[hsl(225,12%,40%)] mx-auto" />
          <h3 className="font-heading text-lg font-semibold text-white">
            Tidak ada skrip yang ditemukan
          </h3>
          <p className="text-xs text-[hsl(225,12%,60%)] max-w-sm mx-auto">
            Mulai buat skrip baru atau reset filter pencarian di atas.
          </p>
          <Button variant="default" size="sm" onClick={() => navigate("/skrip/baru")}>
            Buat Skrip Baru Sekarang
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Skrip</TableHead>
                <TableHead>Platform & Pilar</TableHead>
                <TableHead>Gaya Jualan</TableHead>
                <TableHead>Durasi Estimasi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi Tindakan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredScripts.map((script) => (
                <TableRow key={script.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-semibold text-white text-sm hover:text-[hsl(262,83%,68%)] cursor-pointer transition-colors" onClick={() => navigate(`/skrip/${script.id}`)}>
                        {script.title}
                      </span>
                      <span className="text-xs text-[hsl(225,12%,50%)] font-mono">
                        Diperbarui: {script.updatedAt} · {script.sections.length} bagian naskah
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="text-xs capitalize font-mono">
                        {script.platform.replace("_", " ")}
                      </Badge>
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
                        className="text-xs capitalize"
                      >
                        {script.pillar.replace("_", " ")}
                      </Badge>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs text-[hsl(225,12%,70%)] capitalize font-mono">
                      {script.salesStyle.replace("_", " ")}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="font-mono text-xs text-[hsl(190,90%,55%)] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ~{script.estimatedDurationSec}s ({script.wordCount} kata)
                    </span>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        script.status === "final"
                          ? "final"
                          : script.status === "draft"
                          ? "draft"
                          : "destructive"
                      }
                      className="text-xs capitalize"
                    >
                      {script.status === "final"
                        ? "Siap Rekam"
                        : script.status === "draft"
                        ? "Draf"
                        : "Arsip"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/skrip/${script.id}`)}
                        className="text-xs hover:text-white"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/skrip/${script.id}/pratinjau`)}
                        className="text-xs gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Pratinjau
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuLabel>Pilihan Tambahan</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setScriptToDuplicate(script)}>
                            <Copy className="mr-2 h-3.5 w-3.5" />
                            <span>Duplikasi Skrip</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            destructive
                            onClick={() => setScriptToDelete(script)}
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            <span>Hapus Permanen</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      {scriptToDelete && (
        <Dialog open={!!scriptToDelete} onOpenChange={(open) => !open && setScriptToDelete(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="h-10 w-10 rounded-full bg-[hsl(0,75%,62%)]/15 text-[hsl(0,75%,62%)] flex items-center justify-center mb-2">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg">Konfirmasi Hapus Skrip</DialogTitle>
              <DialogDescription>
                Apakah Anda yakin ingin menghapus skrip{" "}
                <strong>"{scriptToDelete.title}"</strong>? Tindakan ini bersifat permanen
                dan tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="secondary" onClick={() => setScriptToDelete(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Ya, Hapus Permanen
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Duplicate Confirmation Dialog */}
      {scriptToDuplicate && (
        <Dialog open={!!scriptToDuplicate} onOpenChange={(open) => !open && setScriptToDuplicate(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="h-10 w-10 rounded-full bg-[hsl(262,83%,68%)]/15 text-[hsl(262,83%,75%)] flex items-center justify-center mb-2">
                <Copy className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg">Duplikasi Skrip</DialogTitle>
              <DialogDescription>
                Buat salinan baru dari skrip <strong>"{scriptToDuplicate.title}"</strong>?
                Skrip salinan akan disimpan sebagai status Draf untuk Anda edit secara mandiri.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="secondary" onClick={() => setScriptToDuplicate(null)}>
                Batal
              </Button>
              <Button variant="default" onClick={confirmDuplicate}>
                Duplikasi Sekarang
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Clear All Scripts Confirmation Dialog */}
      {showClearAllModal && (
        <Dialog open={showClearAllModal} onOpenChange={setShowClearAllModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="h-10 w-10 rounded-full bg-[hsl(0,75%,62%)]/15 text-[hsl(0,75%,62%)] flex items-center justify-center mb-2">
                <Trash2 className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg">Bersihkan Semua Skrip?</DialogTitle>
              <DialogDescription>
                Tindakan ini akan menghapus seluruh data skrip di ruang kerja Anda sehingga kembali bersih ke kondisi awal. Tindakan ini tidak dapat dibatalkan.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="secondary" onClick={() => setShowClearAllModal(false)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={confirmClearAll} disabled={isProcessing}>
                {isProcessing ? "Membersihkan..." : "Ya, Hapus Semua"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
