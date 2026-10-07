import { createFileRoute } from "@tanstack/react-router";
import { RoutingDevelopmentPage } from "@/pages/development.research-innovation.routing-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/routing-development/new",
)({
  component: RoutingDevelopmentPage,
});
