import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { CapaHeader } from "@/components/erp/capa/CapaHeader";
import { CapaPhaseStepper } from "@/components/erp/capa/CapaPhaseStepper";
import { CapaHeaderCard } from "@/components/erp/capa/CapaHeaderCard";
import { CapaProblemScopeCard } from "@/components/erp/capa/CapaProblemScopeCard";
import { CapaRiskAssessmentCard } from "@/components/erp/capa/CapaRiskAssessmentCard";
import { CapaActionPlanCard } from "@/components/erp/capa/CapaActionPlanCard";
import { CapaVerificationCard } from "@/components/erp/capa/CapaVerificationCard";
import { CapaOverviewCard } from "@/components/erp/capa/CapaOverviewCard";
import { CapaAiInsightsCard } from "@/components/erp/capa/CapaAiInsightsCard";
import { CapaLinkedRecordsCard } from "@/components/erp/capa/CapaLinkedRecordsCard";
import { CreateCapaModal } from "@/components/erp/capa/CreateCapaModal";

import { INITIAL_CAPA_RECORD } from "@/services/capaService";
import { CapaRecord, CapaActionItem } from "@/services/capaTypes";
import { Button } from "@/components/ui/button";
import { Layers, SlidersHorizontal, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/management/quality-management/capa")({
  head: () => ({
    meta: [
      { title: "CAPA Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Closed-loop corrective and preventive actions, 8D problem solving, and residual risk verification.",
      },
    ],
  }),
  component: CapaPage,
});

