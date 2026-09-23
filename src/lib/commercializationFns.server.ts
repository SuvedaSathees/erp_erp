import { createServerFn } from "@tanstack/react-start";
import type {
  CommercializationAIAnalytics,
  CommercializationApprovalDecision,
  CommercializationFormInput,
  CommercializationListRow,
  CommercializationLookups,
  CommercializationRecord,
  CommercializationStage,
  CommercializationStatus,
  CommercializationSummary,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "commercialization";

const DEFAULT_COMMERCIALIZATION_RECORD: CommercializationRecord = {
  id: "cmp-record-0021",
  commercializationPlanId: "CMP-2024-0021",
  formCode: "CMP-2024-15",
  commercializationProject: "Autonomous Docking System Commercialization Plan",
  status: "executive_review",
  currentStage: "executive_review",
  currentStageLabel: "Executive Review",
  version: "1.0",
  businessUnit: "Smart Mobility Division",
  commercializationManager: "Rohit Verma",
  launchTargetDate: "2024-11-15",
  stages: [
    { stage: "product_readiness", label: "Product Readiness", completed: true, active: false, completedAt: "2024-05-12" },
    { stage: "manufacturing_supply_chain", label: "Manufacturing & Supply Chain", completed: true, active: false, completedAt: "2024-05-18" },
    { stage: "sales_marketing_planning", label: "Sales & Marketing Planning", completed: true, active: false, completedAt: "2024-05-25" },
    { stage: "executive_review", label: "Executive Review", completed: false, active: true },
  ],
  productOverview: { productName: "Autonomous EV Docking System Pro", productCategory: "Automotive & Charging Infrastructure", productDescription: "Next-gen autonomous robotic EV charging interface.", targetIndustry: "Electric Mobility / EV Infrastructure", targetCustomers: ["EV Charging Operators", "Fleet Owners", "Automotive OEMs"], valueProposition: "Reduces EV docking time by 75%.", competitiveAdvantage: "Patented multi-sensor fusion algorithms." },
  marketAnalysis: { tamAmount: 450000000, samAmount: 180000000, somAmount: 65000000, customerSegments: "Commercial EV fleet operators.", competitorAnalysis: "Primary competitors offer manual plug-in systems.", marketEntryStrategy: "Direct Enterprise Sales + OEM Licensing", demandForecast5Yr: 185000000 },
  productReadiness: { inheritedTrl: "TRL 6", inheritedMrl: "MRL 4", certificationStatus: "Fully Certified", regulatoryCompliance: "ISO 26262 & CE Compliant", productValidationStatus: "Field Validated", productionReadiness: "Pilot Line Ready", launchReadinessScore: 82 },
  manufacturingSupplyChain: { manufacturingStrategy: "Contract Manufacturing (CM)", productionCapacityAnnual: "2,500 Units / Year", contractManufacturer: "Flextronics", keySuppliers: ["TI", "Sony", "Bosch"], procurementStatus: "Component Sourced", inventoryReadiness: "Safety Stock Established", distributionNetwork: "Regional logistics hubs." },
  financialPlanning: { initialInvestment: 45000000, manufacturingCostPerUnit: 180000, sellingPricePerUnit: 350000, revenueProjection5Yr: 245000000, breakEvenPeriodMonths: 18, grossMarginPct: 48.57, roiPct: 185 },
  salesMarketing: { salesModel: "B2B Enterprise Direct", pricingStrategy: "Value-Based Pricing", marketingChannels: ["Industry Expos", "Digital ABM"], distributionChannels: ["Direct Sales Force", "OEM Integrators"], brandingStrategy: "Premier autonomous charging interface.", launchCampaign: "Global unveiling at EV Tech Expo.", customerSupportStrategy: "24/7 SLA-backed monitoring." },
  partnerships: { strategicPartners: ["Tata Motors", "ABB"], technologyPartners: ["NVIDIA", "Qualcomm"], manufacturingPartners: ["Foxconn", "Flex"], channelPartners: ["Siemens", "Schneider"], governmentSupport: ["FAME II Grant"], investors: ["Sequoia Climate Tech"], partnershipStatus: "MoU Executed" },
  riskAssessment: { technicalRisk: 2, marketRisk: 2, financialRisk: 3, operationalRisk: 2, regulatoryRisk: 2, overallRiskScore: 32, riskMitigationPlan: "Multi-sourcing and Tier-1 CM partners." },
  aiAnalytics: { aiMarketOpportunityScore: 88, aiLaunchReadinessScore: 82, aiRevenueForecast5Yr: 268000000, aiCustomerAdoptionPredictionPct: 76, aiCompetitivePositionScore: 84, aiGrowthStrategy: "Accelerate B2B partnerships.", aiRecommendations: "Proceed to product launch." },
  summary: { productReadinessScore: 82, marketReadinessScore: 88, financialReadinessScore: 85, commercializationScore: 84, riskControlScore: 68, overallLaunchReadiness: 81, recommendedAction: "Proceed to Product Launch", recommendationText: "Proceed to Product Launch" },
  attachments: [],
  reviewRows: [
    { role: "Commercialization Manager", person: "Rohit Verma", decision: "Approved", status: "Approved", date: "15 May 2024" },
    { role: "Product Manager", person: "Neha Sharma", decision: "Approved", status: "Approved", date: "18 May 2024" },
    { role: "R&D Director", person: "Vikram Singh", decision: "Approved", status: "Approved", date: "22 May 2024" },
    { role: "Operations Head", person: "Arjun Mehta", decision: "Pending", status: "In Review", date: "-" },
    { role: "CTO", person: "Dr. Anil Patel", decision: "Pending", status: "Pending", date: "-" },
  ],
  approvalDecision: null, reviewComments: null, approvalDate: null,
  linkedProductLaunchProjectId: null, linkedProductLaunchProjectCode: null,
  createdBy: "Rohit Verma", createdAt: "2024-05-10 09:30 AM", lastModifiedBy: "Rohit Verma", updatedAt: "2024-05-25 04:45 PM",
  auditTrail: [
    { id: "aud-1", timestamp: "2024-05-10 09:30 AM", actor: "Rohit Verma", event: "Created Commercialization Plan CMP-2024-0021", kind: "workflow" },
    { id: "aud-4", timestamp: "2024-05-25 04:45 PM", actor: "Rohit Verma", event: "Submitted for Executive Review", kind: "workflow" },
  ],
} as any;

function computeDerivedFinancialsAndScores(input: CommercializationFormInput): {
  grossMarginPct: number; roiPct: number; aiAnalytics: CommercializationAIAnalytics; summary: CommercializationSummary;
} {
  const fp = input.financialPlanning;
  const cost = fp.manufacturingCostPerUnit || 1;
  const price = fp.sellingPricePerUnit || 1;
  const inv = fp.initialInvestment || 1;
  const rev = fp.revenueProjection5Yr || 0;
  const grossMarginPct = price > 0 ? Number((((price - cost) / price) * 100).toFixed(2)) : 0;
  const roiPct = inv > 0 ? Math.round(((rev - inv) / inv) * 100) : 0;
  const ra = input.riskAssessment;
  const riskStarsAvg = (ra.technicalRisk + ra.marketRisk + ra.financialRisk + ra.operationalRisk + ra.regulatoryRisk) / 5;
  const computedRiskScore = Math.round((riskStarsAvg / 5) * 60 + 10);
  const riskControlScore = 100 - computedRiskScore;
  const productReadinessScore = input.productReadiness.launchReadinessScore || 82;
  const marketReadinessScore = 88;
  const financialReadinessScore = Math.min(98, Math.max(50, Math.round(grossMarginPct * 1.2 + roiPct / 10)));
  const commercializationScore = Math.round((productReadinessScore + marketReadinessScore + financialReadinessScore) / 3);
  const overallLaunchReadiness = Math.round(productReadinessScore * 0.3 + marketReadinessScore * 0.25 + financialReadinessScore * 0.25 + riskControlScore * 0.2);

  return {
    grossMarginPct, roiPct,
    aiAnalytics: {
      aiMarketOpportunityScore: Math.min(99, Math.round(marketReadinessScore * 1.02)),
      aiLaunchReadinessScore: overallLaunchReadiness,
      aiRevenueForecast5Yr: Math.round(rev * 1.09),
      aiCustomerAdoptionPredictionPct: 76,
      aiCompetitivePositionScore: 84,
      aiGrowthStrategy: "Accelerate B2B enterprise partnerships and expand OEM co-development.",
      aiRecommendations: "Proceed to product launch with pilot fleet partners.",
    },
    summary: {
      productReadinessScore, marketReadinessScore, financialReadinessScore, commercializationScore,
      riskControlScore, overallLaunchReadiness,
      recommendedAction: "Proceed to Product Launch",
      recommendationText: "Proceed to Product Launch",
    },
  };
}

async function getOrDefault(): Promise<CommercializationRecord> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_COMMERCIALIZATION_RECORD;
}

