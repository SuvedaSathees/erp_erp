import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  Leaf,
  Zap,
  Droplets,
  Trash2,
  Recycle,
  Scale,
  ShieldCheck,
  Clock,
  FileText,
} from "lucide-react";
import type { WidgetCategory, WidgetDefinition, WidgetRole } from "../../types";
import {
  sustainabilityOverviewOptions,
  type SustainabilityOverviewData,
} from "../../data/sustainabilityQueries";
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

function widget(c: Cfg, map: (d: SustainabilityOverviewData) => StatCardShape): WidgetDefinition {
  return makeStatCardWidget({
    id: c.id,
    title: c.title,
    description: c.description,
    category: c.category ?? "kpi",
    tags: c.tags ?? ["kpi", "sustainability"],
    icon: c.icon,
    keywords: c.title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
    roles: c.roles ?? "all",
    sourceRoute: c.sourceRoute ?? "/management/sustainability-management/overview",
    libraryHidden: !c.inLibrary,
    iconBg: c.iconBg,
    iconColor: c.iconColor,
    options: sustainabilityOverviewOptions,
    map,
  });
}

export const SUSTAINABILITY_KPI_WIDGETS: WidgetDefinition[] = [
  // 1. Total GHG Emissions
  widget(
    {
      id: "kpi.sustainability.ghg-emissions",
      title: "Total GHG Emissions",
      description: "Aggregated Scopes 1, 2 and 3 corporate greenhouse gas emissions inventory",
      icon: Cloud,
      iconBg: "bg-blue-50 dark:bg-blue-950/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/carbon-footprint",
    },
    (d) => ({
      value: d.kpis.ghgEmissions.value,
      delta: {
        direction: "down",
        label: d.kpis.ghgEmissions.delta,
        tone: "positive",
      },
      neutralText: d.kpis.ghgEmissions.subtext,
    }),
  ),

  // 2. ESG Scorecard Rating
  widget(
    {
      id: "kpi.sustainability.esg-scorecard",
      title: "ESG Scorecard Rating",
      description: "Composite rating across Environmental, Social, and Governance pillars",
      icon: Leaf,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/esg",
    },
    (d) => ({
      value: d.kpis.esgScorecard.value,
      delta: {
        direction: "up",
        label: d.kpis.esgScorecard.delta,
        tone: "positive",
      },
      neutralText: d.kpis.esgScorecard.subtext,
    }),
  ),

  // 3. Energy Consumption
  widget(
    {
      id: "kpi.sustainability.energy-consumption",
      title: "Energy Consumption",
      description: "Campus electricity and fuel consumption tracked via 48 IoT smart sub-meters",
      icon: Zap,
      iconBg: "bg-amber-50 dark:bg-amber-950/40",
      iconColor: "text-amber-500 dark:text-amber-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/energy-monitoring",
    },
    (d) => ({
      value: d.kpis.energyConsumption.value,
      delta: {
        direction: "down",
        label: d.kpis.energyConsumption.delta,
        tone: "positive",
      },
      neutralText: d.kpis.energyConsumption.subtext,
    }),
  ),

  // 4. Water Consumption
  widget(
    {
      id: "kpi.sustainability.water-consumption",
      title: "Water Consumption",
      description: "Freshwater intake, RO plant output, and Zero Liquid Discharge recirculation",
      icon: Droplets,
      iconBg: "bg-teal-50 dark:bg-teal-950/40",
      iconColor: "text-teal-600 dark:text-teal-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/water-management",
    },
    (d) => ({
      value: d.kpis.waterConsumption.value,
      delta: {
        direction: "down",
        label: d.kpis.waterConsumption.delta,
        tone: "positive",
      },
      neutralText: d.kpis.waterConsumption.subtext,
    }),
  ),

  // 5. Waste Generated
  widget(
    {
      id: "kpi.sustainability.waste-generated",
      title: "Waste Generated",
      description: "Industrial stamping offcuts, battery cell scrap, and sludge tracking",
      icon: Trash2,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/waste-management",
    },
    (d) => ({
      value: d.kpis.wasteGenerated.value,
      neutralText: `${d.kpis.wasteGenerated.caption} · ${d.kpis.wasteGenerated.subtext}`,
    }),
  ),

  // 6. Recycling Recovery Yield
  widget(
    {
      id: "kpi.sustainability.recycling-rate",
      title: "Recycling Recovery Yield",
      description: "Landfill diversion rate and circular secondary materials returned to manufacturing",
      icon: Recycle,
      iconBg: "bg-cyan-50 dark:bg-cyan-950/40",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/recycling-management",
    },
    (d) => ({
      value: d.kpis.recyclingRecovery.value,
      neutralText: `${d.kpis.recyclingRecovery.caption} · ${d.kpis.recyclingRecovery.subtext}`,
    }),
  ),

  // 7. Carbon Intensity
  widget(
    {
      id: "kpi.sustainability.carbon-intensity",
      title: "Carbon Intensity",
      description: "GHG emissions normalized per finished EV charger and power unit output",
      icon: Scale,
      iconBg: "bg-purple-50 dark:bg-purple-950/40",
      iconColor: "text-purple-600 dark:text-purple-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/carbon-footprint",
    },
    (d) => ({
      value: d.kpis.carbonIntensity.value,
      neutralText: `${d.kpis.carbonIntensity.caption} · ${d.kpis.carbonIntensity.subtext}`,
    }),
  ),

  // 8. Environmental Compliance
  widget(
    {
      id: "kpi.sustainability.environmental-compliance",
      title: "Environmental Compliance",
      description: "Consent to Operate (CTO), stack air emissions, and effluent compliance",
      icon: ShieldCheck,
      iconBg: "bg-slate-100 dark:bg-slate-800",
      iconColor: "text-slate-700 dark:text-slate-300",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/environmental-compliance",
    },
    (d) => ({
      value: d.kpis.environmentalCompliance.value,
      neutralText: d.kpis.environmentalCompliance.caption,
    }),
  ),

  // 9. Open ESG Initiatives
  widget(
    {
      id: "kpi.sustainability.esg-initiatives",
      title: "Open ESG Initiatives",
      description: "Active decarbonization, water reduction, and supplier audit CAPA assignments",
      icon: Clock,
      iconBg: "bg-orange-50 dark:bg-orange-950/40",
      iconColor: "text-orange-600 dark:text-orange-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/esg",
    },
    (d) => ({
      value: d.kpis.openEsgInitiatives.value,
      neutralText: d.kpis.openEsgInitiatives.caption,
    }),
  ),

  // 10. Statutory Reporting
  widget(
    {
      id: "kpi.sustainability.statutory-reporting",
      title: "Statutory Reporting",
      description: "SEBI BRSR Core, GRI Standards 2021, and TCFD Climate Risk Disclosures",
      icon: FileText,
      iconBg: "bg-rose-50 dark:bg-rose-950/40",
      iconColor: "text-rose-600 dark:text-rose-400",
      inLibrary: true,
      sourceRoute: "/management/sustainability-management/sustainability-reporting",
    },
    (d) => ({
      value: d.kpis.statutoryReporting.value,
      neutralText: d.kpis.statutoryReporting.caption,
    }),
  ),
];
