import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ManufacturingDevelopmentTabBar } from "@/components/erp/ManufacturingDevelopmentTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/development/manufacturing-development/reports")({
  head: () => ({
    meta: [
      { title: "Manufacturing Development Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, APQP gate status, and shop floor readiness for Manufacturing Development.",
      },
    ],
  }),
  component: ManufacturingDevelopmentReportPage,
});

function ManufacturingDevelopmentReportPage() {
  return (
    <AppShell
      title="Manufacturing Development Report"
      breadcrumb="Development > Manufacturing Development > Report"
      description="Consolidated executive report, plant readiness scores, APQP gates, tooling metrics, and OEE indicators."
      tabs={<ManufacturingDevelopmentTabBar />}
    >
      <ModuleSummaryReport moduleId="manufacturing-development" />
    </AppShell>
  );
}
