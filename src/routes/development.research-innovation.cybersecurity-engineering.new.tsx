import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Shield,
  ShieldAlert,
  Lock,
  Key,
  Terminal,
  Activity,
  Gauge,
  Layers,
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
  Target,
  Zap,
  BarChart3,
  Check,
  X,
  ChevronDown,
  Filter,
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
  Globe,
  Settings,
  TrendingUp,
  Sparkles,
  Grid3x3,
  Clock,
  ArrowUpRight,
  Bug,
  AlertOctagon,
  Fingerprint,
} from "lucide-react";

import { cybersecurityEngineeringService } from "@/services/cybersecurityEngineeringService";
import type {
  CybersecurityRecord,
  CybersecurityFormInput,
  CybersecurityApprovalDecision,
  CybersecurityAttachment,
  CybersecurityReviewer,
  CybersecurityAuditEntry,
} from "@/services/types";
import { ResearchInnovationTabBar, InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import {
  CybersecurityEngineeringTabBar,
  CYBERSECURITY_TABS,
  type CybersecurityEngineeringTabId,
} from "@/components/erp/CybersecurityEngineeringTabBar";
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
  label = "SECURITY SCORE",
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
  "/development/research-innovation/cybersecurity-engineering/new",
)({
  head: () => ({
    meta: [{ title: "Cybersecurity Engineering Form · Magnertia ERP" }],
  }),
  component: CybersecurityEngineeringNewPage,
});

export function CybersecurityFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <CybersecurityEngineeringNewPage {...props} />;
}

export function CybersecurityPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <CybersecurityEngineeringNewPage {...props} />;
}

export function CybersecurityEngineeringNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Tab State & Interactive Controls
  const [activeTab, setActiveTab] = useState<CybersecurityEngineeringTabId>("overview");
  const [selectedAttachment, setSelectedAttachment] = useState<CybersecurityAttachment | null>(null);

  // Modals & Dialog States
  const [isVulnerabilityScanOpen, setIsVulnerabilityScanOpen] = useState(false);
  const [isThreatHeatmapOpen, setIsThreatHeatmapOpen] = useState(false);
  const [isSiemConsoleOpen, setIsSiemConsoleOpen] = useState(false);
  const [isKeyManagementOpen, setIsKeyManagementOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Scan Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  // Review & Approval State
  const [reviewDecision, setReviewDecision] =
    useState<CybersecurityApprovalDecision>("Approved with Conditions");
  const [reviewCommentInput, setReviewCommentInput] = useState(
    "Overall security posture is good. Please remediate minor findings and re-run vulnerability scan.",
  );

  // Data Fetching via React Query
  const { data: record, isLoading } = useQuery<CybersecurityRecord>({
    queryKey: ["cybersecurityEngineeringRecord"],
    queryFn: () => cybersecurityEngineeringService.fetchRecord(),
  });

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<CybersecurityFormInput>) =>
      cybersecurityEngineeringService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
      toast.success("Draft saved successfully!", {
        description: "Cybersecurity parameters and configurations updated.",
      });
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: () => cybersecurityEngineeringService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
      toast.success("Submitted for Security Review!", {
        description: "Project moved to 'In Review' workflow stage.",
      });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: CybersecurityApprovalDecision;
      comments?: string;
    }) => cybersecurityEngineeringService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
      toast.success(`Review decision updated to '${reviewDecision}'`, {
        description: "Audit log entry added.",
      });
    },
  });

  // Vulnerability Scan Simulation Action
  const handleStartVulnerabilityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([
      "Initializing Qualys VMDR vulnerability scanner Engine...",
      "Scanning cloud API endpoints and microservices...",
    ]);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setScanProgress(current);
      setScanLogs((prev) => [
        ...prev,
        `Scanning target ${current}% complete - Inspected 148 container pods and 24 APIs...`,
      ]);

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanLogs((prev) => [
          ...prev,
          "Scan finished! 0 Critical, 0 High, 4 Low vulnerabilities detected. All compliance rules passed.",
        ]);
        toast.success("Vulnerability scan completed successfully!", {
          description: "4 low-severity findings identified.",
        });
      }
    }, 400);
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Cybersecurity Engineering"
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
      title="Cybersecurity Engineering"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Cybersecurity Engineering"}
      description="Perform threat modeling (STRIDE), vulnerability assessments, penetration testing, and security compliance audits."
      tabs={tabs ?? <ResearchInnovationTabBar />}
    >
      <div className="space-y-6 pb-16">
        {/* Record Header Bar */}
        <div className="bg-white dark:bg-slate-900 border-b border-border px-6 py-4 space-y-3 shadow-2xs">
          {/* Row 1: Primary Title, Version, Status & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {record.securityProjectName}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs"
                >
                  {record.securityVersion}
                </Badge>
                <Badge
                  className={
                    record.workflowStatus === "Approved"
                      ? "bg-emerald-600 text-white"
                      : record.workflowStatus === "In Review"
                      ? "bg-amber-500 text-white"
                      : "bg-blue-600 text-white"
                  }
                >
                  {record.workflowStatus}
                </Badge>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate({})}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 h-9"
              >
                <Save className="h-4 w-4 text-slate-500" />
                Save Draft
              </Button>

              <Button
                size="sm"
                onClick={() => submitForReviewMutation.mutate()}
                disabled={submitForReviewMutation.isPending}
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
                  <DropdownMenuItem onClick={() => setIsVulnerabilityScanOpen(true)}>
                    <Bug className="h-4 w-4 mr-2 text-amber-500" />
                    Run Vulnerability Scan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsThreatHeatmapOpen(true)}>
                    <AlertOctagon className="h-4 w-4 mr-2 text-red-500" />
                    View STRIDE Threat Heatmap
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSiemConsoleOpen(true)}>
                    <Activity className="h-4 w-4 mr-2 text-blue-500" />
                    View Microsoft Sentinel SIEM
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
                  Cybersecurity ID
                </span>
                <span className="font-bold font-mono text-foreground">
                  {record.cybersecurityEngineeringId}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Form Code
                </span>
                <span className="font-semibold font-mono text-foreground">
                  {record.formCode}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked Product
                </span>
                <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline">
                  {record.linkedProductId}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked Software
                </span>
                <span className="font-mono text-muted-foreground">
                  {record.linkedSoftwareDevId}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked Cloud
                </span>
                <span className="font-mono text-muted-foreground">
                  {record.linkedCloudPlatformDevId}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked API
                </span>
                <span className="font-mono text-muted-foreground">
                  {record.linkedApiDevId}
                </span>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked AI Model
                </span>
                <span className="font-mono text-muted-foreground">
                  {record.linkedAiModelDevId}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                Security Architect:
              </span>
              <span className="font-semibold text-foreground">
                {record.securityArchitectName}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. MAIN CONTENT AREA (LAYOUT: LEFT CONTENT + RIGHT SIDEBAR)
            ========================================================================= */}
        <div className="max-w-7xl mx-auto px-6 py-6 w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main 9-column content */}
          <div className="lg:col-span-9 space-y-6">
            {/* WORKFLOW STAGE TIMELINE BANNER */}
            <Card className="border-border/80 shadow-xs bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/20 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Cybersecurity Lifecycle Readiness Pillars
                    </span>
                  </div>
                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Status: <strong className="font-bold">5 of 5 Pillars Compliant (91% Avg)</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {[
                    { label: "1. Threat Model", score: record.threatReadinessScore, color: "bg-blue-500" },
                    { label: "2. Architecture", score: record.architectureSecurityScore, color: "bg-emerald-500" },
                    { label: "3. Secure Dev", score: record.secureDevelopmentScore, color: "bg-purple-500" },
                    { label: "4. Compliance", score: record.governanceScore, color: "bg-indigo-500" },
                    { label: "5. Monitoring", score: record.monitoringScore, color: "bg-emerald-600" },
                  ].map((pillar, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-border/60 bg-white/80 dark:bg-slate-900/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{pillar.label}</span>
                        <Badge variant="outline" className="text-[10px] font-mono font-bold">
                          {pillar.score}/100
                        </Badge>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${pillar.color}`} style={{ width: `${pillar.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* TAB CONTENT 1: OVERVIEW */}
            {(activeTab === "overview" || activeTab === "system_info") && (
              <div className="space-y-6">
                <Card className="border-border/80 shadow-xs">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-semibold flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-600" />
                        1. Security Project Overview
                      </CardTitle>
                      <CardDescription>
                        Business objective and target deployment scope
                      </CardDescription>
                    </div>
                    <Badge className="bg-red-600 text-white">
                      Criticality: {record.criticalityLevel}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4 text-xs">
                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">
                        Business Objective
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-md border border-slate-200/60 dark:border-slate-800">
                        {record.businessObjective}
                      </p>
                    </div>

                    <div>
                      <span className="font-semibold text-muted-foreground block mb-1">
                        Security Scope
                      </span>
                      <p className="text-slate-700 dark:text-slate-300">
                        {record.securityScope}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-semibold text-muted-foreground block mb-1">
                          Product Category
                        </span>
                        <Badge variant="outline" className="font-medium">
                          {record.productCategory}
                        </Badge>
                      </div>

                      <div>
                        <span className="font-semibold text-muted-foreground block mb-1">
                          Target Deployment
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {record.targetDeployment.map((d, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">
                              {d}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* TAB CONTENT 2: THREAT MODELING */}
            {(activeTab === "overview" || activeTab === "threat_modeling") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <AlertOctagon className="h-4 w-4 text-blue-600" />
                      2. Threat Modeling & Risk Matrix
                    </CardTitle>
                    <CardDescription>
                      STRIDE attack vectors, asset inventory, and threat scenarios
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono">
                    Score: {record.threatModelConfig.threatModelScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Threat Modeling Method
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.threatModelConfig.method}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Assets Identified
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {record.threatModelConfig.assetsIdentified} Assets
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Attack Surface Level
                      </span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {record.threatModelConfig.attackSurface}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Controls Proposed
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {record.threatModelConfig.securityControlsProposed} Controls
                      </span>
                    </div>
                  </div>

                  {/* STRIDE Risk Categories Grid */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-3">
                    <div className="flex justify-between items-center font-semibold text-slate-900 dark:text-white">
                      <span>STRIDE Threat Categorization Breakdown</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsThreatHeatmapOpen(true)}
                        className="gap-1 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View Threat Heatmap
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { cat: "Spoofing (Identity)", risk: "Mitigated", count: "4 Controls" },
                        { cat: "Tampering (Data)", risk: "Mitigated", count: "6 Controls" },
                        { cat: "Repudiation", risk: "Mitigated", count: "3 Controls" },
                        { cat: "Information Disclosure", risk: "Mitigated", count: "8 Controls" },
                        { cat: "Denial of Service (DoS)", risk: "Mitigated", count: "5 Controls" },
                        { cat: "Elevation of Privilege", risk: "Mitigated", count: "6 Controls" },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1"
                        >
                          <span className="font-bold block text-slate-900 dark:text-white">
                            {item.cat}
                          </span>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-emerald-600 font-medium">{item.risk}</span>
                            <span className="text-muted-foreground">{item.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 3: SECURE ARCHITECTURE */}
            {(activeTab === "overview" || activeTab === "architecture") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-600" />
                      3. Secure Architecture & Zero Trust Principles
                    </CardTitle>
                    <CardDescription>
                      Network segmentation, TLS 1.3, AES-256 encryption, and KMS key management
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono">
                    Score: {record.architectureConfig.architectureSecurityScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Zero Trust Architecture
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {record.architectureConfig.zeroTrustApplied ? "Enforced" : "Partial"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Secure Communication
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {record.architectureConfig.secureCommunication}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Encryption Standard
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {record.architectureConfig.encryptionStandard}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Key Management Service
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white font-mono">
                        {record.architectureConfig.keyManagement}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 4: IAM */}
            {(activeTab === "overview" || activeTab === "iam") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Key className="h-4 w-4 text-blue-600" />
                      4. Identity & Access Management (IAM)
                    </CardTitle>
                    <CardDescription>
                      OAuth 2.0 / OIDC authentication, RBAC policies, and secrets management
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono">
                    IAM Score: {record.iamConfig.iamReadinessScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Authentication Protocol
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.iamConfig.authenticationMethod}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        MFA Requirement
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {record.iamConfig.mfaEnabled ? "Mandatory for All" : "Optional"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Authorization Model
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.iamConfig.authorizationModel}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Secrets Vault
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {record.iamConfig.secretsManagement}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 5: SECURE DEVELOPMENT */}
            {(activeTab === "overview" || activeTab === "secure_development") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <FileCode className="h-4 w-4 text-blue-600" />
                      5. Secure Development & SAST/SCA Code Scanning
                    </CardTitle>
                    <CardDescription>
                      OWASP ASVS standards, static code analysis, dependency & secret scanning
                    </CardDescription>
                  </div>
                  <Badge className="bg-purple-600 text-white font-mono">
                    Dev Score: {record.secureDevConfig.secureDevelopmentScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Secure Coding Standard
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.secureDevConfig.secureCodingStandard}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        SAST Static Analysis
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {record.secureDevConfig.sastStatus}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        SCA Dependency Scan
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {record.secureDevConfig.scaStatus}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Vulnerabilities Found
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {record.secureDevConfig.vulnerabilitiesFoundCount} Low Severity
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 6: SECURITY TESTING */}
            {(activeTab === "overview" || activeTab === "security_testing") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Bug className="h-4 w-4 text-blue-600" />
                      6. Security Testing & Penetration Validation
                    </CardTitle>
                    <CardDescription>
                      DAST, API security testing, firmware security, and IoT penetration testing
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono">
                    Validation Score: {record.testingConfig.validationScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {[
                        { test: "DAST Dynamic Analysis", status: record.testingConfig.dastStatus },
                        { test: "Penetration Testing (External)", status: record.testingConfig.penetrationTesting },
                        { test: "API Security Testing (OWASP API 10)", status: record.testingConfig.apiSecurityTesting },
                        { test: "Firmware Security Testing", status: record.testingConfig.firmwareSecurityTesting },
                        { test: "IoT Security Testing", status: record.testingConfig.iotSecurityTesting },
                      ].map((item, i) => (
                        <div key={i} className="px-4 py-3 flex justify-between items-center">
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {item.test}
                          </span>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 7: SECURITY MONITORING */}
            {(activeTab === "overview" || activeTab === "monitoring") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      7. Security Monitoring & Incident Response (SIEM)
                    </CardTitle>
                    <CardDescription>
                      Microsoft Sentinel SIEM, threat intelligence feeds, and incident playbooks
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white font-mono">
                      Monitoring Score: {record.monitoringConfig.monitoringScore}/100
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsSiemConsoleOpen(true)}
                      className="gap-1 text-xs"
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      SIEM Console
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        SIEM Platform
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.monitoringConfig.siemPlatform}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Threat Intelligence
                      </span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">
                        {record.monitoringConfig.threatIntelligence}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Vulnerability Management
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {record.monitoringConfig.vulnerabilityManagement}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <span className="text-muted-foreground block text-[11px]">
                        Security Dashboard
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {record.monitoringConfig.securityDashboardStatus}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* TAB CONTENT 8: COMPLIANCE & GOVERNANCE */}
            {(activeTab === "overview" || activeTab === "compliance") && (
              <Card className="border-border/80 shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-blue-600" />
                      8. Compliance & Regulatory Governance
                    </CardTitle>
                    <CardDescription>
                      ISO 27001, NIST CSF, OWASP ASVS, and GDPR compliance dashboard
                    </CardDescription>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono">
                    Governance Score: {record.complianceConfig.governanceScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-6 text-xs">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 space-y-2">
                    <span className="font-semibold text-slate-900 dark:text-white block">
                      Applicable Security Standards & Regulations
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {record.complianceConfig.applicableStandards.map((std, i) => (
                        <Badge key={i} className="bg-blue-600 text-white text-xs px-3 py-1">
                          <Shield className="h-3.5 w-3.5 mr-1" />
                          {std}
                        </Badge>
                      ))}
                      <Badge className="bg-emerald-600 text-white text-xs px-3 py-1">
                        Privacy: {record.complianceConfig.privacyCompliance}
                      </Badge>
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
                      9. AI Security Assessment & Copilot Insights
                    </CardTitle>
                    <CardDescription>
                      AI vulnerability analysis, threat prediction, and security recommendations
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-600 text-white font-mono">
                    AI Security Score: {record.aiAssessment.aiOverallSecurityScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl border border-blue-200/80 dark:border-blue-900 bg-blue-50/40 dark:bg-blue-950/20 space-y-2">
                    <span className="font-bold text-blue-900 dark:text-blue-200 block">
                      Security Copilot Threat Prediction
                    </span>
                    <p className="text-blue-800 dark:text-blue-300">
                      {record.aiAssessment.aiRiskPrediction}. 12 security recommendations applied to pipeline.
                    </p>
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
                      10. Security Attachments & Penetration Reports
                    </CardTitle>
                    <CardDescription>
                      Threat models, vulnerability assessments, and risk reports
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
                    Multi-stage engineering approval committee
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
                            setReviewDecision(e.target.value as CybersecurityApprovalDecision)
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
                          placeholder="Add approval or vulnerability remarks..."
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
            <div className="sticky top-6 space-y-4">
              {/* Overall Score Radial Widget */}
              <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
                <CardHeader className="pb-2 text-center">
                  <CardTitle className="text-xs font-bold text-foreground uppercase tracking-wider">
                    Overall Cybersecurity Score
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <div className="flex justify-center items-center py-2">
                    <CircularScoreGauge score={record.overallCybersecurityScore} label="Overall Score" />
                  </div>

                  <div className="space-y-2 text-xs text-left pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Threat Readiness</span>
                      <span className="font-bold text-foreground font-mono">
                        {record.threatReadinessScore} /100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Architecture Security</span>
                      <span className="font-bold text-foreground font-mono">
                        {record.architectureSecurityScore} /100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Secure Development</span>
                      <span className="font-bold text-foreground font-mono">
                        {record.secureDevelopmentScore} /100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Compliance</span>
                      <span className="font-bold text-foreground font-mono">
                        {record.governanceScore} /100
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">Monitoring</span>
                      <span className="font-bold text-foreground font-mono">
                        {record.monitoringScore} /100
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t font-bold text-blue-600 dark:text-blue-400">
                      <span>Total Score</span>
                      <span>{record.overallCybersecurityScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. INTERACTIVE DIALOGS & MODALS
            ========================================================================= */}

        {/* Vulnerability Scan Modal */}
        <Dialog open={isVulnerabilityScanOpen} onOpenChange={setIsVulnerabilityScanOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-amber-500" />
                Live Qualys Vulnerability Scanner Console
              </DialogTitle>
              <DialogDescription>
                Scan APIs, containers, and cloud endpoints for CVEs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Scan Progress ({scanProgress}%)</span>
                  <span className="font-mono text-blue-600">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>

              <div className="h-40 rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-1">
                {scanLogs.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={handleStartVulnerabilityScan}
                disabled={isScanning}
                className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5"
              >
                <Play className="h-4 w-4" />
                {isScanning ? "Scanning..." : "Start Vulnerability Scan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SIEM Incident Console Modal */}
        <Dialog open={isSiemConsoleOpen} onOpenChange={setIsSiemConsoleOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                SIEM Real-Time Incident Stream
              </DialogTitle>
              <DialogDescription>
                Splunk / Microsoft Sentinel live event telemetry
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Active Alert Status
                </span>
                <span className="text-emerald-600 font-mono font-bold">
                  All 1,420 events Triaged • Zero Active Breaches
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsSiemConsoleOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Key Management Modal */}
        <Dialog open={isKeyManagementOpen} onOpenChange={setIsKeyManagementOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                Hardware Security Module (HSM) Key Vault
              </DialogTitle>
              <DialogDescription>
                ECC Secp256r1 & AES-256-GCM hardware key storage status
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs space-y-1">
              <div>[HSM] Device State: Secure Boot Locked</div>
              <div>[ROT] Root of Trust: ATECC608A Provisioned</div>
              <div>[TIME] Last Key Rotation: {record.keyVaultLastRotation}</div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  setIsKeyManagementOpen(false);
                  toast.success("Cryptographic keys rotated successfully in HSM!");
                }}
              >
                Rotate Keys Now
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
                {selectedAttachment?.type} File • {selectedAttachment?.size}
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
              <DialogTitle>Upload Security Document</DialogTitle>
              <DialogDescription>
                Upload STRIDE threat models, pen-test reports, or SBOM SPDX files
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

export default CybersecurityEngineeringNewPage;
