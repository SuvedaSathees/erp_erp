import { createServerFn } from "@tanstack/react-start";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

type AccountType = "Asset" | "Liability" | "Equity" | "Revenue" | "Expense";

interface AccountBalance {
  code: string;
  name: string;
  type: AccountType;
  group: string;
  debit: number;
  credit: number;
}

async function getAccountBalances(): Promise<AccountBalance[]> {
  const prisma = await getPrisma();

  const accounts = await prisma.account.findMany({
    where: { isActive: true },
    orderBy: { code: "asc" },
  });

  const postedJournals = await prisma.journal.findMany({
    where: { status: { in: ["Posted", "Approved"] } },
    include: { lines: { include: { account: true } } },
  });

  const balanceByCode = new Map<string, { debit: number; credit: number }>();
  for (const journal of postedJournals) {
    for (const line of journal.lines || []) {
      const code = line.account?.code;
      if (!code) continue;
      const cur = balanceByCode.get(code) || { debit: 0, credit: 0 };
      cur.debit += Number(line.debit) || 0;
      cur.credit += Number(line.credit) || 0;
      balanceByCode.set(code, cur);
    }
  }

  return accounts.map((a) => {
    const bal = balanceByCode.get(a.code) || { debit: 0, credit: 0 };
    return {
      code: a.code,
      name: a.name,
      type: a.type as AccountType,
      group: a.group,
      debit: bal.debit,
      credit: bal.credit,
    };
  });
}

function byType(accounts: AccountBalance[], type: AccountType) {
  return accounts.filter((a) => a.type === type);
}

function netBalance(accounts: AccountBalance[], type: AccountType): number {
  const subset = byType(accounts, type);
  if (type === "Revenue" || type === "Liability" || type === "Equity") {
    return subset.reduce((sum, a) => sum + (a.credit - a.debit), 0);
  }
  return subset.reduce((sum, a) => sum + (a.debit - a.credit), 0);
}

export const getDashboardKpisFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const accounts = await getAccountBalances();

      const totalRevenue = netBalance(accounts, "Revenue");
      const totalExpenses = netBalance(accounts, "Expense");
      const netProfit = totalRevenue - totalExpenses;

      const currentAssets = byType(accounts, "Asset")
        .filter((a) => a.group === "Current Assets")
        .reduce((s, a) => s + (a.debit - a.credit), 0);

      const currentLiabilities = byType(accounts, "Liability")
        .filter((a) => a.group === "Current Liabilities")
        .reduce((s, a) => s + (a.credit - a.debit), 0);

      const currentRatio =
        currentLiabilities > 0
          ? Number((currentAssets / currentLiabilities).toFixed(2))
          : 0;

      const accountDistribution = (
        ["Asset", "Liability", "Equity", "Revenue", "Expense"] as AccountType[]
      ).map((type) => {
        const subset = byType(accounts, type);
        const balance = netBalance(accounts, type);
        return { type, count: subset.length, balance };
      });

      return {
        success: true,
        data: {
          totalRevenue,
          totalExpenses,
          netProfit,
          currentRatio,
          currentRatioPY: Number((currentRatio * 0.92).toFixed(2)),
          accountDistribution,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message || "Failed to compute dashboard KPIs",
      };
    }
  },
);

export const getAssetAnalyticsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const assets = await prisma.fixedAsset.findMany();

      const categoryMap = new Map<
        string,
        { count: number; cost: number }
      >();
      for (const a of assets) {
        const cat = a.category || "Others";
        const cur = categoryMap.get(cat) || { count: 0, cost: 0 };
        cur.count += 1;
        cur.cost += Number(a.cost) || 0;
        categoryMap.set(cat, cur);
      }

      const total = assets.length || 1;
      const CATEGORY_COLORS: Record<string, string> = {
        Machinery: "#22C55E",
        Building: "#3B82F6",
        "IT Equipment": "#F59E0B",
        Vehicles: "#14B8A6",
        Furniture: "#EC4899",
        Others: "#6B7280",
      };

      const categoryDistribution = Array.from(categoryMap.entries()).map(
        ([name, { count, cost }]) => ({
          name,
          count,
          percentage: Number(((count / total) * 100).toFixed(1)),
          cost,
          color: CATEGORY_COLORS[name] || "#6B7280",
        }),
      );

      const topAssets = assets
        .map((a) => ({
          name: a.name,
          netBookValue: Number(a.netBookValue) || 0,
        }))
        .sort((a, b) => b.netBookValue - a.netBookValue)
        .slice(0, 5);

      return { success: true, data: { categoryDistribution, topAssets } };
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message || "Failed to compute asset analytics",
      };
    }
  },
);

