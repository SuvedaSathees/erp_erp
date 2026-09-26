import {
  getBusinessModelFn,
  saveBusinessModelDraftFn,
  submitBusinessModelFn,
  reviewBusinessModelFn,
} from "@/lib/businessModelFns.server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<any> {
  return unwrap<any>(await getBusinessModelFn());
}

export async function saveDraft(input: any, id?: string): Promise<any> {
  return unwrap<any>(await saveBusinessModelDraftFn({ data: { id, input } }));
}

export async function submitForReview(id?: string): Promise<any> {
  return unwrap<any>(await submitBusinessModelFn({ data: id }));
}

export async function reviewDecision(args: { id: string; decision: string; comments?: string }): Promise<any> {
  return unwrap<any>(await reviewBusinessModelFn({ data: args }));
}

export const businessModelService = { fetchRecord, saveDraft, submitForReview, reviewDecision };
