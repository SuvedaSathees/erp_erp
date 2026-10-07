import {
  getSalesChannelFn,
  saveSalesChannelDraftFn,
  submitSalesChannelFn,
  reviewSalesChannelFn,
} from "@/lib/salesChannelFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getSalesChannelFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveSalesChannelDraftFn({ data: { id, input } }));
}

export async function submitForReview(id?: string): Promise<any> {
  return unwrap<any>(await submitSalesChannelFn({ data: id }));
}

export async function reviewDecision(args: { id: string; decision: string; comments?: string }): Promise<any> {
  return unwrap<any>(await reviewSalesChannelFn({ data: args }));
}

export const salesChannelService = { fetchRecord, saveDraft, submitForReview, reviewDecision };
