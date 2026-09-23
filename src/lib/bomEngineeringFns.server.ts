import { createServerFn } from "@tanstack/react-start";
import type {
  BomEngineeringRecord,
  BomFormInput,
  BomItemNode,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "bom-engineering";

export const INITIAL_BOM_RECORD: BomEngineeringRecord = {
  id: "bom-rec-00125",
  bomId: "BOM-2024-00125",
  formCode: "BOMD-2024-25",
  bomName: "Autonomous W-EVSE - Engineering BOM",
  bomNumber: "EBOM-AW-EVSE-001",
  product: "Autonomous W-EVSE",
  productRevision: "REV-2.1",
  bomType: "Engineering BOM (EBOM)",
  processOwner: "Rahul Sharma",
  workflowStatus: "In Review",
  productFamily: "Wireless EV Charging",
  productModel: "AW-EVSE-1000",
  productVariant: "High Power 22kW Heavy Duty",
  assemblyLevel: 0,
  parentAssembly: "TOP_SYSTEM_ROOT",
  bomDescription: "Comprehensive Engineering Bill of Materials for Autonomous Wireless EVSE Station with robotic docking, high-frequency resonance coil, dynamic thermal management, and ultra-secure CAN/IoT communication bus.",
  lifecycleStage: "Engineering Validation",
  priority: "High",
  completenessScore: 92,
  materialAvailabilityScore: 88,
  manufacturingReadinessScore: 90,
  qualityReadinessScore: 86,
  costScore: 87,
  overallReadinessScore: 89,
  totalItemsCount: 86,
  items: [
    { id: "item-00", partNumber: "AW-EVSE-ASSY", description: "Autonomous W-EVSE Assembly", level: 0, quantity: 1, uom: "Nos", itemCategory: "Assembly", makeBuy: "Make", unitCost: 245680, totalCost: 245680, leadTimeDays: 14, status: "Approved", referenceDesignator: "SYS-001", alternatePart: "N/A", completenessScore: 100, criticalComponent: true, rohsReachCompliant: true },
    { id: "item-01", partNumber: "AW-EVSE-HSG", description: "EVSE Housing Assembly", level: 1, quantity: 1, uom: "Nos", itemCategory: "Sub-Assembly", makeBuy: "Make", unitCost: 32450, totalCost: 32450, leadTimeDays: 5, status: "Approved", referenceDesignator: "HSG-01", alternatePart: "AW-EVSE-HSG-ALT1", completenessScore: 95, materialGrade: "Aluminium", materialSpecification: "AL 6061-T6 Anodized IP67 Coating", manufacturer: "Magnertia Precision Works", approvedVendor: "Vendor-PrecisionMould-01", rohsReachCompliant: true, criticalComponent: false },
    { id: "item-02", partNumber: "AW-DOCK-UNIT", description: "Docking Unit Assembly", level: 1, quantity: 1, uom: "Nos", itemCategory: "Sub-Assembly", makeBuy: "Make", unitCost: 28750, totalCost: 28750, leadTimeDays: 5, status: "Approved", referenceDesignator: "DCK-01", alternatePart: "AW-DOCK-UNIT-V2", completenessScore: 90, materialGrade: "Stainless Steel", materialSpecification: "SS 316L Laser Cut & CNC Machined", manufacturer: "Magnertia Robotics Sub-Div", approvedVendor: "Vendor-SS-Fab-09", rohsReachCompliant: true, criticalComponent: true },
    { id: "item-03", partNumber: "AW-ROBOT-ARM", description: "Robotic Arm Assembly", level: 1, quantity: 1, uom: "Nos", itemCategory: "Sub-Assembly", makeBuy: "Make", unitCost: 45600, totalCost: 45600, leadTimeDays: 7, status: "Approved", referenceDesignator: "ARM-01", alternatePart: "AW-ARM-HD-22", completenessScore: 94, materialGrade: "Composite", materialSpecification: "Carbon Fiber Reinforced Polymer + Servo", manufacturer: "RoboTech Servo Systems", approvedVendor: "Vendor-RoboTech-04", rohsReachCompliant: true, criticalComponent: true },
    { id: "item-04", partNumber: "AW-POWER-ELEC", description: "Power Electronics Assembly", level: 1, quantity: 1, uom: "Nos", itemCategory: "Sub-Assembly", makeBuy: "Make", unitCost: 68900, totalCost: 68900, leadTimeDays: 7, status: "Approved", referenceDesignator: "PWR-01", alternatePart: "AW-POWER-ELEC-SiC", completenessScore: 98, materialGrade: "PCB", materialSpecification: "12-Layer High-Power SiC MOSFET Inverter PCB", manufacturer: "Magnertia Electronics Lab", approvedVendor: "Vendor-SiC-Power-02", rohsReachCompliant: true, criticalComponent: true },
    { id: "item-05", partNumber: "AW-COIL-TX", description: "Transmitter Coil Assembly", level: 1, quantity: 1, uom: "Nos", itemCategory: "Sub-Assembly", makeBuy: "Buy", unitCost: 35800, totalCost: 35800, leadTimeDays: 10, status: "Approved", referenceDesignator: "COIL-TX", alternatePart: "AW-COIL-TX-85KHZ", completenessScore: 89, materialGrade: "Copper", materialSpecification: "Litz Wire High-Q Resonant Indictor Coil", manufacturer: "Inductive Power Corp", approvedVendor: "Vendor-InductiveCorp-07", rohsReachCompliant: true, criticalComponent: true },
  ],
  materialGrade: "Aluminium",
  materialSpecification: "AL 6061-T6 Anodized IP67 Coating",
  manufacturer: "Magnertia Precision Works",
  approvedVendor: "Vendor-PrecisionMould-01",
  leadTimeDays: 14,
  rohsReachCompliant: true,
  manufacturingProcess: "Final Assembly",
  makeBuyDecision: "Hybrid",
  assemblySequenceFile: "AW-EVSE-ASSY-SEQUENCE-v2.pdf",
  toolingRequirements: ["Fixture-EVSE-Alignment-01", "Robotic Calibration Jig", "Torque Wrench Set 5-25Nm", "High Voltage Insulation Tester"],
  workInstructionRef: "WI-MFG-2024-EVSE-88",
  manufacturingNotes: "Assembly must occur under ISO Class 8 clean bay for optical sensors and SiC power inverter module insulation check.",
  criticalComponents: ["AW-POWER-ELEC", "AW-COIL-TX", "AW-ROBOT-ARM", "AW-DOCK-UNIT", "AW-CONTROLLER"],
  inspectionRequirement: "100% Automated Optical Inspection (AOI) on Power Electronics PCB. Hi-Pot insulation voltage test up to 2.5kV AC for 60 seconds.",
  regulatoryStandards: ["ISO 9001:2015", "ISO 14001:2015", "IEC 61851-1", "IEC 61980-1", "RoHS / REACH Compliant"],
  traceabilityRequired: true,
  complianceChecklist: [
    { standard: "RoHS Compliance", status: "Compliant", details: "All 86 component datasheets verified lead-free & hazardous substance compliant." },
    { standard: "REACH Compliance", status: "Compliant", details: "Zero SVHC substances above 0.1% w/w threshold." },
    { standard: "ISO 9001:2015", status: "Compliant", details: "Quality management design control compliance verified." },
    { standard: "ISO 14001:2015", status: "Compliant", details: "Environmental management disposal cycle validated." },
    { standard: "IEC Standards", status: "Compliant", details: "IEC 61851-1 EV conductive charging & IEC 61980-1 wireless transfer compliant." },
  ],
  materialCost: 142850,
  manufacturingCost: 68430,
  purchasedComponentCost: 34400,
  totalBomCost: 245680,
  targetCost: 260000,
  costVariance: -14320,
  aiInsights: {
    duplicateDetection: "No duplicate components found. All 86 part numbers are distinct.",
    costOptimization: "Potential savings of ₹12,450.00 identified by consolidating Power Wire Harness sub-contractors.",
    alternateRecommendation: "3 alternate components recommended for AW-COIL-TX and AW-SENSORS.",
    supplyRiskPrediction: "Low risk. All critical parts are available across dual-sourced approved vendor lists.",
    designImprovement: "2 design improvement suggestions: Optimize heatsink fin pitch for AW-POWER-ELEC.",
    healthScore: 91,
  },
  recommendation: "Approve BOM",
  approvalDecision: "Approved with Conditions",
  reviewers: [
    { role: "Design Engineer", person: "Rahul Sharma", decision: "Approved", date: "18 Jun 2024", comments: "BOM structure matches CAD Release 2.1 perfectly.", status: "Approved" },
    { role: "Manufacturing Engineer", person: "Rajesh Kumar", decision: "Approved", date: "19 Jun 2024", comments: "Assembly sequence and tooling requirements validated.", status: "Approved" },
    { role: "Procurement Manager", person: "Priya Nair", decision: "Approved", date: "20 Jun 2024", comments: "All vendor lead times and cost quotes confirmed.", status: "Approved" },
    { role: "Quality Manager", person: "Amit Verma", decision: "Approved", date: "21 Jun 2024", comments: "RoHS/REACH documentation & Hi-Pot test protocol approved.", status: "Approved" },
    { role: "Cost Engineer", person: "Vikram Mehta", decision: "Approved", date: "22 Jun 2024", comments: "Actual BOM cost ₹2,45,680 is 5.5% below target cost of ₹2,60,000.", status: "Approved" },
    { role: "Supply Chain Manager", person: "Sunita Deshmukh", decision: "Approved", date: "23 Jun 2024", comments: "Lead time buffer set to 14 days for mass production release.", status: "Approved" },
    { role: "Engineering Head", person: "Dr. K. R. Raman", decision: "Approved with Conditions", date: "24 Jun 2024", comments: "Approved subject to thermal validation under 55°C ambient.", status: "Approved" },
    { role: "COO", person: "Arvind Swaminathan", decision: "Approved", date: "25 Jun 2024", comments: "Final executive approval granted for production release.", status: "Approved" },
  ],
  attachments: [
    { id: "att-1", fileName: "EBOM-AW-EVSE-001_v2.1.xlsx", fileType: "Spreadsheet", documentType: "Engineering BOM", version: "2.1", uploadedBy: "Rahul Sharma", uploadedDate: "18 Jun 2024", fileSize: "2.4 MB", status: "Active" },
    { id: "att-2", fileName: "CAD_AW_EVSE_Assembly_3D.step", fileType: "CAD Model", documentType: "CAD Assembly Drawing", version: "2.1", uploadedBy: "Rahul Sharma", uploadedDate: "18 Jun 2024", fileSize: "48.5 MB", status: "Active" },
  ],
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 09:30 AM",
  effectiveDate: "01 Jul 2024",
  nextReviewDate: "30 Jun 2025",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "01 Aug 2026 10:15 AM",
  workflowStage: "Executive Approval",
  version: 2.1,
  distribution: ["Engineering", "Procurement", "Manufacturing", "Quality"],
  auditTrail: [
    { id: "aud-01", timestamp: "18 Jun 2024 09:30 AM", user: "Rahul Sharma", action: "Create BOM Project", description: "Created Engineering BOM project BOM-2024-00125 from PLM CAD structure.", stage: "Stage 1 - BOM Development" },
    { id: "aud-02", timestamp: "25 Jun 2024 05:30 PM", user: "Arvind Swaminathan", action: "Executive Board Approval", description: "All 8 board members completed review. Status set to Approved with Conditions.", stage: "Stage 4 - Executive Review" },
  ],
} as any;

export const getBomRecordFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: INITIAL_BOM_RECORD };
});

