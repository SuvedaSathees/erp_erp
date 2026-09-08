import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grid3X3, ShieldAlert, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export function ComplianceRiskMatrixCard() {
  // 3x3 matrix: rows = Likelihood (High, Med, Low), cols = Impact (Low, Med, High)
  const matrixData = [
    {
      row: "High",
      cols: [
        { count: 2, level: "med", label: "High Likelihood / Low Impact" },
        { count: 3, level: "high", label: "High Likelihood / Med Impact" },
        { count: 1, level: "critical", highlight: true, label: "High Likelihood / High Impact (Clause 8.5.1c)" },
      ],
    },
    {
      row: "Med",
      cols: [
        { count: 8, level: "low", label: "Med Likelihood / Low Impact" },
        { count: 14, level: "med", label: "Med Likelihood / Med Impact" },
        { count: 4, level: "high", label: "Med Likelihood / High Impact" },
      ],
    },
    {
      row: "Low",
      cols: [
        { count: 11, level: "low", label: "Low Likelihood / Low Impact" },
        { count: 5, level: "low", label: "Low Likelihood / Med Impact" },
        { count: 1, level: "med", label: "Low Likelihood / High Impact" },
      ],
    },
  ];

  const [selectedCell, setSelectedCell] = useState<{
    count: number;
    level: string;
    label: string;
  } | null>({
    count: 1,
    level: "critical",
    label: "High Likelihood / High Impact (Clause 8.5.1c)",
  });

  return (
    <Card className="shadow-xs border-border/80 overflow-hidden min-w-0">
      <CardHeader className="py-3 px-4 border-b border-border/60 flex flex-row items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Grid3X3 className="h-4 w-4 text-primary shrink-0" />
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              Compliance Risk Matrix (3×3) & Control Analysis
            </CardTitle>
            <span className="text-[11px] text-muted-foreground block">
              Likelihood vs Impact classification with mitigating safeguards
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
            Residual Risk: 14.2 (Low)
          </Badge>
          <Badge variant="outline" className="text-[10px] font-semibold bg-blue-500/10 text-blue-600 border-blue-500/30">
            Control Effectiveness: 92.4%
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          {/* Left Column: 3x3 Heatmap Matrix (5 cols) */}
          <div className="md:col-span-5 space-y-2.5">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground font-semibold px-1">
              <span>Likelihood ↓ / Impact →</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-emerald-500 inline-block" /> Low
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-amber-500 inline-block" /> Med
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-xs bg-rose-500 inline-block" /> High
                </span>
              </div>
            </div>

            <div className="grid grid-rows-3 gap-1.5 text-xs font-mono">
              {matrixData.map((r, rIdx) => (
                <div key={rIdx} className="grid grid-cols-3 gap-1.5 h-11">
                  {r.cols.map((c, cIdx) => {
                    const isSelected = selectedCell?.label === c.label;
                    return (
                      <button
                        key={cIdx}
                        type="button"
                        onClick={() => setSelectedCell(c)}
                        className={`rounded-lg flex flex-col items-center justify-center font-bold transition-all cursor-pointer select-none ${
                          isSelected ? "ring-2 ring-primary ring-offset-1 scale-[1.02] shadow-sm" : "hover:scale-[1.01]"
                        } ${
                          c.level === "critical"
                            ? "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-2 border-rose-500 shadow-xs"
                            : c.level === "high"
                            ? "bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-300 dark:border-orange-800"
                            : c.level === "med"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                            : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                        }`}
                        title={`${r.row} Likelihood • ${c.count} Requirements`}
                      >
                        <span className="text-sm">{c.count}</span>
                        <span className="text-[9px] font-normal uppercase opacity-75">{c.level}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="p-2 rounded-lg bg-muted/40 border border-border/60 text-[11px] text-muted-foreground text-center">
              Selected: <strong className="text-foreground">{selectedCell?.label || "None"}</strong>
            </div>
          </div>

          {/* Right Column: Risk Safeguards & Critical Requirements (7 cols) */}
          <div className="md:col-span-7 space-y-3 border-t md:border-t-0 md:border-l border-border/60 pt-3 md:pt-0 md:pl-4">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
              Critical Risk Item & Mitigating Controls
            </span>

            {/* Critical Clause Card */}
            <div className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  Clause 8.5.1 (c) Special Process Thermal Profile
                </span>
                <Badge className="bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30 text-[9px] font-bold">
                  Critical
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Wave-soldering peak temperature excursion risk during multi-layer PCB production.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-foreground">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Safeguard Control:</span>
                <span>Automated dual-sensor thermocouple interlock with MES station stop.</span>
              </div>
            </div>

            {/* Breakdown Mini Cards */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-lg border border-border/60 bg-muted/30">
                <span className="text-[10px] text-muted-foreground block">Critical Zone</span>
                <span className="font-bold text-rose-600 font-mono text-base">1 Req</span>
                <span className="text-[9px] text-muted-foreground block">Immediate Interlock</span>
              </div>
              <div className="p-2 rounded-lg border border-border/60 bg-muted/30">
                <span className="text-[10px] text-muted-foreground block">High Zone</span>
                <span className="font-bold text-orange-600 font-mono text-base">7 Reqs</span>
                <span className="text-[9px] text-muted-foreground block">Daily Verification</span>
              </div>
              <div className="p-2 rounded-lg border border-border/60 bg-muted/30">
                <span className="text-[10px] text-muted-foreground block">Medium / Low</span>
                <span className="font-bold text-emerald-600 font-mono text-base">41 Reqs</span>
                <span className="text-[9px] text-muted-foreground block">Routine SOP Checks</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ComplianceRiskMatrixCard;
