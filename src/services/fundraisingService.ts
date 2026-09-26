import {
  getFundraisingFn,
  saveFundraisingDraftFn,
  submitFundraisingFn,
  reviewFundraisingFn,
} from "@/lib/fundraisingFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getFundraisingFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveFundraisingDraftFn({ data: { id, input } }));
}

export async function submitForReview(id?: string): Promise<any> {
  return unwrap<any>(await submitFundraisingFn({ data: id }));
}

export async function reviewDecision(args: {
  id: string;
  decision: string;
  comments?: string;
}): Promise<any> {
  return unwrap<any>(await reviewFundraisingFn({ data: args }));
}

export const fundraisingService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
};
