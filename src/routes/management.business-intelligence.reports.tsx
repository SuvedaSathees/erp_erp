import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute(
  "/management/business-intelligence/reports",
)({
  head: () => ({
    meta: [
      { title: "Business Intelligence Report · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive summary report, strategic KPIs, telemetry health, data pipelines, and decision-support intelligence for Business Intelligence Management.",
      },
    ],
  }),
  component: BusinessIntelligenceReportPage,
});

function BusinessIntelligenceReportPage() {
  return (
    <AppShell
      title="Business Intelligence Report"
      breadcrumb="Management > Business Intelligence > Report"
      description="Consolidated business intelligence report, strategic KPI trends, ETL pipeline throughput, and executive decision metrics."
      tabs={<BusinessIntelligenceTabBar />}
    >
      <ModuleSummaryReport moduleId="business-intelligence" />
    </AppShell>
  );
}
