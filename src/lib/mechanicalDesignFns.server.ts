import { createServerFn } from "@tanstack/react-start";
import type {
  MechanicalDesignApprovalDecision,
  MechanicalDesignFormInput,
  MechanicalDesignRecord,
  MechanicalDesignStage,
  MechanicalDesignStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "mechanical-design";

export function calculateMechanicalDesignScores(input: Partial<MechanicalDesignFormInput>) {
  const validationScore = input.validationScore ?? 86;
  const structuralReadiness = Math.min(99, Math.max(70, Math.round(validationScore * 0.6 + 36)));

  const isDfm = input.designMethodology?.includes("DFM") ?? true;
  const manufacturability = isDfm ? 86 : 78;

  const relTarget = input.reliabilityTarget ?? 98;
  const reliability = Math.min(98, Math.max(70, Math.round(relTarget * 0.87)));

  const completedAnalyses = (input.engineeringAnalyses || []).filter(
    (a) => a.status === "Completed"
  ).length;
  const totalAnalyses = (input.engineeringAnalyses || []).length || 6;
  const simulation = Math.min(98, Math.max(70, Math.round((completedAnalyses / totalAnalyses) * 30 + 65)));

  const overallMechanicalDesignScore = Math.round(
    structuralReadiness * 0.3 + manufacturability * 0.25 + reliability * 0.25 + simulation * 0.2
  );

  const aiDesignQuality = Math.min(99, Math.max(75, Math.round(overallMechanicalDesignScore * 1.01)));
  const aiManufacturability = Math.min(99, Math.max(75, Math.round(manufacturability * 1.0)));
  const aiStructuralAssessment = Math.min(99, Math.max(75, Math.round(structuralReadiness * 1.02)));
  const aiCostOptimization = 84;
  const aiOverallScore = Math.round(
    (aiDesignQuality + aiManufacturability + aiStructuralAssessment + aiCostOptimization) / 4
  );

  const highlights: string[] = [];
  highlights.push("Optimized weight reduction of 12.5% achieved");
  highlights.push("Structural safety factor within target");
  if (input.designMethodology?.includes("DFM")) {
    highlights.push("DFM analysis indicates high manufacturability");
  } else {
    highlights.push("Manufacturability validation complete");
  }
  if (input.materialGrade) {
    highlights.push(`AI suggested material change (${input.materialGrade}) reduces cost by 8%`);
  } else {
    highlights.push("AI suggested material change reduces cost by 8%");
  }

  return {
    summary: { overallMechanicalDesignScore, structuralReadiness, manufacturability, reliability, simulation },
    aiAssessment: { aiOverallScore, aiDesignQuality, aiManufacturability, aiStructuralAssessment, aiCostOptimization },
    keyHighlights: highlights,
  };
}

const DEFAULT_MOCK_RECORD: MechanicalDesignRecord = {
  id: "md-rec-2024-0017",
  designId: "MD-2024-0017",
  formCode: "MDF-2024-25",
  designProjectName: "Smart EV Charger – Mechanical Design",
  designVersion: "v1.0",
  status: "Under Review" as any,
  currentStage: "engineering_review",
  currentStageLabel: "Stage 4: Engineering Review",
  createdOn: "18 Jun 2024 10:15 AM",
  linkedIndustrialDesignId: "ID-2024-0012",
  linkedIndustrialDesignTitle: "Smart EV Charger – Industrial Design",
  linkedProductArchitectureId: "PA-2024-0017",
  linkedProductArchitectureTitle: "Smart EV Charger – System Architecture",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger – Product Requirements Document",
  linkedProductId: "PROD-2024-009",
  linkedProductName: "Smart EV Charger Pro",
  businessUnit: "Smart Mobility Division",
  mechanicalEngineerId: "usr-rahul-sharma",
  mechanicalEngineerName: "Rahul Sharma",
  mechanicalEngineerAvatar: "",
  lastUpdated: "20 Jun 2024 04:25 PM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  version: "1.0",
  stages: [
    { id: "mechanical_engineering_design", label: "Stage 1: Mechanical Engineering Design", stageNumber: 1, status: "completed", description: "Assembly structure, part models, mechanisms & 3D CAD modeling" },
    { id: "material_manufacturing_validation", label: "Stage 2: Material & Manufacturing Validation", stageNumber: 2, status: "completed", description: "Material grades, DFM/DFA assessment, GD&T & manufacturing cost" },
    { id: "simulation_validation", label: "Stage 3: Simulation & Validation", stageNumber: 3, status: "completed", description: "Structural/FEA, thermal, fatigue simulation & prototype testing" },
    { id: "engineering_review", label: "Stage 4: Engineering Review", stageNumber: 4, status: "in_progress", description: "Review Board approval & downstream Prototype Manufacturing trigger" },
  ],
  input: {} as any,
  ...calculateMechanicalDesignScores({}),
  linkedPrototypeManufacturingId: null,
  approvalDecision: null,
  approvalDate: "2024-06-20",
  reviewComments: "",
  auditTrail: [
    { at: "18 Jun 2024 10:15 AM", actor: "Rahul Sharma", event: "Mechanical Design record created", stage: "mechanical_engineering_design", status: "Draft" },
    { at: "20 Jun 2024 04:25 PM", actor: "Rahul Sharma", event: "Submitted Mechanical Design for Stage 4 Engineering Review", stage: "engineering_review", status: "Under Review" },
  ],
} as any;

export const getMechanicalDesignFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: MechanicalDesignRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveMechanicalDesignDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<MechanicalDesignFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: MechanicalDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateMechanicalDesignScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).designProjectName ?? "",
      ownerName: (base as any).mechanicalEngineerName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceMechanicalDesignStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: MechanicalDesignStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: MechanicalDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      mechanical_engineering_design: { label: "Stage 1: Mechanical Engineering Design", stageNumber: 1 },
      material_manufacturing_validation: { label: "Stage 2: Material & Manufacturing Validation", stageNumber: 2 },
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
      ownerName: base.mechanicalEngineerName ?? "Rahul Sharma",
      recordCode: base.id ?? base.designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitMechanicalDesignFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: MechanicalDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewMechanicalDesignFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: MechanicalDesignApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: MechanicalDesignRecord }> => {
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
