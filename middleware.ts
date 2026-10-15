export interface ClerkMiddlewareConfig {
  matcher: string[];
}

export const config: ClerkMiddlewareConfig = {
  matcher: [
    // Lewatkan file statis internal Next/Vite
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Jalankan selalu untuk rute API
    "/(api|trpc)(.*)",
  ],
};

// Pola route yang dilindungi (Bab 3 & Bab 8 PRD)
const isProtectedRoute = (pathname: string): boolean => {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/library") ||
    pathname.startsWith("/skrip") ||
    pathname.startsWith("/pengaturan")
  );
};

// Pola route publik yang terbuka
const isPublicRoute = (pathname: string): boolean => {
  return (
    pathname === "/" ||
    pathname.startsWith("/masuk") ||
    pathname.startsWith("/daftar") ||
    pathname === "/kebijakan-privasi" ||
    pathname === "/syarat-ketentuan" ||
    pathname.startsWith("/api/webhooks/clerk")
  );
};

/**
 * Clerk Middleware Implementation
 * Melindungi rute area kreator dan memeriksa sesi otentikasi.
 */
export function clerkMiddleware(req: {
  url: string;
  nextUrl?: { pathname: string };
  auth?: () => { userId: string | null };
}) {
  const url = new URL(req.url);
  const pathname = req.nextUrl?.pathname || url.pathname;

  // Jika mencoba mengakses rute terproteksi tanpa otentikasi
  if (isProtectedRoute(pathname)) {
    const authSession = req.auth ? req.auth() : { userId: null };
    if (!authSession.userId) {
      const signInUrl = new URL("/masuk", req.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return {
        redirect: signInUrl.toString(),
        status: 302,
      };
    }
  }

  return { status: 200 };
}

export default clerkMiddleware;
