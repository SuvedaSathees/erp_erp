import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";
import type {
  WorkInstructionApprovalDecision,
  WorkInstructionAttachment,
  WorkInstructionFormInput,
  WorkInstructionRecord,
  WorkInstructionReviewer,
  WorkInstructionStepItem,
} from "@/services/types";

const WI_INCLUDES = {
  steps: { orderBy: { stepNumber: "asc" as const } },
  attachments: { orderBy: { createdAt: "desc" as const } },
  approvals: { orderBy: { createdAt: "asc" as const } },
  activities: { orderBy: { timestamp: "desc" as const } },
  aiAssessment: true,
} as const;

export function calculateWorkInstructionScores(record: Partial<WorkInstructionRecord>) {
  const quality = record.qualityScore ?? 85;
  const safety = record.safetyScore ?? 90;
  const competency = record.competencyScore ?? 84;
  const aiDoc = record.aiDocumentationScore ?? 88;

  const overallScore = Math.round(
    quality * 0.25 + safety * 0.30 + competency * 0.20 + aiDoc * 0.25
  );

  const totalTime = (record.steps || []).reduce(
    (sum, step) => sum + (step.timeSeconds || 0),
    0
  );

  return {
    qualityScore: quality,
    safetyScore: safety,
    competencyScore: competency,
    aiDocumentationScore: aiDoc,
    overallReadinessScore: overallScore,
    totalCycleTimeSec: totalTime > 0 ? totalTime : record.totalCycleTimeSec ?? 230,
  };
}

function toApiShape(record: any): WorkInstructionRecord | null {
  if (!record) return null;
  const ai = record.aiAssessment;
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
    aiInstructionReview: ai?.instructionReview ?? "",
    aiRiskAssessment: ai?.riskAssessment ?? "",
    aiProcessOptimization: ai?.processOptimization ?? "",
    aiKnowledgeGapAnalysis: ai?.knowledgeGapAnalysis ?? "",
    aiTrainingRecommendation: ai?.trainingRecommendation ?? "",
    steps: (record.steps ?? []).map((s: any) => ({
      id: s.id,
      stepNumber: s.stepNumber,
      instruction: s.instruction,
      visualReferenceUrl: s.visualReferenceUrl,
      keyPoints: s.keyPoints,
      timeSeconds: s.timeSeconds,
      safetyNotes: s.safetyNotes,
      qualityChecks: s.qualityChecks,
      requiredTools: s.requiredTools,
      requiredMaterials: s.requiredMaterials,
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
    requiredTools: ["Torque Screwdriver (0.5-2 Nm)", "Phillips Screwdriver", "Wire Cutter", "Multimeter"],
    fixturesJigs: ["PCB Assembly Jig", "Insulated Unit Enclosure"],
    measuringInstruments: ["Digital Caliper", "Multimeter", "Torque Meter"],
    materials: ["PCB Assembly", "M3 Screws", "Power Cable Set", "First-Off Inspection Sticker"],
    ppeRequirements: ["ESD Anti-static Wristband", "Safety Glasses", "Insulated Gloves"],
    inspectionPoints: ["Visual PCB placement & orientation", "Screw torque 0.8 Nm verification", "Wire pull test 50N", "LED indicator status test"],
    acceptanceCriteria: "Zero wire pinching, all 4 LEDs green, screw torque within +/-0.05 Nm tolerance.",
    qualityChecklist: ["BOM Part Number verification ✓", "Torque calibration check ✓", "First-off inspection signoff ✓", "Hi-pot electrical safety test ✓"],
    hazardsIdentified: 3,
    lockoutTagoutRequired: false,
    ergonomicAssessment: "Ergonomic seating & anti-fatigue matting defined",
    regulatoryCompliance: true,
    trainingRequired: true,
    skillLevel: "Intermediate",
    authorizedOperators: 12,
    certificationRequired: true,
    timeline: [
      { label: "Instruction Authoring", date: "18 Jun 2024", status: "Completed" },
      { label: "Quality & Safety Review", date: "19 Jun 2024", status: "Completed" },
      { label: "Training Content Preparation", date: "20 Jun 2024", status: "Completed" },
      { label: "Document Control Verification", date: "In Progress", status: "In Progress" },
      { label: "Executive Approval", date: "Pending", status: "Pending" },
      { label: "Shop Floor Release", date: "Pending", status: "Pending" },
    ],
  } as any;
}

export const getWorkInstructionFn = createServerFn({ method: "GET" }).handler(async () => {
  const record = await prisma.workInstruction.findFirst({
    include: WI_INCLUDES,
    orderBy: { updatedAt: "desc" },
  });
  const shaped = toApiShape(record);
  if (shaped) return { success: true, data: shaped };

  const { DEFAULT_WORK_INSTRUCTION_RECORD } = await import("./workInstructionMock");
  return { success: true, data: DEFAULT_WORK_INSTRUCTION_RECORD };
});

export const saveWorkInstructionDraftFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as { id?: string; input: Partial<WorkInstructionFormInput> })
  .handler(async ({ data }) => {
    const scores = calculateWorkInstructionScores(data.input as any);

    const existing = data.id
      ? await prisma.workInstruction.findUnique({ where: { id: data.id } })
      : await prisma.workInstruction.findFirst({ orderBy: { updatedAt: "desc" } });

    if (!existing) {
      const { DEFAULT_WORK_INSTRUCTION_RECORD } = await import("./workInstructionMock");
      return { success: true, data: { ...DEFAULT_WORK_INSTRUCTION_RECORD, ...data.input, ...scores } };
    }

    const updated = await prisma.workInstruction.update({
      where: { id: existing.id },
      data: {
        qualityScore: scores.qualityScore,
        safetyScore: scores.safetyScore,
        competencyScore: scores.competencyScore,
        aiDocumentationScore: scores.aiDocumentationScore,
        overallReadinessScore: scores.overallReadinessScore,
        totalCycleTimeSec: scores.totalCycleTimeSec,
      },
      include: WI_INCLUDES,
    });

    await prisma.workInstructionActivityLog.create({
      data: {
        workInstructionId: updated.id,
        user: updated.processOwner,
        action: "Draft Updated",
        description: `Draft saved for ${updated.title}`,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const submitWorkInstructionFn = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as string | undefined)
  .handler(async () => {
    const existing = await prisma.workInstruction.findFirst({ orderBy: { updatedAt: "desc" } });
    if (!existing) {
      const { DEFAULT_WORK_INSTRUCTION_RECORD } = await import("./workInstructionMock");
      return { success: true, data: { ...DEFAULT_WORK_INSTRUCTION_RECORD, workflowStatus: "Under Review" } };
    }

    const updated = await prisma.workInstruction.update({
      where: { id: existing.id },
      data: { workflowStatus: "Under Review" },
      include: WI_INCLUDES,
    });

    await prisma.workInstructionActivityLog.create({
      data: {
        workInstructionId: updated.id,
        user: updated.processOwner,
        action: "Submitted for Review",
        description: "Work Instruction submitted for executive board sign-off.",
        prevStatus: "Draft",
        newStatus: "Under Review",
      },
    });

    return { success: true, data: toApiShape(updated) };
  });

export const reviewWorkInstructionFn = createServerFn({ method: "POST" })
  .validator(
    (data: unknown) =>
      data as { id: string; decision: WorkInstructionApprovalDecision; comments?: string }
  )
  .handler(async ({ data }) => {
    let nextStatus = "In Review";
    if (data.decision === "Approved") nextStatus = "Approved";
    else if (data.decision === "Revision Required") nextStatus = "Revision Required";
    else if (data.decision === "Rejected") nextStatus = "Draft";

    await prisma.workInstructionApprovalStep.create({
      data: {
        workInstructionId: data.id,
        role: "Reviewer",
        person: "Current User",
        decision: data.decision,
        status: data.decision,
        date: new Date(),
        comments: data.comments ?? "",
      },
    });

    const updated = await prisma.workInstruction.update({
      where: { id: data.id },
      data: { workflowStatus: nextStatus },
      include: WI_INCLUDES,
    });

    await prisma.workInstructionActivityLog.create({
      data: {
        workInstructionId: updated.id,
        user: "Current User",
        action: `Review Decision: ${data.decision}`,
        description: data.comments || `Approval decision updated to ${data.decision}`,
        newStatus: nextStatus,
      },
    });

    return { success: true, data: toApiShape(updated) };
  });
