import type { LucideIcon } from "lucide-react";
import {
  Megaphone,
  Users,
  MousePointerClick,
  Filter,
  UserCheck,
  BarChart3,
  Handshake,
  IndianRupee,
  TrendingUp,
  Coins,
  Percent,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { marketingOverviewOptions, type MarketingOverviewData } from "../../data/marketingQueries";
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

function widget(c: Cfg, map: (d: MarketingOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "marketing", "analytics"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/marketing-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: marketingOverviewOptions,
    map,
  });
}

export const MARKETING_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.marketing.active-campaigns",
      title: "Active Campaigns",
      description: "Total live marketing campaigns currently in execution across all channels.",
      icon: Megaphone,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      sourceRoute: "/management/marketing-management/campaigns",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.activeCampaigns ?? 12),
      delta: { label: "3 Launching Soon", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.campaign-reach",
      title: "Campaign Reach",
      description: "Total unique individuals exposed to campaign messaging across all touchpoints.",
      icon: Users,
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-600",
      sourceRoute: "/management/marketing-management/campaigns",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.campaignReach ?? "500,000",
      delta: { label: d?.kpis?.reachGrowth ?? "+12%", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.website-visits",
      title: "Website Visits",
      description: "Unique visitors driven to dedicated landing pages and digital web assets.",
      icon: MousePointerClick,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      sourceRoute: "/management/marketing-management/digital-marketing",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.websiteVisits ?? "25,000",
      delta: { label: d?.kpis?.visitsGrowth ?? "+18%", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.leads-generated",
      title: "Leads Generated",
      description: "Total marketing captured inquiries attributed to active campaign forms.",
      icon: Filter,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      sourceRoute: "/management/marketing-management/leads-management",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.leadsGenerated ?? 500),
      delta: { label: d?.kpis?.leadsGrowth ?? "+25%", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.mql",
      title: "Marketing Qualified (MQL)",
      description: "Leads meeting demographic criteria and high buying intent threshold.",
      icon: UserCheck,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      sourceRoute: "/management/marketing-management/leads-management",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.mql ?? 185),
      delta: { label: d?.kpis?.mqlGrowth ?? "+32%", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.sql",
      title: "Sales Qualified (SQL)",
      description: "Vetted MQL leads accepted by the enterprise commercial sales team.",
      icon: BarChart3,
      iconBg: "bg-pink-500/10",
      iconColor: "text-pink-600",
      sourceRoute: "/management/marketing-management/leads-management",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.sql ?? 82),
      delta: { label: d?.kpis?.sqlGrowth ?? "+28%", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.pipeline-opportunities",
      title: "Opportunities",
      description: "Active CRM sales deals created directly from marketing campaign attribution.",
      icon: Handshake,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-600",
      sourceRoute: "/management/crm-management/opportunity-management",
      inLibrary: true,
    },
    (d) => ({
      value: String(d?.kpis?.opportunities ?? 44),
      delta: { label: d?.kpis?.opportunitiesGrowth ?? "+22%", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.campaign-revenue",
      title: "Attributed Revenue",
      description: "Closed sales order revenue traced and attributed to marketing initiatives.",
      icon: IndianRupee,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      sourceRoute: "/management/sales-management/sales-analytics",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.campaignRevenue ?? "₹85.0 L",
      delta: { label: d?.kpis?.revenueGrowth ?? "+35%", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.roi",
      title: "Marketing ROI",
      description: "Gross commercial return multiplier on total campaign investment spend.",
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      sourceRoute: "/management/marketing-management/reports",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.marketingRoi ?? "4.5x",
      delta: { label: d?.kpis?.roiGrowth ?? "+1.2x", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.cost-per-lead",
      title: "Cost Per Lead (CPL)",
      description: "Average marketing spend required to generate one validated customer lead.",
      icon: Coins,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      sourceRoute: "/management/marketing-management/reports",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.costPerLead ?? "₹1,333",
      delta: { label: "-18% Efficiency", direction: "up", tone: "positive" },
    }),
  ),

  widget(
    {
      id: "kpi.marketing.budget-utilization",
      title: "Budget Utilization",
      description: "Actual campaign spend vs approved quarterly marketing budget.",
      icon: Percent,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-600",
      sourceRoute: "/management/marketing-management/campaigns",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.budgetUtilization ?? "77.5%",
      neutralText: `Spend: ${d?.kpis?.actualSpend ?? "₹6.20L"} / ${d?.kpis?.approvedBudget ?? "₹8.00L"}`,
    }),
  ),
];
