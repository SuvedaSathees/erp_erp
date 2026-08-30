import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { RoutingHeader } from "@/components/erp/routing-development/RoutingHeader";
import { AddOperationModal } from "@/components/erp/routing-development/AddOperationModal";
import { OverviewTab } from "@/components/erp/routing-development/tabs/OverviewTab";

import {
  fetchRoutingRecord,
  saveRoutingDraft,
  submitRoutingForReview,
  addRoutingOperation,
} from "@/services/routingDevelopmentService";

export const Route = createFileRoute(
  "/development/research-innovation/routing-development/new",
)({
  component: RoutingDevelopmentPage,
});

export function RoutingDevelopmentPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: record, isLoading } = useQuery({
    queryKey: ["routing-development-record"],
    queryFn: fetchRoutingRecord,
  });

  const saveDraftMutation = useMutation({
    mutationFn: saveRoutingDraft,
    onSuccess: (updated) => {
      queryClient.setQueryData(["routing-development-record"], updated);
      toast.success("Routing Development Draft saved successfully");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: submitRoutingForReview,
    onSuccess: (updated) => {
      queryClient.setQueryData(["routing-development-record"], updated);
      toast.success("Routing submitted for Executive Board review!");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  const addOpMutation = useMutation({
    mutationFn: addRoutingOperation,
    onSuccess: (updated) => {
      queryClient.setQueryData(["routing-development-record"], updated);
      toast.success("New manufacturing operation added to routing");
    },
    onError: (err: any) => toast.error(`Failed to add operation: ${err.message}`),
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Routing Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Routing Development Master Record...
        </div>
      </AppShell>
    );
  }

  const handleExportReport = () => {
    const content = `=====================================================
MANUFACTURING ROUTING SPECIFICATION: ${record.routingName}
=====================================================
Routing ID: ${record.routingId}
Form Code: ${record.formCode}
Routing Number: ${record.routingNumber}
Routing Version: ${record.routingVersion}
Workflow Status: ${record.workflowStatus}
Product: ${record.product} (Revision: ${record.productRevision})
Process Owner: ${record.processOwner}
Created Date: ${record.createdDate}
Effective Date: ${record.effectiveDate}
Next Review Date: ${record.nextReviewDate}

READINESS SCORES:
-----------------------------------------------------
Overall Routing Readiness: ${record.overallReadinessScore}/100
Routing Readiness: ${record.routingReadinessScore}/100
Resource Readiness: ${record.resourceReadinessScore}/100
Manufacturing Readiness: ${record.manufacturingReadinessScore}/100
Quality Score: ${record.qualityScore}/100
Cost Score: ${record.costScore}/100

OPERATIONS MATRIX (${record.operations.length} Operations):
-----------------------------------------------------
${record.operations
  .map(
    (op) =>
      `[${op.operationNo}] Seq ${op.seq}: ${op.operationName} | Work Centre: ${op.workCentre} | Machine: ${op.machine} | Setup: ${op.setupTimeMins}m | Cycle: ${op.cycleTimeMins}m | Labour: ${op.labourCount}`
  )
  .join("\n")}

COST SUMMARY:
-----------------------------------------------------
Total Routing Cost: ₹${record.costSummary.totalRoutingCost.toLocaleString()}
Target Cost: ₹${record.costSummary.targetCost.toLocaleString()}
Cost Variance: ₹${record.costSummary.costVariance.toLocaleString()} (Favorable)

AI ASSESSMENTS & BOTTLENECKS:
-----------------------------------------------------
AI Health Score: ${record.aiAssessment.aiHealthScore}/100
Optimization: ${record.aiAssessment.routingOptimization}
Bottleneck Prediction: ${record.aiAssessment.bottleneckPrediction}
Cycle Time Optimization: ${record.aiAssessment.cycleTimeOptimization}
Recommendation: ${record.recommendation}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.routingNumber}_Routing_Specification.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Routing specification exported and downloaded successfully!");
  };

  return (
    <AppShell
      title="Routing Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Routing Development"}
      description="Define manufacturing operations, work center assignments, setup times, run times, and scrap factors."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Bar */}
        <RoutingHeader
          record={record}
          onSaveDraft={() => saveDraftMutation.mutate({})}
          onSubmitForReview={() => submitMutation.mutate()}
          onExport={handleExportReport}
          onNewRouting={() => {
            setIsAddModalOpen(true);
            toast.info("Creating new routing operation...");
          }}
        />

        {/* Unified Main View */}
        <OverviewTab
          record={record}
          onAddOperation={() => setIsAddModalOpen(true)}
          onNavigateTab={(tab) => toast.info(`Viewing ${tab} section`)}
          onUpdateOperations={(ops) => saveDraftMutation.mutate({ operations: ops })}
          onReviewDecision={(decision, comments) => {
            saveDraftMutation.mutate({ approvalDecision: decision });
            toast.success(`Review decision recorded: ${decision}`);
          }}
        />

        {/* Add Operation Modal */}
        <AddOperationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(op) => addOpMutation.mutate(op)}
          nextSeq={record.operations.length + 1}
        />
      </div>
    </AppShell>
  );
}
