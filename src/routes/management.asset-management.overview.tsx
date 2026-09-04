import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AssetManagementTabBar } from "@/components/erp/AssetManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/asset-management/overview")({
  head: () => ({
    meta: [
      { title: "Asset Management Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive asset management dashboard, portfolio valuation, equipment fleet, depreciation schedules, and AI capital intelligence.",
      },
    ],
  }),
  component: AssetManagementOverview,
});

/**
 * Asset Management Overview is a full widget surface, identical to Finance Overview
 * and CRM Overview. Its KPI cards, capital horizon charts, operations ledger,
 * alerts and AI intelligence center are fully customizable via the unified Widget system.
 */
function AssetManagementOverview() {
  return (
    <AppShell
      title="Asset Management Overview"
      breadcrumb="Management"
      description="Executive asset intelligence, capitalization, equipment fleet, depreciation schedules, and maintenance operations."
      tabs={<AssetManagementTabBar />}
    >
      <WidgetPage pageId="asset-overview" skeleton={<OverviewSkeleton />} />
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
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
    </div>
  );
}

export default AssetManagementOverview;
