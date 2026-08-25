/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Cloud,
  Code,
  Cpu,
  ExternalLink,
  Layers,
  Package,
  Palette,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { chartColor } from "@/lib/chartColors";
import type { WidgetContentProps, WidgetDefinition } from "../../types";

const mockFunnel = [
  { label: "Product Strategy", count: 24, icon: Target },
  { label: "Requirements (PRD)", count: 18, icon: Package },
  { label: "Architecture", count: 15, icon: Cpu },
  { label: "Industrial & Mech", count: 14, icon: Palette },
  { label: "Electronics & Embedded", count: 12, icon: Cpu },
  { label: "Software & Mobile", count: 10, icon: Code },
  { label: "Cloud & APIs", count: 8, icon: Cloud },
  { label: "Testing & Validation", count: 6, icon: Activity },
  { label: "Release & Lifecycle", count: 4, icon: Rocket },
];

const mockTrend = [
  { label: "Mar", count: 12, key: "mar" },
  { label: "Apr", count: 15, key: "apr" },
  { label: "May", count: 18, key: "may" },
  { label: "Jun", count: 22, key: "jun" },
  { label: "Jul", count: 26, key: "jul" },
  { label: "Aug", count: 31, key: "aug" },
];

const mockTopProjects = [
  { id: "PRJ-2026-081", name: "MagFlow NextGen Inverter Platform", stage: "Detailed Design", owner: "Dr. Aris Vance", progress: 78, status: "On Track" },
  { id: "PRJ-2026-074", name: "Smart Grid Gateway MCU-v4", stage: "Firmware Integration", owner: "Elena Rostova", progress: 92, status: "Release Gate" },
  { id: "PRJ-2026-069", name: "High-Voltage Power Module E3", stage: "Thermal Simulation", owner: "Marcus Sterling", progress: 64, status: "In Review" },
  { id: "PRJ-2026-058", name: "Enterprise IoT Telemetry Hub", stage: "Cloud API Validation", owner: "Sarah Jenkins", progress: 85, status: "On Track" },
  { id: "PRJ-2026-042", name: "Mobile Diagnostics Suite v2.1", stage: "Beta Testing", owner: "Devon Chen", progress: 90, status: "On Track" },
];

/* ===========================================================================
   1. Design -> Build -> Release Funnel
   =========================================================================== */
export const PdFunnelWidget = memo(function PdFunnelWidget() {
  const maxFunnel = Math.max(1, ...mockFunnel.map((f) => f.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Design → Build → Release Pipeline</h3>
              <p className="text-xs text-muted-foreground">111 active engineering baselines across lifecycle gates</p>
            </div>
          </div>
          <Link to="/development/product-development/prd" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <span>PRD Matrix</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {mockFunnel.map((f, i) => (
            <div key={f.label} className="flex items-center gap-3 text-xs">
              <div className="flex w-44 shrink-0 items-center gap-2 font-semibold text-foreground truncate">
                <f.icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="truncate">{f.label}</span>
              </div>
              <div className="h-5 flex-1 overflow-hidden rounded-md bg-muted/40">
                <div
                  className="flex h-full items-center justify-end rounded-md px-2 text-[10px] font-bold text-white transition-all"
                  style={{
                    width: `${Math.max(8, (f.count / maxFunnel) * 100)}%`,
                    backgroundColor: chartColor(i),
                  }}
                >
                  {f.count}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>Active Baselines: <strong>111 total</strong></span>
        <span>Average velocity: <strong>14 days / stage</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. Delivered Milestones Trend
   =========================================================================== */
export const PdMilestonesTrendWidget = memo(function PdMilestonesTrendWidget() {
  const maxTrend = Math.max(1, ...mockTrend.map((t) => t.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Engineering Milestones Delivered</h3>
              <p className="text-xs text-muted-foreground">Stage gates & verification approvals (6 Mo)</p>
            </div>
          </div>
          <Link to="/development/product-development/product-roadmap" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <span>Roadmap</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex h-[200px] items-end justify-between gap-2 pt-2">
          {mockTrend.map((t, i) => (
            <div key={t.key} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold tabular text-foreground">{t.count}</span>
              <div
                className={cn("w-full rounded-t-md transition-all")}
                style={{
                  height: `${Math.max(6, (t.count / maxTrend) * 160)}px`,
                  backgroundColor: chartColor(i),
                }}
              />
              <span className="text-[10px] text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>Current Month: <strong>31 completed</strong></span>
        <span>Target Achievement: <strong>108%</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Top Active Product Engineering Projects
   =========================================================================== */
export const PdTopProjectsWidget = memo(function PdTopProjectsWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Top Active Product Engineering Projects</h3>
              <p className="text-xs text-muted-foreground">Live telemetry across hardware, software, and firmware sprints</p>
            </div>
          </div>
          <Link to="/development/product-development/product-release-management" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <span>Release Matrix</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                <th className="pb-2">Project ID</th>
                <th className="pb-2">Project Name</th>
                <th className="pb-2">Current Stage</th>
                <th className="pb-2">Engineering Lead</th>
                <th className="pb-2">Progress</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {mockTopProjects.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-bold text-primary">{p.id}</td>
                  <td className="py-2.5 text-foreground">{p.name}</td>
                  <td className="py-2.5 text-muted-foreground">{p.stage}</td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300">{p.owner}</td>
                  <td className="py-2.5">
                    <div className="flex items-center gap-2 w-28">
                      <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold tabular">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 text-right">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold",
                        p.status === "On Track"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : p.status === "Release Gate"
                          ? "bg-primary/10 text-primary"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>5 priority flagship programs</span>
        <Link to="/development/product-development/product-lifecycle-management" className="text-primary font-semibold hover:underline">
          View Digital Thread & PLM →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Product Engineering AI Intelligence
   =========================================================================== */
export const PdAiIntelligenceWidget = memo(function PdAiIntelligenceWidget() {
  return (
    <div className="card-soft border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Product Engineering & Digital Thread AI Intelligence</h3>
            <p className="text-xs text-muted-foreground">Automated requirement coverage, gate compliance, and thermal/electrical simulation telemetry</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          99.1% Digital Thread Continuity
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>PRD → CAD → Code Traceability</span>
          </div>
          <p className="text-muted-foreground">
            All 18 active PRD requirement baselines have 100% downstream verification test coverage mapped in TanStack.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-1">
            <Cpu className="h-3.5 w-3.5" />
            <span>Hardware/Firmware Co-Simulation</span>
          </div>
          <p className="text-muted-foreground">
            MagFlow NextGen inverter platform passed 10,000 automated HIL test cycles with zero critical thermal excursions.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold mb-1">
            <Rocket className="h-3.5 w-3.5" />
            <span>Release Gate Readiness</span>
          </div>
          <p className="text-muted-foreground">
            Smart Grid Gateway MCU-v4 is ready for Phase 4 Release Gate approval with CE and UL compliance pre-verified.
          </p>
        </div>
      </div>
    </div>
  );
});

export const PD_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.pd.funnel",
    title: "Design → Build → Release Pipeline",
    description: "Multi-stage product engineering lifecycle gates from PRD to production release.",
    category: "chart",
    tags: ["chart", "pd"],
    icon: Layers,
    keywords: ["design", "build", "release", "funnel", "pipeline", "prd"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/development/product-development/prd",
    component: PdFunnelWidget,
  },
  {
    id: "chart.pd.trend",
    title: "Engineering Milestones Delivered",
    description: "Monthly count of validated milestones and stage gate approvals.",
    category: "chart",
    tags: ["chart", "pd"],
    icon: TrendingUp,
    keywords: ["milestones", "trend", "deliveries", "approvals"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/development/product-development/product-roadmap",
    component: PdMilestonesTrendWidget,
  },
  {
    id: "table.pd.top-projects",
    title: "Top Active Product Projects",
    description: "Live telemetry and sprint velocity on key product development programs.",
    category: "table",
    tags: ["table", "pd"],
    icon: Package,
    keywords: ["projects", "telemetry", "progress", "active"],
    defaultSize: "full",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/product-development/product-release-management",
    component: PdTopProjectsWidget,
  },
  {
    id: "ai.pd.engineering-intelligence",
    title: "Product Engineering AI Intelligence",
    description: "Traceability analytics and automated release readiness forecasting.",
    category: "ai",
    tags: ["ai", "pd"],
    icon: Sparkles,
    keywords: ["ai", "engineering", "traceability", "intelligence", "plm"],
    defaultSize: "full",
    allowedSizes: ["full"],
    roles: "all",
    sourceRoute: "/development/product-development/overview",
    component: PdAiIntelligenceWidget,
  },
];