async function saveRecord(record: any): Promise<CommercializationRecord> {
  const r = {
    ...record,
    projectName: record.commercializationProject ?? "",
    ownerName: record.commercializationManager ?? "Rohit Verma",
    recordCode: record.id ?? record.commercializationPlanId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getCommercializationLookupsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CommercializationLookups> => {
    return {
      productCategories: ["Automotive & Charging Infrastructure", "Industrial Automation", "Clean Energy Systems", "Autonomous Robotics"],
      targetIndustries: ["Electric Mobility / EV Infrastructure", "Commercial Fleet Logistics", "Smart Municipal Transit", "Industrial Ports & Warehousing"],
      marketEntryStrategies: ["Direct Enterprise Sales + OEM Licensing", "Pilot Fleet Deployment", "Channel Partner Distribution", "Joint Venture Launch"],
      certificationStatuses: ["Fully Certified", "In Certification Review", "Testing Phase", "Pending Filing"],
      regulatoryCompliances: ["ISO 26262 & CE Compliant", "Partially Compliant", "Under Audit", "Self-Certified"],
      productValidationStatuses: ["Field Validated", "Lab Validated", "In Field Testing", "Specification Stage"],
      productionReadinesses: ["Pilot Line Ready", "Tooling In Progress", "Prototype Stage", "Mass Production Certified"],
      manufacturingStrategies: ["Contract Manufacturing (CM)", "In-House Assembly", "Hybrid Production", "Licensed Third-Party"],
      procurementStatuses: ["Component Sourced", "Long Lead Items Ordered", "RFQs In Review", "Full Supply Chain Secured"],
      inventoryReadinesses: ["Safety Stock Established", "Buffer Stock In Transit", "Pre-production Sourced", "Just-In-Time Setup"],
      salesModels: ["B2B Enterprise Direct", "B2B2C Platform", "Direct & Channel Hybrid", "Hardware-as-a-Service (HaaS)"],
      pricingStrategies: ["Value-Based Pricing", "Cost-Plus Margin", "Tiered Subscription + Hardware", "Competitive Skimming"],
      partnershipStatuses: ["MoU Executed", "Definitive Agreement", "In Negotiation", "Active Partnership"],
      businessUnits: ["Smart Mobility Division", "Robotics & Mechatronics", "Clean Energy Solutions", "Advanced R&D Center"],
      commercializationManagers: ["Rohit Verma", "Neha Sharma", "Vikram Singh", "Amitabh Shah", "Arjun Mehta", "Dr. Anil Patel"],
      recommendedActions: ["Proceed to Product Launch", "Refine Go-to-Market Strategy", "Expand Pilot Testing", "Hold / Re-evaluate Strategy"],
    };
  },
);

export const getCommercializationListFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CommercializationListRow[]> => {
    const records = await listDevelopmentRecordsFn({ data: { moduleType: MODULE_TYPE } });
    if (records.length > 0) {
      return records.map((r: any) => ({
        id: r.id, commercializationPlanId: r.commercializationPlanId ?? r.recordCode,
        commercializationProject: r.commercializationProject ?? r.projectName,
        productName: r.productOverview?.productName ?? "",
        status: r.status ?? r.workflowStatus,
        overallLaunchReadiness: r.summary?.overallLaunchReadiness ?? 0,
        roiPct: r.financialPlanning?.roiPct ?? 0,
        launchTargetDate: r.launchTargetDate ?? "", updatedAt: r.updatedAt ?? "",
      }));
    }
    const d: any = DEFAULT_COMMERCIALIZATION_RECORD;
    return [{
      id: d.id, commercializationPlanId: d.commercializationPlanId,
      commercializationProject: d.commercializationProject,
      productName: d.productOverview.productName, status: d.status,
      overallLaunchReadiness: d.summary.overallLaunchReadiness,
      roiPct: d.financialPlanning.roiPct, launchTargetDate: d.launchTargetDate, updatedAt: d.updatedAt,
    }];
  },
);

