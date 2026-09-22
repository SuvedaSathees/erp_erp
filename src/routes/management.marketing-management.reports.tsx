import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/marketing-management/reports")({
  head: () => ({
    meta: [
      { title: "Marketing Executive Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, campaign conversion, channel performance, and ROI metrics for Marketing Management.",
      },
    ],
  }),
  component: MarketingManagementReportPage,
});

function MarketingManagementReportPage() {
  return (
    <AppShell
      title="Marketing Executive Report"
      breadcrumb="Management > Marketing > Report"
      description="Consolidated marketing executive report, campaign reach trajectory, pipeline attribution, and channel ROAS."
      tabs={<MarketingManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="marketing-management" />
    </AppShell>
  );
}

export default MarketingManagementReportPage;
