import Link from "next/link";
import { Activity, ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "radial-gradient(ellipse at 60% 10%, #7AB2B2 0%, #aed6da 22%, #c8e8ed 45%, #d9eff3 65%, #EBF4F6 100%)",
      }}
    >
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]" />

      {/* Home button — fixed top-left */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Home
        </Link>
      </div>

      {/* Centered content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-500 text-white">
            <Activity className="h-4 w-4" />
          </div>
          <span className="font-display text-xl font-semibold text-foreground">Clario</span>
        </Link>

        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
