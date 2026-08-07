import { createFileRoute } from "@tanstack/react-router";
import { PilotProductionListPage } from "@/routes/manufacturing-development.pilot-production.index";
import { InnovationAreaTabs } from "@/components/erp/ResearchInnovationTabBar";

export const Route = createFileRoute(
  "/development/research-innovation/pilot-production/",
)({
  component: () => (
    <PilotProductionListPage
      breadcrumb="Research & Innovation Development"
      tabs={<InnovationAreaTabs />}
    />
  ),
});
