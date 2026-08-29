import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Cloud,
  Code,
  Lock,
  Database,
  FileText,
  CheckCircle2,
  Upload,
  Activity,
  Sparkles,
  BarChart2,
  Paperclip,
  UserCheck,
  History,
  Save,
  Send,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Printer,
  FileCode,
  Play,
  Calendar,
  Share2,
  Copy,
  ChevronRight,
  Workflow,
  Search,
  Zap,
  ShieldCheck,
  Target,
  Download,
  Eye,
  Plus,
  GripVertical,
  Move,
  Pin,
  PinOff,
  Minimize2,
  Maximize2,
} from "lucide-react";

import { apiDevelopmentService } from "@/services/apiDevelopmentService";
import type {
  ApiDevelopmentRecord,
  ApiDevelopmentFormInput,
  ApiDevelopmentApprovalDecision,
  ApiEndpoint,
  ApiAttachment,
} from "@/services/types";
import { AppShell } from "@/components/erp/AppShell";
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

export const Route = createFileRoute(
  "/development/research-innovation/api-development/new"
)({
  head: () => ({ meta: [{ title: "API Development Form · Magnertia ERP" }] }),
  component: ApiDevelopmentNewPage,
});

export function ApiDevelopmentFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ApiDevelopmentNewPage {...props} />;
}

export function ApiDevelopmentPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ApiDevelopmentNewPage {...props} />;
}

