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
  "/development/business-development/value-proposition-development",
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
        "group relative overflow-hidden flex flex-col items-center rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-muted/20 shadow-xs text-center transition-all duration-300 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5",
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
            className="text-muted/30 dark:text-muted/20"
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
          <span className={cn("font-display font-black text-foreground tracking-tight", isLarge ? "text-xl" : "text-sm")}>{score}</span>
          {isLarge && <span className="text-[9px] text-muted-foreground font-semibold">/ {max}</span>}
        </div>
      </div>
      <span className={cn("font-bold text-foreground truncate max-w-[120px] group-hover:text-primary transition-colors", isLarge ? "mt-2 text-xs" : "mt-1.5 text-[11px]")}>
        {label}
      </span>
      {sub && <span className="text-[10px] text-muted-foreground font-medium">{sub}</span>}
    </div>
  );
}

export function ValuePropositionDevelopmentPage() {
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; title: string; text: string } | null>(null);

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    vpId: "BM-2024-00045",
    formCode: "BMD-2024-25",
    vpTitle: "AIoT Platform Business Model",
    vpNumber: "BMN-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "Digital Solutions",
    businessModel: "AIoT Platform Business Model",
    productService: "AIoT Platform",
    customerSegment: "Fleet Operators",
    businessOwner: "Rahul Sharma",
    productManager: "Rahul Sharma",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Development",

    businessObjective: "Deliver a reliable, intelligent EV charging solution that maximizes uptime and optimizes energy cost for fleet operators.",
    productVision: "To be the most trusted and intelligent EV charging platform for the future.",
    marketOpportunity: "Rapid adoption of EVs, high demand for scalable and smart charging infrastructure.",
    customerPersona: "Fleet Operations Manager",
    industry: "Electric Vehicles",
    lifecycleStage: "Growth",
    priority: "High",
    projectStatus: "Development",
    jobsToBeDone: "Operate charging stations reliably with minimal downtime.",
    painPoints: "Unplanned downtime, high energy costs, lack of remote visibility.",
    customerNeeds: "Reliable, smart, scalable, cost-effective charging with remote monitoring.",
    existingAlternatives: "Manual monitoring, basic chargers, legacy systems.",
    customerFrustrations: "Downtime, billing issues, lack of real-time insights.",
    customerPriority: "Critical",
    problemSeverityScore: 92,

    proposedSolution: "Smart EV charging platform with AI analytics, remote control & predictive maintenance.",
    vpStatement: "We help fleet operators maximize charger uptime and reduce energy costs with our intelligent EV charging platform.",
    keyBenefits: "Higher uptime, lower energy cost, remote control, predictive maintenance.",
    differentiation: "AI-powered optimization, real-time monitoring, open integration.",
    customerGains: "Operational efficiency, cost savings, better user experience.",
    innovationElements: "AI algorithms, IoT connectivity, cloud analytics, mobile app.",
    valueStrengthScore: 89,
    customerValueScore: 85,

    competitors: ["ChargePoint", "EVBox", "ABB", "Siemens"],
    competitiveAdvantages: "AI-driven optimization, predictive maintenance, open ecosystem.",
    usp: "Most intelligent, scalable and reliable EV charging platform.",
    matrixFile: "VP_Comparison_Matrix.pdf",
    switchingBarriers: "High integration cost, trained users, operational process.",
    competitiveRisk: "Rapid tech changes, new entrants, pricing pressure.",
    competitiveScore: 84,

    customerInterviews: 28,
    surveysCompleted: 156,
    prototypeTested: true,
    customerFeedback: "Very positive feedback on uptime and remote monitoring.",
    pmfScore: 86,
    npsScore: 52,
    validationScore: 85,

    pricingStrategy: "Value-Based Pricing",
    expectedCustomerValue: 240000,
    estimatedRevenueImpact: 250000000,
    commercialReadinessScore: 85,

    aiCustomerInsights: "High demand for uptime and cost saving.",
    aiMarketOpportunity: "Market will grow at 28% CAGR over 5 years.",
    aiPricingRecommendation: "Value-based pricing with tiered plans.",
    aiAdoptionPrediction: "High adoption expected in next 24 months.",
    aiValueScore: 91,

    recommendation: "Approve Value Proposition",
    userReviewComments: "Strong customer validation with 86/100 PMF score and ₹25 Cr estimated revenue impact.",
    userDecision: "Approved",
    userApprovalDate: "2024-05-17",

    approvals: [
      { role: "Product Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024" },
      { role: "Marketing Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024" },
      { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024" },
      { role: "Customer Success Mgr", user: "Priya Nair", status: "Approved", date: "11 May 2024" },
      { role: "Business Dev Manager", user: "Anil Kumar", status: "Pending", date: "In Review" },
      { role: "Strategy Head", user: "Anil Mehta", status: "Pending", date: "Awaiting" },
      { role: "COO", user: "Rakesh Patel", status: "Pending", date: "Awaiting" },
      { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate" },
    ],
  });

  const [attachments, setAttachments] = useState([
    { id: "1", name: "VP_Canvas.pdf", size: "2.1 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Customer_Research.pdf", size: "5.4 MB", date: "16 May 2024", uploader: "Neha Reddy" },
    { id: "3", name: "Market_Research.pdf", size: "8.2 MB", date: "15 May 2024", uploader: "Neha Reddy" },
    { id: "4", name: "Competitor_Analysis.pdf", size: "3.5 MB", date: "13 May 2024", uploader: "Vikram Singh" },
    { id: "5", name: "Customer_Interviews.pdf", size: "4.1 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Survey_Results.xlsx", size: "1.8 MB", date: "12 May 2024", uploader: "Priya Nair" },
    { id: "7", name: "Sales_Presentation.pdf", size: "6.7 MB", date: "11 May 2024", uploader: "Vikram Singh" },
    { id: "8", name: "Supporting_Documents.zip", size: "12.4 MB", date: "11 May 2024", uploader: "Rahul Sharma" },
  ]);

  const [activityHistory, setActivityHistory] = useState([
    { id: "1", user: "Rahul Sharma", action: "Updated Value Proposition Statement and Customer Gains", date: "17 May 2024", time: "03:45 PM" },
    { id: "2", user: "Neha Reddy", action: "Uploaded Customer_Research.pdf with survey data", date: "16 May 2024", time: "11:20 AM" },
    { id: "3", user: "AI Neural Engine", action: "Generated AI Assessment Score (91/100)", date: "14 May 2024", time: "05:10 PM" },
    { id: "4", user: "Priya Nair", action: "Customer Success Review Completed - Decision: Approved", date: "11 May 2024", time: "02:30 PM" },
    { id: "5", user: "Rahul Sharma", action: "Value Proposition Form Created - Version 1.0", date: "08 May 2024", time: "10:00 AM" },
  ]);

  const computedOverallScore = useMemo(() => {
    const weights = {
      customer: 0.25,
      competitive: 0.2,
      validation: 0.2,
      commercial: 0.2,
      ai: 0.15,
    };

    const customerScore = formData.customerValueScore ?? formData.valueStrengthScore ?? 85;
    const weightedScore =
      customerScore * weights.customer +
      (formData.competitiveScore ?? 84) * weights.competitive +
      (formData.validationScore ?? 85) * weights.validation +
      (formData.commercialReadinessScore ?? 85) * weights.commercial +
      (formData.aiValueScore ?? 91) * weights.ai;

    return Math.round(weightedScore);
  }, [formData]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showToast = (type: "success" | "error" | "info", title: string, text: string) => {
    setToastMessage({ type, title, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSaveDraft = () => showToast("success", "Draft Saved", "Value Proposition draft saved successfully.");

  const handleSubmitApproval = () => {
    updateField("workflowStatus", "Submitted");
    showToast("success", "Submitted Successfully", "Value Proposition submitted for executive review.");
  };

  const toggleCompetitor = (comp: string) => {
    const current = formData.competitors;
    const next = current.includes(comp) ? current.filter((x) => x !== comp) : [...current, comp];
    updateField("competitors", next);
  };

  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const newFile = { id: `file-${Date.now()}`, name: newFileName, size: "1.0 MB", date: "17 May 2024", uploader: "Rahul Sharma" };
    setAttachments((prev) => [newFile, ...prev]);
    setNewFileName("");
    setIsUploadModalOpen(false);
    showToast("success", "Attachment Uploaded", `File "${newFileName}" attached.`);
  };

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
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md bg-background/90 text-foreground">
            {toastMessage.type === "success" && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            <div>
              <h4 className="text-xs font-bold">{toastMessage.title}</h4>
              <p className="text-[11px] opacity-90">{toastMessage.text}</p>
            </div>
            <button onClick={() => setToastMessage(null)}><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Form Header Action Strip & Top Metadata Cards */}
        <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          {/* Top Row: Icon + Title + Status + Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary font-bold shadow-inner">
                <Building2 className="h-6 w-6" />
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
                  BM ID: <span className="font-mono font-bold text-foreground">{formData.vpId}</span> · Code:{" "}
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
                Business Unit <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.businessUnit}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Product / Service <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.productService}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Business Owner <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.businessOwner}</span>
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
              <button type="button" onClick={() => setShowMaicwLegend(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
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

        {/* Scores Gauges */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <ScoreGauge label="Overall VP Score" score={computedOverallScore} sub="Very Good" />
          <ScoreGauge label="Customer Value" score={formData.customerValueScore} sub="Excellent" />
          <ScoreGauge label="Competitive Score" score={formData.competitiveScore} sub="Very Good" />
          <ScoreGauge label="Validation Score" score={formData.validationScore} sub="Very Good" />
          <ScoreGauge label="Commercial Score" score={formData.commercialReadinessScore} sub="Very Good" />
          <ScoreGauge label="AI Score" score={formData.aiValueScore} sub="Excellent" />
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 text-center transition-all hover:border-primary/30">
            <TrendingUp className="h-6 w-6 text-emerald-600" />
            <span className="mt-2 text-xs font-bold">Lifecycle Stage</span>
            <span className="text-[11px] font-bold text-emerald-600">{formData.lifecycleStage}</span>
          </div>
        </div>

        {/* Main Focused Form Canvas */}
        <div className="w-full space-y-6">
          {/* Customer Problem & Persona Analysis */}
          <div id="sec-problem-analysis" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" /> Customer Problem & Persona Analysis
              </h3>
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                Problem Severity Score: <strong>{formData.problemSeverityScore}/100</strong> <MAICWBadge type="C" />
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-border bg-muted/10 p-3">
              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Customer Persona</span> <MAICWBadge type="I" />
                </label>
                <input
                  type="text"
                  value={formData.customerPersona}
                  onChange={(e) => updateField("customerPersona", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Industry</span> <MAICWBadge type="M" />
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {["Manufacturing", "Automotive", "Electric Vehicles", "Energy", "SaaS", "Healthcare", "Retail", "Logistics", "Government", "Education"].map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Priority</span> <MAICWBadge type="M" />
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => updateField("priority", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-amber-600 focus:border-primary focus:outline-none"
                >
                  {["Critical", "High", "Medium", "Low"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Customer Severity</span> <MAICWBadge type="M" />
                </label>
                <select
                  value={formData.customerPriority}
                  onChange={(e) => updateField("customerPriority", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-rose-600 focus:border-primary focus:outline-none"
                >
                  {["Critical", "High", "Medium", "Low"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
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

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Pain Points</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.painPoints}
                    onChange={(e) => updateField("painPoints", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
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
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <span>Customer Frustrations</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.customerFrustrations}
                    onChange={(e) => updateField("customerFrustrations", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition Design & Strategy */}
          <div id="sec-value-design" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" /> Value Proposition Design & Strategy
              </h3>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Value Strength Score: <strong>{formData.valueStrengthScore}/100</strong> <MAICWBadge type="C" />
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-lg border border-border bg-muted/10 p-3">
              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Business Objective</span> <MAICWBadge type="M" />
                </label>
                <textarea
                  rows={2}
                  value={formData.businessObjective}
                  onChange={(e) => updateField("businessObjective", e.target.value)}
                  className={cn(
                    "w-full rounded-lg border bg-card p-2 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                    validationErrors.businessObjective ? "border-rose-500" : "border-border"
                  )}
                />
                {validationErrors.businessObjective && <p className="text-[9px] text-rose-500 mt-0.5">{validationErrors.businessObjective}</p>}
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Product Vision</span> <MAICWBadge type="M" />
                </label>
                <textarea
                  rows={2}
                  value={formData.productVision}
                  onChange={(e) => updateField("productVision", e.target.value)}
                  className={cn(
                    "w-full rounded-lg border bg-card p-2 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                    validationErrors.productVision ? "border-rose-500" : "border-border"
                  )}
                />
                {validationErrors.productVision && <p className="text-[9px] text-rose-500 mt-0.5">{validationErrors.productVision}</p>}
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Market Opportunity</span> <MAICWBadge type="M" />
                </label>
                <textarea
                  rows={2}
                  value={formData.marketOpportunity}
                  onChange={(e) => updateField("marketOpportunity", e.target.value)}
                  className={cn(
                    "w-full rounded-lg border bg-card p-2 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                    validationErrors.marketOpportunity ? "border-rose-500" : "border-border"
                  )}
                />
                {validationErrors.marketOpportunity && <p className="text-[9px] text-rose-500 mt-0.5">{validationErrors.marketOpportunity}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Value Proposition Statement (UVP)</span> <MAICWBadge type="M" />
                </label>
                <textarea
                  rows={2}
                  value={formData.vpStatement}
                  onChange={(e) => updateField("vpStatement", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Proposed Solution Architecture</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.proposedSolution}
                    onChange={(e) => updateField("proposedSolution", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Key Customer Benefits</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.keyBenefits}
                    onChange={(e) => updateField("keyBenefits", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Core Differentiation</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.differentiation}
                    onChange={(e) => updateField("differentiation", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Innovation Elements</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.innovationElements}
                    onChange={(e) => updateField("innovationElements", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Competitive Positioning & USP */}
          <div id="sec-competitive-positioning" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" /> Competitive Positioning & USP
              </h3>
              <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                Competitive Score: <strong>{formData.competitiveScore}/100</strong> <MAICWBadge type="C" />
              </span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {["ChargePoint", "EVBox", "ABB", "Siemens", "Schneider Electric", "Tesla Supercharger"].map((comp) => {
                const isSelected = formData.competitors.includes(comp);
                return (
                  <button
                    key={comp}
                    type="button"
                    onClick={() => toggleCompetitor(comp)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold transition-all border cursor-pointer",
                      isSelected ? "bg-purple-600 text-white border-purple-600" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    )}
                  >
                    {isSelected ? `✓ ${comp}` : `+ ${comp}`}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-3 text-xs">
              <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Value Comparison Matrix <MAICWBadge type="M" />
              </span>
              <button
                type="button"
                onClick={() => setViewingFile(formData.matrixFile)}
                className="font-bold text-primary hover:underline flex items-center gap-1 font-mono cursor-pointer"
              >
                {formData.matrixFile} <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Customer Validation & PMF Metrics */}
          <div id="sec-customer-validation" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Customer Validation & PMF Metrics
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

          {/* Commercial Assessment & Unit Economics */}
          <div id="sec-commercial-assessment" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" /> Commercial Assessment & Unit Economics
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

          {/* Value Proposition Summary & Governance Decision */}
          <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" /> Value Proposition Summary & Governance Decision
              </h3>
              <span className="text-xs font-bold text-emerald-600">VP Rating: {computedOverallScore}/100 (Tier 1)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                <div className="font-bold text-foreground flex items-center justify-between">
                  <span>Executive Sign-off Status</span>
                  <span className="text-emerald-600 font-bold">Validated (86/100 PMF)</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Customer Problem Severity (92/100) and Value Proposition Strength (89/100) meet criteria with ₹25 Cr projected revenue impact and 52 NPS.
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

          {/* Attachments & Artifacts */}
          <div id="sec-attachments" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Value Proposition Attachments & Artifacts
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

          {/* Review & Executive Approval Matrix */}
          <div id="sec-review-approval" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" /> Review & Executive Approval Matrix
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

          {/* Activity History Log & Audit Trail */}
          <div id="sec-activity-history" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" /> Activity History Log & Audit Trail
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
