import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { SupplyChainManagementTabBar } from "@/components/erp/SupplyChainManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/supply-chain-management/reports")({
  head: () => ({
    meta: [
      { title: "Supply Chain Executive Report · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated executive supply chain report, demand forecasting accuracy, S&OP consensus status, and submodule completion.",
      },
    ],
  }),
  component: SupplyChainManagementReportPage,
});

function SupplyChainManagementReportPage() {
  return (
    <AppShell
      title="Supply Chain Executive Report"
      breadcrumb="Management > Supply Chain > Report"
      description="Consolidated supply chain intelligence, demand planning accuracy, multi-tier procurement requirement, and S&OP workflow status."
      tabs={<SupplyChainManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="supply-chain-management" />
    </AppShell>
  );
}

export default SupplyChainManagementReportPage;
