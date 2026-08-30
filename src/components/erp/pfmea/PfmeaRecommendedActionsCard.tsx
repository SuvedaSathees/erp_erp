import React from "react";
import { ArrowRight, CheckCircle2, Clock } from "lucide-react";
import type { PfmeaAction } from "@/services/types";

interface PfmeaRecommendedActionsCardProps {
  actions?: PfmeaAction[];
  recommendedActions?: PfmeaAction[];
  onViewAll?: () => void;
}

export const PfmeaRecommendedActionsCard: React.FC<PfmeaRecommendedActionsCardProps> = ({
  actions,
  recommendedActions,
  onViewAll,
}) => {
  const items = actions || recommendedActions || [];

  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-4 text-xs flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center pb-2.5 border-b border-border mb-3">
          <h2 className="font-bold text-foreground text-xs">
            Recommended Actions (Top 5)
          </h2>
          <span className="text-[10px] text-muted-foreground font-semibold">
            Revised RPN Target
          </span>
        </div>

        <div className="space-y-2">
          {items.slice(0, 5).map((act) => (
            <div key={act.id} className="flex items-center justify-between py-2 px-2.5 rounded-lg bg-muted/25 hover:bg-muted/40 transition-colors border border-border/40">
              <div className="min-w-0 flex-1 pr-2">
                <span className="font-bold text-foreground text-xs block truncate" title={act.action}>
                  {act.action}
                </span>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                  <span className="font-semibold text-foreground">{act.responsible}</span>
                  <span>•</span>
                  <span className="font-mono">{act.targetDate}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    act.status === "In Progress"
                      ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300"
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {act.status}
                </span>
                <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-xs w-7 text-right">
                  {act.rpnAfter}
                </span>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-4 text-center text-muted-foreground text-xs">
              No recommended actions registered yet.
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onViewAll}
        className="w-full mt-3 py-1.5 border border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors text-[11px] font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>View Action Register</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
