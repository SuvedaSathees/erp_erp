import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";

import { FactoryLayoutHeader } from "@/components/erp/factory-layout/FactoryLayoutHeader";
import { FactoryOverviewSection } from "@/components/erp/factory-layout/FactoryOverviewSection";
import { LayoutPlanningSection } from "@/components/erp/factory-layout/LayoutPlanningSection";
import { InfrastructureSection } from "@/components/erp/factory-layout/InfrastructureSection";
import { MaterialFlowSection } from "@/components/erp/factory-layout/MaterialFlowSection";
import { UtilitySafetySection } from "@/components/erp/factory-layout/UtilitySafetySection";
import { DigitalTwinPanel } from "@/components/erp/factory-layout/DigitalTwinPanel";
import { FactoryAttachmentManager } from "@/components/erp/factory-layout/FactoryAttachmentManager";
import { FactoryApprovalSection } from "@/components/erp/factory-layout/FactoryApprovalSection";

import { factoryLayoutDesignService } from "@/services/factoryLayoutDesignService";
import type { FactoryLayoutFormInput, FactoryLayoutRecord } from "@/services/types";
import { FactoryLayoutMasterSchema } from "@/lib/validation/factoryLayoutSchemas";

export const Route = createFileRoute(
  "/development/research-innovation/factory-layout-design/new",
)({
  component: FactoryLayoutDesignNewPage,
});

export function FactoryLayoutDesignNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  const { data: record, isLoading } = useQuery<FactoryLayoutRecord>({
    queryKey: ["factory-layout", "current"],
    queryFn: () => factoryLayoutDesignService.fetchRecord(),
  });

  const form = useForm<FactoryLayoutFormInput>({
    resolver: zodResolver(FactoryLayoutMasterSchema) as any,
    defaultValues: record || {},
  });

  useEffect(() => {
    if (record) {
      form.reset(record);
    }
  }, [record, form]);

  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<FactoryLayoutFormInput>) =>
      factoryLayoutDesignService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["factory-layout", "current"], updated);
      toast.success("Draft saved successfully!");
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => factoryLayoutDesignService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["factory-layout", "current"], updated);
      toast.success("Submitted for review!");
    },
  });

  const handleExportReport = () => {
    if (!record) return;
    const content = `=====================================================
FACTORY LAYOUT DESIGN SPECIFICATION: ${record.factoryName}
=====================================================
Layout Project ID: ${record.factoryLayoutId}
Form Code: ${record.formCode}
Project Name: ${record.layoutProjectName}
Layout Version: ${record.layoutVersion}
Workflow Status: ${record.workflowStatus}
Plant Name: ${record.plantName}
Facility Location: ${record.facilityLocation}
Layout Engineer: ${record.factoryLayoutEngineer}
Total Land Area: ${record.totalLandArea} m²
Built-up Area: ${record.builtUpArea} m²
Production Capacity: ${record.productionCapacity} units/year
Development Stage: ${record.developmentStage}
Priority: ${record.priority}
Next Review Date: ${record.nextReviewDate}

FACILITY OBJECTIVE:
-----------------------------------------------------
${record.factoryObjective}

LAYOUT READINESS SCORES:
-----------------------------------------------------
Overall Layout Score: ${record.overallLayoutScore}/100
Space Utilization Index: ${record.spaceUtilizationIndex}%
Material Transport Distance: ${record.materialTransportDistance} m/unit
Annual Throughput Capacity: ${record.annualThroughputCapacity} units
Safety Clearance Compliance: ${record.safetyClearanceCompliance}%
Energy Efficiency Rating: ${record.energyEfficiencyRating}

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
    link.download = `${record.factoryLayoutId}_Plant_Layout_Specification.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Factory Layout specification report generated & downloaded successfully!");
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Factory Layout Design"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Factory Layout Design module data...
        </div>
      </AppShell>
    );
  }

  const currentRecordData = { ...record, ...form.watch() };

  return (
    <AppShell
      title="Factory Layout Design"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Factory Layout Design"}
      description="CAD layout blueprints, material logistics flow, utility planning, digital twin simulation & EHS compliance."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        <FactoryLayoutHeader
          record={currentRecordData as FactoryLayoutRecord}
          onSaveDraft={() => saveDraftMutation.mutate(form.getValues())}
          onSubmitForReview={() => submitMutation.mutate()}
          onExportReport={handleExportReport}
        />

        {/* Unified Layout Sections */}
        <div className="space-y-5">
          <FactoryOverviewSection form={form} />
          <LayoutPlanningSection form={form} />

          <InfrastructureSection form={form} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <MaterialFlowSection form={form} />
            <UtilitySafetySection form={form} />
          </div>

          <DigitalTwinPanel layoutId={record.id} />

          <FactoryApprovalSection form={form} reviewers={record.reviewers} />

          <FactoryAttachmentManager
            attachments={record.attachments}
            onAttachmentsChange={(atts) => {
              queryClient.setQueryData(["factory-layout", "current"], {
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

