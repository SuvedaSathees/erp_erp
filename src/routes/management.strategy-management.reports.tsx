import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/strategy-management/reports")({
  head: () => ({
    meta: [
      { title: "Strategy Management Report · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive summary report, corporate purpose, strategic alignment metrics, balanced scorecards, and enterprise OKR governance for Strategy Management.",
      },
    ],
  }),
  component: StrategyManagementReportPage,
});

function StrategyManagementReportPage() {
  return (
    <AppShell
      title="Strategy Management Report"
      breadcrumb="Management > Strategy > Report"
      description="Consolidated strategic report, balanced scorecard execution trajectory, OKR achievement health, and initiative portfolio delivery."
      tabs={<StrategyManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="strategy-management" />
    </AppShell>
  );
}
