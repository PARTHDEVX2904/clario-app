"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

type Mode = "signin" | "signup";

export function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const initialMode: Mode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  function switchMode(newMode: Mode) {
    setMode(newMode);
    setError(null);
    setMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("invalid login credentials")) {
            setError("No account found with these credentials. Please check your details or sign up.");
          } else {
            setError(error.message);
          }
          return;
        }
        router.push(next);
        router.refresh();
      } else {
        if (!name.trim()) {
          setError("Please enter your full name.");
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) {
          if (error.message.toLowerCase().includes("already registered") || error.message.toLowerCase().includes("already exists")) {
            setError("An account with this email already exists. Please sign in instead.");
          } else {
            setError(error.message);
          }
          return;
        }
        setMessage("Account created! Check your email for a confirmation link.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setError(null);
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) setError(error.message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white shadow-card-lg p-8">
      {/* Logo */}
      <div className="flex justify-center mb-5">
        <Link href="/">
          <img src="/logo.svg" alt="Clario" className="h-12 w-12" />
        </Link>
      </div>

      {/* Mode tabs */}
      <div className={`${inter.className} flex rounded-xl border border-border overflow-hidden mb-6`}>
        <button
          type="button"
          onClick={() => switchMode("signin")}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            mode === "signin"
              ? "bg-black text-white"
              : "bg-white text-muted-foreground hover:text-foreground"
          }`}
        >
          Log In
        </button>
        <button
          type="button"
          onClick={() => switchMode("signup")}
          className={`flex-1 py-2 text-sm font-semibold transition-colors ${
            mode === "signup"
              ? "bg-black text-white"
              : "bg-white text-muted-foreground hover:text-foreground"
          }`}
        >
          Sign Up
        </button>
      </div>

      <h1 className={`${inter.className} text-xl font-semibold text-foreground mb-1 text-center`}>
        {mode === "signin" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="text-sm text-muted-foreground mb-6 text-center">
        {mode === "signin"
          ? "Sign in to access your billing dashboard"
          : "Free account. No credit card required."}
      </p>

      {message && (
        <div className="mb-4 rounded-lg bg-accent-50 border border-accent-200 px-4 py-3 text-sm text-accent-800">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name field — signup only */}
        {mode === "signup" && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-border bg-white px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full mt-1" loading={loading}>
          {mode === "signin" ? "Sign in" : "Create account"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-5 text-center">
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Or continue with</span>
      </div>

      {/* Google sign-in */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2.5 rounded-lg border border-border bg-white px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-60"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
        </svg>
        {googleLoading ? "Redirecting…" : "Continue with Google"}
      </button>
    </div>
  );
}
