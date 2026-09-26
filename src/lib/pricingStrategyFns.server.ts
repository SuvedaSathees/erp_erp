import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "pricing-strategy";

const DEFAULT_RECORD: any = {
  pricingId: "PS-2024-00038",
  formCode: "PSF-2024-25",
  pricingProject: "EV Fast Charger Pricing Strategy",
  pricingNumber: "PSN-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  productService: "EV Fast Charger",
  productVersion: "v2.1",
  businessUnit: "EV Solutions",
  pricingManager: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Pricing Validation",
  businessObjective: "Maximize profitability for EV charging solutions.",
  pricingObjective: "Achieve 25% Gross Margin with market competitiveness.",
  productCategory: "EV Charging Infrastructure",
  marketSegment: ["Commercial", "Industrial", "Residential"],
  geographicMarket: ["India", "USA", "Europe", "Australia"],
  pricingStrategyType: "Value-Based Pricing",
  lifecycleStage: "Commercial Validation",
  priority: "High",
  materialCost: 18500,
  manufacturingCost: 7200,
  logisticsCost: 2300,
  marketingCost: 3000,
  salesCost: 2800,
  overheadCost: 3100,
  totalCost: 36900,
  targetMargin: 25,
  breakevenPrice: 49200,
  costCompetitivenessScore: 84,
  marketAveragePrice: 56500,
  lowestCompetitorPrice: 45000,
  highestCompetitorPrice: 72000,
  competitorPricingMatrixFile: "competitor_matrix.pdf",
  customerWillingnessToPay: 60000,
  priceElasticity: "Moderately Elastic",
  competitivePricingScore: 82,
  revenueModel: "Product Sales",
  pricingMethod: "Tiered Pricing",
  sellingPrice: 59900,
  discountPolicy: "Volume & Early Payment",
  promotionalPricing: "Launch Offer 5%",
  channelPricing: "Differentiated by Channel",
  franchiseDealerPricing: "12% Margin",
  pricingReadinessScore: 85,
  revenueForecast: 268000000,
  grossMargin: 25.4,
  netMargin: 18.7,
  roi: 31.2,
  contributionMargin: 150800000,
  paybackPeriod: 18,
  financialScore: 87,
  pricingRisks: "Market price sensitivity",
  competitiveRisks: "Aggressive competitor pricing",
  regulatoryRisks: "Import duty & compliance changes",
  customerAcceptanceRisk: "Medium - Price sensitivity",
  mitigationPlan: "Value communication, bundled offers, cost optimization",
  riskScore: 76,
  aiPriceOptimization: "Recommended price ₹ 59,900",
  aiDemandForecast: "Strong demand, 24% CAGR",
  aiElasticityAnalysis: "Price elasticity -0.92",
  aiRevenuePrediction: "₹ 28,40,00,000 in Year 1",
  aiDiscountRecommendation: "Optimal discount 3-5%",
  aiCompetitiveInsights: "Price positioned above average with high value perception",
  aiPricingScore: 91,
  recommendation: "Approve Pricing Strategy",
  approvals: [
    { role: "Pricing Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "Detailed cost analysis & value pricing validated." },
    { role: "Finance Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024", comments: "25.4% gross margin and 18-month payback approved." },
    { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "Tiered pricing aligns with sales channel targets." },
    { role: "Marketing Manager", user: "Sneha Iyer", status: "Approved", date: "11 May 2024", comments: "5% launch promotional pricing approved." },
    { role: "Product Manager", user: "Ankit Verma", status: "Pending", date: "In Review", comments: "BOM cost optimization under review." },
    { role: "BD Manager", user: "Arjun Patel", status: "Pending", date: "In Review", comments: "Channel partner margin breakdown review." },
    { role: "COO", user: "Rakesh Patel", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Excellent financial modeling (86/100 Readiness, ₹59,900 Selling Price, 25.4% Margin, ₹26.8 Cr Forecast). Approved for GTM.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Cost_Sheet.xlsx", type: "Excel Spreadsheet", size: "3.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Competitor_Pricing.pdf", type: "PDF Document", size: "4.1 MB", date: "16 May 2024", uploader: "Vikram Singh" },
    { id: "3", name: "Financial_Model.xlsx", type: "Excel Spreadsheet", size: "5.8 MB", date: "15 May 2024", uploader: "Neha Reddy" },
    { id: "4", name: "Pricing_Calculator.xlsx", type: "Excel Spreadsheet", size: "2.8 MB", date: "14 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Approval_Docs.pdf", type: "PDF Document", size: "1.9 MB", date: "13 May 2024", uploader: "Sneha Iyer" },
    { id: "6", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "13.6 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Selling Price and Total Cost structure", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Reddy", action: "Uploaded Financial_Model.xlsx", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Pricing Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Sneha Iyer", action: "Marketing Manager Approval Completed", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:20 AM", user: "Rahul Sharma", action: "Pricing Strategy Project Initialized", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.pricingProject ?? "",
    ownerName: record.pricingManager ?? "",
    recordCode: record.id ?? record.pricingId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getPricingStrategyFn = createServerFn({ method: "GET" }).handler(async () => {
  return await getOrDefault();
});

export const savePricingStrategyDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    return await saveRecord({ ...current, ...data.input });
  });

export const submitPricingStrategyFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const current = await getOrDefault();
    current.workflowStatus = "Under Review";
    return await saveRecord(current);
  });

export const reviewPricingStrategyFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    current.approvalDecision = data.decision;
    current.reviewComments = data.comments ?? "";
    current.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : current.workflowStatus;
    return await saveRecord(current);
  });
