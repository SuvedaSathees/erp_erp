/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  DollarSign,
  ExternalLink,
  Flame,
  Globe,
  Headphones,
  HeartHandshake,
  Layers,
  Lightbulb,
  PieChart as PieIcon,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatCurrency } from "@/lib/format";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { crmOverviewOptions, type CrmOverviewData } from "../../data/crmQueries";
import type { WidgetContentProps, WidgetDefinition } from "../../types";

/* ===========================================================================
   1. Pipeline Funnel Panel
   =========================================================================== */
export const PipelineFunnelWidget = memo(function PipelineFunnelWidget() {
  const { data, isLoading } = useQuery(crmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  const maxVal = Math.max(...data.funnel.map((f) => f.count), 1);
  const colors = ["#3B82F6", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

  return (
    <div className="card-soft flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
            <Target className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Sales Pipeline Funnel</h3>
            <p className="text-xs text-muted-foreground">Conversion velocity from Lead to Closed Won</p>
          </div>
        </div>
        <Link
          to="/management/crm-management/opportunity-management"
          className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          View Deals <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="flex-1 space-y-3">
        {data.funnel.map((item, idx) => (
          <div key={item.stage} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: colors[idx % colors.length] }}
                />
                {item.stage}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{formatCurrency(item.value)}</span>
                <span className="font-bold tabular text-foreground">{item.count} deals</span>
              </div>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-md bg-muted">
              <div
                className="flex h-full items-center justify-end rounded-md px-2 text-[10px] font-bold text-white transition-all"
                style={{
                  width: `${Math.max(12, (item.count / maxVal) * 100)}%`,
                  backgroundColor: colors[idx % colors.length],
                }}
              >
                {item.conversionRate}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Revenue Forecast Trend
   =========================================================================== */
export const SalesForecastTrendWidget = memo(function SalesForecastTrendWidget() {
  const { data, isLoading } = useQuery(crmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Revenue Forecast vs Actual</h3>
            <p className="text-xs text-muted-foreground">Monthly deal value closed vs pipeline projection</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">Forecast</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-muted-foreground">Actual Won</span>
          </div>
        </div>
      </div>

      <div className="h-[240px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `₹${(v / 10000000).toFixed(1)}Cr`}
            />
            <RechartsTooltip
              formatter={(val: number) => [formatCurrency(val), ""]}
              contentStyle={{ backgroundColor: "#1E293B", color: "#F8FAFC", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="revenueForecast" name="Forecast" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={32} />
            <Bar dataKey="actualRevenue" name="Actual Won" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Lead Source Donut
   =========================================================================== */
export const LeadSourceWidget = memo(function LeadSourceWidget() {
  const { data, isLoading } = useQuery(crmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[340px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col p-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/10 text-purple-500">
            <PieIcon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Lead Source Distribution</h3>
            <p className="text-xs text-muted-foreground">Inflow by origin channel</p>
          </div>
        </div>
      </div>

      <div className="h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RePieChart>
            <Pie
              data={data.leadSources}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.leadSources.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip formatter={(val: number) => [`${val}%`, "Share"]} />
          </RePieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-2 text-xs">
        {data.leadSources.map((source) => (
          <div key={source.name} className="flex items-center gap-1.5 truncate">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: source.color }} />
            <span className="truncate text-muted-foreground">{source.name}</span>
            <span className="font-bold text-foreground ml-auto">{source.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   4. High-Value Opportunities Table
   =========================================================================== */
export const TopOpportunitiesWidget = memo(function TopOpportunitiesWidget() {
  const { data, isLoading } = useQuery(crmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[280px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">High-Value Opportunities</h3>
            <p className="text-xs text-muted-foreground">Priority deals closing this quarter</p>
          </div>
        </div>
        <Link
          to="/management/crm-management/opportunity-management"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          All Deals <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground">
              <th className="pb-2 font-semibold">Opportunity</th>
              <th className="pb-2 font-semibold">Account</th>
              <th className="pb-2 font-semibold">Value</th>
              <th className="pb-2 font-semibold">Stage</th>
              <th className="pb-2 font-semibold">Prob.</th>
              <th className="pb-2 font-semibold">Close Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {data.topOpportunities.map((opp) => (
              <tr key={opp.id} className="hover:bg-muted/40 transition-colors">
                <td className="py-2.5 font-medium text-foreground">{opp.title}</td>
                <td className="py-2.5 text-muted-foreground">{opp.account}</td>
                <td className="py-2.5 font-bold text-foreground">{formatCurrency(opp.value)}</td>
                <td className="py-2.5">
                  <Badge variant="outline" className="text-[11px] font-medium bg-blue-500/10 text-blue-600 border-blue-200">
                    {opp.stage}
                  </Badge>
                </td>
                <td className="py-2.5">
                  <span className="font-semibold text-emerald-600">{opp.probability}%</span>
                </td>
                <td className="py-2.5 text-muted-foreground tabular">{opp.expectedClose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Account Health & Critical Alerts
   =========================================================================== */
export const CriticalAccountsWidget = memo(function CriticalAccountsWidget() {
  const { data, isLoading } = useQuery(crmOverviewOptions());
  if (isLoading || !data) return <Skeleton className="h-[280px] rounded-xl" />;

  return (
    <div className="card-soft flex h-full flex-col p-5">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-rose-500/10 text-rose-500">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Key Account Health Monitor</h3>
            <p className="text-xs text-muted-foreground">Health index, MRR and CSM alert status</p>
          </div>
        </div>
        <Link
          to="/management/crm-management/customer-success"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          Customer Success <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {data.criticalAccounts.map((acc) => (
          <div
            key={acc.id}
            className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-3 hover:bg-muted/30 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-foreground truncate">{acc.accountName}</h4>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    acc.healthStatus === "Healthy"
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-200"
                      : acc.healthStatus === "Monitor"
                        ? "bg-amber-500/10 text-amber-600 border-amber-200"
                        : "bg-rose-500/10 text-rose-600 border-rose-200",
                  )}
                >
                  {acc.healthStatus}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {acc.tier} · CSM: {acc.csm} · Open Tickets: {acc.openTickets}
              </p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <div className="text-xs font-bold text-foreground">{formatCurrency(acc.mrr)} /mo</div>
              <div className="text-[11px] font-semibold text-muted-foreground">Health: {acc.healthScore}/100</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   Widget Definitions
   =========================================================================== */
export const CRM_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.crm.pipeline-funnel",
    title: "Pipeline Funnel",
    description: "Multi-stage sales funnel showing deal progression and conversion rates.",
    category: "chart",
    tags: ["chart", "crm", "analytics"],
    icon: Target,
    keywords: ["funnel", "pipeline", "deals", "stages", "crm"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/crm-management/opportunity-management",
    component: PipelineFunnelWidget,
  },
  {
    id: "chart.crm.sales-forecast",
    title: "Revenue Forecast vs Actual",
    description: "Monthly revenue projection vs closed-won deals.",
    category: "chart",
    tags: ["chart", "crm", "finance"],
    icon: TrendingUp,
    keywords: ["forecast", "revenue", "monthly", "trend", "crm"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/crm-management/sales-pipeline-management",
    component: SalesForecastTrendWidget,
  },
  {
    id: "chart.crm.lead-source",
    title: "Lead Source Distribution",
    description: "Breakdown of inbound vs outbound channel lead acquisition.",
    category: "chart",
    tags: ["chart", "crm"],
    icon: PieIcon,
    keywords: ["source", "leads", "channels", "inbound", "crm"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/management/crm-management/lead-management",
    component: LeadSourceWidget,
  },
  {
    id: "table.crm.top-opportunities",
    title: "High-Value Opportunities",
    description: "Top priority deals in active proposal and negotiation.",
    category: "table",
    tags: ["table", "crm"],
    icon: Award,
    keywords: ["opportunities", "deals", "table", "crm"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/crm-management/opportunity-management",
    component: TopOpportunitiesWidget,
  },
  {
    id: "table.crm.critical-accounts",
    title: "Key Account Health Monitor",
    description: "Enterprise accounts monitoring health scores, tickets and MRR.",
    category: "table",
    tags: ["table", "crm"],
    icon: Activity,
    keywords: ["accounts", "health", "csm", "churn", "crm"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/management/crm-management/customer-success",
    component: CriticalAccountsWidget,
  },
];
