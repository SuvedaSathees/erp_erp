import { apiRequest } from "./apiClient";
import {
  cashFlowSummary as cashFlowLines,
  expenseDistribution,
  financialInsightsRaw,
  netCashFlow,
  revenueExpenseTrend,
} from "@/lib/mock-data";
import type {
  AccountBalanceTrendPoint,
  AccountDistributionSlice,
  AccountNode,
  AgingReport,
  CashFlowSummary,
  CollectionSummary,
  CurrentRatio,
  DashboardQuery,
  ExpenseSlice,
  FinancialInsights,
  InsightMetric,
  PaymentSummary,
  ReceivableTrendPoint,
  TopCustomer,
  TopVendor,
  TrendPoint,
  CostCenterHierarchyNode,
  ProfitabilityTrendPoint,
  RegionalProfitabilityPoint,
  SalesChannelProfitabilityPoint,
  TopPerformer,
  AssetCategoryCount,
} from "./types";

export async function calculateCurrentRatio(query: DashboardQuery): Promise<CurrentRatio> {
  try {
    const { getDashboardKpisFn } = await import("@/lib/dashboardAnalyticsFns.server");
    const res = await getDashboardKpisFn();
    if (res.success && res.data) {
      return {
        currentRatio: res.data.currentRatio,
        currentRatioPY: res.data.currentRatioPY,
      };
    }
  } catch (err) {
    console.error("Failed to calculate current ratio from DB:", err);
  }
  return { currentRatio: 0, currentRatioPY: 0 };
}

export function generateRevenueExpenseTrend(query: DashboardQuery): Promise<TrendPoint[]> {
  return apiRequest(
    `/api/financial/analytics/revenue-expense-trend?fy=${query.fiscalYear}&company=${query.companyId}`,
    () => revenueExpenseTrend,
  );
}

export function generateCashFlowSummary(query: DashboardQuery): Promise<CashFlowSummary> {
  return apiRequest(
    `/api/financial/analytics/cash-flow-summary?fy=${query.fiscalYear}&company=${query.companyId}`,
    () => ({ lines: cashFlowLines, netCashFlow }),
  );
}

export function generateExpenseDistribution(query: DashboardQuery): Promise<ExpenseSlice[]> {
  return apiRequest(
    `/api/financial/analytics/expense-distribution?fy=${query.fiscalYear}&company=${query.companyId}`,
    () => expenseDistribution,
  );
}

function findAccountNode(code: string, nodes: AccountNode[]): AccountNode | null {
  for (const node of nodes) {
    if (node.code === code) return node;
    if (node.children) {
      const found = findAccountNode(code, node.children);
      if (found) return found;
    }
  }
  return null;
}

const TREND_MONTHS = ["Apr '24", "Jun '24", "Aug '24", "Oct '24", "Dec '24", "Feb '25", "Apr '25"];
const TREND_FRACTIONS = [0.103, 0.24, 0.398, 0.563, 0.721, 0.879, 1];

export async function generateAccountBalanceTrend(
  accountCode: string,
): Promise<AccountBalanceTrendPoint[]> {
  try {
    const { getAccountsTreeFn } = await import("@/lib/generalLedgerFns.server");
    const res = await getAccountsTreeFn();
    if (res.success && res.data) {
      const account = findAccountNode(accountCode, res.data);
      if (!account) return [];
      return TREND_MONTHS.map((month, i) => {
        const debit = Math.round(account.debit * TREND_FRACTIONS[i]);
        const credit = Math.round(account.credit * TREND_FRACTIONS[i]);
        return { month, debit, credit, netBalance: debit - credit };
      });
    }
  } catch (err) {
    console.error("Failed to generate account balance trend from DB:", err);
  }
  return [];
}

export async function generateAccountDistribution(
  query: DashboardQuery,
): Promise<AccountDistributionSlice[]> {
  try {
    const { getDashboardKpisFn } = await import("@/lib/dashboardAnalyticsFns.server");
    const res = await getDashboardKpisFn();
    if (res.success && res.data) {
      const COLORS: Record<string, string> = {
        Asset: "#3B82F6",
        Liability: "#EF4444",
        Equity: "#22C55E",
        Revenue: "#F59E0B",
        Expense: "#EC4899",
      };
      return res.data.accountDistribution.map((d) => ({
        type: d.type,
        count: d.count,
        balance: d.balance,
        color: COLORS[d.type] || "#6B7280",
      }));
    }
  } catch (err) {
    console.error("Failed to generate account distribution from DB:", err);
  }
  return [];
}

// Page-scoped semantic palette — computed from PostgreSQL live invoices
export async function generateApAgingSummary(query: DashboardQuery): Promise<AgingReport> {
  try {
    const { getPayableAgingReportFn } = await import("@/lib/accountsPayableFns.server");
    const res = await getPayableAgingReportFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to generate AP aging summary from server:", err);
  }
  return { total: 0, buckets: [] };
}

export async function calculateTopVendors(query: DashboardQuery): Promise<TopVendor[]> {
  try {
    const { getTopVendorsFn } = await import("@/lib/accountsPayableFns.server");
    const res = await getTopVendorsFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to calculate top vendors from server:", err);
  }
  return [];
}

export async function generatePaymentSummary(query: DashboardQuery): Promise<PaymentSummary> {
  try {
    const { getPayablePaymentSummaryFn } = await import("@/lib/accountsPayableFns.server");
    const res = await getPayablePaymentSummaryFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to generate payment summary from server:", err);
  }
  return {
    totalPaid: 0,
    averagePayment: 0,
    totalPayments: 0,
    discountsTaken: 0,
  };
}

export async function generateArAgingSummary(query: DashboardQuery): Promise<AgingReport> {
  try {
    const { getReceivableAgingReportFn } = await import("@/lib/accountsReceivableFns.server");
    const res = await getReceivableAgingReportFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to generate AR aging summary from server:", err);
  }
  return { total: 0, buckets: [] };
}

export async function generateReceivableTrend(query: DashboardQuery): Promise<ReceivableTrendPoint[]> {
  try {
    const { getReceivableTrendFn } = await import("@/lib/accountsReceivableFns.server");
    const res = await getReceivableTrendFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to generate receivable trend from server:", err);
  }
  return [];
}

export async function calculateTopCustomers(query: DashboardQuery): Promise<TopCustomer[]> {
  try {
    const { getTopCustomersFn } = await import("@/lib/accountsReceivableFns.server");
    const res = await getTopCustomersFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to calculate top customers from server:", err);
  }
  return [];
}

export async function generateCollectionSummary(query: DashboardQuery): Promise<CollectionSummary> {
  try {
    const { getCollectionSummaryFn } = await import("@/lib/accountsReceivableFns.server");
    const res = await getCollectionSummaryFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to generate collection summary from server:", err);
  }
  return {
    billedAmount: 0,
    collectedAmount: 0,
    collectionPct: 0,
    avgDaysToCollect: 0,
  };
}

function toPercentMetric(
  label: string,
  raw: { value: number; deltaPct: number; direction: "up" | "down"; tone: "positive" | "negative" },
): InsightMetric {
  return {
    label,
    value: `${raw.value.toFixed(1)}%`,
    deltaLabel: `${raw.deltaPct.toFixed(1)}% vs. PY`,
    direction: raw.direction,
    tone: raw.tone,
  };
}

function toDaysMetric(
  label: string,
  raw: {
    value: number;
    deltaDays: number;
    direction: "up" | "down";
    tone: "positive" | "negative";
  },
): InsightMetric {
  return {
    label,
    value: `${raw.value} Days`,
    deltaLabel: `${raw.deltaDays} Day${raw.deltaDays === 1 ? "" : "s"} vs. PY`,
    direction: raw.direction,
    tone: raw.tone,
  };
}

export function calculateFinancialInsights(query: DashboardQuery): Promise<FinancialInsights> {
  return apiRequest(
    `/api/financial/analytics/insights?fy=${query.fiscalYear}&company=${query.companyId}`,
    () => ({
      grossMargin: toPercentMetric("Gross Margin", financialInsightsRaw.grossMargin),
      operatingMargin: toPercentMetric("Operating Margin", financialInsightsRaw.operatingMargin),
      expenseRatio: toPercentMetric("Expense Ratio", financialInsightsRaw.expenseRatio),
      dso: toDaysMetric("DSO", financialInsightsRaw.dso),
      dpo: toDaysMetric("DPO", financialInsightsRaw.dpo),
      cashConversionCycle: toDaysMetric(
        "Cash Conversion Cycle",
        financialInsightsRaw.cashConversionCycle,
      ),
    }),
  );
}

