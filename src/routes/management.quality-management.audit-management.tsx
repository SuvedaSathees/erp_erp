import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { AuditHeader } from "@/components/erp/audit/AuditHeader";
import { AuditPhaseStepper } from "@/components/erp/audit/AuditPhaseStepper";
import { AuditHeaderCard } from "@/components/erp/audit/AuditHeaderCard";
import { AuditObjectiveScopeCard } from "@/components/erp/audit/AuditObjectiveScopeCard";
import { AuditChecklistCard } from "@/components/erp/audit/AuditChecklistCard";
import { AuditFindingsCard } from "@/components/erp/audit/AuditFindingsCard";
import { AuditSummaryCard } from "@/components/erp/audit/AuditSummaryCard";
import { AuditCategoryDonutCard } from "@/components/erp/audit/AuditCategoryDonutCard";
import { AuditAiInsightsCard } from "@/components/erp/audit/AuditAiInsightsCard";
import { AuditTeamCard } from "@/components/erp/audit/AuditTeamCard";
import { CreateAuditModal } from "@/components/erp/audit/CreateAuditModal";

import { INITIAL_AUDIT_RECORD } from "@/services/auditService";
import { AuditRecord, AuditChecklistItem, AuditFindingItem, FindingClassification } from "@/services/auditTypes";
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
  SlidersHorizontal,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/quality-management/audit-management",
)({
  head: () => ({
    meta: [
      { title: "Audit Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Internal, supplier, and ISO/IATF audit programs, checklist executions, and finding classifications.",
      },
    ],
  }),
  component: AuditManagementPage,
});

