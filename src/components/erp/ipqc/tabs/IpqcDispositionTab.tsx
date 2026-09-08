import React from "react";
import { PauseCircle, ArrowRight, CheckCircle2, RotateCcw, AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { IpqcWipHold } from "@/services/ipqcTypes";

interface IpqcDispositionTabProps {
  wipHold: IpqcWipHold;
  onUpdateHold: (updates: Partial<IpqcWipHold>) => void;
}

export const IpqcDispositionTab: React.FC<IpqcDispositionTabProps> = ({
  wipHold,
  onUpdateHold,
}) => {
  return (
    <div className="space-y-4">
      {/* Section 11: WIP Hold & Quarantine Card */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <PauseCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-foreground tracking-tight">
              WIP Hold & Quarantine Management
            </h3>
          </div>
          <Badge
            variant="outline"
            className="bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold"
          >
            {wipHold.status}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-muted-foreground text-[11px]">Hold ID</span>
            <span className="font-mono font-bold text-foreground block">{wipHold.holdId}</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-[11px]">Material</span>
            <span className="font-semibold text-foreground block">{wipHold.material}</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-[11px]">Work Order & Op</span>
            <span className="font-mono text-foreground block">{wipHold.workOrder} • {wipHold.operation}</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-[11px]">Quarantine Qty</span>
            <span className="font-mono font-extrabold text-rose-600 block">{wipHold.holdQty} Nos</span>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <span className="text-muted-foreground text-[11px]">Containment Reason</span>
            <span className="text-foreground block">{wipHold.holdReason}</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-[11px]">Warehouse Location / Bin</span>
            <span className="font-mono text-foreground block">{wipHold.holdLocation} [{wipHold.binLocation}]</span>
          </div>
          <div className="space-y-1">
            <span className="text-muted-foreground text-[11px]">Linked NCR</span>
            <span className="font-mono font-bold text-blue-600 block">{wipHold.ncrNumber}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-border flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => onUpdateHold({ status: "Released" })}
            className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            <span>Release WIP to Next Operation</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateHold({ status: "Reworked" })}
            className="h-8 text-xs font-semibold border-amber-300 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Route to Rework Station</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateHold({ status: "Scrapped" })}
            className="h-8 text-xs font-semibold border-rose-300 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" />
            <span>Scrap Affected WIP</span>
          </Button>
        </div>
      </div>

      {/* Section 14: Process Release Matrix */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-3 text-xs">
        <h3 className="text-sm font-bold text-foreground tracking-tight">
          Process Disposition Matrix & Next Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block">Pass Decision</span>
            <p className="text-muted-foreground text-[11px]">
              Releases conforming parts to next operation sequence (OP-40 Pneumatic Testing) with auto-lot tracking.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
            <span className="font-bold text-amber-800 dark:text-amber-300 block">Conditional Release</span>
            <p className="text-muted-foreground text-[11px]">
              Requires Quality Engineering authorized deviation approval with containment sign-off.
            </p>
          </div>
          <div className="p-3 rounded-lg border border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20 space-y-1">
            <span className="font-bold text-rose-800 dark:text-rose-300 block">Hold & Quarantine</span>
            <p className="text-muted-foreground text-[11px]">
              Material quarantined in segregated WIP hold bin until root cause analysis and CAPA validation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
