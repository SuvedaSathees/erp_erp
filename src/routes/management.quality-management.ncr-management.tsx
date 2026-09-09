import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { NcrHeader } from "@/components/erp/ncr/NcrHeader";
import { NcrPhaseStepper } from "@/components/erp/ncr/NcrPhaseStepper";
import { NcrHeaderCard } from "@/components/erp/ncr/NcrHeaderCard";
import { NcrIdentificationCard } from "@/components/erp/ncr/NcrIdentificationCard";
import { NcrProblemDescriptionCard } from "@/components/erp/ncr/NcrProblemDescriptionCard";
import { NcrSummaryCard } from "@/components/erp/ncr/NcrSummaryCard";
import { NcrDefectCategoryDonutCard } from "@/components/erp/ncr/NcrDefectCategoryDonutCard";
import { NcrContainmentCard } from "@/components/erp/ncr/NcrContainmentCard";
import { NcrLinkedRecordsCard } from "@/components/erp/ncr/NcrLinkedRecordsCard";
import { NcrRecentActivitiesCard } from "@/components/erp/ncr/NcrRecentActivitiesCard";
import { NcrAiInsightsCard } from "@/components/erp/ncr/NcrAiInsightsCard";
import { CreateNcrModal } from "@/components/erp/ncr/CreateNcrModal";

import { NcrContainmentTab } from "@/components/erp/ncr/tabs/NcrContainmentTab";
import { NcrInvestigationTab } from "@/components/erp/ncr/tabs/NcrInvestigationTab";
import { NcrRootCauseAnalysisTab } from "@/components/erp/ncr/tabs/NcrRootCauseAnalysisTab";
import { NcrCorrectiveActionTab } from "@/components/erp/ncr/tabs/NcrCorrectiveActionTab";
import { NcrVerificationTab } from "@/components/erp/ncr/tabs/NcrVerificationTab";
import { NcrDispositionTab } from "@/components/erp/ncr/tabs/NcrDispositionTab";
import { NcrAttachmentsTab } from "@/components/erp/ncr/tabs/NcrAttachmentsTab";
import { NcrHistoryTab } from "@/components/erp/ncr/tabs/NcrHistoryTab";

import { INITIAL_NCR_RECORD } from "@/services/ncrService";
import { NcrRecord } from "@/services/ncrTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  SlidersHorizontal,
  ShieldAlert,
  FileCheck,
  Workflow,
  FileText,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/quality-management/ncr-management",
)({
  head: () => ({
    meta: [
      { title: "NCR Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Defect capture, material review board segregation, containment actions, and disposition control.",
      },
    ],
  }),
  component: NcrManagementPage,
});

