"use client";

import { motion } from "framer-motion";
import {
  FileSearch,
  AlertTriangle,
  TrendingDown,
  FileEdit,
  ShieldCheck,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Plain-English bill breakdown",
    description:
      "Every charge explained in language a non-doctor can understand. No medical codes, no jargon — just clear answers about what you were billed for.",
    color: "text-primary-500",
    bg: "bg-primary-50",
  },
  {
    icon: AlertTriangle,
    title: "Anomaly & duplicate detection",
    description:
      "We scan for duplicate charges, vague facility fees, unusually high quantities, and charges that don't match your reported care.",
    color: "text-warning-500",
    bg: "bg-warning-50",
  },
  {
    icon: TrendingDown,
    title: "Savings opportunity finder",
    description:
      "See a prioritized list of potential savings — from removing erroneous charges to qualifying for hospital financial assistance programs.",
    color: "text-accent",
    bg: "bg-accent-50",
  },
  {
    icon: FileEdit,
    title: "Dispute & negotiation drafts",
    description:
      "Generate a formal dispute letter, complaint letter, and phone negotiation script — all tailored to your specific charges and situation.",
    color: "text-primary-500",
    bg: "bg-primary-50",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first design",
    description:
      "Your bill data is used only for your analysis. We don't sell your health data. Files are processed securely and can be deleted on request.",
    color: "text-accent",
    bg: "bg-accent-50",
  },
  {
    icon: Clock,
    title: "Results in minutes",
    description:
      "Upload, answer a few questions about your care, and get a complete analysis. No waiting for a consultant — understand your bill today.",
    color: "text-warning-500",
    bg: "bg-warning-50",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            Everything you need
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Your financial health copilot
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
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
              className="rounded-2xl border border-border bg-background p-6 hover:shadow-card-hover transition-shadow duration-200"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${feature.bg} mb-4`}>
                <feature.icon className={`h-5 w-5 ${feature.color}`} />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
