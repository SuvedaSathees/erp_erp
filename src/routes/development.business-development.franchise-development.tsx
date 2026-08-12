import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
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
  Store,
  MapPin,
  Scale,
  CheckSquare,
  Clock,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/franchise-development",
)({
  head: () => ({ meta: [{ title: "Franchise Development · Magnertia ERP" }] }),
  component: FranchiseDevelopmentPage,
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

export function FranchiseDevelopmentPage() {
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

  // Form State according to Franchise Development reference UI image
  const [formData, setFormData] = useState({
    franchiseId: "FRD-2024-00056",
    formCode: "FRD-2024-25",
    franchiseProject: "Global Cafe Expansion",
    franchiseNumber: "FC-EXP-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "Food & Beverages",
    franchiseModel: "Cafe Standard Model",
    franchiseDevManager: "Rahul Sharma",
    createdDate: "05 May 2024 10:20 AM",
    lastModifiedDate: "17 May 2024 04:20 PM",
    workflowStage: "Franchise Development",

    // Section 1: Franchise Overview
    businessObjective: "Expand our cafe brand through franchise network across India and SAARC region.",
    expansionObjective: "Open 150 franchise outlets in next 3 years.",
    franchiseType: "Single Unit Franchise",
    targetIndustry: ["Cafe", "QSR", "Beverages"],
    geographicCoverage: ["India", "SAARC"],
    businessModelRef: "BM-2024-01 - Cafe Model",
    lifecycleStage: "Growth",
    priority: "High",

    // Section 2: Franchise Model Planning
    franchiseFormat: "Cafe - Standard",
    royaltyPercentage: 6.0, // 6.00%
    franchiseInvestment: 2500000, // ₹ 25,00,000
    marketingContribution: 2.0, // 2.00%
    franchiseFee: 200000, // ₹ 2,00,000
    franchiseAgreementTerm: 5, // 5 Years
    modelReadinessScore: 88,

    // Section 3: Franchise Partner Development
    partnerEligibilityCriteria: "Minimum 2 years business experience and sound financial background.",
    dueDiligenceStatus: true,
    targetFranchisees: 3000,
    backgroundVerification: true,
    qualificationProcess: "Application -> Screening -> Interview -> Due Diligence",
    franchiseTrainingProgram: "FT-001 - Cafe Training",
    partnerReadinessScore: 82,

    // Section 4: Commercial Planning
    revenueModelRef: "RM-2024-01",
    revenueForecast: 250000000, // ₹ 25,00,00,000 (₹ 25 Cr)
    pricingStrategyRef: "PS-2024-02",
    roiForFranchisee: 28.5, // 28.50%
    revenueSharingModel: "Royalty + Marketing Fee",
    breakevenPeriodMonths: 18, // 18 Months
    commercialScore: 85,

    // Section 5: Operations & Infrastructure
    siteSelectionCompleted: true,
    supplyChainConnected: true,
    infrastructureReady: true,
    operationsManualAvailable: true,
    equipmentInstalled: true,
    inventoryReady: true,
    operationalReadinessScore: 78,

    // Section 6: Legal & Compliance
    franchiseAgreementFile: "cafe_fran_agreement.pdf",
    insuranceCoverage: true,
    ndaSigned: true,
    riskAssessment: "Low operational risk. Standard franchise risks identified and mitigated.",
    trademarkLicense: true,
    regulatoryCompliance: true,
    complianceScore: 90,

    // Section 7: Performance Management
    monthlyRevenueTarget: 1500000, // ₹ 15,00,000
    slaCompliance: 90, // 90/100
    monthlySalesTarget: 3000,
    operationalEfficiencyScore: 88, // 88/100
    customerSatisfactionScore: 85, // 85/100
    performanceScore: 87,

    // Section 8: Finance & Investment
    totalInvestment: 1500000, // ₹ 15,00,000
    paybackPeriod: 18, // 18 Months
    irr: 32.4, // 32.40%
    fundingSource: "Self Funding",
    npv: 1240000, // ₹ 12,40,000
    financeScore: 83,

    // Section 9: AI Franchise Intelligence
    marketOpportunityScore: "High potential in tier 2 cities",
    riskPrediction: "Low risk based on market data",
    franchiseSuccessProbability: "Strong unit economics and demand",
    siteRecommendation: "25 cities recommended",
    revenuePotentialScore: "Very high 3-year revenue potential",
    aiIntelligenceScore: 86,

    // Section 10: Franchise Summary & Recommendation
    recommendation: "Proceed to Approval",

    // Section 12: Review & Approval Matrix
    approvals: [
      { role: "Executive Sponsor", user: "Anita Verma", status: "Approved", date: "08 May 2024", comments: "150 cafe outlet expansion model approved." },
      { role: "COO", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "Operational readiness & supply chain SLA approved." },
      { role: "CFO", user: "Manish Gupta", status: "Approved", date: "10 May 2024", comments: "28.5% franchisee ROI & 18-month payback validated." },
      { role: "Legal Head", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "Franchise agreement and NDA compliance verified." },
      { role: "Operations Head", user: "Arjun Desai", status: "Pending", date: "In Review", comments: "Site layout & equipment procurement under review." },
      { role: "Marketing Head", user: "Sneha Nair", status: "Pending", date: "In Review", comments: "National branding launch campaign under review." },
      { role: "Board Member", user: "Rajat Verma", status: "Pending", date: "Awaiting", comments: "" },
      { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Excellent unit economics and 85/100 Overall Score (88 Model, 90 Compliance, ₹25 Cr Forecast). Approved for Expansion.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Business_Plan.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Operations_Manual.pdf", type: "PDF Document", size: "5.8 MB", date: "16 May 2024", uploader: "Arjun Desai" },
    { id: "3", name: "Franchise_Agreement.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Neha Kapoor" },
    { id: "4", name: "SOP_Handbook.pdf", type: "PDF Document", size: "3.2 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Model_Financials.xlsx", type: "Excel Spreadsheet", size: "1.6 MB", date: "14 May 2024", uploader: "Manish Gupta" },
    { id: "6", name: "Legal_Compliance.pdf", type: "PDF Document", size: "1.4 MB", date: "13 May 2024", uploader: "Neha Kapoor" },
    { id: "7", name: "Market_Research.pdf", type: "PDF Document", size: "2.1 MB", date: "12 May 2024", uploader: "Sneha Nair" },
    { id: "8", name: "Site_Layout.pdf", type: "PDF Document", size: "3.5 MB", date: "11 May 2024", uploader: "Arjun Desai" },
    { id: "9", name: "Training_Program.pdf", type: "PDF Document", size: "1.9 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "04:20 PM", user: "Rahul Sharma", action: "Updated Outlets Target (150) and Revenue Forecast (₹25 Cr)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Kapoor", action: "Uploaded Franchise_Agreement.pdf and Legal_Compliance.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Intelligence Score (86/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Manish Gupta", action: "CFO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:20 AM", user: "Rahul Sharma", action: "Franchise Development Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Franchise Readiness Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      model: 0.15,
      partner: 0.15,
      commercial: 0.2,
      operational: 0.15,
      compliance: 0.15,
      performance: 0.1,
      ai: 0.1,
    };

    const weighted =
      formData.modelReadinessScore * weights.model +
      formData.partnerReadinessScore * weights.partner +
      formData.commercialScore * weights.commercial +
      formData.operationalReadinessScore * weights.operational +
      formData.complianceScore * weights.compliance +
      formData.performanceScore * weights.performance +
      formData.aiIntelligenceScore * weights.ai;

    return Math.round(weighted);
  }, [formData.modelReadinessScore, formData.partnerReadinessScore, formData.commercialScore, formData.operationalReadinessScore, formData.complianceScore, formData.performanceScore, formData.aiIntelligenceScore]);

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
      user: formData.franchiseDevManager,
      action: "Saved draft of Franchise Development project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Franchise Development draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.franchiseProject.trim()) errors.franchiseProject = "Franchise Project is required";
    if (!formData.franchiseNumber.trim()) errors.franchiseNumber = "Franchise Number is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.expansionObjective.trim()) errors.expansionObjective = "Expansion Objective is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("error", "Validation Failed", `Please fill in all ${Object.keys(errors).length} mandatory required fields before submission.`);
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    updateField("workflowStatus", "Submitted");
    updateField("workflowStage", "Executive Review Board");
    updateField("lastModifiedDate", `${formattedDate} ${formattedTime}`);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.franchiseDevManager,
      action: "Submitted Franchise Development proposal to Executive Review Board",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Franchise Development proposal submitted for executive review.");
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
      uploader: formData.franchiseDevManager,
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
      title="Franchise Development"
      breadcrumb="Development > Business Development > Franchise Development"
      description="Govern franchise model planning, partner recruitment, commercial structure, operational readiness, legal compliance, and AI franchise intelligence."
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
                <Store className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.franchiseProject}</h1>
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
                  Franchise ID: <span className="font-mono font-bold text-foreground">{formData.franchiseId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.franchiseNumber}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Franchise Strategy link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Franchise Development PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Franchise Model <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-primary block truncate mt-0.5">{formData.franchiseModel}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Franchise Manager <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.franchiseDevManager}</span>
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
          <ScoreGauge label="Model Readiness" score={formData.modelReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Partner Readiness" score={formData.partnerReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Commercial Score" score={formData.commercialScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Operational Score" score={formData.operationalReadinessScore} sub="Good" size="normal" />
          <ScoreGauge label="Compliance Score" score={formData.complianceScore} sub="Excellent" size="normal" />
          <ScoreGauge label="Performance Score" score={formData.performanceScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Intelligence Score" score={formData.aiIntelligenceScore} sub="Very Good" size="normal" />
        </div>

        {/* Main Grid: Form Sections (Left 2 Columns) & Executive AI/Health Panels (Right 1 Column) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Multi-Section Form Cards */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Franchise Overview */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> 1. Franchise Overview
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Scope & Objectives</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Franchise Type</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.franchiseType}
                    onChange={(e) => updateField("franchiseType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {[
                      "Single Unit Franchise",
                      "Multi Unit Franchise",
                      "Area Development Franchise",
                      "Master Franchise",
                      "Company-Owned Franchise",
                      "Conversion Franchise",
                      "Mobile Franchise",
                    ].map((ft) => (
                      <option key={ft} value={ft}>{ft}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Business Model Reference</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.businessModelRef}
                    onChange={(e) => updateField("businessModelRef", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Industry</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.targetIndustry.map((ind) => (
                      <span key={ind} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Geographic Coverage</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.geographicCoverage.map((geo) => (
                      <span key={geo} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                        {geo}
                      </span>
                    ))}
                  </div>
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
                    {["Franchise Planning", "Franchise Recruitment", "Due Diligence", "Partner Onboarding", "Infrastructure Setup", "Commercial Launch", "Growth", "Expansion", "Continuous Improvement"].map((s) => (
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
                    <span>Expansion Objective</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.expansionObjective}
                    onChange={(e) => updateField("expansionObjective", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.expansionObjective ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.expansionObjective && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.expansionObjective}</p>}
                </div>
              </div>
            </div>

            {/* 2. Franchise Model Planning */}
            <div id="sec-model-planning" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Store className="h-4 w-4 text-emerald-600" /> 2. Franchise Model Planning & Economics
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Model Score: <strong>{formData.modelReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Franchise Format</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.franchiseFormat}
                    onChange={(e) => updateField("franchiseFormat", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Retail Outlet", "Service Center", "Experience Center", "Distribution Hub", "Charging Station Franchise", "Digital Franchise", "Hybrid Franchise", "Cafe - Standard"].map((ff) => (
                      <option key={ff} value={ff}>{ff}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Royalty Percentage (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.royaltyPercentage} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Marketing Contribution (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.marketingContribution} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Franchise Investment</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 25,00,000`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Franchise Fee</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 2,00,000`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Agreement Term (Years)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.franchiseAgreementTerm} Years`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-indigo-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. Franchise Partner Development */}
            <div id="sec-partner-dev" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" /> 3. Franchise Partner Development
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Partner Score: <strong>{formData.partnerReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Partner Eligibility Criteria</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.partnerEligibilityCriteria}
                    onChange={(e) => updateField("partnerEligibilityCriteria", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Due Diligence Completed</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Background Verification Verified</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Qualification Process</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.qualificationProcess}
                    onChange={(e) => updateField("qualificationProcess", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Franchise Training Program</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.franchiseTrainingProgram}
                    onChange={(e) => updateField("franchiseTrainingProgram", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Commercial Planning */}
            <div id="sec-commercial-planning" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> 4. Commercial Planning & Revenue Sharing
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Commercial Score: <strong>{formData.commercialScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Model Ref</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.revenueModelRef}
                    onChange={(e) => updateField("revenueModelRef", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Pricing Strategy Ref</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.pricingStrategyRef}
                    onChange={(e) => updateField("pricingStrategyRef", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Sharing Model</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.revenueSharingModel}
                    onChange={(e) => updateField("revenueSharingModel", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Fixed Royalty", "Revenue Percentage", "Profit Sharing", "Hybrid Model", "Subscription + Royalty", "Royalty + Marketing Fee"].map((rsm) => (
                      <option key={rsm} value={rsm}>{rsm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Forecast</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 25.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Franchisee ROI (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.roiForFranchisee} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Break-even Period</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.breakevenPeriodMonths} Months`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-indigo-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 5. Operations & Infrastructure */}
            <div id="sec-operations" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" /> 5. Operations & Infrastructure Checklist
                </h3>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  Operational Score: <strong>{formData.operationalReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Site Selection Completed</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Infrastructure Ready</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Equipment Installed</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Inventory Ready</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Supply Chain Connected</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Operations Manual Available</span>
                </div>
              </div>
            </div>

            {/* 6. Legal & Compliance */}
            <div id="sec-legal-compliance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-purple-600" /> 6. Legal & Compliance Governance
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Compliance Score: <strong>{formData.complianceScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2.5 text-xs">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-primary" /> Franchise Agreement Document
                  </span>
                  <button type="button" onClick={() => setViewingFile(formData.franchiseAgreementFile)} className="font-bold text-primary hover:underline flex items-center gap-1 font-mono">
                    {formData.franchiseAgreementFile} <Download className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Insurance Coverage</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">NDA Signed</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Trademark License</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Regulatory Compliance</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Risk Assessment</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.riskAssessment}
                    onChange={(e) => updateField("riskAssessment", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 7. Performance Management */}
            <div id="sec-performance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-600" /> 7. Performance Management Metrics
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Performance Score: <strong>{formData.performanceScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Monthly Revenue Target <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">₹ 15,00,000</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Monthly Sales Target <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">3,000 Units</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">SLA Compliance <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">90 / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Operational Efficiency <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">88 / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Customer Satisfaction <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">85 / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Legal Compliance <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">87 / 100</span>
                </div>
              </div>
            </div>

            {/* 8. Finance & Investment */}
            <div id="sec-finance-investment" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> 8. Finance & Investment Model
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Finance Score: <strong>{formData.financeScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Total Investment <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">₹ 15,00,000</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Payback Period <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-indigo-600 font-mono mt-0.5 block">18 Months</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Internal Rate of Return (IRR) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">32.40 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Funding Source <MAICWBadge type="I" /></span>
                  <span className="text-sm font-bold text-foreground mt-0.5 block">{formData.fundingSource}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5 sm:col-span-2">
                  <span className="text-[11px] text-muted-foreground font-medium block">Net Present Value (NPV) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">₹ 12,40,000</span>
                </div>
              </div>
            </div>

            {/* 9. AI Franchise Intelligence */}
            <div id="sec-ai-intelligence" className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> 9. AI Franchise Intelligence
                </h3>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
                  AI Intelligence Score: {formData.aiIntelligenceScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Market Opportunity Score
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.marketOpportunityScore}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" /> Site Recommendation
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.siteRecommendation}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-600" /> Franchise Success Probability
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.franchiseSuccessProbability}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-emerald-600">
                    <DollarSign className="h-3.5 w-3.5" /> Revenue Potential Score
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.revenuePotentialScore}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
              >
                <Sparkles className="h-4 w-4" /> Open Interactive AI Franchise Intelligence Workbench <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* 10. Franchise Development Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> 10. Franchise Summary & Executive Recommendation
                </h3>
                <span className="text-xs font-bold text-emerald-600">Overall Score: {computedOverallScore}/100</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Model Readiness Score</span>
                    <span className="font-mono font-bold">{formData.modelReadinessScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${formData.modelReadinessScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Partner Readiness Score</span>
                    <span className="font-mono font-bold">{formData.partnerReadinessScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${formData.partnerReadinessScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Commercial Score</span>
                    <span className="font-mono font-bold">{formData.commercialScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${formData.commercialScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Compliance Score</span>
                    <span className="font-mono font-bold">{formData.complianceScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${formData.complianceScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>AI Intelligence Score</span>
                    <span className="font-mono font-bold">{formData.aiIntelligenceScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${formData.aiIntelligenceScore}%` }} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-muted/20 text-center space-y-3">
                  <ScoreGauge label="Overall Franchise Score" score={computedOverallScore} sub="Very Good" size="large" />

                  <div className="w-full">
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">Executive Recommendation</label>
                    <select
                      value={formData.recommendation}
                      onChange={(e) => updateField("recommendation", e.target.value)}
                      className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 text-center focus:outline-none"
                    >
                      {[
                        "Proceed to Approval",
                        "Approve Franchise Model",
                        "Recruit Franchise Partners",
                        "Complete Legal Documentation",
                        "Improve Operational Readiness",
                        "Optimize Revenue Model",
                        "Expand Franchise Network",
                        "Proceed to Commercial Launch",
                      ].map((rec) => (
                        <option key={rec} value={rec}>{rec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 11. Attachments */}
            <div id="sec-attachments" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> 11. Franchise Attachments & Artifacts
                </h3>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" /> Add Document
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

            {/* 12. Review & Approval */}
            <div id="sec-review-approval" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> 12. Governance & Executive Review Board Matrix
                </h3>
                <span className="text-xs font-semibold text-primary">8 Governance Roles</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                <h4 className="text-xs font-bold text-foreground">Record Approval Decision</h4>
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

            {/* 13. Activity History */}
            <div id="sec-activity-history" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> 13. Activity History Log
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

          {/* Right Column: Executive Panels */}
          <div className="space-y-6">

            {/* AI Franchise Insights Snapshot Panel */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI Franchise Insights
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">AI Score 86</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-blue-600" /> Top Opportunity
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    High demand in tier 2 and tier 3 cities.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Revenue Potential
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Projected revenue of ₹ 25 Cr in 3 years.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-rose-500">
                    <AlertTriangle className="h-3.5 w-3.5" /> Risk Alert
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Competition high in metro cities.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-indigo-600">
                    <Target className="h-3.5 w-3.5" /> Recommendation
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Focus on high potential emerging markets.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
              >
                View Full AI Analysis <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Key KPIs Snapshot Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Franchise KPI Snapshot
                </h3>
                <span className="text-xs font-mono text-muted-foreground">Real-time</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Target Franchisees</span>
                    <Sparkline data={[100, 120, 135, 150]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">150</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+25%</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Franchisees Onboarded</span>
                    <Sparkline data={[24, 30, 36, 42]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">42</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+15%</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Revenue Forecast</span>
                    <Sparkline data={[16, 19, 22, 25]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">₹ 25 Cr</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+28%</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Avg. ROI (Franchisees)</span>
                    <Sparkline data={[22, 24.5, 26.8, 28.5]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">28.5%</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+5%</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Payback Period</span>
                    <Sparkline data={[24, 22, 20, 18]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-indigo-600 font-mono block">18 Months</span>
                  <span className="text-[10px] text-emerald-600 font-bold">-2 Months</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Operational Score</span>
                    <Sparkline data={[68, 72, 75, 78]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">78 / 100</span>
                  <span className="text-[10px] text-emerald-600 font-bold">+8</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("info", "KPI Dashboard", "Navigating to Franchise KPI Dashboard...")}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                View KPI Dashboard <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Program Health Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-600" /> Program Health
                </h3>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">Good</span>
              </div>

              <div className="flex items-center justify-center py-2">
                <ScoreGauge label="Program Score" score={84} sub="Good" size="large" />
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Program Start Date:</span>
                  <span className="font-semibold text-foreground font-mono">01 Apr 2024</span>
                </div>
                <div className="flex justify-between">
                  <span>Target Completion:</span>
                  <span className="font-semibold text-foreground font-mono">31 Mar 2027</span>
                </div>
                <div className="flex justify-between">
                  <span>Elapsed Duration:</span>
                  <span className="font-semibold text-foreground">1 Year 1 Month</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Overall Status:</span>
                  <span className="flex items-center gap-1.5 font-bold text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span> On Track
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("info", "Activity History", "Displaying full program activity timeline...")}
                className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-primary hover:underline pt-1"
              >
                View Activity History <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* System Audit Information Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border font-bold text-foreground">
                <span>System Information</span>
                <span className="text-[10px] text-muted-foreground">Audit Log</span>
              </div>

              <div className="space-y-1.5 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created By:</span>
                  <span className="font-semibold text-foreground">{formData.franchiseDevManager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created Date:</span>
                  <span className="font-semibold text-foreground">05 May 2024 10:20 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified By:</span>
                  <span className="font-semibold text-foreground">{formData.franchiseDevManager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified Date:</span>
                  <span className="font-semibold text-foreground">17 May 2024 04:20 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Workflow Stage:</span>
                  <span className="font-semibold text-primary">{formData.workflowStage}</span>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-semibold text-foreground">v{formData.version}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                <button type="button" onClick={() => showToast("info", "Audit Trail", "Displaying system audit log...")} className="text-primary hover:underline font-semibold">
                  View Audit Trail
                </button>
                <button type="button" onClick={() => showToast("info", "Workflow Logs", "Displaying system workflow state transitions...")} className="text-muted-foreground hover:text-foreground">
                  View History
                </button>
              </div>
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Franchise Development Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.franchiseProject}</h2>
                <p className="text-xs text-muted-foreground">
                  Franchise ID: {formData.franchiseId} · Number: {formData.franchiseNumber} · Manager: {formData.franchiseDevManager}
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
                <span className="text-muted-foreground font-medium block">Revenue Forecast</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 25.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Franchisee ROI</span>
                <span className="text-lg font-bold text-foreground font-mono">28.50 %</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Franchise Model Scope & Economics</h4>
                <p className="text-muted-foreground"><strong>Type:</strong> Single Unit Franchise | <strong>Format:</strong> Cafe - Standard | <strong>Agreement Term:</strong> 5 Years</p>
                <p className="text-muted-foreground mt-1"><strong>Investment:</strong> ₹ 25,00,000 | <strong>Fee:</strong> ₹ 2,00,000 | <strong>Royalty:</strong> 6.00% | <strong>Marketing:</strong> 2.00%</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Partner Qualification & Operational Checklist</h4>
                <p className="text-muted-foreground"><strong>Qualification:</strong> Minimum 2 years business experience and sound financial background.</p>
                <p className="text-muted-foreground mt-1"><strong>Status:</strong> Site Selection, Infrastructure, Equipment, Inventory, Supply Chain, and Operations Manual ready.</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Legal Compliance & Financial Model</h4>
                <p className="text-muted-foreground"><strong>Legal:</strong> Franchise Agreement, Insurance, NDA, Trademark License, & Compliance verified (90/100).</p>
                <p className="text-muted-foreground mt-1"><strong>Financials:</strong> Payback 18 Months, IRR 32.40%, NPV ₹ 12,40,000 (Self Funded).</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Franchise Intelligence Workbench</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Neural Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Franchise Intelligence Score</span>
                <span>86 / 100 (Optimal Expansion Model)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Strong 28.5% franchisee ROI and 18-month payback period support opening 150 outlets with projected revenue of ₹25 Cr across India & SAARC.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" /> Site Selection & Location Analytics
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  25 prime locations in Tier 2 and Tier 3 cities identified with 35% higher footfall potential and lower rental overheads.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Unit Economics & Franchisee Profitability
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  6.0% royalty + 2.0% marketing fee structure ensures 28.5% net return for franchisees with sustainable brand reinvestment.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Alert & Mitigation Strategy
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Avoid hyper-saturated metro clusters. Focus on high-growth emerging hubs to protect franchisee margins and brand equity.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Franchise Document
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
                  placeholder="e.g. Site_Feasibility_Report.pdf"
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Franchise Development repository.
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
