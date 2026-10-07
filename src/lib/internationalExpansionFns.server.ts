import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "international-expansion";

const DEFAULT_RECORD: any = {
  expansionId: "EXP-2024-00042",
  formCode: "EXPF-2024-25",
  expansionProject: "Global Market Entry - Europe",
  expansionNumber: "EXP-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Global Business",
  countryRegion: "Germany",
  countryFlag: "🇩🇪",
  expansionManager: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Business Setup",
  businessObjective: "Establish strong presence in European market and achieve sustainable growth.",
  expansionObjective: "Launch operations in Germany and build distribution network in DACH region.",
  targetCountry: "Germany",
  region: "Europe",
  marketEntryStrategy: "Wholly Owned Subsidiary",
  expansionPhase: "Business Setup",
  strategicPriority: "High",
  estimatedLaunchDate: "2024-10-01",
  marketSize: 120000000000,
  tam: 12000000000,
  sam: 2500000000,
  som: 350000000,
  customerSegments: ["Industrial", "Automotive", "Retail", "Healthcare"],
  marketGrowthRate: 6.8,
  competitionLevel: "Medium",
  marketAttractivenessScore: 82,
  easeOfDoingBusiness: 82,
  politicalStability: 76,
  economicStability: 78,
  currencyRisk: "Low",
  taxEnvironment: "Favorable",
  laborAvailability: "High",
  infrastructureReadiness: 80,
  countryReadinessScore: 81,
  companyRegistration: true,
  businessLicense: true,
  importLicense: true,
  exportLicense: true,
  productCertification: true,
  localTaxRegistration: true,
  customsCompliance: true,
  regulatoryReadinessScore: 88,
  revenueModel: "Product Sales",
  pricingStrategy: "Value Based Pricing",
  salesChannel: "Direct Sales",
  distributionStrategy: "Hybrid Distribution",
  partnershipStrategy: "Strategic Partnership",
  localizationStrategy: "Local language support, regional marketing, and compliance with EU standards.",
  commercialReadinessScore: 84,
  manufacturingSource: "Existing Facility",
  warehouseStrategy: "Regional Warehouse",
  logisticsNetwork: "3PL Partner",
  inventoryStrategy: "Regional Inventory",
  localServicePartner: "TechServe GmbH",
  erpLocalization: true,
  supplyChainReadinessScore: 80,
  initialInvestment: 5000000,
  operatingBudget: 2000000,
  revenueProjection: 12000000,
  breakEvenPeriod: 24,
  roi: 22.5,
  fundingSource: "Internal Capital",
  financialReadinessScore: 85,
  politicalRisk: "Low",
  economicRisk: "Medium",
  currencyRiskVal: "Low",
  supplyChainRisk: "Medium",
  legalRisk: "Low",
  cybersecurityRisk: "Medium",
  riskMitigationPlan: "Diversify suppliers, hedge currency risk, and ensure legal compliance.",
  overallRiskScore: 72,
  aiCountryRanking: "#2 out of 25 countries",
  aiMarketOpportunity: "High opportunity with strong demand in automotive and industrial solutions.",
  aiEntryStrategyRecommendation: "Wholly owned subsidiary for long-term growth and brand control.",
  aiPricingRecommendation: "Premium pricing with value-added services.",
  aiDemandForecast: "12-15% CAGR over next 5 years.",
  aiRiskPrediction: "Moderate risk; focus on compliance and local partnerships.",
  aiExpansionScore: 86,
  recommendation: "Proceed to Market Entry",
  approvals: [
    { role: "Expansion Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "€12M 3-yr forecast & German subsidiary setup plan validated." },
    { role: "Intl Business Head", user: "Anita Verma", status: "Approved", date: "09 May 2024", comments: "Wholly owned subsidiary model and DACH expansion approved." },
    { role: "Finance Head", user: "Vikram Mehta", status: "Approved", date: "10 May 2024", comments: "€5M initial investment and 22.5% ROI forecast verified." },
    { role: "Legal Head", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "EU GDPR, CE certification, and German tax structure cleared." },
    { role: "Supply Chain Head", user: "Arjun Patel", status: "Pending", date: "In Review", comments: "TechServe GmbH 3PL agreement under final review." },
    { role: "COO", user: "Amit Mehta", status: "Pending", date: "In Review", comments: "Operating budget allocation review." },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
    { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Strong European expansion feasibility & 83/100 Overall Score (88 Regulatory, 85 Financial, €12M Projected Revenue). Approved.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Market_Research_Report.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Country_Analysis.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Anita Verma" },
    { id: "3", name: "Regulatory_Documents.pdf", type: "PDF Document", size: "3.1 MB", date: "16 May 2024", uploader: "Neha Kapoor" },
    { id: "4", name: "Financial_Model.xlsx", type: "Excel Spreadsheet", size: "1.6 MB", date: "15 May 2024", uploader: "Vikram Mehta" },
    { id: "5", name: "Business_Plan.pdf", type: "PDF Document", size: "2.7 MB", date: "14 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Distribution_Agreements.pdf", type: "PDF Document", size: "1.2 MB", date: "13 May 2024", uploader: "Arjun Patel" },
    { id: "7", name: "Risk_Assessment.pdf", type: "PDF Document", size: "1.1 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "8", name: "Localization_Plan.pdf", type: "PDF Document", size: "1.4 MB", date: "11 May 2024", uploader: "Anita Verma" },
    { id: "9", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "3.2 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:20 PM", user: "Rahul Sharma", action: "Updated Initial Investment (€5M) and Revenue Projection (€12M)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Kapoor", action: "Uploaded Regulatory_Documents.pdf and Country_Analysis.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Expansion Score (86/100)", status: "AI System" },
    { id: "a4", date: "11 May 2024", time: "02:30 PM", user: "Neha Kapoor", action: "Legal Head Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:15 AM", user: "Rahul Sharma", action: "International Expansion Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.expansionProject ?? "",
    ownerName: record.expansionManager ?? "",
    recordCode: record.id ?? record.expansionId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getInternationalExpansionFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveInternationalExpansionDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitInternationalExpansionFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewInternationalExpansionFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const c = await getOrDefault();
    c.approvalDecision = data.decision;
    c.reviewComments = data.comments ?? "";
    c.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : c.workflowStatus;
    return await saveRecord(c);
  });
