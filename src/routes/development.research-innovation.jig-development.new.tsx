import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";

import { JigDevelopmentHeader } from "@/components/erp/jig-development/JigDevelopmentHeader";
import { JigOverviewSection } from "@/components/erp/jig-development/JigOverviewSection";
import { JigDesignSection } from "@/components/erp/jig-development/JigDesignSection";
import { JigManufacturingSection } from "@/components/erp/jig-development/JigManufacturingSection";
import { JigValidationSection } from "@/components/erp/jig-development/JigValidationSection";
import { JigCommissioningSection } from "@/components/erp/jig-development/JigCommissioningSection";
import { JigAttachmentManager } from "@/components/erp/jig-development/JigAttachmentManager";
import { JigApprovalSection } from "@/components/erp/jig-development/JigApprovalSection";

import { jigDevelopmentService } from "@/services/jigDevelopmentService";
import type { JigFormInput, JigRecord } from "@/services/types";
import { JigDevelopmentMasterSchema } from "@/lib/validation/jigDevelopmentSchemas";

export const Route = createFileRoute(
  "/development/research-innovation/jig-development/new",
)({
  component: JigDevelopmentNewPage,
});

export function JigDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  // TanStack Query for record retrieval
  const { data: record, isLoading } = useQuery<JigRecord>({
    queryKey: ["jig-development", "current"],
    queryFn: () => jigDevelopmentService.fetchRecord(),
  });

  // Central React Hook Form state
  const form = useForm<JigFormInput>({
    resolver: zodResolver(JigDevelopmentMasterSchema) as any,
    defaultValues: record || {},
  });

  useEffect(() => {
    if (record) {
      form.reset(record);
    }
  }, [record, form]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<JigFormInput>) =>
      jigDevelopmentService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["jig-development", "current"], updated);
      toast.success("Draft saved successfully!");
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => jigDevelopmentService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["jig-development", "current"], updated);
      toast.success("Submitted for review!");
    },
  });

  const handleExportReport = () => {
    if (!record) return;
    const content = `=====================================================
JIG DEVELOPMENT SPECIFICATION: ${record.jigName}
=====================================================
Jig Development ID: ${record.jigDevelopmentId}
Form Code: ${record.formCode}
Jig Number: ${record.jigNumber}
Jig Version: ${record.jigVersion}
Workflow Status: ${record.workflowStatus}
Linked Product: ${record.linkedProduct}
Linked Process: ${record.linkedProcess}
Design Engineer: ${record.jigDesignEngineer}
Manufacturing Plant: ${record.manufacturingPlant}
Production Line: ${record.productionLine}
Workstation: ${record.workstation}
Jig Category: ${record.jigCategory}
Development Stage: ${record.developmentStage}
Priority: ${record.priority}
Next Review Date: ${record.nextReviewDate}

PURPOSE & PARAMETERS:
-----------------------------------------------------
Purpose: ${record.jigPurpose}
Target Component: ${record.targetComponent}
Locating System: ${record.locatingSystem}
Clamping Mechanism: ${record.clampingMechanism}
Positional Accuracy: ${record.positionalAccuracy}

ENGINEERING READINESS SCORES:
-----------------------------------------------------
Overall Jig Score: ${record.overallJigScore}/100
Design Score: ${record.designScore}/100
Manufacturing Score: ${record.manufacturingScore}/100
Validation Score: ${record.validationScore}/100
Commissioning Score: ${record.commissioningScore}/100
Performance Score: ${record.performanceScore}/100
AI Feasibility Score: ${record.aiScore}/100

MILESTONE TIMELINE:
-----------------------------------------------------
${record.timeline.map((m) => `[${m.status}] ${m.label}: ${m.date}`).join("\n")}

AUDIT HISTORY:
-----------------------------------------------------
Created By: ${record.createdBy} (${record.createdDate})
Last Modified By: ${record.lastModifiedBy} (${record.lastModifiedDate})
Stage: ${record.workflowStageLabel}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.jigNumber}_Jig_Specification.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Jig Development specification report generated & downloaded successfully!");
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Jig Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Jig Development Master Record...
        </div>
      </AppShell>
    );
  }

  const currentRecordData = { ...record, ...form.watch() };

  return (
    <AppShell
      title="Jig Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Jig Development"}
      description="Fabricate precision drilling, alignment, soldering, and testing jigs for shop floor operations."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Executive Header Card */}
        <JigDevelopmentHeader
          record={currentRecordData as JigRecord}
          onSaveDraft={() => saveDraftMutation.mutate(form.getValues())}
          onSubmitForReview={() => submitMutation.mutate()}
          onExportReport={handleExportReport}
        />

        {/* Unified Jig Sections */}
        <div className="space-y-5">
          <JigOverviewSection form={form} />
          <JigDesignSection form={form} />

          <JigManufacturingSection form={form} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <JigValidationSection form={form} />
            <JigCommissioningSection form={form} />
          </div>

          <JigApprovalSection form={form} reviewers={record.reviewers} />

          <JigAttachmentManager
            attachments={record.attachments}
            onAttachmentsChange={(atts) => {
              queryClient.setQueryData(["jig-development", "current"], {
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

