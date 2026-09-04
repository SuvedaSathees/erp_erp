/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  CheckCircle2,
  ShieldCheck,
  Coins,
  Building2,
  Wrench,
  Gauge,
  Activity,
  Clock,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { assetOverviewOptions, type AssetOverviewData } from "../../data/assetQueries";
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

function widget(c: Cfg, map: (d: AssetOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "finance"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/asset-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: assetOverviewOptions,
    map,
  });
}

export const ASSET_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.asset.total-portfolio",
      title: "Total Assets",
      description: "Total enterprise capitalized asset units across all company facilities.",
      icon: Boxes,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      sourceRoute: "/management/asset-management/fixed-assets",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.totalAssets ?? 428),
      delta: { label: d?.kpis?.grossValue ?? "₹ 18.60 Cr", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.asset.active-assets",
      title: "Active in Operation",
      description: "Assets currently active and in productive service.",
      icon: CheckCircle2,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      sourceRoute: "/management/asset-management/equipment",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.activeAssets ?? 401),
      delta: { label: d?.kpis?.operationalRate ?? "93.69% in Service", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.asset.nbv",
      title: "Net Book Value (NBV)",
      description: "Current carrying book value after accumulated depreciation.",
      icon: ShieldCheck,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-600",
      sourceRoute: "/management/asset-management/asset-depreciation",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.netBookValue ?? "₹ 13.20 Cr",
      neutralText: `${d?.kpis?.carryingValueRate ?? "70.97%"} carrying value`,
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.asset.depreciation",
      title: "Monthly Depreciation",
      description: "Current monthly amortization expense posted to general ledger.",
      icon: Coins,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      sourceRoute: "/management/asset-management/asset-depreciation",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.monthlyDepreciation ?? "₹ 23.45 L",
      neutralText: `YTD: ${d?.kpis?.ytdDepreciation ?? "₹ 1.98 Cr"}`,
      captionTone: "muted",
    }),
  ),
  widget(
    {
      id: "kpi.asset.equipment-oee",
      title: "Equipment Fleet OEE",
      description: "Overall Equipment Effectiveness across manufacturing plant machinery.",
      icon: Building2,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      sourceRoute: "/management/asset-management/equipment",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.equipmentOee ?? "88.4%",
      neutralText: `${d?.kpis?.equipmentCount ?? 86} Fleet Units`,
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.asset.tool-availability",
      title: "Tool Availability",
      description: "Percentage of cataloged precision tools available in tool cribs.",
      icon: Wrench,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      sourceRoute: "/management/asset-management/tool-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.toolsInCribRate ?? "94.2%",
      neutralText: `${d?.kpis?.toolsCount ?? 1450} Tools Cataloged`,
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.asset.calibration-rate",
      title: "Calibration Compliance",
      description: "Audit compliance for certified metrology tools and precision gauges.",
      icon: Gauge,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      sourceRoute: "/management/asset-management/calibration",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.calibrationCompliance ?? "100%",
      neutralText: `${d?.kpis?.gaugesCount ?? 38} Gauges Valid`,
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.asset.maintenance-wos",
      title: "Plant Maintenance",
      description: "Active work orders and Mean Time Between Failures.",
      icon: Activity,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600",
      sourceRoute: "/management/asset-management/maintenance",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.kpis?.openMaintenanceWos ?? 12} WOs`,
      neutralText: `${d?.kpis?.mtbfHours ?? 620}h MTBF Uptime`,
      captionTone: "muted",
    }),
  ),
  widget(
    {
      id: "kpi.asset.pm-compliance",
      title: "PM Compliance",
      description: "Preventive maintenance scheduled checklist completion rate.",
      icon: Clock,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-600",
      sourceRoute: "/management/asset-management/preventive-maintenance",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.pmComplianceRate ?? "98.0%",
      delta: { label: `${d?.kpis?.pmPlansCount ?? 48} Plans Active`, direction: "up", tone: "positive" },
    }),
  ),
];
