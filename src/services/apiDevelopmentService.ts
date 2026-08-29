import {
  DEFAULT_RECORD,
  getApiDevelopmentFn,
  reviewApiDevelopmentFn,
  saveApiDevelopmentDraftFn,
  submitApiDevelopmentFn,
} from "@/lib/apiDevelopmentFns.server";
import type {
  ApiDevelopmentApprovalDecision,
  ApiDevelopmentFormInput,
  ApiDevelopmentRecord,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<ApiDevelopmentRecord> {
  try {
    const res = await getApiDevelopmentFn();
    return unwrap<ApiDevelopmentRecord>(res);
  } catch (err) {
    console.warn("apiDevelopmentService fetchRecord fallback:", err);
    return DEFAULT_RECORD;
  }
}

export async function saveDraft(
  input: Partial<ApiDevelopmentFormInput>,
  id?: string
): Promise<ApiDevelopmentRecord> {
  try {
    const res = await saveApiDevelopmentDraftFn({ data: { id, input } });
    return unwrap<ApiDevelopmentRecord>(res);
  } catch (err) {
    console.warn("apiDevelopmentService saveDraft fallback:", err);
    const existing = await fetchRecord();
    const updated: ApiDevelopmentRecord = {
      ...existing,
      apiProjectName: input.apiProjectName ?? existing.apiProjectName,
      businessObjective: input.businessObjective ?? existing.businessObjective,
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    return updated;
  }
}

export async function submitForReview(id?: string): Promise<ApiDevelopmentRecord> {
  try {
    const res = await submitApiDevelopmentFn({ data: id });
    return unwrap<ApiDevelopmentRecord>(res);
  } catch (err) {
    console.warn("apiDevelopmentService submitForReview fallback:", err);
    const existing = await fetchRecord();
    const updated: ApiDevelopmentRecord = {
      ...existing,
      workflowStatus: "In Review",
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    return updated;
  }
}

export async function reviewDecision(args: {
  id: string;
  decision: ApiDevelopmentApprovalDecision;
  comments?: string;
}): Promise<ApiDevelopmentRecord> {
  try {
    const res = await reviewApiDevelopmentFn({ data: args });
    return unwrap<ApiDevelopmentRecord>(res);
  } catch (err) {
    console.warn("apiDevelopmentService reviewDecision fallback:", err);
    const existing = await fetchRecord();
    const updated: ApiDevelopmentRecord = {
      ...existing,
      workflowStatus: args.decision === "Approved" ? "Approved" : args.decision === "Approved with Conditions" ? "Approved" : "In Review",
      lastUpdated: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    return updated;
  }
}

export const apiDevelopmentService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
};