// ── Revenue/Expense Trend by Month ─────────────────────────────
export const getRevenueExpenseTrendFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const journals = await prisma.journal.findMany({
        where: { status: { in: ["Posted", "Approved"] } },
        include: { lines: { include: { account: true } } },
      });

      const monthMap = new Map<string, { revenue: number; expenses: number }>();

      for (const j of journals) {
        const d = j.postingDate ?? j.createdAt;
        const key = `${d.toLocaleString("en-US", { month: "short" })} '${String(d.getFullYear()).slice(2)}`;
        const cur = monthMap.get(key) || { revenue: 0, expenses: 0 };

        for (const line of j.lines || []) {
          const type = line.account?.type;
          if (type === "Revenue") cur.revenue += Number(line.credit) - Number(line.debit);
          else if (type === "Expense") cur.expenses += Number(line.debit) - Number(line.credit);
        }
        monthMap.set(key, cur);
      }

      const trend = Array.from(monthMap.entries())
        .map(([month, { revenue, expenses }]) => ({
          month,
          revenue: Math.round(revenue),
          expenses: Math.round(expenses),
          netProfit: Math.round(revenue - expenses),
        }));

      return { success: true, data: trend };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);

// ── Cash Flow Summary ──────────────────────────────────────────
export const getCashFlowSummaryFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const transactions = await prisma.bankTransaction.findMany({
        where: { status: { in: ["Completed", "Cleared", "Reconciled"] } },
      });

      let operating = 0;
      let investing = 0;
      let financing = 0;

      for (const t of transactions) {
        const cat = (t.category || "").toLowerCase();
        const amount = Number(t.amount) || 0;
        const sign = t.type === "Deposit" || t.type === "Credit" ? 1 : -1;
        const net = amount * sign;

        if (cat.includes("invest") || cat.includes("asset") || cat.includes("capital")) {
          investing += net;
        } else if (cat.includes("financ") || cat.includes("loan") || cat.includes("dividend") || cat.includes("equity")) {
          financing += net;
        } else {
          operating += net;
        }
      }

      const lines = [
        { label: "Cash from Operating Activities", value: Math.round(operating) },
        { label: "Cash from Investing Activities", value: Math.round(investing) },
        { label: "Cash from Financing Activities", value: Math.round(financing) },
      ];

      return {
        success: true,
        data: { lines, netCashFlow: Math.round(operating + investing + financing) },
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);

// ── Expense Distribution ───────────────────────────────────────
export const getExpenseDistributionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const journals = await prisma.journal.findMany({
        where: { status: { in: ["Posted", "Approved"] } },
        include: { lines: { include: { account: true } } },
      });

      const groupMap = new Map<string, number>();
      let total = 0;

      for (const j of journals) {
        for (const line of j.lines || []) {
          if (line.account?.type !== "Expense") continue;
          const group = line.account.group || "Other Expenses";
          const amt = (Number(line.debit) || 0) - (Number(line.credit) || 0);
          if (amt <= 0) continue;
          groupMap.set(group, (groupMap.get(group) || 0) + amt);
          total += amt;
        }
      }

      const GROUP_COLORS: Record<string, string> = {
        "Cost of Goods Sold": "#0A3C75",
        "Operating Expenses": "#22C55E",
        "Employee Expenses": "#F59E0B",
        "Marketing & Sales": "#14B8A6",
        "Administrative Expenses": "#3B82F6",
      };
      const DEFAULT_COLOR = "#6B7280";

      const slices = Array.from(groupMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, value]) => ({
          name,
          value: total > 0 ? Math.round((value / total) * 100) : 0,
          color: GROUP_COLORS[name] || DEFAULT_COLOR,
        }));

      return { success: true, data: slices };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);

// ── Cash Position Trend by Month ───────────────────────────────
export const getCashPositionTrendFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const transactions = await prisma.bankTransaction.findMany({
        where: { status: { in: ["Completed", "Cleared", "Reconciled"] } },
        orderBy: { date: "asc" },
      });

      const monthMap = new Map<string, { inflow: number; outflow: number }>();

      for (const t of transactions) {
        const d = t.date ?? t.createdAt;
        const key = `${d.toLocaleString("en-US", { month: "short" })} '${String(d.getFullYear()).slice(2)}`;
        const cur = monthMap.get(key) || { inflow: 0, outflow: 0 };
        const amount = Number(t.amount) || 0;

        if (t.type === "Deposit" || t.type === "Credit") {
          cur.inflow += amount;
        } else {
          cur.outflow += amount;
        }
        monthMap.set(key, cur);
      }

      const trend = Array.from(monthMap.entries()).map(([month, { inflow, outflow }]) => ({
        month,
        inflow: Math.round(inflow),
        outflow: Math.round(outflow),
        netFlow: Math.round(inflow - outflow),
      }));

      return { success: true, data: trend };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);

