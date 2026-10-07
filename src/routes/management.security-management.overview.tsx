import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/erp/AppShell";
import { SecurityManagementTabBar } from "@/components/erp/SecurityManagementTabBar";
import { Skeleton } from "@/components/ui/skeleton";
import { WidgetPage } from "@/widgets/components/WidgetPage";

export const Route = createFileRoute("/management/security-management/overview")({
  head: () => ({
    meta: [
      { title: "Security Management Overview · Magnertia ERP" },
      {
        name: "description",
        content:
          "Enterprise cybersecurity, identity governance, access control, information classification, and physical facility security command center.",
      },
    ],
  }),
  component: SecurityOverviewPage,
});

/**
 * Security Management Overview is a full widget surface, matching Sustainability Overview,
 * Finance Overview, Knowledge Overview and Communication Overview.
 * Its 10 KPI cards, Threat Trend chart, Incident Breakdown, Facilities Matrix,
 * Risk Heatmap, Compliance Frameworks and AI Security Intelligence are fully customizable.
 */
function SecurityOverviewPage() {
  return (
    <AppShell
      title="Security Overview"
      breadcrumb="Management > Security Management > Overview"
      description="Enterprise cybersecurity, digital identity governance, granular access control, information protection, and physical facility security command center."
      tabs={<SecurityManagementTabBar />}
    >
      <WidgetPage pageId="security-overview" skeleton={<OverviewSkeleton />} />
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
      <Skeleton className="h-[240px] rounded-xl" />
    </div>
  );
}
