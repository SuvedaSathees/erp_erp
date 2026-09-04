import { memo } from "react";
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
  Bar,
  ComposedChart,
  Line,
} from "recharts";
import {
  Activity,
  ArrowRight,
  Boxes,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Coins,
  Cpu,
  Gauge,
  Layers,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { CardHeader } from "@/components/erp/CardHeader";
import { StatusBadge } from "@/components/erp/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { WidgetContentProps, WidgetDefinition } from "../../types";
import { assetOverviewOptions } from "../../data/assetQueries";

/* ===========================================================================
   1. Portfolio Trend & Value Horizon (2 of 3 cols)
   =========================================================================== */
export const AssetPortfolioTrendWidget = memo(function AssetPortfolioTrendWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(assetOverviewOptions);
  const trend = data?.portfolioTrend ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Asset Portfolio & Capital Value Horizon"}
        right={
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Gross Value
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Net Book Value
            </span>
          </div>
        }
      />
      <div className="mt-4 h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grossGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="nbvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} domain={[0, 22]} unit=" Cr" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(val: any) => [`₹ ${val} Cr`, ""]}
            />
            <Area type="monotone" dataKey="grossValue" stroke="#2563eb" strokeWidth={2.5} fill="url(#grossGrad)" name="Gross Value" />
            <Line type="monotone" dataKey="netBookValue" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3, fill: "#10b981" }} name="Net Book Value" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span>Portfolio Size: <strong className="font-mono text-foreground">428 Assets</strong></span>
        <span className="text-emerald-600 font-semibold font-mono">● 70.97% Carrying Value Ratio</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Submodule Quick Status (1 of 3 cols)
   =========================================================================== */
