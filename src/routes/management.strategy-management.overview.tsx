import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { StrategyManagementTabBar } from "@/components/erp/StrategyManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/strategy-management/overview")({
  head: () => ({
    meta: [
      { title: "Strategy Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise strategy management command center, corporate purpose & vision alignment, OKR cycles, balanced scorecards, and strategic initiatives.",
      },
    ],
  }),
  component: StrategyOverviewPage,
});

function StrategyOverviewPage() {
  return (
    <AppShell
      title="Strategy Overview"
      breadcrumb="Management > Strategy > Overview"
      description="Executive strategy command center, purpose-to-impact alignment, OKR execution velocity, balanced scorecards, and portfolio governance."
      tabs={<StrategyManagementTabBar />}
    >
      <WidgetPage pageId="strategy-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-[104px] rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-[200px] rounded-xl" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <Skeleton className="h-[220px] rounded-xl" />
    </div>
  );
}
