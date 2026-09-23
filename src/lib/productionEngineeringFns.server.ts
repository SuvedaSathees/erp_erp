import { createServerFn } from "@tanstack/react-start";
import type {
  ProductionEngineeringApprovalDecision,
  ProductionEngineeringFormInput,
  ProductionEngineeringRecord,
  ProductionEngineeringStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "production-engineering";

export function calculateProductionEngineeringScores(record: Partial<ProductionEngineeringRecord>) {
  const designScore = record.designReadinessScore ?? 88;
  const resourceScore = record.resourceReadinessScore ?? 85;
  const validationScore = record.validationScore ?? 85;
  const qualityScore = record.qualityScore ?? 84;
  const performanceScore = record.performanceScore ?? 89;
  const aiScore = record.aiEngineeringScore ?? 87;

  const overallScore = Math.round(
    designScore * 0.25 +
      resourceScore * 0.15 +
      validationScore * 0.20 +
      qualityScore * 0.20 +
      performanceScore * 0.20
  );

  return {
    designReadinessScore: designScore,
    resourceReadinessScore: resourceScore,
    validationScore,
    qualityScore,
    performanceScore,
    aiEngineeringScore: aiScore,
    overallProductionReadiness: overallScore,
  };
}

export const DEFAULT_PRODUCTION_ENGINEERING_RECORD: ProductionEngineeringRecord = {
  id: "proc-eng-rec-0056",
  productionEngineeringId: "PE-2024-0056",
  formCode: "PEF-2024-25",
  projectName: "Smart EV Charger Production",
  productionVersion: "v1.2.0",
  workflowStatus: "In Progress",
  stage: 3,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  productionEngineerName: "Vikram Singh",
  businessUnit: "EV Solutions",
  ...calculateProductionEngineeringScores({}),
} as any;

export const getProductionEngineeringFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: ProductionEngineeringRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_PRODUCTION_ENGINEERING_RECORD };
  }
);

export const saveProductionEngineeringDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ProductionEngineeringFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: ProductionEngineeringRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_PRODUCTION_ENGINEERING_RECORD;
    const updatedInput = { ...(base as any), ...data.input };
    const scores = calculateProductionEngineeringScores(updatedInput);
    const record = {
      ...base,
      ...data.input,
      ...scores,
      projectName: (base as any).projectName ?? "",
      ownerName: (base as any).productionEngineerName ?? "Vikram Singh",
      recordCode: (base as any).id ?? (base as any).productionEngineeringId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitProductionEngineeringFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: ProductionEngineeringRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_PRODUCTION_ENGINEERING_RECORD };
  });

export const reviewProductionEngineeringFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      decision: ProductionEngineeringApprovalDecision;
      comments?: string;
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; data: ProductionEngineeringRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Production Engineering Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });
