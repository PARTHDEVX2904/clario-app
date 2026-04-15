"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { formatCurrency, formatConfidence } from "@/lib/utils/format";
import { Progress } from "@/components/ui/progress";
import type { AnalysisResult } from "@/types";

interface AnalysisSummaryProps {
  analysis: AnalysisResult;
  providerName?: string;
}

export function AnalysisSummary({ analysis, providerName }: AnalysisSummaryProps) {
  const flaggedCount = analysis.lineItems.filter(
    (i) => i.flagStatus !== "valid"
  ).length;

  const stats = [
    {
      label: "Total billed",
      value: formatCurrency(analysis.totalBilled),
      sub: "As shown on your bill",
      icon: DollarSign,
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
    },
    {
      label: "Charges flagged",
      value: formatCurrency(analysis.totalFlagged),
      sub: `${flaggedCount} items need review`,
      icon: AlertTriangle,
      iconBg: "bg-warning-50",
      iconColor: "text-warning-600",
    },
    {
      label: "Potential savings",
      value: formatCurrency(analysis.potentialSavings),
      sub: "Estimated if disputed",
      icon: TrendingDown,
      iconBg: "bg-accent-50",
      iconColor: "text-accent-600",
    },
    {
      label: "Analysis confidence",
      value: formatConfidence(analysis.confidenceScore),
      sub: "Based on available data",
      icon: BarChart3,
      iconBg: "bg-primary-50",
      iconColor: "text-primary-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="rounded-xl border border-border bg-white p-5 shadow-card"
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className={`h-8 w-8 rounded-lg ${stat.iconBg} flex items-center justify-center`}
              >
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            </div>
            <p className="text-xl font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Confidence bar */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-card">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-foreground">Analysis confidence</p>
          <span className="text-sm font-semibold text-primary-600">
            {formatConfidence(analysis.confidenceScore)}
          </span>
        </div>
        <Progress value={analysis.confidenceScore * 100} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">
          Confidence reflects OCR quality, completeness of bill data, and AI certainty. Treat flagged items as a starting point for review, not definitive findings.
        </p>
      </div>

      {/* Plain summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="rounded-xl border border-border bg-white p-6 shadow-card"
      >
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold text-foreground">Plain-English summary</h2>
          {providerName && (
            <span className="text-xs text-muted-foreground">— {providerName}</span>
          )}
        </div>
        <div className="prose prose-sm prose-slate max-w-none">
          {analysis.plainSummary.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className="text-sm text-muted-foreground leading-relaxed mb-3 last:mb-0"
              dangerouslySetInnerHTML={{
                __html: paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
