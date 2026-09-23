/**
 * Transform between DB shape (DevelopmentRecord with JSONB formData)
 * and API shape (flat object matching existing TypeScript types).
 */

const HEADER_FIELDS = new Set([
  "id",
  "moduleType",
  "recordCode",
  "formCode",
  "projectName",
  "version",
  "workflowStatus",
  "stage",
  "priority",
  "ownerName",
  "ownerEmail",
  "businessUnit",
  "department",
  "overallScore",
  "recommendation",
  "approvalDecision",
  "approvalDate",
  "reviewComments",
  "nextReviewDate",
  "effectiveDate",
  "createdAt",
  "updatedAt",
]);

const CHILD_RELATIONS = new Set([
  "attachments",
  "approvals",
  "activities",
]);

export function toApiShape(dbRecord: any): any {
  if (!dbRecord) return null;
  const { formData, sectionScores, aiAssessment, attachments, approvals, activities, ...header } = dbRecord;
  const fd = typeof formData === "string" ? JSON.parse(formData) : (formData ?? {});
  const scores = typeof sectionScores === "string" ? JSON.parse(sectionScores) : (sectionScores ?? {});
  const ai = typeof aiAssessment === "string" ? JSON.parse(aiAssessment) : (aiAssessment ?? {});

  const reviewers = (approvals ?? []).map((a: any) => ({
    id: a.id,
    role: a.role,
    person: a.person,
    reviewer: a.person,
    decision: a.decision,
    status: a.status,
    date: a.date ? new Date(a.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null,
    comments: a.comments ?? "",
  }));

  const auditTrail = (activities ?? []).map((a: any) => ({
    id: a.id,
    timestamp: a.timestamp ? new Date(a.timestamp).toLocaleString("en-IN") : "",
    user: a.user,
    action: a.action,
    description: a.description,
    stage: a.prevStatus ?? "",
  }));

  const attachmentList = (attachments ?? []).map((a: any) => ({
    id: a.id,
    fileName: a.fileName,
    filename: a.fileName,
    name: a.fileName,
    fileType: a.fileType,
    documentType: a.documentType,
    version: a.version,
    uploadedBy: a.uploadedBy,
    uploader: a.uploadedBy,
    uploadedDate: a.uploadedDate ? new Date(a.uploadedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
    uploadedAt: a.uploadedDate ? new Date(a.uploadedDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "",
    fileSize: a.fileSize,
    size: a.fileSize,
    status: a.status,
    downloadUrl: a.downloadUrl,
    source: "database",
  }));

  return {
    ...header,
    ...fd,
    ...scores,
    ...ai,
    reviewers,
    auditTrail,
    attachments: attachmentList,
    activityHistory: auditTrail,
  };
}

export function fromApiShape(flat: any, moduleType: string): {
  header: Record<string, any>;
  formData: Record<string, any>;
  sectionScores: Record<string, any>;
  aiAssessment: Record<string, any>;
  attachments: any[];
  approvals: any[];
  activities: any[];
} {
  const header: Record<string, any> = {};
  const formData: Record<string, any> = {};
  const sectionScores: Record<string, any> = {};
  const aiAssessment: Record<string, any> = {};
  const attachments: any[] = [];
  const approvals: any[] = [];
  const activities: any[] = [];

  for (const [key, value] of Object.entries(flat ?? {})) {
    if (HEADER_FIELDS.has(key)) {
      header[key] = value;
    } else if (key === "reviewers" && Array.isArray(value)) {
      for (const r of value) {
        approvals.push({
          role: r.role ?? "",
          person: r.person ?? r.reviewer ?? "",
          decision: r.decision ?? "Pending",
          status: r.status ?? "Pending",
          date: r.date ? new Date(r.date) : null,
          comments: r.comments ?? "",
          sortOrder: approvals.length,
        });
      }
    } else if ((key === "auditTrail" || key === "activityHistory") && Array.isArray(value)) {
      for (const a of value) {
        activities.push({
          user: a.user ?? "",
          action: a.action ?? "",
          description: a.description ?? "",
          prevStatus: a.stage ?? a.prevStatus ?? null,
          newStatus: a.newStatus ?? null,
        });
      }
    } else if (key === "attachments" && Array.isArray(value)) {
      for (const a of value) {
        attachments.push({
          fileName: a.fileName ?? a.filename ?? a.name ?? "",
          fileType: a.fileType ?? a.type ?? "",
          documentType: a.documentType ?? "General",
          version: a.version ?? "v1.0",
          uploadedBy: a.uploadedBy ?? a.uploader ?? "",
          fileSize: a.fileSize ?? a.size ?? "",
          status: a.status ?? "Active",
          downloadUrl: a.downloadUrl ?? null,
        });
      }
    } else if (key.startsWith("ai") && typeof value === "string" && key.endsWith("Score")) {
      aiAssessment[key] = value;
    } else if (key.startsWith("ai") && typeof value === "string" && value.length > 20) {
      aiAssessment[key] = value;
    } else if (key.endsWith("Score") && typeof value === "number") {
      sectionScores[key] = value;
    } else if (!CHILD_RELATIONS.has(key)) {
      formData[key] = value;
    }
  }

  return { header, formData, sectionScores, aiAssessment, attachments, approvals, activities };
}
