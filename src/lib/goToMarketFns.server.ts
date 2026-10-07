import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "go-to-market";

const DEFAULT_RECORD: any = {
  gtmId: "GTM-2024-00045",
  formCode: "GTMF-2024-25",
  gtmProject: "EV Fast Charger Market Launch",
  gtmNumber: "GTM-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  productService: "EV Fast Charger",
  productVersion: "v2.1",
  businessUnit: "EV Solutions",
  gtmManager: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "GTM Planning",

  businessObjective: "Increase market share in EV Infrastructure.",
  launchObjective: "Launch v2.1 across India in Q3 FY 2024.",
  productCategory: "Charging Infrastructure",
  targetIndustry: ["Automotive", "Energy", "Real Estate"],
  geographicMarket: ["India", "UAE", "Singapore", "Australia"],
  launchType: "National Launch",
  lifecycleStage: "GTM Planning",
  priority: "High",

  customerSegments: ["Fleet Operators", "Commercial", "Residential"],
  icp: "Large Fleet Operators",
  buyerPersona: "Fleet Operations Head",
  customerPainPoints: "High downtime, complex setup, limited uptime",
  customerBuyingJourney: "Awareness -> Evaluation -> Purchase -> Retention",
  customerAcquisitionStrategy: "Direct Sales, Channel Partners, Digital",
  marketReadinessScore: 85,

  valuePropRef: "VP-2024-0005",
  usp: "Fast, reliable, smart & future-ready charging",
  brandPositioning: "Leading provider of intelligent EV charging",
  keyMessaging: "Powering the future of mobility",
  elevatorPitch: "Smart charging solutions for a sustainable future",
  competitiveDifferentiation: "AI-powered, 98% uptime, remote monitoring",
  messagingScore: 87,

  salesModel: "Direct + Channel",
  salesChannels: ["Direct Sales", "Distributors", "OEM", "Online"],
  channelPartners: "15 Partners Selected",
  salesTargets: 250000000,
  leadGenStrategy: "Digital, Events, Referrals, Partners",
  salesEnablementAsset: "sales_playbook.pdf",
  salesReadinessScore: 84,

  marketingChannels: ["Website", "SEO", "Social Media", "Email", "Events", "PR & Media", "Webinars"],
  campaignStrategy: "Integrated 360° campaign",
  digitalMarketingPlan: "SEO, ADS, Social, Email, Automation",
  prStrategy: "Media outreach, Press releases",
  contentMarketingPlan: "Blogs, Case studies, Videos, Whitepapers",
  marketingBudget: 12500000,
  marketingReadinessScore: 87,

  pricingStrategy: "Value-Based Pricing",
  revenueForecast: 250000000,
  grossMargin: 42,
  breakevenTimeline: 14,
  revenueModel: "Subscription + Service",
  financialRiskAssessment: "Low - Market demand is high",
  commercialScore: 83,

  productReadiness: true,
  manufacturingReadiness: true,
  inventoryReadiness: true,
  salesTeamReady: true,
  marketingAssetsReady: true,
  customerSupportReady: true,
  launchReadinessScore: 90,

  aiMarketOpportunity: "High demand in fleet & commercial",
  aiDemandForecast: "Strong demand with 32% CAGR",
  aiPricingRecommendation: "Premium pricing with value bundles",
  aiCampaignOptimization: "Focus on digital + partner events",
  aiRevenuePrediction: "Projected revenue of ₹26.80 Cr in Year 1",
  aiGtmRecommendations: "Expand partner network, focus on uptime",
  aiGtmScore: 91,

  recommendation: "Proceed to Product Launch",

  approvals: [
    { role: "BD Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "GTM strategy and sales enablement validated." },
    { role: "Marketing Manager", user: "Vikram Singh", status: "Approved", date: "09 May 2024", comments: "Integrated 360 campaign strategy approved." },
    { role: "Sales Manager", user: "Sneha Iyer", status: "Approved", date: "10 May 2024", comments: "15 Channel partners selected & onboarded." },
    { role: "Product Manager", user: "Ankit Verma", status: "Approved", date: "11 May 2024", comments: "v2.1 EV charger product launch ready." },
    { role: "Finance Manager", user: "Neha Reddy", status: "Approved", date: "12 May 2024", comments: "Financial forecast & 42% margin validated." },
    { role: "Operations Manager", user: "Vikram Patel", status: "Pending", date: "In Review", comments: "Supply chain inventory build under process." },
    { role: "COO", user: "Rakesh Patel", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "High overall GTM readiness (88/100, 90 Launch Readiness, 87 Marketing, ₹25 Cr Forecast). Approved for Product Launch.",
  userApprovalDate: "2024-05-17",

  attachments: [
    { id: "1", name: "GTM_Strategy.pdf", type: "PDF Document", size: "4.5 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Launch_Plan.pdf", type: "PDF Document", size: "3.8 MB", date: "16 May 2024", uploader: "Vikram Singh" },
    { id: "3", name: "Marketing_Campaign.pdf", type: "PDF Document", size: "5.2 MB", date: "16 May 2024", uploader: "Vikram Singh" },
    { id: "4", name: "Sales_Playbook.pdf", type: "PDF Document", size: "3.1 MB", date: "15 May 2024", uploader: "Sneha Iyer" },
    { id: "5", name: "Pricing_Strategy.xlsx", type: "Excel Spreadsheet", size: "2.4 MB", date: "14 May 2024", uploader: "Neha Reddy" },
    { id: "6", name: "Revenue_Forecast.xlsx", type: "Excel Spreadsheet", size: "1.9 MB", date: "14 May 2024", uploader: "Neha Reddy" },
    { id: "7", name: "Launch_Checklist.pdf", type: "PDF Document", size: "1.2 MB", date: "13 May 2024", uploader: "Rahul Sharma" },
    { id: "8", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "14.8 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
  ],

  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Launch Readiness Score (90/100) and Revenue Forecast (₹25 Cr)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Vikram Singh", action: "Uploaded Marketing_Campaign.pdf and Launch_Plan.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI GTM Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Neha Reddy", action: "Finance Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:20 AM", user: "Rahul Sharma", action: "GTM Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.gtmProject ?? "",
    ownerName: record.gtmManager ?? "",
    recordCode: record.id ?? record.gtmId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getGoToMarketFn = createServerFn({ method: "GET" }).handler(async () => await getOrDefault());

export const saveGoToMarketDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    return await saveRecord({ ...current, ...data.input });
  });

export const submitGoToMarketFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const current = await getOrDefault();
    current.workflowStatus = "Under Review";
    return await saveRecord(current);
  });

export const reviewGoToMarketFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    current.approvalDecision = data.decision;
    current.reviewComments = data.comments ?? "";
    current.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : current.workflowStatus;
    return await saveRecord(current);
  });
