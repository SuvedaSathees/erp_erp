import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { CommunicationTabBar } from "@/components/erp/CommunicationManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/communication-management/overview")({
  head: () => ({
    meta: [
      { title: "Communication Overview · Magnertia ERP" },
      {
        name: "description",
        content: "Connect. Communicate. Collaborate. Controlled Enterprise Communication & Audit Layer.",
      },
    ],
  }),
  component: CommunicationOverviewPage,
});

/**
 * Communication Overview is now a full widget surface, matching Finance and Knowledge Overviews.
 * Its 6 KPI cards, volume trend area chart, domain distribution donut chart,
 * AI communication assistant, department SLA performance bar chart, and operations audit ledger
 * are fully customizable, draggable, resizable, and configurable via the unified Widget system.
 */
function CommunicationOverviewPage() {
  return (
    <AppShell
      title="Communication Overview"
      breadcrumb="Management > Communication Management > Overview"
      description="Connect. Communicate. Collaborate. Controlled Enterprise Communication & Audit Layer."
      tabs={<CommunicationTabBar />}
    >
      <WidgetPage pageId="communication-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
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
      <Skeleton className="h-[300px] rounded-xl" />
    </div>
  );
}

