import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { SustainabilityManagementTabBar } from "@/components/erp/SustainabilityManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/sustainability-management/overview")({
  head: () => ({
    meta: [
      { title: "Sustainability Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "High-level ESG intelligence, corporate GHG emissions, power meter grids, campus water balances and circular waste metrics.",
      },
    ],
  }),
  component: SustainabilityOverviewPage,
});

/**
 * Sustainability Overview is a full widget surface, matching Finance Overview,
 * Knowledge Overview and Communication Overview. Its 10 KPI cards, Decarbonization
 * & Clean Energy Transition trend chart, Sustainability Health Summary, Facility Matrix,
 * Compliance Permits, AI Decarbonization Copilot, and ESG Initiatives Ledger
 * are fully customizable via the unified Widget system.
 */
function SustainabilityOverviewPage() {
  return (
    <AppShell
      title="Sustainability Overview"
      breadcrumb="Management > Sustainability Management > Overview"
      description="High-level ESG intelligence, corporate GHG emissions, power meter grids, campus water balances and circular waste metrics."
      tabs={<SustainabilityManagementTabBar />}
    >
      <WidgetPage pageId="sustainability-overview" skeleton={<OverviewSkeleton />} />
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
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl" />
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <Skeleton className="h-[220px] rounded-xl" />
    </div>
  );
}

