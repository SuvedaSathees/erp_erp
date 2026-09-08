import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { RcaHeader } from "@/components/erp/rca/RcaHeader";
import { RcaPhaseStepper } from "@/components/erp/rca/RcaPhaseStepper";
import { RcaHeaderCard } from "@/components/erp/rca/RcaHeaderCard";
import { RcaProblemDefinitionCard } from "@/components/erp/rca/RcaProblemDefinitionCard";
import { RcaFiveWhyCard } from "@/components/erp/rca/RcaFiveWhyCard";
import { RcaFishboneCard } from "@/components/erp/rca/RcaFishboneCard";
import { RcaDeterminationCard } from "@/components/erp/rca/RcaDeterminationCard";
import { RcaOverviewCard } from "@/components/erp/rca/RcaOverviewCard";
import { RcaAiInsightsCard } from "@/components/erp/rca/RcaAiInsightsCard";
import { RcaLinkedRecordsCard } from "@/components/erp/rca/RcaLinkedRecordsCard";
import { CreateRcaModal } from "@/components/erp/rca/CreateRcaModal";

import { INITIAL_RCA_RECORD } from "@/services/rcaService";
import { RcaRecord, FiveWhyItem } from "@/services/rcaTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Sparkles,
  FileCheck,
  ShieldCheck,
  GitCommit,
  ArrowRight,
  SlidersHorizontal,
  FileText,
  Workflow,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/quality-management/root-cause-analysis",
)({
  head: () => ({
    meta: [
      { title: "Root Cause Analysis (RCA) · Magnertia ERP" },
      {
        name: "description",
        content:
          "Investigative 5-Why causal ladders, Ishikawa 6M fishbone analysis, and empirical root-cause verification.",
      },
    ],
  }),
  component: RootCauseAnalysisPage,
});

