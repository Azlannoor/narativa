import React, { useState } from "react";
import { BUNNY_STREAM_CDN_HOSTNAME, getBunnyThumbnailUrl } from "@/src/lib/bunny";
import { Video, AlertCircle } from "lucide-react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  fallbackSrc?: string;
  onLoadingComplete?: (img: HTMLImageElement) => void;
}

/**
 * Komponen Image berstandar next/image untuk ekosistem AI Studio & Vite.
 * Mendukung optimasi CDN Bunny Stream, lazy loading, blur skeleton, dan fallback otomatis.
 */
export function Image({
  src,
  alt,
  width,
  height,
  fill,
  priority = false,
  className = "",
  fallbackSrc,
  style,
  onError,
  onLoad,
  ...props
}: ImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Normalisasi URL jika berupa videoId Bunny atau path relatif Bunny
  let resolvedSrc = src;
  if (src && !src.startsWith("http://") && !src.startsWith("https://") && !src.startsWith("/")) {
    // Jika hanya bunnyVideoId yang diberikan, gunakan hostname CDN Bunny
    resolvedSrc = getBunnyThumbnailUrl(src);
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      if (fallbackSrc) {
        (e.target as HTMLImageElement).src = fallbackSrc;
      }
    }
    if (onError) onError(e);
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const fillStyles: React.CSSProperties = fill
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }
    : {};

  if (hasError && !fallbackSrc) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[hsl(230,22%,12%)] border border-[hsl(230,15%,22%)] text-[hsl(225,12%,55%)] p-2 text-center select-none ${
          fill ? "absolute inset-0 w-full h-full" : ""
        } ${className}`}
        style={{ ...fillStyles, ...style, width: width ?? "100%", height: height ?? "100%" }}
      >
        <Video className="h-6 w-6 opacity-40 mb-1" />
        <span className="text-[10px] font-mono leading-tight max-w-[120px] truncate">{alt}</span>
      </div>
    );
  }

  return (
    <div
      className={fill ? "relative w-full h-full overflow-hidden" : "relative inline-block overflow-hidden"}
      style={fill ? undefined : { width: width || undefined, height: height || undefined }}
    >
      {/* Skeleton loading animation */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-[hsl(230,22%,12%)] animate-pulse" />
      )}

      <img
        src={hasError && fallbackSrc ? fallbackSrc : resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"} ${className}`}
        style={{ ...fillStyles, ...style }}
        {...props}
      />
    </div>
  );
}

export default Image;

/**
 * Komponen khusus Bunny Stream Thumbnail yang otomatis mengambil URL dari BUNNY_STREAM_CDN_HOSTNAME
 */
export function BunnyThumbnail({
  videoId,
  alt,
  fallbackUrl,
  className = "",
  fill = true,
}: {
  videoId: string;
  alt: string;
  fallbackUrl?: string;
  className?: string;
  fill?: boolean;
}) {
  const cdnUrl = getBunnyThumbnailUrl(videoId);
  return (
    <Image
      src={cdnUrl}
      fallbackSrc={fallbackUrl}
      alt={alt}
      fill={fill}
      className={className}
    />
  );
}
