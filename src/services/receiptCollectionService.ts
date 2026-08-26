import { getReceivableKpisFn, recordReceivableReceiptFn } from "@/lib/accountsReceivableFns.server";
import { arKpisRaw } from "@/lib/mock-data";
import type { DashboardQuery, ReceivableInvoice, ReceivePaymentInput } from "./types";

// Matches the diagram's "Retrieve Collection Summary" step for the KPI row.
export async function retrieveCollectionAmount(query: DashboardQuery): Promise<number> {
  try {
    const res = await getReceivableKpisFn({ data: query });
    if (res.success && res.data) return res.data.collectedThisMonth;
  } catch (err) {
    console.error("Failed to retrieve collection amount from server:", err);
  }
  return arKpisRaw.collectedThisMonth;
}

export async function recordReceipt(input: ReceivePaymentInput): Promise<ReceivableInvoice> {
  const res = await recordReceivableReceiptFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || `Invoice ${input.invoiceNo} not found`);
}
