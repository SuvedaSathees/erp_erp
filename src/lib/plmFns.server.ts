import { createServerFn } from "@tanstack/react-start";
import type { PlmApprovalDecision, PlmFormInput, PlmRecord } from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "plm";

export function calculatePlmScores(record: Partial<PlmRecord>) {
  const engScore = record.engineeringScore ?? 91;
  const mfgScore = record.manufacturingScore ?? 90;
  const srvScore = record.serviceScore ?? 88;
  const riskScore = record.riskScore ?? 72;

  const overallHealth = Math.round(
    engScore * 0.3 + mfgScore * 0.3 + srvScore * 0.25 + (100 - riskScore * 0.2) * 0.15
  );

  return {
    engineeringScore: engScore,
    manufacturingScore: mfgScore,
    serviceScore: srvScore,
    riskScore: riskScore,
    overallProductHealthScore: overallHealth,
  };
}

export const DEFAULT_PLM_RECORD: PlmRecord = {
  id: "plm-rec-0021",
  plmId: "PLM-2024-0021",
  formCode: "PLMF-2024-25",
  plmProjectName: "Smart EV Charger PLM",
  productVersion: "v1.2.0",
  workflowStatus: "In Progress",
  stage: 2,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-18T11:20:00Z",
  lastUpdated: "18 Jun 2024 11:20 AM",
  linkedProduct: { id: "PRD-EV-7KW", name: "Smart EV Charger AC 7kW" },
  productOwner: { name: "Rahul Sharma", avatar: "", email: "rahul.sharma@magnertia.com" },
  lifecycleManager: { name: "Ananya Iyer", avatar: "", email: "ananya.iyer@magnertia.com" },
  businessUnit: "EV Solutions",
  productCategory: "AC EV Charger",
  productFamily: "EV Chargers",
  productPriority: "High",
  productName: "Smart EV Charger AC 7kW",
  lifecycleStage: "Manufacturing",
  productStatus: "Active",
  productDescription: "Smart AC EV Charger with OCPP 1.6J, Wi-Fi, 4G, RFID and Mobile App.",
  productConfigurationId: "CFG-SMART-AC-7KW",
  bomVersion: "BOM-7KW-V1.2",
  hardwareVersion: "HW-1.2.0",
  firmwareVersion: "FW-1.2.0",
  softwareVersion: "SW-1.2.0",
  configurationBaseline: "Baseline v1.2",
  configurationScore: 92,
  engineeringChecklist: [],
  engineeringScore: 91,
  manufacturingChecklist: [],
  manufacturingScore: 90,
  serviceChecklist: [],
  serviceScore: 88,
  ecrNumber: "ECR-2024-0125",
  ecoNumber: "ECO-2024-0098",
  revisionNumber: "R2",
  productChangeSummary: "Improved thermal design, new connector and firmware update.",
  obsolescenceRisk: "Medium",
  endOfLifePlan: "Planned for FY2031",
  riskScore: 72,
  aiProductHealthAnalysis: "Good",
  aiLifecyclePrediction: "Healthy (5.2 Years)",
  aiObsolescencePrediction: "Low Risk",
  aiReliabilityForecast: "High Reliability",
  aiImprovementSuggestions: "3 Suggestions available for thermal component life.",
  aiLifecycleScore: 89,
  overallProductHealthScore: 88,
  recommendation: "Continue Lifecycle",
  attachments: [],
  reviewers: [],
  approvalDecision: "Approved",
  reviewComments: "Product lifecycle is aligned and ready to proceed.",
  approvalDate: "18 Jun 2024",
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 10:15 AM",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "18 Jun 2024 11:20 AM",
  workflowStageLabel: "Manufacturing",
  stageProgress: [],
  lifecycleTimeline: [],
  auditTrail: [],
} as any;

export const getPlmFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_PLM_RECORD };
});

export const savePlmDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<PlmFormInput> }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: (data.input as any).plmProjectName ?? "",
      ownerName: (data.input as any).productOwner?.name ?? (data.input as any).createdBy ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitPlmFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PLM_RECORD.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result };
  });

export const reviewPlmFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: PlmApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Executive Board",
        reviewerName: "Sankaran R.",
      },
    });
    return { success: true, data: result };
  });

export const advancePlmStageFn = createServerFn({ method: "POST" })
  .validator((data: { targetStage: 1 | 2 | 3 | 4 }) => data)
  .handler(async ({ data }) => {
    // Stage advancement is now handled via the generic CRUD workflow
    return { success: true, data: DEFAULT_PLM_RECORD };
  });

export const togglePlmChecklistFn = createServerFn({ method: "POST" })
  .validator((data: { section: "engineering" | "manufacturing" | "service"; itemId: string }) => data)
  .handler(async ({ data }) => {
    // Checklist toggling is handled via save draft with updated formData
    return { success: true, data: DEFAULT_PLM_RECORD };
  });