export const getCommercializationFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async (): Promise<CommercializationRecord> => {
    return await getOrDefault();
  });

export const saveCommercializationDraftFn = createServerFn({ method: "POST" })
  .validator((d: { id?: string; input: CommercializationFormInput }) => d)
  .handler(async ({ data: { id, input } }): Promise<CommercializationRecord> => {
    const existing = await getOrDefault();
    const { grossMarginPct, roiPct, aiAnalytics, summary } = computeDerivedFinancialsAndScores(input);
    const updated = {
      ...existing,
      commercializationProject: input.commercializationProject,
      businessUnit: input.businessUnit,
      commercializationManager: input.commercializationManager,
      launchTargetDate: input.launchTargetDate,
      linkedProductId: input.linkedProductId ?? (existing as any).linkedProductId,
      linkedTechnologyId: input.linkedTechnologyId ?? (existing as any).linkedTechnologyId,
      linkedPatentId: input.linkedPatentId ?? (existing as any).linkedPatentId,
      linkedBusinessCaseId: input.linkedBusinessCaseId ?? (existing as any).linkedBusinessCaseId,
      productOverview: input.productOverview,
      marketAnalysis: input.marketAnalysis,
      productReadiness: input.productReadiness,
      manufacturingSupplyChain: input.manufacturingSupplyChain,
      financialPlanning: { ...input.financialPlanning, grossMarginPct, roiPct },
      salesMarketing: input.salesMarketing,
      partnerships: input.partnerships,
      riskAssessment: input.riskAssessment,
      aiAnalytics, summary,
      attachments: input.attachments,
      lastModifiedBy: "Rohit Verma",
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });

export const completeCommercializationStageFn = createServerFn({ method: "POST" })
  .validator((d: { id: string; stage: CommercializationStage }) => d)
  .handler(async ({ data: { id, stage } }): Promise<CommercializationRecord> => {
    const existing: any = await getOrDefault();
    const stageOrder: CommercializationStage[] = ["product_readiness", "manufacturing_supply_chain", "sales_marketing_planning", "executive_review"];
    const idx = stageOrder.indexOf(stage);
    const nextStage = idx < stageOrder.length - 1 ? stageOrder[idx + 1] : stage;
    const newStages = (existing.stages ?? []).map((st: any) => {
      if (st.stage === stage) return { ...st, completed: true, active: false, completedAt: new Date().toISOString().substring(0, 10) };
      if (st.stage === nextStage) return { ...st, active: true };
      return st;
    });
    const updated = {
      ...existing,
      currentStage: nextStage,
      currentStageLabel: newStages.find((s: any) => s.stage === nextStage)?.label || nextStage,
      status: nextStage as CommercializationStatus,
      stages: newStages,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });

export const submitCommercializationFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async (): Promise<CommercializationRecord> => {
    const existing: any = await getOrDefault();
    const updated = {
      ...existing,
      status: "executive_review",
      currentStage: "executive_review",
      currentStageLabel: "Executive Review",
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });

export const reviewCommercializationFn = createServerFn({ method: "POST" })
  .validator((d: { id: string; decision: CommercializationApprovalDecision; comments?: string; approvalDate?: string }) => d)
  .handler(async ({ data: { id, decision, comments, approvalDate } }): Promise<CommercializationRecord> => {
    const existing: any = await getOrDefault();
    const now = approvalDate || new Date().toISOString().substring(0, 10);
    let nextStatus: CommercializationStatus = "executive_review";
    let launchId: string | undefined;
    let launchCode: string | undefined;

    if (decision === "Approved") {
      nextStatus = "approved";
      launchId = `launch-${Date.now()}`;
      launchCode = "PRJ-LAUNCH-2024-0088";
    } else if (decision === "Approved with Conditions") {
      nextStatus = "approved_with_conditions";
    } else if (decision === "Revision Required") {
      nextStatus = "revision_required";
    } else if (decision === "Rejected") {
      nextStatus = "rejected";
    }

    const updated = {
      ...existing,
      status: nextStatus,
      approvalDecision: decision,
      reviewComments: comments || null,
      approvalDate: now,
      linkedProductLaunchProjectId: launchId || existing.linkedProductLaunchProjectId,
      linkedProductLaunchProjectCode: launchCode || existing.linkedProductLaunchProjectCode,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });

export const generateCommercializationReportFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async (): Promise<CommercializationRecord> => {
    const existing: any = await getOrDefault();
    const updated = {
      ...existing,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });
