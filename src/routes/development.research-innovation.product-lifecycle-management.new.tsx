import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import {
  Repeat,
  Download,
  Upload,
  Save,
  Send,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  Eye,
  Plus,
  Sparkles,
  FileSpreadsheet,
  MoreHorizontal,
  Layers,
  Check,
  X,
  Clock,
  Printer,
  History as HistoryIcon,
  Workflow,
  ArrowRight,
  ShieldCheck,
  Box,
  Zap,
  Activity,
  Calendar,
  Share2,
  FileText,
  Wrench,
  Cpu,
  Factory,
  Paperclip,
  UserCheck,
  Building2,
  LifeBuoy,
  Target,
  FileArchive,
  ChevronDown,
  Trash2,
  SlidersHorizontal,
  User,
  FileCheck,
} from "lucide-react";

import { plmService } from "@/services/plmService";
import type {
  PlmApprovalDecision,
  PlmFormInput,
  PlmRecord,
  PlmChecklistItem,
  PlmAttachment,
  PlmReviewer,
} from "@/services/types";
import { ResearchInnovationTabBar, InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { PlmTabBar, type PlmTabId } from "@/components/erp/PlmTabBar";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
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
import { cn } from "@/lib/utils";

/* ===========================================================================
   Browser Download Helper
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
   Routes & Top-Level Exports
   =========================================================================== */
export const Route = createFileRoute(
  "/development/research-innovation/product-lifecycle-management/new"
)({
  component: () => <Navigate to="/development/research-innovation/overview" replace />,
});

export function ProductLifecycleManagementPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <PlmPage {...props} />;
}

export function ProductLifecycleManagementNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <PlmPage {...props} />;
}

export function PlmFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <PlmPage {...props} />;
}

/* ===========================================================================
   Circular Score Gauge Helper
   =========================================================================== */
function CircularScoreGauge({
  score,
  size = 72,
  strokeWidth = 6,
  color = "#10B981",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800 fill-none"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            className="fill-none transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold font-mono text-foreground leading-none">{score}%</span>
        </div>
      </div>
    </div>
  );
}

/* File Icon Selector helper */
function getFileIcon(type?: string, name?: string) {
  const n = (name || type || "").toLowerCase();
  if (n.endsWith(".zip") || n.endsWith(".tar") || n.endsWith(".gz")) {
    return <FileArchive className="h-4 w-4 text-amber-500 shrink-0" />;
  }
  if (n.endsWith(".xlsx") || n.endsWith(".csv") || n.endsWith(".xls")) {
    return <FileSpreadsheet className="h-4 w-4 text-emerald-500 shrink-0" />;
  }
  if (n.endsWith(".pdf")) {
    return <FileText className="h-4 w-4 text-red-500 shrink-0" />;
  }
  return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
}

/* ===========================================================================
   Main Component: PlmPage
   =========================================================================== */
export function PlmPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PlmTabId>("all");

  // Dialog & Modal States
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEcrModal, setShowEcrModal] = useState(false);
  const [showEcoModal, setShowEcoModal] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAuditLogDrawer, setShowAuditLogDrawer] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showAiReportModal, setShowAiReportModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<PlmAttachment | null>(null);

  // New ECR / ECO input states
  const [newEcrTitle, setNewEcrTitle] = useState("Thermal Heat Dissipation Revision");
  const [newEcrReason, setNewEcrReason] = useState("Upgrade thermal heatsink compound to reduce operating temperature by 6°C under peak EV load.");
  const [newEcoPlan, setNewEcoPlan] = useState("Update BOM to BOM-7KW-V1.3, update production assembly line SOP.");

  // New file upload state
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Engineering");
  const [uploadFileSize, setUploadFileSize] = useState("3.2 MB");

  // New Reviewer Form State
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerRole, setNewReviewerRole] = useState("");

  // Linked Entity Inspection Modal
  const [linkedEntityModal, setLinkedEntityModal] = useState<{
    type: string;
    id: string;
    title: string;
    route: string;
  } | null>(null);

  // Main Data Query
  const { data: serverRecord, isLoading } = useQuery({
    queryKey: ["plm-record"],
    queryFn: plmService.fetchRecord,
  });

  // Local record state for instant interactive updates
  const [localRecord, setLocalRecord] = useState<PlmRecord | null>(null);

  // Sync serverRecord initially
  React.useEffect(() => {
    if (serverRecord && !localRecord) {
      setLocalRecord(serverRecord);
    }
  }, [serverRecord, localRecord]);

  const rec = localRecord || serverRecord;

  // Local Form state
  const [formData, setFormData] = useState<Partial<PlmFormInput>>({
    plmProjectName: "",
    productName: "",
    productCategory: "",
    productFamily: "",
    productVersion: "",
    businessUnit: "",
    productDescription: "",
    productPriority: "High",
    productConfigurationId: "",
    bomVersion: "",
    hardwareVersion: "",
    firmwareVersion: "",
    softwareVersion: "",
    configurationBaseline: "",
    ecrNumber: "",
    ecoNumber: "",
    revisionNumber: "",
    productChangeSummary: "",
    obsolescenceRisk: "Medium",
    endOfLifePlan: "Planned for FY2031",
    approvalDecision: "Approved",
    reviewComments: "Product lifecycle is aligned and ready to proceed.",
    approvalDate: "18 Jun 2024",
    recommendation: "Continue Lifecycle",
  });

  // Keep form data aligned with record
  React.useEffect(() => {
    if (rec) {
      setFormData((prev) => ({
        ...prev,
        plmProjectName: rec.plmProjectName,
        productName: rec.productName,
        productCategory: rec.productCategory,
        productFamily: rec.productFamily,
        productVersion: rec.productVersion,
        businessUnit: rec.businessUnit,
        productDescription: rec.productDescription,
        productPriority: rec.productPriority,
        productConfigurationId: rec.productConfigurationId,
        bomVersion: rec.bomVersion,
        hardwareVersion: rec.hardwareVersion,
        firmwareVersion: rec.firmwareVersion,
        softwareVersion: rec.softwareVersion,
        configurationBaseline: rec.configurationBaseline,
        ecrNumber: rec.ecrNumber,
        ecoNumber: rec.ecoNumber,
        revisionNumber: rec.revisionNumber,
        productChangeSummary: rec.productChangeSummary,
        obsolescenceRisk: rec.obsolescenceRisk,
        endOfLifePlan: rec.endOfLifePlan,
        approvalDecision: rec.approvalDecision,
        reviewComments: rec.reviewComments,
        approvalDate: rec.approvalDate,
        recommendation: rec.recommendation,
      }));
    }
  }, [rec]);

  // Tab change handler with card scroll & filter support
  const handleTabChange = (key: PlmTabId) => {
    setActiveTab(key);
    if (key !== "all") {
      const el = document.getElementById(key);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  // Helper to determine if a card should render based on activeTab
  const shouldShow = (cardId: PlmTabId) => activeTab === "all" || activeTab === cardId;

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<PlmFormInput>) => plmService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["plm-record"], updated);
      setLocalRecord(updated);
      toast.success("Draft saved successfully.", {
        description: "PLM configuration, lifecycle readiness, and ECR/ECO changes recorded.",
      });
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: () => plmService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["plm-record"], updated);
      setLocalRecord(updated);
      toast.success("PLM Report submitted for Executive Board Review (Stage 4).");
    },
    onError: (err: any) => toast.error(`Submission failed: ${err.message}`),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: PlmApprovalDecision;
      comments?: string;
    }) => plmService.reviewDecision(args),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["plm-record"], updated);
      setLocalRecord(updated);
      if (variables.decision === "Approved") {
        toast.success("PLM REPORT APPROVED! Product lifecycle active and continued.");
      } else if (variables.decision === "Approved with Conditions") {
        toast.info("Approved with Conditions. Minor lifecycle improvements requested.");
      } else if (variables.decision === "Revision Required") {
        toast.warning("Revision Requested. Returned for engineering review.");
      } else if (variables.decision === "End-of-Life Approved") {
        toast.warning("END-OF-LIFE APPROVED! Product retirement process initiated.");
      } else {
        toast.error("PLM Record Rejected & Archived.");
      }
    },
    onError: (err: any) => toast.error(`Executive Review failed: ${err.message}`),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: 1 | 2 | 3 | 4) => plmService.advanceStage(targetStage),
    onSuccess: (updated, targetStage) => {
      queryClient.setQueryData(["plm-record"], updated);
      setLocalRecord(updated);
      toast.success(`PLM stage set to Stage ${targetStage}`);
    },
  });

  // Action: Interactive Workflow Status Dropdown
  const handleStatusChange = (newStatus: string) => {
    if (!rec) return;
    const updated: PlmRecord = {
      ...rec,
      workflowStatus: newStatus as any,
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["plm-record"], updated);
    toast.success(`Workflow status updated to '${newStatus}'`);
  };

  // Action: Toggle Checklist Controls
  const toggleChecklist = (section: "engineering" | "manufacturing" | "service", itemId: string) => {
    if (!rec) return;
    let listKey: "engineeringChecklist" | "manufacturingChecklist" | "serviceChecklist" = "engineeringChecklist";
    if (section === "manufacturing") listKey = "manufacturingChecklist";
    if (section === "service") listKey = "serviceChecklist";

    const updatedList = rec[listKey].map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updated: PlmRecord = {
      ...rec,
      [listKey]: updatedList,
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["plm-record"], updated);
    toast.success("Lifecycle deliverable updated.");
  };

  // Action: Add New Attachment
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rec) return;
    const filename = uploadFileName.trim() ? uploadFileName.trim() : "plm_lifecycle_package.pdf";
    const newAtt: PlmAttachment = {
      id: `att-${Date.now()}`,
      name: filename.includes(".") ? filename : `${filename}.pdf`,
      size: uploadFileSize,
      type: filename.endsWith(".xlsx") ? "Excel" : filename.endsWith(".zip") ? "Archive" : "PDF",
      url: "#",
    };

    const updated: PlmRecord = {
      ...rec,
      attachments: [newAtt, ...rec.attachments],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["plm-record"], updated);
    setShowUploadDialog(false);
    setUploadFileName("");
    toast.success(`Uploaded "${newAtt.name}" successfully!`, {
      description: "Appended to Product Digital Thread Documentation.",
    });
  };

  // Action: Delete Attachment
  const handleDeleteAttachment = (id: string, name: string) => {
    if (!rec) return;
    const updated: PlmRecord = {
      ...rec,
      attachments: rec.attachments.filter((a) => a.id !== id),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["plm-record"], updated);
    toast.success(`Deleted attachment: ${name}`);
  };

  // Action: Add Board Reviewer
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerRole.trim() || !rec) {
      toast.error("Please enter reviewer name and role");
      return;
    }
    const newRev: PlmReviewer = {
      id: `rev-${Date.now()}`,
      role: newReviewerRole,
      person: newReviewerName,
      decision: "Pending",
      date: "-",
      comments: "Pending review",
      status: "In Progress",
    };

    const updated: PlmRecord = {
      ...rec,
      reviewers: [...rec.reviewers, newRev],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["plm-record"], updated);
    setShowAddReviewerModal(false);
    setNewReviewerName("");
    setNewReviewerRole("");
    toast.success(`Added ${newRev.person} to Executive Board`);
  };

  // Action: Export Full Dossier (.TXT)
  const handleExportDossier = () => {
    if (!rec) return;
    const content = `====================================================================
PRODUCT LIFECYCLE MANAGEMENT (PLM) DIGITAL THREAD DOSSIER
====================================================================
Project Name: ${rec.plmProjectName}
Product Name: ${rec.productName}
Model ID: ${rec.plmId}
Form Code: ${rec.formCode}
Product Version: ${rec.productVersion}
Lifecycle Stage: ${rec.lifecycleStage}
Workflow Status: ${rec.workflowStatus}
Product Owner: ${rec.productOwner.name}
Lifecycle Manager: ${rec.lifecycleManager.name}
Business Unit: ${rec.businessUnit}
Date: ${rec.createdDate}

1. OVERALL PRODUCT HEALTH SCORE
--------------------------------------------------------------------
Overall Score: ${rec.overallProductHealthScore}%
Recommendation: ${rec.recommendation}
1. Engineering Readiness: ${rec.engineeringScore}%
2. Manufacturing Readiness: ${rec.manufacturingScore}%
3. Service Readiness: ${rec.serviceScore}%
4. Lifecycle Risk: ${rec.riskScore}%

2. CONFIGURATION BASELINE
--------------------------------------------------------------------
Configuration ID: ${rec.productConfigurationId}
BOM Version: ${rec.bomVersion}
Hardware: ${rec.hardwareVersion}
Firmware: ${rec.firmwareVersion}
Software: ${rec.softwareVersion}
Baseline: ${rec.configurationBaseline}

3. CHANGE & OBSOLESCENCE MANAGEMENT
--------------------------------------------------------------------
ECR Number: ${rec.ecrNumber}
ECO Number: ${rec.ecoNumber}
Revision: ${rec.revisionNumber}
Obsolescence Risk: ${rec.obsolescenceRisk}
End-of-Life Plan: ${rec.endOfLifePlan}
Summary: ${rec.productChangeSummary}

4. DIGITAL THREAD ATTACHMENTS (${rec.attachments.length} Files)
--------------------------------------------------------------------
${rec.attachments.map((a, i) => `${i + 1}. ${a.name} (${a.size})`).join("\n")}

5. EXECUTIVE BOARD 5-WAY DECISION
--------------------------------------------------------------------
${rec.reviewers.map((r, i) => `${i + 1}. [${r.decision}] ${r.role} - ${r.person}: ${r.comments} (${r.date})`).join("\n")}
====================================================================`;

    triggerBrowserDownload(`${rec.plmId}_plm_dossier.txt`, content, "text/plain;charset=utf-8");
    toast.success("PLM Dossier downloaded successfully!");
  };

  // Action: Export Lifecycle Stage Timeline CSV
  const handleExportTimelineCSV = () => {
    if (!rec) return;
    const csvRows = [
      ["Milestone ID", "Title", "Date", "Status"],
      ...rec.lifecycleTimeline.map((m) => [m.id, m.title, m.date, m.completed ? "Completed" : "Pending"]),
    ];
    const csvContent = csvRows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    triggerBrowserDownload(`${rec.plmId}_milestone_timeline.csv`, csvContent, "text/csv;charset=utf-8");
    toast.success("Exported milestone timeline to CSV!");
  };

  if (isLoading || !rec) {
    return (
      <AppShell
        title="Product Lifecycle Management (PLM)"
        breadcrumb={breadcrumb ?? "Development > Research & Innovation > Product Lifecycle Management"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="flex h-96 w-full items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading Product Lifecycle Management Workspace...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Product Lifecycle Management (PLM)"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Product Lifecycle Management"}
      description="Manage digital thread traceability, ECO/ECN change control, BOM revisions, and End-of-Life sunsetting."
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="space-y-5 pb-16">
        {/* ====================================================================
           1. TOP RECORD HEADER BAR: Title, Version, Status Dropdown & Actions
           ==================================================================== */}
        <div className="mx-auto max-w-[1600px] px-4 pt-2">
          <Card className="border border-border/80 shadow-2xs bg-card overflow-hidden rounded-xl">
            {/* Top Row: Record Identity & Action Buttons */}
            <div className="p-4 sm:p-5 pb-4 bg-slate-50/70 dark:bg-slate-900/90 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50 shadow-2xs">
                  <Layers className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/60">
                      {rec.plmId}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <Badge variant="outline" className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800">
                      {rec.formCode}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                      {rec.productVersion}
                    </Badge>

                    {/* Interactive Workflow Status Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-primary",
                            rec.workflowStatus === "Approved"
                              ? "bg-emerald-600 text-white hover:bg-emerald-700"
                              : rec.workflowStatus === "Approved with Conditions"
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : rec.workflowStatus === "In Review" || rec.workflowStatus === "Executive Review"
                              ? "bg-primary text-white hover:bg-primary"
                              : rec.workflowStatus === "End-of-Life Approved"
                              ? "bg-rose-600 text-white hover:bg-rose-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          )}
                        >
                          <span>{rec.workflowStatus}</span>
                          <ChevronDown className="h-3 w-3 opacity-80" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-52">
                        <DropdownMenuItem onClick={() => handleStatusChange("In Progress")} className="cursor-pointer">
                          <Clock className="mr-2 h-3.5 w-3.5 text-blue-500" /> In Progress
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Executive Review")} className="cursor-pointer">
                          <Eye className="mr-2 h-3.5 w-3.5 text-blue-600" /> Executive Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Approved")} className="cursor-pointer">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Approved with Conditions")} className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-3.5 w-3.5 text-amber-500" /> Approved with Conditions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Revision Required")} className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-3.5 w-3.5 text-rose-500" /> Revision Required
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("End-of-Life Approved")} className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-3.5 w-3.5 text-rose-600" /> End-of-Life Approved
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Project Title Input */}
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={formData.plmProjectName || rec.plmProjectName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, plmProjectName: e.target.value }))}
                      title={formData.plmProjectName || rec.plmProjectName}
                      className="h-8 text-base sm:text-lg font-bold text-foreground bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary shadow-none px-2 py-0 transition-all rounded-md w-full min-w-0"
                      placeholder="Product Lifecycle Project Name..."
                    />
                  </div>
                </div>
              </div>

              {/* Top Actions */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWorkflowModal(true)}
                  className="gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Workflow className="h-3.5 w-3.5 text-blue-600" />
                  <span className="hidden lg:inline">PLM Lifecycle</span> Diagram
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => saveDraftMutation.mutate(formData)}
                  disabled={saveDraftMutation.isPending}
                  className="gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  {saveDraftMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />}
                  Save Draft
                </Button>
                <Button
                  size="sm"
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending}
                  className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold cursor-pointer"
                >
                  {submitMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Submit for Review
                </Button>

                {/* More Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-slate-800 shadow-2xs cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 text-xs shadow-lg">
                    <DropdownMenuItem onClick={() => setShowConfigModal(true)} className="gap-2 cursor-pointer">
                      <Box className="h-4 w-4 text-blue-600" />
                      View Product Configuration
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEcrModal(true)} className="gap-2 cursor-pointer">
                      <Wrench className="h-4 w-4 text-amber-600" />
                      Create Engineering Change (ECR)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowEcoModal(true)} className="gap-2 cursor-pointer">
                      <FileCheck className="h-4 w-4 text-emerald-600" />
                      Create Change Order (ECO)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAiReportModal(true)} className="gap-2 cursor-pointer">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Generate AI Lifecycle Report
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleExportDossier} className="gap-2 cursor-pointer">
                      <Download className="h-4 w-4 text-primary" />
                      Export Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportTimelineCSV} className="gap-2 cursor-pointer">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      Export Timeline CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.print()} className="gap-2 cursor-pointer">
                      <Printer className="h-4 w-4 text-slate-600" />
                      Print / Export PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("PLM record link copied to clipboard!");
                      }}
                      className="gap-2 cursor-pointer"
                    >
                      <Share2 className="h-4 w-4 text-slate-600" />
                      Share Link
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAuditLogDrawer(true)} className="gap-2 cursor-pointer">
                      <HistoryIcon className="h-4 w-4 text-slate-600" />
                      View Audit Log
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Bottom Row: Key-Value Structured Metadata Ribbon with Functional Modals */}
            <div className="px-4 py-2.5 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 text-xs divide-y sm:divide-y-0 sm:divide-x divide-border/60">
              {/* Linked Product */}
              <div className="flex flex-col gap-0.5 sm:pr-2">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Box className="h-3 w-3 text-blue-500" /> Linked Product
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Product Portfolio",
                      id: "PRD-2024-0015",
                      title: rec.linkedProduct.name,
                      route: "/development/product-development",
                    })
                  }
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
                >
                  <span className="truncate">{rec.linkedProduct.name}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                </button>
              </div>

              {/* Product Owner */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <User className="h-3 w-3 text-slate-400" /> Product Owner
                </span>
                <span className="font-semibold text-foreground truncate">{rec.productOwner.name}</span>
              </div>

              {/* Lifecycle Manager */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-emerald-500" /> Lifecycle Manager
                </span>
                <span className="font-semibold text-foreground truncate">{rec.lifecycleManager.name}</span>
              </div>

              {/* Business Unit */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Building2 className="h-3 w-3 text-slate-400" /> Business Unit
                </span>
                <span className="font-semibold text-foreground truncate">{rec.businessUnit}</span>
              </div>

              {/* Category / Family */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium">Category / Family</span>
                <span className="font-medium text-foreground truncate">
                  {rec.productCategory} <span className="text-muted-foreground">({rec.productFamily})</span>
                </span>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium">Priority</span>
                <div>
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold px-1.5 py-0 text-[10px] border-amber-300">
                    {rec.productPriority}
                  </Badge>
                </div>
              </div>

              {/* Created On */}
              <div className="flex flex-col gap-0.5 sm:pl-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-slate-400" /> Created On
                </span>
                <span className="font-medium text-slate-600 dark:text-slate-400 truncate">{rec.createdOn}</span>
              </div>
            </div>
          </Card>

          {/* 4-Stage Stepper Bar */}
          <div className="mt-3 rounded-xl border border-blue-200/60 bg-blue-50/40 dark:bg-blue-950/20 p-3 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  4-Stage PLM Digital Thread Workflow
                </span>
              </div>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Current Stage: <strong className="font-bold">{rec.workflowStageLabel}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              {[
                { stage: 1, label: "Stage 1: Config Mgmt", sub: "BOM & HW/FW baseline", icon: Box },
                { stage: 2, label: "Stage 2: Lifecycle Assess", sub: "Eng, Mfg & Service readiness", icon: Activity },
                { stage: 3, label: "Stage 3: ECR / ECO Mgmt", sub: "Evaluate revision changes", icon: Wrench },
                { stage: 4, label: "Stage 4: Executive Board", sub: "5-Way outcome decision", icon: ShieldCheck },
              ].map((s) => {
                const isCurrent = rec.stage === s.stage;
                const isDone = rec.stage > s.stage;
                const Icon = s.icon;
                return (
                  <button
                    key={s.stage}
                    type="button"
                    onClick={() => advanceStageMutation.mutate(s.stage as any)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl p-2.5 text-left border transition-all cursor-pointer",
                      isCurrent
                        ? "bg-white dark:bg-slate-900 border-blue-500 shadow-xs ring-2 ring-blue-500/20"
                        : isDone
                        ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                        : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                        isCurrent
                          ? "bg-blue-600 text-white shadow-xs"
                          : isDone
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                      )}
                    >
                      {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{s.label}</span>
                        {isDone && <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Done</span>}
                      </div>
                      <p className="text-[10px] text-muted-foreground truncate">{s.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ====================================================================
           2. SUBMODULE TAB BAR
           ==================================================================== */}
        <div className="mx-auto max-w-[1600px] px-4">
          <PlmTabBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            scores={{
              configuration: rec.configurationScore,
              engineering: rec.engineeringScore,
              manufacturing: rec.manufacturingScore,
              service: rec.serviceScore,
              risk: rec.riskScore,
              ai: rec.aiLifecycleScore,
              overall: rec.overallProductHealthScore,
            }}
            attachmentsCount={rec.attachments.length}
            status={rec.workflowStatus}
          />
        </div>

        {/* Scores & Health Gauges Banner */}
        <div className="mx-auto max-w-[1600px] px-4 space-y-6">
          <ProductScoreBanner submoduleKey="product-lifecycle-management" />

          {/* ====================================================================
             4. BALANCED 2-COLUMN GRID (Equal Height, Perfectly Aligned)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* PANEL 1: Product Lifecycle Overview */}
            {shouldShow("overview") && (
              <Card id="overview" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Repeat className="h-4 w-4 text-blue-600" />
                      Product Lifecycle Overview
                    </CardTitle>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-200 text-xs">
                      {rec.productStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.productName || rec.productName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Product Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.productCategory || rec.productCategory}
                        onChange={(e) => setFormData((prev) => ({ ...prev, productCategory: e.target.value }))}
                        className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-semibold cursor-pointer"
                      >
                        <option value="AC EV Charger">AC EV Charger</option>
                        <option value="DC Fast Charger">DC Fast Charger</option>
                        <option value="Industrial Energy Storage">Industrial Energy Storage</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Product Family <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.productFamily || rec.productFamily}
                        onChange={(e) => setFormData((prev) => ({ ...prev, productFamily: e.target.value }))}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Business Unit <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.businessUnit || rec.businessUnit}
                        onChange={(e) => setFormData((prev) => ({ ...prev, businessUnit: e.target.value }))}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Lifecycle Stage
                      </label>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold border-amber-200">
                        {rec.lifecycleStage}
                      </Badge>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Product Status
                      </label>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-200">
                        {rec.productStatus}
                      </Badge>
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Priority
                      </label>
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold border-red-200">
                        {rec.productPriority}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                      Product Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      rows={2}
                      value={formData.productDescription || rec.productDescription}
                      onChange={(e) => setFormData((prev) => ({ ...prev, productDescription: e.target.value }))}
                      className="text-xs resize-none"
                    />
                  </div>

                  {/* Product Technical Specs Summary Card */}
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 mt-auto">
                    <div className="flex items-center justify-between pb-1 border-b border-border/60">
                      <div className="flex items-center gap-1.5">
                        <Box className="h-3.5 w-3.5 text-blue-600" />
                        <span className="font-bold text-slate-900 dark:text-white text-xs">Smart EV Charger AC 7kW</span>
                        <span className="text-[10px] font-mono text-muted-foreground">(Model: AC-7KW-EVSE-V1.2)</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono font-semibold bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300">
                        Active Spec
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                      <div>
                        <span className="text-muted-foreground block">Power</span>
                        <span className="font-bold text-foreground">7.4 kW @ 32A</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Protocol</span>
                        <span className="font-bold text-foreground">OCPP 1.6J/2.0.1</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Connectivity</span>
                        <span className="font-bold text-foreground">Wi-Fi, 4G, BLE</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block">Ingress</span>
                        <span className="font-bold text-foreground">IP65 / IK10</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PANEL 2: Product Configuration Management */}
            {shouldShow("configuration") && (
              <Card id="configuration" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Box className="h-4 w-4 text-blue-600" />
                      Product Configuration Management
                    </CardTitle>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                      Baseline v1.2
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Product Configuration ID</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">{rec.productConfigurationId}</span>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">BOM Version</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">{rec.bomVersion}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                      <span className="text-muted-foreground block font-medium text-[10px]">Hardware</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-bold text-xs mt-0.5 block">{rec.hardwareVersion}</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                      <span className="text-muted-foreground block font-medium text-[10px]">Firmware</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-bold text-xs mt-0.5 block">{rec.firmwareVersion}</span>
                    </div>
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center">
                      <span className="text-muted-foreground block font-medium text-[10px]">Software</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200 font-bold text-xs mt-0.5 block">{rec.softwareVersion}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                    <span className="text-muted-foreground block font-medium text-[10px]">Configuration Baseline</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400 text-xs mt-0.5 block">{rec.configurationBaseline}</span>
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Configuration Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.configurationScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PANEL 3: Engineering Lifecycle */}
            {shouldShow("engineering") && (
              <Card id="engineering" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-blue-600" />
                      Engineering Lifecycle
                    </CardTitle>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                      6 Deliverables
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs flex-1">
                  <div className="space-y-2">
                    {rec.engineeringChecklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklist("engineering", item.id)}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                              item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                            )}
                          >
                            {item.completed && <Check className="h-3 w-3" />}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                          {item.sourceStream}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Engineering Readiness Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.engineeringScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PANEL 4: Manufacturing Lifecycle */}
            {shouldShow("manufacturing") && (
              <Card id="manufacturing" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Factory className="h-4 w-4 text-blue-600" />
                      Manufacturing Lifecycle
                    </CardTitle>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                      6 Deliverables
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs flex-1">
                  <div className="space-y-2">
                    {rec.manufacturingChecklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklist("manufacturing", item.id)}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                              item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                            )}
                          >
                            {item.completed && <Check className="h-3 w-3" />}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                          {item.sourceStream}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Manufacturing Lifecycle Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.manufacturingScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PANEL 5: Service & Support Lifecycle */}
            {shouldShow("service_support") && (
              <Card id="service_support" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <LifeBuoy className="h-4 w-4 text-blue-600" />
                      Service & Support Lifecycle
                    </CardTitle>
                    <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                      5 Deliverables
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-3 text-xs flex-1">
                  <div className="space-y-2">
                    {rec.serviceChecklist.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleChecklist("service", item.id)}
                        className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors",
                              item.completed ? "bg-emerald-600 text-white" : "border border-slate-300 dark:border-slate-600"
                            )}
                          >
                            {item.completed && <Check className="h-3 w-3" />}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono bg-slate-200/60 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                          {item.sourceStream}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Service Lifecycle Score
                    </span>
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.serviceScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* PANEL 6: Change & Obsolescence Management */}
            {shouldShow("change_management") && (
              <Card id="change_management" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col scroll-mt-24">
                <CardHeader className="pb-3 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-blue-600" />
                      Change & Obsolescence Management
                    </CardTitle>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold border-amber-200">
                      Obsolescence Risk: {rec.obsolescenceRisk}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4 text-xs flex-1">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px] mb-1">ECR</span>
                      <button
                        type="button"
                        onClick={() => setShowEcrModal(true)}
                        className="inline-flex items-center gap-1 font-mono font-bold text-blue-700 dark:text-blue-300 text-xs cursor-pointer hover:underline"
                      >
                        {rec.ecrNumber}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px] mb-1">ECO</span>
                      <button
                        type="button"
                        onClick={() => setShowEcoModal(true)}
                        className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs cursor-pointer hover:underline"
                      >
                        {rec.ecoNumber}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="p-2 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px] mb-1">Revision</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs">{rec.revisionNumber}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">Obsolescence Risk</span>
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold border-amber-200 mt-0.5">
                        {rec.obsolescenceRisk}
                      </Badge>
                    </div>
                    <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="text-muted-foreground block font-medium text-[10px]">End-of-Life Plan</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs mt-0.5 block">{rec.endOfLifePlan}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-medium mb-1 text-[10px]">Product Change Summary</span>
                    <p className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      {rec.productChangeSummary}
                    </p>
                  </div>

                  <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-lg flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                        Lifecycle Risk Score
                      </span>
                      <span className="text-[10px] text-muted-foreground">Monitored thermal revision change.</span>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-md font-bold text-sm font-mono">
                      <span>{rec.riskScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ====================================================================
             5. AI LIFECYCLE ASSESSMENT (Full Width)
             ==================================================================== */}
          {shouldShow("ai_assessment") && (
            <Card id="ai_assessment" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Lifecycle Assessment
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-primary dark:bg-blue-950/60 dark:text-blue-300 gap-1 border-blue-200 font-semibold text-xs">
                      <Sparkles className="h-3 w-3 text-primary" />
                      AI Digital Thread Assessment
                    </Badge>
                    <Badge className="bg-emerald-600 text-white font-mono text-xs font-semibold">
                      AI Lifecycle Score: {rec.aiLifecycleScore}/100
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Product Health Analysis</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{rec.aiProductHealthAnalysis}</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Lifecycle Prediction</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{rec.aiLifecyclePrediction}</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Obsolescence Prediction</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{rec.aiObsolescencePrediction}</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-center space-y-1">
                    <span className="text-muted-foreground block text-[10px]">AI Reliability Forecast</span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{rec.aiReliabilityForecast}</span>
                  </div>

                  <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 text-center space-y-1">
                    <span className="text-blue-900 dark:text-blue-300 block text-[10px]">AI Improvement Suggestions</span>
                    <span className="text-xs font-bold text-primary dark:text-blue-300 block truncate" title={rec.aiImprovementSuggestions}>
                      {rec.aiImprovementSuggestions}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ====================================================================
             6. PRODUCT LIFECYCLE PROGRESSION & MILESTONE TIMELINE (Full Width)
             ==================================================================== */}
          {shouldShow("summary") && (
            <Card id="summary" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    Product Lifecycle Progression & Milestone Timeline
                  </CardTitle>
                  <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800 font-semibold">
                    Digital Thread Gauges
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                {/* Recommendation Strip */}
                <div className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Recommendation:</span>
                    <select
                      value={formData.recommendation || rec.recommendation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, recommendation: e.target.value }))}
                      className="h-8 rounded-md border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                    >
                      <option value="Continue Lifecycle">Continue Lifecycle</option>
                      <option value="Minor Improvements Required">Minor Improvements Required</option>
                      <option value="Initiate End-of-Life Plan">Initiate End-of-Life Plan</option>
                      <option value="Retire Product">Retire Product</option>
                    </select>
                  </div>
                  <span className="text-muted-foreground text-[11px]">
                    All 5 stream lifecycles aggregated. Product digital thread active.
                  </span>
                </div>

                {/* Symmetrical 2-Column Split: Lifecycle Stage Progress + Timeline */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  {/* Left Column: 12-Stage Lifecycle Progress */}
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                        Lifecycle Stage Progress (12 Stages)
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono">{rec.lifecycleStage} Active</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {rec.stageProgress.map((sp) => {
                        const isCurrent = sp.name === rec.lifecycleStage;
                        return (
                          <div key={sp.id} className="flex items-center justify-between p-2 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  sp.status === "Completed"
                                    ? "bg-emerald-500"
                                    : isCurrent
                                    ? "bg-amber-500 animate-pulse"
                                    : "bg-slate-300 dark:bg-slate-700"
                                )}
                              />
                              <span
                                className={cn(
                                  "font-semibold text-xs",
                                  isCurrent
                                    ? "text-amber-600 dark:text-amber-400 font-bold"
                                    : sp.status === "Completed"
                                    ? "text-slate-700 dark:text-slate-300"
                                    : "text-slate-400"
                                )}
                              >
                                {sp.name}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "text-[10px] font-mono",
                                isCurrent
                                  ? "text-amber-700 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded"
                                  : sp.status === "Completed"
                                  ? "text-emerald-600 dark:text-emerald-400 font-medium"
                                  : "text-slate-400"
                              )}
                            >
                              {sp.status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Lifecycle Milestone Timeline */}
                  <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                        <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                          Lifecycle Milestone Timeline
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">{rec.lifecycleTimeline.length} Events</Badge>
                      </div>
                      <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                        {rec.lifecycleTimeline.map((ms) => (
                          <div key={ms.id} className="relative flex flex-col">
                            <div
                              className={cn(
                                "absolute -left-4 top-1 h-3 w-3 rounded-full ring-4 ring-white dark:ring-slate-900",
                                ms.completed ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
                              )}
                            />
                            <div className="flex items-center justify-between">
                              <span className={cn("font-bold text-xs", ms.completed ? "text-slate-900 dark:text-white" : "text-slate-500")}>
                                {ms.title}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">{ms.date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 text-right border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => setShowTimelineModal(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        View Full Timeline <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ====================================================================
             7. ATTACHMENTS (Full Width)
             ==================================================================== */}
          {shouldShow("attachments") && (
            <Card id="attachments" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-blue-600" />
                    Attachments
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">{rec.attachments.length} Files</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowUploadDialog(true)}
                      className="gap-1.5 text-xs h-8 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5 text-blue-600" />
                      Upload Attachment
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {rec.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 transition-colors hover:bg-slate-100/60 dark:hover:bg-slate-800/80 group"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        {getFileIcon(att.type, att.name)}
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={att.name}>
                            {att.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{att.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedAttachment(att)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            triggerBrowserDownload(
                              att.name,
                              `=======================================================\nDOCUMENT: ${att.name}\nTYPE: ${att.type}\nSIZE: ${att.size}\nSECURITY HASH SHA-256: 4f7b2c9a1d8e3f6a5b2c7d1e0f9a8b4c\nPRODUCT BASELINE: ${rec.configurationBaseline}\nPROJECT: ${rec.plmProjectName} (${rec.plmId})\n=======================================================`
                            );
                            toast.success(`Downloaded ${att.name}`);
                          }}
                          className="p-1 text-slate-400 hover:text-emerald-600 transition-colors cursor-pointer"
                          title="Download Attachment"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(att.id, att.name)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Attachment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px]">8 of 8 PLM Lifecycle Documentation Files Verified</span>
                  <button
                    type="button"
                    onClick={() => setShowUploadDialog(true)}
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 cursor-pointer text-xs"
                  >
                    View All Attachments ({rec.attachments.length}) <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ====================================================================
             8. REVIEW & APPROVAL (Full Width)
             ==================================================================== */}
          {shouldShow("review_approval") && (
            <Card id="review_approval" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    Review & Approval
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold border-emerald-200">
                      Executive Review Board (5-Way Decision Engine)
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddReviewerModal(true)}
                      className="gap-1 text-xs h-7 cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      Add Reviewer
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-5 text-xs">
                {/* Reviewers Table */}
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                        <th className="p-3">Role</th>
                        <th className="p-3">Person</th>
                        <th className="p-3">Decision</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Comments</th>
                        <th className="p-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {rec.reviewers.map((rev) => (
                        <tr key={rev.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="p-3 font-semibold text-foreground">{rev.role}</td>
                          <td className="p-3 font-medium text-foreground">{rev.person}</td>
                          <td className="p-3">
                            {rev.decision === "Approved" ? (
                              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-[10px] font-bold">
                                Approved
                              </Badge>
                            ) : rev.decision === "Pending" ? (
                              <Badge variant="outline" className="text-[10px] font-medium text-slate-500">
                                Pending
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950/60 text-[10px] font-bold">
                                {rev.decision}
                              </Badge>
                            )}
                          </td>
                          <td className="p-3 text-muted-foreground">{rev.date}</td>
                          <td className="p-3 text-slate-700 dark:text-slate-300 font-mono text-[11px]">{rev.comments}</td>
                          <td className="p-3 text-center">
                            {rev.status === "Completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 inline-block" />
                            ) : (
                              <Clock className="h-4 w-4 text-slate-400 inline-block" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 5-Way Executive Decision Controls */}
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">
                    Submit Review Decision
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    <div className="md:col-span-4">
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                        Approval Decision (5 Outcomes) <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.approvalDecision || rec.approvalDecision}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            approvalDecision: e.target.value as PlmApprovalDecision,
                          }))
                        }
                        className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                      >
                        <option value="Approved">Approved (Continue Lifecycle)</option>
                        <option value="Approved with Conditions">Approved with Conditions (Minor Actions)</option>
                        <option value="Revision Required">Revision Required (Rework Plan)</option>
                        <option value="End-of-Life Approved">End-of-Life Approved (Initiate Retirement)</option>
                        <option value="Rejected">Rejected (Archive Record)</option>
                      </select>
                    </div>

                    <div className="md:col-span-5">
                      <div className="flex justify-between items-center mb-1">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                          Review Comments <span className="text-red-500">*</span>
                        </label>
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {(formData.reviewComments || rec.reviewComments || "").length}/2000
                        </span>
                      </div>
                      <Textarea
                        rows={2}
                        maxLength={2000}
                        value={formData.reviewComments || rec.reviewComments}
                        onChange={(e) => setFormData((prev) => ({ ...prev, reviewComments: e.target.value }))}
                        className="text-xs resize-none"
                      />
                    </div>

                    <div className="md:col-span-3 flex flex-col justify-between">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block text-[11px]">
                          Approval Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.approvalDate || rec.approvalDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, approvalDate: e.target.value }))}
                          className="h-8 text-xs"
                        />
                      </div>
                      <Button
                        className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-bold cursor-pointer"
                        onClick={() => {
                          const dec = formData.approvalDecision || rec.approvalDecision;
                          const com = formData.reviewComments || rec.reviewComments;
                          reviewMutation.mutate({
                            id: rec.id,
                            decision: dec,
                            comments: com,
                          });
                          // Also update board row locally
                          const updatedReviewers = rec.reviewers.map((r) =>
                            r.role === "Service Manager"
                              ? { ...r, decision: dec, comments: com, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), status: "Completed" as any }
                              : r
                          );
                          setLocalRecord({
                            ...rec,
                            reviewers: updatedReviewers,
                            workflowStatus: dec === "Approved" ? "Approved" : dec === "End-of-Life Approved" ? "End-of-Life Approved" : "In Review",
                          });
                        }}
                        disabled={reviewMutation.isPending}
                      >
                        Record Executive Decision
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* ====================================================================
             9. SYSTEM INFORMATION (Full Width)
             ==================================================================== */}
          {shouldShow("system_info") && (
            <Card id="system_info" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <HistoryIcon className="h-4 w-4 text-blue-600" />
                    System Information
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-mono">
                    Digital Thread Logged
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                  <div className="md:col-span-8 grid grid-cols-2 gap-y-3 gap-x-6">
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Created By</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.createdBy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Created Date</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{rec.createdDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Last Modified By</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.lastModifiedBy}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Last Modified Date</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{rec.lastModifiedDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Workflow Stage</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{rec.workflowStageLabel}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Product Version</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">{rec.productVersion}</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col justify-center space-y-2 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <button
                      type="button"
                      onClick={() => setShowAuditLogDrawer(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View Audit Log</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTimelineModal(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View Product Timeline</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowWorkflowModal(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View PLM Workflow</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* DIALOGS & MODALS */}
      {/* ===================================================================== */}

      {/* 1. Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload PLM Attachment
            </DialogTitle>
            <DialogDescription>
              Add engineering records, BOM configuration packages, or service manuals to the product digital thread.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full h-8 rounded-md border px-3 text-xs bg-background"
              >
                <option value="Engineering">Engineering Record</option>
                <option value="Configuration">Configuration Package</option>
                <option value="Manufacturing">Manufacturing Record</option>
                <option value="Service">Service Documentation</option>
                <option value="AI Report">AI Health Assessment</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">File Name *</label>
              <Input
                placeholder="e.g. bom_configuration_v1.2.zip"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Simulated Size</label>
              <Input
                value={uploadFileSize}
                onChange={(e) => setUploadFileSize(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowUploadDialog(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Upload File
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. Document Preview Modal */}
      <Dialog open={!!selectedAttachment} onOpenChange={(open) => !open && setSelectedAttachment(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              {selectedAttachment?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedAttachment?.type} File • {selectedAttachment?.size} • Verified Product Digital Thread Asset
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> PLM Digital Thread Verified
            </div>
            <div className="text-slate-300">File: {selectedAttachment?.name}</div>
            <div className="text-slate-400 text-[11px]">
              SHA-256: 4f7b2c9a1d8e3f6a5b2c7d1e0f9a8b4c2e6d1a9b8c7d6e5f4a3b2c1d0e9f8a7b
            </div>
            <div className="text-slate-400 text-[11px]">Configuration Baseline: {rec.configurationBaseline}</div>
            <div className="text-slate-400 text-[11px]">Digital Thread Hash: CFG-SMART-AC-7KW::BOM-7KW-V1.2</div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (selectedAttachment) {
                  triggerBrowserDownload(
                    selectedAttachment.name,
                    `=======================================================\nDOCUMENT: ${selectedAttachment.name}\nINTEGRITY SHA-256: 4f7b2c9a1d8e3f6a5b2c7d1e0f9a8b4c2e6d1a9b8c7d6e5f4a3b2c1d0e9f8a7b\nBASELINE: ${rec.configurationBaseline}\nPROJECT: ${rec.plmProjectName} (${rec.plmId})\n=======================================================`
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

      {/* 3. Create ECR Modal */}
      <Dialog open={showEcrModal} onOpenChange={setShowEcrModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-600" />
              Create Engineering Change Request (ECR)
            </DialogTitle>
            <DialogDescription>Submit a formal request to alter product engineering baselines</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">ECR Title</label>
              <Input
                value={newEcrTitle}
                onChange={(e) => setNewEcrTitle(e.target.value)}
                className="h-8 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Reason for Change</label>
              <Textarea
                rows={3}
                value={newEcrReason}
                onChange={(e) => setNewEcrReason(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowEcrModal(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
              onClick={() => {
                const nextEcr = "ECR-2024-0126";
                setLocalRecord({
                  ...rec,
                  ecrNumber: nextEcr,
                  productChangeSummary: `${newEcrTitle} - ${newEcrReason}`,
                });
                toast.success(`${nextEcr} Created successfully!`);
                setShowEcrModal(false);
              }}
            >
              Create ECR
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Create ECO Modal */}
      <Dialog open={showEcoModal} onOpenChange={setShowEcoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" />
              Create Engineering Change Order (ECO)
            </DialogTitle>
            <DialogDescription>Authorize factory floor release and BOM revision</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Linked ECR</label>
              <Input value={rec.ecrNumber} readOnly className="h-8 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Implementation Plan</label>
              <Textarea
                rows={3}
                value={newEcoPlan}
                onChange={(e) => setNewEcoPlan(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setShowEcoModal(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              onClick={() => {
                const nextEco = "ECO-2024-0100";
                setLocalRecord({
                  ...rec,
                  ecoNumber: nextEco,
                  revisionNumber: "R3",
                  bomVersion: "BOM-7KW-V1.3",
                });
                toast.success(`${nextEco} Released! BOM updated to BOM-7KW-V1.3.`);
                setShowEcoModal(false);
              }}
            >
              Release ECO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 5. Product Configuration Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Box className="h-5 w-5 text-blue-600" />
              Product Configuration Baseline ({rec.productConfigurationId})
            </DialogTitle>
            <DialogDescription>Hardware, firmware, and BOM release baseline specification</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border font-mono">
              <div><strong>BOM Version:</strong> {rec.bomVersion}</div>
              <div><strong>Hardware:</strong> {rec.hardwareVersion}</div>
              <div><strong>Firmware:</strong> {rec.firmwareVersion}</div>
              <div><strong>Software:</strong> {rec.softwareVersion}</div>
              <div><strong>Configuration Baseline:</strong> {rec.configurationBaseline}</div>
              <div><strong>Obsolescence Risk:</strong> {rec.obsolescenceRisk}</div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowConfigModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. AI Report Modal */}
      <Dialog open={showAiReportModal} onOpenChange={setShowAiReportModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Product Lifecycle Report
            </DialogTitle>
            <DialogDescription>Predictive analytics across component lifespans and supply chain</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-lg border border-blue-200 dark:border-blue-800 space-y-1">
              <p className="font-bold text-blue-900 dark:text-blue-200">Product Health & Obsolescence Prediction</p>
              <p className="text-primary dark:text-blue-300 leading-relaxed">
                Predicted active lifespan: 5.2 Years. Low obsolescence risk across MCU & power electronics components. Health Score: <strong>{rec.aiLifecycleScore}/100</strong>.
              </p>
              <p className="text-primary dark:text-blue-400 text-[11px] pt-1 font-medium">
                Recommendation: Continue manufacturing run without component redesign through FY2028.
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                triggerBrowserDownload(
                  "ai_lifecycle_assessment_report.txt",
                  `=======================================================\nAI LIFECYCLE REPORT: ${rec.productName}\nSCORE: ${rec.aiLifecycleScore}/100\nPREDICTED LIFESPAN: 5.2 Years\nRELIABILITY: ${rec.aiReliabilityForecast}\nRECOMMENDATIONS: ${rec.aiImprovementSuggestions}\n=======================================================`
                );
                toast.success("Downloaded AI Lifecycle Report!");
              }}
              className="gap-1 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export Report (.TXT)
            </Button>
            <Button size="sm" onClick={() => setShowAiReportModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. Workflow Engine Modal */}
      <Dialog open={showWorkflowModal} onOpenChange={setShowWorkflowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              PLM Digital Thread Engine (4 Stages & 5-Way Decision)
            </DialogTitle>
            <DialogDescription>
              Aggregating live state across engineering, manufacturing, quality, service & documentation streams.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-4 gap-2 text-center font-bold">
              {[
                { stage: 1, label: "Stage 1: Config" },
                { stage: 2, label: "Stage 2: Assess" },
                { stage: 3, label: "Stage 3: ECR/ECO" },
                { stage: 4, label: "Stage 4: Executive" },
              ].map((s) => (
                <button
                  key={s.stage}
                  type="button"
                  onClick={() => advanceStageMutation.mutate(s.stage as any)}
                  className={cn(
                    "p-2.5 rounded-lg border transition-all cursor-pointer",
                    rec.stage === s.stage
                      ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                      : "bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100"
                  )}
                >
                  <div>{s.label}</div>
                  <span className="text-[10px] font-normal opacity-80">
                    {rec.stage === s.stage ? "Active Stage" : "Click to Switch"}
                  </span>
                </button>
              ))}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg leading-relaxed text-slate-700 dark:text-slate-300 space-y-1">
              <strong>Executive Board 5-Way Outcome Decisions:</strong>
              <div>• <strong>Approved:</strong> Product lifecycle continued and active.</div>
              <div>• <strong>Approved with Conditions:</strong> Minor lifecycle improvements required.</div>
              <div>• <strong>Revision Required:</strong> Engineering review required; returns to Stage 2.</div>
              <div>• <strong>End-of-Life Approved:</strong> Terminal path initiating product retirement & config archiving.</div>
              <div>• <strong>Rejected:</strong> Release project closed & archived.</div>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowWorkflowModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Add Reviewer Modal */}
      <Dialog open={showAddReviewerModal} onOpenChange={setShowAddReviewerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Add Executive Review Board Member
            </DialogTitle>
            <DialogDescription>Invite an executive director or engineering VP to sign off</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddReviewer} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Reviewer Full Name *</label>
              <Input
                value={newReviewerName}
                onChange={(e) => setNewReviewerName(e.target.value)}
                placeholder="e.g. Dr. K. Venkataraman"
                className="text-xs h-8"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Executive Role *</label>
              <Input
                value={newReviewerRole}
                onChange={(e) => setNewReviewerRole(e.target.value)}
                placeholder="e.g. VP of EV Engineering"
                className="text-xs h-8"
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button size="sm" type="button" variant="outline" onClick={() => setShowAddReviewerModal(false)} className="cursor-pointer">
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                Add Reviewer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 9. Linked Entity Details Modal */}
      <Dialog open={!!linkedEntityModal} onOpenChange={(open) => !open && setLinkedEntityModal(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-primary" />
              {linkedEntityModal?.type} Entity
            </DialogTitle>
            <DialogDescription>Linked cross-module digital thread reference</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
              <span className="text-[10px] text-muted-foreground uppercase font-semibold">Entity ID</span>
              <span className="font-bold text-foreground font-mono text-sm block">{linkedEntityModal?.id}</span>
              <span className="text-muted-foreground block font-medium pt-1">{linkedEntityModal?.title}</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              This entity anchors the product master file in the digital thread. Engineering BOM releases, supply chain POs, and service warranties are unified against this portfolio asset.
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

      {/* 10. Audit Log Drawer */}
      <Dialog open={showAuditLogDrawer} onOpenChange={setShowAuditLogDrawer}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-blue-600" />
              PLM Audit Trail & Activity History
            </DialogTitle>
            <DialogDescription>Immutable audit events and configuration baseline releases</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs max-h-96 overflow-y-auto">
            {rec.auditTrail.map((aud) => (
              <div key={aud.id} className="p-2.5 border-b border-border/60">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>{aud.action}</span>
                  <span className="text-muted-foreground font-normal">{aud.timestamp}</span>
                </div>
                <p className="text-muted-foreground mt-1">{aud.details}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 font-mono">By {aud.user} ({aud.ipAddress})</p>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowAuditLogDrawer(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 11. Timeline Modal */}
      <Dialog open={showTimelineModal} onOpenChange={setShowTimelineModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Full Product Lifecycle Timeline
            </DialogTitle>
            <DialogDescription>Milestone history across design, prototype, and release phases</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            {rec.lifecycleTimeline.map((ms) => (
              <div key={ms.id} className="flex items-center justify-between p-2.5 border rounded-lg bg-slate-50/50 dark:bg-slate-800/40">
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{ms.title}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{ms.date}</p>
                </div>
                <Badge className={ms.completed ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}>
                  {ms.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowTimelineModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

export default PlmPage;
