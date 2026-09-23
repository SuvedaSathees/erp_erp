import { createServerFn } from "@tanstack/react-start";
import type { MassProductionReadiness } from "@/lib/mass-production-readiness/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "mass-production-readiness";

export const MOCK_READINESS_RECORD_56: MassProductionReadiness = {
  id: "RDR-2024-00056",
  formCode: "MPRF-2024-25",
  readinessTitle: "Autonomous W-EVSE Mass Production Readiness",
  readinessNumber: "MR-ENCL-AW-001",
  version: "1.0",
  workflowStatus: "In Progress",
  sopReleasedAt: null,
  product: "Autonomous W-EVSE",
  productRevision: "REV-2.1",
  manufacturingPlant: "Plant-01",
  productionLine: "Line-02",
  pilotProductionRef: "PILOT-2024-00078",
  ppapRef: "PPAP-ENCL-2024-01",
  productionProgramRef: "AW-EVSE-24",
  createdDate: "10 Jun 2024",
  lastUpdated: "17 Jun 2024",
  createdBy: "Rahul Sharma",
  lastModifiedBy: "Rahul Sharma",
  productionLaunchTarget: "2024-07-01",
  manufacturingStrategy: "Make-to-Stock (MTS)",
  launchPhase: "Mass Production Readiness",
  processOwner: "Vikram Singh",
  crossFunctionalTeam: [
    { name: "Rahul Sharma", role: "Production Manager" },
    { name: "Vikram Singh", role: "Manufacturing Lead" },
  ],
  readinessPriority: "High",
  launchObjective: "Ensure all systems are validated and ready for mass production.",
  productionLineQualified: true,
  equipmentQualification: true,
  toolingQualification: true,
  manufacturingCapacityVerified: true,
  oeeTargetAchieved: true,
  cycleTimeVerified: true,
  standardWorkAvailable: true,
  manufacturingReadinessScore: 93,
  pfmeaApproved: true,
  controlPlanApproved: true,
  spcActive: true,
  msaApproved: true,
  ppapStatus: "Customer Approved",
  qualityTargetsAchieved: true,
  customerRequirementsVerified: true,
  qualityReadinessScore: 91,
  supplierApprovalStatus: "Approved",
  rawMaterialAvailability: true,
  safetyStockAvailable: true,
  logisticsReadiness: true,
  packagingValidation: true,
  warehouseReady: true,
  supplyChainScore: 90,
  plannedProductionCapacityUnitsPerMonth: 12000,
  expectedDailyOutputUnits: 400,
  oee: 87.6,
  fpy: 96.2,
  scrapRate: 0.42,
  cp: 1.72,
  cpk: 1.65,
  performanceScore: 89,
  operatorTrainingCompleted: true,
  maintenanceTeamReady: true,
  sparePartsAvailable: true,
  safetyAuditCompleted: true,
  emergencyResponsePlan: true,
  itMesReady: true,
  operationalReadinessScore: 89,
  aiProductionRiskAnalysis: "All key risks are mitigated.",
  aiCapacityPrediction: "Available capacity is sufficient with 15% buffer.",
  aiBottleneckPrediction: "Welding station WC-05 may become a bottleneck.",
  aiQualityPrediction: "Defect rate expected to remain below 0.45%.",
  aiDemandForecast: "High demand expected in Q3-2024.",
  aiProductionReadinessScore: 94,
  overallMassProductionReadiness: 92,
  recommendation: "Release for Mass Production",
  approvalDecision: "Approved",
  reviewers: [
    { role: "Manufacturing Head", reviewer: "Vikram Singh", status: "Approved", comments: "Production line 02 fully qualified." },
    { role: "Plant Head", reviewer: "Sankaran R.", status: "Approved", comments: "Go for Start of Production." },
  ],
  executiveComments: "All systems cleared for mass release.",
  approvalDate: "17 Jun 2024",
  sopActions: {
    releaseProductionOrders: null,
    authorizeSupplierDeliveries: null,
    releaseProductionMaterials: null,
    releaseSop: null,
  },
  attachments: [
    { id: "att-mpr-01", filename: "Pilot Production Report.pdf", source: "auto:pilot-production", uploadedAt: "17 Jun 2024", fileSize: "3.2 MB", moduleName: "Pilot Production" },
  ],
  auditTrail: [
    { id: "at-rdr-01", timestamp: "10 Jun 2024 09:18 AM", user: "Rahul Sharma", action: "Record Created", description: "Created Mass Production Readiness record RDR-2024-00056." },
  ],
} as any;

export const getMassProductionReadinessFn = createServerFn({ method: "GET" })
  .validator((data?: { id?: string }) => data)
  .handler(async () => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result };
    return { success: true, data: MOCK_READINESS_RECORD_56 };
  });

export const listMassProductionReadinessFn = createServerFn({ method: "GET" }).handler(async () => {
  const results = await listDevelopmentRecordsFn({ data: { moduleType: MODULE_TYPE } });
  if (results && results.length > 0) return { success: true, data: results };
  return { success: true, data: [MOCK_READINESS_RECORD_56] };
});

export const saveMassProductionReadinessFn = createServerFn({ method: "POST" })
  .validator((data: { record: MassProductionReadiness }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.record,
      projectName: data.record.readinessTitle ?? (data.record as any).projectName ?? "",
      ownerName: data.record.processOwner ?? (data.record as any).ownerName ?? "",
      recordCode: data.record.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });
