import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, CheckCircle2, AlertTriangle, XCircle, ArrowUpRight } from "lucide-react";
import { AuditRecord } from "@/services/auditTypes";

interface AuditSummaryCardProps {
  record: AuditRecord;
}

export function AuditSummaryCard({ record }: AuditSummaryCardProps) {
  const rate = record.conformanceRate;

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <Award className="h-4 w-4 text-primary" />
          Audit Performance Score
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {/* Score Ring */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-200/60 dark:border-blue-800/40">
          <div>
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
              Audit Conformance Index
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
                {rate}%
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +3.5%
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Benchmark Target: &gt;85.0%
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
                className="text-blue-600 stroke-current"
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 26}
                strokeDashoffset={2 * Math.PI * 26 * (1 - rate / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <Award className="w-6 h-6 text-blue-600 absolute" />
          </div>
        </div>

        {/* 4 Status Counters */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-muted/40 border border-border/60">
            <span className="text-[10px] text-muted-foreground font-medium block">Total</span>
            <span className="text-base font-bold text-foreground font-mono">{record.totalItems}</span>
          </div>

          <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block">Conform</span>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-300 font-mono">
              {record.compliantCount}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40">
            <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium block">Minor NC</span>
            <span className="text-base font-bold text-amber-700 dark:text-amber-300 font-mono">
              {record.minorNcCount}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40">
            <span className="text-[10px] text-rose-700 dark:text-rose-400 font-medium block">Major NC</span>
            <span className="text-base font-bold text-rose-700 dark:text-rose-300 font-mono">
              {record.majorNcCount}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
