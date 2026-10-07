// Strategy Management Analytical & Command Panels
import { memo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Target,
  Layers,
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  ShieldCheck,
  ChevronRight,
  BarChart3,
  Bot,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { WidgetContentProps, WidgetDefinition } from "@/widgets/types";

// 1. Strategy Alignment Flow Panel (Full Width)
export const StrategyAlignmentFlowWidget = memo(function StrategyAlignmentFlowWidget(_props: WidgetContentProps) {
  const steps = [
    {
      title: "Purpose & Vision",
      subtitle: "Global Autonomous EV Leader",
      color: "from-blue-500/10 to-blue-500/5 border-blue-500/30 text-blue-600 dark:text-blue-400",
      icon: Compass,
      route: "/management/strategy-management/vision-mission",
    },
    {
      title: "Strategic Themes",
      subtitle: "8 Themes (Growth, Innovation, ESG)",
      color: "from-indigo-500/10 to-indigo-500/5 border-indigo-500/30 text-indigo-600 dark:text-indigo-400",
      icon: Layers,
      route: "/management/strategy-management/vision-mission",
    },
    {
      title: "Strategic Objectives",
      subtitle: "12 Enterprise Objectives",
      color: "from-amber-500/10 to-amber-500/5 border-amber-500/30 text-amber-600 dark:text-amber-400",
      icon: Target,
      route: "/management/strategy-management/balanced-scorecard",
    },
    {
      title: "OKRs & Key Results",
      subtitle: "28 Active OKRs · 86 Key Results",
      color: "from-emerald-500/10 to-emerald-500/5 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
      icon: CheckCircle2,
      route: "/management/strategy-management/okr-management",
    },
    {
      title: "Strategic Initiatives",
      subtitle: "26 Initiatives · 48 Projects",
      color: "from-rose-500/10 to-rose-500/5 border-rose-500/30 text-rose-600 dark:text-rose-400",
      icon: Zap,
      route: "/management/strategy-management/strategic-initiatives",
    },
    {
      title: "Enterprise Outcomes",
      subtitle: "₹72.3 Cr Benefits Realization",
      color: "from-purple-500/10 to-purple-500/5 border-purple-500/30 text-purple-600 dark:text-purple-400",
      icon: Award,
      route: "/management/strategy-management/reports",
    },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">Strategic Execution Alignment Chain</h3>
            <p className="text-xs text-muted-foreground">
              End-to-end lineage from Corporate Purpose & Vision through OKRs to Execution & Outcomes
            </p>
          </div>
        </div>
        <Link
          to="/management/strategy-management/reports"
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          View Full Chain <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <Link
              key={idx}
              to={step.route}
              className={`p-3.5 rounded-xl border bg-gradient-to-b ${step.color} hover:scale-[1.02] transition-transform duration-200 flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                  Step 0{idx + 1}
                </span>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-sm text-foreground leading-tight">{step.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{step.subtitle}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
});

// 2. OKR & KPI Progress Trajectory (Trend Chart)
export const OKRProgressTrajectoryWidget = memo(function OKRProgressTrajectoryWidget(_props: WidgetContentProps) {
  const data = [
    { month: "Jan", planned: 20, actual: 18, target: 25 },
    { month: "Feb", planned: 35, actual: 32, target: 40 },
    { month: "Mar", planned: 48, actual: 45, target: 50 },
    { month: "Apr", planned: 60, actual: 58, target: 62 },
    { month: "May", planned: 72, actual: 69, target: 75 },
    { month: "Jun", planned: 80, actual: 78, target: 82 },
    { month: "Jul", planned: 88, actual: 82, target: 90 },
    { month: "Aug", planned: 94, actual: 86, target: 95 },
    { month: "Sep", planned: 100, actual: 91, target: 100 },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Strategic Progress & OKR Trajectory</h3>
          <p className="text-xs text-muted-foreground">Cumulative execution progression vs baseline target</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Actual (91%)
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
            <span className="h-2 w-2 rounded-full bg-blue-500" /> Planned (100%)
          </span>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="stratActualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="stratPlannedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="month" fontSize={11} />
            <YAxis fontSize={11} unit="%" domain={[0, 105]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area type="monotone" dataKey="planned" stroke="#3b82f6" strokeWidth={2} fill="url(#stratPlannedGrad)" name="Planned" />
            <Area type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2.5} fill="url(#stratActualGrad)" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// 3. Balanced Scorecard Perspectives Performance
export const PerspectivesPerformanceWidget = memo(function PerspectivesPerformanceWidget(_props: WidgetContentProps) {
  const perspectives = [
    { name: "Financial", score: 82, weight: 25, color: "bg-emerald-500" },
    { name: "Customer", score: 76, weight: 20, color: "bg-blue-500" },
    { name: "Internal Process", score: 68, weight: 20, color: "bg-amber-500" },
    { name: "Learning & Growth", score: 62, weight: 15, color: "bg-purple-500" },
    { name: "Innovation & Tech", score: 58, weight: 10, color: "bg-rose-500" },
    { name: "Risk & Compliance", score: 72, weight: 5, color: "bg-cyan-500" },
    { name: "Sustainability & ESG", score: 65, weight: 5, color: "bg-teal-500" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Scorecard Perspectives</h3>
          <p className="text-xs text-muted-foreground">Target achievement across 7 strategic pillars</p>
        </div>
        <Link
          to="/management/strategy-management/balanced-scorecard"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View Scorecard
        </Link>
      </div>

      <div className="space-y-3">
        {perspectives.map((p, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">{p.name}</span>
              <span className="text-muted-foreground font-semibold">
                {p.score}% <span className="font-normal text-[11px]">(Weight: {p.weight}%)</span>
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${p.color} rounded-full transition-all duration-500`}
                style={{ width: `${p.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// 4. Initiatives Portfolio Distribution Donut
export const InitiativesPortfolioWidget = memo(function InitiativesPortfolioWidget(_props: WidgetContentProps) {
  const data = [
    { name: "In Progress", value: 16, color: "#3b82f6" },
    { name: "Completed", value: 4, color: "#10b981" },
    { name: "At Risk", value: 4, color: "#f59e0b" },
    { name: "On Hold", value: 2, color: "#ef4444" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Initiative Portfolio Health</h3>
          <p className="text-xs text-muted-foreground">26 active enterprise initiatives by status</p>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          72% Health
        </span>
      </div>

      <div className="h-[220px] w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

// 5. Strategic Theme Progress Panel
export const StrategicThemesProgressWidget = memo(function StrategicThemesProgressWidget(_props: WidgetContentProps) {
  const themes = [
    { name: "Growth & Market Expansion", count: 7, progress: 82, color: "#3b82f6" },
    { name: "Innovation & Technology Leadership", count: 5, progress: 76, color: "#8b5cf6" },
    { name: "Operational Excellence", count: 4, progress: 62, color: "#10b981" },
    { name: "Customer Excellence", count: 3, progress: 68, color: "#06b6d4" },
    { name: "Sustainability & ESG Impact", count: 3, progress: 58, color: "#14b8a6" },
    { name: "Risk & Compliance Governance", count: 2, progress: 72, color: "#f59e0b" },
    { name: "People & Organizational Capability", count: 2, progress: 70, color: "#ec4899" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Strategic Theme Distribution</h3>
          <p className="text-xs text-muted-foreground">Allocation of programs across 7 corporate themes</p>
        </div>
        <span className="text-xs text-muted-foreground font-semibold">26 Initiatives Total</span>
      </div>

      <div className="space-y-3">
        {themes.map((t, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: t.color }} />
                {t.name}
              </span>
              <span className="text-muted-foreground font-semibold">
                {t.count} Initiatives · {t.progress}%
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${t.progress}%`, backgroundColor: t.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// 6. AI Strategic Command Assistant Widget
export const AIStrategyAssistantWidget = memo(function AIStrategyAssistantWidget(_props: WidgetContentProps) {
  const insights = [
    {
      type: "opportunity",
      text: "EV charging demand projected at 3.5x by 2030; Tier-2 highway expansion yields 28% higher ROI.",
      badge: "Opportunity",
      color: "text-emerald-600 bg-emerald-500/10",
    },
    {
      type: "alert",
      text: "Manufacturing scale-up OKR is at risk due to Tier-1 supplier tooling delivery lead time.",
      badge: "At Risk",
      color: "text-rose-600 bg-rose-500/10",
    },
    {
      type: "recommendation",
      text: "Reallocate ₹4.2 Cr surplus from Cost Optimization into Autonomous W-EVSE R&D to preserve Q4 milestones.",
      badge: "Action",
      color: "text-blue-600 bg-blue-500/10",
    },
  ];

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] via-card to-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
              AI Strategic Intelligence Assistant
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">Live</span>
            </h3>
            <p className="text-xs text-muted-foreground">Neural strategy synthesis & cross-functional recommendations</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        {insights.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-lg border bg-card/80 text-xs flex items-start gap-3 hover:border-primary/40 transition-colors"
          >
            <span className={`px-2 py-0.5 rounded font-bold shrink-0 text-[10px] ${item.color}`}>
              {item.badge}
            </span>
            <span className="text-foreground leading-relaxed font-normal">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
});

// 7. Executive Initiatives Register Table Widget
export const ExecutiveInitiativesTableWidget = memo(function ExecutiveInitiativesTableWidget(_props: WidgetContentProps) {
  const initiatives = [
    { code: "SI-2026-001", name: "Expand EV Charging Network", theme: "Growth", owner: "S. Ravi", progress: 75, status: "In Progress" },
    { code: "SI-2026-002", name: "Autonomous W-EVSE R&D", theme: "Innovation", owner: "R. Kumar", progress: 60, status: "In Progress" },
    { code: "SI-2026-003", name: "Manufacturing Scale-up", theme: "Operations", owner: "M. Prakash", progress: 45, status: "At Risk" },
    { code: "SI-2026-004", name: "Strategic Partnership (OEM)", theme: "Partnership", owner: "K. Meena", progress: 30, status: "On Hold" },
    { code: "SI-2026-005", name: "Digital Platform & IoT Cloud", theme: "Technology", owner: "A. Khan", progress: 80, status: "In Progress" },
  ];

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-foreground">Priority Strategic Initiatives</h3>
          <p className="text-xs text-muted-foreground">High-impact programs driving corporate goals</p>
        </div>
        <Link
          to="/management/strategy-management/strategic-initiatives"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View All 26 Initiatives
        </Link>
      </div>

      <div className="overflow-x-auto no-scrollbar" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <table className="w-full text-xs text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-semibold border-b">
            <tr>
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">Initiative Name</th>
              <th className="py-2.5 px-3">Strategic Theme</th>
              <th className="py-2.5 px-3">Owner</th>
              <th className="py-2.5 px-3">Progress</th>
              <th className="py-2.5 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {initiatives.map((item, idx) => (
              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-mono font-medium text-muted-foreground">{item.code}</td>
                <td className="py-2.5 px-3 font-semibold text-foreground">{item.name}</td>
                <td className="py-2.5 px-3 text-muted-foreground">{item.theme}</td>
                <td className="py-2.5 px-3 text-foreground">{item.owner}</td>
                <td className="py-2.5 px-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.progress >= 70 ? "bg-emerald-500" : item.progress >= 40 ? "bg-blue-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="font-medium text-muted-foreground">{item.progress}%</span>
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.status === "In Progress"
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : item.status === "At Risk"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {item.status}
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

export const STRATEGY_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "strategy.panel.alignment-flow",
    title: "Strategic Alignment Flow",
    description: "Visual lifecycle chain from purpose to enterprise outcomes.",
    category: "chart",
    defaultSize: "full",
    allowedSizes: ["full"],
    component: StrategyAlignmentFlowWidget,
  },
  {
    id: "strategy.panel.progress-trajectory",
    title: "OKR & Strategic Progress Trajectory",
    description: "Multi-month planned vs actual progress tracking curve.",
    category: "chart",
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    component: OKRProgressTrajectoryWidget,
  },
  {
    id: "strategy.panel.perspectives-performance",
    title: "Balanced Scorecard Perspectives",
    description: "Target achievement across 7 strategic pillars.",
    category: "chart",
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    component: PerspectivesPerformanceWidget,
  },
  {
    id: "strategy.panel.portfolio-health",
    title: "Initiative Portfolio Distribution",
    description: "Health breakdown of active strategic initiatives.",
    category: "chart",
    defaultSize: "md",
    allowedSizes: ["md", "lg"],
    component: InitiativesPortfolioWidget,
  },
  {
    id: "strategy.panel.themes-progress",
    title: "Strategic Themes Breakdown",
    description: "Distribution of initiatives across corporate themes.",
    category: "chart",
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    component: StrategicThemesProgressWidget,
  },
  {
    id: "strategy.panel.ai-assistant",
    title: "AI Strategy Intelligence Assistant",
    description: "Neural insights and proactive strategic recommendations.",
    category: "ai",
    defaultSize: "full",
    allowedSizes: ["lg", "xl", "full"],
    component: AIStrategyAssistantWidget,
  },
  {
    id: "strategy.panel.initiatives-table",
    title: "Priority Strategic Initiatives Register",
    description: "Table of high-impact strategic programs.",
    category: "table",
    defaultSize: "xl",
    allowedSizes: ["xl", "full"],
    component: ExecutiveInitiativesTableWidget,
  },
];
