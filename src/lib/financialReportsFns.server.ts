/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type { DashboardQuery } from "@/services/types";
import { getProfitabilityDataFn } from "./profitabilityFns.server";
import { getDepartmentBudgetsFn } from "./budgetingFns.server";
import { getPayableAgingReportFn } from "./accountsPayableFns.server";
import { getReceivableAgingReportFn } from "./accountsReceivableFns.server";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

export type BalanceSheetLine = {
  classification: string;
  amount: number;
  isHeader?: boolean;
  isTotal?: boolean;
  indent?: boolean;
};

export type BalanceSheetReportData = {
  asOfDate: string;
  assets: BalanceSheetLine[];
  totalAssets: number;
  liabilities: BalanceSheetLine[];
  totalLiabilities: number;
  equity: BalanceSheetLine[];
  totalEquity: number;
  totalEquityAndLiabilities: number;
  isBalanced: boolean;
};

export type CashFlowLine = {
  item: string;
  amount: number;
  type: "inflow" | "outflow" | "summary";
};

export type CashFlowReportData = {
  period: string;
  openingBalance: number;
  operatingInflows: CashFlowLine[];
  operatingOutflows: CashFlowLine[];
  netOperatingCashFlow: number;
  netChangeInCash: number;
  closingBalance: number;
};

// 1. Balance Sheet Report (REP-001)
export const getBalanceSheetReportFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();

      const whereJournal: any = { status: "Posted" };
      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        whereJournal.companyId = query.companyId;
      }

      // Fetch all accounts with their posted journal lines
      const accounts = await prisma.account.findMany({
        include: {
          journalLines: {
            where: { journal: whereJournal },
          },
        },
      });

      let totalAssets = 0;
      let totalLiabilities = 0;
      let totalEquity = 0;
      let revenueSum = 0;
      let expenseSum = 0;

      const assetLines: BalanceSheetLine[] = [];
      const liabilityLines: BalanceSheetLine[] = [];
      const equityLines: BalanceSheetLine[] = [];

      for (const acc of accounts) {
        const totalDebit = acc.journalLines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
        const totalCredit = acc.journalLines.reduce((s, l) => s + (Number(l.credit) || 0), 0);

        if (acc.type === "Asset") {
          const balance = totalDebit - totalCredit;
          if (balance !== 0) {
            assetLines.push({ classification: `${acc.code} - ${acc.name}`, amount: balance, indent: true });
            totalAssets += balance;
          }
        } else if (acc.type === "Liability") {
          const balance = totalCredit - totalDebit;
          if (balance !== 0) {
            liabilityLines.push({ classification: `${acc.code} - ${acc.name}`, amount: balance, indent: true });
            totalLiabilities += balance;
          }
        } else if (acc.type === "Equity") {
          const balance = totalCredit - totalDebit;
          if (balance !== 0) {
            equityLines.push({ classification: `${acc.code} - ${acc.name}`, amount: balance, indent: true });
            totalEquity += balance;
          }
        } else if (acc.type === "Revenue") {
          revenueSum += totalCredit - totalDebit;
        } else if (acc.type === "Expense") {
          expenseSum += totalDebit - totalCredit;
        }
      }

      // If no Asset accounts currently have balances, include a default placeholder line
      if (assetLines.length === 0) {
        assetLines.push({ classification: "Cash and Bank Balances", amount: 0, indent: true });
      }
      if (liabilityLines.length === 0) {
        liabilityLines.push({ classification: "Trade Liabilities", amount: 0, indent: true });
      }

      // Add YTD Retained Earnings from Revenue - Expenses
      const retainedEarnings = revenueSum - expenseSum;
      equityLines.push({
        classification: "Retained Earnings (YTD Net Profit / Loss)",
        amount: retainedEarnings,
        indent: true,
      });
      totalEquity += retainedEarnings;

      const totalEquityAndLiabilities = totalLiabilities + totalEquity;
      const isBalanced = Math.abs(totalAssets - totalEquityAndLiabilities) < 0.01;

      const reportData: BalanceSheetReportData = {
        asOfDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        assets: assetLines,
        totalAssets,
        liabilities: liabilityLines,
        totalLiabilities,
        equity: equityLines,
        totalEquity,
        totalEquityAndLiabilities,
        isBalanced,
      };

      return { success: true, data: reportData };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 2. Cash Flow Statement (REP-003)
