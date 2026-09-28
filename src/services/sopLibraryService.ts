// Magnertia ERP - SOP Library Service
// Management -> Knowledge Management -> SOP Library
// SOP Library Form — MAICW Classification Master & Data Service

export interface SOPRecord {
  sopId: string;
  sopNumber: string;
  sopTitle: string;
  sopType: "Corporate SOP" | "Department SOP" | "Process SOP" | "Work Process SOP" | "Operational SOP" | "Technical SOP" | "Quality SOP" | "Safety SOP";
  sopCategory: "Management" | "Engineering" | "Product Development" | "Manufacturing" | "Quality" | "Supply Chain" | "Safety" | "Compliance";
  department: string;
  process: string;
  subProcess?: string;
  processOwner: string;
  sopOwner: string;
  organization: string;
  plantSite: string;
  effectiveDate: string;
  reviewDate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Draft" | "Review" | "Approved" | "Published" | "Revision" | "Obsolete" | "Archived";
  version: string;
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
  description?: string;
}

export interface SOPKPIs {
  totalSops: number;
  totalChange: number;
  published: number;
  publishedChange: number;
  underReview: number;
  underReviewChange: number;
  dueForReview: number;
  dueForReviewChange: number;
  obsolete: number;
  obsoleteChange: number;
  acknowledgementRate: number;
  acknowledgementRateChange: number;
}

export interface RelatedDocumentItem {
  id: string;
  documentName: string;
  type: string;
  version: string;
  status: "Active" | "Pending" | "Archived";
}

export interface TrainingCompetencyItem {
  id: string;
  trainingModule: string;
  mandatory: boolean;
  trained: string;
  completion: number;
}

export interface SOPRevisionItem {
  version: string;
  date: string;
  changedBy: string;
  changeDescription: string;
}

export interface SOPDistributionData {
  acknowledged: number;
  pending: number;
  overdue: number;
  acknowledgementRate: number;
}

export const PRIMARY_SOP_RECORD: SOPRecord = {
  sopId: "SOP-2026-0148",
  sopNumber: "SOP-QA-017",
  sopTitle: "Final Inspection Procedure for EV Charging Station",
  sopType: "Process SOP",
  sopCategory: "Quality",
  department: "Product Inspection",
  process: "Final Assembly Inspection",
  subProcess: "Electrical Continuity & Safety Interlocks",
  processOwner: "Ramesh S",
  sopOwner: "Priya Sharma",
  organization: "Magnertia Private Limited",
  plantSite: "Coimbatore - Development Centre",
  effectiveDate: "01-Sep-2026",
  reviewDate: "01-Sep-2027",
  priority: "High",
  status: "Published",
  version: "v2.1",
  confidentiality: "Internal",
  description: "Standard operating procedure for multi-point pre-delivery final inspection of high-power EVSE stations including dielectric isolation, CAN bus communication handshake, and thermal cutoff verification.",
};

export const SOP_EXECUTIVE_KPIS: SOPKPIs = {
  totalSops: 286,
  totalChange: 12,
  published: 241,
  publishedChange: 8,
  underReview: 18,
  underReviewChange: -50,
  dueForReview: 21,
  dueForReviewChange: -19,
  obsolete: 6,
  obsoleteChange: -40,
  acknowledgementRate: 92,
  acknowledgementRateChange: 5,
};

export const SOP_DISTRIBUTION_DATA: SOPDistributionData = {
  acknowledged: 184,
  pending: 12,
  overdue: 4,
  acknowledgementRate: 92,
};

export const SOP_RELATED_DOCUMENTS: RelatedDocumentItem[] = [
  { id: "RD-01", documentName: "Process Flow - Final Inspection", type: "Flow Chart", version: "v1.0", status: "Active" },
  { id: "RD-02", documentName: "Inspection Checklist", type: "Form", version: "v2.0", status: "Active" },
  { id: "RD-03", documentName: "Work Instruction - Test Equipment", type: "Work Instruction", version: "v1.3", status: "Active" },
  { id: "RD-04", documentName: "Calibration Procedure", type: "SOP", version: "v1.1", status: "Active" },
];

export const SOP_TRAINING_MODULES: TrainingCompetencyItem[] = [
  { id: "TM-01", trainingModule: "Final Inspection Training", mandatory: true, trained: "42/45", completion: 93 },
  { id: "TM-02", trainingModule: "Quality Standards Overview", mandatory: true, trained: "40/45", completion: 89 },
  { id: "TM-03", trainingModule: "Safety During Inspection", mandatory: true, trained: "44/45", completion: 98 },
  { id: "TM-04", trainingModule: "Test Equipment Handling", mandatory: false, trained: "38/45", completion: 84 },
];

export const SOP_COMPLIANCE_LINKS = {
  isoClause: "ISO 9001:2015 - Clause 8.6",
  regulatoryRequirement: "BIS - IS 17017 (EVSE)",
  legalRequirement: "Factories Act, 1948",
  riskReference: "RISK-QA-014",
  relatedPolicies: "Quality Policy QP-001",
};