export function NcrManagementPage() {
  const [record, setRecord] = useState<NcrRecord>(INITIAL_NCR_RECORD);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const handleUpdateRecord = (updates: Partial<NcrRecord>) => {
    setRecord((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    toast.success("NCR Draft Saved", {
      description: `Record ${record.ncrNumber} saved successfully.`,
    });
  };

  const handleSubmitForReview = () => {
    setRecord((prev) => ({
      ...prev,
      ncrStatus: "Investigation",
      recentActivities: [
        {
          id: `act-${Date.now()}`,
          action: "Submitted for Formal MRB Review",
          timestamp: "Just now",
          user: record.reportedBy,
          details: "NCR forwarded to Quality Assurance Manager for formal investigation and root cause analysis.",
        },
        ...prev.recentActivities,
      ],
    }));
    setActiveStep(3); // Step 3: Investigation
    toast.success("Submitted for Formal MRB Review", {
      description: "Investigation workflow triggered and assigned to Quality Lead.",
    });
  };

  const handleCreateCapa = () => {
    const capaId = `CAPA-2026-00${Math.floor(25 + Math.random() * 20)}`;
    setRecord((prev) => ({
      ...prev,
      ncrStatus: "CAPA",
      relatedCapaId: capaId,
      recentActivities: [
        {
          id: `act-${Date.now()}`,
          action: "Linked CAPA Created",
          timestamp: "Just now",
          user: "Quality System",
          details: `Generated formal Corrective & Preventive Action record ${capaId}`,
        },
        ...prev.recentActivities,
      ],
    }));
    setActiveStep(5); // Step 5: Corrective Action
    toast.success(`CAPA ${capaId} Generated & Linked`, {
      description: "Preventive action project initiated and linked to NCR.",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleNewNcrCreated = (newRecord: Partial<NcrRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newRecord,
    }));
    setActiveStep(1);
    toast.success(`Active NCR switched to ${newRecord.ncrNumber}`);
  };

  // Phase metadata for the indicator bar
  const phaseMetadata = useMemo(() => {
    switch (activeStep) {
      case 1:
        return {
          badge: "Phase 1: NCR Creation & Non-Conformance Identification",
          desc: "Defect capture, product specification boundaries, batch lot tags, and evidence photos.",
        };
      case 2:
        return {
          badge: "Phase 2: Lot Containment, Segregation & Quarantine Status",
          desc: "Material hold, quarantine traveler sign-off, and suspect quantity isolation.",
        };
      case 3:
        return {
          badge: "Phase 3: Formal Investigation & Failure Analysis",
          desc: "Investigative interviews, process parameters review, and failure mode documentation.",
        };
      case 4:
        return {
          badge: "Phase 4: Root Cause Analysis (5-Why & Fishbone)",
          desc: "Systemic cause isolation across Man, Machine, Material, Method, and Measurement.",
        };
      case 5:
        return {
          badge: "Phase 5: Corrective & Preventive Action (CAPA)",
          desc: "Permanent corrective actions, work orders, control plan updates, and CAPA link.",
        };
      case 6:
        return {
          badge: "Phase 6: Verification & Residual Risk Check",
          desc: "Effectiveness audit, trial batch inspection, and residual RPN reduction validation.",
        };
      case 7:
      default:
        return {
          badge: "Phase 7: MRB Disposition, Clearance & Audit Trail",
          desc: "Final material review board disposition (Scrap / Rework / Return), attachments, and history.",
        };
    }
  }, [activeStep]);

  return (
    <AppShell
      title="Non-Conformance Report"
      breadcrumb="Management › Quality Management › NCR Management"
      description="Defect capture, material review board segregation, containment actions, and disposition control."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Top Header */}
        <NcrHeader
          record={record}
          onSave={handleSave}
          onSubmitForReview={handleSubmitForReview}
          onPrint={handlePrint}
          onCreateCapa={handleCreateCapa}
          onCreateNcr={() => setCreateModalOpen(true)}
        />

        {/* 7-Phase Horizontal Connected Stepper */}
        <div className="w-full min-w-0 space-y-2.5">
          <NcrPhaseStepper
            currentStep={activeStep}
            onStepClick={(step) => setActiveStep(step)}
          />

          {/* Stepper Control & Phase Hop Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">
                {viewMode === "phase" ? phaseMetadata.badge : "All NCR Workflow Sections"}
              </span>
              <span className="text-muted-foreground hidden md:inline">
                • {viewMode === "phase" ? phaseMetadata.desc : "Viewing all 7 NCR lifecycle stages simultaneously"}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <Button
                size="sm"
                variant={viewMode === "phase" ? "secondary" : "outline"}
                onClick={() => setViewMode(viewMode === "phase" ? "all" : "phase")}
                className="h-7 text-xs px-2.5 font-medium border-border/80 cursor-pointer"
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

        {/* Main Grid: Left Form Column (2/3) + Right Widgets Column (1/3) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
          {/* Left Column (Span 2) */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            {/* Phase 1: NCR Creation & Identification */}
            {(viewMode === "all" || activeStep === 1) && (
              <>
                <NcrHeaderCard
                  record={record}
                  onChange={handleUpdateRecord}
                />
                <NcrIdentificationCard
                  record={record}
                  onChange={handleUpdateRecord}
                />
                <NcrProblemDescriptionCard
                  record={record}
                  onChange={handleUpdateRecord}
                />
              </>
            )}

            {/* Phase 2: Containment */}
            {(viewMode === "all" || activeStep === 2) && (
              <NcrContainmentTab
                record={record}
                onChange={handleUpdateRecord}
              />
            )}

            {/* Phase 3: Investigation */}
            {(viewMode === "all" || activeStep === 3) && (
              <NcrInvestigationTab
                record={record}
                onChange={handleUpdateRecord}
              />
            )}

            {/* Phase 4: Root Cause Analysis */}
            {(viewMode === "all" || activeStep === 4) && (
              <NcrRootCauseAnalysisTab
                record={record}
                onChange={handleUpdateRecord}
              />
            )}

            {/* Phase 5: Corrective Action */}
            {(viewMode === "all" || activeStep === 5) && (
              <NcrCorrectiveActionTab
                record={record}
                onChange={handleUpdateRecord}
                onCreateCapa={handleCreateCapa}
              />
            )}

            {/* Phase 6: Verification */}
            {(viewMode === "all" || activeStep === 6) && (
              <NcrVerificationTab
                record={record}
                onChange={handleUpdateRecord}
              />
            )}

            {/* Phase 7: Closure */}
            {(viewMode === "all" || activeStep === 7) && (
              <>
                <NcrDispositionTab
                  record={record}
                  onChange={handleUpdateRecord}
                />
                <NcrAttachmentsTab record={record} />
                <NcrHistoryTab
                  record={record}
                  onChange={handleUpdateRecord}
                />
              </>
            )}
          </div>

          {/* Right Column (Span 1) */}
          <div className="space-y-5 min-w-0">
            {/* Quick Status & MRB Lifecycle Action Card */}
            <Card className="shadow-xs border-border/80 min-w-0">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    NCR Status & Review
                  </span>
                  <Badge
                    className={
                      record.ncrStatus === "Closed"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px]"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px]"
                    }
                  >
                    {record.ncrStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-3 text-xs min-w-0">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Defect Incident</span>
                  <span className="font-semibold text-foreground block truncate">
                    {record.nonConformanceTitle}
                  </span>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                    <span className="font-mono">{record.ncrNumber}</span>
                    <span>Lead: {record.responsibleOwner}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">Priority / Severity</span>
                    <span className="font-bold text-foreground text-[11px]">
                      {record.priority} / {record.severity}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">Risk Score (RPN)</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400 text-[11px]">
                      {record.riskPriorityNumber} ({record.riskLevel})
                    </span>
                  </div>
                </div>

                {/* Quick Lifecycle Action Buttons */}
                <div className="space-y-1.5 pt-1">
                  <Button
                    size="sm"
                    onClick={handleSubmitForReview}
                    className="w-full h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                    Submit for MRB Review
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCreateCapa}
                      className="flex-1 h-8 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:text-blue-400 border-blue-300 cursor-pointer"
                    >
                      <Workflow className="w-3 h-3 mr-1" />
                      Create CAPA
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePrint}
                      className="flex-1 h-8 text-xs font-medium border-border hover:bg-muted/40 cursor-pointer"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Print Dossier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NCR Summary Card */}
            <NcrSummaryCard record={record} />

            {/* Containment Status Card (Compact overview when not currently on Phase 2 tab) */}
            {viewMode === "phase" && activeStep !== 2 && (
              <NcrContainmentCard
                record={record}
                onChange={handleUpdateRecord}
              />
            )}

            {/* Defect Category Donut Card */}
            <NcrDefectCategoryDonutCard />

            {/* Linked Records Card */}
            <NcrLinkedRecordsCard
              record={record}
              onCreateCapa={handleCreateCapa}
            />

            {/* AI Quality Insights Card */}
            <NcrAiInsightsCard
              insights={record.aiInsights}
            />

            {/* Recent Activities Card */}
            <NcrRecentActivitiesCard
              activities={record.recentActivities}
            />
          </div>
        </div>
      </div>

      {/* Create NCR Modal */}
      <CreateNcrModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={handleNewNcrCreated}
      />
    </AppShell>
  );
}
