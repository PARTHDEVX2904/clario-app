"use client";

import { motion } from "framer-motion";
import { Lock, EyeOff, Scale, MessageSquare, ShieldCheck, CheckCircle2, XCircle, UserX, Server } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const trustPoints = [
  {
    icon: Lock,
    title: "Your data stays yours",
    description: "Never shared with third parties, hospitals, insurers, or advertisers.",
  },
  {
    icon: EyeOff,
    title: "No account required",
    description: "Analyze any bill without creating an account or sharing personal info.",
  },
  {
    icon: Scale,
    title: "Informational, not legal advice",
    description: "For legal disputes, consult a certified patient advocate or attorney.",
  },
  {
    icon: MessageSquare,
    title: "Honest confidence scores",
    description: "Every flag tells you exactly how certain the AI is — no false precision.",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className={`${inter.className} py-20 md:py-28 bg-[#F5F5F5]`}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — privacy card */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-border bg-white shadow-card-lg overflow-hidden"
          >
            <div className="px-5 pt-4 pb-3" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)" }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-green-600 uppercase tracking-wide">Privacy-first design</p>
                    <h3 className="text-sm font-bold text-foreground leading-tight">Your Data, Protected</h3>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-green-200 px-2.5 py-1 text-[11px] font-semibold text-green-600 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                  Secure
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">Data sold</p>
                  <p className="text-base font-bold text-foreground">0 parties</p>
                </div>
                <div className="rounded-xl p-3" style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #bbf7d0" }}>
                  <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">Encryption</p>
                  <p className="text-base font-bold text-green-700">256-bit</p>
                </div>
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                  <p className="text-[10px] font-medium text-muted-foreground mb-1 uppercase tracking-wide">Stored after</p>
                  <p className="text-base font-bold text-foreground">You decide</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Protections</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2.5 rounded-xl border border-green-100 bg-green-50 p-2.5">
                  <div className="h-7 w-7 rounded-lg bg-white/70 border border-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-700">End-to-end encrypted</p>
                    <p className="text-[10px] text-muted-foreground">All uploads secured with TLS</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-green-100 bg-green-50 p-2.5">
                  <div className="h-7 w-7 rounded-lg bg-white/70 border border-white flex items-center justify-center shrink-0">
                    <UserX className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-700">No account required</p>
                    <p className="text-[10px] text-muted-foreground">Analyze bills anonymously</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 p-2.5">
                  <div className="h-7 w-7 rounded-lg bg-white/70 border border-white flex items-center justify-center shrink-0">
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-destructive">Never sold or shared</p>
                    <p className="text-[10px] text-muted-foreground">Zero third-party data sharing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                  <div className="h-7 w-7 rounded-lg bg-white/70 border border-white flex items-center justify-center shrink-0">
                    <Server className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">HIPAA-aware processing</p>
                    <p className="text-[10px] text-muted-foreground">Healthcare-grade infrastructure</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — trust points */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            {/* Label */}
            <div className="inline-flex items-center rounded-full border border-[#09637E]/20 bg-white px-3.5 py-1.5 mb-5 shadow-sm">
              <span className="text-[11px] font-semibold text-[#09637E] uppercase tracking-widest">
                Built for trust
              </span>
            </div>

            <h2 className="text-3xl md:text-[2.1rem] font-semibold text-foreground mb-3 tracking-tight leading-tight">
              Serious about privacy<br className="hidden md:block" /> and honesty
            </h2>
            <p className="text-slate-500 text-[15px] font-medium leading-relaxed mb-8 max-w-sm">
              Medical billing is stressful enough. Clario tells you what it knows, what it doesn&apos;t, and what you can do next.
            </p>

            {/* Trust point grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {trustPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="rounded-xl border border-slate-200 bg-white p-4 hover:border-[#09637E]/30 hover:shadow-sm transition-all duration-150"
                  >
                    <div className="h-8 w-8 rounded-lg bg-[#E6F4F7] flex items-center justify-center mb-3">
                      <Icon className="h-4 w-4 text-[#09637E]" />
                    </div>
                    <h4 className="text-[13px] font-bold text-foreground mb-1 leading-snug">
                      {point.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {point.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
