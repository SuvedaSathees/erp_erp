import { getDepreciationRunsFn, executeDepreciationFn } from "@/lib/fixedAssetsFns.server";
import type { DashboardQuery, DepreciationRun } from "./types";

export async function executeDepreciation(
  query: DashboardQuery,
  method: string,
  executedBy: string,
): Promise<DepreciationRun> {
  const res = await executeDepreciationFn({ data: { method, executedBy } });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function fetchDepreciationRuns(query: DashboardQuery): Promise<DepreciationRun[]> {
  const res = await getDepreciationRunsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}
