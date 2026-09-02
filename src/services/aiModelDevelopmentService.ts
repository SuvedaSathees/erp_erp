import {
  DEFAULT_RECORD,
  getAiModelDevelopmentFn,
  reviewAiModelDevelopmentFn,
  saveAiModelDevelopmentDraftFn,
  submitAiModelDevelopmentFn,
} from "@/lib/aiModelDevelopmentFns.server";
import type {
  AiModelApprovalDecision,
  AiModelFormInput,
  AiModelRecord,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<AiModelRecord> {
  try {
    const res = await getAiModelDevelopmentFn();
    return unwrap<AiModelRecord>(res);
  } catch (err) {
    console.warn("aiModelDevelopmentService fetchRecord fallback:", err);
    return DEFAULT_RECORD;
  }
}

export async function saveDraft(
  input: Partial<AiModelFormInput>,
  id?: string
): Promise<AiModelRecord> {
  try {
    const res = await saveAiModelDevelopmentDraftFn({ data: { id, input } });
    return unwrap<AiModelRecord>(res);
  } catch (err) {
    console.warn("aiModelDevelopmentService saveDraft fallback:", err);
    const existing = await fetchRecord();
    const updated: AiModelRecord = {
      ...existing,
      aiProjectName: input.aiProjectName ?? existing.aiProjectName,
      businessObjective: input.businessObjective ?? existing.businessObjective,
      aiUseCase: input.aiUseCase ?? existing.aiUseCase,
      problemStatement: input.problemStatement ?? existing.problemStatement,
      expectedBusinessOutcome: input.expectedBusinessOutcome ?? existing.expectedBusinessOutcome,
      developmentStatus: input.developmentStatus ?? existing.developmentStatus,
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

export async function submitForReview(id?: string): Promise<AiModelRecord> {
  try {
    const res = await submitAiModelDevelopmentFn({ data: id });
    return unwrap<AiModelRecord>(res);
  } catch (err) {
    console.warn("aiModelDevelopmentService submitForReview fallback:", err);
    const existing = await fetchRecord();
    const updated: AiModelRecord = {
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
  decision: AiModelApprovalDecision;
  comments?: string;
}): Promise<AiModelRecord> {
  try {
    const res = await reviewAiModelDevelopmentFn({ data: args });
    return unwrap<AiModelRecord>(res);
  } catch (err) {
    console.warn("aiModelDevelopmentService reviewDecision fallback:", err);
    const existing = await fetchRecord();
    const updated: AiModelRecord = {
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

export const aiModelDevelopmentService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
};
