"use client";

import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils/format";
import type { BillLineItem } from "@/types";

interface ChargeBreakdownChartProps {
  lineItems: BillLineItem[];
  totalBilled: number;
}

export function ChargeBreakdownChart({ lineItems, totalBilled }: ChargeBreakdownChartProps) {
  const valid = lineItems.filter((i) => i.flagStatus === "valid").reduce((s, i) => s + i.totalPrice, 0);
  const review = lineItems.filter((i) => i.flagStatus === "review_needed").reduce((s, i) => s + i.totalPrice, 0);
  const overcharged = lineItems.filter((i) => i.flagStatus === "possibly_overcharged").reduce((s, i) => s + i.totalPrice, 0);

  const total = valid + review + overcharged || totalBilled || 1;

  const segments = [
    { label: "Likely valid", value: valid, color: "bg-accent-400", textColor: "text-accent-700", barColor: "bg-accent-400" },
    { label: "Review needed", value: review, color: "bg-warning-400", textColor: "text-warning-700", barColor: "bg-warning-400" },
    { label: "Possibly overcharged", value: overcharged, color: "bg-destructive", textColor: "text-destructive", barColor: "bg-destructive" },
  ].filter((s) => s.value > 0);

  if (segments.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-[#FAFAFA] shadow-card p-5">
      <h2 className="text-sm font-semibold text-foreground mb-4">Charge breakdown</h2>

      {/* Stacked bar */}
      <div className="flex h-4 w-full rounded-full overflow-hidden gap-0.5 mb-4">
        {segments.map((seg, i) => {
          const pct = (seg.value / total) * 100;
          return (
            <motion.div
              key={seg.label}
              className={seg.barColor}
              style={{ width: `${pct}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        {segments.map((seg) => {
          const pct = Math.round((seg.value / total) * 100);
          return (
            <div key={seg.label} className="flex items-center gap-2">
              <div className={`h-2.5 w-2.5 rounded-full ${seg.color} shrink-0`} />
              <span className="text-xs text-muted-foreground">{seg.label}</span>
              <span className={`text-xs font-semibold ${seg.textColor}`}>
                {formatCurrency(seg.value)} <span className="font-normal text-muted-foreground">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
