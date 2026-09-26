import type { DashboardQuery, TransactionKpiPeriod } from "./types";

export async function fetchPendingApprovals(query: DashboardQuery): Promise<TransactionKpiPeriod> {
  try {
    const { getTransactionKpisFn } = await import("@/lib/transactionFns.server");
    const res = await getTransactionKpisFn();
    if (res.success && res.data) return res.data.pendingApproval;
  } catch (err) {
    console.error("Failed to fetch pending approvals from DB:", err);
  }
  return { count: 0, amount: 0 };
}
