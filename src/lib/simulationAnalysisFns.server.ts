import { createServerFn } from "@tanstack/react-start";
import type {
  SimulationApprovalDecision,
  SimulationFormInput,
  SimulationRecord,
  SimulationStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "simulation-analysis";

export function calculateSimulationScores(input: Partial<SimulationFormInput>) {
  const modelReadiness = 90;
  const configuration = 93;
  const analysisCompletion = 95;
  const validation = 93;
  const optimization = 89;
  const aiEngineering = 92;

  const overallScore = Math.round(
    modelReadiness * 0.2 +
      configuration * 0.15 +
      analysisCompletion * 0.2 +
      validation * 0.2 +
      optimization * 0.15 +
      aiEngineering * 0.1
  );

  return {
    modelReadinessScore: modelReadiness,
    configurationScore: configuration,
    boundaryConditionScore: 92,
    analysisCompletionScore: analysisCompletion,
    validationScore: validation,
    optimizationScore: optimization,
    aiEngineeringScore: aiEngineering,
    overallSimulationScore: overallScore,
  };
}

const DEFAULT_RECORD: SimulationRecord = {
  id: "sim-rec-0027",
  simulationId: "SIM-2024-0027",
  formCode: "SIMF-2024-25",
  simulationProjectName: "W-EVSE Thermal & Structural Analysis",
  simulationVersion: "v2.1.0",
  workflowStatus: "In Progress",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  simulationEngineerName: "Rahul Sharma",
  businessUnit: "EV Solutions",
  ...calculateSimulationScores({}),
} as any;

export { DEFAULT_RECORD };

export const getSimulationAnalysisFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: SimulationRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_RECORD };
  }
);

export const saveSimulationAnalysisDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<SimulationFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: SimulationRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_RECORD;
    const updatedInput = { ...(base as any).input, ...data.input };
    const scores = calculateSimulationScores(updatedInput);
    const record = {
      ...base,
      input: updatedInput,
      ...scores,
      projectName: (base as any).simulationProjectName ?? "",
      ownerName: (base as any).simulationEngineerName ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).simulationId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitSimulationAnalysisFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: SimulationRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_RECORD };
  });

export const reviewSimulationAnalysisFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      decision: SimulationApprovalDecision;
      comments?: string;
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; data: SimulationRecord }> => {
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
