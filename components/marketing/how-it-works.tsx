"use client";

import { motion } from "framer-motion";
import { Upload, BrainCircuit, FileCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload your bill",
    description:
      "Upload your hospital bill as a PDF or image. Optionally add your insurance Explanation of Benefits (EOB). Then answer a few plain-English questions about your care — ER visit, imaging, medications, etc.",
    note: "Supported: PDF, JPG, PNG — up to 10MB",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "AI reads and analyzes",
    description:
      "Clario extracts every line item using OCR, then applies AI analysis and billing heuristics to flag duplicates, vague fees, price anomalies, and charges that don't match your reported care.",
    note: "Analysis takes 30–60 seconds",
  },
  {
    number: "03",
    icon: FileCheck,
    title: "Review and take action",
    description:
      "Get a plain-English summary with every charge labeled — valid, review needed, or potentially overcharged. Then download a ready-to-send dispute letter, complaint, or phone negotiation script.",
    note: "All documents personalized to your case",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
            How it works
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            From bill to action in minutes
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            No medical billing expertise needed. Just upload and answer a few questions about your care.
          </p>
        </div>

        <div className="relative">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="flex flex-col items-center text-center md:items-start md:text-left"
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-sm">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="absolute -top-2 -right-2 text-[11px] font-bold text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {step.description}
                </p>
                <p className="text-xs font-medium text-primary-600">{step.note}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/upload">
            <Button size="xl">Start my free analysis</Button>
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">No account required. Takes about 2 minutes.</p>
        </div>
      </div>
    </section>
  );
}
