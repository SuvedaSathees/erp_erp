import { createServerFn } from "@tanstack/react-start";
import type {
  PrdApprovalDecision,
  PrdFormInput,
  PrdRecord,
  PrdStage,
} from "@/services/types";
import {
  getDevelopmentRecordFn,
  listDevelopmentRecordsFn,
  saveDevelopmentDraftFn,
  submitDevelopmentFn,
  reviewDevelopmentFn,
} from "./developmentCrud.server";
import { withDefaults } from "./developmentTransform";

const MODULE_TYPE = "prd";

export function calculatePrdScores(input: Partial<PrdFormInput>) {
  const bizReqsCount = input.businessRequirements?.length || 3;
  const businessReadiness = Math.min(100, Math.round(70 + bizReqsCount * 7.5));
  const funcReqsCount = input.functionalRequirements?.length || 4;
  const functionalCompleteness = Math.min(100, Math.round(65 + funcReqsCount * 6.5));
  const attachmentsCount = input.attachments?.length || 4;
  const technicalReadiness = Math.min(100, Math.round(72 + attachmentsCount * 4));
  const qualityReadiness = Math.min(100, Math.round((businessReadiness + functionalCompleteness + technicalReadiness) / 3));
  const overallPrdScore = Math.round(
    businessReadiness * 0.3 + functionalCompleteness * 0.3 + technicalReadiness * 0.25 + qualityReadiness * 0.15
  );
  const requirementCompleteness = Math.min(98, Math.max(75, Math.round(overallPrdScore * 0.96 + 3)));
  const requirementConsistency = Math.min(99, Math.max(78, Math.round(overallPrdScore * 0.97 + 2)));
  const riskAssessment = Math.min(95, Math.max(70, Math.round(overallPrdScore * 0.92 + 5)));
  const scopeValidation = Math.min(97, Math.max(76, Math.round(overallPrdScore * 0.95 + 4)));
  const aiConfidenceScore = Math.min(99, Math.max(80, Math.round(overallPrdScore * 0.98 + 1)));
  const overallAiQualityScore = Math.round(
    requirementCompleteness * 0.25 + requirementConsistency * 0.25 + riskAssessment * 0.2 + scopeValidation * 0.15 + aiConfidenceScore * 0.15
  );

  return {
    readinessSummary: { overallPrdScore, businessReadiness, functionalCompleteness, technicalReadiness, qualityReadiness },
    aiQuality: {
      overallAiQualityScore, requirementCompleteness, requirementConsistency, riskAssessment, scopeValidation, aiConfidenceScore,
      aiInsightsSummary: "PRD scope is rigorously defined.",
    },
    keyHighlights: [
      `All ${bizReqsCount} critical business objectives fully aligned.`,
      `${funcReqsCount} top functional user stories defined.`,
      `Security & compliance standards validated.`,
      `AI Assessment completed with ${aiConfidenceScore}% confidence.`,
    ],
  };
}

const initialCalculated = calculatePrdScores({});

const INITIAL_INPUT: PrdFormInput = {
  prdTitle: "Smart EV Charger Pro — v2.3 Wireless & RFID Module PRD",
  prdVersion: "v1.0",
  linkedProductId: "prd-1001",
  linkedProductName: "Smart EV Charger Pro",
  linkedRoadmapId: "PRM-2024-0017",
  linkedRoadmapName: "EV Charger Roadmap 2024-27",
  linkedReleaseId: "rel-03",
  linkedReleaseName: "v2.3 – Wireless Charging & RFID",
  businessUnit: "Smart EV Infrastructure",
  productOwnerId: "usr-104",
  productOwnerName: "Vikram Sharma",
  plannedReleaseDate: "2024-11-15",

  // Panel 1: Product Overview (inherited from Roadmap/Strategy)
  productName: "Smart EV Charger Pro (v2.3 Wireless & RFID)",
  productVision: "To establish Magnertia as the premier provider of intelligent, sub-15 minute commercial EV charging infrastructure in South Asia.",
  businessObjective: "Achieve 1,500 commercial installations in FY25, generating ₹68.0 Cr cumulative 3-year revenue with 44.5% gross margin.",
  problemStatement: "Commercial fleet operators require contactless authentication and sub-10s session initiation without manual cable plugging delay or app friction.",
  productScope: "Includes RFID contactless card reader, ISO 15118 Plug-and-Charge firmware, dynamic load balancing telemetry, and cloud fleet subscription billing integration.",
  outOfScope: "Heavy vehicle megawatt charging (>1MW) and residential single-phase AC wallbox hardware.",
  successCriteria: "99.9% RFID reader authentication success rate, <2.5s payment authorization latency, full DISCOM grid compliance certification.",

  // Panel 2: Quick Info
  productLine: "Ultra-Fast Commercial Series",
  category: "Hardware & Embedded Firmware",
  targetMarket: "EV Fleet Operators, Commercial Real Estate, DISCOM Corridors",
  primaryUsers: "Fleet Drivers, Facility Managers, CPO Operators",
  lastUpdated: new Date().toISOString().split("T")[0],
  nextReviewDate: "2024-05-15",

  // Panel 6: Business Requirements
  businessRequirements: [
    { id: "BR-01", title: "Contactless RFID Payment & Fleet Authentication", priority: "P1 - Critical", status: "approved" },
    { id: "BR-02", title: "Automated Tariff & Peak-Load Billing", priority: "P1 - Critical", status: "approved" },
    { id: "BR-[03]", title: "Multi-Tenant Fleet Telemetry Portal", priority: "P2 - High", status: "under_review" },
  ],

  // Panel 7: Top Functional Requirements
  functionalRequirements: [
    { id: "FR-01", featureStory: "As a Fleet Driver, I tap my RFID card to initiate 240kW DC charging instantly.", priority: "P1", status: "approved" },
    { id: "FR-02", featureStory: "As a CPO, I configure peak/off-peak pricing tariffs remotely via cloud API.", priority: "P1", status: "approved" },
    { id: "FR-03", featureStory: "As a Grid Operator, I trigger automatic load shedding during peak demand spikes.", priority: "P2", status: "approved" },
    { id: "FR-04", featureStory: "As a Facility Manager, I receive real-time fault diagnostic alerts via Webhooks.", priority: "P2", status: "under_review" },
  ],

  // Panel 8: Key Milestones
  milestones: [
    { milestone: "PRD Scope Lock & Architecture Sign-Off", plannedDate: "2024-05-10", status: "completed" },
    { milestone: "Firmware Beta Code Freeze & Hardware Integration", plannedDate: "2024-08-15", status: "in_progress" },
    { milestone: "ARAI & CE Safety Certification Audit", plannedDate: "2024-10-01", status: "pending" },
  ],

  // Panel 9: Risk Summary
  risks: [
    { riskType: "Supply Chain / Component Availability", riskLevel: "Medium", scoreStars: 3 },
    { riskType: "Interoperability / ISO 15118 Compliance", riskLevel: "Low", scoreStars: 2 },
    { riskType: "Cybersecurity / Hardware Tamper Protection", riskLevel: "Medium", scoreStars: 3 },
  ],

  // Panel 10: Attachments
  attachments: [
    { id: "att-01", name: "Business_Case.pdf", size: "3.4 MB", type: "pdf", uploadedAt: "2024-04-25" },
    { id: "att-02", name: "Roadmap_v2.3.pdf", size: "2.1 MB", type: "pdf", uploadedAt: "2024-04-26" },
    { id: "att-03", name: "Wireframes_v2.3.zip", size: "18.5 MB", type: "zip", uploadedAt: "2024-04-28" },
    { id: "att-04", name: "API_Specs_v1.0.pdf", size: "1.6 MB", type: "pdf", uploadedAt: "2024-04-29" },
    { id: "att-05", name: "Architecture_Diagram.vsdx", size: "4.8 MB", type: "vsdx", uploadedAt: "2024-04-30" },
    { id: "att-06", name: "Risk_Register.xlsx", size: "1.2 MB", type: "xlsx", uploadedAt: "2024-05-01" },
  ],

  // Panel 11: Review & Approval Matrix
  reviewers: [
    { id: "rev-01", role: "Product Owner", person: "Vikram Sharma", decision: "Approved", status: "Verified", date: "2024-05-01" },
    { id: "rev-02", role: "Business Analyst", person: "Ananya Rao", decision: "Approved", status: "Verified", date: "2024-05-02" },
    { id: "rev-03", role: "Engineering Manager", person: "Dr. Rajesh Kumar", decision: "Approved", status: "Verified", date: "2024-05-03" },
    { id: "rev-04", role: "UX Lead", person: "Pooja Hegde", decision: "Approved", status: "Verified", date: "2024-05-04" },
    { id: "rev-05", role: "QA Manager", person: "Suresh Menon", decision: "Approved", status: "Verified", date: "2024-05-05" },
    { id: "rev-06", role: "CTO", person: "Dr. Aris Thorne", decision: "Pending", status: "Under Review", date: undefined },
  ],
  approvalDecision: null,
  reviewComments: "Comprehensive PRD specification. Functional user stories and ISO 15118 protocol requirements are fully aligned.",
  approvalDate: "2024-05-08",
};

let DEFAULT_PRD_RECORD: PrdRecord = {
  id: "prd-record-0017",
  prdId: "PRD-2024-0017",
  formCode: "PRD-2024-08",
  prdTitle: "Smart EV Charger Pro — v2.3 Wireless & RFID Module PRD",
  prdVersion: "v1.0",
  status: "executive_review",
  currentStage: "executive_review",
  currentStageLabel: "Executive Review",
  createdOn: "2024-04-25",
  linkedProductId: "prd-1001",
  linkedProductName: "Smart EV Charger Pro",
  linkedRoadmapId: "PRM-2024-0017",
  linkedRoadmapName: "EV Charger Roadmap 2024-27",
  linkedReleaseId: "rel-03",
  linkedReleaseName: "v2.3 – Wireless Charging & RFID",
  businessUnit: "Smart EV Infrastructure",
  productOwnerId: "usr-104",
  productOwnerName: "Vikram Sharma",
  productOwnerAvatar: "",
  plannedReleaseDate: "2024-11-15",
  dateCreated: "2024-04-25",
  lastModified: new Date().toISOString().split("T")[0],
  version: "v1.0",
  stages: [],
  input: INITIAL_INPUT,
  aiQuality: initialCalculated.aiQuality,
  readinessSummary: initialCalculated.readinessSummary,
  keyHighlights: initialCalculated.keyHighlights,
  linkedSystemDesignId: null,
  approvalDecision: null,
  approvalDate: null,
  reviewComments: null,
  auditTrail: [],
} as any;

export const getPrdFn = createServerFn({ method: "GET" }).handler(async () => {
  const result = withDefaults(DEFAULT_PRD_RECORD, await getDevelopmentRecordFn({ data: { moduleType: MODULE_TYPE } }));
  if (result) return { success: true, data: result };
  return { success: true, data: DEFAULT_PRD_RECORD };
});

export const savePrdDraftFn = createServerFn({ method: "POST" })
  .validator((data: { id?: string; input: PrdFormInput }) => data)
  .handler(async ({ data }) => {
    const record = {
      ...data.input,
      id: data.id,
      projectName: data.input.prdTitle ?? "",
      ownerName: data.input.productOwnerName ?? "",
    };
    const result = (withDefaults(DEFAULT_PRD_RECORD, await saveDevelopmentDraftFn({ data: { moduleType: MODULE_TYPE, record } })) as any);
    return { success: true, data: result };
  });

export const advancePrdStageFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; targetStage: PrdStage }) => data)
  .handler(async ({ data }) => {
    return { success: true, data: DEFAULT_PRD_RECORD };
  });

export const submitPrdFn = createServerFn({ method: "POST" })
  .validator((data: string) => data)
  .handler(async ({ data }) => {
    const id = data || DEFAULT_PRD_RECORD.id;
    const result = (withDefaults(DEFAULT_PRD_RECORD, await submitDevelopmentFn({ data: { moduleType: MODULE_TYPE, id } })) as any);
    return { success: true, data: result };
  });

export const reviewPrdFn = createServerFn({ method: "POST" })
  .validator((data: { id: string; decision: PrdApprovalDecision; comments?: string }) => data)
  .handler(async ({ data }) => {
    const result = (withDefaults(DEFAULT_PRD_RECORD, await reviewDevelopmentFn({
      data: {
        id: data.id,
        decision: data.decision,
        comments: data.comments,
        reviewerRole: "PRD Review Committee",
        reviewerName: "PRD Review Committee",
      },
    })) as any);
    return { success: true, data: result };
  });
