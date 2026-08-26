import { getPayableKpisFn, recordPayablePaymentFn } from "@/lib/accountsPayableFns.server";
import { apKpisRaw } from "@/lib/mock-data";
import type { DashboardQuery, PayableInvoice, RecordPaymentInput } from "./types";

// Matches the diagram's "Retrieve Paid Amount" step.
export async function retrievePaidAmount(query: DashboardQuery): Promise<number> {
  try {
    const res = await getPayableKpisFn({ data: query });
    if (res.success && res.data) return res.data.paidThisMonth;
  } catch (err) {
    console.error("Failed to retrieve paid amount from server:", err);
  }
  return apKpisRaw.paidThisMonth;
}

export async function processPayment(input: RecordPaymentInput): Promise<PayableInvoice> {
  const res = await recordPayablePaymentFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || `Invoice ${input.invoiceNo} not found`);
}
