import { createServerFn } from "@tanstack/react-start";
import type {
  ApiDevelopmentApprovalDecision,
  ApiDevelopmentFormInput,
  ApiDevelopmentRecord,
  ApiDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "api-development";

export function calculateApiDevelopmentScores(input: Partial<ApiDevelopmentFormInput>) {
  const designReadiness = 92;
  const securityReadiness = 90;
  const testingReadiness = 88;
  const deploymentReadiness = 89;
  const operationalScore = 89;

  const overallApiScore = Math.round(
    designReadiness * 0.25 +
      securityReadiness * 0.25 +
      testingReadiness * 0.2 +
      deploymentReadiness * 0.15 +
      operationalScore * 0.15
  );

  return {
    designReadinessScore: designReadiness,
    securityScore: securityReadiness,
    validationScore: testingReadiness,
    deploymentReadinessScore: deploymentReadiness,
    operationalScore,
    overallApiScore,
  };
}

const DEFAULT_RECORD: ApiDevelopmentRecord = {
  id: "api-rec-0017",
  apiDevelopmentId: "API-2024-0017",
  formCode: "APF-2024-25",
  apiProjectName: "EV Charging APIs",
  apiVersion: "v2.1.0",
  workflowStatus: "In Review",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  linkedProductId: "Smart EV Platform",
  apiArchitectName: "Rahul Sharma",
  apiArchitectAvatar: "",
  businessUnit: "EV Mobility Division",
  ...calculateApiDevelopmentScores({}),
} as any;

export { DEFAULT_RECORD };

export const getApiDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: ApiDevelopmentRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_RECORD };
  }
);

export const saveApiDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ApiDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ApiDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateApiDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).apiProjectName ?? "",
      ownerName: (base as any).apiArchitectName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).apiDevelopmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitApiDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: ApiDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_RECORD };
  });

export const reviewApiDevelopmentFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      decision: ApiDevelopmentApprovalDecision;
      comments?: string;
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; data: ApiDevelopmentRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "API Architecture Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
