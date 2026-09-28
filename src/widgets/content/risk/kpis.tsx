/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  Shield,
  AlertTriangle,
  AlertOctagon,
  AlertCircle,
  ShieldCheck,
  Calendar,
  IndianRupee,
  Activity,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { riskOverviewOptions, type RiskOverviewData } from "../../data/riskQueries";
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

function widget(c: Cfg, map: (d: RiskOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "risk"],
    icon: c.icon,
    keywords: c.title.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/risk-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: riskOverviewOptions,
    map,
  });
}

export const RISK_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.risk.total-risks",
      title: "Total Risks",
      description: "Total enterprise risks logged across all operational units and categories.",
      icon: Shield,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      sourceRoute: "/management/risk-management/enterprise-risk",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.totalRisks),
      delta: {
        value: d.totalRisksDelta,
        trend: "up",
        label: "vs prev quarter",
      },
    }),
  ),

  widget(
    {
      id: "kpi.risk.critical-risks",
      title: "Critical Risks",
      description: "Risks with inherent or residual score in the critical threshold (17-25).",
      icon: AlertTriangle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      sourceRoute: "/management/risk-management/enterprise-risk",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.criticalRisks),
      delta: {
        value: d.criticalRisksDelta,
        trend: "up",
        label: "requires mitigation",
      },
    }),
  ),

  widget(
    {
      id: "kpi.risk.high-risks",
      title: "High Risks",
      description: "Substantial enterprise risks scored between 10 and 16.",
      icon: AlertOctagon,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
      sourceRoute: "/management/risk-management/enterprise-risk",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.highRisks),
      delta: {
        value: d.highRisksDelta,
        trend: "down",
        label: "under active treatment",
      },
    }),
  ),

  widget(
    {
      id: "kpi.risk.medium-risks",
      title: "Medium Risks",
      description: "Operational and moderate risks scored between 5 and 9.",
      icon: AlertCircle,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/risk-management/enterprise-risk",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.mediumRisks),
      delta: {
        value: d.mediumRisksDelta,
        trend: "neutral",
        label: "monitored monthly",
      },
    }),
  ),

  widget(
    {
      id: "kpi.risk.low-risks",
      title: "Low Risks",
      description: "Tolerable risks scored 1 to 4 under standard management controls.",
      icon: ShieldCheck,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/risk-management/enterprise-risk",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.lowRisks),
      delta: {
        value: d.lowRisksDelta,
        trend: "down",
        label: "within baseline",
      },
    }),
  ),

  widget(
    {
      id: "kpi.risk.overdue-actions",
      title: "Overdue Actions",
      description: "Risk treatment and control enhancement actions overdue beyond SLA.",
      icon: Calendar,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-500",
      sourceRoute: "/management/risk-management/enterprise-risk",
      inLibrary: true,
    },
    (d) => ({
      value: String(d.overdueActions),
      delta: {
        value: d.overdueActionsDelta,
        trend: "up",
        label: "escalated to CXO",
      },
    }),
  ),

  widget(
    {
      id: "kpi.risk.residual-exposure",
      title: "Residual Exposure",
      description: "Net quantified monetary enterprise risk exposure post-control implementation.",
      icon: IndianRupee,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      sourceRoute: "/management/risk-management/enterprise-risk",
      inLibrary: true,
    },
    (d) => ({
      value: d.residualExposure,
      delta: {
        value: "- 14%",
        trend: "down",
        label: "post-mitigation effect",
      },
    }),
  ),

  widget(
    {
      id: "kpi.risk.kris-in-red",
      title: "Red KRIs",
      description: "Key Risk Indicators breaching critical early warning thresholds.",
      icon: Activity,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      sourceRoute: "/management/risk-management/enterprise-risk",
      inLibrary: true,
    },
    (d) => ({
      value: `${d.krisInRed} Breaches`,
      delta: {
        value: "Immediate Review",
        trend: "neutral",
        label: "supplier & delivery",
      },
    }),
  ),
];
