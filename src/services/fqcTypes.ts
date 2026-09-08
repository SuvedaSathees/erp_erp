export type FqcStatus = "Draft" | "In Progress" | "Completed" | "On Hold";
export type FqcResult = "Pass" | "Fail" | "Conditional Pass";

export interface FqcCharacteristic {
  id: string;
  seq: number;
  characteristic: string;
  category: "Visual" | "Dimensional" | "Functional" | "Electrical" | "Safety";
  specification: string;
  nominal: number | string;
  minTol: number | string;
  maxTol: number | string;
  unit: string;
  inspectionMethod: string;
  sampleSize: number;
  actualMeasured: string;
  status: "Pass" | "Fail";
  remark?: string;
}

export interface FqcDefect {
  id: string;
  defectCode: string;
  category: string;
  description: string;
  quantity: number;
  severity: "Critical" | "Major" | "Minor";
  disposition: "Rework" | "Scrap" | "Return" | "Hold";
  ncrReference?: string;
}

export interface FqcTestParamSample {
  sampleNo: number;
  torqueReading: number;
  insulationResistance: number;
  leakageCurrent: number;
}

export interface FqcCertificate {
  certificateNo: string;
  issueDate: string;
  batchNo: string;
  productCode: string;
  productName: string;
  quantityCertified: number;
  authorizedSignatory: string;
  digitalSealVerified: boolean;
  status: "Approved" | "Pending" | "Rejected";
}

export interface FqcRecord {
  id: string;
  inspectionNo: string;
  inspectionDate: string;
  productionOrder: string;
  workOrder: string;
  product: string;
  productCode: string;
  productRevision: string;
  batchLotNo: string;
  serialRange: string;
  totalProducedQuantity: number;
  inspectionQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  samplingPlan: string;
  inspectionStage: string;
  inspector: string;
  qualityEngineer: string;
  inspectionStatus: FqcStatus;
  overallResult: FqcResult;
  customerOrder: string;
  customer: string;

  // Characteristics & Test samples
  characteristics: FqcCharacteristic[];
  testSamples: FqcTestParamSample[];
  defects: FqcDefect[];
  certificate: FqcCertificate;

  // KPI snapshot
  dailyStats: {
    inspectionsToday: number;
    passed: number;
    failed: number;
    onHold: number;
    certificatesIssued: number;
    firstPassYield: number;
  };

  aiInsights: {
    id: string;
    text: string;
    type: "alert" | "info" | "success";
  }[];
}
