import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import type { IqcRecord } from "@/services/iqcTypes";

interface CreateIqcModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (newRecord: Partial<IqcRecord>) => void;
}

export const CreateIqcModal: React.FC<CreateIqcModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    inspectionNo: `IQC-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100).padStart(5, "0")}`,
    inspectionDate: new Date().toISOString().slice(0, 10) + " 10:00",
    grnNumber: "GR-2026-000452",
    purchaseOrder: "PO-2026-0188",
    supplier: "TechDrive Components Pvt. Ltd.",
    supplierCode: "SUP-00056",
    materialItem: "BLDC Motor 2kW",
    itemCode: "MAT-MOTOR-001",
    itemRevision: "REV-03",
    batchLotNo: `LOT-${new Date().getFullYear()}-09-${Math.floor(Math.random() * 80) + 20}`,
    receivedQty: 500,
    inspectionQty: 80,
    samplingPlan: "ANSI/ASQ Z1.4",
    aql: "1.5",
    inspectionLevel: "Level II",
    inspectionType: "Dimensional & Functional",
    inspectionPlan: "IQP-MOTOR-001",
    inspector: "K. Priya",
  });

  const handleAutoFill = () => {
    setFormData({
      inspectionNo: `IQC-2026-${String(Math.floor(Math.random() * 800) + 200).padStart(5, "0")}`,
      inspectionDate: "08-Sep-2026 11:15",
      grnNumber: "GR-2026-000492",
      purchaseOrder: "PO-2026-0195",
      supplier: "Alpha Stamping Solutions",
      supplierCode: "SUP-00082",
      materialItem: "Stator Core Lamination Pack",
      itemCode: "MAT-STTR-004",
      itemRevision: "REV-02",
      batchLotNo: "LOT-2026-09-028",
      receivedQty: 1200,
      inspectionQty: 125,
      samplingPlan: "ANSI/ASQ Z1.4",
      aql: "1.0",
      inspectionLevel: "Level II",
      inspectionType: "Dimensional & Visual",
      inspectionPlan: "IQP-STTR-002",
      inspector: "Arun K.",
    });
    toast.success("Autofilled sample IQC receipt data");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.grnNumber || !formData.supplier || !formData.materialItem) {
      toast.error("Please fill all required mandatory fields (*)");
      return;
    }

    onSubmit({
      ...formData,
      status: "In Progress",
      disposition: "Quarantine",
      inventoryStatus: "Blocked",
      acceptedQty: formData.inspectionQty,
      rejectedQty: 0,
      defectRate: 0.0,
      qualityScore: 95,
      overallResult: "Pass",
    });

    toast.success(`Created Inspection ${formData.inspectionNo}`, {
      description: `GRN ${formData.grnNumber} placed in Quarantine for sampling.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-full p-5 sm:p-6 bg-card border border-border shadow-xl rounded-xl">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0B3B7B] text-white flex items-center justify-center font-bold text-xs">
                IQC
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  Create Incoming Inspection (IQC)
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Log a new inbound goods receipt lot, select AQL sampling plan, and initiate quality verification.
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAutoFill}
              className="h-7 text-xs gap-1 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autofill Sample</span>
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-2.5 flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
            <span>
              All incoming materials are quarantined automatically until ANSI/ASQ sampling and disposition clearance are completed.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {/* Inspection No */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Inspection No.</Label>
              <Input
                value={formData.inspectionNo}
                onChange={(e) => setFormData({ ...formData, inspectionNo: e.target.value })}
                className="h-8 text-xs font-mono bg-muted/40"
              />
            </div>

            {/* Date */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Inspection Date *</Label>
              <Input
                value={formData.inspectionDate}
                onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                className="h-8 text-xs font-mono"
              />
            </div>

            {/* GRN Number */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">GRN Number *</Label>
              <Input
                value={formData.grnNumber}
                onChange={(e) => setFormData({ ...formData, grnNumber: e.target.value })}
                className="h-8 text-xs font-mono"
                placeholder="GR-2026-XXXXXX"
                required
              />
            </div>

            {/* Purchase Order */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Purchase Order *</Label>
              <Input
                value={formData.purchaseOrder}
                onChange={(e) => setFormData({ ...formData, purchaseOrder: e.target.value })}
                className="h-8 text-xs font-mono"
                placeholder="PO-2026-XXXX"
                required
              />
            </div>

            {/* Supplier */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Supplier Name *</Label>
              <Input
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="h-8 text-xs"
                required
              />
            </div>

            {/* Supplier Code */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Supplier Code</Label>
              <Input
                value={formData.supplierCode}
                onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })}
                className="h-8 text-xs font-mono bg-muted/40"
              />
            </div>

            {/* Material / Item */}
            <div className="space-y-1 sm:col-span-2">
              <Label className="text-[11px] font-medium text-foreground">Material / Item Name *</Label>
              <Input
                value={formData.materialItem}
                onChange={(e) => setFormData({ ...formData, materialItem: e.target.value })}
                className="h-8 text-xs font-medium"
                required
              />
            </div>

            {/* Item Code */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Item Code</Label>
              <Input
                value={formData.itemCode}
                onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                className="h-8 text-xs font-mono bg-muted/40"
              />
            </div>

            {/* Batch / Lot */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Batch / Lot No. *</Label>
              <Input
                value={formData.batchLotNo}
                onChange={(e) => setFormData({ ...formData, batchLotNo: e.target.value })}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            {/* Received Qty */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Received Quantity (Nos) *</Label>
              <Input
                type="number"
                value={formData.receivedQty}
                onChange={(e) => setFormData({ ...formData, receivedQty: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            {/* Sample Qty */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Inspection Sample Qty *</Label>
              <Input
                type="number"
                value={formData.inspectionQty}
                onChange={(e) => setFormData({ ...formData, inspectionQty: parseInt(e.target.value) || 0 })}
                className="h-8 text-xs font-mono"
                required
              />
            </div>

            {/* Sampling Plan */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Sampling Plan</Label>
              <Select
                value={formData.samplingPlan}
                onValueChange={(val) => setFormData({ ...formData, samplingPlan: val })}
              >
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="ANSI/ASQ Z1.4">ANSI/ASQ Z1.4 (Standard)</SelectItem>
                  <SelectItem value="ISO 2859-1">ISO 2859-1 Normal</SelectItem>
                  <SelectItem value="100% Full Inspection">100% Full Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* AQL */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">AQL Standard</Label>
              <Select
                value={formData.aql}
                onValueChange={(val) => setFormData({ ...formData, aql: val })}
              >
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="1.5">AQL 1.5 (Standard)</SelectItem>
                  <SelectItem value="1.0">AQL 1.0 (Critical)</SelectItem>
                  <SelectItem value="0.65">AQL 0.65 (High Precision)</SelectItem>
                  <SelectItem value="2.5">AQL 2.5 (Minor)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Inspector */}
            <div className="space-y-1">
              <Label className="text-[11px] font-medium text-foreground">Assigned Inspector *</Label>
              <Input
                value={formData.inspector}
                onChange={(e) => setFormData({ ...formData, inspector: e.target.value })}
                className="h-8 text-xs"
                required
              />
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="h-8 text-xs gap-1.5 bg-[#0B3B7B] hover:bg-[#092e60] text-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Register IQC Lot</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
