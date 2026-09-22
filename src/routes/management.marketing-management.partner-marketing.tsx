import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";

export const Route = createFileRoute("/management/marketing-management/partner-marketing")({
  head: () => ({
    meta: [
      { title: "Partner Marketing · Marketing Management · Magnertia ERP" },
      { name: "description", content: "Co-marketing funds, distributor enablement kits, and channel campaigns." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Partner Marketing"
      breadcrumb="Management > Marketing Management > Partner Marketing"
      description="Co-op marketing programs, distributor collateral kits, partner portal assets, and channel enablement."
      tabs={<MarketingManagementTabBar />}
    />
  ),
});
