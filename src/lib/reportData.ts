import type { ReportRecord, ReportScheduleRecord, ReportShareRecord } from "@/services/types";

export const reports: ReportRecord[] = [
  { id: "REP-001", name: "Balance Sheet", description: "Statement of financial position detailing assets, liabilities, and equity.", category: "Financial Statements", type: "Standard", lastModified: "May 20, 2025 10:15 AM", lastModifiedBy: "Amit Mehra", isFavorite: true },
  { id: "REP-002", name: "Profit & Loss Statement", description: "Statement of income and expenses tracking profitability over period.", category: "Financial Statements", type: "Standard", lastModified: "May 20, 2025 10:15 AM", lastModifiedBy: "Amit Mehra", isFavorite: true },
  { id: "REP-003", name: "Cash Flow Statement", description: "Statement of cash inflows and outflows from operating, investing, and financing.", category: "Cash Flow Reports", type: "Standard", lastModified: "May 19, 2025 04:30 PM", lastModifiedBy: "Neha Sharma", isFavorite: true },
  { id: "REP-004", name: "Statement of Changes in Equity", description: "Equity movements for the period including retained earnings.", category: "Financial Statements", type: "Standard", lastModified: "May 19, 2025 04:30 PM", lastModifiedBy: "Neha Sharma", isFavorite: false },
  { id: "REP-005", name: "Trial Balance", description: "Summary sheet of all GL account balances for auditing purposes.", category: "Management Reports", type: "Standard", lastModified: "May 18, 2025 11:20 AM", lastModifiedBy: "Rohit Verma", isFavorite: false },
  { id: "REP-006", name: "Budget vs Actual Report", description: "Compares allocated department budgets vs real operational spending.", category: "Budget Reports", type: "Standard", lastModified: "May 18, 2025 11:20 AM", lastModifiedBy: "Rohit Verma", isFavorite: true },
  { id: "REP-007", name: "Departmental P&L", description: "Profit and loss breakdown divided by active business segments.", category: "Management Reports", type: "Custom", lastModified: "May 17, 2025 02:10 PM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-008", name: "Aging Summary", description: "Accounts Receivable and Accounts Payable aging report logs.", category: "Management Reports", type: "Standard", lastModified: "May 17, 2025 02:10 PM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-009", name: "Quarterly Balance Sheet", description: "Comparative balance sheet across quarters.", category: "Financial Statements", type: "Standard", lastModified: "May 10, 2025 09:00 AM", lastModifiedBy: "Neha Sharma", isFavorite: false },
  { id: "REP-010", name: "Consolidated P&L Statement", description: "Combined P&L statement across all operating companies.", category: "Financial Statements", type: "Standard", lastModified: "May 08, 2025 04:15 PM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-011", name: "Notes to Financial Accounts", description: "Mandatory disclosures and accounting policy schedules.", category: "Financial Statements", type: "Standard", lastModified: "May 01, 2025 10:00 AM", lastModifiedBy: "Rohit Verma", isFavorite: false },
  { id: "REP-012", name: "Segment Balance Sheet", description: "Segmented balance sheet data.", category: "Financial Statements", type: "Standard", lastModified: "Apr 28, 2025 11:30 AM", lastModifiedBy: "Neha Sharma", isFavorite: false },
  { id: "REP-013", name: "Retained Earnings Statement", description: "Reconciles the beginning and ending retained earnings.", category: "Financial Statements", type: "Standard", lastModified: "Apr 25, 2025 02:40 PM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-014", name: "Interim P&L Forecast", description: "Interim financial statement updates.", category: "Financial Statements", type: "Standard", lastModified: "Apr 20, 2025 09:10 AM", lastModifiedBy: "Neha Sharma", isFavorite: false },
  { id: "REP-015", name: "Operating Cash Flow Metrics", description: "Operating cash flow analytics and ratios.", category: "Cash Flow Reports", type: "Standard", lastModified: "May 15, 2025 01:25 PM", lastModifiedBy: "Neha Sharma", isFavorite: false },
  { id: "REP-016", name: "Free Cash Flow Tracker", description: "Calculates free cash flow after capital expenditures.", category: "Cash Flow Reports", type: "Standard", lastModified: "May 12, 2025 11:15 AM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-017", name: "Cash Flow Projection Model", description: "6-month cash flow forecast projection logs.", category: "Cash Flow Reports", type: "Standard", lastModified: "May 10, 2025 03:00 PM", lastModifiedBy: "Neha Sharma", isFavorite: false },
  { id: "REP-018", name: "Cost Center Performance", description: "Expense variances and KPI metrics divided by cost centers.", category: "Management Reports", type: "Standard", lastModified: "May 09, 2025 04:30 PM", lastModifiedBy: "Rohit Verma", isFavorite: false },
  { id: "REP-019", name: "Overhead Cost Analysis", description: "Analysis of administrative overhead spending trends.", category: "Management Reports", type: "Standard", lastModified: "May 06, 2025 02:20 PM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-020", name: "Product Profitability Analysis", description: "Breakdown of product margins and sales ROI.", category: "Management Reports", type: "Standard", lastModified: "May 05, 2025 10:15 AM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-021", name: "Project Budget Variances", description: "Detailed budget performance tracking by project manager.", category: "Budget Reports", type: "Standard", lastModified: "May 04, 2025 04:00 PM", lastModifiedBy: "Neha Sharma", isFavorite: false },
  { id: "REP-022", name: "Capital Expenditure Budget", description: "Plan vs actual analysis for CapEx acquisitions.", category: "Budget Reports", type: "Standard", lastModified: "Apr 30, 2025 11:20 AM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-023", name: "Corporate Income Tax Filing", description: "Tax provision calculations and schedules.", category: "Tax Reports", type: "Standard", lastModified: "May 12, 2025 09:30 AM", lastModifiedBy: "Rohit Verma", isFavorite: false },
  { id: "REP-024", name: "Sales Tax / VAT Summary", description: "VAT collected vs paid audit breakdown.", category: "Tax Reports", type: "Standard", lastModified: "May 02, 2025 03:20 PM", lastModifiedBy: "Neha Sharma", isFavorite: false },
  { id: "REP-025", name: "Ad-hoc Revenue Drilldown", description: "Ad-hoc query report logging revenue by product type.", category: "Custom Reports", type: "Custom", lastModified: "May 18, 2025 01:10 PM", lastModifiedBy: "Amit Mehra", isFavorite: false },
  { id: "REP-026", name: "Monthly Operational Audit", description: "Operational KPIs and workflow approval bottlenecks.", category: "Custom Reports", type: "Custom", lastModified: "May 15, 2025 02:40 PM", lastModifiedBy: "Neha Sharma", isFavorite: false },
];

export const reportSchedules: ReportScheduleRecord[] = [
  { id: "SCH-001", reportId: "REP-002", reportName: "Profit & Loss Statement", frequency: "Monthly", format: "PDF", recipients: "board@magnertia.com, amit.mehra@magnertia.com", status: "Active", nextRun: "2025-06-01 08:00 AM" },
  { id: "SCH-002", reportId: "REP-003", reportName: "Cash Flow Statement", frequency: "Weekly", format: "XLSX", recipients: "finance-team@magnertia.com", status: "Active", nextRun: "2025-05-26 08:00 AM" },
];

export const reportShares: ReportShareRecord[] = [
  { id: "SHR-001", reportId: "REP-001", reportName: "Balance Sheet", sharedWith: "board@magnertia.com", dateShared: "2025-05-18", accessLevel: "View" },
  { id: "SHR-002", reportId: "REP-007", reportName: "Departmental P&L", sharedWith: "department-heads@magnertia.com", dateShared: "2025-05-19", accessLevel: "Edit" },
];
