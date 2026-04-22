"use client";

import { motion } from "framer-motion";
import { TrendingDown, IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { Inter } from "next/font/google";
import type { SavingsOpportunity } from "@/types";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface SavingsOpportunitiesProps {
  opportunities: SavingsOpportunity[];
  totalSavings: number;
}

const priorityConfig = {
  high:   { label: "Excess", bg: "bg-red-50",    text: "text-red-600",    border: "border-red-200",    dot: "bg-red-500",    amountColor: "text-red-500",    order: 0 },
  medium: { label: "Check",  bg: "bg-amber-50",  text: "text-amber-600",  border: "border-amber-200",  dot: "bg-amber-400",  amountColor: "text-amber-500",  order: 1 },
  low:    { label: "Fair",   bg: "bg-slate-50",  text: "text-slate-500",  border: "border-slate-200",  dot: "bg-slate-400",  amountColor: "text-slate-500",  order: 2 },
};

export function SavingsOpportunities({ opportunities, totalSavings }: SavingsOpportunitiesProps) {
  const sorted = [...opportunities].sort(
    (a, b) => priorityConfig[a.priority].order - priorityConfig[b.priority].order
  );

  return (
    <div className={`${inter.className} rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden`}>

      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-50 flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Savings opportunities</h2>
            <p className="text-xs text-muted-foreground">{opportunities.length} actions identified</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-teal-600">{formatCurrency(totalSavings)}</p>
          <p className="text-xs text-muted-foreground">Estimated recoverable</p>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-slate-100">
        {sorted.map((opp, i) => {
          const p = priorityConfig[opp.priority];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.28 }}
              className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors"
            >
              {/* Index */}
              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                {i + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{opp.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{opp.actionRequired}</p>
              </div>

              {/* Saving amount */}
              {opp.estimatedSavings ? (
                <div className={`flex items-center gap-1 text-sm font-bold shrink-0 ${p.amountColor}`}>
                  <IndianRupee className="h-3.5 w-3.5" />
                  {opp.estimatedSavings.toLocaleString("en-IN")}
                </div>
              ) : null}

              {/* Priority badge */}
              <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${p.bg} ${p.text} ${p.border}`}>
                {p.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100">
        <p className="text-[11px] text-muted-foreground">
          Estimates depend on hospital response and individual circumstances. Results are not guaranteed.
        </p>
      </div>
    </div>
  );
}
