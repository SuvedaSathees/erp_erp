import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { FqcHeader } from "@/components/erp/fqc/FqcHeader";
import { FqcPhaseStepper } from "@/components/erp/fqc/FqcPhaseStepper";
import { FqcMetricCards } from "@/components/erp/fqc/FqcMetricCards";
import { FqcDetailsForm } from "@/components/erp/fqc/FqcDetailsForm";
import { FqcCharacteristicsTable } from "@/components/erp/fqc/FqcCharacteristicsTable";
import { FqcProcessParametersChart } from "@/components/erp/fqc/FqcProcessParametersChart";
import { FqcInspectionSummaryCard } from "@/components/erp/fqc/FqcInspectionSummaryCard";
import { FqcQualityCertificateCard } from "@/components/erp/fqc/FqcQualityCertificateCard";
import { FqcRecentDefectsCard } from "@/components/erp/fqc/FqcRecentDefectsCard";
import { FqcAiInsightsCard } from "@/components/erp/fqc/FqcAiInsightsCard";
import { CreateFqcModal } from "@/components/erp/fqc/CreateFqcModal";
import { INITIAL_FQC_RECORD } from "@/services/fqcService";
import { FqcRecord, FqcCharacteristic, FqcDefect } from "@/services/fqcTypes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Layers,
  SlidersHorizontal,
  Award,
  CheckCircle2,
  ChevronRight,
  PackageCheck,
  Download,
  Printer,
  Sparkles,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/quality-management/final-inspection",
)({
  head: () => ({
    meta: [
      { title: "Final Inspection (FQC) · Magnertia ERP" },
      {
        name: "description",
        content:
          "Pre-dispatch inspection gates, functional verification, packaging audits, and CoC issuance.",
      },
    ],
  }),
  component: FinalInspectionPage,
});

