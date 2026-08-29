// Electrical Design Form - Magnertia ERP
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Zap,
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
  Palette,
  QrCode,
  Radio,
  Package,
  CircuitBoard,
  Microscope,
  ShieldAlert,
  Power,
  Cable,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import {
  ElectricalDesignTabBar,
  type ElectricalDesignTabId,
} from "@/components/erp/ElectricalDesignTabBar";
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
import { electricalDesignService } from "@/services";
import type {
  ElectricalDesignApprovalDecision,
  ElectricalDesignFormInput,
  ElectricalDesignRecord,
  ElectricalDesignStage,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/electrical-design/new",
)({
  head: () => ({
    meta: [{ title: "Electrical Design · Magnertia ERP" }],
  }),
  component: ElectricalDesignNewPage,
});

export function ElectricalDesignFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ElectricalDesignNewPage {...props} />;
}

export function ElectricalDesignPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ElectricalDesignNewPage {...props} />;
}

export function ElectricalDesignDevelopmentNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ElectricalDesignNewPage {...props} />;
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

  let scoreColor = "text-amber-500 stroke-amber-500 dark:text-amber-400 dark:stroke-amber-400";
  if (score < 60) scoreColor = "text-amber-600 stroke-amber-600";
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
   Main Electrical Design Page Component
   =========================================================================== */
