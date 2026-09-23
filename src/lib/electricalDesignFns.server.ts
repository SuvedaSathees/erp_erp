import { createServerFn } from "@tanstack/react-start";
import type {
  ElectricalDesignApprovalDecision,
  ElectricalDesignFormInput,
  ElectricalDesignRecord,
  ElectricalDesignStage,
  ElectricalDesignStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "electrical-design";

export function calculateElectricalDesignScores(input: Partial<ElectricalDesignFormInput>) {
  const powerSystemReadiness = 88;
  const circuitReadiness = input.pcbLayerCount && input.pcbLayerCount >= 6 ? 85 : 80;
  const electricalSafetyScore = input.electricalSafetyScore ?? 88;
  const complianceScore = input.complianceScore ?? 85;

  const overallElectricalDesignScore = Math.round(
    powerSystemReadiness * 0.25 + circuitReadiness * 0.25 + electricalSafetyScore * 0.25 + complianceScore * 0.25
  );

  const aiDesignQualityScore = Math.min(99, Math.max(75, Math.round(overallElectricalDesignScore * 1.02)));
  const aiPowerOptimization = 85;
  const aiCircuitReview = 87;
  const aiThermalAssessment = 84;
  const aiEmcRecommendations = 86;
  const aiReliabilityPrediction = 85;
  const aiOverallElectricalScore = overallElectricalDesignScore;

  const highlights: string[] = [];
  highlights.push("High efficiency power architecture designed");
  highlights.push("EMC design complies with IEC 61000 series");
  highlights.push(`Electrical safety design meets target score (${electricalSafetyScore}/100)`);
  highlights.push("AI optimization reduced power loss by 8.7%");

  return {
    summary: {
      overallElectricalDesignScore, powerSystemReadiness, circuitReadiness,
      electricalSafetyScore, complianceScore, recommendation: "Proceed to PCB Layout Design",
    },
    aiAssessment: {
      aiOverallElectricalScore, aiDesignQualityScore, aiPowerOptimization,
      aiCircuitReview, aiThermalAssessment, aiEmcRecommendations, aiReliabilityPrediction,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_MOCK_RECORD: ElectricalDesignRecord = {
  id: "ed-rec-2024-0017",
  designId: "ED-2024-0017",
  formCode: "EDF-2024-25",
  designProjectName: "Smart EV Charger – Electrical Design",
  designVersion: "v1.0",
  status: "Under Review" as any,
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",
  linkedMechanicalDesignId: "MD-2024-0017",
  linkedMechanicalDesignTitle: "Smart EV Charger – Mechanical Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",
  businessUnit: "Smart Mobility Division",
  electricalEngineerId: "usr-ananya-iyer",
  electricalEngineerName: "Ananya Iyer",
  electricalEngineerAvatar: "",
  lastUpdated: "20 Jun 2024 04:25 PM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.0",
  stages: [
    { id: "electrical_architecture", label: "Stage 1: Electrical Architecture", stageNumber: 1, status: "completed", description: "Define architecture, power distribution topology & protection strategy" },
    { id: "circuit_pcb_design", label: "Stage 2: Circuit & PCB Design", stageNumber: 2, status: "completed", description: "Schematics, PCB stack-up, component placement & MCU interfaces" },
    { id: "simulation_validation", label: "Stage 3: Simulation & Validation", stageNumber: 3, status: "completed", description: "Electrical, power, thermal simulation & safety compliance validation" },
    { id: "engineering_review", label: "Stage 4: Engineering Review", stageNumber: 4, status: "in_progress", description: "Review Board sign-off & downstream Prototype Manufacturing hand-off" },
  ],
  input: {} as any,
  ...calculateElectricalDesignScores({}),
  linkedPrototypeManufacturingId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",
  auditTrail: [
    { at: "18 Jun 2024 10:15 AM", actor: "Ananya Iyer", event: "Electrical Design record created", stage: "electrical_architecture", status: "Draft" },
    { at: "20 Jun 2024 04:25 PM", actor: "Ananya Iyer", event: "Submitted Electrical Design for Engineering Review", stage: "engineering_review", status: "Under Review" },
  ],
} as any;

export const getElectricalDesignFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveElectricalDesignDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ElectricalDesignFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateElectricalDesignScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).designProjectName ?? "",
      ownerName: (base as any).electricalEngineerName ?? "Ananya Iyer",
      recordCode: (base as any).id ?? (base as any).designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceElectricalDesignStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: ElectricalDesignStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      electrical_architecture: { label: "Stage 1: Electrical Architecture", stageNumber: 1 },
      circuit_pcb_design: { label: "Stage 2: Circuit & PCB Design", stageNumber: 2 },
      simulation_validation: { label: "Stage 3: Simulation & Validation", stageNumber: 3 },
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
      projectName: base.designProjectName ?? "",
      ownerName: base.electricalEngineerName ?? "Ananya Iyer",
      recordCode: base.id ?? base.designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitElectricalDesignFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewElectricalDesignFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ElectricalDesignApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectricalDesignRecord }> => {
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
