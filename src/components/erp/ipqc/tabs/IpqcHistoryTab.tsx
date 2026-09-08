import React from "react";
import { History, BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export const IpqcHistoryTab: React.FC = () => {
  const historyRecords = [
    { date: "06-Sep-2026", wo: "WO-00184", op: "OP-40", qty: 80, result: "Fail", defects: 4, action: "Hold" },
    { date: "05-Sep-2026", wo: "WO-00182", op: "OP-40", qty: 100, result: "Pass", defects: 0, action: "Released" },
    { date: "03-Sep-2026", wo: "WO-00177", op: "OP-40", qty: 100, result: "Pass", defects: 2, action: "Released" },
    { date: "01-Sep-2026", wo: "WO-00171", op: "OP-40", qty: 75, result: "Conditional", defects: 3, action: "Rework" },
  ];

  return (
    <div className="space-y-4 text-xs">
      {/* Historical Runs Table */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              Material & Operation Inspection History
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="text-[10px] font-semibold text-muted-foreground uppercase border-b border-border/60">
              <tr>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Work Order</th>
                <th className="pb-2 font-medium">Operation</th>
                <th className="pb-2 font-medium text-center">Qty Inspected</th>
                <th className="pb-2 font-medium text-center">Result</th>
                <th className="pb-2 font-medium text-center">Defects</th>
                <th className="pb-2 font-medium">Disposition Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              {historyRecords.map((rec, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 text-muted-foreground">{rec.date}</td>
                  <td className="py-2.5 font-bold text-foreground">{rec.wo}</td>
                  <td className="py-2.5 text-foreground">{rec.op}</td>
                  <td className="py-2.5 text-center font-bold text-foreground">{rec.qty}</td>
                  <td className="py-2.5 text-center font-sans">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        rec.result === "Pass"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                          : rec.result === "Fail"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {rec.result}
                    </span>
                  </td>
                  <td className="py-2.5 text-center font-bold text-foreground">{rec.defects}</td>
                  <td className="py-2.5 font-sans font-medium text-muted-foreground">{rec.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 18: Aggregate Monthly KPI Summary */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-600" />
          <span>Process Quality Monthly Intelligence Dashboard (Sep 2026)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <span className="text-muted-foreground text-[11px] block">Total Process Inspections</span>
            <span className="text-lg font-bold font-mono text-foreground">428</span>
            <span className="text-emerald-600 text-[10px] font-semibold block mt-0.5">392 Passed (91.6% FPY)</span>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <span className="text-muted-foreground text-[11px] block">Inspection Compliance</span>
            <span className="text-lg font-bold font-mono text-emerald-600">96%</span>
            <span className="text-muted-foreground text-[10px] block mt-0.5">On-Time Execution</span>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <span className="text-muted-foreground text-[11px] block">Process Capability (Cpk)</span>
            <span className="text-lg font-bold font-mono text-blue-600">84%</span>
            <span className="text-muted-foreground text-[10px] block mt-0.5">Processes Capable (Cpk &gt; 1.33)</span>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <span className="text-muted-foreground text-[11px] block">Parameter Drift Alerts</span>
            <span className="text-lg font-bold font-mono text-amber-600">7</span>
            <span className="text-rose-600 text-[10px] font-semibold block mt-0.5">3 Open Critical NCRs</span>
          </div>
        </div>
      </div>
    </div>
  );
};
