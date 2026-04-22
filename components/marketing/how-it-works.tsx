"use client";

import { motion } from "framer-motion";
import { Upload, BrainCircuit, FileCheck } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const steps = [
  {
    number: "1",
    icon: Upload,
    title: "Upload your bill",
    description:
      "Drop a PDF or photo of your hospital bill and answer a few quick questions about your care.",
    tag: "PDF · JPG · PNG · Max 10 MB",
    cardBg: "bg-gradient-to-br from-[#E6F4F7] via-[#f0fafb] to-white",
    iconBg: "from-[#09637E] to-[#088395]",
    badgeBg: "bg-[#09637E]",
    tagColor: "text-[#09637E] border-[#C4DDE3] bg-[#E6F4F7]",
    borderHover: "hover:border-[#088395]/40",
  },
  {
    number: "2",
    icon: BrainCircuit,
    title: "AI analyses every charge",
    description:
      "OCR extracts every line item, then our AI flags duplicates, vague fees, and price anomalies.",
    tag: "Results in 30 – 60 seconds",
    cardBg: "bg-gradient-to-br from-[#EEEFFD] via-[#f5f5ff] to-white",
    iconBg: "from-[#2F2FE4] to-[#4B4BEE]",
    badgeBg: "bg-[#2F2FE4]",
    tagColor: "text-[#2F2FE4] border-[#2F2FE4]/20 bg-[#EEEFFD]",
    borderHover: "hover:border-[#2F2FE4]/30",
  },
  {
    number: "3",
    icon: FileCheck,
    title: "Review & take action",
    description:
      "Every charge is labeled. Download a dispute letter, complaint, or phone script — ready to send.",
    tag: "Personalised to your case",
    cardBg: "bg-gradient-to-br from-[#E8F5F0] via-[#f0fdf7] to-white",
    iconBg: "from-[#059669] to-[#10b981]",
    badgeBg: "bg-[#059669]",
    tagColor: "text-[#059669] border-[#059669]/20 bg-[#E8F5F0]",
    borderHover: "hover:border-[#059669]/30",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className={`${inter.className} py-20 md:py-28 bg-[#f8fafb]`}>
      <div className="mx-auto max-w-5xl px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center rounded-full border border-[#2F2FE4]/20 bg-white px-4 py-1.5 mb-5 shadow-sm">
            <span className="text-[11px] font-semibold text-[#2F2FE4] uppercase tracking-widest">
              How it works
            </span>
          </div>
          <h2 className="text-3xl md:text-[2.6rem] font-semibold text-foreground mb-3 tracking-tight leading-tight">
            From bill to action in minutes
          </h2>
          <p className="text-slate-500 max-w-sm mx-auto text-base font-medium leading-relaxed">
            No expertise needed — upload, answer a few questions, get your full breakdown.
          </p>
        </div>

        {/* Step cards */}
        <div className="relative">
          {/* Dashed connector — desktop only */}
          <div
            className="hidden md:block absolute top-[26px] left-[calc(16.67%+26px)] right-[calc(16.67%+26px)] z-0"
            style={{ borderTop: "2px dashed #cbd5e1" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.35 }}
                  className={`group relative ${step.cardBg} rounded-2xl border border-slate-200/80 p-6 ${step.borderHover} hover:shadow-lg transition-all duration-200`}
                >
                  {/* Icon with number badge overlaid */}
                  <div className="relative mb-6 self-start inline-block">
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${step.iconBg} flex items-center justify-center shadow-md`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    {/* Number badge on icon */}
                    <div className={`absolute -bottom-1.5 -right-1.5 h-[18px] w-[18px] rounded-full ${step.badgeBg} flex items-center justify-center border-2 border-white shadow-sm`}>
                      <span className="text-[9px] font-black text-white leading-none">{step.number}</span>
                    </div>
                  </div>

                  <h3 className="text-[15px] font-bold text-foreground mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5 font-medium">
                    {step.description}
                  </p>

                  {/* Footer tag */}
                  <div className={`inline-flex items-center rounded-full border px-3 py-1 ${step.tagColor}`}>
                    <span className="text-[11px] font-semibold">{step.tag}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
