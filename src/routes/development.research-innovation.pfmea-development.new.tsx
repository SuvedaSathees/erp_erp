import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { PfmeaHeader } from "@/components/erp/pfmea/PfmeaHeader";
import { PfmeaFailureAnalysisTable } from "@/components/erp/pfmea/PfmeaFailureAnalysisTable";
import { PfmeaRecommendedActionsCard } from "@/components/erp/pfmea/PfmeaRecommendedActionsCard";
import { PfmeaManufacturingValidationCard } from "@/components/erp/pfmea/PfmeaManufacturingValidationCard";
import { ReviewApprovalTab } from "@/components/erp/pfmea/tabs/ReviewApprovalTab";
import { AttachmentsTab } from "@/components/erp/pfmea/tabs/AttachmentsTab";
import { AddFailureModeModal } from "@/components/erp/pfmea/AddFailureModeModal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  fetchPfmeaRecord,
  savePfmeaDraft,
  submitPfmeaForReview,
  addFailureMode,
} from "@/services/pfmeaService";

export const Route = createFileRoute(
  "/development/research-innovation/pfmea-development/new",
)({
  component: PfmeaDevelopmentPage,
});

export function PfmeaDevelopmentPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isAddFmModalOpen, setIsAddFmModalOpen] = useState(false);

  const { data: record, isLoading } = useQuery({
    queryKey: ["pfmea-development-record"],
    queryFn: fetchPfmeaRecord,
  });

  const saveDraftMutation = useMutation({
    mutationFn: savePfmeaDraft,
    onSuccess: (updated) => {
      queryClient.setQueryData(["pfmea-development-record"], updated);
      toast.success("PFMEA Development Draft saved successfully");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: submitPfmeaForReview,
    onSuccess: (updated) => {
      queryClient.setQueryData(["pfmea-development-record"], updated);
      toast.success("PFMEA Project submitted for Executive Board review!");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  const addFmMutation = useMutation({
    mutationFn: addFailureMode,
    onSuccess: (updated) => {
      queryClient.setQueryData(["pfmea-development-record"], updated);
      toast.success("New Failure Mode added to PFMEA worksheet!");
    },
    onError: (err: any) => toast.error(`Failed to add Failure Mode: ${err.message}`),
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="PFMEA Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Process Failure Mode & Effects Analysis Record...
        </div>
      </AppShell>
    );
  }

  const handleExportReport = () => {
    const content = `=====================================================
PFMEA SPECIFICATION REPORT: ${record.pfmeaTitle}
=====================================================
PFMEA ID: ${record.pfmeaId}
Form Code: ${record.formCode}
PFMEA Number: ${record.pfmeaNumber}
Version: ${record.pfmeaVersion}
Workflow Status: ${record.workflowStatus}
Product: ${record.product} (Revision ${record.productRevision})
Process: ${record.manufacturingProcess}
Process Owner: ${record.processOwner}
APQP Reference: ${record.apqpRef}
Created Date: ${record.createdDate}

RISK EVALUATION OVERVIEW:
-----------------------------------------------------
Overall Risk Score: ${record.overallRiskScore}/100
Structure Score: ${record.structureScore}/100
Function Score: ${record.functionScore}/100
Mitigation Score: ${record.mitigationScore}/100
Validation Score: ${record.validationScore}/100

FAILURE MODES REGISTER:
-----------------------------------------------------
${record.failureModes.map((fm) => `[${fm.stepNumber}] ${fm.processStep} | Failure Mode: ${fm.failureMode} | Cause: ${fm.failureCause} | Effect: ${fm.failureEffect} | S:${fm.severity} O:${fm.occurrence} D:${fm.detection} | AP:${fm.actionPriority} | Status: ${fm.status}`).join("\n")}

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.person} - ${r.status} (${r.date})`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.pfmeaNumber}_PFMEA_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("PFMEA Worksheet exported & downloaded successfully!");
  };

  return (
    <AppShell
      title="PFMEA Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > PFMEA"}
      description="Process Failure Mode and Effects Analysis (PFMEA) according to AIAG-VDA standard with Action Priority (AP)."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Bar */}
        <PfmeaHeader
          record={record}
          onSaveDraft={() => saveDraftMutation.mutate({})}
          onSubmitForReview={() => submitMutation.mutate()}
          onExport={handleExportReport}
          onNewPfmea={() => setIsAddFmModalOpen(true)}
        />

        {/* Unified Layout Stack */}
        <div className="space-y-5">
          {/* Section 1: Overview Card */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">PFMEA Process Profile & Scope</CardTitle>
                <CardDescription className="text-xs">
                  Process failure mode analysis baseline, APQP alignment, and engineering context.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary text-xs font-semibold">
                AIAG-VDA Harmonized
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">PFMEA Title</span>
                  <span className="font-bold text-foreground text-sm">{record.pfmeaTitle}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Manufacturing Process</span>
                  <span className="font-bold text-foreground text-sm">{record.manufacturingProcess}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Product Family</span>
                  <span className="font-semibold text-foreground">{record.product} ({record.productRevision})</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Process Owner</span>
                  <span className="font-semibold text-foreground">{record.processOwner}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">APQP Reference</span>
                  <span className="font-semibold font-mono text-primary">{record.apqpRef}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Total Failure Modes</span>
                  <span className="font-bold font-mono text-foreground">{record.failureModes.length} Items</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Top RPN (Before / After)</span>
                  <span className="font-bold font-mono text-rose-600">384 <span className="text-muted-foreground font-normal">→</span> <span className="text-emerald-600">96</span></span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">High-Risk Items</span>
                  <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200">
                    6 Requires Action
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Failure Analysis Register Table */}
          <PfmeaFailureAnalysisTable
            failureModes={record.failureModes}
            onAddFailureMode={() => setIsAddFmModalOpen(true)}
            onViewAll={() => {}}
          />

          {/* Section 3: Recommended Actions & Validation (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <PfmeaRecommendedActionsCard
              recommendedActions={record.recommendedActions}
              onViewAll={() => {}}
            />
            <PfmeaManufacturingValidationCard
              record={record}
              onViewValidation={() => {}}
            />
          </div>

          {/* Section 4: Multi-Level Review & Approval Authorization */}
          <ReviewApprovalTab
            record={record}
            onReviewDecision={(decision, comments) => {
              saveDraftMutation.mutate({ approvalDecision: decision });
              toast.success(`PFMEA Board decision submitted: ${decision}`);
            }}
          />

          {/* Section 5: Controlled Documents & Attachments */}
          <AttachmentsTab record={record} />
        </div>

        {/* Add Failure Mode Modal */}
        <AddFailureModeModal
          isOpen={isAddFmModalOpen}
          onClose={() => setIsAddFmModalOpen(false)}
          onAdd={(item) => addFmMutation.mutate(item)}
          nextStepNo={record.failureModes.length + 1}
        />
      </div>
    </AppShell>
  );
}
