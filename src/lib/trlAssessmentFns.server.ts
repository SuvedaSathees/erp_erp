import { createServerFn } from "@tanstack/react-start";
import type {
  TrlAIAssessment,
  TrlApprovalDecision,
  TrlAssessmentRecord,
  TrlFormInput,
  TrlListRow,
  TrlLookups,
  TrlStage,
  TrlStatus,
  TrlSummary,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";

const MODULE_TYPE = "trl-assessment";

const DEFAULT_TRL_RECORD: TrlAssessmentRecord = {
  id: "trl-record-0087",
  trlAssessmentId: "TRL-2024-0087",
  formCode: "TRL-2024-25",
  assessmentTitle: "Autonomous Docking System Readiness Assessment",
  status: "executive_review",
  currentStage: "executive_review",
  currentStageLabel: "Executive Review",
  version: "1.2",
  businessUnit: "Smart Mobility Division",
  assessmentTeam: ["Rohit Verma", "Neha Sharma", "Vikram Singh", "Amitabh Shah", "Arjun Mehta", "Dr. Anil Patel", "Sanjay Kumar"],
  assessmentDate: "2024-05-20",
  linkedTechnologyId: "tec-0032",
  linkedTechnologyCode: "TEC-2024-0032",
  linkedResearchProjectId: "res-0018",
  linkedResearchProjectCode: "RES-2024-0018",
  linkedPrototypeId: "prd-0012",
  linkedPrototypeCode: "PRD-2024-0012",
  linkedProductId: "prd-1001",
  linkedProductCode: "PRD-1001",
  stages: [
    { stage: "technology_assessment", label: "Technology Assessment", completed: true, active: false, completedAt: "2024-05-10" },
    { stage: "technical_validation", label: "Technical Validation", completed: true, active: false, completedAt: "2024-05-14" },
    { stage: "demonstration_review", label: "Demonstration Review", completed: true, active: false, completedAt: "2024-05-17" },
    { stage: "risk_commercial_assessment", label: "Risk & Commercial Assessment", completed: true, active: false, completedAt: "2024-05-19" },
    { stage: "executive_review", label: "Executive Review", completed: false, active: true },
  ],
  technologyInfo: {
    technologyName: "Autonomous Docking System",
    technologyDomain: "Robotics & Automation",
    technologyDescription: "An autonomous docking system for EVs using vision algorithms, sensor fusion and AI control.",
    productCategory: "Automotive",
    applicationArea: ["Electric Vehicles", "Smart Charging", "Fleet Management"],
    innovationType: "Incremental Innovation",
    strategicImportance: 5,
  },
  currentAssessment: { currentTrlLevel: 5, previousTrlLevel: 4, targetTrlLevel: 7, assessmentMethod: "Field Demonstration", assessmentEvidence: "Pilot deployment at two EV charging stations.", assessmentScore: 78, confidenceLevel: 82 },
  technicalValidation: { scientificValidation: 5, laboratoryValidation: 5, prototypeValidation: 5, systemIntegration: 4, functionalDemonstration: 5, environmentalValidation: 4, validationEvidence: "Lab tests and 300+ docking cycles completed with 97% success rate." },
  technologyDemonstration: { demonstrationEnvironment: "Pilot Plant", testResults: "Successful demonstration. Docking accuracy avg. 98.2%.", performanceMetrics: "Alignment: 98.2%, Time: 18s, Success: 97%", reliabilityResults: "MTBF: 650 hours", safetyAssessment: 5, complianceStatus: "Partially Compliant", demonstrationOutcome: "Technology meets requirements." },
  riskAssessment: { technicalRisk: 2, manufacturingRisk: 3, supplyChainRisk: 3, regulatoryRisk: 2, commercialRisk: 2, overallRiskScore: 32, riskMitigationPlan: "Mitigating through partnerships and early compliance." },
  commercialReadiness: { mrlLevel: 3, marketReadiness: 4, customerValidation: 4, investmentReadiness: 4, businessReadiness: 4, commercialPotential: 4, goToMarketStatus: "Pilot / Early Market" },
  aiAssessment: { aiTechnologyScore: 84, aiReadinessPrediction: "On Track", aiTechnicalGapAnalysis: "Improve vision robustness in low-light.", aiDevelopmentRoadmap: "Enhance sensor fusion and conduct field trials.", aiRiskPrediction: "Moderate technical risk, low market risk.", aiRecommendation: "Proceed to TRL 6.", aiEstimatedTimeToNextTrl: "3 – 4 Months" },
  summary: { overallTechnicalScore: 80, validationScore: 83, commercialScore: 77, riskScore: 68, finalTrlScore: 78, recommendedTrlLevel: "TRL 6", recommendation: "Advance to Next TRL" },
  attachments: [],
  reviewRows: [
    { role: "Technical Reviewer", person: "Neha Sharma", decision: "Approved", status: "Approved", date: "18 May 2024" },
    { role: "R&D Manager", person: "Vikram Singh", decision: "Approved", status: "Approved", date: "19 May 2024" },
    { role: "Quality Manager", person: "Amitabh Shah", decision: "Approved", status: "Approved", date: "20 May 2024" },
    { role: "Innovation Director", person: "Arjun Mehta", decision: "Pending", status: "In Review", date: "-" },
    { role: "CTO", person: "Dr. Anil Patel", decision: "Pending", status: "Pending", date: "-" },
  ],
  approvalDecision: null, reviewComments: null, approvalDate: null,
  linkedMrlAssessmentId: null, linkedMrlAssessmentCode: null,
  createdBy: "Rohit Verma", createdAt: "2024-05-20 09:15 AM", lastModifiedBy: "Rohit Verma", updatedAt: "2024-05-20 04:32 PM",
  auditTrail: [
    { id: "aud-1", timestamp: "2024-05-20 09:15 AM", actor: "Rohit Verma", event: "Created TRL Assessment TRL-2024-0087", kind: "workflow" },
    { id: "aud-4", timestamp: "2024-05-20 04:32 PM", actor: "Rohit Verma", event: "Submitted for Executive Review", kind: "workflow" },
  ],
} as any;

function computeDerivedScores(input: TrlFormInput): { aiAssessment: TrlAIAssessment; summary: TrlSummary } {
  const tv = input.technicalValidation;
  const techRatingAvg = (tv.scientificValidation + tv.laboratoryValidation + tv.prototypeValidation + tv.systemIntegration + tv.functionalDemonstration + tv.environmentalValidation) / 6;
  const cr = input.commercialReadiness;
  const commRatingAvg = (cr.marketReadiness + cr.customerValidation + cr.investmentReadiness + cr.businessReadiness + cr.commercialPotential) / 5;
  const ra = input.riskAssessment;
  const riskStarsAvg = (ra.technicalRisk + ra.manufacturingRisk + ra.supplyChainRisk + ra.regulatoryRisk + ra.commercialRisk) / 5;
  const computedRiskScore = Math.round((riskStarsAvg / 5) * 60 + 10);
  const riskSafetyControlScore = 100 - computedRiskScore;
  const overallTech = Math.round((techRatingAvg / 5) * 80 + 20);
  const validationScore = Math.round((techRatingAvg / 5) * 85 + 15);
  const commercialScore = Math.round((commRatingAvg / 5) * 75 + 20);
  const finalTrlScore = Math.round(overallTech * 0.35 + validationScore * 0.3 + commercialScore * 0.2 + riskSafetyControlScore * 0.15);
  const currentLevel = input.currentAssessment.currentTrlLevel;
  let recommendedLevelNum = currentLevel;
  if (finalTrlScore >= 75 && currentLevel < 9) recommendedLevelNum = (currentLevel + 1) as any;
  else if (finalTrlScore < 50 && currentLevel > 1) recommendedLevelNum = (currentLevel - 1) as any;
  const aiTechScore = Math.min(99, Math.round(finalTrlScore * 1.05));
  const prediction = aiTechScore >= 80 ? "On Track" : aiTechScore >= 60 ? "Needs Attention" : "At Risk";

  return {
    aiAssessment: {
      aiTechnologyScore: aiTechScore,
      aiReadinessPrediction: prediction,
      aiTechnicalGapAnalysis: techRatingAvg < 4.5 ? "Improve vision algorithm robustness in low-light conditions." : "Subsystem alignment verified; conduct endurance testing.",
      aiDevelopmentRoadmap: "Enhance sensor fusion, refine control algorithms, and conduct extended field trials.",
      aiRiskPrediction: computedRiskScore <= 35 ? "Moderate technical risk, low market risk." : "High manufacturing risk, active compliance monitoring required.",
      aiRecommendation: `Proceed to TRL ${recommendedLevelNum} with extended field testing.`,
      aiEstimatedTimeToNextTrl: "3 – 4 Months",
    },
    summary: {
      overallTechnicalScore: overallTech,
      validationScore,
      commercialScore,
      riskScore: riskSafetyControlScore,
      finalTrlScore,
      recommendedTrlLevel: `TRL ${recommendedLevelNum}`,
      recommendation: input.recommendationOverride || (recommendedLevelNum > currentLevel ? "Advance to Next TRL" : "Maintain Current TRL"),
    },
  };
}

async function getOrDefault(): Promise<TrlAssessmentRecord> {
  const result = await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } });
  return (result as any) ?? DEFAULT_TRL_RECORD;
}

