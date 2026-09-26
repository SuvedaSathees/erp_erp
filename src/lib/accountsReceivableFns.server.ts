/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type {
  AccountsReceivableKpis,
  AgingBucket,
  AgingReport,
  CollectionSummary,
  CreateCreditMemoInput,
  CustomerProfile,
  DashboardQuery,
  InvoiceDetail,
  NewReceivableInvoiceInput,
  ReceivePaymentInput,
  ReceivableInvoice,
  ReceivableInvoiceFilters,
  ReceivableInvoiceSearchResult,
  ReceivableInvoiceStatus,
  ReceivableTrendPoint,
  TopCustomer,
} from "@/services/types";

async function getPrisma() {
  const mod = await import("./prisma.server");
  return mod.prisma;
}

function formatDate(d: Date | string | null | undefined): string {
  if (!d) return "";
  if (d instanceof Date) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  const parsed = new Date(d);
  if (!isNaN(parsed.getTime())) {
    return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return String(d);
}

function fromPrismaReceivableStatus(s: string): ReceivableInvoiceStatus {
  if (s === "DueSoon") return "Due Soon";
  if (s === "PartiallyPaid") return "Partially Paid";
  if (s === "CreditMemo") return "Credit Memo";
  return s as ReceivableInvoiceStatus;
}

function toPrismaReceivableStatus(s: string): any {
  if (s === "Due Soon") return "DueSoon";
  if (s === "Partially Paid") return "PartiallyPaid";
  if (s === "Credit Memo") return "CreditMemo";
  return s;
}

function shapeReceivableInvoice(r: any): ReceivableInvoice {
  return {
    invoiceNo: r.invoiceNo,
    customer: r.customerName || r.customer?.name || "",
    invoiceDate: formatDate(r.invoiceDate),
    dueDate: formatDate(r.dueDate),
    amount: Number(r.amount) || 0,
    status: fromPrismaReceivableStatus(r.status),
    dueAmount: Number(r.dueAmount) || 0,
  };
}

// 1. Retrieve Paginated & Filtered Invoice List
export const getReceivableInvoicesFn = createServerFn({ method: "POST" })
  .validator((d: { query?: DashboardQuery; filters: ReceivableInvoiceFilters }) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const { filters, query } = data;

      const where: any = {};

      if (filters.status && filters.status !== "All") {
        where.status = toPrismaReceivableStatus(filters.status);
      }

      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        where.companyId = query.companyId;
      }

      if (filters.search && filters.search.trim()) {
        const needle = filters.search.trim();
        where.OR = [
          { invoiceNo: { contains: needle, mode: "insensitive" } },
          { customerName: { contains: needle, mode: "insensitive" } },
        ];
      }

      const total = await prisma.receivableInvoice.count({ where });

      const page = Math.max(1, filters.page || 1);
      const pageSize = Math.max(1, filters.pageSize || 10);
      const skip = (page - 1) * pageSize;

      const rows = await prisma.receivableInvoice.findMany({
        where,
        include: { customer: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      });

      return {
        success: true,
        data: {
          rows: rows.map(shapeReceivableInvoice),
          total,
        } as ReceivableInvoiceSearchResult,
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 2. Retrieve Single Invoice Detail
export const getReceivableInvoiceDetailsFn = createServerFn({ method: "POST" })
  .validator((invoiceNo: string) => invoiceNo)
  .handler(async ({ data: invoiceNo }) => {
    try {
      const prisma = await getPrisma();
      const invoice = await prisma.receivableInvoice.findFirst({
        where: {
          OR: [{ invoiceNo }, { id: invoiceNo }],
        },
        include: {
          customer: true,
          receipts: { orderBy: { receiptDate: "desc" } },
          attachments: true,
          activities: { orderBy: { timestamp: "desc" } },
        },
      });

      if (!invoice) return { success: true, data: null };
      return { success: true, data: shapeReceivableInvoice(invoice) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 3. Create a New Receivable Invoice
export const createReceivableInvoiceFn = createServerFn({ method: "POST" })
  .validator((d: NewReceivableInvoiceInput) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();

      // Check if invoice number already exists
      const existing = await prisma.receivableInvoice.findUnique({
        where: { invoiceNo: data.invoiceNo },
      });
      if (existing) {
        throw new Error(`Invoice number ${data.invoiceNo} already exists.`);
      }

      // Find or create customer
      let customer = await prisma.customer.findFirst({
        where: { name: { equals: data.customer, mode: "insensitive" } },
      });
      if (!customer) {
        const count = await prisma.customer.count();
        customer = await prisma.customer.create({
          data: {
            customerCode: `CUST-${String(count + 201).padStart(3, "0")}`,
            name: data.customer,
            category: "Commercial Customer",
            paymentTerms: "Net 30",
            status: "Active",
          },
        });
      }

      const invDate = new Date(data.invoiceDate);
      const dueDate = new Date(data.dueDate);
      const amount = Number(data.amount) || 0;

      const created = await prisma.receivableInvoice.create({
        data: {
          invoiceNo: data.invoiceNo,
          customerId: customer.id,
          customerName: data.customer,
          invoiceDate: isNaN(invDate.getTime()) ? new Date() : invDate,
          dueDate: isNaN(dueDate.getTime()) ? new Date() : dueDate,
          amount,
          dueAmount: amount,
          status: "DueSoon",
          isCreditMemo: false,
          subtotal: Math.round((amount / 1.18) * 100) / 100,
          taxAmount: Math.round((amount - amount / 1.18) * 100) / 100,
          taxRate: 18,
          activities: {
            create: {
              user: "System",
              action: "Invoice Issued",
              description: `Receivable invoice ${data.invoiceNo} issued to ${data.customer} for ₹${amount.toLocaleString()}.`,
              newStatus: "Due Soon",
            },
          },
        },
        include: { customer: true },
      });

      return { success: true, data: shapeReceivableInvoice(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 4. Create a Credit Memo
export const createCreditMemoFn = createServerFn({ method: "POST" })
  .validator((d: CreateCreditMemoInput) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();

      // Find or create customer
      let customer = await prisma.customer.findFirst({
        where: { name: { equals: data.customer, mode: "insensitive" } },
      });
      if (!customer) {
        const count = await prisma.customer.count();
        customer = await prisma.customer.create({
          data: {
            customerCode: `CUST-${String(count + 201).padStart(3, "0")}`,
            name: data.customer,
            category: "Commercial Customer",
            paymentTerms: "Net 30",
            status: "Active",
          },
        });
      }

      const count = await prisma.receivableInvoice.count({
        where: { isCreditMemo: true },
      });
      const invoiceNo = `CM-${String(count + 3001)}`;
      const amount = -Math.abs(Number(data.amount) || 0);

      const created = await prisma.receivableInvoice.create({
        data: {
          invoiceNo,
          customerId: customer.id,
          customerName: data.customer,
          invoiceDate: new Date(),
          dueDate: new Date(),
          amount,
          dueAmount: 0,
          status: "CreditMemo",
          isCreditMemo: true,
          creditMemoReason: data.reason,
          subtotal: amount,
          taxAmount: 0,
          taxRate: 0,
          activities: {
            create: {
              user: "Finance Manager",
              action: "Credit Memo Created",
              description: `Credit memo ${invoiceNo} generated for ${data.customer} for ₹${Math.abs(amount).toLocaleString()}. Reason: ${data.reason}`,
              newStatus: "Credit Memo",
            },
          },
        },
        include: { customer: true },
      });

      return { success: true, data: shapeReceivableInvoice(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 5. Record a Receipt / Payment Collection
export const recordReceivableReceiptFn = createServerFn({ method: "POST" })
  .validator((d: ReceivePaymentInput) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const invoice = await prisma.receivableInvoice.findUnique({
        where: { invoiceNo: data.invoiceNo },
      });
      if (!invoice) throw new Error(`Invoice ${data.invoiceNo} not found.`);

      const receiptAmount = Number(data.amount) || 0;
      const currentDue = Number(invoice.dueAmount) || 0;
      const newDueAmount = Math.max(0, currentDue - receiptAmount);
      const newStatus = newDueAmount <= 0 ? "Paid" : "PartiallyPaid";

      await prisma.receivableReceipt.create({
        data: {
          invoiceId: invoice.id,
          receiptDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
          amount: receiptAmount,
          paymentMethod: data.method || "Bank Transfer",
        },
      });

      const updated = await prisma.receivableInvoice.update({
        where: { id: invoice.id },
        data: {
          dueAmount: newDueAmount,
          status: newStatus,
          activities: {
            create: {
              user: "Collections Team",
              action: "Payment Received",
              description: `Receipt of ₹${receiptAmount.toLocaleString()} collected via ${data.method || "Bank Transfer"}. Remaining due: ₹${newDueAmount.toLocaleString()}.`,
              prevStatus: fromPrismaReceivableStatus(invoice.status),
              newStatus: fromPrismaReceivableStatus(newStatus),
            },
          },
        },
        include: { customer: true },
      });

      return { success: true, data: shapeReceivableInvoice(updated) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 6. Dynamic Aging Report
export const getReceivableAgingReportFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();
      const where: any = {
        status: { notIn: ["Paid", "Canceled", "CreditMemo"] },
        isCreditMemo: false,
        dueAmount: { gt: 0 },
      };
      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        where.companyId = query.companyId;
      }

      const invoices = await prisma.receivableInvoice.findMany({ where });

      const now = new Date();
      let b0to30 = 0;
      let b31to60 = 0;
      let b61to90 = 0;
      let b91to120 = 0;
      let b120plus = 0;

      for (const inv of invoices) {
        const due = new Date(inv.dueDate);
        const dueAmt = Number(inv.dueAmount) || 0;
        const diffDays = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays <= 30) {
          b0to30 += dueAmt;
        } else if (diffDays <= 60) {
          b31to60 += dueAmt;
        } else if (diffDays <= 90) {
          b61to90 += dueAmt;
        } else if (diffDays <= 120) {
          b91to120 += dueAmt;
        } else {
          b120plus += dueAmt;
        }
      }

      const total = b0to30 + b31to60 + b61to90 + b91to120 + b120plus;

      const buckets: AgingBucket[] = [
        {
          bucket: "0 - 30 Days",
          amount: b0to30,
          pct: total > 0 ? Math.round((b0to30 / total) * 10000) / 100 : 0,
          color: "#22C55E",
        },
        {
          bucket: "31 - 60 Days",
          amount: b31to60,
          pct: total > 0 ? Math.round((b31to60 / total) * 10000) / 100 : 0,
          color: "#8B5CF6",
        },
        {
          bucket: "61 - 90 Days",
          amount: b61to90,
          pct: total > 0 ? Math.round((b61to90 / total) * 10000) / 100 : 0,
          color: "#F59E0B",
        },
        {
          bucket: "91 - 120 Days",
          amount: b91to120,
          pct: total > 0 ? Math.round((b91to120 / total) * 10000) / 100 : 0,
          color: "#EF4444",
        },
        {
          bucket: "120+ Days",
          amount: b120plus,
          pct: total > 0 ? Math.round((b120plus / total) * 10000) / 100 : 0,
          color: "#9CA3AF",
        },
      ];

      return {
        success: true,
        data: { total, buckets } as AgingReport,
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 7. Dynamic AR KPIs
export const getReceivableKpisFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();
      const where: any = {};
      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        where.companyId = query.companyId;
      }

      const allInvoices = await prisma.receivableInvoice.findMany({ where });

      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let totalReceivables = 0;
      let overdueAmount = 0;
      let dueWithin30Days = 0;
      let openInvoices = 0;

      for (const inv of allInvoices) {
        if (inv.status !== "Paid" && inv.status !== "Canceled" && !inv.isCreditMemo) {
          const dueAmt = Number(inv.dueAmount) || 0;
          totalReceivables += dueAmt;
          openInvoices += 1;

          const dueDate = new Date(inv.dueDate);
          if (dueDate < now) {
            overdueAmount += dueAmt;
          } else if (dueDate <= in30Days) {
            dueWithin30Days += dueAmt;
          }
        }
      }

      // Calculate collections this month
      const receiptsThisMonth = await prisma.receivableReceipt.findMany({
        where: {
          receiptDate: { gte: startOfMonth },
        },
      });
      const collectedThisMonth = receiptsThisMonth.reduce((s, r) => s + Number(r.amount), 0);

      const overduePctOfTotal =
        totalReceivables > 0 ? Math.round((overdueAmount / totalReceivables) * 10000) / 100 : 0;
      const dueWithin30PctOfTotal =
        totalReceivables > 0 ? Math.round((dueWithin30Days / totalReceivables) * 10000) / 100 : 0;

      return {
        success: true,
        data: {
          totalReceivables,
          overdueAmount,
          overduePctOfTotal,
          dueWithin30Days,
          dueWithin30PctOfTotal,
          collectedThisMonth,
          openInvoices,
        } as AccountsReceivableKpis,
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 8. Invoice Information Retrieval
export const getReceivableInvoiceInfoFn = createServerFn({ method: "POST" })
  .validator((ref: string) => ref)
  .handler(async ({ data: ref }) => {
    try {
      const prisma = await getPrisma();
      const invoice = await prisma.receivableInvoice.findFirst({
        where: {
          OR: [{ invoiceNo: ref }, { id: ref }],
        },
        include: {
          customer: true,
          receipts: true,
        },
      });

      if (!invoice) return { success: true, data: null };

      const totalAmount = Number(invoice.amount) || 0;
      const dueAmount = Number(invoice.dueAmount) || 0;
      const amountPaid = totalAmount - dueAmount;
      const subtotal = Number(invoice.subtotal) || Math.round((totalAmount / 1.18) * 100) / 100;
      const tax = Number(invoice.taxAmount) || Math.round((totalAmount - subtotal) * 100) / 100;

      const detail: InvoiceDetail = {
        source: "invoice",
        ref: invoice.invoiceNo,
        type: "Invoice",
        date: formatDate(invoice.invoiceDate),
        description: `Invoice ${invoice.invoiceNo} for ${invoice.customerName}`,
        account: invoice.accountCode || "1120",
        amount: totalAmount,
        status: invoice.status === "Paid" ? "Posted" : "Pending",
        customer: invoice.customerName,
        dueDate: formatDate(invoice.dueDate),
        subtotal,
        tax,
        taxRate: invoice.taxRate || 18,
        totalAmount,
        amountPaid,
        balanceDue: dueAmount,
      };

      return { success: true, data: detail };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 9. Customer Profile Retrieval
export const getCustomerProfileFn = createServerFn({ method: "POST" })
  .validator((customerName: string) => customerName)
  .handler(async ({ data: customerName }) => {
    try {
      const prisma = await getPrisma();
      const customer = await prisma.customer.findFirst({
        where: { name: { equals: customerName, mode: "insensitive" } },
        include: { invoices: true },
      });

      if (!customer) return { success: true, data: null };

      const outstandingBalance = customer.invoices
        .filter((i) => i.status !== "Paid" && i.status !== "Canceled" && !i.isCreditMemo)
        .reduce((sum, i) => sum + Number(i.dueAmount), 0);

      const profile: CustomerProfile = {
        id: customer.customerCode,
        name: customer.name,
        category: customer.category,
        email: customer.email || "",
        phone: customer.phone || "",
        paymentTerms: customer.paymentTerms,
        outstandingBalance,
        status: customer.status,
      };

      return { success: true, data: profile };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 10. Notify Customer
export const notifyReceivableCustomerFn = createServerFn({ method: "POST" })
  .validator((invoiceNo: string) => invoiceNo)
  .handler(async ({ data: invoiceNo }) => {
    try {
      const prisma = await getPrisma();
      const invoice = await prisma.receivableInvoice.findUnique({
        where: { invoiceNo },
      });
      if (invoice) {
        await prisma.receivableActivityLog.create({
          data: {
            invoiceId: invoice.id,
            user: "Priya Sharma",
            action: "Reminder Triggered",
            description: `Payment reminder logged for invoice ${invoiceNo} (Customer: ${invoice.customerName}). Email delivery pending SMTP provider configuration.`,
            prevStatus: fromPrismaReceivableStatus(invoice.status),
            newStatus: fromPrismaReceivableStatus(invoice.status),
          },
        });
      }
      return { success: true, data: { sent: true } };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 11. Top Customers
export const getTopCustomersFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();
      const where: any = { isCreditMemo: false };
      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        where.companyId = query.companyId;
      }

      const invoices = await prisma.receivableInvoice.findMany({ where });

      const amountByCustomer = new Map<string, number>();
      for (const inv of invoices) {
        const c = inv.customerName || "Unknown Customer";
        amountByCustomer.set(c, (amountByCustomer.get(c) || 0) + Number(inv.amount || 0));
      }

      const topCustomers: TopCustomer[] = Array.from(amountByCustomer.entries())
        .map(([customer, amount]) => ({ customer, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      return { success: true, data: topCustomers };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 12. Receivable Trend
export const getReceivableTrendFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: _query }) => {
    try {
      const prisma = await getPrisma();
      const invoices = await prisma.receivableInvoice.findMany();
      const receipts = await prisma.receivableReceipt.findMany();

      const months = ["Feb '26", "Mar '26", "Apr '26", "May '26", "Jun '26", "Jul '26", "Aug '26"];
      const totalRec = invoices.reduce((s, i) => s + (i.isCreditMemo ? 0 : Number(i.amount || 0)), 0);
      const totalColl = receipts.reduce((s, r) => s + Number(r.amount || 0), 0);

      const trend: ReceivableTrendPoint[] = months.map((m, idx) => ({
        month: m,
        totalReceivables: idx === months.length - 1 ? totalRec : 0,
        collectedAmount: idx === months.length - 1 ? totalColl : 0,
      }));

      return { success: true, data: trend };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 13. Collection Summary
export const getCollectionSummaryFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: _query }) => {
    try {
      const prisma = await getPrisma();
      const invoices = await prisma.receivableInvoice.findMany({ where: { isCreditMemo: false } });
      const receipts = await prisma.receivableReceipt.findMany();

      const billedAmount = invoices.reduce((s, i) => s + Number(i.amount || 0), 0);
      const collectedAmount = receipts.reduce((s, r) => s + Number(r.amount || 0), 0);
      const collectionPct = billedAmount > 0 ? Math.round((collectedAmount / billedAmount) * 10000) / 100 : 0;

      const summary: CollectionSummary = {
        billedAmount,
        collectedAmount,
        collectionPct,
        avgDaysToCollect: 0,
      };

      return { success: true, data: summary };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// Customer Names List (for dropdown selectors)
export const getCustomerNamesFn = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const prisma = await getPrisma();
      const customers = await prisma.customer.findMany({
        select: { name: true },
        orderBy: { name: "asc" },
      });
      return { success: true, data: customers.map((c) => c.name) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  },
);
