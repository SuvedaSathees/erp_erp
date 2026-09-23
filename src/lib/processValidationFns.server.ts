import { createServerFn } from "@tanstack/react-start";
import type {
  ProcessValidationRecord,
  ProcessValidationFormInput,
  ValidationTrialRunSummary,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "process-validation";

export const INITIAL_PROCESS_VALIDATION_RECORD: ProcessValidationRecord = {
  id: "pv-rec-00078",
  validationId: "PV-2024-00078",
  formCode: "PVDF-2024-25",
  validationTitle: "Enclosure Assembly Process Validation",
  validationNumber: "PV-ENCL-AW-001",
  version: 2.1,
  workflowStatus: "In Progress",
  product: "Autonomous W-EVSE",
  processOwner: "Rahul Sharma",
  processOwnerName: "Vikram Singh",
  priority: "High",
} as any;

export const getProcessValidationRecordFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result as any };
  return { success: true, data: INITIAL_PROCESS_VALIDATION_RECORD };
});

export const saveProcessValidationDraftFn = createServerFn({ method: "POST" })
  .validator((data: { record: Partial<ProcessValidationRecord> }) => data)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? INITIAL_PROCESS_VALIDATION_RECORD;
    const record = {
      ...base,
      ...data.record,
      projectName: (data.record as any).validationTitle ?? (base as any).validationTitle ?? "",
      ownerName: (data.record as any).processOwnerName ?? (base as any).processOwnerName ?? "Vikram Singh",
      recordCode: (base as any).id ?? (base as any).validationId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitProcessValidationFn = createServerFn({ method: "POST" }).handler(async () => {
  const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (current?.id) {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
    return { success: true, data: result as any };
  }
  return { success: true, data: INITIAL_PROCESS_VALIDATION_RECORD };
});

export const updateTrialRunSummaryFn = createServerFn({ method: "POST" })
  .validator((data: { trialRuns: ValidationTrialRunSummary[] }) => data)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? INITIAL_PROCESS_VALIDATION_RECORD;
    const record = {
      ...base,
      trialRunSummary: data.trialRuns,
      projectName: base.validationTitle ?? "",
      ownerName: base.processOwnerName ?? "Vikram Singh",
      recordCode: base.id ?? base.validationId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });
