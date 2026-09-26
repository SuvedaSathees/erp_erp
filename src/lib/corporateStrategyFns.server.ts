import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "corporate-strategy";

const DEFAULT_RECORD: any = {
  strategyId: "CS-2024-00078",
  formCode: "CSDF-2024-25",
  strategyProject: "Corporate Strategy 2025-2030",
  strategyNumber: "CSN-25-0001",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Global Operations",
  strategyOwner: "Rahul Sharma",
  strategicPlanningCycle: "5 Year (2025-2030)",
  createdDate: "05 May 2024",
  lastModifiedDate: "17 May 2024",
  workflowStage: "Executive Review",
  corporateVision: "To be the most trusted global technology partner, creating sustainable value for customers, people, and society.",
  corporateMission: "Deliver innovative solutions that empower businesses and enrich lives.",
  coreValues: ["Integrity", "Excellence", "Innovation", "Customer Focus"],
  strategicThemes: ["Sustainable Growth", "Digital Transformation", "Innovation Leadership", "Operational Excellence"],
  planningHorizon: "5 Years",
  businessLifecycleStage: "Growth",
  strategicPriority: "High",
  corporatePurpose: "Build a better future through technology and innovation.",
  swotAnalysis: "Strengths, Weaknesses, Opportunities, Threats analysis of the organization.",
  pestleAnalysis: "Political, Economic, Social, Technological, Legal, Environmental analysis.",
  portersFiveForces: "Bargaining power, Threat of entry, Substitutes, Buyer power, Rivalry assessment.",
  competitivePosition: "Strong",
  industryGrowthRate: 9.5,
  marketLeadershipGoal: "Industry Leader",
  strategicAssessmentScore: 78,
  revenueTarget: 50000000000,
  profitabilityTarget: 22.0,
  marketShareTarget: 28.0,
  customerGrowthTarget: 150000,
  innovationTarget: 25,
  esgTarget: "Carbon Neutral by 2030 and Top ESG rating in industry.",
  strategicObjectiveScore: 82,
  initiatives: [
    { name: "Product Innovation Program", category: "Growth Initiative", sponsor: "Rahul Sharma", status: "In Progress", budget: "₹ 450 Cr", impact: "High" },
    { name: "Market Expansion Program", category: "Market Expansion", sponsor: "Anita Verma", status: "In Progress", budget: "₹ 380 Cr", impact: "High" },
    { name: "Digital Transformation", category: "Digital Transformation", sponsor: "Arjun Desai", status: "Planned", budget: "₹ 220 Cr", impact: "Very High" },
    { name: "Operational Excellence", category: "Cost Optimization", sponsor: "Vikram Singh", status: "Planned", budget: "₹ 150 Cr", impact: "Medium" },
    { name: "Strategic Partnership Program", category: "Strategic Partnership", sponsor: "Neha Kapoor", status: "Planned", budget: "₹ 250 Cr", impact: "High" },
  ],
  businessUnits: ["Consumer Products", "Industrial Solutions", "Digital Services"],
  productPortfolio: "Product Portfolio 2025",
  investmentPriority: "High",
  portfolioRisk: "Medium",
  portfolioRoi: 18.5,
  resourceAllocation: 12500000000,
  portfolioHealthScore: 80,
  revenueProjection: 52000000000,
  ebitdaTarget: 22.0,
  capitalAllocation: 15000000000,
  investmentRequirement: 18000000000,
  fundingStrategy: "Mixed (Equity + Debt)",
  shareholderValueTarget: 25.0,
  financialStrategyScore: 83,
  leadershipStrategy: "Build future-ready leadership pipeline and strengthen executive bench.",
  workforcePlan: "Hire 2500+ super talent and build capability in emerging technologies.",
  digitalTransformationStrategy: "Accelerate cloud adoption, automation and data-driven decision making.",
  innovationRoadmap: "Invest in R&D, AI, and new business incubation.",
  organizationalReadiness: 81,
  capabilityMaturity: "Defined",
  capabilityScore: 82,
  strategicRisks: "Economic slowdown, competition, regulatory changes, technology disruption.",
  enterpriseRiskRating: "Medium",
  governanceFramework: "Corporate Governance 2025",
  complianceStatus: true,
  boardOversight: true,
  riskMitigationPlan: "Diversify markets, strengthen compliance, invest in innovation and build resilient operations.",
  governanceScore: 85,
  aiStrategicInsights: "Strong growth expected in digital services and emerging markets.",
  aiMarketForecast: "Global market to grow 8-9% CAGR in next 5 years.",
  aiCompetitiveIntelligence: "Competitors investing heavily in AI and automation.",
  aiInvestmentRecommendation: "Increase investment in innovation and digital capabilities.",
  aiResourceOptimization: "Reallocating resources can improve ROI by 16%.",
  aiStrategicRiskPrediction: "Market volatility and supply chain risks identified.",
  aiStrategyScore: 88,
  recommendation: "Approve Strategy",
  approvals: [
    { role: "CSO", user: "Rahul Sharma", status: "Approved", date: "08 May 2024", comments: "5-Yr 2025-2030 corporate strategy aligned with board objectives." },
    { role: "CFO", user: "Vikram Mehta", status: "Approved", date: "09 May 2024", comments: "₹5,000 Cr revenue projection & 22% EBITDA target validated." },
    { role: "COO", user: "Arjun Desai", status: "Approved", date: "10 May 2024", comments: "Operational readiness & portfolio resource allocation approved." },
    { role: "CHRO", user: "Neha Kapoor", status: "Approved", date: "11 May 2024", comments: "Talent roadmap & leadership pipeline plan approved." },
    { role: "CTO", user: "Amit Verma", status: "Pending", date: "In Review", comments: "Digital transformation architecture review." },
    { role: "CEO", user: "Anita Mehta", status: "Pending", date: "In Review", comments: "Executive review in progress." },
    { role: "Board of Directors", user: "Board", status: "Pending", date: "Final Gate", comments: "" },
  ],
  userDecision: "Approved",
  userReviewComments: "Strategy is aligned with long term vision and value creation goals.",
  userApprovalDate: "2024-05-17",
  attachments: [
    { id: "1", name: "Strategic_Plan.pdf", type: "PDF Document", size: "2.4 MB", date: "17 May 2024", uploader: "Rahul Sharma" },
    { id: "2", name: "Annual_Operating_Plan.pdf", type: "PDF Document", size: "1.8 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "3", name: "Financial_Forecast.pdf", type: "PDF Document", size: "2.1 MB", date: "16 May 2024", uploader: "Vikram Mehta" },
    { id: "4", name: "Competitive_Analysis.pdf", type: "PDF Document", size: "1.5 MB", date: "15 May 2024", uploader: "Rahul Sharma" },
    { id: "5", name: "Market_Research.pdf", type: "PDF Document", size: "2.3 MB", date: "14 May 2024", uploader: "Anita Verma" },
    { id: "6", name: "Strategy_Roadmap.pdf", type: "PDF Document", size: "1.9 MB", date: "13 May 2024", uploader: "Arjun Desai" },
    { id: "7", name: "Risk_Register.pdf", type: "PDF Document", size: "1.6 MB", date: "12 May 2024", uploader: "Rahul Sharma" },
    { id: "8", name: "Executive_Presentation.pptx", type: "PowerPoint Presentation", size: "2.8 MB", date: "11 May 2024", uploader: "Rahul Sharma" },
    { id: "9", name: "Supporting_Documents.zip", type: "ZIP Archive", size: "3.2 MB", date: "10 May 2024", uploader: "Rahul Sharma" },
  ],
  activityHistory: [
    { id: "a1", date: "17 May 2024", time: "04:08 PM", user: "Rahul Sharma", action: "Updated Revenue Target (₹5,000 Cr) and Strategic Initiatives", status: "Modified" },
    { id: "a2", date: "16 May 2024", time: "11:20 AM", user: "Vikram Mehta", action: "Uploaded Annual_Operating_Plan.pdf and Financial_Forecast.pdf", status: "Attachment" },
    { id: "a3", date: "15 May 2024", time: "04:15 PM", user: "AI Neural Engine", action: "Generated AI Strategy Score (88/100)", status: "AI System" },
    { id: "a4", date: "11 May 2024", time: "02:30 PM", user: "Neha Kapoor", action: "CHRO Approval Completed - Decision: Approved", status: "Approved" },
    { id: "a5", date: "05 May 2024", time: "10:15 AM", user: "Rahul Sharma", action: "Corporate Strategy Development Project Initialized - Version 1.0", status: "Created" },
  ],
};

async function getOrDefault(): Promise<any> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any): Promise<any> {
  const r = {
    ...record,
    projectName: record.strategyProject ?? "",
    ownerName: record.strategyOwner ?? "Rahul Sharma",
    recordCode: record.id ?? record.strategyId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getCorporateStrategyFn = createServerFn({ method: "GET" }).handler(
  async () => await getOrDefault(),
);

export const saveCorporateStrategyDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => await saveRecord({ ...(await getOrDefault()), ...data.input }));

export const submitCorporateStrategyFn = createServerFn({ method: "POST" })
  .validator((data: string | undefined) => data)
  .handler(async () => {
    const c = await getOrDefault();
    c.workflowStatus = "Under Review";
    return await saveRecord(c);
  });

export const reviewCorporateStrategyFn = createServerFn({ method: "POST" })
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
