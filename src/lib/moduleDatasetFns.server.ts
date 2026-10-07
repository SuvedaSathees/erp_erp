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

export const seedModuleDatasetFn = createServerFn({ method: "POST" })
  .validator((d: { key: string; title: string; json: string }) => d)
  .handler(async ({ data: { key, title, json } }): Promise<string> => {
    const row = await prisma.developmentRecord.upsert({
      where: { recordCode: code(key) },
      // Never overwrite a dataset that already exists.
      update: {},
      create: {
        moduleType: code(key),
        recordCode: code(key),
        formCode: key,
        projectName: title,
        ownerName: "System",
        workflowStatus: "Active",
        formData: JSON.parse(json),
      },
      select: { formData: true },
    });
    return JSON.stringify(row.formData);
  });
