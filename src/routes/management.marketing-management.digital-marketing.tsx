import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";

export const Route = createFileRoute("/management/marketing-management/digital-marketing")({
  head: () => ({
    meta: [
      { title: "Digital Marketing · Marketing Management · Magnertia ERP" },
      { name: "description", content: "Paid search, social advertising, SEO, web conversion, and email nurture workflows." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Digital Marketing"
      breadcrumb="Management > Marketing Management > Digital Marketing"
      description="Google Ads, LinkedIn campaign orchestration, email marketing automation, SEO, and paid media management."
      tabs={<MarketingManagementTabBar />}
    />
  ),
});
