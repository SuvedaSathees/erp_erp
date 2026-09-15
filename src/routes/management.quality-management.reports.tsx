import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { QualityManagementTabBar } from "@/components/erp/QualityManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/quality-management/reports")({
  head: () => ({
    meta: [
      { title: "Quality Assurance Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, first pass yield, NCR/CAPA compliance, and inspection audits for Quality Management.",
      },
    ],
  }),
  component: QualityManagementReportPage,
});

function QualityManagementReportPage() {
  return (
    <AppShell
      title="Quality Assurance Report"
      breadcrumb="Management > Quality > Report"
      description="Consolidated quality report, manufacturing yield rates, non-conformance resolution, and CAPA audit metrics."
      tabs={<QualityManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="quality-management" />
    </AppShell>
  );
}
