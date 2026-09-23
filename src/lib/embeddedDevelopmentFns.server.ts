import { createServerFn } from "@tanstack/react-start";
import type {
  EmbeddedDevelopmentApprovalDecision,
  EmbeddedDevelopmentFormInput,
  EmbeddedDevelopmentRecord,
  EmbeddedDevelopmentStage,
  EmbeddedDevelopmentStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "embedded-development";

export function calculateEmbeddedDevelopmentScores(input: Partial<EmbeddedDevelopmentFormInput>) {
  const firmwareReadiness = 88;
  const hardwareCompatibility = 90;
  const performanceScore = 87;
  const securityScore = input.securityReadinessScore ?? 90;

  const overallEmbeddedScore = Math.round(
    firmwareReadiness * 0.25 +
      hardwareCompatibility * 0.25 +
      performanceScore * 0.25 +
      securityScore * 0.25
  );

  const aiFirmwareQualityScore = Math.min(99, Math.max(75, Math.round(overallEmbeddedScore * 1.02)));
  const aiCodeOptimization = 88;
  const aiMemoryOptimization = 89;
  const aiTimingAnalysis = 87;
  const aiOverallEmbeddedScore = overallEmbeddedScore;

  const highlights: string[] = [];
  highlights.push("Optimized task scheduling improves CPU utilization by 12%");
  highlights.push("Memory usage optimized, 18% more free SRAM");
  highlights.push("MISRA-C compliance score: 96%");
  highlights.push("Security enhanced with Secure Boot and Encryption");
  highlights.push("All critical modules passed HIL testing");

  return {
    summary: {
      overallEmbeddedScore,
      firmwareReadiness,
      hardwareCompatibility,
      performanceScore,
      securityScore,
      recommendation: "Proceed to Firmware Development",
    },
    aiAssessment: {
      aiOverallEmbeddedScore,
      aiFirmwareQualityScore,
      aiCodeOptimization,
      aiMemoryOptimization,
      aiTimingAnalysis,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_MOCK_RECORD: EmbeddedDevelopmentRecord = {
  id: "emd-rec-2024-0017",
  developmentId: "EMD-2024-0017",
  formCode: "EMF-2024-25",
  developmentProjectName: "Smart EV Charger – Embedded Systems Development",
  firmwareVersion: "v1.0.0",
  status: "Under Review" as any,
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",
  linkedElectronicsDesignId: "EN-2024-0017",
  linkedElectronicsDesignTitle: "Smart EV Charger – Electronics Design",
  linkedElectricalDesignId: "ED-2024-0017",
  linkedElectricalDesignTitle: "Smart EV Charger – Electrical Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",
  businessUnit: "Smart Mobility Division",
  embeddedEngineerId: "usr-kavita-sharma",
  embeddedEngineerName: "Kavita Sharma",
  embeddedEngineerAvatar: "",
  lastUpdated: "20 Jun 2024 04:25 PM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.0.0",
  stages: [
    { id: "platform_configuration", label: "Stage 1: Platform Configuration", stageNumber: 1, status: "completed", description: "Configure MCU/SoC, BSP, bootloader, RTOS & task scheduling" },
    { id: "firmware_development", label: "Stage 2: Firmware Development", stageNumber: 2, status: "completed", description: "Develop device drivers, middleware, application modules & version control" },
    { id: "testing_validation", label: "Stage 3: Testing & Validation", stageNumber: 3, status: "completed", description: "Automated build, static analysis, unit/integration & HIL testing" },
    { id: "engineering_review", label: "Stage 4: Engineering Review", stageNumber: 4, status: "in_progress", description: "Review Board approval & downstream System Integration project creation" },
  ],
  input: {} as any,
  ...calculateEmbeddedDevelopmentScores({}),
  linkedSystemIntegrationId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",
  auditTrail: [
    { at: "18 Jun 2024 10:15 AM", actor: "Kavita Sharma", event: "Embedded Systems Development record created", stage: "platform_configuration", status: "Draft" },
    { at: "20 Jun 2024 04:25 PM", actor: "Kavita Sharma", event: "Submitted for Engineering Review", stage: "engineering_review", status: "Under Review" },
  ],
} as any;

export const getEmbeddedDevelopmentFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveEmbeddedDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<EmbeddedDevelopmentFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateEmbeddedDevelopmentScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).developmentProjectName ?? "",
      ownerName: (base as any).embeddedEngineerName ?? "Kavita Sharma",
      recordCode: (base as any).id ?? (base as any).developmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceEmbeddedDevelopmentStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: EmbeddedDevelopmentStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      platform_configuration: { label: "Stage 1: Platform Configuration", stageNumber: 1 },
      firmware_development: { label: "Stage 2: Firmware Development", stageNumber: 2 },
      testing_validation: { label: "Stage 3: Testing & Validation", stageNumber: 3 },
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
      projectName: base.developmentProjectName ?? "",
      ownerName: base.embeddedEngineerName ?? "Kavita Sharma",
      recordCode: base.id ?? base.developmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitEmbeddedDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewEmbeddedDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: EmbeddedDevelopmentApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: EmbeddedDevelopmentRecord }> => {
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
