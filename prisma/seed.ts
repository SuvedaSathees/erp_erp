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

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
