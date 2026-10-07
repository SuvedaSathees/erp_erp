import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { BusinessIntelligenceTabBar } from "@/components/erp/BusinessIntelligenceTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/business-intelligence/overview")({
  head: () => ({
    meta: [
      { title: "Business Intelligence Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Consolidated enterprise strategic KPIs, executive analytics, real-time performance indicators, and cross-functional decision intelligence.",
      },
    ],
  }),
  component: BiOverviewPage,
});

/**
 * Business Intelligence Overview is a full widget surface, customizable with
 * Strategic KPI cards, Revenue & Profit Trend, Sales Pipeline Funnel, Manufacturing,
 * SCM, Projects, Risk Heatmap, Management Actions, and AI Intelligence widgets.
 */
function BiOverviewPage() {
  return (
    <AppShell
      title="Business Intelligence Overview"
      breadcrumb="Management > Business Intelligence Management > Overview"
      description="Enterprise performance consolidation, strategic KPIs, predictive analytics, and corporate decision-support command center."
      tabs={<BusinessIntelligenceTabBar />}
    >
      <WidgetPage pageId="bi-overview" skeleton={<OverviewSkeleton />} />
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