export function FinalInspectionPage() {
  const [record, setRecord] = useState<FqcRecord>(INITIAL_FQC_RECORD);
  const [activeStep, setActiveStep] = useState<number>(3);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleUpdateRecord = (updates: Partial<FqcRecord>) => {
    setRecord((prev) => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    toast.success("Final Inspection Draft Saved", {
      description: `Record ${record.inspectionNo} saved successfully.`,
    });
  };

  const handleComplete = () => {
    setRecord((prev) => ({
      ...prev,
      inspectionStatus: "Completed",
      overallResult: prev.rejectedQuantity > 0 ? "Conditional Pass" : "Pass",
    }));
    setActiveStep(5);
    toast.success("Final Inspection Completed & Signed Off", {
      description: `${record.acceptedQuantity} conforming units approved for dispatch.`,
    });
  };

  const handleReleaseWarehouse = () => {
    setRecord((prev) => ({
      ...prev,
      inspectionStatus: "Completed",
    }));
    setActiveStep(5);
    toast.success("Batch Released to Finished Goods Warehouse", {
      description: `${record.acceptedQuantity} units moved from Inspection Bay 1 to Bay FG-04.`,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAddCharacteristic = (char: Omit<FqcCharacteristic, "id" | "seq">) => {
    const newChar: FqcCharacteristic = {
      ...char,
      id: `char-${Date.now()}`,
      seq: record.characteristics.length + 1,
    };

    setRecord((prev) => {
      const updated = [...prev.characteristics, newChar];
      const failCount = updated.filter((c) => c.status === "Fail").length;
      const total = prev.inspectionQuantity;
      const rejected = failCount > 0 ? Math.min(failCount * 2, total) : 0;
      const accepted = total - rejected;
      const overall =
        failCount === 0 ? "Pass" : failCount <= 2 ? "Conditional Pass" : "Fail";

      return {
        ...prev,
        characteristics: updated,
        acceptedQuantity: accepted,
        rejectedQuantity: rejected,
        overallResult: overall,
        certificate: {
          ...prev.certificate,
          quantityCertified: accepted,
          status: overall === "Fail" ? "Rejected" : "Approved",
        },
      };
    });

    toast.success(`Check "${char.characteristic}" added to inspection sheet`);
  };

  const handleUpdateStatus = (id: string, status: "Pass" | "Fail") => {
    setRecord((prev) => {
      const updated = prev.characteristics.map((c) =>
        c.id === id ? { ...c, status } : c
      );
      const failCount = updated.filter((c) => c.status === "Fail").length;
      const total = prev.inspectionQuantity;
      const rejected = failCount > 0 ? Math.min(failCount * 2, total) : 0;
      const accepted = total - rejected;
      const overall =
        failCount === 0 ? "Pass" : failCount <= 2 ? "Conditional Pass" : "Fail";

      return {
        ...prev,
        characteristics: updated,
        rejectedQuantity: rejected,
        acceptedQuantity: accepted,
        overallResult: overall,
        certificate: {
          ...prev.certificate,
          quantityCertified: accepted,
          status: overall === "Fail" ? "Rejected" : "Approved",
        },
      };
    });

    toast.info(`Characteristic check updated to ${status}`);
  };

  const handleAddDefect = (defect: FqcDefect) => {
    setRecord((prev) => ({
      ...prev,
      defects: [defect, ...prev.defects],
      rejectedQuantity: prev.rejectedQuantity + defect.quantity,
      acceptedQuantity: Math.max(0, prev.acceptedQuantity - defect.quantity),
      overallResult: "Conditional Pass",
    }));
  };

  const handleCreateNewInspection = (newRecord: Partial<FqcRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newRecord,
      characteristics: prev.characteristics.map((c) => ({
        ...c,
        status: "Pass",
        actualMeasured: "Pass (Verified)",
      })),
      defects: [],
    }));
    setActiveStep(1);
    toast.success(`Initialized inspection lot ${newRecord.inspectionNo}`);
  };

  // Phase metadata for the indicator bar
  const phaseMetadata = useMemo(() => {
    switch (activeStep) {
      case 1:
        return {
          badge: "Phase 1: Order & Batch Assembly Gate",
          desc: "Work order linkage, batch lot pedigree, serial range tracking, and AQL sampling plan.",
        };
      case 2:
        return {
          badge: "Phase 2: 100% Functional & Electrical Testing",
          desc: "Hi-Pot 2000V insulation, ground continuity, pilot duty cycle, and terminal torque run chart.",
        };
      case 3:
        return {
          badge: "Phase 3: Cosmetic & Packaging Audit (AQL)",
          desc: "Surface finish under 850 Lux, enclosure dimensions, packaging verification, and yield donut breakdown.",
        };
      case 4:
        return {
          badge: "Phase 4: Certificate of Conformance (COC) Verification",
          desc: "Digital cryptographic quality seal, certified quantity release, and QA lead sign-off.",
        };
      case 5:
      default:
        return {
          badge: "Phase 5: Finished Goods Handover & Defect Segregation",
          desc: "Quarantine segregation, NCR linkage for non-conformances, and warehouse handover clearance.",
        };
    }
  }, [activeStep]);

  return (
    <AppShell
      title="Final Inspection"
      breadcrumb="Management › Quality Management › Final Inspection"
      description="Pre-dispatch inspection gates, functional verification, packaging audits, and CoC issuance."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Top Header Card */}
        <FqcHeader
          record={record}
          onSave={handleSave}
          onComplete={handleComplete}
          onPrint={handlePrint}
          onCreateInspection={() => setCreateModalOpen(true)}
          onIssueCertificate={() => {
            setActiveStep(4);
            toast.success("Certificate of Conformance (COC) Verified", {
              description: `Batch ${record.batchLotNo} released with Certificate ${record.certificate.certificateNo}.`,
            });
          }}
          onReleaseWarehouse={handleReleaseWarehouse}
        />

        {/* Connected FQC Process Stepper */}
        <div className="w-full min-w-0 space-y-2.5">
          <FqcPhaseStepper
            currentStep={activeStep}
            onStepClick={(step) => setActiveStep(step)}
          />

          {/* Stepper Control & Phase Indicator Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-1 min-w-0">
            <div className="flex items-center gap-2 text-xs min-w-0">
              <span className="font-semibold text-foreground truncate">
                {viewMode === "phase"
                  ? phaseMetadata.badge
                  : "All End-of-Line Inspection Sections"}
              </span>
              <span className="text-muted-foreground hidden md:inline truncate">
                •{" "}
                {viewMode === "phase"
                  ? phaseMetadata.desc
                  : "Viewing all 5 inspection lifecycle stages simultaneously"}
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
          <FqcMetricCards record={record} />
        )}

        {/* Main Layout: 2-Column or Focused View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
          {/* Left Column (Span 2) */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            {/* Phase 1: Order & Batch Assembly Gate */}
            {(viewMode === "all" || activeStep === 1) && (
              <FqcDetailsForm record={record} onChange={handleUpdateRecord} />
            )}

            {/* Phase 2: 100% Functional & Electrical Testing */}
            {(viewMode === "all" || activeStep === 2) && (
              <div className="space-y-5 min-w-0">
                <FqcProcessParametersChart samples={record.testSamples} />
                <FqcCharacteristicsTable
                  characteristics={
                    viewMode === "phase" && activeStep === 2
                      ? record.characteristics.filter(
                          (c) =>
                            c.category === "Electrical" ||
                            c.category === "Functional" ||
                            c.category === "Safety"
                        )
                      : record.characteristics
                  }
                  onAddCharacteristic={handleAddCharacteristic}
                  onUpdateStatus={handleUpdateStatus}
                  onExportReport={handlePrint}
                />
              </div>
            )}

            {/* Phase 3: Cosmetic & Packaging Audit (AQL) */}
            {viewMode === "phase" && activeStep === 3 && (
              <div className="space-y-5 min-w-0">
                <FqcCharacteristicsTable
                  characteristics={record.characteristics.filter(
                    (c) => c.category === "Visual" || c.category === "Dimensional"
                  )}
                  onAddCharacteristic={handleAddCharacteristic}
                  onUpdateStatus={handleUpdateStatus}
                  onExportReport={handlePrint}
                />
                <FqcInspectionSummaryCard record={record} />
              </div>
            )}

            {/* Phase 4: CoC Certification Focus */}
            {viewMode === "phase" && activeStep === 4 && (
              <div className="space-y-5 min-w-0">
                <FqcQualityCertificateCard
                  record={record}
                  onIssueCertificate={() =>
                    toast.success("Certificate of Conformance issued and signed")
                  }
                />
                <div className="p-4 rounded-xl bg-card border border-border/80 space-y-2 text-xs">
                  <h3 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-primary" />
                    Dispatch Authorization Checklist
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground pt-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Hi-Pot Electrical Insulation Certified (2kV)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Ground Continuity &lt; 0.100 Ω Verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Serial Range Barcodes Verified & Readable</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Customer Order Documentation Included</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Phase 5: Finished Goods Release & Defect Segregation */}
            {viewMode === "phase" && activeStep === 5 && (
              <div className="space-y-5 min-w-0">
                <FqcRecentDefectsCard
                  defects={record.defects}
                  onAddDefect={handleAddDefect}
                />

                {/* Warehouse Handover Banner */}
                <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                        <Warehouse className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          Finished Goods Warehouse Handover
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Transfer approved conforming units to Finished Goods bay FG-04.
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={handleReleaseWarehouse}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                    >
                      <PackageCheck className="w-3.5 h-3.5 mr-1.5" />
                      Sign Handover & Release {record.acceptedQuantity} Units
                    </Button>
                  </div>
                </div>

                <FqcAiInsightsCard insights={record.aiInsights} />
              </div>
            )}

            {/* In "View All" mode, render defect segregation register */}
            {viewMode === "all" && (
              <FqcRecentDefectsCard
                defects={record.defects}
                onAddDefect={handleAddDefect}
              />
            )}
          </div>

          {/* Right Column (Span 1) */}
          <div className="space-y-5 min-w-0">
            {/* Quick Status / Inspection Summary Card */}
            {viewMode === "all" || activeStep !== 3 ? (
              <FqcInspectionSummaryCard record={record} />
            ) : null}

            {/* Quality Certificate Card */}
            {(viewMode === "all" || activeStep === 1 || activeStep === 2) && (
              <FqcQualityCertificateCard
                record={record}
                onIssueCertificate={() => {
                  setActiveStep(4);
                  toast.success("Certificate of Conformance issued and signed");
                }}
              />
            )}

            {/* Quick Phase Navigation Card */}
            <div className="bg-card rounded-xl border border-border/80 p-4 shadow-xs space-y-3 text-xs min-w-0">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <span className="font-semibold text-foreground">
                  Inspection Phase Navigation
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Phase {activeStep} of 5
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  { step: 1, label: "Batch Assembly Gate" },
                  { step: 2, label: "100% Functional & Electrical" },
                  { step: 3, label: "Cosmetic & Packaging Audit" },
                  { step: 4, label: "CoC Certification" },
                  { step: 5, label: "Finished Goods Release" },
                ].map((s) => (
                  <button
                    key={s.step}
                    type="button"
                    onClick={() => setActiveStep(s.step)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors cursor-pointer",
                      activeStep === s.step
                        ? "bg-[#0B3B7B]/10 text-[#0B3B7B] dark:bg-blue-950/40 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900/50"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
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
                  Sign-Off Lot ({record.acceptedQuantity} Units)
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

            {/* Non-conformances and Defects (in phases where not displayed on left) */}
            {(viewMode === "all" || activeStep === 1 || activeStep === 3) && (
              <FqcRecentDefectsCard
                defects={record.defects}
                onAddDefect={handleAddDefect}
              />
            )}

            {/* AI Insights Card */}
            {(viewMode === "all" || activeStep === 1 || activeStep === 2 || activeStep === 4) && (
              <FqcAiInsightsCard insights={record.aiInsights} />
            )}
          </div>
        </div>

        {/* Create Inspection Modal */}
        <CreateFqcModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateNewInspection}
        />
      </div>
    </AppShell>
  );
}