export async function generateAssetDistribution(query: DashboardQuery): Promise<AssetCategoryCount[]> {
  try {
    const { getAssetAnalyticsFn } = await import("@/lib/dashboardAnalyticsFns.server");
    const res = await getAssetAnalyticsFn();
    if (res.success && res.data) return res.data.categoryDistribution;
  } catch (err) {
    console.error("Failed to generate asset distribution from DB:", err);
  }
  return [];
}

export function generateDepreciationTrend(
  query: DashboardQuery,
): Promise<{ month: string; depreciation: number }[]> {
  return apiRequest(
    `/api/financial/analytics/fixed-assets/depreciation-trend?fy=${query.fiscalYear}`,
    () => [
      { month: "Apr '24", depreciation: 680000.0 },
      { month: "May '24", depreciation: 750000.0 },
      { month: "Jun '24", depreciation: 780000.0 },
      { month: "Jul '24", depreciation: 890000.0 },
      { month: "Aug '24", depreciation: 1100000.0 },
      { month: "Sep '24", depreciation: 980000.0 },
      { month: "Oct '24", depreciation: 1200000.0 },
      { month: "Mar '25", depreciation: 1300000.0 },
    ],
  );
}

export async function calculateTopAssets(
  query: DashboardQuery,
): Promise<{ name: string; netBookValue: number }[]> {
  try {
    const { getAssetAnalyticsFn } = await import("@/lib/dashboardAnalyticsFns.server");
    const res = await getAssetAnalyticsFn();
    if (res.success && res.data) return res.data.topAssets;
  } catch (err) {
    console.error("Failed to calculate top assets from DB:", err);
  }
  return [];
}

export function generateBudgetVsActualTrend(
  query: DashboardQuery,
): Promise<{ month: string; budget: number; actual: number; forecast: number }[]> {
  return apiRequest(`/api/financial/analytics/budget/trend?fy=${query.fiscalYear}`, () => [
    { month: "Apr '24", budget: 10000000, actual: 8000000, forecast: 10000000 },
    { month: "May '24", budget: 11500000, actual: 9500000, forecast: 11500000 },
    { month: "Jun '24", budget: 13000000, actual: 11200000, forecast: 12800000 },
    { month: "Jul '24", budget: 14500000, actual: 12500000, forecast: 14200000 },
    { month: "Aug '24", budget: 16000000, actual: 13900000, forecast: 15600000 },
    { month: "Sep '24", budget: 18200000, actual: 14800000, forecast: 17200000 },
    { month: "Oct '24", budget: 20500000, actual: 16200000, forecast: 19100000 },
    { month: "Mar '25", budget: 24850000, actual: 18765430, forecast: 21980000 },
  ]);
}

export async function generateVarianceAnalysis(
  query: DashboardQuery,
): Promise<{ name: string; variance: number }[]> {
  try {
    const { getBudgetAnalyticsFn } = await import("@/lib/dashboardAnalyticsFns.server");
    const res = await getBudgetAnalyticsFn();
    if (res.success && res.data) return res.data.varianceByDept;
  } catch (err) {
    console.error("Failed to generate variance analysis from DB:", err);
  }
  return [];
}

export async function generateBudgetHealthSummary(query: DashboardQuery): Promise<{
  onTrackCount: number;
  onTrackPct: number;
  atRiskCount: number;
  atRiskPct: number;
  overBudgetCount: number;
  overBudgetPct: number;
}> {
  try {
    const { getBudgetAnalyticsFn } = await import("@/lib/dashboardAnalyticsFns.server");
    const res = await getBudgetAnalyticsFn();
    if (res.success && res.data) return res.data.health;
  } catch (err) {
    console.error("Failed to generate budget health from DB:", err);
  }
  return {
    onTrackCount: 0,
    onTrackPct: 0,
    atRiskCount: 0,
    atRiskPct: 0,
    overBudgetCount: 0,
    overBudgetPct: 0,
  };
}