/* Helper component for SVG Circular Gauge with mild styling */
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
      {label && <span className="mt-2 text-xs font-bold text-slate-700 dark:text-slate-200">{label}</span>}
      {sublabel && <span className="text-[11px] text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

export function ApiDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();

  // Modals & Interactive States
  const [isPostmanModalOpen, setIsPostmanModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<ApiAttachment | null>(null);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>("ep-1");

  // Approval Form Local State
  const [reviewDecision, setReviewDecision] = useState<ApiDevelopmentApprovalDecision>("Approved with Conditions");
  const [reviewCommentInput, setReviewCommentInput] = useState("Overall API architecture looks solid. Please review rate limit policies.");

  // Data Fetching
  const { data: record, isLoading } = useQuery<ApiDevelopmentRecord>({
    queryKey: ["apiDevelopmentRecord"],
    queryFn: () => apiDevelopmentService.fetchRecord(),
  });

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ApiDevelopmentFormInput>) =>
      apiDevelopmentService.saveDraft(input, record?.id),
    onSuccess: (data) => {
      queryClient.setQueryData(["apiDevelopmentRecord"], data);
      toast.success("Draft saved successfully!", {
        description: `API Development record ${data.apiDevelopmentId} updated.`,
      });
    },
    onError: (err: Error) => {
      toast.error("Failed to save draft", { description: err.message });
    },
  });

  // Submit for Review Mutation
  const submitReviewMutation = useMutation({
    mutationFn: (id?: string) => apiDevelopmentService.submitForReview(id),
    onSuccess: (data) => {
      queryClient.setQueryData(["apiDevelopmentRecord"], data);
      toast.success("Submitted for Executive Review", {
        description: `API Development record ${data.apiDevelopmentId} is now under review.`,
      });
    },
  });

  // Approval Decision Mutation
  const reviewDecisionMutation = useMutation({
    mutationFn: (args: { id: string; decision: ApiDevelopmentApprovalDecision; comments?: string }) =>
      apiDevelopmentService.reviewDecision(args),
    onSuccess: (data) => {
      queryClient.setQueryData(["apiDevelopmentRecord"], data);
      toast.success(`Review Decision Recorded: ${data.workflowStatus}`, {
        description: `Approval decision set to ${data.approvalDecision}.`,
      });
    },
  });

  if (isLoading || !record) {
    return (
      <AppShell
        title="API Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <ResearchInnovationTabBar />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-muted-foreground">Loading API Development Module...</p>
        </div>
      </AppShell>
    );
  }

  const selectedEndpoint = record.endpoints.find((ep) => ep.id === selectedEndpointId) || record.endpoints[0];

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      apiName: record.apiName,
      businessObjective: record.businessObjective,
      functionalDescription: record.functionalDescription,
      apiCategory: record.apiCategory,
      deploymentEnvironment: record.deploymentEnvironment,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label}`, { description: text });
  };

  const renderSidebarWidgets = () => (
    <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800 text-center">
        <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
          Overall API Score
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 flex flex-col items-center">
        <CircularScoreGauge
          score={record.overallApiScore}
          size={110}
          strokeWidth={10}
          color="#2563eb"
        />

        {/* Overall API Score Breakdown with Accurate Percentages */}
        <div className="w-full mt-4 space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">API Design</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              90%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Security & Auth</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              90%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Testing & Validation</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              88%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Deployment & Gateway</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              88%
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-600 dark:text-slate-400">Operations & Telemetry</span>
            <span className="font-bold text-emerald-600 font-mono">
              89%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppShell
      title="API Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > API Development"}
      description="Design RESTful & GraphQL endpoints, OpenAPI specs, rate-limiting policies, and gateway routes."
      tabs={tabs ?? <ResearchInnovationTabBar />}
    >
      <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 antialiased pb-16">
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-3 space-y-4">
          {/* Top Header Card */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-4 sm:p-5 transition-all">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 dark:text-white flex items-center gap-2.5">
                    <Cloud className="h-6 w-6 text-blue-600 shrink-0" />
                    {record.apiProjectName}
                  </h1>
                  <Badge variant="outline" className="bg-blue-50/80 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 font-mono text-xs font-semibold px-2.5 py-0.5">
                    {record.apiVersion}
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
                  {record.businessObjective}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={saveDraftMutation.isPending}
                  className="h-8 px-3 text-xs gap-1.5 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium"
                >
                  <Save className="h-3.5 w-3.5 text-slate-500" />
                  Save Draft
                </Button>

                <Button
                  size="sm"
                  onClick={() => submitReviewMutation.mutate(record.id)}
                  disabled={submitReviewMutation.isPending}
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
                  <DropdownMenuContent align="end" className="w-52 text-xs">
                    <DropdownMenuItem onClick={() => setIsPostmanModalOpen(true)}>
                      <Play className="mr-2 h-3.5 w-3.5 text-blue-600" /> Test in Postman Console
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(JSON.stringify(record, null, 2), "OpenAPI JSON")}>
                      <FileCode className="mr-2 h-3.5 w-3.5 text-purple-600" /> Copy OpenAPI JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsUploadOpen(true)}>
                      <Upload className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Upload Attachment
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.print()}>
                      <Printer className="mr-2 h-3.5 w-3.5" /> Print Specification
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                    >
                      <Share2 className="mr-2 h-3.5 w-3.5" /> Share Specification
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Reference Badges Strip */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">API Development ID</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{record.apiDevelopmentId}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Form Code</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono">{record.formCode}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Linked Product</span>
                <span className="font-medium text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                  {record.linkedProductId} <ExternalLink className="h-3 w-3" />
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
                  {record.linkedCloudPlatformId} <ExternalLink className="h-3 w-3" />
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Linked Mobile App</span>
                <span className="font-medium text-blue-600 hover:underline flex items-center gap-1 cursor-pointer">
                  {record.linkedMobileAppDevId} <ExternalLink className="h-3 w-3" />
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">API Architect</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 truncate block">{record.apiArchitectName}</span>
              </div>
            </div>
          </div>

          {/* Main Content Layout: 9 Columns Dashboard + 3 Columns Sticky Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 9-Column Dashboard */}
            <div className="lg:col-span-9 space-y-6">
              {/* SECTION: API Overview & Problem Scope */}
              <Card id="section-overview" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                        API Project Overview & Consumer Scope
                      </CardTitle>
                    </div>
                    <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-semibold">
                      {record.apiCategory}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Business Objective
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                        {record.businessObjective}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                        Functional Description
                      </span>
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                        {record.functionalDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-blue-50/40 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">Consumer Applications:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {record.consumerApplications.map((app) => (
                          <Badge key={app} variant="outline" className="bg-white dark:bg-slate-800 border-blue-200 text-blue-700 dark:text-blue-300 text-[10px] font-medium">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                      Live Status: {record.deploymentEnvironment}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: API Design & Endpoint Specification */}
              <Card id="section-design" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                        API Design & Endpoint Specification
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs font-bold text-blue-700 bg-blue-50 border-blue-200">
                      Score: {record.designReadinessScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">API Style</span>
                      <span className="font-bold text-slate-800 dark:text-white">RESTful / JSON</span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Protocol</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">HTTPS / TLS 1.3</span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Endpoint Structure</span>
                      <span className="font-mono text-blue-600 font-bold">/api/v2/{`{resources}`}</span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Naming Convention</span>
                      <span className="font-semibold text-slate-800 dark:text-white">kebab-case</span>
                    </div>
                  </div>

                  {/* Mild Endpoint Preview Box */}
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 bg-slate-50/80 dark:bg-slate-800/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-600 text-white font-mono text-[10px] font-bold px-2 py-0.5">
                          GET
                        </Badge>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-100">
                          /api/v2/chargers
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground font-medium">Header: Authorization Bearer ******</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
                      <span className="text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                        Response (200 OK): {`{ "status": "success", "count": 142, "data": [...] }`}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard("/api/v2/chargers", "Endpoint Path")}
                        className="h-7 text-[11px] gap-1 shrink-0 bg-white dark:bg-slate-800 border-slate-200"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Path
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Authentication & Security Policies */}
              <Card id="section-security" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                        Authentication & Security Policies
                      </CardTitle>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      Security Score: {record.securityScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Auth Method</span>
                      <span className="font-bold text-slate-800 dark:text-white">{record.securityPolicy.authMethod}</span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Authorization Model</span>
                      <span className="font-bold text-blue-600">{record.securityPolicy.authorizationModel}</span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Token Expiry</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{record.securityPolicy.tokenExpiryMinutes} mins</span>
                    </div>
                    <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[11px]">Rate Limiting</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{record.securityPolicy.rateLimit}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/80 dark:bg-emerald-950/20 dark:border-emerald-900/50">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                        OAuth 2.0 + Role-Based Access Control (RBAC) Active
                      </span>
                      <span className="text-emerald-700/80 dark:text-emerald-400 text-[11px]">
                        JWT RFC 7519 validation enabled with Kong API Gateway token bucket throttling.
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Data Integration & Documentation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Integration */}
                <Card id="section-integration" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Database className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                          Data Integration
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs font-medium">
                        Score: {record.integrationConfig.integrationScore}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-muted-foreground">Primary Database:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{record.integrationConfig.primaryDataSource}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-muted-foreground">ERP Integration:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-muted-foreground">Cloud Platform Integration:</span>
                      <span className="font-bold text-blue-600 flex items-center gap-1">
                        <Cloud className="h-3.5 w-3.5" /> AWS / Azure Live
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* API Documentation */}
                <Card id="section-docs" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                          API Documentation
                        </CardTitle>
                      </div>
                      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                        OpenAPI 3.0
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs">
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-muted-foreground">OpenAPI Spec File:</span>
                      <span className="font-mono font-bold text-blue-600">{record.documentationInfo.openApiSpecName}</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-muted-foreground">Documented Error Codes:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{record.documentationInfo.errorCodesCount} Codes</span>
                    </div>
                    <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-muted-foreground">SDKs Generated:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{record.documentationInfo.sdkLanguages.join(", ")}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SECTION: Testing, Deployment & Monitoring */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Testing & Validation */}
                <Card id="section-testing" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-white">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Testing & Validation
                      </CardTitle>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {record.testSummary.testCoveragePercentage}% Coverage
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Unit Testing:</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">142 Passed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Security Testing:</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">0 Vulnerabilities</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Contract Testing:</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">All Passed</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Deployment & Versioning */}
                <Card id="section-deployment" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-white">
                        <Upload className="h-4 w-4 text-blue-600" /> Deployment & Versioning
                      </CardTitle>
                      <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                        Kong Gateway
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">CI/CD Pipeline:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{record.deploymentConfig.cicdPipeline}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Environment:</span>
                      <span className="font-bold text-emerald-700">{record.deploymentConfig.environment}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Strategy:</span>
                      <span className="font-semibold text-blue-600">{record.deploymentConfig.versionStrategy}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Monitoring & SLA */}
                <Card id="section-monitoring" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-white">
                        <Activity className="h-4 w-4 text-blue-600" /> Monitoring & SLA
                      </CardTitle>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        99.95% SLA
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Engine:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{record.monitoringSummary.apiMonitoringTool}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Analytics:</span>
                      <span className="font-semibold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Enabled
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Daily Traffic:</span>
                      <span className="font-bold text-blue-600">~24,500 req/day</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* SECTION: AI API Assessment & Readiness */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card id="section-assessment" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-white">
                        <Sparkles className="h-4 w-4 text-purple-600" /> AI API Assessment & Audit
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-bold text-purple-700 bg-purple-50 border-purple-200">
                        Score: {record.aiAssessment.aiOverallScore}/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">AI Design Review:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{record.aiAssessment.aiApiDesignScore}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">AI Security Review:</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{record.aiAssessment.aiSecurityReview}%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-2 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-white">
                        <Target className="h-4 w-4 text-blue-600" /> API Readiness Recommendation
                      </CardTitle>
                      <Badge variant="outline" className="text-[10px] font-bold bg-blue-50 text-blue-700 border-blue-200">
                        Readiness 89%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-1.5 text-xs">
                    <span className="text-muted-foreground block text-[11px]">Architect Recommendation:</span>
                    <span className="font-bold text-blue-700 dark:text-blue-300 block text-xs">
                      {record.readinessSummary.recommendation}
                    </span>
                  </CardContent>
                </Card>
              </div>

              {/* SECTION: Attachments */}
              <Card id="section-attachments" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                        Attachments & Specifications ({record.attachments.length})
                      </CardTitle>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsUploadOpen(true)}
                      className="gap-1 text-xs h-8 border-slate-200"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload File
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    {record.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <FileCode className="h-4 w-4 text-blue-600 shrink-0" />
                          <div className="truncate">
                            <span className="font-semibold text-slate-800 dark:text-white block truncate" title={att.name}>
                              {att.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{att.size}</span>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => toast.success(`Downloading ${att.name}`)}
                          >
                            <Download className="h-3.5 w-3.5 text-slate-500" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SECTION: Review & Approval Workflow */}
              <Card id="section-review" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                        Review & Approval Workflow
                      </CardTitle>
                    </div>
                    <Badge className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                      {record.workflowStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                    {record.reviewers.map((rev, i) => (
                      <div key={i} className="rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 text-center bg-slate-50/50 dark:bg-slate-800/40">
                        <span className="block font-bold text-[11px] truncate text-slate-800 dark:text-white">{rev.person}</span>
                        <span className="block text-[10px] text-muted-foreground truncate">{rev.role}</span>
                        <Badge
                          className={`mt-1.5 text-[9px] px-1.5 py-0 font-semibold ${
                            rev.decision === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : rev.decision === "Approved with Conditions"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {rev.decision}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Submit Decision Form */}
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                    <h4 className="font-bold text-slate-800 dark:text-white">Submit Review Decision</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Approval Decision <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={reviewDecision}
                          onChange={(e) => setReviewDecision(e.target.value as ApiDevelopmentApprovalDecision)}
                          className="w-full h-8 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          <option value="Approved">Approved (Production Ready)</option>
                          <option value="Approved with Conditions">Approved with Conditions</option>
                          <option value="Changes Requested">Changes Requested</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Review Comments
                        </label>
                        <Input
                          value={reviewCommentInput}
                          onChange={(e) => setReviewCommentInput(e.target.value)}
                          placeholder="Add approval or modification remarks..."
                          className="h-8 text-xs bg-white dark:bg-slate-900 border-slate-200"
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
              <Card id="section-system" className="border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base font-bold text-slate-800 dark:text-white">
                        System Information & Audit Trail
                      </CardTitle>
                    </div>
                    <Badge variant="outline" className="text-xs font-mono">
                      {record.apiVersion}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Created By</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{record.apiArchitectName}</span>
                      <span className="block text-[10px] text-muted-foreground">{record.createdOn}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Last Modified By</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{record.apiArchitectName}</span>
                      <span className="block text-[10px] text-muted-foreground">{record.lastUpdated}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Workflow Stage</span>
                      <span className="font-semibold text-blue-600">{record.workflowStatus}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Audit Links</span>
                      <div className="flex gap-2 mt-0.5 text-blue-600 font-medium cursor-pointer">
                        <span className="hover:underline">View Log →</span>
                        <span className="hover:underline">View History →</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sticky Sidebar Panel (3 columns) with clean score gauge */}
            <div className="lg:col-span-3">
              <div className="sticky top-6 space-y-4">
                {renderSidebarWidgets()}
              </div>
            </div>
          </div>
        </div>

        {/* Postman Test Dialog */}
        <Dialog open={isPostmanModalOpen} onOpenChange={setIsPostmanModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Play className="h-5 w-5 text-blue-600" />
                Postman API Tester Console
              </DialogTitle>
              <DialogDescription className="text-xs">
                Simulate mock HTTP request to live Kong Gateway route
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <Badge className="bg-emerald-600 text-white font-bold text-xs">GET</Badge>
                <Input value="https://api.magnertia.com/v2/chargers" readOnly className="font-mono text-xs h-8 bg-slate-50" />
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 font-mono text-[11px] text-slate-800 space-y-1">
                <div className="text-emerald-700 font-bold">Status: 200 OK • Latency: 24ms</div>
                <div className="text-slate-600">{`{ "status": "success", "count": 142, "region": "Global" }`}</div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsPostmanModalOpen(false)} className="h-8 text-xs font-bold bg-blue-600 text-white">
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
              <DialogTitle className="flex items-center gap-2 text-base font-bold">
                <Eye className="h-5 w-5 text-blue-600" />
                {selectedAttachment?.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {selectedAttachment?.type} Document • {selectedAttachment?.size}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 font-mono text-xs h-40 flex items-center justify-center">
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
              <DialogTitle className="text-base font-bold">Upload API Specification / Schema</DialogTitle>
              <DialogDescription className="text-xs">
                Upload .yaml, .json, .pdf, or postman collection file
              </DialogDescription>
            </DialogHeader>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-8 text-center space-y-2 bg-slate-50/50">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Drag and drop files here or click to browse
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Supports .yaml, .json, .pdf up to 50 MB
              </span>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  setIsUploadOpen(false);
                  toast.success("File uploaded successfully!");
                }}
                className="h-8 text-xs font-bold bg-blue-600 text-white"
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

export default ApiDevelopmentNewPage;
