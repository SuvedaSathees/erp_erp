import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma.server";
import type {
  AuditLogEntry,
  SensitiveChangeRecord,
  AuditDashboardData,
} from "@/services/types";

const MODULE_COLORS: Record<string, string> = {
  "Accounts Payable": "#3B82F6",
  "Accounts Receivable": "#10B981",
  "Cash & Bank": "#F59E0B",
  "Tax Management": "#EC4899",
  "Fixed Assets": "#8B5CF6",
  "Budgeting": "#06B6D4",
  "Cost Centers": "#F97316",
  "Jig Development": "#6366F1",
  "Factory Layout": "#14B8A6",
  "Capacity Planning": "#84CC16",
  "Work Instructions": "#A855F7",
  "SOP Management": "#E11D48",
};

const SENSITIVE_KEYWORDS = ["delete", "void", "write-off", "reject", "archive"];

function mapToAuditLog(
  raw: {
    id: string;
    user: string;
    action: string;
    description: string;
    prevStatus?: string | null;
    newStatus?: string | null;
    timestamp: Date;
    [key: string]: any;
  },
  moduleName: string,
  refField: string,
): { entry: AuditLogEntry; rawDate: Date } {
  const actionLower = (raw.action || "").toLowerCase();
  let activityType: AuditLogEntry["activityType"] = "Update";
  if (actionLower.includes("create")) activityType = "Create";
  else if (actionLower.includes("delete") || actionLower.includes("void")) activityType = "Delete";
  else if (actionLower.includes("approve")) activityType = "Approve";
  else if (actionLower.includes("run") || actionLower.includes("post")) activityType = "Run";
  else if (actionLower.includes("login")) activityType = "Login";
  else if (actionLower.includes("logout")) activityType = "Logout";
  else if (actionLower.includes("export")) activityType = "Export";

  const entry: AuditLogEntry = {
    id: raw.id,
    timestamp: new Date(raw.timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    user: raw.user || "System",
    module: moduleName,
    activityType,
    description: raw.description || raw.action,
    referenceId: raw[refField] ? String(raw[refField]) : raw.id,
    status: "Success",
    ipAddress: "127.0.0.1 (Internal)",
    details: {
      before: raw.prevStatus ? { status: raw.prevStatus } : undefined,
      after: raw.newStatus ? { status: raw.newStatus } : undefined,
      metadata: {
        action: raw.action,
        module: moduleName,
      },
    },
  };

  return { entry, rawDate: new Date(raw.timestamp) };
}

export type AuditTrailQueryParams = {
  fiscalYear?: string;
  companyId?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  module?: string;
  activityType?: string;
  status?: string;
};

export const getAuditTrailDashboardFn = createServerFn({ method: "POST" })
  .validator((d: AuditTrailQueryParams) => d)
  .handler(async ({ data }) => {
    try {
      // 1. Query all 12 ActivityLog tables in parallel
      const [
        payableLogs,
        receivableLogs,
        bankLogs,
        taxLogs,
        assetLogs,
        budgetLogs,
        costCenterLogs,
        jigLogs,
        factoryLogs,
        capacityLogs,
        workInstructionLogs,
        sopLogs,
      ] = await Promise.all([
        prisma.payableActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.receivableActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.bankAccountActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.taxActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.fixedAssetActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.budgetActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.costCenterActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.jigActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.factoryActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.capacityActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.workInstructionActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
        prisma.sopActivityLog.findMany({ take: 250, orderBy: { timestamp: "desc" } }),
      ]);

      // 2. Tag with module name and normalize to unified shape
      const rawList: { entry: AuditLogEntry; rawDate: Date }[] = [
        ...payableLogs.map((r: any) => mapToAuditLog(r, "Accounts Payable", "invoiceId")),
        ...receivableLogs.map((r: any) => mapToAuditLog(r, "Accounts Receivable", "invoiceId")),
        ...bankLogs.map((r: any) => mapToAuditLog(r, "Cash & Bank", "bankAccountId")),
        ...taxLogs.map((r: any) => mapToAuditLog(r, "Tax Management", "obligationId")),
        ...assetLogs.map((r: any) => mapToAuditLog(r, "Fixed Assets", "assetId")),
        ...budgetLogs.map((r: any) => mapToAuditLog(r, "Budgeting", "budgetId")),
        ...costCenterLogs.map((r: any) => mapToAuditLog(r, "Cost Centers", "costCenterId")),
        ...jigLogs.map((r: any) => mapToAuditLog(r, "Jig Development", "jigId")),
        ...factoryLogs.map((r: any) => mapToAuditLog(r, "Factory Layout", "layoutId")),
        ...capacityLogs.map((r: any) => mapToAuditLog(r, "Capacity Planning", "planningId")),
        ...workInstructionLogs.map((r: any) => mapToAuditLog(r, "Work Instructions", "workInstructionId")),
        ...sopLogs.map((r: any) => mapToAuditLog(r, "SOP Management", "sopRecordId")),
      ];

      // 3. Sort all records by timestamp DESC
      rawList.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
      const allEntries = rawList.map((item) => item.entry);

      // 4. Option A: Sensitive Changes Detection (keyword-based)
      const sensitiveEntries = allEntries.filter((e) => {
        const text = `${e.description} ${e.activityType} ${e.details?.metadata?.action || ""}`.toLowerCase();
        return SENSITIVE_KEYWORDS.some((kw) => text.includes(kw));
      });

      const sensitiveChanges: SensitiveChangeRecord[] = sensitiveEntries.map((e) => ({
        id: e.id,
        changeType: e.activityType,
        referenceId: e.referenceId,
        timestamp: e.timestamp,
        user: e.user,
        severity: e.activityType === "Delete" ? "Critical" : "High",
        description: e.description,
      }));

      // 5. Compute real KPIs
      const totalActivities = allEntries.length;
      const uniqueUsers = new Set(allEntries.map((e) => e.user)).size;

      const kpis = {
        totalActivitiesYTD: totalActivities,
        totalActivitiesYTDDelta: 0,
        uniqueUsersCount: uniqueUsers,
        uniqueUsersDelta: 0,
        successfulActivitiesCount: totalActivities, // 100% of real logged operations
        successfulActivitiesDelta: 0,
        failedActivitiesCount: 0, // No error records in activity logs
        failedActivitiesDelta: 0,
        sensitiveChangesCount: sensitiveChanges.length,
        sensitiveChangesDelta: 0,
      };

      // 6. Compute Module Splits
      const moduleCounts: Record<string, number> = {};
      for (const e of allEntries) {
        moduleCounts[e.module] = (moduleCounts[e.module] || 0) + 1;
      }

      const moduleSplits = Object.entries(moduleCounts).map(([name, count]) => ({
        name,
        value: count,
        percentage: totalActivities > 0 ? Number(((count / totalActivities) * 100).toFixed(1)) : 0,
        color: MODULE_COLORS[name] || "#6B7280",
      }));

      // 7. Compute Activity Trend (Monthly Aggregation)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentMonthIdx = new Date().getMonth();
      const activityTrend = months.slice(0, currentMonthIdx + 1).map((month) => ({
        month,
        value: allEntries.filter((e) => e.timestamp.includes(month)).length,
      }));

      // 8. Pagination & Filtering for logs table
      const params = data || {};
      let filteredLogs = allEntries;

      if (params.search) {
        const q = params.search.toLowerCase();
        filteredLogs = filteredLogs.filter(
          (l) =>
            l.user.toLowerCase().includes(q) ||
            l.description.toLowerCase().includes(q) ||
            l.referenceId.toLowerCase().includes(q),
        );
      }

      if (params.module && params.module !== "All") {
        filteredLogs = filteredLogs.filter((l) => l.module === params.module);
      }

      if (params.activityType && params.activityType !== "All") {
        filteredLogs = filteredLogs.filter((l) => l.activityType === params.activityType);
      }

      if (params.status && params.status !== "All") {
        filteredLogs = filteredLogs.filter((l) => l.status === params.status);
      }

      const page = Math.max(1, params.page || 1);
      const pageSize = Math.max(1, params.pageSize || 100);
      const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

      const payload: AuditDashboardData = {
        kpis,
        logs: paginatedLogs,
        activityTrend,
        moduleSplits,
        sensitiveChanges,
        securityEvents: [], // Empty state (not tracked in DB)
        configLogs: [], // Empty state (not tracked in DB)
      };

      return { success: true as const, data: payload, total: filteredLogs.length };
    } catch (err) {
      return { success: false as const, error: (err as Error).message, data: null };
    }
  });

export const getAuditLogDetailFn = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    try {
      const id = data.id;

      // Check all 12 tables for the specific log ID
      const [
        payable,
        receivable,
        bank,
        tax,
        asset,
        budget,
        costCenter,
        jig,
        factory,
        capacity,
        workInstruction,
        sop,
      ] = await Promise.all([
        prisma.payableActivityLog.findUnique({ where: { id } }),
        prisma.receivableActivityLog.findUnique({ where: { id } }),
        prisma.bankAccountActivityLog.findUnique({ where: { id } }),
        prisma.taxActivityLog.findUnique({ where: { id } }),
        prisma.fixedAssetActivityLog.findUnique({ where: { id } }),
        prisma.budgetActivityLog.findUnique({ where: { id } }),
        prisma.costCenterActivityLog.findUnique({ where: { id } }),
        prisma.jigActivityLog.findUnique({ where: { id } }),
        prisma.factoryActivityLog.findUnique({ where: { id } }),
        prisma.capacityActivityLog.findUnique({ where: { id } }),
        prisma.workInstructionActivityLog.findUnique({ where: { id } }),
        prisma.sopActivityLog.findUnique({ where: { id } }),
      ]);

      if (payable) return { success: true as const, data: mapToAuditLog(payable, "Accounts Payable", "invoiceId").entry };
      if (receivable) return { success: true as const, data: mapToAuditLog(receivable, "Accounts Receivable", "invoiceId").entry };
      if (bank) return { success: true as const, data: mapToAuditLog(bank, "Cash & Bank", "bankAccountId").entry };
      if (tax) return { success: true as const, data: mapToAuditLog(tax, "Tax Management", "obligationId").entry };
      if (asset) return { success: true as const, data: mapToAuditLog(asset, "Fixed Assets", "assetId").entry };
      if (budget) return { success: true as const, data: mapToAuditLog(budget, "Budgeting", "budgetId").entry };
      if (costCenter) return { success: true as const, data: mapToAuditLog(costCenter, "Cost Centers", "costCenterId").entry };
      if (jig) return { success: true as const, data: mapToAuditLog(jig, "Jig Development", "jigId").entry };
      if (factory) return { success: true as const, data: mapToAuditLog(factory, "Factory Layout", "layoutId").entry };
      if (capacity) return { success: true as const, data: mapToAuditLog(capacity, "Capacity Planning", "planningId").entry };
      if (workInstruction) return { success: true as const, data: mapToAuditLog(workInstruction, "Work Instructions", "workInstructionId").entry };
      if (sop) return { success: true as const, data: mapToAuditLog(sop, "SOP Management", "sopRecordId").entry };

      return { success: true as const, data: null };
    } catch (err) {
      return { success: false as const, error: (err as Error).message, data: null };
    }
  });
