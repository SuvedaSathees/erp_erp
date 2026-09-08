import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { ComplianceHeader } from "@/components/erp/compliance/ComplianceHeader";
import { CompliancePhaseStepper } from "@/components/erp/compliance/CompliancePhaseStepper";
import { ComplianceHeaderCard } from "@/components/erp/compliance/ComplianceHeaderCard";
import { ComplianceRequirementDetailsCard } from "@/components/erp/compliance/ComplianceRequirementDetailsCard";
import { ComplianceObligationsCard } from "@/components/erp/compliance/ComplianceObligationsCard";
import { ComplianceEvidenceCard } from "@/components/erp/compliance/ComplianceEvidenceCard";
import { ComplianceGapRemediationCard } from "@/components/erp/compliance/ComplianceGapRemediationCard";
import { ComplianceContinuousMonitoringCard } from "@/components/erp/compliance/ComplianceContinuousMonitoringCard";
import { ComplianceOverviewCard } from "@/components/erp/compliance/ComplianceOverviewCard";
import { ComplianceCategoryDonutCard } from "@/components/erp/compliance/ComplianceCategoryDonutCard";
import { ComplianceRiskMatrixCard } from "@/components/erp/compliance/ComplianceRiskMatrixCard";
import { ComplianceAiInsightsCard } from "@/components/erp/compliance/ComplianceAiInsightsCard";
import { ComplianceLinkedRecordsCard } from "@/components/erp/compliance/ComplianceLinkedRecordsCard";
import { ComplianceHistoryCard } from "@/components/erp/compliance/ComplianceHistoryCard";
import { CreateComplianceModal } from "@/components/erp/compliance/CreateComplianceModal";
import { UploadEvidenceModal } from "@/components/erp/compliance/UploadEvidenceModal";

import { INITIAL_COMPLIANCE_RECORD } from "@/services/complianceService";
import { ComplianceRecord, ComplianceObligationItem, ComplianceEvidenceItem } from "@/services/complianceTypes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Layers, Eye } from "lucide-react";

export const Route = createFileRoute(
  "/management/quality-management/compliance",
)({
  head: () => ({
    meta: [
      { title: "Compliance Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Statutory and regulatory registers, ISO standard clauses, legal obligations, and gap remediation workflows.",
      },
    ],
  }),
  component: CompliancePage,
});

