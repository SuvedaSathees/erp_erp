import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Layers,
  PieChart as PieIcon,
  MapPin,
  Building2,
  Sparkles,
  ChevronRight,
  ShoppingCart,
  DollarSign,
  Award,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Clock,
  Briefcase,
  Sliders,
  ExternalLink,
} from "lucide-react";
import { CardHeader } from "@/components/erp/CardHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WidgetContentProps, WidgetDefinition } from "../../types";
import { salesOverviewOptions } from "../../data/salesQueries";

/* ===========================================================================
   1. Sales Revenue Trend & Trajectory (2 of 3 cols)
   =========================================================================== */
export const SalesRevenueTrendWidget = memo(function SalesRevenueTrendWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(salesOverviewOptions);
  const trend = data?.revenueTrend ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Revenue Performance & Target Trajectory"}
        right={
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-sm bg-[#0A3C75]" /> Actual (₹ L)
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-0.5 w-3 bg-amber-500 border border-amber-500" /> Target
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-0.5 w-3 bg-emerald-500 border border-emerald-500" /> Forecast
            </span>
          </div>
        }
      />
      <div className="mt-4 h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} domain={[0, 60]} unit=" L" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#06101E",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "12px",
                border: "none",
              }}
              formatter={(val: any) => [`₹ ${val} Lakhs`, ""]}
            />
            <Bar dataKey="actual" fill="#0A3C75" radius={[4, 4, 0, 0]} maxBarSize={32} name="Actual" />
            <Line type="monotone" dataKey="target" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} name="Target" />
            <Line type="monotone" dataKey="forecast" stroke="#22C55E" strokeWidth={2.5} dot={{ r: 3 }} name="Forecast" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span>Target Realization: <strong className="font-mono text-foreground">84.4% YTD</strong></span>
        <span className="text-emerald-600 font-semibold font-mono">● Forecast Track: +3.0% Accuracy</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Product Revenue Donut Distribution (1 of 3 cols)
   =========================================================================== */
