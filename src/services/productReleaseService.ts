import {
  DEFAULT_PRODUCT_RELEASE_RECORD,
  advanceReleaseStageFn,
  getProductReleaseFn,
  reviewProductReleaseFn,
  saveProductReleaseDraftFn,
  submitProductReleaseFn,
  toggleChecklistItemFn,
} from "@/lib/productReleaseFns.server";
import type {
  ProductReleaseApprovalDecision,
  ProductReleaseFormInput,
  ProductReleaseRecord,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function unwrap<T>(res: any): T {
  if (res && "success" in res && !res.success) throw new Error(res.error);
  return (res.data ?? res) as T;
}

export async function fetchRecord(): Promise<ProductReleaseRecord> {
  try {
    const res = await getProductReleaseFn();
    return unwrap<ProductReleaseRecord>(res);
  } catch (err) {
    console.warn("productReleaseService fetchRecord fallback:", err);
    return DEFAULT_PRODUCT_RELEASE_RECORD;
  }
}

export async function saveDraft(
  input: Partial<ProductReleaseFormInput>,
  id?: string
): Promise<ProductReleaseRecord> {
  try {
    const res = await saveProductReleaseDraftFn({ data: { id, input } });
    return unwrap<ProductReleaseRecord>(res);
  } catch (err) {
    console.warn("productReleaseService saveDraft fallback:", err);
    const existing = await fetchRecord();
    const updated: ProductReleaseRecord = {
      ...existing,
      releaseName: input.releaseName ?? existing.releaseName,
      releaseObjective: input.releaseObjective ?? existing.releaseObjective,
      releasePriority: input.releasePriority ?? existing.releasePriority,
      plannedReleaseDate: input.plannedReleaseDate ?? existing.plannedReleaseDate,
      rolloutStrategy: input.rolloutStrategy ?? existing.rolloutStrategy,
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

export async function submitForReview(id?: string): Promise<ProductReleaseRecord> {
  try {
    const res = await submitProductReleaseFn({ data: id });
    return unwrap<ProductReleaseRecord>(res);
  } catch (err) {
    console.warn("productReleaseService submitForReview fallback:", err);
    const existing = await fetchRecord();
    const updated: ProductReleaseRecord = {
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
  decision: ProductReleaseApprovalDecision;
  comments?: string;
}): Promise<ProductReleaseRecord> {
  try {
    const res = await reviewProductReleaseFn({ data: args });
    return unwrap<ProductReleaseRecord>(res);
  } catch (err) {
    console.warn("productReleaseService reviewDecision fallback:", err);
    const existing = await fetchRecord();
    const updated: ProductReleaseRecord = {
      ...existing,
      workflowStatus:
        args.decision === "Approved"
          ? "Approved"
          : args.decision === "Approved with Conditions"
          ? "Approved"
          : args.decision === "Revision Required"
          ? "In Review"
          : "Rejected",
      approvalDecision: args.decision,
      reviewComments: args.comments ?? existing.reviewComments,
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

export async function advanceStage(targetStage: 1 | 2 | 3): Promise<ProductReleaseRecord> {
  try {
    const res = await advanceReleaseStageFn({ data: { targetStage } });
    return unwrap<ProductReleaseRecord>(res);
  } catch (err) {
    console.warn("productReleaseService advanceStage fallback:", err);
    const existing = await fetchRecord();
    const updated: ProductReleaseRecord = {
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

export async function toggleChecklistItem(
  section: "engineering" | "manufacturing" | "commercial",
  itemId: string
): Promise<ProductReleaseRecord> {
  try {
    const res = await toggleChecklistItemFn({ data: { section, itemId } });
    return unwrap<ProductReleaseRecord>(res);
  } catch (err) {
    console.warn("productReleaseService toggleChecklistItem fallback:", err);
    const existing = await fetchRecord();
    const sectionKey =
      section === "engineering"
        ? "engineeringChecklist"
        : section === "manufacturing"
        ? "manufacturingChecklist"
        : "commercialChecklist";
    const currentList = existing[sectionKey] || [];
    const updatedList = currentList.map((item) =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    const updated: ProductReleaseRecord = {
      ...existing,
      [sectionKey]: updatedList,
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

export const productReleaseService = {
  fetchRecord,
  saveDraft,
  submitForReview,
  reviewDecision,
  advanceStage,
  toggleChecklistItem,
};