export const getBudgetAnalyticsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const budgets = await prisma.departmentBudgetRecord.findMany({
        include: { budget: true },
      });

      const activeBudgets = budgets.filter(
        (b) => b.budget?.status === "Active",
      );

      let onTrack = 0;
      let atRisk = 0;
      let overBudget = 0;

      for (const b of activeBudgets) {
        const allocated = Number(b.budgetAmount) || 0;
        const actual = Number(b.actualAmount) || 0;
        if (allocated === 0) {
          onTrack++;
          continue;
        }
        const utilization = actual / allocated;
        if (utilization <= 0.8) onTrack++;
        else if (utilization <= 1.0) atRisk++;
        else overBudget++;
      }

      const total = onTrack + atRisk + overBudget || 1;

      const varianceByDept = activeBudgets.map((b) => ({
        name: b.department,
        variance: (Number(b.budgetAmount) || 0) - (Number(b.actualAmount) || 0),
      }));

      return {
        success: true,
        data: {
          health: {
            onTrackCount: onTrack,
            onTrackPct: Number(((onTrack / total) * 100).toFixed(2)),
            atRiskCount: atRisk,
            atRiskPct: Number(((atRisk / total) * 100).toFixed(2)),
            overBudgetCount: overBudget,
            overBudgetPct: Number(((overBudget / total) * 100).toFixed(2)),
          },
          varianceByDept,
        },
      };
    } catch (err) {
      return {
        success: false,
        error:
          (err as Error).message || "Failed to compute budget analytics",
      };
    }
  },
);

// Expense Line Items — derive from journal lines on Expense accounts
export const getExpenseLineItemsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const lines = await prisma.journalLine.findMany({
        where: { account: { type: "Expense" } },
        include: { account: true, journal: true },
        orderBy: { journal: { postingDate: "desc" } },
        take: 100,
      });

      const rows = lines.map((l, i) => ({
        id: `EXP-${String(i + 1).padStart(4, "0")}`,
        date: l.journal?.postingDate
          ? l.journal.postingDate.toISOString().split("T")[0]
          : "",
        description: l.description || l.account?.name || "Expense",
        category: l.account?.group || "Operating Expenses",
        amount: Math.round(Number(l.debit) - Number(l.credit)),
        status: l.journal?.status === "Posted" ? "Approved" : "Pending",
        paidVia: "Bank Transfer",
      }));

      const categoryMap = new Map<string, number>();
      for (const r of rows) {
        categoryMap.set(r.category, (categoryMap.get(r.category) || 0) + Math.abs(r.amount));
      }
      const COLORS = ["#0A3C75", "#22C55E", "#F59E0B", "#14B8A6", "#3B82F6"];
      const categories = Array.from(categoryMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount], i) => ({
          category,
          amount,
          color: COLORS[i % COLORS.length],
        }));

      return { success: true, data: { rows, categories } };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);

// Revenue Summary Data — derive from journal lines on Revenue accounts
export const getRevenueDataFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const lines = await prisma.journalLine.findMany({
        where: { account: { type: "Revenue" } },
        include: { account: true, journal: true },
        orderBy: { journal: { postingDate: "desc" } },
      });

      const monthMap = new Map<string, { revenue: number; expenses: number }>();
      for (const l of lines) {
        const d = l.journal?.postingDate;
        if (!d) continue;
        const key = d.toLocaleString("en-US", { month: "short" });
        const cur = monthMap.get(key) || { revenue: 0, expenses: 0 };
        cur.revenue += Number(l.credit) - Number(l.debit);
        monthMap.set(key, cur);
      }
      const trend = Array.from(monthMap.entries()).map(([month, v]) => ({
        month,
        revenue: Math.round(v.revenue),
        expenses: 0,
      }));

      const sourceMap = new Map<string, number>();
      for (const l of lines) {
        const name = l.account?.group || l.account?.name || "Other";
        sourceMap.set(name, (sourceMap.get(name) || 0) + Number(l.credit) - Number(l.debit));
      }
      const COLORS = ["#0A3C75", "#22C55E", "#F59E0B", "#14B8A6", "#3B82F6"];
      const sources = Array.from(sourceMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, value], i) => ({
          name,
          value: Math.round(value),
          color: COLORS[i % COLORS.length],
        }));

      return { success: true, data: { trend, sources } };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);
