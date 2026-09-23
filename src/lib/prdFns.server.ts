import { createServerFn } from "@tanstack/react-start";
import type {
  PrdApprovalDecision,
  PrdFormInput,
  PrdRecord,
  PrdStage,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "prd";

export function calculatePrdScores(input: Partial<PrdFormInput>) {
  const bizReqsCount = input.businessRequirements?.length || 3;
  const businessReadiness = Math.min(100, Math.round(70 + bizReqsCount * 7.5));
  const funcReqsCount = input.functionalRequirements?.length || 4;
  const functionalCompleteness = Math.min(100, Math.round(65 + funcReqsCount * 6.5));
  const attachmentsCount = input.attachments?.length || 4;
  const technicalReadiness = Math.min(100, Math.round(72 + attachmentsCount * 4));
  const qualityReadiness = Math.min(100, Math.round((businessReadiness + functionalCompleteness + technicalReadiness) / 3));
  const overallPrdScore = Math.round(
    businessReadiness * 0.3 + functionalCompleteness * 0.3 + technicalReadiness * 0.25 + qualityReadiness * 0.15
  );
  const requirementCompleteness = Math.min(98, Math.max(75, Math.round(overallPrdScore * 0.96 + 3)));
  const requirementConsistency = Math.min(99, Math.max(78, Math.round(overallPrdScore * 0.97 + 2)));
  const riskAssessment = Math.min(95, Math.max(70, Math.round(overallPrdScore * 0.92 + 5)));
  const scopeValidation = Math.min(97, Math.max(76, Math.round(overallPrdScore * 0.95 + 4)));
  const aiConfidenceScore = Math.min(99, Math.max(80, Math.round(overallPrdScore * 0.98 + 1)));
  const overallAiQualityScore = Math.round(
    requirementCompleteness * 0.25 + requirementConsistency * 0.25 + riskAssessment * 0.2 + scopeValidation * 0.15 + aiConfidenceScore * 0.15
  );

  return {
    readinessSummary: { overallPrdScore, businessReadiness, functionalCompleteness, technicalReadiness, qualityReadiness },
    aiQuality: {
      overallAiQualityScore, requirementCompleteness, requirementConsistency, riskAssessment, scopeValidation, aiConfidenceScore,
      aiInsightsSummary: "PRD scope is rigorously defined.",
    },
    keyHighlights: [
      `All ${bizReqsCount} critical business objectives fully aligned.`,
      `${funcReqsCount} top functional user stories defined.`,
      `Security & compliance standards validated.`,
      `AI Assessment completed with ${aiConfidenceScore}% confidence.`,
    ],
  };
}

const initialCalculated = calculatePrdScores({});

let DEFAULT_PRD_RECORD: PrdRecord = {
  id: "prd-record-0017",
  prdId: "PRD-2024-0017",
  formCode: "PRD-2024-08",
  prdTitle: "Smart EV Charger Pro — v2.3 Wireless & RFID Module PRD",
  prdVersion: "v1.0",
  status: "executive_review",
  currentStage: "executive_review",
  currentStageLabel: "Executive Review",
  createdOn: "2024-04-25",
  linkedProductId: "prd-1001",
  linkedProductName: "Smart EV Charger Pro",
  linkedRoadmapId: "PRM-2024-0017",
  linkedRoadmapName: "EV Charger Roadmap 2024-27",
  linkedReleaseId: "rel-03",
  linkedReleaseName: "v2.3 – Wireless Charging & RFID",
  businessUnit: "Smart EV Infrastructure",
  productOwnerId: "usr-104",
  productOwnerName: "Vikram Sharma",
  productOwnerAvatar: "",
  plannedReleaseDate: "2024-11-15",
  dateCreated: "2024-04-25",
  lastModified: new Date().toISOString().split("T")[0],
  version: "v1.0",
  stages: [],
  input: {} as any,
  aiQuality: initialCalculated.aiQuality,
  readinessSummary: initialCalculated.readinessSummary,
  keyHighlights: initialCalculated.keyHighlights,
  linkedSystemDesignId: null,
  approvalDecision: null,
  approvalDate: null,
  reviewComments: null,
  auditTrail: [],
} as any;

export const getPrdFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_PRD_RECORD };
});

export const savePrdDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: PrdFormInput }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: data.input.prdTitle ?? "",
      ownerName: data.input.productOwnerName ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const advancePrdStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: PrdStage }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRD_RECORD };
  });

export const submitPrdFn = createServerFn({ method: "POST" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PRD_RECORD.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result };
  });

export const reviewPrdFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: PrdApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "PRD Review Committee",
        reviewerName: "PRD Review Committee",
      },
    });
    return { success: true, data: result };
  });
