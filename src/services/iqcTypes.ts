export type IqcStatus = "In Progress" | "Completed" | "Pending" | "On Hold";
export type IqcDisposition = "Quarantine" | "Accept" | "Reject" | "Rework" | "Return to Supplier";
export type IqcInventoryStatus = "Blocked" | "Quarantine" | "Released";
export type IqcResult = "Pass" | "Fail" | "Conditional Pass";

export interface IqcCharacteristic {
  seq: number;
  characteristic: string;
  specification: string;
  tolerance: string;
  actual: string;
  unit: string;
  method: string;
  result: "Pass" | "Fail";
  remarks: string;
}

export interface IqcDocument {
  id: string;
  name: string;
  size: string;
  dateAdded: string;
  type: string;
}

export interface IqcAiInsight {
  id: string;
  text: string;
  type: "alert" | "info" | "success" | "recommendation";
}

export interface IqcRecord {
  id: string;
  inspectionNo: string;
  inspectionDate: string;
  grnNumber: string;
  purchaseOrder: string;
  supplier: string;
  supplierCode: string;
  materialItem: string;
  itemCode: string;
  itemRevision: string;
  batchLotNo: string;
  serialNumbers: string;
  receivedQty: number;
  inspectionQty: number;
  acceptedQty: number;
  rejectedQty: number;
  defectRate: number;
  qualityScore: number;
  samplingPlan: string;
  aql: string;
  inspectionLevel: string;
  inspectionType: string;
  inspectionPlan: string;
  specification: string;
  drawingRevision: string;
  testEquipment: string;
  inspector: string;
  ncrNumber: string;
  supplierNcr: boolean;
  disposition: IqcDisposition;
  inventoryStatus: IqcInventoryStatus;
  remarks: string;
  status: IqcStatus;
  overallResult: IqcResult;

  // Items & Documents
  characteristics: IqcCharacteristic[];
  documents: IqcDocument[];
  insights: IqcAiInsight[];

  // 6 KPI Snapshot
  stats: {
    totalInspections: number;
    pendingCount: number;
    passedCount: number;
    rejectedCount: number;
    quarantineCount: number;
    passRate: number;
  };
}
