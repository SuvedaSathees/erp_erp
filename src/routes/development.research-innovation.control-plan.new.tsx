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
  fetchControlPlanRecord,
  saveControlPlanDraft,
  submitControlPlanForReview,
  addCharacteristic,
} from "@/services/controlPlanService";

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

  const { data: record, isLoading } = useQuery({
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
APQP Reference: ${record.apqpReference}
PFMEA Reference: ${record.pfmeaReference}
Process Owner: ${record.processOwner}
Control Plan Type: ${record.controlPlanType}
Lifecycle Stage: ${record.lifecycleStage}
Priority: ${record.priority}

READINESS OVERVIEW:
-----------------------------------------------------
Overall Readiness: ${record.overallReadinessScore}/100
Characteristics Score: ${record.characteristicsScore}/100
Inspection Score: ${record.inspectionScore}/100
Process Control Score: ${record.processControlScore}/100
Validation Score: ${record.validationScore}/100

PROCESS & PRODUCT CHARACTERISTICS:
-----------------------------------------------------
${record.characteristics.map((c) => `[${c.operationNumber}] ${c.processStep} | Product: ${c.productCharacteristic} | Process: ${c.processCharacteristic} | Spec: ${c.specificationTolerance} | Method: ${c.controlMethod} | Readiness: ${c.readinessScore}%`).join("\n")}

INSPECTION & REACTION PLAN:
-----------------------------------------------------
Method: ${record.inspectionMethod}
Equipment: ${record.measuringEquipment}
Sample Size: ${record.sampleSize}
Frequency: ${record.inspectionFrequency}
MSA Reference: ${record.msaReference}
SPC Required: ${record.spcRequired}
Reaction Plan: ${record.reactionPlan}

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.person} - ${r.status} (${r.date})`).join("\n")}
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
          onNewControlPlan={() => setIsAddCharModalOpen(true)}
        />

        {/* Unified Layout Content */}
        <div className="space-y-5">
          {/* Section 1: Overview */}
          <ControlPlanOverviewCard record={record} />

          {/* Section 2: Characteristics Table with Add Modal */}
          <ControlPlanCharacteristicsTable
            characteristics={record.characteristics}
            onAddCharacteristic={() => setIsAddCharModalOpen(true)}
          />

          {/* Section 3: Core Planning & Controls (3-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ControlPlanInspectionCard record={record} />
            <ControlPlanProcessControlCard record={record} />
            <ControlPlanQualityVerificationCard record={record} />
          </div>

          {/* Section 4: Multi-Level Review & Approval Authorization */}
          <ReviewApprovalTab
            record={record}
            onReviewDecision={(decision, comments) => {
              saveDraftMutation.mutate({ approvalDecision: decision });
              toast.success(`Control Plan Board decision submitted: ${decision}`);
            }}
          />

          {/* Section 5: Controlled Documents & Attachments */}
          <AttachmentsTab record={record} />
        </div>

        {/* Add Characteristic Modal */}
        <AddCharacteristicModal
          isOpen={isAddCharModalOpen}
          onClose={() => setIsAddCharModalOpen(false)}
          onAdd={(item) => addCharMutation.mutate(item)}
          nextStepNo={record.characteristics.length + 1}
        />
      </div>
    </AppShell>
  );
}
