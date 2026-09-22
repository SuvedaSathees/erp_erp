import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import {
  Megaphone,
  Layers,
  Sparkles,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  Target,
  BarChart3,
  Calendar,
  IndianRupee,
  TrendingUp,
  MapPin,
  FileText,
  Mail,
  Share2,
  Globe,
  Radio,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { CardHeader } from "@/components/erp/CardHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { WidgetContentProps, WidgetDefinition } from "../../types";
import { marketingOverviewOptions } from "../../data/marketingQueries";

/* ===========================================================================
   1. Submodules Operations Hub (Full Width)
   =========================================================================== */
export const MarketingSubmodulesHubWidget = memo(function MarketingSubmodulesHubWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(marketingOverviewOptions);
  const submodules = data?.submodules ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? `Marketing Management Modules Hub (${submodules.length} Operations)`}
        right={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-blue-600">
              <Layers className="mr-1 h-3 w-3" /> {submodules.length} Operations
            </Badge>
            <Link
              to="/management/marketing-management/campaigns"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Open Campaigns <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        }
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {submodules.map((mod) => (
          <Link
            key={mod.id}
            to={mod.route}
            className="group relative rounded-xl border border-border/60 bg-card/60 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border", mod.badgeColor)}>
                {mod.badge}
              </span>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="mt-2.5 font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {mod.name}
            </div>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {mod.description}
            </p>
            <div className="mt-3 flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
              <span className="font-semibold text-foreground/80">{mod.metric}</span>
              <span className="text-primary text-[10px] font-medium flex items-center">
                Launch <ArrowUpRight className="h-2.5 w-2.5 ml-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Campaign Funnel Widget
   =========================================================================== */
export const CampaignFunnelWidget = memo(function CampaignFunnelWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(marketingOverviewOptions);
  const funnel = data?.funnel ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Campaign Conversion Funnel"}
        right={
          <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/5 text-emerald-600 text-xs">
            Reach → Customer
          </Badge>
        }
      />
      <div className="mt-4 flex flex-col justify-center space-y-2 py-2">
        {funnel.map((step, idx) => {
          // Dynamic width calculation for visually authentic tapered funnel
          const widthPercent = Math.max(100 - idx * 11, 28);
          return (
            <div key={step.stage} className="flex items-center justify-between text-xs">
              <div className="w-24 text-right pr-3 font-semibold text-foreground truncate">
                {step.stage}
              </div>
              <div className="flex-1 flex justify-center px-2">
                <div
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: step.color,
                  }}
                  className="h-7 rounded-md shadow-sm transition-all flex items-center justify-between px-3 text-white font-medium text-[11px]"
                >
                  <span className="truncate">{step.count.toLocaleString()}</span>
                  <span className="font-bold opacity-90">{step.percentage}</span>
                </div>
              </div>
              <div className="w-14 text-left pl-2 text-muted-foreground font-mono text-[11px]">
                {idx === 0 ? "Top" : `S${idx + 1}`}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Overall Conversion: <strong className="text-foreground">3.4% Lead-to-Sale</strong></span>
        <span>MQL→SQL Velocity: <strong className="text-emerald-600">44.3%</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Channel Performance Table Widget
   =========================================================================== */
export const ChannelPerformanceWidget = memo(function ChannelPerformanceWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(marketingOverviewOptions);
  const channels = data?.channels ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Channel Performance & CPL Matrix"}
        right={
          <span className="text-xs text-muted-foreground font-medium">
            Active Multi-Channel Attribution
          </span>
        }
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/80 text-muted-foreground">
              <th className="pb-2.5 font-semibold">Channel</th>
              <th className="pb-2.5 font-semibold text-right">Impressions</th>
              <th className="pb-2.5 font-semibold text-right">Clicks</th>
              <th className="pb-2.5 font-semibold text-right">Leads</th>
              <th className="pb-2.5 font-semibold text-right">Cost (₹)</th>
              <th className="pb-2.5 font-semibold text-right">CPL (₹)</th>
              <th className="pb-2.5 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {channels.map((ch) => (
              <tr key={ch.channel} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 font-semibold text-foreground flex items-center gap-2">
                  <span className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                    {ch.channel.charAt(0)}
                  </span>
                  {ch.channel}
                </td>
                <td className="py-2.5 text-right font-mono text-muted-foreground">
                  {ch.impressions.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-mono text-muted-foreground">
                  {ch.clicks.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-mono font-bold text-foreground">
                  {ch.leads}
                </td>
                <td className="py-2.5 text-right font-mono text-muted-foreground">
                  ₹{ch.cost.toLocaleString()}
                </td>
                <td className="py-2.5 text-right font-mono font-semibold text-emerald-600">
                  ₹{ch.cpl.toLocaleString()}
                </td>
                <td className="py-2.5 text-center">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {ch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Total Channel Spend: <strong className="text-foreground">₹8,00,000</strong></span>
        <span>Average CPL: <strong className="text-emerald-600">₹1,333</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Leads by Source & Locations Widget
   =========================================================================== */
export const LeadsDistributionWidget = memo(function LeadsDistributionWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(marketingOverviewOptions);
  const sources = data?.leadsBySource ?? [];
  const locations = data?.locations ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Leads by Source & Geography"}
        right={
          <Badge variant="outline" className="border-blue-500/20 bg-blue-500/5 text-blue-600 text-xs">
            500 Total Leads
          </Badge>
        }
      />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Donut Chart */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative h-[150px] w-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sources}
                  cx="50%"
                  cy="50%"
                  innerRadius={44}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sources.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-bold text-foreground">500</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Leads</span>
            </div>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-2 text-[11px]">
            {sources.map((src) => (
              <span key={src.name} className="flex items-center gap-1 text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: src.color }} />
                {src.name} ({src.percentage})
              </span>
            ))}
          </div>
        </div>

        {/* Top Locations Horizontal Bars */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 mb-2">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Top Campaign Locations
          </span>
          {locations.map((loc) => (
            <div key={loc.location} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{loc.location}</span>
                <span className="font-semibold text-foreground">{loc.percentage}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${loc.percentage}%`, backgroundColor: loc.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Budget vs Actual Spend Control Widget
   =========================================================================== */
export const BudgetVsActualWidget = memo(function BudgetVsActualWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(marketingOverviewOptions);
  const kpis = data?.kpis;

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Budget vs Actual Control"}
        right={
          <Link
            to="/management/marketing-management/campaigns"
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
          >
            View Details <ChevronRight className="h-3 w-3" />
          </Link>
        }
      />
      <div className="mt-4 space-y-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-muted/40 p-3 border border-border/50">
            <div className="text-base font-bold text-foreground">{kpis?.approvedBudget ?? "₹8,00,000"}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">Approved Budget</div>
          </div>
          <div className="rounded-lg bg-primary/5 p-3 border border-primary/20">
            <div className="text-base font-bold text-primary">{kpis?.actualSpend ?? "₹6,20,000"}</div>
            <div className="text-[11px] text-primary font-medium mt-0.5">
              Actual Spend ({kpis?.budgetUtilization ?? "77.5%"})
            </div>
          </div>
          <div className="rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/20">
            <div className="text-base font-bold text-emerald-600">{kpis?.availableBudget ?? "₹1,00,000"}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-0.5">Remaining</div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Budget Utilization Velocity</span>
            <span className="font-semibold text-foreground">{kpis?.budgetUtilization ?? "77.5%"}</span>
          </div>
          <Progress value={kpis?.campaignProgressPercent ?? 77.5} className="h-2.5" />
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
        <span>Committed: <strong>₹80,000</strong></span>
        <span>Variance: <strong className="text-emerald-600">+₹1,00,000 Favorable</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   6. AI Marketing Intelligence & Recommendation Copilot Widget
   =========================================================================== */
export const AIMarketingIntelligenceWidget = memo(function AIMarketingIntelligenceWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(marketingOverviewOptions);
  const insights = data?.aiInsights ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5 border-purple-500/20 bg-gradient-to-br from-card via-card to-purple-500/5">
      <CardHeader
        title={instance.customTitle ?? "AI Campaign Intelligence & Optimization"}
        right={
          <Badge className="bg-purple-600 text-white hover:bg-purple-700 text-xs gap-1 shadow-sm">
            <Sparkles className="h-3 w-3" /> AI Powered +
          </Badge>
        }
      />
      <div className="mt-4 space-y-2.5">
        {insights.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-card/80 p-2.5 text-xs transition-colors hover:border-purple-500/30"
          >
            <span
              className={cn(
                "mt-0.5 h-2 w-2 rounded-full shrink-0",
                item.type === "positive" && "bg-emerald-500",
                item.type === "info" && "bg-blue-500",
                item.type === "warning" && "bg-amber-500",
                item.type === "action" && "bg-purple-500",
              )}
            />
            <div className="flex-1">
              <strong className="font-semibold text-foreground">{item.title}: </strong>
              <span className="text-muted-foreground">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-purple-600 font-semibold flex items-center gap-1">
          <Zap className="h-3.5 w-3.5" /> 3 Auto-Optimizations Ready
        </span>
        <Button size="sm" variant="outline" className="h-7 text-xs border-purple-500/30 text-purple-600 hover:bg-purple-500/10">
          Apply Suggested Actions
        </Button>
      </div>
    </div>
  );
});

/* ===========================================================================
   7. Active Campaigns Master Register Table Widget
   =========================================================================== */
export const ActiveCampaignsWidget = memo(function ActiveCampaignsWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(marketingOverviewOptions);
  const campaigns = data?.activeCampaigns ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Active Campaigns Master Register"}
        right={
          <Link
            to="/management/marketing-management/campaigns"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            Open Full Master Form <ExternalLink className="h-3 w-3" />
          </Link>
        }
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/80 text-muted-foreground">
              <th className="pb-2.5 font-semibold">Campaign Code</th>
              <th className="pb-2.5 font-semibold">Campaign Name</th>
              <th className="pb-2.5 font-semibold">Type</th>
              <th className="pb-2.5 font-semibold">Owner</th>
              <th className="pb-2.5 font-semibold text-right">Budget</th>
              <th className="pb-2.5 font-semibold text-right">Spend</th>
              <th className="pb-2.5 font-semibold text-right">Leads</th>
              <th className="pb-2.5 font-semibold text-right">Attributed Revenue</th>
              <th className="pb-2.5 font-semibold text-right">ROI</th>
              <th className="pb-2.5 font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {campaigns.map((cmp) => (
              <tr key={cmp.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 font-mono font-bold text-primary">
                  <Link to="/management/marketing-management/campaigns" className="hover:underline">
                    {cmp.code}
                  </Link>
                </td>
                <td className="py-2.5 font-semibold text-foreground">
                  {cmp.name}
                </td>
                <td className="py-2.5 text-muted-foreground">
                  <Badge variant="outline" className="text-[10px] font-medium">
                    {cmp.type}
                  </Badge>
                </td>
                <td className="py-2.5 text-muted-foreground">
                  {cmp.manager}
                </td>
                <td className="py-2.5 text-right font-mono text-muted-foreground">
                  {cmp.budget}
                </td>
                <td className="py-2.5 text-right font-mono text-muted-foreground">
                  {cmp.spend}
                </td>
                <td className="py-2.5 text-right font-mono font-bold text-foreground">
                  {cmp.leads}
                </td>
                <td className="py-2.5 text-right font-mono font-semibold text-amber-600">
                  {cmp.revenue}
                </td>
                <td className="py-2.5 text-right font-mono font-bold text-emerald-600">
                  {cmp.roi}
                </td>
                <td className="py-2.5 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      cmp.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                    )}
                  >
                    {cmp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ===========================================================================
   8. Recent Campaign Activities Widget
   =========================================================================== */
export const RecentCampaignActivitiesWidget = memo(function RecentCampaignActivitiesWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(marketingOverviewOptions);
  const activities = data?.recentActivities ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Recent Campaign Activities"}
        right={
          <span className="text-xs text-muted-foreground font-mono">Real-time Stream</span>
        }
      />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/80 text-muted-foreground">
              <th className="pb-2 font-semibold">Date</th>
              <th className="pb-2 font-semibold">Activity</th>
              <th className="pb-2 font-semibold">User</th>
              <th className="pb-2 font-semibold text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {activities.map((act) => (
              <tr key={act.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2 text-muted-foreground font-mono text-[11px]">{act.date}</td>
                <td className="py-2 font-medium text-foreground">{act.activity}</td>
                <td className="py-2 text-muted-foreground">{act.user}</td>
                <td className="py-2 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    {act.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ===========================================================================
   Widget Definitions Registry Export
   =========================================================================== */
export const MARKETING_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "grid.marketing.submodules-hub",
    title: "Marketing Management Modules Hub",
    description: "Interactive directory of all 10 Marketing Management submodules and execution workspaces.",
    category: "panel",
    tags: ["navigation", "marketing", "operations"],
    icon: Layers,
    keywords: ["marketing", "modules", "campaigns", "leads", "events", "content"],
    roles: "all",
    sourceRoute: "/management/marketing-management/overview",
    defaultSize: "full",
    component: MarketingSubmodulesHubWidget,
  },
  {
    id: "chart.marketing.campaign-funnel",
    title: "Campaign Conversion Funnel",
    description: "Visual stage progression from Reach to Engagement, Leads, MQL, SQL, Opportunities, and Customers.",
    category: "chart",
    tags: ["chart", "marketing", "funnel", "conversion"],
    icon: Filter,
    keywords: ["funnel", "conversion", "mql", "sql", "leads"],
    roles: "all",
    sourceRoute: "/management/marketing-management/campaigns",
    defaultSize: "md",
    component: CampaignFunnelWidget,
  },
  {
    id: "table.marketing.channel-performance",
    title: "Channel Performance & CPL Matrix",
    description: "Multi-channel comparison of Impressions, Clicks, Leads, Cost, and CPL across LinkedIn, Google, Email, Events.",
    category: "table",
    tags: ["table", "marketing", "channels", "cpl"],
    icon: BarChart3,
    keywords: ["channel", "performance", "cpl", "google", "linkedin", "email"],
    roles: "all",
    sourceRoute: "/management/marketing-management/digital-marketing",
    defaultSize: "xl",
    component: ChannelPerformanceWidget,
  },
  {
    id: "chart.marketing.leads-by-source",
    title: "Leads by Source & Geography",
    description: "Donut chart of lead acquisition sources and geographic territory breakdown.",
    category: "chart",
    tags: ["chart", "marketing", "leads", "geography"],
    icon: Target,
    keywords: ["leads", "source", "donut", "geography", "territory"],
    roles: "all",
    sourceRoute: "/management/marketing-management/leads-management",
    defaultSize: "md",
    component: LeadsDistributionWidget,
  },
  {
    id: "panel.marketing.budget-vs-actual",
    title: "Budget vs Actual Control",
    description: "Campaign spending controls, approved budgets, commitments, variance and velocity.",
    category: "panel",
    tags: ["panel", "marketing", "budget", "finance"],
    icon: IndianRupee,
    keywords: ["budget", "spend", "variance", "finance"],
    roles: "all",
    sourceRoute: "/management/marketing-management/campaigns",
    defaultSize: "md",
    component: BudgetVsActualWidget,
  },
  {
    id: "table.marketing.recent-activities",
    title: "Recent Campaign Activities",
    description: "Audit trail of recent marketing activities, launches, approvals, and content releases.",
    category: "table",
    tags: ["table", "marketing", "audit", "stream"],
    icon: Clock,
    keywords: ["activities", "audit", "stream", "history"],
    roles: "all",
    sourceRoute: "/management/marketing-management/campaigns",
    defaultSize: "md",
    component: RecentCampaignActivitiesWidget,
  },
  {
    id: "ai.marketing.intelligence",
    title: "AI Campaign Intelligence & Optimization",
    description: "Predictive lead propensity, budget optimization alerts, and campaign copilot insights.",
    category: "ai",
    tags: ["ai", "marketing", "intelligence", "copilot"],
    icon: Sparkles,
    keywords: ["ai", "copilot", "optimization", "intelligence"],
    roles: "all",
    sourceRoute: "/management/marketing-management/campaigns",
    defaultSize: "full",
    component: AIMarketingIntelligenceWidget,
  },
  {
    id: "table.marketing.active-campaigns",
    title: "Active Campaigns Master Register",
    description: "Master list of controlled campaigns with stage, owner, spend, attributed revenue, and ROI.",
    category: "table",
    tags: ["table", "marketing", "campaigns", "master"],
    icon: Megaphone,
    keywords: ["campaigns", "master", "register", "active"],
    roles: "all",
    sourceRoute: "/management/marketing-management/campaigns",
    defaultSize: "full",
    component: ActiveCampaignsWidget,
  },
];
