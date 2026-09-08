import { ShieldCheck, CheckCircle2, TrendingDown, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NcrRecord } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrVerificationTabProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrVerificationTab({ record, onChange }: NcrVerificationTabProps) {
  const ver = record.verifications[0] || {
    id: "ver-1",
    verificationId: "VR-2026-0031",
    method: "Inspection",
    date: "08-Sep-2026",
    verifiedBy: "Arun K",
    result: "Effective",
    residualRiskScore: 36,
    additionalAction: "Monitor next 3 consecutive shifts for any cosmetic defects on Line 1.",
  };

  const handleResultChange = (val: "Effective" | "Not Effective" | "Pending") => {
    const updated = [{ ...ver, result: val }];
    onChange({
      verifications: updated,
      effectivenessResult: val === "Effective" ? "Effective" : "Ineffective",
    });
    toast.info(`Verification result set to ${val}`);
  };

  return (
    <div className="space-y-5">
      {/* Verification Parameters Card */}
      <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Section 13: Corrective Action Verification & Effectiveness
              </h3>
              <p className="text-xs text-muted-foreground">
                Validation through physical audit, functional testing, and statistical process capability.
              </p>
            </div>
          </div>

          <span
            className={`px-2.5 py-1 rounded-md text-xs font-bold ${
              ver.result === "Effective"
                ? "bg-emerald-600 text-white"
                : "bg-amber-500 text-white"
            }`}
          >
            {ver.result}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Verification ID</Label>
            <Input
              value={ver.verificationId}
              readOnly
              className="h-9 text-xs font-mono bg-muted/40"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Verification Method</Label>
            <Select
              value={ver.method}
              onValueChange={(val: any) => {
                const updated = [{ ...ver, method: val }];
                onChange({ verifications: updated });
              }}
            >
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Inspection">100% Visual Inspection</SelectItem>
                <SelectItem value="Audit">Process Layered Audit</SelectItem>
                <SelectItem value="Test">Destructive / Functional Test</SelectItem>
                <SelectItem value="Data Analysis">SPC / Trend Data Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Verification Date</Label>
            <Input
              value={ver.date}
              onChange={(e) => {
                const updated = [{ ...ver, date: e.target.value }];
                onChange({ verifications: updated });
              }}
              className="h-9 text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Verified By (Quality)</Label>
            <Input
              value={ver.verifiedBy}
              onChange={(e) => {
                const updated = [{ ...ver, verifiedBy: e.target.value }];
                onChange({ verifications: updated });
              }}
              className="h-9 text-xs font-medium"
            />
          </div>
        </div>

        {/* Residual Risk Calculator Banner */}
        <div className="bg-muted/30 border border-border/70 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold text-foreground">
                Residual Risk Priority Analysis
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              RPN Reduced by 80.0%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-card border border-border/60 rounded-lg">
              <span className="text-[11px] text-muted-foreground font-semibold block mb-1">
                Initial Risk Assessment (Detection)
              </span>
              <div className="flex items-center justify-between">
                <span>Severity (6) × Occur (6) × Detect (5)</span>
                <span className="text-sm font-bold font-mono text-rose-600">RPN: 180 (High)</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-lg">
              <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold block mb-1">
                Residual Risk Assessment (Post-Action)
              </span>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Severity (6) × Occur (2) × Detect (3)</span>
                <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  RPN: {ver.residualRiskScore} (Low)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground font-medium">
            Additional Monitoring / Ongoing Action
          </Label>
          <Textarea
            rows={2}
            value={ver.additionalAction}
            onChange={(e) => {
              const updated = [{ ...ver, additionalAction: e.target.value }];
              onChange({ verifications: updated });
            }}
            className="text-xs"
          />
        </div>
      </div>
    </div>
  );
}
