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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye } from "lucide-react";

import {
  fetchRoutingRecord,
  saveRoutingDraft,
  submitRoutingForReview,
  addRoutingOperation,
} from "@/services/routingDevelopmentService";
import type { RoutingAttachment, RoutingRecord } from "@/services/types";

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
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const { data: record, isLoading } = useQuery<RoutingRecord>({
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
Effective Date: ${record.effectiveDate || "01 Jul 2024"}

TOTALS:
-----------------------------------------------------
Total Setup Time: ${record.totalSetupTimeMins || 225} min
Total Cycle Time: ${record.totalCycleTimeMins || 108.5} min
Total Labour: ${record.totalLabourCount || 17} Operators

OPERATIONS MATRIX (${record.operations.length} Operations):
-----------------------------------------------------
${record.operations
  .map(
    (op) =>
      `[${op.operationNo}] Seq ${op.seq}: ${op.operationName} | Work Centre: ${op.workCentre} | Machine: ${op.machine} | Setup: ${op.setupTimeMins}m | Cycle: ${op.cycleTimeMins}m | Labour: ${op.labourCount}`
  )
  .join("\n")}

COST ANALYSIS:
-----------------------------------------------------
Machine Cost: ₹${record.costSummary.machineCost.toLocaleString()}
Labour Cost: ₹${record.costSummary.labourCost.toLocaleString()}
Tooling Cost: ₹${record.costSummary.toolingCost.toLocaleString()}
Overhead Cost: ₹${record.costSummary.overheadCost.toLocaleString()}
Total Routing Cost: ₹${record.costSummary.totalRoutingCost.toLocaleString()}
Target Cost: ₹${record.costSummary.targetCost.toLocaleString()}
Cost Variance: ₹${record.costSummary.costVariance.toLocaleString()} (Favorable)

AI ASSESSMENTS & BOTTLENECKS:
-----------------------------------------------------
AI Health Score: ${record.aiAssessment.aiHealthScore}/100
Optimization: ${record.aiAssessment.routingOptimization}
Bottleneck Prediction: ${record.aiAssessment.bottleneckPrediction}
Cycle Time Optimization: ${record.aiAssessment.cycleTimeOptimization}
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

  const handleUploadAttachment = (fileInfo: {
    name: string;
    type: string;
    size: number;
    documentType: string;
  }) => {
    const newAtt: RoutingAttachment = {
      id: `att-rtg-${Date.now()}`,
      fileName: fileInfo.name,
      fileType: fileInfo.type || "PDF Document",
      documentType: fileInfo.documentType,
      version: "1.0",
      uploadedBy: "Current User",
      uploadedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      fileSize: `${(fileInfo.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "Active",
    };
    const updated = {
      ...record,
      attachments: [newAtt, ...record.attachments],
    };
    queryClient.setQueryData(["routing-development-record"], updated);
    toast.success("Attachment Uploaded", {
      description: `${fileInfo.name} attached to routing.`,
    });
  };

  const handleDeleteAttachment = (id: string) => {
    const attToDelete = record.attachments.find((a) => a.id === id);
    const updated = {
      ...record,
      attachments: record.attachments.filter((a) => a.id !== id),
    };
    queryClient.setQueryData(["routing-development-record"], updated);
    toast.info(`Removed ${attToDelete?.fileName || "document"}`);
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
          onNewRouting={() => setIsAddModalOpen(true)}
        />

        {/* Unified Main View */}
        <OverviewTab
          record={record}
          onAddOperation={() => setIsAddModalOpen(true)}
          onNavigateTab={(tab) => {
            if (tab === "ai") setIsAiModalOpen(true);
            else toast.info(`Viewing ${tab} section`);
          }}
          onUpdateOperations={(ops) => saveDraftMutation.mutate({ operations: ops })}
          onReviewDecision={(decision, comments) => {
            saveDraftMutation.mutate({ approvalDecision: decision });
            toast.success(`Review decision recorded: ${decision}`);
          }}
          onUploadAttachment={handleUploadAttachment}
          onDeleteAttachment={handleDeleteAttachment}
        />

        {/* Add Operation Modal */}
        <AddOperationModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={(op) => addOpMutation.mutate(op)}
          nextSeq={record.operations.length + 1}
        />

        {/* Full AI Analysis Modal */}
        <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Manufacturing Routing Optimization
              </DialogTitle>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
              <p className="text-emerald-400 font-bold">=== AI ROUTING INTELLIGENCE ===</p>
              <p>AI Health Score: <strong>84 / 100</strong></p>
              <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs space-y-1.5">
                <p>• <strong>Throughput Gain:</strong> {record.aiAssessment.routingOptimization}</p>
                <p>• <strong>Bottleneck Prediction:</strong> {record.aiAssessment.bottleneckPrediction}</p>
                <p>• <strong>Cycle Time Savings:</strong> {record.aiAssessment.cycleTimeOptimization}</p>
                <p>• <strong>Resource Recommendation:</strong> {record.aiAssessment.resourceOptimization}</p>
                <p>• <strong>Production Readiness:</strong> {record.aiAssessment.productionRecommendation}</p>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAiModalOpen(false)} className="h-8 text-xs bg-primary text-primary-foreground cursor-pointer">
                Close Analysis
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
