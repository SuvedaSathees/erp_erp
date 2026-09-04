import type { WidgetInstance, WidgetPageId } from "./types";

/* ===========================================================================
   Default layouts
   ---------------------------------------------------------------------------
   These reproduce each page EXACTLY as it looked before the widget system, in
   the same DOM order. A page with no saved layout renders from here, which is
   what makes this upgrade backward compatible: nothing changes for a user until
   they customize, and "Restore Default" simply deletes their saved layout.

   Spans (60-col desktop grid, see grid.ts):
     sm = 12 (1/5)   md = 20 (1/3)   lg = 30 (1/2)   xl = 40 (2/3)   full = 60
   `spanOverride` is used only where the original layout used a fraction the
   size presets don't express — the Dashboard's quarter-width cards at 15/60.
   =========================================================================== */

const base = { theme: "default", pinned: false } as const;

export const DEFAULT_LAYOUTS: Record<WidgetPageId, WidgetInstance[]> = {
  /** Mirrors src/routes/index.tsx: 5-up KPI row, 2+1+1 charts row, 3-up row, full-width insights. */
  dashboard: [
    { ...base, id: "dash-kpi-revenue", widgetId: "kpi.total-revenue", size: "sm" },
    { ...base, id: "dash-kpi-net-profit", widgetId: "kpi.net-profit", size: "sm" },
    { ...base, id: "dash-kpi-expenses", widgetId: "kpi.total-expenses", size: "sm" },
    { ...base, id: "dash-kpi-cash", widgetId: "kpi.cash-balance", size: "sm" },
    { ...base, id: "dash-kpi-current-ratio", widgetId: "kpi.current-ratio", size: "sm" },

    // Original: `lg:grid-cols-4` with the trend card at col-span-2 (half) and
    // the next two at a quarter each — 15/60 has no size preset, hence override.
    { ...base, id: "dash-trend", widgetId: "chart.revenue-expense-trend", size: "lg" },
    {
      ...base,
      id: "dash-cash-flow",
      widgetId: "list.cash-flow-summary",
      size: "md",
      spanOverride: { xl: 15, lg: 3, md: 3 },
    },
    {
      ...base,
      id: "dash-expense-donut",
      widgetId: "chart.expense-donut",
      size: "md",
      spanOverride: { xl: 15, lg: 3, md: 3 },
    },

    // Original: `lg:grid-cols-3` — thirds.
    { ...base, id: "dash-aging-ar", widgetId: "chart.aging-receivable", size: "md" },
    { ...base, id: "dash-aging-ap", widgetId: "chart.aging-payable", size: "md" },
    { ...base, id: "dash-recent-txn", widgetId: "table.recent-transactions", size: "md" },

    { ...base, id: "dash-insights", widgetId: "insight.quick-financial", size: "full" },
  ],

  /**
   * Mirrors src/routes/management.finance.overview.tsx: a 9-card KPI row, then
   * a `lg:grid-cols-3` section (trend spans 2, cash flow 1, banks 1, net income
   * spans 2), then ops-ledger (2) + alerts (1), then full-width AI.
   * The original page put 6px more space between sections (`space-y-6`) than
   * within them; the grid now uses one uniform 16px gap.
   */
  "finance-overview": [
    { ...base, id: "ovw-kpi-revenue", widgetId: "kpi.total-revenue", size: "sm" },
    { ...base, id: "ovw-kpi-expenses", widgetId: "kpi.total-expenses", size: "sm" },
    { ...base, id: "ovw-kpi-cash", widgetId: "kpi.cash-balance", size: "sm" },
    { ...base, id: "ovw-kpi-net-profit", widgetId: "kpi.net-profit", size: "sm" },
    { ...base, id: "ovw-kpi-accounts", widgetId: "kpi.total-accounts", size: "sm" },
    { ...base, id: "ovw-kpi-posted", widgetId: "kpi.posted-journals", size: "sm" },
    { ...base, id: "ovw-kpi-trial-diff", widgetId: "kpi.trial-balance-diff", size: "sm" },
    { ...base, id: "ovw-kpi-ap", widgetId: "kpi.pending-payables", size: "sm" },
    { ...base, id: "ovw-kpi-ar", widgetId: "kpi.pending-receivables", size: "sm" },

    // `lg:grid-cols-3` → thirds; the trend and area charts spanned 2 of 3.
    { ...base, id: "ovw-trend", widgetId: "chart.overview-trend", size: "xl" },
    { ...base, id: "ovw-cash-flow", widgetId: "list.overview-cash-flow", size: "md" },
    { ...base, id: "ovw-bank-balances", widgetId: "list.bank-balances", size: "md" },
    { ...base, id: "ovw-net-income", widgetId: "chart.net-income-area", size: "xl" },

    { ...base, id: "ovw-ops-ledger", widgetId: "table.operations-ledger", size: "xl" },
    { ...base, id: "ovw-alerts", widgetId: "insight.system-alerts", size: "md" },

    { ...base, id: "ovw-ai", widgetId: "ai.financial-intelligence", size: "full" },
  ],
  "finance-payables": [],
  "finance-receivables": [],
  "finance-cash-bank": [],
  "finance-budgeting": [],
  "finance-cost-centers": [],
  "finance-consolidation": [],
  "finance-profitability": [],
  "finance-tax": [],
  "finance-reports": [],
  "finance-assets": [],
  "finance-audit": [],

  "pd-overview": [
    // Tier 1: 9 KPI cards
    { ...base, id: "pd-ovw-active", widgetId: "kpi.pd.active-projects", size: "sm" },
    { ...base, id: "pd-ovw-dev", widgetId: "kpi.pd.in-development", size: "sm" },
    { ...base, id: "pd-ovw-release", widgetId: "kpi.pd.ready-release", size: "sm" },
    { ...base, id: "pd-ovw-lifecycle", widgetId: "kpi.pd.active-lifecycle", size: "sm" },
    { ...base, id: "pd-ovw-health", widgetId: "kpi.pd.overall-health", size: "sm" },
    { ...base, id: "pd-ovw-strategy", widgetId: "kpi.pd.strategy-baselines", size: "sm" },
    { ...base, id: "pd-ovw-embedded", widgetId: "kpi.pd.embedded-modules", size: "sm" },
    { ...base, id: "pd-ovw-cloud", widgetId: "kpi.pd.cloud-apis", size: "sm" },
    { ...base, id: "pd-ovw-tests", widgetId: "kpi.pd.test-pass-rate", size: "sm" },

    // Tier 2: Velocity & Quality Trend (2 of 3) + Lifecycle Funnel (1 of 3)
    { ...base, id: "pd-ovw-composed-trend", widgetId: "chart.pd.composed-trend", size: "xl" },
    { ...base, id: "pd-ovw-funnel", widgetId: "chart.pd.funnel", size: "md" },

    // Tier 3: Tech Mix (1 of 3) + Cumulative Scale Area Curve (2 of 3)
    { ...base, id: "pd-ovw-tech-mix", widgetId: "list.pd.tech-stack-mix", size: "md" },
    { ...base, id: "pd-ovw-velocity-curve", widgetId: "chart.pd.velocity-curve", size: "xl" },

    // Tier 4: Operations Ledger (2 of 3) + Alerts & Forecast (1 of 3)
    { ...base, id: "pd-ovw-ops-ledger", widgetId: "table.pd.operations-ledger", size: "xl" },
    { ...base, id: "pd-ovw-alerts", widgetId: "insight.pd-alerts", size: "md" },

    // Tier 5: AI Intelligence Center (Full Width)
    { ...base, id: "pd-ovw-ai", widgetId: "ai.pd.engineering-intelligence", size: "full" },
  ],
  "md-overview": [
    // Tier 1: 9 KPI cards
    { ...base, id: "md-ovw-active", widgetId: "kpi.md.active-projects", size: "sm" },
    { ...base, id: "md-ovw-pilot", widgetId: "kpi.md.in-pilot", size: "sm" },
    { ...base, id: "md-ovw-ppap", widgetId: "kpi.md.ready-ppap", size: "sm" },
    { ...base, id: "md-ovw-mass", widgetId: "kpi.md.mass-production", size: "sm" },
    { ...base, id: "md-ovw-readiness", widgetId: "kpi.md.overall-readiness", size: "sm" },
    { ...base, id: "md-ovw-apqp-gates", widgetId: "kpi.md.apqp-gates", size: "sm" },
    { ...base, id: "md-ovw-robotics", widgetId: "kpi.md.robotics-cells", size: "sm" },
    { ...base, id: "md-ovw-oee", widgetId: "kpi.md.smart-factory-oee", size: "sm" },
    { ...base, id: "md-ovw-fpy", widgetId: "kpi.md.first-pass-yield", size: "sm" },

    // Tier 2: Production & Yield Trend (2 of 3) + Ramp Funnel (1 of 3)
    { ...base, id: "md-ovw-composed-trend", widgetId: "chart.md.composed-trend", size: "xl" },
    { ...base, id: "md-ovw-funnel", widgetId: "chart.md.funnel", size: "md" },

    // Tier 3: Tooling Status (1 of 3) + Ramp Area Curve (2 of 3)
    { ...base, id: "md-ovw-tooling-dist", widgetId: "list.md.tooling-distribution", size: "md" },
    { ...base, id: "md-ovw-yield-curve", widgetId: "chart.md.yield-curve", size: "xl" },

    // Tier 4: Operations Ledger (2 of 3) + Alerts & Forecast (1 of 3)
    { ...base, id: "md-ovw-ops-ledger", widgetId: "table.md.operations-ledger", size: "xl" },
    { ...base, id: "md-ovw-alerts", widgetId: "insight.md-alerts", size: "md" },

    // Tier 5: AI Intelligence Center (Full Width)
    { ...base, id: "md-ovw-ai", widgetId: "ai.md.manufacturing-intelligence", size: "full" },
  ],

  /** HRM Management Overview layout */
  "hrm-overview": [
    { ...base, id: "hrm-ovw-total-emp", widgetId: "kpi.hrm.total-employees", size: "sm" },
    { ...base, id: "hrm-ovw-active-workforce", widgetId: "kpi.hrm.active-workforce", size: "sm" },
    { ...base, id: "hrm-ovw-payroll", widgetId: "kpi.hrm.monthly-payroll", size: "sm" },
    { ...base, id: "hrm-ovw-requisitions", widgetId: "kpi.hrm.open-requisitions", size: "sm" },
    { ...base, id: "hrm-ovw-attendance", widgetId: "kpi.hrm.attendance-rate", size: "sm" },
    { ...base, id: "hrm-ovw-onboarding", widgetId: "kpi.hrm.onboarding-in-progress", size: "sm" },
    { ...base, id: "hrm-ovw-leaves", widgetId: "kpi.hrm.pending-leaves", size: "sm" },
    { ...base, id: "hrm-ovw-training", widgetId: "kpi.hrm.training-hours", size: "sm" },
    { ...base, id: "hrm-ovw-retention", widgetId: "kpi.hrm.retention-rate", size: "sm" },
    { ...base, id: "hrm-ovw-performance", widgetId: "kpi.hrm.performance-score", size: "sm" },

    { ...base, id: "hrm-ovw-funnel", widgetId: "chart.hrm.recruitment-funnel", size: "xl" },
    { ...base, id: "hrm-ovw-dept-dist", widgetId: "chart.hrm.department-distribution", size: "md" },

    { ...base, id: "hrm-ovw-payroll-trend", widgetId: "chart.hrm.payroll-trend", size: "xl" },
    { ...base, id: "hrm-ovw-reviews", widgetId: "table.hrm.upcoming-reviews", size: "md" },

    { ...base, id: "hrm-ovw-ai", widgetId: "ai.hrm.workforce-intelligence", size: "full" },
  ],

  /** Administration Management Overview layout */
  "admin-overview": [
    { ...base, id: "admin-ovw-branches", widgetId: "kpi.admin.total-branches", size: "sm" },
    { ...base, id: "admin-ovw-depts", widgetId: "kpi.admin.active-departments", size: "sm" },
    { ...base, id: "admin-ovw-users", widgetId: "kpi.admin.active-users", size: "sm" },
    { ...base, id: "admin-ovw-roles", widgetId: "kpi.admin.roles-permissions", size: "sm" },
    { ...base, id: "admin-ovw-approvals", widgetId: "kpi.admin.pending-approvals", size: "sm" },
    { ...base, id: "admin-ovw-docs", widgetId: "kpi.admin.controlled-documents", size: "sm" },
    { ...base, id: "admin-ovw-policies", widgetId: "kpi.admin.active-policies", size: "sm" },
    { ...base, id: "admin-ovw-master", widgetId: "kpi.admin.master-data-entities", size: "sm" },
    { ...base, id: "admin-ovw-audit", widgetId: "kpi.admin.system-audit-score", size: "sm" },
    { ...base, id: "admin-ovw-alerts", widgetId: "kpi.admin.system-notifications", size: "sm" },

    { ...base, id: "admin-ovw-branch-hier", widgetId: "table.admin.branch-hierarchy", size: "xl" },
    { ...base, id: "admin-ovw-approval-matrix", widgetId: "list.admin.approval-matrix", size: "md" },

    { ...base, id: "admin-ovw-pending-table", widgetId: "table.admin.pending-approvals", size: "xl" },
    { ...base, id: "admin-ovw-doc-control", widgetId: "chart.admin.document-control", size: "md" },

    { ...base, id: "admin-ovw-ai", widgetId: "ai.admin.governance-intelligence", size: "full" },
  ],

  /** CRM Management Overview layout */
  "crm-overview": [
    { ...base, id: "crm-ovw-leads", widgetId: "kpi.crm.total-leads", size: "sm" },
    { ...base, id: "crm-ovw-hot-leads", widgetId: "kpi.crm.hot-leads", size: "sm" },
    { ...base, id: "crm-ovw-pipeline-val", widgetId: "kpi.crm.pipeline-value", size: "sm" },
    { ...base, id: "crm-ovw-weighted-pipe", widgetId: "kpi.crm.weighted-pipeline", size: "sm" },
    { ...base, id: "crm-ovw-win-rate", widgetId: "kpi.crm.win-rate", size: "sm" },
    { ...base, id: "crm-ovw-accounts", widgetId: "kpi.crm.active-accounts", size: "sm" },
    { ...base, id: "crm-ovw-health", widgetId: "kpi.crm.account-health", size: "sm" },
    { ...base, id: "crm-ovw-tickets", widgetId: "kpi.crm.open-tickets", size: "sm" },
    { ...base, id: "crm-ovw-sla", widgetId: "kpi.crm.sla-compliance", size: "sm" },
    { ...base, id: "crm-ovw-csat", widgetId: "kpi.crm.csat-score", size: "sm" },

    { ...base, id: "crm-ovw-funnel", widgetId: "chart.crm.pipeline-funnel", size: "xl" },
    { ...base, id: "crm-ovw-sources", widgetId: "chart.crm.lead-source", size: "md" },

    { ...base, id: "crm-ovw-forecast", widgetId: "chart.crm.sales-forecast", size: "xl" },
    { ...base, id: "crm-ovw-critical-acc", widgetId: "table.crm.critical-accounts", size: "md" },

    { ...base, id: "crm-ovw-top-opps", widgetId: "table.crm.top-opportunities", size: "full" },
  ],

  "ri-overview": [
    // Tier 1: 9 KPI cards
    { ...base, id: "ri-ovw-submodules", widgetId: "kpi.ri.active-submodules", size: "sm" },
    { ...base, id: "ri-ovw-readiness", widgetId: "kpi.ri.composite-readiness", size: "sm" },
    { ...base, id: "ri-ovw-workflows", widgetId: "kpi.ri.active-workflows", size: "sm" },
    { ...base, id: "ri-ovw-velocity", widgetId: "kpi.ri.gate-adherence", size: "sm" },
    { ...base, id: "ri-ovw-patents", widgetId: "kpi.ri.ip-patents", size: "sm" },
    { ...base, id: "ri-ovw-simulations", widgetId: "kpi.ri.cae-simulations", size: "sm" },
    { ...base, id: "ri-ovw-trl", widgetId: "kpi.ri.trl-velocity", size: "sm" },
    { ...base, id: "ri-ovw-zero-defect", widgetId: "kpi.ri.zero-defect-rate", size: "sm" },
    { ...base, id: "ri-ovw-digital-twin", widgetId: "kpi.ri.digital-twin-sync", size: "sm" },

    // Tier 2: Innovation Velocity & IP Trend (2 of 3) + Stage Gates Funnel (1 of 3)
    { ...base, id: "ri-ovw-composed-trend", widgetId: "chart.ri.composed-trend", size: "xl" },
    { ...base, id: "ri-ovw-funnel", widgetId: "chart.ri.funnel", size: "md" },

    // Tier 3: Technology Mix (1 of 3) + Prototype & CAE Scale Curve (2 of 3)
    { ...base, id: "ri-ovw-tech-mix", widgetId: "list.ri.tech-mix", size: "md" },
    { ...base, id: "ri-ovw-velocity-curve", widgetId: "chart.ri.velocity-curve", size: "xl" },

    // Tier 4: Operations Ledger (2 of 3) + Alerts & Forecast (1 of 3)
    { ...base, id: "ri-ovw-ops-ledger", widgetId: "table.ri.operations-ledger", size: "xl" },
    { ...base, id: "ri-ovw-alerts", widgetId: "insight.ri-alerts", size: "md" },

    // Tier 5: AI Intelligence Center (Full Width)
    { ...base, id: "ri-ovw-ai", widgetId: "ai.ri.intelligence", size: "full" },
  ],
  "procurement-overview": [],
  "bd-overview": [
    { ...base, id: "bd-ovw-pipeline-val", widgetId: "kpi.bd.pipeline-value", size: "sm" },
    { ...base, id: "bd-ovw-active-deals", widgetId: "kpi.bd.active-deals", size: "sm" },
    { ...base, id: "bd-ovw-closed-ytd", widgetId: "kpi.bd.closed-ytd", size: "sm" },
    { ...base, id: "bd-ovw-win-rate", widgetId: "kpi.bd.win-rate", size: "sm" },
    { ...base, id: "bd-ovw-partner-eco", widgetId: "kpi.bd.partner-ecosystem", size: "sm" },
    { ...base, id: "bd-ovw-expansion", widgetId: "kpi.bd.expansion-markets", size: "sm" },
    { ...base, id: "bd-ovw-avg-deal", widgetId: "kpi.bd.avg-deal-size", size: "sm" },
    { ...base, id: "bd-ovw-open-rfps", widgetId: "kpi.bd.open-rfps", size: "sm" },
    { ...base, id: "bd-ovw-deal-velocity", widgetId: "kpi.bd.deal-velocity", size: "sm" },

    // Row 2: Pipeline Trend (spans 2 of 3) + Deal Funnel (1 of 3)
    { ...base, id: "bd-ovw-pipeline-trend", widgetId: "chart.bd.pipeline-trend", size: "xl" },
    { ...base, id: "bd-ovw-funnel", widgetId: "list.bd.deal-funnel", size: "md" },

    // Row 3: Partner Distribution (1 of 3) + Revenue Scaling Curve (spans 2 of 3)
    { ...base, id: "bd-ovw-partner-dist", widgetId: "list.bd.partner-distribution", size: "md" },
    { ...base, id: "bd-ovw-revenue-curve", widgetId: "chart.bd.revenue-curve", size: "xl" },

    // Row 4: Commercial Operations Ledger (spans 2 of 3) + Market Alerts & Forecast (1 of 3)
    { ...base, id: "bd-ovw-ops-ledger", widgetId: "table.bd.operations-ledger", size: "xl" },
    { ...base, id: "bd-ovw-alerts", widgetId: "insight.bd-alerts", size: "md" },

    // Row 5: AI Intelligence Center (Full Width)
    { ...base, id: "bd-ovw-ai", widgetId: "ai.bd-intelligence", size: "full" },
  ],
  "pm-overview": [
    { ...base, id: "pm-ovw-total-projects", widgetId: "kpi.pm.total-projects", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "pm-ovw-on-schedule", widgetId: "kpi.pm.on-schedule", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "pm-ovw-at-risk", widgetId: "kpi.pm.at-risk", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "pm-ovw-delayed", widgetId: "kpi.pm.delayed", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "pm-ovw-budget-util", widgetId: "kpi.pm.budget-utilization", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "pm-ovw-resources", widgetId: "kpi.pm.resources-allocated", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },

    { ...base, id: "pm-ovw-execution", widgetId: "chart.pm.execution-status", size: "lg", spanOverride: { xl: 30, lg: 3, md: 6 } },
    { ...base, id: "pm-ovw-utilization", widgetId: "chart.pm.resource-utilization", size: "lg", spanOverride: { xl: 30, lg: 3, md: 6 } },

    { ...base, id: "pm-ovw-risks", widgetId: "table.pm.top-risks", size: "lg", spanOverride: { xl: 30, lg: 3, md: 6 } },
    { ...base, id: "pm-ovw-milestones", widgetId: "table.pm.milestones", size: "lg", spanOverride: { xl: 30, lg: 3, md: 6 } },

    { ...base, id: "pm-ovw-ai", widgetId: "ai.pm.planning-insights", size: "full" },
  ],
  "asset-overview": [
    { ...base, id: "ast-kpi-portfolio", widgetId: "kpi.asset.total-portfolio", size: "sm" },
    { ...base, id: "ast-kpi-active", widgetId: "kpi.asset.active-assets", size: "sm" },
    { ...base, id: "ast-kpi-nbv", widgetId: "kpi.asset.nbv", size: "sm" },
    { ...base, id: "ast-kpi-depreciation", widgetId: "kpi.asset.depreciation", size: "sm" },
    { ...base, id: "ast-kpi-equipment", widgetId: "kpi.asset.equipment-oee", size: "sm" },
    { ...base, id: "ast-kpi-tools", widgetId: "kpi.asset.tool-availability", size: "sm" },
    { ...base, id: "ast-kpi-calibration", widgetId: "kpi.asset.calibration-rate", size: "sm" },
    { ...base, id: "ast-kpi-maintenance", widgetId: "kpi.asset.maintenance-wos", size: "sm" },
    { ...base, id: "ast-kpi-pm", widgetId: "kpi.asset.pm-compliance", size: "sm" },

    { ...base, id: "ast-trend", widgetId: "chart.asset.portfolio-trend", size: "xl" },
    { ...base, id: "ast-quick-status", widgetId: "list.asset.submodule-status", size: "md" },

    { ...base, id: "ast-equipment-health", widgetId: "list.asset.equipment-health", size: "md" },
    { ...base, id: "ast-depr-curve", widgetId: "chart.asset.depreciation-curve", size: "xl" },

    { ...base, id: "ast-ops-ledger", widgetId: "table.asset.submodules-ledger", size: "xl" },
    { ...base, id: "ast-alerts", widgetId: "insight.asset-alerts", size: "md" },

    { ...base, id: "ast-ai", widgetId: "ai.asset-intelligence", size: "full" },
  ],
};

