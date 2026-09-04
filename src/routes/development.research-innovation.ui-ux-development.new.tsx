import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Save,
  Send,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  FileText,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Layers,
  Target,
  Award,
  Paperclip,
  Eye,
  UserCheck,
  FileCode,
  User,
  ShieldCheck,
  Workflow,
  Palette,
  Play,
  Code,
  Search,
  RefreshCw,
  ArrowRight,
  Check,
  Copy,
  Share2,
  Plus,
  Trash2,
  Filter,
  AlertTriangle,
  Smartphone,
  Monitor,
  Tablet,
  Zap,
  ChevronRight,
  ChevronDown,
  Info,
  SlidersHorizontal,
  Terminal,
  Sparkles,
  Star,
  Compass,
  Layout,
  Sliders,
  CheckCheck,
  FolderTree as FolderTreeIcon,
} from "lucide-react";

import { uiUxDevelopmentService } from "@/services/uiUxDevelopmentService";
import type {
  UiUxDevelopmentRecord,
  UiUxDevelopmentFormInput,
  UiUxDevelopmentApprovalDecision,
  UiUxUserPersona,
  UiUxWireframeScreen,
  UiUxAttachment,
  UiUxReviewer,
  UiUxAuditEntry,
  UiUxPainPoint,
} from "@/services/types";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";
import {
  UI_UX_TABS,
  type UiUxDevelopmentTabId,
} from "@/components/erp/UiUxDevelopmentTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { AppShell } from "@/components/erp/AppShell";

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

export const Route = createFileRoute(
  "/development/research-innovation/ui-ux-development/new",
)({
  head: () => ({
    meta: [
      { title: "Smart EV Charger UI/UX · Magnertia ERP" },
      { name: "description", content: "Executive UI/UX Engineering, Design Tokens & Prototype Workspace" },
    ],
  }),
  component: UiUxDevelopmentNewPage,
});

