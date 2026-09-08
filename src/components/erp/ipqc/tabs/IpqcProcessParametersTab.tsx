import React from "react";
import { Gauge, AlertTriangle, CheckCircle2, Sliders } from "lucide-react";
import type { IpqcProcessParameter } from "@/services/ipqcTypes";

interface IpqcProcessParametersTabProps {
  parameters: IpqcProcessParameter[];
}

export const IpqcProcessParametersTab: React.FC<IpqcProcessParametersTabProps> = ({ parameters }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Process Parameter Monitoring & Machine Interlocks</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time telemetry and manual inspection parameter verification against control plan limits.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-[11px] font-semibold text-muted-foreground uppercase border-b border-border/60">
            <tr>
              <th className="pb-2.5 px-3">Parameter</th>
              <th className="pb-2.5 px-3">Specification</th>
              <th className="pb-2.5 px-3 text-center">Lower Limit</th>
              <th className="pb-2.5 px-3 text-center">Target</th>
              <th className="pb-2.5 px-3 text-center">Upper Limit</th>
              <th className="pb-2.5 px-3 text-center">Actual</th>
              <th className="pb-2.5 px-3 text-center">Unit</th>
              <th className="pb-2.5 px-3 text-center">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono">
            {parameters.map((param) => (
              <tr key={param.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-3 px-3 font-sans font-bold text-foreground">
                  {param.parameter}
                </td>
                <td className="py-3 px-3 text-muted-foreground">
                  {param.specification}
                </td>
                <td className="py-3 px-3 text-center text-muted-foreground">
                  {param.lowerLimit}
                </td>
                <td className="py-3 px-3 text-center font-bold text-blue-600">
                  {param.target}
                </td>
                <td className="py-3 px-3 text-center text-muted-foreground">
                  {param.upperLimit}
                </td>
                <td className="py-3 px-3 text-center font-bold text-foreground">
                  {param.actual}
                </td>
                <td className="py-3 px-3 text-center text-muted-foreground">
                  {param.unit}
                </td>
                <td className="py-3 px-3 text-center font-sans">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      param.result === "Pass"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                        : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 animate-pulse"
                    }`}
                  >
                    {param.result === "Pass" ? (
                      <CheckCircle2 className="w-3 h-3" />
                    ) : (
                      <AlertTriangle className="w-3 h-3" />
                    )}
                    <span>{param.result}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
