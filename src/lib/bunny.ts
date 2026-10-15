/**
 * Bunny Stream Integration & Signed URL Utility
 * Sesuai Dokumen PRD Bab 10 & Task 3.1:
 * - Menghasilkan signed URL untuk klip broll_assets.bunny_video_id
 * - Menggunakan token authentication SHA-256 dengan BUNNY_STREAM_TOKEN_AUTH_KEY
 * - Masa berlaku BUNNY_SIGNED_URL_TTL_SEC (default: 3600 detik / 1 jam)
 * - Menyediakan URL thumbnail dan preview teroptimasi dari BUNNY_STREAM_CDN_HOSTNAME
 */

// Kredensial & Konfigurasi Lingkungan (Environment Variables)
export const BUNNY_STREAM_CDN_HOSTNAME =
  (typeof process !== "undefined" && process.env?.BUNNY_STREAM_CDN_HOSTNAME) ||
  "vz-broll.narativa-stream.b-cdn.net";

export const BUNNY_STREAM_TOKEN_AUTH_KEY =
  (typeof process !== "undefined" && process.env?.BUNNY_STREAM_TOKEN_AUTH_KEY) ||
  "narativa_bunny_secret_token_key_2026";

export const BUNNY_SIGNED_URL_TTL_SEC =
  (typeof process !== "undefined" && Number(process.env?.BUNNY_SIGNED_URL_TTL_SEC)) ||
  3600; // 1 Jam default

export const BUNNY_STREAM_LIBRARY_ID =
  (typeof process !== "undefined" && process.env?.BUNNY_STREAM_LIBRARY_ID) ||
  "348912";

export interface BunnySignedUrlOptions {
  videoId: string;
  path?: string; // default: `/${videoId}/playlist.m3u8`
  ttlSec?: number;
  tokenKey?: string;
  cdnHostname?: string;
  libraryId?: string;
  userIp?: string;
}

export interface BunnyPlayerConfig {
  videoId: string;
  signedUrl: string; // URL utama untuk player (HLS / MP4)
  playlistUrl: string; // HLS Master Playlist .m3u8
  mp4Url: string; // Direct MP4 720p fallback
  embedUrl: string; // Iframe player embed URL
  thumbnailUrl: string; // Thumbnail resolusi tinggi dari CDN
  previewWebpUrl: string; // Animasi cuplikan WebP dari CDN
  expiresAt: number; // Unix timestamp kedaluwarsa (detik)
  expiresInSec: number;
  cdnHostname: string;
  token: string;
}

/**
 * Fungsi internal pembuat hash SHA-256 murni yang aman di Node.js maupun Browser
 */
function sha256Hex(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }

  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  const lengthProperty = "length";
  let i = 0;
  let j = 0;
  let result = "";

  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash: number[] = [];
  const k: number[] = [];
  let primeCounter = 0;

  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 300; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0, 8);

  ascii += "\x80";
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];

      const s0 =
        rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 =
        rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : ((w[i - 16] + s0 + w[i - 7] + s1) | 0);

      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const maj =
        (hash[0] & hash[1]) ^
        (hash[0] & hash[2]) ^
        (hash[1] & hash[2]);
      const s00 =
        rightRotate(hash[0], 2) ^
        rightRotate(hash[0], 13) ^
        rightRotate(hash[0], 22);
      const s11 =
        rightRotate(hash[4], 6) ^
        rightRotate(hash[4], 11) ^
        rightRotate(hash[4], 25);
      const t1 = hash[7] + s11 + ch + k[i] + w[i];
      const t2 = s00 + maj;

      hash = [(t1 + t2) | 0, hash[0], hash[1], hash[2], (hash[3] + t1) | 0, hash[4], hash[5], hash[6]];
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

/**
 * Mengonversi hex string menjadi Base64 URL-safe (sesuai Bunny Token Auth standard)
 */
function hexToBase64Url(hexStr: string): string {
  const bytes = new Uint8Array(
    (hexStr.match(/../g) || []).map((h) => parseInt(h, 16))
  );
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 =
    typeof btoa !== "undefined"
      ? btoa(binary)
      : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Menghasilkan token autentikasi Bunny Stream
 * Format Bunny: token = base64url(sha256(tokenKey + path + expires))
 */
export function generateBunnyToken(
  path: string,
  expires: number,
  tokenKey: string = BUNNY_STREAM_TOKEN_AUTH_KEY,
  userIp?: string
): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const rawString = userIp
    ? `${tokenKey}${cleanPath}${expires}${userIp}`
    : `${tokenKey}${cleanPath}${expires}`;

  const hexHash = sha256Hex(rawString);
  return hexToBase64Url(hexHash);
}

