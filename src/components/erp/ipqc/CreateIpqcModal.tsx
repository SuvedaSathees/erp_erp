import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IpqcRecord } from "@/services/ipqcTypes";
import { toast } from "sonner";
import { Activity, Sparkles } from "lucide-react";

interface CreateIpqcModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newRecord: Partial<IpqcRecord>) => void;
}

export function CreateIpqcModal({
  isOpen,
  onClose,
  onCreate,
}: CreateIpqcModalProps) {
  const [formData, setFormData] = useState({
    inspectionNo: `IPQC-2026-00${Math.floor(359 + Math.random() * 50)}`,
    inspectionDate:
      new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + " 15:30",
    productionOrder: "MO-2026-00087",
    workOrder: "WO-2026-00421",
    product: "EV Charger 7kW",
    productCode: "EVSE-7KW-001",
    batchLotNo: "B-2026-09-015",
    operationNo: "OP-30",
    operationName: "Assembly & Cable Fixing",
    workCenter: "WC-ASM-01",
    machineEquipment: "ASM-001",
    shift: "Shift B",
    inspector: "Priya S",
    jobCard: "JC-2026-00421",
    priority: "High" as const,
    inspectionQuantity: 5,
    sampleSize: 5,
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAutofillPcb = () => {
    setFormData((prev) => ({
      ...prev,
      operationNo: "OP-20",
      operationName: "PCB Sub-assembly & SMT Inspection",
      workCenter: "WC-ASM-02",
      machineEquipment: "ASM-002",
      jobCard: "JC-2026-00420",
      product: "EV Charger 11kW",
      productCode: "EVSE-11KW-002",
      batchLotNo: "B-2026-09-016",
    }));
    toast.info("Pre-filled PCB Sub-assembly sample template");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.inspectionNo.trim()) {
      toast.error("Inspection Number is required");
      return;
    }

    onCreate({
      ...formData,
      acceptedQuantity: formData.inspectionQuantity,
      rejectedQuantity: 0,
      defectRate: 0.0,
      inspectionStatus: "In Progress",
      overallResult: "Pass",
    });

    toast.success(`In-Process Inspection ${formData.inspectionNo} registered!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto min-w-0">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B3B7B] text-white flex items-center justify-center">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Create In-Process Inspection (IPQC)
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Register a stage-gate inspection checkpoint for shop-floor operations.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutofillPcb}
              className="h-7 text-xs border-dashed gap-1 text-primary hover:text-primary"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Fill PCB Sample
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs py-2 min-w-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0">
            {/* Inspection No */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Inspection Number *
              </Label>
              <Input
                value={formData.inspectionNo}
                onChange={(e) => handleChange("inspectionNo", e.target.value)}
                className="h-8 text-xs font-mono font-bold"
                required
              />
            </div>

            {/* Inspection Date */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Inspection Date & Time *
              </Label>
              <Input
                value={formData.inspectionDate}
                onChange={(e) => handleChange("inspectionDate", e.target.value)}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            {/* Production Order */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Production Order *
              </Label>
              <Input
                value={formData.productionOrder}
                onChange={(e) => handleChange("productionOrder", e.target.value)}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            {/* Work Order */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Work Order *
              </Label>
              <Input
                value={formData.workOrder}
                onChange={(e) => handleChange("workOrder", e.target.value)}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            {/* Product */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Product *
              </Label>
              <Input
                value={formData.product}
                onChange={(e) => handleChange("product", e.target.value)}
                className="h-8 text-xs font-medium"
                required
              />
            </div>

            {/* Product Code */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Product Code
              </Label>
              <Input
                value={formData.productCode}
                onChange={(e) => handleChange("productCode", e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>

            {/* Batch / Lot No */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Batch / Lot Number *
              </Label>
              <Input
                value={formData.batchLotNo}
                onChange={(e) => handleChange("batchLotNo", e.target.value)}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            {/* Job Card */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Job Card *
              </Label>
              <Input
                value={formData.jobCard}
                onChange={(e) => handleChange("jobCard", e.target.value)}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            {/* Operation No & Name */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Operation Number *
              </Label>
              <Select
                value={formData.operationNo}
                onValueChange={(val) => {
                  let opName = "Assembly & Cable Fixing";
                  if (val === "OP-10") opName = "Frame Prep & Bracket Mounting";
                  else if (val === "OP-20") opName = "PCB Sub-assembly";
                  else if (val === "OP-40") opName = "Pneumatic & Leak Testing";
                  else if (val === "OP-50") opName = "Final Packaging & Labeling";
                  setFormData((prev) => ({ ...prev, operationNo: val, operationName: opName }));
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OP-10">OP-10 (Frame Prep)</SelectItem>
                  <SelectItem value="OP-20">OP-20 (PCB Sub-assembly)</SelectItem>
                  <SelectItem value="OP-30">OP-30 (Assembly & Cable Fixing)</SelectItem>
                  <SelectItem value="OP-40">OP-40 (Pneumatic Testing)</SelectItem>
                  <SelectItem value="OP-50">OP-50 (Final Packaging)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Operation Name
              </Label>
              <Input
                value={formData.operationName}
                onChange={(e) => handleChange("operationName", e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* Work Center */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Work Center *
              </Label>
              <Select
                value={formData.workCenter}
                onValueChange={(val) => handleChange("workCenter", val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WC-ASM-01">WC-ASM-01 (Manual Line 1)</SelectItem>
                  <SelectItem value="WC-ASM-02">WC-ASM-02 (Semi-auto Line)</SelectItem>
                  <SelectItem value="WC-TST-01">WC-TST-01 (Hi-Pot Bench)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Machine */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Machine / Equipment
              </Label>
              <Input
                value={formData.machineEquipment}
                onChange={(e) => handleChange("machineEquipment", e.target.value)}
                className="h-8 text-xs font-mono"
              />
            </div>

            {/* Shift & Inspector */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Shift
              </Label>
              <Select
                value={formData.shift}
                onValueChange={(val) => handleChange("shift", val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shift A">Shift A (Morning)</SelectItem>
                  <SelectItem value="Shift B">Shift B (Evening)</SelectItem>
                  <SelectItem value="Shift C">Shift C (Night)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Lead Inspector
              </Label>
              <Select
                value={formData.inspector}
                onValueChange={(val) => handleChange("inspector", val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Priya S">Priya S (Lead QA)</SelectItem>
                  <SelectItem value="Arun K">Arun K (Senior QA)</SelectItem>
                  <SelectItem value="Meena R">Meena R (Inspector)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sample Qty */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Inspection Sample Size (Nos)
              </Label>
              <Input
                type="number"
                value={formData.inspectionQuantity}
                onChange={(e) =>
                  handleChange("inspectionQuantity", Number(e.target.value))
                }
                className="h-8 text-xs font-mono"
                min={1}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Priority
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(val: any) => handleChange("priority", val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border/60 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#0B3B7B] hover:bg-[#092e60] text-white text-xs font-semibold px-4"
            >
              Initialize IPQC Record
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
