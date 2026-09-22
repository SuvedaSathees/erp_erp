import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ResearchInnovationTabBar } from "@/components/erp/ResearchInnovationTabBar";
import { WidgetPage } from "@/widgets/components/WidgetPage";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/development/research-innovation/overview")({
  head: () => ({
    meta: [
      { title: "Research & Innovation Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated engineering, industrialization, quality, and digital innovation intelligence across all 27 submodules.",
      },
    ],
  }),
  component: ResearchInnovationOverview,
});

/**
 * Research & Innovation Overview is now a full widget surface, identical in
 * architecture and design to Finance Overview and Business Development Overview.
 * Its 9 KPI stat cards, Innovation Velocity Trend, Stage-Gate Funnel, Tech Allocation Mix,
 * Prototype & CAE Area Curve, 5-tab Operations Ledger, R&D Alerts & Forecast,
 * AI Innovation Intelligence Center, and the 27 Submodules Directory Hub are
 * fully modular and customizable with drag-and-drop.
 */
function ResearchInnovationOverview() {
  return (
    <AppShell
      title="Research & Innovation Overview"
      breadcrumb="Development > Research & Innovation"
      description="Consolidated innovation governance — 27 active engineering, industrialization, quality, and digital pipelines."
      tabs={<ResearchInnovationTabBar />}
    >
      <WidgetPage pageId="ri-overview" skeleton={<OverviewSkeleton />} />
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

