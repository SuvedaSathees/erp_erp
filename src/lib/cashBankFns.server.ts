/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type {
  BankAccount,
  BankAccountFilters,
  NewBankAccountInput,
  CashTransaction,
  NewCashTransactionInput,
  ChequeRecord,
  DepositRecord,
  BankReconciliationSummary,
} from "@/services/types";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

function shapeBankAccount(a: any): BankAccount {
  const reconStatusMap: Record<string, "Reconciled" | "Partially Reconciled" | "Not Reconciled"> = {
    Reconciled: "Reconciled",
    PartiallyReconciled: "Partially Reconciled",
    NotReconciled: "Not Reconciled",
  };

  return {
    id: a.bankAccountId || a.id,
    name: a.name,
    bankName: a.bankName,
    type: a.type as any,
    accountNo: a.accountNo,
    currency: a.currency || "INR",
    currentBalance: Number(a.currentBalance) || 0,
    status: (a.status as any) || "Active",
    reconciliationStatus: reconStatusMap[a.reconciliationStatus] || "Not Reconciled",
    unreconciledAmount: Number(a.unreconciledAmount) || 0,
  };
}

function shapeCashTransaction(t: any): CashTransaction {
  return {
    id: t.transactionId || t.id,
    date: t.date instanceof Date ? t.date.toISOString().slice(0, 10) : String(t.date),
    description: t.description,
    type: t.type as any,
    amount: Number(t.amount) || 0,
    bankAccountNo: t.bankAccount?.accountNo || t.bankAccountNo || "",
    reference: t.reference || undefined,
    category: t.category || "General",
    status: t.status as any,
  };
}

function shapeCheque(c: any): ChequeRecord {
  return {
    id: c.chequeNo || c.id,
    chequeNo: c.chequeNo || c.id,
    bankAccountNo: c.bankAccount?.accountNo || "",
    issueDate: c.issueDate instanceof Date ? c.issueDate.toISOString().slice(0, 10) : String(c.issueDate),
    payee: c.payee,
    amount: Number(c.amount) || 0,
    status: c.status as any,
  };
}

function shapeDeposit(d: any): DepositRecord {
  return {
    id: d.depositNo || d.id,
    depositNo: d.depositNo || d.id,
    bankAccountNo: d.bankAccount?.accountNo || "",
    depositDate: d.depositDate instanceof Date ? d.depositDate.toISOString().slice(0, 10) : String(d.depositDate),
    source: d.source,
    amount: Number(d.amount) || 0,
    status: d.status as any,
  };
}

// ---------------------------------------------------------------------------
// Bank Accounts CRUD
// ---------------------------------------------------------------------------

export const getBankAccountsFn = createServerFn({ method: "GET" })
  .validator((filters?: BankAccountFilters) => filters)
  .handler(async ({ data: filters }) => {
    try {
      const prisma = await getPrisma();
      const accounts = await prisma.bankAccount.findMany({
        orderBy: { createdAt: "desc" },
      });

      let list = accounts.map(shapeBankAccount);

      if (filters) {
        if (filters.search) {
          const s = filters.search.toLowerCase();
          list = list.filter(
            (a) =>
              a.name.toLowerCase().includes(s) ||
              a.bankName.toLowerCase().includes(s) ||
              a.accountNo.includes(s),
          );
        }
        if (filters.type && filters.type !== "All Types") {
          list = list.filter((a) => a.type === filters.type);
        }
        if (filters.status && filters.status !== "All Statuses") {
          list = list.filter((a) => a.status === filters.status);
        }
        if (filters.currency && filters.currency !== "All Currency") {
          list = list.filter((a) => a.currency === filters.currency);
        }
      }

      return { success: true, data: list };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const getBankAccountFn = createServerFn({ method: "GET" })
  .validator((accountNoOrId: string) => accountNoOrId)
  .handler(async ({ data: accountNoOrId }) => {
    try {
      const prisma = await getPrisma();
      const acc = await prisma.bankAccount.findFirst({
        where: {
          OR: [{ accountNo: accountNoOrId }, { bankAccountId: accountNoOrId }, { id: accountNoOrId }],
        },
      });
      if (!acc) return { success: true, data: undefined };
      return { success: true, data: shapeBankAccount(acc) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const createBankAccountFn = createServerFn({ method: "POST" })
  .validator((input: NewBankAccountInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const prisma = await getPrisma();
      const count = await prisma.bankAccount.count();
      const bankAccountId = `BA-00${count + 1}`;
      const balance = Number(input.initialBalance) || 0;

      const created = await prisma.bankAccount.create({
        data: {
          bankAccountId,
          name: input.name,
          bankName: input.bankName,
          type: (input.type as any) || "Operating",
          accountNo: input.accountNo,
          currency: input.currency || "INR",
          currentBalance: balance,
          status: "Active",
          reconciliationStatus: "NotReconciled",
          unreconciledAmount: balance,
        },
      });

      return { success: true, data: shapeBankAccount(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// ---------------------------------------------------------------------------
// Cash & Bank Transactions
// ---------------------------------------------------------------------------

export const getCashTransactionsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const txs = await prisma.bankTransaction.findMany({
      include: { bankAccount: true },
      orderBy: { date: "desc" },
    });
    return { success: true, data: txs.map(shapeCashTransaction) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const createCashTransactionFn = createServerFn({ method: "POST" })
  .validator((input: NewCashTransactionInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const prisma = await getPrisma();
      const count = await prisma.bankTransaction.count();
      const transactionId = `CT-0${count + 1}`;
      const amount = Number(input.amount) || 0;

      const account = await prisma.bankAccount.findFirst({
        where: { OR: [{ accountNo: input.bankAccountNo }, { id: input.bankAccountNo }] },
      });

      if (account) {
        const curBal = Number(account.currentBalance) || 0;
        const newBal = input.type === "Inflow" ? curBal + amount : curBal - amount;

        await prisma.bankAccount.update({
          where: { id: account.id },
          data: { currentBalance: newBal },
        });

        const tx = await prisma.bankTransaction.create({
          data: {
            transactionId,
            bankAccountId: account.id,
            date: new Date(input.date),
            description: input.description,
            type: input.type,
            amount,
            reference: input.reference || null,
            category: input.category || null,
            status: "Posted",
          },
          include: { bankAccount: true },
        });

        return { success: true, data: shapeCashTransaction(tx) };
      }

      throw new Error(`Bank account ${input.bankAccountNo} not found.`);
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const getChequesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const cheques = await prisma.bankCheque.findMany({
      include: { bankAccount: true },
      orderBy: { issueDate: "desc" },
    });
    return { success: true, data: cheques.map(shapeCheque) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getDepositsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const deposits = await prisma.bankDeposit.findMany({
      include: { bankAccount: true },
      orderBy: { depositDate: "desc" },
    });
    return { success: true, data: deposits.map(shapeDeposit) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getReconciliationSummaryFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const accounts = await prisma.bankAccount.findMany();
    const totalAccounts = accounts.length;
    const reconciledCount = accounts.filter((a) => a.reconciliationStatus === "Reconciled").length;
    const partiallyReconciledCount = accounts.filter((a) => a.reconciliationStatus === "PartiallyReconciled").length;
    const notReconciledCount = totalAccounts - reconciledCount - partiallyReconciledCount;

    const summary: BankReconciliationSummary = {
      reconciledCount,
      partiallyReconciledCount,
      notReconciledCount,
      totalAccounts,
    };
    return { success: true, data: summary };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});
