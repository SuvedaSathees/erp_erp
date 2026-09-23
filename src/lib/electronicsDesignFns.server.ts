import { createServerFn } from "@tanstack/react-start";
import type {
  ElectronicsDesignApprovalDecision,
  ElectronicsDesignFormInput,
  ElectronicsDesignRecord,
  ElectronicsDesignStage,
  ElectronicsDesignStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "electronics-design";

export function calculateElectronicsDesignScores(input: Partial<ElectronicsDesignFormInput>) {
  const architectureReadiness = 88;
  const circuitReadiness = input.estimatedLayerCount && input.estimatedLayerCount >= 6 ? 85 : 82;
  const hardwareInterfaceScore = input.hardwareInterfaceScore ?? 87;
  const reliabilityScore = input.reliabilityScore ?? 86;

  const overallElectronicsDesignScore = Math.round(
    architectureReadiness * 0.25 +
      circuitReadiness * 0.25 +
      hardwareInterfaceScore * 0.25 +
      reliabilityScore * 0.25
  );

  const aiDesignQualityScore = Math.min(99, Math.max(75, Math.round(overallElectronicsDesignScore * 1.02)));
  const aiComponentOptimization = 85;
  const aiCircuitReview = 87;
  const aiSignalIntegrityAnalysis = 86;
  const aiThermalRecommendations = 84;
  const aiReliabilityPrediction = 88;
  const aiOverallElectronicsScore = overallElectronicsDesignScore;

  const highlights: string[] = [];
  highlights.push("Optimized component selection reduced cost by 8%");
  highlights.push("High-speed signal design up to 500 MHz");
  highlights.push("Power integrity within target limits");
  highlights.push("Excellent reliability with MTBF > 100,000 hrs");
  highlights.push("AI analysis improved efficiency by 7.5%");

  return {
    summary: {
      overallElectronicsDesignScore,
      architectureReadiness,
      circuitReadiness,
      hardwareInterfaceScore,
      reliabilityScore,
      recommendation: "Proceed to PCB Layout Design",
    },
    aiAssessment: {
      aiOverallElectronicsScore,
      aiDesignQualityScore,
      aiComponentOptimization,
      aiCircuitReview,
      aiSignalIntegrityAnalysis,
      aiThermalRecommendations,
      aiReliabilityPrediction,
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_MOCK_RECORD: ElectronicsDesignRecord = {
  id: "en-rec-2024-0017",
  designId: "EN-2024-0017",
  formCode: "EDF-2024-25",
  designProjectName: "Smart EV Charger – Electronics Design",
  designVersion: "v1.0",
  status: "Under Review" as any,
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",
  linkedElectricalDesignId: "ED-2024-0017",
  linkedElectricalDesignTitle: "Smart EV Charger – Electrical Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",
  businessUnit: "Smart Mobility Division",
  electronicsEngineerId: "usr-rohit-nair",
  electronicsEngineerName: "Rohit Nair",
  electronicsEngineerAvatar: "",
  lastUpdated: "20 Jun 2024 04:25 PM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.0",
  stages: [
    { id: "electronic_system_architecture", label: "Stage 1: Electronic System Architecture", stageNumber: 1, status: "completed", description: "Define functional blocks, circuit architecture & embedded interfaces" },
    { id: "component_selection_circuit_design", label: "Stage 2: Component Selection & Circuit Design", stageNumber: 2, status: "completed", description: "Select components, schematic design & hardware interface validation" },
    { id: "verification_simulation", label: "Stage 3: Verification & Simulation", stageNumber: 3, status: "completed", description: "Circuit/signal/power integrity simulation & ERC/compliance verification" },
    { id: "engineering_review", label: "Stage 4: Engineering Review", stageNumber: 4, status: "in_progress", description: "Review Board approval & downstream PCB Layout Design project creation" },
  ],
  input: {} as any,
  ...calculateElectronicsDesignScores({}),
  linkedPcbLayoutId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",
  auditTrail: [
    { at: "18 Jun 2024 10:15 AM", actor: "Rohit Nair", event: "Electronics Design record created", stage: "electronic_system_architecture", status: "Draft" },
    { at: "20 Jun 2024 04:25 PM", actor: "Rohit Nair", event: "Submitted Electronics Design for Engineering Review", stage: "engineering_review", status: "Under Review" },
  ],
} as any;

export const getElectronicsDesignFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveElectronicsDesignDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ElectronicsDesignFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateElectronicsDesignScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).designProjectName ?? "",
      ownerName: (base as any).electronicsEngineerName ?? "Rohit Nair",
      recordCode: (base as any).id ?? (base as any).designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceElectronicsDesignStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: ElectronicsDesignStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      electronic_system_architecture: { label: "Stage 1: Electronic System Architecture", stageNumber: 1 },
      component_selection_circuit_design: { label: "Stage 2: Component Selection & Circuit Design", stageNumber: 2 },
      verification_simulation: { label: "Stage 3: Verification & Simulation", stageNumber: 3 },
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
      ownerName: base.electronicsEngineerName ?? "Rohit Nair",
      recordCode: base.id ?? base.designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitElectronicsDesignFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewElectronicsDesignFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ElectronicsDesignApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ElectronicsDesignRecord }> => {
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
