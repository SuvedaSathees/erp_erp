import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "competitive-analysis";

const DEFAULT_RECORD = {
  caId: "CA-2024-0010",
  formCode: "CA-2024-05",
  analysisProject: "EV Charging Competitor Landscape — Autonomous Segment",
  analysisNumber: "CA-2024-0010",
  version: "1.0",
  workflowStatus: "In Progress",
  businessUnit: "Smart Mobility Division",
  productService: "Autonomous EV Docking System",
  competitor: "ChargePoint Holdings",
  analysisOwner: "Arjun Nair",
  createdDate: "05 Apr 2024",
  lastModifiedDate: "02 May 2024",
  workflowStage: "Analysis & Benchmarking",
  businessObjective: "Map competitive landscape in the autonomous EV charging segment to identify strategic positioning opportunities and defensive moats.",
  industry: "Electric Vehicle Infrastructure",
  marketCategory: "EV Charging & Smart Mobility",
  geographicMarket: ["India", "North America", "Europe"],
  analysisType: "Comprehensive (Product + Market + Financial)",
  competitiveScope: "Direct & Adjacent Competitors",
  lifecycleStage: "Growth",
  priority: "High",
  competitorName: "ChargePoint Holdings",
  headquarters: "Campbell, California, USA",
  marketPresence: ["North America", "Europe", "Asia-Pacific"],
  productPortfolio: "Level 2 AC chargers, DC fast chargers, fleet management software, ChargePoint-as-a-Service.",
  businessModel: "Hardware + SaaS subscription + Charging network fees",
  revenueEstimate: "USD 506M (FY2023)",
  employeeStrength: "2,800+",
  marketShare: 22.5,
  competitorScore: 78,
  productFeatures: "Networked charging stations, mobile app, fleet management dashboard, energy management, OCPP compliance.",
  technologyStack: "Cloud-native platform, OCPP 2.0.1, REST APIs, mobile SDK.",
  qualityComparison: "Industry-standard reliability. No autonomous docking capability. Manual plug-in only.",
  innovationLevel: "Moderate — focused on software services rather than hardware innovation.",
  certifications: ["UL Listed", "Energy Star", "OCPP 2.0.1"],
  patentPortfolio: "85+ patents (primarily networking and billing software).",
  technologyLeadershipScore: 72,
  pricingStrategy: "Competitive pricing with SaaS subscription model. Hardware margin ~15%, recurring revenue from SaaS + network fees.",
  productPricing: "DC Fast Charger: USD 35,000-65,000. Level 2: USD 3,500-8,000. SaaS: USD 50-200/month/station.",
  distributionChannels: ["Direct Sales", "Channel Partners", "Online Store"],
  salesStrategy: "B2B enterprise focus with self-serve SMB channel. Strong government/municipal sales team.",
  marketingStrategy: "Brand-led awareness, industry events (CES, EVS), digital marketing, partner co-marketing.",
  customerSupportModel: "24/7 NOC monitoring, tiered SLA packages, on-site maintenance network.",
  commercialCompetitivenessScore: 75,
  strengths: "Largest networked charging network in NA. Strong brand recognition. Comprehensive software platform. First-mover advantage.",
  weaknesses: "No autonomous charging capability. Hardware margins thin. Heavy dependence on NA market. Limited presence in South Asia.",
  opportunities: "Fleet electrification growth. Government infrastructure spending. Adjacent markets (residential, retail).",
  threats: "Tesla Supercharger network opening. Chinese competitors (BYD, NIO Power) entering with aggressive pricing. Technology disruption from wireless charging.",
  competitiveRisks: "Price war from Chinese manufacturers, Tesla network effect, regulatory changes favoring open standards.",
  strategicPosition: "Market leader in networked charging but vulnerable to hardware innovation disruption (autonomous, wireless).",
  swotScore: 74,
  marketPositionRanking: 2,
  innovationRanking: 4,
  customerSatisfactionRanking: 3,
  digitalMaturity: "High — cloud-native platform with strong API ecosystem.",
  esgPerformance: "Strong ESG positioning — clean energy enabler, carbon offset programs, diversity commitments.",
  benchmarkReportFile: "",
  benchmarkScore: 76,
  aiCompetitorAnalysis: "AI identifies ChargePoint's primary vulnerability: hardware commoditization. Our autonomous docking creates a defensible hardware moat.",
  aiPricingIntelligence: "ChargePoint's SaaS model yields 65% gross margin on software vs. 15% on hardware. Our integrated hardware-software approach can target 35% blended margin.",
  aiMarketTrendAnalysis: "Market shifting from 'charge anywhere' to 'charge autonomously'. ChargePoint's manual-only approach creates a 2-3 year window for autonomous entrants.",
  aiOpportunityMapping: "Key opportunity: fleet operators switching from ChargePoint due to lack of autonomous capability. Target: 200+ enterprise fleet accounts.",
  aiThreatPrediction: "ChargePoint likely to announce autonomous partnership within 18 months. First-mover advantage window is narrowing.",
  aiStrategicRecommendations: "Accelerate fleet pilot deployments, secure patents on autonomous docking algorithms, establish strategic partnerships with fleet management platforms.",
  aiIntelligenceScore: 82,
  recommendation: "Proceed with Differentiation Strategy",
  approvals: [
    { role: "Analysis Owner", person: "Arjun Nair", decision: "Approved", date: "28 Apr 2024", comments: "Comprehensive competitor assessment completed." },
    { role: "Strategy Director", person: "Vikram Mehta", decision: "Approved", date: "30 Apr 2024", comments: "Clear differentiation opportunity identified." },
    { role: "VP Product", person: "Dr. Ananya Rao", decision: "In Review", date: "-", comments: "" },
  ],
  userDecision: "",
  userReviewComments: "",
  userApprovalDate: "",
  attachments: [
    { id: "file-1", name: "ChargePoint_Annual_Report_2023.pdf", type: "PDF Document", size: "8.5 MB", date: "06 Apr 2024", uploader: "Arjun Nair" },
    { id: "file-2", name: "Product_Feature_Comparison.xlsx", type: "Excel Spreadsheet", size: "2.3 MB", date: "10 Apr 2024", uploader: "Rahul Desai" },
    { id: "file-3", name: "SWOT_Analysis_Visual.pdf", type: "PDF Document", size: "1.8 MB", date: "15 Apr 2024", uploader: "Priya Sharma" },
    { id: "file-4", name: "Patent_Landscape_Analysis.pdf", type: "PDF Document", size: "4.2 MB", date: "18 Apr 2024", uploader: "IP Team" },
    { id: "file-5", name: "Pricing_Benchmark_Matrix.xlsx", type: "Excel Spreadsheet", size: "1.5 MB", date: "20 Apr 2024", uploader: "Suresh Kumar" },
    { id: "file-6", name: "Market_Share_Trends_2020_2024.pdf", type: "PDF Document", size: "3.1 MB", date: "22 Apr 2024", uploader: "Analytics Team" },
  ],
  activityHistory: [
    { id: "a-1", date: "02 May 2024", time: "03:30 PM", user: "Arjun Nair", action: "Updated AI Intelligence analysis and strategic recommendations", status: "Updated" },
    { id: "a-2", date: "28 Apr 2024", time: "11:00 AM", user: "Rahul Desai", action: "Completed product feature comparison matrix", status: "Completed" },
    { id: "a-3", date: "20 Apr 2024", time: "02:15 PM", user: "Suresh Kumar", action: "Added pricing benchmark analysis", status: "Added" },
    { id: "a-4", date: "15 Apr 2024", time: "10:30 AM", user: "Priya Sharma", action: "Created SWOT analysis visualization", status: "Created" },
    { id: "a-5", date: "05 Apr 2024", time: "09:00 AM", user: "Arjun Nair", action: "Created Competitive Analysis project CA-2024-0010", status: "Created" },
  ],
} as any;

async function getOrDefault() {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any) {
  const r = {
    ...record,
    projectName: record.analysisProject ?? "",
    ownerName: record.analysisOwner ?? "",
    recordCode: record.caId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getCompetitiveAnalysisFn = createServerFn({ method: "GET" }).handler(async () => {
  const data = await getOrDefault();
  return { success: true, data };
});

export const saveCompetitiveAnalysisDraftFn = createServerFn({ method: "POST" })
  .validator((d: { id?: string; input: any }) => d)
  .handler(async ({ data: { id, input } }) => {
    const existing = await getOrDefault();
    const updated = { ...existing, ...input, updatedAt: new Date().toISOString() };
    const result = await saveRecord(updated);
    return { success: true, data: result };
  });

export const submitCompetitiveAnalysisFn = createServerFn({ method: "POST" })
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

export const reviewCompetitiveAnalysisFn = createServerFn({ method: "POST" })
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

export const generateCompetitiveAnalysisReportFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async () => {
    const existing: any = await getOrDefault();
    return { success: true, data: { ...existing, reportGeneratedAt: new Date().toISOString() } };
  });
