import { createFileRoute } from "@tanstack/react-router";
import { AiInsightsPage } from "@/routes/development.digital-development.ai-insights";

export const Route = createFileRoute(
  "/management/business-intelligence/ai-insights"
)({
  head: () => ({
    meta: [
      { title: "AI Insights · Magnertia ERP" },
      {
        name: "description",
        content:
          "Convert ERP and telemetry data into AI-generated observations, explainable root-causes, anomaly detection, predictive recommendations, and action tracking.",
      },
    ],
  }),
  component: AiInsightsPage,
});
