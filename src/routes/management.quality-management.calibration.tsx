import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { CalibrationHeader } from "@/components/erp/calibration/CalibrationHeader";
import { CalibrationPhaseStepper } from "@/components/erp/calibration/CalibrationPhaseStepper";
import { CalibrationHeaderCard } from "@/components/erp/calibration/CalibrationHeaderCard";
import { EquipmentInformationCard } from "@/components/erp/calibration/EquipmentInformationCard";
import { PreCalibrationVerificationCard } from "@/components/erp/calibration/PreCalibrationVerificationCard";
import { CalibrationStandardsCard } from "@/components/erp/calibration/CalibrationStandardsCard";
import { EnvironmentalConditionsCard } from "@/components/erp/calibration/EnvironmentalConditionsCard";
import { CalibrationMeasurementTable } from "@/components/erp/calibration/CalibrationMeasurementTable";
import { CalibrationResultCard } from "@/components/erp/calibration/CalibrationResultCard";
import { CertificateInformationCard } from "@/components/erp/calibration/CertificateInformationCard";
import { CalibrationScheduleCard } from "@/components/erp/calibration/CalibrationScheduleCard";
import { AiCalibrationInsightsCard } from "@/components/erp/calibration/AiCalibrationInsightsCard";
import { RecentCalibrationsCard } from "@/components/erp/calibration/RecentCalibrationsCard";
import { CalibrationCertificateModal } from "@/components/erp/calibration/CalibrationCertificateModal";
import { CreateCalibrationModal } from "@/components/erp/calibration/CreateCalibrationModal";

import { INITIAL_CALIBRATION_RECORD } from "@/services/calibrationService";
import { CalibrationRecord, CalibrationMeasurementPoint } from "@/services/calibrationTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Sparkles,
  FileCheck,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/quality-management/calibration",
)({
  head: () => ({
    meta: [
      { title: "Calibration Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Measuring equipment traceability, calibration master registers, interval scheduling, and NABL certificates.",
      },
    ],
  }),
  component: CalibrationPage,
});

