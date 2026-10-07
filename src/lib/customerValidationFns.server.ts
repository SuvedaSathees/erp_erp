import { createServerFn } from "@tanstack/react-start";
import {
  getDevelopmentRecordFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "customer-validation";

const DEFAULT_RECORD = {
  cvId: "CV-2024-0008",
  formCode: "CV-2024-04",
  validationProject: "Autonomous Docking System — Fleet Operator Validation",
  validationNumber: "CV-2024-0008",
  version: "1.0",
  workflowStatus: "In Progress",
  productService: "Autonomous EV Docking System",
  customerSegment: "Commercial Fleet Operators",
  validationLead: "Vikram Sharma",
  createdDate: "15 Apr 2024",
  lastModifiedDate: "10 May 2024",
  workflowStage: "Validation & Testing",
  businessObjective: "Validate product-market fit for the autonomous docking system with target fleet operators before committing to full-scale manufacturing investment.",
  validationObjective: "Confirm customer willingness to pay, measure solution acceptance rate, and validate that the autonomous docking system solves the top 3 identified pain points.",
  productVersion: "v2.1-beta",
  valuePropRef: "VP-2024-0005",
  customerDiscoveryRef: "CD-2024-0012",
  validationMethod: "Mixed (Pilot + Surveys + Interviews)",
  lifecycleStage: "Validation",
  priority: "Critical",
  targetCustomerGroup: "Tier-1 Commercial Fleet Operators (100+ vehicles)",
  sampleSize: 35,
  validationStartDate: "15 Apr 2024",
  validationEndDate: "30 Jun 2024",
  successCriteria: "NPS > 40, PMF Score > 70%, Willingness to Pay > 60%, Customer Satisfaction > 4.0/5.0",
  acceptanceCriteria: "Minimum 25 of 35 pilot customers confirm purchase intent at proposed pricing.",
  validationHypothesis: "Fleet operators managing 100+ EVs will adopt autonomous docking to reduce charging downtime by 60% and driver labor costs by 40%.",
  validationReadinessScore: 82,
  customerInterviews: 28,
  surveysCompleted: 35,
  prototypeDemos: 12,
  pilotCustomers: 8,
  customerSatisfaction: 4.3,
  npsScore: 52,
  customerFeedback: "Strong positive reception for autonomous operation. Primary concerns: integration with existing fleet management systems and maintenance SLA guarantees.",
  feedbackQualityScore: 85,
  customerProblemSolved: "Yes — 89% of pilot users confirmed the top 3 pain points (manual charging downtime, connector damage, lack of visibility) are significantly addressed.",
  solutionAcceptance: "High — 82% of demo participants expressed strong interest in procurement.",
  willingnessToPay: 68,
  purchaseIntent: 74,
  pmfScore: 78,
  retentionProbability: 88,
  pmfReadinessScore: 80,
  pricingValidation: "Proposed pricing (INR 18L/unit) accepted by 71% of respondents. 29% requested volume discounts for 10+ unit orders.",
  revenuePotential: 650000000,
  expectedAdoptionRate: 22,
  salesReadinessScore: 76,
  competitiveComparison: "Autonomous docking uniquely differentiates vs. manual plug-in competitors. Nearest competitor (ChargePoint) lacks autonomous capability.",
  commercialRisks: "Integration complexity with legacy fleet systems, post-warranty maintenance cost concerns, grid reliability in Tier-2 cities.",
  commercialScore: 79,
  pilotProgram: "8 fleet operators across Mumbai, Delhi, Bangalore — 3-month deployment with 2 units each.",
  pilotStartDate: "01 May 2024",
  pilotEndDate: "31 Jul 2024",
  pilotResults: "6 of 8 pilots showing positive ROI trajectory. Average charging time reduction: 58%. Connector damage incidents: zero.",
  customerSuccessStories: "BlueDart Express: 42% reduction in depot charging time. Mahindra Logistics: Zero connector damage in 60 days of autonomous operation.",
  lessonsLearned: "Integration APIs need pre-built connectors for top 5 fleet management platforms. Maintenance training for depot staff reduces support tickets by 65%.",
  pilotSuccessScore: 83,
  aiCustomerInsights: "AI analysis of 28 interviews reveals 3 adoption accelerators: TCO proof (weight: 0.35), uptime guarantee (0.30), fleet integration (0.25).",
  aiAdoptionPrediction: "Predicted 22% adoption in Year 1, scaling to 48% by Year 3. Key driver: peer fleet operator referrals after successful pilots.",
  aiPmfAnalysis: "Product-Market Fit score of 78% exceeds 40% threshold. Strong signal in fleet operator segment (100-500 vehicles).",
  aiRevenueForecast: "Cumulative revenue projection: INR 650Cr over 3 years. Break-even at unit #180 (Month 14).",
  aiChurnPrediction: "Predicted churn: 12% annually. Primary churn driver: competitor pricing pressure. Mitigation: lock-in via software ecosystem.",
  aiImprovementRecs: "Priority improvements: (1) Pre-built fleet API connectors, (2) Predictive maintenance alerts, (3) Multi-depot dashboard.",
  aiValidationScore: 81,
  recommendation: "Proceed to Manufacturing Readiness",
  approvals: [
    { role: "Validation Lead", person: "Vikram Sharma", decision: "Approved", date: "08 May 2024", comments: "Strong validation results across all pilot sites." },
    { role: "Product Manager", person: "Priya Sharma", decision: "Approved", date: "09 May 2024", comments: "PMF score exceeds threshold. Ready for scale." },
    { role: "VP Engineering", person: "Dr. Anil Patel", decision: "In Review", date: "-", comments: "" },
  ],
  userDecision: "",
  userReviewComments: "",
  userApprovalDate: "",
  attachments: [
    { id: "file-1", name: "Pilot_Program_Report_Phase1.pdf", type: "PDF Document", size: "5.8 MB", date: "05 May 2024", uploader: "Vikram Sharma" },
    { id: "file-2", name: "Customer_Interview_Analysis.xlsx", type: "Excel Spreadsheet", size: "3.2 MB", date: "28 Apr 2024", uploader: "Neha Gupta" },
    { id: "file-3", name: "Survey_Results_35_Respondents.pdf", type: "PDF Document", size: "2.4 MB", date: "25 Apr 2024", uploader: "Rahul Desai" },
    { id: "file-4", name: "Prototype_Demo_Feedback.pdf", type: "PDF Document", size: "4.1 MB", date: "20 Apr 2024", uploader: "Field Team" },
    { id: "file-5", name: "PMF_Score_Calculation.xlsx", type: "Excel Spreadsheet", size: "1.8 MB", date: "08 May 2024", uploader: "Analytics Team" },
    { id: "file-6", name: "Competitive_Comparison_Matrix.pdf", type: "PDF Document", size: "2.9 MB", date: "22 Apr 2024", uploader: "Arjun Nair" },
    { id: "file-7", name: "BlueDart_Success_Story.pdf", type: "PDF Document", size: "1.5 MB", date: "06 May 2024", uploader: "Vikram Sharma" },
    { id: "file-8", name: "Revenue_Projection_Model.xlsx", type: "Excel Spreadsheet", size: "3.7 MB", date: "09 May 2024", uploader: "Suresh Kumar" },
  ],
  activityHistory: [
    { id: "a-1", date: "10 May 2024", time: "04:15 PM", user: "Vikram Sharma", action: "Updated pilot results with Month 2 data", status: "Updated" },
    { id: "a-2", date: "08 May 2024", time: "11:00 AM", user: "Neha Gupta", action: "Completed customer interview analysis (28 interviews)", status: "Completed" },
    { id: "a-3", date: "05 May 2024", time: "02:30 PM", user: "Rahul Desai", action: "Uploaded survey results from 35 respondents", status: "Uploaded" },
    { id: "a-4", date: "20 Apr 2024", time: "10:45 AM", user: "Field Team", action: "Completed 12 prototype demonstrations", status: "Completed" },
    { id: "a-5", date: "15 Apr 2024", time: "09:00 AM", user: "Vikram Sharma", action: "Created Customer Validation project CV-2024-0008", status: "Created" },
  ],
} as any;

async function getOrDefault() {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_RECORD;
}

async function saveRecord(record: any) {
  const r = {
    ...record,
    projectName: record.validationProject ?? "",
    ownerName: record.validationLead ?? "",
    recordCode: record.cvId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getCustomerValidationFn = createServerFn({ method: "GET" }).handler(async () => {
  const data = await getOrDefault();
  return { success: true, data };
});

export const saveCustomerValidationDraftFn = createServerFn({ method: "POST" })
  .validator((d: { id?: string; input: any }) => d)
  .handler(async ({ data: { id, input } }) => {
    const existing = await getOrDefault();
    const updated = { ...existing, ...input, updatedAt: new Date().toISOString() };
    const result = await saveRecord(updated);
    return { success: true, data: result };
  });

export const submitCustomerValidationFn = createServerFn({ method: "POST" })
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

export const reviewCustomerValidationFn = createServerFn({ method: "POST" })
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

export const generateCustomerValidationReportFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async () => {
    const existing: any = await getOrDefault();
    return { success: true, data: { ...existing, reportGeneratedAt: new Date().toISOString() } };
  });
