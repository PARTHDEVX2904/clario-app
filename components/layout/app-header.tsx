"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-white/90 backdrop-blur-sm flex items-center justify-between px-6">
      <div>
        {title && (
          <h1 className="text-base font-semibold text-foreground">{title}</h1>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Search">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Link href="/upload">
          <Button size="sm">New analysis</Button>
        </Link>
      </div>
    </header>
  );
}
