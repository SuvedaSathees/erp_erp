/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type {
  AccountNode,
  AccountType,
  ApprovalLevelName,
  ApprovalStepStatusValue,
  JournalRecord,
  NewAccountInput,
  NewJournalInput,
  LedgerKpis,
  TrialBalanceReport,
  LedgerJournalEntry,
  AccountSummary,
  CurrencyInfo,
  TaxInfo,
  SupportingDocumentsInfo,
  JournalMetadata,
} from "@/services/types";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

export const CURRENT_USER = "Priya Sharma";
const CEO_THRESHOLD = 1_00_00_000; // ₹1 Crore

const BASE_APPROVAL_LEVELS: ApprovalLevelName[] = [
  "Accountant",
  "Finance Manager",
  "Financial Controller",
  "CFO",
];

const LEVEL_ORDER: ApprovalLevelName[] = [
  "Accountant",
  "Finance Manager",
  "Financial Controller",
  "CFO",
  "CEO",
];

function toPrismaApprovalLevel(level: ApprovalLevelName): any {
  if (level === "Finance Manager") return "FinanceManager";
  if (level === "Financial Controller") return "FinancialController";
  return level;
}

function fromPrismaApprovalLevel(level: string): ApprovalLevelName {
  if (level === "FinanceManager") return "Finance Manager";
  if (level === "FinancialController") return "Financial Controller";
  return level as ApprovalLevelName;
}

const NORMAL_BALANCE: Record<AccountType, "Debit" | "Credit"> = {
  Asset: "Debit",
  Expense: "Debit",
  Liability: "Credit",
  Equity: "Credit",
  Revenue: "Credit",
};

interface AccountDoc {
  code: string;
  name: string;
  type: AccountType;
  group: string;
  currency: string;
  isActive: boolean;
  parentAccountId?: string | null;
  parentAccountCode: string | null;
  openingBalance: number;
  debit?: number;
  credit?: number;
}

// Convert Prisma Journal model to typed client record
function shapeJournal(j: any): JournalRecord {
  if (!j) throw new Error("Journal not found.");
  const lines = (j.lines || []).map((l: any) => ({
    accountCode: l.account?.code || l.accountCode || "",
    accountName: l.account?.name || l.accountName || "",
    description: l.description || "",
    debit: Number(l.debit) || 0,
    credit: Number(l.credit) || 0,
    dimensions: l.dimensions || {},
  }));

  const totalDebit = lines.reduce((s: number, l: any) => s + l.debit, 0);
  const totalCredit = lines.reduce((s: number, l: any) => s + l.credit, 0);

  const approvalSteps = (j.approvalSteps || []).map((s: any) => ({
    level: fromPrismaApprovalLevel(s.level),
    approverName: s.approverName || "Priya Sharma",
    status: s.status as ApprovalStepStatusValue,
    date: s.date instanceof Date ? s.date.toISOString() : s.date || null,
  }));

  return {
    id: j.id,
    journalNumber: j.journalNumber,
    voucherNumber: j.voucherNumber ?? null,
    postingDate: j.postingDate instanceof Date ? j.postingDate.toISOString() : String(j.postingDate),
    accountingDate:
      j.accountingDate instanceof Date ? j.accountingDate.toISOString() : String(j.accountingDate),
    fiscalYear: j.fiscalYear,
    accountingPeriod: j.accountingPeriod,
    journalType: j.journalType,
    status: j.status,
    companyId: j.companyId ?? null,
    businessUnitId: j.businessUnitId ?? null,
    divisionId: j.divisionId ?? null,
    branchId: j.branchId ?? null,
    costCenterId: j.costCenterId ?? null,
    profitCenterId: j.profitCenterId ?? null,
    projectId: j.projectId ?? null,
    departmentId: j.departmentId ?? null,
    lines,
    totalDebit,
    totalCredit,
    approvalSteps,
    createdAt: j.createdAt instanceof Date ? j.createdAt.toISOString() : String(j.createdAt),
    currencyInfo: {
      transactionCurrency: "INR",
      baseCurrency: "INR",
      exchangeRate: 1,
      exchangeRateDate: j.postingDate instanceof Date ? j.postingDate.toISOString().slice(0, 10) : "",
      foreignCurrencyGainLoss: 0,
    },
    taxInfo: {
      gstType: "CGST/SGST",
      gstin: "33AAAAA1111A1Z1",
      taxCode: "GST-18%",
      taxAmount: Math.round(totalDebit * 0.18),
      reverseCharge: false,
      tds: 0,
      tcs: 0,
    },
    supportingDocuments: {
      journalVoucher: { status: "Not Attached" },
      invoice: { status: "Not Attached" },
      purchaseOrder: { status: "Not Attached" },
      paymentVoucher: { status: "Not Attached" },
      bankStatement: { status: "Not Attached" },
      taxDocument: { status: "Not Attached" },
      approvalRecord: { status: "Not Attached" },
    },
    metadataInfo: {
      createdBy: CURRENT_USER,
      createdDate: j.createdAt instanceof Date ? j.createdAt.toISOString() : new Date().toISOString(),
      lastModifiedBy: CURRENT_USER,
      lastModifiedDate: j.updatedAt instanceof Date ? j.updatedAt.toISOString() : new Date().toISOString(),
      journalVersion: 1,
      erpReferenceNumber: j.voucherNumber || `ERP-REF-${j.journalNumber}`,
      fiscalCalendar: j.fiscalYear,
      auditTrail: true,
      digitalSignature: true,
      recordStatus: "Active",
    },
  };
}

