// Electronics Design Form - Magnertia ERP
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Cpu,
  Layers,
  Database,
  ShieldCheck,
  Activity,
  GitBranch,
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
  Palette,
  QrCode,
  Radio,
  Package,
  CircuitBoard,
  Microscope,
  ShieldAlert,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import {
  ElectronicsDesignTabBar,
  type ElectronicsDesignTabId,
} from "@/components/erp/ElectronicsDesignTabBar";
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
import { electronicsDesignService } from "@/services";
import type {
  ElectronicsDesignApprovalDecision,
  ElectronicsDesignFormInput,
  ElectronicsDesignRecord,
  ElectronicsDesignStage,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/electronics-design/new",
)({
  head: () => ({
    meta: [{ title: "Electronics Design · Magnertia ERP" }],
  }),
  component: ElectronicsDesignNewPage,
});

export function ElectronicsDesignFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ElectronicsDesignNewPage {...props} />;
}

export function ElectronicsDesignPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ElectronicsDesignNewPage {...props} />;
}

export function ElectronicsDesignDevelopmentNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ElectronicsDesignNewPage {...props} />;
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

  let scoreColor = "text-indigo-600 stroke-indigo-600 dark:text-indigo-400 dark:stroke-indigo-400";
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
   Main Electronics Design Page Component
   =========================================================================== */
