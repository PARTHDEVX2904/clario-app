"use client";

import { FileText, TrendingDown, AlertTriangle, BarChart2 } from "lucide-react";
import { StatsCard } from "./stats-card";
import { formatCurrency } from "@/lib/utils/format";

interface DashboardStatsProps {
  totalBilled: number;
  totalSavings: number;
  flaggedCount: number;
  analysesCount: number;
}

export function DashboardStats({
  totalBilled,
  totalSavings,
  flaggedCount,
  analysesCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatsCard
        title="Total billed"
        value={formatCurrency(totalBilled)}
        subtitle="Across all analyses"
        icon={FileText}
        iconColor="text-[#09637E]"
        iconBg="bg-[#E6F4F7]"
        accentBar="bg-[#09637E]"
        delay={0}
      />
      <StatsCard
        title="Potential savings"
        value={formatCurrency(totalSavings)}
        subtitle="If all disputes succeed"
        icon={TrendingDown}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        valueColo="text-emerald-600"
        accentBar="bg-emerald-500"
        delay={0.06}
      />
      <StatsCard
        title="Charges flagged"
        value={String(flaggedCount)}
        subtitle="Across all bills"
        icon={AlertTriangle}
        iconColor="text-amber-500"
        iconBg="bg-amber-50"
        accentBar="bg-amber-400"
        delay={0.12}
      />
      <StatsCard
        title="Analyses"
        value={String(analysesCount)}
        subtitle="Bills reviewed"
        icon={BarChart2}
        iconColor="text-[#2F2FE4]"
        iconBg="bg-[#EEEFFD]"
        accentBar="bg-[#2F2FE4]"
        delay={0.18}
      />
    </div>
  );
}
