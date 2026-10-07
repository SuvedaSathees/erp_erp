import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "revenue-model";

const DEFAULT_RECORD: any = {
  revenueModelId: "RM-2024-00027",
  formCode: "RMF-2024-25",
  revenueModelName: "EV Charging Revenue Model",
  revenueModelNumber: "RMN-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "EV Solutions",
  productService: "EV Fast Charger",
  revenueManager: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Revenue Planning",

  businessObjective: "Build scalable and profitable EV charging business across India.",
  revenueObjective: "Achieve ₹ 130 Cr revenue in 3 years with 35% CAGR.",
  businessModelRef: "BM-2024-001",
  pricingStrategyRef: "PS-2024-010",
  targetMarket: ["India", "South Asia", "Middle East"],
  revenueModelType: "Subscription + Transaction",
  lifecycleStage: "Commercial Validation",
  priority: "High",

  primaryRevenueStream: "Subscription",
  secondaryRevenueStreams: ["Transaction Fee", "Service", "AMC"],
  oneTimeRevenue: 1850000,
  recurringRevenue: 5240000,
  transactionRevenue: 2230000,
  serviceRevenue: 870000,
  licensingRevenue: 410000,
  revenueDiversificationScore: 84,

  customerSegment: "Commercial Fleet Operators",
  clv: 125000,
  cac: 8500,
  cacLtvRatio: "1 : 14.7",
  arpu: 2450,
  retentionRate: 92,
  churnRate: 6.8,
  monetizationScore: 87,

  annualRevenueForecast: 1260000000,
  mrr: 10200000,
  arr: 122400000,
  grossMargin: 41.5,
  ebitdaMargin: 32.2,
  breakevenTimeline: 16,
  roi: 28.6,
  financialHealthScore: 88,

  directSalesRevenue: 4860000,
  dealerRevenue: 1620000,
  franchiseRevenue: 1270000,
  marketplaceRevenue: 780000,
  subscriptionRevenue: 3450000,
  digitalPlatformRevenue: 750000,
  channelPerformanceScore: 82,

  revenueRisks: "High competition and price pressure",
  customerDependencyRisk: "Medium - Top 10 customers 38%",
  marketRisks: "Policy changes, charging infra growth",
  regulatoryRisks: "Electricity pricing regulations",
  sustainabilityPlan: "Expand infra, diversify segments, long-term contracts",
  riskScore: 76,

  aiRevenueForecast: "AI predicts ₹ 132 Cr revenue in 3 years with 36% CAGR",
  aiCustomerProfitability: "Fleet segment most profitable with CLV ₹ 1,42,000",
  aiPricingOptimization: "Dynamic pricing can improve revenue by 8-12%",
  aiRevenueOpportunity: "Expand in Tier 2/3 cities & highway corridors",
  aiChurnPrediction: "Churn likely to reduce to 5.5% with loyalty program",
  aiGrowthRecommendations: "Add energy storage & carbon credit revenue streams",
  aiRevenueScore: 91,

  recommendation: "Proceed to Business Scaling",

  approvals: [
    { role: "Revenue Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "Comprehensive multi-stream revenue model validated." },
    { role: "Finance Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024", comments: "1:14.7 CAC:LTV ratio and 41.5% margin approved." },
    { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "Direct and channel revenue planning aligned." },
    { role: "Marketing Manager", user: "Sneha Iyer", status: "Approved", date: "11 May 2024", comments: "6.8% churn target and retention campaign approved." },
    { role: "BD Manager", user: "Ankit Patel", status: "Approved", date: "12 May 2024", comments: "Franchise and marketplace revenue streams confirmed." },
    { role: "Strategy Head", user: "Vikram Malhotra", status: "Pending", date: "In Review", comments: "3-year scaling projection under executive review." },
    { role: "COO", user: "Rajat Verma", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Strong financial sustainability (86/100 Overall Score, ₹1.02 Cr MRR, 1:14.7 CAC:LTV, ₹126 Cr Annual Forecast). Approved for Business Scaling.",
  userApprovalDate: "2024-05-17",

  attachments: [
    { id: "1", name: "Revenue_Model_Canvas.pdf", type: "PDF Document", size: "4.2 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Financial_Forecast.xlsx", type: "Excel Spreadsheet", size: "5.6 MB", date: "16 May 2024", uploader: "Neha Reddy" },
    { id: "3", name: "Pricing_Strategy.pdf", type: "PDF Document", size: "3.8 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "4", name: "Revenue_Projection.docx", type: "Word Document", size: "2.1 MB", date: "14 May 2024", uploader: "Vikram Singh" },
    { id: "5", name: "Subscription_Plan.pdf", type: "PDF Document", size: "3.2 MB", date: "13 May 2024", uploader: "Sneha Iyer" },
    { id: "6", name: "Franchise_Revenue_Plan.pdf", type: "PDF Document", size: "2.9 MB", date: "12 May 2024", uploader: "Ankit Patel" },
  ],

  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated MRR (₹1.02 Cr) and ARR (₹12.24 Cr) forecasts", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Reddy", action: "Uploaded Financial_Forecast.xlsx with 1:14.7 CLV:CAC validation", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Revenue Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Ankit Patel", action: "BD Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:20 AM", user: "Rahul Sharma", action: "Revenue Model Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.revenueModelName ?? "",
    ownerName: record.revenueManager ?? "",
    recordCode: record.id ?? record.revenueModelId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getRevenueModelFn = createServerFn({ method: "GET" }).handler(async () => await getOrDefault());

export const saveRevenueModelDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    return await saveRecord({ ...current, ...data.input });
  });

export const submitRevenueModelFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const current = await getOrDefault();
    current.workflowStatus = "Under Review";
    return await saveRecord(current);
  });

export const reviewRevenueModelFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    current.approvalDecision = data.decision;
    current.reviewComments = data.comments ?? "";
    current.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : current.workflowStatus;
    return await saveRecord(current);
  });
