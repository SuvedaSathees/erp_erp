import { createFileRoute } from "@tanstack/react-router";
import { PfmeaDevelopmentPage } from "@/pages/development.research-innovation.pfmea-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/pfmea-development/new",
)({
  component: PfmeaDevelopmentPage,
});
