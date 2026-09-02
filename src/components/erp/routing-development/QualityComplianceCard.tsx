import React from "react";
import { ShieldCheck, CheckCircle2, FileText } from "lucide-react";
import type { RoutingRecord } from "@/services/types";

interface QualityComplianceCardProps {
  record: RoutingRecord;
}

export const QualityComplianceCard: React.FC<QualityComplianceCardProps> = ({
  record,
}) => {
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm p-3.5 flex flex-col justify-between text-xs hover:border-border/80 transition-all">
      <div>
        <div className="flex justify-between items-center pb-2 border-b border-border mb-2.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
            <h3 className="font-bold text-foreground text-xs">Quality & Compliance</h3>
          </div>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Critical Operations</span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
              {record.criticalOperations.join(", ")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Inspection Points</span>
            <span className="font-bold text-foreground">{record.inspectionPointsCount} Points Defined</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">SPC Required</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Yes
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Traceability Required</span>
            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Yes
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Regulatory Standards</span>
            <span className="font-bold text-foreground text-[10px] truncate max-w-[120px]" title={record.regulatoryStandards.join(", ")}>
              {record.regulatoryStandards.join(", ")}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Quality Checklist</span>
            <button
              type="button"
              onClick={() => {
                const blob = new Blob([
                  `QUALITY CHECKLIST SPECIFICATION\nFile: ${record.qualityChecklistFile}\nStandards: ${record.regulatoryStandards.join(", ")}\nCritical Ops: ${record.criticalOperations.join(", ")}\nInspection Points: ${record.inspectionPointsCount}\nTraceability: Required\nStatus: Verified Active`,
                ], { type: "text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = record.qualityChecklistFile.replace(/\.[^/.]+$/, "") + ".txt";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }}
              className="font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FileText className="w-3 h-3" /> {record.qualityChecklistFile}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
