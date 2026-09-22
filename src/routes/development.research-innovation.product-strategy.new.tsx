// Product Strategy Form - Magnertia ERP
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Save,
  Send,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  User,
  Building2,
  FileText,
  Download,
  Upload,
  Plus,
  X,
  Sparkles,
  CheckCircle2,
  Check,
  AlertTriangle,
  History,
  Activity,
  Layers,
  ArrowRight,
  Calculator,
  ShieldAlert,
  Briefcase,
  TrendingUp,
  Target,
  Clock,
  ChevronRight,
  PieChart,
  Award,
  Zap,
  Map,
  FileCheck,
  BrainCircuit,
  Paperclip,
  Eye,
  Trash2,
  FileSpreadsheet,
  BarChart2,
  Compass,
  Box,
  DollarSign,
  ShieldCheck,
  Printer,
  Share2,
  HelpCircle,
} from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { ErpButton } from "@/components/erp/Button";
import { StarRating } from "@/components/erp/StarRating";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { productStrategyService } from "@/services/productStrategyService";
import { calculateProductStrategyScores } from "@/lib/productStrategyFns.server";
import type {
  ProductStrategyApprovalDecision,
  ProductStrategyFormInput,
  ProductStrategyRecord,
  ProductStrategyStage,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/product-strategy/new",
)({
  head: () => ({ meta: [{ title: "Product Strategy Form · Magnertia ERP" }] }),
  component: () => (
    <ProductStrategyFormPage
      breadcrumb="Development > Product Strategy"
      tabs={<ProductDevelopmentTabBar />}
    />
  ),
});

function formatCurrency(val: number): string {
  if (!val || isNaN(val)) return "₹ 0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(val);
}

function CircularScoreGauge({ score }: { score: number }) {
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
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-bold tracking-tight text-foreground">{score}%</span>
        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Overall</span>
      </div>
    </div>
  );
}

export type StrategyTabId = "form" | "portfolio" | "roadmaps" | "ai" | "audit";

