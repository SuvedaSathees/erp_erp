-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Asset', 'Liability', 'Equity', 'Revenue', 'Expense');

-- CreateEnum
CREATE TYPE "JournalType" AS ENUM ('Manual', 'Automatic', 'Recurring', 'Reversing');

-- CreateEnum
CREATE TYPE "JournalStatus" AS ENUM ('Draft', 'Approved', 'Posted', 'Closed', 'Reversed');

-- CreateEnum
CREATE TYPE "ApprovalLevel" AS ENUM ('Accountant', 'FinanceManager', 'FinancialController', 'CFO', 'CEO');

-- CreateEnum
CREATE TYPE "ApprovalStepStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateEnum
CREATE TYPE "JigWorkflowStatus" AS ENUM ('Draft', 'InProgress', 'UnderReview', 'RevisionRequired', 'Approved', 'ProductionRelease');

-- CreateEnum
CREATE TYPE "JigPriority" AS ENUM ('Low', 'Medium', 'High', 'Critical');

-- CreateEnum
CREATE TYPE "JigCategory" AS ENUM ('DrillingJig', 'WeldingJig', 'TappingJig', 'ReamingJig', 'BoringJig', 'MillingJig', 'InspectionJig', 'AssemblyJig', 'RoboticJig', 'ModularJig', 'SpecialPurposeJig');

