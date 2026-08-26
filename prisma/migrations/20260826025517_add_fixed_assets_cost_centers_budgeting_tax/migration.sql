-- CreateEnum
CREATE TYPE "FixedAssetCategory" AS ENUM ('Building', 'Machinery', 'IT_Equipment', 'Vehicles', 'Furniture', 'Others');

-- CreateEnum
CREATE TYPE "FixedAssetStatus" AS ENUM ('Active', 'Maintenance', 'FullyDepreciated', 'Disposed');

-- CreateEnum
CREATE TYPE "DepreciationRunStatus" AS ENUM ('Posted', 'Draft');

-- CreateEnum
CREATE TYPE "BudgetVersionType" AS ENUM ('Original', 'Revision', 'Forecast');

-- CreateEnum
CREATE TYPE "BudgetVersionStatus" AS ENUM ('Active', 'Draft', 'Archived');

-- CreateEnum
CREATE TYPE "CostCenterStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "CostCenterType" AS ENUM ('Operational', 'Support', 'Administrative', 'Revenue_Generating');

-- CreateEnum
CREATE TYPE "CostAllocationKey" AS ENUM ('Headcount', 'SquareFootage', 'DirectRevenue', 'DirectExpense');

-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('Operating', 'Payroll', 'Collections', 'PettyCash', 'Savings');

-- CreateEnum
CREATE TYPE "BankAccountStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "ReconciliationStatus" AS ENUM ('Reconciled', 'PartiallyReconciled', 'NotReconciled');

-- CreateEnum
CREATE TYPE "TaxObligationStatus" AS ENUM ('Paid', 'PartiallyPaid', 'DueSoon', 'Pending');

-- CreateEnum
CREATE TYPE "TaxFilingStatus" AS ENUM ('Filed', 'Draft', 'Rejected');

-- CreateEnum
CREATE TYPE "TaxPaymentStatus" AS ENUM ('Cleared', 'Processing');

-- CreateEnum
CREATE TYPE "TaxReconStatus" AS ENUM ('Reconciled', 'Mismatched');

