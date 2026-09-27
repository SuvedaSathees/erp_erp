// Magnertia ERP - Document Repository Service
// Management -> Knowledge Management -> Document Repository
// Document Repository Form — MAICW Classification Master & Data Service

export interface DocumentRecord {
  documentId: string;
  documentNumber: string;
  documentTitle: string;
  documentType: "Policy" | "Procedure" | "SOP" | "Work Instruction" | "Manual" | "Guideline" | "Form" | "Template" | "Standard" | "Specification" | "Report";
  documentCategory: "Management" | "Quality" | "Manufacturing" | "Engineering" | "Supply Chain" | "HR" | "Finance" | "Legal" | "Compliance";
  module: string;
  submodule: string;
  description: string;
  department: string;
  process: string;
  processOwner: string;
  documentOwner: string;
  branchSite: string;
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
  effectiveDate: string;
  expiryDate: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  currentVersion: string;
  documentStatus: "Draft" | "Review" | "Approved" | "Published" | "Revision" | "Obsolete" | "Archived";
  fileName?: string;
  fileSize?: string;
  fileType?: string;
  repositoryPath?: string;
  checksum?: string;
}

export interface DocumentRepositoryKPIs {
  totalDocuments: number;
  totalChange: number;
  activeDocuments: number;
  activeChange: number;
  underReview: number;
  underReviewChange: number;
  pendingApproval: number;
  pendingApprovalChange: number;
  expiringSoon: number;
  expiringSoonChange: number;
  obsolete: number;
  obsoleteChange: number;
}

export interface DocumentApprovalStep {
  role: string;
  person: string;
  date: string;
  status: "Completed" | "Pending" | "Rejected";
}

export interface AccessControlRule {
  id: string;
  userGroup: string;
  role: string;
  accessLevel: "View" | "Download" | "Print" | "Edit" | "Approve" | "Admin";
  download: boolean;
  print: boolean;
  share: boolean;
  status: "Active" | "Inactive";
}

export interface RelatedDocumentItem {
  id: string;
  documentNo: string;
  title: string;
  type: string;
  version: string;
  status: "Active" | "Archived";
}

export interface DocumentAnalyticsData {
  month: string;
  views: number;
  downloads: number;
  edits: number;
}

export const PRIMARY_DOCUMENT_RECORD: DocumentRecord = {
  documentId: "DOC-2026-0148",
  documentNumber: "MAG-QMS-017",
  documentTitle: "Quality Inspection Procedure for EV Charging Station",
  documentType: "SOP",
  documentCategory: "Quality",
  module: "Quality Management",
  submodule: "Inspection & Testing",
  description: "Standard operating procedure for final inspection of EV charging station assembly including test checklist, acceptance criteria and documentation.",
  department: "Quality",
  process: "Final Inspection",
  processOwner: "Ramesh S",
  documentOwner: "Priya Sharma",
  branchSite: "Coimbatore - Development Centre",
  confidentiality: "Internal",
  effectiveDate: "01-Sep-2026",
  expiryDate: "31-Aug-2028",
  priority: "High",
  currentVersion: "v2.1",
  documentStatus: "Published",
  fileName: "Quality_Inspection_SOP_v2.1.pdf",
  fileSize: "1.8 MB",
  fileType: "PDF",
  repositoryPath: "/Quality/SOP/Inspection/",
  checksum: "a3f5d2e6...9c1b",
};

export const DOCUMENT_REPOSITORY_KPIS: DocumentRepositoryKPIs = {
  totalDocuments: 1248,
  totalChange: 12,
  activeDocuments: 892,
  activeChange: 8,
  underReview: 126,
  underReviewChange: 5,
  pendingApproval: 48,
  pendingApprovalChange: -18,
  expiringSoon: 32,
  expiringSoonChange: -25,
  obsolete: 16,
  obsoleteChange: 0,
};

export const DOCUMENT_APPROVAL_STEPS: DocumentApprovalStep[] = [
  { role: "Created by", person: "Priya Sharma", date: "25-Aug-2026", status: "Completed" },
  { role: "Reviewed by", person: "Ramesh S", date: "27-Aug-2026", status: "Completed" },
  { role: "EHS Review", person: "Suresh K", date: "28-Aug-2026", status: "Completed" },
  { role: "Quality Review", person: "Anitha R", date: "29-Aug-2026", status: "Completed" },
  { role: "Approved by", person: "Quality Head", date: "Pending", status: "Pending" },
];

export const DOCUMENT_ACCESS_RULES: AccessControlRule[] = [
  { id: "AC-1", userGroup: "Quality Team", role: "User", accessLevel: "View", download: true, print: true, share: false, status: "Active" },
  { id: "AC-2", userGroup: "Manufacturing Team", role: "User", accessLevel: "View", download: true, print: false, share: false, status: "Active" },
  { id: "AC-3", userGroup: "Management", role: "Approver", accessLevel: "Edit", download: true, print: true, share: true, status: "Active" },
  { id: "AC-4", userGroup: "External Auditor", role: "External", accessLevel: "View", download: false, print: false, share: false, status: "Active" },
];