export const SalesProductDonutWidget = memo(function SalesProductDonutWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(salesOverviewOptions);
  const products = data?.productDistribution ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Revenue by Product Family"}
        right={<span className="text-xs font-bold text-foreground">₹ 3.80 Cr</span>}
      />
      <div className="relative my-2 h-[180px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={products}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {products.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#06101E",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-black text-foreground">₹ 3.80 Cr</span>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">Total Sales</span>
        </div>
      </div>
      <div className="space-y-1.5 border-t border-border/60 pt-3 text-xs">
        {products.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="truncate max-w-[140px] text-foreground">{p.name}</span>
            </div>
            <span className="font-bold text-foreground font-mono">{p.share}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Sales Pipeline Funnel Widget (1 of 3 cols)
   =========================================================================== */
export const SalesPipelineFunnelWidget = memo(function SalesPipelineFunnelWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(salesOverviewOptions);
  const funnel = data?.pipelineFunnel ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Pipeline Conversion Funnel"}
        right={<Badge variant="outline" className="text-[10px] font-semibold">₹ 13.2 Cr Active</Badge>}
      />
      <div className="space-y-2 mt-3">
        {funnel.map((stage, idx) => (
          <div key={idx} className="rounded-lg bg-muted/40 p-2.5 border border-border/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0A3C75] text-white text-[10px] font-bold">
                {idx + 1}
              </div>
              <div>
                <div className="font-bold text-foreground leading-none">{stage.stage}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{stage.conversion}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-[#0A3C75] font-mono">{stage.value}</div>
              <div className="text-[10px] text-muted-foreground">{stage.count} Deals</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-border/60 pt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Win Rate: <strong className="text-emerald-600 font-mono">31.0%</strong></span>
        <span>2.93x Coverage</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. 10 Sales Submodules Hub (Full width)
   =========================================================================== */
export const SalesSubmodulesHubWidget = memo(function SalesSubmodulesHubWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(salesOverviewOptions);
  const modules = data?.submodules ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Sales Management Modules Hub (10 Operations)"}
        right={
          <span className="text-xs text-muted-foreground">
            Complete Flagship Transaction Suite
          </span>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
        {modules.map((m) => (
          <Link
            key={m.id}
            to={m.route}
            className="group rounded-xl border border-border/80 bg-card p-3 shadow-xs hover:border-[#0A3C75]/60 hover:shadow-sm transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border", m.badgeColor)}>
                  {m.badge}
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-[#0A3C75] transition" />
              </div>
              <div className="font-bold text-xs text-foreground group-hover:text-[#0A3C75] transition line-clamp-1">
                {m.name}
              </div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-border/40">
              <div className="text-sm font-black text-foreground font-mono">{m.metric}</div>
              <div className="text-[10px] text-muted-foreground">{m.metricLabel}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Territory Performance Table (2 of 3 cols)
   =========================================================================== */
export const SalesTerritoryPerformanceWidget = memo(function SalesTerritoryPerformanceWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(salesOverviewOptions);
  const territories = data?.territoryPerformance ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Territory Performance & Quota Realization"}
        right={
          <Link to="/management/sales-management/territory-management" className="text-xs font-semibold text-[#0A3C75] hover:underline flex items-center gap-1">
            Manage Territories <ChevronRight className="h-3 w-3" />
          </Link>
        }
      />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-medium">
              <th className="pb-2">Territory</th>
              <th className="pb-2 text-right">Revenue</th>
              <th className="pb-2 text-right">Target</th>
              <th className="pb-2 text-right">Ach.%</th>
              <th className="pb-2 text-right">Growth</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {territories.map((t, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition">
                <td className="py-2.5 font-medium text-foreground">
                  {t.territory}
                  <span className="block text-[10px] text-muted-foreground">{t.region} Region</span>
                </td>
                <td className="py-2.5 text-right font-bold text-foreground font-mono">{t.revenue}</td>
                <td className="py-2.5 text-right text-muted-foreground font-mono">{t.target}</td>
                <td className="py-2.5 text-right">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.ach}
                  </span>
                </td>
                <td className="py-2.5 text-right font-semibold text-emerald-600 font-mono">{t.growth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

/* ===========================================================================
   6. Sales Scorecard & Health Dial (1 of 3 cols)
   =========================================================================== */
export const SalesScorecardWidget = memo(function SalesScorecardWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(salesOverviewOptions);
  const sc = data?.scorecard;

  return (
    <div className="rounded-xl bg-gradient-to-br from-[#06101E] to-[#0A3C75] text-white p-5 flex h-full flex-col justify-between shadow-md">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
            {instance.customTitle ?? "Sales Health Scorecard"}
          </span>
          <Sparkles className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex items-center gap-4 my-3">
          <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-4 border-emerald-400 bg-white/10 shadow-inner">
            <span className="text-xl font-black">{sc?.overallScore ?? 81}</span>
            <span className="text-[8px] uppercase tracking-wider text-slate-300">/ 100</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white">{sc?.grade ?? "Grade A (Strong)"}</div>
            <div className="text-xs text-slate-300 mt-0.5">Quota Achieved: {sc?.quotaAchieved ?? "84.4%"}</div>
            <div className="text-xs text-emerald-400 font-semibold mt-0.5">Coverage: {sc?.pipelineCoverage ?? "2.93x"}</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-white/15 pt-3 text-center text-xs">
        <div>
          <div className="text-[10px] text-slate-400">Margin Index</div>
          <div className="font-bold text-white mt-0.5">{sc?.marginIndex ?? "95%"}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Velocity</div>
          <div className="font-bold text-white mt-0.5">{sc?.velocity ?? "88%"}</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Retention</div>
          <div className="font-bold text-emerald-400 mt-0.5">{sc?.retention ?? "99.1%"}</div>
        </div>
      </div>
    </div>
  );
});

/* ===========================================================================
   7. Recent Confirmed Orders Table (2 of 3 cols)
   =========================================================================== */
export const SalesRecentOrdersWidget = memo(function SalesRecentOrdersWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(salesOverviewOptions);
  const orders = data?.recentOrders ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Recent Confirmed Sales Orders"}
        right={
          <Link to="/management/sales-management/sales-orders" className="text-xs font-semibold text-[#0A3C75] hover:underline flex items-center gap-1">
            View All Orders <ChevronRight className="h-3 w-3" />
          </Link>
        }
      />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-muted-foreground font-medium">
              <th className="pb-2">Order No</th>
              <th className="pb-2">Customer Name</th>
              <th className="pb-2">Date</th>
              <th className="pb-2 text-right">Value</th>
              <th className="pb-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {orders.map((o) => (
              <tr key={o.soNumber} className="hover:bg-muted/30 transition">
                <td className="py-2.5 font-bold font-mono text-[#0A3C75]">{o.soNumber}</td>
                <td className="py-2.5 font-semibold text-foreground">
                  {o.customer}
                  <span className="block text-[10px] text-muted-foreground font-normal">{o.items}</span>
                </td>
                <td className="py-2.5 text-muted-foreground">{o.date}</td>
                <td className="py-2.5 text-right font-bold text-foreground font-mono">{o.amount}</td>
                <td className="py-2.5 text-center">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {o.status}
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
   8. AI Commercial Intelligence (Full width)
   =========================================================================== */
export const SalesAIInsightsWidget = memo(function SalesAIInsightsWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(salesOverviewOptions);
  const insights = data?.aiInsights ?? [];

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 flex h-full flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
            {instance.customTitle ?? "AI Commercial Intelligence & Margin Copilot"}
          </h3>
        </div>
        <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
          3 Live Recommendations
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {insights.map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs space-y-1.5 flex flex-col justify-between">
            <div>
              <div className="font-bold text-xs text-foreground">{item.title}</div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                {item.detail}
              </p>
            </div>
            <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px]">
              <span className="font-bold text-emerald-700">{item.impact}</span>
              <Link to={item.route} className="font-bold text-[#0A3C75] hover:underline flex items-center gap-0.5">
                Review &gt;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

/* ===========================================================================
   Widget Definitions Array Export
   =========================================================================== */
export const SALES_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.sales.revenue-trend",
    title: "Revenue Performance & Target Trajectory",
    description: "Composed monthly actual revenue, sales targets, and AI consensus forecast trajectory.",
    category: "chart",
    tags: ["chart", "sales", "analytics"],
    icon: TrendingUp,
    keywords: ["sales", "revenue", "target", "forecast", "trend"],
    roles: "all",
    defaultSize: "xl",
    supportedSizes: ["lg", "xl", "full"],
    sourceRoute: "/management/sales-management/sales-analytics",
    component: SalesRevenueTrendWidget,
  },
  {
    id: "chart.sales.product-distribution",
    title: "Revenue by Product Family",
    description: "Product family revenue split donut chart across AC and DC EVSE lines.",
    category: "chart",
    tags: ["chart", "sales"],
    icon: PieIcon,
    keywords: ["product", "evse", "revenue", "donut"],
    roles: "all",
    defaultSize: "md",
    supportedSizes: ["sm", "md", "lg"],
    sourceRoute: "/management/sales-management/sales-analytics",
    component: SalesProductDonutWidget,
  },
  {
    id: "chart.sales.pipeline-funnel",
    title: "Pipeline Conversion Funnel",
    description: "Lead through negotiation stage conversion funnel with deal velocity and weighted valuation.",
    category: "chart",
    tags: ["chart", "sales", "analytics"],
    icon: Layers,
    keywords: ["pipeline", "funnel", "conversion", "leads", "deals"],
    roles: "all",
    defaultSize: "md",
    supportedSizes: ["md", "lg"],
    sourceRoute: "/management/sales-management/sales-forecasting",
    component: SalesPipelineFunnelWidget,
  },
  {
    id: "grid.sales.submodules-hub",
    title: "Sales Management Modules Hub",
    description: "10-module navigation hub with live status, active counts, and direct transaction links.",
    category: "operations",
    tags: ["operations", "sales"],
    icon: Briefcase,
    keywords: ["modules", "hub", "planning", "forecasting", "orders", "pricing"],
    roles: "all",
    defaultSize: "full",
    supportedSizes: ["full"],
    sourceRoute: "/management/sales-management/overview",
    component: SalesSubmodulesHubWidget,
  },
  {
    id: "table.sales.territory-performance",
    title: "Territory Quota Performance",
    description: "State and regional quota achievement and year-on-year revenue growth ledger.",
    category: "table",
    tags: ["table", "sales"],
    icon: MapPin,
    keywords: ["territory", "quota", "achievement", "tamil nadu"],
    roles: "all",
    defaultSize: "xl",
    supportedSizes: ["md", "lg", "xl", "full"],
    sourceRoute: "/management/sales-management/territory-management",
    component: SalesTerritoryPerformanceWidget,
  },
  {
    id: "card.sales.scorecard",
    title: "Sales Health Scorecard",
    description: "Radial dial commercial performance scorecard measuring quota, margin, velocity, and retention.",
    category: "analytics",
    tags: ["analytics", "sales"],
    icon: Award,
    keywords: ["scorecard", "dial", "grade", "velocity", "margin"],
    roles: "all",
    defaultSize: "md",
    supportedSizes: ["sm", "md"],
    sourceRoute: "/management/sales-management/sales-analytics",
    component: SalesScorecardWidget,
  },
  {
    id: "table.sales.recent-orders",
    title: "Recent Confirmed Sales Orders",
    description: "Live list of recently booked and confirmed customer sales orders with fulfillment status.",
    category: "table",
    tags: ["table", "sales", "operations"],
    icon: ShoppingCart,
    keywords: ["orders", "sales orders", "confirmed", "so"],
    roles: "all",
    defaultSize: "xl",
    supportedSizes: ["lg", "xl", "full"],
    sourceRoute: "/management/sales-management/sales-orders",
    component: SalesRecentOrdersWidget,
  },
  {
    id: "ai.sales.commercial-intelligence",
    title: "AI Commercial Intelligence",
    description: "Prescriptive commercial actions, upsell triggers, dealer buffers, and margin guard alerts.",
    category: "ai",
    tags: ["ai", "sales"],
    icon: Sparkles,
    keywords: ["ai", "intelligence", "copilot", "upsell", "margin"],
    roles: "all",
    defaultSize: "full",
    supportedSizes: ["full"],
    sourceRoute: "/management/sales-management/sales-analytics",
    component: SalesAIInsightsWidget,
  },
];
