import type { IqcRecord, IqcCharacteristic } from "./iqcTypes";

export const INITIAL_IQC_RECORD: IqcRecord = {
  id: "iqc-2026-00184",
  inspectionNo: "IQC-2026-00184",
  inspectionDate: "06-Sep-2026 09:30",
  grnNumber: "GR-2026-000421",
  purchaseOrder: "PO-2026-0142",
  supplier: "TechDrive Components Pvt. Ltd.",
  supplierCode: "SUP-00056",
  materialItem: "BLDC Motor 2kW",
  itemCode: "MAT-MOTOR-001",
  itemRevision: "REV-03",
  batchLotNo: "LOT-2026-09-014",
  serialNumbers: "SN001, SN002, SN003",
  receivedQty: 500,
  inspectionQty: 80,
  acceptedQty: 76,
  rejectedQty: 4,
  defectRate: 5.0,
  qualityScore: 85,
  samplingPlan: "ANSI/ASQ Z1.4",
  aql: "1.5",
  inspectionLevel: "Level II",
  inspectionType: "Dimensional & Functional",
  inspectionPlan: "IQP-MOTOR-001",
  specification: "SPC-MOTOR-001",
  drawingRevision: "DRW-MTR-003",
  testEquipment: "DMM-004, MIT-003",
  inspector: "K. Priya",
  ncrNumber: "NCR-2026-0027",
  supplierNcr: true,
  disposition: "Quarantine",
  inventoryStatus: "Blocked",
  remarks: "High current observed in 4 units. Material kept in quarantine.",
  status: "In Progress",
  overallResult: "Fail",

  characteristics: [
    {
      seq: 1,
      characteristic: "Shaft Diameter",
      specification: "12.00",
      tolerance: "±0.02",
      actual: "12.01",
      unit: "mm",
      method: "Micrometer",
      result: "Pass",
      remarks: "Within tolerance",
    },
    {
      seq: 2,
      characteristic: "Voltage Rating",
      specification: "48",
      tolerance: "±2",
      actual: "48.4",
      unit: "V",
      method: "DMM",
      result: "Pass",
      remarks: "OK",
    },
    {
      seq: 3,
      characteristic: "Current",
      specification: "≤ 8",
      tolerance: "—",
      actual: "8.7",
      unit: "A",
      method: "DMM",
      result: "Fail",
      remarks: "Above limit",
    },
    {
      seq: 4,
      characteristic: "Insulation Resistance",
      specification: "≥ 10",
      tolerance: "—",
      actual: "15.2",
      unit: "MΩ",
      method: "MIT",
      result: "Pass",
      remarks: "OK",
    },
    {
      seq: 5,
      characteristic: "Rotation",
      specification: "Smooth",
      tolerance: "—",
      actual: "Smooth",
      unit: "—",
      method: "Functional",
      result: "Pass",
      remarks: "Smooth operation",
    },
    {
      seq: 6,
      characteristic: "Housing",
      specification: "No Damage",
      tolerance: "—",
      actual: "Good",
      unit: "—",
      method: "Visual",
      result: "Pass",
      remarks: "No visible defect",
    },
  ],

  documents: [
    { id: "doc-1", name: "Certificate of Analysis.pdf", size: "1.2 MB", dateAdded: "06-Sep-2026", type: "PDF" },
    { id: "doc-2", name: "Material Certificate.pdf", size: "0.8 MB", dateAdded: "06-Sep-2026", type: "PDF" },
    { id: "doc-3", name: "Supplier Inspection Report.pdf", size: "1.5 MB", dateAdded: "05-Sep-2026", type: "PDF" },
    { id: "doc-4", name: "Drawing_DRW-MTR-003.pdf", size: "2.1 MB", dateAdded: "01-Sep-2026", type: "PDF" },
    { id: "doc-5", name: "Inspection Plan IQP-MOTOR-001.pdf", size: "0.9 MB", dateAdded: "01-Sep-2026", type: "PDF" },
  ],

  insights: [
    {
      id: "ai-1",
      text: "Current lot shows higher failure rate (5.0%) than average (2.1%).",
      type: "alert",
    },
    {
      id: "ai-2",
      text: "Recommend increased sampling for next 3 lots.",
      type: "info",
    },
    {
      id: "ai-3",
      text: "Supplier A has 3 similar defects in last 6 deliveries.",
      type: "info",
    },
    {
      id: "ai-4",
      text: "Consider supplier process audit.",
      type: "recommendation",
    },
    {
      id: "ai-5",
      text: "Overall supplier quality score: 87 / 100.",
      type: "success",
    },
  ],

  stats: {
    totalInspections: 184,
    pendingCount: 22,
    passedCount: 151,
    rejectedCount: 11,
    quarantineCount: 22,
    passRate: 94.2,
  },
};

/**
 * Recalculate IQC summary numbers based on characteristic pass/fail list
 */
export function recalculateIqcStats(record: IqcRecord, characteristics: IqcCharacteristic[]): Partial<IqcRecord> {
  const totalChecks = characteristics.length;
  const failChecks = characteristics.filter((c) => c.result === "Fail").length;

  if (failChecks === 0) {
    return {
      characteristics,
      acceptedQty: record.inspectionQty,
      rejectedQty: 0,
      defectRate: 0.0,
      qualityScore: 98,
      overallResult: "Pass",
      disposition: "Accept",
      inventoryStatus: "Released",
    };
  }

  // If there are failures, estimate defective units proportional to failed characteristics
  const estDefectiveUnits = Math.min(record.inspectionQty, Math.max(1, Math.round((failChecks / totalChecks) * 8)));
  const accepted = Math.max(0, record.inspectionQty - estDefectiveUnits);
  const defectRate = parseFloat(((estDefectiveUnits / record.inspectionQty) * 100).toFixed(1));
  const score = Math.max(40, 100 - Math.round(defectRate * 3));

  return {
    characteristics,
    acceptedQty: accepted,
    rejectedQty: estDefectiveUnits,
    defectRate,
    qualityScore: score,
    overallResult: "Fail",
    disposition: "Quarantine",
    inventoryStatus: "Blocked",
  };
}
