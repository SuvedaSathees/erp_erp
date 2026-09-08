import React from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  PauseCircle,
  RotateCw,
  TrendingUp,
} from "lucide-react";
import type { IpqcRecord } from "@/services/ipqcTypes";

interface IpqcMetricCardsProps {
  record: IpqcRecord;
}

export const IpqcMetricCards: React.FC<IpqcMetricCardsProps> = ({ record }) => {
  const cards = [
    {
      label: "Inspections Today",
      value: record.inspectionsToday,
      subtext: "↑ +20% vs yesterday",
      subtextColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
      iconBg: "bg-blue-600 text-white",
      icon: ClipboardList,
    },
    {
      label: "Passed",
      value: record.passedCount,
      subtext: `${((record.passedCount / (record.passedCount + record.failedCount + record.onHoldCount + record.reworkCount)) * 100).toFixed(1)}%`,
      subtextColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
      iconBg: "bg-emerald-600 text-white",
      icon: CheckCircle2,
    },
    {
      label: "Failed",
      value: record.failedCount,
      subtext: `${((record.failedCount / (record.passedCount + record.failedCount + record.onHoldCount + record.reworkCount)) * 100).toFixed(1)}%`,
      subtextColor: "text-rose-600 dark:text-rose-400 font-semibold",
      iconBg: "bg-rose-600 text-white",
      icon: XCircle,
    },
    {
      label: "On Hold",
      value: record.onHoldCount,
      subtext: `${((record.onHoldCount / (record.passedCount + record.failedCount + record.onHoldCount + record.reworkCount)) * 100).toFixed(1)}%`,
      subtextColor: "text-amber-600 dark:text-amber-400 font-semibold",
      iconBg: "bg-amber-500 text-white",
      icon: PauseCircle,
    },
    {
      label: "Rework",
      value: record.reworkCount,
      subtext: `${((record.reworkCount / (record.passedCount + record.failedCount + record.onHoldCount + record.reworkCount)) * 100).toFixed(1)}%`,
      subtextColor: "text-purple-600 dark:text-purple-400 font-semibold",
      iconBg: "bg-purple-600 text-white",
      icon: RotateCw,
    },
    {
      label: "First Pass Yield",
      value: `${record.firstPassYield.toFixed(1)}%`,
      subtext: "↑ +3.2% vs last week",
      subtextColor: "text-emerald-600 dark:text-emerald-400 font-semibold",
      iconBg: "bg-teal-600 text-white",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-3.5 shadow-xs flex items-center gap-3 transition-all hover:shadow-sm"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs ${c.iconBg}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[11px] font-medium text-muted-foreground block truncate">
                {c.label}
              </span>
              <div className="text-lg font-bold text-foreground leading-tight tracking-tight">
                {c.value}
              </div>
              <span className={`text-[11px] block truncate ${c.subtextColor}`}>
                {c.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
