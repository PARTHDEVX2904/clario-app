"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StepProgressProps {
  steps: string[];
  currentStep: number;
}

export function StepProgress({ steps, currentStep }: StepProgressProps) {
  return (
    <div className="w-full">
      {/* Mobile: step X of Y */}
      <div className="sm:hidden mb-6">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          Step {currentStep + 1} of {steps.length}
        </p>
        <p className="text-sm font-semibold text-foreground">{steps[currentStep]}</p>
        <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-500"
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
                {/* Circle */}
                <div
                  className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200 border-2",
                    isComplete
                      ? "bg-primary-500 border-primary-500 text-white"
                      : isCurrent
                      ? "border-primary-500 bg-white text-primary-600"
                      : "border-border bg-muted text-muted-foreground"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </div>
                {/* Label */}
                <span
                  className={cn(
                    "mt-1.5 text-[11px] font-medium text-center leading-tight max-w-[72px]",
                    isCurrent ? "text-primary-600" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="flex-1 mx-2 mb-5">
                  <div className="h-px w-full bg-border overflow-hidden">
                    <div
                      className="h-full bg-primary-400 transition-all duration-500"
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
