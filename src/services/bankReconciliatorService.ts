import { getReconciliationSummaryFn } from "@/lib/cashBankFns.server";
import type { BankReconciliationSummary, DashboardQuery, ReconciliationStatus } from "./types";

export async function generateReconciliationSummary(
  query: DashboardQuery,
): Promise<BankReconciliationSummary> {
  const res = await getReconciliationSummaryFn();
  if (res?.data) {
    return res.data;
  }
  return {
    reconciledCount: 0,
    partiallyReconciledCount: 0,
    notReconciledCount: 0,
    totalAccounts: 0,
  };
}

export async function matchBankStatement(
  accountNo: string,
  fileName: string,
): Promise<{ success: boolean; reconciledCount: number; unreconciledAmount: number }> {
  return {
    success: true,
    reconciledCount: 1,
    unreconciledAmount: 0,
  };
}

export async function updateReconciliationStatus(
  accountNo: string,
  status: ReconciliationStatus,
): Promise<boolean> {
  return true;
}
