import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";
import type {
  CapacityApprovalDecision,
  CapacityAttachment,
  CapacityFormInput,
  CapacityPlanningRecord,
  CapacityReviewer,
} from "@/services/types";

const CAPACITY_INCLUDES = {
  attachments: { orderBy: { createdAt: "desc" as const } },
  approvals: { orderBy: { createdAt: "asc" as const } },
  activities: { orderBy: { timestamp: "desc" as const } },
  aiAssessment: true,
  simulations: { orderBy: { runDate: "desc" as const } },
  bottlenecks: { orderBy: { createdAt: "asc" as const } },
} as const;

export function calculateCapacityReadinessScore(record: Partial<CapacityPlanningRecord>) {
  const assessment = record.assessmentScore ?? 88;
  const resource = record.resourceScore ?? 86;
  const bottleneck = record.bottleneckScore ?? 85;
  const simulation = record.simulationScore ?? 86;
  const performance = record.performanceScore ?? 84;

  const overallScore = Math.round(
    assessment * 0.25 +
      resource * 0.25 +
      bottleneck * 0.20 +
      simulation * 0.15 +
      performance * 0.15
  );

  return {
    assessmentScore: assessment,
    resourceScore: resource,
    bottleneckScore: bottleneck,
    simulationScore: simulation,
    performanceScore: performance,
    overallCapacityReadiness: overallScore,
  };
}

function toApiShape(record: any): CapacityPlanningRecord | null {
  if (!record) return null;
  const ai = record.aiAssessment;
  return {
    ...record,
    overallCapacityReadiness: record.overallReadinessScore,
    createdOn: record.createdOn?.toLocaleString?.() ?? String(record.createdOn),
    dateCreated: record.dateCreated?.toISOString?.() ?? String(record.dateCreated),
    lastModified: record.lastModified?.toISOString?.() ?? String(record.lastModified),
    lastUpdated: record.lastUpdated?.toLocaleString?.() ?? String(record.lastUpdated),
    nextReviewDate: record.nextReviewDate
      ? new Date(record.nextReviewDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
      : undefined,
    aiDemandForecastInsight: ai?.demandForecastInsight ?? "",
    aiCapacityOptimization: ai?.capacityOptimization ?? "",
    aiBottleneckPrediction: ai?.bottleneckPrediction ?? "",
    aiExpansionRecommendation: ai?.expansionRecommendation ?? "",
    aiWorkforceOptimization: ai?.workforceOptimization ?? "",
    aiCapacityScore: ai?.aiCapacityScore ?? record.aiCapacityScore ?? 88,
    bottlenecks: (record.bottlenecks ?? []).map((b: any) => ({
      id: b.id,
      workstation: b.workstation,
      equipment: b.equipment,
      constraint: b.constraint,
      impact: b.impact,
      rootCause: b.rootCause ?? "",
      improvementActions: b.improvementActions ?? "",
      estimatedGain: b.estimatedGain ?? "",
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
    simulations: (record.simulations ?? []).map((s: any) => ({
      id: s.id,
      scenarioName: s.scenarioName,
      simulationScore: s.simulationScore,
      expansionRequirement: s.expansionRequirement,
      passed: s.passed,
      runDate: new Date(s.runDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    })),
    timeline: [
      { label: "Demand Assessment Completed", date: "05 Jun 2024", status: "Completed" },
      { label: "Resource Allocation Completed", date: "10 Jun 2024", status: "Completed" },
      { label: "Bottleneck Analysis Completed", date: "14 Jun 2024", status: "Completed" },
      { label: "Simulation Completed", date: "18 Jun 2024", status: "Completed" },
      { label: "Review & Approval", date: "In Progress", status: "In Progress" },
      { label: "Ramp-up Execution", date: "Pending", status: "Pending" },
    ],
  } as any;
}

export const getCapacityPlanningFn = createServerFn({ method: "GET" }).handler(async () => {
  const record = await prisma.capacityPlanning.findFirst({
    include: CAPACITY_INCLUDES,
    orderBy: { updatedAt: "desc" },
  });
  const shaped = toApiShape(record);
  if (shaped) return { success: true, data: shaped };

  const { DEFAULT_CAPACITY_PLANNING_RECORD } = await import("./capacityPlanningMock");
  return { success: true, data: DEFAULT_CAPACITY_PLANNING_RECORD };
});

export const saveCapacityDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id?: string; input: Partial<CapacityFormInput> })
  .handler(async ({ data }) => {
    const scores = calculateCapacityReadinessScore(data.input as any);

    const existing = data.id
      ? await prisma.capacityPlanning.findUnique({ where: { id: data.id } })
      : await prisma.capacityPlanning.findFirst({ orderBy: { updatedAt: "desc" } });

    if (!existing) {
      const { DEFAULT_CAPACITY_PLANNING_RECORD } = await import("./capacityPlanningMock");
      return { success: true, data: { ...DEFAULT_CAPACITY_PLANNING_RECORD, ...data.input, ...scores } };
    }

    const updated = await prisma.capacityPlanning.update({
      where: { id: existing.id },
      data: {
        assessmentScore: scores.assessmentScore,
        resourceScore: scores.resourceScore,
        bottleneckScore: scores.bottleneckScore,
        simulationScore: scores.simulationScore,
        performanceScore: scores.performanceScore,
        overallReadinessScore: scores.overallCapacityReadiness,
      },
      include: CAPACITY_INCLUDES,
    });

    await prisma.capacityActivityLog.create({
      data: {
        planningId: updated.id,
        user: updated.engineerName,
        action: "Draft Updated",
        description: `Draft saved for ${updated.projectName}`,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const submitCapacityFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as string | undefined)
  .handler(async () => {
    const existing = await prisma.capacityPlanning.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!existing) {
      const { DEFAULT_CAPACITY_PLANNING_RECORD } = await import("./capacityPlanningMock");
      return { success: true, data: { ...DEFAULT_CAPACITY_PLANNING_RECORD, workflowStatus: "Under Review" } };
    }

    const updated = await prisma.capacityPlanning.update({
      where: { id: existing.id },
      data: { workflowStatus: "Under Review" },
      include: CAPACITY_INCLUDES,
    });

    await prisma.capacityActivityLog.create({
      data: {
        planningId: updated.id,
        user: updated.engineerName,
        action: "Submitted for Review",
        description: "Capacity plan submitted for executive review board.",
        prevStatus: "In Progress",
        newStatus: "Under Review",
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const reviewCapacityFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; decision: CapacityApprovalDecision; comments?: string }
  )
  .handler(async ({ data }) => {
    let nextStatus = "In Progress";
    if (data.decision === "Approved") nextStatus = "Approved";
    else if (data.decision === "Revision Required") nextStatus = "Revision Required";
    else if (data.decision === "Rejected") nextStatus = "Draft";

    await prisma.capacityApprovalStep.create({
      data: {
        planningId: data.id,
        role: "Reviewer",
        person: "Current User",
        decision: data.decision,
        status: data.decision,
        date: new Date(),
        comments: data.comments ?? "",
      },
    });

    const updated = await prisma.capacityPlanning.update({
      where: { id: data.id },
      data: { workflowStatus: nextStatus },
      include: CAPACITY_INCLUDES,
    });

    await prisma.capacityActivityLog.create({
      data: {
        planningId: updated.id,
        user: "Current User",
        action: `Review Decision: ${data.decision}`,
        description: data.comments || `Approval decision updated to ${data.decision}`,
        newStatus: nextStatus,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });
