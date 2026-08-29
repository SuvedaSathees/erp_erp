import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Save,
  Send,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  Download,
  Upload,
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  History,
  Activity,
  Layers,
  Target,
  Zap,
  Map,
  Award,
  Paperclip,
  Eye,
  Check,
  ClipboardCheck,
  Cpu,
  ShieldAlert,
  UserCheck,
  FileSpreadsheet,
  FileCode,
  Info,
  Clock,
  ChevronRight,
  TrendingUp,
  Maximize2,
  Share2,
  Printer,
  FileCheck,
  User,
  ShieldCheck,
  Radio,
  HardDrive,
  Database,
  Lock,
  Workflow,
  Plus,
  ArrowRight,
  Palette,
  Box,
  Star,
  Ruler,
  Weight,
  PenTool,
  Factory,
  CheckSquare,
  Search,
  SlidersHorizontal,
  ChevronDown,
  Monitor,
  Smartphone,
  Tablet,
  Layout,
  Figma,
  Grid,
  List,
  Flame,
  ThumbsUp,
  MessageSquare,
  FilePlus,
  RefreshCw,
  Copy,
  FolderDown,
  Play,
  HelpCircle,
  BarChart3,
  PieChart,
  CheckSquare2,
  Users,
  Code,
  BarChart2,
} from "lucide-react";

import { uiUxDevelopmentService } from "@/services/uiUxDevelopmentService";
import type {
  UiUxDevelopmentRecord,
  UiUxDevelopmentFormInput,
  UiUxDevelopmentApprovalDecision,
  UiUxUserPersona,
  UiUxWireframeScreen,
  UiUxAttachment,
  UiUxWcagAudit,
  UiUxReviewer,
  UiUxAuditEntry,
} from "@/services/types";
import { ResearchInnovationTabBar, InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { UI_UX_TABS, type UiUxDevelopmentTabId } from "@/components/erp/UiUxDevelopmentTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { AppShell } from "@/components/erp/AppShell";

export const Route = createFileRoute(
  "/development/research-innovation/ui-ux-development/new",
)({
  head: () => ({
    meta: [{ title: "UI/UX Development Form · Magnertia ERP" }],
  }),
  component: UiUxDevelopmentNewPage,
});

export function UiUxDevelopmentFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <UiUxDevelopmentNewPage {...props} />;
}

export function UiUxDevelopmentPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <UiUxDevelopmentNewPage {...props} />;
}


