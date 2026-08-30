import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { ApqpHeader } from "@/components/erp/apqp/ApqpHeader";
import { ApqpProjectOverviewCard } from "@/components/erp/apqp/ApqpProjectOverviewCard";
import { ApqpDeliverablesTable } from "@/components/erp/apqp/ApqpDeliverablesTable";
import { ApqpScoreCardsGrid } from "@/components/erp/apqp/ApqpScoreCardsGrid";
import { ApqpMilestonesPanel } from "@/components/erp/apqp/ApqpMilestonesPanel";
import { ReviewApprovalTab } from "@/components/erp/apqp/tabs/ReviewApprovalTab";
import { AttachmentsTab } from "@/components/erp/apqp/tabs/AttachmentsTab";
import { AddApqpProjectModal } from "@/components/erp/apqp/AddApqpProjectModal";

import {
  fetchApqpRecord,
  saveApqpDraft,
  submitApqpForReview,
} from "@/services/apqpService";

export const Route = createFileRoute(
  "/development/research-innovation/quality-planning-apqp/new",
)({
  component: ApqpQualityPlanningPage,
});

export function ApqpQualityPlanningPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: record, isLoading } = useQuery({
    queryKey: ["apqp-quality-planning-record"],
    queryFn: fetchApqpRecord,
  });

  const saveDraftMutation = useMutation({
    mutationFn: saveApqpDraft,
    onSuccess: (updated) => {
      queryClient.setQueryData(["apqp-quality-planning-record"], updated);
      toast.success("APQP Quality Planning Draft saved successfully");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: submitApqpForReview,
    onSuccess: (updated) => {
      queryClient.setQueryData(["apqp-quality-planning-record"], updated);
      toast.success("APQP Project submitted for Executive Board review!");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Quality Planning (APQP)"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Quality Planning (APQP) Master Record...
        </div>
      </AppShell>
    );
  }

  const handleExportReport = () => {
    const content = `=====================================================
ADVANCED PRODUCT QUALITY PLANNING (APQP) REPORT: ${record.apqpProjectName}
=====================================================
APQP ID: ${record.apqpId}
Form Code: ${record.formCode}
APQP Number: ${record.apqpNumber}
Current Phase: ${record.apqpPhase}
Workflow Status: ${record.workflowStatus}
Product: ${record.product} (Revision ${record.productRevision})
Customer: ${record.customer}
Project Manager: ${record.projectManager}
Target SOP Date: ${record.targetSopDate}
Program Status: ${record.programStatus}
Priority: ${record.priority}

QUALITY & READINESS SCORES:
-----------------------------------------------------
Overall APQP Score: ${record.overallApqpScore}/100
Design Readiness: ${record.designScore}/100
Validation Readiness: ${record.validationScore}/100
Supplier Quality: ${record.supplierQualityScore}/100
Risk Readiness: ${record.riskScore}/100
Cost Readiness: ${record.costReadinessScore}/100

APQP PHASE DELIVERABLES:
-----------------------------------------------------
${record.deliverables.map((d) => `[Phase ${d.phaseNumber}] ${d.keyDeliverables} | Owner: ${d.owner} | Target: ${d.targetDate} | Status: ${d.status} (${d.completionPercentage}%)`).join("\n")}

UPCOMING MILESTONES:
-----------------------------------------------------
${record.upcomingMilestones.map((m) => `[${m.status}] ${m.label}: ${m.date}`).join("\n")}

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.name} - ${r.status} (${r.date})`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.apqpNumber}_Quality_Plan_APQP.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("APQP Quality Plan exported & downloaded successfully!");
  };

  return (
    <AppShell
      title="Quality Planning (APQP)"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Quality Planning (APQP)"}
      description="Advanced Product Quality Planning gates, feasibility commits, and product quality timing plans."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Bar */}
        <ApqpHeader
          record={record}
          onSaveDraft={() => saveDraftMutation.mutate({})}
          onSubmitForReview={() => submitMutation.mutate()}
          onExport={handleExportReport}
          onNewProject={() => setIsAddModalOpen(true)}
        />

        {/* Unified Layout Stack */}
        <div className="space-y-5">
          {/* Section 1: Overview */}
          <ApqpProjectOverviewCard record={record} />

          {/* Section 2: 5 Readiness Score Cards */}
          <ApqpScoreCardsGrid record={record} onNavigateTab={() => {}} />

          {/* Section 3: Phase Deliverables Table */}
          <ApqpDeliverablesTable
            deliverables={record.deliverables}
            onViewAll={() => {}}
          />

          {/* Section 4: Upcoming Milestones */}
          <ApqpMilestonesPanel
            milestones={record.upcomingMilestones}
            onViewAll={() => {}}
          />

          {/* Section 4: Multi-Level Review & Approval Authorization */}
          <ReviewApprovalTab
            record={record}
            onReviewDecision={(decision, comments) => {
              saveDraftMutation.mutate({ approvalDecision: decision });
              toast.success(`APQP Gate decision submitted: ${decision}`);
            }}
          />

          {/* Section 5: Controlled Documents & Attachments */}
          <AttachmentsTab record={record} />
        </div>

        {/* Add Project Modal */}
        <AddApqpProjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </AppShell>
  );
}
