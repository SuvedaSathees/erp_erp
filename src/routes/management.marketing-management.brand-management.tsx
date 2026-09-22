import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";

export const Route = createFileRoute("/management/marketing-management/brand-management")({
  head: () => ({
    meta: [
      { title: "Brand Management · Marketing Management · Magnertia ERP" },
      { name: "description", content: "Corporate brand guidelines, media kits, press releases, and tone of voice governance." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Brand Management"
      breadcrumb="Management > Marketing Management > Brand Management"
      description="Brand identity standards, visual design system assets, trademarks, public relations, and corporate messaging."
      tabs={<MarketingManagementTabBar />}
    />
  ),
});
