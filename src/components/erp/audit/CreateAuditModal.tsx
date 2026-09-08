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
import { AuditRecord, AuditType, AuditCategory, AuditStatus } from "@/services/auditTypes";
import { ClipboardCheck, Sparkles, Calendar, User, MapPin, Hash } from "lucide-react";
import { toast } from "sonner";

interface CreateAuditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (newRecord: Partial<AuditRecord>) => void;
}

export function CreateAuditModal({
  open,
  onOpenChange,
  onCreated,
}: CreateAuditModalProps) {
  const [auditNumber, setAuditNumber] = useState(`AUD-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [auditTitle, setAuditTitle] = useState("Internal Quality Management System Surveillance Audit");
  const [auditType, setAuditType] = useState<AuditType>("Internal");
  const [auditCategory, setAuditCategory] = useState<AuditCategory>(
    "Quality Management System (ISO 9001)"
  );
  const [leadAuditor, setLeadAuditor] = useState("Dr. Anita Desai (Lead Auditor)");
  const [auditLocation, setAuditLocation] = useState("Plant 1 - Lines 1, 2 & SMT Bay");
  const [startDate, setStartDate] = useState("10-Sep-2026");
  const [endDate, setEndDate] = useState("12-Sep-2026");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!auditTitle.trim() || !auditNumber.trim()) {
      toast.error("Please fill in the audit title and audit number");
      return;
    }

    const newRecord: Partial<AuditRecord> = {
      auditNumber,
      auditTitle,
      auditType,
      auditCategory,
      auditStatus: "Scheduled",
      leadAuditor,
      auditLocation,
      auditDate: startDate,
      scheduledEndDate: endDate,
      objective: `Assess compliance against ${auditCategory} requirements across designated manufacturing lines.`,
      scopeSummary: `Covering ${auditLocation} including incoming, in-process, and finished goods release.`,
      methodology: "Randomized lot sampling, operator interviews, and calibrated test equipment verification.",
      checklist: [
        {
          id: `chk-${Date.now()}-1`,
          clauseRef: "Clause 4.1",
          requirement: "Understanding organization and its context - internal and external factors documented",
          areaDepartment: "Quality Assurance",
          result: "Conforming",
          findingNote: "Context review completed in Q2 management review meeting.",
          auditor: leadAuditor.split(" ")[0] || "Auditor",
        },
        {
          id: `chk-${Date.now()}-2`,
          clauseRef: "Clause 7.1.5",
          requirement: "Monitoring and measuring resources calibrated and traceable to national standards",
          areaDepartment: "Inspection Lab",
          result: "Conforming",
          findingNote: "All reference standards verified against NABL certificates.",
          auditor: leadAuditor.split(" ")[0] || "Auditor",
        },
      ],
      findings: [],
      totalItems: 2,
      compliantCount: 2,
      minorNcCount: 0,
      majorNcCount: 0,
      ofiCount: 0,
      conformanceRate: 100,
    };

    onCreated(newRecord);
    toast.success(`Audit dossier ${auditNumber} scheduled successfully!`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-primary" />
              Schedule New Quality Audit
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Define audit engagement criteria, assign lead auditor, standard clauses, and target facility boundaries.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4 text-xs">
            {/* Title */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Audit Engagement Title <span className="text-rose-500">*</span>
              </Label>
              <Input
                value={auditTitle}
                onChange={(e) => setAuditTitle(e.target.value)}
                placeholder="e.g. ISO 9001:2015 QMS Annual Surveillance Audit"
                className="h-8 text-xs font-semibold"
                required
              />
            </div>

            {/* Row: Audit Number and Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Hash className="w-3 h-3 text-muted-foreground" />
                  Audit Number <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={auditNumber}
                  onChange={(e) => setAuditNumber(e.target.value)}
                  className="h-8 text-xs font-mono font-bold bg-muted/40"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Audit Type <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={auditType}
                  onValueChange={(val: AuditType) => setAuditType(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Internal">Internal Audit</SelectItem>
                    <SelectItem value="Supplier">Supplier / Vendor Audit</SelectItem>
                    <SelectItem value="Process">Process Verification Audit</SelectItem>
                    <SelectItem value="Product">Product Quality Audit</SelectItem>
                    <SelectItem value="System">Management System Audit</SelectItem>
                    <SelectItem value="Compliance">Regulatory Compliance Audit</SelectItem>
                    <SelectItem value="Customer">Customer Audit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row: Standard Category and Lead Auditor */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Standard / Category <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={auditCategory}
                  onValueChange={(val: AuditCategory) => setAuditCategory(val)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Quality Management System (ISO 9001)">
                      ISO 9001 QMS
                    </SelectItem>
                    <SelectItem value="Automotive QMS (IATF 16949)">
                      IATF 16949 Automotive
                    </SelectItem>
                    <SelectItem value="Environmental (ISO 14001)">
                      ISO 14001 EHS
                    </SelectItem>
                    <SelectItem value="Occupational Health & Safety (ISO 45001)">
                      ISO 45001 Safety
                    </SelectItem>
                    <SelectItem value="Process & Workstation Audit">
                      Process & Workstation
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3 text-muted-foreground" />
                  Lead Auditor <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={leadAuditor}
                  onChange={(e) => setLeadAuditor(e.target.value)}
                  className="h-8 text-xs font-medium"
                  required
                />
              </div>
            </div>

            {/* Row: Location and Facility */}
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                Audit Location / Facility Boundaries
              </Label>
              <Input
                value={auditLocation}
                onChange={(e) => setAuditLocation(e.target.value)}
                placeholder="e.g. Plant 1 - Cleanroom, Assembly Line B"
                className="h-8 text-xs"
              />
            </div>

            {/* Row: Scheduled Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  Start Date <span className="text-rose-500">*</span>
                </Label>
                <Input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-8 text-xs font-medium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  Scheduled End Date
                </Label>
                <Input
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-8 text-xs font-medium"
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
              Schedule Audit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