export function CapaPage() {
  const [record, setRecord] = useState<CapaRecord>(INITIAL_CAPA_RECORD);
  const [activeStep, setActiveStep] = useState<number>(5);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const handleFieldChange = (field: keyof CapaRecord, value: any) => {
    setRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle action item status
  const handleToggleActionStatus = (id: string) => {
    setRecord((prev) => ({
      ...prev,
      actions: prev.actions.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: CapaActionItem["status"] =
          item.status === "Open"
            ? "In Progress"
            : item.status === "In Progress"
            ? "Completed"
            : item.status === "Completed"
            ? "Verified"
            : "Open";
        return { ...item, status: nextStatus };
      }),
    }));
    toast.info("Action item status updated");
  };

  // Add action item
  const handleAddAction = (newAction: CapaActionItem) => {
    setRecord((prev) => ({
      ...prev,
      actions: [...prev.actions, newAction],
    }));
  };

  // Delete action item
  const handleDeleteAction = (id: string) => {
    setRecord((prev) => ({
      ...prev,
      actions: prev.actions.filter((item) => item.id !== id),
    }));
  };

  const handleSave = () => {
    toast.success(`CAPA record ${record.capaNumber} saved as draft`);
  };

  const handleSubmitForVerification = () => {
    setRecord((prev) => ({ ...prev, status: "Effectiveness Verification" }));
    setActiveStep(6);
    toast.success(`CAPA ${record.capaNumber} submitted for effectiveness verification!`);
  };

  const handleVerifyEffectiveness = () => {
    setRecord((prev) => ({
      ...prev,
      status: "Closed",
      workflowStatus: "Closed",
      isEffective: true,
    }));
    setActiveStep(7);
    toast.success(`CAPA ${record.capaNumber} successfully closed and validated!`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Callback when new CAPA created via modal
  const handleNewCapaCreated = (newRecord: Partial<CapaRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newRecord,
    }));
    setActiveStep(1);
    toast.success(`Switched active investigation to ${newRecord.capaNumber}`);
  };

  // Phase metadata for the indicator bar
  const phaseMetadata = useMemo(() => {
    switch (activeStep) {
      case 1:
      case 2:
        return {
          badge: "Phase 1 & 2: CAPA Initiation & 5W2H Problem Definition",
          desc: "Defect symptoms, product boundary, quarantine status, and underlying root cause summary.",
        };
      case 3:
      case 4:
        return {
          badge: "Phase 3 & 4: FMEA Risk Assessment & Root Cause Linkage",
          desc: "Initial vs. residual Risk Priority Numbers (RPN), severity, occurrence, detection, and RCA link.",
        };
      case 5:
        return {
          badge: "Phase 5: Action Plan & Implementation Tasks",
          desc: "Containment, corrective actions, preventive recurrence engineering, and work order tracking.",
        };
      case 6:
      case 7:
      default:
        return {
          badge: "Phase 6 & 7: Effectiveness Verification & Closure Sign-Off",
          desc: "Validation sample telemetry, acceptance criteria review, and closed-loop sign-off.",
        };
    }
  }, [activeStep]);

  return (
    <AppShell
      title="CAPA Management"
      breadcrumb="Management › Quality Management › CAPA Management"
      description="Closed-loop corrective and preventive actions, 8D problem solving, and residual risk verification."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Header Action Bar */}
        <CapaHeader
          record={record}
          onSave={handleSave}
          onSubmitForVerification={handleSubmitForVerification}
          onPrint={handlePrint}
          onVerifyEffectiveness={handleVerifyEffectiveness}
          onCreateCapa={() => setCreateModalOpen(true)}
        />

        {/* Connected CAPA Phase Stepper */}
        <div className="w-full min-w-0 space-y-2.5">
          <CapaPhaseStepper
            currentStep={activeStep}
            onStepClick={(step) => setActiveStep(step)}
          />

          {/* Stepper Control & Quick Phase Hop Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">
                {viewMode === "phase" ? phaseMetadata.badge : "All CAPA Workflow Sections"}
              </span>
              <span className="text-muted-foreground hidden md:inline">
                • {viewMode === "phase" ? phaseMetadata.desc : "Viewing all 7 CAPA lifecycle stages simultaneously"}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                size="sm"
                variant={viewMode === "phase" ? "secondary" : "outline"}
                onClick={() => setViewMode(viewMode === "phase" ? "all" : "phase")}
                className="h-7 text-xs px-2.5 font-medium border-border/80"
              >
                {viewMode === "phase" ? (
                  <>
                    <Layers className="w-3 h-3 mr-1.5 text-primary" />
                    View All Sections
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-3 h-3 mr-1.5 text-primary" />
                    Focus on Active Phase
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
          {/* Left 2-Column Area: Header, Scope, Risk, Action Plan, Verification */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            {/* Phase 1 & 2: Header & 5W2H Problem Definition */}
            {(viewMode === "all" || activeStep === 1 || activeStep === 2) && (
              <>
                <CapaHeaderCard
                  record={record}
                  onChange={handleFieldChange}
                />
                <CapaProblemScopeCard
                  record={record}
                  onChange={handleFieldChange}
                />
              </>
            )}

            {/* Phase 3 & 4: Risk Assessment & RCA Linkage */}
            {(viewMode === "all" || activeStep === 3 || activeStep === 4) && (
              <>
                <CapaRiskAssessmentCard
                  record={record}
                  onChange={handleFieldChange}
                />
                {viewMode === "phase" && (
                  <CapaProblemScopeCard
                    record={record}
                    onChange={handleFieldChange}
                  />
                )}
              </>
            )}

            {/* Phase 5: Action Implementation Tasks */}
            {(viewMode === "all" || activeStep === 5) && (
              <CapaActionPlanCard
                actions={record.actions}
                onToggleStatus={handleToggleActionStatus}
                onAddAction={handleAddAction}
                onDeleteAction={handleDeleteAction}
              />
            )}

            {/* Phase 6 & 7: Effectiveness Verification & Closure */}
            {(viewMode === "all" || activeStep === 6 || activeStep === 7) && (
              <CapaVerificationCard
                record={record}
                onChange={handleFieldChange}
              />
            )}
          </div>

          {/* Right Column: Progress Overview, AI Insights, Linked Records */}
          <div className="space-y-5 min-w-0">
            <CapaOverviewCard
              record={record}
              onSubmitForVerification={handleSubmitForVerification}
              onVerifyEffectiveness={handleVerifyEffectiveness}
              onPrint={handlePrint}
            />
            <CapaAiInsightsCard insights={record.aiInsights} />
            <CapaLinkedRecordsCard record={record} />
          </div>
        </div>
      </div>

      {/* Create CAPA Modal */}
      <CreateCapaModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={handleNewCapaCreated}
      />
    </AppShell>
  );
}
