import { createServerFn } from "@tanstack/react-start";
import type { ControlPlanRecord, ControlPlanCharacteristic } from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "control-plan";

export const INITIAL_CONTROL_PLAN_RECORD: ControlPlanRecord = {
  id: "cp-rec-00056",
  controlPlanId: "CP-2024-00056",
  formCode: "CPDL-2024-25",
  controlPlanTitle: "Enclosure Assembly Control Plan",
  controlPlanNumber: "CP-ENCL-AW-001",
  version: 2.1,
  workflowStatus: "In Progress",
  product: "Autonomous W-EVSE",
  productRevision: "REV-2.1",
  manufacturingProcess: "Enclosure Assembly",
  apqpRef: "APQP-AW-EVSE-001",
  pfmeaRef: "PFMEA-AW-EVSE-001",
  processOwner: "Rahul Sharma",
  productFamily: "EV Charging Solutions",
  productModel: "EVSE-22KW-WALL",
  productionLine: "Line-02",
  workCentre: "WC-ENCL-01",
  processFlowRef: "PFD-ENCL-AW-001",
  routingRef: "RTG-ENCL-AW-001",
  controlPlanType: "Production",
  lifecycleStage: "Validation",
  priority: "High",
  characteristicReadinessScore: 86,
  inspectionReadinessScore: 82,
  processControlScore: 88,
  validationScore: 80,
  aiHealthScore: 88,
  overallControlPlanReadinessScore: 84,
  characteristics: [
    { id: "char-01", stepNo: 1, operationNo: "OP-10", processStep: "Incoming Material Inspection", productCharacteristic: "Material Thickness", processCharacteristic: "Material Conformance", specialCharacteristics: "SC-01", specification: "1.5 mm ± 0.1", controlMethod: "Dimensional Inspection", readinessScore: 90 },
    { id: "char-02", stepNo: 2, operationNo: "OP-20", processStep: "Enclosure Body Cutting", productCharacteristic: "Cut Length", processCharacteristic: "Cutting Accuracy", specialCharacteristics: "SC-02", specification: "500 ± 0.5 mm", controlMethod: "Automated Inspection", readinessScore: 85 },
  ],
  summaryRows: [
    { id: "sum-01", stepNo: 1, operationNo: "OP-10", characteristic: "Material Thickness", specification: "1.5 mm ± 0.1", controlMethod: "Dimensional Inspection", inspectionMethod: "Visual + Measuring", frequency: "Every Shift", sampleSize: "5", controlDevice: "Digital Caliper", responsePlan: "Segregate and notify QA", responsible: "Ravi Kumar" },
  ],
  inspectionMethod: "Dimensional Inspection",
  measuringEquipment: "Digital Caliper - 300 mm",
  sampleSize: 5,
  inspectionFrequency: "Every Shift",
  msaRef: "MSA-ENCL-001",
  spcRequired: true,
  reactionPlan: "Stop line, segregate parts, notify QA.",
  workInstructionRef: "WI-ENCL-20",
  sopRef: "SOP-ENCL-05",
  controlDevice: "Torque Screwdriver",
  errorProofingPokaYoke: true,
  preventiveMaintenanceRequired: true,
  processValidationStatus: true,
  incomingInspection: true,
  inProcessInspection: true,
  finalInspection: true,
  controlPlanAudit: "Planned",
  processCapabilityCpk: "1.67 / 1.45",
  ppapRef: "PPAP-AW-EVSE-001",
  aiAssessment: {
    healthScore: 88,
    riskPrediction: "Low risk with 3 areas to watch.",
    processOptimization: "Reduce cycle time by 6.2%.",
    inspectionOptimization: "Optimize frequency for 2 operations.",
    defectPrediction: "Defect rate likely to reduce by 18%.",
    preventiveRecommendation: "Implement poka-yoke at OP-40 & OP-60.",
  },
  recommendation: "Approve Control Plan",
  approvalDecision: "Approved with Conditions",
  reviewers: [
    { role: "Quality Engineer", person: "Rahul Sharma", decision: "Approved", date: "18 Jun 2024", comments: "Control plan verified.", status: "Approved" },
    { role: "Plant Head", person: "Sankaran R.", decision: "Approved with Conditions", date: "24 Jun 2024", comments: "Pending poka-yoke installation.", status: "Pending" },
  ],
  attachments: [
    { id: "att-cp-01", fileName: "Control Plan Worksheet.xlsx", fileType: "Excel Worksheet", documentType: "Control Plan Worksheet", version: "2.1", uploadedBy: "Rahul Sharma", uploadedDate: "01 Jul 2024", fileSize: "1.4 MB", status: "Active" },
  ],
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 09:15 AM",
  effectiveDate: "18 Jun 2024",
  nextReviewDate: "18 Dec 2024",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "01 Jul 2024 04:25 PM",
  workflowStage: "Review",
  distribution: ["Quality", "Manufacturing", "Process Engineering", "APQP"],
  auditTrail: [
    { id: "log-cp-01", timestamp: "18 Jun 2024 09:15 AM", user: "Rahul Sharma", action: "Create Control Plan Project", description: "Created Control Plan CP-2024-00056.", stage: "Stage 1 - Process & Product Characteristics" },
  ],
} as any;

export const getControlPlanRecordFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: INITIAL_CONTROL_PLAN_RECORD };
});

export const saveControlPlanDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { input: any })
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      projectName: data.input.controlPlanTitle ?? data.input.projectName ?? "",
      ownerName: data.input.processOwner ?? data.input.ownerName ?? "",
      recordCode: data.input.controlPlanId ?? data.input.id ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitControlPlanFn = createServerFn({ method: "POST" }).handler(async () => {
  const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (current?.id) {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
    return { success: true, data: result };
  }
  return { success: true, data: INITIAL_CONTROL_PLAN_RECORD };
});

export const addCharacteristicFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Omit<ControlPlanCharacteristic, "id">)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    const currentData = current || INITIAL_CONTROL_PLAN_RECORD;
    const newChar: ControlPlanCharacteristic = {
      ...data,
      id: `char-${Date.now()}`,
    } as any;
    const updatedRecord = {
      ...currentData,
      characteristics: [...(currentData.characteristics || []), newChar],
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: updatedRecord } });
    return { success: true, data: result };
  });