export function RootCauseAnalysisPage() {
  const [record, setRecord] = useState<RcaRecord>(INITIAL_RCA_RECORD);
  const [activeStep, setActiveStep] = useState<number>(5);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const handleFieldChange = (field: keyof RcaRecord, value: any) => {
    setRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add Why level to 5-Why ladder
  const handleAddWhy = (newWhy: FiveWhyItem) => {
    setRecord((prev) => ({
      ...prev,
      fiveWhyList: [...prev.fiveWhyList, newWhy],
    }));
  };

  // Update Why level
  const handleUpdateWhy = (level: number, question: string, answer: string, isRootCause?: boolean) => {
    setRecord((prev) => ({
      ...prev,
      fiveWhyList: prev.fiveWhyList.map((item) =>
        item.level === level
          ? { ...item, whyQuestion: question, answer, isRootCause }
          : isRootCause
          ? { ...item, isRootCause: false }
          : item
      ),
      ...(isRootCause ? { rootCause: answer } : {}),
    }));
  };

  // Delete Why level
  const handleDeleteWhy = (level: number) => {
    setRecord((prev) => {
      const filtered = prev.fiveWhyList.filter((item) => item.level !== level);
      const reindexed = filtered.map((item, idx) => ({ ...item, level: idx + 1 }));
      return { ...prev, fiveWhyList: reindexed };
    });
  };

  // Add factor to 6M fishbone
  const handleAddFactor = (category: string, factor: string) => {
    setRecord((prev) => ({
      ...prev,
      fishbone: prev.fishbone.map((branch) =>
        branch.category === category
          ? { ...branch, factors: [...branch.factors, factor] }
          : branch
      ),
    }));
  };

  // Remove factor from 6M fishbone
  const handleRemoveFactor = (category: string, factorIndex: number) => {
    setRecord((prev) => ({
      ...prev,
      fishbone: prev.fishbone.map((branch) =>
        branch.category === category
          ? { ...branch, factors: branch.factors.filter((_, i) => i !== factorIndex) }
          : branch
      ),
    }));
  };

  // Save investigation draft
  const handleSave = () => {
    toast.success(`RCA record ${record.rcaNumber} draft saved successfully`);
  };

  // Certify root cause
  const handleSubmitVerification = () => {
    setRecord((prev) => ({
      ...prev,
      status: "Root Cause Verified",
      workflowStatus: "Cause Certified",
      verificationStatus: "Verified",
    }));
    setActiveStep(6);
    toast.success(`Root cause for ${record.rcaNumber} certified and verified!`);
  };

  // Transfer root cause to CAPA
  const handleCreateCapa = () => {
    setRecord((prev) => ({
      ...prev,
      linkedCapa: "CAPA-2026-0012",
    }));
    toast.success("Root cause parameters transferred to CAPA-2026-0012. CAPA initiated.");
  };

  const handlePrint = () => {
    window.print();
  };

  // Create RCA callback
  const handleNewRcaCreated = (newPartial: Partial<RcaRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newPartial,
    }));
    setActiveStep(1);
    toast.success(`Switched active RCA investigation to ${newPartial.rcaNumber}`);
  };

  // Phase Title and Description
  const phaseMetadata = useMemo(() => {
    switch (activeStep) {
      case 1:
      case 2:
        return {
          badge: "Phase 1 & 2: Scoping & 5W2H Problem Definition",
          desc: "Defect boundary definition (What, Where, When, Who, Why, How, How Much) and incident parameters.",
        };
      case 3:
      case 4:
        return {
          badge: "Phase 3 & 4: 5-Why Branching & 6M Ishikawa Diagnostics",
          desc: "Iterative Why interrogation and Ishikawa multi-variable causal factor mapping across Man, Machine, Method.",
        };
      case 5:
      case 6:
      default:
        return {
          badge: "Phase 5 & 6: Root Cause Determination & Verification",
          desc: "Empirical validation evidence, fundamental root cause confirmation, and CAPA handover.",
        };
    }
  }, [activeStep]);

  return (
    <AppShell
      title="Root Cause Analysis"
      breadcrumb="Management › Quality Management › Root Cause Analysis"
      description="Investigative 5-Why causal ladders, Ishikawa 6M fishbone analysis, and empirical root-cause verification."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Header Action Bar */}
        <RcaHeader
          record={record}
          onSave={handleSave}
          onSubmitVerification={handleSubmitVerification}
          onPrint={handlePrint}
          onCreateCapa={handleCreateCapa}
          onCreateRca={() => setCreateModalOpen(true)}
        />

        {/* Connected RCA Phase Stepper */}
        <div className="w-full min-w-0 space-y-2.5">
          <RcaPhaseStepper
            currentStep={activeStep}
            onStepClick={(step) => setActiveStep(step)}
          />

          {/* Clean Stepper Control & Quick Phase Hop Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">
                {viewMode === "phase" ? phaseMetadata.badge : "All Investigation Sections"}
              </span>
              <span className="text-muted-foreground hidden md:inline">
                • {viewMode === "phase" ? phaseMetadata.desc : "Viewing all 6 RCA lifecycle phases simultaneously"}
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
          {/* Left 2-Column Area: Header, 5W2H, 5-Why, Fishbone, Determination */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            {/* Phase 1 & 2: Header & 5W2H */}
            {(viewMode === "all" || activeStep === 1 || activeStep === 2) && (
              <>
                <RcaHeaderCard
                  record={record}
                  onChange={handleFieldChange}
                />
                <RcaProblemDefinitionCard
                  record={record}
                  onChange={handleFieldChange}
                />
              </>
            )}

            {/* Phase 3 & 4: 5-Why & 6M Fishbone */}
            {(viewMode === "all" || activeStep === 3 || activeStep === 4) && (
              <>
                <RcaFiveWhyCard
                  items={record.fiveWhyList}
                  onAddWhy={handleAddWhy}
                  onUpdateWhy={handleUpdateWhy}
                  onDeleteWhy={handleDeleteWhy}
                />
                <RcaFishboneCard
                  fishbone={record.fishbone}
                  onAddFactor={handleAddFactor}
                  onRemoveFactor={handleRemoveFactor}
                />
              </>
            )}

            {/* Phase 5 & 6: Root Cause Determination & Verification */}
            {(viewMode === "all" || activeStep === 5 || activeStep === 6) && (
              <>
                <RcaDeterminationCard
                  record={record}
                  onChange={handleFieldChange}
                />
                {viewMode === "phase" && <RcaOverviewCard record={record} />}
              </>
            )}
          </div>

          {/* Right Column: Quick Status, Overview, AI Insights, Linked Records */}
          <div className="space-y-5 min-w-0">
            {/* Quick Status & Action Card */}
            <Card className="shadow-xs border-border/80 min-w-0">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    RCA Investigation Status
                  </span>
                  <Badge
                    className={
                      record.status === "Root Cause Verified"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px]"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px]"
                    }
                  >
                    {record.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Investigation Subject</span>
                  <span className="font-semibold text-foreground block truncate">{record.title}</span>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                    <span className="font-mono">{record.rcaNumber}</span>
                    <span>Lead: {record.leadInvestigator}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">Methodology</span>
                    <span className="font-bold text-foreground text-[11px]">
                      5-Why + Fishbone
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">Target Date</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {record.targetClosureDate || record.targetDate}
                    </span>
                  </div>
                </div>

                {/* Root Cause Snapshot */}
                <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40">
                  <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-300 block uppercase">
                    Root Cause:
                  </span>
                  <p className="text-[11px] text-foreground mt-0.5 line-clamp-2">
                    {record.rootCause}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-1.5 pt-1">
                  <Button
                    size="sm"
                    onClick={handleSubmitVerification}
                    className="w-full h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white"
                  >
                    <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                    Certify Root Cause
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCreateCapa}
                      className="flex-1 h-8 text-xs font-medium text-blue-700 hover:bg-blue-50 dark:text-blue-400 border-blue-300"
                    >
                      <Workflow className="w-3 h-3 mr-1" />
                      Transfer CAPA
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handlePrint}
                      className="flex-1 h-8 text-xs font-medium border-border hover:bg-muted/40"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      Print Dossier
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* In Phase mode 3 or 4, show RCA Overview */}
            {viewMode === "phase" && (activeStep === 3 || activeStep === 4) && (
              <RcaOverviewCard record={record} />
            )}

            {/* AI RCA Insights */}
            <RcaAiInsightsCard insights={record.aiInsights} />

            {/* Associated Records Card */}
            <RcaLinkedRecordsCard record={record} />
          </div>
        </div>
      </div>

      {/* Create RCA Modal */}
      <CreateRcaModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={handleNewRcaCreated}
      />
    </AppShell>
  );
}

