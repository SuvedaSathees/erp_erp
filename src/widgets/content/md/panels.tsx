/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  BarChart3,
  CheckSquare,
  Cpu,
  ExternalLink,
  FileCheck,
  Gauge,
  Repeat,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
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

const mockMfgFunnel = [
  { label: "APQP Quality Gate", count: 22, icon: ShieldCheck },
  { label: "Process Design", count: 18, icon: Settings },
  { label: "Control Plan", count: 16, icon: FileCheck },
  { label: "PFMEA & Risk Control", count: 14, icon: CheckSquare },
  { label: "Pilot Production Runs", count: 10, icon: Repeat },
  { label: "PPAP Approval", count: 8, icon: ShieldCheck },
  { label: "Mass Production", count: 6, icon: Rocket },
];

const mockYieldTrend = [
  { label: "Mar", count: 88, key: "mar" },
  { label: "Apr", count: 90, key: "apr" },
  { label: "May", count: 91, key: "may" },
  { label: "Jun", count: 93, key: "jun" },
  { label: "Jul", count: 94, key: "jul" },
  { label: "Aug", count: 96, key: "aug" },
];

const mockMfgProjects = [
  { id: "MFG-2026-104", name: "Inverter Automated Stator Assembly Line", stage: "Pilot Run", lead: "Karthik Subramanian", yield: "98.4%", status: "In Pilot" },
  { id: "MFG-2026-092", name: "High-Speed SMT Pick & Place Robotics", stage: "PPAP Level 3", lead: "Anita Sharma", yield: "99.1%", status: "Ready PPAP" },
  { id: "MFG-2026-088", name: "Lean Value Stream Line 4 Standardization", stage: "Kaizen Validation", lead: "David Miller", yield: "97.8%", status: "On Track" },
  { id: "MFG-2026-071", name: "Cobot Welding Cell - Chassis Subassembly", stage: "Safety Interlock Audit", lead: "Hiroshi Tanaka", yield: "98.9%", status: "In Review" },
  { id: "MFG-2026-063", name: "Smart Factory IIoT Sensor Network Phase 2", stage: "Full Integration", lead: "Vikram Mehta", yield: "99.5%", status: "Mass Production" },
];

/* ===========================================================================
   1. APQP -> Pilot -> PPAP -> Mass Production Pipeline
   =========================================================================== */
