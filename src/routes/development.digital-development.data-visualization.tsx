import { createFileRoute, redirect } from "@tanstack/react-router";
export { DataVisualizationPage } from "@/pages/development.digital-development.data-visualization";

export const Route = createFileRoute(
  "/development/digital-development/data-visualization"
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/business-development/overview",
      replace: true,
    });
  },
});
