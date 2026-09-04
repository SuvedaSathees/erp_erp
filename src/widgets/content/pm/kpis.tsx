/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Clock,
  IndianRupee,
  Users,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { pmOverviewOptions, type PmOverviewData } from "../../data/pmQueries";
import { makeStatCardWidget, type StatCardShape } from "../shared/StatCardWidget";

type Cfg = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  category?: WidgetCategory;
  tags?: WidgetCategory[];
  roles?: WidgetRole[] | "all";
  sourceRoute?: string;
  inLibrary?: boolean;
};

function widget(c: Cfg, map: (d: PmOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "pm"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/project-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: pmOverviewOptions,
    map,
  });
}

export const PM_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.pm.total-projects",
      title: "Total Projects",
      description: "Total projects currently planned, active, or in delivery across business units.",
      icon: ClipboardList,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      sourceRoute: "/management/project-management/project-planning",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.totalProjects ?? 48),
      delta: { label: "View All Projects →", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.pm.on-schedule",
      title: "On Schedule",
      description: "Projects executing within schedule float tolerances with healthy milestone velocity.",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/project-management/schedule",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.onSchedule ?? 36),
      delta: { label: `${d?.onSchedulePct ?? 75.0}% of Total`, direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.pm.at-risk",
      title: "At Risk",
      description: "Projects with impending procurement lead delays or critical path compression.",
      icon: AlertTriangle,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/project-management/risks",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.atRisk ?? 8),
      delta: { label: `${d?.atRiskPct ?? 16.7}% of Total`, direction: "up", tone: "negative" },
    }),
  ),
  widget(
    {
      id: "kpi.pm.delayed",
      title: "Delayed",
      description: "Projects that have breached planned milestone baselines and require recovery plans.",
      icon: Clock,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      sourceRoute: "/management/project-management/project-monitoring",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.delayed ?? 4),
      delta: { label: `${d?.delayedPct ?? 8.3}% of Total`, direction: "up", tone: "negative" },
    }),
  ),
  widget(
    {
      id: "kpi.pm.budget-utilization",
      title: "Budget Utilization",
      description: "Total committed and realized cost versus total allocated project capital baseline.",
      icon: IndianRupee,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      sourceRoute: "/management/project-management/cost-budget",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.budgetUtilizationPct ?? 42.6}%`,
      delta: {
        label: `${d?.budgetSpentFormatted ?? "₹ 71.11 L"} / ${d?.totalBudgetFormatted ?? "₹ 1.67 Cr"}`,
        direction: "up",
        tone: "positive",
      },
    }),
  ),
  widget(
    {
      id: "kpi.pm.resources-allocated",
      title: "Resources Allocated",
      description: "Dedicated project managers, engineers, technicians, and specialized machinery.",
      icon: Users,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      sourceRoute: "/management/project-management/resources",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.resourcesAllocated ?? 24),
      delta: { label: "View Resource Load →", direction: "up", tone: "positive" },
    }),
  ),
];
