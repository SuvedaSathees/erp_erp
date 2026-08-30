import React, { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessDevelopmentTabBar } from "@/components/erp/BusinessDevelopmentTabBar";
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Target,
  Users,
  Sparkles,
  ShieldCheck,
  FileText,
  Download,
  Upload,
  ChevronRight,
  Info,
  Building2,
  HelpCircle,
  Send,
  Eye,
  Save,
  MoreVertical,
  X,
  Award,
  Zap,
  BarChart3,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Share2,
  Printer,
  History,
  AlertTriangle,
  FileCheck,
  Globe,
  PieChart,
  Cpu,
  Layers,
  Landmark,
  PiggyBank,
  Handshake,
  MessageSquare,
  Scale,
  FolderLock,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/investor-relations-development",
)({
  head: () => ({ meta: [{ title: "Investor Relations Development · Magnertia ERP" }] }),
  component: InvestorRelationsDevelopmentPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for submission", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600" },
    A: { label: "A", desc: "Auto-generated / System Logged", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600" },
    I: { label: "I", desc: "Input / Master Lookup Selector", bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600" },
    C: { label: "C", desc: "Calculated Formula Field", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600" },
    W: { label: "W", desc: "Workflow Stage Gate Controlled", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600" },
  };

  const item = meta[type];
  return (
    <span
      title={item.desc}
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-bold cursor-help transition-transform hover:scale-110 shrink-0",
        item.bg,
        item.text
      )}
    >
      {item.label}
    </span>
  );
}

function ScoreGauge({
  label,
  score,
  max = 100,
  sub,
  size = "normal",
}: {
  label: string;
  score: number;
  max?: number;
  sub?: string;
  size?: "normal" | "large";
}) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const colorClass =
    score >= 90
      ? "text-emerald-500"
      : score >= 80
      ? "text-blue-600"
      : score >= 70
      ? "text-amber-500"
      : "text-rose-500";

  const isLarge = size === "large";
  const circleSize = isLarge ? 84 : 64;
  const radius = isLarge ? 36 : 26;
  const stroke = isLarge ? 7 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * pct) / 100;

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-border bg-card shadow-xs text-center transition-all hover:shadow-md hover:border-primary/30",
        isLarge ? "p-4" : "p-3"
      )}
    >
      <div className="relative grid place-items-center" style={{ width: circleSize, height: circleSize }}>
        <svg className="-rotate-90 transform" width={circleSize} height={circleSize} viewBox={`0 0 ${circleSize} ${circleSize}`}>
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/20"
            fill="transparent"
          />
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={stroke}
            className={cn("transition-all duration-1000 ease-out", colorClass)}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={cn("font-display font-bold text-foreground", isLarge ? "text-xl" : "text-sm")}>{score}</span>
          {isLarge && <span className="text-[9px] text-muted-foreground font-semibold">/ {max}</span>}
        </div>
      </div>
      <span className={cn("font-bold text-foreground truncate max-w-[120px]", isLarge ? "mt-2 text-xs" : "mt-1.5 text-[11px]")}>
        {label}
      </span>
      {sub && <span className="text-[10px] text-muted-foreground font-medium">{sub}</span>}
    </div>
  );
}

