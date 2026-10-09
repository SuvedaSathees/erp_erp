import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { ComplianceTabBar } from "@/components/erp/ComplianceTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/risk-management/compliance-overview")({
  head: () => ({
    meta: [
      { title: "Compliance Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Executive compliance dashboard, statutory obligations, ISO readiness, license tracker, and continuous AI regulatory intelligence.",
      },
    ],
  }),
  component: ComplianceOverviewPage,
});

/**
 * Compliance Overview is a full widget surface with drag-and-drop customization,
 * just like Finance Overview and Risk Management Overview.
 */
function ComplianceOverviewPage() {
  return (
    <AppShell
      title="Compliance Overview"
      breadcrumb="Management > Compliance"
      description="Executive regulatory intelligence, statutory obligation adherence, ISO certification readiness, and statutory filings."
      tabs={<ComplianceTabBar />}
      hideScoreBanner={true}
    >
      <WidgetPage pageId="compliance-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}


function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[280px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[280px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[280px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[280px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[260px] rounded-xl" />
        <Skeleton className="h-[260px] rounded-xl" />
      </div>
    </div>
  );
}
