import React, { useState } from "react";
import { useNavigation, type RoutePath } from "@/src/context/navigation-context";
import {
  Button,
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Badge,
} from "@/src/components/ui";
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Lightbulb,
  Flame,
  MousePointerClick,
  Layers,
  Video,
  Settings,
  Plus,
  Search,
  Menu,
  LogOut,
  User,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface NavItem {
  label: string;
  path: RoutePath;
  icon: React.ElementType;
  badge?: string;
}

const navSections: { title?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: "Dasbor Utama", path: "/dashboard", icon: LayoutDashboard },
      { label: "Skrip Saya", path: "/skrip", icon: FileText, badge: "3 Draf" },
    ],
  },
  {
    title: "MODUL PERPUSTAKAAN",
    items: [
      { label: "Library Ide", path: "/library/ide", icon: Lightbulb },
      { label: "Library Hook", path: "/library/hook", icon: Flame },
      { label: "Library CTA", path: "/library/cta", icon: MousePointerClick },
      { label: "Library Formula", path: "/library/formula", icon: Layers },
      { label: "Library B-roll 9:16", path: "/library/broll", icon: Video },
    ],
  },
  {
    title: "PREFERENSI",
    items: [
      { label: "Pengaturan Profil", path: "/pengaturan", icon: Settings },
    ],
  },
];

