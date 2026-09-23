import { createServerFn } from "@tanstack/react-start";
import type { ManufacturingExcellenceRecord } from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "manufacturing-excellence";

export const INITIAL_MANUFACTURING_EXCELLENCE_RECORD: ManufacturingExcellenceRecord = {
  id: "mex-rec-2024-00045",
  manufacturingExcellenceId: "MEX-2024-00045",
  formCode: "MEXF-2024-25",
  initiativeTitle: "OEE Improvement & Cost Optimization Initiative",
  initiativeNumber: "MEX-INIT-24-001",
  version: 1.0,
  workflowStatus: "In Progress",
  manufacturingPlant: "Plant-01",
  businessUnit: "EVSE Manufacturing",
  processOwner: "Rahul Sharma",
  startDate: "05 May 2024",
  targetCompletion: "30 Nov 2024",
  initiativeCategory: "Operational Excellence",
  businessObjective: "Improve overall equipment effectiveness, reduce production cost and enhance quality.",
  currentPerformance: "OEE 72%, High downtime, Defects 1.8%, High energy cost.",
  targetPerformance: "OEE 85%, Downtime < 5%, Defects < 0.5%, Cost reduction 12%.",
  improvementStrategy: "Lean, TPM, AI analytics, predictive maintenance and automation.",
  expectedBusinessBenefits: "Higher productivity, lower cost, better quality and sustainability.",
  priority: "High",
  initiativeStatus: "Implementation",
  oeePercentage: 72.65,
  productivityIndex: 78,
  qualityPerformance: 83,
  deliveryPerformance: 80,
  costEfficiency: 75,
  safetyPerformance: 90,
  sustainabilityAssessmentScore: 82,
  operationalExcellenceScore: 86,
  leanManufacturing: true,
  sixSigmaProject: true,
  kaizenInitiative: true,
  tpmProgram: true,
  fiveSImplementation: true,
  valueStreamMapping: true,
  standardWork: true,
  improvementScore: 85,
  smartFactoryIntegration: true,
  aiManufacturingAnalytics: true,
  roboticsOptimization: true,
  iiotConnectivity: true,
  digitalTwin: true,
  predictiveMaintenance: true,
  energyOptimization: true,
  digitalExcellenceScore: 84,
  customerPpm: 850,
  firstPassYield: 96.40,
  processCapabilityCpk: "1.67 / 1.89",
  capaStatus: "In Progress",
  auditCompliance: 94.50,
  regulatoryCompliance: true,
  qualityExcellenceScore: 88,
  energyConsumption: 1.24,
  carbonEmissions: 0.68,
  waterConsumption: 2.35,
  wasteReduction: 18.60,
  recyclingRate: 72.30,
  esgCompliance: true,
  sustainabilityScore: 82,
  aiPerformanceInsights: "AI identifies key loss areas and root causes.",
  productivityForecast: "Expected 14% productivity improvement.",
  predictiveQuality: "AI predicts defect reduction by 20%.",
  costOptimizationText: "Potential savings of ₹ 18.75 Lakhs.",
  riskPredictionText: "Low risk with proactive AI alerts.",
  aiRecommendations: "Focus on downtime, energy and quality.",
  aiExcellenceScore: 89,
  overallManufacturingExcellenceScore: 87,
  recommendation: "Approve Excellence Initiative",
  attachments: [
    { id: "att-mex-001", fileName: "Improvement_Roadmap.pdf", fileType: "PDF Document", documentType: "Improvement Roadmap", version: "1.0", uploadedBy: "Rahul Sharma", uploadedDate: "17 Jun 2024", fileSize: "3.4 MB", status: "Active" },
  ],
  manufacturingExcellenceManager: "Vikram Singh",
  productionManager: "Neha Reddy",
  qualityManager: "Sneha Iyer",
  maintenanceManager: "Rajesh Patel",
  operationsManager: "Arun Kumar",
  plantHead: "Sankaran R.",
  coo: "Rakesh Patel",
  cto: "Sanjay Patel",
  ceo: "Anil Mehta",
  approvalDecision: "Pending",
  reviewComments: "",
  approvalDate: "17 Jun 2024",
  reviewers: [
    { id: "rev-mex-1", role: "Excellence Manager", person: "Vikram Singh", decision: "Approved", date: "10 May 2024", comments: "Lean & Six Sigma framework verified." },
    { id: "rev-mex-6", role: "Plant Head", person: "Sankaran R.", decision: "Pending", date: "-", comments: "Reviewing plant-wide deployment." },
  ],
  createdBy: "Rahul Sharma",
  createdDate: "05 May 2024 09:20 AM",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "17 Jun 2024 03:45 PM",
  workflowStage: "Implementation",
  auditTrail: [
    { id: "aud-mex-1", timestamp: "05 May 2024 09:20 AM", user: "Rahul Sharma", action: "Record Created", details: "Initial Manufacturing Excellence initiative created." },
  ],
} as any;

export const getExcellenceRecordFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: INITIAL_MANUFACTURING_EXCELLENCE_RECORD };
});

export const saveExcellenceDraftFn = createServerFn({ method: "POST" })
  .validator((data: { input: any }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      projectName: data.input.initiativeTitle ?? data.input.projectName ?? "",
      ownerName: data.input.processOwner ?? data.input.ownerName ?? "",
      recordCode: data.input.manufacturingExcellenceId ?? data.input.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitExcellenceReviewFn = createServerFn({ method: "POST" }).handler(async () => {
  const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (current?.id) {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
    return { success: true, data: result };
  }
  return { success: true, data: INITIAL_MANUFACTURING_EXCELLENCE_RECORD };
});

export const updateExcellenceDecisionFn = createServerFn({ method: "POST" })
  .validator((data: { decision: string; comments: string }) => data)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await reviewDevelopmentFn({
        data: {
          id: current.id,
          decision: data.decision,
          comments: data.comments,
          reviewerRole: "Excellence Manager",
          reviewerName: "Current User",
        },
      });
      return { success: true, data: result };
    }
    return { success: true, data: INITIAL_MANUFACTURING_EXCELLENCE_RECORD };
  });
