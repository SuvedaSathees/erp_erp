import { createFileRoute } from "@tanstack/react-router";
import { ControlPlanDevelopmentPage } from "@/pages/development.research-innovation.control-plan.new";

export const Route = createFileRoute(
  "/development/research-innovation/control-plan/new",
)({
  component: ControlPlanDevelopmentPage,
});
