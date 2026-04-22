"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const faqs = [
  {
    question: "How fast does Clario analyze my bill?",
    answer:
      "Most bills are analyzed in under 60 seconds. After uploading your document, our AI reads every line item, cross-references standard billing codes, and flags anything unusual — all in real time.",
  },
  {
    question: "What types of bills can I upload?",
    answer:
      "Clario supports PDFs and images (JPG, PNG) of hospital bills, itemized statements, explanation of benefits (EOB) documents, and outpatient invoices. The clearer the scan, the better the results.",
  },
  {
    question: "Is my medical data kept private?",
    answer:
      "Yes. Your bill is processed securely and never sold or shared with third parties. We do not store identifiable health information beyond what is needed to generate your analysis.",
  },
  {
    question: "What does 'flagged' mean on my analysis?",
    answer:
      "'Flagged' charges are line items that appear inconsistent with standard billing norms — such as duplicate charges, unusually high procedure fees, or vague facility fees with no itemization. These warrant a closer look, but are not guaranteed errors.",
  },
  {
    question: "Can Clario help me dispute a charge?",
    answer:
      "Yes. After your analysis, Clario can generate a personalized dispute letter pre-filled with the specific flagged charges and the relevant billing standards. You can edit and send it directly to the hospital or insurer.",
  },
  {
    question: "Do I need to create an account?",
    answer:
      "No account is required to analyze a bill. Creating a free account lets you save past analyses, track disputes, and access your results across devices.",
  },
  {
    question: "Is Clario a legal or medical service?",
    answer:
      "No. Clario provides informational analysis only. It is not a substitute for legal advice, medical advice, or a professional billing advocate. Always verify findings with a qualified professional before taking formal action.",
  },
  {
    question: "How accurate is the analysis?",
    answer:
      "Clario uses AI trained on standard medical billing codes (CPT, ICD-10, DRG) and industry benchmarks. While highly accurate for common billing patterns, edge cases or unusual insurance arrangements may require manual review.",
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className={`${inter.className} text-sm font-medium text-foreground group-hover:text-primary transition-colors`}>
          {question}
        </span>
        <span className="shrink-0 h-6 w-6 rounded-full border border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors">
          {open ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className={`${inter.className} text-sm text-muted-foreground leading-relaxed pb-5`}>
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid md:grid-cols-[2fr_3fr] gap-16 items-start">
          {/* Left — heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="md:sticky md:top-28"
          >
            <h2 className={`${inter.className} text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight`}>
              Frequently asked<br />questions
            </h2>
            <p className={`${inter.className} text-sm text-muted-foreground leading-relaxed`}>
              Everything you need to know about understanding and disputing your medical bill.
            </p>
          </motion.div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
