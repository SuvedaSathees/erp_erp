export type NcrStatus =
  | "Draft"
  | "Open"
  | "Investigation"
  | "CAPA"
  | "Verification"
  | "Closed";

export type NcrPriority = "Low" | "Medium" | "High" | "Critical";

export type DefectCategory =
  | "Visual"
  | "Dimensional"
  | "Material"
  | "Functional"
  | "Electrical"
  | "Performance"
  | "Assembly"
  | "Process"
  | "Documentation"
  | "Packaging"
  | "Supplier"
  | "Customer"
  | "Safety"
  | "Regulatory / Compliance";

export type NcrSource =
  | "Incoming"
  | "In-Process Inspection"
  | "Final"
  | "Supplier"
  | "Customer"
  | "Audit"
  | "Production";

export interface NcrPhotoEvidence {
  id: string;
  filename: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  hasRedCircle?: boolean;
  caption?: string;
  imageUrl?: string;
}

export interface NcrFiveWhyItem {
  level: number;
  whyLabel: string;
  question: string;
  answer: string;
}

export interface NcrIshikawaCategory {
  category: "Man" | "Machine" | "Material" | "Method" | "Measurement" | "Environment" | "Design" | "Supplier" | "System";
  title: string;
  notes: string;
  isContributing: boolean;
}

export interface NcrCorrectiveActionItem {
  id: string;
  actionId: string;
  rootCause: string;
  actionRequired: string;
  actionType: "Process" | "Product" | "Supplier" | "System";
  owner: string;
  targetDate: string;
  priority: NcrPriority;
  requiredResources: string;
  estimatedCost: string;
  completionDate?: string;
  status: "Open" | "In Progress" | "Completed";
}

export interface NcrVerificationItem {
  id: string;
  verificationId: string;
  method: "Inspection" | "Audit" | "Test" | "Data Analysis";
  date: string;
  verifiedBy: string;
  result: "Effective" | "Not Effective" | "Pending";
  residualRiskScore: number;
  additionalAction: string;
}

export interface NcrActivityLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details?: string;
}

export interface NcrAiInsight {
  id: string;
  type: "alert" | "root_cause" | "recommendation" | "risk";
  title: string;
  description: string;
  severity: "high" | "medium" | "low" | "info";
}

export interface NcrRecord {
  // 1. NCR Header
  ncrId: string;
  ncrNumber: string;
  ncrDate: string;
  ncrSource: NcrSource;
  sourceReference: string;
  organization: string;
  plant: string;
  department: string;
  location: string;
  reportedBy: string;
  responsibleOwner: string;
  qualityEngineer: string;
  priority: NcrPriority;
  ncrStatus: NcrStatus;
  dueDate: string;

  // 2. Non-Conformance Identification
  product: string;
  productCode: string;
  productRevision: string;
  partComponent: string;
  batchLotNo: string;
  serialNumbers: string;
  productionOrder: string;
  workOrder: string;
  operation: string;
  machineEquipment: string;
  supplier: string;
  purchaseOrder: string;
  grn: string;
  customer: string;
  salesOrder: string;

  // 3. Problem Description
  nonConformanceTitle: string;
  defectCategory: DefectCategory;
  defectCode: string;
  detectionMethod: string;
  problemDescription: string;
  requirementSpecification: string;
  detectionDate: string;
  detectionLocation: string;
  actualCondition: string;
  expectedCondition: string;
  affectedCharacteristic: string;
  photos: NcrPhotoEvidence[];

  // 4. Severity & Risk Assessment
  severity: "Critical" | "Major" | "Minor";
  occurrenceScore: number; // 1-10
  detectionScore: number;  // 1-10
  riskPriorityNumber: number; // calculated e.g. 180
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  safetyImpact: boolean;
  customerImpact: boolean;
  regulatoryImpact: boolean;
  productionImpact: boolean;
  deliveryImpact: boolean;
  financialImpactEstimate: string;
  escalationRequired: boolean;

  // 5. Immediate Containment
  containmentRequired: boolean;
  containmentStatus: "Pending" | "In Progress" | "Completed";
  containmentAction: string;
  affectedQuantity: number;
  confirmedDefectQuantity: number;
  suspectQuantity: number;
  materialHold: boolean;
  wipHold: boolean;
  finishedGoodsHold: boolean;
  shipmentHold: boolean;
  customerNotification: boolean;
  supplierNotification: boolean;
  quarantineLocation: string;
  containmentOwner: string;
  containmentDate: string;

  // 7. Investigation
  investigationId: string;
  investigationLead: string;
  investigationStart: string;
  investigationEnd: string;
  investigationMethod: "5 Why" | "Fishbone" | "8D" | "Fault Tree" | "Other";
  evidenceReviewed: string;
  processReviewed: string;
  recordsReviewed: string;
  investigationFindings: string;
  suspectedCause: string;
  investigationStatus: "Open" | "Complete";

  // 8. Root Cause Analysis
  fiveWhys: NcrFiveWhyItem[];
  ishikawaCauses: NcrIshikawaCategory[];

  // 9. Corrective Action
  correctiveActions: NcrCorrectiveActionItem[];

  // 10. CAPA
  isSystemicCause: boolean;
  relatedCapaId?: string;
  capaStatus?: "Not Created" | "Draft" | "Open" | "In Progress" | "Closed";

  // 11. Disposition
  dispositionType:
    | "Accept"
    | "Partial Accept"
    | "Rework"
    | "Repair"
    | "Use-As-Is"
    | "Return to Supplier"
    | "Reject"
    | "Scrap"
    | "Replace"
    | "Recall";
  dispositionNotes: string;
  dispositionApprovedBy?: string;
  dispositionDate?: string;

  // 12. Rework & Re-Inspection
  reworkOrder?: string;
  reworkOperation?: string;
  reworkInstruction?: string;
  reworkQuantity?: number;
  reworkCompletedBy?: string;
  reworkDate?: string;
  reInspectionRequired: boolean;
  reInspectionNo?: string;
  reInspectionResult?: "Pass" | "Fail";
  finalQualityApproval?: string;

  // 13. Verification
  verifications: NcrVerificationItem[];

  // 14. Closure
  closureRecommendation: string;
  closureDate: string;
  closureVerifiedBy: string;
  qualityManagerApproval: string;
  effectivenessResult: "Effective" | "Ineffective" | "Pending Review";
  ncrClosureStatus: "Open" | "Pending Approval" | "Closed";
  closureRemarks: string;

  // Connected widgets & intelligence
  recentActivities: NcrActivityLog[];
  aiInsights: NcrAiInsight[];
}
