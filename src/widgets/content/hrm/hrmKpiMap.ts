import type { WidgetPageId } from "../../types";

export const HRM_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "hrm-overview": {
    "Total Employees": "kpi.hrm.total-employees",
    "Active Workforce": "kpi.hrm.active-workforce",
    "Monthly Payroll": "kpi.hrm.monthly-payroll",
    "Open Requisitions": "kpi.hrm.open-requisitions",
    "Attendance Rate": "kpi.hrm.attendance-rate",
    "Onboarding Candidates": "kpi.hrm.onboarding-in-progress",
    "Pending Leave Requests": "kpi.hrm.pending-leaves",
    "Training Hours (Mo)": "kpi.hrm.training-hours",
    "Retention Rate": "kpi.hrm.retention-rate",
    "Avg Performance Score": "kpi.hrm.performance-score",
  },
};
