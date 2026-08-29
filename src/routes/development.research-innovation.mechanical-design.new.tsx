// Mechanical Design Form - Magnertia ERP
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Wrench,
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
  Cog,
  Ruler,
  Weight,
  PenTool,
  Factory,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import {
  MechanicalDesignTabBar,
  type MechanicalDesignTabId,
} from "@/components/erp/MechanicalDesignTabBar";
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
import { mechanicalDesignService } from "@/services";
import type {
  MechanicalDesignApprovalDecision,
  MechanicalDesignFormInput,
  MechanicalDesignRecord,
  MechanicalDesignStage,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/mechanical-design/new",
)({
  head: () => ({
    meta: [{ title: "Mechanical Design · Magnertia ERP" }],
  }),
  component: MechanicalDesignNewPage,
});

export function MechanicalDesignFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <MechanicalDesignNewPage {...props} />;
}

export function MechanicalDesignPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <MechanicalDesignNewPage {...props} />;
}

export function MechanicalDesignDevelopmentNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <MechanicalDesignNewPage {...props} />;
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
   Main Mechanical Design Page Component
   =========================================================================== */
export function MechanicalDesignNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<MechanicalDesignTabId>("overview");

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [cadModelModalOpen, setCadModelModalOpen] = useState(false);
  const [feaStressModalOpen, setFeaStressModalOpen] = useState(false);
  const [systemLogModalOpen, setSystemLogModalOpen] = useState(false);

  // Fetch record
  const { data: record, isLoading } = useQuery({
    queryKey: ["mechanical-design-record"],
    queryFn: () => mechanicalDesignService.fetchRecord(),
  });

  // Local Form state
  const [formInput, setFormInput] = useState<MechanicalDesignFormInput | null>(null);

  if (record && !formInput) {
    setFormInput(record.input);
  }

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<MechanicalDesignFormInput>) =>
      mechanicalDesignService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["mechanical-design-record"], updated);
      toast.success("Draft saved successfully!", {
        description: "Mechanical design configurations updated.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save draft"),
  });

  const submitMutation = useMutation({
    mutationFn: () => mechanicalDesignService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["mechanical-design-record"], updated);
      toast.success("Submitted for Architecture Review!", {
        description: "Project moved to Stage 4 Engineering Review.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      decision: MechanicalDesignApprovalDecision;
      comments?: string;
    }) => mechanicalDesignService.reviewDecision({ id: record!.id, ...args }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["mechanical-design-record"], updated);
      if (variables.decision === "Approved") {
        toast.success(
          "Mechanical Design Approved! Downstream Prototype Manufacturing PM-2024-0089 linked."
        );
      } else {
        toast.info(`Review Decision updated to '${variables.decision}'.`);
      }
    },
    onError: (err: Error) => toast.error(err.message || "Decision submission failed"),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: MechanicalDesignStage) =>
      mechanicalDesignService.advanceStage(record!.id, targetStage),
    onSuccess: (updated) => {
      queryClient.setQueryData(["mechanical-design-record"], updated);
      toast.success("Advanced workflow stage successfully!");
    },
  });

  if (isLoading || !record || !formInput) {
    return (
      <AppShell
        title="Mechanical Design"
        breadcrumb={breadcrumb ?? "Development > Product Development > Mechanical Design"}
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

  const handleFieldChange = (field: keyof MechanicalDesignFormInput, value: any) => {
    setFormInput((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const shouldShowSection = (tabKey: MechanicalDesignTabId) => {
    return activeTab === "overview" || activeTab === tabKey;
  };

  return (
    <AppShell
      title="Mechanical Design"
      breadcrumb={breadcrumb ?? "Development > Product Development > Mechanical Design"}
      description="Engineer 3D mechanical enclosures, assemblies, DFM validation, GD&T drawings, and FEA structural simulations."
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
                <Wrench className="h-5 w-5" />
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
                  <DropdownMenuItem onClick={() => setCadModelModalOpen(true)}>
                    <Box className="h-4 w-4 mr-2 text-blue-500" />
                    Inspect 3D CAD Model
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFeaStressModalOpen(true)}>
                    <Activity className="h-4 w-4 mr-2 text-amber-500" />
                    View FEA Stress Simulation
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
                  MECHANICAL DEV ID
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
                  LINKED INDUSTRIAL
                </span>
                <span
                  onClick={() =>
                    navigate({
                      to: "/development/research-innovation/industrial-design/new" as any,
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                >
                  {record.linkedIndustrialDesignId}
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
                MECHANICAL ENGINEER:
              </span>
              <span className="font-semibold text-foreground">
                {record.mechanicalEngineerName}
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
                  Mechanical Design Approved by Engineering Board
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Downstream Prototype Manufacturing project{" "}
                  <span className="font-bold font-mono">PM-2024-0089</span>{" "}
                  has been auto-created &amp; linked for CNC/sheet metal fabrication.
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
                PANEL 1: Mechanical Design Overview
                ------------------------------------------------------------------- */}
            {shouldShowSection("overview") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-blue-600" />
                    Mechanical Design Overview
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
                      Mechanical Design Objective
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.designObjective}
                      onChange={(e) => handleFieldChange("designObjective", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Mechanical Design Scope
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
                      Design Standards
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.designStandards.map((std, i) => (
                        <span key={i} className="bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 px-2.5 py-0.5 rounded text-xs font-bold shadow-2xs">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 2: Assembly Design
                ------------------------------------------------------------------- */}
            {shouldShowSection("assembly_design") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-blue-600" />
                    3D Assembly Design &amp; Weight Specifications
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-semibold">
                    Status: {formInput.assemblyStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Assembly Name</span>
                    <Input
                      value={formInput.assemblyName}
                      onChange={(e) => handleFieldChange("assemblyName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Assembly Number</span>
                    <Input
                      value={formInput.assemblyNumber}
                      onChange={(e) => handleFieldChange("assemblyNumber", e.target.value)}
                      className="h-9 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Assembly Type</span>
                    <Input
                      value={formInput.assemblyType}
                      onChange={(e) => handleFieldChange("assemblyType", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Parent Assembly</span>
                    <Input
                      value={formInput.parentAssembly}
                      onChange={(e) => handleFieldChange("parentAssembly", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Number of Components</span>
                    <Input
                      type="number"
                      value={formInput.numberOfComponents}
                      onChange={(e) => handleFieldChange("numberOfComponents", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Assembly Weight</span>
                    <Input
                      value={formInput.assemblyWeight}
                      onChange={(e) => handleFieldChange("assemblyWeight", e.target.value)}
                      className="h-9 text-xs font-mono font-bold"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 3: Part Design
                ------------------------------------------------------------------- */}
            {shouldShowSection("part_design") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Box className="h-4 w-4 text-purple-600" />
                    Part Design &amp; Primary Components
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    {formInput.topParts.length} Key Parts Defined
                  </span>
                </CardHeader>

                <CardContent className="pt-4 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-border text-foreground font-semibold">
                      <tr>
                        <th className="p-2.5">Part Number</th>
                        <th className="p-2.5">Part Name</th>
                        <th className="p-2.5">Material</th>
                        <th className="p-2.5">Manufacturing Process</th>
                        <th className="p-2.5">Revision</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {formInput.topParts.map((prt) => (
                        <tr key={prt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                          <td className="p-2.5 font-bold font-mono text-foreground">{prt.partNumber}</td>
                          <td className="p-2.5 font-medium text-foreground">{prt.partName}</td>
                          <td className="p-2.5 text-muted-foreground">{prt.material}</td>
                          <td className="p-2.5 text-muted-foreground">{prt.process}</td>
                          <td className="p-2.5 font-mono text-center font-semibold">{prt.revision}</td>
                          <td className="p-2.5">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] font-semibold",
                                prt.status === "Approved"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              )}
                            >
                              {prt.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 4: Mechanism Design
                ------------------------------------------------------------------- */}
            {shouldShowSection("mechanism_design") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Cog className="h-4 w-4 text-blue-600" />
                    Mechanism Kinematics &amp; Motion Control
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Target Reliability: {formInput.reliabilityTarget}%
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Mechanism Name</span>
                    <Input
                      value={formInput.mechanismName}
                      onChange={(e) => handleFieldChange("mechanismName", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Motion Type</span>
                    <Input
                      value={formInput.motionType}
                      onChange={(e) => handleFieldChange("motionType", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Degrees of Freedom</span>
                    <Input
                      type="number"
                      value={formInput.degreesOfFreedom}
                      onChange={(e) => handleFieldChange("degreesOfFreedom", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Actuation Method</span>
                    <Input
                      value={formInput.actuationMethod}
                      onChange={(e) => handleFieldChange("actuationMethod", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Transmission Type</span>
                    <Input
                      value={formInput.transmissionType}
                      onChange={(e) => handleFieldChange("transmissionType", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Safety Lock Mechanism</span>
                    <Input
                      value={formInput.safetyMechanism}
                      onChange={(e) => handleFieldChange("safetyMechanism", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 5: Materials & Manufacturing
                ------------------------------------------------------------------- */}
            {shouldShowSection("materials_manufacturing") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Factory className="h-4 w-4 text-emerald-600" />
                    Materials, Surface Finish &amp; GD&amp;T
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Est. Unit Cost: {formInput.estManufacturingCost}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Material Grade</span>
                    <Input
                      value={formInput.materialGrade}
                      onChange={(e) => handleFieldChange("materialGrade", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Material Standard</span>
                    <Input
                      value={formInput.materialStandard}
                      onChange={(e) => handleFieldChange("materialStandard", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Heat Treatment</span>
                    <Input
                      value={formInput.heatTreatment}
                      onChange={(e) => handleFieldChange("heatTreatment", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Surface Finish</span>
                    <Input
                      value={formInput.surfaceFinish}
                      onChange={(e) => handleFieldChange("surfaceFinish", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Tolerance Class</span>
                    <Input
                      value={formInput.toleranceClass}
                      onChange={(e) => handleFieldChange("toleranceClass", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">GD&amp;T Requirement</span>
                    <Input
                      value={formInput.gdtRequirement}
                      onChange={(e) => handleFieldChange("gdtRequirement", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 6: Engineering Analysis & FEA
                ------------------------------------------------------------------- */}
            {shouldShowSection("engineering_analysis") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Finite Element Analysis (FEA) &amp; Simulation
                  </CardTitle>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-bold">
                    FEA Status: {formInput.simulationStatus}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
                  {formInput.engineeringAnalyses.map((ana) => (
                    <div key={ana.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center space-y-1.5">
                      <span className="font-semibold text-foreground block truncate">{ana.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold",
                          ana.status === "Completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        )}
                      >
                        {ana.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 7: Design Validation
                ------------------------------------------------------------------- */}
            {shouldShowSection("design_validation") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                    Physical Prototype &amp; Design Validation
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Validation Score: {formInput.validationScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Verification Method</span>
                    <Input
                      value={formInput.designVerificationMethod}
                      onChange={(e) => handleFieldChange("designVerificationMethod", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Prototype Validation</span>
                    <Input
                      value={formInput.prototypeValidation}
                      onChange={(e) => handleFieldChange("prototypeValidation", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Test Results</span>
                    <Input
                      value={formInput.testResults}
                      onChange={(e) => handleFieldChange("testResults", e.target.value)}
                      className="h-9 text-xs font-semibold text-emerald-600"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Identified Issues</span>
                    <Input
                      value={formInput.designIssues}
                      onChange={(e) => handleFieldChange("designIssues", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Corrective Actions</span>
                    <Input
                      value={formInput.correctiveActions}
                      onChange={(e) => handleFieldChange("correctiveActions", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 8: AI Assessment & Recommendations
                ------------------------------------------------------------------- */}
            {shouldShowSection("ai_assessment") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI Mechanical Evaluation &amp; Optimization
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    AI Overall: {record.aiAssessment.aiOverallScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                      <span className="text-[10px] text-muted-foreground block font-semibold">Design Quality</span>
                      <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiDesignQuality}/100</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                      <span className="text-[10px] text-muted-foreground block font-semibold">Manufacturability</span>
                      <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiManufacturability}/100</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                      <span className="text-[10px] text-muted-foreground block font-semibold">Structural Score</span>
                      <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiStructuralAssessment}/100</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                      <span className="text-[10px] text-muted-foreground block font-semibold">Cost Optimization</span>
                      <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiCostOptimization}/100</span>
                    </div>
                  </div>

                  {/* AI Recommendations List */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    <span className="font-bold text-foreground block">Key AI Engineering Recommendations</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {formInput.aiRecommendations.map((rec) => (
                        <div key={rec.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-lg space-y-1">
                          <div className="flex items-center justify-between font-bold text-foreground">
                            <span>{rec.title}</span>
                            {rec.impactScore && (
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                                {rec.impactScore}
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-[11px] leading-relaxed">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 9: Readiness Summary
                ------------------------------------------------------------------- */}
            {shouldShowSection("summary") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    Readiness &amp; Release Summary
                  </CardTitle>
                  <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 text-xs font-bold px-2.5 py-0.5">
                    Recommendation: Proceed to Prototype Manufacturing
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Structural Readiness</span>
                      <span>{record.summary.structuralReadiness} / 100</span>
                    </div>
                    <Progress value={record.summary.structuralReadiness} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Manufacturability</span>
                      <span>{record.summary.manufacturability} / 100</span>
                    </div>
                    <Progress value={record.summary.manufacturability} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Reliability</span>
                      <span>{record.summary.reliability} / 100</span>
                    </div>
                    <Progress value={record.summary.reliability} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold text-foreground mb-1">
                      <span>Simulation Score</span>
                      <span>{record.summary.simulation} / 100</span>
                    </div>
                    <Progress value={record.summary.simulation} className="h-2" />
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center font-bold text-foreground">
                    <span>Overall Mechanical Design Score</span>
                    <span className="text-base text-blue-600">{record.summary.overallMechanicalDesignScore} / 100</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 10: Document & Artifact Attachments
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
                PANEL 11: Review & Approval Table & Form
                ------------------------------------------------------------------- */}
            {shouldShowSection("review_approval") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    Review &amp; Approval
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Engineering Review Board
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
                        onChange={(e) => handleFieldChange("approvalDecision", e.target.value as MechanicalDesignApprovalDecision)}
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
                        placeholder="Enter mechanical review board comments..."
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
                PANEL 12: System Information & Audit Trail
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
                    <span className="font-bold text-foreground">{record.mechanicalEngineerName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created Date</span>
                    <span className="font-medium text-muted-foreground">{record.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified By</span>
                    <span className="font-bold text-foreground">{record.mechanicalEngineerName}</span>
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
                    Overall Mechanical Design Score
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-5 flex flex-col items-center">
                  <CircularScoreGauge
                    score={record.summary.overallMechanicalDesignScore}
                  />

                  <div className="w-full mt-5 space-y-2 border-t border-border pt-4 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Structural Readiness</span>
                      <span className="font-bold text-foreground">{record.summary.structuralReadiness}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Manufacturability</span>
                      <span className="font-bold text-foreground">{record.summary.manufacturability}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Reliability</span>
                      <span className="font-bold text-foreground">{record.summary.reliability}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Simulation</span>
                      <span className="font-bold text-foreground">{record.summary.simulation}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-border font-bold text-blue-600 dark:text-blue-400">
                      <span>Overall Score</span>
                      <span>{record.summary.overallMechanicalDesignScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Highlights Card */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-2 border-b border-border">
                  <CardTitle className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600" />
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
                Mechanical Design Engineering Report
              </DialogTitle>
              <DialogDescription>
                Generated executive summary report for record {record.designId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground block">{record.designProjectName}</span>
                <p className="text-muted-foreground leading-relaxed">
                  Covers 125-component 3D CAD assembly, Al 6061-T6 enclosure, spring-loaded cable management mechanism, and FEA static stress margin of safety (2.45).
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold">
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Overall Design Score: {record.summary.overallMechanicalDesignScore}/100</div>
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Design Version: {record.designVersion}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => { toast.success("Downloaded Mechanical_Design_Report.pdf"); setReportModalOpen(false); }}>
                <Download className="h-4 w-4 mr-1.5" /> Download PDF Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3D CAD Assembly Modal */}
        <Dialog open={cadModelModalOpen} onOpenChange={setCadModelModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Box className="h-5 w-5 text-blue-600" />
                3D CAD Mechanical Assembly Model
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Box className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">125-Component Production Assembly</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                High-precision sheet metal body, CNC front bezel, internal cooling air ducts, and XT60 cable relief clamps.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCadModelModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* FEA Stress Modal */}
        <Dialog open={feaStressModalOpen} onOpenChange={setFeaStressModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-600" />
                FEA von Mises Stress Simulation Plot
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                <Activity className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Peak Stress: 142 MPa (Al 6061-T6 Yield: 276 MPa)</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                Static drop test (1.2m) and wind-load structural simulations verify margin of safety = 2.45 across all mounting brackets.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFeaStressModalOpen(false)}>Close</Button>
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
