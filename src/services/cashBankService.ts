import {
  getBankAccountsFn,
  getCashTransactionsFn,
  createCashTransactionFn,
  getChequesFn,
  getDepositsFn,
} from "@/lib/cashBankFns.server";
import type {
  CashPosition,
  DashboardQuery,
  CashTransaction,
  NewCashTransactionInput,
  ChequeRecord,
  DepositRecord,
} from "./types";

export async function fetchCashBalance(query: DashboardQuery): Promise<CashPosition> {
  const res = await getBankAccountsFn();
  const list = res?.data || [];
  const total = list.reduce((sum, acc) => sum + (Number(acc.currentBalance) || 0), 0);
  return { cashBalance: total };
}

export async function calculateOperatingCash(query: DashboardQuery): Promise<number> {
  const res = await getBankAccountsFn();
  const list = res?.data || [];
  return list
    .filter((acc) => acc.type === "Operating")
    .reduce((sum, acc) => sum + (Number(acc.currentBalance) || 0), 0);
}

export async function calculateCashFlowMtd(
  query: DashboardQuery,
): Promise<{ inflow: number; outflow: number; netFlow: number }> {
  const res = await getCashTransactionsFn();
  const list = res?.data || [];
  let inflow = 0;
  let outflow = 0;
  for (const t of list) {
    if (t.type === "Inflow") inflow += Number(t.amount) || 0;
    else outflow += Number(t.amount) || 0;
  }
  return {
    inflow: inflow || 0,
    outflow: outflow || 0,
    netFlow: inflow - outflow,
  };
}

export async function fetchCashTransactions(query: DashboardQuery): Promise<CashTransaction[]> {
  const res = await getCashTransactionsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function saveCashTransaction(input: NewCashTransactionInput): Promise<CashTransaction> {
  const res = await createCashTransactionFn({ data: input });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function fetchCheques(query: DashboardQuery): Promise<ChequeRecord[]> {
  const res = await getChequesFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function fetchDeposits(query: DashboardQuery): Promise<DepositRecord[]> {
  const res = await getDepositsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}
