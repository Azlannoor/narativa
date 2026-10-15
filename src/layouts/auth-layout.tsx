import React from "react";
import { useNavigation } from "@/src/context/navigation-context";
import { Sparkles, ArrowLeft, ShieldCheck } from "lucide-react";

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  const { navigate } = useNavigation();

  return (
    <div className="min-h-screen relative flex flex-col justify-center items-center px-4 py-12 bg-[hsl(230,25%,6%)] text-[hsl(220,20%,95%)] overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[hsl(262,83%,68%)]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[400px] h-[300px] bg-[hsl(190,90%,55%)]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-sm text-[hsl(225,12%,65%)] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      {/* Brand header */}
      <div className="relative z-10 text-center mb-8 space-y-2">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2.5 group cursor-pointer"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[hsl(262,83%,68%)] to-[hsl(190,90%,55%)] flex items-center justify-center shadow-[0_0_24px_-4px_hsla(262,83%,68%,0.6)]">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-heading font-bold text-2xl tracking-tight text-white group-hover:text-[hsl(262,83%,68%)] transition-colors">
            Narativa
          </span>
        </button>
        <h1 className="font-heading text-xl font-bold text-white tracking-tight pt-1">
          {title}
        </h1>
        <p className="text-sm text-[hsl(225,12%,65%)] max-w-sm">
          {subtitle}
        </p>
      </div>

      {/* Centered Auth Card Container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-[hsl(230,15%,22%)]/70 bg-[hsl(230,22%,10%)]/95 backdrop-blur-md p-8 shadow-2xl">
          {children}
        </div>

        {/* Security badge footer */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[hsl(225,12%,50%)]">
          <ShieldCheck className="h-4 w-4 text-[hsl(152,60%,50%)]" />
          <span>Autentikasi terenkripsi aman · Clerk Auth</span>
        </div>
      </div>
    </div>
  );
}
