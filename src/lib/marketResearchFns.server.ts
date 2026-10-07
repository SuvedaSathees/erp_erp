import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "market-research";

const DEFAULT_RECORD = {
  mrId: "MR-2024-0015",
  formCode: "MR-2024-08",
  researchProject: "EV Charging Infrastructure Market Analysis — South Asia",
  researchNumber: "MR-2024-0015",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Smart Mobility Division",
  productService: "Autonomous EV Docking System",
  researchOwner: "Priya Sharma",
  createdDate: "01 May 2024",
  lastModifiedDate: "15 May 2024",
  workflowStage: "Research & Analysis",
  businessObjective: "Evaluate commercial viability of autonomous EV docking systems across South Asian markets, identify early-mover advantages, and validate demand for next-gen charging infrastructure.",
  researchObjective: "Map market size (TAM/SAM/SOM), identify customer personas, benchmark competitors, assess regulatory readiness, and evaluate technology adoption drivers for smart EV charging stations.",
  industry: "Electric Vehicle Infrastructure",
  marketCategory: "EV Charging & Smart Mobility",
  geographicScope: ["India", "Southeast Asia", "Middle East"],
  researchMethodology: "Mixed Methods (Quant + Qual)",
  lifecycleStage: "Growth",
  priority: "High",
  tam: 45000000000,
  sam: 12000000000,
  som: 3500000000,
  marketGrowthRate: 28.5,
  marketSize: "Large (>$10B)",
  industryMaturity: "Emerging",
  marketAttractivenessScore: 88,
  targetCustomerSegments: ["Fleet Operators", "Commercial Real Estate", "Government Transit"],
  customerPersonas: "Fleet Manager (35-50, decisions for 50+ vehicles), Property Developer (luxury EV-ready projects), Municipal Transit Director (public charging mandates).",
  customerNeeds: "Reliable fast-charging, minimal downtime, remote fleet monitoring, energy cost optimization, scalable deployment across geographies.",
  customerPainPoints: "High installation costs, inconsistent grid power, lack of interoperability between charging networks, poor rural coverage.",
  buyingBehaviour: "B2B procurement cycles (3-6 months), RFP-driven, preference for bundled hardware + software + maintenance contracts.",
  customerExpectations: "99.5% uptime SLA, real-time dashboards, OTA firmware updates, multi-protocol support (CCS2, CHAdeMO, AC Type 2).",
  customerResearchScore: 82,
  competitorCount: 12,
  marketShare: 8.5,
  productComparisonFile: "",
  pricingComparisonFile: "",
  swotAnalysisFile: "",
  competitiveAdvantages: "Patented autonomous docking mechanism, AI-driven predictive maintenance, lowest cost-per-charge in segment.",
  competitiveIntelligenceScore: 76,
  emergingTechnologies: "Solid-state batteries, V2G (Vehicle-to-Grid), wireless inductive charging, edge AI for load balancing.",
  industryTrends: "Government mandates for EV adoption (FAME III), corporate ESG commitments driving fleet electrification, rise of charging-as-a-service (CaaS) models.",
  regulatoryEnvironment: "FAME III subsidies, BIS certification requirements, state-level EV policies, CEA grid interconnection standards.",
  governmentPolicies: "30% capital subsidy under FAME III for public charging, GST reduction to 5% on EV chargers, mandatory EV-ready building codes in Tier-1 cities.",
  standardsCertifications: ["ISO 15118", "IEC 61851", "BIS IS 17017"],
  technologyReadinessScore: 85,
  innovationScore: 79,
  pricingBenchmark: "Market average: INR 8-12 lakh per DC fast charger. Premium autonomous systems: INR 18-25 lakh.",
  revenueOpportunity: 850000000,
  expectedMarketShare: 12.5,
  entryBarriers: "High capex for R&D and manufacturing, regulatory certification timelines (6-12 months), established competitor relationships with fleet operators.",
  distributionChannels: ["Direct Enterprise Sales", "Channel Partners", "Government Tenders"],
  commercialViabilityScore: 81,
  aiTrendAnalysis: "AI-powered market trend analysis indicates strong upward trajectory in EV infrastructure investment, with 3x growth expected by 2028.",
  aiDemandForecast: "Projected demand of 2,500+ autonomous docking units annually by 2027, driven by fleet electrification mandates.",
  aiCompetitorInsights: "Competitor landscape fragmenting — top 3 players hold 45% share. Opportunity window for differentiated autonomous solutions.",
  aiOpportunityMapping: "Highest-value segments: Commercial Fleet Hubs (35%), Highway Corridors (28%), Urban Retail (22%), Government Transit (15%).",
  aiRiskAssessment: "Primary risks: Grid infrastructure gaps in Tier-2/3 cities, policy implementation delays, technology obsolescence from wireless charging advances.",
  aiRecommendations: "Prioritize B2B fleet partnerships, secure FAME III certification early, establish pilot deployments in 3 metro corridors.",
  aiIntelligenceScore: 84,
  recommendation: "Proceed to Product Development",
  approvals: [
    { role: "Research Lead", person: "Priya Sharma", decision: "Approved", date: "12 May 2024", comments: "Comprehensive market assessment completed." },
    { role: "Strategy Director", person: "Vikram Mehta", decision: "Approved", date: "14 May 2024", comments: "Strong commercial potential identified." },
    { role: "VP Innovation", person: "Dr. Ananya Rao", decision: "In Review", date: "-", comments: "" },
  ],
  userDecision: "",
  userReviewComments: "",
  userApprovalDate: "",
  attachments: [
    { id: "file-1", name: "Market_Size_Analysis_SA_2024.pdf", type: "PDF Document", size: "4.2 MB", date: "02 May 2024", uploader: "Priya Sharma" },
    { id: "file-2", name: "Competitor_Landscape_Matrix.xlsx", type: "Excel Spreadsheet", size: "2.8 MB", date: "05 May 2024", uploader: "Rahul Desai" },
    { id: "file-3", name: "Customer_Interview_Transcripts.pdf", type: "PDF Document", size: "6.1 MB", date: "08 May 2024", uploader: "Neha Gupta" },
    { id: "file-4", name: "FAME_III_Policy_Brief.pdf", type: "PDF Document", size: "1.5 MB", date: "03 May 2024", uploader: "Arjun Nair" },
    { id: "file-5", name: "Technology_Readiness_Assessment.pdf", type: "PDF Document", size: "3.7 MB", date: "10 May 2024", uploader: "Dr. Ananya Rao" },
    { id: "file-6", name: "Financial_Model_EV_Charging.xlsx", type: "Excel Spreadsheet", size: "5.3 MB", date: "12 May 2024", uploader: "Suresh Kumar" },
    { id: "file-7", name: "SWOT_Analysis_Infographic.pdf", type: "PDF Document", size: "2.1 MB", date: "06 May 2024", uploader: "Priya Sharma" },
    { id: "file-8", name: "Regulatory_Compliance_Checklist.xlsx", type: "Excel Spreadsheet", size: "1.8 MB", date: "09 May 2024", uploader: "Legal Team" },
  ],
  activityHistory: [
    { id: "a-1", date: "15 May 2024", time: "04:30 PM", user: "Priya Sharma", action: "Updated AI Intelligence analysis and competitive scoring", status: "Updated" },
    { id: "a-2", date: "12 May 2024", time: "11:15 AM", user: "Rahul Desai", action: "Completed competitor landscape matrix with 12 players", status: "Completed" },
    { id: "a-3", date: "08 May 2024", time: "02:45 PM", user: "Neha Gupta", action: "Uploaded 15 customer interview transcripts", status: "Uploaded" },
    { id: "a-4", date: "05 May 2024", time: "10:00 AM", user: "Arjun Nair", action: "Added regulatory environment and government policy analysis", status: "Added" },
    { id: "a-5", date: "01 May 2024", time: "09:30 AM", user: "Priya Sharma", action: "Created Market Research project MR-2024-0015", status: "Created" },
  ],
} as any;

async function getOrDefault() {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any) {
  const r = {
    ...record,
    projectName: record.researchProject ?? "",
    ownerName: record.researchOwner ?? "",
    recordCode: record.mrId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getMarketResearchFn = createServerFn({ method: "GET" }).handler(async () => {
  const data = await getOrDefault();
  return { success: true, data };
});

export const saveMarketResearchDraftFn = createServerFn({ method: "POST" })
  .validator((d: { id?: string; input: any }) => d)
  .handler(async ({ data: { id, input } }) => {
    const existing = await getOrDefault();
    const updated = { ...existing, ...input, updatedAt: new Date().toISOString() };
    const result = await saveRecord(updated);
    return { success: true, data: result };
  });

export const submitMarketResearchFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async () => {
    const existing: any = await getOrDefault();
    const updated = {
      ...existing,
      workflowStatus: "Submitted",
      workflowStage: "Executive Review",
      updatedAt: new Date().toISOString(),
    };
    const result = await saveRecord(updated);
    return { success: true, data: result };
  });

export const reviewMarketResearchFn = createServerFn({ method: "POST" })
  .validator((d: { id: string; decision: string; comments?: string }) => d)
  .handler(async ({ data: { decision, comments } }) => {
    const existing: any = await getOrDefault();
    const updated = {
      ...existing,
      userDecision: decision,
      userReviewComments: comments || "",
      userApprovalDate: new Date().toISOString().substring(0, 10),
      workflowStatus: decision === "Approved" ? "Approved" : decision === "Rejected" ? "Rejected" : "Revision Required",
      updatedAt: new Date().toISOString(),
    };
    const result = await saveRecord(updated);
    return { success: true, data: result };
  });

export const generateMarketResearchReportFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async () => {
    const existing: any = await getOrDefault();
    return { success: true, data: { ...existing, reportGeneratedAt: new Date().toISOString() } };
  });
