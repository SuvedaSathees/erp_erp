import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "sales-channel";

const DEFAULT_RECORD: any = {
  salesChannelId: "SC-2024-00045",
  formCode: "SCF-2024-25",
  salesChannelName: "North India Dealer Network",
  salesChannelNumber: "SCN-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "EV Solutions",
  productService: "EV Fast Charger",
  channelManager: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Partner Onboarding",

  businessObjective: "Expand market reach through strong dealer network.",
  salesObjective: "₹ 50 Cr revenue in FY 2024-25.",
  targetMarket: ["Commercial", "Industrial"],
  geographicCoverage: ["North India", "Delhi NCR", "Punjab", "Uttar Pradesh", "Rajasthan"],
  channelType: "Dealer Network",
  salesStrategyRef: "SS-2024-018",
  lifecycleStage: "Partner Onboarding",
  priority: "High",

  salesModel: "B2B",
  distributionModel: "Selective",
  channelPartnerType: "Authorized Dealer",
  targetPartners: 25,
  coverageArea: ["North India"],
  salesTerritory: ["12 Territories"],
  channelCapacityScore: 82,

  partnerQualificationCriteria: "Financial stability, technical capability, market experience",
  partnerOnboardingProcess: "KYC, Agreement, Training, Certification",
  certificationRequirement: "Authorized Partner",
  trainingProgram: "Dealer Training Program 2024",
  incentiveProgram: "Volume based + Performance bonus",
  slaAgreementFile: "dealer_sla_2024.pdf",
  partnerReadinessScore: 85,

  pricingStrategyRef: "PS-2024-022",
  marginStructure: 18.0,
  commissionStructure: 5.0,
  salesTarget: 500000000,
  revenueForecast: 525000000,
  paymentTerms: "Net 30",
  commercialScore: 88,

  inventorySupport: true,
  deliveryModel: "Dealer Delivery",
  afterSalesSupport: true,
  warrantySupport: true,
  reverseLogistics: true,
  serviceCoverage: ["Installation", "Maintenance", "Support", "Spares", "AMC"],
  operationsReadinessScore: 80,

  leadConversionRate: 24.5,
  salesGrowth: 32.8,
  partnerPerformance: 81,
  customerSatisfaction: 4.3,
  marketCoverage: 68.5,
  channelProfitability: 87500000,
  performanceScore: 79,

  aiChannelOptimization: "Optimize coverage in tier 2 cities",
  aiTerritoryPlanning: "Rebalance 3 territories for growth",
  aiRevenuePrediction: "Expected revenue ₹ 52.5 Cr (+18%)",
  aiPartnerRecommendation: "Recommended 5 new partners",
  aiSalesOpportunity: "High opportunities in Punjab & UP",
  aiRiskAssessment: "Low risk | Stable channel network",
  aiSalesIntelligenceScore: 91,

  recommendation: "Approve Sales Channel",

  approvals: [
    { role: "Channel Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "18 authorized dealers onboarded & validated." },
    { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "09 May 2024", comments: "₹50 Cr sales target and 18% margin structure approved." },
    { role: "Marketing Manager", user: "Sneha Iyer", status: "Approved", date: "10 May 2024", comments: "Marketing assets and promotional collateral distributed." },
    { role: "Finance Manager", user: "Neha Reddy", status: "Approved", date: "11 May 2024", comments: "Net 30 payment terms and credit lines approved." },
    { role: "Operations Manager", user: "Arjun Patel", status: "Pending", date: "In Review", comments: "Dealer delivery logistics SLA under review." },
    { role: "BD Head", user: "Vineet Malhotra", status: "Pending", date: "In Review", comments: "Territory coverage expansion plan review." },
    { role: "COO", user: "Rajat Verma", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "High channel capacity and partner readiness (86/100 Overall Score, ₹52.5 Cr Forecast, 68.5% Coverage). Approved for Launch.",
  userApprovalDate: "2024-05-17",

  attachments: [
    { id: "1", name: "Channel_Strategy.pdf", type: "PDF Document", size: "4.5 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Partner_Agreement.pdf", type: "PDF Document", size: "3.2 MB", date: "16 May 2024", uploader: "Vikram Singh" },
    { id: "3", name: "Territory_Map.pdf", type: "PDF Document", size: "5.1 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "4", name: "Pricing_Structure.xlsx", type: "Excel Spreadsheet", size: "2.7 MB", date: "14 May 2024", uploader: "Neha Reddy" },
    { id: "5", name: "Commission_Policy.pdf", type: "PDF Document", size: "1.8 MB", date: "13 May 2024", uploader: "Neha Reddy" },
    { id: "6", name: "Training_Materials.pdf", type: "PDF Document", size: "6.4 MB", date: "12 May 2024", uploader: "Sneha Iyer" },
    { id: "7", name: "Sales_Forecast.xlsx", type: "Excel Spreadsheet", size: "3.9 MB", date: "11 May 2024", uploader: "Vikram Singh" },
    { id: "8", name: "Supporting_Document.zip", type: "ZIP Archive", size: "12.8 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ],

  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Revenue Forecast (₹52.5 Cr) and Market Coverage (68.5%)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Vikram Singh", action: "Uploaded Partner_Agreement.pdf and Territory_Map.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Sales Intelligence Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Neha Reddy", action: "Finance Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:20 AM", user: "Rahul Sharma", action: "Sales Channel Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.salesChannelName ?? "",
    ownerName: record.channelManager ?? "",
    recordCode: record.id ?? record.salesChannelId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getSalesChannelFn = createServerFn({ method: "GET" }).handler(async () => await getOrDefault());

export const saveSalesChannelDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    return await saveRecord({ ...current, ...data.input });
  });

export const submitSalesChannelFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const current = await getOrDefault();
    current.workflowStatus = "Under Review";
    return await saveRecord(current);
  });

export const reviewSalesChannelFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    current.approvalDecision = data.decision;
    current.reviewComments = data.comments ?? "";
    current.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : current.workflowStatus;
    return await saveRecord(current);
  });
