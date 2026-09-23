import { createServerFn } from "@tanstack/react-start";
import type {
  FirmwareDevelopmentApprovalDecision,
  FirmwareDevelopmentFormInput,
  FirmwareDevelopmentRecord,
  FirmwareDevelopmentStage,
  FirmwareDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "firmware-development";

export function calculateFirmwareDevelopmentScores(input: Partial<FirmwareDevelopmentFormInput>) {
  const firmwareReadiness = 90;
  const codeQuality = input.codeCoverage && input.codeCoverage >= 90 ? 92 : 86;
  const securityReadiness = input.securityScore ?? 92;
  const testCoverage = Math.round(input.codeCoverage ?? 94.6);

  const overallFirmwareScore = Math.round(
    firmwareReadiness * 0.25 + codeQuality * 0.25 + securityReadiness * 0.25 + testCoverage * 0.25
  );

  const aiCodeQualityScore = codeQuality;
  const aiPerformanceOptimization = 90;
  const aiMemoryOptimization = 89;
  const aiSecurityAnalysis = securityReadiness;
  const aiBugPrediction = 88;
  const aiMaintainabilityScore = 91;
  const aiOverallFirmwareScore = overallFirmwareScore;

  const highlights: string[] = [];
  highlights.push("All critical modules implemented");
  highlights.push(`Code coverage achieved ${testCoverage}%`);
  highlights.push("Secure boot and OTA enabled");
  highlights.push("MISRA-C compliance 98%");
  highlights.push("No high severity vulnerabilities");

  return {
    summary: {
      overallFirmwareScore, firmwareReadiness, codeQuality, securityReadiness, testCoverage,
      recommendation: "Proceed to Hardware Bring-up",
    },
    aiAssessment: {
      aiOverallFirmwareScore, aiCodeQualityScore, aiPerformanceOptimization,
      aiMemoryOptimization, aiSecurityAnalysis, aiBugPrediction, aiMaintainabilityScore,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_MOCK_RECORD: FirmwareDevelopmentRecord = {
  id: "fwd-rec-2024-0017",
  firmwareId: "FWD-2024-0017",
  formCode: "FWF-2024-25",
  firmwareProjectName: "Smart EV Charger – Firmware Development",
  firmwareVersion: "v2.1.0",
  status: "Under Review" as any,
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",
  linkedEmbeddedDevelopmentId: "EMD-2024-0017",
  linkedEmbeddedDevelopmentTitle: "Smart EV Charger – Embedded Systems Development",
  linkedElectronicsDesignId: "EN-2024-0017",
  linkedElectronicsDesignTitle: "Smart EV Charger – Electronics Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",
  businessUnit: "Smart Mobility Division",
  firmwareLeadId: "usr-rajesh-varma",
  firmwareLeadName: "Rajesh Varma",
  firmwareLeadAvatar: "",
  lastUpdated: "20 Jun 2024 04:25 PM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "2.1.0",
  stages: [
    { id: "firmware_architecture_implementation", label: "Stage 1: Firmware Architecture & Implementation", stageNumber: 1, status: "completed", description: "Configure HAL/BSP, middleware, application logic & git commits" },
    { id: "communication_security", label: "Stage 2: Communication & Security", stageNumber: 2, status: "completed", description: "Configure communication stack, diagnostics, secure boot & OTA update" },
    { id: "testing_release", label: "Stage 3: Testing & Release", stageNumber: 3, status: "completed", description: "Automated build pipeline, static analysis, unit/integration testing & release candidate" },
    { id: "engineering_review", label: "Stage 4: Engineering Review", stageNumber: 4, status: "in_progress", description: "Review Board approval & downstream Hardware Bring-up project creation" },
  ],
  input: {} as any,
  ...calculateFirmwareDevelopmentScores({}),
  linkedHardwareBringupId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",
  auditTrail: [
    { at: "18 Jun 2024 10:15 AM", actor: "Rajesh Varma", event: "Firmware Development record created", stage: "firmware_architecture_implementation", status: "Draft" },
    { at: "20 Jun 2024 04:25 PM", actor: "Rajesh Varma", event: "Submitted Firmware Release for Engineering Review", stage: "engineering_review", status: "Under Review" },
  ],
} as any;

export const getFirmwareDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveFirmwareDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<FirmwareDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateFirmwareDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).firmwareProjectName ?? "",
      ownerName: (base as any).firmwareLeadName ?? "Rajesh Varma",
      recordCode: (base as any).id ?? (base as any).firmwareId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceFirmwareDevelopmentStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: FirmwareDevelopmentStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      firmware_architecture_implementation: { label: "Stage 1: Firmware Architecture & Implementation", stageNumber: 1 },
      communication_security: { label: "Stage 2: Communication & Security", stageNumber: 2 },
      testing_release: { label: "Stage 3: Testing & Release", stageNumber: 3 },
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
      projectName: base.firmwareProjectName ?? "",
      ownerName: base.firmwareLeadName ?? "Rajesh Varma",
      recordCode: base.id ?? base.firmwareId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitFirmwareDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewFirmwareDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: FirmwareDevelopmentApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: FirmwareDevelopmentRecord }> => {
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
