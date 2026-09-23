import { createServerFn } from "@tanstack/react-start";
import type {
  SmartFactoryDevelopmentRecord,
  SmartFactoryFormInput,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "smart-factory";

export const INITIAL_SMART_FACTORY_RECORD: SmartFactoryDevelopmentRecord = {
  id: "sf-rec-2024-00015",
  smartFactoryProjectId: "SFP-2024-00015",
  formCode: "SFPF-2024-25",
  smartFactoryProjectTitle: "EVSE Smart Factory Transformation",
  projectNumber: "SF-TRN-24-001",
  version: 1.0,
  workflowStatus: "In Progress",
  manufacturingPlant: "Plant-01",
  factoryZone: "EVSE Assembly Zone",
  projectManager: "Vikram Singh",
  startDate: "05 May 2024",
  targetGoLive: "30 Nov 2024",
  priority: "High",
  projectStatus: "Development",
} as any;

export const getSmartFactoryRecordFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result as any };
  return { success: true, data: INITIAL_SMART_FACTORY_RECORD };
});

export const saveSmartFactoryDraftFn = createServerFn({ method: "POST" })
  .validator((data: { record: Partial<SmartFactoryDevelopmentRecord> }) => data)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? INITIAL_SMART_FACTORY_RECORD;
    const record = {
      ...base,
      ...data.record,
      projectName: (data.record as any).smartFactoryProjectTitle ?? (base as any).smartFactoryProjectTitle ?? "",
      ownerName: (data.record as any).projectManager ?? (base as any).projectManager ?? "Vikram Singh",
      recordCode: (base as any).id ?? (base as any).smartFactoryProjectId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitSmartFactoryReviewFn = createServerFn({ method: "POST" }).handler(async () => {
  const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (current?.id) {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
    return { success: true, data: result as any };
  }
  return { success: true, data: INITIAL_SMART_FACTORY_RECORD };
});

export const updateSmartFactoryDecisionFn = createServerFn({ method: "POST" })
  .validator((data: { decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await reviewDevelopmentFn({
        data: {
          id: current.id,
          decision: data.decision,
          comments: data.comments,
          reviewerRole: "Smart Factory Review Board",
          reviewerName: "Review Board",
        },
      });
      return { success: true, data: result as any };
    }
    return { success: true, data: INITIAL_SMART_FACTORY_RECORD };
  });
