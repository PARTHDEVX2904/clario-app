"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  Upload,
  FileText,
  HelpCircle,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SignOutButton } from "./sign-out-button";

interface SidebarProps {
  userEmail?: string | null;
}

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze a bill", href: "/upload", icon: Upload },
  { label: "My analyses", href: "/dashboard", icon: FileText },
];

const bottomItems = [
  { label: "Help", href: "#", icon: HelpCircle },
  { label: "Settings", href: "#", icon: Settings },
];

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  const initials = userEmail
    ? userEmail.slice(0, 2).toUpperCase()
    : "P";

  const displayName = userEmail
    ? userEmail.split("@")[0]
    : "Patient";

  return (
    <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-white z-30">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary-500 text-white">
            <Activity className="h-3.5 w-3.5" />
          </div>
          <span className="font-display text-lg font-semibold text-foreground">Clario</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col px-3 py-4 gap-0.5 overflow-y-auto">
        <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary-50 text-primary-700"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className={cn("h-4 w-4 shrink-0", active && "text-primary-600")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-border flex flex-col gap-0.5">
        {bottomItems.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        ))}

        <SignOutButton />

        {/* User info */}
        <div className="mt-2 pt-2 border-t border-border px-3 py-2 flex items-center gap-3">
          <div className="h-7 w-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-700 shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">{displayName}</p>
            {userEmail && (
              <p className="text-[11px] text-muted-foreground truncate">{userEmail}</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
