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
  Layers,
  Activity,
  Upload,
} from "lucide-react";

import { assemblyLineDevelopmentService } from "@/services/assemblyLineDevelopmentService";
import type {
  AssemblyLineRecord,
  AssemblyLineFormInput,
  AssemblyLineApprovalDecision,
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
  "/development/research-innovation/assembly-line-development/new",
)({
  head: () => ({
    meta: [{ title: "Assembly Line Development · Magnertia ERP" }],
  }),
  component: AssemblyLineDevelopmentNewPage,
});

export function AssemblyLineDevelopmentNewPage({
  breadcrumb = "Development > Manufacturing Development",
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  // Approval Decision Form
  const [reviewDecision, setReviewDecision] = useState<AssemblyLineApprovalDecision>("Approved");
  const [reviewCommentInput, setReviewCommentInput] = useState("");

  // Data Fetching
  const { data: record, isLoading } = useQuery<AssemblyLineRecord>({
    queryKey: ["assemblyLineRecord"],
    queryFn: () => assemblyLineDevelopmentService.fetchRecord(),
  });

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<AssemblyLineFormInput>) => assemblyLineDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["assemblyLineRecord"], updated);
      toast.success("Draft saved successfully!", { description: "Assembly line design baseline updated." });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message || "An error occurred." });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: (id?: string) => assemblyLineDevelopmentService.submitForReview(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["assemblyLineRecord"], updated);
      toast.success("Submitted for review board!", { description: "Plant layout and industrial managers notified." });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: { id: string; decision: AssemblyLineApprovalDecision; comments?: string }) =>
      assemblyLineDevelopmentService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["assemblyLineRecord"], updated);
      toast.success(`Decision recorded: ${reviewDecision}`, { description: "Assembly line workflow stage updated." });
    },
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="Assembly Line Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Assembly Line Development Master Record...
        </div>
      </AppShell>
    );
  }

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      projectName: record.projectName,
      productionLine: record.productionLine,
      productFamily: record.productFamily,
      manufacturingPlant: record.manufacturingPlant,
      assemblyLineType: record.assemblyLineType,
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

  const handleExportReport = () => {
    const content = `=====================================================
ASSEMBLY LINE DEVELOPMENT SPECIFICATION: ${record.projectName}
=====================================================
Assembly Line ID: ${record.assemblyLineId}
Form Code: ${record.formCode}
Line Name: ${record.productionLine}
Version: ${record.assemblyLineVersion}
Workflow Status: ${record.workflowStatus}
Manufacturing Plant: ${record.manufacturingPlant}
Product Family: ${record.productFamily}
Line Type: ${record.assemblyLineType}
Line Engineer: ${record.assemblyLineEngineer.name}
Development Stage: ${record.developmentStage}
Priority: ${record.priority}
Next Review Date: ${record.nextReviewDate}

OBJECTIVE & LINE SPECIFICATIONS:
-----------------------------------------------------
Objective: ${record.productionObjective}
Workstation Count: ${record.workstationsCount} Workstations
Target Takt Time: ${record.taktTimeTarget} s
Actual Cycle Time: ${record.actualCycleTime} s
Line Balancing Efficiency: ${record.lineBalanceEfficiency}%
Line Configuration: ${record.lineConfiguration}
Hourly Output Target: ${record.hourlyOutputTarget} units/hr
Target OEE: ${record.targetOEE}%

READINESS SCORES:
-----------------------------------------------------
Overall Readiness Score: ${record.overallAssemblyReadiness}%
Layout Score: ${record.layoutDesignScore}/100
Workstation Score: ${record.workstationScore}/100
Validation Score: ${record.validationScore}/100
Automation Score: ${record.automationScore}/100
Performance Score: ${record.performanceScore}/100

DRAWINGS & DOCUMENTS:
-----------------------------------------------------
Factory Layout: ${record.factoryLayout}
Line Layout: ${record.assemblyLineLayout}
Material Flow Diagram: ${record.materialFlowDiagram}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${record.assemblyLineId}_Line_Specification.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Assembly Line specification report downloaded successfully!");
  };

  const lineDocuments = [
    { label: "Factory Master Layout", filename: record.factoryLayout, type: "DWG", size: "14.2 MB" },
    { label: "Assembly Line Layout Drawing", filename: record.assemblyLineLayout, type: "DWG", size: "8.6 MB" },
    { label: "Material Flow Diagram", filename: record.materialFlowDiagram, type: "PDF", size: "3.4 MB" },
    { label: "Workstation Layout Sheet", filename: "ws_layout_sheet.xlsx", type: "XLSX", size: "1.8 MB" },
  ];

  const balancingWorkstations = [
    { id: "WS-1", name: "PCB Loading & Solder Inspection", cycleTime: "62s", load: "82%", target: "90%", status: "Balanced" },
    { id: "WS-2", name: "AC/DC Power Sub-Assembly", cycleTime: "65s", load: "85%", target: "90%", status: "Balanced" },
    { id: "WS-3", name: "Enclosure Wiring & Harness Fit", cycleTime: "68s", load: "88%", target: "90%", status: "Near Bottleneck" },
    { id: "WS-4", name: "Final Electrical Safety & EOL Test", cycleTime: "60s", load: "80%", target: "90%", status: "Balanced" },
  ];

  return (
    <AppShell
      title="Assembly Line Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Assembly Line Development"}
      description="Balance assembly lines, takt time distribution, ergonomic workstations, and automated line feeds."
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
                  {record.assemblyLineId}
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
                  {record.assemblyLineVersion}
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>Plant: <strong className="text-foreground">{record.manufacturingPlant}</strong></span>
                <span>•</span>
                <span>Line: <strong className="text-foreground">{record.productionLine}</strong></span>
                <span>•</span>
                <span>Engineer: <strong className="text-foreground">{record.assemblyLineEngineer.name}</strong></span>
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
                <CardTitle className="text-base font-bold">Assembly Line Specifications & Profile</CardTitle>
                <CardDescription className="text-xs">
                  Line identity, classification, manufacturing context, and operational parameters.
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-primary/5 text-primary text-xs font-semibold">
                {record.developmentStage}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Assembly Line Name</span>
                  <span className="font-bold text-foreground text-sm">{record.productionLine}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Product Family</span>
                  <span className="font-semibold text-foreground">{record.productFamily}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Plant Location</span>
                  <span className="font-semibold text-foreground">{record.manufacturingPlant}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Assembly Line Type</span>
                  <span className="font-semibold text-foreground">{record.assemblyLineType}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Workstation Count</span>
                  <span className="font-bold text-foreground font-mono">{record.workstationsCount} Workstations</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Line Configuration</span>
                  <span className="font-semibold text-foreground">{record.lineConfiguration}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Development Stage</span>
                  <span className="font-semibold text-foreground">{record.developmentStage}</span>
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

          {/* Section 2: CAD Layout & Drawings */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Line Layout & Material Flow CAD Files</CardTitle>
                <CardDescription className="text-xs">
                  2D/3D plant layouts, material routing schematics, and workstation arrangement blueprints.
                </CardDescription>
              </div>
              <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 text-xs font-semibold">
                Layout Score: {record.layoutDesignScore}/100
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
                      {lineDocuments.map((doc, idx) => (
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

          {/* Section 3: Takt Time, Cycle Times & Line Balancing Parameters (3-Column Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-primary" /> Takt Time & Line Balance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Target Takt Time</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.taktTimeTarget} Seconds</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Actual Bottleneck Cycle Time</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.actualCycleTime} Seconds</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Line Balance Efficiency</span>
                  <span className="font-bold text-emerald-600 text-sm font-mono">{record.lineBalanceEfficiency}%</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary" /> Workstation Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Total Workstations</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.workstationsCount} Workstations</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Conveyor Speed</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.conveyorSpeed} m/min</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Buffer Storage Capacity</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.bufferCapacity} Units</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Output & OEE Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Hourly Output Target</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.hourlyOutputTarget} Units / Hour</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Target OEE</span>
                  <span className="font-bold text-foreground text-sm font-mono">{record.targetOEE}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Shift Pattern</span>
                  <span className="font-semibold text-foreground">{record.shiftPattern}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section 4: Workstation Balancing & Utilization Table */}
          <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold">Workstation Balancing & Utilization</CardTitle>
                <CardDescription className="text-xs">
                  Line station workload distribution, cycle time balancing, and bottleneck tracking.
                </CardDescription>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                Workstation Score: {record.workstationScore}/100
              </Badge>
            </CardHeader>

            <CardContent>
              <div className="rounded-lg border border-border/80 overflow-hidden bg-background text-xs shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Station ID</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Operation Name</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Actual Cycle Time</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Workload %</th>
                        <th className="py-3 px-4 font-semibold whitespace-nowrap">Target %</th>
                        <th className="py-3 px-4 text-right font-semibold whitespace-nowrap">Balancing Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {balancingWorkstations.map((ws) => (
                        <tr key={ws.id} className="hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-primary font-mono whitespace-nowrap">
                            {ws.id}
                          </td>
                          <td className="py-3 px-4 font-medium text-foreground whitespace-nowrap">
                            {ws.name}
                          </td>
                          <td className="py-3 px-4 font-mono whitespace-nowrap">
                            {ws.cycleTime}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-foreground whitespace-nowrap">
                            {ws.load}
                          </td>
                          <td className="py-3 px-4 font-mono text-muted-foreground whitespace-nowrap">
                            {ws.target}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <Badge
                              className={
                                ws.status === "Balanced"
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

          {/* Section 5: Multi-Level Review & Approval Authorization */}
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
                      onValueChange={(val) => setReviewDecision(val as AssemblyLineApprovalDecision)}
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
                      placeholder="Enter review board comments, clearance notes, or line stipulations..."
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
                  CAD layouts, line balancing simulations, workstation sheets & validation test reports.
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
