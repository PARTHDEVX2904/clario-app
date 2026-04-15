"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
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
import type { EpisodeOfCare, InsuranceStatus } from "@/types";
import { cn } from "@/lib/utils/cn";

const STEP_LABELS = [
  "Bill upload",
  "EOB upload",
  "Provider",
  "Insurance",
  "Health issue",
  "Care details",
  "Review",
];

const EPISODE_CHECKBOXES: {
  key: keyof Pick<
    EpisodeOfCare,
    | "hadErVisit"
    | "hadImaging"
    | "hadBloodTests"
    | "hadSurgery"
    | "hadRoomStay"
    | "hadMedicines"
    | "hadFollowupVisits"
    | "hasMultipleBills"
  >;
  label: string;
  description: string;
}[] = [
  {
    key: "hadErVisit",
    label: "Emergency Room visit",
    description: "You went to the ER",
  },
  {
    key: "hadImaging",
    label: "Imaging (CT, MRI, X-ray, ultrasound)",
    description: "Any scan or imaging study",
  },
  {
    key: "hadBloodTests",
    label: "Blood or lab tests",
    description: "Blood draws, urine, cultures",
  },
  {
    key: "hadSurgery",
    label: "Surgery or procedure",
    description: "Any surgical or invasive procedure",
  },
  {
    key: "hadRoomStay",
    label: "Overnight stay (inpatient)",
    description: "You stayed one or more nights",
  },
  {
    key: "hadMedicines",
    label: "Medications administered",
    description: "IV meds, oral meds, shots",
  },
  {
    key: "hadFollowupVisits",
    label: "Follow-up or outpatient visits",
    description: "Office or clinic visits after discharge",
  },
  {
    key: "hasMultipleBills",
    label: "I received multiple separate bills",
    description: "E.g., hospital + physician + specialist",
  },
];

interface FormState {
  billFile?: File;
  eobFile?: File;
  episode: Partial<EpisodeOfCare>;
}

