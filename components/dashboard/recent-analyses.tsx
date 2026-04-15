"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, FileText, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { formatCurrency, formatDateRelative } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import type { AnalysisResult } from "@/types";

interface RecentAnalysesProps {
  analyses: (AnalysisResult & { providerName?: string; caseId: string })[];
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "complete":
      return <CheckCircle className="h-4 w-4 text-accent" />;
    case "processing":
      return <Clock className="h-4 w-4 text-warning-500 animate-pulse" />;
    case "error":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
}

export function RecentAnalyses({ analyses }: RecentAnalysesProps) {
  if (analyses.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Recent analyses</h2>
        <Link
          href="/dashboard"
          className="text-xs font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          View all
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {analyses.map((analysis, i) => (
          <motion.div
            key={analysis.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <Link
              href={`/analysis/${analysis.id}`}
              className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group"
            >
              <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {analysis.providerName || "Unknown Provider"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateRelative(analysis.createdAt)}
                </p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(analysis.totalBilled)}
                </p>
                {analysis.potentialSavings > 0 && (
                  <p className="text-xs text-accent-600 font-medium">
                    Save {formatCurrency(analysis.potentialSavings)}
                  </p>
                )}
              </div>

              <StatusIcon status={analysis.status} />

              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
