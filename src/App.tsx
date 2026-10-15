import React from "react";
import { NavigationProvider, useNavigation } from "./context/navigation-context";
import { ScriptsProvider } from "./context/scripts-context";
import { PublicLayout } from "./layouts/public-layout";
import { DashboardLayout } from "./layouts/dashboard-layout";
import { HomePage } from "./pages/public/home-page";
import { LoginPage } from "./pages/public/login-page";
import { RegisterPage } from "./pages/public/register-page";
import { PrivacyPage } from "./pages/public/privacy-page";
import { TermsPage } from "./pages/public/terms-page";
import { DashboardPage } from "./pages/creator/dashboard-page";
import { LibraryIdeasPage } from "./pages/creator/library-ideas-page";
import { LibraryHooksPage } from "./pages/creator/library-hooks-page";
import { LibraryCtasPage } from "./pages/creator/library-ctas-page";
import { LibraryFormulasPage } from "./pages/creator/library-formulas-page";
import { LibraryBrollPage } from "./pages/creator/library-broll-page";
import { ScriptWizardPage } from "./pages/creator/script-wizard-page";
import { ScriptsListPage } from "./pages/creator/scripts-list-page";
import { ScriptEditorPage } from "./pages/creator/script-editor-page";
import { ScriptPreviewPage } from "./pages/creator/script-preview-page";
import { SettingsPage } from "./pages/creator/settings-page";
import { ClerkProviderWrapper } from "./context/clerk-provider";
import { FavoritesProvider } from "./context/favorites-context";
import { Toaster } from "./components/ui";
import { PageMetadata } from "./components/seo/page-metadata";

function AppContent() {
  const { currentPath } = useNavigation();

  // 1. Auth routes (/masuk, /daftar)
  if (currentPath === "/masuk") {
    return <LoginPage />;
  }

  if (currentPath === "/daftar") {
    return <RegisterPage />;
  }

  // 2. Legal Public routes (/kebijakan-privasi, /syarat-ketentuan)
  if (currentPath === "/kebijakan-privasi") {
    return (
      <PublicLayout>
        <PrivacyPage />
      </PublicLayout>
    );
  }

  if (currentPath === "/syarat-ketentuan") {
    return (
      <PublicLayout>
        <TermsPage />
      </PublicLayout>
    );
  }

  // 3. Creator Area routes
  if (currentPath === "/dashboard") {
    return (
      <DashboardLayout
        pageTitle="Dasbor Utama"
        pageDescription="Ringkasan skrip terbaru dan akses instan ke seluruh modul studio."
      >
        <DashboardPage />
      </DashboardLayout>
    );
  }

  if (currentPath === "/library/ide") {
    return (
      <DashboardLayout
        pageTitle="Library Ide Konten"
        pageDescription="Katalog topik teruji berdasarkan pilar Edukasi, Inspirasi, Promosi, dan BTS."
      >
        <LibraryIdeasPage />
      </DashboardLayout>
    );
  }

  if (currentPath === "/library/hook") {
    return (
      <DashboardLayout
        pageTitle="Library Hook Interupsi (1–3 Detik)"
        pageDescription="Pola kalimat pembuka berdaya pikat tinggi untuk menghentikan guliran audiens."
      >
        <LibraryHooksPage />
      </DashboardLayout>
    );
  }

  if (currentPath === "/library/cta") {
    return (
      <DashboardLayout
        pageTitle="Library Call to Action (CTA)"
        pageDescription="Ajakan bertindak berdaya konversi tinggi sesuai tujuan dan gaya jualan Anda."
      >
        <LibraryCtasPage />
      </DashboardLayout>
    );
  }

  if (currentPath === "/library/formula") {
    return (
      <DashboardLayout
        pageTitle="Kerangka Formula Penulisan"
        pageDescription="Struktur tubuh naskah teruji: AIDA, PAS, BAB, hingga Hero's Journey."
      >
        <LibraryFormulasPage />
      </DashboardLayout>
    );
  }

  if (currentPath === "/library/broll") {
    return (
      <DashboardLayout
        pageTitle="Library B-roll Faceless (9:16)"
        pageDescription="Katalog aset rekaman latar vertikal via Bunny Stream CDN."
      >
        <LibraryBrollPage />
      </DashboardLayout>
    );
  }

  // Wizard Skrip Baru (/skrip/baru)
  if (currentPath.startsWith("/skrip/baru")) {
    return (
      <DashboardLayout
        pageTitle="Wizard Pembuatan Skrip"
        pageDescription="Alur 5 langkah merakit naskah berstruktur rapi siap rekam."
      >
        <ScriptWizardPage />
      </DashboardLayout>
    );
  }

  // Script Preview / Teleprompter (/skrip/[id]/pratinjau)
  if (currentPath.endsWith("/pratinjau")) {
    const parts = currentPath.split("/");
    const id = parts[2] || "";
    return (
      <DashboardLayout
        pageTitle="Mode Teleprompter Siap Rekam"
        pageDescription="Tampilan berukuran besar dengan auto-scroll dan tombol ekspor."
      >
        <ScriptPreviewPage scriptId={id} />
      </DashboardLayout>
    );
  }

  // Script Editor (/skrip/[id])
  if (currentPath.startsWith("/skrip/") && currentPath !== "/skrip/baru") {
    const parts = currentPath.split("/");
    const id = parts[2] || "";
    return (
      <DashboardLayout
        pageTitle="Editor Skrip"
        pageDescription="Edit judul, hook pembuka, bagian formula, dan pratinjau 9:16."
      >
        <ScriptEditorPage scriptId={id} />
      </DashboardLayout>
    );
  }

  // Script List (/skrip)
  if (currentPath === "/skrip") {
    return (
      <DashboardLayout
        pageTitle="Daftar Skrip Saya"
        pageDescription="Koleksi naskah Reels, TikTok, dan Facebook yang telah Anda buat."
      >
        <ScriptsListPage />
      </DashboardLayout>
    );
  }

  // Creator Settings (/pengaturan)
  if (currentPath === "/pengaturan") {
    return (
      <DashboardLayout
        pageTitle="Pengaturan Profil"
        pageDescription="Kelola identitas kreator, ganti password, dan preferensi akun."
      >
        <SettingsPage />
      </DashboardLayout>
    );
  }

  // 4. Default: Public Landing Page (/)
  return (
    <PublicLayout>
      <HomePage />
    </PublicLayout>
  );
}

export default function App() {
  return (
    <ClerkProviderWrapper>
      <NavigationProvider>
        <PageMetadata />
        <FavoritesProvider>
          <ScriptsProvider>
            <Toaster />
            <AppContent />
          </ScriptsProvider>
        </FavoritesProvider>
      </NavigationProvider>
    </ClerkProviderWrapper>
  );
}