// Build the Account Tree structure for UI
function buildAccountTree(accounts: AccountDoc[]): AccountNode[] {
  const nodeByCode = new Map<string, AccountNode>();
  for (const a of accounts) {
    nodeByCode.set(a.code, {
      code: a.code,
      name: a.name,
      type: a.type,
      group: a.group,
      normalBalance: NORMAL_BALANCE[a.type],
      debit: a.debit || 0,
      credit: a.credit || 0,
      status: a.isActive ? "Active" : "Inactive",
      openingBalance: a.openingBalance,
    });
  }

  const roots: AccountNode[] = [];
  for (const a of accounts) {
    const node = nodeByCode.get(a.code)!;
    if (a.parentAccountCode) {
      const parent = nodeByCode.get(a.parentAccountCode);
      if (parent) {
        parent.children = parent.children ? [...parent.children, node] : [node];
      } else {
        roots.push(node);
      }
    } else {
      roots.push(node);
    }
  }
  return roots;
}

// Get accounts with real calculations based on posted/approved journals
export async function getAccountsWithCalculations(): Promise<AccountDoc[]> {
  const prisma = await getPrisma();

  const accounts = await prisma.account.findMany({
    include: { parentAccount: true },
    orderBy: { code: "asc" },
  });

  const postedJournals = await prisma.journal.findMany({
    where: { status: { in: ["Posted", "Approved"] } },
    include: {
      lines: {
        include: { account: true },
      },
    },
  });

  const balanceByCode = new Map<string, { debit: number; credit: number }>();
  for (const journal of postedJournals) {
    for (const line of journal.lines || []) {
      const code = line.account?.code;
      if (!code) continue;
      const current = balanceByCode.get(code) || { debit: 0, credit: 0 };
      current.debit += Number(line.debit) || 0;
      current.credit += Number(line.credit) || 0;
      balanceByCode.set(code, current);
    }
  }

  return accounts.map((a) => {
    const balances = balanceByCode.get(a.code) || { debit: 0, credit: 0 };
    return {
      code: a.code,
      name: a.name,
      type: a.type as AccountType,
      group: a.group,
      currency: a.currency,
      isActive: a.isActive,
      parentAccountId: a.parentAccountId,
      parentAccountCode: a.parentAccount?.code || null,
      openingBalance: 0,
      debit: balances.debit,
      credit: balances.credit,
    };
  });
}

/* ===========================================================================
   API Server Functions
   =========================================================================== */

// Retrieve full accounts tree
export const getAccountsTreeFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const accounts = await getAccountsWithCalculations();
    return { success: true, data: buildAccountTree(accounts) };
  } catch (err) {
    return { success: false, error: (err as Error).message || "Failed to fetch accounts tree" };
  }
});

// Create new Account
export const createAccountFn = createServerFn({ method: "POST" })
  .validator((d: NewAccountInput) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const existing = await prisma.account.findUnique({ where: { code: data.code } });
      if (existing) {
        throw new Error(`Account code ${data.code} already exists.`);
      }

      let parentAccountId: string | undefined;
      if (data.parentAccountCode) {
        const parent = await prisma.account.findUnique({
          where: { code: data.parentAccountCode },
        });
        if (parent) parentAccountId = parent.id;
      }

      const created = await prisma.account.create({
        data: {
          code: data.code,
          name: data.name,
          type: data.type as any,
          group: data.group,
          currency: data.currency || "INR",
          isActive: data.isActive,
          parentAccountId,
        },
      });

      return {
        success: true,
        data: {
          code: created.code,
          name: created.name,
          type: created.type as AccountType,
          group: created.group,
          normalBalance: NORMAL_BALANCE[created.type as AccountType],
          debit: 0,
          credit: 0,
          status: created.isActive ? "Active" : "Inactive",
          openingBalance: 0,
        } as AccountNode,
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// Update Account
export const updateAccountFn = createServerFn({ method: "POST" })
  .validator((d: { code: string; patch: Partial<NewAccountInput> }) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const existing = await prisma.account.findUnique({ where: { code: data.code } });
      if (!existing) {
        throw new Error(`Account code ${data.code} not found.`);
      }

      let parentAccountId: string | null | undefined = undefined;
      if (data.patch.parentAccountCode !== undefined) {
        if (data.patch.parentAccountCode) {
          const parent = await prisma.account.findUnique({
            where: { code: data.patch.parentAccountCode },
          });
          parentAccountId = parent?.id || null;
        } else {
          parentAccountId = null;
        }
      }

      const updated = await prisma.account.update({
        where: { code: data.code },
        data: {
          ...(data.patch.name !== undefined && { name: data.patch.name }),
          ...(data.patch.type !== undefined && { type: data.patch.type as any }),
          ...(data.patch.group !== undefined && { group: data.patch.group }),
          ...(data.patch.currency !== undefined && { currency: data.patch.currency }),
          ...(data.patch.isActive !== undefined && { isActive: data.patch.isActive }),
          ...(parentAccountId !== undefined && { parentAccountId }),
        },
      });

      return {
        success: true,
        data: {
          code: updated.code,
          name: updated.name,
          type: updated.type as AccountType,
          group: updated.group,
          normalBalance: NORMAL_BALANCE[updated.type as AccountType],
          debit: 0,
          credit: 0,
          status: updated.isActive ? "Active" : "Inactive",
          openingBalance: 0,
        } as AccountNode,
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// Fetch all Journals
export const getJournalsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const journals = await prisma.journal.findMany({
      include: {
        lines: {
          include: { account: true },
          orderBy: { lineNumber: "asc" },
        },
        approvalSteps: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: journals.map(shapeJournal) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

// Fetch single Journal by ID
export const getJournalFn = createServerFn({ method: "GET" })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    try {
      const prisma = await getPrisma();
      const journal = await prisma.journal.findFirst({
        where: {
          OR: [{ id }, { journalNumber: id }],
        },
        include: {
          lines: {
            include: { account: true },
            orderBy: { lineNumber: "asc" },
          },
          approvalSteps: true,
        },
      });
      if (!journal) throw new Error("Journal entry not found.");
      return { success: true, data: shapeJournal(journal) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// Create new Journal
export const createJournalFn = createServerFn({ method: "POST" })
  .validator((d: NewJournalInput) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();

      const totalDebit = data.lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
      const totalCredit = data.lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
      if (Math.round(totalDebit * 100) !== Math.round(totalCredit * 100)) {
        throw new Error("Total debit must equal total credit.");
      }
      if (data.lines.length < 2) {
        throw new Error("A journal entry requires at least two lines.");
      }

      // Verify account codes
      const codes = data.lines.map((l) => l.accountCode);
      const dbAccounts = await prisma.account.findMany({
        where: { code: { in: codes } },
      });
      const accountByCode = new Map(dbAccounts.map((a) => [a.code, a]));
      for (const code of codes) {
        if (!accountByCode.has(code)) {
          throw new Error(`Account code ${code} does not exist in Chart of Accounts.`);
        }
      }

      const journalCount = await prisma.journal.count();
      const journalNumber = `JE-${String(journalCount + 1).padStart(5, "0")}`;

      const levels: ApprovalLevelName[] =
        totalDebit > CEO_THRESHOLD ? [...BASE_APPROVAL_LEVELS, "CEO"] : BASE_APPROVAL_LEVELS;

      const created = await prisma.journal.create({
        data: {
          journalNumber,
          voucherNumber: data.voucherNumber || null,
          postingDate: new Date(data.postingDate),
          accountingDate: new Date(data.accountingDate),
          fiscalYear: data.fiscalYear,
          accountingPeriod: data.accountingPeriod,
          journalType: data.journalType as any,
          status: "Draft",
          companyId: data.companyId || null,
          businessUnitId: data.businessUnitId || null,
          divisionId: data.divisionId || null,
          branchId: data.branchId || null,
          costCenterId: data.costCenterId || null,
          profitCenterId: data.profitCenterId || null,
          projectId: data.projectId || null,
          departmentId: data.departmentId || null,
          lines: {
            create: data.lines.map((l, index) => ({
              accountId: accountByCode.get(l.accountCode)!.id,
              description: l.description || "",
              debit: l.debit,
              credit: l.credit,
              lineNumber: index + 1,
            })),
          },
          approvalSteps: {
            create: levels.map((level) => ({
              level: toPrismaApprovalLevel(level),
              approverName: CURRENT_USER,
              status: "Pending",
            })),
          },
        },
        include: {
          lines: {
            include: { account: true },
            orderBy: { lineNumber: "asc" },
          },
          approvalSteps: true,
        },
      });

      return { success: true, data: shapeJournal(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// Handle approval steps
export const approveJournalStepFn = createServerFn({ method: "POST" })
  .validator(
    (d: { journalId: string; level: ApprovalLevelName; decision: "Approved" | "Rejected" }) => d,
  )
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const journal = await prisma.journal.findFirst({
        where: {
          OR: [{ id: data.journalId }, { journalNumber: data.journalId }],
        },
        include: {
          lines: { include: { account: true } },
          approvalSteps: true,
        },
      });
      if (!journal) throw new Error("Journal not found.");

      const prismaLevel = toPrismaApprovalLevel(data.level);
      const step = journal.approvalSteps.find((s: any) => s.level === prismaLevel || s.level === data.level);
      if (!step) throw new Error("Approval level not found in approval chain.");

      await prisma.approvalStep.update({
        where: { id: step.id },
        data: {
          status: data.decision as any,
          date: new Date(),
        },
      });

      const refreshedSteps = await prisma.approvalStep.findMany({
        where: { journalId: journal.id },
      });

      let nextStatus = journal.status;
      if (data.decision === "Rejected") {
        nextStatus = "Draft";
        await prisma.approvalStep.updateMany({
          where: { journalId: journal.id },
          data: { status: "Pending", date: null },
        });
      } else {
        const allApproved = refreshedSteps.every((s) => s.status === "Approved");
        if (allApproved) {
          nextStatus = "Posted";
        }
      }

      const updated = await prisma.journal.update({
        where: { id: journal.id },
        data: { status: nextStatus as any },
        include: {
          lines: { include: { account: true }, orderBy: { lineNumber: "asc" } },
          approvalSteps: true,
        },
      });

      return { success: true, data: shapeJournal(updated) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// Get Live Dashboard KPI data (Total accounts, debits, credits, net income, plus AI intelligence scores)
export const getLedgerDashboardDataFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const accounts = await getAccountsWithCalculations();

    const totalAccounts = accounts.length;

    const journalsDb = await prisma.journal.findMany({
      include: {
        lines: { include: { account: true } },
        approvalSteps: true,
      },
    });
    const journals = journalsDb.map(shapeJournal);
    const postedJournals = journals.filter((j: any) => j.status === "Posted");

    let totalDebits = 0;
    let totalCredits = 0;
    let revenueSum = 0;
    let expenseSum = 0;

    for (const journal of postedJournals) {
      totalDebits += journal.totalDebit || 0;
      totalCredits += journal.totalCredit || 0;
      for (const line of journal.lines || []) {
        const acc = accounts.find((a) => a.code === line.accountCode);
        if (acc) {
          if (acc.type === "Revenue") {
            revenueSum += Number(line.credit) - Number(line.debit);
          } else if (acc.type === "Expense") {
            expenseSum += Number(line.debit) - Number(line.credit);
          }
        }
      }
    }

    const netIncome = revenueSum - expenseSum;

    const totalEntries = journals.length;
    const postedCount = postedJournals.length;
    const pendingCount = journals.filter(
      (j: any) => j.status === "Draft" && j.approvalSteps.some((s: any) => s.status === "Pending"),
    ).length;

    const trialBalanceDiff = Math.abs(totalDebits - totalCredits);

    let healthScore = 100;
    if (trialBalanceDiff > 0) healthScore -= 40;
    if (pendingCount > 0) healthScore -= Math.min(15, pendingCount * 2);
    healthScore = Math.max(0, healthScore);

    const totalSteps = journals.reduce(
      (sum: number, j: any) => sum + (j.approvalSteps || []).length,
      0,
    );
    const rejectedSteps = journals.reduce(
      (sum: number, j: any) =>
        sum + (j.approvalSteps || []).filter((s: any) => s.status === "Rejected").length,
      0,
    );
    const accuracyScore =
      totalSteps > 0 ? Math.round(((totalSteps - rejectedSteps) / totalSteps) * 100) : 100;

    const manualCount = journals.filter((j: any) => j.journalType === "Manual").length;
    const riskScore = totalEntries > 0 ? Math.round((manualCount / totalEntries) * 80) : 10;

    let fraudScore = 5;
    const seenLines = new Set<string>();
    for (const j of journals) {
      for (const l of j.lines || []) {
        const key = `${l.accountCode}-${l.debit}-${l.credit}`;
        if (seenLines.has(key)) {
          fraudScore += 8;
        } else {
          seenLines.add(key);
        }
        if (l.debit > 0 && l.debit % 10000 === 0) fraudScore += 1;
      }
    }
    fraudScore = Math.min(100, fraudScore);

    let closingReadiness = 90;
    if (trialBalanceDiff > 0) closingReadiness -= 50;
    if (pendingCount > 0) closingReadiness -= 20;

    const aiRecommendations: string[] = [];
    if (trialBalanceDiff > 0) {
      aiRecommendations.push(
        `Critical: Trial Balance has a mismatch of ₹${trialBalanceDiff.toLocaleString()}. Please review Journal lines.`,
      );
    } else {
      aiRecommendations.push("General Ledger is perfectly balanced and correct.");
    }
    if (pendingCount > 0) {
      aiRecommendations.push(
        `There are ${pendingCount} journal entries pending approvals in the workflow chain.`,
      );
    }
    if (fraudScore > 30) {
      aiRecommendations.push(
        "Risk Alert: Identified duplicate lines in ledger entries. Perform audit trail scan.",
      );
    }
    if (closingReadiness >= 80) {
      aiRecommendations.push(
        "Ready for Financial Period Closing. Standard year-end checklist can be initiated.",
      );
    }

    return {
      success: true,
      data: {
        kpis: {
          totalAccounts,
          totalDebits,
          totalCredits,
          netIncome,
          currentPeriod: "Jul 2026",
          periodStatus: "Open",
          totalJournalEntries: totalEntries,
          postedJournals: postedCount,
          pendingJournals: pendingCount,
          trialBalanceDifference: trialBalanceDiff,
          revenue: revenueSum,
          expenses: expenseSum,
          netProfit: netIncome,
        },
        aiIntelligence: {
          ledgerHealthScore: healthScore,
          journalAccuracyScore: accuracyScore,
          financialRiskScore: riskScore,
          fraudDetectionScore: fraudScore,
          closingReadinessScore: Math.max(0, closingReadiness),
          aiRecommendations: aiRecommendations.join(" | "),
        },
      },
    };
  } catch (err) {
    return { success: false, error: (err as Error).message || "Failed to load dashboard data" };
  }
});

// Fetch transaction activity history for a specific account code
export const getAccountActivityFn = createServerFn({ method: "POST" })
  .validator((code: string) => code)
  .handler(async ({ data: code }) => {
    try {
      const prisma = await getPrisma();
      const accounts = await getAccountsWithCalculations();

      const account = accounts.find((a) => a.code === code);
      if (!account) return { success: true, data: [] };

      const postedJournalsDb = await prisma.journal.findMany({
        where: { status: { in: ["Posted", "Approved"] } },
        include: {
          lines: { include: { account: true } },
        },
        orderBy: { postingDate: "asc" },
      });
      const postedJournals = postedJournalsDb.map(shapeJournal);

      const entries: LedgerJournalEntry[] = [];
      let runningBalance = account.openingBalance;

      for (const journal of postedJournals) {
        for (const line of journal.lines || []) {
          if (line.accountCode === code) {
            const isDebit = account.type === "Asset" || account.type === "Expense";
            const debVal = Number(line.debit) || 0;
            const credVal = Number(line.credit) || 0;
            if (isDebit) {
              runningBalance += debVal - credVal;
            } else {
              runningBalance += credVal - debVal;
            }
            entries.push({
              date: String(journal.postingDate || "").slice(0, 10),
              ref: journal.journalNumber,
              description: line.description || journal.journalNumber,
              debit: debVal,
              credit: credVal,
              balance: runningBalance,
            });
          }
        }
      }

      return { success: true, data: entries };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// Fetch Trial Balance report
export const getTrialBalanceReportFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const accounts = await getAccountsWithCalculations();
    const leafAccounts = accounts.filter((a) => {
      const isParent = accounts.some((other) => other.parentAccountCode === a.code);
      return !isParent;
    });

    const rows = leafAccounts.map((a) => ({
      code: a.code,
      name: a.name,
      debit: a.debit || 0,
      credit: a.credit || 0,
    }));

    const totalDebit = rows.reduce((s, r) => s + r.debit, 0);
    const totalCredit = rows.reduce((s, r) => s + r.credit, 0);

    return {
      success: true,
      data: { rows, totalDebit, totalCredit } as TrialBalanceReport,
    };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

const DEFAULT_INTEGRATION_SETTINGS: Record<string, string> = {
  accountsPayable: "Connected",
  accountsReceivable: "Connected",
  banking: "Connected",
  inventory: "Not Connected",
  manufacturing: "Not Connected",
  payroll: "Connected",
  fixedAssets: "Not Connected",
  projects: "Not Connected",
  taxManagement: "Connected",
  erpIntegration: "Connected",
};

export const getIntegrationSettingsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    let rows = await prisma.financeIntegrationSetting.findMany();

    // Auto-seed default 10 modules on first run if table is empty
    if (rows.length === 0) {
      await prisma.$transaction(
        Object.entries(DEFAULT_INTEGRATION_SETTINGS).map(([module, status]) =>
          prisma.financeIntegrationSetting.upsert({
            where: { module },
            update: {},
            create: { module, status },
          }),
        ),
      );
      rows = await prisma.financeIntegrationSetting.findMany();
    }

    const settingsMap: Record<string, string> = { ...DEFAULT_INTEGRATION_SETTINGS };
    for (const r of rows) {
      settingsMap[r.module] = r.status;
    }

    return { success: true, data: settingsMap };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const updateIntegrationSettingsFn = createServerFn({ method: "POST" })
  .validator((d: Record<string, string>) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();

      await prisma.$transaction(
        Object.entries(data).map(([module, status]) =>
          prisma.financeIntegrationSetting.upsert({
            where: { module },
            update: { status },
            create: { module, status },
          }),
        ),
      );

      const rows = await prisma.financeIntegrationSetting.findMany();
      const settingsMap: Record<string, string> = {};
      for (const r of rows) {
        settingsMap[r.module] = r.status;
      }

      return { success: true, data: settingsMap };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