export const SubmoduleQuickStatusWidget = memo(function SubmoduleQuickStatusWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(assetOverviewOptions);
  const items = (data?.submodules ?? []).slice(0, 5);

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Submodules Quick Status"}
      />
      <div className="mt-3 divide-y divide-border/60 text-xs">
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between py-2.5">
            <div className="min-w-0">
              <Link to={s.route} className="font-semibold text-foreground hover:text-primary transition-colors truncate block">
                {s.name}
              </Link>
              <span className="text-[11px] text-muted-foreground truncate block">{s.metricLabel}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono font-bold text-foreground text-xs">{s.metric}</span>
              <Link to={s.route} className="text-muted-foreground hover:text-primary transition-colors p-1">
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 border-t border-border/60 pt-2 text-right">
        <Link to="/management/asset-management/fixed-assets" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
          View Master Register <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Equipment Fleet & Health Status (1 of 3 cols)
   =========================================================================== */
export const EquipmentHealthWidget = memo(function EquipmentHealthWidget({
  instance,
}: WidgetContentProps) {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Equipment Fleet Health"}
      />
      <div className="mt-3 space-y-3">
        <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/50 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-muted-foreground block">Fleet OEE Average</span>
            <span className="text-xl font-bold font-mono text-emerald-600">88.4%</span>
          </div>
          <Badge variant="outline" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200 text-[10px] font-mono">
            Optimal
          </Badge>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">In Active Production</span>
            <span className="font-mono font-bold text-foreground">76 Units (88.4%)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Scheduled Servicing</span>
            <span className="font-mono font-bold text-amber-600">6 Units (7.0%)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Standby / Available</span>
            <span className="font-mono font-bold text-blue-600">4 Units (4.6%)</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Mean Time Between Failures</span>
            <span className="font-mono font-bold text-foreground">620 Hours</span>
          </div>
        </div>
      </div>

      <div className="mt-3 border-t border-border/60 pt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Fleet: 86 Units</span>
        <Link to="/management/asset-management/equipment" className="font-bold text-primary hover:underline inline-flex items-center gap-1">
          Equipment Fleet &rarr;
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Depreciation Horizon & Amortization (2 of 3 cols)
   =========================================================================== */
export const DepreciationHorizonWidget = memo(function DepreciationHorizonWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(assetOverviewOptions);
  const sched = data?.depreciationSchedule ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Depreciation Schedule & Amortization"}
        right={
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-blue-600" /> Straight-Line (SLM)
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> WDV Method
            </span>
          </div>
        }
      />
      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sched} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="slmGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="wdvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" strokeOpacity={0.08} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} domain={[0, 25]} unit=" L" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(val: any) => [`₹ ${val} L`, ""]}
            />
            <Area type="monotone" dataKey="straightLine" stroke="#2563eb" strokeWidth={2} fill="url(#slmGrad)" name="Straight-Line" />
            <Area type="monotone" dataKey="wdv" stroke="#f59e0b" strokeWidth={2} fill="url(#wdvGrad)" name="WDV Method" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <span>Monthly Amortization: <strong className="font-mono text-foreground">₹ 23.45 L</strong></span>
        <span>YTD Depr: <strong className="font-mono text-amber-600">₹ 1.98 Cr</strong></span>
        <Link to="/management/asset-management/asset-depreciation" className="font-bold text-primary hover:underline">
          Manage Schedules &rarr;
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   5. Submodules Operations Ledger Table (2 of 3 cols)
   =========================================================================== */
export const SubmodulesOperationsLedgerWidget = memo(function SubmodulesOperationsLedgerWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(assetOverviewOptions);
  const submodules = data?.submodules ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Asset Management Submodules Operations Hub"}
      />
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-border/60 text-[10.5px] text-muted-foreground font-semibold">
              <th className="pb-2">Submodule Name</th>
              <th className="pb-2">Classification</th>
              <th className="pb-2">Primary Metric</th>
              <th className="pb-2 text-center">Health</th>
              <th className="pb-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {submodules.map((m) => (
              <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 font-semibold text-foreground">
                  <Link to={m.route} className="hover:text-primary transition-colors">
                    {m.name}
                  </Link>
                </td>
                <td className="py-2.5">
                  <span className={cn("px-2 py-0.5 rounded text-[10px] font-medium border", m.badgeColor)}>
                    {m.badge}
                  </span>
                </td>
                <td className="py-2.5 font-mono">
                  <span className="font-bold text-foreground">{m.metric}</span>
                  <span className="text-[10px] text-muted-foreground ml-1.5 hidden sm:inline">({m.metricLabel})</span>
                </td>
                <td className="py-2.5 text-center font-mono font-bold text-emerald-600">
                  {m.health}
                </td>
                <td className="py-2.5 text-right">
                  <Link
                    to={m.route}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                  >
                    Open <ArrowRight className="h-3 w-3" />
                  </Link>
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
   6. Asset System & Calibration Alerts (1 of 3 cols)
   =========================================================================== */
export const AssetAlertsWidget = memo(function AssetAlertsWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(assetOverviewOptions);
  const alerts = data?.alerts ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <CardHeader
        title={instance.customTitle ?? "Asset Alerts & Verification"}
      />
      <div className="mt-3 space-y-2.5">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={cn(
              "p-2.5 rounded-lg border text-xs space-y-1 transition-colors",
              a.severity === "critical"
                ? "bg-rose-50/60 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900"
                : a.severity === "warning"
                ? "bg-amber-50/60 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900"
                : a.severity === "info"
                ? "bg-blue-50/60 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900"
                : "bg-emerald-50/60 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900"
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                {a.severity === "critical" && <span className="h-2 w-2 rounded-full bg-rose-500" />}
                {a.severity === "warning" && <span className="h-2 w-2 rounded-full bg-amber-500" />}
                {a.severity === "info" && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                {a.severity === "success" && <span className="h-2 w-2 rounded-full bg-emerald-500" />}
                {a.title}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{a.time}</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">{a.subtitle}</p>
            <div className="text-right pt-0.5">
              <Link to={a.route} className="text-[10.5px] font-bold text-primary hover:underline inline-flex items-center gap-1">
                Inspect <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 border-t border-border/60 pt-2 text-right">
        <span className="text-[10.5px] text-muted-foreground font-medium">Auto-Monitoring v4.8 Active</span>
      </div>
    </div>
  );
});

/* ===========================================================================
   7. AI Capital Asset Intelligence (Full Width)
   =========================================================================== */
export const AssetAiIntelligenceWidget = memo(function AssetAiIntelligenceWidget({
  instance,
}: WidgetContentProps) {
  const { data } = useQuery(assetOverviewOptions);
  const insights = data?.aiInsights ?? [];

  return (
    <div className="card-soft flex h-full flex-col justify-between overflow-hidden p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {instance.customTitle ?? "AI Capital Asset Intelligence & Portfolio Advisory"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Machine learning models analyzing asset degradation curves, maintenance telemetrics, and capital replacement schedules
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 text-xs font-mono self-start sm:self-auto">
          AI Engine Active
        </Badge>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((ins) => (
          <div key={ins.id} className="p-3.5 rounded-xl border border-border/80 bg-background/50 flex flex-col justify-between space-y-2.5 shadow-2xs">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground leading-snug">{ins.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted/60 text-muted-foreground shrink-0">
                  {ins.impact}
                </span>
              </div>
              <p className="text-[11.5px] text-muted-foreground mt-2 leading-relaxed">
                {ins.detail}
              </p>
            </div>
            <div className="pt-2 border-t border-border/40 flex items-center justify-end">
              <Link to={ins.route} className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                Open Action <ArrowRight className="h-3 w-3" />
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
export const ASSET_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.asset.portfolio-trend",
    title: "Asset Portfolio & Value Horizon",
    description: "Gross capital expenditure vs carrying net book value area chart.",
    category: "chart",
    tags: ["chart", "finance"],
    icon: Layers,
    roles: "all",
    defaultSize: "xl",
    component: AssetPortfolioTrendWidget,
  },
  {
    id: "list.asset.submodule-status",
    title: "Submodule Quick Status",
    description: "Quick operational status and metrics across core submodules.",
    category: "list",
    tags: ["list", "operations"],
    icon: Boxes,
    roles: "all",
    defaultSize: "md",
    component: SubmoduleQuickStatusWidget,
  },
  {
    id: "list.asset.equipment-health",
    title: "Equipment Fleet Health",
    description: "Machinery availability, OEE breakdown, and reliability metrics.",
    category: "list",
    tags: ["list", "operations"],
    icon: Building2,
    roles: "all",
    defaultSize: "md",
    component: EquipmentHealthWidget,
  },
  {
    id: "chart.asset.depreciation-curve",
    title: "Depreciation Horizon & Amortization",
    description: "Monthly Straight-Line vs WDV depreciation run rate.",
    category: "chart",
    tags: ["chart", "finance"],
    icon: Coins,
    roles: "all",
    defaultSize: "xl",
    component: DepreciationHorizonWidget,
  },
  {
    id: "table.asset.submodules-ledger",
    title: "Submodules Operations Hub",
    description: "Consolidated operational register across all 10 Asset Management submodules.",
    category: "table",
    tags: ["table", "operations"],
    icon: Activity,
    roles: "all",
    defaultSize: "xl",
    component: SubmodulesOperationsLedgerWidget,
  },
  {
    id: "insight.asset-alerts",
    title: "Asset System & Calibration Alerts",
    description: "Actionable metrology, IoT sensor, and tracking verification triggers.",
    category: "insight",
    tags: ["insight", "operations"],
    icon: ShieldAlert,
    roles: "all",
    defaultSize: "md",
    component: AssetAlertsWidget,
  },
  {
    id: "ai.asset-intelligence",
    title: "AI Capital Asset Intelligence",
    description: "Machine learning portfolio advisory, CapEx forecasting, and tax shield optimization.",
    category: "ai",
    tags: ["ai", "finance"],
    icon: Sparkles,
    roles: "all",
    defaultSize: "full",
    component: AssetAiIntelligenceWidget,
  },
];
