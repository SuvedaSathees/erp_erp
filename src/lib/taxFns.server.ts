/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type {
  TaxObligation,
  TaxFiling,
  TaxPayment,
  TaxReconciliation,
  TaxAuthority,
  NewFilingInput,
  NewTaxPaymentInput,
} from "@/services/types";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

function shapeObligation(o: any): TaxObligation {
  const statusMap: Record<string, "Paid" | "Partially Paid" | "Due Soon" | "Pending"> = {
    Paid: "Paid",
    PartiallyPaid: "Partially Paid",
    DueSoon: "Due Soon",
    Pending: "Pending",
  };

  return {
    id: o.obligationId || o.id,
    taxType: o.taxType,
    jurisdiction: o.jurisdiction,
    period: o.period,
    dueDate:
      o.dueDate instanceof Date
        ? o.dueDate.toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : String(o.dueDate),
    taxLiability: Number(o.taxLiability) || 0,
    paid: Number(o.paid) || 0,
    payable: Number(o.payable) || 0,
    status: statusMap[o.status] || (o.status as any) || "Pending",
  };
}

function shapeFiling(f: any): TaxFiling {
  return {
    id: f.filingId || f.id,
    taxType: f.taxType,
    period: f.period,
    filingDate: f.filingDate instanceof Date ? f.filingDate.toISOString().slice(0, 10) : String(f.filingDate),
    filedBy: f.filedBy,
    returnAmount: Number(f.returnAmount) || 0,
    acknowledgementNo: f.acknowledgementNo,
    status: f.status as any,
  };
}

function shapePayment(p: any): TaxPayment {
  return {
    id: p.paymentId || p.id,
    taxType: p.taxType,
    period: p.period,
    paymentDate: p.paymentDate instanceof Date ? p.paymentDate.toISOString().slice(0, 10) : String(p.paymentDate),
    bankAccount: p.bankAccount,
    amount: Number(p.amount) || 0,
    transactionRef: p.transactionRef,
    status: p.status as any,
  };
}

function shapeReconciliation(r: any): TaxReconciliation {
  return {
    id: r.reconId || r.id,
    taxType: r.taxType,
    period: r.period,
    returnsLiability: Number(r.returnsLiability) || 0,
    booksLiability: Number(r.booksLiability) || 0,
    difference: Number(r.difference) || 0,
    status: r.status as any,
  };
}

function shapeAuthority(a: any): TaxAuthority {
  return {
    id: a.authorityId || a.id,
    name: a.name,
    jurisdiction: a.jurisdiction,
    taxType: a.taxType,
    portalUrl: a.portalUrl || "",
    contactPerson: a.contactPerson || "",
    email: a.email || "",
  };
}

// ---------------------------------------------------------------------------
// Tax Obligations CRUD
// ---------------------------------------------------------------------------

export const getTaxObligationsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const obligations = await prisma.taxObligation.findMany({
      orderBy: { dueDate: "asc" },
    });
    return { success: true, data: obligations.map(shapeObligation) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getTaxObligationFn = createServerFn({ method: "GET" })
  .validator((idOrCode: string) => idOrCode)
  .handler(async ({ data: idOrCode }) => {
    try {
      const prisma = await getPrisma();
      const obligation = await prisma.taxObligation.findFirst({
        where: { OR: [{ obligationId: idOrCode }, { id: idOrCode }] },
      });
      if (!obligation) return { success: true, data: undefined };
      return { success: true, data: shapeObligation(obligation) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// ---------------------------------------------------------------------------
// Tax Filings CRUD
// ---------------------------------------------------------------------------

export const getTaxFilingsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const filings = await prisma.taxFiling.findMany({
      orderBy: { filingDate: "desc" },
    });
    return { success: true, data: filings.map(shapeFiling) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const createTaxFilingFn = createServerFn({ method: "POST" })
  .validator((input: NewFilingInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const prisma = await getPrisma();
      const count = await prisma.taxFiling.count();
      const filingId = `FIL-0${count + 1}`;
      const ackNo = `ACK-TAX-${Date.now().toString().slice(-6)}`;

      const matchingObligation = await prisma.taxObligation.findFirst({
        where: { taxType: { contains: input.taxType, mode: "insensitive" } },
      });

      const filing = await prisma.taxFiling.create({
        data: {
          filingId,
          taxType: input.taxType,
          period: input.period,
          filingDate: new Date(),
          filedBy: input.filedBy,
          returnAmount: Number(input.returnAmount) || 0,
          acknowledgementNo: ackNo,
          status: "Filed",
          obligationId: matchingObligation?.id || null,
        },
      });

      if (matchingObligation) {
        await prisma.taxObligation.update({
          where: { id: matchingObligation.id },
          data: {
            status: "Paid",
            paid: matchingObligation.taxLiability,
            payable: 0,
          },
        });
      }

      return { success: true, data: shapeFiling(filing) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// ---------------------------------------------------------------------------
// Tax Payments CRUD
// ---------------------------------------------------------------------------

export const getTaxPaymentsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const payments = await prisma.taxPayment.findMany({
      orderBy: { paymentDate: "desc" },
    });
    return { success: true, data: payments.map(shapePayment) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const createTaxPaymentFn = createServerFn({ method: "POST" })
  .validator((input: NewTaxPaymentInput) => input)
  .handler(async ({ data: input }) => {
    try {
      const prisma = await getPrisma();
      const count = await prisma.taxPayment.count();
      const paymentId = `PAY-0${count + 1}`;
      const amount = Number(input.amount) || 0;

      const matchingObligation = await prisma.taxObligation.findFirst({
        where: { taxType: { contains: input.taxType, mode: "insensitive" } },
      });

      const payment = await prisma.taxPayment.create({
        data: {
          paymentId,
          taxType: input.taxType,
          period: input.period,
          paymentDate: new Date(),
          bankAccount: input.bankAccount,
          amount,
          transactionRef: input.transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
          status: "Cleared",
          obligationId: matchingObligation?.id || null,
        },
      });

      if (matchingObligation) {
        const liability = Number(matchingObligation.taxLiability) || 0;
        const currentPaid = Number(matchingObligation.paid) || 0;
        const newPaid = Math.min(liability, currentPaid + amount);
        const newPayable = Math.max(0, liability - newPaid);
        const newStatus = newPayable === 0 ? "Paid" : "PartiallyPaid";

        await prisma.taxObligation.update({
          where: { id: matchingObligation.id },
          data: {
            paid: newPaid,
            payable: newPayable,
            status: newStatus as any,
          },
        });
      }

      return { success: true, data: shapePayment(payment) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// ---------------------------------------------------------------------------
// Tax Authorities & Reconciliations
// ---------------------------------------------------------------------------

export const getTaxAuthoritiesFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const authorities = await prisma.taxAuthority.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: authorities.map(shapeAuthority) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});

export const getTaxReconciliationsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const prisma = await getPrisma();
    const reconciliations = await prisma.taxReconciliation.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: reconciliations.map(shapeReconciliation) };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
});
