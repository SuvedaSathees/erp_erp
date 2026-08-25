import type { WidgetPageId } from "../../types";

/* ===========================================================================
   CRM page KPI map
   ---------------------------------------------------------------------------
   Maps each CRM page's built-in KPI card LABEL (as rendered by StatCard /
   KPIWidgetCard) to the registry widget that mirrors it.
   =========================================================================== */

export const CRM_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "crm-overview": {
    "Total Leads": "kpi.crm.total-leads",
    "Hot Leads": "kpi.crm.hot-leads",
    "Lead Conversion Rate": "kpi.crm.lead-conversion-rate",
    "Total Pipeline Value": "kpi.crm.pipeline-value",
    "Weighted Pipeline Forecast": "kpi.crm.weighted-pipeline",
    "Opportunity Win Rate": "kpi.crm.win-rate",
    "Active Key Accounts": "kpi.crm.active-accounts",
    "Average Account Health": "kpi.crm.account-health",
    "Open Support Tickets": "kpi.crm.open-tickets",
    "SLA Resolution Compliance": "kpi.crm.sla-compliance",
    "Customer CSAT Score": "kpi.crm.csat-score",
    "Active Loyalty Members": "kpi.crm.loyalty-members",
  },
};
