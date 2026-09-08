import React from "react";
import { Link2, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IpqcRecord } from "@/services/ipqcTypes";

interface IpqcProcessAndPlanningCardsProps {
  record: IpqcRecord;
  onChange: (updates: Partial<IpqcRecord>) => void;
}

export const IpqcProcessAndPlanningCards: React.FC<IpqcProcessAndPlanningCardsProps> = ({
  record,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 min-w-0">
      {/* Left Card: Process Information */}
      <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
        <div className="border-b border-border/40 pb-2">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            Process Information
          </h3>
          <p className="text-xs text-muted-foreground">
            Standard operating procedures, control plan parameters, and drawing references.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs min-w-0">
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Process *
            </Label>
            <Select
              value={record.process}
              onValueChange={(val) => onChange({ process: val })}
            >
              <SelectTrigger className="h-8 text-xs min-w-0">
                <SelectValue placeholder="Process" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Assembly">Assembly</SelectItem>
                <SelectItem value="Sub-Assembly">Sub-Assembly</SelectItem>
                <SelectItem value="Testing">Testing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Process Step *
            </Label>
            <Select
              value={record.processStep}
              onValueChange={(val) => onChange({ processStep: val })}
            >
              <SelectTrigger className="h-8 text-xs min-w-0">
                <SelectValue placeholder="Process Step" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Cable Termination">Cable Termination</SelectItem>
                <SelectItem value="Board Mounting">Board Mounting</SelectItem>
                <SelectItem value="Enclosure Sealing">Enclosure Sealing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Operation Sequence
            </Label>
            <Input
              type="number"
              value={record.operationSequence}
              onChange={(e) => onChange({ operationSequence: parseInt(e.target.value) || 0 })}
              className="h-8 text-xs font-mono"
            />
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Control Plan
            </Label>
            <Select
              value={record.controlPlan}
              onValueChange={(val) => onChange({ controlPlan: val })}
            >
              <SelectTrigger className="h-8 text-xs font-mono min-w-0">
                <SelectValue placeholder="Control Plan" />
              </SelectTrigger>
              <SelectContent className="text-xs font-mono">
                <SelectItem value="CP-EVSE-001">CP-EVSE-001</SelectItem>
                <SelectItem value="CP-EVSE-002">CP-EVSE-002</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              SOP Reference
            </Label>
            <Select
              value={record.sopReference}
              onValueChange={(val) => onChange({ sopReference: val })}
            >
              <SelectTrigger className="h-8 text-xs font-mono min-w-0">
                <SelectValue placeholder="SOP" />
              </SelectTrigger>
              <SelectContent className="text-xs font-mono">
                <SelectItem value="SOP-ASM-02">SOP-ASM-02</SelectItem>
                <SelectItem value="SOP-ASM-03">SOP-ASM-03</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              PFMEA Reference
            </Label>
            <Select
              value={record.pfmeaReference}
              onValueChange={(val) => onChange({ pfmeaReference: val })}
            >
              <SelectTrigger className="h-8 text-xs font-mono min-w-0">
                <SelectValue placeholder="PFMEA Reference" />
              </SelectTrigger>
              <SelectContent className="text-xs font-mono">
                <SelectItem value="PFMEA-ASM-01">PFMEA-ASM-01</SelectItem>
                <SelectItem value="PFMEA-ASM-02">PFMEA-ASM-02</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Drawing Reference
            </Label>
            <div className="relative min-w-0">
              <Input
                value={record.drawingReference}
                onChange={(e) => onChange({ drawingReference: e.target.value })}
                className="h-8 text-xs pr-7 font-mono"
              />
              <Link2 className="w-3.5 h-3.5 text-blue-600 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Specification
            </Label>
            <Select
              value={record.specification}
              onValueChange={(val) => onChange({ specification: val })}
            >
              <SelectTrigger className="h-8 text-xs font-mono min-w-0">
                <SelectValue placeholder="Specification" />
              </SelectTrigger>
              <SelectContent className="text-xs font-mono">
                <SelectItem value="SPC-ASM-001">SPC-ASM-001</SelectItem>
                <SelectItem value="SPC-ASM-002">SPC-ASM-002</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Checkboxes */}
        <div className="pt-2 border-t border-border/60 flex flex-wrap items-center gap-6 text-xs">
          <label className="flex items-center gap-2 font-medium cursor-pointer">
            <Checkbox
              checked={record.specialCharacteristic}
              onCheckedChange={(checked) => onChange({ specialCharacteristic: !!checked })}
            />
            <span className="text-foreground">Special Characteristic (SC)</span>
          </label>

          <label className="flex items-center gap-2 font-medium cursor-pointer">
            <Checkbox
              checked={record.criticalParameter}
              onCheckedChange={(checked) => onChange({ criticalParameter: !!checked })}
            />
            <span className="text-foreground">Critical Parameter (CC)</span>
          </label>
        </div>
      </div>

      {/* Right Card: Inspection Planning */}
      <div className="bg-card border border-border/80 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
        <div className="border-b border-border/40 pb-2">
          <h3 className="text-sm sm:text-base font-semibold text-foreground">
            Inspection Planning
          </h3>
          <p className="text-xs text-muted-foreground">
            Sampling frequencies, measurement equipment, and line reaction plans.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs min-w-0">
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Inspection Plan *
            </Label>
            <Select
              value={record.inspectionPlan}
              onValueChange={(val) => onChange({ inspectionPlan: val })}
            >
              <SelectTrigger className="h-8 text-xs font-mono min-w-0">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent className="text-xs font-mono">
                <SelectItem value="IP-ASM-001">IP-ASM-001</SelectItem>
                <SelectItem value="IP-ASM-002">IP-ASM-002</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Inspection Type *
            </Label>
            <Select
              value={record.inspectionType}
              onValueChange={(val: any) => onChange({ inspectionType: val })}
            >
              <SelectTrigger className="h-8 text-xs min-w-0">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Visual & Functional">Visual & Functional</SelectItem>
                <SelectItem value="Visual">Visual</SelectItem>
                <SelectItem value="Dimensional">Dimensional</SelectItem>
                <SelectItem value="Functional">Functional</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Inspection Frequency *
            </Label>
            <Select
              value={record.inspectionFrequency}
              onValueChange={(val: any) => onChange({ inspectionFrequency: val })}
            >
              <SelectTrigger className="h-8 text-xs min-w-0">
                <SelectValue placeholder="Frequency" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="First Piece">First Piece</SelectItem>
                <SelectItem value="Every Piece">Every Piece</SelectItem>
                <SelectItem value="Every Hour">Every Hour</SelectItem>
                <SelectItem value="Every Shift">Every Shift</SelectItem>
                <SelectItem value="Sampling">Sampling</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Sample Size
            </Label>
            <div className="flex items-center gap-1.5 min-w-0">
              <Input
                type="number"
                value={record.sampleSize}
                onChange={(e) => onChange({ sampleSize: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs font-mono"
              />
              <span className="text-xs text-muted-foreground font-semibold shrink-0">Nos</span>
            </div>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Inspection Method
            </Label>
            <Select
              value={record.inspectionMethod}
              onValueChange={(val: any) => onChange({ inspectionMethod: val })}
            >
              <SelectTrigger className="h-8 text-xs min-w-0">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Gauge + Functional Test">Gauge + Functional Test</SelectItem>
                <SelectItem value="Manual">Manual</SelectItem>
                <SelectItem value="Gauge">Gauge</SelectItem>
                <SelectItem value="Test Equipment">Test Equipment</SelectItem>
                <SelectItem value="Vision">Vision</SelectItem>
                <SelectItem value="Automated">Automated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Measuring Equipment
            </Label>
            <Select
              value={record.measuringEquipment}
              onValueChange={(val) => onChange({ measuringEquipment: val })}
            >
              <SelectTrigger className="h-8 text-xs min-w-0">
                <SelectValue placeholder="Equipment" />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="VTT-02 (Torque Tester)">VTT-02 (Torque Tester)</SelectItem>
                <SelectItem value="DMM-004 (Multimeter)">DMM-004 (Multimeter)</SelectItem>
                <SelectItem value="MIT-003 (Insulation Tester)">MIT-003 (Insulation Tester)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Calibration Status
            </Label>
            <div className="h-8 flex items-center px-2.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold gap-1.5 min-w-0">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="truncate">{record.calibrationStatus}</span>
            </div>
          </div>

          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              MSA Reference
            </Label>
            <Input
              value={record.msaReference}
              onChange={(e) => onChange({ msaReference: e.target.value })}
              className="h-8 text-xs font-mono"
            />
          </div>
        </div>

        <div className="pt-2 border-t border-border/60 flex items-center justify-between">
          <label className="flex items-center gap-2 font-medium text-xs cursor-pointer">
            <Checkbox
              checked={record.spcRequired}
              onCheckedChange={(checked) => onChange({ spcRequired: !!checked })}
            />
            <span className="text-foreground">Statistical Process Control (SPC) Required</span>
          </label>
        </div>

        {/* Reaction Plan */}
        <div className="space-y-1.5 pt-1 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Line Stoppage & Reaction Plan
          </Label>
          <Textarea
            rows={2}
            value={record.reactionPlan}
            onChange={(e) => onChange({ reactionPlan: e.target.value })}
            className="text-xs resize-none"
          />
        </div>
      </div>
    </div>
  );
};
