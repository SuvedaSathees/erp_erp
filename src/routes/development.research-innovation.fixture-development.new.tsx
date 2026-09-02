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
  Boxes,
} from "lucide-react";

import { fixtureDevelopmentService } from "@/services/fixtureDevelopmentService";
import type {
  FixtureRecord,
  FixtureFormInput,
  FixtureApprovalDecision,
  FixtureChecklistItem,
} from "@/services/types";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppShell } from "@/components/erp/AppShell";

export const Route = createFileRoute(
  "/development/research-innovation/fixture-development/new",
)({
  head: () => ({
    meta: [{ title: "Fixture Development · Magnertia ERP" }],
  }),
  component: FixtureDevelopmentNewPage,
});

export function FixtureDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  // Approval Decision Form
  const [reviewDecision, setReviewDecision] = useState<FixtureApprovalDecision>("Approved");
  const [reviewCommentInput, setReviewCommentInput] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ label: string; filename: string; size: string; type?: string } | null>(null);

  // Data Fetching
  const { data: record, isLoading } = useQuery<FixtureRecord>({
    queryKey: ["fixtureRecord"],
    queryFn: () => fixtureDevelopmentService.fetchRecord(),
  });

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<FixtureFormInput>) => fixtureDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["fixtureRecord"], updated);
      toast.success("Draft saved successfully!", { description: "Fixture design baseline updated." });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message || "An error occurred." });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: (id?: string) => fixtureDevelopmentService.submitForReview(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["fixtureRecord"], updated);
      toast.success("Submitted for review board!", { description: "Plant layout and industrial managers notified." });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: { id: string; decision: FixtureApprovalDecision; comments?: string }) =>
      fixtureDevelopmentService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["fixtureRecord"], updated);
      toast.success(`Decision recorded: ${reviewDecision}`, { description: "Fixture workflow stage updated." });
    },
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Fixture Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Fixture Development Master Record...
        </div>
      </AppShell>
    );
  }

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      projectName: record.projectName,
      fixtureNumber: record.fixtureNumber,
      fixtureCategory: record.fixtureCategory,
      manufacturingPlant: record.manufacturingPlant,
      productionLine: record.productionLine,
      workstation: record.workstation,
      productFamily: record.productFamily,
      fixturePurpose: record.fixturePurpose,
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

  const handleDownloadDoc = (doc: { label: string; filename: string; size?: string }) => {
    const content = `FIXTURE SPECIFICATION DOCUMENT\n\nTitle: ${doc.label}\nFile: ${doc.filename}\nSize: ${doc.size || "Standard"}\nFixture: ${record.projectName} (${record.fixtureNumber})\nPlant: ${record.manufacturingPlant}\nStatus: Approved Engineering Baseline v1.2.0`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (doc.filename || "fixture_document").replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${doc.filename}`);
  };

  const handleExportReport = () => {
    const content = `=====================================================
FIXTURE DEVELOPMENT SPECIFICATION: ${record.projectName}
=====================================================
Fixture ID: ${record.fixtureId}
Form Code: ${record.formCode}
Fixture Number: ${record.fixtureNumber}
Fixture Version: ${record.fixtureVersion}
Workflow Status: ${record.workflowStatus}
Manufacturing Plant: ${record.manufacturingPlant}
Production Line: ${record.productionLine}
Workstation: ${record.workstation}
Product Family: ${record.productFamily}
Design Engineer: ${record.fixtureDesignEngineer?.name || "Rahul Sharma"}
Development Stage: ${record.developmentStage}
Priority: ${record.priority}
Next Review Date: ${record.nextReviewDate}

FIXTURE PURPOSE & ENGINEERING SPECS:
-----------------------------------------------------
Purpose: ${record.fixturePurpose}
Positioning Accuracy: ${record.positioningAccuracy} mm
Repeatability Test: ${record.repeatabilityTest} mm
Validation Remarks: ${record.validationRemarks}
Cycles Run: ${(record.productionCycles || 125000).toLocaleString()}
Fixture Life: ${(record.fixtureLife || 500000).toLocaleString()} Cycles
OEE Contribution: ${record.oeeContribution || 12.5}%

DESIGN RELEASE DOCUMENTS:
-----------------------------------------------------
CAD Model: ${record.cadModel}
Assembly Drawing: ${record.assemblyDrawing}
Detail Drawings: ${record.detailDrawings}
BOM: ${record.bom}
Locator Pin Design: ${record.locatorDesign}
Clamp Actuation: ${record.clampDesign}

MANUFACTURING PARAMETERS:
-----------------------------------------------------
Manufacturing Process: ${record.manufacturingProcess}
Machine Allocations: ${record.machineAllocation.join(", ")}
CNC Program: ${record.cncProgram}
Material Requirements: ${record.materialRequirements}
Surface Treatment: ${record.surfaceTreatment}

READINESS & SCORES:
-----------------------------------------------------
Overall Readiness Score: ${record.overallToolingReadiness || 86}%
Design Score: ${record.designReviewScore || 88}/100
Manufacturing Score: ${record.manufacturingReadinessScore || 85}/100
Validation Score: ${record.validationScore || 87}/100
Commissioning Score: ${record.commissioningScore || 86}/100
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.fixtureNumber}_Fixture_Specification.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Fixture specification report downloaded successfully!");
  };

  const designDocuments = [
    { label: "3D CAD Model", filename: record.cadModel || "evc_fixture_3d.step", type: "STEP", size: "12.4 MB" },
    { label: "Assembly Drawing", filename: record.assemblyDrawing || "evc_fixture_assembly.pdf", type: "PDF", size: "2.6 MB" },
    { label: "Detail Drawings", filename: record.detailDrawings || "evc_fixture_details.pdf", type: "PDF", size: "3.1 MB" },
    { label: "Bill of Materials (BOM)", filename: record.bom || "evc_fixture_bom.xlsx", type: "XLSX", size: "1.2 MB" },
    { label: "Locator Pin Design", filename: record.locatorDesign || "locator_design.pdf", type: "PDF", size: "1.8 MB" },
    { label: "Clamp Actuation Design", filename: record.clampDesign || "clamp_design.pdf", type: "PDF", size: "1.4 MB" },
  ];

  return (
    <AppShell
      title="Fixture Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Fixture Development"}
      description="Engineer custom clamping fixtures, locating pins, welding jigs, and holding apparatus."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Header Bar */}
        <div className="bg-card text-card-foreground border-b border-border px-5 py-3 shadow-xs rounded-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            {/* Left: Identity, Title & Sub-metadata */}
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-[11px] border border-border">
                  {record.fixtureId}
                </span>
                <h1 className="text-sm sm:text-base font-bold text-foreground">
                  {record.projectName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 text-[10px] font-bold"
                >
                  {record.workflowStatus}
                </Badge>
                <span className="text-[10px] font-bold text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50 font-mono">
                  {record.fixtureVersion}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Plant: <strong className="text-foreground">{record.manufacturingPlant}</strong></span>
                <span>•</span>
                <span>Engineer: <strong className="text-foreground">{record.fixtureDesignEngineer.name}</strong></span>
                <span>•</span>
                <span>Line: <strong className="text-foreground">{record.productionLine}</strong></span>
              </div>
            </div>

            {/* Right: Actions Toolbar */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
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
          {/* Section 1: Fixture Overview */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Fixture Overview & Operational Parameters</CardTitle>
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
                  <span className="text-muted-foreground block text-[10px]">Fixture Project</span>
                  <span className="font-bold text-foreground text-sm">{record.projectName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Fixture Number</span>
                  <span className="font-bold font-mono text-primary">{record.fixtureNumber}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Fixture Category</span>
                  <span className="font-semibold text-foreground">{record.fixtureCategory}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Workstation</span>
                  <span className="font-semibold text-foreground">{record.workstation}</span>
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
                <span className="text-muted-foreground block text-[10px] font-semibold">Fixture Purpose</span>
                <p className="text-foreground mt-0.5 leading-relaxed">{record.fixturePurpose}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: CAD Design Specifications */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">CAD Design & Locator Specifications</CardTitle>
                <CardDescription className="text-xs">
                  CAD models, engineering drawings, bushing, locator & clamping specs.
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
                              <span
                                onClick={() => setPreviewDoc(doc)}
                                className="font-mono text-xs text-primary font-medium cursor-pointer hover:underline"
                              >
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
                                className="h-7 px-2 text-[11px] gap-1 hover:text-primary cursor-pointer"
                                onClick={() => setPreviewDoc(doc)}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Preview
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[11px] gap-1 hover:text-blue-600 cursor-pointer"
                                onClick={() => handleDownloadDoc(doc)}
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
                  <span className="text-muted-foreground block text-[10px]">Surface Treatment</span>
                  <span className="font-semibold text-foreground">{record.surfaceTreatment}</span>
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
                  <span className="font-bold text-foreground text-sm font-mono">{(record.productionCycles || 125000).toLocaleString()} Cycles</span>
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
                  Positioning Accuracy & Tolerance Metrics
                </CardTitle>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                  Score: {record.validationScore}/100
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Positioning Accuracy</span>
                    <span className="text-xl font-black text-foreground font-mono">{record.positioningAccuracy} mm</span>
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
                {record.readinessChecklist.map((check: FixtureChecklistItem) => (
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
                      onValueChange={(val) => setReviewDecision(val as FixtureApprovalDecision)}
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
                      placeholder="Enter review board comments, clearance notes, or fixture stipulations..."
                      className="text-xs bg-white dark:bg-slate-900 border-border min-h-[85px]"
                    />
                  </div>

                  <Button
                    size="sm"
                    onClick={handleSubmitDecision}
                    className="w-full gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold shadow-xs cursor-pointer"
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
                  CAD models, engineering drawings, CNC programs, CMM inspection records & AI assessment reports.
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {record.attachments.length} Files Attached
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                onClick={() => toast.info("Opening file upload selector...")}
                className="border-2 border-dashed border-border/80 hover:border-primary/50 rounded-xl p-5 text-center bg-slate-50/50 dark:bg-slate-800/30 transition-colors cursor-pointer"
              >
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
                            <span
                              onClick={() => setPreviewDoc({ label: att.documentType, filename: att.name, size: att.size })}
                              className="font-mono text-primary block cursor-pointer hover:underline"
                            >
                              {att.name}
                            </span>
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
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[11px] gap-1 hover:text-primary cursor-pointer"
                                onClick={() => setPreviewDoc({ label: att.documentType, filename: att.name, size: att.size })}
                              >
                                <Eye className="h-3.5 w-3.5" />
                                Preview
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-[11px] gap-1 hover:text-blue-600 cursor-pointer"
                                onClick={() => handleDownloadDoc({ label: att.documentType, filename: att.name, size: att.size })}
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
        </div>
      </div>

      {/* Engineering Drawing / Attachment Preview Dialog */}
      <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FileText className="h-5 w-5 text-blue-600" />
              {previewDoc?.filename}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {previewDoc?.label} • {previewDoc?.size} • Fixture Engineering Document
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
            <p className="text-emerald-400 font-bold">=== FIXTURE SPECIFICATION METADATA ===</p>
            <p>Title: {previewDoc?.label}</p>
            <p>File: {previewDoc?.filename}</p>
            <p>Fixture: {record.projectName} ({record.fixtureNumber})</p>
            <p>Station: {record.workstation} | Line: {record.productionLine}</p>
            <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs">
              Fixture holds and locates EV charger housing with pneumatic toggle clamping and hardened guide locator pins for repeat assembly operations.
            </div>
          </div>
          <DialogFooter className="gap-2">
            {previewDoc && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadDoc(previewDoc)}
                className="h-8 text-xs gap-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download File
              </Button>
            )}
            <Button size="sm" onClick={() => setPreviewDoc(null)} className="h-8 text-xs bg-primary text-primary-foreground cursor-pointer">
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
