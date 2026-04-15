"use client";

import { motion } from "framer-motion";
import { TrendingDown, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import type { SavingsOpportunity } from "@/types";

interface SavingsOpportunitiesProps {
  opportunities: SavingsOpportunity[];
  totalSavings: number;
}

const priorityConfig = {
  high: { label: "High priority", variant: "overcharged" as const, order: 0 },
  medium: { label: "Medium", variant: "review" as const, order: 1 },
  low: { label: "Low", variant: "muted" as const, order: 2 },
};

export function SavingsOpportunities({
  opportunities,
  totalSavings,
}: SavingsOpportunitiesProps) {
  const sorted = [...opportunities].sort(
    (a, b) =>
      priorityConfig[a.priority].order - priorityConfig[b.priority].order
  );

  return (
    <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border bg-accent-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-accent-100 flex items-center justify-center">
              <TrendingDown className="h-4.5 w-4.5 text-accent-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Savings opportunities
              </h2>
              <p className="text-xs text-muted-foreground">
                {opportunities.length} actions identified
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-semibold text-accent-600">
              {formatCurrency(totalSavings)}
            </p>
            <p className="text-xs text-muted-foreground">Estimated potential</p>
          </div>
        </div>
      </div>

      {/* Opportunities list */}
      <div className="divide-y divide-border">
        {sorted.map((opp, i) => {
          const { label, variant } = priorityConfig[opp.priority];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="px-6 py-5"
            >
              <div className="flex items-start gap-4">
                {/* Number */}
                <div className="h-7 w-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
                  {i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      {opp.description}
                    </h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={variant}>{label}</Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {opp.actionRequired}
                  </p>

                  {opp.estimatedSavings && (
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                      <ChevronRight className="h-3.5 w-3.5" />
                      Estimated saving: {formatCurrency(opp.estimatedSavings)}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="px-6 py-4 bg-muted/20 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Savings estimates are approximate and depend on the hospital&apos;s response, your insurance coverage, and individual circumstances. Results are not guaranteed.
        </p>
      </div>
    </div>
  );
}
