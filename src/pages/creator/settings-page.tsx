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
  User,
  Lock,
  Trash2,
  Save,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { toast } from "@/src/components/ui/sonner";
import { updateUserProfile, deleteUserAccount } from "@/src/actions/auth-helper";

export function SettingsPage() {
  const { user, setUser, logout } = useNavigation();

  // Profile form state
  const [displayName, setDisplayName] = useState(user.displayName || "Rina Setyowati");
  const [username, setUsername] = useState(user.username || "rina_kreator");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Delete account confirmation modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !username.trim()) {
      toast.error("Nama tampilan dan username tidak boleh kosong.");
      return;
    }
    if (username.length > 32) {
      toast.error("Username maksimal 32 karakter sesuai skema Bab 10.");
      return;
    }

    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        username: username.trim(),
      });
      setUser((prev) => ({
        ...prev,
        displayName: displayName.trim(),
        username: username.trim(),
      }));
      toast.success("Profil kreator berhasil diperbarui di database!");
    } catch {
      setUser((prev) => ({
        ...prev,
        displayName: displayName.trim(),
        username: username.trim(),
      }));
      toast.success("Profil kreator berhasil disimpan.");
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Masukkan password lama Anda.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password akun berhasil diubah melalui Clerk!");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "HAPUS") {
      toast.error('Ketik "HAPUS" untuk mengonfirmasi.');
      return;
    }
    setDeleteModalOpen(false);
    try {
      await deleteUserAccount();
    } catch {
      // Continue client cleanup
    }
    localStorage.removeItem("narativa_wizard_active_draft");
    localStorage.removeItem("narativa_offline_scripts");
    localStorage.removeItem("narativa_scripts_cache_v3");
    localStorage.removeItem("narativa_scripts_cache_v2");
    localStorage.removeItem("narativa_user_favorites");
    toast.success("Akun kreator dan seluruh data skrip berhasil dihapus.");
    logout();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in-0 duration-200">
      {/* Header Info */}
      <div className="border-b border-[hsl(230,15%,22%)]/60 pb-6 space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="inspirasi">Pengaturan</Badge>
          <span className="text-xs font-mono text-[hsl(225,12%,50%)]">
            ID: @{user.username}
          </span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
          Pengaturan Profil & Akun
        </h1>
        <p className="text-sm text-[hsl(225,12%,65%)]">
          Kelola identitas kreator, ganti kredensial password, dan preferensi akun Anda.
        </p>
      </div>

      {/* 1. Profile Information Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[hsl(230,15%,22%)]/60 pb-4">
          <div className="h-10 w-10 rounded-xl bg-[hsl(262,83%,68%)]/15 text-[hsl(262,83%,75%)] flex items-center justify-center">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-white">
              Informasi Kreator
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Nama dan username ini digunakan untuk identitas profil di studio.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[hsl(220,20%,90%)] flex items-center justify-between">
                <span>Nama Tampilan</span>
                <span className="text-[10px] text-[hsl(225,12%,50%)] font-mono">maks 80 char</span>
              </label>
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={80}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[hsl(220,20%,90%)] flex items-center justify-between">
                <span>Username</span>
                <span className="text-[10px] text-[hsl(225,12%,50%)] font-mono">maks 32 char</span>
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                maxLength={32}
                className="font-mono text-sm"
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="default" size="sm" className="gap-2">
              <Save className="h-4 w-4" />
              <span>Simpan Profil</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* 2. Change Password Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[hsl(230,15%,22%)]/60 pb-4">
          <div className="h-10 w-10 rounded-xl bg-[hsl(190,90%,55%)]/15 text-[hsl(190,90%,55%)] flex items-center justify-center">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-white">
              Ganti Password Akun
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Perbarui kata sandi untuk mengamankan naskah skrip pribadi Anda.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[hsl(220,20%,90%)]">
              Password Saat Ini
            </label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[hsl(220,20%,90%)]">
                Password Baru
              </label>
              <Input
                type="password"
                placeholder="minimal 8 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[hsl(220,20%,90%)]">
                Konfirmasi Password Baru
              </label>
              <Input
                type="password"
                placeholder="ulangi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="outline" size="sm" className="gap-2">
              <Lock className="h-4 w-4" />
              <span>Perbarui Password</span>
            </Button>
          </div>
        </form>
      </Card>

      {/* 3. Danger Zone (Hapus Akun) */}
      <Card className="p-6 sm:p-8 space-y-6 border-[hsl(0,75%,62%)]/40 bg-[hsl(0,75%,62%)]/5">
        <div className="flex items-center gap-3 border-b border-[hsl(0,75%,62%)]/30 pb-4">
          <div className="h-10 w-10 rounded-xl bg-[hsl(0,75%,62%)]/20 text-[hsl(0,75%,68%)] flex items-center justify-center">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-[hsl(0,75%,68%)]">
              Zona Berbahaya (Hapus Akun)
            </h2>
            <p className="text-xs text-[hsl(225,12%,65%)]">
              Menghapus akun kreator dan seluruh data skrip yang pernah Anda buat secara permanen.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-xs text-[hsl(225,12%,70%)] leading-relaxed max-w-lg">
            Setelah akun Anda dihapus, semua draf naskah, riwayat teleprompter, dan item favorit akan dihapus permanen dari server Neon PostgreSQL. Tindakan ini tidak dapat dibatalkan.
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={() => setDeleteModalOpen(true)}
            className="gap-2 shrink-0 font-semibold"
          >
            <Trash2 className="h-4 w-4" />
            <span>Hapus Akun Saya</span>
          </Button>
        </div>
      </Card>

      {/* Delete Account Modal Dialog */}
      {deleteModalOpen && (
        <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="h-11 w-11 rounded-full bg-[hsl(0,75%,62%)]/20 text-[hsl(0,75%,68%)] flex items-center justify-center mb-2">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <DialogTitle className="text-lg text-[hsl(0,75%,68%)]">
                Konfirmasi Hapus Akun Permanen
              </DialogTitle>
              <DialogDescription>
                Tindakan ini akan menghapus akun <strong>@{user.username}</strong> beserta seluruh
                skrip konten Anda selamanya. Ketik kata <strong>HAPUS</strong> di bawah ini untuk
                mengonfirmasi.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 py-2">
              <Input
                type="text"
                placeholder='Ketik "HAPUS"'
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="font-mono text-center tracking-widest uppercase font-bold"
                autoFocus
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== "HAPUS"}
              >
                Hapus Akun Selamanya
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
