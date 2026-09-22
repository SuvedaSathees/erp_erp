import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding Magnertia ERP Finance database...");

  // =============================================
  // 1. Chart of Accounts
  // =============================================
  const accountsData = [
    // Assets
    { code: "1000", name: "Total Assets", type: "Asset" as const, group: "Assets", parentCode: null },
    { code: "1100", name: "Current Assets", type: "Asset" as const, group: "Current Assets", parentCode: "1000" },
    { code: "1110", name: "Cash & Cash Equivalents", type: "Asset" as const, group: "Current Assets", parentCode: "1100" },
    { code: "1120", name: "Accounts Receivable", type: "Asset" as const, group: "Current Assets", parentCode: "1100" },
    { code: "1130", name: "Inventory", type: "Asset" as const, group: "Current Assets", parentCode: "1100" },
    { code: "1140", name: "Prepaid Expenses", type: "Asset" as const, group: "Current Assets", parentCode: "1100" },
    { code: "1150", name: "Short-Term Investments", type: "Asset" as const, group: "Current Assets", parentCode: "1100" },
    { code: "1200", name: "Non-Current Assets", type: "Asset" as const, group: "Non-Current Assets", parentCode: "1000" },
    { code: "1210", name: "Property, Plant & Equipment", type: "Asset" as const, group: "Non-Current Assets", parentCode: "1200" },
    { code: "1220", name: "Accumulated Depreciation", type: "Asset" as const, group: "Non-Current Assets", parentCode: "1200" },
    { code: "1230", name: "Intangible Assets", type: "Asset" as const, group: "Non-Current Assets", parentCode: "1200" },
    { code: "1240", name: "Long-Term Investments", type: "Asset" as const, group: "Non-Current Assets", parentCode: "1200" },
    // Liabilities
    { code: "2000", name: "Total Liabilities", type: "Liability" as const, group: "Liabilities", parentCode: null },
    { code: "2100", name: "Current Liabilities", type: "Liability" as const, group: "Current Liabilities", parentCode: "2000" },
    { code: "2110", name: "Accounts Payable", type: "Liability" as const, group: "Current Liabilities", parentCode: "2100" },
    { code: "2120", name: "Accrued Expenses", type: "Liability" as const, group: "Current Liabilities", parentCode: "2100" },
    { code: "2130", name: "Short-Term Loans", type: "Liability" as const, group: "Current Liabilities", parentCode: "2100" },
    { code: "2140", name: "Tax Payable", type: "Liability" as const, group: "Current Liabilities", parentCode: "2100" },
    { code: "2150", name: "Current Portion of Long-Term Debt", type: "Liability" as const, group: "Current Liabilities", parentCode: "2100" },
    { code: "2200", name: "Non-Current Liabilities", type: "Liability" as const, group: "Non-Current Liabilities", parentCode: "2000" },
    { code: "2210", name: "Long-Term Loans", type: "Liability" as const, group: "Non-Current Liabilities", parentCode: "2200" },
    { code: "2220", name: "Deferred Tax Liabilities", type: "Liability" as const, group: "Non-Current Liabilities", parentCode: "2200" },
    // Equity
    { code: "3000", name: "Shareholders' Equity", type: "Equity" as const, group: "Equity", parentCode: null },
    { code: "3100", name: "Share Capital", type: "Equity" as const, group: "Equity", parentCode: "3000" },
    { code: "3200", name: "Retained Earnings", type: "Equity" as const, group: "Equity", parentCode: "3000" },
    { code: "3300", name: "Reserves & Surplus", type: "Equity" as const, group: "Equity", parentCode: "3000" },
    // Revenue
    { code: "4000", name: "Total Revenue", type: "Revenue" as const, group: "Revenue", parentCode: null },
    { code: "4100", name: "EV Sales Revenue", type: "Revenue" as const, group: "Operating Revenue", parentCode: "4000" },
    { code: "4200", name: "Charging Infrastructure Revenue", type: "Revenue" as const, group: "Operating Revenue", parentCode: "4000" },
    { code: "4300", name: "Service & Maintenance Revenue", type: "Revenue" as const, group: "Operating Revenue", parentCode: "4000" },
    { code: "4400", name: "Government Subsidies & Incentives", type: "Revenue" as const, group: "Other Revenue", parentCode: "4000" },
    { code: "4500", name: "Interest Income", type: "Revenue" as const, group: "Other Revenue", parentCode: "4000" },
    // Expenses
    { code: "5000", name: "Total Expenses", type: "Expense" as const, group: "Expenses", parentCode: null },
    { code: "5100", name: "Cost of Goods Sold", type: "Expense" as const, group: "Direct Costs", parentCode: "5000" },
    { code: "5110", name: "Raw Materials", type: "Expense" as const, group: "Direct Costs", parentCode: "5100" },
    { code: "5120", name: "Battery Cell Procurement", type: "Expense" as const, group: "Direct Costs", parentCode: "5100" },
    { code: "5130", name: "Manufacturing Labour", type: "Expense" as const, group: "Direct Costs", parentCode: "5100" },
    { code: "5140", name: "Factory Overhead", type: "Expense" as const, group: "Direct Costs", parentCode: "5100" },
    { code: "5200", name: "Operating Expenses", type: "Expense" as const, group: "Operating Expenses", parentCode: "5000" },
    { code: "5210", name: "Salaries & Wages", type: "Expense" as const, group: "Operating Expenses", parentCode: "5200" },
    { code: "5220", name: "Rent & Facilities", type: "Expense" as const, group: "Operating Expenses", parentCode: "5200" },
    { code: "5230", name: "Research & Development", type: "Expense" as const, group: "Operating Expenses", parentCode: "5200" },
    { code: "5240", name: "Marketing & Sales", type: "Expense" as const, group: "Operating Expenses", parentCode: "5200" },
    { code: "5250", name: "Depreciation & Amortization", type: "Expense" as const, group: "Operating Expenses", parentCode: "5200" },
    { code: "5260", name: "Utilities", type: "Expense" as const, group: "Operating Expenses", parentCode: "5200" },
    { code: "5270", name: "Insurance", type: "Expense" as const, group: "Operating Expenses", parentCode: "5200" },
    { code: "5280", name: "Professional Services", type: "Expense" as const, group: "Operating Expenses", parentCode: "5200" },
    { code: "5300", name: "Financial Expenses", type: "Expense" as const, group: "Financial Expenses", parentCode: "5000" },
    { code: "5310", name: "Interest Expense", type: "Expense" as const, group: "Financial Expenses", parentCode: "5300" },
    { code: "5320", name: "Bank Charges", type: "Expense" as const, group: "Financial Expenses", parentCode: "5300" },
  ];

  const accountIdByCode = new Map<string, string>();
  for (const a of accountsData) {
    const existing = await prisma.account.findUnique({ where: { code: a.code } });
    if (existing) {
      accountIdByCode.set(a.code, existing.id);
      continue;
    }
    const parentAccountId = a.parentCode ? accountIdByCode.get(a.parentCode) ?? null : null;
    const created = await prisma.account.create({
      data: {
        code: a.code,
        name: a.name,
        type: a.type,
        group: a.group,
        currency: "INR",
        isActive: true,
        parentAccountId,
      },
    });
    accountIdByCode.set(a.code, created.id);
  }
  console.log(`  ✅ ${accountsData.length} accounts seeded`);

  // =============================================
  // 2. Vendors
  // =============================================
  const vendors = [
    { vendorCode: "VND-101", name: "Tata AutoComp Systems", category: "Battery Supplier", paymentTerms: "Net 30" },
    { vendorCode: "VND-102", name: "Bharat Forge Ltd", category: "Chassis & Forging", paymentTerms: "Net 45" },
    { vendorCode: "VND-103", name: "Sona BLW Precision", category: "Motor Components", paymentTerms: "Net 30" },
    { vendorCode: "VND-104", name: "Minda Industries", category: "Electrical Systems", paymentTerms: "Net 60" },
    { vendorCode: "VND-105", name: "Amara Raja Energy", category: "Energy Storage", paymentTerms: "Net 30" },
    { vendorCode: "VND-106", name: "Endurance Technologies", category: "Suspension & Brakes", paymentTerms: "Net 45" },
    { vendorCode: "VND-107", name: "Lumax Industries", category: "Lighting & Signaling", paymentTerms: "Net 30" },
    { vendorCode: "VND-108", name: "Sandhar Technologies", category: "Locking & Security", paymentTerms: "Net 30" },
  ];
  for (const v of vendors) {
    await prisma.vendor.upsert({ where: { vendorCode: v.vendorCode }, update: {}, create: { ...v, status: "Active" } });
  }
  console.log(`  ✅ ${vendors.length} vendors seeded`);

  // =============================================
  // 3. Customers
  // =============================================
  const customers = [
    { customerCode: "CUST-201", name: "BluSmart Mobility", category: "Fleet Operator", paymentTerms: "Net 30" },
    { customerCode: "CUST-202", name: "Ather Energy (OEM)", category: "OEM Partner", paymentTerms: "Net 45" },
    { customerCode: "CUST-203", name: "Tata Motors EV Div", category: "OEM Customer", paymentTerms: "Net 60" },
    { customerCode: "CUST-204", name: "MG Motor India", category: "OEM Customer", paymentTerms: "Net 45" },
    { customerCode: "CUST-205", name: "Convergence Energy", category: "Charging Infra", paymentTerms: "Net 30" },
    { customerCode: "CUST-206", name: "Kazam EV Charging", category: "Charging Infra", paymentTerms: "Net 30" },
    { customerCode: "CUST-207", name: "Mahindra Last Mile", category: "Fleet Operator", paymentTerms: "Net 45" },
    { customerCode: "CUST-208", name: "Switch Mobility", category: "Bus/CV OEM", paymentTerms: "Net 60" },
  ];
  for (const c of customers) {
    await prisma.customer.upsert({ where: { customerCode: c.customerCode }, update: {}, create: { ...c, status: "Active" } });
  }
  console.log(`  ✅ ${customers.length} customers seeded`);

  // =============================================
  // 4. Payable Invoices
  // =============================================
  const vendorRecords = await prisma.vendor.findMany();
  const vendorByCode = new Map(vendorRecords.map((v) => [v.vendorCode, v]));
  const now = new Date();

  const payableInvoices = [
    { invoiceNo: "INV-AP-001", vendorCode: "VND-101", amount: 4250000, dueOffset: -15, status: "Overdue" as const },
    { invoiceNo: "INV-AP-002", vendorCode: "VND-102", amount: 1875000, dueOffset: 10, status: "DueSoon" as const },
    { invoiceNo: "INV-AP-003", vendorCode: "VND-103", amount: 3120000, dueOffset: -45, status: "Overdue" as const },
    { invoiceNo: "INV-AP-004", vendorCode: "VND-104", amount: 890000, dueOffset: 25, status: "DueSoon" as const },
    { invoiceNo: "INV-AP-005", vendorCode: "VND-105", amount: 5600000, dueOffset: -5, status: "Paid" as const },
    { invoiceNo: "INV-AP-006", vendorCode: "VND-106", amount: 2340000, dueOffset: 40, status: "DueSoon" as const },
    { invoiceNo: "INV-AP-007", vendorCode: "VND-107", amount: 670000, dueOffset: -90, status: "Overdue" as const },
    { invoiceNo: "INV-AP-008", vendorCode: "VND-108", amount: 1450000, dueOffset: -2, status: "DueSoon" as const },
    { invoiceNo: "INV-AP-009", vendorCode: "VND-101", amount: 7800000, dueOffset: 15, status: "DueSoon" as const },
    { invoiceNo: "INV-AP-010", vendorCode: "VND-103", amount: 2100000, dueOffset: -60, status: "Canceled" as const },
    { invoiceNo: "INV-AP-011", vendorCode: "VND-102", amount: 3450000, dueOffset: 5, status: "DueSoon" as const },
    { invoiceNo: "INV-AP-012", vendorCode: "VND-105", amount: 1200000, dueOffset: -30, status: "Paid" as const },
  ];

  for (const inv of payableInvoices) {
    const existing = await prisma.payableInvoice.findUnique({ where: { invoiceNo: inv.invoiceNo } });
    if (existing) continue;
    const vendor = vendorByCode.get(inv.vendorCode);
    if (!vendor) continue;
    const dueDate = new Date(now.getTime() + inv.dueOffset * 24 * 60 * 60 * 1000);
    const invoiceDate = new Date(dueDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dueAmount = inv.status === "Paid" ? 0 : inv.amount;
    await prisma.payableInvoice.create({
      data: {
        invoiceNo: inv.invoiceNo, vendorId: vendor.id, vendorName: vendor.name,
        invoiceDate, dueDate, amount: inv.amount, dueAmount,
        status: inv.status, approved: inv.status === "Paid",
        subtotal: Math.round((inv.amount / 1.18) * 100) / 100,
        taxAmount: Math.round((inv.amount - inv.amount / 1.18) * 100) / 100, taxRate: 18,
      },
    });
  }
  console.log(`  ✅ ${payableInvoices.length} payable invoices seeded`);

  // =============================================
  // 5. Receivable Invoices
  // =============================================
  const customerRecords = await prisma.customer.findMany();
  const customerByCode = new Map(customerRecords.map((c) => [c.customerCode, c]));

  const receivableInvoices = [
    { invoiceNo: "INV-AR-001", customerCode: "CUST-201", amount: 8500000, dueOffset: -10, status: "Overdue" as const },
    { invoiceNo: "INV-AR-002", customerCode: "CUST-202", amount: 12400000, dueOffset: 20, status: "DueSoon" as const },
    { invoiceNo: "INV-AR-003", customerCode: "CUST-203", amount: 18750000, dueOffset: -35, status: "PartiallyPaid" as const },
    { invoiceNo: "INV-AR-004", customerCode: "CUST-204", amount: 5200000, dueOffset: 30, status: "DueSoon" as const },
    { invoiceNo: "INV-AR-005", customerCode: "CUST-205", amount: 3400000, dueOffset: -8, status: "Paid" as const },
    { invoiceNo: "INV-AR-006", customerCode: "CUST-206", amount: 2800000, dueOffset: 45, status: "DueSoon" as const },
    { invoiceNo: "INV-AR-007", customerCode: "CUST-207", amount: 9100000, dueOffset: -70, status: "Overdue" as const },
    { invoiceNo: "INV-AR-008", customerCode: "CUST-208", amount: 15600000, dueOffset: 10, status: "DueSoon" as const },
    { invoiceNo: "INV-AR-009", customerCode: "CUST-201", amount: 6300000, dueOffset: -3, status: "DueSoon" as const },
    { invoiceNo: "INV-AR-010", customerCode: "CUST-203", amount: 4500000, dueOffset: -120, status: "Canceled" as const },
  ];

  for (const inv of receivableInvoices) {
    const existing = await prisma.receivableInvoice.findUnique({ where: { invoiceNo: inv.invoiceNo } });
    if (existing) continue;
    const customer = customerByCode.get(inv.customerCode);
    if (!customer) continue;
    const dueDate = new Date(now.getTime() + inv.dueOffset * 24 * 60 * 60 * 1000);
    const invoiceDate = new Date(dueDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    let dueAmount = inv.amount;
    if (inv.status === "Paid") dueAmount = 0;
    else if (inv.status === "PartiallyPaid") dueAmount = Math.round(inv.amount * 0.4);
    await prisma.receivableInvoice.create({
      data: {
        invoiceNo: inv.invoiceNo, customerId: customer.id, customerName: customer.name,
        invoiceDate, dueDate, amount: inv.amount, dueAmount,
        status: inv.status, isCreditMemo: false,
        subtotal: Math.round((inv.amount / 1.18) * 100) / 100,
        taxAmount: Math.round((inv.amount - inv.amount / 1.18) * 100) / 100, taxRate: 18,
      },
    });
  }
  console.log(`  ✅ ${receivableInvoices.length} receivable invoices seeded`);

  // =============================================
  // 6. Bank Accounts & Transactions
  // =============================================
  const bankAccounts = [
    { bankAccountId: "BA-001", name: "Primary Operating Account", bankName: "HDFC Bank", type: "Operating" as const, accountNo: "50100036782914", currentBalance: 24500000 },
    { bankAccountId: "BA-002", name: "Payroll Account", bankName: "ICICI Bank", type: "Payroll" as const, accountNo: "628501027384", currentBalance: 8200000 },
    { bankAccountId: "BA-003", name: "Collections Account", bankName: "State Bank of India", type: "Collections" as const, accountNo: "38726501829", currentBalance: 15800000 },
    { bankAccountId: "BA-004", name: "R&D Savings", bankName: "Kotak Mahindra Bank", type: "Savings" as const, accountNo: "9812345670", currentBalance: 5600000 },
    { bankAccountId: "BA-005", name: "Petty Cash", bankName: "HDFC Bank", type: "PettyCash" as const, accountNo: "50100099001122", currentBalance: 150000 },
  ];
  for (const ba of bankAccounts) {
    const existing = await prisma.bankAccount.findUnique({ where: { accountNo: ba.accountNo } });
    if (existing) continue;
    await prisma.bankAccount.create({
      data: { ...ba, currency: "INR", status: "Active",
        reconciliationStatus: ba.type === "Operating" ? "Reconciled" : "NotReconciled",
        unreconciledAmount: ba.type === "Operating" ? 0 : Math.round(ba.currentBalance * 0.05),
      },
    });
  }
  console.log(`  ✅ ${bankAccounts.length} bank accounts seeded`);

  const bankAccDb = await prisma.bankAccount.findMany();
  const opAccount = bankAccDb.find((a) => a.type === "Operating");
  if (opAccount) {
    const txCount = await prisma.bankTransaction.count();
    if (txCount === 0) {
      const txns = [
        { desc: "Customer Payment - BluSmart Mobility", type: "Inflow", amount: 3400000, daysAgo: 2 },
        { desc: "Vendor Payment - Tata AutoComp", type: "Outflow", amount: 4250000, daysAgo: 5 },
        { desc: "Salary Disbursement - Sep 2026", type: "Outflow", amount: 6800000, daysAgo: 7 },
        { desc: "Customer Payment - Ather Energy", type: "Inflow", amount: 5200000, daysAgo: 10 },
        { desc: "Electricity Bill - Factory", type: "Outflow", amount: 340000, daysAgo: 12 },
        { desc: "GST Refund", type: "Inflow", amount: 1250000, daysAgo: 15 },
        { desc: "Vendor Payment - Bharat Forge", type: "Outflow", amount: 1875000, daysAgo: 18 },
        { desc: "Insurance Premium", type: "Outflow", amount: 450000, daysAgo: 20 },
        { desc: "Customer Payment - Tata Motors", type: "Inflow", amount: 11250000, daysAgo: 22 },
        { desc: "Rent Payment - HQ", type: "Outflow", amount: 850000, daysAgo: 25 },
      ];
      for (let i = 0; i < txns.length; i++) {
        const t = txns[i];
        await prisma.bankTransaction.create({
          data: {
            transactionId: `CT-${String(i + 1).padStart(3, "0")}`,
            bankAccountId: opAccount.id,
            date: new Date(now.getTime() - t.daysAgo * 24 * 60 * 60 * 1000),
            description: t.desc, type: t.type, amount: t.amount,
            category: t.type === "Inflow" ? "Revenue" : "Expense", status: "Posted",
          },
        });
      }
      console.log(`  ✅ ${txns.length} bank transactions seeded`);
    }
  }

  // =============================================
  // 7. Journal Entries
  // =============================================
  const journalCount = await prisma.journal.count();
  if (journalCount === 0) {
    const journalEntries = [
      {
        journalNumber: "JE-00001", type: "Manual" as const, status: "Posted" as const,
        lines: [
          { accountCode: "1120", desc: "Accounts Receivable - Q2 Sales", debit: 18750000, credit: 0 },
          { accountCode: "4100", desc: "EV Sales Revenue - Q2", debit: 0, credit: 15889830 },
          { accountCode: "2140", desc: "GST Output Tax", debit: 0, credit: 2860170 },
        ],
      },
      {
        journalNumber: "JE-00002", type: "Manual" as const, status: "Posted" as const,
        lines: [
          { accountCode: "5120", desc: "Battery Cell Procurement", debit: 4250000, credit: 0 },
          { accountCode: "2110", desc: "AP - Tata AutoComp", debit: 0, credit: 4250000 },
        ],
      },
      {
        journalNumber: "JE-00003", type: "Automatic" as const, status: "Posted" as const,
        lines: [
          { accountCode: "5210", desc: "Salaries & Wages - Sep", debit: 6800000, credit: 0 },
          { accountCode: "2120", desc: "Accrued Salaries", debit: 0, credit: 6800000 },
        ],
      },
      {
        journalNumber: "JE-00004", type: "Manual" as const, status: "Posted" as const,
        lines: [
          { accountCode: "1110", desc: "Cash received - charging", debit: 3400000, credit: 0 },
          { accountCode: "4200", desc: "Charging Infrastructure Revenue", debit: 0, credit: 2881356 },
          { accountCode: "2140", desc: "GST Output Tax", debit: 0, credit: 518644 },
        ],
      },
      {
        journalNumber: "JE-00005", type: "Manual" as const, status: "Posted" as const,
        lines: [
          { accountCode: "5230", desc: "R&D - Motor Design Phase 2", debit: 2500000, credit: 0 },
          { accountCode: "1110", desc: "Cash payment for R&D", debit: 0, credit: 2500000 },
        ],
      },
      {
        journalNumber: "JE-00006", type: "Manual" as const, status: "Draft" as const,
        lines: [
          { accountCode: "5250", desc: "Depreciation - Factory Equipment", debit: 1250000, credit: 0 },
          { accountCode: "1220", desc: "Accumulated Depreciation", debit: 0, credit: 1250000 },
        ],
      },
      {
        journalNumber: "JE-00007", type: "Manual" as const, status: "Approved" as const,
        lines: [
          { accountCode: "5240", desc: "Marketing & Sales", debit: 1800000, credit: 0 },
          { accountCode: "2110", desc: "AP - Marketing Agency", debit: 0, credit: 1800000 },
        ],
      },
      {
        journalNumber: "JE-00008", type: "Recurring" as const, status: "Posted" as const,
        lines: [
          { accountCode: "5220", desc: "Rent - HQ Office", debit: 350000, credit: 0 },
          { accountCode: "5220", desc: "Rent - Factory Premises", debit: 500000, credit: 0 },
          { accountCode: "1110", desc: "Cash - Rent Payment", debit: 0, credit: 850000 },
        ],
      },
    ];

    for (const je of journalEntries) {
      await prisma.journal.create({
        data: {
          journalNumber: je.journalNumber, postingDate: new Date(), accountingDate: new Date(),
          fiscalYear: "FY 2026-27", accountingPeriod: "Sep 2026",
          journalType: je.type, status: je.status, companyId: "magnertia-ev",
          lines: {
            create: je.lines.map((l, idx) => ({
              accountId: accountIdByCode.get(l.accountCode)!,
              description: l.desc, debit: l.debit, credit: l.credit, lineNumber: idx + 1,
            })),
          },
          approvalSteps: {
            create: [
              { level: "Accountant", approverName: "Priya Sharma", status: je.status === "Draft" ? "Pending" : "Approved", date: je.status !== "Draft" ? new Date() : null },
              { level: "FinanceManager", approverName: "Rajesh Kumar", status: je.status === "Posted" ? "Approved" : "Pending", date: je.status === "Posted" ? new Date() : null },
              { level: "FinancialController", approverName: "Anita Desai", status: je.status === "Posted" ? "Approved" : "Pending", date: je.status === "Posted" ? new Date() : null },
              { level: "CFO", approverName: "Vikram Mehta", status: je.status === "Posted" ? "Approved" : "Pending", date: je.status === "Posted" ? new Date() : null },
            ],
          },
        },
      });
    }
    console.log(`  ✅ ${journalEntries.length} journal entries seeded`);
  }

  // =============================================
  // 8. Fixed Assets
  // =============================================
  const fixedAssetsCount = await prisma.fixedAsset.count();
  if (fixedAssetsCount === 0) {
    const assets = [
      { assetCode: "FA-001", name: "CNC Milling Machine - DMG Mori", category: "Machinery" as const, location: "Factory Floor A", cost: 8500000, salvage: 850000, life: 10, purchaseDaysAgo: 730 },
      { assetCode: "FA-002", name: "Battery Pack Assembly Line", category: "Machinery" as const, location: "Factory Floor B", cost: 25000000, salvage: 2500000, life: 15, purchaseDaysAgo: 365 },
      { assetCode: "FA-003", name: "Robotic Welding System - ABB", category: "Machinery" as const, location: "Factory Floor A", cost: 12000000, salvage: 1200000, life: 12, purchaseDaysAgo: 540 },
      { assetCode: "FA-004", name: "HQ Office Building", category: "Building" as const, location: "Corporate HQ - Pune", cost: 45000000, salvage: 5000000, life: 30, purchaseDaysAgo: 1095 },
      { assetCode: "FA-005", name: "Dell PowerEdge Server Rack", category: "IT_Equipment" as const, location: "Data Center", cost: 2800000, salvage: 280000, life: 5, purchaseDaysAgo: 365 },
      { assetCode: "FA-006", name: "EV Test Vehicle Fleet (5 units)", category: "Vehicles" as const, location: "R&D Center", cost: 7500000, salvage: 1500000, life: 8, purchaseDaysAgo: 200 },
      { assetCode: "FA-007", name: "Office Furniture - HQ 3rd Floor", category: "Furniture" as const, location: "Corporate HQ", cost: 1200000, salvage: 120000, life: 10, purchaseDaysAgo: 500 },
      { assetCode: "FA-008", name: "Quality Inspection Station", category: "Machinery" as const, location: "QC Area", cost: 3500000, salvage: 350000, life: 10, purchaseDaysAgo: 180 },
    ];
    for (const a of assets) {
      const purchaseDate = new Date(now.getTime() - a.purchaseDaysAgo * 24 * 60 * 60 * 1000);
      const yearsUsed = a.purchaseDaysAgo / 365;
      const annualDep = (a.cost - a.salvage) / a.life;
      const accDep = Math.min(Math.round(annualDep * yearsUsed), a.cost - a.salvage);
      const nbv = a.cost - accDep;
      await prisma.fixedAsset.create({
        data: {
          assetCode: a.assetCode, name: a.name, category: a.category, location: a.location,
          purchaseDate, cost: a.cost, salvageValue: a.salvage, usefulLifeYears: a.life,
          depreciationMethod: "Straight Line", accumulatedDepreciation: accDep,
          netBookValue: nbv, status: accDep >= a.cost - a.salvage ? "FullyDepreciated" : "Active",
          companyId: "magnertia-ev",
        },
      });
    }
    console.log(`  ✅ ${assets.length} fixed assets seeded`);
  }

  // =============================================
  // 9. Tax Obligations
  // =============================================
  const taxCount = await prisma.taxObligation.count();
  if (taxCount === 0) {
    const taxObligations = [
      { obligationId: "TAX-001", taxType: "GST", jurisdiction: "Central", period: "Sep 2026", dueOffset: 20, liability: 3378814, paid: 0, status: "Pending" as const },
      { obligationId: "TAX-002", taxType: "GST", jurisdiction: "State - Maharashtra", period: "Sep 2026", dueOffset: 20, liability: 3378814, paid: 0, status: "Pending" as const },
      { obligationId: "TAX-003", taxType: "TDS", jurisdiction: "Central", period: "Sep 2026", dueOffset: 7, liability: 680000, paid: 680000, status: "Paid" as const },
      { obligationId: "TAX-004", taxType: "Corporate Tax", jurisdiction: "Central", period: "Q2 FY26-27", dueOffset: 45, liability: 2500000, paid: 0, status: "Pending" as const },
      { obligationId: "TAX-005", taxType: "GST", jurisdiction: "Central", period: "Aug 2026", dueOffset: -10, liability: 2850000, paid: 2850000, status: "Paid" as const },
      { obligationId: "TAX-006", taxType: "Professional Tax", jurisdiction: "State - Maharashtra", period: "Sep 2026", dueOffset: 15, liability: 85000, paid: 0, status: "DueSoon" as const },
    ];
    for (const t of taxObligations) {
      await prisma.taxObligation.create({
        data: {
          obligationId: t.obligationId, taxType: t.taxType, jurisdiction: t.jurisdiction,
          period: t.period, dueDate: new Date(now.getTime() + t.dueOffset * 24 * 60 * 60 * 1000),
          taxLiability: t.liability, paid: t.paid, payable: t.liability - t.paid, status: t.status,
        },
      });
    }
    const authorities = [
      { authorityId: "AUTH-001", name: "CBIC (Central Board of Indirect Taxes)", jurisdiction: "Central", taxType: "GST" },
      { authorityId: "AUTH-002", name: "Income Tax Department", jurisdiction: "Central", taxType: "Corporate Tax" },
      { authorityId: "AUTH-003", name: "Maharashtra GST Department", jurisdiction: "State - Maharashtra", taxType: "GST" },
    ];
    for (const a of authorities) {
      await prisma.taxAuthority.upsert({ where: { authorityId: a.authorityId }, update: {}, create: a });
    }
    console.log(`  ✅ ${taxObligations.length} tax obligations + ${authorities.length} authorities seeded`);
  }

  // =============================================
  // 10. Budget Versions
  // =============================================
  const budgetCount = await prisma.budgetVersion.count();
  if (budgetCount === 0) {
    const budget = await prisma.budgetVersion.create({
      data: {
        versionCode: "BV-FY2627-ORIG", name: "FY 2026-27 Original Budget",
        type: "Original", status: "Active", totalBudget: 125000000, createdBy: "Vikram Mehta (CFO)",
        departmentBudgets: {
          create: [
            { department: "Manufacturing", budgetAmount: 35000000, actualAmount: 28500000, variance: 6500000, variancePct: 18.57, utilization: 81.43 },
            { department: "Research & Development", budgetAmount: 20000000, actualAmount: 15200000, variance: 4800000, variancePct: 24.0, utilization: 76.0 },
            { department: "Sales & Marketing", budgetAmount: 15000000, actualAmount: 12800000, variance: 2200000, variancePct: 14.67, utilization: 85.33 },
            { department: "Human Resources", budgetAmount: 10000000, actualAmount: 8900000, variance: 1100000, variancePct: 11.0, utilization: 89.0 },
            { department: "Administration", budgetAmount: 8000000, actualAmount: 7200000, variance: 800000, variancePct: 10.0, utilization: 90.0 },
            { department: "IT & Digital", budgetAmount: 12000000, actualAmount: 9800000, variance: 2200000, variancePct: 18.33, utilization: 81.67 },
            { department: "Quality Assurance", budgetAmount: 8000000, actualAmount: 6100000, variance: 1900000, variancePct: 23.75, utilization: 76.25 },
            { department: "Supply Chain", budgetAmount: 17000000, actualAmount: 14500000, variance: 2500000, variancePct: 14.71, utilization: 85.29 },
          ],
        },
        costCenterBudgets: {
          create: [
            { costCenter: "Factory Operations", code: "CC-MFG-001", budgetAmount: 35000000, actualAmount: 28500000, variance: 6500000, variancePct: 18.57, utilization: 81.43 },
            { costCenter: "R&D Lab", code: "CC-RND-001", budgetAmount: 20000000, actualAmount: 15200000, variance: 4800000, variancePct: 24.0, utilization: 76.0 },
            { costCenter: "Corporate HQ", code: "CC-ADM-001", budgetAmount: 18000000, actualAmount: 16100000, variance: 1900000, variancePct: 10.56, utilization: 89.44 },
            { costCenter: "IT Data Center", code: "CC-IT-001", budgetAmount: 12000000, actualAmount: 9800000, variance: 2200000, variancePct: 18.33, utilization: 81.67 },
          ],
        },
        projectBudgets: {
          create: [
            { project: "EV Platform Gen-3", manager: "Arjun Patel", budgetAmount: 30000000, actualAmount: 22000000, variance: 8000000, utilization: 73.33, status: "On Track" },
            { project: "Charging Network Expansion", manager: "Meera Singh", budgetAmount: 15000000, actualAmount: 11500000, variance: 3500000, utilization: 76.67, status: "On Track" },
            { project: "Smart Factory Phase 2", manager: "Rohit Sharma", budgetAmount: 20000000, actualAmount: 18500000, variance: 1500000, utilization: 92.5, status: "At Risk" },
            { project: "BMS Firmware v3.0", manager: "Kavita Nair", budgetAmount: 8000000, actualAmount: 5200000, variance: 2800000, utilization: 65.0, status: "On Track" },
          ],
        },
      },
    });
    await prisma.budgetVersion.create({
      data: {
        versionCode: "BV-FY2627-REV1", name: "FY 2026-27 Revision 1",
        type: "Revision", status: "Draft", totalBudget: 132000000,
        createdBy: "Vikram Mehta (CFO)", parentVersionId: budget.id,
      },
    });
    console.log(`  ✅ 2 budget versions seeded`);
  }

  // =============================================
  // 11. Cost Centers
  // =============================================
  const ccCount = await prisma.costCenterRecord.count();
  if (ccCount === 0) {
    const costCenters = [
      { code: "CC-MFG-001", name: "Factory Operations", dept: "Manufacturing", manager: "Rohit Sharma", budget: 35000000, actual: 28500000, type: "Operational" as const },
      { code: "CC-RND-001", name: "R&D Lab", dept: "Research & Development", manager: "Kavita Nair", budget: 20000000, actual: 15200000, type: "Operational" as const },
      { code: "CC-ADM-001", name: "Corporate HQ", dept: "Administration", manager: "Anita Desai", budget: 18000000, actual: 16100000, type: "Administrative" as const },
      { code: "CC-IT-001", name: "IT Data Center", dept: "IT & Digital", manager: "Sanjay Reddy", budget: 12000000, actual: 9800000, type: "Support" as const },
      { code: "CC-SCM-001", name: "Supply Chain Hub", dept: "Supply Chain", manager: "Deepak Joshi", budget: 17000000, actual: 14500000, type: "Operational" as const },
      { code: "CC-QA-001", name: "Quality Lab", dept: "Quality Assurance", manager: "Priya Sharma", budget: 8000000, actual: 6100000, type: "Support" as const },
    ];
    for (const cc of costCenters) {
      const variance = cc.budget - cc.actual;
      await prisma.costCenterRecord.create({
        data: {
          code: cc.code, name: cc.name, department: cc.dept, manager: cc.manager,
          budget: cc.budget, actual: cc.actual, variance,
          utilization: Math.round((cc.actual / cc.budget) * 10000) / 100,
          status: "Active", type: cc.type,
        },
      });
    }
    console.log(`  ✅ ${costCenters.length} cost centers seeded`);
  }

  // =============================================
  // Phase 2: Management Modules Seed Data
  // =============================================

  // --- Departments ---
  const departmentsData = [
    { code: "DEPT-ENG", name: "Engineering", headOfDept: "Arun Kumar", location: "Coimbatore" },
    { code: "DEPT-FIN", name: "Finance & Accounting", headOfDept: "Priya Nair", location: "Coimbatore" },
    { code: "DEPT-HR", name: "Human Resources", headOfDept: "Kavitha Sundaram", location: "Coimbatore" },
    { code: "DEPT-SALES", name: "Sales & Marketing", headOfDept: "Vikram Reddy", location: "Chennai" },
    { code: "DEPT-MFG", name: "Manufacturing", headOfDept: "Rajesh Iyer", location: "Hosur" },
    { code: "DEPT-QA", name: "Quality Assurance", headOfDept: "Deepa Menon", location: "Hosur" },
    { code: "DEPT-PROC", name: "Procurement", headOfDept: "Suresh Babu", location: "Coimbatore" },
    { code: "DEPT-RND", name: "Research & Development", headOfDept: "Dr. Lakshmi Prasad", location: "Coimbatore" },
    { code: "DEPT-IT", name: "Information Technology", headOfDept: "Karthik Rajan", location: "Coimbatore" },
    { code: "DEPT-ADMIN", name: "Administration", headOfDept: "Meena Kumari", location: "Coimbatore" },
    { code: "DEPT-LOG", name: "Logistics & Supply Chain", headOfDept: "Mohan Das", location: "Hosur" },
    { code: "DEPT-LEGAL", name: "Legal & Compliance", headOfDept: "Advocate Shanthi", location: "Coimbatore" },
  ];
  const deptMap: Record<string, string> = {};
  for (const d of departmentsData) {
    const dept = await prisma.department.upsert({
      where: { code: d.code },
      update: { headOfDept: d.headOfDept },
      create: d,
    });
    deptMap[d.code] = dept.id;
  }
  console.log(`  ✅ ${departmentsData.length} departments seeded`);

  // --- Designations ---
  const designationsData = [
    { code: "DES-CEO", title: "Chief Executive Officer", grade: "E1", level: 1, band: "Executive" },
    { code: "DES-CTO", title: "Chief Technology Officer", grade: "E1", level: 1, band: "Executive" },
    { code: "DES-CFO", title: "Chief Financial Officer", grade: "E1", level: 1, band: "Executive" },
    { code: "DES-VP", title: "Vice President", grade: "E2", level: 2, band: "Executive" },
    { code: "DES-DIR", title: "Director", grade: "M1", level: 3, band: "Management" },
    { code: "DES-SM", title: "Senior Manager", grade: "M2", level: 4, band: "Management" },
    { code: "DES-MGR", title: "Manager", grade: "M3", level: 5, band: "Management" },
    { code: "DES-TL", title: "Team Lead", grade: "G3", level: 6, band: "Senior" },
    { code: "DES-SR-ENG", title: "Senior Engineer", grade: "G4", level: 7, band: "Senior" },
    { code: "DES-ENG", title: "Engineer", grade: "G5", level: 8, band: "Regular" },
    { code: "DES-JR-ENG", title: "Junior Engineer", grade: "G6", level: 9, band: "Regular" },
    { code: "DES-EXEC", title: "Executive", grade: "G5", level: 8, band: "Regular" },
    { code: "DES-ANALYST", title: "Analyst", grade: "G5", level: 8, band: "Regular" },
    { code: "DES-ASST", title: "Assistant", grade: "G7", level: 10, band: "Entry" },
    { code: "DES-INTERN", title: "Intern", grade: "G8", level: 11, band: "Entry" },
  ];
  const desigMap: Record<string, string> = {};
  for (const d of designationsData) {
    const desig = await prisma.designation.upsert({
      where: { code: d.code },
      update: {},
      create: d,
    });
    desigMap[d.code] = desig.id;
  }
  console.log(`  ✅ ${designationsData.length} designations seeded`);

  // --- Employees ---
  const employeesData = [
    { code: "EMP-001", first: "Sankaranarayanan", last: "R", email: "sankar.r@magnertia.com", dept: "DEPT-ENG", desig: "DES-SR-ENG", loc: "Coimbatore", bu: "Product Development", grade: "G4", ctc: 1250000, join: "2023-08-01" },
    { code: "EMP-002", first: "Priya", last: "Nair", email: "priya.nair@magnertia.com", dept: "DEPT-FIN", desig: "DES-SM", loc: "Coimbatore", bu: "Finance", grade: "M2", ctc: 2800000, join: "2021-03-15" },
    { code: "EMP-003", first: "Vikram", last: "Reddy", email: "vikram.reddy@magnertia.com", dept: "DEPT-SALES", desig: "DES-MGR", loc: "Chennai", bu: "Sales", grade: "M3", ctc: 2200000, join: "2022-01-10" },
    { code: "EMP-004", first: "Kavitha", last: "Sundaram", email: "kavitha.s@magnertia.com", dept: "DEPT-HR", desig: "DES-SM", loc: "Coimbatore", bu: "HR", grade: "M2", ctc: 2400000, join: "2020-06-01" },
    { code: "EMP-005", first: "Rajesh", last: "Iyer", email: "rajesh.iyer@magnertia.com", dept: "DEPT-MFG", desig: "DES-MGR", loc: "Hosur", bu: "Manufacturing", grade: "M3", ctc: 2600000, join: "2021-09-20" },
    { code: "EMP-006", first: "Deepa", last: "Menon", email: "deepa.menon@magnertia.com", dept: "DEPT-QA", desig: "DES-TL", loc: "Hosur", bu: "Quality", grade: "G3", ctc: 1800000, join: "2022-04-15" },
    { code: "EMP-007", first: "Suresh", last: "Babu", email: "suresh.babu@magnertia.com", dept: "DEPT-PROC", desig: "DES-MGR", loc: "Coimbatore", bu: "Procurement", grade: "M3", ctc: 2000000, join: "2021-11-01" },
    { code: "EMP-008", first: "Lakshmi", last: "Prasad", email: "lakshmi.p@magnertia.com", dept: "DEPT-RND", desig: "DES-DIR", loc: "Coimbatore", bu: "R&D", grade: "M1", ctc: 4200000, join: "2019-02-10" },
    { code: "EMP-009", first: "Karthik", last: "Rajan", email: "karthik.r@magnertia.com", dept: "DEPT-IT", desig: "DES-TL", loc: "Coimbatore", bu: "IT", grade: "G3", ctc: 1900000, join: "2022-07-01" },
    { code: "EMP-010", first: "Arun", last: "Kumar", email: "arun.kumar@magnertia.com", dept: "DEPT-ENG", desig: "DES-SM", loc: "Coimbatore", bu: "Product Development", grade: "M2", ctc: 3200000, join: "2020-01-15" },
    { code: "EMP-011", first: "Nithya", last: "Krishnan", email: "nithya.k@magnertia.com", dept: "DEPT-FIN", desig: "DES-ANALYST", loc: "Coimbatore", bu: "Finance", grade: "G5", ctc: 1100000, join: "2023-05-20" },
    { code: "EMP-012", first: "Anand", last: "Selvam", email: "anand.s@magnertia.com", dept: "DEPT-MFG", desig: "DES-ENG", loc: "Hosur", bu: "Manufacturing", grade: "G5", ctc: 1000000, join: "2023-09-01" },
    { code: "EMP-013", first: "Divya", last: "Raghavan", email: "divya.r@magnertia.com", dept: "DEPT-SALES", desig: "DES-EXEC", loc: "Chennai", bu: "Sales", grade: "G5", ctc: 900000, join: "2024-01-10" },
    { code: "EMP-014", first: "Manoj", last: "Venkatesh", email: "manoj.v@magnertia.com", dept: "DEPT-ENG", desig: "DES-ENG", loc: "Coimbatore", bu: "Product Development", grade: "G5", ctc: 1050000, join: "2023-06-15" },
    { code: "EMP-015", first: "Swetha", last: "Narayanan", email: "swetha.n@magnertia.com", dept: "DEPT-HR", desig: "DES-EXEC", loc: "Coimbatore", bu: "HR", grade: "G5", ctc: 850000, join: "2024-02-01" },
    { code: "EMP-016", first: "Gopal", last: "Krishnamurthy", email: "gopal.k@magnertia.com", dept: "DEPT-LOG", desig: "DES-TL", loc: "Hosur", bu: "Logistics", grade: "G3", ctc: 1600000, join: "2022-08-15" },
    { code: "EMP-017", first: "Revathi", last: "Srinivasan", email: "revathi.s@magnertia.com", dept: "DEPT-QA", desig: "DES-ENG", loc: "Hosur", bu: "Quality", grade: "G5", ctc: 950000, join: "2023-11-01" },
    { code: "EMP-018", first: "Venkat", last: "Subramanian", email: "venkat.s@magnertia.com", dept: "DEPT-ADMIN", desig: "DES-MGR", loc: "Coimbatore", bu: "Admin", grade: "M3", ctc: 1800000, join: "2021-04-01" },
    { code: "EMP-019", first: "Meera", last: "Balachandran", email: "meera.b@magnertia.com", dept: "DEPT-RND", desig: "DES-SR-ENG", loc: "Coimbatore", bu: "R&D", grade: "G4", ctc: 1400000, join: "2022-10-15" },
    { code: "EMP-020", first: "Ashwin", last: "Patel", email: "ashwin.p@magnertia.com", dept: "DEPT-PROC", desig: "DES-EXEC", loc: "Coimbatore", bu: "Procurement", grade: "G5", ctc: 800000, join: "2024-03-01" },
  ];
  const empMap: Record<string, string> = {};
  for (const e of employeesData) {
    const emp = await prisma.employee.upsert({
      where: { employeeCode: e.code },
      update: {},
      create: {
        employeeCode: e.code,
        employeeNumber: `MAG/EMP/${e.join.substring(0,4)}/${e.code.split("-")[1]}`,
        firstName: e.first,
        lastName: e.last,
        fullName: `${e.first} ${e.last}`,
        email: e.email,
        departmentId: deptMap[e.dept],
        designationId: desigMap[e.desig],
        location: e.loc,
        businessUnit: e.bu,
        grade: e.grade,
        annualCTC: e.ctc,
        joiningDate: new Date(e.join),
        status: "Active",
        employmentType: "FullTime",
      },
    });
    empMap[e.code] = emp.id;
  }
  console.log(`  ✅ ${employeesData.length} employees seeded`);

  // Set reporting managers
  const reportingMap: Record<string, string> = {
    "EMP-001": "EMP-010", "EMP-014": "EMP-010", // Sankar, Manoj -> Arun
    "EMP-011": "EMP-002", // Nithya -> Priya
    "EMP-013": "EMP-003", // Divya -> Vikram
    "EMP-015": "EMP-004", // Swetha -> Kavitha
    "EMP-012": "EMP-005", // Anand -> Rajesh
    "EMP-017": "EMP-006", // Revathi -> Deepa
    "EMP-020": "EMP-007", // Ashwin -> Suresh
    "EMP-019": "EMP-008", // Meera -> Lakshmi
  };
  for (const [emp, mgr] of Object.entries(reportingMap)) {
    if (empMap[emp] && empMap[mgr]) {
      await prisma.employee.update({ where: { id: empMap[emp] }, data: { reportingManagerId: empMap[mgr] } });
    }
  }
  console.log("  ✅ Reporting hierarchy set");

  // --- Leave Requests ---
  const leaveData = [
    { code: "LV-001", emp: "EMP-001", type: "CasualLeave" as const, start: "2026-09-25", end: "2026-09-26", days: 2, reason: "Personal work", status: "Pending" as const },
    { code: "LV-002", emp: "EMP-003", type: "SickLeave" as const, start: "2026-09-15", end: "2026-09-16", days: 2, reason: "Fever and cold", status: "Approved" as const },
    { code: "LV-003", emp: "EMP-006", type: "EarnedLeave" as const, start: "2026-10-01", end: "2026-10-05", days: 5, reason: "Family vacation", status: "Pending" as const },
    { code: "LV-004", emp: "EMP-012", type: "CasualLeave" as const, start: "2026-09-18", end: "2026-09-18", days: 1, reason: "Doctor appointment", status: "Approved" as const },
    { code: "LV-005", emp: "EMP-015", type: "SickLeave" as const, start: "2026-09-10", end: "2026-09-11", days: 2, reason: "Food poisoning", status: "Approved" as const },
    { code: "LV-006", emp: "EMP-019", type: "CasualLeave" as const, start: "2026-09-28", end: "2026-09-29", days: 2, reason: "Family function", status: "Pending" as const },
  ];
  for (const l of leaveData) {
    await prisma.leaveRequest.upsert({
      where: { leaveCode: l.code },
      update: {},
      create: {
        leaveCode: l.code,
        employeeId: empMap[l.emp],
        leaveType: l.type,
        startDate: new Date(l.start),
        endDate: new Date(l.end),
        days: l.days,
        reason: l.reason,
        status: l.status,
        approvedBy: l.status === "Approved" ? "Kavitha Sundaram" : undefined,
        approvedDate: l.status === "Approved" ? new Date() : undefined,
      },
    });
  }
  console.log(`  ✅ ${leaveData.length} leave requests seeded`);

  // --- Payroll Records ---
  const payrollMonths = [
    { period: "Aug 2026", month: 8, year: 2026 },
    { period: "Jul 2026", month: 7, year: 2026 },
  ];
  let payrollCount = 0;
  for (const pm of payrollMonths) {
    for (const e of employeesData.slice(0, 10)) {
      const basic = Math.round(e.ctc / 12 * 0.5);
      const hra = Math.round(basic * 0.4);
      const conv = 1600;
      const special = Math.round(e.ctc / 12) - basic - hra - conv;
      const gross = basic + hra + conv + special;
      const pf = Math.round(basic * 0.12);
      const esi = gross <= 21000 ? Math.round(gross * 0.0075) : 0;
      const tds = Math.round(gross * 0.1);
      const pt = 200;
      const totalDed = pf + esi + tds + pt;
      const net = gross - totalDed;
      await prisma.payrollRecord.upsert({
        where: { payrollCode: `PR-${e.code}-${pm.month}-${pm.year}` },
        update: {},
        create: {
          payrollCode: `PR-${e.code}-${pm.month}-${pm.year}`,
          employeeId: empMap[e.code],
          period: pm.period,
          month: pm.month,
          year: pm.year,
          basicSalary: basic,
          hra,
          conveyance: conv,
          specialAllowance: special > 0 ? special : 0,
          grossEarnings: gross,
          pfDeduction: pf,
          esiDeduction: esi,
          tds,
          professionalTax: pt,
          totalDeductions: totalDed,
          netPay: net,
          status: "Paid",
          paidDate: new Date(`${pm.year}-${String(pm.month).padStart(2, "0")}-28`),
          workingDays: 22,
          presentDays: 21,
          lossOfPayDays: 0,
        },
      });
      payrollCount++;
    }
  }
  console.log(`  ✅ ${payrollCount} payroll records seeded`);

  // --- CRM Leads ---
  const leadsData = [
    { num: "L-2024-000578", name: "Acme Automation Pvt. Ltd.", type: "Business", status: "Contacted" as const, rating: "Warm" as const, priority: "High" as const, owner: "Vikram Reddy", source: "Website", contact: "Ankit Verma", email: "ankit@acmeauto.com", org: "Acme Automation", industry: "Industrial Automation", city: "Mumbai", state: "Maharashtra", score: 72 },
    { num: "L-2024-000579", name: "GreenDrive Technologies", type: "Business", status: "Qualified" as const, rating: "Hot" as const, priority: "Critical" as const, owner: "Vikram Reddy", source: "Referral", contact: "Pradeep Sharma", email: "pradeep@greendrive.in", org: "GreenDrive Technologies", industry: "Electric Vehicles", city: "Pune", state: "Maharashtra", score: 88 },
    { num: "L-2024-000580", name: "SolarEdge Power Systems", type: "Business", status: "New" as const, rating: "Cold" as const, priority: "Medium" as const, owner: "Divya Raghavan", source: "Trade Show", contact: "Meera Patel", email: "meera@solaredge.co.in", org: "SolarEdge Power", industry: "Renewable Energy", city: "Ahmedabad", state: "Gujarat", score: 35 },
    { num: "L-2024-000581", name: "TechnoForge Industries", type: "Business", status: "Proposal" as const, rating: "Hot" as const, priority: "High" as const, owner: "Vikram Reddy", source: "LinkedIn", contact: "Arjun Mehta", email: "arjun@technoforge.com", org: "TechnoForge Industries", industry: "Manufacturing", city: "Chennai", state: "Tamil Nadu", score: 82 },
    { num: "L-2024-000582", name: "EcoMotion Mobility", type: "Business", status: "Negotiation" as const, rating: "Hot" as const, priority: "Critical" as const, owner: "Vikram Reddy", source: "Website", contact: "Shalini Kumar", email: "shalini@ecomotion.in", org: "EcoMotion Mobility", industry: "Electric Vehicles", city: "Bangalore", state: "Karnataka", score: 91 },
    { num: "L-2024-000583", name: "Infinity Electricals", type: "Business", status: "Nurturing" as const, rating: "Warm" as const, priority: "Medium" as const, owner: "Divya Raghavan", source: "Cold Call", contact: "Ramesh Gupta", email: "ramesh@infinityelec.com", org: "Infinity Electricals", industry: "Electrical Components", city: "Delhi", state: "Delhi", score: 55 },
    { num: "L-2024-000584", name: "Bharath Heavy Engineering", type: "Institutional", status: "Contacted" as const, rating: "Warm" as const, priority: "High" as const, owner: "Vikram Reddy", source: "Government Portal", contact: "Dr. Sunil Rao", email: "sunil.rao@bhe.gov.in", org: "Bharath Heavy Engineering", industry: "Defense & Aerospace", city: "Hyderabad", state: "Telangana", score: 68 },
    { num: "L-2024-000585", name: "Metro Logistics Corp", type: "Business", status: "Lost" as const, rating: "Cold" as const, priority: "Low" as const, owner: "Divya Raghavan", source: "Website", contact: "Pavan Rao", email: "pavan@metrologistics.in", org: "Metro Logistics", industry: "Logistics", city: "Kochi", state: "Kerala", score: 20 },
  ];
  for (const l of leadsData) {
    await prisma.crmLead.upsert({
      where: { leadNumber: l.num },
      update: {},
      create: {
        leadNumber: l.num,
        leadName: l.name,
        leadType: l.type,
        status: l.status,
        rating: l.rating,
        priority: l.priority,
        ownerName: l.owner,
        ownerEmail: `${l.owner.toLowerCase().replace(" ", ".")}@magnertia.com`,
        leadSource: l.source,
        contactPerson: l.contact,
        email: l.email,
        orgName: l.org,
        industry: l.industry,
        city: l.city,
        state: l.state,
        country: "India",
        totalScore: l.score,
        scoreGrade: l.score >= 80 ? "A" : l.score >= 60 ? "B" : l.score >= 40 ? "C" : "D",
      },
    });
  }
  console.log(`  ✅ ${leadsData.length} CRM leads seeded`);

  // --- CRM Accounts ---
  const accountsDataCrm = [
    { code: "ACC-001", name: "Tata Motors Ltd", type: "Customer", industry: "Automotive", city: "Mumbai", state: "Maharashtra", revenue: 350000000 },
    { code: "ACC-002", name: "Mahindra Electric", type: "Customer", industry: "Electric Vehicles", city: "Bangalore", state: "Karnataka", revenue: 120000000 },
    { code: "ACC-003", name: "Ather Energy", type: "Partner", industry: "Electric Vehicles", city: "Bangalore", state: "Karnataka", revenue: 80000000 },
    { code: "ACC-004", name: "Ashok Leyland", type: "Customer", industry: "Commercial Vehicles", city: "Chennai", state: "Tamil Nadu", revenue: 280000000 },
    { code: "ACC-005", name: "ISRO", type: "Government", industry: "Space & Defense", city: "Bangalore", state: "Karnataka", revenue: 0 },
    { code: "ACC-006", name: "L&T Technology Services", type: "Partner", industry: "Engineering Services", city: "Mumbai", state: "Maharashtra", revenue: 180000000 },
  ];
  const accMap: Record<string, string> = {};
  for (const a of accountsDataCrm) {
    const acc = await prisma.crmAccount.upsert({
      where: { accountCode: a.code },
      update: {},
      create: {
        accountCode: a.code,
        name: a.name,
        type: a.type,
        industry: a.industry,
        billingCity: a.city,
        billingState: a.state,
        billingCountry: "India",
        annualRevenue: a.revenue,
        ownerName: "Vikram Reddy",
        status: "Active",
      },
    });
    accMap[a.code] = acc.id;
  }
  console.log(`  ✅ ${accountsDataCrm.length} CRM accounts seeded`);

  // --- CRM Contacts ---
  const contactsData = [
    { code: "CON-001", first: "Rajendra", last: "Singh", email: "rajendra.singh@tatamotors.com", phone: "+91 98765 11111", desig: "VP Engineering", acc: "ACC-001", primary: true },
    { code: "CON-002", first: "Aisha", last: "Kapoor", email: "aisha.kapoor@tatamotors.com", phone: "+91 98765 22222", desig: "Procurement Head", acc: "ACC-001", primary: false },
    { code: "CON-003", first: "Naveen", last: "Kumar", email: "naveen@mahindraelectric.com", phone: "+91 98765 33333", desig: "CTO", acc: "ACC-002", primary: true },
    { code: "CON-004", first: "Priya", last: "Sharma", email: "priya@atherenergy.com", phone: "+91 98765 44444", desig: "Head of Partnerships", acc: "ACC-003", primary: true },
    { code: "CON-005", first: "Venkatesh", last: "Iyer", email: "venkatesh@ashokleyland.com", phone: "+91 98765 55555", desig: "General Manager", acc: "ACC-004", primary: true },
    { code: "CON-006", first: "Dr. Srinivas", last: "Rao", email: "srinivas.rao@isro.gov.in", phone: "+91 98765 66666", desig: "Project Director", acc: "ACC-005", primary: true },
  ];
  for (const c of contactsData) {
    await prisma.crmContact.upsert({
      where: { contactCode: c.code },
      update: {},
      create: {
        contactCode: c.code,
        firstName: c.first,
        lastName: c.last,
        fullName: `${c.first} ${c.last}`,
        email: c.email,
        phone: c.phone,
        designation: c.desig,
        isPrimary: c.primary,
        accountId: accMap[c.acc],
        status: "Active",
      },
    });
  }
  console.log(`  ✅ ${contactsData.length} CRM contacts seeded`);

  // --- CRM Opportunities ---
  const oppsData = [
    { num: "OPP-001", name: "Tata EV Charging Infrastructure", stage: "Negotiation" as const, amount: 4500000, prob: 75, owner: "Vikram Reddy", acc: "ACC-001", close: "2026-11-30" },
    { num: "OPP-002", name: "Mahindra BMS Integration", stage: "Proposal" as const, amount: 2800000, prob: 60, owner: "Vikram Reddy", acc: "ACC-002", close: "2026-12-15" },
    { num: "OPP-003", name: "Ather Co-Development Partnership", stage: "Discovery" as const, amount: 1200000, prob: 30, owner: "Divya Raghavan", acc: "ACC-003", close: "2027-03-30" },
    { num: "OPP-004", name: "Ashok Leyland Motor Controllers", stage: "ClosedWon" as const, amount: 6200000, prob: 100, owner: "Vikram Reddy", acc: "ACC-004", close: "2026-08-15" },
    { num: "OPP-005", name: "L&T Automation Platform", stage: "Qualification" as const, amount: 3500000, prob: 40, owner: "Vikram Reddy", acc: "ACC-006", close: "2027-02-28" },
  ];
  for (const o of oppsData) {
    await prisma.crmOpportunity.upsert({
      where: { opportunityNumber: o.num },
      update: {},
      create: {
        opportunityNumber: o.num,
        name: o.name,
        stage: o.stage,
        amount: o.amount,
        probability: o.prob,
        ownerName: o.owner,
        accountId: accMap[o.acc],
        expectedCloseDate: new Date(o.close),
      },
    });
  }
  console.log(`  ✅ ${oppsData.length} CRM opportunities seeded`);

  // --- Support Tickets ---
  const ticketsData = [
    { num: "TKT-001", subject: "Motor controller overheating in field", priority: "Critical" as const, status: "InProgress" as const, acc: "ACC-004", contact: "Venkatesh Iyer", assigned: "Deepa Menon", cat: "Technical" },
    { num: "TKT-002", subject: "Delivery delay for Q3 batch order", priority: "High" as const, status: "Open" as const, acc: "ACC-001", contact: "Rajendra Singh", assigned: "Gopal Krishnamurthy", cat: "Logistics" },
    { num: "TKT-003", subject: "Firmware update documentation request", priority: "Medium" as const, status: "Resolved" as const, acc: "ACC-002", contact: "Naveen Kumar", assigned: "Karthik Rajan", cat: "Documentation" },
    { num: "TKT-004", subject: "Invoice discrepancy for PO-2024-089", priority: "Medium" as const, status: "Open" as const, acc: "ACC-006", contact: "Dr. Srinivas Rao", assigned: "Nithya Krishnan", cat: "Billing" },
  ];
  for (const t of ticketsData) {
    await prisma.supportTicket.upsert({
      where: { ticketNumber: t.num },
      update: {},
      create: {
        ticketNumber: t.num,
        subject: t.subject,
        priority: t.priority,
        status: t.status,
        accountId: accMap[t.acc],
        contactName: t.contact,
        assignedTo: t.assigned,
        category: t.cat,
        channel: "Email",
      },
    });
  }
  console.log(`  ✅ ${ticketsData.length} support tickets seeded`);

  // --- Suppliers ---
  const suppliersData = [
    { code: "SUP-001", name: "Tata Steel Ltd", cat: "Raw Materials", city: "Jamshedpur", state: "Jharkhand", terms: "Net 45", rating: 5, lead: 14 },
    { code: "SUP-002", name: "Bharat Electronics Ltd", cat: "Electronics", city: "Bangalore", state: "Karnataka", terms: "Net 30", rating: 4, lead: 10 },
    { code: "SUP-003", name: "Exide Industries", cat: "Battery Components", city: "Kolkata", state: "West Bengal", terms: "Net 30", rating: 4, lead: 7 },
    { code: "SUP-004", name: "Minda Industries", cat: "Auto Components", city: "Gurugram", state: "Haryana", terms: "Net 45", rating: 3, lead: 12 },
    { code: "SUP-005", name: "Sundaram Fasteners", cat: "Fasteners & Hardware", city: "Chennai", state: "Tamil Nadu", terms: "Net 30", rating: 5, lead: 5 },
    { code: "SUP-006", name: "Amara Raja Energy", cat: "Battery Cells", city: "Tirupati", state: "Andhra Pradesh", terms: "Net 60", rating: 4, lead: 21 },
  ];
  const supMap: Record<string, string> = {};
  for (const s of suppliersData) {
    const sup = await prisma.supplier.upsert({
      where: { supplierCode: s.code },
      update: {},
      create: {
        supplierCode: s.code,
        name: s.name,
        category: s.cat,
        city: s.city,
        state: s.state,
        country: "India",
        paymentTerms: s.terms,
        rating: s.rating,
        leadTime: s.lead,
        status: "Active",
      },
    });
    supMap[s.code] = sup.id;
  }
  console.log(`  ✅ ${suppliersData.length} suppliers seeded`);

  // --- Purchase Orders ---
  const posData = [
    { num: "PO-2026-001", sup: "SUP-001", date: "2026-08-10", expected: "2026-09-10", status: "Received" as const, by: "Suresh Babu", items: [{ code: "RM-STEEL-001", name: "Cold Rolled Steel Sheet", qty: 500, price: 85000, uom: "MT" }] },
    { num: "PO-2026-002", sup: "SUP-002", date: "2026-08-20", expected: "2026-09-15", status: "Ordered" as const, by: "Suresh Babu", items: [{ code: "EC-PCB-001", name: "Motor Controller PCB", qty: 200, price: 4500, uom: "Nos" }, { code: "EC-IC-001", name: "Power MOSFET Module", qty: 400, price: 1200, uom: "Nos" }] },
    { num: "PO-2026-003", sup: "SUP-003", date: "2026-09-01", expected: "2026-09-20", status: "Approved" as const, by: "Suresh Babu", items: [{ code: "BAT-CELL-001", name: "Li-Ion Battery Cell 21700", qty: 10000, price: 280, uom: "Nos" }] },
    { num: "PO-2026-004", sup: "SUP-005", date: "2026-09-10", expected: "2026-09-25", status: "Draft" as const, by: "Ashwin Patel", items: [{ code: "HW-BOLT-001", name: "M8 Hex Bolts Grade 10.9", qty: 5000, price: 12, uom: "Nos" }, { code: "HW-NUT-001", name: "M8 Flange Nuts", qty: 5000, price: 8, uom: "Nos" }] },
    { num: "PO-2026-005", sup: "SUP-006", date: "2026-09-15", expected: "2026-10-15", status: "Submitted" as const, by: "Suresh Babu", items: [{ code: "BAT-PACK-001", name: "Battery Module Assembly", qty: 50, price: 125000, uom: "Nos" }] },
  ];
  for (const po of posData) {
    const lines = po.items.map((item, i) => ({
      lineNumber: i + 1,
      itemCode: item.code,
      itemName: item.name,
      quantity: item.qty,
      unitPrice: item.price,
      taxRate: 18,
      lineTotal: item.qty * item.price,
      uom: item.uom,
    }));
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const taxAmount = Math.round(subtotal * 0.18);
    await prisma.purchaseOrder.upsert({
      where: { poNumber: po.num },
      update: {},
      create: {
        poNumber: po.num,
        supplierName: suppliersData.find((s) => s.code === po.sup)!.name,
        supplierId: supMap[po.sup],
        orderDate: new Date(po.date),
        expectedDate: new Date(po.expected),
        status: po.status,
        requestedBy: po.by,
        approvedBy: ["Approved", "Ordered", "Received"].includes(po.status) ? "Rajesh Iyer" : undefined,
        approvedDate: ["Approved", "Ordered", "Received"].includes(po.status) ? new Date(po.date) : undefined,
        paymentTerms: suppliersData.find((s) => s.code === po.sup)!.terms,
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount,
        lines: { create: lines },
      },
    });
  }
  console.log(`  ✅ ${posData.length} purchase orders seeded`);

  // --- Sales Orders ---
  const salesData = [
    { num: "SO-2026-001", cust: "Tata Motors Ltd", code: "ACC-001", date: "2026-07-15", delivery: "2026-09-15", status: "Delivered" as const, person: "Vikram Reddy", territory: "West", items: [{ code: "PRD-MC-001", name: "EV Motor Controller 48V", qty: 100, price: 45000 }] },
    { num: "SO-2026-002", cust: "Mahindra Electric", code: "ACC-002", date: "2026-08-01", delivery: "2026-10-01", status: "Processing" as const, person: "Vikram Reddy", territory: "South", items: [{ code: "PRD-BMS-001", name: "Battery Management System", qty: 50, price: 32000 }, { code: "PRD-CHG-001", name: "On-Board Charger 7kW", qty: 50, price: 28000 }] },
    { num: "SO-2026-003", cust: "Ashok Leyland", code: "ACC-004", date: "2026-08-20", delivery: "2026-11-20", status: "Confirmed" as const, person: "Vikram Reddy", territory: "South", items: [{ code: "PRD-MC-002", name: "EV Motor Controller 96V", qty: 200, price: 62000 }] },
    { num: "SO-2026-004", cust: "Ather Energy", code: "ACC-003", date: "2026-09-01", delivery: "2026-12-01", status: "Draft" as const, person: "Divya Raghavan", territory: "South", items: [{ code: "PRD-IOT-001", name: "Vehicle Telemetry Module", qty: 500, price: 8500 }] },
    { num: "SO-2026-005", cust: "L&T Technology Services", code: "ACC-006", date: "2026-09-10", delivery: "2026-11-30", status: "Confirmed" as const, person: "Vikram Reddy", territory: "West", items: [{ code: "PRD-AUT-001", name: "Industrial Automation Controller", qty: 30, price: 185000 }] },
  ];
  for (const so of salesData) {
    const lines = so.items.map((item, i) => ({
      lineNumber: i + 1,
      productCode: item.code,
      productName: item.name,
      quantity: item.qty,
      unitPrice: item.price,
      taxRate: 18,
      lineTotal: item.qty * item.price,
      uom: "Nos" as const,
    }));
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const taxAmount = Math.round(subtotal * 0.18);
    await prisma.salesOrder.upsert({
      where: { orderNumber: so.num },
      update: {},
      create: {
        orderNumber: so.num,
        customerName: so.cust,
        customerCode: so.code,
        orderDate: new Date(so.date),
        deliveryDate: new Date(so.delivery),
        status: so.status,
        salesPerson: so.person,
        territory: so.territory,
        paymentTerms: "Net 30",
        subtotal,
        taxAmount,
        totalAmount: subtotal + taxAmount,
        lines: { create: lines },
      },
    });
  }
  console.log(`  ✅ ${salesData.length} sales orders seeded`);

  // --- Projects ---
  const projectsData = [
    { code: "PRJ-001", name: "EV Motor Controller V2", desc: "Next-gen motor controller with SiC MOSFET", status: "Active" as const, priority: "Critical" as const, cat: "Product Development", mgr: "Arun Kumar", dept: "Engineering", start: "2026-04-01", end: "2026-12-31", budget: 5000000, completion: 45 },
    { code: "PRJ-002", name: "Factory Hosur Phase 2 Expansion", desc: "Expand manufacturing capacity to 500K units/year", status: "Active" as const, priority: "High" as const, cat: "Infrastructure", mgr: "Rajesh Iyer", dept: "Manufacturing", start: "2026-06-01", end: "2027-06-30", budget: 25000000, completion: 20 },
    { code: "PRJ-003", name: "ERP System Implementation", desc: "Magnertia ERP suite rollout across all departments", status: "Active" as const, priority: "High" as const, cat: "IT", mgr: "Karthik Rajan", dept: "Information Technology", start: "2026-01-15", end: "2026-09-30", budget: 3500000, completion: 72 },
    { code: "PRJ-004", name: "ISO 9001:2015 Recertification", desc: "Quality management system audit and recertification", status: "Planning" as const, priority: "Medium" as const, cat: "Compliance", mgr: "Deepa Menon", dept: "Quality Assurance", start: "2026-10-01", end: "2027-01-31", budget: 800000, completion: 0 },
    { code: "PRJ-005", name: "Battery Pack R&D", desc: "In-house battery pack design and testing", status: "Active" as const, priority: "Critical" as const, cat: "R&D", mgr: "Lakshmi Prasad", dept: "Research & Development", start: "2026-03-01", end: "2027-03-31", budget: 12000000, completion: 35 },
    { code: "PRJ-006", name: "Dealer Network Expansion — South India", desc: "Establish 15 new dealership points across South India", status: "Completed" as const, priority: "Medium" as const, cat: "Business Development", mgr: "Vikram Reddy", dept: "Sales & Marketing", start: "2025-06-01", end: "2026-06-30", budget: 8000000, completion: 100 },
  ];
  const prjMap: Record<string, string> = {};
  for (const p of projectsData) {
    const prj = await prisma.project.upsert({
      where: { projectCode: p.code },
      update: {},
      create: {
        projectCode: p.code,
        name: p.name,
        description: p.desc,
        status: p.status,
        priority: p.priority,
        category: p.cat,
        projectManager: p.mgr,
        department: p.dept,
        startDate: new Date(p.start),
        endDate: new Date(p.end),
        budget: p.budget,
        completion: p.completion,
      },
    });
    prjMap[p.code] = prj.id;
  }
  console.log(`  ✅ ${projectsData.length} projects seeded`);

  // --- Project Tasks & Milestones for PRJ-001 ---
  const ms1 = await prisma.milestone.upsert({ where: { milestoneCode: "MS-001-01" }, update: {}, create: { milestoneCode: "MS-001-01", name: "Design Freeze", projectId: prjMap["PRJ-001"], dueDate: new Date("2026-06-30"), status: "Completed", completedDate: new Date("2026-06-25"), owner: "Arun Kumar" } });
  const ms2 = await prisma.milestone.upsert({ where: { milestoneCode: "MS-001-02" }, update: {}, create: { milestoneCode: "MS-001-02", name: "Prototype Build", projectId: prjMap["PRJ-001"], dueDate: new Date("2026-09-30"), status: "InProgress", owner: "Sankaranarayanan R" } });
  await prisma.milestone.upsert({ where: { milestoneCode: "MS-001-03" }, update: {}, create: { milestoneCode: "MS-001-03", name: "Validation & Testing", projectId: prjMap["PRJ-001"], dueDate: new Date("2026-11-30"), status: "Upcoming", owner: "Deepa Menon" } });

  const tasksData = [
    { code: "TSK-001", title: "SiC MOSFET gate driver schematic", status: "Done" as const, priority: "Critical" as const, assignee: "EMP-001", ms: ms1.id, start: "2026-04-01", due: "2026-05-15", est: 120, actual: 115 },
    { code: "TSK-002", title: "PCB layout for V2 controller", status: "Done" as const, priority: "High" as const, assignee: "EMP-014", ms: ms1.id, start: "2026-05-01", due: "2026-06-15", est: 160, actual: 145 },
    { code: "TSK-003", title: "Thermal simulation analysis", status: "InProgress" as const, priority: "High" as const, assignee: "EMP-001", ms: ms2.id, start: "2026-07-01", due: "2026-08-15", est: 80, actual: 55 },
    { code: "TSK-004", title: "Prototype assembly and bring-up", status: "InProgress" as const, priority: "Critical" as const, assignee: "EMP-014", ms: ms2.id, start: "2026-08-01", due: "2026-09-15", est: 200, actual: 90 },
    { code: "TSK-005", title: "EMC pre-compliance testing", status: "Todo" as const, priority: "Medium" as const, assignee: "EMP-017", ms: ms2.id, start: "2026-09-01", due: "2026-09-30", est: 60, actual: 0 },
    { code: "TSK-006", title: "Firmware integration testing", status: "Todo" as const, priority: "High" as const, assignee: "EMP-009", ms: ms2.id, start: "2026-09-15", due: "2026-10-15", est: 100, actual: 0 },
  ];
  for (const t of tasksData) {
    await prisma.projectTask.upsert({
      where: { taskCode: t.code },
      update: {},
      create: {
        taskCode: t.code,
        title: t.title,
        status: t.status,
        priority: t.priority,
        projectId: prjMap["PRJ-001"],
        assigneeId: empMap[t.assignee],
        assigneeName: employeesData.find((e) => e.code === t.assignee)!.first + " " + employeesData.find((e) => e.code === t.assignee)!.last,
        milestoneId: t.ms,
        startDate: new Date(t.start),
        dueDate: new Date(t.due),
        estimatedHours: t.est,
        actualHours: t.actual > 0 ? t.actual : undefined,
        completedDate: t.status === "Done" ? new Date(t.due) : undefined,
      },
    });
  }
  console.log(`  ✅ ${tasksData.length} project tasks + 3 milestones seeded`);

  // --- Policies ---
  const policiesData = [
    { code: "POL-001", title: "Information Security Policy", cat: "IT Security", dept: "IT", owner: "Karthik Rajan", eff: "2025-01-01", rev: "2026-12-31" },
    { code: "POL-002", title: "Employee Code of Conduct", cat: "HR", dept: "Human Resources", owner: "Kavitha Sundaram", eff: "2024-06-01", rev: "2026-06-01" },
    { code: "POL-003", title: "Quality Management Policy", cat: "Quality", dept: "Quality Assurance", owner: "Deepa Menon", eff: "2025-03-15", rev: "2027-03-15" },
    { code: "POL-004", title: "Environmental, Health & Safety Policy", cat: "EHS", dept: "Manufacturing", owner: "Rajesh Iyer", eff: "2025-01-01", rev: "2026-12-31" },
    { code: "POL-005", title: "Anti-Bribery & Corruption Policy", cat: "Compliance", dept: "Legal & Compliance", owner: "Advocate Shanthi", eff: "2024-01-01", rev: "2026-01-01" },
    { code: "POL-006", title: "Data Protection & Privacy Policy", cat: "IT Security", dept: "IT", owner: "Karthik Rajan", eff: "2025-06-01", rev: "2027-06-01" },
  ];
  for (const p of policiesData) {
    await prisma.policy.upsert({
      where: { policyCode: p.code },
      update: {},
      create: {
        policyCode: p.code,
        title: p.title,
        category: p.cat,
        department: p.dept,
        owner: p.owner,
        effectiveDate: new Date(p.eff),
        reviewDate: new Date(p.rev),
        status: "Active",
        version: "1.0",
      },
    });
  }
  console.log(`  ✅ ${policiesData.length} policies seeded`);

  // --- Document Controls ---
  const docsData = [
    { code: "DOC-001", title: "ISO 9001 Quality Manual", type: "Manual", cat: "Quality", dept: "Quality Assurance", owner: "Deepa Menon", status: "Published" as const },
    { code: "DOC-002", title: "Employee Onboarding Checklist", type: "Checklist", cat: "HR", dept: "Human Resources", owner: "Kavitha Sundaram", status: "Published" as const },
    { code: "DOC-003", title: "Vendor Evaluation Procedure", type: "Procedure", cat: "Procurement", dept: "Procurement", owner: "Suresh Babu", status: "Published" as const },
    { code: "DOC-004", title: "IT Disaster Recovery Plan", type: "Plan", cat: "IT", dept: "IT", owner: "Karthik Rajan", status: "InReview" as const },
    { code: "DOC-005", title: "Manufacturing Process Control Plan", type: "Plan", cat: "Manufacturing", dept: "Manufacturing", owner: "Rajesh Iyer", status: "Published" as const },
    { code: "DOC-006", title: "Financial Reporting Guidelines", type: "Guideline", cat: "Finance", dept: "Finance & Accounting", owner: "Priya Nair", status: "Draft" as const },
  ];
  for (const d of docsData) {
    await prisma.documentControl.upsert({
      where: { documentCode: d.code },
      update: {},
      create: {
        documentCode: d.code,
        title: d.title,
        type: d.type,
        category: d.cat,
        department: d.dept,
        owner: d.owner,
        status: d.status,
        version: "1.0",
        accessLevel: "Internal",
        effectiveDate: new Date("2025-01-01"),
      },
    });
  }
  console.log(`  ✅ ${docsData.length} document controls seeded`);

  // --- Approval Matrices ---
  const approvalData = [
    { code: "APM-001", module: "Purchase Order", txn: "Create", min: 0, max: 100000, role: "Manager", name: "Suresh Babu", level: 1 },
    { code: "APM-002", module: "Purchase Order", txn: "Create", min: 100000, max: 500000, role: "Senior Manager", name: "Rajesh Iyer", level: 2 },
    { code: "APM-003", module: "Purchase Order", txn: "Create", min: 500000, max: null, role: "Director", name: "Lakshmi Prasad", level: 3 },
    { code: "APM-004", module: "Journal Entry", txn: "Post", min: 0, max: 1000000, role: "Finance Manager", name: "Priya Nair", level: 1 },
    { code: "APM-005", module: "Journal Entry", txn: "Post", min: 1000000, max: null, role: "CFO", name: "CFO", level: 2 },
    { code: "APM-006", module: "Leave Request", txn: "Approve", min: null, max: null, role: "Reporting Manager", name: null, level: 1 },
    { code: "APM-007", module: "Sales Order", txn: "Create", min: 0, max: 500000, role: "Sales Manager", name: "Vikram Reddy", level: 1 },
    { code: "APM-008", module: "Sales Order", txn: "Create", min: 500000, max: null, role: "Director", name: "VP Sales", level: 2 },
  ];
  for (const a of approvalData) {
    await prisma.approvalMatrix.upsert({
      where: { matrixCode: a.code },
      update: {},
      create: {
        matrixCode: a.code,
        module: a.module,
        transactionType: a.txn,
        minAmount: a.min,
        maxAmount: a.max,
        approverRole: a.role,
        approverName: a.name,
        level: a.level,
        isActive: true,
      },
    });
  }
  console.log(`  ✅ ${approvalData.length} approval matrix rules seeded`);

  // --- CAPA Records ---
  const capaData = [
    { num: "CAPA-001", title: "Motor winding insulation failure in field returns", type: "Corrective" as const, status: "ActionInProgress" as const, priority: "Critical" as const, source: "Customer Complaint", dept: "Quality Assurance", assigned: "Deepa Menon", initiated: "Rajesh Iyer", problem: "3 field returns in Q2 showed insulation breakdown at 85°C ambient", rootCause: "Varnish curing temperature below spec in Station 4", target: "2026-10-15" },
    { num: "CAPA-002", title: "Incoming battery cell capacity variance > 5%", type: "Preventive" as const, status: "RootCauseIdentified" as const, priority: "High" as const, source: "Incoming Inspection", dept: "Quality Assurance", assigned: "Revathi Srinivasan", initiated: "Deepa Menon", problem: "Batch B-2026-089 showed 6.2% capacity variance vs spec 3%", rootCause: "Supplier process drift in electrode coating thickness", target: "2026-10-30" },
    { num: "CAPA-003", title: "Prevent PCB solder bridge defects in SMT line", type: "Preventive" as const, status: "Open" as const, priority: "Medium" as const, source: "Internal Audit", dept: "Manufacturing", assigned: "Anand Selvam", initiated: "Rajesh Iyer", problem: "Increasing trend of solder bridge defects (1.8% to 2.5% over 3 months)", rootCause: null, target: "2026-11-15" },
  ];
  for (const c of capaData) {
    await prisma.capaRecord.upsert({
      where: { capaNumber: c.num },
      update: {},
      create: {
        capaNumber: c.num,
        title: c.title,
        type: c.type,
        status: c.status,
        priority: c.priority,
        source: c.source,
        department: c.dept,
        assignedTo: c.assigned,
        initiatedBy: c.initiated,
        problemStatement: c.problem,
        rootCause: c.rootCause,
        targetDate: new Date(c.target),
      },
    });
  }
  console.log(`  ✅ ${capaData.length} CAPA records seeded`);

  // --- NCR Records ---
  const ncrData = [
    { num: "NCR-001", title: "Battery pack housing dimensional non-conformance", desc: "Housing width 2mm over tolerance on 15 units from Batch H-2026-045", severity: "Major", cat: "Dimensional", dept: "Manufacturing", detected: "Deepa Menon", product: "PRD-BPHSG-001", productName: "Battery Pack Housing", batch: "H-2026-045", defect: "Dimensional", assigned: "Rajesh Iyer", target: "2026-10-01" },
    { num: "NCR-002", title: "Supplier label mismatch on resistor batch", desc: "1K resistors labeled as 4.7K in incoming shipment from BEL", severity: "Critical", cat: "Labeling", dept: "Procurement", detected: "Revathi Srinivasan", product: "EC-RES-001", productName: "SMD Resistor 1K", batch: "R-2026-112", defect: "Labeling", assigned: "Suresh Babu", target: "2026-09-25" },
  ];
  for (const n of ncrData) {
    await prisma.ncrRecord.upsert({
      where: { ncrNumber: n.num },
      update: {},
      create: {
        ncrNumber: n.num,
        title: n.title,
        description: n.desc,
        severity: n.severity,
        category: n.cat,
        department: n.dept,
        detectedBy: n.detected,
        productCode: n.product,
        productName: n.productName,
        batchNumber: n.batch,
        defectType: n.defect,
        assignedTo: n.assigned,
        targetDate: new Date(n.target),
        status: "Open",
      },
    });
  }
  console.log(`  ✅ ${ncrData.length} NCR records seeded`);

  // --- Inspection Records ---
  const inspData = [
    { code: "INS-001", type: "Incoming" as const, result: "Pass" as const, date: "2026-09-01", inspector: "Revathi Srinivasan", product: "RM-STEEL-001", productName: "Cold Rolled Steel Sheet", batch: "S-2026-078", sample: 10, defects: 0, supplier: "Tata Steel Ltd", po: "PO-2026-001" },
    { code: "INS-002", type: "Incoming" as const, result: "Fail" as const, date: "2026-09-05", inspector: "Revathi Srinivasan", product: "EC-RES-001", productName: "SMD Resistor 1K", batch: "R-2026-112", sample: 50, defects: 50, supplier: "Bharat Electronics Ltd", po: "PO-2026-002" },
    { code: "INS-003", type: "InProcess" as const, result: "Pass" as const, date: "2026-09-10", inspector: "Deepa Menon", product: "PRD-MC-001", productName: "EV Motor Controller 48V", batch: "MC-2026-034", sample: 5, defects: 0, supplier: null, po: null },
    { code: "INS-004", type: "Final" as const, result: "ConditionalPass" as const, date: "2026-09-12", inspector: "Deepa Menon", product: "PRD-BMS-001", productName: "Battery Management System", batch: "BMS-2026-012", sample: 3, defects: 1, supplier: null, po: null },
    { code: "INS-005", type: "Incoming" as const, result: "Pass" as const, date: "2026-09-15", inspector: "Revathi Srinivasan", product: "BAT-CELL-001", productName: "Li-Ion Battery Cell 21700", batch: "BC-2026-089", sample: 100, defects: 2, supplier: "Exide Industries", po: "PO-2026-003" },
  ];
  for (const i of inspData) {
    await prisma.inspectionRecord.upsert({
      where: { inspectionCode: i.code },
      update: {},
      create: {
        inspectionCode: i.code,
        type: i.type,
        result: i.result,
        inspectionDate: new Date(i.date),
        inspector: i.inspector,
        department: "Quality Assurance",
        productCode: i.product,
        productName: i.productName,
        batchNumber: i.batch,
        sampleSize: i.sample,
        defectsFound: i.defects,
        supplierName: i.supplier,
        poNumber: i.po,
        ncrRequired: i.result === "Fail",
      },
    });
  }
  console.log(`  ✅ ${inspData.length} inspection records seeded`);

  // --- Audit Logs (sample) ---
  const auditSamples = [
    { action: "CREATE", module: "Purchase Order", entity: "PurchaseOrder", entityId: "PO-2026-001", description: "Created purchase order for Tata Steel Ltd", performedBy: "Suresh Babu" },
    { action: "APPROVE", module: "Purchase Order", entity: "PurchaseOrder", entityId: "PO-2026-001", description: "Approved purchase order PO-2026-001", performedBy: "Rajesh Iyer" },
    { action: "CREATE", module: "Sales Order", entity: "SalesOrder", entityId: "SO-2026-001", description: "Created sales order for Tata Motors Ltd", performedBy: "Vikram Reddy" },
    { action: "UPDATE", module: "Employee", entity: "Employee", entityId: "EMP-001", description: "Updated employee designation", performedBy: "Kavitha Sundaram" },
    { action: "CREATE", module: "CAPA", entity: "CapaRecord", entityId: "CAPA-001", description: "Initiated CAPA for motor insulation failure", performedBy: "Rajesh Iyer" },
    { action: "APPROVE", module: "Leave Request", entity: "LeaveRequest", entityId: "LV-002", description: "Approved sick leave for Vikram Reddy", performedBy: "Kavitha Sundaram" },
  ];
  for (const a of auditSamples) {
    await prisma.auditLog.create({ data: a });
  }
  console.log(`  ✅ ${auditSamples.length} audit log entries seeded`);

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
