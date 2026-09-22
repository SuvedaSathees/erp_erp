import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Code,
  Layers,
  Cpu,
  Database,
  ShieldCheck,
  Activity,
  GitBranch,
  Terminal,
  Play,
  RefreshCw,
  FileText,
  Download,
  Upload,
  Eye,
  Save,
  Send,
  MoreHorizontal,
  ExternalLink,
  ChevronRight,
  Workflow,
  Copy,
  Plus,
  FileCode,
  HardDrive,
  Lock,
  Target,
  Zap,
  BarChart3,
  Check,
  X,
  Share2,
  Printer,
  History,
  Info,
  Maximize2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Box,
  Globe,
  Settings,
  Sparkles,
  Clock,
  ArrowRight,
  CheckSquare,
  UserCheck,
  Paperclip,
  ShieldAlert,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import {
  SoftwareDevelopmentTabBar,
  type SoftwareDevelopmentTabId,
} from "@/components/erp/SoftwareDevelopmentTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { softwareDevelopmentService } from "@/services/softwareDevelopmentService";
import type {
  SoftwareDevelopmentApprovalDecision,
  SoftwareDevelopmentFormInput,
  SoftwareDevelopmentRecord,
  SoftwareDevelopmentStage,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/software-development/new",
)({
  head: () => ({
    meta: [{ title: "Software Development · Magnertia ERP" }],
  }),
  component: SoftwareDevelopmentNewPage,
});

export function SoftwareDevelopmentFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <SoftwareDevelopmentNewPage {...props} />;
}

export function SoftwareDevelopmentPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <SoftwareDevelopmentNewPage {...props} />;
}

/* ===========================================================================
   Circular Score Gauge Component
   =========================================================================== */
function CircularScoreGauge({
  score,
  size = 110,
}: {
  score: number;
  label?: string;
  size?: number;
}) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = "text-blue-600 stroke-blue-600 dark:text-blue-400 dark:stroke-blue-400";
  if (score < 60) scoreColor = "text-amber-500 stroke-amber-500";
  if (score < 40) scoreColor = "text-rose-500 stroke-rose-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-100 dark:stroke-slate-800 fill-none"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn("fill-none transition-all duration-1000 ease-out", scoreColor)}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {score}%
        </span>
      </div>
    </div>
  );
}

/* ===========================================================================
   CI/CD Pipeline Stages Visualizer
   =========================================================================== */
