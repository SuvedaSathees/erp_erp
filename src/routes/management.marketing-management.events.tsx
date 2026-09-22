import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";

export const Route = createFileRoute("/management/marketing-management/events")({
  head: () => ({
    meta: [
      { title: "Events Management · Marketing Management · Magnertia ERP" },
      { name: "description", content: "Trade shows, industry summits, webinars, and partner conferences." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Events Management"
      breadcrumb="Management > Marketing Management > Events"
      description="Trade show booth logistics, webinar registrations, conferences, delegate tracking, and event ROI."
      tabs={<MarketingManagementTabBar />}
    />
  ),
});
