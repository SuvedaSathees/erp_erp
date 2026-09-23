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
  documentOwner: { name: "Rahul Sharma", avatar: "", email: "rahul.sharma@magnertia.com" },
  documentationEngineer: { name: "Nisha Verma", avatar: "", email: "nisha.verma@magnertia.com" },
  qualityManager: { name: "Vikram Singh", avatar: "", email: "vikram.singh@magnertia.com" },
  developmentStage: "Prototype Validation",
  confidentialityLevel: "Confidential",
  productName: "Smart EV Charger AC 7kW",
  productCategory: "AC EV Charger",
  documentTitle: "Smart EV Charger - Technical Dossier",
  documentType: "Technical Specification",
  businessPurpose: "Provide complete technical specifications, design details, and operational guidelines.",
  engineeringDocs: [],
  engineeringScore: 92,
  manufacturingDocs: [],
  manufacturingScore: 90,
  qualityComplianceDocs: [],
  qualityComplianceScore: 89,
  customerDocs: [],
  customerScore: 91,
  revisionNumber: "R2",
  ecr: "ECR-2024-0156",
  eco: "ECO-2024-0091",
  effectiveDate: "18 Jun 2024",
  changeStatus: "Active",
  revisionSummary: "Added updated mechanical drawings.",
  versionControlScore: 88,
  aiCompletenessReview: "All required documents available.",
  aiMissingDocumentAnalysis: "No critical documents missing.",
  aiCrossReferenceValidation: "Cross references are consistent.",
  aiDocumentConsistencyReview: "No inconsistencies found.",
  aiImprovementSuggestions: "Add exploded view in user manual.",
  aiDocumentationScore: 90,
  overallDocumentationScore: 90,
  recommendation: "Ready for Product Release",
  attachments: [],
  reviewers: [],
  approvalDecision: "Approved with Conditions",
  reviewComments: "Please incorporate the AI suggestions.",
  approvalDate: "18 Jun 2024",
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 10:15 AM",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "20 Jun 2024 04:25 PM",
  workflowStageLabel: "Documentation Review",
  auditTrail: [],
} as any;

export const getProductDocumentationFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
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
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitProductDocumentationFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PRODUCT_DOCUMENTATION_RECORD.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result };
  });

export const reviewProductDocumentationFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ProductDocumentationApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Documentation Review Board",
        reviewerName: "Ananya Iyer",
      },
    });
    return { success: true, data: result };
  });

export const advanceStageFn = createServerFn({ method: "POST" })
  .validator((data: { targetStage: 1 | 2 | 3 }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRODUCT_DOCUMENTATION_RECORD };
  });
