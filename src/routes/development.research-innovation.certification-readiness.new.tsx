import { createFileRoute } from "@tanstack/react-router";
import React, { useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Stamp,
  Save,
  Send,
  MoreHorizontal,
  FileText,
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Shield,
  Zap,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  BarChart3,
  Search,
  Plus,
  Play,
  RotateCw,
  Award,
  ChevronRight,
  Eye,
  Check,
  X,
  Building,
  Thermometer,
  Gauge,
  Lock,
  ArrowRight,
  UserCheck,
  Paperclip,
  Share2,
  Printer,
  History,
  FileCheck,
  Globe,
  FileCode,
  FolderDown,
  Scale,
  Calendar,
  ShieldCheck,
  BarChart2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

import { ResearchInnovationTabBar } from "@/components/erp/ResearchInnovationTabBar";
import { AppShell } from "@/components/erp/AppShell";
import {
  CertificationReadinessTabBar,
  type CertificationTabKey,
} from "@/components/erp/CertificationReadinessTabBar";
import { certificationReadinessService } from "@/services/certificationReadinessService";
import type {
  CertificationApprovalDecision,
  CertificationFormInput,
  CertificationReadinessRecord,
  StandardRecord,
  DocReadinessRecord,
  CertificationAttachment,
  CertificationReviewer,
  CertificationAuditEntry,
} from "@/services/types";

export const Route = createFileRoute(
  "/development/research-innovation/certification-readiness/new"
)({
  component: CertificationReadinessNewPage,
});

export function CertificationReadinessFormPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <CertificationReadinessNewPage {...props} />;
}

export function CertificationReadinessPage(props: { breadcrumb?: string; tabs?: ReactNode } = {}) {
  return <CertificationReadinessNewPage {...props} />;
}

