import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "business-model";

const DEFAULT_RECORD: any = {
  businessModelId: "BM-2024-00045",
  formCode: "BMD-2024-25",
  title: "AI-IoT Platform Business Model",
  number: "BMN-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Digital Solutions",
  productService: "AI-IoT Platform",
  owner: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Development",

  businessVision: "To build an intelligent AI-IoT platform that connects devices, transforms data into actionable insights, and drives operational excellence across global enterprise clients.",
  businessObjective: "Achieve $25M ARR within 5 years with 72%+ gross margin and global OEM partnership distribution.",
  category: "Platform",
  type: "B2B",
  industry: "Industrial IoT & Smart Automation",
  lifecycleStage: "Growth",
  priority: "High",
  projectStatus: "Development",

  customerProblem: "Lack of real-time visibility, predictive insights, and automated edge control in manufacturing & utilities equipment leading to high downtime.",
  proposedSolution: "Unified AI-IoT platform with real-time sensor analytics, automated workflow triggers, and zero-touch edge provisioning.",
  uvp: "Unified AI-IoT platform with predictive intelligence, real-time sensor analytics, and seamless SCADA/ERP integration.",
  competitiveAdvantage: "AI-driven edge insights, easy multi-cloud integration, scalable architecture, and patent-protected algorithms.",
  customerBenefits: "30% energy cost reduction, 45% unplanned downtime reduction, and 3x faster IoT deployment speed.",
  innovationScore: 88,
  uvpStrengthScore: 89,

  customerSegments: ["Manufacturing", "Energy", "Logistics", "Smart Buildings", "Utilities"],
  icp: "Mid to large enterprises seeking operational intelligence and predictive maintenance.",
  targetMarket: "Global Industrial IoT & Analytics Market",
  tam: 120000000000,
  sam: 35000000000,
  som: 2800000000,
  marketReadinessScore: 85,

  revenueStreams: ["Subscription", "Platform Fee", "Data Insights", "Custom Solutions"],
  pricingStrategy: "Value Based",
  pricingModel: "Subscription + Usage Tiered",
  grossMargin: 72.5,
  clv: 28500,
  cac: 1250,
  revenueScore: 85,

  fixedCosts: 2450000,
  variableCosts: 850000,
  opex: 1150000,
  capex: 3200000,
  profitabilityScore: 84,

  keyActivities: "Platform Development, Data Intelligence Engine Maintenance, Customer Success & System Integration",
  keyResources: "AI-IoT Software Platform, Cloud Infrastructure, Data Science Team, Customer Support Engineers",
  keyPartners: "Cloud Providers, OEMs, System Integrators, Technology Partners",
  channels: ["Direct Sales", "Channel Partners", "Marketplace", "OEM Partnerships"],
  relationshipModel: "Subscription + Executive Support",
  operationalReadiness: 86,

  expansionStrategy: "Geographic expansion into APAC & Europe, industry vertical expansion, and developer API partner ecosystem.",
  geoExpansion: ["Asia Pacific", "North America", "Europe", "Middle East"],
  franchiseModel: false,
  platformModel: true,
  digitalTransformation: true,
  scalabilityIndex: 88,
  growthReadinessScore: 87,

  risks: "Market Competition, Cyber Security, Technology Obsolescence",
  riskMitigation: "Diversification, Strong Security, Continuous Innovation, IP Expansion",
  compliance: ["GDPR", "ISO 27001", "SOC 2 Type II", "IEEE IoT Standards"],
  esg: "Energy Efficiency, Data Privacy, Sustainable Operations",
  ip: ["Patents", "Trademarks", "Copyrights", "Trade Secrets"],
  riskScore: 78,

  aiPerformanceInsights: "High potential for predictive analytics and automation in asset-intensive industries.",
  aiRevenuePrediction: "Strong recurring revenue growth potential with scalable subscription tiers.",
  aiMarketOpportunity: "Large untapped market with high adoption potential in Smart Manufacturing.",
  aiPricingRecommendation: "Value-based subscription pricing with tiered usage tiers recommended.",
  aiRiskPrediction: "Medium risk due to competitive market landscape and technology adoption speed.",
  aiGrowthSuggestions: "Expand partner ecosystem, accelerate OEM hardware bundle partnerships, and launch APAC sales hubs.",
  aiHealthScore: 91,

  marketScore: 86,
  scalabilityScore: 88,
  recommendation: "Approve Business Model",

  approvals: [
    { role: "BD Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "Valid UVP and clear market TAM." },
    { role: "Marketing Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024", comments: "Strong customer segment positioning." },
    { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "High channel partner interest confirmed." },
    { role: "Finance Manager", user: "Sanjay Patel", status: "Approved", date: "12 May 2024", comments: "Unit economics meet enterprise threshold." },
    { role: "Strategy Head", user: "Anil Mehta", status: "Pending", date: "In Review", comments: "Awaiting final TAM breakdown." },
    { role: "COO", user: "Priya Nair", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Rakesh Patel", status: "Pending", date: "Awaiting", comments: "" },
    { role: "Board Approval", user: "Executive Board", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Comprehensive business model with robust unit economics and strong market TAM.",
  userApprovalDate: "2024-05-17",

  attachments: [
    { id: "1", name: "Business_Model_Canvas.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Financial_Model.xlsx", type: "Excel Spreadsheet", size: "4.8 MB", date: "16 May 2024", uploader: "Sanjay Patel" },
    { id: "3", name: "Market_Research_Report.pdf", type: "PDF Document", size: "8.1 MB", date: "15 May 2024", uploader: "Neha Reddy" },
    { id: "4", name: "Competitor_Analysis.pdf", type: "PDF Document", size: "3.2 MB", date: "14 May 2024", uploader: "Vikram Singh" },
    { id: "5", name: "Pricing_Strategy.pdf", type: "PDF Document", size: "1.9 MB", date: "13 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Unit_Economics.xlsx", type: "Excel Spreadsheet", size: "1.4 MB", date: "12 May 2024", uploader: "Sanjay Patel" },
    { id: "7", name: "BreakEven_Analysis.pdf", type: "PDF Document", size: "2.8 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ],

  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Value Proposition and Revenue Model parameters", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Sanjay Patel", action: "Uploaded Financial_Model.xlsx and verified CAC/CLV", status: "Attachment" },
    { id: "a3", date: "14 May 2024", time: "05:10 PM", user: "AI Intelligence Engine", action: "Generated AI Business Assessment Score (91/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Sanjay Patel", action: "Finance Review Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "08 May 2024", time: "10:00 AM", user: "Rahul Sharma", action: "Business Model Form Created - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.title ?? "",
    ownerName: record.owner ?? "",
    recordCode: record.id ?? record.businessModelId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getBusinessModelFn = createServerFn({ method: "GET" }).handler(async () => await getOrDefault());

export const saveBusinessModelDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    return await saveRecord({ ...current, ...data.input });
  });

export const submitBusinessModelFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const current = await getOrDefault();
    current.workflowStatus = "Under Review";
    return await saveRecord(current);
  });

export const reviewBusinessModelFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    current.approvalDecision = data.decision;
    current.reviewComments = data.comments ?? "";
    current.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : current.workflowStatus;
    return await saveRecord(current);
  });
