// Industrial Design Form - Magnertia ERP
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Palette,
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
  Star,
  Leaf,
  Factory,
  PenTool,
  Ruler,
  Weight,
} from "lucide-react";

import { AppShell } from "@/components/erp/AppShell";
import {
  IndustrialDesignTabBar,
  type IndustrialDesignTabId,
} from "@/components/erp/IndustrialDesignTabBar";
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
import { industrialDesignService } from "@/services";
import type {
  IndustrialDesignApprovalDecision,
  IndustrialDesignFormInput,
  IndustrialDesignRecord,
  IndustrialDesignStage,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/industrial-design/new",
)({
  head: () => ({
    meta: [{ title: "Industrial Design · Magnertia ERP" }],
  }),
  component: IndustrialDesignNewPage,
});

export function IndustrialDesignFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <IndustrialDesignNewPage {...props} />;
}

export function IndustrialDesignPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <IndustrialDesignNewPage {...props} />;
}

export function IndustrialDesignDevelopmentNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <IndustrialDesignNewPage {...props} />;
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

  let scoreColor = "text-purple-600 stroke-purple-600 dark:text-purple-400 dark:stroke-purple-400";
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
   Main Industrial Design Page Component
   =========================================================================== */
export function IndustrialDesignNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<IndustrialDesignTabId>("overview");

  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [cadRenderModalOpen, setCadRenderModalOpen] = useState(false);
  const [systemLogModalOpen, setSystemLogModalOpen] = useState(false);

  // Fetch record
  const { data: record, isLoading } = useQuery({
    queryKey: ["industrial-design-record"],
    queryFn: () => industrialDesignService.fetchRecord(),
  });

  // Local Form state
  const [formInput, setFormInput] = useState<IndustrialDesignFormInput | null>(null);

  if (record && !formInput) {
    setFormInput(record.input);
  }

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<IndustrialDesignFormInput>) =>
      industrialDesignService.saveDraft(input, record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["industrial-design-record"], updated);
      toast.success("Draft saved successfully!", {
        description: "Industrial design configurations updated.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to save draft"),
  });

  const submitMutation = useMutation({
    mutationFn: () => industrialDesignService.submitForReview(record?.id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["industrial-design-record"], updated);
      toast.success("Submitted for Architecture Review!", {
        description: "Project moved to Executive Review Board.",
      });
    },
    onError: (err: Error) => toast.error(err.message || "Submission failed"),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      decision: IndustrialDesignApprovalDecision;
      comments?: string;
    }) => industrialDesignService.reviewDecision({ id: record!.id, ...args }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["industrial-design-record"], updated);
      if (variables.decision === "approved") {
        toast.success(
          "Industrial Design Approved! Downstream Mechanical Design MECH-2024-0042 linked."
        );
      } else {
        toast.info(`Review Decision updated to '${variables.decision}'.`);
      }
    },
    onError: (err: Error) => toast.error(err.message || "Decision submission failed"),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: IndustrialDesignStage) =>
      industrialDesignService.advanceStage(record!.id, targetStage),
    onSuccess: (updated) => {
      queryClient.setQueryData(["industrial-design-record"], updated);
      toast.success("Advanced workflow stage successfully!");
    },
  });

  if (isLoading || !record || !formInput) {
    return (
      <AppShell
        title="Industrial Design"
        breadcrumb={breadcrumb ?? "Development > Product Development > Industrial Design"}
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

  const handleFieldChange = (field: keyof IndustrialDesignFormInput, value: any) => {
    setFormInput((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const shouldShowSection = (tabKey: IndustrialDesignTabId) => {
    return activeTab === "overview" || activeTab === tabKey;
  };

  return (
    <AppShell
      title="Industrial Design"
      breadcrumb={breadcrumb ?? "Development > Product Development > Industrial Design"}
      description="Create ergonomic form factors, styling aesthetics, DFM materials, and sustainable enclosures."
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
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center font-bold shrink-0 border border-purple-200/50 dark:border-purple-800/50">
                <Palette className="h-5 w-5" />
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
                  <DropdownMenuItem onClick={() => setCadRenderModalOpen(true)}>
                    <Eye className="h-4 w-4 mr-2 text-purple-500" />
                    Inspect Technical Spec
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
                  INDUSTRIAL DEV ID
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
                  {record.linkedArchitectureId}
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
                INDUSTRIAL DESIGNER:
              </span>
              <span className="font-semibold text-foreground">
                {record.industrialDesignerName}
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
                  Industrial Design Approved by Executive Board
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  Downstream Mechanical Design project{" "}
                  <span className="font-bold font-mono">MECH-2024-0042</span>{" "}
                  has been auto-created &amp; linked for 3D CAD modeling.
                </p>
              </div>
            </div>
            <Button
              size="sm"
              onClick={() => toast.info("Navigating to Mechanical Design (MECH-2024-0042)...")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              Proceed to Mechanical Design
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
                PANEL 1: Design Overview
                ------------------------------------------------------------------- */}
            {shouldShowSection("overview") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Palette className="h-4 w-4 text-purple-600" />
                    Design Overview
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
                      Design Objective
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
                      Design Vision
                    </label>
                    <Textarea
                      rows={2}
                      value={formInput.designVision}
                      onChange={(e) => handleFieldChange("designVision", e.target.value)}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Design Language
                    </label>
                    <Input
                      value={formInput.designLanguage}
                      onChange={(e) => handleFieldChange("designLanguage", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Target Users
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.targetUsers.map((user, i) => (
                        <span key={i} className="bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 px-2.5 py-0.5 rounded text-xs font-bold shadow-2xs">
                          {user}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 2: Form Factor & Ergonomics
                ------------------------------------------------------------------- */}
            {shouldShowSection("ergonomics") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-blue-600" />
                    Form Factor &amp; Ergonomics
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Ergonomic Readiness: {formInput.ergonomicScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Form Factor</span>
                    <Input
                      value={formInput.formFactor}
                      onChange={(e) => handleFieldChange("formFactor", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Dimensions</span>
                    <Input
                      value={formInput.dimensions}
                      onChange={(e) => handleFieldChange("dimensions", e.target.value)}
                      className="h-9 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Weight Target</span>
                    <Input
                      value={formInput.weightTarget}
                      onChange={(e) => handleFieldChange("weightTarget", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Ergonomic Considerations</span>
                    <Input
                      value={formInput.ergonomicConsiderations}
                      onChange={(e) => handleFieldChange("ergonomicConsiderations", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Accessibility Features</span>
                    <Input
                      value={formInput.accessibilityFeatures}
                      onChange={(e) => handleFieldChange("accessibilityFeatures", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 3: Aesthetics & Branding
                ------------------------------------------------------------------- */}
            {shouldShowSection("aesthetics_branding") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Palette className="h-4 w-4 text-purple-600" />
                    Aesthetics, Branding &amp; Visual Identity
                  </CardTitle>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-semibold">
                    Visual Score: {formInput.visualAppealScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Product Style</span>
                    <Input
                      value={formInput.productStyle}
                      onChange={(e) => handleFieldChange("productStyle", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Surface Finish</span>
                    <Input
                      value={formInput.surfaceFinish}
                      onChange={(e) => handleFieldChange("surfaceFinish", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Logo Placement</span>
                    <Input
                      value={formInput.logoPlacement}
                      onChange={(e) => handleFieldChange("logoPlacement", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">Brand Identity Alignment</span>
                    <Input
                      value={formInput.brandIdentityAlignment}
                      onChange={(e) => handleFieldChange("brandIdentityAlignment", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 4: Material Selection
                ------------------------------------------------------------------- */}
            {shouldShowSection("materials") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Box className="h-4 w-4 text-blue-600" />
                    Material Selection &amp; Sustainability
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-semibold">
                    Recyclability: {formInput.recyclabilityPercent}%
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Primary Material</span>
                    <Input
                      value={formInput.primaryMaterial}
                      onChange={(e) => handleFieldChange("primaryMaterial", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Secondary Materials</span>
                    <Input
                      value={formInput.secondaryMaterials}
                      onChange={(e) => handleFieldChange("secondaryMaterials", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Material Grade</span>
                    <Input
                      value={formInput.materialGrade}
                      onChange={(e) => handleFieldChange("materialGrade", e.target.value)}
                      className="h-9 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Estimated Material Cost</span>
                    <Input
                      value={formInput.materialCost}
                      onChange={(e) => handleFieldChange("materialCost", e.target.value)}
                      className="h-9 text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Environmental Compliance</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.environmentalCompliance.map((std, i) => (
                        <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
                          {std}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 5: Manufacturing Considerations
                ------------------------------------------------------------------- */}
            {shouldShowSection("manufacturing") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Factory className="h-4 w-4 text-emerald-600" />
                    Manufacturing Considerations &amp; DFM / DFA
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    DFM Score: {formInput.manufacturabilityScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Assembly Method</span>
                    <Input
                      value={formInput.assemblyMethod}
                      onChange={(e) => handleFieldChange("assemblyMethod", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <span className="text-muted-foreground block font-semibold mb-1">Manufacturing Processes</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.manufacturingProcess.map((proc, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-[11px] font-bold">
                          {proc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">DFM Assessment</span>
                    <Input
                      value={formInput.dfmAssessment}
                      onChange={(e) => handleFieldChange("dfmAssessment", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <span className="text-muted-foreground block font-semibold mb-1">DFA Assessment</span>
                    <Input
                      value={formInput.dfaAssessment}
                      onChange={(e) => handleFieldChange("dfaAssessment", e.target.value)}
                      className="h-9 text-xs"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 6: Prototype & Validation
                ------------------------------------------------------------------- */}
            {shouldShowSection("prototype_validation") && (
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
                    <span className="text-muted-foreground block font-semibold mb-1">Prototype Type</span>
                    <Input
                      value={formInput.prototypeType}
                      onChange={(e) => handleFieldChange("prototypeType", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Prototype Status</span>
                    <Input
                      value={formInput.prototypeStatusBadge}
                      onChange={(e) => handleFieldChange("prototypeStatusBadge", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Iteration Number</span>
                    <Input
                      type="number"
                      value={formInput.designIterationNumber}
                      onChange={(e) => handleFieldChange("designIterationNumber", Number(e.target.value))}
                      className="h-9 text-xs font-bold"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* -------------------------------------------------------------------
                PANEL 7: Sustainability & Compliance
                ------------------------------------------------------------------- */}
            {shouldShowSection("sustainability") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Leaf className="h-4 w-4 text-emerald-600" />
                    Sustainability, Carbon Footprint &amp; Compliance
                  </CardTitle>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold">
                    Eco Score: {formInput.complianceScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Carbon Footprint Estimate</span>
                    <Input
                      value={formInput.carbonFootprintEstimate}
                      onChange={(e) => handleFieldChange("carbonFootprintEstimate", e.target.value)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Energy Efficiency</span>
                    <Input
                      value={`${formInput.energyEfficiencyStars} / 5 Stars`}
                      onChange={(e) => handleFieldChange("energyEfficiencyStars", 5)}
                      className="h-9 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-semibold mb-1">Regulatory Standards</span>
                    <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-border min-h-[36px] items-center">
                      {formInput.regulatoryStandards.map((std, i) => (
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
                PANEL 8: AI Assessment
                ------------------------------------------------------------------- */}
            {shouldShowSection("ai_assessment") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-600" />
                    AI Industrial Design Evaluation
                  </CardTitle>
                  <Badge className="bg-blue-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    AI Overall: {record.aiAssessment.aiOverallDesignScore}/100
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">AI Design Quality</span>
                    <span className="text-base font-black text-foreground mt-1 block">{record.aiAssessment.aiDesignQualityScore}/100</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Ergonomic Analysis</span>
                    <span className="text-xs font-semibold text-foreground mt-1 block">{record.aiAssessment.aiErgonomicAssessment}</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-border rounded-lg text-center">
                    <span className="text-[10px] text-muted-foreground block font-semibold">Cost Optimization</span>
                    <span className="text-xs font-semibold text-foreground mt-1 block">{record.aiAssessment.aiCostOptimization}</span>
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
                    Recommendation: Proceed to Mechanical Design
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 flex flex-col md:flex-row items-center gap-6 text-xs">
                  <div className="shrink-0 flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-border">
                    <CircularScoreGauge score={record.summary.overallDesignScore} />
                    <span className="text-[11px] font-bold text-muted-foreground mt-2 uppercase tracking-wide">Overall Design Score</span>
                  </div>
                  <div className="flex-1 w-full space-y-3">
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>User Experience</span>
                        <span>{record.summary.userExperience} / 100</span>
                      </div>
                      <Progress value={record.summary.userExperience} className="h-2" />
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
                        <span>Sustainability</span>
                        <span>{record.summary.sustainability} / 100</span>
                      </div>
                      <Progress value={record.summary.sustainability} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between font-semibold text-foreground mb-1">
                        <span>Brand Alignment</span>
                        <span>{record.summary.brandAlignment} / 100</span>
                      </div>
                      <Progress value={record.summary.brandAlignment} className="h-2" />
                    </div>
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
                PANEL 11: Review & Approval Table & Form
                ------------------------------------------------------------------- */}
            {shouldShowSection("review_approval") && (
              <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs">
                <CardHeader className="pb-3 border-b border-border flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    Review &amp; Approval Board
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground">
                    Industrial Design Review Board
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
                        onChange={(e) => handleFieldChange("approvalDecision", e.target.value as IndustrialDesignApprovalDecision)}
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
                        <span>{(formInput.reviewComments || "").length}/2000</span>
                      </div>
                      <Textarea
                        rows={3}
                        maxLength={2000}
                        value={formInput.reviewComments || ""}
                        onChange={(e) => handleFieldChange("reviewComments", e.target.value)}
                        placeholder="Enter industrial design review comments..."
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
                    <span className="font-bold text-foreground">{record.industrialDesignerName}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Created Date</span>
                    <span className="font-medium text-muted-foreground">{record.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-semibold">Last Modified By</span>
                    <span className="font-bold text-foreground">{record.industrialDesignerName}</span>
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
                    <Sparkles className="h-3.5 w-3.5 text-purple-600" />
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
                Industrial Design Executive Report
              </DialogTitle>
              <DialogDescription>
                Generated executive summary report for record {record.designId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-border space-y-1.5">
                <span className="font-bold text-foreground block">{record.designProjectName}</span>
                <p className="text-muted-foreground leading-relaxed">
                  Covers floor-standing ergonomic form factor, Al 6061 and PC-ABS material selection, matte powder-coated finish, 85% recyclability, and IEC 61851 compliance.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 font-semibold">
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Overall Design Score: {record.summary.overallDesignScore}/100</div>
                <div className="p-2.5 border border-border rounded-lg bg-slate-50/50 dark:bg-slate-800/50">Design Version: {record.designVersion}</div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportModalOpen(false)}>
                Close
              </Button>
              <Button onClick={() => { toast.success("Downloaded Industrial_Design_Report.pdf"); setReportModalOpen(false); }}>
                <Download className="h-4 w-4 mr-1.5" /> Download PDF Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* CAD Render Modal */}
        <Dialog open={cadRenderModalOpen} onOpenChange={setCadRenderModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-purple-600" />
                Parametric 3D CAD Render Package Spec
              </DialogTitle>
            </DialogHeader>
            <div className="h-64 bg-slate-950 rounded-xl p-6 flex flex-col items-center justify-center text-white gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Floor-Standing 1600mm Enclosure</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                Modern industrial styling, eye-level interaction display, integrated cable dock, and modular side maintenance panels.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCadRenderModalOpen(false)}>Close</Button>
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
