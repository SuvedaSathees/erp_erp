export type RcaType =
  | "Product Defect"
  | "Process Failure"
  | "Supplier Quality"
  | "Systemic / QMS"
  | "Customer Complaint";

export type RcaSource =
  | "Non-Conformance Report (NCR)"
  | "CAPA Investigation"
  | "Internal Audit Finding"
  | "Customer Complaint"
  | "Process Capability Excursion";

export type RcaMethodology =
  | "5-Why + Fishbone (Ishikawa)"
  | "8D Problem Solving"
  | "Fault Tree Analysis (FTA)"
  | "Failure Mode & Effects Analysis (FMEA)";

export type RcaStatus =
  | "Draft"
  | "Open / Active"
  | "Cause Identified"
  | "Root Cause Verified"
  | "Closed";

export interface FiveWhyItem {
  level: number;
  whyQuestion: string;
  answer: string;
  isRootCause?: boolean;
}

export interface FishboneCategory {
  category: "Man" | "Machine" | "Material" | "Method" | "Measurement" | "Environment";
  factors: string[];
}

export interface RcaRecord {
  rcaId: string;
  rcaNumber: string;
  title: string;
  rcaDate: string;
  targetDate: string;
  targetClosureDate?: string;
  rcaType: RcaType;
  rcaSource: RcaSource;
  sourceReference: string;
  methodology: RcaMethodology;
  leadInvestigator: string;
  teamMembers: string[];
  status: RcaStatus;
  workflowStatus: string;

  // 5W2H Problem Definition
  what: string;
  where: string;
  when: string;
  who: string;
  why: string;
  how: string;
  howMuch: string;

  // 5-Why Analysis
  fiveWhyList: FiveWhyItem[];

  // Fishbone (Ishikawa 6M)
  fishbone: FishboneCategory[];

  // Root Cause Determination
  immediateCause: string;
  contributingCauses: string[];
  rootCause: string;
  verificationEvidence: string;
  verificationStatus: "Verified" | "Under Test" | "Pending";

  // Linked items
  linkedNcrId?: string;
  linkedCapaId?: string;

  // AI Insights
  aiInsights: {
    id: string;
    text: string;
    type: "info" | "alert" | "success" | "warning";
  }[];
}
