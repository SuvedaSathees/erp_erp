import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessDevelopmentTabBar } from "@/components/erp/BusinessDevelopmentTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/development/business-development/reports")({
  head: () => ({
    meta: [
      { title: "Business Development Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, commercial pipeline conversion, and strategic submodule progress.",
      },
    ],
  }),
  component: BusinessDevelopmentReportPage,
});

function BusinessDevelopmentReportPage() {
  return (
    <AppShell
      title="Business Development Report"
      breadcrumb="Development > Business Development > Report"
      description="Consolidated executive report, commercial pipeline conversion, and strategic submodule progress."
      tabs={<BusinessDevelopmentTabBar />}
    >
      <ModuleSummaryReport moduleId="business-development" />
    </AppShell>
  );
}
