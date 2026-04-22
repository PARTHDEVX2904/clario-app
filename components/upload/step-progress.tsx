"use client";

import { Check } from "lucide-react";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils/cn";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className={`${inter.className} w-full`}>
      {/* Mobile: progress bar */}
      <div className="sm:hidden mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Step {currentStep + 1} of {steps.length}
          </p>
          <p className="text-xs font-bold text-[#2F2FE4]">{steps[currentStep]}</p>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#2F2FE4] rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: step indicators */}
      <div className="hidden sm:flex items-center w-full">
        {steps.map((step, i) => {
          const isComplete = i < currentStep;
          const isCurrent = i === currentStep;

          return (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                    isComplete
                      ? "bg-[#2F2FE4] text-white shadow-sm shadow-[#2F2FE4]/30"
                      : isCurrent
                      ? "bg-white border-2 border-[#2F2FE4] text-[#2F2FE4] shadow-sm shadow-[#2F2FE4]/15"
                      : "bg-slate-50 border border-slate-200 text-slate-400"
                  )}
                >
                  {isComplete ? <Check className="h-3.5 w-3.5" /> : <span>{i + 1}</span>}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-[11px] font-semibold text-center leading-tight max-w-[72px]",
                    isCurrent ? "text-[#2F2FE4]" : isComplete ? "text-slate-500" : "text-slate-400"
                  )}
                >
                  {step}
                </span>
              </div>

              {i < steps.length - 1 && (
                <div className="flex-1 mx-2 mb-5">
                  <div className="h-0.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#2F2FE4] rounded-full transition-all duration-500"
                      style={{ width: isComplete ? "100%" : "0%" }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
