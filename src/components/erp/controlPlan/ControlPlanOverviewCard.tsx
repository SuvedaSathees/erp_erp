import React from "react";
import { Layers } from "lucide-react";
import type { ControlPlanRecord } from "@/services/types";

interface ControlPlanOverviewCardProps {
  record: ControlPlanRecord;
}

export const ControlPlanOverviewCard: React.FC<ControlPlanOverviewCardProps> = ({
  record,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl shadow-xs p-4 flex flex-col justify-between text-xs">
      <div>
        <div className="flex justify-between items-center pb-2.5 border-b border-border/80 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h2 className="font-bold text-foreground text-xs">Control Plan Overview</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-xs">
          <div>
            <span className="text-muted-foreground block text-[10px]">Product Family</span>
            <span className="font-bold text-foreground truncate block">{record.productFamily}</span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px]">Production Line</span>
            <span className="font-bold text-foreground font-mono truncate block">{record.productionLine}</span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px]">Work Centre</span>
            <span className="font-bold text-foreground font-mono truncate block">{record.workCentre}</span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px]">Process Flow Ref</span>
            <span className="font-bold font-mono text-primary truncate block">{record.processFlowRef}</span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px]">Routing Ref</span>
            <span className="font-bold font-mono text-primary truncate block">{record.routingRef}</span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px]">Control Plan Type</span>
            <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 dark:bg-blue-950 text-primary dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              {record.controlPlanType}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px]">Lifecycle Stage</span>
            <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800">
              {record.lifecycleStage}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[10px]">Priority</span>
            <span className="inline-block px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              {record.priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
