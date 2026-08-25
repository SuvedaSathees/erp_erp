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
 * Manufacturing Development Overview is a full widget surface. Its KPI cards,
 * APQP-to-mass-production funnel, yield trend, industrialization projects,
 * and AI manufacturing intelligence are fully customizable with drag-and-drop.
 */
function ManufacturingDevelopmentOverview() {
  return (
    <AppShell
      title="Manufacturing Development"
      breadcrumb="Development > Manufacturing Development"
      description="Consolidated manufacturing intelligence — APQP timing, process engineering, pilot builds, PPAP readiness, and mass production ramp."
      tabs={<ManufacturingDevelopmentTabBar />}
    >
      <WidgetPage pageId="md-overview" skeleton={<OverviewSkeleton />} />
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
