import { createFileRoute, redirect } from "@tanstack/react-router";
export { PredictiveAnalyticsPage } from "@/pages/development.digital-development.predictive-analytics";

export const Route = createFileRoute(
  "/development/digital-development/predictive-analytics"
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/business-development/overview",
      replace: true,
    });
  },
});
