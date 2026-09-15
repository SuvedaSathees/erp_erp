import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { SalesManagementTabBar } from "@/components/erp/SalesManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/sales-management/overview")({
  head: () => ({
    meta: [
      { title: "Sales Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive sales management dashboard, revenue pipeline, orders, channel distribution, pricing, and AI commercial intelligence.",
      },
    ],
  }),
  component: SalesOverview,
});

/**
 * Sales Management Overview is a full widget surface, identical to Finance Overview,
 * Asset Overview, and CRM Overview. Its 9 KPI cards, submodules hub, revenue trend,
 * product donut, pipeline funnel, territory performance, recent orders, health scorecard,
 * and AI commercial intelligence are fully customizable via the unified Widget system.
 */
function SalesOverview() {
  return (
    <AppShell
      title="Sales Overview"
      breadcrumb="Management"
      description="Executive commercial intelligence, revenue pipeline, order booking, channel distribution, and performance tracking."
      tabs={<SalesManagementTabBar />}
    >
      <WidgetPage pageId="sales-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[120px] rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl" />
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
      </div>
    </div>
  );
}

export default SalesOverview;
