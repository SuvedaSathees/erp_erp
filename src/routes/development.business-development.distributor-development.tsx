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
  GraduationCap,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/distributor-development",
)({
  head: () => ({ meta: [{ title: "Distributor Development · Magnertia ERP" }] }),
  component: DistributorDevelopmentPage,
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

function DistributorDevelopmentPage() {
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

  // Form State according to Distributor Development reference UI image
  const [formData, setFormData] = useState({
    distributorId: "DD-2024-00058",
    formCode: "DDF-2024-25",
    distributorProject: "North India Distribution Expansion",
    distributorNumber: "DSR-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "EV Solutions",
    productService: "EV Two Wheelers",
    distributorDevelopmentManager: "Rahul Sharma",
    createdDate: "05 May 2024 09:40 AM",
    lastModifiedDate: "17 May 2024 03:50 PM",
    workflowStage: "Distributor Onboarding",

    // Section 1: Distributor Overview
    businessObjective: "Expand distribution reach and increase product availability across North India.",
    distributionObjective: "Build efficient distribution network with strong inventory and service support.",
    distributorType: "Regional Distributor",
    productCategory: "Electric Two Wheelers",
    geographicCoverage: ["Delhi", "Uttar Pradesh", "Punjab", "Haryana", "Rajasthan"],
    salesChannelRef: "EV Two Wheeler Channel",
    lifecycleStage: "Distributor Onboarding",
    priority: "High",

    // Section 2: Distributor Profile
    distributorName: "GreenRide Distributors Pvt. Ltd.",
    businessType: "Private Limited",
    companyRegistration: "U74999DL2016PTC302415",
    yearsInBusiness: 9,
    annualTurnover: 450000000, // ₹ 45,00,00,000
    warehouses: 4,
    distributionFleet: 28,
    existingBrands: ["Hero", "TVS", "Bajaj"],
    coverageStates: ["Delhi", "Uttar Pradesh", "Punjab", "Haryana", "Rajasthan"],
    distributorCapabilityScore: 82,

    // Section 3: Qualification & Due Diligence
    financialCapability: "Strong",
    logisticsCapability: "Advanced",
    salesCapability: "Advanced",
    technicalCapability: "Intermediate",
    dueDiligenceStatus: true,
    backgroundVerification: true,
    creditAssessment: true,
    qualificationScore: 84,

    // Section 4: Commercial Planning
    pricingStrategyRef: "EV Pricing Strategy 2024",
    revenueModelRef: "Distribution Revenue Model",
    distributorMargin: 16.5, // 16.50%
    creditLimit: 50000000, // ₹ 5,00,00,000
    paymentTerms: "Net 30",
    annualPurchaseCommitment: 100000000, // ₹ 10,00,00,000
    salesTarget: 120000000, // ₹ 12,00,00,000 (₹ 12 Cr)
    commercialScore: 86,

    // Section 5: Supply Chain & Operations
    warehouseReady: true,
    distributionFleetReady: true,
    erpIntegrationCompleted: true,
    reverseLogisticsAvailable: true,
    inventoryAllocation: 10000000, // ₹ 1,00,00,000
    safetyStockLevel: 15, // 15 Days
    operationalReadinessScore: 83,

    // Section 6: Training & Enablement
    salesTrainingCompleted: true,
    productTrainingCompleted: true,
    logisticsTrainingCompleted: true,
    erpTrainingCompleted: true,
    distributorHandbookIssued: true,
    certificationLevel: "Gold Distributor",
    trainingScore: 87,

    // Section 7: Performance Management
    monthlySalesTarget: 10000000, // ₹ 1,00,00,000
    orderFulfillmentRate: 96, // 96%
    inventoryTurnoverRatio: 7.2,
    onTimeDelivery: 95, // 95%
    customerSatisfactionScore: 4.5, // 4.5/5
    distributionCoverage: 78, // 78%
    revenueAchievement: 92, // 92%
    performanceScore: 86,

    // Section 8: AI Distributor Intelligence
    aiTerritoryRecommendation: "Expand coverage in Uttarakhand and Bihar",
    aiInventoryOptimization: "Increase fast-moving SKUs by 18%",
    aiDemandForecast: "26% growth in EV two-wheelers in next 12 months",
    aiLogisticsOptimization: "Optimize routes to reduce delivery time by 12%",
    aiRevenuePrediction: "Expected revenue of ₹ 15 Cr in next FY",
    aiDistributorRecommendation: "Highly suitable for premium product line",
    aiDistributorScore: 88,

    // Section 9: Distributor Summary & Recommendation
    recommendation: "Approve Distributor",

    // Section 11: Review & Approval Matrix
    approvals: [
      { role: "Distributor Dev Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "4 warehouses, 28 fleet vehicles & 82% capability score validated." },
      { role: "Sales Manager", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "₹12 Cr annual sales target & 16.5% distributor margin approved." },
      { role: "Supply Chain Manager", user: "Anita Verma", status: "Approved", date: "10 May 2024", comments: "15-day safety stock level and 95% on-time delivery verified." },
      { role: "Finance Manager", user: "Amit Joshi", status: "Approved", date: "11 May 2024", comments: "₹5 Cr credit limit and Net 30 payment terms approved." },
      { role: "Operations Manager", user: "Neha Mehta", status: "Approved", date: "12 May 2024", comments: "Warehouse logistics readiness and ERP integration complete." },
      { role: "Legal Manager", user: "Rohan Kapoor", status: "Approved", date: "13 May 2024", comments: "Distributor agreement and credit terms legally verified." },
      { role: "COO", user: "Arun Verma", status: "Pending", date: "In Review", comments: "Territory exclusivity review." },
      { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "High distribution capacity & 86/100 Overall Score (86 Commercial, 83 Operational, ₹15 Cr Forecast). Approved for Onboarding.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Distributor_Application.pdf", type: "PDF Document", size: "612 KB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Company_Registration.pdf", type: "PDF Document", size: "452 KB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Financial_Statements.pdf", type: "PDF Document", size: "3.1 MB", date: "16 May 2024", uploader: "Amit Joshi" },
    { id: "4", name: "Warehouse_Assessment.pdf", type: "PDF Document", size: "520 KB", date: "15 May 2024", uploader: "Anita Verma" },
    { id: "5", name: "Distributor_Agreement.pdf", type: "PDF Document", size: "380 KB", date: "14 May 2024", uploader: "Rohan Kapoor" },
    { id: "6", name: "Training_Certificates.pdf", type: "PDF Document", size: "1.2 MB", date: "13 May 2024", uploader: "Neha Mehta" },
    { id: "7", name: "Territory_Map.pdf", type: "PDF Document", size: "330 KB", date: "12 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "03:50 PM", user: "Rahul Sharma", action: "Updated Annual Sales Target (₹12 Cr) and AI Distributor Score (88/100)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Rohan Kapoor", action: "Uploaded Distributor_Agreement.pdf and Warehouse_Assessment.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Distributor Score (88/100)", status: "AI System" },
    { id: "a4", date: "13 May 2024", time: "02:30 PM", user: "Rohan Kapoor", action: "Legal Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:40 AM", user: "Rahul Sharma", action: "Distributor Development Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Distributor Readiness Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      capability: 0.15,
      qualification: 0.15,
      commercial: 0.2,
      operational: 0.15,
      training: 0.1,
      performance: 0.15,
      ai: 0.1,
    };

    const weighted =
      formData.distributorCapabilityScore * weights.capability +
      formData.qualificationScore * weights.qualification +
      formData.commercialScore * weights.commercial +
      formData.operationalReadinessScore * weights.operational +
      formData.trainingScore * weights.training +
      formData.performanceScore * weights.performance +
      formData.aiDistributorScore * weights.ai;

    return Math.round(weighted);
  }, [formData.distributorCapabilityScore, formData.qualificationScore, formData.commercialScore, formData.operationalReadinessScore, formData.trainingScore, formData.performanceScore, formData.aiDistributorScore]);

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
      user: formData.distributorDevelopmentManager,
      action: "Saved draft of Distributor Development project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Distributor Development draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.distributorProject.trim()) errors.distributorProject = "Distributor Project is required";
    if (!formData.distributorNumber.trim()) errors.distributorNumber = "Distributor Number is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.distributorName.trim()) errors.distributorName = "Distributor Name is required";

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
      user: formData.distributorDevelopmentManager,
      action: "Submitted Distributor Development Strategy for Executive Review Board",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Distributor Development Strategy submitted for executive review.");
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
      uploader: formData.distributorDevelopmentManager,
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
      title="Distributor Development"
      breadcrumb="Development > Business Development > Distributor Development"
      description="Govern distributor network planning, qualification, supply chain logistics, commercial agreements, performance management, and AI distribution intelligence."
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
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.distributorProject}</h1>
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
                  Distributor ID: <span className="font-mono font-bold text-foreground">{formData.distributorId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.distributorNumber}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Distributor Strategy link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Distributor Development PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
              <span className="font-bold text-primary block truncate mt-0.5">{formData.productService}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Distributor Manager <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.distributorDevelopmentManager}</span>
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
          <ScoreGauge label="Capability Score" score={formData.distributorCapabilityScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Qualification Score" score={formData.qualificationScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Commercial Score" score={formData.commercialScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Operations Score" score={formData.operationalReadinessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Training Score" score={formData.trainingScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Performance Score" score={formData.performanceScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Distributor Score" score={formData.aiDistributorScore} sub="Excellent" size="normal" />
        </div>

        {/* Main Grid: Form Sections (Left 2 Columns) & Executive AI/Health Panels (Right 1 Column) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Multi-Section Form Cards */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Distributor Overview */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> 1. Distributor Overview
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Scope & Coverage</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Distributor Type</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.distributorType}
                    onChange={(e) => updateField("distributorType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {[
                      "Regional Distributor",
                      "State Distributor",
                      "National Distributor",
                      "Master Distributor",
                      "Super Stockist",
                      "Import Distributor",
                      "Export Distributor",
                      "Exclusive Distributor",
                    ].map((dt) => (
                      <option key={dt} value={dt}>{dt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Product Category</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.productCategory}
                    onChange={(e) => updateField("productCategory", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
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
                    <span>Sales Channel Reference</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.salesChannelRef}
                    onChange={(e) => updateField("salesChannelRef", e.target.value)}
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
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {["Distributor Planning", "Recruitment", "Qualification", "Commercial Evaluation", "Distributor Onboarding", "Operations", "Expansion", "Optimization"].map((s) => (
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
                    <span>Distribution Objective</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.distributionObjective}
                    onChange={(e) => updateField("distributionObjective", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* 2. Distributor Profile */}
            <div id="sec-distributor-profile" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-emerald-600" /> 2. Distributor Organization Profile
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Capability Score: <strong>{formData.distributorCapabilityScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Distributor Name</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.distributorName}
                    onChange={(e) => updateField("distributorName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Business Type</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => updateField("businessType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Proprietorship", "Partnership", "LLP", "Private Limited", "Public Limited", "Cooperative Society"].map((bt) => (
                      <option key={bt} value={bt}>{bt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Company Registration</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.companyRegistration}
                    onChange={(e) => updateField("companyRegistration", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Years in Business</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.yearsInBusiness} Years`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Warehouses</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.warehouses} Warehouses`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-indigo-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Distribution Fleet</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.distributionFleet} Vehicles`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-blue-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Existing Brands Handled</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.existingBrands.map((b) => (
                      <span key={b} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Coverage States</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.coverageStates.map((s) => (
                      <span key={s} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Qualification & Due Diligence */}
            <div id="sec-distributor-qualification" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-600" /> 3. Qualification & Due Diligence
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Qualification Score: <strong>{formData.qualificationScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Financial Capability <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-emerald-600 block mt-0.5">{formData.financialCapability}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Logistics Capability <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-emerald-600 block mt-0.5">{formData.logisticsCapability}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Sales Capability <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-blue-600 block mt-0.5">{formData.salesCapability}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Technical Capability <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-blue-600 block mt-0.5">{formData.technicalCapability}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Background Verified</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Credit Assessed</span>
                </div>
              </div>
            </div>

            {/* 4. Commercial Planning */}
            <div id="sec-commercial-planning" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> 4. Commercial Planning & Margins
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Commercial Score: <strong>{formData.commercialScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                    <span>Distributor Margin (%)</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.distributorMargin} %`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Payment Terms</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.paymentTerms}
                    onChange={(e) => updateField("paymentTerms", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Advance", "Net 15", "Net 30", "Net 45", "Net 60", "Letter of Credit (LC)"].map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Annual Purchase Commitment</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 10.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Annual Sales Target</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 12.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 5. Supply Chain & Operations */}
            <div id="sec-operations" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" /> 5. Supply Chain & Operations Readiness
                </h3>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  Operational Score: <strong>{formData.operationalReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Warehouse Ready</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Distribution Fleet Ready</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">ERP Integration Completed</span>
                </div>

                <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Reverse Logistics Available</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Inventory Allocation <MAICWBadge type="C" /></span>
                  <span className="text-xs font-bold text-foreground font-mono block mt-0.5">₹ 1,00,00,000</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Safety Stock Level <MAICWBadge type="C" /></span>
                  <span className="text-xs font-bold text-indigo-600 font-mono block mt-0.5">{formData.safetyStockLevel} Days</span>
                </div>
              </div>
            </div>

            {/* 6. Training & Enablement */}
            <div id="sec-training" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-purple-600" /> 6. Training & Enablement Certification
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Training Score: <strong>{formData.trainingScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Sales Training Completed</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Product Training Completed</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Logistics Training Completed</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">ERP Training Completed</span>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Distributor Handbook Issued</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Certification Level <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-amber-500 font-mono block mt-0.5">{formData.certificationLevel}</span>
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
                  <span className="text-[11px] text-muted-foreground font-medium block">Monthly Sales Target <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">₹ 1,00,00,000</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">On-Time Delivery (%) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">95 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Revenue Achievement (%) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">92 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Order Fulfillment Rate <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">96 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Customer Satisfaction <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">4.5 / 5</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Distribution Coverage (%) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-indigo-600 font-mono mt-0.5 block">78 %</span>
                </div>
              </div>
            </div>

            {/* 8. AI Distributor Intelligence */}
            <div id="sec-ai-intelligence" className="rounded-xl border border-primary/30 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> 8. AI Distributor Intelligence
                </h3>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold text-primary">
                  AI Distributor Score: {formData.aiDistributorScore}/100
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" /> AI Territory Recommendation
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiTerritoryRecommendation}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-blue-600" /> AI Inventory Optimization
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiInventoryOptimization}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-purple-600" /> AI Revenue Prediction
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiRevenuePrediction}</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-emerald-600">
                    <Truck className="h-3.5 w-3.5" /> AI Logistics Optimization
                  </span>
                  <p className="text-muted-foreground leading-relaxed">{formData.aiLogisticsOptimization}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAiDrawerOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
              >
                <Sparkles className="h-4 w-4" /> Open Interactive AI Distributor Intelligence Workbench <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* 9. Distributor Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> 9. Distributor Summary & Executive Recommendation
                </h3>
                <span className="text-xs font-bold text-emerald-600">Overall Score: {computedOverallScore}/100</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Capability Score</span>
                    <span className="font-mono font-bold">{formData.distributorCapabilityScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${formData.distributorCapabilityScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Qualification Score</span>
                    <span className="font-mono font-bold">{formData.qualificationScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${formData.qualificationScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Commercial Score</span>
                    <span className="font-mono font-bold">{formData.commercialScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${formData.commercialScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Operational Score</span>
                    <span className="font-mono font-bold">{formData.operationalReadinessScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${formData.operationalReadinessScore}%` }} />
                  </div>

                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>AI Distributor Score</span>
                    <span className="font-mono font-bold">{formData.aiDistributorScore} / 100</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${formData.aiDistributorScore}%` }} />
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 border border-border rounded-xl bg-muted/20 text-center space-y-3">
                  <ScoreGauge label="Overall Distributor Score" score={computedOverallScore} sub="Very Good" size="large" />

                  <div className="w-full">
                    <label className="text-[11px] font-bold text-muted-foreground block mb-1">Executive Recommendation</label>
                    <select
                      value={formData.recommendation}
                      onChange={(e) => updateField("recommendation", e.target.value)}
                      className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 text-center focus:outline-none"
                    >
                      {[
                        "Approve Distributor",
                        "Improve Logistics Capability",
                        "Increase Warehouse Capacity",
                        "Complete ERP Integration",
                        "Revise Commercial Terms",
                        "Expand Territory",
                        "Proceed to Commercial Launch",
                      ].map((rec) => (
                        <option key={rec} value={rec}>{rec}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 10. Attachments */}
            <div id="sec-attachments" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> 10. Distributor Attachments & Artifacts
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

            {/* 11. Review & Approval */}
            <div id="sec-review-approval" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> 11. Governance & Executive Review Board Matrix
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

            {/* 12. Activity History */}
            <div id="sec-activity-history" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" /> 12. Activity History Log
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

            {/* AI Insights Snapshot Panel */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI Insights Snapshot
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">AI Score 88</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-blue-600" /> High Potential Distributor
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    AI analysis shows 88% potential for long term partnership.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" /> Revenue Opportunity
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Expected additional revenue of ₹ 15 Cr in next FY.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-indigo-600">
                    <Package className="h-3.5 w-3.5" /> Inventory Optimization
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    AI recommends increasing inventory for Top 20 SKUs.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-emerald-600">
                    <TrendingUp className="h-3.5 w-3.5" /> Logistics Efficiency
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Route optimization can reduce delivery time by 12%.
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
                    <span className="text-muted-foreground font-semibold">Projected Revenue</span>
                    <Sparkline data={[10, 11.5, 13.2, 15.0]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">₹ 15.0 Cr</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Annual Sales Target</span>
                    <Sparkline data={[8.5, 9.5, 10.8, 12.0]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">₹ 12.0 Cr</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Market Coverage</span>
                    <Sparkline data={[55, 62, 70, 78]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-indigo-600 font-mono block">78 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Revenue Achievement</span>
                    <Sparkline data={[82, 85, 88, 92]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">92 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">On-Time Delivery</span>
                    <Sparkline data={[88, 90, 92, 95]} color="#10b981" />
                  </div>
                  <span className="text-base font-bold text-emerald-600 font-mono block">95 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-semibold">Inventory Turnover</span>
                    <Sparkline data={[5.8, 6.2, 6.8, 7.2]} color="#2563eb" />
                  </div>
                  <span className="text-base font-bold text-foreground font-mono block">7.2</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("info", "KPI Dashboard", "Navigating to Distributor KPI Dashboard...")}
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
                  <span className="font-semibold text-foreground">{formData.distributorDevelopmentManager}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created Date:</span>
                  <span className="font-semibold text-foreground">05 May 2024 09:40 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified By:</span>
                  <span className="font-semibold text-foreground">{formData.distributorDevelopmentManager}</span>
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Distributor Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.distributorProject}</h2>
                <p className="text-xs text-muted-foreground">
                  Distributor ID: {formData.distributorId} · Number: {formData.distributorNumber} · Manager: {formData.distributorDevelopmentManager}
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
                <span className="text-muted-foreground font-medium block">Projected Revenue</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 15.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Annual Sales Target</span>
                <span className="text-lg font-bold text-foreground font-mono">₹ 12.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Distributor Profile & Supply Chain</h4>
                <p className="text-muted-foreground"><strong>Distributor:</strong> GreenRide Distributors Pvt. Ltd. | <strong>Warehouses:</strong> 4 | <strong>Fleet:</strong> 28 Vehicles</p>
                <p className="text-muted-foreground mt-1"><strong>Capability:</strong> 82/100 | <strong>Logistics Readiness:</strong> 83/100 (15-Day Safety Stock)</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Commercial Structure & Margins</h4>
                <p className="text-muted-foreground"><strong>Margin:</strong> 16.50% | <strong>Credit Limit:</strong> ₹ 5.00 Cr | <strong>Payment Terms:</strong> Net 30</p>
                <p className="text-muted-foreground mt-1"><strong>Commitment:</strong> Annual Purchase ₹ 10 Cr | Target: ₹ 12 Cr</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Performance Metrics & AI Forecast</h4>
                <p className="text-muted-foreground"><strong>Order Fulfillment:</strong> 96% | <strong>On-Time Delivery:</strong> 95% | <strong>Turnover:</strong> 7.2</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Distributor Intelligence Workbench</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Neural Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Distributor Score</span>
                <span>88 / 100 (Optimal Channel Alignment)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                GreenRide Distributors exhibits 88% overall channel fit with ₹15 Cr projected revenue across 5 North Indian states.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" /> Territory Expansion Recommendation
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Expand distribution hubs into Uttarakhand and Western Bihar to capture 22% additional regional market demand.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Truck className="h-4 w-4 text-blue-600" /> Route & Fleet Optimization
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Deploy dynamic routing across the 28 distribution vehicles to reduce delivery times by 12% and cut fuel costs.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Package className="h-4 w-4 text-purple-600" /> Inventory Replenishment Policy
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Maintain 15-day safety buffer for Top 20 fast-moving SKUs with automated ERP electronic purchase orders.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Distributor Document
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
                  placeholder="e.g. Warehouse_Audit_Report.pdf"
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Distributor Network repository.
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
