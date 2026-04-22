"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  function openSearch() {
    setSearchOpen(true);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/dashboard?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/dashboard");
    }
    closeSearch();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") closeSearch();
  }

  return (
    <header className={`${inter.className} h-16 bg-[#F5F5F5] flex items-center justify-between px-6`}>
      <div>
        {title && (
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Inline search bar */}
        {searchOpen ? (
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search analyses..."
                className={cn(
                  "h-9 w-56 rounded-lg border border-border bg-slate-50 pl-8 pr-3 text-sm font-medium",
                  "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#09637E]/30 focus:border-[#09637E]/50 transition-all"
                )}
              />
            </div>
            <button
              type="button"
              onClick={closeSearch}
              className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
              aria-label="Close search"
            >
              <X className="h-4 w-4" />
            </button>
          </form>
        ) : (
          <Button variant="ghost" size="icon" aria-label="Search" onClick={openSearch}>
            <Search className="h-4 w-4" />
          </Button>
        )}

        <Link href="/upload">
          <Button className="px-5 h-9 text-sm font-semibold">New analysis</Button>
        </Link>
      </div>
    </header>
  );
}
