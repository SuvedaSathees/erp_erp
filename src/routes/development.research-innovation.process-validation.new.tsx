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
  fetchProcessValidationRecord,
  saveProcessValidationDraft,
  submitProcessValidationForReview,
  updateTrialRunSummary,
} from "@/services/processValidationService";

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

  const { data: record, isLoading } = useQuery({
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
PPAP Submission Level: ${record.ppapLevel}
Approval Decision: ${record.approvalDecision}

READINESS SCORES:
-----------------------------------------------------
Overall Validation Score: ${record.overallValidationScore}/100
Protocol Score: ${record.protocolScore}/100
Trial Run Score: ${record.trialScore}/100
Capability Cpk Score: ${record.capabilityScore}/100
Equipment Readiness: ${record.equipmentScore}/100

TRIAL RUN DETAILS:
-----------------------------------------------------
Batch Number: ${record.trialBatchNumber}
Parts Produced: ${record.partsProduced}
Parts Accepted: ${record.partsAccepted}
Parts Rejected: ${record.partsRejected}
Measured Cpk: ${record.measuredCpk} (Target: ${record.targetCpk})
Measured Ppk: ${record.measuredPpk} (Target: ${record.targetPpk})

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.person} - ${r.status} (${r.date})`).join("\n")}
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
          onNewValidation={() => setIsLogTrialModalOpen(true)}
        />

        {/* Unified Layout Stack */}
        <div className="space-y-5">
          {/* Section 1: Overview */}
          <ProcessValidationOverviewCard record={record} />

          {/* Section 2: Validation Plan & Capability (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProcessValidationPlanCard
              record={record}
              onLogTrialRun={() => setIsLogTrialModalOpen(true)}
            />
            <ProcessValidationCapabilityCard
              record={record}
              onViewDetails={() => {}}
            />
          </div>

          {/* Section 3: Quality Verification & Equipment Readiness (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <ProcessValidationQualityCard
              record={record}
              onViewDetails={() => {}}
            />
            <ProcessValidationEquipmentCard
              record={record}
              onViewDetails={() => {}}
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
          <AttachmentsTab record={record} />
        </div>

        {/* Add Trial Run Modal */}
        <AddValidationTrialModal
          isOpen={isLogTrialModalOpen}
          onClose={() => setIsLogTrialModalOpen(false)}
          onSave={(data) => updateTrialMutation.mutate(data)}
          currentSummary={record?.trialRunSummary}
        />
      </div>
    </AppShell>
  );
}
