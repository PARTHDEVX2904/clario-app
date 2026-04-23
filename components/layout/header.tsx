"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["600"],
});

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { label: "Process", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "FAQ", href: "#faq" },
    { label: "Privacy", href: "#trust" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-2.5 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              router.refresh();
            }
          }}
          className="flex items-center gap-1.5 group"
        >
          <img src="/logo.svg" alt="" className="h-7 w-7" />
          <span className={`${inter.className} text-xl font-bold text-black tracking-tight`}>
            Clario
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-black hover:text-primary-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className={`${inter.className} text-sm font-semibold text-black hover:text-black/70 transition-colors`}
          >
            Log In
          </Link>
          <Link href="/login?mode=signup">
            <Button size="sm" className="px-5 rounded-lg">Sign Up</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background"
          >
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-foreground hover:text-primary-600"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-border flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link href="/login?mode=signup" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
