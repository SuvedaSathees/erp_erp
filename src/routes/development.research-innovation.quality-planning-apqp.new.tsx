import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { ApqpHeader } from "@/components/erp/apqp/ApqpHeader";
import { ApqpProjectOverviewCard } from "@/components/erp/apqp/ApqpProjectOverviewCard";
import { ApqpDeliverablesTable } from "@/components/erp/apqp/ApqpDeliverablesTable";
import { ApqpScoreCardsGrid } from "@/components/erp/apqp/ApqpScoreCardsGrid";
import { ApqpMilestonesPanel } from "@/components/erp/apqp/ApqpMilestonesPanel";
import { ReviewApprovalTab } from "@/components/erp/apqp/tabs/ReviewApprovalTab";
import { AttachmentsTab } from "@/components/erp/apqp/tabs/AttachmentsTab";
import { AddApqpProjectModal } from "@/components/erp/apqp/AddApqpProjectModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, Award, Truck, AlertTriangle, DollarSign } from "lucide-react";

import {
  fetchApqpRecord,
  saveApqpDraft,
  submitApqpForReview,
} from "@/services/apqpService";
import type { ApqpAttachment, ApqpRecord } from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/quality-planning-apqp/new",
)({
  component: ApqpQualityPlanningPage,
});

