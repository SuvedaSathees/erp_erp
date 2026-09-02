import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { ProcessValidationHeader } from "@/components/erp/processValidation/ProcessValidationHeader";
import { ProcessValidationOverviewCard } from "@/components/erp/processValidation/ProcessValidationOverviewCard";
import { ProcessValidationPlanCard } from "@/components/erp/processValidation/ProcessValidationPlanCard";
import { ProcessValidationCapabilityCard } from "@/components/erp/processValidation/ProcessValidationCapabilityCard";
import { ProcessValidationQualityCard } from "@/components/erp/processValidation/ProcessValidationQualityCard";
import { ProcessValidationEquipmentCard } from "@/components/erp/processValidation/ProcessValidationEquipmentCard";
import { ReviewApprovalTab } from "@/components/erp/processValidation/tabs/ReviewApprovalTab";
import { AttachmentsTab } from "@/components/erp/processValidation/tabs/AttachmentsTab";
import { AddValidationTrialModal } from "@/components/erp/processValidation/AddValidationTrialModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gauge, CheckCircle2, ShieldCheck } from "lucide-react";

import {
  fetchProcessValidationRecord,
  saveProcessValidationDraft,
  submitProcessValidationForReview,
  updateTrialRunSummary,
} from "@/services/processValidationService";
import type { ProcessValidationAttachment, ProcessValidationRecord } from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/process-validation/new",
)({
  component: ProcessValidationPage,
});

