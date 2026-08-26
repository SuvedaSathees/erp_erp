-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "PayableInvoiceStatus" AS ENUM ('Paid', 'DueSoon', 'Overdue', 'Canceled');

-- CreateEnum
CREATE TYPE "ReceivableInvoiceStatus" AS ENUM ('Paid', 'PartiallyPaid', 'DueSoon', 'Overdue', 'Canceled', 'CreditMemo');

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "vendorCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "paymentTerms" TEXT NOT NULL DEFAULT 'Net 30',
    "status" "VendorStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "customerCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "paymentTerms" TEXT NOT NULL DEFAULT 'Net 30',
    "status" "CustomerStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayableInvoice" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "vendorId" TEXT,
    "vendorName" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "dueAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "PayableInvoiceStatus" NOT NULL DEFAULT 'DueSoon',
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "accountCode" TEXT DEFAULT '2110',
    "companyId" TEXT,
    "fiscalYear" TEXT,
    "subtotal" DECIMAL(18,2),
    "taxAmount" DECIMAL(18,2),
    "taxRate" DOUBLE PRECISION DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayableInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayablePayment" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "paymentMethod" TEXT NOT NULL DEFAULT 'Bank Transfer',
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayablePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayableAttachment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
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

    CONSTRAINT "PayableAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayableApprovalStep" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayableApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayableActivityLog" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PayableActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceivableInvoice" (
    "id" TEXT NOT NULL,
    "invoiceNo" TEXT NOT NULL,
    "customerId" TEXT,
    "customerName" TEXT NOT NULL,
    "invoiceDate" TIMESTAMP(3) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "dueAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "ReceivableInvoiceStatus" NOT NULL DEFAULT 'DueSoon',
    "isCreditMemo" BOOLEAN NOT NULL DEFAULT false,
    "creditMemoReason" TEXT,
    "accountCode" TEXT DEFAULT '1120',
    "companyId" TEXT,
    "fiscalYear" TEXT,
    "subtotal" DECIMAL(18,2),
    "taxAmount" DECIMAL(18,2),
    "taxRate" DOUBLE PRECISION DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceivableInvoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceivableReceipt" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "paymentMethod" TEXT NOT NULL DEFAULT 'Bank Transfer',
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceivableReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceivableAttachment" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
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

    CONSTRAINT "ReceivableAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceivableActivityLog" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReceivableActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorCode_key" ON "Vendor"("vendorCode");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_name_key" ON "Vendor"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_customerCode_key" ON "Customer"("customerCode");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_name_key" ON "Customer"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PayableInvoice_invoiceNo_key" ON "PayableInvoice"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "PayablePayment_paymentId_key" ON "PayablePayment"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "ReceivableInvoice_invoiceNo_key" ON "ReceivableInvoice"("invoiceNo");

-- CreateIndex
CREATE UNIQUE INDEX "ReceivableReceipt_receiptId_key" ON "ReceivableReceipt"("receiptId");

-- AddForeignKey
ALTER TABLE "PayableInvoice" ADD CONSTRAINT "PayableInvoice_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayablePayment" ADD CONSTRAINT "PayablePayment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "PayableInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayableAttachment" ADD CONSTRAINT "PayableAttachment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "PayableInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayableApprovalStep" ADD CONSTRAINT "PayableApprovalStep_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "PayableInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayableActivityLog" ADD CONSTRAINT "PayableActivityLog_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "PayableInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivableInvoice" ADD CONSTRAINT "ReceivableInvoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivableReceipt" ADD CONSTRAINT "ReceivableReceipt_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "ReceivableInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivableAttachment" ADD CONSTRAINT "ReceivableAttachment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "ReceivableInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivableActivityLog" ADD CONSTRAINT "ReceivableActivityLog_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "ReceivableInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
