import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Activity, Percent, ArrowUpRight, ShieldCheck, Zap } from "lucide-react";
import { CopqComponentItem } from "@/services/qualityAnalyticsTypes";

interface KpiDashboardViewProps {
  copq: CopqComponentItem[];
}

export function KpiDashboardView({ copq }: KpiDashboardViewProps) {
  const totalCopq = copq.reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="space-y-4 min-w-0">
      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
        <Card className="shadow-xs border-border/80 min-w-0">
          <CardContent className="p-3.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] text-muted-foreground font-medium block truncate">
                Rolled Throughput Yield (RTY)
              </span>
              <div className="text-xl font-bold font-mono text-foreground mt-0.5">
                89.6%
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center mt-0.5">
                <ArrowUpRight className="w-3 h-3 shrink-0" /> +1.4% vs last Qtr
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80 min-w-0">
          <CardContent className="p-3.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] text-muted-foreground font-medium block truncate">
                Defects per Million (DPMO)
              </span>
              <div className="text-xl font-bold font-mono text-foreground mt-0.5">
                2,800
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center mt-0.5">
                Target: &lt; 3,000 DPMO
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center text-primary shrink-0">
              <Activity className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80 min-w-0">
          <CardContent className="p-3.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] text-muted-foreground font-medium block truncate">
                Cost of Poor Quality (COPQ)
              </span>
              <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
                ₹15.10 L
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block font-medium truncate">
                1.4% of Total Revenue
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/80 min-w-0">
          <CardContent className="p-3.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[11px] text-muted-foreground font-medium block truncate">
                Calibration Compliance
              </span>
              <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                96.2%
              </div>
              <span className="text-[10px] text-muted-foreground mt-0.5 block font-medium truncate">
                151 / 184 Valid Tools
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* COPQ Breakdown Table Card */}
      <Card className="shadow-xs border-border/80 overflow-hidden min-w-0">
        <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-rose-600" />
            <span>Cost of Poor Quality (COPQ) Breakdown</span>
          </CardTitle>
          <div className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
            Total COPQ: ₹{(totalCopq / 100000).toFixed(2)} Lakhs (₹{totalCopq.toLocaleString("en-IN")})
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-xs text-left min-w-[550px]">
              <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Cost Element</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-4 text-right">Amount (INR)</th>
                  <th className="py-2.5 px-4 text-right">% Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono text-xs">
                {copq.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-4 font-sans font-semibold text-foreground">
                      {item.category || item.element}
                    </td>
                    <td className="py-2.5 px-3 font-sans">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.classification === "Internal Failure"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                            : item.classification === "External Failure"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
                        }`}
                      >
                        {item.classification}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-foreground">
                      ₹{item.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-2.5 px-4 text-right font-semibold text-muted-foreground">
                      {item.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default KpiDashboardView;
