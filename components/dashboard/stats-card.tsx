"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface StatsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  valueColo?: string;
  accentBar?: string;
  trend?: { value: string; positive: boolean };
  delay?: number;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-[#09637E]",
  iconBg = "bg-[#E6F4F7]",
  valueColo,
  accentBar = "bg-[#09637E]",
  trend,
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className={`${inter.className} relative rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200 p-5 overflow-hidden`}
    >
      {/* Accent bar top */}
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${accentBar} opacity-70 rounded-t-2xl`} />

      <div className="flex items-start justify-between mb-4 mt-1">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">{title}</p>
        <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", iconBg)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
      </div>

      <p className={cn("text-[1.65rem] font-bold tracking-tight leading-none", valueColo ?? "text-slate-900")}>
        {value}
      </p>

      {subtitle && (
        <p className="text-[11px] text-slate-400 font-medium mt-1.5">{subtitle}</p>
      )}

      {trend && (
        <p className={cn("text-xs font-semibold mt-2", trend.positive ? "text-emerald-600" : "text-red-500")}>
          {trend.positive ? "↑" : "↓"} {trend.value}
        </p>
      )}
    </motion.div>
  );
}
