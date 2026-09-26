import { getVendorProfileFn } from "@/lib/accountsPayableFns.server";
import type { VendorProfile } from "./types";

export async function fetchVendorInformation(vendorName: string): Promise<VendorProfile | null> {
  try {
    const res = await getVendorProfileFn({ data: vendorName });
    if (res.success && res.data) return res.data;
  } catch (err) {
    console.error("Failed to fetch vendor info from server:", err);
  }
  return null;
}

export async function fetchVendorList() {
  try {
    const { getVendorListFn } = await import("@/lib/accountsPayableFns.server");
    const res = await getVendorListFn();
    if (res.success && res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error("Failed to fetch vendor list from DB:", err);
  }
  return [];
}
