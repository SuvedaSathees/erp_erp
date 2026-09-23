import { createServerFn } from "@tanstack/react-start";
import type { ApqpRecord } from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "apqp";

export const INITIAL_APQP_RECORD: ApqpRecord = {
  id: "apqp-rec-00056",
  apqpId: "APQP-2024-00056",
  formCode: "AQPL-2024-25",
  apqpProjectName: "Autonomous W-EVSE Quality Program",
  apqpNumber: "APQP-AW-EVSE-001",
  product: "Autonomous W-EVSE",
  productRevision: "REV-2.1",
  customer: "EcoVolt Mobility Pvt. Ltd.",
  apqpPhase: "Phase 3 – Process Design & Development",
  projectManager: "Rahul Sharma",
  workflowStatus: "In Progress",
  productFamily: "EV Charging Solutions",
  productModel: "AW-EVSE-7KW",
  projectScope: "Design, develop and launch of 7kW Smart EVSE Wall-Mounted Charger.",
  customerRequirements: "As per EcoVolt technical specification Rev 2.1, ISO 9001:2015.",
  targetSopDate: "15 Jul 2024",
  programStatus: "In Progress",
  priority: "High",
  overallApqpScore: 84,
  phase1Completed: true,
  phase2Completed: true,
  phase3Completed: false,
  phase4Completed: false,
  phase5Completed: false,
  phaseOwner: "Rahul Sharma",
  phaseCompletionPercentage: 65,
  phaseReadinessScore: 84,
  deliverables: [
    { phaseNumber: 1, phaseName: "Phase 1: Plan & Define Program", keyDeliverables: "Project Plan, Team, Scope", owner: "Rahul Sharma", targetDate: "20 Apr 2024", status: "Completed", completionPercentage: 100 },
    { phaseNumber: 2, phaseName: "Phase 2: Product Design & Development", keyDeliverables: "DFMEA, Design Review", owner: "Neha Reddy", targetDate: "20 May 2024", status: "Completed", completionPercentage: 100 },
    { phaseNumber: 3, phaseName: "Phase 3: Process Design & Development", keyDeliverables: "PFMEA, Control Plan, Process Flow", owner: "Vikram Singh", targetDate: "15 Jun 2024", status: "In Progress", completionPercentage: 65 },
  ],
  dfmeaRef: "DFMEA-AW-EVSE-001",
  pfmeaRef: "PFMEA-AW-EVSE-002",
  controlPlanRef: "CP-AW-EVSE-001",
  bomRef: "BOM-AW-EVSE-001",
  routingRef: "RTG-AW-EVSE-001",
  processFlowDiagramFile: "process_flow.png",
  engineeringSpecsFile: "engineering_specs.pdf",
  designReadinessScore: 85,
  prototypeBuildStatus: true,
  pilotBuildStatus: true,
  processCapabilityCpk: 1.67,
  msaStatus: true,
  productionTrialStatus: true,
  ppapStatus: "In Preparation",
  validationReadinessScore: 82,
  approvedSupplier: "EcoComponent Technologies",
  supplierApqpStatus: "Approved",
  supplierPpapStatus: "Submitted",
  supplierAuditScore: 92,
  incomingQualityPlanFile: "iqc_plan.pdf",
  supplierRisks: "Low risk. Dual sourcing verified.",
  highRiskCharacteristics: "Transmitter coil assembly alignment, IP67 enclosure seam weld integrity.",
  criticalControlPoints: "OP-40 Robotic MIG Welding, OP-70 SMT Reflow Soldering.",
  openRisks: "3 medium risks identified in SMT thermal reflow profile.",
  correctiveActions: "Optimized reflow zone 4 temperature setpoint.",
  preventiveActions: "Automated optical inspection (AOI) feeder added.",
  lessonsLearned: "Use pre-baked PCB boards to eliminate delamination.",
  riskReadinessScore: 78,
  costReadinessScore: 83,
  aiAssessment: {
    healthScore: 84,
    riskPrediction: "Low risk. 3 medium risks identified.",
    qualityTrendAnalysis: "Defect trend is within acceptable limits.",
    defectPrediction: "Potential defect rate: 0.42%.",
    processOptimization: "Cycle time can be improved by 6.3%.",
    supplierRiskAnalysis: "Supplier risk level: Low.",
  },
  designScore: 85,
  validationScore: 82,
  supplierQualityScore: 80,
  riskScore: 78,
  apqpHealthScore: 84,
  overallProjectReadiness: 84,
  recommendation: "Release for Production",
  approvalDecision: "Approved with Conditions",
  reviewers: [
    { role: "APQP Manager", person: "Rahul Sharma", decision: "Approved", date: "18 Jun 2024", comments: "Project plan validated.", status: "Approved" },
    { role: "Plant Head", person: "Sankaran R.", decision: "Approved with Conditions", date: "24 Jun 2024", comments: "Approved subject to pilot build completion.", status: "Approved" },
  ],
  attachments: [
    { id: "att-apqp-01", fileName: "apqp_checklist.pdf", fileType: "PDF Document", documentType: "APQP Checklist", version: "2.1", uploadedBy: "Rahul Sharma", uploadedDate: "18 Jun 2024", fileSize: "1.5 MB", status: "Active" },
  ],
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 09:15 AM",
  effectiveDate: "18 Jun 2024",
  nextReviewDate: "18 Dec 2024",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "01 Aug 2026 10:30 AM",
  workflowStage: "Review by APQP Board",
  version: 2.1,
  distribution: ["Engineering", "Quality", "Manufacturing", "Supplier"],
  auditTrail: [
    { id: "log-apqp-01", timestamp: "18 Jun 2024 09:15 AM", user: "Rahul Sharma", action: "Create APQP Project", description: "Created APQP Project APQP-2024-00056.", stage: "Phase 1 - Plan & Define Program" },
  ],
  upcomingMilestones: [
    { id: "ms-01", title: "Pilot Build Completion", targetDate: "25 Jun 2024", status: "In Progress" },
    { id: "ms-02", title: "PPAP Submission", targetDate: "05 Jul 2024", status: "Pending" },
  ],
  recentActivities: [
    { id: "act-01", timestamp: "2h ago", user: "Vikram Singh", action: "PFMEA Linked", description: "PFMEA linked to APQP Project", timeAgo: "2h ago" },
  ],
} as any;

export const getApqpRecordFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: INITIAL_APQP_RECORD };
});

export const saveApqpDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { input: any })
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      projectName: data.input.apqpProjectName ?? data.input.projectName ?? "",
      ownerName: data.input.projectManager ?? data.input.ownerName ?? "",
      recordCode: data.input.apqpId ?? data.input.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitApqpFn = createServerFn({ method: "POST" }).handler(async () => {
  const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (current?.id) {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
    return { success: true, data: result };
  }
  return { success: true, data: INITIAL_APQP_RECORD };
});
