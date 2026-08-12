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
  Truck,
  Warehouse,
  MapPin,
  CheckSquare,
  Scale,
  ShieldAlert,
  Compass,
  Lightbulb,
  Crosshair,
  TrendingDown,
  UserCheck,
  LineChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/corporate-strategy-development",
)({
  head: () => ({ meta: [{ title: "Corporate Strategy Development · Magnertia ERP" }] }),
  component: CorporateStrategyDevelopmentPage,
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

function CorporateStrategyDevelopmentPage() {
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

  // Form State according to Corporate Strategy Development reference UI image
  const [formData, setFormData] = useState({
    strategyId: "CS-2024-00078",
    formCode: "CSDF-2024-25",
    strategyProject: "Corporate Strategy 2025-2030",
    strategyNumber: "CSN-25-0001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "Global Operations",
    strategyOwner: "Rahul Sharma",
    strategicPlanningCycle: "5 Year (2025-2030)",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Executive Review",

    // Section 1: Corporate Vision & Strategic Direction
    corporateVision: "To be the most trusted global technology partner, creating sustainable value for customers, people, and society.",
    corporateMission: "Deliver innovative solutions that empower businesses and enrich lives.",
    coreValues: ["Integrity", "Excellence", "Innovation", "Customer Focus"],
    strategicThemes: ["Sustainable Growth", "Digital Transformation", "Innovation Leadership", "Operational Excellence"],
    planningHorizon: "5 Years",
    businessLifecycleStage: "Growth",
    strategicPriority: "High",
    corporatePurpose: "Build a better future through technology and innovation.",

    // Section 2: Strategic Assessment
    swotAnalysis: "Strengths, Weaknesses, Opportunities, Threats analysis of the organization.",
    pestleAnalysis: "Political, Economic, Social, Technological, Legal, Environmental analysis.",
    portersFiveForces: "Bargaining power, Threat of entry, Substitutes, Buyer power, Rivalry assessment.",
    competitivePosition: "Strong",
    industryGrowthRate: 9.5, // 9.50%
    marketLeadershipGoal: "Industry Leader",
    strategicAssessmentScore: 78,

    // Section 3: Strategic Objectives
    revenueTarget: 50000000000, // ₹ 5,000,00,00,000 (₹ 5,000 Cr)
    profitabilityTarget: 22.0, // 22.00%
    marketShareTarget: 28.0, // 28.00%
    customerGrowthTarget: 150000, // 150,000 Customers
    innovationTarget: 25, // 25 Patents / Key Products
    esgTarget: "Carbon Neutral by 2030 and Top ESG rating in industry.",
    strategicObjectiveScore: 82,

    // Section 4: Strategic Initiatives List
    initiatives: [
      { name: "Product Innovation Program", category: "Growth Initiative", sponsor: "Rahul Sharma", status: "In Progress", budget: "₹ 450 Cr", impact: "High" },
      { name: "Market Expansion Program", category: "Market Expansion", sponsor: "Anita Verma", status: "In Progress", budget: "₹ 380 Cr", impact: "High" },
      { name: "Digital Transformation", category: "Digital Transformation", sponsor: "Arjun Desai", status: "Planned", budget: "₹ 220 Cr", impact: "Very High" },
      { name: "Operational Excellence", category: "Cost Optimization", sponsor: "Vikram Singh", status: "Planned", budget: "₹ 150 Cr", impact: "Medium" },
      { name: "Strategic Partnership Program", category: "Strategic Partnership", sponsor: "Neha Kapoor", status: "Planned", budget: "₹ 250 Cr", impact: "High" },
    ],

    // Section 5: Business Portfolio Management
    businessUnits: ["Consumer Products", "Industrial Solutions", "Digital Services"],
    productPortfolio: "Product Portfolio 2025",
    investmentPriority: "High",
    portfolioRisk: "Medium",
    portfolioRoi: 18.5, // 18.50%
    resourceAllocation: 12500000000, // ₹ 1,250,00,00,000 (₹ 1,250 Cr)
    portfolioHealthScore: 80,

    // Section 6: Financial Strategy
    revenueProjection: 52000000000, // ₹ 5,200,00,00,000 (₹ 5,200 Cr)
    ebitdaTarget: 22.0, // 22.00%
    capitalAllocation: 15000000000, // ₹ 1,500,00,00,000 (₹ 1,500 Cr)
    investmentRequirement: 18000000000, // ₹ 1,800,00,00,000 (₹ 1,800 Cr)
    fundingStrategy: "Mixed (Equity + Debt)",
    shareholderValueTarget: 25.0, // 25.00%
    financialStrategyScore: 83,

    // Section 7: Organization & Capability Development
    leadershipStrategy: "Build future-ready leadership pipeline and strengthen executive bench.",
    workforcePlan: "Hire 2500+ super talent and build capability in emerging technologies.",
    digitalTransformationStrategy: "Accelerate cloud adoption, automation and data-driven decision making.",
    innovationRoadmap: "Invest in R&D, AI, and new business incubation.",
    organizationalReadiness: 81,
    capabilityMaturity: "Defined",
    capabilityScore: 82,

    // Section 8: Risk & Governance
    strategicRisks: "Economic slowdown, competition, regulatory changes, technology disruption.",
    enterpriseRiskRating: "Medium",
    governanceFramework: "Corporate Governance 2025",
    complianceStatus: true,
    boardOversight: true,
    riskMitigationPlan: "Diversify markets, strengthen compliance, invest in innovation and build resilient operations.",
    governanceScore: 85,

    // Section 9: AI Strategy Intelligence
    aiStrategicInsights: "Strong growth expected in digital services and emerging markets.",
    aiMarketForecast: "Global market to grow 8-9% CAGR in next 5 years.",
    aiCompetitiveIntelligence: "Competitors investing heavily in AI and automation.",
    aiInvestmentRecommendation: "Increase investment in innovation and digital capabilities.",
    aiResourceOptimization: "Reallocating resources can improve ROI by 16%.",
    aiStrategicRiskPrediction: "Market volatility and supply chain risks identified.",
    aiStrategyScore: 88,

    // Section 10: Corporate Strategy Summary & Recommendation
    recommendation: "Approve Strategy",

    // Section 12: Review & Approval Matrix
    approvals: [
      { role: "CSO", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "5-Yr 2025-2030 corporate strategy aligned with board objectives." },
      { role: "CFO", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "₹5,000 Cr revenue projection & 22% EBITDA target validated." },
      { role: "COO", user: "Arjun Desai", status: "Approved", date: "10 May 2024", comments: "Operational readiness & portfolio resource allocation approved." },
      { role: "CHRO", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "Talent roadmap & leadership pipeline plan approved." },
      { role: "CTO", user: "Amit Verma", status: "Pending", date: "In Review", comments: "Digital transformation architecture review." },
      { role: "CEO", user: "Anita Mehta", status: "Pending", date: "In Review", comments: "Executive review in progress." },
      { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Strategy is aligned with long term vision and value creation goals.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Strategic_Plan.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Annual_Operating_Plan.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Financial_Forecast.pdf", type: "PDF Document", size: "2.1 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "4", name: "Competitive_Analysis.pdf", type: "PDF Document", size: "1.5 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Market_Research.pdf", type: "PDF Document", size: "2.3 MB", date: "14 May 2024", uploader: "Anita Verma" },
    { id: "6", name: "Strategy_Roadmap.pdf", type: "PDF Document", size: "1.9 MB", date: "13 May 2024", uploader: "Arjun Desai" },
    { id: "7", name: "Risk_Register.pdf", type: "PDF Document", size: "1.6 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "8", name: "Executive_Presentation.pptx", type: "PowerPoint Presentation", size: "2.8 MB", date: "11 May 2024", uploader: "Rahul Sharma" },
    { id: "9", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "3.2 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "04:08 PM", user: "Rahul Sharma", action: "Updated Revenue Target (₹5,000 Cr) and Strategic Initiatives", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Vikram Mehta", action: "Uploaded Annual_Operating_Plan.pdf and Financial_Forecast.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Strategy Score (88/100)", status: "AI System" },
    { id: "a4", date: "11 May 2024", time: "02:30 PM", user: "Neha Kapoor", action: "CHRO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:15 AM", user: "Rahul Sharma", action: "Corporate Strategy Development Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Corporate Strategy Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      assessment: 0.15,
      objectives: 0.15,
      portfolio: 0.15,
      financial: 0.15,
      capability: 0.15,
      governance: 0.15,
      ai: 0.1,
    };

    const weighted =
      formData.strategicAssessmentScore * weights.assessment +
      formData.strategicObjectiveScore * weights.objectives +
      formData.portfolioHealthScore * weights.portfolio +
      formData.financialStrategyScore * weights.financial +
      formData.capabilityScore * weights.capability +
      formData.governanceScore * weights.governance +
      formData.aiStrategyScore * weights.ai;

    return Math.round(weighted);
  }, [formData.strategicAssessmentScore, formData.strategicObjectiveScore, formData.portfolioHealthScore, formData.financialStrategyScore, formData.capabilityScore, formData.governanceScore, formData.aiStrategyScore]);

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
      user: formData.strategyOwner,
      action: "Saved draft of Corporate Strategy Development project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Corporate Strategy Development draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.strategyProject.trim()) errors.strategyProject = "Strategy Project is required";
    if (!formData.strategyNumber.trim()) errors.strategyNumber = "Strategy Number is required";
    if (!formData.corporateVision.trim()) errors.corporateVision = "Corporate Vision is required";
    if (!formData.corporateMission.trim()) errors.corporateMission = "Corporate Mission is required";
    if (!formData.corporatePurpose.trim()) errors.corporatePurpose = "Corporate Purpose is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("error", "Validation Failed", `Please fill in all ${Object.keys(errors).length} mandatory required fields before submission.`);
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    updateField("workflowStatus", "Submitted");
    updateField("workflowStage", "Executive Strategy Review");
    updateField("lastModifiedDate", `${formattedDate}`);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.strategyOwner,
      action: "Submitted Corporate Strategy 2025-2030 for Executive Committee Review",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Corporate Strategy submitted for Executive Strategy Review.");
  };

  // Add Attachment Handler
  const handleAddAttachment = () => {
    if (!newFileName.trim()) return;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;

    const newFile = {
      id: `file-${Date.now()}`,
      name: newFileName.endsWith(".pdf") || newFileName.endsWith(".xlsx") || newFileName.endsWith(".zip") || newFileName.endsWith(".pptx") ? newFileName : `${newFileName}.pdf`,
      type: newFileName.endsWith(".pptx") ? "PowerPoint Presentation" : newFileName.endsWith(".xlsx") ? "Excel Spreadsheet" : newFileName.endsWith(".zip") ? "ZIP Archive" : "PDF Document",
      size: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      date: formattedDate,
      uploader: formData.strategyOwner,
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
      title="Corporate Strategy Development"
      breadcrumb="Development > Business Development > Corporate Strategy Development"
      description="Govern enterprise strategic planning, 5-year vision, SWOT/PESTLE assessment, initiative portfolio, resource allocation, and AI strategy intelligence."
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
                <Compass className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.strategyProject}</h1>
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
                  Strategy ID: <span className="font-mono font-bold text-foreground">{formData.strategyId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.strategyNumber}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Corporate Strategy link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Corporate Strategy PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Strategy Owner <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.strategyOwner} (CSO)</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Planning Cycle <MAICWBadge type="M" />
              </span>
              <span className="font-bold text-primary block truncate mt-0.5">{formData.strategicPlanningCycle}</span>
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
          <ScoreGauge label="Overall Score" score={computedOverallScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Assessment Score" score={formData.strategicAssessmentScore} sub="Good" size="normal" />
          <ScoreGauge label="Objectives Score" score={formData.strategicObjectiveScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Portfolio Health" score={formData.portfolioHealthScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Financial Strategy" score={formData.financialStrategyScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Capability Score" score={formData.capabilityScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Governance Score" score={formData.governanceScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Strategy Score" score={formData.aiStrategyScore} sub="Excellent" size="normal" />
        </div>

        {/* Main Grid: Form Sections (Left 2 Columns) & Executive AI/Health Panels (Right 1 Column) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Multi-Section Form Cards */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Corporate Vision & Strategic Direction */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> 1. Corporate Vision & Strategic Direction
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Enterprise North Star</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Corporate Vision</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.corporateVision}
                    onChange={(e) => updateField("corporateVision", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.corporateVision ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.corporateVision && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.corporateVision}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Corporate Mission</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.corporateMission}
                    onChange={(e) => updateField("corporateMission", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.corporateMission ? "border-rose-500" : "border-border"
                    )}
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Planning Horizon</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.planningHorizon}
                    onChange={(e) => updateField("planningHorizon", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["1 Year", "3 Years", "5 Years", "10 Years"].map((ph) => (
                      <option key={ph} value={ph}>{ph}</option>
                    ))}
                  </select>
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

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Core Values</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.coreValues.map((cv) => (
                      <span key={cv} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                        {cv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Strategic Themes</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.strategicThemes.map((st) => (
                      <span key={st} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Corporate Purpose</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={1}
                    value={formData.corporatePurpose}
                    onChange={(e) => updateField("corporatePurpose", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Strategic Assessment */}
            <div id="sec-strategic-assessment" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-purple-600" /> 2. Strategic Assessment (SWOT / PESTLE / Porter's)
                </h3>
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  Assessment Score: <strong>{formData.strategicAssessmentScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Competitive Position</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.competitivePosition}
                    onChange={(e) => updateField("competitivePosition", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {["Dominant", "Strong", "Favorable", "Tenable", "Weak"].map((cp) => (
                      <option key={cp} value={cp}>{cp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Industry Growth Rate (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.industryGrowthRate} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Market Leadership Goal</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.marketLeadershipGoal}
                    onChange={(e) => updateField("marketLeadershipGoal", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                  >
                    {["Industry Leader", "Top 3 Player", "Challenger", "Niche Specialist"].map((mlg) => (
                      <option key={mlg} value={mlg}>{mlg}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>SWOT Analysis</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.swotAnalysis}
                    onChange={(e) => updateField("swotAnalysis", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>PESTLE Analysis</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.pestleAnalysis}
                    onChange={(e) => updateField("pestleAnalysis", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Strategic Objectives */}
            <div id="sec-strategic-objectives" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" /> 3. 5-Year Strategic Objectives & Key Targets
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Objectives Score: <strong>{formData.strategicObjectiveScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Target</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 5,000.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Profitability Target (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.profitabilityTarget} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Market Share Target (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.marketShareTarget} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Growth Target</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value="150,000 Customers"
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Innovation Target</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value="25 Key Innovations"
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>ESG & Sustainability Target</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.esgTarget}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 truncate"
                  />
                </div>
              </div>
            </div>

            {/* 4. Strategic Initiatives */}
            <div id="sec-strategic-initiatives" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" /> 4. Enterprise Strategic Initiatives Portfolio
                </h3>
                <span className="text-xs font-semibold text-muted-foreground">5 Major Initiatives</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                      <th className="py-2.5 px-3 text-left font-semibold">Initiative Name</th>
                      <th className="py-2.5 px-3 text-left font-semibold">Category</th>
                      <th className="py-2.5 px-3 text-left font-semibold">Executive Sponsor</th>
                      <th className="py-2.5 px-3 text-left font-semibold">Budget</th>
                      <th className="py-2.5 px-3 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {formData.initiatives.map((init) => (
                      <tr key={init.name} className="hover:bg-muted/10">
                        <td className="py-2.5 px-3 font-bold text-foreground">{init.name}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{init.category}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{init.sponsor}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">{init.budget}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={cn(
                              "rounded-md px-2 py-0.5 text-[10px] font-bold",
                              init.status === "In Progress" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            )}
                          >
                            {init.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Business Portfolio Management */}
            <div id="sec-portfolio-management" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <PieChart className="h-4 w-4 text-indigo-600" /> 5. Business Portfolio & Capital Allocation
                </h3>
                <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                  Portfolio Health: <strong>{formData.portfolioHealthScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Investment Priority</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.investmentPriority}
                    onChange={(e) => updateField("investmentPriority", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-rose-600 focus:border-primary focus:outline-none"
                  >
                    {["Critical", "High", "Medium", "Low"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Portfolio Risk</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.portfolioRisk}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-amber-500"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Portfolio ROI (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.portfolioRoi} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Business Units</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.businessUnits.map((bu) => (
                      <span key={bu} className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[11px] font-bold text-purple-600">
                        {bu}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Resource Allocation</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 1,250.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 6. Financial Strategy */}
            <div id="sec-financial-strategy" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> 6. Financial Strategy & Capital Structure
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Financial Score: <strong>{formData.financialStrategyScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Projection</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 5,200.00 Cr`}
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
                    <span>Capital Allocation</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 1,500.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Investment Requirement</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 1,800.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Funding Strategy</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.fundingStrategy}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Shareholder Value Target</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.shareholderValueTarget} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 7. Organization & Capability Development */}
            <div id="sec-capability-development" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" /> 7. Organization & Capability Development
                </h3>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  Capability Score: <strong>{formData.capabilityScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Leadership Strategy</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.leadershipStrategy}
                    onChange={(e) => updateField("leadershipStrategy", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Digital Transformation Strategy</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.digitalTransformationStrategy}
                    onChange={(e) => updateField("digitalTransformationStrategy", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Workforce Plan</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.workforcePlan}
                    onChange={(e) => updateField("workforcePlan", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Innovation Roadmap</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.innovationRoadmap}
                    onChange={(e) => updateField("innovationRoadmap", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-2.5 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 8. Risk & Governance */}
            <div id="sec-risk-governance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-amber-500" /> 8. Enterprise Risk & Board Governance
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Governance Score: <strong>{formData.governanceScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Enterprise Risk Rating <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-amber-500 block mt-0.5">{formData.enterpriseRiskRating}</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Compliance Cleared</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Board Oversight Active</span>
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

            {/* 9. AI Strategy Intelligence */}
            <div id="sec-ai-intelligence" className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> 9. AI Strategy Intelligence
                </h3>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
                  AI Strategy Score: {formData.aiStrategyScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> AI Strategic Insights
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiStrategicInsights}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-blue-600" /> AI Market Forecast
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiMarketForecast}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-purple-600" /> AI Investment Recommendation
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiInvestmentRecommendation}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-emerald-600">
                    <Zap className="h-3.5 w-3.5" /> AI Resource Optimization
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiResourceOptimization}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
              >
                <Sparkles className="h-4 w-4" /> Open Interactive AI Corporate Strategy Workbench <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* 10. Corporate Strategy Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> 10. Strategy Summary & Board Recommendation
                </h3>
                <span className="text-xs font-bold text-emerald-600">Overall Score: {computedOverallScore}/100</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Strategic Assessment</span>
                    <span className="font-mono font-bold">{formData.strategicAssessmentScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${formData.strategicAssessmentScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Strategic Objectives</span>
                    <span className="font-mono font-bold">{formData.strategicObjectiveScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${formData.strategicObjectiveScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Portfolio Health</span>
                    <span className="font-mono font-bold">{formData.portfolioHealthScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${formData.portfolioHealthScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Financial Strategy</span>
                    <span className="font-mono font-bold">{formData.financialStrategyScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${formData.financialStrategyScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Governance Score</span>
                    <span className="font-mono font-bold">{formData.governanceScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${formData.governanceScore}%` }} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-muted/20 text-center space-y-3">
                  <ScoreGauge label="Overall Strategy Score" score={computedOverallScore} sub="Very Good" size="large" />

                  <div className="w-full">
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">Board Recommendation</label>
                    <select
                      value={formData.recommendation}
                      onChange={(e) => updateField("recommendation", e.target.value)}
                      className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 text-center focus:outline-none"
                    >
                      {[
                        "Approve Strategy",
                        "Revise Strategic Objectives",
                        "Increase Investment",
                        "Strengthen Governance",
                        "Accelerate Digital Transformation",
                        "Expand Globally",
                        "Execute Strategic Roadmap",
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
                  <FileText className="h-4 w-4 text-primary" /> 11. Strategic Dossier & Artifacts
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

            {/* 12. Review & Approval */}
            <div id="sec-review-approval" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> 12. Executive Committee Governance Matrix
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
                <h4 className="text-xs font-bold text-foreground">Record Strategic Approval Decision</h4>
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

            {/* AI Strategy Insights Snapshot Panel */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI Strategy Insights
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">AI Score 88</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> Growth Potential
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    AI predicts 21.6% CAGR revenue growth with proposed strategy.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-blue-600" /> Top Opportunity
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Digital transformation can unlock ₹ 780 Cr in value.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-amber-500">
                    <ShieldAlert className="h-3.5 w-3.5" /> Risk Alert
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    High market volatility risk in APAC region.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-purple-600">
                    <Zap className="h-3.5 w-3.5" /> Resource Optimization
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Reallocate 12% resources from low impact to high impact initiatives.
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

            {/* Strategy KPI Snapshot Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Strategy KPI Snapshot
                </h3>
                <span className="text-xs font-mono text-muted-foreground">Real-time</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Revenue Projection</span>
                    <Sparkline data={[3800, 4200, 4700, 5000]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">₹ 5,000 Cr <span className="text-xs text-emerald-600">+18.4%</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">EBITDA Target</span>
                    <Sparkline data={[18, 19.5, 21, 22]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">22.0% <span className="text-xs text-emerald-600">+2.8%</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Market Share Target</span>
                    <Sparkline data={[22, 24, 26, 28]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">28.0% <span className="text-xs text-blue-600">+3.2%</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Strategic Initiatives</span>
                    <Sparkline data={[8, 10, 11, 12]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-primary font-mono block">12 <span className="text-xs text-primary">+20%</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Portfolio Health</span>
                    <Sparkline data={[74, 76, 79, 81]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">81 / 100 <span className="text-xs text-emerald-600">+5%</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">ESG Performance</span>
                    <Sparkline data={[75, 78, 82, 85]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">85 / 100 <span className="text-xs text-emerald-600">+7%</span></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("info", "KPI Dashboard", "Navigating to Strategy KPI Dashboard...")}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                View KPI Dashboard <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* System Information Audit Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border font-bold text-foreground">
                <span>System Information</span>
                <span className="text-[10px] text-muted-foreground">Audit Log</span>
              </div>

              <div className="space-y-1.5 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Company:</span>
                  <span className="font-semibold text-foreground">Magnertia Industries Ltd.</span>
                </div>
                <div className="flex justify-between">
                  <span>Fiscal Year:</span>
                  <span className="font-semibold text-foreground">2024 - 25</span>
                </div>
                <div className="flex justify-between">
                  <span>Base Currency:</span>
                  <span className="font-semibold text-foreground">INR - Indian Rupee</span>
                </div>
                <div className="flex justify-between">
                  <span>Timezone:</span>
                  <span className="font-semibold text-foreground">IST (UTC +05:30)</span>
                </div>
                <div className="flex justify-between">
                  <span>Date Format:</span>
                  <span className="font-semibold text-foreground">dd MMM yyyy</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Format:</span>
                  <span className="font-semibold text-foreground">hh:mm:ss A</span>
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px]">
                <button type="button" onClick={() => showToast("info", "Audit Trail", "Displaying system audit log...")} className="text-primary hover:underline font-semibold">
                  View Activity History
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Corporate Strategy Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.strategyProject}</h2>
                <p className="text-xs text-muted-foreground">
                  Strategy ID: {formData.strategyId} · Cycle: {formData.strategicPlanningCycle} · Owner: {formData.strategyOwner} (CSO)
                </p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Overall Strategy Score</span>
                <span className="text-lg font-bold text-emerald-600">{computedOverallScore} / 100</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">5-Yr Revenue Target</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 5,000.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Capital Allocation</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 1,500.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Corporate Vision & North Star Direction</h4>
                <p className="text-muted-foreground"><strong>Vision:</strong> {formData.corporateVision}</p>
                <p className="text-muted-foreground mt-1"><strong>Mission:</strong> {formData.corporateMission}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Financial Model & Capital Deployment</h4>
                <p className="text-muted-foreground"><strong>Target:</strong> ₹ 5,000 Cr Revenue | <strong>EBITDA:</strong> 22.0% | <strong>Market Share:</strong> 28.0%</p>
                <p className="text-muted-foreground mt-1"><strong>Capital:</strong> ₹ 1,500 Cr allocated across 5 high-impact strategic initiatives.</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Governance & Board Oversight</h4>
                <p className="text-muted-foreground"><strong>Risk Rating:</strong> Medium (Hedged via diversification and operational resilience).</p>
                <p className="text-muted-foreground mt-1"><strong>Framework:</strong> Corporate Governance 2025 with active board quarterly oversight.</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Corporate Strategy Intelligence Workbench</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Enterprise Strategy Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Strategy Score</span>
                <span>88 / 100 (Optimal Long-Term Value Creation)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Projected 21.6% CAGR revenue growth supported by market leadership initiatives and €1.5B capital deployment across high-yield digital services.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Digital Transformation Valuation Unlock
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Accelerating cloud adoption and AI-enabled product portfolios can unlock ₹ 780 Cr in incremental enterprise value over 36 months.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" /> Global Expansion Priority
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Prioritize direct subsidiary operations in DACH and Southeast Asia to capture expanding demand for clean technology solutions.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600" /> Capital Optimization
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Reallocating 12% of non-core operational budgets into high-impact digital initiatives improves overall portfolio ROI by 16%.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Strategic Document
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
                  placeholder="e.g. Corporate_Strategy_2025_Board_Deck.pptx"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/10">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
                <p className="text-xs font-semibold text-foreground">Click to browse or drag & drop files</p>
                <p className="text-[10px] text-muted-foreground">Supports PDF, PPTX, XLSX, ZIP up to 50MB</p>
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Corporate Strategy repository.
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
