import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CrmManagementTabBar } from "@/components/erp/CrmManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/crm-management/overview")({
  head: () => ({
    meta: [
      { title: "CRM Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive CRM dashboard, sales pipeline funnel, lead conversion metrics and customer lifecycle overview.",
      },
    ],
  }),
  component: CrmOverview,
});

/**
 * CRM Overview is a full widget surface. Its KPI cards, pipeline funnel,
 * revenue forecast, high-value opportunities, and AI revenue intelligence
 * are fully customizable with pin keys and drag-and-drop.
 */
function CrmOverview() {
  return (
    <AppShell
      title="CRM Overview"
      breadcrumb="Management"
      description="Central customer intelligence, sales pipeline funnel, lead conversion metrics and customer lifecycle overview."
      tabs={<CrmManagementTabBar />}
    >
      <WidgetPage pageId="crm-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

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
