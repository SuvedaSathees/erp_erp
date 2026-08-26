import {
  getPayableInvoicesFn,
  getPayableInvoiceDetailsFn,
  createPayableInvoiceFn,
  updatePayableApprovalStatusFn,
  getPayableAgingReportFn,
  getPayableKpisFn,
  getPayablePaymentInfoFn,
} from "@/lib/accountsPayableFns.server";
import { agingPayable, apKpisRaw } from "@/lib/mock-data";
import type {
  AgingReport,
  DashboardQuery,
  InvoiceFilters,
  InvoiceSearchResult,
  NewInvoiceInput,
  PayableInvoice,
  PaymentDetail,
} from "./types";

export async function fetchOutstandingPayables(query: DashboardQuery): Promise<AgingReport> {
  try {
    const res = await getPayableAgingReportFn({ data: query });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to fetch payable aging report from server:", err);
  }
  return agingPayable;
}

export async function retrievePaymentInformation(ref: string): Promise<PaymentDetail | null> {
  try {
    const res = await getPayablePaymentInfoFn({ data: ref });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to retrieve payment info from server:", err);
  }
  return null;
}

// -- Accounts Payable dashboard KPIs --

export async function calculateTotalPayables(query: DashboardQuery): Promise<number> {
  try {
    const res = await getPayableKpisFn({ data: query });
    if (res.success && res.data) return res.data.totalPayables;
  } catch (err) {
    console.error("Failed to calculate total payables from server:", err);
  }
  return apKpisRaw.totalPayables;
}

export async function calculateOverdueAmount(
  query: DashboardQuery,
): Promise<{ amount: number; pctOfTotal: number }> {
  try {
    const res = await getPayableKpisFn({ data: query });
    if (res.success && res.data) {
      return { amount: res.data.overdueAmount, pctOfTotal: res.data.overduePctOfTotal };
    }
  } catch (err) {
    console.error("Failed to calculate overdue amount from server:", err);
  }
  return { amount: apKpisRaw.overdueAmount, pctOfTotal: apKpisRaw.overduePctOfTotal };
}

export async function calculateDueWithin30Days(
  query: DashboardQuery,
): Promise<{ amount: number; pctOfTotal: number }> {
  try {
    const res = await getPayableKpisFn({ data: query });
    if (res.success && res.data) {
      return { amount: res.data.dueWithin30Days, pctOfTotal: res.data.dueWithin30PctOfTotal };
    }
  } catch (err) {
    console.error("Failed to calculate due within 30 days from server:", err);
  }
  return { amount: apKpisRaw.dueWithin30Days, pctOfTotal: apKpisRaw.dueWithin30PctOfTotal };
}

export async function countOpenInvoices(query: DashboardQuery): Promise<number> {
  try {
    const res = await getPayableKpisFn({ data: query });
    if (res.success && res.data) return res.data.openInvoices;
  } catch (err) {
    console.error("Failed to count open invoices from server:", err);
  }
  return apKpisRaw.openInvoices;
}

// -- Invoice list & detail --

export async function retrieveInvoiceList(
  query: DashboardQuery,
  filters: InvoiceFilters,
): Promise<InvoiceSearchResult> {
  try {
    const res = await getPayableInvoicesFn({ data: { query, filters } });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to retrieve invoice list from server:", err);
  }
  return { rows: [], total: 0 };
}

export async function retrieveInvoiceDetails(invoiceNo: string): Promise<PayableInvoice | null> {
  try {
    const res = await getPayableInvoiceDetailsFn({ data: invoiceNo });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to retrieve invoice details from server:", err);
  }
  return null;
}

export async function saveInvoice(input: NewInvoiceInput): Promise<PayableInvoice> {
  const res = await createPayableInvoiceFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || "Failed to save invoice");
}

export async function updateApprovalStatus(
  invoiceNo: string,
  approved: boolean,
): Promise<PayableInvoice> {
  const res = await updatePayableApprovalStatusFn({ data: { invoiceNo, approved } });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || `Failed to update approval status for ${invoiceNo}`);
}
