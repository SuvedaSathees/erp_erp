-- CreateTable
CREATE TABLE "FinanceIntegrationSetting" (
    "module" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinanceIntegrationSetting_pkey" PRIMARY KEY ("module")
);
