import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface IqcPhaseStep {
  step: number;
  title: string;
  subtitle: string;
}

interface IqcPhaseStepperProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}

export const IQC_STEPS: IqcPhaseStep[] = [
  { step: 1, title: "GRN & Receipt", subtitle: "Inbound Verification" },
  { step: 2, title: "Quarantine & Sampling", subtitle: "AQL Level II (80 Units)" },
  { step: 3, title: "Characteristics Testing", subtitle: "6 Parameters Tested" },
  { step: 4, title: "Defect Classification", subtitle: "Linked NCR-2026-0027" },
  { step: 5, title: "Stores Release", subtitle: "Quarantine / Clearance" },
];

export function IqcPhaseStepper({ currentStep = 3, onStepClick }: IqcPhaseStepperProps) {
  return (
    <div className="w-full bg-card rounded-xl border border-border/80 p-3.5 sm:p-4 shadow-xs overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex items-center min-w-[640px] md:min-w-0 justify-between relative">
        {IQC_STEPS.map((s, index) => {
          const isActive = s.step === currentStep;
          const isCompleted = s.step < currentStep;

          return (
            <div key={s.step} className="flex items-center flex-1 last:flex-none">
              {/* Step Item Button */}
              <button
                type="button"
                onClick={() => onStepClick?.(s.step)}
                className="flex items-center gap-2.5 text-left group focus:outline-hidden select-none cursor-pointer"
              >
                {/* Number Circle / Checkmark */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                    isActive
                      ? "bg-[#0B3B7B] text-white shadow-xs ring-4 ring-blue-100 dark:ring-blue-950"
                      : isCompleted
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-muted text-muted-foreground border border-border group-hover:border-muted-foreground/50"
                  )}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.step}
                </div>

                {/* Labels */}
                <div className="flex flex-col min-w-0">
                  <span
                    className={cn(
                      "text-xs font-semibold whitespace-nowrap transition-colors",
                      isActive
                        ? "text-foreground font-bold"
                        : isCompleted
                        ? "text-foreground group-hover:text-blue-600"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {s.title}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium whitespace-nowrap",
                      isActive
                        ? "text-blue-600 dark:text-blue-400 font-semibold"
                        : isCompleted
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {s.subtitle}
                  </span>
                </div>
              </button>

              {/* Connecting Line (except last item) */}
              {index < IQC_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 mx-2.5 h-0.5 transition-colors",
                    isCompleted ? "bg-emerald-600/70" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
