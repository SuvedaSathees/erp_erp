import React from "react";
import {
  Save,
  Send,
  Printer,
  Plus,
} from "lucide-react";
import type { ProcessValidationRecord } from "@/services/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProcessValidationHeaderProps {
  record: ProcessValidationRecord;
  onSaveDraft: () => void;
  onSubmitForReview: () => void;
  onExport: () => void;
  onNewValidation: () => void;
}

export const ProcessValidationHeader: React.FC<ProcessValidationHeaderProps> = ({
  record,
  onSaveDraft,
  onSubmitForReview,
  onExport,
  onNewValidation,
}) => {
  return (
    <div className="bg-card text-card-foreground border border-border px-5 py-3.5 shadow-xs rounded-xl mb-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        {/* Left: Identity, Title & Sub-metadata */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-muted font-mono font-semibold text-xs border border-border whitespace-nowrap">
              {record.validationId}
            </span>
            <h1 className="text-base font-bold text-foreground truncate">
              {record.validationTitle}
            </h1>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap"
            >
              {record.workflowStatus}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 font-mono whitespace-nowrap">
              v{record.version}
            </span>
            <span className="whitespace-nowrap">Product: <strong className="text-foreground">{record.product} ({record.productRevision})</strong></span>
            <span className="text-muted-foreground/60">•</span>
            <span className="whitespace-nowrap">Process: <strong className="text-foreground">{record.manufacturingProcess}</strong></span>
            <span className="text-muted-foreground/60">•</span>
            <span className="whitespace-nowrap">Line: <strong className="text-foreground">{record.productionLine}</strong></span>
          </div>
        </div>

        {/* Right: Actions Toolbar */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
          <Button
            size="sm"
            onClick={onNewValidation}
            className="gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            New Validation
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onSaveDraft}
            className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
          >
            <Save className="h-3.5 w-3.5 text-muted-foreground" />
            Save Draft
          </Button>

          <Button
            size="sm"
            onClick={onSubmitForReview}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs text-xs font-semibold"
          >
            <Send className="h-3.5 w-3.5" />
            Submit for Review
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};
