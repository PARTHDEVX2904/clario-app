"use client";

import { motion } from "framer-motion";
import { Lock, EyeOff, Scale, MessageSquare } from "lucide-react";

const trustPoints = [
  {
    icon: Lock,
    title: "Your data stays yours",
    description:
      "Documents are processed to generate your analysis and are never shared with third parties, hospitals, insurers, or advertisers.",
  },
  {
    icon: EyeOff,
    title: "No account required",
    description:
      "You don't need to create an account or share personal identifying information to analyze a bill.",
  },
  {
    icon: Scale,
    title: "Informational, not legal advice",
    description:
      "Clario helps you understand and question your bill. For legal disputes, consult a certified patient advocate or healthcare attorney.",
  },
  {
    icon: MessageSquare,
    title: "Honest confidence scores",
    description:
      "Every flag comes with a confidence level. We tell you when we're less certain so you can make informed decisions.",
  },
];

export function TrustSection() {
  return (
    <section id="trust" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — visual */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-background border border-border p-8 relative overflow-hidden"
          >
            <div
              className="absolute inset-0 -z-10"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(0,71,171,0.04) 0%, transparent 70%)",
              }}
            />
            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-white p-4 shadow-card">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Your bill analysis</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-display font-semibold text-foreground">₹1,15,500</p>
                    <p className="text-xs text-muted-foreground">Total charges reviewed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-accent-600">Save ₹28,000</p>
                    <p className="text-xs text-muted-foreground">Estimated opportunity</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-accent-100 bg-accent-50 p-4">
                  <p className="text-2xl font-display font-semibold text-accent-600 mb-0.5">4</p>
                  <p className="text-xs text-muted-foreground">Charges flagged for review</p>
                </div>
                <div className="rounded-xl border border-primary-100 bg-primary-50 p-4">
                  <p className="text-2xl font-display font-semibold text-primary-600 mb-0.5">84%</p>
                  <p className="text-xs text-muted-foreground">Analysis confidence score</p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-white p-4 shadow-card">
                <p className="text-xs font-semibold text-foreground mb-2">Dispute draft ready</p>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full w-full bg-primary-500 rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Personalized letter based on your flags</p>
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
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-3">
              Built for trust
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-6">
              Serious about your privacy and honesty
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Medical billing is already stressful. We built Clario to be a tool you can trust — one that tells you what it knows, what it doesn't, and what you can do next.
            </p>

            <div className="space-y-5">
              {trustPoints.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.3 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-primary-50 flex items-center justify-center">
                    <point.icon className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-0.5">{point.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
