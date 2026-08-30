import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";

import { CapacityPlanningHeader } from "@/components/erp/capacity-planning/CapacityPlanningHeader";
import { CapacityOverviewSection } from "@/components/erp/capacity-planning/CapacityOverviewSection";
import { CapacityAssessmentSection } from "@/components/erp/capacity-planning/CapacityAssessmentSection";
import { ResourcePlanningSection } from "@/components/erp/capacity-planning/ResourcePlanningSection";
import { BottleneckAnalysisSection } from "@/components/erp/capacity-planning/BottleneckAnalysisSection";
import { CapacityAttachmentManager } from "@/components/erp/capacity-planning/CapacityAttachmentManager";
import { CapacityApprovalSection } from "@/components/erp/capacity-planning/CapacityApprovalSection";

import { capacityPlanningService } from "@/services/capacityPlanningService";
import type { CapacityFormInput, CapacityPlanningRecord } from "@/services/types";
import { CapacityPlanningMasterSchema } from "@/lib/validation/capacityPlanningSchemas";

export const Route = createFileRoute(
  "/development/research-innovation/capacity-planning/new",
)({
  component: CapacityPlanningNewPage,
});

export function CapacityPlanningNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useQuery<CapacityPlanningRecord>({
    queryKey: ["capacity-planning", "current"],
    queryFn: () => capacityPlanningService.fetchRecord(),
  });

  const form = useForm<CapacityFormInput>({
    resolver: zodResolver(CapacityPlanningMasterSchema) as any,
    defaultValues: record || {},
  });

  useEffect(() => {
    if (record) {
      form.reset(record);
    }
  }, [record, form]);

  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<CapacityFormInput>) =>
      capacityPlanningService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["capacity-planning", "current"], updated);
      toast.success("Draft saved successfully!");
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => capacityPlanningService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["capacity-planning", "current"], updated);
      toast.success("Submitted for review!");
    },
  });

  const handleExportReport = () => {
    if (!record) return;
    const currentData = { ...record, ...form.getValues() };
    const content = `=====================================================
CAPACITY PLANNING SPECIFICATION: ${currentData.projectName}
=====================================================
Planning ID: ${currentData.planningId}
Form Code: ${currentData.formCode}
Planning Version: ${currentData.planningVersion}
Workflow Status: ${currentData.workflowStatus}
Manufacturing Plant: ${currentData.manufacturingPlant}
Business Unit: ${currentData.businessUnit}
Planning Engineer: ${currentData.planningEngineer}
Planning Period: ${currentData.planningPeriod}
Development Stage: ${currentData.developmentStage}
Next Review Date: ${currentData.nextReviewDate}

KEY METRICS & PERFORMANCE:
-----------------------------------------------------
Overall Readiness Score: ${currentData.overallCapacityReadiness}/100
Total Demand Forecast: ${currentData.totalDemandForecast || 120000} units
Planned Production Volume: ${currentData.plannedProductionVolume || 118000} units
Capacity Utilization: ${currentData.capacityUtilization || 78}%
OEE Rating: ${currentData.oeeRating || 82}%
Line Efficiency: ${currentData.lineEfficiency || 85}%
Delivery Performance: ${currentData.deliveryPerformance || 92}%

RESOURCE ALLOCATION:
-----------------------------------------------------
Allocated Machines: ${currentData.allocatedMachines || 68} / ${currentData.totalMachines || 80}
Total Workforce: ${currentData.totalWorkforce || 360}
Tooling Readiness: ${currentData.toolingReadiness || 95}%
Material Availability: ${currentData.materialAvailability || 94}%
Utility Power Coverage: ${currentData.powerSupplyCapacity || 100}%

IDENTIFIED BOTTLENECKS:
-----------------------------------------------------
${(currentData.bottlenecks || []).map((b) => `- ${b.workstation}: ${b.equipment} [${b.constraint}] -> Impact: ${b.impact}, Root Cause: ${b.rootCause}`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentData.planningId}_Capacity_Planning_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Capacity Planning Report exported successfully");
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Capacity Planning"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Capacity Planning Master Record...
        </div>
      </AppShell>
    );
  }

  const currentRecordData = { ...record, ...form.watch() };

  return (
    <AppShell
      title="Capacity Planning"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Capacity Planning"}
      description="Calculate machine hours, shift availability, bottleneck constraints, line balancing, and throughput analysis."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        <CapacityPlanningHeader
          record={currentRecordData as CapacityPlanningRecord}
          onSaveDraft={() => saveDraftMutation.mutate(form.getValues())}
          onSubmitForReview={() => submitMutation.mutate()}
          onExportReport={handleExportReport}
        />

        {/* Unified Capacity Planning Sections */}
        <div className="space-y-5">
          <CapacityOverviewSection
            form={form}
            record={currentRecordData as CapacityPlanningRecord}
            onNavigateTab={(tab) => toast.info(`Viewing ${tab} section`)}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <CapacityAssessmentSection form={form} />
            <ResourcePlanningSection form={form} />
          </div>

          <BottleneckAnalysisSection form={form} />

          <CapacityApprovalSection form={form} reviewers={record.reviewers} />

          <CapacityAttachmentManager
            attachments={record.attachments}
            onAttachmentsChange={(atts) => {
              queryClient.setQueryData(["capacity-planning", "current"], {
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
