import { createServerFn } from "@tanstack/react-start";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

function journalToTransaction(j: any) {
  const totalDebit = j.lines?.reduce(
    (s: number, l: any) => s + Number(l.debit),
    0,
  ) ?? 0;
  const totalCredit = j.lines?.reduce(
    (s: number, l: any) => s + Number(l.credit),
    0,
  ) ?? 0;

  let type: string;
  if (j.journalType === "Automatic") type = "Invoice";
  else if (j.journalType === "Recurring") type = "Payment";
  else if (j.journalType === "Reversing") type = "Receipt";
  else type = "Journal Entry";

  return {
    ref: j.journalNumber,
    date: j.postingDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    description:
      j.lines?.[0]?.description ||
      `${j.journalType} entry — ${j.accountingPeriod}`,
    type,
    amount: totalDebit || totalCredit,
    status:
      j.status === "Posted"
        ? "Completed"
        : j.status === "Approved"
          ? "Completed"
          : j.status === "Draft"
            ? "Pending"
            : j.status,
  };
}

export const getTransactionsFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const journals = await prisma.journal.findMany({
        include: { lines: true },
        orderBy: { postingDate: "desc" },
      });
      return { success: true, data: journals.map(journalToTransaction) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);

export const getTransactionKpisFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const [totalCount, journals, pendingCount] = await Promise.all([
        prisma.journal.count(),
        prisma.journal.findMany({
          include: { lines: true },
          orderBy: { postingDate: "desc" },
        }),
        prisma.journal.count({ where: { status: "Draft" } }),
      ]);

      let totalAmount = 0;
      for (const j of journals) {
        for (const l of j.lines) {
          totalAmount += Number(l.debit);
        }
      }

      const now = new Date();
      const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const todayJournals = journals.filter(
        (j) => j.postingDate >= todayStart,
      );
      const monthJournals = journals.filter(
        (j) => j.postingDate >= monthStart,
      );

      const todayAmount = todayJournals.reduce(
        (s, j) =>
          s + j.lines.reduce((ls, l) => ls + Number(l.debit), 0),
        0,
      );
      const monthAmount = monthJournals.reduce(
        (s, j) =>
          s + j.lines.reduce((ls, l) => ls + Number(l.debit), 0),
        0,
      );

      return {
        success: true,
        data: {
          totalTransactions: totalCount,
          totalAmount,
          transactionsToday: {
            count: todayJournals.length,
            amount: todayAmount,
          },
          thisMonth: { count: monthJournals.length, amount: monthAmount },
          pendingApproval: { count: pendingCount, amount: 0 },
        },
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);

export const searchTransactionsFn = createServerFn({ method: "GET" })
  .validator(
    (data: {
      type?: string;
      status?: string;
      search?: string;
      sortDir?: string;
      page?: number;
      pageSize?: number;
    }) => data,
  )
  .handler(async ({ input }) => {
    try {
      const prisma = await getPrisma();
      const journals = await prisma.journal.findMany({
        include: { lines: true },
        orderBy: {
          postingDate: input.sortDir === "asc" ? "asc" : "desc",
        },
      });

      let rows = journals.map(journalToTransaction);

      if (input.type && input.type !== "All Types") {
        rows = rows.filter((r) => r.type === input.type);
      }
      if (input.status && input.status !== "All Statuses") {
        rows = rows.filter((r) => r.status === input.status);
      }
      if (input.search?.trim()) {
        const needle = input.search.trim().toLowerCase();
        rows = rows.filter(
          (r) =>
            r.ref.toLowerCase().includes(needle) ||
            r.description.toLowerCase().includes(needle) ||
            String(Math.abs(r.amount)).includes(needle),
        );
      }

      const total = rows.length;
      const page = input.page ?? 1;
      const pageSize = input.pageSize ?? 20;
      const start = (page - 1) * pageSize;
      const paged = rows.slice(start, start + pageSize);
      return { success: true, data: { rows: paged, total } };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

export const getRecentTransactionsFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const prisma = await getPrisma();
    const journals = await prisma.journal.findMany({
      include: { lines: true },
      orderBy: { postingDate: "desc" },
      take: 15,
    });
    return { success: true, data: journals.map(journalToTransaction) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});
