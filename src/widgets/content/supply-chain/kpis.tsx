/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  Boxes,
  TrendingUp,
  Radio,
  Repeat,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  PackageCheck,
  Percent,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { supplyChainOverviewOptions, type SupplyChainOverviewData } from "../../data/supplyChainQueries";
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

function widget(c: Cfg, map: (d: SupplyChainOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "operations"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/supply-chain-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: supplyChainOverviewOptions,
    map,
  });
}

export const SUPPLY_CHAIN_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.supply-chain.forecast-demand",
      title: "Forecast Demand",
      description: "Total projected units for the planning horizon across all active product lines.",
      icon: Boxes,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      sourceRoute: "/management/supply-chain-management/demand-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.totalForecastDemand?.value ?? "1,28,700",
      delta: {
        label: d?.kpis?.totalForecastDemand?.change ?? "+8.6% vs Last Ver",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.totalForecastDemand?.subtext ?? "Units (FY 2026-27)",
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.supply-chain.forecast-accuracy",
      title: "Forecast Accuracy",
      description: "Demand prediction reliability index and performance score.",
      icon: Percent,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      sourceRoute: "/management/supply-chain-management/demand-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.forecastAccuracy?.value ?? "92.4%",
      delta: {
        label: d?.kpis?.forecastAccuracy?.change ?? "+1.8%",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.forecastAccuracy?.subtext ?? "MAPE 7.6%",
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.supply-chain.forecast-value",
      title: "Total Forecast Value",
      description: "Total commercial business value associated with projected demand.",
      icon: TrendingUp,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-600",
      sourceRoute: "/management/supply-chain-management/demand-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.totalForecastValue?.value ?? "₹ 246.85 Cr",
      delta: {
        label: d?.kpis?.totalForecastValue?.change ?? "+12.4%",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.totalForecastValue?.subtext ?? "Active FY26-27",
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.supply-chain.demand-signals",
      title: "Demand Signals",
      description: "Active high-priority signal streams ingested from CRM, ERP, and market intelligence.",
      icon: Radio,
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-600",
      sourceRoute: "/management/supply-chain-management/demand-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.demandSignalsCount?.value ?? "10",
      delta: {
        label: d?.kpis?.demandSignalsCount?.change ?? "+3 new",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.demandSignalsCount?.subtext ?? "Active Signals",
      captionTone: "neutral",
    }),
  ),
  widget(
    {
      id: "kpi.supply-chain.pending-adjustments",
      title: "Demand Adjustments",
      description: "Manual and automated adjustment overrides pending planner review.",
      icon: Repeat,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      sourceRoute: "/management/supply-chain-management/demand-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.pendingAdjustments?.value ?? "12",
      delta: {
        label: d?.kpis?.pendingAdjustments?.change ?? "4 Urgent",
        direction: "down",
        tone: "warning",
      },
      neutralText: d?.kpis?.pendingAdjustments?.subtext ?? "Pending Review",
      captionTone: "warning",
    }),
  ),
  widget(
    {
      id: "kpi.supply-chain.open-sales-orders",
      title: "Open Sales Orders",
      description: "Unfulfilled firm customer sales orders in the pipeline.",
      icon: ShoppingCart,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-600",
      sourceRoute: "/management/supply-chain-management/demand-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.openSalesOrders?.value ?? "342",
      delta: {
        label: d?.kpis?.openSalesOrders?.change ?? "₹ 98.32 Cr",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.openSalesOrders?.subtext ?? "Confirmed Orders",
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.supply-chain.stockout-risk",
      title: "Projected Stockouts",
      description: "Product SKUs with projected buffer stock deficits requiring replenishment acceleration.",
      icon: AlertTriangle,
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600",
      sourceRoute: "/management/supply-chain-management/demand-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.projectedStockouts?.value ?? "8",
      delta: {
        label: d?.kpis?.projectedStockouts?.change ?? "-3 SKUs",
        direction: "down",
        tone: "positive",
      },
      neutralText: d?.kpis?.projectedStockouts?.subtext ?? "SKUs At Risk",
      captionTone: "warning",
    }),
  ),
  widget(
    {
      id: "kpi.supply-chain.service-level",
      title: "Customer Service Level",
      description: "Customer demand fulfillment and on-time order delivery rate.",
      icon: CheckCircle2,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      sourceRoute: "/management/supply-chain-management/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.serviceLevel?.value ?? "98.2%",
      delta: {
        label: d?.kpis?.serviceLevel?.change ?? "+0.6%",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.serviceLevel?.subtext ?? "OTIF Fulfillment",
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.supply-chain.inventory-impact",
      title: "Procurement Requirement",
      description: "Calculated raw material and assembly parts replenishment quantity.",
      icon: PackageCheck,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600",
      sourceRoute: "/management/supply-chain-management/demand-planning",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.inventoryImpact?.value ?? "86,400",
      delta: {
        label: d?.kpis?.inventoryImpact?.change ?? "+5,200",
        direction: "up",
        tone: "positive",
      },
      neutralText: d?.kpis?.inventoryImpact?.subtext ?? "Units Required",
      captionTone: "positive",
    }),
  ),
];
