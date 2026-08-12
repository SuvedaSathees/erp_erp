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
  Layers,
  HelpCircle,
  Send,
  Eye,
  Save,
  MoreVertical,
  X,
  Award,
  Zap,
  BarChart3,
  Check,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  FileSpreadsheet,
  Share2,
  Printer,
  History,
  AlertTriangle,
  FileCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/value-proposition-development/",
)({
  head: () => ({ meta: [{ title: "Value Proposition Development · Magnertia ERP" }] }),
  component: ValuePropositionDevelopmentPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for ERP submission", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600" },
    A: { label: "A", desc: "Auto-generated / System Logged", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600" },
    I: { label: "I", desc: "Input / Master Lookup Selector", bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600" },
    C: { label: "C", desc: "Calculated Formula Field", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600" },
    W: { label: "W", desc: "Workflow Stage Controlled Field", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600" },
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

export function ValuePropositionDevelopmentPage() {
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; title: string; text: string } | null>(null);

  // Modals / Drawers state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");

  // Validation State
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form State according to specifications
  const [formData, setFormData] = useState({
    vpId: "VP-2024-00048",
    formCode: "VPD-2024-25",
    vpTitle: "Smart EV Charging – Reliable, Intelligent, Future-Ready.",
    vpNumber: "VPD-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessModel: "AIoT Platform Business Model",
    productService: "Smart EV Charging Solution",
    customerSegment: "Fleet Operators",
    productManager: "Rahul Sharma",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Development",

    // Section 1: Value Proposition Overview
    businessObjective: "Deliver a reliable, intelligent EV charging solution that maximizes uptime and optimizes energy cost for fleet operators.",
    productVision: "To be the most trusted and intelligent EV charging platform for the future.",
    marketOpportunity: "Rapid adoption of EVs, high demand for scalable and smart charging infrastructure.",
    customerPersona: "Fleet Operations Manager",
    industry: "Electric Vehicles",
    lifecycleStage: "Growth",
    priority: "High",
    projectStatus: "Development",

    // Section 2: Customer Problem Analysis
    jobsToBeDone: "Operate charging stations reliably with minimal downtime.",
    painPoints: "Unplanned downtime, high energy costs, lack of remote visibility.",
    customerNeeds: "Reliable, smart, scalable, cost-effective charging with remote monitoring.",
    existingAlternatives: "Manual monitoring, basic chargers, legacy systems.",
    customerFrustrations: "Downtime, billing issues, lack of real-time insights.",
    customerPriority: "Critical",
    problemSeverityScore: 92,

    // Section 3: Value Proposition Design
    proposedSolution: "Smart EV charging platform with AI analytics, remote control & predictive maintenance.",
    vpStatement: "We help fleet operators maximize charger uptime and reduce energy costs with our intelligent EV charging platform.",
    keyBenefits: "Higher uptime, lower energy cost, remote control, predictive maintenance.",
    differentiation: "AI-powered optimization, real-time monitoring, open integration.",
    customerGains: "Operational efficiency, cost savings, better user experience.",
    innovationElements: "AI algorithms, IoT connectivity, cloud analytics, mobile app.",
    valueStrengthScore: 89,

    // Section 4: Competitive Positioning
    competitors: ["ChargePoint", "EVBox", "ABB", "Siemens"],
    competitiveAdvantages: "AI-driven optimization, predictive maintenance, open ecosystem.",
    usp: "Most intelligent, scalable and reliable EV charging platform.",
    matrixFile: "VP_Comparison_Matrix.pdf",
    switchingBarriers: "High integration cost, trained users, operational process.",
    competitiveRisk: "Rapid tech changes, new entrants, pricing pressure.",
    competitiveScore: 84,

    // Section 5: Customer Validation
    customerInterviews: 28,
    surveysCompleted: 156,
    prototypeTested: true,
    customerFeedback: "Very positive feedback on uptime and remote monitoring.",
    pmfScore: 86,
    npsScore: 52,
    validationScore: 85,

    // Section 6: Commercial Assessment
    pricingStrategy: "Value-Based Pricing",
    expectedCustomerValue: 240000,
    estimatedRevenueImpact: 250000000, // ₹ 25 Cr
    customerAcquisitionStrategy: "Digital campaigns, channel partners, OEM tie-ups.",
    salesAssetFile: "Sales_Enablement_Kit.pdf",
    commercialReadinessScore: 85,

    // Section 7: AI Assessment
    aiCustomerInsights: "High demand for uptime and cost saving.",
    aiMarketOpportunity: "Market will grow at 28% CAGR over 5 years.",
    aiDifferentiationAnalysis: "Strong differentiation with AI and open platform.",
    aiPricingRecommendation: "Value-based pricing with tiered plans.",
    aiAdoptionPrediction: "High adoption expected in next 24 months.",
    aiValueOptimization: "Focus on predictive maintenance & analytics.",
    aiValueScore: 91,

    // Section 8: Summary & Recommendation
    customerValueScore: 90,
    recommendation: "Approve Value Proposition",

    // Section 10: Approvals Governance Matrix
    approvals: [
      { role: "Product Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "High PMF score and strong feedback." },
      { role: "Marketing Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024", comments: "Validated positioning for fleet segment." },
      { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "Confirmed OEM channel partner interest." },
      { role: "Customer Success Mgr", user: "Priya Nair", status: "Approved", date: "11 May 2024", comments: "Onboarding playbooks ready." },
      { role: "Business Dev Manager", user: "Anil Kumar", status: "Pending", date: "In Review", comments: "Awaiting final commercial agreement." },
      { role: "Strategy Head", user: "Anil Mehta", status: "Pending", date: "Awaiting", comments: "" },
      { role: "COO", user: "Rakesh Patel", status: "Pending", date: "Awaiting", comments: "" },
      { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Strong customer validation with 86/100 PMF score and ₹25 Cr estimated revenue impact.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments state
  const [attachments, setAttachments] = useState([
    { id: "1", name: "VP_Canvas.pdf", type: "PDF Document", size: "2.1 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Customer_Research.pdf", type: "PDF Document", size: "5.4 MB", date: "16 May 2024", uploader: "Neha Reddy" },
    { id: "3", name: "Market_Research.pdf", type: "PDF Document", size: "8.2 MB", date: "15 May 2024", uploader: "Neha Reddy" },
    { id: "4", name: "Competitor_Analysis.pdf", type: "PDF Document", size: "3.5 MB", date: "13 May 2024", uploader: "Vikram Singh" },
    { id: "5", name: "Customer_Interviews.pdf", type: "PDF Document", size: "4.1 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Survey_Results.xlsx", type: "Excel Spreadsheet", size: "1.8 MB", date: "12 May 2024", uploader: "Priya Nair" },
    { id: "7", name: "Sales_Presentation.pdf", type: "PDF Document", size: "6.7 MB", date: "11 May 2024", uploader: "Vikram Singh" },
    { id: "8", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "12.4 MB", date: "11 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History state
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Value Proposition Statement and Customer Gains", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Reddy", action: "Uploaded Customer_Research.pdf with survey data", status: "Attachment" },
    { id: "a3", date: "14 May 2024", time: "05:10 PM", user: "AI Neural Engine", action: "Generated AI Assessment Score (91/100)", status: "AI System" },
    { id: "a4", date: "11 May 2024", time: "02:30 PM", user: "Priya Nair", action: "Customer Success Review Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "08 May 2024", time: "10:00 AM", user: "Rahul Sharma", action: "Value Proposition Form Created - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall VP Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      customerValue: 0.25,
      competitive: 0.15,
      validation: 0.2,
      commercial: 0.2,
      ai: 0.2,
    };

    const weightedScore =
      formData.customerValueScore * weights.customerValue +
      formData.competitiveScore * weights.competitive +
      formData.validationScore * weights.validation +
      formData.commercialReadinessScore * weights.commercial +
      formData.aiValueScore * weights.ai;

    return Math.round(weightedScore);
  }, [formData.customerValueScore, formData.competitiveScore, formData.validationScore, formData.commercialReadinessScore, formData.aiValueScore]);

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

    updateField("lastModifiedDate", formattedDate);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.productManager,
      action: "Saved draft of Value Proposition Form",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Value Proposition draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.vpTitle.trim()) errors.vpTitle = "Value Proposition Title is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.productVision.trim()) errors.productVision = "Product Vision is required";
    if (!formData.marketOpportunity.trim()) errors.marketOpportunity = "Market Opportunity is required";
    if (!formData.jobsToBeDone.trim()) errors.jobsToBeDone = "Customer Jobs-to-be-Done is required";
    if (!formData.proposedSolution.trim()) errors.proposedSolution = "Proposed Solution is required";
    if (!formData.vpStatement.trim()) errors.vpStatement = "Value Proposition Statement is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("error", "Validation Failed", `Please fill in all ${Object.keys(errors).length} mandatory required fields before submission.`);
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    updateField("workflowStatus", "Submitted");
    updateField("workflowStage", "Executive Review");
    updateField("lastModifiedDate", formattedDate);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.productManager,
      action: "Submitted Value Proposition for Executive Review & Approval",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Value Proposition submitted for executive review.");
  };

  // Toggle multi-select items
  const toggleCompetitor = (comp: string) => {
    const current = formData.competitors;
    const next = current.includes(comp) ? current.filter((x) => x !== comp) : [...current, comp];
    updateField("competitors", next);
  };

  // Add Attachment Handler
  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;

    const newFile = {
      id: `file-${Date.now()}`,
      name: newFileName.endsWith(".pdf") || newFileName.endsWith(".xlsx") || newFileName.endsWith(".docx") ? newFileName : `${newFileName}.pdf`,
      type: newFileName.endsWith(".xlsx") ? "Excel Spreadsheet" : "PDF Document",
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      date: formattedDate,
      uploader: formData.productManager,
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
      title="Value Proposition Development"
      breadcrumb="Development > Business Development > Value Proposition Development"
      description="Govern the research, design, validation, optimization, approval, and lifecycle strategy of enterprise value propositions."
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
                <Target className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.vpTitle}</h1>
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
                  VP ID: <span className="font-mono font-bold text-foreground">{formData.vpId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.vpNumber}</span>
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
                    <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Form
                  </button>
                  <button type="button" onClick={() => showToast("info", "Share Link", "Value Proposition link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Value Proposition as PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Business Model <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.businessModel}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Product / Service <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.productService}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Customer Segment <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.customerSegment}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Product Manager <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.productManager}</span>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <ScoreGauge label="Overall VP Score" score={computedOverallScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Customer Value" score={formData.customerValueScore} sub="Excellent" size="normal" />
          <ScoreGauge label="Competitive Score" score={formData.competitiveScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Validation Score" score={formData.validationScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Commercial Score" score={formData.commercialReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Score" score={formData.aiValueScore} sub="Excellent" size="normal" />
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs text-center transition-all hover:border-primary/30">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="mt-2 text-xs font-bold text-foreground">Lifecycle Stage</span>
            <span className="text-[11px] font-bold text-emerald-600">{formData.lifecycleStage}</span>
          </div>
        </div>

        {/* Main Grid: Form Sections (Left 2 Columns) & Executive AI/Health Panels (Right 1 Column) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Value Proposition Overview */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> 1. Value Proposition Overview
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Strategic Vision & Scope</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Persona</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.customerPersona}
                    onChange={(e) => updateField("customerPersona", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Industry</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Manufacturing", "Automotive", "Electric Vehicles", "Energy", "SaaS", "Healthcare", "Retail", "Logistics", "Government", "Education"].map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
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
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Discovery", "Research", "Validation", "MVP", "Product Launch", "Growth", "Expansion", "Continuous Improvement"].map((s) => (
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
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-amber-600 focus:border-primary focus:outline-none"
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
                    <span>Product Vision</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.productVision}
                    onChange={(e) => updateField("productVision", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.productVision ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.productVision && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.productVision}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Market Opportunity</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.marketOpportunity}
                    onChange={(e) => updateField("marketOpportunity", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.marketOpportunity ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.marketOpportunity && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.marketOpportunity}</p>}
                </div>
              </div>
            </div>

            {/* 2. Customer Problem Analysis */}
            <div id="sec-problem-analysis" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" /> 2. Customer Problem Analysis
                </h3>
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  Problem Severity Score: <strong>{formData.problemSeverityScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Jobs-to-be-Done</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.jobsToBeDone}
                    onChange={(e) => updateField("jobsToBeDone", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.jobsToBeDone ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.jobsToBeDone && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.jobsToBeDone}</p>}
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Pain Points</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.painPoints}
                    onChange={(e) => updateField("painPoints", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Needs</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.customerNeeds}
                    onChange={(e) => updateField("customerNeeds", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Existing Alternatives</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.existingAlternatives}
                    onChange={(e) => updateField("existingAlternatives", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Priority</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.customerPriority}
                    onChange={(e) => updateField("customerPriority", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-rose-600 focus:border-primary focus:outline-none"
                  >
                    {["Critical", "High", "Medium", "Low"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Value Proposition Design */}
            <div id="sec-value-design" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600" /> 3. Value Proposition Design
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Value Strength Score: <strong>{formData.valueStrengthScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Proposed Solution</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.proposedSolution}
                    onChange={(e) => updateField("proposedSolution", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.proposedSolution ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.proposedSolution && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.proposedSolution}</p>}
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Value Proposition Statement</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.vpStatement}
                    onChange={(e) => updateField("vpStatement", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.vpStatement ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.vpStatement && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.vpStatement}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Key Benefits</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.keyBenefits}
                      onChange={(e) => updateField("keyBenefits", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Differentiation</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.differentiation}
                      onChange={(e) => updateField("differentiation", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Competitive Positioning */}
            <div id="sec-competitive-positioning" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" /> 4. Competitive Positioning
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Competitive Score: <strong>{formData.competitiveScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Key Competitors (Select/Toggle)</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["ChargePoint", "EVBox", "ABB", "Siemens", "Schneider Electric", "Tesla Supercharger"].map((comp) => {
                      const isSelected = formData.competitors.includes(comp);
                      return (
                        <button
                          key={comp}
                          type="button"
                          onClick={() => toggleCompetitor(comp)}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold transition-all border",
                            isSelected ? "bg-purple-600 text-white border-purple-600" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          )}
                        >
                          {isSelected ? `✓ ${comp}` : `+ ${comp}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Unique Selling Proposition (USP)</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.usp}
                    onChange={(e) => updateField("usp", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 text-xs">
                  <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-primary" /> Value Comparison Matrix <MAICWBadge type="M" />
                  </span>
                  <button
                    type="button"
                    onClick={() => setViewingFile(formData.matrixFile)}
                    className="font-bold text-primary hover:underline flex items-center gap-1 font-mono"
                  >
                    {formData.matrixFile} <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 5. Customer Validation */}
            <div id="sec-customer-validation" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 5. Customer Validation & PMF Metrics
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Validation Score: <strong>{formData.validationScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground block">Customer Interviews <MAICWBadge type="C" /></span>
                  <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.customerInterviews}</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground block">Surveys Completed <MAICWBadge type="C" /></span>
                  <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.surveysCompleted}</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground block">PMF Score <MAICWBadge type="C" /></span>
                  <span className="mt-1 text-lg font-bold text-emerald-600 font-mono">{formData.pmfScore}/100</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground block">NPS Score <MAICWBadge type="C" /></span>
                  <span className="mt-1 text-lg font-bold text-blue-600 font-mono">{formData.npsScore}</span>
                </div>
              </div>
            </div>

            {/* 6. Commercial Assessment */}
            <div id="sec-commercial-assessment" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> 6. Commercial Assessment
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Commercial Readiness: <strong>{formData.commercialReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Pricing Strategy</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.pricingStrategy}
                    onChange={(e) => updateField("pricingStrategy", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Value-Based Pricing", "Cost-Plus Pricing", "Competitive Pricing", "Subscription", "Freemium", "Usage-Based", "Tiered Pricing"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Expected Customer Value</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ ${formData.expectedCustomerValue.toLocaleString("en-IN")}.00`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Estimated Revenue Impact</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 25,00,00,000.00 (₹ 25 Cr)`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 7. AI Value Proposition Assessment */}
            <div id="sec-ai-assessment" className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> 7. AI Value Proposition Assessment
                </h3>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
                  AI Value Score: {formData.aiValueScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-600" /> AI Customer Insights
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiCustomerInsights}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> AI Market Opportunity
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiMarketOpportunity}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-600" /> AI Pricing Recommendation
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiPricingRecommendation}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-indigo-600">
                    <Zap className="h-3.5 w-3.5" /> AI Adoption Prediction
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiAdoptionPrediction}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
              >
                <Sparkles className="h-4 w-4" /> Open Interactive AI Analysis Workbench <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* 8. Value Proposition Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> 8. Value Proposition Summary
                </h3>
                <span className="text-xs font-bold text-emerald-600">Overall Score: {computedOverallScore}/100</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Customer Value Score</span>
                    <span className="font-mono font-bold">{formData.customerValueScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${formData.customerValueScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Competitive Score</span>
                    <span className="font-mono font-bold">{formData.competitiveScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${formData.competitiveScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Validation Score</span>
                    <span className="font-mono font-bold">{formData.validationScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${formData.validationScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Commercial Score</span>
                    <span className="font-mono font-bold">{formData.commercialReadinessScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${formData.commercialReadinessScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>AI Value Score</span>
                    <span className="font-mono font-bold">{formData.aiValueScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${formData.aiValueScore}%` }} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-muted/20 text-center space-y-3">
                  <ScoreGauge label="Overall VP Score" score={computedOverallScore} sub="Very Good" size="large" />

                  <div className="w-full">
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">Executive Recommendation</label>
                    <select
                      value={formData.recommendation}
                      onChange={(e) => updateField("recommendation", e.target.value)}
                      className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 text-center focus:outline-none"
                    >
                      {[
                        "Approve Value Proposition",
                        "Conduct More Customer Research",
                        "Improve Differentiation",
                        "Refine Pricing",
                        "Validate Product-Market Fit",
                        "Strengthen Customer Benefits",
                        "Release for GTM",
                      ].map((rec) => (
                        <option key={rec} value={rec}>{rec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 9. Attachments */}
            <div id="sec-attachments" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> 9. Value Proposition Attachments & Artifacts
                </h3>
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </button>
              </div>

              <div className="space-y-2 text-xs">
                {attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-3 truncate">
                      <FileText className="h-4 w-4 text-primary shrink-0" />
                      <div className="truncate">
                        <span className="font-bold text-foreground block truncate">{file.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {file.size} · {file.date} · Uploaded by {file.uploader}
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

            {/* 10. Review & Approval */}
            <div id="sec-review-approval" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> 10. Review & Executive Approval Matrix
                </h3>
                <span className="text-xs font-semibold text-primary">8 Stakeholder Governance Gates</span>
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
                    placeholder="Add executive feedback or conditions..."
                  />
                </div>
              </div>
            </div>

            {/* 11. Activity History */}
            <div id="sec-activity-history" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> 11. Activity History Log
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

            {/* AI Business Insights Panel */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> Insights
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">AI Score 91</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Market Opportunity
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    High growth in EV infrastructure market with increasing adoption.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-blue-600" /> Customer Insight
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Uptime and cost savings are the top customer priorities.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-600" /> Pricing Insight
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Value-based tiered pricing will maximize revenue potential.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-amber-600">
                    <Zap className="h-3.5 w-3.5" /> Risk Insight
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    New entrants may increase competition. Focus on innovation & partnerships.
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
                  <Zap className="h-4 w-4 text-amber-500" /> Key KPIs Snapshot
                </h3>
                <span className="text-xs font-mono text-muted-foreground">Real-time</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Market Opportunity</span>
                    <Sparkline data={[10, 20, 35, 50]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">High</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Customer Value</span>
                    <Sparkline data={[75, 82, 88, 90]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">90 / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">PMF Score</span>
                    <Sparkline data={[70, 78, 83, 86]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-blue-600 font-mono block">86 / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Revenue Impact</span>
                    <Sparkline data={[5, 12, 18, 25]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">₹25 Cr</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">NPS Score</span>
                    <Sparkline data={[40, 45, 48, 52]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">52</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">AI Value Score</span>
                    <Sparkline data={[80, 85, 89, 91]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-indigo-600 font-mono block">91 / 100</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("info", "KPI Dashboard", "Navigating to Value Proposition KPI Dashboard...")}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                View KPI Dashboard <ChevronRight className="h-3.5 w-3.5" />
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
                  <span className="font-semibold text-foreground">{formData.productManager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created Date:</span>
                  <span className="font-semibold text-foreground">05 May 2024 09:20 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified By:</span>
                  <span className="font-semibold text-foreground">{formData.productManager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified Date:</span>
                  <span className="font-semibold text-foreground">{formData.lastModifiedDate}</span>
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Value Proposition Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.vpTitle}</h2>
                <p className="text-xs text-muted-foreground">
                  VP ID: {formData.vpId} · Number: {formData.vpNumber} · Manager: {formData.productManager}
                </p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Overall VP Score</span>
                <span className="text-lg font-bold text-emerald-600">{computedOverallScore} / 100</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Customer Value Score</span>
                <span className="text-lg font-bold text-foreground font-mono">{formData.customerValueScore} / 100</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Estimated Revenue Impact</span>
                <span className="text-lg font-bold text-foreground font-mono">₹ 25 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Vision & Objective</h4>
                <p className="text-muted-foreground">{formData.productVision}</p>
                <p className="text-muted-foreground mt-1">{formData.businessObjective}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Value Proposition Statement</h4>
                <p className="text-muted-foreground"><strong>Statement:</strong> {formData.vpStatement}</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> {formData.proposedSolution}</p>
                <p className="text-muted-foreground"><strong>Benefits:</strong> {formData.keyBenefits}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Customer Validation & Strategy</h4>
                <p className="text-muted-foreground"><strong>PMF Score:</strong> {formData.pmfScore}/100 | <strong>NPS:</strong> {formData.npsScore}</p>
                <p className="text-muted-foreground"><strong>Pricing Strategy:</strong> {formData.pricingStrategy}</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Value Proposition Intelligence</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Neural Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Value Score</span>
                <span>91 / 100 (Top Tier Value Match)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Strong customer demand alignment, low switching cost friction, and high differentiation score in fleet EV charging automation.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Market Growth Projections
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Market projected to expand at 28% CAGR over 5 years. High adoption expected across fleet operators within 24 months.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Competitive Edge Analysis
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  AI-driven predictive maintenance provides 30% operational cost reduction compared to legacy EVBox and ChargePoint chargers.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Optimization Recommendations
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Focus on expanding channel partner sales collateral and formalizing OEM hardware bundle agreements.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Value Proposition Document
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
                  placeholder="e.g. Customer_Feedback_Analysis.pdf"
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Value Proposition repository.
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
