import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProcurementManagementTabBar } from "@/components/erp/ProcurementManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/procurement-management/reports")({
  head: () => ({
    meta: [
      { title: "Procurement Executive Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, supplier compliance, spend analytics, and PO fulfillment for Procurement Management.",
      },
    ],
  }),
  component: ProcurementManagementReportPage,
});

function ProcurementManagementReportPage() {
  return (
    <AppShell
      title="Procurement Executive Report"
      breadcrumb="Management > Procurement > Report"
      description="Consolidated procurement analytics, purchase order spend, vendor performance, and cost savings."
      tabs={<ProcurementManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="procurement-management" />
    </AppShell>
  );
}
