import { createServerFn } from "@tanstack/react-start";
import type {
  IotApprovalDecision,
  IotFormInput,
  IotRecord,
  IotStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "iot-development";

export function calculateIotScores(record: Partial<IotRecord>) {
  const hwScore = record.hardwareScore ?? 89;
  const connScore = record.connectivityScore ?? 92;
  const secScore = record.securityScore ?? 90;
  const depScore = record.deploymentScore ?? 92;
  const aiScore = record.aiOverallIotScore ?? 92;

  const overallScore = Math.round(
    hwScore * 0.2 + connScore * 0.25 + secScore * 0.25 + depScore * 0.15 + aiScore * 0.15
  );

  return {
    hardwareScore: hwScore,
    connectivityScore: connScore,
    securityScore: secScore,
    deploymentScore: depScore,
    aiOverallIotScore: aiScore,
    overallIotSolutionScore: overallScore,
  };
}

export const DEFAULT_IOT_RECORD: IotRecord = {
  id: "iot-rec-0009",
  iotDevelopmentId: "IOTD-2024-0009",
  formCode: "IOTF-2024-25",
  iotProjectName: "Smart EV Charging Network",
  solutionVersion: "v1.2.0",
  workflowStatus: "In Review",
  stage: 4,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  iotArchitect: { name: "Rahul Sharma", avatar: "", email: "rahul.sharma@magnertia.com" },
  ...calculateIotScores({}),
} as any;

export const getIotFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: IotRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_IOT_RECORD };
  }
);

export const saveIotDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<IotFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: IotRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? DEFAULT_IOT_RECORD;
    const updatedInput = { ...(base as any), ...data.input };
    const scores = calculateIotScores(updatedInput);
    const record = {
      ...base,
      ...data.input,
      ...scores,
      projectName: (base as any).iotProjectName ?? "",
      ownerName: (base as any).iotArchitect?.name ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).iotDevelopmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitIotFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async (): Promise<{ success: boolean; data: IotRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result as any };
    }
    return { success: true, data: DEFAULT_IOT_RECORD };
  });

export const reviewIotFn = createServerFn({ method: "POST" })
  .validator(
    (data: {
      id: string;
      decision: IotApprovalDecision;
      comments?: string;
    }) => data
  )
  .handler(async ({ data }): Promise<{ success: boolean; data: IotRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "IoT Architecture Review Board",
        reviewerName: "Review Board",
      },
    });
    return { success: true, data: result as any };
  });

export const advanceIotStageFn = createServerFn({ method: "POST" })
  .validator((data: { targetStage: 1 | 2 | 3 | 4 }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: IotRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_IOT_RECORD;
    const stageLabels: Record<number, string> = {
      1: "Device & Connectivity Design (Stage 1)",
      2: "Device Registration & Integration (Stage 2)",
      3: "Telemetry & Analytics (Stage 3)",
      4: "Review & Production Deployment (Stage 4)",
    };
    const record = {
      ...base,
      stage: data.targetStage,
      workflowStageLabel: stageLabels[data.targetStage],
      projectName: base.iotProjectName ?? "",
      ownerName: base.iotArchitect?.name ?? "Rahul Sharma",
      recordCode: base.id ?? base.iotDevelopmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const toggleIotChecklistFn = createServerFn({ method: "POST" })
  .validator((data: { section: "deviceMgmt" | "dataCollection" | "integration"; itemId: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: IotRecord }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? DEFAULT_IOT_RECORD;

    const toggleList = (list: any[]) =>
      list.map((item: any) => (item.id === data.itemId ? { ...item, completed: !item.completed } : item));

    const updates: any = {};
    if (data.section === "deviceMgmt") {
      updates.deviceMgmtChecklist = toggleList(base.deviceMgmtChecklist ?? []);
      updates.deviceMgmtScore = Math.round(
        (updates.deviceMgmtChecklist.filter((c: any) => c.completed).length / updates.deviceMgmtChecklist.length) * 100
      );
    } else if (data.section === "dataCollection") {
      updates.dataCollectionChecklist = toggleList(base.dataCollectionChecklist ?? []);
      updates.analyticsScore = Math.round(
        (updates.dataCollectionChecklist.filter((c: any) => c.completed).length / updates.dataCollectionChecklist.length) * 100
      );
    } else if (data.section === "integration") {
      updates.integrationChecklist = toggleList(base.integrationChecklist ?? []);
      updates.integrationScore = Math.round(
        (updates.integrationChecklist.filter((c: any) => c.completed).length / updates.integrationChecklist.length) * 100
      );
    }

    const record = {
      ...base,
      ...updates,
      projectName: base.iotProjectName ?? "",
      ownerName: base.iotArchitect?.name ?? "Rahul Sharma",
      recordCode: base.id ?? base.iotDevelopmentId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });
