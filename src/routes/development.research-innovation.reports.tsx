import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/development/research-innovation/reports")({
  beforeLoad: () => {
    throw redirect({ to: "/development/research-innovation/overview" });
  },
  component: () => null,
});

