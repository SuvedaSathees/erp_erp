import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "investor-relations";

const DEFAULT_RECORD: any = {
  investorRelationsId: "IR-2024-00056",
  formCode: "IRF-2024-25",
  irProjectName: "Series B Fundraise",
  irNumber: "IRN-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "EV Solutions",
  fundraisingRound: "Series B",
  investorRelationsManager: "Rahul Sharma",
  createdDate: "05 May 2024 09:45 AM",
  lastModifiedDate: "17 May 2024 04:20 PM",
  workflowStage: "Investor Engagement",
  businessObjective: "Raise growth capital to scale manufacturing and expand international footprint.",
  fundraisingObjective: "Raise ₹ 150 Cr to support product expansion and market penetration.",
  investorCategory: "Venture Capital",
  fundingStage: "Series B",
  capitalRequirement: 1500000000,
  strategicPriority: "High",
  lifecycleStage: "Investor Engagement",
  priority: "High",
  investorName: "Alpha Growth Ventures",
  investorType: "Venture Capital",
  organization: "Alpha Growth Ventures LLP",
  country: "United States",
  industryFocus: ["Automotive", "EV Tech", "Clean Energy"],
  investmentStage: "Series B",
  ticketSize: 250000000,
  portfolioCompanies: 18,
  investorFitScore: 87,
  investmentThesis: "Strong EV market opportunity with scalable technology and experienced leadership.",
  strategicAlignment: "Very Good",
  marketOpportunity: "High growth potential in EV 2W & 3W segment across emerging markets.",
  financialReadiness: "Good",
  dueDiligenceReadiness: true,
  dataRoomAvailable: true,
  assessmentScore: 84,
  initialContactDate: "2024-04-15",
  followUpSchedule: "2024-05-25",
  meetingStatus: "Scheduled",
  pitchDeckShared: true,
  ndaSigned: true,
  dataRoomAccess: true,
  engagementScore: 81,
  financialModel: "EV Financial Model - Series B",
  valuationReport: "Series B Valuation Report",
  capTable: "Cap Table - Series B",
  legalDueDiligence: true,
  secretarialCompliance: true,
  regulatoryCompliance: true,
  financialReadinessScore: 83,
  proposedInvestment: 1200000000,
  equityOffered: 18.5,
  valuation: 6500000000,
  termSheetStatus: "Under Review",
  negotiationStage: "Valuation Discussion",
  expectedClosingDate: "2024-06-30",
  negotiationScore: 78,
  quarterlyUpdateSent: true,
  financialReportShared: true,
  boardPresentation: true,
  kpiDashboardShared: true,
  investorQueriesClosed: true,
  communicationFrequency: "Quarterly",
  communicationScore: 85,
  aiInvestorMatch: "High match with EV & Clean Tech focus",
  aiFundingProbability: "76% probability of successful funding",
  aiValuationBenchmark: "₹ 620 Cr - ₹ 680 Cr valuation range",
  aiNegotiationInsights: "Investor open to performance-based terms",
  aiRiskAssessment: "Low to Medium risk",
  aiFundraisingRecommendation: "Proceed with valuation negotiation",
  aiInvestorScore: 88,
  recommendation: "Proceed with Investor Meeting",
  approvals: [
    { role: "IR Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "₹150 Cr target, Series B pitch deck & 87% investor fit score validated." },
    { role: "CFO", user: "Anita Verma", status: "Approved", date: "09 May 2024", comments: "₹650 Cr valuation model and unit economics validated." },
    { role: "Company Secretary", user: "Vikram Singh", status: "Approved", date: "10 May 2024", comments: "Cap table, SHA, and secretarial filings verified." },
    { role: "Legal Head", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "Term sheet and NDA regulatory compliance cleared." },
    { role: "CEO", user: "Amit Mehta", status: "Approved", date: "12 May 2024", comments: "Strategic alignment and 18.5% equity dilution approved." },
    { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "Formal board resolution scheduled for next meeting." },
  ],
  userDecision: "Approved",
  userReviewComments: "Strong investor synergy & 84/100 Overall Score (87 Fit, 83 Financial Readiness, ₹650 Cr Valuation). Approved for Term Sheet Negotiation.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Pitch_Deck.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Business_Plan.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Amit Mehta" },
    { id: "3", name: "Financial_Model.xlsx", type: "Excel Spreadsheet", size: "3.2 MB", date: "16 May 2024", uploader: "Anita Verma" },
    { id: "4", name: "Valuation_Report.pdf", type: "PDF Document", size: "1.6 MB", date: "15 May 2024", uploader: "Anita Verma" },
    { id: "5", name: "Cap_Table.xlsx", type: "Excel Spreadsheet", size: "520 KB", date: "14 May 2024", uploader: "Vikram Singh" },
    { id: "6", name: "Term_Sheet.pdf", type: "PDF Document", size: "750 KB", date: "13 May 2024", uploader: "Neha Kapoor" },
    { id: "7", name: "Due_Diligence_Docs.pdf", type: "PDF Document", size: "5.1 MB", date: "12 May 2024", uploader: "Neha Kapoor" },
    { id: "8", name: "Board_Presentation.pdf", type: "PDF Document", size: "1.4 MB", date: "11 May 2024", uploader: "Rahul Sharma" },
    { id: "9", name: "Investor_Updates.pdf", type: "PDF Document", size: "580 KB", date: "10 May 2024", uploader: "Rahul Sharma" },
    { id: "10", name: "Supporting_Docs.pdf", type: "PDF Document", size: "1.7 MB", date: "09 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:20 PM", user: "Rahul Sharma", action: "Updated Proposed Investment (₹120 Cr) and Valuation (₹650 Cr)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Kapoor", action: "Uploaded Term_Sheet.pdf and Due_Diligence_Docs.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Investor Score (88/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Amit Mehta", action: "CEO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:45 AM", user: "Rahul Sharma", action: "Investor Relations Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.irProjectName ?? "",
    ownerName: record.investorRelationsManager ?? "",
    recordCode: record.id ?? record.investorRelationsId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getInvestorRelationsFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveInvestorRelationsDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitInvestorRelationsFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewInvestorRelationsFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const c = await getOrDefault();
    c.approvalDecision = data.decision;
    c.reviewComments = data.comments ?? "";
    c.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : c.workflowStatus;
    return await saveRecord(c);
  });
