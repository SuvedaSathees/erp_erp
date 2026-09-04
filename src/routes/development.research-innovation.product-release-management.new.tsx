// Product Release Management Form - Magnertia ERP
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import {
  Rocket,
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
  Activity,
  Calendar,
  Share2,
  FileText,
  Cpu,
  Factory,
  Paperclip,
  UserCheck,
  Building2,
  Megaphone,
  Truck,
  ShieldAlert,
  Trash2,
  ChevronDown,
  User,
  Users,
  BookOpen,
  FileArchive,
} from "lucide-react";

import { productReleaseService } from "@/services/productReleaseService";
import type {
  ProductReleaseApprovalDecision,
  ProductReleaseFormInput,
  ProductReleaseRecord,
  ProductReleaseChecklistItem,
  ProductReleaseAttachment,
  ProductReleaseReviewer,
} from "@/services/types";
import { DEFAULT_PRODUCT_RELEASE_RECORD } from "@/lib/productReleaseFns.server";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
   Browser File Download Helper
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
  "/development/research-innovation/product-release-management/new"
)({
  component: ProductReleasePage,
});

export function ProductReleaseManagementPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ProductReleasePage {...props} />;
}

export function ProductReleaseManagementNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ProductReleasePage {...props} />;
}

export function ProductReleaseFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ProductReleasePage {...props} />;
}

/* ===========================================================================
   Circular Score Gauge Helper
   =========================================================================== */
function CircularScoreGauge({
  score,
  size = 60,
  strokeWidth = 5,
  label,
  sublabel,
  color = "#10B981",
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
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
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-200 dark:text-slate-800"
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            className="transition-all duration-700 ease-out"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold font-mono text-foreground leading-none">{score}%</span>
        </div>
      </div>
      {label && <span className="mt-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center">{label}</span>}
      {sublabel && <span className="text-[9px] text-muted-foreground">{sublabel}</span>}
    </div>
  );
}

/* Helper for file icons */
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
   Main Component: ProductReleasePage
   =========================================================================== */
export function ProductReleasePage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Dialog & Drawer States
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showReleaseNotesDialog, setShowReleaseNotesDialog] = useState(false);
  const [showTimelineModal, setShowTimelineModal] = useState(false);
  const [showAuditLogDrawer, setShowAuditLogDrawer] = useState(false);
  const [showReleasePackageModal, setShowReleasePackageModal] = useState(false);
  const [showAiAnalyzerModal, setShowAiAnalyzerModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showRiskReportModal, setShowRiskReportModal] = useState(false);
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<ProductReleaseAttachment | null>(null);

  // New file input state for upload modal
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Engineering");
  const [uploadFileSize, setUploadFileSize] = useState("2.4 MB");

  // New Reviewer input state
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
    queryKey: ["product-release"],
    queryFn: productReleaseService.fetchRecord,
  });

  // Local record state for instant interactive updates
  const [localRecord, setLocalRecord] = useState<ProductReleaseRecord | null>(null);

  // Sync serverRecord initially
  React.useEffect(() => {
    if (serverRecord && !localRecord) {
      setLocalRecord(serverRecord);
    }
  }, [serverRecord, localRecord]);

  const rec = localRecord || serverRecord || DEFAULT_PRODUCT_RELEASE_RECORD;
  const record = rec;

  // Local Form state
  const [formData, setFormData] = useState<Partial<ProductReleaseFormInput>>({
    releaseProjectName: "",
    productName: "",
    productCategory: "",
    releaseName: "",
    releaseVersion: "",
    releaseType: "",
    releaseObjective: "",
    targetMarkets: ["India", "EU", "USA", "MEA"],
    plannedReleaseDate: "",
    releasePriority: "High",
    distributionPartner: "",
    inventoryAvailable: 2450,
    rolloutStrategy: "",
    productPricing: "",
    approvalDecision: "Approved",
    reviewComments: "All departments are aligned. Proceed with product launch.",
    approvalDate: "19 Jun 2024",
    recommendation: "Ready for Product Launch",
  });

  // Keep form aligned with record
  React.useEffect(() => {
    if (rec) {
      setFormData((prev) => ({
        ...prev,
        releaseProjectName: rec.releaseProjectName,
        productName: rec.productName,
        productCategory: rec.productCategory,
        releaseName: rec.releaseName,
        releaseVersion: rec.releaseVersion,
        releaseType: rec.releaseType,
        releaseObjective: rec.releaseObjective,
        targetMarkets: rec.targetMarkets,
        plannedReleaseDate: rec.plannedReleaseDate,
        releasePriority: rec.releasePriority,
        distributionPartner: rec.distributionPartner,
        inventoryAvailable: rec.inventoryAvailable,
        rolloutStrategy: rec.rolloutStrategy,
        productPricing: rec.productPricing,
        approvalDecision: rec.approvalDecision,
        reviewComments: rec.reviewComments,
        approvalDate: rec.approvalDate,
        recommendation: rec.recommendation,
      }));
    }
  }, [rec]);

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ProductReleaseFormInput>) => productReleaseService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["product-release"], updated);
      setLocalRecord(updated);
      toast.success("Draft saved successfully.", {
        description: "Release parameters, stock allocation, and readiness metrics preserved.",
      });
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  const submitMutation = useMutation({
    mutationFn: () => productReleaseService.submitForReview(),
    onSuccess: (updated) => {
      queryClient.setQueryData(["product-release"], updated);
      setLocalRecord(updated);
      toast.success("Product Release submitted for Executive Board Review (Stage 3).");
    },
    onError: (err: any) => toast.error(`Gate Check Failed: ${err.message}`),
  });

  const reviewMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: ProductReleaseApprovalDecision;
      comments?: string;
    }) => productReleaseService.reviewDecision(args),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData(["product-release"], updated);
      setLocalRecord(updated);
      if (variables.decision === "Approved") {
        toast.success("PRODUCT LAUNCH AUTHORIZED! Release status set to Approved & Sales Active.");
      } else if (variables.decision === "Approved with Conditions") {
        toast.info("Approved with Conditions. Pending minor actions.");
      } else if (variables.decision === "Revision Required") {
        toast.warning("Revision Requested. Returned to Readiness Assessment.");
      } else {
        toast.error("Release Project Rejected & Archived.");
      }
    },
    onError: (err: any) => toast.error(`Executive Review failed: ${err.message}`),
  });

  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: 1 | 2 | 3) => productReleaseService.advanceStage(targetStage),
    onSuccess: (updated, targetStage) => {
      queryClient.setQueryData(["product-release"], updated);
      setLocalRecord(updated);
      toast.success(`Workflow stage set to Stage ${targetStage}`);
    },
  });

  // Action: Interactive Workflow Status Dropdown
  const handleStatusChange = (newStatus: string) => {
    if (!rec) return;
    const updated: ProductReleaseRecord = {
      ...rec,
      workflowStatus: newStatus as any,
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-release"], updated);
    toast.success(`Workflow status updated to '${newStatus}'`);
  };

  // Action: Toggle Checklist Item
  const toggleChecklist = (section: "engineering" | "manufacturing" | "commercial", itemId: string) => {
    if (!rec) return;
    let listKey: "engineeringChecklist" | "manufacturingChecklist" | "commercialChecklist" = "engineeringChecklist";
    if (section === "manufacturing") listKey = "manufacturingChecklist";
    if (section === "commercial") listKey = "commercialChecklist";

    const updatedList = rec[listKey].map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updated: ProductReleaseRecord = {
      ...rec,
      [listKey]: updatedList,
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-release"], updated);
    toast.success("Readiness checklist deliverable updated.");
  };

  // Action: Add Attachment
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rec) return;
    const filename = uploadFileName.trim() ? uploadFileName.trim() : "release_artifact.pdf";
    const newAtt: ProductReleaseAttachment = {
      id: `att-${Date.now()}`,
      name: filename.includes(".") ? filename : `${filename}.pdf`,
      size: uploadFileSize,
      type: filename.endsWith(".xlsx") ? "Excel" : filename.endsWith(".zip") ? "Archive" : "PDF",
      url: "#",
    };

    const updated: ProductReleaseRecord = {
      ...rec,
      attachments: [newAtt, ...rec.attachments],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-release"], updated);
    setShowUploadDialog(false);
    setUploadFileName("");
    toast.success(`Uploaded "${newAtt.name}" successfully!`, {
      description: "Appended to Product Release Documentation Package.",
    });
  };

  // Action: Delete Attachment
  const handleDeleteAttachment = (id: string, name: string) => {
    if (!rec) return;
    const updated: ProductReleaseRecord = {
      ...rec,
      attachments: rec.attachments.filter((a) => a.id !== id),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-release"], updated);
    toast.success(`Deleted attachment: ${name}`);
  };

  // Action: Add Board Reviewer
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerRole.trim() || !rec) {
      toast.error("Please enter reviewer name and role");
      return;
    }
    const newRev: ProductReleaseReviewer = {
      id: `rev-${Date.now()}`,
      role: newReviewerRole,
      person: newReviewerName,
      decision: "Pending",
      date: "-",
      comments: "Pending review",
      status: "In Progress",
    };

    const updated: ProductReleaseRecord = {
      ...rec,
      reviewers: [...rec.reviewers, newRev],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-release"], updated);
    setShowAddReviewerModal(false);
    setNewReviewerName("");
    setNewReviewerRole("");
    toast.success(`Added ${newRev.person} to Executive Release Board`);
  };

  // Action: Toggle Reviewer Decision directly
  const handleToggleReviewerDecision = (index: number) => {
    if (!rec) return;
    const decisions: ProductReleaseApprovalDecision[] = ["Approved", "Approved with Conditions", "Revision Required", "Rejected"];
    const current = rec.reviewers[index]?.decision || "Pending";
    const nextIdx = (decisions.indexOf(current as ProductReleaseApprovalDecision) + 1) % decisions.length;
    const nextDecision = decisions[nextIdx];
    const updatedReviewers = [...rec.reviewers];
    updatedReviewers[index] = {
      ...updatedReviewers[index],
      decision: nextDecision,
      status: nextDecision === "Approved" ? "Completed" : "In Progress",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated: ProductReleaseRecord = { ...rec, reviewers: updatedReviewers };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-release"], updated);
    toast.success(`Updated ${updatedReviewers[index].person}'s decision to ${nextDecision}`);
  };

  // Action: Export Full Dossier (.TXT)
  const handleExportDossier = () => {
    if (!rec) return;
    const content = `====================================================================
PRODUCT RELEASE MANAGEMENT DOSSIER
====================================================================
Project Name: ${rec.releaseProjectName}
Product Name: ${rec.productName}
Release ID: ${rec.releaseId}
Form Code: ${rec.formCode}
Release Version: ${rec.releaseVersion}
Workflow Status: ${rec.workflowStatus}
Release Manager: ${rec.releaseManager.name}
Planned Release Date: ${rec.plannedReleaseDate}
Release Type: ${rec.releaseType}
Priority: ${rec.releasePriority}
Date: ${rec.createdDate}

1. OVERALL RELEASE READINESS SCORE
--------------------------------------------------------------------
Overall Score: ${rec.overallReleaseScore}%
Recommendation: ${rec.recommendation}
Stock Reserved: ${rec.inventoryAvailable.toLocaleString()} ${rec.inventoryUnits}
1. Engineering Readiness: ${rec.engineeringScore}%
2. Manufacturing Readiness: ${rec.manufacturingScore}%
3. Commercial Readiness: ${rec.commercialScore}%
4. Risk Readiness: ${rec.riskScore}%
5. Deployment Readiness: ${rec.deploymentScore}%

2. DEPLOYMENT & DISTRIBUTION SPECIFICATIONS
--------------------------------------------------------------------
Channels: ${rec.releaseChannels.join(", ")}
Regions: ${rec.deploymentRegions.join(", ")}
Distribution Partner: ${rec.distributionPartner}
Rollout Strategy: ${rec.rolloutStrategy}
Pricing Baseline: ${rec.productPricing}

3. ATTACHMENTS & PACKAGES (${rec.attachments.length} Files)
--------------------------------------------------------------------
${rec.attachments.map((a, i) => `${i + 1}. ${a.name} (${a.size})`).join("\n")}

4. EXECUTIVE BOARD REVIEWERS
--------------------------------------------------------------------
${rec.reviewers.map((r, i) => `${i + 1}. [${r.decision}] ${r.role} - ${r.person}: ${r.comments} (${r.date})`).join("\n")}
====================================================================`;

    triggerBrowserDownload(`${rec.releaseId}_release_dossier.txt`, content, "text/plain;charset=utf-8");
    toast.success("Release Dossier downloaded successfully!");
  };

  // Action: Export Milestone Timeline CSV
  const handleExportTimelineCSV = () => {
    if (!rec) return;
    const csvRows = [
      ["Milestone ID", "Title", "Date", "Status"],
      ...rec.releaseTimeline.map((m) => [m.id, m.title, m.date, m.completed ? "Completed" : "Pending"]),
    ];
    const csvContent = csvRows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    triggerBrowserDownload(`${rec.releaseId}_milestone_timeline.csv`, csvContent, "text/csv;charset=utf-8");
    toast.success("Exported release timeline to CSV!");
  };

  if (isLoading && !serverRecord && !localRecord) {
    return (
      <AppShell
        title="Product Release Management"
        breadcrumb={breadcrumb ?? "Development > Research & Innovation > Product Release Management"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="flex h-96 w-full items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading Product Release Management workspace...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Product Release Management"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Product Release Management"}
      description="Govern release gates, ECO sign-offs, production deployment checklists, and release notes."
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
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/60">
                      {rec.releaseId}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <Badge variant="outline" className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800">
                      {rec.formCode}
                    </Badge>
                    <Badge variant="secondary" className="font-mono text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                      {rec.releaseVersion}
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
                              ? "bg-purple-600 text-white hover:bg-purple-700"
                              : rec.workflowStatus === "Revision Required"
                              ? "bg-orange-500 text-white hover:bg-orange-600"
                              : rec.workflowStatus === "Rejected"
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
                          <Eye className="mr-2 h-3.5 w-3.5 text-purple-500" /> Executive Review
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Approved")} className="cursor-pointer">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-emerald-500" /> Approved
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Approved with Conditions")} className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-3.5 w-3.5 text-amber-500" /> Approved with Conditions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Revision Required")} className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-3.5 w-3.5 text-orange-500" /> Revision Required
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange("Rejected")} className="cursor-pointer">
                          <AlertTriangle className="mr-2 h-3.5 w-3.5 text-rose-600" /> Rejected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Project Title Input */}
                  <div className="flex items-center gap-2 w-full">
                    <Input
                      value={formData.releaseProjectName || rec.releaseProjectName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, releaseProjectName: e.target.value }))}
                      title={formData.releaseProjectName || rec.releaseProjectName}
                      className="h-8 text-base sm:text-lg font-bold text-foreground bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary shadow-none px-2 py-0 transition-all rounded-md w-full min-w-0"
                      placeholder="Release Project Name..."
                    />
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowWorkflowModal(true)}
                  className="gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                >
                  <Workflow className="h-3.5 w-3.5 text-blue-600" />
                  <span className="hidden lg:inline">Release Gate</span> Workflow
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
                {rec.workflowStatus === "In Review" ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        className="h-8 px-3 text-xs font-semibold gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 hover:border-amber-500/50 shadow-2xs transition-all cursor-pointer"
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
                          toast.success("Expedited review reminder dispatched to Executive Release Board.");
                        }}
                        className="cursor-pointer"
                      >
                        <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          handleStatusChange("In Progress");
                          toast.info("Status reverted to In Progress. You can now modify release gate parameters.");
                        }}
                        className="cursor-pointer text-amber-600 dark:text-amber-400"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" /> Revert Status to In Progress
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : rec.workflowStatus === "Approved" ? (
                  <Badge className="h-8 px-3 text-xs font-semibold gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    {rec.workflowStatus}
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => submitMutation.mutate()}
                    disabled={submitMutation.isPending}
                    className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-xs font-semibold cursor-pointer h-8"
                  >
                    {submitMutation.isPending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Submit for Review
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => document.getElementById("section-review")?.scrollIntoView({ behavior: "smooth" })}
                  className="h-8 px-3 text-xs font-semibold gap-1.5 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  Review Decision
                </Button>

                {/* More Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-slate-800 shadow-2xs cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 text-xs shadow-lg">
                    <DropdownMenuItem onClick={() => setShowReleasePackageModal(true)} className="gap-2 cursor-pointer">
                      <Download className="h-4 w-4 text-blue-600" />
                      Download Release Package (.ZIP)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowReleaseNotesDialog(true)} className="gap-2 cursor-pointer">
                      <FileText className="h-4 w-4 text-emerald-600" />
                      Publish Release Notes
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowAiAnalyzerModal(true)} className="gap-2 cursor-pointer">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Run AI Release Analysis
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
                        toast.success("Release record link copied to clipboard!");
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

            {/* Bottom Row: Key-Value Structured Metadata Ribbon with Functional Dialogs */}
            <div className="px-4 py-2.5 bg-white dark:bg-slate-900 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs divide-y sm:divide-y-0 sm:divide-x divide-border/60">
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

              {/* Linked Documentation */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <BookOpen className="h-3 w-3 text-emerald-500" /> Documentation
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setLinkedEntityModal({
                      type: "Product Documentation",
                      id: rec.linkedDocumentation.code,
                      title: "Smart EV Charger Technical Documentation Package",
                      route: "/development/research-innovation/product-documentation/new",
                    })
                  }
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer"
                >
                  <span className="truncate">{rec.linkedDocumentation.code}</span>
                  <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
                </button>
              </div>

              {/* Release Manager */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-emerald-500" /> Release Manager
                </span>
                <span className="font-semibold text-foreground truncate">{rec.releaseManager.name}</span>
              </div>

              {/* Planned Release Date */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-blue-500" /> Planned Date
                </span>
                <span className="font-semibold text-foreground truncate">{rec.plannedReleaseDate}</span>
              </div>

              {/* Release Type */}
              <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium">Release Type</span>
                <Badge variant="secondary" className="font-semibold w-fit px-1.5 py-0 text-[10px]">
                  {rec.releaseType}
                </Badge>
              </div>

              {/* Priority & Created */}
              <div className="flex flex-col gap-0.5 sm:pl-2 pt-2 sm:pt-0">
                <span className="text-[11px] text-muted-foreground font-medium">Priority</span>
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 font-bold px-1.5 py-0 text-[10px] border-red-300">
                    {rec.releasePriority}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground truncate">{rec.createdOn}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 3-Stage Interactive Stage Stepper Bar */}
          <div className="mt-3 rounded-xl border border-blue-200/60 bg-blue-50/40 dark:bg-blue-950/20 p-3 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  3-Stage Release Gate Lifecycle
                </span>
              </div>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                Current Stage: <strong className="font-bold">{rec.workflowStageLabel}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {[
                { stage: 1, label: "Stage 1: Readiness Assessment", sub: "Engineering, Mfg, Commercial & Compliance", icon: Box },
                { stage: 2, label: "Stage 2: Deployment Planning", sub: "Schedule, channels, stock & sales activation", icon: Calendar },
                { stage: 3, label: "Stage 3: Executive Launch", sub: "Board decision, release notes & sales launch", icon: ShieldCheck },
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
           3. EXECUTIVE PRODUCT RELEASE SCORE & READINESS STRIP
           ==================================================================== */}
        <div className="mx-auto max-w-[1600px] px-4 space-y-6">
          <Card className="border-border bg-white dark:bg-slate-900 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col xl:flex-row items-center justify-between gap-6">
              {/* Overall Score Gauge */}
              <div className="flex items-center gap-5 shrink-0">
                <CircularScoreGauge
                  score={rec.overallReleaseScore}
                  size={96}
                  strokeWidth={8}
                  color="#059669"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">Overall Release Readiness Score</span>
                    <Badge className="bg-emerald-600 text-white text-[10px]">
                      Ready for Launch (Executive Review)
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-md">
                    All 6 readiness & compliance streams converged. Production stock allocated and sales channel activation authorized.
                  </p>
                  <div className="flex items-center gap-2 text-xs pt-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Target Launch:</span>
                    <span className="font-bold text-blue-600 dark:text-blue-400">{rec.plannedReleaseDate}</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Inventory:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{rec.inventoryAvailable.toLocaleString()} Units</span>
                  </div>
                </div>
              </div>

              {/* Component Pillar Progress Bars */}
              <div className="w-full xl:w-auto flex-1 max-w-xl grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs border-t xl:border-t-0 xl:border-l border-border/80 pt-4 xl:pt-0 xl:pl-6">
                <div
                  onClick={() => document.getElementById("engineering")?.scrollIntoView({ behavior: "smooth" })}
                  className="space-y-1 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium truncate">Engineering</span>
                    <span className="font-bold text-emerald-600">{rec.engineeringScore}%</span>
                  </div>
                  <Progress value={rec.engineeringScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("manufacturing")?.scrollIntoView({ behavior: "smooth" })}
                  className="space-y-1 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium truncate">Manufacturing</span>
                    <span className="font-bold text-emerald-600">{rec.manufacturingScore}%</span>
                  </div>
                  <Progress value={rec.manufacturingScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("commercial")?.scrollIntoView({ behavior: "smooth" })}
                  className="space-y-1 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium truncate">Commercial</span>
                    <span className="font-bold text-emerald-600">{rec.commercialScore}%</span>
                  </div>
                  <Progress value={rec.commercialScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("risk_compliance")?.scrollIntoView({ behavior: "smooth" })}
                  className="space-y-1 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium truncate">Risk</span>
                    <span className="font-bold text-amber-600">{rec.riskScore}%</span>
                  </div>
                  <Progress value={rec.riskScore} className="h-1.5" />
                </div>
                <div
                  onClick={() => document.getElementById("deployment")?.scrollIntoView({ behavior: "smooth" })}
                  className="space-y-1 col-span-2 sm:col-span-1 cursor-pointer p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium truncate">Deployment</span>
                    <span className="font-bold text-emerald-600">{rec.deploymentScore}%</span>
                  </div>
                  <Progress value={rec.deploymentScore} className="h-1.5" />
                </div>
              </div>
            </div>
          </Card>

          {/* ====================================================================
             4. BALANCED 2-COLUMN GRID (Cards 1 to 6)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* -----------------------------------------------------------------
               CARD 1: Release Overview & Plan Specs
               ----------------------------------------------------------------- */}
            <Card id="overview" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Rocket className="h-4 w-4 text-blue-600" />
                        1. Release Overview
                      </CardTitle>
                      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold border-emerald-200 text-xs">
                        {rec.workflowStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Product Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.productName || rec.productName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
                          className="h-8 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Product Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.productCategory || rec.productCategory}
                          onChange={(e) => setFormData((prev) => ({ ...prev, productCategory: e.target.value }))}
                          className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-semibold cursor-pointer"
                        >
                          <option value="AC EV Charger">AC EV Charger</option>
                          <option value="DC Fast Charger">DC Fast Charger</option>
                          <option value="Industrial Energy System">Industrial Energy System</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Release Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.releaseName || rec.releaseName}
                          onChange={(e) => setFormData((prev) => ({ ...prev, releaseName: e.target.value }))}
                          className="h-8 text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Release Version <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.releaseVersion || rec.releaseVersion}
                          onChange={(e) => setFormData((prev) => ({ ...prev, releaseVersion: e.target.value }))}
                          className="h-8 text-xs font-mono font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Release Type <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.releaseType || rec.releaseType}
                          onChange={(e) => setFormData((prev) => ({ ...prev, releaseType: e.target.value }))}
                          className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-semibold cursor-pointer"
                        >
                          <option value="Production Release">Production Release</option>
                          <option value="Beta Pilot Release">Beta Pilot Release</option>
                          <option value="Minor Patch Release">Minor Patch Release</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Planned Release Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          value={formData.plannedReleaseDate || rec.plannedReleaseDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, plannedReleaseDate: e.target.value }))}
                          className="h-8 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        Target Markets
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {rec.targetMarkets.map((m) => (
                          <Badge key={m} className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold border-blue-200">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        Release Objective <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        rows={2}
                        value={formData.releaseObjective || rec.releaseObjective}
                        onChange={(e) => setFormData((prev) => ({ ...prev, releaseObjective: e.target.value }))}
                        className="text-xs resize-none"
                      />
                    </div>

                    {/* Technical Release Readiness & Inventory Card */}
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3.5 space-y-2.5 mt-2">
                      <div className="flex items-center justify-between pb-2 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600">
                            <Rocket className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Smart EV Charger v1.2 Launch</h4>
                            <p className="text-[10px] font-mono text-muted-foreground">Release Plan: REL-2024-0053</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                          Ready for Launch
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200/80 dark:border-slate-800">
                          <span className="text-muted-foreground block text-[10px]">Stock Reserved</span>
                          <span className="font-mono font-bold text-blue-600 dark:text-blue-400">2,450 Units</span>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200/80 dark:border-slate-800">
                          <span className="text-muted-foreground block text-[10px]">Target Markets</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200 truncate">India, EU, USA, MEA</span>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200/80 dark:border-slate-800">
                          <span className="text-muted-foreground block text-[10px]">Release Date</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">30 Jun 2024</span>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-slate-900 p-2 border border-slate-200/80 dark:border-slate-800">
                          <span className="text-muted-foreground block text-[10px]">Pricing Baseline</span>
                          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹ 23,999.00</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground">
                        <span>Digital Thread Linked</span>
                        <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">DOC-2024-0087</span>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Release Plan Identifier</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{rec.releaseId} • {rec.formCode}</span>
                </div>
              </Card>

            {/* -----------------------------------------------------------------
               CARD 2: Engineering Release Readiness
               ----------------------------------------------------------------- */}
            <Card id="engineering" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-blue-600" />
                        2. Engineering Release Readiness
                      </CardTitle>
                      <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                        {rec.engineeringChecklist.length} Deliverables
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 px-4">
                    <div className="space-y-2.5">
                      {rec.engineeringChecklist.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleChecklist("engineering", item.id)}
                          className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2.5">
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
                  </CardContent>
                </div>

                {/* Computed Score Footer Tile */}
                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Engineering Readiness Score
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>{rec.engineeringScore}</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>

              <Card id="manufacturing" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Factory className="h-4 w-4 text-blue-600" />
                        3. Manufacturing Readiness
                      </CardTitle>
                      <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                        {rec.manufacturingChecklist.length} Deliverables
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 px-4">
                    <div className="space-y-2.5">
                      {rec.manufacturingChecklist.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleChecklist("manufacturing", item.id)}
                          className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2.5">
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
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Manufacturing Readiness Score
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>{rec.manufacturingScore}</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>

              <Card id="commercial" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-blue-600" />
                        4. Commercial Readiness
                      </CardTitle>
                      <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                        {rec.commercialChecklist.length} Deliverables
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 px-4">
                    <div className="space-y-2.5">
                      {rec.commercialChecklist.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleChecklist("commercial", item.id)}
                          className="w-full flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80 cursor-pointer text-left"
                        >
                          <div className="flex items-center gap-2.5">
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
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Commercial Readiness Score
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>{rec.commercialScore}</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>

              <Card id="deployment" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        5. Deployment & Distribution
                      </CardTitle>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-mono font-bold">
                        Stock Reserved
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 px-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-muted-foreground block font-medium">Release Channels</span>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {rec.releaseChannels.map((c) => (
                            <Badge key={c} variant="secondary" className="text-[10px] font-semibold">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium">Deployment Regions</span>
                        <div className="flex gap-1 flex-wrap mt-1">
                          {rec.deploymentRegions.map((r) => (
                            <Badge key={r} variant="outline" className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-muted-foreground block font-medium">Distribution Partner</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{rec.distributionPartner}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium">Inventory Available</span>
                        <p className="font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                          {rec.inventoryAvailable.toLocaleString()} {rec.inventoryUnits}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-muted-foreground block font-medium">Release Schedule</span>
                        <p className="font-medium text-slate-700 dark:text-slate-300 mt-0.5">{rec.plannedReleaseDate}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium">Rollout Strategy</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{rec.rolloutStrategy}</p>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Deployment Readiness Score
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>{rec.deploymentScore}</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>

              <Card id="risk_compliance" className="border-border bg-white dark:bg-slate-900 shadow-2xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-blue-600" />
                        6. Risk & Compliance Review
                      </CardTitle>
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-mono font-bold">
                        1 Critical Risk Monitored
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-3 pb-2 px-4 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                        <span className="text-muted-foreground block text-[10px] font-medium">Open Risks</span>
                        <span className="text-base font-bold text-slate-800 dark:text-slate-200">{rec.openRisksCount}</span>
                      </div>

                      <div className="p-2.5 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20">
                        <span className="text-amber-900 dark:text-amber-300 block text-[10px] font-medium">Critical Risks</span>
                        <span className="text-base font-bold text-amber-700 dark:text-amber-400">{rec.criticalRisksCount}</span>
                      </div>

                      <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-medium">CAPA Closed</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">Yes</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>

                      <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-medium">Regulatory Approval</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">Yes</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>

                      <div className="p-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between">
                        <div>
                          <span className="text-muted-foreground block text-[10px] font-medium">Warranty Approved</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">Yes</span>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      </div>

                      <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 flex flex-col justify-between">
                        <span className="text-muted-foreground block text-[10px] font-medium">Risk Assessment</span>
                        <button
                          type="button"
                          onClick={() => setShowRiskReportModal(true)}
                          className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 text-[11px] mt-0.5 cursor-pointer"
                        >
                          View Report <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Risk Readiness Score
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-400">1 minor supply buffer risk monitored</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>{rec.riskScore}</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>
          </div>

          <Card id="ai_assessment" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    7. AI Release Assessment
                  </CardTitle>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 gap-1 border-purple-200 font-semibold text-xs">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    AI Digital Thread Engine
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-9 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                        AI Release Readiness Review
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                        {rec.aiReleaseReadinessReview}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                        AI Deployment Risk Analysis
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                        {rec.aiDeploymentRiskAnalysis}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                        AI Commercial Readiness
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                        {rec.aiCommercialReadiness}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-emerald-200/80 dark:border-emerald-900/40 p-2.5 bg-emerald-50/40 dark:bg-emerald-950/20">
                      <span className="font-semibold text-emerald-900 dark:text-emerald-300 w-1/3">
                        AI Launch Recommendation
                      </span>
                      <span className="text-emerald-800 dark:text-emerald-200 font-bold flex-1">
                        {rec.aiLaunchRecommendation}
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-purple-200/80 dark:border-purple-900/40 p-2.5 bg-purple-50/40 dark:bg-purple-950/20">
                      <span className="font-semibold text-purple-900 dark:text-purple-300 w-1/3">
                        AI Improvement Suggestions
                      </span>
                      <span className="text-purple-800 dark:text-purple-200 font-medium flex-1">
                        {rec.aiImprovementSuggestions}
                      </span>
                      <Sparkles className="h-4 w-4 text-purple-600 shrink-0 ml-2" />
                    </div>
                  </div>

                  <div className="md:col-span-3 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-purple-200/60 dark:border-slate-700 p-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm mb-2">
                      AI
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Release Score</span>
                    <div className="mt-2 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-bold text-lg">
                      <span>{rec.aiReleaseScore}</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card id="summary" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    8. Release Summary & Milestone Timeline
                  </CardTitle>
                  <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800 font-semibold">
                    Single Source of Truth Gauges
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-5 pb-5 space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                  <div className="xl:col-span-7 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                        Release Convergence Gauges
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono">5 Streams</Badge>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 items-center justify-items-center pt-2">
                      <CircularScoreGauge
                        score={rec.engineeringScore}
                        label="Engineering"
                        color="#10B981"
                      />
                      <CircularScoreGauge
                        score={rec.manufacturingScore}
                        label="Manufacturing"
                        color="#10B981"
                      />
                      <CircularScoreGauge
                        score={rec.commercialScore}
                        label="Commercial"
                        color="#10B981"
                      />
                      <CircularScoreGauge
                        score={rec.riskScore}
                        label="Risk Score"
                        color="#F59E0B"
                      />
                    </div>

                    <div className="pt-3 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Recommendation:</span>
                        <select
                          value={formData.recommendation || rec.recommendation}
                          onChange={(e) => setFormData((prev) => ({ ...prev, recommendation: e.target.value }))}
                          className="h-8 rounded-md border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 cursor-pointer"
                        >
                          <option value="Ready for Product Launch">Ready for Product Launch</option>
                          <option value="Requires Minor Updates">Requires Minor Updates</option>
                          <option value="Pending Board Decision">Pending Board Decision</option>
                          <option value="Not Recommended">Not Recommended</option>
                        </select>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        All 6 readiness & compliance streams converged. Product launch authorized.
                      </span>
                    </div>
                  </div>

                  <div className="xl:col-span-5 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/30 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-border/60 mb-3">
                        <span className="font-bold text-foreground text-xs uppercase tracking-wider">
                          Release Milestone Timeline
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">{rec.releaseTimeline.length} Events</Badge>
                      </div>
                      <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                        {rec.releaseTimeline.map((ms) => (
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

            <Card id="attachments" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-blue-600" />
                    9. Attachments
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
                          <p className="text-[10px] text-muted-foreground font-mono">{att.size}</p>
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
                              `=======================================================\nDOCUMENT: ${att.name}\nTYPE: ${att.type}\nSIZE: ${att.size}\nSECURITY HASH SHA-256: 7e2f1c8b3d9a4e5f6a7b8c9d0e1f2a3b\nRELEASE PLAN: ${rec.releaseId} • ${rec.releaseName}\n=======================================================`
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

                <div className="mt-4 pt-3 border-t border-border/60 text-right">
                  <button
                    type="button"
                    onClick={() => setShowUploadDialog(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    View All Attachments ({rec.attachments.length}) <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>

          <Card id="section-review" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    10. Review & Approval
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-semibold border-emerald-200">
                      Executive Review Board
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
              <CardContent className="pt-4 space-y-5">
                {/* Executive Board Consensus Chips */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-muted-foreground uppercase tracking-wider">
                      Board Evaluator Consensus (Click to Toggle)
                    </span>
                    <span className="text-muted-foreground font-mono">
                      {rec.reviewers.filter((r) => r.decision === "Approved" || r.decision === "Approved with Conditions").length} of {rec.reviewers.length} Endorsed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                    {rec.reviewers.map((rev, i) => (
                      <div
                        key={rev.id || i}
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
                                : rev.decision === "Revision Required" || rev.decision === "Changes Requested"
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

                {/* Board Decision Controls */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs pt-2">
                  <div className="md:col-span-4">
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      Approval Decision <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.approvalDecision || rec.approvalDecision}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          approvalDecision: e.target.value as ProductReleaseApprovalDecision,
                        }))
                      }
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
                    >
                      <option value="Approved">Approved</option>
                      <option value="Approved with Conditions">Approved with Conditions</option>
                      <option value="Revision Required">Revision Required</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="md:col-span-5">
                    <div className="flex justify-between items-center mb-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
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
                      <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                        Approval Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.approvalDate || rec.approvalDate}
                        onChange={(e) => setFormData((prev) => ({ ...prev, approvalDate: e.target.value }))}
                        className="h-9 text-xs"
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
                        // Update the CEO reviewer row locally
                        const updatedReviewers = rec.reviewers.map((r) =>
                          r.role === "CEO"
                            ? { ...r, decision: dec, comments: com, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), status: "Completed" as any }
                            : r
                        );
                        setLocalRecord({
                          ...rec,
                          reviewers: updatedReviewers,
                          workflowStatus: dec === "Approved" ? "Approved" : "In Review",
                        });
                      }}
                      disabled={reviewMutation.isPending}
                    >
                      Authorize Launch
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

          {/* ====================================================================
             9. SYSTEM INFORMATION (Full Width)
             ==================================================================== */}
          <Card id="system_info" className="border-border bg-white dark:bg-slate-900 shadow-2xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <HistoryIcon className="h-4 w-4 text-blue-600" />
                    11. System Information
                  </CardTitle>
                  <Badge variant="outline" className="text-xs font-mono">
                    Audit Logged
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
                      <span className="text-muted-foreground block font-medium text-[10px]">Commercial Date</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">{rec.commercialDate}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Workflow Stage</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">{rec.workflowStageLabel}</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col justify-center space-y-2 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <button
                      type="button"
                      onClick={() => setShowAuditLogDrawer(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View Log</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTimelineModal(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View Release Timeline</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowWorkflowModal(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View Workflow</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
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
              Upload Release Attachment
            </DialogTitle>
            <DialogDescription>
              Add supporting documents, checklists, or marketing materials to this release package.
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
                <option value="Engineering">Engineering Deliverable</option>
                <option value="Manufacturing">Manufacturing SOP</option>
                <option value="Marketing">Marketing Material</option>
                <option value="Release Notes">Release Notes</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">File Name *</label>
              <Input
                placeholder="e.g. final_release_notes_v1.2.pdf"
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
              {selectedAttachment?.type} File • {selectedAttachment?.size} • Verified Product Release Asset
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-slate-950 text-slate-100 font-mono text-xs space-y-2 border border-slate-800">
            <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" /> Release Gate Verification Passed
            </div>
            <div className="text-slate-300">File: {selectedAttachment?.name}</div>
            <div className="text-slate-400 text-[11px]">
              SHA-256: 7e2f1c8b3d9a4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
            </div>
            <div className="text-slate-400 text-[11px]">Release ID: {rec.releaseId} • {rec.releaseVersion}</div>
            <div className="text-slate-400 text-[11px]">Commercial Readiness: Authorized for Public Deployment</div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (selectedAttachment) {
                  triggerBrowserDownload(
                    selectedAttachment.name,
                    `=======================================================\nDOCUMENT: ${selectedAttachment.name}\nINTEGRITY SHA-256: 7e2f1c8b3d9a4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f\nRELEASE: ${rec.releaseId} (${rec.releaseVersion})\n=======================================================`
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

      {/* 3. Release Notes Modal */}
      <Dialog open={showReleaseNotesDialog} onOpenChange={setShowReleaseNotesDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Publish Product Release Notes ({rec.releaseVersion})
            </DialogTitle>
            <DialogDescription>
              Generate and publish public & dealer release notes for {rec.productName}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <Textarea
              rows={5}
              defaultValue={`# Release Notes - ${rec.productName} ${rec.releaseVersion}\n- Full support for OCPP 2.0.1 protocol\n- Upgraded thermal management & IP65 enclosure protection\n- Enhanced mobile app remote scheduling & 4G smart metering`}
              className="font-mono text-xs resize-none"
            />
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                triggerBrowserDownload(
                  `${rec.releaseId}_release_notes.txt`,
                  `# Release Notes - ${rec.productName} ${rec.releaseVersion}\n- Full support for OCPP 2.0.1 protocol\n- Upgraded thermal management & IP65 enclosure protection\n- Enhanced mobile app remote scheduling & 4G smart metering`
                );
                toast.success("Downloaded Release Notes (.TXT)!");
              }}
              className="gap-1 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export (.TXT)
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              onClick={() => {
                toast.success("Release notes published successfully!");
                setShowReleaseNotesDialog(false);
              }}
            >
              Publish Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 4. Workflow Engine Modal */}
      <Dialog open={showWorkflowModal} onOpenChange={setShowWorkflowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              Product Release Gate Lifecycle (3 Stages)
            </DialogTitle>
            <DialogDescription>
              Convergence gate verifying readiness across engineering, manufacturing, quality, stock & sales.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-3 gap-3 text-center font-bold">
              {[
                { stage: 1, label: "Stage 1", sub: "Readiness Assessment" },
                { stage: 2, label: "Stage 2", sub: "Deployment Planning" },
                { stage: 3, label: "Stage 3", sub: "Executive Launch" },
              ].map((s) => (
                <button
                  key={s.stage}
                  type="button"
                  onClick={() => advanceStageMutation.mutate(s.stage as any)}
                  className={cn(
                    "p-3 rounded-lg border transition-all cursor-pointer",
                    rec.stage === s.stage
                      ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                      : "bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100"
                  )}
                >
                  <span className="font-extrabold text-sm block">{s.label}</span>
                  <span className="text-xs">{s.sub}</span>
                  <div className="text-[10px] font-normal opacity-80 mt-0.5">
                    {rec.stage === s.stage ? "Active Stage" : "Click to Switch"}
                  </div>
                </button>
              ))}
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
              <strong>Workflow Outcomes (Stage 3):</strong>
              <div>• <strong>Approved:</strong> Production launch authorized, warehouse inventory released & sales channels activated.</div>
              <div>• <strong>Approved with Conditions:</strong> Minor actions required before full commercial rollout.</div>
              <div>• <strong>Revision Required:</strong> Returns to Stage 1 for readiness rework.</div>
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

      {/* 5. Audit Log Drawer */}
      <Dialog open={showAuditLogDrawer} onOpenChange={setShowAuditLogDrawer}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-blue-600" />
              System Audit Trail Log
            </DialogTitle>
            <DialogDescription>Immutable record events and launch sign-offs</DialogDescription>
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

      {/* 6. Release Package Modal */}
      <Dialog open={showReleasePackageModal} onOpenChange={setShowReleasePackageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-emerald-600" />
              Download Product Release Package
            </DialogTitle>
            <DialogDescription>Full package archive including engineering, marketing and SOPs</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Package Contents ({rec.releaseId}_v1.2.0.zip):</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Engineering & Certification Package</li>
              <li>Manufacturing SOP & BOM File</li>
              <li>Sales & Marketing Kit</li>
              <li>Published Release Notes (.PDF)</li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              onClick={() => {
                triggerBrowserDownload(
                  `${rec.releaseId}_v1.2.0_package.zip`,
                  `=======================================================\nRELEASE PACKAGE ARCHIVE\nRELEASE: ${rec.releaseId} (${rec.releaseName})\nVERSION: ${rec.releaseVersion}\nCONTENTS: Engineering, Manufacturing, Commercial & Risk Artifacts\nINTEGRITY SHA-256: 7e2f1c8b3d9a4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f\n=======================================================`,
                  "application/zip"
                );
                toast.success("Downloading Release Package (94.7 MB)...");
                setShowReleasePackageModal(false);
              }}
            >
              Download (.ZIP 94.7 MB)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 7. AI Release Analyzer Modal */}
      <Dialog open={showAiAnalyzerModal} onOpenChange={setShowAiAnalyzerModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Release Intelligence Agent
            </DialogTitle>
            <DialogDescription>Autonomous multi-stream release convergence analysis</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200 dark:border-purple-800 space-y-1">
              <p className="font-bold text-purple-900 dark:text-purple-200">Launch Readiness Assessment</p>
              <p className="text-purple-800 dark:text-purple-300 leading-relaxed">
                AI verified all 18 readiness deliverables. Inventory buffer of 2,450 units is optimal for initial 30 days. Release Score: <strong>{rec.aiReleaseScore}/100</strong>.
              </p>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                triggerBrowserDownload(
                  `${rec.releaseId}_ai_analysis_report.txt`,
                  `=======================================================\nAI RELEASE INTELLIGENCE REPORT: ${rec.productName}\nSCORE: ${rec.aiReleaseScore}/100\nREADINESS: ${rec.aiReleaseReadinessReview}\nRECOMMENDATION: ${rec.aiLaunchRecommendation}\nIMPROVEMENTS: ${rec.aiImprovementSuggestions}\n=======================================================`
                );
                toast.success("Downloaded AI Analysis Report!");
              }}
              className="gap-1 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export Report (.TXT)
            </Button>
            <Button size="sm" onClick={() => setShowAiAnalyzerModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 8. Risk Assessment Report Modal */}
      <Dialog open={showRiskReportModal} onOpenChange={setShowRiskReportModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              Product Release Risk & Compliance Assessment
            </DialogTitle>
            <DialogDescription>Audited risk registry, CAPA status, and regulatory approvals</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-lg border border-amber-200 dark:border-amber-800 space-y-1.5">
              <div className="font-bold text-amber-900 dark:text-amber-200 flex justify-between">
                <span>Supply Buffer Monitored (Risk ID: RSK-2024-0019)</span>
                <Badge className="bg-amber-500 text-white text-[10px]">Low Risk</Badge>
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Secondary supplier for charging cable assemblies contracted to avoid lead time bottlenecks during EU volume surge.
              </p>
              <div className="pt-1 text-[11px] font-mono text-amber-700 dark:text-amber-400">
                CAPA: Closed • Regulatory IEC 61851: Approved • Warranty: Active
              </div>
            </div>
          </div>
          <DialogFooter className="flex justify-between items-center sm:justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                triggerBrowserDownload(
                  `${rec.releaseId}_risk_report.txt`,
                  `=======================================================\nRISK & COMPLIANCE REPORT: ${rec.productName}\nRISK READINESS SCORE: ${rec.riskScore}/100\nOPEN RISKS: ${rec.openRisksCount}\nCRITICAL RISKS: ${rec.criticalRisksCount}\nCAPA CLOSED: YES\nREGULATORY APPROVAL: YES\nWARRANTY: YES\n=======================================================`
                );
                toast.success("Downloaded Risk Report!");
              }}
              className="gap-1 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" /> Export (.TXT)
            </Button>
            <Button size="sm" onClick={() => setShowRiskReportModal(false)} className="cursor-pointer">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 9. Add Reviewer Modal */}
      <Dialog open={showAddReviewerModal} onOpenChange={setShowAddReviewerModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Add Release Board Member
            </DialogTitle>
            <DialogDescription>Invite a department executive to review and sign off</DialogDescription>
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
                placeholder="e.g. Chief Product Officer"
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

      {/* 10. Linked Entity Details Modal */}
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
              This entity anchors the release package in the enterprise digital thread. Engineering sign-offs, production lots, and dealer distribution pipelines are synchronized against this record.
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

      {/* 11. Timeline Modal */}
      <Dialog open={showTimelineModal} onOpenChange={setShowTimelineModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Product Release Timeline & Milestones
            </DialogTitle>
            <DialogDescription>Milestone history and scheduled launch events</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            {rec.releaseTimeline.map((ms) => (
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

export default ProductReleasePage;
