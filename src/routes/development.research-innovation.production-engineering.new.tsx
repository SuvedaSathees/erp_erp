import { createFileRoute } from "@tanstack/react-router";
import { ProductionEngineeringNewPage } from "@/pages/development.research-innovation.production-engineering.new";

export const Route = createFileRoute(
  "/development/research-innovation/production-engineering/new",
)({
  head: () => ({
    meta: [{ title: "Production Engineering · Magnertia ERP" }],
  }),
  component: ProductionEngineeringNewPage,
});
