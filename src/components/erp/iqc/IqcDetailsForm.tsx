import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, PackageCheck, ArrowRight } from "lucide-react";
import type { IqcRecord } from "@/services/iqcTypes";
import { toast } from "sonner";

interface IqcDetailsFormProps {
  record: IqcRecord;
  onChange: (updated: Partial<IqcRecord>) => void;
  onNextPhase?: () => void;
}

export const IqcDetailsForm: React.FC<IqcDetailsFormProps> = ({
  record,
  onChange,
  onNextPhase,
}) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 w-full max-w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
            <PackageCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-foreground">
              Material Receipt & Inbound Gate (GRN)
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Goods receipt verification, vendor traceability, lot identification, and receipt quantities.
            </p>
          </div>
        </div>
        {onNextPhase && (
          <Button
            type="button"
            size="sm"
            onClick={onNextPhase}
            className="h-8 text-xs gap-1.5 bg-[#0B3B7B] hover:bg-[#092e60] text-white cursor-pointer shadow-xs rounded-lg transition-all active:scale-[0.98]"
          >
            <span>Next: Sampling Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs w-full min-w-0">
        {/* Inspection No */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground">Inspection No.</Label>
          <Input
            value={record.inspectionNo}
            disabled
            className="h-8 text-xs bg-muted/50 font-mono text-muted-foreground truncate"
          />
        </div>

        {/* Inspection Date */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>Inspection Date</span>
            <span className="text-rose-500">*</span>
          </Label>
          <div className="relative">
            <Input
              value={record.inspectionDate}
              onChange={(e) => onChange({ inspectionDate: e.target.value })}
              className="h-8 text-xs pr-8 font-mono"
            />
            <Calendar className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* GRN Number */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>GRN Number</span>
            <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={record.grnNumber}
            onValueChange={(val) => onChange({ grnNumber: val })}
          >
            <SelectTrigger className="h-8 text-xs font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="GR-2026-000421">GR-2026-000421</SelectItem>
              <SelectItem value="GR-2026-000452">GR-2026-000452</SelectItem>
              <SelectItem value="GR-2026-000490">GR-2026-000490</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Purchase Order */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>Purchase Order</span>
            <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={record.purchaseOrder}
            onValueChange={(val) => onChange({ purchaseOrder: val })}
          >
            <SelectTrigger className="h-8 text-xs font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="PO-2026-0142">PO-2026-0142</SelectItem>
              <SelectItem value="PO-2026-0165">PO-2026-0165</SelectItem>
              <SelectItem value="PO-2026-0190">PO-2026-0190</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Supplier */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>Supplier</span>
            <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={record.supplier}
            onValueChange={(val) => onChange({ supplier: val })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="TechDrive Components Pvt. Ltd.">
                TechDrive Components Pvt. Ltd.
              </SelectItem>
              <SelectItem value="Alpha Stamping Solutions">Alpha Stamping Solutions</SelectItem>
              <SelectItem value="Apex Precision Castings">Apex Precision Castings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Supplier Code */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground">Supplier Code</Label>
          <Input
            value={record.supplierCode}
            disabled
            className="h-8 text-xs bg-muted/50 font-mono text-muted-foreground truncate"
          />
        </div>

        {/* Material / Item */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>Material / Item</span>
            <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={record.materialItem}
            onValueChange={(val) => onChange({ materialItem: val })}
          >
            <SelectTrigger className="h-8 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="BLDC Motor 2kW">BLDC Motor 2kW</SelectItem>
              <SelectItem value="Stator Core Lamination Pack">Stator Core Lamination Pack</SelectItem>
              <SelectItem value="Rotor Shaft Precision 12mm">Rotor Shaft Precision 12mm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Item Code */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground">Item Code</Label>
          <Input
            value={record.itemCode}
            disabled
            className="h-8 text-xs bg-muted/50 font-mono text-muted-foreground truncate"
          />
        </div>

        {/* Item Revision */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground">Item Revision</Label>
          <Select
            value={record.itemRevision}
            onValueChange={(val) => onChange({ itemRevision: val })}
          >
            <SelectTrigger className="h-8 text-xs font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="REV-01">REV-01</SelectItem>
              <SelectItem value="REV-02">REV-02</SelectItem>
              <SelectItem value="REV-03">REV-03</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Batch / Lot No. */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>Batch / Lot No.</span>
            <span className="text-rose-500">*</span>
          </Label>
          <Input
            value={record.batchLotNo}
            onChange={(e) => onChange({ batchLotNo: e.target.value })}
            className="h-8 text-xs font-mono"
          />
        </div>

        {/* Serial Numbers */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground">Serial Numbers</Label>
          <Input
            value={record.serialNumbers}
            onChange={(e) => onChange({ serialNumbers: e.target.value })}
            className="h-8 text-xs font-mono"
          />
        </div>

        {/* Inspector */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>Inspector</span>
            <span className="text-rose-500">*</span>
          </Label>
          <Select
            value={record.inspector}
            onValueChange={(val) => onChange({ inspector: val })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="K. Priya">K. Priya (Lead QA)</SelectItem>
              <SelectItem value="Arun K.">Arun K. (Quality Engineer)</SelectItem>
              <SelectItem value="S. Vignesh">S. Vignesh (Inspector)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Received Quantity */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>Received Quantity</span>
            <span className="text-rose-500">*</span>
          </Label>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              value={record.receivedQty}
              onChange={(e) =>
                onChange({ receivedQty: parseInt(e.target.value) || 0 })
              }
              className="h-8 text-xs font-mono"
            />
            <span className="text-xs font-semibold text-muted-foreground">Nos</span>
          </div>
        </div>

        {/* Inspection Quantity */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
            <span>Inspection Sample Quantity</span>
            <span className="text-rose-500">*</span>
          </Label>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              value={record.inspectionQty}
              onChange={(e) =>
                onChange({ inspectionQty: parseInt(e.target.value) || 0 })
              }
              className="h-8 text-xs font-mono"
            />
            <span className="text-xs font-semibold text-muted-foreground">Nos</span>
          </div>
        </div>

        {/* Inventory Status Gate */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-[11px] font-medium text-foreground">Inbound Warehouse Gate</Label>
          <div className="h-8 px-3 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center gap-2 text-xs font-medium text-amber-700 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Dock Received - Quarantined at Bay Q-04</span>
          </div>
        </div>
      </div>
    </div>
  );
};
