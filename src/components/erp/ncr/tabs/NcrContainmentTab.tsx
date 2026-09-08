import { ShieldAlert, GitCommit, CheckCircle2, Lock, ArrowRight } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { NcrRecord } from "@/services/ncrTypes";

interface NcrContainmentTabProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrContainmentTab({ record, onChange }: NcrContainmentTabProps) {
  return (
    <div className="space-y-5">
      {/* Top Containment Parameters Card */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 5: Immediate Containment Protocol
              </h3>
              <p className="text-xs text-muted-foreground">
                Prevents further use, processing, or dispatch of potentially non-conforming lots.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Status: {record.containmentStatus}
          </span>
        </div>

        {/* Hold Tags Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/30 p-3 rounded-lg border border-border/60">
          <label className="flex items-center gap-2 p-2 rounded-md bg-card border border-border/70 cursor-pointer">
            <Checkbox
              checked={record.materialHold}
              onCheckedChange={(c) => onChange({ materialHold: !!c })}
              className="data-[state=checked]:bg-blue-600"
            />
            <div>
              <span className="text-xs font-semibold block">Material Hold</span>
              <span className="text-[10px] text-muted-foreground">Raw/Component stock</span>
            </div>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-md bg-card border border-border/70 cursor-pointer">
            <Checkbox
              checked={record.wipHold}
              onCheckedChange={(c) => onChange({ wipHold: !!c })}
              className="data-[state=checked]:bg-blue-600"
            />
            <div>
              <span className="text-xs font-semibold block">WIP Hold</span>
              <span className="text-[10px] text-muted-foreground">In-line work orders</span>
            </div>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-md bg-card border border-border/70 cursor-pointer">
            <Checkbox
              checked={record.finishedGoodsHold}
              onCheckedChange={(c) => onChange({ finishedGoodsHold: !!c })}
              className="data-[state=checked]:bg-blue-600"
            />
            <div>
              <span className="text-xs font-semibold block">Finished Goods Hold</span>
              <span className="text-[10px] text-muted-foreground">Warehouse FG stock</span>
            </div>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-md bg-card border border-border/70 cursor-pointer">
            <Checkbox
              checked={record.shipmentHold}
              onCheckedChange={(c) => onChange({ shipmentHold: !!c })}
              className="data-[state=checked]:bg-blue-600"
            />
            <div>
              <span className="text-xs font-semibold block">Shipment Hold</span>
              <span className="text-[10px] text-muted-foreground">Stop dispatch/in-transit</span>
            </div>
          </label>
        </div>

        {/* Quantities & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Affected Quantity</Label>
            <Input
              type="number"
              value={record.affectedQuantity}
              onChange={(e) => onChange({ affectedQuantity: Number(e.target.value) })}
              className="h-9 text-xs font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Confirmed Defect Qty</Label>
            <Input
              type="number"
              value={record.confirmedDefectQuantity}
              onChange={(e) => onChange({ confirmedDefectQuantity: Number(e.target.value) })}
              className="h-9 text-xs font-mono font-bold text-rose-600"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Suspect Quantity</Label>
            <Input
              type="number"
              value={record.suspectQuantity}
              onChange={(e) => onChange({ suspectQuantity: Number(e.target.value) })}
              className="h-9 text-xs font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Quarantine Location</Label>
            <Input
              value={record.quarantineLocation}
              onChange={(e) => onChange({ quarantineLocation: e.target.value })}
              className="h-9 text-xs font-mono"
            />
          </div>
        </div>

        {/* Action text */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-medium">
            Immediate Containment Action Description
          </Label>
          <Textarea
            rows={2}
            value={record.containmentAction}
            onChange={(e) => onChange({ containmentAction: e.target.value })}
            className="text-xs"
          />
        </div>
      </div>

      {/* Section 6: Affected Material Traceability Flow Tree */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-foreground mb-1 flex items-center gap-2">
          <GitCommit className="h-4 w-4 text-blue-600" />
          Section 6: Affected Material Traceability Tree
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Upstream lot identification and downstream finished-goods containment hierarchy.
        </p>

        <div className="p-4 bg-muted/20 border border-border/60 rounded-xl">
          {/* Level 1: NCR Root */}
          <div className="flex justify-center mb-3">
            <div className="bg-blue-600 text-white px-4 py-1.5 rounded-md font-mono text-xs font-bold shadow-xs flex items-center gap-2">
              <Lock className="h-3.5 w-3.5" />
              {record.ncrNumber}
            </div>
          </div>

          <div className="w-0.5 h-4 bg-border mx-auto" />

          {/* Level 2: Three Pillars */}
          <div className="grid grid-cols-3 gap-3 text-center my-1 max-w-xl mx-auto">
            <div className="p-2.5 bg-card border border-border rounded-lg shadow-2xs">
              <span className="text-[10px] text-muted-foreground font-semibold block">BATCH / LOT</span>
              <span className="text-xs font-mono font-bold text-foreground">{record.batchLotNo}</span>
              <span className="text-[10px] text-emerald-600 block mt-0.5">Raw Material Verified</span>
            </div>

            <div className="p-2.5 bg-card border border-border rounded-lg shadow-2xs">
              <span className="text-[10px] text-muted-foreground font-semibold block">SERIAL NUMBERS</span>
              <span className="text-xs font-mono font-bold text-foreground">{record.serialNumbers}</span>
              <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">2 Confirmed Scratches</span>
            </div>

            <div className="p-2.5 bg-card border border-border rounded-lg shadow-2xs">
              <span className="text-[10px] text-muted-foreground font-semibold block">WORK ORDER</span>
              <span className="text-xs font-mono font-bold text-foreground">{record.workOrder}</span>
              <span className="text-[10px] text-blue-600 block mt-0.5">{record.operation} Assembly</span>
            </div>
          </div>

          <div className="w-0.5 h-4 bg-border mx-auto" />

          {/* Level 3: Consolidated Suspect Pool */}
          <div className="flex justify-center my-1">
            <div className="bg-amber-500/10 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 px-4 py-1.5 rounded-md text-xs font-bold shadow-2xs">
              TOTAL SUSPECT QUANTITY: {record.affectedQuantity} UNITS
            </div>
          </div>

          <div className="w-0.5 h-4 bg-border mx-auto" />

          {/* Level 4: Downstream Containment Status */}
          <div className="grid grid-cols-3 gap-3 text-center mt-1 max-w-xl mx-auto">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-md">
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 block">WIP (50 Units)</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400">Segregated & Quarantined</span>
            </div>

            <div className="p-2 bg-muted/50 border border-border rounded-md">
              <span className="text-[11px] font-bold text-foreground block">Finished Goods (0 Units)</span>
              <span className="text-[10px] text-muted-foreground">No Stock Impacted</span>
            </div>

            <div className="p-2 bg-muted/50 border border-border rounded-md">
              <span className="text-[11px] font-bold text-foreground block">Customer Shipped (0)</span>
              <span className="text-[10px] text-muted-foreground">Dispatch Stop Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
