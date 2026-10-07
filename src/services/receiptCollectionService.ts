import { getReceivableKpisFn, recordReceivableReceiptFn } from "@/lib/accountsReceivableFns.server";
import type { DashboardQuery, ReceivableInvoice, ReceivePaymentInput } from "./types";

export async function retrieveCollectionAmount(query: DashboardQuery): Promise<number> {
  try {
    const res = await getReceivableKpisFn({ data: query });
    if (res.success && res.data) return res.data.collectedThisMonth;
  } catch (err) {
    console.error("Failed to retrieve collection amount from server:", err);
  }
  return 0;
}

export async function recordReceipt(input: ReceivePaymentInput): Promise<ReceivableInvoice> {
  const res = await recordReceivableReceiptFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || `Invoice ${input.invoiceNo} not found`);
}
