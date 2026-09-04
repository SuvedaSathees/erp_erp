import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ManufacturingDevelopmentTabBar } from "@/components/erp/ManufacturingDevelopmentTabBar";
import { WidgetPage } from "@/widgets/components/WidgetPage";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/development/manufacturing-development/overview")({
  head: () => ({
    meta: [
      { title: "Manufacturing Development Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated manufacturing intelligence — APQP timing, process engineering, pilot builds, PPAP readiness, and mass production ramp.",
      },
    ],
  }),
  component: ManufacturingDevelopmentOverview,
});

/**
 * Manufacturing Development Overview is now a full widget surface, identical in
 * architecture and design to Finance Overview and Business Development Overview.
 * Its 9 KPI stat cards, Composed Production Trend, APQP Funnel, Tooling Status Mix,
 * Ramp Velocity Area Curve, 5-tab Operations Ledger, Shop-Floor Alerts & Forecast,
 * AI Smart Factory Intelligence Center, and the 18 Submodules Directory Hub are
 * fully modular and customizable with drag-and-drop.
 */
function ManufacturingDevelopmentOverview() {
  return (
    <AppShell
      title="Manufacturing Development Overview"
      breadcrumb="Development > Manufacturing Development"
      description="Govern end-to-end industrialization: APQP quality gates, tooling, fixtures, shop-floor SOPs, PFMEA, PPAP validation, and Industry 4.0 smart factory readiness."
      tabs={<ManufacturingDevelopmentTabBar />}
    >
      <WidgetPage pageId="md-overview" skeleton={<OverviewSkeleton />} />
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

      {/* Row 3: Mix (1 of 3) + Curve (2 of 3) */}
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

export default ManufacturingDevelopmentOverview;
