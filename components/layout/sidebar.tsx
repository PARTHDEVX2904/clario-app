"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";
import { LayoutDashboard, Upload, FileText, HelpCircle, Settings } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { SignOutButton } from "./sign-out-button";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface SidebarProps {
  userEmail?: string | null;
}

const navItems = [
  { label: "Dashboard",     href: "/dashboard", icon: LayoutDashboard },
  { label: "Analyze a bill", href: "/upload",    icon: Upload },
  { label: "My analysis",    href: "/dashboard", icon: FileText },
];

const bottomItems = [
  { label: "Help",     href: "#", icon: HelpCircle },
  { label: "Settings", href: "#", icon: Settings },
];

export function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();

  const initials  = userEmail ? userEmail.slice(0, 2).toUpperCase() : "P";
  const displayName = userEmail ? userEmail.split("@")[0] : "Patient";

  return (
    <aside className={`${inter.className} hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-slate-100 bg-[#F5F5F5] z-30`}>

      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-slate-200/60">
        <Link href="/" className="flex items-center gap-1.5">
          <img src="/logo.svg" alt="" className="h-9 w-9" />
          <span className="text-lg font-bold text-black tracking-tight">Clario</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col px-3 py-5 gap-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Menu
        </p>
        {navItems.map((item, i) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const colors = [
            { bg: "bg-blue-100",   icon: "text-blue-500"   },
            { bg: "bg-violet-100", icon: "text-violet-500" },
            { bg: "bg-teal-100",   icon: "text-teal-500"   },
          ];
          const c = colors[i % colors.length];
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all",
                active
                  ? "bg-gradient-to-r from-[#2F2FE4]/8 to-blue-50 text-[#2F2FE4]"
                  : "text-slate-900 hover:bg-slate-200/50"
              )}
            >
              <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0", active ? "bg-[#2F2FE4]/10" : c.bg)}>
                <item.icon className={cn("h-4 w-4", active ? "text-[#2F2FE4]" : c.icon)} />
              </div>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 flex flex-col gap-0.5">
        <div className="border-t border-slate-100 pt-3 mb-1">
          {bottomItems.map((item, i) => {
            const colors = [
              { bg: "bg-amber-100",  icon: "text-amber-500"  },
              { bg: "bg-slate-100",  icon: "text-slate-500"  },
            ];
            const c = colors[i % colors.length];
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-900 hover:bg-slate-200/50 transition-all"
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${c.bg}`}>
                  <item.icon className={`h-4 w-4 ${c.icon}`} />
                </div>
                {item.label}
              </Link>
            );
          })}

          <div className="px-3 py-2.5">
            <SignOutButton />
          </div>
        </div>

        {/* User card */}
        <div className="mx-1 rounded-xl bg-white border border-slate-200/60 px-3 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2F2FE4]/15 to-blue-50 flex items-center justify-center text-sm font-bold text-[#2F2FE4] shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            {userEmail && (
              <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