// Mini Sparkline component
function Sparkline({ data, color = "#2563eb" }: { data: number[]; color?: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;

  const points = data
    .map((val, idx) => {
      const x = (idx / (data.length - 1)) * width;
      const y = height - ((val - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible inline-block">
      <polyline fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

function InvestorRelationsDevelopmentPage() {
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; title: string; text: string } | null>(null);

  // Modals / Drawers state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form State according to Investor Relations Development reference UI image
  const [formData, setFormData] = useState({
    investorRelationsId: "IR-2024-00056",
    formCode: "IRF-2024-25",
    irProjectName: "Series B Fundraise",
    irNumber: "IRN-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "EV Solutions",
    fundraisingRound: "Series B",
    investorRelationsManager: "Rahul Sharma",
    createdDate: "05 May 2024 09:45 AM",
    lastModifiedDate: "17 May 2024 04:20 PM",
    workflowStage: "Investor Engagement",

    // Section 1: Investor Relations Overview
    businessObjective: "Raise growth capital to scale manufacturing and expand international footprint.",
    fundraisingObjective: "Raise ₹ 150 Cr to support product expansion and market penetration.",
    investorCategory: "Venture Capital",
    fundingStage: "Series B",
    capitalRequirement: 1500000000, // ₹ 150,00,00,000 (₹ 150 Cr)
    strategicPriority: "High",
    lifecycleStage: "Investor Engagement",
    priority: "High",

    // Section 2: Investor Profile
    investorName: "Alpha Growth Ventures",
    investorType: "Venture Capital",
    organization: "Alpha Growth Ventures LLP",
    country: "United States",
    industryFocus: ["Automotive", "EV Tech", "Clean Energy"],
    investmentStage: "Series B",
    ticketSize: 250000000, // ₹ 25,00,00,000 (₹ 25 Cr)
    portfolioCompanies: 18,
    investorFitScore: 87,

    // Section 3: Fundraising Opportunity Assessment
    investmentThesis: "Strong EV market opportunity with scalable technology and experienced leadership.",
    strategicAlignment: "Very Good",
    marketOpportunity: "High growth potential in EV 2W & 3W segment across emerging markets.",
    financialReadiness: "Good",
    dueDiligenceReadiness: true,
    dataRoomAvailable: true,
    assessmentScore: 84,

    // Section 4: Investor Engagement
    initialContactDate: "2024-04-15",
    followUpSchedule: "2024-05-25",
    meetingStatus: "Scheduled",
    pitchDeckShared: true,
    ndaSigned: true,
    dataRoomAccess: true,
    engagementScore: 81,

    // Section 5: Financial & Compliance
    financialModel: "EV Financial Model - Series B",
    valuationReport: "Series B Valuation Report",
    capTable: "Cap Table - Series B",
    legalDueDiligence: true,
    secretarialCompliance: true,
    regulatoryCompliance: true,
    financialReadinessScore: 83,

    // Section 6: Investment Negotiation
    proposedInvestment: 1200000000, // ₹ 120,00,00,000 (₹ 120 Cr)
    equityOffered: 18.5, // 18.50 %
    valuation: 6500000000, // ₹ 650,00,00,000 (₹ 650 Cr)
    termSheetStatus: "Under Review",
    negotiationStage: "Valuation Discussion",
    expectedClosingDate: "2024-06-30",
    negotiationScore: 78,

    // Section 7: Investor Communication
    quarterlyUpdateSent: true,
    financialReportShared: true,
    boardPresentation: true,
    kpiDashboardShared: true,
    investorQueriesClosed: true,
    communicationFrequency: "Quarterly",
    communicationScore: 85,

    // Section 8: AI Investor Intelligence
    aiInvestorMatch: "High match with EV & Clean Tech focus",
    aiFundingProbability: "76% probability of successful funding",
    aiValuationBenchmark: "₹ 620 Cr - ₹ 680 Cr valuation range",
    aiNegotiationInsights: "Investor open to performance-based terms",
    aiRiskAssessment: "Low to Medium risk",
    aiFundraisingRecommendation: "Proceed with valuation negotiation",
    aiInvestorScore: 88,

    // Section 9: Investor Relations Summary & Recommendation
    recommendation: "Proceed with Investor Meeting",

    // Section 11: Review & Approval Matrix
    approvals: [
      { role: "IR Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "₹150 Cr target, Series B pitch deck & 87% investor fit score validated." },
      { role: "CFO", user: "Anita Verma", status: "Approved", date: "09 May 2024", comments: "₹650 Cr valuation model and unit economics validated." },
      { role: "Company Secretary", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "Cap table, SHA, and secretarial filings verified." },
      { role: "Legal Head", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "Term sheet and NDA regulatory compliance cleared." },
      { role: "CEO", user: "Amit Mehta", status: "Approved", date: "12 May 2024", comments: "Strategic alignment and 18.5% equity dilution approved." },
      { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "Formal board resolution scheduled for next meeting." },
    ],
    userDecision: "Approved",
    userReviewComments: "Strong investor synergy & 84/100 Overall Score (87 Fit, 83 Financial Readiness, ₹650 Cr Valuation). Approved for Term Sheet Negotiation.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Pitch_Deck.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Business_Plan.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Amit Mehta" },
    { id: "3", name: "Financial_Model.xlsx", type: "Excel Spreadsheet", size: "3.2 MB", date: "16 May 2024", uploader: "Anita Verma" },
    { id: "4", name: "Valuation_Report.pdf", type: "PDF Document", size: "1.6 MB", date: "15 May 2024", uploader: "Anita Verma" },
    { id: "5", name: "Cap_Table.xlsx", type: "Excel Spreadsheet", size: "520 KB", date: "14 May 2024", uploader: "Vikram Singh" },
    { id: "6", name: "Term_Sheet.pdf", type: "PDF Document", size: "750 KB", date: "13 May 2024", uploader: "Neha Kapoor" },
    { id: "7", name: "Due_Diligence_Docs.pdf", type: "PDF Document", size: "5.1 MB", date: "12 May 2024", uploader: "Neha Kapoor" },
    { id: "8", name: "Board_Presentation.pdf", type: "PDF Document", size: "1.4 MB", date: "11 May 2024", uploader: "Rahul Sharma" },
    { id: "9", name: "Investor_Updates.pdf", type: "PDF Document", size: "580 KB", date: "10 May 2024", uploader: "Rahul Sharma" },
    { id: "10", name: "Supporting_Docs.pdf", type: "PDF Document", size: "1.7 MB", date: "09 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "04:20 PM", user: "Rahul Sharma", action: "Updated Proposed Investment (₹120 Cr) and Valuation (₹650 Cr)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Kapoor", action: "Uploaded Term_Sheet.pdf and Due_Diligence_Docs.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Investor Score (88/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Amit Mehta", action: "CEO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:45 AM", user: "Rahul Sharma", action: "Investor Relations Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Investor Readiness Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      fit: 0.15,
      assessment: 0.15,
      engagement: 0.15,
      financial: 0.2,
      negotiation: 0.15,
      communication: 0.1,
      ai: 0.1,
    };

    const weighted =
      formData.investorFitScore * weights.fit +
      formData.assessmentScore * weights.assessment +
      formData.engagementScore * weights.engagement +
      formData.financialReadinessScore * weights.financial +
      formData.negotiationScore * weights.negotiation +
      formData.communicationScore * weights.communication +
      formData.aiInvestorScore * weights.ai;

    return Math.round(weighted);
  }, [formData.investorFitScore, formData.assessmentScore, formData.engagementScore, formData.financialReadinessScore, formData.negotiationScore, formData.communicationScore, formData.aiInvestorScore]);

  // Field updater
  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Toast trigger
  const showToast = (type: "success" | "error" | "info", title: string, text: string) => {
    setToastMessage({ type, title, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Save Draft Action
  const handleSaveDraft = () => {
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    updateField("lastModifiedDate", `${formattedDate} ${formattedTime}`);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.investorRelationsManager,
      action: "Saved draft of Investor Relations Development project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Investor Relations draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.irProjectName.trim()) errors.irProjectName = "IR Project Name is required";
    if (!formData.irNumber.trim()) errors.irNumber = "IR Number is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.investorName.trim()) errors.investorName = "Investor Name is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("error", "Validation Failed", `Please fill in all ${Object.keys(errors).length} mandatory required fields before submission.`);
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    updateField("workflowStatus", "Submitted");
    updateField("workflowStage", "Investment Committee Review");
    updateField("lastModifiedDate", `${formattedDate} ${formattedTime}`);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.investorRelationsManager,
      action: "Submitted Investor Relations Proposal for Investment Committee Review",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Investor Relations Proposal submitted for Investment Committee Review.");
  };

  // Add Attachment Handler
  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;

    const newFile = {
      id: `file-${Date.now()}`,
      name: newFileName.endsWith(".pdf") || newFileName.endsWith(".xlsx") ? newFileName : `${newFileName}.pdf`,
      type: newFileName.endsWith(".xlsx") ? "Excel Spreadsheet" : "PDF Document",
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      date: formattedDate,
      uploader: formData.investorRelationsManager,
    };

    setAttachments((prev) => [newFile, ...prev]);
    setNewFileName("");
    setIsUploadModalOpen(false);
    showToast("success", "Attachment Uploaded", `File "${newFile.name}" attached successfully.`);
  };

  // Remove Attachment
  const handleRemoveAttachment = (id: string, name: string) => {
    setAttachments((prev) => prev.filter((item) => item.id !== id));
    showToast("info", "Attachment Removed", `File "${name}" removed.`);
  };

  return (
    <AppShell
      title="Investor Relations Development"
      breadcrumb="Development > Business Development > Investor Relations Development"
      description="Govern investor relations planning, fundraising rounds, due diligence data rooms, term sheet negotiations, governance, and AI investor intelligence."
      tabs={<BusinessDevelopmentTabBar />}
    >
      <div className="space-y-6 text-foreground">
        {/* Toast Notification */}
        {toastMessage && (
          <div
            className={cn(
              "fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-top-4 duration-300",
              toastMessage.type === "success" && "border-emerald-500/30 bg-emerald-950/90 text-emerald-100",
              toastMessage.type === "error" && "border-rose-500/30 bg-rose-950/90 text-rose-100",
              toastMessage.type === "info" && "border-blue-500/30 bg-slate-900/90 text-blue-100"
            )}
          >
            {toastMessage.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />}
            {toastMessage.type === "error" && <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0" />}
            {toastMessage.type === "info" && <Info className="h-5 w-5 text-blue-400 shrink-0" />}
            <div>
              <h4 className="text-xs font-bold">{toastMessage.title}</h4>
              <p className="text-[11px] opacity-90">{toastMessage.text}</p>
            </div>
            <button type="button" onClick={() => setToastMessage(null)} className="ml-4 opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Form Header Action Strip & Top Metadata Cards */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary font-bold shadow-inner">
                <Landmark className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.irProjectName}</h1>
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-[11px] font-bold tracking-wide",
                      formData.workflowStatus === "In Progress" && "bg-blue-500/10 border-blue-500/20 text-blue-600",
                      formData.workflowStatus === "Submitted" && "bg-amber-500/10 border-amber-500/20 text-amber-600",
                      formData.workflowStatus === "Approved" && "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                    )}
                  >
                    {formData.workflowStatus}
                  </span>
                  <span className="rounded-full bg-muted border border-border px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    v{formData.version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  IR ID: <span className="font-mono font-bold text-foreground">{formData.investorRelationsId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.irNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMaicwLegend(!showMaicwLegend)}
                className={cn(
                  "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-all",
                  showMaicwLegend ? "bg-primary/10 text-primary border-primary/30" : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Info className="h-3.5 w-3.5" /> MAICW Legend
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors active:scale-95"
              >
                <Save className="h-3.5 w-3.5 text-muted-foreground" /> Save Draft
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors active:scale-95"
              >
                <Eye className="h-3.5 w-3.5 text-muted-foreground" /> Preview
              </button>

              <button
                type="button"
                onClick={handleSubmitApproval}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-colors active:scale-95"
              >
                <Send className="h-3.5 w-3.5" /> Submit for Approval
              </button>

              <div className="relative group">
                <button type="button" className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted">
                  <MoreVertical className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full mt-1 hidden w-44 rounded-xl border border-border bg-card p-1 shadow-lg group-hover:block z-30 text-xs">
                  <button type="button" onClick={() => window.print()} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Report
                  </button>
                  <button type="button" onClick={() => showToast("info", "Share Link", "IR Strategy link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Investor Relations PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Top Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Business Unit <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.businessUnit}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Fundraising Round <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-primary block truncate mt-0.5">{formData.fundraisingRound}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                IR Manager <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.investorRelationsManager}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Created Date <MAICWBadge type="A" />
              </span>
              <span className="font-semibold text-foreground block truncate mt-0.5">{formData.createdDate}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Last Modified Date <MAICWBadge type="A" />
              </span>
              <span className="font-semibold text-foreground block truncate mt-0.5">{formData.lastModifiedDate}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Workflow Stage <MAICWBadge type="W" />
              </span>
              <span className="font-semibold text-primary block truncate mt-0.5">{formData.workflowStage}</span>
            </div>
          </div>
        </div>

        {/* MAICW Legend Panel */}
        {showMaicwLegend && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-primary/10">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4" /> MAICW Enterprise ERP Classification Standard
              </span>
              <button type="button" onClick={() => setShowMaicwLegend(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5 text-xs">
              <div className="flex items-center gap-2">
                <MAICWBadge type="M" />
                <span><strong className="text-foreground">Mandatory:</strong> Required for submission</span>
              </div>
              <div className="flex items-center gap-2">
                <MAICWBadge type="A" />
                <span><strong className="text-foreground">Auto:</strong> Generated by system</span>
              </div>
              <div className="flex items-center gap-2">
                <MAICWBadge type="I" />
                <span><strong className="text-foreground">Input:</strong> Master lookup selection</span>
              </div>
              <div className="flex items-center gap-2">
                <MAICWBadge type="C" />
                <span><strong className="text-foreground">Calculated:</strong> Formula derived</span>
              </div>
              <div className="flex items-center gap-2">
                <MAICWBadge type="W" />
                <span><strong className="text-foreground">Workflow:</strong> Stage gate controlled</span>
              </div>
            </div>
          </div>
        )}

        {/* Scores & Health Gauges Banner */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <ScoreGauge label="Overall Readiness" score={computedOverallScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Investor Fit Score" score={formData.investorFitScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Assessment Score" score={formData.assessmentScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Engagement Score" score={formData.engagementScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Financial Readiness" score={formData.financialReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Negotiation Score" score={formData.negotiationScore} sub="Good" size="normal" />
          <ScoreGauge label="Communication Score" score={formData.communicationScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Investor Score" score={formData.aiInvestorScore} sub="Excellent" size="normal" />
        </div>

        {/* Main Form Canvas */}
        <div className="w-full space-y-6">

            {/* Investor Relations Overview */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Investor Relations Overview
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Fundraising Strategy</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Investor Category</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.investorCategory}
                    onChange={(e) => updateField("investorCategory", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {[
                      "Angel Investor",
                      "Venture Capital",
                      "Corporate Venture Capital",
                      "Family Office",
                      "Private Equity",
                      "Strategic Investor",
                      "Institutional Investor",
                      "Sovereign Fund",
                      "Government Fund",
                      "Accelerator",
                      "Incubator",
                    ].map((ic) => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Funding Stage</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.fundingStage}
                    onChange={(e) => updateField("fundingStage", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Pre-Seed", "Seed", "Angel", "Pre-Series A", "Series A", "Series B", "Growth", "Pre-IPO", "IPO", "Post-IPO"].map((fs) => (
                      <option key={fs} value={fs}>{fs}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Capital Requirement</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 150.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Strategic Priority</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.strategicPriority}
                    onChange={(e) => updateField("strategicPriority", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-rose-600 focus:border-primary focus:outline-none"
                  >
                    {["Critical", "High", "Medium", "Low"].map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Lifecycle Stage</span> <MAICWBadge type="W" />
                  </label>
                  <select
                    value={formData.lifecycleStage}
                    onChange={(e) => updateField("lifecycleStage", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {["Investor Identification", "Qualification", "Investor Engagement", "Due Diligence", "Negotiation", "Investment Closure", "Post-Investment Relations"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Priority</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => updateField("priority", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-rose-600 focus:border-primary focus:outline-none"
                  >
                    {["Critical", "High", "Medium", "Low"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Business Objective</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.businessObjective}
                    onChange={(e) => updateField("businessObjective", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.businessObjective ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.businessObjective && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.businessObjective}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Fundraising Objective</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.fundraisingObjective}
                    onChange={(e) => updateField("fundraisingObjective", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Investor Profile */}
            <div id="sec-investor-profile" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" /> Investor Profile & Preferences
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Investor Fit Score: <strong>{formData.investorFitScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Investor Name</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.investorName}
                    onChange={(e) => updateField("investorName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Investor Type</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.investorType}
                    onChange={(e) => updateField("investorType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Individual", "Fund", "Corporate", "Government", "Institution", "Strategic Partner", "Venture Capital"].map((it) => (
                      <option key={it} value={it}>{it}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Organization</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => updateField("organization", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Country</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Investment Stage</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.investmentStage}
                    onChange={(e) => updateField("investmentStage", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Ticket Size</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 25.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Industry Focus</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.industryFocus.map((ind) => (
                      <span key={ind} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Fundraising Opportunity Assessment */}
            <div id="sec-assessment" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" /> Fundraising Opportunity Assessment
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Assessment Score: <strong>{formData.assessmentScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Investment Thesis</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.investmentThesis}
                    onChange={(e) => updateField("investmentThesis", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Strategic Alignment</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.strategicAlignment}
                    onChange={(e) => updateField("strategicAlignment", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {["Excellent", "Very Good", "Good", "Moderate", "Low"].map((sa) => (
                      <option key={sa} value={sa}>{sa}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Financial Readiness</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.financialReadiness}
                    onChange={(e) => updateField("financialReadiness", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {["High", "Very Good", "Good", "In Progress", "Needs Work"].map((fr) => (
                      <option key={fr} value={fr}>{fr}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Market Opportunity</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.marketOpportunity}
                    onChange={(e) => updateField("marketOpportunity", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground text-xs">Due Diligence Readiness Active</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground text-xs">Secure Virtual Data Room Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investor Engagement */}
            <div id="sec-engagement" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-blue-600" /> Investor Engagement & Pipeline
                </h3>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  Engagement Score: <strong>{formData.engagementScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Initial Contact Date</span> <MAICWBadge type="W" />
                  </label>
                  <input
                    type="date"
                    value={formData.initialContactDate}
                    onChange={(e) => updateField("initialContactDate", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Follow-up Schedule</span> <MAICWBadge type="W" />
                  </label>
                  <input
                    type="date"
                    value={formData.followUpSchedule}
                    onChange={(e) => updateField("followUpSchedule", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Meeting Status</span> <MAICWBadge type="W" />
                  </label>
                  <select
                    value={formData.meetingStatus}
                    onChange={(e) => updateField("meetingStatus", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Planned", "Scheduled", "Completed", "Follow-up Required", "Closed"].map((ms) => (
                      <option key={ms} value={ms}>{ms}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3 grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Pitch Deck Shared</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">NDA Signed</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Data Room Access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial & Compliance */}
            <div id="sec-financial-compliance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-emerald-600" /> Financial Modeling & Governance Compliance
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Financial Readiness: <strong>{formData.financialReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Financial Model</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.financialModel}
                    onChange={(e) => updateField("financialModel", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Valuation Report</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.valuationReport}
                    onChange={(e) => updateField("valuationReport", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Cap Table</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.capTable}
                    onChange={(e) => updateField("capTable", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3 grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Legal Due Diligence</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Secretarial Compliance</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Regulatory Compliance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Negotiation */}
            <div id="sec-negotiation" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> Term Sheet & Valuation Negotiation
                </h3>
                <span className="text-xs font-semibold text-amber-500 flex items-center gap-1">
                  Negotiation Score: <strong>{formData.negotiationScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Proposed Investment</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 120.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Equity Offered (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.equityOffered} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Post-Money Valuation</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 650.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Term Sheet Status</span> <MAICWBadge type="W" />
                  </label>
                  <select
                    value={formData.termSheetStatus}
                    onChange={(e) => updateField("termSheetStatus", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-amber-500 focus:border-primary focus:outline-none"
                  >
                    {["Draft", "Under Review", "Negotiation", "Accepted", "Signed", "Withdrawn"].map((tss) => (
                      <option key={tss} value={tss}>{tss}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Negotiation Stage</span> <MAICWBadge type="W" />
                  </label>
                  <select
                    value={formData.negotiationStage}
                    onChange={(e) => updateField("negotiationStage", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Initial Discussion", "Due Diligence", "Valuation Discussion", "Commercial Negotiation", "Documentation", "Closing"].map((ns) => (
                      <option key={ns} value={ns}>{ns}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Expected Closing Date</span> <MAICWBadge type="W" />
                  </label>
                  <input
                    type="date"
                    value={formData.expectedClosingDate}
                    onChange={(e) => updateField("expectedClosingDate", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Investor Communication */}
            <div id="sec-communication" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-purple-600" /> Post-Investment Stakeholder Communication
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Communication Score: <strong>{formData.communicationScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Quarterly Update Sent</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Financial Report Shared</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Board Presentation</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">KPI Dashboard Shared</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Investor Queries Closed</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Communication Frequency <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-primary font-mono block mt-0.5">{formData.communicationFrequency}</span>
                </div>
              </div>
            </div>

            {/* Investor Relations Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> Investor Relations Summary & Strategic Decision
                </h3>
                <span className="text-xs font-bold text-emerald-600">IR Readiness Rating: {computedOverallScore}/100 (Tier 1)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                  <div className="font-bold text-foreground flex items-center justify-between">
                    <span>Executive Investor Status</span>
                    <span className="text-emerald-600 font-bold">Series B Pitch Ready</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Data room certified with 76% funding probability, 87/100 investor fit, and ₹150 Cr institutional capital requirement.
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-muted/20 text-center space-y-2">
                  <label className="text-xs font-bold text-foreground block">Executive Recommendation <MAICWBadge type="M" /></label>
                  <select
                    value={formData.recommendation}
                    onChange={(e) => updateField("recommendation", e.target.value)}
                    className="w-full rounded-lg border border-emerald-500/30 bg-card px-3 py-2 text-xs font-bold text-emerald-600 text-center focus:outline-none cursor-pointer"
                  >
                    {[
                      "Approve Term Sheet & Investor Outreach",
                      "Conduct Follow-up Due Diligence",
                      "Refine Capital Allocation Strategy",
                      "Prepare Valuation Sensitivity Analysis",
                      "Proceed to Board Approval",
                    ].map((rec) => (
                      <option key={rec} value={rec}>{rec}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Attachments */}
            <div id="sec-attachments" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Investor Data Room & Attachments
                </h3>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-foreground block truncate">{file.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {file.size} · Uploaded {file.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewingFile(file.name)}
                        className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="View File"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast("info", "Download Triggered", `Downloading ${file.name}...`)}
                        className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="Download File"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(file.id, file.name)}
                        className="rounded p-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                        title="Delete File"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Review & Approval */}
            <div id="sec-review-approval" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Investment Committee Governance Matrix
                </h3>
                <span className="text-xs font-semibold text-primary">6 Governance Roles</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {formData.approvals.map((stk) => (
                  <div key={stk.role} className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground block">{stk.role}</span>
                    <span className="text-xs font-bold text-foreground block truncate">{stk.user}</span>
                    <div className="flex items-center justify-between text-[10px] pt-1">
                      <span
                        className={cn(
                          "font-bold px-1.5 py-0.5 rounded",
                          stk.status === "Approved" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        )}
                      >
                        {stk.status}
                      </span>
                      <span className="text-muted-foreground">{stk.date}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-border space-y-3">
                <h4 className="text-xs font-bold text-foreground">Record Investment Committee Decision</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Approval Decision</label>
                    <select
                      value={formData.userDecision}
                      onChange={(e) => updateField("userDecision", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                    >
                      {["Approved", "Approved with Conditions", "Revision Required", "On Hold", "Rejected"].map((dec) => (
                        <option key={dec} value={dec}>{dec}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Approval Date</label>
                    <input
                      type="date"
                      value={formData.userApprovalDate}
                      onChange={(e) => updateField("userApprovalDate", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Review Comments</label>
                  <textarea
                    rows={2}
                    value={formData.userReviewComments}
                    onChange={(e) => updateField("userReviewComments", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                    placeholder="Comments will be added during review..."
                  />
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div id="sec-activity-history" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> Activity History Log
                </h3>
                <span className="text-xs font-semibold text-muted-foreground">{activityHistory.length} Log Entries</span>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {activityHistory.map((item) => (
                  <div key={item.id} className="relative flex items-start gap-3 text-xs">
                    <div className="absolute -left-6 top-1 grid h-5 w-5 place-items-center rounded-full bg-card border border-primary text-primary">
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <div className="flex-1 rounded-lg border border-border bg-muted/20 p-2.5 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">{item.user}</span>
                        <span className="text-[10px] font-mono text-muted-foreground">{item.date} · {item.time}</span>
                      </div>
                      <p className="text-muted-foreground">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

        </div>
      </div>

      {/* Preview Executive Report Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Investor Relations Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.irProjectName}</h2>
                <p className="text-xs text-muted-foreground">
                  IR ID: {formData.investorRelationsId} · Number: {formData.irNumber} · Manager: {formData.investorRelationsManager}
                </p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Overall Readiness Score</span>
                <span className="text-lg font-bold text-emerald-600">{computedOverallScore} / 100</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Target Capital</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 150.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Valuation</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 650.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Investor Profile & Strategic Fit</h4>
                <p className="text-muted-foreground"><strong>Investor:</strong> Alpha Growth Ventures | <strong>Stage:</strong> Series B | <strong>Ticket:</strong> ₹ 25 Cr</p>
                <p className="text-muted-foreground mt-1"><strong>Fit Score:</strong> 87/100 | <strong>Focus:</strong> Automotive, EV Tech, Clean Energy</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Financial Model & Governance</h4>
                <p className="text-muted-foreground"><strong>Model:</strong> EV Financial Model Series B | <strong>Dilution:</strong> 18.50%</p>
                <p className="text-muted-foreground mt-1"><strong>Compliance:</strong> Legal Due Diligence, Secretarial Filings, and Regulatory Compliance verified.</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Term Sheet & AI Forecast</h4>
                <p className="text-muted-foreground"><strong>Funding Probability:</strong> 76% | <strong>Valuation Benchmark:</strong> ₹ 620 Cr - ₹ 680 Cr</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
              >
                <Printer className="h-4 w-4" /> Print Report
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Drawer */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-xl bg-card border-l border-border p-6 shadow-2xl overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <h3 className="text-base font-bold text-foreground">AI Investor Intelligence Workbench</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Capital Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Investor Score</span>
                <span>88 / 100 (Optimal Fundraising Fit)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Alpha Growth Ventures exhibits 88% overall syndicate fit with 76% funding probability in the target ₹ 620 Cr - ₹ 680 Cr valuation band.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> Valuation Multiple & Comp Analysis
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Comparable Series B rounds in electric mobility hardware average 6.2x forward ARR, supporting your ₹650 Cr post-money valuation ask.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Cap Table & Dilution Guard
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  An 18.5% dilution leaves founding team and ESOP pool with strong majority control of 72.8% post-closing.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-600" /> Data Room Readiness Audit
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  10 of 10 essential financial, legal, IP, and compliance artifacts are verified and watermarked for secure investor review.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(false)}
                className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload File Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" /> Attach Investor Document
              </h3>
              <button type="button" onClick={() => setIsUploadModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Document File Name</label>
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="e.g. Term_Sheet_Draft_v2.pdf"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/10">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-foreground">Click to browse or drag & drop files</p>
                <p className="text-[10px] text-muted-foreground">Supports PDF, XLSX, DOCX up to 25MB</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddAttachment}
                disabled={!newFileName.trim()}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 disabled:opacity-50"
              >
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing File Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-foreground">{viewingFile}</h3>
              </div>
              <button type="button" onClick={() => setViewingFile(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="bg-muted/20 border border-border rounded-xl p-8 text-center space-y-3">
              <FileCheck className="h-12 w-12 text-emerald-500 mx-auto" />
              <h4 className="text-sm font-bold text-foreground">Document Viewer Simulation</h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Investor Data Room repository.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => {
                  showToast("info", "Download Triggered", `Downloading ${viewingFile}...`);
                  setViewingFile(null);
                }}
                className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
              >
                <Download className="h-3.5 w-3.5" /> Download File
              </button>
              <button
                type="button"
                onClick={() => setViewingFile(null)}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
