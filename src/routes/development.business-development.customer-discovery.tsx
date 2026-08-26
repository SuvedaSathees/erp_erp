import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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
  UserCheck,
  DollarSign,
  Compass,
  FileSearch,
} from "lucide-react";
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
        "inline-flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-bold cursor-help transition-transform hover:scale-110",
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
    <div className="flex flex-col items-center rounded-xl border border-border bg-card p-3 shadow-xs text-center transition-all hover:shadow-md">
      <div className="relative grid h-16 w-16 place-items-center">
        <svg className="h-16 w-16 -rotate-90 transform" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="8" className="text-muted/30" fill="transparent" />
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
      <span className="mt-2 text-xs font-bold text-foreground truncate max-w-[110px]">{label}</span>
      {sub && <span className="text-[10px] text-muted-foreground font-medium">{sub}</span>}
    </div>
  );
}

function CustomerDiscoveryPage() {
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState("Overview");

  // Form State according to MAICW specifications for Submodule 3
  const [formData, setFormData] = useState({
    cdId: "CD-2024-00056",
    formCode: "CDR-2024-25",
    projectTitle: "Smart EV Charging Station Discovery",
    discoveryNumber: "CDN-INT-24-001",
    version: "1.0",
    workflowStatus: "In Progress",
    productService: "Smart EV Charging Solution",
    customerSegment: "Fleet Operators",
    discoveryLead: "Rahul Sharma",
    createdDate: "05 May 2024",
    lastModifiedDate: "17 May 2024",

    // Section 1: Discovery Overview
    businessObjective: "Understand Fleet operators needs for EV charging infrastructure.",
    discoveryGoal: "Identify key pain points, buying process and market opportunity.",
    industry: "Logistics & Transportation",
    targetMarket: "Commercial Fleet Operators",
    customerPersona: "Fleet Operations Manager",
    discoveryMethod: "Customer Interviews & Surveys",
    lifecycleStage: "Discovery",
    priority: "High",
    projectStatus: "Development",

    // Section 2: Customer Segmentation
    industryType: "Logistics & Transportation",
    companySize: "Mid-Market",
    geoMarket: ["India", "USA", "Europe"],
    customerRole: "Operations Manager",
    buyingAuthority: "Head of Operations",
    revenueRange: "₹ 50 Cr - ₹ 250 Cr",
    segmentReadinessScore: 82,

    // Section 3: Customer Problem Discovery
    jobsToBeDone: "Ensure uninterrupted EV fleet operations with minimal downtime.",
    painPoints: "High charging downtime, lack of remote monitoring, site reliability issues.",
    existingSolutions: "Manual monitoring, basic chargers, third-party networks.",
    frustrations: "Unreliable infrastructure, slow support, complex billing.",
    desiredOutcomes: "Seamless charging, remote visibility, cost optimization.",
    problemFrequency: "Daily",
    problemSeverity: "High",
    problemValidationScore: 87,

    // Section 4: Customer Research Activities
    interviewsConducted: 28,
    surveysCompleted: 166,
    focusGroups: 4,
    observationSessions: 12,
    customerVisits: 8,
    researchNotes: "Extensive notes captured from multiple sources.",
    supportingEvidenceFile: "Research_Notes.zip",
    researchReadinessScore: 84,

    // Section 5: Buying Behaviour Analysis
    buyingTrigger: "Expansion of EV fleet & cost savings",
    buyingProcess: "Eval -> Compare -> Pilot -> Purchase",
    decisionMakers: ["Operations Head", "Finance Head", "CTO"],
    influencers: ["Fleet Manager", "IT Manager", "Procurement"],
    purchaseFrequency: "Quarterly",
    budgetRange: "₹ 10 L - ₹ 50 L per site",
    buyingBehaviourScore: 83,

    // Section 6: Opportunity Assessment
    marketOpportunity: "High demand for smart and reliable EV charging for commercial fleets.",
    tam: 480000000000, // ₹ 48,000 Cr
    sam: 125000000000, // ₹ 12,500 Cr
    som: 18500000000,  // ₹ 1,850 Cr
    competitiveLandscape: "Moderate - Growing Players",
    opportunitySize: "Large",
    opportunityScore: 85,

    // Section 7: AI Customer Insights
    aiPersonaAnalysis: "Fleet operators prioritize uptime, cost, and remote visibility.",
    aiBehaviourPrediction: "High adoption likely in next 24 months.",
    aiDemandForecast: "Demand expected to grow at 28% CAGR over 5 years.",
    aiOpportunityAnalysis: "Strong opportunity in mid-market fleet segment.",
    aiProductRecommendations: "AI-enabled monitoring, predictive maintenance, dynamic pricing.",
    aiRiskAnalysis: "Infrastructure reliability and maintenance response time.",
    aiDiscoveryScore: 91,

    // Section 8: Discovery Summary
    recommendation: "Proceed to Value Proposition",
    approvalDecision: "Pending",
    reviewComments: "Comprehensive customer discovery with 28 interviews and ₹ 48,000 Cr TAM.",
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const subTabs = [
    "Overview",
    "Segmentation",
    "Problem Discovery",
    "Research Activities",
    "Buying Behaviour",
    "Opportunity Assessment",
    "AI Insights",
    "Summary",
    "Review & Approval",
    "Attachments",
    "Activity History",
  ];

  return (
    <AppShell
      title="Customer Discovery"
      breadcrumb="Development > Business Development > Customer Discovery"
      description="Govern the systematic identification, research, validation, and continuous understanding of customer problems, needs, behaviors, buying patterns, and market opportunities (MAICW Classification)."
      tabs={<BusinessDevelopmentTabBar />}
    >
      <div className="space-y-6">
        {/* Form Header Action Strip & Top Metadata Cards */}
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary font-bold">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-foreground">{formData.projectTitle}</h1>
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-[11px] font-bold text-blue-600">
                    {formData.workflowStatus}
                  </span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                    v{formData.version}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Discovery ID: <span className="font-mono font-semibold text-foreground">{formData.cdId}</span> · Code: <span className="font-mono font-semibold text-foreground">{formData.formCode}</span> · Discovery Number: <span className="font-mono font-semibold text-foreground">{formData.discoveryNumber}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowMaicwLegend(!showMaicwLegend)}
                className={cn(
                  "flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition-colors",
                  showMaicwLegend ? "bg-primary/10 text-primary border-primary/30" : "bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                <Info className="h-3.5 w-3.5" /> MAICW Legend
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors"
              >
                <Save className="h-3.5 w-3.5 text-muted-foreground" /> Save Draft
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs hover:bg-muted transition-colors"
              >
                <Eye className="h-3.5 w-3.5 text-muted-foreground" /> Preview
              </button>

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                <Send className="h-3.5 w-3.5" /> Submit for Approval
              </button>
            </div>
          </div>

          {/* Form Top Metadata Grid (Image 2 Top Bar) */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 text-xs">
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border">
              <span className="text-[11px] font-semibold text-muted-foreground block">Product / Service <MAICWBadge type="I" /></span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.productService}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border">
              <span className="text-[11px] font-semibold text-muted-foreground block">Customer Segment <MAICWBadge type="I" /></span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.customerSegment}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border">
              <span className="text-[11px] font-semibold text-muted-foreground block">Discovery Lead <MAICWBadge type="I" /></span>
              <span className="font-bold text-foreground block truncate mt-0.5">{formData.discoveryLead}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border">
              <span className="text-[11px] font-semibold text-muted-foreground block">Created Date <MAICWBadge type="A" /></span>
              <span className="font-semibold text-foreground block truncate mt-0.5">{formData.createdDate}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border">
              <span className="text-[11px] font-semibold text-muted-foreground block">Last Modified Date <MAICWBadge type="A" /></span>
              <span className="font-semibold text-foreground block truncate mt-0.5">{formData.lastModifiedDate}</span>
            </div>
            <div className="rounded-lg bg-muted/30 p-2.5 border border-border">
              <span className="text-[11px] font-semibold text-muted-foreground block">Version <MAICWBadge type="A" /></span>
              <span className="font-semibold text-foreground block truncate mt-0.5">v{formData.version}</span>
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
          <ScoreGauge label="Overall Discovery Score" score={86} sub="Very Good" />
          <ScoreGauge label="Customer Understanding" score={88} sub="Very Good" />
          <ScoreGauge label="Problem Validation" score={84} sub="Very Good" />
          <ScoreGauge label="Market Opportunity" score={85} sub="Very Good" />
          <ScoreGauge label="Research Score" score={83} sub="Very Good" />
          <ScoreGauge label="AI Discovery Score" score={91} sub="Excellent" />
          <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-3 shadow-xs text-center">
            <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <span className="mt-2 text-xs font-bold text-foreground">Lifecycle Stage</span>
            <span className="text-[11px] font-bold text-emerald-600">{formData.lifecycleStage}</span>
          </div>
        </div>

        {/* Main Grid: Form Sections (Left) & AI Insights / Health (Right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column: Multi-Section Form Cards (Span 2) */}
          <div className="lg:col-span-2 space-y-6">

            {/* 1. Discovery Overview */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" /> 1. Discovery Overview
                </h3>
                <span className="text-xs text-muted-foreground">Strategic Intent & Scope</span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Industry <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Manufacturing", "Automotive", "Electric Vehicles", "Energy", "SaaS", "Logistics & Transportation", "Healthcare", "Government", "Retail", "Education"].map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Discovery Method <MAICWBadge type="M" />
                  </label>
                  <select
                    value={formData.discoveryMethod}
                    onChange={(e) => updateField("discoveryMethod", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Customer Interview", "Survey", "Focus Group", "Field Observation", "Customer Interviews & Surveys", "Ethnographic Study", "Online Research", "Customer Workshop", "Prototype Testing"].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Lifecycle Stage <MAICWBadge type="W" />
                  </label>
                  <select
                    value={formData.lifecycleStage}
                    onChange={(e) => updateField("lifecycleStage", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {["Discovery", "Validation", "MVP", "Product Development", "Product Launch", "Growth"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Priority <MAICWBadge type="M" />
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
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Business Objective <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.businessObjective}
                    onChange={(e) => updateField("businessObjective", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Discovery Goal <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.discoveryGoal}
                    onChange={(e) => updateField("discoveryGoal", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Customer Segmentation */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-600" /> 2. Customer Segmentation
                </h3>
                <span className="text-xs font-semibold text-indigo-600">Segment Readiness Score: {formData.segmentReadinessScore}/100 <MAICWBadge type="C" /></span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Company Size <MAICWBadge type="M" />
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
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Annual Revenue Range <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.revenueRange}
                    onChange={(e) => updateField("revenueRange", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Geographic Market <MAICWBadge type="M" />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.geoMarket.map((geo) => (
                      <span key={geo} className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-600">
                        {geo}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Customer Problem Discovery */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-600" /> 3. Customer Problem Discovery
                </h3>
                <span className="text-xs font-semibold text-emerald-600">Problem Validation Score: {formData.problemValidationScore}/100 <MAICWBadge type="C" /></span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Jobs-to-be-Done (JTBD) <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.jobsToBeDone}
                    onChange={(e) => updateField("jobsToBeDone", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Customer Pain Points <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.painPoints}
                    onChange={(e) => updateField("painPoints", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Existing Solutions <MAICWBadge type="M" />
                  </label>
                  <textarea
                    rows={2}
                    value={formData.existingSolutions}
                    onChange={(e) => updateField("existingSolutions", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. Customer Research Activities */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-purple-600" /> 4. Customer Research Activities
                </h3>
                <span className="text-xs font-semibold text-purple-600">Research Readiness: {formData.researchReadinessScore}/100 <MAICWBadge type="C" /></span>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
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
            </div>

            {/* 5. Buying Behaviour Analysis */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> 5. Buying Behaviour Analysis
                </h3>
                <span className="text-xs font-semibold text-emerald-600">Buying Score: {formData.buyingBehaviourScore}/100 <MAICWBadge type="C" /></span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Buying Trigger <MAICWBadge type="M" />
                  </label>
                  <input
                    type="text"
                    value={formData.buyingTrigger}
                    onChange={(e) => updateField("buyingTrigger", e.target.value)}
                    className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mb-1">
                    Budget Range <MAICWBadge type="C" />
                  </label>
                  <input
                    type="text"
                    value={formData.budgetRange}
                    readOnly
                    className="w-full rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs font-bold text-foreground font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 6. Opportunity Assessment */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-indigo-600" /> 6. Opportunity Assessment
                </h3>
                <span className="text-xs font-semibold text-indigo-600">Opportunity Score: {formData.opportunityScore}/100 <MAICWBadge type="C" /></span>
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
            </div>

            {/* 7. Enterprise Governance & Executive Review Matrix */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" /> 7. Governance & Review Matrix
                </h3>
                <span className="text-xs font-semibold text-primary">8 Stakeholder Roles</span>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { role: "Product Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024" },
                  { role: "Business Dev Mgr", user: "Rahul Sharma", status: "Approved", date: "09 May 2024" },
                  { role: "Marketing Manager", user: "Neha Reddy", status: "Approved", date: "10 May 2024" },
                  { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "11 May 2024" },
                  { role: "Customer Success Mgr", user: "Priya Nair", status: "Pending", date: "In Review" },
                  { role: "Strategy Head", user: "Anil Mehta", status: "Pending", date: "Awaiting" },
                  { role: "COO", user: "Rakesh Patel", status: "Pending", date: "Awaiting" },
                  { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate" },
                ].map((stk) => (
                  <div key={stk.role} className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground block">{stk.role}</span>
                    <span className="text-xs font-bold text-foreground block truncate">{stk.user}</span>
                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={cn(
                          "font-bold px-1.5 py-0.5 rounded",
                          stk.status === "Approved" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                        )}
                      >
                        {stk.status}
                      </span>
                      <span className="text-muted-foreground">{stk.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: AI Insights & Key KPIs Snapshot */}
          <div className="space-y-6">

            {/* AI Insights Card */}
            <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card to-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-primary/10">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" /> AI Insights Snapshot
                </h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">AI Score 91</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-rose-600">
                    <Zap className="h-3.5 w-3.5" /> Top Pain Point
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    High downtime and lack of remote monitoring are critical issues.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-emerald-600">
                    <Target className="h-3.5 w-3.5" /> Top Need
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Reliable infrastructure with remote visibility and fast support.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-blue-600">
                    <TrendingUp className="h-3.5 w-3.5" /> Market Trend
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    EV fleet adoption driving demand for smart charging solutions.
                  </p>
                </div>

                <div className="rounded-lg border border-border bg-card p-3 space-y-1">
                  <span className="font-bold text-foreground flex items-center gap-1.5 text-purple-600">
                    <Award className="h-3.5 w-3.5" /> Top Opportunity
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    Mid-market fleet operators offer highest growth potential.
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors"
              >
                View Full AI Analysis <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Key KPIs Snapshot */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-500" /> Key KPIs Snapshot
                </h3>
                <span className="text-xs text-muted-foreground font-mono">Real-time</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-muted-foreground font-semibold block">Interviews</span>
                  <span className="text-base font-bold text-foreground font-mono">28</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-muted-foreground font-semibold block">Surveys</span>
                  <span className="text-base font-bold text-foreground font-mono">156</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-muted-foreground font-semibold block">PMF Score</span>
                  <span className="text-base font-bold text-emerald-600 font-mono">82 / 100</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-muted-foreground font-semibold block">Opportunity Score</span>
                  <span className="text-base font-bold text-blue-600 font-mono">85 / 100</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-muted-foreground font-semibold block">Buying Score</span>
                  <span className="text-base font-bold text-foreground font-mono">83 / 100</span>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 p-3">
                  <span className="text-muted-foreground font-semibold block">AI Score</span>
                  <span className="text-base font-bold text-indigo-600 font-mono">91 / 100</span>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Key Attachments & Artifacts
                </h3>
                <span className="text-xs font-semibold text-primary">8 Files</span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: "Interview_Notes.pdf", date: "12 May 2024" },
                  { name: "Survey_Results.xlsx", date: "13 May 2024" },
                  { name: "Observation_Report.pdf", date: "13 May 2024" },
                  { name: "Persona_Canvas.pdf", date: "14 May 2024" },
                  { name: "JTBD_Canvas.pdf", date: "14 May 2024" },
                  { name: "Market_Analysis.pdf", date: "15 May 2024" },
                  { name: "Research_Report.pdf", date: "15 May 2024" },
                  { name: "Supporting_Documents.zip", date: "15 May 2024" },
                ].map((file) => (
                  <div key={file.name} className="flex items-center justify-between rounded-lg border border-border bg-muted/20 p-2.5 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="h-4 w-4 shrink-0 text-primary" />
                      <div className="truncate">
                        <span className="font-bold text-foreground block truncate">{file.name}</span>
                        <span className="text-[10px] text-muted-foreground">{file.date}</span>
                      </div>
                    </div>
                    <button type="button" className="text-muted-foreground hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* System Information */}
            <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border font-bold text-foreground">
                <span>System Information</span>
                <span className="text-[10px] font-normal text-muted-foreground">Audit Log</span>
              </div>

              <div className="space-y-1.5 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Created By:</span>
                  <span className="font-semibold text-foreground">{formData.discoveryLead}</span>
                </div>
                <div className="flex justify-between">
                  <span>Created Date:</span>
                  <span className="font-semibold text-foreground">05 May 2024 09:20 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified By:</span>
                  <span className="font-semibold text-foreground">{formData.discoveryLead}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Modified Date:</span>
                  <span className="font-semibold text-foreground">17 May 2024 03:45 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Workflow Stage:</span>
                  <span className="font-semibold text-primary">Customer Research</span>
                </div>
                <div className="flex justify-between">
                  <span>Version:</span>
                  <span className="font-semibold text-foreground">1.0</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </AppShell>
  );
}
