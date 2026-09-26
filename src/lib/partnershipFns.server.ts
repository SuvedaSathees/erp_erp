import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "partnership";

const DEFAULT_RECORD: any = {
  partnershipId: "PD-2024-00056",
  formCode: "PDF-2024-25",
  partnershipProject: "AI Technology Collaboration",
  partnershipNumber: "PDN-INT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "EV Solutions",
  partnerOrganization: "TechNova Systems Pvt. Ltd.",
  partnershipManager: "Rahul Sharma",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Due Diligence",

  businessObjective: "Expand technology capabilities and enter new markets",
  partnershipObjective: "Co-develop AI-based solutions and joint market expansion",
  partnershipType: "Technology Partnership",
  industry: "Technology",
  geographicCoverage: ["India", "USA", "Europe"],
  strategicPriority: "High",
  lifecycleStage: "Due Diligence",
  priority: "High",

  organizationName: "TechNova Systems Pvt. Ltd.",
  organizationType: "Private Limited",
  businessDomain: ["AI & ML Solutions", "Cloud Services", "IoT Platforms"],
  yearsInBusiness: 12,
  annualRevenue: 2500000000,
  employeeStrength: 850,
  globalPresence: ["India", "USA", "Germany", "Singapore"],
  partnerCapabilityScore: 88,

  strategicFit: "Excellent",
  technologyCapability: "Excellent",
  commercialCapability: "Very Good",
  operationalCapability: "Very Good",
  innovationCapability: "Excellent",
  esgCompliance: "Good",
  dueDiligenceStatus: true,
  evaluationScore: 86,

  partnershipModel: "Revenue Sharing",
  revenueSharingModel: "Revenue Percentage",
  commercialTerms: "15% revenue share for 5 years with mutual exclusivity in target markets",
  investmentCommitment: 500000000,
  ndaSigned: true,
  mouAgreementFile: "MoU_TechNova.pdf",
  legalReviewStatus: true,
  commercialScore: 84,

  integrationPlan: "API-based integration, joint development environment and data sharing framework.",
  resourceAllocation: "5 members from each organization",
  jointProjectPlan: "PRJ-2024-015 (AI Platform Co-Dev)",
  slaDefined: true,
  kpiAgreement: true,
  governanceCommittee: ["Rahul Sharma", "Anita Verma", "John Miller"],
  operationalReadinessScore: 82,

  strategicRisks: "Market changes, partner dependency",
  commercialRisks: "Revenue fluctuations, cost overruns",
  operationalRisks: "Resource unavailability, delays",
  legalRisks: "IPR disputes, contract violations",
  riskMitigationPlan: "Defined in risk register with quarterly review",
  complianceStatus: true,
  riskScore: 76,

  revenueContribution: 250000000,
  businessGrowth: 18.5,
  projectSuccessRate: 92,
  slaAchievement: 95,
  partnerSatisfaction: 4.6,
  strategicValueScore: 87,
  performanceScore: 85,

  aiPartnerSuitability: "High suitability with 88% match",
  aiSynergyAnalysis: "Strong synergy in AI and Cloud",
  aiRiskPrediction: "Medium risk due to market volatility",
  aiRevenueOpportunity: "Opportunity of ₹ 120 Cr in 3 years",
  aiCollaborationRecommendation: "Proceed with phased collaboration",
  aiExpansionStrategy: "Expand to EU market in phase 2",
  aiPartnershipScore: 89,

  recommendation: "Approve Partnership",

  approvals: [
    { role: "Partnership Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "12-year proven technology track record & 88% capability score." },
    { role: "BD Manager", user: "Ankit Verma", status: "Approved", date: "09 May 2024", comments: "Target market expansion strategy validated." },
    { role: "Finance Manager", user: "Vikas Mehta", status: "Approved", date: "10 May 2024", comments: "₹50 Cr investment commitment & 15% revenue share approved." },
    { role: "Legal Manager", user: "Neha Singh", status: "Approved", date: "11 May 2024", comments: "MoU draft & IPR protection clauses verified." },
    { role: "Operations Manager", user: "Arjun Patel", status: "Pending", date: "In Review", comments: "Joint engineering resource allocation under review." },
    { role: "Strategy Head", user: "Vineet Malhotra", status: "Pending", date: "In Review", comments: "Phase 2 EU market expansion plan review." },
    { role: "COO", user: "Rajat Verma", status: "Pending", date: "Awaiting", comments: "" },
    { role: "CEO", user: "Sanjay Patel", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Excellent strategic alignment (85/100 Overall Score, ₹120 Cr Revenue Potential, 92% AI Match). Approved for MoU Signing.",
  userApprovalDate: "2024-05-17",

  attachments: [
    { id: "1", name: "Partnership_Proposal.pdf", type: "PDF Document", size: "4.2 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Business_Case.pdf", type: "PDF Document", size: "5.1 MB", date: "16 May 2024", uploader: "Ankit Verma" },
    { id: "3", name: "NDA_TechNova.pdf", type: "PDF Document", size: "2.1 MB", date: "16 May 2024", uploader: "Neha Singh" },
    { id: "4", name: "MoU_TechNova.pdf", type: "PDF Document", size: "3.8 MB", date: "15 May 2024", uploader: "Neha Singh" },
    { id: "5", name: "Due_Diligence_Report.pdf", type: "PDF Document", size: "6.3 MB", date: "14 May 2024", uploader: "Rahul Sharma" },
    { id: "6", name: "Financial_Assessment.pdf", type: "PDF Document", size: "4.7 MB", date: "13 May 2024", uploader: "Vikas Mehta" },
    { id: "7", name: "Integration_Plan.pdf", type: "PDF Document", size: "3.4 MB", date: "12 May 2024", uploader: "Arjun Patel" },
  ],

  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "03:45 PM", user: "Rahul Sharma", action: "Updated Revenue Opportunity (₹120 Cr) and AI Partnership Score (89/100)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Neha Singh", action: "Uploaded MoU_TechNova.pdf and NDA_TechNova.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Partnership Score (89/100)", status: "AI System" },
    { id: "a4", date: "12 May 2024", time: "02:30 PM", user: "Vikas Mehta", action: "Finance Manager Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "09:15 AM", user: "Rahul Sharma", action: "Partnership Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.partnershipProject ?? "",
    ownerName: record.partnershipManager ?? "",
    recordCode: record.id ?? record.partnershipId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getPartnershipFn = createServerFn({ method: "GET" }).handler(async () => await getOrDefault());

export const savePartnershipDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    return await saveRecord({ ...current, ...data.input });
  });

export const submitPartnershipFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const current = await getOrDefault();
    current.workflowStatus = "Under Review";
    return await saveRecord(current);
  });

export const reviewPartnershipFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const current = await getOrDefault();
    current.approvalDecision = data.decision;
    current.reviewComments = data.comments ?? "";
    current.workflowStatus = data.decision === "approved" ? "Approved" : data.decision === "rejected" ? "Rejected" : current.workflowStatus;
    return await saveRecord(current);
  });
