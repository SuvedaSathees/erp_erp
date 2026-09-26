import { getVendorProfileFn } from "@/lib/accountsPayableFns.server";
import { apVendorDirectory, vendors as vendorsFallback } from "@/lib/mock-data";
import type { VendorProfile } from "./types";

export async function fetchVendorInformation(vendorName: string): Promise<VendorProfile | null> {
  try {
    const res = await getVendorProfileFn({ data: vendorName });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to fetch vendor info from server:", err);
  }

  const record = apVendorDirectory[vendorName];
  if (!record) return null;
  return {
    id: record.id,
    name: vendorName,
    category: record.category,
    email: record.email,
    phone: record.phone,
    paymentTerms: record.paymentTerms,
    outstandingBalance: 0,
    status: record.status,
  };
}

export async function fetchVendorList() {
  try {
    const { getVendorListFn } = await import("@/lib/accountsPayableFns.server");
    const res = await getVendorListFn();
    if (res.success && res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error("Failed to fetch vendor list from DB:", err);
  }
  return vendorsFallback;
}
