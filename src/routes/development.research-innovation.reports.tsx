import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ResearchInnovationTabBar } from "@/components/erp/ResearchInnovationTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/development/research-innovation/reports")({
  head: () => ({
    meta: [
      { title: "Research & Innovation Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, patent pipeline, and simulation metrics for Research & Innovation.",
      },
    ],
  }),
  component: ResearchInnovationReportPage,
});

function ResearchInnovationReportPage() {
  return (
    <AppShell
      title="Research & Innovation Report"
      breadcrumb="Development > Research & Innovation > Report"
      description="Consolidated executive report, TRL progression, CAE simulations, patents, and advanced technology programs."
      tabs={<ResearchInnovationTabBar />}
    >
      <ModuleSummaryReport moduleId="research-innovation" />
    </AppShell>
  );
}
