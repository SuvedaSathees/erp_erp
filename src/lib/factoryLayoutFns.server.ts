import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";
import type {
  FactoryApprovalDecision,
  FactoryAttachment,
  FactoryLayoutFormInput,
  FactoryLayoutRecord,
  FactoryReviewer,
} from "@/services/types";

const FACTORY_INCLUDES = {
  attachments: { orderBy: { createdAt: "desc" as const } },
  approvals: { orderBy: { createdAt: "asc" as const } },
  activities: { orderBy: { timestamp: "desc" as const } },
  aiAssessment: true,
  simulations: { orderBy: { runDate: "desc" as const } },
} as const;

export function calculateFactoryScores(record: Partial<FactoryLayoutRecord>) {
  const layoutScore = record.layoutPlanningScore ?? 88;
  const infraScore = record.infrastructureScore ?? 86;
  const logisticsScore = record.logisticsScore ?? 85;
  const safetyScore = record.utilitySafetyScore ?? 88;
  const perfScore = record.factoryEfficiencyScore ?? 87;

  const overallScore = Math.round(
    layoutScore * 0.20 +
      infraScore * 0.20 +
      logisticsScore * 0.20 +
      safetyScore * 0.20 +
      perfScore * 0.20
  );

  return {
    layoutPlanningScore: layoutScore,
    infrastructureScore: infraScore,
    logisticsScore,
    utilitySafetyScore: safetyScore,
    factoryEfficiencyScore: perfScore,
    overallFactoryReadiness: overallScore,
  };
}

function splitCsv(val: string | null | undefined): string[] {
  return val ? val.split(",").map((s) => s.trim()) : [];
}

function toApiShape(record: any): FactoryLayoutRecord | null {
  if (!record) return null;
  const ai = record.aiAssessment;
  return {
    ...record,
    productionAreas: splitCsv(record.productionAreas),
    assemblyAreas: splitCsv(record.assemblyAreas),
    utilitySystems: splitCsv(record.utilitySystems),
    materialHandlingEq: splitCsv(record.materialHandlingEq),
    overallFactoryReadiness: record.overallReadinessScore,
    createdOn: record.createdOn?.toLocaleString?.() ?? String(record.createdOn),
    dateCreated: record.dateCreated?.toISOString?.() ?? String(record.dateCreated),
    lastModified: record.lastModified?.toISOString?.() ?? String(record.lastModified),
    lastUpdated: record.lastUpdated?.toLocaleString?.() ?? String(record.lastUpdated),
    nextReviewDate: record.nextReviewDate
      ? new Date(record.nextReviewDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : undefined,
    aiLayoutOptimization: ai?.layoutOptimization ?? "",
    aiBottleneckPrediction: ai?.bottleneckPrediction ?? "",
    aiMaterialFlowOptimization: ai?.materialFlowOptimization ?? "",
    aiCapacityExpansionRec: ai?.capacityExpansionRec ?? "",
    aiSafetyImprovementRec: ai?.safetyImprovementRec ?? "",
    aiFactoryScore: ai?.aiFactoryScore ?? record.aiFactoryScore ?? 89,
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
    simulations: (record.simulations ?? []).map((s: any) => ({
      id: s.id,
      simulationType: s.simulationType,
      status: s.status,
      resultSummary: s.resultSummary,
      passed: s.passed,
      runDate: new Date(s.runDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    })),
    timeline: [
      { label: "Site Planning Completed", date: "05 Jun 2024", status: "Completed" },
      { label: "Master Layout Completed", date: "07 Jun 2024", status: "Completed" },
      { label: "Shop Floor Layout Completed", date: "12 Jun 2024", status: "Completed" },
      { label: "Utility Layout Completed", date: "15 Jun 2024", status: "Completed" },
      { label: "Simulation Completed", date: "18 Jun 2024", status: "Completed" },
      { label: "Review & Approval", date: "In Progress", status: "In Progress" },
      { label: "Implementation", date: "Pending", status: "Pending" },
    ],
  } as any;
}

export const getFactoryLayoutFn = createServerFn({ method: "GET" }).handler(async () => {
  const record = await prisma.factoryLayout.findFirst({
    include: FACTORY_INCLUDES,
    orderBy: { updatedAt: "desc" },
  });
  const shaped = toApiShape(record);
  if (shaped) return { success: true, data: shaped };

  const { DEFAULT_FACTORY_LAYOUT_RECORD } = await import("./factoryLayoutMock");
  return { success: true, data: DEFAULT_FACTORY_LAYOUT_RECORD };
});

export const saveFactoryLayoutDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id?: string; input: Partial<FactoryLayoutFormInput> })
  .handler(async ({ data }) => {
    const scores = calculateFactoryScores(data.input as any);

    const existing = data.id
      ? await prisma.factoryLayout.findUnique({ where: { id: data.id } })
      : await prisma.factoryLayout.findFirst({ orderBy: { updatedAt: "desc" } });

    if (!existing) {
      const { DEFAULT_FACTORY_LAYOUT_RECORD } = await import("./factoryLayoutMock");
      return { success: true, data: { ...DEFAULT_FACTORY_LAYOUT_RECORD, ...data.input, ...scores } };
    }

    const updated = await prisma.factoryLayout.update({
      where: { id: existing.id },
      data: {
        layoutPlanningScore: scores.layoutPlanningScore,
        infrastructureScore: scores.infrastructureScore,
        logisticsScore: scores.logisticsScore,
        utilitySafetyScore: scores.utilitySafetyScore,
        factoryEfficiencyScore: scores.factoryEfficiencyScore,
        overallReadinessScore: scores.overallFactoryReadiness,
      },
      include: FACTORY_INCLUDES,
    });

    await prisma.factoryActivityLog.create({
      data: {
        layoutId: updated.id,
        user: updated.engineerName,
        action: "Draft Updated",
        description: `Draft saved for ${updated.projectName}`,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const submitFactoryLayoutFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as string | undefined)
  .handler(async () => {
    const existing = await prisma.factoryLayout.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!existing) {
      const { DEFAULT_FACTORY_LAYOUT_RECORD } = await import("./factoryLayoutMock");
      return { success: true, data: { ...DEFAULT_FACTORY_LAYOUT_RECORD, workflowStatus: "Under Review" } };
    }

    const updated = await prisma.factoryLayout.update({
      where: { id: existing.id },
      data: { workflowStatus: "Under Review" },
      include: FACTORY_INCLUDES,
    });

    await prisma.factoryActivityLog.create({
      data: {
        layoutId: updated.id,
        user: updated.engineerName,
        action: "Submitted for Review",
        description: "Factory Layout submitted for executive board review.",
        prevStatus: "In Progress",
        newStatus: "Under Review",
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const reviewFactoryLayoutFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; decision: FactoryApprovalDecision; comments?: string }
  )
  .handler(async ({ data }) => {
    let nextStatus = "In Progress";
    if (data.decision === "Approved") nextStatus = "Approved";
    else if (data.decision === "Revision Required") nextStatus = "Revision Required";
    else if (data.decision === "Rejected") nextStatus = "Draft";

    await prisma.factoryApprovalStep.create({
      data: {
        layoutId: data.id,
        role: "Reviewer",
        person: "Current User",
        decision: data.decision,
        status: data.decision,
        date: new Date(),
        comments: data.comments ?? "",
      },
    });

    const updated = await prisma.factoryLayout.update({
      where: { id: data.id },
      data: { workflowStatus: nextStatus },
      include: FACTORY_INCLUDES,
    });

    await prisma.factoryActivityLog.create({
      data: {
        layoutId: updated.id,
        user: "Current User",
        action: `Review Decision: ${data.decision}`,
        description: data.comments || `Approval decision updated to ${data.decision}`,
        newStatus: nextStatus,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });
