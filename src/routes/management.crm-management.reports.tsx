import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/crm-management/reports")({
  head: () => ({
    meta: [
      { title: "CRM Executive Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, customer retention, opportunity pipeline, and support SLAs for CRM Management.",
      },
    ],
  }),
  component: CrmManagementReportPage,
});

function CrmManagementReportPage() {
  return (
    <AppShell
      title="CRM Executive Report"
      breadcrumb="Management > CRM > Report"
      description="Consolidated customer intelligence report, lead funnel, support resolution rates, and satisfaction metrics."
      tabs={<CrmManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="crm-management" />
    </AppShell>
  );
}
