import type { DashboardQuery } from "./types";

export async function calculateTotalExpenses(query: DashboardQuery): Promise<number> {
  try {
    const { getDashboardKpisFn } = await import("@/lib/dashboardAnalyticsFns.server");
    const res = await getDashboardKpisFn();
    if (res.success && res.data) return res.data.totalExpenses;
  } catch (err) {
    console.error("Failed to calculate total expenses from DB:", err);
  }
  return 0;
}
