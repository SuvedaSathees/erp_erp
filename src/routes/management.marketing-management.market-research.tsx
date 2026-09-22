import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  BarChart3,
  Users,
  FileText,
  Target,
  Building2,
  Lightbulb,
  Save,
  Share2,
  Calendar,
  Plus,
  Info,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  IndianRupee,
  Layers,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Line,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/market-research"
)({
  head: () => ({
    meta: [
      { title: "Market Research · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Market Research Workspace for industry studies, TAM sizing, competitor monitoring, customer pain points, and strategic market intelligence.",
      },
    ],
  }),
  component: MarketResearchManagementPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for governance & research validation", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
    A: { label: "A", desc: "Auto-generated / System Controlled Identifier", bg: "bg-slate-500/10 border-slate-500/30", text: "text-slate-600 dark:text-slate-400" },
    I: { label: "I", desc: "Information / Lookup Master Link", bg: "bg-blue-500/10 border-blue-500/30", text: "text-blue-600 dark:text-blue-400" },
    C: { label: "C", desc: "Calculated Formula / Derived Dynamic Metric", bg: "bg-purple-500/10 border-purple-500/30", text: "text-purple-600 dark:text-purple-400" },
    W: { label: "W", desc: "Workflow Stage Gate Controlled", bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-600 dark:text-amber-400" },
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

const RESEARCH_TABS = [
  { id: "studies", label: "Research Studies" },
  { id: "tam-sizing", label: "TAM & Growth Sizing" },
  { id: "insights", label: "Customer Insights & Trends" },
];

const MARKET_GROWTH_DATA = [
  { year: "2024", marketSize: 8000, growthRate: 22 },
  { year: "2025", marketSize: 12000, growthRate: 25 },
  { year: "2026", marketSize: 18000, growthRate: 28 },
  { year: "2027", marketSize: 26000, growthRate: 34 },
  { year: "2028", marketSize: 35000, growthRate: 38 },
  { year: "2029", marketSize: 42000, growthRate: 44 },
  { year: "2030", marketSize: 50000, growthRate: 46 },
];

const CUSTOMER_SEGMENTS_DATA = [
  { name: "Fleet Operators", value: 28, count: 350, color: "#2563eb" },
  { name: "Real Estate Owners", value: 18, count: 225, color: "#06b6d4" },
  { name: "EV Users", value: 16, count: 200, color: "#eab308" },
  { name: "Charging Operators", value: 12, count: 150, color: "#10b981" },
  { name: "OEMs", value: 10, count: 125, color: "#f97316" },
  { name: "Government / GeM", value: 8, count: 100, color: "#ef4444" },
  { name: "Distributors", value: 8, count: 100, color: "#ec4899" },
  { name: "Others", value: 2, count: 25, color: "#8b5cf6" },
];

export function MarketResearchManagementPage() {
  const [activeTab, setActiveTab] = useState("studies");
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);

  const handleSave = () => {
    toast.success("Research Study Saved", {
      description: "MR-2026-001 (EV Charging Market Study) updated successfully.",
    });
  };

  const handleShare = () => {
    toast.info("Report Exported & Shared", {
      description: "Executive brief dispatched to Product Strategy & Leadership.",
    });
  };

  return (
    <AppShell
      title="Market Research"
      breadcrumb="Management > Marketing Management > Market Research > Studies & Market Sizing"
      description="Understand Markets. Uncover Opportunities. Guide Strategy."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card Matching Screenshot Exactly */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Market Research
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-mono font-bold text-foreground/80 border border-border">
                  MR-2026-001
                </span>
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">
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
                Understand Markets. Uncover Opportunities. Guide Strategy.
              </p>
            </div>

            {/* Top Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Save className="h-3.5 w-3.5" /> Save Study
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Share2 className="h-3.5 w-3.5 text-primary" /> Share Report
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

          {/* Sub Navigation Tabs Bar (3 Focused Domain Tabs) */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto border-t border-border/80 pt-1 scrollbar-none">
            {RESEARCH_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all select-none cursor-pointer",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: RESEARCH STUDIES (Default Operational Workspace) */}
        {activeTab === "studies" && (
          <div className="space-y-4">
            {/* Active Research Studies & Framework */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Active Market Research Studies & Problem Statements
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Structured hierarchy linking commercial problem statements directly to empirical data collection.
                  </p>
                </div>
                <Button size="sm" className="gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> New Study
                </Button>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60">
                    <span className="font-bold text-foreground block mb-1">Core Problem Statement:</span>
                    <p className="text-muted-foreground leading-relaxed">
                      Commercial EV fleet operators report up to 4 hours of daily depot downtime caused by manual plug congestion, cable fatigue, and operator error during overnight cycles.
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-muted/30 border border-border/60">
                    <span className="font-bold text-foreground block mb-1">Primary Business Question:</span>
                    <p className="text-muted-foreground leading-relaxed">
                      What is the willingness of Tier-1 bus and logistics fleet operators in South Asia to adopt automated wireless high-power EVSE pads at a 25% price premium?
                    </p>
                  </div>
                  <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-1">Supported Management Decision:</span>
                    <p className="text-foreground font-medium">
                      Sanction ₹18 Cr CAPEX for high-throughput inductive pad production line at Hosur facility.
                    </p>
                  </div>
                </div>

                {/* Research Hypothesis Registry */}
                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5">
                  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    Validated Hypotheses & Confidence Scores
                  </div>
                  {[
                    { id: "HYP-01", text: "Fleet operators prioritize hands-free automated docking over lowest hardware cost.", conf: "94%", status: "Validated" },
                    { id: "HYP-02", text: "Commercial real estate developers require flush ground coils to avoid parking bay post hazards.", conf: "96%", status: "Validated" },
                    { id: "HYP-03", text: "Heavy bus operators demand 150-350kW charging speeds to keep layovers under 20 mins.", conf: "91%", status: "Validated" },
                    { id: "HYP-04", text: "SAE J2954 standard alignment is mandatory for European vehicle export compatibility.", conf: "99%", status: "Validated" },
                  ].map((h, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-background/80 border border-border/60 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-mono font-bold text-primary mr-1.5">{h.id}:</span>
                        <span className="text-foreground font-medium">{h.text}</span>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-bold shrink-0 border border-emerald-500/30">
                        {h.conf} Conf.
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Interviews & Survey Data Collection Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card-soft p-5 border-border/80">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="font-bold text-sm text-foreground">Customer & Expert In-Depth Interviews (45 Logs)</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-primary gap-1">
                    <Plus className="h-3 w-3" /> Add Log
                  </Button>
                </div>

                <div className="mt-3 space-y-2.5 text-xs">
                  {[
                    { id: "INT-01", name: "R. Balachander", org: "Coimbatore Metro Transit", seg: "Bus Fleet", dur: "45 min", key: "Targeting 100 wireless inductive bus pads across 3 terminal depots." },
                    { id: "INT-02", name: "Meera Krishnan", org: "Ascendas IT Park", seg: "Real Estate", dur: "60 min", key: "Requires subterranean flush coils without surface posts to keep fire lanes clear." },
                    { id: "INT-03", name: "David Chen", org: "Global EV Powertrain Standards", seg: "OEM Expert", dur: "40 min", key: "SAE J2954 compatibility is mandatory for European vehicle exports." },
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-foreground">{item.name} · <span className="text-muted-foreground">{item.org}</span></span>
                        <span className="font-mono text-[10px] text-primary">{item.id}</span>
                      </div>
                      <div className="text-muted-foreground"><strong className="text-foreground">Insight:</strong> {item.key}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">Duration: {item.dur} · Segment: {item.seg}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-soft p-5 border-border/80">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <h3 className="font-bold text-sm text-foreground">Survey Campaigns & Response Rates (3,250 Total)</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-xs text-primary gap-1">
                    <Plus className="h-3 w-3" /> New Survey
                  </Button>
                </div>

                <div className="mt-3 space-y-2.5 text-xs">
                  {[
                    { name: "Commercial EV Fleet Operator Survey 2026", target: "1,500 Fleets", actual: "1,420", rate: "94.6%", ch: "Email + WhatsApp" },
                    { name: "Real Estate Developers Infrastructure Needs", target: "1,000 Owners", actual: "980", rate: "98.0%", ch: "LinkedIn + Direct" },
                    { name: "Public EV Fast Charging Willingness-to-Pay", target: "1,000 Drivers", actual: "850", rate: "85.0%", ch: "Mobile App Prompt" },
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-foreground">{s.name}</span>
                        <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">{s.rate}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Responses: <strong className="text-foreground font-mono">{s.actual}</strong> / {s.target}</span>
                        <span>Channels: {s.ch}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TAM & GROWTH SIZING */}
        {activeTab === "tam-sizing" && (
          <div className="space-y-4">
            {/* TAM / SAM / SOM Framework */}
            <div className="card-soft p-5 border-border/80">
              <h3 className="text-base font-bold text-foreground mb-1">
                Total Addressable Market (TAM / SAM / SOM) Model
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Empirical sizing model verified against government transport databases and industry trade bodies.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 space-y-2">
                  <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Total Addressable Market (TAM)</div>
                  <div className="text-3xl font-black text-foreground font-mono">₹50,000 Cr</div>
                  <p className="text-xs text-muted-foreground">Entire Indian commercial & public EV charging equipment and operational market by 2030.</p>
                  <div className="pt-2 border-t border-blue-500/20 text-[11px] font-mono text-blue-600">Growth: 32% CAGR</div>
                </div>

                <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-2">
                  <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase">Serviceable Addressable Market (SAM)</div>
                  <div className="text-3xl font-black text-foreground font-mono">₹18,000 Cr</div>
                  <p className="text-xs text-muted-foreground">Commercial depot and high-volume commercial hub charging in Tier-1 & Tier-2 industrial cities.</p>
                  <div className="pt-2 border-t border-cyan-500/20 text-[11px] font-mono text-cyan-600">Target Customers: 4,500 Depots</div>
                </div>

                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-2">
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Serviceable Obtainable Market (SOM)</div>
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">₹3,600 Cr</div>
                  <p className="text-xs text-muted-foreground">Realistic Magnertia market capture (20% SAM) achievable by FY29 through direct and OEM integration.</p>
                  <div className="pt-2 border-t border-emerald-500/20 text-[11px] font-mono text-emerald-600">Target Revenue: ₹3,600 Cr</div>
                </div>
              </div>
            </div>

            {/* Market Growth & Segment Distribution Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="card-soft p-4 lg:col-span-8 border-border/80">
                <h4 className="font-bold text-sm text-foreground mb-1">Market Size & CAGR Growth Forecast (2024 - 2030)</h4>
                <p className="text-xs text-muted-foreground mb-3">Projected market size (₹ Cr) vs annual growth rate (%)</p>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={MARKET_GROWTH_DATA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                      <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                      />
                      <Bar yAxisId="left" dataKey="marketSize" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={28} />
                      <Line yAxisId="right" type="monotone" dataKey="growthRate" stroke="#10b981" strokeWidth={2.5} dot />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-soft p-4 lg:col-span-4 border-border/80 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-1">Customer Segment Breakdown</h4>
                  <p className="text-xs text-muted-foreground mb-2">Share of surveyed industry demand</p>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={CUSTOMER_SEGMENTS_DATA}
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {CUSTOMER_SEGMENTS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px",
                            fontSize: "11px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-2 border-t border-border/60">
                  {CUSTOMER_SEGMENTS_DATA.slice(0, 4).map((s, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-muted-foreground truncate">{s.name}: {s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER INSIGHTS & TRENDS */}
        {activeTab === "insights" && (
          <div className="space-y-4">
            {/* Customer Pain Point Severity & Impact Matrix */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Customer Operational Pain Points & Willingness-to-Pay
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Empirical operational bottlenecks recorded across customer interviews with annual loss estimates.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Updated from 3,250 Surveys
                </Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2">Pain Point ID</th>
                      <th className="pb-2">Customer Segment</th>
                      <th className="pb-2">Operational Bottleneck</th>
                      <th className="pb-2">Severity</th>
                      <th className="pb-2">Annual Cost of Problem</th>
                      <th className="pb-2 text-right">Potential Magnertia Solution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {[
                      { id: "PNT-01", seg: "Bus Fleet Operators", prob: "Heavy CCS2 cable fatigue and connector pins bending due to manual handling.", sev: "Critical", cost: "₹45,000 / charger / year", sol: "Autonomous W-EVSE Inductive Pad" },
                      { id: "PNT-02", seg: "Shopping Mall Developers", prob: "High-voltage cable trip hazards and vandalism in open visitor parking lots.", sev: "High", cost: "₹2.4L insurance risk", sol: "Flush Ground Floor Magnetic Plate" },
                      { id: "PNT-03", seg: "Logistics Last-Mile Hubs", prob: "Drivers forgetting to plug in overnight, causing fleet dispatch delays.", sev: "Critical", cost: "₹18L delivery delay losses", sol: "Automated Alignment Top-Up" },
                    ].map((p, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-2.5 font-mono font-bold text-primary">{p.id}</td>
                        <td className="py-2.5 font-semibold text-foreground">{p.seg}</td>
                        <td className="py-2.5 text-muted-foreground max-w-sm">{p.prob}</td>
                        <td className="py-2.5">
                          <span className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                            p.sev === "Critical" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          )}>
                            {p.sev}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono font-bold text-foreground">{p.cost}</td>
                        <td className="py-2.5 text-right font-semibold text-primary">{p.sol}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Strategic Trends & Technology Shifts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="card-soft p-4 border-border/80 space-y-2">
                <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-purple-600" /> Depot Hands-Free Mandate
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Transit authorities in NCR, Maharashtra, and Tamil Nadu are planning tenders with zero-manual-touch charging clauses by 2027.
                </p>
              </div>

              <div className="card-soft p-4 border-border/80 space-y-2">
                <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-blue-600" /> Commercial Real Estate Integration
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Grade-A tech parks demand subterranean charging with zero surface cabling to preserve pedestrian safety and parking space efficiency.
                </p>
              </div>

              <div className="card-soft p-4 border-border/80 space-y-2">
                <span className="font-bold text-foreground text-sm flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-600" /> OEM Factory Readiness
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  3 commercial EV OEMs in India are co-developing chassis receiver coils compatible with the SAE J2954 standard.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default MarketResearchManagementPage;