/**
 * Menghasilkan signed URL tunggal untuk path tertentu
 */
export function generateBunnySignedUrl(options: BunnySignedUrlOptions): string {
  const {
    videoId,
    path = `/${videoId}/playlist.m3u8`,
    ttlSec = BUNNY_SIGNED_URL_TTL_SEC,
    tokenKey = BUNNY_STREAM_TOKEN_AUTH_KEY,
    cdnHostname = BUNNY_STREAM_CDN_HOSTNAME,
    userIp,
  } = options;

  const expires = Math.floor(Date.now() / 1000) + ttlSec;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const token = generateBunnyToken(cleanPath, expires, tokenKey, userIp);

  return `https://${cdnHostname}${cleanPath}?token=${token}&expires=${expires}`;
}

/**
 * Menghasilkan konfigurasi lengkap pemutar video Bunny Stream (Signed URLs, Thumbnail, Embed)
 */
export function getBunnyStreamPlayerConfig(
  videoId: string,
  options?: {
    ttlSec?: number;
    tokenKey?: string;
    cdnHostname?: string;
    libraryId?: string;
    userIp?: string;
  }
): BunnyPlayerConfig {
  const ttlSec = options?.ttlSec ?? BUNNY_SIGNED_URL_TTL_SEC;
  const tokenKey = options?.tokenKey ?? BUNNY_STREAM_TOKEN_AUTH_KEY;
  const cdnHostname = options?.cdnHostname ?? BUNNY_STREAM_CDN_HOSTNAME;
  const libraryId = options?.libraryId ?? BUNNY_STREAM_LIBRARY_ID;
  const cleanVideoId = encodeURIComponent(videoId.trim());

  const expiresAt = Math.floor(Date.now() / 1000) + ttlSec;

  // Path stream Bunny
  const playlistPath = `/${cleanVideoId}/playlist.m3u8`;
  const mp4Path = `/${cleanVideoId}/play_720p.mp4`;

  // Token signatures
  const playlistToken = generateBunnyToken(playlistPath, expiresAt, tokenKey, options?.userIp);
  const mp4Token = generateBunnyToken(mp4Path, expiresAt, tokenKey, options?.userIp);

  const playlistUrl = `https://${cdnHostname}${playlistPath}?token=${playlistToken}&expires=${expiresAt}`;
  const mp4Url = `https://${cdnHostname}${mp4Path}?token=${mp4Token}&expires=${expiresAt}`;
  const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${cleanVideoId}?token=${playlistToken}&expires=${expiresAt}&autoplay=true&loop=true&muted=true`;

  const thumbnailUrl = `https://${cdnHostname}/${cleanVideoId}/thumbnail.jpg`;
  const previewWebpUrl = `https://${cdnHostname}/${cleanVideoId}/preview.webp`;

  return {
    videoId,
    signedUrl: mp4Url, // fallback langsung aman untuk HTML5 <video> tag
    playlistUrl,
    mp4Url,
    embedUrl,
    thumbnailUrl,
    previewWebpUrl,
    expiresAt,
    expiresInSec: ttlSec,
    cdnHostname,
    token: playlistToken,
  };
}

/**
 * Menghasilkan URL thumbnail resmi Bunny Stream CDN dengan parameter ukuran/fallback
 */
export function getBunnyThumbnailUrl(
  videoId: string,
  cdnHostname: string = BUNNY_STREAM_CDN_HOSTNAME
): string {
  const cleanId = encodeURIComponent(videoId.trim());
  return `https://${cdnHostname}/${cleanId}/thumbnail.jpg`;
}

/**
 * Menghasilkan URL cuplikan WebP animasi Bunny Stream CDN
 */
export function getBunnyPreviewWebpUrl(
  videoId: string,
  cdnHostname: string = BUNNY_STREAM_CDN_HOSTNAME
): string {
  const cleanId = encodeURIComponent(videoId.trim());
  return `https://${cdnHostname}/${cleanId}/preview.webp`;
}

/**
 * Validasi token signed URL (misal untuk middleware atau server-side checking)
 */
export function verifyBunnyToken(
  path: string,
  token: string,
  expires: number,
  tokenKey: string = BUNNY_STREAM_TOKEN_AUTH_KEY
): boolean {
  const now = Math.floor(Date.now() / 1000);
  if (now > expires) {
    return false; // Token sudah kedaluwarsa
  }
  const expectedToken = generateBunnyToken(path, expires, tokenKey);
  return expectedToken === token;
}
