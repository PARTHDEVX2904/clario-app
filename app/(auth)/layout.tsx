import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "radial-gradient(ellipse at 60% 10%, #7AB2B2 0%, #aed6da 22%, #c8e8ed 45%, #d9eff3 65%, #EBF4F6 100%)",
      }}
    >
      {/* Translucent overlay */}
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[3px]" />

      {/* Home button — fixed top-left */}
      <div className="absolute top-4 left-4 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-foreground/70 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Home
        </Link>
      </div>

      {/* Centered content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
