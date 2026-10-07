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
  "quality-overview": [
    // 6 Quality KPIs
    { ...base, id: "qm-kpi-fpy", widgetId: "kpi.quality.fpy", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "qm-kpi-defect-ppm", widgetId: "kpi.quality.defect-ppm", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "qm-kpi-iqc", widgetId: "kpi.quality.iqc-clearance", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "qm-kpi-open-ncrs", widgetId: "kpi.quality.open-ncrs", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "qm-kpi-capa-rate", widgetId: "kpi.quality.capa-rate", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },
    { ...base, id: "qm-kpi-audit-index", widgetId: "kpi.quality.audit-index", size: "sm", spanOverride: { xl: 10, lg: 1, md: 2 } },

    // Closed-Loop Quality Lifecycle Pipeline (Full Width)
    { ...base, id: "qm-panel-lifecycle", widgetId: "pipeline.quality.lifecycle", size: "full" },

    // Charts: Trend (50%) + Stage Yield Breakdown (50%)
    { ...base, id: "qm-panel-trend", widgetId: "chart.quality.fpy-trend", size: "lg", spanOverride: { xl: 30, lg: 3, md: 6 } },
    { ...base, id: "qm-panel-stage-yield", widgetId: "chart.quality.stage-yield", size: "lg", spanOverride: { xl: 30, lg: 3, md: 6 } },

    // Open NCRs & Containment Register (Full Width)
    { ...base, id: "qm-panel-incidents", widgetId: "table.quality.incidents", size: "full" },

    // AI Quality Intelligence (Full Width)
    { ...base, id: "qm-panel-ai", widgetId: "ai.quality.intelligence", size: "full" },
  ],
  "sales-overview": [
    // 9 Sales Executive KPIs
    { ...base, id: "sales-kpi-revenue", widgetId: "kpi.sales.total-revenue", size: "sm" },
    { ...base, id: "sales-kpi-pipeline", widgetId: "kpi.sales.pipeline-value", size: "sm" },
    { ...base, id: "sales-kpi-orders", widgetId: "kpi.sales.active-orders", size: "sm" },
    { ...base, id: "sales-kpi-margin", widgetId: "kpi.sales.gross-margin", size: "sm" },
    { ...base, id: "sales-kpi-forecast", widgetId: "kpi.sales.forecast-accuracy", size: "sm" },
    { ...base, id: "sales-kpi-new-cust", widgetId: "kpi.sales.new-customers", size: "sm" },
    { ...base, id: "sales-kpi-partners", widgetId: "kpi.sales.channel-partners", size: "sm" },
    { ...base, id: "sales-kpi-territories", widgetId: "kpi.sales.territories-governed", size: "sm" },
    { ...base, id: "sales-kpi-deal-size", widgetId: "kpi.sales.avg-deal-size", size: "sm" },

    // 10 Sales Submodules Operations Hub (Full Width)
    { ...base, id: "sales-hub-modules", widgetId: "grid.sales.submodules-hub", size: "full" },

    // Revenue Trend (spans 2 of 3) + Product Revenue Donut (1 of 3)
    { ...base, id: "sales-trend", widgetId: "chart.sales.revenue-trend", size: "xl" },
    { ...base, id: "sales-product-donut", widgetId: "chart.sales.product-distribution", size: "md" },

    // Pipeline Funnel (1 of 3) + Territory Quota Performance (spans 2 of 3)
    { ...base, id: "sales-funnel", widgetId: "chart.sales.pipeline-funnel", size: "md" },
    { ...base, id: "sales-territory-table", widgetId: "table.sales.territory-performance", size: "xl" },

    // Recent Confirmed Orders (Full Width)
    { ...base, id: "sales-recent-orders", widgetId: "table.sales.recent-orders", size: "full" },

    // AI Commercial Intelligence & Margin Copilot (Full Width)
    { ...base, id: "sales-ai", widgetId: "ai.sales.commercial-intelligence", size: "full" },
  ],
  "marketing-overview": [
    // 10 Marketing Executive KPIs
    { ...base, id: "mkt-kpi-campaigns", widgetId: "kpi.marketing.active-campaigns", size: "sm" },
    { ...base, id: "mkt-kpi-reach", widgetId: "kpi.marketing.campaign-reach", size: "sm" },
    { ...base, id: "mkt-kpi-visits", widgetId: "kpi.marketing.website-visits", size: "sm" },
    { ...base, id: "mkt-kpi-leads", widgetId: "kpi.marketing.leads-generated", size: "sm" },
    { ...base, id: "mkt-kpi-mql", widgetId: "kpi.marketing.mql", size: "sm" },
    { ...base, id: "mkt-kpi-sql", widgetId: "kpi.marketing.sql", size: "sm" },
    { ...base, id: "mkt-kpi-opps", widgetId: "kpi.marketing.pipeline-opportunities", size: "sm" },
    { ...base, id: "mkt-kpi-revenue", widgetId: "kpi.marketing.campaign-revenue", size: "sm" },
    { ...base, id: "mkt-kpi-roi", widgetId: "kpi.marketing.roi", size: "sm" },
    { ...base, id: "mkt-kpi-cpl", widgetId: "kpi.marketing.cost-per-lead", size: "sm" },

    // 10 Operations Submodules Hub (Full Width)
    { ...base, id: "mkt-hub-modules", widgetId: "grid.marketing.submodules-hub", size: "full" },

    // Channel Performance (spans 2 of 3) + Campaign Funnel (1 of 3)
    { ...base, id: "mkt-channels", widgetId: "table.marketing.channel-performance", size: "xl" },
    { ...base, id: "mkt-funnel", widgetId: "chart.marketing.campaign-funnel", size: "md" },

    // Leads by Source / Geography (1 of 3) + Budget vs Actual (1 of 3) + Recent Activities (1 of 3)
    { ...base, id: "mkt-leads-source", widgetId: "chart.marketing.leads-by-source", size: "md" },
    { ...base, id: "mkt-budget-control", widgetId: "panel.marketing.budget-vs-actual", size: "md" },
    { ...base, id: "mkt-recent-activities", widgetId: "table.marketing.recent-activities", size: "md" },

    // Active Campaigns Master Register (Full Width)
    { ...base, id: "mkt-campaigns-table", widgetId: "table.marketing.active-campaigns", size: "full" },

    // AI Marketing Intelligence (Full Width)
    { ...base, id: "mkt-ai-copilot", widgetId: "ai.marketing.intelligence", size: "full" },
  ],
  "supply-chain-overview": [
    // 9 Supply Chain & Demand Planning KPIs
    { ...base, id: "scm-kpi-demand", widgetId: "kpi.supply-chain.forecast-demand", size: "sm" },
    { ...base, id: "scm-kpi-accuracy", widgetId: "kpi.supply-chain.forecast-accuracy", size: "sm" },
    { ...base, id: "scm-kpi-value", widgetId: "kpi.supply-chain.forecast-value", size: "sm" },
    { ...base, id: "scm-kpi-signals", widgetId: "kpi.supply-chain.demand-signals", size: "sm" },
    { ...base, id: "scm-kpi-adjustments", widgetId: "kpi.supply-chain.pending-adjustments", size: "sm" },
    { ...base, id: "scm-kpi-orders", widgetId: "kpi.supply-chain.open-sales-orders", size: "sm" },
    { ...base, id: "scm-kpi-stockouts", widgetId: "kpi.supply-chain.stockout-risk", size: "sm" },
    { ...base, id: "scm-kpi-service", widgetId: "kpi.supply-chain.service-level", size: "sm" },
    { ...base, id: "scm-kpi-inventory", widgetId: "kpi.supply-chain.inventory-impact", size: "sm" },

    // Middle tier: Forecast vs Actual Trend (2/3) + Accuracy Donut (1/3)
    { ...base, id: "scm-trend", widgetId: "chart.supply-chain.forecast-trend", size: "xl" },
    { ...base, id: "scm-accuracy", widgetId: "chart.supply-chain.accuracy-donut", size: "md" },

    // Second tier: Demand Drivers (1/3) + Recent Adjustments Table (2/3)
    { ...base, id: "scm-drivers", widgetId: "list.supply-chain.demand-drivers", size: "md" },
    { ...base, id: "scm-adjustments", widgetId: "table.supply-chain.recent-adjustments", size: "xl" },

    // Third tier: Upcoming Actions (1/3) + Consensus Pipeline (2/3)
    { ...base, id: "scm-actions", widgetId: "list.supply-chain.upcoming-actions", size: "md" },
    { ...base, id: "scm-consensus", widgetId: "table.supply-chain.consensus-pipeline", size: "xl" },
  ],

  /**
   * Risk Management Overview — matches screenshot layout:
   * 6 top KPI cards (10*6=60), 3 visual matrix/analytics cards (20*3=60), 3 operational tables (20*3=60), 1 AI Command Center (60).
   * Fully covers 60 columns on desktop with ZERO blank space.
   */
  "risk-overview": [
    { ...base, id: "risk-kpi-total", widgetId: "kpi.risk.total-risks", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "risk-kpi-critical", widgetId: "kpi.risk.critical-risks", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "risk-kpi-high", widgetId: "kpi.risk.high-risks", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "risk-kpi-medium", widgetId: "kpi.risk.medium-risks", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "risk-kpi-low", widgetId: "kpi.risk.low-risks", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "risk-kpi-overdue", widgetId: "kpi.risk.overdue-actions", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },

    // Row 2: Visual Risk Matrix & Analytics (3 across = 20 + 20 + 20 = 60)
    { ...base, id: "risk-panel-heat-map", widgetId: "panel.risk.heat-map", size: "md" },
    { ...base, id: "risk-panel-category", widgetId: "panel.risk.category-distribution", size: "md" },
    { ...base, id: "risk-panel-trend", widgetId: "panel.risk.trend", size: "md" },

    // Row 3: Operational KRI, Top Risks, and Mitigation Actions (3 across = 20 + 20 + 20 = 60)
    { ...base, id: "risk-panel-kri", widgetId: "panel.risk.kri-list", size: "md" },
    { ...base, id: "risk-panel-top-risks", widgetId: "panel.risk.top-risks", size: "md" },
    { ...base, id: "risk-panel-actions", widgetId: "panel.risk.treatment-actions", size: "md" },

    // Row 4: AI Risk Intelligence Command Center (Full Width = 60)
    { ...base, id: "risk-panel-insights", widgetId: "panel.risk.quick-insights", size: "full" },
  ],

  "risk-reports": [
    { ...base, id: "risk-rep-total", widgetId: "kpi.risk.total-risks", size: "sm", spanOverride: { xl: 15, lg: 3, md: 3 } },
    { ...base, id: "risk-rep-critical", widgetId: "kpi.risk.critical-risks", size: "sm", spanOverride: { xl: 15, lg: 3, md: 3 } },
    { ...base, id: "risk-rep-residual", widgetId: "kpi.risk.residual-exposure", size: "sm", spanOverride: { xl: 15, lg: 3, md: 3 } },
    { ...base, id: "risk-rep-overdue", widgetId: "kpi.risk.overdue-actions", size: "sm", spanOverride: { xl: 15, lg: 3, md: 3 } },
    { ...base, id: "risk-rep-trend", widgetId: "panel.risk.trend", size: "lg" },
    { ...base, id: "risk-rep-category", widgetId: "panel.risk.category-distribution", size: "lg" },
    { ...base, id: "risk-rep-top", widgetId: "panel.risk.top-risks", size: "lg" },
    { ...base, id: "risk-rep-kri", widgetId: "panel.risk.kri-list", size: "lg" },
  ],

  /**
   * Compliance Management Overview & Reports
   * 6 top KPI cards (10*6=60), 3 domain/trend cards (20*3=60), 2 obligation registers (30*2=60), 1 AI Command Center (60).
   * Fully covers 60 columns on desktop with ZERO blank space.
   */
  "compliance-overview": [
    { ...base, id: "comp-kpi-overall", widgetId: "kpi.compliance.overall-score", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comp-kpi-licenses", widgetId: "kpi.compliance.active-licenses", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comp-kpi-iso", widgetId: "kpi.compliance.iso-readiness", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comp-kpi-obligations", widgetId: "kpi.compliance.obligations-fulfilled", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comp-kpi-filings", widgetId: "kpi.compliance.filings-on-time", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comp-kpi-gaps", widgetId: "kpi.compliance.open-gaps", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },

    // Row 2: Health Trend, Domain Breakdown & Deadlines (3 across = 20 + 20 + 20 = 60)
    { ...base, id: "comp-panel-trend", widgetId: "panel.compliance.health-trend", size: "md" },
    { ...base, id: "comp-panel-domain", widgetId: "panel.compliance.domain-distribution", size: "md" },
    { ...base, id: "comp-panel-filings", widgetId: "panel.compliance.filings-deadlines", size: "md" },

    // Row 3: Key Obligations Register (1/2) & Remediation Tracker (1/2) = 30 + 30 = 60
    { ...base, id: "comp-panel-obligations", widgetId: "panel.compliance.obligations-matrix", size: "lg" },
    { ...base, id: "comp-panel-remediation", widgetId: "panel.compliance.remediation-actions", size: "lg" },

    // Row 4: AI Regulatory Intelligence Command Center (Full Width = 60)
    { ...base, id: "comp-panel-ai", widgetId: "panel.compliance.ai-intelligence", size: "full" },
  ],

  "compliance-reports": [
    { ...base, id: "comp-rep-score", widgetId: "kpi.compliance.overall-score", size: "sm", spanOverride: { xl: 15, lg: 3, md: 3 } },
    { ...base, id: "comp-rep-filings", widgetId: "kpi.compliance.filings-on-time", size: "sm", spanOverride: { xl: 15, lg: 3, md: 3 } },
    { ...base, id: "comp-rep-capas", widgetId: "kpi.compliance.audit-capas", size: "sm", spanOverride: { xl: 15, lg: 3, md: 3 } },
    { ...base, id: "comp-rep-updates", widgetId: "kpi.compliance.legal-updates", size: "sm", spanOverride: { xl: 15, lg: 3, md: 3 } },
    { ...base, id: "comp-rep-trend", widgetId: "panel.compliance.health-trend", size: "lg" },
    { ...base, id: "comp-rep-domain", widgetId: "panel.compliance.domain-distribution", size: "lg" },
  ],

  "knowledge-overview": [
    // Row 1: 5 Circular Icon Metric Widgets (Matching Finance Overview 5-col grid)
    { ...base, id: "knw-kpi-total-assets", widgetId: "kpi.knowledge.total-assets", size: "sm" },
    { ...base, id: "knw-kpi-active-sops", widgetId: "kpi.knowledge.active-sops", size: "sm" },
    { ...base, id: "knw-kpi-doc-vault", widgetId: "kpi.knowledge.document-vault", size: "sm" },
    { ...base, id: "knw-kpi-best-practices", widgetId: "kpi.knowledge.best-practices", size: "sm" },
    { ...base, id: "knw-kpi-templates", widgetId: "kpi.knowledge.controlled-templates", size: "sm" },

    // Row 2: 5 Circular Icon Metric Widgets (Matching Finance Overview 5-col grid)
    { ...base, id: "knw-kpi-wikis", widgetId: "kpi.knowledge.published-wikis", size: "sm" },
    { ...base, id: "knw-kpi-tech-specs", widgetId: "kpi.knowledge.tech-specs", size: "sm" },
    { ...base, id: "knw-kpi-pending-reviews", widgetId: "kpi.knowledge.pending-sop-reviews", size: "sm" },
    { ...base, id: "knw-kpi-training", widgetId: "kpi.knowledge.training-compliance", size: "sm" },
    { ...base, id: "knw-kpi-lessons", widgetId: "kpi.knowledge.lessons-learned", size: "sm" },

    // Dual Side-by-Side Analytical Panels
    { ...base, id: "knw-panel-growth-trend", widgetId: "chart.knowledge.growth-trend", size: "xl" },
    { ...base, id: "knw-panel-health-summary", widgetId: "list.knowledge.health-summary", size: "md" },

    // Knowledge Operations Ledger + Alerts
    { ...base, id: "knw-panel-ops-ledger", widgetId: "table.knowledge.operations-ledger", size: "xl" },
    { ...base, id: "knw-panel-alerts", widgetId: "insight.knowledge.audit-alerts", size: "md" },

    // AI Knowledge Intelligence Center
    { ...base, id: "knw-panel-ai", widgetId: "ai.knowledge.intelligence", size: "full" },
  ],

  "communication-overview": [
    // Row 1: 6 Circular Icon Metric Widgets (Matching screenshot 6-col grid: 10/60 each)
    { ...base, id: "comm-kpi-total-emails", widgetId: "kpi.communication.total-emails", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comm-kpi-messages", widgetId: "kpi.communication.realtime-messages", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comm-kpi-meetings", widgetId: "kpi.communication.video-meetings", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comm-kpi-notifications", widgetId: "kpi.communication.notifications", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comm-kpi-announcements", widgetId: "kpi.communication.announcements", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },
    { ...base, id: "comm-kpi-response-sla", widgetId: "kpi.communication.response-sla", size: "sm", spanOverride: { xl: 10, lg: 2, md: 3 } },

    // Row 2: Volume Trends Area Chart (2/3) + Domain Donut Distribution (1/3)
    { ...base, id: "comm-panel-volume-trend", widgetId: "chart.communication.volume-trend", size: "xl" },
    { ...base, id: "comm-panel-domain-dist", widgetId: "chart.communication.domain-distribution", size: "md" },

    // Row 3: AI Assistant (1/3) + SLA Performance Bar Chart (2/3)
    { ...base, id: "comm-panel-ai", widgetId: "ai.communication.assistant", size: "md" },
    { ...base, id: "comm-panel-sla-perf", widgetId: "chart.communication.sla-performance", size: "xl" },

    // Row 4: Operations Ledger (Full Width)
    { ...base, id: "comm-panel-ops-ledger", widgetId: "table.communication.operations-ledger", size: "full" },

    // Row 5: Infrastructure & Gateways
    { ...base, id: "comm-panel-gateways", widgetId: "insight.communication.channel-alerts", size: "full" },
  ],

  "sustainability-overview": [
    // Tier 1: 10 KPI Widgets (2 neat rows of 5 cards, 12/60 each = 60 cols)
    { ...base, id: "sust-kpi-ghg", widgetId: "kpi.sustainability.ghg-emissions", size: "sm" },
    { ...base, id: "sust-kpi-esg-scorecard", widgetId: "kpi.sustainability.esg-scorecard", size: "sm", pinned: true },
    { ...base, id: "sust-kpi-energy", widgetId: "kpi.sustainability.energy-consumption", size: "sm" },
    { ...base, id: "sust-kpi-water", widgetId: "kpi.sustainability.water-consumption", size: "sm" },
    { ...base, id: "sust-kpi-waste", widgetId: "kpi.sustainability.waste-generated", size: "sm" },

    { ...base, id: "sust-kpi-recycling", widgetId: "kpi.sustainability.recycling-rate", size: "sm" },
    { ...base, id: "sust-kpi-carbon-intensity", widgetId: "kpi.sustainability.carbon-intensity", size: "sm" },
    { ...base, id: "sust-kpi-compliance", widgetId: "kpi.sustainability.environmental-compliance", size: "sm" },
    { ...base, id: "sust-kpi-initiatives", widgetId: "kpi.sustainability.esg-initiatives", size: "sm" },
    { ...base, id: "sust-kpi-reporting", widgetId: "kpi.sustainability.statutory-reporting", size: "sm" },

    // Tier 2: Decarbonization Trend (40 cols) + Health Summary (20 cols) = 60 cols
    { ...base, id: "sust-panel-decarbonization", widgetId: "panel.sustainability.decarbonization-trend", size: "xl" },
    { ...base, id: "sust-panel-health-summary", widgetId: "panel.sustainability.health-summary", size: "md" },

    // Tier 3: Permits & Filings (20 cols) + Facility Matrix (40 cols) = 60 cols
    { ...base, id: "sust-panel-permits", widgetId: "panel.sustainability.compliance-permits", size: "md" },
    { ...base, id: "sust-panel-facility-matrix", widgetId: "panel.sustainability.facility-matrix", size: "xl" },

    // Tier 4: ESG Action Ledger (40 cols) + Environmental Alerts & Forecast (20 cols) = 60 cols
    { ...base, id: "sust-panel-ledger", widgetId: "panel.sustainability.initiatives-ledger", size: "xl" },
    { ...base, id: "sust-panel-alerts", widgetId: "panel.sustainability.system-alerts", size: "md" },

    // Tier 5: Full-Width AI Decarbonization Command Center (60 cols)
    { ...base, id: "sust-panel-ai", widgetId: "panel.sustainability.ai-copilot", size: "full" },
  ],
  "sustainability-esg": [],
  "sustainability-carbon-footprint": [],
  "sustainability-energy-monitoring": [],
  "sustainability-water-management": [],
  "sustainability-waste-management": [],
  "sustainability-recycling-management": [],
  "sustainability-environmental-compliance": [],
  "sustainability-reporting": [],

  "security-overview": [
    // Row 1: 5 KPI Widgets (12/60 each)
    { ...base, id: "sec-kpi-total-identities", widgetId: "kpi.security.total-identities", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },
    { ...base, id: "sec-kpi-active-users", widgetId: "kpi.security.active-users", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },
    { ...base, id: "sec-kpi-protected-assets", widgetId: "kpi.security.protected-assets", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },
    { ...base, id: "sec-kpi-cctv-online", widgetId: "kpi.security.cctv-online", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },
    { ...base, id: "sec-kpi-open-incidents", widgetId: "kpi.security.open-incidents", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },

    // Row 2: 5 KPI Widgets
    { ...base, id: "sec-kpi-critical-vulns", widgetId: "kpi.security.critical-vulnerabilities", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },
    { ...base, id: "sec-kpi-mfa-adoption", widgetId: "kpi.security.mfa-adoption", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },
    { ...base, id: "sec-kpi-patch-compliance", widgetId: "kpi.security.patch-compliance", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },
    { ...base, id: "sec-kpi-sod-conflicts", widgetId: "kpi.security.sod-conflicts", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },
    { ...base, id: "sec-kpi-information-assets", widgetId: "kpi.security.information-assets", size: "sm", spanOverride: { xl: 12, lg: 2, md: 3 } },

    // Row 3: Threat Trend & Incident Status
    { ...base, id: "sec-panel-threat-trend", widgetId: "panel.security.threat-trend", size: "xl" },
    { ...base, id: "sec-panel-incident-status", widgetId: "panel.security.incident-status", size: "md" },

    // Row 4: Risk Heatmap & Facilities Posture
    { ...base, id: "sec-panel-facility-matrix", widgetId: "panel.security.facility-matrix", size: "xl" },
    { ...base, id: "sec-panel-risk-heatmap", widgetId: "panel.security.risk-heatmap", size: "md" },

    // Row 5: Compliance Frameworks & AI Intelligence
    { ...base, id: "sec-panel-compliance-status", widgetId: "panel.security.compliance-status", size: "md" },
    { ...base, id: "sec-panel-ai-intelligence", widgetId: "panel.security.ai-intelligence", size: "xl" },
  ],
  "security-access-control": [],
  "security-identity-management": [],
  "security-cybersecurity": [],
  "security-information-security": [],
  "security-physical-security": [],
  "security-reports": [],

  "bi-overview": [
    // Tier 1: 10 Strategic KPI cards (2 rows of 5 cards, 12/60 each = 60 cols)
    { ...base, id: "bi-kpi-rev", widgetId: "bi.kpi.total-revenue", size: "sm" },
    { ...base, id: "bi-kpi-cash", widgetId: "bi.kpi.cash-balance", size: "sm" },
    { ...base, id: "bi-kpi-margin", widgetId: "bi.kpi.gross-margin", size: "sm" },
    { ...base, id: "bi-kpi-ebitda", widgetId: "bi.kpi.ebitda-margin", size: "sm" },
    { ...base, id: "bi-kpi-pipe", widgetId: "bi.kpi.sales-pipeline", size: "sm" },

    { ...base, id: "bi-kpi-cust", widgetId: "bi.kpi.active-customers", size: "sm" },
    { ...base, id: "bi-kpi-oee", widgetId: "bi.kpi.production-oee", size: "sm" },
    { ...base, id: "bi-kpi-sec", widgetId: "bi.kpi.open-incidents", size: "sm" },
    { ...base, id: "bi-kpi-risk", widgetId: "bi.kpi.critical-risks", size: "sm" },
    { ...base, id: "bi-kpi-pipeline-health", widgetId: "bi.kpi.data-pipeline-health", size: "sm" },

    // Tier 2: Revenue & Margin Progression (40 cols) + Product Mix Donut (20 cols) = 60 cols
    { ...base, id: "bi-panel-trend", widgetId: "bi.panel.revenue-profit-trend", size: "xl" },
    { ...base, id: "bi-panel-product", widgetId: "bi.panel.revenue-by-product", size: "md" },

    // Tier 3: Sales Conversion Funnel (20 cols) + Manufacturing & SCM Telemetry (40 cols) = 60 cols
    { ...base, id: "bi-panel-pipeline", widgetId: "bi.panel.sales-pipeline", size: "md" },
    { ...base, id: "bi-panel-mfg", widgetId: "bi.panel.manufacturing-performance", size: "xl" },

    // Tier 4: Strategic Operations & Executive Ledger (40 cols) + Executive Risk & Forecast (20 cols) = 60 cols
    { ...base, id: "bi-panel-actions", widgetId: "bi.panel.management-actions", size: "xl" },
    { ...base, id: "bi-panel-alerts", widgetId: "bi.panel.risk-heatmap", size: "md" },

    // Tier 5: Full-Width AI Executive Decision & Intelligence Command Center (60 cols)
    { ...base, id: "bi-panel-ai", widgetId: "bi.panel.ai-intelligence", size: "full" },
  ],
  "bi-reports": [],

  "strategy-overview": [
    // Tier 1: 10 Strategic KPI cards (2 rows of 5 cards, 12/60 each = 60 cols)
    { ...base, id: "strat-kpi-vm", widgetId: "strategy.kpi.vision-mission-version", size: "sm" },
    { ...base, id: "strat-kpi-themes", widgetId: "strategy.kpi.strategic-themes", size: "sm" },
    { ...base, id: "strat-kpi-obj", widgetId: "strategy.kpi.strategic-objectives", size: "sm" },
    { ...base, id: "strat-kpi-okrs", widgetId: "strategy.kpi.active-okrs", size: "sm" },
    { ...base, id: "strat-kpi-kpis", widgetId: "strategy.kpi.monitored-kpis", size: "sm" },

    { ...base, id: "strat-kpi-bsc", widgetId: "strategy.kpi.bsc-score", size: "sm" },
    { ...base, id: "strat-kpi-init", widgetId: "strategy.kpi.strategic-initiatives", size: "sm" },
    { ...base, id: "strat-kpi-invest", widgetId: "strategy.kpi.total-investment", size: "sm" },
    { ...base, id: "strat-kpi-benefits", widgetId: "strategy.kpi.expected-benefits", size: "sm" },
    { ...base, id: "strat-kpi-align", widgetId: "strategy.kpi.overall-alignment", size: "sm" },

    // Tier 2: Strategic Execution Alignment Chain (Full width = 60 cols)
    { ...base, id: "strat-panel-flow", widgetId: "strategy.panel.alignment-flow", size: "full" },

    // Tier 3: OKR Progress Trajectory (40 cols) + Perspective Performance (20 cols) = 60 cols
    { ...base, id: "strat-panel-traj", widgetId: "strategy.panel.progress-trajectory", size: "xl" },
    { ...base, id: "strat-panel-persp", widgetId: "strategy.panel.perspectives-performance", size: "md" },

    // Tier 4: Priority Initiatives Table (40 cols) + Portfolio Distribution Donut (20 cols) = 60 cols
    { ...base, id: "strat-panel-table", widgetId: "strategy.panel.initiatives-table", size: "xl" },
    { ...base, id: "strat-panel-port", widgetId: "strategy.panel.portfolio-health", size: "md" },

    // Tier 5: AI Strategic Intelligence Assistant (Full width = 60 cols)
    { ...base, id: "strat-panel-ai", widgetId: "strategy.panel.ai-assistant", size: "full" },
  ],
  "strategy-reports": [],
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
  "quality-overview": { label: "Quality Overview", route: "/management/quality-management/overview" },
  "sales-overview": { label: "Sales Overview", route: "/management/sales-management/overview" },
  "marketing-overview": { label: "Marketing Overview", route: "/management/marketing-management/overview" },
  "supply-chain-overview": { label: "Supply Chain Overview", route: "/management/supply-chain-management/overview" },
  "risk-overview": { label: "Risk Management Overview", route: "/management/risk-management/overview" },
  "risk-reports": { label: "Risk Management Reports", route: "/management/risk-management/reports" },
  "compliance-overview": { label: "Compliance Overview", route: "/management/risk-management/compliance-overview" },
  "compliance-reports": { label: "Compliance Reports", route: "/management/risk-management/compliance-reports" },
  "knowledge-overview": { label: "Knowledge Overview", route: "/management/knowledge-management/overview" },
  "communication-overview": { label: "Communication Overview", route: "/management/communication-management/overview" },
  "sustainability-overview": { label: "Sustainability Overview", route: "/management/sustainability-management/overview" },
  "sustainability-esg": { label: "ESG Strategy", route: "/management/sustainability-management/esg" },
  "sustainability-carbon-footprint": { label: "Carbon Footprint", route: "/management/sustainability-management/carbon-footprint" },
  "sustainability-energy-monitoring": { label: "Energy Monitoring", route: "/management/sustainability-management/energy-monitoring" },
  "sustainability-water-management": { label: "Water Management", route: "/management/sustainability-management/water-management" },
  "sustainability-waste-management": { label: "Waste Management", route: "/management/sustainability-management/waste-management" },
  "sustainability-recycling-management": { label: "Recycling Management", route: "/management/sustainability-management/recycling-management" },
  "sustainability-environmental-compliance": { label: "Environmental Compliance", route: "/management/sustainability-management/environmental-compliance" },
  "sustainability-reporting": { label: "Sustainability Reporting", route: "/management/sustainability-management/sustainability-reporting" },
  "security-overview": { label: "Security Overview", route: "/management/security-management/overview" },
  "security-access-control": { label: "Access Control", route: "/management/security-management/access-control" },
  "security-identity-management": { label: "Identity Management", route: "/management/security-management/identity-management" },
  "security-cybersecurity": { label: "Cybersecurity", route: "/management/security-management/cybersecurity" },
  "security-information-security": { label: "Information Security", route: "/management/security-management/information-security" },
  "security-physical-security": { label: "Physical Security", route: "/management/security-management/physical-security" },
  "security-visitor-management": { label: "Visitor Management", route: "/management/security-management/visitor-management" },
  "security-surveillance": { label: "Surveillance", route: "/management/security-management/surveillance" },
  "security-security-audit": { label: "Security Audit", route: "/management/security-management/security-audit" },
  "security-reports": { label: "Security Reports", route: "/management/security-management/reports" },
  "bi-overview": { label: "Business Intelligence Overview", route: "/management/business-intelligence/overview" },
  "bi-reports": { label: "Business Intelligence Reports", route: "/management/business-intelligence/reports" },
  "strategy-overview": { label: "Strategy Management Overview", route: "/management/strategy-management/overview" },
  "strategy-reports": { label: "Strategy Management Reports", route: "/management/strategy-management/reports" },
};

/**
 * Locations offered in the Widget Settings dialog's "Choose Display Location".
 * The current page is added dynamically when it isn't one of these.
 */
export const PLACEABLE_PAGES: WidgetPageId[] = [
  "dashboard",
  "strategy-overview",
  "strategy-reports",
  "bi-overview",
  "bi-reports",
  "finance-overview",
  "security-overview",
  "sustainability-overview",
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
  "quality-overview",
  "sales-overview",
  "marketing-overview",
  "supply-chain-overview",
  "risk-overview",
  "risk-reports",
  "compliance-overview",
  "compliance-reports",
  "knowledge-overview",
  "communication-overview",
];

/** Deep-copy a default layout so callers can never mutate the shared constant. */
export function getDefaultLayout(pageId: WidgetPageId): WidgetInstance[] {
  const layout = DEFAULT_LAYOUTS[pageId] ?? [];
  return layout.map((i) => ({
    ...i,
    spanOverride: i.spanOverride && { ...i.spanOverride },
  }));
}
