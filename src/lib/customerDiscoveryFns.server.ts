import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "customer-discovery";

const DEFAULT_RECORD = {
  cdId: "CD-2024-0012",
  formCode: "CD-2024-06",
  projectTitle: "Fleet Operator Pain Point Discovery — EV Charging",
  discoveryNumber: "CD-2024-0012",
  version: "1.0",
  workflowStatus: "In Progress",
  productService: "Autonomous EV Docking System",
  customerSegment: "Commercial Fleet Operators",
  discoveryLead: "Neha Gupta",
  createdDate: "10 Apr 2024",
  lastModifiedDate: "28 Apr 2024",
  workflowStage: "Discovery & Research",
  businessObjective: "Systematically identify and validate customer problems in the commercial fleet EV charging space to inform product development priorities.",
  discoveryGoal: "Conduct 50+ structured interviews with fleet operators across 3 regions to map jobs-to-be-done, pain points, and willingness to adopt autonomous charging solutions.",
  industry: "Electric Vehicle Infrastructure",
  targetMarket: "South Asia — India, Sri Lanka, Bangladesh",
  customerPersona: "Fleet Operations Manager, 35-50 years, managing 50-500 vehicles, responsible for TCO optimization and sustainability compliance.",
  discoveryMethod: "Mixed Methods (Interviews + Surveys + Field Observation)",
  lifecycleStage: "Early Growth",
  priority: "High",
  projectStatus: "Active",
  industryType: "Electric Mobility & Fleet Management",
  companySize: "Mid-Market (100-1000 employees)",
  geoMarket: ["India", "Sri Lanka", "Bangladesh"],
  customerRole: "Fleet Operations Manager",
  buyingAuthority: "Budget Approver",
  revenueRange: "INR 50Cr - 500Cr",
  segmentReadinessScore: 78,
  jobsToBeDone: "Minimize vehicle downtime during charging, reduce per-km energy cost, ensure driver schedule compliance, maintain fleet utilization above 85%.",
  painPoints: "Unpredictable charging wait times, manual plug-in errors causing connector damage, no real-time visibility into charging status across depots.",
  existingSolutions: "Manual plug-in chargers with basic scheduling software, third-party charging network subscriptions.",
  frustrations: "Frequent charger failures, no integration with fleet management systems, lack of predictive maintenance alerts.",
  desiredOutcomes: "Automated charging without driver intervention, real-time fleet energy dashboard, predictive maintenance, guaranteed 99.5% uptime.",
  problemFrequency: "Daily",
  problemSeverity: "High",
  problemValidationScore: 85,
  interviewsConducted: 42,
  surveysCompleted: 156,
  focusGroups: 4,
  observationSessions: 8,
  customerVisits: 12,
  researchNotes: "Key insight: 78% of fleet operators cite manual charging as their #1 operational bottleneck. Autonomous solutions viewed as premium but essential for scale.",
  supportingEvidenceFile: "",
  researchReadinessScore: 81,
  buyingTrigger: "Fleet expansion beyond 100 vehicles OR government mandate for EV transition timeline.",
  buyingProcess: "RFP-driven, 3-6 month evaluation cycle, typically involves Operations Head + CFO + Sustainability Officer.",
  decisionMakers: ["VP Operations", "CFO", "Chief Sustainability Officer"],
  influencers: ["Fleet Drivers", "Depot Managers", "EV OEM Account Managers"],
  purchaseFrequency: "Annual contract with multi-year lock-in preferred",
  budgetRange: "INR 2Cr - 10Cr per depot",
  buyingBehaviourScore: 74,
  marketOpportunity: "Commercial fleet electrification in South Asia projected at $4.2B by 2028 (CAGR 32%).",
  tam: 42000000000,
  sam: 8400000000,
  som: 2100000000,
  competitiveLandscape: "Fragmented — 15+ players, no dominant autonomous solution. Top 3 hold 35% combined share.",
  opportunitySize: "Large (>$1B addressable)",
  opportunityScore: 82,
  aiPersonaAnalysis: "AI identifies 3 distinct operator personas: Cost Optimizer (45%), Tech Adopter (30%), Compliance Driven (25%). Each requires tailored value messaging.",
  aiBehaviourPrediction: "Predicted adoption rate: 18% in Year 1, 42% by Year 3 among target segment. Key driver: TCO reduction proof.",
  aiDemandForecast: "2,800 autonomous docking units by 2027. Revenue potential: INR 450Cr cumulative.",
  aiOpportunityAnalysis: "Highest-value entry: Tier-1 metro fleet hubs (Mumbai, Delhi, Bangalore). Secondary: Highway corridor charging.",
  aiProductRecommendations: "Prioritize fleet management integration, predictive maintenance module, and multi-protocol support (CCS2 + CHAdeMO).",
  aiRiskAnalysis: "Key risks: Grid reliability in Tier-2 cities (mitigation: battery buffer), competitor price wars (mitigation: lock-in via software ecosystem).",
  aiDiscoveryScore: 80,
  recommendation: "Proceed to Customer Validation",
  approvalDecision: "",
  approvalDate: "",
  reviewComments: "",
  approvals: [
    { role: "Discovery Lead", person: "Neha Gupta", decision: "Approved", date: "25 Apr 2024" },
    { role: "Product Manager", person: "Vikram Sharma", decision: "Approved", date: "27 Apr 2024" },
    { role: "VP Strategy", person: "Rajesh Iyer", decision: "In Review", date: "-" },
  ],
  attachments: [
    { id: "file-1", name: "Interview_Transcripts_Batch1.pdf", size: "8.2 MB", date: "15 Apr 2024", uploader: "Neha Gupta" },
    { id: "file-2", name: "Survey_Results_Fleet_Operators.xlsx", size: "3.5 MB", date: "18 Apr 2024", uploader: "Rahul Desai" },
    { id: "file-3", name: "Focus_Group_Summary_Bangalore.pdf", size: "2.1 MB", date: "20 Apr 2024", uploader: "Priya Sharma" },
    { id: "file-4", name: "Depot_Visit_Photo_Evidence.pdf", size: "12.4 MB", date: "22 Apr 2024", uploader: "Field Team" },
    { id: "file-5", name: "Competitor_Solution_Teardown.pdf", size: "5.7 MB", date: "23 Apr 2024", uploader: "Arjun Nair" },
    { id: "file-6", name: "Customer_Journey_Map.pdf", size: "1.9 MB", date: "24 Apr 2024", uploader: "Neha Gupta" },
    { id: "file-7", name: "Market_Sizing_Model.xlsx", size: "4.3 MB", date: "25 Apr 2024", uploader: "Suresh Kumar" },
    { id: "file-8", name: "Pain_Point_Heatmap.pdf", size: "2.6 MB", date: "26 Apr 2024", uploader: "Analytics Team" },
  ],
  activityHistory: [
    { id: "a-1", user: "Neha Gupta", action: "Updated AI Discovery analysis scores", date: "28 Apr 2024", time: "03:45 PM" },
    { id: "a-2", user: "Rahul Desai", action: "Completed 156 survey responses analysis", date: "25 Apr 2024", time: "11:30 AM" },
    { id: "a-3", user: "Priya Sharma", action: "Added focus group findings from Bangalore sessions", date: "20 Apr 2024", time: "02:15 PM" },
    { id: "a-4", user: "Neha Gupta", action: "Created Customer Discovery project CD-2024-0012", date: "10 Apr 2024", time: "09:00 AM" },
  ],
} as any;

