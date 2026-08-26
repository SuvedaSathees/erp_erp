import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { HrmManagementTabBar } from "@/components/erp/HrmManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/hrm-management/overview")({
  head: () => ({
    meta: [
      { title: "HRM Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Human Resource Management Overview — workforce planning, recruitment, payroll, performance, and talent development intelligence.",
      },
    ],
  }),
  component: HrmOverview,
});

/**
 * HRM Overview is a widget surface. Its KPI cards, recruitment pipeline,
 * department headcount breakdown, payroll outlays, and workforce AI
 * intelligence are fully customizable with drag-and-drop and KPI pin keys.
 */
export function HrmOverview() {
  return (
    <AppShell
      title="HRM Overview"
      breadcrumb="Management"
      description="Central human resource intelligence, workforce planning, recruitment pipeline, payroll outlay, and employee lifecycle metrics."
      tabs={<HrmManagementTabBar />}
    >
      <WidgetPage pageId="hrm-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

export default HrmOverview;

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
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
