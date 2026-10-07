import { createFileRoute } from "@tanstack/react-router";
import AuditComplianceManagementPage from "@/pages/management.risk-management.audit-compliance";

export const Route = createFileRoute("/management/risk-management/audit-compliance")({
  component: AuditComplianceManagementPage,
});
