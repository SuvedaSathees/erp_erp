import { createServerFn } from "@tanstack/react-start";
import type {
  CybersecurityApprovalDecision,
  CybersecurityFormInput,
  CybersecurityRecord,
  CybersecurityStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "cybersecurity-engineering";

export function calculateCybersecurityScores(input: Partial<CybersecurityFormInput>) {
  const threatReadiness = 90;
  const architectureSecurity = 92;
  const secureDevelopment = 89;
  const compliance = 93;
  const monitoring = 91;

  const overallScore = Math.round(
    threatReadiness * 0.2 +
      architectureSecurity * 0.25 +
      secureDevelopment * 0.2 +
      compliance * 0.2 +
      monitoring * 0.15
  );

  return {
    threatReadinessScore: threatReadiness,
    architectureSecurityScore: architectureSecurity,
    secureDevelopmentScore: secureDevelopment,
    governanceScore: compliance,
    monitoringScore: monitoring,
    overallCybersecurityScore: overallScore,
  };
}

const DEFAULT_RECORD: CybersecurityRecord = {
  id: "cse-rec-0018",
  cybersecurityEngineeringId: "CSE-2024-0018",
  formCode: "CSEF-2024-25",
  securityProjectName: "Smart EV Charging Security",
  securityVersion: "v1.2.0",
  workflowStatus: "In Review",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  securityArchitectName: "Rahul Sharma",
  securityArchitectAvatar: "",
  businessUnit: "EV Solutions",
  ...calculateCybersecurityScores({}),
} as any;

export { DEFAULT_RECORD };

export const getCybersecurityEngineeringFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: CybersecurityRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_RECORD };
  }
);

export const saveCybersecurityEngineeringDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<CybersecurityFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: CybersecurityRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateCybersecurityScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).securityProjectName ?? "",
      ownerName: (base as any).securityArchitectName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).cybersecurityEngineeringId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitCybersecurityEngineeringFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: CybersecurityRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_RECORD };
  });

export const reviewCybersecurityEngineeringFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      decision: CybersecurityApprovalDecision;
      comments?: string;
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; data: CybersecurityRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Security Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
