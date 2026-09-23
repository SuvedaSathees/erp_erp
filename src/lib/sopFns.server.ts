import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";
import type {
  SopApprovalDecision,
  SopAttachment,
  SopFormInput,
  SopRecord,
  SopResourceItem,
  SopReviewer,
  SopStepItem,
} from "@/services/types";

const SOP_INCLUDES = {
  steps: { orderBy: { stepNumber: "asc" as const } },
  resources: true,
  compliance: true,
  risk: true,
  training: true,
  attachments: { orderBy: { createdAt: "desc" as const } },
  approvals: { orderBy: { createdAt: "asc" as const } },
  activities: { orderBy: { timestamp: "desc" as const } },
  aiAssessment: true,
} as const;

export function calculateSopScores(record: Partial<SopRecord>) {
  const procedure = record.procedureReadinessScore ?? 85;
  const compliance = record.complianceScore ?? 90;
  const risk = record.riskScore ?? 82;
  const training = record.trainingScore ?? 88;
  const aiDoc = record.aiDocumentationScore ?? 91;

  const overallScore = Math.round(
    procedure * 0.20 + compliance * 0.25 + risk * 0.20 + training * 0.15 + aiDoc * 0.20
  );

  const totalMins = (record.steps || []).reduce(
    (sum, step) => sum + (step.durationMins || 0),
    0
  );

  return {
    procedureReadinessScore: procedure,
    complianceScore: compliance,
    riskScore: risk,
    trainingScore: training,
    aiDocumentationScore: aiDoc,
    overallReadinessScore: overallScore,
    totalDurationMins: totalMins > 0 ? totalMins : record.totalDurationMins ?? 45,
  };
}

function toApiShape(record: any): SopRecord | null {
  if (!record) return null;
  const ai = record.aiAssessment;
  const comp = record.compliance;
  const rsk = record.risk;
  const trn = record.training;

  return {
    ...record,
    createdOn: record.createdOn?.toLocaleString?.() ?? String(record.createdOn),
    dateCreated: record.dateCreated?.toISOString?.() ?? String(record.dateCreated),
    lastModified: record.lastModified?.toISOString?.() ?? String(record.lastModified),
    lastUpdated: record.lastUpdated?.toLocaleString?.() ?? String(record.lastUpdated),
    effectiveDate: record.effectiveDate
      ? new Date(record.effectiveDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : undefined,
    nextReviewDate: record.nextReviewDate
      ? new Date(record.nextReviewDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : undefined,
    processOwnerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    aiSopReview: ai?.aiSopReview ?? "",
    aiComplianceAnalysis: ai?.aiComplianceAnalysis ?? "",
    aiProcessOptimization: ai?.aiProcessOptimization ?? "",
    aiRiskPrediction: ai?.aiRiskPrediction ?? "",
    aiRevisionRecommendation: ai?.aiRevisionRecommendation ?? "",
    applicableStandards: comp?.applicableStandards ? comp.applicableStandards.split(", ") : [],
    regulatoryRequirements: comp?.regulatoryRequirements ? comp.regulatoryRequirements.split(", ") : [],
    internalPolicies: comp?.internalPolicies ? comp.internalPolicies.split(", ") : [],
    auditRequirements: comp?.auditRequirements ? comp.auditRequirements.split(", ") : [],
    complianceChecklist: [
      "ISO 9001:2015 Process Control Clause 8.5 ✓",
      "OSHA Workplace Safety Standard Verified ✓",
      "Cleanroom Class 10,000 Certification ✓",
      "Environmental Emission Compliance ✓",
    ],
    riskLevel: rsk?.riskLevel ?? "Medium",
    riskAssessmentReport: "Risk_Assessment_Report_RA-SOP-001.pdf",
    ehsRequirements: rsk?.ehsRequirements ? rsk.ehsRequirements.split(", ") : [],
    emergencyProcedure: rsk?.emergencyProcedure ?? "",
    trainingRequired: trn?.trainingRequired ?? true,
    trainingMaterial: "SOP_Training_Presentation.pdf",
    targetAudience: trn?.targetAudience ?? "",
    competencyRequirement: trn?.competencyRequirement ?? "",
    implementationDate: "01 Jul 2024",
    effectivenessVerification: true,
    steps: (record.steps ?? []).map((s: any) => ({
      id: s.id,
      stepNumber: s.stepNumber,
      description: s.description,
      responsibleRole: s.responsibleRole,
      durationMins: s.durationMins,
      requiredDocuments: s.requiredDocuments,
      notes: s.notes,
      safetyCheck: s.safetyCheck,
      qualityCheck: s.qualityCheck,
    })),
    resources: (record.resources ?? []).map((r: any) => ({
      id: r.id,
      category: r.category,
      name: r.name,
      itemCount: r.itemCount,
      status: r.status,
    })),
    reviewers: (record.approvals ?? []).map((a: any) => ({
      role: a.role,
      person: a.person,
      decision: a.decision,
      date: a.date ? new Date(a.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-",
      comments: a.comments ?? "",
      status: a.status,
    })),
    attachments: (record.attachments ?? []).map((a: any) => ({
      id: a.id,
      fileName: a.fileName,
      fileType: a.fileType,
      documentType: a.documentType,
      version: a.version,
      uploadedBy: a.uploadedBy,
      uploadedDate: new Date(a.uploadedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      fileSize: a.fileSize,
      status: a.status,
    })),
    auditTrail: (record.activities ?? []).map((a: any) => ({
      id: a.id,
      timestamp: new Date(a.timestamp).toLocaleString(),
      user: a.user,
      action: a.action,
      description: a.description,
      prevStatus: a.prevStatus,
      newStatus: a.newStatus,
    })),
    timeline: [
      { label: "SOP Authoring & Drafting", date: "18 Jun 2024", status: "Completed" },
      { label: "Compliance & Quality Review", date: "19 Jun 2024", status: "Completed" },
      { label: "Risk & Safety Assessment", date: "20 Jun 2024", status: "Completed" },
      { label: "Training Content Preparation", date: "20 Jun 2024", status: "Completed" },
      { label: "Document Control Verification", date: "In Progress", status: "In Progress" },
      { label: "Executive Board Approval", date: "Pending", status: "Pending" },
      { label: "Controlled Release to Shopfloor", date: "Pending", status: "Pending" },
    ],
  } as any;
}

export const getSopFn = createServerFn({ method: "GET" }).handler(async () => {
  const record = await prisma.sopRecord.findFirst({
    include: SOP_INCLUDES,
    orderBy: { updatedAt: "desc" },
  });
  const shaped = toApiShape(record);
  if (shaped) return { success: true, data: shaped };

  const { DEFAULT_SOP_RECORD } = await import("./sopMock");
  return { success: true, data: DEFAULT_SOP_RECORD };
});

export const saveSopDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id?: string; input: Partial<SopFormInput> })
  .handler(async ({ data }) => {
    const scores = calculateSopScores(data.input as any);

    const existing = data.id
      ? await prisma.sopRecord.findUnique({ where: { id: data.id } })
      : await prisma.sopRecord.findFirst({ orderBy: { updatedAt: "desc" } });

    if (!existing) {
      const { DEFAULT_SOP_RECORD } = await import("./sopMock");
      return { success: true, data: { ...DEFAULT_SOP_RECORD, ...data.input, ...scores } };
    }

    const updated = await prisma.sopRecord.update({
      where: { id: existing.id },
      data: {
        procedureReadinessScore: scores.procedureReadinessScore,
        complianceScore: scores.complianceScore,
        riskScore: scores.riskScore,
        trainingScore: scores.trainingScore,
        aiDocumentationScore: scores.aiDocumentationScore,
        overallReadinessScore: scores.overallReadinessScore,
        totalDurationMins: scores.totalDurationMins,
      },
      include: SOP_INCLUDES,
    });

    await prisma.sopActivityLog.create({
      data: {
        sopRecordId: updated.id,
        user: updated.processOwner,
        action: "Draft Updated",
        description: `Draft saved for ${updated.title}`,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const submitSopFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as string | undefined)
  .handler(async () => {
    const existing = await prisma.sopRecord.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!existing) {
      const { DEFAULT_SOP_RECORD } = await import("./sopMock");
      return { success: true, data: { ...DEFAULT_SOP_RECORD, workflowStatus: "Under Review" } };
    }

    const updated = await prisma.sopRecord.update({
      where: { id: existing.id },
      data: { workflowStatus: "Under Review" },
      include: SOP_INCLUDES,
    });

    await prisma.sopActivityLog.create({
      data: {
        sopRecordId: updated.id,
        user: updated.processOwner,
        action: "Submitted for Review",
        description: "SOP submitted for executive board sign-off.",
        prevStatus: "Draft",
        newStatus: "Under Review",
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const reviewSopFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; decision: SopApprovalDecision; comments?: string }
  )
  .handler(async ({ data }) => {
    let nextStatus = "In Review";
    if (data.decision === "Approved") nextStatus = "Approved";
    else if (data.decision === "Revision Required") nextStatus = "Revision Required";
    else if (data.decision === "Rejected") nextStatus = "Draft";

    await prisma.sopApprovalStep.create({
      data: {
        sopRecordId: data.id,
        role: "Reviewer",
        person: "Current User",
        decision: data.decision,
        status: data.decision,
        date: new Date(),
        comments: data.comments ?? "",
      },
    });

    const updated = await prisma.sopRecord.update({
      where: { id: data.id },
      data: { workflowStatus: nextStatus },
      include: SOP_INCLUDES,
    });

    await prisma.sopActivityLog.create({
      data: {
        sopRecordId: updated.id,
        user: "Current User",
        action: `Review Decision: ${data.decision}`,
        description: data.comments || `Approval decision updated to ${data.decision}`,
        newStatus: nextStatus,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });
