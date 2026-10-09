import { createFileRoute } from "@tanstack/react-router";
import { ApqpQualityPlanningPage } from "@/pages/development.research-innovation.quality-planning-apqp.new";

export const Route = createFileRoute(
  "/development/research-innovation/quality-planning-apqp/new",
)({
  component: ApqpQualityPlanningPage,
});
