import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from "lucide-react";
import { ComplianceRecord } from "@/services/complianceTypes";

interface ComplianceOverviewCardProps {
  record: ComplianceRecord;
}

export function ComplianceOverviewCard({ record }: ComplianceOverviewCardProps) {
  const score = record.complianceScore; // 94%

  return (
    <Card className="shadow-xs border-border/80">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Compliance Score & Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Score Ring / Radial Display */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-200/60 dark:border-emerald-800/40">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Overall Compliance Index
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {score}%
              </span>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +2.4%
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Target threshold: 90% (Audit Ready)
            </p>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-16 h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                className="text-muted/40 stroke-current"
                strokeWidth="5"
                fill="transparent"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                className="text-emerald-600 stroke-current"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - score / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <ShieldCheck className="w-6 h-6 text-emerald-600 absolute" />
          </div>
        </div>

        {/* 3 Status Counters */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block">
              Compliant
            </span>
            <span className="text-lg font-bold text-emerald-700 dark:text-emerald-300 font-mono">
              45
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium block">
              Minor Gaps
            </span>
            <span className="text-lg font-bold text-amber-700 dark:text-amber-300 font-mono">
              3
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40">
            <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium block">
              Major Gaps
            </span>
            <span className="text-lg font-bold text-rose-700 dark:text-rose-300 font-mono">
              0
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
