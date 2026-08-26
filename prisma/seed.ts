import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  AccountType,
  JournalType,
  JournalStatus,
  ApprovalLevel,
  ApprovalStepStatus,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Chart of Accounts extracted from src/lib/mock_gl_db.json
const ACCOUNTS_DATA = [
  { code: "1000", name: "Assets", type: AccountType.Asset, group: "Assets", currency: "INR", parentCode: null },
  { code: "1100", name: "Current Assets", type: AccountType.Asset, group: "Current Assets", currency: "INR", parentCode: "1000" },
  { code: "1110", name: "Cash and Cash Equivalents", type: AccountType.Asset, group: "Current Assets", currency: "INR", parentCode: "1100" },
  { code: "1120", name: "Accounts Receivable", type: AccountType.Asset, group: "Current Assets", currency: "INR", parentCode: "1100" },
  { code: "1130", name: "Inventory", type: AccountType.Asset, group: "Current Assets", currency: "INR", parentCode: "1100" },
  { code: "1140", name: "Prepaid Expenses", type: AccountType.Asset, group: "Current Assets", currency: "INR", parentCode: "1100" },
  { code: "1200", name: "Non-Current Assets", type: AccountType.Asset, group: "Non-Current Assets", currency: "INR", parentCode: "1000" },
  { code: "1210", name: "Property, Plant & Equipment", type: AccountType.Asset, group: "Non-Current Assets", currency: "INR", parentCode: "1200" },
  { code: "1220", name: "Accumulated Depreciation", type: AccountType.Asset, group: "Non-Current Assets", currency: "INR", parentCode: "1200" },
  { code: "1230", name: "Intangible Assets", type: AccountType.Asset, group: "Non-Current Assets", currency: "INR", parentCode: "1200" },
  { code: "1240", name: "Other Assets", type: AccountType.Asset, group: "Non-Current Assets", currency: "INR", parentCode: "1200" },
  { code: "2000", name: "Liabilities", type: AccountType.Liability, group: "Liabilities", currency: "INR", parentCode: null },
  { code: "2100", name: "Current Liabilities", type: AccountType.Liability, group: "Current Liabilities", currency: "INR", parentCode: "2000" },
  { code: "2110", name: "Accounts Payable", type: AccountType.Liability, group: "Current Liabilities", currency: "INR", parentCode: "2100" },
  { code: "2120", name: "Short-term Loans", type: AccountType.Liability, group: "Current Liabilities", currency: "INR", parentCode: "2100" },
  { code: "3000", name: "Equity", type: AccountType.Equity, group: "Equity", currency: "INR", parentCode: null },
  { code: "3100", name: "Common Stock", type: AccountType.Equity, group: "Equity", currency: "INR", parentCode: "3000" },
  { code: "3200", name: "Retained Earnings", type: AccountType.Equity, group: "Equity", currency: "INR", parentCode: "3000" },
  { code: "4000", name: "Revenue", type: AccountType.Revenue, group: "Revenue", currency: "INR", parentCode: null },
  { code: "4100", name: "Product Revenue", type: AccountType.Revenue, group: "Revenue", currency: "INR", parentCode: "4000" },
  { code: "4200", name: "Service Revenue", type: AccountType.Revenue, group: "Revenue", currency: "INR", parentCode: "4000" },
  { code: "5000", name: "Expenses", type: AccountType.Expense, group: "Expenses", currency: "INR", parentCode: null },
  { code: "5100", name: "Operating Expenses", type: AccountType.Expense, group: "Expenses", currency: "INR", parentCode: "5000" },
  { code: "5200", name: "Cost of Goods Sold", type: AccountType.Expense, group: "Expenses", currency: "INR", parentCode: "5000" },
];

