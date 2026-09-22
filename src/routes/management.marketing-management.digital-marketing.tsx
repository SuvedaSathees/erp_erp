import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Save,
  Rocket,
  Target,
  Users,
  BarChart3,
  IndianRupee,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Calendar,
  ShieldCheck,
  Plus,
  FileText,
  Copy,
  Info,
  Check,
  AlertTriangle,
  Globe,
  Search,
  Workflow,
  Eye,
  MousePointerClick,
  Sliders,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/digital-marketing"
)({
  head: () => ({
    meta: [
      { title: "Digital Marketing · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Digital Marketing Workspace for SEO keyword rankings, Google Ads SEM campaigns, display retargeting, and landing page CRO conversion pipelines.",
      },
    ],
  }),
  component: DigitalMarketingManagementPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for governance & launch", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
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

const DIGITAL_TABS = [
  { id: "seo", label: "SEO & Keywords" },
  { id: "sem", label: "SEM / PPC Ads" },
  { id: "display", label: "Display & Retargeting" },
  { id: "cro", label: "Landing Pages & CRO" },
];

export function DigitalMarketingManagementPage() {
  const [activeTab, setActiveTab] = useState("seo");
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);

  // Live UTM Builder State
  const [utmUrl, setUtmUrl] = useState("https://magnertia.com/ev-solutions");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaign, setUtmCampaign] = useState("autonomous-charging-fy26");

  const handleSave = () => {
    toast.success("Digital Marketing Strategy Saved", {
      description: "Draft records and budget allocations updated in ERP.",
    });
  };

  const handleSubmitApproval = () => {
    toast.success("Submitted for Management Review", {
      description: "Approval routed to Marketing Director & Finance Controller.",
    });
  };

  const handleLaunch = () => {
    toast.success("Digital Campaign Launched & Live", {
      description: "All tracking pixels, UTM pipelines, and CRM integrations are broadcasting.",
    });
  };

  return (
    <AppShell
      title="Digital Marketing"
      breadcrumb="Management > Marketing Management > Digital Marketing > SEO, Ads & Conversion"
      description="Drive Digital. Generate Leads. Power Growth."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card Matching Reference Pattern */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Digital Marketing
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-mono font-bold text-foreground/80 border border-border">
                  DM-2026-001
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
                Drive Digital. Generate Leads. Power Growth.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Save className="h-3.5 w-3.5" /> Save
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
                onClick={handleLaunch}
                className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Rocket className="h-3.5 w-3.5" /> Launch
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

          {/* 4 Focused Sub-Tabs Strip (No repeating inner Overview) */}
          <div className="mt-4 border-t border-border/80 pt-1">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1 select-none">
              {DIGITAL_TABS.map((t) => {
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

        {/* TAB 1: SEO & KEYWORDS (Default Operational View) */}
        {activeTab === "seo" && (
          <div className="space-y-4">
            {/* SEO Performance Scorecards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Organic Traffic</div>
                <div className="text-lg font-black text-foreground mt-1">14,200</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">↑ 22% MoM</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Organic Leads</div>
                <div className="text-lg font-black text-foreground mt-1">120</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">₹667 CPL</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Top 3 Rankings</div>
                <div className="text-lg font-black text-foreground mt-1">18 Keywords</div>
                <div className="text-[10px] text-primary font-semibold mt-0.5">84% Visibility</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Search Clicks</div>
                <div className="text-lg font-black text-foreground mt-1">18,400</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">8.36% CTR</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Indexed Pages</div>
                <div className="text-lg font-black text-foreground mt-1">420 Pages</div>
                <div className="text-[10px] text-muted-foreground font-semibold mt-0.5">100% Healthy</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Domain Authority</div>
                <div className="text-lg font-black text-foreground mt-1">DA 58</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">1,850 Backlinks</div>
              </div>
            </div>

            {/* Target SEO Keywords & Ranking Position Tracker */}
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Search className="h-5 w-5 text-teal-600" />
                    Target SEO Keywords & Ranking Position Tracker
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    High-intent commercial keywords tracked daily against SERP positions and competitors.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Suggest Keywords
                  </Button>
                  <Button size="sm" className="h-8 gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> Track New Keyword
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Keyword</th>
                      <th className="pb-2.5">Search Intent</th>
                      <th className="pb-2.5 text-right">Volume / Mo</th>
                      <th className="pb-2.5 text-right">Difficulty</th>
                      <th className="pb-2.5 text-right">Current Rank</th>
                      <th className="pb-2.5 text-right">Target</th>
                      <th className="pb-2.5">Mapped Landing Page</th>
                      <th className="pb-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">wireless ev charging india</td>
                      <td className="py-3 font-sans"><span className="rounded bg-blue-500/10 text-blue-600 px-1.5 py-0.5 text-[10px] font-semibold">Commercial</span></td>
                      <td className="py-3 text-right">12,500</td>
                      <td className="py-3 text-right text-amber-600 font-semibold">42/100</td>
                      <td className="py-3 text-right font-bold text-emerald-600">#1</td>
                      <td className="py-3 text-right text-muted-foreground">#1</td>
                      <td className="py-3 text-primary font-sans">/wireless-ev-charging</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Ranked #1
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">autonomous ev fleet charger</td>
                      <td className="py-3 font-sans"><span className="rounded bg-purple-500/10 text-purple-600 px-1.5 py-0.5 text-[10px] font-semibold">Transactional</span></td>
                      <td className="py-3 text-right">6,800</td>
                      <td className="py-3 text-right text-amber-600 font-semibold">38/100</td>
                      <td className="py-3 text-right font-bold text-emerald-600">#2</td>
                      <td className="py-3 text-right text-muted-foreground">#1</td>
                      <td className="py-3 text-primary font-sans">/fleet-solutions</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Top 3
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">high power inductive charging pad</td>
                      <td className="py-3 font-sans"><span className="rounded bg-teal-500/10 text-teal-600 px-1.5 py-0.5 text-[10px] font-semibold">Informational</span></td>
                      <td className="py-3 text-right">4,200</td>
                      <td className="py-3 text-right text-emerald-600 font-semibold">29/100</td>
                      <td className="py-3 text-right font-bold text-emerald-600">#3</td>
                      <td className="py-3 text-right text-muted-foreground">#1</td>
                      <td className="py-3 text-primary font-sans">/technology/inductive</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Top 3
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">commercial depot ev charging automation</td>
                      <td className="py-3 font-sans"><span className="rounded bg-blue-500/10 text-blue-600 px-1.5 py-0.5 text-[10px] font-semibold">Commercial</span></td>
                      <td className="py-3 text-right">3,100</td>
                      <td className="py-3 text-right text-emerald-600 font-semibold">24/100</td>
                      <td className="py-3 text-right font-bold text-blue-600">#4</td>
                      <td className="py-3 text-right text-muted-foreground">#2</td>
                      <td className="py-3 text-primary font-sans">/depot-automation</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-blue-500/15 text-blue-600 px-2 py-0.5 text-[10px] font-semibold border border-blue-500/30">
                          Page 1
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEM / PPC ADS */}
        {activeTab === "sem" && (
          <div className="space-y-4">
            {/* SEM KPI Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Daily Ad Budget</div>
                <div className="text-lg font-black text-foreground mt-1">₹15,000 / day</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">₹4,50,000 / mo</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Blended CPC</div>
                <div className="text-lg font-black text-emerald-600 mt-1">₹18.40</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">↓ 12% vs Target</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Average CTR</div>
                <div className="text-lg font-black text-primary mt-1">6.42%</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">Industry Avg: 3.2%</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">MQL Conversions</div>
                <div className="text-lg font-black text-foreground mt-1">380 Leads</div>
                <div className="text-[10px] text-primary mt-0.5">₹1,184 Cost/MQL</div>
              </div>
              <div className="card-soft p-3 text-xs">
                <div className="text-muted-foreground font-medium">Campaign ROAS</div>
                <div className="text-lg font-black text-cyan-600 mt-1">17.5x</div>
                <div className="text-[10px] text-emerald-600 mt-0.5">₹78.7L Pipeline Value</div>
              </div>
            </div>

            {/* Google Ads Campaigns Table */}
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Google Ads & SEM Search Campaigns
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Active paid search ad groups, match types, spend velocity, and lead attribution.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="h-8 gap-1 text-xs">
                    <Sliders className="h-3.5 w-3.5" /> Adjust Bids
                  </Button>
                  <Button size="sm" className="h-8 gap-1 text-xs">
                    <Plus className="h-3.5 w-3.5" /> New Ad Group
                  </Button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Ad Group</th>
                      <th className="pb-2.5">Target Keyword</th>
                      <th className="pb-2.5">Match Type</th>
                      <th className="pb-2.5 text-right">Budget / Day</th>
                      <th className="pb-2.5 text-right">Avg CPC</th>
                      <th className="pb-2.5 text-right">CTR</th>
                      <th className="pb-2.5 text-right">Leads</th>
                      <th className="pb-2.5 text-right">Spend</th>
                      <th className="pb-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">AG-01: Commercial W-EVSE</td>
                      <td className="py-3 font-sans text-muted-foreground">"wireless fleet charging"</td>
                      <td className="py-3 font-sans"><span className="rounded bg-blue-500/10 text-blue-600 px-1.5 py-0.5 text-[10px] font-semibold">Phrase</span></td>
                      <td className="py-3 text-right">₹5,000</td>
                      <td className="py-3 text-right text-emerald-600">₹22.50</td>
                      <td className="py-3 text-right font-bold">7.12%</td>
                      <td className="py-3 text-right font-bold text-foreground">142</td>
                      <td className="py-3 text-right">₹1,45,000</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">AG-02: Inductive Depot Pad</td>
                      <td className="py-3 font-sans text-muted-foreground">[depot inductive charger]</td>
                      <td className="py-3 font-sans"><span className="rounded bg-purple-500/10 text-purple-600 px-1.5 py-0.5 text-[10px] font-semibold">Exact</span></td>
                      <td className="py-3 text-right">₹4,000</td>
                      <td className="py-3 text-right text-emerald-600">₹18.80</td>
                      <td className="py-3 text-right font-bold">8.45%</td>
                      <td className="py-3 text-right font-bold text-foreground">118</td>
                      <td className="py-3 text-right">₹1,12,000</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">AG-03: Autonomous EVSE</td>
                      <td className="py-3 font-sans text-muted-foreground">+autonomous +ev +charging</td>
                      <td className="py-3 font-sans"><span className="rounded bg-slate-500/10 text-slate-600 px-1.5 py-0.5 text-[10px] font-semibold">Broad Mod</span></td>
                      <td className="py-3 text-right">₹3,500</td>
                      <td className="py-3 text-right text-emerald-600">₹14.20</td>
                      <td className="py-3 text-right font-bold">5.18%</td>
                      <td className="py-3 text-right font-bold text-foreground">84</td>
                      <td className="py-3 text-right">₹88,000</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DISPLAY & RETARGETING */}
        {activeTab === "display" && (
          <div className="space-y-4">
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Display Ad Sets & Audience Retargeting Pools
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Programmatic banner campaigns, LinkedIn sponsored updates, and 30-day website retargeting audiences.
                  </p>
                </div>
                <Button size="sm" className="h-8 gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> New Retargeting Campaign
                </Button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Ad Creative Name</th>
                      <th className="pb-2.5">Dimensions</th>
                      <th className="pb-2.5">Ad Network</th>
                      <th className="pb-2.5">Audience Segment</th>
                      <th className="pb-2.5 text-right">Impressions</th>
                      <th className="pb-2.5 text-right">Clicks</th>
                      <th className="pb-2.5 text-right">CTR</th>
                      <th className="pb-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Zero Plug Wear - Depot Banner</td>
                      <td className="py-3 text-muted-foreground">1200 x 628</td>
                      <td className="py-3 font-sans font-semibold text-[#0077b5]">LinkedIn Sponsored</td>
                      <td className="py-3 font-sans">Fleet Operators (India & GCC)</td>
                      <td className="py-3 text-right">180,000</td>
                      <td className="py-3 text-right">3,420</td>
                      <td className="py-3 text-right font-bold text-emerald-600">1.90%</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Inductive Pad Fast ROI Calculator</td>
                      <td className="py-3 text-muted-foreground">300 x 250</td>
                      <td className="py-3 font-sans font-semibold text-blue-600">Google Display Network</td>
                      <td className="py-3 font-sans">Website Visitors (Past 14 Days)</td>
                      <td className="py-3 text-right">240,000</td>
                      <td className="py-3 text-right">2,880</td>
                      <td className="py-3 text-right font-bold text-emerald-600">1.20%</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Automotive OEM Leaderboard</td>
                      <td className="py-3 text-muted-foreground">728 x 90</td>
                      <td className="py-3 font-sans font-semibold text-purple-600">Programmatic B2B</td>
                      <td className="py-3 font-sans">EV Engineering Publications</td>
                      <td className="py-3 text-right">65,000</td>
                      <td className="py-3 text-right">610</td>
                      <td className="py-3 text-right font-bold text-emerald-600">0.94%</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Active
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LANDING PAGES & CRO */}
        {activeTab === "cro" && (
          <div className="space-y-4">
            {/* Landing Page Performance Table */}
            <div className="card-soft p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-border/70">
                <div>
                  <h2 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    Landing Page Management & Conversion Pipeline
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Dedicated campaign landing pages with conversion rates, form submissions, and A/B status.
                  </p>
                </div>
                <Button size="sm" className="h-8 gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> New Landing Page
                </Button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Page URL</th>
                      <th className="pb-2.5">Headline</th>
                      <th className="pb-2.5">Primary CTA</th>
                      <th className="pb-2.5 text-right">Visits</th>
                      <th className="pb-2.5 text-right">Submissions</th>
                      <th className="pb-2.5 text-right">Leads</th>
                      <th className="pb-2.5 text-right">Conv. %</th>
                      <th className="pb-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 text-primary font-medium">/wireless-ev-charging</td>
                      <td className="py-3 font-sans font-semibold text-foreground">Charge Without Limits</td>
                      <td className="py-3 font-sans"><span className="rounded bg-primary/10 text-primary px-2 py-0.5 font-semibold">Request Demo</span></td>
                      <td className="py-3 text-right">8,500</td>
                      <td className="py-3 text-right">290</td>
                      <td className="py-3 text-right font-bold text-foreground">220</td>
                      <td className="py-3 text-right font-bold text-emerald-600">2.59%</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Live (Winner)
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 text-primary font-medium">/fleet-solutions</td>
                      <td className="py-3 font-sans font-semibold text-foreground">Zero Downtime Fleet Hubs</td>
                      <td className="py-3 font-sans"><span className="rounded bg-primary/10 text-primary px-2 py-0.5 font-semibold">Get Fleet Quote</span></td>
                      <td className="py-3 text-right">5,200</td>
                      <td className="py-3 text-right">165</td>
                      <td className="py-3 text-right font-bold text-foreground">120</td>
                      <td className="py-3 text-right font-bold text-emerald-600">2.31%</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Live
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 text-primary font-medium">/partner-with-us</td>
                      <td className="py-3 font-sans font-semibold text-foreground">Expand Your CPO Network</td>
                      <td className="py-3 font-sans"><span className="rounded bg-primary/10 text-primary px-2 py-0.5 font-semibold">Become Partner</span></td>
                      <td className="py-3 text-right">3,800</td>
                      <td className="py-3 text-right">102</td>
                      <td className="py-3 text-right font-bold text-foreground">80</td>
                      <td className="py-3 text-right font-bold text-emerald-600">2.10%</td>
                      <td className="py-3 text-center font-sans">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Live
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Campaign UTM Builder */}
            <div className="card-soft p-5">
              <h3 className="font-display text-sm font-bold text-foreground mb-3 flex items-center gap-1.5">
                <Workflow className="h-4 w-4 text-primary" /> Live Campaign UTM Builder & Parameter Validator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium">Target URL</label>
                  <input
                    type="text"
                    value={utmUrl}
                    onChange={(e) => setUtmUrl(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium">UTM Source</label>
                  <input
                    type="text"
                    value={utmSource}
                    onChange={(e) => setUtmSource(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium">UTM Medium</label>
                  <input
                    type="text"
                    value={utmMedium}
                    onChange={(e) => setUtmMedium(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-muted-foreground font-medium">UTM Campaign</label>
                  <input
                    type="text"
                    value={utmCampaign}
                    onChange={(e) => setUtmCampaign(e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-background/80 px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-3 p-2.5 rounded-md bg-muted/40 border border-border flex items-center justify-between text-xs font-mono">
                <span className="text-primary truncate mr-2">
                  {`${utmUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&cid=DM-2026-001`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `${utmUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}&cid=DM-2026-001`
                    );
                    toast.success("UTM Link copied to clipboard!");
                  }}
                  className="h-7 text-xs px-2 shrink-0"
                >
                  <Copy className="h-3.5 w-3.5 mr-1" /> Copy Link
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default DigitalMarketingManagementPage;
