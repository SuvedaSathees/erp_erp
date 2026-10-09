import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { SupplyChainManagementTabBar } from "@/components/erp/SupplyChainManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/supply-chain-management/overview")({
  head: () => ({
    meta: [
      { title: "Supply Chain Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive supply chain dashboard, demand forecasting accuracy, consensus planning, multi-echelon replenishment, and AI inventory optimization.",
      },
    ],
  }),
  component: SupplyChainManagementOverview,
});

/**
 * Supply Chain Overview is a full widget surface powered by the unified Widget system.
 * Its KPI cards, forecast vs actual charts, accuracy donut, demand drivers, and S&OP
 * consensus pipeline are customizable by planners, operations, and leadership.
 */
function SupplyChainManagementOverview() {
  return (
    <AppShell
      title="Supply Chain Overview"
      breadcrumb="Management"
      description="Enterprise supply chain control tower, demand forecasting accuracy, S&OP consensus planning, and material fulfillment intelligence."
      tabs={<SupplyChainManagementTabBar />}
    >
      <WidgetPage pageId="supply-chain-overview" skeleton={<OverviewSkeleton />} />
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

