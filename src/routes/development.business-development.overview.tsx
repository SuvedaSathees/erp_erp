import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessDevelopmentTabBar } from "@/components/erp/BusinessDevelopmentTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/development/business-development/overview")({
  head: () => ({
    meta: [
      { title: "Business Development Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive business development dashboard, deal pipeline velocity, strategic partnerships, revenue modeling, and AI growth intelligence.",
      },
    ],
  }),
  component: BusinessDevelopmentOverview,
});

/**
 * Business Development Overview is now a full widget surface, identical in
 * architecture and design to Finance Overview and Asset Management Overview.
 * Its 9 KPI stat cards, Composed Pipeline Trend, Commercial Deal Funnel,
 * Partner Channel Mix, Revenue Area Scaling Curve, 5-tab Operations Ledger,
 * Market Growth Alerts & Forecast, AI Growth Intelligence Center, and the 22
 * Submodules Directory Hub are fully modular and customizable with drag-and-drop.
 */
function BusinessDevelopmentOverview() {
  return (
    <AppShell
      title="Business Development Overview"
      breadcrumb="Development > Business Development"
      description="Executive pipeline intelligence — market research, strategic partnerships, deal velocity, RFPs, revenue modeling, and regional expansion."
      tabs={<BusinessDevelopmentTabBar />}
    >
      <WidgetPage pageId="bd-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* 9 KPI Cards Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>

      {/* Row 2: Trend (2 of 3) + Funnel (1 of 3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>

      {/* Row 3: Partner Mix (1 of 3) + Revenue Curve (2 of 3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl" />
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
      </div>

      {/* Row 4: Operations Ledger (2 of 3) + Alerts (1 of 3) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>

      {/* Row 5: AI Center */}
      <div className="grid gap-6">
        <Skeleton className="h-[220px] rounded-xl" />
      </div>
    </div>
  );
}

export default BusinessDevelopmentOverview;
