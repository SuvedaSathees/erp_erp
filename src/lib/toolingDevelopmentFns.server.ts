import { createServerFn } from "@tanstack/react-start";
import type {
  ToolingApprovalDecision,
  ToolingFormInput,
  ToolingRecord,
  ToolingStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "tooling-development";

export function calculateToolingScores(record: Partial<ToolingRecord>) {
  const designScore = record.designReviewScore ?? 88;
  const manufacturingScore = record.manufacturingReadinessScore ?? 85;
  const validationScore = record.validationScore ?? 87;
  const readinessScore = record.readinessScore ?? 86;
  const performanceScore = record.performanceScore ?? 84;
  const aiScore = record.aiEngineeringScore ?? 89;

  const overallScore = Math.round(
    designScore * 0.20 +
      manufacturingScore * 0.20 +
      validationScore * 0.20 +
      readinessScore * 0.20 +
      performanceScore * 0.20
  );

  return {
    designReviewScore: designScore,
    manufacturingReadinessScore: manufacturingScore,
    validationScore,
    readinessScore,
    performanceScore,
    aiEngineeringScore: aiScore,
    overallToolReadiness: overallScore,
  };
}

export const DEFAULT_TOOLING_RECORD: ToolingRecord = {
  id: "proc-tool-rec-0078",
  toolingId: "TD-2024-0078",
  formCode: "TDF-2024-25",
  projectName: "EV Charger Assembly Fixture",
  toolVersion: "v1.2.0",
  workflowStatus: "In Progress" as ToolingStatus,
  stage: 5,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  toolingEngineerName: "Vikram Singh",
  businessUnit: "EV Solutions",
  ...calculateToolingScores({}),
} as any;

export const getToolingFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: ToolingRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_TOOLING_RECORD };
  }
);

export const saveToolingDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ToolingFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ToolingRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_TOOLING_RECORD;
    const updatedInput = { ...(base as any), ...data.input };
    const scores = calculateToolingScores(updatedInput);
    const record = {
      ...base,
      ...data.input,
      ...scores,
      projectName: (base as any).projectName ?? "",
      ownerName: (base as any).toolingEngineerName ?? "Vikram Singh",
      recordCode: (base as any).id ?? (base as any).toolingId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitToolingFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: ToolingRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_TOOLING_RECORD };
  });

export const reviewToolingFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      decision: ToolingApprovalDecision;
      comments?: string;
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; data: ToolingRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Tooling Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
