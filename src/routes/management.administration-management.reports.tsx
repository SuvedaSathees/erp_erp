import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/administration-management/reports")({
  head: () => ({
    meta: [
      { title: "Organization Governance Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, corporate governance, branches, and compliance audit for Organization Management.",
      },
    ],
  }),
  component: AdminManagementReportPage,
});

function AdminManagementReportPage() {
  return (
    <AppShell
      title="Organization Governance Report"
      breadcrumb="Management > Organization > Report"
      description="Consolidated executive report, organizational hierarchy, master data governance, and compliance audit."
      tabs={<AdminManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="administration-management" />
    </AppShell>
  );
}
