import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ProductDevelopmentTabBar } from "@/components/erp/ProductDevelopmentTabBar";
import { WidgetPage } from "@/widgets/components/WidgetPage";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/development/product-development/overview")({
  head: () => ({
    meta: [
      { title: "Product Development Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated product engineering intelligence — multi-stage pipeline, design baselines, release gates, and digital thread tracking.",
      },
    ],
  }),
  component: ProductDevelopmentOverview,
});

/**
 * Product Development Overview is a full widget surface. Its KPI cards,
 * design-to-release pipeline funnel, milestones trend, top active projects,
 * and AI engineering intelligence are fully customizable with drag-and-drop.
 */
function ProductDevelopmentOverview() {
  return (
    <AppShell
      title="Product Development"
      breadcrumb="Development > Product Development"
      description="Consolidated product engineering intelligence — multi-stage pipeline, design baselines, release gates, and digital thread tracking."
      tabs={<ProductDevelopmentTabBar />}
    >
      <WidgetPage pageId="pd-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <div className="grid gap-6">
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
      <div className="grid gap-6">
        <Skeleton className="h-[200px] rounded-xl" />
      </div>
    </div>
  );
}
