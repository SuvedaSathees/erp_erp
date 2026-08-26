/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type {
  FixedAsset,
  FixedAssetFilters,
  NewFixedAssetInput,
  DepreciationRun,
  AssetCategoryRecord,
  AssetDisposalRecord,
  AssetRevaluationRecord,
  AssetTransferRecord,
} from "@/services/types";

// Dynamically imported inside each handler so Prisma client is only loaded
// on the server and never leaked into the browser bundle.
async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

function shapeFixedAsset(a: any): FixedAsset {
  return {
    id: a.assetId || a.id,
    assetCode: a.assetCode,
    name: a.name,
    category: a.category as any,
    location: a.location,
    purchaseDate:
      a.purchaseDate instanceof Date ? a.purchaseDate.toISOString().slice(0, 10) : String(a.purchaseDate),
    cost: Number(a.cost) || 0,
    accumulatedDepreciation: Number(a.accumulatedDepreciation) || 0,
    netBookValue: Number(a.netBookValue) || 0,
    status: a.status as any,
  };
}

function shapeDepreciationRun(r: any): DepreciationRun {
  return {
    id: r.runNumber || r.id,
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : String(r.date),
    period: r.period,
    assetsCount: r.assetsCount || 0,
    totalDepreciation: Number(r.totalDepreciation) || 0,
    method: r.method,
    status: r.status as any,
    executedBy: r.executedBy,
  };
}

// ---------------------------------------------------------------------------
// Fixed Assets CRUD
// ---------------------------------------------------------------------------

export const getFixedAssetsFn = createServerFn({ method: "GET" })
  .validator((filters?: FixedAssetFilters) => filters)
  .handler(async ({ data: filters }) => {
    try {
      const prisma = await getPrisma();
      const assets = await prisma.fixedAsset.findMany({
        orderBy: { createdAt: "desc" },
      });

      let list: FixedAsset[] = assets.map(shapeFixedAsset);

      if (filters) {
        if (filters.search) {
          const s = filters.search.toLowerCase();
          list = list.filter(
            (a) =>
              a.name.toLowerCase().includes(s) ||
              a.assetCode.toLowerCase().includes(s) ||
              a.location.toLowerCase().includes(s),
          );
        }
        if (filters.category && filters.category !== "All Categories") {
          list = list.filter((a) => a.category === filters.category);
        }
        if (filters.status && filters.status !== "All Statuses") {
          list = list.filter((a) => a.status === filters.status);
        }
        if (filters.location && filters.location !== "All Locations") {
          list = list.filter((a) => a.location === filters.location);
        }
      }

      return { success: true, data: list };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const getFixedAssetFn = createServerFn({ method: "GET" })
  .validator((codeOrId: string) => codeOrId)
  .handler(async ({ data: codeOrId }) => {
    try {
      const prisma = await getPrisma();
      const asset = await prisma.fixedAsset.findFirst({
        where: {
          OR: [{ assetCode: codeOrId }, { assetId: codeOrId }, { id: codeOrId }],
        },
      });
      if (!asset) return { success: true, data: undefined };
      return { success: true, data: shapeFixedAsset(asset) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const createFixedAssetFn = createServerFn({ method: "POST" })
  .validator((input: NewFixedAssetInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const prisma = await getPrisma();
      const count = await prisma.fixedAsset.count();
      const code = `FA-0${count + 10}`;
      const assetId = `AST-0${count + 1}`;
      const cost = Number(input.cost) || 0;
      const salvageValue = Number(input.salvageValue) || 0;

      const created = await prisma.fixedAsset.create({
        data: {
          assetId,
          assetCode: code,
          name: input.name,
          category: (input.category.replace(" ", "_") as any) || "Machinery",
          location: input.location,
          purchaseDate: new Date(input.purchaseDate),
          cost,
          salvageValue,
          usefulLifeYears: Number(input.usefulLifeYears) || 5,
          depreciationMethod: input.depreciationMethod || "Straight Line",
          accumulatedDepreciation: 0,
          netBookValue: cost,
          status: "Active",
        },
      });

      return { success: true, data: shapeFixedAsset(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const transferFixedAssetFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      assetCode: string;
      destinationLocation: string;
      transferDate: string;
      authorizedBy: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const asset = await prisma.fixedAsset.findUnique({
        where: { assetCode: data.assetCode },
      });
      if (!asset) throw new Error(`Asset code ${data.assetCode} not found.`);

      const sourceLocation = asset.location;
      await prisma.fixedAsset.update({
        where: { assetCode: data.assetCode },
        data: { location: data.destinationLocation },
      });

      await prisma.fixedAssetTransfer.create({
        data: {
          assetId: asset.id,
          transferDate: new Date(data.transferDate),
          sourceLocation,
          destinationLocation: data.destinationLocation,
          authorizedBy: data.authorizedBy,
        },
      });

      return { success: true, data: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const disposeFixedAssetFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      assetCode: string;
      saleProceeds: number;
      disposalReason: string;
      disposalDate: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const asset = await prisma.fixedAsset.findUnique({
        where: { assetCode: data.assetCode },
      });
      if (!asset) throw new Error(`Asset code ${data.assetCode} not found.`);

      const netBookValue = Number(asset.netBookValue) || 0;
      const gainLoss = Number(data.saleProceeds) - netBookValue;

      await prisma.fixedAsset.update({
        where: { assetCode: data.assetCode },
        data: { status: "Disposed", netBookValue: 0 },
      });

      await prisma.fixedAssetDisposal.create({
        data: {
          assetId: asset.id,
          disposalDate: new Date(data.disposalDate),
          saleProceeds: Number(data.saleProceeds) || 0,
          accumulatedDepreciation: Number(asset.accumulatedDepreciation) || 0,
          gainLoss,
          disposalReason: data.disposalReason,
          status: "Approved",
        },
      });

      return { success: true, data: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const revalueFixedAssetFn = createServerFn({ method: "POST" })
  .validator(
    (d: {
      assetCode: string;
      newMarketValue: number;
      reason: string;
      revaluationDate: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const asset = await prisma.fixedAsset.findUnique({
        where: { assetCode: data.assetCode },
      });
      if (!asset) throw new Error(`Asset code ${data.assetCode} not found.`);

      const oldNBV = Number(asset.netBookValue) || 0;
      const newNBV = Number(data.newMarketValue) || 0;
      const adjustment = newNBV - oldNBV;

      let newCost = Number(asset.cost);
      let newAccDep = Number(asset.accumulatedDepreciation);
      if (adjustment > 0) {
        newCost += adjustment;
      } else {
        newAccDep += Math.abs(adjustment);
      }

      await prisma.fixedAsset.update({
        where: { assetCode: data.assetCode },
        data: {
          netBookValue: newNBV,
          cost: newCost,
          accumulatedDepreciation: newAccDep,
        },
      });

      await prisma.fixedAssetRevaluation.create({
        data: {
          assetId: asset.id,
          revaluationDate: new Date(data.revaluationDate),
          oldNBV,
          newNBV,
          adjustment,
          reason: data.reason,
        },
      });

      return { success: true, data: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// ---------------------------------------------------------------------------
// Depreciation Engine CRUD
// ---------------------------------------------------------------------------

export const getDepreciationRunsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const runs = await prisma.depreciationRun.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: runs.map(shapeDepreciationRun) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const executeDepreciationFn = createServerFn({ method: "POST" })
  .validator((d: { method: string; executedBy: string }) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const activeAssets = await prisma.fixedAsset.findMany({
        where: { status: "Active" },
      });

      let totalDepreciation = 0;
      for (const asset of activeAssets) {
        const cost = Number(asset.cost) || 0;
        const currentAcc = Number(asset.accumulatedDepreciation) || 0;
        const depAmt = Math.round(cost * 0.02);
        const newAcc = currentAcc + depAmt;
        const newNBV = Math.max(0, cost - newAcc);
        const newStatus = newNBV === 0 ? "FullyDepreciated" : "Active";

        await prisma.fixedAsset.update({
          where: { id: asset.id },
          data: {
            accumulatedDepreciation: newAcc,
            netBookValue: newNBV,
            status: newStatus as any,
          },
        });
        totalDepreciation += depAmt;
      }

      const runCount = await prisma.depreciationRun.count();
      const runNumber = `DEP-RUN-0${runCount + 1}`;
      const now = new Date();
      const period = now.toLocaleString("en-US", { month: "short", year: "numeric" });

      const run = await prisma.depreciationRun.create({
        data: {
          runNumber,
          date: now,
          period,
          assetsCount: activeAssets.length,
          totalDepreciation,
          method: data.method || "Straight Line",
          status: "Posted",
          executedBy: data.executedBy || "System User",
        },
      });

      return { success: true, data: shapeDepreciationRun(run) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const getAssetCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const assets = await prisma.fixedAsset.findMany();
    const countsByCategory = new Map<string, { count: number; cost: number }>();

    for (const a of assets) {
      const cat = a.category;
      const cur = countsByCategory.get(cat) || { count: 0, cost: 0 };
      cur.count += 1;
      cur.cost += Number(a.cost) || 0;
      countsByCategory.set(cat, cur);
    }

    const totalCount = assets.length || 1;
    const categories: AssetCategoryRecord[] = Array.from(countsByCategory.entries()).map(
      ([name, val], idx) => ({
        id: `CAT-${idx + 1}`,
        name,
        description: `${name} fixed assets`,
        depMethod: "Straight Line",
        usefulLife: 5,
        assetAccount: `1500-${idx + 1}`,
        depAccount: `1550-${idx + 1}`,
      }),
    );

    return { success: true, data: categories };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getAssetDisposalsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const disposals = await prisma.fixedAssetDisposal.findMany({
      include: { asset: true },
      orderBy: { createdAt: "desc" },
    });

    const list: AssetDisposalRecord[] = disposals.map((d: any) => ({
      id: d.id,
      assetCode: d.asset?.assetCode || "",
      name: d.asset?.name || "",
      disposalDate: d.disposalDate.toISOString().slice(0, 10),
      cost: Number(d.asset?.cost) || 0,
      accumulatedDepreciation: Number(d.accumulatedDepreciation) || 0,
      proceeds: Number(d.saleProceeds) || 0,
      gainLoss: Number(d.gainLoss) || 0,
      status: d.status || "Approved",
    }));

    return { success: true, data: list };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getAssetRevaluationsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const revaluations = await prisma.fixedAssetRevaluation.findMany({
      include: { asset: true },
      orderBy: { createdAt: "desc" },
    });

    const list: AssetRevaluationRecord[] = revaluations.map((r: any) => ({
      id: r.id,
      assetCode: r.asset?.assetCode || "",
      name: r.asset?.name || "",
      date: r.revaluationDate.toISOString().slice(0, 10),
      oldNBV: Number(r.oldNBV) || 0,
      newNBV: Number(r.newNBV) || 0,
      adjustment: Number(r.adjustment) || 0,
      reason: r.reason,
    }));

    return { success: true, data: list };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getAssetTransfersFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const transfers = await prisma.fixedAssetTransfer.findMany({
      include: { asset: true },
      orderBy: { createdAt: "desc" },
    });

    const list: AssetTransferRecord[] = transfers.map((t: any) => ({
      id: t.id,
      assetCode: t.asset?.assetCode || "",
      name: t.asset?.name || "",
      date: t.transferDate.toISOString().slice(0, 10),
      sourceLocation: t.sourceLocation,
      destinationLocation: t.destinationLocation,
      authorizedBy: t.authorizedBy,
    }));

    return { success: true, data: list };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});
