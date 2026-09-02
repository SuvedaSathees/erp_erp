import {
  DEFAULT_RECORD,
  getCybersecurityEngineeringFn,
  reviewCybersecurityEngineeringFn,
  saveCybersecurityEngineeringDraftFn,
  submitCybersecurityEngineeringFn,
} from "@/lib/cybersecurityEngineeringFns.server";
import type {
  CybersecurityApprovalDecision,
  CybersecurityFormInput,
  CybersecurityRecord,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<CybersecurityRecord> {
  try {
    const res = await getCybersecurityEngineeringFn();
    return unwrap<CybersecurityRecord>(res);
  } catch (err) {
    console.warn("cybersecurityEngineeringService fetchRecord fallback:", err);
    return DEFAULT_RECORD;
  }
}

export async function saveDraft(
  input: Partial<CybersecurityFormInput>,
  id?: string
): Promise<CybersecurityRecord> {
  try {
    return unwrap<CybersecurityRecord>(
      await saveCybersecurityEngineeringDraftFn({ data: { id, input } })
    );
  } catch (err) {
    console.warn("saveDraft fallback triggered:", err);
    return {
      ...DEFAULT_RECORD,
      ...input,
      lastModified: new Date().toISOString(),
      lastUpdated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    };
  }
}

export async function submitForReview(id?: string): Promise<CybersecurityRecord> {
  try {
    return unwrap<CybersecurityRecord>(await submitCybersecurityEngineeringFn({ data: id }));
  } catch (err) {
    console.warn("submitForReview fallback triggered:", err);
    return {
      ...DEFAULT_RECORD,
      workflowStatus: "In Review",
      lastModified: new Date().toISOString(),
    };
  }
}

export async function reviewDecision(args: {
  id: string;
  decision: CybersecurityApprovalDecision;
  comments?: string;
}): Promise<CybersecurityRecord> {
  try {
    return unwrap<CybersecurityRecord>(await reviewCybersecurityEngineeringFn({ data: args }));
  } catch (err) {
    console.warn("reviewDecision fallback triggered:", err);
    return {
      ...DEFAULT_RECORD,
      approvalDecision: args.decision,
      reviewComments: args.comments ?? DEFAULT_RECORD.reviewComments,
      workflowStatus: args.decision === "Approved" ? "Approved" : "In Review",
      lastModified: new Date().toISOString(),
    };
  }
}

export const cybersecurityEngineeringService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
};
