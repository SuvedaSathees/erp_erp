import { createServerFn } from "@tanstack/react-start";
import type { FixtureRecord } from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "fixture-development";

export function calculateFixtureScores(record: Partial<FixtureRecord>) {
  const designScore = record.designReviewScore ?? 88;
  const manufacturingScore = record.manufacturingReadinessScore ?? 85;
  const validationScore = record.validationScore ?? 87;
  const commissioningScore = record.commissioningScore ?? 86;
  const performanceScore = record.performanceScore ?? 84;
  const aiScore = record.aiEngineeringScore ?? 89;

  const overallScore = Math.round(
    designScore * 0.20 +
      manufacturingScore * 0.20 +
      validationScore * 0.20 +
      commissioningScore * 0.20 +
      performanceScore * 0.20
  );

  return {
    designReviewScore: designScore,
    manufacturingReadinessScore: manufacturingScore,
    validationScore,
    commissioningScore,
    performanceScore,
    aiEngineeringScore: aiScore,
    overallFixtureReadiness: overallScore,
  };
}

export const DEFAULT_FIXTURE_RECORD: FixtureRecord = {
  id: "proc-fix-rec-0056",
  fixtureId: "FD-2024-0056",
  formCode: "FDF-2024-25",
  projectName: "EV Charger Assembly Fixture",
  fixtureVersion: "v1.2.0",
  workflowStatus: "In Progress",
  stage: 6,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  linkedProduct: { id: "PRD-EV-7KW", name: "Smart EV Charger AC 7kW" },
  linkedAssemblyLine: { id: "proc-asm-rec-0045", code: "EV Charger Assembly Line - A" },
  fixtureDesignEngineer: { name: "Rahul Sharma", avatar: "", email: "rahul.sharma@magnertia.com" },
  fixtureNumber: "FIX-EVC-ASSY-A-001",
  manufacturingPlant: "Magnertia Plant - 01",
  productionLine: "EV Charger Assembly Line - A",
  nextReviewDate: "25 Jun 2024",
  fixtureName: "EV Charger Assembly Fixture",
  fixtureCategory: "Assembly Fixture",
  productFamily: "EV Chargers",
  workstation: "WS-30: Assembly Station",
  fixturePurpose: "Holds and locates EV charger housing for accurate assembly.",
  developmentStage: "Trial Validation",
  priority: "High",
  riskLevel: "Low",
  healthIndex: 92,
  designReviewScore: 88,
  manufacturingReadinessScore: 85,
  validationScore: 87,
  commissioningScore: 86,
  performanceScore: 84,
  aiEngineeringScore: 89,
  overallFixtureReadiness: 87,
  recommendation: "Approve for Production",
  cadModel: "evc_fixture_3d.step",
  assemblyDrawing: "evc_fixture_assembly.pdf",
  detailDrawings: "evc_fixture_details.pdf",
  bom: "evc_fixture_bom.xlsx",
  locatorDesign: "locator_design.pdf",
  clampDesign: "clamp_design.pdf",
  materialSpecification: "aisi_1045_spec.pdf",
  surfaceFinish: "Ground",
  manufacturingProcess: "CNC Machining",
  cncProgram: "cnc_program.nc",
  machineAllocation: ["CNC VMC", "CMM", "Grinding"],
  materialRequirements: "AISI 1045, EN24",
  heatTreatment: true,
  surfaceTreatment: "Black Oxide",
  manufacturingLeadTime: 15,
  trialFixture: true,
  dimensionalInspection: true,
  positioningAccuracy: 0.025,
  repeatabilityTest: 0.030,
  ergonomicValidation: true,
  safetyValidation: true,
  validationRemarks: "All parameters within tolerance.",
  installationCompleted: true,
  lineIntegration: true,
  operatorTraining: true,
  maintenancePlan: "maintenance_plan.pdf",
  calibrationSchedule: "calibration_schedule.pdf",
  commissioningApproval: true,
  readinessChecklist: [
    { id: "rc-1", label: "Installation Verification Check", completed: true, notes: "Passed on Line A." },
  ],
  fixtureLife: 500000,
  productionCycles: 125000,
  downtime: 2.4,
  positioningAccuracyPerformance: 0.025,
  preventiveMaintenanceFrequency: 30,
  oeeContribution: 12.5,
  kpiTrend: [
    { period: "Jan", fixtureLifeCount: 450000, cycles: 20000, downtimeHours: 2.8, positioningAccuracy: 0.027 },
    { period: "Jun", fixtureLifeCount: 500000, cycles: 125000, downtimeHours: 2.4, positioningAccuracy: 0.025 },
  ],
  aiFixtureOptimization: "Clamp force optimized for better stability.",
  aiWearPrediction: "Wear level low. Expected life: 520,000 cycles.",
  aiFailurePrediction: "Low failure risk. Monitor locator wear.",
  aiMaintenanceRecommendation: "Next preventive maintenance in 30 days.",
  aiCostOptimization: "Material cost optimized by 8%.",
  attachments: [
    { id: "fa-1", name: "evc_fixture_3d.step", size: "12.4 MB", type: "CAD Model", uploadDate: "18 Jun 2024" },
  ],
  reviewers: [
    { id: "fr-1", role: "Fixture Design Engineer", person: "Rahul Sharma", avatar: "", decision: "Approved", date: "18 Jun 2024", comments: "Design verified.", status: "Completed" },
    { id: "fr-2", role: "Manufacturing Engineer", person: "Naresh Verma", avatar: "", decision: "Approved", date: "18 Jun 2024", comments: "Manufacturing plan ok.", status: "Completed" },
  ],
  approvalDecision: "Approved",
  reviewComments: "Fixture validated. Ready for production release.",
  approvalDate: "18 Jun 2024",
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 10:15 AM",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "20 Jun 2024 04:25 PM",
  workflowStageLabel: "Review & Approval",
  timeline: [
    { id: "fm-1", title: "Concept Created", date: "05 Jun 2024", completed: true, stageNumber: 1 },
    { id: "fm-6", title: "Review & Approval", date: "18 Jun 2024", completed: false, stageNumber: 6 },
  ],
  auditTrail: [
    { id: "fa-1", timestamp: "18 Jun 2024 10:15 AM", user: "Rahul Sharma", action: "Record Initialized", details: "Fixture design form created.", ipAddress: "192.168.1.102" },
  ],
} as any;

export const getFixtureFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_FIXTURE_RECORD };
});

export const saveFixtureDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: any }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      projectName: data.input.projectName ?? data.input.fixtureName ?? "",
      ownerName: data.input.fixtureDesignEngineer?.name ?? data.input.ownerName ?? "",
      recordCode: data.input.fixtureId ?? data.input.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitFixtureFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async () => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (current?.id) {
      const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
      return { success: true, data: result };
    }
    return { success: true, data: DEFAULT_FIXTURE_RECORD };
  });

export const reviewFixtureFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: string; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Fixture Design Engineer",
        reviewerName: "Current User",
      },
    });
    return { success: true, data: result };
  });
