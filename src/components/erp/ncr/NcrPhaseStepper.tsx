import { cn } from "@/lib/utils";

export interface NcrPhaseStep {
  step: number;
  title: string;
  subtitle: string;
  status: "active" | "pending" | "not_started" | "completed";
}

interface NcrPhaseStepperProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}

export const NCR_STEPS: NcrPhaseStep[] = [
  { step: 1, title: "NCR Creation", subtitle: "Open", status: "active" },
  { step: 2, title: "Containment", subtitle: "Pending", status: "pending" },
  { step: 3, title: "Investigation", subtitle: "Not Started", status: "not_started" },
  { step: 4, title: "Root Cause Analysis", subtitle: "Not Started", status: "not_started" },
  { step: 5, title: "Corrective Action", subtitle: "Not Started", status: "not_started" },
  { step: 6, title: "Verification", subtitle: "Not Started", status: "not_started" },
  { step: 7, title: "Closure", subtitle: "Not Started", status: "not_started" },
];

export function NcrPhaseStepper({ currentStep = 1, onStepClick }: NcrPhaseStepperProps) {
  return (
    <div className="w-full bg-card rounded-xl border border-border/80 p-3.5 sm:p-4 shadow-xs overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-w-0">
      <div className="flex items-center min-w-[780px] sm:min-w-[840px] justify-between relative">
        {NCR_STEPS.map((s, index) => {
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
                      ? "bg-blue-600 text-white shadow-xs ring-4 ring-blue-100 dark:ring-blue-950"
                      : isCompleted
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground border border-border group-hover:border-muted-foreground/50"
                  )}
                >
                  {s.step}
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
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {s.subtitle}
                  </span>
                </div>
              </button>

              {/* Connecting Line (except last item) */}
              {index < NCR_STEPS.length - 1 && (
                <div className="flex-1 mx-3 h-0.5 bg-muted-foreground/20" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
