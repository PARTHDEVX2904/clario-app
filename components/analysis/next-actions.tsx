"use client";

import { motion } from "framer-motion";
import { PhoneCall, Mail, HelpCircle, ExternalLink, ArrowRight } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const actions = [
  {
    step: "01",
    icon: PhoneCall,
    title: "Call the billing department",
    description: "Ask for a Patient Financial Counselor. Reference your account number and mention a formal written dispute.",
    iconBg: "bg-gradient-to-br from-teal-100 to-cyan-50",
    iconColor: "text-teal-600",
    numColor: "text-teal-500",
  },
  {
    step: "02",
    icon: Mail,
    title: "Send a written dispute",
    description: "Mail your dispute letter with a copy of the itemized bill. Request written confirmation within 30 days.",
    iconBg: "bg-gradient-to-br from-blue-100 to-indigo-50",
    iconColor: "text-blue-600",
    numColor: "text-blue-500",
  },
  {
    step: "03",
    icon: HelpCircle,
    title: "Ask about financial assistance",
    description: "Nonprofit hospitals must offer charity care. Many patients qualify for income-based discounts without knowing.",
    iconBg: "bg-gradient-to-br from-amber-100 to-orange-50",
    iconColor: "text-amber-600",
    numColor: "text-amber-500",
  },
];

const resources = [
  {
    name: "National Consumer Helpline",
    short: "Helpline 1800-11-4000",
    href: "https://consumerhelpline.gov.in",
    logo: "https://www.google.com/s2/favicons?domain=consumerhelpline.gov.in&sz=32",
    bg: "bg-orange-50",
    border: "border-orange-100",
  },
  {
    name: "Ayushman Bharat — NHA",
    short: "National Health Authority",
    href: "https://nha.gov.in",
    logo: "https://nha.gov.in/images/17997a344cb693df4895.svg",
    bg: "bg-green-50",
    border: "border-green-100",
  },
  {
    name: "IRDAI Bima Bharosa",
    short: "Insurance Grievance Portal",
    href: "https://bimabharosa.irdai.gov.in",
    logo: "https://www.google.com/s2/favicons?domain=irdai.gov.in&sz=32",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    name: "MoHFW",
    short: "Ministry of Health & Family Welfare",
    href: "https://mohfw.gov.in",
    logo: "https://www.google.com/s2/favicons?domain=mohfw.gov.in&sz=32",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
  },
];

export function NextActions() {
  return (
    <div className={`${inter.className} rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden`}>

      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
          <ArrowRight className="h-4 w-4 text-slate-600" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Recommended next steps</h2>
          <p className="text-xs text-muted-foreground">Take these actions in order for the best outcome</p>
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-slate-100">
        {actions.map((action, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.28 }}
            className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/60 transition-colors"
          >
            {/* Step number */}
            <span className={`text-xl font-extrabold shrink-0 w-8 text-center ${action.numColor} opacity-60`}>
              {action.step}
            </span>

            {/* Icon */}
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${action.iconBg}`}>
              <action.icon className={`h-4 w-4 ${action.iconColor}`} />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">{action.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{action.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resources */}
      <div className="px-6 py-5 bg-slate-50 border-t border-slate-100">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Official Resources</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {resources.map((r) => (
            <a
              key={r.href}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${r.bg} ${r.border} hover:shadow-sm transition-all group`}
            >
              <img
                src={r.logo}
                alt={r.name}
                className="h-7 w-7 rounded-md object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-700 leading-tight">{r.name}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{r.short}</p>
              </div>
              <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </a>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-3 border-t border-slate-100">
        <p className="text-[11px] text-muted-foreground">
          Informational only — not legal or medical advice. For complex disputes, consult a certified patient advocate or healthcare attorney.
        </p>
      </div>
    </div>
  );
}
