import { useState } from "react";
import { CheckSquare, ShieldCheck, BarChart3, GitFork, CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { NcrRecord } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrHistoryTabProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

const CLOSURE_CHECKLIST = [
  { id: "c1", label: "Containment completed", defaultChecked: true },
  { id: "c2", label: "Affected material disposition completed", defaultChecked: true },
  { id: "c3", label: "Root cause identified (5-Why)", defaultChecked: true },
  { id: "c4", label: "Corrective action completed", defaultChecked: true },
  { id: "c5", label: "Preventive action completed, if required", defaultChecked: false },
  { id: "c6", label: "Re-inspection completed", defaultChecked: true },
  { id: "c7", label: "Effectiveness verified", defaultChecked: true },
  { id: "c8", label: "Evidence attached", defaultChecked: true },
  { id: "c9", label: "Customer response completed, if required", defaultChecked: true },
  { id: "c10", label: "Supplier response completed, if required", defaultChecked: true },
  { id: "c11", label: "All linked actions closed", defaultChecked: false },
  { id: "c12", label: "Quality approval obtained", defaultChecked: false },
];

export function NcrHistoryTab({ record, onChange }: NcrHistoryTabProps) {
  const [checklist, setChecklist] = useState(CLOSURE_CHECKLIST);

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, defaultChecked: !c.defaultChecked } : c))
    );
  };

  const handleApproveClosure = () => {
    onChange({
      ncrStatus: "Closed",
      ncrClosureStatus: "Closed",
      qualityManagerApproval: "Approved - Arun Kumar (QM)",
    });
    toast.success("NCR Form Officially Closed", {
      description: "Non-conformance closed and archived into Quality Intelligence Engine.",
    });
  };

  return (
    <div className="space-y-5">
      {/* Section 14: Closure Checklist Card */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <CheckSquare className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 14: NCR Closure Checklist & Quality Sign-Off
              </h3>
              <p className="text-xs text-muted-foreground">
                Rigorous 12-point mandatory closure gating before closing non-conformance.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleApproveClosure}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            Authorize NCR Closure
          </Button>
        </div>

        {/* 12 Checklist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs bg-muted/20 p-3.5 rounded-lg border border-border/60">
          {checklist.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 p-2 rounded-md bg-card border border-border/60 cursor-pointer select-none hover:border-blue-500 transition-colors"
            >
              <Checkbox
                checked={item.defaultChecked}
                onCheckedChange={() => handleToggleChecklist(item.id)}
                className="data-[state=checked]:bg-emerald-600"
              />
              <span className="font-medium text-foreground/90">{item.label}</span>
            </label>
          ))}
        </div>

        {/* Closure Form Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Closure Date</Label>
            <Input
              value={record.closureDate}
              onChange={(e) => onChange({ closureDate: e.target.value })}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Closure Verified By</Label>
            <Input
              value={record.closureVerifiedBy}
              onChange={(e) => onChange({ closureVerifiedBy: e.target.value })}
              className="h-9 text-xs font-medium"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Quality Manager Approval</Label>
            <Input
              value={record.qualityManagerApproval}
              onChange={(e) => onChange({ qualityManagerApproval: e.target.value })}
              className="h-9 text-xs font-semibold text-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Effectiveness Result</Label>
            <Input
              value={record.effectivenessResult}
              readOnly
              className="h-9 text-xs font-bold text-foreground"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-medium">Closure Remarks</Label>
          <Textarea
            rows={2}
            value={record.closureRemarks}
            onChange={(e) => onChange({ closureRemarks: e.target.value })}
            className="text-xs"
          />
        </div>
      </div>

      {/* Section 19: Monthly Executive Dashboard Snapshot */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 19: Enterprise NCR Dashboard Metrics (Sep 2026)
              </h3>
              <p className="text-xs text-muted-foreground">
                Live executive statistics and operational quality alerts.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-md">
            Closure Rate: 87.4%
          </span>
        </div>

        {/* 5 Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="bg-muted/30 p-3 rounded-lg border border-border/60 text-center">
            <span className="text-[11px] text-muted-foreground font-semibold block">Total NCRs</span>
            <span className="text-lg font-bold font-mono text-foreground">156</span>
          </div>

          <div className="bg-blue-50/40 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-900/50 text-center">
            <span className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold block">Open NCRs</span>
            <span className="text-lg font-bold font-mono text-blue-700 dark:text-blue-300">38</span>
          </div>

          <div className="bg-rose-50/40 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50 text-center">
            <span className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold block">Critical NCRs</span>
            <span className="text-lg font-bold font-mono text-rose-700 dark:text-rose-300">4</span>
          </div>

          <div className="bg-amber-50/40 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-900/50 text-center">
            <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold block">Overdue NCRs</span>
            <span className="text-lg font-bold font-mono text-amber-700 dark:text-amber-300">7</span>
          </div>

          <div className="bg-emerald-50/40 dark:bg-emerald-950/20 p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/50 text-center">
            <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold block">Avg Closure Time</span>
            <span className="text-lg font-bold font-mono text-emerald-700 dark:text-emerald-300">4.2 Days</span>
          </div>
        </div>

        {/* Sources & Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="bg-muted/20 border border-border/60 rounded-lg p-3 space-y-2 text-xs">
            <span className="font-bold text-foreground block">NCR Origin Sources</span>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">In-Process Inspection</span>
                <span className="font-bold font-mono">32%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "32%" }} />
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Incoming Quality (IQC)</span>
                <span className="font-bold font-mono">27%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "27%" }} />
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Inspection (FQC)</span>
                <span className="font-bold font-mono">18%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div className="bg-primary h-1.5 rounded-full" style={{ width: "18%" }} />
              </div>
            </div>
          </div>

          <div className="bg-muted/20 border border-border/60 rounded-lg p-3 space-y-2 text-xs">
            <span className="font-bold text-foreground block">Active Quality Alerts</span>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-rose-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>4 Critical NCRs currently open in production</span>
              </div>
              <div className="flex items-center gap-2 text-rose-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>7 NCRs exceeded target closure SLA</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Repeat surface scratch pattern detected on ASM-001</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
