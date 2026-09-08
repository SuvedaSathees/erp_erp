import { RotateCcw, CheckSquare, Layers, FileCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NcrRecord } from "@/services/ncrTypes";

interface NcrDispositionTabProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrDispositionTab({ record, onChange }: NcrDispositionTabProps) {
  return (
    <div className="space-y-5">
      {/* Section 11: Material Disposition Card */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <RotateCcw className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 11: Quality Material Disposition
              </h3>
              <p className="text-xs text-muted-foreground">
                Authorized ERP disposition of quarantined/affected lots.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-600 text-white">
            Decision: {record.dispositionType}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground font-medium">
              Disposition Type
            </Label>
            <Select
              value={record.dispositionType}
              onValueChange={(val: any) => onChange({ dispositionType: val })}
            >
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Accept">Accept (Release Conforming Lot)</SelectItem>
                <SelectItem value="Partial Accept">Partial Accept (Release Segregated)</SelectItem>
                <SelectItem value="Rework">Rework (Internal Re-processing)</SelectItem>
                <SelectItem value="Repair">Repair (Special Deviation)</SelectItem>
                <SelectItem value="Use-As-Is">Use-As-Is (Engineering Deviation)</SelectItem>
                <SelectItem value="Return to Supplier">Return to Supplier (Debit Note)</SelectItem>
                <SelectItem value="Reject">Reject (Quarantine Locked)</SelectItem>
                <SelectItem value="Scrap">Scrap (Material Write-off)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground font-medium">
              Approved By
            </Label>
            <Input
              value={record.dispositionApprovedBy || ""}
              onChange={(e) => onChange({ dispositionApprovedBy: e.target.value })}
              className="h-9 text-xs font-medium"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground font-medium">
              Disposition Date
            </Label>
            <Input
              value={record.dispositionDate || ""}
              onChange={(e) => onChange({ dispositionDate: e.target.value })}
              className="h-9 text-xs font-mono"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-medium">
            Disposition Justification & Notes
          </Label>
          <Textarea
            rows={2}
            value={record.dispositionNotes}
            onChange={(e) => onChange({ dispositionNotes: e.target.value })}
            className="text-xs"
          />
        </div>
      </div>

      {/* Section 12: Rework & Re-Inspection Card */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <FileCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 12: Rework Execution & Re-Inspection Protocol
              </h3>
              <p className="text-xs text-muted-foreground">
                Work order link, authorized rework instruction, and post-rework quality sign-off.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Rework Order</Label>
            <Input
              value={record.reworkOrder || ""}
              onChange={(e) => onChange({ reworkOrder: e.target.value })}
              className="h-9 text-xs font-mono font-bold"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Rework Instruction</Label>
            <Input
              value={record.reworkInstruction || ""}
              onChange={(e) => onChange({ reworkInstruction: e.target.value })}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Rework Quantity</Label>
            <Input
              type="number"
              value={record.reworkQuantity || 0}
              onChange={(e) => onChange({ reworkQuantity: Number(e.target.value) })}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Rework Completed By</Label>
            <Input
              value={record.reworkCompletedBy || ""}
              onChange={(e) => onChange({ reworkCompletedBy: e.target.value })}
              className="h-9 text-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Re-inspection Number</Label>
            <Input
              value={record.reInspectionNo || ""}
              onChange={(e) => onChange({ reInspectionNo: e.target.value })}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Re-inspection Result</Label>
            <Select
              value={record.reInspectionResult || "Pass"}
              onValueChange={(val: any) => onChange({ reInspectionResult: val })}
            >
              <SelectTrigger className="h-9 text-xs font-bold text-emerald-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pass">Pass (Released)</SelectItem>
                <SelectItem value="Fail">Fail (Scrap / Escalate)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Final Quality Sign-off</Label>
            <Input
              value={record.finalQualityApproval || ""}
              onChange={(e) => onChange({ finalQualityApproval: e.target.value })}
              className="h-9 text-xs font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
