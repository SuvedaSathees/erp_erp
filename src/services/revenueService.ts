import type { DashboardQuery } from "./types";

export async function calculateTotalRevenue(query: DashboardQuery): Promise<number> {
  try {
    const { getDashboardKpisFn } = await import("@/lib/dashboardAnalyticsFns.server");
    const res = await getDashboardKpisFn();
    if (res.success && res.data) return res.data.totalRevenue;
  } catch (err) {
    console.error("Failed to calculate total revenue from DB:", err);
  }
  return 0;
}
