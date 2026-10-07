import { createFileRoute } from "@tanstack/react-router";
import { BomEngineeringPage } from "@/pages/development.research-innovation.bom-engineering.new";

export const Route = createFileRoute(
  "/development/research-innovation/bom-engineering/new",
)({
  component: BomEngineeringPage,
});
