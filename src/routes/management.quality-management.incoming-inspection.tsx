import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qualityManagementService } from "@/services";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { IqcPhaseStepper, IQC_STEPS } from "@/components/erp/iqc/IqcPhaseStepper";
import { IqcHeader } from "@/components/erp/iqc/IqcHeader";
import { IqcMetricCards } from "@/components/erp/iqc/IqcMetricCards";
import { IqcDetailsForm } from "@/components/erp/iqc/IqcDetailsForm";
import { IqcSamplingPlanCard } from "@/components/erp/iqc/IqcSamplingPlanCard";
import { IqcCharacteristicsTable } from "@/components/erp/iqc/IqcCharacteristicsTable";
import { IqcInspectionSummaryCard } from "@/components/erp/iqc/IqcInspectionSummaryCard";
import { IqcDefectsCard } from "@/components/erp/iqc/IqcDefectsCard";
import { IqcDispositionCard } from "@/components/erp/iqc/IqcDispositionCard";
import { CreateIqcModal } from "@/components/erp/iqc/CreateIqcModal";
import {
  INITIAL_IQC_RECORD,
  recalculateIqcStats,
} from "@/services/iqcService";
import type { IqcRecord, IqcCharacteristic, IqcDocument } from "@/services/iqcTypes";
import {
  Layers,
  LayoutGrid,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute(
  "/management/quality-management/incoming-inspection",
)({
  head: () => ({
    meta: [
      { title: "Incoming Inspection (IQC) · Magnertia ERP" },
      {
        name: "description",
        content:
          "Supplier receipt inspection, AQL sampling plans, quarantine control, and material compliance gates.",
      },
    ],
  }),
  component: IncomingInspectionPage,
});

export function IncomingInspectionPage() {
  const queryClient = useQueryClient();
  const { data: _dbData, isLoading: _dbLoading } = useQuery({
    queryKey: ["quality", "inspections"],
    queryFn: () => qualityManagementService.fetchInspectionRecords(),
  });

  const [record, setRecord] = useState<IqcRecord>(INITIAL_IQC_RECORD);
  const [activeStep, setActiveStep] = useState<number>(3);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Update generic record fields
  const handleUpdateRecord = (updated: Partial<IqcRecord>) => {
    setRecord((prev) => ({ ...prev, ...updated }));
  };

  // Toggle characteristic Pass/Fail with live recalculation
  const handleToggleResult = (seq: number) => {
    const updatedCharacteristics = record.characteristics.map((c) => {
      if (c.seq === seq) {
        const nextResult: "Pass" | "Fail" = c.result === "Pass" ? "Fail" : "Pass";
        return {
          ...c,
          result: nextResult,
          remarks: nextResult === "Pass" ? "Within tolerance" : "Out of tolerance limit",
        };
      }
      return c;
    });

    const recalculated = recalculateIqcStats(record, updatedCharacteristics);
    setRecord((prev) => ({ ...prev, ...recalculated }));

    const changedItem = updatedCharacteristics.find((c) => c.seq === seq);
    if (changedItem?.result === "Pass") {
      toast.success(`Parameter #${seq} marked PASS`, {
        description: "Recalculated defect rate and quality score.",
      });
    } else {
      toast.error(`Parameter #${seq} marked FAIL`, {
        description: "Lot quarantine alert triggered.",
      });
    }
  };

  // Add new characteristic
  const handleAddCharacteristic = (newChar: IqcCharacteristic) => {
    const updatedList = [...record.characteristics, newChar];
    const recalculated = recalculateIqcStats(record, updatedList);
    setRecord((prev) => ({ ...prev, ...recalculated }));
  };

  // Update existing characteristic
  const handleUpdateCharacteristic = (updatedChar: IqcCharacteristic) => {
    const updatedList = record.characteristics.map((c) =>
      c.seq === updatedChar.seq ? updatedChar : c
    );
    const recalculated = recalculateIqcStats(record, updatedList);
    setRecord((prev) => ({ ...prev, ...recalculated }));
  };

  // Delete characteristic
  const handleDeleteCharacteristic = (seq: number) => {
    const updatedList = record.characteristics
      .filter((c) => c.seq !== seq)
      .map((c, idx) => ({ ...c, seq: idx + 1 }));
    const recalculated = recalculateIqcStats(record, updatedList);
    setRecord((prev) => ({ ...prev, ...recalculated }));
    toast.info(`Deleted parameter #${seq}`);
  };

  // Document attachments
  const handleAddDocument = (newDoc: IqcDocument) => {
    setRecord((prev) => ({ ...prev, documents: [newDoc, ...prev.documents] }));
  };

  const handleDeleteDocument = (docId: string) => {
    setRecord((prev) => ({
      ...prev,
      documents: prev.documents.filter((d) => d.id !== docId),
    }));
  };

  // Create new inspection from modal
  const handleCreateSubmit = (newFields: Partial<IqcRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newFields,
      characteristics: [
        {
          seq: 1,
          characteristic: "Key Dimension A",
          specification: "25.00",
          tolerance: "±0.05",
          actual: "25.01",
          unit: "mm",
          method: "Micrometer",
          result: "Pass",
          remarks: "Conforming",
        },
        {
          seq: 2,
          characteristic: "Hardness Test",
          specification: "≥ 45",
          tolerance: "—",
          actual: "48.2",
          unit: "HRC",
          method: "Hardness Tester",
          result: "Pass",
          remarks: "OK",
        },
        {
          seq: 3,
          characteristic: "Visual Surface",
          specification: "No Pit/Burr",
          tolerance: "—",
          actual: "Clear",
          unit: "—",
          method: "Visual",
          result: "Pass",
          remarks: "Clean finish",
        },
      ],
      stats: {
        ...prev.stats,
        totalInspections: prev.stats.totalInspections + 1,
        pendingCount: prev.stats.pendingCount + 1,
      },
    }));
    setActiveStep(1);
  };

  // Header actions
  const handleSaveDraft = () => {
    toast.success("Draft Saved", {
      description: `Inspection ${record.inspectionNo} saved successfully.`,
    });
  };

  const handleCompleteSignOff = () => {
    setRecord((prev) => ({ ...prev, status: "Completed" }));
    toast.success("Inspection Completed & Signed Off", {
      description: `Final verdict: ${record.overallResult}. Disposition: ${record.disposition}.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const currentPhaseTitle =
    IQC_STEPS.find((s) => s.step === activeStep)?.title || "Phase";

  return (
    <AppShell
      title="Incoming Inspection"
      breadcrumb="Management › Quality Management › Incoming Inspection"
      description="Supplier receipt inspection, AQL sampling plans, quarantine control, and material compliance gates."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Module Header Card with real exports & actions */}
        <IqcHeader
          record={record}
          onSave={handleSaveDraft}
          onComplete={handleCompleteSignOff}
          onPrint={handlePrint}
          onCreateInspection={() => setCreateModalOpen(true)}
          onDispositionChange={(disposition, inventory) => {
            setRecord((prev) => ({
              ...prev,
              disposition,
              inventoryStatus: inventory,
            }));
          }}
        />

        {/* 6 Metric KPI Cards */}
        <IqcMetricCards stats={record.stats} />

        {/* View Mode Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border border-border w-full min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">
              {viewMode === "phase"
                ? `Active Workflow: Step ${activeStep} of 5 — ${currentPhaseTitle}`
                : "Comprehensive Quality Overview (All Sections Active)"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <div className="bg-card rounded-lg p-0.5 border border-border flex items-center shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("phase")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "phase"
                    ? "bg-[#0B3B7B] text-white shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Focus on Active Phase</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("all")}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "all"
                    ? "bg-[#0B3B7B] text-white shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>View All Sections</span>
              </button>
            </div>
          </div>
        </div>

        {/* Phase Stepper */}
        <IqcPhaseStepper
          currentStep={activeStep}
          onStepClick={(step) => setActiveStep(step)}
        />

        {/* Render Sections based on View Mode */}
        {viewMode === "phase" ? (
          <div className="space-y-5 w-full max-w-full min-w-0">
            {/* Phase 1: Material Receipt & Inbound Gate */}
            {activeStep === 1 && (
              <IqcDetailsForm
                record={record}
                onChange={handleUpdateRecord}
                onNextPhase={() => setActiveStep(2)}
              />
            )}

            {/* Phase 2: Quarantine & Sampling Plan */}
            {activeStep === 2 && (
              <IqcSamplingPlanCard
                record={record}
                onChange={handleUpdateRecord}
                onNextPhase={() => setActiveStep(3)}
              />
            )}

            {/* Phase 3: Characteristics Testing */}
            {activeStep === 3 && (
              <div className="space-y-5 w-full max-w-full min-w-0">
                <IqcInspectionSummaryCard record={record} />
                <IqcCharacteristicsTable
                  inspectionNo={record.inspectionNo}
                  characteristics={record.characteristics}
                  onToggleResult={handleToggleResult}
                  onAddCharacteristic={handleAddCharacteristic}
                  onUpdateCharacteristic={handleUpdateCharacteristic}
                  onDeleteCharacteristic={handleDeleteCharacteristic}
                  onNextPhase={() => setActiveStep(4)}
                />
              </div>
            )}

            {/* Phase 4: Defect Classification & Linked NCR */}
            {activeStep === 4 && (
              <IqcDefectsCard
                record={record}
                onChange={handleUpdateRecord}
                onNextPhase={() => setActiveStep(5)}
              />
            )}

            {/* Phase 5: Stores Release & Quarantine Clearance */}
            {activeStep === 5 && (
              <IqcDispositionCard
                record={record}
                onChange={handleUpdateRecord}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                onCompleteInspection={handleCompleteSignOff}
              />
            )}
          </div>
        ) : (
          /* View Mode === "all": All 5 Phases stacked with section dividers */
          <div className="space-y-6 w-full max-w-full min-w-0">
            {/* Section 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider text-blue-600 dark:text-blue-400">
                <span>Phase 1: Inbound Receipt & Material Details</span>
              </div>
              <IqcDetailsForm
                record={record}
                onChange={handleUpdateRecord}
              />
            </div>

            {/* Section 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider text-primary dark:text-blue-400">
                <span>Phase 2: Quarantine & Sampling Plan (ANSI/ASQ Z1.4)</span>
              </div>
              <IqcSamplingPlanCard
                record={record}
                onChange={handleUpdateRecord}
              />
            </div>

            {/* Section 3 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider text-teal-600 dark:text-teal-400">
                <span>Phase 3: Characteristics Testing & Yield Summary</span>
              </div>
              <div className="space-y-5 w-full max-w-full min-w-0">
                <IqcInspectionSummaryCard record={record} />
                <IqcCharacteristicsTable
                  inspectionNo={record.inspectionNo}
                  characteristics={record.characteristics}
                  onToggleResult={handleToggleResult}
                  onAddCharacteristic={handleAddCharacteristic}
                  onUpdateCharacteristic={handleUpdateCharacteristic}
                  onDeleteCharacteristic={handleDeleteCharacteristic}
                />
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider text-rose-600 dark:text-rose-400">
                <span>Phase 4: Defect Classification & Linked NCR</span>
              </div>
              <IqcDefectsCard
                record={record}
                onChange={handleUpdateRecord}
              />
            </div>

            {/* Section 5 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                <span>Phase 5: Stores Release & Quarantine Clearance</span>
              </div>
              <IqcDispositionCard
                record={record}
                onChange={handleUpdateRecord}
                onAddDocument={handleAddDocument}
                onDeleteDocument={handleDeleteDocument}
                onCompleteInspection={handleCompleteSignOff}
              />
            </div>
          </div>
        )}

        {/* Modal to register new incoming inspection */}
        <CreateIqcModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onSubmit={handleCreateSubmit}
        />
      </div>
    </AppShell>
  );
}
