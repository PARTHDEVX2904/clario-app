"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Inter } from "next/font/google";
import { formatCurrency, formatDateRelative } from "@/lib/utils/format";
import type { AnalysisResult } from "@/types";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface RecentAnalysesProps {
  analyses: (AnalysisResult & { providerName?: string; caseId: string })[];
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "complete":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
          <CheckCircle className="h-3 w-3" /> Done
        </span>
      );
    case "processing":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
          <Clock className="h-3 w-3 animate-pulse" /> Processing
        </span>
      );
    case "error":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2 py-0.5 text-[10px] font-semibold text-red-500">
          <AlertCircle className="h-3 w-3" /> Error
        </span>
      );
    default:
      return null;
  }
}

const PAGE_SIZE = 10;

export function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  const [showAll, setShowAll] = useState(false);

  if (analyses.length === 0) return null;

  const visible = showAll ? analyses : analyses.slice(0, PAGE_SIZE);
  const hasMore = analyses.length > PAGE_SIZE;

  return (
    <div className={`${inter.className} rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Recent analysis</h2>
          <p className="text-[11px] text-slate-400 font-medium mt-0.5">{analyses.length} bills reviewed</p>
        </div>
        {hasMore && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#09637E] hover:text-[#088395] transition-colors"
          >
            {showAll ? "Show less" : "View all"} <ArrowRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="divide-y divide-slate-100">
        {visible.map((analysis, i) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
          >
            <Link
              href={`/analysis/${analysis.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/70 transition-colors group"
            >
              {/* Icon */}
              <div className="h-10 w-10 rounded-xl bg-[#E6F4F7] flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-[#09637E]" />
              </div>

              {/* Provider + time */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {analysis.providerName || "Unknown Provider"}
                </p>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                  {formatDateRelative(analysis.createdAt)}
                </p>
              </div>

              {/* Status badge */}
              <StatusBadge status={analysis.status} />

              {/* Amount */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-slate-900">
                  {formatCurrency(analysis.totalBilled)}
                </p>
                {analysis.potentialSavings > 0 && (
                  <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                    Save {formatCurrency(analysis.potentialSavings)}
                  </p>
                )}
              </div>

              <ArrowRight className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
