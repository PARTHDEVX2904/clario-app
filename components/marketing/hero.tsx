"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Inter } from "next/font/google";
import { TrendingDown, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const WORDS = ["decoded", "simplified", "explained"];

const floatingCards = [
  {
    label: "Duplicate charge found",
    detail: "CT Scan billed twice",
    amount: "₹1,500",
    color: "bg-destructive-50 border-destructive-100",
    textColor: "text-destructive-600",
    icon: "⚠",
    delay: 0,
  },
  {
    label: "Potential savings",
    detail: "Across 4 flagged items",
    amount: "₹2,200",
    color: "bg-accent-50 border-accent-100",
    textColor: "text-accent-600",
    icon: "↓",
    delay: 0.15,
  },
  {
    label: "Vague facility fee",
    detail: "No itemization provided",
    amount: "₹900",
    color: "bg-warning-50 border-warning-100",
    textColor: "text-warning-600",
    icon: "?",
    delay: 0.3,
  },
];

const stats = [
  { value: "3 in 4", label: "bills contain errors" },
  { value: "₹20,000+", label: "avg. overcharge per hospital stay" },
  { value: "80%", label: "of disputes reach a resolution" },
];

export function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = WORDS[wordIdx];
    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 80);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), 1800);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => setCharIdx((c) => c - 1), 45);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((i) => (i + 1) % WORDS.length);
    }
  }, [charIdx, deleting, wordIdx]);

  const displayText = WORDS[wordIdx].slice(0, charIdx);

  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32 bg-white">

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className={`${inter.className} text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.15] tracking-tight text-foreground mb-6`}>
              Your hospital bill
              <span className="block text-3xl md:text-4xl lg:text-5xl">
                <span style={{ color: "#2F2FE4" }} className="font-bold">
                  {displayText}
                </span>
                <span className="inline-block align-middle relative" style={{ width: "2px", height: "1.1em", background: "#2F2FE4", marginLeft: "2px", verticalAlign: "middle", animation: "cursor-blink 2s step-end infinite", borderRadius: "1px" }} />
              </span>
            </h1>

            <p className={`${inter.className} text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg`}>
              Upload your hospital bill.<br />
              Understand charges, spot overbilling, and take action.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Link href="/upload">
                <Button size="xl" className="w-full sm:w-auto">
                  Analyze my bill
                </Button>
              </Link>
              <div className="flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-black" />
                <span className={`${inter.className} text-xs font-medium text-black`}>No account required</span>
              </div>
            </div>
          </motion.div>

          {/* Right — floating cards */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="relative flex flex-col gap-4 lg:pl-8"
          >
            {/* Main preview card */}
            <div className="rounded-2xl border border-border bg-white shadow-card-lg overflow-hidden">
              {/* Card header strip */}
              <div className="px-5 pt-4 pb-3" style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)" }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2F2FE4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-blue-500 uppercase tracking-wide">Apollo Hospital</p>
                      <h3 className="text-sm font-bold text-foreground leading-tight">Bill Analysis Complete</h3>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-green-200 px-2.5 py-1 text-[11px] font-semibold text-green-600 shadow-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                    Ready
                  </span>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-3 gap-2.5 mb-4">
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                    <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">Total billed</p>
                    <p className="text-base font-bold text-foreground">₹8,450</p>
                  </div>
                  <div className="rounded-xl bg-red-50 border border-red-100 p-3">
                    <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">Flagged</p>
                    <p className="text-base font-bold text-destructive">₹3,800</p>
                  </div>
                  <div className="rounded-xl p-3" style={{ background: "linear-gradient(135deg, #eff6ff, #dbeafe)", border: "1px solid #bfdbfe" }}>
                    <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">Save up to</p>
                    <p className="text-base font-bold" style={{ color: "#2F2FE4" }}>₹2,200</p>
                  </div>
                </div>

                {/* Divider with label */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Flagged items</span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <div className="space-y-2">
                  {floatingCards.map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + card.delay, duration: 0.3 }}
                      className={`flex items-center justify-between rounded-xl border p-2.5 ${card.color}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold ${card.textColor} bg-white/70 border border-white`}>
                          {card.icon}
                        </div>
                        <div>
                          <p className={`text-xs font-semibold ${card.textColor}`}>{card.label}</p>
                          <p className="text-[10px] text-muted-foreground">{card.detail}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${card.textColor}`}>{card.amount}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative stat tag */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="absolute -bottom-4 -left-4 hidden lg:flex items-center gap-2 rounded-xl bg-white border border-border shadow-card-hover px-4 py-2.5"
            >
              <TrendingDown className="h-5 w-5 text-accent" />
              <div>
                <p className="text-xs font-semibold text-foreground">Dispute draft ready</p>
                <p className="text-[11px] text-muted-foreground">Personalized to your case</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center"
            >
              <p className={`${inter.className} text-3xl font-bold text-foreground mb-1`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
