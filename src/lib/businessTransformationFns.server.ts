import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "business-transformation";

const DEFAULT_RECORD: any = {
  transformationId: "TRF-2024-00045",
  formCode: "TRF-2024-25",
  transformationProgram: "Operational Excellence 2024",
  programNumber: "TRF-OPX-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Global Operations",
  transformationSponsor: "Anita Verma",
  transformationManager: "Vikram Mehta",
  strategicReference: "Corporate Strategy 2025",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Transformation Planning",
  transformationVision: "Build an agile, customer-centric and digitally intelligent organization.",
  businessObjective: "Improve operational efficiency, customer experience and drive sustainable growth.",
  transformationType: "Operational Transformation",
  strategicTheme: "Operational Excellence",
  businessDrivers: ["Cost Optimization", "Customer Expectations", "Digital Disruption"],
  expectedBusinessOutcome: "20% cost reduction, 30% productivity improvement and higher customer satisfaction.",
  strategicPriority: "High",
  transformationTimeline: "01 Jun 2024 - 31 Dec 2026",
  currentBusinessModel: "Traditional Model",
  currentProcessMaturity: "Repeatable",
  digitalMaturity: "Digitized",
  organizationalCapability: 58,
  technologyReadiness: 62,
  customerExperienceScore: 60,
  operationalEfficiency: 55,
  currentStateScore: 59,
  futureOperatingModel: "Agile, data-driven operating model with automation and AI enablement.",
  targetBusinessModel: "Digital Business Model",
  targetDigitalMaturity: "Intelligent",
  targetCustomerExperience: "Seamless, personalized and omni-channel customer experience.",
  targetKpiFramework: "Transformation KPI Framework",
  transformationRoadmap: "Phase 1: Foundation (Q3 2024), Phase 2: Core Modernization (2025), Phase 3: Scale & Autonomous (2026).",
  futureStateReadiness: 78,
  initiatives: [
    { name: "Process Automation", category: "Operations", owner: "Rahul Sharma", startDate: "01 Jun 2024", endDate: "30 Sep 2024", status: "In Progress", impactScore: 82 },
    { name: "ERP Modernization", category: "Technology", owner: "Anita Verma", startDate: "01 Jun 2024", endDate: "31 Dec 2024", status: "In Progress", impactScore: 88 },
    { name: "Customer Experience Revamp", category: "Customer Experience", owner: "Arjun Desai", startDate: "01 Jul 2024", endDate: "31 Dec 2024", status: "Planned", impactScore: 75 },
    { name: "Data & Analytics Platform", category: "Technology", owner: "Vikram Mehta", startDate: "01 Aug 2024", endDate: "31 Jan 2025", status: "Planned", impactScore: 81 },
  ],
  organizationStructureChange: true,
  leadershipAlignmentScore: 70,
  employeeReadinessScore: 65,
  trainingProgram: "Transformation Training 2024",
  communicationPlan: "Multi-channel communication plan with regular updates.",
  changeAdoptionPlan: "Change champions network and adoption tracking.",
  changeReadinessScore: 68,
  businessProcessReengineering: true,
  erpModernization: true,
  aiEnablement: true,
  automationLevel: 65,
  cloudMigration: true,
  dataStrategy: "Enterprise data platform with real-time analytics and data governance.",
  technologyTransformationScore: 72,
  transformationBudget: 5000000000,
  expectedCostSavings: 1000000000,
  revenueGrowthTarget: 1500000000,
  productivityImprovement: 25,
  roi: 28.5,
  paybackPeriod: 24,
  valueRealizationScore: 77,
  transformationRisks: "Adoption resistance, legacy system integration, business continuity during migration.",
  enterpriseRiskRating: "Medium",
  governanceCommittee: "Transformation Steering Committee",
  complianceStatus: true,
  executiveSteeringCommittee: true,
  riskMitigationPlan: "Active risk monitoring, mitigation actions and periodic reviews.",
  governanceScore: 73,
  aiTransformationAssessment: "Strong potential for operational excellence with automation and AI.",
  aiProcessOptimization: "Identified 15 high impact process optimization opportunities.",
  aiCostReductionOpportunities: "Potential cost reduction of ₹ 100 Cr over 24 months.",
  aiResourceOptimization: "Optimal resource allocation can improve productivity by 30%.",
  aiRiskPrediction: "Medium risk due to change adoption and legacy systems.",
  aiSuccessProbability: 78,
  aiTransformationScore: 76,
  recommendation: "Proceed to Execution",
  approvals: [
    { role: "Executive Sponsor", user: "Anita Verma", status: "Approved", date: "08 May 2024", comments: "Operational transformation charter and €500M budget approved." },
    { role: "Chief Transformation Officer", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "Workforce readiness and change champion network confirmed." },
    { role: "COO", user: "Arjun Desai", status: "Approved", date: "10 May 2024", comments: "Plant automation and supply chain re-engineering validated." },
    { role: "CFO", user: "Manish Gupta", status: "Approved", date: "11 May 2024", comments: "₹100 Cr cost reduction model and 28.5% ROI verified." },
    { role: "CIO / CTO", user: "Amit Verma", status: "Approved", date: "12 May 2024", comments: "Hybrid cloud ERP modernization roadmap approved." },
    { role: "CHRO", user: "Sneha Nair", status: "Approved", date: "13 May 2024", comments: "Change management and employee training curriculum approved." },
    { role: "CEO", user: "Rahul Sharma", status: "Pending", date: "In Review", comments: "Final executive committee review." },
    { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Comments will be added during review...",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Transformation_Charter.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Anita Verma" },
    { id: "2", name: "Business_Case.pdf", type: "PDF Document", size: "3.1 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Roadmap.pdf", type: "PDF Document", size: "3.2 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "4", name: "AS-IS_Assessment.pdf", type: "PDF Document", size: "2.6 MB", date: "15 May 2024", uploader: "Arjun Desai" },
    { id: "5", name: "TO-BE_Blueprint.pdf", type: "PDF Document", size: "4.2 MB", date: "14 May 2024", uploader: "Amit Verma" },
    { id: "6", name: "Process_Maps.pdf", type: "PDF Document", size: "4.1 MB", date: "13 May 2024", uploader: "Rahul Sharma" },
    { id: "7", name: "Financial_Model.pdf", type: "PDF Document", size: "2.8 MB", date: "12 May 2024", uploader: "Manish Gupta" },
    { id: "8", name: "Risk_Register.pdf", type: "PDF Document", size: "1.9 MB", date: "11 May 2024", uploader: "Sneha Nair" },
    { id: "9", name: "Comm_Plan.pdf", type: "PDF Document", size: "1.4 MB", date: "10 May 2024", uploader: "Sneha Nair" },
    { id: "10", name: "Training_Materials.pdf", type: "PDF Document", size: "2.2 MB", date: "09 May 2024", uploader: "Sneha Nair" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:08 PM", user: "Vikram Mehta", action: "Updated Transformation Budget (₹500 Cr) and Initiative Milestones", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Anita Verma", action: "Uploaded Transformation_Charter.pdf and TO-BE_Blueprint.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Transformation Score (76/100) and 78% Success Probability", status: "AI System" },
    { id: "a4", date: "13 May 2024", time: "02:30 PM", user: "Sneha Nair", action: "CHRO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:15 AM", user: "Rahul Sharma", action: "Business Transformation Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.transformationProgram ?? "",
    ownerName: record.transformationManager ?? "Vikram Mehta",
    recordCode: record.id ?? record.transformationId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getBusinessTransformationFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveBusinessTransformationDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitBusinessTransformationFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewBusinessTransformationFn = createServerFn({ method: "POST" })
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
