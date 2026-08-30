import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { SopHeader } from "@/components/erp/sop-development/SopHeader";
import { SopOverviewSection } from "@/components/erp/sop-development/SopOverviewSection";
import { ProcedureBuilderSection } from "@/components/erp/sop-development/ProcedureBuilderSection";
import { ResourcesRequirementsSection } from "@/components/erp/sop-development/ResourcesRequirementsSection";
import { QualityComplianceSection } from "@/components/erp/sop-development/QualityComplianceSection";
import { RiskSafetySection } from "@/components/erp/sop-development/RiskSafetySection";
import { SopAttachmentManager } from "@/components/erp/sop-development/SopAttachmentManager";
import { SopApprovalSection } from "@/components/erp/sop-development/SopApprovalSection";

import { sopDevelopmentService } from "@/services/sopDevelopmentService";
import type { SopFormInput, SopRecord } from "@/services/types";
import { SopMasterSchema } from "@/lib/validation/sopSchemas";

export const Route = createFileRoute(
  "/development/research-innovation/sop-development/new",
)({
  component: SopDevelopmentNewPage,
});

export function SopDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useQuery<SopRecord>({
    queryKey: ["sop-development", "current"],
    queryFn: () => sopDevelopmentService.fetchRecord(),
  });

  const form = useForm<SopFormInput>({
    resolver: zodResolver(SopMasterSchema) as any,
    defaultValues: record || {},
  });

  useEffect(() => {
    if (record) {
      form.reset(record);
    }
  }, [record, form]);

  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<SopFormInput>) =>
      sopDevelopmentService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["sop-development", "current"], updated);
      toast.success("SOP draft saved successfully!");
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => sopDevelopmentService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["sop-development", "current"], updated);
      toast.success("Submitted for executive review!");
    },
  });

  const handleExportReport = () => {
    if (!record) return;
    const currentData = { ...record, ...form.getValues() };
    const content = `=====================================================
STANDARD OPERATING PROCEDURE: ${currentData.title}
=====================================================
SOP ID: ${currentData.sopId}
Form Code: ${currentData.formCode}
SOP Number: ${currentData.sopNumber}
Revision: Rev ${currentData.revision}
Workflow Status: ${currentData.workflowStatus}
Department: ${currentData.department}
Process Owner: ${currentData.processOwner}
Effective Date: ${currentData.effectiveDate}
Next Review Date: ${currentData.nextReviewDate}

Objective:
${currentData.processObjective}

Scope & Applicability:
${currentData.scope} ${currentData.applicability}

-----------------------------------------------------
PROCEDURE STEPS:
-----------------------------------------------------
${(currentData.steps || []).map((st) => `Step ${st.stepNumber}: ${st.description}\n  - Role: ${st.responsibleRole}\n  - Duration: ${st.durationMins} mins\n  - Quality Check: ${st.qualityCheck || "Visual Inspection"}\n  - Safety: ${st.safetyCheck || "Standard PPE"}`).join("\n\n")}

-----------------------------------------------------
Total Estimated Duration: ${currentData.totalDurationMins || 45} mins
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentData.sopNumber}_SOP_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Standard Operating Procedure report exported successfully");
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="SOP Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Standard Operating Procedure (SOP) module data...
        </div>
      </AppShell>
    );
  }

  const currentRecordData = { ...record, ...form.watch() };

  return (
    <AppShell
      title="SOP Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > SOP Development"}
      description="Author, review, control & distribute Standard Operating Procedures across manufacturing operations with interactive process flow diagrams & ISO compliance audits."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        <SopHeader
          record={currentRecordData as SopRecord}
          onSaveDraft={() => saveDraftMutation.mutate(form.getValues())}
          onSubmitForApproval={() => submitMutation.mutate()}
          onExportReport={handleExportReport}
        />

        {/* Unified Procedure Builder & Overview */}
        <div className="space-y-5">
          <SopOverviewSection
            form={form}
            record={currentRecordData as SopRecord}
            onNavigateTab={(tab) => toast.info(`Viewing ${tab} section`)}
          />

          <ProcedureBuilderSection form={form} />

          <ResourcesRequirementsSection form={form} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <QualityComplianceSection form={form} />
            <RiskSafetySection form={form} />
          </div>

          <SopApprovalSection form={form} reviewers={record.reviewers} />

          <SopAttachmentManager
            attachments={record.attachments}
            onAttachmentsChange={(atts) => {
              queryClient.setQueryData(["sop-development", "current"], {
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
