import { apiRequest } from "./apiClient";
import {
  getCostAllocationRulesFn,
  saveCostAllocationRulesFn,
} from "@/lib/costCentersFns.server";
import {
  getProfitabilityDataFn,
  getCustomerProfitabilityFn,
} from "@/lib/profitabilityFns.server";
import type { ProfitabilityRecord, CostAllocationRule, DashboardQuery } from "./types";

const productProfitability: ProfitabilityRecord[] = [
  { code: "PRD-001", name: "Industrial Pumps", revenue: 12845300, cogs: 7214650, grossProfit: 5630650, grossMargin: 43.85, netProfit: 2480230, netMargin: 19.32 },
  { code: "PRD-002", name: "Valves & Fittings", revenue: 9765200, cogs: 5552180, grossProfit: 4213020, grossMargin: 43.17, netProfit: 1890450, netMargin: 19.37 },
  { code: "PRD-003", name: "Compressors", revenue: 8920750, cogs: 5031440, grossProfit: 3889310, grossMargin: 43.59, netProfit: 1652890, netMargin: 18.53 },
  { code: "PRD-004", name: "Heat Exchangers", revenue: 6812430, cogs: 3808690, grossProfit: 3003740, grossMargin: 44.06, netProfit: 1171260, netMargin: 17.19 },
  { code: "PRD-005", name: "Industrial Motors", revenue: 4956320, cogs: 2792410, grossProfit: 2163910, grossMargin: 43.64, netProfit: 912130, netMargin: 18.4 },
  { code: "PRD-006", name: "Control Systems", revenue: 3256780, cogs: 1788170, grossProfit: 1468610, grossMargin: 45.05, netProfit: 642790, netMargin: 19.73 },
  { code: "PRD-007", name: "Spare Parts", revenue: 2197140, cogs: 1102980, grossProfit: 1094160, grossMargin: 49.81, netProfit: 512470, netMargin: 23.33 },
];

const drilldownTransactions = [
  { date: "2025-05-18", ref: "TXN-REV-0912", description: "Industrial Pumps shipment to Apex Global", amount: 45000, type: "Revenue" },
  { date: "2025-05-17", ref: "TXN-EXP-0842", description: "Direct labor assembly allocation", amount: -15000, type: "COGS" },
  { date: "2025-05-15", ref: "TXN-REV-0811", description: "Spare Parts emergency kit order", amount: 12500, type: "Revenue" },
  { date: "2025-05-12", ref: "TXN-EXP-0618", description: "Freight charges allocation", amount: -4200, type: "COGS" },
];

export async function fetchProfitabilityByDimension(
  query: DashboardQuery,
  dimension: string,
): Promise<ProfitabilityRecord[]> {
  if (dimension === "Customer") {
    try {
      const res = await getCustomerProfitabilityFn({ data: query });
      if (res.success && res.data) return res.data;
    } catch (err) {
      console.error("Failed to fetch customer profitability:", err);
    }
    return [];
  }

  return apiRequest(
    `/api/financial/profitability/products?fy=${query.fiscalYear}`,
    () => productProfitability,
  );
}

export async function fetchPeriodComparison(
  query: DashboardQuery,
): Promise<
  { dimension: string; currentYTD: number; priorYTD: number; changePercentage: number }[]
> {
  try {
    const res = await getProfitabilityDataFn({ data: query });
    if (res.success && res.data?.comparison) {
      return res.data.comparison;
    }
  } catch (err) {
    console.error("Failed to fetch period comparison:", err);
  }

  return [
    { dimension: "Revenue", currentYTD: 0, priorYTD: 0, changePercentage: 0 },
    { dimension: "Gross Profit", currentYTD: 0, priorYTD: 0, changePercentage: 0 },
    { dimension: "Net Profit", currentYTD: 0, priorYTD: 0, changePercentage: 0 },
  ];
}

export function fetchDrilldownAnalysis(
  query: DashboardQuery,
  dimension: string,
  id: string,
): Promise<{ date: string; ref: string; description: string; amount: number; type: string }[]> {
  return apiRequest(
    `/api/financial/profitability/drilldown?dim=${dimension}&id=${id}&fy=${query.fiscalYear}`,
    () => drilldownTransactions,
  );
}

export async function fetchAllocationRules(): Promise<CostAllocationRule[]> {
  const res = await getCostAllocationRulesFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function saveAllocationRules(
  rules: CostAllocationRule[],
): Promise<{ success: boolean; updatedRulesCount: number }> {
  const res = await saveCostAllocationRulesFn({ data: rules });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}
