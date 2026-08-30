import {
  Save,
  Send,
  MoreHorizontal,
  Printer,
  Share2,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CapacityPlanningRecord } from "@/services/types";
import { toast } from "sonner";

export function CapacityPlanningHeader({
  record,
  onSaveDraft,
  onSubmitForReview,
  onExportReport,
}: {
  record: CapacityPlanningRecord;
  onSaveDraft?: () => void;
  onSubmitForReview?: () => void;
  onExportReport?: () => void;
}) {
  return (
    <div className="bg-card text-card-foreground border-b border-border px-5 py-3 shadow-xs rounded-lg mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        {/* Left: Identity, Title & Sub-metadata */}
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-[11px] border border-border">
              {record.planningId}
            </span>
            <h1 className="text-sm sm:text-base font-bold text-foreground">
              {record.projectName}
            </h1>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 text-[10px] font-bold"
            >
              {record.workflowStatus}
            </Badge>
            <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 font-mono">
              {record.planningVersion}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>Plant: <strong className="text-foreground">{record.plantName}</strong></span>
            <span>•</span>
            <span>Engineer: <strong className="text-foreground">{record.engineerName}</strong></span>
            <span>•</span>
            <span>Period: <strong className="text-foreground">{record.planningPeriod}</strong></span>
          </div>
        </div>

        {/* Right: Actions Toolbar */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
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