export function ProductStrategyFormPage({
  breadcrumb = "Development > Product Development",
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<StrategyTabId>("form");

  // Decision Modal States
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [decisionChoice, setDecisionChoice] = useState<ProductStrategyApprovalDecision>("approved");
  const [decisionComments, setDecisionComments] = useState("");
  const [showRoadmapSuccessModal, setShowRoadmapSuccessModal] = useState(false);

  // New tag inputs
  const [newTargetCustomer, setNewTargetCustomer] = useState("");
  const [newMarketSegment, setNewMarketSegment] = useState("");
  const [newEmergingTech, setNewEmergingTech] = useState("");
  const [newEnergyStrategy, setNewEnergyStrategy] = useState("");
  const [newKeyPartnership, setNewKeyPartnership] = useState("");

  // Query Data
  const { data: record, isLoading } = useQuery<ProductStrategyRecord>({
    queryKey: ["productStrategyRecord"],
    queryFn: productStrategyService.fetchRecord,
  });

  const [formInput, setFormInput] = useState<ProductStrategyFormInput | null>(null);

  useEffect(() => {
    if (record?.input && !formInput) {
      setFormInput(record.input);
    }
  }, [record, formInput]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: ProductStrategyFormInput) => productStrategyService.saveDraft(input, record?.id),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["productStrategyRecord"], updatedRecord);
      setFormInput(updatedRecord.input);
      toast.success("Product Strategy draft saved successfully.");
    },
    onError: () => toast.error("Failed to save draft."),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: ProductStrategyStage) =>
      productStrategyService.advanceStage(record?.id || "ps-record-0017", targetStage),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["productStrategyRecord"], updatedRecord);
      setFormInput(updatedRecord.input);
      toast.success(`Strategy Stage advanced to ${updatedRecord.currentStageLabel}`);
    },
    onError: () => toast.error("Failed to advance stage."),
  });

  const submitMutation = useMutation({
    mutationFn: () => productStrategyService.submitForReview(record?.id || "ps-record-0017"),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["productStrategyRecord"], updatedRecord);
      setFormInput(updatedRecord.input);
      toast.success("Product Strategy submitted for Executive Committee Review");
    },
    onError: () => toast.error("Failed to submit for review."),
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: () =>
      productStrategyService.reviewDecision({
        id: record?.id || "ps-record-0017",
        decision: decisionChoice,
        comments: decisionComments,
      }),
    onSuccess: (updatedRecord) => {
      queryClient.setQueryData(["productStrategyRecord"], updatedRecord);
      setFormInput(updatedRecord.input);
      setShowDecisionModal(false);
      if (decisionChoice === "approved") {
        toast.success(`STRATEGY APPROVED! Linked Roadmap ${updatedRecord.linkedProductRoadmapId} auto-created.`);
        setShowRoadmapSuccessModal(true);
      } else {
        toast.info(`Executive Committee review recorded: ${decisionChoice}`);
      }
    },
    onError: () => toast.error("Failed to record review decision."),
  });

  const handleInputChange = <K extends keyof ProductStrategyFormInput>(
    field: K,
    value: ProductStrategyFormInput[K]
  ) => {
    if (!formInput) return;
    setFormInput({ ...formInput, [field]: value });
  };

  const handleArrayAdd = (field: "targetCustomers" | "marketSegments" | "emergingTechnologies" | "energyStrategy" | "keyPartnerships", val: string, setVal: (v: string) => void) => {
    if (!val.trim() || !formInput) return;
    if (!formInput[field].includes(val.trim())) {
      setFormInput({ ...formInput, [field]: [...formInput[field], val.trim()] });
    }
    setVal("");
  };

  const handleArrayRemove = (field: "targetCustomers" | "marketSegments" | "emergingTechnologies" | "energyStrategy" | "keyPartnerships", itemToRemove: string) => {
    if (!formInput) return;
    setFormInput({
      ...formInput,
      [field]: formInput[field].filter((item) => item !== itemToRemove),
    });
  };

  const liveCalculated = useMemo(() => {
    if (!formInput) return null;
    return calculateProductStrategyScores(formInput);
  }, [formInput]);

  if (isLoading || !record || !formInput || !liveCalculated) {
    return (
      <AppShell
        title="Product Strategy"
        breadcrumb={breadcrumb}
        tabs={tabs ?? <ProductDevelopmentTabBar />}
      >
        <div className="flex flex-col items-center justify-center h-96 space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="text-xs text-muted-foreground font-medium">Loading Product Strategy Workspace...</span>
        </div>
      </AppShell>
    );
  }

  const { sidebarSummary, aiAssessment, keyMetrics } = liveCalculated;

  return (
    <AppShell
      title="Product Strategy"
      breadcrumb={breadcrumb}
      description="Formulate product vision, strategic themes, portfolio positioning, and multi-year market roadmaps."
      tabs={tabs ?? <ProductDevelopmentTabBar />}
    >
      <div className="space-y-6 pb-12">
        {/* ========================================================================= */}
        {/* 1. RECORD HEADER & ACTION BAR                                             */}
        {/* ========================================================================= */}
        <Card className="border border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
          <div className="p-4 sm:p-5 bg-muted/20 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary shadow-inner">
                <Target className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-primary tracking-wide">{record.strategyId}</span>
                  <StatusBadge status={record.status} />
                  <Badge variant="outline" className="text-[10px] font-semibold py-0">
                    {record.businessUnit}
                  </Badge>
                  {record.linkedProductRoadmapId && (
                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-bold">
                      Roadmap: {record.linkedProductRoadmapId}
                    </Badge>
                  )}
                </div>
                <div className="mt-1 flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={formInput.strategyName}
                    onChange={(e) => handleInputChange("strategyName", e.target.value)}
                    title={formInput.strategyName}
                    className="text-base sm:text-lg font-bold text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors w-full min-w-0"
                  />
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" /> PM: <strong className="text-foreground">{record.productManagerName}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Horizon: <strong className="text-foreground">{formInput.strategyPeriodStart} to {formInput.strategyPeriodEnd}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Box className="h-3.5 w-3.5 text-muted-foreground" /> Product: <strong className="text-foreground">{record.linkedProductName}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
              <ErpButton
                size="sm"
                variant="outline"
                onClick={() => saveDraftMutation.mutate(formInput)}
                disabled={saveDraftMutation.isPending}
                className="cursor-pointer gap-1.5 shadow-2xs"
              >
                <Save className="h-4 w-4" /> Save Draft
              </ErpButton>

              {record.currentStage !== "executive_review" ? (
                <ErpButton
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const stageOrder: ProductStrategyStage[] = [
                      "strategic_vision",
                      "market_portfolio_strategy",
                      "financial_innovation_strategy",
                      "executive_review",
                    ];
                    const currentIndex = stageOrder.indexOf(record.currentStage);
                    if (currentIndex < stageOrder.length - 1) {
                      advanceStageMutation.mutate(stageOrder[currentIndex + 1]);
                    }
                  }}
                  disabled={advanceStageMutation.isPending}
                  className="cursor-pointer gap-1.5 shadow-2xs"
                >
                  <ArrowRight className="h-4 w-4" /> Next Stage
                </ErpButton>
              ) : null}

              {record.status !== "executive_review" && record.status !== "approved" && (
                <ErpButton
                  size="sm"
                  variant="primary"
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending}
                  className="cursor-pointer gap-1.5 shadow-xs"
                >
                  <Send className="h-4 w-4" /> Submit for Review
                </ErpButton>
              )}

              <ErpButton
                size="sm"
                variant={record.status === "approved" ? "outline" : "default"}
                onClick={() => setShowDecisionModal(true)}
                className={cn(
                  "cursor-pointer gap-1.5 shadow-xs font-bold",
                  record.status !== "approved" && "bg-emerald-600 hover:bg-emerald-700 text-white"
                )}
              >
                <Award className="h-4 w-4" /> Executive Decision
              </ErpButton>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 text-xs">
                  <DropdownMenuItem onClick={() => window.print()} className="cursor-pointer gap-2">
                    <Printer className="h-4 w-4" /> Print / Export PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Strategy deep link copied to clipboard");
                    }}
                    className="cursor-pointer gap-2"
                  >
                    <Share2 className="h-4 w-4" /> Share Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      if (record.linkedProductRoadmapId) {
                        navigate({ to: "/development/product-development/product-roadmap" });
                      } else {
                        toast.info("No Product Roadmap linked yet. Approve strategy to generate roadmap.");
                      }
                    }}
                    className="cursor-pointer gap-2 text-primary font-semibold"
                  >
                    <Map className="h-4 w-4" /> Open Product Roadmap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* 4-STAGE WORKFLOW STEPPER */}
          <div className="p-4 bg-card grid grid-cols-2 md:grid-cols-4 gap-3">
            {record.stages.map((stg, idx) => {
              const isCurrent = record.currentStage === stg.stage;
              const isCompleted = stg.completed;
              return (
                <div
                  key={stg.stage}
                  className={cn(
                    "flex items-center gap-3 p-2.5 rounded-lg border transition-all cursor-pointer",
                    isCurrent
                      ? "bg-primary/5 border-primary shadow-2xs"
                      : isCompleted
                      ? "bg-emerald-500/5 border-emerald-500/30"
                      : "bg-muted/20 border-border/50 opacity-70"
                  )}
                  onClick={() => {
                    setActiveTab("form");
                    if (idx === 0) document.getElementById("sec-vision")?.scrollIntoView({ behavior: "smooth" });
                    else if (idx === 1) document.getElementById("sec-market")?.scrollIntoView({ behavior: "smooth" });
                    else if (idx === 2) document.getElementById("sec-financial")?.scrollIntoView({ behavior: "smooth" });
                    else if (idx === 3) setShowDecisionModal(true);
                  }}
                >
                  <div
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold",
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate text-foreground">{stg.label}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {isCompleted ? "Completed" : isCurrent ? "Active Stage" : "Pending"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Scores & Health Gauges Banner */}
        <ProductScoreBanner submoduleKey="product-strategy" />

        {/* ========================================================================= */}
        {/* 2. MAIN WORKSPACE GRID: CONTENT + STRATEGY SIDEBAR                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* LEFT 2 COLS: ACTIVE TAB CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* TAB 1: STRATEGY FORM */}
            {activeTab === "form" && (
              <div className="space-y-6">
                {/* SECTION 1: PRODUCT VISION & GOALS */}
                <Card id="sec-vision" className="border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
                  <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 shadow-2xs">
                        <Target className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">Strategic Vision & Core Value Proposition</CardTitle>
                        <CardDescription className="text-xs">Formulate core market intent, mission baseline, and strategic objectives.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-xs">
                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">Product Vision Statement *</label>
                        <textarea
                          rows={2}
                          value={formInput.productVision}
                          onChange={(e) => handleInputChange("productVision", e.target.value)}
                          placeholder="What is the ultimate purpose and multi-year vision for this product?"
                          className="w-full rounded-lg border border-border bg-background p-2.5 font-medium leading-relaxed outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">Mission Statement & Operational Intent</label>
                        <textarea
                          rows={2}
                          value={formInput.missionStatement}
                          onChange={(e) => handleInputChange("missionStatement", e.target.value)}
                          placeholder="How will this product achieve its strategic vision in practice?"
                          className="w-full rounded-lg border border-border bg-background p-2.5 font-medium leading-relaxed outline-none focus:border-primary"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Strategic Objectives (Multi-Year Targets)</label>
                          <textarea
                            rows={3}
                            value={formInput.strategicObjectives}
                            onChange={(e) => handleInputChange("strategicObjectives", e.target.value)}
                            placeholder="Key quantitative business goals..."
                            className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Value Proposition Architecture</label>
                          <textarea
                            rows={3}
                            value={formInput.valueProposition}
                            onChange={(e) => handleInputChange("valueProposition", e.target.value)}
                            placeholder="Unique customer pain relievers and competitive advantages..."
                            className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-bold mb-1.5">Target Customer Segments</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formInput.targetCustomers.map((cust) => (
                            <span key={cust} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary border border-primary/20">
                              {cust}
                              <button type="button" onClick={() => handleArrayRemove("targetCustomers", cust)} className="hover:text-destructive">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add customer segment (e.g. EV Fleet Operators, Real Estate Plazas)..."
                            value={newTargetCustomer}
                            onChange={(e) => setNewTargetCustomer(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleArrayAdd("targetCustomers", newTargetCustomer, setNewTargetCustomer);
                              }
                            }}
                            className="h-8 rounded-lg border border-border bg-background px-3 text-xs flex-1 outline-none focus:border-primary"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => handleArrayAdd("targetCustomers", newTargetCustomer, setNewTargetCustomer)}
                            className="h-8 text-xs cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                {/* SECTION 2: MARKET STRATEGY */}
                <Card id="sec-market" className="border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
                  <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20 shadow-2xs">
                        <Compass className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">Market Strategy & Customer Personas</CardTitle>
                        <CardDescription className="text-xs">Addressable market dynamics, user personas, and customer journey orchestration.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-xs">
                      <div>
                        <label className="block text-muted-foreground font-bold mb-1.5">Priority Market Segments</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formInput.marketSegments.map((seg) => (
                            <span key={seg} className="inline-flex items-center gap-1.5 rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 border border-indigo-500/20">
                              {seg}
                              <button type="button" onClick={() => handleArrayRemove("marketSegments", seg)} className="hover:text-destructive">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add market segment (e.g. Commercial Fleet B2B, Highway Logistics)..."
                            value={newMarketSegment}
                            onChange={(e) => setNewMarketSegment(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleArrayAdd("marketSegments", newMarketSegment, setNewMarketSegment);
                              }
                            }}
                            className="h-8 rounded-lg border border-border bg-background px-3 text-xs flex-1 outline-none focus:border-primary"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => handleArrayAdd("marketSegments", newMarketSegment, setNewMarketSegment)}
                            className="h-8 text-xs cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Customer Personas & Pain Points</label>
                          <textarea
                            rows={3}
                            value={formInput.customerPersonas}
                            onChange={(e) => handleInputChange("customerPersonas", e.target.value)}
                            placeholder="Detail key personas, daily challenges, and decision criteria..."
                            className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Customer Journey & Adoption Funnel</label>
                          <textarea
                            rows={3}
                            value={formInput.customerJourney}
                            onChange={(e) => handleInputChange("customerJourney", e.target.value)}
                            placeholder="From commercial discovery to long-term telemetry retention..."
                            className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                {/* SECTION 3: PRODUCT PORTFOLIO STRATEGY */}
                <Card id="sec-portfolio" className="border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
                  <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20 shadow-2xs">
                        <Layers className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">Product Portfolio Classification</CardTitle>
                        <CardDescription className="text-xs">Define category hierarchy, lifecycle phase, and organizational portfolio priority.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Product Category</label>
                          <input
                            type="text"
                            value={formInput.productCategory}
                            onChange={(e) => handleInputChange("productCategory", e.target.value)}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-semibold text-foreground outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Product Line / Family</label>
                          <input
                            type="text"
                            value={formInput.productLine}
                            onChange={(e) => handleInputChange("productLine", e.target.value)}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-semibold text-foreground outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Portfolio Role</label>
                          <select
                            value={formInput.portfolioRole}
                            onChange={(e) => handleInputChange("portfolioRole", e.target.value)}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
                          >
                            <option>Core Flagship Growth Engine</option>
                            <option>Cash Cow Stabilizer</option>
                            <option>Emerging Technology Bet</option>
                            <option>Complementary Ecosystem Add-on</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Product Lifecycle Stage</label>
                          <select
                            value={formInput.productLifecycleStage}
                            onChange={(e) => handleInputChange("productLifecycleStage", e.target.value)}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
                          >
                            <option>Development & Scaling</option>
                            <option>Market Introduction</option>
                            <option>Rapid Growth</option>
                            <option>Maturity & Optimization</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Portfolio Priority Level</label>
                          <select
                            value={formInput.portfolioPriority}
                            onChange={(e) => handleInputChange("portfolioPriority", e.target.value)}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-semibold text-foreground outline-none focus:border-primary cursor-pointer"
                          >
                            <option>P1 - Critical Priority</option>
                            <option>P2 - High Growth Priority</option>
                            <option>P3 - Moderate Priority</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Growth Potential Rating (1-5)</label>
                          <div className="flex items-center gap-2 pt-1.5">
                            <StarRating
                              value={formInput.growthPotential}
                              onChange={(v) => handleInputChange("growthPotential", v)}
                            />
                            <span className="font-bold font-mono text-xs">{formInput.growthPotential} / 5</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                {/* SECTION 4: INNOVATION & ESG STRATEGY */}
                <Card id="sec-innovation" className="border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
                  <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-2xs">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">Emerging Technologies & ESG Innovation Strategy</CardTitle>
                        <CardDescription className="text-xs">Advanced technology stack, AI integration models, and environmental sustainability alignment.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-xs">
                      <div>
                        <label className="block text-muted-foreground font-bold mb-1.5">Emerging Technologies Deployed</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formInput.emergingTechnologies.map((tech) => (
                            <span key={tech} className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 border border-amber-500/20">
                              {tech}
                              <button type="button" onClick={() => handleArrayRemove("emergingTechnologies", tech)} className="hover:text-destructive">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add emerging tech (e.g. AI Load Balancing, Edge Computing, GaN Power)..."
                            value={newEmergingTech}
                            onChange={(e) => setNewEmergingTech(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleArrayAdd("emergingTechnologies", newEmergingTech, setNewEmergingTech);
                              }
                            }}
                            className="h-8 rounded-lg border border-border bg-background px-3 text-xs flex-1 outline-none focus:border-primary"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => handleArrayAdd("emergingTechnologies", newEmergingTech, setNewEmergingTech)}
                            className="h-8 text-xs cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </Button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">AI-Based Product Innovations</label>
                        <textarea
                          rows={2}
                          value={formInput.aiBasedInnovations}
                          onChange={(e) => handleInputChange("aiBasedInnovations", e.target.value)}
                          placeholder="Describe predictive maintenance algorithms, dynamic optimization, or ML features..."
                          className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1.5">Energy & Grid Transition Strategy</label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formInput.energyStrategy.map((eng) => (
                              <span key={eng} className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-500/20">
                                {eng}
                                <button type="button" onClick={() => handleArrayRemove("energyStrategy", eng)} className="hover:text-destructive">
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Add energy strategy..."
                              value={newEnergyStrategy}
                              onChange={(e) => setNewEnergyStrategy(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleArrayAdd("energyStrategy", newEnergyStrategy, setNewEnergyStrategy);
                                }
                              }}
                              className="h-8 rounded-lg border border-border bg-background px-3 text-xs flex-1 outline-none focus:border-primary"
                            />
                            <Button
                              type="button"
                              size="sm"
                              variant="secondary"
                              onClick={() => handleArrayAdd("energyStrategy", newEnergyStrategy, setNewEnergyStrategy)}
                              className="h-8 text-xs cursor-pointer"
                            >
                              <Plus className="h-3.5 w-3.5" /> Add
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">ESG & Carbon Offset Alignment</label>
                          <div className="flex items-center gap-2 pt-1.5">
                            <StarRating
                              value={formInput.esgAlignment}
                              onChange={(v) => handleInputChange("esgAlignment", v)}
                            />
                            <span className="font-bold font-mono text-xs">{formInput.esgAlignment} / 5</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1">Complies with Global ESG disclosure standards & ISO 14001 circular lifecycle.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                {/* SECTION 5: BUSINESS & REVENUE MODEL */}
                <Card id="sec-business-model" className="border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
                  <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20 shadow-2xs">
                        <Briefcase className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">Commercial Architecture & Revenue Engine</CardTitle>
                        <CardDescription className="text-xs">Monetization architecture, strategic partner channels, and Total Addressable Market (TAM).</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Core Business Model</label>
                          <input
                            type="text"
                            value={formInput.businessModel}
                            onChange={(e) => handleInputChange("businessModel", e.target.value)}
                            placeholder="e.g. B2B Enterprise + Hardware-as-a-Service"
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-semibold outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Total Addressable Market (TAM ₹)</label>
                          <input
                            type="number"
                            value={formInput.marketOpportunitySize}
                            onChange={(e) => handleInputChange("marketOpportunitySize", Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-bold font-mono outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">Recurring Revenue Architecture (ARR / Software / Services)</label>
                        <textarea
                          rows={2}
                          value={formInput.revenueModel}
                          onChange={(e) => handleInputChange("revenueModel", e.target.value)}
                          placeholder="Break down upfront hardware sales vs recurring subscriptions..."
                          className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                        />
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-bold mb-1.5">Key Channel & Alliance Partnerships</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formInput.keyPartnerships.map((prt) => (
                            <span key={prt} className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                              {prt}
                              <button type="button" onClick={() => handleArrayRemove("keyPartnerships", prt)} className="hover:text-destructive">
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add partnership (e.g. DISCOM Utilities, Battery Suppliers)..."
                            value={newKeyPartnership}
                            onChange={(e) => setNewKeyPartnership(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleArrayAdd("keyPartnerships", newKeyPartnership, setNewKeyPartnership);
                              }
                            }}
                            className="h-8 rounded-lg border border-border bg-background px-3 text-xs flex-1 outline-none focus:border-primary"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            onClick={() => handleArrayAdd("keyPartnerships", newKeyPartnership, setNewKeyPartnership)}
                            className="h-8 text-xs cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                {/* SECTION 6: FINANCIAL STRATEGY & ROI */}
                <Card id="sec-financial" className="border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
                  <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 shadow-2xs">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">Multi-Year Financial Strategy & ROI Horizon</CardTitle>
                        <CardDescription className="text-xs">Capital deployment, cost-to-develop, margin targets, and breakeven milestones.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">3-Year Investment Budget (₹)</label>
                          <input
                            type="number"
                            value={formInput.investmentBudget3Y}
                            onChange={(e) => handleInputChange("investmentBudget3Y", Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-bold font-mono outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">R&D & Engineering Cost (₹)</label>
                          <input
                            type="number"
                            value={formInput.developmentCost}
                            onChange={(e) => handleInputChange("developmentCost", Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-bold font-mono outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">3-Year Projected Revenue (₹)</label>
                          <input
                            type="number"
                            value={formInput.revenueForecast}
                            onChange={(e) => handleInputChange("revenueForecast", Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-bold font-mono text-emerald-600 outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Target Gross Margin (%)</label>
                          <input
                            type="number"
                            value={formInput.grossMargin}
                            onChange={(e) => handleInputChange("grossMargin", Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-bold font-mono outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Breakeven Horizon (Months)</label>
                          <input
                            type="number"
                            value={formInput.breakevenPeriodMonths}
                            onChange={(e) => handleInputChange("breakevenPeriodMonths", Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-bold font-mono outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Expected ROI Cycle (Years)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={formInput.roiYears}
                            onChange={(e) => handleInputChange("roiYears", Number(e.target.value))}
                            className="h-9 w-full rounded-lg border border-border bg-background px-3 font-bold font-mono outline-none focus:border-primary"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-muted-foreground font-bold mb-1">Pricing Strategy & Tiering Structure</label>
                        <textarea
                          rows={2}
                          value={formInput.pricingStrategy}
                          onChange={(e) => handleInputChange("pricingStrategy", e.target.value)}
                          placeholder="Detail volume discount tiers, hardware bundles, and telemetry SLA contracts..."
                          className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                        />
                      </div>
                    </CardContent>
                  </Card>

                {/* SECTION 7: RISK & COMPLIANCE */}
                <Card id="sec-risk" className="border-border/80 shadow-xs bg-card overflow-hidden rounded-xl">
                  <CardHeader className="pb-3 border-b border-border/50 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-2xs">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">Strategic Risk Assessment & Compliance Matrix</CardTitle>
                        <CardDescription className="text-xs">Identify vulnerability vectors, regulatory pre-clearance, and mitigations.</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                    <CardContent className="pt-4 space-y-4 text-xs">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 rounded-xl bg-muted/20 border border-border/60">
                        <div className="space-y-1 text-center">
                          <span className="text-[11px] font-bold text-muted-foreground block">Technical Risk</span>
                          <StarRating value={formInput.technicalRisk} onChange={(v) => handleInputChange("technicalRisk", v)} />
                          <span className="font-mono text-[10px] text-muted-foreground">{formInput.technicalRisk}/5</span>
                        </div>
                        <div className="space-y-1 text-center">
                          <span className="text-[11px] font-bold text-muted-foreground block">Market Risk</span>
                          <StarRating value={formInput.marketRisk} onChange={(v) => handleInputChange("marketRisk", v)} />
                          <span className="font-mono text-[10px] text-muted-foreground">{formInput.marketRisk}/5</span>
                        </div>
                        <div className="space-y-1 text-center">
                          <span className="text-[11px] font-bold text-muted-foreground block">Financial Risk</span>
                          <StarRating value={formInput.financialRisk} onChange={(v) => handleInputChange("financialRisk", v)} />
                          <span className="font-mono text-[10px] text-muted-foreground">{formInput.financialRisk}/5</span>
                        </div>
                        <div className="space-y-1 text-center">
                          <span className="text-[11px] font-bold text-muted-foreground block">Regulatory Risk</span>
                          <StarRating value={formInput.regulatoryRisk} onChange={(v) => handleInputChange("regulatoryRisk", v)} />
                          <span className="font-mono text-[10px] text-muted-foreground">{formInput.regulatoryRisk}/5</span>
                        </div>
                        <div className="space-y-1 text-center">
                          <span className="text-[11px] font-bold text-muted-foreground block">Cybersecurity</span>
                          <StarRating value={formInput.cybersecurityRisk} onChange={(v) => handleInputChange("cybersecurityRisk", v)} />
                          <span className="font-mono text-[10px] text-muted-foreground">{formInput.cybersecurityRisk}/5</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Mitigation Strategy Action Plan</label>
                          <textarea
                            rows={3}
                            value={formInput.mitigationStrategy}
                            onChange={(e) => handleInputChange("mitigationStrategy", e.target.value)}
                            placeholder="Countermeasures for identified technical, financial, and regulatory risks..."
                            className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-muted-foreground font-bold mb-1">Compliance Status & Certification Gates</label>
                          <textarea
                            rows={3}
                            value={formInput.complianceComment}
                            onChange={(e) => handleInputChange("complianceComment", e.target.value)}
                            placeholder="Standards compliance (e.g. ARAI, CE, ISO 27001, OCPP 2.0.1)..."
                            className="w-full rounded-lg border border-border bg-background p-2.5 font-medium outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
              </div>
            )}

            {/* TAB 2: PORTFOLIO MATRIX */}
            {activeTab === "portfolio" && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-primary" /> Product Strategy Portfolio Register
                  </CardTitle>
                  <CardDescription className="text-xs">Strategic portfolio spread across business units and investment priorities.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted/40 border-b border-border/60 text-muted-foreground font-bold text-[11px]">
                        <tr>
                          <th className="px-3 py-2">Strategy ID</th>
                          <th className="px-3 py-2">Strategy Title</th>
                          <th className="px-3 py-2">Business Unit</th>
                          <th className="px-3 py-2">Category</th>
                          <th className="px-3 py-2">Target TAM</th>
                          <th className="px-3 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        <tr className="hover:bg-muted/20">
                          <td className="px-3 py-3 font-mono font-bold text-primary">{record.strategyId}</td>
                          <td className="px-3 py-3 font-bold text-foreground">{formInput.strategyName}</td>
                          <td className="px-3 py-3 text-muted-foreground">{record.businessUnit}</td>
                          <td className="px-3 py-3 text-foreground">{formInput.productCategory}</td>
                          <td className="px-3 py-3 font-mono font-bold">{formatCurrency(formInput.marketOpportunitySize)}</td>
                          <td className="px-3 py-3"><StatusBadge status={record.status} /></td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="px-3 py-3 font-mono font-bold text-primary">PS-2024-0012</td>
                          <td className="px-3 py-3 font-bold text-foreground">Heavy-Duty Telemetry Inverter 120kW</td>
                          <td className="px-3 py-3 text-muted-foreground">Power Electronics</td>
                          <td className="px-3 py-3 text-foreground">Industrial Inverters</td>
                          <td className="px-3 py-3 font-mono font-bold">₹ 42,00,00,000</td>
                          <td className="px-3 py-3"><StatusBadge status="approved" /></td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="px-3 py-3 font-mono font-bold text-primary">PS-2024-0008</td>
                          <td className="px-3 py-3 font-bold text-foreground">Next-Gen BMS Modular Firmware Stack</td>
                          <td className="px-3 py-3 text-muted-foreground">Energy Storage Systems</td>
                          <td className="px-3 py-3 text-foreground">Battery Management</td>
                          <td className="px-3 py-3 font-mono font-bold">₹ 85,00,00,000</td>
                          <td className="px-3 py-3"><StatusBadge status="approved" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB 3: LINKED ROADMAPS */}
            {activeTab === "roadmaps" && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Map className="h-5 w-5 text-indigo-500" /> Linked Product Roadmaps & Release Tracks
                      </CardTitle>
                      <CardDescription className="text-xs">Engineering execution roadmaps generated from approved strategy milestones.</CardDescription>
                    </div>
                    {record.linkedProductRoadmapId && (
                      <Link
                        to="/development/product-development/product-roadmap"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs shadow-2xs hover:bg-primary/90 transition-colors"
                      >
                        Open Full Roadmap <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  {record.linkedProductRoadmapId ? (
                    <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary text-primary-foreground font-mono">{record.linkedProductRoadmapId}</Badge>
                          <span className="font-bold text-sm text-foreground">{record.linkedProductName} Master Roadmap</span>
                        </div>
                        <span className="text-emerald-600 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Active Release Gate</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-xs">
                        Execution roadmap mapped to 4-quarter delivery schedule. Governs PRD requirements, CAD architecture baselines, hardware tooling, and firmware sprint releases.
                      </p>
                      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border/50 text-center">
                        <div className="rounded-lg bg-card p-2 border border-border">
                          <span className="text-muted-foreground block text-[10px]">Phase 1 Target</span>
                          <strong className="text-foreground">Q3 2024 (Prototype)</strong>
                        </div>
                        <div className="rounded-lg bg-card p-2 border border-border">
                          <span className="text-muted-foreground block text-[10px]">Phase 2 Gate</span>
                          <strong className="text-foreground">Q1 2025 (Certification)</strong>
                        </div>
                        <div className="rounded-lg bg-card p-2 border border-border">
                          <span className="text-muted-foreground block text-[10px]">Commercial Launch</span>
                          <strong className="text-emerald-600 font-bold">Q3 2025 (Volume)</strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-xl border border-dashed border-border bg-muted/10 space-y-3">
                      <Map className="h-8 w-8 text-muted-foreground mx-auto" />
                      <div className="font-bold text-foreground">No Product Roadmap Linked Yet</div>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        A linked Product Roadmap will automatically be created and linked to this strategy when approved by the Executive Strategy Committee.
                      </p>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => setShowDecisionModal(true)}
                        className="cursor-pointer font-bold"
                      >
                        Approve Strategy Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* TAB 4: AI STRATEGIC INTELLIGENCE */}
            {activeTab === "ai" && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary animate-pulse" /> AI Strategic Assessment & Market Foresight
                      </CardTitle>
                      <CardDescription className="text-xs">Deep intelligence synthesis, competitive moats, and opportunity multipliers.</CardDescription>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">AI Engine Active</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  {/* AI Score Indicators */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-1">
                      <span className="text-muted-foreground text-[10px] font-semibold uppercase">Market Opportunity</span>
                      <div className="text-xl font-bold font-mono text-emerald-600">{aiAssessment.aiMarketOpportunityScore}%</div>
                      <span className="text-[10px] text-emerald-600 font-bold">High Expansion</span>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-1">
                      <span className="text-muted-foreground text-[10px] font-semibold uppercase">Differentiation</span>
                      <div className="text-xl font-bold font-mono text-indigo-600">{aiAssessment.aiProductDifferentiationScore}%</div>
                      <span className="text-[10px] text-indigo-600 font-bold">Patent Defensible</span>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-1">
                      <span className="text-muted-foreground text-[10px] font-semibold uppercase">Revenue Velocity</span>
                      <div className="text-xl font-bold font-mono text-cyan-600">{aiAssessment.aiRevenuePredictionScore}%</div>
                      <span className="text-[10px] text-cyan-600 font-bold">Predictable ARR</span>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-3 text-center space-y-1">
                      <span className="text-muted-foreground text-[10px] font-semibold uppercase">Competitive Moat</span>
                      <div className="text-xl font-bold font-mono text-amber-600">{aiAssessment.aiCompetitivePositionScore}%</div>
                      <span className="text-[10px] text-amber-600 font-bold">First Mover Tier-1</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-foreground text-xs">
                        <Zap className="h-4 w-4 text-primary" /> Autonomous Strategic Recommendations
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-xs">
                        {aiAssessment.aiStrategicRecommendations}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-foreground text-xs">
                        <TrendingUp className="h-4 w-4 text-emerald-600" /> Emerging Market Opportunity
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-xs">
                        {aiAssessment.aiEmergingOpportunity}
                      </p>
                    </div>

                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-foreground text-xs">
                        <AlertTriangle className="h-4 w-4 text-amber-600" /> Anticipated Horizon Risk
                      </div>
                      <p className="text-muted-foreground leading-relaxed text-xs">
                        {aiAssessment.aiRiskPrediction}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB 5: AUDIT TRAIL */}
            {activeTab === "audit" && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/50">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <History className="h-5 w-5 text-muted-foreground" /> Strategy Governance Audit Trail
                  </CardTitle>
                  <CardDescription className="text-xs">Immutable chronological register of stage transitions and committee actions.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs">
                  <div className="space-y-3">
                    {record.auditTrail.map((log) => (
                      <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card">
                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <strong className="text-foreground font-semibold">{log.action}</strong>
                            <span className="text-[11px] font-mono text-muted-foreground">{log.timestamp}</span>
                          </div>
                          <div className="text-muted-foreground text-[11px] mt-0.5">{log.details}</div>
                          <div className="text-[10px] text-primary font-medium mt-1">Initiated by: {log.user}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT 1 COL: STRATEGY ASSESSMENT & SCORE SIDEBAR */}
          <div className="space-y-6">

            {/* Key Commercial Metrics Strip */}
            <Card className="border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-2 border-b border-border/50">
                <CardTitle className="text-sm font-bold flex items-center justify-between">
                  <span>Commercial KPI Benchmarks</span>
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border">
                  <span className="text-muted-foreground font-medium">Target TAM</span>
                  <span className="font-bold font-mono text-foreground">{formatCurrency(keyMetrics.tam)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border">
                  <span className="text-muted-foreground font-medium">Projected ARR (Yr 3)</span>
                  <span className="font-bold font-mono text-emerald-600">{formatCurrency(keyMetrics.projectedRevenue)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border">
                  <span className="text-muted-foreground font-medium">Gross Margin Target</span>
                  <span className="font-bold font-mono text-foreground">{keyMetrics.grossMargin}%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border">
                  <span className="text-muted-foreground font-medium">Breakeven Horizon</span>
                  <span className="font-bold font-mono text-foreground">{keyMetrics.breakevenMonths} Months</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border border-border">
                  <span className="text-muted-foreground font-medium">Capital Investment</span>
                  <span className="font-bold font-mono text-foreground">{formatCurrency(formInput.investmentBudget3Y)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Linked Upstream & Downstream Records */}
            <Card className="border-border/80 shadow-xs bg-card">
              <CardHeader className="pb-2 border-b border-border/50">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-primary" /> Engineering & Commercial Thread
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-card">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Commercialization Project</span>
                    <strong className="text-foreground font-mono">{record.linkedCommercializationCode}</strong>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Commercial</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-card">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Business Plan Charter</span>
                    <strong className="text-foreground font-mono">{record.linkedBusinessPlanCode}</strong>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Strategy</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-card">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Downstream Product Roadmap</span>
                    <strong className="text-primary font-mono">{record.linkedProductRoadmapId || "Pending Approval"}</strong>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">Execution</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MODAL: EXECUTIVE COMMITTEE REVIEW DECISION                                */}
        {/* ========================================================================= */}
        <Dialog open={showDecisionModal} onOpenChange={setShowDecisionModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" /> Executive Strategy Committee Review
              </DialogTitle>
              <DialogDescription className="text-xs">
                Record the formal governance decision for {record.strategyId} ({formInput.strategyName}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div>
                <label className="block text-muted-foreground font-bold mb-1.5">Review Decision *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "approved", label: "Approve Strategy", desc: "Release to Product Roadmap" },
                    { id: "revision_required", label: "Revision Required", desc: "Return to PM with notes" },
                    { id: "additional_investigation", label: "More Investigation", desc: "Require more data" },
                    { id: "rejected", label: "Reject Strategy", desc: "Archive strategy initiative" },
                  ].map((dec) => (
                    <button
                      key={dec.id}
                      type="button"
                      onClick={() => setDecisionChoice(dec.id as ProductStrategyApprovalDecision)}
                      className={cn(
                        "p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                        decisionChoice === dec.id
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-2xs"
                          : "border-border bg-card hover:bg-muted text-foreground"
                      )}
                    >
                      <div className="text-xs">{dec.label}</div>
                      <div className="text-[10px] text-muted-foreground">{dec.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-bold mb-1">Committee Comments & Directives</label>
                <textarea
                  rows={3}
                  value={decisionComments}
                  onChange={(e) => setDecisionComments(e.target.value)}
                  placeholder="Record justification, budget authorizations, or revision guidance..."
                  className="w-full rounded-lg border border-border bg-background p-2 text-xs font-medium outline-none focus:border-primary"
                />
              </div>

              {decisionChoice === "approved" && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Approving this strategy will auto-generate downstream <strong>Product Roadmap</strong>.</span>
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowDecisionModal(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => reviewDecisionMutation.mutate()}
                disabled={reviewDecisionMutation.isPending}
                className="font-bold cursor-pointer"
              >
                Submit Committee Decision
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* MODAL: ROADMAP AUTO-CREATED SUCCESS */}
        <Dialog open={showRoadmapSuccessModal} onOpenChange={setShowRoadmapSuccessModal}>
          <DialogContent className="sm:max-w-md text-center">
            <div className="py-4 space-y-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 mx-auto">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <DialogTitle className="text-base font-bold">Product Strategy Approved!</DialogTitle>
              <DialogDescription className="text-xs max-w-sm mx-auto">
                Downstream execution has been authorized. Product Roadmap has been generated and added to the Product Development pipeline.
              </DialogDescription>
              <div className="p-3 rounded-xl bg-muted/40 border border-border inline-block text-xs font-mono font-bold text-primary">
                Linked Roadmap: {record.linkedProductRoadmapId || "PRM-2024-0042"}
              </div>
            </div>
            <DialogFooter className="justify-center sm:justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowRoadmapSuccessModal(false)}>
                Close
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setShowRoadmapSuccessModal(false);
                  navigate({ to: "/development/product-development/product-roadmap" });
                }}
                className="font-bold cursor-pointer"
              >
                Go to Product Roadmap
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export const ProductStrategyPage = ProductStrategyFormPage;
export default ProductStrategyFormPage;
