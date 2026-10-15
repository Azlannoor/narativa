import React, { useState } from "react";
import { useNavigation } from "@/src/context/navigation-context";
import { AuthLayout } from "@/src/layouts/auth-layout";
import { Button, Input } from "@/src/components/ui";
import { User, Lock, Eye, EyeOff, Sparkles, ShieldCheck, Smile } from "lucide-react";
import { toast } from "@/src/components/ui/sonner";

export interface SignInProps {
  routing?: "path" | "hash" | "virtual";
  path?: string;
  signUpUrl?: string;
  fallbackRedirectUrl?: string;
}

export function ClerkSignIn({
  signUpUrl = "/daftar",
  fallbackRedirectUrl = "/dashboard",
}: SignInProps) {
  const { navigate, login } = useNavigation();
  const [username, setUsername] = useState("rina_kreator");
  const [password, setPassword] = useState("kreator2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Harap masukkan username dan password.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(username, "Rina Setyowati");
      toast.success(`Berhasil masuk sebagai @${username}!`);
      setLoading(false);
      navigate(fallbackRedirectUrl);
    }, 400);
  };

  const handleQuickDemo = () => {
    setUsername("rina_kreator");
    setPassword("kreator2026!");
    setLoading(true);
    setTimeout(() => {
      login("rina_kreator", "Rina Setyowati");
      toast.success("Login instan sebagai Kreator Narativa!");
      setLoading(false);
      navigate(fallbackRedirectUrl);
    }, 300);
  };

  return (
    <AuthLayout
      title="Masuk ke Narativa"
      subtitle="Gunakan username dan password akun kreator Anda."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[hsl(220,20%,90%)] flex items-center justify-between">
            <span>Username</span>
            <span className="text-[10px] text-[hsl(225,12%,50%)] font-mono">wajib</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username_kreator"
              className="pl-10"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[hsl(220,20%,90%)]">
              Password
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Fitur reset password dikelola terpusat melalui Clerk.");
              }}
              className="text-xs text-[hsl(190,90%,55%)] hover:underline"
            >
              Lupa password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-[hsl(225,12%,50%)] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          className="w-full mt-2 font-semibold h-11"
          disabled={loading}
        >
          {loading ? "Memverifikasi Kredensial..." : "Masuk ke Studio"}
        </Button>

        {/* Demo Fast Login */}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleQuickDemo}
            className="w-full border-dashed border-[hsl(262,83%,68%)]/50 text-[hsl(262,83%,75%)] hover:bg-[hsl(262,83%,68%)]/10 text-xs py-2 gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-[hsl(190,90%,55%)]" />
            <span>Akses Cepat Demo Kreator (1-Klik)</span>
          </Button>
        </div>

        {/* Bottom link */}
        <p className="text-center text-xs text-[hsl(225,12%,60%)] pt-3 border-t border-[hsl(230,15%,22%)]/60">
          Belum memiliki akun kreator?{" "}
          <button
            type="button"
            onClick={() => navigate(signUpUrl)}
            className="text-[hsl(262,83%,68%)] font-semibold hover:underline cursor-pointer"
          >
            Daftar di sini
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}

export interface SignUpProps {
  routing?: "path" | "hash" | "virtual";
  path?: string;
  signInUrl?: string;
  fallbackRedirectUrl?: string;
}

export function ClerkSignUp({
  signInUrl = "/masuk",
  fallbackRedirectUrl = "/dashboard",
}: SignUpProps) {
  const { navigate, login } = useNavigation();
  const [displayName, setDisplayName] = useState("Rina Setyowati");
  const [username, setUsername] = useState("rina_kreator");
  const [password, setPassword] = useState("kreator2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.length > 32) {
      toast.error("Username maksimal 32 karakter sesuai skema Bab 10.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password minimal 8 karakter demi keamanan.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(username, displayName);
      toast.success("Akun kreator berhasil didaftarkan! Selamat datang di Narativa.");
      setLoading(false);
      navigate(fallbackRedirectUrl);
    }, 450);
  };

  return (
    <AuthLayout
      title="Daftar Akun Kreator"
      subtitle="Mulai susun skrip video berdaya konversi tinggi dalam hitungan menit."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[hsl(220,20%,90%)] flex items-center justify-between">
            <span>Nama Tampilan</span>
            <span className="text-[10px] text-[hsl(225,12%,50%)] font-mono">maks 80 karakter</span>
          </label>
          <div className="relative">
            <Smile className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Contoh: Rina Setyowati"
              className="pl-10"
              maxLength={80}
              required
              autoFocus
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[hsl(220,20%,90%)] flex items-center justify-between">
            <span>Username</span>
            <span className="text-[10px] text-[hsl(225,12%,50%)] font-mono">unik, maks 32 karakter</span>
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
              placeholder="username_kreator"
              className="pl-10 font-mono text-sm"
              maxLength={32}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[hsl(220,20%,90%)] flex items-center justify-between">
            <span>Password</span>
            <span className="text-[10px] text-[hsl(225,12%,50%)] font-mono">min 8 karakter</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="buat password yang kuat"
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-[hsl(225,12%,50%)] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          className="w-full mt-2 font-semibold h-11"
          disabled={loading}
        >
          {loading ? "Mendaftarkan Akun..." : "Buat Akun Sekarang"}
        </Button>

        {/* Bottom link */}
        <p className="text-center text-xs text-[hsl(225,12%,60%)] pt-3 border-t border-[hsl(230,15%,22%)]/60">
          Sudah memiliki akun?{" "}
          <button
            type="button"
            onClick={() => navigate(signInUrl)}
            className="text-[hsl(262,83%,68%)] font-semibold hover:underline cursor-pointer"
          >
            Masuk di sini
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
