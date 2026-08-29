import {
  DEFAULT_PLM_RECORD,
  advancePlmStageFn,
  getPlmFn,
  reviewPlmFn,
  savePlmDraftFn,
  submitPlmFn,
  togglePlmChecklistFn,
} from "@/lib/plmFns.server";
import type {
  PlmApprovalDecision,
  PlmFormInput,
  PlmRecord,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<PlmRecord> {
  try {
    const res = await getPlmFn();
    return unwrap<PlmRecord>(res);
  } catch (err) {
    console.warn("plmService fetchRecord fallback:", err);
    return DEFAULT_PLM_RECORD;
  }
}

export async function saveDraft(
  input: Partial<PlmFormInput>,
  id?: string
): Promise<PlmRecord> {
  try {
    const res = await savePlmDraftFn({ data: { id, input } });
    return unwrap<PlmRecord>(res);
  } catch (err) {
    console.warn("plmService saveDraft fallback:", err);
    const existing = await fetchRecord();
    const updated: PlmRecord = {
      ...existing,
      productName: input.productName ?? existing.productName,
      description: input.description ?? existing.description,
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

export async function submitForReview(id?: string): Promise<PlmRecord> {
  try {
    const res = await submitPlmFn({ data: id });
    return unwrap<PlmRecord>(res);
  } catch (err) {
    console.warn("plmService submitForReview fallback:", err);
    const existing = await fetchRecord();
    const updated: PlmRecord = {
      ...existing,
      currentPhase: 3,
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
  decision: PlmApprovalDecision;
  comments?: string;
}): Promise<PlmRecord> {
  try {
    const res = await reviewPlmFn({ data: args });
    return unwrap<PlmRecord>(res);
  } catch (err) {
    console.warn("plmService reviewDecision fallback:", err);
    const existing = await fetchRecord();
    const updated: PlmRecord = {
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

export async function advanceStage(targetStage: 1 | 2 | 3 | 4): Promise<PlmRecord> {
  try {
    const res = await advancePlmStageFn({ data: { targetStage } });
    return unwrap<PlmRecord>(res);
  } catch (err) {
    console.warn("plmService advanceStage fallback:", err);
    const existing = await fetchRecord();
    const updated: PlmRecord = {
      ...existing,
      currentPhase: targetStage,
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

export async function toggleChecklistItem(
  section: "engineering" | "manufacturing" | "service",
  itemId: string
): Promise<PlmRecord> {
  try {
    const res = await togglePlmChecklistFn({ data: { section, itemId } });
    return unwrap<PlmRecord>(res);
  } catch (err) {
    console.warn("plmService toggleChecklistItem fallback:", err);
    const existing = await fetchRecord();
    return existing;
  }
}

export const plmService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
  advanceStage,
  toggleChecklistItem,
};