-- CreateTable
CREATE TABLE "FixedAsset" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "assetCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "FixedAssetCategory" NOT NULL DEFAULT 'Machinery',
    "location" TEXT NOT NULL,
    "purchaseDate" TIMESTAMP(3) NOT NULL,
    "cost" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "salvageValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "usefulLifeYears" INTEGER NOT NULL DEFAULT 5,
    "depreciationMethod" TEXT NOT NULL DEFAULT 'Straight Line',
    "accumulatedDepreciation" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "netBookValue" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "FixedAssetStatus" NOT NULL DEFAULT 'Active',
    "companyId" TEXT,
    "departmentId" TEXT,
    "costCenterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepreciationRun" (
    "id" TEXT NOT NULL,
    "runNumber" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "period" TEXT NOT NULL,
    "assetsCount" INTEGER NOT NULL DEFAULT 0,
    "totalDepreciation" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "method" TEXT NOT NULL DEFAULT 'Straight Line',
    "status" "DepreciationRunStatus" NOT NULL DEFAULT 'Posted',
    "executedBy" TEXT NOT NULL,
    "fixedAssetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepreciationRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedAssetDisposal" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "disposalDate" TIMESTAMP(3) NOT NULL,
    "saleProceeds" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "accumulatedDepreciation" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "gainLoss" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "disposalReason" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Disposed',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedAssetDisposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedAssetTransfer" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL,
    "sourceLocation" TEXT NOT NULL,
    "destinationLocation" TEXT NOT NULL,
    "authorizedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedAssetTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedAssetRevaluation" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "revaluationDate" TIMESTAMP(3) NOT NULL,
    "oldNBV" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "newNBV" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "adjustment" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "reason" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedAssetRevaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedAssetAttachment" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "uploadedBy" TEXT NOT NULL,
    "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "downloadUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FixedAssetAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedAssetApprovalStep" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FixedAssetApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FixedAssetActivityLog" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FixedAssetActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetVersion" (
    "id" TEXT NOT NULL,
    "versionCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BudgetVersionType" NOT NULL DEFAULT 'Original',
    "status" "BudgetVersionStatus" NOT NULL DEFAULT 'Active',
    "totalBudget" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdBy" TEXT NOT NULL,
    "parentVersionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentBudgetRecord" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "budgetAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "actualAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "variance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "variancePct" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "utilization" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentBudgetRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCenterBudgetRecord" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "costCenter" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "budgetAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "actualAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "variance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "variancePct" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "utilization" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostCenterBudgetRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectBudgetRecord" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "project" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "budgetAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "actualAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "variance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "utilization" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" TEXT NOT NULL DEFAULT 'On Track',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectBudgetRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetAttachment" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "uploadedBy" TEXT NOT NULL,
    "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "downloadUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BudgetAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetApprovalStep" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BudgetApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetActivityLog" (
    "id" TEXT NOT NULL,
    "budgetId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BudgetActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCenterRecord" (
    "id" TEXT NOT NULL,
    "costCenterId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "manager" TEXT NOT NULL,
    "budget" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "actual" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "variance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "utilization" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "CostCenterStatus" NOT NULL DEFAULT 'Active',
    "type" "CostCenterType" NOT NULL DEFAULT 'Operational',
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostCenterRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostAllocationRule" (
    "id" TEXT NOT NULL,
    "ruleCode" TEXT NOT NULL,
    "costCenterId" TEXT NOT NULL,
    "allocationKey" "CostAllocationKey" NOT NULL DEFAULT 'Headcount',
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostAllocationRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCenterCommitment" (
    "id" TEXT NOT NULL,
    "commitmentId" TEXT NOT NULL,
    "costCenterId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "commitmentAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostCenterCommitment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCenterAttachment" (
    "id" TEXT NOT NULL,
    "costCenterId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "uploadedBy" TEXT NOT NULL,
    "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "downloadUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostCenterAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCenterApprovalStep" (
    "id" TEXT NOT NULL,
    "costCenterId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CostCenterApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CostCenterActivityLog" (
    "id" TEXT NOT NULL,
    "costCenterId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CostCenterActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccount" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "type" "BankAccountType" NOT NULL DEFAULT 'Operating',
    "accountNo" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "currentBalance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "BankAccountStatus" NOT NULL DEFAULT 'Active',
    "reconciliationStatus" "ReconciliationStatus" NOT NULL DEFAULT 'NotReconciled',
    "unreconciledAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankTransaction" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "reference" TEXT,
    "category" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Posted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankCheque" (
    "id" TEXT NOT NULL,
    "chequeNo" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "payee" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankCheque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDeposit" (
    "id" TEXT NOT NULL,
    "depositNo" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "depositDate" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankDeposit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankReconciliationRecord" (
    "id" TEXT NOT NULL,
    "reconId" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "statementDate" TIMESTAMP(3) NOT NULL,
    "statementBalance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "ledgerBalance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "unreconciledAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Not Reconciled',
    "lastReconciledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankReconciliationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccountAttachment" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "uploadedBy" TEXT NOT NULL,
    "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "downloadUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankAccountAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankAccountActivityLog" (
    "id" TEXT NOT NULL,
    "bankAccountId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankAccountActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxObligation" (
    "id" TEXT NOT NULL,
    "obligationId" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "taxLiability" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "paid" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "payable" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "TaxObligationStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxObligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxFiling" (
    "id" TEXT NOT NULL,
    "filingId" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "filingDate" TIMESTAMP(3) NOT NULL,
    "filedBy" TEXT NOT NULL,
    "returnAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "acknowledgementNo" TEXT NOT NULL,
    "status" "TaxFilingStatus" NOT NULL DEFAULT 'Draft',
    "obligationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxFiling_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPayment" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "bankAccount" TEXT NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "transactionRef" TEXT NOT NULL,
    "status" "TaxPaymentStatus" NOT NULL DEFAULT 'Processing',
    "obligationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxReconciliation" (
    "id" TEXT NOT NULL,
    "reconId" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "returnsLiability" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "booksLiability" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "difference" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "TaxReconStatus" NOT NULL DEFAULT 'Reconciled',
    "obligationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxReconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxAuthority" (
    "id" TEXT NOT NULL,
    "authorityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "taxType" TEXT NOT NULL,
    "portalUrl" TEXT,
    "contactPerson" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxAuthority_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxAttachment" (
    "id" TEXT NOT NULL,
    "obligationId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "uploadedBy" TEXT NOT NULL,
    "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "downloadUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxApprovalStep" (
    "id" TEXT NOT NULL,
    "obligationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxActivityLog" (
    "id" TEXT NOT NULL,
    "obligationId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FixedAsset_assetCode_key" ON "FixedAsset"("assetCode");

-- CreateIndex
CREATE UNIQUE INDEX "DepreciationRun_runNumber_key" ON "DepreciationRun"("runNumber");

-- CreateIndex
CREATE UNIQUE INDEX "BudgetVersion_versionCode_key" ON "BudgetVersion"("versionCode");

-- CreateIndex
CREATE UNIQUE INDEX "CostCenterRecord_code_key" ON "CostCenterRecord"("code");

-- CreateIndex
CREATE UNIQUE INDEX "CostAllocationRule_ruleCode_key" ON "CostAllocationRule"("ruleCode");

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_accountNo_key" ON "BankAccount"("accountNo");

-- CreateIndex
CREATE UNIQUE INDEX "BankTransaction_transactionId_key" ON "BankTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "BankCheque_chequeNo_key" ON "BankCheque"("chequeNo");

-- CreateIndex
CREATE UNIQUE INDEX "BankDeposit_depositNo_key" ON "BankDeposit"("depositNo");

-- CreateIndex
CREATE UNIQUE INDEX "BankReconciliationRecord_reconId_key" ON "BankReconciliationRecord"("reconId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxObligation_obligationId_key" ON "TaxObligation"("obligationId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxFiling_filingId_key" ON "TaxFiling"("filingId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxPayment_paymentId_key" ON "TaxPayment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxReconciliation_reconId_key" ON "TaxReconciliation"("reconId");

-- CreateIndex
CREATE UNIQUE INDEX "TaxAuthority_authorityId_key" ON "TaxAuthority"("authorityId");

-- AddForeignKey
ALTER TABLE "DepreciationRun" ADD CONSTRAINT "DepreciationRun_fixedAssetId_fkey" FOREIGN KEY ("fixedAssetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedAssetDisposal" ADD CONSTRAINT "FixedAssetDisposal_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedAssetTransfer" ADD CONSTRAINT "FixedAssetTransfer_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedAssetRevaluation" ADD CONSTRAINT "FixedAssetRevaluation_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedAssetAttachment" ADD CONSTRAINT "FixedAssetAttachment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedAssetApprovalStep" ADD CONSTRAINT "FixedAssetApprovalStep_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FixedAssetActivityLog" ADD CONSTRAINT "FixedAssetActivityLog_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "FixedAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetVersion" ADD CONSTRAINT "BudgetVersion_parentVersionId_fkey" FOREIGN KEY ("parentVersionId") REFERENCES "BudgetVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentBudgetRecord" ADD CONSTRAINT "DepartmentBudgetRecord_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "BudgetVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCenterBudgetRecord" ADD CONSTRAINT "CostCenterBudgetRecord_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "BudgetVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBudgetRecord" ADD CONSTRAINT "ProjectBudgetRecord_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "BudgetVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetAttachment" ADD CONSTRAINT "BudgetAttachment_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "BudgetVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetApprovalStep" ADD CONSTRAINT "BudgetApprovalStep_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "BudgetVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetActivityLog" ADD CONSTRAINT "BudgetActivityLog_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "BudgetVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCenterRecord" ADD CONSTRAINT "CostCenterRecord_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CostCenterRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostAllocationRule" ADD CONSTRAINT "CostAllocationRule_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "CostCenterRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCenterCommitment" ADD CONSTRAINT "CostCenterCommitment_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "CostCenterRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCenterAttachment" ADD CONSTRAINT "CostCenterAttachment_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "CostCenterRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCenterApprovalStep" ADD CONSTRAINT "CostCenterApprovalStep_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "CostCenterRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostCenterActivityLog" ADD CONSTRAINT "CostCenterActivityLog_costCenterId_fkey" FOREIGN KEY ("costCenterId") REFERENCES "CostCenterRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankTransaction" ADD CONSTRAINT "BankTransaction_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankCheque" ADD CONSTRAINT "BankCheque_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDeposit" ADD CONSTRAINT "BankDeposit_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankReconciliationRecord" ADD CONSTRAINT "BankReconciliationRecord_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccountAttachment" ADD CONSTRAINT "BankAccountAttachment_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankAccountActivityLog" ADD CONSTRAINT "BankAccountActivityLog_bankAccountId_fkey" FOREIGN KEY ("bankAccountId") REFERENCES "BankAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxFiling" ADD CONSTRAINT "TaxFiling_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "TaxObligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayment" ADD CONSTRAINT "TaxPayment_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "TaxObligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxReconciliation" ADD CONSTRAINT "TaxReconciliation_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "TaxObligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxAttachment" ADD CONSTRAINT "TaxAttachment_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "TaxObligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxApprovalStep" ADD CONSTRAINT "TaxApprovalStep_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "TaxObligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxActivityLog" ADD CONSTRAINT "TaxActivityLog_obligationId_fkey" FOREIGN KEY ("obligationId") REFERENCES "TaxObligation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