export function DashboardLayout({
  children,
  pageTitle,
  pageDescription,
}: {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
}) {
  const { currentPath, navigate, user, logout } = useNavigation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  // Shortcut Ctrl+K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = (path: RoutePath) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const renderNavList = () => (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => handleNavClick("/dashboard")}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[hsl(262,83%,68%)] to-[hsl(190,90%,55%)] flex items-center justify-center shadow-[0_0_18px_-2px_hsla(262,83%,68%,0.5)]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg text-white group-hover:text-[hsl(262,83%,68%)] transition-colors">
                Narativa
              </span>
              <span className="text-[10px] text-[hsl(225,12%,55%)] -mt-1 font-mono">
                Creator Studio
              </span>
            </div>
          </button>
        </div>

        {/* Action Button: Buat Skrip Baru */}
        <div className="px-1">
          <Button
            variant="default"
            size="default"
            onClick={() => handleNavClick("/skrip/baru")}
            className="w-full justify-center gap-2 font-semibold shadow-[0_0_20px_-4px_hsla(262,83%,68%,0.4)]"
          >
            <Plus className="h-4 w-4" />
            <span>Buat Skrip Baru</span>
          </Button>
        </div>

        {/* Nav Sections */}
        <nav className="space-y-5 px-1">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              {section.title && (
                <div className="px-3 text-[11px] font-semibold text-[hsl(225,12%,50%)] uppercase tracking-wider font-mono">
                  {section.title}
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPath === item.path;

                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => handleNavClick(item.path)}
                      className={`group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                        isActive
                          ? "bg-[hsl(230,20%,14%)] text-white shadow-sm border border-[hsl(262,83%,68%)]/30"
                          : "text-[hsl(225,12%,65%)] hover:bg-[hsl(230,20%,12%)] hover:text-[hsl(220,20%,95%)]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-4 w-4 transition-colors ${
                            isActive
                              ? "text-[hsl(262,83%,68%)]"
                              : "text-[hsl(225,12%,55%)] group-hover:text-[hsl(220,20%,95%)]"
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded-full bg-[hsl(262,83%,68%)]/20 px-2 py-0.5 text-[10px] font-mono text-[hsl(262,83%,75%)] border border-[hsl(262,83%,68%)]/30">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Footer Profile in Sidebar */}
      <div className="border-t border-[hsl(230,15%,22%)]/60 pt-4 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,22%)]/40 hover:bg-[hsl(230,20%,12%)] transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[hsl(262,83%,68%)] to-[hsl(190,90%,55%)] flex items-center justify-center text-xs font-bold text-white">
                  {user.displayName ? user.displayName.charAt(0) : "R"}
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-xs font-semibold text-white truncate">
                    {user.displayName || "Kreator Narativa"}
                  </span>
                  <span className="text-[11px] text-[hsl(225,12%,50%)] font-mono truncate">
                    @{user.username || "kreator"}
                  </span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-[hsl(225,12%,50%)]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mb-2">
            <DropdownMenuLabel>Akun Kreator</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleNavClick("/pengaturan")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil & Password</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavClick("/")}>
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Lihat Halaman Publik</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem destructive onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Keluar (Logout)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[hsl(230,25%,6%)] text-[hsl(220,20%,95%)] selection:bg-[hsl(262,83%,68%)]/30 selection:text-white font-sans antialiased flex">
      {/* Desktop Fixed Sidebar (260px) */}
      <aside className="hidden md:flex flex-col w-[260px] fixed inset-y-0 left-0 z-30 border-r border-[hsl(230,15%,22%)]/60 bg-[hsl(230,22%,10%)]/75 backdrop-blur-md p-4">
        {renderNavList()}
      </aside>

      {/* Main Content Area (offset by 260px on desktop) */}
      <div className="flex-1 flex flex-col md:pl-[260px] min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[hsl(230,15%,22%)]/60 bg-[hsl(230,25%,6%)]/80 backdrop-blur-md px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Hamburger Drawer Trigger */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-[hsl(225,12%,65%)]"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Buka Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-4">
                <SheetHeader className="hidden">
                  <SheetTitle>Menu Navigasi</SheetTitle>
                </SheetHeader>
                {renderNavList()}
              </SheetContent>
            </Sheet>

            {/* Page Title & Breadcrumb Header */}
            <div>
              <h1 className="font-heading text-lg font-bold text-white tracking-tight">
                {pageTitle || "Dasbor Kreator"}
              </h1>
              {pageDescription && (
                <p className="text-xs text-[hsl(225,12%,65%)] hidden sm:block">
                  {pageDescription}
                </p>
              )}
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-3">
            {/* Fast Search Ctrl+K Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCommandOpen(true)}
              className="hidden sm:flex items-center gap-2 text-[hsl(225,12%,65%)] h-9 px-3"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">Cari modul atau skrip...</span>
              <kbd className="pointer-events-none rounded bg-[hsl(230,22%,14%)] px-1.5 py-0.5 text-[10px] font-mono text-[hsl(225,12%,65%)] border border-[hsl(230,15%,22%)] ml-2">
                Ctrl+K
              </kbd>
            </Button>

            {/* Buat Skrip Fast Button in Header */}
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/skrip/baru")}
              className="gap-1.5 font-medium hidden sm:flex"
            >
              <Plus className="h-4 w-4" />
              <span>Buat Skrip</span>
            </Button>

            {/* Avatar Pill in Header */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[hsl(262,83%,68%)] to-[hsl(190,90%,55%)] flex items-center justify-center text-xs font-bold text-white shadow-sm hover:scale-105 transition-transform cursor-pointer"
                >
                  {user.displayName ? user.displayName.charAt(0) : "R"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {user.displayName || "Rina Setyowati"}
                    </span>
                    <span className="text-xs text-[hsl(225,12%,50%)] font-mono font-normal">
                      @{user.username || "rina_kreator"}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                  Dasbor Utama
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/skrip")}>
                  Daftar Skrip Saya
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/pengaturan")}>
                  Pengaturan Akun
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onClick={logout}>
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Viewport Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Floating Action Button (Bab 4: Tombol Mengambang di Kanan Bawah) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate("/skrip/baru")}
          className="h-14 w-14 rounded-full p-0 shadow-[0_0_24px_rgba(157,98,247,0.5)] flex items-center justify-center active:scale-95"
        >
          <Plus className="h-6 w-6 text-white" />
          <span className="sr-only">Buat Skrip Baru</span>
        </Button>
      </div>

      {/* Global Quick Search Command Palette Modal */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Cari ide, hook, formula, atau navigasi..." />
        <CommandList>
          <CommandEmpty>Tidak ada modul yang cocok.</CommandEmpty>
          <CommandGroup heading="Aksi Langsung">
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/skrip/baru");
              }}
            >
              <Plus className="mr-2 h-4 w-4 text-[hsl(262,83%,68%)]" />
              <span>Buat Skrip Baru (Wizard 5 Langkah)</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Perpustakaan (Library)">
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/library/ide");
              }}
            >
              <Lightbulb className="mr-2 h-4 w-4 text-[hsl(190,90%,55%)]" />
              <span>Library Ide Konten (Berdasarkan Pilar)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/library/hook");
              }}
            >
              <Flame className="mr-2 h-4 w-4 text-[hsl(0,75%,62%)]" />
              <span>Library Hook Berdaya Pikat (Interupsi 1-3 Detik)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/library/cta");
              }}
            >
              <MousePointerClick className="mr-2 h-4 w-4 text-[hsl(38,92%,60%)]" />
              <span>Library Call to Action (CTA)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/library/formula");
              }}
            >
              <Layers className="mr-2 h-4 w-4 text-[hsl(262,83%,68%)]" />
              <span>Formula Penulisan (AIDA, PAS, BAB, dll.)</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/library/broll");
              }}
            >
              <Video className="mr-2 h-4 w-4 text-[hsl(165,75%,45%)]" />
              <span>Galeri B-roll Vertikal 9:16</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Navigasi Kreator">
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/dashboard");
              }}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dasbor Utama</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/skrip");
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Daftar Skrip Saya</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                setCommandOpen(false);
                navigate("/pengaturan");
              }}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Pengaturan Profil</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
