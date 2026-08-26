import {
  getTaxObligationsFn,
  getTaxObligationFn,
  getTaxAuthoritiesFn,
} from "@/lib/taxFns.server";
import type { TaxObligation, TaxAuthority, DashboardQuery } from "./types";

export async function fetchObligations(query: DashboardQuery): Promise<TaxObligation[]> {
  const res = await getTaxObligationsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function retrieveTaxDetails(obligationId: string): Promise<TaxObligation> {
  const res = await getTaxObligationFn({ data: obligationId });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (
    res.data || {
      id: obligationId,
      taxType: "General Tax",
      jurisdiction: "India",
      period: "Current",
      dueDate: new Date().toISOString().slice(0, 10),
      taxLiability: 0,
      paid: 0,
      payable: 0,
      status: "Pending",
    }
  );
}

export async function fetchTaxAuthorities(query: DashboardQuery): Promise<TaxAuthority[]> {
  const res = await getTaxAuthoritiesFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}