export function ElectricalDesignNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ElectricalDesignTabId>("overview");

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [diagramModalOpen, setDiagramModalOpen] = useState(false);
  const [renderModalOpen, setRenderModalOpen] = useState(false);
  const [systemLogModalOpen, setSystemLogModalOpen] = useState(false);

  // Fetch record
  const { data: record, isLoading } = useQuery({
    queryKey: ["electrical-design-record"],
    queryFn: () => electricalDesignService.fetchRecord(),
  });

  // Local Form state
  const [formInput, setFormInput] = useState<ElectricalDesignFormInput | null>(null);

  if (record && !formInput) {
    setFormInput(record.input);
  }

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ElectricalDesignFormInput>) =>
      electricalDesignService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["electrical-design-record"], updated);
      toast.success("Draft saved successfully!", {
        description: "Electrical design configurations updated.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save draft"),
  });

  const submitMutation = useMutation({
    mutationFn: () => electricalDesignService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["electrical-design-record"], updated);
      toast.success("Submitted for Architecture Review!", {
        description: "Project moved to Stage 4 Engineering Review.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      decision: ElectricalDesignApprovalDecision;
      comments?: string;
    }) => electricalDesignService.reviewDecision({ id: record!.id, ...args }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["electrical-design-record"], updated);
      if (variables.decision === "Approved") {
        toast.success(
          "Electrical Design Approved! Downstream Prototype Manufacturing project PM-2024-0089 created."
        );
      } else {
        toast.info(`Review Decision updated to '${variables.decision}'.`);
      }
    },
    onError: (err: Error) => toast.error(err.message || "Decision submission failed"),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: ElectricalDesignStage) =>
      electricalDesignService.advanceStage(record!.id, targetStage),
    onSuccess: (updated) => {
      queryClient.setQueryData(["electrical-design-record"], updated);
      toast.success("Advanced workflow stage successfully!");
    },
  });

  if (isLoading || !record || !formInput) {
    return (
      <AppShell
        title="Electrical Design"
        breadcrumb={breadcrumb ?? "Development > Product Development > Electrical Design"}
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

  const handleFieldChange = (field: keyof ElectricalDesignFormInput, value: any) => {
    setFormInput((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const shouldShowSection = (tabKey: ElectricalDesignTabId) => {
    return activeTab === "overview" || activeTab === tabKey;
  };

  return (
    <AppShell
      title="Electrical Design"
      breadcrumb={breadcrumb ?? "Development > Product Development > Electrical Design"}
      description="Engineer power electronic systems, AC/DC conversion topologies, wiring harnesses, safety earthing, and EMC filters."
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
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 flex items-center justify-center font-bold shrink-0 border border-amber-200/50 dark:border-amber-800/50">
                <Zap className="h-5 w-5" />
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
                    <Zap className="h-4 w-4 mr-2 text-amber-500" />
                    Inspect CAD Spec
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDiagramModalOpen(true)}>
                    <Layers className="h-4 w-4 mr-2 text-blue-500" />
                    View Single-Line Diagram
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
                  ELECTRICAL DEV ID
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
                  LINKED MECHANICAL
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/mechanical-design/new" as any,
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedMechanicalDesignId}
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
                ELECTRICAL ENGINEER:
              </span>
              <span className="font-semibold text-foreground">
                {record.electricalEngineerName}
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
                  Electrical Design Approved by Engineering Board
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Downstream Prototype Manufacturing project{" "}
                  <span className="font-bold font-mono">PM-2024-0089</span>{" "}
                  has been auto-created &amp; linked for board assembly.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => toast.info("Navigating to Prototype Manufacturing...")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Proceed to Manufacturing
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
                PANEL 1: Electrical Design Overview
                ------------------------------------------------------------------- */}
            {shouldShowSection("overview") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-600" />
                    Electrical Design Overview
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.designStatus}
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
                      Electrical Design Objective
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.electricalDesignObjective}
                      onChange={(e) => handleFieldChange("electricalDesignObjective", e.target.value)}
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
                        <span key={i} className="bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 px-2.5 py-0.5 rounded text-xs font-bold shadow-2xs">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 2: Electrical Architecture
                ------------------------------------------------------------------- */}
            {shouldShowSection("architecture") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    Electrical System Architecture &amp; Single-Line Topology
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Status: {formInput.architectureStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Architecture Name</span>
                    <Input
                      value={formInput.electricalArchitectureName}
                      onChange={(e) => handleFieldChange("electricalArchitectureName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">System Voltage</span>
                    <Input
                      value={formInput.systemVoltage}
                      onChange={(e) => handleFieldChange("systemVoltage", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Power Rating</span>
                    <Input
                      value={formInput.powerRating}
                      onChange={(e) => handleFieldChange("powerRating", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">AC/DC Configuration</span>
                    <Input
                      value={formInput.acDcConfiguration}
                      onChange={(e) => handleFieldChange("acDcConfiguration", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Distribution Topology</span>
                    <Input
                      value={formInput.powerDistributionTopology}
                      onChange={(e) => handleFieldChange("powerDistributionTopology", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Electrical Interfaces</span>
                    <Input
                      value={formInput.electricalInterfaces}
                      onChange={(e) => handleFieldChange("electricalInterfaces", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 3: Power System Design
                ------------------------------------------------------------------- */}
            {shouldShowSection("power_system") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Power className="h-4 w-4 text-amber-600" />
                    Power System Design &amp; Converters
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Target Efficiency: {formInput.powerEfficiencyTarget}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Power Source</span>
                    <Input
                      value={formInput.powerSource}
                      onChange={(e) => handleFieldChange("powerSource", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Power Supply Topology</span>
                    <Input
                      value={formInput.powerSupplyDesign}
                      onChange={(e) => handleFieldChange("powerSupplyDesign", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Converter Type</span>
                    <Input
                      value={formInput.converterType}
                      onChange={(e) => handleFieldChange("converterType", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Inverter Specification</span>
                    <Input
                      value={formInput.inverterSpecification}
                      onChange={(e) => handleFieldChange("inverterSpecification", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Transformer Specification</span>
                    <Input
                      value={formInput.transformerCoilSpecification}
                      onChange={(e) => handleFieldChange("transformerCoilSpecification", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Thermal Load</span>
                    <Input
                      value={formInput.thermalLoad}
                      onChange={(e) => handleFieldChange("thermalLoad", e.target.value)}
                      className="h-9 text-xs font-mono font-semibold"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 4: Circuit & PCB Design
                ------------------------------------------------------------------- */}
            {shouldShowSection("circuit_pcb") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CircuitBoard className="h-4 w-4 text-blue-600" />
                    Circuit &amp; Power PCB Layout
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
                    PCB Status: {formInput.pcbStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">PCB Name</span>
                    <Input
                      value={formInput.pcbName}
                      onChange={(e) => handleFieldChange("pcbName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">PCB Revision</span>
                    <Input
                      value={formInput.pcbRevision}
                      onChange={(e) => handleFieldChange("pcbRevision", e.target.value)}
                      className="h-9 text-xs font-mono font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">PCB Layer Count</span>
                    <Input
                      type="number"
                      value={formInput.pcbLayerCount}
                      onChange={(e) => handleFieldChange("pcbLayerCount", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Major Components</span>
                    <Input
                      value={formInput.majorComponents}
                      onChange={(e) => handleFieldChange("majorComponents", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Connector Types</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.connectorTypes.map((conn, i) => (
                        <span key={i} className="bg-white dark:bg-slate-700 border border-border px-2.5 py-0.5 rounded text-[11px] font-bold text-foreground">
                          {conn}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 5: Wiring & Harness Design
                ------------------------------------------------------------------- */}
            {shouldShowSection("wiring_harness") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Cable className="h-4 w-4 text-purple-600" />
                    Wiring Harness &amp; Cable Assembly
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Harness: {formInput.harnessStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Harness Name</span>
                    <Input
                      value={formInput.harnessName}
                      onChange={(e) => handleFieldChange("harnessName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Cable Type</span>
                    <Input
                      value={formInput.cableType}
                      onChange={(e) => handleFieldChange("cableType", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Wire Gauge</span>
                    <Input
                      value={formInput.wireGauge}
                      onChange={(e) => handleFieldChange("wireGauge", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Connector Standard</span>
                    <Input
                      value={formInput.connectorStandard}
                      onChange={(e) => handleFieldChange("connectorStandard", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Routing Description</span>
                    <Input
                      value={formInput.routingDescription}
                      onChange={(e) => handleFieldChange("routingDescription", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 6: Protection & Safety
                ------------------------------------------------------------------- */}
            {shouldShowSection("protection_safety") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Electrical Protection &amp; Safety Systems
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Safety Score: {formInput.electricalSafetyScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Fuse Specification</span>
                    <Input
                      value={formInput.fuseSpecification}
                      onChange={(e) => handleFieldChange("fuseSpecification", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Circuit Breaker</span>
                    <Input
                      value={formInput.circuitBreaker}
                      onChange={(e) => handleFieldChange("circuitBreaker", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Isolation Method</span>
                    <Input
                      value={formInput.isolationMethod}
                      onChange={(e) => handleFieldChange("isolationMethod", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Earthing Method</span>
                    <Input
                      value={formInput.earthingMethod}
                      onChange={(e) => handleFieldChange("earthingMethod", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Surge Protection</span>
                    <Input
                      value={formInput.surgeProtection}
                      onChange={(e) => handleFieldChange("surgeProtection", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Functional Safety</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.functionalSafetyStandard.map((std, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[11px] font-bold">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 7: EMC / EMI & Compliance
                ------------------------------------------------------------------- */}
            {shouldShowSection("emc_emi") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Radio className="h-4 w-4 text-blue-600" />
                    EMC / EMI Mitigation &amp; Standards Compliance
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Compliance: {formInput.complianceScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">EMI Mitigation Strategy</span>
                    <Input
                      value={formInput.emiMitigationStrategy}
                      onChange={(e) => handleFieldChange("emiMitigationStrategy", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Shielding Method</span>
                    <Input
                      value={formInput.shieldingMethod}
                      onChange={(e) => handleFieldChange("shieldingMethod", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Grounding Strategy</span>
                    <Input
                      value={formInput.groundingStrategy}
                      onChange={(e) => handleFieldChange("groundingStrategy", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Test Plan</span>
                    <Input
                      value={formInput.testPlan}
                      onChange={(e) => handleFieldChange("testPlan", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">EMC Standards</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.emcStandard.map((std, i) => (
                        <span key={i} className="bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded text-[11px] font-bold">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 8: Simulation & Validation
                ------------------------------------------------------------------- */}
            {shouldShowSection("simulation_validation") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Simulation &amp; HIL Validation
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Validation: {formInput.validationScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {formInput.simulations.map((sim) => (
                    <div key={sim.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg flex justify-between items-center">
                      <span className="font-semibold text-foreground">{sim.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold",
                          sim.status === "Completed" || sim.status === "Passed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        )}
                      >
                        {sim.status}
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
                    AI Electrical Evaluation &amp; Optimization
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    AI Overall: {record.aiAssessment.aiOverallElectricalScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Design Quality</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiDesignQualityScore}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Power Opt.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiPowerOptimization}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Circuit Review</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiCircuitReview}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Thermal Assmt.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiThermalAssessment}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">EMC Rec.</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiEmcRecommendations}/100</span>
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
                      <span>Power System Readiness</span>
                      <span>{record.summary.powerSystemReadiness} / 100</span>
                    </div>
                    <Progress value={record.summary.powerSystemReadiness} className="h-2" />
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
                      <span>Electrical Safety Score</span>
                      <span>{record.summary.electricalSafetyScore} / 100</span>
                    </div>
                    <Progress value={record.summary.electricalSafetyScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Compliance Score</span>
                      <span>{record.summary.complianceScore} / 100</span>
                    </div>
                    <Progress value={record.summary.complianceScore} className="h-2" />
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center font-bold text-foreground">
                    <span>Overall Electrical Design Score</span>
                    <span className="text-base text-amber-600">{record.summary.overallElectricalDesignScore} / 100</span>
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
                    Electrical Design Review Board
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
                        onChange={(e) => handleFieldChange("approvalDecision", e.target.value as ElectricalDesignApprovalDecision)}
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
                        placeholder="Enter electrical review board comments..."
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
                    <span className="font-bold text-foreground">{record.electricalEngineerName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created Date</span>
                    <span className="font-medium text-muted-foreground">{record.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified By</span>
                    <span className="font-bold text-foreground">{record.electricalEngineerName}</span>
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
                    Overall Electrical Design Score
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-5 flex flex-col items-center">
                  <CircularScoreGauge
                    score={record.summary.overallElectricalDesignScore}
                  />

                  <div className="w-full mt-5 space-y-2 border-t border-border pt-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Power System Readiness</span>
                      <span className="font-bold text-foreground">{record.summary.powerSystemReadiness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Circuit Readiness</span>
                      <span className="font-bold text-foreground">{record.summary.circuitReadiness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Electrical Safety</span>
                      <span className="font-bold text-foreground">{record.summary.electricalSafetyScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Compliance</span>
                      <span className="font-bold text-foreground">{record.summary.complianceScore}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border font-bold text-amber-600 dark:text-amber-400">
                      <span>Overall Score</span>
                      <span>{record.summary.overallElectricalDesignScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Highlights Card */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-2 border-b border-border">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600" />
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
                Electrical Design Engineering Report
              </DialogTitle>
              <DialogDescription>
                Generated executive summary report for record {record.designId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground block">{record.designProjectName}</span>
                <p className="text-muted-foreground leading-relaxed">
                  Covers 400 VAC 3-phase 22 kW AC/DC power system, 6-layer power PCB, XT60 wire harness, Type 2 SPD surge protection, and IEC 61000 EMC compliance.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold">
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Overall Design Score: {record.summary.overallElectricalDesignScore}/100</div>
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Design Version: {record.designVersion}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => { toast.success("Downloaded Electrical_Design_Report.pdf"); setReportModalOpen(false); }}>
                <Download className="h-4 w-4 mr-1.5" /> Download PDF Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* CAD Render Modal */}
        <Dialog open={renderModalOpen} onOpenChange={setRenderModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-600" />
                Electrical Power Enclosure &amp; CAD Model Spec
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">480V 3-Phase IP65 Rated Assembly</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                High-voltage isolation barrier, convection cooling ducts, DIN-rail terminal blocks, and internal SPD lightning suppressors.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRenderModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Single-Line Diagram Modal */}
        <Dialog open={diagramModalOpen} onOpenChange={setDiagramModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                Single-Line Power Diagram
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Layers className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Power Distribution Single-Line</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                400 VAC 3-Phase Main Feed → 125A MCCB → EMI Filter → PFC Stage → LLC DC-DC Stage → Isolated DC Output.
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
