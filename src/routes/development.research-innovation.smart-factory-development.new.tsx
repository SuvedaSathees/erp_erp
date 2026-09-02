import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";

import { smartFactoryDevelopmentService } from "@/services";
import type { SmartFactoryDevelopmentRecord } from "@/services/types";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { SmartFactoryHeader } from "@/components/erp/smartFactory/SmartFactoryHeader";
import { SmartFactoryOverviewCard } from "@/components/erp/smartFactory/SmartFactoryOverviewCard";
import { SmartFactoryInfrastructureCard } from "@/components/erp/smartFactory/SmartFactoryInfrastructureCard";
import { SmartFactorySystemsCard } from "@/components/erp/smartFactory/SmartFactorySystemsCard";
import { SmartFactoryAutomationCard } from "@/components/erp/smartFactory/SmartFactoryAutomationCard";
import { SmartFactoryOperationsCard } from "@/components/erp/smartFactory/SmartFactoryOperationsCard";
import { SmartFactoryValidationCard } from "@/components/erp/smartFactory/SmartFactoryValidationCard";
import { SmartFactoryAttachmentsCard } from "@/components/erp/smartFactory/SmartFactoryAttachmentsCard";
import { SmartFactoryReviewApprovalCard } from "@/components/erp/smartFactory/SmartFactoryReviewApprovalCard";
import { NewSmartFactoryDialog } from "@/components/erp/smartFactory/NewSmartFactoryDialog";

export const Route = createFileRoute(
  "/development/research-innovation/smart-factory-development/new",
)({
  head: () => ({
    meta: [{ title: "Smart Factory Development Form · Magnertia ERP" }],
  }),
  component: SmartFactoryDevelopmentPage,
});

export function SmartFactoryDevelopmentPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Data Fetching
  const { data: record, isLoading } = useQuery<SmartFactoryDevelopmentRecord>({
    queryKey: ["smartFactoryRecord"],
    queryFn: () => smartFactoryDevelopmentService.fetchRecord(),
  });

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<SmartFactoryDevelopmentRecord>) =>
      smartFactoryDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["smartFactoryRecord"], updated);
      toast.success("Draft Saved Successfully!", {
        description: "Smart Factory Development project parameters updated.",
      });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: () => smartFactoryDevelopmentService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["smartFactoryRecord"], updated);
      toast.success("Submitted for Executive Board Review!", {
        description: "Stakeholders and plant directors notified.",
      });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: ({
      decision,
      comments,
    }: {
      decision: "Approved" | "Approved with Conditions" | "Revision Required" | "Rejected";
      comments?: string;
    }) => smartFactoryDevelopmentService.reviewDecision({ decision, comments: comments || "" }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["smartFactoryRecord"], updated);
      toast.success("Review Decision Recorded!", {
        description: `Status updated to ${updated.workflowStatus}.`,
      });
    },
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Smart Factory Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Smart Factory Development Master Record...
        </div>
      </AppShell>
    );
  }

  const handleFieldChange = (field: keyof SmartFactoryDevelopmentRecord, value: any) => {
    queryClient.setQueryData(["smartFactoryRecord"], {
      ...record,
      [field]: value,
    });
  };

  const handleSaveDraft = () => {
    saveDraftMutation.mutate(record);
  };

  const handleSubmitForApproval = () => {
    submitReviewMutation.mutate();
  };

  const handlePreview = () => {
    if (!record) return;
    const content = `=====================================================
SMART FACTORY ARCHITECTURE BLUEPRINT: ${record.smartFactoryProjectTitle}
=====================================================
Project ID: ${record.smartFactoryProjectId}
Form Code: ${record.formCode}
Project Number: ${record.projectNumber}
Workflow Status: ${record.workflowStatus}
Manufacturing Plant: ${record.manufacturingPlant}
Factory Zone: ${record.factoryZone}
Project Manager: ${record.projectManager}
Target Go-Live: ${record.targetGoLive}
Smart Factory Level: ${record.smartFactoryLevel}
Industry 4.0 Maturity: ${record.industry40Maturity}

READINESS SCORES:
-----------------------------------------------------
Overall Smart Factory Readiness: ${record.overallSmartFactoryReadiness}/100
Infrastructure Readiness Score: ${record.infrastructureReadinessScore}/100
Integration Score: ${record.integrationScore}/100
Automation Score: ${record.automationScore}/100
Operational Score: ${record.operationalScore}/100
AI Readiness Score: ${record.aiReadinessScore}/100
Validation Score: ${record.validationScore}/100

Vision: ${record.factoryVision}
Objectives: ${record.businessObjectives}
Recommendation: ${record.recommendation}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.projectNumber}_Smart_Factory_Blueprint.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Smart Factory Blueprint generated & downloaded successfully!");
  };

  const handleCreateNewProject = (newProj: any) => {
    const created: SmartFactoryDevelopmentRecord = {
      ...record,
      id: `sf-rec-${Date.now()}`,
      smartFactoryProjectId: `SFP-2024-${Math.floor(10000 + Math.random() * 90000)}`,
      formCode: "SFPF-2024-25",
      smartFactoryProjectTitle: newProj.title,
      projectNumber: newProj.projectNumber,
      manufacturingPlant: newProj.plant,
      factoryZone: newProj.zone,
      projectManager: newProj.manager,
      smartFactoryLevel: newProj.level,
      industry40Maturity: newProj.maturity,
      factoryVision: newProj.vision,
      workflowStatus: "In Progress",
      version: 1.0,
      startDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };

    queryClient.setQueryData(["smartFactoryRecord"], created);
    toast.success("New Smart Factory Project Created!", {
      description: `Project ID ${created.smartFactoryProjectId} initialized.`,
    });
  };

  const handleUploadAttachment = async (fileInfo: {
    name: string;
    type: string;
    size: number;
    documentType: string;
  }) => {
    const newAtt = await smartFactoryDevelopmentService.uploadAttachment(fileInfo);
    const updated = {
      ...record,
      attachments: [newAtt, ...record.attachments],
    };
    queryClient.setQueryData(["smartFactoryRecord"], updated);
    toast.success("Attachment Uploaded", {
      description: `${fileInfo.name} attached under ${fileInfo.documentType}.`,
    });
  };

  const handleDeleteAttachment = (id: string) => {
    if (!record) return;
    const attToDelete = record.attachments.find((a) => a.id === id);
    const updated = {
      ...record,
      attachments: record.attachments.filter((a) => a.id !== id),
    };
    queryClient.setQueryData(["smartFactoryRecord"], updated);
    toast.info(`Removed ${attToDelete?.fileName || "attachment"}`);
  };

  const handleReviewDecision = (
    decision: "Approved" | "Approved with Conditions" | "Revision Required" | "Rejected",
    comments: string
  ) => {
    reviewDecisionMutation.mutate({ decision, comments });
  };

  return (
    <AppShell
      title="Smart Factory Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Smart Factory Development"}
      description="Govern Industry 4.0 transformation through IIoT, Cyber-Physical Systems, Digital Twins, AI, and MES."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="flex flex-col gap-5 p-4 sm:p-6">
        {/* Header Bar */}
        <SmartFactoryHeader
          record={record}
          onSaveDraft={handleSaveDraft}
          onSubmitForApproval={handleSubmitForApproval}
          onPreview={handlePreview}
          onNewProject={() => setIsNewDialogOpen(true)}
          onExportReport={handlePreview}
          isSubmitting={submitReviewMutation.isPending}
        />

        {/* Full-Width Unified Sections */}
        <div className="flex flex-col gap-6">
          <SmartFactoryOverviewCard
            record={record}
            onChange={handleFieldChange}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SmartFactoryInfrastructureCard
              record={record}
              onChange={handleFieldChange}
            />
            <SmartFactorySystemsCard
              record={record}
              onChange={handleFieldChange}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <SmartFactoryAutomationCard
              record={record}
              onChange={handleFieldChange}
            />
            <SmartFactoryOperationsCard
              record={record}
              onChange={handleFieldChange}
            />
          </div>

          <SmartFactoryValidationCard
            record={record}
            onChange={handleFieldChange}
          />

          <SmartFactoryReviewApprovalCard
            record={record}
            onDecisionChange={handleReviewDecision}
          />

          <SmartFactoryAttachmentsCard
            record={record}
            onUploadAttachment={handleUploadAttachment}
            onDeleteAttachment={handleDeleteAttachment}
          />
        </div>
      </div>

      {/* New Project Dialog */}
      <NewSmartFactoryDialog
        open={isNewDialogOpen}
        onOpenChange={setIsNewDialogOpen}
        onCreate={handleCreateNewProject}
      />

      {/* Full AI Analysis Modal */}
      <Dialog open={isAiModalOpen} onOpenChange={setIsAiModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-pink-600" />
              <DialogTitle className="text-lg font-bold">
                Full AI Smart Factory Analysis & Simulation
              </DialogTitle>
            </div>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2 text-xs">
            <div className="rounded-lg bg-pink-50/60 p-3.5 dark:bg-pink-950/20">
              <h4 className="font-bold text-pink-900 dark:text-pink-300">
                AI Autonomous Recommendation Summary
              </h4>
              <p className="mt-1 text-pink-800 dark:text-pink-400">
                The AI Manufacturing Intelligence engine has analyzed shop floor telemetry from 142 IIoT sensors, 12 PLC controllers, 8 AGV/AMRs, and the Digital Twin model.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <span className="font-bold text-foreground">Robot Line Balance Efficiency</span>
                <div className="mt-1 text-xl font-black text-emerald-600">94.2%</div>
                <span className="text-[10px] text-muted-foreground">+8.6% gain predicted</span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-bold text-foreground">Digital Twin Model Fidelity</span>
                <div className="mt-1 text-xl font-black text-blue-600">98.7%</div>
                <span className="text-[10px] text-muted-foreground">Physics simulation aligned</span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-bold text-foreground">Annual Energy Optimization</span>
                <div className="mt-1 text-xl font-black text-purple-600">₹ 12.4 Lakhs</div>
                <span className="text-[10px] text-muted-foreground">Peak shaving active</span>
              </div>
              <div className="rounded-lg border border-border p-3">
                <span className="font-bold text-foreground">Defect Reduction Potential</span>
                <div className="mt-1 text-xl font-black text-amber-600">18.4%</div>
                <span className="text-[10px] text-muted-foreground">Vision AI enabled</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => setIsAiModalOpen(false)}>
                Close Analysis
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
