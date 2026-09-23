import { createServerFn } from "@tanstack/react-start";
import type { RoboticsIntegration } from "@/lib/robotics-integration/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "robotics-integration";

export const MOCK_ROBOTICS_RECORD_35: RoboticsIntegration = {
  id: "RIP-2024-00035",
  formCode: "RPF-2024-25",
  roboticsProjectTitle: "Robotic Welding Cell Integration",
  projectNumber: "RW-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress" as any,
  automationDevelopmentId: "APD-2024-00045",
  roboticsEngineer: "Vikram Singh",
  startDate: "05 May 2024",
  targetDeployment: "15 Sep 2024",
  createdBy: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedBy: "Rahul Sharma",
  lastUpdated: "17 Jun 2024",
} as any;

export const getRoboticsIntegrationFn = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: RoboticsIntegration }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: MOCK_ROBOTICS_RECORD_35 };
  });

export const listRoboticsIntegrationFn = createServerFn({ method: "GET" }).handler(async () => {
  const results = await listDevelopmentRecordsFn({ data: { moduleType: MODULE_TYPE } });
  if (results.length > 0) return { success: true, data: results as any[] };
  return { success: true, data: [MOCK_ROBOTICS_RECORD_35] };
});

export const saveRoboticsIntegrationFn = createServerFn({ method: "POST" })
  .validator((data: { record: Partial<RoboticsIntegration> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: RoboticsIntegration }> => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? MOCK_ROBOTICS_RECORD_35;
    const record = {
      ...base,
      ...data.record,
      projectName: (data.record as any).roboticsProjectTitle ?? (base as any).roboticsProjectTitle ?? "",
      ownerName: (data.record as any).roboticsEngineer ?? (base as any).roboticsEngineer ?? "Vikram Singh",
      recordCode: (base as any).id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });
