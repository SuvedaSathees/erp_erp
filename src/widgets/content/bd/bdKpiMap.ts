import type { WidgetPageId } from "../../types";

export const BD_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "bd-overview": {
    "Pipeline Value": "kpi.bd.pipeline-value",
    "Active Deals": "kpi.bd.active-deals",
    "Closed YTD Revenue": "kpi.bd.closed-ytd",
    "Win Rate": "kpi.bd.win-rate",
    "Partner Ecosystem": "kpi.bd.partner-ecosystem",
    "Expansion Markets": "kpi.bd.expansion-markets",
    "Average Deal Size": "kpi.bd.avg-deal-size",
    "Open RFPs & Bids": "kpi.bd.open-rfps",
    "Deal Velocity": "kpi.bd.deal-velocity",
  },
};
