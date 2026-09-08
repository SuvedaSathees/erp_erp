import type { IpqcRecord } from "./ipqcTypes";

export const INITIAL_IPQC_RECORD: IpqcRecord = {
  // Form Information
  id: "ipqc-rec-00358",
  inspectionNo: "IPQC-2026-00358",
  inspectionDate: "06-Sep-2026 14:20",
  productionOrder: "MO-2026-00087",
  workOrder: "WO-2026-00421",
  jobCard: "JC-2026-00421",
  product: "EV Charger 7kW",
  productCode: "EVSE-7KW-001",
  productRevision: "REV-02",
  batchLotNo: "B-2026-09-014",
  operationNo: "OP-30",
  operationName: "Assembly & Cable Fixing",
  routing: "RTG-EVSE-7KW",
  workCenter: "WC-ASM-01",
  machineEquipment: "ASM-001",
  shift: "Shift B",
  inspector: "Priya S",
  inspectionStatus: "In Progress",
  priority: "High",

  // Process Information
  process: "Assembly",
  processStep: "Cable Termination",
  operationSequence: 30,
  workInstruction: "WI-ASM-030",
  sopReference: "SOP-ASM-02",
  controlPlan: "CP-EVSE-001",
  pfmeaReference: "PFMEA-ASM-01",
  drawingReference: "DRW-EVSE-003",
  specification: "SPC-ASM-001",
  specialCharacteristic: true,
  criticalParameter: false,

  // Inspection Planning
  inspectionPlan: "IP-ASM-001",
  inspectionType: "Visual & Functional",
  inspectionFrequency: "Every Hour",
  sampleSize: 5,
  inspectionMethod: "Gauge + Functional Test",
  measuringEquipment: "VTT-02",
  calibrationStatus: "Valid (Due 12-Oct-2026)",
  msaReference: "MSA-002",
  spcRequired: true,
  controlMethod: "SPC",
  reactionPlan: "Stop line, segregate, raise NCR and inform Production.",

  // Current Operation Details
  stdCycleTime: "45 sec",
  operator: "Rajesh K",

  // Summary Metrics
  inspectionsToday: 36,
  passedCount: 29,
  failedCount: 4,
  onHoldCount: 2,
  reworkCount: 1,
  firstPassYield: 95.0,

  // Inspection Results
  inspectionQuantity: 5,
  acceptedQuantity: 5,
  rejectedQuantity: 0,
  defectRate: 0.0,
  processCapabilityCpk: 1.62,
  overallResult: "Pass",

  // In-Process Inspection Results (4 characteristics from the screenshot)
  characteristics: [
    {
      id: "char-01",
      seq: 1,
      characteristic: "Connector Fit",
      specification: "Pass",
      tolerance: "—",
      actual: "Pass",
      unit: "—",
      method: "Visual",
      result: "Pass",
      remarks: "OK",
    },
    {
      id: "char-02",
      seq: 2,
      characteristic: "Torque",
      specification: "8.00",
      tolerance: "±1.00",
      actual: "8.2",
      unit: "Nm",
      method: "Torque Tool",
      result: "Pass",
      remarks: "Within limit",
    },
    {
      id: "char-03",
      seq: 3,
      characteristic: "Insulation Resistance",
      specification: "≥ 10",
      tolerance: "—",
      actual: "15.6",
      unit: "MΩ",
      method: "MIT-003",
      result: "Pass",
      remarks: "OK",
    },
    {
      id: "char-04",
      seq: 4,
      characteristic: "Functional Test",
      specification: "Pass",
      tolerance: "—",
      actual: "Pass",
      unit: "—",
      method: "Functional",
      result: "Pass",
      remarks: "All OK",
    },
  ],

  // Process Parameters (Section 4)
  parameters: [
    {
      id: "param-01",
      parameter: "Torque",
      specification: "8 ± 1 Nm",
      lowerLimit: 7.0,
      target: 8.0,
      upperLimit: 9.0,
      actual: 8.2,
      unit: "Nm",
      result: "Pass",
    },
    {
      id: "param-02",
      parameter: "Temperature",
      specification: "80 ± 5°C",
      lowerLimit: 75.0,
      target: 80.0,
      upperLimit: 85.0,
      actual: 82.0,
      unit: "°C",
      result: "Pass",
    },
    {
      id: "param-03",
      parameter: "Pressure",
      specification: "6 ± 0.5 bar",
      lowerLimit: 5.5,
      target: 6.0,
      upperLimit: 6.5,
      actual: 6.7,
      unit: "bar",
      result: "Fail",
    },
    {
      id: "param-04",
      parameter: "Cycle Time",
      specification: "≤ 45 sec",
      lowerLimit: 30.0,
      target: 40.0,
      upperLimit: 45.0,
      actual: 41.0,
      unit: "sec",
      result: "Pass",
    },
  ],

  // Defects (Section 9)
  defects: [
    {
      id: "def-01",
      defectCode: "D-001",
      description: "Pressure above control limit on pneumatic clamp",
      operation: "OP-40",
      characteristic: "Pneumatic Clamp Pressure",
      quantity: 4,
      severity: "Major",
      category: "Process",
      suspectedCause: "Regulator valve diaphragm drift during high duty cycle",
      detectionMethod: "Gauge",
      ncrRequired: true,
      reworkRequired: false,
      actionTaken: "Regulator recalibrated; 4 units segregated for inspection",
    },
    {
      id: "def-02",
      defectCode: "D-002",
      description: "Surface scratch on enclosure top rim",
      operation: "OP-30",
      characteristic: "Surface Finish",
      quantity: 1,
      severity: "Minor",
      category: "Visual",
      suspectedCause: "Assembly jig rubber pad worn out",
      detectionMethod: "Visual",
      ncrRequired: false,
      reworkRequired: true,
      actionTaken: "Polished and re-inspected; jig pad replaced",
    },
  ],

  // Recent Inspections (matches screenshot table)
  recentInspections: [
    { id: "ri-01", date: "06-Sep-2026 14:20", operation: "OP-30", qty: 5, result: "Pass", inspector: "Priya S" },
    { id: "ri-02", date: "06-Sep-2026 12:00", operation: "OP-20", qty: 5, result: "Pass", inspector: "Arun K" },
    { id: "ri-03", date: "06-Sep-2026 10:00", operation: "OP-10", qty: 5, result: "Fail", inspector: "Meena R" },
    { id: "ri-04", date: "05-Sep-2026 16:00", operation: "OP-30", qty: 5, result: "Pass", inspector: "Priya S" },
    { id: "ri-05", date: "05-Sep-2026 14:00", operation: "OP-20", qty: 5, result: "Pass", inspector: "Arun K" },
  ],

  // First Piece Verification (Section 6)
  firstPiece: {
    setupVerified: true,
    toolVerified: true,
    fixtureVerified: true,
    materialVerified: true,
    programRecipeVerified: true,
    criticalDimensionsVerified: true,
    functionalTestVerified: true,
    inspectorApproved: true,
    firstPieceResult: "Pass",
    productionReleased: true,
    signoffDate: "06-Sep-2026 08:30",
    signoffInspector: "Priya S",
    notes: "First piece approved. Tool offsets within nominal ±0.01 mm.",
  },

  // SPC Monitoring (Section 8)
  spc: {
    controlCharacteristic: "Torque (Nm)",
    ucl: 9.0,
    cl: 8.0,
    lcl: 7.0,
    target: 8.0,
    sampleSize: 5,
    frequency: "Every Hour",
    cp: 1.67,
    cpk: 1.45,
    pp: 1.61,
    ppk: 1.42,
    status: "Process Capable",
    datapoints: [
      { sample: 1, value: 8.1, time: "09:00" },
      { sample: 2, value: 7.9, time: "10:00" },
      { sample: 3, value: 8.3, time: "11:00" },
      { sample: 4, value: 8.0, time: "12:00" },
      { sample: 5, value: 8.4, time: "13:00" },
      { sample: 6, value: 8.2, time: "14:00" },
      { sample: 7, value: 8.2, time: "14:20" },
    ],
  },

  // WIP Hold / Quarantine (Section 11)
  wipHold: {
    holdId: "WIP-HLD-2026-018",
    material: "EV Charger 7kW Sub-assembly",
    workOrder: "WO-2026-00421",
    operation: "OP-40",
    holdQty: 4,
    holdReason: "Pneumatic pressure spike during clamping operation",
    holdLocation: "Line 2 WIP Hold Area",
    binLocation: "BIN-WIP-H02",
    ncrNumber: "NCR-2026-0041",
    status: "Active Hold",
  },

  // AI Quality Insights (matching screenshot bullets)
  aiInsights: [
    "Process parameters are stable for last 10 cycles.",
    "Cpk (1.62) is within acceptable range.",
    "No major defects detected in current batch.",
    "Recommend continuation with current sampling.",
    "Monitor connector torque variation in Shift C.",
  ],
};

let currentRecordState: IpqcRecord = { ...INITIAL_IPQC_RECORD };

export async function fetchIpqcRecord(): Promise<IpqcRecord> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...currentRecordState });
    }, 120);
  });
}

export async function saveIpqcDraft(updates: Partial<IpqcRecord>): Promise<IpqcRecord> {
  return new Promise((resolve) => {
    currentRecordState = {
      ...currentRecordState,
      ...updates,
      inspectionStatus: "In Progress",
    };
    resolve({ ...currentRecordState });
  });
}

export async function completeIpqcInspection(): Promise<IpqcRecord> {
  return new Promise((resolve) => {
    currentRecordState = {
      ...currentRecordState,
      inspectionStatus: "Completed",
      overallResult: "Pass",
    };
    resolve({ ...currentRecordState });
  });
}