export function CalibrationPage() {
  const [record, setRecord] = useState<CalibrationRecord>(INITIAL_CALIBRATION_RECORD);
  const [activeStep, setActiveStep] = useState<number>(4);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [certificateModalOpen, setCertificateModalOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const handleFieldChange = (field: keyof CalibrationRecord, value: any) => {
    setRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Toggle single pre-verification check
  const handleTogglePreVerification = (id: string) => {
    setRecord((prev) => ({
      ...prev,
      preVerification: prev.preVerification.map((item) =>
        item.id === id
          ? { ...item, result: item.result === "Pass" ? "Fail" : "Pass" }
          : item
      ),
    }));
    toast.info("Pre-verification checklist status updated");
  };

  // Mark all pre-verification checks as Pass
  const handleMarkAllPrePass = () => {
    setRecord((prev) => ({
      ...prev,
      preVerification: prev.preVerification.map((item) => ({ ...item, result: "Pass" })),
    }));
    toast.success("All 6 pre-calibration checks marked as Pass");
  };

  // Reset pre-verification checks
  const handleResetPreVerification = () => {
    setRecord((prev) => ({
      ...prev,
      preVerification: prev.preVerification.map((item) => ({ ...item, result: "Fail" })),
    }));
    toast.info("Pre-calibration checklist reset");
  };

  // Add a new measurement test point
  const handleAddMeasurementPoint = (newPoint: CalibrationMeasurementPoint) => {
    setRecord((prev) => {
      const updated = [...prev.measurements, newPoint];
      const allPass = updated.every((m) => m.result === "Pass");
      return {
        ...prev,
        measurements: updated,
        overallResult: allPass ? "PASS" : "FAIL",
        overallResultDescription: allPass
          ? "Equipment is within specified tolerance and fit for use."
          : "Out-of-tolerance detected on one or more test points.",
      };
    });
  };

  // Toggle measurement result Pass/Fail with automatic overall evaluation
  const handleToggleMeasurementResult = (id: string) => {
    setRecord((prev) => {
      const updated = prev.measurements.map((m) =>
        m.id === id
          ? {
              ...m,
              result: (m.result === "Pass" ? "Fail" : "Pass") as "Pass" | "Fail",
              remarks: m.result === "Pass" ? "Exceeded tolerance limit" : "Within tolerance",
            }
          : m
      );
      const allPass = updated.every((m) => m.result === "Pass");
      return {
        ...prev,
        measurements: updated,
        overallResult: allPass ? "PASS" : "FAIL",
        overallResultDescription: allPass
          ? "Equipment is within specified tolerance and fit for use."
          : "Out-of-tolerance detected on one or more test points.",
      };
    });
    toast.info("Test point reading updated & calibration result evaluated");
  };

  // Create calibration callback
  const handleNewCalibrationCreated = (newPartial: Partial<CalibrationRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newPartial,
      calibrationStatus: "Scheduled",
      measurements: [
        {
          id: `m-${Date.now()}-1`,
          seq: 1,
          parameter: "Reference Check 1",
          nominalValue: 10.0,
          standardReading: 10.001,
          equipmentReading: 10.001,
          error: 0.0,
          tolerance: "±0.02",
          result: "Pass",
          remarks: "Baseline check within limits",
        },
      ],
    }));
    setActiveStep(1);
    toast.success(`Active record switched to ${newPartial.calibrationNumber}`);
  };

  const handleSave = () => {
    toast.success(`Calibration record ${record.calibrationNumber} draft saved successfully`);
  };

  const handleSubmitForApproval = () => {
    setRecord((prev) => ({ ...prev, calibrationStatus: "Approved" }));
    setActiveStep(6);
    toast.success(`Calibration ${record.calibrationNumber} marked as Approved & Certified!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleScheduleNext = () => {
    toast.info(`Next calibration interval verified for ${record.nextCalibrationDate}`);
  };

  const handleRaiseOot = () => {
    setRecord((prev) => ({
      ...prev,
      overallResult: "FAIL",
      overallResultDescription: "Out-of-Tolerance flag raised. Immediate quarantine required.",
      equipmentInfo: { ...prev.equipmentInfo, status: "Quarantined" },
    }));
    toast.warning(`Out-of-Tolerance flag raised for ${record.equipmentName}. Equipment Quarantined & CAPA generated.`);
  };

  // Phase Title and Description
  const phaseMetadata = useMemo(() => {
    switch (activeStep) {
      case 1:
      case 2:
        return {
          badge: "Phase 1 & 2: Identification & Registration",
          desc: "Equipment master cataloging, asset tags, calibration interval frequency, and lab assignment.",
        };
      case 3:
        return {
          badge: "Phase 3: Pre-Verification & Traceability",
          desc: "Physical integrity inspection, NABL reference standards traceability, and ambient room conditions.",
        };
      case 4:
        return {
          badge: "Phase 4: Calibration Execution & Testing",
          desc: "Multi-point precision measurement readings, nominal error calculations, and tolerance evaluation.",
        };
      case 5:
        return {
          badge: "Phase 5: Evaluation & Certification",
          desc: "Overall PASS/FAIL determination, expanded measurement uncertainty, and official NABL certificate.",
        };
      case 6:
      default:
        return {
          badge: "Phase 6: Status Release & Scheduling",
          desc: "Release to operational service, cycle schedule verification, and predictive interval insights.",
        };
    }
  }, [activeStep]);

  return (
    <AppShell
      title="Calibration"
      breadcrumb="Management › Quality Management › Calibration"
      description="Measuring equipment traceability, calibration master registers, interval scheduling, and NABL certificates."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Header Action Bar */}
        <CalibrationHeader
          record={record}
          onSave={handleSave}
          onSubmitForApproval={handleSubmitForApproval}
          onPrint={handlePrint}
          onPrintCertificate={() => setCertificateModalOpen(true)}
          onScheduleNext={handleScheduleNext}
          onRaiseOot={handleRaiseOot}
          onCreateCalibration={() => setCreateModalOpen(true)}
        />

        {/* Connected Calibration Phase Stepper */}
        <div className="w-full min-w-0 space-y-2.5">
          <CalibrationPhaseStepper
            currentStep={activeStep}
            onStepClick={(step) => setActiveStep(step)}
          />

          {/* Clean Stepper Control & Quick Phase Hop Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">
                {viewMode === "phase" ? phaseMetadata.badge : "All Dossier Sections"}
              </span>
              <span className="text-muted-foreground hidden md:inline">
                • {viewMode === "phase" ? phaseMetadata.desc : "Viewing all 6 calibration phases simultaneously"}
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
          {/* Left 2-Column Area: Forms, Specs, Measurements */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            {/* Phase 1 & 2: Header & Equipment Info */}
            {(viewMode === "all" || activeStep === 1 || activeStep === 2) && (
              <>
                <CalibrationHeaderCard
                  record={record}
                  onChange={handleFieldChange}
                />
                <EquipmentInformationCard record={record} />
              </>
            )}

            {/* Phase 3: Pre-Verification & Standards & Environment */}
            {(viewMode === "all" || activeStep === 3) && (
              <>
                <PreCalibrationVerificationCard
                  items={record.preVerification}
                  onToggleItem={handleTogglePreVerification}
                  onMarkAllPass={handleMarkAllPrePass}
                  onResetAll={handleResetPreVerification}
                />
                <CalibrationStandardsCard record={record} />
                <EnvironmentalConditionsCard record={record} />
              </>
            )}

            {/* Phase 4: Execution & Measurements */}
            {(viewMode === "all" || activeStep === 4) && (
              <>
                <CalibrationMeasurementTable
                  measurements={record.measurements}
                  onAddPoint={handleAddMeasurementPoint}
                  onToggleResult={handleToggleMeasurementResult}
                />
                {viewMode === "phase" && (
                  <EnvironmentalConditionsCard record={record} />
                )}
              </>
            )}

            {/* Phase 5: Result Evaluation & Certificate */}
            {(viewMode === "all" || activeStep === 5) && (
              <>
                <CalibrationResultCard record={record} />
                <CertificateInformationCard
                  record={record}
                  onOpenCertificateModal={() => setCertificateModalOpen(true)}
                />
              </>
            )}

            {/* Phase 6: Schedule & Audit */}
            {(viewMode === "all" || activeStep === 6) && (
              <>
                <CalibrationScheduleCard record={record} />
                <RecentCalibrationsCard history={record.recentCalibrations} />
              </>
            )}
          </div>

          {/* Right Column: Quick Status, Schedule, AI Insights, History */}
          <div className="space-y-5 min-w-0">
            {/* Quick Summary & Action Card */}
            <Card className="shadow-xs border-border/80 min-w-0">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Calibration Quick Status
                  </span>
                  <Badge
                    className={
                      record.overallResult === "PASS"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px]"
                        : "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-[10px]"
                    }
                  >
                    {record.overallResult}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Assigned Equipment</span>
                  <span className="font-semibold text-foreground block">{record.equipmentName}</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{record.equipmentId}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">Valid Until</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-[11px]">
                      {record.nextCalibrationDate}
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">Uncertainty</span>
                    <span className="font-mono font-medium text-foreground text-[11px]">
                      {record.measurementUncertainty}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="space-y-1.5 pt-1">
                  <Button
                    size="sm"
                    onClick={() => setCertificateModalOpen(true)}
                    className="w-full h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" />
                    View Certificate Preview
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSubmitForApproval}
                      className="flex-1 h-8 text-xs font-medium text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 border-emerald-300"
                    >
                      <FileCheck className="w-3 h-3 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRaiseOot}
                      className="flex-1 h-8 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:text-rose-400 border-rose-300"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Flag OOT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Calibration Insights */}
            <AiCalibrationInsightsCard insights={record.aiInsights} />

            {/* If in phase mode and not step 6, show compact schedule */}
            {viewMode === "phase" && activeStep !== 6 && (
              <CalibrationScheduleCard record={record} />
            )}

            {/* In full mode, show recent calibrations */}
            {viewMode === "all" && (
              <RecentCalibrationsCard history={record.recentCalibrations} />
            )}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CalibrationCertificateModal
        open={certificateModalOpen}
        onOpenChange={setCertificateModalOpen}
        record={record}
      />

      {/* Create Calibration Modal */}
      <CreateCalibrationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={handleNewCalibrationCreated}
      />
    </AppShell>
  );
}

