import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";
import { toApiShape, fromApiShape } from "./developmentTransform";
import { calculateScores } from "./developmentScores";

export const getDevelopmentRecordFn = createServerFn({ method: "GET" })
  .validator((data: { moduleType: string; id?: string }) => data)
  .handler(async ({ data }) => {
    const where: any = { moduleType: data.moduleType };
    if (data.id) where.id = data.id;

    const record = await prisma.developmentRecord.findFirst({
      where,
      include: {
        attachments: { orderBy: { createdAt: "desc" } },
        approvals: { orderBy: { sortOrder: "asc" } },
        activities: { orderBy: { timestamp: "desc" } },
      },
    });

    return toApiShape(record);
  });

export const listDevelopmentRecordsFn = createServerFn({ method: "GET" })
  .validator(
    (data: { moduleType: string; status?: string; limit?: number; offset?: number }) => data
  )
  .handler(async ({ data }) => {
    const where: any = { moduleType: data.moduleType };
    if (data.status) where.workflowStatus = data.status;

    const records = await prisma.developmentRecord.findMany({
      where,
      include: {
        attachments: true,
        approvals: { orderBy: { sortOrder: "asc" } },
        activities: { orderBy: { timestamp: "desc" }, take: 5 },
      },
      orderBy: { updatedAt: "desc" },
      take: data.limit ?? 50,
      skip: data.offset ?? 0,
    });

    return records.map(toApiShape);
  });

export const saveDevelopmentDraftFn = createServerFn({ method: "POST" })
  .validator((data: { moduleType: string; record: any }) => data)
  .handler(async ({ data }) => {
    const { moduleType, record } = data;
    const parsed = fromApiShape(record, moduleType);
    const scores = calculateScores(moduleType, parsed.formData);

    const dbData = {
      moduleType,
      recordCode: parsed.header.recordCode ?? record.recordCode ?? record.id ?? `${moduleType}-${Date.now()}`,
      formCode: parsed.header.formCode ?? record.formCode ?? "",
      projectName: parsed.header.projectName ?? record.projectName ?? record.automationProjectTitle ?? record.designProjectName ?? record.bomName ?? record.title ?? "",
      version: parsed.header.version ?? record.version ?? "1.0",
      workflowStatus: parsed.header.workflowStatus ?? record.workflowStatus ?? "Draft",
      stage: parsed.header.stage ?? record.stage ?? 1,
      priority: parsed.header.priority ?? record.priority ?? "Medium",
      ownerName: parsed.header.ownerName ?? record.ownerName ?? record.automationEngineer ?? record.processOwner ?? record.createdBy ?? "",
      ownerEmail: parsed.header.ownerEmail ?? record.ownerEmail ?? null,
      businessUnit: parsed.header.businessUnit ?? record.businessUnit ?? null,
      department: parsed.header.department ?? record.department ?? null,
      formData: { ...parsed.formData, ...scores.sectionScores },
      sectionScores: scores.sectionScores,
      aiAssessment: parsed.aiAssessment,
      overallScore: scores.overallScore,
      recommendation: scores.recommendation,
      approvalDecision: parsed.header.approvalDecision ?? record.approvalDecision ?? null,
      reviewComments: parsed.header.reviewComments ?? record.reviewComments ?? null,
    };

    const existingId = record.id ?? parsed.header.id;
    let existing: any = null;
    if (existingId) {
      existing = await prisma.developmentRecord.findUnique({ where: { id: existingId } });
    }
    if (!existing) {
      existing = await prisma.developmentRecord.findFirst({
        where: { moduleType, recordCode: dbData.recordCode },
      });
    }

    let saved;
    if (existing) {
      saved = await prisma.developmentRecord.update({
        where: { id: existing.id },
        data: {
          ...dbData,
          recordCode: undefined, // don't update unique code
        },
        include: {
          attachments: true,
          approvals: { orderBy: { sortOrder: "asc" } },
          activities: { orderBy: { timestamp: "desc" } },
        },
      });
    } else {
      saved = await prisma.developmentRecord.create({
        data: dbData,
        include: {
          attachments: true,
          approvals: { orderBy: { sortOrder: "asc" } },
          activities: { orderBy: { timestamp: "desc" } },
        },
      });
    }

    await prisma.developmentActivityLog.create({
      data: {
        recordId: saved.id,
        user: dbData.ownerName || "System",
        action: existing ? "Draft Updated" : "Record Created",
        description: existing
          ? `Draft saved for ${dbData.projectName}`
          : `New ${moduleType} record created: ${dbData.projectName}`,
      },
    });

    return toApiShape(saved);
  });

export const submitDevelopmentFn = createServerFn({ method: "POST" })
  .validator((data: { moduleType: string; id: string }) => data)
  .handler(async ({ data }) => {
    const record = await prisma.developmentRecord.update({
      where: { id: data.id },
      data: { workflowStatus: "In Review" },
      include: {
        attachments: true,
        approvals: { orderBy: { sortOrder: "asc" } },
        activities: { orderBy: { timestamp: "desc" } },
      },
    });

    await prisma.developmentActivityLog.create({
      data: {
        recordId: record.id,
        user: record.ownerName,
        action: "Submitted for Review",
        description: `${record.projectName} submitted for review`,
        prevStatus: "Draft",
        newStatus: "In Review",
      },
    });

    return toApiShape(record);
  });

export const reviewDevelopmentFn = createServerFn({ method: "POST" })
  .validator(
    (data: { id: string; decision: string; comments?: string; reviewerRole: string; reviewerName: string }) => data
  )
  .handler(async ({ data }) => {
    await prisma.developmentApproval.create({
      data: {
        recordId: data.id,
        role: data.reviewerRole,
        person: data.reviewerName,
        decision: data.decision,
        status: data.decision,
        date: new Date(),
        comments: data.comments ?? "",
      },
    });

    const newStatus = data.decision === "Approved" ? "Approved" : data.decision === "Rejected" ? "Rejected" : "In Review";

    const record = await prisma.developmentRecord.update({
      where: { id: data.id },
      data: {
        workflowStatus: newStatus,
        approvalDecision: data.decision,
        approvalDate: new Date(),
        reviewComments: data.comments ?? null,
      },
      include: {
        attachments: true,
        approvals: { orderBy: { sortOrder: "asc" } },
        activities: { orderBy: { timestamp: "desc" } },
      },
    });

    await prisma.developmentActivityLog.create({
      data: {
        recordId: record.id,
        user: data.reviewerName,
        action: `Review Decision: ${data.decision}`,
        description: `${data.reviewerRole} ${data.reviewerName}: ${data.decision}`,
        prevStatus: "In Review",
        newStatus,
      },
    });

    return toApiShape(record);
  });
