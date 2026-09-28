import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ShieldAlert,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Edit2,
  Calendar,
  User,
  Activity,
  ArrowRight,
  Layers,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Info,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { WidgetDefinition } from "../../types";
import { riskOverviewOptions } from "../../data/riskQueries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 1. Risk Details Panel Widget
 */
export function RiskDetailsPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const risk = data?.primaryRisk;

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 pr-24 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <span>Risk Details</span>
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground border-border/60 font-normal py-0 px-1.5 h-4">
              Master Record
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Controlled enterprise master record and ownership coordinates.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Risk Title *</label>
            <div className="font-semibold text-foreground truncate mt-0.5" title={risk?.title}>
              {risk?.title ?? "Supply Chain Disruption - Critical Components"}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Risk Category *</label>
            <div className="mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-border bg-muted/40 font-medium">
                {risk?.category ?? "Supply Chain"}
              </span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Risk Type *</label>
            <div className="mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded border border-border bg-muted/40 font-medium">
                {risk?.type ?? "Threat"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Business Function</label>
            <div className="font-medium text-foreground mt-0.5">{risk?.businessFunction ?? "Operations"}</div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Business Process</label>
            <div className="font-medium text-foreground mt-0.5">{risk?.businessProcess ?? "Procurement"}</div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Department</label>
            <div className="font-medium text-foreground mt-0.5">{risk?.department ?? "Supply Chain"}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1 border-t border-border/40">
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Risk Owner</label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-5 w-5 rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center text-[10px]">
                KR
              </div>
              <span className="font-semibold text-foreground">{risk?.owner ?? "Karthik R."}</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Risk Coordinator</label>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-600 font-bold flex items-center justify-center text-[10px]">
                PS
              </div>
              <span className="font-medium text-foreground">{risk?.coordinator ?? "Priya Sharma"}</span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Priority</label>
            <div className="mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-600 border border-rose-200">
                ↑ High
              </span>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground">Status</label>
            <div className="mt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Monitoring
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/40">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Identification Date: <strong className="text-foreground">{risk?.identificationDate ?? "15-Aug-2026"}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 text-primary" />
            <span>Review Date: <strong className="text-foreground">{risk?.reviewDate ?? "15-Nov-2026"}</strong></span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 border-t border-border/40 bg-muted/10 flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground">Enterprise Governance Master</span>
        <Button variant="ghost" size="sm" className="h-6 text-xs text-primary hover:underline p-0 gap-1">
          <Edit2 className="h-3 w-3" />
          Edit Record
        </Button>
      </CardFooter>
    </Card>
  );
}

/**
 * 2. Risk Statement & Business Impact Panel Widget
 */
