import { createFileRoute } from "@tanstack/react-router";
import { ComingSoon } from "@/components/erp/ComingSoon";
import { MarketingManagementTabBar } from "@/components/erp/MarketingManagementTabBar";

export const Route = createFileRoute("/management/marketing-management/leads-management")({
  head: () => ({
    meta: [
      { title: "Leads Management · Marketing Management · Magnertia ERP" },
      { name: "description", content: "Lead capture, MQL scoring, SLA qualification, and CRM opportunity routing." },
    ],
  }),
  component: () => (
    <ComingSoon
      title="Leads Management"
      breadcrumb="Management > Marketing Management > Leads Management"
      description="Omnichannel lead capture, scoring models, qualification stages, SLA tracking, and sales routing."
      tabs={<MarketingManagementTabBar />}
    />
  ),
});
