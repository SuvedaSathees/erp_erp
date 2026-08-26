/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServerFn } from "@tanstack/react-start";
import type {
  AccountsPayableKpis,
  AgingBucket,
  AgingReport,
  DashboardQuery,
  InvoiceFilters,
  InvoiceSearchResult,
  InvoiceStatus,
  NewInvoiceInput,
  PayableInvoice,
  PaymentDetail,
  PaymentSummary,
  RecordPaymentInput,
  TopVendor,
  VendorProfile,
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

function fromPrismaPayableStatus(s: string): InvoiceStatus {
  if (s === "DueSoon") return "Due Soon";
  return s as InvoiceStatus;
}

function toPrismaPayableStatus(s: string): any {
  if (s === "Due Soon") return "DueSoon";
  return s;
}

function shapePayableInvoice(p: any): PayableInvoice {
  return {
    invoiceNo: p.invoiceNo,
    vendor: p.vendorName || p.vendor?.name || "",
    invoiceDate: formatDate(p.invoiceDate),
    dueDate: formatDate(p.dueDate),
    amount: Number(p.amount) || 0,
    status: fromPrismaPayableStatus(p.status),
    dueAmount: Number(p.dueAmount) || 0,
    approved: p.approved ?? false,
  };
}

// 1. Retrieve Paginated & Filtered Invoice List
export const getPayableInvoicesFn = createServerFn({ method: "POST" })
  .validator((d: { query?: DashboardQuery; filters: InvoiceFilters }) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const { filters, query } = data;

      const where: any = {};

      if (filters.status && filters.status !== "All") {
        where.status = toPrismaPayableStatus(filters.status);
      }

      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        where.companyId = query.companyId;
      }

      if (filters.search && filters.search.trim()) {
        const needle = filters.search.trim();
        where.OR = [
          { invoiceNo: { contains: needle, mode: "insensitive" } },
          { vendorName: { contains: needle, mode: "insensitive" } },
        ];
      }

      const total = await prisma.payableInvoice.count({ where });

      const page = Math.max(1, filters.page || 1);
      const pageSize = Math.max(1, filters.pageSize || 10);
      const skip = (page - 1) * pageSize;

      const rows = await prisma.payableInvoice.findMany({
        where,
        include: { vendor: true },
        orderBy: { createdAt: "desc" },
        skip,
        take: pageSize,
      });

      return {
        success: true,
        data: {
          rows: rows.map(shapePayableInvoice),
          total,
        } as InvoiceSearchResult,
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 2. Retrieve Single Invoice Detail
export const getPayableInvoiceDetailsFn = createServerFn({ method: "POST" })
  .validator((invoiceNo: string) => invoiceNo)
  .handler(async ({ data: invoiceNo }) => {
    try {
      const prisma = await getPrisma();
      const invoice = await prisma.payableInvoice.findFirst({
        where: {
          OR: [{ invoiceNo }, { id: invoiceNo }],
        },
        include: {
          vendor: true,
          payments: { orderBy: { paymentDate: "desc" } },
          attachments: true,
          approvals: true,
          activities: { orderBy: { timestamp: "desc" } },
        },
      });

      if (!invoice) return { success: true, data: null };
      return { success: true, data: shapePayableInvoice(invoice) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 3. Create a New Payable Invoice
export const createPayableInvoiceFn = createServerFn({ method: "POST" })
  .validator((d: NewInvoiceInput) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();

      // Check if invoice number already exists
      const existing = await prisma.payableInvoice.findUnique({
        where: { invoiceNo: data.invoiceNo },
      });
      if (existing) {
        throw new Error(`Invoice number ${data.invoiceNo} already exists.`);
      }

      // Find or create vendor
      let vendor = await prisma.vendor.findFirst({
        where: { name: { equals: data.vendor, mode: "insensitive" } },
      });
      if (!vendor) {
        const count = await prisma.vendor.count();
        vendor = await prisma.vendor.create({
          data: {
            vendorCode: `VND-${String(count + 101).padStart(3, "0")}`,
            name: data.vendor,
            category: "General Vendor",
            paymentTerms: "Net 30",
            status: "Active",
          },
        });
      }

      const invDate = new Date(data.invoiceDate);
      const dueDate = new Date(data.dueDate);
      const amount = Number(data.amount) || 0;

      const created = await prisma.payableInvoice.create({
        data: {
          invoiceNo: data.invoiceNo,
          vendorId: vendor.id,
          vendorName: data.vendor,
          invoiceDate: isNaN(invDate.getTime()) ? new Date() : invDate,
          dueDate: isNaN(dueDate.getTime()) ? new Date() : dueDate,
          amount,
          dueAmount: amount,
          status: "DueSoon",
          approved: false,
          subtotal: Math.round((amount / 1.18) * 100) / 100,
          taxAmount: Math.round((amount - amount / 1.18) * 100) / 100,
          taxRate: 18,
          activities: {
            create: {
              user: "System",
              action: "Invoice Created",
              description: `Payable invoice ${data.invoiceNo} created for ${data.vendor} with amount ₹${amount.toLocaleString()}.`,
              newStatus: "Due Soon",
            },
          },
        },
        include: { vendor: true },
      });

      return { success: true, data: shapePayableInvoice(created) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 4. Record a Payment Against an AP Invoice
export const recordPayablePaymentFn = createServerFn({ method: "POST" })
  .validator((d: RecordPaymentInput) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const invoice = await prisma.payableInvoice.findUnique({
        where: { invoiceNo: data.invoiceNo },
      });
      if (!invoice) throw new Error(`Invoice ${data.invoiceNo} not found.`);

      const paymentAmount = Number(data.amount) || 0;
      const currentDue = Number(invoice.dueAmount) || 0;
      const newDueAmount = Math.max(0, currentDue - paymentAmount);
      const newStatus = newDueAmount <= 0 ? "Paid" : invoice.status;

      await prisma.payablePayment.create({
        data: {
          invoiceId: invoice.id,
          paymentDate: data.paymentDate ? new Date(data.paymentDate) : new Date(),
          amount: paymentAmount,
          paymentMethod: data.method || "Bank Transfer",
        },
      });

      const updated = await prisma.payableInvoice.update({
        where: { id: invoice.id },
        data: {
          dueAmount: newDueAmount,
          status: newStatus,
          activities: {
            create: {
              user: "System",
              action: "Payment Recorded",
              description: `Payment of ₹${paymentAmount.toLocaleString()} recorded via ${data.method || "Bank Transfer"}. Remaining balance: ₹${newDueAmount.toLocaleString()}.`,
              prevStatus: fromPrismaPayableStatus(invoice.status),
              newStatus: fromPrismaPayableStatus(newStatus),
            },
          },
        },
        include: { vendor: true },
      });

      return { success: true, data: shapePayableInvoice(updated) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 5. Update Approval Status
export const updatePayableApprovalStatusFn = createServerFn({ method: "POST" })
  .validator((d: { invoiceNo: string; approved: boolean }) => d)
  .handler(async ({ data }) => {
    try {
      const prisma = await getPrisma();
      const invoice = await prisma.payableInvoice.findUnique({
        where: { invoiceNo: data.invoiceNo },
      });
      if (!invoice) throw new Error(`Invoice ${data.invoiceNo} not found.`);

      const updated = await prisma.payableInvoice.update({
        where: { id: invoice.id },
        data: {
          approved: data.approved,
          activities: {
            create: {
              user: "Finance Manager",
              action: data.approved ? "Approved" : "Approval Revoked",
              description: `Invoice ${data.invoiceNo} ${data.approved ? "approved" : "unapproved"}.`,
            },
          },
        },
        include: { vendor: true },
      });

      return { success: true, data: shapePayableInvoice(updated) };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 6. Dynamic Aging Report
export const getPayableAgingReportFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();
      const where: any = {
        status: { notIn: ["Paid", "Canceled"] },
        dueAmount: { gt: 0 },
      };
      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        where.companyId = query.companyId;
      }

      const invoices = await prisma.payableInvoice.findMany({ where });

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

// 7. Dynamic AP KPIs
export const getPayableKpisFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();
      const where: any = {};
      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        where.companyId = query.companyId;
      }

      const allInvoices = await prisma.payableInvoice.findMany({ where });

      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let totalPayables = 0;
      let overdueAmount = 0;
      let dueWithin30Days = 0;
      let openInvoices = 0;

      for (const inv of allInvoices) {
        if (inv.status !== "Paid" && inv.status !== "Canceled") {
          const dueAmt = Number(inv.dueAmount) || 0;
          totalPayables += dueAmt;
          openInvoices += 1;

          const dueDate = new Date(inv.dueDate);
          if (dueDate < now) {
            overdueAmount += dueAmt;
          } else if (dueDate <= in30Days) {
            dueWithin30Days += dueAmt;
          }
        }
      }

      // Calculate payments this month
      const paymentsThisMonth = await prisma.payablePayment.findMany({
        where: {
          paymentDate: { gte: startOfMonth },
        },
      });
      const paidThisMonth = paymentsThisMonth.reduce((s, p) => s + Number(p.amount), 0);

      const overduePctOfTotal =
        totalPayables > 0 ? Math.round((overdueAmount / totalPayables) * 10000) / 100 : 0;
      const dueWithin30PctOfTotal =
        totalPayables > 0 ? Math.round((dueWithin30Days / totalPayables) * 10000) / 100 : 0;

      return {
        success: true,
        data: {
          totalPayables,
          overdueAmount,
          overduePctOfTotal,
          dueWithin30Days,
          dueWithin30PctOfTotal,
          paidThisMonth,
          openInvoices,
        } as AccountsPayableKpis,
      };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 8. Payment Detail Retrieval
export const getPayablePaymentInfoFn = createServerFn({ method: "POST" })
  .validator((ref: string) => ref)
  .handler(async ({ data: ref }) => {
    try {
      const prisma = await getPrisma();
      const invoice = await prisma.payableInvoice.findFirst({
        where: {
          OR: [{ invoiceNo: ref }, { id: ref }],
        },
        include: {
          vendor: true,
          payments: true,
        },
      });

      if (!invoice) return { success: true, data: null };

      const totalAmount = Number(invoice.amount) || 0;
      const dueAmount = Number(invoice.dueAmount) || 0;
      const amountPaid = totalAmount - dueAmount;
      const subtotal = Number(invoice.subtotal) || Math.round((totalAmount / 1.18) * 100) / 100;
      const tax = Number(invoice.taxAmount) || Math.round((totalAmount - subtotal) * 100) / 100;

      const detail: PaymentDetail = {
        source: "payment",
        ref: invoice.invoiceNo,
        type: "Bill",
        date: formatDate(invoice.invoiceDate),
        description: `Invoice ${invoice.invoiceNo} from ${invoice.vendorName}`,
        account: invoice.accountCode || "2110",
        amount: totalAmount,
        status: invoice.status === "Paid" ? "Posted" : "Pending",
        vendor: invoice.vendorName,
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

// 9. Vendor Profile Retrieval
export const getVendorProfileFn = createServerFn({ method: "POST" })
  .validator((vendorName: string) => vendorName)
  .handler(async ({ data: vendorName }) => {
    try {
      const prisma = await getPrisma();
      const vendor = await prisma.vendor.findFirst({
        where: { name: { equals: vendorName, mode: "insensitive" } },
        include: { invoices: true },
      });

      if (!vendor) return { success: true, data: null };

      const outstandingBalance = vendor.invoices
        .filter((i) => i.status !== "Paid" && i.status !== "Canceled")
        .reduce((sum, i) => sum + Number(i.dueAmount), 0);

      const profile: VendorProfile = {
        id: vendor.vendorCode,
        name: vendor.name,
        category: vendor.category,
        email: vendor.email || "",
        phone: vendor.phone || "",
        paymentTerms: vendor.paymentTerms,
        outstandingBalance,
        status: vendor.status,
      };

      return { success: true, data: profile };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 10. Top Vendors
export const getTopVendorsFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: query }) => {
    try {
      const prisma = await getPrisma();
      const where: any = {};
      if (query?.companyId && query.companyId.toLowerCase() !== "all") {
        where.companyId = query.companyId;
      }

      const invoices = await prisma.payableInvoice.findMany({ where });

      const amountByVendor = new Map<string, number>();
      for (const inv of invoices) {
        const v = inv.vendorName || "Unknown Vendor";
        amountByVendor.set(v, (amountByVendor.get(v) || 0) + Number(inv.amount || 0));
      }

      const topVendors: TopVendor[] = Array.from(amountByVendor.entries())
        .map(([vendor, amount]) => ({ vendor, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      return { success: true, data: topVendors };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });

// 11. Payment Summary
export const getPayablePaymentSummaryFn = createServerFn({ method: "POST" })
  .validator((query: DashboardQuery) => query)
  .handler(async ({ data: _query }) => {
    try {
      const prisma = await getPrisma();
      const payments = await prisma.payablePayment.findMany();

      const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0);
      const totalPayments = payments.length;
      const averagePayment =
        totalPayments > 0 ? Math.round((totalPaid / totalPayments) * 100) / 100 : 0;

      const summary: PaymentSummary = {
        totalPaid,
        averagePayment,
        totalPayments,
        discountsTaken: 0,
      };

      return { success: true, data: summary };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  });
