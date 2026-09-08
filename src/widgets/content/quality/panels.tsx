import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  Zap,
  Activity,
  Layers,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { WidgetDefinition } from "../../types";
import { qualityOverviewOptions } from "../../data/qualityQueries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

/**
 * 1. Closed-Loop Quality Lifecycle Pipeline Widget
 */
function QualityLifecyclePipelinePanel() {
  const { data } = useQuery(qualityOverviewOptions);
  const stages = data?.lifecycleStages ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Closed-Loop Quality Lifecycle Pipeline
          </CardTitle>
          <CardDescription className="text-xs">
            End-to-end quality governance from APQP launch gate through incoming, in-line, final inspection, CAPA, and calibration.
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs font-mono font-bold bg-primary/5 text-primary">
          9 Modules Connected
        </Badge>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          {stages.map((st) => (
            <Link
              key={st.step}
              to={st.path}
              className="group flex flex-col justify-between p-2.5 rounded-lg border border-border/70 bg-card hover:border-primary/50 hover:shadow-xs transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span className="font-mono text-[10px] font-bold text-muted-foreground group-hover:text-primary">
                  {st.step}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-muted text-foreground/80 truncate max-w-[85px]">
                  {st.badge}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-0.5">
                  <span className="truncate">{st.title}</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all shrink-0" />
                </div>
                <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {st.desc}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 2. 6-Month FPY & Defect PPM Trend Chart Widget
 */
function QualityTrendChartPanel() {
  const { data } = useQuery(qualityOverviewOptions);
  const trendData = data?.monthlyQualityTrend ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            6-Month FPY & Defect PPM Trend
          </CardTitle>
          <CardDescription className="text-xs">
            Factory First Pass Yield (%) vs 92.0% Target SLA & parts-per-million defect rate.
          </CardDescription>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-muted-foreground font-medium">
            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" /> Target FPY (92%)
          </span>
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Actual FPY
          </span>
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> Defect PPM
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-3">
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" domain={[88, 98]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit="%" />
              <YAxis yAxisId="right" orientation="right" domain={[0, 50]} tick={{ fontSize: 11 }} tickLine={false} axisLine={false} unit=" ppm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar yAxisId="right" dataKey="defectPpm" fill="#3b82f6" opacity={0.25} radius={[4, 4, 0, 0]} name="Defect PPM" />
              <Line yAxisId="left" type="monotone" dataKey="targetFpy" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={2} dot={false} name="Target FPY (%)" />
              <Line yAxisId="left" type="monotone" dataKey="actualFpy" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} name="Actual FPY (%)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 3. Plant Stage-Gate Yield Breakdown Widget
 */
function PlantStageYieldPanel() {
  const { data } = useQuery(qualityOverviewOptions);
  const stages = data?.stageBreakdown ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Stage-Gate Inspection Yield Breakdown
          </CardTitle>
          <CardDescription className="text-xs">
            Pass rates and inspection gates across critical plant manufacturing zones.
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200">
          All Gates Optimal
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3.5">
        {stages.map((st) => {
          const isAboveTarget = st.actualYield >= st.targetYield;
          return (
            <div key={st.stage} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{st.stage}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-muted-foreground text-[11px]">Target: {st.targetYield}%</span>
                  <span className={`font-bold ${isAboveTarget ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"}`}>
                    {st.actualYield}%
                  </span>
                </div>
              </div>
              <Progress value={st.actualYield} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

/**
 * 4. Live Open Quality Incidents & MRB Containment Register Widget
 */
function QualityIncidentsPanel() {
  const { data } = useQuery(qualityOverviewOptions);
  const incidents = data?.recentIncidents ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
            Open Non-Conformances & Containment
          </CardTitle>
          <CardDescription className="text-xs">
            Active shop floor NCRs, containment quarantines, and Material Review Board owners.
          </CardDescription>
        </div>
        <Link to="/management/quality-management/ncr-management">
          <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold gap-1 text-primary">
            View All NCRs <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="p-4 pt-2 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground font-semibold">
              <th className="pb-2 font-mono">NCR No.</th>
              <th className="pb-2">Defect Description</th>
              <th className="pb-2">Severity</th>
              <th className="pb-2">Stage</th>
              <th className="pb-2">Containment Action</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {incidents.map((inc) => (
              <tr key={inc.id} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 font-mono font-bold text-primary whitespace-nowrap">
                  <Link to="/management/quality-management/ncr-management" className="hover:underline">
                    {inc.id}
                  </Link>
                </td>
                <td className="py-2.5 font-medium text-foreground max-w-xs truncate">{inc.title}</td>
                <td className="py-2.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                      inc.severity === "Critical"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200"
                        : inc.severity === "Major"
                        ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200"
                        : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200"
                    }`}
                  >
                    {inc.severity}
                  </span>
                </td>
                <td className="py-2.5 text-muted-foreground whitespace-nowrap">{inc.stage}</td>
                <td className="py-2.5 text-muted-foreground max-w-xs truncate">{inc.containment}</td>
                <td className="py-2.5 whitespace-nowrap">
                  <Badge variant="outline" className="text-[10px] font-semibold">
                    {inc.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/**
 * 5. AI Autonomous Quality Intelligence Widget
 */
function QualityAiIntelligencePanel() {
  const { data } = useQuery(qualityOverviewOptions);
  const insights = data?.aiInsights ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs bg-gradient-to-br from-card via-card to-primary/5 flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
            <BrainCircuit className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-foreground">
              Autonomous Quality Intelligence Center
            </CardTitle>
            <CardDescription className="text-xs">
              AI predictive failure-mode diagnostics, process drift detection, and calibration scheduling.
            </CardDescription>
          </div>
        </div>
        <Badge variant="secondary" className="text-[11px] gap-1 font-semibold">
          <Sparkles className="h-3 w-3 text-amber-500" />
          Real-Time Machine Vision & MES Telemetry
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-border/70 bg-card/60 backdrop-blur-xs flex flex-col justify-between space-y-2"
            >
              <div className="flex items-start gap-2">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  {idx + 1}
                </span>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight}
                </p>
              </div>
              <div className="flex justify-end pt-1">
                <Button variant="ghost" size="sm" className="h-6 text-[11px] font-semibold gap-1 text-primary p-0 hover:bg-transparent">
                  Execute Mitigation <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export const QUALITY_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "pipeline.quality.lifecycle",
    title: "Quality Lifecycle Pipeline",
    description: "Interactive 9-stage closed-loop quality lifecycle from APQP to Calibration.",
    category: "pipeline",
    tags: ["quality", "pipeline", "kpi"],
    icon: Zap,
    component: QualityLifecyclePipelinePanel,
    roles: "all",
    defaultSize: "full",
    sourceRoute: "/management/quality-management/overview",
  },
  {
    id: "chart.quality.fpy-trend",
    title: "6-Month FPY & Defect PPM Trend",
    description: "Composed bar and line chart of First Pass Yield vs 92% Target and Defect PPM.",
    category: "chart",
    tags: ["quality", "chart"],
    icon: Activity,
    component: QualityTrendChartPanel,
    roles: "all",
    defaultSize: "lg",
    sourceRoute: "/management/quality-management/quality-analytics",
  },
  {
    id: "chart.quality.stage-yield",
    title: "Stage-Gate Yield Breakdown",
    description: "Inspection pass rates across factory gates: IQC, SMT, Battery, FQC, Pre-Dispatch.",
    category: "chart",
    tags: ["quality", "chart"],
    icon: Layers,
    component: PlantStageYieldPanel,
    roles: "all",
    defaultSize: "lg",
    sourceRoute: "/management/quality-management/in-process-inspection",
  },
  {
    id: "table.quality.incidents",
    title: "Open NCRs & Containment Register",
    description: "Live non-conformance incidents table with severity, containment action, and MRB status.",
    category: "table",
    tags: ["quality", "table"],
    icon: AlertTriangle,
    component: QualityIncidentsPanel,
    roles: "all",
    defaultSize: "full",
    sourceRoute: "/management/quality-management/ncr-management",
  },
  {
    id: "ai.quality.intelligence",
    title: "AI Quality Intelligence Center",
    description: "Autonomous machine learning predictions, process drift alerts, and root cause insights.",
    category: "insight",
    tags: ["quality", "insight"],
    icon: BrainCircuit,
    component: QualityAiIntelligencePanel,
    roles: "all",
    defaultSize: "full",
    sourceRoute: "/management/quality-management/root-cause-analysis",
  },
];
