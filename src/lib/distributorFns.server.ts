import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "distributor";

const DEFAULT_RECORD: any = {
  distributorId: "DD-2024-00058",
  formCode: "DDF-2024-25",
  distributorProject: "North India Distribution Expansion",
  distributorNumber: "DSR-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "EV Solutions",
  productService: "EV Two Wheelers",
  distributorDevelopmentManager: "Rahul Sharma",
  createdDate: "05 May 2024 09:40 AM",
  lastModifiedDate: "17 May 2024 03:50 PM",
  workflowStage: "Distributor Onboarding",
  businessObjective: "Expand distribution reach and increase product availability across North India.",
  distributionObjective: "Build efficient distribution network with strong inventory and service support.",
  distributorType: "Regional Distributor",
  productCategory: "Electric Two Wheelers",
  geographicCoverage: ["Delhi", "Uttar Pradesh", "Punjab", "Haryana", "Rajasthan"],
  salesChannelRef: "EV Two Wheeler Channel",
  lifecycleStage: "Distributor Onboarding",
  priority: "High",
  distributorName: "GreenRide Distributors Pvt. Ltd.",
  businessType: "Private Limited",
  companyRegistration: "U74999DL2016PTC302415",
  yearsInBusiness: 9,
  annualTurnover: 450000000,
  warehouses: 4,
  distributionFleet: 28,
  existingBrands: ["Hero", "TVS", "Bajaj"],
  coverageStates: ["Delhi", "Uttar Pradesh", "Punjab", "Haryana", "Rajasthan"],
  distributorCapabilityScore: 82,
  financialCapability: "Strong",
  logisticsCapability: "Advanced",
  salesCapability: "Advanced",
  technicalCapability: "Intermediate",
  dueDiligenceStatus: true,
  backgroundVerification: true,
  creditAssessment: true,
  qualificationScore: 84,
  pricingStrategyRef: "EV Pricing Strategy 2024",
  revenueModelRef: "Distribution Revenue Model",
  distributorMargin: 16.5,
  creditLimit: 50000000,
  paymentTerms: "Net 30",
  annualPurchaseCommitment: 100000000,
  salesTarget: 120000000,
  commercialScore: 86,
  warehouseReady: true,
  distributionFleetReady: true,
  erpIntegrationCompleted: true,
  reverseLogisticsAvailable: true,
  inventoryAllocation: 10000000,
  safetyStockLevel: 15,
  operationalReadinessScore: 83,
  salesTrainingCompleted: true,
  productTrainingCompleted: true,
  logisticsTrainingCompleted: true,
  erpTrainingCompleted: true,
  distributorHandbookIssued: true,
  certificationLevel: "Gold Distributor",
  trainingScore: 87,
  monthlySalesTarget: 10000000,
  orderFulfillmentRate: 96,
  inventoryTurnoverRatio: 7.2,
  onTimeDelivery: 95,
  customerSatisfactionScore: 4.5,
  distributionCoverage: 78,
  revenueAchievement: 92,
  performanceScore: 86,
  aiTerritoryRecommendation: "Expand coverage in Uttarakhand and Bihar",
  aiInventoryOptimization: "Increase fast-moving SKUs by 18%",
  aiDemandForecast: "26% growth in EV two-wheelers in next 12 months",
  aiLogisticsOptimization: "Optimize routes to reduce delivery time by 12%",
  aiRevenuePrediction: "Expected revenue of ₹ 15 Cr in next FY",
  aiDistributorRecommendation: "Highly suitable for premium product line",
  aiDistributorScore: 88,
  recommendation: "Approve Distributor",
  approvals: [
    { role: "Distributor Dev Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "4 warehouses, 28 fleet vehicles & 82% capability score validated." },
    { role: "Sales Manager", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "₹12 Cr annual sales target & 16.5% distributor margin approved." },
    { role: "Supply Chain Manager", user: "Anita Verma", status: "Approved", date: "10 May 2024", comments: "15-day safety stock level and 95% on-time delivery verified." },
    { role: "Finance Manager", user: "Amit Joshi", status: "Approved", date: "11 May 2024", comments: "₹5 Cr credit limit and Net 30 payment terms approved." },
    { role: "Operations Manager", user: "Neha Mehta", status: "Approved", date: "12 May 2024", comments: "Warehouse logistics readiness and ERP integration complete." },
    { role: "Legal Manager", user: "Rohan Kapoor", status: "Approved", date: "13 May 2024", comments: "Distributor agreement and credit terms legally verified." },
    { role: "COO", user: "Arun Verma", status: "Pending", date: "In Review", comments: "Territory exclusivity review." },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "High distribution capacity & 86/100 Overall Score (86 Commercial, 83 Operational, ₹15 Cr Forecast). Approved for Onboarding.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Distributor_Application.pdf", type: "PDF Document", size: "612 KB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Company_Registration.pdf", type: "PDF Document", size: "452 KB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Financial_Statements.pdf", type: "PDF Document", size: "3.1 MB", date: "16 May 2024", uploader: "Amit Joshi" },
    { id: "4", name: "Warehouse_Assessment.pdf", type: "PDF Document", size: "520 KB", date: "15 May 2024", uploader: "Anita Verma" },
    { id: "5", name: "Distributor_Agreement.pdf", type: "PDF Document", size: "380 KB", date: "14 May 2024", uploader: "Rohan Kapoor" },
    { id: "6", name: "Training_Certificates.pdf", type: "PDF Document", size: "1.2 MB", date: "13 May 2024", uploader: "Neha Mehta" },
    { id: "7", name: "Territory_Map.pdf", type: "PDF Document", size: "330 KB", date: "12 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "03:50 PM", user: "Rahul Sharma", action: "Updated Annual Sales Target (₹12 Cr) and AI Distributor Score (88/100)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Rohan Kapoor", action: "Uploaded Distributor_Agreement.pdf and Warehouse_Assessment.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Distributor Score (88/100)", status: "AI System" },
    { id: "a4", date: "13 May 2024", time: "02:30 PM", user: "Rohan Kapoor", action: "Legal Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:40 AM", user: "Rahul Sharma", action: "Distributor Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.distributorProject ?? "",
    ownerName: record.distributorDevelopmentManager ?? "",
    recordCode: record.id ?? record.distributorId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getDistributorFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveDistributorDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitDistributorFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewDistributorFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const c = await getOrDefault();
    c.approvalDecision = data.decision;
    c.reviewComments = data.comments ?? "";
    c.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : c.workflowStatus;
    return await saveRecord(c);
  });
