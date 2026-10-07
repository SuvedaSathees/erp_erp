import {
  getCostCentersFn,
  getCostCenterBudgetsFn,
  createCostCenterFn,
} from "@/lib/costCentersFns.server";
import type {
  CostCenterRecord,
  CostCenterBudget,
  NewCostCenterInput,
  NewSubCostCenterInput,
  DashboardQuery,
} from "./types";

export async function fetchCostCenterBudgets(query: DashboardQuery): Promise<CostCenterBudget[]> {
  const res = await getCostCenterBudgetsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function fetchCostCenters(query: DashboardQuery): Promise<CostCenterRecord[]> {
  const res = await getCostCentersFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function createCostCenter(input: NewCostCenterInput): Promise<CostCenterRecord> {
  const res = await createCostCenterFn({ data: input });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function createSubCostCenter(input: NewSubCostCenterInput): Promise<CostCenterRecord> {
  const res = await createCostCenterFn({
    data: {
      code: input.code,
      name: input.name,
      department: input.department,
      manager: input.manager,
      budget: input.budget,
      type: "Support",
      parentId: input.parentId,
    },
  });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export type CostCenterCommitment = {
  id: string;
  costCenter: string;
  description: string;
  commitmentAmount: number;
  status: string;
};

export async function fetchCommitments(): Promise<CostCenterCommitment[]> {
  try {
    const { getCostCenterCommitmentsFn } = await import("@/lib/costCentersFns.server");
    const res = await getCostCenterCommitmentsFn();
    if (res.success && res.data && res.data.length > 0) return res.data;
  } catch (err) {
    console.error("Failed to fetch commitments from DB:", err);
  }
  return [];
}