// Balanced Journal Entries (Total Debit === Total Credit for every entry)
const JOURNALS_DATA = [
  {
    journalNumber: "JE-00001",
    voucherNumber: "VCH-2024-001",
    postingDate: new Date("2024-04-15"),
    accountingDate: new Date("2024-04-15"),
    fiscalYear: "FY 2024-25",
    accountingPeriod: "Apr 2024",
    journalType: JournalType.Manual,
    status: JournalStatus.Posted,
    companyId: "Magnertia Motors",
    businessUnitId: "EV Division",
    departmentId: "Commercial Operations",
    lines: [
      { accountCode: "1110", description: "Direct customer advance receipt", debit: 500000, credit: 0 },
      { accountCode: "4100", description: "Product revenue recognized for EV charger delivery", debit: 0, credit: 500000 },
    ],
  },
  {
    journalNumber: "JE-00002",
    voucherNumber: "VCH-2024-002",
    postingDate: new Date("2024-05-10"),
    accountingDate: new Date("2024-05-10"),
    fiscalYear: "FY 2024-25",
    accountingPeriod: "May 2024",
    journalType: JournalType.Manual,
    status: JournalStatus.Posted,
    companyId: "Magnertia Motors",
    businessUnitId: "Manufacturing Division",
    departmentId: "Procurement",
    lines: [
      { accountCode: "1130", description: "Raw material component stock replenishment", debit: 350000, credit: 0 },
      { accountCode: "2110", description: "Vendor invoice liability for component supply", debit: 0, credit: 350000 },
    ],
  },
  {
    journalNumber: "JE-00003",
    voucherNumber: "VCH-2024-003",
    postingDate: new Date("2024-05-28"),
    accountingDate: new Date("2024-05-28"),
    fiscalYear: "FY 2024-25",
    accountingPeriod: "May 2024",
    journalType: JournalType.Manual,
    status: JournalStatus.Posted,
    companyId: "Magnertia Motors",
    businessUnitId: "Corporate",
    departmentId: "Administration",
    lines: [
      { accountCode: "5100", description: "Office rent and cloud infrastructure expenses", debit: 120000, credit: 0 },
      { accountCode: "1110", description: "Bank transfer payment for operational overheads", debit: 0, credit: 120000 },
    ],
  },
  {
    journalNumber: "JE-00004",
    voucherNumber: "VCH-2024-004",
    postingDate: new Date("2024-06-15"),
    accountingDate: new Date("2024-06-15"),
    fiscalYear: "FY 2024-25",
    accountingPeriod: "Jun 2024",
    journalType: JournalType.Manual,
    status: JournalStatus.Posted,
    companyId: "Magnertia Motors",
    businessUnitId: "Services Division",
    departmentId: "Engineering",
    lines: [
      { accountCode: "1120", description: "Customer invoice for EV station commissioning", debit: 280000, credit: 0 },
      { accountCode: "4200", description: "Service revenue accrued from turnkey installations", debit: 0, credit: 280000 },
    ],
  },
  {
    journalNumber: "JE-00005",
    voucherNumber: "VCH-2024-005",
    postingDate: new Date("2024-06-30"),
    accountingDate: new Date("2024-06-30"),
    fiscalYear: "FY 2024-25",
    accountingPeriod: "Jun 2024",
    journalType: JournalType.Manual,
    status: JournalStatus.Posted,
    companyId: "Magnertia Motors",
    businessUnitId: "Corporate",
    departmentId: "Finance",
    lines: [
      { accountCode: "1110", description: "Inward customer NEFT settlement received", debit: 200000, credit: 0 },
      { accountCode: "1120", description: "Receivable cleared against invoice #INV-9821", debit: 0, credit: 200000 },
    ],
  },
  {
    journalNumber: "JE-00006",
    voucherNumber: "VCH-2024-006",
    postingDate: new Date("2024-07-10"),
    accountingDate: new Date("2024-07-10"),
    fiscalYear: "FY 2024-25",
    accountingPeriod: "Jul 2024",
    journalType: JournalType.Manual,
    status: JournalStatus.Posted,
    companyId: "Magnertia Motors",
    businessUnitId: "Corporate",
    departmentId: "Finance",
    lines: [
      { accountCode: "2110", description: "Supplier invoice payout via bank RTGS", debit: 150000, credit: 0 },
      { accountCode: "1110", description: "Disbursement from HDFC Operating Account", debit: 0, credit: 150000 },
    ],
  },
  {
    journalNumber: "JE-00007",
    voucherNumber: "VCH-2024-007",
    postingDate: new Date("2024-08-01"),
    accountingDate: new Date("2024-08-01"),
    fiscalYear: "FY 2024-25",
    accountingPeriod: "Aug 2024",
    journalType: JournalType.Manual,
    status: JournalStatus.Posted,
    companyId: "Magnertia Motors",
    businessUnitId: "Manufacturing Division",
    departmentId: "Operations",
    lines: [
      { accountCode: "1210", description: "SMT Assembly Line Testing & Calibration Rig", debit: 800000, credit: 0 },
      { accountCode: "1110", description: "Down payment via corporate bank transfer", debit: 0, credit: 400000 },
      { accountCode: "2120", description: "Equipment loan financing liability", debit: 0, credit: 400000 },
    ],
  },
  {
    journalNumber: "JE-00008",
    voucherNumber: "VCH-2024-008",
    postingDate: new Date("2024-08-15"),
    accountingDate: new Date("2024-08-15"),
    fiscalYear: "FY 2024-25",
    accountingPeriod: "Aug 2024",
    journalType: JournalType.Manual,
    status: JournalStatus.Posted,
    companyId: "Magnertia Motors",
    businessUnitId: "Manufacturing Division",
    departmentId: "Operations",
    lines: [
      { accountCode: "5200", description: "Cost of goods sold expensed for shipped batch", debit: 175000, credit: 0 },
      { accountCode: "1130", description: "Inventory consumption credit", debit: 0, credit: 175000 },
    ],
  },
];

