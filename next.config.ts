export interface NextConfig {
  reactStrictMode?: boolean;
  poweredByHeader?: boolean;
  headers?: () => Promise<Array<{ source: string; headers: Array<{ key: string; value: string }> }>>;
  images?: {
    remotePatterns?: Array<{ protocol: string; hostname: string }>;
  };
  [key: string]: any;
}

/**
 * Konfigurasi Next.js & Kebijakan Header Keamanan (Security Headers)
 * Sesuai Dokumen PRD Task 3.2:
 * - Content-Security-Policy (CSP)
 * - X-Frame-Options
 * - Referrer-Policy
 * - Strict-Transport-Security (HSTS)
 * - X-Content-Type-Options
 * - Permissions-Policy
 */

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://*.clerk.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com data:;
  img-src 'self' data: blob: https://images.unsplash.com https://*.b-cdn.net https://vz-broll.narativa-stream.b-cdn.net https://img.clerk.com https://*.gravatar.com;
  media-src 'self' blob: https://*.b-cdn.net https://vz-broll.narativa-stream.b-cdn.net;
  frame-src 'self' https://iframe.mediadelivery.net https://*.clerk.accounts.dev https://*.clerk.com;
  connect-src 'self' https://*.clerk.accounts.dev https://*.clerk.com https://*.neon.tech https://*.b-cdn.net https://vz-broll.narativa-stream.b-cdn.net wss:;
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'self' https://*.run.app https://aistudio.google.com https://ai.google.dev;
`
  .replace(/\s{2,}/g, " ")
  .trim();

export const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: cspHeader,
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "vz-broll.narativa-stream.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "*.b-cdn.net",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
};

export default nextConfig;
