import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { IpqcHeader } from "@/components/erp/ipqc/IpqcHeader";
import { IpqcPhaseStepper } from "@/components/erp/ipqc/IpqcPhaseStepper";
import { IpqcMetricCards } from "@/components/erp/ipqc/IpqcMetricCards";
import { IpqcDetailsForm } from "@/components/erp/ipqc/IpqcDetailsForm";
import { IpqcProcessAndPlanningCards } from "@/components/erp/ipqc/IpqcProcessAndPlanningCards";
import { IpqcCurrentOperationCard } from "@/components/erp/ipqc/IpqcCurrentOperationCard";
import { IpqcInspectionSummaryCard } from "@/components/erp/ipqc/IpqcInspectionSummaryCard";
import { IpqcRecentInspectionsCard } from "@/components/erp/ipqc/IpqcRecentInspectionsCard";
import { IpqcAiInsightsCard } from "@/components/erp/ipqc/IpqcAiInsightsCard";
import { IpqcCharacteristicsTable } from "@/components/erp/ipqc/IpqcCharacteristicsTable";
import { IpqcProcessParametersTab } from "@/components/erp/ipqc/tabs/IpqcProcessParametersTab";
import { IpqcSpcTab } from "@/components/erp/ipqc/tabs/IpqcSpcTab";
import { IpqcFirstPieceTab } from "@/components/erp/ipqc/tabs/IpqcFirstPieceTab";
import { IpqcDefectsTab } from "@/components/erp/ipqc/tabs/IpqcDefectsTab";
import { IpqcDispositionTab } from "@/components/erp/ipqc/tabs/IpqcDispositionTab";
import { CreateIpqcModal } from "@/components/erp/ipqc/CreateIpqcModal";
import { INITIAL_IPQC_RECORD } from "@/services/ipqcService";
import type {
  IpqcRecord,
  IpqcCharacteristic,
  IpqcDefect,
  IpqcFirstPieceVerification,
  IpqcWipHold,
} from "@/services/ipqcTypes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Layers,
  SlidersHorizontal,
  ChevronRight,
  PackageCheck,
  Printer,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/quality-management/in-process-inspection",
)({
  head: () => ({
    meta: [
      { title: "In-Process Inspection (IPQC) · Magnertia ERP" },
      {
        name: "description",
        content:
          "Operation-level quality control, SPC run charts, machine parameters, and first-piece inspection gates.",
      },
    ],
  }),
  component: InProcessInspectionPage,
});

