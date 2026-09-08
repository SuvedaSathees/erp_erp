import { cn } from "@/lib/utils";

export interface FqcPhaseStep {
  step: number;
  title: string;
  subtitle: string;
}

interface FqcPhaseStepperProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}

export const FQC_STEPS: FqcPhaseStep[] = [
  { step: 1, title: "Batch Assembly Gate", subtitle: "50 Units Ready" },
  { step: 2, title: "100% Functional Test", subtitle: "Hi-Pot & Torque Passed" },
  { step: 3, title: "Cosmetic & Packaging", subtitle: "AQL Visual Inspection" },
  { step: 4, title: "CoC Certification", subtitle: "COC-2026-0142 Verified" },
  { step: 5, title: "Finished Goods Release", subtitle: "Warehouse Handover" },
];

export function FqcPhaseStepper({ currentStep = 3, onStepClick }: FqcPhaseStepperProps) {
  return (
    <div className="w-full bg-card rounded-xl border border-border/80 p-3 sm:p-4 shadow-xs overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-w-0">
      <div className="flex items-center min-w-[680px] justify-between relative">
        {FQC_STEPS.map((s, index) => {
          const isActive = s.step === currentStep;
          const isCompleted = s.step < currentStep;

          return (
            <div key={s.step} className="flex items-center flex-1 last:flex-none">
              {/* Step Item */}
              <button
                type="button"
                onClick={() => onStepClick?.(s.step)}
                className="flex items-center gap-2.5 text-left group focus:outline-hidden select-none cursor-pointer"
              >
                {/* Number Circle */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all",
                    isActive
                      ? "bg-[#0B3B7B] text-white shadow-xs ring-4 ring-blue-100 dark:ring-blue-950"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-muted text-muted-foreground border border-border group-hover:border-muted-foreground/50"
                  )}
                >
                  {isCompleted ? "✓" : s.step}
                </div>

                {/* Labels */}
                <div className="flex flex-col">
                  <span
                    className={cn(
                      "text-xs font-semibold whitespace-nowrap",
                      isActive
                        ? "text-foreground font-bold"
                        : "text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    {s.title}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium whitespace-nowrap",
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
              {index < FQC_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 mx-3 h-0.5 transition-colors",
                    isCompleted ? "bg-emerald-500/60" : "bg-muted-foreground/20"
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
