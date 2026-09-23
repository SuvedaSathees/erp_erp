-- CreateTable
CREATE TABLE "DevelopmentRecord" (
    "id" TEXT NOT NULL,
    "moduleType" TEXT NOT NULL,
    "recordCode" TEXT NOT NULL,
    "formCode" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "workflowStatus" TEXT NOT NULL DEFAULT 'Draft',
    "stage" INTEGER NOT NULL DEFAULT 1,
    "priority" TEXT NOT NULL DEFAULT 'Medium',
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "businessUnit" TEXT,
    "department" TEXT,
    "formData" JSONB NOT NULL DEFAULT '{}',
    "sectionScores" JSONB NOT NULL DEFAULT '{}',
    "aiAssessment" JSONB NOT NULL DEFAULT '{}',
    "overallScore" INTEGER NOT NULL DEFAULT 0,
    "recommendation" TEXT,
    "approvalDecision" TEXT,
    "approvalDate" TIMESTAMP(3),
    "reviewComments" TEXT,
    "nextReviewDate" TIMESTAMP(3),
    "effectiveDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentAttachment" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL DEFAULT 'General',
    "version" TEXT NOT NULL DEFAULT 'v1.0',
    "uploadedBy" TEXT NOT NULL,
    "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "downloadUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevelopmentAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentApproval" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DevelopmentApproval_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DevelopmentActivityLog" (
    "id" TEXT NOT NULL,
    "recordId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DevelopmentActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DevelopmentRecord_recordCode_key" ON "DevelopmentRecord"("recordCode");

-- CreateIndex
CREATE INDEX "DevelopmentRecord_moduleType_workflowStatus_idx" ON "DevelopmentRecord"("moduleType", "workflowStatus");

-- CreateIndex
CREATE INDEX "DevelopmentRecord_moduleType_idx" ON "DevelopmentRecord"("moduleType");

-- AddForeignKey
ALTER TABLE "DevelopmentAttachment" ADD CONSTRAINT "DevelopmentAttachment_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DevelopmentRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentApproval" ADD CONSTRAINT "DevelopmentApproval_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DevelopmentRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevelopmentActivityLog" ADD CONSTRAINT "DevelopmentActivityLog_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "DevelopmentRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
