import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/strategy-management/reports")({
  head: () => ({
    meta: [
      { title: "Reports · Strategy Management · Magnertia ERP" },
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
      title="Reports"
      breadcrumb="Management"
      description="Consolidated strategic report, balanced scorecard execution trajectory, OKR achievement health, and initiative portfolio delivery."
      tabs={<StrategyManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="strategy-management" />
    </AppShell>
  );
}
