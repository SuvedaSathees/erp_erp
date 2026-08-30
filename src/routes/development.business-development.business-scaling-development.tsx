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
  Truck,
  Warehouse,
  MapPin,
  CheckSquare,
  Scale,
  ShieldAlert,
  Rocket,
  LineChart,
  Network,
  Binary,
  Flame,
  UserCheck,
  Boxes,
  Database,
  Cloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/business-scaling-development",
)({
  head: () => ({ meta: [{ title: "Business Scaling Development · Magnertia ERP" }] }),
  component: BusinessScalingDevelopmentPage,
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

function BusinessScalingDevelopmentPage() {
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

  // Form State according to Business Scaling Development reference UI image
  const [formData, setFormData] = useState({
    scalingId: "BS-2024-00056",
    formCode: "BSF-2024-25",
    scalingProject: "Enterprise Scale-up 2024",
    scalingNumber: "BSN-ENT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "Global Operations",
    scalingManager: "Rahul Sharma",
    strategicPlan: "SP-2024-01",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Business Scaling Planning",

    // Section 1: Scaling Strategy Overview
    scalingObjective: "Scale operations globally and achieve sustainable profitable growth.",
    growthStrategy: "Organic Growth",
    targetRevenue: 5000000000, // ₹ 500,00,00,000 (₹ 500 Cr)
    targetMarkets: ["India", "USA", "Europe", "Southeast Asia"],
    scalingTimeline: "01 Apr 2024 - 31 Mar 2029",
    businessLifecycleStage: "Scale-up",
    strategicPriority: "High",
    overallGrowthTarget: 230, // 230%

    // Section 2: Business Expansion Planning
    newProducts: 12,
    newMarkets: 8,
    newCountries: 5,
    newBusinessUnits: 3,
    expansionModel: "Direct Operations",
    partnershipStrategy: "Strategic Alliance",
    expansionReadinessScore: 82,

    // Section 3: Operational Scaling
    manufacturingCapacity: 160, // 160%
    productionExpansion: "Expand Capacity",
    warehouseExpansion: "New Warehouses",
    supplyChainReadinessScore: 85,
    erpReadinessScore: 85,
    processAutomation: 65.0, // 65.00%
    operationalReadinessScore: 83,

    // Section 4: Financial Scaling
    currentRevenue: 1650000000, // ₹ 165,00,00,000 (₹ 165 Cr)
    ebitdaTarget: 22.5, // 22.50%
    capitalRequirement: 1200000000, // ₹ 120,00,00,000 (₹ 120 Cr)
    fundingSource: "Private Equity",
    roiProjection: 26.8, // 26.80%
    financialReadinessScore: 86,

    // Section 5: Sales & Marketing Scaling
    salesChannels: ["Direct Sales", "Distributors", "Online Sales", "Franchise"],
    franchiseExpansion: 50,
    dealerExpansion: 150,
    distributorExpansion: 40,
    marketingBudget: 250000000, // ₹ 25,00,00,000 (₹ 25 Cr)
    customerAcquisitionTarget: 50000,
    commercialReadinessScore: 81,

    // Section 6: Organization Scaling
    currentEmployees: 850,
    targetEmployees: 2500,
    leadershipHiring: 25,
    organizationalStructure: "Matrix Structure",
    skillDevelopmentPlan: "Leadership training, technical upskilling, digital skills and cross-functional development.",
    hrReadinessScore: 80,
    organizationalReadinessScore: 82,

    // Section 7: Technology Scaling
    erpExpansion: true,
    crmExpansion: true,
    aiIntegration: true,
    cloudInfrastructure: "Hybrid Cloud",
    cybersecurityReadiness: 85,
    digitalTransformationLevel: "Intelligent",
    technologyReadinessScore: 84,

    // Section 8: Risk & Governance
    businessRisk: "Medium",
    financialRisk: "Medium",
    operationalRisk: "Low",
    complianceStatus: true,
    corporateGovernance: true,
    riskMitigationPlan: "Diversify markets, strengthen compliance, improve cash flow visibility and enhance cybersecurity.",
    governanceScore: 82,

    // Section 9: AI Business Scaling Intelligence
    aiGrowthPrediction: "Revenue will grow 2.3X in next 3 years from strong market expansion.",
    aiExpansionRecommendation: "Expand into USA and Europe markets through direct operations.",
    aiInvestmentRecommendation: "Invest ₹120 Cr in capacity, technology and market expansion.",
    aiResourceOptimization: "Optimize workforce and automation to increase productivity by 40%.",
    aiRiskPrediction: "Medium financial risk due to high capital requirement.",
    aiScalingStrategy: "Focus on product innovation, global expansion and customer retention.",
    aiScalingScore: 88,

    // Section 10: Business Scaling Summary & Recommendation
    recommendation: "Proceed with Scaling",

    // Section 12: Review & Approval Matrix
    approvals: [
      { role: "Scaling Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "₹500 Cr target scaling roadmap & 5-yr plan verified." },
      { role: "COO", user: "Anita Verma", status: "Approved", date: "09 May 2024", comments: "160% manufacturing capacity expansion validated." },
      { role: "CFO", user: "Vikram Mehta", status: "Approved", date: "10 May 2024", comments: "₹120 Cr PE funding structure and 26.8% ROI approved." },
      { role: "CHRO", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "850 → 2,500 talent ramp-up plan approved." },
      { role: "CTO", user: "Arjun Desai", status: "Pending", date: "In Review", comments: "Hybrid cloud ERP & AI roadmap review." },
      { role: "CEO", user: "Amit Mehta", status: "Pending", date: "In Review", comments: "Executive scaling committee review." },
      { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Strong scaling execution framework & 84/100 Overall Score (88 AI Scaling, 86 Financial, ₹500 Cr Target Revenue). Approved.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Business_Plan.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Strategic_Plan.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Financial_Projection.pdf", type: "PDF Document", size: "2.1 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "4", name: "Growth_Roadmap.pdf", type: "PDF Document", size: "1.5 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Organization_Chart.pdf", type: "PDF Document", size: "1.2 MB", date: "14 May 2024", uploader: "Neha Kapoor" },
    { id: "6", name: "Investment_Plan.pdf", type: "PDF Document", size: "1.9 MB", date: "13 May 2024", uploader: "Vikram Mehta" },
    { id: "7", name: "Risk_Assessment.pdf", type: "PDF Document", size: "1.4 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "8", name: "KPI_Dashboard.pdf", type: "PDF Document", size: "2.6 MB", date: "11 May 2024", uploader: "Anita Verma" },
    { id: "9", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "3.2 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "04:35 PM", user: "Rahul Sharma", action: "Updated Target Revenue (₹500 Cr) and Employee Growth (850 → 2,500)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Vikram Mehta", action: "Uploaded Financial_Projection.pdf and Strategic_Plan.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Scaling Score (88/100)", status: "AI System" },
    { id: "a4", date: "11 May 2024", time: "02:30 PM", user: "Neha Kapoor", action: "CHRO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:20 AM", user: "Rahul Sharma", action: "Business Scaling Development Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Business Scaling Readiness Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      expansion: 0.15,
      operational: 0.15,
      financial: 0.15,
      commercial: 0.15,
      organization: 0.15,
      technology: 0.15,
      governance: 0.05,
      ai: 0.05,
    };

    const weighted =
      formData.expansionReadinessScore * weights.expansion +
      formData.operationalReadinessScore * weights.operational +
      formData.financialReadinessScore * weights.financial +
      formData.commercialReadinessScore * weights.commercial +
      formData.organizationalReadinessScore * weights.organization +
      formData.technologyReadinessScore * weights.technology +
      formData.governanceScore * weights.governance +
      formData.aiScalingScore * weights.ai;

    return Math.round(weighted);
  }, [formData.expansionReadinessScore, formData.operationalReadinessScore, formData.financialReadinessScore, formData.commercialReadinessScore, formData.organizationalReadinessScore, formData.technologyReadinessScore, formData.governanceScore, formData.aiScalingScore]);

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

    updateField("lastModifiedDate", `${formattedDate}`);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.scalingManager,
      action: "Saved draft of Business Scaling project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Business Scaling Development draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.scalingProject.trim()) errors.scalingProject = "Scaling Project is required";
    if (!formData.scalingNumber.trim()) errors.scalingNumber = "Scaling Number is required";
    if (!formData.scalingObjective.trim()) errors.scalingObjective = "Scaling Objective is required";
    if (!formData.growthStrategy.trim()) errors.growthStrategy = "Growth Strategy is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("error", "Validation Failed", `Please fill in all ${Object.keys(errors).length} mandatory required fields before submission.`);
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    updateField("workflowStatus", "Submitted");
    updateField("workflowStage", "Executive Strategy Committee Review");
    updateField("lastModifiedDate", `${formattedDate}`);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.scalingManager,
      action: "Submitted Business Scaling Roadmap for Executive Strategy Committee Review",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Business Scaling Roadmap submitted for Executive Strategy Committee review.");
  };

  // Add Attachment Handler
  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;

    const newFile = {
      id: `file-${Date.now()}`,
      name: newFileName.endsWith(".pdf") || newFileName.endsWith(".xlsx") || newFileName.endsWith(".zip") ? newFileName : `${newFileName}.pdf`,
      type: newFileName.endsWith(".xlsx") ? "Excel Spreadsheet" : newFileName.endsWith(".zip") ? "ZIP Archive" : "PDF Document",
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      date: formattedDate,
      uploader: formData.scalingManager,
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
      title="Business Scaling Development"
      breadcrumb="Development > Business Development > Business Scaling Development"
      description="Govern enterprise scale-up framework, operations, financial modeling, organizational ramp-up, technology scaling, and AI business growth intelligence."
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
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-2xs">
                <Rocket className="h-6 w-6" />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">{formData.scalingProject}</h1>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
                      formData.workflowStatus === "In Progress" && "bg-blue-500/10 border-blue-500/25 text-blue-600 dark:text-blue-400",
                      formData.workflowStatus === "Submitted" && "bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400",
                      formData.workflowStatus === "Approved" && "bg-emerald-500/10 border-emerald-500/25 text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
                    {formData.workflowStatus}
                  </span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-mono font-semibold text-muted-foreground border border-border/60">
                    v{formData.version}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="text-muted-foreground">Scaling ID:</span>
                    <strong className="font-mono font-semibold text-foreground">{formData.scalingId}</strong>
                  </span>
                  <span className="text-border/80">·</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="text-muted-foreground">Code:</span>
                    <strong className="font-mono font-semibold text-foreground">{formData.formCode}</strong>
                  </span>
                  <span className="text-border/80">·</span>
                  <span className="inline-flex items-center gap-1">
                    <span className="text-muted-foreground">Number:</span>
                    <strong className="font-mono font-semibold text-foreground">{formData.scalingNumber}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Action Button Strip */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setShowMaicwLegend(!showMaicwLegend)}
                className={cn(
                  "inline-flex items-center gap-1.5 h-9 rounded-lg border px-3 text-xs font-semibold transition-all cursor-pointer shadow-2xs",
                  showMaicwLegend
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Info className="h-3.5 w-3.5" /> MAICW Legend
              </button>

              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(true)}
                className="inline-flex items-center gap-1.5 h-9 rounded-lg border border-primary/30 bg-primary/10 px-3.5 text-xs font-semibold text-primary shadow-2xs hover:bg-primary/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" /> AI Analysis
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 h-9 rounded-lg border border-border bg-background px-3.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted transition-all active:scale-[0.98] cursor-pointer"
              >
                <Save className="h-3.5 w-3.5 text-muted-foreground" /> Save Draft
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 h-9 rounded-lg border border-border bg-background px-3.5 text-xs font-semibold text-foreground shadow-2xs hover:bg-muted transition-all active:scale-[0.98] cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-muted-foreground" /> Preview
              </button>

              <button
                type="button"
                onClick={handleSubmitApproval}
                className="inline-flex items-center gap-1.5 h-9 rounded-lg bg-primary px-4 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98] cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" /> Submit for Approval
              </button>

              <div className="relative group">
                <button
                  type="button"
                  className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted shadow-2xs transition-colors cursor-pointer"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full mt-1 hidden w-44 rounded-xl border border-border bg-card p-1 shadow-lg group-hover:block z-30 text-xs">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left cursor-pointer text-foreground"
                  >
                    <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print Report
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("info", "Share Link", "Scaling Roadmap link copied to clipboard.")}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left cursor-pointer text-foreground"
                  >
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast("info", "Export Model", "Exporting Business Scaling PDF...")}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left cursor-pointer text-foreground"
                  >
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" /> Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Top Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 p-3 shadow-2xs hover:border-primary/30 transition-all flex flex-col justify-between min-h-[64px]">
              <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <span>Business Unit</span> <MAICWBadge type="I" />
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-foreground truncate mt-1" title={formData.businessUnit}>
                {formData.businessUnit}
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 p-3 shadow-2xs hover:border-primary/30 transition-all flex flex-col justify-between min-h-[64px]">
              <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <span>Scaling Manager</span> <MAICWBadge type="I" />
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-foreground truncate mt-1" title={formData.scalingManager}>
                {formData.scalingManager}
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 p-3 shadow-2xs hover:border-primary/30 transition-all flex flex-col justify-between min-h-[64px]">
              <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <span>Strategic Plan</span> <MAICWBadge type="I" />
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-primary truncate mt-1" title={formData.strategicPlan}>
                {formData.strategicPlan}
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 p-3 shadow-2xs hover:border-primary/30 transition-all flex flex-col justify-between min-h-[64px]">
              <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <span>Created Date</span> <MAICWBadge type="A" />
              </div>
              <div className="text-xs sm:text-[13px] font-mono font-semibold text-foreground truncate mt-1">
                {formData.createdDate}
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 p-3 shadow-2xs hover:border-primary/30 transition-all flex flex-col justify-between min-h-[64px]">
              <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <span>Last Modified</span> <MAICWBadge type="A" />
              </div>
              <div className="text-xs sm:text-[13px] font-mono font-semibold text-foreground truncate mt-1">
                {formData.lastModifiedDate}
              </div>
            </div>
            <div className="rounded-xl border border-border/70 bg-muted/20 hover:bg-muted/30 p-3 shadow-2xs hover:border-primary/30 transition-all flex flex-col justify-between min-h-[64px]">
              <div className="flex items-center justify-between gap-1 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <span>Workflow Stage</span> <MAICWBadge type="W" />
              </div>
              <div className="text-xs sm:text-[13px] font-bold text-primary truncate mt-1">
                {formData.workflowStage}
              </div>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-9">
          <ScoreGauge label="Overall Readiness" score={computedOverallScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Expansion Score" score={formData.expansionReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Operational Score" score={formData.operationalReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Financial Score" score={formData.financialReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Commercial Score" score={formData.commercialReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Organization Score" score={formData.organizationalReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Technology Score" score={formData.technologyReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Governance Score" score={formData.governanceScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Scaling Score" score={formData.aiScalingScore} sub="Excellent" size="normal" />
        </div>

        {/* Main Form Canvas */}
        <div className="w-full space-y-6">

            {/* Scaling Strategy Overview */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Scaling Strategy Overview
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Enterprise Growth Plan</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Growth Strategy</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.growthStrategy}
                    onChange={(e) => updateField("growthStrategy", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {[
                      "Organic Growth",
                      "Inorganic Growth",
                      "Market Penetration",
                      "Market Development",
                      "Product Development",
                      "Diversification",
                      "Global Expansion",
                      "Digital Transformation",
                    ].map((gs) => (
                      <option key={gs} value={gs}>{gs}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Revenue</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 500.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Scaling Timeline</span> <MAICWBadge type="W" />
                  </label>
                  <input
                    type="text"
                    value={formData.scalingTimeline}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Business Lifecycle Stage</span> <MAICWBadge type="W" />
                  </label>
                  <select
                    value={formData.businessLifecycleStage}
                    onChange={(e) => updateField("businessLifecycleStage", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                  >
                    {["Startup", "Early Growth", "Growth", "Scale-up", "Expansion", "Mature Enterprise", "Global Enterprise"].map((ls) => (
                      <option key={ls} value={ls}>{ls}</option>
                    ))}
                  </select>
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
                    <span>Overall Growth Target</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.overallGrowthTarget} % (2.3X)`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Markets</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.targetMarkets.map((tm) => (
                      <span key={tm} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {tm}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Scaling Objective</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.scalingObjective}
                    onChange={(e) => updateField("scalingObjective", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.scalingObjective ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.scalingObjective && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.scalingObjective}</p>}
                </div>
              </div>
            </div>

            {/* Business Expansion Planning */}
            <div id="sec-expansion-planning" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-600" /> Business Expansion Planning
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Expansion Score: <strong>{formData.expansionReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">New Products <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">{formData.newProducts}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">New Markets <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">{formData.newMarkets}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">New Countries <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">{formData.newCountries}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">New Business Units <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">{formData.newBusinessUnits}</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Expansion Model</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.expansionModel}
                    onChange={(e) => updateField("expansionModel", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                  >
                    {["Direct Operations", "Franchise", "Dealer Network", "Distributor Network", "Joint Venture", "Strategic Partnership", "Acquisition", "Licensing"].map((em) => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Partnership Strategy</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.partnershipStrategy}
                    onChange={(e) => updateField("partnershipStrategy", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Operational Scaling */}
            <div id="sec-operational-scaling" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-blue-600" /> Operational Scaling & Capacity Expansion
                </h3>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  Operational Score: <strong>{formData.operationalReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Manufacturing Capacity</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.manufacturingCapacity} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Production Expansion</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.productionExpansion}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Warehouse Expansion</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.warehouseExpansion}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Supply Chain Readiness <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-emerald-600 font-mono mt-0.5 block">{formData.supplyChainReadinessScore} / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">ERP Readiness <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-emerald-600 font-mono mt-0.5 block">{formData.erpReadinessScore} / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Process Automation <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-primary font-mono mt-0.5 block">{formData.processAutomation} %</span>
                </div>
              </div>
            </div>

            {/* Financial Scaling */}
            <div id="sec-financial-scaling" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> Financial Scaling & Capital Deployment
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Financial Score: <strong>{formData.financialReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Current Revenue</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 165.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Revenue</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 500.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>EBITDA Target (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.ebitdaTarget} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Capital Requirement</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 120.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Funding Source</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.fundingSource}
                    onChange={(e) => updateField("fundingSource", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Private Equity", "Internal Accruals", "Venture Capital", "Debt Financing", "IPO", "Government Grants"].map((fs) => (
                      <option key={fs} value={fs}>{fs}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>ROI Projection (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.roiProjection} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Sales & Marketing Scaling */}
            <div id="sec-sales-marketing" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-purple-600" /> Sales, Distribution & Marketing Scaling
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Commercial Score: <strong>{formData.commercialReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Dealer Expansion <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">{formData.dealerExpansion}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Distributor Expansion <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">{formData.distributorExpansion}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Franchise Expansion <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">{formData.franchiseExpansion}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Marketing Budget <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">₹ 25.00 Cr</span>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Sales Channels</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.salesChannels.map((sc) => (
                      <span key={sc} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Acquisition Target</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value="50,000 Customers"
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Organization Scaling */}
            <div id="sec-organization-scaling" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" /> Organization Structure & Workforce Ramp-up
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Organization Score: <strong>{formData.organizationalReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Current Employees</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value="850"
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Employees</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value="2,500"
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Leadership Hiring</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value="25 Leaders"
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Organizational Structure</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.organizationalStructure}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">HR Readiness <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-emerald-600 font-mono mt-0.5 block">{formData.hrReadinessScore} / 100</span>
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Skill Development Plan</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.skillDevelopmentPlan}
                    onChange={(e) => updateField("skillDevelopmentPlan", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Technology Scaling */}
            <div id="sec-technology-scaling" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-purple-600" /> Technology, Cloud & Digital Transformation
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Technology Score: <strong>{formData.technologyReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">ERP Expansion</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">CRM Expansion</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">AI Integration</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Cloud Infrastructure <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-foreground block mt-0.5">{formData.cloudInfrastructure}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Cybersecurity Readiness <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-emerald-600 font-mono mt-0.5 block">{formData.cybersecurityReadiness} / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Digital Transformation <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-primary block mt-0.5">{formData.digitalTransformationLevel}</span>
                </div>
              </div>
            </div>

            {/* Risk & Governance */}
            <div id="sec-risk-governance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-amber-500" /> Risk Mitigation & Corporate Governance
                </h3>
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  Governance Score: <strong>{formData.governanceScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Business Risk <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-amber-500 block mt-0.5">{formData.businessRisk}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Financial Risk <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-amber-500 block mt-0.5">{formData.financialRisk}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Operational Risk <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-emerald-600 block mt-0.5">{formData.operationalRisk}</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Compliance Cleared</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 sm:col-span-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Corporate Governance Active</span>
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Risk Mitigation Plan</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.riskMitigationPlan}
                    onChange={(e) => updateField("riskMitigationPlan", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Scaling Summary & Strategic Decision */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> Scaling Summary & Strategic Decision
                </h3>
                <span className="text-xs font-bold text-emerald-600">Scaling Rating: {computedOverallScore}/100 (Tier 1)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                  <div className="font-bold text-foreground flex items-center justify-between">
                    <span>Executive Enterprise Scaling Status</span>
                    <span className="text-emerald-600 font-bold">Approved for Multi-City Expansion</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Targeting 2.3X revenue CAGR over 3 years with 22.5% EBITDA margins, 8 new regional market entries, and team expansion to 2,500 personnel.
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
                      "Proceed with Scaling",
                      "Secure Growth Capital",
                      "Expand Operations",
                      "Strengthen Supply Chain Infrastructure",
                      "Hire Executive Leadership Team",
                      "Accelerate Digital Transformation",
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
                  <FileText className="h-4 w-4 text-primary" /> Business Scaling Dossier & Artifacts
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
                  <ShieldCheck className="h-4 w-4 text-primary" /> Executive Strategy Committee Governance Matrix
                </h3>
                <span className="text-xs font-semibold text-primary">7 Governance Roles</span>
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
                <h4 className="text-xs font-bold text-foreground">Record Executive Scaling Committee Decision</h4>
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Business Scaling Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.scalingProject}</h2>
                <p className="text-xs text-muted-foreground">
                  Scaling ID: {formData.scalingId} · Strategic Plan: {formData.strategicPlan} · Manager: {formData.scalingManager}
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
                <span className="text-muted-foreground font-medium block">Target Revenue</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 500.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Capital Requirement</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 120.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Scaling Strategy & Multi-Market Expansion</h4>
                <p className="text-muted-foreground"><strong>Strategy:</strong> {formData.growthStrategy} | <strong>Timeline:</strong> {formData.scalingTimeline}</p>
                <p className="text-muted-foreground mt-1"><strong>Expansion:</strong> 12 New Products, 8 New Markets, 5 New Countries, 3 New Business Units</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Operational & Organization Scale-up</h4>
                <p className="text-muted-foreground"><strong>Capacity:</strong> 160% manufacturing expansion with new regional warehousing.</p>
                <p className="text-muted-foreground mt-1"><strong>Talent:</strong> Workforce expansion from 850 to 2,500 employees with 25 key leadership hires.</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Financial Projections & Technology Foundation</h4>
                <p className="text-muted-foreground"><strong>Revenue Growth:</strong> ₹ 165 Cr → ₹ 500 Cr (2.3X) | <strong>EBITDA:</strong> 22.5% | <strong>ROI:</strong> 26.8%</p>
                <p className="text-muted-foreground mt-1"><strong>Tech Stack:</strong> Hybrid cloud, AI integration, and Intelligent digital transformation.</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Business Scaling Intelligence Workbench</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Enterprise Scale Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Scaling Score</span>
                <span>88 / 100 (Optimal Enterprise Growth Trajectory)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Projected 2.3X revenue expansion is backed by 12 new product lines, international direct operations in USA/EU, and 40% efficiency gains from automation.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-emerald-600" /> Capital Allocation & Runway
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Allocate 40% of ₹120 Cr to factory automation, 35% to international channel build-out, and 25% to R&D and team scaling.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" /> Talent Density Optimization
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Prioritize hiring VP of International Sales and Head of Supply Chain in Q2 2024 to support the 8-market rollout.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600" /> Governance & Risk Controls
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Implement quarterly board KPI milestones and automated cash-flow alerts in ERP to maintain 22.5% EBITDA margins.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Scaling Document
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
                  placeholder="e.g. Scaling_Master_Plan_2024.pdf"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/10">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-foreground">Click to browse or drag & drop files</p>
                <p className="text-[10px] text-muted-foreground">Supports PDF, XLSX, ZIP up to 50MB</p>
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Enterprise Scaling repository.
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
