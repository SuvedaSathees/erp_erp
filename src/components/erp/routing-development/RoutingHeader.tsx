import React from "react";
import {
  Save,
  Send,
  Printer,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { RoutingRecord } from "@/services/types";
import { toast } from "sonner";

interface RoutingHeaderProps {
  record: RoutingRecord;
  onSaveDraft: () => void;
  onSubmitForReview: () => void;
  onExport: () => void;
  onNewRouting?: () => void;
}

export const RoutingHeader: React.FC<RoutingHeaderProps> = ({
  record,
  onSaveDraft,
  onSubmitForReview,
  onExport,
}) => {
  return (
    <div className="bg-card text-card-foreground border border-border px-5 py-3.5 shadow-xs rounded-xl mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        {/* Left: Identity, Title & Sub-metadata */}
        <div className="space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-muted font-mono font-semibold text-xs border border-border">
              {record.routingId}
            </span>
            <h1 className="text-base font-bold text-foreground">
              {record.routingName}
            </h1>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 text-xs font-semibold px-2.5 py-0.5"
            >
              {record.workflowStatus}
            </Badge>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 font-mono">
              Rev {record.routingVersion}
            </span>
            <span>Product: <strong className="text-foreground">{record.product}</strong></span>
            <span>•</span>
            <span>Owner: <strong className="text-foreground">{record.processOwner}</strong></span>
            <span>•</span>
            <span>Effective: <strong className="text-foreground">{record.effectiveDate || "01 Jul 2024"}</strong></span>
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
            variant="outline"
            size="sm"
            onClick={() => toast.info("Opening full routing workflow preview...")}
            className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
          >
            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
            Preview Routing
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
