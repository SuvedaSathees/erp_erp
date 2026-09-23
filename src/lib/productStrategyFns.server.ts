import { createServerFn } from "@tanstack/react-start";
import type {
  ProductStrategyApprovalDecision,
  ProductStrategyFormInput,
  ProductStrategyRecord,
  ProductStrategyStage,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "product-strategy";

export function calculateProductStrategyScores(input: Partial<ProductStrategyFormInput>) {
  const segmentsCount = input.marketSegments?.length || 0;
  const targetCount = input.targetCustomers?.length || 0;
  const marketReadiness = Math.min(100, Math.round(40 + (segmentsCount * 12) + (targetCount * 10) + (input.competitivePositioning || 3) * 6));
  const techCount = input.emergingTechnologies?.length || 0;
  const energyCount = input.energyStrategy?.length || 0;
  const innovationScore = Math.min(100, Math.round(35 + (techCount * 15) + (energyCount * 10) + (input.esgAlignment || 4) * 6));
  const grossMargin = input.grossMargin || 42;
  const roi = input.roiYears || 3.2;
  const financialScore = Math.min(100, Math.round(Math.max(30, (grossMargin * 1.2) + Math.max(0, 30 - roi * 4) + ((input.revenueForecast || 50000000) > 20000000 ? 25 : 15))));
  const growthStar = input.growthPotential || 4.5;
  const visionLen = (input.productVision?.length || 50) > 30 ? 25 : 10;
  const strategicScore = Math.min(100, Math.round(25 + (growthStar * 12) + visionLen + (input.keyPartnerships?.length || 0) * 8));
  const overallScore = Math.round(marketReadiness * 0.25 + innovationScore * 0.25 + financialScore * 0.30 + strategicScore * 0.20);
  const aiMarketOpportunityScore = Math.min(98, Math.max(65, Math.round(marketReadiness * 0.95 + 5)));
  const aiProductDifferentiationScore = Math.min(99, Math.max(70, Math.round(innovationScore * 0.96 + 4)));
  const aiRevenuePredictionScore = Math.min(96, Math.max(60, Math.round(financialScore * 0.94 + 3)));
  const aiCompetitivePositionScore = Math.min(97, Math.max(68, Math.round(strategicScore * 0.97 + 2)));
  let aiRecommendation = "Proceed to Product Development";
  if (overallScore < 50) aiRecommendation = "Conduct Further Market Research";
  else if (overallScore < 75) aiRecommendation = "Optimize Revenue Strategy";

  return {
    sidebarSummary: { overallScore, marketReadiness, innovationScore, financialScore, strategicScore },
    aiAssessment: {
      aiMarketOpportunityScore, aiProductDifferentiationScore, aiRevenuePredictionScore, aiCompetitivePositionScore,
      aiStrategicRecommendations: "High alignment identified.",
      aiEmergingOpportunity: "Subscription software potential.",
      aiRiskPrediction: "Grid compliance approval cycle presents a delay.",
      aiRecommendation,
    },
    keyMetrics: {
      tam: input.marketOpportunitySize || 125000000,
      projectedRevenue: input.revenueForecast || 48000000,
      timeframe: "3-Year Horizon",
      grossMargin: input.grossMargin || 42.5,
      expectedRoi: Math.round(((input.revenueForecast || 48000000) / (input.investmentBudget3Y || 12000000)) * 100),
      breakevenMonths: input.breakevenPeriodMonths || 18,
      aiRecommendation,
    },
  };
}

const initialCalculated = calculateProductStrategyScores({});

let DEFAULT_PRODUCT_STRATEGY_RECORD: ProductStrategyRecord = {
  id: "ps-record-0017",
  strategyId: "PS-2024-0017",
  formCode: "PS-2024-08",
  strategyName: "Smart EV Charger Pro Strategy 2024-2027",
  status: "executive_review",
  currentStage: "executive_review",
  currentStageLabel: "Executive Review",
  linkedProductId: "prd-1001",
  linkedProductName: "Smart EV Charger Pro",
  linkedCommercializationId: "cmp-0015",
  linkedCommercializationCode: "CMP-2024-0015",
  linkedBusinessPlanId: "bp-0002",
  linkedBusinessPlanCode: "BP-2024-0002",
  strategyPeriodStart: "2024-04-01",
  strategyPeriodEnd: "2027-03-31",
  businessUnit: "Smart EV Infrastructure",
  productManagerId: "usr-104",
  productManagerName: "Vikram Sharma",
  productManagerAvatar: "",
  dateCreated: "2024-04-01",
  lastModified: new Date().toISOString().split("T")[0],
  stages: [],
  input: {} as any,
  aiAssessment: initialCalculated.aiAssessment,
  sidebarSummary: initialCalculated.sidebarSummary,
  keyMetrics: initialCalculated.keyMetrics,
  linkedProductRoadmapId: null,
  approvalDecision: null,
  approvalDate: null,
  reviewComments: null,
  auditTrail: [],
} as any;

export const getProductStrategyFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_PRODUCT_STRATEGY_RECORD };
});

export const saveProductStrategyDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: ProductStrategyFormInput }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: data.input.strategyName ?? "",
      ownerName: data.input.productManagerName ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const advanceProductStrategyStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: ProductStrategyStage }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRODUCT_STRATEGY_RECORD };
  });

export const submitProductStrategyFn = createServerFn({ method: "POST" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PRODUCT_STRATEGY_RECORD.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result };
  });

export const reviewProductStrategyFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ProductStrategyApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Product Strategy Committee",
        reviewerName: "Product Strategy Committee",
      },
    });
    return { success: true, data: result };
  });

export const generateProductStrategyReportFn = createServerFn({ method: "POST" })
  .validator((data: string) => data)
  .handler(async () => {
    return { success: true, data: { ...DEFAULT_PRODUCT_STRATEGY_RECORD, reportGeneratedAt: new Date().toISOString() } };
  });
