import React from "react";
import { ClerkProvider as OriginalClerkProvider } from "@clerk/clerk-react";
import { clerkDarkAppearance } from "@/src/components/auth/clerk-theme";

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  const publishableKey =
    (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) ||
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY) ||
    "";

  // Jika kunci publik Clerk tersedia dan bukan placeholder pk_test_xxxx
  const hasValidClerkKey =
    Boolean(publishableKey) &&
    !publishableKey.includes("pk_test_xxxxxxxxxxxxxxxx") &&
    publishableKey.startsWith("pk_");

  if (hasValidClerkKey) {
    return (
      <OriginalClerkProvider
        publishableKey={publishableKey}
        appearance={clerkDarkAppearance}
        signInUrl="/masuk"
        signUpUrl="/daftar"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
      >
        {children}
      </OriginalClerkProvider>
    );
  }

  // Jika kunci belum diset atau dalam mode demo dev
  return <>{children}</>;
}
