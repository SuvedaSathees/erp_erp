/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type {
  CostCenterRecord,
  CostCenterBudget,
  CostAllocationRule,
  NewCostCenterInput,
  NewSubCostCenterInput,
} from "@/services/types";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

function shapeCostCenter(c: any): CostCenterRecord {
  const budget = Number(c.budget) || 0;
  const actual = Number(c.actual) || 0;
  const variance = Number(c.variance) || budget - actual;
  const utilization = c.utilization != null ? Number(c.utilization) : budget > 0 ? Math.round((actual / budget) * 10000) / 100 : 0;

  return {
    id: c.costCenterId || c.id,
    code: c.code,
    name: c.name,
    department: c.department,
    manager: c.manager,
    budget,
    actual,
    variance,
    utilization,
    status: (c.status as any) || "Active",
    type: (c.type === "Revenue_Generating" ? "Revenue-Generating" : c.type) as any || "Operational",
    parentId: c.parentId || undefined,
  };
}

function shapeAllocationRule(r: any): CostAllocationRule {
  const keyMap: Record<string, "Headcount" | "Square Footage" | "Direct Revenue" | "Direct Expense"> = {
    Headcount: "Headcount",
    SquareFootage: "Square Footage",
    DirectRevenue: "Direct Revenue",
    DirectExpense: "Direct Expense",
  };

  return {
    id: r.ruleCode || r.id,
    costCenter: r.costCenter?.code || r.costCenterId || "",
    allocationKey: keyMap[r.allocationKey] || "Headcount",
    weight: Number(r.weight) || 0,
  };
}

// ---------------------------------------------------------------------------
// Cost Center CRUD
// ---------------------------------------------------------------------------

export const getCostCentersFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const costCenters = await prisma.costCenterRecord.findMany({
      orderBy: { code: "asc" },
    });
    return { success: true, data: costCenters.map(shapeCostCenter) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getCostCenterFn = createServerFn({ method: "GET" })
  .validator((codeOrId: string) => codeOrId)
  .handler(async ({ data: codeOrId }) => {
    try {
      const prisma = await getPrisma();
      const cc = await prisma.costCenterRecord.findFirst({
        where: {
          OR: [{ code: codeOrId }, { costCenterId: codeOrId }, { id: codeOrId }],
        },
      });
      if (!cc) return { success: true, data: undefined };
      return { success: true, data: shapeCostCenter(cc) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const createCostCenterFn = createServerFn({ method: "POST" })
  .validator((input: NewCostCenterInput | NewSubCostCenterInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const prisma = await getPrisma();
      const count = await prisma.costCenterRecord.count();
      const costCenterId = `CC-0${count + 1}`;
      const budget = Number(input.budget) || 0;

      const prismaType =
        "type" in input && input.type === "Revenue-Generating"
          ? "Revenue_Generating"
          : ("type" in input ? input.type : "Support");

      const created = await prisma.costCenterRecord.create({
        data: {
          costCenterId,
          code: input.code,
          name: input.name,
          department: input.department,
          manager: input.manager,
          budget,
          actual: 0,
          variance: budget,
          utilization: 0,
          status: "Active",
          type: (prismaType as any) || "Operational",
          parentId: input.parentId || null,
        },
      });

      return { success: true, data: shapeCostCenter(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const getCostCenterBudgetsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const costCenters = await prisma.costCenterRecord.findMany({
      orderBy: { code: "asc" },
    });

    const budgets: CostCenterBudget[] = costCenters.map((c: any) => {
      const b = Number(c.budget) || 0;
      const a = Number(c.actual) || 0;
      const v = b - a;
      const pct = b > 0 ? (v / b) * 100 : 0;
      const util = b > 0 ? (a / b) * 100 : 0;
      return {
        id: c.costCenterId || c.id,
        costCenter: c.name,
        code: c.code,
        budget: b,
        actual: a,
        variance: v,
        variancePct: Math.round(pct * 100) / 100,
        utilization: Math.round(util * 100) / 100,
      };
    });

    return { success: true, data: budgets };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

// ---------------------------------------------------------------------------
// Cost Allocation Rules CRUD
// ---------------------------------------------------------------------------

export const getCostAllocationRulesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const rules = await prisma.costAllocationRule.findMany({
      include: { costCenter: true },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: rules.map(shapeAllocationRule) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getCostCenterCommitmentsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const commitments = await prisma.costCenterCommitment.findMany({
      include: { costCenter: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return {
      success: true,
      data: commitments.map((c: any) => ({
        id: c.commitmentCode || c.id,
        costCenter: c.costCenter?.name || "",
        description: c.description,
        commitmentAmount: Number(c.commitmentAmount),
        status: c.status,
      })),
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const saveCostAllocationRulesFn = createServerFn({ method: "POST" })
  .validator((rules: CostAllocationRule[]) => rules)
  .handler(async ({ data: rules }) => {
    try {
      const prisma = await getPrisma();

      for (let i = 0; i < rules.length; i++) {
        const r = rules[i];
        const ruleCode = r.id || `AR-00${i + 1}`;
        const cc = await prisma.costCenterRecord.findFirst({
          where: { OR: [{ code: r.costCenter }, { costCenterId: r.costCenter }, { id: r.costCenter }] },
        });

        const allocationKey =
          r.allocationKey === "Square Footage"
            ? "SquareFootage"
            : r.allocationKey === "Direct Revenue"
              ? "DirectRevenue"
              : r.allocationKey === "Direct Expense"
                ? "DirectExpense"
                : "Headcount";

        if (cc) {
          await prisma.costAllocationRule.upsert({
            where: { ruleCode },
            update: {
              costCenterId: cc.id,
              allocationKey: allocationKey as any,
              weight: Number(r.weight) || 0,
            },
            create: {
              ruleCode,
              costCenterId: cc.id,
              allocationKey: allocationKey as any,
              weight: Number(r.weight) || 0,
            },
          });
        }
      }

      return { success: true, data: { success: true, updatedRulesCount: rules.length } };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });
