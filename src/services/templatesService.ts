// Magnertia ERP - Templates Service
// Management -> Knowledge Management -> Templates
// Templates Form — MAICW Classification Master & Data Service

export interface TemplateRecord {
  templateId: string;
  templateCode: string;
  templateName: string;
  templateType: "Form Template" | "Workflow Template" | "Approval Template" | "Checklist Template" | "Inspection Template" | "Audit Template" | "Project Template" | "Policy Template" | "SOP Template";
  templateCategory: "Quality" | "Manufacturing" | "Engineering" | "Supply Chain" | "HR" | "Finance" | "Legal" | "Compliance";
  module: string;
  submodule: string;
  description: string;
  department: string;
  process: string;
  processOwner: string;
  templateOwner: string;
  organization: string;
  branchSite: string;
  version: string;
  status: "Draft" | "Review" | "Approved" | "Published" | "Revision" | "Obsolete" | "Archived";
  effectiveDate: string;
  reviewDate: string;
  expiryDate?: string;
  confidentiality: "Public" | "Internal" | "Confidential" | "Restricted";
}

export interface TemplatesKPIs {
  totalTemplates: number;
  totalChange: number;
  published: number;
  publishedChange: number;
  underReview: number;
  underReviewChange: number;
  dueForReview: number;
  dueForReviewChange: number;
  timesUsed: number;
  timesUsedChange: number;
  obsolete: number;
  obsoleteChange: number;
}

export interface StandardStructureItem {
  id: number;
  sectionName: string;
  mandatory: boolean;
  status: "Active" | "Inactive";
}

export interface RequiredFieldItem {
  fieldName: string;
  fieldType: string;
  mandatory: boolean;
  defaultValue: string;
  validationRule: string;
  status: "Active" | "Inactive";
}

export interface TemplateVersionItem {
  version: string;
  date: string;
  changedBy: string;
  changeDescription: string;
  status: "Published" | "Archived";
}

export interface RelatedTemplateItem {
  templateCode: string;
  templateName: string;
  type: string;
  category: string;
  relationship: string;
}

export const PRIMARY_TEMPLATE_RECORD: TemplateRecord = {
  templateId: "TPL-2026-0018",
  templateCode: "TPL-QA-017",
  templateName: "Inspection Checklist Template",
  templateType: "Form Template",
  templateCategory: "Quality",
  module: "Quality Management",
  submodule: "Inspection & Testing",
  description: "Standard template for product final inspection checklist with acceptance criteria.",
  department: "Quality",
  process: "Final Inspection",
  processOwner: "Ramesh S",
  templateOwner: "Priya Sharma",
  organization: "Magnertia Private Limited",
  branchSite: "Coimbatore - Development Centre",
  version: "v2.1",
  status: "Published",
  effectiveDate: "01-Sep-2026",
  reviewDate: "01-Sep-2027",
  expiryDate: "",
  confidentiality: "Internal",
};

export const TEMPLATES_EXECUTIVE_KPIS: TemplatesKPIs = {
  totalTemplates: 156,
  totalChange: 18,
  published: 128,
  publishedChange: 12,
  underReview: 16,
  underReviewChange: -27,
  dueForReview: 8,
  dueForReviewChange: -33,
  timesUsed: 642,
  timesUsedChange: 28,
  obsolete: 6,
  obsoleteChange: -14,
};

export const TEMPLATE_STRUCTURE_ITEMS: StandardStructureItem[] = [
  { id: 1, sectionName: "Document Header", mandatory: true, status: "Active" },
  { id: 2, sectionName: "Purpose", mandatory: true, status: "Active" },
  { id: 3, sectionName: "Scope", mandatory: true, status: "Active" },
  { id: 4, sectionName: "Definitions", mandatory: false, status: "Active" },
  { id: 5, sectionName: "Responsibilities", mandatory: true, status: "Active" },
  { id: 6, sectionName: "Procedure", mandatory: true, status: "Active" },
];

