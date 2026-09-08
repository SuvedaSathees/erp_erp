import React from "react";
import { Calendar, Cpu, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IpqcRecord } from "@/services/ipqcTypes";

interface IpqcDetailsFormProps {
  record: IpqcRecord;
  onChange: (updates: Partial<IpqcRecord>) => void;
}

export const IpqcDetailsForm: React.FC<IpqcDetailsFormProps> = ({ record, onChange }) => {
  return (
    <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/40 min-w-0">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            In-Process Inspection Details
          </h2>
          <p className="text-xs text-muted-foreground">
            Shop floor stage-gate parameters, operation routing, and equipment assignments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200">
            <Cpu className="w-3 h-3" />
            {record.operationNo}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200">
            <Wrench className="w-3 h-3" />
            {record.workCenter}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs min-w-0">
        {/* Inspection No */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Inspection No.
          </Label>
          <Input
            value={record.inspectionNo}
            readOnly
            className="h-9 text-xs bg-muted/40 font-mono font-bold text-foreground"
          />
        </div>

        {/* Inspection Date */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Inspection Date & Time *
          </Label>
          <div className="relative min-w-0">
            <Input
              value={record.inspectionDate}
              onChange={(e) => onChange({ inspectionDate: e.target.value })}
              className="h-9 text-xs pr-8 font-mono"
            />
            <Calendar className="w-3.5 h-3.5 text-blue-600 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Production Order */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Production Order *
          </Label>
          <Select
            value={record.productionOrder}
            onValueChange={(val) => onChange({ productionOrder: val })}
          >
            <SelectTrigger className="h-9 text-xs min-w-0">
              <SelectValue placeholder="Select Production Order" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="MO-2026-00087">MO-2026-00087</SelectItem>
              <SelectItem value="MO-2026-00088">MO-2026-00088</SelectItem>
              <SelectItem value="MO-2026-00089">MO-2026-00089</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Work Order */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Work Order *
          </Label>
          <Select
            value={record.workOrder}
            onValueChange={(val) => onChange({ workOrder: val })}
          >
            <SelectTrigger className="h-9 text-xs min-w-0">
              <SelectValue placeholder="Select Work Order" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="WO-2026-00421">WO-2026-00421</SelectItem>
              <SelectItem value="WO-2026-00422">WO-2026-00422</SelectItem>
              <SelectItem value="WO-2026-00423">WO-2026-00423</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Product *
          </Label>
          <Select
            value={record.product}
            onValueChange={(val) => onChange({ product: val })}
          >
            <SelectTrigger className="h-9 text-xs min-w-0">
              <SelectValue placeholder="Select Product" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="EV Charger 7kW">EV Charger 7kW</SelectItem>
              <SelectItem value="EV Charger 11kW">EV Charger 11kW</SelectItem>
              <SelectItem value="EV Charger 22kW Fast">EV Charger 22kW Fast</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Code */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Product Code & Rev
          </Label>
          <Input
            value={record.productCode}
            readOnly
            className="h-9 text-xs bg-muted/40 font-mono text-muted-foreground"
          />
        </div>

        {/* Batch / Lot No */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Batch / Lot No. *
          </Label>
          <Select
            value={record.batchLotNo}
            onValueChange={(val) => onChange({ batchLotNo: val })}
          >
            <SelectTrigger className="h-9 text-xs font-mono font-semibold min-w-0">
              <SelectValue placeholder="Select Batch / Lot" />
            </SelectTrigger>
            <SelectContent className="text-xs font-mono">
              <SelectItem value="B-2026-09-014">B-2026-09-014</SelectItem>
              <SelectItem value="B-2026-09-015">B-2026-09-015</SelectItem>
              <SelectItem value="B-2026-08-099">B-2026-08-099</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Operation No */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Operation No. *
          </Label>
          <Select
            value={record.operationNo}
            onValueChange={(val) => {
              let opName = "Assembly & Cable Fixing";
              if (val === "OP-10") opName = "Frame Prep";
              else if (val === "OP-20") opName = "PCB Sub-assembly";
              else if (val === "OP-40") opName = "Pneumatic Testing";
              else if (val === "OP-50") opName = "Final Packaging";
              onChange({ operationNo: val, operationName: opName });
            }}
          >
            <SelectTrigger className="h-9 text-xs min-w-0">
              <SelectValue placeholder="Select Operation" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="OP-10">OP-10 (Frame Prep)</SelectItem>
              <SelectItem value="OP-20">OP-20 (PCB Sub-assembly)</SelectItem>
              <SelectItem value="OP-30">OP-30 (Assembly & Cable Fixing)</SelectItem>
              <SelectItem value="OP-40">OP-40 (Pneumatic Testing)</SelectItem>
              <SelectItem value="OP-50">OP-50 (Final Packaging)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Operation Name */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Operation Name
          </Label>
          <Input
            value={record.operationName}
            readOnly
            className="h-9 text-xs bg-muted/40 font-medium text-foreground truncate"
          />
        </div>

        {/* Work Center */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Work Center *
          </Label>
          <Select
            value={record.workCenter}
            onValueChange={(val) => onChange({ workCenter: val })}
          >
            <SelectTrigger className="h-9 text-xs min-w-0">
              <SelectValue placeholder="Select Work Center" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="WC-ASM-01">WC-ASM-01 (Manual Line 1)</SelectItem>
              <SelectItem value="WC-ASM-02">WC-ASM-02 (Semi-auto Line)</SelectItem>
              <SelectItem value="WC-TST-01">WC-TST-01 (Hi-Pot Bench)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Machine / Equipment */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Machine / Equipment
          </Label>
          <Select
            value={record.machineEquipment}
            onValueChange={(val) => onChange({ machineEquipment: val })}
          >
            <SelectTrigger className="h-9 text-xs font-mono min-w-0">
              <SelectValue placeholder="Select Machine" />
            </SelectTrigger>
            <SelectContent className="text-xs font-mono">
              <SelectItem value="ASM-001">ASM-001</SelectItem>
              <SelectItem value="ASM-002">ASM-002</SelectItem>
              <SelectItem value="PNEU-004">PNEU-004</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Shift */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Shift
          </Label>
          <Select
            value={record.shift}
            onValueChange={(val) => onChange({ shift: val })}
          >
            <SelectTrigger className="h-9 text-xs min-w-0">
              <SelectValue placeholder="Select Shift" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="Shift A">Shift A (Morning)</SelectItem>
              <SelectItem value="Shift B">Shift B (Evening)</SelectItem>
              <SelectItem value="Shift C">Shift C (Night)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inspector */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Lead Inspector *
          </Label>
          <Select
            value={record.inspector}
            onValueChange={(val) => onChange({ inspector: val })}
          >
            <SelectTrigger className="h-9 text-xs min-w-0">
              <SelectValue placeholder="Select Inspector" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="Priya S">Priya S (Lead QA)</SelectItem>
              <SelectItem value="Arun K">Arun K (Senior QA)</SelectItem>
              <SelectItem value="Meena R">Meena R (Inspector)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Inspection Status
          </Label>
          <Select
            value={record.inspectionStatus}
            onValueChange={(val: any) => onChange({ inspectionStatus: val })}
          >
            <SelectTrigger className="h-9 text-xs font-semibold min-w-0">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent className="text-xs font-medium">
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Rework Required">Rework Required</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Card */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Job Card Routing No.
          </Label>
          <Input
            value={record.jobCard}
            onChange={(e) => onChange({ jobCard: e.target.value })}
            className="h-9 text-xs font-mono font-semibold"
          />
        </div>
      </div>
    </div>
  );
};
