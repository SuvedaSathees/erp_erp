// Product Architecture Form - Magnertia ERP
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
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
  QrCode,
  Radio,
  Package,
  CircuitBoard,
  Microscope,
  ShieldAlert,
  Cpu,
  Zap,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import {
  ProductArchitectureTabBar,
  type ProductArchitectureTabId,
} from "@/components/erp/ProductArchitectureTabBar";
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
import { productArchitectureService } from "@/services";
import type {
  ProductArchitectureApprovalDecision,
  ProductArchitectureFormInput,
  ProductArchitectureRecord,
  ProductArchitectureStage,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/product-architecture/new",
)({
  head: () => ({
    meta: [{ title: "Product Architecture · Magnertia ERP" }],
  }),
  component: ProductArchitectureNewPage,
});

export function ProductArchitectureFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ProductArchitectureNewPage {...props} />;
}

export function ProductArchitecturePage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ProductArchitectureNewPage {...props} />;
}

export function ProductArchitectureDevelopmentNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ProductArchitectureNewPage {...props} />;
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
   Main Product Architecture Page Component
   =========================================================================== */
export function ProductArchitectureNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ProductArchitectureTabId>("overview");

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [diagramModalOpen, setDiagramModalOpen] = useState(false);
  const [systemLogModalOpen, setSystemLogModalOpen] = useState(false);

  // Fetch record
  const { data: record, isLoading } = useQuery({
    queryKey: ["product-architecture-record"],
    queryFn: () => productArchitectureService.fetchRecord(),
  });

  // Local Form state
  const [formInput, setFormInput] = useState<ProductArchitectureFormInput | null>(null);

  if (record && !formInput) {
    setFormInput(record.input);
  }

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ProductArchitectureFormInput>) =>
      productArchitectureService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["product-architecture-record"], updated);
      toast.success("Draft saved successfully!", {
        description: "Product architecture configurations updated.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save draft"),
  });

  const submitMutation = useMutation({
    mutationFn: () => productArchitectureService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["product-architecture-record"], updated);
      toast.success("Submitted for Architecture Review!", {
        description: "Project moved to Executive Review Board.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      decision: ProductArchitectureApprovalDecision;
      comments?: string;
    }) => productArchitectureService.reviewDecision({ id: record!.id, ...args }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["product-architecture-record"], updated);
      if (variables.decision === "approved") {
        toast.success(
          "Product Architecture Approved! Downstream System Design SYS-2024-0012 linked."
        );
      } else {
        toast.info(`Review Decision updated to '${variables.decision}'.`);
      }
    },
    onError: (err: Error) => toast.error(err.message || "Decision submission failed"),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: ProductArchitectureStage) =>
      productArchitectureService.advanceStage(record!.id, targetStage),
    onSuccess: (updated) => {
      queryClient.setQueryData(["product-architecture-record"], updated);
      toast.success("Advanced workflow stage successfully!");
    },
  });

  if (isLoading || !record || !formInput) {
    return (
      <AppShell
        title="Product Architecture"
        breadcrumb={breadcrumb ?? "Development > Product Development > Product Architecture"}
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

  const handleFieldChange = (field: keyof ProductArchitectureFormInput, value: any) => {
    setFormInput((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const shouldShowSection = (tabKey: ProductArchitectureTabId) => {
    return activeTab === "overview" || activeTab === tabKey;
  };

  return (
    <AppShell
      title="Product Architecture"
      breadcrumb={breadcrumb ?? "Development > Product Development > Product Architecture"}
      description="Define holistic system blocks, hardware processors, firmware stacks, communication protocols, and cloud pipelines."
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
                <Layers className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {record.architectureName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5"
                >
                  {record.architectureVersion}
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
                  <DropdownMenuItem onClick={() => setDiagramModalOpen(true)}>
                    <Layers className="h-4 w-4 mr-2 text-indigo-500" />
                    View Architecture Blueprint
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setReportModalOpen(true)}>
                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
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
                  ARCHITECTURE ID
                </span>
                <span className="font-bold font-mono text-foreground">
                  {record.architectureId}
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
                  LINKED ROADMAP
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/product-roadmap/new" as any,
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedRoadmapName}
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
                SYSTEM ARCHITECT:
              </span>
              <span className="font-semibold text-foreground">
                {record.systemArchitectName}
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
                  Product Architecture Approved by Executive Review Board
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Downstream System Design project{" "}
                  <span className="font-bold font-mono">SYS-2024-0012</span>{" "}
                  has been auto-created &amp; linked for cross-functional engineering.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => toast.info("Navigating to System Design (SYS-2024-0012)...")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Proceed to System Design
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
                PANEL 1: Product Architecture Overview
                ------------------------------------------------------------------- */}
            {shouldShowSection("overview") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    Product Architecture Overview
                  </CardTitle>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-semibold">
                    Style: {formInput.architectureStyle}
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
                      Architecture Style
                    </label>
                    <Input
                      value={formInput.architectureStyle}
                      onChange={(e) => handleFieldChange("architectureStyle", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Architecture Vision
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.architectureVision}
                      onChange={(e) => handleFieldChange("architectureVision", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Architecture Objective
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.architectureObjective}
                      onChange={(e) => handleFieldChange("architectureObjective", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Architecture Scope
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.architectureScope}
                      onChange={(e) => handleFieldChange("architectureScope", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Design Principles
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.designPrinciples.map((principle, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-800 border border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800 px-2.5 py-0.5 rounded text-xs font-bold shadow-2xs">
                          {principle}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 2: System Architecture
                ------------------------------------------------------------------- */}
            {shouldShowSection("system_architecture") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Server className="h-4 w-4 text-blue-600" />
                    System Architecture &amp; Subsystems
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.architectureStatusBadge}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">System Name</span>
                    <Input
                      value={formInput.systemName}
                      onChange={(e) => handleFieldChange("systemName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Architecture Status</span>
                    <Input
                      value={formInput.architectureStatusBadge}
                      onChange={(e) => handleFieldChange("architectureStatusBadge", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">System Components</span>
                    <Input
                      value={formInput.systemComponents}
                      onChange={(e) => handleFieldChange("systemComponents", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Subsystems</span>
                    <Input
                      value={formInput.subsystems}
                      onChange={(e) => handleFieldChange("subsystems", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">External Interfaces</span>
                    <Input
                      value={formInput.externalInterfaces}
                      onChange={(e) => handleFieldChange("externalInterfaces", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Internal Interfaces</span>
                    <Input
                      value={formInput.internalInterfaces}
                      onChange={(e) => handleFieldChange("internalInterfaces", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 3: Hardware Architecture
                ------------------------------------------------------------------- */}
            {shouldShowSection("hardware_architecture") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-600" />
                    Hardware Platform &amp; Processing Unit
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    MCU &amp; Power Electronics
                  </span>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Hardware Platform</span>
                    <Input
                      value={formInput.hardwarePlatform}
                      onChange={(e) => handleFieldChange("hardwarePlatform", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Processing Unit</span>
                    <Input
                      value={formInput.processingUnit}
                      onChange={(e) => handleFieldChange("processingUnit", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Power Electronics</span>
                    <Input
                      value={formInput.powerElectronics}
                      onChange={(e) => handleFieldChange("powerElectronics", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Sensors</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.sensors.map((sensor, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">
                          {sensor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Actuators</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.actuators.map((actuator, i) => (
                        <span key={i} className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-bold">
                          {actuator}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Communication Interfaces</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.communicationInterfaces.map((iface, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                          {iface}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Hardware Constraints</span>
                    <Input
                      value={formInput.hardwareConstraints}
                      onChange={(e) => handleFieldChange("hardwareConstraints", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 4: Software Architecture
                ------------------------------------------------------------------- */}
            {shouldShowSection("software_architecture") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <FileCode className="h-4 w-4 text-blue-600" />
                    Software Platform, Middleware &amp; APIs
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Embedded OS &amp; Application Stack
                  </span>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Software Platform</span>
                    <Input
                      value={formInput.softwarePlatform}
                      onChange={(e) => handleFieldChange("softwarePlatform", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Operating System</span>
                    <Input
                      value={formInput.operatingSystem}
                      onChange={(e) => handleFieldChange("operatingSystem", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Middleware</span>
                    <Input
                      value={formInput.middleware}
                      onChange={(e) => handleFieldChange("middleware", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Firmware Components</span>
                    <Input
                      value={formInput.firmwareComponents}
                      onChange={(e) => handleFieldChange("firmwareComponents", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Application Modules</span>
                    <Input
                      value={formInput.applicationModules}
                      onChange={(e) => handleFieldChange("applicationModules", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">APIs &amp; Services</span>
                    <Input
                      value={formInput.apisAndServices}
                      onChange={(e) => handleFieldChange("apisAndServices", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Software Constraints</span>
                    <Input
                      value={formInput.softwareConstraints}
                      onChange={(e) => handleFieldChange("softwareConstraints", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 5: Data & Communication
                ------------------------------------------------------------------- */}
            {shouldShowSection("data_communication") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Database className="h-4 w-4 text-emerald-600" />
                    Data Flow, Protocols &amp; Cloud Integration
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Edge Mode: Active
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Data Flow Pipeline</span>
                    <Input
                      value={formInput.dataFlow}
                      onChange={(e) => handleFieldChange("dataFlow", e.target.value)}
                      className="h-9 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Database Technology</span>
                    <Input
                      value={formInput.databaseTechnology}
                      onChange={(e) => handleFieldChange("databaseTechnology", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Cloud Integration</span>
                    <Input
                      value={formInput.cloudIntegration}
                      onChange={(e) => handleFieldChange("cloudIntegration", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Communication Protocols</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.communicationProtocols.map((proto, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
                          {proto}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 6: Integration & Interoperability
                ------------------------------------------------------------------- */}
            {shouldShowSection("integration") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <GitBranch className="h-4 w-4 text-blue-600" />
                    Integration &amp; Interoperability
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    ERP, Gateway &amp; Third Parties
                  </span>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">External Systems</span>
                    <Input
                      value={formInput.externalSystems}
                      onChange={(e) => handleFieldChange("externalSystems", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">ERP Integration</span>
                    <Input
                      value={formInput.erpIntegration}
                      onChange={(e) => handleFieldChange("erpIntegration", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">API Gateway</span>
                    <Input
                      value={formInput.apiGateway}
                      onChange={(e) => handleFieldChange("apiGateway", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Standards Compliance</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.standardsCompliance.map((std, i) => (
                        <span key={i} className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 7: Security & Compliance
                ------------------------------------------------------------------- */}
            {shouldShowSection("security_compliance") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    Security &amp; Compliance Architecture
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Security Score: {formInput.securityRiskScore}%
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Security Architecture</span>
                    <Input
                      value={formInput.securityArchitecture}
                      onChange={(e) => handleFieldChange("securityArchitecture", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

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
                      className="h-9 text-xs font-bold font-mono"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Cybersecurity Controls</span>
                    <Input
                      value={formInput.cybersecurityControls}
                      onChange={(e) => handleFieldChange("cybersecurityControls", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 8: Performance & Scalability
                ------------------------------------------------------------------- */}
            {shouldShowSection("performance") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Scalability &amp; Performance Targets
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
                    Performance Score: {formInput.performanceScore}%
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Expected Devices</span>
                    <Input
                      value={formInput.expectedUsersDevices}
                      onChange={(e) => handleFieldChange("expectedUsersDevices", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Throughput Target</span>
                    <Input
                      value={formInput.throughput}
                      onChange={(e) => handleFieldChange("throughput", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Latency Target</span>
                    <Input
                      value={formInput.latencyTarget}
                      onChange={(e) => handleFieldChange("latencyTarget", e.target.value)}
                      className="h-9 text-xs font-bold font-mono"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Availability Target</span>
                    <Input
                      value={formInput.availabilityTarget}
                      onChange={(e) => handleFieldChange("availabilityTarget", e.target.value)}
                      className="h-9 text-xs font-bold text-emerald-600 font-mono"
                    />
                  </div>
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
                    AI Architecture Evaluation &amp; Optimization
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    AI Overall: {record.aiAssessment.aiOverallScore}%
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                      <span className="text-[10px] text-muted-foreground block font-semibold">AI Quality</span>
                      <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiQualityScore}%</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                      <span className="text-[10px] text-muted-foreground block font-semibold">AI Scalability</span>
                      <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiScalabilityScore}%</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                      <span className="text-[10px] text-muted-foreground block font-semibold">AI Security</span>
                      <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiSecurityScore}%</span>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-lg space-y-1">
                    <span className="font-bold text-foreground block">Key AI Recommendation</span>
                    <p className="text-muted-foreground text-xs leading-relaxed">{record.aiAssessment.aiRecommendations}</p>
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
                    Recommendation: Proceed to System Design
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 flex flex-col md:flex-row items-center gap-6 text-xs">
                  <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-border">
                    <CircularScoreGauge score={record.summary.overallArchitectureScore} />
                    <span className="text-[11px] font-bold text-muted-foreground mt-2 uppercase tracking-wide">Overall Architecture Score</span>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Functional Coverage</span>
                        <span>{record.summary.functionalCoverage}%</span>
                      </div>
                      <Progress value={record.summary.functionalCoverage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Technical Readiness</span>
                        <span>{record.summary.technicalReadiness}%</span>
                      </div>
                      <Progress value={record.summary.technicalReadiness} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Security Readiness</span>
                        <span>{record.summary.securityReadiness}%</span>
                      </div>
                      <Progress value={record.summary.securityReadiness} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Integration Readiness</span>
                        <span>{record.summary.integrationReadiness}%</span>
                      </div>
                      <Progress value={record.summary.integrationReadiness} className="h-2" />
                    </div>
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
                    Attachments &amp; Documentation
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
                    Review &amp; Approval Board
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Architecture Review Board
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
                        onChange={(e) => handleFieldChange("approvalDecision", e.target.value as ProductArchitectureApprovalDecision)}
                        className="w-full rounded-lg border border-input bg-white dark:bg-slate-900 p-2 font-semibold text-foreground text-xs"
                      >
                        <option value="">Select Decision</option>
                        <option value="approved">Approved</option>
                        <option value="approved_with_conditions">Approved with Conditions</option>
                        <option value="revision_required">Revision Required</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold text-muted-foreground mb-1">
                        <label>Review Comments</label>
                        <span>{(formInput.reviewComments || "").length}/500</span>
                      </div>
                      <Textarea
                        rows={3}
                        maxLength={500}
                        value={formInput.reviewComments || ""}
                        onChange={(e) => handleFieldChange("reviewComments", e.target.value)}
                        placeholder="Provide architectural feedback or approval conditions..."
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
                    <span className="font-bold text-foreground">{record.systemArchitectName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created Date</span>
                    <span className="font-medium text-muted-foreground">{record.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified By</span>
                    <span className="font-bold text-foreground">{record.systemArchitectName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified Date</span>
                    <span className="font-medium text-muted-foreground">{record.lastUpdated}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Workflow Stage</span>
                    <Badge variant="outline" className="text-[11px] font-semibold">{record.currentStageLabel}</Badge>
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
                Product Architecture Executive Report
              </DialogTitle>
              <DialogDescription>
                Generated executive summary report for record {record.architectureId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground block">{record.architectureName}</span>
                <p className="text-muted-foreground leading-relaxed">
                  Covers microservices architecture, ARM Cortex STM32H7 processing unit, Yocto Linux OS, MQTT and OCPP 1.6J communication, and defense-in-depth security.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold">
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Overall Architecture Score: {record.summary.overallArchitectureScore}%</div>
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Architecture Version: {record.architectureVersion}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => { toast.success("Downloaded Product_Architecture_Report.pdf"); setReportModalOpen(false); }}>
                <Download className="h-4 w-4 mr-1.5" /> Download PDF Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Blueprint Diagram Modal */}
        <Dialog open={diagramModalOpen} onOpenChange={setDiagramModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                System Architecture Functional Blueprint
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                <Layers className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Microservices System Topology</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                Edge Charging Unit → CAN/Ethernet Gateway → AWS IoT Core → Microservices Cluster → Kong API Gateway → Client Apps.
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
              {record.auditTrail.map((log) => (
                <div key={log.id} className="p-3 border border-border rounded-lg bg-slate-50 dark:bg-slate-800 space-y-1">
                  <div className="flex justify-between font-bold text-foreground">
                    <span>{log.user}</span>
                    <span className="text-muted-foreground font-normal">{log.timestamp}</span>
                  </div>
                  <p className="text-muted-foreground">{log.action}: {log.details}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
