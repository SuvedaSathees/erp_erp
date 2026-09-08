export type AuditType =
  | "Internal"
  | "Supplier"
  | "Process"
  | "Product"
  | "System"
  | "Compliance"
  | "Customer";

export type AuditCategory =
  | "Quality Management System (ISO 9001)"
  | "Automotive QMS (IATF 16949)"
  | "Environmental (ISO 14001)"
  | "Occupational Health & Safety (ISO 45001)"
  | "Information Security (ISO 27001)"
  | "Process & Workstation Audit";

export type AuditStatus =
  | "Draft"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Closed";

export type FindingClassification =
  | "Conforming"
  | "Minor NC"
  | "Major NC"
  | "Opportunity for Improvement (OFI)";

export interface AuditChecklistItem {
  id: string;
  clauseRef: string;
  requirement: string;
  areaDepartment: string;
  result: FindingClassification;
  findingNote: string;
  auditor: string;
  linkedNcr?: string;
}

export interface AuditFindingItem {
  id: string;
  findingNumber: string;
  clauseRef: string;
  classification: FindingClassification;
  description: string;
  department: string;
  responsiblePerson: string;
  dueDate: string;
  status: "Open" | "NCR Raised" | "Remediated" | "Closed";
  ncrReference?: string;
}

export interface AuditRecord {
  auditId: string;
  auditNumber: string;
  auditTitle: string;
  auditDate: string;
  scheduledEndDate: string;
  auditType: AuditType;
  auditCategory: AuditCategory;
  standardReference: string;
  leadAuditor: string;
  auditTeam: string[];
  auditScope: string;
  auditLocation: string;
  departmentAudited: string;
  auditStatus: AuditStatus;
  workflowStatus: string;
  conformanceRate: number; // e.g. 88.5%

  // Summary Metrics
  totalItems: number;
  compliantCount: number;
  minorNcCount: number;
  majorNcCount: number;
  ofiCount: number;

  // Objective & Scope Details
  objective: string;
  scopeSummary: string;
  methodology: string;

  // Checklists
  checklist: AuditChecklistItem[];

  // Findings
  findings: AuditFindingItem[];

  // AI Insights
  aiInsights: {
    id: string;
    text: string;
    type: "info" | "alert" | "success" | "warning";
  }[];
}