export const TEMPLATE_REQUIRED_FIELDS: RequiredFieldItem[] = [
  { fieldName: "Product Name", fieldType: "Text", mandatory: true, defaultValue: "-", validationRule: "Required", status: "Active" },
  { fieldName: "Product Code", fieldType: "Text", mandatory: true, defaultValue: "-", validationRule: "Required", status: "Active" },
  { fieldName: "Batch No.", fieldType: "Text", mandatory: true, defaultValue: "-", validationRule: "Alphanumeric", status: "Active" },
  { fieldName: "Inspection Date", fieldType: "Date", mandatory: true, defaultValue: "-", validationRule: "Must be valid date", status: "Active" },
  { fieldName: "Inspector Name", fieldType: "Employee", mandatory: true, defaultValue: "-", validationRule: "From employee master", status: "Active" },
];

export const TEMPLATE_VERSION_HISTORY: TemplateVersionItem[] = [
  { version: "v2.1", date: "01-Sep-2026", changedBy: "Priya Sharma", changeDescription: "Added packaging section", status: "Published" },
  { version: "v2.0", date: "15-Jan-2026", changedBy: "Ramesh S", changeDescription: "Updated test criteria", status: "Published" },
  { version: "v1.1", date: "10-Aug-2025", changedBy: "Anitha R", changeDescription: "Minor formatting changes", status: "Published" },
  { version: "v1.0", date: "15-Feb-2025", changedBy: "Ramesh S", changeDescription: "Initial version", status: "Published" },
];

export const TEMPLATE_RELATED_ITEMS: RelatedTemplateItem[] = [
  { templateCode: "TPL-QA-018", templateName: "Defect Report Form", type: "Form", category: "Quality", relationship: "Related Form" },
  { templateCode: "TPL-QA-020", templateName: "Corrective Action Template", type: "Form", category: "Quality", relationship: "Related Form" },
  { templateCode: "TPL-ENG-005", templateName: "Test Procedure Template", type: "SOP", category: "Engineering", relationship: "Related SOP" },
  { templateCode: "TPL-MFG-011", templateName: "Production Checklist", type: "Form", category: "Manufacturing", relationship: "Similar Template" },
];

export const TEMPLATE_AI_INSIGHTS: string[] = [
  "Template usage increased by 28% in last 3 months.",
  "Consider adding digital signature field.",
  "2 similar templates detected. Consolidation possible.",
  "Next review due in 11 months.",
  "Template is compliant with ISO 9001:2015 requirements.",
];

export const TEMPLATE_MASTER_REGISTER: TemplateRecord[] = [
  PRIMARY_TEMPLATE_RECORD,
  {
    templateId: "TPL-2026-0017",
    templateCode: "TPL-ENG-005",
    templateName: "Engineering Design Review Template",
    templateType: "Form Template",
    templateCategory: "Engineering",
    module: "Product Development",
    submodule: "Product Architecture",
    description: "Multi-disciplinary gate review checklist covering thermal, electromagnetic, mechanical tolerance, and component lifecycle.",
    department: "Engineering R&D",
    process: "Design Verification",
    processOwner: "Dr. Arvind R",
    templateOwner: "Meera Nair",
    organization: "Magnertia Private Limited",
    branchSite: "Development Centre",
    version: "v1.8",
    status: "Published",
    effectiveDate: "15-Jun-2026",
    reviewDate: "15-Jun-2027",
    confidentiality: "Internal",
  },
  {
    templateId: "TPL-2026-0016",
    templateCode: "TPL-SCM-008",
    templateName: "Supplier Quality Audit Questionnaire",
    templateType: "Audit Template",
    templateCategory: "Supply Chain",
    module: "Procurement Management",
    submodule: "Vendor Evaluation",
    description: "VDA 6.3 compliant audit template for evaluating Tier 1 supplier manufacturing lines, traceability and statistical process control.",
    department: "Procurement",
    process: "Supplier Onboarding",
    processOwner: "Manoj Kumar",
    templateOwner: "Priya Sharma",
    organization: "Magnertia Private Limited",
    branchSite: "Central Procurement",
    version: "v2.0",
    status: "Published",
    effectiveDate: "20-Apr-2026",
    reviewDate: "20-Apr-2027",
    confidentiality: "Internal",
  },
];
