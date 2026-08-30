import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";

import { WorkInstructionHeader } from "@/components/erp/work-instruction/WorkInstructionHeader";
import { WorkInstructionOverviewSection } from "@/components/erp/work-instruction/WorkInstructionOverviewSection";
import { StepByStepInstructionBuilder } from "@/components/erp/work-instruction/StepByStepInstructionBuilder";
import { ToolsMaterialsSection } from "@/components/erp/work-instruction/ToolsMaterialsSection";
import { QualityRequirementsSection } from "@/components/erp/work-instruction/QualityRequirementsSection";
import { SafetyComplianceSection } from "@/components/erp/work-instruction/SafetyComplianceSection";
import { WorkInstructionAttachmentManager } from "@/components/erp/work-instruction/WorkInstructionAttachmentManager";
import { WorkInstructionApprovalSection } from "@/components/erp/work-instruction/WorkInstructionApprovalSection";

import { workInstructionDevelopmentService } from "@/services/workInstructionDevelopmentService";
import type { WorkInstructionFormInput, WorkInstructionRecord } from "@/services/types";
import { WorkInstructionMasterSchema } from "@/lib/validation/workInstructionSchemas";

export const Route = createFileRoute(
  "/development/research-innovation/work-instruction-development/new",
)({
  component: WorkInstructionDevelopmentNewPage,
});

export function WorkInstructionDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useQuery<WorkInstructionRecord>({
    queryKey: ["work-instruction", "current"],
    queryFn: () => workInstructionDevelopmentService.fetchRecord(),
  });

  const form = useForm<WorkInstructionFormInput>({
    resolver: zodResolver(WorkInstructionMasterSchema) as any,
    defaultValues: record || {},
  });

  useEffect(() => {
    if (record) {
      form.reset(record);
    }
  }, [record, form]);

  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<WorkInstructionFormInput>) =>
      workInstructionDevelopmentService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["work-instruction", "current"], updated);
      toast.success("Draft saved successfully!");
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => workInstructionDevelopmentService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["work-instruction", "current"], updated);
      toast.success("Submitted for review!");
    },
  });

  const handleExportReport = () => {
    if (!record) return;
    const currentData = { ...record, ...form.getValues() };
    const content = `=====================================================
WORK INSTRUCTION: ${currentData.title}
=====================================================
Work Instruction ID: ${currentData.workInstructionId}
Form Code: ${currentData.formCode}
Document Number: ${currentData.documentNumber}
Revision: Rev ${currentData.revision}
Workflow Status: ${currentData.workflowStatus}
Plant: ${currentData.plant}
Department: ${currentData.department}
Process Owner: ${currentData.processOwner}
Workstation: ${currentData.workstation}
Production Line: ${currentData.productionLine}
Product Family: ${currentData.productFamily}
Product Model: ${currentData.productModel}
Effective Date: ${currentData.effectiveDate}
Next Review Date: ${currentData.nextReviewDate}

Operation Description:
${currentData.operationDescription}

-----------------------------------------------------
STEP-BY-STEP INSTRUCTIONS:
-----------------------------------------------------
${(currentData.steps || []).map((st) => `Step ${st.stepNumber}: ${st.instruction}\n  - Key Points: ${st.keyPoints}\n  - Time: ${st.timeSeconds}s\n  - Quality Checks: ${st.qualityChecks || "Visual inspection"}\n  - Safety Notes: ${st.safetyNotes || "Wear standard PPE"}`).join("\n\n")}

-----------------------------------------------------
Total Estimated Cycle Time: ${currentData.totalCycleTimeSec || 230} seconds
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentData.documentNumber}_Work_Instruction.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Work Instruction exported successfully");
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Work Instruction Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Work Instruction Master Record...
        </div>
      </AppShell>
    );
  }

  const currentRecordData = { ...record, ...form.watch() };

  return (
    <AppShell
      title="Work Instruction Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Work Instruction Development"}
      description="Author, review and control shop floor assembly work instructions with step sequencing, visual guides, quality checkpoints & AI risk validation."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        <WorkInstructionHeader
          record={currentRecordData as WorkInstructionRecord}
          onSaveDraft={() => saveDraftMutation.mutate(form.getValues())}
          onSubmitForApproval={() => submitMutation.mutate()}
          onExportReport={handleExportReport}
        />

        {/* Unified Work Instruction Sections */}
        <div className="space-y-5">
          <WorkInstructionOverviewSection
            form={form}
            record={currentRecordData as WorkInstructionRecord}
            onNavigateTab={(tab) => toast.info(`Viewing ${tab} section`)}
          />

          <StepByStepInstructionBuilder form={form} />

          <ToolsMaterialsSection form={form} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <QualityRequirementsSection form={form} />
            <SafetyComplianceSection form={form} />
          </div>

          <WorkInstructionApprovalSection form={form} reviewers={record.reviewers} />

          <WorkInstructionAttachmentManager
            attachments={record.attachments}
            onAttachmentsChange={(atts) => {
              queryClient.setQueryData(["work-instruction", "current"], {
                ...record,
                attachments: atts,
              });
            }}
          />
        </div>
      </div>
    </AppShell>
  );
}
