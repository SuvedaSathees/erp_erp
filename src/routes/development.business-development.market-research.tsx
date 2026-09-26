import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { marketResearchService } from "@/services/marketResearchService";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/market-research",
)({
  head: () => ({ meta: [{ title: "Market Research · Magnertia ERP" }] }),
  component: MarketResearchPage,
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

function MarketResearchPage() {
  const queryClient = useQueryClient();
  const { data: loadedRecord, isLoading: isRecordLoading } = useQuery({
    queryKey: ["market-research"],
    queryFn: marketResearchService.fetchRecord,
  });

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

  // Form State according to Market Research reference image
  const [formData, setFormData] = useState<any>(null);

  React.useEffect(() => {
    if (loadedRecord && !formData) {
      setFormData(loadedRecord);
    }
  }, [loadedRecord, formData]);

  const saveDraftMutation = useMutation({
    mutationFn: (input: any) => marketResearchService.saveDraft(input, loadedRecord?.id),
    onSuccess: (updated: any) => {
      queryClient.setQueryData(["market-research"], updated);
      toast.success("Draft saved successfully.");
    },
    onError: () => toast.error("Failed to save draft."),
  });


  // Attachments State
  const [attachments, setAttachments] = useState([
    { id: "1", name: "Market_Research_Report.pdf", type: "PDF Document", size: "4.2 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Industry_Analysis.pdf", type: "PDF Document", size: "3.8 MB", date: "16 May 2024", uploader: "Neha Reddy" },
    { id: "3", name: "Competitor_Analysis.pdf", type: "PDF Document", size: "5.1 MB", date: "15 May 2024", uploader: "Vikram Singh" },
    { id: "4", name: "Customer_Survey_Results.xlsx", type: "Excel Spreadsheet", size: "2.4 MB", date: "14 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Pricing_Benchmark.pdf", type: "PDF Document", size: "1.9 MB", date: "14 May 2024", uploader: "Sneha Iyer" },
    { id: "6", name: "Market_Forecast.pdf", type: "PDF Document", size: "6.7 MB", date: "13 May 2024", uploader: "Neha Reddy" },
    { id: "7", name: "SWOT_Analysis.pdf", type: "PDF Document", size: "2.5 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "8", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "15.8 MB", date: "11 May 2024", uploader: "Rahul Sharma" },
  ]);

  // Activity History State
  const [activityHistory, setActivityHistory] = useState([
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated TAM, SAM, SOM estimates and Market Growth Rate", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Reddy", action: "Uploaded Industry_Analysis.pdf with 5-year forecast", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Intelligence Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Ankit Verma", action: "Product Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:20 AM", user: "Rahul Sharma", action: "Market Research Project Created - Version 1.0", status: "Created" },
  ]);

  // Calculate Overall Research Score dynamically
  const computedOverallScore = useMemo(() => {
    const weights = {
      market: 0.25,
      customer: 0.2,
      competition: 0.2,
      commercial: 0.15,
      ai: 0.2,
    };

    const weighted =
      formData.marketAttractivenessScore * weights.market +
      formData.customerResearchScore * weights.customer +
      formData.competitiveIntelligenceScore * weights.competition +
      formData.commercialViabilityScore * weights.commercial +
      formData.aiIntelligenceScore * weights.ai;

    return Math.round(weighted);
  }, [formData.marketAttractivenessScore, formData.customerResearchScore, formData.competitiveIntelligenceScore, formData.commercialViabilityScore, formData.aiIntelligenceScore]);

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
      user: formData.researchOwner,
      action: "Saved draft of Market Research project",
      status: "Draft Saved",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Draft Saved", "Market Research draft saved successfully.");
  };

  // Submit for Approval Action
  const handleSubmitApproval = () => {
    const errors: Record<string, string> = {};

    if (!formData.researchProject.trim()) errors.researchProject = "Research Project is required";
    if (!formData.businessObjective.trim()) errors.businessObjective = "Business Objective is required";
    if (!formData.researchObjective.trim()) errors.researchObjective = "Research Objective is required";
    if (!formData.customerNeeds.trim()) errors.customerNeeds = "Customer Needs is required";
    if (!formData.competitiveAdvantages.trim()) errors.competitiveAdvantages = "Competitive Advantages is required";
    if (!formData.pricingBenchmark.trim()) errors.pricingBenchmark = "Pricing Benchmark is required";

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
      user: formData.researchOwner,
      action: "Submitted Market Research for Executive Board Review",
      status: "Submitted",
    };
    setActivityHistory((prev) => [newLog, ...prev]);

    showToast("success", "Submitted Successfully", "Market Research submitted for executive approval.");
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
      uploader: formData.researchOwner,
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

  if (isRecordLoading || !formData) {
    return (
      <AppShell title="Market Research" breadcrumb={[{ label: "Business Development" }, { label: "Market Research" }]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Market Research"
      breadcrumb="Development > Business Development > Market Research"
      description="Govern market sizing, TAM/SAM/SOM analysis, customer intelligence, competitive benchmarking, commercial viability, and AI market insights."
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
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.researchProject}</h1>
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
                  MR ID: <span className="font-mono font-bold text-foreground">{formData.mrId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.researchNumber}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Market Research link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Market Research PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Research Owner <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.researchOwner}</span>
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <ScoreGauge label="Overall Research Score" score={computedOverallScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Market Attractiveness" score={formData.marketAttractivenessScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Customer Research" score={formData.customerResearchScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Competition Score" score={formData.competitiveIntelligenceScore} sub="Very Good" size="normal" />
          <ScoreGauge label="Commercial Score" score={formData.commercialViabilityScore} sub="Very Good" size="normal" />
          <ScoreGauge label="AI Intelligence Score" score={formData.aiIntelligenceScore} sub="Excellent" size="normal" />
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
          {/* Research Overview */}
          <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" /> Research Overview
                  </h3>
                  <span className="text-xs text-muted-foreground font-medium">Scope & Methodology</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                      <span>Market Category</span> <MAICWBadge type="M" />
                    </label>
                    <select
                      value={formData.marketCategory}
                      onChange={(e) => updateField("marketCategory", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                    >
                      {["B2B", "B2C", "B2G", "B2B2C", "Marketplace", "Platform", "SaaS", "Manufacturing", "Services", "Franchise"].map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Geographic Scope</span> <MAICWBadge type="M" />
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.geographicScope.map((geo) => (
                        <span key={geo} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600">
                          {geo}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Research Methodology</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.researchMethodology}
                      onChange={(e) => updateField("researchMethodology", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
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
                      {["Opportunity Identification", "Market Assessment", "Validation", "Product Planning", "Go-to-Market", "Growth", "Expansion"].map((s) => (
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
                      <span>Research Objective</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.researchObjective}
                      onChange={(e) => updateField("researchObjective", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed",
                        validationErrors.researchObjective ? "border-rose-500" : "border-border"
                      )}
                    />
                    {validationErrors.researchObjective && <p className="text-[10px] text-rose-500 mt-1">{validationErrors.researchObjective}</p>}
                  </div>
                </div>
              </div>

            {/* Market Sizing & Attractiveness */}
            <div id="sec-market" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <PieChart className="h-4 w-4 text-primary" /> Market Sizing & Attractiveness (TAM / SAM / SOM)
                  </h3>
                  <span className="text-xs font-semibold text-primary">Attractiveness: {formData.marketAttractivenessScore}/100</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">TAM (Total Addressable)</span>
                    <span className="mt-1 text-lg font-bold text-foreground font-mono">₹ {(formData.tam / 10000000).toFixed(0)} Cr</span>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">SAM (Serviceable Addressable)</span>
                    <span className="mt-1 text-lg font-bold text-foreground font-mono">₹ {(formData.sam / 10000000).toFixed(0)} Cr</span>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                    <span className="text-[11px] font-semibold text-muted-foreground block">SOM (Serviceable Obtainable)</span>
                    <span className="mt-1 text-lg font-bold text-emerald-600 font-mono">₹ {(formData.som / 10000000).toFixed(0)} Cr</span>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Market Growth Rate (CAGR)</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`${formData.marketGrowthRate}%`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-blue-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Industry Maturity</span> <MAICWBadge type="I" />
                    </label>
                    <select
                      value={formData.industryMaturity}
                      onChange={(e) => updateField("industryMaturity", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {["Emerging", "Growth", "Mature", "Consolidating"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Attractiveness Score</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`${formData.marketAttractivenessScore}%`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                    />
                  </div>
                </div>
              </div>

            {/* Customer Segments */}
            <div id="sec-customer" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-600" /> Customer Segments & Demand Analysis
                  </h3>
                  <span className="text-xs font-semibold text-indigo-600">Research Score: {formData.customerResearchScore}/100</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Target Customer Segments</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.customerSegments}
                      onChange={(e) => updateField("customerSegments", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Expected Purchase Volume</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={formData.expectedPurchaseVolume}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Customer Pain Points</span> <MAICWBadge type="M" />
                      </label>
                      <textarea
                        rows={2}
                        value={formData.customerPainPoints}
                        onChange={(e) => updateField("customerPainPoints", e.target.value)}
                        className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Customer Buying Behavior & Decision Drivers</span> <MAICWBadge type="M" />
                      </label>
                      <textarea
                        rows={2}
                        value={formData.buyingBehavior}
                        onChange={(e) => updateField("buyingBehavior", e.target.value)}
                        className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

            {/* Competitor Intelligence */}
            <div id="sec-competitor" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Target className="h-4 w-4 text-rose-600" /> Competitive Landscape & Intelligence
                  </h3>
                  <span className="text-xs font-semibold text-rose-600">Competitor Score: {formData.competitiveIntelligenceScore}/100</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Direct Competitors</span> <MAICWBadge type="M" />
                    </label>
                    <input
                      type="text"
                      value={formData.directCompetitors}
                      onChange={(e) => updateField("directCompetitors", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Market Concentration</span> <MAICWBadge type="I" />
                    </label>
                    <select
                      value={formData.marketConcentration}
                      onChange={(e) => updateField("marketConcentration", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {["Fragmented", "Moderate Concentration", "High Concentration", "Monopolistic"].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-3">
                    <div>
                      <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                        <span>Competitive Advantage & Moat</span> <MAICWBadge type="M" />
                      </label>
                      <textarea
                        rows={2}
                        value={formData.competitiveAdvantage}
                        onChange={(e) => updateField("competitiveAdvantage", e.target.value)}
                        className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              </div>

            {/* Industry & Technology Trends */}
            <div id="sec-industry-tech" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-purple-600" /> Industry & Technology Trends
                  </h3>
                  <span className="text-xs font-semibold text-purple-600">Trends Score: {formData.trendsScore}/100</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Key Technology Trends</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.technologyTrends}
                      onChange={(e) => updateField("technologyTrends", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Regulatory & Policy Drivers</span> <MAICWBadge type="M" />
                    </label>
                    <textarea
                      rows={2}
                      value={formData.regulatoryDrivers}
                      onChange={(e) => updateField("regulatoryDrivers", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

            {/* Commercial & Revenue Opportunity */}
            <div id="sec-commercial" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-emerald-600" /> Commercial & Revenue Opportunity
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600">Commercial Score: {formData.commercialViabilityScore}/100</span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Estimated Market Price</span> <MAICWBadge type="I" />
                    </label>
                    <input
                      type="text"
                      value={formData.marketPricing}
                      onChange={(e) => updateField("marketPricing", e.target.value)}
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Revenue Potential (Yr 1)</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`₹ ${(formData.revenuePotentialYear1 / 10000000).toFixed(2)} Cr`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-emerald-600 font-mono"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                      <span>Revenue Potential (Yr 3)</span> <MAICWBadge type="C" />
                    </label>
                    <input
                      type="text"
                      value={`₹ ${(formData.revenuePotentialYear3 / 10000000).toFixed(2)} Cr`}
                      readOnly
                      className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs font-bold text-foreground font-mono"
                    />
                  </div>
                </div>
            </div>

            {/* AI Market Intelligence */}
            <div id="sec-ai-intelligence" className="rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/15">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Market Intelligence
                </h3>
                <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                  AI Intelligence Score: <strong className="font-mono">91/100</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" /> AI Trend Analysis
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Strong growth in smart charging and energy management.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500" /> AI Demand Forecast
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Market to grow at 29% CAGR over next 5 years.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <Target className="h-3.5 w-3.5 text-blue-600" /> AI Competitor Insights
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Competitors investing in fast charging and network expansion.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3.5 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5">
                    <PieChart className="h-3.5 w-3.5 text-purple-600" /> AI Opportunity Mapping
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    High opportunity in commercial fleets and urban areas.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAiDrawerOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Open Interactive AI Market Intelligence Workbench
                </button>
              </div>
            </div>

            {/* Market Research Summary */}
            <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Award className="h-4 w-4 text-emerald-600" /> Market Research Summary & Strategic Decision
                  </h3>
                  <span className="text-xs font-bold text-emerald-600">Research Rating: {computedOverallScore}/100 (Tier 1)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                    <div className="font-bold text-foreground flex items-center justify-between">
                      <span>Executive Research Status</span>
                      <span className="text-emerald-600 font-bold">Comprehensive & Validated</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Market research confirmed with ₹48,500 Cr TAM, 28.5% projected CAGR, and high commercial readiness.
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
                        "Approve Market Research",
                        "Conduct Deep-Dive Primary Research",
                        "Expand Competitor Benchmarking",
                        "Validate Regional TAM & SAM",
                        "Proceed to Strategy Development",
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
                    <FileText className="h-4 w-4 text-primary" /> Market Research Attachments & Artifacts
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
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Market Research Report</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.researchProject}</h2>
                <p className="text-xs text-muted-foreground">
                  MR ID: {formData.mrId} · Number: {formData.researchNumber} · Owner: {formData.researchOwner}
                </p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Overall Research Score</span>
                <span className="text-lg font-bold text-emerald-600">{computedOverallScore}%</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Total Addressable Market (TAM)</span>
                <span className="text-lg font-bold text-foreground font-mono">₹ 48,500 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Revenue Opportunity</span>
                <span className="text-lg font-bold text-foreground font-mono">₹ 2,480 Cr</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">Executive Summary & Objectives</h4>
                <p className="text-muted-foreground"><strong>Objective:</strong> {formData.businessObjective}</p>
                <p className="text-muted-foreground mt-1"><strong>Research Scope:</strong> {formData.researchObjective}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">Market Size & Growth Projections</h4>
                <p className="text-muted-foreground"><strong>TAM:</strong> ₹ 48,500 Cr | <strong>SAM:</strong> ₹ 12,800 Cr | <strong>SOM:</strong> ₹ 2,350 Cr</p>
                <p className="text-muted-foreground mt-1"><strong>Market Growth Rate:</strong> {formData.marketGrowthRate}% CAGR (Growth Stage)</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">Customer Intelligence & Competitive Edge</h4>
                <p className="text-muted-foreground"><strong>Customer Needs:</strong> {formData.customerNeeds}</p>
                <p className="text-muted-foreground mt-1"><strong>Competitive Advantages:</strong> {formData.competitiveAdvantages}</p>
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
                  <h3 className="text-base font-bold text-foreground">AI Market Research Intelligence</h3>
                  <span className="text-xs text-muted-foreground">Magnertia Neural Advisor Engine</span>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiDrawerOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-primary">
                <span>AI Intelligence Score</span>
                <span>91% (High Market Opportunity)</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Market analysis indicates strong demand in commercial fleets, rapid EV adoption, and high revenue potential of ₹2,480 Cr.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" /> Market Growth & Demand Forecast
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Market projected to grow at 29% CAGR over next 5 years driven by fleet electrification mandates and smart grid adoption.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-600" /> Competitive Landscape Analysis
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Major competitors investing heavily in fast charging. Software telemetry and predictive uptime are key differentiators.
                </p>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-2">
                <h4 className="font-bold text-foreground flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Risk Mitigation Strategy
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  Monitor supply chain bottlenecks and grid interconnection compliance to maintain competitive lead.
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
                <Upload className="h-5 w-5 text-primary" /> Attach Market Research File
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
                  placeholder="e.g. Market_Sizing_Report.pdf"
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
                Viewing <strong>{viewingFile}</strong>. Synced with the Magnertia ERP Market Research repository.
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
