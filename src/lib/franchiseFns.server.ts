import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "franchise";

const DEFAULT_RECORD: any = {
  franchiseId: "FRD-2024-00056",
  formCode: "FRD-2024-25",
  franchiseProject: "Global Cafe Expansion",
  franchiseNumber: "FC-EXP-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Food & Beverages",
  franchiseModel: "Cafe Standard Model",
  franchiseDevManager: "Rahul Sharma",
  createdDate: "05 May 2024 10:20 AM",
  lastModifiedDate: "17 May 2024 04:20 PM",
  workflowStage: "Franchise Development",
  businessObjective: "Expand our cafe brand through franchise network across India and SAARC region.",
  expansionObjective: "Open 150 franchise outlets in next 3 years.",
  franchiseType: "Single Unit Franchise",
  targetIndustry: ["Cafe", "QSR", "Beverages"],
  geographicCoverage: ["India", "SAARC"],
  businessModelRef: "BM-2024-01 - Cafe Model",
  lifecycleStage: "Growth",
  priority: "High",
  franchiseFormat: "Cafe - Standard",
  royaltyPercentage: 6.0,
  franchiseInvestment: 2500000,
  marketingContribution: 2.0,
  franchiseFee: 200000,
  franchiseAgreementTerm: 5,
  modelReadinessScore: 88,
  partnerEligibilityCriteria: "Minimum 2 years business experience and sound financial background.",
  dueDiligenceStatus: true,
  targetFranchisees: 3000,
  backgroundVerification: true,
  qualificationProcess: "Application -> Screening -> Interview -> Due Diligence",
  franchiseTrainingProgram: "FT-001 - Cafe Training",
  partnerReadinessScore: 82,
  revenueModelRef: "RM-2024-01",
  revenueForecast: 250000000,
  pricingStrategyRef: "PS-2024-02",
  roiForFranchisee: 28.5,
  revenueSharingModel: "Royalty + Marketing Fee",
  breakevenPeriodMonths: 18,
  commercialScore: 85,
  siteSelectionCompleted: true,
  supplyChainConnected: true,
  infrastructureReady: true,
  operationsManualAvailable: true,
  equipmentInstalled: true,
  inventoryReady: true,
  operationalReadinessScore: 78,
  franchiseAgreementFile: "cafe_fran_agreement.pdf",
  insuranceCoverage: true,
  ndaSigned: true,
  riskAssessment: "Low operational risk. Standard franchise risks identified and mitigated.",
  trademarkLicense: true,
  regulatoryCompliance: true,
  complianceScore: 90,
  monthlyRevenueTarget: 1500000,
  slaCompliance: 90,
  monthlySalesTarget: 3000,
  operationalEfficiencyScore: 88,
  customerSatisfactionScore: 85,
  performanceScore: 87,
  totalInvestment: 1500000,
  paybackPeriod: 18,
  irr: 32.4,
  fundingSource: "Self Funding",
  npv: 1240000,
  financeScore: 83,
  marketOpportunityScore: "High potential in tier 2 cities",
  riskPrediction: "Low risk based on market data",
  franchiseSuccessProbability: "Strong unit economics and demand",
  siteRecommendation: "25 cities recommended",
  revenuePotentialScore: "Very high 3-year revenue potential",
  aiIntelligenceScore: 86,
  recommendation: "Proceed to Approval",
  approvals: [
    { role: "Executive Sponsor", user: "Anita Verma", status: "Approved", date: "08 May 2024", comments: "150 cafe outlet expansion model approved." },
    { role: "COO", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "Operational readiness & supply chain SLA approved." },
    { role: "CFO", user: "Manish Gupta", status: "Approved", date: "10 May 2024", comments: "28.5% franchisee ROI & 18-month payback validated." },
    { role: "Legal Head", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "Franchise agreement and NDA compliance verified." },
    { role: "Operations Head", user: "Arjun Desai", status: "Pending", date: "In Review", comments: "Site layout & equipment procurement under review." },
    { role: "Marketing Head", user: "Sneha Nair", status: "Pending", date: "In Review", comments: "National branding launch campaign under review." },
    { role: "Board Member", user: "Rajat Verma", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Excellent unit economics and 85/100 Overall Score (88 Model, 90 Compliance, ₹25 Cr Forecast). Approved for Expansion.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Business_Plan.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Operations_Manual.pdf", type: "PDF Document", size: "5.8 MB", date: "16 May 2024", uploader: "Arjun Desai" },
    { id: "3", name: "Franchise_Agreement.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Neha Kapoor" },
    { id: "4", name: "SOP_Handbook.pdf", type: "PDF Document", size: "3.2 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Model_Financials.xlsx", type: "Excel Spreadsheet", size: "1.6 MB", date: "14 May 2024", uploader: "Manish Gupta" },
    { id: "6", name: "Legal_Compliance.pdf", type: "PDF Document", size: "1.4 MB", date: "13 May 2024", uploader: "Neha Kapoor" },
    { id: "7", name: "Market_Research.pdf", type: "PDF Document", size: "2.1 MB", date: "12 May 2024", uploader: "Sneha Nair" },
    { id: "8", name: "Site_Layout.pdf", type: "PDF Document", size: "3.5 MB", date: "11 May 2024", uploader: "Arjun Desai" },
    { id: "9", name: "Training_Program.pdf", type: "PDF Document", size: "1.9 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:20 PM", user: "Rahul Sharma", action: "Updated Outlets Target (150) and Revenue Forecast (₹25 Cr)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Kapoor", action: "Uploaded Franchise_Agreement.pdf and Legal_Compliance.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Intelligence Score (86/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Manish Gupta", action: "CFO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:20 AM", user: "Rahul Sharma", action: "Franchise Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.franchiseProject ?? "",
    ownerName: record.franchiseDevManager ?? "",
    recordCode: record.id ?? record.franchiseId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getFranchiseFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveFranchiseDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitFranchiseFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewFranchiseFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const c = await getOrDefault();
    c.approvalDecision = data.decision;
    c.reviewComments = data.comments ?? "";
    c.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : c.workflowStatus;
    return await saveRecord(c);
  });
