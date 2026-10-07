import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import type { CapacityFormInput } from "@/services/types";

export function BottleneckAnalysisSection({
  form,
}: {
  form: UseFormReturn<CapacityFormInput>;
}) {
  const { watch } = form;

  const bottleneckScore = watch("bottleneckScore") ?? 85;
  const bottlenecks = watch("bottlenecks") || [];

  return (
    <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Bottleneck Identification & Root Cause Analysis
          </CardTitle>
          <CardDescription className="text-xs">
            Capacity constraints, machine cycle time bottlenecks, root causes & estimated capacity gain.
          </CardDescription>
        </div>

        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-2">
          <div>
            <span className="text-[10px] font-semibold uppercase text-primary dark:text-blue-400 block tracking-wider">
              Resolution Score
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-primary dark:text-blue-300 font-mono">
                {bottleneckScore}
              </span>
              <span className="text-xs text-blue-600 font-semibold">/100</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-lg border border-border/80 overflow-hidden bg-background text-xs shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Workstation</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Equipment / Process</th>
                  <th className="py-3 px-4 font-semibold whitespace-nowrap">Constraint</th>
                  <th className="py-3 px-4 font-semibold">Root Cause & Action</th>
                  <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Estimated Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {bottlenecks.map((btn) => (
                  <tr key={btn.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-primary font-mono whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        {btn.workstation}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                      {btn.equipment}
                    </td>

                    <td className="py-3 px-4 font-medium whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={
                          btn.impact === "High"
                            ? "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 text-[10px] font-semibold"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 text-[10px] font-semibold"
                        }
                      >
                        {btn.constraint}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-[11px] text-muted-foreground">
                      <p className="text-foreground font-medium">{btn.rootCause}</p>
                      <p className="text-primary text-[10px] italic mt-0.5">Action: {btn.improvementActions}</p>
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400 font-mono whitespace-nowrap">
                      {btn.estimatedGain}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
