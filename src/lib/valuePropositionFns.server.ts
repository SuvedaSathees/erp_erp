import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "value-proposition";

const DEFAULT_RECORD: any = {
  vpId: "BM-2024-00045",
  formCode: "BMD-2024-25",
  vpTitle: "AI-IoT Platform Business Model",
  vpNumber: "BMN-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Digital Solutions",
  businessModel: "AI-IoT Platform Business Model",
  productService: "AI-IoT Platform",
  customerSegment: "Fleet Operators",
  businessOwner: "Rahul Sharma",
  productManager: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Development",
  businessObjective: "Deliver a reliable, intelligent EV charging solution that maximizes uptime and optimizes energy cost for fleet operators.",
  productVision: "To be the most trusted and intelligent EV charging platform for the future.",
  marketOpportunity: "Rapid adoption of EVs, high demand for scalable and smart charging infrastructure.",
  customerPersona: "Fleet Operations Manager",
  industry: "Electric Vehicles",
  lifecycleStage: "Growth",
  priority: "High",
  projectStatus: "Development",
  jobsToBeDone: "Operate charging stations reliably with minimal downtime.",
  painPoints: "Unplanned downtime, high energy costs, lack of remote visibility.",
  customerNeeds: "Reliable, smart, scalable, cost-effective charging with remote monitoring.",
  existingAlternatives: "Manual monitoring, basic chargers, legacy systems.",
  customerFrustrations: "Downtime, billing issues, lack of real-time insights.",
  customerPriority: "Critical",
  problemSeverityScore: 92,
  proposedSolution: "Smart EV charging platform with AI analytics, remote control & predictive maintenance.",
  vpStatement: "We help fleet operators maximize charger uptime and reduce energy costs with our intelligent EV charging platform.",
  keyBenefits: "Higher uptime, lower energy cost, remote control, predictive maintenance.",
  differentiation: "AI-powered optimization, real-time monitoring, open integration.",
  customerGains: "Operational efficiency, cost savings, better user experience.",
  innovationElements: "AI algorithms, IoT connectivity, cloud analytics, mobile app.",
  valueStrengthScore: 89,
  customerValueScore: 85,
  competitors: ["ChargePoint", "EVBox", "ABB", "Siemens"],
  competitiveAdvantages: "AI-driven optimization, predictive maintenance, open ecosystem.",
  usp: "Most intelligent, scalable and reliable EV charging platform.",
  matrixFile: "VP_Comparison_Matrix.pdf",
  switchingBarriers: "High integration cost, trained users, operational process.",
  competitiveRisk: "Rapid tech changes, new entrants, pricing pressure.",
  competitiveScore: 84,
  customerInterviews: 28,
  surveysCompleted: 156,
  prototypeTested: true,
  customerFeedback: "Very positive feedback on uptime and remote monitoring.",
  pmfScore: 86,
  npsScore: 52,
  validationScore: 85,
  pricingStrategy: "Value-Based Pricing",
  expectedCustomerValue: 240000,
  estimatedRevenueImpact: 250000000,
  commercialReadinessScore: 85,
  aiCustomerInsights: "High demand for uptime and cost saving.",
  aiMarketOpportunity: "Market will grow at 28% CAGR over 5 years.",
  aiPricingRecommendation: "Value-based pricing with tiered plans.",
  aiAdoptionPrediction: "High adoption expected in next 24 months.",
  aiValueScore: 91,
  recommendation: "Approve Value Proposition",
  userReviewComments: "Strong customer validation with 86/100 PMF score and ₹25 Cr estimated revenue impact.",
  userDecision: "Approved",
  userApprovalDate: "2024-05-17",
  approvals: [
    { role: "Product Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024" },
    { role: "Marketing Manager", user: "Neha Reddy", status: "Approved", date: "09 May 2024" },
    { role: "Sales Manager", user: "Vikram Singh", status: "Approved", date: "10 May 2024" },
    { role: "Customer Success Mgr", user: "Priya Nair", status: "Approved", date: "11 May 2024" },
    { role: "Business Dev Manager", user: "Anil Kumar", status: "Pending", date: "In Review" },
    { role: "Strategy Head", user: "Anil Mehta", status: "Pending", date: "Awaiting" },
    { role: "COO", user: "Rakesh Patel", status: "Pending", date: "Awaiting" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate" },
  ],
  attachments: [
    { id: "1", name: "VP_Canvas.pdf", size: "2.1 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Customer_Research.pdf", size: "5.4 MB", date: "16 May 2024", uploader: "Neha Reddy" },
    { id: "3", name: "Market_Research.pdf", size: "8.2 MB", date: "15 May 2024", uploader: "Neha Reddy" },
    { id: "4", name: "Competitor_Analysis.pdf", size: "3.5 MB", date: "13 May 2024", uploader: "Vikram Singh" },
    { id: "5", name: "Customer_Interviews.pdf", size: "4.1 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Survey_Results.xlsx", size: "1.8 MB", date: "12 May 2024", uploader: "Priya Nair" },
    { id: "7", name: "Sales_Presentation.pdf", size: "6.7 MB", date: "11 May 2024", uploader: "Vikram Singh" },
    { id: "8", name: "Supporting_Documents.zip", size: "12.4 MB", date: "11 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "1", user: "Rahul Sharma", action: "Updated Value Proposition Statement and Customer Gains", date: "17 May 2024", time: "03:45 PM" },
    { id: "2", user: "Neha Reddy", action: "Uploaded Customer_Research.pdf with survey data", date: "16 May 2024", time: "11:20 AM" },
    { id: "3", user: "AI Neural Engine", action: "Generated AI Assessment Score (91/100)", date: "14 May 2024", time: "05:10 PM" },
    { id: "4", user: "Priya Nair", action: "Customer Success Review Completed", date: "11 May 2024", time: "02:30 PM" },
    { id: "5", user: "Rahul Sharma", action: "Value Proposition Form Created", date: "08 May 2024", time: "10:00 AM" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.vpTitle ?? "",
    ownerName: record.businessOwner ?? record.productManager ?? "",
    recordCode: record.id ?? record.vpId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getValuePropositionFn = createServerFn({ method: "GET" }).handler(async () => {
  return await getOrDefault();
});

export const saveValuePropositionDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    return await saveRecord({ ...current, ...data.input });
  });

export const submitValuePropositionFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const current = await getOrDefault();
    current.workflowStatus = "Under Review";
    return await saveRecord(current);
  });

export const reviewValuePropositionFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    current.approvalDecision = data.decision;
    current.reviewComments = data.comments ?? "";
    current.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : current.workflowStatus;
    return await saveRecord(current);
  });
