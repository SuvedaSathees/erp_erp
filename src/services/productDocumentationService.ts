import {
  DEFAULT_PRODUCT_DOCUMENTATION_RECORD,
  advanceStageFn,
  getProductDocumentationFn,
  reviewProductDocumentationFn,
  saveProductDocumentationDraftFn,
  submitProductDocumentationFn,
} from "@/lib/productDocumentationFns.server";
import type {
  ProductDocumentationApprovalDecision,
  ProductDocumentationFormInput,
  ProductDocumentationRecord,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<ProductDocumentationRecord> {
  try {
    const res = await getProductDocumentationFn();
    return unwrap<ProductDocumentationRecord>(res);
  } catch (err) {
    console.warn("productDocumentationService fetchRecord fallback:", err);
    return DEFAULT_PRODUCT_DOCUMENTATION_RECORD;
  }
}

export async function saveDraft(
  input: Partial<ProductDocumentationFormInput>,
  id?: string
): Promise<ProductDocumentationRecord> {
  try {
    const res = await saveProductDocumentationDraftFn({ data: { id, input } });
    return unwrap<ProductDocumentationRecord>(res);
  } catch (err) {
    console.warn("productDocumentationService saveDraft fallback:", err);
    const existing = await fetchRecord();
    const updated: ProductDocumentationRecord = {
      ...existing,
      documentTitle: input.documentTitle ?? existing.documentTitle,
      productName: input.productName ?? existing.productName,
      businessPurpose: input.businessPurpose ?? existing.businessPurpose,
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

export async function submitForReview(id?: string): Promise<ProductDocumentationRecord> {
  try {
    const res = await submitProductDocumentationFn({ data: id });
    return unwrap<ProductDocumentationRecord>(res);
  } catch (err) {
    console.warn("productDocumentationService submitForReview fallback:", err);
    const existing = await fetchRecord();
    const updated: ProductDocumentationRecord = {
      ...existing,
      stage: 3,
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
  decision: ProductDocumentationApprovalDecision;
  comments?: string;
}): Promise<ProductDocumentationRecord> {
  try {
    const res = await reviewProductDocumentationFn({ data: args });
    return unwrap<ProductDocumentationRecord>(res);
  } catch (err) {
    console.warn("productDocumentationService reviewDecision fallback:", err);
    const existing = await fetchRecord();
    const updated: ProductDocumentationRecord = {
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

export async function advanceStage(targetStage: 1 | 2 | 3): Promise<ProductDocumentationRecord> {
  try {
    const res = await advanceStageFn({ data: { targetStage } });
    return unwrap<ProductDocumentationRecord>(res);
  } catch (err) {
    console.warn("productDocumentationService advanceStage fallback:", err);
    const existing = await fetchRecord();
    const updated: ProductDocumentationRecord = {
      ...existing,
      stage: targetStage,
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

export const productDocumentationService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
  advanceStage,
};
