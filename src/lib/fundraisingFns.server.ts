import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "fundraising";

const DEFAULT_RECORD: any = {
  fundraisingId: "FD-2024-00057",
  formCode: "FDF-2024-25",
  fundraisingProject: "Growth Expansion Initiative",
  fundraisingNumber: "FUND-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "EV Solutions",
  fundingRound: "Series B",
  investorRelationsRef: "IR-2024-0012",
  fundraisingManager: "Rahul Sharma",
  createdDate: "05 May 2024 10:20 AM",
  lastModifiedDate: "17 May 2024 04:35 PM",
  workflowStage: "Investor Engagement",
  businessObjective: "Raise growth capital to expand manufacturing capacity, R&D, and market reach.",
  fundraisingObjective: "Secure Series B funding to accelerate product development and scale international operations.",
  fundingType: "Venture Capital",
  fundingStage: "Series B",
  capitalRequired: 1500000000,
  targetClosingDate: "2024-09-30",
  currency: "INR",
  strategicPriority: "High",
  lifecycleStage: "Investor Engagement",
  priority: "High",
  currentValuation: 2500000000,
  targetValuation: 5000000000,
  equityOffered: 18.0,
  preMoneyValuation: 4500000000,
  postMoneyValuation: 6000000000,
  runwayExtension: 24,
  fundUtilizationPlan: "Expand production facility, product development, marketing, and working capital.",
  capitalPlanningScore: 86,
  investorCategory: "Venture Capital",
  targetInvestors: ["Sequoia Capital", "Accel Partners", "Lightspeed Venture", "Tiger Global"],
  ticketSize: 200000000,
  industryFocus: ["Clean Energy", "EV Tech"],
  geographicFocus: ["North America", "Europe", "Asia Pacific"],
  investorShortlist: "INV-SHORTLIST-24-8",
  investorReadinessScore: 82,
  pitchDeckReady: true,
  financialModelReady: true,
  dataRoomReady: true,
  investorMeetings: 15,
  investorPitchesCompleted: 12,
  loisReceived: 4,
  activeNegotiations: 2,
  executionScore: 78,
  financialDueDiligence: true,
  legalDueDiligence: true,
  technicalDueDiligence: true,
  commercialDueDiligence: true,
  ipDueDiligence: true,
  complianceStatus: true,
  dueDiligenceScore: 85,
  leadInvestor: "Sequoia Capital",
  proposedInvestment: 750000000,
  valuationAgreed: 4500000000,
  equityAgreed: 16.67,
  termSheetStatus: "Under Negotiation",
  spaStatus: "Draft",
  closingProbability: 70.0,
  negotiationScore: 75,
  boardApproval: true,
  shareholderApproval: true,
  rocCompliance: true,
  femaCompliance: true,
  sebiCompliance: true,
  companySecretarialReview: true,
  governanceScore: 90,
  aiInvestorMatching: "High match with 4 investors",
  aiValuationBenchmark: "₹ 420 Cr - ₹ 480 Cr range",
  aiFundingProbability: "76% probability of successful close",
  aiRiskAnalysis: "Low to Medium risk",
  aiNegotiationRecommendation: "Focus on valuation & liquidity terms",
  aiFundUtilizationOptimization: "Supported allocation model ready",
  aiFundraisingScore: 88,
  recommendation: "Proceed to Investor Meetings",
  approvals: [
    { role: "Fundraising Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "₹150 Cr target, 4 LOIs received, and capital plan verified." },
    { role: "CFO", user: "Anita Verma", status: "Approved", date: "09 May 2024", comments: "Pre-money valuation of ₹450 Cr and unit economics approved." },
    { role: "CEO", user: "Vikram Mehta", status: "Approved", date: "10 May 2024", comments: "Target investor syndicate and 16.67% equity agreed." },
    { role: "Company Secretary", user: "Neha Kapoor", status: "Pending", date: "In Review", comments: "ROC filings and shareholder resolution draft." },
    { role: "Legal Head", user: "Arjun Desai", status: "Pending", date: "In Review", comments: "SPA/SHA term sheet review." },
    { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Strong capital runway extension & 83/100 Overall Score (86 Capital Planning, 90 Governance, ₹75 Cr Lead Investor). Approved.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Pitch_Deck.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Business_Plan.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Financial_Model.xlsx", type: "Excel Spreadsheet", size: "1.6 MB", date: "16 May 2024", uploader: "Anita Verma" },
    { id: "4", name: "Cap_Table.xlsx", type: "Excel Spreadsheet", size: "450 KB", date: "15 May 2024", uploader: "Neha Kapoor" },
    { id: "5", name: "Valuation_Report.pdf", type: "PDF Document", size: "1.2 MB", date: "14 May 2024", uploader: "Anita Verma" },
    { id: "6", name: "Data_Room_Index.pdf", type: "PDF Document", size: "350 KB", date: "13 May 2024", uploader: "Rahul Sharma" },
    { id: "7", name: "Term_Sheet.pdf", type: "PDF Document", size: "280 KB", date: "12 May 2024", uploader: "Arjun Desai" },
    { id: "8", name: "SPA_SHA.pdf", type: "PDF Document", size: "1.2 MB", date: "11 May 2024", uploader: "Arjun Desai" },
    { id: "9", name: "Board_Resolution.pdf", type: "PDF Document", size: "300 KB", date: "10 May 2024", uploader: "Neha Kapoor" },
    { id: "10", name: "Due_Diligence_Reports.zip", type: "ZIP Archive", size: "2.7 MB", date: "09 May 2024", uploader: "Anita Verma" },
    { id: "11", name: "Supporting_Docs.pdf", type: "PDF Document", size: "1.1 MB", date: "08 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:35 PM", user: "Rahul Sharma", action: "Updated Lead Investor (Sequoia Capital) and Proposed Investment (₹75 Cr)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Arjun Desai", action: "Uploaded Term_Sheet.pdf and SPA_SHA.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Fundraising Score (88/100)", status: "AI System" },
    { id: "a4", date: "10 May 2024", time: "02:30 PM", user: "Vikram Mehta", action: "CEO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:20 AM", user: "Rahul Sharma", action: "Fundraising Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.fundraisingProject ?? "",
    ownerName: record.fundraisingManager ?? "Rahul Sharma",
    recordCode: record.id ?? record.fundraisingId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getFundraisingFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveFundraisingDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitFundraisingFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewFundraisingFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const c = await getOrDefault();
    c.approvalDecision = data.decision;
    c.reviewComments = data.comments ?? "";
    c.workflowStatus =
      data.decision === "approved"
        ? "Approved"
        : data.decision === "rejected"
          ? "Rejected"
          : c.workflowStatus;
    return await saveRecord(c);
  });
