import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import type { PfmeaRecord } from "@/services/types";

interface PfmeaWorkflowProgressBarProps {
  record: PfmeaRecord;
}

export const PfmeaWorkflowProgressBar: React.FC<PfmeaWorkflowProgressBarProps> = ({
  record,
}) => {
  const steps = [
    { number: 1, name: "Process Function Analysis", status: "Completed" },
    { number: 2, name: "Failure Analysis", status: "Completed" },
    { number: 3, name: "Recommended Actions", status: "In Progress" },
    { number: 4, name: "Manufacturing Validation", status: "Pending" },
    { number: 5, name: "AI Risk Assessment", status: "Pending" },
    { number: 6, name: "Review & Approval", status: "Pending" },
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-3.5 text-xs">
      <h3 className="font-bold text-foreground mb-3 text-xs">Workflow Progress</h3>

      <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
        {steps.map((s) => {
          const isCompleted = s.status === "Completed";
          const isInProgress = s.status === "In Progress";

          return (
            <div
              key={s.number}
              className={`p-2.5 rounded-lg border flex items-center gap-2.5 transition-all ${
                isCompleted
                  ? "bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                  : isInProgress
                  ? "bg-blue-50/70 dark:bg-blue-950/40 border-2 border-blue-500 shadow-sm"
                  : "bg-muted/20 border-border"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : isInProgress ? (
                <Clock className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/40 shrink-0" />
              )}

              <div className="min-w-0 flex-1">
                <span className="font-bold text-foreground text-[11px] block truncate">
                  {s.name}
                </span>
                <span
                  className={`text-[9px] font-semibold block ${
                    isCompleted
                      ? "text-emerald-600 dark:text-emerald-400"
                      : isInProgress
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground"
                  }`}
                >
                  {s.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
