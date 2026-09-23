import { createServerFn } from "@tanstack/react-start";
import type {
  SoftwareDevelopmentApprovalDecision,
  SoftwareDevelopmentFormInput,
  SoftwareDevelopmentRecord,
  SoftwareDevelopmentStage,
  SoftwareDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "software-development";

export function calculateSoftwareDevelopmentScores(input: Partial<SoftwareDevelopmentFormInput>) {
  const developmentProgress = 88;
  const architectureReadiness = input.technologyReadinessScore ?? 87;
  const testingReadiness = Math.round(input.codeCoverage ?? 87.5);
  const deploymentReadiness = input.securityScore ?? 90;

  const overallSoftwareScore = Math.round(
    developmentProgress * 0.25 +
      architectureReadiness * 0.25 +
      testingReadiness * 0.25 +
      deploymentReadiness * 0.25
  );

  const aiCodeQualityScore = 88;
  const aiArchitectureAssessment = architectureReadiness;
  const aiPerformanceOptimization = 86;
  const aiSecurityAssessment = deploymentReadiness;
  const aiMaintainabilityAnalysis = 88;
  const aiTechnicalDebtAnalysis = 85;
  const aiOverallSoftwareScore = overallSoftwareScore;

  const highlights: string[] = [];
  highlights.push("Microservices architecture implemented");
  highlights.push("CI/CD pipeline with 95% automation");
  highlights.push(`Code coverage achieved ${testingReadiness}%`);
  highlights.push("Security score improved by 12%");
  highlights.push("All critical and major tests passed");

  return {
    summary: {
      overallSoftwareScore,
      developmentProgress,
      architectureReadiness,
      testingReadiness,
      deploymentReadiness,
      recommendation: "Proceed to System Integration",
    },
    aiAssessment: {
      aiOverallSoftwareScore,
      aiCodeQualityScore,
      aiArchitectureAssessment,
      aiPerformanceOptimization,
      aiSecurityAssessment,
      aiMaintainabilityAnalysis,
      aiTechnicalDebtAnalysis,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_MOCK_RECORD: SoftwareDevelopmentRecord = {
  id: "swd-rec-2024-0017",
  softwareId: "SWD-2024-0017",
  formCode: "SWF-2024-25",
  softwareProjectName: "Smart EV Management Platform",
  softwareVersion: "v1.2.0",
  status: "Under Review" as any,
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductRoadmapId: "RM-2024-0012",
  linkedProductRoadmapTitle: "Smart Mobility Platform Roadmap 2024",
  linkedFirmwareDevelopmentId: "FWD-2024-0017",
  linkedFirmwareDevelopmentTitle: "Smart EV Charger – Firmware Development",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Platform",
  businessUnit: "Smart Mobility Division",
  softwareArchitectId: "usr-rahul-sharma",
  softwareArchitectName: "Rahul Sharma",
  softwareArchitectAvatar: "",
  lastUpdated: "20 Jun 2024 04:25 PM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.2.0",
  stages: [
    { id: "software_architecture_planning", label: "Stage 1: Software Architecture & Planning", stageNumber: 1, status: "completed", description: "Define microservices, tech stack & application module specifications" },
    { id: "development_integration", label: "Stage 2: Development & Integration", stageNumber: 2, status: "completed", description: "Develop backend microservices, React SPA, REST/GraphQL APIs & database schema" },
    { id: "testing_deployment", label: "Stage 3: Testing & Deployment", stageNumber: 3, status: "completed", description: "Execute CI/CD build, automated SAST/DAST testing & deployment packages" },
    { id: "engineering_review", label: "Stage 4: Engineering Review", stageNumber: 4, status: "in_progress", description: "Review Board approval & downstream System Integration project creation/linking" },
  ],
  input: {} as any,
  ...calculateSoftwareDevelopmentScores({}),
  linkedSystemIntegrationId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",
  auditTrail: [
    { at: "18 Jun 2024 10:15 AM", actor: "Rahul Sharma", event: "Software Development record created", stage: "software_architecture_planning", status: "Draft" },
    { at: "20 Jun 2024 04:25 PM", actor: "Rahul Sharma", event: "Submitted for Engineering Review", stage: "engineering_review", status: "Under Review" },
  ],
} as any;

export const getSoftwareDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveSoftwareDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<SoftwareDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateSoftwareDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).softwareProjectName ?? "",
      ownerName: (base as any).softwareArchitectName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).softwareId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceSoftwareDevelopmentStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: SoftwareDevelopmentStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      software_architecture_planning: { label: "Stage 1: Software Architecture & Planning", stageNumber: 1 },
      development_integration: { label: "Stage 2: Development & Integration", stageNumber: 2 },
      testing_deployment: { label: "Stage 3: Testing & Deployment", stageNumber: 3 },
      engineering_review: { label: "Stage 4: Engineering Review", stageNumber: 4 },
    };
    const target = stageMap[data.targetStage];
    const record = {
      ...base,
      currentStage: data.targetStage,
      currentStageLabel: target.label,
      stages: (base.stages ?? []).map((stg: any) => {
        if (stg.stageNumber < target.stageNumber) return { ...stg, status: "completed" };
        if (stg.stageNumber === target.stageNumber) return { ...stg, status: "in_progress" };
        return { ...stg, status: "pending" };
      }),
      projectName: base.softwareProjectName ?? "",
      ownerName: base.softwareArchitectName ?? "Rahul Sharma",
      recordCode: base.id ?? base.softwareId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitSoftwareDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewSoftwareDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: SoftwareDevelopmentApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: SoftwareDevelopmentRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Engineering Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
