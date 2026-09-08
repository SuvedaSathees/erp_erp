import React from "react";
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  FlaskConical,
  TrendingUp,
} from "lucide-react";
import type { IqcRecord } from "@/services/iqcTypes";

interface IqcMetricCardsProps {
  stats: IqcRecord["stats"];
}

export const IqcMetricCards: React.FC<IqcMetricCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-full min-w-0">
      {/* 1. Total Inspections */}
      <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-blue-600 text-white shadow-xs">
          <FileText className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-muted-foreground block truncate">
            Total Inspections
          </span>
          <div className="text-lg font-bold text-foreground leading-tight truncate">
            {stats.totalInspections}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold truncate block">
            +12% vs last month
          </span>
        </div>
      </div>

      {/* 2. Pending */}
      <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-amber-500 text-white shadow-xs">
          <Clock className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-muted-foreground block truncate">
            Pending
          </span>
          <div className="text-lg font-bold text-foreground leading-tight truncate">
            {stats.pendingCount}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold truncate block">
            {((stats.pendingCount / stats.totalInspections) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 3. Passed */}
      <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-emerald-600 text-white shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-muted-foreground block truncate">
            Passed
          </span>
          <div className="text-lg font-bold text-foreground leading-tight truncate">
            {stats.passedCount}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold truncate block">
            {((stats.passedCount / stats.totalInspections) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 4. Rejected */}
      <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-rose-600 text-white shadow-xs">
          <XCircle className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-muted-foreground block truncate">
            Rejected
          </span>
          <div className="text-lg font-bold text-foreground leading-tight truncate">
            {stats.rejectedCount}
          </div>
          <span className="text-[11px] text-rose-600 font-semibold truncate block">
            {((stats.rejectedCount / stats.totalInspections) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 5. Quarantine */}
      <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-purple-600 text-white shadow-xs">
          <FlaskConical className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-muted-foreground block truncate">
            Quarantine
          </span>
          <div className="text-lg font-bold text-foreground leading-tight truncate">
            {stats.quarantineCount}
          </div>
          <span className="text-[11px] text-purple-600 font-semibold truncate block">
            {((stats.quarantineCount / stats.totalInspections) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* 6. Pass Rate */}
      <div className="bg-card border border-border rounded-xl p-3.5 shadow-xs flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-teal-600 text-white shadow-xs">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[11px] font-medium text-muted-foreground block truncate">
            Pass Rate
          </span>
          <div className="text-lg font-bold text-foreground leading-tight truncate">
            {stats.passRate}%
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold truncate block">
            +2.3% vs last month
          </span>
        </div>
      </div>
    </div>
  );
};
