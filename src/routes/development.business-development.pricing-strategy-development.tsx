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
  Calculator,
  Tag,
  Percent,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/pricing-strategy-development",
)({
  head: () => ({ meta: [{ title: "Pricing Strategy Development · Magnertia ERP" }] }),
  component: PricingStrategyDevelopmentPage,
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

export function PricingStrategyDevelopmentPage() {
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

  // Form State according to Pricing Strategy Development reference UI image
  const [formData, setFormData] = useState({
    pricingId: "PS-2024-00038",
    formCode: "PSF-2024-25",
    pricingProject: "EV Fast Charger Pricing Strategy",
    pricingNumber: "PSN-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    productService: "EV Fast Charger",
    productVersion: "v2.1",
    businessUnit: "EV Solutions",
    pricingManager: "Rahul Sharma",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Pricing Validation",

    // Section 1: Pricing Overview
    businessObjective: "Maximize profitability for EV charging solutions.",
    pricingObjective: "Achieve 25% Gross Margin with market competitiveness.",
    productCategory: "EV Charging Infrastructure",
    marketSegment: ["Commercial", "Industrial", "Residential"],
    geographicMarket: ["India", "USA", "Europe", "Australia"],
    pricingStrategyType: "Value-Based Pricing",
    lifecycleStage: "Commercial Validation",
    priority: "High",

    // Section 2: Cost Analysis
    materialCost: 18500, // ₹ 18,500.00
    manufacturingCost: 7200, // ₹ 7,200.00
    logisticsCost: 2300, // ₹ 2,300.00
    marketingCost: 3000, // ₹ 3,000.00
    salesCost: 2800, // ₹ 2,800.00
    overheadCost: 3100, // ₹ 3,100.00
    totalCost: 36900, // ₹ 36,900.00 (Calculated)
    targetMargin: 25, // 25%
    breakevenPrice: 49200, // ₹ 49,200.00 (Calculated)
    costCompetitivenessScore: 84,

    // Section 3: Market & Competitor Pricing
    marketAveragePrice: 56500, // ₹ 56,500.00
    lowestCompetitorPrice: 45000, // ₹ 45,000.00
    highestCompetitorPrice: 72000, // ₹ 72,000.00
    competitorPricingMatrixFile: "competitor_matrix.pdf",
    customerWillingnessToPay: 60000, // ₹ 60,000.00
    priceElasticity: "Moderately Elastic",
    competitivePricingScore: 82,

    // Section 4: Pricing Model
    revenueModel: "Product Sales",
    pricingMethod: "Tiered Pricing",
    sellingPrice: 59900, // ₹ 59,900.00
    discountPolicy: "Volume & Early Payment",
    promotionalPricing: "Launch Offer 5%",
    channelPricing: "Differentiated by Channel",
    franchiseDealerPricing: "12% Margin",
    pricingReadinessScore: 85,

    // Section 5: Financial Impact
    revenueForecast: 268000000, // ₹ 26,80,00,000 (₹ 26.8 Cr)
    grossMargin: 25.4, // 25.4%
    netMargin: 18.7, // 18.7%
    roi: 31.2, // 31.2%
    contributionMargin: 150800000, // ₹ 15,08,00,000
    paybackPeriod: 18, // 18 Months
    financialScore: 87,

    // Section 6: Risk Assessment
    pricingRisks: "Market price sensitivity",
    competitiveRisks: "Aggressive competitor pricing",
    regulatoryRisks: "Import duty & compliance changes",
    customerAcceptanceRisk: "Medium - Price sensitivity",
    mitigationPlan: "Value communication, bundled offers, cost optimization",
    riskScore: 76,

    // Section 7: AI Pricing Intelligence
    aiPriceOptimization: "Recommended price ₹ 59,900",
    aiDemandForecast: "Strong demand, 24% CAGR",
    aiElasticityAnalysis: "Price elasticity -0.92",
    aiRevenuePrediction: "₹ 28,40,00,000 in Year 1",
    aiDiscountRecommendation: "Optimal discount 3-5%",
    aiCompetitiveInsights: "Price positioned above average with high value perception",
    aiPricingScore: 91,

    // Section 8: Summary & Recommendation
    recommendation: "Approve Pricing Strategy",

    // Section 10: Review & Approval Matrix
    approvals: [
      { role: "Pricing Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "Detailed cost analysis & value pricing validated." },
      { role: "Finance Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024", comments: "25.4% gross margin and 18-month payback approved." },
      { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "Tiered pricing aligns with sales channel targets." },
      { role: "Marketing Manager", user: "Sneha Iyer", status: "Approved", date: "11 May 2024", comments: "5% launch promotional pricing approved." },
      { role: "Product Manager", user: "Ankit Verma", status: "Pending", date: "In Review", comments: "BOM cost optimization under review." },
      { role: "BD Manager", user: "Arjun Patel", status: "Pending", date: "In Review", comments: "Channel partner margin breakdown review." },
      { role: "COO", user: "Rakesh Patel", status: "Pending", date: "Awaiting", comments: "" },
      { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Excellent financial modeling (86/100 Readiness, ₹59,900 Selling Price, 25.4% Margin, ₹26.8 Cr Forecast). Approved for GTM.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Cost_Sheet.xlsx", type: "Excel Spreadsheet", size: "3.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Competitor_Pricing.pdf", type: "PDF Document", size: "4.1 MB", date: "16 May 2024", uploader: "Vikram Singh" },
    { id: "3", name: "Financial_Model.xlsx", type: "Excel Spreadsheet", size: "5.8 MB", date: "15 May 2024", uploader: "Neha Reddy" },
    { id: "4", name: "Pricing_Calculator.xlsx", type: "Excel Spreadsheet", size: "2.8 MB", date: "14 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Approval_Docs.pdf", type: "PDF Document", size: "1.9 MB", date: "13 May 2024", uploader: "Sneha Iyer" },
    { id: "6", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "13.6 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Selling Price (₹59,900) and Total Cost structure (₹36,900)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Reddy", action: "Uploaded Financial_Model.xlsx with 25.4% margin calculation", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Pricing Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Sneha Iyer", action: "Marketing Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:20 AM", user: "Rahul Sharma", action: "Pricing Strategy Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Pricing Readiness Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      cost: 0.2,
      competitive: 0.2,
      financial: 0.25,
      risk: 0.15,
      ai: 0.2,
    };

    const weighted =
      formData.costCompetitivenessScore * weights.cost +
      formData.competitivePricingScore * weights.competitive +
      formData.financialScore * weights.financial +
      formData.riskScore * weights.risk +
      formData.aiPricingScore * weights.ai;

    return Math.round(weighted);
  }, [formData.costCompetitivenessScore, formData.competitivePricingScore, formData.financialScore, formData.riskScore, formData.aiPricingScore]);

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
      user: formData.pricingManager,
      action: "Saved draft of Pricing Strategy project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Pricing Strategy draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.pricingProject.trim()) errors.pricingProject = "Pricing Project is required";
    if (!formData.pricingNumber.trim()) errors.pricingNumber = "Pricing Number is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.pricingObjective.trim()) errors.pricingObjective = "Pricing Objective is required";
    if (!formData.sellingPrice) errors.sellingPrice = "Selling Price is required";
    if (!formData.discountPolicy.trim()) errors.discountPolicy = "Discount Policy is required";

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
      user: formData.pricingManager,
      action: "Submitted Pricing Strategy for Executive Review Board",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Pricing Strategy submitted for executive review.");
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
      uploader: formData.pricingManager,
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
      title="Pricing Strategy Development"
      breadcrumb="Development > Business Development > Pricing Strategy Development"
      description="Govern product & service cost structures, competitor price benchmarking, pricing models, margin optimization, financial modeling, and AI pricing intelligence."
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
                <Tag className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.pricingProject}</h1>
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
                  Pricing ID: <span className="font-mono font-bold text-foreground">{formData.pricingId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.pricingNumber}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Pricing Strategy link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Pricing Strategy PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Product Version <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-primary block truncate mt-0.5">{formData.productVersion}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Business Unit <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.businessUnit}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Pricing Manager <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.pricingManager}</span>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <ScoreGauge label="Overall Pricing Readiness" score={computedOverallScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Cost Score" score={formData.costCompetitivenessScore} sub="Good" size="normal" />
          <ScoreGauge label="Competitive Score" score={formData.competitivePricingScore} sub="Good" size="normal" />
          <ScoreGauge label="Financial Score" score={formData.financialScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Risk Score" score={formData.riskScore} sub="Fair" size="normal" />
          <ScoreGauge label="AI Pricing Score" score={formData.aiPricingScore} sub="Excellent" size="normal" />
        </div>

        {/* Main Form Canvas */}
        <div className="w-full space-y-6">

            {/* Pricing Overview */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Pricing Overview
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Strategy & Scope</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <span>Pricing Strategy Type</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.pricingStrategyType}
                    onChange={(e) => updateField("pricingStrategyType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {[
                      "Cost-Plus Pricing",
                      "Competitive Pricing",
                      "Value-Based Pricing",
                      "Penetration Pricing",
                      "Premium Pricing",
                      "Dynamic Pricing",
                      "Subscription Pricing",
                      "Freemium Pricing",
                      "Usage-Based Pricing",
                      "Bundled Pricing",
                    ].map((pst) => (
                      <option key={pst} value={pst}>{pst}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Market Segment</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.marketSegment.map((seg) => (
                      <span key={seg} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {seg}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Geographic Market</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.geographicMarket.map((geo) => (
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
                    {["Pricing Research", "Cost Analysis", "Commercial Validation", "Pricing Approval", "Product Launch", "Market Optimization"].map((s) => (
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
                    <span>Pricing Objective</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.pricingObjective}
                    onChange={(e) => updateField("pricingObjective", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.pricingObjective ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.pricingObjective && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.pricingObjective}</p>}
                </div>
              </div>
            </div>

            {/* Cost Analysis */}
            <div id="sec-cost" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-emerald-600" /> Cost Analysis & Break-even Structure
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Cost Score: <strong>{formData.costCompetitivenessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Material Cost <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">₹ 18,500.00</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Manufacturing Cost <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">₹ 7,200.00</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Logistics Cost <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">₹ 2,300.00</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Marketing Cost <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">₹ 3,000.00</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Sales Cost <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">₹ 2,800.00</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Overhead Cost <MAICWBadge type="C" /></span>
                  <span className="text-sm font-bold text-foreground font-mono mt-0.5 block">₹ 3,100.00</span>
                </div>

                <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center">
                    <span className="text-[11px] font-semibold text-emerald-600 block">Total Cost <MAICWBadge type="C" /></span>
                    <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">₹ 36,900.00</span>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Target Margin (%) <MAICWBadge type="C" /></span>
                    <span className="text-base font-bold text-foreground font-mono mt-0.5 block">25 %</span>
                  </div>

                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-center">
                    <span className="text-[11px] font-semibold text-blue-600 block">Break-even Price <MAICWBadge type="C" /></span>
                    <span className="text-base font-bold text-blue-600 font-mono mt-0.5 block">₹ 49,200.00</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Market & Competitor Pricing */}
            <div id="sec-market-pricing" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-purple-600" /> Market & Competitor Pricing Benchmarking
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Competitive Score: <strong>{formData.competitivePricingScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground block">Market Average Price <MAICWBadge type="C" /></span>
                  <span className="mt-1 text-base font-bold text-foreground font-mono">₹ 56,500.00</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground block">Lowest Competitor Price <MAICWBadge type="C" /></span>
                  <span className="mt-1 text-base font-bold text-foreground font-mono">₹ 45,000.00</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                  <span className="text-[11px] font-semibold text-muted-foreground block">Highest Competitor Price <MAICWBadge type="C" /></span>
                  <span className="mt-1 text-base font-bold text-foreground font-mono">₹ 72,000.00</span>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Customer Willingness-to-Pay</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 60,000.00`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Price Elasticity</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.priceElasticity}
                    onChange={(e) => updateField("priceElasticity", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-blue-600 focus:border-primary focus:outline-none"
                  >
                    {["Highly Elastic", "Moderately Elastic", "Inelastic", "Luxury Product", "Essential Product"].map((pe) => (
                      <option key={pe} value={pe}>{pe}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => setViewingFile(formData.competitorPricingMatrixFile)}
                    className="w-full flex items-center justify-between rounded-lg border border-border bg-muted/30 p-2.5 text-xs font-semibold text-primary hover:bg-muted"
                  >
                    <span className="flex items-center gap-1.5 truncate">
                      <FileText className="h-4 w-4 text-primary" /> {formData.competitorPricingMatrixFile}
                    </span>
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Model */}
            <div id="sec-pricing-model" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-600" /> Pricing Model Architecture
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Pricing Readiness Score: <strong>{formData.pricingReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Model</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.revenueModel}
                    onChange={(e) => updateField("revenueModel", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Pricing Method</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.pricingMethod}
                    onChange={(e) => updateField("pricingMethod", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {[
                      "Fixed Price",
                      "Tiered Pricing",
                      "Volume Pricing",
                      "Geographic Pricing",
                      "Channel Pricing",
                      "Contract Pricing",
                      "Promotional Pricing",
                      "Negotiated Pricing",
                    ].map((pm) => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Target Selling Price</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 59,900.00`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Discount Policy</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.discountPolicy}
                      onChange={(e) => updateField("discountPolicy", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none",
                        validationErrors.discountPolicy ? "border-rose-500" : "border-border"
                      )}
                    />
                    {validationErrors.discountPolicy && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.discountPolicy}</p>}
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Promotional Pricing</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.promotionalPricing}
                      onChange={(e) => updateField("promotionalPricing", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Impact */}
            <div id="sec-financial" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> Financial Impact & Margins
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Financial Score: <strong>{formData.financialScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Revenue Forecast <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">₹ 26.8 Cr</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Gross Margin (%) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">25.4 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Net Margin (%) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">18.7 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">ROI (%) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">31.2 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Contribution Margin <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">₹ 15.08 Cr</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Payback Period <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-indigo-600 font-mono mt-0.5 block">18 Months</span>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div id="sec-risk" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Assessment & Sensitivity Analysis
                </h3>
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  Risk Score: <strong>{formData.riskScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Pricing Risks</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.pricingRisks}
                    onChange={(e) => updateField("pricingRisks", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Competitive Risks</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.competitiveRisks}
                    onChange={(e) => updateField("competitiveRisks", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Mitigation Plan</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.mitigationPlan}
                    onChange={(e) => updateField("mitigationPlan", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> Pricing Summary & Executive Strategic Decision
                </h3>
                <span className="text-xs font-bold text-emerald-600">Pricing Rating: {computedOverallScore}/100 (Tier 1)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                  <div className="font-bold text-foreground flex items-center justify-between">
                    <span>Executive Commercial Pricing Status</span>
                    <span className="text-emerald-600 font-bold">Optimized & Validated</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Tiered SaaS + hardware pricing model validated with 26.4% gross margin and ₹26.8 Cr annual projected revenue.
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
                      "Approve Pricing Strategy",
                      "Conduct Price Sensitivity Analysis",
                      "Optimize Tiered Packaging",
                      "Revise Partner Margins",
                      "Proceed to Revenue Operations",
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
                  <FileText className="h-4 w-4 text-primary" /> Pricing Strategy Attachments & Artifacts
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

            {/* Review & Approval */}
            <div id="sec-review-approval" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Governance & Executive Review Matrix
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Pricing Strategy Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.pricingProject}</h2>
                <p className="text-xs text-muted-foreground">
                  Pricing ID: {formData.pricingId} · Number: {formData.pricingNumber} · Manager: {formData.pricingManager}
                </p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Overall Pricing Readiness</span>
                <span className="text-lg font-bold text-emerald-600">{computedOverallScore} / 100</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Target Selling Price</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 59,900.00</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Gross Margin</span>
                <span className="text-lg font-bold text-foreground font-mono">25.4 %</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Cost Breakdown & Break-even Structure</h4>
                <p className="text-muted-foreground"><strong>Total Cost:</strong> ₹ 36,900.00 | <strong>Break-even Price:</strong> ₹ 49,200.00 | <strong>Target Margin:</strong> 25%</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Market & Competitor Benchmarking</h4>
                <p className="text-muted-foreground"><strong>Market Avg:</strong> ₹ 56,500 | <strong>Range:</strong> ₹ 45,000 - ₹ 72,000 | <strong>Customer Willingness-to-Pay:</strong> ₹ 60,000</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Financial Impact & Revenue Forecast</h4>
                <p className="text-muted-foreground"><strong>Revenue Forecast:</strong> ₹ 26.8 Cr | <strong>Net Margin:</strong> 18.7% | <strong>Payback:</strong> 18 Months | <strong>ROI:</strong> 31.2%</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Pricing Intelligence Workbench</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Neural Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Pricing Score</span>
                <span>91 / 100 (Optimal Price Alignment)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Selling price of ₹ 59,900 achieves maximum gross profit while maintaining competitive positioning against market average of ₹ 56,500.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Elasticity & Demand Analytics
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Price elasticity is -0.92 (moderately elastic). A price increase of up to 7% will not impair market demand volume.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Margin & Discount Optimization
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Recommend capping early bird promotional discounts at 5% to preserve 25.4% gross margin targets.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Mitigation Recommendations
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor raw material cost volatility. Value-add software telemetry bundling offsets hardware price sensitivity.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Pricing Strategy File
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
                  placeholder="e.g. Pricing_Sensitivity_Model.xlsx"
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Pricing Strategy repository.
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

export default PricingStrategyDevelopmentPage;
