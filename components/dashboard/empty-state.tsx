"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center text-center py-20 px-6"
    >
      {/* Illustration placeholder */}
      <div className="relative mb-8">
        <div className="h-20 w-20 rounded-2xl bg-primary-50 border border-primary-100 flex items-center justify-center">
          <FileText className="h-10 w-10 text-primary-300" />
        </div>
        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-xl bg-warning-50 border border-warning-100 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-warning-500" />
        </div>
        <div className="absolute -bottom-2 -left-2 h-7 w-7 rounded-lg bg-accent-50 border border-accent-100 flex items-center justify-center">
          <span className="text-xs font-bold text-accent-600">↓</span>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        No analyses yet
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
        Upload your first hospital or medical bill to get a plain-English breakdown, spot potential overcharges, and find savings opportunities.
      </p>

      <Link href="/upload">
        <Button size="lg" className="gap-2">
          <Upload className="h-4 w-4" />
          Analyze my first bill
        </Button>
      </Link>

      <p className="mt-4 text-xs text-muted-foreground">
        Free · No account needed · Results in minutes
      </p>
    </motion.div>
  );
}
