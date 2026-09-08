import { cn } from "@/lib/utils";

export interface IpqcPhaseStep {
  step: number;
  title: string;
  subtitle: string;
}

interface IpqcPhaseStepperProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}

export const IPQC_STEPS: IpqcPhaseStep[] = [
  { step: 1, title: "First-Piece Setup", subtitle: "Tooling & Machine Approved" },
  { step: 2, title: "Parameter Verification", subtitle: "Temp & Pressure In-Spec" },
  { step: 3, title: "In-Line Sampling", subtitle: "Hourly Run Checks" },
  { step: 4, title: "SPC Run Evaluation", subtitle: "Cpk 1.82 (In Control)" },
  { step: 5, title: "Operation Sign-Off", subtitle: "Cleared to Next Stage" },
];

export function IpqcPhaseStepper({ currentStep = 3, onStepClick }: IpqcPhaseStepperProps) {
  return (
    <div className="w-full bg-card rounded-xl border border-border/80 p-3 sm:p-4 shadow-xs overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-w-0">
      <div className="flex items-center min-w-[680px] justify-between relative">
        {IPQC_STEPS.map((s, index) => {
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
              {index < IPQC_STEPS.length - 1 && (
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
