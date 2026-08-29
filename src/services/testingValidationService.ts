import {
  DEFAULT_RECORD,
  getTestingValidationFn,
  reviewTestingValidationFn,
  saveTestingValidationDraftFn,
  submitTestingValidationFn,
} from "@/lib/testingValidationFns.server";
import type {
  TestingApprovalDecision,
  TestingFormInput,
  TestingValidationRecord,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<TestingValidationRecord> {
  try {
    const res = await getTestingValidationFn();
    return unwrap<TestingValidationRecord>(res);
  } catch (err) {
    console.warn("testingValidationService fetchRecord fallback:", err);
    return DEFAULT_RECORD;
  }
}

export async function saveDraft(
  input: Partial<TestingFormInput>,
  id?: string
): Promise<TestingValidationRecord> {
  try {
    const res = await saveTestingValidationDraftFn({ data: { id, input } });
    return unwrap<TestingValidationRecord>(res);
  } catch (err) {
    console.warn("testingValidationService saveDraft fallback:", err);
    const existing = await fetchRecord();
    const updated: TestingValidationRecord = {
      ...existing,
      testPlanName: input.testPlanName ?? existing.testPlanName,
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

export async function submitForReview(id?: string): Promise<TestingValidationRecord> {
  try {
    const res = await submitTestingValidationFn({ data: id });
    return unwrap<TestingValidationRecord>(res);
  } catch (err) {
    console.warn("testingValidationService submitForReview fallback:", err);
    const existing = await fetchRecord();
    const updated: TestingValidationRecord = {
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
  decision: TestingApprovalDecision;
  comments?: string;
}): Promise<TestingValidationRecord> {
  try {
    const res = await reviewTestingValidationFn({ data: args });
    return unwrap<TestingValidationRecord>(res);
  } catch (err) {
    console.warn("testingValidationService reviewDecision fallback:", err);
    const existing = await fetchRecord();
    const updated: TestingValidationRecord = {
      ...existing,
      workflowStatus:
        args.decision === "Approved"
          ? "Approved"
          : args.decision === "Approved with Conditions"
          ? "Approved"
          : "In Review",
      approvalDecision: args.decision,
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

export const testingValidationService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
};