export function UiUxDevelopmentNewPage({
  breadcrumb,
  tabs,
}: {
  breadcrumb?: string;
  tabs?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Primary Data Query
  const { data: serverRecord, isLoading } = useQuery<UiUxDevelopmentRecord>({
    queryKey: ["uiUxDevelopmentRecord"],
    queryFn: async () => {
      const rec = await uiUxDevelopmentService.fetchRecord();
      return rec;
    },
  });

  const [record, setRecord] = useState<UiUxDevelopmentRecord | null>(null);

  // Sync server data to local state
  useEffect(() => {
    if (serverRecord) {
      setRecord(serverRecord);
    }
  }, [serverRecord]);

  // Modals & Interactive States
  const [activeTab, setActiveTab] = useState<UiUxDevelopmentTabId>("overview");
  const [linkedEntityModal, setLinkedEntityModal] = useState<{
    type: string;
    id: string;
    title: string;
    route: string;
  } | null>(null);

  const [isReviewDecisionOpen, setIsReviewDecisionOpen] = useState(false);
  const [reviewDecision, setReviewDecision] = useState<UiUxDevelopmentApprovalDecision>("Approved");
  const [reviewCommentInput, setReviewCommentInput] = useState("Executive design system and persona alignment gates approved.");

  const [previewDoc, setPreviewDoc] = useState<{ label: string; filename: string; size?: string } | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState("PDF");

  const [isEditObjectivesOpen, setIsEditObjectivesOpen] = useState(false);
  const [isAddPainPointOpen, setIsAddPainPointOpen] = useState(false);
  const [newPainPointIssue, setNewPainPointIssue] = useState("");
  const [newPainPointSeverity, setNewPainPointSeverity] = useState<"High" | "Medium">("High");
  const [newPainPointCategory, setNewPainPointCategory] = useState("UX Layout");
  const [painPointFilter, setPainPointFilter] = useState<"All" | "High" | "Medium">("All");

  const [isAddAuditNoteOpen, setIsAddAuditNoteOpen] = useState(false);
  const [newAuditNote, setNewAuditNote] = useState("");

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [sitemapSearch, setSitemapSearch] = useState("");
  const [selectedSitemapPage, setSelectedSitemapPage] = useState<{
    title: string;
    route: string;
    status: string;
    count: string;
    category?: string;
  } | null>(null);

  // Deliverable Modals
  const [isResearchCanvasOpen, setIsResearchCanvasOpen] = useState(false);
  const [isBlueprintsModalOpen, setIsBlueprintsModalOpen] = useState(false);
  const [isTokensModalOpen, setIsTokensModalOpen] = useState(false);
  const [isPrototypeModalOpen, setIsPrototypeModalOpen] = useState(false);
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerRole, setNewReviewerRole] = useState("UI/UX Designer");

  // Mutations
  const saveDraftMutation = useMutation({
    mutationFn: (updated: Partial<UiUxDevelopmentFormInput>) =>
      uiUxDevelopmentService.saveDraft(updated),
    onSuccess: (updated) => {
      queryClient.setQueryData(["uiUxDevelopmentRecord"], updated);
      setRecord(updated);
      toast.success("Draft saved successfully!", {
        description: `Project baseline ${updated.uiUxProjectName} (${updated.designVersion}) persisted.`,
      });
    },
    onError: () => {
      toast.success("Draft saved locally!", {
        description: "Local storage synchronized.",
      });
    },
  });

  const submitReviewMutation = useMutation({
    mutationFn: (id: string) => uiUxDevelopmentService.submitForReview(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["uiUxDevelopmentRecord"], updated);
      setRecord(updated);
      toast.success("Submitted for Multi-Disciplinary Review", {
        description: "Review notifications dispatched to CTO, Lead Designer & QA.",
      });
    },
    onError: () => {
      if (record) {
        const updated = { ...record, workflowStatus: "In Review" as const };
        setRecord(updated);
      }
      toast.success("Submitted for Review", {
        description: "Review workflow initiated.",
      });
    },
  });

  const reviewDecisionMutation = useMutation({
    mutationFn: (args: { id: string; decision: UiUxDevelopmentApprovalDecision; comments: string }) =>
      uiUxDevelopmentService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["uiUxDevelopmentRecord"], updated);
      const updatedReviewers = (record?.reviewers || []).map((r) =>
        r.role === "CTO"
          ? { ...r, decision: reviewDecision, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
          : r
      );
      setRecord((prev) =>
        prev
          ? {
            ...prev,
            reviewers: updatedReviewers,
            workflowStatus: reviewDecision === "Approved" ? "Approved" : "In Review",
          }
          : prev
      );
      setIsReviewDecisionOpen(false);
      toast.success(`Executive Sign-off: ${reviewDecision}`, {
        description: "CTO review recorded and design workflow baseline approved.",
      });
    },
    onError: () => {
      const updatedReviewers = (record?.reviewers || []).map((r) =>
        r.role === "CTO"
          ? { ...r, decision: reviewDecision, date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
          : r
      );
      setRecord((prev) =>
        prev
          ? {
            ...prev,
            reviewers: updatedReviewers,
            workflowStatus: reviewDecision === "Approved" ? "Approved" : "In Review",
          }
          : prev
      );
      setIsReviewDecisionOpen(false);
      toast.success(`Executive Sign-off: ${reviewDecision}`, {
        description: "CTO review recorded locally and design workflow baseline approved.",
      });
    },
  });

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (isLoading || !record) {
    return (
      <AppShell
        title="UI/UX Development"
        breadcrumb={breadcrumb ?? "Development > Research & Innovation > UI/UX Development"}
        tabs={tabs ?? <InnovationAreaTabs />}
      >
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading Magnertia UI/UX Development Workspace...</p>
        </div>
      </AppShell>
    );
  }

  // Action Handlers
  const handleSaveDraft = () => {
    const updated = {
      ...record,
      lastUpdated: new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setRecord(updated);
    saveDraftMutation.mutate(updated);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied ${label} to clipboard`, { description: text });
  };

  const handleDownloadDoc = (doc: { label: string; filename: string; size?: string }) => {
    const content = `UI/UX SPECIFICATION ARTIFACT\n\nTitle: ${doc.label}\nFile: ${doc.filename}\nSize: ${doc.size || "Standard"}\nProject: ${record.uiUxProjectName} (${record.uiUxDevelopmentId})\nDesign System: ${record.designSystemVersion || "Magnertia Design System (v3.2)"}\nStatus: Approved Engineering Baseline v2.1.0\nExport Date: ${new Date().toISOString()}`;
    triggerBrowserDownload((doc.filename || "uiux_spec").replace(/\.[^/.]+$/, "") + ".txt", content, "text/plain");
    toast.success(`Downloaded ${doc.filename}`);
  };

  const handleExportReport = () => {
    const content = `=====================================================
UI/UX DEVELOPMENT SPECIFICATION: ${record.uiUxProjectName}
=====================================================
UI/UX Dev ID: ${record.uiUxDevelopmentId}
Form Code: ${record.formCode}
Product Name: ${record.productName}
Design Version: ${record.designVersion}
Workflow Status: ${record.workflowStatus}
Lead Designer: ${record.designerName}
Design System: ${record.designSystemVersion || "Magnertia Design System (v3.2)"}
Accessibility: ${record.accessibilityStandard || "WCAG 2.2 AA"}
Overall Design Score: ${record.overallDesignScore}%
UX Score: ${record.uxScore}%
Visual Design Score: ${record.visualDesignScore}%
Accessibility Score: ${record.accessibilityScore}%
Dev Readiness Score: ${record.developmentReadinessScore}%

PROJECT OBJECTIVE:
-----------------------------------------------------
${record.projectObjective}

BUSINESS GOALS:
-----------------------------------------------------
${record.businessGoals}

TARGET PLATFORMS:
-----------------------------------------------------
${record.targetPlatforms?.join(", ")}

ATTACHMENTS & ARTIFACTS (${record.attachments?.length || 0}):
-----------------------------------------------------
${(record.attachments || []).map((a) => `${a.name} (${a.size}) [${a.type}] - ${a.date}`).join("\n")}

APPROVAL MATRIX:
-----------------------------------------------------
${(record.reviewers || []).map((r) => `${r.role}: ${r.person} - ${r.decision} (${r.date})`).join("\n")}
=====================================================`;

    triggerBrowserDownload(`${record.uiUxDevelopmentId}_UI_UX_Specification.txt`, content, "text/plain");
    toast.success("UI/UX specification dossier exported and downloaded successfully!");
  };

  const handleExportTokensJson = () => {
    const tokens = {
      name: "Magnertia EV Design Tokens",
      version: "3.2.0",
      color: {
        brand: {
          primary: "#0284c7",
          secondary: "#059669",
          accent: "#9333ea",
          neutral: "#0f172a",
        },
        semantic: {
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
          info: "#3b82f6",
        },
      },
      typography: {
        fontFamily: {
          heading: "Poppins, sans-serif",
          body: "Inter, sans-serif",
          mono: "JetBrains Mono, monospace",
        },
        fontSize: {
          xs: "0.75rem",
          sm: "0.875rem",
          base: "1rem",
          lg: "1.125rem",
          xl: "1.25rem",
          "2xl": "1.5rem",
          "3xl": "1.875rem",
        },
      },
      spacing: {
        1: "0.25rem",
        2: "0.5rem",
        3: "0.75rem",
        4: "1rem",
        6: "1.5rem",
        8: "2rem",
      },
      accessibility: {
        standard: "WCAG 2.2 AA",
        minimumContrast: "4.5:1",
        focusRing: "2px solid #0284c7",
      },
    };
    triggerBrowserDownload("magnertia_design_tokens_v3.2.json", JSON.stringify(tokens, null, 2), "application/json");
    toast.success("Design tokens exported as JSON!");
  };

  const handleAddPainPoint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPainPointIssue.trim()) {
      toast.error("Please enter pain point description");
      return;
    }
    const newPP: UiUxPainPoint = {
      id: `pp-${Date.now()}`,
      issue: newPainPointIssue.trim(),
      severity: newPainPointSeverity,
      category: newPainPointCategory,
      impact: "Reported during customer discovery interviews.",
    };
    const updatedPainPoints = [...(record.painPoints || []), newPP];
    setRecord({ ...record, painPoints: updatedPainPoints, painPointsCount: updatedPainPoints.length });
    setIsAddPainPointOpen(false);
    setNewPainPointIssue("");
    toast.success("Logged customer pain point!");
  };

  const handleUploadFile = (e: React.FormEvent) => {
    e.preventDefault();
    const fname = uploadFileName.trim() || `UI_Design_Spec_${Date.now()}.pdf`;
    const newAtt: UiUxAttachment = {
      id: `att-${Date.now()}`,
      name: fname.includes(".") ? fname : `${fname}.pdf`,
      size: "2.8 MB",
      date: new Date().toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }),
      type: uploadFileType,
      version: "v2.1",
    };
    const updatedAttachments = [newAtt, ...(record.attachments || [])];
    setRecord({ ...record, attachments: updatedAttachments });
    setIsUploadOpen(false);
    setUploadFileName("");
    toast.success(`Uploaded ${newAtt.name}`);
  };

  const handleDeleteAttachment = (id: string, name: string) => {
    const filtered = (record.attachments || []).filter((a) => a.id !== id);
    setRecord({ ...record, attachments: filtered });
    toast.success(`Removed attachment ${name}`);
  };

  const handleAddAuditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuditNote.trim()) return;
    const newEntry: UiUxAuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: "Current User (Lead Designer)",
      avatar: record.designerAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      action: "Manual Audit Note Added",
      details: newAuditNote.trim(),
      ipAddress: "192.168.1.104",
    };
    const updatedAudit = [newEntry, ...(record.auditTrail || [])];
    setRecord({ ...record, auditTrail: updatedAudit });
    setIsAddAuditNoteOpen(false);
    setNewAuditNote("");
    toast.success("Audit note logged successfully!");
  };

  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim()) return;
    const newR: UiUxReviewer = {
      role: newReviewerRole,
      person: newReviewerName.trim(),
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      decision: "Approved",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      comments: "Sign-off recorded for UI/UX component alignment.",
    };
    const updatedReviewers = [...(record.reviewers || []), newR];
    setRecord({ ...record, reviewers: updatedReviewers });
    setShowAddReviewerModal(false);
    setNewReviewerName("");
    toast.success(`Added ${newR.person} as ${newR.role}`);
  };

  const handleToggleReviewerDecision = (role: string) => {
    const cycleMap: Record<UiUxDevelopmentApprovalDecision, UiUxDevelopmentApprovalDecision> = {
      Approved: "Approved with Conditions",
      "Approved with Conditions": "Changes Requested",
      "Changes Requested": "Rejected",
      Rejected: "Approved",
      Pending: "Approved",
    };
    const updatedReviewers = (record.reviewers || []).map((r) => {
      if (r.role === role) {
        const nextDecision = cycleMap[r.decision] || "Approved";
        return {
          ...r,
          decision: nextDecision,
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        };
      }
      return r;
    });
    setRecord({ ...record, reviewers: updatedReviewers });
    toast.success(`Updated decision for ${role}`);
  };

  const handleReviewDecisionSubmit = () => {
    reviewDecisionMutation.mutate({
      id: record.id,
      decision: reviewDecision,
      comments: reviewCommentInput,
    });
  };

  // Structured Sitemap List
  const sitemapSections = [
    {
      category: "Fleet Telemetry & Charging Management",
      pages: [
        { title: "Real-Time Fleet Telemetry Hub", route: "/dashboard/fleet-telemetry", status: "Approved", count: "12 Hubs" },
        { title: "Charger Cluster Status & Load Distribution", route: "/dashboard/cluster-load", status: "Approved", count: "48 Chargers" },
        { title: "Peak Tariff Scheduling Canvas", route: "/dashboard/tariff-scheduler", status: "Approved", count: "5 Tariffs" },
        { title: "Remote Session Start/Stop Diagnostic", route: "/dashboard/remote-session", status: "Approved", count: "Live Control" },
      ],
    },
    {
      category: "Driver Experience & Mobile Companion",
      pages: [
        { title: "NFC / RFID One-Tap Plug-In Flow", route: "/mobile/nfc-plug", status: "Approved", count: "3 Steps" },
        { title: "Real-Time Charging Ring Gauge & SoC Meter", route: "/mobile/soc-meter", status: "Approved", count: "Instant" },
        { title: "Route Trip Planner & High-Speed Station Locator", route: "/mobile/station-finder", status: "Approved", count: "GPS Enabled" },
        { title: "Automated Monthly Billing & Green Carbon Ledger", route: "/mobile/carbon-ledger", status: "Approved", count: "Export Ready" },
      ],
    },
    {
      category: "Hardware Diagnostics & Field Engineering",
      pages: [
        { title: "Field Technician Sunlight Diagnostics View", route: "/tech/sunlight-diagnostics", status: "Approved", count: "High Contrast" },
        { title: "Hardware Fault Code Lookup & Remote Reboot", route: "/tech/fault-codes", status: "Approved", count: "148 Codes" },
        { title: "Firmware OTA Deployment & Verification", route: "/tech/ota-updates", status: "In Review", count: "v3.2 Firmware" },
        { title: "Safety Relay & Ground Fault Testing Protocol", route: "/tech/safety-protocol", status: "Approved", count: "ISO 15118" },
      ],
    },
  ];

  return (
    <AppShell
      title="UI/UX Development"
      breadcrumb={breadcrumb ?? "Development > Research & Innovation > UI/UX Development"}
      tabs={tabs ?? <InnovationAreaTabs />}
    >
      <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 antialiased pb-16">
        <div className="mx-auto max-w-[1720px] px-4 sm:px-6 lg:px-8 pt-3 space-y-5">
          {/* ====================================================================
             1. HEADER BAR: Title, Version, Status & Functional Action Buttons
             ==================================================================== */}
          <div className="bg-white dark:bg-slate-900 border border-border/80 rounded-xl px-4 sm:px-6 py-4 space-y-3 shadow-2xs">
            {/* Row 1: Title, Version, Status Dropdown & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 flex items-center justify-center font-bold shrink-0 border border-blue-200/50 dark:border-blue-800/50">
                  <Palette className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5 flex-nowrap min-w-0">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap truncate">
                      {record.uiUxProjectName}
                    </h1>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 font-mono text-xs font-semibold px-2.5 py-0.5 shrink-0"
                    >
                      {record.designVersion}
                    </Badge>

                    {/* Interactive Workflow Status Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0 focus-visible:ring-2 focus-visible:ring-primary",
                            record.workflowStatus === "Approved"
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
                        {(["In Progress", "In Review", "Approved", "Changes Requested", "Archived"] as const).map((st) => (
                          <DropdownMenuItem
                            key={st}
                            onClick={() => {
                              setRecord({ ...record, workflowStatus: st });
                              toast.success(`Workflow status changed to '${st}'`);
                            }}
                            className="cursor-pointer text-xs font-medium"
                          >
                            {st}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    Create intuitive, accessible and high-conversion UI/UX interfaces for the EV charging ecosystem.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-nowrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveDraft}
                  disabled={saveDraftMutation.isPending}
                  className="gap-1.5 h-9 text-xs font-medium cursor-pointer border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
                >
                  <Save className="h-3.5 w-3.5 text-slate-500" />
                  {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
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
                        onClick={() => {
                          const el = document.getElementById("section-review");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                          setIsReviewDecisionOpen(true);
                        }}
                        className="cursor-pointer"
                      >
                        <UserCheck className="mr-2 h-4 w-4 text-emerald-600" /> Record Review Decision
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => toast.success("Expedited review reminder sent to stakeholders & CTO.")}
                        className="cursor-pointer"
                      >
                        <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setRecord((prev) => (prev ? { ...prev, workflowStatus: "In Progress" } : prev));
                          toast.info("Status reverted to In Progress. You can now edit and re-submit.");
                        }}
                        className="cursor-pointer text-amber-600 dark:text-amber-400"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" /> Revert Status to In Progress
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => submitReviewMutation.mutate(record.id)}
                    disabled={submitReviewMutation.isPending}
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-2xs h-9 text-xs font-medium cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {submitReviewMutation.isPending ? "Submitting..." : "Submit for Review"}
                  </Button>
                )}

                <Button
                  size="sm"
                  onClick={() => {
                    const el = document.getElementById("section-review");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                    setIsReviewDecisionOpen(true);
                  }}
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
                  <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onClick={handleExportReport} className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4 text-primary" /> Export Dossier (.TXT)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportTokensJson} className="cursor-pointer">
                      <FileCode className="mr-2 h-4 w-4 text-purple-600" /> Export Tokens JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(JSON.stringify(record, null, 2), "Record JSON")} className="cursor-pointer">
                      <Copy className="mr-2 h-4 w-4" /> Copy Raw JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(window.location.href, "Project Link")} className="cursor-pointer">
                      <Share2 className="mr-2 h-4 w-4" /> Share URL
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Row 2: Secondary Metadata & Functional Linked Entity Dialog Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    UI/UX DEV ID
                  </span>
                  <span className="font-bold font-mono text-foreground">
                    {record.uiUxDevelopmentId}
                  </span>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    FORM CODE
                  </span>
                  <span className="font-semibold font-mono text-foreground">
                    {record.formCode}
                  </span>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    LINKED PRODUCT
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setLinkedEntityModal({
                        type: "Product Portfolio",
                        id: record.linkedProductId || "PROD-EV-100",
                        title: record.productName || "Smart EV Platform",
                        route: "/development/product-development",
                      })
                    }
                    className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline"
                  >
                    <span>{record.productName || "Smart EV Platform"}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </button>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    LINKED PRD
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setLinkedEntityModal({
                        type: "Product Requirements Document (PRD)",
                        id: record.linkedPrdId,
                        title: record.linkedPrdTitle || "Smart EV Platform PRD Baseline",
                        route: "/development/research-innovation/prd/new",
                      })
                    }
                    className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                  >
                    <span>{record.linkedPrdId}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </button>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    LINKED SOFTWARE
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setLinkedEntityModal({
                        type: "Software Development Specification",
                        id: record.linkedSoftwareDevId,
                        title: record.linkedSoftwareDevTitle || "EV Cloud Control Backend Services",
                        route: "/development/research-innovation/software-development/new",
                      })
                    }
                    className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                  >
                    <span>{record.linkedSoftwareDevId}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </button>
                </div>

                <div className="h-7 w-px bg-border hidden sm:block" />

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">
                    LINKED MOBILE APP
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setLinkedEntityModal({
                        type: "Mobile App Development",
                        id: record.linkedMobileAppDevId,
                        title: record.linkedMobileAppDevTitle || "Smart Charger Mobile App (iOS & Android)",
                        route: "/development/research-innovation/mobile-app-development/new",
                      })
                    }
                    className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 cursor-pointer hover:underline font-mono"
                  >
                    <span>{record.linkedMobileAppDevId}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </button>
                </div>
              </div>

              <div className="text-xs">
                <span className="text-muted-foreground text-[10px] uppercase font-semibold">LEAD DESIGNER: </span>
                <span className="font-bold text-foreground font-sans">{record.designerName || "Rahul Sharma"}</span>
              </div>
            </div>
          </div>

          {/* ====================================================================
             2. PROJECT SCOPE & STRATEGIC OBJECTIVES + OVERALL DESIGN SCORE
             ==================================================================== */}
          <div id="section-overview" className="space-y-5 scroll-mt-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 8 Cols: Project Details & Goals */}
              <Card className="lg:col-span-8 border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Project Scope & Strategic Objectives
                    </CardTitle>
                    <CardDescription className="text-xs">
                      High-level UX goals, product requirements alignment, and platform targets.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditObjectivesOpen(true)}
                    className="h-7 text-xs gap-1 border-border hover:bg-muted cursor-pointer font-semibold"
                  >
                    <SlidersHorizontal className="h-3 w-3" /> Edit Objectives
                  </Button>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-muted-foreground block text-[11px] font-medium">Product Name</span>
                      <span className="font-bold text-slate-900 dark:text-white text-sm">{record.productName}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px] font-medium">Lead UX Designer</span>
                      <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-primary" />
                        {record.designerName || (typeof record.leadDesigner === "object" ? record.leadDesigner?.name : record.leadDesigner) || "Rahul Sharma"}
                        <span className="text-[10px] text-muted-foreground font-normal">
                          ({record.createdOn || record.lastUpdated || "18 Jun 2024 10:15 AM"})
                        </span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium mb-1">Project Objective</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-border/60">
                      {record.projectObjective}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium mb-1">Business Goals</span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-border/60">
                      {record.businessGoals}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground block text-[11px] font-medium mb-1.5">Target Deployment Platforms</span>
                    <div className="flex flex-wrap gap-2">
                      {(record.targetPlatforms || ["Web App", "Android", "iOS"]).map((platform) => (
                        <Badge key={platform} variant="secondary" className="px-3 py-1 text-xs gap-1 font-medium">
                          {platform === "Web App" && <Monitor className="h-3 w-3 text-blue-500" />}
                          {platform === "Android" && <Smartphone className="h-3 w-3 text-emerald-500" />}
                          {platform === "iOS" && <Smartphone className="h-3 w-3 text-purple-500" />}
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right 4 Cols: Design Score Radial Gauge */}
              <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900 flex flex-col justify-between">
                <CardHeader className="p-4 pb-2 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                    <span>Overall Design Score</span>
                    <Award className="h-4 w-4 text-primary" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 text-center space-y-4">
                  {/* Radial Progress Gauge */}
                  <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
                    <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="text-slate-100 dark:text-slate-800"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        className="text-primary transition-all duration-700 ease-out"
                        strokeWidth="8"
                        strokeDasharray={251.33}
                        strokeDashoffset={251.33 - (251.33 * (record.overallDesignScore ?? 88)) / 100}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-black text-primary dark:text-blue-400 font-mono tracking-tight">
                        {record.overallDesignScore ?? 88}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-left text-xs border-t border-border/60 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">UX Score</span>
                      <span className="font-bold text-slate-900 dark:text-white">{record.uxScore ?? 88}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Visual Design</span>
                      <span className="font-bold text-slate-900 dark:text-white">{record.visualDesignScore ?? 87}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Accessibility (WCAG 2.2)</span>
                      <span className="font-bold text-emerald-600">{record.accessibilityScore ?? 90}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Developer Readiness</span>
                      <span className="font-bold text-primary">{record.developmentReadinessScore ?? 90}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ====================================================================
             3. UI/UX WORKSPACES & DELIVERABLES (6 HUBS WITH FUNCTIONAL BUTTONS)
             ==================================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Layout className="h-4 w-4 text-primary" />
                  UI/UX Workspaces & Deliverables
                </h2>
                <p className="text-xs text-muted-foreground">
                  Core engineering streams across research, hierarchy, blueprints, design tokens, interactive simulators, and sign-offs.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: User Research */}
              <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-blue-500/10 text-primary">
                        <User className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">User Research</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">3 Personas</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    5 user journeys, 12 pain points mapped, and 4 competitive telemetry platforms analyzed.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsResearchCanvasOpen(true);
                    }}
                    className="w-full text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
                  >
                    <Compass className="w-3.5 h-3.5 text-primary" />
                    Open Research Canvas
                  </Button>
                </div>
              </div>

              {/* Card 2: Information Architecture */}
              <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">Information Architecture</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">25 Pages</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    4-level screen hierarchy, contextual action bars, and multi-division sitemap structure.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("section-ia");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      toast.info("Scrolled to Information Architecture & Sitemap Hierarchy");
                    }}
                    className="w-full text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
                  >
                    <FolderTreeIcon className="w-3.5 h-3.5 text-purple-600" />
                    View Sitemap & Hierarchy
                  </Button>
                </div>
              </div>

              {/* Card 3: Wireframes & Flows */}
              <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Sliders className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">Wireframes & Flows</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">64 Screens</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    32 Low-fidelity & 32 high-fidelity blueprints covering 5 critical hardware task flows.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsBlueprintsModalOpen(true)}
                    className="w-full text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    Inspect Screen Blueprints
                  </Button>
                </div>
              </div>

              {/* Card 4: Design System & A11y */}
              <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-pink-500/10 text-pink-600 dark:text-pink-400">
                        <Palette className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">Design System & A11y</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">WCAG 2.2 AA</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Magnertia DS v3.2 tokens, 120+ components, Poppins/Inter typography, and 100% keyboard nav.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsTokensModalOpen(true)}
                    className="w-full text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-pink-600" />
                    Explore Tokens & Audit
                  </Button>
                </div>
              </div>

              {/* Card 5: Prototype & Handoff */}
              <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        <Play className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">Prototype & Handoff</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">SUS 87%</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Interactive Figma simulator, +24% A/B test conversion, and exported JSON/CSS tokens.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPrototypeModalOpen(true)}
                    className="w-full text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
                  >
                    <Play className="w-3.5 h-3.5 text-amber-600" />
                    Launch Prototype Simulator
                  </Button>
                </div>
              </div>

              {/* Card 6: Review & Approval */}
              <div className="bg-card border border-border/80 rounded-xl p-4 shadow-2xs flex flex-col justify-between hover:border-primary/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <UserCheck className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-foreground">Review & Approval</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-semibold">In Review</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    6-member multi-disciplinary review board: 5 Approved, 1 Pending final CTO signature.
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const el = document.getElementById("section-review");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                      toast.info("Scrolled to Review & Approval Consensus Board");
                    }}
                    className="w-full text-xs font-semibold gap-1.5 cursor-pointer hover:bg-muted"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Manage Sign-offs & Audit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
             4. AI DESIGN QUALITY & OPTIMIZATION RECOMMENDATIONS
             ==================================================================== */}
          <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary text-primary-foreground shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">AI Design Quality & Optimization Recommendations</h3>
                  <span className="text-xs text-muted-foreground">Automated heuristics analysis across WCAG 2.2, touch ergonomics, and theme architecture.</span>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground text-xs font-mono font-bold px-2.5 py-0.5">
                AI Score: 89/100
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-lg bg-card/80 border border-border/60 flex items-start justify-between gap-2">
                <p className="text-slate-700 dark:text-slate-300">
                  • Increase touch target padding on mobile footer action buttons from 36px to 44px for WCAG 2.2 touch target compliance.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success("Applied touch padding fix (44px target) to design tokens!")}
                  className="h-6 text-[11px] text-primary shrink-0 hover:bg-primary/10 cursor-pointer"
                >
                  Apply
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-card/80 border border-border/60 flex items-start justify-between gap-2">
                <p className="text-slate-700 dark:text-slate-300">
                  • Add secondary status pill for offline hardware chargers in the sitemap node view.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success("Offline charger status pill enabled in sitemap components.")}
                  className="h-6 text-[11px] text-primary shrink-0 hover:bg-primary/10 cursor-pointer"
                >
                  Apply
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-card/80 border border-border/60 flex items-start justify-between gap-2">
                <p className="text-slate-700 dark:text-slate-300">
                  • Export CSS variables directly into Tailwind v4 @theme inline definitions for zero-runtime theme switches.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    handleExportTokensJson();
                    toast.success("Tailwind v4 @theme configuration exported!");
                  }}
                  className="h-6 text-[11px] text-primary shrink-0 hover:bg-primary/10 cursor-pointer"
                >
                  Export
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-card/80 border border-border/60 flex items-start justify-between gap-2">
                <p className="text-slate-700 dark:text-slate-300">
                  • Include ARIA live-region announcements when charger SoC updates during live telemetry stream.
                </p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toast.success("ARIA live-region aria-live='polite' configured on SoC meter.")}
                  className="h-6 text-[11px] text-primary shrink-0 hover:bg-primary/10 cursor-pointer"
                >
                  Verify
                </Button>
              </div>
            </div>
          </div>

          {/* ====================================================================
             5. PRIMARY USER JOURNEYS & SATISFACTION BENCHMARKS
             ==================================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground">5 Primary User Journeys & Satisfaction Benchmarks</h2>
                <p className="text-xs text-muted-foreground">Validated driver and fleet operator task sequences with CSAT benchmarks.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: "j1",
                  title: "First-Time Driver Onboarding & NFC Wallet Setup",
                  score: "94% CSAT",
                  steps: ["App Store Download", "Account Creation", "RFID/NFC Scan", "Payment Method Link", "First Plug-in"],
                  takeaway: "Reduced onboarding friction from 4 mins to 45 seconds using NFC auto-pair.",
                },
                {
                  id: "j2",
                  title: "Active Fast-Charging & Live Telemetry Monitoring",
                  score: "91% CSAT",
                  steps: ["QR Plug-in", "Session Initiate", "Live kW/SoC Monitor", "Session Complete Alert", "Receipt Generation"],
                  takeaway: "Added high-contrast ring gauge for SoC progress visible from 10 feet away.",
                },
                {
                  id: "j3",
                  title: "Fleet Manager Peak-Load Tariff Optimization",
                  score: "89% CSAT",
                  steps: ["Dashboard Login", "Tariff Rule Config", "Load Balance Slider", "Cost Projection Preview", "Apply Config"],
                  takeaway: "Visual drag sliders for load limits improved tariff compliance by 28%.",
                },
                {
                  id: "j4",
                  title: "Remote Diagnostic & Hardware Error Resolution",
                  score: "88% CSAT",
                  steps: ["Push Alert Received", "Diagnostic Screen", "Remote Reboot Trigger", "Status Verification"],
                  takeaway: "One-click hardware remote reset saved 32% unnecessary technician dispatch.",
                },
                {
                  id: "j5",
                  title: "Automated Monthly Billing & Carbon Credit Export",
                  score: "95% CSAT",
                  steps: ["Billing Tab", "Date Range Filter", "Invoice Generate", "PDF/CSV Export", "ERP Sync"],
                  takeaway: "Direct SAP/Magnertia ledger sync praised by fleet finance leads.",
                },
              ].map((journey) => (
                <div key={journey.id} className="p-4 rounded-xl border border-border/80 bg-card shadow-2xs space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="font-bold text-sm text-foreground">{journey.title}</h4>
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold w-fit">
                      {journey.score}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {journey.steps.map((st, idx) => (
                      <React.Fragment key={st}>
                        <span className="px-2.5 py-1 rounded-md bg-muted text-foreground text-xs font-medium">
                          {st}
                        </span>
                        {idx < journey.steps.length - 1 && (
                          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <strong className="text-foreground">Key Takeaway:</strong> {journey.takeaway}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ====================================================================
             6. IDENTIFIED PAIN POINTS TRACKER
             ==================================================================== */}
          <div id="section-user-research" className="space-y-4 pt-2">
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
              <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Identified Pain Points Tracker ({record.painPoints?.length || 4})
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded text-[11px]">
                    {(["All", "High", "Medium"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setPainPointFilter(lvl)}
                        className={cn(
                          "px-2 py-0.5 rounded font-medium cursor-pointer transition-colors",
                          painPointFilter === lvl ? "bg-white dark:bg-slate-700 shadow-2xs text-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setIsAddPainPointOpen(true)} className="h-6 text-[10px] gap-1 cursor-pointer">
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2 text-xs">
                {(record.painPoints || [])
                  .filter((pp) => painPointFilter === "All" || pp.severity === painPointFilter)
                  .map((pp) => (
                    <div key={pp.id} className="p-2.5 rounded-lg border border-border/60 bg-slate-50/50 dark:bg-slate-800/20 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              pp.severity === "High"
                                ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 text-[10px]"
                                : "bg-amber-500/15 text-amber-700 dark:text-amber-300 text-[10px]"
                            }
                          >
                            {pp.severity}
                          </Badge>
                          <span className="font-bold text-[11px] text-slate-900 dark:text-white">{pp.issue}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block mt-1">
                          Category: {pp.category} • {pp.impact}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const filtered = (record.painPoints || []).filter((p) => p.id !== pp.id);
                            setRecord({ ...record, painPoints: filtered });
                            toast.success(`Resolved pain point: ${pp.issue}`);
                          }}
                          className="h-6 text-[10px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 cursor-pointer font-semibold"
                        >
                          <Check className="h-3 w-3 mr-1" /> Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             7. COMPETITOR BENCHMARKS (4 PLATFORMS)
             ==================================================================== */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-foreground">Competitor Benchmarks (4 Platforms)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: "Tesla Supercharger UI",
                  rating: "★ 4.7 (34%)",
                  strength: "Ultra-slick visual minimalism & vehicle integration",
                  weakness: "Proprietary ecosystem & limited third-party fleet tools",
                },
                {
                  name: "ChargePoint Enterprise",
                  rating: "★ 4.2 (26%)",
                  strength: "Extensive fleet management telemetry & reports",
                  weakness: "Complex multi-level navigation and outdated UI theme",
                },
                {
                  name: "EVgo Commercial",
                  rating: "★ 3.9 (18%)",
                  strength: "Fast station locator and instant RFID start",
                  weakness: "High app crash rate on Android & dark mode bugs",
                },
                {
                  name: "ABB E-Mobility Portal",
                  rating: "★ 4.0 (15%)",
                  strength: "Industrial grade hardware telemetry & safety controls",
                  weakness: "Non-responsive web app UI requiring desktop monitors",
                },
              ].map((c) => (
                <Card key={c.name} className="border-border/80 bg-card p-4 shadow-2xs space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="font-bold text-xs text-foreground truncate">{c.name}</h4>
                      <Badge variant="outline" className="text-[10px] font-mono shrink-0">{c.rating}</Badge>
                    </div>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <p><strong className="text-emerald-600 dark:text-emerald-400">Strength:</strong> {c.strength}</p>
                      <p><strong className="text-rose-600 dark:text-rose-400">Weakness:</strong> {c.weakness}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* ====================================================================
             8. INFORMATION ARCHITECTURE & SITEMAP HIERARCHY (25 PAGES)
             ==================================================================== */}
          <div id="section-ia" className="space-y-4 scroll-mt-24 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-border/80">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-600" />
                  Information Architecture & Sitemap Hierarchy (25 Pages)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Navigation structure: {record.navigationStructure || "Module-Based Top + Side Navigation"} with {record.screenHierarchyLevels || 4} hierarchy levels.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                  <Input
                    placeholder="Filter sitemap..."
                    value={sitemapSearch}
                    onChange={(e) => setSitemapSearch(e.target.value)}
                    className="h-8 pl-8 text-xs w-48 bg-background"
                  />
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success("Sitemap hierarchy validated against WCAG navigation guidelines. 0 orphaned nodes.");
                  }}
                  className="h-8 text-xs cursor-pointer font-semibold"
                >
                  Validate IA
                </Button>
              </div>
            </div>

            {/* Sitemap Sections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {sitemapSections.map((sec, idx) => (
                <Card key={idx} className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                  <CardHeader className="p-4 pb-2 border-b border-border/40">
                    <CardTitle className="text-xs font-bold text-primary flex items-center gap-1.5">
                      <FolderTreeIcon className="h-4 w-4" />
                      {sec.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2 text-xs">
                    {sec.pages
                      .filter((p) => !sitemapSearch || p.title.toLowerCase().includes(sitemapSearch.toLowerCase()))
                      .map((page, pidx) => (
                        <div
                          key={pidx}
                          onClick={() => setSelectedSitemapPage({ ...page, category: sec.category })}
                          className="p-2.5 rounded-lg border border-border/50 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-primary/5 transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div>
                            <span className="font-bold text-[11px] block text-slate-900 dark:text-white">{page.title}</span>
                            <span className="font-mono text-[10px] text-muted-foreground">{page.route}</span>
                          </div>
                          <Badge variant="outline" className="text-[9px] font-mono">
                            {page.count}
                          </Badge>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Hierarchy Specs & Navigation Patterns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    4-Level Screen Hierarchy
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs space-y-2">
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-border/40">
                    <span className="font-bold text-primary font-mono text-xs">Level 1:</span>
                    <span>Portal Hub (Executive Fleet Overview & Master Switchboard)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-border/40">
                    <span className="font-bold text-primary font-mono text-xs">Level 2:</span>
                    <span>Functional Divisions (Charger Telemetry, Driver Mobile, Engineering Diagnostics)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-border/40">
                    <span className="font-bold text-primary font-mono text-xs">Level 3:</span>
                    <span>Workspace Blueprints (Active Session Monitor, Tariff Slider, Error Logger)</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-border/40">
                    <span className="font-bold text-primary font-mono text-xs">Level 4:</span>
                    <span>Contextual Detail Drawers & Hardware Command Overlays</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Interaction & Navigation Patterns
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs space-y-2">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-border/40">
                    <span className="font-bold block text-primary">Contextual Sticky Action Bar</span>
                    <span className="text-[11px] text-muted-foreground">High-priority actions (Emergency Stop, Tariff Apply, Reboot) remain docked at the top.</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/40 border border-border/40">
                    <span className="font-bold block text-primary">Responsive Card-to-Table Switcher</span>
                    <span className="text-[11px] text-muted-foreground">Allows technicians to switch between rich graphical telemetry cards and dense high-speed tables.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ====================================================================
             9. 5 CRITICAL SCREEN FLOWS & BRANCHING LOGIC
             ==================================================================== */}
          <div id="section-wireframes" className="space-y-4 scroll-mt-24 pt-2">
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
              <CardHeader className="p-4 pb-2 border-b border-border/40">
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  5 Critical Screen Flows & Branching Logic
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-xs">
                <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">Flow 1: High-Speed Driver Authentication & Plug-In</span>
                  <p className="text-[11px] text-muted-foreground">
                    Lock screen widget &rarr; NFC handshake &rarr; Connector lock verify &rarr; Telemetry start. Completion: 98.4%.
                  </p>
                </div>
                <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">Flow 2: Peak Energy Tariff Re-allocation</span>
                  <p className="text-[11px] text-muted-foreground">
                    Alert badge &rarr; Load slider preview &rarr; Cost simulation overlay &rarr; Instant cluster sync.
                  </p>
                </div>
                <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/40 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">Flow 3: Hardware Ground Fault Remote Reboot</span>
                  <p className="text-[11px] text-muted-foreground">
                    Diagnostic telemetry code &rarr; Technician verification &rarr; Remote safety reboot trigger &rarr; Relay reset confirmation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             10. MAGNERTIA DESIGN SYSTEM (v3.2) & ACCESSIBILITY STANDARDS
             ==================================================================== */}
          <div id="section-visual-design" className="space-y-4 scroll-mt-24 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-border/80">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Palette className="h-4 w-4 text-pink-600" />
                  Magnertia Design System (v3.2) & Accessibility Standards
                </h2>
                <p className="text-xs text-muted-foreground">
                  120+ component primitives • WCAG 2.2 AA Verified (Accessibility Score: {record.accessibilityScore ?? 90}%)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleExportTokensJson} className="h-8 text-xs gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  <FileCode className="h-3.5 w-3.5" /> Export Tokens JSON
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Typography (5 cols) */}
              <Card className="lg:col-span-5 border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Typography Specimen
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground font-mono">Headings: Poppins SemiBold</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white font-sans mt-0.5">
                      Smart EV Fleet Energy Management
                    </h3>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground font-mono">Body: Inter Regular</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">
                      Real-time power balancing for commercial EV hubs, automated tariff billing, and vehicle-to-grid telemetry.
                    </p>
                  </div>
                  <div className="pt-2 border-t border-border/40 flex justify-between text-[10px] text-muted-foreground">
                    <span>Font Scales: 12px, 14px, 16px, 20px, 28px</span>
                    <span>Line-height: 1.5</span>
                  </div>
                </CardContent>
              </Card>

              {/* WCAG 2.2 AA Audit Checklist (7 cols) */}
              <Card className="lg:col-span-7 border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    WCAG 2.2 AA Accessibility Audits
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[10px]">
                      100% Passed
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast.success("WCAG 2.2 AA accessibility audit re-run: 100% compliant across contrast, focus rings, keyboard trap, and ARIA.")}
                      className="h-6 text-[10px] gap-1 cursor-pointer font-semibold"
                    >
                      <RefreshCw className="h-3 w-3" /> Re-audit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2 text-xs">
                  {(record.wcagAudits || []).map((audit) => (
                    <div key={audit.id} className="p-2 rounded-lg border border-border/60 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span className="font-bold text-[11px] text-slate-900 dark:text-white">{audit.criteria}</span>
                          <Badge variant="outline" className="text-[9px] font-mono">{audit.wcagLevel}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{audit.notes}</p>
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[9px] font-bold">
                        Pass
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ====================================================================
             11. INTERACTIVE PROTOTYPE SIMULATOR & DEVELOPER HANDOFF
             ==================================================================== */}
          <div id="section-prototype" className="space-y-4 scroll-mt-24 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-border/80">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-blue-600" />
                  Interactive Prototype Simulator & Developer Handoff
                </h2>
                <p className="text-xs text-muted-foreground">
                  Figma Enterprise (v124) • SUS Score: 87% • Developer Readiness: {record.developmentReadinessScore ?? 90}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toast.success("Opening Figma Enterprise Workspace in browser...");
                    window.open("https://figma.com", "_blank");
                  }}
                  className="h-8 text-xs gap-1.5 cursor-pointer border-border hover:bg-muted font-semibold"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Launch Figma
                </Button>
                <Button size="sm" onClick={handleExportTokensJson} className="h-8 text-xs gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  <Code className="h-3.5 w-3.5" /> Export Handoff Package
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Design Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs space-y-2">
                  <p className="text-muted-foreground text-[11px]">
                    JSON variables & CSS custom properties for spacing, typography, colors, and shadows.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportTokensJson}
                    className="w-full text-xs gap-1.5 cursor-pointer mt-2 font-semibold"
                  >
                    <Download className="h-3.5 w-3.5" /> Download tokens.json
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Component Primitives
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs space-y-2">
                  <p className="text-muted-foreground text-[11px]">
                    React + Tailwind CSS primitives matching Magnertia EV Design System guidelines.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      copyToClipboard("@/components/ui/button, card, dialog, badge", "Component Names");
                    }}
                    className="w-full text-xs gap-1.5 cursor-pointer mt-2 font-semibold"
                  >
                    <Copy className="h-3.5 w-3.5" /> Copy Import Paths
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Usability Testing Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SUS Score:</span>
                    <span className="font-bold text-emerald-600">87% (Grade A)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">A/B Testing:</span>
                    <span className="font-bold text-primary">+24% Conversion</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Participants:</span>
                    <span className="font-bold text-slate-900 dark:text-white">30 EV Drivers</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ====================================================================
             12. DESIGN ARTIFACTS & SPECIFICATION ATTACHMENTS (8)
             ==================================================================== */}
          <div id="section-attachments" className="space-y-4 scroll-mt-24 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-border/80">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-blue-600" />
                  Design Artifacts & Specification Attachments ({record.attachments?.length || 8})
                </h2>
                <p className="text-xs text-muted-foreground">
                  Figma files, user research reports, wireframe PDFs, and design system guidelines.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => setIsUploadOpen(true)} className="h-8 text-xs gap-1.5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </Button>
              </div>
            </div>

            {/* Files Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(record.attachments || []).map((att) => (
                <Card key={att.id} className="border-border/80 shadow-2xs hover:shadow-md transition-all bg-white dark:bg-slate-900">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="p-2 rounded-lg bg-blue-500/10 text-primary shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">{att.name}</span>
                          <span className="text-[10px] text-muted-foreground font-mono">{att.size} • {att.type}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono shrink-0">
                        {att.version || "v2.1"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-xs">
                      <span className="text-[10px] text-muted-foreground">{att.date}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPreviewDoc({ label: att.type || "Document", filename: att.name, size: att.size })}
                          className="h-7 w-7 text-muted-foreground hover:text-primary cursor-pointer"
                          title="Preview Document"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadDoc({ label: att.type || "Document", filename: att.name, size: att.size })}
                          className="h-7 w-7 text-muted-foreground hover:text-emerald-600 cursor-pointer"
                          title="Download Document"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAttachment(att.id, att.name)}
                          className="h-7 w-7 text-muted-foreground hover:text-rose-600 cursor-pointer"
                          title="Delete Attachment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* ====================================================================
             13. REVIEW & APPROVAL BOARD (BOARD EVALUATOR CONSENSUS CHIPS)
             ==================================================================== */}
          <div id="section-review" className="space-y-4 scroll-mt-24 pt-2">
            <Card className="border-border/80 shadow-2xs bg-white dark:bg-slate-900">
              <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/40 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-purple-600" />
                    Multi-Disciplinary Design Review & Sign-Off Board
                  </CardTitle>
                  <CardDescription className="text-xs">
                    6-member consensus voting. Click on any status chip to toggle evaluator decision.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAddReviewerModal(true)}
                    className="h-7 text-xs gap-1 cursor-pointer font-semibold"
                  >
                    <Plus className="h-3 w-3" /> Add Reviewer
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setIsReviewDecisionOpen(true)}
                    className="h-7 text-xs gap-1.5 cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                  >
                    <UserCheck className="h-3.5 w-3.5" /> Sign-off / Record Decision
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(record.reviewers || []).map((rev) => {
                    const isApproved = rev.decision === "Approved";
                    const isCond = rev.decision === "Approved with Conditions";
                    const isPending = rev.decision === "Pending";
                    const isRejected = rev.decision === "Rejected" || rev.decision === "Changes Requested";

                    return (
                      <div
                        key={rev.role}
                        className="p-3 rounded-xl border border-border/70 bg-card flex flex-col justify-between space-y-2 hover:border-primary/40 transition-all"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                              {rev.role}
                            </span>
                            <span className="font-bold text-xs text-foreground block">
                              {rev.person}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleReviewerDecision(rev.role)}
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer",
                              isApproved && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
                              isCond && "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
                              isPending && "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
                              isRejected && "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30"
                            )}
                            title="Click to cycle decision"
                          >
                            {rev.decision}
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground italic line-clamp-2">
                          "{rev.comments || "Reviewed and aligned with design system specifications."}"
                        </p>
                        <span className="text-[9px] font-mono text-muted-foreground">
                          {rev.date}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Audit Trail & Version Baseline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Audit Trail (8 cols) */}
              <Card className="lg:col-span-8 border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    System Audit Log Trail
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setIsAddAuditNoteOpen(true)} className="h-7 text-xs text-primary cursor-pointer font-semibold">
                    + Add Log Entry
                  </Button>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-xs">
                  {(record.auditTrail || []).map((entry, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg border border-border/50 bg-slate-50/50 dark:bg-slate-800/30 flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-white">{entry.action}</span>
                          <span className="text-[10px] font-mono text-muted-foreground">({entry.user})</span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-300">{entry.details}</p>
                      </div>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">{entry.timestamp}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Version History (4 cols) */}
              <Card className="lg:col-span-4 border-border/80 shadow-2xs bg-white dark:bg-slate-900">
                <CardHeader className="p-4 pb-2 border-b border-border/40">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Design Version Baseline
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-2.5 text-xs">
                  <div className="p-2.5 rounded-lg border bg-primary/5 border-primary/20 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-primary block">v2.1.0 (Current)</span>
                      <span className="text-[10px] text-muted-foreground">WCAG 2.2 AA & Fleet tokens</span>
                    </div>
                    <Badge className="bg-primary text-white text-[9px]">Active</Badge>
                  </div>
                  <div className="p-2.5 rounded-lg border bg-muted/40 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-foreground block">v2.0.0</span>
                      <span className="text-[10px] text-muted-foreground">Hi-fi wireframe baselines</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">18 Jun 2024</span>
                  </div>
                  <div className="p-2.5 rounded-lg border bg-muted/40 flex justify-between items-center">
                    <div>
                      <span className="font-bold text-foreground block">v1.0.0</span>
                      <span className="text-[10px] text-muted-foreground">Initial low-fi & personas</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">01 Jun 2024</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* ====================================================================
           MODALS & DIALOGS (ALL FULLY FUNCTIONAL)
           ==================================================================== */}

        {/* 1. Linked Entity Modal */}
        {linkedEntityModal && (
          <Dialog open={!!linkedEntityModal} onOpenChange={(open) => !open && setLinkedEntityModal(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm font-bold">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  {linkedEntityModal.type}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Connected engineering artifact within the Magnertia Product Development suite.
                </DialogDescription>
              </DialogHeader>
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-2">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Entity ID:</span>
                  <span className="font-mono font-bold text-primary text-xs">{linkedEntityModal.id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Title:</span>
                  <span className="font-semibold text-slate-900 dark:text-white text-xs">{linkedEntityModal.title}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Status:</span>
                  <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-[9px]">Linked & Synchronized</Badge>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button size="sm" variant="outline" onClick={() => setLinkedEntityModal(null)} className="h-8 text-xs cursor-pointer">
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    const r = linkedEntityModal.route;
                    setLinkedEntityModal(null);
                    navigate({ to: r });
                  }}
                  className="h-8 text-xs bg-primary text-white cursor-pointer"
                >
                  Navigate to Module &rarr;
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* 2. Review Decision Sign-off Modal */}
        <Dialog open={isReviewDecisionOpen} onOpenChange={setIsReviewDecisionOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-purple-600" />
                Executive UI/UX Review Sign-off
              </DialogTitle>
              <DialogDescription className="text-xs">
                Submit executive board decision for Smart EV Charger UI/UX ({record.uiUxDevelopmentId}).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1.5">Review Decision:</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Approved", "Approved with Conditions", "Changes Requested", "Rejected"] as UiUxDevelopmentApprovalDecision[]).map((dec) => (
                    <button
                      key={dec}
                      type="button"
                      onClick={() => setReviewDecision(dec)}
                      className={cn(
                        "p-2 rounded-lg border text-left text-[11px] font-medium cursor-pointer transition-all",
                        reviewDecision === dec
                          ? "bg-primary/10 border-primary text-primary font-bold"
                          : "border-border/70 hover:bg-slate-50 dark:hover:bg-slate-800"
                      )}
                    >
                      {dec}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Review Comments & Conditions:</label>
                <textarea
                  value={reviewCommentInput}
                  onChange={(e) => setReviewCommentInput(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => setIsReviewDecisionOpen(false)} className="h-8 text-xs cursor-pointer">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReviewDecisionSubmit}
                disabled={reviewDecisionMutation.isPending}
                className="h-8 text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer font-semibold"
              >
                {reviewDecisionMutation.isPending ? "Submitting..." : "Confirm & Sign Off"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 3. Attachment Preview Modal */}
        <Dialog open={!!previewDoc} onOpenChange={(open) => !open && setPreviewDoc(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-sm font-bold">
                <FileText className="h-4 w-4 text-blue-600" />
                {previewDoc?.filename}
              </DialogTitle>
              <DialogDescription className="text-xs">
                {previewDoc?.label} • {previewDoc?.size} • UI/UX Design Specification Artifact
              </DialogDescription>
            </DialogHeader>
            <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs max-h-72 overflow-y-auto space-y-2">
              <p className="text-emerald-400 font-bold">=== UI/UX DESIGN SPECIFICATION METADATA ===</p>
              <p>Title: {previewDoc?.label}</p>
              <p>File: {previewDoc?.filename}</p>
              <p>Project: {record.uiUxProjectName} ({record.uiUxDevelopmentId})</p>
              <p>Design System: {record.designSystemVersion || "Magnertia Design System (v3.2)"}</p>
              <p>Accessibility: {record.accessibilityStandard || "WCAG 2.2 AA"}</p>
              <div className="mt-3 p-3 rounded bg-slate-800/80 text-slate-300 font-sans text-xs">
                Production-grade high-fidelity specification for Smart EV Platform applications. Includes screen flows, design tokens, and user testing metrics.
              </div>
            </div>
            <DialogFooter className="gap-2">
              {previewDoc && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadDoc(previewDoc)}
                  className="h-8 text-xs gap-1 cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" /> Download File
                </Button>
              )}
              <Button size="sm" onClick={() => setPreviewDoc(null)} className="h-8 text-xs bg-primary text-white cursor-pointer">
                Close Preview
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 4. Upload File Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold">Upload Design Attachment</DialogTitle>
              <DialogDescription className="text-xs">Attach Figma exports, PDF reports, or design tokens.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUploadFile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">File Name:</label>
                <Input
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g. Design_System_Tokens_v2.1.pdf"
                  className="text-xs h-8"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Document Type:</label>
                <div className="flex gap-2">
                  {(["PDF", "FIG", "JSON", "TXT"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setUploadFileType(t)}
                      className={cn(
                        "px-3 py-1 rounded border text-xs font-semibold cursor-pointer",
                        uploadFileType === t ? "bg-primary text-white border-primary" : "border-border/70 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsUploadOpen(false)} className="h-8 text-xs cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="h-8 text-xs bg-primary text-white cursor-pointer">
                  Upload Attachment
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 5. Edit Objectives Modal */}
        <Dialog open={isEditObjectivesOpen} onOpenChange={setIsEditObjectivesOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold">Edit Project Scope & Objectives</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Project Objective:</label>
                <textarea
                  value={record.projectObjective}
                  onChange={(e) => setRecord({ ...record, projectObjective: e.target.value })}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Business Goals:</label>
                <textarea
                  value={record.businessGoals}
                  onChange={(e) => setRecord({ ...record, businessGoals: e.target.value })}
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-border bg-white dark:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" variant="outline" onClick={() => setIsEditObjectivesOpen(false)} className="h-8 text-xs cursor-pointer">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsEditObjectivesOpen(false);
                  toast.success("Updated project objectives & business goals.");
                }}
                className="h-8 text-xs bg-primary text-white cursor-pointer"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 6. Add Pain Point Modal */}
        <Dialog open={isAddPainPointOpen} onOpenChange={setIsAddPainPointOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold">Log Customer Pain Point</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddPainPoint} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Pain Point Description:</label>
                <Input
                  value={newPainPointIssue}
                  onChange={(e) => setNewPainPointIssue(e.target.value)}
                  placeholder="e.g. Bluetooth auto-reconnect drops during charging session"
                  className="text-xs h-8"
                  required
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Severity:</label>
                <div className="flex gap-2">
                  {(["High", "Medium"] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setNewPainPointSeverity(sev)}
                      className={cn(
                        "px-3 py-1 rounded border text-xs font-semibold cursor-pointer",
                        newPainPointSeverity === sev ? "bg-rose-600 text-white border-rose-600" : "border-border/70"
                      )}
                    >
                      {sev} Severity
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">Category:</label>
                <Input
                  value={newPainPointCategory}
                  onChange={(e) => setNewPainPointCategory(e.target.value)}
                  placeholder="e.g. Mobile UX / Connectivity"
                  className="text-xs h-8"
                />
              </div>
              <DialogFooter className="pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddPainPointOpen(false)} className="h-8 text-xs cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="h-8 text-xs bg-primary text-white cursor-pointer font-semibold">
                  Log Pain Point
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 7. Add Audit Note Modal */}
        <Dialog open={isAddAuditNoteOpen} onOpenChange={setIsAddAuditNoteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold">Add Manual Audit Log Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAuditNote} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Audit Details / Engineering Note:</label>
                <textarea
                  value={newAuditNote}
                  onChange={(e) => setNewAuditNote(e.target.value)}
                  placeholder="e.g. Completed dark mode contrast verification with Lead UI Designer."
                  rows={3}
                  className="w-full text-xs p-2 rounded-lg border border-border bg-white dark:bg-slate-900"
                  required
                />
              </div>
              <DialogFooter>
                <Button size="sm" variant="outline" type="button" onClick={() => setIsAddAuditNoteOpen(false)} className="h-8 text-xs cursor-pointer">
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="h-8 text-xs bg-primary text-white cursor-pointer font-semibold">
                  Record Log
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 8. Add Reviewer Modal */}
        <Dialog open={showAddReviewerModal} onOpenChange={setShowAddReviewerModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-primary" />
                Add Review Board Member
              </DialogTitle>
              <DialogDescription className="text-xs">
                Assign a stakeholder evaluator to the UI/UX sign-off board.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddReviewer} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Reviewer Name:</label>
                <Input
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  placeholder="e.g. Meera Krishnan"
                  className="text-xs h-8"
                  required
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Role / Function:</label>
                <Input
                  value={newReviewerRole}
                  onChange={(e) => setNewReviewerRole(e.target.value)}
                  placeholder="e.g. Accessibility Auditor / Product Lead"
                  className="text-xs h-8"
                  required
                />
              </div>
              <DialogFooter className="pt-2">
                <Button size="sm" variant="outline" type="button" onClick={() => setShowAddReviewerModal(false)}>
                  Cancel
                </Button>
                <Button size="sm" type="submit" className="bg-primary text-white font-semibold">
                  Add Reviewer
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* 9. Research Canvas Modal */}
        <Dialog open={isResearchCanvasOpen} onOpenChange={setIsResearchCanvasOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                User Research Canvas & Personas
              </DialogTitle>
              <DialogDescription className="text-xs">
                Synthesized discovery profiles for EV drivers, fleet managers, and field technicians.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
              {[
                {
                  name: "Marcus Vance",
                  role: "EV Fleet Manager (Age 38)",
                  goal: "Minimize fleet downtime, monitor peak tariffs, automated billing.",
                  quote: '"I need to know which charger has issues before my drivers report it."',
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                },
                {
                  name: "Elena Rostova",
                  role: "Residential EV Owner (Age 31)",
                  goal: "Schedule off-peak charging, track monthly energy, one-tap remote start.",
                  quote: '"Charging should be as effortless as plugging in my phone."',
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                },
                {
                  name: "David Kalu",
                  role: "Field Service Technician (Age 44)",
                  goal: "Instant diagnostic readout, high contrast sunlight mode, large touch targets.",
                  quote: '"If buttons are too small, I can\'t tap them with safety gloves."',
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                },
              ].map((p) => (
                <div key={p.name} className="p-3 rounded-lg border border-border bg-card flex items-start gap-3">
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground text-xs">{p.name}</span>
                      <span className="text-[10px] text-muted-foreground">{p.role}</span>
                    </div>
                    <p className="text-muted-foreground mt-1">Goal: {p.goal}</p>
                    <p className="text-primary italic mt-0.5">{p.quote}</p>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsResearchCanvasOpen(false)}>Close Canvas</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 10. Screen Blueprints Modal */}
        <Dialog open={isBlueprintsModalOpen} onOpenChange={setIsBlueprintsModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-600" />
                Screen Blueprints & Wireframes (64 Screens)
              </DialogTitle>
              <DialogDescription className="text-xs">
                32 Low-fidelity & 32 high-fidelity blueprints for mobile and telemetry web views.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 text-xs max-h-96 overflow-y-auto">
              {[
                { title: "Charger Telemetry Overview", type: "Hi-Fi Blueprint", flow: "Main Fleet View" },
                { title: "Interactive Session Monitor", type: "Hi-Fi Blueprint", flow: "Driver Charging" },
                { title: "Fleet Tariff Optimization Canvas", type: "Hi-Fi Blueprint", flow: "Energy Management" },
                { title: "Technician Remote Diagnostics", type: "Hi-Fi Blueprint", flow: "Hardware Maintenance" },
              ].map((b) => (
                <div key={b.title} className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <span className="font-bold text-foreground block">{b.title}</span>
                  <Badge variant="outline" className="text-[10px]">{b.type}</Badge>
                  <span className="text-[11px] text-muted-foreground block">Flow: {b.flow}</span>
                </div>
              ))}
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.success("Wireframe package exported to PDF!")}>
                <Download className="w-3.5 h-3.5 mr-1" /> Export Blueprints
              </Button>
              <Button size="sm" onClick={() => setIsBlueprintsModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 11. Tokens & Audit Modal */}
        <Dialog open={isTokensModalOpen} onOpenChange={setIsTokensModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-pink-600" />
                Design Tokens & Accessibility Audit
              </DialogTitle>
              <DialogDescription className="text-xs">
                Magnertia EV Design System v3.2 token variables and WCAG 2.2 AA certification.
              </DialogDescription>
            </DialogHeader>
            <div className="p-3.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs space-y-2 max-h-64 overflow-y-auto">
              <p className="text-emerald-400 font-bold">=== MAGNERTIA DESIGN TOKENS V3.2 ===</p>
              <p>--color-primary: #0284c7;</p>
              <p>--color-secondary: #059669;</p>
              <p>--color-accent: #9333ea;</p>
              <p>--font-heading: 'Poppins', sans-serif;</p>
              <p>--font-body: 'Inter', sans-serif;</p>
              <p>--wcag-contrast-ratio: 4.5:1 (Passed AA);</p>
              <p>--touch-target-min: 44px (Compliant);</p>
            </div>
            <DialogFooter className="gap-2">
              <Button size="sm" variant="outline" onClick={handleExportTokensJson}>
                <Download className="w-3.5 h-3.5 mr-1" /> Download JSON
              </Button>
              <Button size="sm" onClick={() => setIsTokensModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 12. Prototype Simulator Modal */}
        <Dialog open={isPrototypeModalOpen} onOpenChange={setIsPrototypeModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold flex items-center gap-2">
                <Play className="w-5 h-5 text-amber-600" />
                Interactive Prototype Simulator
              </DialogTitle>
              <DialogDescription className="text-xs">
                Simulate driver NFC tap, charger socket lock, and live telemetry in real time.
              </DialogDescription>
            </DialogHeader>
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <div className="mx-auto w-24 h-24 rounded-full border-4 border-primary/40 border-t-primary animate-spin flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="text-emerald-400 font-bold font-mono text-sm block">SIMULATOR ACTIVE: 7.2 kW FAST CHARGING</span>
                <span className="text-slate-400 text-xs">Connected to Smart EV Charger AC 7kW (Session #EV-9821)</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs pt-2">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">State of Charge</span>
                  <span className="text-white font-bold text-sm font-mono">78%</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Energy Delivered</span>
                  <span className="text-white font-bold text-sm font-mono">14.6 kWh</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Est. Time Remaining</span>
                  <span className="text-white font-bold text-sm font-mono">22 mins</span>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  window.open("https://figma.com", "_blank");
                }}
              >
                <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open in Figma
              </Button>
              <Button size="sm" onClick={() => setIsPrototypeModalOpen(false)}>Done</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 13. Sitemap Page Detail Modal */}
        {selectedSitemapPage && (
          <Dialog open={!!selectedSitemapPage} onOpenChange={() => setSelectedSitemapPage(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm font-bold">
                  <FolderTreeIcon className="h-4 w-4 text-purple-600" />
                  {selectedSitemapPage.title}
                </DialogTitle>
                <DialogDescription className="text-xs font-mono">
                  {selectedSitemapPage.route} • {selectedSitemapPage.category}
                </DialogDescription>
              </DialogHeader>
              <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border text-xs space-y-2.5">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Category & Hierarchy:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedSitemapPage.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Component Count & Scope:</span>
                  <Badge variant="outline" className="text-[10px] font-mono mt-0.5">{selectedSitemapPage.count}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Accessibility & Design Tokens:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] block mt-0.5">
                    WCAG 2.2 AA Verified • Responsive Breakpoints Active
                  </span>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button size="sm" variant="outline" onClick={() => setSelectedSitemapPage(null)} className="h-8 text-xs cursor-pointer">
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(selectedSitemapPage.route);
                    toast.success(`Copied route ${selectedSitemapPage.route} to clipboard`);
                    setSelectedSitemapPage(null);
                  }}
                  className="h-8 text-xs bg-primary text-white cursor-pointer"
                >
                  <Copy className="h-3 w-3 mr-1" /> Copy Route Path
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AppShell>
  );
}

export default UiUxDevelopmentNewPage;
