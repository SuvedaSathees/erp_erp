import { createFileRoute, redirect } from "@tanstack/react-router";

// Digital Development was folded into Business Intelligence; old links land on the same page there.
export const Route = createFileRoute("/development/digital-development/ai-insights")({
  beforeLoad: () => {
    throw redirect({ to: "/management/business-intelligence/ai-insights", replace: true });
  },
});
