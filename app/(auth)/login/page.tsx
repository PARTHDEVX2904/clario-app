import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in | Clario",
};

export default function LoginPage() {
  return (
    // Suspense required because AuthForm reads useSearchParams()
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
