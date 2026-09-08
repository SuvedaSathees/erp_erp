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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShieldCheck, Plus, CheckCircle2 } from "lucide-react";
import { ComplianceRecord, ComplianceCategory, ComplianceType, RiskLevel } from "@/services/complianceTypes";
import { toast } from "sonner";

interface CreateComplianceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecordCreated?: (record: Partial<ComplianceRecord>) => void;
}

export function CreateComplianceModal({
  open,
  onOpenChange,
  onRecordCreated,
}: CreateComplianceModalProps) {
  const [title, setTitle] = useState("IATF 16949:2016 Clause 8.3 - Design and Development of Products");
  const [standardRef, setStandardRef] = useState("IATF 16949:2016");
  const [clauseRef, setClauseRef] = useState("Clause 8.3.1 - 8.3.6");
  const [category, setCategory] = useState<ComplianceCategory>("ISO Standard");
  const [complianceType, setComplianceType] = useState<ComplianceType>("Mandatory");
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("High");
  const [responsibleOwner, setResponsibleOwner] = useState("Dr. Anita Desai");
  const [department, setDepartment] = useState("Quality Assurance & Operations");
  const [scope, setScope] = useState("Applies to automotive electrical drives, firmware controllers, and assembly facilities.");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);

      const newId = `CMP-2026-00${Math.floor(20 + Math.random() * 30)}`;
      onRecordCreated?.({
        complianceNumber: newId,
        title,
        standardReference: standardRef,
        clauseReference: clauseRef,
        category,
        complianceType,
        riskLevel,
        responsibleOwner,
        department,
        applicabilityNote: scope,
        complianceStatus: "Compliant",
        workflowStatus: "Draft",
      });

      toast.success(`Compliance Mandate ${newId} Registered`, {
        description: `Successfully registered "${title}" under ${category}.`,
      });
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-border bg-slate-50 dark:bg-slate-900/60">
          <DialogTitle className="text-base font-bold flex items-center gap-2 text-foreground">
            <ShieldCheck className="h-5 w-5 text-[#0B3B7B]" />
            Create Compliance Requirement Mandate
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Requirement Title / Standard Clause *
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ISO 9001:2015 Clause 8.5.1 Control of Production"
              className="h-9 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Standard / Law Reference *</Label>
              <Input
                value={standardRef}
                onChange={(e) => setStandardRef(e.target.value)}
                placeholder="e.g. ISO 9001:2015"
                className="h-9 text-xs font-mono"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Clause / Section Ref</Label>
              <Input
                value={clauseRef}
                onChange={(e) => setClauseRef(e.target.value)}
                placeholder="e.g. Clause 8.5.1 (a to h)"
                className="h-9 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Category *</Label>
              <Select value={category} onValueChange={(v: ComplianceCategory) => setCategory(v)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="ISO Standard">ISO Standard</SelectItem>
                  <SelectItem value="Regulatory">Regulatory</SelectItem>
                  <SelectItem value="Internal Policy">Internal Policy</SelectItem>
                  <SelectItem value="License & Permits">License & Permits</SelectItem>
                  <SelectItem value="Certification">Certification</SelectItem>
                  <SelectItem value="Legal Register">Legal Register</SelectItem>
                  <SelectItem value="Customer Requirement">Customer Requirement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Compliance Type</Label>
              <Select value={complianceType} onValueChange={(v: ComplianceType) => setComplianceType(v)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Mandatory">Mandatory</SelectItem>
                  <SelectItem value="Statutory">Statutory</SelectItem>
                  <SelectItem value="Voluntary">Voluntary</SelectItem>
                  <SelectItem value="Contractual">Contractual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Risk Level</Label>
              <Select value={riskLevel} onValueChange={(v: RiskLevel) => setRiskLevel(v)}>
                <SelectTrigger className="h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Responsible Owner</Label>
              <Input
                value={responsibleOwner}
                onChange={(e) => setResponsibleOwner(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">Department / Function</Label>
              <Input
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="h-9 text-xs"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Applicable Scope & Facility Footprint</Label>
            <Textarea
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              rows={2}
              className="text-xs resize-none"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="bg-[#0B3B7B] hover:bg-[#092e60] text-white text-xs flex items-center gap-1.5"
            >
              {isLoading ? (
                <>Registering Mandate...</>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  Register Mandate
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateComplianceModal;
