"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, CheckCircle2, Loader2,
  FileText, Brain, FileEdit, Upload, Building2,
  Activity, ClipboardList, Sparkles,
  Zap, ScanLine, Droplets, Scissors, BedDouble,
  Pill, CalendarCheck, Files,
} from "lucide-react";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StepProgress } from "./step-progress";
import { FileUploadZone } from "./file-upload-zone";
import type { EpisodeOfCare } from "@/types";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const STEP_LABELS = [
  "Bill upload",
  "Provider",
  "Health issue",
  "Care details",
  "Review",
];

type EpisodeCheckboxKey = keyof Pick<
  EpisodeOfCare,
  | "hadErVisit" | "hadImaging" | "hadBloodTests" | "hadSurgery"
  | "hadRoomStay" | "hadMedicines" | "hadFollowupVisits" | "hasMultipleBills"
>;

const EPISODE_CHECKBOXES: {
  key: EpisodeCheckboxKey;
  label: string;
  icon: React.ElementType;
}[] = [
  { key: "hadErVisit",        label: "ER visit",          icon: Zap },
  { key: "hadImaging",        label: "CT / MRI / X-ray",  icon: ScanLine },
  { key: "hadBloodTests",     label: "Blood tests",        icon: Droplets },
  { key: "hadSurgery",        label: "Surgery",            icon: Scissors },
  { key: "hadRoomStay",       label: "Overnight stay",     icon: BedDouble },
  { key: "hadMedicines",      label: "Medications",        icon: Pill },
  { key: "hadFollowupVisits", label: "Follow-up visits",   icon: CalendarCheck },
  { key: "hasMultipleBills",  label: "Multiple bills",     icon: Files },
];

const PROCESSING_STEPS = [
  { icon: FileText,  label: "Reading your bill",           sublabel: "Extracting text from document" },
  { icon: Brain,     label: "AI reviewing charges",        sublabel: "Identifying flags & overcharges" },
  { icon: FileEdit,  label: "Generating dispute letters",  sublabel: "Preparing dispute, phone & complaint drafts" },
];

const STEP_META = [
  { icon: Upload,        title: "Upload your medical bill",         description: "Upload the itemized bill from your hospital, clinic, or provider. PDF or image formats work best." },
  { icon: Building2,     title: "Who sent you this bill?",          description: "Tell us about the hospital or provider so we can better contextualise the charges." },
  { icon: Activity,      title: "What brought you in?",             description: "Describe your health issue or reason for the visit. This helps us flag charges that don't match your care." },
  { icon: ClipboardList, title: "What happened during your visit?", description: "Select all that apply. This helps us spot charges that don't match your actual treatment." },
  { icon: Sparkles,      title: "Ready to analyze",                 description: "Review your information below, then click Analyze to get your full bill breakdown." },
];

interface FormState {
  billFile?: File;
  episode: Partial<EpisodeOfCare>;
}

const initialState: FormState = {
  episode: {
    providerName: "",
    providerCity: "",
    providerState: "",
    providerCountry: "IN",
    insuranceStatus: "unknown",
    healthIssueDescription: "",
    hadErVisit: false,
    hadImaging: false,
    hadBloodTests: false,
    hadSurgery: false,
    hadRoomStay: false,
    hadMedicines: false,
    hadFollowupVisits: false,
    hasMultipleBills: false,
  },
};

