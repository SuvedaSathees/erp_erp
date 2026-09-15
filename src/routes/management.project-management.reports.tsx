import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { ModuleSummaryReport } from "@/components/erp/reports/ModuleSummaryReport";

export const Route = createFileRoute("/management/project-management/reports")({
  head: () => ({
    meta: [
      { title: "Project Portfolio Report · Magnertia ERP" },
      {
        name: "description",
        content: "Executive summary report, project portfolio milestones, budget variance, and resource utilization.",
      },
    ],
  }),
  component: ProjectManagementReportPage,
});

function ProjectManagementReportPage() {
  return (
    <AppShell
      title="Project Portfolio Report"
      breadcrumb="Management > Project > Report"
      description="Consolidated project portfolio report, milestone adherence, budget variance, and resource capacity."
      tabs={<ProjectManagementTabBar />}
    >
      <ModuleSummaryReport moduleId="project-management" />
    </AppShell>
  );
}
