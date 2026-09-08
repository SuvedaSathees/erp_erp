import { NcrRecord } from "@/services/ncrTypes";

interface NcrSummaryCardProps {
  record: NcrRecord;
}

export function NcrSummaryCard({ record }: NcrSummaryCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs">
      <h2 className="text-sm sm:text-base font-semibold text-foreground mb-3.5">
        NCR Summary
      </h2>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium">Affected Quantity</span>
          <span className="font-bold text-foreground font-mono">
            {record.affectedQuantity} Nos
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium">Confirmed Defect Qty</span>
          <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">
            {record.confirmedDefectQuantity} Nos
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium">Suspect Quantity</span>
          <span className="font-bold text-foreground font-mono">
            {record.suspectQuantity} Nos
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium">Severity</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            {record.severity}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-border/40">
          <span className="text-muted-foreground font-medium">
            Risk Priority Number (RPN)
          </span>
          <span className="font-bold text-foreground font-mono text-sm">
            {record.riskPriorityNumber}
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-muted-foreground font-medium">Risk Level</span>
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            {record.riskLevel}
          </span>
        </div>
      </div>
    </div>
  );
}
