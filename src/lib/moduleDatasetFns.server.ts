import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";

// Module datasets (dashboards for Strategy, BI, Security, Executive, Digital Development)
// live in DevelopmentRecord rows keyed by recordCode "dataset:<key>". Payloads travel as JSON strings.
const code = (key: string) => `dataset:${key}`;

export const getModuleDatasetFn = createServerFn({ method: "GET" })
  .validator((key: string) => key)
  .handler(async ({ data: key }): Promise<string | null> => {
    const row = await prisma.developmentRecord.findUnique({
      where: { recordCode: code(key) },
      select: { formData: true },
    });
    return row ? JSON.stringify(row.formData) : null;
  });

/** Save one field (e.g. a list the user added to, or a workflow status) of a module dataset. */
export const saveModuleDatasetFieldFn = createServerFn({ method: "POST" })
  .validator((d: { key: string; title: string; field: string; json: string }) => d)
  .handler(async ({ data: { key, title, field, json } }): Promise<string> => {
    const value = JSON.parse(json);
    const existing = await prisma.developmentRecord.findUnique({
      where: { recordCode: code(key) },
      select: { formData: true },
    });
    const formData = { ...((existing?.formData as Record<string, unknown>) ?? {}), [field]: value };
    const row = await prisma.developmentRecord.upsert({
      where: { recordCode: code(key) },
      update: { formData },
      create: {
        moduleType: code(key),
        recordCode: code(key),
        formCode: key,
        projectName: title,
        ownerName: "System",
        workflowStatus: "Active",
        formData,
      },
      select: { formData: true },
    });
    return JSON.stringify(row.formData);
  });

export const seedModuleDatasetFn = createServerFn({ method: "POST" })
  .validator((d: { key: string; title: string; json: string }) => d)
  .handler(async ({ data: { key, title, json } }): Promise<string> => {
    const defaults = JSON.parse(json) as Record<string, unknown>;
    const existing = await prisma.developmentRecord.findUnique({
      where: { recordCode: code(key) },
      select: { formData: true },
    });
    if (!existing) {
      const row = await prisma.developmentRecord.create({
        data: {
          moduleType: code(key),
          recordCode: code(key),
          formCode: key,
          projectName: title,
          ownerName: "System",
          workflowStatus: "Active",
          formData: defaults as object,
        },
        select: { formData: true },
      });
      return JSON.stringify(row.formData);
    }
    // Only add keys the stored dataset doesn't have yet; saved values are never overwritten.
    const stored = (existing.formData as Record<string, unknown>) ?? {};
    const missing = Object.keys(defaults).filter((k) => !(k in stored));
    if (!missing.length) return JSON.stringify(stored);
    const formData = { ...stored, ...Object.fromEntries(missing.map((k) => [k, defaults[k]])) };
    const row = await prisma.developmentRecord.update({
      where: { recordCode: code(key) },
      data: { formData: formData as object },
      select: { formData: true },
    });
    return JSON.stringify(row.formData);
  });

/** Append one item to a list field of a module dataset (e.g. a page's activity log or uploaded files). */
export const appendModuleDatasetItemFn = createServerFn({ method: "POST" })
  .validator((d: { key: string; title: string; field: string; json: string; limit?: number; unique?: boolean }) => d)
  .handler(async ({ data: { key, title, field, json, limit, unique } }): Promise<string> => {
    const item = JSON.parse(json);
    const existing = await prisma.developmentRecord.findUnique({
      where: { recordCode: code(key) },
      select: { formData: true },
    });
    const stored = (existing?.formData as Record<string, unknown>) ?? {};
    const list = Array.isArray(stored[field]) ? (stored[field] as unknown[]) : [];
    if (unique && list.some((x) => JSON.stringify(x) === json)) return JSON.stringify(list);
    const next = [item, ...list].slice(0, limit ?? 500);
    const formData = { ...stored, [field]: next };
    await prisma.developmentRecord.upsert({
      where: { recordCode: code(key) },
      update: { formData: formData as object },
      create: {
        moduleType: code(key),
        recordCode: code(key),
        formCode: key,
        projectName: title,
        ownerName: "System",
        workflowStatus: "Active",
        formData: formData as object,
      },
    });
    return JSON.stringify(next);
  });

/** Remove the item with the given id from a list field of a module dataset. */
export const removeModuleDatasetItemFn = createServerFn({ method: "POST" })
  .validator((d: { key: string; field: string; id: string }) => d)
  .handler(async ({ data: { key, field, id } }): Promise<string> => {
    const existing = await prisma.developmentRecord.findUnique({
      where: { recordCode: code(key) },
      select: { formData: true },
    });
    if (!existing) return "[]";
    const stored = (existing.formData as Record<string, unknown>) ?? {};
    const list = Array.isArray(stored[field]) ? (stored[field] as { id?: string }[]) : [];
    const next = list.filter((x) => x?.id !== id);
    await prisma.developmentRecord.update({
      where: { recordCode: code(key) },
      data: { formData: { ...stored, [field]: next } as object },
    });
    return JSON.stringify(next);
  });