async function saveRecord(record: any): Promise<TrlAssessmentRecord> {
  const r = {
    ...record,
    projectName: record.assessmentTitle ?? "",
    ownerName: record.createdBy ?? "Rohit Verma",
    recordCode: record.id ?? record.trlAssessmentId ?? "",
  };
  return (await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record: r } })) as any;
}

export const getTrlLookupsFn = createServerFn({ method: "GET" }).handler(async (): Promise<TrlLookups> => {
  return {
    technologyDomains: ["Robotics & Automation", "Artificial Intelligence", "Power Electronics", "Energy Storage", "Autonomous Systems", "IoT & Telematics"],
    productCategories: ["Automotive", "Industrial Mobility", "CleanTech", "Energy Infrastructure"],
    applicationAreas: ["Electric Vehicles", "Smart Charging", "Fleet Management", "Autonomous Logistics"],
    innovationTypes: ["Incremental Innovation", "Architectural Innovation", "Radical Innovation", "Disruptive Technology"],
    assessmentMethods: ["Field Demonstration", "Laboratory Testing", "Simulation & Modeling", "Expert Review Board"],
    demonstrationEnvironments: ["Pilot Plant", "Controlled Laboratory", "Operational Field Site", "Simulated Environment"],
    complianceStatuses: ["Fully Compliant", "Partially Compliant", "Non-Compliant", "Under Review"],
    goToMarketStatuses: ["Concept Phase", "Pilot / Early Market", "Commercial Scaling", "Mass Production"],
    businessUnits: ["Smart Mobility Division", "Robotics & Mechatronics", "Clean Energy Solutions", "Advanced R&D Center"],
    recommendations: ["Advance to Next TRL", "Maintain Current TRL", "Conduct Further Testing", "Hold / Re-evaluate Strategy", "Accelerate Commercialization"],
    trlLevels: [
      { level: 1, descriptor: "TRL 1 – Basic Principles Observed" }, { level: 2, descriptor: "TRL 2 – Technology Concept Formulated" },
      { level: 3, descriptor: "TRL 3 – Experimental Proof of Concept" }, { level: 4, descriptor: "TRL 4 – Technology Validated in Laboratory" },
      { level: 5, descriptor: "TRL 5 – Technology Validated in Relevant Environment" }, { level: 6, descriptor: "TRL 6 – Technology Demonstrated in Relevant Environment" },
      { level: 7, descriptor: "TRL 7 – System Prototype Demonstrated in Operational Environment" }, { level: 8, descriptor: "TRL 8 – System Complete and Qualified" },
      { level: 9, descriptor: "TRL 9 – Actual System Proven in Operational Environment" },
    ],
    mrlLevels: [
      { level: 1, descriptor: "MRL 1 – Basic Manufacturing Implications Identified" }, { level: 2, descriptor: "MRL 2 – Manufacturing Concepts Formulated" },
      { level: 3, descriptor: "MRL 3 – Manufacturing Feasibility Demonstrated" }, { level: 4, descriptor: "MRL 4 – Laboratory Capability Demonstrated" },
      { level: 5, descriptor: "MRL 5 – Pilot Line Capability Demonstrated" }, { level: 6, descriptor: "MRL 6 – Prototype System Production Capability" },
      { level: 7, descriptor: "MRL 7 – Subsystem Production Readiness" }, { level: 8, descriptor: "MRL 8 – Pilot Line Process Control Proven" },
      { level: 9, descriptor: "MRL 9 – Low Rate Production Proven" }, { level: 10, descriptor: "MRL 10 – Full Rate Production Proven" },
    ],
  };
});

export const getTrlListFn = createServerFn({ method: "GET" }).handler(async (): Promise<TrlListRow[]> => {
  const records = await listDevelopmentRecordsFn({ data: { moduleType: MODULE_TYPE } });
  if (records.length > 0) {
    return records.map((r: any) => ({
      id: r.id, trlAssessmentId: r.trlAssessmentId ?? r.recordCode,
      assessmentTitle: r.assessmentTitle ?? r.projectName,
      technologyName: r.technologyInfo?.technologyName ?? "",
      currentTrlLevel: r.currentAssessment?.currentTrlLevel ?? 1,
      targetTrlLevel: r.currentAssessment?.targetTrlLevel ?? 9,
      status: r.status ?? r.workflowStatus, finalTrlScore: r.summary?.finalTrlScore ?? 0,
      recommendedTrlLevel: r.summary?.recommendedTrlLevel ?? "", updatedAt: r.updatedAt ?? "",
    }));
  }
  const d = DEFAULT_TRL_RECORD;
  return [{
    id: d.id, trlAssessmentId: d.trlAssessmentId, assessmentTitle: d.assessmentTitle,
    technologyName: d.technologyInfo.technologyName, currentTrlLevel: d.currentAssessment.currentTrlLevel,
    targetTrlLevel: d.currentAssessment.targetTrlLevel, status: d.status, finalTrlScore: d.summary.finalTrlScore,
    recommendedTrlLevel: d.summary.recommendedTrlLevel, updatedAt: d.updatedAt,
  }];
});

