import { getDepartmentBudgetsFn } from "@/lib/budgetingFns.server";
import { apiRequest } from "./apiClient";
import { mockDepartmentsMaster } from "@/lib/mock-data";
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

// Master-data list (Administration module) — distinct from the budget-context
// fetch above; same service boundary, different responsibility.
export function fetchDepartments(): Promise<DepartmentRecord[]> {
  return apiRequest(`/api/administration/departments`, () => mockDepartmentsMaster);
}

export function createDepartment(input: NewDepartmentInput): Promise<DepartmentRecord> {
  return apiRequest(`/api/administration/departments`, () => {
    const branch = mockDepartmentsMaster.find((d) => d.branchId === input.branchId);
    const newDept: DepartmentRecord = {
      id: `DP-00${mockDepartmentsMaster.length + 1}`,
      code: input.code,
      name: input.name,
      companyId: branch?.companyId ?? "CO-001",
      branchId: input.branchId,
      branchName: branch?.branchName ?? "Bengaluru HQ",
      head: input.head,
      employeeCount: 0,
      status: "Active",
    };
    mockDepartmentsMaster.push(newDept);
    return newDept;
  });
}
