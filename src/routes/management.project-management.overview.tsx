import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProjectManagementTabBar } from "@/components/erp/ProjectManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/project-management/overview")({
  head: () => ({
    meta: [
      { title: "Project Management Overview · Magnertia ERP" },
      {
        name: "description",
        content: "Executive project dashboard, portfolio milestones, and execution intelligence center.",
      },
    ],
  }),
  component: ProjectManagementOverviewPage,
});

/**
 * Project Management Overview is a dynamic widget surface.
 * Its KPI cards, charts, risk registers, milestones, and AI planning insights
 * are driven by the ERP widget management system with drag-and-drop customization.
 */
export function ProjectManagementOverviewPage() {
  return (
    <AppShell
      title="Project Management Overview"
      breadcrumb="Management > Project Management > Overview"
      description="Portfolio execution status, critical path tracking, budget utilization, and AI schedule intelligence."
      tabs={<ProjectManagementTabBar />}
    >
      <WidgetPage pageId="pm-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

export default ProjectManagementOverviewPage;

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[320px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>
    </div>
  );
}
