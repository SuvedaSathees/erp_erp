import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "ipqc";

export const getIpqcRecordFn = createServerFn({ method: "GET" })
  .validator((data: { id?: string }) => data)
  .handler(async ({ data }) => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE, id: data.id } });
    return { success: true, data: result };
  });

export const listIpqcRecordsFn = createServerFn({ method: "GET" })
  .validator((data: { status?: string; limit?: number; offset?: number }) => data)
  .handler(async ({ data }) => {
    const results = await listDevelopmentRecordsFn({
      data: { moduleType: MODULE_TYPE, status: data.status, limit: data.limit, offset: data.offset },
    });
    return { success: true, data: results };
  });

export const saveIpqcDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { input: any })
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      projectName: data.input.inspectionNumber ?? data.input.projectName ?? "",
      ownerName: data.input.inspector ?? data.input.ownerName ?? "",
      recordCode: data.input.id ?? data.input.recordCode ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitIpqcFn = createServerFn({ method: "POST" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: data.id } });
    return { success: true, data: result };
  });

export const reviewIpqcFn = createServerFn({ method: "POST" })
  .validator(
    (data: { id: string; decision: string; comments?: string; reviewerRole: string; reviewerName: string }) => data
  )
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({ data });
    return { success: true, data: result };
  });
