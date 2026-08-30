import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  Save,
  Send,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Printer,
  ShieldCheck,
  UserCheck,
  FileCode,
  CheckSquare,
  Upload,
} from "lucide-react";

import { toolingDevelopmentService } from "@/services/toolingDevelopmentService";
import type {
  ToolingRecord,
  ToolingFormInput,
  ToolingApprovalDecision,
  ToolingChecklistItem,
} from "@/services/types";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/erp/AppShell";

export const Route = createFileRoute(
  "/development/research-innovation/tooling-development/new",
)({
  head: () => ({
    meta: [{ title: "Tooling Development · Magnertia ERP" }],
  }),
  component: ToolingDevelopmentNewPage,
});

export function ToolingDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  // Approval Decision Form
  const [reviewDecision, setReviewDecision] = useState<ToolingApprovalDecision>("Approved");
  const [reviewCommentInput, setReviewCommentInput] = useState("");

  // Data Fetching
  const { data: record, isLoading } = useQuery<ToolingRecord>({
    queryKey: ["toolingRecord"],
    queryFn: () => toolingDevelopmentService.fetchRecord(),
  });

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ToolingFormInput>) => toolingDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["toolingRecord"], updated);
      toast.success("Draft saved successfully!", { description: "Tooling design baseline updated." });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message || "An error occurred." });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: (id?: string) => toolingDevelopmentService.submitForReview(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["toolingRecord"], updated);
      toast.success("Submitted for review board!", { description: "Plant layout and industrial managers notified." });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: { id: string; decision: ToolingApprovalDecision; comments?: string }) =>
      toolingDevelopmentService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["toolingRecord"], updated);
      toast.success(`Decision recorded: ${reviewDecision}`, { description: "Tooling workflow stage updated." });
    },
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Tooling Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Tooling Development Master Record...
        </div>
      </AppShell>
    );
  }

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      projectName: record.projectName,
      toolName: record.toolName,
      toolCategory: record.toolCategory,
      manufacturingPlant: record.manufacturingPlant,
      productionLine: record.productionLine,
      productFamily: record.productFamily,
      purpose: record.purpose,
      developmentStage: record.developmentStage,
      priority: record.priority,
      approvalDecision: record.approvalDecision,
      reviewComments: record.reviewComments,
    });
  };

  const handleSubmitDecision = () => {
    reviewDecisionMutation.mutate({
      id: record.id,
      decision: reviewDecision,
      comments: reviewCommentInput || undefined,
    });
  };

  const handleExportReport = () => {
    const content = `=====================================================
TOOLING DEVELOPMENT SPECIFICATION: ${record.projectName}
=====================================================
Tooling ID: ${record.toolingId}
Form Code: ${record.formCode}
Tool Number: ${record.toolNumber}
Tooling Version: ${record.toolingVersion}
Workflow Status: ${record.workflowStatus}
Manufacturing Plant: ${record.manufacturingPlant}
Production Line: ${record.productionLine}
Product Family: ${record.productFamily}
Design Engineer: ${record.toolDesignEngineer?.name || record.designEngineer?.name || "Rahul Sharma"}
Development Stage: ${record.developmentStage}
Priority: ${record.priority}
Next Review Date: ${record.nextReviewDate}

TOOLING PURPOSE & PARAMETERS:
-----------------------------------------------------
Purpose: ${record.purpose}
Tolerances (Dimensional): ${record.dimensionalTolerance} mm
Surface Finish: ${record.surfaceFinish}
Hardness: ${record.materialSpecification}
Tool Life Expectancy: ${record.toolLife.toLocaleString()} Cycles
Actual Production Cycles: ${record.productionCycles.toLocaleString()}
OEE Impact: ${record.oeeContribution}%

DESIGN RELEASE DOCUMENTS:
-----------------------------------------------------
CAD Model: ${record.cadModel}
Assembly Drawing: ${record.assemblyDrawing}
Detail Drawings: ${record.detailDrawings}
BOM: ${record.bom}
Material Spec: ${record.materialSpecification}

MANUFACTURING PARAMETERS:
-----------------------------------------------------
Manufacturing Process: ${record.manufacturingProcess}
Machine Allocations: ${record.machineAllocation.join(", ")}
CNC Program: ${record.cncProgram}
Material Requirements: ${record.materialRequirements}
Surface Coating: ${record.surfaceCoating}
Lead Time: ${record.manufacturingLeadTime}

READINESS & SCORES:
-----------------------------------------------------
Overall Readiness Score: ${record.overallToolingReadiness}%
Design Score: ${record.designReviewScore}/100
Manufacturing Score: ${record.manufacturingReadinessScore}/100
Validation Score: ${record.validationScore}/100
Commissioning Score: ${record.commissioningScore}/100
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.toolNumber}_Tooling_Specification.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tooling specification report downloaded successfully!");
  };

  const designDocuments = [
    { label: "3D CAD Model", filename: record.cadModel, type: "STEP", size: "14.8 MB" },
    { label: "Assembly Drawing", filename: record.assemblyDrawing, type: "PDF", size: "3.2 MB" },
    { label: "Detail Drawings", filename: record.detailDrawings, type: "PDF", size: "4.1 MB" },
    { label: "Bill of Materials (BOM)", filename: record.bom, type: "XLSX", size: "1.5 MB" },
    { label: "Material Specification", filename: record.materialSpecification, type: "PDF", size: "1.9 MB" },
  ];

  return (
    <AppShell
      title="Tooling Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Tooling Development"}
      description="Design, fabricate, validate, and commission high-precision manufacturing tooling."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Header Bar */}
        <div className="bg-card text-card-foreground border border-border px-5 py-3.5 shadow-xs rounded-xl mb-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3">
            {/* Left: Identity, Title & Sub-metadata */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-muted font-mono font-semibold text-xs border border-border whitespace-nowrap">
                  {record.toolingId}
                </span>
                <h1 className="text-base font-bold text-foreground truncate">
                  {record.projectName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 text-xs font-semibold px-2.5 py-0.5 whitespace-nowrap"
                >
                  {record.workflowStatus}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                <span className="text-[11px] font-semibold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 font-mono whitespace-nowrap">
                  {record.toolingVersion}
                </span>
                <span className="whitespace-nowrap">Plant: <strong className="text-foreground">{record.manufacturingPlant}</strong></span>
                <span className="text-muted-foreground/60">•</span>
                <span className="whitespace-nowrap">Engineer: <strong className="text-foreground">{record.toolDesignEngineer?.name || record.designEngineer?.name || "Rahul Sharma"}</strong></span>
                <span className="text-muted-foreground/60">•</span>
                <span className="whitespace-nowrap">Line: <strong className="text-foreground">{record.productionLine}</strong></span>
              </div>
            </div>

            {/* Right: Actions Toolbar */}
            <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
              >
                <Save className="h-3.5 w-3.5 text-muted-foreground" />
                Save Draft
              </Button>

              <Button
                size="sm"
                onClick={() => submitReviewMutation.mutate(record.id)}
                disabled={submitReviewMutation.isPending}
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs text-xs font-semibold"
              >
                <Send className="h-3.5 w-3.5" />
                Submit for Review
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleExportReport}
                className="gap-1.5 border-border hover:bg-muted text-xs font-semibold"
              >
                <Printer className="h-3.5 w-3.5 text-muted-foreground" />
                Export
              </Button>
            </div>
          </div>
        </div>

        {/* Unified Full-Width Form Sections */}
        <div className="space-y-5">
          {/* Section 1: Tooling Overview */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Tooling Overview & Operational Parameters</CardTitle>
                <CardDescription className="text-xs">
                  General identity, classification, manufacturing context, and operational parameters.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary text-xs font-semibold">
                {record.developmentStage}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Tooling Project</span>
                  <span className="font-bold text-foreground text-sm">{record.projectName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Tool Number</span>
                  <span className="font-bold font-mono text-primary">{record.toolNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Tool Category</span>
                  <span className="font-semibold text-foreground">{record.toolCategory}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Product Family</span>
                  <span className="font-semibold text-foreground">{record.productFamily}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Manufacturing Plant</span>
                  <span className="font-semibold text-foreground">{record.manufacturingPlant}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Production Line</span>
                  <span className="font-semibold text-foreground">{record.productionLine}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Priority</span>
                  <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200">
                    {record.priority}
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 text-xs">
                <span className="text-muted-foreground block text-[10px] font-semibold">Tooling Purpose</span>
                <p className="text-foreground mt-0.5 leading-relaxed">{record.purpose}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: CAD Design Specifications */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">CAD Design & Tooling Specifications</CardTitle>
                <CardDescription className="text-xs">
                  CAD models, engineering drawings, material specs, and surface finishes.
                </CardDescription>
              </div>
              <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 text-xs font-semibold">
                Design Score: {record.designReviewScore}/100
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border border-border/80 overflow-hidden bg-background text-xs shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Specification Item</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Attached Document</th>
                        <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {designDocuments.map((doc, idx) => (
                        <tr key={doc.label} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                            <span className="text-slate-400 font-mono text-[10px] mr-2">{idx + 1}.</span>
                            {doc.label}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                              <span className="font-mono text-xs text-primary font-medium cursor-pointer hover:underline">
                                {doc.filename}
                              </span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                {doc.size}
                              </Badge>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[11px] gap-1 hover:text-primary"
                                onClick={() => toast.info(`Previewing ${doc.filename}`)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Preview
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[11px] gap-1 hover:text-blue-600"
                                onClick={() => toast.success(`Downloading ${doc.filename}`)}
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Manufacturing & Material Requirements (3-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Machining Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Process</span>
                  <span className="font-bold text-foreground text-sm">{record.manufacturingProcess}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] mb-1">Machine Allocations</span>
                  <div className="flex flex-wrap gap-1">
                    {record.machineAllocation.map((m, idx) => (
                      <Badge key={idx} variant="secondary" className="text-[10px]">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">CNC Code Program</span>
                  <span className="font-semibold text-primary font-mono flex items-center gap-1 mt-0.5">
                    <FileCode className="h-3.5 w-3.5" /> {record.cncProgram}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Material & Heat Treatments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Material Requirements</span>
                  <span className="font-semibold text-foreground">{record.materialRequirements}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-y border-border/60">
                  <span className="font-medium">Heat Treatment Required</span>
                  <Badge className={record.heatTreatment ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]" : "bg-slate-100 text-slate-700 text-[10px]"}>
                    {record.heatTreatment ? "Yes (HRC 58-62)" : "No"}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Surface Coating</span>
                  <span className="font-semibold text-foreground">{record.surfaceCoating}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Tooling Life & Cycles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Cycles Run</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.productionCycles.toLocaleString()} Cycles</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Downtime</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.downtime} Hrs/Month</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">OEE Contribution</span>
                  <span className="font-bold text-emerald-600 text-sm font-mono">{record.oeeContribution}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 4: Validation & Line Integration Checks (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  Dimensional Accuracy & Tolerance Metrics
                </CardTitle>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                  Score: {record.validationScore}/100
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Dimensional Tolerance</span>
                    <span className="text-xl font-black text-foreground font-mono">{record.dimensionalTolerance} mm</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Repeatability Test</span>
                    <span className="text-xl font-black text-foreground font-mono">{record.repeatabilityTest} mm</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Validation Remarks</span>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {record.validationRemarks}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Operator Training & Line Commissioning Checks
                </CardTitle>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
                  Score: {record.commissioningScore}/100
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                {record.readinessChecklist.map((check: ToolingChecklistItem) => (
                  <div key={check.id} className="flex justify-between items-center p-2 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/40">
                    <div>
                      <span className="font-bold text-foreground block text-xs">{check.label}</span>
                      {check.notes && <span className="text-[10px] text-muted-foreground">{check.notes}</span>}
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold">
                      Completed
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Section 5: Multi-Level Review & Approval Workflow */}
          <Card className="border-border shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-border/60 pb-3 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <CardTitle className="text-base font-bold text-foreground">
                  Review & Approval Authorization Matrix
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">Workflow Stage:</span>
                <Badge className="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5">
                  {record.workflowStatus}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-5">
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                {/* Table on Left */}
                <div className="xl:col-span-8 space-y-2">
                  <div className="rounded-lg border border-border overflow-hidden text-xs bg-background shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                            <th className="py-3 px-4 font-semibold">Role</th>
                            <th className="py-3 px-4 font-semibold">Approver</th>
                            <th className="py-3 px-4 font-semibold">Decision</th>
                            <th className="py-3 px-4 font-semibold whitespace-nowrap">Date</th>
                            <th className="py-3 px-4 text-right font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {record.reviewers.map((rev) => {
                            const isApproved = rev.decision === "Approved";
                            return (
                              <tr key={rev.id} className="hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-4 font-semibold text-foreground whitespace-nowrap">
                                  {rev.role}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground whitespace-nowrap font-medium">
                                  {rev.person}
                                </td>
                                <td className="py-3 px-4 font-medium whitespace-nowrap">
                                  {isApproved ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
                                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Approved
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 font-semibold">
                                      <Clock className="h-3.5 w-3.5 shrink-0" /> Pending
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-muted-foreground font-mono whitespace-nowrap">
                                  {rev.date || "-"}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <Badge
                                    className={
                                      isApproved
                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-[10px] font-semibold"
                                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 text-[10px] font-semibold"
                                    }
                                  >
                                    {rev.decision}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Sign-Off Decision Panel on Right */}
                <div className="xl:col-span-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 text-xs">
                  <span className="font-bold text-foreground block text-sm flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary shrink-0" />
                    Sign-Off Decision Panel
                  </span>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">Approval Decision</label>
                    <Select
                      value={reviewDecision}
                      onValueChange={(val) => setReviewDecision(val as ToolingApprovalDecision)}
                    >
                      <SelectTrigger className="h-9 text-xs font-semibold bg-white dark:bg-slate-900 border-border">
                        <SelectValue placeholder="Select Decision" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Approved" className="text-xs text-emerald-600 font-semibold">Approved</SelectItem>
                        <SelectItem value="Approved with Conditions" className="text-xs text-blue-600">Approved with Conditions</SelectItem>
                        <SelectItem value="Revision Required" className="text-xs text-amber-600 font-semibold">Revision Required</SelectItem>
                        <SelectItem value="Rejected" className="text-xs text-destructive font-semibold">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">Review Comments</label>
                    <Textarea
                      rows={3}
                      value={reviewCommentInput}
                      onChange={(e) => setReviewCommentInput(e.target.value)}
                      placeholder="Enter review board comments, clearance notes, or tooling stipulations..."
                      className="text-xs bg-white dark:bg-slate-900 border-border min-h-[85px]"
                    />
                  </div>

                  <Button
                    size="sm"
                    onClick={handleSubmitDecision}
                    className="w-full gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Submit Review Decision
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Document & File Attachments */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Document & File Attachments</CardTitle>
                <CardDescription className="text-xs">
                  CAD models, engineering drawings, CNC programs, CMM inspection records & calibration sheets.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {record.attachments.length} Files Attached
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border/80 hover:border-primary/50 rounded-xl p-5 text-center bg-slate-50/50 dark:bg-slate-800/30 transition-colors">
                <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                <span className="text-xs font-semibold text-foreground block">Drag and drop engineering files here, or browse</span>
                <span className="text-[10px] text-muted-foreground block mt-0.5">Supported formats: .step, .igs, .stl, .pdf, .dwg, .gcode, .nc, .xlsx (Max 50MB)</span>
              </div>

              <div className="rounded-lg border border-border/80 overflow-hidden bg-background text-xs shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">File Name</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Document Type</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Uploaded By</th>
                        <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {record.attachments.map((att) => (
                        <tr key={att.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-medium text-foreground whitespace-nowrap">
                            <span className="font-mono text-primary block">{att.name}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{att.size}</span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                            <Badge variant="outline" className="text-[10px]">
                              {att.documentType}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                            {att.uploadedBy}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-[11px] gap-1 hover:text-blue-600"
                              onClick={() => toast.success(`Downloading ${att.name}`)}
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
