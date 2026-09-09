import type { LucideIcon } from "lucide-react";
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Percent,
  Target,
  Users,
  Building2,
  MapPin,
  Award,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { salesOverviewOptions, type SalesOverviewData } from "../../data/salesQueries";
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

function widget(c: Cfg, map: (d: SalesOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "sales", "analytics"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/sales-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: salesOverviewOptions,
    map,
  });
}

export const SALES_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.sales.total-revenue",
      title: "Total Revenue",
      description: "YTD closed billed sales revenue against target quota.",
      icon: DollarSign,
      iconBg: "bg-blue-500/10",
      iconColor: "text-[#0A3C75]",
      sourceRoute: "/management/sales-management/sales-analytics",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.totalRevenue ?? "₹ 3.80 Cr",
      delta: { label: d?.kpis?.revenueGrowth ?? "+14.2% YoY", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.sales.pipeline-value",
      title: "Sales Pipeline",
      description: "Total weighted deal opportunity value across active sales stages.",
      icon: TrendingUp,
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-600",
      sourceRoute: "/management/sales-management/sales-forecasting",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.pipelineValue ?? "₹ 13.20 Cr",
      delta: { label: d?.kpis?.pipelineCoverage ?? "2.93x Coverage", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.sales.active-orders",
      title: "Confirmed Orders",
      description: "Accepted customer orders currently in fulfillment and delivery.",
      icon: ShoppingCart,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-600",
      sourceRoute: "/management/sales-management/sales-orders",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.confirmedOrders ?? 184),
      delta: { label: d?.kpis?.billedOrderValue ?? "₹ 5.42 Cr Billed", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.sales.gross-margin",
      title: "Realized Gross Margin",
      description: "Net realized commercial margin after discount absorption.",
      icon: Percent,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      sourceRoute: "/management/sales-management/pricing",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.grossMargin ?? "28.5%",
      delta: { label: `Target: ${d?.kpis?.marginTarget ?? "30.0%"}`, direction: "down", tone: "neutral" },
    }),
  ),

  widget(
    {
      id: "kpi.sales.forecast-accuracy",
      title: "Forecast Accuracy",
      description: "Statistical accuracy of consensus demand model vs actuals.",
      icon: Target,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      sourceRoute: "/management/sales-management/sales-forecasting",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.forecastAccuracy ?? "92.0%",
      delta: { label: "+3.0% vs Prior Period", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.sales.new-customers",
      title: "New Accounts Won",
      description: "Net newly acquired commercial and enterprise accounts.",
      icon: Users,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      sourceRoute: "/management/sales-management/sales-planning",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.newCustomers ?? 72),
      delta: { label: d?.kpis?.newCustomerGrowth ?? "+20.0% YoY", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.sales.channel-partners",
      title: "Channel Network",
      description: "Active authorized dealers, distributors, and system integrators.",
      icon: Building2,
      iconBg: "bg-blue-500/10",
      iconColor: "text-[#0A3C75]",
      sourceRoute: "/management/sales-management/channel-partners",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.channelPartners ?? 48),
      delta: { label: "28 Gold / Silver Active", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.sales.territories-governed",
      title: "Active Territories",
      description: "Governed economic districts across South and West India.",
      icon: MapPin,
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-600",
      sourceRoute: "/management/sales-management/territory-management",
      inLibrary: true,
    },
    (d) => ({
      value: `${d?.kpis?.territoriesGoverned ?? 12} Districts`,
      delta: { label: "South Region Hub", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.sales.avg-deal-size",
      title: "Avg Deal Size",
      description: "Average transaction order value across enterprise charger bookings.",
      icon: Award,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-600",
      sourceRoute: "/management/sales-management/contracts",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.avgDealSize ?? "₹ 5.28 L",
      delta: { label: "+8.4% QoQ Gain", direction: "up", tone: "positive" },
    }),
  ),
];
