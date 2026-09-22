import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Megaphone,
  Save,
  Send,
  Rocket,
  MoreVertical,
  Edit3,
  Target,
  Users,
  MousePointerClick,
  Filter,
  UserCheck,
  BarChart3,
  Handshake,
  IndianRupee,
  TrendingUp,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  MapPin,
  Calendar,
  DollarSign,
  Percent,
  Award,
  Zap,
  ShieldCheck,
  Plus,
  RefreshCw,
  FileText,
  Mail,
  Copy,
  Info,
  Check,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/campaigns"
)({
  head: () => ({
    meta: [
      { title: "Campaigns Form (MAICW) · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Create, plan, budget, approve, execute, monitor, optimize, and close marketing campaigns across digital, offline, events, and CRM.",
      },
    ],
  }),
  component: CampaignsManagementPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for governance & launch", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600" },
    A: { label: "A", desc: "Auto-generated / System Controlled Identifier", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600" },
    I: { label: "I", desc: "Information / Lookup Master Link", bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600" },
    C: { label: "C", desc: "Calculated Formula / Derived Dynamic Metric", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600" },
    W: { label: "W", desc: "Workflow Stage Gate Controlled", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600" },
  };

  const item = meta[type];
  return (
    <span
      title={item.desc}
      className={cn(
        "inline-flex h-4 w-4 items-center justify-center rounded-full border text-[9px] font-bold cursor-help transition-transform hover:scale-110 shrink-0 select-none",
        item.bg,
        item.text
      )}
    >
      {item.label}
    </span>
  );
}

const CAMPAIGN_TABS = [
  { id: "overview", label: "Overview" },
  { id: "details", label: "Details" },
  { id: "target-audience", label: "Target Audience" },
  { id: "content-creatives", label: "Content & Creatives" },
  { id: "channels", label: "Channels" },
  { id: "budget", label: "Budget" },
  { id: "leads-conversion", label: "Leads & Conversion" },
  { id: "analytics", label: "Analytics" },
  { id: "roi", label: "ROI" },
  { id: "approval-workflow", label: "Approval Workflow" },
  { id: "history", label: "History" },
  { id: "related-records", label: "Related Records" },
];

function CampaignsManagementPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    chk1: true,
    chk2: true,
    chk3: true,
    chk4: true,
    chk5: true,
    chk6: true,
    chk7: true,
    chk8: true,
    chk9: true,
    chk10: true,
    chk11: true,
    chk12: true,
  });

  const toggleChecklist = (key: string) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveDraft = () => {
    toast.success("Campaign draft saved successfully", {
      description: "CMP-2026-001 revision v1.0 synchronized to master ledger.",
    });
  };

  const handleSubmitApproval = () => {
    toast.success("Submitted for Management Review", {
      description: "Approval notifications dispatched to Marketing Head & Finance Controller.",
    });
  };

  const handleLaunchCampaign = () => {
    toast.success("Campaign is Active & Live", {
      description: "All digital channels, tracking UTMs, and CRM attribution pipelines active.",
    });
  };

  return (
    <AppShell
      title="Campaigns"
      breadcrumb="Management > Marketing Management > Campaigns > Campaign Details"
      description="Create. Engage. Convert. Grow. — Enterprise Controlled Marketing Campaign Master & Execution Form"
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-5 pb-12">
        {/* Top Header Card Matching Screenshot */}
        <div className="card-soft p-5 border-border/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Campaigns
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-500/30">
                  Active
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-mono font-bold text-foreground/80 border border-border">
                  CMP-2026-001
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-600">
                  v1.0
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMaicwLegend(!showMaicwLegend)}
                  className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                >
                  <Info className="h-3.5 w-3.5 mr-1 text-primary" /> MAICW Standards
                </Button>
              </div>
              <p className="mt-1 text-sm font-medium text-muted-foreground">
                Create. Engage. Convert. Grow.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Save className="h-3.5 w-3.5" /> Save Draft
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmitApproval}
                className="gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
              >
                <Check className="h-3.5 w-3.5" /> Submit for Approval
              </Button>
              <Button
                size="sm"
                onClick={handleLaunchCampaign}
                className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Rocket className="h-3.5 w-3.5" /> Launch Campaign
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-2.5">
                <span className="text-xs font-medium mr-1">More Actions</span>
                <ChevronRight className="h-3.5 w-3.5 rotate-90" />
              </Button>
            </div>
          </div>

          {/* MAICW Legend Dropdown */}
          {showMaicwLegend && (
            <div className="mt-4 rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs transition-all">
              <div className="font-semibold text-foreground flex items-center gap-1.5 mb-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Enterprise MAICW Governance Classification
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="flex items-center gap-2">
                  <MAICWBadge type="M" />
                  <span className="text-muted-foreground"><strong>M</strong>: Mandatory</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="A" />
                  <span className="text-muted-foreground"><strong>A</strong>: Auto / System</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="I" />
                  <span className="text-muted-foreground"><strong>I</strong>: Master Lookup</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="C" />
                  <span className="text-muted-foreground"><strong>C</strong>: Calculated</span>
                </div>
                <div className="flex items-center gap-2">
                  <MAICWBadge type="W" />
                  <span className="text-muted-foreground"><strong>W</strong>: Workflow Gate</span>
                </div>
              </div>
            </div>
          )}

          {/* 12 Sub-Tabs Strip matching screenshot */}
          <div className="mt-5 border-t border-border/80 pt-1">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 select-none">
              {CAMPAIGN_TABS.map((t) => {
                const isActive = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW (Exact Match to User Reference Mockup) */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* ROW 1: Campaign Header (left) + Campaign Visual (middle) + Campaign Objective (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Campaign Header Form (Cols 1-5) */}
              <div className="card-soft p-5 lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                      Campaign Header
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">CMP-2026-001</span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs">
                    <div className="col-span-2">
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Campaign Name <MAICWBadge type="M" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Future Ready EV Fleets"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs font-semibold text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Campaign Type <MAICWBadge type="M" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Lead Generation"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Campaign Category <MAICWBadge type="M" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Digital Marketing"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Marketing Program <MAICWBadge type="I" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="EV Charging Expansion"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Product / Service <MAICWBadge type="C" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Autonomous W-EVSE"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Business Unit <MAICWBadge type="M" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Charging Solutions"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Target Market <MAICWBadge type="M" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="Fleet Operators"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Campaign Manager <MAICWBadge type="M" />
                      </label>
                      <div className="mt-1 flex items-center gap-2 rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs text-foreground">
                        <span className="h-5 w-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
                          AK
                        </span>
                        <span className="font-semibold">Arun Kumar</span>
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Priority & Status <MAICWBadge type="W" />
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-red-500/10 text-red-600 border border-red-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> High
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        Start Date <MAICWBadge type="M" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="01-Sep-2026"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                        End Date <MAICWBadge type="M" />
                      </label>
                      <input
                        type="text"
                        readOnly
                        value="31-Oct-2026"
                        className="mt-1 w-full rounded-md border border-border bg-background/60 px-2.5 py-1.5 text-xs font-mono text-foreground focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Visual Card (Cols 6-8) */}
              <div className="card-soft p-5 lg:col-span-4 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="font-display text-sm font-bold text-foreground">
                    Campaign Visual
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary">
                    <Edit3 className="h-3 w-3 mr-1" /> Edit
                  </Button>
                </div>

                {/* Styled High-Tech EV Charging Station Banner */}
                <div className="mt-4 relative rounded-xl overflow-hidden border border-border/60 shadow-md bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white min-h-[220px] flex flex-col justify-between p-5 group">
                  {/* Subtle Background Elements & Grid */}
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  <div className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />

                  {/* Top Branding */}
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">
                        Enterprise EV Fleet
                      </span>
                      <h3 className="font-display text-lg font-extrabold tracking-tight text-white mt-0.5">
                        Powering Smarter Fleets
                      </h3>
                      <p className="text-xs text-slate-300 font-medium">
                        Autonomous Wireless EV Charging Solutions
                      </p>
                    </div>
                    <div className="rounded bg-white/10 px-2 py-1 text-[10px] font-bold text-white tracking-widest backdrop-blur-xs">
                      M MAGNERTIA
                    </div>
                  </div>

                  {/* Mid Visual Graphic Details */}
                  <div className="relative z-10 my-4 flex items-center justify-center">
                    <div className="relative flex items-center justify-center h-20 w-full max-w-[200px] rounded-lg border border-sky-500/30 bg-blue-900/40 backdrop-blur-sm px-3 text-center">
                      <div className="absolute -top-2 px-2 py-0.5 rounded bg-sky-500 text-[9px] font-bold text-black uppercase tracking-wider">
                        Wireless Fast Pad
                      </div>
                      <div className="flex items-center gap-3">
                        <Zap className="h-6 w-6 text-sky-400 animate-pulse" />
                        <div className="text-left">
                          <div className="text-xs font-bold text-white">Inductive 150 kW</div>
                          <div className="text-[10px] text-sky-300">Efficiency: 96.4%</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Badges */}
                  <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-300 border-t border-white/10 pt-2.5">
                    <span>Efficient • Scalable • Future Ready</span>
                    <span className="text-sky-400 font-medium">Clean Energy. Connected Tomorrow.</span>
                  </div>
                </div>
              </div>

              {/* Campaign Objective Card (Cols 9-12) */}
              <div className="card-soft p-5 lg:col-span-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground">
                      Campaign Objective
                    </span>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-primary">
                      <Edit3 className="h-3 w-3 mr-1" /> Edit
                    </Button>
                  </div>

                  <div className="mt-4 flex flex-col items-start gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 border border-purple-500/20">
                        <Target className="h-6 w-6" />
                      </div>
                      <div className="text-xs font-semibold text-foreground">
                        Primary Strategic Target
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Generate qualified leads from fleet operators for our autonomous wireless EV charging solutions across Tier-1 regional logistics corridors.
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 pt-3 border-t border-border/60">
                  <span className="text-[11px] font-semibold text-muted-foreground block">
                    Strategic Focus Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center rounded-md bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 border border-amber-500/20">
                      Lead Generation
                    </span>
                    <span className="inline-flex items-center rounded-md bg-blue-500/10 px-2 py-0.5 text-[11px] font-semibold text-blue-600 border border-blue-500/20">
                      Fleet Operators
                    </span>
                    <span className="inline-flex items-center rounded-md bg-slate-500/10 px-2 py-0.5 text-[11px] font-semibold text-slate-600 border border-slate-500/20">
                      B2B
                    </span>
                    <span className="inline-flex items-center rounded-md bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold text-cyan-600 border border-cyan-500/20">
                      India - South
                    </span>
                    <span className="inline-flex items-center rounded-md bg-purple-500/10 px-2 py-0.5 text-[11px] font-semibold text-purple-600 border border-purple-500/20">
                      Digital + Events
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Campaign KPI Summary (8 cards) + Campaign Progress (circular gauge) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* 8 KPI Cards (Cols 1-10) */}
              <div className="card-soft p-5 lg:col-span-10">
                <div className="flex items-center justify-between pb-3 border-b border-border/60">
                  <span className="font-display text-sm font-bold text-foreground">
                    Campaign KPI Summary
                  </span>
                  <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> All metrics tracking above target
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {/* 1. Reach */}
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-base font-extrabold text-foreground">500,000</div>
                    <div className="text-[11px] text-muted-foreground font-medium">Reach</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      ↑ 12%
                    </div>
                  </div>

                  {/* 2. Website Visits */}
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <MousePointerClick className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-base font-extrabold text-foreground">25,000</div>
                    <div className="text-[11px] text-muted-foreground font-medium">Website Visits</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      ↑ 18%
                    </div>
                  </div>

                  {/* 3. Leads */}
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center">
                      <Filter className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-base font-extrabold text-foreground">500</div>
                    <div className="text-[11px] text-muted-foreground font-medium">Leads</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      ↑ 25%
                    </div>
                  </div>

                  {/* 4. MQL */}
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-base font-extrabold text-foreground">185</div>
                    <div className="text-[11px] text-muted-foreground font-medium">MQL</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      ↑ 32%
                    </div>
                  </div>

                  {/* 5. SQL */}
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-base font-extrabold text-foreground">82</div>
                    <div className="text-[11px] text-muted-foreground font-medium">SQL</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      ↑ 28%
                    </div>
                  </div>

                  {/* 6. Opportunities */}
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <Handshake className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-base font-extrabold text-foreground">44</div>
                    <div className="text-[11px] text-muted-foreground font-medium">Opportunities</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      ↑ 22%
                    </div>
                  </div>

                  {/* 7. Revenue */}
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <IndianRupee className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-base font-extrabold text-foreground">₹85.0 L</div>
                    <div className="text-[11px] text-muted-foreground font-medium">Revenue</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      ↑ 35%
                    </div>
                  </div>

                  {/* 8. ROI */}
                  <div className="rounded-xl border border-border/60 bg-card/60 p-3 hover:border-primary/40 transition-colors">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="mt-2 text-base font-extrabold text-foreground">4.5x</div>
                    <div className="text-[11px] text-muted-foreground font-medium">ROI</div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5">
                      ↑ 1.2x
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Progress Gauge (Cols 11-12) */}
              <div className="card-soft p-5 lg:col-span-2 flex flex-col justify-between items-center text-center">
                <div className="w-full flex items-center justify-between pb-2 border-b border-border/60">
                  <span className="font-display text-sm font-bold text-foreground">
                    Campaign Progress
                  </span>
                  <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                </div>

                {/* Circular Progress Gauge */}
                <div className="my-2 relative flex items-center justify-center h-28 w-28">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="10"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="10"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 * (1 - 0.68)}
                      strokeLinecap="round"
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-extrabold text-foreground">68%</span>
                  </div>
                </div>

                <div className="text-xs">
                  <div className="font-medium text-muted-foreground">Campaign Period</div>
                  <div className="font-bold text-foreground mt-0.5">Day 41 of 60</div>
                </div>
              </div>
            </div>

            {/* ROW 3: Channel Performance (left table) + Campaign Funnel (middle) + Leads by Source / Locations (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Channel Performance (Cols 1-5) */}
              <div className="card-soft p-5 lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground">
                      Channel Performance
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">5 Channels</span>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border/80 text-muted-foreground">
                          <th className="pb-2 font-semibold">Channel</th>
                          <th className="pb-2 font-semibold text-right">Impressions</th>
                          <th className="pb-2 font-semibold text-right">Clicks</th>
                          <th className="pb-2 font-semibold text-right">Leads</th>
                          <th className="pb-2 font-semibold text-right">Cost (₹)</th>
                          <th className="pb-2 font-semibold text-right">CPL (₹)</th>
                          <th className="pb-2 font-semibold text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-mono">
                        <tr className="hover:bg-muted/20">
                          <td className="py-2.5 font-sans font-semibold text-foreground flex items-center gap-1.5">
                            <span className="h-5 w-5 rounded bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center text-[10px]">in</span>
                            LinkedIn
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground">120,000</td>
                          <td className="py-2.5 text-right text-muted-foreground">4,800</td>
                          <td className="py-2.5 text-right font-bold text-foreground">150</td>
                          <td className="py-2.5 text-right text-muted-foreground">2,00,000</td>
                          <td className="py-2.5 text-right text-emerald-600 font-semibold">1,333</td>
                          <td className="py-2.5 text-center">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Active</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2.5 font-sans font-semibold text-foreground flex items-center gap-1.5">
                            <span className="h-5 w-5 rounded bg-amber-500/10 text-amber-600 font-bold flex items-center justify-center text-[10px]">G</span>
                            Google Ads
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground">150,000</td>
                          <td className="py-2.5 text-right text-muted-foreground">5,200</td>
                          <td className="py-2.5 text-right font-bold text-foreground">180</td>
                          <td className="py-2.5 text-right text-muted-foreground">1,50,000</td>
                          <td className="py-2.5 text-right text-emerald-600 font-semibold">833</td>
                          <td className="py-2.5 text-center">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Active</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2.5 font-sans font-semibold text-foreground flex items-center gap-1.5">
                            <span className="h-5 w-5 rounded bg-purple-500/10 text-purple-600 font-bold flex items-center justify-center text-[10px]">@</span>
                            Email Marketing
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground">25,000</td>
                          <td className="py-2.5 text-right text-muted-foreground">2,100</td>
                          <td className="py-2.5 text-right font-bold text-foreground">100</td>
                          <td className="py-2.5 text-right text-muted-foreground">50,000</td>
                          <td className="py-2.5 text-right text-emerald-600 font-semibold">500</td>
                          <td className="py-2.5 text-center">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Active</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2.5 font-sans font-semibold text-foreground flex items-center gap-1.5">
                            <span className="h-5 w-5 rounded bg-indigo-500/10 text-indigo-600 font-bold flex items-center justify-center text-[10px]">E</span>
                            Industry Event
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground">5,000</td>
                          <td className="py-2.5 text-right text-muted-foreground">800</td>
                          <td className="py-2.5 text-right font-bold text-foreground">120</td>
                          <td className="py-2.5 text-right text-muted-foreground">3,00,000</td>
                          <td className="py-2.5 text-right text-emerald-600 font-semibold">2,500</td>
                          <td className="py-2.5 text-center">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Active</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2.5 font-sans font-semibold text-foreground flex items-center gap-1.5">
                            <span className="h-5 w-5 rounded bg-teal-500/10 text-teal-600 font-bold flex items-center justify-center text-[10px]">P</span>
                            Partner Network
                          </td>
                          <td className="py-2.5 text-right text-muted-foreground">20,000</td>
                          <td className="py-2.5 text-right text-muted-foreground">1,200</td>
                          <td className="py-2.5 text-right font-bold text-foreground">80</td>
                          <td className="py-2.5 text-right text-muted-foreground">1,00,000</td>
                          <td className="py-2.5 text-right text-emerald-600 font-semibold">1,250</td>
                          <td className="py-2.5 text-center">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">Active</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Campaign Funnel (Cols 6-8) */}
              <div className="card-soft p-5 lg:col-span-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground">
                      Campaign Funnel
                    </span>
                    <span className="text-[11px] text-muted-foreground">Stages</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    {[
                      { stage: "Reach", count: "500,000", pct: "100%", bg: "bg-blue-600", width: "100%" },
                      { stage: "Engagement", count: "25,000", pct: "5.0%", bg: "bg-emerald-500", width: "88%" },
                      { stage: "Leads", count: "500", pct: "0.1%", bg: "bg-amber-500", width: "76%" },
                      { stage: "MQL", count: "185", pct: "37.0%", bg: "bg-orange-500", width: "64%" },
                      { stage: "SQL", count: "82", pct: "44.3%", bg: "bg-pink-500", width: "52%" },
                      { stage: "Opportunities", count: "44", pct: "53.7%", bg: "bg-teal-500", width: "40%" },
                      { stage: "Customers", count: "17", pct: "38.6%", bg: "bg-indigo-900", width: "28%" },
                    ].map((st) => (
                      <div key={st.stage} className="flex items-center justify-between text-xs">
                        <div className="w-16 font-mono font-bold text-foreground text-[11px]">
                          {st.count}
                        </div>
                        <div className="flex-1 flex justify-center px-1">
                          <div
                            style={{ width: st.width }}
                            className={cn(
                              "h-6 rounded flex items-center justify-between px-2 text-white font-mono text-[10px] font-bold shadow-xs",
                              st.bg
                            )}
                          >
                            <span>{st.pct}</span>
                            <span className="font-sans font-medium text-[10px] truncate ml-1">{st.stage}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Leads by Source & Top Locations (Cols 9-12) */}
              <div className="card-soft p-5 lg:col-span-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground">
                      Leads by Source & Location
                    </span>
                    <Badge variant="outline" className="text-[10px]">500 Leads</Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 items-center">
                    {/* Donut */}
                    <div className="relative h-32 w-32 mx-auto">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Google Ads", value: 35, color: "#3b82f6" },
                              { name: "LinkedIn", value: 30, color: "#0284c7" },
                              { name: "Email", value: 20, color: "#10b981" },
                              { name: "Events", value: 10, color: "#f59e0b" },
                              { name: "Partner Network", value: 4, color: "#8b5cf6" },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={36}
                            outerRadius={54}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {[
                              "#3b82f6",
                              "#0284c7",
                              "#10b981",
                              "#f59e0b",
                              "#8b5cf6",
                            ].map((c, i) => (
                              <Cell key={i} fill={c} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-sm font-extrabold text-foreground">500</span>
                        <span className="text-[9px] text-muted-foreground uppercase">Total</span>
                      </div>
                    </div>

                    {/* Donut Legend */}
                    <div className="space-y-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-blue-600" /> LinkedIn
                        </span>
                        <span className="font-bold">30%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-sky-500" /> Google Ads
                        </span>
                        <span className="font-bold">35%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Email
                        </span>
                        <span className="font-bold">20%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-amber-500" /> Events
                        </span>
                        <span className="font-bold">10%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-purple-500" /> Partner
                        </span>
                        <span className="font-bold">4%</span>
                      </div>
                    </div>
                  </div>

                  {/* Top Campaign Locations Horizontal Bars */}
                  <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" /> Top Campaign Locations
                    </span>
                    {[
                      { loc: "Tamil Nadu", pct: 35 },
                      { loc: "Karnataka", pct: 25 },
                      { loc: "Maharashtra", pct: 15 },
                      { loc: "Delhi NCR", pct: 10 },
                      { loc: "Others", pct: 15 },
                    ].map((item) => (
                      <div key={item.loc} className="space-y-0.5">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-muted-foreground">{item.loc}</span>
                          <span className="font-bold text-foreground">{item.pct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${item.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 4: Budget vs Actual (left) + Campaign Timeline (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Budget vs Actual (Cols 1-5) */}
              <div className="card-soft p-5 lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground">
                      Budget vs Actual
                    </span>
                    <Button variant="outline" size="sm" className="h-6 px-2 text-xs">
                      View Details
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-lg bg-muted/40 p-2.5 border border-border/50">
                      <div className="text-base font-extrabold text-foreground">₹8,00,000</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">Approved Budget</div>
                    </div>
                    <div className="rounded-lg bg-primary/5 p-2.5 border border-primary/20">
                      <div className="text-base font-extrabold text-primary">₹6,20,000</div>
                      <div className="text-[11px] text-primary font-semibold mt-0.5">Actual Spend (77.5%)</div>
                    </div>
                    <div className="rounded-lg bg-emerald-500/5 p-2.5 border border-emerald-500/20">
                      <div className="text-base font-extrabold text-emerald-600">₹1,00,000</div>
                      <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Remaining</div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Spent: ₹6.20L</span>
                      <span>Approved: ₹8.00L</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
                      <div className="h-full bg-emerald-500 rounded-l-full" style={{ width: "77.5%" }} />
                      <div className="h-full bg-amber-400" style={{ width: "10%" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Campaign Timeline Stepper (Cols 6-12) */}
              <div className="card-soft p-5 lg:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground">
                      Campaign Timeline
                    </span>
                    <span className="text-xs text-primary font-semibold">Campaign Live</span>
                  </div>

                  {/* Stepper with Today indicator */}
                  <div className="mt-6 relative px-4">
                    {/* Horizontal connector line */}
                    <div className="absolute top-4 left-8 right-8 h-1 bg-muted -translate-y-1/2 z-0" />
                    <div className="absolute top-4 left-8 w-[60%] h-1 bg-primary -translate-y-1/2 z-0" />

                    <div className="relative z-10 flex justify-between">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="mt-2 text-xs font-bold text-foreground">Planning</span>
                        <span className="text-[10px] text-muted-foreground font-mono">1-5 Sep</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="mt-2 text-xs font-bold text-foreground">Content</span>
                        <span className="text-[10px] text-muted-foreground font-mono">3-10 Sep</span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center text-center">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                          <Check className="h-4 w-4" />
                        </div>
                        <span className="mt-2 text-xs font-bold text-foreground">Launch</span>
                        <span className="text-[10px] text-muted-foreground font-mono">15 Sep</span>
                      </div>

                      {/* Today Marker */}
                      <div className="flex flex-col items-center text-center">
                        <div className="relative">
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
                            Today
                          </div>
                          <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs ring-4 ring-primary/20 shadow-xs">
                            <Clock className="h-4 w-4" />
                          </div>
                        </div>
                        <span className="mt-2 text-xs font-bold text-primary">Execution</span>
                        <span className="text-[10px] text-muted-foreground font-mono">15 Sep - 31 Oct</span>
                      </div>

                      {/* Step 5 */}
                      <div className="flex flex-col items-center text-center opacity-60">
                        <div className="h-8 w-8 rounded-full bg-muted border border-border text-muted-foreground flex items-center justify-center font-bold text-xs">
                          5
                        </div>
                        <span className="mt-2 text-xs font-semibold text-muted-foreground">Review</span>
                        <span className="text-[10px] text-muted-foreground font-mono">1-5 Nov</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 5: Recent Campaign Activities (left) + AI Insights (middle) + Quick Actions (right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Recent Activities (Cols 1-5) */}
              <div className="card-soft p-5 lg:col-span-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground">
                      Recent Campaign Activities
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">Real-time</span>
                  </div>

                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-border/80 text-muted-foreground">
                          <th className="pb-2 font-semibold">Date</th>
                          <th className="pb-2 font-semibold">Activity</th>
                          <th className="pb-2 font-semibold">User</th>
                          <th className="pb-2 font-semibold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40 font-mono text-[11px]">
                        <tr className="hover:bg-muted/20">
                          <td className="py-2 text-muted-foreground">18-Sep-2026</td>
                          <td className="py-2 font-sans font-medium text-foreground">New creative approved</td>
                          <td className="py-2 font-sans text-muted-foreground">Priya S</td>
                          <td className="py-2 text-right">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600">Completed</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2 text-muted-foreground">15-Sep-2026</td>
                          <td className="py-2 font-sans font-medium text-foreground">Campaign launched</td>
                          <td className="py-2 font-sans text-muted-foreground">Arun Kumar</td>
                          <td className="py-2 text-right">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600">Completed</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2 text-muted-foreground">10-Sep-2026</td>
                          <td className="py-2 font-sans font-medium text-foreground">Landing page published</td>
                          <td className="py-2 font-sans text-muted-foreground">Digital Team</td>
                          <td className="py-2 text-right">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600">Completed</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2 text-muted-foreground">06-Sep-2026</td>
                          <td className="py-2 font-sans font-medium text-foreground">Email template approved</td>
                          <td className="py-2 font-sans text-muted-foreground">Priya S</td>
                          <td className="py-2 text-right">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600">Completed</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-muted/20">
                          <td className="py-2 text-muted-foreground">01-Sep-2026</td>
                          <td className="py-2 font-sans font-medium text-foreground">Campaign created</td>
                          <td className="py-2 font-sans text-muted-foreground">Arun Kumar</td>
                          <td className="py-2 text-right">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600">Completed</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* AI Insights Card (Cols 5-8) */}
              <div className="card-soft p-5 lg:col-span-5 flex flex-col justify-between border-purple-500/20 bg-gradient-to-br from-card via-card to-purple-500/5">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-purple-600" /> AI Insights
                    </span>
                    <Badge className="bg-purple-600 hover:bg-purple-700 text-white text-[10px] gap-1 shadow-xs">
                      AI Powered +
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                      <span className="text-foreground">
                        Lead conversion rate is <strong>18% higher</strong> than similar campaigns.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500 mt-1 shrink-0" />
                      <span className="text-foreground">
                        Fleet operators from <strong>Tamil Nadu</strong> show highest engagement.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500 mt-1 shrink-0" />
                      <span className="text-foreground">
                        Recommend increasing <strong>Google Ads budget by 20%</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500 mt-1 shrink-0" />
                      <span className="text-foreground">
                        Best performing content: <strong>&ldquo;Autonomous Charging for Fleets&rdquo;</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500 mt-1 shrink-0" />
                      <span className="text-foreground">
                        Predicted revenue: <strong>₹1.2 Cr</strong> (95% confidence).
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions (Cols 9-12) */}
              <div className="card-soft p-5 lg:col-span-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-border/60">
                    <span className="font-display text-sm font-bold text-foreground">
                      Quick Actions
                    </span>
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveTab("content-creatives");
                        toast.info("Navigated to Content & Creatives workspace");
                      }}
                      className="h-10 text-[11px] font-semibold flex items-center justify-start gap-1.5 px-2 hover:border-primary/50"
                    >
                      <Plus className="h-3.5 w-3.5 text-primary shrink-0" /> Add Content
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveTab("leads-conversion");
                        toast.info("Opening Leads Import utility");
                      }}
                      className="h-10 text-[11px] font-semibold flex items-center justify-start gap-1.5 px-2 hover:border-primary/50"
                    >
                      <FileText className="h-3.5 w-3.5 text-primary shrink-0" /> Import Leads
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setActiveTab("channels");
                        toast.info("Launched Email Campaign Composer");
                      }}
                      className="h-10 text-[11px] font-semibold flex items-center justify-start gap-1.5 px-2 hover:border-primary/50"
                    >
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" /> Email Campaign
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = "/management/marketing-management/reports";
                      }}
                      className="h-10 text-[11px] font-semibold flex items-center justify-start gap-1.5 px-2 hover:border-primary/50"
                    >
                      <BarChart3 className="h-3.5 w-3.5 text-primary shrink-0" /> Generate Report
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.location.href = "/management/crm-management/opportunity-management";
                      }}
                      className="h-10 text-[11px] font-semibold flex items-center justify-start gap-1.5 px-2 hover:border-primary/50"
                    >
                      <Handshake className="h-3.5 w-3.5 text-primary shrink-0" /> View in CRM
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast.success("Campaign Cloned as CMP-2026-004 (Draft)");
                      }}
                      className="h-10 text-[11px] font-semibold flex items-center justify-start gap-1.5 px-2 hover:border-primary/50"
                    >
                      <Copy className="h-3.5 w-3.5 text-primary shrink-0" /> Clone Campaign
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILS (Sections 1, 2, 3, 17, 33, 34, 36) */}
        {activeTab === "details" && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    1. Form Information &amp; MAICW Control Master
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Controlled ERP master and transaction parameters with audit classification standard.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">Section 1 &amp; 2</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Campaign ID <MAICWBadge type="A" />
                  </label>
                  <input readOnly value="CMP-ID-9082" className="mt-1 w-full rounded border bg-muted/40 px-2.5 py-1.5 font-mono" />
                  <span className="text-[10px] text-muted-foreground">Unique campaign database primary key</span>
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Campaign Code <MAICWBadge type="A" />
                  </label>
                  <input readOnly value="CMP-2026-001" className="mt-1 w-full rounded border bg-muted/40 px-2.5 py-1.5 font-mono font-bold text-primary" />
                  <span className="text-[10px] text-muted-foreground">Controlled ERP transaction sequence</span>
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Campaign Name <MAICWBadge type="M" />
                  </label>
                  <input defaultValue="Future Ready EV Fleets" className="mt-1 w-full rounded border px-2.5 py-1.5 font-semibold" />
                  <span className="text-[10px] text-muted-foreground">Public-facing / internal title</span>
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Campaign Type <MAICWBadge type="M" />
                  </label>
                  <select className="mt-1 w-full rounded border px-2.5 py-1.5">
                    <option>Lead Generation</option>
                    <option>Brand Awareness</option>
                    <option>Product Launch</option>
                    <option>Demand Generation</option>
                    <option>Customer Acquisition</option>
                    <option>Customer Retention</option>
                    <option>Cross-Sell / Up-Sell</option>
                    <option>Partner Marketing</option>
                    <option>Event / Trade Show</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Marketing Program <MAICWBadge type="I" />
                  </label>
                  <input defaultValue="EV Charging Expansion 2026" className="mt-1 w-full rounded border px-2.5 py-1.5" />
                  <span className="text-[10px] text-muted-foreground">Parent corporate marketing program</span>
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Marketing Objective <MAICWBadge type="I" />
                  </label>
                  <input defaultValue="Generate qualified leads from fleet operators" className="mt-1 w-full rounded border px-2.5 py-1.5" />
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Business Unit <MAICWBadge type="M" />
                  </label>
                  <select className="mt-1 w-full rounded border px-2.5 py-1.5">
                    <option>Charging Solutions BU</option>
                    <option>Power Electronics BU</option>
                    <option>Commercial Fleet BU</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Product / Service <MAICWBadge type="C" />
                  </label>
                  <input defaultValue="Autonomous W-EVSE 150kW Pad" className="mt-1 w-full rounded border px-2.5 py-1.5" />
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Campaign Manager <MAICWBadge type="M" />
                  </label>
                  <input defaultValue="Arun Kumar (Marketing Manager)" className="mt-1 w-full rounded border px-2.5 py-1.5" />
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Version <MAICWBadge type="A" />
                  </label>
                  <input readOnly value="1.0" className="mt-1 w-full rounded border bg-muted/40 px-2.5 py-1.5 font-mono" />
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Workflow Status <MAICWBadge type="W" />
                  </label>
                  <select className="mt-1 w-full rounded border px-2.5 py-1.5 font-bold text-emerald-600">
                    <option>Active</option>
                    <option>Planned</option>
                    <option>Draft</option>
                    <option>Review</option>
                    <option>Approved</option>
                    <option>Completed</option>
                    <option>Closed</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Confidentiality <MAICWBadge type="C" />
                  </label>
                  <select className="mt-1 w-full rounded border px-2.5 py-1.5">
                    <option>Internal</option>
                    <option>Public</option>
                    <option>Confidential</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Campaign Objective & KPI Mapping (Section 3) */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    3. Strategic Objective Classification &amp; KPI Mapping
                  </h3>
                  <p className="text-xs text-muted-foreground">Standardized ERP KPI tracking matrix across campaign types.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 3</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      <th className="pb-2 font-semibold">Objective</th>
                      <th className="pb-2 font-semibold">Primary KPI</th>
                      <th className="pb-2 font-semibold text-right">Target</th>
                      <th className="pb-2 font-semibold text-right">Current Actual</th>
                      <th className="pb-2 font-semibold text-right">Achievement %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Awareness</td>
                      <td className="py-2.5 text-muted-foreground">Reach / Impressions</td>
                      <td className="py-2.5 text-right font-mono">500K</td>
                      <td className="py-2.5 text-right font-mono font-bold text-foreground">420K</td>
                      <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">84.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Engagement</td>
                      <td className="py-2.5 text-muted-foreground">Engagement Rate / Clicks</td>
                      <td className="py-2.5 text-right font-mono">25K</td>
                      <td className="py-2.5 text-right font-mono font-bold text-foreground">22K</td>
                      <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">88.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Lead Generation</td>
                      <td className="py-2.5 text-muted-foreground">Qualified Leads</td>
                      <td className="py-2.5 text-right font-mono">500</td>
                      <td className="py-2.5 text-right font-mono font-bold text-foreground">460</td>
                      <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">92.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Demand Generation</td>
                      <td className="py-2.5 text-muted-foreground">MQLs / SQLs</td>
                      <td className="py-2.5 text-right font-mono">200 / 100</td>
                      <td className="py-2.5 text-right font-mono font-bold text-foreground">185 / 82</td>
                      <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">92.5% / 82.0%</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Sales Conversion</td>
                      <td className="py-2.5 text-muted-foreground">Opportunities / Revenue</td>
                      <td className="py-2.5 text-right font-mono">50 / ₹1.0 Cr</td>
                      <td className="py-2.5 text-right font-mono font-bold text-foreground">44 / ₹85.0 L</td>
                      <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">88.0% / 85.0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Campaign Schedule & Governance (Section 17 & 34) */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    17. Activity Schedule &amp; Lifecycle Milestones
                  </h3>
                  <p className="text-xs text-muted-foreground">Gantt milestone controls and operational owners.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 17</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      <th className="pb-2 font-semibold">Activity</th>
                      <th className="pb-2 font-semibold">Start</th>
                      <th className="pb-2 font-semibold">End</th>
                      <th className="pb-2 font-semibold">Owner</th>
                      <th className="pb-2 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr>
                      <td className="py-2 font-sans font-semibold text-foreground">Campaign Planning</td>
                      <td className="py-2 text-muted-foreground">01-Sep-2026</td>
                      <td className="py-2 text-muted-foreground">05-Sep-2026</td>
                      <td className="py-2 font-sans text-muted-foreground">Marketing Ops</td>
                      <td className="py-2 text-right"><span className="text-emerald-600 font-bold">Complete</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-semibold text-foreground">Creative Development</td>
                      <td className="py-2 text-muted-foreground">03-Sep-2026</td>
                      <td className="py-2 text-muted-foreground">10-Sep-2026</td>
                      <td className="py-2 font-sans text-muted-foreground">Creative Team</td>
                      <td className="py-2 text-right"><span className="text-emerald-600 font-bold">Complete</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-semibold text-foreground">Landing Page Activation</td>
                      <td className="py-2 text-muted-foreground">05-Sep-2026</td>
                      <td className="py-2 text-muted-foreground">12-Sep-2026</td>
                      <td className="py-2 font-sans text-muted-foreground">Digital Team</td>
                      <td className="py-2 text-right"><span className="text-emerald-600 font-bold">Complete</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-semibold text-foreground">Campaign Launch</td>
                      <td className="py-2 text-muted-foreground">15-Sep-2026</td>
                      <td className="py-2 text-muted-foreground">15-Sep-2026</td>
                      <td className="py-2 font-sans text-muted-foreground">Marketing Lead</td>
                      <td className="py-2 text-right"><span className="text-emerald-600 font-bold">Complete</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-semibold text-foreground">Lead Generation</td>
                      <td className="py-2 text-muted-foreground">15-Sep-2026</td>
                      <td className="py-2 text-muted-foreground">30-Sep-2026</td>
                      <td className="py-2 font-sans text-muted-foreground">Demand Gen</td>
                      <td className="py-2 text-right"><span className="text-primary font-bold">In Progress</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-semibold text-foreground">Lead Qualification</td>
                      <td className="py-2 text-muted-foreground">16-Sep-2026</td>
                      <td className="py-2 text-muted-foreground">05-Oct-2026</td>
                      <td className="py-2 font-sans text-muted-foreground">Inside Sales</td>
                      <td className="py-2 text-right"><span className="text-primary font-bold">In Progress</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-semibold text-foreground">Conversion &amp; Deal Closing</td>
                      <td className="py-2 text-muted-foreground">20-Sep-2026</td>
                      <td className="py-2 text-muted-foreground">31-Oct-2026</td>
                      <td className="py-2 font-sans text-muted-foreground">Sales Team</td>
                      <td className="py-2 text-right"><span className="text-muted-foreground font-bold">Pending</span></td>
                    </tr>
                    <tr>
                      <td className="py-2 font-sans font-semibold text-foreground">Campaign Review &amp; Closure</td>
                      <td className="py-2 text-muted-foreground">01-Nov-2026</td>
                      <td className="py-2 text-muted-foreground">05-Nov-2026</td>
                      <td className="py-2 font-sans text-muted-foreground">Management Board</td>
                      <td className="py-2 text-right"><span className="text-muted-foreground font-bold">Pending</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TARGET AUDIENCE (Sections 4 & 5) */}
        {activeTab === "target-audience" && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    4. Target Audience Definition &amp; Segments
                  </h3>
                  <p className="text-xs text-muted-foreground">Demographic, firmographic, and intent filters.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 4</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Audience ID <MAICWBadge type="A" />
                  </label>
                  <input readOnly value="AUD-2026-FLT01" className="mt-1 w-full rounded border bg-muted/40 px-2.5 py-1.5 font-mono" />
                </div>
                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Audience Name <MAICWBadge type="M" />
                  </label>
                  <input defaultValue="South India Commercial EV Fleets" className="mt-1 w-full rounded border px-2.5 py-1.5" />
                </div>
                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Customer Segment <MAICWBadge type="M" />
                  </label>
                  <input defaultValue="Fleet Operators, Logistics, Depot Owners" className="mt-1 w-full rounded border px-2.5 py-1.5" />
                </div>
                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Industry Verticals <MAICWBadge type="M" />
                  </label>
                  <input defaultValue="Logistics, E-commerce, Public Transit, Warehousing" className="mt-1 w-full rounded border px-2.5 py-1.5" />
                </div>
                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Company Size <MAICWBadge type="I" />
                  </label>
                  <select className="mt-1 w-full rounded border px-2.5 py-1.5">
                    <option>50 - 500 Fleet Vehicles</option>
                    <option>500+ Enterprise Fleet</option>
                    <option>10 - 50 Local Fleet</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Audience Size <MAICWBadge type="C" />
                  </label>
                  <input readOnly value="12,400 Target Accounts" className="mt-1 w-full rounded border bg-muted/40 px-2.5 py-1.5 font-bold text-primary" />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60">
                <span className="text-xs font-semibold text-foreground block mb-2">
                  Customer Type Qualifications
                </span>
                <div className="flex flex-wrap gap-4 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Existing Customers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Prospects</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Channel Partners</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Fleet Operators</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded text-primary" />
                    <span>Government / GeM</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Customer Persona Card (Section 5) */}
            <div className="card-soft p-5 border-blue-500/20 bg-blue-500/5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> 5. Target Customer Persona
                  </h3>
                  <p className="text-xs text-muted-foreground">Fleet Operations Director Persona Profile.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 5</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-card border border-border/60">
                  <span className="font-semibold text-foreground block">Persona Name</span>
                  <p className="mt-1 text-muted-foreground">Rajesh Nair — VP Fleet Operations</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/60">
                  <span className="font-semibold text-foreground block">Pain Point</span>
                  <p className="mt-1 text-muted-foreground">Cable wear &amp; tear, connector breakage, long charging dwell times.</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/60">
                  <span className="font-semibold text-foreground block">Buying Trigger</span>
                  <p className="mt-1 text-muted-foreground">High maintenance costs and depot electrification mandates.</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/60">
                  <span className="font-semibold text-foreground block">Value Proposition</span>
                  <p className="mt-1 text-muted-foreground">Zero-touch inductive autonomous charging with 99.8% uptime SLA.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONTENT & CREATIVES (Sections 6, 7, 8) */}
        {activeTab === "content-creatives" && (
          <div className="space-y-5">
            {/* Section 6 & 7: Messaging & Offer */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    6 &amp; 7. Campaign Offer &amp; Messaging Framework
                  </h3>
                  <p className="text-xs text-muted-foreground">Problem → Solution → Value Proposition → Proof → Offer → CTA.</p>
                </div>
                <Badge variant="outline" className="text-xs">Framework</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Offer Type <MAICWBadge type="M" />
                  </label>
                  <select className="mt-1 w-full rounded border px-2.5 py-1.5">
                    <option>Free Site Survey &amp; Technical Assessment</option>
                    <option>Demo Pilot Installation</option>
                    <option>Product Promotion / Discount</option>
                    <option>Webinar &amp; Whitepaper</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Primary CTA <MAICWBadge type="M" />
                  </label>
                  <input defaultValue="Book Depot Site Survey" className="mt-1 w-full rounded border px-2.5 py-1.5 font-bold text-primary" />
                </div>

                <div>
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Destination Landing Page <MAICWBadge type="I" />
                  </label>
                  <input defaultValue="https://magnertia.com/solutions/wireless-fleet-charging" className="mt-1 w-full rounded border px-2.5 py-1.5 font-mono" />
                </div>

                <div className="col-span-3">
                  <label className="font-semibold text-foreground flex items-center gap-1.5">
                    Primary Headline &amp; Core Value Proposition <MAICWBadge type="M" />
                  </label>
                  <input defaultValue="Transform Depot Turnaround with 100% Autonomous Wireless EV Fast Charging" className="mt-1 w-full rounded border px-2.5 py-1.5 font-semibold" />
                </div>
              </div>
            </div>

            {/* Section 8: Content Management Table */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    8. Content Asset Inventory
                  </h3>
                  <p className="text-xs text-muted-foreground">Creative files, banners, copy versions, and approval states.</p>
                </div>
                <Button size="sm" className="h-7 text-xs gap-1">
                  <Plus className="h-3 w-3" /> Add Creative
                </Button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      <th className="pb-2 font-semibold">Content ID</th>
                      <th className="pb-2 font-semibold">Type</th>
                      <th className="pb-2 font-semibold">Title</th>
                      <th className="pb-2 font-semibold">Format</th>
                      <th className="pb-2 font-semibold">Approver</th>
                      <th className="pb-2 font-semibold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 font-mono text-primary font-bold">CNT-2026-001</td>
                      <td className="py-2.5 font-semibold">Campaign Banner</td>
                      <td className="py-2.5">Powering Smarter Fleets (16:9 Hero)</td>
                      <td className="py-2.5 font-mono text-muted-foreground">JPG / SVG</td>
                      <td className="py-2.5 text-muted-foreground">Priya S</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Published</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono text-primary font-bold">CNT-2026-002</td>
                      <td className="py-2.5 font-semibold">Whitepaper</td>
                      <td className="py-2.5">Autonomous Wireless EV Charging for Commercial Fleets</td>
                      <td className="py-2.5 font-mono text-muted-foreground">PDF (18 pages)</td>
                      <td className="py-2.5 text-muted-foreground">Arun Kumar</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Published</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono text-primary font-bold">CNT-2026-003</td>
                      <td className="py-2.5 font-semibold">Email Template</td>
                      <td className="py-2.5">Fleet Electrification Survey Invite</td>
                      <td className="py-2.5 font-mono text-muted-foreground">HTML / MJML</td>
                      <td className="py-2.5 text-muted-foreground">Priya S</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Sent</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono text-primary font-bold">CNT-2026-004</td>
                      <td className="py-2.5 font-semibold">Video Showcase</td>
                      <td className="py-2.5">Depot Wireless Fast Charging in Action</td>
                      <td className="py-2.5 font-mono text-muted-foreground">MP4 (4K 90s)</td>
                      <td className="py-2.5 text-muted-foreground">Arun Kumar</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Published</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CHANNELS (Sections 9 & 10) */}
        {activeTab === "channels" && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    10. Channel Plan &amp; Commercial Quota
                  </h3>
                  <p className="text-xs text-muted-foreground">Detailed allocation of spend, reach, MQL, SQL, and pipeline value.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 10</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      <th className="pb-2 font-semibold">Channel</th>
                      <th className="pb-2 font-semibold text-right">Budget</th>
                      <th className="pb-2 font-semibold text-right">Planned Reach</th>
                      <th className="pb-2 font-semibold text-right">Leads</th>
                      <th className="pb-2 font-semibold text-right">MQL</th>
                      <th className="pb-2 font-semibold text-right">SQL</th>
                      <th className="pb-2 font-semibold text-right">Revenue Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr>
                      <td className="py-2.5 font-sans font-semibold text-foreground">LinkedIn</td>
                      <td className="py-2.5 text-right text-muted-foreground">₹2,00,000</td>
                      <td className="py-2.5 text-right text-muted-foreground">100K</td>
                      <td className="py-2.5 text-right font-bold text-foreground">150</td>
                      <td className="py-2.5 text-right text-muted-foreground">60</td>
                      <td className="py-2.5 text-right text-muted-foreground">25</td>
                      <td className="py-2.5 text-right font-bold text-amber-600">₹30.0 L</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-semibold text-foreground">Google Ads</td>
                      <td className="py-2.5 text-right text-muted-foreground">₹1,50,000</td>
                      <td className="py-2.5 text-right text-muted-foreground">150K</td>
                      <td className="py-2.5 text-right font-bold text-foreground">180</td>
                      <td className="py-2.5 text-right text-muted-foreground">70</td>
                      <td className="py-2.5 text-right text-muted-foreground">30</td>
                      <td className="py-2.5 text-right font-bold text-amber-600">₹35.0 L</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-semibold text-foreground">Email Marketing</td>
                      <td className="py-2.5 text-right text-muted-foreground">₹50,000</td>
                      <td className="py-2.5 text-right text-muted-foreground">25K</td>
                      <td className="py-2.5 text-right font-bold text-foreground">100</td>
                      <td className="py-2.5 text-right text-muted-foreground">45</td>
                      <td className="py-2.5 text-right text-muted-foreground">20</td>
                      <td className="py-2.5 text-right font-bold text-amber-600">₹20.0 L</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-semibold text-foreground">Industry Events</td>
                      <td className="py-2.5 text-right text-muted-foreground">₹3,00,000</td>
                      <td className="py-2.5 text-right text-muted-foreground">5K</td>
                      <td className="py-2.5 text-right font-bold text-foreground">120</td>
                      <td className="py-2.5 text-right text-muted-foreground">60</td>
                      <td className="py-2.5 text-right text-muted-foreground">35</td>
                      <td className="py-2.5 text-right font-bold text-amber-600">₹50.0 L</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-sans font-semibold text-foreground">Partner Marketing</td>
                      <td className="py-2.5 text-right text-muted-foreground">₹1,00,000</td>
                      <td className="py-2.5 text-right text-muted-foreground">20K</td>
                      <td className="py-2.5 text-right font-bold text-foreground">80</td>
                      <td className="py-2.5 text-right text-muted-foreground">40</td>
                      <td className="py-2.5 text-right text-muted-foreground">20</td>
                      <td className="py-2.5 text-right font-bold text-amber-600">₹25.0 L</td>
                    </tr>
                    <tr className="bg-muted/40 font-bold">
                      <td className="py-2.5 font-sans text-foreground">Total / Portfolio</td>
                      <td className="py-2.5 text-right text-foreground">₹8,00,000</td>
                      <td className="py-2.5 text-right text-foreground">300K</td>
                      <td className="py-2.5 text-right text-foreground">630</td>
                      <td className="py-2.5 text-right text-foreground">275</td>
                      <td className="py-2.5 text-right text-foreground">130</td>
                      <td className="py-2.5 text-right text-emerald-600">₹1.60 Cr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: BUDGET & FINANCE (Sections 11 & 12) */}
        {activeTab === "budget" && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    11. Campaign Budget Heads &amp; Financial Control
                  </h3>
                  <p className="text-xs text-muted-foreground">Approved spending controls, actuals, commitments, and utilization.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 11 &amp; 12</Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <div className="text-base font-extrabold text-foreground">₹8,00,000</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Approved Budget</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <div className="text-base font-extrabold text-foreground">₹7,50,000</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Planned Spend</div>
                </div>
                <div className="rounded-lg bg-primary/5 p-3 text-center border border-primary/20">
                  <div className="text-base font-extrabold text-primary">₹6,20,000</div>
                  <div className="text-[11px] text-primary font-semibold mt-0.5">Actual Spend</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <div className="text-base font-extrabold text-foreground">₹80,000</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Committed Spend</div>
                </div>
                <div className="rounded-lg bg-emerald-500/5 p-3 text-center border border-emerald-500/20">
                  <div className="text-base font-extrabold text-emerald-600">₹1,00,000</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Available Budget</div>
                </div>
                <div className="rounded-lg bg-blue-500/5 p-3 text-center border border-blue-500/20">
                  <div className="text-base font-extrabold text-blue-600">77.5%</div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Budget Utilization</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-xs text-foreground mb-2">Cost &amp; Acquisition Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded border bg-card">
                    <span className="text-muted-foreground block text-[11px]">Cost per Lead (CPL)</span>
                    <span className="text-base font-bold text-foreground">₹1,333</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Spend ÷ Total Leads</span>
                  </div>
                  <div className="p-3 rounded border bg-card">
                    <span className="text-muted-foreground block text-[11px]">Cost per MQL</span>
                    <span className="text-base font-bold text-foreground">₹3,351</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Spend ÷ Vetted MQLs</span>
                  </div>
                  <div className="p-3 rounded border bg-card">
                    <span className="text-muted-foreground block text-[11px]">Customer Acquisition Cost (CAC)</span>
                    <span className="text-base font-bold text-foreground">₹36,470</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Spend ÷ New Customers</span>
                  </div>
                  <div className="p-3 rounded border bg-card">
                    <span className="text-muted-foreground block text-[11px]">Return on Ad Spend (ROAS)</span>
                    <span className="text-base font-bold text-emerald-600">13.7x</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Attributed Rev ÷ Spend</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: LEADS & CONVERSION (Sections 14, 15, 16) */}
        {activeTab === "leads-conversion" && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    14 &amp; 15. Lead Generation &amp; Campaign-to-CRM Traceability
                  </h3>
                  <p className="text-xs text-muted-foreground">Every generated lead retains Campaign ID CMP-2026-001 for attribution.</p>
                </div>
                <Badge variant="outline" className="text-xs">CRM Integration</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      <th className="pb-2 font-semibold">Lead ID</th>
                      <th className="pb-2 font-semibold">Contact &amp; Company</th>
                      <th className="pb-2 font-semibold">Segment</th>
                      <th className="pb-2 font-semibold">Lead Score</th>
                      <th className="pb-2 font-semibold">Status</th>
                      <th className="pb-2 font-semibold">Assigned Rep</th>
                      <th className="pb-2 font-semibold text-right">CRM Opportunity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr>
                      <td className="py-2.5 text-primary font-bold">LEAD-8841</td>
                      <td className="py-2.5 font-sans">
                        <div className="font-semibold text-foreground">Suresh Menon</div>
                        <div className="text-[11px] text-muted-foreground">Kochi Transit Fleet Ltd</div>
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">Commercial Fleet</td>
                      <td className="py-2.5 font-bold text-emerald-600">92 / 100</td>
                      <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">SQL</span></td>
                      <td className="py-2.5 font-sans text-muted-foreground">Karthik R</td>
                      <td className="py-2.5 text-right text-primary font-bold">OPP-2026-092</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-primary font-bold">LEAD-8842</td>
                      <td className="py-2.5 font-sans">
                        <div className="font-semibold text-foreground">Anand Varma</div>
                        <div className="text-[11px] text-muted-foreground">Bangalore Logistics Hub</div>
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">Warehouse &amp; Depot</td>
                      <td className="py-2.5 font-bold text-blue-600">86 / 100</td>
                      <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 text-[10px] font-bold">MQL</span></td>
                      <td className="py-2.5 font-sans text-muted-foreground">Deepa Nair</td>
                      <td className="py-2.5 text-right text-primary font-bold">OPP-2026-095</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 text-primary font-bold">LEAD-8843</td>
                      <td className="py-2.5 font-sans">
                        <div className="font-semibold text-foreground">Vikramaditya Rao</div>
                        <div className="text-[11px] text-muted-foreground">Chennai Port Express</div>
                      </td>
                      <td className="py-2.5 font-sans text-muted-foreground">Heavy Commercial</td>
                      <td className="py-2.5 font-bold text-emerald-600">95 / 100</td>
                      <td className="py-2.5"><span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-bold">Opportunity</span></td>
                      <td className="py-2.5 font-sans text-muted-foreground">Karthik R</td>
                      <td className="py-2.5 text-right text-primary font-bold">OPP-2026-088</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: ANALYTICS (Sections 21 & 22) */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    21 &amp; 22. Real-Time Monitoring &amp; Stage Conversion Analytics
                  </h3>
                  <p className="text-xs text-muted-foreground">Stage dropoff percentages and end-to-end velocity.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 22</Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <div className="text-base font-extrabold text-foreground">0.10%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Reach-to-Lead</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <div className="text-base font-extrabold text-foreground">37.0%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Lead-to-MQL</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <div className="text-base font-extrabold text-foreground">44.3%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">MQL-to-SQL</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <div className="text-base font-extrabold text-foreground">53.7%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">SQL-to-Opportunity</div>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <div className="text-base font-extrabold text-foreground">38.6%</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Opp-to-Customer</div>
                </div>
                <div className="rounded-lg bg-emerald-500/5 p-3 text-center border border-emerald-500/20">
                  <div className="text-base font-extrabold text-emerald-600">3.40%</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Lead-to-Customer</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 9: ROI & ATTRIBUTION (Sections 23, 24, 25, 26) */}
        {activeTab === "roi" && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    23 &amp; 24. Revenue Attribution &amp; Marketing ROI Master
                  </h3>
                  <p className="text-xs text-muted-foreground">Multi-touch attribution models and audited financial returns.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 23 &amp; 24</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded border bg-card">
                  <span className="text-muted-foreground text-[11px] block">Attributed Revenue</span>
                  <span className="text-lg font-bold text-amber-600">₹85,00,000</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">17 closed deals</span>
                </div>
                <div className="p-3 rounded border bg-card">
                  <span className="text-muted-foreground text-[11px] block">Gross Margin Attributed</span>
                  <span className="text-lg font-bold text-foreground">₹34,00,000</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">40.0% gross margin</span>
                </div>
                <div className="p-3 rounded border bg-card">
                  <span className="text-muted-foreground text-[11px] block">Total Campaign Spend</span>
                  <span className="text-lg font-bold text-foreground">₹6,20,000</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">Audited actual cost</span>
                </div>
                <div className="p-3 rounded border bg-card border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-emerald-600 text-[11px] block font-semibold">Net Marketing ROI</span>
                  <span className="text-lg font-bold text-emerald-600">448% (4.5x)</span>
                  <span className="text-[10px] text-muted-foreground block mt-0.5">(Profit - Cost) ÷ Cost</span>
                </div>
              </div>
            </div>

            {/* A/B Testing Experiments (Section 26) */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    26. A/B Testing Experiments
                  </h3>
                  <p className="text-xs text-muted-foreground">Experiment hypotheses, variants, sample sizes, and winning decisions.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 26</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      <th className="pb-2 font-semibold">Test Element</th>
                      <th className="pb-2 font-semibold">Variant A (Control)</th>
                      <th className="pb-2 font-semibold">Variant B</th>
                      <th className="pb-2 font-semibold">Metric</th>
                      <th className="pb-2 font-semibold">Result</th>
                      <th className="pb-2 font-semibold text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Headline</td>
                      <td className="py-2.5">Wireless Charging for EV Fleets</td>
                      <td className="py-2.5 font-semibold text-primary">Powering Smarter Fleets</td>
                      <td className="py-2.5 font-mono">CTR</td>
                      <td className="py-2.5 text-emerald-600 font-bold">+24% CTR on B</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Deploy B</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">CTA Button</td>
                      <td className="py-2.5">Contact Sales</td>
                      <td className="py-2.5 font-semibold text-primary">Request Site Survey</td>
                      <td className="py-2.5 font-mono">Form Conv %</td>
                      <td className="py-2.5 text-emerald-600 font-bold">+38% Conv on B</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Deploy B</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Hero Creative</td>
                      <td className="py-2.5">3D Render Graphics</td>
                      <td className="py-2.5 font-semibold text-primary">Depot Real Photo Banner</td>
                      <td className="py-2.5 font-mono">Engagement</td>
                      <td className="py-2.5 text-emerald-600 font-bold">+19% Time on Page</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Deploy B</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 10: APPROVAL WORKFLOW (Sections 18, 19, 20) */}
        {activeTab === "approval-workflow" && (
          <div className="space-y-5">
            {/* Approval Levels */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    19. Approval Levels &amp; Governance Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">Multi-tier authorization before campaign budget commitment.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 19</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      <th className="pb-2 font-semibold">Level</th>
                      <th className="pb-2 font-semibold">Approver Role</th>
                      <th className="pb-2 font-semibold">Name</th>
                      <th className="pb-2 font-semibold">Date</th>
                      <th className="pb-2 font-semibold text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 font-mono text-muted-foreground">L1</td>
                      <td className="py-2.5 font-semibold">Campaign Planner</td>
                      <td className="py-2.5 text-muted-foreground">Arun Kumar</td>
                      <td className="py-2.5 font-mono text-muted-foreground">01-Sep-2026</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Approved</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono text-muted-foreground">L2</td>
                      <td className="py-2.5 font-semibold">Commercial Review</td>
                      <td className="py-2.5 text-muted-foreground">Vikram Singh (CSO)</td>
                      <td className="py-2.5 font-mono text-muted-foreground">04-Sep-2026</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Approved</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono text-muted-foreground">L3</td>
                      <td className="py-2.5 font-semibold">Budget Review</td>
                      <td className="py-2.5 text-muted-foreground">Siddharth Rao (Finance)</td>
                      <td className="py-2.5 font-mono text-muted-foreground">06-Sep-2026</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Approved</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono text-muted-foreground">L4</td>
                      <td className="py-2.5 font-semibold">Brand Review</td>
                      <td className="py-2.5 text-muted-foreground">Priya S (Brand Head)</td>
                      <td className="py-2.5 font-mono text-muted-foreground">08-Sep-2026</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Approved</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-mono text-muted-foreground">L5</td>
                      <td className="py-2.5 font-semibold">Executive Authorization</td>
                      <td className="py-2.5 text-muted-foreground">Managing Director</td>
                      <td className="py-2.5 font-mono text-muted-foreground">12-Sep-2026</td>
                      <td className="py-2.5 text-right"><span className="text-emerald-600 font-bold">Approved</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Execution Checklist (Section 20) */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    20. Launch Execution Readiness Checklist (12 Points)
                  </h3>
                  <p className="text-xs text-muted-foreground">Mandatory gate conditions required before live traffic activation.</p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">12 / 12 Verified</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {[
                  { id: "chk1", label: "Campaign approved by management" },
                  { id: "chk2", label: "Budget released & authorized in Finance" },
                  { id: "chk3", label: "Target audience confirmed & scrubbed" },
                  { id: "chk4", label: "Creative assets brand approved" },
                  { id: "chk5", label: "Landing page active with SSL & CDN" },
                  { id: "chk6", label: "UTM tracking parameters configured" },
                  { id: "chk7", label: "CRM campaign master created" },
                  { id: "chk8", label: "Lead routing & sales SLA configured" },
                  { id: "chk9", label: "Paid channels activated & funded" },
                  { id: "chk10", label: "Lead capture end-to-end tested" },
                  { id: "chk11", label: "Sales team briefed on qualification" },
                  { id: "chk12", label: "AI campaign monitoring initialized" },
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => toggleChecklist(item.id)}
                    className={cn(
                      "p-3 rounded-lg border flex items-center gap-2.5 cursor-pointer transition-colors",
                      checklist[item.id]
                        ? "bg-emerald-500/5 border-emerald-500/30 text-foreground"
                        : "bg-muted/30 border-border text-muted-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "h-4 w-4 rounded flex items-center justify-center text-white shrink-0",
                        checklist[item.id] ? "bg-emerald-600" : "bg-muted border border-border"
                      )}
                    >
                      {checklist[item.id] && <Check className="h-3 w-3" />}
                    </div>
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 11: HISTORY & AI INTELLIGENCE (Sections 27, 28, 30) */}
        {activeTab === "history" && (
          <div className="space-y-5">
            {/* AI Intelligence (Section 27) */}
            <div className="card-soft p-5 border-purple-500/20 bg-gradient-to-br from-card to-purple-500/5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-600" /> 27. AI Campaign Intelligence &amp; Predictive Analytics
                  </h3>
                  <p className="text-xs text-muted-foreground">Real-time propensity, anomaly detection, and budget optimization recommendations.</p>
                </div>
                <Badge className="bg-purple-600 text-white">AI Powered</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-card border border-border/60">
                  <span className="font-bold text-foreground block">Lead-Quality Prediction</span>
                  <p className="mt-1 text-muted-foreground">Tamil Nadu fleet inquiries have an 88% probability of advancing to SQL within 5 business days.</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/60">
                  <span className="font-bold text-foreground block">Budget Allocation Recommendation</span>
                  <p className="mt-1 text-muted-foreground">Shift ₹30,000 from Display advertising to Google Paid Search to maximize high-intent depot queries.</p>
                </div>
                <div className="p-3 rounded-lg bg-card border border-border/60">
                  <span className="font-bold text-foreground block">Campaign Anomaly Detection</span>
                  <p className="mt-1 text-muted-foreground">Zero tracking failures detected. Cost per lead decreased by 14% over the past 7 days.</p>
                </div>
              </div>
            </div>

            {/* Campaign Risk Management (Section 28) */}
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" /> 28. Campaign Risk Management Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">Proactive contingency strategies and response protocols.</p>
                </div>
                <Badge variant="outline" className="text-xs">Section 28</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground">
                      <th className="pb-2 font-semibold">Identified Risk</th>
                      <th className="pb-2 font-semibold">Probability</th>
                      <th className="pb-2 font-semibold">Impact</th>
                      <th className="pb-2 font-semibold">Mitigation Strategy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Low Lead Volume</td>
                      <td className="py-2.5"><span className="text-amber-600 font-semibold">Medium</span></td>
                      <td className="py-2.5"><span className="text-red-600 font-semibold">High</span></td>
                      <td className="py-2.5 text-muted-foreground">Audience broadening and channel budget reallocation to Google Ads.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Low Lead Quality</td>
                      <td className="py-2.5"><span className="text-amber-600 font-semibold">Medium</span></td>
                      <td className="py-2.5"><span className="text-red-600 font-semibold">High</span></td>
                      <td className="py-2.5 text-muted-foreground">Refine job title targeting; enforce mandatory depot vehicle count field.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Sales Follow-up Delay</td>
                      <td className="py-2.5"><span className="text-amber-600 font-semibold">Medium</span></td>
                      <td className="py-2.5"><span className="text-red-600 font-semibold">High</span></td>
                      <td className="py-2.5 text-muted-foreground">Automated CRM SLA alerts triggering escalation after 4 hours of inactivity.</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-foreground">Budget Overrun</td>
                      <td className="py-2.5"><span className="text-emerald-600 font-semibold">Low</span></td>
                      <td className="py-2.5"><span className="text-red-600 font-semibold">High</span></td>
                      <td className="py-2.5 text-muted-foreground">Automated daily spend caps and weekly CFO reconciliation.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 12: RELATED RECORDS & ERP INTEGRATION (Sections 31 & 32) */}
        {activeTab === "related-records" && (
          <div className="space-y-5">
            <div className="card-soft p-5">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    32. Downstream Enterprise ERP Integrations
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ultimate ERP Chain: Marketing Strategy → Campaign → Audience → Channel → Lead → CRM → Sales → Revenue → ROI.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs font-mono">Traceability Master</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-lg border border-border/60 bg-card hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">CRM Management</span>
                    <Badge variant="outline" className="text-[10px]">Active Link</Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Connected to 44 Active Opportunities and 500 Leads. Campaign ID retained on all deals.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => { window.location.href = "/management/crm-management/opportunity-management"; }}
                    className="p-0 h-auto text-primary text-xs font-semibold mt-2"
                  >
                    Open CRM Opportunities <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </div>

                <div className="p-3.5 rounded-lg border border-border/60 bg-card hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Sales Management</span>
                    <Badge variant="outline" className="text-[10px]">Active Link</Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Attributed to 17 Confirmed Sales Orders generating ₹85.0 L in closed gross contract value.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => { window.location.href = "/management/sales-management/sales-orders"; }}
                    className="p-0 h-auto text-primary text-xs font-semibold mt-2"
                  >
                    Open Sales Orders <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </div>

                <div className="p-3.5 rounded-lg border border-border/60 bg-card hover:border-primary/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Finance &amp; Budgeting</span>
                    <Badge variant="outline" className="text-[10px]">Reconciled</Badge>
                  </div>
                  <p className="mt-2 text-muted-foreground">
                    Cost Center Marketing (CC-410). ₹6.20L actual spend reconciled with general ledger.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => { window.location.href = "/management/finance/budgeting"; }}
                    className="p-0 h-auto text-primary text-xs font-semibold mt-2"
                  >
                    Open Finance Budgeting <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default CampaignsManagementPage;
