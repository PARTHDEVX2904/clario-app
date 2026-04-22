"use client";

import { motion } from "framer-motion";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const features = [
  {
    title: "Plain-English bill breakdown",
    headline: "Understand every charge in simple terms.",
    description: "No jargon, no codes—just clear explanations of what you were billed.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <circle cx="10" cy="13" r="1.5"/>
        <path d="M10 16.5c0-1.5 4-1.5 4 0"/>
        <line x1="16" y1="13" x2="18" y2="13"/>
        <line x1="16" y1="16" x2="18" y2="16"/>
      </svg>
    ),
    gradient: "from-blue-50 to-indigo-50",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    accent: "#3B82F6",
  },
  {
    title: "Anomaly & duplicate detection",
    headline: "Spot duplicate and suspicious charges instantly.",
    description: "We flag errors, inflated quantities, and mismatches in your bill.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    gradient: "from-amber-50 to-orange-50",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    accent: "#D97706",
  },
  {
    title: "Savings opportunity finder",
    headline: "Find where you can save money.",
    description: "Get a prioritized list of errors and cost-saving opportunities.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
        <polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    gradient: "from-emerald-50 to-teal-50",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accent: "#059669",
  },
  {
    title: "Dispute & negotiation drafts",
    headline: "Generate ready-to-use dispute drafts.",
    description: "Letters and scripts tailored to your specific charges.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        <line x1="9" y1="7" x2="15" y2="13"/>
      </svg>
    ),
    gradient: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    accent: "#7C3AED",
  },
  {
    title: "Privacy-first design",
    headline: "Your data stays private and secure.",
    description: "Used only for analysis, never sold, and deletable anytime.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    gradient: "from-teal-50 to-cyan-50",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    accent: "#0891B2",
  },
  {
    title: "Results in minutes",
    headline: "Get a full analysis in minutes.",
    description: "Upload your bill and receive insights—no waiting.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    gradient: "from-rose-50 to-pink-50",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    accent: "#E11D48",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#F5F5F5]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className={`${inter.className} text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3`}>
            Everything you need
          </p>
          <h2 className={`${inter.className} text-3xl md:text-4xl font-semibold text-foreground mb-4`}>
            Your financial health copilot
          </h2>
          <p className={`${inter.className} text-muted-foreground max-w-xl mx-auto text-lg`}>
            From understanding what you owe to drafting your dispute — Clario handles every step of the medical billing review process.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className={`group relative rounded-2xl border border-border bg-gradient-to-br ${feature.gradient} p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}
            >
              {/* Subtle corner decoration */}
              <div
                className="absolute top-0 right-0 h-20 w-20 rounded-bl-[4rem] opacity-[0.06]"
                style={{ background: feature.accent }}
              />

              {/* Icon */}
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feature.iconBg} ${feature.iconColor} mb-5 shadow-sm`}>
                {feature.icon}
              </div>

              {/* Text */}
              <h3 className={`${inter.className} text-[11px] font-semibold uppercase tracking-widest mb-1.5`} style={{ color: feature.accent }}>
                {feature.title}
              </h3>
              <p className={`${inter.className} text-base font-semibold text-foreground mb-1.5 leading-snug`}>
                {feature.headline}
              </p>
              <p className={`${inter.className} text-sm text-muted-foreground leading-relaxed`}>
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
