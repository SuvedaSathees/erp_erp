import type { WidgetPageId } from "../../types";

export const ADMIN_PAGE_KPIS: Partial<Record<WidgetPageId, Record<string, string>>> = {
  "admin-overview": {
    "Total Branches": "kpi.admin.total-branches",
    "Active Departments": "kpi.admin.active-departments",
    "Active System Users": "kpi.admin.active-users",
    "RBAC Roles Configured": "kpi.admin.roles-permissions",
    "Pending Matrix Approvals": "kpi.admin.pending-approvals",
    "Controlled Documents": "kpi.admin.controlled-documents",
    "Active Governance Policies": "kpi.admin.active-policies",
    "Master Data Entities": "kpi.admin.master-data-entities",
    "Security & Audit Score": "kpi.admin.system-audit-score",
    "Unread System Alerts": "kpi.admin.system-notifications",
  },
};
