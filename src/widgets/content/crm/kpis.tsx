/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  BarChart3,
  Building2,
  CheckCircle2,
  Crown,
  DollarSign,
  FileCheck,
  Flame,
  Gauge,
  Headphones,
  HeartHandshake,
  LifeBuoy,
  Percent,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { crmOverviewOptions, type CrmOverviewData } from "../../data/crmQueries";
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

function widget(c: Cfg, map: (d: CrmOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "crm"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/crm-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: crmOverviewOptions,
    map,
  });
}

export const CRM_KPI_WIDGETS: WidgetDefinition[] = [
  /* ---- Lead Management KPIs ---- */
  widget(
    {
      id: "kpi.crm.total-leads",
      title: "Total Leads",
      description: "Active leads captured across all marketing and sales channels.",
      icon: Target,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      sourceRoute: "/management/crm-management/lead-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.totalLeads ? String(d.kpis.totalLeads) : "184",
      delta: { label: "+14% vs last month", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.crm.hot-leads",
      title: "Hot Leads",
      description: "High-priority qualified leads with urgent buy-intent.",
      icon: Flame,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      sourceRoute: "/management/crm-management/lead-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.hotLeads ? String(d.kpis.hotLeads) : "48",
      neutralText: "Ready for quotation",
      captionTone: "positive",
    }),
  ),
  widget(
    {
      id: "kpi.crm.lead-conversion-rate",
      title: "Lead Conversion Rate",
      description: "Percentage of total captured leads converted to opportunities.",
      icon: Percent,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/crm-management/lead-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.leadConversionRate ? `${d.kpis.leadConversionRate}%` : "26.4%",
      delta: { label: "+3.2% vs target", direction: "up", tone: "positive" },
    }),
  ),

  /* ---- Pipeline & Opportunities ---- */
  widget(
    {
      id: "kpi.crm.pipeline-value",
      title: "Total Pipeline Value",
      description: "Aggregate unweighted value of active deal opportunities in funnel.",
      icon: DollarSign,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      sourceRoute: "/management/crm-management/opportunity-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.pipelineValue ? formatCurrency(d.kpis.pipelineValue) : "₹3.42 Cr",
      neutralText: "42 active opportunities",
    }),
  ),
  widget(
    {
      id: "kpi.crm.weighted-pipeline",
      title: "Weighted Pipeline Forecast",
      description: "Probability-adjusted expected revenue from active opportunities.",
      icon: TrendingUp,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      sourceRoute: "/management/crm-management/sales-pipeline-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.weightedPipeline ? formatCurrency(d.kpis.weightedPipeline) : "₹1.98 Cr",
      delta: { label: "+8.4% expected win", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.crm.win-rate",
      title: "Opportunity Win Rate",
      description: "Historical ratio of won deals versus total closed deals.",
      icon: Award,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/crm-management/opportunity-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.winRate ? `${d.kpis.winRate}%` : "68.5%",
      neutralText: "Industry benchmark: 52%",
      captionTone: "positive",
    }),
  ),

  /* ---- Accounts & Contacts ---- */
  widget(
    {
      id: "kpi.crm.active-accounts",
      title: "Active Key Accounts",
      description: "Enterprise and commercial client accounts actively trading.",
      icon: Building2,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      sourceRoute: "/management/crm-management/account-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activeAccounts ? String(d.kpis.activeAccounts) : "128",
      neutralText: "642 managed contacts",
    }),
  ),
  widget(
    {
      id: "kpi.crm.account-health",
      title: "Average Account Health",
      description: "Composite health score based on usage, orders, NPS and support.",
      icon: Activity,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/crm-management/customer-success",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.averageHealthScore ? `${d.kpis.averageHealthScore}/100` : "84/100",
      neutralText: "Low churn risk (Healthy)",
      captionTone: "positive",
    }),
  ),

  /* ---- Support & CSAT ---- */
  widget(
    {
      id: "kpi.crm.open-tickets",
      title: "Open Support Tickets",
      description: "Active support cases pending agent resolution.",
      icon: Headphones,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/crm-management/customer-support",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.openTickets ? String(d.kpis.openTickets) : "11",
      neutralText: "Avg response: 18 mins",
    }),
  ),
  widget(
    {
      id: "kpi.crm.sla-compliance",
      title: "SLA Resolution Compliance",
      description: "Percentage of tickets resolved within guaranteed SLA timeframes.",
      icon: ShieldCheck,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/management/crm-management/customer-support",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.slaCompliance ? `${d.kpis.slaCompliance}%` : "97.2%",
      delta: { label: "+1.8% vs SLA target", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.crm.csat-score",
      title: "Customer CSAT Score",
      description: "Overall satisfaction rating from customer feedback surveys.",
      icon: Star,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/management/crm-management/customer-feedback",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.csatScore ? `${d.kpis.csatScore} / 5.0` : "4.85 / 5.0",
      neutralText: "NPS Score: +68",
      captionTone: "positive",
    }),
  ),

  /* ---- Loyalty Program ---- */
  widget(
    {
      id: "kpi.crm.loyalty-members",
      title: "Active Loyalty Members",
      description: "Customers enrolled in reward tiers and incentive programs.",
      icon: Crown,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      sourceRoute: "/management/crm-management/loyalty-management",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activeLoyaltyMembers ? String(d.kpis.activeLoyaltyMembers) : "320",
      neutralText: "45.2K points redeemed MTD",
    }),
  ),
];
