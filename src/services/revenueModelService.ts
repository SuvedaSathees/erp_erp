import {
  getRevenueModelFn,
  saveRevenueModelDraftFn,
  submitRevenueModelFn,
  reviewRevenueModelFn,
} from "@/lib/revenueModelFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getRevenueModelFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveRevenueModelDraftFn({ data: { id, input } }));
}

export async function submitForReview(id?: string): Promise<any> {
  return unwrap<any>(await submitRevenueModelFn({ data: id }));
}

export async function reviewDecision(args: { id: string; decision: string; comments?: string }): Promise<any> {
  return unwrap<any>(await reviewRevenueModelFn({ data: args }));
}

export const revenueModelService = { fetchRecord, saveDraft, submitForReview, reviewDecision };
