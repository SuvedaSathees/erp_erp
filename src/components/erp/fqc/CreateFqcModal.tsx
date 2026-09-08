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
import { FqcRecord } from "@/services/fqcTypes";
import { toast } from "sonner";
import { ClipboardCheck, Sparkles } from "lucide-react";

interface CreateFqcModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newRecord: Partial<FqcRecord>) => void;
}

export function CreateFqcModal({
  isOpen,
  onClose,
  onCreate,
}: CreateFqcModalProps) {
  const [formData, setFormData] = useState({
    inspectionNo: `FQC-2026-00${Math.floor(237 + Math.random() * 50)}`,
    inspectionDate: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) + " 11:30",
    productionOrder: "MO-2026-00088",
    workOrder: "WO-2026-00422",
    product: "Autonomous W-EVSE 7kW",
    productCode: "EVSE-7KW-001",
    productRevision: "REV-2.1",
    batchLotNo: "B-2026-09-015",
    serialRange: "SN051 - SN100",
    totalProducedQuantity: 50,
    inspectionQuantity: 50,
    samplingPlan: "100% End-of-Line Inspection",
    inspectionStage: "Final Assembly & Enclosure",
    inspector: "Rajesh K",
    qualityEngineer: "Arun K",
    customerOrder: "SO-2026-0313",
    customer: "GreenMobility Pvt. Ltd.",
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAutofillCharger = () => {
    setFormData((prev) => ({
      ...prev,
      product: "DC Fast Charger 50kW",
      productCode: "EVSE-50KW-002",
      productRevision: "REV-1.4",
      batchLotNo: "B-2026-09-016",
      serialRange: "DC001 - DC025",
      totalProducedQuantity: 25,
      inspectionQuantity: 25,
      customer: "ChargeNet Infra Solutions",
      customerOrder: "SO-2026-0489",
    }));
    toast.info("Pre-filled DC Fast Charger template");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.inspectionNo.trim()) {
      toast.error("Inspection Number is required");
      return;
    }
    if (!formData.product.trim()) {
      toast.error("Product name is required");
      return;
    }

    onCreate({
      ...formData,
      acceptedQuantity: formData.inspectionQuantity,
      rejectedQuantity: 0,
      inspectionStatus: "In Progress",
      overallResult: "Pass",
      certificate: {
        certificateNo: `QC-2026-01${Math.floor(43 + Math.random() * 50)}`,
        issueDate: formData.inspectionDate.split(" ")[0],
        batchNo: formData.batchLotNo,
        productCode: formData.productCode,
        productName: formData.product,
        quantityCertified: formData.inspectionQuantity,
        authorizedSignatory: `${formData.qualityEngineer} (Quality Assurance Lead)`,
        digitalSealVerified: true,
        status: "Pending",
      },
      defects: [],
    });

    toast.success(`Final Inspection ${formData.inspectionNo} initiated successfully!`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto min-w-0">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B3B7B] text-white flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Create Final Quality Inspection (FQC)
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Register a new end-of-line testing and pre-dispatch inspection lot.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutofillCharger}
              className="h-7 text-xs border-dashed gap-1 text-primary hover:text-primary"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Fill Fast Charger Sample
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
                placeholder="e.g. MO-2026-00088"
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
                placeholder="e.g. WO-2026-00422"
                required
              />
            </div>

            {/* Product Name */}
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs text-muted-foreground font-medium">
                Product Name *
              </Label>
              <Input
                value={formData.product}
                onChange={(e) => handleChange("product", e.target.value)}
                className="h-8 text-xs font-medium"
                placeholder="e.g. Autonomous W-EVSE 7kW"
                required
              />
            </div>

            {/* Product Code */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Product Code & Revision *
              </Label>
              <div className="grid grid-cols-2 gap-1.5">
                <Input
                  value={formData.productCode}
                  onChange={(e) => handleChange("productCode", e.target.value)}
                  className="h-8 text-xs font-mono"
                  placeholder="Code"
                  required
                />
                <Input
                  value={formData.productRevision}
                  onChange={(e) => handleChange("productRevision", e.target.value)}
                  className="h-8 text-xs font-mono"
                  placeholder="Rev"
                  required
                />
              </div>
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
                placeholder="e.g. B-2026-09-015"
                required
              />
            </div>

            {/* Serial Range */}
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-xs text-muted-foreground font-medium">
                Serial Number Range *
              </Label>
              <Input
                value={formData.serialRange}
                onChange={(e) => handleChange("serialRange", e.target.value)}
                className="h-8 text-xs font-mono"
                placeholder="e.g. SN051 - SN100"
                required
              />
            </div>

            {/* Quantities */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Total Produced Quantity
              </Label>
              <Input
                type="number"
                value={formData.totalProducedQuantity}
                onChange={(e) => handleChange("totalProducedQuantity", Number(e.target.value))}
                className="h-8 text-xs font-mono"
                min={1}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Inspection Sample Quantity
              </Label>
              <Input
                type="number"
                value={formData.inspectionQuantity}
                onChange={(e) => handleChange("inspectionQuantity", Number(e.target.value))}
                className="h-8 text-xs font-mono"
                min={1}
              />
            </div>

            {/* Sampling Plan */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Sampling Plan
              </Label>
              <Select
                value={formData.samplingPlan}
                onValueChange={(val) => handleChange("samplingPlan", val)}
              >
                <SelectTrigger className="h-8 text-xs">
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

            {/* Inspection Stage */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Inspection Stage
              </Label>
              <Select
                value={formData.inspectionStage}
                onValueChange={(val) => handleChange("inspectionStage", val)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Final Assembly & Enclosure">
                    Final Assembly & Enclosure
                  </SelectItem>
                  <SelectItem value="Sub-Assembly Packaging">
                    Sub-Assembly Packaging
                  </SelectItem>
                  <SelectItem value="Pre-Dispatch Staging">
                    Pre-Dispatch Staging
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Inspector */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Lead Inspector
              </Label>
              <Input
                value={formData.inspector}
                onChange={(e) => handleChange("inspector", e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* Quality Engineer */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                QA Lead Sign-Off
              </Label>
              <Input
                value={formData.qualityEngineer}
                onChange={(e) => handleChange("qualityEngineer", e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            {/* Customer & Order */}
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Target Customer
              </Label>
              <Input
                value={formData.customer}
                onChange={(e) => handleChange("customer", e.target.value)}
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground font-medium">
                Customer Sales Order
              </Label>
              <Input
                value={formData.customerOrder}
                onChange={(e) => handleChange("customerOrder", e.target.value)}
                className="h-8 text-xs font-mono"
              />
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
              Initialize Inspection Lot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
