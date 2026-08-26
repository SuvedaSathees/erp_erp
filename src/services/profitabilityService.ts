import { apiRequest } from "./apiClient";
import {
  mockProfitabilityProducts,
  mockDrilldownTransactions,
} from "@/lib/mock-data";
import {
  getCostAllocationRulesFn,
  saveCostAllocationRulesFn,
} from "@/lib/costCentersFns.server";
import {
  getProfitabilityDataFn,
  getCustomerProfitabilityFn,
} from "@/lib/profitabilityFns.server";
import type { ProfitabilityRecord, CostAllocationRule, DashboardQuery } from "./types";

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

  // Product dimension left as mock (no Product/Item model in schema)
  return mockProfitabilityProducts;
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
    () => mockDrilldownTransactions,
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
