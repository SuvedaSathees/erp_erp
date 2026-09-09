import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import type { WidgetDefinition } from "../../types";
import { pmOverviewOptions } from "../../data/pmQueries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

/**
 * 1. Execution Status Panel Widget
 */
function ExecutionStatusPanel() {
  const { data } = useQuery(pmOverviewOptions);
  const phases = data?.executionStatus ?? [
    { phase: "Requirements", percent: 100 },
    { phase: "Design", percent: 82 },
    { phase: "Procurement", percent: 68 },
    { phase: "Production", percent: 54 },
    { phase: "Installation", percent: 32 },
    { phase: "Commissioning", percent: 18 },
  ];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Project Execution Status
          </CardTitle>
          <CardDescription className="text-xs">
            Overall execution progress across key engineering and manufacturing phases.
          </CardDescription>
        </div>
        <Badge variant="outline" className="text-xs font-mono font-bold bg-primary/5 text-primary">
          Overall: {data?.overallReadinessPct ?? 80.0}%
        </Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {phases.map((p) => (
          <div key={p.phase} className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{p.phase}</span>
              <span className="font-bold text-primary font-mono">{p.percent}%</span>
            </div>
            <Progress value={p.percent} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 2. Resource Utilization Panel Widget
 */
function ResourceUtilizationPanel() {
  const { data } = useQuery(pmOverviewOptions);
  const list = data?.departmentUtilization ?? [
    { department: "Engineering", utilization: 85 },
    { department: "Production", utilization: 82 },
    { department: "Procurement", utilization: 61 },
    { department: "Quality", utilization: 72 },
    { department: "Installation", utilization: 94 },
    { department: "Project Mgmt", utilization: 65 },
  ];

  return (
    <Card className="h-full border-border/80 shadow-2xs flex flex-col justify-between overflow-hidden">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            Resource Utilization
          </CardTitle>
          <CardDescription className="text-xs">Department capacity & allocation loading.</CardDescription>
        </div>
        <span className="text-[11px] text-muted-foreground font-mono">View: By Department</span>
      </CardHeader>
      <CardContent className="p-4 overflow-hidden">
        <div className="flex items-end justify-between gap-2 sm:gap-3 h-44 pt-4 px-1 sm:px-2">
          {list.map((item) => {
            const isOverloaded = item.utilization > 90;
            return (
              <div key={item.department} className="flex-1 min-w-0 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-bold font-mono text-slate-700 dark:text-slate-300">
                  {item.utilization}%
                </span>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md h-full flex items-end overflow-hidden">
                  <div
                    style={{ height: `${item.utilization}%` }}
                    className={cn(
                      "w-full transition-all rounded-t-md",
                      isOverloaded ? "bg-amber-500" : "bg-primary hover:bg-primary/90",
                    )}
                  />
                </div>
                <span
                  className="text-[10px] text-muted-foreground font-medium text-center truncate w-full"
                  title={item.department}
                >
                  {item.department}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 3. Top Risks Table Panel
 */
function TopRisksPanel() {
  const { data } = useQuery(pmOverviewOptions);
  const risks = data?.risks ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-rose-500" />
            Top Risks Register
          </CardTitle>
          <CardDescription className="text-xs">Identified project threats and mitigation strategies.</CardDescription>
        </div>
        <a href="/management/project-management/risk-management" className="text-xs text-primary font-semibold hover:underline">
          View All Risks →
        </a>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full">
          <table className="w-full table-fixed text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-[11px] text-muted-foreground">
                <th className="p-2.5 pl-4 font-semibold">Risk</th>
                <th className="p-2.5 font-semibold">Probability</th>
                <th className="p-2.5 font-semibold">Impact</th>
                <th className="p-2.5 font-semibold">Score</th>
                <th className="p-2.5 pr-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {risks.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-2.5 pl-4 font-bold text-slate-900 dark:text-white">{r.risk}</td>
                  <td className="p-2.5 text-rose-600 dark:text-rose-400 font-semibold">{r.probability}</td>
                  <td className="p-2.5 text-rose-600 dark:text-rose-400 font-semibold">{r.impact}</td>
                  <td className="p-2.5 font-mono font-bold">{r.score}</td>
                  <td className="p-2.5 pr-4">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold inline-block",
                        r.status === "Mitigate" && "bg-rose-500/15 text-rose-700 dark:text-rose-300",
                        r.status === "Control" && "bg-amber-500/15 text-amber-700 dark:text-amber-300",
                        r.status === "Transfer" && "bg-blue-500/15 text-blue-700 dark:text-blue-300",
                        r.status === "Prevent" && "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
                      )}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 4. AI Planning Insights Panel Widget
 */
function AiPlanningInsightsPanel() {
  const { data } = useQuery(pmOverviewOptions);
  const insights = data?.aiInsights ?? [];

  return (
    <Card className="h-full border-primary/30 bg-primary/5 dark:bg-primary/10 shadow-2xs">
      <CardHeader className="p-4 pb-2 border-b border-primary/20 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-bold text-foreground">AI Insights & Recommendations</CardTitle>
            <CardDescription className="text-xs">
              Automated critical path analysis, lead-time bottlenecks, and resource leveling.
            </CardDescription>
          </div>
        </div>
        <Badge className="bg-primary text-white text-[10px] font-mono">Live Predictive Engine</Badge>
      </CardHeader>
      <CardContent className="p-4 space-y-2.5 text-xs">
        {insights.map((txt, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-card/90 border border-border/70 flex items-start gap-2.5 shadow-2xs"
          >
            {idx === 0 ? (
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            ) : idx === 3 ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Clock className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{txt}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/**
 * 5. Milestones Tracker Panel Widget
 */
function MilestonesPanel() {
  const { data } = useQuery(pmOverviewOptions);
  const milestones = data?.milestones ?? [];

  return (
    <Card className="h-full border-border/80 shadow-2xs">
      <CardHeader className="p-4 pb-2 border-b border-border/40 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Key Milestones Timeline
          </CardTitle>
          <CardDescription className="text-xs">Contractual delivery gates and approval freeze points.</CardDescription>
        </div>
        <a href="/management/project-management/milestones" className="text-xs text-primary font-semibold hover:underline">
          View All Milestones →
        </a>
      </CardHeader>
      <CardContent className="p-3 space-y-2 text-xs">
        {milestones.map((m) => (
          <div
            key={m.name}
            className="p-2 rounded-lg border border-border/50 bg-slate-50/50 dark:bg-slate-800/20 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              {m.status === "Completed" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : m.status === "In Progress" ? (
                <Clock className="h-4 w-4 text-amber-500 animate-pulse" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-slate-400 mx-1" />
              )}
              <span className="font-semibold text-slate-900 dark:text-white">{m.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">{m.plannedDate}</span>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-medium",
                  m.status === "Completed" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
                  m.status === "In Progress" && "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300",
                  m.status === "Planned" && "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-300",
                )}
              >
                {m.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export const PM_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.pm.execution-status",
    title: "Execution Status",
    description: "Multi-phase progress tracking across requirements, design, procurement, and manufacturing.",
    category: "chart",
    tags: ["chart", "pm", "operations"],
    icon: Activity,
    keywords: ["project", "execution", "status", "phase", "progress"],
    roles: "all",
    sourceRoute: "/management/project-management/project-execution",
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: ExecutionStatusPanel,
  },
  {
    id: "chart.pm.resource-utilization",
    title: "Resource Utilization",
    description: "Departmental workload distribution and capacity analysis.",
    category: "chart",
    tags: ["chart", "pm", "operations"],
    icon: TrendingUp,
    keywords: ["resources", "allocation", "workload", "utilization"],
    roles: "all",
    sourceRoute: "/management/project-management/resources",
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: ResourceUtilizationPanel,
  },
  {
    id: "table.pm.top-risks",
    title: "Top Risks Register",
    description: "High and medium priority project risks with response strategies.",
    category: "table",
    tags: ["table", "pm", "compliance"],
    icon: ShieldAlert,
    keywords: ["risks", "mitigation", "score", "impact"],
    roles: "all",
    sourceRoute: "/management/project-management/risks",
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: TopRisksPanel,
  },
  {
    id: "ai.pm.planning-insights",
    title: "AI Planning Insights",
    description: "AI engine recommendations for schedule optimization and critical path bottlenecks.",
    category: "ai",
    tags: ["ai", "insight", "pm"],
    icon: Sparkles,
    keywords: ["ai", "recommendations", "critical path", "float", "bottlenecks"],
    roles: "all",
    sourceRoute: "/management/project-management/overview",
    defaultSize: "full",
    allowedSizes: ["xl", "full"],
    component: AiPlanningInsightsPanel,
  },
  {
    id: "table.pm.milestones",
    title: "Milestones Timeline",
    description: "Major contractual milestones and target dates.",
    category: "table",
    tags: ["table", "pm"],
    icon: Layers,
    keywords: ["milestones", "schedule", "deadlines"],
    roles: "all",
    sourceRoute: "/management/project-management/milestones",
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: MilestonesPanel,
  },
];
