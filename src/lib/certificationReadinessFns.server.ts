import { createServerFn } from "@tanstack/react-start";
import type {
  CertificationApprovalDecision,
  CertificationFormInput,
  CertificationReadinessRecord,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "certification-readiness";

export function calculateReadinessScores(input: Partial<CertificationFormInput>) {
  const doc = 88;
  const testing = 90;
  const compliance = 84;
  const lab = 85;
  const ai = 89;
  const overall = Math.round(doc * 0.2 + testing * 0.25 + compliance * 0.25 + lab * 0.15 + ai * 0.15);
  return { documentationScore: doc, testingScore: testing, complianceScore: compliance, laboratoryScore: lab, aiScore: ai, overallReadinessScore: overall, certificationProbabilityPct: 92 };
}

export const DEFAULT_RECORD: CertificationReadinessRecord = {
  id: "cr-rec-0041",
  certificationReadinessId: "CR-2024-0041",
  formCode: "CRF-2024-25",
  certificationProjectName: "Smart EV Charger Certification",
  certificationVersion: "v1.2.0",
  workflowStatus: "In Progress",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  linkedProductId: "Smart EV Charger AC 7kW",
  linkedTestingId: "TV-2024-0075",
  complianceManagerName: "Rahul Sharma",
  complianceManagerAvatar: "",
  certificationCoordinatorName: "Ananya Iyer",
  certificationCoordinatorAvatar: "",
  targetMarkets: ["India", "EU", "USA"],
  regulatoryAuthorities: ["BIS", "IEC", "CE", "FCC"],
  developmentStage: "Prototype Validation",
  priority: "High",
  productCategory: "EV Charger",
  certificationObjective: "Obtain mandatory certifications for global market launch.",
  documentationScore: 88,
  testingScore: 90,
  complianceScore: 84,
  laboratoryScore: 85,
  aiScore: 89,
  overallReadinessScore: 88,
  certificationProbabilityPct: 92,
  standardsList: [],
  documentsList: [],
  labConfig: {} as any,
  complianceConfig: {} as any,
  aiAssessment: {} as any,
  readinessSummary: { documentationScore: 88, testingScore: 90, complianceScore: 84, laboratoryScore: 85, aiScore: 89, overallReadinessScore: 88, certificationProbabilityPct: 92, recommendation: "Ready for Certification Submission" },
  attachments: [],
  reviewers: [],
  approvalDecision: "Approved with Conditions",
  approvalDate: "20 Jun 2024",
  reviewComments: "Please close the remaining CAPAs.",
  auditTrail: [],
} as any;

export { DEFAULT_RECORD };

export const getCertificationReadinessFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: CertificationReadinessRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_RECORD };
  }
);

export const saveCertificationReadinessDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<CertificationFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: CertificationReadinessRecord }> => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: (data.input as any).certificationProjectName ?? "",
      ownerName: (data.input as any).complianceManagerName ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitCertificationReadinessFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: CertificationReadinessRecord }> => {
    const id = data || DEFAULT_RECORD.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result as any };
  });

export const reviewCertificationReadinessFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: CertificationApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: CertificationReadinessRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Compliance Board",
        reviewerName: "Rahul Sharma",
      },
    });
    return { success: true, data: result as any };
  });
