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
  FileCheck,
  Globe,
  FileCode,
  FolderDown,
  Scale,
  Calendar,
  ShieldCheck,
  BarChart2,
  ChevronDown,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductScoreBanner } from "@/components/erp/ProductScoreBanner";
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

  attachments: [
    {
      id: "att1",
      name: "technical_file_v1.2.pdf",
      size: "15.5 MB",
      type: "PDF Dossier",
      uploadedBy: "Rahul Sharma",
      date: "18 Jun 2024",
      url: "#",
    },
    {
      id: "att2",
      name: "test_reports_package.zip",
      size: "32.4 MB",
      type: "ZIP Archive",
      uploadedBy: "Nisha Verma",
      date: "18 Jun 2024",
      url: "#",
    },
    {
      id: "att3",
      name: "compliance_matrix.xlsx",
      size: "1.2 MB",
      type: "Spreadsheet",
      uploadedBy: "Rahul Sharma",
      date: "19 Jun 2024",
      url: "#",
    },
    {
      id: "att4",
      name: "tuv_booking_confirmation.pdf",
      size: "450 KB",
      type: "PDF Receipt",
      uploadedBy: "Ananya Iyer",
      date: "20 Jun 2024",
      url: "#",
    },
  ],
  reviewers: [
    {
      role: "Compliance Manager",
      person: "Rahul Sharma",
      decision: "Approved",
      date: "18 Jun 2024",
      comments: "All statutory safety directives aligned.",
    },
    {
      role: "Certification Coordinator",
      person: "Ananya Iyer",
      decision: "Approved",
      date: "18 Jun 2024",
      comments: "TÜV sample delivery package ready.",
    },
    {
      role: "Quality Manager",
      person: "Vikram Singh",
      decision: "Approved with Conditions",
      date: "19 Jun 2024",
      comments: "Address CAPA-2024-004 thermal offset.",
    },
    {
      role: "Technical Director / CTO",
      person: "Dr. Anil Patel",
      decision: "Pending",
      date: "-",
      comments: "Pending final review.",
    },
  ],
  auditTrail: [
    {
      action: "Record Initialized",
      details: "Initialized Certification Readiness Record CR-2024-0041.",
      timestamp: "18 Jun 2024 10:15 AM",
      user: "Rahul Sharma",
      ip: "192.168.1.42",
    },
    {
      action: "Standards Mapped",
      details: "Associated IEC 61851-1, IEC 62196-2 & FCC Part 15B directives.",
      timestamp: "18 Jun 2024 11:30 AM",
      user: "Ananya Iyer",
      ip: "192.168.1.55",
    },
    {
      action: "Lab Schedule Updated",
      details: "Booked 25 Jun 2024 testing slot with TÜV Rheinland.",
      timestamp: "20 Jun 2024 02:45 PM",
      user: "Ananya Iyer",
      ip: "192.168.1.55",
    },
  ],
};

export function CertificationReadinessNewPage({
  breadcrumb = "Development > Product Development",
  tabs,
}: {
  breadcrumb?: string;
  tabs?: ReactNode;
} = {}) {
  const queryClient = useQueryClient();
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

  // Additional Interactive States
  const [showAddReviewerModal, setShowAddReviewerModal] = useState(false);
  const [newReviewerName, setNewReviewerName] = useState("");
  const [newReviewerRole, setNewReviewerRole] = useState("");
  const [uploadFileName, setUploadFileName] = useState("");
  const [uploadFileType, setUploadFileType] = useState("PDF Dossier");
  const [uploadFileSize, setUploadFileSize] = useState("4.2 MB");
  const [selectedDocPreview, setSelectedDocPreview] = useState<{
    name: string;
    file?: string;
    size?: string;
    type?: string;
    status?: string;
  } | null>(null);
  const [linkedEntityModal, setLinkedEntityModal] = useState<{
    type: string;
    id: string;
    title: string;
    description: string;
  } | null>(null);

  // CAPA actions interactive state
  const [capaActions, setCapaActions] = useState([
    {
      id: "CAPA-2024-004",
      title: "Thermal Sensor Calibration Adjustment",
      description: "Recalibrate temperature sensor offset near 70°C prior to final TÜV Rheinland submission.",
      status: "In Progress",
      assignedTo: "Vikram Singh",
      priority: "Critical",
      dueDate: "24 Jun 2024",
    },
    {
      id: "CAPA-2024-005",
      title: "Class B Radiated Emissions Snubber Verification",
      description: "Ensure capacitor snubbers on switching FETs attenuate 120MHz peak below FCC Class B limit.",
      status: "Closed",
      assignedTo: "Rahul Sharma",
      priority: "Medium",
      dueDate: "19 Jun 2024",
    },
  ]);

  // Data Fetching
  const { data: record, isLoading } = useQuery<CertificationReadinessRecord>({
    queryKey: ["certificationRecord"],
    queryFn: () => certificationReadinessService.fetchRecord(),
  });

  // Local state for instant UI responsiveness
  const [localRecord, setLocalRecord] = useState<CertificationReadinessRecord | null>(null);

  React.useEffect(() => {
    if (record && !localRecord) {
      setLocalRecord({
        ...DEFAULT_CERTIFICATION_RECORD,
        ...record,
        reviewers: record.reviewers?.length ? record.reviewers : DEFAULT_CERTIFICATION_RECORD.reviewers,
        attachments: record.attachments?.length ? record.attachments : DEFAULT_CERTIFICATION_RECORD.attachments,
        auditTrail: record.auditTrail?.length ? record.auditTrail : DEFAULT_CERTIFICATION_RECORD.auditTrail,
      });
    }
  }, [record, localRecord]);

  const safeRecord = localRecord ?? record ?? DEFAULT_CERTIFICATION_RECORD;

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
    const currentReviewers = [...(safeRecord.reviewers || [])];
    if (!currentReviewers[index]) return;
    const decisions: CertificationApprovalDecision[] = [
      "Approved",
      "Approved with Conditions",
      "Revision Required",
      "Rejected",
    ];
    const current = currentReviewers[index].decision || "Pending";
    const nextIdx = (decisions.indexOf(current as CertificationApprovalDecision) + 1) % decisions.length;
    const nextDecision = decisions[nextIdx];
    currentReviewers[index] = {
      ...currentReviewers[index],
      decision: nextDecision,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
    const updated = { ...safeRecord, reviewers: currentReviewers };
    setLocalRecord(updated);
    queryClient.setQueryData(["certificationRecord"], updated);
    toast.success(`Updated ${currentReviewers[index].person}'s decision to ${nextDecision}`);
  };

  // Toggle Workflow Status
  const handleStatusChange = (status: string) => {
    const updated = { ...safeRecord, workflowStatus: status as any };
    setLocalRecord(updated);
    queryClient.setQueryData(["certificationRecord"], updated);
  };

  // Add Reviewer
  const handleAddReviewer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewerRole.trim()) {
      toast.error("Please enter reviewer name and role");
      return;
    }
    const newRev = {
      role: newReviewerRole,
      person: newReviewerName,
      decision: "Pending" as const,
      date: "-",
      comments: "Pending review",
    };
    const updated = {
      ...safeRecord,
      reviewers: [...(safeRecord.reviewers || []), newRev],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["certificationRecord"], updated);
    setShowAddReviewerModal(false);
    setNewReviewerName("");
    setNewReviewerRole("");
    toast.success(`Added ${newRev.person} to Compliance Review Board`);
  };

  // Delete Attachment
  const handleDeleteAttachment = (name: string) => {
    const updated = {
      ...safeRecord,
      attachments: (safeRecord.attachments || []).filter((a) => a.name !== name),
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["certificationRecord"], updated);
    toast.success(`Removed attachment: ${name}`);
  };

  // Upload Attachment
  const handleUploadAttachment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) {
      toast.error("Please enter file name");
      return;
    }
    const newAtt: CertificationAttachment = {
      id: `att-${Date.now()}`,
      name: uploadFileName.endsWith(".pdf") || uploadFileName.endsWith(".zip") || uploadFileName.endsWith(".xlsx") ? uploadFileName : `${uploadFileName}.pdf`,
      size: uploadFileSize,
      type: uploadFileType,
      uploadedBy: "Rahul Sharma",
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      url: "#",
    };
    const updated = {
      ...safeRecord,
      attachments: [newAtt, ...(safeRecord.attachments || [])],
    };
    setLocalRecord(updated);
    queryClient.setQueryData(["certificationRecord"], updated);
    setIsUploadOpen(false);
    setUploadFileName("");
    toast.success(`Uploaded ${newAtt.name} to certification dossier`);
  };

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
      <div className="space-y-6 pb-16 font-sans text-slate-900 dark:text-slate-100">
        {/* Form Metadata Control Card */}
        <div className="mx-auto max-w-[1600px] px-4 pt-2">
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
                    {safeRecord.workflowStatus === "In Review" ? (
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
                              toast.success("Expedited review reminder dispatched to Compliance Review Board.");
                            }}
                            className="cursor-pointer"
                          >
                            <Send className="mr-2 h-4 w-4 text-primary" /> Send Review Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              handleStatusChange("In Progress");
                              toast.info("Status reverted to In Progress. Parameters unlocked.");
                            }}
                            className="cursor-pointer text-amber-600 dark:text-amber-400"
                          >
                            <ArrowRight className="mr-2 h-4 w-4" /> Revert Status to In Progress
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : safeRecord.workflowStatus === "Approved" ? (
                      <Badge className="h-8 px-3 text-xs font-semibold gap-1.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {safeRecord.workflowStatus}
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={handleSubmitReview}
                        disabled={submitReviewMutation.isPending}
                        className="h-8 text-xs font-semibold gap-1.5 bg-primary text-white hover:bg-primary/90 shadow-xs cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {submitReviewMutation.isPending ? "Submitting..." : "Submit for Review"}
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
                    onClick={() =>
                      setLinkedEntityModal({
                        type: "Linked Product Record",
                        id: safeRecord.linkedProductId,
                        title: "Smart EV Charger AC 7kW (Production Series v1.2)",
                        description: "Single & dual gun AC Level 2 charger (IEC 61851 compliant with Type 2 connector socket).",
                      })
                    }
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded transition-colors"
                  >
                    <span className="text-muted-foreground block text-[10px]">Linked Product</span>
                    <span className="font-bold text-slate-900 dark:text-white truncate block flex items-center gap-1">
                      {safeRecord.linkedProductId}
                      <ExternalLink className="h-2.5 w-2.5 opacity-60 shrink-0" />
                    </span>
                  </div>
                  <div
                    onClick={() =>
                      setLinkedEntityModal({
                        type: "Linked Testing & Validation",
                        id: safeRecord.linkedTestingId,
                        title: "Full Lifecycle Prototype Testing Dossier",
                        description: "All 142 compliance test procedures logged & verified across functional, thermal, EMC, and safety standards.",
                      })
                    }
                    className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 p-1 rounded transition-colors"
                  >
                    <span className="text-muted-foreground block text-[10px]">Linked Testing & Validation</span>
                    <span className="font-semibold text-primary font-mono text-[11px] underline flex items-center gap-1">
                      {safeRecord.linkedTestingId}
                      <ExternalLink className="h-2.5 w-2.5 opacity-60 shrink-0" />
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



          {/* Scores & Health Gauges Banner */}
          <div className="mx-auto max-w-[1600px] px-4 space-y-6">
            <ProductScoreBanner submoduleKey="certification-readiness" />

            {/* ====================================================================
               2. BALANCED 2-COLUMN GRID (Cards 1 to 6)
               ==================================================================== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
              {/* -----------------------------------------------------------------
                 CARD 1: Certification Project Overview
                 ----------------------------------------------------------------- */}
              <Card id="overview" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-sm font-bold">Certification Project Overview</CardTitle>
                      </div>
                      <Badge className="bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-bold">
                        Priority: High
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3.5 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium mb-1">Product Category:</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">EV Charger</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium mb-1">Target Market:</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {["India", "EU", "USA"].map((m) => (
                            <Badge key={m} variant="secondary" className="text-[10px] px-2 py-0.5 font-semibold">
                              {m}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium mb-1">Certification Objective:</span>
                      <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-800">
                        Obtain mandatory certifications for global market launch.
                      </p>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-slate-400 block text-[11px] font-medium mb-1">Regulatory Authorities:</span>
                      <div className="flex gap-2 flex-wrap">
                        {["BIS", "IEC", "CE", "FCC"].map((auth) => (
                          <span key={auth} className="inline-flex items-center px-2.5 py-1 rounded-md bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 font-bold text-xs">
                            {auth}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Global Regulatory Authority Harmonization Grid */}
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-3 space-y-2.5 mt-2">
                      <div className="flex items-center justify-between pb-1.5 border-b border-border/60">
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                          Target Market Harmonization Status
                        </span>
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 text-[10px] font-semibold">
                          3 Markets Aligned
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                          <span className="text-[10px] font-medium text-muted-foreground block">India (BIS)</span>
                          <span className="font-bold text-xs text-emerald-600">100% Verified</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                          <span className="text-[10px] font-medium text-muted-foreground block">EU (CE RED)</span>
                          <span className="font-bold text-xs text-emerald-600">100% Verified</span>
                        </div>
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                          <span className="text-[10px] font-medium text-muted-foreground block">USA (FCC)</span>
                          <span className="font-bold text-xs text-blue-600">96% Pre-Scan</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Form Code</span>
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{safeRecord.certificationReadinessId} • {safeRecord.formCode}</span>
                </div>
              </Card>

              {/* -----------------------------------------------------------------
                 CARD 2: Applicable Standards & Regulations
                 ----------------------------------------------------------------- */}
              <Card id="standards_regulations" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-sm font-bold">Applicable Standards & Regulations</CardTitle>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold">
                        Score: 86/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3.5 text-xs">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Standards</span>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">6 Selected</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Regulations</span>
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white">5 Selected</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Mandatory</span>
                        <span className="font-extrabold text-sm text-blue-600 dark:text-blue-400">4 Selected</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                        Core Directives Baseline:
                      </span>
                      {[
                        { code: "IEC 61851-1", title: "EV Conductive Charging General", authority: "BIS & IEC" },
                        { code: "IEC 62196-2", title: "Plugs & Connectors Directive", authority: "CE & RED" },
                        { code: "FCC Part 15B", title: "Class B Emissions & Immunity", authority: "FCC USA" },
                        { code: "IS 17017-1", title: "EVSE Requirements India", authority: "BIS India" },
                        { code: "ISO 26262", title: "Road Vehicles Functional Safety", authority: "ASIL-B" },
                      ].map((std) => (
                        <div
                          key={std.code}
                          className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Award className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{std.code}</span>
                            <span className="text-muted-foreground truncate text-[11px]">{std.title}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                            {std.authority}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">Gap Analysis:</span>
                      <Button
                        size="sm"
                        variant="link"
                        onClick={() => setIsGapModalOpen(true)}
                        className="h-auto p-0 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        View Analysis →
                      </Button>
                    </div>
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Standards & Regulations Score
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>86</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>

              {/* -----------------------------------------------------------------
                 CARD 3: Documentation Readiness
                 ----------------------------------------------------------------- */}
              <Card id="documentation" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <CardTitle className="text-sm font-bold">Documentation Readiness</CardTitle>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold">
                        Score: 88/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2.5 text-xs">
                    {[
                      { name: "Technical File", status: "Uploaded", file: "technical_file_v1.2.pdf", size: "15.5 MB" },
                      { name: "Design Documents & BOM", status: "Uploaded", file: "BOM_Smart_EV_Charger_v1.2.xlsx", size: "1.25 MB" },
                      { name: "Risk Assessment Report", status: "Uploaded", file: "Risk_Assessment_v1.2.pdf", size: "1.78 MB" },
                      { name: "User & Installation Manual", status: "Uploaded", file: "User_Manual_v1.2.pdf", size: "3.45 MB" },
                    ].map((doc) => (
                      <div
                        key={doc.name}
                        className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 py-2"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs truncate">
                            {doc.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {doc.file} ({doc.size})
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5">
                            {doc.status}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => setSelectedDocPreview({ name: doc.name, file: doc.file, size: doc.size, status: doc.status })}
                            className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Preview Document"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              triggerBrowserDownload(
                                doc.file,
                                `=======================================================\nDOCUMENT: ${doc.name}\nFILE: ${doc.file}\nSIZE: ${doc.size}\nRECORD: ${safeRecord.certificationReadinessId}\nPRODUCT: ${safeRecord.linkedProductId}\nSTATUS: Verified for Laboratory Submission\n=======================================================`
                              );
                              toast.success(`Downloading ${doc.file}`);
                            }}
                            className="p-1 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Download Document"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Documentation Readiness Score
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>88</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>

              {/* -----------------------------------------------------------------
                 CARD 4: Testing & Validation Readiness
                 ----------------------------------------------------------------- */}
              <Card id="testing_readiness" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <CardTitle className="text-sm font-bold">Testing & Validation Readiness</CardTitle>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold">
                        Score: 90/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2.5 text-xs">
                    {[
                      { label: "Functional Testing Completed", val: "Yes", desc: "100% nominal & boundary conditions verified" },
                      { label: "Performance Testing Completed", val: "Yes", desc: "Thermal & efficiency limits validated" },
                      { label: "Safety Testing Completed", val: "Yes", desc: "High voltage insulation & dielectric pass" },
                      { label: "Validation Report Available", val: "Yes", desc: "Accredited summary report TV-2024-0075 signed" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-lg border border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 px-3 py-2.5"
                      >
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs">
                            {item.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                        </div>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-xs shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5" /> {item.val}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Testing & Validation Score
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>90</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>

              {/* -----------------------------------------------------------------
                 CARD 5: Certification Laboratory Management
                 ----------------------------------------------------------------- */}
              <Card id="laboratory" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4 text-indigo-600" />
                        <CardTitle className="text-sm font-bold">Certification Laboratory Management</CardTitle>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 text-xs font-bold">
                        Score: 85/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block mb-1">Lab Name:</span>
                        <span className="font-bold text-slate-900 dark:text-white text-xs">TÜV Rheinland</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block mb-1">Contact Person:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">Mr. Peter Klaus</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block mb-1">Submission Date:</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400 text-xs font-mono">25 Jun 2024</span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block mb-1">Status:</span>
                        <Badge className="bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5">
                          Scheduled
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium block mb-1">Testing Scope:</span>
                      <p className="text-slate-700 dark:text-slate-300 text-[11px] bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200/70 dark:border-slate-800">
                        EMC, Safety, Performance, Environmental
                      </p>
                    </div>

                    <div className="pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsLabModalOpen(true)}
                        className="w-full text-xs font-semibold border-indigo-200 dark:border-indigo-900/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 cursor-pointer"
                      >
                        <Building className="h-3.5 w-3.5 mr-1.5" /> Schedule Lab Booking
                      </Button>
                    </div>
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Laboratory Readiness Score
                  </span>
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>85</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>

              {/* -----------------------------------------------------------------
                 CARD 6: Compliance Assessment & CAPA
                 ----------------------------------------------------------------- */}
              <Card id="compliance" className="border-border bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between scroll-mt-24">
                <div>
                  <CardHeader className="pb-3 border-b border-border/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <CardTitle className="text-sm font-bold">Compliance Assessment & CAPA</CardTitle>
                      </div>
                      <Badge className="bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 text-xs font-bold">
                        Score: 84/100
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-3 text-xs">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Non-Conformities</span>
                        <span className="font-extrabold text-sm text-amber-600 dark:text-amber-400">2</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">Critical Findings</span>
                        <span className="font-extrabold text-sm text-rose-600 dark:text-rose-400">1</span>
                      </div>
                      <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                        <span className="text-[10px] text-muted-foreground block font-medium">CAPA Status</span>
                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold mt-0.5">
                          In Progress
                        </Badge>
                      </div>
                    </div>

                    <div className="rounded-lg border p-3 bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-xs text-amber-900 dark:text-amber-300">
                          CAPA-2024-004: Thermal Sensor Calibration Adjustment
                        </span>
                        <Badge className="bg-amber-500/15 text-amber-700 text-[10px]">In Progress</Badge>
                      </div>
                      <p className="text-[11px] text-amber-800 dark:text-amber-200">
                        Recalibrate temperature sensor offset near 70°C prior to final TÜV Rheinland submission.
                      </p>
                    </div>

                    <div className="pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsCapaModalOpen(true)}
                        className="w-full text-xs font-semibold border-amber-300 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer"
                      >
                        <Shield className="h-3.5 w-3.5 mr-1.5 text-amber-600" /> Manage CAPA Actions
                      </Button>
                    </div>
                  </CardContent>
                </div>

                <div className="p-3 border-t border-border/60 bg-slate-50/60 dark:bg-slate-800/40 rounded-b-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Compliance Assessment Score
                  </span>
                  <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-3 py-1 rounded-md font-bold text-sm">
                    <span>84</span>
                    <span className="text-xs font-normal opacity-80">/100</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* ====================================================================
               3. AI COMPLIANCE ASSESSMENT (Full Width)
               ==================================================================== */}
            <Card id="ai_assessment" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    <CardTitle className="text-sm font-bold">AI Compliance Assessment</CardTitle>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 gap-1 border-purple-200 font-semibold text-xs">
                    <Sparkles className="h-3 w-3 text-purple-600" />
                    AI Score: 89/100
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  <div className="md:col-span-9 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                        Standards Review
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                        Completed
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                        Risk Assessment
                      </span>
                      <span className="text-slate-600 dark:text-slate-400 font-medium flex-1">
                        Low Risk
                      </span>
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 p-2.5 bg-slate-50/50 dark:bg-slate-800/40">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 w-1/3">
                        Prediction
                      </span>
                      <span className="text-purple-600 dark:text-purple-400 font-bold flex-1">
                        High Probability
                      </span>
                      <Sparkles className="h-4 w-4 text-purple-500 shrink-0 ml-2" />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border border-amber-200/80 dark:border-amber-900/40 p-2.5 bg-amber-50/40 dark:bg-amber-950/20">
                      <span className="font-semibold text-amber-900 dark:text-amber-300 w-1/3">
                        AI Improvement Suggestion
                      </span>
                      <span className="text-amber-800 dark:text-amber-200 font-medium flex-1">
                        Close CAPA-2024-004 thermal sensor offset item before submitting sample to TÜV Rheinland for 98% pass probability.
                      </span>
                      <Sparkles className="h-4 w-4 text-amber-600 shrink-0 ml-2" />
                    </div>
                  </div>

                  {/* AI Graphic Card */}
                  <div className="md:col-span-3 flex flex-col items-center justify-center rounded-xl bg-gradient-to-b from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border border-purple-200/60 dark:border-slate-700 p-4 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white font-bold shadow-sm mb-2">
                      AI
                    </div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Compliance Predictor</span>
                    <div className="mt-2 flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-bold text-lg">
                      <span>89</span>
                      <span className="text-xs font-normal opacity-80">/100</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ====================================================================
               4. CERTIFICATION SUMMARY & STANDARDS VERIFICATION TABLE (Full Width)
               ==================================================================== */}
            <Card id="summary" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
              <CardHeader className="px-5 py-3.5 border-b border-border/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                    className="h-8 text-xs bg-primary hover:bg-primary/90 text-white font-medium gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Scale className="h-3.5 w-3.5" /> Gap Analysis
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Responsive Table Container without side scrolling */}
                <div className="overflow-x-auto">
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
                          <td className="px-3.5 py-2.5 align-middle">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 font-mono font-bold text-[11px] text-blue-700 dark:text-blue-300 whitespace-nowrap shadow-2xs">
                              <Award className="h-3 w-3 text-blue-600 dark:text-blue-400 shrink-0" />
                              {row.code}
                            </span>
                          </td>

                          <td className="px-3 py-2.5 align-middle">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs leading-snug">
                              {row.title}
                            </div>
                          </td>

                          <td className="px-3 py-2.5 align-middle">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 text-[11px] font-medium whitespace-nowrap">
                              <Globe className="h-2.5 w-2.5 text-slate-500 shrink-0" />
                              {row.authority}
                            </span>
                          </td>

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

                          <td className="px-3.5 py-2.5 align-middle text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setSelectedDocPreview({
                                  name: `${row.code}_Compliance_Dossier.pdf`,
                                  type: "PDF Standard Dossier",
                                  size: "3.8 MB",
                                  status: row.status,
                                })
                              }
                              className="h-6 px-2 text-[11px] font-medium text-primary border-primary/20 hover:bg-primary/10 hover:border-primary/40 whitespace-nowrap gap-1 transition-all shadow-2xs cursor-pointer"
                            >
                              <FileText className="h-3 w-3 text-primary shrink-0" />
                              Dossier
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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

            {/* ====================================================================
               5. ATTACHMENTS (Full Width)
               ==================================================================== */}
            <Card id="attachments" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Attachments</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {safeRecord.attachments?.length || 0} Files
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => setIsUploadOpen(true)}
                      className="h-8 text-xs bg-primary text-white hover:bg-primary/90 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5 mr-1" /> Upload File
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  {(safeRecord.attachments || []).map((att) => (
                    <div
                      key={att.name}
                      className="flex items-center justify-between rounded-lg border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 p-2.5 transition-hover hover:bg-slate-100/60 dark:hover:bg-slate-800/80"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                        <div className="truncate">
                          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate" title={att.name}>
                            {att.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-mono">{att.size} • {att.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => setSelectedDocPreview({ name: att.name, size: att.size, type: att.type, status: "Verified Attachment" })}
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
                              `=======================================================\nATTACHMENT: ${att.name}\nTYPE: ${att.type}\nSIZE: ${att.size}\nRECORD: ${safeRecord.certificationReadinessId}\nPRODUCT: ${safeRecord.linkedProductId}\nSTATUS: Verified Master Dossier\n=======================================================`
                            );
                            toast.success(`Downloading ${att.name}`);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 transition-colors shrink-0 cursor-pointer"
                          title="Download Attachment"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(att.name)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors shrink-0 cursor-pointer"
                          title="Delete Attachment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* ====================================================================
               6. REVIEW & APPROVAL (Full Width)
               ==================================================================== */}
            <Card id="section-review" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm font-bold">Review & Approval</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-semibold">
                      Compliance Review Board
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
                      {(safeRecord.reviewers || []).filter((r) => r.decision === "Approved" || r.decision === "Approved with Conditions").length} of {(safeRecord.reviewers || []).length} Endorsed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                    {(safeRecord.reviewers || []).map((rev, i) => (
                      <div
                        key={rev.role || i}
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

                {/* Decision Form Controls */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1.5">Approval Decision:</label>
                    <div className="flex flex-wrap gap-2">
                      {(["Approved", "Approved with Conditions", "Revision Required", "On Hold", "Rejected"] as const).map((dec) => (
                        <Button
                          key={dec}
                          type="button"
                          variant={reviewDecision === dec ? "default" : "outline"}
                          size="sm"
                          onClick={() => setReviewDecision(dec)}
                          className="h-8 text-xs cursor-pointer"
                        >
                          {dec}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-900 dark:text-white block mb-1">Review Comments:</label>
                    <Textarea
                      rows={2}
                      value={reviewCommentInput}
                      onChange={(e) => setReviewCommentInput(e.target.value)}
                      placeholder="Enter compliance review comments..."
                      className="text-xs"
                    />
                  </div>

                  <Button
                    onClick={handleSubmitDecision}
                    disabled={reviewDecisionMutation.isPending}
                    className="bg-primary text-white text-xs font-bold h-8 cursor-pointer"
                  >
                    Submit Decision
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* ====================================================================
               7. SYSTEM INFORMATION (Full Width)
               ==================================================================== */}
            <Card id="system_info" className="border-border bg-white dark:bg-slate-900 shadow-xs scroll-mt-24">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-sm font-bold">System Information</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    Audit Trail Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                  <div className="md:col-span-8 grid grid-cols-2 gap-y-3 gap-x-6">
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Created By</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Rahul Sharma</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Created Date</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">18 Jun 2024 10:15 AM</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Last Modified By</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Ananya Iyer</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Last Modified Date</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">20 Jun 2024 02:45 PM</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Workflow Stage</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">In Progress</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block font-medium text-[10px]">Version</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{safeRecord.certificationVersion}</span>
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col justify-center space-y-2 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                    <button
                      type="button"
                      onClick={() => setIsAuditModalOpen(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View Audit Log</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsGapModalOpen(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View Gap Matrix</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLabModalOpen(true)}
                      className="flex items-center justify-between text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors py-1 cursor-pointer"
                    >
                      <span>View Lab Booking</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Audit trail entries */}
                <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">Recent Audit Logs:</span>
                  {[
                    { action: "Record Initialized", details: "Initialized Certification Readiness Record CR-2024-0041.", timestamp: "18 Jun 2024 10:15 AM", user: "Rahul Sharma", ip: "192.168.1.42" },
                    { action: "Standards Mapped", details: "Associated IEC 61851-1, IEC 62196-2 & FCC Part 15B directives.", timestamp: "18 Jun 2024 11:30 AM", user: "Ananya Iyer", ip: "192.168.1.55" },
                    { action: "Lab Schedule Updated", details: "Booked 25 Jun 2024 testing slot with TÜV Rheinland.", timestamp: "20 Jun 2024 02:45 PM", user: "Ananya Iyer", ip: "192.168.1.55" },
                  ].map((aud) => (
                    <div key={aud.action} className="rounded-lg border p-2 text-xs flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{aud.action}</span>
                        <span className="text-[10px] text-muted-foreground">{aud.details}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-muted-foreground block">{aud.timestamp}</span>
                        <span className="text-[10px] text-primary font-mono">{aud.user} ({aud.ip})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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
            <form onSubmit={handleUploadAttachment} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Document / File Name</label>
                <Input
                  placeholder="e.g. BIS_Test_Report_Final.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold block mb-1">Document Category</label>
                  <select
                    value={uploadFileType}
                    onChange={(e) => setUploadFileType(e.target.value)}
                    className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                  >
                    <option value="PDF Dossier">PDF Dossier</option>
                    <option value="ZIP Archive">ZIP Archive</option>
                    <option value="Spreadsheet">Spreadsheet (XLSX)</option>
                    <option value="PDF Receipt">PDF Receipt</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">File Size</label>
                  <Input
                    placeholder="e.g. 5.4 MB"
                    value={uploadFileSize}
                    onChange={(e) => setUploadFileSize(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-5 text-center space-y-1.5 bg-slate-50/50">
                <Upload className="h-6 w-6 text-muted-foreground mx-auto" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Drag and drop files here or click to browse
                </span>
                <span className="text-[10px] text-muted-foreground block">
                  Supports .pdf, .docx, .zip, .xlsx up to 50 MB
                </span>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsUploadOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-primary text-white text-xs font-bold">
                  Upload & Save
                </Button>
              </DialogFooter>
            </form>
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
                className="bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Audit Log Modal */}
        <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" /> Certification System Audit Trail
              </DialogTitle>
              <DialogDescription className="text-xs">
                Immutable compliance event log for record {safeRecord.certificationReadinessId}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 max-h-96 overflow-y-auto py-2 text-xs">
              {(safeRecord.auditTrail || []).map((aud, i) => (
                <div key={i} className="p-2.5 rounded-lg border border-border/80 bg-slate-50/60 dark:bg-slate-800/40 space-y-1">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-900 dark:text-white">{aud.action}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{aud.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">{aud.details}</p>
                  <p className="text-[10px] text-primary font-mono">{aud.user} ({aud.ip})</p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsAuditModalOpen(false)}>
                Close Log
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* CAPA Management Modal */}
        <Dialog open={isCapaModalOpen} onOpenChange={setIsCapaModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" /> Corrective & Preventive Actions (CAPA)
              </DialogTitle>
              <DialogDescription className="text-xs">
                Resolution tracking for non-conformities before statutory submission.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2 text-xs">
              {capaActions.map((capa) => (
                <div key={capa.id} className="p-3 rounded-lg border border-border bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-blue-600 font-mono">{capa.id}</span>
                    <Badge className={capa.status === "Closed" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}>
                      {capa.status}
                    </Badge>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-white">{capa.title}</p>
                  <p className="text-[11px] text-muted-foreground">{capa.description}</p>
                  <div className="flex justify-between items-center pt-1 text-[10px] text-muted-foreground">
                    <span>Assigned: {capa.assignedTo} • Due: {capa.dueDate}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-[10px] px-2"
                      onClick={() => {
                        const updated = capaActions.map((c) =>
                          c.id === capa.id ? { ...c, status: c.status === "Closed" ? "In Progress" : "Closed" } : c
                        );
                        setCapaActions(updated);
                        toast.success(`Updated ${capa.id} status to ${capa.status === "Closed" ? "In Progress" : "Closed"}`);
                      }}
                    >
                      {capa.status === "Closed" ? "Re-open" : "Mark Resolved"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button size="sm" onClick={() => setIsCapaModalOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Document Preview Modal */}
        <Dialog open={!!selectedDocPreview} onOpenChange={(open) => !open && setSelectedDocPreview(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <Eye className="h-4 w-4 text-blue-600" /> Document Dossier Preview
              </DialogTitle>
              <DialogDescription className="text-xs">
                Accredited compliance file verification and cryptographic hash checksum.
              </DialogDescription>
            </DialogHeader>
            {selectedDocPreview && (
              <div className="space-y-3 py-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-6 w-6 text-blue-600" />
                    <div>
                      <h4 className="font-bold text-foreground">{selectedDocPreview.name}</h4>
                      <p className="text-[11px] text-muted-foreground">{selectedDocPreview.type || "PDF Document"} • {selectedDocPreview.size || "3.2 MB"}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                    {selectedDocPreview.status || "Verified"}
                  </Badge>
                </div>
                <div className="p-3.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] leading-relaxed space-y-1">
                  <div className="text-emerald-400 font-bold border-b border-slate-700 pb-1 flex justify-between">
                    <span>[SHA-256 COMPLIANCE HASH]</span>
                    <span>PASS: E4A9...71D2</span>
                  </div>
                  <p>RECORD: {safeRecord.certificationReadinessId} ({safeRecord.formCode})</p>
                  <p>PRODUCT: {safeRecord.linkedProductId}</p>
                  <p>REGULATORY SCOPE: BIS, IEC, CE, FCC</p>
                  <p className="text-slate-400 mt-2">
                    Dossier verified by Certification Coordinator {safeRecord.certificationCoordinatorName} and Compliance Manager {safeRecord.complianceManagerName}.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" size="sm" onClick={() => setSelectedDocPreview(null)}>
                Close
              </Button>
              {selectedDocPreview && (
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                  onClick={() => {
                    triggerBrowserDownload(
                      selectedDocPreview.file || selectedDocPreview.name,
                      `DOCUMENT: ${selectedDocPreview.name}\nRECORD: ${safeRecord.certificationReadinessId}\nPRODUCT: ${safeRecord.linkedProductId}\nSTATUS: Verified Dossier\n=======================================================`
                    );
                    toast.success(`Downloaded ${selectedDocPreview.name}`);
                  }}
                >
                  <Download className="h-3.5 w-3.5" /> Download File
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Reviewer Modal */}
        <Dialog open={showAddReviewerModal} onOpenChange={setShowAddReviewerModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <UserCheck className="h-4 w-4 text-blue-600" /> Add Reviewer to Board
              </DialogTitle>
              <DialogDescription className="text-xs">
                Assign a compliance or engineering stakeholder to review this certification package.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddReviewer} className="space-y-3 py-2 text-xs">
              <div>
                <label className="font-semibold block mb-1">Reviewer Name</label>
                <Input
                  placeholder="e.g. Dr. Rajesh Pillai"
                  value={newReviewerName}
                  onChange={(e) => setNewReviewerName(e.target.value)}
                  className="h-8 text-xs"
                  required
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Reviewer Role / Discipline</label>
                <Input
                  placeholder="e.g. Regulatory Affairs Director"
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

        {/* Linked Entity Modal */}
        <Dialog open={!!linkedEntityModal} onOpenChange={(open) => !open && setLinkedEntityModal(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600" /> {linkedEntityModal?.type}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Cross-linked enterprise artifact in the Research & Innovation lifecycle.
              </DialogDescription>
            </DialogHeader>
            {linkedEntityModal && (
              <div className="space-y-3 py-2 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border space-y-1">
                  <span className="font-mono font-bold text-blue-600 text-sm block">{linkedEntityModal.id}</span>
                  <p className="font-semibold text-slate-900 dark:text-white">{linkedEntityModal.title}</p>
                  <p className="text-muted-foreground text-[11px]">{linkedEntityModal.description}</p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button size="sm" onClick={() => setLinkedEntityModal(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}

export default CertificationReadinessNewPage;