export function ElectronicsDesignNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ElectronicsDesignTabId>("overview");

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [diagramModalOpen, setDiagramModalOpen] = useState(false);
  const [renderModalOpen, setRenderModalOpen] = useState(false);
  const [systemLogModalOpen, setSystemLogModalOpen] = useState(false);

  // Fetch record
  const { data: record, isLoading } = useQuery({
    queryKey: ["electronics-design-record"],
    queryFn: () => electronicsDesignService.fetchRecord(),
  });

  // Local Form state
  const [formInput, setFormInput] = useState<ElectronicsDesignFormInput | null>(null);

  if (record && !formInput) {
    setFormInput(record.input);
  }

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ElectronicsDesignFormInput>) =>
      electronicsDesignService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["electronics-design-record"], updated);
      toast.success("Draft saved successfully!", {
        description: "Electronics design configurations updated.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save draft"),
  });

  const submitMutation = useMutation({
    mutationFn: () => electronicsDesignService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["electronics-design-record"], updated);
      toast.success("Submitted for Architecture Review!", {
        description: "Project moved to Stage 4 Engineering Review.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      decision: ElectronicsDesignApprovalDecision;
      comments?: string;
    }) => electronicsDesignService.reviewDecision({ id: record!.id, ...args }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["electronics-design-record"], updated);
      if (variables.decision === "Approved") {
        toast.success(
          "Electronics Design Approved! Downstream PCB Layout project PCB-2024-0017 created."
        );
      } else {
        toast.info(`Review Decision updated to '${variables.decision}'.`);
      }
    },
    onError: (err: Error) => toast.error(err.message || "Decision submission failed"),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: ElectronicsDesignStage) =>
      electronicsDesignService.advanceStage(record!.id, targetStage),
    onSuccess: (updated) => {
      queryClient.setQueryData(["electronics-design-record"], updated);
      toast.success("Advanced workflow stage successfully!");
    },
  });

  if (isLoading || !record || !formInput) {
    return (
      <AppShell
        title="Electronics Design"
        breadcrumb={breadcrumb ?? "Development > Product Development > Electronics Design"}
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

  const handleFieldChange = (field: keyof ElectronicsDesignFormInput, value: any) => {
    setFormInput((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const shouldShowSection = (tabKey: ElectronicsDesignTabId) => {
    return activeTab === "overview" || activeTab === tabKey;
  };

  return (
    <AppShell
      title="Electronics Design"
      breadcrumb={breadcrumb ?? "Development > Product Development > Electronics Design"}
      description="Design electronic system architectures, schematics, component selections, power domains, and signal integrity."
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
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 flex items-center justify-center font-bold shrink-0 border border-indigo-200/50 dark:border-indigo-800/50">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {record.designProjectName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5"
                >
                  {record.designVersion}
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
                  <DropdownMenuItem onClick={() => setRenderModalOpen(true)}>
                    <Cpu className="h-4 w-4 mr-2 text-indigo-500" />
                    Inspect PCB Model
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDiagramModalOpen(true)}>
                    <Layers className="h-4 w-4 mr-2 text-blue-500" />
                    View System Block Diagram
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
                  ELECTRONICS DEV ID
                </span>
                <span className="font-bold font-mono text-foreground">
                  {record.designId}
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
                  LINKED ELECTRICAL
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/electrical-design/new" as any,
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedElectricalDesignId}
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
                  LINKED PRD
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/prd/new" as any,
                    })
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
                  CREATED ON
                </span>
                <span className="font-mono text-muted-foreground">
                  {record.createdOn}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                ELECTRONICS ENGINEER:
              </span>
              <span className="font-semibold text-foreground">
                {record.electronicsEngineerName}
              </span>
            </div>
          </div>
        </div>

        {/* Downstream Banner when Approved */}
        {record.status === "Approved" && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center justify-between text-emerald-900 dark:text-emerald-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-emerald-950 dark:text-white">
                  Electronics Design Approved by Engineering Board
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Downstream PCB Layout project{" "}
                  <span className="font-bold font-mono">PCB-2024-0017</span>{" "}
                  has been auto-created &amp; linked for routing.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => toast.info("Navigating to PCB Layout Design (PCB-2024-0017)...")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Proceed to PCB Layout
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        )}

        {/* ===========================================================================
            4. MAIN CONTENT AREA & STICKY SIDEBAR
            =========================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* MAIN CONTENT PANELS (COL-SPAN 3) */}
          <div className="lg:col-span-3 space-y-6">
            {/* -------------------------------------------------------------------
                PANEL 1: Electronics Design Overview
                ------------------------------------------------------------------- */}
            {shouldShowSection("overview") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-indigo-600" />
                    Electronics Design Overview
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
                      Product Category
                    </label>
                    <Input
                      value={formInput.productCategory}
                      onChange={(e) => handleFieldChange("productCategory", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Electronics Design Objective
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.electronicsDesignObjective}
                      onChange={(e) => handleFieldChange("electronicsDesignObjective", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Design Scope
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.designScope}
                      onChange={(e) => handleFieldChange("designScope", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Design Methodology
                    </label>
                    <Input
                      value={formInput.designMethodology}
                      onChange={(e) => handleFieldChange("designMethodology", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Applicable Standards
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.applicableStandards.map((std, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800 px-2.5 py-0.5 rounded text-xs font-bold shadow-2xs">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 2: System Architecture & Schematics
                ------------------------------------------------------------------- */}
            {shouldShowSection("system_architecture") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Electronic System Architecture &amp; Blocks
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.architectureStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">System Name</span>
                    <Input
                      value={formInput.systemName}
                      onChange={(e) => handleFieldChange("systemName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Board Architecture</span>
                    <Input
                      value={formInput.boardArchitecture}
                      onChange={(e) => handleFieldChange("boardArchitecture", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Signal Interfaces</span>
                    <Input
                      value={formInput.signalInterfaces}
                      onChange={(e) => handleFieldChange("signalInterfaces", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Functional Blocks</span>
                    <Input
                      value={formInput.functionalBlocks}
                      onChange={(e) => handleFieldChange("functionalBlocks", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Power Domains</span>
                    <Input
                      value={formInput.powerDomains}
                      onChange={(e) => handleFieldChange("powerDomains", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 3: Component Selection
                ------------------------------------------------------------------- */}
            {shouldShowSection("component_selection") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Box className="h-4 w-4 text-purple-600" />
                    Component Selection &amp; MCU Specifications
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Lifecycle: {formInput.lifecycleStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Microcontroller / MCU</span>
                    <Input
                      value={formInput.microcontrollerProcessor}
                      onChange={(e) => handleFieldChange("microcontrollerProcessor", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Memory Devices</span>
                    <Input
                      value={formInput.memoryDevices}
                      onChange={(e) => handleFieldChange("memoryDevices", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Power Management ICs</span>
                    <Input
                      value={formInput.powerDevices}
                      onChange={(e) => handleFieldChange("powerDevices", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Passive Components</span>
                    <Input
                      value={formInput.passiveComponents}
                      onChange={(e) => handleFieldChange("passiveComponents", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Sensors</span>
                    <Input
                      value={formInput.sensors}
                      onChange={(e) => handleFieldChange("sensors", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Communication Modules</span>
                    <Input
                      value={formInput.communicationModules}
                      onChange={(e) => handleFieldChange("communicationModules", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 4: Circuit Design & Schematics
                ------------------------------------------------------------------- */}
            {shouldShowSection("circuit_design") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    Circuit Design &amp; Operating Parameters
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Status: {formInput.circuitStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Circuit Name</span>
                    <Input
                      value={formInput.circuitName}
                      onChange={(e) => handleFieldChange("circuitName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Circuit Category</span>
                    <Input
                      value={formInput.circuitCategory}
                      onChange={(e) => handleFieldChange("circuitCategory", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Operating Frequency</span>
                    <Input
                      value={formInput.operatingFrequency}
                      onChange={(e) => handleFieldChange("operatingFrequency", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Input Voltage Range</span>
                    <Input
                      value={formInput.inputVoltage}
                      onChange={(e) => handleFieldChange("inputVoltage", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Output Voltages</span>
                    <Input
                      value={formInput.outputVoltage}
                      onChange={(e) => handleFieldChange("outputVoltage", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Current Rating</span>
                    <Input
                      value={formInput.currentRating}
                      onChange={(e) => handleFieldChange("currentRating", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 5: PCB Preparation
                ------------------------------------------------------------------- */}
            {shouldShowSection("pcb_preparation") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CircuitBoard className="h-4 w-4 text-blue-600" />
                    PCB Layout Preparation &amp; Stackup
                  </CardTitle>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-bold">
                    Readiness: {formInput.pcbReadinessScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">PCB Type</span>
                    <Input
                      value={formInput.pcbType}
                      onChange={(e) => handleFieldChange("pcbType", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Estimated Layer Count</span>
                    <Input
                      type="number"
                      value={formInput.estimatedLayerCount}
                      onChange={(e) => handleFieldChange("estimatedLayerCount", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Board Dimensions</span>
                    <Input
                      value={formInput.boardDimensions}
                      onChange={(e) => handleFieldChange("boardDimensions", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">High-Speed Signal Design</span>
                    <Input
                      value={formInput.highSpeedSignalDesign}
                      onChange={(e) => handleFieldChange("highSpeedSignalDesign", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Placement Strategy</span>
                    <Input
                      value={formInput.placementStrategy}
                      onChange={(e) => handleFieldChange("placementStrategy", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Thermal Management</span>
                    <Input
                      value={formInput.thermalManagement}
                      onChange={(e) => handleFieldChange("thermalManagement", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 6: Embedded Interfaces & Peripherals
                ------------------------------------------------------------------- */}
            {shouldShowSection("embedded_interfaces") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Radio className="h-4 w-4 text-blue-600" />
                    Embedded &amp; Peripheral Interfaces
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Interface Score: {formInput.hardwareInterfaceScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">GPIO Interfaces</span>
                    <Input
                      value={formInput.gpioInterfaces}
                      onChange={(e) => handleFieldChange("gpioInterfaces", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">ADC / DAC Interfaces</span>
                    <Input
                      value={formInput.adcDacInterfaces}
                      onChange={(e) => handleFieldChange("adcDacInterfaces", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">PWM Outputs</span>
                    <Input
                      value={formInput.pwmOutputs}
                      onChange={(e) => handleFieldChange("pwmOutputs", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Bus Interfaces</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.busInterfaces.map((bus, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
                          {bus}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 7: Signal Integrity & Reliability
                ------------------------------------------------------------------- */}
            {shouldShowSection("signal_integrity") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Signal Integrity &amp; System Reliability
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Reliability Score: {formInput.reliabilityScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Signal Integrity Analysis</span>
                    <Input
                      value={formInput.signalIntegrityAnalysis}
                      onChange={(e) => handleFieldChange("signalIntegrityAnalysis", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Power Integrity Analysis</span>
                    <Input
                      value={formInput.powerIntegrityAnalysis}
                      onChange={(e) => handleFieldChange("powerIntegrityAnalysis", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Clock Distribution</span>
                    <Input
                      value={formInput.clockDistribution}
                      onChange={(e) => handleFieldChange("clockDistribution", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Noise Reduction</span>
                    <Input
                      value={formInput.noiseReductionStrategy}
                      onChange={(e) => handleFieldChange("noiseReductionStrategy", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Reliability Target</span>
                    <Input
                      value={formInput.reliabilityTarget}
                      onChange={(e) => handleFieldChange("reliabilityTarget", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">MTBF Target</span>
                    <Input
                      value={formInput.mtbfTarget}
                      onChange={(e) => handleFieldChange("mtbfTarget", e.target.value)}
                      className="h-9 text-xs font-bold font-mono"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 8: Verification & Testing
                ------------------------------------------------------------------- */}
            {shouldShowSection("verification_testing") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    Electronics Verification &amp; Simulation
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Verification: {formInput.verificationScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  {formInput.verifications.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg flex justify-between items-center">
                      <span className="font-semibold text-foreground">{item.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold",
                          item.status === "Completed" || item.status === "Passed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 9: AI Assessment
                ------------------------------------------------------------------- */}
            {shouldShowSection("ai_assessment") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI Electronics Evaluation &amp; Optimization
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    AI Overall: {record.aiAssessment.aiOverallElectronicsScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Design Quality</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiDesignQualityScore}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Comp. Opt.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiComponentOptimization}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Circuit Review</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiCircuitReview}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Signal Integrity</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiSignalIntegrity}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Thermal Rec.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiThermalRecommendations}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Reliability Pred.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiReliabilityPrediction}/100</span>
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

                <CardContent className="pt-4 space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Architecture Readiness</span>
                      <span>{record.summary.architectureReadiness} / 100</span>
                    </div>
                    <Progress value={record.summary.architectureReadiness} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Circuit Readiness</span>
                      <span>{record.summary.circuitReadiness} / 100</span>
                    </div>
                    <Progress value={record.summary.circuitReadiness} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Hardware Interface Score</span>
                      <span>{record.summary.hardwareInterfaceScore} / 100</span>
                    </div>
                    <Progress value={record.summary.hardwareInterfaceScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Reliability Score</span>
                      <span>{record.summary.reliabilityScore} / 100</span>
                    </div>
                    <Progress value={record.summary.reliabilityScore} className="h-2" />
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center font-bold text-foreground">
                    <span>Overall Electronics Design Score</span>
                    <span className="text-base text-indigo-600">{record.summary.overallElectronicsDesignScore} / 100</span>
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
                    Attachments &amp; Technical Documents
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
                    Electronics Design Review Board
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
                        onChange={(e) => handleFieldChange("approvalDecision", e.target.value as ElectronicsDesignApprovalDecision)}
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
                        placeholder="Enter electronics review board comments..."
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
                    <span className="font-bold text-foreground">{record.electronicsEngineerName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created Date</span>
                    <span className="font-medium text-muted-foreground">{record.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified By</span>
                    <span className="font-bold text-foreground">{record.electronicsEngineerName}</span>
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
                    View Audit Trail &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setSystemLogModalOpen(true)}
                    className="text-xs font-bold text-primary hover:underline text-left cursor-pointer"
                  >
                    View Activity History &rarr;
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ===========================================================================
              RIGHT SIDEBAR PANEL (STICKY ON SCROLL)
              =========================================================================== */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-6 space-y-6">
              {/* Overall Score Gauge Box */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-2 border-b border-border text-center">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Overall Electronics Design Score
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-5 flex flex-col items-center">
                  <CircularScoreGauge
                    score={record.summary.overallElectronicsDesignScore}
                  />

                  <div className="w-full mt-5 space-y-2 border-t border-border pt-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Architecture Readiness</span>
                      <span className="font-bold text-foreground">{record.summary.architectureReadiness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Circuit Readiness</span>
                      <span className="font-bold text-foreground">{record.summary.circuitReadiness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Hardware Interface</span>
                      <span className="font-bold text-foreground">{record.summary.hardwareInterfaceScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Reliability</span>
                      <span className="font-bold text-foreground">{record.summary.reliabilityScore}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border font-bold text-indigo-600 dark:text-indigo-400">
                      <span>Overall Score</span>
                      <span>{record.summary.overallElectronicsDesignScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Highlights Card */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-2 border-b border-border">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    Key Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {record.keyHighlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
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
                Electronics Design Engineering Report
              </DialogTitle>
              <DialogDescription>
                Generated executive summary report for record {record.designId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground block">{record.designProjectName}</span>
                <p className="text-muted-foreground leading-relaxed">
                  Covers MCU ARM Cortex-M7 controller, 6-layer PCB stackup, 500 MHz signal integrity, MTBF target (&gt;100,000 hrs), and IPC-A-610 compliance.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold">
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Overall Design Score: {record.summary.overallElectronicsDesignScore}/100</div>
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Design Version: {record.designVersion}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => { toast.success("Downloaded Electronics_Design_Report.pdf"); setReportModalOpen(false); }}>
                <Download className="h-4 w-4 mr-1.5" /> Download PDF Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PCB Spec Modal */}
        <Dialog open={renderModalOpen} onOpenChange={setRenderModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-600" />
                Product / PCB Controller Layout Spec
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Cpu className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Main Controller PCB Master Layout</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                Production-intent 6-layer high-density PCB layout with matched differential pairs and controlled impedance routing.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenderModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Architecture Modal */}
        <Dialog open={diagramModalOpen} onOpenChange={setDiagramModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Electronic System Architecture Block Diagram
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Layers className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Electronic Architecture Topology</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                System block hierarchy mapping power conversion rails, CAN/Ethernet communications PHYs, MCU sub-assemblies, and safety lockouts.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDiagramModalOpen(false)}>Close</Button>
            </DialogFooter>
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
