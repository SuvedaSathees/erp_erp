import { createServerFn } from "@tanstack/react-start";
import type {
  TestingApprovalDecision,
  TestingFormInput,
  TestingValidationRecord,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "testing-validation";

export function calculateQualityScores(input: Partial<TestingFormInput>) {
  const functional = 90;
  const reliability = 92;
  const compliance = 93;
  const validation = 89;
  const overallScore = Math.round(functional * 0.25 + reliability * 0.25 + compliance * 0.25 + validation * 0.25);
  return { functionalScore: functional, reliabilityScore: reliability, complianceScore: compliance, validationScore: validation, overallQualityScore: overallScore };
}

export const DEFAULT_RECORD: TestingValidationRecord = {
  id: "tv-rec-0075",
  testingValidationId: "TV-2024-0075",
  formCode: "TVF-2024-25",
  testProjectName: "Smart EV Charger Validation",
  testVersion: "v1.2.0",
  workflowStatus: "In Progress",
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-20T16:25:00Z",
  lastUpdated: "20 Jun 2024 04:25 PM",
  linkedProductId: "Smart EV Charger AC 7kW",
  linkedPrototypeId: "PRT-2024-0032",
  linkedSimulationId: "SIM-2024-0061",
  testEngineerName: "Rahul Sharma",
  testEngineerAvatar: "",
  qaEngineerName: "Nisha Verma",
  qaEngineerAvatar: "",
  testEnvironment: "Laboratory",
  developmentStage: "Prototype Validation",
  priority: "High",
  productName: "Smart EV Charger AC 7kW",
  testObjective: "Validate product performance, safety, reliability and compliance.",
  productCategory: "EV Charging System",
  testScope: "Hardware, Firmware, Software, Safety, EMC, Environment",
  functionalScore: 90,
  reliabilityScore: 92,
  complianceScore: 93,
  validationScore: 89,
  overallQualityScore: 91,
  planningConfig: {} as any,
  prototypeEquipmentConfig: {} as any,
  functionalConfig: {} as any,
  performanceConfig: {} as any,
  safetyComplianceConfig: {} as any,
  resultsConfig: {} as any,
  aiAssessment: {} as any,
  readinessSummary: { functionalScore: 90, reliabilityScore: 92, complianceScore: 93, validationScore: 89, overallQualityScore: 91, recommendation: "Proceed to Product Certification" },
  attachments: [],
  reviewers: [],
  approvalDecision: "Approved with Conditions",
  approvalDate: "20 Jun 2024",
  reviewComments: "Minor improvements suggested.",
  auditTrail: [],
} as any;

export { DEFAULT_RECORD };

export const getTestingValidationFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ success: boolean; data: TestingValidationRecord }> => {
    const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
    if (result) return { success: true, data: result as any };
    return { success: true, data: DEFAULT_RECORD };
  }
);

export const saveTestingValidationDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<TestingFormInput> }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: TestingValidationRecord }> => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: (data.input as any).testProjectName ?? "",
      ownerName: (data.input as any).testEngineerName ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result as any };
  });

export const submitTestingValidationFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: TestingValidationRecord }> => {
    const id = data || DEFAULT_RECORD.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result as any };
  });

export const reviewTestingValidationFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: TestingApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }): Promise<{ success: boolean; data: TestingValidationRecord }> => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "QA Review Board",
        reviewerName: "Rahul Sharma",
      },
    });
    return { success: true, data: result as any };
  });
