import { getTaxPaymentsFn, createTaxPaymentFn } from "@/lib/taxFns.server";
import type { TaxPayment, NewTaxPaymentInput, DashboardQuery } from "./types";

export async function fetchPayments(query: DashboardQuery): Promise<TaxPayment[]> {
  const res = await getTaxPaymentsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function recordTaxPayment(input: NewTaxPaymentInput): Promise<TaxPayment> {
  const res = await createTaxPaymentFn({ data: input });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}
