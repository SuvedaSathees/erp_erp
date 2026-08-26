import type {
  AuditLogEntry,
  SensitiveChangeRecord,
  SecurityEventEntry,
  ConfigurationLogEntry,
  DashboardQuery,
} from "./types";

export async function fetchAuditLogs(query: DashboardQuery): Promise<AuditLogEntry[]> {
  const { getAuditTrailDashboardFn } = await import("@/lib/auditTrailFns.server");
  const res = await getAuditTrailDashboardFn({ data: { fiscalYear: query.fiscalYear, companyId: query.companyId } });
  if (res?.success && res.data) {
    return res.data.logs;
  }
  return [];
}

export async function fetchLogDetails(id: string): Promise<AuditLogEntry | null> {
  const { getAuditLogDetailFn } = await import("@/lib/auditTrailFns.server");
  const res = await getAuditLogDetailFn({ data: { id } });
  if (res?.success) {
    return res.data;
  }
  return null;
}

export function fetchSecurityEvents(_query: DashboardQuery): Promise<SecurityEventEntry[]> {
  // Security events table is not in schema; return honest empty state
  return Promise.resolve([]);
}

export function fetchConfigurationLogs(_query: DashboardQuery): Promise<ConfigurationLogEntry[]> {
  // Configuration logs table is not in schema; return honest empty state
  return Promise.resolve([]);
}

export async function fetchRecentSensitiveChanges(
  query: DashboardQuery,
): Promise<SensitiveChangeRecord[]> {
  const { getAuditTrailDashboardFn } = await import("@/lib/auditTrailFns.server");
  const res = await getAuditTrailDashboardFn({ data: { fiscalYear: query.fiscalYear, companyId: query.companyId } });
  if (res?.success && res.data) {
    return res.data.sensitiveChanges;
  }
  return [];
}

