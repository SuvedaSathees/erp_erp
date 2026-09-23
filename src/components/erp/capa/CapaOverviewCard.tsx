import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, ShieldCheck, ArrowDownRight, RefreshCw, FileCheck, FileText } from "lucide-react";
import { CapaRecord } from "@/services/capaTypes";

interface CapaOverviewCardProps {
  record: CapaRecord;
  onSubmitForVerification?: () => void;
  onVerifyEffectiveness?: () => void;
  onPrint?: () => void;
}

export function CapaOverviewCard({
  record,
  onSubmitForVerification,
  onVerifyEffectiveness,
  onPrint,
}: CapaOverviewCardProps) {
  const completedActions = record.actions.filter(
    (a) => a.status === "Completed" || a.status === "Verified"
  ).length;
  const totalActions = record.actions.length;
  const progressPercent = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  return (
    <Card className="shadow-xs border-border/80 min-w-0">
      <CardHeader className="pb-3 border-b border-border/60">
        <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <RefreshCw className="w-4 h-4 text-primary" />
            CAPA Progress & Milestones
          </span>
          <Badge
            className={
              record.status === "Closed"
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px]"
                : "bg-blue-50 text-primary dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px]"
            }
          >
            {record.status}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-4 space-y-4 text-xs min-w-0">
        {/* Progress Bar & Counter */}
        <div className="p-3 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 min-w-0">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Action Implementation</span>
            <span className="font-mono font-bold text-primary dark:text-blue-400">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full bg-blue-200/50 dark:bg-blue-900/40 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] text-muted-foreground mt-2 block">
            {completedActions} of {totalActions} Action Items Completed & Verified
          </span>
        </div>

        {/* 3 Metric Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs min-w-0">
          <div className="p-2 rounded-lg bg-muted/40 border border-border/60 min-w-0">
            <span className="text-[10px] text-muted-foreground font-medium block">Initial RPN</span>
            <span className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">
              {record.initialRpn}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 min-w-0">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium block">Target RPN</span>
            <span className="text-base font-bold text-emerald-700 dark:text-emerald-300 font-mono">
              {record.residualRpn}
            </span>
          </div>

          <div className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 min-w-0">
            <span className="text-[10px] text-primary dark:text-blue-400 font-medium block">Mitigation</span>
            <span className="text-base font-bold text-primary dark:text-blue-300 font-mono">
              -{record.rpnReductionPercent}%
            </span>
          </div>
        </div>

        {/* Quick Lifecycle Action Buttons */}
        <div className="space-y-2 pt-1 border-t border-border/50">
          <Button
            size="sm"
            onClick={onSubmitForVerification}
            className="w-full h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white cursor-pointer"
          >
            <FileCheck className="w-3.5 h-3.5 mr-1.5" />
            Submit for Verification
          </Button>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onVerifyEffectiveness}
              className="flex-1 h-8 text-xs font-medium text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 cursor-pointer"
            >
              <ShieldCheck className="w-3 h-3 mr-1" />
              Sign Off (VoE)
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onPrint}
              className="flex-1 h-8 text-xs font-medium border-border hover:bg-muted/40 cursor-pointer"
            >
              <FileText className="w-3 h-3 mr-1" />
              Print 8D
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
