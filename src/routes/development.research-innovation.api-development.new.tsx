import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, type ReactNode } from "react";
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
  Share2,
  Copy,
  Workflow,
  Zap,
  ShieldCheck,
  Target,
  Download,
  Eye,
  Plus,
  Trash2,
  Edit3,
  Server,
  Terminal,
} from "lucide-react";

import { apiDevelopmentService } from "@/services/apiDevelopmentService";
import type {
  ApiDevelopmentRecord,
  ApiDevelopmentFormInput,
  ApiDevelopmentApprovalDecision,
  ApiEndpoint,
  ApiAttachment,
  ApiAuditLogEntry,
} from "@/services/types";
import { AppShell } from "@/components/erp/AppShell";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
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

export const Route = createFileRoute(
  "/development/research-innovation/api-development/new"
)({
  head: () => ({ meta: [{ title: "EV Charging APIs · Magnertia ERP" }] }),
  component: ApiDevelopmentNewPage,
});

export function ApiDevelopmentFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ApiDevelopmentNewPage {...props} />;
}

export function ApiDevelopmentPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ApiDevelopmentNewPage {...props} />;
}

/* Helper component for SVG Circular Gauge */
function CircularScoreGauge({
  score,
  size = 100,
  strokeWidth = 8,
  color = "#2563eb",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
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
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span className="text-2xl font-black tracking-tight text-blue-600 dark:text-blue-400 flex items-baseline justify-center">
            {normalizedScore}
            <span className="text-xs font-bold ml-0.5">%</span>
          </span>
          <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-wider">
            Readiness
          </span>
        </div>
      </div>
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
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<ApiAttachment | null>(null);
  const [selectedLinkedItem, setSelectedLinkedItem] = useState<{ title: string; id: string; type: string; details: string } | null>(null);

  // Automated Testing State
  const [isRunningTestSuite, setIsRunningTestSuite] = useState(false);
  const [testSuiteProgress, setTestSuiteProgress] = useState(0);

  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);

  // Approval Form Local State
  const [reviewDecision, setReviewDecision] = useState<ApiDevelopmentApprovalDecision>("Approved with Conditions");
  const [reviewCommentInput, setReviewCommentInput] = useState("Overall API architecture looks solid. Please review rate limit policies.");

  // Postman Interactive State
  const [postmanMethod, setPostmanMethod] = useState<string>("GET");
  const [postmanUrl, setPostmanUrl] = useState<string>("https://api.magnertia.com/v2/chargers");
  const [postmanResponse, setPostmanResponse] = useState<string | null>(null);
  const [postmanLoading, setPostmanLoading] = useState(false);
  const [postmanLatency, setPostmanLatency] = useState<number>(24);

  // Upload Form State
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState("YAML");

  // Data Fetching
  const { data: record, isLoading } = useQuery<ApiDevelopmentRecord>({
    queryKey: ["apiDevelopmentRecord"],
    queryFn: () => apiDevelopmentService.fetchRecord(),
  });

  // Local Editable Record State
  const [localRecord, setLocalRecord] = useState<ApiDevelopmentRecord | null>(null);

  React.useEffect(() => {
    if (record && !localRecord) {
      setLocalRecord(record);
    }
  }, [record]);

  const current = localRecord || record;

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ApiDevelopmentFormInput>) =>
      apiDevelopmentService.saveDraft(input, current?.id),
    onSuccess: (data) => {
      setLocalRecord(data);
      queryClient.setQueryData(["apiDevelopmentRecord"], data);
      toast.success("Draft Saved Successfully", {
        description: `API Development record ${data.apiDevelopmentId} has been saved.`,
      });
      setIsEditMode(false);
    },
    onError: (err: Error) => {
      toast.error("Failed to save draft", { description: err.message });
    },
  });

  // Submit for Review Mutation
  const submitReviewMutation = useMutation({
    mutationFn: (id?: string) => apiDevelopmentService.submitForReview(id),
    onSuccess: (data) => {
      if (localRecord) {
        setLocalRecord({
          ...localRecord,
          workflowStatus: "In Review",
          lastUpdated: "Just now",
        });
      }
      queryClient.setQueryData(["apiDevelopmentRecord"], data);
      toast.success("Submitted for Architecture Review", {
        description: `API Development record ${data.apiDevelopmentId} is now under review.`,
      });
    },
  });

  // Review Decision Mutation
  const reviewDecisionMutation = useMutation({
    mutationFn: (args: { id: string; decision: ApiDevelopmentApprovalDecision; comments?: string }) =>
      apiDevelopmentService.reviewDecision(args),
    onSuccess: (data) => {
      if (localRecord) {
        const updatedReviewers = localRecord.reviewers.map((r) =>
          r.role === "CTO" || r.person === "Dr. Anil Patel"
            ? { ...r, decision: reviewDecision, comments: reviewCommentInput, date: "Today" }
            : r
        );
        const newStatus = reviewDecision === "Approved" ? "Approved" : "In Review";
        const newAudit: ApiAuditLogEntry = {
          id: `aud-${Date.now()}`,
          timestamp: "Just now",
          user: "Dr. Anil Patel",
          action: `Decision: ${reviewDecision}`,
          details: reviewCommentInput,
          stage: newStatus,
        };

        setLocalRecord({
          ...localRecord,
          workflowStatus: newStatus,
          approvalDecision: reviewDecision,
          reviewComments: reviewCommentInput,
          reviewers: updatedReviewers,
          auditTrail: [newAudit, ...(localRecord.auditTrail || [])],
        });
      }
      queryClient.setQueryData(["apiDevelopmentRecord"], data);
      toast.success(`Review Decision Recorded: ${reviewDecision}`, {
        description: "Review workflow and approval audit trail have been updated.",
      });
    },
  });

  if (isLoading || !current) {
    return (
      <AppShell
        title="API Development"
        breadcrumb={breadcrumb ?? "Research & Innovation Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-muted-foreground">Loading API Development Module...</p>
        </div>
      </AppShell>
    );
  }


  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      apiProjectName: current.apiProjectName,
      businessObjective: current.businessObjective,
      functionalDescription: current.functionalDescription,
      apiCategory: current.apiCategory,
      deploymentEnvironment: current.deploymentEnvironment,
    });
  };

  const handleExportSpecification = () => {
    const content = `=====================================================
API DEVELOPMENT SPECIFICATION: ${current.apiProjectName}
=====================================================
API Development ID: ${current.apiDevelopmentId}
Form Code: ${current.formCode}
Version: ${current.apiVersion}
Workflow Status: ${current.workflowStatus}
Linked Product: ${current.linkedProductId}
Linked Software: ${current.linkedSoftwareDevId}
Linked Cloud Platform: ${current.linkedCloudPlatformId}
Linked Mobile App: ${current.linkedMobileAppDevId}
API Architect: ${current.apiArchitectName}
Business Unit: ${current.businessUnit}

BUSINESS OBJECTIVE:
-----------------------------------------------------
${current.businessObjective}

FUNCTIONAL DESCRIPTION:
-----------------------------------------------------
${current.functionalDescription}

CONSUMER APPLICATIONS:
-----------------------------------------------------
${current.consumerApplications.join(", ")}

ENDPOINTS & ROUTES:
-----------------------------------------------------
${current.endpoints.map((ep) => `[${ep.method}] ${ep.path} - ${ep.name}\nDescription: ${ep.description}`).join("\n\n")}

SECURITY & AUTHENTICATION:
-----------------------------------------------------
Auth Method: ${current.securityPolicy.authMethod}
Authorization Model: ${current.securityPolicy.authorizationModel}
Token Expiry: ${current.securityPolicy.tokenExpiryMinutes} mins
Rate Limiting: ${current.securityPolicy.rateLimit}
Security Score: ${current.securityScore}/100

DATA INTEGRATION & DOCUMENTATION:
-----------------------------------------------------
Primary Database: ${current.integrationConfig.primaryDataSource}
ERP Integration: ${current.integrationConfig.erpIntegration ? "Connected" : "Pending"}
OpenAPI Spec: ${current.documentationInfo.openApiSpecName}
Documented Errors: ${current.documentationInfo.errorCodesCount} Codes
SDKs: ${current.documentationInfo.sdkLanguages.join(", ")}

TESTING & SLA:
-----------------------------------------------------
Test Coverage: ${current.testSummary.testCoveragePercentage}%
Gateway: ${current.deploymentConfig.apiGateway}
CI/CD Pipeline: ${current.deploymentConfig.cicdPipeline}
Environment: ${current.deploymentConfig.environment}
SLA: ${current.monitoringSummary.slaPercentage}% (${current.monitoringSummary.dailyTrafficVolume})

REVIEW & APPROVAL BOARD:
-----------------------------------------------------
${current.reviewers.map((r) => `${r.role}: ${r.person} - ${r.decision} (${r.date || "-"})`).join("\n")}
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${current.apiDevelopmentId}_API_Specification.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("API Specification report downloaded successfully!");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`);
  };


  // Run Postman test simulation
  const handleSendPostman = () => {
    setPostmanLoading(true);
    setTimeout(() => {
      setPostmanLoading(false);
      setPostmanLatency(Math.floor(Math.random() * 25) + 15);
      setPostmanResponse(
        JSON.stringify(
          {
            status: "success",
            timestamp: new Date().toISOString(),
            route: postmanUrl,
            method: postmanMethod,
            data: [
              { id: "CH-612345", name: "EV Fast Charger 01", status: "available", powerKw: 150, connectorType: "CCS2", voltage: 400 },
              { id: "CH-612346", name: "EV Fast Charger 02", status: "occupied", powerKw: 60, connectorType: "Type2", voltage: 230 },
              { id: "CH-612347", name: "EV Ultra Charger 03", status: "available", powerKw: 350, connectorType: "CCS2", voltage: 800 },
            ],
          },
          null,
          2
        )
      );
      toast.success("Postman Mock Response Received", { description: `Status: 200 OK • Latency: ${postmanLatency}ms` });
    }, 450);
  };

  // Run Automated Test Suite
  const handleRunTestSuite = () => {
    setIsRunningTestSuite(true);
    setTestSuiteProgress(20);
    setTimeout(() => setTestSuiteProgress(50), 250);
    setTimeout(() => setTestSuiteProgress(85), 500);
    setTimeout(() => {
      setTestSuiteProgress(100);
      setIsRunningTestSuite(false);
      toast.success("Automated Test Suite Completed!", {
        description: "142/142 Unit tests passed • 0 Security Vulnerabilities • 100% Contract validation.",
      });
    }, 750);
  };

  // Download Attachment Helper
  const handleDownloadAttachment = (att: ApiAttachment) => {
    let mockContent = "";
    if (att.name.endsWith(".yaml") || att.type === "YAML") {
      mockContent = `openapi: 3.0.3\ninfo:\n  title: EV Charging APIs\n  version: 2.1.0\npaths:\n  /api/v2/chargers:\n    get:\n      summary: List Charging Stations\n      responses:\n        '200':\n          description: Success`;
    } else if (att.name.endsWith(".json") || att.type === "JSON") {
      mockContent = JSON.stringify(
        {
          info: { name: "EV Charging APIs Collection", schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json" },
          item: current.endpoints.map((ep) => ({ name: ep.name, request: { method: ep.method, url: ep.path } })),
        },
        null,
        2
      );
    } else {
      mockContent = `Specification Document: ${att.name}\nGenerated by Magnertia ERP API Hub\nStatus: Verified Controlled Document`;
    }

    const blob = new Blob([mockContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = att.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${att.name}`);
  };


  // Handle Upload Modal submission
  const handleUploadSubmit = () => {
    if (!uploadFileName.trim()) {
      toast.error("Please enter a file name");
      return;
    }
    const newAtt: ApiAttachment = {
      id: `att-${Date.now()}`,
      name: uploadFileName.endsWith(`.${uploadFileType.toLowerCase()}`)
        ? uploadFileName
        : `${uploadFileName}.${uploadFileType.toLowerCase()}`,
      size: "45.2 KB",
      type: uploadFileType,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      uploadedBy: current.apiArchitectName,
      url: "#",
    };
    if (localRecord) {
      setLocalRecord({
        ...localRecord,
        attachments: [...localRecord.attachments, newAtt],
      });
    }
    setUploadFileName("");
    setIsUploadOpen(false);
    toast.success(`Uploaded ${newAtt.name} successfully!`);
  };

  // Handle Delete Attachment
  const handleDeleteAttachment = (id: string, name: string) => {
    if (localRecord) {
      setLocalRecord({
        ...localRecord,
        attachments: localRecord.attachments.filter((a) => a.id !== id),
      });
      toast.info(`Removed ${name}`);
    }
  };

  return (
    <AppShell
      title="API Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > API Development"}
      description="Design RESTful endpoints, OpenAPI specs, OAuth 2.0 / RBAC security, and Kong Gateway live routes."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* Top Header Card */}
        <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                    <Cloud className="h-6 w-6 text-primary shrink-0" />
                    {current.apiProjectName}
                  </h1>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono text-xs font-semibold px-2 py-0.5">
                    {current.apiVersion}
                  </Badge>
                  <Badge className="bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-xs">
                    <Workflow className="mr-1 h-3 w-3 inline" />
                    {current.workflowStatus}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground max-w-3xl">
                  {current.businessObjective}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMode(!isEditMode)}
                  className={`h-8 px-3 text-xs gap-1.5 font-medium cursor-pointer ${
                    isEditMode ? "bg-blue-50 text-blue-700 border-blue-300" : ""
                  }`}
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  {isEditMode ? "Exit Edit Mode" : "Edit Specification"}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={saveDraftMutation.isPending}
                  className="h-8 px-3 text-xs gap-1.5 font-medium cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
                </Button>

                <Button
                  size="sm"
                  onClick={() => submitReviewMutation.mutate(current.id)}
                  disabled={submitReviewMutation.isPending}
                  className="h-8 px-4 text-xs font-bold gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xs cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit for Review
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportSpecification}
                  className="h-8 px-3 text-xs gap-1.5 font-medium cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 text-xs">
                    <DropdownMenuItem onClick={() => setIsPostmanModalOpen(true)} className="cursor-pointer">
                      <Terminal className="mr-2 h-3.5 w-3.5 text-blue-600" /> Test in Postman Console
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        copyToClipboard(
                          JSON.stringify(
                            {
                              openapi: "3.0.3",
                              info: { title: current.apiProjectName, version: current.apiVersion },
                              paths: Object.fromEntries(
                                current.endpoints.map((ep) => [
                                  ep.path,
                                  {
                                    [ep.method.toLowerCase()]: {
                                      summary: ep.name,
                                      description: ep.description,
                                      responses: { "200": { description: "OK" } },
                                    },
                                  },
                                ])
                              ),
                            },
                            null,
                            2
                          ),
                          "OpenAPI Spec"
                        )
                      }
                      className="cursor-pointer"
                    >
                      <FileCode className="mr-2 h-3.5 w-3.5 text-purple-600" /> Copy OpenAPI Spec JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsUploadOpen(true)} className="cursor-pointer">
                      <Upload className="mr-2 h-3.5 w-3.5 text-emerald-600" /> Upload Attachment
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsAuditModalOpen(true)} className="cursor-pointer">
                      <History className="mr-2 h-3.5 w-3.5 text-amber-600" /> View Audit Trail & History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => window.print()} className="cursor-pointer">
                      <Printer className="mr-2 h-3.5 w-3.5" /> Print Specification
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }}
                      className="cursor-pointer"
                    >
                      <Share2 className="mr-2 h-3.5 w-3.5" /> Share Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Reference Badges Strip */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 pt-3 border-t border-border/60 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">API Development ID</span>
                <span className="font-semibold text-foreground font-mono">
                  {current.apiDevelopmentId}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Form Code</span>
                <span className="font-semibold text-foreground font-mono">
                  {current.formCode}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Linked Product</span>
                <button
                  onClick={() =>
                    setSelectedLinkedItem({
                      title: "Smart EV Platform",
                      id: "PROD-2024-EV01",
                      type: "Core Hardware & OS Platform",
                      details: "Next-gen modular powertrain & fast-charging ecosystem platform.",
                    })
                  }
                  className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer text-left"
                >
                  {current.linkedProductId} <ExternalLink className="h-3 w-3" />
                </button>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Linked Software Dev</span>
                <button
                  onClick={() =>
                    setSelectedLinkedItem({
                      title: "Charging Management System",
                      id: current.linkedSoftwareDevId,
                      type: "Software Module",
                      details: "Microservices gateway handling real-time telemetry and charge session state machines.",
                    })
                  }
                  className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer text-left"
                >
                  {current.linkedSoftwareDevId} <ExternalLink className="h-3 w-3" />
                </button>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Linked Cloud Platform</span>
                <button
                  onClick={() =>
                    setSelectedLinkedItem({
                      title: "Cloud Infrastructure (AWS/Azure)",
                      id: current.linkedCloudPlatformId,
                      type: "Cloud Infrastructure",
                      details: "Multi-region Kubernetes deployment running behind Kong Enterprise API Gateway.",
                    })
                  }
                  className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer text-left"
                >
                  {current.linkedCloudPlatformId} <ExternalLink className="h-3 w-3" />
                </button>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Linked Mobile App</span>
                <button
                  onClick={() =>
                    setSelectedLinkedItem({
                      title: "EV Driver Companion App",
                      id: current.linkedMobileAppDevId,
                      type: "Mobile App (iOS & Android)",
                      details: "Flutter-based mobile companion app for EV charging location, payment, and notifications.",
                    })
                  }
                  className="font-medium text-primary hover:underline flex items-center gap-1 cursor-pointer text-left"
                >
                  {current.linkedMobileAppDevId} <ExternalLink className="h-3 w-3" />
                </button>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">API Architect</span>
                <span className="font-semibold text-foreground truncate block">
                  {current.apiArchitectName}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 1: Overview & Scope */}
        <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">
                  API Project Overview & Consumer Scope
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs font-semibold">
                {current.apiCategory}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            {isEditMode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold block text-[11px]">Business Objective</label>
                  <Textarea
                    value={current.businessObjective}
                    onChange={(e) => {
                      if (localRecord) setLocalRecord({ ...localRecord, businessObjective: e.target.value });
                    }}
                    className="text-xs min-h-[75px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold block text-[11px]">Functional Description</label>
                  <Textarea
                    value={current.functionalDescription}
                    onChange={(e) => {
                      if (localRecord) setLocalRecord({ ...localRecord, functionalDescription: e.target.value });
                    }}
                    className="text-xs min-h-[75px]"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-bold text-foreground block text-[11px]">Business Objective</span>
                  <p className="text-muted-foreground leading-relaxed">
                    {current.businessObjective}
                  </p>
                </div>
                <div className="p-3.5 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-bold text-foreground block text-[11px]">Functional Description</span>
                  <p className="text-muted-foreground leading-relaxed">
                    {current.functionalDescription}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-primary/5 border border-primary/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-foreground">Consumer Applications:</span>
                <div className="flex flex-wrap gap-1.5">
                  {current.consumerApplications.map((app) => (
                    <Badge
                      key={app}
                      variant="outline"
                      className="bg-white dark:bg-slate-800 border-primary/30 text-primary text-[10px] font-medium"
                    >
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px]">
                Live Status: {current.deploymentEnvironment}
              </Badge>
            </div>
          </CardContent>
        </Card>


        {/* Section 3: Authentication & Security Policies */}
        <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">
                  Authentication & Security Policies
                </CardTitle>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                Security Score: {current.securityScore}/100
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-muted-foreground block text-[11px]">Auth Method</span>
                <span className="font-bold text-foreground">{current.securityPolicy.authMethod}</span>
              </div>
              <div className="p-3 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-muted-foreground block text-[11px]">Authorization Model</span>
                <span className="font-bold text-primary">{current.securityPolicy.authorizationModel}</span>
              </div>
              <div className="p-3 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-muted-foreground block text-[11px]">Token Expiry</span>
                <span className="font-semibold text-foreground">{current.securityPolicy.tokenExpiryMinutes} mins</span>
              </div>
              <div className="p-3 rounded-lg border border-border/70 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-muted-foreground block text-[11px]">Rate Limiting</span>
                <span className="font-bold text-emerald-600">{current.securityPolicy.rateLimit}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-200/80 dark:bg-emerald-950/20 dark:border-emerald-900/50">
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

        {/* Section 4: Data Integration & API Documentation (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Data Integration */}
          <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-bold">Data Integration</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs font-semibold">
                  Score: {current.integrationConfig.integrationScore}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-border/70">
                <span className="text-muted-foreground">Primary Database:</span>
                <span className="font-bold text-foreground">{current.integrationConfig.primaryDataSource}</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-border/70">
                <span className="text-muted-foreground">ERP Integration:</span>
                <span className="font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-border/70">
                <span className="text-muted-foreground">Cloud Platform Integration:</span>
                <span className="font-bold text-primary flex items-center gap-1">
                  <Cloud className="h-3.5 w-3.5" /> AWS / Azure Live
                </span>
              </div>
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base font-bold">API Documentation</CardTitle>
                </div>
                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                  OpenAPI 3.0
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-border/70">
                <span className="text-muted-foreground">OpenAPI Spec File:</span>
                <button
                  onClick={() =>
                    setSelectedAttachment({
                      id: "att-spec",
                      name: current.documentationInfo.openApiSpecName,
                      size: "38.5 KB",
                      type: "YAML",
                      date: "19 Jun 2024",
                      uploadedBy: current.apiArchitectName,
                      url: "#",
                    })
                  }
                  className="font-mono font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {current.documentationInfo.openApiSpecName} <Eye className="h-3 w-3" />
                </button>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-border/70">
                <span className="text-muted-foreground">Documented Error Codes:</span>
                <span className="font-bold text-foreground">{current.documentationInfo.errorCodesCount} Codes</span>
              </div>
              <div className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50/50 dark:bg-slate-800/40 border border-border/70">
                <span className="text-muted-foreground">SDKs Generated:</span>
                <span className="font-semibold text-foreground">{current.documentationInfo.sdkLanguages.join(", ")}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 5: Testing, Deployment & Monitoring (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Testing & Validation */}
          <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
            <CardHeader className="pb-2 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Testing & Validation
                </CardTitle>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  {current.testSummary.testCoveragePercentage}% Coverage
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Unit Testing:</span>
                <span className="font-semibold text-emerald-600">142 Passed</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Security Testing:</span>
                <span className="font-semibold text-emerald-600">0 Vulnerabilities</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Contract Testing:</span>
                <span className="font-semibold text-emerald-600">All Passed</span>
              </div>
              <div className="pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRunTestSuite}
                  disabled={isRunningTestSuite}
                  className="w-full h-7 text-[11px] gap-1 font-semibold cursor-pointer"
                >
                  <Play className={`h-3 w-3 text-emerald-600 ${isRunningTestSuite ? "animate-spin" : ""}`} />
                  {isRunningTestSuite ? `Testing (${testSuiteProgress}%)` : "Run Test Suite"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Deployment & Versioning */}
          <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
            <CardHeader className="pb-2 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                  <Upload className="h-4 w-4 text-primary" /> Deployment & Versioning
                </CardTitle>
                <Badge variant="secondary" className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 font-semibold">
                  Kong Gateway
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">CI/CD Pipeline:</span>
                <span className="font-bold text-foreground">{current.deploymentConfig.cicdPipeline}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Environment:</span>
                <span className="font-bold text-emerald-600">{current.deploymentConfig.environment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Strategy:</span>
                <span className="font-semibold text-primary">{current.deploymentConfig.versionStrategy}</span>
              </div>
            </CardContent>
          </Card>

          {/* Monitoring & SLA */}
          <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
            <CardHeader className="pb-2 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" /> Monitoring & SLA
                </CardTitle>
                <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  99.95% SLA
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Engine:</span>
                <span className="font-bold text-foreground">{current.monitoringSummary.apiMonitoringTool}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Analytics:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Enabled
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Daily Traffic:</span>
                <span className="font-bold text-primary">~24,500 req/day</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Section 6: AI Assessment & Readiness Summary (2 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
            <CardHeader className="pb-2 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-purple-600" /> AI API Assessment & Audit
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-bold text-purple-700 bg-purple-50 border-purple-200">
                  Score: {current.aiAssessment.aiOverallScore}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AI Design Review:</span>
                <span className="font-bold text-foreground">{current.aiAssessment.aiApiDesignScore}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">AI Security Review:</span>
                <span className="font-bold text-emerald-600">{current.aiAssessment.aiSecurityReview}%</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
            <CardHeader className="pb-2 border-b border-border/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-primary" /> API Readiness Recommendation
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-bold bg-primary/5 text-primary border-primary/20">
                  Readiness 89%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-1.5 text-xs">
              <span className="text-muted-foreground block text-[11px]">Architect Recommendation:</span>
              <span className="font-bold text-primary block text-xs">
                {current.readinessSummary.recommendation}
              </span>
            </CardContent>
          </Card>
        </div>

        {/* Section 7: Attachments & Specifications (5 Items) */}
        <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paperclip className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">
                  Attachments & Specifications ({current.attachments.length})
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsUploadOpen(true)}
                className="gap-1 text-xs h-8 cursor-pointer"
              >
                <Upload className="h-3.5 w-3.5" />
                Upload File
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {current.attachments.map((att) => (
                <div
                  key={att.id}
                  className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileCode className="h-4 w-4 text-primary shrink-0" />
                    <div className="truncate">
                      <span className="font-semibold text-foreground block truncate" title={att.name}>
                        {att.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{att.size}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Preview Attachment"
                      className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
                      onClick={() => setSelectedAttachment(att)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download Attachment"
                      className="h-7 w-7 text-muted-foreground hover:text-emerald-600 cursor-pointer"
                      onClick={() => handleDownloadAttachment(att)}
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Remove Attachment"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive cursor-pointer"
                      onClick={() => handleDeleteAttachment(att.id, att.name)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Review & Approval Workflow */}
        <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">
                  Review & Approval Workflow
                </CardTitle>
              </div>
              <Badge className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold">
                {current.workflowStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-4 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
              {current.reviewers.map((rev, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border/80 p-2.5 text-center bg-slate-50/50 dark:bg-slate-800/40 hover:border-primary/40 transition-all cursor-pointer"
                  onClick={() =>
                    toast.info(`${rev.person} (${rev.role})`, {
                      description: rev.comments ? `Comment: "${rev.comments}"` : `Status: ${rev.decision}`,
                    })
                  }
                >
                  <span className="block font-bold text-[11px] truncate text-foreground">
                    {rev.person}
                  </span>
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
            <div className="p-4 rounded-xl border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
              <h4 className="font-bold text-foreground">Submit Review Decision</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Approval Decision <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={reviewDecision}
                    onChange={(e) => setReviewDecision(e.target.value as ApiDevelopmentApprovalDecision)}
                    className="w-full h-8 rounded-md border border-border bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <option value="Approved">Approved (Production Ready)</option>
                    <option value="Approved with Conditions">Approved with Conditions</option>
                    <option value="Changes Requested">Changes Requested</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground block mb-1">
                    Review Comments
                  </label>
                  <Input
                    value={reviewCommentInput}
                    onChange={(e) => setReviewCommentInput(e.target.value)}
                    placeholder="Add approval or modification remarks..."
                    className="h-8 text-xs bg-background border-border"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() =>
                    reviewDecisionMutation.mutate({
                      id: current.id,
                      decision: reviewDecision,
                      comments: reviewCommentInput,
                    })
                  }
                  disabled={reviewDecisionMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 h-8 font-bold text-xs cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {reviewDecisionMutation.isPending ? "Saving Decision..." : "Save Decision"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 9: System Information */}
        <Card className="border-border/80 bg-white dark:bg-slate-900 rounded-xl shadow-xs">
          <CardHeader className="pb-3 border-b border-border/60">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-primary" />
                <CardTitle className="text-base font-bold">
                  System Information & Audit Trail
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-mono">
                {current.apiVersion}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Created By</span>
                <span className="font-bold text-foreground">{current.apiArchitectName}</span>
                <span className="block text-[10px] text-muted-foreground">{current.createdOn}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Last Modified By</span>
                <span className="font-bold text-foreground">{current.apiArchitectName}</span>
                <span className="block text-[10px] text-muted-foreground">{current.lastUpdated}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Workflow Stage</span>
                <span className="font-semibold text-primary">{current.workflowStatus}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Audit Links</span>
                <div className="flex gap-2 mt-0.5 text-primary font-medium">
                  <button onClick={() => setIsAuditModalOpen(true)} className="hover:underline cursor-pointer">
                    View Log →
                  </button>
                  <button onClick={() => setIsAuditModalOpen(true)} className="hover:underline cursor-pointer">
                    View History →
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Postman Test Dialog */}
      <Dialog open={isPostmanModalOpen} onOpenChange={setIsPostmanModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Terminal className="h-5 w-5 text-primary" />
              Postman API Tester Console
            </DialogTitle>
            <DialogDescription className="text-xs">
              Simulate mock HTTP request to live Kong Gateway route
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <select
                value={postmanMethod}
                onChange={(e) => setPostmanMethod(e.target.value)}
                className="h-8 rounded-md border border-border bg-background px-2.5 text-xs font-bold text-primary"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
              <Input
                value={postmanUrl}
                onChange={(e) => setPostmanUrl(e.target.value)}
                className="font-mono text-xs h-8 bg-background flex-1"
              />
              <Button
                size="sm"
                onClick={handleSendPostman}
                disabled={postmanLoading}
                className="h-8 text-xs font-bold bg-primary text-primary-foreground gap-1 cursor-pointer"
              >
                <Play className={`h-3 w-3 ${postmanLoading ? "animate-spin" : ""}`} />
                {postmanLoading ? "Sending..." : "Send"}
              </Button>
            </div>

            {postmanResponse ? (
              <div className="p-3 rounded-lg border border-border bg-slate-950 font-mono text-[11px] text-slate-100 space-y-2">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5 text-[10px]">
                  <span className="text-emerald-400 font-bold">Status: 200 OK • Latency: {postmanLatency}ms</span>
                  <button
                    onClick={() => copyToClipboard(postmanResponse, "Postman Response")}
                    className="text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" /> Copy
                  </button>
                </div>
                <pre className="text-emerald-300 whitespace-pre-wrap max-h-60 overflow-y-auto">{postmanResponse}</pre>
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-border bg-muted/40 font-mono text-[11px] text-muted-foreground space-y-1">
                <div>Status: Ready to execute mock test.</div>
                <div className="text-[10px]">Click &quot;Send&quot; to trigger simulation through Kong Gateway.</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setIsPostmanModalOpen(false)} variant="outline" className="h-8 text-xs font-bold cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Attachment Preview Modal */}
      <Dialog open={!!selectedAttachment} onOpenChange={(open) => !open && setSelectedAttachment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <FileCode className="h-5 w-5 text-primary" />
              {selectedAttachment?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedAttachment?.type} Document • {selectedAttachment?.size}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs max-h-80 overflow-y-auto">
            {selectedAttachment?.type === "YAML" ? (
              <pre className="text-blue-300">
{`openapi: 3.0.3
info:
  title: EV Charging APIs
  version: 2.1.0
  description: Provide secure and scalable APIs for EV charging operations.
servers:
  - url: https://api.magnertia.com/v2
    description: Production Kong Gateway
paths:
  /chargers:
    get:
      summary: List Charging Stations
      security:
        - OAuth2: [read:chargers]
      responses:
        '200':
          description: List of available EV chargers`}
              </pre>
            ) : selectedAttachment?.type === "JSON" ? (
              <pre className="text-emerald-300">
{`{
  "info": {
    "name": "EV Charging APIs v2.1.0",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    { "name": "List Chargers", "request": { "method": "GET", "url": "/chargers" } },
    { "name": "Start Session", "request": { "method": "POST", "url": "/sessions/start" } }
  ]
}`}
              </pre>
            ) : (
              <div className="text-slate-300 space-y-1">
                <p className="font-bold text-white">Verified Specification Document</p>
                <p>Document: {selectedAttachment?.name}</p>
                <p>File Size: {selectedAttachment?.size}</p>
                <p>Status: Authenticated & Digitally Signed</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            {selectedAttachment && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownloadAttachment(selectedAttachment)}
                className="h-8 text-xs gap-1 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download File
              </Button>
            )}
            <Button size="sm" onClick={() => setSelectedAttachment(null)} className="h-8 text-xs bg-primary text-primary-foreground cursor-pointer">
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
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">File Name</label>
              <Input
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                placeholder="e.g. auth-schema.yaml or api_flow.pdf"
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">File Format</label>
              <select
                value={uploadFileType}
                onChange={(e) => setUploadFileType(e.target.value)}
                className="w-full h-8 rounded-md border border-border bg-background px-3 text-xs font-semibold"
              >
                <option value="YAML">YAML (.yaml / .yml)</option>
                <option value="JSON">JSON (.json)</option>
                <option value="PDF">PDF (.pdf)</option>
                <option value="PNG">PNG Image (.png)</option>
              </select>
            </div>

            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center space-y-2 bg-muted/30">
              <Upload className="h-7 w-7 text-muted-foreground mx-auto" />
              <span className="text-xs font-semibold block">Drag and drop files here or click to browse</span>
              <span className="text-[10px] text-muted-foreground block">Supports .yaml, .json, .pdf up to 50 MB</span>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={handleUploadSubmit} className="h-8 text-xs font-bold bg-primary text-primary-foreground cursor-pointer">
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* Audit Trail & History Modal */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <History className="h-5 w-5 text-primary" />
              API Specification Audit Trail & Revision History
            </DialogTitle>
            <DialogDescription className="text-xs">
              Chronological record of changes, reviews, and deployments for {current.apiDevelopmentId}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs max-h-96 overflow-y-auto">
            {(current.auditTrail || [
              { id: "aud1", timestamp: "20 Jun 2024 04:25 PM", user: "Rahul Sharma", action: "Submitted for Review", details: "Submitted EV Charging APIs v2.1.0 to architecture review board.", stage: "In Review" },
              { id: "aud2", timestamp: "20 Jun 2024 02:10 PM", user: "Neha Verma", action: "Security Audit Completed", details: "Verified OAuth 2.0 RBAC policy and API Gateway rate limits.", stage: "In Review" },
              { id: "aud3", timestamp: "19 Jun 2024 11:45 AM", user: "Rahul Sharma", action: "Uploaded OpenAPI Spec", details: "Uploaded ev-api-openapi.yaml and Postman Collection.", stage: "Draft" },
              { id: "aud4", timestamp: "18 Jun 2024 10:15 AM", user: "Rahul Sharma", action: "Created Project", details: "Initialized API Development Record API-2024-0017.", stage: "Draft" },
            ]).map((entry, idx) => (
              <div key={entry.id || idx} className="p-3 rounded-lg border border-border bg-muted/30 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{entry.user}</span>
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {entry.action}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{entry.timestamp}</span>
                </div>
                <p className="text-[11px] text-muted-foreground">{entry.details}</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setIsAuditModalOpen(false)} variant="outline" className="h-8 text-xs font-bold cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Linked Artifact Details Modal */}
      <Dialog open={!!selectedLinkedItem} onOpenChange={(open) => !open && setSelectedLinkedItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ExternalLink className="h-4 w-4 text-primary" />
              {selectedLinkedItem?.title}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedLinkedItem?.id} • {selectedLinkedItem?.type}
            </DialogDescription>
          </DialogHeader>
          <div className="p-3 rounded-lg bg-muted/40 border border-border text-xs space-y-2">
            <p className="text-foreground">{selectedLinkedItem?.details}</p>
            <div className="flex justify-between items-center text-[11px] text-muted-foreground border-t border-border pt-2">
              <span>Sync Status: Real-time Live Link</span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">Connected</Badge>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setSelectedLinkedItem(null)} className="h-8 text-xs bg-primary text-primary-foreground cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default ApiDevelopmentNewPage;
