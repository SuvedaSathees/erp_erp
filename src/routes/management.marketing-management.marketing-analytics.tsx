import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Filter,
  BarChart3,
  TrendingUp,
  IndianRupee,
  Calendar,
  Share2,
  Sparkles,
  Layers,
  ArrowUpRight,
  Zap,
  Info,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/marketing-analytics"
)({
  head: () => ({
    meta: [
      { title: "Marketing Analytics · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Marketing Analytics Workspace for multi-touch attribution, channel ROI efficiency, funnel velocity, and predictive revenue forecasting.",
      },
    ],
  }),
  component: MarketingAnalyticsPage,
});

type MAICW = "M" | "A" | "I" | "C" | "W";

function MAICWBadge({ type }: { type: MAICW }) {
  const meta: Record<MAICW, { label: string; desc: string; bg: string; text: string }> = {
    M: { label: "M", desc: "Mandatory Field - Required for governance & measurement", bg: "bg-red-500/10 border-red-500/30", text: "text-red-600 dark:text-red-400" },
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
        "inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border text-[8.5px] font-bold cursor-help shrink-0 select-none ml-1",
        item.bg,
        item.text
      )}
    >
      {item.label}
    </span>
  );
}

const TABS = [
  { id: "attribution", label: "Multi-Touch Attribution" },
  { id: "channel-roi", label: "Channel ROI & Efficiency" },
  { id: "funnel", label: "Funnel Velocity & Drop-off" },
  { id: "forecasting", label: "Revenue Forecasting & Trends" },
];

const REVENUE_MONTHLY_DATA = [
  { month: "Jul 2026", revenue: 1.2, leads: 800 },
  { month: "Aug 2026", revenue: 1.6, leads: 1050 },
  { month: "Sep 2026", revenue: 2.0, leads: 1280 },
];