export function AuditManagementPage() {
  const [record, setRecord] = useState<AuditRecord>(INITIAL_AUDIT_RECORD);
  const [activeStep, setActiveStep] = useState<number>(3);
  const [viewMode, setViewMode] = useState<"phase" | "all">("phase");
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  const handleFieldChange = (field: keyof AuditRecord, value: any) => {
    setRecord((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Recalculate metrics helper
  const updateAuditMetrics = (checklist: AuditChecklistItem[], currentRecord: AuditRecord) => {
    const compliantCount = checklist.filter((i) => i.result === "Conforming").length;
    const minorNcCount = checklist.filter((i) => i.result === "Minor NC").length;
    const majorNcCount = checklist.filter((i) => i.result === "Major NC").length;
    const ofiCount = checklist.filter((i) => i.result === "Opportunity for Improvement (OFI)").length;
    const totalItems = checklist.length;
    const conformanceRate = totalItems > 0 ? Math.round((compliantCount / totalItems) * 100) : 100;

    return {
      ...currentRecord,
      checklist,
      totalItems,
      compliantCount,
      minorNcCount,
      majorNcCount,
      ofiCount,
      conformanceRate,
    };
  };

  // Toggle checklist item finding classification
  const handleToggleChecklistResult = (id: string) => {
    setRecord((prev) => {
      const updatedChecklist = prev.checklist.map((item) => {
        if (item.id !== id) return item;
        const nextResult: FindingClassification =
          item.result === "Conforming"
            ? "Minor NC"
            : item.result === "Minor NC"
            ? "Major NC"
            : item.result === "Major NC"
            ? "Opportunity for Improvement (OFI)"
            : "Conforming";
        return { ...item, result: nextResult };
      });
      return updateAuditMetrics(updatedChecklist, prev);
    });
    toast.info("Checklist finding updated & performance score recalculated");
  };

  // Add new clause verification
  const handleAddChecklistItem = (newCheck: AuditChecklistItem) => {
    setRecord((prev) => {
      const updatedChecklist = [...prev.checklist, newCheck];
      return updateAuditMetrics(updatedChecklist, prev);
    });
  };

  // Mark all checklist items conforming
  const handleMarkAllConforming = () => {
    setRecord((prev) => {
      const updatedChecklist = prev.checklist.map((i) => ({
        ...i,
        result: "Conforming" as FindingClassification,
        findingNote: "All requirements conforming to standard clause.",
      }));
      return updateAuditMetrics(updatedChecklist, prev);
    });
    toast.success("All checklist clauses marked as Conforming (100% Conformance)");
  };

  // Reset all checklist items
  const handleResetChecklist = () => {
    setRecord((prev) => {
      const updatedChecklist = prev.checklist.map((i) => ({
        ...i,
        result: "Minor NC" as FindingClassification,
      }));
      return updateAuditMetrics(updatedChecklist, prev);
    });
    toast.info("Checklist status reset");
  };

  // Add a new finding
  const handleAddFinding = (newFinding: AuditFindingItem) => {
    setRecord((prev) => ({
      ...prev,
      findings: [...prev.findings, newFinding],
    }));
  };

  // Raise an NCR for a finding
  const handleRaiseNcr = (finding: AuditFindingItem) => {
    const generatedNcr = `NCR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setRecord((prev) => ({
      ...prev,
      findings: prev.findings.map((f) =>
        f.id === finding.id ? { ...f, ncrReference: generatedNcr } : f
      ),
    }));
    toast.success(`NCR draft ${generatedNcr} generated and linked to ${finding.findingNumber}`);
  };

  // Auto-generate NCRs for all Major NC findings
  const handleGenerateNcrs = () => {
    setRecord((prev) => ({
      ...prev,
      findings: prev.findings.map((f, idx) => ({
        ...f,
        ncrReference: f.ncrReference || `NCR-2026-00${93 + idx}`,
      })),
    }));
    toast.success("Auto-generated linked NCRs for all audit findings");
  };

  // Create audit callback from modal
  const handleNewAuditCreated = (newPartial: Partial<AuditRecord>) => {
    setRecord((prev) => ({
      ...prev,
      ...newPartial,
    }));
    setActiveStep(1);
    toast.success(`Switched active audit dossier to ${newPartial.auditNumber}`);
  };

  const handleSave = () => {
    toast.success(`Audit record ${record.auditNumber} draft saved successfully`);
  };

  const handleSubmitAudit = () => {
    setRecord((prev) => ({ ...prev, auditStatus: "Completed", workflowStatus: "Completed" }));
    setActiveStep(6);
    toast.success(`Audit ${record.auditNumber} finalized and submitted for management review!`);
  };

  const handlePrint = () => {
    window.print();
  };

  // Phase Title and Description
  const phaseMetadata = useMemo(() => {
    switch (activeStep) {
      case 1:
      case 2:
        return {
          badge: "Phase 1 & 2: Audit Planning & Scope Assignment",
          desc: "Audit engagement title, category standards (ISO/IATF), lead auditor, and audited facility boundaries.",
        };
      case 3:
        return {
          badge: "Phase 3: Checklist Execution & Verification",
          desc: "Detailed clause-by-clause checklist evaluation, objective evidence notes, and auditor sign-off.",
        };
      case 4:
      case 5:
        return {
          badge: "Phase 4 & 5: Findings & NCR / CAPA Generation",
          desc: "Non-conformance classifications, immediate containment actions, and automatic NCR links.",
        };
      case 6:
      default:
        return {
          badge: "Phase 6: Closure & Management Review",
          desc: "Performance summary indices, lead auditor certification, and formal executive sign-off.",
        };
    }
  }, [activeStep]);

  return (
    <AppShell
      title="Audit Management"
      breadcrumb="Management › Quality Management › Audit Management"
      description="Internal, supplier, and ISO/IATF audit programs, checklist executions, and finding classifications."
      tabs={<QualityManagementTabBar />}
    >
      <div className="p-4 sm:p-6 space-y-5 w-full max-w-full overflow-x-hidden min-w-0 pb-16">
        {/* Header Action Bar */}
        <AuditHeader
          record={record}
          onSave={handleSave}
          onSubmitAudit={handleSubmitAudit}
          onPrint={handlePrint}
          onGenerateNcrs={handleGenerateNcrs}
          onCreateAudit={() => setCreateModalOpen(true)}
        />

        {/* Connected Audit Phase Stepper */}
        <div className="w-full min-w-0 space-y-2.5">
          <AuditPhaseStepper
            currentStep={activeStep}
            onStepClick={(step) => setActiveStep(step)}
          />

          {/* Clean Stepper Control & Quick Phase Hop Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 px-1">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-foreground">
                {viewMode === "phase" ? phaseMetadata.badge : "All Audit Sections"}
              </span>
              <span className="text-muted-foreground hidden md:inline">
                • {viewMode === "phase" ? phaseMetadata.desc : "Viewing all 6 audit lifecycle phases simultaneously"}
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
          {/* Left 2-Column Area: Header, Scope, Checklist, Findings */}
          <div className="lg:col-span-2 space-y-5 min-w-0">
            {/* Phase 1 & 2: Header, Objectives & Scope */}
            {(viewMode === "all" || activeStep === 1 || activeStep === 2) && (
              <>
                <AuditHeaderCard
                  record={record}
                  onChange={handleFieldChange}
                />
                <AuditObjectiveScopeCard
                  record={record}
                  onChange={handleFieldChange}
                />
                {viewMode === "phase" && <AuditTeamCard record={record} />}
              </>
            )}

            {/* Phase 3: Checklist Execution */}
            {(viewMode === "all" || activeStep === 3) && (
              <AuditChecklistCard
                checklist={record.checklist}
                onToggleResult={handleToggleChecklistResult}
                onAddCheck={handleAddChecklistItem}
                onMarkAllConforming={handleMarkAllConforming}
                onResetAll={handleResetChecklist}
              />
            )}

            {/* Phase 4 & 5: Findings & Non-Conformance Log */}
            {(viewMode === "all" || activeStep === 4 || activeStep === 5) && (
              <>
                <AuditFindingsCard
                  findings={record.findings}
                  onRaiseNcr={handleRaiseNcr}
                  onAddFinding={handleAddFinding}
                />
                {viewMode === "phase" && <AuditCategoryDonutCard />}
              </>
            )}

            {/* Phase 6: Closure, Summary & Review */}
            {(viewMode === "all" || activeStep === 6) && (
              <>
                <AuditSummaryCard record={record} />
                <AuditTeamCard record={record} />
              </>
            )}
          </div>

          {/* Right Column: Quick Status, Donut, AI Insights, Team */}
          <div className="space-y-5 min-w-0">
            {/* Quick Status & Action Card */}
            <Card className="shadow-xs border-border/80 min-w-0">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-sm font-semibold text-foreground flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    Audit Quick Status
                  </span>
                  <Badge
                    className={
                      record.conformanceRate >= 85
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px]"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px]"
                    }
                  >
                    {record.conformanceRate}% Conforming
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-3 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 space-y-1">
                  <span className="text-muted-foreground block text-[11px]">Audit Engagement</span>
                  <span className="font-semibold text-foreground block truncate">{record.auditTitle}</span>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-1">
                    <span className="font-mono">{record.auditNumber}</span>
                    <span>Lead: {record.leadAuditor.split(" ")[0]}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">Total Clauses</span>
                    <span className="font-bold text-foreground text-[12px] font-mono">
                      {record.totalItems} Checks
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">Findings</span>
                    <span className="font-semibold text-rose-600 dark:text-rose-400 text-[12px] font-mono">
                      {record.findings.length} Recorded
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-1.5 pt-1">
                  <Button
                    size="sm"
                    onClick={handleSubmitAudit}
                    className="w-full h-8 text-xs font-medium bg-[#0B3B7B] hover:bg-[#0B3B7B]/90 text-white"
                  >
                    <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                    Finalize & Submit Audit
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleGenerateNcrs}
                      className="flex-1 h-8 text-xs font-medium text-rose-700 hover:bg-rose-50 dark:text-rose-400 border-rose-300"
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Auto NCRs
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

            {/* In Phase mode 3 or 4, show Audit Summary & Scorecard */}
            {viewMode === "phase" && activeStep !== 6 && (
              <AuditSummaryCard record={record} />
            )}

            {/* AI Audit Insights */}
            <AuditAiInsightsCard insights={record.aiInsights} />

            {/* Category Breakdown Donut */}
            {viewMode === "all" && <AuditCategoryDonutCard />}
          </div>
        </div>
      </div>

      {/* Create Audit Modal */}
      <CreateAuditModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreated={handleNewAuditCreated}
      />
    </AppShell>
  );
}

