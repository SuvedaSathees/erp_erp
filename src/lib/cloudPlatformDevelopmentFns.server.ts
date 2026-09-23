import { createServerFn } from "@tanstack/react-start";
import type {
  CloudPlatformApprovalDecision,
  CloudPlatformFormInput,
  CloudPlatformRecord,
  CloudPlatformStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "cloud-platform-development";

export function calculateCloudPlatformScores(input: Partial<CloudPlatformFormInput>) {
  const architecture = 88;
  const security = 90;
  const infrastructure = 87;
  const operations = 88;
  const performance = 92;

  const overallScore = Math.round(
    architecture * 0.25 +
      security * 0.25 +
      infrastructure * 0.2 +
      operations * 0.15 +
      performance * 0.15
  );

  return {
    architectureReadinessScore: architecture,
    securityScore: security,
    infrastructureReadinessScore: infrastructure,
    operationsReadinessScore: operations,
    performanceScore: performance,
    overallCloudPlatformScore: overallScore,
  };
}

const DEFAULT_RECORD: CloudPlatformRecord = {
  id: "cld-rec-0001",
  cloudPlatformDevelopmentId: "CLD-2024-0001",
  formCode: "CLD-F-2024-25",
  cloudProjectName: "Magnertia Cloud Platform",
  platformVersion: "v2.1.0",
  workflowStatus: "In Review",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  cloudArchitectName: "Rahul Sharma",
  cloudArchitectAvatar: "",
  businessUnit: "EV Solutions",
  ...calculateCloudPlatformScores({}),
} as any;

export { DEFAULT_RECORD };

export const getCloudPlatformDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: CloudPlatformRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_RECORD };
  }
);

export const saveCloudPlatformDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<CloudPlatformFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: CloudPlatformRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateCloudPlatformScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).cloudProjectName ?? "",
      ownerName: (base as any).cloudArchitectName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).cloudPlatformDevelopmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitCloudPlatformDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: CloudPlatformRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_RECORD };
  });

export const reviewCloudPlatformDevelopmentFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      decision: CloudPlatformApprovalDecision;
      comments?: string;
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; data: CloudPlatformRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Cloud Architecture Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
