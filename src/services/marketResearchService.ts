import {
  getMarketResearchFn,
  saveMarketResearchDraftFn,
  submitMarketResearchFn,
  reviewMarketResearchFn,
  generateMarketResearchReportFn,
} from "@/lib/marketResearchFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getMarketResearchFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveMarketResearchDraftFn({ data: { id, input } }));
}

export async function submitForReview(id: string): Promise<any> {
  return unwrap<any>(await submitMarketResearchFn({ data: id }));
}

export async function reviewDecision(args: {
  id: string;
  decision: string;
  comments?: string;
}): Promise<any> {
  return unwrap<any>(await reviewMarketResearchFn({ data: args }));
}

export async function generateReport(id: string): Promise<any> {
  return unwrap<any>(await generateMarketResearchReportFn({ data: id }));
}

export const marketResearchService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
  generateReport,
};
