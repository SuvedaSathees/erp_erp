-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('Active', 'OnLeave', 'Suspended', 'Resigned', 'NoticePeriod', 'Separated', 'Retired');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FullTime', 'PartTime', 'Contract', 'Intern', 'Consultant');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('CasualLeave', 'SickLeave', 'EarnedLeave', 'MaternityLeave', 'PaternityLeave', 'CompensatoryOff', 'LossOfPay', 'Bereavement');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Cancelled');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent', 'HalfDay', 'OnLeave', 'Holiday', 'WeekOff', 'WFH');

-- CreateEnum
CREATE TYPE "PayrollStatus" AS ENUM ('Draft', 'Processing', 'Approved', 'Paid', 'OnHold');

-- CreateEnum
CREATE TYPE "LeadStatusEnum" AS ENUM ('New', 'Contacted', 'Qualified', 'Nurturing', 'Proposal', 'Negotiation', 'Converted', 'Lost', 'Disqualified');

-- CreateEnum
CREATE TYPE "LeadRating" AS ENUM ('Hot', 'Warm', 'Cold');

-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "OpportunityStage" AS ENUM ('Discovery', 'Qualification', 'Proposal', 'Negotiation', 'ClosedWon', 'ClosedLost');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('Open', 'InProgress', 'Resolved', 'Closed', 'Escalated');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "SalesOrderStatus" AS ENUM ('Draft', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('Draft', 'Submitted', 'Approved', 'Ordered', 'PartiallyReceived', 'Received', 'Cancelled');

-- CreateEnum
CREATE TYPE "GoodsReceiptStatus" AS ENUM ('Pending', 'Inspecting', 'Accepted', 'Rejected', 'PartiallyAccepted');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Planning', 'Active', 'OnHold', 'Completed', 'Cancelled');

-- CreateEnum
CREATE TYPE "ProjectPriority" AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('Todo', 'InProgress', 'InReview', 'Done', 'Blocked', 'Cancelled');

-- CreateEnum
CREATE TYPE "TaskPriorityEnum" AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "MilestoneStatus" AS ENUM ('Upcoming', 'InProgress', 'Completed', 'Overdue', 'Cancelled');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('Draft', 'InReview', 'Approved', 'Published', 'Archived', 'Obsolete');

-- CreateEnum
CREATE TYPE "CapaType" AS ENUM ('Corrective', 'Preventive', 'Both');

-- CreateEnum
CREATE TYPE "CapaStatus" AS ENUM ('Open', 'InvestigationPending', 'RootCauseIdentified', 'ActionPlanned', 'ActionInProgress', 'VerificationPending', 'Closed', 'Rejected');

-- CreateEnum
CREATE TYPE "CapaPriority" AS ENUM ('Critical', 'High', 'Medium', 'Low');

-- CreateEnum
CREATE TYPE "NcrStatus" AS ENUM ('Open', 'UnderReview', 'Dispositioned', 'Closed', 'Rejected');

-- CreateEnum
CREATE TYPE "InspectionType" AS ENUM ('Incoming', 'InProcess', 'Final');

-- CreateEnum
CREATE TYPE "InspectionResult" AS ENUM ('Pass', 'Fail', 'ConditionalPass', 'Pending');

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "headOfDept" TEXT,
    "costCenterCode" TEXT,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "employeeCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Designation" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "grade" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "band" TEXT,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Designation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "employeeCode" TEXT NOT NULL,
    "employeeNumber" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "Gender",
    "photo" TEXT,
    "departmentId" TEXT,
    "designationId" TEXT,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'Active',
    "employmentType" "EmploymentType" NOT NULL DEFAULT 'FullTime',
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "confirmationDate" TIMESTAMP(3),
    "resignationDate" TIMESTAMP(3),
    "lastWorkingDay" TIMESTAMP(3),
    "reportingManagerId" TEXT,
    "location" TEXT,
    "branch" TEXT,
    "businessUnit" TEXT,
    "costCenterCode" TEXT,
    "grade" TEXT,
    "annualCTC" DECIMAL(18,2),
    "basicSalary" DECIMAL(18,2),
    "bankAccountNo" TEXT,
    "bankName" TEXT,
    "panNumber" TEXT,
    "aadharNumber" TEXT,
    "pfNumber" TEXT,
    "esiNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL,
    "leaveCode" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "leaveType" "LeaveType" NOT NULL DEFAULT 'CasualLeave',
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "days" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "reason" TEXT,
    "status" "LeaveStatus" NOT NULL DEFAULT 'Pending',
    "approvedBy" TEXT,
    "approvedDate" TIMESTAMP(3),
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "checkIn" TIMESTAMP(3),
    "checkOut" TIMESTAMP(3),
    "hoursWorked" DOUBLE PRECISION,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'Present',
    "shift" TEXT DEFAULT 'General',
    "overtime" DOUBLE PRECISION DEFAULT 0,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollRecord" (
    "id" TEXT NOT NULL,
    "payrollCode" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "basicSalary" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "hra" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "conveyance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "specialAllowance" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "otherAllowances" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "grossEarnings" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "pfDeduction" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "esiDeduction" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "tds" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "professionalTax" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "otherDeductions" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalDeductions" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "netPay" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" "PayrollStatus" NOT NULL DEFAULT 'Draft',
    "paidDate" TIMESTAMP(3),
    "paymentMethod" TEXT DEFAULT 'Bank Transfer',
    "workingDays" INTEGER NOT NULL DEFAULT 0,
    "presentDays" INTEGER NOT NULL DEFAULT 0,
    "lossOfPayDays" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayrollRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmLead" (
    "id" TEXT NOT NULL,
    "leadNumber" TEXT NOT NULL,
    "leadName" TEXT NOT NULL,
    "leadType" TEXT NOT NULL DEFAULT 'Business',
    "status" "LeadStatusEnum" NOT NULL DEFAULT 'New',
    "rating" "LeadRating" NOT NULL DEFAULT 'Warm',
    "priority" "LeadPriority" NOT NULL DEFAULT 'Medium',
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "businessUnit" TEXT,
    "branch" TEXT,
    "department" TEXT,
    "leadSource" TEXT,
    "sourceCampaign" TEXT,
    "sourceChannel" TEXT,
    "contactPerson" TEXT,
    "contactDesignation" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "orgName" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "annualRevenue" TEXT,
    "gstin" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'India',
    "postalCode" TEXT,
    "requirementType" TEXT,
    "productService" TEXT,
    "budget" TEXT,
    "expectedPurchaseDate" TIMESTAMP(3),
    "qualificationScore" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "scoreGrade" TEXT,
    "probability" TEXT,
    "nextAction" TEXT,
    "nextActionDate" TIMESTAMP(3),
    "description" TEXT,
    "expectedConversionDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmLead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmOpportunity" (
    "id" TEXT NOT NULL,
    "opportunityNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "stage" "OpportunityStage" NOT NULL DEFAULT 'Discovery',
    "amount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "probability" INTEGER NOT NULL DEFAULT 0,
    "expectedCloseDate" TIMESTAMP(3),
    "ownerName" TEXT NOT NULL,
    "ownerEmail" TEXT,
    "leadId" TEXT,
    "accountId" TEXT,
    "productService" TEXT,
    "competitor" TEXT,
    "nextStep" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmOpportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmAccount" (
    "id" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Customer',
    "industry" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "annualRevenue" DECIMAL(18,2),
    "employeeCount" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "billingAddress" TEXT,
    "billingCity" TEXT,
    "billingState" TEXT,
    "billingCountry" TEXT DEFAULT 'India',
    "ownerName" TEXT,
    "parentAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrmContact" (
    "id" TEXT NOT NULL,
    "contactCode" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "designation" TEXT,
    "department" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "accountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CrmContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT,
    "status" "TicketStatus" NOT NULL DEFAULT 'Open',
    "priority" "TicketPriority" NOT NULL DEFAULT 'Medium',
    "category" TEXT,
    "channel" TEXT DEFAULT 'Email',
    "accountId" TEXT,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "assignedTo" TEXT,
    "slaDeadline" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesOrder" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerCode" TEXT,
    "status" "SalesOrderStatus" NOT NULL DEFAULT 'Draft',
    "subtotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "paymentTerms" TEXT DEFAULT 'Net 30',
    "deliveryDate" TIMESTAMP(3),
    "shippingAddress" TEXT,
    "salesPerson" TEXT,
    "territory" TEXT,
    "channel" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesOrderLine" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "productCode" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "uom" TEXT NOT NULL DEFAULT 'Nos',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesOrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "quotationDate" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3),
    "customerName" TEXT NOT NULL,
    "customerCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Draft',
    "subtotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "salesPerson" TEXT,
    "terms" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceList" (
    "id" TEXT NOT NULL,
    "priceListCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceListItem" (
    "id" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,
    "productCode" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "basePrice" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "sellingPrice" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "minQty" INTEGER NOT NULL DEFAULT 1,
    "uom" TEXT NOT NULL DEFAULT 'Nos',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceListItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "supplierCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'India',
    "gstin" TEXT,
    "pan" TEXT,
    "paymentTerms" TEXT NOT NULL DEFAULT 'Net 30',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "rating" INTEGER DEFAULT 0,
    "leadTime" INTEGER DEFAULT 7,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "poNumber" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "expectedDate" TIMESTAMP(3),
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'Draft',
    "supplierId" TEXT,
    "supplierName" TEXT NOT NULL,
    "subtotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "discount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "paymentTerms" TEXT DEFAULT 'Net 30',
    "deliveryAddress" TEXT,
    "requestedBy" TEXT,
    "approvedBy" TEXT,
    "approvedDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderLine" (
    "id" TEXT NOT NULL,
    "poId" TEXT NOT NULL,
    "lineNumber" INTEGER NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "receivedQty" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "uom" TEXT NOT NULL DEFAULT 'Nos',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseOrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceipt" (
    "id" TEXT NOT NULL,
    "grnNumber" TEXT NOT NULL,
    "receiptDate" TIMESTAMP(3) NOT NULL,
    "poId" TEXT,
    "supplierName" TEXT NOT NULL,
    "status" "GoodsReceiptStatus" NOT NULL DEFAULT 'Pending',
    "receivedBy" TEXT,
    "inspectedBy" TEXT,
    "warehouseLocation" TEXT,
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceiptLine" (
    "id" TEXT NOT NULL,
    "grnId" TEXT NOT NULL,
    "itemCode" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "orderedQty" INTEGER NOT NULL DEFAULT 0,
    "receivedQty" INTEGER NOT NULL DEFAULT 0,
    "acceptedQty" INTEGER NOT NULL DEFAULT 0,
    "rejectedQty" INTEGER NOT NULL DEFAULT 0,
    "uom" TEXT NOT NULL DEFAULT 'Nos',
    "remarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoodsReceiptLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "projectCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'Planning',
    "priority" "ProjectPriority" NOT NULL DEFAULT 'Medium',
    "category" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "actualEndDate" TIMESTAMP(3),
    "projectManager" TEXT NOT NULL,
    "department" TEXT,
    "clientName" TEXT,
    "budget" DECIMAL(18,2),
    "actualCost" DECIMAL(18,2),
    "completion" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectTask" (
    "id" TEXT NOT NULL,
    "taskCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'Todo',
    "priority" "TaskPriorityEnum" NOT NULL DEFAULT 'Medium',
    "projectId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "assigneeName" TEXT,
    "milestoneId" TEXT,
    "startDate" TIMESTAMP(3),
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "estimatedHours" DOUBLE PRECISION,
    "actualHours" DOUBLE PRECISION,
    "parentTaskId" TEXT,
    "tags" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "milestoneCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "MilestoneStatus" NOT NULL DEFAULT 'Upcoming',
    "projectId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "completedDate" TIMESTAMP(3),
    "deliverables" TEXT,
    "owner" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" TEXT NOT NULL,
    "entryCode" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "hours" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "projectId" TEXT NOT NULL,
    "employeeId" TEXT,
    "employeeName" TEXT,
    "taskCode" TEXT,
    "billable" BOOLEAN NOT NULL DEFAULT true,
    "status" TEXT NOT NULL DEFAULT 'Submitted',
    "approvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "description" TEXT,
    "performedBy" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "policyCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" TEXT NOT NULL DEFAULT 'Active',
    "effectiveDate" TIMESTAMP(3) NOT NULL,
    "reviewDate" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "department" TEXT,
    "description" TEXT,
    "documentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentControl" (
    "id" TEXT NOT NULL,
    "documentCode" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" "DocumentStatus" NOT NULL DEFAULT 'Draft',
    "owner" TEXT NOT NULL,
    "department" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "expiryDate" TIMESTAMP(3),
    "reviewDate" TIMESTAMP(3),
    "description" TEXT,
    "filePath" TEXT,
    "accessLevel" TEXT NOT NULL DEFAULT 'Internal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalMatrix" (
    "id" TEXT NOT NULL,
    "matrixCode" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "minAmount" DECIMAL(18,2),
    "maxAmount" DECIMAL(18,2),
    "approverRole" TEXT NOT NULL,
    "approverName" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApprovalMatrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CapaRecord" (
    "id" TEXT NOT NULL,
    "capaNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "CapaType" NOT NULL DEFAULT 'Corrective',
    "status" "CapaStatus" NOT NULL DEFAULT 'Open',
    "priority" "CapaPriority" NOT NULL DEFAULT 'Medium',
    "source" TEXT,
    "department" TEXT,
    "assignedTo" TEXT,
    "initiatedBy" TEXT,
    "initiatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "problemStatement" TEXT,
    "rootCause" TEXT,
    "rootCauseMethod" TEXT,
    "actionPlan" TEXT,
    "targetDate" TIMESTAMP(3),
    "completionDate" TIMESTAMP(3),
    "verification" TEXT,
    "effectiveness" TEXT,
    "relatedNcrId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CapaRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NcrRecord" (
    "id" TEXT NOT NULL,
    "ncrNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "NcrStatus" NOT NULL DEFAULT 'Open',
    "severity" TEXT NOT NULL DEFAULT 'Major',
    "category" TEXT,
    "department" TEXT,
    "detectedBy" TEXT,
    "detectedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productCode" TEXT,
    "productName" TEXT,
    "batchNumber" TEXT,
    "quantity" INTEGER,
    "defectType" TEXT,
    "disposition" TEXT,
    "assignedTo" TEXT,
    "targetDate" TIMESTAMP(3),
    "closedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NcrRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InspectionRecord" (
    "id" TEXT NOT NULL,
    "inspectionCode" TEXT NOT NULL,
    "type" "InspectionType" NOT NULL DEFAULT 'Incoming',
    "result" "InspectionResult" NOT NULL DEFAULT 'Pending',
    "inspectionDate" TIMESTAMP(3) NOT NULL,
    "inspector" TEXT NOT NULL,
    "department" TEXT,
    "productCode" TEXT,
    "productName" TEXT,
    "batchNumber" TEXT,
    "sampleSize" INTEGER,
    "defectsFound" INTEGER NOT NULL DEFAULT 0,
    "acceptanceLevel" TEXT,
    "supplierName" TEXT,
    "poNumber" TEXT,
    "grnNumber" TEXT,
    "remarks" TEXT,
    "ncrRequired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InspectionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Designation_code_key" ON "Designation"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Designation_title_key" ON "Designation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employeeCode_key" ON "Employee"("employeeCode");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LeaveRequest_leaveCode_key" ON "LeaveRequest"("leaveCode");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_employeeId_date_key" ON "Attendance"("employeeId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PayrollRecord_payrollCode_key" ON "PayrollRecord"("payrollCode");

-- CreateIndex
CREATE UNIQUE INDEX "CrmLead_leadNumber_key" ON "CrmLead"("leadNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CrmOpportunity_opportunityNumber_key" ON "CrmOpportunity"("opportunityNumber");

-- CreateIndex
CREATE UNIQUE INDEX "CrmAccount_accountCode_key" ON "CrmAccount"("accountCode");

-- CreateIndex
CREATE UNIQUE INDEX "CrmContact_contactCode_key" ON "CrmContact"("contactCode");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber");

-- CreateIndex
CREATE UNIQUE INDEX "SalesOrder_orderNumber_key" ON "SalesOrder"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quotationNumber_key" ON "Quotation"("quotationNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PriceList_priceListCode_key" ON "PriceList"("priceListCode");

-- CreateIndex
CREATE UNIQUE INDEX "Supplier_supplierCode_key" ON "Supplier"("supplierCode");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_poNumber_key" ON "PurchaseOrder"("poNumber");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsReceipt_grnNumber_key" ON "GoodsReceipt"("grnNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectCode_key" ON "Project"("projectCode");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectTask_taskCode_key" ON "ProjectTask"("taskCode");

-- CreateIndex
CREATE UNIQUE INDEX "Milestone_milestoneCode_key" ON "Milestone"("milestoneCode");

-- CreateIndex
CREATE UNIQUE INDEX "TimeEntry_entryCode_key" ON "TimeEntry"("entryCode");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policyCode_key" ON "Policy"("policyCode");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentControl_documentCode_key" ON "DocumentControl"("documentCode");

-- CreateIndex
CREATE UNIQUE INDEX "ApprovalMatrix_matrixCode_key" ON "ApprovalMatrix"("matrixCode");

-- CreateIndex
CREATE UNIQUE INDEX "CapaRecord_capaNumber_key" ON "CapaRecord"("capaNumber");

-- CreateIndex
CREATE UNIQUE INDEX "NcrRecord_ncrNumber_key" ON "NcrRecord"("ncrNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InspectionRecord_inspectionCode_key" ON "InspectionRecord"("inspectionCode");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES "Designation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_reportingManagerId_fkey" FOREIGN KEY ("reportingManagerId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollRecord" ADD CONSTRAINT "PayrollRecord_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmOpportunity" ADD CONSTRAINT "CrmOpportunity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "CrmLead"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmOpportunity" ADD CONSTRAINT "CrmOpportunity_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "CrmAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmAccount" ADD CONSTRAINT "CrmAccount_parentAccountId_fkey" FOREIGN KEY ("parentAccountId") REFERENCES "CrmAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrmContact" ADD CONSTRAINT "CrmContact_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "CrmAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "CrmAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesOrderLine" ADD CONSTRAINT "SalesOrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "SalesOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceListItem" ADD CONSTRAINT "PriceListItem_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "PriceList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLine" ADD CONSTRAINT "PurchaseOrderLine_poId_fkey" FOREIGN KEY ("poId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceipt" ADD CONSTRAINT "GoodsReceipt_poId_fkey" FOREIGN KEY ("poId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptLine" ADD CONSTRAINT "GoodsReceiptLine_grnId_fkey" FOREIGN KEY ("grnId") REFERENCES "GoodsReceipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_milestoneId_fkey" FOREIGN KEY ("milestoneId") REFERENCES "Milestone"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectTask" ADD CONSTRAINT "ProjectTask_parentTaskId_fkey" FOREIGN KEY ("parentTaskId") REFERENCES "ProjectTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CapaRecord" ADD CONSTRAINT "CapaRecord_relatedNcrId_fkey" FOREIGN KEY ("relatedNcrId") REFERENCES "NcrRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
