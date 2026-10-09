import { createFileRoute } from "@tanstack/react-router";
import { SimulationAnalysisNewPage } from "@/pages/development.research-innovation.simulation-analysis.new";

export const Route = createFileRoute(
  "/development/research-innovation/simulation-analysis/new",
)({
  head: () => ({
    meta: [{ title: "Simulation & Analysis · Magnertia ERP" }],
  }),
  component: SimulationAnalysisNewPage,
});
