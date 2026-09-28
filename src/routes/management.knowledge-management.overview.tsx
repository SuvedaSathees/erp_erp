import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { KnowledgeManagementTabBar } from "@/components/erp/KnowledgeManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/knowledge-management/overview")({
  head: () => ({
    meta: [
      { title: "Knowledge Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "High-level organizational intelligence, aggregate knowledge repositories, SOP compliance and learning metrics.",
      },
    ],
  }),
  component: KnowledgeOverview,
});

/**
 * Knowledge Overview is now a full widget surface, matching Finance Overview
 * and Asset Management Overview. Its 10 KPI cards, growth & utilization trend chart,
 * health summary, operations ledger, compliance alerts and AI intelligence center
 * are fully customizable via the unified Widget system.
 */
function KnowledgeOverview() {
  return (
    <AppShell
      title="Knowledge Overview"
      breadcrumb="Management > Knowledge Overview"
      description="High-level organizational intelligence, aggregate knowledge repositories, SOP compliance and learning metrics."
      tabs={<KnowledgeManagementTabBar />}
    >
      <WidgetPage pageId="knowledge-overview" skeleton={<OverviewSkeleton />} />
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
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <Skeleton className="h-[220px] rounded-xl" />
    </div>
  );
}

export default KnowledgeOverview;
