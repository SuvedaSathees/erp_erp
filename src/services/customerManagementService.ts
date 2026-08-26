import { getCustomerProfileFn } from "@/lib/accountsReceivableFns.server";
import { arCustomerDirectory } from "@/lib/mock-data";
import type { CustomerProfile } from "./types";

export async function fetchCustomerInformation(customerName: string): Promise<CustomerProfile | null> {
  try {
    const res = await getCustomerProfileFn({ data: customerName });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to fetch customer info from server:", err);
  }

  const record = arCustomerDirectory[customerName];
  if (!record) return null;
  return {
    id: record.id,
    name: customerName,
    category: record.category,
    email: record.email,
    phone: record.phone,
    paymentTerms: record.paymentTerms,
    outstandingBalance: 0,
    status: record.status,
  };
}
