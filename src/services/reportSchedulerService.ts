import { apiRequest } from "./apiClient";
import { reports, reportSchedules } from "@/lib/reportData";
import type { ReportScheduleRecord, NewReportScheduleInput, DashboardQuery } from "./types";

export function fetchScheduledReports(query: DashboardQuery): Promise<ReportScheduleRecord[]> {
  return apiRequest(
    `/api/financial/reports/schedules?fy=${query.fiscalYear}`,
    () => reportSchedules,
  );
}

export function configureSchedule(input: NewReportScheduleInput): Promise<ReportScheduleRecord> {
  return apiRequest(`/api/financial/reports/schedules`, () => {
    const reportName =
      reports.find((r) => r.id === input.reportId)?.name || "Financial Statement";
    const nextId = `SCH-0${reportSchedules.length + 1}`;
    const newSch: ReportScheduleRecord = {
      id: nextId,
      reportId: input.reportId,
      reportName,
      frequency: input.frequency,
      format: input.format,
      recipients: input.recipients,
      status: "Active" as const,
      nextRun: new Date(Date.now() + 86400000 * 7).toISOString().replace("T", " ").substring(0, 16),
    };
    reportSchedules.unshift(newSch);
    return newSch;
  });
}
