import { createFileRoute } from "@tanstack/react-router";
import ComplianceReportingManagementPage from "./management.quality-management.compliance-reporting";

export const Route = createFileRoute(
  "/management/risk-management/compliance-reporting",
)({
  component: ComplianceReportingManagementPage,
});
