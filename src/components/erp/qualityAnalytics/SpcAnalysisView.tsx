import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, CheckCircle2, AlertTriangle, TrendingUp, Info } from "lucide-react";
import { SpcParameterItem } from "@/services/qualityAnalyticsTypes";
import { toast } from "sonner";

interface SpcAnalysisViewProps {
  parameters: SpcParameterItem[];
}

export function SpcAnalysisView({ parameters }: SpcAnalysisViewProps) {
  return (
    <Card className="shadow-xs border-border/80 overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
          <Gauge className="h-4 w-4 text-primary shrink-0" />
          <span>Statistical Process Control (SPC) & Process Capability (Cp / Cpk)</span>
        </CardTitle>
        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          Benchmark: Cpk ≥ 1.33 (Capable)
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-xs text-left min-w-[700px]">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold text-[11px]">
              <tr>
                <th className="py-2.5 px-4">Parameter & Spec</th>
                <th className="py-2.5 px-3 text-right">LCL</th>
                <th className="py-2.5 px-3 text-right">Target Mean</th>
                <th className="py-2.5 px-3 text-right">UCL</th>
                <th className="py-2.5 px-3 text-right">Cp</th>
                <th className="py-2.5 px-3 text-right">Cpk</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-4 text-center">Trend Sparkline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 font-mono text-xs">
              {parameters.map((p, idx) => {
                const isStable = p.status === "Stable";
                return (
                  <tr
                    key={idx}
                    onClick={() => toast.info(`Parameter "${p.parameter}": Cp=${p.cp.toFixed(2)}, Cpk=${p.cpk.toFixed(2)} (${p.status})`)}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                  >
                    <td className="py-2.5 px-4 font-sans font-semibold text-foreground">
                      {p.parameter}
                    </td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground">
                      {p.lcl.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground">
                      {p.mean.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-muted-foreground">
                      {p.ucl.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-blue-600 dark:text-blue-400">
                      {p.cp.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-foreground">
                      {p.cpk.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <Badge
                        className={
                          isStable
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200"
                        }
                      >
                        {isStable ? (
                          <CheckCircle2 className="w-2.5 h-2.5 mr-1 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-2.5 h-2.5 mr-1 shrink-0" />
                        )}
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4">
                      {/* Mini SVG Sparkline */}
                      <div className="w-28 h-5 mx-auto flex items-center">
                        <svg className="w-full h-full" viewBox="0 0 100 20">
                          <line
                            x1="0"
                            y1="10"
                            x2="100"
                            y2="10"
                            stroke="currentColor"
                            className="text-border/80"
                            strokeDasharray="2 2"
                            strokeWidth="1"
                          />
                          <polyline
                            fill="none"
                            stroke={isStable ? "#10B981" : "#F59E0B"}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={
                              idx === 0
                                ? "0,12 15,8 30,11 45,9 60,13 75,7 90,10 100,9"
                                : idx === 1
                                ? "0,11 15,10 30,8 45,12 60,9 75,11 90,10 100,10"
                                : "0,7 15,14 30,6 45,16 60,5 75,17 90,14 100,18"
                            }
                          />
                        </svg>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default SpcAnalysisView;
