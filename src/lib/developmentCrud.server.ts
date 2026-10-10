import { prisma } from "./prisma.server";
import { toApiShape, fromApiShape } from "./developmentTransform";
import { calculateScores } from "./developmentScores";

export async function getDevelopmentRecordFn({ data }: { data: { moduleType: string; id?: string } }) {
    const where: any = { moduleType: data.moduleType };
    if (data.id) where.id = data.id;

    const record = await prisma.developmentRecord.findFirst({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        attachments: { orderBy: { createdAt: "desc" } },
        approvals: { orderBy: { sortOrder: "asc" } },
        activities: { orderBy: { timestamp: "desc" } },
      },
    });

    return toApiShape(record);
}

export async function listDevelopmentRecordsFn({ data }: { data: { moduleType: string; status?: string; limit?: number; offset?: number } }) {
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
}

export async function saveDevelopmentDraftFn({ data }: { data: { moduleType: string; record: any } }) {
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
    if (!existing && dbData.recordCode) {
      existing = await prisma.developmentRecord.findFirst({
        where: { moduleType, recordCode: dbData.recordCode },
      });
    }
    if (!existing && !dbData.recordCode) {
      // Single-record modules whose form carries no record id or code are editing that one record;
      // modules with several records (lists) create a new one.
      const rows = await prisma.developmentRecord.findMany({ where: { moduleType }, select: { id: true }, take: 2 });
      if (rows.length === 1) existing = await prisma.developmentRecord.findUnique({ where: { id: rows[0].id } });
    }
    if (!existing) {
      // New record: the code must be unique across all modules.
      if (!dbData.recordCode) dbData.recordCode = `${moduleType}-${Date.now()}`;
      else if (await prisma.developmentRecord.findUnique({ where: { recordCode: dbData.recordCode }, select: { id: true } }))
        dbData.recordCode = `${dbData.recordCode}-${moduleType}-${Date.now()}`;
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
}

export async function submitDevelopmentFn({ data }: { data: { moduleType: string; id: string } }) {
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
}

export async function reviewDevelopmentFn({ data }: { data: { id: string; decision: string; comments?: string; reviewerRole: string; reviewerName: string } }) {
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
}
