"use client";

import { motion } from "framer-motion";
import {
  PhoneCall,
  Mail,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const actions = [
  {
    icon: PhoneCall,
    title: "Call the hospital billing department",
    description:
      "Ask for a \"Patient Financial Counselor.\" Reference your account number and mention you have a formal dispute in writing.",
    cta: "Use the phone guide above",
    color: "text-primary-600",
    bg: "bg-primary-50",
  },
  {
    icon: Mail,
    title: "Send a written dispute",
    description:
      "Mail or email your dispute letter with a copy of the itemized bill. Keep a copy for your records. Request written confirmation within 30 days.",
    cta: "Use the dispute letter above",
    color: "text-accent-600",
    bg: "bg-accent-50",
  },
  {
    icon: HelpCircle,
    title: "Ask about financial assistance",
    description:
      "Nonprofit hospitals must offer charity care. Ask about income-based discount programs — many patients qualify without knowing.",
    cta: "Learn more",
    color: "text-warning-600",
    bg: "bg-warning-50",
  },
];

const resources = [
  {
    label: "Find a patient advocate (NAPO)",
    href: "https://www.patientadvocate.org",
  },
  {
    label: "Hospital Compare — CMS",
    href: "https://www.medicare.gov/care-compare/",
  },
  {
    label: "Understanding EOBs — CMS",
    href: "https://www.cms.gov/",
  },
];

export function NextActions() {
  return (
    <div className="rounded-xl border border-border bg-white shadow-card overflow-hidden">
      <div className="px-6 py-5 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Recommended next steps</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Take these actions in order for the best outcome.
        </p>
      </div>

      <div className="divide-y divide-border">
        {actions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="px-6 py-5 flex items-start gap-4"
          >
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${action.bg}`}
            >
              <action.icon className={`h-4.5 w-4.5 ${action.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-muted-foreground">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {action.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                {action.description}
              </p>
              <div className={`flex items-center gap-1 text-xs font-medium ${action.color}`}>
                <ChevronRight className="h-3 w-3" />
                {action.cta}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resources */}
      <div className="px-6 py-5 bg-muted/20 border-t border-border">
        <p className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">
          Helpful resources
        </p>
        <div className="space-y-2">
          {resources.map((resource) => (
            <a
              key={resource.href}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-primary-600 hover:text-primary-700 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              {resource.label}
            </a>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Disclaimer:</strong> This analysis is informational support only. It is not legal advice, medical advice, or a guarantee of any billing outcome. For complex disputes, consult a certified patient advocate or healthcare attorney.
        </p>
      </div>
    </div>
  );
}
