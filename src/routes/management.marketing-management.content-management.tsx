import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";

export const Route = createFileRoute("/management/marketing-management/content-management")({
  head: () => ({
    meta: [
      { title: "Content Management · Marketing Management · Magnertia ERP" },
      { name: "description", content: "Marketing content repository, creatives, brochures, banners, and copywriting assets." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Content Management"
      breadcrumb="Management > Marketing Management > Content Management"
      description="Omnichannel marketing creative assets, datasheets, landing page copy, videos, and brand collateral repository."
      tabs={<MarketingManagementTabBar />}
    />
  ),
});
