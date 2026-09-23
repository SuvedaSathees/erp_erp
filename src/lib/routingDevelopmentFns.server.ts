import { createServerFn } from "@tanstack/react-start";
import type {
  RoutingRecord,
  RoutingFormInput,
  RoutingOperation,
  RoutingApprovalDecision,
  RoutingRecommendation,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "routing-development";

export const INITIAL_ROUTING_RECORD: RoutingRecord = {
  id: "rtg-rec-000123",
  routingId: "RTG-2024-000123",
  formCode: "RTD-2024-25",
  routingName: "Autonomous W-EVSE Manufacturing Routing",
  routingNumber: "RTG-AW-EVSE-001",
  product: "Autonomous W-EVSE",
  processOwner: "Rahul Sharma",
  routingVersion: "2.1",
  workflowStatus: "In Review",
  priority: "High",
} as any;

export const getRoutingRecordFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result as any };
  return { success: true, data: INITIAL_ROUTING_RECORD };
});

export const saveRoutingDraftFn = createServerFn({ method: "POST" })
  .validator((data: { record: Partial<RoutingRecord> }) => data)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base = current ?? INITIAL_ROUTING_RECORD;
    const record = {
      ...base,
      ...data.record,
      projectName: (data.record as any).routingName ?? (base as any).routingName ?? "",
      ownerName: (data.record as any).processOwner ?? (base as any).processOwner ?? "Rahul Sharma",
      recordCode: (base as any).id ?? (base as any).routingId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitRoutingFn = createServerFn({ method: "POST" }).handler(async () => {
  const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (current?.id) {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
    return { success: true, data: result as any };
  }
  return { success: true, data: INITIAL_ROUTING_RECORD };
});

export const addRoutingOperationFn = createServerFn({ method: "POST" })
  .validator((data: { operation: RoutingOperation }) => data)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const base: any = current ?? INITIAL_ROUTING_RECORD;
    const operations = [...(base.operations ?? []), data.operation];
    const record = {
      ...base,
      operations,
      totalOperationsCount: operations.length,
      projectName: base.routingName ?? "",
      ownerName: base.processOwner ?? "Rahul Sharma",
      recordCode: base.id ?? base.routingId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });
