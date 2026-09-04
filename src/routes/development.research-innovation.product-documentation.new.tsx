import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, type ReactNode } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/erp/AppShell";
import {
  FileText,
  Download,
  Upload,
  Save,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  ChevronRight,
  Eye,
  Plus,
  Sparkles,
  FileCode,
  FileSpreadsheet,
  MoreHorizontal,
  Layers,
  Check,
  X,
  Clock,
  HelpCircle,
  Search,
  FileCheck,
  Award,
  ListChecks,
  FileArchive,
  ChevronDown,
  User,
  AlertCircle,
  Info,
  BookOpen,
  Send,
  FolderPlus,
  Printer,
  History as HistoryIcon,
  Workflow,
  Sparkle,
  ArrowRight,
  ShieldCheck,
  Box,
  Activity,
  Maximize2,
  Share2,
  UserCheck,
  Calendar,
  Cpu,
  Factory,
  Paperclip,
  BarChart2,
  Trash2,
} from "lucide-react";

import { productDocumentationService } from "@/services/productDocumentationService";
import type {
  ProductDocumentationApprovalDecision,
  ProductDocumentationFormInput,
  ProductDocumentationRecord,
  ProductDocFileItem,
  ProductDocAttachment,
} from "@/services/types";
import { ResearchInnovationTabBar } from "@/components/erp/ResearchInnovationTabBar";
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
  "/development/research-innovation/product-documentation/new"
)({
  component: ProductDocumentationPage,
});

export function ProductDocumentationFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ProductDocumentationPage {...props} />;
}

export function ProductDocumentationNewPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <ProductDocumentationPage {...props} />;
}


