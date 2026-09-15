import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Cloud,
  Cpu,
  Database,
  ShieldCheck,
  Activity,
  Gauge,
  Layers,
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
  FileSpreadsheet,
  HardDrive,
  Lock,
  Target,
  Zap,
  BarChart3,
  Check,
  X,
  ChevronDown,
  Filter,
  ShieldAlert,
  FileCheck,
  Share2,
  Printer,
  History as HistoryIcon,
  UserCheck,
  Info,
  Maximize2,
  FolderDown,
  LineChart,
  CheckCircle2,
  AlertTriangle,
  Server,
  Box,
  Key,
  Globe,
  Settings,
  TrendingUp,
  Sparkles,
  Grid3x3,
  Shield,
  Clock,
  ArrowUpRight,
  Paperclip,
} from "lucide-react";

import { cloudPlatformDevelopmentService } from "@/services/cloudPlatformDevelopmentService";
import type {
  CloudPlatformRecord,
  CloudPlatformFormInput,
  CloudPlatformApprovalDecision,
  CloudAttachment,
  CloudReviewer,
  CloudAuditEntry,
} from "@/services/types";
import { ResearchInnovationTabBar, InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import {
  CloudPlatformDevelopmentTabBar,
  CLOUD_PLATFORM_TABS,
  type CloudPlatformDevelopmentTabId,
} from "@/components/erp/CloudPlatformDevelopmentTabBar";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AppShell } from "@/components/erp/AppShell";
import { cn } from "@/lib/utils";

/* ===========================================================================
   Circular Score Gauge Component
   =========================================================================== */
function CircularScoreGauge({
  score,
  label = "CLOUD SCORE",
}: {
  score: number;
  label?: string;
}) {
  const circumference = 2 * Math.PI * 42;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let scoreColor = "text-blue-600 stroke-blue-600 dark:text-blue-400 dark:stroke-blue-400";
  if (score < 60) scoreColor = "text-amber-500 stroke-amber-500";
  if (score < 40) scoreColor = "text-rose-500 stroke-rose-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-28 h-28 transform -rotate-90">
        <circle
          cx="56"
          cy="56"
          r="42"
          className="stroke-slate-100 dark:stroke-slate-800 fill-none"
          strokeWidth="8"
        />
        <circle
          cx="56"
          cy="56"
          r="42"
          className={cn(
            "fill-none transition-all duration-1000 ease-out",
            scoreColor,
          )}
          strokeWidth="8"
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

export const Route = createFileRoute(
  "/development/research-innovation/cloud-platform-development/new",
)({
  head: () => ({
    meta: [{ title: "Cloud Platform Development Form · Magnertia ERP" }],
  }),
  component: CloudPlatformDevelopmentNewPage,
});

export function CloudPlatformFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <CloudPlatformDevelopmentNewPage {...props} />;
}

export function CloudPlatformPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <CloudPlatformDevelopmentNewPage {...props} />;
}

