import {
  getGoToMarketFn,
  saveGoToMarketDraftFn,
  submitGoToMarketFn,
  reviewGoToMarketFn,
} from "@/lib/goToMarketFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getGoToMarketFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveGoToMarketDraftFn({ data: { id, input } }));
}

export async function submitForReview(id?: string): Promise<any> {
  return unwrap<any>(await submitGoToMarketFn({ data: id }));
}

export async function reviewDecision(args: { id: string; decision: string; comments?: string }): Promise<any> {
  return unwrap<any>(await reviewGoToMarketFn({ data: args }));
}

export const goToMarketService = { fetchRecord, saveDraft, submitForReview, reviewDecision };
