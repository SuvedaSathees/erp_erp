// Magnertia ERP - Audit Compliance Route (Quality Management Alias)
// Management -> Quality Management -> Audit Compliance

import { createFileRoute } from "@tanstack/react-router";
import AuditComplianceManagementPage from "@/pages/management.risk-management.audit-compliance";

export const Route = createFileRoute("/management/quality-management/audit-compliance")({
  component: AuditComplianceManagementPage,
});
