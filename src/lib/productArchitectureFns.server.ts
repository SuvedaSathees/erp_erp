import { createServerFn } from "@tanstack/react-start";
import type {
  ProductArchitectureApprovalDecision,
  ProductArchitectureFormInput,
  ProductArchitectureRecord,
  ProductArchitectureStage,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "product-architecture";

export function calculateProductArchitectureScores(input: Partial<ProductArchitectureFormInput>) {
  const componentsCount = input.systemComponents ? input.systemComponents.split(",").length : 4;
  const functionalCoverage = Math.min(100, Math.max(70, Math.round(72 + componentsCount * 4)));
  const hwSwPresent = (input.hardwarePlatform ? 15 : 0) + (input.softwarePlatform ? 15 : 0) + (input.processingUnit ? 10 : 0);
  const technicalReadiness = Math.min(100, Math.max(70, Math.round(55 + hwSwPresent * 0.7)));
  const securityRiskScore = input.securityRiskScore ?? 92;
  const securityReadiness = Math.min(100, Math.max(65, Math.round(securityRiskScore * 0.95 + 4)));
  const protocolsCount = input.communicationProtocols?.length || 4;
  const standardsCount = input.standardsCompliance?.length || 4;
  const integrationReadiness = Math.min(100, Math.max(68, Math.round(60 + protocolsCount * 3.5 + standardsCount * 3)));
  const performanceScore = input.performanceScore ?? 88;
  const overallArchitectureScore = Math.round(
    functionalCoverage * 0.25 + technicalReadiness * 0.25 + securityReadiness * 0.2 + integrationReadiness * 0.15 + performanceScore * 0.15
  );
  const aiArchitectureQuality = Math.min(99, Math.max(75, Math.round(overallArchitectureScore * 0.98 + 3)));
  const aiScalabilityScore = Math.min(98, Math.max(72, Math.round(overallArchitectureScore * 0.96 + 3)));
  const aiSecurityAssessment = Math.min(99, Math.max(78, Math.round(securityReadiness * 0.98 + 2)));
  const aiOverallArchitectureScore = Math.round(aiArchitectureQuality * 0.4 + aiScalabilityScore * 0.3 + aiSecurityAssessment * 0.3);

  return {
    summary: { overallArchitectureScore, functionalCoverage, technicalReadiness, securityReadiness, integrationReadiness, performanceScore },
    aiAssessment: {
      aiOverallArchitectureScore, aiArchitectureQuality, aiScalabilityScore, aiSecurityAssessment,
      aiTechnologyRecommendation: input.aiAssessment?.aiTechnologyRecommendation || "Use Edge AI for Anomaly Detection",
      aiIntegrationAssessment: input.aiAssessment?.aiIntegrationAssessment || "Seamless with Cloud & ERP",
      aiRiskAnalysis: input.aiAssessment?.aiRiskAnalysis || "Low Risk",
    },
    keyHighlights: ["Microservices based scalable architecture", "Edge + Cloud hybrid deployment", "Compliant with IEC 61851, OCPP 1.6J", "Security by Design with end-to-end encryption"],
  };
}

const currentRecordDefault: ProductArchitectureRecord = {
  id: "pa-rec-0017",
  architectureId: "PA-2024-0017",
  formCode: "PA-2024-25",
  architectureName: "Smart EV Charger Architecture",
  architectureVersion: "v1.0",
  status: "Under Review",
  currentStage: "executive_review",
  currentStageLabel: "Architecture Review",
  createdOn: "20 Apr 2024 10:15 AM",
  linkedPrdId: "PRD-2024-0017",
  linkedPrdTitle: "Smart EV Charger Pro PRD",
  linkedProductId: "prd-1001",
  linkedProductName: "Smart EV Charger Pro",
  linkedRoadmapId: "PRM-2024-0017",
  linkedRoadmapName: "EV Charger Roadmap 2024-27",
  businessUnit: "Smart Mobility Division",
  systemArchitectId: "usr-101",
  systemArchitectName: "Rohit Verma",
  systemArchitectAvatar: "",
  lastUpdated: "18 Jun 2024 04:25 PM",
  dateCreated: "20 Apr 2024 10:15 AM",
  lastModified: "18 Jun 2024 04:25 PM",
  version: "v1.0",
  stages: [],
  input: {} as any,
  ...calculateProductArchitectureScores({}),
  linkedSystemDesignId: null,
  auditTrail: [],
} as any;

export const getProductArchitectureFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  if (result) return { success: true, data: result };
  return { success: true, data: currentRecordDefault };
});

export const saveProductArchitectureDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: ProductArchitectureFormInput }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: data.input.architectureName ?? "",
      ownerName: data.input.systemArchitectName ?? "",
    };
    const result = await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } });
    return { success: true, data: result };
  });

export const advanceProductArchitectureStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: ProductArchitectureStage }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: currentRecordDefault };
  });

export const submitProductArchitectureFn = createServerFn({ method: "POST" })
  .validator((data?: string) => data)
  .handler(async ({ data }) => {
    const id = data || currentRecordDefault.id;
    const result = await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } });
    return { success: true, data: result };
  });

export const reviewProductArchitectureFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: ProductArchitectureApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "Executive Review Board",
        reviewerName: "Executive Review Board",
      },
    });
    return { success: true, data: result };
  });
