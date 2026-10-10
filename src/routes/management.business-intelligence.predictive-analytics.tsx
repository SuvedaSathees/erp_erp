import { createFileRoute } from "@tanstack/react-router";
import { PredictiveAnalyticsPage } from "@/pages/management.business-intelligence.predictive-analytics";

export const Route = createFileRoute(
  "/management/business-intelligence/predictive-analytics"
)({
  head: () => ({
    meta: [
      { title: "Predictive Analytics · Magnertia ERP" },
      {
        name: "description",
        content:
          "Turn enterprise data into high-accuracy machine learning predictions, forecast demand, detect anomalies, monitor model drift, and automate decisions.",
      },
    ],
  }),
  component: PredictiveAnalyticsPage,
});
