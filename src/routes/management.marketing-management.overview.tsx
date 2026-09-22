import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/marketing-management/overview")({
  head: () => ({
    meta: [
      { title: "Marketing Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive marketing management dashboard, campaign funnel, channel performance, lead generation, and AI marketing intelligence.",
      },
    ],
  }),
  component: MarketingOverview,
});

/**
 * Marketing Management Overview is a full widget surface, identical to Sales Overview,
 * Finance Overview, and CRM Overview. Its 10 KPI cards, 10 submodules hub, campaign funnel,
 * channel performance matrix, leads distribution, budget controls, and AI marketing
 * intelligence are fully customizable via the unified Widget system.
 */
function MarketingOverview() {
  return (
    <AppShell
      title="Marketing Overview"
      breadcrumb="Management"
      description="Executive marketing intelligence, campaigns funnel, lead acquisition, channel performance, and ROI tracking."
      tabs={<MarketingManagementTabBar />}
    >
      <WidgetPage pageId="marketing-overview" skeleton={<OverviewSkeleton />} />
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

export default MarketingOverview;