export function ApqpQualityPlanningPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeDetailsModal, setActiveDetailsModal] = useState<string | null>(null);

  const { data: record, isLoading } = useQuery<ApqpRecord>({
    queryKey: ["apqp-quality-planning-record"],
    queryFn: fetchApqpRecord,
  });

  const saveDraftMutation = useMutation({
    mutationFn: saveApqpDraft,
    onSuccess: (updated) => {
      queryClient.setQueryData(["apqp-quality-planning-record"], updated);
      toast.success("APQP Quality Planning Draft saved successfully");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: submitApqpForReview,
    onSuccess: (updated) => {
      queryClient.setQueryData(["apqp-quality-planning-record"], updated);
      toast.success("APQP Project submitted for Executive Board review!");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Quality Planning (APQP)"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Quality Planning (APQP) Master Record...
        </div>
      </AppShell>
    );
  }

  const handleExportReport = () => {
    const content = `=====================================================
ADVANCED PRODUCT QUALITY PLANNING (APQP) REPORT: ${record.apqpProjectName}
=====================================================
APQP ID: ${record.apqpId}
Form Code: ${record.formCode}
APQP Number: ${record.apqpNumber}
Current Phase: ${record.apqpPhase}
Workflow Status: ${record.workflowStatus}
Product: ${record.product} (Revision ${record.productRevision})
Customer: ${record.customer}
Project Manager: ${record.projectManager}
Target SOP Date: ${record.targetSopDate}
Program Status: ${record.programStatus}
Priority: ${record.priority}

QUALITY & READINESS SCORES:
-----------------------------------------------------
Overall APQP Score: ${record.overallApqpScore}/100
Design Readiness: ${record.designScore}/100
Validation Readiness: ${record.validationScore}/100
Supplier Quality: ${record.supplierQualityScore}/100
Risk Readiness: ${record.riskScore}/100
Cost Readiness: ${record.costReadinessScore}/100

APQP PHASE DELIVERABLES:
-----------------------------------------------------
${record.deliverables.map((d) => `[Phase ${d.phaseNumber}] ${d.keyDeliverables} | Owner: ${d.owner} | Target: ${d.targetDate} | Status: ${d.status} (${d.completionPercentage}%)`).join("\n")}

UPCOMING MILESTONES:
-----------------------------------------------------
${record.upcomingMilestones.map((m) => `• ${m.title}: ${m.targetDate} (${m.status})`).join("\n")}

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.person} - ${r.status} (${r.date || "-"})`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.apqpNumber}_Quality_Plan_APQP.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("APQP Quality Plan exported & downloaded successfully!");
  };

  const handleUploadAttachment = (fileInfo: {
    name: string;
    type: string;
    size: number;
    documentType: string;
  }) => {
    const newAtt: ApqpAttachment = {
      id: `att-apqp-${Date.now()}`,
      fileName: fileInfo.name,
      fileType: fileInfo.type || "PDF Document",
      documentType: fileInfo.documentType,
      version: "1.0",
      uploadedBy: "Current User",
      uploadedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      fileSize: `${(fileInfo.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "Active",
    };
    const updated = {
      ...record,
      attachments: [newAtt, ...record.attachments],
    };
    queryClient.setQueryData(["apqp-quality-planning-record"], updated);
    toast.success("Document Uploaded", {
      description: `${fileInfo.name} attached under ${fileInfo.documentType}.`,
    });
  };

  const handleDeleteAttachment = (id: string) => {
    const attToDelete = record.attachments.find((a) => a.id === id);
    const updated = {
      ...record,
      attachments: record.attachments.filter((a) => a.id !== id),
    };
    queryClient.setQueryData(["apqp-quality-planning-record"], updated);
    toast.info(`Removed ${attToDelete?.fileName || "document"}`);
  };

  const handleNewProject = () => {
    const newRec: ApqpRecord = {
      ...record,
      id: `apqp-rec-${Date.now()}`,
      apqpId: `APQP-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      formCode: "AQPL-2024-25",
      apqpNumber: `APQP-AW-EVSE-${Math.floor(100 + Math.random() * 900)}`,
      workflowStatus: "In Progress",
      version: 1.0,
      createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    queryClient.setQueryData(["apqp-quality-planning-record"], newRec);
    toast.success("New APQP Project Initialized!", {
      description: `APQP ID ${newRec.apqpId} created.`,
    });
  };

  return (
    <AppShell
      title="Quality Planning (APQP)"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Quality Planning (APQP)"}
      description="Advanced Product Quality Planning gates, feasibility commits, and product quality timing plans."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Bar */}
        <ApqpHeader
          record={record}
          onSaveDraft={() => saveDraftMutation.mutate({})}
          onSubmitForReview={() => submitMutation.mutate()}
          onExport={handleExportReport}
          onNewProject={handleNewProject}
        />

        {/* Unified Layout Stack */}
        <div className="space-y-5">
          {/* Section 1: Overview */}
          <ApqpProjectOverviewCard record={record} />

          {/* Section 2: 5 Readiness Score Cards */}
          <ApqpScoreCardsGrid
            record={record}
            onNavigateTab={(tab) => setActiveDetailsModal(tab)}
          />

          {/* Section 3: Phase Deliverables Table */}
          <ApqpDeliverablesTable
            deliverables={record.deliverables}
            onViewAll={() => toast.info(`Viewing all ${record.deliverables.length} APQP phases`)}
          />

          {/* Section 4: Upcoming Milestones */}
          <ApqpMilestonesPanel
            milestones={record.upcomingMilestones}
            onViewAll={() => toast.info("Viewing all program milestones")}
          />

          {/* Section 5: Multi-Level Review & Approval Authorization */}
          <ReviewApprovalTab
            record={record}
            onReviewDecision={(decision, comments) => {
              saveDraftMutation.mutate({ approvalDecision: decision });
              toast.success(`APQP Gate decision recorded: ${decision}`);
            }}
          />

          {/* Section 6: Controlled Documents & Attachments */}
          <AttachmentsTab
            record={record}
            onUploadAttachment={handleUploadAttachment}
            onDeleteAttachment={handleDeleteAttachment}
          />
        </div>

        {/* Add Project Modal */}
        <AddApqpProjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        {/* Readiness Details Modal */}
        <Dialog open={!!activeDetailsModal} onOpenChange={(open) => !open && setActiveDetailsModal(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                {activeDetailsModal === "design" && <Award className="h-5 w-5 text-blue-600" />}
                {activeDetailsModal === "validation" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                {activeDetailsModal === "supplier" && <Truck className="h-5 w-5 text-purple-600" />}
                {activeDetailsModal === "risk" && <AlertTriangle className="h-5 w-5 text-amber-600" />}
                {activeDetailsModal === "cost" && <DollarSign className="h-5 w-5 text-teal-600" />}
                {activeDetailsModal === "design" && "Design Readiness Details (85/100)"}
                {activeDetailsModal === "validation" && "Validation Readiness Details (82/100)"}
                {activeDetailsModal === "supplier" && "Supplier Quality Details (80/100)"}
                {activeDetailsModal === "risk" && "Risk Readiness Details (78/100)"}
                {activeDetailsModal === "cost" && "Cost Readiness Details (83/100)"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
              <p className="text-emerald-400 font-bold">=== APQP READINESS METRICS ===</p>
              <p>Program: {record.apqpProjectName} ({record.apqpNumber})</p>
              <p>Customer: {record.customer} • Phase: {record.apqpPhase}</p>
              <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs space-y-1.5">
                {activeDetailsModal === "design" && (
                  <>
                    <p>• CAD Maturity: <strong>94% Complete</strong></p>
                    <p>• BOM Structure: <strong>Released ({record.bomRef})</strong></p>
                    <p>• DFMEA Reference: <strong>{record.dfmeaRef}</strong></p>
                    <p>• Status: <strong>Capable & Approved</strong></p>
                  </>
                )}
                {activeDetailsModal === "validation" && (
                  <>
                    <p>• PPAP Level: <strong>Level 3 Submission</strong></p>
                    <p>• Trial Production: <strong>Passed (FPY 99.13%)</strong></p>
                    <p>• Process Capability: <strong>Cpk {record.processCapabilityCpk}</strong></p>
                    <p>• Status: <strong>On Track</strong></p>
                  </>
                )}
                {activeDetailsModal === "supplier" && (
                  <>
                    <p>• Tier-1 Audited: <strong>12 / 12 Suppliers</strong></p>
                    <p>• Quality PPM: <strong>&lt; 25 PPM</strong></p>
                    <p>• Supplier: <strong>{record.approvedSupplier}</strong></p>
                    <p>• Audit Score: <strong>{record.supplierAuditScore}/100</strong></p>
                  </>
                )}
                {activeDetailsModal === "risk" && (
                  <>
                    <p>• Max PFMEA RPN: <strong>84 (Medium)</strong></p>
                    <p>• Critical Open Risks: <strong>0 Open</strong></p>
                    <p>• High-Risk Points: <strong>{record.criticalControlPoints}</strong></p>
                    <p>• Status: <strong>Controlled</strong></p>
                  </>
                )}
                {activeDetailsModal === "cost" && (
                  <>
                    <p>• Cost Variance: <strong>-2.4% Favorable</strong></p>
                    <p>• Capex Target: <strong>On Budget</strong></p>
                    <p>• Target SOP Date: <strong>{record.targetSopDate}</strong></p>
                    <p>• Status: <strong>Favorable</strong></p>
                  </>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setActiveDetailsModal(null)} className="h-8 text-xs bg-primary text-primary-foreground cursor-pointer">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
