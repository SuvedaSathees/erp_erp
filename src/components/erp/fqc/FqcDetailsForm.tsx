import { Calendar, QrCode, Factory, ShieldCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FqcRecord } from "@/services/fqcTypes";
import { toast } from "sonner";

interface FqcDetailsFormProps {
  record: FqcRecord;
  onChange: (updates: Partial<FqcRecord>) => void;
}

export function FqcDetailsForm({ record, onChange }: FqcDetailsFormProps) {
  const handleScanBarcode = () => {
    toast.info("Barcode Scanner Initialized", {
      description: `Scanned Serial Range: ${record.serialRange} (50 units verified).`,
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs space-y-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border/40">
        <div>
          <h2 className="text-sm sm:text-base font-semibold text-foreground">
            Final Quality Inspection Details
          </h2>
          <p className="text-xs text-muted-foreground">
            Manufacturing lot pedigree, traceability indices, and end-of-line verification parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200">
            <Factory className="w-3 h-3" />
            {record.inspectionStage}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-primary dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200">
            <ShieldCheck className="w-3 h-3" />
            {record.samplingPlan}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs min-w-0">
        {/* Inspection Number */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Inspection Number
          </Label>
          <Input
            value={record.inspectionNo}
            readOnly
            className="h-9 text-xs font-mono font-bold bg-muted/40"
          />
        </div>

        {/* Inspection Date & Time */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Inspection Date & Time
          </Label>
          <div className="relative min-w-0">
            <Input
              value={record.inspectionDate}
              onChange={(e) => onChange({ inspectionDate: e.target.value })}
              className="h-9 text-xs pr-8 font-mono"
            />
            <Calendar className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Production Order */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Production Order
          </Label>
          <Input
            value={record.productionOrder}
            onChange={(e) => onChange({ productionOrder: e.target.value })}
            className="h-9 text-xs font-mono"
          />
        </div>

        {/* Work Order */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Work Order
          </Label>
          <Input
            value={record.workOrder}
            onChange={(e) => onChange({ workOrder: e.target.value })}
            className="h-9 text-xs font-mono"
          />
        </div>

        {/* Product Name */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Product Name
          </Label>
          <Input
            value={record.product}
            onChange={(e) => onChange({ product: e.target.value })}
            className="h-9 text-xs font-medium truncate"
          />
        </div>

        {/* Product Code & Rev */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Product Code & Rev
          </Label>
          <div className="grid grid-cols-2 gap-1.5 min-w-0">
            <Input
              value={record.productCode}
              readOnly
              className="h-9 text-xs font-mono bg-muted/40"
            />
            <Input
              value={record.productRevision}
              onChange={(e) => onChange({ productRevision: e.target.value })}
              className="h-9 text-xs font-mono"
            />
          </div>
        </div>

        {/* Batch / Lot Number */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Batch / Lot Number
          </Label>
          <Input
            value={record.batchLotNo}
            onChange={(e) => onChange({ batchLotNo: e.target.value })}
            className="h-9 text-xs font-mono font-semibold"
          />
        </div>

        {/* Serial Range */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Serial Number Range
          </Label>
          <div className="relative min-w-0">
            <Input
              value={record.serialRange}
              onChange={(e) => onChange({ serialRange: e.target.value })}
              className="h-9 text-xs font-mono pr-8"
            />
            <button
              type="button"
              onClick={handleScanBarcode}
              title="Simulate Barcode / QR Scan"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-800 transition-colors p-1"
            >
              <QrCode className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Inspection Quantity */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Inspection Sample Quantity
          </Label>
          <div className="grid grid-cols-2 gap-1.5 min-w-0">
            <Input
              type="number"
              value={record.inspectionQuantity}
              onChange={(e) => onChange({ inspectionQuantity: Number(e.target.value) })}
              className="h-9 text-xs font-mono"
            />
            <span className="h-9 px-2 flex items-center bg-muted/30 rounded border border-border/70 text-[11px] text-muted-foreground truncate">
              {record.totalProducedQuantity} produced
            </span>
          </div>
        </div>

        {/* Sampling Plan */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Sampling Plan Protocol
          </Label>
          <Select
            value={record.samplingPlan}
            onValueChange={(val) => onChange({ samplingPlan: val })}
          >
            <SelectTrigger className="h-9 text-xs truncate min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100% End-of-Line Inspection">
                100% End-of-Line Inspection
              </SelectItem>
              <SelectItem value="ANSI/ASQ Z1.4 Normal Level II">
                ANSI/ASQ Z1.4 Normal Level II
              </SelectItem>
              <SelectItem value="C=0 Zero Acceptance Plan">
                C=0 Zero Acceptance Plan
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inspector */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Inspector (Final Quality)
          </Label>
          <Input
            value={record.inspector}
            onChange={(e) => onChange({ inspector: e.target.value })}
            className="h-9 text-xs"
          />
        </div>

        {/* Quality Engineer Sign-off */}
        <div className="space-y-1.5 min-w-0">
          <Label className="text-xs text-muted-foreground font-medium">
            Quality Engineer Sign-off
          </Label>
          <Input
            value={record.qualityEngineer}
            onChange={(e) => onChange({ qualityEngineer: e.target.value })}
            className="h-9 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
