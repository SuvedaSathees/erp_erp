import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { HrmManagementTabBar } from "@/components/erp/HrmManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/hrm-management/reports")({
  head: () => ({
    meta: [
      { title: "HRM Executive Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, workforce analytics, payroll, and talent retention for HRM Management.",
      },
    ],
  }),
  component: HrmManagementReportPage,
});

function HrmManagementReportPage() {
  return (
    <AppShell
      title="HRM Executive Report"
      breadcrumb="Management > HRM > Report"
      description="Consolidated workforce intelligence report, headcount growth, payroll distribution, and employee retention."
      tabs={<HrmManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="hrm-management" />
    </AppShell>
  );
}
