import React from "react";
import { Layers, Calendar, Target, ShieldCheck, Flag } from "lucide-react";
import type { ApqpRecord } from "@/services/types";

interface ApqpProjectOverviewCardProps {
  record: ApqpRecord;
}

export const ApqpProjectOverviewCard: React.FC<ApqpProjectOverviewCardProps> = ({
  record,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-4 sm:p-5 text-xs w-full min-w-0 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-foreground text-sm">Project Overview & Program Scope</h2>
            <p className="text-[11px] text-muted-foreground">
              Program ID: <span className="font-mono font-bold text-foreground">{record.apqpId}</span> · Customer: <span className="font-semibold text-foreground">{record.customer}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-xs border border-blue-200 dark:border-blue-800">
            {record.programStatus}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200 dark:border-amber-800 flex items-center gap-1">
            <Flag className="w-3 h-3" />
            <span>{record.priority} Priority</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50 space-y-1">
          <span className="text-muted-foreground text-[11px] block">Product Family</span>
          <span className="font-bold text-foreground block truncate">{record.productFamily}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50 space-y-1">
          <span className="text-muted-foreground text-[11px] block">Product Model / SKU</span>
          <span className="font-mono font-bold text-foreground block truncate">{record.productModel}</span>
        </div>

        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50 space-y-1">
          <span className="text-muted-foreground text-[11px] block">Target SOP Date</span>
          <div className="flex items-center gap-1.5 font-bold text-foreground font-mono">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>{record.targetSopDate}</span>
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-muted/20 border border-border/50 space-y-1">
          <span className="text-muted-foreground text-[11px] block">Overall APQP Score</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-extrabold text-blue-600 font-mono">
              {record.overallApqpScore}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">/ 100 Points</span>
          </div>
        </div>
      </div>

      {/* Scope and Customer requirements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        <div className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Program Scope & Technical Definition</span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {record.projectScope}
          </p>
        </div>

        <div className="p-3 rounded-lg bg-muted/30 border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-foreground font-bold text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customer Technical Requirements</span>
          </div>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            {record.customerRequirements}
          </p>
        </div>
      </div>
    </div>
  );
};
