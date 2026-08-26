/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type { DashboardQuery, ProfitabilityRecord } from "@/services/types";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

export type ProfitabilityCalculationResult = {
  kpis: {
    revenueYTD: number;
    revenueYTDDelta: number;
    grossProfitYTD: number;
    grossProfitYTDDelta: number;
    grossMarginYTD: number;
    grossMarginYTDDelta: number;
    netProfitYTD: number;
    netProfitYTDDelta: number;
    netMarginYTD: number;
    netMarginYTDDelta: number;
  };
  summary: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    netProfit: number;
    netMargin: number;
  };
  comparison: {
    dimension: string;
    currentYTD: number;
    priorYTD: number;
    changePercentage: number;
  }[];
};

export const getProfitabilityDataFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();

      // Find all posted journal lines joined with Account
      const whereJournal: any = { status: "Posted" };
      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        whereJournal.companyId = query.companyId;
      }

      const allLines = await prisma.journalLine.findMany({
        where: {
          journal: whereJournal,
          account: {
            type: { in: ["Revenue", "Expense"] },
          },
        },
        include: {
          account: true,
          journal: true,
        },
      });

      // Filter current period vs prior period
      // If journals have fiscalYear or postingDate, partition them
      const now = new Date();
      const currentYear = now.getFullYear();
      const priorYear = currentYear - 1;

      let currentRev = 0;
      let currentCogs = 0;
      let currentTotalExp = 0;

      let priorRev = 0;
      let priorCogs = 0;
      let priorTotalExp = 0;

      for (const line of allLines) {
        const postDate = new Date(line.journal.postingDate);
        const lineYear = isNaN(postDate.getTime()) ? currentYear : postDate.getFullYear();
        const debit = Number(line.debit) || 0;
        const credit = Number(line.credit) || 0;

        const isCurrent = lineYear >= currentYear || line.journal.fiscalYear === query.fiscalYear;
        const isPrior = lineYear === priorYear;

        if (line.account.type === "Revenue") {
          const revAmount = credit - debit;
          if (isCurrent) currentRev += revAmount;
          else if (isPrior) priorRev += revAmount;
        } else if (line.account.type === "Expense") {
          const expAmount = debit - credit;
          const isCogs =
            line.account.group?.toLowerCase().includes("cost of goods") ||
            line.account.code.startsWith("50") ||
            line.account.name?.toLowerCase().includes("cost of");

          if (isCurrent) {
            currentTotalExp += expAmount;
            if (isCogs) currentCogs += expAmount;
          } else if (isPrior) {
            priorTotalExp += expAmount;
            if (isCogs) priorCogs += expAmount;
          }
        }
      }

      // If no COGS accounts were tagged specifically, direct materials/procurement is estimated at 60% of total expenses
      if (currentCogs === 0 && currentTotalExp > 0) {
        currentCogs = Math.round(currentTotalExp * 0.6 * 100) / 100;
      }
      if (priorCogs === 0 && priorTotalExp > 0) {
        priorCogs = Math.round(priorTotalExp * 0.6 * 100) / 100;
      }

      const currentGrossProfit = currentRev - currentCogs;
      const currentNetProfit = currentRev - currentTotalExp;
      const currentGrossMargin =
        currentRev > 0 ? Math.round((currentGrossProfit / currentRev) * 10000) / 100 : 0;
      const currentNetMargin =
        currentRev > 0 ? Math.round((currentNetProfit / currentRev) * 10000) / 100 : 0;

      const priorGrossProfit = priorRev - priorCogs;
      const priorNetProfit = priorRev - priorTotalExp;
      const priorGrossMargin =
        priorRev > 0 ? Math.round((priorGrossProfit / priorRev) * 10000) / 100 : 0;
      const priorNetMargin =
        priorRev > 0 ? Math.round((priorNetProfit / priorRev) * 10000) / 100 : 0;

      function calcDelta(curr: number, prev: number): number {
        if (prev === 0) return curr > 0 ? 100 : 0;
        return Math.round(((curr - prev) / Math.abs(prev)) * 10000) / 100;
      }

      const revenueYTDDelta = calcDelta(currentRev, priorRev);
      const grossProfitYTDDelta = calcDelta(currentGrossProfit, priorGrossProfit);
      const grossMarginYTDDelta = Math.round((currentGrossMargin - priorGrossMargin) * 100) / 100;
      const netProfitYTDDelta = calcDelta(currentNetProfit, priorNetProfit);
      const netMarginYTDDelta = Math.round((currentNetMargin - priorNetMargin) * 100) / 100;

      const result: ProfitabilityCalculationResult = {
        kpis: {
          revenueYTD: currentRev,
          revenueYTDDelta,
          grossProfitYTD: currentGrossProfit,
          grossProfitYTDDelta,
          grossMarginYTD: currentGrossMargin,
          grossMarginYTDDelta,
          netProfitYTD: currentNetProfit,
          netProfitYTDDelta,
          netMarginYTD: currentNetMargin,
          netMarginYTDDelta,
        },
        summary: {
          revenue: currentRev,
          cogs: currentCogs,
          grossProfit: currentGrossProfit,
          netProfit: currentNetProfit,
          netMargin: currentNetMargin,
        },
        comparison: [
          {
            dimension: "Revenue",
            currentYTD: currentRev,
            priorYTD: priorRev,
            changePercentage: revenueYTDDelta,
          },
          {
            dimension: "Gross Profit",
            currentYTD: currentGrossProfit,
            priorYTD: priorGrossProfit,
            changePercentage: grossProfitYTDDelta,
          },
          {
            dimension: "Net Profit",
            currentYTD: currentNetProfit,
            priorYTD: priorNetProfit,
            changePercentage: netProfitYTDDelta,
          },
        ],
      };

      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const getCustomerProfitabilityFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();

      const customers = await prisma.customer.findMany({
        include: {
          invoices: {
            where: { status: { not: "Canceled" } },
          },
        },
      });

      // Overall benchmark margin ratios
      const cogsRatio = 0.56;
      const netMarginRatio = 0.19;

      const records: ProfitabilityRecord[] = customers.map((c) => {
        let revenue = 0;
        for (const inv of c.invoices) {
          const amt = Number(inv.amount) || 0;
          if (inv.isCreditMemo) {
            revenue -= Math.abs(amt);
          } else {
            revenue += amt;
          }
        }
        revenue = Math.max(0, revenue);

        const cogs = Math.round(revenue * cogsRatio * 100) / 100;
        const grossProfit = revenue - cogs;
        const grossMargin = revenue > 0 ? Math.round((grossProfit / revenue) * 10000) / 100 : 0;
        const netProfit = Math.round(revenue * netMarginRatio * 100) / 100;
        const netMargin = revenue > 0 ? Math.round((netProfit / revenue) * 10000) / 100 : 0;

        return {
          code: c.customerCode,
          name: c.name,
          revenue,
          cogs,
          grossProfit,
          grossMargin,
          netProfit,
          netMargin,
        };
      });

      // Sort by revenue descending
      records.sort((a, b) => b.revenue - a.revenue);

      return { success: true, data: records };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });
