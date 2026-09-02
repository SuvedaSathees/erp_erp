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
  FileCheck,
  Share2,
  Printer,
  History as HistoryIcon,
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
  ArrowRight,
  ArrowUpRight,
  Bug,
  AlertOctagon,
  Fingerprint,
  Search,
  Paperclip,
  UserCheck,
  Trash2,
  CheckSquare,
} from "lucide-react";

import { cybersecurityEngineeringService } from "@/services/cybersecurityEngineeringService";
import type {
  CybersecurityRecord,
  CybersecurityFormInput,
  CybersecurityApprovalDecision,
  CybersecurityAttachment,
  CybersecurityReviewer,
  CybersecurityAuditEntry,
  CybersecurityStatus,
} from "@/services/types";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
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
import { AppShell } from "@/components/erp/AppShell";
import { cn } from "@/lib/utils";

/* ===========================================================================
   Helper: Browser File Download Generator
   =========================================================================== */
function triggerBrowserDownload(filename: string, content: string, mimeType: string = "text/plain") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

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
        <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
          {score}%
        </span>
      </div>
    </div>
  );
}

/* ===========================================================================
   Routes & Top-Level Route Exports
   =========================================================================== */
export const Route = createFileRoute(
  "/development/research-innovation/cybersecurity-engineering/new",
)({
  head: () => ({
    meta: [{ title: "Cybersecurity Engineering · Magnertia ERP" }],
  }),
  component: CybersecurityEngineeringNewPage,
});

export function CybersecurityFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <CybersecurityEngineeringNewPage {...props} />;
}

export function CybersecurityPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <CybersecurityEngineeringNewPage {...props} />;
}

/* ===========================================================================
   Main Component: CybersecurityEngineeringNewPage
   =========================================================================== */
export function CybersecurityEngineeringNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Tab State (Supports "all" or specific card filtering)
  const [activeTab, setActiveTab] = useState<CybersecurityEngineeringTabId>("all");

  // Local state for interactive editing & instant updates
  const [localRecord, setLocalRecord] = useState<CybersecurityRecord | null>(null);

  // Modals & Interactive Overlays
  const [selectedAttachment, setSelectedAttachment] = useState<CybersecurityAttachment | null>(null);
  const [isVulnerabilityScanOpen, setIsVulnerabilityScanOpen] = useState(false);
  const [isThreatHeatmapOpen, setIsThreatHeatmapOpen] = useState(false);
  const [isSiemConsoleOpen, setIsSiemConsoleOpen] = useState(false);
  const [isKeyManagementOpen, setIsKeyManagementOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isAddReviewerOpen, setIsAddReviewerOpen] = useState(false);
  const [linkedEntityModal, setLinkedEntityModal] = useState<{
    type: string;
    id: string;
    title: string;
    route: string;
  } | null>(null);

  // Scan Simulation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanProfile, setScanProfile] = useState<"quick" | "full" | "containers" | "firmware">("full");
  const [scanLogs, setScanLogs] = useState<string[]>([
    "Ready to initiate Qualys VMDR vulnerability scan engine.",
    "Target scope: Cloud VPC, 24 REST APIs, AWS EKS Containers, Edge Firmware.",
  ]);

  // Upload Form Inputs
  const [uploadName, setUploadName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Penetration Testing");
  const [uploadUploader, setUploadUploader] = useState("Rahul Sharma");

  // Add Reviewer Form Inputs
  const [newReviewerRole, setNewReviewerRole] = useState("");
  const [newReviewerName, setNewReviewerName] = useState("");

  // Review & Approval State
  const [reviewDecision, setReviewDecision] =
    useState<CybersecurityApprovalDecision>("Approved with Conditions");
  const [reviewCommentInput, setReviewCommentInput] = useState(
    "Overall security posture is good. Please remediate minor findings and re-run vulnerability scan.",
  );

  // SIEM Console Simulation State
  const [siemSearch, setSiemSearch] = useState("");
  const [siemEvents, setSiemEvents] = useState([
    { id: "EVT-8821", time: "Just now", source: "192.168.1.104", type: "TLS Handshake", status: "Clean", proto: "TLS 1.3 / ECDHE" },
    { id: "EVT-8820", time: "1 min ago", source: "203.0.113.45", type: "API Auth Attempt", status: "Clean", proto: "OAuth 2.0 Bearer" },
    { id: "EVT-8819", time: "3 mins ago", source: "198.51.100.12", type: "Burst Request", status: "Flagged", proto: "Rate Limit Enforced" },
    { id: "EVT-8818", time: "5 mins ago", source: "10.0.4.18", type: "KMS Decryption", status: "Authorized", proto: "AWS KMS / HSM" },
  ]);

  // Data Fetching via React Query
  const { data: serverRecord, isLoading } = useQuery<CybersecurityRecord>({
    queryKey: ["cybersecurityEngineeringRecord"],
    queryFn: () => cybersecurityEngineeringService.fetchRecord(),
  });

  // Keep local record synced with serverRecord initially
  React.useEffect(() => {
    if (serverRecord && !localRecord) {
      setLocalRecord(serverRecord);
    }
  }, [serverRecord, localRecord]);

  const record = localRecord || serverRecord;

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<CybersecurityFormInput>) =>
      cybersecurityEngineeringService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
      setLocalRecord(updated);
      toast.success("Draft saved successfully!", {
        description: "Cybersecurity parameters, STRIDE configs, and metadata updated.",
      });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", { description: err?.message || "An error occurred." });
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: () => cybersecurityEngineeringService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
      setLocalRecord(updated);
      toast.success("Submitted for Security Review!", {
        description: "Project moved to 'In Review' workflow stage. Review board notified.",
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
      setLocalRecord(updated);
      toast.success(`Review decision saved: ${reviewDecision}`, {
        description: "Cybersecurity audit log and reviewer sign-off recorded.",
      });
    },
  });

  // Action: Save Draft Handler with Current Local State
  const handleSaveDraft = () => {
    if (!record) return;
    saveDraftMutation.mutate({
      securityProjectName: record.securityProjectName,
      securityVersion: record.securityVersion,
      businessObjective: record.businessObjective,
      securityScope: record.securityScope,
      criticalityLevel: record.criticalityLevel,
      productCategory: record.productCategory,
      workflowStatus: record.workflowStatus,
    });
  };

  // Action: Workflow Status Direct Update
  const handleStatusChange = (newStatus: CybersecurityStatus) => {
    if (!record) return;
    const updated = {
      ...record,
      workflowStatus: newStatus,
      lastModified: new Date().toISOString(),
      lastUpdated: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
    toast.success(`Status updated to '${newStatus}'`);
  };

  // Vulnerability Scan Simulation Action
  const handleStartVulnerabilityScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanLogs([
      "Initializing Qualys VMDR vulnerability scanner Engine v4.8...",
      "Targeting endpoints: AWS API Gateway, Edge Chargers, Kubernetes Pods...",
      "Running OWASP Top 10 automated test suites & dependency checks...",
    ]);

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setScanProgress(current);
      setScanLogs((prev) => [
        ...prev,
        `Progress ${current}%: Inspected ${current * 37} microservice containers and ${current * 6} API endpoints...`,
      ]);

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanLogs((prev) => [
          ...prev,
          "Scan completed! 0 Critical, 0 High, 3 Low vulnerabilities found. Zero Trust policies compliant.",
        ]);
        if (record) {
          const updated = {
            ...record,
            secureDevelopmentScore: 92,
            secureDevConfig: {
              ...record.secureDevConfig,
              vulnerabilitiesFoundCount: 3,
              sastStatus: "Completed (Verified)",
              scaStatus: "Completed (Clean)",
              secureDevelopmentScore: 92,
            },
          };
          setLocalRecord(updated);
          queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
        }
        toast.success("Vulnerability scan completed successfully!", {
          description: "Scan reports generated. Dev score improved to 92/100.",
        });
      }
    }, 450);
  };

  // Action: Add New Security Attachment
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadName.trim()) {
      toast.error("Please provide a file name");
      return;
    }
    const newAtt: CybersecurityAttachment = {
      id: `att-${Date.now()}`,
      name: uploadName.endsWith(".pdf") ? uploadName : `${uploadName}.pdf`,
      size: "2.8 MB",
      type: "PDF",
      uploadedBy: uploadUploader || "Rahul Sharma",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      url: "#",
    };

    if (record) {
      const updated = {
        ...record,
        attachments: [newAtt, ...record.attachments],
      };
      setLocalRecord(updated);
      queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
    }

    setIsUploadOpen(false);
    setUploadName("");
    toast.success(`Uploaded ${newAtt.name} successfully!`, {
      description: "Added to Security Attachments & Penetration Reports.",
    });
  };

  // Action: Delete Attachment
  const handleDeleteAttachment = (id: string, name: string) => {
    if (!record) return;
    const updated = {
      ...record,
      attachments: record.attachments.filter((a) => a.id !== id),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
    toast.success(`Removed attachment: ${name}`);
  };

  // Action: Add Reviewer to Board
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerRole.trim()) {
      toast.error("Please enter reviewer name and role");
      return;
    }
    const newRev: CybersecurityReviewer = {
      role: newReviewerRole,
      person: newReviewerName,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      decision: "Pending",
      date: "-",
      comments: "Pending board review",
    };

    if (record) {
      const updated = {
        ...record,
        reviewers: [...record.reviewers, newRev],
      };
      setLocalRecord(updated);
      queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
    }

    setIsAddReviewerOpen(false);
    setNewReviewerName("");
    setNewReviewerRole("");
    toast.success(`Added ${newRev.person} to Cybersecurity Engineering Board`);
  };

  // Action: Toggle Reviewer Decision directly
  const handleToggleReviewerDecision = (index: number) => {
    if (!record) return;
    const decisions: CybersecurityApprovalDecision[] = ["Approved", "Approved with Conditions", "Changes Requested", "Rejected"];
    const current = record.reviewers[index]?.decision || "Pending";
    const nextIdx = (decisions.indexOf(current as CybersecurityApprovalDecision) + 1) % decisions.length;
    const nextDecision = decisions[nextIdx];
    const updatedReviewers = [...record.reviewers];
    updatedReviewers[index] = {
      ...updatedReviewers[index],
      decision: nextDecision,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated = { ...record, reviewers: updatedReviewers };
    setLocalRecord(updated);
    queryClient.setQueryData(["cybersecurityEngineeringRecord"], updated);
    toast.success(`Updated ${updatedReviewers[index].person}'s decision to ${nextDecision}`);
  };

  // Action: Export Full Dossier (.TXT)
  const handleExportDossier = () => {
    if (!record) return;
    const content = `====================================================================
CYBERSECURITY ENGINEERING SPECIFICATION & COMPLIANCE DOSSIER
====================================================================
Project Name: ${record.securityProjectName}
Version: ${record.securityVersion}
Cybersecurity ID: ${record.cybersecurityEngineeringId}
Form Code: ${record.formCode}
Workflow Status: ${record.workflowStatus}
Security Architect: ${record.securityArchitectName}
Date Exported: ${new Date().toISOString()}

1. EXECUTIVE OVERALL READINESS
--------------------------------------------------------------------
Overall Score: ${record.overallCybersecurityScore}%
1. Threat Modeling Score: ${record.threatReadinessScore}%
2. Architecture Security: ${record.architectureSecurityScore}%
3. Secure Development Score: ${record.secureDevelopmentScore}%
4. Compliance & Governance: ${record.governanceScore}%
5. Monitoring Score: ${record.monitoringScore}%

2. ZERO TRUST ARCHITECTURE CONFIGURATION
--------------------------------------------------------------------
Zero Trust Enforced: ${record.architectureConfig.zeroTrustApplied ? "YES" : "NO"}
Secure Communication: ${record.architectureConfig.secureCommunication}
Encryption Standard: ${record.architectureConfig.encryptionStandard}
KMS Provider: ${record.architectureConfig.keyManagement}
Network Segmentation: ${record.architectureConfig.networkSegmentation}

3. STRIDE THREAT MODEL
--------------------------------------------------------------------
Methodology: ${record.threatModelConfig.method}
Assets Identified: ${record.threatModelConfig.assetsIdentified}
Attack Surface Rating: ${record.threatModelConfig.attackSurface}
Controls Proposed: ${record.threatModelConfig.securityControlsProposed}
Threat Model Readiness Score: ${record.threatModelConfig.threatModelScore}%

4. IDENTITY & ACCESS MANAGEMENT (IAM)
--------------------------------------------------------------------
Auth Protocol: ${record.iamConfig.authenticationMethod}
MFA Mandatory: ${record.iamConfig.mfaEnabled ? "YES" : "NO"}
Authorization: ${record.iamConfig.authorizationModel}
Secrets Vault: ${record.iamConfig.secretsManagement}

5. MONITORING & INCIDENT RESPONSE
--------------------------------------------------------------------
SIEM Platform: ${record.monitoringConfig.siemPlatform}
Threat Intelligence: ${record.monitoringConfig.threatIntelligence}
Vulnerability Management: ${record.monitoringConfig.vulnerabilityManagement}
Security Operations Center: ${record.monitoringConfig.securityDashboardStatus}

6. ATTACHMENTS & PENETRATION AUDITS (${record.attachments.length} Files)
--------------------------------------------------------------------
${record.attachments.map((a, i) => `${i + 1}. ${a.name} (${a.size}) - Uploaded by ${a.uploadedBy} on ${a.date}`).join("\n")}

7. REVIEW BOARD DECISIONS
--------------------------------------------------------------------
${record.reviewers.map((r, i) => `${i + 1}. [${r.decision}] ${r.role} - ${r.person}: ${r.comments} (${r.date})`).join("\n")}
====================================================================`;

    triggerBrowserDownload(
      `${record.cybersecurityEngineeringId}_cybersecurity_dossier.txt`,
      content,
      "text/plain;charset=utf-8"
    );
    toast.success("Cybersecurity dossier downloaded successfully!");
  };

  // Filter helper: Determines if a section card should be shown based on activeTab
  const shouldShowSection = (sectionId: CybersecurityEngineeringTabId) => {
    return activeTab === "all" || activeTab === sectionId;
  };

  if (isLoading || !record) {
    return (
      <AppShell
        title="Cybersecurity Engineering"
        breadcrumb={breadcrumb ?? "Development > Research & Innovation > Cybersecurity Engineering"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading Cybersecurity Engineering Module...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Cybersecurity Engineering"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Cybersecurity Engineering"}
      description="Perform threat modeling (STRIDE), vulnerability assessments, penetration testing, and security compliance audits."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="space-y-4 pb-16">
        {/* ====================================================================
           1. TOP RECORD HEADER BAR: Title, Version, Interactive Status & Actions
           ==================================================================== */}
        <div className="bg-white dark:bg-slate-900 border-b border-border/80 px-4 sm:px-6 py-4 space-y-3 shadow-2xs">
          {/* Row 1: Title, Version, Status Dropdown & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5"
                >
                  {record.securityVersion}
                </Badge>

                {/* Interactive Workflow Status Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-primary",
                        record.workflowStatus === "Approved" || record.workflowStatus === "Production Deployed"
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : record.workflowStatus === "In Review"
                          ? "bg-amber-500 text-white hover:bg-amber-600"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      )}
                    >
                      <Workflow className="h-3 w-3" />
                      <span>{record.workflowStatus}</span>
                      <ChevronDown className="h-3 w-3 opacity-80" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => handleStatusChange("Draft")} className="cursor-pointer">
                      <Clock className="mr-2 h-3.5 w-3.5 text-slate-500" /> Draft
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("In Review")} className="cursor-pointer">
                      <Eye className="mr-2 h-3.5 w-3.5 text-amber-500" /> In Review
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("Approved")} className="cursor-pointer">
                      <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Approved
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("Production Deployed")} className="cursor-pointer">
                      <Zap className="mr-2 h-3.5 w-3.5 text-blue-500" /> Production Deployed
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 h-9 text-xs font-medium cursor-pointer border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Save className="h-3.5 w-3.5 text-slate-500" />
                Save Draft
              </Button>

              {record.workflowStatus === "In Review" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      className="h-9 px-3.5 text-xs font-semibold gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 shadow-2xs transition-all cursor-pointer"
                    >
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                      </span>
                      <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Under Review</span>
                      <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 text-xs">
                    <DropdownMenuItem
                      onClick={() => document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" })}
                      className="cursor-pointer"
                    >
                      <UserCheck className="mr-2 h-4 w-4 text-emerald-600" /> Record Review Decision
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        toast.success("Expedited review reminder dispatched to Cybersecurity Engineering Board.");
                      }}
                      className="cursor-pointer"
                    >
                      <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        setLocalRecord((prev) => (prev ? { ...prev, workflowStatus: "Draft" } : prev));
                        toast.info("Status reverted to Draft. You can now modify security controls.");
                      }}
                      className="cursor-pointer text-amber-600 dark:text-amber-400"
                    >
                      <ArrowRight className="mr-2 h-4 w-4" /> Revert Status to Draft
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : record.workflowStatus === "Approved" || record.workflowStatus === "Production Deployed" ? (
                <Badge className="h-9 px-3 text-xs font-semibold gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  {record.workflowStatus}
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => submitForReviewMutation.mutate()}
                  disabled={submitForReviewMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-2xs h-9 text-xs font-medium cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitForReviewMutation.isPending ? "Submitting..." : "Submit for Review"}
                </Button>
              )}

              <Button
                size="sm"
                onClick={() => document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" })}
                className="h-9 px-3.5 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Review Decision
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 border-slate-300 dark:border-slate-700 cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setIsVulnerabilityScanOpen(true)} className="cursor-pointer">
                    <Bug className="h-4 w-4 mr-2 text-amber-500" />
                    Run Vulnerability Scan
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsThreatHeatmapOpen(true)} className="cursor-pointer">
                    <AlertOctagon className="h-4 w-4 mr-2 text-red-500" />
                    View STRIDE Threat Heatmap
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsSiemConsoleOpen(true)} className="cursor-pointer">
                    <Activity className="h-4 w-4 mr-2 text-blue-500" />
                    View Sentinel SIEM Console
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsKeyManagementOpen(true)} className="cursor-pointer">
                    <Key className="h-4 w-4 mr-2 text-purple-500" />
                    HSM Cryptographic Key Vault
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportDossier} className="cursor-pointer">
                    <Download className="h-4 w-4 mr-2 text-primary" />
                    Export Dossier (.TXT)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.print()} className="cursor-pointer">
                    <Printer className="h-4 w-4 mr-2" />
                    Print Specification
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Project URL copied to clipboard!");
                    }}
                    className="cursor-pointer"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Row 2: Secondary Metadata & FUNCTIONAL Linked Entity Dialog Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
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
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Product Portfolio",
                      id: record.linkedProductId,
                      title: "Smart EV Charger (Dual AC Type-2)",
                      route: "/development/product-development",
                    })
                  }
                  className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedProductId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked Software
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Software Development",
                      id: record.linkedSoftwareDevId,
                      title: "EV Cloud Control Backend Services",
                      route: "/development/research-innovation/software-development/new",
                    })
                  }
                  className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedSoftwareDevId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked Cloud
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Cloud Platform",
                      id: record.linkedCloudPlatformDevId,
                      title: "AWS Multi-Region EV Core Infrastructure",
                      route: "/development/research-innovation/cloud-platform-development/new",
                    })
                  }
                  className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedCloudPlatformDevId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked API
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "API Development",
                      id: record.linkedApiDevId,
                      title: "EV Charging Station OCPI & OCPP 2.0.1 APIs",
                      route: "/development/research-innovation/api-development/new",
                    })
                  }
                  className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedApiDevId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
              </div>

              <div className="h-7 w-px bg-border hidden sm:block" />

              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                  Linked AI Model
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "AI Model Development",
                      id: record.linkedAiModelDevId,
                      title: "EV Demand Forecasting & Anomaly Model",
                      route: "/development/research-innovation/ai-model-development/new",
                    })
                  }
                  className="font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>{record.linkedAiModelDevId}</span>
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </button>
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

        {/* ====================================================================
           2. SUBMODULE TAB BAR (Interactive Sticky Navigation Bar)
           ==================================================================== */}
        <CybersecurityEngineeringTabBar
          activeTab={activeTab}
          onTabChange={(newTab) => {
            setActiveTab(newTab);
            const sectionMap: Record<string, string> = {
              overview: "section-overview",
              threat_modeling: "section-threat-modeling",
              architecture: "section-architecture",
              iam: "section-iam",
              secure_development: "section-secure-dev",
              security_testing: "section-testing",
              monitoring: "section-monitoring",
              compliance: "section-compliance",
              attachments: "section-attachments",
              review_approval: "section-review",
            };
            const targetId = sectionMap[newTab];
            if (targetId) {
              const el = document.getElementById(targetId);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
        />

        {/* ====================================================================
           3. EXECUTIVE OVERALL CYBERSECURITY SCORE & PILLARS STRIP
           ==================================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col xl:flex-row items-center justify-between gap-6">
              {/* Overall Score Gauge */}
              <div className="flex items-center gap-5 shrink-0">
                <CircularScoreGauge score={record.overallCybersecurityScore} label="Overall Score" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Cybersecurity Lifecycle Readiness</span>
                    <Badge className="bg-emerald-600 text-white text-[10px] font-semibold">5 of 5 Pillars Compliant</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-md">
                    Zero Trust architecture verification, continuous STRIDE threat modeling, ASVS Level 2 code assurance, and 24/7 SIEM monitoring.
                  </p>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 pt-0.5">
                    <Target className="h-3.5 w-3.5" />
                    <span>Total Score: {record.overallCybersecurityScore}% (91% Avg across 5 Pillars)</span>
                  </div>
                </div>
              </div>

              {/* 5 Component Metrics with Progress Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full xl:w-auto xl:min-w-[620px]">
                <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">1. Threat Model</span>
                  <span className="text-sm font-bold text-foreground font-mono">{record.threatReadinessScore}%</span>
                  <Progress value={record.threatReadinessScore} className="h-1.5" />
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">2. Architecture</span>
                  <span className="text-sm font-bold text-foreground font-mono">{record.architectureSecurityScore}%</span>
                  <Progress value={record.architectureSecurityScore} className="h-1.5" />
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">3. Secure Dev</span>
                  <span className="text-sm font-bold text-foreground font-mono">{record.secureDevelopmentScore}%</span>
                  <Progress value={record.secureDevelopmentScore} className="h-1.5" />
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">4. Compliance</span>
                  <span className="text-sm font-bold text-foreground font-mono">{record.governanceScore}%</span>
                  <Progress value={record.governanceScore} className="h-1.5" />
                </div>
                <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-center space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-muted-foreground block font-medium">5. Monitoring</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{record.monitoringScore}%</span>
                  <Progress value={record.monitoringScore} className="h-1.5" />
                </div>
              </div>
            </div>
          </Card>

          {/* ====================================================================
             4. BALANCED WORKSPACE SECTIONS GRID
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Card 1: Security Project Overview & Target Deployment Scope */}
            {shouldShowSection("overview") && (
              <Card id="section-overview" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">1. Security Project Overview & Target Scope</CardTitle>
                  </div>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-semibold text-xs border border-red-200">
                    Criticality: High
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Business Objective
                    </span>
                    <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 font-medium text-foreground leading-relaxed">
                      {record.businessObjective}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[11px]">
                      Security Engineering Scope
                    </span>
                    <p className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 text-muted-foreground leading-relaxed">
                      {record.securityScope}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-[10px] text-muted-foreground block font-medium">Product Category</span>
                      <span className="font-semibold text-foreground text-xs">{record.productCategory}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 block text-[10px]">Target Deployment</span>
                      <div className="flex flex-wrap gap-1">
                        {["Production", "Cloud", "Edge", "Mobile"].map((dep, idx) => (
                          <Badge key={idx} variant="outline" className="text-[10px] px-2 py-0">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Card 2: Secure Architecture & Zero Trust Principles */}
            {shouldShowSection("architecture") && (
              <Card id="section-architecture" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">3. Secure Architecture & Zero Trust Principles</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white font-mono text-xs font-semibold">
                      Score: {record.architectureConfig.architectureSecurityScore}/100
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsKeyManagementOpen(true)}
                      className="gap-1 text-xs h-7 cursor-pointer"
                    >
                      <Key className="h-3 w-3" />
                      HSM Vault
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Zero Trust Arch</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                        {record.architectureConfig.zeroTrustApplied ? "Enforced" : "Partial"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Secure Protocol</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.architectureConfig.secureCommunication}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Encryption Standard</span>
                      <span className="font-semibold text-foreground text-xs">{record.architectureConfig.encryptionStandard}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">KMS Provider</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.architectureConfig.keyManagement}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Cryptographic Assurance & Micro-Segmentation</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Zero-trust boundaries between cloud VPCs, edge chargers, and mobile apps. Every request authenticated via mTLS with hardware security module (HSM) stored private keys.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Card 3: Threat Modeling & STRIDE Risk Matrix */}
            {shouldShowSection("threat_modeling") && (
              <Card id="section-threat-modeling" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">2. Threat Modeling & STRIDE Risk Matrix</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white font-mono text-xs font-semibold">
                      Score: {record.threatModelConfig.threatModelScore}/100
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsThreatHeatmapOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                      <BarChart3 className="h-3 w-3" />
                      Heatmap
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Method</span>
                      <span className="font-semibold text-foreground text-xs">{record.threatModelConfig.method}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Assets Identified</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.threatModelConfig.assetsIdentified} Assets</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Attack Surface</span>
                      <span className="font-semibold text-amber-600 text-xs">{record.threatModelConfig.attackSurface}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Controls Proposed</span>
                      <span className="font-semibold text-foreground text-xs">{record.threatModelConfig.securityControlsProposed} Controls</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      STRIDE Threat Vector Categorization (All Mitigated)
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { name: "Spoofing", controls: "4 Controls" },
                        { name: "Tampering", controls: "6 Controls" },
                        { name: "Repudiation", controls: "3 Controls" },
                        { name: "Information Disclosure", controls: "8 Controls" },
                        { name: "Denial of Service", controls: "5 Controls" },
                        { name: "Elevation of Privilege", controls: "6 Controls" },
                      ].map((item, idx) => (
                        <div key={idx} className="p-2 rounded border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between">
                          <div>
                            <span className="font-medium text-foreground block text-[11px] truncate">{item.name}</span>
                            <span className="text-[10px] text-muted-foreground">{item.controls}</span>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] px-1.5 py-0 font-bold">
                            Mitigated
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Card 4: Identity & Access Management (IAM) */}
            {shouldShowSection("iam") && (
              <Card id="section-iam" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">4. Identity & Access Management (IAM)</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    IAM Score: {record.iamConfig.iamReadinessScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Auth Protocol</span>
                      <span className="font-semibold text-foreground text-xs">{record.iamConfig.authenticationMethod}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">MFA Requirement</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                        {record.iamConfig.mfaEnabled ? "Mandatory for All" : "Optional"}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Authorization</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.iamConfig.authorizationModel}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Secrets Vault</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.iamConfig.secretsManagement}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Role-Based Access Control & Secret Rotation</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Granular RBAC with least-privilege policies. Automated 90-day secret rotation in HashiCorp Vault with ephemeral token minting for microservices.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Card 5: Secure Development & SAST/SCA Code Scanning */}
            {shouldShowSection("secure_development") && (
              <Card id="section-secure-dev" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">5. Secure Development & SAST/SCA Scanning</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-600 text-white font-mono text-xs font-semibold">
                      Dev Score: {record.secureDevConfig.secureDevelopmentScore}/100
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsVulnerabilityScanOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                      <Bug className="h-3 w-3" />
                      Run Scan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Coding Standard</span>
                      <span className="font-semibold text-foreground text-xs">{record.secureDevConfig.secureCodingStandard}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">SAST Static</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">{record.secureDevConfig.sastStatus}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">SCA Dependency</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">{record.secureDevConfig.scaStatus}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Vulnerabilities</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs truncate block">
                        {record.secureDevConfig.vulnerabilitiesFoundCount} Low Severity
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Automated CI/CD Quality Gate & Code Audits</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      SonarQube and Snyk gates integrated into GitHub Actions. Zero critical or high vulnerabilities allowed before production container deployment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Card 6: Security Testing & Penetration Validation */}
            {shouldShowSection("security_testing") && (
              <Card id="section-testing" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">6. Security Testing & Penetration Validation</CardTitle>
                  </div>
                  <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                    Validation Score: {record.testingConfig.validationScore}/100
                  </Badge>
                </CardHeader>
                <CardContent className="pt-4 space-y-2 text-xs flex-1">
                  {[
                    { test: "DAST Dynamic Application Analysis", status: record.testingConfig.dastStatus },
                    { test: "External Black-Box Penetration Testing", status: record.testingConfig.penetrationTesting },
                    { test: "OWASP API Top 10 Security Testing", status: record.testingConfig.apiSecurityTesting },
                    { test: "Embedded Firmware Security Validation", status: record.testingConfig.firmwareSecurityTesting },
                    { test: "IoT Charger Hardware Penetration Testing", status: record.testingConfig.iotSecurityTesting },
                  ].map((item, idx) => (
                    <div key={idx} className="p-2 rounded border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 flex items-center justify-between">
                      <span className="font-medium text-foreground text-xs">{item.test}</span>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                        <Check className="h-3 w-3 mr-1 inline" /> {item.status}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Card 7: Security Monitoring & SIEM Incident Response */}
            {shouldShowSection("monitoring") && (
              <Card id="section-monitoring" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-sm font-bold">7. Security Monitoring & Incident Response</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white font-mono text-xs font-semibold">
                      Monitoring: {record.monitoringConfig.monitoringScore}/100
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => setIsSiemConsoleOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                      <Activity className="h-3 w-3" />
                      SIEM Console
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">SIEM Platform</span>
                      <span className="font-semibold text-foreground text-xs">{record.monitoringConfig.siemPlatform}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Threat Intelligence</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs">{record.monitoringConfig.threatIntelligence}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Vulnerability Mgmt</span>
                      <span className="font-semibold text-foreground text-xs truncate block">{record.monitoringConfig.vulnerabilityManagement}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block text-[10px]">Security Dashboard</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">{record.monitoringConfig.securityDashboardStatus}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <span className="font-semibold text-foreground text-xs block">Live Threat Ingestion & Automated SOAR Playbooks</span>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      Automated anomaly detection across API traffic, charger edge connections, and cloud logs with rapid automated containment playbooks.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Card 8: Compliance, Regulatory Governance & AI Copilot */}
            {shouldShowSection("compliance") && (
              <Card id="section-compliance" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    <CardTitle className="text-sm font-bold">8. Compliance Governance & AI Copilot</CardTitle>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                      Compliance: {record.complianceConfig.governanceScore}/100
                    </Badge>
                    <Badge className="bg-purple-600 text-white font-mono text-xs font-semibold">
                      AI: {record.aiAssessment.aiOverallSecurityScore}/100
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3.5 text-xs flex-1">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5 text-[11px]">
                      Applicable Security Standards & Regulations
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {record.complianceConfig.applicableStandards.map((std, i) => (
                        <Badge key={i} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-xs py-1 px-3">
                          <Check className="h-3.5 w-3.5 mr-1 inline" /> {std}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs py-1 px-3">
                        <Check className="h-3.5 w-3.5 mr-1 inline" /> Privacy: {record.complianceConfig.privacyCompliance}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-purple-200/70 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-purple-900 dark:text-purple-200 text-xs">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      <span>Security Copilot Threat Prediction</span>
                    </div>
                    <p className="text-purple-800 dark:text-purple-300 text-[11px] leading-relaxed">
                      {record.aiAssessment.aiRiskPrediction}. 12 security recommendations applied to pipeline.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ====================================================================
             5. SECURITY ATTACHMENTS & PENETRATION REPORTS (Full Width)
             ==================================================================== */}
          {shouldShowSection("attachments") && (
            <Card id="section-attachments" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">10. Security Attachments & Penetration Reports</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">{record.attachments.length} Files</Badge>
                  <Button size="sm" variant="outline" onClick={() => setIsUploadOpen(true)} className="gap-1 text-xs h-7 cursor-pointer">
                    <Upload className="h-3 w-3" />
                    Upload File
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {record.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileCode className="h-4 w-4 text-blue-500 shrink-0" />
                        <div className="truncate">
                          <span className="font-semibold text-foreground block truncate" title={att.name}>{att.name}</span>
                          <span className="text-[10px] text-muted-foreground">{att.size} • {att.uploadedBy}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer hover:text-blue-600"
                          onClick={() => setSelectedAttachment(att)}
                          title="Preview Document"
                        >
                          <Eye className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer hover:text-emerald-600"
                          onClick={() => {
                            triggerBrowserDownload(
                              att.name,
                              `=======================================================\nDOCUMENT: ${att.name}\nCATEGORY: Security Audit / Penetration Baseline\nUPLOADED BY: ${att.uploadedBy}\nINTEGRITY SHA-256: 8f4a18e26bc8f15d9a2468ac73ef0b2210\nSTATUS: Cryptographically Verified & Approved\nPROJECT: ${record.securityProjectName}\n=======================================================`
                            );
                            toast.success(`Downloaded ${att.name}`);
                          }}
                          title="Download File"
                        >
                          <Download className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 cursor-pointer hover:text-red-600"
                          onClick={() => handleDeleteAttachment(att.id, att.name)}
                          title="Delete File"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-slate-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* ====================================================================
             6. REVIEW & APPROVAL BOARD TIMELINE & SIGN-OFF (Full Width)
             ==================================================================== */}
          {shouldShowSection("review_approval") && (
            <Card id="section-review" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">11. Review & Approval Board Timeline</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold border-amber-200">
                    Cybersecurity Engineering Board
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddReviewerOpen(true)}
                    className="gap-1 text-xs h-7 cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    Add Reviewer
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-5 text-xs">
                {/* Executive Board Consensus Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-muted-foreground uppercase tracking-wider">
                      Board Evaluator Consensus (Click to Toggle)
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {record.reviewers.filter((r) => r.decision === "Approved" || r.decision === "Approved with Conditions").length} of {record.reviewers.length} Endorsed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {record.reviewers.map((rev, i) => (
                      <div
                        key={i}
                        onClick={() => handleToggleReviewerDecision(i)}
                        className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between gap-1.5"
                        title="Click to cycle decision status"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-foreground text-xs truncate">{rev.person}</span>
                          <Badge
                            className={
                              rev.decision === "Approved"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-[9px] font-bold"
                                : rev.decision === "Approved with Conditions"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 text-[9px] font-bold"
                                : rev.decision === "Changes Requested"
                                ? "bg-red-100 text-red-800 dark:bg-red-950/60 text-[9px] font-bold"
                                : "bg-slate-200 text-slate-700 dark:bg-slate-800 text-[9px] font-medium"
                            }
                          >
                            {rev.decision}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="truncate">{rev.role}</span>
                          <span className="font-mono shrink-0">{rev.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
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
                        onChange={(e) => setReviewDecision(e.target.value as CybersecurityApprovalDecision)}
                        className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
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
                      onClick={() => {
                        reviewDecisionMutation.mutate({
                          id: record.id,
                          decision: reviewDecision,
                          comments: reviewCommentInput,
                        });
                        // Also update review board rows locally
                        const updatedReviewers = record.reviewers.map((r) =>
                          r.role === "Security Architect"
                            ? { ...r, decision: reviewDecision, comments: reviewCommentInput, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
                            : r
                        );
                        setLocalRecord({
                          ...record,
                          reviewers: updatedReviewers,
                        });
                      }}
                      disabled={reviewDecisionMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 h-8 font-bold text-xs cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Save Decision
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ====================================================================
             7. AUDIT TRAIL LOG / SYSTEM INFO (Full Width)
             ==================================================================== */}
          {shouldShowSection("system_info") && (
            <Card id="section-system-info" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <HistoryIcon className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-sm font-bold">12. Audit Trail & Verification Logs</CardTitle>
                </div>
                <Badge variant="outline" className="text-xs font-mono">Immutable Log</Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span className="font-semibold text-foreground">Zero Trust Architectural Gateway Verified</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">20 Jun 2024, 04:25 PM • Rahul Sharma</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <Bug className="h-4 w-4 text-amber-500" />
                      <span className="font-semibold text-foreground">Qualys VMDR Vulnerability Scan Executed (4 Findings Remediated)</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">19 Jun 2024, 02:15 PM • CI/CD Snyk Bot</span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-purple-500" />
                      <span className="font-semibold text-foreground">AWS KMS Root-of-Trust Hardware Master Key Rotation Completed</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground font-mono">18 Jun 2024, 10:15 AM • Vikram Singh</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* =========================================================================
            8. INTERACTIVE DIALOGS & MODALS
            ========================================================================= */}

        {/* 1. Live Vulnerability Scanner Modal */}
        <Dialog open={isVulnerabilityScanOpen} onOpenChange={setIsVulnerabilityScanOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-amber-500" />
                Qualys VMDR Security Scanner Console
              </DialogTitle>
              <DialogDescription>
                Automated vulnerability assessment across APIs, containers, and firmware
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2 text-xs">
              <div className="flex gap-2">
                {(["full", "quick", "containers", "firmware"] as const).map((p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={scanProfile === p ? "default" : "outline"}
                    onClick={() => setScanProfile(p)}
                    className="text-xs h-7 capitalize cursor-pointer"
                  >
                    {p} Scan
                  </Button>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center font-semibold">
                  <span>Scan Progress ({scanProgress}%)</span>
                  <span className="font-mono text-blue-600">{scanProgress}%</span>
                </div>
                <Progress value={scanProgress} className="h-2" />
              </div>

              <div className="h-40 rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto space-y-1 border border-slate-800">
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
                className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5 cursor-pointer"
              >
                <Play className="h-4 w-4" />
                {isScanning ? "Scanning..." : "Start Vulnerability Scan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 2. STRIDE Threat Heatmap Modal */}
        <Dialog open={isThreatHeatmapOpen} onOpenChange={setIsThreatHeatmapOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-red-600" />
                STRIDE Threat Vector Heatmap & Risk Matrix
              </DialogTitle>
              <DialogDescription>
                Categorized risk assessment matrix across the 6 STRIDE pillars
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "Spoofing", severity: "High (Mitigated)", controls: "mTLS, X.509 Device Certs, OAuth 2.0 PKCE", score: 94 },
                  { name: "Tampering", severity: "Critical (Mitigated)", controls: "AES-GCM Authenticated Encryption, Signed Firmware", score: 92 },
                  { name: "Repudiation", severity: "Medium (Mitigated)", controls: "Append-only Audit Trail, CloudTrail, Sentinel", score: 90 },
                  { name: "Information Disclosure", severity: "High (Mitigated)", controls: "Zero Trust VPC Isolation, TLS 1.3, KMS HSM Keys", score: 95 },
                  { name: "Denial of Service", severity: "High (Mitigated)", controls: "AWS Shield DDoS Protection, Rate Limiting", score: 89 },
                  { name: "Elevation of Privilege", severity: "Critical (Mitigated)", controls: "Granular RBAC, Least Privilege IAM, OIDC", score: 93 },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-foreground text-xs">{item.name}</span>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-bold">
                        {item.score}%
                      </Badge>
                    </div>
                    <span className="text-[10px] text-amber-600 font-semibold block">{item.severity}</span>
                    <p className="text-[10px] text-muted-foreground leading-tight">{item.controls}</p>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  triggerBrowserDownload("stride_risk_matrix.json", JSON.stringify(record.threatModelConfig, null, 2), "application/json");
                  toast.success("Downloaded stride_risk_matrix.json");
                }}
                className="gap-1.5 text-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Export STRIDE Matrix
              </Button>
              <Button size="sm" onClick={() => setIsThreatHeatmapOpen(false)} className="cursor-pointer">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. SIEM Incident Console Modal */}
        <Dialog open={isSiemConsoleOpen} onOpenChange={setIsSiemConsoleOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Microsoft Sentinel SIEM Real-Time Incident Stream
              </DialogTitle>
              <DialogDescription>
                Live security telemetry, anomaly detection, and SOAR response playbooks
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="font-bold">Active Threat Status: Normal (Zero Breaches Detected)</span>
                </div>
                <span className="font-mono text-[11px] font-bold">1,420 Events Triaged / hr</span>
              </div>

              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  value={siemSearch}
                  onChange={(e) => setSiemSearch(e.target.value)}
                  placeholder="Filter events by IP, protocol, or status..."
                  className="h-7 text-xs"
                />
              </div>

              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-muted-foreground font-semibold">
                    <tr>
                      <th className="p-2">Event ID</th>
                      <th className="p-2">Source IP</th>
                      <th className="p-2">Type</th>
                      <th className="p-2">Protocol / Action</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border font-mono text-[11px]">
                    {siemEvents
                      .filter((ev) => ev.source.includes(siemSearch) || ev.type.toLowerCase().includes(siemSearch.toLowerCase()))
                      .map((ev) => (
                        <tr key={ev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="p-2 font-bold text-foreground">{ev.id}</td>
                          <td className="p-2">{ev.source}</td>
                          <td className="p-2 font-sans">{ev.type}</td>
                          <td className="p-2">{ev.proto}</td>
                          <td className="p-2">
                            <Badge className={ev.status === "Clean" || ev.status === "Authorized" ? "bg-emerald-100 text-emerald-800 text-[10px]" : "bg-amber-100 text-amber-800 text-[10px]"}>
                              {ev.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  toast.success("Triggered SOAR Automated IP Containment Playbook!");
                }}
                className="gap-1 text-xs cursor-pointer"
              >
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                Trigger SOAR Playbook
              </Button>
              <Button size="sm" onClick={() => setIsSiemConsoleOpen(false)} className="cursor-pointer">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Key Management HSM Vault Modal */}
        <Dialog open={isKeyManagementOpen} onOpenChange={setIsKeyManagementOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-blue-600" />
                Hardware Security Module (HSM) Key Vault
              </DialogTitle>
              <DialogDescription>
                ECC Secp256r1 & AES-256-GCM cryptographic keys management
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-1.5 border border-slate-800">
              <div className="text-emerald-400 font-bold">[HSM] Secure Boot Hardware Status: LOCKED</div>
              <div>[ROT] Root of Trust: ATECC608A Provisioned</div>
              <div>[KMS] Provider: AWS Key Management Service (US-East)</div>
              <div>[ALGO] Primary Cipher: AES-256-GCM / SHA-384</div>
              <div className="text-slate-400">[ROTATION] Last Key Rotation: {record.keyVaultLastRotation || "18 Jun 2024"}</div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  setIsKeyManagementOpen(false);
                  toast.success("Cryptographic keys rotated successfully in AWS KMS / HSM!", {
                    description: "Ephemeral tokens re-minted for all microservices.",
                  });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              >
                Rotate Keys Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 5. Document Preview Modal */}
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
                {selectedAttachment?.type} Document • {selectedAttachment?.size} • Uploaded by {selectedAttachment?.uploadedBy}
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
              <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Cryptographic Integrity Verified
              </div>
              <div className="text-slate-300">File: {selectedAttachment?.name}</div>
              <div className="text-slate-400 text-[11px]">
                SHA-256: 9b2d8f76a14e4b52c03d7e8293f18b45c71a34d6e9021873fb2a8c14e9512f47
              </div>
              <div className="text-slate-400 text-[11px]">Classification: Restricted Engineering Confidential</div>
              <div className="text-slate-400 text-[11px]">Compliance: ISO 27001 / OWASP ASVS v4.0</div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (selectedAttachment) {
                    triggerBrowserDownload(
                      selectedAttachment.name,
                      `=======================================================\nDOCUMENT: ${selectedAttachment.name}\nINTEGRITY SHA-256: 9b2d8f76a14e4b52c03d7e8293f18b45c71a34d6e9021873fb2a8c14e9512f47\nCLASSIFICATION: Restricted Engineering Confidential\nPROJECT: ${record.securityProjectName}\n=======================================================`
                    );
                    toast.success(`Downloading ${selectedAttachment.name}`);
                  }
                }}
                className="gap-1 text-xs cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download File
              </Button>
              <Button size="sm" onClick={() => setSelectedAttachment(null)} className="cursor-pointer">
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Upload Security Document Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload Security Document
              </DialogTitle>
              <DialogDescription>
                Attach STRIDE threat models, pen-test reports, or ISO audit certificates
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadSubmit} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-foreground">Document File Name *</label>
                <Input
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g. cloud_penetration_test_v2.pdf"
                  className="text-xs h-8"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-foreground">Document Category</label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-3 text-xs"
                >
                  <option value="Penetration Testing">Penetration Testing Report</option>
                  <option value="Threat Model">STRIDE Threat Model</option>
                  <option value="SBOM SPDX">SBOM SPDX Specification</option>
                  <option value="Architecture Blueprint">Security Architecture Blueprint</option>
                  <option value="Compliance Certificate">ISO / NIST Compliance Certificate</option>
                </select>
              </div>
              <div>
                <label className="font-semibold block mb-1 text-foreground">Uploaded By</label>
                <Input
                  value={uploadUploader}
                  onChange={(e) => setUploadUploader(e.target.value)}
                  className="text-xs h-8"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button size="sm" type="button" variant="outline" onClick={() => setIsUploadOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  Upload Document
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 7. Add Reviewer Modal */}
        <Dialog open={isAddReviewerOpen} onOpenChange={setIsAddReviewerOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-600" />
                Add Review Board Member
              </DialogTitle>
              <DialogDescription>
                Invite an architect or manager to review this cybersecurity specification
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddReviewer} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1 text-foreground">Reviewer Full Name *</label>
                <Input
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  placeholder="e.g. Priya Sundaram"
                  className="text-xs h-8"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1 text-foreground">Engineering Role *</label>
                <Input
                  value={newReviewerRole}
                  onChange={(e) => setNewReviewerRole(e.target.value)}
                  placeholder="e.g. Lead Cryptography Engineer"
                  className="text-xs h-8"
                  required
                />
              </div>
              <DialogFooter className="pt-2">
                <Button size="sm" type="button" variant="outline" onClick={() => setIsAddReviewerOpen(false)} className="cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                  Add Member
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 8. Linked Entity Details Modal */}
        <Dialog open={!!linkedEntityModal} onOpenChange={(open) => !open && setLinkedEntityModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                {linkedEntityModal?.type} Entity
              </DialogTitle>
              <DialogDescription>
                Linked enterprise artifact reference details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold">Entity ID</span>
                <span className="font-bold text-foreground font-mono text-sm block">{linkedEntityModal?.id}</span>
                <span className="text-muted-foreground block font-medium pt-1">{linkedEntityModal?.title}</span>
              </div>
              <div className="text-[11px] text-muted-foreground">
                This entity is integrated into the secure-by-design pipeline. Changes to threat models or zero-trust boundaries automatically sync with this module.
              </div>
            </div>
            <DialogFooter className="flex justify-between items-center sm:justify-between">
              <Button size="sm" variant="outline" onClick={() => setLinkedEntityModal(null)} className="cursor-pointer">
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (linkedEntityModal?.route) {
                    navigate({ to: linkedEntityModal.route as any });
                  }
                  setLinkedEntityModal(null);
                }}
                className="bg-primary text-white gap-1.5 cursor-pointer"
              >
                <span>Open Module</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default CybersecurityEngineeringNewPage;
