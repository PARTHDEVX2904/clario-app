"use client";

import { motion } from "framer-motion";
import { AlertTriangle, TrendingDown, DollarSign, BarChart3, Sparkles, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatConfidence } from "@/lib/utils/format";
import { Progress } from "@/components/ui/progress";
import { Inter } from "next/font/google";
import type { AnalysisResult } from "@/types";

const inter = Inter({ subsets: ["latin"], weight: ["700", "800"] });

interface AnalysisSummaryProps {
  analysis: AnalysisResult;
  providerName?: string;
}

export function AnalysisSummary({ analysis, providerName }: AnalysisSummaryProps) {
  const flaggedCount = analysis.lineItems.filter(
    (i) => i.flagStatus !== "valid"
  ).length;

  const confidencePct = Math.round(analysis.confidenceScore * 100);

  const confidenceLabel =
    confidencePct >= 85 ? "High" : confidencePct >= 65 ? "Moderate" : "Low";
  const confidenceLabelColor =
    confidencePct >= 85
      ? "text-green-600"
      : confidencePct >= 65
      ? "text-warning-600"
      : "text-destructive";

  const payableAmount = Math.max(0, analysis.totalBilled - analysis.potentialSavings);

  const stats = [
    {
      label: "Total billed",
      value: formatCurrency(analysis.totalBilled),
      sub: "As shown on your bill",
      icon: DollarSign,
      iconBg: "bg-red-100",
      iconColor: "text-red-500",
      accent: false,
      valueColor: "text-red-600",
      cardBg: "border-red-100 bg-red-50",
    },
    {
      label: "Payable amount",
      value: formatCurrency(payableAmount),
      sub: "After applying potential savings",
      icon: AlertTriangle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      accent: false,
      valueColor: "text-green-600",
      cardBg: "border-green-100 bg-green-50",
    },
    {
      label: "Potential savings",
      value: formatCurrency(analysis.potentialSavings),
      sub: analysis.potentialSavings > 0 ? "Estimated recoverable amount" : "No flagged charges found",
      icon: TrendingDown,
      iconBg: "bg-blue-50",
      iconColor: "text-[#2F2FE4]",
      accent: true,
      valueColor: null,
      cardBg: null,
    },
    {
      label: "Confidence score",
      value: formatConfidence(analysis.confidenceScore),
      sub: `${confidenceLabel} confidence in findings`,
      icon: BarChart3,
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
      accent: false,
      valueColor: null,
      cardBg: null,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.32 }}
            className={`relative rounded-2xl border p-5 overflow-hidden shadow-sm transition-shadow hover:shadow-md ${
              stat.accent
                ? "border-blue-200 bg-gradient-to-br from-[#eff6ff] to-[#dbeafe]"
                : stat.cardBg ?? "border-border bg-white"
            }`}
          >
            {stat.accent && (
              <div className="absolute top-3 right-3 opacity-10">
                <Sparkles className="h-10 w-10 text-[#2F2FE4]" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-3">
              <div className={`h-8 w-8 rounded-lg ${stat.iconBg} flex items-center justify-center shrink-0`}>
                <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
              <p className="text-sm font-semibold text-foreground leading-tight">{stat.label}</p>
            </div>
            <p className={`${inter.className} text-3xl font-extrabold mb-0.5 ${stat.accent ? "text-[#2F2FE4]" : stat.valueColor ?? "text-foreground"}`}>
              {stat.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Confidence bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32, duration: 0.32 }}
        className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm overflow-hidden relative"
      >
        {/* subtle background decoration */}
        <div className="absolute right-0 top-0 w-40 h-40 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-full opacity-60 pointer-events-none" />

        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center shadow-sm">
              <BarChart3 className="h-4.5 w-4.5 text-green-600" />
            </div>
            <div>
              <p className={`${inter.className} text-base font-bold text-foreground`}>Analysis confidence</p>
              <p className="text-xs text-muted-foreground">AI certainty in these findings</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${
              confidencePct >= 85
                ? "bg-green-50 text-green-700 border-green-200"
                : confidencePct >= 65
                ? "bg-orange-50 text-orange-700 border-orange-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {confidenceLabel}
            </span>
            <span className={`${inter.className} text-2xl font-extrabold text-foreground`}>{confidencePct}%</span>
          </div>
        </div>

        <Progress value={confidencePct} className="h-2.5 mb-4 rounded-full" />

        <p className={`${inter.className} text-xs text-muted-foreground leading-relaxed`}>
          Confidence reflects OCR quality, completeness of bill data, and AI certainty. Treat flagged items as a starting point for review, not definitive findings.
        </p>
      </motion.div>

      {/* Plain summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.32 }}
        className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm overflow-hidden relative"
      >
        {/* subtle background decoration */}
        <div className="absolute right-0 top-0 w-48 h-48 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50 pointer-events-none" />

        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2F2FE4]/10 to-blue-50 flex items-center justify-center shadow-sm">
            <Sparkles className="h-4.5 w-4.5 text-[#2F2FE4]" />
          </div>
          <div>
            <h2 className={`${inter.className} text-base font-bold text-foreground`}>Plain-English summary</h2>
            {providerName && (
              <p className="text-xs text-muted-foreground">{providerName}</p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="h-3.5 w-3.5" />
            AI-generated
          </div>
        </div>

        <div className="rounded-xl bg-white border border-slate-100 p-5 space-y-3 shadow-sm">
          {analysis.plainSummary.split("\n\n").map((paragraph, i) => (
            <p
              key={i}
              className={`${inter.className} text-sm text-slate-600 leading-relaxed`}
              dangerouslySetInnerHTML={{
                __html: paragraph.replace(/\*\*(.*?)\*\*/g, "<strong class='text-foreground font-semibold'>$1</strong>"),
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
