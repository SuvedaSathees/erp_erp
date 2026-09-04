/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  DollarSign,
  Globe,
  Handshake,
  Layers,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import { bdOverviewOptions, type BdOverviewData } from "../../data/bdQueries";
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

function widget(c: Cfg, map: (d: BdOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "sales"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/development/business-development/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: bdOverviewOptions,
    map,
  });
}

export const BD_KPI_WIDGETS: WidgetDefinition[] = [
  widget(
    {
      id: "kpi.bd.pipeline-value",
      title: "Pipeline Value",
      description: "Total estimated value across all active business development opportunities and proposals.",
      icon: DollarSign,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      sourceRoute: "/development/business-development/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.pipelineValue ?? "₹ 48.5 Cr",
      delta: { label: "+14.2% vs last quarter", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.bd.active-deals",
      title: "Active Deals",
      description: "Live commercial opportunities actively being scouted, pitched, or negotiated.",
      icon: Briefcase,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      sourceRoute: "/development/business-development/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.activeDeals ? String(d.kpis.activeDeals) : "42",
      delta: { label: "18 in negotiation", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.bd.closed-ytd",
      title: "Closed YTD Revenue",
      description: "Cumulative revenue realized from finalized strategic partnerships and commercial agreements.",
      icon: TrendingUp,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      sourceRoute: "/development/business-development/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.closedYtd ?? "₹ 18.2 Cr",
      delta: { label: "108% of Q2 target", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.bd.win-rate",
      title: "Win Rate",
      description: "Proposal-to-contract closure conversion percentage for high-impact strategic bids.",
      icon: Target,
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-500",
      sourceRoute: "/development/business-development/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.winRate ?? "64.8%",
      delta: { label: "+3.4% win conversion", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.bd.partner-ecosystem",
      title: "Partner Ecosystem",
      description: "Active OEM partners, VAR distributors, technology integrators, and channel alliances.",
      icon: Handshake,
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-500",
      sourceRoute: "/development/business-development/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.partnerEcosystem ? String(d.kpis.partnerEcosystem) : "128",
      delta: { label: "Global VARs & OEMs", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.bd.expansion-markets",
      title: "Expansion Markets",
      description: "International geographic zones with active regulatory and distributor setup.",
      icon: Globe,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      sourceRoute: "/development/business-development/international-expansion-development",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.expansionMarkets ? String(d.kpis.expansionMarkets) : "6",
      delta: { label: "APAC & MENA active", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.bd.avg-deal-size",
      title: "Average Deal Size",
      description: "Mean contract value per closed business development partnership.",
      icon: Zap,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
      sourceRoute: "/development/business-development/pricing-strategy-development",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.avgDealSize ?? "₹ 1.15 Cr",
      delta: { label: "+18% expansion", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.bd.open-rfps",
      title: "Open RFPs & Bids",
      description: "Active high-value commercial tenders and RFP submissions in review.",
      icon: Briefcase,
      iconBg: "bg-rose-500/10",
      iconColor: "text-rose-500",
      sourceRoute: "/development/business-development/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.openRfps ? String(d.kpis.openRfps) : "16",
      delta: { label: "₹ 26.4 Cr total ask", direction: "up", tone: "positive" },
    }),
  ),
  widget(
    {
      id: "kpi.bd.deal-velocity",
      title: "Deal Velocity",
      description: "Average cycle time from initial pitch to commercial contract closure.",
      icon: Target,
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-500",
      sourceRoute: "/development/business-development/overview",
      inLibrary: true,
    },
    (d) => ({
      value: d?.kpis?.dealVelocity ?? "34 Days",
      delta: { label: "-6 days cycle speed", direction: "up", tone: "positive" },
    }),
  ),
];
