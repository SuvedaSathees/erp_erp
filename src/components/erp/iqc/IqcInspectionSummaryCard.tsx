import React, { useState } from "react";
import { ArrowUpRight, TrendingUp, BarChart3, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { IqcRecord } from "@/services/iqcTypes";

interface IqcInspectionSummaryCardProps {
  record: IqcRecord;
}

export const IqcInspectionSummaryCard: React.FC<IqcInspectionSummaryCardProps> = ({
  record,
}) => {
  const [trendsOpen, setTrendsOpen] = useState(false);

  const totalInspected = record.inspectionQty || 80;
  const passed = record.acceptedQty;
  const failed = record.rejectedQty;
  const passPct = totalInspected > 0 ? ((passed / totalInspected) * 100).toFixed(1) : "0";
  const failPct = totalInspected > 0 ? ((failed / totalInspected) * 100).toFixed(1) : "0";

  // SVG Circumference = 2 * PI * 36 ≈ 226.19
  const circumference = 226.19;
  const passOffset =
    totalInspected > 0
      ? circumference - (circumference * (passed / totalInspected))
      : 0;

  return (
    <>
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 w-full max-w-full min-w-0">
        <div className="flex items-center justify-between pb-3 border-b border-border/80 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-2xs font-bold text-xs">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Lot Inspection & Yield Summary</h3>
              <p className="text-xs text-muted-foreground">Statistical sampling metrics against AQL 0.65 criteria</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Verdict:</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs ${
                  record.overallResult === "Pass"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 animate-pulse"
                }`}
              >
                {record.overallResult === "Pass" ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                )}
                <span>Lot {record.overallResult}</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setTrendsOpen(true)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold flex items-center gap-1 cursor-pointer px-2.5 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-transparent hover:border-blue-200 transition-colors"
            >
              <span>View Trends</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Responsive Body: Donut on Left, 6 KPI Stat Tiles in Grid */}
        <div className="flex flex-col lg:flex-row items-center gap-5">
          {/* Donut Chart */}
          <div className="flex flex-col items-center justify-center shrink-0 w-full sm:w-auto p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-border/70 min-w-[190px]">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className="text-rose-500/25 dark:text-rose-900/50 stroke-current"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  className="text-emerald-600 stroke-current transition-all duration-500"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={passOffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-lg font-extrabold text-foreground font-mono leading-none">
                  {totalInspected}
                </span>
                <span className="text-[10px] text-muted-foreground font-semibold mt-0.5">
                  Inspected
                </span>
              </div>
            </div>
            <div className="mt-2.5 flex items-center gap-3 text-[11px] font-semibold">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                {passed} ({passPct}%)
              </span>
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {failed} ({failPct}%)
              </span>
            </div>
          </div>

          {/* 6 KPI Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 flex-1 w-full">
            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-border/80 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Received Qty</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-extrabold text-foreground font-mono">{record.receivedQty}</span>
                <span className="text-[10px] text-muted-foreground font-semibold">Nos</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-border/80 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Inspection Qty</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-extrabold text-foreground font-mono">{record.inspectionQty}</span>
                <span className="text-[10px] text-muted-foreground font-semibold">Nos</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">Accepted Qty</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 font-mono">{record.acceptedQty}</span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">Nos</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-rose-700 dark:text-rose-400">Rejected Qty</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-extrabold text-rose-700 dark:text-rose-400 font-mono">{record.rejectedQty}</span>
                <span className="text-[10px] text-rose-600 dark:text-rose-500 font-semibold">Nos</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-border/80 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">Defect Rate</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className={`text-base font-extrabold font-mono ${record.defectRate > 0 ? "text-amber-600 dark:text-amber-400" : "text-foreground"}`}>
                  {record.defectRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/50 flex flex-col justify-between">
              <span className="text-[11px] font-medium text-blue-700 dark:text-blue-400">Quality Score</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-extrabold text-blue-700 dark:text-blue-400 font-mono">{record.qualityScore}</span>
                <span className="text-[10px] text-blue-600 dark:text-blue-500 font-semibold">/ 100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Trends Modal */}
      <Dialog open={trendsOpen} onOpenChange={setTrendsOpen}>
        <DialogContent className="max-w-xl w-full p-5 bg-card border border-border shadow-xl rounded-xl">
          <DialogHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <div>
                <DialogTitle className="text-sm font-bold text-foreground">
                  Vendor Receipt & Yield Trends (Last 30 Days)
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Supplier: {record.supplier} · Item: {record.materialItem}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-muted/30 p-2.5 rounded-lg border border-border text-center">
                <span className="text-[10px] text-muted-foreground block">30-Day Lots</span>
                <span className="text-base font-bold text-foreground font-mono">14 Lots</span>
              </div>
              <div className="bg-muted/30 p-2.5 rounded-lg border border-border text-center">
                <span className="text-[10px] text-muted-foreground block">Average Pass Rate</span>
                <span className="text-base font-bold text-emerald-600 font-mono">94.8%</span>
              </div>
              <div className="bg-muted/30 p-2.5 rounded-lg border border-border text-center">
                <span className="text-[10px] text-muted-foreground block">Rejection Rate</span>
                <span className="text-base font-bold text-rose-600 font-mono">5.2%</span>
              </div>
            </div>

            {/* Visual Lot Bar Trend */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Recent Lots Quality Score Trend</span>
                <span>Target ≥ 90 / 100</span>
              </div>
              <div className="space-y-2">
                {[
                  { lot: "LOT-09-014 (Current)", score: record.qualityScore, status: record.overallResult },
                  { lot: "LOT-09-008", score: 98, status: "Pass" },
                  { lot: "LOT-08-031", score: 96, status: "Pass" },
                  { lot: "LOT-08-024", score: 82, status: "Fail" },
                  { lot: "LOT-08-019", score: 100, status: "Pass" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[10px]">
                      <span className="font-mono text-foreground font-medium">{item.lot}</span>
                      <span
                        className={`font-mono font-bold ${
                          item.score >= 90 ? "text-emerald-600" : "text-rose-600"
                        }`}
                      >
                        {item.score}/100 ({item.status})
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.score >= 90 ? "bg-emerald-600" : "bg-rose-500"
                        }`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-2.5 text-[11px] text-blue-900 dark:text-blue-300">
              TechDrive Components Pvt. Ltd. maintained an average 94.8% pass rate over the last 30 days. Current lot current rating failure requires supplier notification.
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setTrendsOpen(false)}
              className="h-8 text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
