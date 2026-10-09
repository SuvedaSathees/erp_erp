import { createFileRoute, redirect } from "@tanstack/react-router";
export { AiInsightsPage } from "@/pages/development.digital-development.ai-insights";

export const Route = createFileRoute(
  "/development/digital-development/ai-insights"
)({
  beforeLoad: () => {
    throw redirect({
      to: "/development/business-development/overview",
      replace: true,
    });
  },
});
