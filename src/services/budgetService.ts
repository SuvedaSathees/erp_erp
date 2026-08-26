import {
  getBudgetVersionsFn,
  getProjectBudgetsFn,
  createBudgetFn,
  createBudgetVersionFn,
  compareBudgetVersionsFn,
} from "@/lib/budgetingFns.server";
import type {
  BudgetVersion,
  NewBudgetInput,
  NewBudgetVersionInput,
  BudgetComparisonReport,
  ProjectBudget,
  DashboardQuery,
} from "./types";

export async function fetchBudgetVersions(query: DashboardQuery): Promise<BudgetVersion[]> {
  const res = await getBudgetVersionsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function fetchProjectBudgets(query: DashboardQuery): Promise<ProjectBudget[]> {
  const res = await getProjectBudgetsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function saveBudget(input: NewBudgetInput): Promise<BudgetVersion> {
  const res = await createBudgetFn({ data: input });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function saveBudgetVersion(input: NewBudgetVersionInput): Promise<BudgetVersion> {
  const res = await createBudgetVersionFn({ data: input });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function compareBudgetVersions(
  v1Id: string,
  v2Id: string,
): Promise<BudgetComparisonReport> {
  const res = await compareBudgetVersionsFn({ data: { v1Id, v2Id } });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}
