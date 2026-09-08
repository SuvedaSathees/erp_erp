import { ArrowUpRight } from "lucide-react";
import { FqcRecord } from "@/services/fqcTypes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FqcInspectionSummaryCardProps {
  record: FqcRecord;
}

export function FqcInspectionSummaryCard({ record }: FqcInspectionSummaryCardProps) {
  const total = record.inspectionQuantity || 50;
  const passed = record.acceptedQuantity || 0;
  const failed = record.rejectedQuantity || 0;
  const passPercent = total > 0 ? Math.round((passed / total) * 100) : 100;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (passPercent / 100) * circumference;

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border/40 min-w-0">
        <h2 className="text-sm sm:text-base font-semibold text-foreground">
          Inspection Summary
        </h2>
        <button
          type="button"
          onClick={() =>
            toast.info("Final Inspection 30-Day Yield Trend", {
              description: "Average First Pass Yield: 94.2% across 1,840 inspected lots.",
            })
          }
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer transition-colors"
        >
          View Trends
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 min-w-0">
        {/* Metrics */}
        <div className="space-y-2 flex-1 text-xs w-full min-w-0">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Inspected Quantity</span>
            <span className="font-bold text-foreground font-mono">{total} Nos</span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Passed Quantity</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {passed} Nos
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Failed / Rework Qty</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
              {failed} Nos
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Pass Percentage</span>
            <span className="font-bold text-foreground font-mono">{passPercent}%</span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-border/40">
            <span className="font-semibold text-foreground">Overall Result</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[11px] font-bold border",
                record.overallResult === "Pass"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200"
                  : record.overallResult === "Conditional Pass"
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200"
              )}
            >
              {record.overallResult}
            </span>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-rose-500 stroke-current"
              strokeWidth="11"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="text-emerald-600 stroke-current transition-all duration-700 ease-out"
              strokeWidth="11"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-xl font-bold font-mono text-foreground leading-none">
              {total}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
              Inspected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
