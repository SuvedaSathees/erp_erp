/* ===========================================================================
   In-Process Inspection (IPQC) — Types & Data Models
   Management → Quality Management → Process Quality → In-Process Inspection
   =========================================================================== */

export type IpqcInspectionStatus = "Draft" | "In Progress" | "Completed" | "On Hold" | "Rework Required";
export type IpqcPriority = "Normal" | "High" | "Critical";
export type IpqcResult = "Pass" | "Fail" | "Conditional";
export type IpqcInspectionType = "Visual & Functional" | "Visual" | "Dimensional" | "Functional" | "Electrical" | "Performance";
export type IpqcInspectionFrequency = "First Piece" | "Every Piece" | "Every Hour" | "Every Shift" | "Sampling";
export type IpqcInspectionMethod = "Manual" | "Gauge" | "Gauge + Functional Test" | "Test Equipment" | "Vision" | "Automated";
export type IpqcControlMethod = "SPC" | "Checklist" | "Gauge" | "Automated";

export interface IpqcCharacteristic {
  id: string;
  seq: number;
  characteristic: string;
  specification: string;
  tolerance: string;
  actual: string;
  unit: string;
  method: string;
  result: "Pass" | "Fail" | "Conditional";
  remarks: string;
}

export interface IpqcProcessParameter {
  id: string;
  parameter: string;
  specification: string;
  lowerLimit: number;
  target: number;
  upperLimit: number;
  actual: number;
  unit: string;
  result: "Pass" | "Fail";
}

export interface IpqcDefect {
  id: string;
  defectCode: string;
  description: string;
  operation: string;
  characteristic: string;
  quantity: number;
  severity: "Critical" | "Major" | "Minor";
  category: "Dimensional" | "Visual" | "Functional" | "Process";
  suspectedCause: string;
  detectionMethod: string;
  ncrRequired: boolean;
  reworkRequired: boolean;
  actionTaken: string;
}

export interface IpqcRecentInspection {
  id: string;
  date: string;
  operation: string;
  qty: number;
  result: "Pass" | "Fail" | "Conditional";
  inspector: string;
}

export interface IpqcFirstPieceVerification {
  setupVerified: boolean;
  toolVerified: boolean;
  fixtureVerified: boolean;
  materialVerified: boolean;
  programRecipeVerified: boolean;
  criticalDimensionsVerified: boolean;
  functionalTestVerified: boolean;
  inspectorApproved: boolean;
  firstPieceResult: "Pass" | "Fail" | "Pending";
  productionReleased: boolean;
  signoffDate?: string;
  signoffInspector?: string;
  notes?: string;
}

export interface IpqcSpcData {
  controlCharacteristic: string;
  ucl: number;
  cl: number;
  lcl: number;
  target: number;
  sampleSize: number;
  frequency: string;
  cp: number;
  cpk: number;
  pp: number;
  ppk: number;
  status: "Process Capable" | "Process Marginal" | "Out of Control";
  datapoints: { sample: number; value: number; time: string }[];
}

export interface IpqcWipHold {
  holdId: string;
  material: string;
  workOrder: string;
  operation: string;
  holdQty: number;
  holdReason: string;
  holdLocation: string;
  binLocation: string;
  ncrNumber: string;
  status: "Active Hold" | "Released" | "Scrapped" | "Reworked";
}

export interface IpqcRecord {
  // Form Information
  id: string;
  inspectionNo: string;
  inspectionDate: string;
  productionOrder: string;
  workOrder: string;
  jobCard: string;
  product: string;
  productCode: string;
  productRevision: string;
  batchLotNo: string;
  operationNo: string;
  operationName: string;
  routing: string;
  workCenter: string;
  machineEquipment: string;
  shift: string;
  inspector: string;
  inspectionStatus: IpqcInspectionStatus;
  priority: IpqcPriority;

  // Process Information
  process: string;
  processStep: string;
  operationSequence: number;
  workInstruction: string;
  sopReference: string;
  controlPlan: string;
  pfmeaReference: string;
  drawingReference: string;
  specification: string;
  specialCharacteristic: boolean;
  criticalParameter: boolean;

  // Inspection Planning
  inspectionPlan: string;
  inspectionType: IpqcInspectionType;
  inspectionFrequency: IpqcInspectionFrequency;
  sampleSize: number;
  inspectionMethod: IpqcInspectionMethod;
  measuringEquipment: string;
  calibrationStatus: string;
  msaReference: string;
  spcRequired: boolean;
  controlMethod: IpqcControlMethod;
  reactionPlan: string;

  // Current Operation details
  stdCycleTime: string;
  operator: string;

  // Summary Metrics
  inspectionsToday: number;
  passedCount: number;
  failedCount: number;
  onHoldCount: number;
  reworkCount: number;
  firstPassYield: number;

  // Inspection Results
  inspectionQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  defectRate: number;
  processCapabilityCpk: number;
  overallResult: IpqcResult;

  // Detailed lists
  characteristics: IpqcCharacteristic[];
  parameters: IpqcProcessParameter[];
  defects: IpqcDefect[];
  recentInspections: IpqcRecentInspection[];
  firstPiece: IpqcFirstPieceVerification;
  spc: IpqcSpcData;
  wipHold: IpqcWipHold;
  aiInsights: string[];
}