export const getCashFlowReportFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: _query }) => {
    try {
      const prisma = await getPrisma();

      const bankAccounts = await prisma.bankAccount.findMany();
      const openingBalance = bankAccounts.reduce((s, a) => s + (Number(a.currentBalance) || 0), 0);

      const deposits = await prisma.bankDeposit.findMany();
      const receipts = await prisma.receivableReceipt.findMany();
      const payments = await prisma.payablePayment.findMany();

      const operatingInflows: CashFlowLine[] = [
        {
          item: "Customer Receivables & Direct Collections",
          amount: receipts.reduce((s, r) => s + (Number(r.amount) || 0), 0),
          type: "inflow",
        },
        {
          item: "Direct Bank Deposits & Miscellaneous Inflows",
          amount: deposits.reduce((s, d) => s + (Number(d.amount) || 0), 0),
          type: "inflow",
        },
      ];

      const operatingOutflows: CashFlowLine[] = [
        {
          item: "Supplier & Vendor Payments (AP Outflows)",
          amount: payments.reduce((s, p) => s + (Number(p.amount) || 0), 0),
          type: "outflow",
        },
      ];

      const totalInflows = operatingInflows.reduce((s, l) => s + l.amount, 0);
      const totalOutflows = operatingOutflows.reduce((s, l) => s + l.amount, 0);
      const netOperatingCashFlow = totalInflows - totalOutflows;
      const netChangeInCash = netOperatingCashFlow;
      const closingBalance = openingBalance + netChangeInCash;

      const reportData: CashFlowReportData = {
        period: "This Fiscal Year (April 1, 2024 - March 31, 2025)",
        openingBalance,
        operatingInflows,
        operatingOutflows,
        netOperatingCashFlow,
        netChangeInCash,
        closingBalance,
      };

      return { success: true, data: reportData };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 3. Centralized Live Report Query Router
export const getLiveReportPayloadFn = createServerFn({ method: "POST" })
  .validator((d: { reportId: string; query: DashboardQuery }) => d)
  .handler(async ({ data }) => {
    const { reportId, query } = data;

    try {
      if (reportId === "REP-001") {
        const res = await getBalanceSheetReportFn({ data: query });
        return { success: true, reportType: "BalanceSheet", data: res.data };
      }

      if (reportId === "REP-002") {
        const res = await getProfitabilityDataFn({ data: query });
        return { success: true, reportType: "ProfitAndLoss", data: res.data };
      }

      if (reportId === "REP-003") {
        const res = await getCashFlowReportFn({ data: query });
        return { success: true, reportType: "CashFlow", data: res.data };
      }

      if (reportId === "REP-006") {
        const res = await getDepartmentBudgetsFn();
        return { success: true, reportType: "BudgetVsActual", data: res.data };
      }

      if (reportId === "REP-005") {
        const prisma = await getPrisma();
        const accounts = await prisma.account.findMany({ orderBy: { code: "asc" } });
        const postedJournals = await prisma.journal.findMany({
          where: { status: "Posted" },
          include: { lines: true },
        });

        const debitCreditMap = new Map<string, { debit: number; credit: number }>();
        for (const j of postedJournals) {
          for (const l of j.lines) {
            const cur = debitCreditMap.get(l.accountId) || { debit: 0, credit: 0 };
            cur.debit += Number(l.debit) || 0;
            cur.credit += Number(l.credit) || 0;
            debitCreditMap.set(l.accountId, cur);
          }
        }

        const lines = accounts.map((a) => {
          const bal = debitCreditMap.get(a.id) || { debit: 0, credit: 0 };
          return {
            code: a.code,
            name: a.name,
            type: a.type,
            debit: bal.debit,
            credit: bal.credit,
          };
        });

        const totalDebit = lines.reduce((s, l) => s + l.debit, 0);
        const totalCredit = lines.reduce((s, l) => s + l.credit, 0);

        return {
          success: true,
          reportType: "TrialBalance",
          data: {
            lines,
            totalDebit,
            totalCredit,
            isBalanced: Math.abs(totalDebit - totalCredit) < 0.01,
          },
        };
      }

      if (reportId === "REP-008") {
        const [apRes, arRes] = await Promise.all([
          getPayableAgingReportFn({ data: query }),
          getReceivableAgingReportFn({ data: query }),
        ]);
        return {
          success: true,
          reportType: "AgingSummary",
          data: {
            ap: apRes.data,
            ar: arRes.data,
          },
        };
      }

      return { success: true, reportType: "Mock", data: null };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });
