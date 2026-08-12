import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessDevelopmentTabBar } from "@/components/erp/BusinessDevelopmentTabBar";
import { BusinessSectionNavTabBar, type BusinessSectionNavItem } from "@/components/erp/BusinessSectionNavTabBar";
import {
  Briefcase,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Sparkles,
  ShieldCheck,
  FileText,
  Download,
  Upload,
  ChevronRight,
  ExternalLink,
  Info,
  Building2,
  Cpu,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Send,
  Eye,
  Save,
  MoreVertical,
  Check,
  X,
  Flame,
  Award,
  Zap,
  BarChart3,
  Calendar,
  Plus,
  Trash2,
  FileSpreadsheet,
  Share2,
  Printer,
  Globe,
  PieChart,
  Activity,
  History,
  AlertTriangle,
  FileCheck,
  Lock,
  ArrowRight,
  Sliders,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/business-model-development/",
)({
  head: () => ({ meta: [{ title: "Business Model Development · Magnertia ERP" }] }),
  component: BusinessModelDevelopmentPage,
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

export function BusinessModelDevelopmentPage() {
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("Overview");
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error" | "info"; title: string; text: string } | null>(null);

  // Modals / Drawers state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);
  const [newFileName, setNewFileName] = useState("");

  // Validation State
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    businessModelId: "BM-2024-00045",
    formCode: "BMD-2024-25",
    title: "AIoT Platform Business Model",
    number: "BMN-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "Digital Solutions",
    productService: "AIoT Platform",
    owner: "Rahul Sharma",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Development",

    // Section 1: Overview
    businessVision: "To build an intelligent AIoT platform that connects devices, transforms data into actionable insights, and drives operational excellence across global enterprise clients.",
    businessObjective: "Achieve $25M ARR within 5 years with 72%+ gross margin and global OEM partnership distribution.",
    category: "Platform",
    type: "B2B",
    industry: "Industrial IoT & Smart Automation",
    lifecycleStage: "Growth",
    priority: "High",
    projectStatus: "Development",

    // Section 2: Value Proposition
    customerProblem: "Lack of real-time visibility, predictive insights, and automated edge control in manufacturing & utilities equipment leading to high downtime.",
    proposedSolution: "Unified AIoT platform with real-time sensor analytics, automated workflow triggers, and zero-touch edge provisioning.",
    uvp: "Unified AIoT platform with predictive intelligence, real-time sensor analytics, and seamless SCADA/ERP integration.",
    competitiveAdvantage: "AI-driven edge insights, easy multi-cloud integration, scalable architecture, and patent-protected algorithms.",
    customerBenefits: "30% energy cost reduction, 45% unplanned downtime reduction, and 3x faster IoT deployment speed.",
    innovationScore: 88,
    uvpStrengthScore: 89,

    // Section 3: Customer & Market Analysis
    customerSegments: ["Manufacturing", "Energy", "Logistics", "Smart Buildings", "Utilities"],
    icp: "Mid to large enterprises seeking operational intelligence and predictive maintenance.",
    targetMarket: "Global Industrial IoT & Analytics Market",
    tam: 120000000000,
    sam: 35000000000,
    som: 2800000000,
    marketReadinessScore: 85,

    // Section 4: Revenue Model
    revenueStreams: ["Subscription", "Platform Fee", "Data Insights", "Custom Solutions"],
    pricingStrategy: "Value Based",
    pricingModel: "Subscription + Usage Tiered",
    grossMargin: 72.5,
    clv: 28500,
    cac: 1250,
    revenueScore: 85,

    // Section 5: Cost Structure
    fixedCosts: 2450000,
    variableCosts: 850000,
    opex: 1150000,
    capex: 3200000,
    profitabilityScore: 84,

    // Section 6: Business Operations
    keyActivities: "Platform Development, Data Intelligence Engine Maintenance, Customer Success & System Integration",
    keyResources: "AIoT Software Platform, Cloud Infrastructure, Data Science Team, Customer Support Engineers",
    keyPartners: "Cloud Providers, OEMs, System Integrators, Technology Partners",
    channels: ["Direct Sales", "Channel Partners", "Marketplace", "OEM Partnerships"],
    relationshipModel: "Subscription + Executive Support",
    operationalReadiness: 86,

    // Section 7: Growth & Scalability
    expansionStrategy: "Geographic expansion into APAC & Europe, industry vertical expansion, and developer API partner ecosystem.",
    geoExpansion: ["Asia Pacific", "North America", "Europe", "Middle East"],
    franchiseModel: false,
    platformModel: true,
    digitalTransformation: true,
    scalabilityIndex: 88,
    growthReadinessScore: 87,

    // Section 8: Risk & Compliance
    risks: "Market Competition, Cyber Security, Technology Obsolescence",
    riskMitigation: "Diversification, Strong Security, Continuous Innovation, IP Expansion",
    compliance: ["GDPR", "ISO 27001", "SOC 2 Type II", "IEEE IoT Standards"],
    esg: "Energy Efficiency, Data Privacy, Sustainable Operations",
    ip: ["Patents", "Trademarks", "Copyrights", "Trade Secrets"],
    riskScore: 78,

    // Section 9: AI Assessment
    aiPerformanceInsights: "High potential for predictive analytics and automation in asset-intensive industries.",
    aiRevenuePrediction: "Strong recurring revenue growth potential with scalable subscription tiers.",
    aiMarketOpportunity: "Large untapped market with high adoption potential in Smart Manufacturing.",
    aiPricingRecommendation: "Value-based subscription pricing with tiered usage tiers recommended.",
    aiRiskPrediction: "Medium risk due to competitive market landscape and technology adoption speed.",
    aiGrowthSuggestions: "Expand partner ecosystem, accelerate OEM hardware bundle partnerships, and launch APAC sales hubs.",
    aiHealthScore: 91,

    // Section 10: Summary & Recommendation
    marketScore: 86,
    scalabilityScore: 88,
    recommendation: "Approve Business Model",

    // Section 12: Approvals Governance Matrix
    approvals: [
      { role: "BD Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "Valid UVP and clear market TAM." },
      { role: "Marketing Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024", comments: "Strong customer segment positioning." },
      { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "High channel partner interest confirmed." },
      { role: "Finance Manager", user: "Sanjay Patel", status: "Approved", date: "12 May 2024", comments: "Unit economics meet enterprise threshold." },
      { role: "Strategy Head", user: "Anil Mehta", status: "Pending", date: "In Review", comments: "Awaiting final TAM breakdown." },
      { role: "COO", user: "Priya Nair", status: "Pending", date: "Awaiting", comments: "" },
      { role: "CEO", user: "Rakesh Patel", status: "Pending", date: "Awaiting", comments: "" },
      { role: "Board Approval", user: "Executive Board", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Comprehensive business model with robust unit economics and strong market TAM.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments state
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Business_Model_Canvas.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Financial_Model.xlsx", type: "Excel Spreadsheet", size: "4.8 MB", date: "16 May 2024", uploader: "Sanjay Patel" },
    { id: "3", name: "Market_Research_Report.pdf", type: "PDF Document", size: "8.1 MB", date: "15 May 2024", uploader: "Neha Reddy" },
    { id: "4", name: "Competitor_Analysis.pdf", type: "PDF Document", size: "3.2 MB", date: "14 May 2024", uploader: "Vikram Singh" },
    { id: "5", name: "Pricing_Strategy.pdf", type: "PDF Document", size: "1.9 MB", date: "13 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Unit_Economics.xlsx", type: "Excel Spreadsheet", size: "1.4 MB", date: "12 May 2024", uploader: "Sanjay Patel" },
    { id: "7", name: "BreakEven_Analysis.pdf", type: "PDF Document", size: "2.8 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History state
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Value Proposition and Revenue Model parameters", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Sanjay Patel", action: "Uploaded Financial_Model.xlsx and verified CAC/CLV", status: "Attachment" },
    { id: "a3", date: "14 May 2024", time: "05:10 PM", user: "AI Intelligence Engine", action: "Generated AI Business Assessment Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Sanjay Patel", action: "Finance Review Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "08 May 2024", time: "10:00 AM", user: "Rahul Sharma", action: "Business Model Form Created - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Business Model Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      market: 0.2,
      revenue: 0.25,
      profitability: 0.25,
      scalability: 0.15,
      ai: 0.15,
    };

    const weightedScore =
      formData.marketScore * weights.market +
      formData.revenueScore * weights.revenue +
      formData.profitabilityScore * weights.profitability +
      formData.scalabilityScore * weights.scalability +
      formData.aiHealthScore * weights.ai;

    return Math.round(weightedScore);
  }, [formData.marketScore, formData.revenueScore, formData.profitabilityScore, formData.scalabilityScore, formData.aiHealthScore]);

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

  // Helper function to trigger toast
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

    // Append to activity log
    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.owner,
      action: "Saved draft of Business Model Form",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Business model draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) errors.title = "Business Model Title is required";
    if (!formData.businessVision.trim()) errors.businessVision = "Business Vision is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.category) errors.category = "Business Category is required";
    if (!formData.type) errors.type = "Business Type is required";
    if (!formData.industry.trim()) errors.industry = "Industry is required";
    if (!formData.customerProblem.trim()) errors.customerProblem = "Customer Problem is required";
    if (!formData.proposedSolution.trim()) errors.proposedSolution = "Proposed Solution is required";
    if (formData.customerSegments.length === 0) errors.customerSegments = "At least one customer segment is required";
    if (formData.revenueStreams.length === 0) errors.revenueStreams = "At least one revenue stream is required";
    if (!formData.pricingStrategy) errors.pricingStrategy = "Pricing Strategy is required";
    if (!formData.risks.trim()) errors.risks = "Business Risks field is required";

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

    // Append to activity log
    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.owner,
      action: "Submitted Business Model for Executive Review & Approval",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Business Model submitted for executive review.");
  };

  // Toggle multi-select items
  const toggleArrayItem = (field: "customerSegments" | "revenueStreams" | "channels" | "geoExpansion" | "compliance" | "ip", item: string) => {
    const current = formData[field] as string[];
    const next = current.includes(item) ? current.filter((x) => x !== item) : [...current, item];
    updateField(field, next);
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
      uploader: formData.owner,
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

  // Sub-tabs / section navigation items
  const sectionNavItems: BusinessSectionNavItem[] = [
    { id: "sec-overview", label: "Overview", icon: Building2 },
    { id: "sec-value-proposition", label: "Value Proposition", icon: Award },
    { id: "sec-customer-market", label: "Customer & Market", icon: Users },
    { id: "sec-revenue-model", label: "Revenue Model", icon: DollarSign },
    { id: "sec-cost-structure", label: "Cost Structure", icon: PieChart },
    { id: "sec-operations", label: "Operations", icon: Layers },
    { id: "sec-growth-scalability", label: "Growth & Scalability", icon: TrendingUp },
    { id: "sec-risk-compliance", label: "Risk & Compliance", icon: ShieldCheck },
    { id: "sec-ai-assessment", label: "AI Intelligence", icon: Sparkles },
    { id: "sec-summary", label: "Summary", icon: BarChart3 },
    { id: "sec-attachments", label: "Attachments", icon: FileText, badge: attachments.length },
    { id: "sec-review-approval", label: "Review & Approval", icon: CheckCircle2 },
    { id: "sec-activity-history", label: "Activity History", icon: History },
  ];

  // All sections are continuously rendered so user can scroll down the entire page
  const isSectionVisible = (_sectionName: string) => true;

  const handleSectionClick = (secId: string) => {
    setActiveSubTab(secId);
    const targetEl = document.getElementById(secId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <AppShell
      title="Business Model Development"
      breadcrumb="Development > Business Development > Business Model Development"
      description="Govern the design, validation, financial analysis, approval, and lifecycle strategy of enterprise business models (MAICW Standards)."
      tabs={<BusinessDevelopmentTabBar />}
    >
      <div className="space-y-6 text-foreground">
        {/* Toast Feedback Notification Banner */}
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
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.title}</h1>
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
                  Model ID: <span className="font-mono font-bold text-foreground">{formData.businessModelId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.number}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Business Model ERP link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Business Model report as PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Top Metadata Secondary Grid */}
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
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.owner}</span>
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

        {/* MAICW Legend Collapsible Info Panel */}
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
          <ScoreGauge label="Overall Score" score={computedOverallScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Market Score" score={formData.marketScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Revenue Score" score={formData.revenueScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Profitability" score={formData.profitabilityScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Scalability" score={formData.scalabilityScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Business Score" score={formData.aiHealthScore} sub="Excellent" size="normal" />
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs text-center transition-all hover:border-primary/30">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="mt-2 text-xs font-bold text-foreground">Lifecycle Stage</span>
            <span className="text-[11px] font-bold text-emerald-600">{formData.lifecycleStage}</span>
          </div>
        </div>

        {/* Section Navigation Horizontal Scroll Bar */}
        <BusinessSectionNavTabBar
          sections={sectionNavItems}
          activeSection={activeSubTab}
          onSectionClick={handleSectionClick}
        />

        {/* Main Grid: Form Sections (Left 2 Columns) & Executive AI/Health Panels (Right 1 Column) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Form Sections */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Business Model Overview */}
            {isSectionVisible("Overview") && (
              <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> 1. Business Model Overview
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">General Identification & Scope</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Business Category</span> <MAICWBadge type="M" />
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none",
                        validationErrors.category ? "border-rose-500" : "border-border"
                      )}
                    >
                      {["Manufacturing", "Software", "SaaS", "Marketplace", "Platform", "Franchise", "Consulting", "Services", "Retail", "Wholesale"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {validationErrors.category && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.category}</p>}
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Business Type</span> <MAICWBadge type="M" />
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => updateField("type", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none",
                        validationErrors.type ? "border-rose-500" : "border-border"
                      )}
                    >
                      {["B2B", "B2C", "B2B2C", "D2C", "Government (B2G)", "Marketplace", "Platform", "Subscription", "Hybrid"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    {validationErrors.type && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.type}</p>}
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Industry</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.industry}
                      onChange={(e) => updateField("industry", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none",
                        validationErrors.industry ? "border-rose-500" : "border-border"
                      )}
                    />
                    {validationErrors.industry && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.industry}</p>}
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Business Lifecycle Stage</span> <MAICWBadge type="W" />
                    </label>
                    <select
                      value={formData.lifecycleStage}
                      onChange={(e) => updateField("lifecycleStage", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {["Ideation", "Validation", "MVP", "Pilot", "Product Launch", "Growth", "Scale-up", "Expansion", "Maturity"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Priority</span> <MAICWBadge type="I" />
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => updateField("priority", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {["Low", "Medium", "High", "Critical"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Project Status</span> <MAICWBadge type="W" />
                    </label>
                    <select
                      value={formData.projectStatus}
                      onChange={(e) => updateField("projectStatus", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {["Draft", "Development", "In Review", "Approved", "On Hold", "Archived"].map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Business Vision</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.businessVision}
                      onChange={(e) => updateField("businessVision", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                        validationErrors.businessVision ? "border-rose-500" : "border-border"
                      )}
                    />
                    {validationErrors.businessVision && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.businessVision}</p>}
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
                </div>
              </div>
            )}

            {/* 2. Value Proposition */}
            {isSectionVisible("Value Proposition") && (
              <div id="sec-value-proposition" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Target className="h-4 w-4 text-emerald-600" /> 2. Value Proposition
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-emerald-600 flex items-center gap-1">
                      Innovation: <strong>{formData.innovationScore}/100</strong> <MAICWBadge type="C" />
                    </span>
                    <span className="text-blue-600 flex items-center gap-1">
                      UVP Strength: <strong>{formData.uvpStrengthScore}/100</strong> <MAICWBadge type="C" />
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Customer Problem</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.customerProblem}
                      onChange={(e) => updateField("customerProblem", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                        validationErrors.customerProblem ? "border-rose-500" : "border-border"
                      )}
                    />
                    {validationErrors.customerProblem && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.customerProblem}</p>}
                  </div>

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
                      <span>Unique Value Proposition (UVP)</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.uvp}
                      onChange={(e) => updateField("uvp", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Competitive Advantage</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.competitiveAdvantage}
                      onChange={(e) => updateField("competitiveAdvantage", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Customer Benefits</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="text"
                      value={formData.customerBenefits}
                      onChange={(e) => updateField("customerBenefits", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 3. Customer & Market Analysis */}
            {isSectionVisible("Customer & Market") && (
              <div id="sec-customer-market" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" /> 3. Customer & Market Analysis
                  </h3>
                  <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                    Market Readiness: <strong>{formData.marketReadinessScore}/100</strong> <MAICWBadge type="C" />
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-center gap-1">
                      TAM (Total Addressable) <MAICWBadge type="C" />
                    </span>
                    <span className="mt-1 text-lg font-bold text-foreground font-mono block">$120.00 B</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-center gap-1">
                      SAM (Serviceable Available) <MAICWBadge type="C" />
                    </span>
                    <span className="mt-1 text-lg font-bold text-foreground font-mono block">$35.00 B</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-center gap-1">
                      SOM (Obtainable Market) <MAICWBadge type="C" />
                    </span>
                    <span className="mt-1 text-lg font-bold text-foreground font-mono block">$2.80 B</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Customer Segments (Select all applicable)</span> <MAICWBadge type="M" />
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Manufacturing", "Energy", "Logistics", "Smart Buildings", "Utilities", "Retail", "Automotive", "Healthcare"].map((seg) => {
                        const isSelected = formData.customerSegments.includes(seg);
                        return (
                          <button
                            key={seg}
                            type="button"
                            onClick={() => toggleArrayItem("customerSegments", seg)}
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold transition-all border",
                              isSelected ? "bg-primary text-white border-primary" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            )}
                          >
                            {isSelected ? `✓ ${seg}` : `+ ${seg}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Ideal Customer Profile (ICP)</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.icp}
                      onChange={(e) => updateField("icp", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Target Market Scope</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="text"
                      value={formData.targetMarket}
                      onChange={(e) => updateField("targetMarket", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. Revenue Model */}
            {isSectionVisible("Revenue Model") && (
              <div id="sec-revenue-model" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> 4. Revenue Model & Unit Economics
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-emerald-600">
                    <span>Revenue Trend:</span>
                    <Sparkline data={[12, 18, 24, 38, 52, 74, 91]} color="#10b981" />
                    <span className="flex items-center gap-1 ml-2">
                      Score: <strong>{formData.revenueScore}/100</strong> <MAICWBadge type="C" />
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                      Gross Margin (%) <MAICWBadge type="C" />
                    </span>
                    <div className="relative mt-1">
                      <input
                        type="number"
                        value={formData.grossMargin}
                        onChange={(e) => updateField("grossMargin", Number(e.target.value))}
                        className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-bold text-foreground font-mono focus:border-primary focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-bold">%</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                      CLV (Customer Lifetime Val) <MAICWBadge type="C" />
                    </span>
                    <span className="text-base font-bold text-foreground font-mono block mt-2">
                      ₹{formData.clv.toLocaleString()} <span className="text-xs text-muted-foreground">($28,500)</span>
                    </span>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                      CAC (Acquisition Cost) <MAICWBadge type="C" />
                    </span>
                    <span className="text-base font-bold text-foreground font-mono block mt-2">
                      ₹{formData.cac.toLocaleString()} <span className="text-xs text-muted-foreground">($1,250)</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Pricing Strategy</span> <MAICWBadge type="M" />
                    </label>
                    <select
                      value={formData.pricingStrategy}
                      onChange={(e) => updateField("pricingStrategy", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {["Cost Plus", "Value Based", "Competitive", "Dynamic", "Subscription", "Freemium", "Usage Based", "Tiered Pricing"].map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Pricing Model Description</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.pricingModel}
                      onChange={(e) => updateField("pricingModel", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Streams (Select all applicable)</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {["Subscription", "Platform Fee", "Data Insights", "Custom Solutions", "Product Sales", "Licensing", "AMC", "Transaction Fee", "Consulting"].map((rev) => {
                      const isSelected = formData.revenueStreams.includes(rev);
                      return (
                        <button
                          key={rev}
                          type="button"
                          onClick={() => toggleArrayItem("revenueStreams", rev)}
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold transition-all border",
                            isSelected ? "bg-emerald-600 text-white border-emerald-600" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                          )}
                        >
                          {isSelected ? `✓ ${rev}` : `+ ${rev}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Cost Structure */}
            {isSectionVisible("Cost Structure") && (
              <div id="sec-cost-structure" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-500" /> 5. Cost Structure & Financial Breakdown
                  </h3>
                  <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                    Profitability Score: <strong>{formData.profitabilityScore}/100</strong> <MAICWBadge type="C" />
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Fixed Costs</span>
                    <span className="text-sm font-bold text-foreground font-mono block mt-1">₹{formData.fixedCosts.toLocaleString()}</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Variable Costs</span>
                    <span className="text-sm font-bold text-foreground font-mono block mt-1">₹{formData.variableCosts.toLocaleString()}</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground block">OpEx</span>
                    <span className="text-sm font-bold text-foreground font-mono block mt-1">₹{formData.opex.toLocaleString()}</span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/20 p-3">
                    <span className="text-[11px] font-semibold text-muted-foreground block">CapEx</span>
                    <span className="text-sm font-bold text-foreground font-mono block mt-1">₹{formData.capex.toLocaleString()}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/10 p-3">
                    <div className="flex items-center gap-2.5">
                      <FileText className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-xs font-bold text-foreground block">Break-even Analysis</span>
                        <span className="text-[10px] text-muted-foreground">BreakEven_Analysis.pdf</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => setViewingFile("BreakEven_Analysis.pdf")} className="text-xs font-semibold text-primary hover:underline">
                      View File
                    </button>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/10 p-3">
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                      <div>
                        <span className="text-xs font-bold text-foreground block">Unit Economics Model</span>
                        <span className="text-[10px] text-muted-foreground">Unit_Economics.xlsx</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => setViewingFile("Unit_Economics.xlsx")} className="text-xs font-semibold text-primary hover:underline">
                      View File
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Operations */}
            {isSectionVisible("Operations") && (
              <div id="sec-operations" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-blue-600" /> 6. Key Operations & Resources
                  </h3>
                  <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    Operational Readiness: <strong>{formData.operationalReadiness}/100</strong> <MAICWBadge type="C" />
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Key Activities</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.keyActivities}
                      onChange={(e) => updateField("keyActivities", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Key Resources</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.keyResources}
                      onChange={(e) => updateField("keyResources", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Key Partners</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.keyPartners}
                      onChange={(e) => updateField("keyPartners", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Distribution Channels</span> <MAICWBadge type="I" />
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Direct Sales", "Dealers", "Distributors", "Franchise", "Marketplace", "E-commerce", "Channel Partners", "GeM", "ONDC", "OEM Partnerships"].map((ch) => {
                        const isSelected = formData.channels.includes(ch);
                        return (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => toggleArrayItem("channels", ch)}
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold transition-all border",
                              isSelected ? "bg-blue-600 text-white border-blue-600" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            )}
                          >
                            {isSelected ? `✓ ${ch}` : `+ ${ch}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Growth & Scalability */}
            {isSectionVisible("Growth & Scalability") && (
              <div id="sec-growth-scalability" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-purple-600" /> 7. Growth & Scalability
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-purple-600">
                    <span>Scalability Index: <strong>{formData.scalabilityIndex}/100</strong></span>
                    <span>Growth Readiness: <strong>{formData.growthReadinessScore}/100</strong></span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Expansion Strategy</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.expansionStrategy}
                      onChange={(e) => updateField("expansionStrategy", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Geographic Expansion Regions</span> <MAICWBadge type="I" />
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["Asia Pacific", "North America", "Europe", "Middle East", "Latin America", "Africa"].map((geo) => {
                        const isSelected = formData.geoExpansion.includes(geo);
                        return (
                          <button
                            key={geo}
                            type="button"
                            onClick={() => toggleArrayItem("geoExpansion", geo)}
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold transition-all border",
                              isSelected ? "bg-purple-600 text-white border-purple-600" : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                            )}
                          >
                            {isSelected ? `✓ ${geo}` : `+ ${geo}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.franchiseModel}
                        onChange={(e) => updateField("franchiseModel", e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>Franchise Model</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.platformModel}
                        onChange={(e) => updateField("platformModel", e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>Platform Business Model</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
                      <input
                        type="checkbox"
                        checked={formData.digitalTransformation}
                        onChange={(e) => updateField("digitalTransformation", e.target.checked)}
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                      />
                      <span>Digital Transformation</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Risk & Compliance */}
            {isSectionVisible("Risk & Compliance") && (
              <div id="sec-risk-compliance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-rose-500" /> 8. Risk & Regulatory Compliance
                  </h3>
                  <span className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    Risk Score: <strong>{formData.riskScore}/100</strong> <MAICWBadge type="C" />
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Business Risks</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.risks}
                      onChange={(e) => updateField("risks", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none",
                        validationErrors.risks ? "border-rose-500" : "border-border"
                      )}
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Risk Mitigation Plan</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.riskMitigation}
                      onChange={(e) => updateField("riskMitigation", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Regulatory Compliance</span> <MAICWBadge type="I" />
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.compliance.map((c) => (
                        <span key={c} className="rounded-md bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-600">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Intellectual Property (IP)</span> <MAICWBadge type="I" />
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {formData.ip.map((ipItem) => (
                        <span key={ipItem} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-600">
                          {ipItem}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 9. AI Assessment */}
            {isSectionVisible("AI Assessment") && (
              <div id="sec-ai-assessment" className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                  <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> 9. AI Business Assessment Insights
                  </h3>
                  <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
                    AI Business Health Score: 91/100
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Performance Insights
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{formData.aiPerformanceInsights}</p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-blue-600" /> Revenue Prediction
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{formData.aiRevenuePrediction}</p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-indigo-600" /> Market Opportunity
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{formData.aiMarketOpportunity}</p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <Award className="h-3.5 w-3.5 text-purple-600" /> Pricing Recommendation
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{formData.aiPricingRecommendation}</p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                    <span className="font-bold text-foreground flex items-center gap-1.5 text-amber-600">
                      <AlertTriangle className="h-3.5 w-3.5" /> Risk Prediction
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{formData.aiRiskPrediction}</p>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                    <span className="font-bold text-foreground flex items-center gap-1.5 text-emerald-600">
                      <Zap className="h-3.5 w-3.5" /> Strategic Suggestions
                    </span>
                    <p className="text-muted-foreground leading-relaxed">{formData.aiGrowthSuggestions}</p>
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
            )}

            {/* 10. Summary */}
            {isSectionVisible("Summary") && (
              <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600" /> 10. Executive Business Model Summary
                  </h3>
                  <span className="text-xs font-bold text-emerald-600">Overall Score: {computedOverallScore}/100</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Market Score</span>
                      <span className="font-mono font-bold">{formData.marketScore} / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${formData.marketScore}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Revenue Score</span>
                      <span className="font-mono font-bold">{formData.revenueScore} / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${formData.revenueScore}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Profitability Score</span>
                      <span className="font-mono font-bold">{formData.profitabilityScore} / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${formData.profitabilityScore}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>Scalability Score</span>
                      <span className="font-mono font-bold">{formData.scalabilityScore} / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${formData.scalabilityScore}%` }} />
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span>AI Business Score</span>
                      <span className="font-mono font-bold">{formData.aiHealthScore} / 100</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${formData.aiHealthScore}%` }} />
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-muted/20 text-center space-y-3">
                    <ScoreGauge label="Overall Business Model Score" score={computedOverallScore} sub="Very Good" size="large" />
                    
                    <div className="w-full">
                      <label className="text-[11px] font-bold text-muted-foreground block mb-1">Executive Recommendation</label>
                      <select
                        value={formData.recommendation}
                        onChange={(e) => updateField("recommendation", e.target.value)}
                        className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 text-center focus:outline-none"
                      >
                        {[
                          "Approve Business Model",
                          "Conduct Market Validation",
                          "Improve Unit Economics",
                          "Optimize Pricing",
                          "Expand Partnerships",
                          "Raise Investment",
                          "Scale Business",
                          "Archive Model",
                        ].map((rec) => (
                          <option key={rec} value={rec}>{rec}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 11. Attachments */}
            {isSectionVisible("Attachments") && (
              <div id="sec-attachments" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" /> 11. Business Model Attachments & Artifacts
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
            )}

            {/* 12. Review & Approval */}
            {isSectionVisible("Review & Approval") && (
              <div id="sec-review-approval" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" /> 12. Review & Executive Approval Matrix
                  </h3>
                  <span className="text-xs font-semibold text-primary">8 Enterprise Stakeholder Gates</span>
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
            )}

            {/* 13. Activity History */}
            {isSectionVisible("Activity History") && (
              <div id="sec-activity-history" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <History className="h-4 w-4 text-primary" /> 13. Business Model Activity History Log
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
            )}

          </div>

          {/* Right Column: Executive Panels */}
          <div className="space-y-6">

            {/* AI Business Insights Panel */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI Business Insights
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">AI Score 91</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Market Opportunity
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    High growth IoT analytics market with projected CAGR of 18.6%.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-blue-600" /> Revenue Potential
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Projected revenue of $25M by Year 5 with strong subscription recurring model.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-purple-600" /> Profitability Outlook
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Healthy unit economics with 72%+ gross margin potential at scale.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-amber-600">
                    <AlertTriangle className="h-3.5 w-3.5" /> Risk Alert
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Monitor competition and maintain technology edge algorithm leadership.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-indigo-600">
                    <Zap className="h-3.5 w-3.5" /> Strategic Recommendation
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Expand partner ecosystem and accelerate global OEM expansion.
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

            {/* Business Health Snapshot Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Business Health Snapshot
                </h3>
                <span className="text-xs font-mono text-muted-foreground">Real-time</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">CLV</span>
                    <Sparkline data={[21000, 24000, 26000, 28500]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">$28,500</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">CAC</span>
                    <Sparkline data={[1800, 1500, 1350, 1250]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">$1,250</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Gross Margin</span>
                    <Sparkline data={[60, 65, 69, 72.5]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">72.50%</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <span className="text-muted-foreground font-semibold block">Break-even</span>
                  <span className="text-base font-bold text-foreground font-mono block">16.8 Months</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <span className="text-muted-foreground font-semibold block">Payback Period</span>
                  <span className="text-base font-bold text-foreground font-mono block">24.3 Months</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">NPV (5Yr)</span>
                    <Sparkline data={[8, 11, 14, 18.75]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-blue-600 font-mono block">$18.75M</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("info", "KPI Dashboard", "Navigating to Business Health Analytics Dashboard...")}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                View KPI Dashboard <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                Quick Actions
              </h3>

              <div className="grid grid-cols-1 gap-2 text-xs">
                {[
                  "Create New Business Model",
                  "Upload Business Model Canvas",
                  "Generate Financial Model",
                  "Run Market Analysis",
                  "Generate AI Business Analysis",
                  "View Business Model Library",
                  "View Financial Dashboard",
                  "Generate Executive Report",
                  "Export Business Model Report",
                ].map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => {
                      setActiveQuickAction(act);
                      showToast("info", act, `Action executed: ${act}`);
                    }}
                    className="flex items-center justify-between rounded-lg border border-border bg-muted/10 px-3 py-2 font-semibold text-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors text-left"
                  >
                    <span>{act}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            {/* ERP Integration References Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3 text-xs">
              <h3 className="text-sm font-bold text-foreground pb-2 border-b border-border">
                ERP System Integrations
              </h3>

              <div className="space-y-2">
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Upstream Integrations</span>
                  <div className="flex flex-wrap gap-1">
                    {["Business Strategy", "Market Research", "Product Strategy", "Customer Discovery"].map((m) => (
                      <span key={m} className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium border border-border">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Supporting Modules</span>
                  <div className="flex flex-wrap gap-1">
                    {["Finance & Accounting", "CRM", "BI Analytics", "Document Mgmt"].map((m) => (
                      <span key={m} className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium border border-border">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">Downstream Operations</span>
                  <div className="flex flex-wrap gap-1">
                    {["Go-to-Market", "Sales Operations", "Franchise Mgmt", "Performance Mgmt"].map((m) => (
                      <span key={m} className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium border border-border">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
                  <span className="font-semibold text-foreground">{formData.owner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created Date:</span>
                  <span className="font-semibold text-foreground">05 May 2024 09:20 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified By:</span>
                  <span className="font-semibold text-foreground">{formData.owner}</span>
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
                <button type="button" onClick={() => setActiveSubTab("Activity History")} className="text-primary hover:underline font-semibold">
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Business Model Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.title}</h2>
                <p className="text-xs text-muted-foreground">
                  Model ID: {formData.businessModelId} · Number: {formData.number} · Owner: {formData.owner}
                </p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Overall Score</span>
                <span className="text-lg font-bold text-emerald-600">{computedOverallScore} / 100</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">TAM</span>
                <span className="text-lg font-bold text-foreground font-mono">$120.00 B</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Expected Gross Margin</span>
                <span className="text-lg font-bold text-foreground font-mono">{formData.grossMargin}%</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Vision & Objective</h4>
                <p className="text-muted-foreground">{formData.businessVision}</p>
                <p className="text-muted-foreground mt-1">{formData.businessObjective}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Value Proposition</h4>
                <p className="text-muted-foreground"><strong>Problem:</strong> {formData.customerProblem}</p>
                <p className="text-muted-foreground"><strong>Solution:</strong> {formData.proposedSolution}</p>
                <p className="text-muted-foreground"><strong>UVP:</strong> {formData.uvp}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Revenue Model & Economics</h4>
                <p className="text-muted-foreground"><strong>Strategy:</strong> {formData.pricingStrategy} ({formData.pricingModel})</p>
                <p className="text-muted-foreground"><strong>CLV:</strong> ${formData.clv.toLocaleString()} | <strong>CAC:</strong> ${formData.cac.toLocaleString()}</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Business Analysis Intelligence</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Neural Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Health Benchmark</span>
                <span>91 / 100 (Top 5% Model Tier)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The business model exhibits strong unit economics, high margin potential, and clear product-market fit for industrial IoT automation.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Revenue & Growth Projections
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Projected 5-Year ARR: $25M with 72.5% Gross Margin. SaaS subscription model combined with usage tier pricing yields low churn probability (&lt;3.5% annually).
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Competitive Moat Analysis
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  High switching costs created by deep SCADA/ERP integration. Patent portfolio for edge AI compression provides a 24-month technology lead time.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Mitigation Matrix
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Key risk factor lies in cybersecurity compliance audits across global regions. Recommended action: Accelerate SOC 2 Type II and ISO 27001 certifications.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Business Model Document
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
                  placeholder="e.g. Market_Validation_Study.pdf"
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
                Viewing <strong>{viewingFile}</strong>. All data points in this document are synced with the Magnertia ERP Business Model repository.
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
