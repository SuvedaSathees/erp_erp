import { createFileRoute } from "@tanstack/react-router";
import { PilotProductionListPage } from "@/pages/manufacturing-development.pilot-production.index";

export const Route = createFileRoute("/manufacturing-development/pilot-production/")({
  head: () => ({
    meta: [{ title: "Pilot Production · Magnertia ERP" }],
  }),
  component: PilotProductionListPage,
});
