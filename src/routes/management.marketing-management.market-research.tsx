import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";

export const Route = createFileRoute("/management/marketing-management/market-research")({
  head: () => ({
    meta: [
      { title: "Market Research · Marketing Management · Magnertia ERP" },
      { name: "description", content: "Industry studies, TAM analysis, customer behavior, and competitive positioning." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Market Research"
      breadcrumb="Management > Marketing Management > Market Research"
      description="Competitive intelligence, total addressable market studies, buyer sentiment, and industry reports."
      tabs={<MarketingManagementTabBar />}
    />
  ),
});
