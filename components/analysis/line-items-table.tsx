"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { formatCurrency, formatDate, formatConfidence } from "@/lib/utils/format";
import { ChargeFlagBadge } from "./charge-flag-badge";
import { cn } from "@/lib/utils/cn";
import type { BillLineItem, ChargeFlag } from "@/types";

interface LineItemsTableProps {
  lineItems: BillLineItem[];
}

const FILTER_OPTIONS: { value: "all" | ChargeFlag; label: string }[] = [
  { value: "all", label: "All charges" },
  { value: "valid", label: "Likely valid" },
  { value: "review_needed", label: "Review needed" },
  { value: "possibly_overcharged", label: "Possibly overcharged" },
];

export function LineItemsTable({ lineItems }: LineItemsTableProps) {
  const [filter, setFilter] = useState<"all" | ChargeFlag>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filtered =
    filter === "all" ? lineItems : lineItems.filter((i) => i.flagStatus === filter);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const counts = {
    all: lineItems.length,
    valid: lineItems.filter((i) => i.flagStatus === "valid").length,
    review_needed: lineItems.filter((i) => i.flagStatus === "review_needed").length,
    possibly_overcharged: lineItems.filter(
      (i) => i.flagStatus === "possibly_overcharged"
    ).length,
  };

  return (
    <div className="rounded-xl border border-border bg-[#FAFAFA] shadow-card overflow-hidden">
      {/* Header + filter */}
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground mb-3">
          Line items ({lineItems.length})
        </h2>
        <div className="flex gap-2 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                filter === opt.value
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {opt.label}
              {counts[opt.value] > 0 && (
                <span
                  className={cn(
                    "ml-1.5 text-[10px]",
                    filter === opt.value ? "opacity-70" : "opacity-60"
                  )}
                >
                  {counts[opt.value]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table header (desktop) */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 bg-muted/40 border-b border-border text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        <span className="col-span-4">Description</span>
        <span className="col-span-2">CPT Code</span>
        <span className="col-span-1 text-right">Qty</span>
        <span className="col-span-2 text-right">Unit Price</span>
        <span className="col-span-1 text-right">Total</span>
        <span className="col-span-2 text-right">Status</span>
      </div>

      {/* Items */}
      <div className="divide-y divide-border">
        {filtered.map((item, i) => {
          const isExpanded = expanded.has(item.id);
          const hasDetails = !!item.flagReason;
          const rowBg =
            item.flagStatus === "possibly_overcharged"
              ? "bg-destructive-50/40"
              : item.flagStatus === "review_needed"
              ? "bg-warning-50/30"
              : "";

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              {/* Main row */}
              <div
                className={cn(
                  "px-6 py-4 transition-colors",
                  rowBg,
                  hasDetails && "cursor-pointer hover:bg-muted/30"
                )}
                onClick={() => hasDetails && toggleExpand(item.id)}
              >
                {/* Mobile layout */}
                <div className="md:hidden space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{item.description}</p>
                      {item.cptCode && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          CPT: {item.cptCode}
                        </p>
                      )}
                    </div>
                    <ChargeFlagBadge status={item.flagStatus} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {item.quantity > 1
                        ? `${item.quantity} × ${formatCurrency(item.unitPrice)}`
                        : formatCurrency(item.unitPrice)}
                    </span>
                    <span className="font-semibold text-foreground text-sm">
                      {formatCurrency(item.totalPrice)}
                    </span>
                  </div>
                  {item.dateOfService && (
                    <p className="text-xs text-muted-foreground">
                      {formatDate(item.dateOfService)}
                    </p>
                  )}
                </div>

                {/* Desktop layout */}
                <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 flex items-center gap-2">
                    {hasDetails && (
                      isExpanded
                        ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {item.description}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {item.cptCode || "—"}
                    </span>
                  </div>
                  <div className="col-span-1 text-right text-sm text-muted-foreground">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-right text-sm text-muted-foreground">
                    {formatCurrency(item.unitPrice)}
                  </div>
                  <div className="col-span-1 text-right text-sm font-semibold text-foreground">
                    {formatCurrency(item.totalPrice)}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <ChargeFlagBadge status={item.flagStatus} />
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              <AnimatePresence>
                {isExpanded && hasDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        "px-6 pb-4 pt-0 border-t border-dashed",
                        item.flagStatus === "possibly_overcharged"
                          ? "border-destructive-200 bg-destructive-50/40"
                          : "border-warning-200 bg-warning-50/30"
                      )}
                    >
                      <div className="flex gap-2 pt-3">
                        <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
                        <div className="space-y-2">
                          <p className="text-sm text-foreground leading-relaxed">
                            {item.flagReason}
                          </p>
                          {item.suggestedPrice !== undefined && item.suggestedPrice < item.totalPrice && (
                            <p className="text-xs text-accent-600 font-medium">
                              Suggested price: {item.suggestedPrice === 0 ? "May be removable" : formatCurrency(item.suggestedPrice)}
                              {" "}· Potential saving: {formatCurrency(item.totalPrice - (item.suggestedPrice || 0))}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Confidence: {formatConfidence(item.confidence)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          No charges in this category.
        </div>
      )}

      {/* Total row */}
      <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">
          {filter === "all" ? "Total billed" : `${filtered.length} items shown`}
        </span>
        {filter === "all" && (
          <span className="text-base font-semibold text-foreground">
            {formatCurrency(lineItems.reduce((sum, i) => sum + i.totalPrice, 0))}
          </span>
        )}
      </div>
    </div>
  );
}
