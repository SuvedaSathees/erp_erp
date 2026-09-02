import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/development/research-innovation/opportunity-discovery/")({
  beforeLoad: () => {
    throw redirect({ to: "/development/research-innovation/overview" });
  },
});
