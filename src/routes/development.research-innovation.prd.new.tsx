import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState, type ReactNode } from "react";
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
  User,
  Printer,
  Share2,
  FileSpreadsheet,
  FileCode,
  Info,
  Clock,
  ChevronRight,
  TrendingUp,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { PrdTabBar, type PrdTabId } from "@/components/erp/PrdTabBar";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ErpButton } from "@/components/erp/Button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StarRating } from "@/components/erp/StarRating";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { prdService } from "@/services";
import { calculatePrdScores } from "@/lib/prdFns.server";
import type {
  PrdApprovalDecision,
  PrdFormInput,
  PrdRecord,
  PrdStage,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/prd/new",
)({
  head: () => ({ meta: [{ title: "Product Requirements Document (PRD) Form · Magnertia ERP" }] }),
  component: PrdFormPage,
});

function CircularScoreGauge({ score, label = "PRD SCORE" }: { score: number; label?: string }) {
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = "text-emerald-500 stroke-emerald-500";
  if (score < 60) scoreColor = "text-amber-500 stroke-amber-500";
  if (score < 40) scoreColor = "text-rose-500 stroke-rose-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-28 h-28 transform -rotate-90">
        <circle cx="56" cy="56" r="42" className="stroke-muted/30 fill-none" strokeWidth="8" />
        <circle
          cx="56"
          cy="56"
          r="42"
          className={cn("fill-none transition-all duration-1000 ease-out", scoreColor)}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-foreground">{score}%</span>
      </div>
    </div>
  );
}

export function PrdFormPage({
  breadcrumb = "Development > Research & Innovation",
  tabs = <PrdTabBar />,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<PrdTabId>("overview");

  // Linked Record Dialog States
  const [showProductModal, setShowProductModal] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [showSystemDesignModal, setShowSystemDesignModal] = useState(false);

  // Modals & Drawers
  const [showReviewDecisionModal, setShowReviewDecisionModal] = useState(false);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);

  // Committee Review Decision Form State
  const [reviewDecisionChoice, setReviewDecisionChoice] = useState<PrdApprovalDecision>("approved");
  const [reviewComments, setReviewComments] = useState("");

  // Data Fetching
  const { data: record, isLoading } = useQuery({
    queryKey: ["prdRecord"],
    queryFn: () => prdService.fetchRecord(),
  });

  // Local Form Input State
  const [formInput, setFormInput] = useState<PrdFormInput | null>(null);

  useEffect(() => {
    if (record && !formInput) {
      setFormInput(record.input);
    }
  }, [record, formInput]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: PrdFormInput) => prdService.saveDraft(input, record?.id),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["prdRecord"], updatedRecord);
      setFormInput(updatedRecord.input);
      toast.success("PRD draft saved successfully.");
    },
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: PrdStage) =>
      prdService.advanceStage(record?.id || "prd-record-0017", targetStage),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["prdRecord"], updatedRecord);
      setFormInput(updatedRecord.input);
      toast.success(`Stage advanced to ${updatedRecord.currentStageLabel}`);
    },
  });

  const submitMutation = useMutation({
    mutationFn: () => prdService.submitForReview(record?.id || "prd-record-0017"),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["prdRecord"], updatedRecord);
      setFormInput(updatedRecord.input);
      toast.success("PRD submitted for Executive Review");
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: () =>
      prdService.reviewDecision({
        id: record?.id || "prd-record-0017",
        decision: reviewDecisionChoice,
        comments: reviewComments,
      }),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["prdRecord"], updatedRecord);
      setFormInput(updatedRecord.input);
      setShowReviewDecisionModal(false);
      if (reviewDecisionChoice === "approved" || reviewDecisionChoice === "approved_with_conditions") {
        toast.success(`PRD APPROVED! System Design Project ${updatedRecord.linkedSystemDesignId} auto-created.`);
        setShowSystemDesignModal(true);
      } else {
        toast.info(`Committee decision recorded: ${reviewDecisionChoice}`);
      }
    },
  });

  const handleInputChange = <K extends keyof PrdFormInput>(
    field: K,
    value: PrdFormInput[K]
  ) => {
    if (!formInput) return;
    setFormInput({ ...formInput, [field]: value });
  };

  if (isLoading || !record || !formInput) {
    return (
      <AppShell
        title="Product Requirements Document (PRD)"
        breadcrumb={breadcrumb}
        tabs={tabs}
      >
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AppShell>
    );
  }

  const isEditable =
    record.status === "draft" ||
    record.status === "product_definition" ||
    record.status === "functional_ux_requirements" ||
    record.status === "technical_requirements" ||
    record.status === "revision_required";

  const liveCalculated = calculatePrdScores(formInput);
  const activeReadiness = liveCalculated.readinessSummary;
  const activeAiQuality = liveCalculated.aiQuality;
  const activeHighlights = liveCalculated.keyHighlights;

  return (
    <AppShell
      title="Product Requirements Document (PRD)"
      breadcrumb={breadcrumb}
      description="Define detailed product requirements, target specifications, compliance criteria, and acceptance gates."
      tabs={tabs}
    >
      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* 2. RECORD HEADER BAR                                                      */}
        {/* ========================================================================= */}
        <Card className="border border-border/80 shadow-xs bg-card mb-4 overflow-hidden rounded-xl">
          {/* TOP ROW: Record Identity, Editable Title, & Action Buttons */}
          <div className="p-4 sm:p-5 pb-4 bg-slate-50/70 dark:bg-slate-900/90 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Identity & Title */}
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50 shadow-2xs">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/60">
                    {record.prdId}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <Badge variant="outline" className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800">
                    {record.formCode}
                  </Badge>
                  <Badge variant="outline" className="font-mono text-[11px] font-bold text-primary bg-primary/10 border-primary/20">
                    {formInput.prdVersion}
                  </Badge>
                  <StatusBadge status={record.status} />
                  {record.linkedSystemDesignId && (
                    <Badge variant="secondary" className="font-mono text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 flex items-center gap-1">
                      <Cpu className="h-3 w-3" /> System Design: {record.linkedSystemDesignId}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={formInput.prdTitle}
                    onChange={(e) => handleInputChange("prdTitle", e.target.value)}
                    disabled={!isEditable}
                    title={formInput.prdTitle}
                    className="text-base sm:text-lg font-bold text-foreground bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary shadow-none px-2 py-0.5 transition-all rounded-md w-full min-w-0 focus:outline-none"
                    placeholder="Product Requirements Document Title..."
                  />
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <ErpButton
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate(formInput)}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{saveDraftMutation.isPending ? "Saving..." : "Save Draft"}</span>
              </ErpButton>

              {record.status === "executive_review" ? (
                <ErpButton
                  variant="primary"
                  size="sm"
                  onClick={() => setShowReviewDecisionModal(true)}
                  className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold"
                >
                  <Award className="h-3.5 w-3.5" />
                  <span>Committee Review</span>
                </ErpButton>
              ) : (
                <ErpButton
                  variant="primary"
                  size="sm"
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending}
                  className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit for Review</span>
                </ErpButton>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-slate-800 shadow-2xs">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs shadow-lg">
                  <DropdownMenuItem onClick={() => setShowProductModal(true)} className="gap-2 cursor-pointer">
                    <Zap className="h-4 w-4 text-emerald-600" />
                    View Linked Product
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowRoadmapModal(true)} className="gap-2 cursor-pointer">
                    <Map className="h-4 w-4 text-blue-600" />
                    View Linked Roadmap
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowReleaseModal(true)} className="gap-2 cursor-pointer">
                    <Layers className="h-4 w-4 text-amber-600" />
                    View Linked Release
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    toast.success("Printing PRD Report...");
                    window.print();
                  }} className="gap-2 cursor-pointer">
                    <Printer className="h-4 w-4 text-slate-600" />
                    Print / Export PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("PRD link copied to clipboard!");
                  }} className="gap-2 cursor-pointer">
                    <Share2 className="h-4 w-4 text-slate-600" />
                    Share PRD Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* BOTTOM ROW: Key-Value Structured Metadata Ribbon */}
          <div className="px-4 py-2.5 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs divide-y sm:divide-y-0 sm:divide-x divide-border/60">
            {/* Linked Product */}
            <div className="flex flex-col gap-0.5 sm:pr-2">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Zap className="h-3 w-3 text-emerald-500" /> Linked Product
              </span>
              <button
                type="button"
                onClick={() => setShowProductModal(true)}
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
              >
                <span className="truncate">{formInput.linkedProductName}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* Linked Roadmap */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Map className="h-3 w-3 text-blue-500" /> Linked Roadmap
              </span>
              <button
                type="button"
                onClick={() => setShowRoadmapModal(true)}
                className="font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
              >
                <span className="truncate">{formInput.linkedRoadmapId}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* Linked Release */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Layers className="h-3 w-3 text-amber-500" /> Linked Release
              </span>
              <button
                type="button"
                onClick={() => setShowReleaseModal(true)}
                className="font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
              >
                <span className="truncate">{formInput.linkedReleaseName}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* Business Unit */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Building2 className="h-3 w-3 text-slate-400" /> Business Unit
              </span>
              <span className="font-semibold text-foreground truncate">{formInput.businessUnit}</span>
            </div>

            {/* Product Owner */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" /> Product Owner
              </span>
              <span className="font-semibold text-foreground truncate">{formInput.productOwnerName}</span>
            </div>

            {/* Planned Release */}
            <div className="flex flex-col gap-0.5 sm:pl-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <Calendar className="h-3 w-3 text-slate-400" /> Planned Release
              </span>
              <span className="font-medium text-slate-600 dark:text-slate-400 truncate">{formInput.plannedReleaseDate}</span>
            </div>
          </div>
        </Card>

        {/* ========================================================================= */}
        {/* TAB CONTROLS & OVERVIEW TAB CONTENT                                       */}
        {/* ========================================================================= */}
        {activeTab !== "overview" ? (
          <div className="card-soft p-12 bg-card border border-border/80 rounded-xl text-center space-y-4 shadow-sm">
            <ClipboardCheck className="h-12 w-12 text-primary mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-foreground">
              {activeTab === "business_reqs" && "Business Requirements Detail Matrix"}
              {activeTab === "functional_reqs" && "Functional Requirements & User Story Backlog"}
              {activeTab === "non_functional" && "Non-Functional & Compliance Requirements"}
              {activeTab === "ux_reqs" && "UX/UI Design Requirements & Wireframes"}
              {activeTab === "technical_reqs" && "Technical Architecture & API Specifications"}
              {activeTab === "risk_deps" && "Risk Evaluation & Dependency Matrix"}
              {activeTab === "acceptance_testing" && "Acceptance Criteria & Test Strategy"}
              {activeTab === "ai_assessment" && "AI Deep-Dive Quality & Scope Evaluation"}
              {activeTab === "summary" && "Executive PRD Summary & Sign-Off Record"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              This tab is configured in deep-linkable preview mode. Switch back to <strong>Overview</strong> to view all 12 combined PRD dashboard panels.
            </p>
            <ErpButton variant="primary" size="sm" onClick={() => setActiveTab("overview")}>
              Return to Overview Tab
            </ErpButton>
          </div>
        ) : (
          /* OVERVIEW TAB (12 Functional Panels) */
          <div className="space-y-6">

            {/* TOP 3 CARDS ROW: PANEL 1, PANEL 2, PANEL 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* PANEL 1: Product Overview (Left 7 Cols) */}
              <div className="lg:col-span-7 card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Compass className="h-4 w-4 text-blue-600" />
                    <h3 className="text-base font-bold text-foreground">Product Overview</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">Inherited from {formInput.linkedRoadmapId}</span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-muted-foreground mb-1">Product Vision (Inherited)</label>
                    <textarea
                      rows={2}
                      value={formInput.productVision}
                      onChange={(e) => handleInputChange("productVision", e.target.value)}
                      disabled={!isEditable}
                      className="w-full p-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-muted-foreground mb-1">Business Objective</label>
                    <textarea
                      rows={2}
                      value={formInput.businessObjective}
                      onChange={(e) => handleInputChange("businessObjective", e.target.value)}
                      disabled={!isEditable}
                      className="w-full p-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-muted-foreground mb-1">Problem Statement</label>
                    <textarea
                      rows={2}
                      value={formInput.problemStatement}
                      onChange={(e) => handleInputChange("problemStatement", e.target.value)}
                      disabled={!isEditable}
                      className="w-full p-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Product Scope</label>
                      <textarea
                        rows={2}
                        value={formInput.productScope}
                        onChange={(e) => handleInputChange("productScope", e.target.value)}
                        disabled={!isEditable}
                        className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-muted-foreground mb-1">Out of Scope</label>
                      <textarea
                        rows={2}
                        value={formInput.outOfScope}
                        onChange={(e) => handleInputChange("outOfScope", e.target.value)}
                        disabled={!isEditable}
                        className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT 5 COLS: PANEL 2 (Quick Info) & PANEL 3 (PRD Readiness) */}
              <div className="lg:col-span-5 space-y-6">

                {/* PANEL 2: Quick Info */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-foreground">Quick Info</h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Product Line:</span>
                      <span className="font-semibold text-foreground">{formInput.productLine}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium text-foreground">{formInput.category}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Target Market:</span>
                      <span className="font-medium text-foreground max-w-[200px] truncate">{formInput.targetMarket}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Primary Users:</span>
                      <span className="font-medium text-foreground">{formInput.primaryUsers}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/40">
                      <span className="text-muted-foreground">Document Version:</span>
                      <span className="font-bold text-primary">{formInput.prdVersion}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Next Review Date:</span>
                      <span className="font-mono text-foreground">{formInput.nextReviewDate}</span>
                    </div>
                  </div>
                </div>

                {/* PANEL 3: PRD Readiness Overview */}
                <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-foreground">PRD Readiness Overview</h3>
                  </div>

                  <div className="flex items-center justify-around">
                    <CircularScoreGauge score={activeReadiness.overallPrdScore} label="PRD SCORE" />
                    <div className="space-y-2 text-xs flex-1 pl-4">
                      <div>
                        <div className="flex justify-between text-[11px] font-medium mb-0.5">
                          <span className="text-muted-foreground">Business Readiness</span>
                          <span className="font-bold text-foreground">{activeReadiness.businessReadiness}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${activeReadiness.businessReadiness}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-medium mb-0.5">
                          <span className="text-muted-foreground">Functional Completeness</span>
                          <span className="font-bold text-foreground">{activeReadiness.functionalCompleteness}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: `${activeReadiness.functionalCompleteness}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-medium mb-0.5">
                          <span className="text-muted-foreground">Technical Readiness</span>
                          <span className="font-bold text-foreground">{activeReadiness.technicalReadiness}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${activeReadiness.technicalReadiness}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* SECOND ROW: PANEL 5 (AI PRD Quality Score) */}
            <div className="card-soft p-5 bg-gradient-to-br from-primary/5 via-card to-card border border-primary/20 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-base font-bold text-foreground">AI PRD Quality Score</h3>
                </div>
                <button type="button" onClick={() => setActiveTab("ai_assessment")} className="text-xs font-semibold text-primary hover:underline">
                  View AI Insights →
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded bg-card border text-center">
                  <span className="text-[10px] text-muted-foreground block">Completeness</span>
                  <span className="font-bold text-primary">{activeAiQuality.requirementCompleteness}%</span>
                </div>
                <div className="p-2 rounded bg-card border text-center">
                  <span className="text-[10px] text-muted-foreground block">Consistency</span>
                  <span className="font-bold text-emerald-600">{activeAiQuality.requirementConsistency}%</span>
                </div>
                <div className="p-2 rounded bg-card border text-center">
                  <span className="text-[10px] text-muted-foreground block">Risk Assess</span>
                  <span className="font-bold text-amber-600">{activeAiQuality.riskAssessment}%</span>
                </div>
                <div className="p-2 rounded bg-card border text-center">
                  <span className="text-[10px] text-muted-foreground block">AI Confidence</span>
                  <span className="font-bold text-purple-600">{activeAiQuality.aiConfidenceScore}%</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground italic leading-snug">
                "{activeAiQuality.aiInsightsSummary}"
              </p>
            </div>

            {/* THIRD ROW: TABLES (PANEL 6, PANEL 7, PANEL 8, PANEL 9) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* PANEL 6: Recent Business Requirements */}
              <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <ClipboardCheck className="h-4 w-4 text-blue-600" />
                    <h3 className="text-base font-bold text-foreground">Recent Business Requirements</h3>
                  </div>
                  <button type="button" onClick={() => setActiveTab("business_reqs")} className="text-xs font-semibold text-primary hover:underline">
                    View All
                  </button>
                </div>

                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 border-b text-muted-foreground font-medium">
                      <th className="p-2.5">Req ID</th>
                      <th className="p-2.5">Requirement Title</th>
                      <th className="p-2.5">Priority</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formInput.businessRequirements.map((br) => (
                      <tr key={br.id} className="hover:bg-muted/20">
                        <td className="p-2.5 font-bold text-primary">{br.id}</td>
                        <td className="p-2.5 font-medium text-foreground">{br.title}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                            {br.priority}
                          </span>
                        </td>
                        <td className="p-2.5"><StatusBadge status={br.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PANEL 7: Top Functional Requirements */}
              <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4 text-blue-600" />
                    <h3 className="text-base font-bold text-foreground">Top Functional Requirements</h3>
                  </div>
                  <button type="button" onClick={() => setActiveTab("functional_reqs")} className="text-xs font-semibold text-primary hover:underline">
                    View All
                  </button>
                </div>

                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 border-b text-muted-foreground font-medium">
                      <th className="p-2.5">User Story ID</th>
                      <th className="p-2.5">Feature / User Story</th>
                      <th className="p-2.5">Priority</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formInput.functionalRequirements.map((fr) => (
                      <tr key={fr.id} className="hover:bg-muted/20">
                        <td className="p-2.5 font-bold text-primary">{fr.id}</td>
                        <td className="p-2.5 font-medium text-foreground max-w-[240px] truncate" title={fr.featureStory}>
                          {fr.featureStory}
                        </td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600">
                            {fr.priority}
                          </span>
                        </td>
                        <td className="p-2.5"><StatusBadge status={fr.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PANEL 8: Key Milestones */}
              <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h3 className="text-base font-bold text-foreground">Key Milestones</h3>
                  </div>
                  <button type="button" onClick={() => setActiveTab("summary")} className="text-xs font-semibold text-primary hover:underline">
                    View All
                  </button>
                </div>

                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 border-b text-muted-foreground font-medium">
                      <th className="p-2.5">Milestone</th>
                      <th className="p-2.5">Planned Date</th>
                      <th className="p-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formInput.milestones.map((ms, idx) => (
                      <tr key={idx} className="hover:bg-muted/20">
                        <td className="p-2.5 font-medium text-foreground">{ms.milestone}</td>
                        <td className="p-2.5 text-muted-foreground font-mono">{ms.plannedDate}</td>
                        <td className="p-2.5"><StatusBadge status={ms.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* PANEL 9: Risk Summary */}
              <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="h-4 w-4 text-amber-600" />
                    <h3 className="text-base font-bold text-foreground">Risk Summary</h3>
                  </div>
                  <button type="button" onClick={() => setActiveTab("risk_deps")} className="text-xs font-semibold text-primary hover:underline">
                    View All Risks
                  </button>
                </div>

                <table className="w-full border-collapse text-left text-xs">
                  <thead>
                    <tr className="bg-muted/40 border-b text-muted-foreground font-medium">
                      <th className="p-2.5">Risk Category</th>
                      <th className="p-2.5">Risk Level</th>
                      <th className="p-2.5">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {formInput.risks.map((rk, idx) => (
                      <tr key={idx} className="hover:bg-muted/20">
                        <td className="p-2.5 font-medium text-foreground">{rk.riskType}</td>
                        <td className="p-2.5">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded text-[10px] font-bold",
                              rk.riskLevel === "High"
                                ? "bg-rose-500/10 text-rose-600"
                                : rk.riskLevel === "Medium"
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-emerald-500/10 text-emerald-600"
                            )}
                          >
                            {rk.riskLevel} Risk
                          </span>
                        </td>
                        <td className="p-2.5">
                          <StarRating value={rk.scoreStars * 2} readOnly size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

            {/* BOTTOM PANELS: PANEL 10 (Attachments), PANEL 11 (Review Matrix), PANEL 12 (System Info) */}
            {/* PANEL 10: Attachments */}
            <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  <h3 className="text-base font-bold text-foreground">Attachments & Reference Artifacts</h3>
                </div>
                <ErpButton variant="outline" size="sm" className="gap-1 text-xs">
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </ErpButton>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {formInput.attachments.map((att) => (
                  <div key={att.id} className="p-3 rounded-lg border border-border bg-muted/20 flex flex-col justify-between space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground truncate" title={att.name}>{att.name}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-muted-foreground">
                      <span>{att.size}</span>
                      <div className="flex gap-1">
                        <button type="button" className="p-1 hover:text-primary"><Eye className="h-3 w-3" /></button>
                        <button type="button" className="p-1 hover:text-primary"><Download className="h-3 w-3" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PANEL 11: Review & Approval Matrix */}
            <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <h3 className="text-base font-bold text-foreground">Executive Review & Approval Matrix</h3>
                </div>
                <span className="text-xs text-muted-foreground">6 Key Sign-Off Roles</span>
              </div>

              {/* 6 Executive Reviewers Table */}
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-muted/40 border-b text-muted-foreground font-medium">
                    <th className="p-2.5">Executive Role</th>
                    <th className="p-2.5">Person</th>
                    <th className="p-2.5">Decision</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {formInput.reviewers.map((rev) => (
                    <tr key={rev.id} className="hover:bg-muted/20">
                      <td className="p-2.5 font-bold text-foreground">{rev.role}</td>
                      <td className="p-2.5 text-muted-foreground">{rev.person}</td>
                      <td className="p-2.5">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-bold",
                            rev.decision === "Approved"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600"
                          )}
                        >
                          {rev.decision}
                        </span>
                      </td>
                      <td className="p-2.5 text-muted-foreground">{rev.status}</td>
                      <td className="p-2.5 text-muted-foreground font-mono">{rev.date || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Review Form Controls */}
              <div className="space-y-3 pt-2 border-t text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-muted-foreground mb-1">Approval Decision</label>
                    <select
                      value={formInput.approvalDecision || "approved"}
                      onChange={(e) => handleInputChange("approvalDecision", e.target.value as PrdApprovalDecision)}
                      disabled={!isEditable}
                      className="w-full p-2.5 text-xs rounded-lg border border-border bg-background"
                    >
                      <option value="approved">Approved (Proceed to System Design)</option>
                      <option value="approved_with_conditions">Approved with Conditions</option>
                      <option value="revision_required">Revision Required</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-muted-foreground mb-1">Approval Date</label>
                    <input
                      type="date"
                      value={formInput.approvalDate}
                      onChange={(e) => handleInputChange("approvalDate", e.target.value)}
                      disabled={!isEditable}
                      className="w-full p-2 text-xs rounded-lg border border-border bg-background"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block font-medium text-muted-foreground">Review Comments</label>
                    <span className="text-[10px] text-muted-foreground">{formInput.reviewComments.length} / 2000 chars</span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={2000}
                    value={formInput.reviewComments}
                    onChange={(e) => handleInputChange("reviewComments", e.target.value)}
                    disabled={!isEditable}
                    className="w-full p-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            {/* PANEL 12: System Information */}
            <div className="card-soft p-5 bg-card border border-border/80 rounded-xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <History className="h-4 w-4 text-blue-600" />
                  <h3 className="text-base font-bold text-foreground">System Information & Audit Trail</h3>
                </div>
                <span className="text-xs text-muted-foreground">Version {record.version}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Created By</span>
                  <span className="font-semibold text-foreground">{formInput.productOwnerName}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Date Created</span>
                  <span className="font-semibold text-foreground">{record.dateCreated}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Last Modified</span>
                  <span className="font-semibold text-foreground">{record.lastModified}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30">
                  <span className="text-[10px] text-muted-foreground block">Stage</span>
                  <StatusBadge status={record.status} />
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2 text-xs border-t">
                <button type="button" onClick={() => setShowAuditModal(true)} className="flex items-center gap-1 text-primary hover:underline font-medium">
                  <History className="h-3.5 w-3.5" /> Audit Trail (View Log)
                </button>
                <button type="button" onClick={() => setShowActivityModal(true)} className="flex items-center gap-1 text-primary hover:underline font-medium">
                  <Activity className="h-3.5 w-3.5" /> Activity History
                </button>
                <button type="button" onClick={() => setShowChangeModal(true)} className="flex items-center gap-1 text-primary hover:underline font-medium">
                  <FileCode className="h-3.5 w-3.5" /> Change History
                </button>
                <button type="button" onClick={() => setShowWorkflowModal(true)} className="flex items-center gap-1 text-primary hover:underline font-medium">
                  <Layers className="h-3.5 w-3.5" /> Workflow History
                </button>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* DIALOGS */}
      {/* Linked Product Dialog */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-500" />
              <span>Linked Product: {formInput.linkedProductName}</span>
            </DialogTitle>
            <DialogDescription>Product Master Record</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Product Code:</span>
              <span className="font-semibold text-foreground">PRD-1001</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span className="text-muted-foreground">Product Line:</span>
              <span className="font-medium text-foreground">{formInput.productLine}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Lifecycle Stage:</span>
              <StatusBadge status="active" />
            </div>
          </div>
          <DialogFooter>
            <ErpButton variant="outline" size="sm" onClick={() => setShowProductModal(false)}>Close</ErpButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Linked System Design Dialog */}
      <Dialog open={showSystemDesignModal} onOpenChange={setShowSystemDesignModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-purple-500" />
              <span>Linked System Design Project</span>
            </DialogTitle>
            <DialogDescription>
              {record.linkedSystemDesignId
                ? `System Design Project Record: ${record.linkedSystemDesignId}`
                : "System Design is auto-created upon Executive Approval."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs pt-2">
            {record.linkedSystemDesignId ? (
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 font-medium">
                ✓ System Design Project <span className="font-bold">{record.linkedSystemDesignId}</span> initiated. Proceeding to System Architecture & API schema design.
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
                PRD is currently in <span className="font-bold">{record.status}</span> status. Submit to Executive Committee and gain Approval to initiate System Design.
              </div>
            )}
          </div>
          <DialogFooter>
            <ErpButton variant="outline" size="sm" onClick={() => setShowSystemDesignModal(false)}>Close</ErpButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Committee Decision Modal */}
      <Dialog open={showReviewDecisionModal} onOpenChange={setShowReviewDecisionModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span>PRD Executive Review Committee Decision</span>
            </DialogTitle>
            <DialogDescription>
              Evaluate PRD {record.prdId} and issue official committee decision.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 text-xs pt-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReviewDecisionChoice("approved")}
                className={cn(
                  "p-3 rounded-lg border text-left flex flex-col justify-between transition-all",
                  reviewDecisionChoice === "approved"
                    ? "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold ring-2 ring-emerald-500/30"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>1. Approved</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">Auto-creates System Design SYS-2024-XXXX</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewDecisionChoice("approved_with_conditions")}
                className={cn(
                  "p-3 rounded-lg border text-left flex flex-col justify-between transition-all",
                  reviewDecisionChoice === "approved_with_conditions"
                    ? "border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-300 font-bold ring-2 ring-blue-500/30"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>2. Conditions</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">Approved with Requirement updates</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewDecisionChoice("revision_required")}
                className={cn(
                  "p-3 rounded-lg border text-left flex flex-col justify-between transition-all",
                  reviewDecisionChoice === "revision_required"
                    ? "border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold ring-2 ring-amber-500/30"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <span>3. Revision</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">Returns for scope/technical updates</span>
              </button>

              <button
                type="button"
                onClick={() => setReviewDecisionChoice("rejected")}
                className={cn(
                  "p-3 rounded-lg border text-left flex flex-col justify-between transition-all",
                  reviewDecisionChoice === "rejected"
                    ? "border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 font-bold ring-2 ring-rose-500/30"
                    : "border-border bg-background hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-1.5">
                  <X className="h-4 w-4 text-rose-600" />
                  <span>4. Rejected</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">Archives PRD document</span>
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium text-muted-foreground">Committee Comments & Notes</label>
                <span className="text-[10px] text-muted-foreground">{reviewComments.length} / 2000</span>
              </div>
              <textarea
                rows={3}
                maxLength={2000}
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Enter executive review notes, conditions, or required changes..."
                className="w-full p-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <DialogFooter>
            <ErpButton variant="outline" size="sm" onClick={() => setShowReviewDecisionModal(false)}>Cancel</ErpButton>
            <ErpButton
              variant="primary"
              size="sm"
              onClick={() => reviewDecisionMutation.mutate()}
              disabled={reviewDecisionMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Submit Committee Decision
            </ErpButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Trail Modal */}
      <Dialog open={showAuditModal} onOpenChange={setShowAuditModal}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-500" />
              <span>Audit Trail & Governance Log</span>
            </DialogTitle>
            <DialogDescription>Complete immutable event history for PRD {record.prdId}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs max-h-96 overflow-y-auto pr-1 pt-2">
            {record.auditTrail.map((entry) => (
              <div key={entry.id} className="p-3 rounded-lg border border-border bg-card/60 space-y-1">
                <div className="flex justify-between items-center text-muted-foreground font-mono text-[11px]">
                  <span>{entry.timestamp}</span>
                  <span className="font-semibold text-foreground">{entry.user}</span>
                </div>
                <div className="font-bold text-primary">{entry.action}</div>
                <p className="text-muted-foreground leading-relaxed">{entry.details}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <ErpButton variant="primary" size="sm" onClick={() => setShowAuditModal(false)}>Close</ErpButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
