import {
  FileText,
  Layers,
  ClipboardCheck,
  FileCode,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { NcrRecord } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrLinkedRecordsCardProps {
  record: NcrRecord;
  onCreateCapa?: () => void;
}

export function NcrLinkedRecordsCard({
  record,
  onCreateCapa,
}: NcrLinkedRecordsCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs">
      <h2 className="text-sm sm:text-base font-semibold text-foreground mb-3">
        Linked Records
      </h2>

      <div className="space-y-2.5 text-xs">
        {/* Production Order */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-blue-50 dark:bg-blue-950/50 text-blue-600">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <span className="text-muted-foreground font-medium">Production Order</span>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.info(`Opening Production Order ${record.productionOrder}`)
            }
            className="font-mono font-semibold text-foreground hover:text-blue-600 transition-colors"
          >
            {record.productionOrder}
          </button>
        </div>

        {/* Work Order */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
              <Layers className="h-3.5 w-3.5" />
            </div>
            <span className="text-muted-foreground font-medium">Work Order</span>
          </div>
          <button
            type="button"
            onClick={() => toast.info(`Opening Work Order ${record.workOrder}`)}
            className="font-mono font-semibold text-foreground hover:text-emerald-600 transition-colors"
          >
            {record.workOrder}
          </button>
        </div>

        {/* Inspection Record */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600">
              <ClipboardCheck className="h-3.5 w-3.5" />
            </div>
            <span className="text-muted-foreground font-medium">Inspection Record</span>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.info(`Navigating to Inspection ${record.sourceReference}`)
            }
            className="font-mono font-semibold text-foreground hover:text-cyan-600 transition-colors"
          >
            {record.sourceReference}
          </button>
        </div>

        {/* Drawing Reference */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-orange-50 dark:bg-orange-950/50 text-orange-600">
              <FileCode className="h-3.5 w-3.5" />
            </div>
            <span className="text-muted-foreground font-medium">Drawing Reference</span>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.info("Viewing CAD Drawing DRW-EVSE-003 rev 2.1 (Housing Shell)")
            }
            className="font-mono font-semibold text-foreground hover:text-orange-600 transition-colors"
          >
            DRW-EVSE-003
          </button>
        </div>

        {/* Control Plan */}
        <div className="flex items-center justify-between py-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-amber-50 dark:bg-amber-950/50 text-amber-600">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <span className="text-muted-foreground font-medium">Control Plan</span>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Opening Control Plan CP-EVSE-001")}
            className="font-mono font-semibold text-foreground hover:text-amber-600 transition-colors"
          >
            CP-EVSE-001
          </button>
        </div>

        {/* Related CAPA */}
        <div className="flex items-center justify-between pt-1 border-t border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center bg-purple-50 dark:bg-purple-950/50 text-purple-600">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-muted-foreground font-medium">Related CAPA</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground text-[11px]">
              {record.capaStatus || "Not Created"}
            </span>
            <button
              type="button"
              onClick={onCreateCapa}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-0.5 ml-1 transition-colors"
            >
              <span>Create CAPA</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