async function main() {
  console.log("🌱 Starting baseline Chart of Accounts and Journal seed...");

  // 1. Pass 1: Upsert all accounts without parent relations
  const accountMap = new Map<string, string>();

  for (const acc of ACCOUNTS_DATA) {
    const record = await prisma.account.upsert({
      where: { code: acc.code },
      update: {
        name: acc.name,
        type: acc.type,
        group: acc.group,
        currency: acc.currency,
        isActive: true,
      },
      create: {
        code: acc.code,
        name: acc.name,
        type: acc.type,
        group: acc.group,
        currency: acc.currency,
        isActive: true,
      },
    });
    accountMap.set(acc.code, record.id);
  }
  console.log(`✅ Upserted ${ACCOUNTS_DATA.length} accounts into Chart of Accounts.`);

  // 2. Pass 2: Link parent-child hierarchy
  for (const acc of ACCOUNTS_DATA) {
    if (acc.parentCode && accountMap.has(acc.parentCode)) {
      const parentId = accountMap.get(acc.parentCode)!;
      await prisma.account.update({
        where: { code: acc.code },
        data: { parentAccountId: parentId },
      });
    }
  }
  console.log("✅ Linked parent/child account hierarchy.");

  // 3. Insert balanced Journal Entries with Lines and Approval Steps
  for (const j of JOURNALS_DATA) {
    const totalDebit = j.lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = j.lines.reduce((s, l) => s + l.credit, 0);
    if (totalDebit !== totalCredit) {
      throw new Error(`Unbalanced Journal ${j.journalNumber}: Debit=${totalDebit}, Credit=${totalCredit}`);
    }

    const existing = await prisma.journal.findUnique({
      where: { journalNumber: j.journalNumber },
    });
    if (existing) {
      await prisma.journal.delete({ where: { id: existing.id } });
    }

    await prisma.journal.create({
      data: {
        journalNumber: j.journalNumber,
        voucherNumber: j.voucherNumber,
        postingDate: j.postingDate,
        accountingDate: j.accountingDate,
        fiscalYear: j.fiscalYear,
        accountingPeriod: j.accountingPeriod,
        journalType: j.journalType,
        status: j.status,
        companyId: j.companyId,
        businessUnitId: j.businessUnitId,
        departmentId: j.departmentId,
        lines: {
          create: j.lines.map((l, index) => {
            const accountId = accountMap.get(l.accountCode);
            if (!accountId) throw new Error(`Account code ${l.accountCode} not found in map.`);
            return {
              accountId,
              description: l.description,
              debit: l.debit,
              credit: l.credit,
              lineNumber: index + 1,
            };
          }),
        },
        approvalSteps: {
          create: [
            {
              level: ApprovalLevel.Accountant,
              approverName: "Priya Sharma",
              status: ApprovalStepStatus.Approved,
              date: j.postingDate,
            },
            {
              level: ApprovalLevel.FinanceManager,
              approverName: "Amit Mehra",
              status: ApprovalStepStatus.Approved,
              date: j.postingDate,
            },
            {
              level: ApprovalLevel.FinancialController,
              approverName: "Vikram Malhotra",
              status: ApprovalStepStatus.Approved,
              date: j.postingDate,
            },
          ],
        },
      },
    });
  }

  console.log(`✅ Seeded ${JOURNALS_DATA.length} balanced journals with lines and approval steps.`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
