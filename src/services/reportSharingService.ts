import { apiRequest } from "./apiClient";
import { reports, reportShares } from "@/lib/reportData";
import type { ReportShareRecord, NewReportShareInput, DashboardQuery } from "./types";

export function fetchSharedReportsLogs(query: DashboardQuery): Promise<ReportShareRecord[]> {
  return apiRequest(`/api/financial/reports/shares?fy=${query.fiscalYear}`, () => reportShares);
}

export function shareReport(input: NewReportShareInput): Promise<ReportShareRecord> {
  return apiRequest(`/api/financial/reports/shares`, () => {
    const reportName =
      reports.find((r) => r.id === input.reportId)?.name || "Financial Statement";
    const nextId = `SHR-0${reportShares.length + 1}`;
    const newShare: ReportShareRecord = {
      id: nextId,
      reportId: input.reportId,
      reportName,
      sharedWith: input.sharedWith,
      dateShared: new Date().toISOString().substring(0, 10),
      accessLevel: input.accessLevel,
    };
    reportShares.unshift(newShare);
    return newShare;
  });
}
