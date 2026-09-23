import { createServerFn } from "@tanstack/react-start";
import type {
  IndustrialDesignApprovalDecision,
  IndustrialDesignFormInput,
  IndustrialDesignRecord,
  IndustrialDesignStage,
  IndustrialDesignStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "industrial-design";

export function calculateIndustrialDesignScores(input: Partial<IndustrialDesignFormInput>) {
  const ergonomicScore = input.ergonomicScore ?? 86;
  const validationScore = input.validationScore ?? 84;
  const userExperience = Math.round(ergonomicScore * 0.55 + validationScore * 0.45);

  const manufacturability = input.manufacturabilityScore ?? 85;

  const complianceScore = input.complianceScore ?? 86;
  const recyclability = input.recyclabilityPercent ?? 85;
  const sustainability = Math.min(100, Math.round(complianceScore * 0.6 + recyclability * 0.4));

  const visualAppeal = input.visualAppealScore ?? 88;
  const brandAlignment = Math.min(100, Math.round(visualAppeal * 0.9 + 4));

  const overallDesignScore = Math.round(
    userExperience * 0.3 +
      manufacturability * 0.25 +
      sustainability * 0.2 +
      brandAlignment * 0.25
  );

  const aiDesignQualityScore = Math.min(99, Math.max(75, Math.round(overallDesignScore * 0.98 + 3)));
  const aiOverallDesignScore = Math.round(aiDesignQualityScore * 0.98);

  const highlights: string[] = [];
  highlights.push("Ergonomic and user-friendly design");
  highlights.push("Premium aesthetics with strong brand alignment");
  highlights.push("High manufacturability and easy assembly");
  if (input.recyclabilityPercent) {
    highlights.push(`Sustainable material with ${input.recyclabilityPercent}% recyclability`);
  } else {
    highlights.push("Sustainable material with high recyclability");
  }
  highlights.push(`Excellent AI design evaluation score (${aiOverallDesignScore}/100)`);

  return {
    summary: {
      overallDesignScore,
      userExperience,
      manufacturability,
      sustainability,
      brandAlignment,
      overallDesign: overallDesignScore,
    },
    aiAssessment: {
      aiOverallDesignScore,
      aiDesignQualityScore,
      aiErgonomicAssessment: input.aiAssessment?.aiErgonomicAssessment || "Ergonomically optimized for global user height and reach.",
      aiMaterialRecommendation: input.aiAssessment?.aiMaterialRecommendation || "Aluminum Alloy for durability & heat dissipation.",
      aiManufacturingSuggestions: input.aiAssessment?.aiManufacturingSuggestions || "Reduce part count, optimize sheet thickness for stamping.",
      aiSustainabilityAnalysis: input.aiAssessment?.aiSustainabilityAnalysis || "High recyclability (85%) and low environmental impact.",
      aiCostOptimization: input.aiAssessment?.aiCostOptimization || "Potential cost saving of 8-10% via modular assembly.",
    },
    keyHighlights: highlights,
  };
}

const DEFAULT_MOCK_RECORD: IndustrialDesignRecord = {
  id: "id-rec-0017",
  designId: "ID-2024-0017",
  formCode: "IDF-2024-25",
  designProjectName: "Smart EV Charger - Industrial Design",
  designVersion: "v1.0",
  status: "Under Review" as any,
  currentStage: "executive_review",
  currentStageLabel: "Design Review",
  createdOn: "18 Jun 2024 10:15 AM",
  linkedArchitectureId: "PA-2024-0017",
  linkedArchitectureTitle: "Smart EV Charger Architecture",
  linkedProductId: "prd-1001",
  linkedProductName: "Smart EV Charger Pro",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger Pro PRD",
  businessUnit: "Smart Mobility Division",
  industrialDesignerId: "usr-101",
  industrialDesignerName: "Rohit Verma",
  industrialDesignerAvatar: "",
  lastUpdated: "20 Jun 2024 04:25 PM",
  dateCreated: "18 Jun 2024 10:15 AM",
  lastModified: "20 Jun 2024 04:25 PM",
  version: "v1.0",
  stages: [
    { stage: "concept_design", label: "Stage 1: Concept Design", completed: true, active: false, completedAt: "22 Jun 2024" },
    { stage: "material_manufacturing_design", label: "Stage 2: Material & Mfg Design", completed: true, active: false, completedAt: "05 Jul 2024" },
    { stage: "prototype_validation", label: "Stage 3: Prototype Validation", completed: true, active: false, completedAt: "15 Jul 2024" },
    { stage: "executive_review", label: "Stage 4: Executive Review", completed: false, active: true },
  ],
  input: {} as any,
  ...calculateIndustrialDesignScores({}),
  linkedMechanicalDesignId: null,
  auditTrail: [
    { id: "aud-1", timestamp: "18 Jun 2024 10:15 AM", user: "Rohit Verma", action: "Record Created", details: "Industrial Design record created." },
    { id: "aud-2", timestamp: "20 Jun 2024 04:25 PM", user: "Rohit Verma", action: "Submitted for Review", details: "Submitted to Executive Design Board." },
  ],
} as any;

export const getIndustrialDesignFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: IndustrialDesignRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_MOCK_RECORD };
  }
);

export const saveIndustrialDesignDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: IndustrialDesignFormInput }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: IndustrialDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_MOCK_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateIndustrialDesignScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).designProjectName ?? "",
      ownerName: (base as any).industrialDesignerName ?? "Rohit Verma",
      recordCode: (base as any).id ?? (base as any).designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const advanceIndustrialDesignStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: IndustrialDesignStage }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: IndustrialDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_MOCK_RECORD;
    const stageMap: Record<string, { label: string; stageNumber: number }> = {
      concept_design: { label: "Stage 1: Concept Design", stageNumber: 1 },
      material_manufacturing_design: { label: "Stage 2: Material & Mfg Design", stageNumber: 2 },
      prototype_validation: { label: "Stage 3: Prototype Validation", stageNumber: 3 },
      executive_review: { label: "Stage 4: Executive Review", stageNumber: 4 },
    };
    const target = stageMap[data.targetStage];
    const record = {
      ...base,
      currentStage: data.targetStage,
      currentStageLabel: target.label,
      stages: (base.stages ?? []).map((stg: any) => {
        const stgNum = stg.stageNumber ?? (Object.keys(stageMap).indexOf(stg.stage) + 1);
        if (stgNum < target.stageNumber) return { ...stg, completed: true, active: false, status: "completed" };
        if (stgNum === target.stageNumber) return { ...stg, completed: false, active: true, status: "in_progress" };
        return { ...stg, completed: false, active: false, status: "pending" };
      }),
      projectName: base.designProjectName ?? "",
      ownerName: base.industrialDesignerName ?? "Rohit Verma",
      recordCode: base.id ?? base.designId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitIndustrialDesignFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: IndustrialDesignRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_MOCK_RECORD };
  });

export const reviewIndustrialDesignFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: IndustrialDesignApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: IndustrialDesignRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Executive Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
