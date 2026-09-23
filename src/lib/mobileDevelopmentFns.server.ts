import { createServerFn } from "@tanstack/react-start";
import type {
  MobileDevelopmentApprovalDecision,
  MobileDevelopmentFormInput,
  MobileDevelopmentRecord,
  MobileDevelopmentStage,
  MobileDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "mobile-development";

export function calculateMobileDevelopmentScores(input: Partial<MobileDevelopmentFormInput>) {
  const developmentProgress = 88;
  const uiReadiness = input.uiReadinessScore ?? 92;
  const performanceReadiness = 87;
  const storeReadiness = input.deviceIntegrationScore ?? 85;

  const overallMobileScore = Math.round(
    developmentProgress * 0.25 +
      uiReadiness * 0.25 +
      performanceReadiness * 0.25 +
      storeReadiness * 0.25
  );

  const aiCodeQualityScore = 89;
  const aiUiReview = uiReadiness;
  const aiPerformanceAnalysis = performanceReadiness;
  const aiSecurityReview = input.securityScore ?? 88;
  const aiCrashPrediction = 85;
  const aiUxSuggestions = 90;
  const aiOverallMobileScore = overallMobileScore;

  const highlights: string[] = [];
  highlights.push("Cross platform support (Android & iOS)");
  highlights.push("Offline mode with auto sync");
  highlights.push("Secure authentication implemented");
  highlights.push("Push notifications enabled");
  highlights.push("API integration completed");
  highlights.push("All critical and major tests passed");

  return {
    summary: {
      overallMobileScore,
      developmentProgress,
      uiReadiness,
      performanceReadiness,
      storeReadiness,
      recommendation: "Proceed to App Store Release",
    },
    aiAssessment: {
      aiOverallMobileScore,
      aiCodeQualityScore,
      aiUiReview,
      aiPerformanceAnalysis,
      aiSecurityReview,
      aiCrashPrediction,
      aiUxSuggestions,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_MOCK_RECORD: MobileDevelopmentRecord = {
  id: "mad-rec-2024-0017",
  mobileId: "MAD-2024-0017",
  formCode: "MAF-2024-25",
  mobileProjectName: "Magnertia EV Charger App",
  mobileAppVersion: "v1.2.0",
  status: "Under Review" as any,
  currentStage: "review_release",
  currentStageLabel: "Stage 4: Review & Release",
  createdOn: "18 Jun 2024 10:15 AM",
  linkedSoftwareDevelopmentId: "SWD-2024-0012",
  linkedSoftwareDevelopmentTitle: "Smart EV Management Platform",
  linkedProductArchitectureId: "PA-2024-0011",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0009",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductRoadmapId: "RM-2024-0010",
  linkedProductRoadmapTitle: "Smart Mobility Platform Roadmap 2024",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Platform",
  businessUnit: "EV Solutions",
  mobileArchitectId: "usr-rahul-sharma",
  mobileArchitectName: "Rahul Sharma",
  mobileArchitectAvatar: "",
  lastUpdated: "20 Jun 2024 04:25 PM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.2.0",
  stages: [
    { id: "mobile_architecture_uiux", label: "Stage 1: Mobile Architecture & UI/UX", stageNumber: 1, status: "completed", description: "Define MVVM architecture, Flutter 3.19 UI screens & offline storage" },
    { id: "application_development", label: "Stage 2: Application Development", stageNumber: 2, status: "completed", description: "Develop mobile features, device APIs, push notifications & REST/GraphQL integration" },
    { id: "testing_deployment", label: "Stage 3: Testing & Deployment", stageNumber: 3, status: "completed", description: "Execute CI/CD build, generate Android AAB & iOS IPA packages, and complete test suites" },
    { id: "review_release", label: "Stage 4: Review & Release", stageNumber: 4, status: "in_progress", description: "Review Board approval, internal store release publishing & Mobile Operations setup" },
  ],
  input: {} as any,
  ...calculateMobileDevelopmentScores({}),
  linkedMobileOperationsId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",
  auditTrail: [
    { at: "18 Jun 2024 10:15 AM", actor: "Rahul Sharma", event: "Mobile App Development record created", stage: "mobile_architecture_uiux", status: "Draft" },
    { at: "20 Jun 2024 04:25 PM", actor: "Rahul Sharma", event: "Submitted for Review & Release", stage: "review_release", status: "Under Review" },
  ],
} as any;

export const getMobileDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: MobileDevelopmentRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveMobileDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<MobileDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: MobileDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateMobileDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).mobileProjectName ?? "",
      ownerName: (base as any).mobileArchitectName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).mobileId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceMobileDevelopmentStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: MobileDevelopmentStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: MobileDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      mobile_architecture_uiux: { label: "Stage 1: Mobile Architecture & UI/UX", stageNumber: 1 },
      application_development: { label: "Stage 2: Application Development", stageNumber: 2 },
      testing_deployment: { label: "Stage 3: Testing & Deployment", stageNumber: 3 },
      review_release: { label: "Stage 4: Review & Release", stageNumber: 4 },
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
      projectName: base.mobileProjectName ?? "",
      ownerName: base.mobileArchitectName ?? "Rahul Sharma",
      recordCode: base.id ?? base.mobileId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitMobileDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: MobileDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewMobileDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: MobileDevelopmentApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: MobileDevelopmentRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Mobile App Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
