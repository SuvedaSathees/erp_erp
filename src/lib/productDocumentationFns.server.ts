import { createServerFn } from "@tanstack/react-start";
import type {
  ProductDocumentationApprovalDecision,
  ProductDocumentationFormInput,
  ProductDocumentationRecord,
  ProductDocumentationStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "product-documentation";

export function calculateProductDocScores(record: Partial<ProductDocumentationRecord>) {
  const engScore = record.engineeringScore ?? 92;
  const mfgScore = record.manufacturingScore ?? 90;
  const qualScore = record.qualityComplianceScore ?? 89;
  const custScore = record.customerScore ?? 91;
  const verScore = record.versionControlScore ?? 88;
  const aiScore = record.aiDocumentationScore ?? 90;
  const overallScore = Math.round(engScore * 0.25 + mfgScore * 0.20 + qualScore * 0.20 + custScore * 0.20 + verScore * 0.15);
  return { engineeringScore: engScore, manufacturingScore: mfgScore, qualityComplianceScore: qualScore, customerScore: custScore, versionControlScore: verScore, aiDocumentationScore: aiScore, overallDocumentationScore: overallScore };
}

export const DEFAULT_PRODUCT_DOCUMENTATION_RECORD: ProductDocumentationRecord = {
  id: "doc-rec-0087",
  documentationId: "DOC-2024-0087",
  formCode: "DOF-2024-25",
  documentationProject: "Smart EV Charger Documentation",
  documentationVersion: "v1.2.0",
  workflowStatus: "In Progress",
  stage: 2,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",

  linkedProduct: { id: "PRD-EV-7KW", name: "Smart EV Charger AC 7kW" },
  linkedCertification: { id: "CR-2024-00041", code: "CR-2024-00041" },
  documentOwner: {
    name: "Rahul Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    email: "rahul.sharma@magnertia.com",
  },
  documentationEngineer: {
    name: "Nisha Verma",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    email: "nisha.verma@magnertia.com",
  },
  qualityManager: {
    name: "Vikram Singh",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    email: "vikram.singh@magnertia.com",
  },
  developmentStage: "Prototype Validation",
  confidentialityLevel: "Confidential",

  // Overview Tab Fields
  productName: "Smart EV Charger AC 7kW",
  productCategory: "AC EV Charger",
  documentTitle: "Smart EV Charger - Technical Dossier",
  documentType: "Technical Specification",
  businessPurpose: "Provide complete technical specifications, design details, and operational guidelines.",

  // Section 2: Engineering Documentation List
  engineeringDocs: [
    { id: "ed-1", name: "PRD_Smart_EV_Charger_v1.2.pdf", size: "2.45 MB", version: "v1.2.0", type: "pdf", sourceModule: "PRD" },
    { id: "ed-2", name: "Architecture_Document_v1.2.pdf", size: "3.12 MB", version: "v1.2.0", type: "pdf", sourceModule: "Architecture" },
    { id: "ed-3", name: "Mechanical_Drawings_v1.2.zip", size: "25.6 MB", version: "v1.2.0", type: "zip", sourceModule: "Mechanical" },
    { id: "ed-4", name: "Electrical_Schematics_v1.2.pdf", size: "4.18 MB", version: "v1.2.0", type: "pdf", sourceModule: "Electrical" },
    { id: "ed-5", name: "Electronics_Design_Files_v1.2.zip", size: "18.7 MB", version: "v1.2.0", type: "zip", sourceModule: "Electronics" },
    { id: "ed-6", name: "Firmware_Documentation_v1.2.pdf", size: "2.31 MB", version: "v1.2.0", type: "pdf", sourceModule: "Firmware" },
    { id: "ed-7", name: "Software_Documentation_v1.2.pdf", size: "3.05 MB", version: "v1.2.0", type: "pdf", sourceModule: "Software" },
  ],
  engineeringScore: 92,

  // Section 3: Manufacturing Documentation List
  manufacturingDocs: [
    { id: "md-1", name: "BOM_Smart_EV_Charger_v1.2.xlsx", size: "1.25 MB", version: "v1.2.0", type: "xlsx", sourceModule: "BOM" },
    { id: "md-2", name: "Assembly_Instructions_v1.2.pdf", size: "2.65 MB", version: "v1.2.0", type: "pdf", sourceModule: "Assembly" },
    { id: "md-3", name: "Manufacturing_SOP_v1.2.pdf", size: "1.92 MB", version: "v1.2.0", type: "pdf", sourceModule: "SOP" },
    { id: "md-4", name: "Inspection_Plan_v1.2.pdf", size: "1.36 MB", version: "v1.2.0", type: "pdf", sourceModule: "QA" },
    { id: "md-5", name: "Process_Flow_Diagram_v1.2.pdf", size: "1.75 MB", version: "v1.2.0", type: "pdf", sourceModule: "Process" },
    { id: "md-6", name: "Packaging_Specification_v1.2.pdf", size: "1.28 MB", version: "v1.2.0", type: "pdf", sourceModule: "Packaging" },
  ],
  manufacturingScore: 90,

  // Section 4: Quality & Compliance Documentation List
  qualityComplianceDocs: [
    { id: "qd-1", name: "Quality_Plan_v1.2.pdf", size: "1.63 MB", version: "v1.2.0", type: "pdf", sourceModule: "Quality Plan" },
    { id: "qd-2", name: "Test_Reports_v1.2.zip", size: "12.4 MB", version: "v1.2.0", type: "zip", sourceModule: "Testing & Validation" },
    { id: "qd-3", name: "Validation_Reports_v1.2.pdf", size: "3.22 MB", version: "v1.2.0", type: "pdf", sourceModule: "Testing & Validation" },
    { id: "qd-4", name: "Risk_Assessment_v1.2.pdf", size: "1.78 MB", version: "v1.2.0", type: "pdf", sourceModule: "Cybersecurity & Risk" },
    { id: "qd-5", name: "Compliance_Matrix_v1.2.xlsx", size: "0.96 MB", version: "v1.2.0", type: "xlsx", sourceModule: "Certification Readiness" },
    { id: "qd-6", name: "Certification_Records_v1.2.pdf", size: "2.14 MB", version: "v1.2.0", type: "pdf", sourceModule: "Certification Readiness" },
  ],
  qualityComplianceScore: 89,

  // Section 5: Customer Documentation List
  customerDocs: [
    { id: "cd-1", name: "User_Manual_v1.2.pdf", size: "3.45 MB", version: "v1.2.0", type: "pdf", sourceModule: "Technical Authoring" },
    { id: "cd-2", name: "Installation_Guide_v1.2.pdf", size: "2.10 MB", version: "v1.2.0", type: "pdf", sourceModule: "Technical Authoring" },
    { id: "cd-3", name: "Service_Manual_v1.2.pdf", size: "4.20 MB", version: "v1.2.0", type: "pdf", sourceModule: "Field Service" },
    { id: "cd-4", name: "Maintenance_Manual_v1.2.pdf", size: "2.55 MB", version: "v1.2.0", type: "pdf", sourceModule: "Field Service" },
    { id: "cd-5", name: "Troubleshooting_Guide_v1.2.pdf", size: "1.65 MB", version: "v1.2.0", type: "pdf", sourceModule: "Support" },
    { id: "cd-6", name: "Warranty_Information_v1.2.pdf", size: "0.85 MB", version: "v1.2.0", type: "pdf", sourceModule: "Legal & Support" },
  ],
  customerScore: 91,

  // Section 6: Version Control & Change Management
  revisionNumber: "R2",
  ecr: "ECR-2024-0156",
  eco: "ECO-2024-0091",
  effectiveDate: "18 Jun 2024",
  changeStatus: "Active",
  revisionSummary: "Added updated mechanical drawings, revised BOM and updated test results.",
  versionControlScore: 88,

  // Section 7: AI Assessment
  aiCompletenessReview: "All required documents available.",
  aiMissingDocumentAnalysis: "No critical documents missing.",
  aiCrossReferenceValidation: "Cross references are consistent.",
  aiDocumentConsistencyReview: "No inconsistencies found.",
  aiImprovementSuggestions: "Add exploded view in user manual.",
  aiDocumentationScore: 90,

  // Section 8: Summary & Gauges
  overallDocumentationScore: 90,
  recommendation: "Ready for Product Release",

  // Section 9: Attachments Grid
  attachments: [
    { id: "att-1", name: "Technical_Construction_File.zip", size: "15.5 MB", type: "zip", uploadDate: "18 Jun 2024", category: "Technical File" },
    { id: "att-2", name: "Product_Images.zip", size: "8.2 MB", type: "zip", uploadDate: "18 Jun 2024", category: "Media" },
    { id: "att-3", name: "Certification_Package.zip", size: "6.4 MB", type: "zip", uploadDate: "18 Jun 2024", category: "Compliance" },
    { id: "att-4", name: "Supporting_Documents.zip", size: "5.1 MB", type: "zip", uploadDate: "18 Jun 2024", category: "General" },
    { id: "att-5", name: "CAD_Package.zip", size: "22.8 MB", type: "zip", uploadDate: "18 Jun 2024", category: "Engineering" },
    { id: "att-6", name: "Product_Videos.zip", size: "32.4 MB", type: "zip", uploadDate: "18 Jun 2024", category: "Media" },
    { id: "att-7", name: "AI_Documentation_Report.pdf", size: "2.7 MB", type: "pdf", uploadDate: "18 Jun 2024", category: "AI Report" },
  ],

  // Section 10: Review & Approval Table
  reviewers: [
    { id: "rev-1", role: "Documentation Engineer", person: "Rahul Sharma", decision: "Approved", date: "18 Jun 2024", comments: "All docs updated", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-2", role: "Engineering Manager", person: "Vikram Singh", decision: "Approved", date: "18 Jun 2024", comments: "Good", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-3", role: "QA Manager", person: "Nisha Verma", decision: "Approved", date: "18 Jun 2024", comments: "Compliant", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-4", role: "Compliance Manager", person: "Ananya Iyer", decision: "Approved with Conditions", date: "18 Jun 2024", comments: "Minor updates", avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-5", role: "Product Manager", person: "Rohit Nair", decision: "Pending", date: "-", comments: "Pending Review", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
    { id: "rev-6", role: "CTO", person: "Dr. Anil Patel", decision: "Pending", date: "-", comments: "Pending Review", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
  ],
  approvalDecision: "Approved with Conditions",
  reviewComments: "Please incorporate the AI suggestions and re-upload the updated documents.",
  approvalDate: "18 Jun 2024",

  // Section 11: System Information
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 10:15 AM",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "20 Jun 2024 04:25 PM",
  workflowStageLabel: "Documentation Review",
  auditTrail: [
    { id: "aud-1", timestamp: "18 Jun 2024 10:15 AM", user: "Rahul Sharma", action: "Record Created", details: "Product Documentation project DOC-2024-0087 created from Product Requirements & Engineering streams.", ipAddress: "192.168.1.42" },
    { id: "aud-2", timestamp: "18 Jun 2024 02:30 PM", user: "Nisha Verma", action: "Stage 1 Preparation", details: "Uploaded Engineering, Manufacturing & Customer documentation packages. Triggered AI assessment.", ipAddress: "192.168.1.55" },
    { id: "aud-3", timestamp: "19 Jun 2024 11:20 AM", user: "Vikram Singh", action: "Stage 2 Version Control", details: "Published document package v1.2.0. Updated product baseline in PLM.", ipAddress: "192.168.1.18" },
    { id: "aud-4", timestamp: "20 Jun 2024 04:25 PM", user: "Ananya Iyer", action: "Stage 3 Review Decision", details: "Documentation Review Board recorded 'Approved with Conditions' decision.", ipAddress: "192.168.1.91" },
  ],
} as any;

export const getProductDocumentationFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = withDefaults(DEFAULT_PRODUCT_DOCUMENTATION_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_PRODUCT_DOCUMENTATION_RECORD };
});

export const saveProductDocumentationDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ProductDocumentationFormInput> }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: (data.input as any).documentationProject ?? "",
      ownerName: (data.input as any).documentOwner?.name ?? "",
    };
    const result = (withDefaults(DEFAULT_PRODUCT_DOCUMENTATION_RECORD, await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } })) as any);
    return { success: true, data: result };
  });

export const submitProductDocumentationFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PRODUCT_DOCUMENTATION_RECORD.id;
    const result = (withDefaults(DEFAULT_PRODUCT_DOCUMENTATION_RECORD, await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } })) as any);
    return { success: true, data: result };
  });

export const reviewProductDocumentationFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ProductDocumentationApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = (withDefaults(DEFAULT_PRODUCT_DOCUMENTATION_RECORD, await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Documentation Review Board",
        reviewerName: "Ananya Iyer",
      },
    })) as any);
    return { success: true, data: result };
  });

export const advanceStageFn = createServerFn({ method: "POST" })
  .validator((data: { targetStage: 1 | 2 | 3 }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRODUCT_DOCUMENTATION_RECORD };
  });
