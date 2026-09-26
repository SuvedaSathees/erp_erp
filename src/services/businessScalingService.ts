import {
  getBusinessScalingFn,
  saveBusinessScalingDraftFn,
  submitBusinessScalingFn,
  reviewBusinessScalingFn,
} from "@/lib/businessScalingFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getBusinessScalingFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveBusinessScalingDraftFn({ data: { id, input } }));
}

export async function submitForReview(id?: string): Promise<any> {
  return unwrap<any>(await submitBusinessScalingFn({ data: id }));
}

export async function reviewDecision(args: {
  id: string;
  decision: string;
  comments?: string;
}): Promise<any> {
  return unwrap<any>(await reviewBusinessScalingFn({ data: args }));
}

export const businessScalingService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
};
