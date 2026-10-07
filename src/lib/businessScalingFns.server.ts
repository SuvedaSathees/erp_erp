import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "business-scaling";

const DEFAULT_RECORD: any = {
  scalingId: "BS-2024-00056",
  formCode: "BSF-2024-25",
  scalingProject: "Enterprise Scale-up 2024",
  scalingNumber: "BSN-ENT-24-001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Global Operations",
  scalingManager: "Rahul Sharma",
  strategicPlan: "SP-2024-01",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Business Scaling Planning",
  scalingObjective: "Scale operations globally and achieve sustainable profitable growth.",
  growthStrategy: "Organic Growth",
  targetRevenue: 5000000000,
  targetMarkets: ["India", "USA", "Europe", "Southeast Asia"],
  scalingTimeline: "01 Apr 2024 - 31 Mar 2029",
  businessLifecycleStage: "Scale-up",
  strategicPriority: "High",
  overallGrowthTarget: 230,
  newProducts: 12,
  newMarkets: 8,
  newCountries: 5,
  newBusinessUnits: 3,
  expansionModel: "Direct Operations",
  partnershipStrategy: "Strategic Alliance",
  expansionReadinessScore: 82,
  manufacturingCapacity: 160,
  productionExpansion: "Expand Capacity",
  warehouseExpansion: "New Warehouses",
  supplyChainReadinessScore: 85,
  erpReadinessScore: 85,
  processAutomation: 65.0,
  operationalReadinessScore: 83,
  currentRevenue: 1650000000,
  ebitdaTarget: 22.5,
  capitalRequirement: 1200000000,
  fundingSource: "Private Equity",
  roiProjection: 26.8,
  financialReadinessScore: 86,
  salesChannels: ["Direct Sales", "Distributors", "Online Sales", "Franchise"],
  franchiseExpansion: 50,
  dealerExpansion: 150,
  distributorExpansion: 40,
  marketingBudget: 250000000,
  customerAcquisitionTarget: 50000,
  commercialReadinessScore: 81,
  currentEmployees: 850,
  targetEmployees: 2500,
  leadershipHiring: 25,
  organizationalStructure: "Matrix Structure",
  skillDevelopmentPlan: "Leadership training, technical upskilling, digital skills and cross-functional development.",
  hrReadinessScore: 80,
  organizationalReadinessScore: 82,
  erpExpansion: true,
  crmExpansion: true,
  aiIntegration: true,
  cloudInfrastructure: "Hybrid Cloud",
  cybersecurityReadiness: 85,
  digitalTransformationLevel: "Intelligent",
  technologyReadinessScore: 84,
  businessRisk: "Medium",
  financialRisk: "Medium",
  operationalRisk: "Low",
  complianceStatus: true,
  corporateGovernance: true,
  riskMitigationPlan: "Diversify markets, strengthen compliance, improve cash flow visibility and enhance cybersecurity.",
  governanceScore: 82,
  aiGrowthPrediction: "Revenue will grow 2.3X in next 3 years from strong market expansion.",
  aiExpansionRecommendation: "Expand into USA and Europe markets through direct operations.",
  aiInvestmentRecommendation: "Invest ₹120 Cr in capacity, technology and market expansion.",
  aiResourceOptimization: "Optimize workforce and automation to increase productivity by 40%.",
  aiRiskPrediction: "Medium financial risk due to high capital requirement.",
  aiScalingStrategy: "Focus on product innovation, global expansion and customer retention.",
  aiScalingScore: 88,
  recommendation: "Proceed with Scaling",
  approvals: [
    { role: "Scaling Manager", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "₹500 Cr target scaling roadmap & 5-yr plan verified." },
    { role: "COO", user: "Anita Verma", status: "Approved", date: "09 May 2024", comments: "160% manufacturing capacity expansion validated." },
    { role: "CFO", user: "Vikram Mehta", status: "Approved", date: "10 May 2024", comments: "₹120 Cr PE funding structure and 26.8% ROI approved." },
    { role: "CHRO", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "850 → 2,500 talent ramp-up plan approved." },
    { role: "CTO", user: "Arjun Desai", status: "Pending", date: "In Review", comments: "Hybrid cloud ERP & AI roadmap review." },
    { role: "CEO", user: "Amit Mehta", status: "Pending", date: "In Review", comments: "Executive scaling committee review." },
    { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Strong scaling execution framework & 84/100 Overall Score (88 AI Scaling, 86 Financial, ₹500 Cr Target Revenue). Approved.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Business_Plan.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Strategic_Plan.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Financial_Projection.pdf", type: "PDF Document", size: "2.1 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "4", name: "Growth_Roadmap.pdf", type: "PDF Document", size: "1.5 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Organization_Chart.pdf", type: "PDF Document", size: "1.2 MB", date: "14 May 2024", uploader: "Neha Kapoor" },
    { id: "6", name: "Investment_Plan.pdf", type: "PDF Document", size: "1.9 MB", date: "13 May 2024", uploader: "Vikram Mehta" },
    { id: "7", name: "Risk_Assessment.pdf", type: "PDF Document", size: "1.4 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "8", name: "KPI_Dashboard.pdf", type: "PDF Document", size: "2.6 MB", date: "11 May 2024", uploader: "Anita Verma" },
    { id: "9", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "3.2 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:35 PM", user: "Rahul Sharma", action: "Updated Target Revenue (₹500 Cr) and Employee Growth (850 → 2,500)", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Vikram Mehta", action: "Uploaded Financial_Projection.pdf and Strategic_Plan.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Scaling Score (88/100)", status: "AI System" },
    { id: "a4", date: "11 May 2024", time: "02:30 PM", user: "Neha Kapoor", action: "CHRO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:20 AM", user: "Rahul Sharma", action: "Business Scaling Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.scalingProject ?? "",
    ownerName: record.scalingManager ?? "Rahul Sharma",
    recordCode: record.id ?? record.scalingId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getBusinessScalingFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveBusinessScalingDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitBusinessScalingFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewBusinessScalingFn = createServerFn({ method: "POST" })
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
