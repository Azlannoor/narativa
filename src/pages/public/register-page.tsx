import React from "react";
import { ClerkSignUp } from "@/src/components/auth/clerk-components";

export function RegisterPage() {
  return <ClerkSignUp signInUrl="/masuk" fallbackRedirectUrl="/dashboard" />;
}
