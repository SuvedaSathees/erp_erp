import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CapaPhaseStep {
  step: number;
  title: string;
  subtitle: string;
  status: "active" | "pending" | "not_started" | "completed";
}

interface CapaPhaseStepperProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}

export const CAPA_STEPS: CapaPhaseStep[] = [
  { step: 1, title: "CAPA Initiation", subtitle: "Completed", status: "completed" },
  { step: 2, title: "Problem Definition", subtitle: "Completed", status: "completed" },
  { step: 3, title: "Risk Assessment", subtitle: "Completed", status: "completed" },
  { step: 4, title: "Root Cause (RCA)", subtitle: "Completed", status: "completed" },
  { step: 5, title: "Action Implementation", subtitle: "In Progress", status: "active" },
  { step: 6, title: "Verification", subtitle: "Pending", status: "pending" },
  { step: 7, title: "Closure & Review", subtitle: "Pending", status: "pending" },
];

export function CapaPhaseStepper({
  currentStep = 5,
  onStepClick,
}: CapaPhaseStepperProps) {
  return (
    <div className="w-full bg-card rounded-xl border border-border/80 p-3.5 sm:p-4 shadow-xs overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden min-w-0">
      <div className="flex items-center min-w-[780px] sm:min-w-[840px] justify-between relative">
        {CAPA_STEPS.map((s, index) => {
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
                      ? "bg-purple-600 text-white shadow-xs ring-4 ring-purple-100 dark:ring-purple-950"
                      : isCompleted
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground border border-border group-hover:border-muted-foreground/50"
                  )}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : s.step}
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
                        ? "text-purple-600 dark:text-purple-400 font-semibold"
                        : isCompleted
                        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                        : "text-muted-foreground/70"
                    )}
                  >
                    {isActive ? "In Progress" : isCompleted ? "Completed" : "Pending"}
                  </span>
                </div>
              </button>

              {/* Connecting Line (except last item) */}
              {index < CAPA_STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 mx-3 h-0.5",
                    s.step < currentStep ? "bg-blue-600" : "bg-muted-foreground/20"
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
