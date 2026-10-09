import { createFileRoute } from "@tanstack/react-router";
import { LeadGenerationPage } from "@/pages/management.marketing-management.leads-management";

export const Route = createFileRoute(
  "/management/marketing-management/leads-management"
)({
  head: () => ({
    meta: [
      { title: "Lead Generation · Marketing Management · Magnertia ERP" },
      {
        name: "description",
        content:
          "Lead Generation Form (MAICW Classification) for omnichannel prospect capture, MQL scoring, SLA routing, sales handoff, and revenue attribution.",
      },
    ],
  }),
  component: LeadGenerationPage,
});
