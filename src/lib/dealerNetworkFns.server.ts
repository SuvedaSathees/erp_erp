import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "dealer-network";

const DEFAULT_RECORD: any = {
  dealerNetworkId: "DN-2024-00045",
  formCode: "DNDF-2024-25",
  dealerProject: "North India Dealer Expansion",
  dealerNumber: "DLR-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "EV Solutions",
  productService: "EV Two Wheelers",
  dealerDevelopmentManager: "Rahul Sharma",
  createdDate: "05 May 2024 09:30 AM",
  lastModifiedDate: "17 May 2024 03:45 PM",
  workflowStage: "Dealer Onboarding",
  businessObjective: "Expand market reach and increase EV sales across North India.",
  dealerNetworkObjective: "Build a strong dealer network with superior service and sales coverage.",
  dealerType: "Exclusive Dealer",
  productCategory: "Electric Two Wheelers",
  geographicCoverage: ["Delhi", "Uttar Pradesh", "Punjab", "Haryana"],
  salesChannelRef: "EV Two Wheeler Channel",
  lifecycleStage: "Dealer Onboarding",
  priority: "High",
  dealerName: "GreenRide Motors Pvt. Ltd.",
  businessType: "Private Limited",
  companyRegistration: "U74140DL2018PTC334455",
  yearsInBusiness: 8,
  annualTurnover: 250000000,
  existingBrandsHandled: ["Hero", "TVS", "Bajaj"],
  numberOfBranches: 12,
  dealerCapabilityScore: 82,
  financialCapability: "Strong",
  technicalCapability: "Advanced",
  salesCapability: "Advanced",
  serviceCapability: "Advanced",
  infrastructureReadiness: "Strong",
  dueDiligenceStatus: true,
  backgroundVerification: true,
  qualificationScore: 85,
  pricingStrategyRef: "EV Pricing Strategy 2024",
  dealerMargin: 18.0,
  salesIncentivePlan: "Volume based incentive with quarterly performance bonus.",
  creditLimit: 15000000,
  paymentTerms: "Net 30",
  annualSalesTarget: 100000000,
  commercialScore: 88,
  showroomReady: true,
  warehouseReady: true,
  serviceCenterReady: true,
  demoEquipmentInstalled: true,
  inventoryAllocation: 5000000,
  erpIntegrationCompleted: true,
  operationalReadinessScore: 80,
  salesTrainingCompleted: true,
  technicalTrainingCompleted: true,
  serviceCertification: "Authorized Service Center",
  productKnowledgeAssessment: 86,
  dealerHandbookIssued: true,
  trainingCompletionDate: "2024-05-15",
  trainingScore: 84,
  monthlySalesTarget: 8500000,
  leadConversionRate: 22.5,
  customerSatisfactionScore: 4.3,
  warrantyClaimRate: 1.8,
  serviceSlaAchievement: 96,
  dealerPerformanceRating: 81,
  performanceScore: 81,
  aiDealerSuitability: "High suitability with 88% match",
  aiTerritoryRecommendation: "Expand coverage in Uttar Pradesh",
  aiRevenueForecast: "₹ 12,50,00,000 potential in 2 years",
  aiInventoryRecommendation: "Increase inventory for top 5 models",
  aiPerformancePrediction: "High growth dealer with 85% confidence",
  aiExpansionRecommendation: "Open 2 more branches in 2025",
  aiDealerIntelligenceScore: 89,
  recommendation: "Approve Dealer",
  overallRemark: "Dealer is ready for onboarding and commercial launch.",
  approvals: [
    { role: "Dealer Dev Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "8 years EV experience & 82% capability score validated." },
    { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "09 May 2024", comments: "₹10 Cr sales target and 18% margin structure approved." },
    { role: "Finance Manager", user: "Anita Verma", status: "Approved", date: "10 May 2024", comments: "₹1.5 Cr credit limit and Net 30 terms approved." },
    { role: "Operations Manager", user: "Manish Gupta", status: "Approved", date: "11 May 2024", comments: "Showroom and service center infrastructure verified." },
    { role: "Service Manager", user: "Neha Kapoor", status: "Approved", date: "12 May 2024", comments: "Service team technical training and SLA verified." },
    { role: "Legal Manager", user: "Arjun Mehta", status: "Pending", date: "In Review", comments: "Exclusive dealership agreement draft under legal review." },
    { role: "COO", user: "Amit Verma", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Strong dealer capability & 85/100 Overall Score (88 Commercial, 80 Operational, ₹12.5 Cr Forecast). Approved for Onboarding.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Dealer_Application.pdf", type: "PDF Document", size: "512 KB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Business_Registration.pdf", type: "PDF Document", size: "378 KB", date: "16 May 2024", uploader: "Vikram Singh" },
    { id: "3", name: "Financial_Statements.pdf", type: "PDF Document", size: "2.1 MB", date: "16 May 2024", uploader: "Anita Verma" },
    { id: "4", name: "Dealer_Agreement.pdf", type: "PDF Document", size: "256 KB", date: "15 May 2024", uploader: "Arjun Mehta" },
    { id: "5", name: "Infrastructure_Report.pdf", type: "PDF Document", size: "420 KB", date: "14 May 2024", uploader: "Manish Gupta" },
    { id: "6", name: "Training_Certificate.pdf", type: "PDF Document", size: "298 KB", date: "13 May 2024", uploader: "Neha Kapoor" },
    { id: "7", name: "Territory_Map.pdf", type: "PDF Document", size: "330 KB", date: "12 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Revenue Forecast and AI Dealer Intelligence Score", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Arjun Mehta", action: "Uploaded Dealer_Agreement.pdf and Business_Registration.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Dealer Intelligence Score (89/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Neha Kapoor", action: "Service Manager Approval Completed", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:30 AM", user: "Rahul Sharma", action: "Dealer Network Development Project Initialized", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.dealerProject ?? "",
    ownerName: record.dealerDevelopmentManager ?? "",
    recordCode: record.id ?? record.dealerNetworkId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getDealerNetworkFn = createServerFn({ method: "GET" }).handler(async () => {
  return await getOrDefault();
});

export const saveDealerNetworkDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    return await saveRecord({ ...current, ...data.input });
  });

export const submitDealerNetworkFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const current = await getOrDefault();
    current.workflowStatus = "Under Review";
    return await saveRecord(current);
  });

export const reviewDealerNetworkFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    current.approvalDecision = data.decision;
    current.reviewComments = data.comments ?? "";
    current.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : current.workflowStatus;
    return await saveRecord(current);
  });