export function UiUxDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Tab State & View Settings
  const [activeTab, setActiveTab] = useState<UiUxDevelopmentTabId>("overview");
  const [isSkeleton, setIsSkeleton] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [wireframeFilter, setWireframeFilter] = useState<"All" | "Low-Fi" | "Hi-Fi">("All");
  const [selectedPersona, setSelectedPersona] = useState<UiUxUserPersona | null>(null);
  const [selectedWireframe, setSelectedWireframe] = useState<UiUxWireframeScreen | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [deviceFrame, setDeviceFrame] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [designTokenTab, setDesignTokenTab] = useState<"colors" | "typography" | "components" | "css">("colors");

  // Approval Form State
  const [reviewDecision, setReviewDecision] = useState<UiUxDevelopmentApprovalDecision>("Approved");
  const [reviewCommentInput, setReviewCommentInput] = useState("");

  // Data Fetching
  const { data: record, isLoading } = useQuery<UiUxDevelopmentRecord>({
    queryKey: ["uiUxDevelopmentRecord"],
    queryFn: () => uiUxDevelopmentService.fetchRecord(),
  });

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<UiUxDevelopmentFormInput>) => uiUxDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["uiUxDevelopmentRecord"], updated);
      toast.success("Draft saved successfully!", { description: "All design parameters and metadata updated." });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message || "An error occurred." });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: (id?: string) => uiUxDevelopmentService.submitForReview(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["uiUxDevelopmentRecord"], updated);
      toast.success("Submitted for Executive Review!", { description: "Review notifications sent to stakeholders." });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: { id: string; decision: UiUxDevelopmentApprovalDecision; comments?: string }) =>
      uiUxDevelopmentService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["uiUxDevelopmentRecord"], updated);
      toast.success(`Decision submitted: ${reviewDecision}`, { description: "Workflow status updated." });
    },
  });

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading || !record) {
    return (
      <AppShell
        title="UI/UX Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        description="Design, validate, and hand off enterprise UI/UX design systems and wireframes."
        tabs={tabs ?? <ResearchInnovationTabBar />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading Magnertia UI/UX Development Module...</p>
        </div>
      </AppShell>
    );
  }

  // Quick helper handlers
  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      ...record,
      lastUpdated: new Date().toLocaleString(),
    });
  };

  const handleSubmitDecision = () => {
    reviewDecisionMutation.mutate({
      id: record.id,
      decision: reviewDecision,
      comments: reviewCommentInput || undefined,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}`, { description: text });
  };

  const handleExportPDF = () => {
    toast.success("Exporting UI/UX Specification Report (PDF)...", { description: "Generating vector PDF with design system tokens." });
  };

  return (
    <AppShell
      title="UI/UX Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > UI/UX Development"}
      description="Design Figma wireframes, interactive prototypes, design system tokens, and usability testing."
      tabs={tabs ?? <ResearchInnovationTabBar />}
    >
      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased pb-16">
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-3 space-y-4">
          <div className="rounded-xl border border-border/80 bg-white dark:bg-slate-900 shadow-xs p-4 sm:p-5 transition-all">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Palette className="h-6 w-6 text-primary shrink-0" />
                  {record.uiUxProjectName}
                </h1>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-xs font-semibold px-2.5 py-0.5">
                  {record.designVersion}
                </Badge>
                <Badge
                  className={
                    record.workflowStatus === "Approved"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
                      : record.workflowStatus === "In Review"
                        ? "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
                        : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  }
                >
                  <Workflow className="mr-1 h-3 w-3 inline" />
                  {record.workflowStatus}
                </Badge>
              </div>
            </div>

            {/* Right: Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={saveDraftMutation.isPending}
                className="h-9 px-3 text-xs gap-1.5 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Save className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                Save Draft
              </Button>

              <Button
                size="sm"
                onClick={() => submitReviewMutation.mutate(record.id)}
                disabled={submitReviewMutation.isPending}
                className="h-9 px-4 text-xs font-semibold gap-1.5 bg-primary text-white hover:bg-primary/90 shadow-xs"
              >
                <Send className="h-3.5 w-3.5" />
                Submit for Review
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300 dark:border-slate-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <Printer className="mr-2 h-4 w-4" /> Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => copyToClipboard(JSON.stringify(record, null, 2), "Record JSON")}>
                    <FileCode className="mr-2 h-4 w-4" /> Copy Raw JSON
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsCommandPaletteOpen(true)}>
                    <Search className="mr-2 h-4 w-4" /> Quick Search (Cmd+K)
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsScheduleModalOpen(true)}>
                    <Calendar className="mr-2 h-4 w-4" /> Schedule Review
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Metadata Grid Bar */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 border-t border-border/60 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">UI/UX Dev ID</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{record.uiUxDevelopmentId}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Form Code</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{record.formCode}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Linked PRD</span>
              <span className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer">
                {record.linkedPrdId} <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Linked Software Dev</span>
              <span className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer">
                {record.linkedSoftwareDevId} <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Linked Mobile App</span>
              <span className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer">
                {record.linkedMobileAppDevId} <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Product Architecture</span>
              <span className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer">
                {record.linkedProductArchitectureId} <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Business Unit</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{record.businessUnit}</span>
            </div>
          </div>
        </div>

        {/* ====================================================================
           2. MAIN CONTENT AREA & RIGHT INSIGHTS PANEL GRID
           ==================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Module Content (9 cols on desktop) */}
          <div className="lg:col-span-9 space-y-6">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Grid className="h-5 w-5 text-primary" /> Executive Lifecycle Overview (13 Modules)
                  </h2>
                  <Badge variant="outline" className="text-xs font-semibold bg-white dark:bg-slate-900 shadow-2xs">
                    Live Telemetry Mode
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Card 1: Project Overview */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900 flex flex-col justify-between">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Layout className="h-4 w-4 text-blue-600" />
                        Project Overview
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary font-bold">In Progress</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Product Name</span>
                          <span className="font-bold text-slate-900 dark:text-white">{record.productName}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">UI/UX Project Name</span>
                          <span className="font-bold text-slate-900 dark:text-white">{record.uiUxProjectName}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px]">Project Objective</span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] line-clamp-2 leading-relaxed">
                          {record.projectObjective}
                        </p>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px]">Business Goals</span>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] line-clamp-1">{record.businessGoals}</p>
                      </div>

                      <div className="pt-1">
                        <span className="text-muted-foreground block text-[10px]">Target Platforms</span>
                        <div className="flex gap-1 mt-0.5">
                          {record.targetPlatforms.map((plat: string) => (
                            <Badge key={plat} variant="outline" className="text-[9px] px-1.5 py-0 font-semibold bg-slate-50 dark:bg-slate-800">
                              {plat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2: User Research */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900 flex flex-col justify-between">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        User Research
                      </CardTitle>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Completed</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-2">
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">Research Method</span>
                          <span className="font-semibold text-right text-[10px]">Interviews, Survey, Analytics</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">User Personas</span>
                          <span className="font-bold text-primary text-[10px]">3 Personas Defined</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">User Journey</span>
                          <span className="font-semibold text-[10px]">5 Key Journeys</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">Pain Points</span>
                          <span className="font-bold text-rose-600 text-[10px]">12 Identified</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">Customer Feedback</span>
                          <span className="font-bold text-emerald-600 text-[10px]">128 Responses</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">Competitive Analysis</span>
                          <span className="font-semibold text-[10px]">4 Competitors</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 3: Information Architecture */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900 flex flex-col justify-between">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Layers className="h-4 w-4 text-blue-600" />
                        Information Architecture
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-bold text-primary bg-primary/5">Score: {record.architectureReadinessScore ?? record.uxReadinessScore}/100</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Sitemap</span>
                          <span className="font-bold text-slate-900 dark:text-white">25 Pages</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Navigation Structure</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Top + Side Navigation</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Screen Hierarchy</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">4 Levels</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Content Structure</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">Module Based</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 4: Wireframe & User Flow */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Palette className="h-4 w-4 text-blue-600" />
                        Wireframe & User Flow
                      </CardTitle>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">UX Score: {record.uxScore ?? record.uxReadinessScore}</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">Low-Fidelity</span>
                          <span className="font-bold">32 Screens</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">High-Fidelity</span>
                          <span className="font-bold text-primary">32 Screens</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">Screen Flow</span>
                          <span className="font-semibold">5 Flows</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-muted-foreground text-[10px]">Task Flow</span>
                          <span className="font-semibold">8 Key Tasks</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 5: Visual Design */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        Visual Design
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-bold text-primary">Score: {record.visualDesignScore ?? record.uiReadinessScore}/100</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Design System:</span>
                        <span className="font-bold text-primary text-[10px]">{record.designSystemVersion ?? record.designVersion}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Typography:</span>
                        <span className="font-semibold text-[10px]">Poppins & Inter</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Component Library:</span>
                        <span className="font-semibold text-[10px]">120+ Components</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Brand Compliance:</span>
                        <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50/50">WCAG Verified</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 6: Accessibility & Usability */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Eye className="h-4 w-4 text-blue-600" />
                        Accessibility & Usability
                      </CardTitle>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">WCAG 2.2 AA</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Keyboard Navigation:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 inline" /> 100%</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Screen Reader Support:</span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3 inline" /> Verified</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Accessibility Score:</span>
                        <span className="font-bold text-primary text-[10px]">90%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 7: Prototype & Validation */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                        Prototype & Validation
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 font-bold">Figma</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Usability Testing:</span>
                        <span className="font-bold text-emerald-600 text-[10px]">Completed (30 Users)</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">A/B Testing:</span>
                        <span className="font-bold text-emerald-600 text-[10px]">Completed</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">User Satisfaction (SUS):</span>
                        <span className="font-bold text-primary text-[10px]">{record.userSatisfactionScore ?? 91}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 8: Developer Handoff */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Code className="h-4 w-4 text-blue-600" />
                        Developer Handoff
                      </CardTitle>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">Ready (90/100)</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Design Tokens:</span>
                        <span className="font-bold text-slate-900 dark:text-white text-[10px]">JSON & CSS</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">Component Library:</span>
                        <span className="font-bold text-emerald-600 text-[10px]">React & Tailwind</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 9: AI UI/UX Assessment */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600" />
                        AI UI/UX Assessment
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-bold text-purple-600 border-purple-300">
                        AI Score: {record.aiOverallDesignScore ?? record.overallDesignScore}/100
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">AI UX Score:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{record.aiUxScore ?? record.uxReadinessScore}%</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-muted-foreground text-[10px]">AI Accessibility Review:</span>
                        <span className="font-bold text-emerald-600">{record.aiAccessibilityReview ?? record.accessibilityScore}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 10: Design Summary */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <BarChart2 className="h-4 w-4 text-blue-600" />
                        Design Summary
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-bold">Readiness 88%</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold">
                          <span>Research Readiness</span>
                          <span>88/100</span>
                        </div>
                        <Progress value={88} className="h-1.5" />
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Recommendation</span>
                        <span className="font-bold text-primary text-[11px]">{record.recommendation ?? "Proceed to Development"}</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 11: Attachments */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900 md:col-span-2">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-blue-600" />
                        Attachments ({record.attachments.length})
                      </CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setIsUploadOpen(true)} className="h-6 text-[10px] text-primary p-0">
                        + Upload File
                      </Button>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs">
                      <div className="grid grid-cols-2 gap-2">
                        {record.attachments.map((att: UiUxAttachment) => (
                          <div key={att.id} className="flex justify-between items-center p-2 rounded-lg border bg-slate-50/50 dark:bg-slate-800/40">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span className="truncate text-[10px] font-medium text-slate-900 dark:text-slate-100">{att.name}</span>
                            </div>
                            <span className="text-[9px] text-muted-foreground shrink-0 ml-1">{att.size}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 12: Review & Approval */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900 md:col-span-3">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                        Review & Approval Workflow
                      </CardTitle>
                      <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-300 text-[10px] font-bold">{record.workflowStatus}</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                        {record.reviewers.map((rev: UiUxReviewer, i: number) => (
                          <div key={i} className="rounded-lg border border-border/60 p-2 text-center bg-slate-50/50 dark:bg-slate-800/40">
                            <span className="block font-bold text-[10px] truncate text-slate-900 dark:text-white">{rev.person}</span>
                            <span className="block text-[9px] text-muted-foreground truncate">{rev.role}</span>
                            <Badge
                              className={`mt-1 text-[8px] px-1.5 py-0 ${
                                rev.decision === "Approved"
                                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold"
                                  : "bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold"
                              }`}
                            >
                              {rev.decision}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 13: System Information */}
                  <Card className="border-border/80 shadow-xs hover:shadow-md transition-all bg-white dark:bg-slate-900 md:col-span-3">
                    <CardHeader className="p-3.5 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-2">
                        <History className="h-4 w-4 text-blue-600" />
                        System Information & Audit Trail
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-mono">{record.designVersion}</Badge>
                    </CardHeader>
                    <CardContent className="p-3.5 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Created By</span>
                          <span className="font-bold text-slate-900 dark:text-white">{record.designerName}</span>
                          <span className="block text-[9px] text-muted-foreground">{record.createdOn}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Last Modified By</span>
                          <span className="font-bold text-slate-900 dark:text-white">{record.designerName}</span>
                          <span className="block text-[9px] text-muted-foreground">{record.lastUpdated}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Workflow Stage</span>
                          <span className="font-semibold text-primary">{record.workflowStatus}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-[10px]">Audit Links</span>
                          <div className="flex flex-wrap gap-1.5 mt-0.5 text-[10px] font-medium text-primary">
                            <span className="hover:underline cursor-pointer">View Log &rarr;</span>
                            <span className="hover:underline cursor-pointer">View History &rarr;</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            </div>
          </div>

          {/* ====================================================================
             RIGHT INSIGHTS PANEL (3 cols on desktop)
             ==================================================================== */}
          <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-6 space-y-4">
              {/* Overall Score Card */}
              <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Overall Design Score</span>
                    <Award className="h-4 w-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 text-center space-y-4">
                  <div className="relative mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary/10 border-4 border-primary/20 p-2">
                    <div>
                      <span className="text-3xl font-black text-primary dark:text-blue-400">{record.overallDesignScore}%</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-left text-xs border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">UX Score</span>
                      <span className="font-bold text-slate-900 dark:text-white">{record.uxScore ?? record.uxReadinessScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Visual Design</span>
                      <span className="font-bold text-slate-900 dark:text-white">{record.visualDesignScore ?? record.uiReadinessScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accessibility</span>
                      <span className="font-bold text-emerald-600">{record.accessibilityScore}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usability</span>
                      <span className="font-bold text-slate-900 dark:text-white">88%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Development Readiness</span>
                      <span className="font-bold text-primary">{record.developmentReadinessScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>
        </div>
      </div>

      {/* ====================================================================
         5. MODALS & DIALOGS
         ==================================================================== */}

      {/* Persona Detail Modal */}
      {selectedPersona && (
        <Dialog open={!!selectedPersona} onOpenChange={() => setSelectedPersona(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold">{selectedPersona.name}</h3>
                  <p className="text-xs text-primary font-normal">{selectedPersona.role}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <p className="text-muted-foreground">{selectedPersona.bio}</p>
              <div>
                <span className="font-bold block mb-1">Pain Points:</span>
                <ul className="list-disc list-inside text-rose-600 dark:text-rose-400 space-y-0.5">
                  {selectedPersona.painPoints.map((pp: string, i: number) => (
                    <li key={i}>{pp}</li>
                  ))}
                </ul>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setSelectedPersona(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Wireframe Zoom Modal */}
      {selectedWireframe && (
        <Dialog open={!!selectedWireframe} onOpenChange={() => setSelectedWireframe(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex justify-between items-center">
                <span>{selectedWireframe.title} ({selectedWireframe.type})</span>
                <Badge variant="outline">{selectedWireframe.version}</Badge>
              </DialogTitle>
            </DialogHeader>
            <div className="relative h-96 w-full bg-slate-950 rounded-lg flex flex-col items-center justify-center text-white p-6 gap-3 border border-slate-800">
              <div className="h-16 w-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                <Layout className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-slate-100">{selectedWireframe.title} Screen Specification</h3>
              <p className="text-xs text-slate-400 max-w-md text-center">
                High-fidelity layout blueprint with auto-layout frame constraints, interactive state bindings, component variants, and accessibility tokens.
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={() => toast.success("Screen layout tokens verified.")}>
                  <CheckCircle2 className="h-4 w-4 mr-1.5 text-emerald-400" /> Validate Design Tokens
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setSelectedWireframe(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Upload File Modal */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Upload Design Attachment</DialogTitle>
            <DialogDescription className="text-xs">Drag and drop Figma, PDF, PNG, or JSON files.</DialogDescription>
          </DialogHeader>
          <div className="border-2 border-dashed border-primary/40 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-800/40 space-y-2">
            <Upload className="h-8 w-8 text-primary mx-auto" />
            <p className="text-xs font-semibold">Drop files here or click to browse</p>
            <p className="text-[10px] text-muted-foreground">Supports files up to 100MB</p>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setIsUploadOpen(false); toast.success("File uploaded successfully!"); }} className="bg-primary text-white">Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Review Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Schedule Stakeholder Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold block mb-1">Select Date:</label>
              <Input type="date" className="text-xs" />
            </div>
            <div>
              <label className="font-bold block mb-1">Reviewers:</label>
              <Input defaultValue="Rahul Sharma, Ananya Iyer, Vikram Singh" className="text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setIsScheduleModalOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => { setIsScheduleModalOpen(false); toast.success("Review meeting scheduled!"); }} className="bg-primary text-white">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Command Palette (Cmd+K) */}
      <Dialog open={isCommandPaletteOpen} onOpenChange={setIsCommandPaletteOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="flex items-center border-b px-3">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type a command or search section..."
              className="border-0 focus-visible:ring-0 text-xs h-11"
            />
          </div>
          <div className="p-2 space-y-1 text-xs max-h-64 overflow-y-auto">
            {UI_UX_TABS.filter((t) => t.label.toLowerCase().includes(searchQuery.toLowerCase())).map((tab) => (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsCommandPaletteOpen(false);
                }}
                className="flex items-center justify-between p-2 rounded hover:bg-primary/10 cursor-pointer"
              >
                <span className="font-medium">{tab.label}</span>
                <Badge variant="outline" className="text-[10px]">{tab.badge || "Tab"}</Badge>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </AppShell>
  );
}

export default UiUxDevelopmentNewPage;


