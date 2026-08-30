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
  Handshake,
  Star,
  CheckSquare,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/partnership-development",
)({
  head: () => ({ meta: [{ title: "Partnership Development · Magnertia ERP" }] }),
  component: PartnershipDevelopmentPage,
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

function PartnershipDevelopmentPage() {
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

  // Form State according to Partnership Development reference UI image
  const [formData, setFormData] = useState({
    partnershipId: "PD-2024-00056",
    formCode: "PDF-2024-25",
    partnershipProject: "AI Technology Collaboration",
    partnershipNumber: "PDN-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    businessUnit: "EV Solutions",
    partnerOrganization: "TechNova Systems Pvt. Ltd.",
    partnershipManager: "Rahul Sharma",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",
    workflowStage: "Due Diligence",

    // Section 1: Partnership Overview
    businessObjective: "Expand technology capabilities and enter new markets",
    partnershipObjective: "Co-develop AI-based solutions and joint market expansion",
    partnershipType: "Technology Partnership",
    industry: "Technology",
    geographicCoverage: ["India", "USA", "Europe"],
    strategicPriority: "High",
    lifecycleStage: "Due Diligence",
    priority: "High",

    // Section 2: Partner Profile
    organizationName: "TechNova Systems Pvt. Ltd.",
    organizationType: "Private Limited",
    businessDomain: ["AI & ML Solutions", "Cloud Services", "IoT Platforms"],
    yearsInBusiness: 12,
    annualRevenue: 2500000000, // ₹ 250,00,00,000 (₹ 250 Cr)
    employeeStrength: 850,
    globalPresence: ["India", "USA", "Germany", "Singapore"],
    partnerCapabilityScore: 88,

    // Section 3: Partnership Evaluation
    strategicFit: "Excellent",
    technologyCapability: "Excellent",
    commercialCapability: "Very Good",
    operationalCapability: "Very Good",
    innovationCapability: "Excellent",
    esgCompliance: "Good",
    dueDiligenceStatus: true,
    evaluationScore: 86,

    // Section 4: Commercial & Legal Planning
    partnershipModel: "Revenue Sharing",
    revenueSharingModel: "Revenue Percentage",
    commercialTerms: "15% revenue share for 5 years with mutual exclusivity in target markets",
    investmentCommitment: 500000000, // ₹ 50,00,00,000 (₹ 50 Cr)
    ndaSigned: true,
    mouAgreementFile: "MoU_TechNova.pdf",
    legalReviewStatus: true,
    commercialScore: 84,

    // Section 5: Operational Integration
    integrationPlan: "API-based integration, joint development environment and data sharing framework.",
    resourceAllocation: "5 members from each organization",
    jointProjectPlan: "PRJ-2024-015 (AI Platform Co-Dev)",
    slaDefined: true,
    kpiAgreement: true,
    governanceCommittee: ["Rahul Sharma", "Anita Verma", "John Miller"],
    operationalReadinessScore: 82,

    // Section 6: Risk & Compliance
    strategicRisks: "Market changes, partner dependency",
    commercialRisks: "Revenue fluctuations, cost overruns",
    operationalRisks: "Resource unavailability, delays",
    legalRisks: "IPR disputes, contract violations",
    riskMitigationPlan: "Defined in risk register with quarterly review",
    complianceStatus: true,
    riskScore: 76,

    // Section 7: Performance Management
    revenueContribution: 250000000, // ₹ 25,00,00,000 (₹ 25 Cr)
    businessGrowth: 18.5, // 18.5%
    projectSuccessRate: 92, // 92%
    slaAchievement: 95, // 95%
    partnerSatisfaction: 4.6, // 4.6/5
    strategicValueScore: 87, // 87/100
    performanceScore: 85,

    // Section 8: AI Partnership Intelligence
    aiPartnerSuitability: "High suitability with 88% match",
    aiSynergyAnalysis: "Strong synergy in AI and Cloud",
    aiRiskPrediction: "Medium risk due to market volatility",
    aiRevenueOpportunity: "Opportunity of ₹ 120 Cr in 3 years",
    aiCollaborationRecommendation: "Proceed with phased collaboration",
    aiExpansionStrategy: "Expand to EU market in phase 2",
    aiPartnershipScore: 89,

    // Section 9: Partnership Summary & Recommendation
    recommendation: "Approve Partnership",

    // Section 11: Review & Approval Matrix
    approvals: [
      { role: "Partnership Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "12-year proven technology track record & 88% capability score." },
      { role: "BD Manager", user: "Ankit Verma", status: "Approved", date: "09 May 2024", comments: "Target market expansion strategy validated." },
      { role: "Finance Manager", user: "Vikas Mehta", status: "Approved", date: "10 May 2024", comments: "₹50 Cr investment commitment & 15% revenue share approved." },
      { role: "Legal Manager", user: "Neha Singh", status: "Approved", date: "11 May 2024", comments: "MoU draft & IPR protection clauses verified." },
      { role: "Operations Manager", user: "Arjun Patel", status: "Pending", date: "In Review", comments: "Joint engineering resource allocation under review." },
      { role: "Strategy Head", user: "Vineet Malhotra", status: "Pending", date: "In Review", comments: "Phase 2 EU market expansion plan review." },
      { role: "COO", user: "Rajat Verma", status: "Pending", date: "Awaiting", comments: "" },
      { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
    ],
    userDecision: "Approved",
    userReviewComments: "Excellent strategic alignment (85/100 Overall Score, ₹120 Cr Revenue Potential, 92% AI Match). Approved for MoU Signing.",
    userApprovalDate: "2024-05-17",
  });

  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Partnership_Proposal.pdf", type: "PDF Document", size: "4.2 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Business_Case.pdf", type: "PDF Document", size: "5.1 MB", date: "16 May 2024", uploader: "Ankit Verma" },
    { id: "3", name: "NDA_TechNova.pdf", type: "PDF Document", size: "2.1 MB", date: "16 May 2024", uploader: "Neha Singh" },
    { id: "4", name: "MoU_TechNova.pdf", type: "PDF Document", size: "3.8 MB", date: "15 May 2024", uploader: "Neha Singh" },
    { id: "5", name: "Due_Diligence_Report.pdf", type: "PDF Document", size: "6.3 MB", date: "14 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Financial_Assessment.pdf", type: "PDF Document", size: "4.7 MB", date: "13 May 2024", uploader: "Vikas Mehta" },
    { id: "7", name: "Integration_Plan.pdf", type: "PDF Document", size: "3.4 MB", date: "12 May 2024", uploader: "Arjun Patel" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Revenue Opportunity (₹120 Cr) and AI Partnership Score (89/100)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Singh", action: "Uploaded MoU_TechNova.pdf and NDA_TechNova.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Partnership Score (89/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Vikas Mehta", action: "Finance Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:15 AM", user: "Rahul Sharma", action: "Partnership Development Project Initialized - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Partnership Readiness Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      capability: 0.2,
      evaluation: 0.2,
      commercial: 0.2,
      operational: 0.15,
      risk: 0.1,
      performance: 0.05,
      ai: 0.1,
    };

    const weighted =
      formData.partnerCapabilityScore * weights.capability +
      formData.evaluationScore * weights.evaluation +
      formData.commercialScore * weights.commercial +
      formData.operationalReadinessScore * weights.operational +
      formData.riskScore * weights.risk +
      formData.performanceScore * weights.performance +
      formData.aiPartnershipScore * weights.ai;

    return Math.round(weighted);
  }, [formData.partnerCapabilityScore, formData.evaluationScore, formData.commercialScore, formData.operationalReadinessScore, formData.riskScore, formData.performanceScore, formData.aiPartnershipScore]);

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
      user: formData.partnershipManager,
      action: "Saved draft of Partnership Development project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Partnership draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.partnershipProject.trim()) errors.partnershipProject = "Partnership Project is required";
    if (!formData.partnershipNumber.trim()) errors.partnershipNumber = "Partnership Number is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.organizationName.trim()) errors.organizationName = "Organization Name is required";

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
    updateField("lastModifiedDate", formattedDate);

    const newLog = {
      id: `a-${Date.now()}`,
      date: formattedDate,
      time: formattedTime,
      user: formData.partnershipManager,
      action: "Submitted Partnership Strategy for Executive Review Board",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Partnership Strategy submitted for executive review.");
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
      uploader: formData.partnershipManager,
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
      title="Partnership Development"
      breadcrumb="Development > Business Development > Partnership Development"
      description="Govern strategic partnership identification, partner evaluation, commercial planning, operational integration, risk compliance, and AI partnership intelligence."
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
                <Handshake className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.partnershipProject}</h1>
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
                  Partnership ID: <span className="font-mono font-bold text-foreground">{formData.partnershipId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.partnershipNumber}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Partnership Strategy link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Partnership PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Partner Organization <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-primary block truncate mt-0.5">{formData.partnerOrganization}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                Partnership Manager <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.partnershipManager}</span>
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
          <ScoreGauge label="Capability Score" score={formData.partnerCapabilityScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Evaluation Score" score={formData.evaluationScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Commercial Score" score={formData.commercialScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Operations Score" score={formData.operationalReadinessScore} sub="Good" size="normal" />
          <ScoreGauge label="Risk Score" score={formData.riskScore} sub="Fair" size="normal" />
          <ScoreGauge label="Performance Score" score={formData.performanceScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Partnership Score" score={formData.aiPartnershipScore} sub="Excellent" size="normal" />
        </div>

        {/* Main Form Canvas */}
        <div className="w-full space-y-6">

            {/* Partnership Overview */}
            <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> Partnership Overview
                </h3>
                <span className="text-xs text-muted-foreground font-medium">Scope & Objectives</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Partnership Type</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.partnershipType}
                    onChange={(e) => updateField("partnershipType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {[
                      "Strategic Alliance",
                      "Technology Partnership",
                      "OEM Partnership",
                      "Channel Partnership",
                      "Distribution Partnership",
                      "Franchise Partnership",
                      "Joint Venture",
                      "Research Collaboration",
                      "Government Partnership",
                      "Academic Partnership",
                      "Investment Partnership",
                      "Supply Chain Partnership",
                    ].map((pt) => (
                      <option key={pt} value={pt}>{pt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Industry</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
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
                    <span>Strategic Priority</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.strategicPriority}
                    onChange={(e) => updateField("strategicPriority", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-rose-600 focus:border-primary focus:outline-none"
                  >
                    {["Low", "Medium", "High", "Critical"].map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
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
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                  >
                    {["Partner Identification", "Evaluation", "Due Diligence", "Negotiation", "Agreement", "Onboarding", "Active Partnership", "Renewal", "Exit"].map((s) => (
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
                    <span>Partnership Objective</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.partnershipObjective}
                    onChange={(e) => updateField("partnershipObjective", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                      validationErrors.partnershipObjective ? "border-rose-500" : "border-border"
                    )}
                  />
                  {validationErrors.partnershipObjective && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.partnershipObjective}</p>}
                </div>
              </div>
            </div>

            {/* Partner Profile */}
            <div id="sec-partner-profile" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" /> Partner Organization Profile
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Capability Score: <strong>{formData.partnerCapabilityScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Organization Name</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.organizationName}
                    onChange={(e) => updateField("organizationName", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Organization Type</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => updateField("organizationType", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Corporate", "Startup", "MSME", "Government Agency", "PSU", "University", "Research Institution", "NGO", "Investor", "OEM", "System Integrator", "Private Limited"].map((ot) => (
                      <option key={ot} value={ot}>{ot}</option>
                    ))}
                  </select>
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

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Business Domain</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.businessDomain.map((bd) => (
                      <span key={bd} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 text-[11px] font-bold text-blue-600">
                        {bd}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Annual Revenue</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 250 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Employee Strength</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`${formData.employeeStrength} Employees`}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Global Presence</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.globalPresence.map((gp) => (
                      <span key={gp} className="rounded-md bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 text-[11px] font-bold text-purple-600">
                        {gp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Partnership Evaluation */}
            <div id="sec-partner-evaluation" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Star className="h-4 w-4 text-purple-600" /> Partnership Evaluation & Due Diligence
                </h3>
                <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                  Evaluation Score: <strong>{formData.evaluationScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Strategic Fit <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-emerald-600 block mt-0.5">{formData.strategicFit}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Technology Capability <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-emerald-600 block mt-0.5">{formData.technologyCapability}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Commercial Capability <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-blue-600 block mt-0.5">{formData.commercialCapability}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Operational Capability <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-blue-600 block mt-0.5">{formData.operationalCapability}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Innovation Capability <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-emerald-600 block mt-0.5">{formData.innovationCapability}</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">ESG Compliance <MAICWBadge type="M" /></span>
                  <span className="text-xs font-bold text-foreground block mt-0.5">{formData.esgCompliance}</span>
                </div>

                <div className="sm:col-span-3 flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-foreground">Due Diligence Completed & Verified</span>
                </div>
              </div>
            </div>

            {/* Commercial & Legal Planning */}
            <div id="sec-commercial-legal" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> Commercial & Legal Planning
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Commercial Score: <strong>{formData.commercialScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Partnership Model</span> <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.partnershipModel}
                    onChange={(e) => updateField("partnershipModel", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Revenue Sharing", "Profit Sharing", "Joint Venture", "Licensing", "White Label", "Co-Development", "Co-Marketing", "Referral Partnership", "Reseller Agreement", "Strategic Alliance"].map((pm) => (
                      <option key={pm} value={pm}>{pm}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Revenue Sharing Model</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.revenueSharingModel}
                    onChange={(e) => updateField("revenueSharingModel", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Investment Commitment</span> <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={`₹ 50.00 Cr`}
                    readOnly
                    className="w-full rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Commercial Terms</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.commercialTerms}
                    onChange={(e) => updateField("commercialTerms", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">NDA Signed</span>
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2.5 text-xs sm:col-span-2">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-primary" /> MoU / Agreement File
                    </span>
                    <button type="button" onClick={() => setViewingFile(formData.mouAgreementFile)} className="font-bold text-primary hover:underline flex items-center gap-1 font-mono">
                      {formData.mouAgreementFile} <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Operational Integration */}
            <div id="sec-operational-integration" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-600" /> Operational Integration & Governance
                </h3>
                <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                  Operational Score: <strong>{formData.operationalReadinessScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Integration Plan</span> <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.integrationPlan}
                    onChange={(e) => updateField("integrationPlan", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Resource Allocation</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.resourceAllocation}
                    onChange={(e) => updateField("resourceAllocation", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Joint Project Plan</span> <MAICWBadge type="I" />
                  </label>
                  <input
                    type="text"
                    value={formData.jointProjectPlan}
                    onChange={(e) => updateField("jointProjectPlan", e.target.value)}
                    className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-primary font-mono focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">Service Level Agreement (SLA) Defined</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-bold text-foreground">KPI Agreement Signed</span>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Governance Committee Members</span> <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.governanceCommittee.map((gc) => (
                      <span key={gc} className="rounded-md bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 text-xs font-bold text-blue-600">
                        {gc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk & Compliance */}
            <div id="sec-risk-compliance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk & Compliance Management
                </h3>
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  Risk Score: <strong>{formData.riskScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Strategic Risks</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.strategicRisks}
                    onChange={(e) => updateField("strategicRisks", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                    <span>Commercial Risks</span> <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.commercialRisks}
                    onChange={(e) => updateField("commercialRisks", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
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

            {/* Performance Management */}
            <div id="sec-performance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-emerald-600" /> Performance Management Metrics
                </h3>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  Performance Score: <strong>{formData.performanceScore}/100</strong> <MAICWBadge type="C" />
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Revenue Contribution <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">₹ 25.00 Cr</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Business Growth (%) <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">18.5 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Project Success Rate <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">92 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">SLA Achievement <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">95 %</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Partner Satisfaction <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-foreground font-mono mt-0.5 block">4.6 / 5</span>
                </div>

                <div className="rounded-lg border border-border bg-muted/20 p-2.5">
                  <span className="text-[11px] text-muted-foreground font-medium block">Strategic Value Score <MAICWBadge type="C" /></span>
                  <span className="text-base font-bold text-purple-600 font-mono mt-0.5 block">87 / 100</span>
                </div>
              </div>
            </div>

            {/* Partnership Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-emerald-600" /> Partnership Summary & Strategic Decision
                </h3>
                <span className="text-xs font-bold text-emerald-600">Partnership Rating: {computedOverallScore}/100 (Tier 1)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                  <div className="font-bold text-foreground flex items-center justify-between">
                    <span>Executive Partnership Status</span>
                    <span className="text-emerald-600 font-bold">Approved Strategic JV</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    OEM co-development agreement finalized with Tata Power EV Charging ecosystem, targeting ₹120 Cr 3-year revenue and 240% ROI.
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
                      "Approve Partnership",
                      "Conduct Joint Technical Pilot",
                      "Refine Revenue Share Terms",
                      "Complete Legal Governance Review",
                      "Proceed to Contract Execution",
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
                  <FileText className="h-4 w-4 text-primary" /> Partnership Attachments & Artifacts
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
                  <ShieldCheck className="h-4 w-4 text-primary" /> Governance & Executive Review Board Matrix
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Partnership Development Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.partnershipProject}</h2>
                <p className="text-xs text-muted-foreground">
                  Partnership ID: {formData.partnershipId} · Number: {formData.partnershipNumber} · Manager: {formData.partnershipManager}
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
                <span className="text-muted-foreground font-medium block">Revenue Opportunity</span>
                <span className="text-lg font-bold text-emerald-600 font-mono">₹ 120.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Investment</span>
                <span className="text-lg font-bold text-foreground font-mono">₹ 50.00 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Partner Profile & Strategic Evaluation</h4>
                <p className="text-muted-foreground"><strong>Partner:</strong> TechNova Systems Pvt. Ltd. | <strong>Domain:</strong> AI & ML, Cloud, IoT</p>
                <p className="text-muted-foreground mt-1"><strong>Strategic Fit:</strong> Excellent | <strong>Capability Score:</strong> 88/100 | <strong>Evaluation Score:</strong> 86/100</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Commercial & Governance Structure</h4>
                <p className="text-muted-foreground"><strong>Model:</strong> Revenue Sharing (15% share for 5 years) | <strong>Investment:</strong> ₹ 50 Cr</p>
                <p className="text-muted-foreground mt-1"><strong>Governance:</strong> Joint committee established (Rahul Sharma, Anita Verma, John Miller).</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Performance Metrics & AI Forecast</h4>
                <p className="text-muted-foreground"><strong>Project Success Rate:</strong> 92% | <strong>SLA Achievement:</strong> 95% | <strong>Satisfaction:</strong> 4.6/5</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Partnership Intelligence Workbench</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Neural Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Partnership Score</span>
                <span>89 / 100 (Exceptional Synergy Match)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                TechNova Systems shows an 88% capability match and 92% historical project success rate for AI co-development.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <Handshake className="h-4 w-4 text-emerald-600" /> Technology & Market Synergy
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Combining Magnertia hardware with TechNova AI software expands addressable market by ₹120 Cr across India, US & Europe.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Commercial Term Benchmarking
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  15% revenue share is within the optimal 12-18% industry benchmark for co-developed SaaS telemetry solutions.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Mitigation & Governance
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Establish quarterly IPR and data boundary audits to prevent contract friction during Phase 2 European expansion.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Partnership Document
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
                  placeholder="e.g. Joint_Development_SLA.pdf"
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Partnership Development repository.
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
