export type CapaType =
  | "Corrective"
  | "Preventive"
  | "Corrective + Preventive";

export type CapaSource =
  | "Non-Conformance Report (NCR)"
  | "Internal Quality Audit"
  | "Customer Complaint"
  | "Supplier Quality Issue"
  | "Quality Trend Analysis"
  | "Process Failure (FMEA)";

export type CapaSeverity = "Critical" | "Major" | "Moderate" | "Minor";

export type CapaStatus =
  | "Open"
  | "Under Investigation"
  | "Action Implementation"
  | "Effectiveness Verification"
  | "Pending Approval"
  | "Closed";

export interface CapaActionItem {
  id: string;
  actionType: "Containment" | "Corrective Action" | "Preventive Action" | "Effectiveness Verification";
  description: string;
  assignedTo: string;
  department: string;
  targetDate: string;
  completionDate?: string;
  status: "Open" | "In Progress" | "Completed" | "Verified";
  evidenceNote: string;
}

export interface CapaRecord {
  capaId: string;
  capaNumber: string;
  title: string;
  capaDate: string;
  targetClosureDate: string;
  capaType: CapaType;
  source: CapaSource;
  sourceReference: string;
  severity: CapaSeverity;
  owner: string;
  department: string;
  status: CapaStatus;
  workflowStatus: string;

  // Product & Process Scope
  productName: string;
  partNumber: string;
  productionLine: string;
  defectDescription: string;
  defectRate: string;

  // Risk Assessment (RPN)
  severityScore: number;    // 1-10
  occurrenceScore: number;  // 1-10
  detectionScore: number;   // 1-10
  initialRpn: number;       // S * O * D
  residualRpn: number;      // target post-action RPN
  rpnReductionPercent: number;

  // Root Cause Link
  rootCauseSummary: string;
  linkedRcaId?: string;

  // Action Items
  actions: CapaActionItem[];

  // Verification & Effectiveness
  effectivenessCriteria: string;
  verificationMethod: string;
  verificationResults: string;
  isEffective: boolean;

  // AI Insights
  aiInsights: {
    id: string;
    text: string;
    type: "info" | "alert" | "success" | "warning";
  }[];
}