export function generateFinancialPerformanceTrend(
  query: DashboardQuery,
): Promise<{ month: string; revenue: number; grossProfit: number; netIncome: number }[]> {
  return apiRequest(`/api/financial/analytics/reports/trend?fy=${query.fiscalYear}`, () => [
    { month: "Apr '24", revenue: 10200000.0, grossProfit: 4500000.0, netIncome: 1800000.0 },
    { month: "May '24", revenue: 13500000.0, grossProfit: 5800000.0, netIncome: 2400000.0 },
    { month: "Jun '24", revenue: 18200000.0, grossProfit: 7200000.0, netIncome: 3100000.0 },
    { month: "Jul '24", revenue: 22800000.0, grossProfit: 8900000.0, netIncome: 3900000.0 },
    { month: "Aug '24", revenue: 27900000.0, grossProfit: 10800000.0, netIncome: 4800000.0 },
    { month: "Sep '24", revenue: 32600000.0, grossProfit: 12400000.0, netIncome: 5500000.0 },
    { month: "Oct '24", revenue: 38400000.0, grossProfit: 14600000.0, netIncome: 6500000.0 },
    { month: "Mar '25", revenue: 48753920.0, grossProfit: 18245630.0, netIncome: 7856410.0 },
  ]);
}

export function generateReportsByCategory(
  query: DashboardQuery,
): Promise<{ name: string; count: number; percentage: number; color: string }[]> {
  return apiRequest(
    `/api/financial/analytics/reports/category-split?fy=${query.fiscalYear}`,
    () => [
      { name: "Financial Statements", count: 9, percentage: 37.5, color: "#8B5CF6" },
      { name: "Management Reports", count: 6, percentage: 25.0, color: "#EC4899" },
      { name: "Cash Flow Reports", count: 4, percentage: 16.67, color: "#10B981" },
      { name: "Budget Reports", count: 3, percentage: 12.5, color: "#F59E0B" },
      { name: "Tax Reports", count: 2, percentage: 8.33, color: "#EF4444" },
      { name: "Custom Reports", count: 2, percentage: 8.33, color: "#8B5CF6" },
    ],
  );
}

export function viewRecentReportActivity(
  query: DashboardQuery,
): Promise<
  { id: string; reportName: string; activity: string; performedBy: string; timestamp: string }[]
> {
  return apiRequest(`/api/financial/analytics/reports/activities?fy=${query.fiscalYear}`, () => [
    {
      id: "ACT-001",
      reportName: "Balance Sheet",
      activity: "Generated YTD Balance Sheet",
      performedBy: "Amit Mehra",
      timestamp: "May 20, 2025 10:15 AM",
    },
    {
      id: "ACT-002",
      reportName: "Profit & Loss Statement",
      activity: "Generated Monthly P&L Statement",
      performedBy: "Amit Mehra",
      timestamp: "May 20, 2025 10:15 AM",
    },
    {
      id: "ACT-003",
      reportName: "Cash Flow Statement",
      activity: "Scheduled Monthly PDF Delivery",
      performedBy: "Neha Sharma",
      timestamp: "May 19, 2025 04:30 PM",
    },
    {
      id: "ACT-004",
      reportName: "Budget vs Actual Report",
      activity: "Exported XLSX spreadsheet",
      performedBy: "Rohit Verma",
      timestamp: "May 18, 2025 11:20 AM",
    },
    {
      id: "ACT-005",
      reportName: "Trial Balance",
      activity: "Viewed HTML report details",
      performedBy: "Rohit Verma",
      timestamp: "May 18, 2025 11:20 AM",
    },
  ]);
}

export function generateTaxLiabilityByType(
  query: DashboardQuery,
): Promise<{ name: string; value: number; percentage: number; color: string }[]> {
  return apiRequest(`/api/financial/analytics/tax/type-split?fy=${query.fiscalYear}`, () => [
    { name: "GST", value: 4250000, percentage: 33.09, color: "#EC4899" },
    { name: "Income Tax", value: 2900000, percentage: 22.56, color: "#14B8A6" },
    { name: "TDS - Salaries", value: 1250000, percentage: 9.73, color: "#10B981" },
    { name: "TDS - Contractors", value: 680000, percentage: 5.29, color: "#EF4444" },
    { name: "VAT", value: 980000, percentage: 7.63, color: "#F59E0B" },
    { name: "Others", value: 2785760, percentage: 21.7, color: "#8B5CF6" },
  ]);
}

