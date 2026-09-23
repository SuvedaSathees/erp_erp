import { createServerFn } from "@tanstack/react-start";
import type { PfmeaRecord, PfmeaFailureMode } from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "pfmea";

export const INITIAL_PFMEA_RECORD: PfmeaRecord = {
  id: "pfmea-rec-00078",
  pfmeaId: "PFMEA-2024-00078",
  formCode: "PFMEA-2024-25",
  pfmeaTitle: "Enclosure Assembly Process PFMEA",
  pfmeaNumber: "PFMEA-AW-EVSE-001",
  pfmeaVersion: "2.1",
  product: "Autonomous W-EVSE",
  productRevision: "REV-2.1",
  manufacturingProcess: "Enclosure Assembly",
  processOwner: "Rahul Sharma",
  apqpRef: "APQP-AW-EVSE-001",
  workflowStatus: "In Progress",
  productFamily: "EV Charging Solutions",
  productionLine: "EV Assembly Line 2",
  workCentre: "MC-01 to AS-03",
  processFlowRef: "PFD-AW-EVSE-001",
  routingRef: "RTG-AW-EVSE-001",
  projectScope: "Process Failure Mode and Effects Analysis covering sheet metal cutting, bending, welding, and testing.",
  lifecycleStage: "Risk Analysis",
  priority: "High",
  functionReadinessScore: 86,
  validationScore: 82,
  aiHealthScore: 88,
  openHighRiskItems: 6,
  overallPfmeaReadinessScore: 84,
  topRpnBefore: 384,
  topRpnAfter: 96,
  failureModes: [
    { id: "fm-01", stepNo: 1, processStep: "Incoming Material Inspection", potentialFailureMode: "Incorrect Material", severity: 8, potentialEffect: "Assembly failure", occurrence: 3, potentialCause: "Supplier mix-up", currentControls: "Incoming inspection, COA check", detection: 4, actionPriority: "High (H)", rpnBefore: 96, rpnAfter: 24, status: "In Progress" },
    { id: "fm-02", stepNo: 2, processStep: "Enclosure Body Cutting", potentialFailureMode: "Dimensional Deviation", severity: 7, potentialEffect: "Poor assembly fit", occurrence: 4, potentialCause: "Machine misalignment", currentControls: "First off check", detection: 5, actionPriority: "High (H)", rpnBefore: 140, rpnAfter: 40, status: "In Progress" },
  ],
  recommendedActions: [
    { id: "act-01", action: "Implement inline weld monitoring sensor", responsible: "Vikram Singh", targetDate: "15 Jul 2024", status: "In Progress", rpnAfter: 18 },
  ],
  processValidationStatus: true,
  pilotProductionStatus: true,
  capacityCpk: 1.67,
  msaRef: "MSA-ENCL-001",
  controlPlanRef: "CP-ENCL-001",
  validationNotes: "Pilot trial completed on 50 units. Cp/Cpk 1.67/1.58 achieved.",
  aiAssessment: {
    healthScore: 88,
    failurePrediction: "6 failure modes with high RPN identified.",
    riskPatternAnalysis: "Overall risk reduced by 24%.",
    correctiveActionSuggestions: "Improve welding parameter control.",
    processOptimization: "Defect rate likely to reduce by 15%.",
    preventiveRecommendations: "Mandate daily calibration of MIG welding gas flow meters.",
  },
  recommendation: "Release for Production",
  approvalDecision: "Approved with Conditions",
  reviewers: [
    { role: "Manufacturing Engineer", person: "Rahul Sharma", decision: "Approved", date: "18 Jun 2024", comments: "Process functions validated.", status: "Approved" },
    { role: "Plant Head", person: "Sankaran R.", decision: "Approved with Conditions", date: "24 Jun 2024", comments: "Approved subject to weld sensor.", status: "Approved" },
  ],
  attachments: [
    { id: "att-pfmea-01", fileName: "pfmea_worksheet_v2.1.pdf", fileType: "PDF Document", documentType: "PFMEA Worksheet", version: "2.1", uploadedBy: "Rahul Sharma", uploadedDate: "01 Jul 2024", fileSize: "2.4 MB", status: "Active" },
  ],
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 09:15 AM",
  effectiveDate: "18 Jun 2024",
  nextReviewDate: "18 Dec 2024",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "01 Aug 2026 10:30 AM",
  workflowStage: "Review by PFMEA Board",
  version: 2.1,
  distribution: ["Manufacturing", "Quality", "Process Engineering", "APQP"],
  auditTrail: [
    { id: "log-pfmea-01", timestamp: "18 Jun 2024 09:15 AM", user: "Rahul Sharma", action: "Create PFMEA Project", description: "Created PFMEA Project PFMEA-2024-00078.", stage: "Stage 1 - Process Function Analysis" },
  ],
} as any;

export const getPfmeaRecordFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: INITIAL_PFMEA_RECORD };
});

export const savePfmeaDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { input: any })
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      projectName: data.input.pfmeaTitle ?? data.input.projectName ?? "",
      ownerName: data.input.processOwner ?? data.input.ownerName ?? "",
      recordCode: data.input.pfmeaId ?? data.input.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitPfmeaFn = createServerFn({ method: "POST" }).handler(async () => {
  const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (current?.id) {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
    return { success: true, data: result };
  }
  return { success: true, data: INITIAL_PFMEA_RECORD };
});

export const addFailureModeFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Omit<PfmeaFailureMode, "id">)
  .handler(async ({ data }) => {
    const rpnBefore = data.severity * data.occurrence * data.detection;
    const newFm: PfmeaFailureMode = {
      ...data,
      id: `fm-${Date.now()}`,
      rpnBefore,
    } as any;
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const currentData = current || INITIAL_PFMEA_RECORD;
    const updatedRecord = {
      ...currentData,
      failureModes: [...(currentData.failureModes || []), newFm],
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: updatedRecord } });
    return { success: true, data: result };
  });