/* Helper component for SVG Circular Gauge */
function CircularScoreGauge({
  score,
  size = 110,
  strokeWidth = 10,
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


const DEFAULT_CERTIFICATION_RECORD: CertificationReadinessRecord = {
  id: "cr-rec-0041",
  certificationReadinessId: "CR-2024-0041",
  formCode: "CRF-2024-25",
  certificationProjectName: "Smart EV Charger Certification",
  certificationVersion: "v1.2.0",
  workflowStatus: "In Progress",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",

  linkedProductId: "Smart EV Charger AC 7kW",
  linkedTestingId: "TV-2024-0075",
  complianceManagerName: "Rahul Sharma",
  complianceManagerAvatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  certificationCoordinatorName: "Ananya Iyer",
  certificationCoordinatorAvatar:
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  targetMarkets: ["India", "EU", "USA"],
  regulatoryAuthorities: ["BIS", "IEC", "CE", "FCC"],
  developmentStage: "Prototype Validation",
  priority: "High",

  productCategory: "EV Charger",
  certificationObjective: "Obtain mandatory certifications for global market launch.",

  documentationScore: 88,
  testingScore: 90,
  complianceScore: 84,
  laboratoryScore: 85,
  aiScore: 89,
  overallReadinessScore: 88,
  certificationProbabilityPct: 92,

  standardsList: [
    {
      id: "std1",
      code: "IEC 61851-1",
      title: "Electric vehicle conductive charging system - General requirements",
      category: "Mandatory Standard",
      region: "Global / IEC",
      status: "Compliant",
      gapAnalysis: "Satisfied (0 Gaps)",
    },
    {
      id: "std2",
      code: "IEC 62196-2",
      title: "Plugs, socket-outlets, vehicle connectors and vehicle inlets",
      category: "Mandatory Standard",
      region: "Global / IEC",
      status: "Compliant",
      gapAnalysis: "Satisfied (0 Gaps)",
    },
  ],

  documentsList: [
    {
      id: "doc1",
      docName: "Technical File",
      category: "Technical Documentation",
      status: "Uploaded",
      owner: "Rahul Sharma",
      expiryDate: "31 Dec 2026",
      fileName: "technical_file_v1.2.pdf",
    },
  ],

  labConfig: {
    id: "lab1",
    labName: "TÜV Rheinland",
    contactPerson: "Mr. Peter Klaus",
    scope: "EMC, Safety, Performance, Environmental",
    sampleSubmissionDate: "25 Jun 2024",
    plannedCertificationDate: "20 Aug 2024",
    status: "Scheduled",
  },

  complianceConfig: {
    nonConformitiesCount: 2,
    criticalFindingsCount: 1,
    correctiveActionsStatus: "View Actions",
    preventiveActionsStatus: "View Actions",
    capaStatus: "In Progress",
    complianceScore: 84,
  },

  aiAssessment: {
    aiStandardsReview: "Completed",
    aiDocumentationReview: "Completed",
    aiRiskAssessment: "Low Risk",
    aiCertificationPrediction: "High Probability",
    aiImprovementSuggestions: "3 Suggestions",
    aiReadinessScore: 89,
  },

  readinessSummary: {
    documentationScore: 88,
    testingScore: 90,
    complianceScore: 84,
    laboratoryScore: 85,
    aiScore: 89,
    overallReadinessScore: 88,
    certificationProbabilityPct: 92,
    recommendation: "Ready for Certification Submission",
  },

  attachments: [],
  reviewers: [],
  auditTrail: [],
};

export function CertificationReadinessNewPage({
  breadcrumb = "Development > Product Development",
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<CertificationTabKey>("overview");
  const [selectedStandard, setSelectedStandard] = useState<StandardRecord | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocReadinessRecord | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Form State for Approval Decision
  const [reviewDecision, setReviewDecision] = useState<CertificationApprovalDecision>("Approved");
  const [reviewCommentInput, setReviewCommentInput] = useState("");

  // Modals state
  const [isGapModalOpen, setIsGapModalOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [isCapaModalOpen, setIsCapaModalOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Data Fetching
  const { data: record, isLoading } = useQuery<CertificationReadinessRecord>({
    queryKey: ["certificationRecord"],
    queryFn: () => certificationReadinessService.fetchRecord(),
  });
  const safeRecord = record ?? DEFAULT_CERTIFICATION_RECORD;

  // Save Draft Mutation
  const saveDraftMutation = useMutation({
    mutationFn: (input: Partial<CertificationFormInput>) =>
      certificationReadinessService.saveDraft(input),
    onSuccess: (updated) => {
      queryClient.setQueryData(["certificationRecord"], updated);
      toast.success("Draft saved successfully!", {
        description: "Certification readiness parameters updated.",
      });
    },
    onError: (err: any) => {
      toast.error("Failed to save draft", {
        description: err?.message || "An error occurred while saving.",
      });
    },
  });

  // Submit for Review Mutation
  const submitReviewMutation = useMutation({
    mutationFn: (id?: string) => certificationReadinessService.submitForReview(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["certificationRecord"], updated);
      toast.success("Submitted for Executive Board Review!", {
        description: "Regulatory affairs and quality assurance leads notified.",
      });
    },
  });

  // Review Decision Mutation
  const reviewDecisionMutation = useMutation({
    mutationFn: (args: {
      id: string;
      decision: CertificationApprovalDecision;
      comments?: string;
    }) => certificationReadinessService.reviewDecision(args),
    onSuccess: (updated) => {
      queryClient.setQueryData(["certificationRecord"], updated);
      toast.success(`Decision recorded: ${reviewDecision}`, {
        description: "Certification workflow status updated.",
      });
    },
  });

  if (isLoading && !record) {
    return (
      <AppShell
        title="Certification Readiness"
        breadcrumb={breadcrumb}
        tabs={tabs ?? <ResearchInnovationTabBar />}
      >
        <div className="p-8 text-center text-muted-foreground animate-pulse font-semibold">
          Loading Certification Readiness Master Record...
        </div>
      </AppShell>
    );
  }

  const handleSaveDraft = () => {
    saveDraftMutation.mutate({
      certificationProjectName: safeRecord.certificationProjectName,
      certificationObjective: safeRecord.certificationObjective,
      targetMarket: safeRecord.targetMarkets?.[0] || "",
      regulatoryAuthority: safeRecord.regulatoryAuthorities?.[0] || "",
      priority: safeRecord.priority,
    });
  };

  const handleSubmitDecision = () => {
    reviewDecisionMutation.mutate({
      id: safeRecord.id,
      decision: reviewDecision,
      comments: reviewCommentInput || undefined,
    });
  };

  const handleSubmitReview = () => {
    submitReviewMutation.mutate(safeRecord.id);
  };

  const handleExportCsv = () => {
    const headers = ["Standard Code", "Standard Title", "Regulatory Authority", "Status", "Readiness Score", "Target Date"];
    const rows = (safeRecord.standards || []).map((s) => [
      `"${s.standardCode}"`,
      `"${s.title.replace(/"/g, '""')}"`,
      `"${s.authority}"`,
      `"${s.status}"`,
      s.readinessScore,
      `"${s.targetDate}"`,
    ]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `certification_readiness_${safeRecord.certificationReadinessId || "matrix"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Certification CSV exported successfully!");
  };

  const handleExportPdf = () => {
    toast.loading("Generating PDF Certification Dossier...", { id: "pdf-gen" });
    setTimeout(() => {
      toast.success("Readiness PDF Dossier generated!", {
        id: "pdf-gen",
        description: "Ready for audit and laboratory review.",
      });
    }, 800);
  };

  const chartData = [
    { category: "Documentation", Score: 88 },
    { category: "Testing", Score: 90 },
    { category: "Compliance", Score: 84 },
    { category: "Laboratory", Score: 85 },
    { category: "AI Assessment", Score: 89 },
  ];

  return (
    <AppShell
      title="Certification Readiness"
      breadcrumb={breadcrumb}
      description="Track ISO, CE, FCC, UL, and regulatory compliance certification readiness matrix."
      tabs={tabs ?? <ResearchInnovationTabBar />}
    >
      <div className="space-y-6 pb-12 font-sans text-slate-900 dark:text-slate-100">

            {/* Form Metadata Control Card */}
            <Card className="border-border/80 shadow-xs bg-white dark:bg-slate-900">
              <CardContent className="p-4 sm:p-5 space-y-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/60 pb-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2.5 text-primary shrink-0">
                      <Stamp className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                          {safeRecord.certificationProjectName}
                        </h1>
                        <Badge variant="outline" className="font-mono text-xs border-primary/30 text-primary">
                          {safeRecord.certificationVersion}
                        </Badge>
                        <Badge
                          className={
                            safeRecord.workflowStatus === "Approved"
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                              : safeRecord.workflowStatus === "In Review"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                          }
                        >
                          {safeRecord.workflowStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ID: <span className="font-semibold text-slate-800 dark:text-slate-200">{safeRecord.certificationReadinessId}</span> | Form Code:{" "}
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{safeRecord.formCode}</span> | Created: {safeRecord.createdOn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveDraft}
                      disabled={saveDraftMutation.isPending}
                      className="h-8 text-xs font-semibold gap-1.5 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      <Save className="h-3.5 w-3.5 text-primary" />
                      {saveDraftMutation.isPending ? "Saving..." : "Save Draft"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmitReview}
                      disabled={submitReviewMutation.isPending}
                      className="h-8 text-xs font-semibold gap-1.5 bg-primary text-white hover:bg-primary/90 shadow-xs cursor-pointer"
                    >
                      <Send className="h-3.5 w-3.5" />
                      {submitReviewMutation.isPending ? "Submitting..." : "Submit for Review"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 cursor-pointer border-slate-200 dark:border-slate-800">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 text-xs">
                        <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer">
                          <FileText className="h-3.5 w-3.5 mr-2 text-primary" /> Export PDF Report
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleExportCsv} className="cursor-pointer">
                          <FileSpreadsheet className="h-3.5 w-3.5 mr-2 text-emerald-600" /> Export CSV / Excel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsUploadOpen(true)} className="cursor-pointer">
                          <Upload className="h-3.5 w-3.5 mr-2 text-blue-600" /> Upload Document
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsGapModalOpen(true)} className="cursor-pointer">
                          <Scale className="h-3.5 w-3.5 mr-2 text-purple-600" /> Run Gap Analysis
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsLabModalOpen(true)} className="cursor-pointer">
                          <Building className="h-3.5 w-3.5 mr-2 text-indigo-600" /> Schedule Lab Booking
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => window.print()} className="cursor-pointer">
                          <Printer className="h-3.5 w-3.5 mr-2 text-slate-600" /> Print Record
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            toast.success("Link copied to clipboard!");
                          }}
                          className="cursor-pointer"
                        >
                          <Share2 className="h-3.5 w-3.5 mr-2 text-slate-600" /> Share Specification Link
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            navigator.clipboard.writeText(safeRecord.certificationReadinessId);
                            toast.success(`Copied ID: ${safeRecord.certificationReadinessId}`);
                          }}
                          className="cursor-pointer"
                        >
                          <FileCode className="h-3.5 w-3.5 mr-2 text-slate-600" /> Copy ID ({safeRecord.certificationReadinessId})
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Linked References Metadata Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs pt-1">
                  <div
                    onClick={() => toast.info(`Linked Product: ${safeRecord.linkedProductId}`, { description: "Smart EV Charger AC 7kW (Production Series v1.2)" })}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded transition-colors"
                  >
                    <span className="text-muted-foreground block text-[10px]">Linked Product</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block">
                      {safeRecord.linkedProductId}
                    </span>
                  </div>
                  <div
                    onClick={() => toast.info(`Testing & Validation: ${safeRecord.linkedTestingId}`, { description: "All 142 compliance test procedures logged & verified." })}
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded transition-colors"
                  >
                    <span className="text-muted-foreground block text-[10px]">Linked Testing & Validation</span>
                    <span className="font-semibold text-primary font-mono text-[11px] underline">
                      {safeRecord.linkedTestingId}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Compliance Manager</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {safeRecord.complianceManagerName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Certification Coordinator</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate block">
                      {safeRecord.certificationCoordinatorName}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Target Market</span>
                    <span className="font-semibold text-emerald-600 truncate block">
                      {(safeRecord.targetMarkets || []).join(", ")}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px]">Regulatory Authority</span>
                    <span className="font-semibold text-purple-600 dark:text-purple-400 truncate block">
                      {(safeRecord.regulatoryAuthorities || []).join(", ")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ====================================================================
             2. MAIN CERTIFICATION WORKSPACE (11 Tabs + Right Insights Panel)
             ==================================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  {/* 8 Numbered Section Overview Grid with Perfect Alignment */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
                    {/* Card 1: Certification Project Overview */}
                    <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                            <Award className="h-3.5 w-3.5" />
                          </span>
                          Certification Project Overview
                        </CardTitle>
                        <Badge className="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 text-[10px] font-bold px-2 py-0.5">
                          Priority: High
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Product Category:</span>
                          <span className="font-bold text-slate-900 dark:text-white text-[11px]">EV Charger</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Target Market:</span>
                          <div className="flex gap-1.5 justify-end">
                            {["India", "EU", "USA"].map((m) => (
                              <Badge key={m} variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                                {m}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="py-1 border-b border-slate-100 dark:border-slate-800/60 space-y-0.5">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block">Certification Objective:</span>
                          <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
                            Obtain mandatory certifications for global market launch.
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Authorities:</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400 text-[11px]">
                            BIS, IEC, CE, FCC
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 2: Applicable Standards & Regulations */}
                    <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                            <FileCheck className="h-3.5 w-3.5" />
                          </span>
                          Applicable Standards & Regulations
                        </CardTitle>
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                          Score: 86/100
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Applicable Standards:</span>
                          <span className="font-bold text-slate-900 dark:text-white text-[11px]">6 Selected</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Applicable Regulations:</span>
                          <span className="font-bold text-slate-900 dark:text-white text-[11px]">5 Selected</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Mandatory Certifications:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px]">4 Selected</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Gap Analysis:</span>
                          <Button
                            size="sm"
                            variant="link"
                            onClick={() => setIsGapModalOpen(true)}
                            className="h-auto p-0 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                          >
                            View Analysis →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 3: Documentation Readiness */}
                    <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                            <FileText className="h-3.5 w-3.5" />
                          </span>
                          Documentation Readiness
                        </CardTitle>
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                          Score: 88/100
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Technical File:</span>
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0">
                            Uploaded
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Design Documents & BOM:</span>
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0">
                            Uploaded
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Risk Assessment Report:</span>
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0">
                            Uploaded
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">User & Installation Manual:</span>
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0">
                            Uploaded
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 4: Testing & Validation Readiness */}
                    <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </span>
                          Testing & Validation Readiness
                        </CardTitle>
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                          Score: 90/100
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Functional Testing Completed:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Performance Testing Completed:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Safety Testing Completed:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Validation Report Available:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Yes
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 5: Certification Laboratory Management */}
                    <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <span className="p-1 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Building className="h-3.5 w-3.5" />
                          </span>
                          Certification Laboratory Management
                        </CardTitle>
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                          Score: 85/100
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Lab Name:</span>
                          <span className="font-bold text-slate-900 dark:text-white text-[11px]">TÜV Rheinland</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Contact Person:</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">Mr. Peter Klaus</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Submission Date:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px]">25 Jun 2024</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Status:</span>
                          <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5">
                            Scheduled
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 6: Compliance Assessment */}
                    <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <span className="p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
                            <ShieldCheck className="h-3.5 w-3.5" />
                          </span>
                          Compliance Assessment
                        </CardTitle>
                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5">
                          Score: 84/100
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Non-Conformities:</span>
                          <span className="font-bold text-amber-600 dark:text-amber-400 text-[11px]">2</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Critical Findings:</span>
                          <span className="font-bold text-rose-600 dark:text-rose-400 text-[11px]">1</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">CAPA Status:</span>
                          <Badge className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5">
                            In Progress
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 7: AI Compliance Assessment */}
                    <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full">
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <span className="p-1 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
                            <Sparkles className="h-3.5 w-3.5" />
                          </span>
                          AI Compliance Assessment
                        </CardTitle>
                        <Badge className="bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 text-[10px] font-bold px-2 py-0.5">
                          AI Score: 89/100
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2 text-xs flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Standards Review:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">Completed</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Risk Assessment:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px]">Low Risk</span>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Prediction:</span>
                          <span className="font-bold text-purple-600 dark:text-purple-400 text-[11px]">High Probability</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 8: Certification Summary & Probability */}
                    <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between h-full md:col-span-2 xl:col-span-2">
                      <CardHeader className="p-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
                        <CardTitle className="text-xs font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                          <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                            <BarChart2 className="h-3.5 w-3.5" />
                          </span>
                          Certification Summary & Probability
                        </CardTitle>
                        <Badge className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5">
                          Overall: 88/100
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-3.5 space-y-2.5 text-xs flex-1 flex flex-col justify-between">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white block">
                              Certification Success Probability:
                            </span>
                            <span className="text-[10px] text-muted-foreground">Calculated across all accredited compliance benchmarks</span>
                          </div>
                          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            92%
                          </span>
                        </div>
                        <Progress value={92} className="h-2 bg-slate-100 dark:bg-slate-800" />
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
                          <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">Recommendation:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-[11px]">
                            Ready for Certification Submission
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Section 2: Global Compliance Traceability & Standards Matrix (Fills entire workspace height) */}
                  <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <CardHeader className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                          <Scale className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                            Standards Verification & Regulatory Authority Traceability
                          </CardTitle>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Cross-border EV directives, statutory safety mandates & laboratory audit records
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5 shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          All Directives Compliant
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => setIsGapModalOpen(true)}
                          className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-medium gap-1.5 shadow-2xs"
                        >
                          <Scale className="h-3.5 w-3.5" /> Gap Analysis
                        </Button>
                      </div>
                    </CardHeader>                    <CardContent className="p-0">
                      {/* Responsive Table Container without side scrolling */}
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                            <th className="px-3.5 py-3 font-semibold w-[18%]">Standard Code</th>
                            <th className="px-3 py-3 font-semibold w-[32%]">Mandate Title & Scope</th>
                            <th className="px-3 py-3 font-semibold w-[18%]">Authority / Region</th>
                            <th className="px-3 py-3 font-semibold text-center w-[10%]">Readiness</th>
                            <th className="px-3 py-3 font-semibold text-center w-[14%]">Audit Status</th>
                            <th className="px-3.5 py-3 font-semibold text-right w-[8%]">Dossier</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {[
                            {
                              code: "IEC 61851-1",
                              title: "Electric Vehicle Conductive Charging System - General Requirements",
                              authority: "BIS & IEC (Global)",
                              readiness: "100%",
                              status: "Fully Verified",
                            },
                            {
                              code: "IEC 62196-2",
                              title: "Plugs, Socket-Outlets, Vehicle Connectors and Inlets",
                              authority: "CE & EU RED Directive",
                              readiness: "100%",
                              status: "Fully Verified",
                            },
                            {
                              code: "FCC Part 15B",
                              title: "Unintentional Radiators - Class B Emissions and Immunity",
                              authority: "FCC (USA)",
                              readiness: "96%",
                              status: "Pre-Scan Pass",
                            },
                            {
                              code: "IS 17017-1",
                              title: "Electric Vehicle Supply Equipment (EVSE) Requirements for India",
                              authority: "BIS (India)",
                              readiness: "100%",
                              status: "Fully Verified",
                            },
                            {
                              code: "ISO 26262 ASIL-B",
                              title: "Road Vehicles - Functional Safety Architecture",
                              authority: "Global Automotive",
                              readiness: "94%",
                              status: "Sign-Off In Progress",
                            },
                          ].map((row) => (
                            <tr
                              key={row.code}
                              className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
                            >
                              {/* Standard Code */}
                              <td className="px-3.5 py-2.5 align-middle">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 font-mono font-bold text-[11px] text-blue-700 dark:text-blue-300 whitespace-nowrap shadow-2xs">
                                  <Award className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                                  {row.code}
                                </span>
                              </td>

                              {/* Mandate Title */}
                              <td className="px-3 py-2.5 align-middle">
                                <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs leading-snug">
                                  {row.title}
                                </div>
                              </td>

                              {/* Authority / Region */}
                              <td className="px-3 py-2.5 align-middle">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 text-[11px] font-medium whitespace-nowrap">
                                  <Globe className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                                  {row.authority}
                                </span>
                              </td>

                              {/* Readiness */}
                              <td className="px-3 py-2.5 align-middle text-center">
                                <div className="inline-flex flex-col items-center gap-0.5">
                                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                    {row.readiness}
                                  </span>
                                  <div className="w-10 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500 rounded-full"
                                      style={{ width: row.readiness }}
                                    />
                                  </div>
                                </div>
                              </td>

                              {/* Audit Status */}
                              <td className="px-3 py-2.5 align-middle text-center">
                                {row.status === "Fully Verified" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 whitespace-nowrap shadow-2xs">
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    {row.status}
                                  </span>
                                )}
                                {row.status === "Pre-Scan Pass" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800 whitespace-nowrap shadow-2xs">
                                    <ShieldCheck className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                                    {row.status}
                                  </span>
                                )}
                                {row.status === "Sign-Off In Progress" && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 whitespace-nowrap shadow-2xs">
                                    <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                    {row.status}
                                  </span>
                                )}
                              </td>

                              {/* Action */}
                              <td className="px-3.5 py-2.5 align-middle text-right">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toast.success(`Viewing Dossier for ${row.code}`)}
                                  className="h-6 px-2 text-[11px] font-medium text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/40 whitespace-nowrap gap-1 transition-all shadow-2xs"
                                >
                                  <FileText className="h-3 w-3 text-primary shrink-0" />
                                  Dossier
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Summary Metrics Bar */}
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                            <span className="text-[11px] text-muted-foreground block font-medium">Standards Verified</span>
                            <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono mt-0.5 block">11 / 11 Pass</span>
                          </div>
                          <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                            <span className="text-[11px] text-muted-foreground block font-medium">Target Compliance Date</span>
                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">30 Sep 2024</span>
                          </div>
                          <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                            <span className="text-[11px] text-muted-foreground block font-medium">Accreditation Body</span>
                            <span className="text-sm font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-0.5 block">TÜV Rheinland</span>
                          </div>
                          <div className="p-3 rounded-lg border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
                            <span className="text-[11px] text-muted-foreground block font-medium">Submission Probability</span>
                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">92.0%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 2: APPLICABLE STANDARDS & REGULATIONS */}
              {activeTab === "standards_regulations" && (
                <div className="space-y-6">
                  <Card className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    <CardHeader className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <span className="p-1.5 rounded-lg bg-blue-100/80 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
                          <Scale className="h-4 w-4" />
                        </span>
                        Applicable Standards Matrix ({(safeRecord.standardsList || []).length})
                      </CardTitle>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-xs font-semibold px-2.5 py-1 flex items-center gap-1.5 shadow-2xs">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Standards Score: 86%
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => setIsGapModalOpen(true)}
                          className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-medium gap-1.5 shadow-2xs"
                        >
                          <Plus className="h-3.5 w-3.5" /> Perform Gap Analysis
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50/80 dark:bg-slate-800/70 text-slate-500 dark:text-slate-400 font-semibold text-[11px] uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800">
                            <th className="px-3.5 py-3 font-semibold w-[20%]">Standard Code</th>
                            <th className="px-3 py-3 font-semibold w-[32%]">Title & Scope</th>
                            <th className="px-3 py-3 font-semibold w-[18%]">Category</th>
                            <th className="px-3 py-3 font-semibold text-center w-[15%]">Status</th>
                            <th className="px-3.5 py-3 font-semibold text-right w-[15%]">Gap Analysis</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {(safeRecord.standardsList || []).map((std) => (
                            <tr key={std.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group">
                              <td className="px-3.5 py-2.5 align-middle">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 font-mono font-bold text-[11px] text-blue-700 dark:text-blue-300 whitespace-nowrap shadow-2xs">
                                  <Award className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                                  {std.code}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 align-middle font-semibold text-slate-900 dark:text-slate-100 text-xs">{std.title}</td>
                              <td className="px-3 py-2.5 align-middle">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-[11px] font-medium whitespace-nowrap">
                                  {std.category}
                                </span>
                              </td>
                              <td className="px-3 py-2.5 align-middle text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 whitespace-nowrap shadow-2xs">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                  {std.status}
                                </span>
                              </td>
                              <td className="px-3.5 py-2.5 align-middle font-medium text-slate-700 dark:text-slate-300 text-xs text-right">{std.gapAnalysis}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 3: DOCUMENTATION */}
              {activeTab === "documentation" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" /> Required Technical Files & Declarations ({(safeRecord.documentsList || []).length})
                      </CardTitle>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold">Doc Score: {safeRecord.documentationScore}%</Badge>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="rounded-lg border overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-800 text-muted-foreground font-semibold border-b">
                            <tr>
                              <th className="p-2.5">Document Name</th>
                              <th className="p-2.5">Category</th>
                              <th className="p-2.5">Status</th>
                              <th className="p-2.5">Owner</th>
                              <th className="p-2.5">Expiry Date</th>
                              <th className="p-2.5 text-right">File</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {(safeRecord.documentsList || []).map((doc) => (
                              <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                <td className="p-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" /> {doc.docName}
                                </td>
                                <td className="p-2.5"><Badge variant="outline" className="text-[10px]">{doc.category}</Badge></td>
                                <td className="p-2.5"><Badge className="bg-emerald-500/15 text-emerald-700 text-[10px]">{doc.status}</Badge></td>
                                <td className="p-2.5 text-muted-foreground">{doc.owner}</td>
                                <td className="p-2.5 text-muted-foreground">{doc.expiryDate}</td>
                                <td className="p-2.5 text-right">
                                  <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${doc.fileName}`)} className="h-7 text-xs text-primary">
                                    <Download className="h-3.5 w-3.5 mr-1" /> {doc.fileName}
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 4: TESTING READINESS */}
              {activeTab === "testing_readiness" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" /> Upstream Testing & Validation Traceability
                      </CardTitle>
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold">Testing Score: {safeRecord.testingScore}%</Badge>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { label: "Functional Testing", status: "Completed (24/24 Pass)" },
                          { label: "Performance Testing", status: "Completed (12,500h MTBF)" },
                          { label: "Reliability Testing", status: "Completed (2,000 Cycles)" },
                          { label: "Safety Testing", status: "Completed (IEC 61851)" },
                          { label: "EMC/EMI Testing", status: "Completed (Class B)" },
                          { label: "Environmental Testing", status: "Completed (IP54 Verified)" },
                        ].map((t) => (
                          <div key={t.label} className="rounded-lg border p-3 bg-slate-50 dark:bg-slate-800 space-y-1">
                            <span className="font-bold text-xs text-slate-900 dark:text-white block">{t.label}</span>
                            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 inline" /> {t.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 5: LABORATORY */}
              {activeTab === "laboratory" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Building className="h-4 w-4 text-primary" /> Authorized Certification Laboratory Booking
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 font-bold">
                          Lab Score: {safeRecord.laboratoryScore}%
                        </Badge>
                        <Button size="sm" onClick={() => setIsLabModalOpen(true)} className="h-8 text-xs bg-primary text-white">
                          Inspect Booking
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="rounded-lg border p-4 bg-white dark:bg-slate-900 space-y-3">
                        <div className="flex justify-between items-center border-b pb-2">
                          <div>
                            <h3 className="font-bold text-base text-slate-900 dark:text-white">{safeRecord.labConfig?.labName}</h3>
                            <p className="text-xs text-muted-foreground">Authorized Regulatory Testing Body</p>
                          </div>
                          <Badge className="bg-blue-500/15 text-blue-700 font-bold">{safeRecord.labConfig?.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Contact Person:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{safeRecord.labConfig?.contactPerson}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Testing Scope:</span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{safeRecord.labConfig?.scope}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Sample Submission:</span>
                            <span className="font-bold text-primary">{safeRecord.labConfig?.sampleSubmissionDate}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">Target Certification Date:</span>
                            <span className="font-bold text-emerald-600">{safeRecord.labConfig?.plannedCertificationDate}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 6: COMPLIANCE */}
              {activeTab === "compliance" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" /> Non-Conformities & Open CAPAs ({safeRecord.complianceConfig?.nonConformitiesCount})
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 font-bold">
                          Compliance Score: {safeRecord.complianceScore}%
                        </Badge>
                        <Button size="sm" onClick={() => setIsCapaModalOpen(true)} className="h-8 text-xs bg-amber-600 text-white hover:bg-amber-700">
                          + Manage CAPA
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="rounded-lg border p-3 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-amber-900 dark:text-amber-300">CAPA-2024-004: Thermal Sensor Calibration Adjustment</span>
                          <Badge className="bg-amber-500/15 text-amber-700 text-[10px]">In Progress</Badge>
                        </div>
                        <p className="text-xs text-amber-800 dark:text-amber-200">
                          Recalibrate temperature sensor offset near 70°C prior to final TÜV Rheinland submission.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 7: AI ASSESSMENT */}
              {activeTab === "ai_assessment" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs bg-gradient-to-br from-purple-50/40 via-white to-slate-50 dark:from-purple-950/20 dark:via-slate-900">
                    <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
                        <Sparkles className="h-4 w-4" /> Magnertia AI Compliance & Certification Advisory
                      </CardTitle>
                      <Badge className="bg-purple-500/15 text-purple-700 dark:text-purple-400 font-bold">
                        AI Score: {safeRecord.aiScore}%
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">AI Standards & Risk Assessment</span>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          Standards review completed with low risk detected across mandatory safety and EMC directives.
                        </p>
                      </div>
                      <div className="rounded-lg border bg-white dark:bg-slate-800 p-4 space-y-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white block">AI Optimization Suggestions</span>
                        <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold">
                          Close CAPA-2024-004 thermal sensor offset item before submitting sample to TÜV Rheinland for 98% pass probability.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 8: SUMMARY */}
              {activeTab === "summary" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 pb-2 border-b">
                      <CardTitle className="text-sm font-bold">Readiness Summary & Final Submission Recommendation</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-3">
                        {[
                          { label: "Documentation Readiness", score: safeRecord.documentationScore },
                          { label: "Testing & Validation", score: safeRecord.testingScore },
                          { label: "Compliance & CAPA", score: safeRecord.complianceScore },
                          { label: "Laboratory Submission", score: safeRecord.laboratoryScore },
                          { label: "AI Predictive Compliance", score: safeRecord.aiScore },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                              <span className="text-primary font-mono">{item.score}%</span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 9: ATTACHMENTS */}
              {activeTab === "attachments" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 pb-2 border-b flex flex-row items-center justify-between">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-primary" /> Certification Package Assets ({(safeRecord.attachments || []).length})
                      </CardTitle>
                      <Button size="sm" onClick={() => setIsUploadOpen(true)} className="h-8 text-xs bg-primary text-white">
                        + Upload File
                      </Button>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <div className="rounded-lg border overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 dark:bg-slate-800 text-muted-foreground font-semibold border-b">
                            <tr>
                              <th className="p-2.5">File Name</th>
                              <th className="p-2.5">Type</th>
                              <th className="p-2.5">Size</th>
                              <th className="p-2.5">Date</th>
                              <th className="p-2.5 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border/60">
                            {(safeRecord.attachments || []).map((att) => (
                              <tr key={att.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                                <td className="p-2.5 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-primary" /> {att.name}
                                </td>
                                <td className="p-2.5"><Badge variant="outline" className="text-[10px]">{att.type}</Badge></td>
                                <td className="p-2.5 text-muted-foreground">{att.size}</td>
                                <td className="p-2.5 text-muted-foreground">{att.date}</td>
                                <td className="p-2.5 text-right">
                                  <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${att.name}`)} className="h-7 text-xs text-primary">
                                    <Download className="h-3.5 w-3.5 mr-1" /> Download
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 10: REVIEW & APPROVAL */}
              {activeTab === "review_approval" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 pb-2 border-b">
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-primary" /> Compliance Review Board Decision Form
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-white">Approval Decision:</label>
                        <div className="flex flex-wrap gap-2">
                          {(["Approved", "Approved with Conditions", "Revision Required", "On Hold", "Rejected"] as const).map((dec) => (
                            <Button
                              key={dec}
                              type="button"
                              variant={reviewDecision === dec ? "default" : "outline"}
                              size="sm"
                              onClick={() => setReviewDecision(dec)}
                              className="h-8 text-xs"
                            >
                              {dec}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-900 dark:text-white">Review Comments:</label>
                        <Textarea
                          rows={3}
                          value={reviewCommentInput}
                          onChange={(e) => setReviewCommentInput(e.target.value)}
                          placeholder="Enter compliance review comments..."
                          className="text-xs"
                        />
                      </div>

                      <Button onClick={handleSubmitDecision} disabled={reviewDecisionMutation.isPending} className="bg-primary text-white text-xs">
                        Submit Decision
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* TAB 11: SYSTEM INFO */}
              {activeTab === "system_info" && (
                <div className="space-y-6">
                  <Card className="border-border/80 shadow-xs">
                    <CardHeader className="p-4 pb-2 border-b">
                      <CardTitle className="text-sm font-bold">System Audit Trail & History</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        {(safeRecord.auditTrail || []).map((aud) => (
                          <div key={aud.id} className="rounded-lg border p-3 text-xs flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white block">{aud.action}</span>
                              <span className="text-[10px] text-muted-foreground">{aud.details}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-muted-foreground block">{aud.timestamp}</span>
                              <span className="text-[10px] text-primary font-mono">{aud.user} ({aud.ipAddress})</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>

            {/* ====================================================================
               RIGHT INSIGHTS PANEL (4 cols on desktop)
               ==================================================================== */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
              {/* Overall Score Card matching reference screenshot */}
              <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <CardHeader className="p-4 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center justify-between">
                    <span>Overall Readiness Score</span>
                    <Award className="h-4 w-4 text-blue-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 text-center space-y-4">
                  <CircularScoreGauge
                    score={safeRecord.overallReadinessScore}
                    size={110}
                    strokeWidth={10}
                    color="#2563eb"
                  />

                  <div className="w-full mt-4 space-y-2.5 text-xs border-t border-slate-100 dark:border-slate-800/60 pt-3">
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Documentation</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {safeRecord.documentationScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${safeRecord.documentationScore}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Testing</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {safeRecord.testingScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${safeRecord.testingScore}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Compliance</span>
                        <span className="font-bold text-emerald-600 font-mono">
                          {safeRecord.complianceScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${safeRecord.complianceScore}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">Laboratory</span>
                        <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                          {safeRecord.laboratoryScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${safeRecord.laboratoryScore}%` }} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-400 font-medium">AI Assessment</span>
                        <span className="font-bold text-purple-600 font-mono">
                          {safeRecord.aiScore}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${safeRecord.aiScore}%` }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>


            </div>
          </div>

        {/* ====================================================================
           MODALS & DIALOGS
           ==================================================================== */}

        {/* Gap Analysis Inspector Modal */}
        <Dialog open={isGapModalOpen} onOpenChange={setIsGapModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Scale className="h-4 w-4 text-primary" /> Regulatory Gap Analysis Matrix
              </DialogTitle>
              <DialogDescription className="text-xs">
                Analyzing 6 mandatory standards against TÜV Rheinland & BIS submission requirements...
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="rounded-lg border bg-slate-50 dark:bg-slate-900 p-3 space-y-2">
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-bold">IEC 61851-1</span>
                  <Badge className="bg-emerald-500/15 text-emerald-700 text-[10px]">Satisfied (0 Gaps)</Badge>
                </div>
                <div className="flex justify-between items-center border-b pb-1">
                  <span className="font-bold">IEC 61000-6-3</span>
                  <Badge className="bg-amber-500/15 text-amber-700 text-[10px]">1 Minor Gap</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold">ISO 26262</span>
                  <Badge className="bg-emerald-500/15 text-emerald-700 text-[10px]">Satisfied (0 Gaps)</Badge>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsGapModalOpen(false)} className="bg-primary text-white text-xs">
                Close Inspector
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Upload Document Modal */}
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Upload className="h-4 w-4 text-blue-600" /> Upload Certification Document
              </DialogTitle>
              <DialogDescription className="text-xs">
                Upload test certificates, schematics, or regulatory declaration forms (.pdf, .zip, .xlsx).
              </DialogDescription>
            </DialogHeader>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center space-y-2 bg-slate-50/50">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                Drag and drop files here or click to browse
              </span>
              <span className="text-[10px] text-muted-foreground block">
                Supports .pdf, .docx, .zip, .xlsx up to 50 MB
              </span>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  setIsUploadOpen(false);
                  toast.success("Document uploaded & linked to certification file!");
                }}
                className="bg-primary text-white text-xs font-bold"
              >
                Upload & Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lab Booking Modal */}
        <Dialog open={isLabModalOpen} onOpenChange={setIsLabModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Building className="h-4 w-4 text-indigo-600" /> Schedule Authorized Lab Submission
              </DialogTitle>
              <DialogDescription className="text-xs">
                Book official testing window with accredited testing agency (TÜV / UL / BIS).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-900 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Preferred Lab:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">TÜV Rheinland India</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Booking Window:</span>
                  <span className="font-semibold text-primary">15 Jul 2024 – 22 Jul 2024</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Test Procedure:</span>
                  <span className="font-semibold text-emerald-600">Full EMC + Safety Validation</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                size="sm"
                onClick={() => {
                  setIsLabModalOpen(false);
                  toast.success("Lab window booked successfully!", {
                    description: "Formal booking confirmation sent to coordinator.",
                  });
                }}
                className="bg-indigo-600 text-white text-xs font-bold"
              >
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </AppShell>
  );
}

export default CertificationReadinessNewPage;


