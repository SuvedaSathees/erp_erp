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
import { RcaRecord, RcaType, RcaSource, RcaMethodology } from "@/services/rcaTypes";
import { Sparkles, GitCommit, Calendar, User, Hash, Link2 } from "lucide-react";
import { toast } from "sonner";

interface CreateRcaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (newRecord: Partial<RcaRecord>) => void;
}

export function CreateRcaModal({
  open,
  onOpenChange,
  onCreated,
}: CreateRcaModalProps) {
  const [rcaNumber, setRcaNumber] = useState(`RCA-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [title, setTitle] = useState("Micro-Solder Bridging on Fine-Pitch IC Packages");
  const [rcaType, setRcaType] = useState<RcaType>("Process Failure");
  const [rcaSource, setRcaSource] = useState<RcaSource>("Non-Conformance Report (NCR)");
  const [sourceRef, setSourceRef] = useState("NCR-2026-0089");
  const [methodology, setMethodology] = useState<RcaMethodology>("5-Why + Fishbone");
  const [leadInvestigator, setLeadInvestigator] = useState("Marcus Chen");
  const [targetDate, setTargetDate] = useState("20-Sep-2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !rcaNumber.trim()) {
      toast.error("Please fill in the incident title and RCA number");
      return;
    }

    const newRecord: Partial<RcaRecord> = {
      rcaNumber,
      title,
      rcaType,
      rcaSource,
      sourceReference: sourceRef,
      methodology,
      status: "Open / Active",
      leadInvestigator,
      targetDate: targetDate,
      targetClosureDate: targetDate,
      what: title,
      where: "SMT Wave Soldering Machine WS-02, Line 2",
      when: new Date().toLocaleDateString(),
      who: leadInvestigator,
      why: "Critical defect impacting product operational reliability.",
      how: "Process parameters drifted out of nominal specification window.",
      howMuch: "Initial defect rate of 3.2% across current production batch.",
      fiveWhyList: [
        {
          level: 1,
          whyQuestion: `Why did ${title.toLowerCase()} occur?`,
          answer: "Process parameter excursion during manufacturing stage.",
          isRootCause: false,
        },
        {
          level: 2,
          whyQuestion: "Why did the process parameter excursion occur?",
          answer: "Dispensing pressure dropped below operating specification.",
          isRootCause: false,
        },
        {
          level: 3,
          whyQuestion: "Why did dispensing pressure drop below operating specification?",
          answer: "Mechanical seal fatigue wear on dosing pump.",
          isRootCause: true,
        },
      ],
      immediateCause: "Parameter excursion during manufacturing cycle.",
      contributingCauses: [
        "Ambient temperature fluctuation in processing cell.",
        "Manual sampling interval insufficient for real-time drift detection.",
      ],
      rootCause: "Fatigue failure and mechanical wear of dosing seal mechanism.",
      verificationStatus: "In Progress",
      verificationEvidence: "Controlled trials with refurbished dosing unit undergoing validation.",
    };

    onCreated(newRecord);
    toast.success(`Root Cause Investigation ${rcaNumber} initiated successfully!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-primary" />
              Initiate Root Cause Analysis (RCA)
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define the defect incident, select causal diagnostic methodology (5-Why, 6M Fishbone), and link to triggering NCR or Audit.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Investigation Subject / Incident Description <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wave Solder Flux Viscosity & Bridging Investigation"
                className="h-8 text-xs font-semibold"
                required
              />
            </div>

            {/* Row: RCA Number and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  RCA Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={rcaNumber}
                  onChange={(e) => setRcaNumber(e.target.value)}
                  className="h-8 text-xs font-mono font-bold bg-muted/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Investigation Type <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={rcaType}
                  onValueChange={(val: RcaType) => setRcaType(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Process Failure">Process Failure</SelectItem>
                    <SelectItem value="Product Defect">Product Defect</SelectItem>
                    <SelectItem value="Supplier Quality">Supplier Quality</SelectItem>
                    <SelectItem value="Systemic / QMS">Systemic / QMS</SelectItem>
                    <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: Triggering Source & Reference */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Triggering Source
                </Label>
                <Select
                  value={rcaSource}
                  onValueChange={(val: RcaSource) => setRcaSource(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Non-Conformance Report (NCR)">NCR</SelectItem>
                    <SelectItem value="CAPA Investigation">CAPA Investigation</SelectItem>
                    <SelectItem value="Internal Audit Finding">Internal Audit Finding</SelectItem>
                    <SelectItem value="Customer Complaint">Customer Complaint</SelectItem>
                    <SelectItem value="Process Capability Excursion">SPC Excursion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Link2 className="w-3 h-3 text-muted-foreground" />
                  Source Reference ID
                </Label>
                <Input
                  value={sourceRef}
                  onChange={(e) => setSourceRef(e.target.value)}
                  placeholder="e.g. NCR-2026-0089"
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Row: Methodology & Lead Investigator */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Methodology <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={methodology}
                  onValueChange={(val: RcaMethodology) => setMethodology(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-Why + Fishbone">5-Why + Fishbone (Recommended)</SelectItem>
                    <SelectItem value="5-Why Analysis Only">5-Why Analysis Only</SelectItem>
                    <SelectItem value="Ishikawa (6M) Only">Ishikawa (6M) Only</SelectItem>
                    <SelectItem value="Fault Tree Analysis (FTA)">Fault Tree Analysis (FTA)</SelectItem>
                    <SelectItem value="Is / Is Not Matrix">Is / Is Not Matrix</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  Lead Investigator <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={leadInvestigator}
                  onChange={(e) => setLeadInvestigator(e.target.value)}
                  className="h-8 text-xs font-medium"
                  required
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
                className="h-8 text-xs font-semibold text-emerald-600 dark:text-emerald-400"
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
              Initialize Investigation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