function CicdPipelineStages({
  stages,
}: {
  stages: { id: string; name: string; status: "completed" | "in_progress" | "pending" }[];
}) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 border border-border rounded-xl overflow-x-auto">
      {stages.map((stg, idx) => (
        <div key={stg.id} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border-2 border-primary flex items-center justify-center shadow-2xs">
              <Check className="h-4 w-4 text-primary stroke-[3]" />
            </div>
            <span className="text-[11px] font-bold text-foreground whitespace-nowrap">{stg.name}</span>
          </div>
          {idx < stages.length - 1 && (
            <div className="h-[2px] w-10 sm:w-16 bg-slate-200 dark:bg-slate-700 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
}

/* ===========================================================================
   Main Software Development Page Component
   =========================================================================== */
export function SoftwareDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<SoftwareDevelopmentTabId>("overview");

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [architectureDiagramModalOpen, setArchitectureDiagramModalOpen] = useState(false);
  const [systemLogModalOpen, setSystemLogModalOpen] = useState(false);

  // Fetch record
  const { data: record, isLoading } = useQuery({
    queryKey: ["software-development-record"],
    queryFn: () => softwareDevelopmentService.fetchRecord(),
  });

  // Local Form state
  const [formInput, setFormInput] = useState<SoftwareDevelopmentFormInput | null>(null);

  if (record && !formInput) {
    setFormInput(record.input);
  }

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<SoftwareDevelopmentFormInput>) =>
      softwareDevelopmentService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["software-development-record"], updated);
      toast.success("Draft saved successfully!", {
        description: "Software development configurations updated.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save draft"),
  });

  const submitMutation = useMutation({
    mutationFn: () => softwareDevelopmentService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["software-development-record"], updated);
      toast.success("Submitted for Architecture Review!", {
        description: "Project moved to Stage 4 Engineering Review.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      decision: SoftwareDevelopmentApprovalDecision;
      comments?: string;
    }) => softwareDevelopmentService.reviewDecision({ id: record!.id, ...args }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["software-development-record"], updated);
      if (variables.decision === "Approved") {
        toast.success(
          "Software Development Approved! Downstream System Integration project SI-2024-0089 created."
        );
      } else {
        toast.info(`Review Decision updated to '${variables.decision}'.`);
      }
    },
    onError: (err: Error) => toast.error(err.message || "Decision submission failed"),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: SoftwareDevelopmentStage) =>
      softwareDevelopmentService.advanceStage(record!.id, targetStage),
    onSuccess: (updated) => {
      queryClient.setQueryData(["software-development-record"], updated);
      toast.success("Advanced workflow stage successfully!");
    },
  });

  if (isLoading || !record || !formInput) {
    return (
      <AppShell
        title="Software Development"
        breadcrumb={breadcrumb ?? "Development > Product Development > Software Development"}
        tabs={tabs}
      >
        <div className="p-8 space-y-6">
          <div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>
      </AppShell>
    );
  }

  const handleFieldChange = (field: keyof SoftwareDevelopmentFormInput, value: any) => {
    setFormInput((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const shouldShowSection = (tabKey: SoftwareDevelopmentTabId) => {
    return activeTab === "overview" || activeTab === tabKey;
  };

  return (
    <AppShell
      title="Software Development"
      breadcrumb={breadcrumb ?? "Development > Product Development > Software Development"}
      description="Develop core application software, microservices, algorithms, and backend enterprise services."
      tabs={tabs}
    >
      <div className="space-y-6 pb-16">
        {/* ===========================================================================
            1. RECORD HEADER BAR (Exact match to Cloud Platform / API Development design)
            =========================================================================== */}
        <div className="bg-white dark:bg-slate-900 border border-border rounded-xl px-6 py-4 space-y-3 shadow-2xs">
          {/* Row 1: Primary Title, Version, Status & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50">
                <Code className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {record.softwareProjectName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5"
                >
                  {record.softwareVersion}
                </Badge>
                <Badge
                  className={
                    record.status === "Approved"
                      ? "bg-emerald-600 text-white"
                      : record.status === "In Review" || record.status === "Under Review"
                      ? "bg-amber-500 text-white hover:bg-amber-600 font-semibold px-3 py-1 rounded-full"
                      : "bg-blue-600 text-white"
                  }
                >
                  {record.status}
                </Badge>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate(formInput)}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 h-9"
              >
                <Save className="h-4 w-4 text-slate-500" />
                Save Draft
              </Button>

              <Button
                size="sm"
                onClick={() => submitMutation.mutate()}
                disabled={submitMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm h-9"
              >
                <Send className="h-4 w-4" />
                Submit for Review
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setArchitectureDiagramModalOpen(true)}>
                    <Layers className="h-4 w-4 mr-2 text-blue-500" />
                    View Architecture Topology
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReportModalOpen(true)}>
                    <FileText className="h-4 w-4 mr-2 text-purple-500" />
                    Download Executive Report
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSystemLogModalOpen(true)}>
                    <History className="h-4 w-4 mr-2 text-emerald-500" />
                    View Audit Trail
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Specification
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Row 2: Secondary Metadata & Linked Entities with proper alignment */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  SOFTWARE DEV ID
                </span>
                <span className="font-bold font-mono text-foreground">
                  {record.softwareId}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  FORM CODE
                </span>
                <span className="font-semibold font-mono text-foreground">
                  {record.formCode}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  LINKED PRD
                </span>
                <span
                  onClick={() =>
                    navigate({ to: "/development/research-innovation/prd/new" as any })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedPrdId}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  LINKED ARCHITECTURE
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/product-architecture/new" as any,
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedProductArchitectureId}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  CREATED ON
                </span>
                <span className="font-mono text-muted-foreground">
                  {record.createdOn}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                SOFTWARE ARCHITECT:
              </span>
              <span className="font-semibold text-foreground">
                {record.softwareArchitectName}
              </span>
            </div>
          </div>
        </div>

        {/* Scores & Health Gauges Banner */}
        <ProductScoreBanner submoduleKey="software-development" />

        {/* Downstream Banner when Approved */}
        {record.status === "Approved" && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between text-emerald-900 dark:text-emerald-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-emerald-950 dark:text-white">
                  Software Development Approved by Review Board
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Downstream System Integration project{" "}
                  <span className="font-bold font-mono">
                    {record.linkedSystemIntegrationId}
                  </span>{" "}
                  has been auto-created &amp; linked (converging Firmware, Embedded, Electronics, and Software streams).
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() =>
                toast.info(
                  `Navigating to System Integration (${record.linkedSystemIntegrationId})...`
                )
              }
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Proceed to System Integration
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        )}

        {/* ===========================================================================
            4. MAIN CONTENT AREA
            =========================================================================== */}
        <div className="space-y-6">
            {/* -------------------------------------------------------------------
                PANEL 1: Software Project Overview
                ------------------------------------------------------------------- */}
            {shouldShowSection("overview") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-600" />
                    Software Project Overview
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.developmentStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Product Name
                    </label>
                    <Input
                      value={formInput.productName}
                      onChange={(e) => handleFieldChange("productName", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Software Name
                    </label>
                    <Input
                      value={formInput.softwareName}
                      onChange={(e) => handleFieldChange("softwareName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Development Objective
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.developmentObjective}
                      onChange={(e) => handleFieldChange("developmentObjective", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Business Requirements
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.businessRequirements}
                      onChange={(e) => handleFieldChange("businessRequirements", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Functional Requirements
                    </label>
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold px-3 py-2 rounded-lg flex items-center justify-between">
                      <span>{formInput.functionalRequirements}</span>
                      <span className="text-[11px] font-normal text-indigo-600 dark:text-indigo-400">Enterprise Grade</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Non-functional Requirements
                    </label>
                    <div className="text-xs text-foreground font-medium px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border">
                      {formInput.nonFunctionalRequirements}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 2: Software Architecture & Topology
                ------------------------------------------------------------------- */}
            {shouldShowSection("architecture") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Software Architecture &amp; Topology
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.architectureStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Architecture Style</span>
                    <Input
                      value={formInput.architectureStyle}
                      onChange={(e) => handleFieldChange("architectureStyle", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Application Architecture</span>
                    <Input
                      value={formInput.applicationArchitecture}
                      onChange={(e) => handleFieldChange("applicationArchitecture", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Backend Architecture</span>
                    <Input
                      value={formInput.backendArchitecture}
                      onChange={(e) => handleFieldChange("backendArchitecture", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Frontend Architecture</span>
                    <Input
                      value={formInput.frontendArchitecture}
                      onChange={(e) => handleFieldChange("frontendArchitecture", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Microservices Count</span>
                    <Input
                      type="number"
                      value={formInput.microservicesCount}
                      onChange={(e) => handleFieldChange("microservicesCount", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Middleware</span>
                    <Input
                      value={formInput.middleware}
                      onChange={(e) => handleFieldChange("middleware", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 3: Technology Stack & Frameworks
                ------------------------------------------------------------------- */}
            {shouldShowSection("technology_stack") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-600" />
                    Technology Stack &amp; Frameworks
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Readiness: {formInput.technologyReadinessScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Frontend Framework</span>
                    <Input
                      value={formInput.frontendFramework}
                      onChange={(e) => handleFieldChange("frontendFramework", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Backend Framework</span>
                    <Input
                      value={formInput.backendFramework}
                      onChange={(e) => handleFieldChange("backendFramework", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Database Engine</span>
                    <Input
                      value={formInput.database}
                      onChange={(e) => handleFieldChange("database", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Cloud Infrastructure</span>
                    <Input
                      value={formInput.cloudPlatform}
                      onChange={(e) => handleFieldChange("cloudPlatform", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Container Orchestration</span>
                    <Input
                      value={formInput.containerPlatform}
                      onChange={(e) => handleFieldChange("containerPlatform", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Programming Languages</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.programmingLanguages.map((lang, i) => (
                        <span key={i} className="bg-white dark:bg-slate-700 border border-border px-2 py-0.5 rounded text-[11px] font-bold text-foreground shadow-2xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 4: API & Service Integration
                ------------------------------------------------------------------- */}
            {shouldShowSection("api_integration") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    API &amp; Service Integration
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    API Status: {formInput.apiStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {formInput.apiTypesList.map((iface, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg">
                        <span className="font-bold text-foreground">{iface.name}</span>
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                          <Check className="h-3 w-3 stroke-[3]" /> Enabled
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-border">
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-1">API Gateway</span>
                      <Input
                        value={formInput.apiGateway}
                        onChange={(e) => handleFieldChange("apiGateway", e.target.value)}
                        className="h-9 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-1">ERP Integration</span>
                      <Input
                        value={formInput.erpIntegration}
                        onChange={(e) => handleFieldChange("erpIntegration", e.target.value)}
                        className="h-9 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold mb-1">Third-party APIs</span>
                      <div className="flex flex-wrap gap-1.5 p-1">
                        {formInput.thirdPartyApis.map((api, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                            {api}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 5: Database Architecture & Schema
                ------------------------------------------------------------------- */}
            {shouldShowSection("database") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    Database Architecture &amp; Schema
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Readiness: {formInput.databaseReadinessScore}/100 (100 Tables)
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Database Type</span>
                    <Input
                      value={formInput.databaseType}
                      onChange={(e) => handleFieldChange("databaseType", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Master Tables</span>
                    <Input
                      type="number"
                      value={formInput.masterTablesCount}
                      onChange={(e) => handleFieldChange("masterTablesCount", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Transaction Tables</span>
                    <Input
                      type="number"
                      value={formInput.transactionTablesCount}
                      onChange={(e) => handleFieldChange("transactionTablesCount", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Data Retention Policy</span>
                    <Input
                      value={formInput.dataRetentionPolicy}
                      onChange={(e) => handleFieldChange("dataRetentionPolicy", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Backup Strategy</span>
                    <Input
                      value={formInput.backupStrategy}
                      onChange={(e) => handleFieldChange("backupStrategy", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Database Schema</span>
                    <button
                      type="button"
                      onClick={() => toast.info("Opening ER Diagram editor...")}
                      className="text-xs font-bold text-primary hover:underline flex items-center gap-1.5 pt-2"
                    >
                      {formInput.databaseSchemaLink} &rarr;
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 6: DevOps & CI/CD Pipeline
                ------------------------------------------------------------------- */}
            {shouldShowSection("devops_cicd") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-blue-600" />
                    DevOps &amp; CI/CD Pipeline
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    DevOps: {formInput.devOpsStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    <div>
                      <span className="text-muted-foreground block font-semibold">Repository</span>
                      <span className="font-bold text-foreground">{formInput.sourceCodeRepository}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold">Branch Strategy</span>
                      <span className="font-bold text-foreground">{formInput.branchStrategy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold">CI/CD Platform</span>
                      <span className="font-bold text-foreground">{formInput.cicdPlatform}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold">Build Pipeline</span>
                      <span className="font-medium text-foreground">{formInput.buildPipeline}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold">Deployment Strat.</span>
                      <span className="font-bold text-foreground">{formInput.deploymentStrategy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-semibold">Monitoring</span>
                      <span className="font-medium text-foreground">{formInput.monitoringPlatform}</span>
                    </div>
                  </div>

                  {/* Pipeline Visualizer */}
                  <CicdPipelineStages stages={formInput.pipelineStages} />

                  {/* Environments */}
                  <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-2">
                    <span className="text-muted-foreground font-semibold">Target Environments:</span>
                    <div className="flex items-center gap-2">
                      {formInput.environments.map((env, idx) => (
                        <span
                          key={idx}
                          className={cn(
                            "px-3 py-1 rounded-lg text-xs font-bold border",
                            env.badgeColor || "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200"
                          )}
                        >
                          {env.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 7: Security, Auth & Compliance
                ------------------------------------------------------------------- */}
            {shouldShowSection("security_compliance") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Security, Auth &amp; Compliance
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Score: {formInput.securityScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Authentication Method</span>
                    <Input
                      value={formInput.authenticationMethod}
                      onChange={(e) => handleFieldChange("authenticationMethod", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Authorization Model</span>
                    <Input
                      value={formInput.authorizationModel}
                      onChange={(e) => handleFieldChange("authorizationModel", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Encryption Standard</span>
                    <Input
                      value={formInput.encryptionStandard}
                      onChange={(e) => handleFieldChange("encryptionStandard", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">API Security</span>
                    <Input
                      value={formInput.apiSecurity}
                      onChange={(e) => handleFieldChange("apiSecurity", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Secure Coding Standard</span>
                    <Input
                      value={formInput.secureCodingStandard}
                      onChange={(e) => handleFieldChange("secureCodingStandard", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Regulatory Compliance</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.regulatoryComplianceTags.map((tag, i) => (
                        <span key={i} className="bg-white dark:bg-slate-700 border border-border px-2 py-0.5 rounded text-[11px] font-bold text-foreground shadow-2xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 8: Testing Suite & QA Coverage
                ------------------------------------------------------------------- */}
            {shouldShowSection("testing_qa") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    Testing Suite &amp; QA Coverage
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Automated Code Coverage: {formInput.codeCoverage}%
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {formInput.testItems.map((test) => (
                    <div key={test.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg flex justify-between items-center">
                      <span className="font-semibold text-foreground">{test.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[11px] font-semibold",
                          test.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        {test.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 9: AI Software Assessment
                ------------------------------------------------------------------- */}
            {shouldShowSection("ai_assessment") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI Software Quality &amp; Architecture Assessment
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    AI Overall: {record.aiAssessment.aiOverallSoftwareScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Code Quality</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiCodeQualityScore}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Architecture</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiArchitectureAssessment}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Performance</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiPerformanceOptimization}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Security Anal.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiSecurityAssessment}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Maintainability</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiMaintainabilityAnalysis}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Tech Debt</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiTechnicalDebtAnalysis}/100</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 10: Readiness Summary
                ------------------------------------------------------------------- */}
            {shouldShowSection("summary") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Readiness &amp; Release Summary
                  </CardTitle>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-bold px-2.5 py-0.5">
                    Recommendation: {record.summary.recommendation}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Development Progress</span>
                      <span>{record.summary.developmentProgress} / 100</span>
                    </div>
                    <Progress value={record.summary.developmentProgress} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Architecture Readiness</span>
                      <span>{record.summary.architectureReadiness} / 100</span>
                    </div>
                    <Progress value={record.summary.architectureReadiness} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Testing Readiness</span>
                      <span>{record.summary.testingReadiness} / 100</span>
                    </div>
                    <Progress value={record.summary.testingReadiness} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Deployment Readiness</span>
                      <span>{record.summary.deploymentReadiness} / 100</span>
                    </div>
                    <Progress value={record.summary.deploymentReadiness} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 11: Document & Artifact Attachments
                ------------------------------------------------------------------- */}
            {shouldShowSection("attachments") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-blue-600" />
                    Document &amp; Artifact Attachments
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {formInput.attachments.length} Verified Files
                  </span>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {formInput.attachments.map((att) => (
                    <div key={att.id} className="p-3 border border-border rounded-lg bg-slate-50/60 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-between gap-2 shadow-2xs">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="h-4 w-4 text-primary shrink-0" />
                        <div className="truncate">
                          <span className="font-bold text-xs text-foreground block truncate">{att.name}</span>
                          <span className="text-[10px] text-muted-foreground block">{att.size}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toast.info(`Downloading ${att.name}...`)}
                        className="p-1 text-muted-foreground hover:text-foreground cursor-pointer"
                        title="Download file"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 12: Review & Approval Table & Form
                ------------------------------------------------------------------- */}
            {shouldShowSection("review_approval") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    Review &amp; Approval
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Software Engineering Review Board
                  </span>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Reviewers Table (Col-span 2) */}
                  <div className="lg:col-span-2 overflow-x-auto border border-border rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-border text-foreground font-semibold">
                        <tr>
                          <th className="p-2.5">Role</th>
                          <th className="p-2.5">Person</th>
                          <th className="p-2.5">Decision</th>
                          <th className="p-2.5">Status</th>
                          <th className="p-2.5">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {formInput.reviewers.map((rev) => (
                          <tr key={rev.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                            <td className="p-2.5 font-semibold text-foreground">{rev.role}</td>
                            <td className="p-2.5 text-muted-foreground">{rev.person}</td>
                            <td className="p-2.5">
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[10px] font-semibold",
                                  rev.decision === "Approved"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                )}
                              >
                                {rev.decision}
                              </Badge>
                            </td>
                            <td className="p-2.5 font-medium text-foreground">{rev.status}</td>
                            <td className="p-2.5 text-muted-foreground">{rev.date || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Decision Input Controls */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-border rounded-xl p-4 space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">Approval Decision</label>
                      <select
                        value={formInput.approvalDecision || ""}
                        onChange={(e) => handleFieldChange("approvalDecision", e.target.value as SoftwareDevelopmentApprovalDecision)}
                        className="w-full rounded-lg border border-input bg-white dark:bg-slate-900 p-2 font-semibold text-foreground text-xs"
                      >
                        <option value="">Select Decision</option>
                        <option value="Approved">Approved</option>
                        <option value="Approved with Conditions">Approved with Conditions</option>
                        <option value="Revision Required">Revision Required</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-muted-foreground mb-1">
                        <label>Review Comments</label>
                        <span>{(formInput.reviewComments || "").length}/2000</span>
                      </div>
                      <Textarea
                        rows={3}
                        maxLength={2000}
                        value={formInput.reviewComments || ""}
                        onChange={(e) => handleFieldChange("reviewComments", e.target.value)}
                        placeholder="Enter software review board comments..."
                        className="text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-muted-foreground mb-1">Approval Date</label>
                      <Input
                        type="date"
                        value={formInput.approvalDate || ""}
                        onChange={(e) => handleFieldChange("approvalDate", e.target.value)}
                        className="h-9 text-xs"
                      />
                    </div>

                    <Button
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                      disabled={reviewMutation.isPending}
                      onClick={() => {
                        if (!formInput.approvalDecision) {
                          toast.error("Please select an Approval Decision.");
                          return;
                        }
                        reviewMutation.mutate({
                          decision: formInput.approvalDecision,
                          comments: formInput.reviewComments,
                        });
                      }}
                    >
                      Submit Board Decision
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 13: System Information & Audit Trail
                ------------------------------------------------------------------- */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
              <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <History className="h-4 w-4 text-blue-600" />
                  System Information &amp; Audit Trail
                </CardTitle>
                <span className="text-xs font-semibold text-muted-foreground font-mono">
                  Audit Ref: {record.id}
                </span>
              </CardHeader>

              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created By</span>
                    <span className="font-bold text-foreground">{record.softwareArchitectName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created Date</span>
                    <span className="font-medium text-muted-foreground">{record.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified By</span>
                    <span className="font-bold text-foreground">{record.softwareArchitectName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified Date</span>
                    <span className="font-medium text-muted-foreground">{record.lastUpdated}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Workflow Stage</span>
                    <Badge variant="outline" className="text-[11px] font-semibold">{record.currentStageLabel.split(": ")[1]}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Version</span>
                    <span className="font-bold font-mono text-foreground">v{record.version}</span>
                  </div>
                </div>

                {/* History quick links */}
                <div className="flex flex-col justify-center space-y-1.5 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0 md:pl-4">
                  <button
                    type="button"
                    onClick={() => setSystemLogModalOpen(true)}
                    className="text-xs font-bold text-primary hover:underline text-left cursor-pointer"
                  >
                    View Log &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystemLogModalOpen(true)}
                    className="text-xs font-bold text-primary hover:underline text-left cursor-pointer"
                  >
                    View History &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystemLogModalOpen(true)}
                    className="text-xs font-bold text-primary hover:underline text-left cursor-pointer"
                  >
                    View Changes &rarr;
                  </button>
                </div>
              </CardContent>
            </Card>
        </div>

        {/* ===========================================================================
            MODALS
            =========================================================================== */}

        {/* Executive Report Modal */}
        <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Software Development Executive Report
              </DialogTitle>
              <DialogDescription>
                Generated executive summary report for record {record.softwareId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground block">{record.softwareProjectName}</span>
                <p className="text-muted-foreground leading-relaxed">
                  Covers Microservices architecture (12 services), React 18 frontend, Spring Boot 3.2 backend, 87.5% automated test coverage, OAuth 2.0 security, and Blue-Green staging deployment.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold">
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Overall Software Score: {record.summary.overallSoftwareScore}/100</div>
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Software Version: {record.softwareVersion}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => { toast.success("Downloaded Software_Development_Report.pdf"); setReportModalOpen(false); }}>
                <Download className="h-4 w-4 mr-1.5" /> Download PDF Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Architecture Diagram Modal */}
        <Dialog open={architectureDiagramModalOpen} onOpenChange={setArchitectureDiagramModalOpen}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Microservices Architecture Topology</DialogTitle>
            </DialogHeader>
            <div className="h-[400px] bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Layers className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Kubernetes Distributed Service Mesh</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                Ingress Controller routing via Kong API Gateway, gRPC inter-service communication, Kafka event bus for async messaging, and Prometheus observability.
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => toast.success("Service mesh topology validated.")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-200" /> Validate Topology
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* System Log Modal */}
        <Dialog open={systemLogModalOpen} onOpenChange={setSystemLogModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                Audit Trail &amp; Workflow History
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-80 overflow-y-auto space-y-3 text-xs">
              {record.auditTrail.map((log, idx) => (
                <div key={idx} className="p-3 border border-border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{log.actor}</span>
                    <span className="text-muted-foreground font-normal">{log.at}</span>
                  </div>
                  <p className="text-muted-foreground">{log.event}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