export const DOCUMENT_RELATED_ITEMS: RelatedDocumentItem[] = [
  { id: "RD-1", documentNo: "DOC-FRM-002", title: "Inspection Checklist", type: "Form", version: "v1.3", status: "Active" },
  { id: "RD-2", documentNo: "DOC-WI-015", title: "Test Equipment WI", type: "Work Instruction", version: "v1.1", status: "Active" },
  { id: "RD-3", documentNo: "POL-QA-001", title: "Quality Policy", type: "Policy", version: "v2.0", status: "Active" },
  { id: "RD-4", documentNo: "SOP-QMS-010", title: "Non-Conformance Handling", type: "SOP", version: "v1.5", status: "Active" },
];

export const DOCUMENT_ANALYTICS_MONTHLY: DocumentAnalyticsData[] = [
  { month: "Jan", views: 42, downloads: 18, edits: 4 },
  { month: "Feb", views: 56, downloads: 24, edits: 6 },
  { month: "Mar", views: 68, downloads: 31, edits: 8 },
  { month: "Apr", views: 85, downloads: 44, edits: 12 },
  { month: "May", views: 110, downloads: 58, edits: 15 },
  { month: "Jun", views: 135, downloads: 72, edits: 18 },
  { month: "Jul", views: 160, downloads: 88, edits: 22 },
  { month: "Aug", views: 195, downloads: 112, edits: 28 },
  { month: "Sep", views: 182, downloads: 98, edits: 21 },
  { month: "Oct", views: 145, downloads: 76, edits: 14 },
  { month: "Nov", views: 125, downloads: 62, edits: 11 },
  { month: "Dec", views: 98, downloads: 48, edits: 7 },
];

export const DOCUMENT_MASTER_REGISTER: DocumentRecord[] = [
  PRIMARY_DOCUMENT_RECORD,
  {
    documentId: "DOC-2026-0147",
    documentNumber: "MAG-POL-001",
    documentTitle: "Magnertia Corporate Information Security Policy",
    documentType: "Policy",
    documentCategory: "Compliance",
    module: "Administration",
    submodule: "Policy Management",
    description: "Enterprise policy for data classification, role-based access control, cryptographic key storage and acceptable device usage.",
    department: "Information Technology",
    process: "Cybersecurity Governance",
    processOwner: "Vikram Seth",
    documentOwner: "Arun Kumar",
    branchSite: "Corporate HQ",
    confidentiality: "Confidential",
    effectiveDate: "01-Jan-2026",
    expiryDate: "31-Dec-2027",
    priority: "Critical",
    currentVersion: "v3.0",
    documentStatus: "Published",
    fileName: "InfoSec_Policy_v3.0.pdf",
    fileSize: "2.4 MB",
    fileType: "PDF",
    repositoryPath: "/Security/Policies/",
    checksum: "b7e2c91a...4f3d",
  },
  {
    documentId: "DOC-2026-0146",
    documentNumber: "MAG-MFG-WI-042",
    documentTitle: "High-Voltage Cabinet Busbar Torquing Work Instruction",
    documentType: "Work Instruction",
    documentCategory: "Manufacturing",
    module: "Manufacturing Development",
    submodule: "Work Instructions",
    description: "Torque sequence specifications, calibrated wrench verification, and cross-thread prevention for copper busbar interconnects.",
    department: "Manufacturing",
    process: "Cabinet Sub-Assembly",
    processOwner: "Karthik Raja",
    documentOwner: "Devan M",
    branchSite: "Plant 1",
    confidentiality: "Internal",
    effectiveDate: "15-May-2026",
    expiryDate: "15-May-2028",
    priority: "High",
    currentVersion: "v1.4",
    documentStatus: "Published",
    fileName: "Busbar_Torquing_WI_v1.4.pdf",
    fileSize: "3.1 MB",
    fileType: "PDF",
    repositoryPath: "/Manufacturing/WI/",
    checksum: "d4c8a19f...7e2a",
  },
  {
    documentId: "DOC-2026-0145",
    documentNumber: "MAG-LEG-CTR-089",
    documentTitle: "Master Grid Interconnection & Power Offtake Agreement",
    documentType: "Procedure" as any,
    documentCategory: "Legal",
    module: "Finance & Legal",
    submodule: "Contracts",
    description: "Controlled legal framework agreement governing grid point of common coupling, maximum demand kVA limits, and billing settlements.",
    department: "Legal & Regulatory",
    process: "Contract Execution",
    processOwner: "Adv. Rajesh K",
    documentOwner: "Priya Sharma",
    branchSite: "Regional Offices",
    confidentiality: "Restricted",
    effectiveDate: "10-Jul-2026",
    expiryDate: "09-Jul-2031",
    priority: "Critical",
    currentVersion: "v1.0",
    documentStatus: "Published",
    fileName: "Grid_Offtake_Agreement.pdf",
    fileSize: "4.8 MB",
    fileType: "PDF",
    repositoryPath: "/Legal/Contracts/",
    checksum: "f9e3d81b...2c5a",
  },
];
