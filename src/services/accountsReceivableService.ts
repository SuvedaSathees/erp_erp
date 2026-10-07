import {
  getReceivableInvoicesFn,
  getReceivableInvoiceDetailsFn,
  createReceivableInvoiceFn,
  createCreditMemoFn,
  getReceivableAgingReportFn,
  getReceivableKpisFn,
  getReceivableInvoiceInfoFn,
  notifyReceivableCustomerFn,
} from "@/lib/accountsReceivableFns.server";
import type {
  AgingReport,
  CreateCreditMemoInput,
  DashboardQuery,
  InvoiceDetail,
  NewReceivableInvoiceInput,
  ReceivableInvoice,
  ReceivableInvoiceFilters,
  ReceivableInvoiceSearchResult,
} from "./types";

export async function fetchOutstandingReceivables(query: DashboardQuery): Promise<AgingReport> {
  try {
    const res = await getReceivableAgingReportFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to fetch receivable aging report from server:", err);
  }
  return { total: 0, buckets: [] };
}

export async function retrieveInvoiceInformation(ref: string): Promise<InvoiceDetail | null> {
  try {
    const res = await getReceivableInvoiceInfoFn({ data: ref });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to retrieve invoice information from server:", err);
  }
  return null;
}

export async function calculateTotalReceivables(query: DashboardQuery): Promise<number> {
  try {
    const res = await getReceivableKpisFn({ data: query });
    if (res.success && res.data) return res.data.totalReceivables;
  } catch (err) {
    console.error("Failed to calculate total receivables from server:", err);
  }
  return 0;
}

export async function calculateOverdueAmount(
  query: DashboardQuery,
): Promise<{ amount: number; pctOfTotal: number }> {
  try {
    const res = await getReceivableKpisFn({ data: query });
    if (res.success && res.data) {
      return { amount: res.data.overdueAmount, pctOfTotal: res.data.overduePctOfTotal };
    }
  } catch (err) {
    console.error("Failed to calculate overdue amount from server:", err);
  }
  return { amount: 0, pctOfTotal: 0 };
}

export async function calculateDueWithin30Days(
  query: DashboardQuery,
): Promise<{ amount: number; pctOfTotal: number }> {
  try {
    const res = await getReceivableKpisFn({ data: query });
    if (res.success && res.data) {
      return { amount: res.data.dueWithin30Days, pctOfTotal: res.data.dueWithin30PctOfTotal };
    }
  } catch (err) {
    console.error("Failed to calculate due within 30 days from server:", err);
  }
  return { amount: 0, pctOfTotal: 0 };
}

export async function countOpenInvoices(query: DashboardQuery): Promise<number> {
  try {
    const res = await getReceivableKpisFn({ data: query });
    if (res.success && res.data) return res.data.openInvoices;
  } catch (err) {
    console.error("Failed to count open invoices from server:", err);
  }
  return 0;
}

export async function retrieveInvoiceList(
  query: DashboardQuery,
  filters: ReceivableInvoiceFilters,
): Promise<ReceivableInvoiceSearchResult> {
  try {
    const res = await getReceivableInvoicesFn({ data: { query, filters } });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to retrieve receivable invoice list from server:", err);
  }
  return { rows: [], total: 0 };
}

export async function retrieveReceivableDetails(
  invoiceNo: string,
): Promise<ReceivableInvoice | null> {
  try {
    const res = await getReceivableInvoiceDetailsFn({ data: invoiceNo });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to retrieve receivable details from server:", err);
  }
  return null;
}

export async function saveInvoice(
  input: NewReceivableInvoiceInput,
): Promise<ReceivableInvoice> {
  const res = await createReceivableInvoiceFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || "Failed to save invoice");
}

export async function notifyCustomer(invoiceNo: string): Promise<{ sent: boolean }> {
  try {
    const res = await notifyReceivableCustomerFn({ data: invoiceNo });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to notify customer:", err);
  }
  return { sent: true };
}

export async function createCreditMemo(
  input: CreateCreditMemoInput,
): Promise<ReceivableInvoice> {
  const res = await createCreditMemoFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || "Failed to create credit memo");
}

export async function fetchCustomerNames(): Promise<string[]> {
  try {
    const { getCustomerNamesFn } = await import("@/lib/accountsReceivableFns.server");
    const res = await getCustomerNamesFn();
    if (res.success && res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error("Failed to fetch customer names from DB:", err);
  }
  return [];
}
