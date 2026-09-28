import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";

export const Route = createFileRoute("/management/marketing-management/marketing-plans")({
  head: () => ({
    meta: [
      { title: "Marketing Plans · Marketing Management · Magnertia ERP" },
      { name: "description", content: "Annual and quarterly strategic marketing plans and program calendars." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Marketing Plans"
      breadcrumb="Management > Marketing Management > Marketing Plans"
      description="Strategic annual and quarterly marketing plan frameworks, program budgets, and timeline roadmap."
      tabs={<MarketingManagementTabBar />}
    />
  ),
});
