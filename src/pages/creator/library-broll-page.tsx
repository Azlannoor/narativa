import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
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
} from "@/src/components/ui";
import {
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bookmark,
  Search,
  Clock,
  Sparkles,
  ShieldCheck,
  Maximize2,
  CheckCircle2,
  Layers,
  ArrowRight,
  Copy,
  ExternalLink,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import { DUMMY_BROLLS, type BrollAssetItem } from "@/src/data/dummy-seed";
import { useFavorites } from "@/src/context/favorites-context";
import { toast } from "@/src/components/ui/sonner";
import {
  BUNNY_STREAM_CDN_HOSTNAME,
  BUNNY_SIGNED_URL_TTL_SEC,
  getBunnyThumbnailUrl,
  getBunnyStreamPlayerConfig,
  type BunnyPlayerConfig,
} from "@/src/lib/bunny";

export function LibraryBrollPage() {
  const { navigate } = useNavigation();
  const { isFavorite, toggleFavorite: triggerToggleFavorite } = useFavorites();
  const [brolls, setBrolls] = useState<BrollAssetItem[]>(DUMMY_BROLLS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePreview, setActivePreview] = useState<BrollAssetItem | null>(null);
  const [signedConfig, setSignedConfig] = useState<BunnyPlayerConfig | null>(null);
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(6);
  const [tokenTimeRemaining, setTokenTimeRemaining] = useState(BUNNY_SIGNED_URL_TTL_SEC);
  const [isLoading, setIsLoading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Ambil data katalog broll dari endpoint /api/broll atau /api/library?type=broll
  useEffect(() => {
    let isMounted = true;
    async function loadBrolls() {
      setIsLoading(true);
      try {
        const res = await fetch("/api/broll");
        if (res.ok) {
          const json = await res.json();
          const items = json.items || json.data;
          if (Array.isArray(items) && items.length > 0) {
            if (isMounted) {
              setBrolls(items);
            }
          }
        }
      } catch (err) {
        console.warn("Menggunakan data seed B-roll lokal:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadBrolls();
    return () => {
      isMounted = false;
    };
  }, []);

  // Timer countdown untuk masa berlaku signed URL token di modal
  useEffect(() => {
    if (!signedConfig) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        signedConfig.expiresAt - Math.floor(Date.now() / 1000)
      );
      setTokenTimeRemaining(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, [signedConfig]);

  const handleToggleFavorite = (broll: BrollAssetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToggleFavorite(broll.id, "broll", broll.title);
  };

  // Buka pemutar video dan minta signed URL dari server
  const openPlayer = async (broll: BrollAssetItem) => {
    setActivePreview(broll);
    setIsFetchingToken(true);
    setIsPlaying(true);
    setCurrentTime(0);
    setVideoDuration(broll.durationSec || 6);

    try {
      // Panggil server endpoint untuk membuat signed URL dengan kunci rahasia server
      const res = await fetch(
        `/api/broll?videoId=${encodeURIComponent(broll.bunnyVideoId)}`
      );
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setSignedConfig(json.data);
          const remaining = Math.max(
            0,
            json.data.expiresAt - Math.floor(Date.now() / 1000)
          );
          setTokenTimeRemaining(remaining);
          return;
        }
      }
    } catch (err) {
      console.warn("Gagal mengambil signed URL dari server, gunakan generator lokal:", err);
    } finally {
      setIsFetchingToken(false);
    }

    // Fallback generator lokal jika server offline
    const localConfig = getBunnyStreamPlayerConfig(broll.bunnyVideoId);
    setSignedConfig(localConfig);
    setTokenTimeRemaining(BUNNY_SIGNED_URL_TTL_SEC);
    setIsFetchingToken(false);
  };

  const handleApplyBroll = (broll: BrollAssetItem) => {
    toast.success(`Klip "${broll.title}" siap ditugaskan ke bagian skrip.`);
    navigate(`/skrip/baru?brollId=${broll.id}`);
  };

  const copySignedUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Signed URL Bunny Stream disalin ke clipboard!");
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      setIsPlaying((p) => !p);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    } else {
      setIsMuted((m) => !m);
    }
  };

  const filteredBrolls = brolls.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[hsl(230,15%,22%)]/60 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="bts">Modul Perpustakaan 05</Badge>
            <span className="text-xs font-mono text-[hsl(225,12%,55%)]">
              {filteredBrolls.length} Klip 9:16 Faceless
            </span>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Library B-roll Faceless (9:16)
          </h1>
          <p className="text-sm text-[hsl(225,12%,65%)] max-w-2xl">
            Galeri visual rekaman latar siap pakai berformat vertikal 9:16 yang di-hosting di
            Bunny Stream CDN dengan proteksi signed URL SHA-256 token authentication.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[hsl(190,90%,55%)] bg-[hsl(230,22%,10%)] px-3 py-1.5 rounded-xl border border-[hsl(230,15%,22%)]">
          <ShieldCheck className="h-4 w-4 text-[hsl(152,60%,55%)]" />
          <span>Bunny Stream CDN: {BUNNY_STREAM_CDN_HOSTNAME}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { label: "Semua Kategori", val: "all" },
            { label: "Desk Setup", val: "desk_setup" },
            { label: "Coding & Terminal", val: "coding_terminal" },
            { label: "Creative Flow", val: "creative_flow" },
          ].map((cat) => (
            <button
              key={cat.val}
              type="button"
              onClick={() => setSelectedCategory(cat.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                selectedCategory === cat.val
                  ? "bg-[hsl(262,83%,68%)] text-white shadow-sm"
                  : "bg-[hsl(230,22%,10%)] text-[hsl(225,12%,65%)] hover:text-white border border-[hsl(230,15%,22%)]/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-[hsl(225,12%,50%)]" />
          <Input
            type="text"
            placeholder="Cari B-roll desk, coding, setup..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 9:16 Video Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrolls.map((broll) => {
          // Thumbnail resmi dari Bunny Stream CDN
          const bunnyThumbnail = getBunnyThumbnailUrl(broll.bunnyVideoId);

          return (
            <Card
              key={broll.id}
              interactive
              className="overflow-hidden flex flex-col justify-between group"
              onClick={() => openPlayer(broll)}
            >
              {/* 9:16 Vertical Video Frame with Thumbnail via next/image */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-[hsl(230,25%,4%)] rounded-t-2xl">
                <Image
                  src={bunnyThumbnail}
                  fallbackSrc={broll.thumbnailUrl}
                  alt={broll.title}
                  fill
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={false}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(230,25%,6%)] via-transparent to-[hsl(230,25%,6%)]/40 pointer-events-none" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <Badge variant="bts" className="text-[10px] uppercase font-mono">
                    {broll.category.replace("_", " ")}
                  </Badge>
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(broll, e)}
                    className={`p-1.5 rounded-lg backdrop-blur-md transition-colors cursor-pointer ${
                      isFavorite(broll.id, "broll")
                        ? "text-[hsl(38,92%,60%)] bg-[hsl(230,22%,10%)]/80"
                        : "text-white/70 hover:text-white bg-black/40"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isFavorite(broll.id, "broll") ? "fill-current" : ""}`} />
                  </button>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-14 w-14 rounded-full bg-[hsl(262,83%,68%)]/90 backdrop-blur-md flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-200">
                    <Play className="h-6 w-6 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge Bottom Right */}
                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
                  <span className="flex items-center gap-1 rounded-full bg-black/75 backdrop-blur-md px-2.5 py-1 text-[11px] font-mono text-white">
                    <Clock className="h-3 w-3 text-[hsl(190,90%,55%)]" />
                    {broll.durationSec}s · 9:16
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 space-y-3">
                <h3 className="font-heading text-base font-bold text-white group-hover:text-[hsl(262,83%,68%)] transition-colors leading-snug">
                  {broll.title}
                </h3>
                <p className="text-xs text-[hsl(225,12%,65%)] line-clamp-2 leading-relaxed">
                  {broll.description}
                </p>

                <div className="pt-2 border-t border-[hsl(230,15%,22%)]/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[hsl(190,90%,55%)] truncate max-w-[140px]" title={broll.bunnyVideoId}>
                    ID: {broll.bunnyVideoId}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApplyBroll(broll);
                    }}
                    className="text-xs gap-1"
                  >
                    <span>Pakai di Skrip</span>
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Video Player Modal dengan Signed URL dari Server */}
      {activePreview && (
        <Dialog open={!!activePreview} onOpenChange={(open) => !open && setActivePreview(null)}>
          <DialogContent className="max-w-md p-4">
            <DialogHeader className="mb-2">
              <div className="flex items-center justify-between">
                <Badge variant="bts" className="capitalize text-xs">
                  {activePreview.category.replace("_", " ")}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs font-mono text-[hsl(152,60%,55%)]">
                  <span className="h-2 w-2 rounded-full bg-[hsl(152,60%,55%)] animate-pulse" />
                  <span>Signed URL TTL: {tokenTimeRemaining}s</span>
                </div>
              </div>
              <DialogTitle className="text-lg mt-1">{activePreview.title}</DialogTitle>
              <DialogDescription className="text-xs">
                {activePreview.description}
              </DialogDescription>
            </DialogHeader>

            {/* Bunny Stream 9:16 Video Player Container */}
            <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-black border border-[hsl(230,15%,22%)] flex flex-col justify-between p-4 my-2">
              {/* Fallback image / Poster via next/image */}
              <div className="absolute inset-0">
                <Image
                  src={getBunnyThumbnailUrl(activePreview.bunnyVideoId)}
                  fallbackSrc={activePreview.thumbnailUrl}
                  alt={activePreview.title}
                  fill
                  className="object-cover opacity-85"
                />
              </div>

              {/* Video Element if live stream exists */}
              {signedConfig?.signedUrl && (
                <video
                  ref={videoRef}
                  src={signedConfig.signedUrl}
                  poster={getBunnyThumbnailUrl(activePreview.bunnyVideoId)}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  onTimeUpdate={(e) => {
                    setCurrentTime(e.currentTarget.currentTime);
                  }}
                  onLoadedMetadata={(e) => {
                    if (e.currentTarget.duration) {
                      setVideoDuration(Math.round(e.currentTarget.duration));
                    }
                  }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}

              {/* Dark Gradient Vignette for readable overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

              {/* Streaming Indicator Header */}
              <div className="relative z-10 flex items-center justify-between text-xs font-mono text-white/90">
                <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  <span className="h-2 w-2 rounded-full bg-[hsl(152,60%,50%)] animate-pulse" />
                  Bunny Stream CDN
                </span>
                <span className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 text-[hsl(190,90%,55%)]">
                  SHA-256 Token Valid
                </span>
              </div>

              {/* Center Playhead Controls */}
              <div className="relative z-10 text-center space-y-2 my-auto">
                <button
                  type="button"
                  onClick={togglePlayPause}
                  className="h-16 w-16 mx-auto rounded-full bg-[hsl(262,83%,68%)]/90 hover:bg-[hsl(262,83%,68%)] transition-all flex items-center justify-center text-white shadow-2xl backdrop-blur-md cursor-pointer hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="h-7 w-7 fill-current" />
                  ) : (
                    <Play className="h-7 w-7 fill-current ml-1" />
                  )}
                </button>
                <p className="text-xs text-white/90 font-mono drop-shadow">
                  {isPlaying ? "Memutar video vertikal 9:16" : "Video dijeda"}
                </p>
              </div>

              {/* Bottom Video Controls & Scrubber */}
              <div className="relative z-10 space-y-2 pt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-white/90">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded cursor-pointer hover:text-white"
                  >
                    {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    <span>{isMuted ? "Bisu" : "Suara"}</span>
                  </button>
                  <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                    00:0{Math.floor(currentTime)} / 00:0{videoDuration}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  className="h-1.5 w-full rounded-full bg-white/20 overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pos = (e.clientX - rect.left) / rect.width;
                    if (videoRef.current) {
                      videoRef.current.currentTime = pos * videoDuration;
                    }
                  }}
                >
                  <div
                    className="h-full bg-[hsl(262,83%,68%)] rounded-full transition-all"
                    style={{
                      width: `${(currentTime / (videoDuration || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Token Authentication Details */}
            {signedConfig && (
              <div className="rounded-xl bg-[hsl(230,22%,8%)] border border-[hsl(230,15%,20%)] p-2.5 text-[11px] font-mono space-y-1.5 text-[hsl(225,12%,60%)]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-[hsl(190,90%,55%)]">
                    <KeyRound className="h-3 w-3" /> Token SHA-256:
                  </span>
                  <span className="text-white truncate max-w-[170px]" title={signedConfig.token}>
                    {signedConfig.token.slice(0, 16)}...
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>CDN Hostname:</span>
                  <span className="text-white">{signedConfig.cdnHostname}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[hsl(230,15%,18%)]">
                  <span className="text-[hsl(152,60%,55%)]">Kedaluwarsa dalam {tokenTimeRemaining}s</span>
                  <button
                    type="button"
                    onClick={() => copySignedUrl(signedConfig.signedUrl)}
                    className="text-xs text-[hsl(262,83%,68%)] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" /> Salin Signed URL
                  </button>
                </div>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActivePreview(null)}
              >
                Tutup Pratinjau
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleApplyBroll(activePreview)}
                className="gap-1.5 font-semibold"
              >
                <span>Tugaskan ke Skrip</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
