import { memo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  Legend,
  Line,
} from "recharts";
import {
  ArrowRight,
  TrendingUp,
  Percent,
  Radio,
  Repeat,
  ShoppingCart,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  FileCheck,
  UserCheck,
} from "lucide-react";
import { CardHeader } from "@/components/erp/CardHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WidgetContentProps, WidgetDefinition } from "../../types";
import { supplyChainOverviewOptions } from "../../data/supplyChainQueries";

/* ===========================================================================
   1. Forecast vs Actual (Monthly) Trend Chart
   =========================================================================== */
export const SupplyChainForecastTrendWidget = memo(function SupplyChainForecastTrendWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(supplyChainOverviewOptions);
  const trend = data?.monthlyDemandTrend ?? [];
  const [selectedProduct, setSelectedProduct] = useState("All Products");

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Forecast vs Actual (Monthly)"}
        right={
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="h-8 rounded-md border border-input bg-background px-2.5 py-1 text-xs font-medium text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              <option value="All Products">All Products</option>
              <option value="DC Fast 60kW">DC Fast 60kW</option>
              <option value="DC Fast 120kW">DC Fast 120kW</option>
              <option value="AC Charger 22kW">AC Charger 22kW</option>
            </select>
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-blue-600" /> Actual Demand
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Final Forecast
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-sky-400" /> Base Forecast
              </span>
            </div>
          </div>
        }
      />
      <div className="mt-4 h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="scmActualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `${v / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
              formatter={(value: any, name: any) => [
                Number(value).toLocaleString() + " Units",
                name === "actualDemand"
                  ? "Actual Demand"
                  : name === "finalForecast"
                  ? "Final Forecast"
                  : "Base Forecast",
              ]}
            />
            <Area
              type="monotone"
              dataKey="actualDemand"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#scmActualGrad)"
              name="actualDemand"
            />
            <Line
              type="monotone"
              dataKey="finalForecast"
              stroke="#10b981"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{ r: 3, fill: "#10b981" }}
              name="finalForecast"
            />
            <Line
              type="monotone"
              dataKey="baseForecast"
              stroke="#38bdf8"
              strokeWidth={1.5}
              strokeDasharray="2 2"
              dot={false}
              name="baseForecast"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-medium text-emerald-600">
          <Sparkles className="h-3.5 w-3.5" /> AI Engine re-forecast completed 3 hours ago
        </span>
        <Link
          to="/management/supply-chain-management/demand-planning"
          className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
        >
          Open Demand Planning Form <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Forecast Accuracy Trend Donut Chart
   =========================================================================== */
export const SupplyChainAccuracyDonutWidget = memo(function SupplyChainAccuracyDonutWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(supplyChainOverviewOptions);
  const accuracyData = data?.accuracyDistribution ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Forecast Accuracy Trend"}
        subtitle="Distribution across 25 monitored SKU clusters"
      />
      <div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <div className="relative h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={accuracyData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {accuracyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold tracking-tight text-foreground">92.4%</span>
            <span className="text-[10px] font-medium text-muted-foreground">Accuracy</span>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full max-w-[190px]">
          {accuracyData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground font-medium truncate">{item.name}</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-foreground shrink-0">
                <span>{item.count}</span>
                <span className="text-[10px] text-muted-foreground font-normal">({item.value}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span className="font-medium text-emerald-600">Overall Rating: Very Good (90-94%)</span>
        <span className="text-muted-foreground">MAPE: 7.6%</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Top Demand Drivers Card
   =========================================================================== */
export const SupplyChainDemandDriversWidget = memo(function SupplyChainDemandDriversWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(supplyChainOverviewOptions);
  const drivers = data?.topDemandDrivers ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Top Demand Drivers"}
        subtitle="Ranked by signal coefficient and predictive weight"
      />
      <div className="mt-3 space-y-2.5">
        {drivers.map((driver, idx) => {
          const isHigh = driver.impact === "High";
          const isMed = driver.impact === "Medium";
          return (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    isHigh ? "bg-emerald-500" : isMed ? "bg-amber-500" : "bg-slate-400"
                  )}
                />
                <div>
                  <div className="text-xs font-semibold text-foreground">{driver.name}</div>
                  <div className="text-[10px] text-muted-foreground">{driver.source}</div>
                </div>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold border-none",
                  isHigh
                    ? "bg-emerald-500/10 text-emerald-700"
                    : isMed
                    ? "bg-amber-500/10 text-amber-700"
                    : "bg-slate-500/10 text-slate-700"
                )}
              >
                {driver.impact} Impact
              </Badge>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground flex justify-between items-center">
        <span>Active Signal Feeds: 10</span>
        <span className="text-primary font-medium hover:underline cursor-pointer">Configure Weights →</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Recent Demand Adjustments Table
   =========================================================================== */
export const SupplyChainRecentAdjustmentsWidget = memo(function SupplyChainRecentAdjustmentsWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(supplyChainOverviewOptions);
  const adjustments = data?.recentAdjustments ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Recent Demand Adjustments"}
        subtitle="Latest overrides and market event revisions"
        right={
          <Link
            to="/management/supply-chain-management/demand-planning"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
          >
            View All Adjustments <ArrowRight className="h-3 w-3" />
          </Link>
        }
      />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b text-muted-foreground font-semibold">
              <th className="pb-2">Adjustment ID</th>
              <th className="pb-2">Product</th>
              <th className="pb-2">Period</th>
              <th className="pb-2 text-right">Original</th>
              <th className="pb-2 text-right">Adjustment</th>
              <th className="pb-2 text-right">Revised</th>
              <th className="pb-2">Reason</th>
              <th className="pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {adjustments.map((adj) => {
              const isApproved = adj.status === "Approved";
              const isPositive = adj.adjustment > 0;
              return (
                <tr key={adj.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-mono font-medium text-primary">{adj.id}</td>
                  <td className="py-2.5 font-medium text-foreground">{adj.product}</td>
                  <td className="py-2.5 text-muted-foreground">{adj.period}</td>
                  <td className="py-2.5 text-right font-mono text-muted-foreground">
                    {adj.originalForecast.toLocaleString()}
                  </td>
                  <td
                    className={cn(
                      "py-2.5 text-right font-mono font-semibold",
                      isPositive ? "text-emerald-600" : "text-rose-600"
                    )}
                  >
                    {isPositive ? `+${adj.adjustment}` : adj.adjustment}
                  </td>
                  <td className="py-2.5 text-right font-mono font-bold text-foreground">
                    {adj.revisedForecast.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-muted-foreground">{adj.reason}</td>
                  <td className="py-2.5 text-right">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold",
                        isApproved
                          ? "bg-emerald-500/10 text-emerald-700 border-emerald-200"
                          : "bg-amber-500/10 text-amber-700 border-amber-200"
                      )}
                    >
                      {adj.status}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span>Showing latest 4 of 12 demand adjustments</span>
        <span className="font-medium text-primary">Consensus Review scheduled tomorrow</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Upcoming Supply Chain Actions Card
   =========================================================================== */
export const SupplyChainUpcomingActionsWidget = memo(function SupplyChainUpcomingActionsWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(supplyChainOverviewOptions);
  const actions = data?.upcomingActions ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Upcoming Actions"}
        subtitle="Priority tasks and critical supply chain milestones"
        right={
          <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">
            View All Tasks →
          </span>
        }
      />
      <div className="mt-3 space-y-3">
        {actions.map((act) => (
          <div
            key={act.id}
            className="flex items-start justify-between gap-3 p-2.5 rounded-lg border bg-muted/15 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <div
                className={cn(
                  "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg border",
                  act.priority === "high"
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : act.priority === "medium"
                    ? "bg-amber-50 border-amber-200 text-amber-600"
                    : "bg-blue-50 border-blue-200 text-blue-600"
                )}
              >
                {act.priority === "high" ? (
                  <AlertTriangle className="h-3.5 w-3.5" />
                ) : (
                  <Clock className="h-3.5 w-3.5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground">{act.title}</span>
                  {act.badgeCount && (
                    <span className="grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                      {act.badgeCount}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{act.subtitle}</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] font-medium text-muted-foreground shrink-0">
              {act.dueDate}
            </Badge>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t pt-3 flex justify-between items-center text-xs text-muted-foreground">
        <span>4 Active Reminders</span>
        <Button variant="ghost" size="sm" className="h-6 text-xs text-primary p-0 hover:bg-transparent">
          Manage Notifications
        </Button>
      </div>
    </div>
  );
});

/* ===========================================================================
   6. S&OP Consensus Planning Workflow Pipeline
   =========================================================================== */
export const SupplyChainConsensusPipelineWidget = memo(function SupplyChainConsensusPipelineWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(supplyChainOverviewOptions);
  const pipeline = data?.sopConsensusPipeline ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "S&OP Consensus Review Pipeline"}
        subtitle="Department sign-offs for final demand plan release"
        right={
          <Badge className="bg-emerald-500/10 text-emerald-700 border-none font-semibold text-xs">
            Plan: DP-2026-000184
          </Badge>
        }
      />
      <div className="mt-4 grid gap-3 sm:grid-cols-5">
        {pipeline.map((stage, idx) => {
          const isDone = stage.status === "Completed";
          const isInReview = stage.status === "In Review";
          return (
            <div
              key={idx}
              className={cn(
                "p-3 rounded-lg border flex flex-col justify-between transition-all",
                isDone
                  ? "bg-emerald-50/50 border-emerald-200"
                  : isInReview
                  ? "bg-blue-50/60 border-blue-300 ring-1 ring-blue-400"
                  : "bg-muted/10 border-border"
              )}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>{stage.stage}</span>
                  {isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : isInReview ? (
                    <Clock className="h-3.5 w-3.5 text-blue-600 animate-spin" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-slate-300" />
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">{stage.department}</div>
              </div>
              <div className="mt-3 pt-2 border-t text-[10px] flex justify-between items-center">
                <span className="font-mono font-medium text-foreground">{stage.variance}</span>
                <span className="text-muted-foreground truncate max-w-[80px]">{stage.reviewer}</span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
        <span>Workflow Phase: Planner Review → Consensus Review</span>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          Open S&OP Meeting Notes
        </Button>
      </div>
    </div>
  );
});

/* ===========================================================================
   Export all Panel Widget Definitions
   =========================================================================== */
export const SUPPLY_CHAIN_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.supply-chain.forecast-trend",
    title: "Forecast vs Actual (Monthly)",
    description: "Monthly demand forecast vs actual consumption trend with product filtering.",
    category: "chart",
    tags: ["chart", "operations", "analytics"],
    icon: TrendingUp,
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: SupplyChainForecastTrendWidget,
    sourceRoute: "/management/supply-chain-management/demand-planning",
    keywords: ["demand", "forecast", "actual", "monthly", "supply chain", "variance"],
    roles: "all",
  },
  {
    id: "chart.supply-chain.accuracy-donut",
    title: "Forecast Accuracy Trend",
    description: "Donut chart of SKU clusters distributed across forecast accuracy performance bands.",
    category: "chart",
    tags: ["chart", "operations"],
    icon: Percent,
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: SupplyChainAccuracyDonutWidget,
    sourceRoute: "/management/supply-chain-management/demand-planning",
    keywords: ["accuracy", "mape", "trend", "donut", "performance"],
    roles: "all",
  },
  {
    id: "list.supply-chain.demand-drivers",
    title: "Top Demand Drivers",
    description: "Ranked list of external and internal demand drivers with predictive impact badges.",
    category: "list",
    tags: ["list", "operations", "insight"],
    icon: Radio,
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: SupplyChainDemandDriversWidget,
    sourceRoute: "/management/supply-chain-management/demand-planning",
    keywords: ["signals", "drivers", "market", "promotions", "orders"],
    roles: "all",
  },
  {
    id: "table.supply-chain.recent-adjustments",
    title: "Recent Demand Adjustments",
    description: "Table of recent forecast adjustments with original, revised quantities, and reasons.",
    category: "table",
    tags: ["table", "operations"],
    icon: Repeat,
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: SupplyChainRecentAdjustmentsWidget,
    sourceRoute: "/management/supply-chain-management/demand-planning",
    keywords: ["adjustments", "table", "overrides", "revisions"],
    roles: "all",
  },
  {
    id: "list.supply-chain.upcoming-actions",
    title: "Upcoming Supply Chain Actions",
    description: "Actionable tasks, reviews, and reforecast recommendations with due dates.",
    category: "list",
    tags: ["list", "operations"],
    icon: Clock,
    defaultSize: "md",
    allowedSizes: ["sm", "md", "lg"],
    component: SupplyChainUpcomingActionsWidget,
    sourceRoute: "/management/supply-chain-management/demand-planning",
    keywords: ["actions", "tasks", "due", "alerts"],
    roles: "all",
  },
  {
    id: "table.supply-chain.consensus-pipeline",
    title: "S&OP Consensus Review Pipeline",
    description: "Interactive stage tracker for sales, supply, ops, and finance demand plan sign-offs.",
    category: "operations",
    tags: ["operations", "list"],
    icon: Layers,
    defaultSize: "full",
    allowedSizes: ["lg", "xl", "full"],
    component: SupplyChainConsensusPipelineWidget,
    sourceRoute: "/management/supply-chain-management/demand-planning",
    keywords: ["consensus", "sop", "pipeline", "approvals"],
    roles: "all",
  },
];