export function MarketingAnalyticsPage() {
  const [activeTab, setActiveTab] = useState("attribution");
  const [showMaicwLegend, setShowMaicwLegend] = useState(false);

  return (
    <AppShell
      title="Marketing Analytics"
      breadcrumb="Management > Marketing Management > Marketing Analytics > Performance Intelligence"
      description="Data-Driven Decisions. Measurable Growth."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground font-display">
                  Marketing Analytics
                </h1>
                <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold rounded-full">
                  Active
                </Badge>
                <span className="text-sm font-semibold text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 font-mono">
                  AN-2026-001
                </span>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded border border-border">
                  v1.0
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMaicwLegend(!showMaicwLegend)}
                  className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Info className="h-3.5 w-3.5 mr-1 text-primary" /> MAICW Standards
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                Data-Driven Decisions. Measurable Growth · Executive Q3 2026 Multi-Touch Performance Engine
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.success("Analytics Cache Refreshed", { description: "Real-time CRM and pixel telemetry synced." })}
                className="gap-1.5 text-xs font-semibold shadow-xs"
              >
                <Zap className="h-3.5 w-3.5 text-primary" /> Refresh Telemetry
              </Button>
              <Button
                size="sm"
                onClick={() => toast.info("Executive Analytics Report Exported", { description: "PDF brief dispatched to C-Suite distribution list." })}
                className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Share2 className="h-3.5 w-3.5" /> Export Executive Pack
              </Button>
            </div>
          </div>

          {/* Sub Navigation Tabs Bar (4 Focused Operational Tabs) */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto border-t border-border/80 pt-1 scrollbar-none">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all select-none cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: MULTI-TOUCH ATTRIBUTION (Default Operational View) */}
        {activeTab === "attribution" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Multi-Touch Revenue Attribution Comparison Models
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Cross-channel attribution weights across First-Touch, Linear, Position-Based (40-20-40), and Data-Driven AI models.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">48 Won Accounts</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-4 rounded-xl border border-border/70 bg-card space-y-2">
                  <div className="font-bold text-foreground text-sm">First Touch Model</div>
                  <div className="text-muted-foreground text-[11px] leading-relaxed">
                    Credits 100% of pipeline to the discovery channel. Highlights top-of-funnel acquisition sources.
                  </div>
                  <div className="pt-2 border-t border-border/50 font-mono text-foreground font-bold">
                    Google Ads: ₹1.8 Cr · Web: ₹1.2 Cr
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-card space-y-2">
                  <div className="font-bold text-foreground text-sm">Position-Based (40-20-40)</div>
                  <div className="text-muted-foreground text-[11px] leading-relaxed">
                    40% First Discovery + 20% Middle Nurture/Demo + 40% Final Deal Close trigger touchpoint.
                  </div>
                  <div className="pt-2 border-t border-border/50 font-mono text-foreground font-bold">
                    Events: ₹1.6 Cr · LinkedIn: ₹1.4 Cr
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                  <div className="font-bold text-primary text-sm">Data-Driven Algorithmic (Recommended)</div>
                  <div className="text-muted-foreground text-[11px] leading-relaxed">
                    Machine learning model evaluating actual incremental lift probability across 18 touchpoints.
                  </div>
                  <div className="pt-2 border-t border-primary/20 font-mono text-primary font-bold">
                    Total Attributed: ₹4.80 Cr Won
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHANNEL ROI & EFFICIENCY */}
        {activeTab === "channel-roi" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground">
                    Channel Performance & Unit Economic Efficiency
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Granular breakdown of spend, MQLs generated, customer acquisition cost, and revenue return.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Q3 Reconciled</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Marketing Channel</th>
                      <th className="pb-2.5 text-right">Spend</th>
                      <th className="pb-2.5 text-right">Leads</th>
                      <th className="pb-2.5 text-right">MQL</th>
                      <th className="pb-2.5 text-right">Cost/MQL</th>
                      <th className="pb-2.5 text-right">Won Deals</th>
                      <th className="pb-2.5 text-right">Attributed Revenue</th>
                      <th className="pb-2.5 text-right">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Google Search (SEM)</td>
                      <td className="py-3 text-right text-muted-foreground">₹6,50,000</td>
                      <td className="py-3 text-right">380</td>
                      <td className="py-3 text-right">185</td>
                      <td className="py-3 text-right text-emerald-600">₹3,513</td>
                      <td className="py-3 text-right font-bold text-foreground">16</td>
                      <td className="py-3 text-right font-bold text-primary">₹1,60,00,000</td>
                      <td className="py-3 text-right font-bold text-emerald-600">24.6x</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Industry Tech Summits & Events</td>
                      <td className="py-3 text-right text-muted-foreground">₹7,80,000</td>
                      <td className="py-3 text-right">260</td>
                      <td className="py-3 text-right">145</td>
                      <td className="py-3 text-right text-emerald-600">₹5,379</td>
                      <td className="py-3 text-right font-bold text-foreground">14</td>
                      <td className="py-3 text-right font-bold text-primary">₹1,40,00,000</td>
                      <td className="py-3 text-right font-bold text-emerald-600">17.9x</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">LinkedIn Sponsored & ABM</td>
                      <td className="py-3 text-right text-muted-foreground">₹5,20,000</td>
                      <td className="py-3 text-right">335</td>
                      <td className="py-3 text-right">160</td>
                      <td className="py-3 text-right text-emerald-600">₹3,250</td>
                      <td className="py-3 text-right font-bold text-foreground">11</td>
                      <td className="py-3 text-right font-bold text-primary">₹1,10,00,000</td>
                      <td className="py-3 text-right font-bold text-emerald-600">21.1x</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Organic SEO & Thought Leadership</td>
                      <td className="py-3 text-right text-muted-foreground">₹1,80,000</td>
                      <td className="py-3 text-right">180</td>
                      <td className="py-3 text-right">95</td>
                      <td className="py-3 text-right text-emerald-600">₹1,894</td>
                      <td className="py-3 text-right font-bold text-foreground">5</td>
                      <td className="py-3 text-right font-bold text-primary">₹50,00,000</td>
                      <td className="py-3 text-right font-bold text-emerald-600">27.7x</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Email Nurture Sequences</td>
                      <td className="py-3 text-right text-muted-foreground">₹80,000</td>
                      <td className="py-3 text-right">125</td>
                      <td className="py-3 text-right">35</td>
                      <td className="py-3 text-right text-emerald-600">₹2,285</td>
                      <td className="py-3 text-right font-bold text-foreground">2</td>
                      <td className="py-3 text-right font-bold text-primary">₹20,00,000</td>
                      <td className="py-3 text-right font-bold text-emerald-600">25.0x</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FUNNEL VELOCITY */}
        {activeTab === "funnel" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <h3 className="font-display text-base font-bold text-foreground mb-1">
                Lifecycle Funnel Velocity & Stage Conversion Rates
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Average transition latency from initial web visitor to enterprise closed-won contract.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                  <div className="text-[11px] font-bold text-muted-foreground uppercase">1. Web Visitors</div>
                  <div className="text-2xl font-black text-foreground font-mono">12,580</div>
                  <div className="text-[10px] text-muted-foreground">Unique Monthly Visitors</div>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                  <div className="text-[11px] font-bold text-blue-600 uppercase">2. Inquiries / Leads</div>
                  <div className="text-2xl font-black text-blue-600 font-mono">1,280</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">10.1% Visitor-to-Lead</div>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                  <div className="text-[11px] font-bold text-cyan-600 uppercase">3. Vetted MQLs</div>
                  <div className="text-2xl font-black text-cyan-600 font-mono">620</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">48.4% Qualification</div>
                </div>

                <div className="p-4 rounded-xl border border-border/70 bg-card space-y-1">
                  <div className="text-[11px] font-bold text-purple-600 uppercase">4. Sales Pipeline SQL</div>
                  <div className="text-2xl font-black text-purple-600 font-mono">240</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">38.7% SQL Conversion</div>
                </div>

                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-1">
                  <div className="text-[11px] font-bold text-emerald-600 uppercase">5. Closed Won</div>
                  <div className="text-2xl font-black text-emerald-600 font-mono">48 Deals</div>
                  <div className="text-[10px] text-emerald-600 font-semibold">20.0% Win Rate</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVENUE FORECASTING */}
        {activeTab === "forecasting" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="card-soft p-4 lg:col-span-8 border-border/80">
                <h4 className="font-bold text-sm text-foreground mb-1">Monthly Revenue Velocity (Jul - Sep 2026)</h4>
                <p className="text-xs text-muted-foreground mb-3">Closed-won attributed revenue run rate in ₹ Crores</p>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={REVENUE_MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          borderColor: "hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "11px",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-soft p-4 lg:col-span-4 border-border/80 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground mb-2 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                    AI Q4 Predictive Run Rate
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Lead velocity is trending towards <strong>1,650 leads in Q4 (+28% QoQ)</strong> driven by highway corridor tenders and OEM depot partnerships.
                  </p>
                  <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/60">
                    <div className="text-xs text-muted-foreground">Projected Q4 Pipeline</div>
                    <div className="text-xl font-black text-primary font-mono mt-0.5">₹6.20 Cr</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 text-[11px] text-muted-foreground">
                  Confidence Interval: <strong>94.2%</strong> based on 12-month historical sales velocity.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default MarketingAnalyticsPage;
