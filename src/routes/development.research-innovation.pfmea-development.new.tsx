import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { PfmeaHeader } from "@/components/erp/pfmea/PfmeaHeader";
import { PfmeaFailureAnalysisTable } from "@/components/erp/pfmea/PfmeaFailureAnalysisTable";
import { PfmeaRecommendedActionsCard } from "@/components/erp/pfmea/PfmeaRecommendedActionsCard";
import { PfmeaManufacturingValidationCard } from "@/components/erp/pfmea/PfmeaManufacturingValidationCard";
import { ReviewApprovalTab } from "@/components/erp/pfmea/tabs/ReviewApprovalTab";
import { AttachmentsTab } from "@/components/erp/pfmea/tabs/AttachmentsTab";
import { AddFailureModeModal } from "@/components/erp/pfmea/AddFailureModeModal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, Activity } from "lucide-react";

import {
  fetchPfmeaRecord,
  savePfmeaDraft,
  submitPfmeaForReview,
  addFailureMode,
} from "@/services/pfmeaService";
import type { PfmeaAttachment, PfmeaRecord } from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/pfmea-development/new",
)({
  component: PfmeaDevelopmentPage,
});

export function PfmeaDevelopmentPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isAddFmModalOpen, setIsAddFmModalOpen] = useState(false);
  const [activeDetailsModal, setActiveDetailsModal] = useState<"validation" | "actions" | null>(null);

  const { data: record, isLoading } = useQuery<PfmeaRecord>({
    queryKey: ["pfmea-development-record"],
    queryFn: fetchPfmeaRecord,
  });

  const saveDraftMutation = useMutation({
    mutationFn: savePfmeaDraft,
    onSuccess: (updated) => {
      queryClient.setQueryData(["pfmea-development-record"], updated);
      toast.success("PFMEA Development Draft saved successfully");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: submitPfmeaForReview,
    onSuccess: (updated) => {
      queryClient.setQueryData(["pfmea-development-record"], updated);
      toast.success("PFMEA Project submitted for Executive Board review!");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  const addFmMutation = useMutation({
    mutationFn: addFailureMode,
    onSuccess: (updated) => {
      queryClient.setQueryData(["pfmea-development-record"], updated);
      toast.success("New Failure Mode added to PFMEA worksheet!");
    },
    onError: (err: any) => toast.error(`Failed to add Failure Mode: ${err.message}`),
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="PFMEA Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Process Failure Mode & Effects Analysis Record...
        </div>
      </AppShell>
    );
  }

  const handleExportReport = () => {
    const content = `=====================================================
PFMEA SPECIFICATION REPORT: ${record.pfmeaTitle}
=====================================================
PFMEA ID: ${record.pfmeaId}
Form Code: ${record.formCode}
PFMEA Number: ${record.pfmeaNumber}
Version: ${record.pfmeaVersion}
Workflow Status: ${record.workflowStatus}
Product: ${record.product} (Revision ${record.productRevision})
Process: ${record.manufacturingProcess}
Process Owner: ${record.processOwner}
APQP Reference: ${record.apqpRef}
Top RPN: ${record.topRpnBefore || 384} (Target: ${record.topRpnAfter || 96})

FAILURE MODES REGISTER:
-----------------------------------------------------
${record.failureModes.map((fm) => `[${fm.stepNo}] ${fm.processStep} | Failure Mode: ${fm.potentialFailureMode} | Cause: ${fm.potentialCause} | Effect: ${fm.potentialEffect} | S:${fm.severity} O:${fm.occurrence} D:${fm.detection} | AP:${fm.actionPriority} | RPN Before: ${fm.rpnBefore} -> After: ${fm.rpnAfter} | Status: ${fm.status}`).join("\n")}

RECOMMENDED ACTIONS (TOP 5):
-----------------------------------------------------
${record.recommendedActions.map((a) => `• ${a.action} | Owner: ${a.responsible} | Target: ${a.targetDate} | Status: ${a.status} | Target RPN: ${a.rpnAfter}`).join("\n")}

MANUFACTURING VALIDATION:
-----------------------------------------------------
Process Validation Status: ${record.processValidationStatus ? "Validated" : "Pending"}
Pilot Production Status: ${record.pilotProductionStatus ? "Completed" : "In Progress"}
Capability (Cp/Cpk): ${record.capacityCpk} / 1.58
MSA Reference: ${record.msaRef}
Control Plan Ref: ${record.controlPlanRef}

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.person} - ${r.status} (${r.date || "-"})`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.pfmeaNumber}_PFMEA_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("PFMEA Worksheet exported & downloaded successfully!");
  };

  const handleUploadAttachment = (fileInfo: {
    name: string;
    type: string;
    size: number;
    documentType: string;
  }) => {
    const newAtt: PfmeaAttachment = {
      id: `att-pfmea-${Date.now()}`,
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
    queryClient.setQueryData(["pfmea-development-record"], updated);
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
    queryClient.setQueryData(["pfmea-development-record"], updated);
    toast.info(`Removed ${attToDelete?.fileName || "document"}`);
  };

  const handleNewPfmea = () => {
    const newRec: PfmeaRecord = {
      ...record,
      id: `pfmea-rec-${Date.now()}`,
      pfmeaId: `PFMEA-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      formCode: "PFMEA-2024-25",
      pfmeaNumber: `PFMEA-AW-EVSE-${Math.floor(100 + Math.random() * 900)}`,
      workflowStatus: "In Progress",
      pfmeaVersion: "1.0",
      createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    queryClient.setQueryData(["pfmea-development-record"], newRec);
    toast.success("New PFMEA Project Initialized!", {
      description: `PFMEA ID ${newRec.pfmeaId} created.`,
    });
  };

  return (
    <AppShell
      title="PFMEA Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > PFMEA"}
      description="Process Failure Mode and Effects Analysis (PFMEA) according to AIAG-VDA standard with Action Priority (AP)."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Bar */}
        <PfmeaHeader
          record={record}
          onSaveDraft={() => saveDraftMutation.mutate({})}
          onSubmitForReview={() => submitMutation.mutate()}
          onExport={handleExportReport}
          onNewPfmea={handleNewPfmea}
        />

        {/* Unified Layout Stack */}
        <div className="space-y-5">
          {/* Section 1: Overview Card */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">PFMEA Process Profile & Scope</CardTitle>
                <CardDescription className="text-xs">
                  Process failure mode analysis baseline, APQP alignment, and engineering context.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary text-xs font-semibold">
                AIAG-VDA Harmonized
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">PFMEA Title</span>
                  <span className="font-bold text-foreground text-sm">{record.pfmeaTitle}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Manufacturing Process</span>
                  <span className="font-bold text-foreground text-sm">{record.manufacturingProcess}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Product Family</span>
                  <span className="font-semibold text-foreground">{record.product} ({record.productRevision})</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Process Owner</span>
                  <span className="font-semibold text-foreground">{record.processOwner}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">APQP Reference</span>
                  <span className="font-semibold font-mono text-primary">{record.apqpRef}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Total Failure Modes</span>
                  <span className="font-bold font-mono text-foreground">{record.failureModes.length} Items</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Top RPN (Before / After)</span>
                  <span className="font-bold font-mono text-rose-600">384 <span className="text-muted-foreground font-normal">→</span> <span className="text-emerald-600">96</span></span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">High-Risk Items</span>
                  <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 font-semibold">
                    6 Requires Action
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Failure Analysis Register Table */}
          <PfmeaFailureAnalysisTable
            failureModes={record.failureModes}
            onAddFailureMode={() => setIsAddFmModalOpen(true)}
            onViewAll={() => toast.info(`Viewing all ${record.failureModes.length} failure modes`)}
          />

          {/* Section 3: Recommended Actions & Validation (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <PfmeaRecommendedActionsCard
              recommendedActions={record.recommendedActions}
              onViewAll={() => setActiveDetailsModal("actions")}
            />
            <PfmeaManufacturingValidationCard
              record={record}
              onViewValidation={() => setActiveDetailsModal("validation")}
            />
          </div>

          {/* Section 4: Multi-Level Review & Approval Authorization */}
          <ReviewApprovalTab
            record={record}
            onReviewDecision={(decision, comments) => {
              saveDraftMutation.mutate({ approvalDecision: decision });
              toast.success(`PFMEA Board decision recorded: ${decision}`);
            }}
          />

          {/* Section 5: Controlled Documents & Attachments */}
          <AttachmentsTab
            record={record}
            onUploadAttachment={handleUploadAttachment}
            onDeleteAttachment={handleDeleteAttachment}
          />
        </div>

        {/* Add Failure Mode Modal */}
        <AddFailureModeModal
          isOpen={isAddFmModalOpen}
          onClose={() => setIsAddFmModalOpen(false)}
          onAdd={(item) => addFmMutation.mutate(item)}
          nextStepNo={record.failureModes.length + 1}
        />

        {/* Action Register & Validation Modal */}
        <Dialog open={!!activeDetailsModal} onOpenChange={(open) => !open && setActiveDetailsModal(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                {activeDetailsModal === "actions" && <Activity className="h-5 w-5 text-blue-600" />}
                {activeDetailsModal === "validation" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                {activeDetailsModal === "actions" && "PFMEA Action Register & Mitigation Targets"}
                {activeDetailsModal === "validation" && "Manufacturing Process Validation Baseline"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
              <p className="text-emerald-400 font-bold">=== RISK MITIGATION & PROCESS DATA ===</p>
              <p>PFMEA ID: {record.pfmeaId} ({record.pfmeaNumber})</p>
              <p>Process: {record.manufacturingProcess} - Product: {record.product} ({record.productRevision})</p>
              <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs space-y-1.5">
                {activeDetailsModal === "actions" && (
                  <>
                    <p className="font-semibold text-white">Top Risk Mitigations:</p>
                    {record.recommendedActions.map((a, i) => (
                      <p key={i}>• {a.action} (Owner: <strong>{a.responsible}</strong> | Target: <strong>{a.targetDate}</strong> | RPN: <strong>{a.rpnAfter}</strong>)</p>
                    ))}
                  </>
                )}
                {activeDetailsModal === "validation" && (
                  <>
                    <p>• Process Validation: <strong>Validated & Approved</strong></p>
                    <p>• Pilot Production: <strong>Completed (50 trial units)</strong></p>
                    <p>• Capability Study (Cp/Cpk): <strong>{record.capacityCpk} / 1.58</strong></p>
                    <p>• MSA Reference: <strong>{record.msaRef}</strong> | Control Plan: <strong>{record.controlPlanRef}</strong></p>
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
