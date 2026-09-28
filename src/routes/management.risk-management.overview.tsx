import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { RiskManagementTabBar } from "@/components/erp/RiskManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/risk-management/overview")({
  head: () => ({
    meta: [
      { title: "Risk Management Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive Enterprise Risk dashboard, heat map matrix, portfolio distributions, KRIs, and continuous AI risk intelligence.",
      },
    ],
  }),
  component: RiskManagementOverviewPage,
});

/**
 * Risk Management Overview is a full widget surface.
 * Top KPIs, risk details, statement, 5x5 heat map matrix, category distribution donut,
 * velocity trend lines, KRIs, top risks, treatment actions, and AI insights are
 * fully customizable with drag-and-drop.
 */
export function RiskManagementOverviewPage() {
  return (
    <AppShell
      title="Risk Management Overview"
      breadcrumb="Management > Risk Management"
      description="Executive enterprise risk intelligence, risk appetite adherence, heat map matrix, and key risk indicators."
      tabs={<RiskManagementTabBar />}
      hideScoreBanner={true}
    >
      <WidgetPage pageId="risk-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

export default RiskManagementOverviewPage;

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[280px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[260px] rounded-xl" />
        <Skeleton className="h-[260px] rounded-xl" />
        <Skeleton className="h-[260px] rounded-xl" />
      </div>
    </div>
  );
}
