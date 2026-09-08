import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  FileWarning,
  ExternalLink,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { IqcRecord } from "@/services/iqcTypes";
import { toast } from "sonner";

interface IqcDefectsCardProps {
  record: IqcRecord;
  onChange: (updated: Partial<IqcRecord>) => void;
  onNextPhase?: () => void;
}

export const IqcDefectsCard: React.FC<IqcDefectsCardProps> = ({
  record,
  onChange,
  onNextPhase,
}) => {
  const [ncrModalOpen, setNcrModalOpen] = useState(false);

  return (
    <div className="space-y-4 w-full max-w-full min-w-0">
      <div className="bg-card border border-border rounded-xl p-4 sm:p-5 shadow-xs space-y-4 w-full max-w-full min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-600/10 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Defect Classification & Linked Non-Conformance (NCR)
              </h2>
              <p className="text-[11px] text-muted-foreground">
                Discrepancy identification, supplier corrective action trigger, and quality score rating.
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
              <span>Next: Stores Release</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>

        {/* Defect Symptom Alert Box - Dynamically aligned with actual findings */}
        {record.rejectedQty > 0 ? (
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300">
                  {record.overallResult === "Pass"
                    ? `Minor Parameter Defect Logged (${record.rejectedQty} Non-Conforming Units within Ac Limit)`
                    : `Non-Conformance Identified: ${record.rejectedQty} Defective Units Detected`}
                </h4>
                <p className="text-[11px] text-rose-800/90 dark:text-rose-400/90 mt-0.5">
                  Electrical Current rating exceeded nominal tolerance limits (measured 8.7 A vs spec ≤ 8.0 A).
                  Discrepancy registered under <strong>{record.ncrNumber || "NCR-2026-0047"}</strong>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setNcrModalOpen(true)}
                className="h-7 text-xs border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 gap-1 cursor-pointer rounded-lg"
              >
                <FileWarning className="w-3.5 h-3.5" />
                <span>View Linked {record.ncrNumber || "NCR-2026-0047"}</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-3.5 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300">Zero Non-Conformances Detected</h4>
              <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">All inspected lot characteristics satisfied engineering drawing criteria.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs w-full min-w-0">
          {/* NCR Number */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground">NCR Reference Number</Label>
            <div className="flex items-center gap-1.5">
              <Input
                value={record.ncrNumber}
                onChange={(e) => onChange({ ncrNumber: e.target.value })}
                className="h-8 text-xs font-mono font-bold text-rose-600 dark:text-rose-400"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setNcrModalOpen(true)}
                className="h-8 text-xs px-2"
                title="View NCR"
              >
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </Button>
            </div>
          </div>

          {/* Supplier NCR Checkbox */}
          <div className="space-y-1.5 min-w-0 flex flex-col justify-end pb-1">
            <label className="flex items-center gap-2 text-xs font-medium cursor-pointer p-2 rounded-md border border-border bg-muted/20 hover:bg-muted/40 transition-colors">
              <Checkbox
                checked={record.supplierNcr}
                onCheckedChange={(c) => onChange({ supplierNcr: !!c })}
              />
              <span className="text-foreground font-semibold">Transmitted Supplier NCR</span>
            </label>
          </div>

          {/* Quality Score */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-[11px] font-medium text-foreground">
              Incoming Lot Quality Score
            </Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={record.qualityScore}
                onChange={(e) =>
                  onChange({ qualityScore: parseInt(e.target.value) || 0 })
                }
                className="h-8 text-xs font-mono font-bold text-blue-600 dark:text-blue-400 w-24"
              />
              <span className="text-xs font-medium text-muted-foreground">/ 100 Points</span>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-1.5 sm:col-span-2 lg:col-span-3 min-w-0">
            <Label className="text-[11px] font-medium text-foreground">
              Inspector Discrepancy Remarks & Findings
            </Label>
            <Textarea
              rows={2}
              value={record.remarks}
              onChange={(e) => onChange({ remarks: e.target.value })}
              className="text-xs resize-none"
              placeholder="Record exact nature of defect, heat numbers, or test conditions..."
            />
          </div>
        </div>
      </div>

      {/* Linked NCR Detail Modal */}
      <Dialog open={ncrModalOpen} onOpenChange={setNcrModalOpen}>
        <DialogContent className="max-w-md w-full p-5 bg-card border border-border shadow-xl rounded-xl">
          <DialogHeader className="pb-2 border-b border-border">
            <div className="flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-rose-600" />
              <div>
                <DialogTitle className="text-sm font-bold text-foreground">
                  Linked NCR: {record.ncrNumber}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Supplier Non-Conformance Report details
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Status</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                Open (Under Investigation)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Vendor</span>
              <span className="font-semibold text-foreground">{record.supplier}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Material</span>
              <span className="font-semibold text-foreground">{record.materialItem}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Lot / Batch</span>
              <span className="font-mono text-foreground">{record.batchLotNo}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Defect Description</span>
              <span className="text-rose-600 dark:text-rose-400 font-medium text-right max-w-[220px]">
                High current observed (8.7A vs ≤ 8.0A limit)
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-muted-foreground">Immediate Containment</span>
              <span className="text-foreground font-medium">Quarantine Bay Q-04 Block</span>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                toast.success("Vendor 8D notification email sent");
                setNcrModalOpen(false);
              }}
              className="h-8 text-xs text-blue-600"
            >
              Notify Vendor (8D Request)
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => setNcrModalOpen(false)}
              className="h-8 text-xs bg-[#0B3B7B] text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
