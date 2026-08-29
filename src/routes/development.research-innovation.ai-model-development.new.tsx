import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Brain,
  Cpu,
  Database,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Activity,
  Gauge,
  ShieldCheck,
  Terminal,
  Cloud,
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
  FileCode,
  FileSpreadsheet,
  Target,
  Zap,
  BarChart3,
  Share2,
  Printer,
  History,
  Grid3x3,
  LineChart,
  UserCheck,
  Paperclip,
} from "lucide-react";

import { aiModelDevelopmentService } from "@/services/aiModelDevelopmentService";
import type {
  AiModelRecord,
  AiModelFormInput,
  AiModelApprovalDecision,
  AiAttachment,
} from "@/services/types";
import { ResearchInnovationTabBar } from "@/components/erp/ResearchInnovationTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { AppShell } from "@/components/erp/AppShell";

export const Route = createFileRoute(
  "/development/research-innovation/ai-model-development/new",
)({
  head: () => ({
    meta: [{ title: "AI Model Development Form · Magnertia ERP" }],
  }),
  component: AiModelDevelopmentNewPage,
});

export function AiModelFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <AiModelDevelopmentNewPage {...props} />;
}

export function AiModelDevelopmentPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <AiModelDevelopmentNewPage {...props} />;
}

/* Helper component for SVG Circular Gauge */
function CircularScoreGauge({
  score,
  size = 72,
  strokeWidth = 6,
  label,
  sublabel,
  color = "#2563eb",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
}) {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-700/60"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-2xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 flex items-baseline justify-center">
            {normalizedScore}
            <span className="text-sm font-bold ml-0.5">%</span>
          </span>
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">{label}</span>}
      {sublabel && <span className="text-[11px] text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

export function AiModelDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  const [selectedAttachment, setSelectedAttachment] = useState<AiAttachment | null>(null);

  // Modals & Dialog States
  const [isRetrainModalOpen, setIsRetrainModalOpen] = useState(false);
  const [isInferenceModalOpen, setIsInferenceModalOpen] = useState(false);
  const [isBiasModalOpen, setIsBiasModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Retrain State Simulation
  const [isRetraining, setIsRetraining] = useState(false);
  const [retrainEpoch, setRetrainEpoch] = useState(0);
  const [retrainLogs, setRetrainLogs] = useState<string[]>([]);

  // Inference Simulator State
  const [inferencePayload, setInferencePayload] = useState<string>(
    JSON.stringify(
      {
        station_id: "EV-STATION-402",
        hour_of_day: 18,
        day_of_week: "Friday",
        temperature_celsius: 28.5,
        is_holiday: 0,
        historical_kwh_usage: 142.8,
        charger_type: "DC_FAST_150KW",
      },
      null,
      2,
    ),
  );
  const [inferenceResult, setInferenceResult] = useState<{
    status: string;
    predicted_demand_kwh: number;
    confidence_score: number;
    latency_ms: number;
    shap_top_feature: string;
  } | null>(null);
  const [isInferring, setIsInferring] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<AiModelFormInput>>({
    aiProjectName: "",
    businessObjective: "",
    problemStatement: "",
    expectedBusinessOutcome: "",
    approvalDecision: "Approved with Conditions",
    reviewComments: "Overall model is good. Please improve explainability and add more test cases.",
  });

  // Data Fetching via React Query
  const { data: record, isLoading } = useQuery<AiModelRecord>({
    queryKey: ["aiModelDevelopmentRecord"],
    queryFn: () => aiModelDevelopmentService.fetchRecord(),
  });

  // Draft Save & Submit Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<AiModelFormInput>) =>
      aiModelDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["aiModelDevelopmentRecord"], updated);
      toast.success("Draft saved successfully!", {
        description: "All AI model configurations updated.",
      });
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: () => aiModelDevelopmentService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["aiModelDevelopmentRecord"], updated);
      toast.success("Submitted for AI Review!", {
        description: "Project moved to 'In Review' workflow stage.",
      });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: AiModelApprovalDecision;
      comments?: string;
    }) => aiModelDevelopmentService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["aiModelDevelopmentRecord"], updated);
      toast.success(`Review status updated to '${formData.approvalDecision || "Approved with Conditions"}'`, {
        description: "Audit trail log generated.",
      });
    },
  });

  // Retrain Action Handler
  const handleStartRetrain = () => {
    setIsRetraining(true);
    setRetrainEpoch(0);
    setRetrainLogs([
      "Initializing XGBoost GPU environment (NVIDIA A100 80GB)...",
      "Loading EV_Usage_Historical dataset (2.4 TB Parquet)...",
    ]);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setRetrainEpoch(current);
      setRetrainLogs((prev) => [
        ...prev,
        `Epoch ${current}/200 - train_loss: ${(0.85 * (1 - current / 220)).toFixed(4)} - val_loss: ${(0.92 * (1 - current / 210)).toFixed(4)}`,
      ]);

      if (current >= 200) {
        clearInterval(interval);
        setIsRetraining(false);
        setRetrainLogs((prev) => [
          ...prev,
          "Training finished successfully! Validation accuracy: 93.1%. Model checkpoint saved to MLflow Registry.",
        ]);
        toast.success("Model retraining completed!", {
          description: "Model score updated to 93/100.",
        });
      }
    }, 400);
  };

  // Inference Execution Simulation
  const handleExecuteInference = () => {
    setIsInferring(true);
    setTimeout(() => {
      setIsInferring(false);
      setInferenceResult({
        status: "200 OK",
        predicted_demand_kwh: 168.4,
        confidence_score: 0.952,
        latency_ms: 13.8,
        shap_top_feature: "historical_kwh_usage (+34.2 kW)",
      });
      toast.success("Inference endpoint response received!", {
        description: "Latency: 13.8ms | Status: 200 OK",
      });
    }, 600);
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="AI Model Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <ResearchInnovationTabBar />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-muted-foreground">Loading AI Model Development Module...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="AI Model Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > AI Model Development"}
      description="Design predictive ML pipelines, deep learning architectures, feature engineering, and MLOps deployment."
      tabs={tabs ?? <ResearchInnovationTabBar />}
    >
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased pb-16">
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-3 space-y-4">
          {/* Top Header Card */}
          <div className="rounded-xl border border-border/80 bg-white dark:bg-slate-900 shadow-xs p-4 sm:p-5 transition-all">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
                    <Sparkles className="h-6 w-6 text-blue-600 shrink-0" />
                    {record.aiProjectName}
                  </h1>
                  <Badge variant="outline" className="font-mono text-xs font-semibold px-2.5 py-0.5">
                    {record.modelVersion}
                  </Badge>
                  <Badge
                    className={
                      record.workflowStatus === "Approved"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold"
                        : record.workflowStatus === "In Review"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 font-semibold"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-semibold"
                    }
                  >
                    <Workflow className="mr-1 h-3 w-3 inline" />
                    {record.workflowStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground max-w-3xl">
                  {record.businessObjective}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveDraftMutation.mutate(formData)}
                  disabled={saveDraftMutation.isPending}
                  className="h-8 px-3 text-xs gap-1.5"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Draft
                </Button>

                <Button
                  size="sm"
                  onClick={() => submitForReviewMutation.mutate()}
                  disabled={submitForReviewMutation.isPending}
                  className="h-8 px-4 text-xs font-bold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit for Review
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 text-xs">
                    <DropdownMenuItem onClick={() => setIsRetrainModalOpen(true)}>
                      <RefreshCw className="h-3.5 w-3.5 mr-2 text-blue-500" />
                      Trigger Model Retraining
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsInferenceModalOpen(true)}>
                      <Terminal className="h-3.5 w-3.5 mr-2 text-purple-500" />
                      Test Inference Endpoint
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsBiasModalOpen(true)}>
                      <ShieldCheck className="h-3.5 w-3.5 mr-2 text-amber-500" />
                      Run Responsible AI Audit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.print()}>
                      <Printer className="h-3.5 w-3.5 mr-2" />
                      Print Specification
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                    >
                      <Share2 className="h-3.5 w-3.5 mr-2" />
                      Share Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Reference Badges Strip */}
            <div className="mt-4 pt-3 border-t border-border/60 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">AI Model ID</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {record.aiModelDevelopmentId}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">Form Code</span>
                <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                  {record.formCode}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">Linked Product</span>
                <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer">
                  {record.linkedProductId}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">Linked Cloud</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {record.linkedCloudPlatformId}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">AI Lead Engineer</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">
                  {record.aiLeadEngineerName}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground text-[11px]">Created / Updated</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{record.createdOn}</span>
              </div>
            </div>
          </div>

          {/* Main Content Grid: 9 Cols Dashboard + 3 Cols Sticky Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 9-column container */}
            <div className="lg:col-span-9 space-y-6">
              {/* SECTION: AI Project Overview */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">AI Project Overview & Target Scope</CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs font-semibold">{record.businessUnit}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-6 space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                        AI Project Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.aiProjectName || record.aiProjectName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, aiProjectName: e.target.value }))}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                        AI Use Case
                      </label>
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 font-bold w-full justify-center h-8 text-xs">
                        {record.aiUseCase}
                      </Badge>
                    </div>

                    <div className="md:col-span-3 space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                        Target Users
                      </label>
                      <div className="flex gap-1 flex-wrap">
                        {record.targetUsers.map((u, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px]">
                            {u}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Business Objective <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      rows={2}
                      value={formData.businessObjective || record.businessObjective}
                      onChange={(e) => setFormData((prev) => ({ ...prev, businessObjective: e.target.value }))}
                      className="text-xs resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Problem Statement
                      </label>
                      <Textarea
                        rows={2}
                        value={formData.problemStatement || record.problemStatement}
                        onChange={(e) => setFormData((prev) => ({ ...prev, problemStatement: e.target.value }))}
                        className="text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Expected Business Outcome
                      </label>
                      <Textarea
                        rows={2}
                        value={formData.expectedBusinessOutcome || record.expectedBusinessOutcome}
                        onChange={(e) => setFormData((prev) => ({ ...prev, expectedBusinessOutcome: e.target.value }))}
                        className="text-xs resize-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-semibold">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span>Executive Recommendation:</span>
                      <span className="font-bold">{record.readinessSummary.recommendation}</span>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-[10px]">Verified & Authorized</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Dataset Management & Data Quality */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">Dataset Management & Data Quality</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {record.datasetConfig.datasetName}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsUploadOpen(true)}
                        className="gap-1 text-xs h-8"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        Upload Dataset
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-xs">
                  {/* Quality Metrics Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 rounded-lg border border-blue-100 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 text-center space-y-1">
                      <span className="text-[11px] text-muted-foreground block font-medium">Quality Score</span>
                      <span className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {record.datasetConfig.dataQualityScore}%
                      </span>
                      <Progress value={record.datasetConfig.dataQualityScore} className="h-1.5" />
                    </div>

                    {[
                      { label: "Completeness", val: record.datasetConfig.completeness },
                      { label: "Consistency", val: record.datasetConfig.consistency },
                      { label: "Accuracy", val: record.datasetConfig.accuracy },
                      { label: "Timeliness", val: record.datasetConfig.timeliness },
                    ].map((metric, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1"
                      >
                        <span className="text-[11px] text-muted-foreground block font-medium">
                          {metric.label}
                        </span>
                        <span className="text-base font-bold text-slate-900 dark:text-white font-mono">
                          {metric.val}%
                        </span>
                        <Progress value={metric.val} className="h-1.5" />
                      </div>
                    ))}
                  </div>

                  {/* Dataset Partitioning Table */}
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                    <div className="bg-slate-100/70 dark:bg-slate-800/80 px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span>Dataset Partitioning & Splitting</span>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        Ratio: 70% Train / 15% Val / 15% Test
                      </span>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {[
                        {
                          type: "Training Dataset",
                          file: record.datasetConfig.trainDataset,
                          size: "1.68 TB",
                          records: "48,500,000 rows",
                          status: "Verified",
                        },
                        {
                          type: "Validation Dataset",
                          file: record.datasetConfig.valDataset,
                          size: "360 GB",
                          records: "10,200,000 rows",
                          status: "Verified",
                        },
                        {
                          type: "Test Dataset",
                          file: record.datasetConfig.testDataset,
                          size: "360 GB",
                          records: "10,200,000 rows",
                          status: "Holdout Protected",
                        },
                      ].map((partition, i) => (
                        <div
                          key={i}
                          className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                        >
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className="h-4 w-4 text-blue-500" />
                            <div>
                              <span className="font-semibold text-slate-900 dark:text-slate-100 block">
                                {partition.type}
                              </span>
                              <span className="font-mono text-muted-foreground text-[11px]">
                                {partition.file}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                            <span>{partition.size}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{partition.records}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {partition.status}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success(`Downloading ${partition.file}`)}>
                              <Download className="h-3.5 w-3.5 text-slate-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Feature Engineering & Feature Store */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">Feature Engineering & Feature Store</CardTitle>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-xs font-bold">
                      Score: {record.featureConfig.featureReadinessScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Selection Method</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.featureConfig.selectionMethod}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Feature Scaling</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.featureConfig.scaling}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Missing Value Strategy</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.featureConfig.missingValueStrategy}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Preprocessing Pipeline</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {record.featureConfig.preprocessing}
                      </span>
                    </div>
                  </div>

                  {/* Feature Importance Rankings */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      Feature Importance Rankings (SHAP Feature Attribution)
                    </h4>

                    <div className="space-y-2">
                      {[
                        { name: "historical_kwh_usage", score: 0.38, type: "Numeric" },
                        { name: "hour_of_day", score: 0.24, type: "Categorical" },
                        { name: "temperature_celsius", score: 0.16, type: "Numeric" },
                        { name: "is_holiday", score: 0.12, type: "Binary" },
                        { name: "charger_type_kw", score: 0.10, type: "Categorical" },
                      ].map((feat, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
                        >
                          <span className="w-36 font-mono font-medium text-slate-900 dark:text-white truncate">
                            {feat.name}
                          </span>
                          <div className="flex-1 space-y-1">
                            <Progress value={feat.score * 100} className="h-2" />
                          </div>
                          <span className="w-12 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                            {(feat.score * 100).toFixed(0)}%
                          </span>
                          <Badge variant="outline" className="text-[10px] w-24 justify-center">
                            {feat.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Model Architecture & Network Topology */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">Model Architecture & Network Topology</CardTitle>
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs">
                      Score: {record.architectureConfig.modelDesignScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">AI Category</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.architectureConfig.aiCategory}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Model Type</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {record.architectureConfig.modelType}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Framework</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.architectureConfig.framework}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Language</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.architectureConfig.language}
                      </span>
                    </div>
                  </div>

                  {/* Hyperparameters Config Box */}
                  <div className="p-3.5 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1">
                    <span className="text-muted-foreground text-[11px] font-semibold block">
                      Hyperparameters & Model Configuration
                    </span>
                    <p className="font-mono text-slate-800 dark:text-slate-200">{record.architectureConfig.hyperparameters}</p>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Model Training & GPU Optimization */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">Model Training & GPU Optimization</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-600 text-white text-xs font-semibold">
                        Status: {record.trainingMetrics.trainingStatus}
                      </Badge>
                      <Button
                        size="sm"
                        onClick={() => setIsRetrainModalOpen(true)}
                        className="bg-blue-600 text-white gap-1 text-xs h-8"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retrain Model
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Strategy</span>
                      <span className="font-semibold text-slate-900 dark:text-white truncate block">
                        {record.trainingMetrics.strategy}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Optimizer</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {record.trainingMetrics.optimizer}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Loss Function</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {record.trainingMetrics.lossFunction}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Batch Size / Epochs</span>
                      <span className="font-semibold text-slate-900 dark:text-white font-mono">
                        {record.trainingMetrics.batchSize} / {record.trainingMetrics.epochs}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 col-span-2">
                      <span className="text-muted-foreground block text-[11px]">Hardware & GPU</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 font-mono text-[11px]">
                        {record.trainingMetrics.gpuUtilization}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Model Evaluation & Confusion Matrix */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">Model Evaluation & Confusion Matrix</CardTitle>
                    </div>
                    <Badge className="bg-blue-600 text-white font-mono text-xs font-semibold">
                      Evaluation Score: {record.evaluationMetrics.evaluationScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">Accuracy</span>
                      <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                        {record.evaluationMetrics.accuracy}%
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">Precision</span>
                      <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                        {record.evaluationMetrics.precision}%
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">Recall</span>
                      <span className="text-lg font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
                        {record.evaluationMetrics.recall}%
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">F1 Score</span>
                      <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400 font-mono">
                        {record.evaluationMetrics.f1Score}%
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-muted-foreground block text-[11px]">ROC AUC</span>
                      <span className="text-lg font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                        {record.evaluationMetrics.rocAuc}
                      </span>
                    </div>
                  </div>

                  {/* Confusion Matrix Table */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Grid3x3 className="h-4 w-4 text-blue-600" />
                      Confusion Matrix (Actual vs Predicted EV Demand Classes)
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-center border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold text-muted-foreground">
                              Actual \ Predicted
                            </th>
                            <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200">
                              Low Demand
                            </th>
                            <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200">
                              Med Demand
                            </th>
                            <th className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200">
                              High Demand
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              label: "Low Demand",
                              vals: record.evaluationMetrics.confusionMatrix[0],
                            },
                            {
                              label: "Med Demand",
                              vals: record.evaluationMetrics.confusionMatrix[1],
                            },
                            {
                              label: "High Demand",
                              vals: record.evaluationMetrics.confusionMatrix[2],
                            },
                          ].map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td className="p-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-bold text-slate-800 dark:text-slate-200 text-left">
                                {row.label}
                              </td>
                              {row.vals.map((val, cIdx) => {
                                const isDiagonal = rIdx === cIdx;
                                return (
                                  <td
                                    key={cIdx}
                                    className={`p-3 border border-slate-200 dark:border-slate-800 font-mono font-bold ${
                                      isDiagonal
                                        ? "bg-blue-600/15 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300"
                                        : "bg-red-500/5 text-red-600 dark:bg-red-950/20 dark:text-red-400"
                                    }`}
                                  >
                                    {val}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: AI Governance & Responsible AI Checklist */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">AI Governance & Responsible AI Checklist</CardTitle>
                    </div>
                    <Badge className="bg-purple-600 text-white font-mono text-xs font-semibold">
                      Governance Score: {record.governancePolicy.governanceScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">Explainability Method</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.governancePolicy.explainabilityMethod}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">Bias Detection Result</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {record.governancePolicy.biasDetection}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">Privacy & Compliance Standard</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {record.governancePolicy.privacyCompliance} Compliant
                      </span>
                    </div>
                  </div>

                  {/* Responsible AI Compliance Checklist */}
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="bg-slate-100/70 dark:bg-slate-800/80 px-4 py-2.5 font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span>Enterprise Responsible AI Audit Checklist</span>
                      <Badge className="bg-emerald-600 text-white text-[10px]">8/8 Verified</Badge>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {[
                        { title: "Fairness Assessment", detail: record.governancePolicy.fairnessAssessment, status: "Passed" },
                        { title: "Ethical Review Board Clearance", detail: "Review completed on 20 Jun 2024 by AI Ethics Committee.", status: "Passed" },
                        { title: "Risk Classification Level", detail: `Assigned Risk Level: ${record.governancePolicy.riskClassification}`, status: "Medium Risk" },
                        { title: "Data Anonymization & PII Protection", detail: "All personal user identifiers scrubbed prior to feature engineering.", status: "Passed" },
                      ].map((item, i) => (
                        <div key={i} className="px-4 py-3 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-900 dark:text-white block">
                              {item.title}
                            </span>
                            <span className="text-muted-foreground text-[11px]">
                              {item.detail}
                            </span>
                          </div>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Deployment & MLOps Infrastructure */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cloud className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">Deployment & MLOps Infrastructure</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-600 text-white text-xs font-semibold">
                        {record.mlopsDeployment.deploymentStatus}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsInferenceModalOpen(true)}
                        className="gap-1 text-xs h-8"
                      >
                        <Terminal className="h-3.5 w-3.5" />
                        Test Endpoint
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Deployment Platform</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.mlopsDeployment.platform}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Containerization</span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {record.mlopsDeployment.containerization}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Model Registry</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {record.mlopsDeployment.registry}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">CI/CD Pipeline</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.mlopsDeployment.cicdPipeline}
                      </span>
                    </div>
                  </div>

                  {/* Inference Endpoint Box */}
                  <div className="p-3.5 rounded-lg border border-border bg-slate-50/50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1 min-w-0">
                      <span className="text-[11px] font-semibold text-muted-foreground block">
                        Production Inference Endpoint URL (REST API)
                      </span>
                      <span className="font-mono text-xs text-blue-600 dark:text-blue-400 block break-all font-semibold">
                        {record.mlopsDeployment.inferenceEndpoint}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(record.mlopsDeployment.inferenceEndpoint);
                        toast.success("Inference URL copied!");
                      }}
                      className="gap-1 shrink-0 text-xs h-8"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Copy URL
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: AI Model Assessment & Drift Diagnostics */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <CardTitle className="text-base font-bold">AI Model Assessment & Drift Diagnostics</CardTitle>
                    </div>
                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950 font-mono text-xs font-bold border-purple-200">
                      Assessment: {record.aiAssessment.aiOverallScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Robustness Analysis
                      </span>
                      <p className="text-muted-foreground">
                        {record.aiAssessment.aiRobustnessReview}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Model Drift Prediction
                      </span>
                      <p className="text-muted-foreground">
                        {record.aiAssessment.aiDriftPrediction}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Security & Vulnerability Audit
                      </span>
                      <p className="text-muted-foreground">
                        {record.aiAssessment.aiSecurityReview}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Optimization Suggestions
                      </span>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {record.aiAssessment.aiOptimizationSuggestions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Project Attachments & Model Cards */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">Project Attachments & Model Cards</CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsUploadOpen(true)}
                      className="gap-1 text-xs h-8"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload File
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    {record.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileCode className="h-4 w-4 text-blue-500 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-slate-900 dark:text-white block truncate" title={att.name}>
                              {att.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {att.size} • {att.uploadedBy}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setSelectedAttachment(att)}
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toast.success(`Downloading ${att.name}`)}>
                            <Download className="h-3.5 w-3.5 text-slate-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Review & Approval Board Timeline */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">Review & Approval Board Timeline</CardTitle>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border-amber-200">
                      AI Architecture Review Board
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-6 text-xs">
                  {/* Reviewers Table */}
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                          <th className="p-3">Role</th>
                          <th className="p-3">Reviewer</th>
                          <th className="p-3">Decision</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Comments</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {record.reviewers.map((rev, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="p-3 font-semibold text-slate-900 dark:text-white">
                              {rev.role}
                            </td>
                            <td className="p-3">
                              <span className="font-medium text-foreground">{rev.person}</span>
                            </td>
                            <td className="p-3">
                              <Badge
                                className={
                                  rev.decision === "Approved"
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-[10px] font-bold"
                                    : rev.decision === "Approved with Conditions"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 text-[10px] font-bold"
                                    : "bg-slate-200 text-slate-700 dark:bg-slate-800 text-[10px] font-medium"
                                }
                              >
                                {rev.decision}
                              </Badge>
                            </td>
                            <td className="p-3 text-muted-foreground">{rev.date}</td>
                            <td className="p-3 text-slate-700 dark:text-slate-300">
                              {rev.comments}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Decision Form Block */}
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Submit Review Decision
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Approval Decision <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.approvalDecision || record.approvalDecision}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              approvalDecision: e.target.value as AiModelApprovalDecision,
                            }))
                          }
                          className="w-full h-9 rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <option value="Approved">Approved (Production Ready)</option>
                          <option value="Approved with Conditions">
                            Approved with Conditions
                          </option>
                          <option value="Changes Requested">Changes Requested</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Review Comments
                        </label>
                        <Textarea
                          value={formData.reviewComments || record.reviewComments}
                          onChange={(e) => setFormData((prev) => ({ ...prev, reviewComments: e.target.value }))}
                          placeholder="Add approval or modification remarks..."
                          className="h-20 text-xs resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={() =>
                          reviewDecisionMutation.mutate({
                            id: record.id,
                            decision: formData.approvalDecision || record.approvalDecision,
                            comments: formData.reviewComments || record.reviewComments,
                          })
                        }
                        disabled={reviewDecisionMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-8 font-bold text-xs"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Save Decision
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: System Information */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold">System Information</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      Audit Logged
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block font-medium">Created By</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{record.createdBy || "Rahul Sharma"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Created Date</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{record.createdOn}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Workflow Stage</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{record.workflowStatus}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium">Model Version</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{record.modelVersion}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sticky Sidebar Panel (3 columns) with side scrolling method */}
            <div className="lg:col-span-3">
              <div className="sticky top-6 space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
                {/* Overall Score Gauge Card */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-2 border-b border-border/60 text-center">
                    <CardTitle className="text-sm font-bold">Overall AI Model Score</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 flex flex-col items-center">
                    <CircularScoreGauge
                      score={record.overallAiModelScore}
                      size={110}
                      strokeWidth={10}
                      color="#2563eb"
                    />

                    {/* Breakdown List with Accurate Percentages */}
                    <div className="w-full mt-4 space-y-2 text-xs border-t border-border/60 pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Dataset Quality</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {record.datasetReadinessScore}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Model Architecture</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {record.modelDesignScore}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Deployment Readiness</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {record.deploymentReadinessScore}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">AI Governance</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                          {record.governanceScore}%
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400">Model Performance</span>
                        <span className="font-bold text-emerald-600 font-mono">
                          {record.aiAssessment.aiPerformanceScore}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>


              </div>
            </div>
          </div>
        </div>

        {/* Retrain Simulation Dialog */}
        <Dialog open={isRetrainModalOpen} onOpenChange={setIsRetrainModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <RefreshCw className="h-5 w-5 text-blue-600" />
                Live Model Retraining Console
              </DialogTitle>
              <DialogDescription className="text-xs">
                Execute model training job on GPU cluster with updated datasets
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Epoch Progress ({retrainEpoch} / 200)</span>
                  <span className="font-mono text-blue-600 font-bold">
                    {((retrainEpoch / 200) * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress value={(retrainEpoch / 200) * 100} className="h-2" />
              </div>

              <div className="h-44 rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-1">
                {retrainLogs.length === 0 ? (
                  <span className="text-slate-500">Ready to start training job...</span>
                ) : (
                  retrainLogs.map((log, i) => <div key={i}>{log}</div>)
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleStartRetrain}
                disabled={isRetraining}
                className="bg-blue-600 text-white gap-1.5 h-8 font-bold text-xs"
              >
                <Play className="h-3.5 w-3.5" />
                {isRetraining ? "Training in progress..." : "Start Retraining Job"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Inference Endpoint Tester Dialog */}
        <Dialog open={isInferenceModalOpen} onOpenChange={setIsInferenceModalOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Terminal className="h-5 w-5 text-purple-600" />
                Inference REST API Simulator
              </DialogTitle>
              <DialogDescription className="text-xs">
                Send mock JSON request payload to live Kubernetes endpoint
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">
                  Request Body (JSON)
                </label>
                <Textarea
                  value={inferencePayload}
                  onChange={(e) => setInferencePayload(e.target.value)}
                  className="font-mono h-32 text-xs bg-slate-950 text-slate-100 resize-none"
                />
              </div>

              {inferenceResult && (
                <div className="p-3 rounded-lg bg-slate-900 text-slate-100 font-mono space-y-1 text-xs">
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Status: {inferenceResult.status}</span>
                    <span>Latency: {inferenceResult.latency_ms} ms</span>
                  </div>
                  <div>Predicted Demand: {inferenceResult.predicted_demand_kwh} kWh</div>
                  <div>Confidence: {(inferenceResult.confidence_score * 100).toFixed(1)}%</div>
                  <div className="text-blue-400">
                    Top SHAP Feature: {inferenceResult.shap_top_feature}
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleExecuteInference}
                disabled={isInferring}
                className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5 h-8 font-bold text-xs"
              >
                <Send className="h-3.5 w-3.5" />
                {isInferring ? "Sending..." : "Execute Inference Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Responsible AI / Bias Inspector Dialog */}
        <Dialog open={isBiasModalOpen} onOpenChange={setIsBiasModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <ShieldCheck className="h-5 w-5 text-amber-500" />
                Responsible AI & Fairness Inspector
              </DialogTitle>
              <DialogDescription className="text-xs">
                Demographic parity and algorithmic fairness evaluation
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold block text-slate-900 dark:text-white">
                  Demographic Parity Ratio
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold text-base">
                  0.982 (Satisfied &gt; 0.80 benchmark)
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold block text-slate-900 dark:text-white">
                  Disparate Impact Metric
                </span>
                <span className="text-slate-700 dark:text-slate-300">
                  No statistical disparity found across geographic charger regions.
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsBiasModalOpen(false)} className="h-8 text-xs font-bold">
                Close Inspector
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Attachment Preview Modal */}
        <Dialog
          open={!!selectedAttachment}
          onOpenChange={(open) => !open && setSelectedAttachment(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Eye className="h-5 w-5 text-blue-600" />
                {selectedAttachment?.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {selectedAttachment?.type} Document • {selectedAttachment?.size}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs h-40 flex items-center justify-center">
              [Previewing file content for {selectedAttachment?.name}]
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setSelectedAttachment(null)} className="h-8 text-xs">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* File Upload Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">Upload Dataset / Attachment</DialogTitle>
              <DialogDescription className="text-xs">
                Upload parquet, csv, pdf, or model weights file
              </DialogDescription>
            </DialogHeader>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Drag and drop files here or click to browse
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Supports .parquet, .csv, .pdf, .onnx up to 5 GB
              </span>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  setIsUploadOpen(false);
                  toast.success("File uploaded successfully!");
                }}
                className="h-8 text-xs font-bold"
              >
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default AiModelDevelopmentNewPage;
