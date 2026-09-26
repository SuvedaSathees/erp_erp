import { getDepartmentBudgetsFn } from "@/lib/budgetingFns.server";
import type {
  DepartmentBudget,
  DepartmentRecord,
  NewDepartmentInput,
  DashboardQuery,
} from "./types";

export async function fetchDepartmentBudgets(query: DashboardQuery): Promise<DepartmentBudget[]> {
  const res = await getDepartmentBudgetsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function fetchDepartments(): Promise<DepartmentRecord[]> {
  try {
    const { getDepartmentMasterListFn } = await import("@/lib/adminFns.server");
    const res = await getDepartmentMasterListFn();
    if (res.success && res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error("Failed to fetch departments from DB:", err);
  }
  return [];
}

export async function createDepartment(input: NewDepartmentInput): Promise<DepartmentRecord> {
  const { createDepartmentMasterFn } = await import("@/lib/adminFns.server");
  const res = await createDepartmentMasterFn({ data: input });
  if (res.success && res.data) return res.data;
  throw new Error(res.error || "Failed to create department");
}
