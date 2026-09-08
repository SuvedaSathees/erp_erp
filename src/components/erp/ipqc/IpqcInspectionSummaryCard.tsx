import React, { useState } from "react";
import { ArrowUpRight, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IpqcRecord } from "@/services/ipqcTypes";

interface IpqcInspectionSummaryCardProps {
  record: IpqcRecord;
  onViewTrends?: () => void;
}

export const IpqcInspectionSummaryCard: React.FC<IpqcInspectionSummaryCardProps> = ({
  record,
  onViewTrends,
}) => {
  const [isTrendsOpen, setIsTrendsOpen] = useState(false);
  const total = record.inspectionQuantity || 5;
  const passed = record.acceptedQuantity ?? 5;
  const failed = record.rejectedQuantity ?? 0;
  const passPercent = total > 0 ? Math.round((passed / total) * 100) : 100;

  // SVG circle calculation
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (passPercent / 100) * circumference;

  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
      <div className="flex items-center justify-between pb-2 border-b border-border/40 min-w-0">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          Inspection Summary
        </h3>
        <button
          type="button"
          onClick={() => {
            if (onViewTrends) onViewTrends();
            setIsTrendsOpen(true);
          }}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-0.5 cursor-pointer transition-colors shrink-0"
        >
          <span>View Trends</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 min-w-0">
        {/* Left Metrics */}
        <div className="space-y-2 flex-1 text-xs w-full min-w-0">
          <div className="flex justify-between items-center text-muted-foreground">
            <span>Inspection Quantity</span>
            <span className="font-bold text-foreground font-mono">{record.inspectionQuantity} Nos</span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Accepted Quantity</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {record.acceptedQuantity} Nos
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Rejected Quantity</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
              {record.rejectedQuantity} Nos
            </span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Defect Rate</span>
            <span className="font-bold text-foreground font-mono">{record.defectRate.toFixed(1)}%</span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>Process Capability (Cpk)</span>
            <span className="font-bold text-blue-600 font-mono">{record.processCapabilityCpk.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-muted-foreground">
            <span>First Pass Yield</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {record.firstPassYield.toFixed(1)}%
            </span>
          </div>

          <div className="flex justify-between items-center pt-1 border-t border-border/40">
            <span className="font-semibold text-foreground">Overall Result</span>
            <span
              className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                record.overallResult === "Pass"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200"
                  : record.overallResult === "Fail"
                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200"
              }`}
            >
              {record.overallResult}
            </span>
          </div>
        </div>

        {/* Right Donut Chart */}
        <div className="flex flex-col items-center shrink-0">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-muted/40 stroke-current"
                strokeWidth="10"
                fill="transparent"
              />
              {/* Red segment if any failed */}
              {failed > 0 && (
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  className="text-rose-600 stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={0}
                />
              )}
              {/* Green segment */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-emerald-600 stroke-current transition-all duration-700 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={failed > 0 ? strokeDashoffset : 0}
                strokeLinecap="round"
              />
            </svg>

            {/* Center text */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-foreground leading-none font-mono">
                {total}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                Inspected
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-3 space-y-1 text-[11px] w-full">
            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-muted-foreground">Passed</span>
              </div>
              <span className="font-bold font-mono text-foreground">{passed} ({passPercent}%)</span>
            </div>

            <div className="flex items-center gap-2 justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-600" />
                <span className="text-muted-foreground">Failed</span>
              </div>
              <span className="font-bold font-mono text-foreground">{failed} ({100 - passPercent}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Yield Trends Modal */}
      <Dialog open={isTrendsOpen} onOpenChange={setIsTrendsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  In-Process Quality Yield Trends
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  30-Day First Pass Yield (FPY) and process capability monitoring.
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-muted/40 rounded-lg border border-border/70 text-center">
                <span className="text-[10px] text-muted-foreground block">30-Day FPY</span>
                <span className="text-base font-bold font-mono text-emerald-600">95.4%</span>
              </div>
              <div className="p-2.5 bg-muted/40 rounded-lg border border-border/70 text-center">
                <span className="text-[10px] text-muted-foreground block">Average Cpk</span>
                <span className="text-base font-bold font-mono text-blue-600">1.68</span>
              </div>
              <div className="p-2.5 bg-muted/40 rounded-lg border border-border/70 text-center">
                <span className="text-[10px] text-muted-foreground block">Total Lots</span>
                <span className="text-base font-bold font-mono text-foreground">1,240</span>
              </div>
            </div>

            {/* Sparkline Bar Visualization */}
            <div className="space-y-1.5">
              <span className="font-semibold text-foreground text-xs block">
                Shift-wise Yield Comparison (Last 7 Days):
              </span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Shift A (Morning)</span>
                    <span className="font-bold font-mono text-emerald-600">96.8% (Target: &gt;95%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "96.8%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Shift B (Evening)</span>
                    <span className="font-bold font-mono text-emerald-600">95.0%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "95%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Shift C (Night)</span>
                    <span className="font-bold font-mono text-amber-500">93.2% (Under Target)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "93.2%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              size="sm"
              onClick={() => setIsTrendsOpen(false)}
              className="text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white font-semibold"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
