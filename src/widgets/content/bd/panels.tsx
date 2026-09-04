import { memo, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BrainCircuit,
  Briefcase,
  Building2,
  CheckCircle2,
  Coins,
  Compass,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  Handshake,
  Layers,
  Percent,
  Plus,
  Printer,
  Scale,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CardHeader } from "@/components/erp/CardHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { WidgetContentProps, WidgetDefinition } from "../../types";
import { bdOverviewOptions } from "../../data/bdQueries";

/* ===========================================================================
   1. Pipeline Trend & Commercial Revenue Horizon (2 of 3 cols - size "xl")
   =========================================================================== */
export const BdPipelineTrendWidget = memo(function BdPipelineTrendWidget({
  instance,
}: WidgetContentProps) {
  const { data, isLoading } = useQuery(bdOverviewOptions());

  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title={instance.customTitle ?? "Deal Pipeline & Commercial Revenue Horizon"}
          right={
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-primary" /> Active Pipeline
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" /> Closed Revenue
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-indigo-500">
                <span className="h-1 w-3 rounded-full bg-indigo-500" /> Win Rate %
              </span>
            </div>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Monthly cumulative commercial pipeline value vs realized closed contract revenue and proposal win rates.
        </p>
      </div>

      <div className="mt-4 h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.pipelineTrend} margin={{ top: 8, right: 12, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              tickFormatter={(v) => `₹${v}Cr`}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(val: number, name: string) => {
                if (name === "winRate") return [`${val}%`, "Win Rate"];
                return [`₹ ${val} Cr`, name === "pipeline" ? "Active Pipeline" : "Closed Revenue"];
              }}
            />
            <Bar yAxisId="left" dataKey="pipeline" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={14} opacity={0.85} />
            <Bar yAxisId="left" dataKey="closed" fill="#10B981" radius={[4, 4, 0, 0]} barSize={14} />
            <Line yAxisId="right" type="monotone" dataKey="winRate" stroke="#6366F1" strokeWidth={2.5} dot={{ r: 3, fill: "#6366F1" }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Deal Pipeline Funnel & Conversion (1 of 3 cols - size "md")
   =========================================================================== */
export const BdDealFunnelWidget = memo(function BdDealFunnelWidget() {
  const { data, isLoading } = useQuery(bdOverviewOptions());

  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  const stageColors = ["bg-slate-400", "bg-blue-400", "bg-indigo-500", "bg-amber-500", "bg-emerald-500", "bg-primary"];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" /> Commercial Deal Pipeline Stages
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">Active deals volume & pipeline value by stage.</p>
          </div>
          <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">6 Stages</span>
        </div>

        <div className="mt-4 space-y-3">
          {data.funnel.map((item, idx) => (
            <div key={item.label} className="group">
              <div className="flex justify-between text-xs font-semibold text-foreground">
                <span className="truncate pr-2">{item.label}</span>
                <span className="text-muted-foreground shrink-0 font-mono text-[11px]">{item.count} deals ({item.val})</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all duration-500", stageColors[idx % stageColors.length])}
                  style={{ width: `${Math.max(12, item.percentage)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Total Pipeline Tracked:</span>
        <strong className="text-foreground font-mono font-bold">₹ 120 Cr Gross</strong>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Partner Ecosystem & Channel Mix (1 of 3 cols - size "md")
   =========================================================================== */
export const BdPartnerDistributionWidget = memo(function BdPartnerDistributionWidget() {
  const { data, isLoading } = useQuery(bdOverviewOptions());

  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  const totalPartners = data.partnerDistribution.reduce((acc, p) => acc + p.count, 0);

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title="Partner Ecosystem & Channel Mix"
          right={
            <span className="text-xs font-mono font-bold text-muted-foreground">
              {totalPartners} Alliances
            </span>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">Distribution across OEM alliances, distributors, dealers, and systems partners.</p>

        <div className="mt-4 space-y-3.5">
          {data.partnerDistribution.map((item) => (
            <div key={item.channel} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{item.channel}</span>
                <span className="font-mono text-muted-foreground text-[11px]">
                  <strong>{item.count}</strong> partners ({item.sharePct}%)
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${item.sharePct}%`, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Global Reach:</span>
        <span className="font-bold text-emerald-600 flex items-center gap-1">
          <Globe className="h-3.5 w-3.5" /> 6 Active Global Markets
        </span>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Projected ARR & Revenue Scaling Multiplier (2 of 3 cols - size "xl")
   =========================================================================== */
export const BdRevenueCurveWidget = memo(function BdRevenueCurveWidget() {
  const { data, isLoading } = useQuery(bdOverviewOptions());

  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader
          title="Projected ARR & Revenue Scaling Multiplier"
          right={
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-emerald-500" /> Enterprise Deals
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-blue-500" /> Channel Sales
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2.5 w-2.5 rounded-xs bg-purple-500" /> Licensing
              </span>
            </div>
          }
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Monthly ARR recurring forecast across direct enterprise accounts, master distributors, and IP technology licensing.
        </p>
      </div>

      <div className="mt-4 h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.revenueGrowthCurve} margin={{ top: 8, right: 12, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="entGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="chnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} tickFormatter={(v) => `₹${v}Cr`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(val: number, name: string) => [`₹ ${val} Cr`, name]}
            />
            <Area type="monotone" dataKey="enterprise" stroke="#10B981" fill="url(#entGrad)" strokeWidth={2} name="Enterprise" />
            <Area type="monotone" dataKey="channelSales" stroke="#3B82F6" fill="url(#chnGrad)" strokeWidth={2} name="Channel Sales" />
            <Line type="monotone" dataKey="licensing" stroke="#A855F7" strokeWidth={2} dot={{ r: 3 }} name="Licensing" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Commercial Operations Ledger (5 tabs - size "xl")
   =========================================================================== */
type BdLedgerTab = "deals" | "alliances" | "distribution" | "rfps" | "expansion";

const LEDGER_TABS: { id: BdLedgerTab; label: string }[] = [
  { id: "deals", label: "Commercial Deals" },
  { id: "alliances", label: "Strategic Alliances" },
  { id: "distribution", label: "Distributor Network" },
  { id: "rfps", label: "RFP Proposals" },
  { id: "expansion", label: "Global Expansion" },
];

export const BdOperationsLedgerWidget = memo(function BdOperationsLedgerWidget() {
  const [activeTab, setActiveTab] = useState<BdLedgerTab>("deals");
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery(bdOverviewOptions());

  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  const filteredDeals = data.deals.filter(
    (d) =>
      !search.trim() ||
      d.id.toLowerCase().includes(search.toLowerCase()) ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.partner.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        <div>
          <h3 className="font-display text-[15px] font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" /> Commercial Operations Ledger
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time pipeline registers across commercial deals, strategic JVs, distribution channels, and global expansion.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Filter ledger entries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary w-44"
            />
          </div>

          <div className="flex flex-wrap gap-1 rounded-lg border border-border/60 bg-muted/40 p-0.5">
            {LEDGER_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-card text-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[220px] overflow-x-auto">
        {/* TAB 1: COMMERCIAL DEALS */}
        {activeTab === "deals" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Deal ID</th>
                <th className="py-2.5 px-3">Opportunity Title</th>
                <th className="py-2.5 px-3">Counterparty / Partner</th>
                <th className="py-2.5 px-3">Pipeline Stage</th>
                <th className="py-2.5 px-3 text-right">Value</th>
                <th className="py-2.5 px-3 text-right">Win Prob</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredDeals.map((d) => (
                <tr key={d.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{d.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{d.name}</td>
                  <td className="py-2.5 px-3 text-foreground/80">{d.partner}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{d.stage}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">{d.value}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">{d.probability}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold",
                        d.status === "High Priority"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : d.status === "Closing"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                      )}
                    >
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 2: STRATEGIC ALLIANCES */}
        {activeTab === "alliances" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Alliance ID</th>
                <th className="py-2.5 px-3">Partnership Title</th>
                <th className="py-2.5 px-3">Strategic Partner</th>
                <th className="py-2.5 px-3">Alliance Type</th>
                <th className="py-2.5 px-3">Scope Description</th>
                <th className="py-2.5 px-3 text-right">Estimated Value</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.strategicAlliances.map((a) => (
                <tr key={a.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{a.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{a.name}</td>
                  <td className="py-2.5 px-3 font-medium text-foreground">{a.partner}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{a.type}</td>
                  <td className="py-2.5 px-3 text-muted-foreground max-w-xs truncate">{a.scope}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">{a.value}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 3: DISTRIBUTION AGREEMENTS */}
        {activeTab === "distribution" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Distributor ID</th>
                <th className="py-2.5 px-3">Master Distributor</th>
                <th className="py-2.5 px-3">Assigned Territory</th>
                <th className="py-2.5 px-3">Tier Level</th>
                <th className="py-2.5 px-3 text-right">Annual Quota</th>
                <th className="py-2.5 px-3 text-right">Fulfillment</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.distributionAgreements.map((dis) => (
                <tr key={dis.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{dis.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{dis.distributor}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{dis.territory}</td>
                  <td className="py-2.5 px-3 font-semibold">{dis.tier}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold">{dis.annualQuota}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-bold">{dis.fulfillmentRate}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                      {dis.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 4: RFP PROPOSALS */}
        {activeTab === "rfps" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">RFP ID</th>
                <th className="py-2.5 px-3">Proposal Title</th>
                <th className="py-2.5 px-3">Tendering Authority</th>
                <th className="py-2.5 px-3">Deadline</th>
                <th className="py-2.5 px-3 text-right">Bid Value</th>
                <th className="py-2.5 px-3 text-right">Win Predictability</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.rfpProposals.map((rfp) => (
                <tr key={rfp.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-primary">{rfp.id}</td>
                  <td className="py-2.5 px-3 font-bold text-foreground">{rfp.title}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{rfp.issuer}</td>
                  <td className="py-2.5 px-3 font-mono text-muted-foreground">{rfp.submissionDeadline}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">{rfp.value}</td>
                  <td className="py-2.5 px-3 text-right font-semibold text-emerald-600">{rfp.winProbability}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                      {rfp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* TAB 5: GLOBAL EXPANSION */}
        {activeTab === "expansion" && (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 pb-2 text-[10px] font-bold uppercase text-muted-foreground">
                <th className="py-2.5 px-3">Expansion Region</th>
                <th className="py-2.5 px-3">Target Launch</th>
                <th className="py-2.5 px-3">Channel Distributors</th>
                <th className="py-2.5 px-3">Regulatory Score</th>
                <th className="py-2.5 px-3 text-right">Est. TAM</th>
                <th className="py-2.5 px-3 text-right">Expansion Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {data.expansionMarketsList.map((exp) => (
                <tr key={exp.region} className="hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-blue-500" /> {exp.region}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-muted-foreground">{exp.targetLaunch}</td>
                  <td className="py-2.5 px-3 font-mono">{exp.distributorCount} active</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">{exp.regulatoryScore}/100</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-foreground">{exp.estimatedTAM}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-500/20">
                      {exp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
});

/* ===========================================================================
   6. Market Radar, Growth Alerts & Regulatory Watch (1 of 3 cols - size "md")
   =========================================================================== */
export const BdSystemAlertsWidget = memo(function BdSystemAlertsWidget() {
  const { data, isLoading } = useQuery(bdOverviewOptions());

  if (isLoading || !data) return <Skeleton className="h-[350px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <CardHeader title="Market Radar & Growth Alerts" />
        <p className="mt-1 text-xs text-muted-foreground">Autonomous alerts across partner pipeline, contracts, and regulatory filings.</p>

        <div className="mt-4 space-y-3">
          {data.alerts.map((al) => {
            const bg =
              al.type === "warning"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400"
                : al.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
                : "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400";
            return (
              <div key={al.title} className={cn("rounded-lg border p-3 text-xs leading-relaxed", bg)}>
                <div className="font-bold">{al.title}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{al.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground">
          3-Quarter Pipeline Conversion Forecast
        </h4>
        <div className="space-y-2 text-xs">
          {data.forecast.map((fc) => (
            <div key={fc.period} className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <span className="font-medium text-muted-foreground">{fc.period}</span>
              <div className="flex items-center gap-1.5 font-bold tabular font-mono text-emerald-600">
                <ArrowUpRight className="h-3 w-3" />
                <span>₹ {(fc.amount / 10000000).toFixed(1)} Cr</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   7. AI Business Development Intelligence Center (full width - size "full")
   =========================================================================== */
function AiScoreBall({
  label,
  value,
  inverse = false,
}: {
  label: string;
  value: number;
  inverse?: boolean;
}) {
  const isHealthy = inverse ? value < 30 : value > 75;
  const colorClass = isHealthy ? "text-[#22C55E]" : "text-destructive";
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-border/40 bg-muted/20 p-4 shadow-2xs">
      <span className={`font-display text-2xl font-bold font-mono ${colorClass}`}>{value}%</span>
      <span className="mt-1 text-center text-[10px] font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export const BdAiIntelligenceWidget = memo(function BdAiIntelligenceWidget() {
  const { data, isLoading } = useQuery(bdOverviewOptions());

  if (isLoading || !data) return <Skeleton className="h-[220px] rounded-xl" />;
  const aiIntel = data.aiIntelligence;

  return (
    <div className="card-soft p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between border-b border-border/40 pb-3 gap-2">
        <div className="flex items-center gap-2.5">
          <BrainCircuit className="h-5 w-5 animate-pulse text-primary" />
          <div>
            <h3 className="font-display text-[15px] font-semibold text-foreground">
              AI Business Development & Market Expansion Intelligence Center
            </h3>
            <p className="text-xs text-muted-foreground">
              Autonomous account scoring, deal cycle velocity, partner win predictability, and expansion analysis.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI Engine Active
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        <AiScoreBall label="Deal Velocity" value={aiIntel.dealVelocityScore} />
        <AiScoreBall label="Pipeline Health" value={aiIntel.pipelineHealthScore} />
        <AiScoreBall label="Win Predictability" value={aiIntel.winPredictabilityScore} />
        <AiScoreBall label="Ecosystem Risk" value={aiIntel.ecosystemRiskScore} inverse />
        <AiScoreBall label="Expansion Readiness" value={aiIntel.expansionReadinessScore} />
      </div>

      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs leading-relaxed text-foreground space-y-2">
        <div className="flex items-center justify-between">
          <strong className="font-bold text-primary flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> AI Strategic Growth Multipliers:
          </strong>
          <button
            type="button"
            onClick={() => toast.success("Autonomous Growth Multipliers triggered across pipeline!")}
            className="rounded bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground hover:bg-primary/90 transition cursor-pointer"
          >
            Execute Autonomous Growth Actions
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground pt-1">
          {aiIntel.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-primary font-bold">•</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   8. Business Development 22 Submodules Directory Hub (full width - size "full")
   =========================================================================== */
interface BDSubmoduleItem {
  id: string;
  title: string;
  desc: string;
  path: string;
  icon: any;
  color: string;
  bg: string;
  tag: string;
  category: "strategy-validation" | "gtm-commercial" | "distribution-partners" | "expansion-scaling";
  score: number;
  stage: string;
  metric: string;
}

const BD_SUBMODULES: BDSubmoduleItem[] = [
  // 1. Strategy & Market Validation (6 Modules)
  {
    id: "BMD",
    title: "Business Model Development",
    desc: "9-box BMC, value architecture & cost structures",
    path: "/development/business-development/business-model-development",
    icon: Layers,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Architecture",
    category: "strategy-validation",
    score: 86,
    stage: "In Progress",
    metric: "₹ 48.5 Cr TAM",
  },
  {
    id: "VPD",
    title: "Value Proposition Development",
    desc: "Customer jobs, pain relievers & gain creators",
    path: "/development/business-development/value-proposition-development",
    icon: Sparkles,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "Fit Matrix",
    category: "strategy-validation",
    score: 88,
    stage: "Approved",
    metric: "4.6/5 Fit Score",
  },
  {
    id: "CD",
    title: "Customer Discovery",
    desc: "Persona hypotheses & user problem discovery interviews",
    path: "/development/business-development/customer-discovery",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Interviews",
    category: "strategy-validation",
    score: 86,
    stage: "In Progress",
    metric: "45 Interviews",
  },
  {
    id: "CV",
    title: "Customer Validation",
    desc: "Early adopter traction, pilot LOIs & POC conversion",
    path: "/development/business-development/customer-validation",
    icon: Target,
    color: "text-pink-600 dark:text-pink-400",
    bg: "bg-pink-500/10",
    tag: "Traction",
    category: "strategy-validation",
    score: 88,
    stage: "Pilot Validation",
    metric: "12 Pilots Active",
  },
  {
    id: "MR",
    title: "Market Research",
    desc: "TAM / SAM / SOM modeling & demographic sizing",
    path: "/development/business-development/market-research",
    icon: BarChart3,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Market Sizing",
    category: "strategy-validation",
    score: 84,
    stage: "Validated",
    metric: "₹ 1,200 Cr TAM",
  },
  {
    id: "CA",
    title: "Competitive Analysis",
    desc: "Competitor battlecards, feature parity & SWOT matrix",
    path: "/development/business-development/competitive-analysis",
    icon: Scale,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Positioning",
    category: "strategy-validation",
    score: 85,
    stage: "Active",
    metric: "8 Competitors",
  },

  // 2. Go-To-Market & Revenue Engineering (4 Modules)
  {
    id: "GTM",
    title: "Go-To-Market (GTM)",
    desc: "Launch execution plan, ICP campaigns & readiness checklist",
    path: "/development/business-development/go-to-market-development",
    icon: Zap,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Launch Plan",
    category: "gtm-commercial",
    score: 87,
    stage: "Pre-Launch",
    metric: "Q3 Ready",
  },
  {
    id: "PSD",
    title: "Pricing Strategy",
    desc: "Willingness-to-pay tiers, elasticity & margin optimization",
    path: "/development/business-development/pricing-strategy-development",
    icon: Coins,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Yield Opt",
    category: "gtm-commercial",
    score: 86,
    stage: "Optimized",
    metric: "32% Margin",
  },
  {
    id: "RMD",
    title: "Revenue Model",
    desc: "ARR/MRR recurring forecasts & expansion multipliers",
    path: "/development/business-development/revenue-model-development",
    icon: TrendingUp,
    color: "text-cyan-600 dark:text-cyan-400",
    bg: "bg-cyan-500/10",
    tag: "ARR Stream",
    category: "gtm-commercial",
    score: 89,
    stage: "Projected",
    metric: "₹ 18.5 Cr ARR",
  },
  {
    id: "SCD",
    title: "Sales Channel",
    desc: "Direct vs indirect routing, channel quotas & incentives",
    path: "/development/business-development/sales-channel-development",
    icon: Briefcase,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Channels",
    category: "gtm-commercial",
    score: 84,
    stage: "Active Channels",
    metric: "4 Channels Active",
  },

  // 3. Distribution & Ecosystem Channels (5 Modules)
  {
    id: "FD",
    title: "Franchise Development",
    desc: "Franchisee expansion, territory mapping & royalty models",
    path: "/development/business-development/franchise-development",
    icon: Building2,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    tag: "Territories",
    category: "distribution-partners",
    score: 82,
    stage: "Expansion Ready",
    metric: "24 Territories",
  },
  {
    id: "PD",
    title: "Partnership Development",
    desc: "Strategic alliances, tech co-development & joint ventures",
    path: "/development/business-development/partnership-development",
    icon: Handshake,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    tag: "Alliances",
    category: "distribution-partners",
    score: 86,
    stage: "Strategic JV",
    metric: "₹ 120 Cr JV Value",
  },
  {
    id: "DND",
    title: "Dealer Network",
    desc: "Dealership appointments, stock quotas & dealer margins",
    path: "/development/business-development/dealer-network-development",
    icon: Compass,
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
    tag: "Dealerships",
    category: "distribution-partners",
    score: 85,
    stage: "Authorized",
    metric: "68.5% Coverage",
  },
  {
    id: "DD",
    title: "Distributor Development",
    desc: "Master logistics distribution, warehousing & credit lines",
    path: "/development/business-development/distributor-development",
    icon: Share2,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    tag: "Supply Line",
    category: "distribution-partners",
    score: 87,
    stage: "Tier-1 Master",
    metric: "95% Fulfillment",
  },
  {
    id: "VED",
    title: "Vendor Ecosystem",
    desc: "Strategic component suppliers & procurement API network",
    path: "/development/business-development/vendor-ecosystem-development",
    icon: ShieldCheck,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    tag: "Ecosystem",
    category: "distribution-partners",
    score: 86,
    stage: "Audited Tier-1",
    metric: "96% On-Time",
  },

  // 4. Corporate Scaling, Global Exim & Capital (7 Modules)
  {
    id: "IR",
    title: "Investor Relations",
    desc: "Cap table dynamics & quarterly stakeholder briefings",
    path: "/development/business-development/investor-relations-development",
    icon: Award,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "Cap Table",
    category: "expansion-scaling",
    score: 85,
    stage: "Series B Ready",
    metric: "₹ 150 Cr Ask",
  },
  {
    id: "FR",
    title: "Fundraising Development",
    desc: "Series equity rounds, term sheets & venture pipeline",
    path: "/development/business-development/fundraising-development",
    icon: TrendingUp,
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-500/10",
    tag: "Venture Equity",
    category: "expansion-scaling",
    score: 88,
    stage: "Round Active",
    metric: "₹ 60 Cr Closed",
  },
  {
    id: "IED",
    title: "International Expansion",
    desc: "Cross-border market entry, regulatory & entity setup",
    path: "/development/business-development/international-expansion-development",
    icon: Globe,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    tag: "Global Entry",
    category: "expansion-scaling",
    score: 84,
    stage: "APAC & MENA",
    metric: "88/100 Reg Score",
  },
  {
    id: "ED",
    title: "Export Development",
    desc: "Customs tariffs, Letter of Credit (LC) & HS codes",
    path: "/development/business-development/export-development",
    icon: FileSpreadsheet,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    tag: "Exim Policy",
    category: "expansion-scaling",
    score: 86,
    stage: "Customs Ready",
    metric: "24 Active Orders",
  },
  {
    id: "BSD",
    title: "Business Scaling",
    desc: "Unit economics, capacity multiplication & flywheel",
    path: "/development/business-development/business-scaling-development",
    icon: TrendingUp,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    tag: "Flywheel",
    category: "expansion-scaling",
    score: 87,
    stage: "Multi-City Scale",
    metric: "2.3X Growth Plan",
  },
  {
    id: "CSD",
    title: "Corporate Strategy",
    desc: "3-5 Year Horizon planning, M&A pipeline & OKR cascade",
    path: "/development/business-development/corporate-strategy-development",
    icon: Target,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    tag: "M&A Horizon",
    category: "expansion-scaling",
    score: 88,
    stage: "5-Yr Vision Done",
    metric: "₹ 5,000 Cr Plan",
  },
  {
    id: "BTD",
    title: "Business Transformation",
    desc: "Digital modernization, process re-engineering & change",
    path: "/development/business-development/business-transformation-development",
    icon: Zap,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    tag: "Digital Shift",
    category: "expansion-scaling",
    score: 85,
    stage: "Phase 2 Rollout",
    metric: "₹ 25 Cr Cost Save",
  },
];

export const BdSubmodulesHubWidget = memo(function BdSubmodulesHubWidget() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filtered = useMemo(() => {
    return BD_SUBMODULES.filter((m) => {
      const matchCat = selectedCategory === "all" || m.category === selectedCategory;
      const matchSearch =
        !searchQuery.trim() ||
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="card-soft p-6 space-y-5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary shadow-inner">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base font-bold text-foreground">
                Business Development 22 Submodules Directory Hub
              </h2>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/20">
                22 Enterprise Modules
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Integrated strategy, customer validation, revenue engineering, partner channels, global exim, and scaling.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs shrink-0 flex-wrap">
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 flex items-center gap-2">
            <span className="text-muted-foreground font-semibold">Total Modules:</span>
            <strong className="text-foreground font-mono font-bold">22</strong>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 px-3 py-1.5 flex items-center gap-2">
            <span className="text-muted-foreground font-semibold">Avg Readiness:</span>
            <strong className="text-emerald-600 font-mono font-bold">86.2%</strong>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
          {[
            { id: "all", label: "All 22 Modules", count: 22 },
            { id: "strategy-validation", label: "Strategy & Validation", count: 6 },
            { id: "gtm-commercial", label: "GTM & Commercial", count: 4 },
            { id: "distribution-partners", label: "Distribution & Partners", count: 5 },
            { id: "expansion-scaling", label: "Expansion & Scaling", count: 7 },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border",
                selectedCategory === tab.id
                  ? "bg-primary text-primary-foreground border-primary shadow-xs"
                  : "bg-muted/30 text-muted-foreground border-border/70 hover:bg-muted hover:text-foreground"
              )}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({tab.count})</span>
            </button>
          ))}
        </div>

        <div className="relative shrink-0 w-full lg:w-72">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search submodules, tags, metrics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary shadow-2xs"
          />
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-2">
        {filtered.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.id}
              to={mod.path}
              className="group relative flex flex-col justify-between rounded-xl border border-border bg-card p-4 shadow-2xs hover:border-primary/50 hover:shadow-md transition-all duration-200 h-full"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl shadow-inner", mod.bg, mod.color)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-mono font-bold text-foreground block">{mod.id}</span>
                      <span className="rounded bg-muted/80 px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground inline-block">
                        {mod.tag}
                      </span>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-500/20">
                    {mod.stage}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed min-h-[32px]">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-muted-foreground">Key Metric</span>
                  <span className="font-bold text-foreground font-mono">{mod.metric}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Readiness</span>
                    <span className="font-bold font-mono text-emerald-600">{mod.score}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${mod.score}%` }} />
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] font-bold text-primary group-hover:underline">
                  <span>Open Workspace</span>
                  <ArrowRight className="h-3 w-3 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

/* ===========================================================================
   Export BD Panel Widget Definitions for Widget Registry
   =========================================================================== */
export const BD_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.bd.pipeline-trend",
    title: "Deal Pipeline & Commercial Revenue Horizon",
    description: "Multi-month deal pipeline growth, closed revenue realization, and win rate conversion trends.",
    category: "chart",
    tags: ["chart", "sales"],
    roles: "all",
    icon: TrendingUp,
    keywords: ["pipeline", "trend", "revenue", "win rate", "closed"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: BdPipelineTrendWidget,
  },
  {
    id: "list.bd.deal-funnel",
    title: "Commercial Deal Pipeline Stages",
    description: "Active deals volume, estimated value, and conversion velocity across 6 pipeline stages.",
    category: "list",
    tags: ["list", "sales"],
    roles: "all",
    icon: BarChart3,
    keywords: ["funnel", "stages", "deals", "velocity", "conversion"],
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BdDealFunnelWidget,
  },
  {
    id: "list.bd.partner-distribution",
    title: "Partner Ecosystem & Channel Mix",
    description: "Alliance partner breakdown across OEMs, master distributors, authorized dealers, and VARs.",
    category: "list",
    tags: ["list", "sales"],
    roles: "all",
    icon: Handshake,
    keywords: ["partners", "channels", "distribution", "alliances"],
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BdPartnerDistributionWidget,
  },
  {
    id: "chart.bd.revenue-curve",
    title: "Projected ARR & Revenue Scaling Multiplier",
    description: "Monthly recurring ARR scaling trajectory across Enterprise Deals, Channel Sales, and Licensing.",
    category: "chart",
    tags: ["chart", "sales"],
    roles: "all",
    icon: Coins,
    keywords: ["arr", "revenue", "scaling", "licensing", "projection"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: BdRevenueCurveWidget,
  },
  {
    id: "table.bd.operations-ledger",
    title: "Commercial Operations Ledger",
    description: "Interactive subledger across Commercial Deals, Strategic Alliances, Distributor Network, and RFPs.",
    category: "table",
    tags: ["table", "sales"],
    roles: "all",
    icon: Briefcase,
    keywords: ["ledger", "deals", "rfp", "alliances", "distributors"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: BdOperationsLedgerWidget,
  },
  {
    id: "insight.bd-alerts",
    title: "Market Radar & Growth Alerts",
    description: "Real-time growth warnings, regulatory clearance alerts, and 3-quarter conversion forecast.",
    category: "insight",
    tags: ["insight", "compliance"],
    roles: "all",
    icon: ShieldCheck,
    keywords: ["alerts", "radar", "warnings", "forecast", "growth"],
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: BdSystemAlertsWidget,
  },
  {
    id: "ai.bd-intelligence",
    title: "AI Business Development Intelligence Center",
    description: "Autonomous deal velocity, pipeline health, win predictability, and strategic recommendations.",
    category: "ai",
    tags: ["ai", "sales"],
    roles: "all",
    icon: BrainCircuit,
    keywords: ["ai", "intelligence", "scoring", "predictive", "recommendations"],
    defaultSize: "full",
    allowedSizes: ["xl", "full"],
    component: BdAiIntelligenceWidget,
  },
];