export function ProcessValidationPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isLogTrialModalOpen, setIsLogTrialModalOpen] = useState(false);
  const [activeDetailsModal, setActiveDetailsModal] = useState<"capability" | "quality" | "equipment" | null>(null);

  const { data: record, isLoading } = useQuery<ProcessValidationRecord>({
    queryKey: ["process-validation-record"],
    queryFn: fetchProcessValidationRecord,
  });

  const saveDraftMutation = useMutation({
    mutationFn: saveProcessValidationDraft,
    onSuccess: (updated) => {
      queryClient.setQueryData(["process-validation-record"], updated);
      toast.success("Process Validation Draft saved successfully");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: submitProcessValidationForReview,
    onSuccess: (updated) => {
      queryClient.setQueryData(["process-validation-record"], updated);
      toast.success("Process Validation submitted for Executive Board review!");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  const updateTrialMutation = useMutation({
    mutationFn: updateTrialRunSummary,
    onSuccess: (updated) => {
      queryClient.setQueryData(["process-validation-record"], updated);
      toast.success("Validation trial run details updated successfully!");
    },
    onError: (err: any) => toast.error(`Failed to update trial: ${err.message}`),
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Process Validation"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Manufacturing Process Validation Record...
        </div>
      </AppShell>
    );
  }

  const handleExportReport = () => {
    const content = `=====================================================
PROCESS VALIDATION & PPAP REPORT: ${record.validationTitle}
=====================================================
Validation ID: ${record.validationId}
Form Code: ${record.formCode}
Validation Number: ${record.validationNumber}
Version: ${record.version}
Workflow Status: ${record.workflowStatus}
Product: ${record.product} (Revision ${record.productRevision})
Process: ${record.manufacturingProcess}
Production Line: ${record.productionLine}
APQP Reference: ${record.apqpRef}
Control Plan Reference: ${record.controlPlanRef}
PPAP Submission Level: ${record.ppapLevel || "Level 3"}
Approval Decision: ${record.approvalDecision}

READINESS SCORES:
-----------------------------------------------------
Overall Validation Score: ${record.overallValidationScore || 86}/100
Protocol Score: ${record.protocolScore || 85}/100
Trial Run Score: ${record.trialScore || 88}/100
Capability Cpk Score: ${record.capabilityScore}/100
Equipment Readiness: ${record.productionReadinessScore || 86}/100

TRIAL RUN DETAILS:
-----------------------------------------------------
Batch Number: ${record.trialBatchNumber || "BATCH-24-001"}
Parts Produced: ${record.trialRunSummary?.totalPartsProduced || 1500}
Parts Accepted: ${record.trialRunSummary?.conformingParts || 1487}
Parts Rejected: ${record.trialRunSummary?.nonConformingParts || 13}
Current FPY: ${record.trialRunSummary?.currentFpy || 99.13}%
Defect Rate: ${record.trialRunSummary?.defectRate || 0.87}%
Measured Cp: ${record.cp}
Measured Cpk: ${record.cpk}

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.person} - ${r.status} (${r.date || "-"})`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.validationNumber}_Process_Validation.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Process Validation Dossier exported & downloaded successfully!");
  };

  const handleUploadAttachment = (fileInfo: {
    name: string;
    type: string;
    size: number;
    documentType: string;
  }) => {
    const newAtt: ProcessValidationAttachment = {
      id: `att-pv-${Date.now()}`,
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
    queryClient.setQueryData(["process-validation-record"], updated);
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
    queryClient.setQueryData(["process-validation-record"], updated);
    toast.info(`Removed ${attToDelete?.fileName || "document"}`);
  };

  const handleNewValidation = () => {
    const newRec: ProcessValidationRecord = {
      ...record,
      id: `pv-rec-${Date.now()}`,
      validationId: `PV-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      formCode: "PVDF-2024-25",
      validationNumber: `PV-ENCL-AW-${Math.floor(100 + Math.random() * 900)}`,
      workflowStatus: "In Progress",
      version: 1.0,
      startDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    queryClient.setQueryData(["process-validation-record"], newRec);
    toast.success("New Process Validation Project Initialized!", {
      description: `Validation ID ${newRec.validationId} created.`,
    });
  };

  return (
    <AppShell
      title="Process Validation"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Process Validation"}
      description="Production Part Approval Process (PPAP), trial run validation, Cpk/Ppk process capability, and quality release."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Bar */}
        <ProcessValidationHeader
          record={record}
          onSaveDraft={() => saveDraftMutation.mutate({})}
          onSubmitForReview={() => submitMutation.mutate()}
          onExport={handleExportReport}
          onNewValidation={handleNewValidation}
        />

        {/* Unified Layout Stack */}
        <div className="space-y-5">
          {/* Section 1: Overview */}
          <ProcessValidationOverviewCard record={record} />

          {/* Section 2: Validation Plan & Capability (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProcessValidationPlanCard
              record={record}
            />
            <ProcessValidationCapabilityCard
              record={record}
              onViewDetails={() => setActiveDetailsModal("capability")}
            />
          </div>

          {/* Section 3: Quality Verification & Equipment Readiness (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProcessValidationQualityCard
              record={record}
              onViewDetails={() => setActiveDetailsModal("quality")}
            />
            <ProcessValidationEquipmentCard
              record={record}
              onViewDetails={() => setActiveDetailsModal("equipment")}
            />
          </div>

          {/* Section 4: Multi-Level Review & Approval Authorization */}
          <ReviewApprovalTab
            record={record}
            onReviewDecision={(decision, comments) => {
              saveDraftMutation.mutate({ approvalDecision: decision });
              toast.success(`Validation Board decision recorded: ${decision}`);
            }}
          />

          {/* Section 5: Controlled Documents & Attachments */}
          <AttachmentsTab
            record={record}
            onUploadAttachment={handleUploadAttachment}
            onDeleteAttachment={handleDeleteAttachment}
          />
        </div>

        {/* Add Trial Run Modal */}
        <AddValidationTrialModal
          isOpen={isLogTrialModalOpen}
          onClose={() => setIsLogTrialModalOpen(false)}
          onSave={(data) => updateTrialMutation.mutate(data)}
          currentSummary={record?.trialRunSummary}
        />

        {/* Details Modal */}
        <Dialog open={!!activeDetailsModal} onOpenChange={(open) => !open && setActiveDetailsModal(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                {activeDetailsModal === "capability" && <Gauge className="h-5 w-5 text-emerald-600" />}
                {activeDetailsModal === "quality" && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                {activeDetailsModal === "equipment" && <ShieldCheck className="h-5 w-5 text-purple-600" />}
                {activeDetailsModal === "capability" && "Statistical Process Capability (Cp/Cpk)"}
                {activeDetailsModal === "quality" && "Quality Verification & Defect Analysis"}
                {activeDetailsModal === "equipment" && "Equipment Qualification & Tooling Readiness"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
              <p className="text-emerald-400 font-bold">=== VALIDATION STATISTICAL BASELINE ===</p>
              <p>Validation ID: {record.validationId} ({record.validationNumber})</p>
              <p>Process: {record.manufacturingProcess} - Line: {record.productionLine}</p>
              <p>Product: {record.product} ({record.productRevision})</p>
              <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs space-y-1">
                {activeDetailsModal === "capability" && (
                  <>
                    <p>• Measured Cp: <strong>{record.cp}</strong> | Cpk: <strong>{record.cpk}</strong></p>
                    <p>• Gauge R&R Result: <strong>{record.gaugeRrrResult}</strong></p>
                    <p>• MSA Reference: <strong>{record.msaRef}</strong></p>
                    <p>• SPC Status: <strong>Active & Controlled</strong></p>
                  </>
                )}
                {activeDetailsModal === "quality" && (
                  <>
                    <p>• First Pass Yield (FPY): <strong>{record.fpy}%</strong></p>
                    <p>• Defect Rate: <strong>{record.defectRate}%</strong></p>
                    <p>• Scrap Rate: <strong>{record.scrapRate}%</strong> | Rework Rate: <strong>{record.reworkRate}%</strong></p>
                    <p>• Inspections: Incoming, In-Process, and Final Verified.</p>
                  </>
                )}
                {activeDetailsModal === "equipment" && (
                  <>
                    <p>• Machine Qualification: <strong>{record.machineQualification}</strong></p>
                    <p>• Tool Qualification: <strong>{record.toolQualification}</strong></p>
                    <p>• Operator Qualification: <strong>{record.operatorQualification}</strong></p>
                    <p>• PM & Safety Status: <strong>Active & Verified</strong></p>
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
