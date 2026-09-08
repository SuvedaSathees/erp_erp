import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Award,
  TrendingUp,
} from "lucide-react";
import { FqcRecord } from "@/services/fqcTypes";

interface FqcMetricCardsProps {
  record: FqcRecord;
}

export function FqcMetricCards({ record }: FqcMetricCardsProps) {
  const { dailyStats } = record;

  const cards = [
    {
      title: "Inspections Today",
      value: dailyStats.inspectionsToday,
      unit: "Lots",
      icon: ClipboardCheck,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-100 dark:border-blue-900/50",
    },
    {
      title: "Passed",
      value: dailyStats.passed,
      unit: "Lots",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-900/50",
    },
    {
      title: "Failed",
      value: dailyStats.failed,
      unit: "Lots",
      icon: XCircle,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-100 dark:border-rose-900/50",
    },
    {
      title: "On Hold",
      value: dailyStats.onHold,
      unit: "Lots",
      icon: PauseCircle,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-100 dark:border-amber-900/50",
    },
    {
      title: "Certificates Issued",
      value: dailyStats.certificatesIssued,
      unit: "COCs",
      icon: Award,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-100 dark:border-purple-900/50",
    },
    {
      title: "First Pass Yield",
      value: `${dailyStats.firstPassYield}%`,
      unit: "Target >90%",
      icon: TrendingUp,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-900/50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 min-w-0">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-card rounded-xl border border-border/80 p-3 shadow-xs flex items-center justify-between hover:shadow-sm transition-all min-w-0"
          >
            <div className="space-y-1 min-w-0 pr-1">
              <span className="text-[11px] font-medium text-muted-foreground block truncate">
                {card.title}
              </span>
              <div className="flex items-baseline gap-1 min-w-0">
                <span className="text-base sm:text-lg font-bold font-mono text-foreground tracking-tight truncate">
                  {card.value}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium shrink-0">
                  {card.unit}
                </span>
              </div>
            </div>

            <div
              className={`w-8 h-8 rounded-lg ${card.bg} ${card.color} flex items-center justify-center shrink-0`}
            >
              <Icon className="h-4 w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