export function RiskStatementPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const risk = data?.primaryRisk;
  const impacts = risk?.businessImpacts ?? [
    "Production Delay",
    "Increased Cost",
    "Customer Dissatisfaction",
    "Revenue Loss",
    "Reputation Risk",
  ];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 pr-24 border-b border-border/40">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <span>Risk Statement</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Because of [CAUSE], [RISK EVENT] may occur, resulting in [CONSEQUENCE].
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="relative pl-6 pr-3 py-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/40 text-xs italic text-slate-800 dark:text-slate-200 leading-relaxed">
          <span className="absolute left-2 top-2 text-2xl text-primary/40 font-serif leading-none">“</span>
          {risk?.statement ??
            "Because of dependency on a single supplier for critical power electronics components, supply interruption may occur, resulting in production delays and customer delivery impact."}
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
            Business Impact
          </span>
          <div className="flex flex-wrap gap-1.5">
            {impacts.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20 transition-colors hover:bg-primary/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 3. Risk Heat Map Panel Widget (5x5 Matrix)
 */
export function RiskHeatMapPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const [hoveredCell, setHoveredCell] = useState<{ l: number; i: number } | null>(null);

  const getCellColor = (l: number, i: number) => {
    const score = l * i;
    if (score >= 17) return "bg-red-500 text-white hover:bg-red-600";
    if (score >= 10) return "bg-orange-500 text-white hover:bg-orange-600";
    if (score >= 5) return "bg-amber-400 text-slate-900 hover:bg-amber-500";
    return "bg-emerald-500 text-white hover:bg-emerald-600";
  };

  const getCellContent = (l: number, i: number) => {
    if (l === 4 && i === 5) {
      return (
        <span
          className="h-3 w-3 rounded-full bg-white ring-2 ring-slate-900 shadow-md animate-pulse"
          title="ER-2026-001 (Score 20)"
        />
      );
    }
    if (l === 4 && i === 4) {
      return <span className="h-2 w-2 rounded-full bg-white/90 ring-1 ring-slate-900" title="ER-002 (Score 16)" />;
    }
    if (l === 5 && i === 5) {
      return <span className="h-2.5 w-2.5 rounded-full bg-white ring-1 ring-slate-900" title="ER-006 (Score 25)" />;
    }
    return null;
  };

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 pr-24 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>Risk Heat Map</span>
          </CardTitle>
          <CardDescription className="text-xs">
            5×5 Inherent & Residual risk matrix with configurable appetite.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
          {/* Y-Axis Label */}
          <div className="flex items-center justify-center">
            <span className="-rotate-90 text-[10px] font-bold tracking-wider text-muted-foreground uppercase whitespace-nowrap">
              Likelihood
            </span>
          </div>

          <div className="flex-1 space-y-1">
            {[5, 4, 3, 2, 1].map((l) => (
              <div key={l} className="flex items-center gap-1.5">
                <span className="w-16 text-[10px] font-semibold text-right text-muted-foreground truncate">
                  {l === 5 && "5 Almost Certain"}
                  {l === 4 && "4 Likely"}
                  {l === 3 && "3 Possible"}
                  {l === 2 && "2 Unlikely"}
                  {l === 1 && "1 Rare"}
                </span>
                <div className="grid grid-cols-5 gap-1 flex-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredCell({ l, i })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={cn(
                        "h-6 rounded flex items-center justify-center text-[10px] font-bold transition-transform cursor-pointer relative",
                        getCellColor(l, i),
                      )}
                    >
                      {getCellContent(l, i)}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* X-Axis Labels */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="w-16" />
              <div className="grid grid-cols-5 gap-1 flex-1 text-center">
                <span className="text-[9px] font-semibold text-muted-foreground">1 Insig</span>
                <span className="text-[9px] font-semibold text-muted-foreground">2 Minor</span>
                <span className="text-[9px] font-semibold text-muted-foreground">3 Mod</span>
                <span className="text-[9px] font-semibold text-muted-foreground">4 Major</span>
                <span className="text-[9px] font-semibold text-muted-foreground">5 Severe</span>
              </div>
            </div>
            <div className="text-center text-[10px] font-bold tracking-wider text-muted-foreground uppercase pt-0.5">
              Impact
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-[10px] pt-2 border-t border-border/40 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Low (1–4)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Moderate (5–9)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            High (10–16)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Critical (17–25)
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 4. Risk Distribution by Category Panel Widget
 */
export function RiskCategoryDistributionPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const categories = data?.categoryDistribution ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 pr-24 border-b border-border/40">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span>Risk Distribution by Category</span>
        </CardTitle>
        <CardDescription className="text-xs">
          Enterprise portfolio breakdown across 12 risk categories.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="h-[180px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any, item: any) => [
                    `${val} risks (${item.payload.percentage}%)`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-extrabold text-foreground leading-none">42</span>
              <span className="text-[10px] font-semibold text-muted-foreground mt-0.5">Total Risks</span>
            </div>
          </div>

          <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1 text-xs">
            {categories.map((c) => (
              <div key={c.name} className="flex items-center justify-between py-1 border-b border-border/20">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span className="font-medium text-foreground text-[11px] truncate">{c.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-mono shrink-0">
                  <span className="text-muted-foreground">{c.percentage}%</span>
                  <span className="font-bold text-foreground w-4 text-right">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 5. Risk Trend Panel Widget
 */
export function RiskTrendPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const trend = data?.trendData ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 pr-24 border-b border-border/40">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span>Risk Velocity & Exposure Trend</span>
        </CardTitle>
        <CardDescription className="text-xs">
          6-Month trajectory across critical, high, and moderate enterprise risks.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[185px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} domain={[0, 50]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 6 }} />
              <Line
                type="monotone"
                dataKey="totalRisks"
                name="Total Risks"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="highCritical"
                name="High & Critical"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="medium"
                name="Medium"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="low"
                name="Low"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 6. Key Risk Indicators (KRI) Panel Widget - FIXED & BEAUTIFIED
 */
export function KriListPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const kris = data?.kris ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between bg-card">
      <CardHeader className="p-4 pb-2.5 pr-24 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>Key Risk Indicators (KRI)</span>
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground border-border/60 font-normal py-0 px-1.5 h-4">
              5 Monitored
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Early warning metric thresholds and trigger monitoring.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-2 text-xs flex-1">
        {/* Fixed Table Header with clean flex spacing */}
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase pb-2 border-b border-border/40">
          <span className="flex-1 min-w-0 pr-2">KRI Metric Name</span>
          <span className="w-16 text-right font-medium shrink-0">Current</span>
          <span className="w-20 text-right font-medium shrink-0">Threshold</span>
          <span className="w-20 text-right font-medium shrink-0">Status</span>
        </div>

        {kris.slice(0, 5).map((kri) => (
          <div key={kri.id} className="flex items-center justify-between py-2 border-b border-border/20 hover:bg-muted/30 px-1 rounded transition-colors">
            <div className="flex-1 min-w-0 pr-2">
              <span className="font-semibold text-foreground text-xs block leading-snug truncate" title={kri.name}>
                {kri.name}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">{kri.id}</span>
            </div>
            <span className="w-16 text-right font-mono font-bold text-xs text-foreground shrink-0">
              {kri.currentValue}
            </span>
            <span className="w-20 text-right font-mono text-xs text-muted-foreground shrink-0">
              {kri.criticalThreshold}
            </span>
            <div className="w-20 flex justify-end shrink-0">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 whitespace-nowrap shadow-2xs",
                  kri.status === "Red"
                    ? "bg-rose-500/10 text-rose-600 border border-rose-200"
                    : kri.status === "Amber"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-200"
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-200",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    kri.status === "Red"
                      ? "bg-rose-500"
                      : kri.status === "Amber"
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                />
                {kri.status}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="px-4 py-2 border-t border-border/40 bg-muted/10 flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground">Thresholds active in automated alerts</span>
        <Link
          to="/management/risk-management/enterprise-risk"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          View Register <ArrowRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}

/**
 * 7. Top Risks Table Panel Widget - FIXED & BEAUTIFIED
 */
export function TopRisksPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const risks = data?.topRisks ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between bg-card">
      <CardHeader className="p-4 pb-2.5 pr-24 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <span>Top Enterprise Risks</span>
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground border-border/60 font-normal py-0 px-1.5 h-4">
              Ranked Top 5
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Highest inherent and residual severity items.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2 text-xs flex-1">
        {risks.slice(0, 5).map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between p-2 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/30 transition-all gap-2"
          >
            <div className="flex-1 min-w-0 pr-2">
              <div className="font-bold text-xs text-foreground truncate" title={r.title}>
                {r.title}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                <span className="font-mono font-semibold text-primary bg-primary/10 px-1 rounded text-[10px]">
                  {r.id}
                </span>
                <span>•</span>
                <span className="truncate">{r.category}</span>
              </div>
            </div>

            {/* Score pill: Inherent -> Residual */}
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-muted-foreground uppercase font-medium">Inh</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[11px] font-bold font-mono min-w-6 text-center",
                    r.inherentScore >= 17
                      ? "bg-red-500 text-white"
                      : "bg-orange-500 text-white",
                  )}
                >
                  {r.inherentScore}
                </span>
              </div>
              <span className="text-muted-foreground font-bold text-[10px] mt-2.5">→</span>
              <div className="flex flex-col items-center">
                <span className="text-[9px] text-muted-foreground uppercase font-medium">Res</span>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[11px] font-bold font-mono min-w-6 text-center",
                    r.residualScore >= 12
                      ? "bg-orange-500/20 text-orange-600 border border-orange-300"
                      : r.residualScore >= 8
                        ? "bg-amber-500/20 text-amber-700 border border-amber-300"
                        : "bg-emerald-500/20 text-emerald-600 border border-emerald-300",
                  )}
                >
                  {r.residualScore}
                </span>
              </div>
            </div>

            {/* Trend & Status */}
            <div className="flex flex-col items-end shrink-0 pl-1">
              <span className="text-[10px] font-bold flex items-center gap-0.5">
                {r.trend === "Increasing" ? (
                  <span className="text-red-500 flex items-center">↑ Inc</span>
                ) : r.trend === "Decreasing" ? (
                  <span className="text-emerald-500 flex items-center">↓ Dec</span>
                ) : (
                  <span className="text-amber-500 flex items-center">→ Stb</span>
                )}
              </span>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-bold mt-0.5 uppercase",
                  r.status === "Monitoring"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-200"
                    : "bg-rose-500/10 text-rose-600 border border-rose-200",
                )}
              >
                {r.status}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="px-4 py-2 border-t border-border/40 bg-muted/10 flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground">Scored on 5x5 Likelihood × Impact Matrix</span>
        <Link
          to="/management/risk-management/enterprise-risk"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          View All Risks <ArrowRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}

/**
 * 8. Risk Treatment Actions Panel Widget - FIXED & BEAUTIFIED
 */
export function RiskTreatmentActionsPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const actions = data?.actions ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between bg-card">
      <CardHeader className="p-4 pb-2.5 pr-24 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            <span>Risk Treatment Actions</span>
            <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground border-border/60 font-normal py-0 px-1.5 h-4">
              {actions.length} Plans
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Open preventive and corrective action plans with SLA targets.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-2 text-xs flex-1">
        {actions.slice(0, 5).map((a) => (
          <div
            key={a.id}
            className="flex items-center justify-between p-2 rounded-lg border border-border/40 bg-muted/10 hover:bg-muted/30 transition-all gap-2"
          >
            <div className="flex-1 min-w-0 pr-2">
              <div className="font-semibold text-xs text-foreground truncate" title={a.action}>
                {a.action}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  {a.owner}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  {a.dueDate}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap inline-block shadow-2xs",
                  a.status === "In Progress"
                    ? "bg-blue-500/10 text-blue-600 border border-blue-200"
                    : a.status === "Open"
                      ? "bg-rose-500/10 text-rose-600 border border-rose-200"
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-200",
                )}
              >
                {a.status}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="px-4 py-2 border-t border-border/40 bg-muted/10 flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground">Mitigation SLAs tracked weekly</span>
        <Link
          to="/management/risk-management/enterprise-risk"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          View Action Plans <ArrowRight className="h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}

/**
 * 9. Quick Insights Panel Widget (AI Powered) - STATE OF THE ART
 */
export function QuickInsightsPanel() {
  const { data } = useQuery(riskOverviewOptions);
  const insights = data?.aiInsights ?? [];

  const getInsightIcon = (index: number) => {
    switch (index % 5) {
      case 0:
        return <TrendingUp className="h-3.5 w-3.5 text-blue-500" />;
      case 1:
        return <AlertOctagon className="h-3.5 w-3.5 text-red-500" />;
      case 2:
        return <Clock className="h-3.5 w-3.5 text-amber-500" />;
      case 3:
        return <ShieldAlert className="h-3.5 w-3.5 text-purple-500" />;
      default:
        return <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />;
    }
  };

  const getTagBadge = (index: number) => {
    switch (index % 4) {
      case 0:
        return <Badge variant="outline" className="text-[9px] bg-blue-500/10 text-blue-600 border-blue-200">Supply</Badge>;
      case 1:
        return <Badge variant="outline" className="text-[9px] bg-red-500/10 text-red-600 border-red-200">Critical</Badge>;
      case 2:
        return <Badge variant="outline" className="text-[9px] bg-amber-500/10 text-amber-600 border-amber-200">Advisory</Badge>;
      default:
        return <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-200">Normal</Badge>;
    }
  };

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between bg-gradient-to-b from-purple-500/[0.03] to-card border-purple-500/20">
      <CardHeader className="p-4 pb-2.5 pr-24 border-b border-border/40">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            <span>AI Risk Intelligence & Insights</span>
            <Badge className="bg-purple-600/15 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-800 text-[10px] gap-1 px-2 py-0 h-4 font-medium shadow-2xs">
              <Sparkles className="h-2.5 w-2.5" />
              Autonomous AI
            </Badge>
          </CardTitle>
          <CardDescription className="text-xs">
            Synthesized continuous anomaly detections and proactive exposure alerts.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 text-xs flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {insights.map((ins, i) => (
            <div
              key={ins.id}
              className="flex items-start gap-2.5 p-2.5 rounded-lg border border-border/40 bg-card hover:border-purple-300 dark:hover:border-purple-800 transition-all shadow-2xs"
            >
              <div className="h-6 w-6 rounded-md bg-muted/60 flex items-center justify-center shrink-0 mt-0.5">
                {getInsightIcon(i)}
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <div className="text-foreground leading-snug font-medium text-xs">
                  {ins.text}
                </div>
              </div>
              <div className="shrink-0">
                {getTagBadge(i)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="px-4 py-2 border-t border-border/40 bg-purple-500/[0.02] flex items-center justify-between text-xs">
        <span className="text-[11px] text-muted-foreground">Scanned across all enterprise telemetry registers</span>
        <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-1">
          Confidence: 96.8%
        </span>
      </CardFooter>
    </Card>
  );
}

// Widget Definitions Export
export const RISK_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "panel.risk.details",
    title: "Risk Details",
    description: "Controlled enterprise risk master record form fields and coordinators.",
    category: "risk",
    tags: ["risk", "operations"],
    icon: ShieldAlert,
    roles: "all",
    sourceRoute: "/management/risk-management/enterprise-risk",
    component: RiskDetailsPanel,
  },
  {
    id: "panel.risk.statement",
    title: "Risk Statement",
    description: "Because of [Cause], [Event] may occur, resulting in [Consequence].",
    category: "risk",
    tags: ["risk"],
    icon: Info,
    roles: "all",
    sourceRoute: "/management/risk-management/enterprise-risk",
    component: RiskStatementPanel,
  },
  {
    id: "panel.risk.heat-map",
    title: "Risk Heat Map",
    description: "5x5 Inherent and Residual probability vs impact matrix.",
    category: "risk",
    tags: ["risk", "matrix"],
    icon: Activity,
    roles: "all",
    sourceRoute: "/management/risk-management/overview",
    component: RiskHeatMapPanel,
  },
  {
    id: "panel.risk.category-distribution",
    title: "Risk Distribution by Category",
    description: "Donut chart breakdown of enterprise risks by category.",
    category: "chart",
    tags: ["chart", "risk", "distribution"],
    icon: Layers,
    roles: "all",
    sourceRoute: "/management/risk-management/overview",
    component: RiskCategoryDistributionPanel,
  },
  {
    id: "panel.risk.trend",
    title: "Risk Velocity & Exposure Trend",
    description: "Historical trend of total, critical, high, and low risks.",
    category: "chart",
    tags: ["chart", "risk", "trend"],
    icon: TrendingUp,
    roles: "all",
    sourceRoute: "/management/risk-management/overview",
    component: RiskTrendPanel,
  },
  {
    id: "panel.risk.kri-list",
    title: "Key Risk Indicators (KRI)",
    description: "Early warning metric thresholds and trigger monitoring list.",
    category: "table",
    tags: ["table", "risk", "kri"],
    icon: Activity,
    roles: "all",
    sourceRoute: "/management/risk-management/overview",
    component: KriListPanel,
  },
  {
    id: "panel.risk.top-risks",
    title: "Top Enterprise Risks",
    description: "Highest inherent and residual severity risk items.",
    category: "table",
    tags: ["table", "risk"],
    icon: AlertTriangle,
    roles: "all",
    sourceRoute: "/management/risk-management/enterprise-risk",
    component: TopRisksPanel,
  },
  {
    id: "panel.risk.treatment-actions",
    title: "Risk Treatment Actions",
    description: "Active mitigation plans and SLA targets.",
    category: "table",
    tags: ["table", "risk", "actions"],
    icon: Activity,
    roles: "all",
    sourceRoute: "/management/risk-management/enterprise-risk",
    component: RiskTreatmentActionsPanel,
  },
  {
    id: "panel.risk.quick-insights",
    title: "AI Risk Intelligence & Insights",
    description: "Synthesized AI anomaly detections and proactive exposure alerts.",
    category: "ai",
    tags: ["ai", "risk", "insights"],
    icon: Sparkles,
    roles: "all",
    sourceRoute: "/management/risk-management/overview",
    component: QuickInsightsPanel,
  },
];