/** Display metadata for each widget surface. */
export const PAGE_META: Record<WidgetPageId, { label: string; route: string }> = {
  dashboard: { label: "Dashboard", route: "/" },
  "finance-overview": { label: "Finance Overview", route: "/management/finance/overview" },
  "finance-payables": { label: "Accounts Payable", route: "/management/finance/payables" },
  "finance-receivables": { label: "Accounts Receivable", route: "/management/finance/receivables" },
  "finance-cash-bank": { label: "Cash & Bank", route: "/management/finance/cash-bank" },
  "finance-budgeting": { label: "Budgeting", route: "/management/finance/budgeting" },
  "finance-cost-centers": { label: "Cost Centers", route: "/management/finance/cost-centers" },
  "finance-consolidation": { label: "Consolidation", route: "/management/finance/consolidation" },
  "finance-profitability": { label: "Profitability", route: "/management/finance/profitability" },
  "finance-tax": { label: "Tax Management", route: "/management/finance/tax" },
  "finance-reports": { label: "Financial Reports", route: "/management/finance/reports" },
  "finance-assets": { label: "Fixed Assets", route: "/management/finance/assets" },
  "finance-audit": { label: "Audit Trail", route: "/management/finance/audit" },
  "crm-overview": { label: "CRM Overview", route: "/management/crm-management/overview" },
  "ri-overview": { label: "R&I Overview", route: "/development/research-innovation/overview" },
  "pd-overview": { label: "Product Development Overview", route: "/development/product-development/overview" },
  "md-overview": { label: "Manufacturing Development Overview", route: "/development/manufacturing-development/overview" },
  "hrm-overview": { label: "HRM Overview", route: "/management/hrm-management/overview" },
  "admin-overview": { label: "Administration Overview", route: "/management/administration-management/overview" },
  "procurement-overview": { label: "Procurement Overview", route: "/management/procurement-management/overview" },
  "bd-overview": { label: "Business Development Overview", route: "/development/business-development/overview" },
  "pm-overview": { label: "Project Management Overview", route: "/management/project-management/overview" },
  "asset-overview": { label: "Asset Management Overview", route: "/management/asset-management/overview" },
};

/**
 * Locations offered in the Widget Settings dialog's "Choose Display Location".
 * The current page is added dynamically when it isn't one of these.
 */
export const PLACEABLE_PAGES: WidgetPageId[] = [
  "dashboard",
  "finance-overview",
  "crm-overview",
  "hrm-overview",
  "admin-overview",
  "procurement-overview",
  "bd-overview",
  "pd-overview",
  "md-overview",
  "ri-overview",
  "pm-overview",
  "asset-overview",
];

/** Deep-copy a default layout so callers can never mutate the shared constant. */
export function getDefaultLayout(pageId: WidgetPageId): WidgetInstance[] {
  const layout = DEFAULT_LAYOUTS[pageId] ?? [];
  return layout.map((i) => ({
    ...i,
    spanOverride: i.spanOverride && { ...i.spanOverride },
  }));
}