export const getTrlFn = createServerFn({ method: "GET" })
  .validator((d: string) => d)
  .handler(async (): Promise<TrlAssessmentRecord> => {
    return await getOrDefault();
  });

export const saveTrlDraftFn = createServerFn({ method: "POST" })
  .validator((d: { id?: string; input: TrlFormInput }) => d)
  .handler(async ({ data: { id, input } }): Promise<TrlAssessmentRecord> => {
    const existing = await getOrDefault();
    const { aiAssessment, summary } = computeDerivedScores(input);
    const updated = {
      ...existing,
      assessmentTitle: input.assessmentTitle,
      businessUnit: input.businessUnit,
      assessmentTeam: input.assessmentTeam,
      assessmentDate: input.assessmentDate,
      linkedTechnologyId: input.linkedTechnologyId ?? (existing as any).linkedTechnologyId,
      linkedResearchProjectId: input.linkedResearchProjectId ?? (existing as any).linkedResearchProjectId,
      linkedPrototypeId: input.linkedPrototypeId ?? (existing as any).linkedPrototypeId,
      linkedProductId: input.linkedProductId ?? (existing as any).linkedProductId,
      technologyInfo: input.technologyInfo,
      currentAssessment: input.currentAssessment,
      technicalValidation: input.technicalValidation,
      technologyDemonstration: input.technologyDemonstration,
      riskAssessment: input.riskAssessment,
      commercialReadiness: input.commercialReadiness,
      aiAssessment,
      summary,
      attachments: input.attachments,
      lastModifiedBy: "Rohit Verma",
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });

export const completeTrlStageFn = createServerFn({ method: "POST" })
  .validator((d: { id: string; stage: TrlStage }) => d)
  .handler(async ({ data: { id, stage } }): Promise<TrlAssessmentRecord> => {
    const existing: any = await getOrDefault();
    const stageOrder: TrlStage[] = ["technology_assessment", "technical_validation", "demonstration_review", "risk_commercial_assessment", "executive_review"];
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
      status: nextStage as TrlStatus,
      stages: newStages,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });

export const submitTrlFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async (): Promise<TrlAssessmentRecord> => {
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

export const reviewTrlFn = createServerFn({ method: "POST" })
  .validator((d: { id: string; decision: TrlApprovalDecision; comments?: string }) => d)
  .handler(async ({ data: { id, decision, comments } }): Promise<TrlAssessmentRecord> => {
    const existing: any = await getOrDefault();
    const now = new Date().toISOString().substring(0, 10);
    let nextStatus: TrlStatus = "executive_review";
    let committedCurrentTrl = existing.currentAssessment?.currentTrlLevel ?? 5;
    let mrlId: string | undefined;
    let mrlCode: string | undefined;

    if (decision === "Approved") {
      nextStatus = "approved";
      const recLevelNum = parseInt((existing.summary?.recommendedTrlLevel ?? "").replace("TRL ", "")) || committedCurrentTrl;
      committedCurrentTrl = Math.max(1, Math.min(9, recLevelNum));
      mrlId = `mrl-${Date.now()}`;
      mrlCode = "MRL-2024-0042";
    } else if (decision === "Approved with Improvements") {
      nextStatus = "approved_with_improvements";
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
      linkedMrlAssessmentId: mrlId || existing.linkedMrlAssessmentId,
      linkedMrlAssessmentCode: mrlCode || existing.linkedMrlAssessmentCode,
      currentAssessment: { ...existing.currentAssessment, currentTrlLevel: committedCurrentTrl },
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });

export const generateTrlReportFn = createServerFn({ method: "POST" })
  .validator((d: string) => d)
  .handler(async (): Promise<TrlAssessmentRecord> => {
    const existing: any = await getOrDefault();
    const updated = {
      ...existing,
      updatedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
    };
    return await saveRecord(updated);
  });