async function getOrDefault() {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any) {
  const r = {
    ...record,
    projectName: record.projectTitle ?? "",
    ownerName: record.discoveryLead ?? "",
    recordCode: record.cdId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getCustomerDiscoveryFn = createServerFn({ method: "GET" }).handler(async () => {
  const data = await getOrDefault();
  return { success: true, data };
});

export const saveCustomerDiscoveryDraftFn = createServerFn({ method: "POST" })
  .validator((d: { id?: string; input: any }) => d)
  .handler(async ({ data: { id, input } }) => {
    const existing = await getOrDefault();
    const updated = { ...existing, ...input, updatedAt: new Date().toISOString() };
    const result = await saveRecord(updated);
    return { success: true, data: result };
  });

export const submitCustomerDiscoveryFn = createServerFn({ method: "POST" })
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

export const reviewCustomerDiscoveryFn = createServerFn({ method: "POST" })
  .validator((d: { id: string; decision: string; comments?: string }) => d)
  .handler(async ({ data: { decision, comments } }) => {
    const existing: any = await getOrDefault();
    const updated = {
      ...existing,
      approvalDecision: decision,
      reviewComments: comments || "",
      approvalDate: new Date().toISOString().substring(0, 10),
      workflowStatus: decision === "Approved" ? "Approved" : decision === "Rejected" ? "Rejected" : "Revision Required",
      updatedAt: new Date().toISOString(),
    };
    const result = await saveRecord(updated);
    return { success: true, data: result };
  });

export const generateCustomerDiscoveryReportFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async () => {
    const existing: any = await getOrDefault();
    return { success: true, data: { ...existing, reportGeneratedAt: new Date().toISOString() } };
  });
