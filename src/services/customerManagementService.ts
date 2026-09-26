import { getCustomerProfileFn } from "@/lib/accountsReceivableFns.server";
import type { CustomerProfile } from "./types";

export async function fetchCustomerInformation(customerName: string): Promise<CustomerProfile | null> {
  try {
    const res = await getCustomerProfileFn({ data: customerName });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to fetch customer info from server:", err);
  }
  return null;
}
