import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { ControlPlanHeader } from "@/components/erp/controlPlan/ControlPlanHeader";
import { ControlPlanOverviewCard } from "@/components/erp/controlPlan/ControlPlanOverviewCard";
import { ControlPlanCharacteristicsTable } from "@/components/erp/controlPlan/ControlPlanCharacteristicsTable";
import { ControlPlanInspectionCard } from "@/components/erp/controlPlan/ControlPlanInspectionCard";
import { ControlPlanProcessControlCard } from "@/components/erp/controlPlan/ControlPlanProcessControlCard";
import { ControlPlanQualityVerificationCard } from "@/components/erp/controlPlan/ControlPlanQualityVerificationCard";
import { ReviewApprovalTab } from "@/components/erp/controlPlan/tabs/ReviewApprovalTab";
import { AttachmentsTab } from "@/components/erp/controlPlan/tabs/AttachmentsTab";
import { AddCharacteristicModal } from "@/components/erp/controlPlan/AddCharacteristicModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle2, Sliders } from "lucide-react";

import {
  fetchControlPlanRecord,
  saveControlPlanDraft,
  submitControlPlanForReview,
  addCharacteristic,
} from "@/services/controlPlanService";
import type { ControlPlanAttachment, ControlPlanRecord } from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/control-plan/new",
)({
  component: ControlPlanDevelopmentPage,
});

export function ControlPlanDevelopmentPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isAddCharModalOpen, setIsAddCharModalOpen] = useState(false);
  const [activeDetailsModal, setActiveDetailsModal] = useState<"inspection" | "process" | "quality" | null>(null);

  const { data: record, isLoading } = useQuery<ControlPlanRecord>({
    queryKey: ["control-plan-development-record"],
    queryFn: fetchControlPlanRecord,
  });

  const saveDraftMutation = useMutation({
    mutationFn: saveControlPlanDraft,
    onSuccess: (updated) => {
      queryClient.setQueryData(["control-plan-development-record"], updated);
      toast.success("Control Plan Development Draft saved successfully");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: submitControlPlanForReview,
    onSuccess: (updated) => {
      queryClient.setQueryData(["control-plan-development-record"], updated);
      toast.success("Control Plan submitted for Executive Board review!");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  const addCharMutation = useMutation({
    mutationFn: addCharacteristic,
    onSuccess: (updated) => {
      queryClient.setQueryData(["control-plan-development-record"], updated);
      toast.success("New process & product characteristic added successfully!");
    },
    onError: (err: any) => toast.error(`Failed to add characteristic: ${err.message}`),
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Control Plan Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Manufacturing Process Control Plan Record...
        </div>
      </AppShell>
    );
  }

  const handleExportReport = () => {
    const content = `=====================================================
CONTROL PLAN SPECIFICATION: ${record.controlPlanTitle}
=====================================================
Control Plan ID: ${record.controlPlanId}
Form Code: ${record.formCode}
Control Plan Number: ${record.controlPlanNumber}
Version: ${record.version}
Workflow Status: ${record.workflowStatus}
Product: ${record.product} (Revision ${record.productRevision})
Process: ${record.manufacturingProcess}
APQP Reference: ${record.apqpRef}
PFMEA Reference: ${record.pfmeaRef}
Process Owner: ${record.processOwner}
Control Plan Type: ${record.controlPlanType}
Lifecycle Stage: ${record.lifecycleStage}
Priority: ${record.priority}

READINESS OVERVIEW:
-----------------------------------------------------
Overall Readiness: ${record.overallControlPlanReadinessScore || 84}/100
Characteristics Score: ${record.characteristicReadinessScore || 86}/100
Inspection Score: ${record.inspectionReadinessScore || 82}/100
Process Control Score: ${record.processControlScore || 88}/100
Validation Score: ${record.validationScore || 80}/100

PROCESS & PRODUCT CHARACTERISTICS:
-----------------------------------------------------
${record.characteristics.map((c) => `[${c.operationNo}] ${c.processStep} | Product: ${c.productCharacteristic} | Process: ${c.processCharacteristic} | Spec: ${c.specification} | Method: ${c.controlMethod} | Readiness: ${c.readinessScore}%`).join("\n")}

INSPECTION & REACTION PLAN:
-----------------------------------------------------
Method: ${record.inspectionMethod}
Equipment: ${record.measuringEquipment}
Sample Size: ${record.sampleSize}
Frequency: ${record.inspectionFrequency}
MSA Reference: ${record.msaRef}
SPC Required: ${record.spcRequired ? "Yes" : "No"}
Reaction Plan: ${record.reactionPlan}

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.person} - ${r.status} (${r.date || "-"})`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.controlPlanNumber}_Control_Plan.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Control Plan Worksheet exported & downloaded successfully!");
  };

  const handleUploadAttachment = (fileInfo: {
    name: string;
    type: string;
    size: number;
    documentType: string;
  }) => {
    const newAtt: ControlPlanAttachment = {
      id: `att-cp-${Date.now()}`,
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
    queryClient.setQueryData(["control-plan-development-record"], updated);
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
    queryClient.setQueryData(["control-plan-development-record"], updated);
    toast.info(`Removed ${attToDelete?.fileName || "document"}`);
  };

  const handleNewControlPlan = () => {
    const newRec: ControlPlanRecord = {
      ...record,
      id: `cp-rec-${Date.now()}`,
      controlPlanId: `CP-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      formCode: "CPDL-2024-25",
      controlPlanNumber: `CP-ENCL-AW-${Math.floor(100 + Math.random() * 900)}`,
      workflowStatus: "In Progress",
      version: 1.0,
      createdDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    queryClient.setQueryData(["control-plan-development-record"], newRec);
    toast.success("New Control Plan Initialized!", {
      description: `Control Plan ID ${newRec.controlPlanId} created.`,
    });
  };

  return (
    <AppShell
      title="Control Plan Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Control Plan"}
      description="Establish process control points, inspection criteria, sampling frequencies, and reaction plans."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Bar */}
        <ControlPlanHeader
          record={record}
          onSaveDraft={() => saveDraftMutation.mutate({})}
          onSubmitForReview={() => submitMutation.mutate()}
          onExport={handleExportReport}
          onNewControlPlan={handleNewControlPlan}
        />

        {/* Unified Layout Content */}
        <div className="space-y-5">
          {/* Section 1: Overview */}
          <ControlPlanOverviewCard record={record} />

          {/* Section 2: Characteristics Table with Add Modal */}
          <ControlPlanCharacteristicsTable
            characteristics={record.characteristics}
            onAddCharacteristic={() => setIsAddCharModalOpen(true)}
            onViewAll={() => toast.info(`Displaying all ${record.characteristics.length} process and product characteristics.`)}
          />

          {/* Section 3: Core Planning & Controls (3-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ControlPlanInspectionCard
              record={record}
              onViewDetails={() => setActiveDetailsModal("inspection")}
            />
            <ControlPlanProcessControlCard
              record={record}
              onViewDetails={() => setActiveDetailsModal("process")}
            />
            <ControlPlanQualityVerificationCard
              record={record}
              onViewDetails={() => setActiveDetailsModal("quality")}
            />
          </div>

          {/* Section 4: Multi-Level Review & Approval Authorization */}
          <ReviewApprovalTab
            record={record}
            onReviewDecision={(decision, comments) => {
              saveDraftMutation.mutate({ approvalDecision: decision });
              toast.success(`Control Plan Board decision recorded: ${decision}`);
            }}
          />

          {/* Section 5: Controlled Documents & Attachments */}
          <AttachmentsTab
            record={record}
            onUploadAttachment={handleUploadAttachment}
            onDeleteAttachment={handleDeleteAttachment}
          />
        </div>

        {/* Add Characteristic Modal */}
        <AddCharacteristicModal
          isOpen={isAddCharModalOpen}
          onClose={() => setIsAddCharModalOpen(false)}
          onAdd={(item) => addCharMutation.mutate(item)}
          nextStepNo={record.characteristics.length + 1}
        />

        {/* Details Modal */}
        <Dialog open={!!activeDetailsModal} onOpenChange={(open) => !open && setActiveDetailsModal(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                {activeDetailsModal === "inspection" && <Sliders className="h-5 w-5 text-blue-600" />}
                {activeDetailsModal === "process" && <ShieldCheck className="h-5 w-5 text-emerald-600" />}
                {activeDetailsModal === "quality" && <CheckCircle2 className="h-5 w-5 text-purple-600" />}
                {activeDetailsModal === "inspection" && "Inspection & Monitoring Specifications"}
                {activeDetailsModal === "process" && "Shop Floor Process Control & Poka-Yoke"}
                {activeDetailsModal === "quality" && "Quality Verification & PPAP Readiness"}
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
              <p className="text-emerald-400 font-bold">=== CONTROL PLAN PARAMETERS ===</p>
              <p>Control Plan ID: {record.controlPlanId} ({record.controlPlanNumber})</p>
              <p>Product: {record.product} ({record.productRevision}) - Line: {record.productionLine}</p>
              <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs space-y-1">
                {activeDetailsModal === "inspection" && (
                  <>
                    <p>• Method: <strong>{record.inspectionMethod}</strong></p>
                    <p>• Measuring Equipment: <strong>{record.measuringEquipment}</strong></p>
                    <p>• Sample Size: <strong>{record.sampleSize}</strong> | Frequency: <strong>{record.inspectionFrequency}</strong></p>
                    <p>• Reaction Plan: {record.reactionPlan}</p>
                  </>
                )}
                {activeDetailsModal === "process" && (
                  <>
                    <p>• Work Instruction: <strong>{record.workInstructionRef}</strong></p>
                    <p>• SOP Reference: <strong>{record.sopRef}</strong></p>
                    <p>• Control Device: <strong>{record.controlDevice}</strong></p>
                    <p>• Error Proofing (Poka-Yoke): <strong>Enabled & Verified</strong></p>
                  </>
                )}
                {activeDetailsModal === "quality" && (
                  <>
                    <p>• Inspections: Incoming, In-Process, Final - <strong>All Active</strong></p>
                    <p>• Process Capability (Cp/Cpk): <strong>{record.processCapabilityCpk}</strong></p>
                    <p>• PPAP Reference: <strong>{record.ppapRef}</strong></p>
                    <p>• Audit Status: <strong>{record.controlPlanAudit}</strong></p>
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
