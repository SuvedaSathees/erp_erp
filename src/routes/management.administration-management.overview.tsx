import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { AdminManagementTabBar } from "@/components/erp/AdminManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/administration-management/overview")({
  head: () => ({
    meta: [
      { title: "Organization Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Organization & Governance Overview — branches, departments, RBAC security, approval workflows, controlled documents, policies and master data telemetry.",
      },
    ],
  }),
  component: AdminManagementOverview,
});

/**
 * Organization Overview is a widget surface matching the Finance Overview architecture.
 * Its KPI cards, branch facility matrix, approval workflow SLA pipeline, document lifecycle,
 * and AI governance intelligence live in src/widgets/content/admin/ and are placed by
 * DEFAULT_LAYOUTS["admin-overview"]. Users can customize it with drag-and-drop and the widget library.
 */
function AdminManagementOverview() {
  return (
    <AppShell
      title="Organization Overview"
      breadcrumb="Management"
      description="Central enterprise organization, multi-branch operations, RBAC access control, approval matrix SLA, and policy compliance governance."
      tabs={<AdminManagementTabBar />}
    >
      <WidgetPage pageId="admin-overview" skeleton={<OverviewSkeleton />} />
    </AppShell>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[350px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[350px] rounded-xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-[320px] rounded-xl lg:col-span-2" />
        <Skeleton className="h-[320px] rounded-xl" />
      </div>
    </div>
  );
}
