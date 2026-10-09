import { createFileRoute } from "@tanstack/react-router";
import { AiModelDevelopmentNewPage } from "@/pages/development.research-innovation.ai-model-development.new";

export const Route = createFileRoute(
  "/development/research-innovation/ai-model-development/new",
)({
  head: () => ({
    meta: [{ title: "EV Demand Forecasting Model · Magnertia ERP" }],
  }),
  component: AiModelDevelopmentNewPage,
});
