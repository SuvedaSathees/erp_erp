import { createServerFn } from "@tanstack/react-start";
import type {
  ProductRoadmapApprovalDecision,
  ProductRoadmapFormInput,
  ProductRoadmapRecord,
  ProductRoadmapStage,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "product-roadmap";

export function calculateProductRoadmapScores(input: Partial<ProductRoadmapFormInput>) {
  const completedReleases = input.releases?.filter((r) => r.status === "completed").length || 0;
  const totalReleases = input.releases?.length || 4;
  const strategicProgress = Math.min(100, Math.round(55 + (completedReleases / totalReleases) * 35));
  const featuresCount = input.features?.length || 4;
  const productReadiness = Math.min(100, Math.round(60 + featuresCount * 6));
  const techHighCount = input.techInitiatives?.filter((t) => t.readiness === "High").length || 1;
  const innovationProgress = Math.min(100, Math.round(50 + techHighCount * 18));
  const utilPct = input.budgetUtilizationPct || 82;
  const budgetHealth = Math.min(100, Math.round(Math.max(40, 100 - Math.abs(utilPct - 85) * 2)));
  const overallScore = Math.round(strategicProgress * 0.3 + productReadiness * 0.25 + innovationProgress * 0.25 + budgetHealth * 0.2);
  const riskScore = input.risks?.overallScore || 32;
  const aiReleasePriorityScore = Math.min(98, Math.max(70, Math.round(overallScore * 0.95 + 6)));
  const aiRoadmapConfidenceScore = Math.min(99, Math.max(68, Math.round(overallScore * 0.96 + 5)));

  return {
    sidebarSummary: { overallScore, strategicProgress, productReadiness, innovationProgress, budgetHealth },
    businessImpact: {
      projectedRevenue: (input.devBudget || 45000000) * 15,
      revenueYoYDelta: "+34.5% vs FY24",
      grossMarginPct: 44.5,
      marginYoYDelta: "+2.8% expansion",
      marketSharePct: 28.5,
      marketShareYoYDelta: "+6.2% gain",
    },
    aiInsights: {
      aiReleasePriorityScore,
      aiRevenueForecast: (input.devBudget || 45000000) * 15,
      aiRoadmapConfidenceScore,
      aiRecommendations: ["Accelerate v2.2 DC Fast Charger beta deployment.", "Resource allocation on V2G is optimal.", "Grid interconnect regulatory approval risk."],
    },
  };
}

const initialCalculated = calculateProductRoadmapScores({});

let DEFAULT_PRODUCT_ROADMAP_RECORD: ProductRoadmapRecord = {
  id: "prm-record-0017",
  roadmapId: "PRM-2024-0017",
  formCode: "PRM-2024-08",
  roadmapName: "Smart EV Charger Pro Product Roadmap (2024-2027)",
  status: "executive_review",
  currentStage: "executive_review",
  currentStageLabel: "Executive Review",
  linkedStrategyId: "PS-2024-0017",
  linkedStrategyName: "Smart EV Charger Pro Strategy 2024-2027",
  linkedProductId: "prd-1001",
  linkedProductName: "Smart EV Charger Pro",
  productLine: "Ultra-Fast Commercial Series",
  businessUnit: "Smart EV Infrastructure",
  productManagerId: "usr-104",
  productManagerName: "Vikram Sharma",
  productManagerAvatar: "",
  roadmapPeriodStart: "2024-04-01",
  roadmapPeriodEnd: "2027-03-31",
  dateCreated: "2024-04-20",
  lastModified: new Date().toISOString().split("T")[0],
  version: "v1.4",
  stages: [],
  input: {} as any,
  aiInsights: initialCalculated.aiInsights,
  sidebarSummary: initialCalculated.sidebarSummary,
  businessImpact: initialCalculated.businessImpact,
  linkedReleasePlanId: null,
  approvalDecision: null,
  approvalDate: null,
  reviewComments: null,
  auditTrail: [],
} as any;

export const getProductRoadmapFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_PRODUCT_ROADMAP_RECORD };
});

export const saveProductRoadmapDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: ProductRoadmapFormInput }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: data.input.roadmapName ?? "",
      ownerName: data.input.productManagerName ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const advanceProductRoadmapStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: ProductRoadmapStage }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRODUCT_ROADMAP_RECORD };
  });

export const submitProductRoadmapFn = createServerFn({ method: "POST" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PRODUCT_ROADMAP_RECORD.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result };
  });

export const reviewProductRoadmapFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ProductRoadmapApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Roadmap Review Committee",
        reviewerName: "Roadmap Review Committee",
      },
    });
    return { success: true, data: result };
  });