/* Helper component for SVG Circular Gauge */
function CircularScoreGauge({
  score,
  size = 72,
  strokeWidth = 6,
  label,
  sublabel,
  color = "#10B981", // Emerald green default
  showPercentage = false,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  showPercentage?: boolean;
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
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
          <span className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 flex items-baseline justify-center">
            {score}
            <span className="text-xs font-bold ml-0.5">%</span>
          </span>
        </div>
      </div>
      {label && <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</span>}
      {sublabel && <span className="text-[10px] text-slate-500">{sublabel}</span>}
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
  if (n.endsWith(".doc") || n.endsWith(".docx")) {
    return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
  }
  if (n.endsWith(".js") || n.endsWith(".ts") || n.endsWith(".py") || n.endsWith(".cpp")) {
    return <FileCode className="h-4 w-4 text-purple-500 shrink-0" />;
  }
  return <FileText className="h-4 w-4 text-blue-500 shrink-0" />;
}

export function ProductDocumentationPage({
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
  const [showCreateDocDialog, setShowCreateDocDialog] = useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showAuditLogDrawer, setShowAuditLogDrawer] = useState(false);
  const [showReleasePackageModal, setShowReleasePackageModal] = useState(false);
  const [showAiAnalyzerModal, setShowAiAnalyzerModal] = useState(false);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerRole, setNewReviewerRole] = useState("");
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    type: string;
    size: string;
    version?: string;
  } | null>(null);
  const [linkedEntityModal, setLinkedEntityModal] = useState<{
    type: string;
    id: string;
    title: string;
    route?: string;
  } | null>(null);

  // New file input state for upload modal
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadCategory, setUploadCategory] = useState("Engineering");
  const [uploadFileSize, setUploadFileSize] = useState("2.4 MB");

  // Main Data Query
  const { data: record, isLoading } = useQuery({
    queryKey: ["product-documentation"],
    queryFn: productDocumentationService.fetchRecord,
  });

  // Local state for instant interactive updates
  const [localRecord, setLocalRecord] = useState<ProductDocumentationRecord | null>(null);

  React.useEffect(() => {
    if (record && !localRecord) {
      setLocalRecord(record);
    }
  }, [record, localRecord]);

  const rec = localRecord || record;
  const currentRecord = rec;

  // Local Form state
  const [formData, setFormData] = useState<Partial<ProductDocumentationFormInput>>({
    documentationProject: "",
    productName: "",
    productCategory: "",
    documentTitle: "",
    documentType: "",
    businessPurpose: "",
    documentVersion: "",
    revisionNumber: "",
    ecr: "",
    eco: "",
    effectiveDate: "",
    changeStatus: "",
    revisionSummary: "",
    approvalDecision: "Approved with Conditions",
    reviewComments: "Please incorporate the AI suggestions and re-upload the updated documents.",
    approvalDate: "18 Jun 2024",
    recommendation: "Ready for Product Release",
  });

  // Browser download helper
  const triggerBrowserDownload = (fileName: string, content: string, mimeType = "text/plain;charset=utf-8") => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Toggle Reviewer Decision directly
  const handleToggleReviewerDecision = (index: number) => {
    if (!rec) return;
    const decisions: ProductDocumentationApprovalDecision[] = [
      "Approved",
      "Approved with Conditions",
      "Revision Required",
      "Rejected",
    ];
    const current = rec.reviewers[index]?.decision || "Pending";
    const nextIdx = (decisions.indexOf(current as ProductDocumentationApprovalDecision) + 1) % decisions.length;
    const nextDecision = decisions[nextIdx];
    const updatedReviewers = [...rec.reviewers];
    updatedReviewers[index] = {
      ...updatedReviewers[index],
      decision: nextDecision,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated: ProductDocumentationRecord = { ...rec, reviewers: updatedReviewers };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-documentation"], updated);
    toast.success(`Updated ${updatedReviewers[index].person}'s decision to ${nextDecision}`);
  };

  // Handle Workflow Status Toggle
  const handleStatusChange = (status: string) => {
    if (!rec) return;
    const updated: ProductDocumentationRecord = { ...rec, workflowStatus: status };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-documentation"], updated);
  };

  // Handle Add Reviewer
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerRole.trim() || !rec) {
      toast.error("Please provide reviewer name and role");
      return;
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      role: newReviewerRole,
      person: newReviewerName,
      decision: "Pending" as const,
      date: "-",
      comments: "Pending review",
    };
    const updated: ProductDocumentationRecord = {
      ...rec,
      reviewers: [...rec.reviewers, newRev],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-documentation"], updated);
    setShowAddReviewerModal(false);
    setNewReviewerName("");
    setNewReviewerRole("");
    toast.success(`Added ${newRev.person} to Documentation Review Board`);
  };

  // Handle Delete Attachment
  const handleDeleteAttachment = (id: string, name: string) => {
    if (!rec) return;
    const updated: ProductDocumentationRecord = {
      ...rec,
      attachments: rec.attachments.filter((a) => a.id !== id),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-documentation"], updated);
    toast.success(`Deleted attachment: ${name}`);
  };

  // Handle Upload Attachment
  const handleUploadAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim() || !rec) {
      toast.error("Please enter a file name");
      return;
    }
    const newAtt: ProductDocAttachment = {
      id: `att-${Date.now()}`,
      name: uploadFileName.endsWith(".pdf") || uploadFileName.endsWith(".zip") || uploadFileName.endsWith(".xlsx") ? uploadFileName : `${uploadFileName}.pdf`,
      size: uploadFileSize,
      type: uploadFileName.endsWith(".zip") ? "zip" : uploadFileName.endsWith(".xlsx") ? "xlsx" : "pdf",
      uploadDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated: ProductDocumentationRecord = {
      ...rec,
      attachments: [newAtt, ...rec.attachments],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["product-documentation"], updated);
    setShowUploadDialog(false);
    setUploadFileName("");
    toast.success(`Uploaded ${newAtt.name} to project dossier`);
  };

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<ProductDocumentationFormInput>) =>
      productDocumentationService.saveDraft(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-documentation"] });
      toast.success("Draft saved successfully.");
    },
    onError: (err: any) => toast.error(`Failed to save draft: ${err.message}`),
  });

  // Submit Mutation
  const submitMutation = useMutation({
    mutationFn: () => productDocumentationService.submitForReview(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-documentation"] });
      toast.success("Documentation submitted for review (Stage 3).");
    },
    onError: (err: any) => toast.error(`Failed to submit: ${err.message}`),
  });

  // Review Decision Mutation
  const reviewMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: ProductDocumentationApprovalDecision;
      comments?: string;
    }) => productDocumentationService.reviewDecision(args),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-documentation"] });
      if (variables.decision === "Approved") {
        toast.success("Documentation Package Approved & Released to Repository!");
      } else if (variables.decision === "Approved with Conditions") {
        toast.info("Approved with Conditions. Minor updates requested.");
      } else if (variables.decision === "Revision Required") {
        toast.warning("Revision Requested. Returned to Preparation stage.");
      } else {
        toast.error("Documentation Package Rejected & Archived.");
      }
    },
    onError: (err: any) => toast.error(`Review failed: ${err.message}`),
  });

  // Advance Stage Mutation
  const advanceStageMutation = useMutation({
    mutationFn: (targetStage: 1 | 2 | 3) => productDocumentationService.advanceStage(targetStage),
    onSuccess: (_, targetStage) => {
      queryClient.invalidateQueries({ queryKey: ["product-documentation"] });
      toast.success(`Workflow stage set to Stage ${targetStage}`);
    },
  });

  if (isLoading || !currentRecord) {
    return (
      <AppShell
        title="Product Documentation"
        breadcrumb={breadcrumb}
        tabs={tabs ?? <ResearchInnovationTabBar />}
      >
        <div className="flex h-96 w-full items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-muted-foreground">Loading Product Documentation record...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Key Highlights calculation
  const keyHighlights = [
    { label: "All engineering documents are complete", done: rec.engineeringScore >= 90 },
    { label: "Latest test reports uploaded", done: rec.qualityComplianceScore >= 85 },
    { label: "Compliance matrix is up to date", done: rec.qualityComplianceScore >= 88 },
    { label: "AI score indicates high documentation quality", done: rec.aiDocumentationScore >= 85 },
    { label: "Documentation ready for review", done: rec.workflowStatus !== "Draft" },
  ];

  // Helper for workflow status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30">Approved</Badge>;
      case "Approved with Conditions":
        return <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30">Approved with Conditions</Badge>;
      case "In Review":
      case "In Progress":
        return <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30">In Progress</Badge>;
      case "Revision Required":
        return <Badge className="bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30">Revision Required</Badge>;
      case "Rejected":
        return <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AppShell
      title="Product Documentation"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > Product Documentation"}
      description="Centralized repository for technical specs, user manuals, engineering guides, and compliance documentation."
      tabs={tabs ?? <ResearchInnovationTabBar />}
    >
      <div className="space-y-6 pb-16">
      {/* 3. Record Header Bar */}
      <div className="mx-auto max-w-[1600px] px-4 pt-4">
        <Card className="border border-border/80 shadow-xs bg-card mb-4 overflow-hidden rounded-xl">
          {/* TOP ROW: Record Identity, Editable Title, & Action Buttons */}
          <div className="p-4 sm:p-5 pb-4 bg-slate-50/70 dark:bg-slate-900/90 border-b border-border/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Record Identity & Title */}
            <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50 shadow-2xs">
                <FileText className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-border/60">
                    {rec.documentationId}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">•</span>
                  <Badge variant="outline" className="font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-slate-800">
                    {rec.formCode}
                  </Badge>
                  <Badge variant="secondary" className="font-mono text-[11px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                    {rec.documentationVersion}
                  </Badge>
                  {getStatusBadge(rec.workflowStatus)}
                </div>
                {/* Project Title Input with clean hover/focus state */}
                <div className="flex items-center gap-2 w-full">
                  <Input
                    value={formData.documentationProject || rec.documentationProject}
                    onChange={(e) => setFormData((prev) => ({ ...prev, documentationProject: e.target.value }))}
                    title={formData.documentationProject || rec.documentationProject}
                    className="h-8 text-sm sm:text-base font-bold text-foreground bg-transparent hover:bg-white dark:hover:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus:border-primary shadow-none px-2 py-0 transition-all rounded-md w-full min-w-0"
                    placeholder="Documentation Project Name..."
                  />
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => saveDraftMutation.mutate(formData)}
                disabled={saveDraftMutation.isPending}
                className="gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-700"
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
                        toast.success("Expedited review reminder dispatched to Documentation Review Board.");
                      }}
                      className="cursor-pointer"
                    >
                      <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        handleStatusChange("In Progress");
                        toast.info("Status reverted to In Progress. You can now modify documentation files.");
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
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-white dark:bg-slate-800 shadow-2xs">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 text-xs shadow-lg">
                  <DropdownMenuItem onClick={() => setShowWorkflowModal(true)} className="gap-2 cursor-pointer">
                    <Workflow className="h-4 w-4 text-blue-600" />
                    Workflow Engine (3 Stages)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowReleasePackageModal(true)} className="gap-2 cursor-pointer">
                    <Download className="h-4 w-4 text-blue-600" />
                    Download Release Package (.ZIP)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAiAnalyzerModal(true)} className="gap-2 cursor-pointer">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    Run AI Document Analysis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowHistoryDrawer(true)} className="gap-2 cursor-pointer">
                    <FileCheck className="h-4 w-4 text-emerald-600" />
                    Version History
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowAuditLogDrawer(true)} className="gap-2 cursor-pointer">
                    <HistoryIcon className="h-4 w-4 text-slate-600" />
                    View Audit Log
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                    toast.success("Exporting Summary PDF...");
                    window.print();
                  }} className="gap-2 cursor-pointer">
                    <Printer className="h-4 w-4 text-slate-600" />
                    Print / Export PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Documentation record link copied to clipboard!");
                  }} className="gap-2 cursor-pointer">
                    <Share2 className="h-4 w-4 text-slate-600" />
                    Share Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* BOTTOM ROW: Key-Value Structured Metadata Ribbon */}
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
                    type: "Linked Product",
                    id: rec.linkedProduct.code || "PRD-2024-0009",
                    title: rec.linkedProduct.name,
                    route: "/development/research-innovation/bom-engineering/new",
                  })
                }
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer font-mono"
              >
                <span className="truncate">{rec.linkedProduct.name}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* Linked Certification */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" /> Certification
              </span>
              <button
                type="button"
                onClick={() =>
                  setLinkedEntityModal({
                    type: "Certification Readiness",
                    id: rec.linkedCertification.code,
                    title: "Automotive Safety & CE Certification Readiness",
                    route: "/development/research-innovation/certification-readiness/new",
                  })
                }
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 text-left truncate cursor-pointer font-mono"
              >
                <span className="truncate">{rec.linkedCertification.code}</span>
                <ExternalLink className="h-3 w-3 shrink-0 opacity-70" />
              </button>
            </div>

            {/* Document Owner */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <User className="h-3 w-3 text-slate-400" /> Owner
              </span>
              <span className="font-semibold text-foreground truncate">{rec.documentOwner.name}</span>
            </div>

            {/* Documentation Engineer */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                <UserCheck className="h-3 w-3 text-emerald-500" /> Engineer
              </span>
              <span className="font-semibold text-foreground truncate">{rec.documentationEngineer.name}</span>
            </div>

            {/* Quality Manager */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium">Quality Mgr</span>
              <span className="font-semibold text-foreground truncate">{rec.qualityManager.name}</span>
            </div>

            {/* Development Stage */}
            <div className="flex flex-col gap-0.5 sm:px-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium">Stage</span>
              <Badge variant="secondary" className="font-semibold w-fit px-1.5 py-0 text-[10px]">
                {rec.developmentStage}
              </Badge>
            </div>

            {/* Confidentiality & Created */}
            <div className="flex flex-col gap-0.5 sm:pl-2 pt-2 sm:pt-0">
              <span className="text-[11px] text-muted-foreground font-medium">Confidentiality</span>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="font-semibold px-1.5 py-0 text-[10px]">
                  {rec.confidentialityLevel}
                </Badge>
                <span className="text-[10px] text-muted-foreground truncate">{rec.createdOn}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* 3-Stage Interactive Stage Stepper Bar */}
        <div className="mb-4 rounded-xl border border-blue-200/60 bg-blue-50/40 dark:bg-blue-950/20 p-3 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                3-Stage Release Workflow Lifecycle
              </span>
            </div>
            <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              Current: <strong className="font-bold">{rec.workflowStageLabel}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* Stage 1 */}
            <button
              type="button"
              onClick={() => advanceStageMutation.mutate(1)}
              className={`flex items-start gap-2.5 rounded-lg p-2.5 text-left border transition-all cursor-pointer ${
                rec.stage === 1
                  ? "bg-white dark:bg-slate-900 border-blue-500 shadow-xs ring-2 ring-blue-500/20"
                  : rec.stage > 1
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                  : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  rec.stage === 1
                    ? "bg-blue-600 text-white"
                    : rec.stage > 1
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                }`}
              >
                {rec.stage > 1 ? <Check className="h-3.5 w-3.5" /> : "1"}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Stage 1: Documentation Preparation</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Aggregate multi-stream engineering, BOM & quality docs. Trigger AI analysis.
                </p>
              </div>
            </button>

            {/* Stage 2 */}
            <button
              type="button"
              onClick={() => advanceStageMutation.mutate(2)}
              className={`flex items-start gap-2.5 rounded-lg p-2.5 text-left border transition-all cursor-pointer ${
                rec.stage === 2
                  ? "bg-white dark:bg-slate-900 border-blue-500 shadow-xs ring-2 ring-blue-500/20"
                  : rec.stage > 2
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                  : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  rec.stage === 2
                    ? "bg-blue-600 text-white"
                    : rec.stage > 2
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                }`}
              >
                {rec.stage > 2 ? <Check className="h-3.5 w-3.5" /> : "2"}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Stage 2: Version Control & Review</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Publish version v1.2.0 package, update PLM baseline & validate release integrity.
                </p>
              </div>
            </button>

            {/* Stage 3 */}
            <button
              type="button"
              onClick={() => advanceStageMutation.mutate(3)}
              className={`flex items-start gap-2.5 rounded-lg p-2.5 text-left border transition-all cursor-pointer ${
                rec.stage === 3
                  ? "bg-white dark:bg-slate-900 border-blue-500 shadow-xs ring-2 ring-blue-500/20"
                  : "bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  rec.stage === 3 ? "bg-blue-600 text-white" : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                }`}
              >
                3
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Stage 3: Review & Release Decision</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Review Board decision: Approved / Conditional / Revision / Rejected → Release Package.
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Dashboard Grid Layout */}
      <div className="mx-auto max-w-[1600px] px-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Main Content Column */}
          <div className="lg:col-span-9 space-y-6">
            {/* ------------------------------------------------------------- */}
            {/* PANEL 1: Documentation Overview */}
            {/* ------------------------------------------------------------- */}
            <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <CardTitle className="text-base font-bold">Documentation Overview</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.productName || rec.productName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, productName: e.target.value }))}
                      className="h-8 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      Document Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      value={formData.documentTitle || rec.documentTitle}
                      onChange={(e) => setFormData((prev) => ({ ...prev, documentTitle: e.target.value }))}
                      className="h-8 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      Product Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.productCategory || rec.productCategory}
                      onChange={(e) => setFormData((prev) => ({ ...prev, productCategory: e.target.value }))}
                      className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                    >
                      <option value="AC EV Charger">AC EV Charger</option>
                      <option value="DC Fast Charger">DC Fast Charger</option>
                      <option value="Industrial Power Module">Industrial Power Module</option>
                      <option value="Smart Energy System">Smart Energy System</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                      Document Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.documentType || rec.documentType}
                      onChange={(e) => setFormData((prev) => ({ ...prev, documentType: e.target.value }))}
                      className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary font-medium"
                    >
                      <option value="Technical Specification">Technical Specification</option>
                      <option value="Release Dossier">Release Dossier</option>
                      <option value="Compliance Package">Compliance Package</option>
                      <option value="Customer Manual Package">Customer Manual Package</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                    Business Purpose <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    rows={3}
                    value={formData.businessPurpose || rec.businessPurpose}
                    onChange={(e) => setFormData((prev) => ({ ...prev, businessPurpose: e.target.value }))}
                    className="text-xs resize-none"
                    placeholder="Provide complete technical specifications, design details, and operational guidelines."
                  />
                </div>
              </CardContent>
            </Card>

                {/* Grid for Document Collection Cards (Panels 2 to 5) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 2: Engineering Documentation */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-base font-bold">Engineering Documentation</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                            7 Files
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4">
                        <div className="space-y-2">
                          {rec.engineeringDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 py-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                {getFileIcon(doc.type, doc.name)}
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={doc.name}>
                                  {doc.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[11px] text-muted-foreground mr-1">{doc.size}</span>
                                <span className="rounded bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 mr-1">
                                  {doc.version}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDocument({ name: doc.name, type: doc.type, size: doc.size, version: doc.version })}
                                  className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                  title="Preview Document"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerBrowserDownload(
                                      doc.name,
                                      `=======================================================\nDOCUMENT: ${doc.name}\nVERSION: ${doc.version}\nSTREAM: Engineering Documentation\nPRODUCT: ${rec.productName}\nINTEGRITY SHA-256: 7a9e102f89b456da87ec1209fb342e67a41289de6b2019f8564\nSTATUS: Active & Verified\n=======================================================`
                                    );
                                    toast.success(`Downloading ${doc.name}`);
                                  }}
                                  className="text-slate-500 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                                  title="Download File"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Engineering Documentation Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.engineeringScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>

                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 3: Manufacturing Documentation */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Factory className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-base font-bold">Manufacturing Documentation</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                            6 Files
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4">
                        <div className="space-y-2">
                          {rec.manufacturingDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 py-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                {getFileIcon(doc.type, doc.name)}
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={doc.name}>
                                  {doc.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[11px] text-muted-foreground mr-1">{doc.size}</span>
                                <span className="rounded bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 mr-1">
                                  {doc.version}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDocument({ name: doc.name, type: doc.type, size: doc.size, version: doc.version })}
                                  className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                  title="Preview Document"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerBrowserDownload(
                                      doc.name,
                                      `=======================================================\nDOCUMENT: ${doc.name}\nVERSION: ${doc.version}\nSTREAM: Manufacturing Documentation\nPRODUCT: ${rec.productName}\nINTEGRITY SHA-256: 7a9e102f89b456da87ec1209fb342e67a41289de6b2019f8564\nSTATUS: Active & Verified\n=======================================================`
                                    );
                                    toast.success(`Downloading ${doc.name}`);
                                  }}
                                  className="text-slate-500 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                                  title="Download File"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Manufacturing Documentation Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.manufacturingScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>

                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 4: Quality & Compliance Documentation */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-base font-bold">Quality & Compliance Documentation</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                            6 Files
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4">
                        <div className="space-y-2">
                          {rec.qualityComplianceDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 py-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                {getFileIcon(doc.type, doc.name)}
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={doc.name}>
                                  {doc.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[11px] text-muted-foreground mr-1">{doc.size}</span>
                                <span className="rounded bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 mr-1">
                                  {doc.version}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDocument({ name: doc.name, type: doc.type, size: doc.size, version: doc.version })}
                                  className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                  title="Preview Document"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerBrowserDownload(
                                      doc.name,
                                      `=======================================================\nDOCUMENT: ${doc.name}\nVERSION: ${doc.version}\nSTREAM: Quality & Compliance Documentation\nPRODUCT: ${rec.productName}\nINTEGRITY SHA-256: 7a9e102f89b456da87ec1209fb342e67a41289de6b2019f8564\nSTATUS: Active & Verified\n=======================================================`
                                    );
                                    toast.success(`Downloading ${doc.name}`);
                                  }}
                                  className="text-slate-500 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                                  title="Download File"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Compliance Documentation Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.qualityComplianceScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>

                  {/* ------------------------------------------------------------- */}
                  {/* PANEL 5: Customer Documentation */}
                  {/* ------------------------------------------------------------- */}
                  <Card className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
                    <div>
                      <CardHeader className="pb-3 border-b border-border/60">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                            <CardTitle className="text-base font-bold">Customer Documentation</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800">
                            6 Files
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-3 pb-2 px-4">
                        <div className="space-y-2">
                          {rec.customerDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 py-2 text-xs transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
                            >
                              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                {getFileIcon(doc.type, doc.name)}
                                <span className="font-medium text-slate-800 dark:text-slate-200 truncate" title={doc.name}>
                                  {doc.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className="text-[11px] text-muted-foreground mr-1">{doc.size}</span>
                                <span className="rounded bg-slate-200/70 dark:bg-slate-700 px-1.5 py-0.5 text-[10px] font-semibold text-slate-700 dark:text-slate-300 mr-1">
                                  {doc.version}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedDocument({ name: doc.name, type: doc.type, size: doc.size, version: doc.version })}
                                  className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                  title="Preview Document"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    triggerBrowserDownload(
                                      doc.name,
                                      `=======================================================\nDOCUMENT: ${doc.name}\nVERSION: ${doc.version}\nSTREAM: Customer Documentation\nPRODUCT: ${rec.productName}\nINTEGRITY SHA-256: 7a9e102f89b456da87ec1209fb342e67a41289de6b2019f8564\nSTATUS: Active & Verified\n=======================================================`
                                    );
                                    toast.success(`Downloading ${doc.name}`);
                                  }}
                                  className="text-slate-500 hover:text-blue-600 transition-colors p-1 cursor-pointer"
                                  title="Download File"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </div>

                    {/* Computed Score Footer Tile */}
                    <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Customer Documentation Score
                      </span>
                      <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                        <span>{rec.customerScore}</span>
                        <span className="text-xs font-normal opacity-80">/100</span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 6: Version Control & Change Management */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Workflow className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-base font-bold">Version Control & Change Management</CardTitle>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-mono font-bold">
                        ECR / ECO Linked
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-9 space-y-4 text-xs">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              Document Version
                            </label>
                            <Input
                              value={formData.documentVersion || rec.documentationVersion}
                              onChange={(e) => setFormData((prev) => ({ ...prev, documentVersion: e.target.value }))}
                              className="h-8 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              Revision Number
                            </label>
                            <Input
                              value={formData.revisionNumber || rec.revisionNumber}
                              onChange={(e) => setFormData((prev) => ({ ...prev, revisionNumber: e.target.value }))}
                              className="h-8 text-xs font-semibold"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              ECR Link
                            </label>
                            <div className="flex items-center gap-1">
                              <Input
                                value={formData.ecr || rec.ecr}
                                onChange={(e) => setFormData((prev) => ({ ...prev, ecr: e.target.value }))}
                                className="h-8 text-xs font-mono text-blue-600"
                              />
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => toast.info(`Opening ECR record: ${rec.ecr}`)}>
                                <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              ECO Link
                            </label>
                            <div className="flex items-center gap-1">
                              <Input
                                value={formData.eco || rec.eco}
                                onChange={(e) => setFormData((prev) => ({ ...prev, eco: e.target.value }))}
                                className="h-8 text-xs font-mono text-blue-600"
                              />
                              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => toast.info(`Opening ECO record: ${rec.eco}`)}>
                                <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              Effective Date <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="text"
                              value={formData.effectiveDate || rec.effectiveDate}
                              onChange={(e) => setFormData((prev) => ({ ...prev, effectiveDate: e.target.value }))}
                              className="h-8 text-xs"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                              Change Status
                            </label>
                            <select
                              value={formData.changeStatus || rec.changeStatus}
                              onChange={(e) => setFormData((prev) => ({ ...prev, changeStatus: e.target.value }))}
                              className="h-8 w-full rounded-md border border-input bg-background px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <option value="Active">Active</option>
                              <option value="Draft">Draft</option>
                              <option value="Superseded">Superseded</option>
                              <option value="Pending Approval">Pending Approval</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                            Revision Summary <span className="text-red-500">*</span>
                          </label>
                          <Textarea
                            rows={2}
                            value={formData.revisionSummary || rec.revisionSummary}
                            onChange={(e) => setFormData((prev) => ({ ...prev, revisionSummary: e.target.value }))}
                            className="text-xs resize-none"
                          />
                        </div>
                      </div>

                      {/* Score Badge Card */}
                      <div className="md:col-span-3 flex flex-col items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 text-center">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">Version Control Score</span>
                        <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-4 py-2 rounded-lg font-bold text-xl">
                          <span>{rec.versionControlScore}</span>
                          <span className="text-xs font-normal opacity-80">/100</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-2">Full ECR/ECO traceability intact.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 7: AI Documentation Assessment */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                          7
                        </div>
                        <CardTitle className="text-base font-bold">AI Documentation Assessment</CardTitle>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 gap-1 border-purple-200">
                        <Sparkles className="h-3 w-3 text-purple-600" />
                        AI Agent Generated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-9 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                            AI Completeness Review
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                            {rec.aiCompletenessReview}
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                            AI Missing Document Analysis
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                            {rec.aiMissingDocumentAnalysis}
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                            AI Cross-reference Validation
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                            {rec.aiCrossReferenceValidation}
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                            AI Document Consistency Review
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                            {rec.aiDocumentConsistencyReview}
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-amber-200/80 dark:border-amber-900/40 p-2.5 bg-amber-50/40 dark:bg-amber-950/20">
                          <span className="font-semibold text-amber-900 dark:text-amber-300 w-1/3">
                            AI Improvement Suggestions
                          </span>
                          <span className="text-amber-800 dark:text-amber-200 font-medium flex-1">
                            {rec.aiImprovementSuggestions}
                          </span>
                          <Sparkles className="h-4 w-4 text-amber-600 shrink-0 ml-2" />
                        </div>
                      </div>

                      {/* AI Graphic Icon Card */}
                      <div className="md:col-span-3 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-purple-200/60 dark:border-slate-700 p-4 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold shadow-sm mb-2">
                          AI
                        </div>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">AI Documentation Score</span>
                        <div className="mt-2 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-bold text-lg">
                          <span>{rec.aiDocumentationScore}</span>
                          <span className="text-xs font-normal opacity-80">/100</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 8: Documentation Summary */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                          8
                        </div>
                        <CardTitle className="text-base font-bold">Documentation Summary</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs bg-slate-50 dark:bg-slate-800 font-semibold">
                        Single Source of Truth Gauges
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6 pb-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 items-center justify-items-center">
                      <CircularScoreGauge
                        score={rec.engineeringScore}
                        label="Engineering Docs"
                        color="#10B981"
                      />
                      <CircularScoreGauge
                        score={rec.manufacturingScore}
                        label="Manufacturing Docs"
                        color="#10B981"
                      />
                      <CircularScoreGauge
                        score={rec.qualityComplianceScore}
                        label="Compliance Docs"
                        color="#10B981"
                      />
                      <CircularScoreGauge
                        score={rec.customerScore}
                        label="Customer Docs"
                        color="#10B981"
                      />
                      {/* Overall Documentation Score — Larger Gauge */}
                      <div className="col-span-2 sm:col-span-1 flex flex-col items-center">
                        <CircularScoreGauge
                          score={rec.overallDocumentationScore}
                          size={96}
                          strokeWidth={8}
                          label="Overall Documentation Score"
                          color="#059669"
                        />
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Recommendation:</span>
                        <select
                          value={formData.recommendation || rec.recommendation}
                          onChange={(e) => setFormData((prev) => ({ ...prev, recommendation: e.target.value }))}
                          className="h-8 rounded-md border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 text-xs font-bold text-emerald-800 dark:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        >
                          <option value="Ready for Product Release">Ready for Product Release</option>
                          <option value="Requires Minor Updates">Requires Minor Updates</option>
                          <option value="Pending Board Decision">Pending Board Decision</option>
                          <option value="Not Recommended">Not Recommended</option>
                        </select>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        All 4 upstream documentation streams verified against standards.
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 9: Attachments */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                          9
                        </div>
                        <CardTitle className="text-base font-bold">Attachments</CardTitle>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowUploadDialog(true)}
                        className="gap-1.5 text-xs"
                      >
                        <Upload className="h-3.5 w-3.5 text-blue-600" />
                        Upload Attachment
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                      {rec.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
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
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedDocument({ name: att.name, type: att.type, size: att.size })}
                              className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Preview Attachment"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                triggerBrowserDownload(
                                  att.name,
                                  `=======================================================\nATTACHMENT: ${att.name}\nTYPE: ${att.type}\nSIZE: ${att.size}\nDOCUMENT RECORD: ${rec.documentationId}\nPRODUCT: ${rec.productName}\nINTEGRITY SHA-256: 4f8b92c10a8d76ef32a19e830c239d48291a0c847d9b23e4\nSTATUS: Attached to Master Dossier\n=======================================================`
                                );
                                toast.success(`Downloading ${att.name}`);
                              }}
                              className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
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
                        View All Attachments (15) <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 10: Review & Approval */}
                {/* ------------------------------------------------------------- */}
                <Card id="section-review" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                          10
                        </div>
                        <CardTitle className="text-base font-bold">Review & Approval</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold">
                          Documentation Review Board
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
                  <CardContent className="pt-4 space-y-6">
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2.5">
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
                                    ? "bg-teal-100 text-teal-800 dark:bg-teal-950/60 text-[9px] font-bold"
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
                              approvalDecision: e.target.value as ProductDocumentationApprovalDecision,
                            }))
                          }
                          className="h-9 w-full rounded-md border border-input bg-background px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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

                      <div className="md:col-span-3">
                        <label className="font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                          Approval Date <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="text"
                          value={formData.approvalDate || rec.approvalDate}
                          onChange={(e) => setFormData((prev) => ({ ...prev, approvalDate: e.target.value }))}
                          className="h-9 text-xs"
                        />
                        <Button
                          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
                          onClick={() =>
                            reviewMutation.mutate({
                              id: rec.id,
                              decision: formData.approvalDecision || rec.approvalDecision,
                              comments: formData.reviewComments || rec.reviewComments,
                            })
                          }
                          disabled={reviewMutation.isPending}
                        >
                          Submit Decision
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* ------------------------------------------------------------- */}
                {/* PANEL 11: System Information */}
                {/* ------------------------------------------------------------- */}
                <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HistoryIcon className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-base font-bold">System Information</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">
                        Audit Trail Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                      {/* Left Read-only Audit Fields */}
                      <div className="md:col-span-8 grid grid-cols-2 gap-y-3 gap-x-6">
                        <div>
                          <span className="text-muted-foreground block font-medium">Created By</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.createdBy}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Created Date</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{rec.createdDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Last Modified By</span>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{rec.lastModifiedBy}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Last Modified Date</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{rec.lastModifiedDate}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Workflow Stage</span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">{rec.workflowStageLabel}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground block font-medium">Version</span>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rec.documentationVersion}</span>
                        </div>
                      </div>

                      {/* Right History Links */}
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
                          onClick={() => setShowHistoryDrawer(true)}
                          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                        >
                          <span>View History</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowChangesModal(true)}
                          className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                        >
                          <span>View Changes</span>
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

          {/* Right Sticky Sidebar Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="sticky top-6 space-y-4">
              {/* Overall Documentation Score Gauge Card */}
              <Card className="border-border bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="pb-2 border-b border-border/60">
                  <CardTitle className="text-sm font-bold">Overall Documentation Score</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col items-center">
                  <CircularScoreGauge
                    score={rec.overallDocumentationScore}
                    size={110}
                    strokeWidth={10}
                    color="#059669"
                  />

                  {/* Breakdown List */}
                  <div className="w-full mt-4 space-y-2 text-xs border-t border-border/60 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Engineering Docs</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.engineeringScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Manufacturing Docs</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.manufacturingScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Compliance Docs</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.qualityComplianceScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Customer Docs</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.customerScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Version Control</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{rec.versionControlScore}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* DIALOGS & MODALS */}
      {/* --------------------------------------------------------------------- */}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Upload Document
            </DialogTitle>
            <DialogDescription>
              Add engineering, manufacturing, compliance, or customer files to this documentation package.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3 text-xs">
            <div>
              <label className="font-semibold block mb-1">Document Category</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full h-8 rounded-md border px-3 text-xs"
              >
                <option value="Engineering">Engineering Documentation</option>
                <option value="Manufacturing">Manufacturing Documentation</option>
                <option value="Compliance">Quality & Compliance</option>
                <option value="Customer">Customer Documentation</option>
                <option value="General">General Attachment</option>
              </select>
            </div>
            <div>
              <label className="font-semibold block mb-1">File Name</label>
              <Input
                placeholder="e.g., Extended_Testing_Matrix_v1.2.pdf"
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 p-6 bg-slate-50 dark:bg-slate-800/40">
              <Upload className="h-8 w-8 text-slate-400 mb-2" />
              <p className="font-medium text-slate-700 dark:text-slate-300">Drag & Drop files or Browse</p>
              <p className="text-[10px] text-muted-foreground mt-1">Supports PDF, ZIP, XLSX, CAD, DOCX (Max 50MB)</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white cursor-pointer"
              onClick={handleUploadAttachment}
            >
              Upload & Process
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create New Document Modal */}
      <Dialog open={showCreateDocDialog} onOpenChange={setShowCreateDocDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              Create New Document
            </DialogTitle>
            <DialogDescription>
              Author a new document directly in the Documentation Management System.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Document Title</label>
              <Input placeholder="e.g. Field Maintenance Manual Supplement" className="h-8 text-xs" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Document Type</label>
              <Input placeholder="e.g. Maintenance Guide" className="h-8 text-xs" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowCreateDocDialog(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 text-white"
              onClick={() => {
                toast.success("Document created and opened in authoring editor!");
                setShowCreateDocDialog(false);
              }}
            >
              Create Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Templates Modal */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Document Templates Library
            </DialogTitle>
            <DialogDescription>
              Select an enterprise-approved template for standard compliance and user manuals.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div className="p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">ISO 9001 Technical Construction Dossier</p>
                <p className="text-[11px] text-muted-foreground">Standard template for certification readiness.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => { toast.success("Template applied!"); setShowTemplatesDialog(false); }}>
                Use Template
              </Button>
            </div>
            <div className="p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">IEC 61851 Customer User Manual</p>
                <p className="text-[11px] text-muted-foreground">Pre-formatted user guide template with safety callouts.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => { toast.success("Template applied!"); setShowTemplatesDialog(false); }}>
                Use Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Document Analyzer Modal */}
      <Dialog open={showAiAnalyzerModal} onOpenChange={setShowAiAnalyzerModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              AI Documentation Intelligence Agent
            </DialogTitle>
            <DialogDescription>
              Automated completeness, cross-reference validation, and consistency checks across 4 streams.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3 text-xs">
            <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg border border-purple-200">
              <p className="font-bold text-purple-900 dark:text-purple-300">Analysis Summary</p>
              <p className="text-purple-800 dark:text-purple-200 mt-1">
                AI verified 25 uploaded files. All cross-references between PRD and Schematics match perfectly. Score: <strong>90/100</strong>.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold">Key Recommendation:</p>
              <p className="text-muted-foreground">• Add exploded 3D assembly diagram in Section 4 of User Manual for complete clarity.</p>
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" className="bg-purple-600 text-white" onClick={() => setShowAiAnalyzerModal(false)}>
              Close Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Release Package Modal */}
      <Dialog open={showReleasePackageModal} onOpenChange={setShowReleasePackageModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-emerald-600" />
              Download Product Release Package
            </DialogTitle>
            <DialogDescription>
              Export full multi-stream documentation package ZIP for release.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-3 text-xs">
            <p className="font-semibold text-slate-800 dark:text-slate-200">Package Contents (v1.2.0):</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Engineering Dossier (7 files)</li>
              <li>Manufacturing & BOM Package (6 files)</li>
              <li>Quality & Compliance Matrix (6 files)</li>
              <li>Customer & Service Manuals (6 files)</li>
              <li>AI Completeness Report (.PDF)</li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setShowReleasePackageModal(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 text-white"
              onClick={() => {
                toast.success("Downloading Release Package DOC-2024-0087_v1.2.0.zip...");
                setShowReleasePackageModal(false);
              }}
            >
              Download (.ZIP 68.4 MB)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Workflow Engine Modal */}
      <Dialog open={showWorkflowModal} onOpenChange={setShowWorkflowModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              End-to-End Documentation Lifecycle Workflow (3 Stages)
            </DialogTitle>
            <DialogDescription>
              Multi-stream aggregation from Product Requirements, Engineering, Testing, and Certification.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-3 text-xs">
            <div className="grid grid-cols-3 gap-3 text-center font-bold">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-lg border border-blue-200">
                <span className="text-blue-600 font-extrabold text-sm block">Stage 1</span>
                Preparation & AI Analysis
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-lg border border-blue-200">
                <span className="text-blue-600 font-extrabold text-sm block">Stage 2</span>
                Version Control & Baseline
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-950/60 rounded-lg border border-blue-200">
                <span className="text-blue-600 font-extrabold text-sm block">Stage 3</span>
                Review Board & Release
              </div>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Workflow Outcomes (Stage 3):</strong>
              <br />
              • <strong>Approved:</strong> Documentation published to Enterprise Repository & Product Release unlocked.
              <br />
              • <strong>Approved with Conditions:</strong> Minor document updates needed; remains editable.
              <br />
              • <strong>Revision Required:</strong> Returns to Stage 1 for documentation package modification.
              <br />
              • <strong>Rejected:</strong> Project closed & archived.
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowWorkflowModal(false)}>
              Close Diagram
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Log Drawer Dialog */}
      <Dialog open={showAuditLogDrawer} onOpenChange={setShowAuditLogDrawer}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <HistoryIcon className="h-5 w-5 text-blue-600" />
              System Audit Trail Log
            </DialogTitle>
            <DialogDescription>
              Complete immutable audit history for DOC-2024-0087.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs max-h-96 overflow-y-auto">
            {rec.auditTrail.map((aud) => (
              <div key={aud.id} className="p-2.5 border-b border-border/60">
                <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200">
                  <span>{aud.action}</span>
                  <span className="text-muted-foreground font-normal">{aud.timestamp}</span>
                </div>
                <p className="text-muted-foreground mt-1">{aud.details}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">By {aud.user} ({aud.ipAddress || '192.168.1.42'})</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Version History Drawer Dialog */}
      <Dialog open={showHistoryDrawer} onOpenChange={setShowHistoryDrawer}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-emerald-600" />
              Document Version History
            </DialogTitle>
            <DialogDescription>
              Previous published versions of this documentation package.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2 text-xs">
            <div className="p-3 border rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 flex justify-between items-center">
              <div>
                <p className="font-bold text-emerald-900 dark:text-emerald-300">v1.2.0 (Current Baseline)</p>
                <p className="text-[11px] text-muted-foreground">Published 18 Jun 2024 • R2 Revision</p>
              </div>
              <Badge className="bg-emerald-600 text-white">Active</Badge>
            </div>
            <div className="p-3 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800 dark:text-slate-200">v1.1.0 (Prototype Baseline)</p>
                <p className="text-[11px] text-muted-foreground">Published 10 May 2024 • R1 Revision</p>
              </div>
              <Button size="sm" variant="ghost" onClick={() => toast.info("Viewing v1.1.0 snapshot")}>
                View
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Modal */}
      <Dialog open={showSearchModal} onOpenChange={setShowSearchModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-blue-600" />
              Document Repository Search
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <Input placeholder="Search documents across all engineering streams..." className="h-9 text-xs" />
            <p className="text-muted-foreground text-[11px]">Type document name, ECR number, or standard keyword...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Preview Modal */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && setSelectedDocument(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Eye className="h-5 w-5 text-blue-600" />
              Document Preview & Integrity Verification
            </DialogTitle>
            <DialogDescription>
              Verified encrypted enterprise dossier snapshot for compliance review.
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4 py-2 text-xs">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-border/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{selectedDocument.name}</h4>
                    <p className="text-muted-foreground text-[11px]">
                      Type: <span className="uppercase font-semibold">{selectedDocument.type}</span> • Size: {selectedDocument.size}
                      {selectedDocument.version ? ` • Version: ${selectedDocument.version}` : ""}
                    </p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 font-semibold text-[10px]">
                  Verified Signature
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100 font-mono text-[11px] leading-relaxed space-y-2">
                <div className="text-emerald-400 font-bold border-b border-slate-700 pb-1 flex justify-between">
                  <span>[PLM REPOSITORY CHECKSUM PASSED]</span>
                  <span className="text-slate-400">SHA-256: 7A9E10...B2019F</span>
                </div>
                <p>FILE NAME: {selectedDocument.name}</p>
                <p>PRODUCT CLUSTER: {rec.productName}</p>
                <p>SECURITY LEVEL: ISO 27001 Restricted Access Tier 2</p>
                <p>WATERMARK: SRI-ERP-CONFIDENTIAL • RELEASE BASELINE {rec.documentationVersion}</p>
                <p className="text-slate-400">
                  --- CONTENT SUMMARY ---
                  <br />
                  Verified against international standards (IEC 61851, ISO 15118, CE Marking). All diagrams, pinout configurations,
                  thermal dissipation tolerances, and customer instructions adhere to release baseline specifications.
                </p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setSelectedDocument(null)}>
              Close Preview
            </Button>
            {selectedDocument && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                onClick={() => {
                  triggerBrowserDownload(
                    selectedDocument.name,
                    `DOCUMENT: ${selectedDocument.name}\nTYPE: ${selectedDocument.type}\nPRODUCT: ${rec.productName}\nSTATUS: Verified Master Dossier\n=======================================================`
                  );
                  toast.success(`Downloaded ${selectedDocument.name}`);
                }}
              >
                <Download className="h-4 w-4" /> Download Original
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Reviewer Modal */}
      <Dialog open={showAddReviewerModal} onOpenChange={setShowAddReviewerModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-600" />
              Add Reviewer to Board
            </DialogTitle>
            <DialogDescription>
              Assign an engineering or quality leader to review this documentation package.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddReviewer} className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold block mb-1">Reviewer Name</label>
              <Input
                placeholder="e.g. Dr. Anand Verma"
                value={newReviewerName}
                onChange={(e) => setNewReviewerName(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Engineering Discipline / Role</label>
              <Input
                placeholder="e.g. Principal Firmware Architect"
                value={newReviewerRole}
                onChange={(e) => setNewReviewerRole(e.target.value)}
                className="h-8 text-xs"
                required
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setShowAddReviewerModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Add to Board
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Changes (ECR / ECO History) Modal */}
      <Dialog open={showChangesModal} onOpenChange={setShowChangesModal}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5 text-blue-600" />
              ECR / ECO Change Management Traceability
            </DialogTitle>
            <DialogDescription>
              Engineering Change Requests and Orders linked to documentation baseline {rec.documentationVersion}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-border space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span className="text-blue-600 font-mono">{rec.ecr}</span>
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-[10px]">Approved</Badge>
              </div>
              <p className="font-semibold text-foreground">Updated AC Type-2 Charging Connector Locking Pinout</p>
              <p className="text-muted-foreground text-[11px]">
                Engineering change to enhance pin contact reliability and heat dissipation during 32A sustained charging.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-border space-y-1">
              <div className="flex justify-between items-center font-bold">
                <span className="text-purple-600 font-mono">{rec.eco}</span>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950/60 text-[10px]">Released</Badge>
              </div>
              <p className="font-semibold text-foreground">ECO Order Release & Service Manual Alignment</p>
              <p className="text-muted-foreground text-[11px]">
                Implemented into BOM v2.1.0 and synchronized with customer troubleshooting instructions.
              </p>
            </div>

            <div className="p-2.5 rounded-md bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-800/60 text-blue-900 dark:text-blue-200 text-[11px]">
              <strong>Traceability Guarantee:</strong> All document modifications are cross-checked with BOM engineering and testing matrices prior to final production release.
            </div>
          </div>
          <DialogFooter>
            <Button size="sm" onClick={() => setShowChangesModal(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Linked Entity Modal */}
      <Dialog open={!!linkedEntityModal} onOpenChange={(open) => !open && setLinkedEntityModal(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              {linkedEntityModal?.type}
            </DialogTitle>
            <DialogDescription>
              Enterprise PLM cross-link to upstream engineering artifact.
            </DialogDescription>
          </DialogHeader>
          {linkedEntityModal && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border">
                <div className="font-mono text-blue-600 font-bold text-sm">{linkedEntityModal.id}</div>
                <div className="font-semibold text-foreground mt-1">{linkedEntityModal.title}</div>
                <div className="text-muted-foreground text-[11px] mt-0.5">Status: Active & Verified</div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setLinkedEntityModal(null)}>
              Close
            </Button>
            {linkedEntityModal?.route && (
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  if (linkedEntityModal.route) navigate(linkedEntityModal.route);
                  setLinkedEntityModal(null);
                }}
              >
                Open Record
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  </AppShell>
);
}

export default ProductDocumentationPage;
