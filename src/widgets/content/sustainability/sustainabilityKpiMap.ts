import type { WidgetPageId } from "../../types";

export const SUSTAINABILITY_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "sustainability-overview": {
    "Total GHG Emissions": "kpi.sustainability.ghg-emissions",
    "ESG Scorecard Rating": "kpi.sustainability.esg-scorecard",
    "Energy Consumption": "kpi.sustainability.energy-consumption",
    "Water Consumption": "kpi.sustainability.water-consumption",
    "Waste Generated": "kpi.sustainability.waste-generated",
    "Recycling Recovery Yield": "kpi.sustainability.recycling-rate",
    "Carbon Intensity": "kpi.sustainability.carbon-intensity",
    "Environmental Compliance": "kpi.sustainability.environmental-compliance",
    "Open ESG Initiatives": "kpi.sustainability.esg-initiatives",
    "Statutory Reporting": "kpi.sustainability.statutory-reporting",
  },
  "sustainability-esg": {
    "ESG Scorecard Rating": "kpi.sustainability.esg-scorecard",
    "Open ESG Initiatives": "kpi.sustainability.esg-initiatives",
    "Statutory Reporting": "kpi.sustainability.statutory-reporting",
  },
  "sustainability-carbon-footprint": {
    "Total GHG Emissions": "kpi.sustainability.ghg-emissions",
    "Carbon Intensity": "kpi.sustainability.carbon-intensity",
  },
  "sustainability-energy-monitoring": {
    "Energy Consumption": "kpi.sustainability.energy-consumption",
  },
  "sustainability-water-management": {
    "Water Consumption": "kpi.sustainability.water-consumption",
  },
  "sustainability-waste-management": {
    "Waste Generated": "kpi.sustainability.waste-generated",
  },
  "sustainability-recycling-management": {
    "Recycling Recovery Yield": "kpi.sustainability.recycling-rate",
  },
  "sustainability-environmental-compliance": {
    "Environmental Compliance": "kpi.sustainability.environmental-compliance",
  },
  "sustainability-reporting": {
    "Statutory Reporting": "kpi.sustainability.statutory-reporting",
  },
};
