import { createFileRoute } from "@tanstack/react-router";
import { redirect } from "@tanstack/react-router";
import ComplianceReportingManagementPage from "@/pages/management.quality-management.compliance-reporting";

export const Route = createFileRoute("/management/quality-management/compliance-reporting")({
  beforeLoad: () => {
    throw redirect({ to: "/management/risk-management/compliance-reporting" });
  },
  component: ComplianceReportingManagementPage,
});
