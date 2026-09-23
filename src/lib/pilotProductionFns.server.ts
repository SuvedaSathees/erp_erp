import { createServerFn } from "@tanstack/react-start";
import type { PilotProductionRecord } from "@/lib/pilot-production/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "pilot-production";

export const MOCK_PILOT_RECORD_78: PilotProductionRecord = {
  id: "PILOT-2024-00078",
  formCode: "PPFD-2024-25",
  pilotBatchTitle: "Autonomous W-EVSE Pilot Production",
  pilotBatchNumber: "PB-ENCL-AW-001",
  version: "1.0",
  workflowStatus: "In Progress",
  product: "Autonomous W-EVSE",
  productRevision: "REV-2.1",
  manufacturingProcess: "Enclosure Assembly",
  productionLine: "Line-02",
  processValidationRef: "PV-ENCL-AW-001",
  createdDate: "10 Jun 2024",
  lastUpdated: "17 Jun 2024",
  createdBy: "Rahul Sharma",
  lastModifiedBy: "Rahul Sharma",
  pilotObjective: "Validate manufacturing readiness in real shop floor conditions.",
  productionScope: "Enclosure assembly including welding, sealing, fastening, and final test.",
  productionLocation: "Plant-01",
  pilotTeam: [
    { name: "Rahul Sharma", role: "Production Manager" },
    { name: "Vikram Singh", role: "Manufacturing Engineer" },
  ],
  processOwner: "Vikram Singh",
  scheduleStart: "2024-06-10",
  scheduleEnd: "2024-06-18",
  lifecycleStage: "Pilot Production",
  priority: "High",
  productionOrderRef: "PO-ENCL-240610",
  bomReference: "BOM-ENCL-REV2.1",
  routingReference: "RTG-ENCL-AW-001",
  plannedQuantity: 1000,
  actualQuantity: 982,
  materialAvailability: "Available",
  materialAvailabilityAuto: true,
  machineAllocations: ["WC-01", "WC-02", "WC-03", "WC-04", "WC-05"],
  operatorAssignment: "OP-Team-02",
  productionStart: "2024-06-10T08:00",
  productionEnd: "2024-06-15T18:45",
  productionStatus: "Completed",
  machineUtilization: 82.4,
  cycleTimeMinutes: 4.35,
  throughputUnitsPerHour: 136.5,
  downtimeHours: 2.8,
  oee: 78.6,
  incomingInspectionPassed: true,
  incomingInspectionAuto: true,
  inProcessInspectionPassed: true,
  inProcessInspectionAuto: true,
  finalInspectionPassed: true,
  finalInspectionAuto: true,
  defectRate: 0.68,
  fpy: 96.40,
  scrapRate: 0.42,
  reworkRate: 0.56,
  qualityScore: 90,
  cp: 1.67,
  cpk: 1.53,
  spcStatus: "Active",
  msaStatus: "Acceptable",
  processStabilityScore: 88,
  controlPlanRef: "CP-ENCL-REV2.1",
  controlPlanCompliance: "Compliant",
  performanceScore: 87,
  stabilityTrend: [
    { date: "11 Jun", score: 82 },
    { date: "17 Jun", score: 88 },
  ],
  equipmentReadiness: true,
  equipmentReadinessAuto: true,
  toolingReadiness: true,
  toolingReadinessAuto: true,
  operatorReadiness: true,
  operatorReadinessAuto: true,
  materialReadiness: true,
  materialReadinessAuto: true,
  safetyReadiness: true,
  safetyReadinessAuto: true,
  documentationComplete: true,
  documentationCompleteAuto: true,
  productionReadinessScore: 88,
  aiProductivityAnalysis: "Overall productivity is good with potential 8.2% improvement.",
  aiQualityPrediction: "Low defect trend expected to continue.",
  aiBottleneckDetection: "Welding station (WC-05) is the potential bottleneck.",
  aiDowntimeAnalysis: "Electrical downtime contributes 36% of total downtime.",
  aiOptimizationRecommendations: "Re-balance operators and optimize changeover time.",
  aiProductionHealthScore: 88,
  productionScore: 85,
  overallPilotReadiness: 86,
  recommendation: "Release for Mass Production",
  approvalDecision: "Approved",
  reviewers: [
    { role: "Manufacturing Engineer", reviewer: "Vikram Singh", status: "Approved", comments: "All tooling and machine allocations cleared." },
    { role: "Plant Head", reviewer: "Sankaran R.", status: "Pending" },
  ],
  reviewComments: "Pilot run executed within standards. Ready for mass production.",
  approvalDate: "17 Jun 2024",
  attachments: [
    { id: "att-01", filename: "Production Report.pdf", source: "auto:mes", uploadedAt: "17 Jun 2024", fileSize: "2.4 MB", moduleName: "MES" },
  ],
  auditTrail: [
    { id: "at-01", timestamp: "10 Jun 2024 09:15 AM", user: "Rahul Sharma", action: "Record Created", description: "Initial pilot production record created." },
  ],
} as any;

export const getPilotProductionRecordFn = createServerFn({ method: "GET" })
  .validator((data?: { id?: string }) => data)
  .handler(async () => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result };
    return { success: true, data: MOCK_PILOT_RECORD_78 };
  });

export const listPilotProductionRecordsFn = createServerFn({ method: "GET" }).handler(async () => {
  const results = await listDevelopmentRecordsFn({ data: { moduleType: MODULE_TYPE } });
  if (results && results.length > 0) return { success: true, data: results };
  return { success: true, data: [MOCK_PILOT_RECORD_78] };
});

export const savePilotProductionDraftFn = createServerFn({ method: "POST" })
  .validator((data: { record: PilotProductionRecord }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.record,
      projectName: data.record.pilotBatchTitle ?? (data.record as any).projectName ?? "",
      ownerName: data.record.processOwner ?? (data.record as any).ownerName ?? "",
      recordCode: data.record.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });
