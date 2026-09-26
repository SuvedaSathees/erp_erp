import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { customerDiscoveryService } from "@/services/customerDiscoveryService";
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
  ChevronRight,
  Info,
  Building2,
  Layers,
  HelpCircle,
  Send,
  Eye,
  Save,
  X,
  Award,
  Zap,
  BarChart3,
  Check,
  Calendar,
  Search,
  DollarSign,
  Compass,
  FileSearch,
  Upload,
  Trash2,
  History,
  ArrowRight,
  Clock,
  Printer,
  Share2,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/development/business-development/customer-discovery",
)({
  head: () => ({ meta: [{ title: "Customer Discovery · Magnertia ERP" }] }),
  component: CustomerDiscoveryPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600" },
    A: { label: "A", desc: "Auto-generated / System Log", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600" },
    I: { label: "I", desc: "Input / Master Lookup", bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600" },
    C: { label: "C", desc: "Calculated Field", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600" },
    W: { label: "W", desc: "Workflow Field", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600" },
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

function ScoreGauge({ label, score, max = 100, sub }: { label: string; score: number; max?: number; sub?: string }) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const colorClass =
    score >= 90
      ? "text-emerald-500"
      : score >= 80
      ? "text-blue-600"
      : score >= 70
      ? "text-amber-500"
      : "text-rose-500";

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs text-center transition-all hover:shadow-md">
      <div className="relative grid h-14 w-14 place-items-center">
        <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-muted/20" fill="transparent" />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="8"
            className={cn("transition-all duration-1000 ease-out", colorClass)}
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * pct) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className="absolute font-display text-sm font-bold text-foreground">{score}</span>
      </div>
      <span className="mt-1.5 text-xs font-bold text-foreground truncate max-w-[120px]">{label}</span>
      {sub && <span className="text-[10px] text-muted-foreground font-medium">{sub}</span>}
    </div>
  );
}

function CustomerDiscoveryPage() {
  const queryClient = useQueryClient();
  const { data: loadedRecord, isLoading: isRecordLoading } = useQuery({
    queryKey: ["customer-discovery"],
    queryFn: customerDiscoveryService.fetchRecord,
  });

  const [showMaicwLegend, setShowMaicwLegend] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isAiWorkbenchOpen, setIsAiWorkbenchOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [viewingFile, setViewingFile] = useState<string | null>(null);

  // Form State according to MAICW specifications
  const [formData, setFormData] = useState<any>(null);

  React.useEffect(() => {
    if (loadedRecord && !formData) {
      setFormData(loadedRecord);
    }
  }, [loadedRecord, formData]);

  const saveDraftMutation = useMutation({
    mutationFn: (input: any) => customerDiscoveryService.saveDraft(input, loadedRecord?.id),
    onSuccess: (updated: any) => {
      queryClient.setQueryData(["customer-discovery"], updated);
      toast.success("Draft saved successfully.");
    },
    onError: () => toast.error("Failed to save draft."),
  });


  const [attachments, setAttachments] = useState([
    { id: "1", name: "Interview_Notes.pdf", size: "2.4 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Survey_Results.xlsx", size: "1.8 MB", date: "13 May 2024", uploader: "Neha Reddy" },
    { id: "3", name: "Observation_Report.pdf", size: "3.1 MB", date: "13 May 2024", uploader: "Vikram Singh" },
    { id: "4", name: "Persona_Canvas.pdf", size: "1.2 MB", date: "14 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "JTBD_Canvas.pdf", size: "950 KB", date: "14 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Market_Analysis.pdf", size: "4.5 MB", date: "15 May 2024", uploader: "Anil Kumar" },
    { id: "7", name: "Research_Report.pdf", size: "5.2 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "8", name: "Supporting_Documents.zip", size: "14.8 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
  ]);

  const [activityHistory, setActivityHistory] = useState([
    { id: "1", user: "Rahul Sharma", action: "Completed 28 Customer Interviews and updated JTBD canvas", date: "17 May 2024", time: "03:45 PM" },
    { id: "2", user: "Neha Reddy", action: "Consolidated 166 Survey responses into Survey_Results.xlsx", date: "16 May 2024", time: "11:20 AM" },
    { id: "3", user: "Vikram Singh", action: "Conducted 12 field observations across Bangalore & Mumbai hubs", date: "15 May 2024", time: "04:10 PM" },
    { id: "4", user: "Rahul Sharma", action: "Initiated Customer Discovery Phase & uploaded Research Dossier", date: "05 May 2024", time: "09:20 AM" },
  ]);

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveDraft = () => {
    toast.success(`Customer Discovery Draft Saved!`, {
      description: `Form ${formData.formCode} (${formData.cdId}) saved successfully.`,
    });
  };

  const handleSubmitApproval = () => {
    setFormData((prev) => ({ ...prev, workflowStatus: "Submitted" }));
    toast.success(`Customer Discovery Form Submitted for Review!`, {
      description: `Workflow stage updated to Submitted. Notification dispatched to VP Strategy.`,
    });
  };

  const handleRemoveAttachment = (id: string, name: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
    toast.success("Attachment Deleted", { description: `${name} has been removed.` });
  };

  const toggleGeoMarket = (geo: string) => {
    setFormData((prev) => {
      const exists = prev.geoMarket.includes(geo);
      const next = exists ? prev.geoMarket.filter((g) => g !== geo) : [...prev.geoMarket, geo];
      return { ...prev, geoMarket: next };
    });
  };

  if (isRecordLoading || !formData) {
    return (
      <AppShell title="Customer Discovery" breadcrumb={[{ label: "Business Development" }, { label: "Customer Discovery" }]}>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Customer Discovery"
      breadcrumb="Development > Business Development > Customer Discovery"
      description="Govern the systematic identification, research, validation, and continuous understanding of customer problems, needs, behaviors, buying patterns, and market opportunities (MAICW Classification)."
      tabs={<BusinessDevelopmentTabBar />}
    >
      <div className="space-y-6 text-foreground">
        {/* Form Header Action Strip & Top Metadata Cards */}
        <div className="relative rounded-2xl border border-border bg-card p-5 shadow-xs space-y-4">
          {/* Top Row: Icon + Title + Status + Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary font-bold shadow-inner">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-base font-bold text-foreground tracking-tight">{formData.projectTitle}</h1>
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
                  CD ID: <span className="font-mono font-bold text-foreground">{formData.cdId}</span> · Code:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.formCode}</span> · Number:{" "}
                  <span className="font-mono font-bold text-foreground">{formData.discoveryNumber}</span>
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
                  <button type="button" onClick={() => showToast("info", "Share Link", "Discovery link copied to clipboard.")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" /> Share Link
                  </button>
                  <button type="button" onClick={() => showToast("info", "Export Model", "Exporting Customer Discovery report as PDF...")} className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted text-left">
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
                Discovery Lead <MAICWBadge type="I" />
              </span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.discoveryLead}</span>
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

        {/* MAICW Legend Bar */}
        {showMaicwLegend && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-primary/10">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <HelpCircle className="h-4 w-4" /> MAICW Enterprise Form Classification Standard
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
                <span><strong className="text-foreground">Workflow:</strong> Stage approval controlled</span>
              </div>
            </div>
          </div>
        )}

        {/* Scores & Health Gauges Banner */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          <ScoreGauge label="Discovery Score" score={86} sub="Very Good" />
          <ScoreGauge label="Segment Readiness" score={formData.segmentReadinessScore} sub="Ready" />
          <ScoreGauge label="Problem Validation" score={formData.problemValidationScore} sub="High Intent" />
          <ScoreGauge label="Research Readiness" score={formData.researchReadinessScore} sub="Validated" />
          <ScoreGauge label="Buying Behaviour" score={formData.buyingBehaviourScore} sub="Favorable" />
          <ScoreGauge label="Opportunity Score" score={formData.opportunityScore} sub="High TAM" />
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs text-center transition-all hover:shadow-md">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="mt-1.5 text-xs font-bold text-foreground">Lifecycle Stage</span>
            <span className="text-[11px] font-bold text-emerald-600">{formData.lifecycleStage}</span>
          </div>
        </div>

        {/* Main Focused Form Canvas */}
        <div className="w-full space-y-6">
          {/* Discovery Overview */}
          <div id="sec-overview" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Discovery Overview
              </h3>
              <span className="text-xs font-semibold text-primary">Strategic Intent & Scope</span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 rounded-lg border border-border bg-muted/10 p-3">
              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Industry</span> <MAICWBadge type="M" />
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {["Manufacturing", "Automotive", "Electric Vehicles", "Energy", "SaaS", "Logistics & Transportation", "Healthcare", "Government", "Retail", "Education"].map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Discovery Method</span> <MAICWBadge type="M" />
                </label>
                <select
                  value={formData.discoveryMethod}
                  onChange={(e) => updateField("discoveryMethod", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {["Customer Interview", "Survey", "Focus Group", "Field Observation", "Customer Interviews & Surveys", "Ethnographic Study", "Online Research", "Customer Workshop", "Prototype Testing"].map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground mb-1">
                  <span>Lifecycle Stage</span> <MAICWBadge type="W" />
                </label>
                <select
                  value={formData.lifecycleStage}
                  onChange={(e) => updateField("lifecycleStage", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-bold text-emerald-600 focus:border-primary focus:outline-none"
                >
                  {["Discovery", "Validation", "MVP", "Product Development", "Product Launch", "Growth"].map((s) => (
                    <option key={s} value={s}>{s}</option>
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
            </div>

            <div className="space-y-3">
              <div>
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

              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Discovery Goal</span> <MAICWBadge type="M" />
                </label>
                <textarea
                  rows={2}
                  value={formData.discoveryGoal}
                  onChange={(e) => updateField("discoveryGoal", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Customer Segmentation */}
          <div id="sec-segmentation" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-indigo-600" /> Customer Segmentation
              </h3>
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                Segment Readiness Score: <strong>{formData.segmentReadinessScore}/100</strong> <MAICWBadge type="C" />
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Company Size</span> <MAICWBadge type="M" />
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) => updateField("companySize", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {["Startup", "MSME", "Mid-Market", "Enterprise", "Government"].map((cs) => (
                    <option key={cs} value={cs}>{cs}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Annual Revenue Range</span> <MAICWBadge type="M" />
                </label>
                <input
                  type="text"
                  value={formData.revenueRange}
                  onChange={(e) => updateField("revenueRange", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                  <span>Geographic Market</span> <MAICWBadge type="M" />
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {["India", "USA", "Europe", "Southeast Asia", "Middle East", "Latin America"].map((geo) => {
                    const isSelected = formData.geoMarket.includes(geo);
                    return (
                      <button
                        key={geo}
                        type="button"
                        onClick={() => toggleGeoMarket(geo)}
                        className={cn(
                          "rounded-lg px-3 py-1.5 text-xs font-bold transition-all border cursor-pointer",
                          isSelected
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                            : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {isSelected ? `✓ ${geo}` : `+ ${geo}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Customer Problem Discovery */}
          <div id="sec-problem-discovery" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-600" /> Customer Problem Discovery
              </h3>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Problem Validation Score: <strong>{formData.problemValidationScore}/100</strong> <MAICWBadge type="C" />
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Jobs-to-be-Done (JTBD)</span> <MAICWBadge type="M" />
                </label>
                <textarea
                  rows={2}
                  value={formData.jobsToBeDone}
                  onChange={(e) => updateField("jobsToBeDone", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                />
              </div>

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
                  <span>Existing Solutions</span> <MAICWBadge type="M" />
                </label>
                <textarea
                  rows={2}
                  value={formData.existingSolutions}
                  onChange={(e) => updateField("existingSolutions", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Customer Research Activities */}
          <div id="sec-research-activities" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileSearch className="h-4 w-4 text-purple-600" /> Customer Research Activities
              </h3>
              <span className="text-xs font-semibold text-purple-600 flex items-center gap-1">
                Research Readiness: <strong>{formData.researchReadinessScore}/100</strong> <MAICWBadge type="C" />
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">Interviews <MAICWBadge type="C" /></span>
                <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.interviewsConducted}</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">Surveys <MAICWBadge type="C" /></span>
                <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.surveysCompleted}</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">Focus Groups <MAICWBadge type="C" /></span>
                <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.focusGroups}</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">Observations <MAICWBadge type="C" /></span>
                <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.observationSessions}</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">Visits <MAICWBadge type="C" /></span>
                <span className="mt-1 text-lg font-bold text-foreground font-mono">{formData.customerVisits}</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                <span>Research Notes & Key Findings</span> <MAICWBadge type="M" />
              </label>
              <textarea
                rows={3}
                value={formData.researchNotes}
                onChange={(e) => updateField("researchNotes", e.target.value)}
                className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Buying Behaviour Analysis */}
          <div id="sec-buying-behaviour" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-emerald-600" /> Buying Behaviour Analysis
              </h3>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                Buying Score: <strong>{formData.buyingBehaviourScore}/100</strong> <MAICWBadge type="C" />
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Buying Trigger</span> <MAICWBadge type="M" />
                </label>
                <input
                  type="text"
                  value={formData.buyingTrigger}
                  onChange={(e) => updateField("buyingTrigger", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Budget Range</span> <MAICWBadge type="C" />
                </label>
                <input
                  type="text"
                  value={formData.budgetRange}
                  readOnly
                  className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-bold text-foreground font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                  <span>Buying Process Workflow</span> <MAICWBadge type="M" />
                </label>
                <input
                  type="text"
                  value={formData.buyingProcess}
                  onChange={(e) => updateField("buyingProcess", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Opportunity Assessment */}
          <div id="sec-opportunity" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-600" /> Opportunity Assessment
              </h3>
              <span className="text-xs font-semibold text-indigo-600 flex items-center gap-1">
                Opportunity Score: <strong>{formData.opportunityScore}/100</strong> <MAICWBadge type="C" />
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">TAM (Total Addressable) <MAICWBadge type="C" /></span>
                <span className="mt-1 text-lg font-bold text-foreground font-mono">₹ 48,000 Cr</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">SAM (Serviceable Available) <MAICWBadge type="C" /></span>
                <span className="mt-1 text-lg font-bold text-foreground font-mono">₹ 12,500 Cr</span>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3 text-center">
                <span className="text-[11px] font-semibold text-muted-foreground block">SOM (Obtainable) <MAICWBadge type="C" /></span>
                <span className="mt-1 text-lg font-bold text-foreground font-mono">₹ 1,850 Cr</span>
              </div>
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-semibold text-muted-foreground mb-1">
                <span>Market Opportunity Synthesis</span> <MAICWBadge type="M" />
              </label>
              <textarea
                rows={2}
                value={formData.marketOpportunity}
                onChange={(e) => updateField("marketOpportunity", e.target.value)}
                className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none leading-relaxed"
              />
            </div>
          </div>

          {/* Summary & Governance Decision */}
          <div id="sec-summary" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-600" /> Discovery Summary & Governance Decision
              </h3>
              <span className="text-xs font-bold text-emerald-600">Decision Gate 1 (Validated)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div className="rounded-xl border border-border bg-muted/10 p-4 space-y-2 text-xs">
                <div className="font-bold text-foreground flex items-center justify-between">
                  <span>Discovery Phase Verdict</span>
                  <span className="text-emerald-600 font-bold">Passed (86/100)</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  High customer severity (87/100) and substantial market opportunity (₹ 48,000 Cr TAM) validate moving to Value Proposition Development.
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
                    "Proceed to Value Proposition",
                    "Conduct More Customer Interviews",
                    "Refine Target Segment",
                    "Re-evaluate Market Opportunity",
                    "Archive Discovery Report",
                  ].map((rec) => (
                    <option key={rec} value={rec}>{rec}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Key Attachments & Artifacts */}
          <div id="sec-attachments" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Key Attachments & Artifacts
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
                      onClick={() => toast.info(`Downloading ${file.name}...`)}
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
          <div id="sec-governance" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
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
                    value={formData.approvalDecision}
                    onChange={(e) => updateField("approvalDecision", e.target.value)}
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
                    value={formData.approvalDate}
                    onChange={(e) => updateField("approvalDate", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Review Comments</label>
                <textarea
                  rows={2}
                  value={formData.reviewComments}
                  onChange={(e) => updateField("reviewComments", e.target.value)}
                  className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  placeholder="Add executive feedback or conditions..."
                />
              </div>
            </div>
          </div>

          {/* Activity History Log & Audit Trail */}
          <div id="sec-audit" className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
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

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Executive Customer Discovery Dossier</span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">{formData.projectTitle}</h2>
                <p className="text-xs text-muted-foreground">
                  Discovery ID: {formData.cdId} · Segment: {formData.customerSegment} · Lead: {formData.discoveryLead}
                </p>
              </div>
              <button type="button" onClick={() => setIsPreviewOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 bg-muted/20 p-4 rounded-xl border border-border text-xs">
              <div>
                <span className="text-muted-foreground font-medium block">Overall Discovery Score</span>
                <span className="text-lg font-bold text-emerald-600">86 / 100</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Customer Interviews</span>
                <span className="text-lg font-bold text-foreground font-mono">{formData.interviewsConducted} Completed</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Problem Severity</span>
                <span className="text-lg font-bold text-rose-600 font-mono">9.2 / 10 (Critical)</span>
              </div>
              <div>
                <span className="text-muted-foreground font-medium block">Recommendation</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">{formData.recommendation}</span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">1. Objective & Scope</h4>
                <p className="text-muted-foreground">{formData.businessObjective}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">2. Customer Problem & JTBD</h4>
                <p className="text-muted-foreground">{formData.jobsToBeDone}</p>
              </div>

              <div className="border border-border p-4 rounded-xl space-y-1">
                <h4 className="font-bold text-foreground">3. Pain Points & Solution Gap</h4>
                <p className="text-muted-foreground">{formData.painPoints}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-xs font-bold text-foreground hover:bg-muted cursor-pointer"
              >
                <Printer className="h-4 w-4" /> Print Dossier
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Discovery Workbench Modal */}
      {isAiWorkbenchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-primary/30 bg-card p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">AI Discovery Intelligence Assistant</h2>
                  <p className="text-xs text-muted-foreground">Automated customer pattern synthesis & market forecasting</p>
                </div>
              </div>
              <button type="button" onClick={() => setIsAiWorkbenchOpen(false)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                <span className="font-bold text-primary flex items-center gap-1.5">
                  <Zap className="h-4 w-4" /> Automated Customer Pain Synthesis
                </span>
                <p className="text-foreground leading-relaxed">
                  Analyzing 166 surveys and 28 interview transcripts indicates a <strong>94.2% correlation</strong> between charger downtime and fleet operating margin loss. Remote diagnostics is ranked as the #1 non-negotiable feature.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <span className="font-bold text-foreground">Willingness to Pay</span>
                  <p className="text-muted-foreground">Mid-market operators show budget tolerance of ₹ 35,000 - ₹ 65,000/month per active charging hub.</p>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                  <span className="font-bold text-foreground">Recommended Next Step</span>
                  <p className="text-muted-foreground">Formulate Value Proposition focusing on 99.5% uptime SLA guarantee and automated billing.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setIsAiWorkbenchOpen(false)}
                className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 cursor-pointer"
              >
                Close Workbench
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Upload className="h-4 w-4 text-primary" /> Upload Discovery Artifact
              </h3>
              <button type="button" onClick={() => setIsUploadModalOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-2 hover:border-primary/50 transition-colors cursor-pointer bg-muted/10">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="font-semibold text-foreground">Drag & drop your files here, or browse</p>
              <p className="text-[10px] text-muted-foreground">Supports PDF, XLSX, DOCX, ZIP up to 50MB</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="rounded-lg border border-border bg-card px-4 py-2 font-bold text-muted-foreground hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  toast.success("File Uploaded", { description: "Discovery artifact has been attached." });
                }}
                className="rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-primary/90 cursor-pointer"
              >
                Upload File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-bold text-foreground text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> {viewingFile}
              </span>
              <button type="button" onClick={() => setViewingFile(null)} className="text-muted-foreground hover:text-foreground cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-8 text-center space-y-3">
              <FileText className="h-12 w-12 text-primary mx-auto" />
              <p className="font-bold text-foreground">{viewingFile}</p>
              <p className="text-muted-foreground">Document preview is ready. Verified and virus-scanned.</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => toast.info(`Downloading ${viewingFile}...`)}
                className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 font-bold text-white hover:bg-primary/90 cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" /> Download
              </button>
              <button
                type="button"
                onClick={() => setViewingFile(null)}
                className="rounded-lg border border-border bg-card px-4 py-2 font-bold text-foreground hover:bg-muted cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