const slideVariants = {
  enter: (direction: number) => ({ x: direction > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (direction: number) => ({ x: direction > 0 ? -40 : 40, opacity: 0 }),
};

export function UploadStepper() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const updateEpisode = (updates: Partial<EpisodeOfCare>) => {
    setForm((prev) => ({ ...prev, episode: { ...prev.episode, ...updates } }));
  };

  const clearError = (field: string) => {
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 0 && !form.billFile) newErrors.billFile = "Please upload your medical bill to continue.";
    if (step === 1) {
      if (!form.episode.providerName?.trim()) newErrors.providerName = "Provider name is required.";
      if (!form.episode.providerCity?.trim()) newErrors.providerCity = "City is required.";
    }
    if (step === 2 && !form.episode.healthIssueDescription?.trim()) {
      newErrors.healthIssueDescription = "Please describe your health issue.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  useEffect(() => {
    if (!isSubmitting) return;
    setProcessingStep(0);
    const t1 = setTimeout(() => setProcessingStep(1), 8000);
    const t2 = setTimeout(() => setProcessingStep(2), 20000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isSubmitting]);

  const handleSubmit = async () => {
    if (!form.billFile) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("bill", form.billFile);
      data.append("episode", JSON.stringify(form.episode));

      const res = await fetch("/api/analyze", { method: "POST", body: data });
      const json = await res.json() as { analysisId?: string; error?: string };

      if (!res.ok) {
        setErrors({ submit: json.error ?? "Something went wrong. Please try again." });
        setIsSubmitting(false);
        return;
      }

      router.push(`/analysis/${json.analysisId}`);
    } catch (err) {
      setErrors({ submit: err instanceof Error ? err.message : "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  // ── Processing overlay ─────────────────────────────────────────────────────
  if (isSubmitting) {
    return (
      <div className={`${inter.className} w-full max-w-2xl mx-auto`}>
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-[#2F2FE4]/5 to-blue-50/50 border-b border-slate-100 flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2F2FE4]/15 to-blue-50 flex items-center justify-center">
                <Brain className="h-5 w-5 text-[#2F2FE4]" />
              </div>
              <motion.div
                className="absolute -inset-1 rounded-xl border-2 border-[#2F2FE4]/30"
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Analyzing your bill</h2>
              <p className="text-xs text-slate-400 mt-0.5">This takes 30–60 seconds — please don&apos;t close this tab</p>
            </div>
          </div>

          {/* Steps */}
          <div className="px-8 py-6 space-y-3">
            {PROCESSING_STEPS.map((s, i) => {
              const isDone = processingStep > i;
              const isActive = processingStep === i;
              const Icon = s.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    "flex items-center gap-4 rounded-xl border px-4 py-3.5 transition-all duration-300",
                    isDone   ? "border-emerald-200 bg-emerald-50/60"
                    : isActive ? "border-[#2F2FE4]/30 bg-[#2F2FE4]/5"
                    : "border-slate-100 bg-slate-50/50 opacity-40"
                  )}
                >
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                    isDone   ? "bg-emerald-100"
                    : isActive ? "bg-[#2F2FE4]/10"
                    : "bg-slate-100"
                  )}>
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 text-[#2F2FE4] animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "text-sm font-semibold",
                      isDone   ? "text-emerald-700"
                      : isActive ? "text-[#2F2FE4]"
                      : "text-slate-400"
                    )}>
                      {s.label}
                    </p>
                    <p className="text-xs text-slate-400">{s.sublabel}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {errors.submit && (
            <p className="px-8 pb-6 text-sm text-red-500">{errors.submit}</p>
          )}
        </div>
      </div>
    );
  }

  // ── Normal stepper ─────────────────────────────────────────────────────────
  const meta = STEP_META[step];
  const StepIcon = meta.icon;

  return (
    <div className={`${inter.className} w-full max-w-2xl mx-auto`}>
      <div className="mb-8">
        <StepProgress steps={STEP_LABELS} currentStep={step} />
      </div>

      <div className="overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

              {/* Card header — same pattern as analysis cards */}
              <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#2F2FE4]/10 to-blue-50 flex items-center justify-center shrink-0">
                  <StepIcon className="h-4 w-4 text-[#2F2FE4]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">{meta.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{meta.description}</p>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6 md:p-7">

                {/* Step 0 — Bill upload */}
                {step === 0 && (
                  <div className="space-y-4">
                    <FileUploadZone
                      label="Medical bill"
                      required
                      file={form.billFile}
                      onFileSelect={(file) => {
                        setForm((p) => ({ ...p, billFile: file }));
                        if (file) clearError("billFile");
                      }}
                    />
                    {errors.billFile && (
                      <p className="text-xs text-red-500">{errors.billFile}</p>
                    )}
                    <div className="flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-100 px-4 py-3">
                      <span className="text-amber-500 text-base leading-none mt-0.5">💡</span>
                      <p className="text-xs text-amber-700 leading-relaxed">
                        Ask for an &quot;itemized bill&quot; from your provider if you only have a summary statement — the more detailed, the better the analysis.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 1 — Provider */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label required>Hospital or provider name</Label>
                      <div className="mt-1.5">
                        <Input
                          placeholder="e.g. Apollo Hospital"
                          value={form.episode.providerName || ""}
                          onChange={(e) => { updateEpisode({ providerName: e.target.value }); clearError("providerName"); }}
                          error={errors.providerName}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label required>City</Label>
                        <div className="mt-1.5">
                          <Input
                            placeholder="e.g. Mumbai"
                            value={form.episode.providerCity || ""}
                            onChange={(e) => { updateEpisode({ providerCity: e.target.value }); clearError("providerCity"); }}
                            error={errors.providerCity}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>State / Region</Label>
                        <div className="mt-1.5">
                          <Input
                            placeholder="e.g. Maharashtra"
                            value={form.episode.providerState || ""}
                            onChange={(e) => updateEpisode({ providerState: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Country</Label>
                      <div className="mt-1.5">
                        <Select
                          value={form.episode.providerCountry || "IN"}
                          onValueChange={(v) => updateEpisode({ providerCountry: v })}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="IN">India</SelectItem>
                            <SelectItem value="US">United States</SelectItem>
                            <SelectItem value="CA">Canada</SelectItem>
                            <SelectItem value="GB">United Kingdom</SelectItem>
                            <SelectItem value="AU">Australia</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2 — Health issue */}
                {step === 2 && (
                  <div>
                    <Label required>Describe your health issue or episode</Label>
                    <div className="mt-1.5">
                      <Textarea
                        placeholder="e.g. I was admitted with fever and severe abdominal pain. The doctors ran blood tests and a CT scan and found appendicitis. I had surgery and stayed 2 nights."
                        rows={5}
                        value={form.episode.healthIssueDescription || ""}
                        onChange={(e) => { updateEpisode({ healthIssueDescription: e.target.value }); clearError("healthIssueDescription"); }}
                        error={errors.healthIssueDescription}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      No medical terminology needed — describe what happened in your own words. The more detail, the better.
                    </p>
                  </div>
                )}

                {/* Step 3 — Care details */}
                {step === 3 && (
                  <div>
                    <p className="text-xs text-slate-400 mb-4">Tap everything that happened during your visit. Skip anything that didn&apos;t apply.</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {EPISODE_CHECKBOXES.map((checkbox) => {
                        const checked = !!form.episode[checkbox.key];
                        const Icon = checkbox.icon;
                        return (
                          <button
                            key={checkbox.key}
                            type="button"
                            onClick={() => updateEpisode({ [checkbox.key]: !checked })}
                            className={cn(
                              "relative flex flex-col items-center justify-center gap-2.5 rounded-xl border-2 py-4 px-3 transition-all duration-150 text-center",
                              checked
                                ? "border-[#2F2FE4] bg-[#2F2FE4] shadow-sm shadow-[#2F2FE4]/20"
                                : "border-slate-200 bg-white hover:border-[#2F2FE4]/40 hover:bg-slate-50/60"
                            )}
                          >
                            {checked && (
                              <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                                <svg viewBox="0 0 10 8" className="h-2 w-2 text-white" fill="none">
                                  <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )}
                            <div className={cn(
                              "h-9 w-9 rounded-xl flex items-center justify-center transition-colors",
                              checked ? "bg-white/15" : "bg-slate-100"
                            )}>
                              <Icon className={cn("h-4.5 w-4.5 transition-colors", checked ? "text-white" : "text-slate-500")} style={{ width: 18, height: 18 }} />
                            </div>
                            <span className={cn(
                              "text-xs font-semibold leading-tight transition-colors",
                              checked ? "text-white" : "text-slate-700"
                            )}>
                              {checkbox.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 4 — Review */}
                {step === 4 && (
                  <div>
                    <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100 mb-5">
                      <ReviewRow label="Bill document" value={form.billFile?.name || "—"} />
                      <ReviewRow
                        label="Provider"
                        value={[form.episode.providerName, form.episode.providerCity, form.episode.providerState].filter(Boolean).join(", ") || "—"}
                      />
                      <ReviewRow label="Health issue" value={form.episode.healthIssueDescription || "—"} multiline />
                      <ReviewRow
                        label="Care details"
                        value={EPISODE_CHECKBOXES.filter((c) => form.episode[c.key]).map((c) => c.label).join(", ") || "None selected"}
                        multiline
                      />
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                      <p className="text-xs text-amber-700 leading-relaxed">
                        <strong>Disclaimer:</strong> This analysis is informational support only — not legal or medical advice. Always verify findings with a qualified patient advocate, billing specialist, or healthcare attorney.
                      </p>
                    </div>

                    {errors.submit && (
                      <p className="mt-3 text-sm text-red-500">{errors.submit}</p>
                    )}
                  </div>
                )}

              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-5 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={step === 0}
          className="gap-2 border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {step < STEP_LABELS.length - 1 ? (
          <Button
            onClick={goNext}
            className="gap-2 bg-[#2F2FE4] hover:bg-[#2525c4] text-white px-6 font-semibold"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 bg-[#2F2FE4] hover:bg-[#2525c4] text-white px-6 font-semibold"
          >
            Analyze my bill
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Helper sub-components ─────────────────────────────────────────────────────

function ReviewRow({ label, value, multiline = false }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div className={cn(
      "flex gap-4 px-4 py-3",
      multiline ? "flex-col gap-1" : "items-center justify-between"
    )}>
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">{label}</span>
      <span className={cn(
        "text-sm font-medium text-foreground break-words",
        !multiline && "text-right"
      )}>
        {value}
      </span>
    </div>
  );
}