export const saveBomDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { input: BomFormInput })
  .handler(async ({ data }) => {
    const record = {
      ...(data.input as any),
      projectName: (data.input as any).bomName ?? "",
      ownerName: (data.input as any).processOwner ?? "",
      recordCode: (data.input as any).id ?? (data.input as any).bomId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitBomFn = createServerFn({ method: "POST" }).handler(async () => {
  const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (current?.id) {
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id: current.id } });
    return { success: true, data: result };
  }
  return { success: true, data: INITIAL_BOM_RECORD };
});

export const addBomItemFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Omit<BomItemNode, "id">)
  .handler(async ({ data }) => {
    const current = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (!current) return { success: true, data: INITIAL_BOM_RECORD };
    const newItem: BomItemNode = { ...data, id: `item-${Date.now()}` } as any;
    const updatedItems = [...(current.items ?? []), newItem];
    const newTotalCost = updatedItems.reduce((acc: number, curr: any) => acc + (curr.totalCost ?? 0), 0);
    const record = {
      ...current,
      items: updatedItems,
      totalItemsCount: updatedItems.length,
      totalBomCost: newTotalCost,
      costVariance: newTotalCost - (current.targetCost ?? 0),
      projectName: current.bomName ?? "",
      ownerName: current.processOwner ?? "",
      recordCode: current.id ?? current.bomId ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });
