import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/sales-management/reports")({
  head: () => ({
    meta: [
      { title: "Sales Executive Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, pipeline conversion, order fulfillment, and commission metrics for Sales Management.",
      },
    ],
  }),
  component: SalesManagementReportPage,
});

function SalesManagementReportPage() {
  return (
    <AppShell
      title="Sales Executive Report"
      breadcrumb="Management > Sales > Report"
      description="Consolidated commercial report, revenue trajectory, order conversion, and sales team performance."
      tabs={<SalesManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="sales-management" />
    </AppShell>
  );
}
