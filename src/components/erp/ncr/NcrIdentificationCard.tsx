import { QrCode } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NcrRecord } from "@/services/ncrTypes";
import { toast } from "sonner";

interface NcrIdentificationCardProps {
  record: NcrRecord;
  onChange: (updates: Partial<NcrRecord>) => void;
}

export function NcrIdentificationCard({
  record,
  onChange,
}: NcrIdentificationCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border/80 p-4 sm:p-5 shadow-xs min-w-0">
      <h2 className="text-sm sm:text-base font-semibold text-foreground mb-4">
        Non-Conformance Identification
      </h2>

      <div className="space-y-4 min-w-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-w-0">
          {/* Product */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Product <span className="text-destructive">*</span>
            </Label>
            <Select
              value={record.product}
              onValueChange={(val) => onChange({ product: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70 truncate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Autonomous W-EVSE 7kW">
                  Autonomous W-EVSE 7kW
                </SelectItem>
                <SelectItem value="EV DC Fast Charger 60kW">
                  EV DC Fast Charger 60kW
                </SelectItem>
                <SelectItem value="AC Type 2 Smart Charger 22kW">
                  AC Type 2 Smart Charger 22kW
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Code */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Product Code
            </Label>
            <Input
              value={record.productCode}
              readOnly
              className="h-9 text-xs bg-muted/40 font-mono border-border/70"
            />
          </div>

          {/* Product Revision */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Product Revision
            </Label>
            <Input
              value={record.productRevision}
              onChange={(e) => onChange({ productRevision: e.target.value })}
              className="h-9 text-xs border-border/70 font-mono"
            />
          </div>

          {/* Part / Component */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Part / Component
            </Label>
            <Input
              value={record.partComponent}
              onChange={(e) => onChange({ partComponent: e.target.value })}
              className="h-9 text-xs border-border/70"
            />
          </div>

          {/* Batch / Lot No. */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Batch / Lot No.
            </Label>
            <Input
              value={record.batchLotNo}
              onChange={(e) => onChange({ batchLotNo: e.target.value })}
              className="h-9 text-xs border-border/70 font-mono"
            />
          </div>

          {/* Serial Number(s) */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Serial Number(s)
            </Label>
            <div className="relative">
              <Input
                value={record.serialNumbers}
                onChange={(e) => onChange({ serialNumbers: e.target.value })}
                className="h-9 text-xs pr-8 font-mono border-border/70"
              />
              <button
                type="button"
                onClick={() => toast.info("Barcode / QR Scanner ready for serial input")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Scan Barcode / QR"
              >
                <QrCode className="h-3.5 w-3.5 text-blue-600" />
              </button>
            </div>
          </div>

          {/* Production Order */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Production Order
            </Label>
            <Select
              value={record.productionOrder}
              onValueChange={(val) => onChange({ productionOrder: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MO-2026-00087">MO-2026-00087</SelectItem>
                <SelectItem value="MO-2026-00088">MO-2026-00088</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Work Order */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Work Order
            </Label>
            <Select
              value={record.workOrder}
              onValueChange={(val) => onChange({ workOrder: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WO-2026-00421">WO-2026-00421</SelectItem>
                <SelectItem value="WO-2026-00422">WO-2026-00422</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Operation */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Operation
            </Label>
            <Select
              value={record.operation}
              onValueChange={(val) => onChange({ operation: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OP-10">OP-10 PCB Inspection</SelectItem>
                <SelectItem value="OP-20">OP-20 Sub-assembly</SelectItem>
                <SelectItem value="OP-30 Final Enclosure">OP-30 Final Enclosure</SelectItem>
                <SelectItem value="OP-40">OP-40 Hi-Pot Test</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Machine / Equipment */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Machine / Equipment
            </Label>
            <Select
              value={record.machineEquipment}
              onValueChange={(val) => onChange({ machineEquipment: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASM-001">ASM-001</SelectItem>
                <SelectItem value="ASM-002">ASM-002</SelectItem>
                <SelectItem value="TST-005">TST-005</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Supplier */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Supplier
            </Label>
            <Select
              value={record.supplier}
              onValueChange={(val) => onChange({ supplier: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="- Select -">- Select -</SelectItem>
                <SelectItem value="TechDrive Components">TechDrive Components</SelectItem>
                <SelectItem value="Precision Plastics Ltd.">Precision Plastics Ltd.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Purchase Order */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Purchase Order
            </Label>
            <Select
              value={record.purchaseOrder}
              onValueChange={(val) => onChange({ purchaseOrder: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">-</SelectItem>
                <SelectItem value="PO-2026-0814">PO-2026-0814</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* GRN */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              GRN
            </Label>
            <Input
              value={record.grn}
              onChange={(e) => onChange({ grn: e.target.value })}
              className="h-9 text-xs border-border/70 font-mono"
            />
          </div>

          {/* Customer */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Customer
            </Label>
            <Select
              value={record.customer}
              onValueChange={(val) => onChange({ customer: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70 truncate">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GreenMobility Pvt. Ltd.">
                  GreenMobility Pvt. Ltd.
                </SelectItem>
                <SelectItem value="EcoCharge Systems">EcoCharge Systems</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sales Order */}
          <div className="space-y-1.5 min-w-0">
            <Label className="text-xs text-muted-foreground font-medium">
              Sales Order
            </Label>
            <Select
              value={record.salesOrder}
              onValueChange={(val) => onChange({ salesOrder: val })}
            >
              <SelectTrigger className="h-9 text-xs border-border/70 font-mono">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SO-2026-0312">SO-2026-0312</SelectItem>
                <SelectItem value="SO-2026-0315">SO-2026-0315</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
