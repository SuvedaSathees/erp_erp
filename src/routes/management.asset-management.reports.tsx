import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AssetManagementTabBar } from "@/components/erp/AssetManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/asset-management/reports")({
  head: () => ({
    meta: [
      { title: "Asset Lifecycle Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, capital asset valuation, maintenance compliance, and equipment uptime.",
      },
    ],
  }),
  component: AssetManagementReportPage,
});

function AssetManagementReportPage() {
  return (
    <AppShell
      title="Asset Lifecycle Report"
      breadcrumb="Management > Asset > Report"
      description="Consolidated capital asset report, preventive maintenance compliance, equipment availability, and calibration status."
      tabs={<AssetManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="asset-management" />
    </AppShell>
  );
}