export function InProcessInspectionPage() {
  const [record, setRecord] = useState<IpqcRecord>(INITIAL_IPQC_RECORD);
  const [activeStep, setActiveStep] = useState<number>(3);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleUpdateRecord = (updates: Partial<IpqcRecord>) => {
    setRecord((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    toast.success("Inspection Draft Saved", {
      description: `Record ${record.inspectionNo} updated successfully.`,
    });
  };

  const handleComplete = () => {
    setRecord((prev) => ({
      ...prev,
      inspectionStatus: "Completed",
      overallResult: prev.rejectedQuantity > 0 ? "Conditional" : "Pass",
    }));
    setActiveStep(5);
    toast.success("In-Process Inspection Completed!", {
      description: `Batch ${record.batchLotNo} released for next operation (OP-40).`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCreateNewInspection = (newRecord: Partial<IpqcRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newRecord,
      characteristics: prev.characteristics.map((c) => ({
        ...c,
        result: "Pass",
        actual: "Pass",
      })),
      defects: [],
    }));
    setActiveStep(1);
    toast.success(`Active inspection set to ${newRecord.inspectionNo}`);
  };

  const handleAddCharacteristic = (char: Omit<IpqcCharacteristic, "id" | "seq">) => {
    const newChar: IpqcCharacteristic = {
      ...char,
      id: `char-${Date.now()}`,
      seq: record.characteristics.length + 1,
    };
    setRecord((prev) => {
      const updated = [...prev.characteristics, newChar];
      const failCount = updated.filter((c) => c.result === "Fail").length;
      const total = prev.inspectionQuantity;
      const rejected = failCount > 0 ? Math.min(failCount, total) : 0;
      const accepted = total - rejected;
      const defectRate = total > 0 ? (rejected / total) * 100 : 0;
      const overall =
        failCount === 0 ? "Pass" : failCount === 1 ? "Conditional" : "Fail";

      return {
        ...prev,
        characteristics: updated,
        acceptedQuantity: accepted,
        rejectedQuantity: rejected,
        defectRate,
        overallResult: overall,
      };
    });
    toast.success(`Characteristic "${char.characteristic}" added`);
  };

  const handleUpdateCharacteristic = (
    id: string,
    updates: Partial<IpqcCharacteristic>,
  ) => {
    setRecord((prev) => {
      const updated = prev.characteristics.map((c) =>
        c.id === id ? { ...c, ...updates } : c,
      );
      const failCount = updated.filter((c) => c.result === "Fail").length;
      const total = prev.inspectionQuantity;
      const rejected = failCount > 0 ? Math.min(failCount, total) : 0;
      const accepted = total - rejected;
      const defectRate = total > 0 ? (rejected / total) * 100 : 0;
      const overall =
        failCount === 0 ? "Pass" : failCount === 1 ? "Conditional" : "Fail";

      return {
        ...prev,
        characteristics: updated,
        acceptedQuantity: accepted,
        rejectedQuantity: rejected,
        defectRate,
        overallResult: overall,
      };
    });
    toast.info("Characteristic check updated");
  };

  const handleDeleteCharacteristic = (id: string) => {
    setRecord((prev) => ({
      ...prev,
      characteristics: prev.characteristics.filter((c) => c.id !== id),
    }));
    toast.info("Characteristic removed");
  };

  const handleAddDefect = (defect: Omit<IpqcDefect, "id">) => {
    const newDef: IpqcDefect = {
      ...defect,
      id: `def-${Date.now()}`,
    };
    setRecord((prev) => ({
      ...prev,
      defects: [newDef, ...prev.defects],
      failedCount: prev.failedCount + 1,
      rejectedQuantity: prev.rejectedQuantity + defect.quantity,
      acceptedQuantity: Math.max(0, prev.acceptedQuantity - defect.quantity),
      overallResult: "Conditional",
    }));
    toast.warning(`Defect ${defect.defectCode} logged in register`);
  };

  const handleUpdateFirstPiece = (
    updates: Partial<IpqcFirstPieceVerification>,
  ) => {
    setRecord((prev) => ({
      ...prev,
      firstPiece: { ...prev.firstPiece, ...updates },
    }));
    toast.info("First-piece verification updated");
  };

  const handleUpdateWipHold = (updates: Partial<IpqcWipHold>) => {
    setRecord((prev) => ({
      ...prev,
      wipHold: { ...prev.wipHold, ...updates },
    }));
    toast.info("WIP Hold disposition updated");
  };

  // Phase metadata for the indicator bar
  const phaseMetadata = useMemo(() => {
    switch (activeStep) {
      case 1:
        return {
          badge: "Phase 1: First-Piece Setup Verification",
          desc: "Tooling condition, machine interlocks, CNC recipe, and first article dimensional sign-off.",
        };
      case 2:
        return {
          badge: "Phase 2: Parameter Verification & Planning",
          desc: "Process temperature, crimp pressure, control plan limits, and inspection gauge calibration.",
        };
      case 3:
        return {
          badge: "Phase 3: In-Line Sampling & Characteristics",
          desc: "Hourly sample checks for connector fit, torque tolerances, insulation resistance, and yield donut.",
        };
      case 4:
        return {
          badge: "Phase 4: Statistical Process Control (SPC)",
          desc: "X-bar run chart, Cpk / Cp capability calculation, UCL/LCL control limits, and AI telemetry.",
        };
      case 5:
      default:
        return {
          badge: "Phase 5: Operation Sign-Off & Stage Clearance",
          desc: "WIP hold disposition, non-conformance segregation, and handover release to next operation (OP-40).",
        };
    }
  }, [activeStep]);

  return (
    <AppShell
      title="In-Process Inspection"
      breadcrumb="Management › Quality Management › In-Process Inspection"
      description="Operation-level quality control, SPC run charts, machine parameters, and first-piece inspection gates."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Top Header */}
        <IpqcHeader
          record={record}
          onSave={handleSave}
          onComplete={handleComplete}
          onPrint={handlePrint}
          onCreateInspection={() => setCreateModalOpen(true)}
        />

        {/* Connected IPQC Process Stepper */}
        <div className="w-full min-w-0 space-y-2.5">
          <IpqcPhaseStepper
            currentStep={activeStep}
            onStepClick={(step) => setActiveStep(step)}
          />

          {/* Stepper Control & Phase Indicator Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 min-w-0">
            <div className="flex items-center gap-2 text-xs min-w-0">
              <span className="font-semibold text-foreground truncate">
                {viewMode === "phase"
                  ? phaseMetadata.badge
                  : "All In-Process Inspection Stages"}
              </span>
              <span className="text-muted-foreground hidden md:inline truncate">
                •{" "}
                {viewMode === "phase"
                  ? phaseMetadata.desc
                  : "Viewing all 5 manufacturing stage-gate phases simultaneously"}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto shrink-0">
              <Button
                size="sm"
                variant={viewMode === "phase" ? "secondary" : "outline"}
                onClick={() => setViewMode(viewMode === "phase" ? "all" : "phase")}
                className="h-7 text-xs px-2.5 font-medium border-border/80"
              >
                {viewMode === "phase" ? (
                  <>
                    <Layers className="w-3 h-3 mr-1.5 text-[#0B3B7B]" />
                    View All Sections
                  </>
                ) : (
                  <>
                    <SlidersHorizontal className="w-3 h-3 mr-1.5 text-[#0B3B7B]" />
                    Focus on Active Phase
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* 6 Top Metric KPI Cards */}
        {(viewMode === "all" || activeStep === 1) && (
          <IpqcMetricCards record={record} />
        )}

        {/* Main Grid: 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
          {/* Left Column (Span 2) */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            {/* Phase 1: First-Piece Setup */}
            {(viewMode === "all" || activeStep === 1) && (
              <>
                <IpqcDetailsForm
                  record={record}
                  onChange={handleUpdateRecord}
                />
                <IpqcFirstPieceTab
                  firstPiece={record.firstPiece}
                  onUpdate={handleUpdateFirstPiece}
                />
              </>
            )}

            {/* Phase 2: Parameter Verification & Planning */}
            {(viewMode === "all" || activeStep === 2) && (
              <>
                <IpqcProcessAndPlanningCards
                  record={record}
                  onChange={handleUpdateRecord}
                />
                <IpqcProcessParametersTab parameters={record.parameters} />
              </>
            )}

            {/* Phase 3: In-Line Sampling & Characteristics */}
            {(viewMode === "all" || activeStep === 3) && (
              <div className="space-y-5 min-w-0">
                <IpqcCharacteristicsTable
                  characteristics={record.characteristics}
                  onAddCharacteristic={handleAddCharacteristic}
                  onUpdateCharacteristic={handleUpdateCharacteristic}
                  onDeleteCharacteristic={handleDeleteCharacteristic}
                  onExport={handlePrint}
                />
                {viewMode === "phase" && (
                  <IpqcInspectionSummaryCard record={record} />
                )}
              </div>
            )}

            {/* Phase 4: Statistical Process Control (SPC) */}
            {(viewMode === "all" || activeStep === 4) && (
              <div className="space-y-5 min-w-0">
                <IpqcSpcTab spc={record.spc} />
                {viewMode === "phase" && (
                  <IpqcProcessParametersTab parameters={record.parameters} />
                )}
              </div>
            )}

            {/* Phase 5: Operation Sign-Off & Stage Clearance */}
            {(viewMode === "all" || activeStep === 5) && (
              <div className="space-y-5 min-w-0">
                <IpqcCurrentOperationCard
                  record={record}
                  onViewWorkInstruction={() =>
                    toast.info("Viewing Work Instruction: WI-ASM-030")
                  }
                />
                <IpqcDispositionTab
                  wipHold={record.wipHold}
                  onUpdateHold={handleUpdateWipHold}
                />

                {/* Stage Clearance Banner */}
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          Stage-Gate Clearance to Next Operation
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Authorize handover of Batch {record.batchLotNo} from {record.operationNo} to OP-40 (Pneumatic Testing).
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={handleComplete}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
                      Sign Handover & Release Batch
                    </Button>
                  </div>
                </div>

                <IpqcDefectsTab
                  defects={record.defects}
                  onAddDefect={handleAddDefect}
                />
              </div>
            )}
          </div>

          {/* Right Column (Span 1) */}
          <div className="space-y-5 min-w-0">
            {/* Inspection Summary with Donut */}
            {viewMode === "all" || activeStep !== 3 ? (
              <IpqcInspectionSummaryCard record={record} />
            ) : null}

            {/* Current Operation Card */}
            {viewMode === "phase" && (activeStep === 1 || activeStep === 2) && (
              <IpqcCurrentOperationCard record={record} />
            )}

            {/* Phase Navigation Quick Hop Card */}
            <div className="bg-card rounded-xl border border-border/80 p-4 shadow-xs space-y-3 text-xs min-w-0">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-semibold text-foreground">
                  Operation Phase Navigation
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Phase {activeStep} of 5
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  { step: 1, label: "First-Piece Setup" },
                  { step: 2, label: "Parameter Verification" },
                  { step: 3, label: "In-Line Sampling" },
                  { step: 4, label: "SPC Run Evaluation" },
                  { step: 5, label: "Operation Sign-Off" },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveStep(s.step)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer",
                      activeStep === s.step
                        ? "bg-[#0B3B7B]/10 text-[#0B3B7B] dark:bg-blue-950/40 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/50"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                    )}
                  >
                    <span className="truncate">
                      {s.step}. {s.label}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-border/40 space-y-2">
                <Button
                  size="sm"
                  onClick={handleComplete}
                  className="w-full h-8 text-xs bg-[#0B3B7B] hover:bg-[#092e60] text-white font-semibold"
                >
                  <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
                  Sign-Off Operation ({record.acceptedQuantity} Passed)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrint}
                  className="w-full h-8 text-xs border-border"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print Inspection Dossier
                </Button>
              </div>
            </div>

            {/* Recent Inspections Table */}
            {(viewMode === "all" || activeStep === 1 || activeStep === 3) && (
              <IpqcRecentInspectionsCard
                inspections={record.recentInspections}
                onViewAll={() => toast.info("Viewing all operation logs")}
              />
            )}

            {/* AI Quality Insights Card */}
            {(viewMode === "all" || activeStep === 2 || activeStep === 4) && (
              <IpqcAiInsightsCard insights={record.aiInsights} />
            )}
          </div>
        </div>

        {/* Create Inspection Modal */}
        <CreateIpqcModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateNewInspection}
        />
      </div>
    </AppShell>
  );
}
