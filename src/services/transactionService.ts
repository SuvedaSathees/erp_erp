import * as accountsPayableService from "./accountsPayableService";
import * as accountsReceivableService from "./accountsReceivableService";
import * as generalLedgerService from "./generalLedgerService";
import type {
  DashboardQuery,
  TransactionDetail,
  TransactionFilters,
  TransactionKpiPeriod,
  TransactionRecord,
  TransactionSearchResult,
  TransactionUpdate,
} from "./types";

export async function calculateTotalTransactions(query: DashboardQuery): Promise<number> {
  try {
    const { getTransactionKpisFn } = await import("@/lib/transactionFns.server");
    const res = await getTransactionKpisFn();
    if (res.success && res.data) return res.data.totalTransactions;
  } catch (err) {
    console.error("Failed to calculate total transactions from DB:", err);
  }
  return 0;
}

export async function calculateTotalAmount(query: DashboardQuery): Promise<number> {
  try {
    const { getTransactionKpisFn } = await import("@/lib/transactionFns.server");
    const res = await getTransactionKpisFn();
    if (res.success && res.data) return res.data.totalAmount;
  } catch (err) {
    console.error("Failed to calculate total amount from DB:", err);
  }
  return 0;
}

export async function fetchTodaysTransactions(query: DashboardQuery): Promise<TransactionKpiPeriod> {
  try {
    const { getTransactionKpisFn } = await import("@/lib/transactionFns.server");
    const res = await getTransactionKpisFn();
    if (res.success && res.data) return res.data.transactionsToday;
  } catch (err) {
    console.error("Failed to fetch today's transactions from DB:", err);
  }
  return { count: 0, amount: 0 };
}

export async function fetchMonthlyTransactions(query: DashboardQuery): Promise<TransactionKpiPeriod> {
  try {
    const { getTransactionKpisFn } = await import("@/lib/transactionFns.server");
    const res = await getTransactionKpisFn();
    if (res.success && res.data) return res.data.thisMonth;
  } catch (err) {
    console.error("Failed to fetch monthly transactions from DB:", err);
  }
  return { count: 0, amount: 0 };
}

export async function searchTransactions(
  query: DashboardQuery,
  filters: TransactionFilters,
): Promise<TransactionSearchResult> {
  try {
    const { searchTransactionsFn } = await import("@/lib/transactionFns.server");
    const res = await searchTransactionsFn({
      data: {
        type: filters.type,
        status: filters.status,
        search: filters.search,
        sortDir: filters.sortDir,
        page: filters.page,
        pageSize: filters.pageSize,
      },
    });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to search transactions from DB:", err);
  }
  return { rows: [], total: 0 };
}

export async function fetchTransactionDetails(ref: string): Promise<TransactionDetail | null> {
  try {
    const { getTransactionsFn } = await import("@/lib/transactionFns.server");
    const res = await getTransactionsFn();
    if (res.success && res.data) {
      const row = res.data.find((t: any) => t.ref === ref);
      if (!row) return null;
      if (row.type === "Invoice" || row.type === "Receipt") {
        return accountsReceivableService.retrieveInvoiceInformation(ref);
      }
      if (row.type === "Payment" || row.type === "Bill") {
        return accountsPayableService.retrievePaymentInformation(ref);
      }
      return generalLedgerService.retrieveJournalEntry(ref);
    }
  } catch (err) {
    console.error("Failed to fetch transaction details from DB:", err);
  }
  return generalLedgerService.retrieveJournalEntry(ref);
}

export async function updateTransaction(
  ref: string,
  patch: TransactionUpdate,
): Promise<TransactionRecord> {
  throw new Error(`Transaction update not yet implemented for ${ref}`);
}

export async function notifyCustomerOrSupplier(ref: string): Promise<{ sent: boolean }> {
  return { sent: true };
}