export function CloudPlatformDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Tab State & Interactive Controls
  const [activeTab, setActiveTab] = useState<CloudPlatformDevelopmentTabId>("overview");
  const [selectedAttachment, setSelectedAttachment] = useState<CloudAttachment | null>(null);

  // Modals & Dialog States
  const [isScaleClusterModalOpen, setIsScaleClusterModalOpen] = useState(false);
  const [isSecurityAuditModalOpen, setIsSecurityAuditModalOpen] = useState(false);
  const [isIacModalOpen, setIsIacModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Cluster Scale State Simulation
  const [nodeCount, setNodeCount] = useState(12);
  const [podCount, setPodCount] = useState(148);
  const [isScaling, setIsScaling] = useState(false);

  // Review & Approval State
  const [reviewDecision, setReviewDecision] =
    useState<CloudPlatformApprovalDecision>("Approved with Conditions");
  const [reviewCommentInput, setReviewCommentInput] = useState(
    "Platform architecture is stable. Ensure secondary DR failover dry-run is documented.",
  );

  // Data Fetching via React Query
  const { data: record, isLoading } = useQuery<CloudPlatformRecord>({
    queryKey: ["cloudPlatformDevelopmentRecord"],
    queryFn: () => cloudPlatformDevelopmentService.fetchRecord(),
  });

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<CloudPlatformFormInput>) =>
      cloudPlatformDevelopmentService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cloudPlatformDevelopmentRecord"], updated);
      toast.success("Draft saved successfully!", {
        description: "Cloud platform configurations updated.",
      });
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: () => cloudPlatformDevelopmentService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cloudPlatformDevelopmentRecord"], updated);
      toast.success("Submitted for Architecture Review!", {
        description: "Project moved to 'In Review' workflow stage.",
      });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: CloudPlatformApprovalDecision;
      comments?: string;
    }) => cloudPlatformDevelopmentService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cloudPlatformDevelopmentRecord"], updated);
      toast.success(`Review status updated to '${reviewDecision}'`, {
        description: "Audit log entry added.",
      });
    },
  });

  // Scale Cluster Simulation Action
  const handleScaleCluster = () => {
    setIsScaling(true);
    setTimeout(() => {
      setIsScaling(false);
      setNodeCount((prev) => prev + 4);
      setPodCount((prev) => prev + 32);
      toast.success("Kubernetes cluster autoscaled!", {
        description: `Nodes scaled to ${nodeCount + 4} (Capacity: 600K users)`,
      });
      setIsScaleClusterModalOpen(false);
    }, 800);
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Cloud Platform Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <ResearchInnovationTabBar />}
      >
        <div className="p-8 space-y-6">
          <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Cloud Platform Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Cloud Platform Development"}
      description="Architect multi-region cloud infrastructure, Kubernetes clusters, microservices, and serverless compute."
      tabs={tabs ?? <ResearchInnovationTabBar />}
    >
      <div className="space-y-6 pb-16">
        {/* Top Header Card */}
        <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-4 sm:p-5 transition-all">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5">
                  <Cloud className="h-6 w-6 text-blue-600 shrink-0" />
                  {record.cloudProjectName}
                </h1>
                <Badge variant="outline" className="bg-blue-50/80 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 font-mono text-xs font-semibold px-2.5 py-0.5">
                  {record.platformVersion}
                </Badge>
                <Badge
                  className={
                    record.workflowStatus === "Approved"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold"
                      : record.workflowStatus === "In Review"
                      ? "bg-purple-50 text-purple-700 border border-purple-200 font-semibold"
                      : "bg-amber-50 text-amber-700 border border-amber-200 font-semibold"
                  }
                >
                  <Workflow className="mr-1 h-3 w-3 inline" />
                  {record.workflowStatus}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground max-w-3xl">
                {record.platformObjective || "Provide secure, multi-region cloud infrastructure and scalable services for EV operations."}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate({})}
                disabled={saveDraftMutation.isPending}
                className="h-8 px-3 text-xs gap-1.5 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
              >
                <Save className="h-3.5 w-3.5 text-slate-500" />
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
                  <Button variant="outline" size="icon" className="h-8 w-8 border-slate-200">
                    <MoreHorizontal className="h-4 w-4 text-slate-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs">
                  <DropdownMenuItem onClick={() => setIsScaleClusterModalOpen(true)}>
                    <Server className="h-3.5 w-3.5 mr-2 text-blue-600" /> Scale Kubernetes Nodes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSecurityAuditModalOpen(true)}>
                    <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Run Security & IAM Scan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsIacModalOpen(true)}>
                    <FileCode className="h-3.5 w-3.5 mr-2 text-purple-600" /> View Terraform IaC Specs
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Printer className="h-3.5 w-3.5 mr-2" /> Print Specification
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Link copied to clipboard!");
                    }}
                  >
                    <Share2 className="h-3.5 w-3.5 mr-2" /> Share Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Reference Badges Strip */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Cloud Dev ID</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{record.cloudPlatformDevelopmentId}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Form Code</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{record.formCode}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Linked Product</span>
              <span className="font-medium text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                {record.linkedProductId || "Smart EV Platform"} <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Linked Software Dev</span>
              <span className="font-medium text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                {record.linkedSoftwareDevId} <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Linked Cloud Platform</span>
              <span className="font-medium text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                {record.cloudPlatformDevelopmentId} <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Linked Mobile App</span>
              <span className="font-medium text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                {record.linkedMobileDevId} <ExternalLink className="h-3 w-3" />
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Cloud Architect</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100 truncate block">{record.cloudArchitectName}</span>
            </div>
          </div>
        </div>
        {/* Scores & Health Gauges Banner */}
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 space-y-6">
          <ProductScoreBanner submoduleKey="cloud-platform-development" />

          {/* ====================================================================
             2. BALANCED 2-COLUMN GRID (Equal Height, Perfectly Aligned)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Platform Overview, Purpose & SLA */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Cloud Platform Overview & SLA Scope</CardTitle>
                  </div>
                  <Badge variant="secondary" className="text-xs font-semibold">{record.businessUnit}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs flex-1">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Platform Objective
                  </span>
                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 leading-relaxed font-medium text-foreground">
                    {record.platformObjective}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                    Business Purpose
                  </span>
                  <p className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 text-muted-foreground leading-relaxed">
                    {record.businessPurpose}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Target Stakeholders
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {record.targetUsers.map((u, i) => (
                        <Badge key={i} variant="secondary" className="text-[11px] px-2 py-0.5">
                          {u}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-emerald-200/80 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/30 text-center flex flex-col justify-center">
                    <span className="text-[10px] text-muted-foreground block font-medium uppercase tracking-wider">SLA Target</span>
                    <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">{record.slaTarget}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Infrastructure Telemetry & Status */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Infrastructure Telemetry & Cluster Status</CardTitle>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsScaleClusterModalOpen(true)} className="gap-1 text-xs h-7">
                    <Server className="h-3 w-3" />
                    Scale Cluster
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs flex-1">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Kubernetes Nodes</span>
                    <span className="text-sm font-bold text-foreground font-mono">{nodeCount} EKS Nodes</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">{podCount} Active Pods</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Primary Database</span>
                    <span className="text-sm font-bold text-foreground font-mono truncate block">{record.dataPlatformConfig.primaryDatabase}</span>
                    <span className="text-[10px] text-muted-foreground block">Multi-AZ Streaming</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                    <span className="text-muted-foreground block text-[11px]">30-Day Uptime</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{record.monitoringConfig.uptime30DaysPct}%</span>
                    <span className="text-[10px] text-muted-foreground block">2 Active Alerts</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                    <span className="text-muted-foreground block text-[11px]">Throughput Benchmark</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">{record.scalabilityMetrics.throughputTps} TPS</span>
                    <span className="text-[10px] text-muted-foreground block">14.2ms Avg Latency</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900 text-xs space-y-1">
                  <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-200">
                    <span>AI Architecture Recommendation</span>
                    <Badge className="bg-blue-600 text-white text-[10px]">Verified</Badge>
                  </div>
                  <p className="text-blue-800 dark:text-blue-300">
                    {record.readinessSummary.recommendation}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 3: Cloud Architecture & Network Topology */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Cloud Architecture & Network Topology</CardTitle>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono text-xs">
                    Score: {record.architectureConfig.architectureReadinessScore}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Architecture Style</span>
                    <span className="font-semibold text-foreground text-xs">{record.architectureConfig.architectureStyle}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Deployment Model</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.architectureConfig.deploymentModel}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Compute Platform</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.architectureConfig.computePlatform}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">DR Strategy</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.architectureConfig.drStrategy}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                  <span className="font-semibold text-foreground text-xs block">VPC Network Topology & Gateway Routing</span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Isolated multi-AZ Virtual Private Clouds across primary region (ap-south-1) and secondary failover (ap-southeast-1). Zero-trust service mesh with mutual TLS encryption and Kong API gateway edge ingress.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 4: Database & Data Infrastructure */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Database & Data Infrastructure</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs">
                    Data Score: {record.dataPlatformConfig.dataReadinessScore}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Primary DB</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.dataPlatformConfig.primaryDatabase}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Cache Platform</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.dataPlatformConfig.cachePlatform}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Data Warehouse</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.dataPlatformConfig.dataWarehouse}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Disaster Recovery</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.dataPlatformConfig.replicationStrategy}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                  <span className="font-semibold text-foreground text-xs block">Continuous Data Telemetry & Analytics Pipeline</span>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    Sub-second CDC streaming from Aurora PostgreSQL through Apache Kafka event brokers into Redshift warehouse with automated automated daily snapshot backups.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Card 5: Security, Identity & Governance */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Security, Identity & Governance</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 text-white font-mono text-xs">
                      Security: {record.securityConfig.securityScore}/100
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsSecurityAuditModalOpen(true)} className="gap-1 text-xs h-7">
                      <Lock className="h-3 w-3" />
                      Scan IAM
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Identity Provider</span>
                    <span className="font-semibold text-foreground text-xs">{record.securityConfig.identityProvider}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Authentication</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.securityConfig.authMethod}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Encryption</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.securityConfig.encryptionStandard}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Secrets Manager</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.securityConfig.secretsManager}</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                  <span className="font-semibold text-foreground text-xs block">Enterprise Compliance & Regulatory Certifications</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["ISO 27001", "SOC 2 Type II", "GDPR", "PCI DSS Level 1"].map((cert, i) => (
                      <Badge key={i} variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px] px-2.5 py-0.5">
                        <Check className="h-3 w-3 mr-1 inline" /> {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Card 6: DevOps, IaC & Kubernetes Infrastructure */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">DevOps, IaC & GitOps Infrastructure</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white font-mono text-xs">
                      Infra: {record.devOpsConfig.infraScore}/100
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsIacModalOpen(true)} className="gap-1 text-xs h-7">
                      <FileCode className="h-3 w-3" />
                      View IaC
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">IaC Framework</span>
                    <span className="font-semibold text-foreground text-xs">{record.devOpsConfig.iacTool}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Kubernetes Engine</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.devOpsConfig.orchestrator}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">CI/CD Pipeline</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.devOpsConfig.cicdPipeline}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Monitoring Stack</span>
                    <span className="font-semibold text-foreground text-xs truncate block">{record.devOpsConfig.monitoringStack}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="p-2 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-muted-foreground block">30-Day Uptime</span>
                    <span className="font-mono font-bold text-emerald-600 text-xs">{record.monitoringConfig.uptime30DaysPct}%</span>
                  </div>
                  <div className="p-2 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-muted-foreground block">Active Alerts</span>
                    <span className="font-mono font-bold text-amber-600 text-xs">2 Alerts</span>
                  </div>
                  <div className="p-2 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-muted-foreground block">Resolved Incidents</span>
                    <span className="font-mono font-bold text-blue-600 text-xs">1 Resolved</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             3. CORE SERVICES REGISTRY (Full Width Table)
             ==================================================================== */}
          <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">Cloud Platform Core Services Registry</CardTitle>
                </div>
                <Badge className="bg-emerald-600 text-white font-mono text-xs">
                  Service Score: {record.servicesConfig.serviceReadinessScore}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-muted-foreground font-semibold">
                      <th className="p-3">Service Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Provider / Tool</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Readiness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {record.servicesConfig.servicesList.map((srv, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-3 font-semibold text-slate-900 dark:text-white">{srv.name}</td>
                        <td className="p-3 text-muted-foreground">{srv.category}</td>
                        <td className="p-3 font-mono text-blue-600 dark:text-blue-400 font-medium">{srv.provider}</td>
                        <td className="p-3">
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[10px] px-2">
                            {srv.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">{srv.readinessScore}/100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ====================================================================
             4. PERFORMANCE & AI CLOUD OPTIMIZATION (2-Column Grid)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Left: Performance, Autoscaling & Throughput */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Performance, Autoscaling & Latency</CardTitle>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono text-xs">
                    Scalability: {record.scalabilityMetrics.scalabilityScore}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Autoscaling Strategy</span>
                    <span className="font-semibold text-foreground text-xs">{record.scalabilityMetrics.autoscalingPolicy}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">High Availability</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.scalabilityMetrics.highAvailabilityModel}</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Latency Average</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-xs">{record.scalabilityMetrics.latencyMs} ms</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block text-[10px]">Peak Capacity</span>
                    <span className="font-semibold text-foreground font-mono text-xs">{record.scalabilityMetrics.concurrentUsersLimit}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right: AI Cloud Platform Assessment & Optimization */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-sm font-bold">AI Cloud Platform Assessment & FinOps</CardTitle>
                  </div>
                  <Badge className="bg-purple-600 text-white font-mono text-xs">
                    AI Score: {record.aiAssessment.overallAiScore}/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-2 text-xs flex-1">
                {[
                  "Enable Graviton3 instances to reduce EC2 compute costs by ~18%.",
                  "Upgrade Kubernetes cluster nodes to v1.29 for enhanced security patch level.",
                  "Implement Redis Cluster read-replicas in secondary Availability Zone.",
                ].map((insight, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-purple-100 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    <span className="text-slate-800 dark:text-slate-200 font-medium leading-snug">{insight}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             5. ATTACHMENTS & INFRASTRUCTURE DIAGRAMS (Full Width)
             ==================================================================== */}
          <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">Attachments & Infrastructure Diagrams</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{record.attachments.length} Files</Badge>
                  <Button size="sm" variant="outline" onClick={() => setIsUploadOpen(true)} className="gap-1 text-xs h-7">
                    <Upload className="h-3 w-3" />
                    Upload File
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {record.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileCode className="h-4 w-4 text-blue-500 shrink-0" />
                      <div className="truncate">
                        <span className="font-semibold text-foreground block truncate" title={att.name}>{att.name}</span>
                        <span className="text-[10px] text-muted-foreground">{att.size} • {att.uploadedBy}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedAttachment(att)}>
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

          {/* ====================================================================
             6. REVIEW & APPROVAL BOARD GOVERNANCE (Full Width)
             ==================================================================== */}
          <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">Review & Approval Board Timeline</CardTitle>
                </div>
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border-amber-200">
                  Cloud Governance Committee
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-5 text-xs">
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
                        <td className="p-3 font-semibold text-foreground">{rev.role}</td>
                        <td className="p-3 font-medium text-foreground">{rev.person}</td>
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
                        <td className="p-3 text-slate-700 dark:text-slate-300">{rev.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Sign-off Form */}
              <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                  Submit Review Decision
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">
                      Approval Decision <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={reviewDecision}
                      onChange={(e) => setReviewDecision(e.target.value as CloudPlatformApprovalDecision)}
                      className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <option value="Approved">Approved (Production Ready)</option>
                      <option value="Approved with Conditions">Approved with Conditions</option>
                      <option value="Changes Requested">Changes Requested</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1 text-[11px]">
                      Review Comments
                    </label>
                    <Textarea
                      rows={2}
                      value={reviewCommentInput}
                      onChange={(e) => setReviewCommentInput(e.target.value)}
                      placeholder="Add approval or modification remarks..."
                      className="text-xs resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <Button
                    size="sm"
                    onClick={() =>
                      reviewDecisionMutation.mutate({
                        id: record.id,
                        decision: reviewDecision,
                        comments: reviewCommentInput,
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
        </div>

        {/* =========================================================================
            3. INTERACTIVE DIALOGS & MODALS
            ========================================================================= */}

        {/* Scale Cluster Dialog */}
        <Dialog open={isScaleClusterModalOpen} onOpenChange={setIsScaleClusterModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-600" />
                Kubernetes EKS Cluster Autoscaler
              </DialogTitle>
              <DialogDescription>
                Scale worker node pools across Availability Zones
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-100 dark:bg-slate-900">
                <span className="font-semibold">Current Cluster Nodes</span>
                <span className="font-mono font-bold text-blue-600">{nodeCount} Nodes</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-100 dark:bg-slate-900">
                <span className="font-semibold">Current Active Pods</span>
                <span className="font-mono font-bold text-emerald-600">{podCount} Pods</span>
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleScaleCluster}
                disabled={isScaling}
                className="bg-blue-600 text-white gap-1.5"
              >
                <Server className="h-4 w-4" />
                {isScaling ? "Scaling..." : "Scale Up Cluster (+4 Nodes)"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Security Scan Modal */}
        <Dialog open={isSecurityAuditModalOpen} onOpenChange={setIsSecurityAuditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                IAM & Cloud Security Scanner
              </DialogTitle>
              <DialogDescription>
                ISO 27001, SOC 2, and OAuth 2.0 policy verification
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Encryption Audit
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                  AES-256 at Rest & TLS 1.3 in Transit verified.
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsSecurityAuditModalOpen(false)}>
                Close Scanner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* IaC Terraform Modal */}
        <Dialog open={isIacModalOpen} onOpenChange={setIsIacModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-purple-600" />
                Terraform HCL Infrastructure Specs
              </DialogTitle>
              <DialogDescription>
                main.tf configuration file preview
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-950 text-emerald-400 font-mono text-xs h-48 overflow-y-auto">
              {`module "eks_cluster" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = "magnertia-cloud-eks"
  cluster_version = "1.28"
  subnets         = ["subnet-1234", "subnet-5678"]
  vpc_id          = "vpc-998877"

  node_groups = {
    primary = {
      desired_capacity = ${nodeCount}
      max_capacity     = 32
      min_capacity     = 4
      instance_types   = ["m6i.xlarge"]
    }
  }
}`}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsIacModalOpen(false)}>
                Close
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
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                {selectedAttachment?.name}
              </DialogTitle>
              <DialogDescription>
                {selectedAttachment?.type} Document • {selectedAttachment?.size}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs h-40 flex items-center justify-center">
              [Previewing file content for {selectedAttachment?.name}]
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setSelectedAttachment(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Cloud Infrastructure Attachment</DialogTitle>
              <DialogDescription>
                Upload architecture diagram, Terraform code, or security report
              </DialogDescription>
            </DialogHeader>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-8 text-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Drag and drop files here or click to browse
              </span>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  setIsUploadOpen(false);
                  toast.success("File uploaded successfully!");
                }}
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

export default CloudPlatformDevelopmentNewPage;


