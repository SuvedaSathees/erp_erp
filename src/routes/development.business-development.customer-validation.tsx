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
  CheckSquare,
  Activity,
  ThumbsUp,
  LineChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/customer-validation",
)({
  head: () => ({ meta: [{ title: "Customer Validation · Magnertia ERP" }] }),
  component: CustomerValidationPage,
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

function CustomerValidationPage() {
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

  // Form State according to Customer Validation reference
  const [formData, setFormData] = useState({
    cvId: "CV-2024-00037",
    formCode: "CVF-2024-25",
    validationProject: "Smart EV Charging Solution Validation",
    validationNumber: "CVN-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    productService: "Smart EV Charging Solution",
    customerSegment: "Fleet Operators",
    validationLead: "Rahul Sharma",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Pilot Validation",

    // Section 1: Validation Overview
    businessObjective: "Validate solution effectiveness for fleet operators.",
    validationObjective: "Confirm product-market fit and purchase intent.",
    productVersion: "MVP v2.1",
    valuePropRef: "VP-2024-00021",
    customerDiscoveryRef: "CD-2024-00048",
    validationMethod: "Pilot Deployment",
    lifecycleStage: "Pilot Validation",
    priority: "High",

    // Section 2: Customer Validation Planning
    targetCustomerGroup: "Fleet Operators",
    sampleSize: 25,
    validationStartDate: "2024-05-01",
    validationEndDate: "2024-05-31",
    successCriteria: "80%+ users satisfied and willing to continue.",
    acceptanceCriteria: "At least 20 customers show purchase intent.",
    validationHypothesis: "Our solution reduces charging downtime by 30%+.",
    validationReadinessScore: 88,

    // Section 3: Customer Feedback Collection
    customerInterviews: 28,
    surveysCompleted: 156,
    prototypeDemos: 22,
    pilotCustomers: 12,
    customerSatisfaction: 4.5,
    npsScore: 52,
    customerFeedback: "Very positive feedback on uptime, reliability and cost savings.",
    feedbackQualityScore: 86,

    // Section 4: Product-Market Fit Validation
    customerProblemSolved: true,
    solutionAcceptance: 85,
    willingnessToPay: 18500,
    purchaseIntent: "Likely to Buy",
    pmfScore: 88,
    retentionProbability: 78,
    pmfReadinessScore: 86,

    // Section 5: Commercial Validation
    pricingValidation: true,
    revenuePotential: 24800000, // ₹ 2.48 Cr
    expectedAdoptionRate: 68,
    salesReadinessScore: 84,
    competitiveComparison: "Strong vs existing solutions",
    commercialRisks: "High competition in metro cities",
    commercialScore: 84,

    // Section 6: Pilot Validation
    pilotProgram: true,
    pilotStartDate: "2024-04-01",
    pilotEndDate: "2024-04-30",
    pilotResults: "Successfully validated with 12 fleet operators. High reliability achieved.",
    customerSuccessStories: "Reduced downtime by 32% and cost savings by 26%.",
    lessonsLearned: "Improve mobile app UI and billing automation.",
    pilotSuccessScore: 86,

    // Section 7: AI Assessment
    aiCustomerInsights: "High demand for smart scheduling and remote monitoring.",
    aiAdoptionPrediction: "Strong adoption expected in next 6-9 months.",
    aiPmfAnalysis: "Very high PMF probability (87%).",
    aiRevenueForecast: "Projected revenue ₹2.48 Cr for Year 1.",
    aiChurnPrediction: "Low churn probability (12%).",
    aiImprovementRecs: "Enhance mobile UI and add predictive maintenance.",
    aiValidationScore: 91,

    // Section 8: Validation Summary & Recommendation
    recommendation: "Proceed to Go-to-Market",

    // Section 10: Review & Approval Matrix
    approvals: [
      { role: "Product Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "High PMF and strong pilot feedback." },
      { role: "Business Dev Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024", comments: "Fleet operator channel validation complete." },
      { role: "Marketing Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "GTM campaign collateral approved." },
      { role: "Sales Manager", user: "Sneha Iyer", status: "Approved", date: "11 May 2024", comments: "Confirmed enterprise customer pipeline." },
      { role: "Customer Success Mgr", user: "Ankita Verma", status: "Approved", date: "12 May 2024", comments: "Support readiness and SLAs established." },
      { role: "Innovation Manager", user: "Amit Patel", status: "Pending", date: "In Review", comments: "Patent filing review under process." },
      { role: "COO", user: "Rakesh Patel", status: "Pending", date: "Awaiting", comments: "" },
      { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Excellent customer validation metrics (88/100 PMF, 4.5/5 CSAT, ₹2.48 Cr Revenue Potential). Approved for GTM transition.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Interview_Report.pdf", type: "PDF Document", size: "3.4 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Survey_Results.xlsx", type: "Excel Spreadsheet", size: "2.1 MB", date: "14 May 2024", uploader: "Neha Reddy" },
    { id: "3", name: "Pilot_Report.pdf", type: "PDF Document", size: "4.8 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "4", name: "Product_Demo.mp4", type: "MP4 Video", size: "18.2 MB", date: "16 May 2024", uploader: "Vikram Singh" },
    { id: "5", name: "Validation_Report.pdf", type: "PDF Document", size: "5.1 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Customer_Stories.pdf", type: "PDF Document", size: "2.9 MB", date: "17 May 2024", uploader: "Sneha Iyer" },
    { id: "7", name: "Market_Analysis.pdf", type: "PDF Document", size: "6.3 MB", date: "17 May 2024", uploader: "Neha Reddy" },
    { id: "8", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "14.5 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Validation Results and Pilot Success Metrics", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Vikram Singh", action: "Uploaded Product_Demo.mp4 for executive preview", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Calculated AI Validation Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Ankita Verma", action: "Customer Success Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:20 AM", user: "Rahul Sharma", action: "Customer Validation Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Validation Score dynamically
  const computedOverallScore = useMemo(() => {
    const csatNormalized = (formData.customerSatisfaction / 5) * 100;
    const weights = {
      csat: 0.2,
      pmf: 0.25,
      commercial: 0.2,
      pilot: 0.15,
      ai: 0.2,
    };

    const weighted =
      csatNormalized * weights.csat +
      formData.pmfScore * weights.pmf +
      formData.commercialScore * weights.commercial +
      formData.pilotSuccessScore * weights.pilot +
      formData.aiValidationScore * weights.ai;

    return Math.round(weighted);
  }, [formData.customerSatisfaction, formData.pmfScore, formData.commercialScore, formData.pilotSuccessScore, formData.aiValidationScore]);

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

  // Toast message trigger
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
      user: formData.validationLead,
      action: "Saved draft of Customer Validation record",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Customer Validation draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.validationProject.trim()) errors.validationProject = "Validation Project is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.validationObjective.trim()) errors.validationObjective = "Validation Objective is required";
    if (!formData.targetCustomerGroup.trim()) errors.targetCustomerGroup = "Target Customer Group is required";
    if (!formData.successCriteria.trim()) errors.successCriteria = "Success Criteria is required";
    if (!formData.acceptanceCriteria.trim()) errors.acceptanceCriteria = "Acceptance Criteria is required";
    if (!formData.validationHypothesis.trim()) errors.validationHypothesis = "Validation Hypothesis is required";
    if (!formData.customerFeedback.trim()) errors.customerFeedback = "Customer Feedback is required";
    if (!formData.competitiveComparison.trim()) errors.competitiveComparison = "Competitive Comparison is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("error", "Validation Failed", `Please complete all ${Object.keys(errors).length} mandatory required fields before submission.`);
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
      user: formData.validationLead,
      action: "Submitted Customer Validation for Executive Board Approval",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Customer Validation submitted for executive review.");
  };

  // Add Attachment Handler
  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;

    const newFile = {
      id: `file-${Date.now()}`,
      name: newFileName.endsWith(".pdf") || newFileName.endsWith(".xlsx") || newFileName.endsWith(".mp4") ? newFileName : `${newFileName}.pdf`,
      type: newFileName.endsWith(".xlsx") ? "Excel Spreadsheet" : newFileName.endsWith(".mp4") ? "MP4 Video" : "PDF Document",
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      date: formattedDate,
      uploader: formData.validationLead,
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
      title="Customer Validation"
      breadcrumb="Development > Business Development > Customer Validation"
      description="Govern the empirical validation of customer needs, product-market fit, commercial viability, pilot deployments, and executive launch readiness."
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
        <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          {/* Top Row: Icon + Title + Status + Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary font-bold shadow-inner">
                <CheckSquare className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.validationProject}</h1>
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
                  CV ID: <span className="font-mono font-bold text-foreground">{formData.cvId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.validationNumber}</span>
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
                    <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Record
                  </button>
                  <button type="button" onClick={() => showToast("info", "Share Link", "Validation link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Customer Validation report as PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Validation Lead <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.validationLead}</span>
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
              <span className="font-bold text-primary block truncate mt-0.5">{formData.workflowStage}</span>
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
          <ScoreGauge label="Overall Validation Score" score={computedOverallScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Product-Market Fit" score={formData.pmfScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Customer Satisfaction" score={formData.customerSatisfaction * 20} max={100} sub={`${formData.customerSatisfaction} / 5 Excellent`} size="normal" />
          <ScoreGauge label="NPS Score" score={formData.npsScore} sub="Good" size="normal" />
          <ScoreGauge label="Commercial Score" score={formData.commercialScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Pilot Success Score" score={formData.pilotSuccessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Validation Score" score={formData.aiValidationScore} sub="Excellent" size="normal" />
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs text-center transition-all hover:border-primary/30">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="mt-2 text-xs font-bold text-foreground">Lifecycle Stage</span>
            <span className="text-[11px] font-bold text-emerald-600">{formData.lifecycleStage}</span>
          </div>
        </div>

        {/* Main Focused Form Canvas */}
        <div className="w-full space-y-6">
          {/* Validation Overview */}
          <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Validation Overview
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">Strategic Intent & References</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Product Version</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="text"
                      value={formData.productVersion}
                      onChange={(e) => updateField("productVersion", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Validation Method</span> <MAICWBadge type="M" />
                    </label>
                    <select
                      value={formData.validationMethod}
                      onChange={(e) => updateField("validationMethod", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                    >
                      {["Customer Interview", "Product Demonstration", "Prototype Evaluation", "MVP Validation", "Pilot Deployment", "Beta Testing", "Field Trial", "Online Survey"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Value Proposition Ref</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="text"
                      value={formData.valuePropRef}
                      onChange={(e) => updateField("valuePropRef", e.target.value)}
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Customer Discovery Ref</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="text"
                      value={formData.customerDiscoveryRef}
                      onChange={(e) => updateField("customerDiscoveryRef", e.target.value)}
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                    />
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
                      {["Validation Planning", "Customer Evaluation", "Pilot Validation", "Product-Market Fit", "Commercial Validation", "Launch Readiness", "Growth"].map((s) => (
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
                      <span>Validation Objective</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.validationObjective}
                      onChange={(e) => updateField("validationObjective", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                        validationErrors.validationObjective ? "border-rose-500" : "border-border"
                      )}
                    />
                    {validationErrors.validationObjective && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.validationObjective}</p>}
                  </div>
                </div>
              </div>

            {/* Hypotheses & Validation Planning */}
            <div id="sec-planning" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Hypotheses & Validation Planning
                  </h3>
                  <span className="text-xs font-semibold text-primary">Readiness: {formData.validationReadinessScore}/100</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Target Customer Group</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.targetCustomerGroup}
                      onChange={(e) => updateField("targetCustomerGroup", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Validation Start Date</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="date"
                      value={formData.validationStartDate}
                      onChange={(e) => updateField("validationStartDate", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Validation End Date</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="date"
                      value={formData.validationEndDate}
                      onChange={(e) => updateField("validationEndDate", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-3">
                    <div>
                      <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Validation Hypothesis</span> <MAICWBadge type="M" />
                      </label>
                      <textarea
                        rows={2}
                        value={formData.validationHypothesis}
                        onChange={(e) => updateField("validationHypothesis", e.target.value)}
                        className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                          <span>Success Criteria</span> <MAICWBadge type="M" />
                        </label>
                        <textarea
                          rows={2}
                          value={formData.successCriteria}
                          onChange={(e) => updateField("successCriteria", e.target.value)}
                          className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                          <span>Acceptance Criteria</span> <MAICWBadge type="M" />
                        </label>
                        <textarea
                          rows={2}
                          value={formData.acceptanceCriteria}
                          onChange={(e) => updateField("acceptanceCriteria", e.target.value)}
                          className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            {/* Customer Feedback & Interviews */}
            <div id="sec-feedback" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" /> Customer Feedback & Interviews
                  </h3>
                  <span className="text-xs font-semibold text-indigo-600">Feedback Quality: {formData.feedbackQualityScore}/100</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Customer Interviews</span>
                    <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.customerInterviews}</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Surveys Completed</span>
                    <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.surveysCompleted}</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">CSAT Rating</span>
                    <span className="mt-1 text-lg font-bold text-emerald-600 font-mono">{formData.customerSatisfaction} / 5.0</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">NPS Score</span>
                    <span className="mt-1 text-lg font-bold text-blue-600 font-mono">{formData.npsScore}</span>
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Feedback Synthesis</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={3}
                    value={formData.customerFeedback}
                    onChange={(e) => updateField("customerFeedback", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

            {/* Product-Market Fit & Adoption */}
            <div id="sec-pmf" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Product-Market Fit & Adoption
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600">PMF Score: {formData.pmfScore}/100</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Solution Acceptance</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`${formData.solutionAcceptance}%`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Willingness to Pay</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`₹ ${formData.willingnessToPay.toLocaleString("en-IN")}`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Retention Probability</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`${formData.retentionProbability}%`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-blue-600 font-mono"
                    />
                  </div>
                </div>
              </div>

            {/* Commercial & Pricing Validation */}
            <div id="sec-commercial" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> Commercial & Pricing Validation
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600">Commercial Score: {formData.commercialScore}/100</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Projected Revenue Potential</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`₹ ${(formData.revenuePotential / 10000000).toFixed(2)} Cr`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Expected Adoption Rate</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`${formData.expectedAdoptionRate}%`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Competitive Comparison</span> <MAICWBadge type="M" />
                      </label>
                      <input
                        type="text"
                        value={formData.competitiveComparison}
                        onChange={(e) => updateField("competitiveComparison", e.target.value)}
                        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

            {/* Pilot Program & Case Studies */}
            <div id="sec-pilot" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-600" /> Pilot Program & Case Studies
                  </h3>
                  <span className="text-xs font-semibold text-purple-600">Pilot Score: {formData.pilotSuccessScore}/100</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Pilot Start Date</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="date"
                      value={formData.pilotStartDate}
                      onChange={(e) => updateField("pilotStartDate", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Pilot End Date</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="date"
                      value={formData.pilotEndDate}
                      onChange={(e) => updateField("pilotEndDate", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Pilot Results</span> <MAICWBadge type="M" />
                      </label>
                      <textarea
                        rows={2}
                        value={formData.pilotResults}
                        onChange={(e) => updateField("pilotResults", e.target.value)}
                        className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Customer Success Stories</span> <MAICWBadge type="M" />
                      </label>
                      <textarea
                        rows={2}
                        value={formData.customerSuccessStories}
                        onChange={(e) => updateField("customerSuccessStories", e.target.value)}
                        className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

            {/* Customer Validation Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600" /> Customer Validation Summary & Strategic Decision
                  </h3>
                  <span className="text-xs font-bold text-emerald-600">Validation Rating: {computedOverallScore}/100 (Tier 1)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                    <div className="font-bold text-foreground flex items-center justify-between">
                      <span>Executive Validation Status</span>
                      <span className="text-emerald-600 font-bold">Validated (88/100 PMF)</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Pilot program verified across 12 fleet operators with 4.5/5.0 CSAT, ₹2.48 Cr revenue potential, and 68% expected adoption rate.
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
                        "Proceed to Go-to-Market",
                        "Approve Customer Validation",
                        "Conduct Additional Validation",
                        "Improve Value Proposition",
                        "Refine Product Features",
                        "Improve Pricing Strategy",
                        "Expand Pilot Program",
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
                    <FileText className="h-4 w-4 text-primary" /> Customer Validation Attachments & Artifacts
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-colors cursor-pointer"
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
                          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                          title="View File"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => showToast("info", "Download Triggered", `Downloading ${file.name}...`)}
                          className="rounded p-1 text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer"
                          title="Download File"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(file.id, file.name)}
                          className="rounded p-1 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
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
                    <ShieldCheck className="h-4 w-4 text-primary" /> Governance & Executive Review Board Matrix
                  </h3>
                  <span className="text-xs font-semibold text-primary">8 Stakeholder Roles</span>
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
                      placeholder="Add executive feedback or approval conditions..."
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Customer Validation Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.validationProject}</h2>
                <p className="text-xs text-muted-foreground">
                  CV ID: {formData.cvId} · Number: {formData.validationNumber} · Lead: {formData.validationLead}
                </p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Overall Validation Score</span>
                <span className="text-lg font-bold text-emerald-600">{computedOverallScore}%</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Product-Market Fit Score</span>
                <span className="text-lg font-bold text-foreground font-mono">{formData.pmfScore}%</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Revenue Potential</span>
                <span className="text-lg font-bold text-foreground font-mono">₹ 2.48 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">Objectives & Method</h4>
                <p className="text-muted-foreground"><strong>Objective:</strong> {formData.validationObjective}</p>
                <p className="text-muted-foreground mt-1"><strong>Method:</strong> {formData.validationMethod} | <strong>Sample Size:</strong> {formData.sampleSize} Customers</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">Customer Feedback & Metrics</h4>
                <p className="text-muted-foreground"><strong>CSAT:</strong> {formData.customerSatisfaction}/5 | <strong>NPS:</strong> {formData.npsScore} | <strong>Interviews:</strong> {formData.customerInterviews}</p>
                <p className="text-muted-foreground mt-1"><strong>Feedback:</strong> {formData.customerFeedback}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">Pilot & Commercial Results</h4>
                <p className="text-muted-foreground"><strong>Pilot Results:</strong> {formData.pilotResults}</p>
                <p className="text-muted-foreground mt-1"><strong>Customer Success Stories:</strong> {formData.customerSuccessStories}</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Customer Validation Intelligence</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Neural Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Validation Score</span>
                <span>91% (Exceptional PMF Signal)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Empirical feedback from 28 interviews and 12 pilot fleets confirms strong PMF, 85% purchase intent, and high revenue potential.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Adoption & Growth Prediction
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  High adoption expected within 6-9 months across commercial logistics operators with projected Year 1 revenue of ₹2.48 Cr.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Churn Probability & Risk
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Customer churn risk estimated at only 12%. High lock-in due to integrated predictive maintenance and telemetry analytics.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Optimization Recommendations
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Enhance mobile UI design and accelerate billing automation features prior to full Go-to-Market launch.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Customer Validation File
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
                  placeholder="e.g. Field_Trial_Report.pdf"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/10">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-foreground">Click to browse or drag & drop files</p>
                <p className="text-[10px] text-muted-foreground">Supports PDF, XLSX, MP4, DOCX up to 25MB</p>
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Customer Validation repository.
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
