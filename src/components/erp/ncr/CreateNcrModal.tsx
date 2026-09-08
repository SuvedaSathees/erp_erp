import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NcrRecord, NcrPriority, NcrSource, DefectCategory } from "@/services/ncrTypes";
import { ShieldAlert, Sparkles, Calendar, User, Hash, Box, AlertOctagon } from "lucide-react";
import { toast } from "sonner";

interface CreateNcrModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (newRecord: Partial<NcrRecord>) => void;
}

export function CreateNcrModal({
  open,
  onOpenChange,
  onCreated,
}: CreateNcrModalProps) {
  const [ncrNumber, setNcrNumber] = useState(`NCR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState("Surface scratch on charging connector housing");
  const [product, setProduct] = useState("Autonomous W-EVSE 7kW");
  const [productCode, setProductCode] = useState("EVSE-7KW-001");
  const [partComponent, setPartComponent] = useState("Charging Connector");
  const [ncrSource, setNcrSource] = useState<NcrSource>("In-Process Inspection");
  const [sourceRef, setSourceRef] = useState("IPQC-2026-00358");
  const [priority, setPriority] = useState<NcrPriority>("High");
  const [severity, setSeverity] = useState<"Critical" | "Major" | "Minor">("Major");
  const [defectCategory, setDefectCategory] = useState<DefectCategory>("Visual");
  const [problemDescription, setProblemDescription] = useState(
    "Multiple units show visible surface scratches on the charging connector housing."
  );
  const [affectedQty, setAffectedQty] = useState(50);
  const [defectQty, setDefectQty] = useState(2);
  const [plant, setPlant] = useState("Chennai Plant");
  const [department, setDepartment] = useState("Production");
  const [reportedBy, setReportedBy] = useState("Rajesh K");
  const [responsibleOwner, setResponsibleOwner] = useState("Priya S");
  const [dueDate, setDueDate] = useState("20-Sep-2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !ncrNumber.trim()) {
      toast.error("Please enter NCR Title and Number");
      return;
    }

    const newRecord: Partial<NcrRecord> = {
      ncrNumber,
      nonConformanceTitle: title,
      ncrDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }) + " 14:30",
      ncrSource,
      sourceReference: sourceRef,
      organization: "Magnertia Manufacturing Pvt. Ltd.",
      plant,
      department,
      location: "Assembly Line 1",
      reportedBy,
      responsibleOwner,
      qualityEngineer: "Arun K",
      priority,
      severity,
      ncrStatus: "Open",
      dueDate,
      product,
      productCode,
      productRevision: "REV-2.1",
      partComponent,
      batchLotNo: "B-2026-09-014",
      serialNumbers: "SN001, SN002, SN003",
      productionOrder: "MO-2026-00087",
      workOrder: "WO-2026-00421",
      operation: "OP-30 Final Enclosure",
      machineEquipment: "ASM-001",
      customer: "GreenMobility Pvt. Ltd.",
      salesOrder: "SO-2026-0312",
      defectCategory,
      defectCode: "DC-001 (Scratch / Scuff)",
      detectionMethod: ncrSource,
      problemDescription,
      requirementSpecification: "Housing surface shall be free from scratches, dents or cosmetic defects as per drawing DRW-EVSE-003.",
      detectionDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      detectionLocation: "Assembly Line 1",
      actualCondition: "Surface scratches observed on top cover near connector.",
      expectedCondition: "Clean surface finish without scratches.",
      affectedCharacteristic: "Housing Surface Finish",
      affectedQuantity: Number(affectedQty) || 50,
      confirmedDefectQuantity: Number(defectQty) || 2,
      suspectQuantity: (Number(affectedQty) || 50) - (Number(defectQty) || 2),
      riskPriorityNumber: severity === "Critical" ? 240 : severity === "Major" ? 180 : 80,
      riskLevel: severity === "Critical" ? "Critical" : severity === "Major" ? "High" : "Medium",
      containmentRequired: true,
      containmentStatus: "In Progress",
      containmentAction: `Segregated ${affectedQty} units, stopped production, informed line supervisor.`,
      quarantineLocation: "QA Hold Area - A1",
      containmentOwner: responsibleOwner,
      containmentDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      recentActivities: [
        {
          id: `act-${Date.now()}`,
          action: "NCR Created",
          timestamp: "Just now",
          user: reportedBy,
          details: `NCR ${ncrNumber} registered for ${title}`,
        },
      ],
    };

    onCreated(newRecord);
    toast.success(`NCR ${ncrNumber} created and assigned successfully!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Initiate Non-Conformance Report (NCR)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Capture defect symptoms, affected batch lots, quarantine disposition, and assign to Quality Engineering.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-3.5 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Non-Conformance Title / Defect Summary <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Surface scratch on charging connector housing"
                className="h-8 text-xs font-semibold"
                required
              />
            </div>

            {/* Row: NCR Number and Source */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  NCR Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={ncrNumber}
                  onChange={(e) => setNcrNumber(e.target.value)}
                  className="h-8 text-xs font-mono font-bold bg-muted/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  NCR Source <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={ncrSource}
                  onValueChange={(val: NcrSource) => setNcrSource(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In-Process Inspection">In-Process Inspection (IPQC)</SelectItem>
                    <SelectItem value="Incoming">Incoming Inspection (IQC)</SelectItem>
                    <SelectItem value="Final">Final Inspection (FQC)</SelectItem>
                    <SelectItem value="Supplier">Supplier Quality</SelectItem>
                    <SelectItem value="Customer">Customer Complaint</SelectItem>
                    <SelectItem value="Audit">Quality Audit</SelectItem>
                    <SelectItem value="Production">Production Line</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: Product and Part */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Box className="w-3 h-3 text-muted-foreground" />
                  Product Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  className="h-8 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Part / Component
                </Label>
                <Input
                  value={partComponent}
                  onChange={(e) => setPartComponent(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Row: Severity, Priority & Defect Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Severity <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={severity}
                  onValueChange={(val: any) => setSeverity(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Priority <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={priority}
                  onValueChange={(val: NcrPriority) => setPriority(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Defect Category <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={defectCategory}
                  onValueChange={(val: DefectCategory) => setDefectCategory(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Visual">Visual</SelectItem>
                    <SelectItem value="Dimensional">Dimensional</SelectItem>
                    <SelectItem value="Functional">Functional</SelectItem>
                    <SelectItem value="Material">Material</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Assembly">Assembly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Problem Description <span className="text-rose-500">*</span>
              </Label>
              <Textarea
                value={problemDescription}
                onChange={(e) => setProblemDescription(e.target.value)}
                rows={2}
                className="text-xs resize-none"
                required
              />
            </div>

            {/* Quantities */}
            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Affected Quantity (Nos)
                </Label>
                <Input
                  type="number"
                  value={affectedQty}
                  onChange={(e) => setAffectedQty(Number(e.target.value))}
                  className="h-8 text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Confirmed Defect Quantity (Nos)
                </Label>
                <Input
                  type="number"
                  value={defectQty}
                  onChange={(e) => setDefectQty(Number(e.target.value))}
                  className="h-8 text-xs font-semibold text-rose-600 dark:text-rose-400"
                />
              </div>
            </div>

            {/* Owner & Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  Responsible Owner <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={responsibleOwner}
                  onChange={(e) => setResponsibleOwner(e.target.value)}
                  className="h-8 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  Due Date
                </Label>
                <Input
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="h-8 text-xs font-semibold text-primary"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-border/60 gap-2">
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
              className="h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Register NCR
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
