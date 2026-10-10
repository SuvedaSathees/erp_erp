import { createFileRoute } from "@tanstack/react-router";
import { DataVisualizationPage } from "@/pages/management.business-intelligence.data-visualization";

export const Route = createFileRoute(
  "/management/business-intelligence/data-visualization"
)({
  head: () => ({
    meta: [
      { title: "Data Visualization · Magnertia ERP" },
      {
        name: "description",
        content:
          "Create, explore, customize, and share interactive visualizations, KPI scorecards, telemetry heatmaps, and executive dashboards.",
      },
    ],
  }),
  component: DataVisualizationPage,
});
