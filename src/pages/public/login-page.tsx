import React from "react";
import { ClerkSignIn } from "@/src/components/auth/clerk-components";

export function LoginPage() {
  return <ClerkSignIn signUpUrl="/daftar" fallbackRedirectUrl="/dashboard" />;
}
