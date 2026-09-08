export type ComplianceCategory =
  | "ISO Standard"
  | "Regulatory"
  | "Internal Policy"
  | "License & Permits"
  | "Certification"
  | "Legal Register"
  | "Customer Requirement";

export type ComplianceType =
  | "Mandatory"
  | "Statutory"
  | "Voluntary"
  | "Contractual";

export type ComplianceStatus =
  | "Compliant"
  | "Minor Gap"
  | "Major Gap"
  | "Non-Compliant"
  | "Under Review";

export type ComplianceWorkflowStatus =
  | "Draft"
  | "Under Assessment"
  | "Pending Review"
  | "Approved"
  | "Expired";

export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export interface ComplianceObligationItem {
  id: string;
  clauseRef: string;
  requirement: string;
  applicableFunction: string;
  evaluation: "Compliant" | "Minor Gap" | "Major Gap" | "Not Applicable";
  evidenceNote: string;
  status: "Active" | "Pending Action" | "Verified";
}

export interface ComplianceEvidenceItem {
  id: string;
  documentTitle: string;
  documentRef: string;
  category: string;
  uploadDate: string;
  expiryDate?: string;
  verifiedBy: string;
  fileSize: string;
}

export interface ComplianceAssessmentHistory {
  id: string;
  date: string;
  assessor: string;
  score: number;
  result: ComplianceStatus;
  notes: string;
}

export interface ComplianceRecord {
  complianceId: string;
  complianceNumber: string;
  title: string;
  category: ComplianceCategory;
  subCategory: string;
  standardBody: string;
  standardReference: string;
  clauseReference: string;
  complianceType: ComplianceType;
  scope: string;
  responsibleOwner: string;
  department: string;
  riskLevel: RiskLevel;
  assessmentFrequency: string;
  registrationDate: string;
  nextAssessmentDate: string;
  complianceStatus: ComplianceStatus;
  workflowStatus: ComplianceWorkflowStatus;
  complianceScore: number; // e.g. 94%

  // Details
  description: string;
  applicabilityNote: string;
  consequencesOfNonCompliance: string;

  // Obligations
  obligations: ComplianceObligationItem[];

  // Evidence
  evidence: ComplianceEvidenceItem[];

  // Linked items
  linkedAuditId?: string;
  linkedNcrId?: string;
  linkedCapaId?: string;

  // AI Insights
  aiInsights: {
    id: string;
    text: string;
    type: "info" | "alert" | "success" | "warning";
  }[];

  // History
  history: ComplianceAssessmentHistory[];
}