export const SOP_REVISIONS: SOPRevisionItem[] = [
  { version: "v2.1", date: "28-Aug-2026", changedBy: "Priya Sharma", changeDescription: "Updated inspection criteria for DC charger" },
  { version: "v2.0", date: "12-Jan-2026", changedBy: "Ramesh S", changeDescription: "Added safety checklist" },
  { version: "v1.1", date: "10-Oct-2025", changedBy: "Arun Kumar", changeDescription: "Minor formatting changes" },
  { version: "v1.0", date: "01-Jun-2025", changedBy: "Priya Sharma", changeDescription: "Initial version" },
];

export const SOP_AI_INSIGHTS: string[] = [
  "Consider review due in 11 months",
  "2 similar SOPs detected (opportunity to consolidate)",
  "Training completion is 93% (2 users pending)",
  "No open compliance risks",
  "Process change detected - recommend review",
];

export const SOP_MASTER_REGISTER: SOPRecord[] = [
  PRIMARY_SOP_RECORD,
  {
    sopId: "SOP-2026-0147",
    sopNumber: "SOP-MFG-001",
    sopTitle: "EVSE Final Assembly & Wiring Procedure",
    sopType: "Manufacturing SOP" as any,
    sopCategory: "Manufacturing",
    department: "Manufacturing",
    process: "Final Assembly",
    processOwner: "Karthik Raja",
    sopOwner: "Devan M",
    organization: "Magnertia Private Limited",
    plantSite: "Coimbatore - Plant 1",
    effectiveDate: "15-Aug-2026",
    reviewDate: "15-Aug-2027",
    priority: "Critical",
    status: "Published",
    version: "v3.1",
    confidentiality: "Internal",
    description: "Standard operating procedure for mechanical and electrical assembly of high voltage EVSE cabinets.",
  },
  {
    sopId: "SOP-2026-0146",
    sopNumber: "SOP-ENG-008",
    sopTitle: "WPT Wireless Power Coil Testing & Verification",
    sopType: "Technical SOP",
    sopCategory: "Engineering",
    department: "R&D Power Electronics",
    process: "Coil Resonance Testing",
    processOwner: "Dr. Arvind R",
    sopOwner: "Meera Nair",
    organization: "Magnertia Private Limited",
    plantSite: "Coimbatore - Development Centre",
    effectiveDate: "20-Aug-2026",
    reviewDate: "20-Feb-2027",
    priority: "High",
    status: "Review",
    version: "v1.4",
    confidentiality: "Confidential",
    description: "Magnetic resonance calibration and RF radiation containment testing for inductive wireless charging pads.",
  },
  {
    sopId: "SOP-2026-0145",
    sopNumber: "SOP-EHS-006",
    sopTitle: "High-Voltage Electrical Safety & Lockout/Tagout",
    sopType: "Safety SOP",
    sopCategory: "Safety",
    department: "EHS / Plant Safety",
    process: "High Voltage Isolation",
    processOwner: "Suresh K",
    sopOwner: "Anitha R",
    organization: "Magnertia Private Limited",
    plantSite: "All Facilities",
    effectiveDate: "01-Jul-2026",
    reviewDate: "01-Jul-2027",
    priority: "Critical",
    status: "Published",
    version: "v2.0",
    confidentiality: "Internal",
    description: "Mandatory zero-energy state verification and LOTO padlocking protocols for work on systems >48V DC / 230V AC.",
  },
  {
    sopId: "SOP-2026-0144",
    sopNumber: "SOP-SCM-012",
    sopTitle: "Critical Electronic Components Inward Inspection",
    sopType: "Quality SOP",
    sopCategory: "Supply Chain",
    department: "Quality Assurance",
    process: "Incoming Material Inspection",
    processOwner: "Priya Sharma",
    sopOwner: "Manoj Kumar",
    organization: "Magnertia Private Limited",
    plantSite: "Warehouse Central",
    effectiveDate: "10-May-2026",
    reviewDate: "10-May-2027",
    priority: "Medium",
    status: "Published",
    version: "v1.2",
    confidentiality: "Internal",
    description: "Acceptance sampling plan (AQL 0.65) and certificate of analysis (COA) verification for semiconductors and power relays.",
  },
  {
    sopId: "SOP-2026-0143",
    sopNumber: "SOP-IT-004",
    sopTitle: "Cloud Firmware Deployment & Rollback Protocol",
    sopType: "Technical SOP",
    sopCategory: "Engineering",
    department: "Cloud Operations",
    process: "OTA Firmware Deployment",
    processOwner: "Vikram Seth",
    sopOwner: "Arun Kumar",
    organization: "Magnertia Private Limited",
    plantSite: "Cloud Platform",
    effectiveDate: "15-Jun-2026",
    reviewDate: "15-Jun-2027",
    priority: "High",
    status: "Published",
    version: "v2.3",
    confidentiality: "Confidential",
    description: "Staged canary release, cryptographic firmware signature check, and automated rollback upon crash rate threshold exceedance.",
  },
];
