import { createServerFn } from "@tanstack/react-start";
import type {
  UiUxDevelopmentApprovalDecision,
  UiUxDevelopmentFormInput,
  UiUxDevelopmentRecord,
  UiUxDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "uiux-development";

export function calculateUiUxDevelopmentScores(input: Partial<UiUxDevelopmentFormInput>) {
  const researchReadiness = input.researchReadinessScore ?? 88;
  const uxReadiness = input.uxReadinessScore ?? 88;
  const uiReadiness = input.uiReadinessScore ?? 87;
  const accessibilityScore = input.accessibilityScore ?? 90;
  const developmentReadiness = input.developmentReadinessScore ?? 90;

  const overallDesignScore = Math.round(
    researchReadiness * 0.15 +
      uxReadiness * 0.25 +
      uiReadiness * 0.25 +
      accessibilityScore * 0.15 +
      developmentReadiness * 0.2
  );

  return {
    researchReadiness,
    uxReadiness,
    uiReadiness,
    accessibilityScore,
    developmentReadiness,
    overallDesignScore: input.overallDesignScore ?? overallDesignScore,
  };
}

const DEFAULT_RECORD: UiUxDevelopmentRecord = {
  id: "uiux-rec-0017",
  uiUxDevelopmentId: "UIUX-2024-0017",
  formCode: "UIUX-F-2024-25",
  uiUxProjectName: "Smart EV Charger UI/UX",
  designVersion: "v2.1.0",
  workflowStatus: "In Review",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  designerName: "Rahul Sharma",
  designerAvatar: "",
  businessUnit: "EV Mobility Division",
  ...calculateUiUxDevelopmentScores({}),
} as any;

export { DEFAULT_RECORD };

export const getUiUxDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: UiUxDevelopmentRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_RECORD };
  }
);

export const saveUiUxDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<UiUxDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: UiUxDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateUiUxDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).uiUxProjectName ?? "",
      ownerName: (base as any).designerName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).uiUxDevelopmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitUiUxDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: UiUxDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_RECORD };
  });

export const reviewUiUxDevelopmentFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      decision: UiUxDevelopmentApprovalDecision;
      comments?: string;
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; data: UiUxDevelopmentRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "UX Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
