/**
 * Konfigurasi Tema Dark Mode Clerk sesuai Bab 4 PRD Narativa:
 * Background HSL(230, 25%, 6%), card HSL(230, 22%, 10%),
 * primary violet HSL(262, 83%, 68%), accent cyan HSL(190, 90%, 55%).
 */
export const clerkDarkAppearance = {
  variables: {
    colorPrimary: "hsl(262, 83%, 68%)",
    colorBackground: "hsl(230, 22%, 10%)",
    colorInputBackground: "hsl(230, 22%, 8%)",
    colorInputText: "hsl(220, 20%, 95%)",
    colorText: "hsl(220, 20%, 95%)",
    colorTextSecondary: "hsl(225, 12%, 65%)",
    colorDanger: "hsl(0, 75%, 62%)",
    borderRadius: "1rem",
    fontFamily: "'Inter', sans-serif",
  },
  elements: {
    card: "bg-[hsl(230,22%,10%)] border border-[hsl(230,15%,22%)]/70 shadow-2xl rounded-2xl p-6",
    headerTitle: "font-heading text-xl text-white font-bold tracking-tight",
    headerSubtitle: "text-[hsl(225,12%,65%)] text-xs",
    formButtonPrimary:
      "bg-gradient-to-r from-[hsl(262,83%,68%)] to-[hsl(262,75%,58%)] hover:from-[hsl(262,83%,72%)] hover:to-[hsl(262,75%,62%)] text-white shadow-md rounded-xl h-11 text-sm font-semibold transition-all",
    formFieldInput:
      "bg-[hsl(230,22%,8%)] border-[hsl(230,15%,22%)] text-[hsl(220,20%,95%)] rounded-xl h-10 focus:border-[hsl(262,83%,68%)] focus:ring-2 focus:ring-[hsl(262,83%,68%)]/30",
    formFieldLabel: "text-xs font-semibold text-[hsl(220,20%,90%)]",
    footerActionLink: "text-[hsl(190,90%,55%)] hover:underline font-medium",
    identityPreviewText: "text-white text-xs font-mono",
    dividerLine: "bg-[hsl(230,15%,22%)]/60",
    dividerText: "text-[hsl(225,12%,50%)] text-xs uppercase font-mono",
  },
};
