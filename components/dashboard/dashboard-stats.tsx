"use client";

import { FileText, TrendingDown, AlertTriangle } from "lucide-react";
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
        delay={0}
      />
      <StatsCard
        title="Potential savings"
        value={formatCurrency(totalSavings)}
        subtitle="If all disputes succeed"
        icon={TrendingDown}
        iconColor="text-accent"
        iconBg="bg-accent-50"
        delay={0.06}
      />
      <StatsCard
        title="Charges flagged"
        value={String(flaggedCount)}
        subtitle="Across all bills"
        icon={AlertTriangle}
        iconColor="text-warning-500"
        iconBg="bg-warning-50"
        delay={0.12}
      />
      <StatsCard
        title="Analyses"
        value={String(analysesCount)}
        subtitle="Bills reviewed"
        icon={FileText}
        iconColor="text-primary-500"
        iconBg="bg-primary-50"
        delay={0.18}
      />
    </div>
  );
}
