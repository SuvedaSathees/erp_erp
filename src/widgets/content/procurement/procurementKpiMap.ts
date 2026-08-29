import type { WidgetPageId } from "../../types";

/* ===========================================================================
   Procurement page KPI map
   ---------------------------------------------------------------------------
   Maps each Procurement page's built-in KPI card LABEL (as rendered by
   StatCard / KPIWidgetCard) to the registry widget that mirrors it.
   =========================================================================== */

export const PROCUREMENT_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "procurement-overview": {
    "Total Spend (FY 2026-27)": "kpi.procurement.total-spend",
    "Active Purchase Requisitions": "kpi.procurement.active-prs",
    "Open RFQs & Tenders": "kpi.procurement.open-rfqs-tenders",
    "Committed PO Value": "kpi.procurement.committed-po-value",
    "Inwarded GRN Receipts": "kpi.procurement.inwarded-grn-receipts",
    "Pending 3-Way Match (AP)": "kpi.procurement.pending-3-way-match",
    "Sourcing Savings Realized": "kpi.procurement.sourcing-savings-realized",
    "Active Supplier Network": "kpi.procurement.active-supplier-network",
    "Contract Coverage": "kpi.procurement.contract-coverage",
    "Critical / Emergency PRs": "kpi.procurement.critical-emergency-prs",
    "Approved PR Pipeline": "kpi.procurement.approved-pr-pipeline",
    "Active Purchase Orders": "kpi.procurement.active-pos",
    "QC Passed Receipts (GRN)": "kpi.procurement.qc-passed-receipts",
    "Pending AP Invoices": "kpi.procurement.pending-ap-invoices",
    "Total Committed Budget": "kpi.procurement.total-committed-budget",
    "Avg Procurement SLA": "kpi.procurement.avg-procurement-sla",
    "Cost Savings Realized": "kpi.procurement.cost-savings-realized",
    "Contract Compliance Rate": "kpi.procurement.contract-compliance-rate",
  },
};
