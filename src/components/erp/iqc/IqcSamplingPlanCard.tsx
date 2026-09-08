import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  SlidersHorizontal,
  ArrowRight,
  CheckCircle2,
  FileSpreadsheet,
} from "lucide-react";
import type { IqcRecord } from "@/services/iqcTypes";
import { toast } from "sonner";

interface IqcSamplingPlanCardProps {
  record: IqcRecord;
  onChange: (updated: Partial<IqcRecord>) => void;
  onNextPhase?: () => void;
}

export const IqcSamplingPlanCard: React.FC<IqcSamplingPlanCardProps> = ({
  record,
  onChange,
  onNextPhase,
}) => {
  return (
    <div className="space-y-4 w-full max-w-full min-w-0">
      {/* Sampling Plan Details Card */}
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-600/10 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Quarantine & Statistical Sampling Plan (AQL)
              </h2>
              <p className="text-[11px] text-muted-foreground">
                ANSI/ASQ Z1.4 sampling protocol, lot sizing, inspection levels, and calibrated measurement equipment.
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
              <span>Next: Testing Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs w-full min-w-0">
          {/* Sampling Plan */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
              <span>Sampling Standard</span>
              <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.samplingPlan}
              onValueChange={(val) => onChange({ samplingPlan: val })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="ANSI/ASQ Z1.4">ANSI/ASQ Z1.4 (Standard)</SelectItem>
                <SelectItem value="ISO 2859-1">ISO 2859-1 Normal</SelectItem>
                <SelectItem value="100% Inspection">100% Full Screening</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AQL */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
              <span>AQL Threshold</span>
              <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.aql}
              onValueChange={(val) => onChange({ aql: val })}
            >
              <SelectTrigger className="h-8 text-xs font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="1.5">1.5 (Standard Major)</SelectItem>
                <SelectItem value="1.0">1.0 (Critical Tightened)</SelectItem>
                <SelectItem value="0.65">0.65 (High Precision)</SelectItem>
                <SelectItem value="2.5">2.5 (Minor Defects)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inspection Level */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground">Inspection Level</Label>
            <Select
              value={record.inspectionLevel}
              onValueChange={(val) => onChange({ inspectionLevel: val })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Level II">Level II (Normal Single)</SelectItem>
                <SelectItem value="Level I">Level I (Reduced)</SelectItem>
                <SelectItem value="Level III">Level III (Tightened)</SelectItem>
                <SelectItem value="S-4">S-4 Special Testing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inspection Type */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
              <span>Inspection Scope</span>
              <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.inspectionType}
              onValueChange={(val) => onChange({ inspectionType: val })}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Dimensional & Functional">Dimensional & Functional</SelectItem>
                <SelectItem value="Visual & Packaging">Visual & Packaging</SelectItem>
                <SelectItem value="Electrical Compliance">Electrical Compliance</SelectItem>
                <SelectItem value="Full Verification">Full Verification</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Inspection Plan Code */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground flex items-center gap-1">
              <span>Inspection Plan Reference</span>
              <span className="text-rose-500">*</span>
            </Label>
            <Select
              value={record.inspectionPlan}
              onValueChange={(val) => onChange({ inspectionPlan: val })}
            >
              <SelectTrigger className="h-8 text-xs font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="IQP-MOTOR-001">IQP-MOTOR-001 (BLDC Standard)</SelectItem>
                <SelectItem value="IQP-MOTOR-002">IQP-MOTOR-002 (Severe Duty)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sampling Methodology */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground">Sampling Methodology</Label>
            <Select defaultValue="Single Normal Sampling">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Single Normal Sampling">Single Normal Sampling</SelectItem>
                <SelectItem value="Double Sampling Plan">Double Sampling Plan</SelectItem>
                <SelectItem value="Multiple Sequential Plan">Multiple Sequential Plan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quarantine Staging Location */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground">Quarantine Staging Bay</Label>
            <Select defaultValue="Bay Q-04">
              <SelectTrigger className="h-8 text-xs font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="Bay Q-04">Bay Q-04 (Inbound Receiving)</SelectItem>
                <SelectItem value="Bay Q-01">Bay Q-01 (Precision Metrology)</SelectItem>
                <SelectItem value="Bay Q-08">Bay Q-08 (Chemical/Wetted Area)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Measurement Calibration Protocol */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground">Calibration Protocol</Label>
            <Select defaultValue="ISO 17025 Calibrated Bench">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="ISO 17025 Calibrated Bench">ISO 17025 Calibrated Bench</SelectItem>
                <SelectItem value="NABL Certified Metrology">NABL Certified Metrology</SelectItem>
                <SelectItem value="Internal Daily Verified Gauge">Internal Daily Verified Gauge</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* AQL Calculation Criteria & Sampling Standards Banner */}
      <div className="bg-slate-50/70 dark:bg-slate-900/40 border border-border/80 rounded-xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
        <div className="space-y-1 min-w-0 sm:border-r sm:border-border/60 sm:pr-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span>Lot Sizing & Sample Letter</span>
          </div>
          <p className="text-xs text-foreground">
            Inbound Lot: <strong className="font-mono">{record.receivedQty}</strong> units
          </p>
          <p className="text-[11px] text-muted-foreground">
            ANSI Code Letter: <strong className="text-blue-600 dark:text-blue-400 font-mono">J</strong> ({record.inspectionQty} units required)
          </p>
        </div>

        <div className="space-y-1 min-w-0 lg:border-r lg:border-border/60 lg:pr-3">
          <div className="text-xs text-muted-foreground font-semibold">Acceptance Thresholds</div>
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/50 px-2 py-0.5 rounded font-mono font-bold">
              Ac: ≤ 3 (Pass)
            </span>
            <span className="text-rose-700 dark:text-rose-400 bg-rose-100 dark:bg-rose-950/50 px-2 py-0.5 rounded font-mono font-bold">
              Re: ≥ 4 (Reject)
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">AQL {record.aql}% Level II Protocol</p>
        </div>

        <div className="space-y-1 min-w-0 sm:border-r sm:border-border/60 sm:pr-3">
          <div className="text-xs text-muted-foreground font-semibold">Inspection Protocol Status</div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Sampling Plan Configured</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Sample pool: {record.inspectionQty} units staged in Quarantine
          </p>
        </div>

        <div className="space-y-1 min-w-0 flex flex-col justify-center">
          <div className="text-xs font-semibold text-muted-foreground">Next Quality Action</div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Ready for Phase 3 Testing</span>
          </div>
          <span className="text-[10px] text-muted-foreground">
            Parameters and measured actuals evaluated in next step.
          </span>
        </div>
      </div>
    </div>
  );
};
