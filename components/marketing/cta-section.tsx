"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-border bg-white shadow-card-lg px-8 py-14 md:py-20 relative overflow-hidden"
        >
          {/* Subtle gradient */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,71,171,0.05) 0%, transparent 70%)",
            }}
          />

          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-4">
            Ready to take control?
          </p>

          <h2 className="font-display text-3xl md:text-5xl font-semibold text-foreground mb-5 leading-tight">
            Stop paying bills <br className="hidden md:block" />
            you don&apos;t owe.
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
            The average patient who reviews their bill finds errors. Let Mediva help you find yours — for free.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/upload">
              <Button size="xl" className="gap-2 group w-full sm:w-auto">
                Analyze my bill — free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            No account required. 100% free to start. Results in under a minute.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