export function CompliancePage() {
  const [record, setRecord] = useState<ComplianceRecord>(INITIAL_COMPLIANCE_RECORD);
  const [activeStep, setActiveStep] = useState<number>(3); // Step 3: Obligations Register
  const [showAllSections, setShowAllSections] = useState<boolean>(false);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);

  const handleFieldChange = (field: keyof ComplianceRecord, value: any) => {
    setRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleToggleEvaluation = (id: string) => {
    setRecord((prev) => ({
      ...prev,
      obligations: prev.obligations.map((item) => {
        if (item.id !== id) return item;
        const nextEval: ComplianceObligationItem["evaluation"] =
          item.evaluation === "Compliant"
            ? "Minor Gap"
            : item.evaluation === "Minor Gap"
            ? "Major Gap"
            : "Compliant";
        return { ...item, evaluation: nextEval };
      }),
    }));
    toast.info("Obligation compliance evaluation toggled");
  };

  const handleAddObligation = () => {
    const newClauseNum = `8.5.${record.obligations.length + 1}`;
    const newObligation: ComplianceObligationItem = {
      id: `ob-${Date.now()}`,
      clauseRef: newClauseNum,
      requirement: "Identification and traceability of inspection outputs throughout production",
      applicableFunction: "Quality Assurance / Warehouse",
      evaluation: "Compliant",
      evidenceNote: "Barcode serialized travelers and ERP batch tracking verified",
      status: "Verified",
    };

    setRecord((prev) => ({
      ...prev,
      obligations: [...prev.obligations, newObligation],
    }));
    toast.success(`Added new obligation clause: ${newClauseNum}`);
  };

  const handleEvidenceUploaded = (item: ComplianceEvidenceItem) => {
    setRecord((prev) => ({
      ...prev,
      evidence: [item, ...prev.evidence],
    }));
  };

  const handleRecordCreated = (newRecord: Partial<ComplianceRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newRecord,
    }));
  };

  const handleSave = () => {
    toast.success(`Compliance record ${record.complianceNumber} draft saved successfully`);
  };

  const handleSubmitAssessment = () => {
    setRecord((prev) => ({ ...prev, workflowStatus: "Approved", complianceStatus: "Compliant" }));
    setActiveStep(6);
    toast.success(`Compliance assessment for ${record.complianceNumber} certified and approved!`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportComplianceReport = () => {
    toast.success("ISO 9001:2015 Clause Compliance Audit Report exported (PDF)");
  };

  const handleInitiateAudit = () => {
    toast.info("Internal Audit scheduled for Clause 8.5.1 verification");
  };

  const handleRaiseGapNcr = () => {
    toast.warning("NCR initiated for environmental compliance gap in Line 2");
  };

  return (
    <AppShell
      title="Compliance"
      breadcrumb="Management › Quality Management › Compliance"
      description="Statutory and regulatory registers, ISO standard clauses, legal obligations, and gap remediation workflows."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-4 max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Standardized Quality Action Header Card */}
        <ComplianceHeader
          record={record}
          onSave={handleSave}
          onSubmitAssessment={handleSubmitAssessment}
          onPrint={handlePrint}
          onCreateCompliance={() => setCreateModalOpen(true)}
          onExportComplianceReport={handleExportComplianceReport}
          onInitiateAudit={handleInitiateAudit}
          onRaiseGapNcr={handleRaiseGapNcr}
        />

        {/* 6-Phase Connected Compliance Phase Stepper */}
        <CompliancePhaseStepper
          currentStep={activeStep}
          onStepClick={(step) => {
            setActiveStep(step);
            setShowAllSections(false);
          }}
        />

        {/* Phase Filter / All Sections Toggle */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs text-muted-foreground font-medium">
            Active Phase:{" "}
            <strong className="text-foreground">
              {activeStep === 1
                ? "Step 1: Standard Identification"
                : activeStep === 2
                ? "Step 2: Scope Definition"
                : activeStep === 3
                ? "Step 3: Obligations Register"
                : activeStep === 4
                ? "Step 4: Evidence Collection"
                : activeStep === 5
                ? "Step 5: Risk & Gap Assessment"
                : "Step 6: Certification & Approval"}
            </strong>
          </span>

          <button
            type="button"
            onClick={() => setShowAllSections(!showAllSections)}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1.5 cursor-pointer py-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showAllSections ? "Focus on Current Phase" : "View All Sections"}</span>
          </button>
        </div>

        {showAllSections ? (
          <div className="space-y-4 min-w-0">
            {/* Section 1: Standard Identification & Scope */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start min-w-0">
              <div className="lg:col-span-2 space-y-4 min-w-0">
                <ComplianceHeaderCard
                  record={record}
                  onChange={handleFieldChange}
                />
                <ComplianceRequirementDetailsCard
                  record={record}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="space-y-4 min-w-0">
                <ComplianceOverviewCard record={record} />
                <ComplianceCategoryDonutCard />
              </div>
            </div>

            {/* Section 2: Obligations Register (Wide Table across full width) */}
            <div className="w-full min-w-0">
              <ComplianceObligationsCard
                obligations={record.obligations}
                onToggleEvaluation={handleToggleEvaluation}
                onAddObligation={handleAddObligation}
              />
            </div>

            {/* Section 3: Evidence Register & Gap Remediation Actions (Balanced 2-Column Row) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start min-w-0">
              <ComplianceEvidenceCard
                evidence={record.evidence}
                onUpload={() => setUploadModalOpen(true)}
              />
              <ComplianceGapRemediationCard />
            </div>

            {/* Section 4: Risk Matrix & Continuous Monitoring (Balanced 2-Column Row) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start min-w-0">
              <ComplianceRiskMatrixCard />
              <ComplianceContinuousMonitoringCard />
            </div>

            {/* Section 5: Quality Intelligence, Linked Records & Audit History (Balanced 3-Column Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start min-w-0">
              <ComplianceAiInsightsCard insights={record.aiInsights} />
              <ComplianceLinkedRecordsCard record={record} />
              <ComplianceHistoryCard history={record.history} />
            </div>
          </div>
        ) : (
          /* Phase-by-Phase Mode (Cleanly balanced per active step) */
          <div className="space-y-4 min-w-0">
            {(activeStep === 1 || activeStep === 2) && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start min-w-0">
                <div className="lg:col-span-2 space-y-4 min-w-0">
                  <ComplianceHeaderCard
                    record={record}
                    onChange={handleFieldChange}
                  />
                  <ComplianceRequirementDetailsCard
                    record={record}
                    onChange={handleFieldChange}
                  />
                </div>
                <div className="space-y-4 min-w-0">
                  <ComplianceOverviewCard record={record} />
                  <ComplianceCategoryDonutCard />
                  <ComplianceAiInsightsCard insights={record.aiInsights} />
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4 min-w-0">
                <ComplianceObligationsCard
                  obligations={record.obligations}
                  onToggleEvaluation={handleToggleEvaluation}
                  onAddObligation={handleAddObligation}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start min-w-0">
                  <ComplianceCategoryDonutCard />
                  <ComplianceAiInsightsCard insights={record.aiInsights} />
                  <ComplianceOverviewCard record={record} />
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start min-w-0">
                <ComplianceEvidenceCard
                  evidence={record.evidence}
                  onUpload={() => setUploadModalOpen(true)}
                />
                <div className="space-y-4 min-w-0">
                  <ComplianceOverviewCard record={record} />
                  <ComplianceLinkedRecordsCard record={record} />
                  <ComplianceAiInsightsCard insights={record.aiInsights} />
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start min-w-0">
                <ComplianceRiskMatrixCard />
                <ComplianceGapRemediationCard />
              </div>
            )}

            {activeStep === 6 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start min-w-0">
                <ComplianceContinuousMonitoringCard />
                <div className="space-y-4 min-w-0">
                  <ComplianceOverviewCard record={record} />
                  <ComplianceHistoryCard history={record.history} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interactive Modals */}
      <CreateComplianceModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onRecordCreated={handleRecordCreated}
      />

      <UploadEvidenceModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onEvidenceUploaded={handleEvidenceUploaded}
      />
    </AppShell>
  );
}

export default CompliancePage;
