import {
  getFixedAssetsFn,
  getFixedAssetFn,
  createFixedAssetFn,
  transferFixedAssetFn,
  disposeFixedAssetFn,
  revalueFixedAssetFn,
  getAssetCategoriesFn,
  getAssetDisposalsFn,
  getAssetRevaluationsFn,
  getAssetTransfersFn,
} from "@/lib/fixedAssetsFns.server";
import type {
  FixedAsset,
  FixedAssetFilters,
  DashboardQuery,
  NewFixedAssetInput,
  AssetCategoryRecord,
  AssetDisposalRecord,
  AssetRevaluationRecord,
  AssetTransferRecord,
} from "./types";

export async function fetchFixedAssets(
  query: DashboardQuery,
  filters: FixedAssetFilters,
): Promise<FixedAsset[]> {
  const res = await getFixedAssetsFn({ data: filters });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function retrieveFixedAssetDetails(assetCode: string): Promise<FixedAsset | undefined> {
  const res = await getFixedAssetFn({ data: assetCode });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function saveFixedAsset(input: NewFixedAssetInput): Promise<FixedAsset> {
  const res = await createFixedAssetFn({ data: input });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data;
}

export async function transferFixedAsset(
  assetCode: string,
  destinationLocation: string,
  transferDate: string,
  authorizedBy: string,
): Promise<boolean> {
  const res = await transferFixedAssetFn({
    data: { assetCode, destinationLocation, transferDate, authorizedBy },
  });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return Boolean(res.data);
}

export async function disposeFixedAsset(
  assetCode: string,
  saleProceeds: number,
  disposalReason: string,
  disposalDate: string,
): Promise<boolean> {
  const res = await disposeFixedAssetFn({
    data: { assetCode, saleProceeds, disposalReason, disposalDate },
  });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return Boolean(res.data);
}

export async function revalueFixedAsset(
  assetCode: string,
  newMarketValue: number,
  reason: string,
  revaluationDate: string,
): Promise<boolean> {
  const res = await revalueFixedAssetFn({
    data: { assetCode, newMarketValue, reason, revaluationDate },
  });
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return Boolean(res.data);
}

export async function fetchAssetCategories(query: DashboardQuery): Promise<AssetCategoryRecord[]> {
  const res = await getAssetCategoriesFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function fetchAssetDisposals(query: DashboardQuery): Promise<AssetDisposalRecord[]> {
  const res = await getAssetDisposalsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function fetchAssetRevaluations(query: DashboardQuery): Promise<AssetRevaluationRecord[]> {
  const res = await getAssetRevaluationsFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}

export async function fetchAssetTransfers(query: DashboardQuery): Promise<AssetTransferRecord[]> {
  const res = await getAssetTransfersFn();
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return res.data || [];
}
