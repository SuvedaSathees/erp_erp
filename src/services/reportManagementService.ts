import { apiRequest } from "./apiClient";
import { reports } from "@/lib/reportData";
import type { ReportRecord, NewReportInput, DashboardQuery } from "./types";

export function fetchReports(query: DashboardQuery): Promise<ReportRecord[]> {
  return apiRequest(`/api/financial/reports?fy=${query.fiscalYear}`, () => reports);
}

export function retrieveReportDetails(reportId: string): Promise<ReportRecord> {
  return apiRequest(
    `/api/financial/reports/${reportId}`,
    () => reports.find((r) => r.id === reportId) || reports[0],
  );
}

export function saveReportTemplate(input: NewReportInput): Promise<ReportRecord> {
  return apiRequest(`/api/financial/reports`, () => {
    const nextId = `REP-0${reports.length + 1}`;
    const newRep: ReportRecord = {
      id: nextId,
      name: input.name,
      description: input.description,
      category: input.category,
      type: input.type,
      lastModified: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      lastModifiedBy: "Amit Mehra",
      isFavorite: false,
    };
    reports.unshift(newRep);
    return newRep;
  });
}

export function manageReport(
  reportId: string,
  updates: Partial<ReportRecord>,
): Promise<ReportRecord> {
  return apiRequest(`/api/financial/reports/${reportId}/manage`, () => {
    const rep = reports.find((r) => r.id === reportId);
    if (rep) {
      Object.assign(rep, updates);
      return rep;
    }
    throw new Error("Report not found");
  });
}

export async function fetchLiveReportPayload(
  reportId: string,
  query: DashboardQuery,
): Promise<{ success: boolean; reportType: string; data: any }> {
  try {
    const { getLiveReportPayloadFn } = await import("@/lib/financialReportsFns.server");
    const res = await getLiveReportPayloadFn({ data: { reportId, query } });
    if (res.success) return res;
  } catch (err) {
    console.error("Failed to fetch live report payload:", err);
  }
  return { success: true, reportType: "Mock", data: null };
}
