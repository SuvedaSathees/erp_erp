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
  Radio,
  FileCheck,
  Share2,
  Printer,
  History,
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

        {/* =========================================================================
            2. MAIN CONTENT AREA (LAYOUT: LEFT CONTENT + RIGHT SIDEBAR)
            ========================================================================= */}
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 py-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 9-column content */}
          <div className="lg:col-span-9 space-y-6">

            {/* TAB CONTENT 1: OVERVIEW */}
            {(activeTab === "overview" || activeTab === "system_info") && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Cloud Platform Overview */}
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="pb-3 flex flex-row items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-600" />
                          1. Cloud Platform Overview
                        </CardTitle>
                        <CardDescription>
                          Platform purpose, business objective, and target users
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{record.businessUnit}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs">
                      <div>
                        <span className="font-semibold text-muted-foreground block mb-1">
                          Platform Objective
                        </span>
                        <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-md border border-slate-200/60 dark:border-slate-800">
                          {record.platformObjective}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold text-muted-foreground block mb-1">
                          Business Purpose
                        </span>
                        <p className="text-slate-700 dark:text-slate-300">
                          {record.businessPurpose}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-semibold text-muted-foreground block mb-1">
                            Target Users
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {record.targetUsers.map((u, i) => (
                              <Badge key={i} variant="outline" className="text-[10px]">
                                {u}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-muted-foreground block mb-1">
                            SLA Target
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                            {record.slaTarget}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Card 2: Platform Statistics & Infrastructure Status */}
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        Infrastructure Telemetry & Status
                      </CardTitle>
                      <CardDescription>
                        Active clusters, databases, and monitoring
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <span className="text-muted-foreground block text-[11px]">
                            Kubernetes Nodes
                          </span>
                          <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                            {nodeCount} EKS Nodes
                          </span>
                          <span className="text-[10px] text-emerald-600 block mt-0.5 font-medium">
                            {podCount} Active Pods
                          </span>
                        </div>

                        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <span className="text-muted-foreground block text-[11px]">
                            Primary Database
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono truncate block">
                            {record.dataPlatformConfig.primaryDatabase}
                          </span>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            Multi-AZ Streaming
                          </span>
                        </div>

                        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <span className="text-muted-foreground block text-[11px]">
                            30-Day Uptime
                          </span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {record.monitoringConfig.uptime30DaysPct}%
                          </span>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            2 Active Alerts
                          </span>
                        </div>

                        <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                          <span className="text-muted-foreground block text-[11px]">
                            Throughput Benchmark
                          </span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400 font-mono">
                            {record.scalabilityMetrics.throughputTps} TPS
                          </span>
                          <span className="text-[10px] text-muted-foreground block mt-0.5">
                            14.2ms Avg Latency
                          </span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900 text-xs space-y-1.5">
                        <div className="flex items-center justify-between font-semibold text-blue-900 dark:text-blue-200">
                          <span>AI Architecture Recommendation</span>
                          <Badge className="bg-blue-600 text-white text-[10px]">
                            Verified
                          </Badge>
                        </div>
                        <p className="text-blue-800 dark:text-blue-300">
                          {record.readinessSummary.recommendation}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: CLOUD ARCHITECTURE */}
            {(activeTab === "overview" || activeTab === "architecture") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-600" />
                      2. Cloud Architecture & Network Topology
                    </CardTitle>
                    <CardDescription>
                      Microservices design, API Gateway, service mesh, and network layout
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono">
                    Score: {record.architectureConfig.architectureReadinessScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Architecture Style
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.architectureConfig.architectureStyle}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Deployment Model
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {record.architectureConfig.deploymentModel}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Compute Platform
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.architectureConfig.computePlatform}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        DR Strategy
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {record.architectureConfig.drStrategy}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 3: CLOUD SERVICES */}
            {(activeTab === "overview" || activeTab === "services") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Server className="h-4 w-4 text-blue-600" />
                      3. Cloud Platform Core Services Registry
                    </CardTitle>
                    <CardDescription>
                      API gateway, authentication, messaging queues, and storage services
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono">
                    Service Score: {record.servicesConfig.serviceReadinessScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Services List Table */}
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
                        {record.servicesConfig.servicesList.map((svc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                            <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              {svc.name}
                            </td>
                            <td className="p-3 text-muted-foreground">{svc.category}</td>
                            <td className="p-3 font-mono font-medium">{svc.provider}</td>
                            <td className="p-3">
                              <Badge className="bg-emerald-600 text-white">
                                {svc.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-right font-mono font-bold text-blue-600 dark:text-blue-400">
                              {svc.score}/100
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 4: DATABASE & DATA PLATFORM */}
            {(activeTab === "overview" || activeTab === "data_platform") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-600" />
                      4. Database & Data Infrastructure
                    </CardTitle>
                    <CardDescription>
                      Primary databases, Redis caching, Redshift warehouse, and DR replication
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono">
                    Data Score: {record.dataPlatformConfig.dataPlatformScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Primary Database
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.dataPlatformConfig.primaryDatabase}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Cache Platform
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {record.dataPlatformConfig.cachePlatform}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Data Warehouse
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.dataPlatformConfig.dataWarehouse}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Disaster Recovery
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.dataPlatformConfig.disasterRecovery}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 5: SECURITY & IDENTITY */}
            {(activeTab === "overview" || activeTab === "security") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      5. Security, Identity & Governance Scorecard
                    </CardTitle>
                    <CardDescription>
                      OAuth2/OIDC, RBAC policies, Keycloak provider, and ISO/SOC 2 compliance
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono">
                    Security Score: {record.securityConfig.securityScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Identity Provider
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.securityConfig.identityProvider}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Authentication Method
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.securityConfig.authenticationMethod}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Encryption Standard
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {record.securityConfig.encryptionStandard}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Secrets Manager
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.securityConfig.secretsManager}
                      </span>
                    </div>
                  </div>

                  {/* Compliance Standards Badges */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-2">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Enterprise Compliance & Regulatory Certifications
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {record.securityConfig.complianceStandards.map((std, i) => (
                        <Badge
                          key={i}
                          className="bg-blue-600 text-white px-3 py-1 text-xs"
                        >
                          <Shield className="h-3.5 w-3.5 mr-1" />
                          {std}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 6: DEVOPS & INFRASTRUCTURE */}
            {(activeTab === "overview" || activeTab === "devops_infrastructure") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-blue-600" />
                      6. DevOps, IaC & Kubernetes Infrastructure
                    </CardTitle>
                    <CardDescription>
                      Terraform automation, EKS cluster management, and ArgoCD GitOps
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 text-white font-mono">
                      Infra Score: {record.devOpsConfig.infrastructureReadinessScore}/100
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => setIsScaleClusterModalOpen(true)}
                      className="bg-blue-600 text-white gap-1 text-xs"
                    >
                      <Server className="h-3.5 w-3.5" />
                      Scale Cluster
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Infrastructure as Code
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.devOpsConfig.infrastructureAsCode}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Kubernetes Cluster
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {record.devOpsConfig.kubernetesCluster}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        CI/CD Pipeline
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.devOpsConfig.cicdPipeline}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Monitoring Platform
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.devOpsConfig.monitoringPlatform}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 7: SCALABILITY & PERFORMANCE */}
            {(activeTab === "overview" || activeTab === "scalability") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      7. Performance, Autoscaling & Throughput
                    </CardTitle>
                    <CardDescription>
                      HPA policies, ALB load balancing, CDN, and latency benchmarks
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono">
                    Scalability Score: {record.scalabilityMetrics.scalabilityScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Autoscaling Strategy
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.scalabilityMetrics.autoScalingStrategy}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        High Availability
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {record.scalabilityMetrics.highAvailability}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Latency Average
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {record.scalabilityMetrics.latencyAvgMs} ms
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Peak Capacity
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.scalabilityMetrics.capacityPlanning}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 8: MONITORING & OPERATIONS */}
            {(activeTab === "overview" || activeTab === "monitoring_operations") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-blue-600" />
                      8. Monitoring, Observability & Incident Operations
                    </CardTitle>
                    <CardDescription>
                      Datadog APM, Prometheus metrics, PagerDuty alerts, and uptime
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono">
                    Ops Score: {record.monitoringConfig.operationsReadinessScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">
                        30-Day Operational Uptime
                      </span>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                        {record.monitoringConfig.uptime30DaysPct}%
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">
                        Active System Alerts
                      </span>
                      <span className="text-2xl font-black text-amber-500 font-mono">
                        {record.monitoringConfig.activeAlertsCount} Alerts
                      </span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
                      <span className="text-muted-foreground block text-[11px]">
                        Incidents (Last 30 Days)
                      </span>
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400 font-mono">
                        {record.monitoringConfig.incidentsCount} Resolved
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 9: AI ASSESSMENT */}
            {(activeTab === "overview" || activeTab === "ai_assessment") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      9. AI Cloud Platform Assessment
                    </CardTitle>
                    <CardDescription>
                      Automated cost, performance, and capacity optimization suggestions
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono">
                    AI Score: {record.aiAssessment.aiOverallCloudScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 space-y-2">
                    <span className="font-bold text-blue-900 dark:text-blue-200 block">
                      AI Infrastructure Optimization Insights
                    </span>
                    <ul className="space-y-1.5 text-blue-800 dark:text-blue-300 list-disc list-inside">
                      {record.aiAssessment.aiSuggestions.map((sug, i) => (
                        <li key={i}>{sug}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 10: ATTACHMENTS */}
            {(activeTab === "overview" || activeTab === "attachments") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      10. Attachments & Infrastructure Diagrams
                    </CardTitle>
                    <CardDescription>
                      Terraform files, architecture diagrams, and security reports
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsUploadOpen(true)}
                    className="gap-1 text-xs"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Upload File
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {record.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileCode className="h-5 w-5 text-blue-500 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-slate-900 dark:text-white block truncate">
                              {att.name}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
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
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Download className="h-3.5 w-3.5 text-slate-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 11: REVIEW & APPROVAL */}
            {(activeTab === "overview" || activeTab === "review_approval") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Workflow className="h-4 w-4 text-blue-600" />
                    11. Review & Approval Board Timeline
                  </CardTitle>
                  <CardDescription>
                    Multi-sign-off enterprise governance committee status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  {/* Reviewers Table */}
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/70 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-muted-foreground font-semibold">
                          <th className="p-3">Role</th>
                          <th className="p-3">Reviewer</th>
                          <th className="p-3">Decision</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Comments</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {record.reviewers.map((rev, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
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
                                    ? "bg-emerald-600 text-white"
                                    : rev.decision === "Approved with Conditions"
                                    ? "bg-amber-500 text-white"
                                    : "bg-slate-400 text-white"
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
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      Submit Review Decision
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="font-semibold text-muted-foreground block mb-1">
                          Approval Decision
                        </label>
                        <select
                          value={reviewDecision}
                          onChange={(e) =>
                            setReviewDecision(e.target.value as CloudPlatformApprovalDecision)
                          }
                          className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs font-medium"
                        >
                          <option value="Approved">Approved</option>
                          <option value="Approved with Conditions">
                            Approved with Conditions
                          </option>
                          <option value="Changes Requested">Changes Requested</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-semibold text-muted-foreground block mb-1">
                          Review Comments
                        </label>
                        <Textarea
                          value={reviewCommentInput}
                          onChange={(e) => setReviewCommentInput(e.target.value)}
                          placeholder="Add approval or architecture remarks..."
                          className="h-20 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
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
                        className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Save Decision
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* RIGHT SIDEBAR (3 columns) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Overall Score Radial Widget */}
            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardHeader className="pb-2 text-center">
                <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Overall Cloud Score
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <div className="flex justify-center items-center py-2">
                  <CircularScoreGauge score={record.overallCloudPlatformScore} label="Overall Score" />
                </div>

                <div className="space-y-2 text-xs text-left pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Architecture</span>
                    <span className="font-bold text-foreground font-mono">
                      {record.architectureReadinessScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Security</span>
                    <span className="font-bold text-foreground font-mono">
                      {record.securityScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Infrastructure</span>
                    <span className="font-bold text-foreground font-mono">
                      {record.infrastructureReadinessScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Operations</span>
                    <span className="font-bold text-foreground font-mono">
                      {record.operationsReadinessScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground font-medium">Performance</span>
                    <span className="font-bold text-foreground font-mono">
                      {record.performanceScore}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
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


