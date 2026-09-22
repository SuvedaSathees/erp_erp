import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Megaphone,
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
  ShieldCheck,
  Plus,
  Info,
  Check,
  Workflow,
  Sliders,
} from "lucide-react";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute(
  "/management/marketing-management/campaigns"
)({
  head: () => ({
    meta: [
      { title: "Campaigns Management · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise Campaigns Workspace for campaign strategy, multi-channel media mix, budget allocation, and stage-gate launch workflows.",
      },
    ],
  }),
  component: CampaignsManagementPage,
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

const CAMPAIGN_TABS = [
  { id: "campaign-master", label: "Campaign Strategy" },
  { id: "channels-media", label: "Channels & Media Mix" },
  { id: "budget", label: "Budget & Spend" },
  { id: "workflow", label: "Launch Workflow" },
];

export function CampaignsManagementPage() {
  const [activeTab, setActiveTab] = useState("campaign-master");
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
      breadcrumb="Management > Marketing Management > Campaigns > Strategy & Launch"
      description="Create. Engage. Convert. Grow."
      tabs={<MarketingManagementTabBar />}
    >
      <div className="space-y-4 pb-12">
        {/* Top Header Card */}
        <div className="card-soft p-4 sm:p-5 border-border/80">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                  Campaigns
                </h1>
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
                <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-mono font-bold text-foreground/80 border border-border">
                  CMP-2026-001
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
                Future-Ready EV Fleet Charging Awareness & Lead Generation Campaign · FY26
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
                onClick={handleLaunchCampaign}
                className="gap-1.5 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
              >
                <Rocket className="h-3.5 w-3.5" /> Launch Campaign
              </Button>
            </div>
          </div>

          {/* Collapsible MAICW Legend */}
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

          {/* 4 Focused Sub-Tabs Strip */}
          <div className="mt-4 flex items-center gap-1 overflow-x-auto border-t border-border/80 pt-1 scrollbar-none">
            {CAMPAIGN_TABS.map((tab) => (
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

        {/* TAB 1: CAMPAIGN STRATEGY (Default Operational View) */}
        {activeTab === "campaign-master" && (
          <div className="space-y-4">
            {/* Strategy Overview & Master Brief */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/60">
                <div>
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Master Campaign Strategic Brief & Positioning
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Core value proposition, persona alignment, and overarching conversion goals.
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">Strategic Tier 1</Badge>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl border border-border/80 bg-background/60 space-y-2">
                  <span className="font-bold text-foreground block text-sm">Core Value Proposition</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Eliminate 100% of fleet depot charging bottlenecks with automated 150 kW - 350 kW hands-free inductive ground pads. Zero cable wear, zero plug damage.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-background/60 space-y-2">
                  <span className="font-bold text-foreground block text-sm">Primary Buyer Persona</span>
                  <p className="text-muted-foreground leading-relaxed">
                    VP of Fleet Operations, Chief Technology Officers (Bus & Logistics), and Commercial Real Estate Developers managing &gt;50 commercial EV charging slots.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-border/80 bg-background/60 space-y-2">
                  <span className="font-bold text-foreground block text-sm">Primary Conversion Target</span>
                  <p className="text-muted-foreground leading-relaxed">
                    Generate 630 Total Inquiries, 275 Marketing Qualified Leads (MQL), and 130 Sales Qualified Leads (SQL) leading to ₹1.60 Cr in closed pipeline.
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign Parameters & Execution Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="card-soft p-3.5">
                <div className="text-muted-foreground">Campaign Manager</div>
                <div className="text-base font-bold text-foreground mt-1">Arun Kumar</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">Senior Growth Lead</div>
              </div>
              <div className="card-soft p-3.5">
                <div className="text-muted-foreground">Business Unit</div>
                <div className="text-base font-bold text-foreground mt-1">Charging Solutions</div>
                <div className="text-[10px] text-primary mt-0.5">BU-CHG-994</div>
              </div>
              <div className="card-soft p-3.5">
                <div className="text-muted-foreground">Execution Window</div>
                <div className="text-base font-bold text-foreground mt-1">01 Sep - 31 Oct 2026</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">60 Days Duration</div>
              </div>
              <div className="card-soft p-3.5">
                <div className="text-muted-foreground">Approved Budget</div>
                <div className="text-base font-bold text-foreground mt-1">₹8,00,000</div>
                <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">77.5% Utilized</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CHANNELS & MEDIA MIX */}
        {activeTab === "channels-media" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Channel Plan & Commercial Quota Allocation
                  </h3>
                  <p className="text-xs text-muted-foreground">Detailed allocation of spend, reach, MQL, SQL, and pipeline value.</p>
                </div>
                <Button size="sm" className="h-8 gap-1 text-xs">
                  <Plus className="h-3.5 w-3.5" /> Add Channel
                </Button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5 font-semibold">Channel</th>
                      <th className="pb-2.5 font-semibold text-right">Budget</th>
                      <th className="pb-2.5 font-semibold text-right">Planned Reach</th>
                      <th className="pb-2.5 font-semibold text-right">Leads</th>
                      <th className="pb-2.5 font-semibold text-right">MQL</th>
                      <th className="pb-2.5 font-semibold text-right">SQL</th>
                      <th className="pb-2.5 font-semibold text-right">Revenue Plan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-mono">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">LinkedIn Ads</td>
                      <td className="py-3 text-right text-muted-foreground">₹2,00,000</td>
                      <td className="py-3 text-right text-muted-foreground">100K</td>
                      <td className="py-3 text-right font-bold text-foreground">150</td>
                      <td className="py-3 text-right text-muted-foreground">60</td>
                      <td className="py-3 text-right text-muted-foreground">25</td>
                      <td className="py-3 text-right font-bold text-primary">₹30.0 L</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Google Ads (Search & Display)</td>
                      <td className="py-3 text-right text-muted-foreground">₹1,50,000</td>
                      <td className="py-3 text-right text-muted-foreground">150K</td>
                      <td className="py-3 text-right font-bold text-foreground">180</td>
                      <td className="py-3 text-right text-muted-foreground">70</td>
                      <td className="py-3 text-right text-muted-foreground">30</td>
                      <td className="py-3 text-right font-bold text-primary">₹35.0 L</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Email Marketing & Drips</td>
                      <td className="py-3 text-right text-muted-foreground">₹50,000</td>
                      <td className="py-3 text-right text-muted-foreground">25K</td>
                      <td className="py-3 text-right font-bold text-foreground">100</td>
                      <td className="py-3 text-right text-muted-foreground">45</td>
                      <td className="py-3 text-right text-muted-foreground">20</td>
                      <td className="py-3 text-right font-bold text-primary">₹20.0 L</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Industry Events & Expo</td>
                      <td className="py-3 text-right text-muted-foreground">₹3,00,000</td>
                      <td className="py-3 text-right text-muted-foreground">5K</td>
                      <td className="py-3 text-right font-bold text-foreground">120</td>
                      <td className="py-3 text-right text-muted-foreground">60</td>
                      <td className="py-3 text-right text-muted-foreground">35</td>
                      <td className="py-3 text-right font-bold text-primary">₹50.0 L</td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 font-sans font-semibold text-foreground">Partner Marketing</td>
                      <td className="py-3 text-right text-muted-foreground">₹1,00,000</td>
                      <td className="py-3 text-right text-muted-foreground">20K</td>
                      <td className="py-3 text-right font-bold text-foreground">80</td>
                      <td className="py-3 text-right text-muted-foreground">40</td>
                      <td className="py-3 text-right text-muted-foreground">20</td>
                      <td className="py-3 text-right font-bold text-primary">₹25.0 L</td>
                    </tr>
                    <tr className="bg-muted/40 font-bold">
                      <td className="py-3 font-sans text-foreground">Total / Portfolio</td>
                      <td className="py-3 text-right text-foreground">₹8,00,000</td>
                      <td className="py-3 text-right text-foreground">300K</td>
                      <td className="py-3 text-right text-foreground">630</td>
                      <td className="py-3 text-right text-foreground">275</td>
                      <td className="py-3 text-right text-foreground">130</td>
                      <td className="py-3 text-right text-emerald-600">₹1.60 Cr</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BUDGET & SPEND */}
        {activeTab === "budget" && (
          <div className="space-y-4">
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <IndianRupee className="h-5 w-5 text-emerald-600" />
                    Campaign Budget Heads & Financial Control
                  </h3>
                  <p className="text-xs text-muted-foreground">Approved spending controls, actuals, commitments, and utilization.</p>
                </div>
                <Badge variant="outline" className="text-xs">77.5% Utilized</Badge>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="card-soft p-3 text-center border-border/70">
                  <div className="text-base font-extrabold text-foreground font-mono">₹8,00,000</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Approved Budget</div>
                </div>
                <div className="card-soft p-3 text-center border-border/70">
                  <div className="text-base font-extrabold text-foreground font-mono">₹7,50,000</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Planned Spend</div>
                </div>
                <div className="card-soft p-3 text-center border-border/70 bg-primary/5">
                  <div className="text-base font-extrabold text-primary font-mono">₹6,20,000</div>
                  <div className="text-[11px] text-primary font-semibold mt-0.5">Actual Spend</div>
                </div>
                <div className="card-soft p-3 text-center border-border/70">
                  <div className="text-base font-extrabold text-foreground font-mono">₹80,000</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">Committed Spend</div>
                </div>
                <div className="card-soft p-3 text-center border-border/70 bg-emerald-500/5">
                  <div className="text-base font-extrabold text-emerald-600 font-mono">₹1,00,000</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Available Budget</div>
                </div>
                <div className="card-soft p-3 text-center border-border/70 bg-blue-500/5">
                  <div className="text-base font-extrabold text-blue-600 font-mono">77.5%</div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-0.5">Budget Utilization</div>
                </div>
              </div>

              {/* Unit Economics */}
              <div className="mt-5">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-2.5">
                  Cost per Outcome Metrics
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60">
                    <span className="text-muted-foreground block text-[11px]">Cost per Lead (CPL)</span>
                    <span className="text-base font-bold text-foreground font-mono">₹1,333</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">Spend ÷ 630 Leads</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60">
                    <span className="text-muted-foreground block text-[11px]">Cost per MQL</span>
                    <span className="text-base font-bold text-foreground font-mono">₹3,351</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">Spend ÷ 275 MQLs</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60">
                    <span className="text-muted-foreground block text-[11px]">Customer Acquisition (CAC)</span>
                    <span className="text-base font-bold text-foreground font-mono">₹36,470</span>
                    <span className="text-[10px] text-muted-foreground block mt-0.5">Spend ÷ New Clients</span>
                  </div>
                  <div className="p-3 rounded-lg border border-border/70 bg-background/60">
                    <span className="text-muted-foreground block text-[11px]">Return on Ad Spend (ROAS)</span>
                    <span className="text-base font-bold text-emerald-600 font-mono">13.7x</span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">Attributed Rev ÷ Spend</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: LAUNCH WORKFLOW */}
        {activeTab === "workflow" && (
          <div className="space-y-4">
            {/* Approval Levels & Governance Matrix */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <div>
                  <h3 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                    <Workflow className="h-5 w-5 text-primary" />
                    Approval Levels & Governance Matrix
                  </h3>
                  <p className="text-xs text-muted-foreground">Multi-tier authorization before campaign budget commitment and public go-live.</p>
                </div>
                <Badge variant="outline" className="text-xs">All 5 Tiers Cleared</Badge>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border/80 text-muted-foreground font-semibold">
                      <th className="pb-2.5">Level</th>
                      <th className="pb-2.5">Approver Role</th>
                      <th className="pb-2.5">Name</th>
                      <th className="pb-2.5">Date</th>
                      <th className="pb-2.5 text-right">Decision</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-mono text-muted-foreground">L1</td>
                      <td className="py-2.5 font-semibold">Campaign Planner</td>
                      <td className="py-2.5 text-muted-foreground">Arun Kumar</td>
                      <td className="py-2.5 font-mono text-muted-foreground">01-Sep-2026</td>
                      <td className="py-2.5 text-right">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-mono text-muted-foreground">L2</td>
                      <td className="py-2.5 font-semibold">Commercial Review</td>
                      <td className="py-2.5 text-muted-foreground">Vikram Singh (CSO)</td>
                      <td className="py-2.5 font-mono text-muted-foreground">04-Sep-2026</td>
                      <td className="py-2.5 text-right">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-mono text-muted-foreground">L3</td>
                      <td className="py-2.5 font-semibold">Budget Review</td>
                      <td className="py-2.5 text-muted-foreground">Siddharth Rao (Finance)</td>
                      <td className="py-2.5 font-mono text-muted-foreground">06-Sep-2026</td>
                      <td className="py-2.5 text-right">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-mono text-muted-foreground">L4</td>
                      <td className="py-2.5 font-semibold">Brand Review</td>
                      <td className="py-2.5 text-muted-foreground">Priya S (Brand Head)</td>
                      <td className="py-2.5 font-mono text-muted-foreground">08-Sep-2026</td>
                      <td className="py-2.5 text-right">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 font-mono text-muted-foreground">L5</td>
                      <td className="py-2.5 font-semibold">Executive Authorization</td>
                      <td className="py-2.5 text-muted-foreground">Managing Director</td>
                      <td className="py-2.5 font-mono text-muted-foreground">12-Sep-2026</td>
                      <td className="py-2.5 text-right">
                        <span className="rounded-full bg-emerald-500/15 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold border border-emerald-500/30">
                          Approved
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Go-Live Checklist */}
            <div className="card-soft p-5 border-border/80">
              <div className="flex items-center justify-between pb-3 border-b border-border/60">
                <h3 className="font-display text-base font-bold text-foreground">
                  Go-Live Execution & Compliance Checklist
                </h3>
                <span className="text-xs text-muted-foreground">
                  {Object.values(checklist).filter(Boolean).length}/12 Verified
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
                {[
                  { id: "chk1", label: "Target Audience Identified & Persona Built" },
                  { id: "chk2", label: "Value Proposition & Key Messages Cleared" },
                  { id: "chk3", label: "Creative Assets Produced & Brand Approved" },
                  { id: "chk4", label: "Landing Pages Built with Responsive CRO" },
                  { id: "chk5", label: "UTM Tracking Parameters Configured" },
                  { id: "chk6", label: "CRM Routing & Lead Scoring Active" },
                  { id: "chk7", label: "Multi-Tier Approval Gates Signed Off" },
                  { id: "chk8", label: "Ad Accounts Funded & Limits Set" },
                  { id: "chk9", label: "Privacy & GDPR Compliance Certified" },
                  { id: "chk10", label: "Customer Journey Flow Rehearsed" },
                  { id: "chk11", label: "Sales Enablement Deck Distributed" },
                  { id: "chk12", label: "Real-Time Attribution Dashboard Live" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer select-none transition-all",
                      checklist[item.id]
                        ? "border-emerald-500/40 bg-emerald-500/5 text-foreground font-medium"
                        : "border-border/60 bg-muted/20 text-muted-foreground"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checklist[item.id] || false}
                      onChange={() => toggleChecklist(item.id)}
                      className="rounded border-border text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default CampaignsManagementPage;
