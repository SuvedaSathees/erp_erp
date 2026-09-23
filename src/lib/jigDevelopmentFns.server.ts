import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";
import type {
  JigApprovalDecision,
  JigAttachment,
  JigFormInput,
  JigRecord,
  JigReviewer,
} from "@/services/types";

const JIG_INCLUDES = {
  attachments: { orderBy: { createdAt: "desc" as const } },
  approvals: { orderBy: { createdAt: "asc" as const } },
  activities: { orderBy: { timestamp: "desc" as const } },
  aiAssessment: true,
} as const;

export function calculateJigScores(record: Partial<JigRecord>) {
  const designScore = record.designReviewScore ?? 88;
  const manufacturingScore = record.manufacturingReadinessScore ?? 85;
  const validationScore = record.validationScore ?? 87;
  const commissioningScore = record.commissioningScore ?? 86;
  const performanceScore = record.performanceScore ?? 84;
  const aiScore = record.aiEngineeringScore ?? 89;

  const overallScore = Math.round(
    designScore * 0.20 +
      manufacturingScore * 0.20 +
      validationScore * 0.20 +
      commissioningScore * 0.20 +
      performanceScore * 0.20
  );

  return {
    designReviewScore: designScore,
    manufacturingReadinessScore: manufacturingScore,
    validationScore,
    commissioningScore,
    performanceScore,
    aiEngineeringScore: aiScore,
    overallJigReadiness: overallScore,
  };
}

function toApiShape(record: any): JigRecord | null {
  if (!record) return null;
  const ai = record.aiAssessment;
  return {
    ...record,
    linkedProduct: record.linkedProductId
      ? { id: record.linkedProductId, name: record.linkedProductName ?? "" }
      : undefined,
    linkedProcess: record.linkedProcessId
      ? { id: record.linkedProcessId, name: record.linkedProcessName ?? "" }
      : undefined,
    jigDesignEngineer: {
      name: record.engineerName,
      avatar: record.engineerAvatar ?? "",
      email: record.engineerEmail ?? "",
    },
    machineAllocation: record.machineAllocation
      ? record.machineAllocation.split(",").map((s: string) => s.trim())
      : [],
    trialJigCompleted: record.trialJig,
    toolGuidanceAccuracy: record.positioningAccuracy,
    overallJigReadiness: record.overallReadinessScore,
    createdOn: record.createdOn?.toLocaleString?.() ?? String(record.createdOn),
    dateCreated: record.dateCreated?.toISOString?.() ?? String(record.dateCreated),
    lastModified: record.lastModified?.toISOString?.() ?? String(record.lastModified),
    lastUpdated: record.lastUpdated?.toLocaleString?.() ?? String(record.lastUpdated),
    nextReviewDate: record.nextReviewDate
      ? new Date(record.nextReviewDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : undefined,
    aiToolPathOptimization: ai?.toolPathOptimization ?? "",
    aiWearPrediction: ai?.wearPrediction ?? "",
    aiFailurePrediction: ai?.failurePrediction ?? "",
    aiMaintenanceRecommendation: ai?.maintenanceRecommendation ?? "",
    aiCostOptimization: ai?.costOptimizationNotes ?? "",
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
      { label: "Concept Created", date: "05 Jun 2024", status: "Completed" },
      { label: "CAD Design Completed", date: "07 Jun 2024", status: "Completed" },
      { label: "Manufacturing Started", date: "10 Jun 2024", status: "Completed" },
      { label: "Trial Jig Completed", date: "14 Jun 2024", status: "Completed" },
      { label: "Validation Completed", date: "17 Jun 2024", status: "Completed" },
      { label: "Review & Approval", date: "18 Jun 2024", status: "In Progress" },
      { label: "Production Release", date: "Pending", status: "Pending" },
    ],
  } as any;
}

export const getJigFn = createServerFn({ method: "GET" }).handler(async () => {
  const record = await prisma.jigDevelopment.findFirst({
    include: JIG_INCLUDES,
    orderBy: { updatedAt: "desc" },
  });
  const shaped = toApiShape(record);
  if (shaped) return { success: true, data: shaped };

  const { DEFAULT_JIG_RECORD } = await import("./jigDevelopmentMock");
  return { success: true, data: DEFAULT_JIG_RECORD };
});

export const saveJigDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id?: string; input: Partial<JigFormInput> })
  .handler(async ({ data }) => {
    const scores = calculateJigScores(data.input as any);

    const existing = data.id
      ? await prisma.jigDevelopment.findUnique({ where: { id: data.id } })
      : await prisma.jigDevelopment.findFirst({ orderBy: { updatedAt: "desc" } });

    if (!existing) {
      const { DEFAULT_JIG_RECORD } = await import("./jigDevelopmentMock");
      return { success: true, data: { ...DEFAULT_JIG_RECORD, ...data.input, ...scores } };
    }

    const updated = await prisma.jigDevelopment.update({
      where: { id: existing.id },
      data: {
        designReviewScore: scores.designReviewScore,
        manufacturingReadinessScore: scores.manufacturingReadinessScore,
        validationScore: scores.validationScore,
        commissioningScore: scores.commissioningScore,
        performanceScore: scores.performanceScore,
        aiEngineeringScore: scores.aiEngineeringScore,
        overallReadinessScore: scores.overallJigReadiness,
      },
      include: JIG_INCLUDES,
    });

    await prisma.jigActivityLog.create({
      data: {
        jigId: updated.id,
        user: updated.engineerName,
        action: "Draft Updated",
        description: `Draft saved for ${updated.projectName}`,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const submitJigFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as string | undefined)
  .handler(async () => {
    const existing = await prisma.jigDevelopment.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!existing) {
      const { DEFAULT_JIG_RECORD } = await import("./jigDevelopmentMock");
      return { success: true, data: { ...DEFAULT_JIG_RECORD, workflowStatus: "Under Review" } };
    }

    const updated = await prisma.jigDevelopment.update({
      where: { id: existing.id },
      data: { workflowStatus: "UnderReview" },
      include: JIG_INCLUDES,
    });

    await prisma.jigActivityLog.create({
      data: {
        jigId: updated.id,
        user: updated.engineerName,
        action: "Submitted for Review",
        description: "Jig Development submitted for executive sign-off.",
        prevStatus: "In Progress",
        newStatus: "Under Review",
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const reviewJigFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; decision: JigApprovalDecision; comments?: string }
  )
  .handler(async ({ data }) => {
    const statusMap: Record<string, string> = {
      Approved: "Approved",
      "Revision Required": "RevisionRequired",
      Rejected: "Draft",
    };
    const newStatus = statusMap[data.decision] ?? "InProgress";

    await prisma.jigApprovalStep.create({
      data: {
        jigId: data.id,
        role: "Reviewer",
        person: "Current User",
        decision: data.decision === "Approved" ? "Approved" : data.decision === "Revision Required" ? "RevisionRequired" : "Rejected",
        status: data.decision,
        date: new Date(),
        comments: data.comments ?? "",
      },
    });

    const updated = await prisma.jigDevelopment.update({
      where: { id: data.id },
      data: { workflowStatus: newStatus as any },
      include: JIG_INCLUDES,
    });

    await prisma.jigActivityLog.create({
      data: {
        jigId: updated.id,
        user: "Current User",
        action: `Review Decision: ${data.decision}`,
        description: data.comments || `Approval step updated to ${data.decision}`,
        newStatus: data.decision,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });
