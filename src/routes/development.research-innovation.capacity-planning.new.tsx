import { createFileRoute } from "@tanstack/react-router";
import { CapacityPlanningNewPage } from "@/pages/development.research-innovation.capacity-planning.new";

export const Route = createFileRoute(
  "/development/research-innovation/capacity-planning/new",
)({
  component: CapacityPlanningNewPage,
});