const initialState: FormState = {
  episode: {
    providerName: "",
    providerCity: "",
    providerState: "",
    providerCountry: "US",
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
  enter: (direction: number) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export function UploadStepper() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateEpisode = (updates: Partial<EpisodeOfCare>) => {
    setForm((prev) => ({
      ...prev,
      episode: { ...prev.episode, ...updates },
    }));
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 0 && !form.billFile) {
      newErrors.billFile = "Please upload your medical bill to continue.";
    }
    if (step === 2) {
      if (!form.episode.providerName?.trim()) {
        newErrors.providerName = "Provider name is required.";
      }
      if (!form.episode.providerCity?.trim()) {
        newErrors.providerCity = "City is required.";
      }
    }
    if (step === 4 && !form.episode.healthIssueDescription?.trim()) {
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

  const handleSubmit = async () => {
    if (!form.billFile) return;
    setIsSubmitting(true);

    try {
      const data = new FormData();
      data.append("bill", form.billFile);
      if (form.eobFile) data.append("eob", form.eobFile);
      data.append("episode", JSON.stringify(form.episode));

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: data,
      });

      if (!res.ok) throw new Error("Analysis failed");

      const { analysisId } = await res.json() as { analysisId: string };
      router.push(`/analysis/${analysisId}`);
    } catch {
      setErrors({ submit: "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <StepProgress steps={STEP_LABELS} currentStep={step} />
      </div>

      {/* Step content */}
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
            <div className="rounded-2xl border border-border bg-white shadow-card p-6 md:p-8">
              {/* Step 0 — Bill upload */}
              {step === 0 && (
                <StepSection
                  title="Upload your medical bill"
                  description="Upload the itemized bill you received from the hospital, clinic, or provider. PDF or image formats work best."
                >
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
                    <p className="text-xs text-destructive mt-1">{errors.billFile}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-3">
                    Tip: The more detailed your bill, the better the analysis. Ask for an &quot;itemized bill&quot; from your provider if you only have a summary statement.
                  </p>
                </StepSection>
              )}

              {/* Step 1 — EOB upload (optional) */}
              {step === 1 && (
                <StepSection
                  title="Upload your insurance EOB"
                  description="Optional — but recommended if you have insurance. Your Explanation of Benefits helps us compare what was billed vs. what your insurer approved."
                  optional
                >
                  <FileUploadZone
                    label="Explanation of Benefits (EOB)"
                    file={form.eobFile}
                    onFileSelect={(file) => setForm((p) => ({ ...p, eobFile: file }))}
                  />
                  <p className="text-xs text-muted-foreground mt-3">
                    Your EOB is usually mailed by your insurance company after a claim is processed, or available in your insurer&apos;s online portal.
                  </p>
                </StepSection>
              )}

              {/* Step 2 — Provider */}
              {step === 2 && (
                <StepSection
                  title="Who sent you this bill?"
                  description="Tell us about the hospital or provider so we can better contextualize the charges."
                >
                  <div className="space-y-4">
                    <div>
                      <Label required>Hospital or provider name</Label>
                      <div className="mt-1.5">
                        <Input
                          placeholder="e.g. General Memorial Hospital"
                          value={form.episode.providerName || ""}
                          onChange={(e) => {
                            updateEpisode({ providerName: e.target.value });
                            clearError("providerName");
                          }}
                          error={errors.providerName}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label required>City</Label>
                        <div className="mt-1.5">
                          <Input
                            placeholder="e.g. Austin"
                            value={form.episode.providerCity || ""}
                            onChange={(e) => {
                              updateEpisode({ providerCity: e.target.value });
                              clearError("providerCity");
                            }}
                            error={errors.providerCity}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>State / Region</Label>
                        <div className="mt-1.5">
                          <Input
                            placeholder="e.g. TX"
                            value={form.episode.providerState || ""}
                            onChange={(e) =>
                              updateEpisode({ providerState: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Country</Label>
                      <div className="mt-1.5">
                        <Select
                          value={form.episode.providerCountry || "US"}
                          onValueChange={(v) =>
                            updateEpisode({ providerCountry: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
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
                </StepSection>
              )}

              {/* Step 3 — Insurance */}
              {step === 3 && (
                <StepSection
                  title="Do you have health insurance?"
                  description="This helps us understand how to interpret the billed amounts and what patient protections may apply to you."
                >
                  <div className="grid gap-3">
                    {(
                      [
                        {
                          value: "insured",
                          label: "Yes, I have health insurance",
                          desc: "Private, employer, Medicaid, or Medicare",
                        },
                        {
                          value: "self_pay",
                          label: "No, I am self-pay / uninsured",
                          desc: "You may qualify for hospital charity care",
                        },
                        {
                          value: "unknown",
                          label: "I&apos;m not sure",
                          desc: "Skip — we&apos;ll do our best without this info",
                        },
                      ] as { value: InsuranceStatus; label: string; desc: string }[]
                    ).map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          updateEpisode({ insuranceStatus: option.value })
                        }
                        className={cn(
                          "w-full text-left rounded-xl border p-4 transition-all duration-150",
                          form.episode.insuranceStatus === option.value
                            ? "border-primary-400 bg-primary-50"
                            : "border-border bg-background hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "h-4 w-4 rounded-full border-2 shrink-0 transition-colors",
                              form.episode.insuranceStatus === option.value
                                ? "border-primary-500 bg-primary-500"
                                : "border-muted-foreground"
                            )}
                          >
                            {form.episode.insuranceStatus === option.value && (
                              <div className="h-1.5 w-1.5 rounded-full bg-white mx-auto mt-0.5" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground"
                              dangerouslySetInnerHTML={{ __html: option.label }}
                            />
                            <p className="text-xs text-muted-foreground"
                              dangerouslySetInnerHTML={{ __html: option.desc }}
                            />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </StepSection>
              )}

              {/* Step 4 — Health issue */}
              {step === 4 && (
                <StepSection
                  title="What brought you in?"
                  description="Describe your health issue or reason for the visit in plain English. This context helps us flag charges that don't match your reported care."
                >
                  <div>
                    <Label required>Describe your health issue or episode</Label>
                    <div className="mt-1.5">
                      <Textarea
                        placeholder="e.g. I came to the ER with severe abdominal pain. They ran tests and discovered appendicitis. I had surgery and stayed 2 nights."
                        rows={5}
                        value={form.episode.healthIssueDescription || ""}
                        onChange={(e) => {
                          updateEpisode({
                            healthIssueDescription: e.target.value,
                          });
                          clearError("healthIssueDescription");
                        }}
                        error={errors.healthIssueDescription}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      You don&apos;t need medical terminology. Just describe what happened in your own words. The more detail you share, the better we can assess your bill.
                    </p>
                  </div>
                </StepSection>
              )}

              {/* Step 5 — Care details */}
              {step === 5 && (
                <StepSection
                  title="What happened during your visit?"
                  description="Select everything that applied to your episode of care. This helps us identify charges that may not match your actual treatment."
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {EPISODE_CHECKBOXES.map((checkbox) => {
                      const checked = !!form.episode[checkbox.key];
                      return (
                        <button
                          key={checkbox.key}
                          type="button"
                          onClick={() =>
                            updateEpisode({ [checkbox.key]: !checked })
                          }
                          className={cn(
                            "text-left rounded-xl border p-3.5 transition-all duration-150 flex items-start gap-3",
                            checked
                              ? "border-primary-300 bg-primary-50"
                              : "border-border bg-background hover:bg-muted"
                          )}
                        >
                          <div
                            className={cn(
                              "h-4 w-4 rounded shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors",
                              checked
                                ? "border-primary-500 bg-primary-500"
                                : "border-muted-foreground"
                            )}
                          >
                            {checked && (
                              <svg
                                viewBox="0 0 10 8"
                                className="h-2.5 w-2.5 text-white"
                                fill="none"
                              >
                                <path
                                  d="M1 4l2.5 2.5L9 1"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground leading-tight">
                              {checkbox.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {checkbox.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </StepSection>
              )}

              {/* Step 6 — Review */}
              {step === 6 && (
                <StepSection
                  title="Ready to analyze"
                  description="Review your information below, then click Analyze to get your bill breakdown."
                >
                  <div className="space-y-3">
                    <ReviewRow
                      label="Bill document"
                      value={form.billFile?.name || "—"}
                    />
                    <ReviewRow
                      label="EOB document"
                      value={form.eobFile?.name || "Not uploaded (optional)"}
                    />
                    <ReviewRow
                      label="Provider"
                      value={
                        [
                          form.episode.providerName,
                          form.episode.providerCity,
                          form.episode.providerState,
                        ]
                          .filter(Boolean)
                          .join(", ") || "—"
                      }
                    />
                    <ReviewRow
                      label="Insurance"
                      value={
                        {
                          insured: "Insured",
                          self_pay: "Self-pay / uninsured",
                          unknown: "Unknown",
                        }[form.episode.insuranceStatus || "unknown"]
                      }
                    />
                    <ReviewRow
                      label="Health issue"
                      value={form.episode.healthIssueDescription || "—"}
                      multiline
                    />
                    <ReviewRow
                      label="Care details"
                      value={EPISODE_CHECKBOXES.filter(
                        (c) => form.episode[c.key]
                      )
                        .map((c) => c.label)
                        .join(", ") || "None selected"}
                      multiline
                    />
                  </div>

                  <div className="mt-6 rounded-xl border border-warning-200 bg-warning-50 p-4">
                    <p className="text-xs text-warning-600 leading-relaxed">
                      <strong>Disclaimer:</strong> Clario&apos;s analysis is informational support only — not legal or medical advice. Always verify findings with a qualified patient advocate, billing specialist, or healthcare attorney.
                    </p>
                  </div>

                  {errors.submit && (
                    <p className="mt-3 text-sm text-destructive">{errors.submit}</p>
                  )}
                </StepSection>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goBack}
          disabled={step === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        {step < STEP_LABELS.length - 1 ? (
          <Button onClick={goNext} className="gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting}
            size="lg"
            className="gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze my bill"
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Helper sub-components ─────────────────────────────────────────────────────

function StepSection({
  title,
  description,
  optional = false,
  children,
}: {
  title: string;
  description: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          {optional && (
            <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
              Optional
            </span>
          )}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function ReviewRow({
  label,
  value,
  multiline = false,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-4 py-2 border-b border-border last:border-0",
        multiline ? "flex-col" : "items-start justify-between"
      )}
    >
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide shrink-0">
        {label}
      </span>
      <span className="text-sm text-foreground text-right break-words">
        {value}
      </span>
    </div>
  );
}
