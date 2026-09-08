import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck,
  Factory,
  Users,
  ShieldAlert,
  Calculator,
  CheckCircle2,
  AlertTriangle,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import type { ApqpRecord } from "@/services/types";

interface ReadinessDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domain: "design" | "validation" | "supplier" | "risk" | "cost" | null;
  record: ApqpRecord;
}

interface ChecklistItem {
  name: string;
  target: string;
  actual: string;
  status: "Pass" | "In Progress" | "Action Required";
  owner: string;
}

export const ReadinessDetailsModal: React.FC<ReadinessDetailsModalProps> = ({
  open,
  onOpenChange,
  domain,
  record,
}) => {
  if (!domain) return null;

  const getDomainData = () => {
    switch (domain) {
      case "design":
        return {
          title: "Design Readiness Audit & Parameter Breakdown",
          score: record.designScore ?? 85,
          status: "Capable (85/100)",
          icon: FileCheck,
          color: "#10b981",
          description: "CAD geometry, 3D stack-up tolerances, BOM structure, and DFMEA critical characteristics.",
          items: [
            { name: "3D CAD Model Geometry Finalized", target: "100%", actual: "94%", status: "Pass", owner: "Neha Reddy" },
            { name: "Engineering BOM Hierarchy Released", target: "Released", actual: "Released", status: "Pass", owner: "K. Raman" },
            { name: "DFMEA High RPN Mitigation (RPN < 100)", target: "Max 100", actual: "Max 48", status: "Pass", owner: "Neha Reddy" },
            { name: "Material & Resin Certification Verified", target: "100%", actual: "100%", status: "Pass", owner: "S. Swaminathan" },
            { name: "Design Validation Plan & Report (DVP&R)", target: "Approved", actual: "In Progress (90%)", status: "In Progress", owner: "Rahul Sharma" },
          ] as ChecklistItem[],
        };
      case "validation":
        return {
          title: "Validation Readiness & PPAP Gate Review",
          score: record.validationScore ?? 82,
          status: "On Track (82/100)",
          icon: Factory,
          color: "#3b82f6",
          description: "Production trial runs, process capability study (Cpk), and PPAP Level 3 element readiness.",
          items: [
            { name: "PPAP Level 3 Submission Dossier", target: "Level 3", actual: "Level 3 (16/18 elements)", status: "In Progress", owner: "Arun Kumar" },
            { name: "Pilot Trial Production Run (50 Units)", target: "Passed", actual: "Passed (Zero Critical Defect)", status: "Pass", owner: "Vikram Singh" },
            { name: "Process Capability Index (Cpk)", target: "≥ 1.67", actual: "1.82", status: "Pass", owner: "Arun Kumar" },
            { name: "Gage R&R Measurement Systems Analysis", target: "< 10%", actual: "8.4%", status: "Pass", owner: "Arun Kumar" },
            { name: "IP67 Weatherproof Chamber Validation", target: "Certified", actual: "Certified (IEC 60529)", status: "Pass", owner: "External Lab" },
          ] as ChecklistItem[],
        };
      case "supplier":
        return {
          title: "Supplier Quality & Tier-1 Audit Scorecard",
          score: record.supplierQualityScore ?? 80,
          status: "Qualified (80/100)",
          icon: Users,
          color: "#f97316",
          description: "Vendor qualification audits, supplier PPAP approvals, component quality PPM, and delivery readiness.",
          items: [
            { name: "Tier-1 Critical Suppliers Audited", target: "12 / 12", actual: "12 / 12 Audited", status: "Pass", owner: "Priya Nair" },
            { name: "Incoming Component Defect PPM", target: "< 50 PPM", actual: "< 25 PPM", status: "Pass", owner: "K. Priya" },
            { name: "Supplier PPAP Level 3 Warrants", target: "100% Signed", actual: "11 / 12 Signed", status: "In Progress", owner: "Priya Nair" },
            { name: "Critical Semiconductor Allocation Risk", target: "Secured", actual: "26 Weeks Buffer", status: "Pass", owner: "Procurement" },
            { name: "Tooling Capacity Verification (Run-at-Rate)", target: "≥ 1500 pcs/mo", actual: "1800 pcs/mo", status: "Pass", owner: "Priya Nair" },
          ] as ChecklistItem[],
        };
      case "risk":
        return {
          title: "Risk Readiness & Process FMEA Assessment",
          score: record.riskScore ?? 78,
          status: "Controlled (78/100)",
          icon: ShieldAlert,
          color: "#ef4444",
          description: "PFMEA failure mode rankings, error-proofing (Poka-Yoke), control plan triggers, and safety characteristics.",
          items: [
            { name: "Maximum PFMEA Risk Priority Number (RPN)", target: "< 100", actual: "84 (Thermal Overload)", status: "Pass", owner: "Vikram Singh" },
            { name: "Critical Safety Characteristics Identified", target: "0 Uncontrolled", actual: "0 Open Risks", status: "Pass", owner: "Vikram Singh" },
            { name: "Poke-Yoke Sensor Gates on Station 2 & 4", target: "Active", actual: "Active & Interlocked", status: "Pass", owner: "Automation Team" },
            { name: "Control Plan Linkage to Operator SOPs", target: "100%", actual: "100% Synced", status: "Pass", owner: "Quality Lead" },
            { name: "Supply Chain Contingency & Alternate Tooling", target: "Documented", actual: "Review Pending", status: "In Progress", owner: "Rahul Sharma" },
          ] as ChecklistItem[],
        };
      case "cost":
        return {
          title: "Cost Readiness & Capital Expenditure Tracking",
          score: record.costReadinessScore ?? 83,
          status: "Favorable (83/100)",
          icon: Calculator,
          color: "#14b8a6",
          description: "Unit manufacturing BOM cost, tooling capex budget variance, cycle times, and scrap rate projections.",
          items: [
            { name: "Target Unit Manufacturing Cost", target: "Within Target", actual: "-2.4% Favorable", status: "Pass", owner: "Finance & Costing" },
            { name: "Tooling & Assembly Fixture Capex", target: "On Budget", actual: "On Budget ($145k / $150k)", status: "Pass", owner: "Vikram Singh" },
            { name: "Production Cycle Time per Unit", target: "≤ 14.5 min", actual: "13.8 min", status: "Pass", owner: "Industrial Eng" },
            { name: "First Pass Scrap Budget Allowance", target: "≤ 1.0%", actual: "0.8%", status: "Pass", owner: "Manufacturing QA" },
            { name: "Packaging & Logistics Distribution Cost", target: "Approved", actual: "Optimized Flat-Pack", status: "Pass", owner: "Logistics Lead" },
          ] as ChecklistItem[],
        };
    }
  };

  const data = getDomainData();
  const Icon = data.icon;

  const handleExportCsv = () => {
    const lines = [
      `APQP READINESS AUDIT DOSSIER - ${data.title.toUpperCase()}`,
      `Project,${record.apqpProjectName} (${record.apqpId})`,
      `Score,${data.score}/100 - ${data.status}`,
      `Export Date,${new Date().toLocaleDateString()}`,
      "",
      "Parameter,Target Criteria,Actual Measured,Status,Owner",
      ...data.items.map((i) => `"${i.name}","${i.target}","${i.actual}","${i.status}","${i.owner}"`),
    ];

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.apqpId}_${domain}_readiness_audit.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${domain} readiness checklist to CSV`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-5 bg-card border border-border shadow-2xl rounded-xl">
        <DialogHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center font-bold"
                style={{ backgroundColor: `${data.color}20`, color: data.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-foreground">
                  {data.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {data.description}
                </DialogDescription>
              </div>
            </div>
            <Badge
              variant="outline"
              className="text-xs font-bold px-2.5 py-1"
              style={{ borderColor: data.color, color: data.color }}
            >
              {data.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-3 pt-2 text-xs">
          <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-[11px] font-bold text-muted-foreground uppercase">
                  <th className="py-2.5 px-3">Audit Parameter / Gate</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Actual Value</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3">Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {data.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-foreground">{item.name}</td>
                    <td className="py-2.5 px-3 text-muted-foreground font-mono">{item.target}</td>
                    <td className="py-2.5 px-3 font-bold text-foreground font-mono">{item.actual}</td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === "Pass"
                            ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300"
                            : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-300"
                        }`}
                      >
                        {item.status === "Pass" ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-blue-600" />
                        )}
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">{item.owner}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-border flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            className="h-8 text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Export Audit CSV</span>
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="h-8 text-xs bg-[#0B3B7B] text-white"
          >
            Close Audit Breakdown
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