export function generateTaxLiabilityTrend(
  query: DashboardQuery,
): Promise<{ month: string; liability: number; paid: number }[]> {
  return apiRequest(`/api/financial/analytics/tax/trend?fy=${query.fiscalYear}`, () => [
    { month: "Apr '24", liability: 800000, paid: 600000 },
    { month: "May '24", liability: 1100000, paid: 800000 },
    { month: "Jun '24", liability: 1500000, paid: 1100000 },
    { month: "Jul '24", liability: 1200000, paid: 950000 },
    { month: "Aug '24", liability: 1650000, paid: 1300000 },
    { month: "Sep '24", liability: 1350000, paid: 1100000 },
    { month: "Oct '24", liability: 1800000, paid: 1400000 },
    { month: "Mar '25", liability: 12845760, paid: 9456230 },
  ]);
}

export function generateTaxPaymentSummary(
  query: DashboardQuery,
): Promise<{ liabilityYTD: number; paidYTD: number; payable: number; effectiveRate: number }> {
  return apiRequest(`/api/financial/analytics/tax/payment-summary?fy=${query.fiscalYear}`, () => ({
    liabilityYTD: 12845760.0,
    paidYTD: 9456230.0,
    payable: 3389530.0,
    effectiveRate: 24.36,
  }));
}

export function generateCostCenterTrend(
  query: DashboardQuery,
): Promise<{ month: string; budget: number; actual: number; forecast: number }[]> {
  return apiRequest(`/api/financial/analytics/cost-centers/trend?fy=${query.fiscalYear}`, () => [
    { month: "Apr '24", budget: 1500000, actual: 1100000, forecast: 1400000 },
    { month: "May '24", budget: 1600000, actual: 1250000, forecast: 1500000 },
    { month: "Jun '24", budget: 1800000, actual: 1400000, forecast: 1700000 },
    { month: "Jul '24", budget: 1750000, actual: 1350000, forecast: 1650000 },
    { month: "Aug '24", budget: 1900000, actual: 1500000, forecast: 1850000 },
    { month: "Sep '24", budget: 1850000, actual: 1450000, forecast: 1800000 },
    { month: "Oct '24", budget: 2000000, actual: 1600000, forecast: 1950000 },
    { month: "Nov '24", budget: 2100000, actual: 1700000, forecast: 2050000 },
    { month: "Dec '24", budget: 2200000, actual: 1850000, forecast: 2150000 },
    { month: "Jan '25", budget: 2300000, actual: 1950000, forecast: 2250000 },
    { month: "Feb '25", budget: 2400000, actual: 2050000, forecast: 2350000 },
    { month: "Mar '25", budget: 2500000, actual: 2200000, forecast: 2450000 },
  ]);
}

export async function generateCostCenterDepartmentSplit(
  query: DashboardQuery,
): Promise<{ name: string; value: number; percentage: number; color: string }[]> {
  try {
    const { getCostCentersFn } = await import("@/lib/costCentersFns.server");
    const res = await getCostCentersFn();
    if (res.success && res.data && res.data.length > 0) {
      const DEPT_COLORS = ["#EC4899", "#14B8A6", "#10B981", "#EF4444", "#F59E0B", "#6B7280"];
      const totalBudget = res.data.reduce((s: number, c: any) => s + (Number(c.budget) || 0), 0) || 1;
      return res.data.map((c: any, i: number) => ({
        name: c.department || c.name,
        value: Number(c.budget) || 0,
        percentage: Number((((Number(c.budget) || 0) / totalBudget) * 100).toFixed(2)),
        color: DEPT_COLORS[i % DEPT_COLORS.length],
      }));
    }
  } catch (err) {
    console.error("Failed to generate cost center department split from DB:", err);
  }
  return [];
}

export async function generateCostCenterVariances(
  query: DashboardQuery,
): Promise<{ costCenter: string; variance: number; percentage: number }[]> {
  try {
    const { getCostCentersFn } = await import("@/lib/costCentersFns.server");
    const res = await getCostCentersFn();
    if (res.success && res.data && res.data.length > 0) {
      return res.data.map((c: any) => {
        const budget = Number(c.budget) || 0;
        const actual = Number(c.actual) || 0;
        const variance = budget - actual;
        return {
          costCenter: c.name,
          variance,
          percentage: budget > 0 ? Number(((variance / budget) * 100).toFixed(2)) : 0,
        };
      });
    }
  } catch (err) {
    console.error("Failed to generate cost center variances from DB:", err);
  }
  return [];
}

export async function generateCostCenterHierarchyModel(
  query: DashboardQuery,
): Promise<CostCenterHierarchyNode> {
  try {
    const { getCostCentersFn } = await import("@/lib/costCentersFns.server");
    const res = await getCostCentersFn();
    if (res.success && res.data && res.data.length > 0) {
      const deptMap = new Map<string, string[]>();
      for (const cc of res.data) {
        const dept = (cc as any).department || "General";
        const list = deptMap.get(dept) || [];
        list.push(cc.name);
        deptMap.set(dept, list);
      }
      return {
        name: "Total Organization",
        children: Array.from(deptMap.entries()).map(([dept, centers]) => ({
          name: dept,
          children: centers.map((name) => ({ name })),
        })),
      };
    }
  } catch (err) {
    console.error("Failed to generate cost center hierarchy from DB:", err);
  }
  return { name: "Total Organization", children: [] };
}

export function generateProfitabilityTrend(
  query: DashboardQuery,
): Promise<ProfitabilityTrendPoint[]> {
  return apiRequest(`/api/financial/analytics/profitability/trend?fy=${query.fiscalYear}`, () => [
    { month: "Apr '24", netProfit: 400000, netMargin: 14.5 },
    { month: "May '24", netProfit: 420000, netMargin: 15.1 },
    { month: "Jun '24", netProfit: 480000, netMargin: 14.8 },
    { month: "Jul '24", netProfit: 450000, netMargin: 14.2 },
    { month: "Aug '24", netProfit: 520000, netMargin: 15.3 },
    { month: "Sep '24", netProfit: 600000, netMargin: 14.9 },
    { month: "Oct '24", netProfit: 650000, netMargin: 14.1 },
    { month: "Nov '24", netProfit: 700000, netMargin: 14.7 },
    { month: "Dec '24", netProfit: 780000, netMargin: 15.0 },
    { month: "Jan '25", netProfit: 800000, netMargin: 14.9 },
    { month: "Feb '25", netProfit: 850000, netMargin: 15.2 },
    { month: "Mar '25", netProfit: 1000000, netMargin: 15.8 },
  ]);
}

export function generateRegionalProfitability(
  query: DashboardQuery,
): Promise<RegionalProfitabilityPoint[]> {
  return apiRequest(
    `/api/financial/analytics/profitability/regional?fy=${query.fiscalYear}`,
    () => [
      { region: "North America", netMargin: 18.91 },
      { region: "Europe", netMargin: 17.42 },
      { region: "Asia Pacific", netMargin: 16.83 },
      { region: "Middle East", netMargin: 15.27 },
      { region: "South America", netMargin: 13.58 },
      { region: "Africa", netMargin: 12.11 },
    ],
  );
}

export function generateSalesChannelProfitability(
  query: DashboardQuery,
): Promise<SalesChannelProfitabilityPoint[]> {
  return apiRequest(
    `/api/financial/analytics/profitability/sales-channel?fy=${query.fiscalYear}`,
    () => [
      { name: "Direct Sales", value: 4320000, percentage: 20.34, color: "#EC4899" },
      { name: "Distributors", value: 2910000, percentage: 17.89, color: "#14B8A6" },
      { name: "Online Sales", value: 1630000, percentage: 18.17, color: "#10B981" },
      { name: "Retail Partners", value: 980000, percentage: 16.25, color: "#F59E0B" },
      { name: "Others", value: 480000, percentage: 15.32, color: "#8B5CF6" },
    ],
  );
}