-- CreateEnum
CREATE TYPE "JigDecision" AS ENUM ('Pending', 'Approved', 'ApprovedWithConditions', 'RevisionRequired', 'OnHold', 'Rejected');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentAccountId" TEXT,
    "type" "AccountType" NOT NULL,
    "group" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Journal" (
    "id" TEXT NOT NULL,
    "journalNumber" TEXT NOT NULL,
    "voucherNumber" TEXT,
    "postingDate" TIMESTAMP(3) NOT NULL,
    "accountingDate" TIMESTAMP(3) NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "accountingPeriod" TEXT NOT NULL,
    "journalType" "JournalType" NOT NULL DEFAULT 'Manual',
    "status" "JournalStatus" NOT NULL DEFAULT 'Draft',
    "companyId" TEXT,
    "businessUnitId" TEXT,
    "divisionId" TEXT,
    "branchId" TEXT,
    "costCenterId" TEXT,
    "profitCenterId" TEXT,
    "projectId" TEXT,
    "departmentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JournalLine" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "description" TEXT,
    "debit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "credit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "lineNumber" INTEGER NOT NULL,

    CONSTRAINT "JournalLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalStep" (
    "id" TEXT NOT NULL,
    "journalId" TEXT NOT NULL,
    "level" "ApprovalLevel" NOT NULL,
    "approverName" TEXT NOT NULL,
    "status" "ApprovalStepStatus" NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),

    CONSTRAINT "ApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JigDevelopment" (
    "id" TEXT NOT NULL,
    "jigId" TEXT NOT NULL,
    "formCode" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "jigVersion" TEXT NOT NULL DEFAULT 'v1.0.0',
    "workflowStatus" "JigWorkflowStatus" NOT NULL DEFAULT 'Draft',
    "stage" INTEGER NOT NULL DEFAULT 1,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "linkedProductId" TEXT,
    "linkedProductName" TEXT,
    "linkedProcessId" TEXT,
    "linkedProcessName" TEXT,
    "engineerName" TEXT NOT NULL,
    "engineerEmail" TEXT,
    "engineerAvatar" TEXT,
    "jigNumber" TEXT NOT NULL,
    "manufacturingPlant" TEXT NOT NULL,
    "productionLine" TEXT,
    "workstation" TEXT,
    "nextReviewDate" TIMESTAMP(3),
    "jigName" TEXT NOT NULL,
    "jigCategory" "JigCategory" NOT NULL,
    "productFamily" TEXT,
    "jigPurpose" TEXT NOT NULL,
    "developmentStage" TEXT NOT NULL DEFAULT 'Jig Concept',
    "priority" "JigPriority" NOT NULL DEFAULT 'Medium',
    "riskLevel" TEXT NOT NULL DEFAULT 'Low',
    "healthIndex" INTEGER NOT NULL DEFAULT 100,
    "cadModel" TEXT,
    "assemblyDrawing" TEXT,
    "detailDrawings" TEXT,
    "bom" TEXT,
    "locatorDesign" TEXT,
    "clampDesign" TEXT,
    "materialSpecification" TEXT,
    "surfaceFinish" TEXT,
    "designReviewScore" INTEGER NOT NULL DEFAULT 0,
    "manufacturingProcess" TEXT,
    "cncProgram" TEXT,
    "machineAllocation" TEXT,
    "materialRequirements" TEXT,
    "heatTreatment" BOOLEAN NOT NULL DEFAULT false,
    "surfaceTreatment" TEXT,
    "manufacturingLeadTime" INTEGER NOT NULL DEFAULT 0,
    "manufacturingReadinessScore" INTEGER NOT NULL DEFAULT 0,
    "trialJig" BOOLEAN NOT NULL DEFAULT false,
    "dimensionalInspection" BOOLEAN NOT NULL DEFAULT false,
    "positioningAccuracy" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "repeatabilityTest" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "processCapabilityCp" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "processCapabilityCpk" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "safetyValidation" BOOLEAN NOT NULL DEFAULT false,
    "validationRemarks" TEXT,
    "validationScore" INTEGER NOT NULL DEFAULT 0,
    "installationCompleted" BOOLEAN NOT NULL DEFAULT false,
    "processIntegration" BOOLEAN NOT NULL DEFAULT false,
    "operatorTraining" BOOLEAN NOT NULL DEFAULT false,
    "maintenancePlan" TEXT,
    "calibrationSchedule" TEXT,
    "productionApproval" BOOLEAN NOT NULL DEFAULT false,
    "commissioningScore" INTEGER NOT NULL DEFAULT 0,
    "jigLifeCycles" INTEGER NOT NULL DEFAULT 500000,
    "productionCycles" INTEGER NOT NULL DEFAULT 0,
    "toolWearPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "downtimeHoursPerMonth" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "mtbfHours" INTEGER NOT NULL DEFAULT 720,
    "mttrHours" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "oeeContribution" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "performanceScore" INTEGER NOT NULL DEFAULT 0,
    "aiEngineeringScore" INTEGER NOT NULL DEFAULT 0,
    "overallReadinessScore" INTEGER NOT NULL DEFAULT 0,
    "recommendation" TEXT NOT NULL DEFAULT 'Approve for Production',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JigDevelopment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JigAttachment" (
    "id" TEXT NOT NULL,
    "jigId" TEXT NOT NULL,
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

    CONSTRAINT "JigAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JigApprovalStep" (
    "id" TEXT NOT NULL,
    "jigId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" "JigDecision" NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JigApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JigActivityLog" (
    "id" TEXT NOT NULL,
    "jigId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JigActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JigAiAssessment" (
    "id" TEXT NOT NULL,
    "jigId" TEXT NOT NULL,
    "feasibilityIndex" INTEGER NOT NULL DEFAULT 88,
    "manufacturabilityIndex" INTEGER NOT NULL DEFAULT 85,
    "toleranceStackRisk" TEXT NOT NULL DEFAULT 'Low Risk',
    "costOptimizationNotes" TEXT NOT NULL,
    "complianceCheckPassed" BOOLEAN NOT NULL DEFAULT true,
    "toolPathOptimization" TEXT NOT NULL,
    "wearPrediction" TEXT NOT NULL,
    "failurePrediction" TEXT NOT NULL,
    "maintenanceRecommendation" TEXT NOT NULL,
    "costOptimizationPercentage" INTEGER NOT NULL DEFAULT 7,
    "aiEngineeringScore" INTEGER NOT NULL DEFAULT 89,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JigAiAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryLayout" (
    "id" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    "formCode" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "layoutVersion" TEXT NOT NULL DEFAULT 'v1.2.0',
    "workflowStatus" TEXT NOT NULL DEFAULT 'In Progress',
    "stage" INTEGER NOT NULL DEFAULT 3,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "plantName" TEXT NOT NULL,
    "facilityLocation" TEXT NOT NULL,
    "engineerName" TEXT NOT NULL,
    "totalLandArea" DOUBLE PRECISION NOT NULL DEFAULT 120000.0,
    "builtUpArea" DOUBLE PRECISION NOT NULL DEFAULT 45000.0,
    "productionCapacity" INTEGER NOT NULL DEFAULT 250000,
    "nextReviewDate" TIMESTAMP(3),
    "factoryName" TEXT NOT NULL,
    "plantType" TEXT NOT NULL DEFAULT 'Greenfield Factory',
    "industrySegment" TEXT NOT NULL DEFAULT 'Electric Vehicles',
    "factoryObjective" TEXT NOT NULL,
    "developmentStage" TEXT NOT NULL DEFAULT 'Detailed Layout',
    "priority" TEXT NOT NULL DEFAULT 'High',
    "layoutPlanningScore" INTEGER NOT NULL DEFAULT 88,
    "masterLayoutDrawing" TEXT,
    "shopFloorLayout" TEXT,
    "productionLineLayout" TEXT,
    "utilityLayout" TEXT,
    "materialFlowDiagram" TEXT,
    "equipmentLayout" TEXT,
    "warehouseLayout" TEXT,
    "officeLayout" TEXT,
    "infrastructureScore" INTEGER NOT NULL DEFAULT 86,
    "productionAreas" TEXT,
    "assemblyAreas" TEXT,
    "warehouseCapacityM2" DOUBLE PRECISION NOT NULL DEFAULT 8500.0,
    "loadingUnloadingBays" INTEGER NOT NULL DEFAULT 6,
    "utilitySystems" TEXT,
    "maintenanceWorkshop" BOOLEAN NOT NULL DEFAULT true,
    "logisticsScore" INTEGER NOT NULL DEFAULT 85,
    "rawMaterialFlow" TEXT,
    "wipFlow" TEXT,
    "finishedGoodsFlow" TEXT,
    "forkliftRoutes" TEXT,
    "agvAmrRoutes" TEXT,
    "materialHandlingEq" TEXT,
    "utilitySafetyScore" INTEGER NOT NULL DEFAULT 88,
    "electricalLayout" TEXT,
    "compressedAirLayout" TEXT,
    "waterLayout" TEXT,
    "fireSafetyLayout" TEXT,
    "emergencyExitPlan" TEXT,
    "ehsCompliance" BOOLEAN NOT NULL DEFAULT true,
    "factoryEfficiencyScore" INTEGER NOT NULL DEFAULT 87,
    "spaceUtilization" DOUBLE PRECISION NOT NULL DEFAULT 78.0,
    "materialTravelDistance" DOUBLE PRECISION NOT NULL DEFAULT 1.62,
    "throughputUnitsPerYear" INTEGER NOT NULL DEFAULT 250000,
    "warehouseEfficiency" DOUBLE PRECISION NOT NULL DEFAULT 92.0,
    "energyEfficiency" DOUBLE PRECISION NOT NULL DEFAULT 86.0,
    "equipmentAccessibility" DOUBLE PRECISION NOT NULL DEFAULT 90.0,
    "aiFactoryScore" INTEGER NOT NULL DEFAULT 89,
    "overallReadinessScore" INTEGER NOT NULL DEFAULT 87,
    "recommendation" TEXT NOT NULL DEFAULT 'Approve Factory Layout',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryLayout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryAttachment" (
    "id" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
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

    CONSTRAINT "FactoryAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryApprovalStep" (
    "id" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryActivityLog" (
    "id" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactoryActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactoryAiAssessment" (
    "id" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    "layoutOptimization" TEXT NOT NULL,
    "bottleneckPrediction" TEXT NOT NULL,
    "materialFlowOptimization" TEXT NOT NULL,
    "capacityExpansionRec" TEXT NOT NULL,
    "safetyImprovementRec" TEXT NOT NULL,
    "aiFactoryScore" INTEGER NOT NULL DEFAULT 89,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FactoryAiAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FactorySimulation" (
    "id" TEXT NOT NULL,
    "layoutId" TEXT NOT NULL,
    "simulationType" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Completed',
    "resultSummary" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT true,
    "runDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FactorySimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacityPlanning" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "formCode" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "planningVersion" TEXT NOT NULL DEFAULT 'v1.2.0',
    "workflowStatus" TEXT NOT NULL DEFAULT 'In Progress',
    "stage" INTEGER NOT NULL DEFAULT 2,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "plantName" TEXT NOT NULL,
    "businessUnit" TEXT NOT NULL,
    "engineerName" TEXT NOT NULL,
    "planningPeriod" TEXT NOT NULL DEFAULT 'Jul 2024 - Jun 2025',
    "developmentStage" TEXT NOT NULL DEFAULT 'Capacity Assessment',
    "nextReviewDate" TIMESTAMP(3),
    "demandForecastUnits" INTEGER NOT NULL DEFAULT 120000,
    "plannedProductionUnits" INTEGER NOT NULL DEFAULT 118000,
    "capacityUtilization" DOUBLE PRECISION NOT NULL DEFAULT 78.0,
    "oeePercentage" DOUBLE PRECISION NOT NULL DEFAULT 82.0,
    "bottleneckCount" INTEGER NOT NULL DEFAULT 2,
    "assessmentScore" INTEGER NOT NULL DEFAULT 88,
    "resourceScore" INTEGER NOT NULL DEFAULT 86,
    "bottleneckScore" INTEGER NOT NULL DEFAULT 85,
    "simulationScore" INTEGER NOT NULL DEFAULT 86,
    "performanceScore" INTEGER NOT NULL DEFAULT 84,
    "aiCapacityScore" INTEGER NOT NULL DEFAULT 88,
    "overallReadinessScore" INTEGER NOT NULL DEFAULT 87,
    "recommendation" TEXT NOT NULL DEFAULT 'Approve Capacity Plan',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapacityPlanning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacityAttachment" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
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

    CONSTRAINT "CapacityAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacityApprovalStep" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapacityApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacityActivityLog" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapacityActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacityAiAssessment" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "demandForecastInsight" TEXT NOT NULL,
    "capacityOptimization" TEXT NOT NULL,
    "bottleneckPrediction" TEXT NOT NULL,
    "expansionRecommendation" TEXT NOT NULL,
    "workforceOptimization" TEXT NOT NULL,
    "aiCapacityScore" INTEGER NOT NULL DEFAULT 88,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapacityAiAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapacitySimulation" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "scenarioName" TEXT NOT NULL,
    "simulationScore" INTEGER NOT NULL DEFAULT 86,
    "expansionRequirement" TEXT NOT NULL,
    "passed" BOOLEAN NOT NULL DEFAULT true,
    "runDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CapacitySimulation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BottleneckAnalysis" (
    "id" TEXT NOT NULL,
    "planningId" TEXT NOT NULL,
    "workstation" TEXT NOT NULL,
    "equipment" TEXT NOT NULL,
    "constraint" TEXT NOT NULL,
    "impact" TEXT NOT NULL DEFAULT 'High',
    "rootCause" TEXT,
    "improvementActions" TEXT,
    "estimatedGain" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BottleneckAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkInstruction" (
    "id" TEXT NOT NULL,
    "instructionId" TEXT NOT NULL,
    "formCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL DEFAULT 'WI-MAG-ACCU-001',
    "revision" TEXT NOT NULL DEFAULT '2.0',
    "workflowStatus" TEXT NOT NULL DEFAULT 'In Review',
    "stage" INTEGER NOT NULL DEFAULT 2,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveDate" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "lastModified" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "plantName" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "processOwner" TEXT NOT NULL,
    "workstation" TEXT NOT NULL DEFAULT 'WS-ACCU-01',
    "productionLine" TEXT NOT NULL DEFAULT 'Line-ACCU-01',
    "productFamily" TEXT NOT NULL DEFAULT 'AC Charger',
    "productModel" TEXT NOT NULL DEFAULT 'ACCU-7KW V1.0',
    "processName" TEXT NOT NULL DEFAULT 'Control Unit Assembly',
    "operationNumber" TEXT NOT NULL DEFAULT 'OP-20',
    "operationDescription" TEXT NOT NULL,
    "instructionCategory" TEXT NOT NULL DEFAULT 'Assembly',
    "priority" TEXT NOT NULL DEFAULT 'High',
    "totalCycleTimeSec" INTEGER NOT NULL DEFAULT 230,
    "overallReadinessScore" INTEGER NOT NULL DEFAULT 87,
    "qualityScore" INTEGER NOT NULL DEFAULT 85,
    "safetyScore" INTEGER NOT NULL DEFAULT 90,
    "competencyScore" INTEGER NOT NULL DEFAULT 84,
    "aiDocumentationScore" INTEGER NOT NULL DEFAULT 88,
    "recommendation" TEXT NOT NULL DEFAULT 'Approve Work Instruction',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkInstruction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkInstructionStep" (
    "id" TEXT NOT NULL,
    "workInstructionId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "instruction" TEXT NOT NULL,
    "visualReferenceUrl" TEXT,
    "keyPoints" TEXT NOT NULL,
    "timeSeconds" INTEGER NOT NULL DEFAULT 30,
    "safetyNotes" TEXT,
    "qualityChecks" TEXT,
    "requiredTools" TEXT,
    "requiredMaterials" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkInstructionStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkInstructionAttachment" (
    "id" TEXT NOT NULL,
    "workInstructionId" TEXT NOT NULL,
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

    CONSTRAINT "WorkInstructionAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkInstructionApprovalStep" (
    "id" TEXT NOT NULL,
    "workInstructionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkInstructionApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkInstructionActivityLog" (
    "id" TEXT NOT NULL,
    "workInstructionId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkInstructionActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkInstructionAiAssessment" (
    "id" TEXT NOT NULL,
    "workInstructionId" TEXT NOT NULL,
    "instructionReview" TEXT NOT NULL,
    "riskAssessment" TEXT NOT NULL,
    "processOptimization" TEXT NOT NULL,
    "knowledgeGapAnalysis" TEXT NOT NULL,
    "trainingRecommendation" TEXT NOT NULL,
    "aiDocumentationScore" INTEGER NOT NULL DEFAULT 88,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkInstructionAiAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopRecord" (
    "id" TEXT NOT NULL,
    "sopId" TEXT NOT NULL,
    "formCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sopNumber" TEXT NOT NULL DEFAULT 'SOP-MFG-001',
    "revision" TEXT NOT NULL DEFAULT '2.0',
    "workflowStatus" TEXT NOT NULL DEFAULT 'In Review',
    "stage" INTEGER NOT NULL DEFAULT 2,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effectiveDate" TIMESTAMP(3),
    "nextReviewDate" TIMESTAMP(3),
    "lastModified" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "department" TEXT NOT NULL,
    "processOwner" TEXT NOT NULL,
    "sopCategory" TEXT NOT NULL DEFAULT 'Manufacturing',
    "businessFunction" TEXT NOT NULL DEFAULT 'Manufacturing Operations',
    "processName" TEXT NOT NULL DEFAULT 'Production Process Control',
    "processObjective" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "applicability" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "expectedOutput" TEXT NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'High',
    "totalDurationMins" INTEGER NOT NULL DEFAULT 45,
    "overallReadinessScore" INTEGER NOT NULL DEFAULT 87,
    "procedureReadinessScore" INTEGER NOT NULL DEFAULT 85,
    "complianceScore" INTEGER NOT NULL DEFAULT 90,
    "riskScore" INTEGER NOT NULL DEFAULT 82,
    "trainingScore" INTEGER NOT NULL DEFAULT 88,
    "aiDocumentationScore" INTEGER NOT NULL DEFAULT 91,
    "recommendation" TEXT NOT NULL DEFAULT 'Publish & Release SOP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SopRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopProcedureStep" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "responsibleRole" TEXT NOT NULL,
    "durationMins" INTEGER NOT NULL DEFAULT 5,
    "requiredDocuments" TEXT,
    "notes" TEXT,
    "safetyCheck" TEXT,
    "qualityCheck" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SopProcedureStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopResourceRequirement" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "itemCount" INTEGER NOT NULL DEFAULT 1,
    "verified" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'Verified',

    CONSTRAINT "SopResourceRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopComplianceRequirement" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "applicableStandards" TEXT NOT NULL DEFAULT 'ISO 9001:2015, ISO 14001:2015',
    "regulatoryRequirements" TEXT NOT NULL DEFAULT 'Factories Act, OSHA, BIS',
    "internalPolicies" TEXT NOT NULL DEFAULT 'Quality Policy, EHS Policy',
    "auditRequirements" TEXT NOT NULL DEFAULT 'Internal Audit, Customer Audit',
    "complianceScore" INTEGER NOT NULL DEFAULT 90,

    CONSTRAINT "SopComplianceRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopRiskAssessment" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL DEFAULT 'Medium',
    "ehsRequirements" TEXT NOT NULL,
    "emergencyProcedure" TEXT NOT NULL,
    "riskReadinessScore" INTEGER NOT NULL DEFAULT 82,

    CONSTRAINT "SopRiskAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopTrainingRequirement" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "trainingRequired" BOOLEAN NOT NULL DEFAULT true,
    "targetAudience" TEXT NOT NULL,
    "competencyRequirement" TEXT NOT NULL,
    "trainingReadinessScore" INTEGER NOT NULL DEFAULT 88,

    CONSTRAINT "SopTrainingRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopAttachment" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT 'v2.0',
    "uploadedBy" TEXT NOT NULL,
    "uploadedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fileSize" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "downloadUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SopAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopApprovalStep" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "person" TEXT NOT NULL,
    "decision" TEXT NOT NULL DEFAULT 'Pending',
    "date" TIMESTAMP(3),
    "comments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SopApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopActivityLog" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "user" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prevStatus" TEXT,
    "newStatus" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SopActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SopAiAssessment" (
    "id" TEXT NOT NULL,
    "sopRecordId" TEXT NOT NULL,
    "aiSopReview" TEXT NOT NULL,
    "aiComplianceAnalysis" TEXT NOT NULL,
    "aiProcessOptimization" TEXT NOT NULL,
    "aiRiskPrediction" TEXT NOT NULL,
    "aiRevisionRecommendation" TEXT NOT NULL,
    "aiDocumentationScore" INTEGER NOT NULL DEFAULT 91,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SopAiAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_code_key" ON "Account"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Journal_journalNumber_key" ON "Journal"("journalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "JigDevelopment_jigId_key" ON "JigDevelopment"("jigId");

-- CreateIndex
CREATE UNIQUE INDEX "JigAiAssessment_jigId_key" ON "JigAiAssessment"("jigId");

-- CreateIndex
CREATE UNIQUE INDEX "FactoryLayout_layoutId_key" ON "FactoryLayout"("layoutId");

-- CreateIndex
CREATE UNIQUE INDEX "FactoryAiAssessment_layoutId_key" ON "FactoryAiAssessment"("layoutId");

-- CreateIndex
CREATE UNIQUE INDEX "CapacityPlanning_planningId_key" ON "CapacityPlanning"("planningId");

-- CreateIndex
CREATE UNIQUE INDEX "CapacityAiAssessment_planningId_key" ON "CapacityAiAssessment"("planningId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkInstruction_instructionId_key" ON "WorkInstruction"("instructionId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkInstructionAiAssessment_workInstructionId_key" ON "WorkInstructionAiAssessment"("workInstructionId");

-- CreateIndex
CREATE UNIQUE INDEX "SopRecord_sopId_key" ON "SopRecord"("sopId");

-- CreateIndex
CREATE UNIQUE INDEX "SopComplianceRequirement_sopRecordId_key" ON "SopComplianceRequirement"("sopRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "SopRiskAssessment_sopRecordId_key" ON "SopRiskAssessment"("sopRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "SopTrainingRequirement_sopRecordId_key" ON "SopTrainingRequirement"("sopRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "SopAiAssessment_sopRecordId_key" ON "SopAiAssessment"("sopRecordId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JournalLine" ADD CONSTRAINT "JournalLine_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalStep" ADD CONSTRAINT "ApprovalStep_journalId_fkey" FOREIGN KEY ("journalId") REFERENCES "Journal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JigAttachment" ADD CONSTRAINT "JigAttachment_jigId_fkey" FOREIGN KEY ("jigId") REFERENCES "JigDevelopment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JigApprovalStep" ADD CONSTRAINT "JigApprovalStep_jigId_fkey" FOREIGN KEY ("jigId") REFERENCES "JigDevelopment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JigActivityLog" ADD CONSTRAINT "JigActivityLog_jigId_fkey" FOREIGN KEY ("jigId") REFERENCES "JigDevelopment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JigAiAssessment" ADD CONSTRAINT "JigAiAssessment_jigId_fkey" FOREIGN KEY ("jigId") REFERENCES "JigDevelopment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryAttachment" ADD CONSTRAINT "FactoryAttachment_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "FactoryLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryApprovalStep" ADD CONSTRAINT "FactoryApprovalStep_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "FactoryLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryActivityLog" ADD CONSTRAINT "FactoryActivityLog_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "FactoryLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactoryAiAssessment" ADD CONSTRAINT "FactoryAiAssessment_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "FactoryLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FactorySimulation" ADD CONSTRAINT "FactorySimulation_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "FactoryLayout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityAttachment" ADD CONSTRAINT "CapacityAttachment_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "CapacityPlanning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityApprovalStep" ADD CONSTRAINT "CapacityApprovalStep_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "CapacityPlanning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityActivityLog" ADD CONSTRAINT "CapacityActivityLog_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "CapacityPlanning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacityAiAssessment" ADD CONSTRAINT "CapacityAiAssessment_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "CapacityPlanning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapacitySimulation" ADD CONSTRAINT "CapacitySimulation_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "CapacityPlanning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BottleneckAnalysis" ADD CONSTRAINT "BottleneckAnalysis_planningId_fkey" FOREIGN KEY ("planningId") REFERENCES "CapacityPlanning"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkInstructionStep" ADD CONSTRAINT "WorkInstructionStep_workInstructionId_fkey" FOREIGN KEY ("workInstructionId") REFERENCES "WorkInstruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkInstructionAttachment" ADD CONSTRAINT "WorkInstructionAttachment_workInstructionId_fkey" FOREIGN KEY ("workInstructionId") REFERENCES "WorkInstruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkInstructionApprovalStep" ADD CONSTRAINT "WorkInstructionApprovalStep_workInstructionId_fkey" FOREIGN KEY ("workInstructionId") REFERENCES "WorkInstruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkInstructionActivityLog" ADD CONSTRAINT "WorkInstructionActivityLog_workInstructionId_fkey" FOREIGN KEY ("workInstructionId") REFERENCES "WorkInstruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkInstructionAiAssessment" ADD CONSTRAINT "WorkInstructionAiAssessment_workInstructionId_fkey" FOREIGN KEY ("workInstructionId") REFERENCES "WorkInstruction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopProcedureStep" ADD CONSTRAINT "SopProcedureStep_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopResourceRequirement" ADD CONSTRAINT "SopResourceRequirement_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopComplianceRequirement" ADD CONSTRAINT "SopComplianceRequirement_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopRiskAssessment" ADD CONSTRAINT "SopRiskAssessment_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopTrainingRequirement" ADD CONSTRAINT "SopTrainingRequirement_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopAttachment" ADD CONSTRAINT "SopAttachment_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopApprovalStep" ADD CONSTRAINT "SopApprovalStep_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopActivityLog" ADD CONSTRAINT "SopActivityLog_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SopAiAssessment" ADD CONSTRAINT "SopAiAssessment_sopRecordId_fkey" FOREIGN KEY ("sopRecordId") REFERENCES "SopRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
