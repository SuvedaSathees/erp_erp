import { getTaxFilingsFn, createTaxFilingFn } from "@/lib/taxFns.server";
import type { TaxFiling, NewFilingInput, DashboardQuery } from "./types";

export async function fetchFilings(query: DashboardQuery): Promise<TaxFiling[]> {
  const res = await getTaxFilingsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function createFiling(input: NewFilingInput): Promise<TaxFiling> {
  const res = await createTaxFilingFn({ data: input });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function importTaxReturn(
  fileData: Record<string, unknown>,
): Promise<{ success: boolean; importedCount: number }> {
  console.log("Importing tax return file data:", fileData);
  return { success: true, importedCount: 1 };
}

export async function fetchTaxCalendar(
  query: DashboardQuery,
): Promise<{ title: string; date: string; type: "filing" | "payment" }[]> {
  return [
    { title: "GST Return filing due", date: "2025-05-20", type: "filing" },
    { title: "TDS Salaries Payment due", date: "2025-05-31", type: "payment" },
    { title: "VAT Return filing due", date: "2025-05-25", type: "filing" },
    { title: "Professional Tax Payment", date: "2025-06-15", type: "payment" },
    { title: "Income Tax Advance Tax Q1", date: "2025-06-30", type: "payment" },
  ];
}
