"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingCards = [
  {
    label: "Duplicate charge found",
    detail: "CT Scan billed twice",
    amount: "₹15,000",
    color: "bg-destructive-50 border-destructive-100",
    textColor: "text-destructive-600",
    icon: "⚠",
    delay: 0,
  },
  {
    label: "Potential savings",
    detail: "Across 4 flagged items",
    amount: "₹28,000",
    color: "bg-accent-50 border-accent-100",
    textColor: "text-accent-600",
    icon: "↓",
    delay: 0.15,
  },
  {
    label: "Vague facility fee",
    detail: "No itemization provided",
    amount: "₹18,000",
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
  return (
    <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Subtle warm gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,71,171,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(5,150,105,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 mb-6">
              <Zap className="h-3 w-3" />
              AI-powered medical bill analysis
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight text-foreground mb-6">
              Your medical bill,{" "}
              <span className="text-primary-500">decoded.</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Upload your hospital bill and get a plain-English breakdown in minutes. Understand every charge, spot potential overcharges, and get the tools to negotiate or dispute — without needing a lawyer.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <Link href="/upload">
                <Button size="xl" className="gap-2 group w-full sm:w-auto">
                  Analyze my bill
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  See how it works
                </Button>
              </Link>
            </div>

            {/* Trust micro-bar */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>No account required · Your data stays private · Not legal advice</span>
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
            <div className="rounded-2xl border border-border bg-white shadow-card-lg p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-0.5">General Memorial Hospital</p>
                  <h3 className="text-base font-semibold text-foreground">Bill Analysis Complete</h3>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-accent-100 px-2.5 py-1 text-xs font-medium text-accent-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
                  Ready
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl bg-muted p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Total billed</p>
                  <p className="text-base font-semibold text-foreground">₹1,15,500</p>
                </div>
                <div className="rounded-xl bg-destructive-50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Flagged</p>
                  <p className="text-base font-semibold text-destructive">₹55,000</p>
                </div>
                <div className="rounded-xl bg-accent-50 p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Save up to</p>
                  <p className="text-base font-semibold text-accent-600">₹28,000</p>
                </div>
              </div>

              <div className="space-y-2">
                {floatingCards.map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + card.delay, duration: 0.3 }}
                    className={`flex items-center justify-between rounded-lg border p-3 ${card.color}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`text-sm font-bold ${card.textColor}`}>{card.icon}</span>
                      <div>
                        <p className={`text-xs font-semibold ${card.textColor}`}>{card.label}</p>
                        <p className="text-[11px] text-muted-foreground">{card.detail}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-bold ${card.textColor}`}>{card.amount}</span>
                  </motion.div>
                ))}
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
          className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-white p-6 text-center shadow-card"
            >
              <p className="font-display text-3xl font-semibold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
