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
  Activity,
  Layers,
  Upload,
} from "lucide-react";

import { productionEngineeringService } from "@/services/productionEngineeringService";
import type {
  ProductionEngineeringRecord,
  ProductionEngineeringFormInput,
  ProductionEngineeringApprovalDecision,
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
  "/development/research-innovation/production-engineering/new",
)({
  head: () => ({
    meta: [{ title: "Production Engineering · Magnertia ERP" }],
  }),
  component: ProductionEngineeringNewPage,
});

export function ProductionEngineeringNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  // Approval Decision Form
  const [reviewDecision, setReviewDecision] = useState<ProductionEngineeringApprovalDecision>("Approved");
  const [reviewCommentInput, setReviewCommentInput] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ label: string; filename: string; size: string; type?: string } | null>(null);

  // Data Fetching
  const { data: record, isLoading } = useQuery<ProductionEngineeringRecord>({
    queryKey: ["productionEngineeringRecord"],
    queryFn: () => productionEngineeringService.fetchRecord(),
  });

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ProductionEngineeringFormInput>) => productionEngineeringService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["productionEngineeringRecord"], updated);
      toast.success("Draft saved successfully!", { description: "Production engineering baseline updated." });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message || "An error occurred." });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: (id?: string) => productionEngineeringService.submitForReview(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["productionEngineeringRecord"], updated);
      toast.success("Submitted for Executive Board review!", { description: "Stakeholders and plant managers notified." });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: { id: string; decision: ProductionEngineeringApprovalDecision; comments?: string }) =>
      productionEngineeringService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["productionEngineeringRecord"], updated);
      toast.success(`Decision recorded: ${reviewDecision}`, { description: "Production workflow stage updated." });
    },
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Production Engineering"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Production Engineering Master Record...
        </div>
      </AppShell>
    );
  }

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      projectName: record.projectName,
      productName: record.productName,
      manufacturingPlant: record.manufacturingPlant,
      productionLine: record.productionLine,
      manufacturingProcess: record.manufacturingProcess,
      developmentStage: record.developmentStage,
      priority: record.priority,
      productionObjective: record.productionObjective,
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
    const content = `PRODUCTION ENGINEERING DOCUMENT\n\nTitle: ${doc.label}\nFile: ${doc.filename}\nSize: ${doc.size || "Standard"}\nProject: ${record.projectName} (${record.productionEngineeringId})\nPlant: ${record.manufacturingPlant}\nStatus: Approved Engineering Baseline v1.2.0`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = (doc.filename || "production_doc").replace(/\.[^/.]+$/, "") + ".txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${doc.filename}`);
  };

  const handleExportReport = () => {
    const content = `=====================================================
PRODUCTION ENGINEERING SPECIFICATION: ${record.projectName}
=====================================================
Production Engineering ID: ${record.productionEngineeringId}
Form Code: ${record.formCode}
Product: ${record.productName}
Production Engineer: ${record.productionEngineer?.name || "Rahul Sharma"}
Manufacturing Plant: ${record.manufacturingPlant}
Production Line: ${record.productionLine}
Manufacturing Process: ${record.manufacturingProcess}
Process Dev Link: ${record.linkedProcessDevelopment?.code || "PD-2024-0038"}
Production Version: ${record.productionVersion}
Workflow Status: ${record.workflowStatus}
Development Stage: ${record.developmentStage}
Next Review Date: ${record.nextReviewDate}

OBJECTIVES:
-----------------------------------------------------
${record.productionObjective}

READINESS SCORES:
-----------------------------------------------------
Overall Production Readiness: ${record.overallProductionReadiness || 86}%
Design Readiness Score: ${record.designReadinessScore || 88}%
Resource Readiness Score: ${record.resourceReadinessScore || 85}%
Validation Score: ${record.validationScore || 87}%
Quality & Safety Score: ${record.qualityScore || 84}%
Performance Score: ${record.performanceScore || 88}%

PROCESS PARAMETERS & CYCLE TIME:
-----------------------------------------------------
Standard Cycle Time: ${record.standardCycleTime || 18.5} Min/Unit
Process Parameters: ${record.processParameters}
Routing Sheet: ${record.routingSheet}
Operation Sequence: ${record.operationSequence}
Workstation Layout: ${record.workstationLayout}

CAPACITY & OUTPUT TARGETS:
-----------------------------------------------------
Planned Output: ${record.plannedOutput || 250} Units/Month
OEE Target: ${record.oeeTarget || 85}%
Yield Target: ${record.yieldTarget || 98.5}%
Throughput Target: ${record.throughputTarget || 15} Units/Hour
Machines Required: ${record.machinesRequired}
Tooling Required: ${record.toolingRequired}

APPROVAL MATRIX:
-----------------------------------------------------
${record.reviewers.map((r) => `${r.role}: ${r.person} - ${r.decision} (${r.date || "-"})`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.productionEngineeringId}_Production_Engineering_Spec.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Production Engineering report exported & downloaded successfully!");
  };

  const processDocuments = [
    { label: "Manufacturing Routing Sheet", filename: record.routingSheet || "routing_sheet.pdf", type: "PDF", size: "3.4 MB" },
    { label: "Operation Sequence Diagram", filename: record.operationSequence || "operation_sequence.pdf", type: "PDF", size: "2.8 MB" },
    { label: "Workstation Layout CAD Blueprint", filename: record.workstationLayout || "workstation_layout.pdf", type: "DWG", size: "8.6 MB" },
    { label: "Process Engineering Parameter Sheet", filename: "pe_parameter_spec.xlsx", type: "XLSX", size: "1.9 MB" },
  ];

  const workstations = [
    { id: "WS-1", name: "Station 1: PCB & Solder", status: "Operational", operator: "2 Technicians", parameter: "Solder Temp: 240°C", efficiency: "94%" },
    { id: "WS-2", name: "Station 2: Screw Torquing", status: "Operational", operator: "1 Technician", parameter: "Torque: 1.2 N.m", efficiency: "92%" },
    { id: "WS-3", name: "Station 3: Enclosure & Harness", status: "Bottleneck", operator: "2 Technicians", parameter: "Harness Fit check", efficiency: "85%" },
    { id: "WS-4", name: "Station 4: Functional Testing", status: "Operational", operator: "1 QA Tech", parameter: "Voltage: 220V AC", efficiency: "96%" },
  ];

  const pfmeaItems = [
    { id: "PF-01", processStep: "PCB Insertion", failureMode: "Component alignment offset", severity: 7, occurrence: 3, detection: 2, rpn: 42, action: "Physical tooling slot guides (Poka-Yoke)" },
    { id: "PF-02", processStep: "Cable Harness Routing", failureMode: "Tension stress on logic pins", severity: 8, occurrence: 4, detection: 3, rpn: 96, action: "Secondary zip-tie anchor at Station 3" },
    { id: "PF-03", processStep: "Automatic Screwdriving", failureMode: "Torque limit slip on AC relay", severity: 9, occurrence: 2, detection: 4, rpn: 72, action: "Electric screwdriver calibration log" },
    { id: "PF-04", processStep: "Hi-Pot Electrical Test", failureMode: "ESD shock warning false positive", severity: 6, occurrence: 5, detection: 2, rpn: 60, action: "Monthly probe insulation recalibration" },
  ];

  return (
    <AppShell
      title="Production Engineering"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Production Engineering"}
      description="Govern mass production process design, workstation allocation, pilot runs, PFMEA, OEE Targets, and AI optimization."
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
                  {record.productionEngineeringId}
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
                  {record.productionVersion}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Plant: <strong className="text-foreground">{record.manufacturingPlant}</strong></span>
                <span>•</span>
                <span>Line: <strong className="text-foreground">{record.productionLine}</strong></span>
                <span>•</span>
                <span>Engineer: <strong className="text-foreground">{record.productionEngineer.name}</strong></span>
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

        {/* Unified Layout Stack */}
        <div className="space-y-5">
          {/* Section 1: Overview */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Production Summary & Process Profile</CardTitle>
                <CardDescription className="text-xs">
                  Process baseline, product mapping, plant allocation, and strategic manufacturing objective.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary text-xs font-semibold">
                {record.developmentStage}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Project Name</span>
                  <span className="font-bold text-foreground text-sm">{record.projectName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Product Model</span>
                  <span className="font-semibold text-foreground">{record.productName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Manufacturing Process</span>
                  <span className="font-semibold text-foreground">{record.manufacturingProcess}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Process Dev Link</span>
                  <span className="font-semibold font-mono text-primary">{record.linkedProcessDevelopment.code}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Plant Location</span>
                  <span className="font-semibold text-foreground">{record.manufacturingPlant}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Production Line</span>
                  <span className="font-semibold text-foreground">{record.productionLine}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Business Readiness</span>
                  <span className="font-bold text-emerald-600 font-mono">{record.businessReadiness}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Priority</span>
                  <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200">
                    {record.priority}
                  </Badge>
                </div>
              </div>

              <div className="pt-3 border-t border-border/60 text-xs">
                <span className="text-muted-foreground block text-[10px] font-semibold">Production Objective</span>
                <p className="text-foreground mt-0.5 leading-relaxed">{record.productionObjective}</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Routing & Design Drawings */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Process Design & Routing Drawings</CardTitle>
                <CardDescription className="text-xs">
                  Routing sheets, operational sequences, workstation layouts, and parameter blueprints.
                </CardDescription>
              </div>
              <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 text-xs font-semibold">
                Design Score: {record.designReadinessScore}/100
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border border-border/80 overflow-hidden bg-background text-xs shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Drawing / Document</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Attached File</th>
                        <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {processDocuments.map((doc, idx) => (
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

          {/* Section 3: Workstation Allocation & Balancing Table */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Workstation Allocation & Operating Parameters</CardTitle>
                <CardDescription className="text-xs">
                  Workstation operating limits, technician staffing, and station efficiency index.
                </CardDescription>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                Resource Score: {record.resourceReadinessScore || 85}/100
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border border-border/80 overflow-hidden bg-background text-xs shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Station ID</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Station Name</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Operating Parameter</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Assigned Operator</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Efficiency %</th>
                        <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {workstations.map((ws) => (
                        <tr key={ws.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-primary font-mono whitespace-nowrap">
                            {ws.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-foreground whitespace-nowrap">
                            {ws.name}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground whitespace-nowrap font-mono text-[11px]">
                            {ws.parameter}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap text-foreground">
                            {ws.operator}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-foreground whitespace-nowrap">
                            {ws.efficiency}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <Badge
                              className={
                                ws.status === "Operational"
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 text-[10px] font-semibold"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 text-[10px] font-semibold"
                              }
                            >
                              {ws.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Operational Metrics & Capacity (3-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-primary" /> Output & Cycle Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Planned Monthly Output</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.plannedOutput || 250} Units/Mo</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Standard Cycle Time</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.standardCycleTime || 18.5} Min / Unit</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Throughput Target</span>
                  <span className="font-bold text-emerald-600 text-sm font-mono">{record.throughputTarget || 15} Units / Hour</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> OEE & Quality Targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Target OEE</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.oeeTarget || 85}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Yield Target</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.yieldTarget || 98.5}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Process Validation</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] mt-0.5">
                    {record.validationPassed ? "Trial Run Passed" : "In Validation"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" /> Resource Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Machines Required</span>
                  <p className="font-medium text-foreground text-[11px] mt-0.5 line-clamp-1">{record.machinesRequired}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Tooling & Fixtures Required</span>
                  <p className="font-medium text-foreground text-[11px] mt-0.5 line-clamp-1">{record.toolingRequired}</p>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Process Parameters Spec</span>
                  <p className="font-mono text-muted-foreground text-[10px] mt-0.5 truncate">{record.processParameters}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 5: Process PFMEA Table */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Process PFMEA & Error-Proofing Controls</CardTitle>
                <CardDescription className="text-xs">
                  Process failure modes, severity/occurrence/detection scoring, and mitigation actions.
                </CardDescription>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                Quality Score: {record.qualityScore || 84}/100
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border border-border/80 overflow-hidden bg-background text-xs shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Step ID</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Process Step</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Potential Failure Mode</th>
                        <th className="py-3 px-3 text-center font-semibold">S</th>
                        <th className="py-3 px-3 text-center font-semibold">O</th>
                        <th className="py-3 px-3 text-center font-semibold">D</th>
                        <th className="py-3 px-3 text-center font-semibold">RPN</th>
                        <th className="py-3 px-4 font-semibold">Poka-Yoke & Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {pfmeaItems.map((item) => (
                        <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-primary font-mono whitespace-nowrap">
                            {item.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-foreground whitespace-nowrap">
                            {item.processStep}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {item.failureMode}
                          </td>
                          <td className="py-3 px-3 text-center font-mono">{item.severity}</td>
                          <td className="py-3 px-3 text-center font-mono">{item.occurrence}</td>
                          <td className="py-3 px-3 text-center font-mono">{item.detection}</td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-foreground">
                            {item.rpn}
                          </td>
                          <td className="py-3 px-4 text-foreground font-medium">
                            {item.action}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Multi-Level Review & Approval Authorization */}
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
                {/* Table on Left (8 cols) */}
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

                {/* Sign-Off Decision Panel on Right (4 cols) */}
                <div className="xl:col-span-4 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 space-y-4 text-xs">
                  <span className="font-bold text-foreground block text-sm flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-primary shrink-0" />
                    Sign-Off Decision Panel
                  </span>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground block">Approval Decision</label>
                    <Select
                      value={reviewDecision}
                      onValueChange={(val) => setReviewDecision(val as ProductionEngineeringApprovalDecision)}
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
                      placeholder="Enter review board comments, clearance notes, or production stipulations..."
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

          {/* Section 7: Document & File Attachments */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Document & File Attachments</CardTitle>
                <CardDescription className="text-xs">
                  Routing sheets, CAD layouts, PFMEA files, process parameter sheets & validation trial run logs.
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
                <span className="text-[10px] text-muted-foreground block mt-0.5">Supported formats: .dwg, .dxf, .pdf, .xlsx, .csv (Max 50MB)</span>
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
              {previewDoc?.label} • {previewDoc?.size} • Production Engineering Document
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
            <p className="text-emerald-400 font-bold">=== PRODUCTION ENGINEERING SPECIFICATION METADATA ===</p>
            <p>Title: {previewDoc?.label}</p>
            <p>File: {previewDoc?.filename}</p>
            <p>Project: {record.projectName} ({record.productionEngineeringId})</p>
            <p>Plant: {record.manufacturingPlant} | Line: {record.productionLine}</p>
            <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs">
              Production engineering design and parameter release for Smart EV Charger AC 7kW manufacturing. Target monthly output: 250 Units/Mo at 18.5 Min cycle time with OEE 85% and Yield 98.5%.
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
