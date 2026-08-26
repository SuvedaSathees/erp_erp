/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type {
  BudgetVersion,
  NewBudgetInput,
  NewBudgetVersionInput,
  BudgetComparisonReport,
  ProjectBudget,
  DepartmentBudget,
} from "@/services/types";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

function shapeDepartmentBudget(d: any): DepartmentBudget {
  const budget = Number(d.budgetAmount) || 0;
  const actual = Number(d.actualAmount) || 0;
  const variance = Number(d.variance) || budget - actual;
  const variancePct =
    d.variancePct != null ? Number(d.variancePct) : budget > 0 ? (variance / budget) * 100 : 0;
  const utilization =
    d.utilization != null ? Number(d.utilization) : budget > 0 ? (actual / budget) * 100 : 0;

  return {
    id: d.id,
    department: d.department,
    budget,
    actual,
    variance,
    variancePct: Math.round(variancePct * 100) / 100,
    utilization: Math.round(utilization * 100) / 100,
  };
}

function shapeBudgetVersion(b: any): BudgetVersion {
  const dateStr =
    b.updatedAt instanceof Date
      ? b.updatedAt.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : String(b.updatedAt || new Date().toISOString());

  return {
    id: b.versionCode || b.id,
    name: b.name,
    type: b.type as any,
    status: b.status as any,
    totalBudget: Number(b.totalBudget) || 0,
    createdBy: b.createdBy,
    lastUpdated: dateStr,
  };
}

function shapeProjectBudget(p: any): ProjectBudget {
  const budget = Number(p.budgetAmount) || 0;
  const actual = Number(p.actualAmount) || 0;
  const variance = Number(p.variance) || budget - actual;
  const utilization = p.utilization != null ? Number(p.utilization) : budget > 0 ? (actual / budget) * 100 : 0;

  return {
    id: p.id,
    project: p.project,
    manager: p.manager,
    budget,
    actual,
    variance,
    utilization: Math.round(utilization * 100) / 100,
    status: p.status as any,
  };
}

// ---------------------------------------------------------------------------
// Budgeting CRUD
// ---------------------------------------------------------------------------

export const getBudgetVersionsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const versions = await prisma.budgetVersion.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: versions.map(shapeBudgetVersion) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getBudgetVersionFn = createServerFn({ method: "GET" })
  .validator((codeOrId: string) => codeOrId)
  .handler(async ({ data: codeOrId }) => {
    try {
      const prisma = await getPrisma();
      const version = await prisma.budgetVersion.findFirst({
        where: {
          OR: [{ versionCode: codeOrId }, { id: codeOrId }],
        },
      });
      if (!version) return { success: true, data: undefined };
      return { success: true, data: shapeBudgetVersion(version) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const createBudgetFn = createServerFn({ method: "POST" })
  .validator((input: NewBudgetInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const prisma = await getPrisma();
      const count = await prisma.budgetVersion.count();
      const versionCode = `BV-0${count + 1}`;
      const totalBudget = Number(input.totalBudget) || 0;

      const created = await prisma.budgetVersion.create({
        data: {
          versionCode,
          name: input.name,
          type: (input.type as any) || "Original",
          status: (input.status as any) || "Active",
          totalBudget,
          createdBy: input.createdBy || "Amit Mehra",
        },
      });

      return { success: true, data: shapeBudgetVersion(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const createBudgetVersionFn = createServerFn({ method: "POST" })
  .validator((input: NewBudgetVersionInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const prisma = await getPrisma();
      const count = await prisma.budgetVersion.count();
      const versionCode = `BV-0${count + 1}`;
      const totalBudget = Number(input.totalBudget) || 0;

      let parentRecordId: string | null = null;
      if (input.parentVersionId) {
        const parent = await prisma.budgetVersion.findFirst({
          where: { OR: [{ versionCode: input.parentVersionId }, { id: input.parentVersionId }] },
        });
        if (parent) parentRecordId = parent.id;
      }

      const created = await prisma.budgetVersion.create({
        data: {
          versionCode,
          name: input.name,
          type: (input.type as any) || "Revision",
          status: "Draft",
          totalBudget,
          createdBy: input.createdBy || "Amit Mehra",
          parentVersionId: parentRecordId,
        },
      });

      return { success: true, data: shapeBudgetVersion(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const compareBudgetVersionsFn = createServerFn({ method: "GET" })
  .validator((d: { v1Id: string; v2Id: string }) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const v1Db = await prisma.budgetVersion.findFirst({
        where: { OR: [{ versionCode: data.v1Id }, { id: data.v1Id }] },
      });
      const v2Db = await prisma.budgetVersion.findFirst({
        where: { OR: [{ versionCode: data.v2Id }, { id: data.v2Id }] },
      });

      const v1 = v1Db
        ? shapeBudgetVersion(v1Db)
        : {
            id: data.v1Id,
            name: "Version 1",
            type: "Original" as const,
            status: "Active" as const,
            totalBudget: 0,
            createdBy: "System",
            lastUpdated: new Date().toISOString(),
          };

      const v2 = v2Db
        ? shapeBudgetVersion(v2Db)
        : {
            id: data.v2Id,
            name: "Version 2",
            type: "Revision" as const,
            status: "Draft" as const,
            totalBudget: 0,
            createdBy: "System",
            lastUpdated: new Date().toISOString(),
          };

      const diff = v2.totalBudget - v1.totalBudget;
      const diffPct = v1.totalBudget > 0 ? (diff / v1.totalBudget) * 100 : 0;

      const departmentDifferences = [
        {
          department: "Sales & Marketing",
          v1Amount: Math.round(v1.totalBudget * 0.25),
          v2Amount: Math.round(v2.totalBudget * 0.25),
          difference: Math.round((v2.totalBudget - v1.totalBudget) * 0.25),
        },
        {
          department: "Operations",
          v1Amount: Math.round(v1.totalBudget * 0.32),
          v2Amount: Math.round(v2.totalBudget * 0.32),
          difference: Math.round((v2.totalBudget - v1.totalBudget) * 0.32),
        },
        {
          department: "Information Technology",
          v1Amount: Math.round(v1.totalBudget * 0.14),
          v2Amount: Math.round(v2.totalBudget * 0.14),
          difference: Math.round((v2.totalBudget - v1.totalBudget) * 0.14),
        },
        {
          department: "Finance",
          v1Amount: Math.round(v1.totalBudget * 0.09),
          v2Amount: Math.round(v2.totalBudget * 0.09),
          difference: Math.round((v2.totalBudget - v1.totalBudget) * 0.09),
        },
        {
          department: "Human Resources",
          v1Amount: Math.round(v1.totalBudget * 0.08),
          v2Amount: Math.round(v2.totalBudget * 0.08),
          difference: Math.round((v2.totalBudget - v1.totalBudget) * 0.08),
        },
        {
          department: "Research & Development",
          v1Amount: Math.round(v1.totalBudget * 0.12),
          v2Amount: Math.round(v2.totalBudget * 0.12),
          difference: Math.round((v2.totalBudget - v1.totalBudget) * 0.12),
        },
      ];

      const report: BudgetComparisonReport = {
        version1: v1,
        version2: v2,
        totalDifference: diff,
        differencePct: Math.round(diffPct * 100) / 100,
        departmentDifferences,
      };

      return { success: true, data: report };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const getProjectBudgetsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const projects = await prisma.projectBudgetRecord.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: projects.map(shapeProjectBudget) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getDepartmentBudgetsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const records = await prisma.departmentBudgetRecord.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: records.map(shapeDepartmentBudget) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});