export const MdFunnelWidget = memo(function MdFunnelWidget() {
  const maxFunnel = Math.max(1, ...mockMfgFunnel.map((f) => f.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">APQP → Pilot → PPAP → Mass Production Pipeline</h3>
              <p className="text-xs text-muted-foreground">94 active industrialization and quality gates across plants</p>
            </div>
          </div>
          <Link to="/development/manufacturing-development/quality-planning-apqp" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <span>APQP Center</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="space-y-2.5">
          {mockMfgFunnel.map((f, i) => (
            <div key={f.label} className="flex items-center gap-3 text-xs">
              <div className="flex w-48 shrink-0 items-center gap-2 font-semibold text-foreground truncate">
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
        <span>Active Industrialization Gates: <strong>94</strong></span>
        <span>Target First Pass Yield: <strong>&ge; 98.5%</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   2. First Pass Yield Trend (%)
   =========================================================================== */
export const MdYieldTrendWidget = memo(function MdYieldTrendWidget() {
  const maxTrend = Math.max(1, ...mockYieldTrend.map((t) => t.count));

  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Overall First-Pass Yield Trend (%)</h3>
              <p className="text-xs text-muted-foreground">Average plant yield across pilot & ramp-up lines</p>
            </div>
          </div>
          <Link to="/development/manufacturing-development/process-validation" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <span>PPAP Matrix</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="flex h-[200px] items-end justify-between gap-2 pt-2">
          {mockYieldTrend.map((t, i) => (
            <div key={t.key} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-[10px] font-bold tabular text-foreground">{t.count}%</span>
              <div
                className={cn("w-full rounded-t-md transition-all")}
                style={{
                  height: `${Math.max(10, (t.count / maxTrend) * 160)}px`,
                  backgroundColor: chartColor(i),
                }}
              />
              <span className="text-[10px] text-muted-foreground">{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
        <span>Current Month Yield: <strong>96%</strong></span>
        <span>Six Sigma Cpk: <strong>1.67</strong></span>
      </div>
    </div>
  );
});

/* ===========================================================================
   3. Top Active Industrialization Projects Table
   =========================================================================== */
export const MdTopProjectsWidget = memo(function MdTopProjectsWidget() {
  return (
    <div className="card-soft flex h-full flex-col justify-between p-5">
      <div>
        <div className="mb-3 flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Settings className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Top Active Industrialization & Ramp Projects</h3>
              <p className="text-xs text-muted-foreground">Live manufacturing telemetry across robotics, tooling and assembly lines</p>
            </div>
          </div>
          <Link to="/development/manufacturing-development/mass-production-readiness" className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            <span>Mass Prod Matrix</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                <th className="pb-2">Project ID</th>
                <th className="pb-2">Project Name</th>
                <th className="pb-2">Stage</th>
                <th className="pb-2">Manufacturing Lead</th>
                <th className="pb-2">First Pass Yield</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {mockMfgProjects.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 font-bold text-primary">{p.id}</td>
                  <td className="py-2.5 text-foreground">{p.name}</td>
                  <td className="py-2.5 text-muted-foreground">{p.stage}</td>
                  <td className="py-2.5 text-slate-700 dark:text-slate-300">{p.lead}</td>
                  <td className="py-2.5 font-semibold text-emerald-600 dark:text-emerald-400 tabular">{p.yield}</td>
                  <td className="py-2.5 text-right">
                    <span
                      className={cn(
                        "inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold",
                        p.status === "Mass Production"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : p.status === "Ready PPAP"
                          ? "bg-primary/10 text-primary"
                          : "bg-blue-500/10 text-blue-600 dark:text-blue-400",
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
        <span>5 flagship assembly lines</span>
        <Link to="/development/manufacturing-development/smart-factory-development" className="text-primary font-semibold hover:underline">
          View Smart Factory IIoT →
        </Link>
      </div>
    </div>
  );
});

/* ===========================================================================
   4. Manufacturing AI Intelligence
   =========================================================================== */
export const MdAiIntelligenceWidget = memo(function MdAiIntelligenceWidget() {
  return (
    <div className="card-soft border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Smart Factory & Quality Engineering AI Intelligence</h3>
            <p className="text-xs text-muted-foreground">Predictive tool wear modeling, OEE optimization, and automated PFMEA risk scoring</p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          OEE 89.4% · Target Met
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 text-xs">
        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>APQP Quality Conformance</span>
          </div>
          <p className="text-muted-foreground">
            Zero Level 1 severity risks open across all 14 active PFMEAs. AI vision inspection in SMT line has 99.98% defect detection.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-1">
            <Zap className="h-3.5 w-3.5" />
            <span>Predictive Tooling Maintenance</span>
          </div>
          <p className="text-muted-foreground">
            Stator winding tooling cycle counter is at 84% life. Automated maintenance work order queued for next planned changeover.
          </p>
        </div>

        <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs">
          <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold mb-1">
            <Rocket className="h-3.5 w-3.5" />
            <span>PPAP Level 3 Approval Velocity</span>
          </div>
          <p className="text-muted-foreground">
            Pick & place robotics line completed 300-piece capability run with Cpk 1.82, ready for customer warranty submission.
          </p>
        </div>
      </div>
    </div>
  );
});

export const MD_PANEL_WIDGETS: WidgetDefinition[] = [
  {
    id: "chart.md.funnel",
    title: "APQP → Pilot → PPAP → Mass Production Pipeline",
    description: "Industrialization pipeline stages from quality planning to full ramp production.",
    category: "chart",
    tags: ["chart", "md"],
    icon: ShieldCheck,
    keywords: ["apqp", "pilot", "ppap", "mass production", "mfg", "funnel"],
    defaultSize: "xl",
    allowedSizes: ["lg", "xl", "full"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/quality-planning-apqp",
    component: MdFunnelWidget,
  },
  {
    id: "chart.md.yield-trend",
    title: "Overall First-Pass Yield Trend",
    description: "Multi-month manufacturing first-pass yield and quality conformance trend.",
    category: "chart",
    tags: ["chart", "md"],
    icon: TrendingUp,
    keywords: ["yield", "trend", "quality", "first pass"],
    defaultSize: "md",
    allowedSizes: ["md", "lg", "xl"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/process-validation",
    component: MdYieldTrendWidget,
  },
  {
    id: "table.md.top-projects",
    title: "Top Active Industrialization Projects",
    description: "Live telemetry and yields on key manufacturing line builds and automation rollouts.",
    category: "table",
    tags: ["table", "md"],
    icon: Settings,
    keywords: ["projects", "mfg", "automation", "robotics", "telemetry"],
    defaultSize: "full",
    allowedSizes: ["xl", "full"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/mass-production-readiness",
    component: MdTopProjectsWidget,
  },
  {
    id: "ai.md.manufacturing-intelligence",
    title: "Manufacturing AI Intelligence",
    description: "Predictive tooling maintenance, OEE optimization and PFMEA risk monitoring.",
    category: "ai",
    tags: ["ai", "md"],
    icon: Sparkles,
    keywords: ["ai", "mfg", "oee", "tooling", "smart factory", "intelligence"],
    defaultSize: "full",
    allowedSizes: ["full"],
    roles: "all",
    sourceRoute: "/development/manufacturing-development/overview",
    component: MdAiIntelligenceWidget,
  },
];
