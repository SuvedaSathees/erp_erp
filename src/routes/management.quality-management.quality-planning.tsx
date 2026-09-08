import React, { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { ApqpHeader } from "@/components/erp/apqp/ApqpHeader";
import { ApqpPhaseStepper, APQP_STEPS } from "@/components/erp/apqp/ApqpPhaseStepper";
import { ApqpScoreCardsGrid } from "@/components/erp/apqp/ApqpScoreCardsGrid";
import { ApqpProjectOverviewCard } from "@/components/erp/apqp/ApqpProjectOverviewCard";
import { ApqpDeliverablesTable } from "@/components/erp/apqp/ApqpDeliverablesTable";
import { ReviewApprovalTab } from "@/components/erp/apqp/tabs/ReviewApprovalTab";
import { ApqpMilestonesPanel } from "@/components/erp/apqp/ApqpMilestonesPanel";
import { ApqpAiInsightsPanel } from "@/components/erp/apqp/ApqpAiInsightsPanel";
import { AddApqpProjectModal } from "@/components/erp/apqp/AddApqpProjectModal";
import { INITIAL_APQP_RECORD } from "@/lib/apqpFns.server";
import type { ApqpRecord, ApqpApprovalDecision, ApqpDeliverable, ApqpReviewer } from "@/services/types";
import { Button } from "@/components/ui/button";
import {
  Layers,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute(
  "/management/quality-management/quality-planning",
)({
  head: () => ({
    meta: [
      { title: "Quality Planning (APQP) · Magnertia ERP" },
      {
        name: "description",
        content:
          "5-phase Advanced Product Quality Planning, feasibility gates, readiness scorecards, and PPAP production handover.",
      },
    ],
  }),
  component: QualityPlanningPage,
});

export function QualityPlanningPage() {
  const [record, setRecord] = useState<ApqpRecord>(INITIAL_APQP_RECORD);
  const [activeStep, setActiveStep] = useState<number>(3);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Update Deliverables
  const handleUpdateDeliverables = (updated: ApqpDeliverable[]) => {
    const totalPct = updated.reduce((sum, d) => sum + d.completionPercentage, 0);
    const avgScore = Math.round(totalPct / updated.length);

    setRecord((prev) => ({
      ...prev,
      deliverables: updated,
      overallApqpScore: Math.min(100, Math.max(70, Math.round(avgScore * 0.4 + 50))),
    }));
  };

  // Update Reviewers
  const handleUpdateReviewers = (updatedReviewers: ApqpReviewer[]) => {
    setRecord((prev) => ({ ...prev, reviewers: updatedReviewers }));
  };

  // Handle Review Decision from Sign-Off Decision Panel
  const handleReviewDecision = (decision: ApqpApprovalDecision, comments: string) => {
    setRecord((prev) => ({
      ...prev,
      approvalDecision: decision,
      workflowStatus:
        decision === "Approved" || decision === "Approved with Conditions"
          ? "Approved"
          : "Revision Required",
      reviewers: prev.reviewers.map((r) =>
        r.role === "Plant Head" || r.role === "COO"
          ? {
              ...r,
              decision,
              status: decision === "Approved" || decision === "Approved with Conditions" ? "Approved" : "Revision Required",
              comments,
              date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            }
          : r
      ),
    }));
  };

  // Create Project Callback
  const handleCreateProject = (newProj: any) => {
    setRecord((prev) => ({
      ...prev,
      id: `apqp-rec-${Date.now()}`,
      apqpId: newProj.apqpNumber || `APQP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      apqpNumber: newProj.apqpNumber || prev.apqpNumber,
      apqpProjectName: newProj.apqpProjectName || prev.apqpProjectName,
      product: newProj.product || prev.product,
      productRevision: newProj.productRevision || prev.productRevision,
      customer: newProj.customer || prev.customer,
      projectManager: newProj.projectManager || prev.projectManager,
      targetSopDate: newProj.targetSopDate || prev.targetSopDate,
      projectScope: newProj.projectScope || prev.projectScope,
      workflowStatus: "In Progress",
      overallApqpScore: 78,
    }));
    setActiveStep(1);
  };

  const currentPhaseTitle =
    APQP_STEPS.find((s) => s.step === activeStep)?.title || "Phase";

  return (
    <AppShell
      title="Quality Planning"
      breadcrumb="Management › Quality Management › Quality Planning"
      description="5-phase product & process quality planning from design input to full PPAP production handover."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Top Header Bar with real exports and modal triggers */}
        <ApqpHeader
          record={record}
          onSaveDraft={() => toast.success(`Saved APQP Draft: ${record.apqpId}`)}
          onSubmitForReview={() => {
            setRecord((prev) => ({ ...prev, workflowStatus: "In Review" }));
            toast.success("Submitted APQP Program for Executive Gate Sign-Off");
          }}
          onNewProject={() => setIsAddModalOpen(true)}
        />

        {/* 5 Readiness Score Cards */}
        <ApqpScoreCardsGrid record={record} />

        {/* View Mode Switcher Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border border-border w-full min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs font-semibold text-foreground">
              {viewMode === "phase"
                ? `Active APQP Gate: Step ${activeStep} of 5 — ${currentPhaseTitle}`
                : "Comprehensive APQP Master Plan (All Sections Active)"}
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

        {/* 5-Phase Connected Stepper */}
        <ApqpPhaseStepper
          record={record}
          currentStep={activeStep}
          onStepClick={(step) => setActiveStep(step)}
        />

        {/* Phase Mode Navigation Toolbar */}
        {viewMode === "phase" && (
          <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-border shadow-2xs text-xs w-full min-w-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={activeStep === 1}
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              className="h-8 text-xs gap-1 border-border"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous Gate</span>
            </Button>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-muted-foreground text-[11px]">Gate Jump:</span>
              {APQP_STEPS.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(s.step)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                    activeStep === s.step
                      ? "bg-blue-600 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {s.step}. {s.title}
                </button>
              ))}
            </div>

            <Button
              type="button"
              size="sm"
              disabled={activeStep === 5}
              onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
              className="h-8 text-xs gap-1 bg-[#0B3B7B] hover:bg-[#092e60] text-white"
            >
              <span>Next Gate</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}

        {/* Main Content Area based on View Mode */}
        {viewMode === "phase" ? (
          <div className="space-y-5 w-full max-w-full min-w-0">
            {/* Phase 1: Program Plan & Define */}
            {activeStep === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
                <div className="lg:col-span-2 space-y-5 min-w-0">
                  <ApqpProjectOverviewCard record={record} />
                </div>
                <div className="space-y-5 min-w-0">
                  <ApqpMilestonesPanel
                    milestones={record.upcomingMilestones}
                    projectName={record.apqpProjectName}
                  />
                  {record.aiAssessment && (
                    <ApqpAiInsightsPanel
                      aiAssessment={record.aiAssessment}
                      projectName={record.apqpProjectName}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Phase 2: Product Design & Development */}
            {activeStep === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
                <div className="lg:col-span-2 space-y-5 min-w-0">
                  <div className="bg-card border border-border rounded-xl shadow-xs p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground">
                            Phase 2: Product Design Verification & DFMEA
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            CAD maturity, BOM hierarchy release, design risk mitigation, and prototype verification.
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 self-start sm:self-auto">
                        Maturity: 94% Released
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">CAD 3D & 2D Drawings</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">94% Frozen</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          All 42 mechanical enclosures and PCB layout geometries frozen with GD&T tolerance limits released in PDM.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">Engineering BOM Hierarchy</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">Level 4 Released</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          100% component part numbers, approved manufacturer list (AML), and costed BOM registered in ERP master.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">DFMEA Risk Mitigation</span>
                          <span className="text-amber-600 dark:text-amber-400 font-semibold font-mono">Max RPN 84 (Med)</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          0 critical severity risks unmitigated. Thermal potting and silicone gasket added to prevent IP67 ingress failure.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">A-Sample Prototype Testing</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Passed (5/5)</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Thermal dissipation, 22kW inductive power transfer efficiency, and mechanical drop test verified conforming.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border text-xs">
                      <span className="text-muted-foreground text-[11px]">
                        Engineering Lead: <strong>Dr. Arun Varma</strong> • Review Cycle: REV 2.1
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Exported DFMEA & CAD Maturity Report (.csv)")}
                        className="h-7 text-xs border-border cursor-pointer"
                      >
                        Download Design Verification Summary
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-5 min-w-0">
                  {record.aiAssessment && (
                    <ApqpAiInsightsPanel
                      aiAssessment={record.aiAssessment}
                      projectName={record.apqpProjectName}
                    />
                  )}
                  <ApqpMilestonesPanel
                    milestones={record.upcomingMilestones}
                    projectName={record.apqpProjectName}
                  />
                </div>
              </div>
            )}

            {/* Phase 3: Process Design & Development (Active 65%) */}
            {activeStep === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
                <div className="lg:col-span-2 space-y-5 min-w-0">
                  <ApqpDeliverablesTable
                    deliverables={record.deliverables}
                    onUpdateDeliverables={handleUpdateDeliverables}
                  />
                </div>
                <div className="space-y-5 min-w-0">
                  <ApqpMilestonesPanel
                    milestones={record.upcomingMilestones}
                    projectName={record.apqpProjectName}
                  />
                  {record.aiAssessment && (
                    <ApqpAiInsightsPanel
                      aiAssessment={record.aiAssessment}
                      projectName={record.apqpProjectName}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Phase 4: Product & Process Validation */}
            {activeStep === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
                <div className="lg:col-span-2 space-y-5 min-w-0">
                  <div className="bg-card border border-border rounded-xl shadow-xs p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-foreground">
                            Phase 4: Product & Process Validation (PPAP Level 3)
                          </h3>
                          <p className="text-[11px] text-muted-foreground">
                            Run-at-rate trial production, statistical capability (Cpk), and PPAP submission elements.
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 self-start sm:self-auto">
                        PPAP Status: Level 3 Approved
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">AIAG PPAP 18-Element Package</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">18 / 18 Complete</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          PSW, Dimensional Results, Material Certs, Lab Docs, Process Flow, and Control Plans verified conforming.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">Run-at-Rate Trial Production</span>
                          <span className="text-blue-600 dark:text-blue-400 font-semibold font-mono">300 Units @ 98.4%</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          300 continuous assemblies run on Line 1 at 100% planned cycle speed without tooling jams or stoppages.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">Process Capability Index (Cpk)</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold font-mono">Cpk = 1.48 live</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Critical connector insertion torque and HV insulation clearance achieve Cpk &gt; 1.33 benchmark.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg border border-border/70 bg-muted/20 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground">Gage R&R Repeatability Study</span>
                          <span className="text-purple-600 dark:text-purple-400 font-semibold font-mono">6.8% (&lt; 10% Acceptable)</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          10 parts, 3 operators, 3 trials on Mitutoyo Digimatic instruments verify measurement system reliability.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-border text-xs">
                      <span className="text-muted-foreground text-[11px]">
                        Validation Lead: <strong>Priya S</strong> • Sign-off: <strong>OEM Customer Representative</strong>
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.success("Exported PPAP Level 3 Dossier (.csv)")}
                        className="h-7 text-xs border-border cursor-pointer"
                      >
                        Download PPAP Validation Dossier
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-5 min-w-0">
                  <ApqpMilestonesPanel
                    milestones={record.upcomingMilestones}
                    projectName={record.apqpProjectName}
                  />
                  {record.aiAssessment && (
                    <ApqpAiInsightsPanel
                      aiAssessment={record.aiAssessment}
                      projectName={record.apqpProjectName}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Phase 5: Launch & SOP Handover */}
            {activeStep === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start w-full min-w-0">
                <div className="lg:col-span-2 space-y-5 min-w-0">
                  {/* Production Clearance Banner */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="text-xs min-w-0 flex-1">
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-200">
                        PPAP PRODUCTION HANDOVER & MASS RAMP CLEARANCE
                      </h4>
                      <p className="text-emerald-700 dark:text-emerald-400 text-[11px] mt-0.5">
                        All 5 APQP phase deliverables and multi-disciplinary approvals registered. Program cleared for volume mass production SOP.
                      </p>
                    </div>
                  </div>

                  <ReviewApprovalTab
                    record={record}
                    onReviewDecision={handleReviewDecision}
                    onUpdateReviewers={handleUpdateReviewers}
                  />
                </div>
                <div className="space-y-5 min-w-0">
                  <div className="bg-card border border-border rounded-xl shadow-xs p-4 space-y-3 text-xs">
                    <h4 className="font-bold text-foreground text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      SOP Ramp-Up Verification
                    </h4>
                    <div className="space-y-2 text-[11px]">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                        <span className="text-muted-foreground">Line Tooling Installed:</span>
                        <span className="font-bold text-foreground">100% Certified</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                        <span className="text-muted-foreground">Open Critical NCRs:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">0 Open (Cleared)</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                        <span className="text-muted-foreground">Buffer Raw Materials:</span>
                        <span className="font-bold text-foreground">4 Weeks Stocked</span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/60">
                        <span className="text-muted-foreground">Safety Clearances:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">CE / IEC Certified</span>
                      </div>
                    </div>
                  </div>

                  {record.aiAssessment && (
                    <ApqpAiInsightsPanel
                      aiAssessment={record.aiAssessment}
                      projectName={record.apqpProjectName}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* View Mode === "all": All sections arranged logically without chaotic dumping */
          <div className="space-y-6 w-full max-w-full min-w-0">
            {/* Section 1: Project Overview */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                <span>Phase 1 & 2: Program Overview & Scope</span>
              </div>
              <ApqpProjectOverviewCard record={record} />
            </div>

            {/* Section 2: Phase Deliverables Table */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                <span>Phase 3: 5-Phase Key Deliverables Matrix</span>
              </div>
              <ApqpDeliverablesTable
                deliverables={record.deliverables}
                onUpdateDeliverables={handleUpdateDeliverables}
              />
            </div>

            {/* Section 3: Review & Approval Matrix */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <span>Phase 4 & 5: Gate Review & Approval Authorization</span>
              </div>
              <ReviewApprovalTab
                record={record}
                onReviewDecision={handleReviewDecision}
                onUpdateReviewers={handleUpdateReviewers}
              />
            </div>

            {/* Section 4: Milestones & AI Quality Insights */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                <span>Milestones & AI Quality Telemetry</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full min-w-0">
                <ApqpMilestonesPanel
                  milestones={record.upcomingMilestones}
                  projectName={record.apqpProjectName}
                />
                {record.aiAssessment && (
                  <ApqpAiInsightsPanel
                    aiAssessment={record.aiAssessment}
                    projectName={record.apqpProjectName}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add APQP Project Modal */}
        <AddApqpProjectModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateProject}
        />
      </div>
    </AppShell>
  );
}
