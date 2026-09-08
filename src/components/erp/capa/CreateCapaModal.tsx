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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CapaRecord, CapaType, CapaSource, CapaSeverity } from "@/services/capaTypes";
import { RefreshCw, Sparkles, Calendar, User, Hash, Link2, Box } from "lucide-react";
import { toast } from "sonner";

interface CreateCapaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (newRecord: Partial<CapaRecord>) => void;
}

export function CreateCapaModal({
  open,
  onOpenChange,
  onCreated,
}: CreateCapaModalProps) {
  const [capaNumber, setCapaNumber] = useState(`CAPA-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState("Wave Solder Bridging & Solder Ball Defect Prevention");
  const [capaType, setCapaType] = useState<CapaType>("Corrective + Preventive");
  const [source, setSource] = useState<CapaSource>("Non-Conformance Report (NCR)");
  const [sourceRef, setSourceRef] = useState("NCR-2026-0089");
  const [severity, setSeverity] = useState<CapaSeverity>("Major");
  const [owner, setOwner] = useState("Marcus Chen");
  const [department, setDepartment] = useState("Quality Assurance & Manufacturing");
  const [productName, setProductName] = useState("Power Inverter PCB Assembly 400W");
  const [partNumber, setPartNumber] = useState("PCB-PWR-400W");
  const [productionLine, setProductionLine] = useState("SMT Assembly Line 2");
  const [targetDate, setTargetDate] = useState("25-Sep-2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !capaNumber.trim()) {
      toast.error("Please enter a CAPA title and number");
      return;
    }

    const newRecord: Partial<CapaRecord> = {
      capaNumber,
      title,
      capaType,
      source,
      sourceReference: sourceRef,
      severity,
      owner,
      department,
      status: "Action Implementation",
      workflowStatus: "Active Execution",
      targetClosureDate: targetDate,
      productName,
      partNumber,
      productionLine,
      defectDescription: `Process excursion leading to non-conformance. Immediate CAPA initiated for ${title}.`,
      defectRate: "3.5% (Target < 0.5%)",
      initialRpn: 140,
      residualRpn: 28,
      rpnReductionPercent: 80,
      severityScore: severity === "Critical" ? 9 : severity === "Major" ? 6 : 4,
      occurrenceScore: 5,
      detectionScore: 4,
      rootCauseSummary: "Under investigation via linked RCA procedure.",
      actions: [
        {
          id: `act-${Date.now()}-1`,
          actionType: "Containment",
          description: "Quarantine affected production lots and initiate 100% inspection gate.",
          assignedTo: owner,
          department,
          targetDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString(),
          status: "In Progress",
          evidenceNote: "Quarantine traveler issued.",
        },
        {
          id: `act-${Date.now()}-2`,
          actionType: "Corrective Action",
          description: "Service and recalibrate dispensing tooling to nominal operating specifications.",
          assignedTo: "Maintenance Engineering",
          department: "Maintenance",
          targetDate: new Date(Date.now() + 86400000 * 7).toLocaleDateString(),
          status: "Open",
          evidenceNote: "Work order scheduled.",
        },
        {
          id: `act-${Date.now()}-3`,
          actionType: "Preventive Action",
          description: "Update control plan and train operators on shift verification protocol.",
          assignedTo: owner,
          department,
          targetDate: targetDate,
          status: "Open",
          evidenceNote: "SOP revision in progress.",
        },
      ],
      effectivenessCriteria: "Zero defect recurrence over 30 continuous operational days.",
      verificationMethod: "100% AOI inspection logs and weekly SPC X-bar review.",
      verificationResults: "Awaiting pilot production run verification data.",
      isEffective: false,
    };

    onCreated(newRecord);
    toast.success(`CAPA ${capaNumber} initiated successfully!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Initiate CAPA Investigation
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Create a closed-loop Corrective & Preventive Action plan linked to Non-Conformance, Audit, or Customer feedback.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                CAPA Title / Problem Summary <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. SMT Wave-Soldering Bridging & Solder Ball Defect Prevention"
                className="h-8 text-xs font-semibold"
                required
              />
            </div>

            {/* Row: CAPA Number and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  CAPA Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={capaNumber}
                  onChange={(e) => setCapaNumber(e.target.value)}
                  className="h-8 text-xs font-mono font-bold bg-muted/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  CAPA Type <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={capaType}
                  onValueChange={(val: CapaType) => setCapaType(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corrective">Corrective Action</SelectItem>
                    <SelectItem value="Preventive">Preventive Action</SelectItem>
                    <SelectItem value="Corrective + Preventive">Corrective + Preventive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: Triggering Source & Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  CAPA Source <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={source}
                  onValueChange={(val: CapaSource) => setSource(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Non-Conformance Report (NCR)">Non-Conformance (NCR)</SelectItem>
                    <SelectItem value="Internal Quality Audit">Internal Quality Audit</SelectItem>
                    <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                    <SelectItem value="Supplier Quality Issue">Supplier Quality Issue</SelectItem>
                    <SelectItem value="Quality Trend Analysis">Quality Trend Analysis</SelectItem>
                    <SelectItem value="Process Failure (FMEA)">Process Failure (PFMEA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-muted-foreground" />
                  Source Reference No.
                </Label>
                <Input
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  placeholder="e.g. NCR-2026-0089"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Row: Severity & Owner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Severity Level <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={severity}
                  onValueChange={(val: CapaSeverity) => setSeverity(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="Major">Major</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Minor">Minor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  CAPA Owner <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className="h-8 text-xs font-medium"
                  required
                />
              </div>
            </div>

            {/* Product & Process Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Box className="w-3 h-3 text-muted-foreground" />
                  Affected Product
                </Label>
                <Input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Part Number / SKU
                </Label>
                <Input
                  value={partNumber}
                  onChange={(e) => setPartNumber(e.target.value)}
                  className="h-8 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Production Line
                </Label>
                <Input
                  value={productionLine}
                  onChange={(e) => setProductionLine(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Target Closure Date */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                Target Closure Date
              </Label>
              <Input
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="h-8 text-xs font-semibold text-rose-600 dark:text-rose-400"
              />
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
              Register CAPA
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
