"use client";

import { FileText, TrendingDown, BarChart2 } from "lucide-react";
import { StatsCard } from "./stats-card";
import { formatCurrency } from "@/lib/utils/format";

interface DashboardStatsProps {
  totalBilled: number;
  totalSavings: number;
  analysesCount: number;
}

export function DashboardStats({
  totalBilled,
  totalSavings,
  analysesCount,
}: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <StatsCard
        title="Total billed"
        value={formatCurrency(totalBilled)}
        subtitle="Across all analyses"
        icon={FileText}
        iconColor="text-red-500"
        iconBg="bg-red-50"
        valueColor="text-red-600"
        accentBar="bg-red-500"
        delay={0}
      />
      <StatsCard
        title="Potential savings"
        value={formatCurrency(totalSavings)}
        subtitle="If all disputes succeed"
        icon={TrendingDown}
        iconColor="text-emerald-600"
        iconBg="bg-emerald-50"
        valueColor="text-emerald-600"
        accentBar="bg-emerald-500"
        delay={0.06}
      />
      <StatsCard
        title="Analysis"
        value={String(analysesCount)}
        subtitle="Bills reviewed"
        icon={BarChart2}
        iconColor="text-[#2F2FE4]"
        iconBg="bg-[#EEEFFD]"
        accentBar="bg-[#2F2FE4]"
        delay={0.12}
      />
    </div>
  );
}
