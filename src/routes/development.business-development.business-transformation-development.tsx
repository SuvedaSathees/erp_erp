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
  RefreshCw,
  Sliders,
  Workflow,
  Radio,
  Boxes,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/business-transformation-development",
)({
  head: () => ({ meta: [{ title: "Business Transformation Development · Magnertia ERP" }] }),
  component: BusinessTransformationDevelopmentPage,
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
      : score >= 75
      ? "text-blue-600"
      : score >= 60
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

function BusinessTransformationDevelopmentPage() {
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

  // Form State according to Business Transformation Development reference UI image
  const [formData, setFormData] = useState({
    transformationId: "TRF-2024-00045",
    formCode: "TRF-2024-25",
    transformationProgram: "Operational Excellence 2024",
    programNumber: "TRF-OPX-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "Global Operations",
    transformationSponsor: "Anita Verma",
    transformationManager: "Vikram Mehta",
    strategicReference: "Corporate Strategy 2025",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Transformation Planning",

    // Section 1: Transformation Overview
    transformationVision: "Build an agile, customer-centric and digitally intelligent organization.",
    businessObjective: "Improve operational efficiency, customer experience and drive sustainable growth.",
    transformationType: "Operational Transformation",
    strategicTheme: "Operational Excellence",
    businessDrivers: ["Cost Optimization", "Customer Expectations", "Digital Disruption"],
    expectedBusinessOutcome: "20% cost reduction, 30% productivity improvement and higher customer satisfaction.",
    strategicPriority: "High",
    transformationTimeline: "01 Jun 2024 - 31 Dec 2026",

    // Section 2: Current State Assessment (AS-IS)
    currentBusinessModel: "Traditional Model",
    currentProcessMaturity: "Repeatable",
    digitalMaturity: "Digitized",
    organizationalCapability: 58,
    technologyReadiness: 62,
    customerExperienceScore: 60,
    operationalEfficiency: 55,
    currentStateScore: 59,

    // Section 3: Future State Design (TO-BE)
    futureOperatingModel: "Agile, data-driven operating model with automation and AI enablement.",
    targetBusinessModel: "Digital Business Model",
    targetDigitalMaturity: "Intelligent",
    targetCustomerExperience: "Seamless, personalized and omni-channel customer experience.",
    targetKpiFramework: "Transformation KPI Framework",
    transformationRoadmap: "Phase 1: Foundation (Q3 2024), Phase 2: Core Modernization (2025), Phase 3: Scale & Autonomous (2026).",
    futureStateReadiness: 78,

    // Section 4: Transformation Initiatives List
    initiatives: [
      { name: "Process Automation", category: "Operations", owner: "Rahul Sharma", startDate: "01 Jun 2024", endDate: "30 Sep 2024", status: "In Progress", impactScore: 82 },
      { name: "ERP Modernization", category: "Technology", owner: "Anita Verma", startDate: "01 Jun 2024", endDate: "31 Dec 2024", status: "In Progress", impactScore: 88 },
      { name: "Customer Experience Revamp", category: "Customer Experience", owner: "Arjun Desai", startDate: "01 Jul 2024", endDate: "31 Dec 2024", status: "Planned", impactScore: 75 },
      { name: "Data & Analytics Platform", category: "Technology", owner: "Vikram Mehta", startDate: "01 Aug 2024", endDate: "31 Jan 2025", status: "Planned", impactScore: 81 },
    ],

    // Section 5: Organization & Change Management
    organizationStructureChange: true,
    leadershipAlignmentScore: 70,
    employeeReadinessScore: 65,
    trainingProgram: "Transformation Training 2024",
    communicationPlan: "Multi-channel communication plan with regular updates.",
    changeAdoptionPlan: "Change champions network and adoption tracking.",
    changeReadinessScore: 68,

    // Section 6: Process & Technology Transformation
    businessProcessReengineering: true,
    erpModernization: true,
    aiEnablement: true,
    automationLevel: 65, // 65%
    cloudMigration: true,
    dataStrategy: "Enterprise data platform with real-time analytics and data governance.",
    technologyTransformationScore: 72,

    // Section 7: Financial & Value Realization
    transformationBudget: 5000000000, // ₹ 500,00,00,000 (₹ 500 Cr)
    expectedCostSavings: 1000000000, // ₹ 100,00,00,000 (₹ 100 Cr)
    revenueGrowthTarget: 1500000000, // ₹ 150,00,00,000 (₹ 150 Cr)
    productivityImprovement: 25, // 25%
    roi: 28.5, // 28.50%
    paybackPeriod: 24, // 24 Months
    valueRealizationScore: 77,

    // Section 8: Risk & Governance
    transformationRisks: "Adoption resistance, legacy system integration, business continuity during migration.",
    enterpriseRiskRating: "Medium",
    governanceCommittee: "Transformation Steering Committee",
    complianceStatus: true,
    executiveSteeringCommittee: true,
    riskMitigationPlan: "Active risk monitoring, mitigation actions and periodic reviews.",
    governanceScore: 73,

    // Section 9: AI Business Transformation Intelligence
    aiTransformationAssessment: "Strong potential for operational excellence with automation and AI.",
    aiProcessOptimization: "Identified 15 high impact process optimization opportunities.",
    aiCostReductionOpportunities: "Potential cost reduction of ₹ 100 Cr over 24 months.",
    aiResourceOptimization: "Optimal resource allocation can improve productivity by 30%.",
    aiRiskPrediction: "Medium risk due to change adoption and legacy systems.",
    aiSuccessProbability: 78,
    aiTransformationScore: 76,

    // Section 10: Business Transformation Summary & Recommendation
    recommendation: "Proceed to Execution",

    // Section 12: Review & Approval Matrix
    approvals: [
      { role: "Executive Sponsor", user: "Anita Verma", status: "Approved", date: "08 May 2024", comments: "Operational transformation charter and €500M budget approved." },
      { role: "Chief Transformation Officer", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "Workforce readiness and change champion network confirmed." },
      { role: "COO", user: "Arjun Desai", status: "Approved", date: "10 May 2024", comments: "Plant automation and supply chain re-engineering validated." },
      { role: "CFO", user: "Manish Gupta", status: "Approved", date: "11 May 2024", comments: "₹100 Cr cost reduction model and 28.5% ROI verified." },
      { role: "CIO / CTO", user: "Amit Verma", status: "Approved", date: "12 May 2024", comments: "Hybrid cloud ERP modernization roadmap approved." },
      { role: "CHRO", user: "Sneha Nair", status: "Approved", date: "13 May 2024", comments: "Change management and employee training curriculum approved." },
      { role: "CEO", user: "Rahul Sharma", status: "Pending", date: "In Review", comments: "Final executive committee review." },
      { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Comments will be added during review...",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Transformation_Charter.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Anita Verma" },
    { id: "2", name: "Business_Case.pdf", type: "PDF Document", size: "3.1 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Roadmap.pdf", type: "PDF Document", size: "3.2 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "4", name: "AS-IS_Assessment.pdf", type: "PDF Document", size: "2.6 MB", date: "15 May 2024", uploader: "Arjun Desai" },
    { id: "5", name: "TO-BE_Blueprint.pdf", type: "PDF Document", size: "4.2 MB", date: "14 May 2024", uploader: "Amit Verma" },
    { id: "6", name: "Process_Maps.pdf", type: "PDF Document", size: "4.1 MB", date: "13 May 2024", uploader: "Rahul Sharma" },
    { id: "7", name: "Financial_Model.pdf", type: "PDF Document", size: "2.8 MB", date: "12 May 2024", uploader: "Manish Gupta" },
    { id: "8", name: "Risk_Register.pdf", type: "PDF Document", size: "1.9 MB", date: "11 May 2024", uploader: "Sneha Nair" },
    { id: "9", name: "Comm_Plan.pdf", type: "PDF Document", size: "1.4 MB", date: "10 May 2024", uploader: "Sneha Nair" },
    { id: "10", name: "Training_Materials.pdf", type: "PDF Document", size: "2.2 MB", date: "09 May 2024", uploader: "Sneha Nair" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "04:08 PM", user: "Vikram Mehta", action: "Updated Transformation Budget (₹500 Cr) and Initiative Milestones", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Anita Verma", action: "Uploaded Transformation_Charter.pdf and TO-BE_Blueprint.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Transformation Score (76/100) and 78% Success Probability", status: "AI System" },
    { id: "a4", date: "13 May 2024", time: "02:30 PM", user: "Sneha Nair", action: "CHRO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:15 AM", user: "Rahul Sharma", action: "Business Transformation Development Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Transformation Readiness Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      current: 0.1,
      future: 0.15,
      initiative: 0.15,
      change: 0.15,
      tech: 0.15,
      value: 0.15,
      gov: 0.075,
      ai: 0.075,
    };

    const weighted =
      formData.currentStateScore * weights.current +
      formData.futureStateReadiness * weights.future +
      80 * weights.initiative +
      formData.changeReadinessScore * weights.change +
      formData.technologyTransformationScore * weights.tech +
      formData.valueRealizationScore * weights.value +
      formData.governanceScore * weights.gov +
      formData.aiTransformationScore * weights.ai;

    return Math.round(weighted);
  }, [formData.currentStateScore, formData.futureStateReadiness, formData.changeReadinessScore, formData.technologyTransformationScore, formData.valueRealizationScore, formData.governanceScore, formData.aiTransformationScore]);

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
      user: formData.transformationManager,
      action: "Saved draft of Business Transformation project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Business Transformation Development draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.transformationProgram.trim()) errors.transformationProgram = "Transformation Program is required";
    if (!formData.programNumber.trim()) errors.programNumber = "Program Number is required";
    if (!formData.transformationVision.trim()) errors.transformationVision = "Transformation Vision is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.expectedBusinessOutcome.trim()) errors.expectedBusinessOutcome = "Expected Outcome is required";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      showToast("error", "Validation Failed", `Please fill in all ${Object.keys(errors).length} mandatory required fields before submission.`);
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, "0")} ${now.toLocaleString("default", { month: "short" })} ${now.getFullYear()}`;
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    updateField("workflowStatus", "Submitted");
    updateField("workflowStage", "Executive Transformation Committee Review");
    updateField("lastModifiedDate", `${formattedDate}`);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.transformationManager,
      action: "Submitted Operational Excellence 2024 for Executive Transformation Committee Review",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Business Transformation Roadmap submitted for Executive Review.");
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
      uploader: formData.transformationManager,
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
      title="Business Transformation Development"
      breadcrumb="Development > Business Development > Business Transformation Development"
      description="Govern enterprise transformation programs, AS-IS assessment, TO-BE future state, change management, technology re-engineering, and AI value realization."
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
                <RefreshCw className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.transformationProgram}</h1>
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
                  Transformation ID: <span className="font-mono font-bold text-foreground">{formData.transformationId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.programNumber}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Transformation Charter link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Transformation Blueprint PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Transformation Sponsor <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.transformationSponsor}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Transformation Manager <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-primary block truncate mt-0.5">{formData.transformationManager}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Strategic Reference <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.strategicReference}</span>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-9">
          <ScoreGauge label="Overall Readiness" score={computedOverallScore} sub="Good" size="normal" />
          <ScoreGauge label="Current State" score={formData.currentStateScore} sub="Fair" size="normal" />
          <ScoreGauge label="Future State" score={formData.futureStateReadiness} sub="Good" size="normal" />
          <ScoreGauge label="Initiative Score" score={80} sub="Good" size="normal" />
          <ScoreGauge label="Change Readiness" score={formData.changeReadinessScore} sub="Fair" size="normal" />
          <ScoreGauge label="Technology Score" score={formData.technologyTransformationScore} sub="Good" size="normal" />
          <ScoreGauge label="Value Realization" score={formData.valueRealizationScore} sub="Good" size="normal" />
          <ScoreGauge label="Governance Score" score={formData.governanceScore} sub="Good" size="normal" />
          <ScoreGauge label="AI Score" score={formData.aiTransformationScore} sub="Good" size="normal" />
        </div>

        {/* Main Grid: Form Sections (Left 2 Columns) & Executive AI/Health Panels (Right 1 Column) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Multi-Section Form Cards */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Transformation Overview */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> 1. Transformation Overview & Strategic Intent
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Enterprise Modernization</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Transformation Type</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.transformationType}
                    onChange={(e) => updateField("transformationType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {[
                      "Business Model Transformation",
                      "Digital Transformation",
                      "Operational Transformation",
                      "Organizational Transformation",
                      "Process Transformation",
                      "Technology Transformation",
                      "Customer Experience Transformation",
                      "Enterprise Transformation",
                    ].map((tt) => (
                      <option key={tt} value={tt}>{tt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Strategic Theme</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.strategicTheme}
                    onChange={(e) => updateField("strategicTheme", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-primary focus:border-primary focus:outline-none"
                  >
                    {["Growth", "Innovation", "Operational Excellence", "Customer Centricity", "Sustainability", "Global Expansion", "Digital Leadership"].map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Transformation Vision</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.transformationVision}
                    onChange={(e) => updateField("transformationVision", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Business Objective</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.businessObjective}
                    onChange={(e) => updateField("businessObjective", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Business Drivers</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.businessDrivers.map((bd) => (
                      <span key={bd} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {bd}
                      </span>
                    ))}
                  </div>
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
                    {["Critical", "High", "Medium", "Low"].map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Transformation Timeline</span> <MAICWBadge type="W" />
                  </label>
                  <input
                    type="text"
                    value={formData.transformationTimeline}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Expected Business Outcome</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.expectedBusinessOutcome}
                    onChange={(e) => updateField("expectedBusinessOutcome", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Current State Assessment (AS-IS) */}
            <div id="sec-current-state" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-500" /> 2. Current State Assessment (AS-IS)
                </h3>
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  Current State Score: <strong>{formData.currentStateScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Current Model <MAICWBadge type="I" /></label>
                  <input
                    type="text"
                    value={formData.currentBusinessModel}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 font-bold text-foreground"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Process Maturity <MAICWBadge type="M" /></label>
                  <select
                    value={formData.currentProcessMaturity}
                    onChange={(e) => updateField("currentProcessMaturity", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 font-bold text-foreground"
                  >
                    {["Initial", "Repeatable", "Defined", "Managed", "Optimized"].map((pm) => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Digital Maturity <MAICWBadge type="M" /></label>
                  <select
                    value={formData.digitalMaturity}
                    onChange={(e) => updateField("digitalMaturity", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 font-bold text-primary"
                  >
                    {["Manual", "Digitized", "Integrated", "Intelligent", "Autonomous"].map((dm) => (
                      <option key={dm} value={dm}>{dm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Org Capability <MAICWBadge type="C" /></label>
                  <input
                    type="text"
                    value={`${formData.organizationalCapability} / 100`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono font-bold text-amber-500"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Tech Readiness <MAICWBadge type="C" /></label>
                  <input
                    type="text"
                    value={`${formData.technologyReadiness} / 100`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono font-bold text-amber-500"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Customer Experience <MAICWBadge type="C" /></label>
                  <input
                    type="text"
                    value={`${formData.customerExperienceScore} / 100`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono font-bold text-amber-500"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">Operational Efficiency <MAICWBadge type="C" /></label>
                  <input
                    type="text"
                    value={`${formData.operationalEfficiency} / 100`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 font-mono font-bold text-rose-500"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground font-medium block mb-1">AS-IS Health <MAICWBadge type="C" /></label>
                  <input
                    type="text"
                    value="Fair (59/100)"
                    readOnly
                    className="w-full rounded-lg border border-amber-500/30 bg-amber-950/20 px-3 py-2 font-bold text-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 3. Future State Design (TO-BE) */}
            <div id="sec-future-state" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Crosshair className="h-4 w-4 text-emerald-600" /> 3. Future State Design (TO-BE Blueprint)
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Future State Score: <strong>{formData.futureStateReadiness}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Future Operating Model</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.futureOperatingModel}
                    onChange={(e) => updateField("futureOperatingModel", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Business Model</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.targetBusinessModel}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Digital Maturity</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.targetDigitalMaturity}
                    onChange={(e) => updateField("targetDigitalMaturity", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {["Digitized", "Integrated", "Intelligent", "Autonomous"].map((dm) => (
                      <option key={dm} value={dm}>{dm}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Customer Experience</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.targetCustomerExperience}
                    onChange={(e) => updateField("targetCustomerExperience", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Transformation Roadmap</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.transformationRoadmap}
                    onChange={(e) => updateField("transformationRoadmap", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Transformation Initiatives */}
            <div id="sec-initiatives" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Boxes className="h-4 w-4 text-purple-600" /> 4. Transformation Program Initiatives
                </h3>
                <span className="text-xs font-semibold text-muted-foreground">4 Active Initiatives</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/20 text-muted-foreground">
                      <th className="py-2.5 px-3 text-left font-semibold">Initiative Name</th>
                      <th className="py-2.5 px-3 text-left font-semibold">Category</th>
                      <th className="py-2.5 px-3 text-left font-semibold">Owner</th>
                      <th className="py-2.5 px-3 text-left font-semibold">Start Date</th>
                      <th className="py-2.5 px-3 text-left font-semibold">End Date</th>
                      <th className="py-2.5 px-3 text-left font-semibold">Status</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {formData.initiatives.map((init) => (
                      <tr key={init.name} className="hover:bg-muted/10">
                        <td className="py-2.5 px-3 font-bold text-foreground">{init.name}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{init.category}</td>
                        <td className="py-2.5 px-3 font-semibold text-foreground">{init.owner}</td>
                        <td className="py-2.5 px-3 text-muted-foreground font-mono">{init.startDate}</td>
                        <td className="py-2.5 px-3 text-muted-foreground font-mono">{init.endDate}</td>
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
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-primary">{init.impactScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Organization & Change Management */}
            <div id="sec-change-management" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-600" /> 5. Organization & Change Management
                </h3>
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  Change Score: <strong>{formData.changeReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Org Structure Change</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Leadership Alignment <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-emerald-600 font-mono mt-0.5 block">{formData.leadershipAlignmentScore} / 100</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Employee Readiness <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-amber-500 font-mono mt-0.5 block">{formData.employeeReadinessScore} / 100</span>
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Training Program</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.trainingProgram}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Communication & Adoption Plan</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.communicationPlan}
                    onChange={(e) => updateField("communicationPlan", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 6. Process & Technology Transformation */}
            <div id="sec-tech-transformation" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-purple-600" /> 6. Process & Technology Transformation
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Technology Score: <strong>{formData.technologyTransformationScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Process Reengineering</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">ERP Modernization</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">AI Enablement</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Automation Level <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-emerald-600 font-mono mt-0.5 block">{formData.automationLevel} %</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 sm:col-span-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Hybrid Cloud Migration Active</span>
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Data & Analytics Strategy</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.dataStrategy}
                    onChange={(e) => updateField("dataStrategy", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 7. Financial & Value Realization */}
            <div id="sec-value-realization" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> 7. Financial & Value Realization
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Value Score: <strong>{formData.valueRealizationScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Transformation Budget</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 500.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Expected Cost Savings</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 100.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Growth Target</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 150.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-blue-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Productivity Improvement</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.productivityImprovement} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>ROI (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.roi} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Payback Period</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.paybackPeriod} Months`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 8. Risk & Governance */}
            <div id="sec-risk-governance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 text-amber-500" /> 8. Risk & Governance Committee
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
                  <span className="font-bold text-foreground">Compliance Status</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Steering Committee Active</span>
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

            {/* 9. AI Business Transformation Intelligence */}
            <div id="sec-ai-intelligence" className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> 9. AI Business Transformation Intelligence
                </h3>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
                  AI Transformation Score: {formData.aiTransformationScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> AI Transformation Assessment
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiTransformationAssessment}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Cpu className="h-3.5 w-3.5 text-blue-600" /> AI Process Optimization
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiProcessOptimization}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-purple-600" /> AI Cost Reduction Opportunities
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiCostReductionOpportunities}</p>
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
                <Sparkles className="h-4 w-4" /> Open Interactive AI Transformation Workbench <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* 10. Business Transformation Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> 10. Transformation Summary & Recommendation
                </h3>
                <span className="text-xs font-bold text-emerald-600">Overall Readiness: {computedOverallScore}/100</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Current State (AS-IS)</span>
                    <span className="font-mono font-bold">{formData.currentStateScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${formData.currentStateScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Future State (TO-BE)</span>
                    <span className="font-mono font-bold">{formData.futureStateReadiness} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${formData.futureStateReadiness}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Technology Score</span>
                    <span className="font-mono font-bold">{formData.technologyTransformationScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${formData.technologyTransformationScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Value Realization</span>
                    <span className="font-mono font-bold">{formData.valueRealizationScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${formData.valueRealizationScore}%` }} />
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
                  <ScoreGauge label="Overall Transformation Readiness" score={computedOverallScore} sub="Good" size="large" />

                  <div className="w-full">
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">Executive Recommendation</label>
                    <select
                      value={formData.recommendation}
                      onChange={(e) => updateField("recommendation", e.target.value)}
                      className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 text-center focus:outline-none"
                    >
                      {[
                        "Proceed to Execution",
                        "Approve Transformation",
                        "Revise Business Case",
                        "Strengthen Change Management",
                        "Accelerate Digital Transformation",
                        "Optimize Investment",
                        "Reduce Transformation Risk",
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
                  <FileText className="h-4 w-4 text-primary" /> 11. Transformation Artifacts & Blueprint Dossier
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
                  <ShieldCheck className="h-4 w-4 text-primary" /> 12. Transformation Steering Committee Matrix
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
                <h4 className="text-xs font-bold text-foreground">Record Steering Committee Decision</h4>
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

            {/* AI Transformation Insights Snapshot Panel */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI Transformation Insights
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">AI Score 76</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> High Impact Potential
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    This program can deliver ₹ 100 Cr cost savings and 25% productivity improvement.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-blue-600" /> Top Opportunity
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Process automation and digital modernization offer highest ROI.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-amber-500">
                    <ShieldAlert className="h-3.5 w-3.5" /> Risk Alert
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Change adoption risk is medium due to organizational resistance.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-purple-600">
                    <Zap className="h-3.5 w-3.5" /> Resource Optimization
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Optimize resources to reduce project costs by 12%.
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

            {/* Transformation KPI Snapshot Panel */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Transformation KPI Snapshot
                </h3>
                <span className="text-xs font-mono text-muted-foreground">Real-time</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Cost Savings</span>
                    <Sparkline data={[12, 16, 20, 25]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">₹ 25.0 Cr <span className="text-xs text-emerald-600">+12.6%</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Productivity Impr.</span>
                    <Sparkline data={[10, 12.5, 15, 18.4]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">18.4% <span className="text-xs text-emerald-600">+8.2%</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">CX Score</span>
                    <Sparkline data={[60, 64, 68, 72]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">72 / 100 <span className="text-xs text-blue-600">+6.0%</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Digital Maturity</span>
                    <Sparkline data={[2.0, 2.4, 2.8, 3.2]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-primary font-mono block">3.2 / 5 <span className="text-xs text-primary">+0.6</span></span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Initiatives On Track</span>
                    <Sparkline data={[4, 5, 5, 6]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">6 / 8</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Budget Utilization</span>
                    <Sparkline data={[30, 36, 40, 42]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">42.0% <span className="text-xs text-emerald-600">-3.2%</span></span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("info", "KPI Dashboard", "Navigating to Transformation KPI Dashboard...")}
                className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                View KPI Dashboard <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Program Health Card */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border font-bold text-foreground">
                <span>Program Health</span>
                <span className="text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded font-bold">Good</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <ScoreGauge label="Overall Health" score={74} sub="Good" size="normal" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> On Track</span>
                    <span className="font-bold font-mono">6</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> At Risk</span>
                    <span className="font-bold font-mono">2</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500" /> Delayed</span>
                    <span className="font-bold font-mono">1</span>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground pt-2 border-t border-border leading-relaxed">
                Program is progressing well and on track to achieve transformation goals.
              </p>
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Business Transformation Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.transformationProgram}</h2>
                <p className="text-xs text-muted-foreground">
                  ID: {formData.transformationId} · Strategic Reference: {formData.strategicReference} · Manager: {formData.transformationManager}
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
                <span className="text-muted-foreground font-medium block">Budget</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 500.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Expected Cost Savings</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 100.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Transformation Vision & Business Objectives</h4>
                <p className="text-muted-foreground"><strong>Vision:</strong> {formData.transformationVision}</p>
                <p className="text-muted-foreground mt-1"><strong>Outcome:</strong> {formData.expectedBusinessOutcome}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Future State (TO-BE Blueprint) & Initiatives</h4>
                <p className="text-muted-foreground"><strong>Operating Model:</strong> {formData.futureOperatingModel}</p>
                <p className="text-muted-foreground mt-1"><strong>Key Initiatives:</strong> Process Automation, ERP Modernization, Customer Experience Revamp, Data & Analytics Platform.</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Financial Model & Value Realization</h4>
                <p className="text-muted-foreground"><strong>ROI:</strong> 28.5% | <strong>Payback:</strong> 24 Months | <strong>Productivity Improvement:</strong> 25%</p>
                <p className="text-muted-foreground mt-1"><strong>Governance:</strong> Executive Transformation Steering Committee active.</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Business Transformation Intelligence Workbench</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Transformation Optimization Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Transformation Score</span>
                <span>76 / 100 (78% Success Probability)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Strong potential for operational excellence with automation and AI. Reallocating resources towards change champions increases user adoption by 35%.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> ₹ 100 Cr Cost Reduction Pipeline
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Supply chain optimization and ERP modernization will realize ₹ 45 Cr in FY25 and ₹ 55 Cr in FY26.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" /> Change Management Acceleration
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Establish 40 cross-functional change champions across plants to mitigate adoption friction and decrease retraining cycle times.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600" /> Steering Committee Governance
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Schedule bi-weekly milestone checkpoints for ERP migration and data platform integration to prevent scope creep.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Transformation Document
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
                  placeholder="e.g. Transformation_Charter_2024.pdf"
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Transformation repository.
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