export function generateTopPerformers(query: DashboardQuery): Promise<TopPerformer[]> {
  return apiRequest(
    `/api/financial/analytics/profitability/top-performers?fy=${query.fiscalYear}`,
    () => [
      { rank: 1, name: "Spare Parts", netMargin: 23.33, netProfit: 512470.0 },
      { rank: 2, name: "Control Systems", netMargin: 19.73, netProfit: 642790.0 },
      { rank: 3, name: "Valves & Fittings", netMargin: 19.37, netProfit: 1890450.0 },
    ],
  );
}

export function generateIntercompanyBalancesTrend(
  query: DashboardQuery,
): Promise<{ month: string; value: number }[]> {
  return apiRequest(
    `/api/financial/analytics/consolidation/intercompany-trend?fy=${query.fiscalYear}`,
    () => [
      { month: "Apr '24", value: 1950000 },
      { month: "Jun '24", value: 1750000 },
      { month: "Aug '24", value: 1550000 },
      { month: "Oct '24", value: 1050000 },
      { month: "Dec '24", value: 650000 },
      { month: "Feb '25", value: 350000 },
      { month: "Mar '25", value: 250000 },
    ],
  );
}

export function generateConsolidatedProfitTrend(
  query: DashboardQuery,
): Promise<{ month: string; netProfit: number; netMargin: number }[]> {
  return apiRequest(
    `/api/financial/analytics/consolidation/profit-trend?fy=${query.fiscalYear}`,
    () => [
      { month: "Apr '24", netProfit: 4500000, netMargin: 15.2 },
      { month: "May '24", netProfit: 4700000, netMargin: 15.6 },
      { month: "Jun '24", netProfit: 5100000, netMargin: 15.4 },
      { month: "Jul '24", netProfit: 4900000, netMargin: 15.0 },
      { month: "Aug '24", netProfit: 5400000, netMargin: 15.9 },
      { month: "Sep '24", netProfit: 6200000, netMargin: 15.5 },
      { month: "Oct '24", netProfit: 6600000, netMargin: 14.8 },
      { month: "Nov '24", netProfit: 7100000, netMargin: 15.3 },
      { month: "Dec '24", netProfit: 7900000, netMargin: 15.6 },
      { month: "Jan '25", netProfit: 8100000, netMargin: 15.5 },
      { month: "Feb '25", netProfit: 8600000, netMargin: 15.8 },
      { month: "Mar '25", netProfit: 10100000, netMargin: 16.4 },
    ],
  );
}

export function generateActivityTrend(
  query: DashboardQuery,
): Promise<{ month: string; value: number }[]> {
  return apiRequest(`/api/financial/analytics/audit/activity-trend?fy=${query.fiscalYear}`, () => [
    { month: "Apr '24", value: 500 },
    { month: "May '24", value: 950 },
    { month: "Jun '24", value: 850 },
    { month: "Jul '24", value: 780 },
    { month: "Aug '24", value: 980 },
    { month: "Sep '24", value: 1100 },
    { month: "Oct '24", value: 1050 },
    { month: "Nov '24", value: 1250 },
    { month: "Dec '24", value: 1450 },
    { month: "Jan '25", value: 1350 },
    { month: "Feb '25", value: 1600 },
    { month: "Mar '25", value: 1550 },
  ]);
}

export function generateActivitiesByModule(
  query: DashboardQuery,
): Promise<{ name: string; value: number; percentage: number; color: string }[]> {
  return apiRequest(`/api/financial/analytics/audit/module-splits?fy=${query.fiscalYear}`, () => [
    { name: "General Ledger", value: 2845, percentage: 22.82, color: "#EC4899" },
    { name: "Accounts Payable", value: 2150, percentage: 17.25, color: "#14B8A6" },
    { name: "Accounts Receivable", value: 1988, percentage: 15.95, color: "#10B981" },
    { name: "Cash & Bank", value: 1512, percentage: 12.14, color: "#F59E0B" },
    { name: "Budgeting", value: 1124, percentage: 9.02, color: "#EF4444" },
    { name: "Tax Management", value: 824, percentage: 6.62, color: "#8B5CF6" },
    { name: "Others", value: 2015, percentage: 16.2, color: "#6B7280" },
  ]);
}
