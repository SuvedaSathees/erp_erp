import { createServerFn } from "@tanstack/react-start";
import type {
  ProductReleaseApprovalDecision,
  ProductReleaseFormInput,
  ProductReleaseRecord,
  ProductReleaseStatus,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "product-release";

export function calculateReleaseScores(record: Partial<ProductReleaseRecord>) {
  const engScore = record.engineeringScore ?? 92;
  const mfgScore = record.manufacturingScore ?? 90;
  const comScore = record.commercialScore ?? 88;
  const riskScore = record.riskScore ?? 80;
  const depScore = record.deploymentScore ?? 89;
  const aiScore = record.aiReleaseScore ?? 91;
  const overallScore = Math.round(engScore * 0.25 + mfgScore * 0.25 + comScore * 0.20 + riskScore * 0.15 + depScore * 0.15);
  return { engineeringScore: engScore, manufacturingScore: mfgScore, commercialScore: comScore, riskScore, deploymentScore: depScore, aiReleaseScore: aiScore, overallReleaseScore: overallScore };
}

export const DEFAULT_PRODUCT_RELEASE_RECORD: ProductReleaseRecord = {
  id: "rel-rec-0053",
  releaseId: "REL-2024-0053",
  formCode: "RLF-2024-25",
  releaseProjectName: "Smart EV Charger Launch",
  releaseVersion: "v1.2.0",
  workflowStatus: "In Progress",
  stage: 2,
  createdOn: "18 Jun 2024 10:15 AM",
  dateCreated: "2024-06-18T10:15:00Z",
  lastModified: "2024-06-19T11:20:00Z",
  lastUpdated: "19 Jun 2024 11:20 AM",
  linkedProduct: { id: "PRD-EV-7KW", name: "Smart EV Charger AC 7kW" },
  linkedDocumentation: { id: "DOC-2024-0087", code: "DOC-2024-0087" },
  releaseManager: { name: "Rahul Sharma", avatar: "", email: "rahul.sharma@magnertia.com" },
  plannedReleaseDate: "30 Jun 2024",
  releaseType: "Production Release",
  releasePriority: "High",
  productName: "Smart EV Charger AC 7kW",
  productCategory: "AC EV Charger",
  releaseName: "Smart EV Charger v1.2 Launch",
  releaseObjective: "Official launch of Smart EV Charger AC 7kW v1.2.",
  targetMarkets: ["India", "EU", "USA", "MEA"],
  engineeringChecklist: [],
  engineeringScore: 92,
  manufacturingChecklist: [],
  manufacturingScore: 90,
  commercialChecklist: [],
  productPricing: "₹ 23,999.00",
  commercialScore: 88,
  releaseChannels: ["Direct Sales", "Dealer Network", "E-Commerce"],
  deploymentRegions: ["India", "EU", "USA"],
  distributionPartner: "EV Distributors Pvt. Ltd.",
  inventoryAvailable: 2450,
  inventoryUnits: "Units",
  rolloutStrategy: "Phased Rollout",
  deploymentScore: 89,
  openRisksCount: 3,
  criticalRisksCount: 1,
  capaClosed: true,
  regulatoryApproval: true,
  warrantyPolicyApproved: true,
  riskScore: 80,
  aiReleaseReadinessReview: "Good",
  aiDeploymentRiskAnalysis: "Low",
  aiCommercialReadiness: "High",
  aiLaunchRecommendation: "Proceed with Launch",
  aiImprovementSuggestions: "2 Suggestions available.",
  aiReleaseScore: 91,
  overallReleaseScore: 88,
  recommendation: "Ready for Product Launch",
  attachments: [],
  reviewers: [],
  approvalDecision: "Approved",
  reviewComments: "All departments are aligned.",
  approvalDate: "19 Jun 2024",
  createdBy: "Rahul Sharma",
  createdDate: "18 Jun 2024 10:15 AM",
  lastModifiedBy: "Rahul Sharma",
  lastModifiedDate: "19 Jun 2024 11:20 AM",
  commercialDate: "19 Jun 2024 11:20 AM",
  workflowStageLabel: "Executive Review",
  releaseTimeline: [],
  auditTrail: [],
} as any;

export const getProductReleaseFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_PRODUCT_RELEASE_RECORD };
});

export const saveProductReleaseDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: Partial<ProductReleaseFormInput> }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: (data.input as any).releaseProjectName ?? "",
      ownerName: (data.input as any).releaseManager?.name ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const submitProductReleaseFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PRODUCT_RELEASE_RECORD.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result };
  });

export const reviewProductReleaseFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ProductReleaseApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Executive Board",
        reviewerName: "Sankaran R.",
      },
    });
    return { success: true, data: result };
  });

export const advanceReleaseStageFn = createServerFn({ method: "POST" })
  .validator((data: { targetStage: 1 | 2 | 3 }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRODUCT_RELEASE_RECORD };
  });

export const toggleChecklistItemFn = createServerFn({ method: "POST" })
  .validator((data: { section: "engineering" | "manufacturing" | "commercial"; itemId: string }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRODUCT_RELEASE_RECORD };
  });
