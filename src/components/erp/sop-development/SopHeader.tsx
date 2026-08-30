import {
  Save,
  Send,
  Printer,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SopRecord } from "@/services/types";
import { toast } from "sonner";

export function SopHeader({
  record,
  onSaveDraft,
  onSubmitForApproval,
  onExportReport,
}: {
  record: SopRecord;
  onSaveDraft?: () => void;
  onSubmitForApproval?: () => void;
  onExportReport?: () => void;
}) {
  return (
    <div className="bg-card text-card-foreground border border-border px-5 py-3.5 shadow-xs rounded-xl mb-4">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
        {/* Left: Identity, Title & Sub-metadata */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-muted font-mono font-semibold text-xs border border-border whitespace-nowrap">
              {record.sopId}
            </span>
            <h1 className="text-base font-bold text-foreground truncate">
              {record.title}
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
              Rev {record.revision}
            </span>
            <span className="whitespace-nowrap">Department: <strong className="text-foreground">{record.department}</strong></span>
            <span className="text-muted-foreground/60">•</span>
            <span className="whitespace-nowrap">Owner: <strong className="text-foreground">{record.processOwner}</strong></span>
            <span className="text-muted-foreground/60">•</span>
            <span className="whitespace-nowrap">Effective: <strong className="text-foreground">{record.effectiveDate}</strong></span>
          </div>
        </div>

        {/* Right: Actions Toolbar */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
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
            variant="outline"
            size="sm"
            onClick={() => toast.info("Opening full screen SOP preview...")}
            className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            Preview SOP
          </Button>

          <Button
            size="sm"
            onClick={onSubmitForApproval}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs text-xs font-semibold"
          >
            <Send className="h-3.5 w-3.5" />
            Submit for Review
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportReport}
            className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
          >
            <Printer className="h-3.5 w-3.5 text-muted-foreground" />
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}
